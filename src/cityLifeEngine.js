// Mahalle — shared deterministic city-life and demand model.
// Game-calendar time (30-day months) is fictional; historic 1923 dates are
// explicitly marked historical, while day-to-day shop stories are fiction.
export const clamp = (v,a,b)=>Math.max(a,Math.min(b,Number(v)||0));
const round2 = v=>Math.round((Number(v)||0)*100)/100;
const hash = n=>{const x=Math.sin(n*127.192+35.74)*43758.5453;return x-Math.floor(x);};

export const CITY_LIFE_VERSION=1;
export const PEOPLE_POOL_SIZE=180;
export const DEFAULT_NEIGHBORHOOD=Object.freeze({
  reputation:50, supplyTrust:50, choices:{}, lastOutcome:''
});
export function normalizeNeighborhood(raw) {
  const x=raw&&typeof raw==='object'?raw:{};
  return {
    reputation:clamp(x.reputation??50,0,100),
    supplyTrust:clamp(x.supplyTrust??50,0,100),
    choices:x.choices&&typeof x.choices==='object'&&!Array.isArray(x.choices)?{...x.choices}:{},
    lastOutcome:String(x.lastOutcome||'').slice(0,280)
  };
}

const categories={
  food:/kahve|kahvehane|kafe|pastane|fırın|firin|lokanta|meyhane|gazino|erzak|manav|balık|balik|şarap|sarap|büfe|bufe|tatlı/i,
  market:/gazete|tütün|tutun|kitap|terzi|kumaş|kumas|çiçek|cicek|kundura|saatçi|saatci|sabun|eczane|levazımat/i,
  leisure:/meyhane|gazino|sinema|salon|kahve|otel|lokanta|pastane|hamam/i,
  industry:/matbaa|atölye|atolye|depo|ambar|dokuma|kundura|marangoz|demirci|imalathane/i,
  maritime:/deniz|rıhtım|rihtim|iskele|gemi|yelken|liman|levazımat|levazimat|tekne|halat/i,
  flowers:/çiçek|cicek|çiçekçi|cicekci|buket|aranjman|orkide/i
};
export function businessClass(p) {
  const str=String(p?.name||'')+' '+String(p?.style||'');
  if(categories.maritime.test(str))return 'maritime';
  if(categories.flowers.test(str))return 'flowers';
  if(categories.food.test(str))return 'food';
  if(categories.industry.test(str))return 'industry';
  if(categories.leisure.test(str))return 'leisure';
  if(categories.market.test(str))return 'market';
  return p?.type==='Konut'?'home':'market';
}

