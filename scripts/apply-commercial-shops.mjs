import fs from 'node:fs';

const path = 'src/App.jsx';
let s = fs.readFileSync(path, 'utf8');

const extraCatalog = `
const EXTRA_TRADE_CATALOG = {
  33: [
    { id: 'kumas-bez', name: 'Pamuklu kumaş', cost: 8, price: 18, units: 8 },
    { id: 'kumas-yun', name: 'Yün kumaş', cost: 14, price: 31, units: 8 },
    { id: 'ipek-kumas', name: 'İpek kumaş', cost: 28, price: 58, units: 8 },
    { id: 'terzi-gomlek', name: 'Hazır gömlek', cost: 12, price: 29, units: 6 },
    { id: 'terzi-pantolon', name: 'Pantolon', cost: 16, price: 37, units: 6 },
    { id: 'terzi-yelek', name: 'Yelek', cost: 13, price: 31, units: 6 },
    { id: 'terzi-ceket', name: 'Ceket', cost: 26, price: 58, units: 4 },
    { id: 'terzi-tamir', name: 'Giysi tamiri', cost: 3, price: 12, units: 0, service: true }
  ],
  34: [
    { id: 'kolonya-limon', name: 'Limon kolonyası', cost: 4, price: 11, units: 8 },
    { id: 'kolonya-gul', name: 'Gül kolonyası', cost: 5, price: 13, units: 8 },
    { id: 'kolonya-lavanta', name: 'Lavanta kolonyası', cost: 6, price: 16, units: 8 },
    { id: 'kolonya-yasemin', name: 'Yasemin kolonyası', cost: 8, price: 21, units: 6 },
    { id: 'koku-sisesi', name: 'Koku şişesi', cost: 7, price: 18, units: 8 }
  ],
  35: [
    { id: 'lokum', name: 'Lokum', cost: 5, price: 14, units: 8 },
    { id: 'akide', name: 'Akide şekeri', cost: 4, price: 12, units: 8 },
    { id: 'badem-ezmesi', name: 'Badem ezmesi', cost: 8, price: 20, units: 8 },
    { id: 'helva', name: 'Helva', cost: 6, price: 16, units: 8 }
  ],
  36: [
    { id: 'leblebi', name: 'Leblebi', cost: 3, price: 9, units: 8 },
    { id: 'kavrulmus-nohut', name: 'Kavrulmuş nohut', cost: 3, price: 10, units: 8 },
    { id: 'kuruyemis', name: 'Kuruyemiş karışımı', cost: 6, price: 15, units: 8 }
  ],
  37: [
    { id: 'kundura', name: 'Kundura', cost: 18, price: 39, units: 8 },
    { id: 'deri-ayakkabi', name: 'Deri ayakkabı', cost: 27, price: 58, units: 8 },
    { id: 'ayakkabi-taban', name: 'Ayakkabı tabanı', cost: 8, price: 20, units: 8 }
  ],
  38: [
    { id: 'gumus-yuzuk', name: 'Gümüş yüzük', cost: 35, price: 76, units: 8 },
    { id: 'altin-bilezik', name: 'Altın bilezik', cost: 90, price: 190, units: 8 },
    { id: 'saat', name: 'Cep saati', cost: 48, price: 105, units: 8 }
  ],
  39: [
    { id: 'berber-tiras', name: 'Tıraş hizmeti', cost: 0, price: 9, units: 0, service: true },
    { id: 'berber-sakal', name: 'Sakal tıraşı', cost: 0, price: 6, units: 0, service: true },
    { id: 'berber-sac', name: 'Saç kesimi', cost: 0, price: 10, units: 0, service: true }
  ],
  40: [
    { id: 'pastane-limonata', name: 'Ev yapımı limonata', cost: 3, price: 10, units: 8 },
    { id: 'pastane-profiterol', name: 'Profiterol', cost: 5, price: 18, units: 6 },
    { id: 'pastane-ekler', name: 'Ekler', cost: 4, price: 15, units: 6 },
    { id: 'pastane-pasta', name: 'Yaş pasta dilimi', cost: 4, price: 12, units: 8 },
    { id: 'pastane-kurabiye', name: 'Kurabiye', cost: 2, price: 7, units: 8 },
    { id: 'pastane-tart', name: 'Meyveli tart', cost: 4, price: 13, units: 6 },
    { id: 'pastane-kek', name: 'Kek dilimi', cost: 3, price: 9, units: 8 },
    { id: 'pastane-sutlu', name: 'Sütlü tatlı', cost: 3, price: 10, units: 6 },
    { id: 'pastane-tatli', name: 'Şerbetli tatlı', cost: 3, price: 9, units: 8 },
    { id: 'pastane-kahve', name: 'Kahve ve tatlı', cost: 4, price: 12, units: 8 }
  ],
  41: [
    { id: 'sapka-kece', name: 'Keçe şapka', cost: 15, price: 34, units: 8 },
    { id: 'sapka-fes', name: 'Fes', cost: 9, price: 22, units: 8 },
    { id: 'sapka-kasket', name: 'Kasket', cost: 12, price: 28, units: 8 }
  ],
  42: [
    { id: 'guldeste', name: 'Gül demeti', cost: 3, price: 9, units: 8 },
    { id: 'karanfil', name: 'Karanfil demeti', cost: 2, price: 7, units: 8 },
    { id: 'saksi-cicegi', name: 'Saksı çiçeği', cost: 5, price: 14, units: 8 }
  ],
  43: [
    { id: 'portre', name: 'Portre fotoğrafı', cost: 5, price: 18, units: 0, service: true },
    { id: 'kartpostal', name: 'Fotoğraf kartı', cost: 3, price: 11, units: 8 },
    { id: 'vesikalik', name: 'Vesikalık fotoğraf', cost: 4, price: 14, units: 0, service: true }
  ],
  44: [
    { id: 'sabun', name: 'Kalıp sabun', cost: 3, price: 9, units: 8 },
    { id: 'lavanta-sabun', name: 'Lavanta sabunu', cost: 4, price: 12, units: 8 },
    { id: 'guzel-koku', name: 'Güzel koku', cost: 6, price: 16, units: 8 }
  ],
  45: [
    { id: 'sahaf-roman', name: 'Eski baskı roman', cost: 10, price: 24, units: 6 },
    { id: 'sahaf-gazete', name: 'Eski gazete ve mecmua', cost: 5, price: 13, units: 8 },
    { id: 'sahaf-harita', name: 'Şehir haritası', cost: 8, price: 19, units: 6 }
  ],
  46: [
    { id: 'serkuteri-peynir', name: 'Beyaz peynir', cost: 8, price: 19, units: 8 },
    { id: 'serkuteri-zeytin', name: 'Zeytin', cost: 6, price: 15, units: 8 },
    { id: 'serkuteri-pastirma', name: 'Pastırma', cost: 14, price: 32, units: 6 }
  ],
  47: [
    { id: 'bakir-cezve', name: 'Bakır cezve', cost: 12, price: 29, units: 6 },
    { id: 'bakir-tepsi', name: 'Bakır tepsi', cost: 16, price: 38, units: 6 },
    { id: 'kalay-tamir', name: 'Kalaylama hizmeti', cost: 0, price: 12, units: 0, service: true }
  ],
  48: [
    { id: 'oyuncak-at', name: 'Ahşap at', cost: 8, price: 21, units: 6 },
    { id: 'oyuncak-bebek', name: 'Bez bebek', cost: 6, price: 16, units: 8 },
    { id: 'oyuncak-top', name: 'Deri top', cost: 7, price: 18, units: 6 }
  ],
  49: [
    { id: 'saat-tamir', name: 'Saat tamiri', cost: 0, price: 16, units: 0, service: true },
    { id: 'cep-saati', name: 'Cep saati', cost: 22, price: 49, units: 4 },
    { id: 'duvar-saati', name: 'Duvar saati', cost: 28, price: 62, units: 4 }
  ],
  50: [
    { id: 'kavrulmus-kahve', name: 'Kavrulmuş kahve', cost: 9, price: 23, units: 8 },
    { id: 'kahve-cekirdegi', name: 'Yeşil kahve çekirdeği', cost: 12, price: 28, units: 8 },
    { id: 'kahve-fincan', name: 'Kahve fincanı', cost: 7, price: 17, units: 6 }
  ],
  51: [
    { id: 'perde', name: 'Perde kumaşı', cost: 14, price: 32, units: 6 },
    { id: 'masa-ortusu', name: 'Masa örtüsü', cost: 9, price: 22, units: 8 },
    { id: 'yatak-ortu', name: 'Yatak örtüsü', cost: 18, price: 41, units: 6 }
  ],
  52: [
    { id: 'tabela', name: 'Dükkan tabelası', cost: 11, price: 27, units: 6 },
    { id: 'boya', name: 'Duvar boyası', cost: 7, price: 18, units: 8 },
    { id: 'yazi-tabela', name: 'El yazısı tabela hizmeti', cost: 0, price: 14, units: 0, service: true }
  ],
  53: [
    { id: 'meyhane-meze', name: 'Meze tabağı', cost: 6, price: 18, units: 8 },
    { id: 'meyhane-peynir', name: 'Peynir ve zeytin', cost: 5, price: 15, units: 8 },
    { id: 'meyhane-balik', name: 'Günün balığı', cost: 12, price: 32, units: 5 },
    { id: 'meyhane-ekmek', name: 'Ekmek ve sıcak meze', cost: 3, price: 11, units: 8 },
    { id: 'meyhane-sarap', name: 'Kadeh şarap', cost: 7, price: 22, units: 6 }
  ],
  54: [
    { id: 'mahzen-sarap-uretim', name: 'Galata mahzen şarabı üretimi', cost: 72, price: 18, units: 8, production: true },
    { id: 'sarap-sise', name: 'Şişelenmiş kırmızı şarap', cost: 88, price: 22, units: 8 },
    { id: 'sarap-fici', name: 'Meşe fıçıda yıllanmış şarap', cost: 128, price: 32, units: 8 },
    { id: 'uzum-sirkesi', name: 'Üzüm sirkesi', cost: 40, price: 10, units: 8 }
  ],
  55: [
    { id: 'pansiyon-gece', name: 'Pansiyon gecelik konaklama', cost: 36, price: 18, units: 8 },
    { id: 'pansiyon-kahvalti', name: 'Pansiyon kahvaltısı', cost: 12, price: 6, units: 8 }
  ],
  56: [
    { id: 'otel-oda', name: 'Otel oda geceliği', cost: 88, price: 44, units: 8 },
    { id: 'otel-suit', name: 'Üst kat oda geceliği', cost: 140, price: 70, units: 4 },
    { id: 'otel-yemek', name: 'Otel yemek servisi', cost: 24, price: 12, units: 8 }
  ],
  57: [
    { id: 'sinema-bilet', name: 'Sinema bileti', cost: 16, price: 8, units: 8 },
    { id: 'sinema-atistirmalik', name: 'Sinema atıştırmalığı', cost: 6, price: 3, units: 8 }
  ],
  58: [
    { id: 'gazino-giris', name: 'Gazino giriş bileti', cost: 28, price: 14, units: 8 },
    { id: 'gazino-masa', name: 'Gazino masa servisi', cost: 32, price: 16, units: 8 },
    { id: 'gazino-muzik', name: 'Musiki gecesi bileti', cost: 22, price: 11, units: 8 }
  ],
  59: [
    { id: 'arka-kahve', name: 'Kahve ve lokum', cost: 8, price: 4, units: 8 },
    { id: 'arka-nargile', name: 'Kahve yanı ikram', cost: 10, price: 5, units: 8 }
  ],
  60: [
    { id: 'hamam-giris', name: 'Hamam giriş hizmeti', cost: 24, price: 12, units: 8 },
    { id: 'hamam-kese', name: 'Kese ve tellak hizmeti', cost: 18, price: 9, units: 8 }
  ],
  61: [
    { id: 'han-oda', name: 'Han dükkânı günlük kirası', cost: 40, price: 20, units: 8 },
    { id: 'han-depo', name: 'Depo ve yükleme hizmeti', cost: 18, price: 9, units: 8 }
  ],
  62: [
    { id: 'arka-meyhane-meze', name: 'Meze tabağı', cost: 7, price: 18, units: 8 },
    { id: 'arka-meyhane-sarap', name: 'Kadeh şarap', cost: 8, price: 20, units: 8 }
  ]
};

// Catalog cost is the total purchase price for the whole stock batch, not a per-unit cost.
// Derive the shelf price from cost / units, so batch economics remain consistent with property prices.
// Services are labor fees, so they do not require stock or merchandise cost.
const getTradeCatalog = (catalog, propertyId) => {
  const items = catalog[propertyId] || EXTRA_TRADE_CATALOG[propertyId] || [];
  return items.map(item => {
    const listedPrice = Math.max(0, Number(item.price) || 0);
    if (item.service) return { ...item, cost: 0, price: listedPrice };
    const batchCost = Math.max(0, Number(item.cost) || 0);
    const units = Math.max(1, Number(item.units) || 1);
    const unitCost = batchCost / units;
    const luxury = /altın|gümüş|ipek|kuyum|cep saati|deri ayakkabı/i.test(item.name);
    const markup = luxury ? 1.65 : 1.55;
    const price = Math.max(0.25, Math.round(unitCost * markup * 100) / 100);
    return { ...item, cost: batchCost, price };
  });
};
`;

