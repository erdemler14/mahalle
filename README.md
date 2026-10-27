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
- Interactive 3D miniature of a stylized Beyoğlu street with animated low-poly pedestrians and a moving period tram
- Selectable buildings, property details and ownership states
- Choose a trade: kolonyacı, leblebici, terzi, matbaacı, kahveci or gündelik işçi
- Trade and venue compatibility: commercial properties and workshops support different businesses
- 24-hour in-game clock with automatic time progression
- Hourly work, stock costs, business sales and property maintenance
- Buy properties, operate a compatible business, or lease an owned property to earn rent at month-end
- Portfolio, neighbourhood activity log, and a one-click new-game reset
- Game state saved in browser local storage so a refresh does not erase progress
- Responsive arcade-style interface using gaming typography and block-game-inspired visual language

The current map, wages, expenses and prices are illustrative game-balance values, not a historically verified reconstruction. The clock advances one in-game hour every 20 real seconds; actions can also advance time manually. Saves are local to the current browser and are not synced across devices.