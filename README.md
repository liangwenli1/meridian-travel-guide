# Meridian

A premium English travel-guide site. The homepage is an immersive 3D particle globe. Search a city, fly there, then read a full editorial guide.

**Live guides:** Tokyo · Paris · Bangkok · Singapore  
Other catalog cities open a short coming-soon page.

## Features

- Drag, pinch, and zoom a particle Earth with city and country labels
- Type-ahead search (`tok` → Tokyo, `san` → San Francisco / San Sebastián)
- Keyboard: `/` focuses search, arrows + Enter confirm
- City pages cover neighborhoods, things to do, food, stay, transport, money, eSIM, apps, etiquette, safety, itineraries, and FAQ

## Stack

- TanStack Start + Router
- React 19
- Tailwind CSS v4
- three.js (vanilla WebGL globe, no R3F)

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
  data/             city catalog and editorial guides
  lib/globe/        WebGL particle-earth engine
public/globe/       land mask (derived from NASA Earth Observatory, public domain)
```

Earth texture is derived from NASA Earth Observatory’s public-domain Blue Marble / land-shallow-topo map.

Hero photographs on city pages are from Unsplash; credit is on each guide.
