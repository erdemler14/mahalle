import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {
  getCityPopulation,visitIntent,customerFlow,getSupplyModifier,
  storyForDay,applyStoryDecision,normalizeNeighborhood,neighborhoodPulse,
  walkWaypoints,interpolateWaypoints,isBusinessOpen
} from '../src/cityLifeEngine.js';
import {createLivingResidents,stepResident,WALK_SPEED,MAX_RENDERED_RESIDENTS} from '../src/livingResidents3d.js';

const properties=[
  {id:1,name:'Pera Apartmanı',x:-8.8,z:1,type:'Konut',floors:3},
  {id:2,name:'Karaköy Konutu',x:8.8,z:2,type:'Konut',floors:2},
  {id:3,name:'İskele Kahvesi',x:23.1,z:-17,type:'İşletme',floors:2},
  {id:4,name:'Pera Pastanesi',x:-8.7,z:-4,type:'İşletme',floors:3},
  {id:5,name:'Rıhtım Ambarı',x:23.1,z:16,type:'Depo',floors:2},
  {id:6,name:'Matbaa',x:8.9,z:-12,type:'Atölye',floors:2},
  {id:7,name:'Arka Sokak Meyhanesi',x:-18.6,z:22,type:'İşletme',floors:2}
];
const clock={year:1923,month:10,day:13,hour:12};

test('residents have stable assigned home and workplace and reach the right shops',()=>{
  const population=getCityPopulation(properties,80);
  assert.equal(population.length,80);
  assert.deepEqual(population,getCityPopulation(properties,80));
  for(const person of population){
    assert.ok([1,2].includes(person.homeId));
    assert.ok([3,4,5,6,7].includes(person.workId));
    const visit=visitIntent(person,clock,properties);
    assert.ok(visit?.from && visit.to);
    assert.ok(visit.purpose==='shop');
    assert.equal(isBusinessOpen(visit.to,clock.hour),true);
    const path=walkWaypoints(visit.from,visit.to);
    const first=interpolateWaypoints(path,0);
    const last=interpolateWaypoints(path,1);
    assert.ok(Number.isFinite(first.x)&&Number.isFinite(last.z));
    assert.ok(Math.abs(first.x-last.x)<80);
  }
});

test('people visit open businesses at lunch and do not buy from shops at night',()=>{
  const population=getCityPopulation(properties);
  const p=properties[2];
  const midday=customerFlow({property:p,clock,properties,population,neighborhood:{reputation:50,supplyTrust:50},ferryBusiness:{owned:false}});
  const ferry=customerFlow({property:p,clock,properties,population,neighborhood:{reputation:75,supplyTrust:80},ferryBusiness:{owned:true,upgrades:{secondFerry:true,cargoHold:true}}});
  assert.ok(midday.visits>=0);
  assert.ok(ferry.footTraffic>midday.footTraffic);
  assert.ok(ferry.demand>midday.demand);
  assert.ok(ferry.supplyModifier<midday.supplyModifier);
  assert.equal(customerFlow({property:p,clock:{...clock,hour:3},properties,population,neighborhood:{},ferryBusiness:{}}).visits,0);
  const pulse=neighborhoodPulse({properties,clock,ferryBusiness:{owned:true},neighborhood:{reputation:51,supplyTrust:52}});
  assert.ok(pulse.totalVisitors>0);
  assert.equal(pulse.footfall.length,5);
});

test('tender, ferry, and neighborhood reputation directly affect supply price',()=>{
  const p=properties[4];
  const standard=getSupplyModifier(p,{neighborhood:{reputation:50,supplyTrust:50},ferryBusiness:{}});
  const good=getSupplyModifier(p,{neighborhood:{reputation:85,supplyTrust:80},ferryBusiness:{owned:true,upgrades:{cargoHold:true}}});
  assert.ok(good<standard);
  assert.ok(standard>=.78&&standard<=1.2);
});

test('historical moments appear only on the documented 1923 date, otherwise stories are labeled fiction',()=>{
  for(const [day,match] of [[6,'İstanbul'],[13,'Başkent'],[26,'Maç'],[29,'Cumhuriyet']]){
    const story=storyForDay({year:1923,month:10,day,hour:10});
    assert.equal(story.historical,true);
    assert.ok(story.title.includes(match));
    assert.match(story.source,/https:/);
  }
  const story=storyForDay({year:1924,month:10,day:29,hour:10});
  assert.equal(story.historical,false);
});

