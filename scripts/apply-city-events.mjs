import fs from 'node:fs';

const appPath = 'src/App.jsx';
let s = fs.readFileSync(appPath, 'utf8');

const eventConstants = `
const CITY_EVENT_CATALOG = [
  {
    id: 'church-feast-baylan', title: 'Komşu kilisede yortu haftası', duration: 7,
    description: 'Yakındaki kilisenin yortu kutlamaları sokağa kalabalık çekiyor. Baylan Pastanesi için yoğun bir hafta.',
    propertyMultipliers: { 40: 2.4 }, typeMultipliers: {},
    headline: 'Baylan Pastanesi satış talebi %140 arttı'
  },
  {
    id: 'flu-season', title: 'Grip salgını', duration: 6,
    description: 'Eczaneye talep artarken meyhane ve kalabalık yeme içme mekanları müşteri kaybediyor.',
    propertyMultipliers: { 15: 1.85, 31: 0.73, 19: 0.82, 12: 0.88, 25: 0.88, 34: 1.18 },
    typeMultipliers: {},
    headline: 'Eczane talebi %85 arttı; meyhane talebi %27 düştü'
  },
  {
    id: 'tramway-crowd', title: 'Tünel ve tramvay hareketliliği', duration: 5,
    description: 'Hat çevresindeki yaya trafiği artıyor; cadde üstündeki mağazalar bundan yararlanıyor.',
    propertyMultipliers: { 10: 1.42, 21: 1.32, 23: 1.28, 25: 1.35, 40: 1.12 },
    typeMultipliers: {},
    headline: 'Hat çevresindeki mağazalarda talep %28–42 arttı'
  },
  {
    id: 'heavy-rain', title: 'Aralıksız yağmur', duration: 4,
    description: 'Sokaklar tenhalaşıyor. Açık tezgahlar ve yaya trafiğine bağlı işletmeler zorlanıyor.',
    propertyMultipliers: { 18: 0.62, 42: 0.65, 40: 0.84, 25: 0.82 },
    typeMultipliers: { 'Ticaret': 0.9, 'İşletme': 0.86 },
    headline: 'Açık tezgah talebi %38 düştü; genel ticaret zayıfladı'
  },
  {
    id: 'holiday-shopping', title: 'Bayram alışverişi başladı', duration: 7,
    description: 'Aileler bayram hazırlığında. Kumaşçı, şekerci, kunduracı ve şapkacıya talep yükseliyor.',
    propertyMultipliers: { 33: 1.48, 35: 1.72, 37: 1.36, 41: 1.42, 46: 1.25 },
    typeMultipliers: { 'Ticaret': 1.12 },
    headline: 'Şekerci talebi %72, kumaşçı talebi %48 arttı'
  },
  {
    id: 'theatre-premiere', title: 'İstiklal Caddesi’nde tiyatro prömiyeri', duration: 3,
    description: 'Gösteri öncesi ve sonrası kalabalık, yakın çevrede tatlıcıları ve kahvehaneleri dolduruyor.',
    propertyMultipliers: { 40: 1.65, 12: 1.38, 25: 1.32, 39: 1.12 },
    typeMultipliers: {},
    headline: 'Pastane talebi %65, kahvehane talebi %38 arttı'
  },
  {
    id: 'port-strike', title: 'Karaköy rıhtımında iş bırakma', duration: 4,
    description: 'Toptan mal sevkiyatı aksıyor. Şarküteri ve aktarın müşteri trafiği düşerken stok yenilemek de zorlaşıyor.',
    propertyMultipliers: { 23: 0.78, 46: 0.72, 7: 0.82, 28: 0.88 },
    typeMultipliers: {},
    headline: 'Rıhtıma bağlı ticarette talep %22–28 düştü'
  },
  {
    id: 'summer-heat', title: 'Mevsim normallerinin üzerinde sıcaklık', duration: 5,
    description: 'Serin içecek ve hafif tatlılara talep artıyor; sıcak yemek sunan lokantalar müşteri kaybediyor.',
    propertyMultipliers: { 40: 1.55, 13: 1.18, 19: 0.82, 31: 0.86, 12: 1.22 },
    typeMultipliers: {},
    headline: 'Pastane talebi %55 arttı; lokanta talebi %18 düştü'
  },
  {
    id: 'newspaper-scoop', title: 'Gazetede çıkan haber', duration: 4,
    description: 'Bir gazete haberi sahafın önüne meraklı kalabalık topluyor; çevredeki dükkanlar da hareketleniyor.',
    propertyMultipliers: { 45: 1.7, 16: 1.22, 43: 1.18 },
    typeMultipliers: {},
    headline: 'Sahaf talebi %70 arttı'
  },
  {
    id: 'craft-fair', title: 'Zanaatkarlar panayırı', duration: 6,
    description: 'Mahalledeki küçük üreticiler tezgah açıyor. El işi, tamir ve atölye ürünleri öne çıkıyor.',
    propertyMultipliers: { 37: 1.45, 47: 1.52, 49: 1.4, 52: 1.42 },
    typeMultipliers: { 'Atölye': 1.18 },
    headline: 'Zanaat ve tamir talebi %40–52 arttı'
  }
];
`;
if (!s.includes('const CITY_EVENT_CATALOG = [')) {
  const anchor = 'const venueTypesByProfession = {';
  if (!s.includes(anchor)) throw new Error('Event constants insertion point not found.');
  s = s.replace(anchor, eventConstants + '\n' + anchor);
}

