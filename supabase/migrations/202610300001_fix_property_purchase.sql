-- Align shared-city property purchases with the live game balance and market value.
-- Apply this migration in the Supabase SQL Editor before testing shared-city purchases.

drop function if exists public.claim_property(integer);

create or replace function public.claim_property(
  p_property_id integer,
  p_market_value numeric,
  p_current_cash numeric
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_property public.world_properties%rowtype;
  v_save public.player_saves%rowtype;
  v_profile public.player_profiles%rowtype;
  v_cash numeric(14,2);
  v_market numeric(14,2);
  v_cash_after numeric(14,2);
begin
  if v_user is null then raise exception 'Giriş yapmalısın.'; end if;
  if p_market_value is null or p_market_value <= 0 then
    raise exception 'Geçerli piyasa değeri gönderilmedi.';
  end if;
  if p_current_cash is null or p_current_cash < 0 then
    raise exception 'Geçerli bakiye gönderilmedi.';
  end if;

  select * into v_property
    from public.world_properties
    where property_id = p_property_id
    for update;

  if not found then raise exception 'Mülk bulunamadı.'; end if;
  if v_property.owner_user_id is not null then
    raise exception 'Bu mülk artık satılık değil.';
  end if;

  select * into v_save
    from public.player_saves
    where user_id = v_user
    for update;

  if not found then raise exception 'Oyuncu kaydı henüz hazır değil; tekrar dene.'; end if;

  select * into v_profile
    from public.player_profiles
    where user_id = v_user;

  -- The client balance and market value are the values currently displayed in-game.
  -- Persist the resulting balance immediately so a later autosave cannot undo the purchase.
  v_cash := round(p_current_cash, 2);
  v_market := round(p_market_value, 2);

  if v_cash < v_market then
    raise exception 'Bu mülk için ₺% yeterli sermayen yok.', to_char(v_market, 'FM999G999G999G990D00');
  end if;

  v_cash_after := round(v_cash - v_market, 2);

  update public.player_saves
    set state = jsonb_set(v_save.state, '{cash}', to_jsonb(v_cash_after), true),
        updated_at = now()
    where user_id = v_user;

  update public.world_properties
    set owner_user_id = v_user,
        owner_name = coalesce(v_profile.display_name, 'Mahalle sakini'),
        market_value = v_market,
        rented = false,
        updated_at = now()
    where property_id = p_property_id;

  return jsonb_build_object(
    'property_id', p_property_id,
    'owner_user_id', v_user,
    'owner_name', coalesce(v_profile.display_name, 'Mahalle sakini'),
    'market_value', v_market,
    'cash_before', v_cash,
    'cash', v_cash_after
  );
end;
$$;

revoke all on function public.claim_property(integer, numeric, numeric) from public, anon;
grant execute on function public.claim_property(integer, numeric, numeric) to authenticated;
