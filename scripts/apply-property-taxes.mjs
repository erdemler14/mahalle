import fs from 'node:fs';

const path = 'src/App.jsx';
let s = fs.readFileSync(path, 'utf8');

const marker = 'const DAILY_LIVING_COST = 2.5;';
const constants = `const DAILY_LIVING_COST = 2.5;
const PROPERTY_TAX_RATES = {
  Konut: 0.0010,
  Depo: 0.0015,
  Ticaret: 0.0020,
  Atölye: 0.0020,
  İşletme: 0.0022
};
const PROPERTY_TAX_PROGRESSIVE = [1, 1, 1.25, 1.25, 1.6, 1.6, 1.6, 2, 2, 2, 2, 2.5];
const QUARTER_START_MONTHS = [1, 4, 7, 10];`;
if (!s.includes('PROPERTY_TAX_RATES')) s = s.replace(marker, constants);

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
    const frontage = [13, 19, 25, 31].includes(property.id) ? 1.25 : 0;
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
    const entries = [];
    owned.forEach(propertyId => {
      if (rented.includes(propertyId)) return;
      const property = properties.find(item => item.id === propertyId);
      if (!property || !['İşletme', 'Atölye', 'Ticaret'].includes(property.type)) return;
      const product = (tradeCatalog[propertyId] || []).find(item => item.id === businessPlans[propertyId]);
      if (!product || product.price <= 0) return;
      const dailyCost = property.type === 'İşletme' ? 4.5 : property.type === 'Atölye' ? 3.5 : 2.5;
      operatingCosts += dailyCost;
      entries.push(property.name + ': ' + (Number(stockByProperty[propertyId]) || 0) + ' stok, günlük işletme gideri -₺' + dailyCost.toFixed(2));
    });
    return { revenue: 0, costs: Math.round(operatingCosts * 100) / 100, entries };
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

fs.writeFileSync(path, s, 'utf8');

const cssPath = 'src/style.css';
let css = fs.readFileSync(cssPath, 'utf8');
const taxCss = `.tax-summary{display:flex;align-items:baseline;gap:8px;margin:8px 0 4px}.tax-summary strong{font-size:24px;color:#ffca58}.tax-summary span,.tax-meta,.tax-note{color:#8ea1b6;font-size:9px}.tax-breakdown{margin-top:9px;border-top:1px solid #344255}.tax-breakdown div{display:flex;justify-content:space-between;gap:10px;padding:6px 0;border-bottom:1px solid #273545;font-size:9px}.tax-breakdown span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.tax-breakdown b{color:#dce7ef;white-space:nowrap}.tax-breakdown small{display:block;padding-top:5px;color:#71859b}.tax-fees{margin-top:8px;padding:7px 8px;background:#101923;border:1px solid #39495b;color:#ffca58;font-size:9px}.tax-note{line-height:1.5;margin:8px 0 0}`;
if (!css.includes('.tax-summary')) fs.writeFileSync(cssPath, css + '\n' + taxCss + '\n', 'utf8');
