-- Mahalle shared-city foundation. Run this migration in the Supabase SQL Editor.
create table if not exists public.player_saves (
  user_id uuid primary key references auth.users(id) on delete cascade,
  state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
create table if not exists public.player_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Mahalle sakini',
  updated_at timestamptz not null default now()
);
create table if not exists public.world_properties (
  property_id integer primary key,
  name text not null,
  property_type text not null,
  base_price numeric(14,2) not null check (base_price > 0),
  market_value numeric(14,2) not null check (market_value > 0),
  owner_user_id uuid references auth.users(id) on delete set null,
  owner_name text,
  rented boolean not null default false,
  updated_at timestamptz not null default now()
);
insert into public.world_properties (property_id, name, property_type, base_price, market_value)
values
  (1, "Galata’da küçük dükkan", "Ticaret", 1890, 1890),
  (2, "Asmalımescit apartmanı", "Konut", 3870, 3870),
  (3, "Arka sokakta depo", "Depo", 1305, 1305),
  (4, "Cadde üzeri han", "Ticaret", 5625, 5625),
  (5, "Meydan evi", "Konut", 3105, 3105),
  (6, "Eski Rum evi", "Konut", 3330, 3330),
  (7, "Şarap ve erzak dükkanı", "Ticaret", 2295, 2295),
  (8, "Tünel yakınında apartman", "Konut", 5040, 5040),
  (9, "Matbaa atölyesi", "Atölye", 2790, 2790),
  (10, "İstiklal üzerinde mağaza", "Ticaret", 6660, 6660),
  (11, "Avlulu aile evi", "Konut", 2565, 2565),
  (12, "Küçük kahvehane", "İşletme", 2160, 2160),
  (13, "Mahalle fırını", "İşletme", 2520, 2520),
  (14, "Kasap dükkanı", "Ticaret", 2655, 2655),
  (15, "Eczane", "Ticaret", 3690, 3690),
  (16, "Kitapçı ve kırtasiye", "Ticaret", 2880, 2880),
  (17, "Marangoz atölyesi", "Atölye", 2340, 2340),
  (18, "Manav tezgahı", "Ticaret", 1755, 1755),
  (19, "Lokanta", "İşletme", 3420, 3420),
  (20, "Demirci dükkanı", "Atölye", 2745, 2745),
  (21, "Voyvoda Caddesi hanı", "Ticaret", 7560, 7560),
  (22, "Galata yokuşu evi", "Konut", 4230, 4230),
  (23, "Karaköy aktar dükkanı", "Ticaret", 3195, 3195),
  (24, "Galata apartmanı", "Konut", 6030, 6030),
  (25, "Tünel çıkışı kahvesi", "İşletme", 4455, 4455),
  (26, "Küçük terzi dükkanı", "Atölye", 3060, 3060),
  (27, "Levanten aile apartmanı", "Konut", 7020, 7020),
  (28, "Mahalle bakkalı", "Ticaret", 3420, 3420),
  (29, "Avlulu sabun imalathanesi", "Atölye", 3870, 3870),
  (30, "Cumba altı kiralık daireler", "Konut", 5355, 5355),
  (31, "Meyhane sokağı lokantası", "İşletme", 5670, 5670),
  (32, "Küçük matbaa ve kırtasiye", "Atölye", 4185, 4185),
  (33, "Galata kumaşçı dükkanı", "Ticaret", 780, 780),
  (34, "Kolonya ve koku dükkanı", "Ticaret", 730, 730),
  (35, "Lokumcu ve şekerci", "Ticaret", 690, 690),
  (36, "Leblebici dükkanı", "Ticaret", 520, 520),
  (37, "Kunduracı dükkanı", "Atölye", 610, 610),
  (38, "Kuyumcu", "Ticaret", 1180, 1180),
  (39, "Berber dükkanı", "İşletme", 560, 560),
  (40, "Baylan Pastanesi", "İşletme", 1040, 1040),
  (41, "Şapkacı mağazası", "Ticaret", 820, 820),
  (42, "Çiçekçi dükkanı", "Ticaret", 590, 590),
  (43, "Fotoğrafçı stüdyosu", "Ticaret", 980, 980),
  (44, "Sabuncu ve güzel koku imalathanesi", "Atölye", 900, 900),
  (45, "Sahaf ve eski kitapçı", "Ticaret", 720, 720),
  (46, "Şarküteri ve peynirci", "Ticaret", 780, 780),
  (47, "Bakırcı ve kalaycı", "Atölye", 690, 690),
  (48, "Oyuncakçı dükkanı", "Ticaret", 640, 640),
  (49, "Saat tamircisi", "Atölye", 760, 760),
  (50, "Kahve kavurucusu", "İşletme", 830, 830),
  (51, "Mefruşatçı dükkanı", "Ticaret", 910, 910),
  (52, "Tabelacı ve boyacı", "Atölye", 620, 620),
  (53, "Galata meyhanesi", "İşletme", 890, 890),
  (54, "Galata şarap imalathanesi", "Atölye", 1420, 1420),
  (55, "Pera Palas Pansiyonu", "İşletme", 1850, 1850),
  (56, "Grand Haliç Oteli", "İşletme", 3650, 3650),
  (57, "Majestic Sineması", "İşletme", 2900, 2900),
  (58, "Haliç Gazinosu", "İşletme", 3350, 3350),
  (59, "Arka Sokak Kahvesi", "İşletme", 720, 720),
  (60, "Hamam ve Tellaklar", "İşletme", 2150, 2150),
  (61, "Avlulu Han", "Ticaret", 2450, 2450),
  (62, "Arka Sokak Meyhanesi", "İşletme", 980, 980)