// Derived city indices make demand respond to the actual neighbourhood state.
export function getCityEconomicProfile({properties=[],clock={},ferryBusiness={},tramwayBusiness={},neighborhood={}}={}) {export function calculateMarketPrice({basePrice=0,demandMultiplier=1,stock=0,targetStock=10}={}) {
  const demand=clamp(demandMultiplier,.65,1.65);
  const inventory=Math.max(0,Number(stock)||0);
  const target=Math.max(1,Number(targetStock)||10);
  const scarcity=clamp(1.18-(inventory/(target*2))*.36,.82,1.18);
  const demandEffect=clamp(.82+(demand-1)*.48,.72,1.30);
  const index=clamp(demandEffect*scarcity,.72,1.52);
  return round2(Math.max(0,Number(basePrice)||0)*index);
}
export function calculateSupplyCostFactor({stock=0,targetStock=12}={}) {
  const inventory=Math.max(0,Number(stock)||0);
  const target=Math.max(1,Number(targetStock)||12);
  return round2(clamp(1.2-(inventory/(target*2))*.4,.82,1.22));
}


  const shops=properties.filter(p=>['Ticaret','Atölye','İşletme','Depo'].includes(p.type));
  const homes=properties.filter(p=>p.type==='Konut');
  const lodging=shops.filter(p=>/otel|han|pansiyon|konaklama/i.test(p.name||'')).length;
  const leisure=shops.filter(p=>/gazino|sinema|kahve|kahvehane|meyhane|hamam|lokanta|pastane/i.test(p.name||'')).length;
  const portBusinesses=shops.filter(p=>businessClass(p)==='maritime'||(p.x>=19&&p.x<=26)).length;
  const luxury=shops.filter(p=>/parfüm|parfum|mücevher|lüks|salon|balosu|gramofon/i.test(p.name||'')).length;
  const residentialUnits=homes.reduce((sum,p)=>sum+Math.max(1,Number(p.units)||Number(p.floors)||1),0);
  const state=normalizeNeighborhood(neighborhood);
  const summer=[5,6,7,8].includes(Number(clock.month)||0);
  const population=clamp(22+homes.length*5+residentialUnits*.65+shops.length*.35,10,100);
  const portActivity=clamp(12+portBusinesses*13+(ferryBusiness?.owned?24:0)+(ferryBusiness?.upgrades?.cargoHold?8:0)+(ferryBusiness?.upgrades?.secondFerry?7:0),5,100);
  const tourism=clamp(8+lodging*13+leisure*5+(ferryBusiness?.owned?18:0)+(tramwayBusiness?.owned?8:0)+(summer?12:0)+state.reputation*.18,5,100);
  const purchasingPower=clamp(18+state.reputation*.42+shops.length*1.1+luxury*5,5,100);
  const multiplier=value=>round2(clamp(value,.72,1.48));
  const demand={
    food:multiplier(.72+population*.0032+tourism*.0028),
    market:multiplier(.76+population*.0025+purchasingPower*.0027),
    leisure:multiplier(.66+tourism*.0062+purchasingPower*.0018),
    industry:multiplier(.78+portActivity*.0028+shops.length*.003),
    maritime:multiplier(.58+portActivity*.0085+tourism*.0012),
    flowers:multiplier(.68+tourism*.005+purchasingPower*.0022),home:1
  };
  return {population:Math.round(population),portActivity:Math.round(portActivity),tourism:Math.round(tourism),purchasingPower:Math.round(purchasingPower),season:summer?'yaz':'normal',demand};
}

