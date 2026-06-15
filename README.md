# 🚢 OffsetCalc

**Naval-architecture hydrostatics in the browser — hull offset tables, Simpson's Rule integration, and a WebGL 3D hull viewer.**

Live app: **[offsetcalc.sujikumar.com](https://offsetcalc.sujikumar.com)**

---

## The problem

Early-stage hull hydrostatics usually means a spreadsheet of offsets and manual Simpson's Rule arithmetic, with no way to see the hull you're calculating. OffsetCalc keeps the offset table, the integration, and a live 3D view in one place so the numbers and the shape stay in sync.

## What it does

- **Hull offset tables** — enter or edit offsets by station and waterline.
- **Simpson's Rule integration** — computes areas, volumes, and hydrostatic properties from the offset table.
- **WebGL 3D hull viewer** — renders the hull from the offset data so you can rotate and inspect the form as you edit it.

## Tech stack

- **Three.js** / **WebGL** for the 3D hull rendering
- JavaScript, HTML5 Canvas
- Client-side only — no backend required

## Running locally

```bash
git clone https://github.com/sujirex/OffsetCalc.git
cd OffsetCalc
# If static:
npx serve .
# If a build step is used, document it here (npm install && npm run dev)
```

## About

Built by **Suji Kumar C** — Digital Maritime Engineer with hands-on shipyard experience in hull production and ship electrical systems.
Portfolio: [sujikumar.com](https://sujikumar.com) · LinkedIn: [in/sujirex](https://www.linkedin.com/in/sujirex)
