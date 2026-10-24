// Achievements and rewards: the GM creates an achievement, gives it to one or more crawlers (kept in their history
// with the date), and each of them can claim its reward once. Loot box contents stay on the server until claimed;
// claiming opens the boxes and adds the items to the crawler's inventory (stacking where they are the same thing).
import { lookup } from './catalog/index.js';
import { learnAll } from './learn.js';
import { HOMEBREW_ITEMS } from './catalog/homebrew.js';

const HOMEBREW = new Map(HOMEBREW_ITEMS.map((h) => [h.name.toLowerCase(), h]));
import {
  ACCESSORY_FITS,
  addItems,
  goldOf,
  splitGold,
  BONUS_KEYS,
  emptyItem,
  ensureIds,
  EQUIP_FITS,
  ITEM_TYPES,
  itemCard,
  RARITIES,
} from '../shared/items.js';

/** Loot box tiers (Core Rulebook "Loot Boxes") and the usual kinds of box. */
export const BOX_TIERS = ['bronze', 'silver', 'gold', 'platinum', 'legendary', 'celestial'];
export const BOX_KINDS = [
  'adventurer',
  'boss',
  'crafter',
  'assassin',
  'fan',
  'benefactor',
  'achievement',
  'explosives',
  'food',
  'jerk',
  'custom',
];

const clip = (v, n = 200) => String(v ?? '').slice(0, n);
const pick = (v, list, d = '') => (list.includes(v) ? v : d);

export function cleanItem(raw) {
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
    fits: pick(it.fits, [...EQUIP_FITS, ...ACCESSORY_FITS]),
    twoHanded: !!it.twoHanded,
    ranged: !!it.ranged,
    ammo: clip(it.ammo, 40),
    ammoType: clip(it.ammoType, 40),
    charges: clip(it.charges, 4),
    maxCharges: clip(it.maxCharges, 4),
    ability: clip(it.ability, 500),
    bonus: Object.fromEntries(BONUS_KEYS.map((k) => [k, clip(bonus[k], 8)])),
    curse:
      it.curse && typeof it.curse === 'object' && String(it.curse.text || '').trim()
        ? {
            text: clip(it.curse.text, 300),
            bonus: Object.fromEntries(
              BONUS_KEYS.filter((k) => it.curse.bonus?.[k]).map((k) => [k, clip(it.curse.bonus[k], 8)]),
            ),
            revealed: !!it.curse.revealed,
          }
        : null,
    slot: base.slot,
    hot: false,
    // items sharing a group: only one of them comes out of the box, picked when it's opened ("1 al azar (1d4)")
    ...(String(it.oneOf ?? '').trim() ? { oneOf: clip(it.oneOf, 20).trim() } : {}),
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
    gold: Math.max(0, Math.min(10_000_000, Math.floor(Number(b?.gold) || 0))),
  }));
  // spells or skills the reward teaches (names from the catalog, or the GM's own)
  const skills = [
    ...new Set((Array.isArray(r.skills) ? r.skills : []).map((x) => clip(x, 80).trim()).filter(Boolean)),
  ].slice(0, 5);
  const out = { boxes, note: clip(r.note, 1000).trim(), skills };
  const favor = Math.max(0, Math.min(20, Math.floor(Number(r.aiFavor) || 0)));
  if (favor) out.aiFavor = favor;
  return out;
}

/**
 * AI Favor a reward gives: its own field, or (rewards written before it existed, or imported) a "+1 Favor de la IA" /
 * "+2 AI Favor" in the note.
 */
export function rewardFavor(r) {
  const own = Math.floor(Number(r?.aiFavor) || 0);
  if (own > 0) return Math.min(20, own);
  const m = String(r?.note ?? '').match(/\+?\s*(\d{1,2})\s*(?:puntos?\s+de\s+)?(?:AI\s+)?favou?r\b/i);
  return m ? Math.min(20, Number(m[1])) : 0;
}

/** The sheet with `n` more AI Favor (the AI Favor box on the Core tab). */
export function addFavor(data, n) {
  const have = parseInt(String(data?.dr?.aiFavor ?? ''), 10) || 0;
  return { ...data, dr: { ...(data?.dr || {}), aiFavor: String(have + n) } };
}

/** Opened boxes as a player sees them: curses not yet revealed are invisible. */
export const hideBoxCurses = (o) =>
  o && {
    ...o,
    boxes: (o.boxes || []).map((b) => ({
      ...b,
      items: (b.items || []).map((it) => (it?.curse && !it.curse.revealed ? { ...it, curse: null } : it)),
    })),
  };

const hasReward = (r) => !!(r && (r.boxes?.length || r.note || r.skills?.length || r.aiFavor));
const boxInfo = (b) => ({ tier: b.tier, kind: b.kind, label: b.label || '' });