export const historicMoments=[
  {
    date:'1923-10-06',id:'istanbul-kurtulus',title:'İstanbul’da Yeni Bir Sabah',
    historical:true,source:'https://www.ktb.gov.tr/TR-96330/1923.html',
    subtitle:'6 Ekim 1923 · İstanbul’un yönetimi Türk birliklerine geçti.',
    story:'Sokakta gazeteler elden ele dolaşıyor. Matbaacı sabah baskısına yetişmek isterken vapur yolcuları haberleri soruyor. Esnafın nasıl yardım edeceğine sen karar ver.',
    choices:[
      {id:'baski',label:'Gazete baskısına destek ol',cost:12,reputation:7,supplyTrust:2,reply:'Mahalle haberleri daha hızlı öğrendi; matbaacı ve esnaf seni tanıyor.'},
      {id:'sokak',label:'Sokakta haberleri paylaş',cost:4,reputation:4,supplyTrust:0,reply:'Mahalle sakinleri iskele ve tramvay durağında konuşmaya başladı.'},
      {id:'izle',label:'Dükkân düzenini sürdür',cost:0,reputation:0,supplyTrust:0,reply:'Mahallenin gelişmelerini izledin; kasanı korudun.'}
    ]
  },
  {
    date:'1923-10-13',id:'baskent-haberleri',title:'Başkentten Gelen Haber',
    historical:true,source:'https://www.ktb.gov.tr/TR-96330/1923.html',
    subtitle:'13 Ekim 1923 · Ankara başkent ilan edildi.',
    story:'İskelede ve kahvehanelerde Ankara haberi konuşuluyor. Uzak şehirlere giden evrak ve telgraflar için ticarethanelerin yardımı gerekiyor.',
    choices:[
      {id:'posta',label:'Posta taşımaya destek ver',cost:16,reputation:3,supplyTrust:9,reply:'Rıhtım ve posta esnafı arasındaki tedarik ilişkisi güçlendi.'},
      {id:'kahve',label:'Haberleri kahvehanede paylaş',cost:6,reputation:6,supplyTrust:1,reply:'Kahvehanelerdeki sohbetler ve mahalle itibarı canlandı.'},
      {id:'bekle',label:'Ticari hazırlığını sürdür',cost:0,reputation:0,supplyTrust:0,reply:'Haberleri izleyip günlük düzenini sürdürdün.'}
    ]
  },
  {
    date:'1923-10-26',id:'ilk-milli-mac',title:'Taksim’de Maç Günü',
    historical:true,source:'https://www.tff.org/default.aspx?ftxtID=42530&pageID=202',
    subtitle:'26 Ekim 1923 · Türkiye–Romanya maçı Taksim Stadı’nda oynandı (2–2).',
    story:'Maça giden kalabalık tramvay duraklarını dolduruyor. Fırıncı ve kahveciler ikramlara yetişmeye çalışıyor.',
    choices:[
      {id:'ikram',label:'İkram tezgâhına yardım et',cost:10,reputation:5,supplyTrust:2,reply:'Maç seyircileri dükkânları tanıdı; sokakta yeni müşteriler var.'},
      {id:'tasima',label:'Ulaşımı kolaylaştır',cost:14,reputation:3,supplyTrust:6,reply:'Yolcuların ve mal taşıyanların ulaşımını kolaylaştırdın.'},
      {id:'seyret',label:'Maç günü kalabalığını izle',cost:0,reputation:0,supplyTrust:0,reply:'Kalabalığın geçişini izleyip planlarını gözden geçirdin.'}
    ]
  },
  {
    date:'1923-10-29',id:'cumhuriyet-haberi',title:'Cumhuriyet İlan Edildi',
    historical:true,source:'https://www.ktb.gov.tr/TR-96330/1923.html',
    subtitle:'29 Ekim 1923 · Cumhuriyet ilan edildi.',
    story:'Akşam gelen telgraf ve gazete haberleri mahallede yayılıyor. Eczacı, matbaacı ve kahveci, ertesi günün hazırlıklarını konuşuyor.',
    choices:[
      {id:'ilan',label:'Mahalle ilanına katkıda bulun',cost:14,reputation:8,supplyTrust:1,reply:'Mahalledeki ilan ve haber ağını destekledin.'},
      {id:'yardim',label:'Esnafın tedarik işlerini üstlen',cost:10,reputation:3,supplyTrust:8,reply:'Ticarethaneler hazırlıklarını zamanında tamamladı.'},
      {id:'izle',label:'Geceyi sokakta geçir',cost:0,reputation:1,supplyTrust:0,reply:'Şehirdeki değişimi izledin; ertesi sabah yeni güne hazırlanacaksın.'}
    ]
  }
];