if (!s.includes('const EXTRA_TRADE_CATALOG')) {
  const anchor = 'const venueTypesByProfession = {';
  if (!s.includes(anchor)) throw new Error('Could not locate profession venue catalog anchor');
  s = s.replace(anchor, extraCatalog + '\n' + anchor);
}

// New shops must participate in the same product/stock UI as the original businesses.
s = s.replace(/tradeCatalog\[([^\]]+)\]/g, 'getTradeCatalog(tradeCatalog, $1)');
s = s.replace('?.production ? "ÜRETİM YAP / STOK EKLE" : "TEDARİK ET / STOK AL"', '?.service ? "HİZMETİ SEÇ" : (getTradeCatalog(tradeCatalog, active.id) || []).find(item => item.id === businessPlans[active.id])?.production ? "ÜRETİM YAP / STOK EKLE" : "TEDARİK ET / STOK AL"');

// Service businesses do not consume inventory. Their capacity is customer time, not stock.
s = s.replace(/\bstock > 0\b/g, '(product?.service || stock > 0)');
s = s.replace(/Math\.max\(0, stock - sold\)/g, 'product?.service ? stock : Math.max(0, stock - sold)');

// Put the expanded premises into streets rather than extending the old rail-side rows.
const oldLayout = /\/\/ Galata-style irregular street frontages: narrow blocks, staggered facades and varied angles\.\nproperties\.forEach\(\(property, index\) => \{.*?\n\}\);/s;
const streetLayout = `// Street-based placement: storefronts sit on alternating sides of several pedestrian/vehicle streets.
properties.forEach((property, index) => {
  if (property.id <= 32) {
    const frontage = Math.floor(index / 8);
    const slot = index % 8;
    const baseX = [-8.5, 8.5, -18.5, 18.5][frontage];
    const staggerX = [0.15, -0.65, 0.55, -0.25, 0.8, -0.45, 0.35, -0.1][slot];
    const staggerZ = [0.0, 0.7, -0.45, 0.35, -0.8, 0.55, -0.2, 0.25][(index * 3) % 8];
    property.x = baseX + staggerX * (frontage < 2 ? 0.85 : 1.35);
    property.z = -21.2 + slot * 5.85 + staggerZ;
  } else {
    const streetSlots = [
      [-8.7, -22], [8.7, -19.7], [-18.7, -17.4], [18.7, -15.1],
      [-8.7, -12.8], [8.7, -10.5], [-18.7, -8.2], [18.7, -5.9],
      [-8.7, -3.6], [8.7, -1.3], [-18.7, 1], [18.7, 3.3],
      [-8.7, 5.6], [8.7, 7.9], [-18.7, 10.2], [18.7, 12.5],
      [-8.7, 14.8], [8.7, 17.1], [-18.7, 19.4], [18.7, 21.7],
      [-8.7, 24], [8.7, 26.3],
      [-28, -22], [28, -18], [-28, -10], [28, -6],
      [-28, 2], [28, 6], [-28, 14], [28, 18]
    ];
    const slot = streetSlots[(property.id - 33) % streetSlots.length];
    property.x = slot[0];
    property.z = slot[1];
  }
  property.rotation = [0, -0.08, 0.045, 0.11, -0.055, 0.025, -0.1, 0.06][(index * 5 + 2) % 8];
});`;
if (oldLayout.test(s)) s = s.replace(oldLayout, streetLayout);