/** Book gear slots → our body parts; a few book accessories are worn somewhere specific. */
const BOOK_PART = {
  Head: 'head',
  Torso: 'chest',
  Arms: 'bracers',
  Legs: 'pants',
  Feet: 'feet',
  'Hands/Holding': 'held',
};
const BOOK_ACCESSORY = [
  [/plume|hat/i, 'head'],
  [/bracelet/i, 'bracers'],
  [/tattoo/i, 'chest'],
  [/cloak|cape/i, 'back'],
  [/ring\b/i, 'finger'],
  [/necklace|amulet|pendant|collar/i, 'neck'],
];
/** Category (and where it's worn) of a book item. */
function bookKind(e) {
  const ty = String(e.type || '').toLowerCase();
  if (ty === 'consumable' || ty === 'explosive') return { type: 'consumable' };
  if (ty === 'map') return { type: 'special' };
  if (e.slot === 'Accessory') {
    const fit = BOOK_ACCESSORY.find(([re]) => re.test(e.name))?.[1];
    return fit ? { type: 'accessory', fits: fit } : { type: 'special' };
  }
  if (e.slot) {
    const fit = /grips|gloves|gauntlet/i.test(e.name) ? 'hands' : BOOK_PART[e.slot] || '';
    return { type: 'equipment', fits: fit };
  }
  return { type: 'other' };
}

