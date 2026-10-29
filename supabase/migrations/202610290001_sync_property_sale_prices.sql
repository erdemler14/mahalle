-- Keep online property purchases and sales aligned with the marketValues saved by the game client.
-- Apply this migration in Supabase SQL Editor if migrations are not deployed automatically.
create or replace function public.claim_property(p_property_id integer)
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
begin
  if v_user is null then raise exception 'Giriş yapmalısın.'; end if;
  select * into v_property from public.world_properties where property_id = p_property_id for update;
  if not found then raise exception 'Mülk bulunamadı.'; end if;
  if v_property.owner_user_id is not null then raise exception 'Bu mülk artık satılık değil.'; end if;
  select * into v_save from public.player_saves where user_id = v_user for update;
  if not found then raise exception 'Oyuncu kaydı henüz hazır değil; tekrar dene.'; end if;
  v_cash := coalesce((v_save.state->>'cash')::numeric, 75);
  v_market := coalesce(nullif(v_save.state->'marketValues'->>p_property_id::text, '')::numeric, v_property.market_value);
  if v_cash < v_market then raise exception 'Bu mülk için yeterli sermayen yok.'; end if;
  select * into v_profile from public.player_profiles where user_id = v_user;
  update public.player_saves
    set state = jsonb_set(v_save.state, '{cash}', to_jsonb(round(v_cash - v_market, 2)), true),
        updated_at = now()
    where user_id = v_user;
  update public.world_properties
    set owner_user_id = v_user, owner_name = coalesce(v_profile.display_name, 'Mahalle sakini'),
        market_value = v_market, updated_at = now()
    where property_id = p_property_id;
  return jsonb_build_object('property_id', p_property_id, 'owner_user_id', v_user,
    'owner_name', coalesce(v_profile.display_name, 'Mahalle sakini'),
    'market_value', v_market, 'cash', round(v_cash - v_market, 2));
end;
$$;
revoke all on function public.claim_property(integer) from public, anon;
grant execute on function public.claim_property(integer) to authenticated;

create or replace function public.release_property(p_property_id integer)
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
  select * into v_property from public.world_properties where property_id = p_property_id for update;
  if not found or v_property.owner_user_id is distinct from v_user then
    raise exception 'Yalnızca sahibi olduğun mülkü satabilirsin.';
  end if;
  select * into v_save from public.player_saves where user_id = v_user for update;
  if not found then raise exception 'Oyuncu kaydı bulunamadı.'; end if;
  v_cash := coalesce((v_save.state->>'cash')::numeric, 75);
  v_market := coalesce(nullif(v_save.state->'marketValues'->>p_property_id::text, '')::numeric, v_property.market_value);
  v_sale := round(v_market * 0.95, 2);
  update public.player_saves
    set state = jsonb_set(v_save.state, '{cash}', to_jsonb(round(v_cash + v_sale, 2)), true),
        updated_at = now()
    where user_id = v_user;
  update public.world_properties
    set owner_user_id = null, owner_name = null, rented = false, market_value = v_market, updated_at = now()
    where property_id = p_property_id;
  return jsonb_build_object('property_id', p_property_id, 'market_value', v_market,
    'cash', round(v_cash + v_sale, 2), 'sale_price', v_sale);
end;
$$;
revoke all on function public.release_property(integer) from public, anon;
grant execute on function public.release_property(integer) to authenticated;
