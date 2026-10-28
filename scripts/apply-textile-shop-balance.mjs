import fs from 'node:fs';

const path = 'src/App.jsx';
let s = fs.readFileSync(path, 'utf8');

// Rebalance only the Galata textile shop (property 33). Prices are the actual
// revenue per unit in daily settlement; keep service pricing unchanged.
const replacements = [
  ["{ id: 'kumas-bez', name: 'Pamuklu kumaş', cost: 8, price: 18, units: 8 }", "{ id: 'kumas-bez', name: 'Pamuklu kumaş', cost: 8, price: 13, units: 8 }"],
  ["{ id: 'kumas-yun', name: 'Yün kumaş', cost: 14, price: 31, units: 8 }", "{ id: 'kumas-yun', name: 'Yün kumaş', cost: 14, price: 23, units: 8 }"],
  ["{ id: 'ipek-kumas', name: 'İpek kumaş', cost: 28, price: 58, units: 8 }", "{ id: 'ipek-kumas', name: 'İpek kumaş', cost: 28, price: 43, units: 8 }"],
  ["{ id: 'terzi-gomlek', name: 'Hazır gömlek', cost: 12, price: 29, units: 6 }", "{ id: 'terzi-gomlek', name: 'Hazır gömlek', cost: 12, price: 20, units: 6 }"],
  ["{ id: 'terzi-pantolon', name: 'Pantolon', cost: 16, price: 37, units: 6 }", "{ id: 'terzi-pantolon', name: 'Pantolon', cost: 16, price: 27, units: 6 }"],
  ["{ id: 'terzi-yelek', name: 'Yelek', cost: 13, price: 31, units: 6 }", "{ id: 'terzi-yelek', name: 'Yelek', cost: 13, price: 22, units: 6 }"],
  ["{ id: 'terzi-ceket', name: 'Ceket', cost: 26, price: 58, units: 4 }", "{ id: 'terzi-ceket', name: 'Ceket', cost: 26, price: 43, units: 4 }"]
];
for (const [before, after] of replacements) {
  if (s.includes(before)) s = s.replace(before, after);
  else if (!s.includes(after)) throw new Error('Could not find textile catalog entry: ' + before);
}

fs.writeFileSync(path, s, 'utf8');