const everydayStories=[
  {id:'hamal-kasa',title:'Rıhtımda Kayıp Sandık',subtitle:'Kurgusal mahalle hikâyesi',story:'İki hamal yanlış iskeleye bırakılan bir sandığı arıyor. Dükkânların teslimatı gecikmemeli.',choices:[
    {id:'yardim',label:'Taşımaya yardım et',cost:8,reputation:2,supplyTrust:6,reply:'Kayıp sandık rıhtım ambarına ulaştı; tedarik güveni arttı.'},
    {id:'duyur',label:'Haberciye ilan ver',cost:4,reputation:4,supplyTrust:1,reply:'Haber birkaç sokağa yayıldı; mahalle dayanışması güçlendi.'},
    {id:'hayir',label:'Bugün işletmene odaklan',cost:0,reputation:0,supplyTrust:0,reply:'Sandığın bulunmasını başka esnafa bıraktın.'}]},
  {id:'pastane-kuyrugu',title:'Fırın Önündeki Sıra',subtitle:'Kurgusal mahalle hikâyesi',story:'Sabah fırının önündeki sıra uzuyor. Kahveci, elindeki boş masaları yolcular için açmayı düşünüyor.',choices:[
    {id:'masa',label:'Bekleme masaları kur',cost:7,reputation:5,supplyTrust:0,reply:'Sokak daha düzenli hale geldi; dükkânlar yeni müşteriler kazandı.'},
    {id:'paylas',label:'Fırına malzeme taşı',cost:9,reputation:2,supplyTrust:5,reply:'Fırının eksik malzemesi yetişti.'},
    {id:'gec',label:'Sıranın dağılmasını bekle',cost:0,reputation:0,supplyTrust:0,reply:'Sabah yoğunluğu yavaş yavaş geçti.'}]},
  {id:'tramvay-duragi',title:'Tramvay Durağında Telaş',subtitle:'Kurgusal mahalle hikâyesi',story:'Durağın yanındaki büfeye gazete yetişmedi. Çırak hızlı bir teslimat rotası arıyor.',choices:[
    {id:'araba',label:'Yük arabası ayarla',cost:10,reputation:2,supplyTrust:7,reply:'Gazete büfesinin sefer öncesi teslimatı tamamlandı.'},
    {id:'komsu',label:'Komşu esnafı bir araya getir',cost:5,reputation:5,supplyTrust:2,reply:'Esnaf arasında ortak bir teslimat düzeni kuruldu.'},
    {id:'bekle',label:'Sıradaki tramvayı bekle',cost:0,reputation:0,supplyTrust:0,reply:'Çırak ilk fırsatta malzemeleri teslim etti.'}]},
  {id:'pazar-yagmuru',title:'Pazar Yeri Düzenleniyor',subtitle:'Kurgusal mahalle hikâyesi',story:'Sokakta tezgâhlar çoğaldı. Esnaf malları daha iyi sergilemek için yardımlaşmak istiyor.',choices:[
    {id:'tente',label:'Ortak tente kur',cost:11,reputation:5,supplyTrust:3,reply:'Tezgâhlar yağmura karşı hazırlıklı; sokak alışverişi canlandı.'},
    {id:'kasa',label:'Kasaları güvene al',cost:6,reputation:1,supplyTrust:5,reply:'Pazar tedarikinin aksaması önlendi.'},
    {id:'izle',label:'Önce talebi gözle',cost:0,reputation:0,supplyTrust:0,reply:'Esnafın çalışma düzenini gözlemledin.'}]},
  {id:'iskele-kahvesi',title:'İskele Kahvesi Kalabalık',subtitle:'Kurgusal mahalle hikâyesi',story:'Vapur seferi öncesinde yolcular kahvehanede yer arıyor. Kıyıdaki dükkânlar farklı çözümler öneriyor.',choices:[
    {id:'oturma',label:'Ek oturma yeri aç',cost:8,reputation:6,supplyTrust:0,reply:'Vapur yolcuları esnafı konuşuyor; mahalle itibarı arttı.'},
    {id:'servis',label:'Kahve ve çay taşı',cost:6,reputation:3,supplyTrust:3,reply:'İskele kahvesi yolculara yetişti.'},
    {id:'bekle',label:'Seferin kalkmasını bekle',cost:0,reputation:0,supplyTrust:0,reply:'Kısa süre sonra iskele boşaldı.'}]},
  {id:'matbaa-siparis',title:'Matbaacıda Son Baskı',subtitle:'Kurgusal mahalle hikâyesi',story:'Matbaacı yeni ilanları yetiştirmek için kâğıt ve mürekkep arıyor. Kıyıdan gelecek sevkiyat gecikirse sipariş aksayabilir.',choices:[
    {id:'murekkep',label:'Mürekkep sevkiyatını destekle',cost:12,reputation:2,supplyTrust:7,reply:'Matbaa siparişini yetiştirdi; tedarikçiler daha güvenilir.'},
    {id:'ilan',label:'İlanları mahalleye dağıt',cost:5,reputation:5,supplyTrust:1,reply:'Dükkânlar birbirinin açılışını duyurabildi.'},
    {id:'bekle',label:'Şimdilik müdahale etme',cost:0,reputation:0,supplyTrust:0,reply:'Matbaacı kendi imkânıyla baskıyı tamamladı.'}]}
];

