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
- Selectable buildings with varied 1920s Beyoğlu-inspired masonry, timber-house rooflines, bay windows, cornices, shopfront glazing, striped awnings and period-style signs
- Selectable buildings, property details and ownership states
- Choose a trade: kolonyacı, leblebici, terzi, matbaacı, kahveci or gündelik işçi
- Trade and venue compatibility: commercial properties and workshops support different businesses
- 24-hour in-game clock with automatic time progression
- Hourly work, stock costs, business sales and property maintenance
- Buy properties, operate a compatible business, or lease an owned property to earn rent at month-end
- The wine-and-grocery shop can be rented out or run directly; make batches of four bottles for 8 game lira and sell bottles while the shop is open
- Portfolio, neighbourhood activity log, and a one-click new-game reset
- Game state saved in browser local storage so a refresh does not erase progress
- Responsive arcade-style interface using gaming typography and block-game-inspired visual language

## Historical source notes

- [Nazım Ümit Tol, *Cumhuriyet Dönemi Türkiyesi'nde işçi hareketlerinin gelişimi (1923-1946)*](https://openaccess.marmara.edu.tr/entities/publication/fc1c00bb-11bd-4886-a73b-8c996912446c) surveys Republic-era labour history and wages.
- [Mehmet Arif Koşar, *Türkiye'nin Ekonomi Politikası ve Çalışma İlişkileri (1923-1938)*](https://katalog.marmara.edu.tr/veriler/yordambt/cokluortam/4A/T0070687.pdf) includes a 1923-1927 cost-of-living index and a table of 1928 industrial wages.
- [Şevket Pamuk, historical prices and wages resources](https://ata.bogazici.edu.tr/tr/faculty/sevket-pamuk) includes Istanbul wage series extending to 1922.

These sources are useful historical context, but they do not establish exact Beyoğlu property prices, small-shop profits, or wages for every playable trade in 1923. For that reason, game economy values remain illustrative until more specific evidence is located.

The current map, wages, expenses and prices are illustrative game-balance values, not a historically verified reconstruction. The clock advances one in-game hour every 20 real seconds; actions can also advance time manually. Saves are local to the current browser and are not synced across devices.
## Shared city and accounts (Supabase)

The shared-city foundation uses Supabase Auth, Postgres and Realtime. Each signed-in player has a separate save and game clock; property ownership and rental status are shared across all accounts.

1. Create a Supabase project and enable Email/Password sign-in under **Authentication → Providers**.
2. Open **SQL Editor** in Supabase and run the complete migration in `supabase/migrations/202610280001_shared_city.sql`.
3. In **Project Settings → API**, copy the project URL and the public anon/publishable key. Never use a `service_role` key in the browser.
4. Add these variables to Vercel → Project → Settings → Environment Variables (Production and Preview as needed):
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Redeploy the Vercel project. With the variables present, the app shows account registration/login and enters the common city automatically; there is no separate room code.
6. For local development, copy `.env.example` to `.env.local` and fill in the same public values.

The database migration seeds the current 62 properties. Property purchase, sale and rental-state changes use database functions that check ownership and lock the property row, preventing two players from buying the same property concurrently. Each player's save and game clock remain separate.

**Current integration boundary:** game actions and save snapshots still originate in the browser. The next hardening phase should move every cash credit/debit, stock purchase/sale, rent settlement, development investment and market-price change into server-validated database functions. Do not treat client-side game state as cheat-proof until that phase is complete.
