import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const room=fs.readFileSync('src/ToyShopInterior.jsx','utf8');
const app=fs.readFileSync('src/App.jsx','utf8');
const ui=fs.readFileSync('src/toy-interior.css','utf8');

test('existing 1923 toy shop property remains #48 and is enterable',()=>{
  assert.match(app,/Oyuncakçı.*id:\s*48|if\s*\(id\s*===\s*48\)/);
  assert.match(room,/export const TOY_SHOP_ID=48/);
  assert.match(app,/active\.id === TOY_SHOP_ID/);
  assert.match(app,/<ToyShopInterior property=/);
  assert.match(app,/setToyShopOpen\(true\)/);
  assert.match(app,/setToyShopOpen\(false\)/);
});

test('room includes historic toy models, vitrines, counter and physical shelving',()=>{
  for(const needle of ['toyTrain(','rockingHorse(','doll(','spinningTop(','teddy(','addShelves(','counter','glass','OYUNCAKÇI DÜKKÂNI']){
    assert.ok(room.includes(needle),'missing toy showroom feature: '+needle);
  }
  assert.match(room,/const blocked=.*checkout|const blocked=pos/);
  assert.match(room,/clampToyWalk/);
});

test('walking works on touchscreen and keyboard and cleans up WebGL resources',()=>{
  assert.match(room,/pointerdown/);
  assert.match(room,/touch-action:none/);
  assert.match(room,/keydown/);
  assert.match(room,/Escape|escape/);
  assert.match(room,/requestAnimationFrame/);
  assert.match(room,/ResizeObserver/);
  assert.match(room,/renderer\.dispose\(\)/);
  assert.match(room,/cancelAnimationFrame\(frame\)/);
  assert.match(room,/onExitRef/);
  assert.match(ui,/@media\(max-width:760px\)/);
});

test('interior is exploration only and does not silently mutate economy or ownership',()=>{
  assert.doesNotMatch(room,/setCash|setOwned|supabase\.rpc|purchase_property/);
  assert.match(room,/owned=\{owned\.includes\(TOY_SHOP_ID\)\}/);
  assert.match(room,/stock=\{getTotalStock\(TOY_SHOP_ID\)\}/);
});