export function cityDateKey({year=1923,month=10,day=1}) {
  return [year,String(month).padStart(2,'0'),String(day).padStart(2,'0')].join('-');
}
export function storyForDay(clock) {
  const key=cityDateKey(clock);
  const special=historicMoments.find(e=>e.date===key);
  const index=((clock.year-1923)*360+(clock.month-1)*30+clock.day+2);
  const generic=everydayStories[((index%everydayStories.length)+everydayStories.length)%everydayStories.length];
  return {...(special||generic),key:key+':'+(special?.id||generic.id),historical:!!special,
    source:special?.source||null};
}
export function applyStoryDecision(raw,story,choiceId,cash=0) {
  const current=normalizeNeighborhood(raw);
  if(!story||current.choices[story.key])return {state:current,cost:0,applied:false,reason:'already'};
  const option=story.choices.find(x=>x.id===choiceId);
  if(!option)return {state:current,cost:0,applied:false,reason:'invalid'};
  if(Number(cash)<option.cost)return {state:current,cost:0,applied:false,reason:'funds'};
  const next={
    ...current,reputation:clamp(current.reputation+option.reputation,0,100),
    supplyTrust:clamp(current.supplyTrust+option.supplyTrust,0,100),
    choices:{...current.choices,[story.key]:{id:option.id,label:option.label,reply:option.reply,
      cost:option.cost,reputation:option.reputation,supplyTrust:option.supplyTrust}},
    lastOutcome:option.reply
  };
  return {state:next,cost:option.cost,applied:true,reason:'ok',choice:option};
}

export function isBusinessOpen(property,hour) {
  const name=String(property?.name||'');
  const h=Number(hour);
  if(categories.food.test(name)){
    if(/meyhane|gazino|sinema|musiki/i.test(name))return h>=16&&h<24;
    if(/fırın|firin|pastane/i.test(name))return h>=5&&h<19;
    return h>=7&&h<23;
  }
  if(/hamam|otel/i.test(name))return h>=6&&h<23;
  if(/eczane/i.test(name))return h>=8&&h<21;
  return h>=8&&h<20;
}

