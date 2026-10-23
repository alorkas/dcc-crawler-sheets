// Loot boxes a crawler holds (the sheet's "Boxes" tab). Boxes arrive sealed from achievements (when the reward is
// claimed), completed quests, sponsors or straight from the GM, and they can only be opened in a Saferoom. Opening
// one puts its items in the inventory and its gold in the wallet.
import { addItems, ensureIds, goldOf, splitGold } from '../shared/items.js';
import { BOX_KINDS, BOX_TIERS, cleanItem, fromBook, hideBoxCurses } from './rewards.js';
import { inSaferoom } from './world.js';

export const BOX_SOURCES = ['achievement', 'quest', 'gm', 'sponsor'];
const clip = (v, n = 200) => String(v ?? '').slice(0, n);
const pick = (v, list, d) => (list.includes(v) ? v : d);
const int = (v) => Math.max(0, Math.min(10_000_000, Math.floor(Number(String(v ?? '').replace(/[^\d]/g, '')) || 0)));
/** Items in a random group ("oneOf"): one of each group is kept, at random; the rest come as they are. */
export function pickOneOf(items, rng = Math.random) {
  const groups = new Map();
  for (const it of items) if (it.oneOf) groups.set(it.oneOf, [...(groups.get(it.oneOf) ?? []), it]);
  const chosen = new Set([...groups.values()].map((g) => g[Math.floor(rng() * g.length)]));
  return items.filter((it) => !it.oneOf || chosen.has(it)).map(({ oneOf, ...it }) => it); // eslint-disable-line no-unused-vars
}
export const boxInfo = (b) => ({ tier: b.tier, kind: b.kind, label: b.label || '' });

/** A box as stored (validated); gold written as an item ("Oro") counts as the box's gold. */
export function cleanBox(raw) {
  const b = raw && typeof raw === 'object' ? raw : {};
  const all = (Array.isArray(b.items) ? b.items : [])
    .slice(0, 40)
    .map(cleanItem)
    .filter((it) => it.item);
  const { gold, items } = splitGold(all);
  return {
    tier: pick(b.tier, BOX_TIERS, 'bronze'),
    kind: pick(b.kind, BOX_KINDS, 'adventurer'),
    label: clip(b.label, 60).trim(),
    items,
    gold: int(b.gold) + gold,
  };
}

/**
 * The boxes store, shared by achievements and quests (they hand boxes over) and the Boxes tab endpoints.
 * Call before mounting rewards and quests.
 */
