// Learning spells and skills: from a spellbook (an item "Libro de Hechizos: <spell>") or as an achievement/quest
// reward. A new one goes on the sheet at Level 1, filled from the catalog; one the crawler already has goes up a
// Level (the book's rule for reading a spell you already know), up to 15.
import { lookup, norm } from './catalog/index.js';
import { MAX_SKILL_RANK } from './progress.js';
import { spellBookSpell, spendOne } from '../shared/items.js';

const CATEGORY = { weapon: 'combat', spell: 'spell', utility: 'utility' };
const int = (v) => {
  const n = parseInt(String(v ?? ''), 10);
  return Number.isFinite(n) ? n : 0;
};

/** A sheet skill row for a catalog entry (Level 1). */
function rowFor(kind, e) {
  const stat = kind === 'weapon' && (e.subtype === 'damageEffect' || e.subtype === 'passive') ? 'none' : e.stat || '';
  return {
    name: e.name,
    category: CATEGORY[kind] || 'combat',
    subtype: e.subtype || '',
    rank: '1',
    stat,
    statMod: '',
    checkType: '',
    notes: [e.upgrades, e.page ? `Core Rulebook p. ${e.page}` : ''].filter(Boolean).join('\n'),
    done: false,
    pinned: false,
    custom: false,
    attackType: e.attackType || '',
    manaCost: e.manaCost || '',
    range: e.range || '',
    duration: e.duration || '',
    aiFavor: e.aiFavor || '',
    limitations: e.limitations || '',
    cooldown: e.cooldown || '',
    description: e.tags || '',
    effect: e.effect || '',
    baseDamage: e.baseDamage || '',
    overcharge: !!e.overcharge,
  };
}

/**
 * Teach a spell or skill. `only`: 'spell' to refuse anything else (spellbooks). Unknown names are added as a
 * custom combat skill (rewards the GM typed by hand), except for spellbooks (null).
 * Returns { data, name, rank, raised, max } or null.
 */
export function learn(data, rawName, { only = '' } = {}) {
  const name = String(rawName ?? '')
    .trim()
    .slice(0, 80);
  if (!name) return null;
  const hit = lookup(name, 'skill');
  if (only && hit?.kind !== only) return null;
  const e = hit?.entry;
  const names = new Set([name, e?.name, e?.nameEs, ...(e?.aliases ?? [])].filter(Boolean).map(norm));
  const skills = Array.isArray(data.skills) ? data.skills : [];
  const i = skills.findIndex((s) => s && names.has(norm(s.name)));
  if (i >= 0) {
    const from = int(skills[i].rank);
    const rank = Math.min(MAX_SKILL_RANK, Math.max(1, from + 1));
    const next = skills.map((s, j) => (j === i ? { ...s, rank: String(rank) } : s));
    return { data: { ...data, skills: next }, name: skills[i].name, rank, raised: true, max: from >= MAX_SKILL_RANK };
  }
  const row = hit
    ? rowFor(hit.kind, e)
    : { ...rowFor('weapon', { name, subtype: '' }), custom: true, category: 'combat', stat: '' };
  // fill the blank template row if the sheet only has that one
  const blank = skills.findIndex((s) => s && !String(s.name ?? '').trim());
  const next = blank >= 0 ? skills.map((s, j) => (j === blank ? row : s)) : [...skills, row];
  return { data: { ...data, skills: next }, name: row.name, rank: 1, raised: false, max: false };
}

/** Teach several skills/spells (a reward): returns the new sheet and what was learned. */
export function learnAll(data, list) {
  let d = data;
  const learned = [];
  for (const n of Array.isArray(list) ? list : []) {
    const r = learn(d, n);
    if (!r || r.max) continue;
    d = r.data;
    learned.push({ name: r.name, rank: r.rank, raised: r.raised });
  }
  return { data: d, learned };
}

/** Reading a spellbook from the inventory: the spell is learned (or goes up a Level) and the book is used up. */
export function mountLearning(app, { db, auth, loadChar, live }) {
  const save = db.prepare(
    `UPDATE characters SET data = ?, version = version + 1, updated_at = datetime('now') WHERE id = ?`,
  );
  app.post('/api/characters/:id/read-book', auth, loadChar, (req, res) => {
    const row = req.char;
    const data = JSON.parse(row.data || '{}');
    const inv = Array.isArray(data.inventory) ? data.inventory : [];
    const it = inv.find((x) => x && x.id === String(req.body?.itemId));
    const spell = it && spellBookSpell(it.item);
    if (!spell) return res.status(404).json({ error: 'Not a spellbook', code: 'not_a_spellbook' });
    const r = learn(data, spell, { only: 'spell' });
    if (!r) return res.status(409).json({ error: 'Unknown spell', code: 'unknown_spell' });
    if (r.max) return res.status(409).json({ error: 'Already at the top Level', code: 'already_max' });
    const spent = spendOne(r.data.inventory || [], r.data.hotSlots || [], it.id);
    if (!spent) return res.status(409).json({ error: 'None left', code: 'none_left' });
    const next = { ...r.data, inventory: spent.inventory, hotSlots: spent.hotSlots };
    save.run(JSON.stringify(next), row.id);
    live.characterChanged(row, data, next, { version: row.version + 1, actorId: req.user.id });
    live.postEvent({
      ownerId: row.owner_id,
      characterId: row.id,
      charName: String(data.name || '').slice(0, 80),
      event: { type: 'learned', name: r.name, rank: r.rank, raised: r.raised, source: 'book' },
      gmOnly: !row.party_since,
    });
    res.json({ name: r.name, rank: r.rank, raised: r.raised });
  });
}
