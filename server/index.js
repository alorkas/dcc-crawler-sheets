import path from 'node:path';
import fs from 'node:fs';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { openDb, ensureAdmin } from './db.js';
import { createApp } from './app.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dataDir = process.env.DATA_DIR || path.join(root, 'data');
const port = Number(process.env.PORT || 3000);

fs.mkdirSync(dataDir, { recursive: true });

// Use JWT_SECRET if provided, otherwise generate one and persist it in the data volume
let jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  const secretFile = path.join(dataDir, '.jwt-secret');
  if (!fs.existsSync(secretFile)) fs.writeFileSync(secretFile, crypto.randomBytes(48).toString('hex'), { mode: 0o600 });
  jwtSecret = fs.readFileSync(secretFile, 'utf8').trim();
}

const db = openDb(path.join(dataDir, 'crawlers.db'));
ensureAdmin(db, process.env.ADMIN_USERNAME, process.env.ADMIN_PASSWORD);

const app = createApp({
  db,
  jwtSecret,
  allowRegistration: process.env.ALLOW_REGISTRATION !== 'false',
  cookieSecure: process.env.COOKIE_SECURE === 'true',
  staticDir: path.join(root, 'dist'),
});

app.listen(port, '0.0.0.0', () => console.log(`Crawler sheets listening on :${port}`));
