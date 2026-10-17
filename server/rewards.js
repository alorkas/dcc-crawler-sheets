// Achievements and rewards: the GM creates an achievement, gives it to one or more crawlers (kept in their history
// with the date), and each of them can claim its reward once. Loot box contents stay on the server until claimed;
// claiming opens the boxes and adds the items to the crawler's inventory (stacking where they are the same thing).
import { lookup } from './catalog/index.js';
import { HOMEBREW_ITEMS } from './catalog/homebrew.js';

const HOMEBREW = new Map(HOMEBREW_ITEMS.map((h) => [h.name.toLowerCase(), h]));
import { addItems, BONUS_KEYS, emptyItem, ensureIds, ITEM_TYPES, RARITIES } from '../shared/items.js';

/** Loot box tiers (Core Rulebook "Loot Boxes") and the usual kinds of box. */
export const BOX_TIERS = ['bronze', 'silver', 'gold', 'platinum', 'legendary', 'celestial'];
export const BOX_KINDS = ['adventurer', 'boss', 'crafter', 'assassin', 'fan', 'benefactor', 'achievement', 'custom'];

const clip = (v, n = 200) => String(v ?? '').slice(0, n);
const pick = (v, list, d = '') => (list.includes(v) ? v : d);

function cleanItem(raw) {
  const it = raw && typeof raw === 'object' ? raw : {};
  const base = emptyItem();
  const bonus = it.bonus && typeof it.bonus === 'object' ? it.bonus : {};
  return {
    item: clip(it.item, 120).trim(),
    qty: clip(it.qty, 8),
    notes: clip(it.notes, 2000),
    type: pick(it.type, ITEM_TYPES),
    rarity: pick(it.rarity, RARITIES),
    unique: !!it.unique,
    special: !!it.special,
    skill: clip(it.skill, 80),
    upgrades: clip(it.upgrades, 500),
    bonus: Object.fromEntries(BONUS_KEYS.map((k) => [k, clip(bonus[k], 8)])),
    slot: base.slot,
    hot: false,
  };
}

export function cleanReward(raw) {
  const r = raw && typeof raw === 'object' ? raw : {};
  const boxes = (Array.isArray(r.boxes) ? r.boxes : []).slice(0, 10).map((b) => ({
    tier: pick(b?.tier, BOX_TIERS, 'bronze'),
    kind: pick(b?.kind, BOX_KINDS, 'adventurer'),
    label: clip(b?.label, 60).trim(),
    items: (Array.isArray(b?.items) ? b.items : [])
      .slice(0, 40)
      .map(cleanItem)
      .filter((it) => it.item),
  }));
  return { boxes, note: clip(r.note, 1000).trim() };
}

const hasReward = (r) => !!(r && (r.boxes?.length || r.note));

/** Fill an item's description and type from the book catalog when the GM left them empty. */
function fromBook(it) {
  const brew = HOMEBREW.get(it.item.trim().toLowerCase());
  if (brew) {
    const out = { ...it };
    if (!out.notes.trim()) out.notes = brew.notes;
    if (!out.type) out.type = brew.type;
    if (!out.rarity) out.rarity = brew.rarity;
    if (BONUS_KEYS.every((k) => !String(out.bonus?.[k] ?? '').trim())) out.bonus = { ...brew.bonus };
    return out;
  }
  const hit = lookup(it.item, 'item');
  if (!hit) return it;
  const e = hit.entry;
  const out = { ...it };
  if (!out.notes.trim())
    out.notes = [e.slot && `[${e.slot}]`, e.effect, e.cooldown && `Cooldown ${e.cooldown}`, e.page && `p. ${e.page}`]
      .filter(Boolean)
      .join(' · ');
  if (!out.type) {
    const ty = String(e.type || '').toLowerCase();
    out.type =
      ty === 'consumable' || ty === 'explosive'
        ? 'consumable'
        : e.slot === 'Accessory'
          ? 'accessory'
          : e.slot
            ? 'armor'
            : 'misc';
  }
  return out;
}

