# Meridian

A premium travel-guide site. The homepage is an immersive 3D stippled globe.
Search a city, fly there, then read a full editorial guide.

**Live guides:** Tokyo · Paris · Bangkok · Singapore · New York
London, Rome, and Seoul are temporarily `coming-soon` (content quality stop-loss).
Other catalog cities open a short coming-soon page.

## Features

- Drag, pinch, and zoom a mesh Earth (dotted land, not a particle cloud)
- Type-ahead search (`tok` → Tokyo, `san` → San Francisco / San Sebastián)
- Keyboard: `/` focuses search, arrows + Enter confirm
- English / 简体中文 toggle
- City pages cover neighborhoods, things to do, food, stay, transport, money, eSIM, apps, etiquette, safety, itineraries, and FAQ

## Architecture

```
UI (TanStack Start routes)
  → server functions in src/lib/server/catalog.ts
    → Postgres catalog (Neon in production, PGLite in preview)
      countries · cities · city_guides · search_events
```

Auth is off. The catalog is world-readable; search events are anonymous (no `user_id`).
Editorial guides seed from `src/data/guides` into `city_guides` on first boot.

## Stack

- TanStack Start + Router
- React 19
- Tailwind CSS v4
- three.js (vanilla WebGL globe, no R3F)
- Postgres via `@/lib/db` (`createServerFn` only)

## Run locally

```bash
npm install
npm run dev
```

The app listens on port 8080.

```bash
npm run build
npm run typecheck
```

## Project layout

```
src/
  routes/           home + /$country/$city
  components/       globe, search, city guide UI
  data/             seed catalog and editorial guides
  lib/globe/        WebGL stippled-earth engine
  lib/server/       catalog server functions
migrations/         Postgres schema (0002_catalog.sql)
public/globe/       land mask (Natural Earth, public domain)
```
