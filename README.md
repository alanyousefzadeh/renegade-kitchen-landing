# Renegade Kitchen — Bonefied Broth (React + Node)

A modern, responsive landing page for **Renegade Kitchen** with the **Bonefied Broth** logo & palette.

## Stack
- React + Vite + Tailwind CSS (client)
- Node.js + Express (server)

## Quick Start

**1) Install (client + server)**  
```bash
cd server && npm install
cd ../client && npm install
```

**2) Dev mode (two terminals)**  
Terminal A:
```bash
cd server
cp .env.example .env
npm run dev
```
Terminal B:
```bash
cd client
npm run dev
```
Visit: http://localhost:5173

**3) Production build & serve via Node**  
```bash
cd client && npm run build
cd ../server && npm start
```
Visit: http://localhost:5000

## Customize
- Place your own logo file as `client/public/logo.jpg` (one is included from your upload).
- Colors are defined in `client/tailwind.config.js` (`cream`, `gold`, `honey`, `ink`, `charcoal`).
- Update links and content in `client/src/App.jsx`.
- API endpoints for newsletter and contact live in `server/index.js`. They store submissions in `server/data/*.json` (no DB required).

## Notes
- Vite dev server proxies `/api/*` to the Node server on port 5000.
- This project intentionally keeps the backend minimal; add email, DB, or auth as needed.