export function mountRewards(app, { db, auth, adminOnly, loadChar, live }) {
  const kvGet = db.prepare(`SELECT value FROM kv WHERE key = 'rewards'`);
  const kvPut = db.prepare(
    `INSERT INTO kv (key, value) VALUES ('rewards', ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
  );
  const settings = () => ({ claimLocked: false, ...JSON.parse(kvGet.get()?.value || '{}') });

  const q = {
    ach: db.prepare('SELECT * FROM achievements WHERE id = ?'),
    allAch: db.prepare('SELECT * FROM achievements ORDER BY created_at DESC, id DESC'),
    insAch: db.prepare('INSERT INTO achievements (data) VALUES (?)'),
    updAch: db.prepare('UPDATE achievements SET data = ? WHERE id = ?'),
    delAch: db.prepare('DELETE FROM achievements WHERE id = ?'),
    award: db.prepare('SELECT * FROM awards WHERE id = ?'),
    awardsOf: db.prepare(
      `SELECT w.*, a.data AS ach FROM awards w JOIN achievements a ON a.id = w.achievement_id
       WHERE w.character_id = ? ORDER BY w.created_at DESC, w.id DESC`,
    ),
    awardsFor: db.prepare(
      `SELECT w.id, w.character_id, w.created_at, w.claimed_at, w.reward, c.data AS cdata FROM awards w
       JOIN characters c ON c.id = w.character_id WHERE w.achievement_id = ? ORDER BY w.id`,
    ),
    insAward: db.prepare('INSERT INTO awards (achievement_id, character_id, reward) VALUES (?, ?, ?)'),
    hasAward: db.prepare('SELECT id FROM awards WHERE achievement_id = ? AND character_id = ?'),
    updUnclaimed: db.prepare('UPDATE awards SET reward = ? WHERE achievement_id = ? AND claimed_at IS NULL'),
    setReward: db.prepare('UPDATE awards SET reward = ? WHERE id = ? AND claimed_at IS NULL'),
    claim: db.prepare(
      `UPDATE awards SET claimed_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), opened = ? WHERE id = ? AND claimed_at IS NULL`,
    ),
    delAward: db.prepare('DELETE FROM awards WHERE id = ?'),
    char: db.prepare('SELECT * FROM characters WHERE id = ?'),
  };

  /** Tell the owners (and the GM) of these crawlers that their achievements changed. */
  const notify = (charIds) => {
    const owners = new Set(charIds.map((id) => q.char.get(id)?.owner_id).filter(Boolean));
    live.send('awards', { characterIds: charIds }, (u) => u.is_admin || owners.has(u.id));
  };

  const giveTo = (achId, data, charIds) => {
    const given = [];
    for (const cid of charIds) {
      const row = q.char.get(cid);
      if (!row || q.hasAward.get(achId, cid)) continue;
      q.insAward.run(achId, cid, JSON.stringify(data.reward));
      given.push(cid);
      live.postEvent({
        ownerId: row.owner_id,
        characterId: row.id,
        charName: clip(JSON.parse(row.data || '{}').name, 80),
        event: { type: 'achievement', title: data.title },
        gmOnly: !row.party_since,
      });
    }
    if (given.length) notify(given);
    return given;
  };

  const ids = (v) => [...new Set((Array.isArray(v) ? v : []).map(Number).filter((n) => Number.isInteger(n) && n > 0))];
  const cleanAch = (body) => ({
    title: clip(body?.title, 120).trim(),
    description: clip(body?.description, 3000),
    reward: cleanReward(body?.reward),
  });
  const toAch = (r) => ({
    id: r.id,
    createdAt: r.created_at,
    ...JSON.parse(r.data || '{}'),
    awards: q.awardsFor.all(r.id).map((w) => ({
      id: w.id,
      characterId: w.character_id,
      name: JSON.parse(w.cdata || '{}').name || '',
      awardedAt: w.created_at,
      claimedAt: w.claimed_at,
      reward: JSON.parse(w.reward || '{}'),
    })),
  });

  /* ---------- settings: the GM can lock reward claiming for everyone ---------- */
  app.get('/api/rewards/settings', auth, (_req, res) => res.json(settings()));
  app.put('/api/rewards/settings', auth, adminOnly, (req, res) => {
    const next = { ...settings(), claimLocked: !!req.body?.claimLocked };
    kvPut.run(JSON.stringify(next));
    live.send('awards', { settings: true });
    res.json(next);
  });

  /* ---------- achievements (GM) ---------- */
  app.get('/api/achievements', auth, adminOnly, (_req, res) => res.json(q.allAch.all().map(toAch)));

  app.post('/api/achievements', auth, adminOnly, (req, res) => {
    const data = cleanAch(req.body);
    if (!data.title) return res.status(400).json({ error: 'A title is required', code: 'title_required' });
    const r = q.insAch.run(JSON.stringify(data));
    giveTo(Number(r.lastInsertRowid), data, ids(req.body?.characterIds));
    res.status(201).json(toAch(q.ach.get(r.lastInsertRowid)));
  });

  const loadAch = (req, res, next) => {
    const row = q.ach.get(Number(req.params.id));
    if (!row) return res.status(404).json({ error: 'Not found', code: 'not_found' });
    req.ach = row;
    next();
  };

  // edit the text and reward; awards not yet claimed get the new reward too
  app.put('/api/achievements/:id', auth, adminOnly, loadAch, (req, res) => {
    const data = cleanAch(req.body);
    if (!data.title) return res.status(400).json({ error: 'A title is required', code: 'title_required' });
    q.updAch.run(JSON.stringify(data), req.ach.id);
    q.updUnclaimed.run(JSON.stringify(data.reward), req.ach.id);
    notify(q.awardsFor.all(req.ach.id).map((w) => w.character_id));
    res.json(toAch(q.ach.get(req.ach.id)));
  });

  app.post('/api/achievements/:id/awards', auth, adminOnly, loadAch, (req, res) => {
    giveTo(req.ach.id, JSON.parse(req.ach.data), ids(req.body?.characterIds));
    res.json(toAch(q.ach.get(req.ach.id)));
  });

  app.delete('/api/achievements/:id', auth, adminOnly, loadAch, (req, res) => {
    const cids = q.awardsFor.all(req.ach.id).map((w) => w.character_id);
    q.delAch.run(req.ach.id);
    notify(cids);
    res.json({ ok: true });
  });

  // take an achievement back from one crawler (items already claimed stay in their inventory)
  app.delete('/api/awards/:id', auth, adminOnly, (req, res) => {
    const w = q.award.get(Number(req.params.id));
    if (!w) return res.status(404).json({ error: 'Not found', code: 'not_found' });
    q.delAward.run(w.id);
    notify([w.character_id]);
    res.json({ ok: true });
  });

  // a different reward for one crawler (before they claim it)
  app.put('/api/awards/:id/reward', auth, adminOnly, (req, res) => {
    const w = q.award.get(Number(req.params.id));
    if (!w) return res.status(404).json({ error: 'Not found', code: 'not_found' });
    if (w.claimed_at) return res.status(409).json({ error: 'Already claimed', code: 'already_claimed' });
    q.setReward.run(JSON.stringify(cleanReward(req.body?.reward)), w.id);
    notify([w.character_id]);
    res.json({ ok: true });
  });

  /* ---------- a crawler's achievements (owner and GM) ---------- */
  app.get('/api/characters/:id/awards', auth, loadChar, (req, res) => {
    const admin = !!req.user.is_admin;
    const awards = q.awardsOf.all(req.char.id).map((w) => {
      const a = JSON.parse(w.ach || '{}');
      const reward = JSON.parse(w.reward || '{}');
      const opened = w.opened ? JSON.parse(w.opened) : null;
      return {
        id: w.id,
        achievementId: w.achievement_id,
        title: a.title || '',
        description: a.description || '',
        awardedAt: w.created_at,
        claimedAt: w.claimed_at,
        hasReward: hasReward(reward),
        // the boxes' contents stay secret until claimed (the GM sees them)
        reward:
          admin || w.claimed_at
            ? reward
            : {
                boxes: (reward.boxes || []).map(({ tier, kind, label }) => ({ tier, kind, label, items: [] })),
                note: '',
              },
        opened,
      };
    });
    res.json({ ...settings(), awards });
  });

  app.post('/api/awards/:id/claim', auth, (req, res) => {
    const w = q.award.get(Number(req.params.id));
    const row = w && q.char.get(w.character_id);
    if (!w || !row || (row.owner_id !== req.user.id && !req.user.is_admin))
      return res.status(404).json({ error: 'Not found', code: 'not_found' });
    if (w.claimed_at) return res.status(409).json({ error: 'Already claimed', code: 'already_claimed' });
    if (settings().claimLocked && !req.user.is_admin)
      return res.status(423).json({ error: 'The GM has locked reward claiming', code: 'claim_locked' });
    const reward = JSON.parse(w.reward || '{}');
    if (!hasReward(reward)) return res.status(400).json({ error: 'Nothing to claim', code: 'no_reward' });

    const opened = {
      boxes: (reward.boxes || []).map((b) => ({ ...b, items: b.items.map(fromBook) })),
      note: reward.note || '',
    };
    if (q.claim.run(JSON.stringify(opened), w.id).changes !== 1)
      return res.status(409).json({ error: 'Already claimed', code: 'already_claimed' });

    const items = opened.boxes.flatMap((b) => b.items).map(({ special, ...it }) => it); // eslint-disable-line no-unused-vars
    const data = JSON.parse(row.data || '{}');
    if (items.length) {
      const inv = ensureIds(Array.isArray(data.inventory) ? data.inventory : []);
      const next = { ...data, inventory: addItems(inv, items) };
      db.prepare(
        `UPDATE characters SET data = ?, version = version + 1, updated_at = datetime('now') WHERE id = ?`,
      ).run(JSON.stringify(next), row.id);
      live.characterChanged(row, data, next, { version: row.version + 1, actorId: req.user.id });
    }
    const ach = JSON.parse(q.ach.get(w.achievement_id)?.data || '{}');
    live.postEvent({
      ownerId: row.owner_id,
      characterId: row.id,
      charName: clip(data.name, 80),
      event: {
        type: 'reward',
        title: ach.title || '',
        boxes: opened.boxes.map(({ tier, kind, label }) => ({ tier, kind, label })),
      },
      gmOnly: !row.party_since,
    });
    notify([row.id]);
    res.json({ id: w.id, opened });
  });
}