// Service items do not require inventory; regular goods have a defined batch size.
const stockAnchor = "    if (!item || item.units <= 0) { tell('Bu mülk için henüz tedarik edilebilir ürün grubu yok.'); return; }";
const stockReplacement = `    if (!item) { tell('Bu mülk için henüz tedarik edilebilir ürün grubu yok.'); return; }
    if (item.service) {
      tell(item.name + ' hizmeti seçildi. Ürün stoğu gerekmez; müşteriler geldikçe hizmet satışı yapılır.');
      return;
    }
    if (!Number.isFinite(item.units) || item.units <= 0) { tell('Bu ürün için stok partisi tanımlı değil.'); return; }`;
if (s.includes(stockAnchor)) s = s.replace(stockAnchor, stockReplacement);

const salesAnchor = "      const stock = Math.max(0, Number(stockByProperty[propertyId]) || 0);";
const salesReplacement = `      const serviceSale = Boolean(product.service);
      const stock = serviceSale ? 1 : Math.max(0, Number(stockByProperty[propertyId]) || 0);`;
if (s.includes(salesAnchor)) s = s.replace(salesAnchor, salesReplacement);
s = s.replace("      if (stock <= 0 || Math.random() > salesChance) return;\n      const sold = Math.min(stock, 1 + (Math.random() > 0.72 ? 1 : 0));",
`      if ((!serviceSale && stock <= 0) || Math.random() > salesChance) return;
      const sold = serviceSale ? 1 : Math.min(stock, 1 + (Math.random() > 0.72 ? 1 : 0));`);
