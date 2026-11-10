import test from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizePendingProductions,
  countPendingProductionUnits
} from '../src/productionCapacity.js';

test('legacy production jobs without readyAt are repaired and can finish instead of reserving space forever',()=>{
  const now=1_900_000_000_000;
  const normalized=normalizePendingProductions({
    '12:bread':{units:4,productId:'bread',propertyId:12,duration:2500},
    '34:bouquet':{units:2,productId:'bouquet',propertyId:34,readyAt:0,duration:3000}
  },now);
  assert.equal(normalized['12:bread'].readyAt,now+2500);
  assert.equal(normalized['34:bouquet'].readyAt,now+3000);
  assert.equal(countPendingProductionUnits(normalized,12),4);
  assert.equal(countPendingProductionUnits(normalized,34),2);
});

test('empty or unidentifiable jobs are ignored while malformed timestamps are repaired',()=>{
  const now=1_900_000_000_000;
  const normalized=normalizePendingProductions({
    '12:bread':{units:0,productId:'bread',propertyId:12,readyAt:now+1000},
    '12:broken':{units:8,productId:'broken',propertyId:12,readyAt:NaN},
    '12:':{units:3,propertyId:12,readyAt:now+1000},
    'not-a-property:bread':{units:5,productId:'bread',readyAt:now+1000}
  },now);
  assert.deepEqual(Object.keys(normalized),['12:broken']);
  assert.equal(normalized['12:broken'].readyAt,now+2500);
  assert.equal(countPendingProductionUnits(normalized,12),8);
});

test('capacity reservations are isolated by business and count only live, completable jobs',()=>{
  const now=1_900_000_000_000;
  const pending=normalizePendingProductions({
    '12:bread':{units:3,productId:'bread',propertyId:12,readyAt:now+1000},
    '34:bouquet':{units:7,productId:'bouquet',propertyId:34,readyAt:now+1000},
    '12:orphan':{units:9,productId:'orphan',propertyId:12,readyAt:0,duration:2500}
  },now);
  assert.equal(countPendingProductionUnits(pending,12),12);
  assert.equal(countPendingProductionUnits(pending,34),7);
  assert.equal(countPendingProductionUnits(pending,56),0);
});

test('App loads repaired queues and uses one shared capacity counter for all businesses',async()=>{
  const fs=await import('node:fs');
  const app=fs.readFileSync('src/App.jsx','utf8');
  assert.match(app,/normalizePendingProductions\(saved\.pendingProductions\)/);
  assert.match(app,/setPendingProductions\(normalizePendingProductions\(state\.pendingProductions\)\)/);
  assert.match(app,/countPendingProductionUnits\(pendingProductions, propertyId\)/);
  assert.match(app,/getStockCapacity\(propertyId\)/);
});


test('Schumacher bakery and Pera mixed shop have stable product-ID recipes',async()=>{
  const fs=await import('node:fs');
  const app=fs.readFileSync('src/App.jsx','utf8');
  for (const productId of ['sch-ekmek','sch-ozel','pasaj-buket','pasaj-gazete','pasaj-kartpostal']) {
    assert.match(app,new RegExp("'" + productId + "'\\s*:\\s*\\["));
  }
  assert.match(app,/13:\s*\{[\s\S]*?'sch-ekmek':[\s\S]*?'sch-ozel'/);
  assert.match(app,/80:\s*\{[\s\S]*?'pasaj-buket':[\s\S]*?'pasaj-gazete':[\s\S]*?'pasaj-kartpostal'/);
});

test('a stale production-processing lock is released so a stalled job can be retried',async()=>{
  const fs=await import('node:fs');
  const app=fs.readFileSync('src/App.jsx','utf8');
  assert.match(app,/setTimeout\(\(\) => \{ delete productionProcessingRef\.current\[lockKey\]; \}, 1200\)/);
  assert.match(app,/if \(completedUnits <= 0\) \{\s*delete productionProcessingRef\.current\[lockKey\]/);
});


test('non-professional service venues sell all unlocked services without a selected plan',async()=>{
  const fs=await import('node:fs');
  const app=fs.readFileSync('src/App.jsx','utf8');
  assert.match(app,/if \(serviceSale && \[42,43,44,45,46,47\]\.includes\(Number\(propertyId\)\) && businessPlans\[propertyId\] !== product\.id\) return/);
  assert.match(app,/40:\s*\[[\s\S]*?id:'hamam-giris'[\s\S]*?service:true[\s\S]*?id:'kese'[\s\S]*?service:true/);
  assert.match(app,/72:\s*\[\{id:'elhamra-bilet'[\s\S]*?service:true/);
  assert.match(app,/74:\s*\[\{id:'tokatliyan-oda'[\s\S]*?service:true/);
});

test('professional offices retain their explicitly selected service model',async()=>{
  const fs=await import('node:fs');
  const app=fs.readFileSync('src/App.jsx','utf8');
  assert.match(app,/MESLEKİ HİZMET OFİSİ/);
  assert.match(app,/HİZMETİ SEÇ/);
  assert.match(app,/Hizmetler müşteri talebine göre otomatik sunulur/);
});


test('service venues enforce daily capacity across hourly sales and preserve usage for the game day',async()=>{
  const fs=await import('node:fs');
  const app=fs.readFileSync('src/App.jsx','utf8');
  for (const config of ["40:{'hamam-giris':36,'kese':18}","72:{'elhamra-bilet':96,'elhamra-loca':20}","74:{'tokatliyan-oda':24,'tokatliyan-suit':8,'tokatliyan-salon':2}"]) {
    assert.ok(app.includes(config), 'missing venue capacity: ' + config);
  }
  assert.match(app,/serviceCapacityDate === serviceDateKey/);
  assert.match(app,/serviceCapacityUsed/);
  assert.match(app,/capacityRemaining <= 0/);
  assert.match(app,/serviceDemandUnits/);
});

test('service venues do not require warehouse stock to sell admission and lodging services',async()=>{
  const fs=await import('node:fs');
  const app=fs.readFileSync('src/App.jsx','utf8');
  assert.match(app,/if \(product\?\.service\) return \[\]/);
  assert.ok(app.includes('const serviceOperatingCost ='), 'service venue operating-cost schedule is missing');
  for (const entry of ['33:8','35:18','40:12','55:10','56:18','57:16','58:20','60:12','61:8','63:10','66:8','72:16','73:24','74:22','75:8']) {
    assert.ok(app.includes(entry), 'missing service operating-cost entry ' + entry);
  }
  assert.match(app,/Number\(serviceDailyCapacity\[propertyId\]\?\.\[product\.id\]\) \|\| 24/);
});
