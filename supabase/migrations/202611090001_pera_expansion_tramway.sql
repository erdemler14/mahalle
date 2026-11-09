-- Mahalle / 1923 Pera expansion: shared property registry and Maxim's 50x revaluation.
begin;
insert into public.world_properties(property_id,name,property_type,base_price,market_value) values
(63,'Galata İskele Kahvesi','İşletme',1440,1440),(64,'Rıhtım Gazete ve Tütün Büfesi','Ticaret',720,720),
(65,'Karaköy Deniz Levazımatçısı','Ticaret',1755,1755),(66,'Haliç Rıhtım Emanet Ambarı','Depo',2835,2835),
(70,'Lebon Pastanesi','İşletme',900,900),(71,'Nisuaz Pastanesi','İşletme',720,720),
(72,'Elhamra Sineması','İşletme',1800,1800),(73,'Maxim Gece Kulübü','İşletme',500,500),
(74,'Tokatlıyan Oteli','İşletme',2200,2200),(75,'Çiçek Pasajı','Ticaret',1350,1350),
(76,'Degüstasyon Lokantası','İşletme',800,800),(77,'Beyoğlu Elektrikli Tramvay İşletmesi','İşletme',1400,1400),
(78,'Pera Matbaa ve Gazete İdaresi','Atölye',1850,1850),(79,'Pera Plak ve Gramofon Evi','Ticaret',1250,1250),
(80,'Pera Çiçek Pasajı Gazete ve Çiçekçi Sokağı','Ticaret',980,980)
on conflict(property_id) do update set name=excluded.name,property_type=excluded.property_type,base_price=excluded.base_price,
market_value=case when public.world_properties.property_id=73 then case when public.world_properties.owner_user_id is null then 500 else 25000 end
when public.world_properties.owner_user_id is null then excluded.market_value else public.world_properties.market_value end;
update public.world_properties set market_value=case when owner_user_id is null then 500 else 25000 end,
name='Maxim Gece Kulübü',updated_at=now() where property_id=73;

create or replace function public.purchase_property_v3(p_property_id integer)
returns jsonb language plpgsql security definer set search_path=public as $$
declare
 v_user uuid:=auth.uid(); v_property public.world_properties%rowtype; v_save public.player_saves%rowtype;
 v_profile public.player_profiles%rowtype; v_balance numeric(14,2); v_price numeric(14,2); v_after numeric(14,2); v_owned jsonb;
begin
 if v_user is null then raise exception 'Mülk almak için giriş yapmalısın.'; end if;
 select * into v_property from public.world_properties where property_id=p_property_id for update;
 if not found then raise exception 'Mülk ortak şehirde henüz kayıtlı değil (ID: %).',p_property_id; end if;
 if v_property.owner_user_id is not null then raise exception 'Bu mülk artık başka bir oyuncuya ait.'; end if;
 select * into v_save from public.player_saves where user_id=v_user for update;
 if not found then raise exception 'Oyuncu kayıtları henüz hazır değil.'; end if;
 select * into v_profile from public.player_profiles where user_id=v_user;
 v_balance:=round(coalesce((v_save.state->>'cash')::numeric,0),2); v_price:=round(v_property.market_value,2);
 if v_price<=0 then raise exception 'Mülkün satış fiyatı geçersiz.'; end if;
 if v_balance<v_price then raise exception 'Bakiye yetersiz. Mülk fiyatı ₺%, mevcut ₺%.',v_price,v_balance; end if;
 v_after:=round(v_balance-v_price,2);
 v_owned:=case when jsonb_typeof(v_save.state->'owned')='array' then v_save.state->'owned' else '[]'::jsonb end;
 if not v_owned @> jsonb_build_array(p_property_id) then v_owned:=v_owned||jsonb_build_array(p_property_id); end if;
 update public.player_saves set state=jsonb_set(jsonb_set(coalesce(v_save.state,'{}'::jsonb),'{cash}',to_jsonb(v_after),true),'{owned}',v_owned,true),updated_at=now() where user_id=v_user;
 update public.world_properties set owner_user_id=v_user,owner_name=coalesce(nullif(v_profile.display_name,''),'Mahalle sakini'),
 rented=false,market_value=case when p_property_id=73 then 25000 else market_value end,updated_at=now() where property_id=p_property_id;
 if to_regclass('public.property_offers') is not null then update public.property_offers set status='cancelled',updated_at=now()
 where property_id=p_property_id and status in ('pending','countered'); end if;
 return jsonb_build_object('success',true,'property_id',p_property_id,'cash',v_after,'paid',v_price,
 'market_value',case when p_property_id=73 then 25000 else v_property.market_value end,
 'owner_name',coalesce(nullif(v_profile.display_name,''),'Mahalle sakini'));
end; $$;
revoke all on function public.purchase_property_v3(integer) from public,anon;
grant execute on function public.purchase_property_v3(integer) to authenticated;
commit;
