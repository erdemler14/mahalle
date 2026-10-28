import fs from 'node:fs';

const path = 'src/App.jsx';
let s = fs.readFileSync(path, 'utf8');

if (!s.includes('const [developments, setDevelopments]')) {
  s = s.replace(
    "  const [marketValues, setMarketValues] = useState(() => saved.marketValues && typeof saved.marketValues === 'object' ? saved.marketValues : {});",
    "  const [marketValues, setMarketValues] = useState(() => saved.marketValues && typeof saved.marketValues === 'object' ? saved.marketValues : {});\n  const [developments, setDevelopments] = useState(() => saved.developments && typeof saved.developments === 'object' ? saved.developments : {});"
  );
}

if (!s.includes('const developmentLevel = (id) =>')) {
  const anchor = "  const getMarketValue = property => Math.max(1,Math.round((Number(marketValues[property.id])||property.price)*100)/100);";
  const helpers = `  const getMarketValue = property => Math.max(1,Math.round((Number(marketValues[property.id])||property.price)*100)/100);
  const developmentLevel = (id) => Math.max(0, Math.min(3, Number(developments[id]) || 0));
  const developedProperty = (property) => {
    const level = developmentLevel(property.id);
    let name = property.name;
    if (property.id === 28 && level === 1) name = 'Yenilenmiş mahalle bakkalı';
    if (property.id === 28 && level === 2) name = 'Mahalle marketi';
    if (property.id === 28 && level === 3) name = 'Büyük erzak mağazası';
    if (property.id === 13 && level >= 2) name = 'Genişletilmiş mahalle fırını';
    if (property.id === 12 && level >= 2) name = 'Büyük kahvehane';
    if (property.id === 19 && level >= 2) name = 'Genişletilmiş lokanta';
    return { ...property, name, floors: property.floors + level, rent: Math.round(property.rent * (1 + level * 0.18)), price: Math.round(property.price * (1 + level * 0.22)) };
  };
  const getDevelopmentCost = (property) => Math.round(property.price * [0.22, 0.38, 0.62][developmentLevel(property.id)] * 100) / 100;
  const upgradeProperty = () => {
    if (!owned.includes(active.id)) { tell('Geliştirmek için önce bu mülkün sahibi olmalısın.'); return; }
    if (rented.includes(active.id)) { tell('Kiradaki mülkü geliştirmek için önce kiracılığı bitirmelisin.'); return; }
    const level = developmentLevel(active.id);
    if (level >= 3) { tell('Bu mülk en yüksek gelişim seviyesine ulaştı.'); return; }
    const cost = getDevelopmentCost(active);
    if (cash < cost) { tell('Bu geliştirme için ₺' + cost.toLocaleString('tr-TR') + ' gerekiyor.'); return; }
    setCash(value => Math.round((value - cost) * 100) / 100);
    setDevelopments(old => ({ ...old, [active.id]: level + 1 }));
    setMarketValues(old => ({ ...old, [active.id]: Math.round(((Number(old[active.id]) || active.price) + cost * 1.35) * 100) / 100 }));
    setSteps(value => value + 1);
    const nextLevel = level + 1;
    const newProperty = developedProperty({ ...active, floors: active.floors + 1 });
    tell(active.name + ' geliştirildi: seviye ' + nextLevel + '/3. Mülk değeri ve kira potansiyeli arttı; yatırım ₺' + cost.toLocaleString('tr-TR') + '.');
  }; `;
  if (!s.includes(anchor)) throw new Error('Development insertion anchor missing');
  s = s.replace(anchor, helpers);
}

s = s.replace(
  "version: 2, playerName, steps, cash, owned, rented, selected, showPortfolio, professionId, marketValues,",
  "version: 2, playerName, steps, cash, owned, rented, selected, showPortfolio, professionId, marketValues, developments,"
);
s = s.replace(
  "[playerName, steps, cash, owned, rented, selected, showPortfolio, professionId, marketValues, hour,",
  "[playerName, steps, cash, owned, rented, selected, showPortfolio, professionId, marketValues, developments, hour,"
);

s = s.replace(
  "  const active = properties.find(p => p.id === selected) || properties[0];",
  "  const activeBase = properties.find(p => p.id === selected) || properties[0];\n  const active = developedProperty(activeBase);"
);
s = s.replace(
  "  const portfolio = properties.filter(p => owned.includes(p.id));",
  "  const portfolio = properties.filter(p => owned.includes(p.id)).map(developedProperty);"
);

