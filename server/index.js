import express from "express";
import cors from "cors";
import morgan from "morgan";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_DIST = path.join(__dirname, "..", "client", "dist");

// Middleware
app.use(express.json());
app.use(morgan("dev"));
app.use(cors({ origin: true, credentials: true }));

// Utils to persist simple JSON files (no DB needed for demo)
const ensureDir = (p) => {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
};
const DATA_DIR = path.join(__dirname, "data");
ensureDir(DATA_DIR);

const appendJson = (file, payload) => {
  const p = path.join(DATA_DIR, file);
  let arr = [];
  if (fs.existsSync(p)) {
    try {
      arr = JSON.parse(fs.readFileSync(p, "utf8") || "[]");
    } catch {}
  }
  arr.push({ ...payload, createdAt: new Date().toISOString() });
  fs.writeFileSync(p, JSON.stringify(arr, null, 2));
};

// API endpoints (demo-ready)
app.post("/api/subscribe", (req, res) => {
  const { email } = req.body || {};
  if (!email) return res.status(400).json({ ok: false, error: "Missing email" });
  appendJson("subscribers.json", { email });
  res.json({ ok: true });
});

app.post("/api/contact", (req, res) => {
  const { name, email, message } = req.body || {};
  if (!name or !email or !message) {
    return res.status(400).json({ ok: false, error: "Missing fields" });
  }
  appendJson("messages.json", { name, email, message });
  res.json({ ok: true });
});

// Serve static client (after build)
app.use(express.static(CLIENT_DIST));
app.get("*", (req, res) => {
  const indexPath = path.join(CLIENT_DIST, "index.html");
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(200).send("Client not built yet. Run `npm run build` in /client.");
  }
});

app.listen(PORT, () => {
  console.log(`Renegade Kitchen server listening on http://localhost:${PORT}`);
});