test('story choices cost real money once and durably alter reputation and supplier trust',()=>{
  const story=storyForDay(clock);
  const previous=normalizeNeighborhood(null);
  const accepted=applyStoryDecision(previous,story,story.choices[0].id,100);
  assert.equal(accepted.applied,true);
  assert.ok(accepted.cost>0);
  assert.ok(accepted.state.reputation>previous.reputation);
  const repeat=applyStoryDecision(accepted.state,story,story.choices[1].id,100);
  assert.equal(repeat.applied,false);
  assert.equal(repeat.reason,'already');
  const poor=applyStoryDecision(previous,story,story.choices[0].id,0);
  assert.equal(poor.reason,'funds');
  assert.equal(poor.cost,0);
  const different=storyForDay({...clock,day:14});
  assert.notEqual(different.key,story.key);
});

test('first-person visual characters update without WebGL or a browser',()=>{
  const scene=new THREE.Scene();
  const city=createLivingResidents({scene,properties,isMobile:true});
  assert.ok(city.residents >= MAX_RENDERED_RESIDENTS.mobile + 1); // Keeps all named historic figures plus the player's visible roaming persona on mobile.
  city.update({clock,elapsed:10,delta:.017,weather:{raining:false}});
  city.update({clock,elapsed:11,delta:.017,weather:{raining:false}});
  assert.ok(scene.children.some(object=>object.visible));
});

test('residents walk slowly with bounded movement and retain positions',()=>{
  assert.ok(WALK_SPEED<=0.75);
  assert.ok(MAX_RENDERED_RESIDENTS.mobile<=18);
  assert.ok(MAX_RENDERED_RESIDENTS.desktop<=40);
  const npc={
    group:{position:{x:0,y:0,z:0},rotation:{y:0}},
    path:[{x:0,z:0},{x:14,z:0}],nextPoint:1,journeySpeed:1
  };
  stepResident(npc,0.1);
  const first=npc.group.position.x;
  assert.ok(first>0&&first<0.1);
  stepResident(npc,0.1);
  assert.ok(npc.group.position.x>first);
  assert.ok(npc.group.position.x<0.2);
  stepResident(npc,50); // a suspended tab cannot teleport NPCs.
  assert.ok(npc.group.position.x<0.4);
});

test('NPCs stay in place across game-hour boundaries until they move',()=>{
  const scene=new THREE.Scene();
  const city=createLivingResidents({scene,properties,isMobile:true});
  const first=scene.children[0];
  city.update({clock,elapsed:1,delta:.016});
  city.update({clock,elapsed:1.016,delta:.016});
  const before={x:first.position.x,z:first.position.z};
  city.update({clock:{...clock,hour:clock.hour+1},elapsed:1.032,delta:.016});
  assert.ok(Math.hypot(first.position.x-before.x,first.position.z-before.z)<0.2);
});

test('business catalog audit catches missing recipes, foreign materials, invalid quantities and duplicate IDs', async () => {
  const { validateBusinessCatalog } = await import('../src/businessCatalogValidation.js');
  const properties = [{ id: 3, name: 'Deniz Levazımatçısı' }, { id: 34, name: 'Çiçekçi' }];
  const catalog = {
    3: [
      { id: 'rope', name: 'Halat', price: 10 },
      { id: 'sail', name: 'Yelken', price: 20 },
      { id: 'bad', name: 'Bozuk ürün', price: 5 },
      { id: 'rope', name: 'Tekrar halat', price: 10 }
    ],
    34: [{ id: 'hotel-flowers', name: 'Otel çiçek aboneliği', price: 30 }]
  };
  const profiles = {
    3: { materials: [{ id: 'hemp' }, { id: 'canvas' }] },
    34: { materials: [{ id: 'fresh-flower' }] }
  };
  const recipes = {
    '3:rope': [{ id: 'hemp', qty: 1 }],
    '3:sail': [{ id: 'unknown-canvas', qty: 1 }],
    '3:bad': [{ id: 'canvas', qty: 0 }],
    '34:hotel-flowers': []
  };
  const issues = validateBusinessCatalog({
    properties, catalog,
    getProfile: id => profiles[id],
    getRecipe: (id, product) => recipes[id + ':' + product.id] || []
  });
  assert.deepEqual(issues.map(issue => issue.code).sort(), [
    'duplicate-product-id', 'invalid-quantity', 'missing-recipe', 'unknown-material'
  ]);
});

test('business catalog audit accepts complete shop-specific recipes and skips service-only offices', async () => {
  const { validateBusinessCatalog } = await import('../src/businessCatalogValidation.js');
  const issues = validateBusinessCatalog({
    properties: [{ id: 34, name: 'Çiçekçi' }, { id: 43, name: 'Hukuk Bürosu' }],
    catalog: {
      34: [{ id: 'bouquet', name: 'Buket', price: 12 }],
      43: [{ id: 'consult', name: 'Danışmanlık', price: 25, service: true }]
    },
    getProfile: id => id === 34 ? { materials: [{ id: 'flower' }] } : { materials: [] },
    getRecipe: () => [{ id: 'flower', qty: 2 }],
    exemptPropertyIds: [43]
  });
  assert.deepEqual(issues, []);
});
