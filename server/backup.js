// Nightly backups of the SQLite database (VACUUM INTO: a consistent copy even while the app is running).
import fs from 'node:fs';
import path from 'node:path';

const PREFIX = 'crawlers-';

/** Write one backup now; keeps the newest `keep` files. Returns the new file's name. */
export function backupNow(db, dir, keep = 14) {
  fs.mkdirSync(dir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:T]/g, '-').slice(0, 19);
  const file = path.join(dir, `${PREFIX}${stamp}.db`);
  db.exec(`VACUUM INTO '${file.replace(/'/g, "''")}'`);
  const old = listBackups(dir).slice(keep);
  for (const b of old) fs.rmSync(path.join(dir, b.name), { force: true });
  return path.basename(file);
}

/** Newest first. */
export function listBackups(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.startsWith(PREFIX) && f.endsWith('.db'))
    .map((name) => ({ name, size: fs.statSync(path.join(dir, name)).size }))
    .sort((a, b) => b.name.localeCompare(a.name));
}

/** Back up every day at `hour` (server local time); also once at startup when the newest backup is over a day old. */
export function scheduleBackups(db, dir, { hour = 3, keep = 14, log = console.log } = {}) {
  const run = () => {
    try {
      log(`Backup written: ${backupNow(db, dir, keep)}`);
    } catch (e) {
      log(`Backup failed: ${e.message}`);
    }
  };
  const newest = listBackups(dir)[0];
  const age = newest ? Date.now() - fs.statSync(path.join(dir, newest.name)).mtimeMs : Infinity;
  if (age > 24 * 3600 * 1000) run();
  const next = new Date();
  next.setHours(hour, 0, 0, 0);
  if (next <= new Date()) next.setDate(next.getDate() + 1);
  const t = setTimeout(() => {
    run();
    setInterval(run, 24 * 3600 * 1000).unref();
  }, next - Date.now());
  t.unref();
}
