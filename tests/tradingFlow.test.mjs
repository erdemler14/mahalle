import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {
  FERRY_LICENSE_PRICE,calculateFerryDay,applyFerrySettlement
} from '../src/ferryBusiness.js';

const app=fs.readFileSync('src/App.jsx','utf8');
const migration=fs.readFileSync('supabase/migrations/202611040001_shared_offers_purchases_and_beta_fund.sql','utf8');

test('ferry license price stays 200 TL but net income is materially higher',()=>{
  assert.equal(FERRY_LICENSE_PRICE,200);
  const day=calculateFerryDay({owned:true,upgrades:{}},{year:1923,month:10,day:13});
  assert.ok(day.net>=90, 'Ferry income should be significantly higher than the previous 20 TL/day');
  assert.ok(day.net<=220, 'Ferry should not pay implausible runaway income');
  const fullyUpgraded=calculateFerryDay({owned:true,upgrades:{
    ticketOffice:true,secondFerry:true,nightService:true,cargoHold:true
  }},{year:1923,month:10,day:13});
  assert.ok(fullyUpgraded.net>day.net+90,'Upgrades should substantially grow daily profit');
  const settled=applyFerrySettlement({owned:true,upgrades:{}},day);
  assert.equal(calculateFerryDay(settled,{year:1923,month:10,day:13}).skipped,true,'Do not double pay a day');
});

test('new v3 shared city buying uses server price and locked saved balance',()=>{
  assert.match(migration,/function public\.purchase_property_v3\s*\(\s*p_property_id integer/);
  assert.match(migration,/where property_id\s*=\s*p_property_id for update/);
  assert.match(migration,/where user_id=v_user for update/);
  assert.match(migration,/v_price\s*:=\s*round\(v_property.market_value,2\)/);
  assert.match(migration,/v_balance<v_price/);
  assert.match(migration,/grant execute on function public\.purchase_property_v3\(integer\) to authenticated/);
  assert.match(app,/rpc\('purchase_property_v3'/);
  assert.match(app,/purchaseBusy/);
});

test('offer workflow is persistent and only the two participants can read offers',()=>{
  assert.match(migration,/create table if not exists public\.property_offers/);
  assert.match(migration,/buyer_user_id uuid not null/);
  assert.match(migration,/seller_user_id uuid not null/);
  assert.match(migration,/create policy "participants read own offers"/);
  assert.match(migration,/auth.uid\(\)=buyer_user_id or auth.uid\(\)=seller_user_id/);
  assert.match(migration,/create or replace function public\.create_property_offer/);
  assert.match(migration,/create or replace function public\.respond_property_offer/);
  assert.match(migration,/if v_balance<v_price then raise exception/);
  assert.match(migration,/update public\.world_properties set\s+owner_user_id=v_offer.buyer_user_id/);
  assert.match(app,/rpc\('create_property_offer'/);
  assert.match(app,/rpc\('respond_property_offer'/);
});

test('old 70000 TL test grant is absent from the app and revoked by later migration',()=>{
  const revoke=fs.readFileSync('supabase/migrations/202611040002_retire_beta_credit.sql','utf8');
  assert.doesNotMatch(app,/claimBetaTestFund|betaTestCode|beta-credit-panel|betaTestFundClaimed|claim_beta_test_fund_20261104/);
  assert.match(revoke,/drop function if exists public\.claim_beta_test_fund_20261104\(text\)/);
  assert.match(revoke,/drop table if exists public\.beta_fund_invites/);
  assert.doesNotMatch(app,/\+70000|cash\s*\/\s*70000/);
});

test('new pier businesses exist in shared city property table',()=>{
  for(const id of [63,64,65,66]){
    assert.match(migration,new RegExp('\\('+id+','));
  }
});


test('production console uses the selected property rather than an undefined render-scope variable',()=>{
  const source=fs.readFileSync('src/App.jsx','utf8');
  assert.match(source,/const availableProducts = allProducts\.filter\(item => isBusinessProductUnlocked\(active\.id, item\)/);
  assert.match(source,/const unlocked = isBusinessProductUnlocked\(active\.id, item\)/);
  assert.doesNotMatch(source,/const availableProducts = allProducts\.filter\(item => isBusinessProductUnlocked\(propertyId, item\)/);
  assert.doesNotMatch(source,/const unlocked = isBusinessProductUnlocked\(propertyId, item\)/);
});

test('trade school level two correctly depends on the level-one certificate ID',()=>{
  const source=fs.readFileSync('src/App.jsx','utf8');
  assert.match(source,/const previousId = level === 1 \? null : \(level === 2 \? branch\.id : branch\.id \+ '-level-' \+ \(level - 1\)\);/);
  assert.match(source,/universityCourses\.find\(c=>c\.id===\(i===0\?branch\.id:branch\.id\+'-level-'\+\(i\+1\)\)\)/);
});
test('only health and pharmacy advanced courses require owned premises and all branches remain visible',()=>{
  const source=fs.readFileSync('src/App.jsx','utf8');
  assert.match(source,/premiseId:\['medical','pharmacy','medicine'\]\.includes\(branch\.id\) \? \(branch\.premiseId \|\| null\) : null/);
  assert.match(source,/universityCourseBranches\.map\(branch=>/);
  assert.doesNotMatch(source,/universityCourseBranches\.filter\(branch=>!branch\.premiseId\|\|owned\.includes\(branch\.premiseId\)\)/);
});


test('customer orders cannot be accepted when finished-goods capacity cannot cover the missing quantity',()=>{
  const source=fs.readFileSync('src/App.jsx','utf8');
  const start=source.indexOf('const acceptCustomerOrder = (orderId) => {');
  const end=source.indexOf('const deliverCustomerOrder =',start);
  const section=source.slice(start,end);
  assert.match(section,/requiredProduction > freeSpace/);
  assert.match(section,/getStockCapacity\(order\.propertyId\) - getTotalStock\(order\.propertyId\) - getPendingUnits\(order\.propertyId\)/);
});
test('accepted customer orders can release finished-goods space without liquidating stock reserved for other accepted orders',()=>{
  const source=fs.readFileSync('src/App.jsx','utf8');
  assert.match(source,/const makeRoomForCustomerOrder = \(orderId\) =>/);
  assert.match(source,/reservedProducts = new Set\(orders\.filter/);
  assert.match(source,/getBusinessSalePrice\(order\.propertyId,item\.product\) \* 0\.8/);
  assert.match(source,/SİPARİŞ İÇİN DEPOYU BOŞALT/);
});
