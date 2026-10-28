import fs from 'node:fs';

const path = 'src/App.jsx';
let s = fs.readFileSync(path, 'utf8');

const extraCatalog = `
const EXTRA_TRADE_CATALOG = {
  33: [
    { id: 'kumas-bez', name: 'Pamuklu kumaş', cost: 8, price: 18 },
    { id: 'kumas-yun', name: 'Yün kumaş', cost: 14, price: 31 },
    { id: 'ipek-kumas', name: 'İpek kumaş', cost: 28, price: 58 }
  ],
  34: [
    { id: 'kolonya-limon', name: 'Limon kolonyası', cost: 4, price: 11 },
    { id: 'kolonya-gul', name: 'Gül kolonyası', cost: 5, price: 13 },
    { id: 'koku-sisesi', name: 'Koku şişesi', cost: 7, price: 18 }
  ],
  35: [
    { id: 'lokum', name: 'Lokum', cost: 5, price: 14 },
    { id: 'akide', name: 'Akide şekeri', cost: 4, price: 12 },
    { id: 'badem-ezmesi', name: 'Badem ezmesi', cost: 8, price: 20 },
    { id: 'helva', name: 'Helva', cost: 6, price: 16 }
  ],
  36: [
    { id: 'leblebi', name: 'Leblebi', cost: 3, price: 9 },
    { id: 'kavrulmus-nohut', name: 'Kavrulmuş nohut', cost: 3, price: 10 },
    { id: 'kuruyemis', name: 'Kuruyemiş karışımı', cost: 6, price: 15 }
  ],
  37: [
    { id: 'kundura', name: 'Kundura', cost: 18, price: 39 },
    { id: 'deri-ayakkabi', name: 'Deri ayakkabı', cost: 27, price: 58 },
    { id: 'ayakkabi-taban', name: 'Ayakkabı tabanı', cost: 8, price: 20 }
  ],
  38: [
    { id: 'gumus-yuzuk', name: 'Gümüş yüzük', cost: 35, price: 76 },
    { id: 'altin-bilezik', name: 'Altın bilezik', cost: 90, price: 190 },
    { id: 'saat', name: 'Cep saati', cost: 48, price: 105 }
  ],
  39: [
    { id: 'berber-tiras', name: 'Tıraş hizmeti', cost: 0, price: 9, service: true },
    { id: 'berber-sakal', name: 'Sakal tıraşı', cost: 0, price: 6, service: true },
    { id: 'berber-sac', name: 'Saç kesimi', cost: 0, price: 10, service: true }
  ],
  40: [
    { id: 'pastane-pasta', name: 'Yaş pasta dilimi', cost: 4, price: 12 },
    { id: 'pastane-kurabiye', name: 'Kurabiye', cost: 2, price: 7 },
    { id: 'pastane-tatli', name: 'Şerbetli tatlı', cost: 3, price: 9 },
    { id: 'pastane-kahve', name: 'Kahve ve tatlı', cost: 4, price: 12 }
  ],
  41: [
    { id: 'sapka-kece', name: 'Keçe şapka', cost: 15, price: 34 },
    { id: 'sapka-fes', name: 'Fes', cost: 9, price: 22 },
    { id: 'sapka-kasket', name: 'Kasket', cost: 12, price: 28 }
  ],
  42: [
    { id: 'guldeste', name: 'Gül demeti', cost: 3, price: 9 },
    { id: 'karanfil', name: 'Karanfil demeti', cost: 2, price: 7 },
    { id: 'saksi-cicegi', name: 'Saksı çiçeği', cost: 5, price: 14 }
  ],
  43: [
    { id: 'portre', name: 'Portre fotoğrafı', cost: 5, price: 18, service: true },
    { id: 'kartpostal', name: 'Fotoğraf kartı', cost: 3, price: 11 },
    { id: 'vesikalik', name: 'Vesikalık fotoğraf', cost: 4, price: 14, service: true }
  ],
  44: [
    { id: 'sabun', name: 'Kalıp sabun', cost: 3, price: 9 },
    { id: 'lavanta-sabun', name: 'Lavanta sabunu', cost: 4, price: 12 },
    { id: 'guzel-koku', name: 'Güzel koku', cost: 6, price: 16 }
  ]
};

const getTradeCatalog = (catalog, propertyId) => catalog[propertyId] || EXTRA_TRADE_CATALOG[propertyId] || [];
`;

if (!s.includes('const EXTRA_TRADE_CATALOG')) {
  const anchor = 'const venueTypesByProfession = {';
  if (!s.includes(anchor)) throw new Error('Could not locate profession venue catalog anchor');
  s = s.replace(anchor, extraCatalog + '\n' + anchor);
}

// New shops must participate in the same product/stock UI as the original businesses.
s = s.replace(/tradeCatalog\[([^\]]+)\]/g, 'getTradeCatalog(tradeCatalog, $1)');

// Service businesses do not consume inventory. Their capacity is customer time, not stock.
s = s.replace(/\bstock > 0\b/g, '(product?.service || stock > 0)');
s = s.replace(/Math\.max\(0, stock - sold\)/g, 'product?.service ? stock : Math.max(0, stock - sold)');

// Put the expanded premises into streets rather than extending the old rail-side rows.
const oldLayout = /\/\/ Galata-style irregular street frontages: narrow blocks, staggered facades and varied angles\.\nproperties\.forEach\(\(property, index\) => \{.*?\n\}\);/s;
const streetLayout = `// Street-based placement: storefronts sit on alternating sides of several pedestrian/vehicle streets.
const streetSlots = [
  [-16, -18.5], [-9, -18.0], [-2, -18.5], [6, -18.0], [13, -18.5],
  [-14, -11.0], [-6, -10.5], [2, -11.0], [10, -10.5], [17, -11.0],
  [-17, -3.5], [-9, -3.0], [-1, -3.5], [7, -3.0], [15, -3.5],
  [-15, 4.5], [-7, 4.0], [1, 4.5], [9, 4.0], [17, 4.5],
  [-16, 12.0], [-8, 11.5], [0, 12.0], [8, 11.5], [16, 12.0],
  [-14, 19.0], [-6, 18.5], [2, 19.0], [10, 18.5], [17, 19.0],
  [-18, 26.0], [-10, 25.5], [-2, 26.0], [6, 25.5], [14, 26.0],
  [-15, -25.0], [-7, -24.5], [1, -25.0], [9, -24.5], [17, -25.0],
  [-20, 7.5], [20, 7.5], [-20, 16.5], [20, 16.5]
];
properties.forEach((property, index) => {
  const slot = streetSlots[index % streetSlots.length];
  property.x = slot[0];
  property.z = slot[1];
  property.rotation = [0, -0.06, 0.045, 0.08, -0.04][index % 5];
});`;
if (oldLayout.test(s)) s = s.replace(oldLayout, streetLayout);

fs.writeFileSync(path, s, 'utf8');
