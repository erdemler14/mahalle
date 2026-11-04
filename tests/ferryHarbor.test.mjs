import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {
  FERRY_LICENSE_PRICE, FERRY_UPGRADES, normaliseFerryBusiness,
  calculateFerryDay, applyFerrySettlement
} from '../src/ferryBusiness.js';
import { createHarborScene } from '../src/harborScene.js';

test('Haliç ferry license costs exactly ₺200 and four upgrades have unique IDs', () => {
  assert.equal(FERRY_LICENSE_PRICE,200);
  assert.equal(FERRY_UPGRADES.length,4);
  assert.equal(new Set(FERRY_UPGRADES.map(x=>x.id)).size,4);
  assert.equal(FERRY_UPGRADES.find(x=>x.id==='ticketOffice').price,35);
  assert.equal(FERRY_UPGRADES.find(x=>x.id==='secondFerry').price,90);
});

test('no ferry revenue before purchase, deterministic profits after purchase', () => {
  const date={year:1923,month:10,day:5};
  const none=calculateFerryDay(null,date);
  assert.equal(none.net,0);
  assert.equal(none.skipped,true);
  const license=normaliseFerryBusiness({owned:true,upgrades:{}});
  const first=calculateFerryDay(license,date);
  const second=calculateFerryDay(license,date);
  assert.deepEqual(first,second);
  assert.ok(first.gross>first.cost);
  assert.ok(first.passengers>0);
  assert.equal(first.net,Math.round((first.gross-first.cost)*100)/100);
});

test('daily settlement cannot pay twice for the same calendar day', () => {
  const state=normaliseFerryBusiness({owned:true});
  const first=calculateFerryDay(state,{year:1923,month:10,day:6});
  const settled=applyFerrySettlement(state,first);
  assert.equal(settled.daysOperated,1);
  assert.equal(settled.totalNet,first.net);
  const again=calculateFerryDay(settled,{year:1923,month:10,day:6});
  assert.equal(again.skipped,true);
  assert.deepEqual(applyFerrySettlement(settled,first),settled);
  const next=calculateFerryDay(settled,{year:1923,month:10,day:7});
  const twice=applyFerrySettlement(settled,next);
  assert.equal(twice.daysOperated,2);
  assert.equal(twice.totalNet,Math.round((first.net+next.net)*100)/100);
});

test('upgrades change ferry passengers or transport revenue',()=>{
  const date={year:1923,month:10,day:9};
  const base=calculateFerryDay({owned:true,upgrades:{}},date);
  const full=calculateFerryDay({owned:true,upgrades:{ticketOffice:true,secondFerry:true,nightService:true,cargoHold:true}},date);
  assert.ok(full.passengers>base.passengers);
  assert.ok(full.gross>base.gross);
  assert.ok(full.cost>base.cost);
});

test('waterfront renders a supported bridge, docks and a second steamer on upgrade',()=>{
  const scene=new THREE.Scene();
  const oldFerry=new THREE.Group();scene.add(oldFerry);
  const ferryStateRef={current:{owned:false,upgrades:{}}};
  const harbor=createHarborScene({scene,oldFerry,isMobile:true,ferryStateRef});
  assert.equal(oldFerry.visible,false);
  assert.ok(harbor.bridge.group.children.length>20);
  assert.ok(harbor.coast.group.children.length>25);
  harbor.update({hour:12,elapsed:1,day:1,month:1});
  assert.equal(harbor.steamer.boat.visible,true);
  assert.equal(harbor.second.boat.visible,false);
  assert.equal(harbor.steamer.boat.position.y>-.1,true);
  assert.ok(Math.abs(harbor.steamer.boat.position.x-30)<12);
  ferryStateRef.current={owned:true,upgrades:{secondFerry:true,ticketOffice:true,cargoHold:true}};
  harbor.update({hour:12,elapsed:12,day:1,month:1});
  assert.equal(harbor.second.boat.visible,true);
  assert.equal(harbor.steamer.boat.visible,true);
  harbor.dispose();
  assert.equal(oldFerry.visible,true);
});
