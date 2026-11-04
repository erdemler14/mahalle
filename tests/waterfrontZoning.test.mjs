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