const stateAnchor = "  const [businessStats, setBusinessStats] = useState(() => saved.businessStats && typeof saved.businessStats === 'object' ? saved.businessStats : {});";
const stateLine = "  const [activeEvents, setActiveEvents] = useState(() => Array.isArray(saved.activeEvents) ? saved.activeEvents.filter(event => event && typeof event.id === 'string' && Number(event.daysRemaining) > 0) : []);"; 
if (!s.includes(stateLine)) {
  if (!s.includes(stateAnchor)) throw new Error('Event state insertion point not found.');
  s = s.replace(stateAnchor, stateAnchor + '\n' + stateLine);
}

const saveAnchor = 'version: 2, playerName, steps, cash, owned, rented, selected, showPortfolio, professionId, marketValues,';
if (s.includes(saveAnchor) && !s.includes('showPortfolio, professionId, marketValues, activeEvents,')) {
  s = s.replace(saveAnchor, 'version: 2, playerName, steps, cash, owned, rented, selected, showPortfolio, professionId, marketValues, activeEvents,');
}
const depsAnchor = '[playerName, steps, cash, owned, rented, selected, showPortfolio, professionId, marketValues, hour, day, month, year, workHours, shopPropertyId, wineBottles, businessPlans, stockByProperty, businessStats, log]';
if (s.includes(depsAnchor) && !s.includes('marketValues, activeEvents, hour')) {
  s = s.replace(depsAnchor, '[playerName, steps, cash, owned, rented, selected, showPortfolio, professionId, marketValues, activeEvents, hour, day, month, year, workHours, shopPropertyId, wineBottles, businessPlans, stockByProperty, businessStats, log]');
}

const salesAnchor = '  const processHourlyBusinessSales = () => {';
const eventHelpers = `  const getCityEventMultiplier = (property) => activeEvents.reduce((multiplier, event) => {
    const definition = CITY_EVENT_CATALOG.find(item => item.id === event.id);
    if (!definition) return multiplier;
    const propertyFactor = Number(definition.propertyMultipliers?.[property.id]) || 1;
    const typeFactor = propertyFactor !== 1 ? 1 : (Number(definition.typeMultipliers?.[property.type]) || 1);
    return multiplier * propertyFactor * typeFactor;
  }, 1);

  const advanceCityEvents = () => {
    const previous = activeEvents;
    let next = previous
      .map(event => ({ ...event, daysRemaining: Number(event.daysRemaining) - 1 }))
      .filter(event => event.daysRemaining > 0);
    const expired = previous.filter(event => Number(event.daysRemaining) <= 1);
    let started = null;
    if (next.length < 2 && Math.random() < 0.34) {
      const available = CITY_EVENT_CATALOG.filter(definition => !next.some(event => event.id === definition.id));
      if (available.length) {
        const definition = available[Math.floor(Math.random() * available.length)];
        started = { id: definition.id, daysRemaining: definition.duration, startedAt: Date.now() };
        next = [...next, started];
      }
    }
    setActiveEvents(next);
    const startedDefinition = started && CITY_EVENT_CATALOG.find(item => item.id === started.id);
    const expiredDefinition = expired.map(event => CITY_EVENT_CATALOG.find(item => item.id === event.id)).filter(Boolean);
    const messages = [];
    if (startedDefinition) messages.push('ŞEHİR HABERİ: ' + startedDefinition.title + '. ' + startedDefinition.headline + '. Etki süresi ' + startedDefinition.duration + ' oyun günü.');
    if (expiredDefinition.length) messages.push('Etkinlik sona erdi: ' + expiredDefinition.map(item => item.title).join(', ') + '.');
    return messages.join(' ');
  };

`;
if (!s.includes('  const advanceCityEvents = () => {')) {
  if (!s.includes(salesAnchor)) throw new Error('Hourly sales insertion point not found.');
  s = s.replace(salesAnchor, eventHelpers + salesAnchor);
}