on conflict (property_id) do update set
  name = excluded.name,
  property_type = excluded.property_type,
  base_price = excluded.base_price;

alter table public.player_saves enable row level security;
alter table public.player_profiles enable row level security;
alter table public.world_properties enable row level security;

drop policy if exists "players read own save" on public.player_saves;
create policy "players read own save" on public.player_saves for select to authenticated using (auth.uid() = user_id);
drop policy if exists "players insert own save" on public.player_saves;
create policy "players insert own save" on public.player_saves for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists "players update own save" on public.player_saves;
create policy "players update own save" on public.player_saves for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "players read own profile" on public.player_profiles;
create policy "players read own profile" on public.player_profiles for select to authenticated using (auth.uid() = user_id);
drop policy if exists "players create own profile" on public.player_profiles;
create policy "players create own profile" on public.player_profiles for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists "players update own profile" on public.player_profiles;
create policy "players update own profile" on public.player_profiles for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "authenticated users read shared city" on public.world_properties;
create policy "authenticated users read shared city" on public.world_properties for select to authenticated using (true);
-- Ownership is changed only by security-definer RPCs, never by client table writes.
revoke insert, update, delete on public.world_properties from anon, authenticated;

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
begin
  if v_user is null then raise exception 'Giriş yapmalısın.'; end if;
  select * into v_property from public.world_properties where property_id = p_property_id for update;
  if not found then raise exception 'Mülk bulunamadı.'; end if;
  if v_property.owner_user_id is not null then raise exception 'Bu mülk artık satılık değil.'; end if;
  select * into v_save from public.player_saves where user_id = v_user for update;
  if not found then raise exception 'Oyuncu kaydı henüz hazır değil; tekrar dene.'; end if;
  v_cash := coalesce((v_save.state->>'cash')::numeric, 75);
  if v_cash < v_property.market_value then raise exception 'Bu mülk için yeterli sermayen yok.'; end if;
  select * into v_profile from public.player_profiles where user_id = v_user;
  update public.player_saves
    set state = jsonb_set(v_save.state, '{cash}', to_jsonb(round(v_cash - v_property.market_value, 2)), true),
        updated_at = now()
    where user_id = v_user;
  update public.world_properties
    set owner_user_id = v_user,
        owner_name = coalesce(v_profile.display_name, 'Mahalle sakini'),
        updated_at = now()
    where property_id = p_property_id;
  return jsonb_build_object(
    'property_id', p_property_id,
    'owner_user_id', v_user,
    'owner_name', coalesce(v_profile.display_name, 'Mahalle sakini'),
    'market_value', v_property.market_value,
    'cash', round(v_cash - v_property.market_value, 2)
  );
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
  v_sale := round(v_property.market_value * 0.95, 2);
  update public.player_saves
    set state = jsonb_set(v_save.state, '{cash}', to_jsonb(round(v_cash + v_sale, 2)), true),
        updated_at = now()
    where user_id = v_user;
  update public.world_properties
    set owner_user_id = null, owner_name = null, rented = false, updated_at = now()
    where property_id = p_property_id;
  return jsonb_build_object('property_id', p_property_id, 'cash', round(v_cash + v_sale, 2), 'sale_price', v_sale);
end;
$$;
revoke all on function public.release_property(integer) from public, anon;
grant execute on function public.release_property(integer) to authenticated;

-- Enable realtime broadcasts for shared ownership and market-value changes.
do $$
begin
  alter publication supabase_realtime add table public.world_properties;
exception when duplicate_object then null;
end $$;


create or replace function public.set_property_rented(p_property_id integer, p_rented boolean)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_property public.world_properties%rowtype;
begin
  if v_user is null then raise exception 'Giriş yapmalısın.'; end if;
  select * into v_property from public.world_properties where property_id = p_property_id for update;
  if not found or v_property.owner_user_id is distinct from v_user then
    raise exception 'Yalnızca sahibi olduğun mülkün kira durumunu değiştirebilirsin.';
  end if;
  update public.world_properties set rented = p_rented, updated_at = now()
    where property_id = p_property_id;
  return jsonb_build_object('property_id', p_property_id, 'rented', p_rented);
end;
$$;
revoke all on function public.set_property_rented(integer, boolean) from public, anon;
grant execute on function public.set_property_rented(integer, boolean) to authenticated;