export function getCityPopulation(properties,count=PEOPLE_POOL_SIZE) {
  const homes=properties.filter(p=>p.type==='Konut');
  const stores=properties.filter(p=>['İşletme','Ticaret','Depo','Atölye'].includes(p.type));
  if(!homes.length||!stores.length)return [];
  return Array.from({length:count},(_,i)=>{
    const role=i%13===0?'porter':i%9===0?'student':i%7===0?'vendor':i%5===0?'artisan':'resident';
    return {
      id:i,role,
      homeId:homes[(i*17+3)%homes.length].id,
      workId:stores[(i*11+5)%stores.length].id,
      leisurePreference:i%4,offset:i%11,budget:2+(i%7)*2,
      journeySpeed:0.8+(i%5)*.12
    };
  });
}
export function visitIntent(person,clock,properties) {
  const hour=clock.hour;
  const houses=properties.filter(p=>p.type==='Konut');
  const businesses=properties.filter(p=>['İşletme','Ticaret','Atölye','Depo'].includes(p.type));
  const home=properties.find(p=>p.id===person.homeId)||houses[0];
  const work=properties.find(p=>p.id===person.workId)||businesses[0];
  if(!home||!work)return null;
  const hourOffset=person.offset%3;
  if(hour<6||hour>=23)return {from:home,to:home,purpose:'home'};
  if(hour===6||hour===7||hour===8+hourOffset)return {from:home,to:work,purpose:'commute'};
  if(hour>=9&&hour<12)return {from:work,to:work,purpose:'work'};
  if(hour>=12&&hour<14)return {from:work,to:selectShop(person,clock,properties,work,'food'),purpose:'shop'};
  if(hour>=14&&hour<17)return {from:work,to:work,purpose:'work'};
  if(hour>=17&&hour<20)return {from:work,to:selectShop(person,clock,properties,home,'market'),purpose:'shop'};
  if(hour>=20&&hour<22)return {from:work,to:selectShop(person,clock,properties,home,'leisure'),purpose:'shop'};
  return {from:work,to:home,purpose:'home'};
}
function selectShop(person,clock,properties,origin,category) {
  let shops=properties.filter(p=>['İşletme','Ticaret','Depo','Atölye'].includes(p.type)
    && isBusinessOpen(p,clock.hour)
    && (category==='market'?businessClass(p)!=='industry':businessClass(p)===category||businessClass(p)==='food'));
  if(!shops.length)shops=properties.filter(p=>['İşletme','Ticaret'].includes(p.type)&&isBusinessOpen(p,clock.hour));
  if(!shops.length)return origin;
  const ranked=shops.map(p=>({p,
    weight:Math.hypot((p.x-origin.x)*.75,(p.z-origin.z))+.25*hash(p.id*17+person.id+clock.day)*15
      +(p.id===person.workId?20:0)
  })).sort((a,b)=>a.weight-b.weight);
  return ranked[(person.id+clock.day+clock.hour)%Math.min(5,ranked.length)].p;
}
export function streetLaneX(x){
  if(x<=-13)return -15.6;
  if(x<0)return -5.2;
  if(x<13)return 5.2;
  if(x<21)return 15.5;
  return 23.2;
}
export function doorway(p) {
  const facing=p.x<0?1:-1;
  return {x:p.x+facing*((Number(p.depth)||1.9)*.5+.64),z:p.z};
}
export function walkWaypoints(from,to) {
  if(!from||!to)return [];
  const a=doorway(from),b=doorway(to),la=streetLaneX(from.x),lb=streetLaneX(to.x);
  const intersection=([-22,-13,-4,5,14,23,29]).reduce((best,cur)=>
    Math.abs(cur-(a.z+b.z)/2)<Math.abs(best-(a.z+b.z)/2)?cur:best,-22);
  const pts=[a,{x:la,z:a.z}];
  if(Math.abs(la-lb)>0.1){
    pts.push({x:la,z:intersection},{x:lb,z:intersection});
  }
  pts.push({x:lb,z:b.z},b);
  return pts.filter((p,i)=>!i||Math.hypot(p.x-pts[i-1].x,p.z-pts[i-1].z)>.05);
}
export function interpolateWaypoints(points,progress){
  if(!points.length)return {x:0,z:0,angle:0};
  if(points.length===1)return {...points[0],angle:0};
  const lengths=points.slice(1).map((p,i)=>Math.hypot(p.x-points[i].x,p.z-points[i].z));
  const total=lengths.reduce((a,b)=>a+b,0)||1;
  let left=clamp(progress,0,1)*total;
  for(let i=0;i<lengths.length;i++){
    const length=lengths[i];
    if(left<=length||i===lengths.length-1){
      const t=clamp(left/Math.max(.001,length),0,1),a=points[i],b=points[i+1];
      return {x:a.x+(b.x-a.x)*t,z:a.z+(b.z-a.z)*t,angle:Math.atan2(b.x-a.x,b.z-a.z)};
    }
    left-=length;
  }
  return {...points.at(-1),angle:0};
}
export function describeNeighborhoodClock(hour) {
  if(hour>=5&&hour<9)return 'İşe gidiş · tramvay ve iskele hareketi';
  if(hour>=9&&hour<12)return 'Esnaf dükkânlarını açtı';
  if(hour>=12&&hour<14)return 'Öğle molası · kahvehaneler doluyor';
  if(hour>=14&&hour<17)return 'Çarşı ve atölyeler çalışıyor';
  if(hour>=17&&hour<20)return 'İş çıkışı · alışveriş';
  if(hour>=20&&hour<23)return 'Akşam · kahvehane ve meyhaneler';
  return 'Mahalle uykuda · gece seferleri seyrek';
}
// Population schedules are calculated once per clock hour, not once for each
// storefront and every React render. This keeps 180 virtual residents cheap.
const scheduleCache=new WeakMap();
function cachedIntentions(properties,population,clock) {
  const key=cityDateKey(clock)+':'+clock.hour+':'+population.length;
  let cache=scheduleCache.get(properties);
  if (!cache || cache.key!==key) {
    cache={key,plans:population.map(person=>visitIntent(person,clock,properties))};
    scheduleCache.set(properties,cache);
  }
  return cache.plans;
}