/** Fill an item's description and type from the book catalog when the GM left them empty. */
export function fromBook(it) {
  const brew = HOMEBREW.get(it.item.trim().toLowerCase());
  if (brew) {
    const out = { ...it };
    if (!out.notes.trim()) out.notes = brew.notes;
    if (!out.type) out.type = brew.type;
    if (!out.fits && brew.fits) out.fits = brew.fits;
    if (brew.ranged && !out.ranged) Object.assign(out, { ranged: true, ammo: out.ammo || brew.ammo || '' });
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
  if (!out.type) Object.assign(out, bookKind(e));
  return out;
}

export function mountRewards(app, { db, auth, adminOnly, loadChar, live, boxes }) {
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
    // for the GM only: who gets it and when (players see the title, the description and the reward)
    gmNote: clip(body?.gmNote, 1000).trim(),
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
        // the boxes' contents stay secret (they're opened from the Boxes tab); the note and the skills it
        // teaches show once claimed (before that, only how many skills)
        reward: admin
          ? reward
          : {
              boxes: (reward.boxes || []).map(({ tier, kind, label }) => ({ tier, kind, label, items: [] })),
              note: w.claimed_at ? reward.note || '' : '',
              skills: w.claimed_at ? reward.skills || [] : [],
              aiFavor: w.claimed_at ? rewardFavor(reward) : 0,
            },
        skillCount: (reward.skills || []).length,
        opened: admin ? opened : hideBoxCurses(opened),
      };
    });
    res.json({ awards });
  });

  /* ---------- the GM gives items straight to a crawler (e.g. from the loot generator) ---------- */
  app.post('/api/characters/:id/gift', auth, adminOnly, (req, res) => {
    const row = q.char.get(Number(req.params.id));
    if (!row) return res.status(404).json({ error: 'Character not found', code: 'char_not_found' });
    const items = (Array.isArray(req.body?.items) ? req.body.items : [])
      .slice(0, 20)
      .map(cleanItem)
      .filter((it) => it.item)
      .map(({ special, ...it }) => it); // eslint-disable-line no-unused-vars
    if (!items.length) return res.status(400).json({ error: 'Nothing to give', code: 'bad_request' });
    // gold goes to the wallet, not the inventory
    const split = splitGold(items);
    const data = JSON.parse(row.data || '{}');
    const inv = ensureIds(Array.isArray(data.inventory) ? data.inventory : []);
    let next = split.items.length ? { ...data, inventory: addItems(inv, split.items) } : data;
    if (split.gold) next = { ...next, gold: String(goldOf(next) + split.gold) };
    db.prepare(`UPDATE characters SET data = ?, version = version + 1, updated_at = datetime('now') WHERE id = ?`).run(
      JSON.stringify(next),
      row.id,
    );
    live.characterChanged(row, data, next, { version: row.version + 1, actorId: req.user.id, goldSource: 'gift' });
    live.postEvent({
      ownerId: row.owner_id,
      characterId: row.id,
      charName: clip(data.name, 80),
      event: {
        type: 'gift',
        items: items.map((it) => ({ item: it.item, rarity: it.rarity, qty: it.qty, card: itemCard(it) })),
      },
      gmOnly: !row.party_since,
    });
    res.json({ ok: true, count: items.length });
  });

  /* ---------- the GM's stash: generated items kept for later (loot boxes, gifts) ---------- */
  const stashGet = db.prepare(`SELECT value FROM kv WHERE key = 'lootStash'`);
  const stashPut = db.prepare(
    `INSERT INTO kv (key, value) VALUES ('lootStash', ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
  );
  const stash = () => JSON.parse(stashGet.get()?.value || '{"items":[]}');
  app.get('/api/loot-stash', auth, adminOnly, (_req, res) => res.json(stash()));
  app.put('/api/loot-stash', auth, adminOnly, (req, res) => {
    const items = (Array.isArray(req.body?.items) ? req.body.items : [])
      .slice(0, 200)
      .map(cleanItem)
      .filter((it) => it.item);
    stashPut.run(JSON.stringify({ items }));
    res.json({ items });
  });

  // claim an achievement's reward (anywhere): the note shows, the boxes go sealed to the Boxes tab
  app.post('/api/awards/:id/claim', auth, (req, res) => {
    const w = q.award.get(Number(req.params.id));
    const row = w && q.char.get(w.character_id);
    if (!w || !row || (row.owner_id !== req.user.id && !req.user.is_admin))
      return res.status(404).json({ error: 'Not found', code: 'not_found' });
    if (w.claimed_at) return res.status(409).json({ error: 'Already claimed', code: 'already_claimed' });
    const reward = JSON.parse(w.reward || '{}');
    if (!hasReward(reward)) return res.status(400).json({ error: 'Nothing to claim', code: 'no_reward' });
    const favor = rewardFavor(reward);
    const opened = {
      boxes: (reward.boxes || []).map(boxInfo),
      note: reward.note || '',
      skills: reward.skills || [],
      ...(favor ? { aiFavor: favor } : {}),
    };
    if (q.claim.run(JSON.stringify(opened), w.id).changes !== 1)
      return res.status(409).json({ error: 'Already claimed', code: 'already_claimed' });
    const ach = JSON.parse(q.ach.get(w.achievement_id)?.data || '{}');
    boxes.give(row, reward.boxes, { source: 'achievement', title: ach.title || '' });
    // skills and spells it teaches, and its AI Favor, go straight onto the sheet (one save)
    const before = JSON.parse(row.data || '{}');
    const taught = opened.skills.length ? learnAll(before, opened.skills) : { data: before, learned: [] };
    const next = favor ? addFavor(taught.data, favor) : taught.data;
    if (taught.learned.length || favor) {
      db.prepare(
        `UPDATE characters SET data = ?, version = version + 1, updated_at = datetime('now') WHERE id = ?`,
      ).run(JSON.stringify(next), row.id);
      live.characterChanged(row, before, next, { version: row.version + 1, actorId: req.user.id });
    }
    const post = (event) =>
      live.postEvent({
        ownerId: row.owner_id,
        characterId: row.id,
        charName: clip(before.name, 80),
        event,
        gmOnly: !row.party_since,
      });
    for (const l of taught.learned) post({ type: 'learned', ...l, source: 'achievement', title: ach.title || '' });
    if (favor)
      post({
        type: 'favor',
        use: 'gain',
        source: 'achievement',
        title: ach.title || '',
        n: favor,
        from: parseInt(String(before.dr?.aiFavor ?? ''), 10) || 0,
        to: (parseInt(String(before.dr?.aiFavor ?? ''), 10) || 0) + favor,
      });
    live.postEvent({
      ownerId: row.owner_id,
      characterId: row.id,
      charName: clip(JSON.parse(row.data || '{}').name, 80),
      event: { type: 'reward', title: ach.title || '', boxes: opened.boxes },
      gmOnly: !row.party_since,
    });
    notify([row.id]);
    res.json({ id: w.id, opened });
  });

  // for the session importer
  return {
    /** Create an achievement unless one with that title exists: 'added' | 'exists' | 'invalid'. */
    addAchievement(body, { dry = false } = {}) {
      const data = cleanAch(body);
      if (!data.title) return 'invalid';
      const all = q.allAch.all().map((r) => JSON.parse(r.data || '{}').title?.toLowerCase());
      if (all.includes(data.title.toLowerCase())) return 'exists';
      if (!dry) q.insAch.run(JSON.stringify(data));
      return 'added';
    },
    /** Put items in the GM's loot stash, skipping ones already there by name: [{ name, status }]. */
    addToStash(items, { dry = false } = {}) {
      const cur = stash().items;
      const have = new Set(cur.map((it) => it.item.toLowerCase()));
      const report = [];
      const add = [];
      for (const raw of Array.isArray(items) ? items.slice(0, 200) : []) {
        const it = cleanItem(raw);
        if (!it.item) report.push({ name: '', status: 'invalid' });
        else if (have.has(it.item.toLowerCase())) report.push({ name: it.item, status: 'exists' });
        else {
          have.add(it.item.toLowerCase());
          add.push(it);
          report.push({ name: it.item, status: 'added' });
        }
      }
      if (add.length && !dry) stashPut.run(JSON.stringify({ items: [...cur, ...add].slice(0, 200) }));
      return report;
    },
  };
}
