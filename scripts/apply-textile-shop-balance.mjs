import fs from 'node:fs';

const path = 'src/App.jsx';
let s = fs.readFileSync(path, 'utf8');

// Textile shops should use the displayed shelf price as the actual sale price.
// Their old hidden 1.7x/2.1x business multiplier made realized revenue diverge
// from the purchase/sale figures shown to the player.
const oldMultiplier = 'const multiplier = baseMultiplier * (1 + masteryBonus);';
const newMultiplier = 'const multiplier = [10, 33, 51].includes(propertyId) ? 1 : baseMultiplier * (1 + masteryBonus);';
if (s.includes(oldMultiplier)) {
  s = s.replace(oldMultiplier, newMultiplier);
} else if (!s.includes(newMultiplier)) {
  throw new Error('Could not locate the business sales multiplier; refusing to continue.');
}

// Keep a viable but less extreme merchandise margin relative to the building price.
const oldMarkup = 'const markup = luxury ? 1.55 : 1.45;';
const newMarkup = 'const textileShop = [10, 33, 51].includes(propertyId);\n    const markup = textileShop ? (luxury ? 1.6 : 1.55) : (luxury ? 1.55 : 1.45);';
if (s.includes(oldMarkup)) {
  s = s.replace(oldMarkup, newMarkup);
} else if (!s.includes(newMarkup)) {
  throw new Error('Could not locate the trade catalog markup; refusing to continue.');
}

fs.writeFileSync(path, s, 'utf8');
