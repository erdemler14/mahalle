-- Fix property sale price drift between the live game UI and the shared-city database.
-- Run this migration in the Supabase SQL Editor.
create or replace function public.release_property(p_property_id integer, p_market_value numeric)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_property public.world_properties%rowtype;
  v_save public.player_saves%rowtype;
  v_cash numeric(14,2);
  v_market numeric(14,2);
  v_sale numeric(14,2);
begin
  if v_user is null then raise exception 'Giriş yapmalısın.'; end if;
  if p_market_value is null or p_market_value <= 0 then
    raise exception 'Geçerli bir piyasa değeri gönderilmedi.';
  end if;

  select * into v_property
    from public.world_properties
    where property_id = p_property_id
    for update;

  if not found or v_property.owner_user_id is distinct from v_user then
    raise exception 'Yalnızca sahibi olduğun mülkü satabilirsin.';
  end if;

  select * into v_save
    from public.player_saves
    where user_id = v_user
    for update;

  if not found then raise exception 'Oyuncu kaydı bulunamadı.'; end if;

  -- Use the exact live market value displayed to the player, rather than a stale server copy.
  v_cash := coalesce((v_save.state->>'cash')::numeric, 75);
  v_market := round(p_market_value, 2);
  v_sale := round(v_market * 0.95, 2);

  update public.player_saves
    set state = jsonb_set(v_save.state, '{cash}', to_jsonb(round(v_cash + v_sale, 2)), true),
        updated_at = now()
    where user_id = v_user;

  update public.world_properties
    set owner_user_id = null,
        owner_name = null,
        rented = false,
        market_value = v_market,
        updated_at = now()
    where property_id = p_property_id;

  return jsonb_build_object(
    'property_id', p_property_id,
    'market_value', v_market,
    'cash', round(v_cash + v_sale, 2),
    'sale_price', v_sale
  );
end;
$$;

revoke all on function public.release_property(integer, numeric) from public, anon;
grant execute on function public.release_property(integer, numeric) to authenticated;
