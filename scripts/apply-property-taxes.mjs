import fs from 'node:fs';

const path = 'src/App.jsx';
let s = fs.readFileSync(path, 'utf8');

// Expand the neighborhood with period-appropriate commercial premises.
// These are deliberately properties, not automatic professions: they make the
// street feel like a real 1920s Beyoglu commercial district and leave room for
// future profession-specific gameplay.
const shopAnchor = "  { id: 32, name: 'Küçük matbaa ve kırtasiye', type: 'Atölye', price: 930, rent: 68, x: 5.5, z: 17.2, color: '#b8b0a4', floors: 3, style: 'Baskı atölyesi ve kırtasiye' }\n];";
const periodShops = `  { id: 32, name: 'Küçük matbaa ve kırtasiye', type: 'Atölye', price: 930, rent: 68, x: 5.5, z: 17.2, color: '#b8b0a4', floors: 3, style: 'Baskı atölyesi ve kırtasiye' },
  { id: 33, name: 'Galata kumaşçı dükkanı', type: 'Ticaret', price: 780, rent: 61, x: 0, z: 0, color: '#c9b39d', floors: 2, style: 'Top kumaş ve manifatura mağazası' },
  { id: 34, name: 'Kolonya ve koku dükkanı', type: 'Ticaret', price: 730, rent: 57, x: 0, z: 0, color: '#c7c9ad', floors: 2, style: 'Cam şişeli koku ve kolonya dükkânı' },
  { id: 35, name: 'Lokumcu ve şekerci', type: 'Ticaret', price: 690, rent: 54, x: 0, z: 0, color: '#d7b9a7', floors: 2, style: 'Akide, lokum ve şekerleme vitrini' },
  { id: 36, name: 'Leblebici dükkanı', type: 'Ticaret', price: 520, rent: 43, x: 0, z: 0, color: '#cbb78f', floors: 1, style: 'Kavrulmuş leblebi ve kuruyemiş dükkânı' },
  { id: 37, name: 'Kunduracı dükkanı', type: 'Atölye', price: 610, rent: 48, x: 0, z: 0, color: '#a98d75', floors: 2, style: 'Ayakkabı ve kundura ustasının dükkânı' },
  { id: 38, name: 'Kuyumcu', type: 'Ticaret', price: 1180, rent: 86, x: 0, z: 0, color: '#d0b987', floors: 2, style: 'Dar vitrinli kuyumcu mağazası' },
  { id: 39, name: 'Berber dükkanı', type: 'İşletme', price: 560, rent: 52, x: 0, z: 0, color: '#b8a998', floors: 2, style: 'Aynalı mahalle berberi' },
  { id: 40, name: 'Baylan Pastanesi', type: 'İşletme', price: 1040, rent: 82, x: 0, z: 0, color: '#d1b79d', floors: 2, style: 'Alafranga pastane ve tatlıcı' },
  { id: 41, name: 'Şapkacı mağazası', type: 'Ticaret', price: 820, rent: 65, x: 0, z: 0, color: '#b8a99d', floors: 2, style: 'Şapka ve şehir giyimi mağazası' },
  { id: 42, name: 'Çiçekçi dükkanı', type: 'Ticaret', price: 590, rent: 47, x: 0, z: 0, color: '#b5c0a4', floors: 1, style: 'Sokak cepheli çiçekçi' },
  { id: 43, name: 'Fotoğrafçı stüdyosu', type: 'Ticaret', price: 980, rent: 76, x: 0, z: 0, color: '#aeb8bd', floors: 3, style: 'Portre fotoğrafı ve stüdyo mağazası' },
  { id: 44, name: 'Sabuncu ve güzel koku imalathanesi', type: 'Atölye', price: 900, rent: 64, x: 0, z: 0, color: '#b9b39e', floors: 2, style: 'Küçük sabun ve koku imalathanesi' },
  { id: 45, name: 'Sahaf ve eski kitapçı', type: 'Ticaret', price: 720, rent: 55, x: 0, z: 0, color: '#bcae98', floors: 2, style: 'İkinci el kitaplar ve eski baskılar' },
  { id: 46, name: 'Şarküteri ve peynirci', type: 'Ticaret', price: 780, rent: 62, x: 0, z: 0, color: '#c8b49b', floors: 2, style: 'Peynir, zeytin ve şarküteri tezgahı' },
  { id: 47, name: 'Bakırcı ve kalaycı', type: 'Atölye', price: 690, rent: 51, x: 0, z: 0, color: '#b58c6c', floors: 2, style: 'Bakır kaplar ve kalaylama tezgahı' },
  { id: 48, name: 'Oyuncakçı dükkanı', type: 'Ticaret', price: 640, rent: 49, x: 0, z: 0, color: '#c9b59b', floors: 2, style: 'Ahşap oyuncak ve bez bebek vitrini' },
  { id: 49, name: 'Saat tamircisi', type: 'Atölye', price: 760, rent: 58, x: 0, z: 0, color: '#aaa99f', floors: 2, style: 'Duvar ve cep saati tamiri' },
  { id: 50, name: 'Kahve kavurucusu', type: 'İşletme', price: 830, rent: 66, x: 0, z: 0, color: '#b79b80', floors: 2, style: 'Kahve çekirdeği kavurma ve satış' },
  { id: 51, name: 'Mefruşatçı dükkanı', type: 'Ticaret', price: 910, rent: 70, x: 0, z: 0, color: '#c5b2a2', floors: 2, style: 'Perde, örtü ve ev kumaşları' },
  { id: 52, name: 'Tabelacı ve boyacı', type: 'Atölye', price: 620, rent: 46, x: 0, z: 0, color: '#b9a28d', floors: 2, style: 'El yazısı tabela ve boya atölyesi' },
  { id: 53, name: 'Galata meyhanesi', type: 'İşletme', price: 890, rent: 72, x: 0, z: 0, color: '#a78368', floors: 2, style: 'Meze, balık ve akşam sofrası' },
  { id: 54, name: 'Galata şarap imalathanesi', type: 'Atölye', price: 1420, rent: 105, x: 0, z: 0, color: '#98705f', floors: 3, style: 'Meşe fıçılı küçük şarap mahzeni ve üzüm işleme atölyesi' }
];`;
const additionalShops = periodShops.slice(periodShops.indexOf(',\n') + 2, periodShops.lastIndexOf('\n];'));
if (!s.includes("id: 54, name: 'Galata şarap imalathanesi'")) {
  const lastBaseProperty = /(\s*\{ id: 32, name: 'Küçük matbaa ve kırtasiye'[^\n]*\})\s*\n\];/;
  if (!lastBaseProperty.test(s)) throw new Error('Could not find final base property to append new shops');
  s = s.replace(lastBaseProperty, '$1,\n' + additionalShops + '\n];');
}

