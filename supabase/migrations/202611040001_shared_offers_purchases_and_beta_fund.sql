-- Mahalle 2026-11-04: Shared-city transaction repair and beta funding.
-- IMPORTANT: Commit to GitHub is NOT the same as running this in Supabase.
-- Execute from the project Supabase SQL Editor with the project owner role.
-- All sensitive mutations are SECURITY DEFINER RPCs and are atomic.
begin;

-- Register new waterfront venues as real buyable property records.
insert into public.world_properties(property_id,name,property_type,base_price,market_value)
values
(63,'Galata İskele Kahvesi','İşletme',1440,1440),
(64,'Rıhtım Gazete ve Tütün Büfesi','Ticaret',720,720),
(65,'Karaköy Deniz Levazımatçısı','Ticaret',1755,1755),
(66,'Haliç Rıhtım Emanet Ambarı','Depo',2835,2835)
on conflict (property_id) do nothing;

-- A signed-in user may buy only if their SAVED cash covers the SERVER price.
-- No price or balance values provided by the browser are trusted.
create or replace function public.purchase_property_v3(p_property_id integer)
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
  v_balance numeric(14,2);
  v_price numeric(14,2);
  v_after numeric(14,2);
  v_owned jsonb;
begin
  if v_user is null then raise exception 'Mülk almak için giriş yapmalısın.'; end if;
  select * into v_property from public.world_properties where property_id = p_property_id for update;
  if not found then raise exception 'Mülk ortak şehirde henüz kayıtlı değil (ID: %).',p_property_id; end if;
  if v_property.owner_user_id is not null then raise exception 'Bu mülk artık başka bir oyuncuya ait.'; end if;
  select * into v_save from public.player_saves where user_id=v_user for update;
  if not found then raise exception 'Oyuncu kayıtları henüz hazır değil.'; end if;
  select * into v_profile from public.player_profiles where user_id=v_user;
  v_balance:=round(coalesce((v_save.state->>'cash')::numeric,0),2);
  v_price:=round(v_property.market_value,2);
  if v_price<=0 then raise exception 'Mülkün satış fiyatı geçersiz.'; end if;
  if v_balance<v_price then raise exception 'Bakiye yetersiz. Mülk fiyatı ₺%, mevcut ₺%.',v_price,v_balance; end if;
  v_after:=round(v_balance-v_price,2);
  v_owned:=case when jsonb_typeof(v_save.state->'owned')='array' then v_save.state->'owned' else '[]'::jsonb end;
  if not v_owned @> jsonb_build_array(p_property_id) then
    v_owned:=v_owned||jsonb_build_array(p_property_id);
  end if;
  update public.player_saves
  set state=jsonb_set(jsonb_set(coalesce(v_save.state,'{}'::jsonb),'{cash}',to_jsonb(v_after),true),'{owned}',v_owned,true),
      updated_at=now()
  where user_id=v_user;
  update public.world_properties
  set owner_user_id=v_user,
      owner_name=coalesce(nullif(v_profile.display_name,''),'Mahalle sakini'),
      rented=false,updated_at=now()
  where property_id=p_property_id;
  -- Previously submitted offers are no longer valid after a successful purchase.
  if to_regclass('public.property_offers') is not null then
    update public.property_offers set status='cancelled',updated_at=now()
    where property_id=p_property_id and status in ('pending','countered');
  end if;
  return jsonb_build_object('success',true,'property_id',p_property_id,'cash',v_after,
    'paid',v_price,'owner_name',coalesce(nullif(v_profile.display_name,''),'Mahalle sakini'));
end;
$$;
revoke all on function public.purchase_property_v3(integer) from public,anon;
grant execute on function public.purchase_property_v3(integer) to authenticated;

