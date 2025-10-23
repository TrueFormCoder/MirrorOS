# MirrorOS Countdown Starter (Express + TypeScript)

Drop these files into your MirrorOS repo. Provides a minimal countdown/finality API.

## Endpoints
- POST /api/countdown    { "anchor": "2025-11-13T11:13:00Z", "grace_window": "PT3H" }
- GET  /api/countdown/:id
- POST /api/countdown/:id/start
- POST /api/countdown/:id/finalize
- POST /api/countdown/:id/repair   { "next_anchor_iso": "2025-11-14T12:00:00Z" }

## Install & run
npm i express cors
npm i -D @types/express @types/cors
npm run dev          # ts-node path
# or
npm run build && npm run start:dist

Notes: storage is in-memory; Seal->ISO mapping is stubbed.