// Keep the procedural street layout working after the expansion from 32 to 44 properties.
s = s.replace(
  "  const baseX = [-8.5, 8.5, -18.5, 18.5][frontage];",
  "  const baseX = [-8.5, 8.5, -18.5, 18.5, 0, 25.5][frontage] ?? 0;"
);

// Scale the newly injected shop properties in the source itself, matching the base properties.
const addedPropertyBlock = /\{ id: (\d+), name: '[^']+', type: '[^']+', price: (\d+), rent: (\d+),/g;
s = s.replace(addedPropertyBlock, (match, id, price, rent) => {
  if (Number(id) < 33) return match;
  return match.replace('price: ' + price + ', rent: ' + rent + ',', 'price: ' + Math.round(Number(price) * 4.5) + ', rent: ' + Math.max(8, Math.round(Number(rent) * 0.8)) + ',');
});


const marker = "const DAILY_LIVING_COST = 2.5;";
const constants = `const CITY_EVENTS = [
  { id: 'festival', title: 'Mahalle şenliği', days: 3, effects: { 'İşletme': 0.35, 'Ticaret': 0.15 }, text: 'Mahalle şenliği başladı: yeme-içme ve çarşı satışları arttı.' },
  { id: 'flu', title: 'Grip salgını', days: 4, effects: { 'İşletme': -0.22, 'Ticaret': -0.10 }, text: 'Grip salgını: müşteri trafiği azaldı, şehirde harcamalar yavaşladı.' },
  { id: 'tram', title: 'Tramvay hattı yoğunluğu', days: 3, effects: { 'Ticaret': 0.24, 'Atölye': 0.08 }, text: 'Tramvay hattı yoğun: durak çevresindeki ticari hareketlilik arttı.' },
  { id: 'rain', title: 'Uzun yağış', days: 2, effects: { 'İşletme': -0.15, 'Ticaret': -0.08 }, text: 'Uzun yağış: sokaklardaki müşteri trafiği düştü.' },
  { id: 'holiday', title: 'Bayram hazırlığı', days: 3, effects: { 'Ticaret': 0.28, 'Atölye': 0.22, 'İşletme': 0.12 }, text: 'Bayram hazırlıkları başladı: alışveriş ve siparişler arttı.' }
];
const PROPERTY_TAX_RATES = {
  Konut: 0.0010,
  Depo: 0.0015,
  Ticaret: 0.0020,
  Atölye: 0.0020,
  İşletme: 0.0022
};
const PROPERTY_TAX_PROGRESSIVE = [1, 1, 1.25, 1.25, 1.6, 1.6, 1.6, 2, 2, 2, 2, 2.5];
const QUARTER_START_MONTHS = [1, 4, 7, 10];`;
if (!s.includes('PROPERTY_TAX_RATES')) s = s.replace(marker, marker + '\n' + constants);

const marketAnchor = "  const getMarketValue = property => Math.max(1,Math.round((Number(marketValues[property.id])||property.price)*100)/100);";
const taxHelpers = `  const getMarketValue = property => Math.max(1,Math.round((Number(marketValues[property.id])||property.price)*100)/100);
  const getPropertyTaxRate = property => PROPERTY_TAX_RATES[property.type] || 0.0015;
  const getProgressivePropertyFactor = position => PROPERTY_TAX_PROGRESSIVE[Math.min(position - 1, PROPERTY_TAX_PROGRESSIVE.length - 1)] || 2.5;
  const calculateQuarterlyPropertyTax = () => owned.reduce((total, propertyId, index) => {
    const property = properties.find(item => item.id === propertyId);
    if (!property) return total;
    const base = getMarketValue(property) * getPropertyTaxRate(property) / 4;
    return total + base * getProgressivePropertyFactor(index + 1) * 1.10;
  }, 0);
  const getBusinessFee = property => {
    if (!property || !['Ticaret', 'Atölye', 'İşletme'].includes(property.type)) return 0;
    const licence = property.type === 'İşletme' ? 1.25 : property.type === 'Atölye' ? 1.0 : 0.75;
    const frontage = [13, 19, 25, 31, 40].includes(property.id) ? 1.25 : 0;
    return licence + frontage;
  };
  const calculateMonthlyBusinessFees = () => owned.reduce((total, propertyId) => {
    if (rented.includes(propertyId)) return total;
    return total + getBusinessFee(properties.find(item => item.id === propertyId));
  }, 0);
  const settlePeriodicTaxes = (nextDay, nextMonth) => {
    let total = 0;
    const entries = [];
    if (nextDay === 1 && QUARTER_START_MONTHS.includes(nextMonth) && owned.length) {
      const propertyTax = calculateQuarterlyPropertyTax();
      total += propertyTax;
      entries.push('Emlak vergisi + kültür katkı payı -₺' + propertyTax.toFixed(2));
    }
    if (nextDay === 1 && owned.length) {
      const businessFees = calculateMonthlyBusinessFees();
      total += businessFees;
      if (businessFees > 0) entries.push('Ruhsat/işyeri aidatları -₺' + businessFees.toFixed(2));
    }
    return { costs: Math.round(total * 100) / 100, entries };
  };`;
if (!s.includes('settlePeriodicTaxes')) s = s.replace(marketAnchor, taxHelpers);

const old = /  const settleDailyBusinesses = \(\) => \{.*?\n  \};\n\n  const sleepUntilMorning = \(\) => \{.*?\n  \};/s;
const replacement = `  const settleDailyBusinesses = () => {
    let operatingCosts = 0;
    let revenue = 0;
    const entries = [];
    const stockChanges = {};
    owned.forEach(propertyId => {
      if (rented.includes(propertyId)) return;
      const property = properties.find(item => item.id === propertyId);
      if (!property || !['İşletme', 'Atölye', 'Ticaret'].includes(property.type)) return;
      const catalog = typeof getTradeCatalog === 'function'
        ? getTradeCatalog(tradeCatalog, propertyId)
        : (tradeCatalog[propertyId] || []);
      const product = catalog.find(item => item.id === businessPlans[propertyId]);
      if (!product || product.price <= 0) return;
      const dailyCost = property.type === 'İşletme' ? 4.5 : property.type === 'Atölye' ? 3.5 : 2.5;
      operatingCosts += dailyCost;
      const serviceSale = Boolean(product.service);
      const stock = serviceSale ? 1 : Math.max(0, Number(stockByProperty[propertyId]) || 0);
      const reputation = Math.min(100, Math.floor((Number(businessStats[propertyId]?.unitsSold) || 0) * 1.5));
      const eventEffect = 0; // City events are disabled until their state is wired into App.jsx.
      const salesChance = Math.max(0.08, Math.min(0.9, (0.34 + (reputation / 100) * 0.12) * (1 + eventEffect)));
      if ((!serviceSale && stock <= 0) || Math.random() > salesChance) {
        entries.push(property.name + ': ' + (serviceSale ? 'hizmet hazır' : stock + ' stok') + ', günlük gider -₺' + dailyCost.toFixed(2));
        return;
      }
      const sold = serviceSale ? 1 : Math.min(stock, Math.random() > 0.72 ? 2 : 1);
      const takings = sold * product.price;
      revenue += takings;
      if (!serviceSale) stockChanges[propertyId] = stock - sold;
      entries.push(property.name + ': ' + (serviceSale ? product.name + ' hizmeti' : sold + ' adet ' + product.name) + ' satıldı (+₺' + takings.toFixed(2) + ')');
    });
    if (Object.keys(stockChanges).length) setStockByProperty(previous => ({ ...previous, ...stockChanges }));
    return { revenue: Math.round(revenue * 100) / 100, costs: Math.round(operatingCosts * 100) / 100, entries };
  };

  const sleepUntilMorning = () => {
    if (sendAction('sleepUntilMorning')) return;
    const nextDayRaw = day + 1;
    const nextDay = nextDayRaw > 30 ? 1 : nextDayRaw;
    const nextMonthRaw = month + (nextDayRaw > 30 ? 1 : 0);
    const nextMonth = nextMonthRaw > 12 ? 1 : nextMonthRaw;
    const business = settleDailyBusinesses();
    const periodicTaxes = settlePeriodicTaxes(nextDay, nextMonth);
    const maintenance = portfolio.reduce((sum, p) => sum + Math.max(0.01, Math.round((getMarketValue(p) * 0.003 / 365) * 100) / 100), 0);
    const upkeep = DAILY_LIVING_COST + maintenance + business.costs + periodicTaxes.costs;
    const rent = Math.round(dailyRentIncome * 100) / 100;
    const net = rent + business.revenue - upkeep;
    setCash(v => Math.max(0, Math.round((v + net) * 100) / 100));
    setDay(nextDay);
    setMonth(nextMonth);
    const nextYear = nextMonthRaw > 12 ? year + 1 : year;
    if (nextDayRaw > 30) updateMarketValues(nextYear, nextMonth);
    if (nextMonthRaw > 12) setYear(v => v + 1);
    setHour(6);
    setWorkHours(0);
    const taxDetail = periodicTaxes.entries.length ? ' ' + periodicTaxes.entries.join(' · ') + '.' : '';
    tell(\`Gün kapandı. Kira +₺\${rent.toFixed(2)}, gün içi işletme satışları kasaya işlendi, yaşam ve bakım -₺\${(DAILY_LIVING_COST + maintenance).toFixed(2)}, işletme giderleri -₺\${business.costs.toFixed(2)}.\${taxDetail} Net: ₺\${net.toFixed(2)}.\${business.entries.length ? ' ' + business.entries.slice(0, 3).join(' · ') : ''}\`);
  };`;
if (!old.test(s)) throw new Error('Could not locate daily settlement block');
s = s.replace(old, replacement);

const uiAnchor = '        <section className="progression-card" aria-label="Gelişim hedefi">';
const taxUi = `        <section className="balance-card tax-card" aria-label="Vergi ve belediye giderleri">
          <div className="card-label">VERGİ VE BELEDİYE GİDERLERİ</div>
          <div className="tax-summary"><strong>₺{calculateQuarterlyPropertyTax().toFixed(2)}</strong><span>sonraki emlak vergisi dönemi</span></div>
          <div className="tax-meta">{owned.length} taşınmaz · kademeli oran</div>
          {owned.length > 0 && <div className="tax-breakdown">{owned.slice(0, 4).map((propertyId, index) => { const p = properties.find(item => item.id === propertyId); const amount = getMarketValue(p) * getPropertyTaxRate(p) / 4 * getProgressivePropertyFactor(index + 1) * 1.10; return <div key={propertyId}><span>{p.name}</span><b>₺{amount.toFixed(2)}</b></div>; })}{owned.length > 4 && <small>+ {owned.length - 4} taşınmaz daha</small>}</div>}
          {calculateMonthlyBusinessFees() > 0 && <div className="tax-fees">Aylık ruhsat / işgaliye: ₺{calculateMonthlyBusinessFees().toFixed(2)}</div>}
          <p className="tax-note">Daha fazla taşınmaz aldıkça sonraki mülklerin emlak vergisi katsayısı yükselir. İşletmeler ayrıca ruhsat ve belirli işyerlerinde işgaliye gideri öder.</p>
        </section>

`;
if (!s.includes('tax-card')) s = s.replace(uiAnchor, taxUi + uiAnchor);

// Raise stale saved market values after the new property-price scale, without discarding legitimate appreciation.
const marketValueOld = "  const getMarketValue = property => Math.max(1,Math.round((Number(marketValues[property.id])||property.price)*100)/100);";
const marketValueNew = "  const getMarketValue = property => Math.max(1, Math.round(Math.max(Number(marketValues[property.id]) || property.price, property.price * 0.75) * 100) / 100);";
if (s.includes(marketValueOld)) s = s.replace(marketValueOld, marketValueNew);

fs.writeFileSync(path, s, 'utf8');

const cssPath = 'src/style.css';
let css = fs.readFileSync(cssPath, 'utf8');
const taxCss = `.tax-summary{display:flex;align-items:baseline;gap:8px;margin:8px 0 4px}.tax-summary strong{font-size:24px;color:#ffca58}.tax-summary span,.tax-meta,.tax-note{color:#8ea1b6;font-size:9px}.tax-breakdown{margin-top:9px;border-top:1px solid #344255}.tax-breakdown div{display:flex;justify-content:space-between;gap:10px;padding:6px 0;border-bottom:1px solid #273545;font-size:9px}.tax-breakdown span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.tax-breakdown b{color:#dce7ef;white-space:nowrap}.tax-breakdown small{display:block;padding-top:5px;color:#71859b}.tax-fees{margin-top:8px;padding:7px 8px;background:#101923;border:1px solid #39495b;color:#ffca58;font-size:9px}.tax-note{line-height:1.5;margin:8px 0 0}`;
if (!css.includes('.tax-summary')) fs.writeFileSync(cssPath, css + '\n' + taxCss + '\n', 'utf8');