const chanceAnchor = '      const salesChance = 0.34 + (reputation / 100) * 0.12;';
const chanceReplacement = `      const eventMultiplier = getCityEventMultiplier(property);
      const salesChance = Math.min(0.94, (0.34 + (reputation / 100) * 0.12) * eventMultiplier);`;
if (s.includes(chanceAnchor)) s = s.replace(chanceAnchor, chanceReplacement);
const soldAnchor = '      const sold = Math.min(stock, 1 + (Math.random() > 0.72 ? 1 : 0));';
const soldReplacement = '      const secondUnitThreshold = Math.min(0.95, 0.72 / Math.max(0.5, eventMultiplier));\n      const sold = Math.min(stock, 1 + (Math.random() > secondUnitThreshold ? 1 : 0));';
if (s.includes(soldAnchor)) s = s.replace(soldAnchor, soldReplacement);

const dayAdvancePattern = /^(\s*)const nextDayRaw = day \+ 1;$/m;
if (!s.includes('const cityEventMessage = advanceCityEvents();')) {
  const dayAdvanceMatch = s.match(dayAdvancePattern);
  if (!dayAdvanceMatch) throw new Error('Could not locate the day advance point for city events.');
  const indent = dayAdvanceMatch[1];
  s = s.replace(dayAdvancePattern, indent + 'const cityEventMessage = advanceCityEvents();\n' + dayAdvanceMatch[0]);
}

const tell1 = "      tell(`Yeni gün başladı. Kira +₺${dailyRent.toFixed(2)}, gün içi işletme satışları kasaya işlendi, yaşam ve bakım -₺${(DAILY_LIVING_COST + maintenance).toFixed(2)}, işletme gideri -₺${business.costs.toFixed(2)}; net ₺${dailyNet.toFixed(2)}.${business.entries.length ? ' ' + business.entries.slice(0, 3).join(' · ') : ''}`);";
if (s.includes(tell1)) {
 s = s.replace(tell1, "      tell(`Yeni gün başladı. Kira +₺${dailyRent.toFixed(2)}, gün içi işletme satışları kasaya işlendi, yaşam ve bakım -₺${(DAILY_LIVING_COST + maintenance).toFixed(2)}, işletme gideri -₺${business.costs.toFixed(2)}; net ₺${dailyNet.toFixed(2)}.${business.entries.length ? ' ' + business.entries.slice(0, 3).join(' · ') : ''}${cityEventMessage ? ' ' + cityEventMessage : ''}`);");
}
const tell2 = "    tell(`Gün kapandı. Kira +₺${rent.toFixed(2)}, gün içi işletme satışları kasaya işlendi, yaşam ve bakım -₺${(DAILY_LIVING_COST + maintenance).toFixed(2)}, işletme giderleri -₺${business.costs.toFixed(2)}. Net: ₺${net.toFixed(2)}.${business.entries.length ? ' ' + business.entries.slice(0, 3).join(' · ') : ''}`);";
if (s.includes(tell2)) {
 s = s.replace(tell2, "    tell(`Gün kapandı. Kira +₺${rent.toFixed(2)}, gün içi işletme satışları kasaya işlendi, yaşam ve bakım -₺${(DAILY_LIVING_COST + maintenance).toFixed(2)}, işletme giderleri -₺${business.costs.toFixed(2)}. Net: ₺${net.toFixed(2)}.${business.entries.length ? ' ' + business.entries.slice(0, 3).join(' · ') : ''}${cityEventMessage ? ' ' + cityEventMessage : ''}`);");
}

const resetAnchor = 'setWorkHours(0); setCareerHours(0); setShopPropertyId(null); setWineBottles(0); setBusinessPlans({}); setStockByProperty({}); setBusinessStats({});';
if (s.includes(resetAnchor) && !s.includes('setBusinessStats({}); setActiveEvents([]);')) {
  s = s.replace(resetAnchor, 'setWorkHours(0); setCareerHours(0); setShopPropertyId(null); setWineBottles(0); setBusinessPlans({}); setStockByProperty({}); setBusinessStats({}); setActiveEvents([]);');
}