-- One-time explicit beta test fund for signed-in players (per account, not per click).
-- No anonymous or arbitrary-amount grant is exposed.
create table if not exists public.player_beta_funds (
  user_id uuid not null references auth.users(id) on delete cascade,
  grant_key text not null,
  amount numeric(14,2) not null check(amount>0),
  granted_at timestamptz not null default now(),
  primary key(user_id,grant_key)
);
alter table public.player_beta_funds enable row level security;
revoke all on public.player_beta_funds from public,anon,authenticated;

create or replace function public.claim_beta_test_fund_20261104()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_save public.player_saves%rowtype;
  v_cash numeric(14,2);
  v_new_cash numeric(14,2);
begin
  if v_user is null then raise exception 'Test fonunu almak için giriş yapmalısın.'; end if;
  select * into v_save from public.player_saves where user_id=v_user for update;
  if not found then raise exception 'Önce oyuna giriş yapıp hesabının yüklenmesini bekle.'; end if;
  if exists(select 1 from public.player_beta_funds where user_id=v_user and grant_key='test_fonu_70000_20261104') then
    return jsonb_build_object('granted',false,'already_claimed',true,
      'cash',coalesce((v_save.state->>'cash')::numeric,0));
  end if;
  v_cash:=round(coalesce((v_save.state->>'cash')::numeric,0),2);
  v_new_cash:=v_cash+70000;
  insert into public.player_beta_funds(user_id,grant_key,amount)
  values(v_user,'test_fonu_70000_20261104',70000);
  update public.player_saves
  set state=jsonb_set(
      jsonb_set(coalesce(v_save.state,'{}'::jsonb),'{cash}',to_jsonb(v_new_cash),true),
      '{betaTestFundClaimed}','true'::jsonb,true),
      updated_at=now()
  where user_id=v_user;
  return jsonb_build_object('granted',true,'amount',70000,'cash',v_new_cash);
end;
$$;
revoke all on function public.claim_beta_test_fund_20261104() from public,anon;
grant execute on function public.claim_beta_test_fund_20261104() to authenticated;

