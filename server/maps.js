// Maps with fog of war: the GM uploads a map per Floor or area, reveals grid cells, places points of interest and the
// party token. Players only ever receive what's revealed: the GM's browser renders a fogged copy of the image
// (unrevealed cells blacked out) and that copy is all players can download; hidden POIs never leave the server.
import crypto from 'node:crypto';

const clip = (v, n = 80) => String(v ?? '').slice(0, n);
const int = (v, d = 0) => {
  const n = parseInt(String(v ?? ''), 10);
  return Number.isFinite(n) ? n : d;
};
const frac = (v) => Math.min(1, Math.max(0, Number(v) || 0));
const IMAGE_RE = /^data:(image\/(?:png|jpeg|webp|gif));base64,([A-Za-z0-9+/=]+)$/;
export const POI_KINDS = ['poi', 'stairs', 'saferoom', 'boss', 'danger', 'loot', 'npc', 'note'];

const tagOf = (img) => (img ? crypto.createHash('sha1').update(img).digest('hex').slice(0, 12) : '');

export function mountMaps(app, { db, auth, adminOnly, live }) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS maps (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      data TEXT NOT NULL DEFAULT '{}',
      image TEXT NOT NULL DEFAULT '',
      player_image TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
  const q = {
    all: db.prepare('SELECT id, data, image, player_image, updated_at FROM maps ORDER BY id'),
    one: db.prepare('SELECT * FROM maps WHERE id = ?'),
    ins: db.prepare('INSERT INTO maps (data, image) VALUES (?, ?)'),
    upd: db.prepare(`UPDATE maps SET data = ?, updated_at = datetime('now') WHERE id = ?`),
    img: db.prepare(`UPDATE maps SET image = ?, player_image = '', updated_at = datetime('now') WHERE id = ?`),
    pimg: db.prepare(`UPDATE maps SET player_image = ?, updated_at = datetime('now') WHERE id = ?`),
    del: db.prepare('DELETE FROM maps WHERE id = ?'),
  };

  const cleanPoi = (p) => ({
    id: clip(p?.id, 30) || `p${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
    x: frac(p?.x),
    y: frac(p?.y),
    name: clip(p?.name, 80),
    note: clip(p?.note, 1000),
    kind: POI_KINDS.includes(p?.kind) ? p.kind : 'poi',
    hidden: !!p?.hidden,
  });
  const cleanData = (d, prev = {}) => {
    const cols = Math.min(80, Math.max(1, int(d.cols ?? prev.cols, 12)));
    const rows = Math.min(80, Math.max(1, int(d.rows ?? prev.rows, 8)));
    const revealed = Array.isArray(d.revealed ?? prev.revealed)
      ? [...new Set((d.revealed ?? prev.revealed).map(String))]
          .filter((k) => {
            const [c, r] = k.split(',').map(Number);
            return Number.isInteger(c) && Number.isInteger(r) && c >= 0 && r >= 0 && c < cols && r < rows;
          })
          .slice(0, 6400)
      : [];
    const party = d.party === null ? null : d.party ? { x: frac(d.party.x), y: frac(d.party.y) } : (prev.party ?? null);
    return {
      name: clip(d.name ?? prev.name, 80).trim() || 'Map',
      floor: Math.max(1, int(d.floor ?? prev.floor, 1)),
      cols,
      rows,
      revealed,
      pois: (Array.isArray(d.pois) ? d.pois : (prev.pois ?? [])).slice(0, 200).map(cleanPoi),
      party,
      shared: d.shared !== undefined ? !!d.shared : !!prev.shared,
      showGrid: d.showGrid !== undefined ? !!d.showGrid : prev.showGrid !== false,
    };
  };
  /** What a viewer gets: players see revealed POIs only, and no cell list beyond what the fogged image shows. */
  const view = (row, admin) => {
    const d = JSON.parse(row.data || '{}');
    const base = {
      id: row.id,
      name: d.name,
      floor: d.floor,
      cols: d.cols,
      rows: d.rows,
      party: d.party ?? null,
      shared: !!d.shared,
      showGrid: d.showGrid !== false,
      updatedAt: row.updated_at,
      imageTag: tagOf(admin ? row.image : row.player_image),
      hasImage: admin ? !!row.image : !!row.player_image,
    };
    if (admin) return { ...base, revealed: d.revealed ?? [], pois: d.pois ?? [], playerTag: tagOf(row.player_image) };
    return {
      ...base,
      revealed: d.revealed ?? [],
      pois: (d.pois ?? []).filter((p) => !p.hidden).map(({ hidden, ...p }) => p), // eslint-disable-line no-unused-vars
    };
  };
  const visible = (row, admin) => admin || JSON.parse(row.data || '{}').shared;
  const changed = (id) => live.send('maps', { id });

  app.get('/api/maps', auth, (req, res) => {
    const admin = !!req.user.is_admin;
    res.json(
      q.all
        .all()
        .filter((r) => visible(r, admin))
        .map((r) => view(r, admin)),
    );
  });

  const load = (req, res, next) => {
    const row = q.one.get(Number(req.params.id));
    if (!row || !visible(row, !!req.user.is_admin))
      return res.status(404).json({ error: 'Not found', code: 'not_found' });
    req.map = row;
    next();
  };

  app.get('/api/maps/:id', auth, load, (req, res) => res.json(view(req.map, !!req.user.is_admin)));

  // the image: the GM gets the original (or ?as=player for the fogged copy), players only the fogged copy
  app.get('/api/maps/:id/image', auth, load, (req, res) => {
    const admin = !!req.user.is_admin && req.query.as !== 'player';
    const src = admin ? req.map.image : req.map.player_image;
    const m = src && src.match(IMAGE_RE);
    if (!m) return res.status(404).json({ error: 'No image', code: 'not_found' });
    const tag = `"${tagOf(src)}"`;
    if (req.headers['if-none-match'] === tag) return res.status(304).end();
    res.set({ 'Content-Type': m[1], 'Cache-Control': 'private, no-cache', ETag: tag });
    res.send(Buffer.from(m[2], 'base64'));
  });

  app.post('/api/maps', auth, adminOnly, (req, res) => {
    const image = String(req.body?.image ?? '');
    if (image && !IMAGE_RE.test(image)) return res.status(400).json({ error: 'Bad image', code: 'bad_image' });
    const data = cleanData(req.body || {});
    const r = q.ins.run(JSON.stringify(data), image);
    changed(Number(r.lastInsertRowid));
    res.status(201).json(view(q.one.get(r.lastInsertRowid), true));
  });

  // GM edits: settings, revealed cells, POIs, the party token; `image` replaces the map, `playerImage` is the
  // fogged copy rendered by the GM's browser after a reveal
  app.patch('/api/maps/:id', auth, adminOnly, load, (req, res) => {
    const b = req.body || {};
    if (b.image !== undefined) {
      if (!IMAGE_RE.test(String(b.image))) return res.status(400).json({ error: 'Bad image', code: 'bad_image' });
      q.img.run(String(b.image), req.map.id);
    }
    if (b.playerImage !== undefined) {
      if (b.playerImage && !IMAGE_RE.test(String(b.playerImage)))
        return res.status(400).json({ error: 'Bad image', code: 'bad_image' });
      q.pimg.run(String(b.playerImage || ''), req.map.id);
    }
    const prev = JSON.parse(req.map.data || '{}');
    const next = cleanData(b, prev);
    q.upd.run(JSON.stringify(next), req.map.id);
    changed(req.map.id);
    res.json(view(q.one.get(req.map.id), true));
  });

  app.delete('/api/maps/:id', auth, adminOnly, load, (req, res) => {
    q.del.run(req.map.id);
    changed(req.map.id);
    res.json({ ok: true });
  });
}
