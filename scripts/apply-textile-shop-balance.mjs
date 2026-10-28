import fs from 'node:fs';

const path = 'src/App.jsx';
let s = fs.readFileSync(path, 'utf8');

// Textile shops (property IDs 33 and 51) receive a slightly lower markup.
// This edits the effective pricing formula; catalog display prices are normalized
// by getTradeCatalog, so changing the raw listed prices alone would have no effect.
const oldMarkup = '    const markup = luxury ? 1.65 : 1.55;';
const newMarkup = `    const textileShop = [33, 51].includes(Number(propertyId));
    const markup = textileShop ? (luxury ? 1.52 : 1.45) : (luxury ? 1.65 : 1.55);`;

if (s.includes(oldMarkup)) {
  s = s.replace(oldMarkup, newMarkup);
} else if (!s.includes(newMarkup)) {
  throw new Error('Could not find effective getTradeCatalog markup formula.');
}

fs.writeFileSync(path, s, 'utf8');
