# Mahalle — Beyoğlu 1923

A small, browser-based historical life and property simulation prototype.

## Stack
- React
- Vite
- Three.js

## Run locally
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
```

## Prototype features
- Interactive 3D miniature of a stylized Beyoğlu street with animated low-poly pedestrians, a moving period tram, a selected-property marker and a day/night lighting cycle
- Selectable buildings, property details and ownership states
- Choose a trade: kolonyacı, leblebici, terzi, matbaacı, kahveci or gündelik işçi
- Trade and venue compatibility: commercial properties and workshops support different businesses
- 24-hour in-game clock with automatic time progression
- Hourly work, stock costs, business sales and property maintenance
- Buy properties, operate a compatible business, or lease an owned property to earn rent at month-end
- Portfolio, neighbourhood activity log, and a one-click new-game reset
- Game state saved in browser local storage so a refresh does not erase progress
- Responsive arcade-style interface using gaming typography and block-game-inspired visual language

## Historical source notes

- [Nazım Ümit Tol, *Cumhuriyet Dönemi Türkiyesi'nde işçi hareketlerinin gelişimi (1923-1946)*](https://openaccess.marmara.edu.tr/entities/publication/fc1c00bb-11bd-4886-a73b-8c996912446c) surveys Republic-era labour history and wages.
- [Mehmet Arif Koşar, *Türkiye'nin Ekonomi Politikası ve Çalışma İlişkileri (1923-1938)*](https://katalog.marmara.edu.tr/veriler/yordambt/cokluortam/4A/T0070687.pdf) includes a 1923-1927 cost-of-living index and a table of 1928 industrial wages.
- [Şevket Pamuk, historical prices and wages resources](https://ata.bogazici.edu.tr/tr/faculty/sevket-pamuk) includes Istanbul wage series extending to 1922.

These sources are useful historical context, but they do not establish exact Beyoğlu property prices, small-shop profits, or wages for every playable trade in 1923. For that reason, game economy values remain illustrative until more specific evidence is located.

The current map, wages, expenses and prices are illustrative game-balance values, not a historically verified reconstruction. The clock advances one in-game hour every 20 real seconds; actions can also advance time manually. Saves are local to the current browser and are not synced across devices.