s = s.replace(
  "function CityScene({ selected, owned, ownerByProperty = {}, playerId = 'solo', onSelect, hour, overlay }) {",
  "function CityScene({ selected, owned, ownerByProperty = {}, playerId = 'solo', onSelect, hour, overlay, developments = {} }) {"
);
s = s.replace(
  "      const h = p.floors * floorHeight;",
  "      const buildingFloors = p.floors + Math.max(0, Math.min(3, Number(developments[p.id]) || 0));\n      const h = buildingFloors * floorHeight;"
);
s = s.replace("for (let floor = 1; floor < p.floors; floor++) {", "for (let floor = 1; floor < buildingFloors; floor++) {");
s = s.replace("for (let floor = 0; floor < p.floors; floor++) {", "for (let floor = 0; floor < buildingFloors; floor++) {");
s = s.replace("  }, [owned, ownerByProperty, playerId]);", "  }, [owned, ownerByProperty, playerId, developments]);");
s = s.replace(
  "<CityScene selected={selected} owned={owned} ownerByProperty={ownerByProperty} playerId={playerId} onSelect={selectProperty} hour={hour} overlay={",
  "<CityScene selected={selected} owned={owned} ownerByProperty={ownerByProperty} playerId={playerId} onSelect={selectProperty} hour={hour} developments={developments} overlay={"
);

const buyAnchor = "          {owned.includes(active.id) && <button className=\"rent-button\" onClick={toggleRent}>{rented.includes(active.id) ? 'KİRACIYI ÇIKAR' : 'KİRACI BUL VE KİRAYA VER'}</button>}";
const upgradeUi = `          {owned.includes(active.id) && <div className="development-panel">
            <div className="card-label">MÜLK GELİŞTİRME</div>
            <div className="development-heading"><strong>SEVİYE {developmentLevel(active.id)} / 3</strong><span>{developmentLevel(active.id) === 3 ? 'TAM GELİŞMİŞ' : 'YENİDEN İNŞA / GENİŞLETME'}</span></div>
            <div className="development-meter"><span style={{width: (developmentLevel(active.id) / 3 * 100) + '%'}} /></div>
            <div className="development-benefits"><span>Geliştirme sonrası kira</span><strong>₺{(active.rent * (1 + developmentLevel(active.id) * 0.18) / 30).toFixed(2)} / gün</strong></div>
            <div className="development-benefits"><span>Tahmini yatırım değeri artışı</span><strong>+₺{Math.round(active.price * 0.22 * 1.35).toLocaleString('tr-TR')}</strong></div>
            <button className="development-button" onClick={upgradeProperty} disabled={rented.includes(active.id) || developmentLevel(active.id) >= 3 || cash < getDevelopmentCost(active)}>
              {developmentLevel(active.id) >= 3 ? 'EN ÜST SEVİYEYE ULAŞTI' : rented.includes(active.id) ? 'KİRACI VARKEN GELİŞTİRİLEMEZ' : 'GELİŞTİR · ₺' + getDevelopmentCost(active).toLocaleString('tr-TR')}
            </button>
            <p className="small-note">Her yatırım binaya bir kat ekler. Mülk değeri ve kira potansiyeli yükselir. Bakkal, fırın, kahvehane ve lokanta gibi bazı yapılar gelişim seviyesine göre dönüşür.</p>
          </div>}`;
if (!s.includes('className="development-panel"')) {
  if (!s.includes(buyAnchor)) throw new Error('Development UI anchor missing');
  s = s.replace(buyAnchor, buyAnchor + '\n' + upgradeUi);
}

if (!s.includes('.development-panel')) {
  const cssPath = 'src/style.css';
  let css = fs.readFileSync(cssPath, 'utf8');
  css += `\n.development-panel{margin:12px 0;padding:12px;background:#17212b;border:1px solid #465263;border-radius:10px}.development-heading{display:flex;justify-content:space-between;gap:8px;align-items:center;margin:8px 0;font-size:10px}.development-heading strong{color:#f0c875}.development-heading span{color:#a9b8c6;font-size:8px}.development-meter{height:5px;background:#303d49;border-radius:6px;overflow:hidden;margin-bottom:10px}.development-meter span{display:block;height:100%;background:#d0a95f}.development-benefits{display:flex;justify-content:space-between;gap:8px;padding:5px 0;font-size:10px}.development-benefits span{color:#a9b8c6}.development-benefits strong{color:#e2e9ee}.development-button{width:100%;margin-top:9px;padding:11px;background:#b58a46;color:#171b1e;border:0;border-radius:6px;font-weight:800;font-size:10px;cursor:pointer}.development-button:disabled{opacity:.45;cursor:not-allowed}\n`;
  fs.writeFileSync(cssPath, css, 'utf8');
}

s = s.replace(
  "setWorkHours(0); setCareerHours(0); setShopPropertyId(null); setWineBottles(0); setBusinessPlans({});",
  "setWorkHours(0); setCareerHours(0); setShopPropertyId(null); setWineBottles(0); setDevelopments({}); setBusinessPlans({});"
);

fs.writeFileSync(path, s, 'utf8');
