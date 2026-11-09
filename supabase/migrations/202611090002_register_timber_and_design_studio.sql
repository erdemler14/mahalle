-- Register the timber mill and interior-architecture studio in the shared city.
-- Existing owners and live market values are preserved on re-deployment.
begin;
insert into public.world_properties(property_id,name,property_type,base_price,market_value) values
(82,'Karaköy Kereste Deposu ve Bıçkıhane','Atölye',2450,2450),
(83,'Pera Mimari ve Tezyinat Stüdyosu','İşletme',4250,4250)
on conflict(property_id) do update set
  name=excluded.name,
  property_type=excluded.property_type,
  base_price=excluded.base_price,
  market_value=case when public.world_properties.owner_user_id is null
    then excluded.market_value else public.world_properties.market_value end;
commit;