export function mountBoxes(app, { db, auth, adminOnly, loadChar, live }) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS crawler_boxes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      character_id INTEGER NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
      box TEXT NOT NULL,
      source TEXT NOT NULL DEFAULT 'gm',
      title TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
      opened_at TEXT,
      opened TEXT
    );
    CREATE INDEX IF NOT EXISTS idx_crawler_boxes_character ON crawler_boxes(character_id);
  `);
  const q = {
    ins: db.prepare('INSERT INTO crawler_boxes (character_id, box, source, title) VALUES (?, ?, ?, ?)'),
    one: db.prepare('SELECT * FROM crawler_boxes WHERE id = ?'),
    of: db.prepare('SELECT * FROM crawler_boxes WHERE character_id = ? ORDER BY opened_at IS NOT NULL, id DESC'),
    open: db.prepare(
      `UPDATE crawler_boxes SET opened_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), opened = ? WHERE id = ? AND opened_at IS NULL`,
    ),
    del: db.prepare('DELETE FROM crawler_boxes WHERE id = ? AND opened_at IS NULL'),
    char: db.prepare('SELECT * FROM characters WHERE id = ?'),
    save: db.prepare(
      `UPDATE characters SET data = ?, version = version + 1, updated_at = datetime('now') WHERE id = ?`,
    ),
  };
  // gold used to be an inventory item ("Oro"): move it to the wallet, once (later "Oro" items a player writes
  // stay items, so nobody mints gold by typing it in)
  const migrated = db.prepare(`SELECT value FROM kv WHERE key = 'goldWallet'`).get();
  for (const row of migrated ? [] : db.prepare('SELECT * FROM characters').all()) {
    const data = JSON.parse(row.data || '{}');
    if (!Array.isArray(data.inventory)) continue;
    const split = splitGold(data.inventory);
    if (split.items.length === data.inventory.length) continue;
    const next = { ...data, inventory: split.items, gold: String(goldOf(data) + split.gold) };
    if (Array.isArray(data.hotSlots)) {
      const kept = new Set(split.items.map((it) => it.id));
      next.hotSlots = data.hotSlots.map((id) => (id && !kept.has(id) && !String(id).includes(':') ? '' : id));
    }
    q.save.run(JSON.stringify(next), row.id);
  }
  if (!migrated) db.prepare(`INSERT INTO kv (key, value) VALUES ('goldWallet', '1')`).run();
  const notify = (row) => live.send('boxes', { characterIds: [row.id] }, (u) => u.is_admin || u.id === row.owner_id);
  const post = (row, event) =>
    live.postEvent({
      ownerId: row.owner_id,
      characterId: row.id,
      charName: clip(JSON.parse(row.data || '{}').name, 80),
      event,
      gmOnly: !row.party_since,
    });

  /**
   * Hand sealed boxes to a crawler. `source`: achievement | quest | gm | sponsor; `title`: the achievement or
   * quest, or the sponsor's name. `announce` logs it (achievements and quests log their own entry).
   */
  function give(row, boxes, { source = 'gm', title = '', announce = false } = {}) {
    const list = (Array.isArray(boxes) ? boxes : []).slice(0, 10).map(cleanBox);
    if (!row || !list.length) return 0;
    for (const b of list) q.ins.run(row.id, JSON.stringify(b), pick(source, BOX_SOURCES, 'gm'), clip(title, 120));
    if (announce) post(row, { type: 'boxes', source, title: clip(title, 120), boxes: list.map(boxInfo) });
    notify(row);
    return list.length;
  }

  const toBox = (r, admin) => {
    const b = JSON.parse(r.box || '{}');
    const opened = r.opened ? JSON.parse(r.opened) : null;
    return {
      id: r.id,
      ...boxInfo(b),
      source: r.source,
      title: r.title,
      receivedAt: r.created_at,
      openedAt: r.opened_at,
      // what's inside stays secret until it's opened (the GM sees it)
      items: opened ? (admin ? opened : hideBoxCurses({ boxes: [opened] }).boxes[0]).items : admin ? b.items : [],
      gold: opened ? opened.gold : admin ? b.gold : 0,
    };
  };

  app.get('/api/characters/:id/boxes', auth, loadChar, (req, res) => {
    res.json({
      inSaferoom: inSaferoom(db, req.char),
      boxes: q.of.all(req.char.id).map((r) => toBox(r, !!req.user.is_admin)),
    });
  });

  // the GM sends boxes (their own, or from a sponsor)
  app.post('/api/characters/:id/boxes', auth, adminOnly, loadChar, (req, res) => {
    const source = req.body?.source === 'sponsor' ? 'sponsor' : 'gm';
    const n = give(req.char, req.body?.boxes, { source, title: req.body?.title, announce: true });
    if (!n) return res.status(400).json({ error: 'No boxes', code: 'bad_request' });
    res.status(201).json({ ok: true, count: n });
  });

  const loadBox = (req, res, next) => {
    const r = q.one.get(Number(req.params.id));
    const row = r && q.char.get(r.character_id);
    if (!r || !row || (row.owner_id !== req.user.id && !req.user.is_admin))
      return res.status(404).json({ error: 'Not found', code: 'not_found' });
    req.box = r;
    req.row = row;
    next();
  };

  // open a box: only in a Saferoom (the GM can always)
  app.post('/api/boxes/:id/open', auth, loadBox, (req, res) => {
    const r = req.box;
    const row = req.row;
    if (r.opened_at) return res.status(409).json({ error: 'Already opened', code: 'already_claimed' });
    if (!req.user.is_admin && !inSaferoom(db, row))
      return res.status(423).json({ error: 'Loot boxes can only be opened in a Saferoom', code: 'not_in_saferoom' });
    const b = JSON.parse(r.box || '{}');
    const split = splitGold(pickOneOf(b.items || []).map(fromBook));
    const opened = { ...boxInfo(b), items: split.items, gold: (b.gold || 0) + split.gold };
    if (q.open.run(JSON.stringify(opened), r.id).changes !== 1)
      return res.status(409).json({ error: 'Already opened', code: 'already_claimed' });
    const before = JSON.parse(row.data || '{}');
    let data = before;
    const items = opened.items.map(({ special, ...it }) => it); // eslint-disable-line no-unused-vars
    if (items.length) data = { ...data, inventory: addItems(ensureIds(data.inventory || []), items) };
    if (opened.gold) data = { ...data, gold: String(goldOf(data) + opened.gold) };
    if (data !== before) {
      q.save.run(JSON.stringify(data), row.id);
      live.characterChanged(row, before, data, { version: row.version + 1, actorId: req.user.id, goldSource: 'box' });
    }
    post(row, {
      type: 'box',
      box: boxInfo(b),
      source: r.source,
      title: r.title,
      items: opened.items.map((it) => ({ item: it.item, rarity: it.rarity, qty: it.qty })),
      gold: opened.gold,
    });
    notify(row);
    const out = req.user.is_admin ? opened : hideBoxCurses({ boxes: [opened] }).boxes[0];
    res.json({ opened: out });
  });

  // the GM marks a crawler outside the party as in a Saferoom (party members follow World Stats)
  app.patch('/api/characters/:id/saferoom', auth, adminOnly, loadChar, (req, res) => {
    const on = !!req.body?.saferoom;
    db.prepare('UPDATE characters SET saferoom = ? WHERE id = ?').run(on ? 1 : 0, req.char.id);
    notify(req.char);
    res.json({ id: req.char.id, saferoom: on, inSaferoom: inSaferoom(db, { ...req.char, saferoom: on ? 1 : 0 }) });
  });

  // the GM takes back a sealed box (sent by mistake)
  app.delete('/api/boxes/:id', auth, adminOnly, loadBox, (req, res) => {
    if (!q.del.run(req.box.id).changes)
      return res.status(409).json({ error: 'Already opened', code: 'already_claimed' });
    notify(req.row);
    res.json({ ok: true });
  });

  return { give };
}