const uiAnchor = '    <section className="multiplayer-panel">';
const eventUI = `    <section className="city-events-panel">
      <div className="city-events-heading"><span className="live-dot" /> MAHALLE HABERLERİ <span className="city-events-subtitle">Piyasa her gün değişir</span></div>
      {activeEvents.length === 0 ? (
        <p className="city-events-empty">Şimdilik olağan bir gün. Gün ilerledikçe kutlamalar, salgınlar, hava olayları ve şehir haberleri rastgele başlayabilir.</p>
      ) : (
        <div className="city-events-list">
          {activeEvents.map(event => {
            const definition = CITY_EVENT_CATALOG.find(item => item.id === event.id);
            if (!definition) return null;
            return <article className="city-event-card" key={event.id}>
              <div className="city-event-card-top"><strong>{definition.title}</strong><span>{event.daysRemaining} gün kaldı</span></div>
              <p>{definition.description}</p>
              <div className="city-event-impact">{definition.headline}</div>
            </article>;
          })}
        </div>
      )}
    </section>

`;
if (!s.includes('<section className="city-events-panel">')) {
  if (!s.includes(uiAnchor)) throw new Error('Event panel insertion point not found.');
  s = s.replace(uiAnchor, eventUI + uiAnchor);
}

// Share the active city-news state with the guest so both players see the same events.
const multiplayerSyncPatches = [
  ["conn.send({ type: 'world-state', owners: snapshotRef.current?.owners || {}, marketValues: snapshotRef.current?.marketValues || {}, hostName });",
   "conn.send({ type: 'world-state', owners: snapshotRef.current?.owners || {}, marketValues: snapshotRef.current?.marketValues || {}, activeEvents: snapshotRef.current?.activeEvents || [], hostName });"],
  ["conn.send({ type: 'world-state', owners: mergedOwners, marketValues, hostName });",
   "conn.send({ type: 'world-state', owners: mergedOwners, marketValues, activeEvents, hostName });"],
  ["conn.send({ type: 'world-state', owners: message.owners, marketValues: message.marketValues || marketValues, hostName });",
   "conn.send({ type: 'world-state', owners: message.owners, marketValues: message.marketValues || marketValues, activeEvents, hostName });"],
  ["if (message.marketValues && typeof message.marketValues === 'object') setMarketValues(message.marketValues);",
   "if (message.marketValues && typeof message.marketValues === 'object') setMarketValues(message.marketValues);\n    if (Array.isArray(message.activeEvents)) setActiveEvents(message.activeEvents);"],
  ["snapshotRef.current = { owners: ownerByProperty, marketValues, hostName: playerName.trim() || 'Ev sahibi' };",
   "snapshotRef.current = { owners: ownerByProperty, marketValues, activeEvents, hostName: playerName.trim() || 'Ev sahibi' };"],
  ["connectionRef.current.send({ type: 'world-state', owners: ownerByProperty, marketValues, hostName: playerName.trim() || 'Ev sahibi' });",
   "connectionRef.current.send({ type: 'world-state', owners: ownerByProperty, marketValues, activeEvents, hostName: playerName.trim() || 'Ev sahibi' });"],
  ["[multiplayerRole, ownerByProperty, marketValues, playerName]);",
   "[multiplayerRole, ownerByProperty, marketValues, activeEvents, playerName]);"]
];
for (const [from, to] of multiplayerSyncPatches) {
  if (s.includes(from)) s = s.replace(from, to);
}

fs.writeFileSync(appPath, s, 'utf8');

const cssPath = 'src/style.css';
let css = fs.readFileSync(cssPath, 'utf8');
if (!css.includes('.city-events-panel{')) {
  css += `

.city-events-panel{margin:0 0 18px;padding:16px 18px;border:1px solid #d9d2c6;border-radius:14px;background:linear-gradient(135deg,#f8f5ed 0%,#f0ece2 100%);color:#292a26}
.city-events-heading{display:flex;align-items:center;gap:9px;font-size:11px;font-weight:800;letter-spacing:.12em;color:#514d43}
.city-events-subtitle{margin-left:auto;font-size:10px;font-weight:500;letter-spacing:0;color:#777064}
.city-events-empty{margin:11px 0 0;font-size:12px;line-height:1.6;color:#777064}
.city-events-list{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px;margin-top:13px}
.city-event-card{padding:12px 13px;border:1px solid #e0d7c8;border-radius:10px;background:rgba(255,255,255,.62)}
.city-event-card-top{display:flex;align-items:flex-start;justify-content:space-between;gap:10px}
.city-event-card-top strong{font-size:13px;line-height:1.35;color:#34332e}
.city-event-card-top span{white-space:nowrap;font-size:10px;color:#777064}
.city-event-card p{margin:7px 0;font-size:11px;line-height:1.5;color:#69655c}
.city-event-impact{font-size:11px;font-weight:750;line-height:1.45;color:#7d4f2d}
@media(max-width:600px){.city-events-panel{padding:13px}.city-events-subtitle{font-size:9px}.city-events-list{grid-template-columns:1fr}}
`;
  fs.writeFileSync(cssPath, css, 'utf8');
}
