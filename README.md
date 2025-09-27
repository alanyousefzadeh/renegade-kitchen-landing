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

## Admin panel (Firebase-only)

You can enable an admin panel at `/admin` to edit text and gallery images without redeploys, using Firebase only (no Node server).

1) Install client deps
```bash
cd client && npm install
```

2) Create `client/.env` with your Firebase web app keys
```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

3) Start dev
```bash
cd client && npm run dev -- --host --port 5173
```
Open: http://localhost:5173

4) Deploy security rules
Update `firebase.rules` to allow only your email to write, then deploy:
```bash
firebase deploy --only firestore:rules,storage:rules
```

5) Use the admin page
- Visit `/admin`, sign in with Google
- Edit Hero/Story text
- Upload/remove gallery images (stored in Firebase Storage)

Firestore document used: `content/site`
```json
{
  "heroTitle": "...",
  "heroSubtitle": "...",
  "storyTitle": "...",
  "storyBody": "...",
  "gallery": [
    { "url": "https://...", "storagePath": "images/..." }
  ]
}
```

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
