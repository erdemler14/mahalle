import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {getCityPopulation} from '../src/cityLifeEngine.js';
import {
  WATERFRONT_RELOCATIONS,WATERFRONT_NEW_VENUES,
  applyWaterfrontZoning,validateWaterfrontPlacement
} from '../src/waterfrontZoning.js';

// The build applies the commercial-property injection first. Exercise exactly
// the resulting runtime layout, including stable IDs / names and all overrides.
function readBuiltProperties() {
  const file=fs.readFileSync('src/App.jsx','utf8');
  const start=file.indexOf('const properties = [');
  const end=file.indexOf('const SAVE_KEY = ',start);
  assert.ok(start>=0 && end>start,'Could not find built property scene layout');
  assert.ok(file.includes('applyWaterfrontZoning(properties);'), 'The zoning stage is not wired to App.jsx');
  const preamble=file.slice(start,end).replace('const properties = [','var properties = [');
  const sandbox={applyWaterfrontZoning,getCityPopulation};
  vm.runInNewContext(preamble,sandbox,{timeout:1000});
  return sandbox.properties;
}

test('commercial build includes new authentic quay venues as buyable properties',()=>{
  const properties=readBuiltProperties();
  assert.ok(properties.length>=60, 'Expected commercial shop injection before layout test');
  for(const id of [63,64,65,66]) {
    const p=properties.find(p=>p.id===id);
    assert.ok(p, 'Missing new quay shop '+id);
    assert.ok(p.price>0 && p.rent>0 && p.name);
    assert.ok(['İşletme','Ticaret','Depo'].includes(p.type));
    assert.ok(p.x<25.5 && p.x>=20);
  }
});

test('timber mill and Pera design studio are registered as new properties',()=>{
  const properties=readBuiltProperties();
  const timber=properties.find(p=>p.id===82);
  const studio=properties.find(p=>p.id===83);
  assert.ok(timber && timber.type==='Atölye' && timber.price>0);
  assert.ok(studio && studio.type==='İşletme' && studio.price>0);
  const app=fs.readFileSync('src/App.jsx','utf8');
  assert.match(app,/82: \[\{id:'ahsap',name:'Kesilmiş kereste/);
  assert.match(app,/83: \[\{id:'st-mimari-proje',name:'İç mekân/);
  assert.match(app,/getUpstreamMaterialFactor/);
  assert.match(app,/active\.id === 81 \? 5 : 4/);
  assert.match(app,/match:\/pipo\/i,recipe:\[\['karakoy-pipo',1\],\['karakoy-tabaka',1\]\]/);
  const migration=fs.readFileSync('supabase/migrations/202611090002_register_timber_and_design_studio.sql','utf8');
  assert.match(migration,/\(82,'Karaköy Kereste Deposu ve Bıçkıhane'/);
  assert.match(migration,/\(83,'Pera Mimari ve Tezyinat Stüdyosu'/);
});

test('backstreet and non-maritime businesses no longer occupy the Haliç',()=>{
  const props=readBuiltProperties();
  for(const id of [41,56,58,60,62]){
    const property=props.find(p=>p.id===id);
    assert.ok(property,'Missing original property '+id);
    assert.equal(property.x,WATERFRONT_RELOCATIONS[id].x);
    assert.equal(property.z,WATERFRONT_RELOCATIONS[id].z);
  }
  assert.deepEqual(validateWaterfrontPlacement(props),[]);
});

test('zoning preserves save keys, original building prices and ownership ids',()=>{
  const original=readBuiltProperties();
  const props=original.map(p=>({...p}));
  const snapshot=props.map(p=>({id:p.id,name:p.name,price:p.price,rent:p.rent,type:p.type}));
  applyWaterfrontZoning(props);
  applyWaterfrontZoning(props); // repeatable and safe during hot reload
  assert.equal(props.length,original.length);
  assert.deepEqual(props.map(p=>({id:p.id,name:p.name,price:p.price,rent:p.rent,type:p.type})),snapshot);
  assert.equal(new Set(props.map(p=>p.id)).size,props.length);
});

test('new quay properties do not share the same lot centre or overlap existing storefronts',()=>{
  const properties=readBuiltProperties();
  for(const [key,location] of Object.entries(WATERFRONT_NEW_VENUES)){
    const id=Number(key);
    const p=properties.find(p=>p.id===id);
    assert.ok(p);
    const neighbours=properties.filter(other=>other.id!==id).map(other=>({
      id:other.id,
      distance:Math.hypot(other.x-p.x,other.z-p.z)
    })).sort((a,b)=>a.distance-b.distance);
    assert.ok(neighbours[0].distance>3.0, 'Quay parcel '+id+' collides with '+neighbours[0].id+' ('+neighbours[0].distance+')');
  }
});
