-- Dedicated, unambiguous property purchase RPC.
-- Apply this migration in Supabase SQL Editor after deploying the frontend.
create or replace function public.purchase_property_v2(
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
  v_price numeric(14,2);
  v_after numeric(14,2);
begin
  if v_user is null then raise exception 'Oturum bulunamadı. Yeniden giriş yap.'; end if;
  if p_property_id is null or p_market_value is null or p_market_value <= 0 then
    raise exception 'Mülk numarası veya satış fiyatı geçersiz.';
  end if;
  if p_current_cash is null or p_current_cash < 0 then
    raise exception 'Oyuncu bakiyesi geçersiz.';
  end if;

  select * into v_property
  from public.world_properties
  where property_id = p_property_id
  for update;

  if not found then raise exception 'Mülk ortak şehir veritabanında bulunamadı (ID: %).', p_property_id; end if;
  if v_property.owner_user_id is not null then
    raise exception 'Bu mülk başka bir oyuncuya ait. Haritayı yenileyip tekrar kontrol et.';
  end if;

  select * into v_save
  from public.player_saves
  where user_id = v_user
  for update;

  if not found then raise exception 'Oyuncu kaydı bulunamadı. Oyuna yeniden giriş yap.'; end if;

  select * into v_profile
  from public.player_profiles
  where user_id = v_user;

  v_cash := round(p_current_cash, 2);
  v_price := round(p_market_value, 2);

  if v_cash < v_price then
    raise exception 'Bakiye yetersiz. Gerekli: ₺%, mevcut: ₺%.',
      to_char(v_price, 'FM999G999G999G990D00'),
      to_char(v_cash, 'FM999G999G999G990D00');
  end if;

  v_after := round(v_cash - v_price, 2);

  update public.player_saves
  set state = jsonb_set(coalesce(v_save.state, '{}'::jsonb), '{cash}', to_jsonb(v_after), true),
      updated_at = now()
  where user_id = v_user;

  update public.world_properties
  set owner_user_id = v_user,
      owner_name = coalesce(v_profile.display_name, 'Mahalle sakini'),
      market_value = v_price,
      rented = false,
      updated_at = now()
  where property_id = p_property_id;

  return jsonb_build_object(
    'property_id', p_property_id,
    'owner_user_id', v_user,
    'owner_name', coalesce(v_profile.display_name, 'Mahalle sakini'),
    'market_value', v_price,
    'cash_before', v_cash,
    'cash', v_after,
    'success', true
  );
end;
$$;

revoke all on function public.purchase_property_v2(integer, numeric, numeric) from public, anon;
grant execute on function public.purchase_property_v2(integer, numeric, numeric) to authenticated;