export function customerFlow({property,clock,properties,population,ferryBusiness,tramwayBusiness,neighborhood,businessStats={}}){
  if(!property||!isBusinessOpen(property,clock.hour))return {
    visits:0,nearby:0,demand:.25,supplyModifier:1,reputation:normalizeNeighborhood(neighborhood).reputation,
    footTraffic:0,routeAccess:0
  };
  const state=normalizeNeighborhood(neighborhood);
  const p=property;
  const passers=cachedIntentions(properties,population,clock).reduce((total,intent)=>{
    if(!intent)return total;
    if(intent.purpose==='shop' && intent.to?.id===p.id)return total+1;
    if(intent.purpose==='commute' && Math.abs(intent.to?.z-p.z)<4&&Math.abs(intent.to?.x-p.x)<13)return total+.18;
    return total;
  },0);
  const nearTram=Math.abs(p.x)<19&&Math.abs(p.x)>3;
  const nearQuay=p.x>=20&&p.x<=25.5;
  const transit=(nearQuay?2.5:nearTram?1.25:.75)
    +(nearQuay&&ferryBusiness?.owned?2.1:0)
    +(nearQuay&&ferryBusiness?.upgrades?.secondFerry?1.8:0);
  const rainy=[2,6,10].includes((clock.day*7+clock.month*11)%13);
  const realVisits=Math.max(0,Math.round(passers*(rainy?.85:1)));
  const reputation=clamp(state.reputation+Math.min(12,(Number(businessStats?.[p.id]?.unitsSold)||0)/20),0,100);
  const footTraffic=Math.max(0,realVisits+transit);
  const cityEconomy=getCityEconomicProfile({properties,clock,ferryBusiness,tramwayBusiness,neighborhood});
  const sector=businessClass(p);
  const sectorDemand=cityEconomy.demand[sector]||1;
  const demand=clamp((.36+Math.sqrt(footTraffic)*.102+(reputation-50)*.004)*sectorDemand, .20,2.35);
  const supplyModifier=getSupplyModifier(p,{ferryBusiness,neighborhood});
  return {visits:realVisits,nearby:round2(transit),demand:round2(demand),
    supplyModifier,reputation:Math.round(reputation),footTraffic:round2(footTraffic),
    routeAccess:nearQuay?2:nearTram?1:0,sector,sectorDemand,cityEconomy};
}
export function getSupplyModifier(p,{ferryBusiness,neighborhood}={}){
  const state=normalizeNeighborhood(neighborhood);
  const quai=p?.x>=19&&p?.x<26;
  const base=1.075-(state.supplyTrust-50)*.003;
  const ferryDiscount=ferryBusiness?.owned&&(quai||p?.type==='Depo')
    ?ferryBusiness?.upgrades?.cargoHold?.09:.045:0;
  return round2(clamp(base-ferryDiscount,.78,1.20));
}
export function neighborhoodPulse({properties,clock,ferryBusiness,neighborhood,businessStats={}}){
  const people=getCityPopulation(properties);
  const shopProperties=properties.filter(p=>['Ticaret','Atölye','İşletme','Depo'].includes(p.type));
  const footfall=shopProperties.map(p=>({id:p.id,name:p.name,
    ...customerFlow({property:p,clock,properties,population:people,ferryBusiness,neighborhood,businessStats})}));
  const total=footfall.reduce((sum,x)=>sum+x.visits,0);
  const active=footfall.filter(x=>x.visits>0).length;
  const state=normalizeNeighborhood(neighborhood);
  return {totalVisitors:total,activeShops:active,reputation:state.reputation,
    supplyTrust:state.supplyTrust,footfall,description:describeNeighborhoodClock(clock.hour)};
}
