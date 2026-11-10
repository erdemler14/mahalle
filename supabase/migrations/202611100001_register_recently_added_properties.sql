-- Register newly added businesses in the shared city property registry.
-- Existing ownership and live market values are preserved on re-deployment.
begin;

insert into public.world_properties
  (property_id, name, property_type, base_price, market_value)
values
  (81, 'Karaköy Tütüncü ve Nargile Dükkânı', 'Ticaret', 1180, 1180),
  (84, 'Pera Simitçisi', 'İşletme', 1450, 1450),
  (85, 'Pera Avrupa Mobilya ve Antika Mağazası', 'Ticaret', 3850, 3850),
  (86, 'Şütte Şarküteri', 'Ticaret', 3150, 3150),
  (87, 'Gülmez Biraderler Fotoğrafhanesi', 'İşletme', 2950, 2950)
on conflict (property_id) do update set
  name = excluded.name,
  property_type = excluded.property_type,
  base_price = excluded.base_price,
  market_value = case
    when public.world_properties.owner_user_id is null
      then excluded.market_value
    else public.world_properties.market_value
  end,
  updated_at = now();

commit;
