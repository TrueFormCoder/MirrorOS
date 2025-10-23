# MirrorOS Countdown — Realtime v1.1

Adds:
- Seal→ISO resolver (`Seal11.13`, `Seal2.14`) — extend `src/countdown/seal.ts`
- WebSocket broadcast on `/ws` — emits `countdown:update`, `countdown:final`, `countdown:repair`

## Install
```bash
npm i express cors ws
npm i -D @types/express @types/cors @types/ws
```

## Run
Dev:
```bash
npm run dev
```
Compiled:
```bash
npm run build && npm run start:dist
```

## Test WS
Open a second terminal and run:
```bash
npx wscat -c ws://localhost:3000/ws
```
(If you don't have wscat: `npm i -g wscat`)

Then create/start/finalize a countdown via HTTP — you’ll see JSON events appear in the WS terminal.

## Notes
- State machine is in-memory; replace with Redis/Durable Objects for production.
- Extend `SEAL_MAP` with canonical Prophecy Calendar dates/times.