-- Shared-city offers, not PeerJS-only ephemeral room messages.
create table if not exists public.property_offers (
  id uuid primary key default gen_random_uuid(),
  property_id integer not null references public.world_properties(property_id),
  buyer_user_id uuid not null references auth.users(id) on delete cascade,
  seller_user_id uuid not null references auth.users(id) on delete cascade,
  buyer_name text not null default 'Oyuncu',
  seller_name text not null default 'Oyuncu',
  price numeric(14,2) not null check(price>0 and price<100000000),
  status text not null default 'pending'
    check(status in('pending','countered','accepted','rejected','cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  expires_at timestamptz not null default (now()+interval '7 days'),
  check(buyer_user_id<>seller_user_id)
);
create index if not exists property_offers_buyer_idx on public.property_offers(buyer_user_id,status,updated_at desc);
create index if not exists property_offers_seller_idx on public.property_offers(seller_user_id,status,updated_at desc);
alter table public.property_offers enable row level security;
revoke all on public.property_offers from public,anon,authenticated;
grant select on public.property_offers to authenticated;
drop policy if exists "participants read own offers" on public.property_offers;
create policy "participants read own offers" on public.property_offers
  for select to authenticated using(auth.uid()=buyer_user_id or auth.uid()=seller_user_id);

create or replace function public.create_property_offer(
  p_property_id integer,p_price numeric
)
returns jsonb
language plpgsql
security definer
set search_path=public
as $$
declare
  v_user uuid:=auth.uid();
  v_property public.world_properties%rowtype;
  v_save public.player_saves%rowtype;
  v_buyer public.player_profiles%rowtype;
  v_price numeric(14,2);
  v_offer public.property_offers%rowtype;
begin
  if v_user is null then raise exception 'Teklif göndermek için giriş yapmalısın.'; end if;
  if p_price is null or p_price<=0 or p_price>=100000000 then raise exception 'Teklif tutarı geçersiz.'; end if;
  v_price:=round(p_price,2);
  select * into v_property from public.world_properties where property_id=p_property_id for update;
  if not found or v_property.owner_user_id is null then raise exception 'Bu mülkün teklif verebileceğin bir sahibi yok.'; end if;
  if v_property.owner_user_id=v_user then raise exception 'Kendi mülküne teklif veremezsin.'; end if;
  select * into v_save from public.player_saves where user_id=v_user for update;
  if not found then raise exception 'Oyuncu hesabında kayıt bulunamadı.'; end if;
  if coalesce((v_save.state->>'cash')::numeric,0)<v_price then raise exception 'Teklif için yeterli nakit yok.'; end if;
  select * into v_buyer from public.player_profiles where user_id=v_user;
  update public.property_offers set status='cancelled',updated_at=now()
    where property_id=p_property_id and buyer_user_id=v_user and status in ('pending','countered');
  insert into public.property_offers
    (property_id,buyer_user_id,seller_user_id,buyer_name,seller_name,price)
  values
    (p_property_id,v_user,v_property.owner_user_id,
     coalesce(nullif(v_buyer.display_name,''),'Oyuncu'),
     coalesce(nullif(v_property.owner_name,''),'Oyuncu'),v_price)
  returning * into v_offer;
  return jsonb_build_object('success',true,'offer_id',v_offer.id,'price',v_offer.price,'status',v_offer.status);
end;
$$;
revoke all on function public.create_property_offer(integer,numeric) from public,anon;
grant execute on function public.create_property_offer(integer,numeric) to authenticated;

-- The owner handles an initial bid; buyer handles a counteroffer.
-- Acceptance transfers both cash and property under row locks in a single transaction.
create or replace function public.respond_property_offer(
  p_offer_id uuid,p_decision text,p_counter_price numeric default null
)
returns jsonb
language plpgsql
security definer
set search_path=public
as $$
declare
  v_user uuid:=auth.uid();
  v_offer public.property_offers%rowtype;
  v_property public.world_properties%rowtype;
  v_buyer public.player_saves%rowtype;
  v_seller public.player_saves%rowtype;
  v_balance numeric(14,2);
  v_seller_balance numeric(14,2);
  v_buyer_after numeric(14,2);
  v_seller_after numeric(14,2);
  v_buyer_owned jsonb;
  v_seller_owned jsonb;
  v_seller_rented jsonb;
  v_seller_name text;
  v_price numeric(14,2);
begin
  if v_user is null then raise exception 'Giriş yapmalısın.'; end if;
  if p_decision not in ('accept','reject','counter') then raise exception 'Geçersiz teklif yanıtı.'; end if;
  select * into v_offer from public.property_offers where id=p_offer_id for update;
  if not found then raise exception 'Teklif bulunamadı.'; end if;
  if v_offer.status not in ('pending','countered') or v_offer.expires_at<=now() then
    raise exception 'Teklifin süresi dolmuş veya daha önce yanıtlanmış.'; end if;
  if v_offer.status='pending' and v_user<>v_offer.seller_user_id then
    raise exception 'İlk teklifi yalnızca mülk sahibi yanıtlayabilir.'; end if;
  if v_offer.status='countered' and v_user<>v_offer.buyer_user_id then
    raise exception 'Karşı teklifi yalnızca alıcı yanıtlayabilir.'; end if;
  select * into v_property from public.world_properties
    where property_id=v_offer.property_id for update;
  if not found or v_property.owner_user_id is distinct from v_offer.seller_user_id then
    update public.property_offers set status='cancelled',updated_at=now() where id=v_offer.id;
    raise exception 'Mülkün sahibi değişmiş. Bu teklif artık geçerli değil.'; end if;

  if p_decision='reject' then
    update public.property_offers set status='rejected',updated_at=now() where id=v_offer.id;
    return jsonb_build_object('success',true,'status','rejected','offer_id',v_offer.id);
  end if;
  if p_decision='counter' then
    if v_offer.status<>'pending' then raise exception 'Yalnızca mülk sahibi karşı teklif gönderebilir.'; end if;
    if p_counter_price is null or p_counter_price<=0 or p_counter_price>=100000000 then
      raise exception 'Karşı teklif tutarı geçersiz.'; end if;
    v_price:=round(p_counter_price,2);
    update public.property_offers set price=v_price,status='countered',updated_at=now()
      where id=v_offer.id;
    return jsonb_build_object('success',true,'status','countered','price',v_price,'offer_id',v_offer.id);
  end if;

  select * into v_buyer from public.player_saves where user_id=v_offer.buyer_user_id for update;
  select * into v_seller from public.player_saves where user_id=v_offer.seller_user_id for update;
  if v_buyer.user_id is null or v_seller.user_id is null then
    raise exception 'Alıcı veya satıcı oyun kaydı bulunamadı.'; end if;
  v_price:=v_offer.price;
  v_balance:=round(coalesce((v_buyer.state->>'cash')::numeric,0),2);
  v_seller_balance:=round(coalesce((v_seller.state->>'cash')::numeric,0),2);
  if v_balance<v_price then raise exception 'Alıcının hesabında teklif bedeli için yeterli nakit kalmadı.'; end if;
  v_buyer_after:=round(v_balance-v_price,2);
  v_seller_after:=round(v_seller_balance+v_price,2);
  v_buyer_owned:=case when jsonb_typeof(v_buyer.state->'owned')='array' then v_buyer.state->'owned' else '[]'::jsonb end;
  if not v_buyer_owned @> jsonb_build_array(v_offer.property_id) then
    v_buyer_owned:=v_buyer_owned||jsonb_build_array(v_offer.property_id);
  end if;
  select coalesce(jsonb_agg(value),'[]'::jsonb) into v_seller_owned
  from jsonb_array_elements(
    case when jsonb_typeof(v_seller.state->'owned')='array' then v_seller.state->'owned' else '[]'::jsonb end
  ) as t(value) where value<>to_jsonb(v_offer.property_id);
  select coalesce(jsonb_agg(value),'[]'::jsonb) into v_seller_rented
  from jsonb_array_elements(
    case when jsonb_typeof(v_seller.state->'rented')='array' then v_seller.state->'rented' else '[]'::jsonb end
  ) as t(value) where value<>to_jsonb(v_offer.property_id);
  update public.player_saves set
    state=jsonb_set(
      jsonb_set(coalesce(v_buyer.state,'{}'::jsonb),'{cash}',to_jsonb(v_buyer_after),true),
      '{owned}',v_buyer_owned,true),
    updated_at=now()
    where user_id=v_offer.buyer_user_id;
  update public.player_saves set
    state=jsonb_set(
      jsonb_set(
        jsonb_set(coalesce(v_seller.state,'{}'::jsonb),'{cash}',to_jsonb(v_seller_after),true),
        '{owned}',v_seller_owned,true),
      '{rented}',v_seller_rented,true),
    updated_at=now()
    where user_id=v_offer.seller_user_id;
  v_seller_name:=v_offer.buyer_name;
  update public.world_properties set
    owner_user_id=v_offer.buyer_user_id,owner_name=v_seller_name,
    rented=false,updated_at=now()
  where property_id=v_offer.property_id;

  update public.property_offers set status='accepted',updated_at=now() where id=v_offer.id;
  update public.property_offers set status='cancelled',updated_at=now()
    where property_id=v_offer.property_id and id<>v_offer.id and status in('pending','countered');
  return jsonb_build_object('success',true,'status','accepted','offer_id',v_offer.id,
    'property_id',v_offer.property_id,'price',v_price,
    'buyer_cash',v_buyer_after,'seller_cash',v_seller_after,
    'cash',case when v_user=v_offer.buyer_user_id then v_buyer_after else v_seller_after end);
end;
$$;
revoke all on function public.respond_property_offer(uuid,text,numeric) from public,anon;
grant execute on function public.respond_property_offer(uuid,text,numeric) to authenticated;

commit;