s = s.replace("      stockChanges[propertyId] = stock - sold;", "      if (!serviceSale) stockChanges[propertyId] = stock - sold;");
s = s.replace("      entries.push(property.name + ': ' + sold + ' adet ' + product.name + ' satıldı (+₺' + takings.toFixed(2) + ')');",
"      entries.push(property.name + ': ' + (serviceSale ? product.name + ' hizmeti' : sold + ' adet ' + product.name) + ' satıldı (+₺' + takings.toFixed(2) + ')');");

// Retail price is the actual sale price; remove the old 1.7x-2.1x hidden revenue multiplier.
s = s.replace(
  /      const baseMultiplier = property\.type === 'İşletme' \? 2\.1 : property\.type === 'Atölye' \? 2\.0 : 1\.7;\n      const masteryLevel = soldBefore >= 60 \? 5 : soldBefore >= 35 \? 4 : soldBefore >= 15 \? 3 : soldBefore >= 5 \? 2 : 1;\n      const masteryBonus = \(masteryLevel - 1\) \* 0\.03;\n      const multiplier = baseMultiplier \* \(1 \+ masteryBonus\);\n      const takings = Math\.round\(sold \* product\.price \* multiplier \* 100\) \/ 100;/,
  "      const masteryLevel = soldBefore >= 60 ? 5 : soldBefore >= 35 ? 4 : soldBefore >= 15 ? 3 : soldBefore >= 5 ? 2 : 1;\n      const masteryBonus = (masteryLevel - 1) * 0.03;\n      const takings = Math.round(sold * product.price * (1 + masteryBonus) * 100) / 100;"
);

// Normalize monthly rent to a 15% annual gross yield on each property's purchase price.
const rentNormalization = `properties.forEach(property => {
  property.rent = Math.max(1, Math.round(property.price * 0.15 / 12));
});`;
if (!s.includes('property.price * 0.15 / 12')) {
  const saveAnchor = "const SAVE_KEY = 'mahalle-save-v1';";
  if (!s.includes(saveAnchor)) throw new Error('Could not locate rent normalization anchor');
  s = s.replace(saveAnchor, rentNormalization + '\n\n' + saveAnchor);
}

// item.cost is already the total for the stock batch. Charge it once; never multiply by units.
fs.writeFileSync(path, s, 'utf8');
