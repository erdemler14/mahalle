-- Repair shared-city property transactions and grant a one-time launch bonus
-- to accounts that already had a player save when this migration is applied.
-- Run in Supabase SQL Editor after deploying the matching frontend.

-- Keep only the current three-argument transaction signatures. Older overloads
-- used stale server-side balances and could silently execute outdated pricing.
drop function if exists public.claim_property(integer);
drop function if exists public.claim_property(integer, numeric);
drop function if exists public.release_property(integer);
drop function if exists public.release_property(integer, numeric);

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
  if p_market_value is null or p_market_value <= 0 then raise exception 'Geçerli piyasa değeri gönderilmedi.'; end if;
  if p_current_cash is null or p_current_cash < 0 then raise exception 'Geçerli bakiye gönderilmedi.'; end if;

  select * into v_property from public.world_properties where property_id = p_property_id for update;
  if not found then raise exception 'Mülk bulunamadı.'; end if;
  if v_property.owner_user_id is not null then raise exception 'Bu mülk artık satılık değil.'; end if;

  select * into v_save from public.player_saves where user_id = v_user for update;
  if not found then raise exception 'Oyuncu kaydı henüz hazır değil; tekrar dene.'; end if;
  select * into v_profile from public.player_profiles where user_id = v_user;

  v_cash := round(p_current_cash, 2);
  v_market := round(p_market_value, 2);
  if v_cash < v_market then
    raise exception 'Bu mülk için ₺% yeterli sermayen yok.', to_char(v_market, 'FM999G999G999G990D00');
  end if;
  v_cash_after := round(v_cash - v_market, 2);

  update public.player_saves
    set state = jsonb_set(v_save.state, '{cash}', to_jsonb(v_cash_after), true), updated_at = now()
    where user_id = v_user;
  update public.world_properties
    set owner_user_id = v_user, owner_name = coalesce(v_profile.display_name, 'Mahalle sakini'),
        market_value = v_market, rented = false, updated_at = now()
    where property_id = p_property_id;

  return jsonb_build_object('property_id', p_property_id, 'owner_user_id', v_user,
    'owner_name', coalesce(v_profile.display_name, 'Mahalle sakini'),
    'market_value', v_market, 'cash_before', v_cash, 'cash', v_cash_after);
end;
$$;
revoke all on function public.claim_property(integer, numeric, numeric) from public, anon;
grant execute on function public.claim_property(integer, numeric, numeric) to authenticated;

create or replace function public.release_property(
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
  v_cash_before numeric(14,2);
  v_market numeric(14,2);
  v_sale numeric(14,2);
  v_cash_after numeric(14,2);
begin
  if v_user is null then raise exception 'Giriş yapmalısın.'; end if;
  if p_market_value is null or p_market_value <= 0 then raise exception 'Geçerli piyasa değeri gönderilmedi.'; end if;
  if p_current_cash is null or p_current_cash < 0 then raise exception 'Geçerli bakiye gönderilmedi.'; end if;

  select * into v_property from public.world_properties where property_id = p_property_id for update;
  if not found or v_property.owner_user_id is distinct from v_user then
    raise exception 'Yalnızca sahibi olduğun mülkü satabilirsin.';
  end if;
  select * into v_save from public.player_saves where user_id = v_user for update;
  if not found then raise exception 'Oyuncu kaydı bulunamadı.'; end if;

  v_cash_before := round(p_current_cash, 2);
  v_market := round(p_market_value, 2);
  v_sale := round(v_market * 0.95, 2);
  v_cash_after := round(v_cash_before + v_sale, 2);

  update public.player_saves
    set state = jsonb_set(v_save.state, '{cash}', to_jsonb(v_cash_after), true), updated_at = now()
    where user_id = v_user;
  update public.world_properties
    set owner_user_id = null, owner_name = null, rented = false,
        market_value = v_market, updated_at = now()
    where property_id = p_property_id;

  return jsonb_build_object('property_id', p_property_id, 'market_value', v_market,
    'cash_before', v_cash_before, 'sale_price', v_sale, 'cash', v_cash_after);
end;
$$;
revoke all on function public.release_property(integer, numeric, numeric) from public, anon;
grant execute on function public.release_property(integer, numeric, numeric) to authenticated;

-- Snapshot the current player-save population. Accounts created after this
-- migration are deliberately not eligible for this one-time grant.
create table if not exists public.player_bonus_eligibility (
  grant_key text not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  amount numeric(14,2) not null check (amount > 0),
  claimed_at timestamptz,
  created_at timestamptz not null default now(),
  primary key (grant_key, user_id)
);

alter table public.player_bonus_eligibility enable row level security;
revoke all on public.player_bonus_eligibility from public, anon, authenticated;

insert into public.player_bonus_eligibility (grant_key, user_id, amount)
select 'launch_bonus_20261102', s.user_id, 15000
from public.player_saves s
on conflict (grant_key, user_id) do nothing;

create or replace function public.claim_launch_bonus()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_bonus public.player_bonus_eligibility%rowtype;
  v_save public.player_saves%rowtype;
  v_cash numeric(14,2);
  v_new_cash numeric(14,2);
begin
  if v_user is null then raise exception 'Giriş yapmalısın.'; end if;

  select * into v_bonus
  from public.player_bonus_eligibility
  where grant_key = 'launch_bonus_20261102' and user_id = v_user
  for update;

  if not found then
    return jsonb_build_object('eligible', false, 'granted', false);
  end if;
  if v_bonus.claimed_at is not null then
    return jsonb_build_object('eligible', true, 'granted', false, 'already_claimed', true);
  end if;

  select * into v_save from public.player_saves where user_id = v_user for update;
  if not found then raise exception 'Oyuncu kaydı bulunamadı.'; end if;

  v_cash := coalesce(nullif(v_save.state->>'cash', '')::numeric, 0);
  v_new_cash := round(v_cash + v_bonus.amount, 2);

  update public.player_saves
  set state = jsonb_set(
        jsonb_set(coalesce(v_save.state, '{}'::jsonb), '{cash}', to_jsonb(v_new_cash), true),
        '{launchBonusClaimed}', 'true'::jsonb, true
      ),
      updated_at = now()
  where user_id = v_user;

  update public.player_bonus_eligibility
  set claimed_at = now()
  where grant_key = 'launch_bonus_20261102' and user_id = v_user;

  return jsonb_build_object('eligible', true, 'granted', true, 'amount', v_bonus.amount, 'cash', v_new_cash);
end;
$$;
revoke all on function public.claim_launch_bonus() from public, anon;
grant execute on function public.claim_launch_bonus() to authenticated;
