// GM tools: NPC stat blocks, the combat tracker, and level-ups / skill advancement.
import { BOOK_NPCS } from './catalog/npcs.js';
import {
  catcherPerks,
  dodgeOf,
  effectRankDice,
  effectSpec,
  effectsFor,
  effectiveSkills,
  findSkill,
  isRangedAttack,
  multApplies,
  multiplyBaseDice,
  skillRank,
  tauntCount,
  tauntPerks,
  withEffectDice,
} from '../shared/skillRules.js';
import { lookup } from './catalog/index.js';
import { NOTES_ES } from './catalog/npcNotesEs.js';
import { npcNameEs } from './catalog/namesEs.js';
import { parseDice, rollDice } from './dice.js';
import { damageDice, isAreaAttack, resolveNum } from '../shared/formula.js';
import {
  addDebuffTo,
  cleanEffect,
  debuffDisadvantage,
  degreeOf,
  doubleDice,
  dropDebuffs,
  endCombat,
  isSuccess,
  itemEffect,
  newEffectId,
  rollMode,
  tickRound,
  usedUpBy,
  withRollMode,
} from '../shared/combat.js';
import {
  hideCurses,
  hotlistable,
  hotlistSpells,
  isSpellRef,
  isStuck,
  isWorn,
  itemCard,
  newItemId,
  setHotSlot,
  spellRef,
  spendOne,
  HOT_SLOTS,
} from '../shared/items.js';
import { BOSS_LEVELS, addGrindHours, advanceSkills, crawlerKillLevels, levelUp, rollDie } from './progress.js';

const PHASES = 5; // Mob Action Declaration, Crawler Reaction, Mob Attack Resolution, Crawler Action, Clean Up
const OPP_KINDS = ['mob', 'elite', 'boss', 'npc', 'crawler'];
const int = (v, d = 0) => {
  const n = parseInt(String(v ?? '').replace(/[^\d-]/g, ''), 10);
  return Number.isFinite(n) ? n : d;
};
/** "11+F" → 11 + floor. */
const withFloor = (v, floor) => resolveNum(v, floor) ?? 0;
const clip = (v, n = 80) => String(v ?? '').slice(0, n);
/** A book item's effect text (for items whose description was left empty). */
const lookupNotes = (name) => lookup(name, 'item')?.entry?.effect ?? '';
/** The combat-relevant part of a stat block: its attacks and Stat Mods (for "Str" in damage). */
const npcCombat = (n) => ({
  attacks: (Array.isArray(n.attacks) ? n.attacks : [])
    .filter((a) => a && String(a.name ?? '').trim())
    .slice(0, 12)
    .map((a) => ({
      name: clip(a.name),
      toHit: clip(a.toHit, 20),
      damage: clip(a.damage, 80),
      range: clip(a.range, 40),
      effect: clip(a.effect, 300),
    })),
  mods: Object.fromEntries(['str', 'int', 'con', 'dex', 'cha'].map((k) => [k, clip(n.stats?.[k]?.mod, 6)])),
});

export function mountGame(app, { db, auth, adminOnly, loadChar, live, hooks = {} }) {
  /* ---------------- NPC stat blocks (GM only) ---------------- */
  const toNpc = (r) => ({ id: r.id, data: JSON.parse(r.data || '{}'), updatedAt: r.updated_at });

  app.get('/api/npcs', auth, adminOnly, (_req, res) => {
    res.json(db.prepare('SELECT * FROM npcs ORDER BY updated_at DESC').all().map(toNpc));
  });
  app.post('/api/npcs', auth, adminOnly, (req, res) => {
    const data = req.body?.data && typeof req.body.data === 'object' ? req.body.data : {};
    if (data.locked === undefined) data.locked = false; // a new stat block starts unlocked for editing
    const r = db.prepare('INSERT INTO npcs (data) VALUES (?)').run(JSON.stringify(data));
    res.status(201).json(toNpc(db.prepare('SELECT * FROM npcs WHERE id = ?').get(r.lastInsertRowid)));
  });
  // book stat blocks imported before they had Spanish names get theirs (once; your own names are kept)
  for (const r of db.prepare('SELECT id, data FROM npcs').all()) {
    const d = JSON.parse(r.data || '{}');
    const es = d.source && !String(d.nameEs ?? '').trim() ? npcNameEs(d.name) : '';
    if (es) db.prepare('UPDATE npcs SET data = ? WHERE id = ?').run(JSON.stringify({ ...d, nameEs: es }), r.id);
  }

  // add the Core Rulebook's stat blocks (skips ones already imported, so it's safe to run again)
  app.post('/api/npcs/import-book', auth, adminOnly, (_req, res) => {
    const have = new Map(
      db
        .prepare('SELECT id, data FROM npcs')
        .all()
        .map((r) => {
          const d = JSON.parse(r.data || '{}');
          return [`${d.name}|${d.source ?? ''}`, { id: r.id, d }];
        }),
    );
    const insert = db.prepare('INSERT INTO npcs (data) VALUES (?)');
    const update = db.prepare(`UPDATE npcs SET data = ? WHERE id = ?`);
    let added = 0;
    let updated = 0;
    for (const { prevNotes = [], prevDescriptions = [], prevDescriptionsEs = [], ...book } of BOOK_NPCS) {
      const n = {
        ...book,
        nameEs: npcNameEs(book.name),
        notesEs: NOTES_ES[`${book.name}|${book.source ?? ''}`] ?? '',
      };
      const old = have.get(`${n.name}|${n.source}`);
      if (!old) {
        insert.run(JSON.stringify(n));
        added++;
        continue;
      }
      // already imported: refresh how it's sorted (type and Floor), and the notes / System AI description only
      // when you haven't written your own; never the stats you may have edited
      const next = { ...old.d, kind: n.kind, floor: n.floor, chapter: n.chapter };
      if (!old.d.notes || prevNotes.includes(old.d.notes)) next.notes = n.notes;
      // the Spanish name, unless you've written your own
      if (n.nameEs && !String(old.d.nameEs ?? '').trim()) next.nameEs = n.nameEs;
      // the Spanish notes follow the book while the English ones are the book's (not rewritten by you)
      if (n.notesEs && (!old.d.notesEs || next.notes === n.notes)) next.notesEs = n.notesEs;
      if (!old.d.description || prevDescriptions.includes(old.d.description)) next.description = n.description;
      if (!old.d.descriptionEs || prevDescriptionsEs.includes(old.d.descriptionEs))
        next.descriptionEs = n.descriptionEs;
      if (JSON.stringify(next) !== JSON.stringify(old.d)) {
        update.run(JSON.stringify(next), old.id);
        updated++;
      }
    }
    res.json({ added, updated, total: BOOK_NPCS.length });
  });
  const loadNpc = (req, res, next) => {
    const row = db.prepare('SELECT * FROM npcs WHERE id = ?').get(Number(req.params.id));
    if (!row) return res.status(404).json({ error: 'NPC not found', code: 'not_found' });
    req.npc = row;
    next();
  };
  app.get('/api/npcs/:id', auth, adminOnly, loadNpc, (req, res) => res.json(toNpc(req.npc)));
  app.put('/api/npcs/:id', auth, adminOnly, loadNpc, (req, res) => {
    const data = req.body?.data;
    if (!data || typeof data !== 'object') return res.status(400).json({ error: 'Missing data', code: 'missing_data' });
    db.prepare(`UPDATE npcs SET data = ?, updated_at = datetime('now') WHERE id = ?`).run(
      JSON.stringify(data),
      req.npc.id,
    );
    res.json(toNpc(db.prepare('SELECT * FROM npcs WHERE id = ?').get(req.npc.id)));
  });
  app.delete('/api/npcs/:id', auth, adminOnly, loadNpc, (req, res) => {
    db.prepare('DELETE FROM npcs WHERE id = ?').run(req.npc.id);
    res.json({ ok: true });
  });

  /* ---------------- pre-generated crawlers (Par for the Course): anyone can start a sheet from one ---------------- */
  const PREGENS = BOOK_NPCS.filter((n) => /Pre-generated crawlers/.test(n.chapter || '')).map((n, i) => ({
    id: i + 1,
    name: n.name,
    level: n.level,
    floor: n.floor,
    tags: n.tags,
    size: n.size,
    slotValue: n.slotValue,
    move: n.move,
    stats: n.stats,
    attacks: n.attacks,
    keySkills: (String(n.notes || '').match(/Key Skills:\s*([^.]*)\./) || [])[1] || '',
    description: n.description || '',
    descriptionEs: n.descriptionEs || '',
    source: n.source,
  }));
  app.get('/api/pregens', auth, (_req, res) => res.json(PREGENS));

  /* ---------------- combat tracker ---------------- */
  /** In-game hours passed (World Stats): the clock for cooldowns like Powerful Strike. */
  const gameNow = () => {
    const row = db.prepare(`SELECT value FROM kv WHERE key = 'world'`).get();
    return Math.max(0, int(row ? JSON.parse(row.value).gameHours : 0, 0));
  };
  const worldFloor = () => {
    const row = db.prepare(`SELECT value FROM kv WHERE key = 'world'`).get();
    return Math.max(1, int(row ? JSON.parse(row.value).floor : 1, 1));
  };
  const EMPTY = { active: false, round: 0, phase: 1, floor: 1, opponents: [], seq: 0, declarations: [] };
  const getEnc = () => {
    const row = db.prepare(`SELECT value FROM kv WHERE key = 'encounter'`).get();
    return row ? { ...EMPTY, ...JSON.parse(row.value) } : { ...EMPTY };
  };
  const putEnc = (enc) => {
    db.prepare(
      `INSERT INTO kv (key, value) VALUES ('encounter', ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
    ).run(JSON.stringify(enc));
    live.send('encounter', {});
  };
  const pct = (o) => (o.slots > 0 ? Math.round(((o.slots - o.lost) / o.slots) * 100) : 0);
  /** Declarations are the GM's secret during Mob Action Declaration; players see them from Crawler Reaction on. */
  const revealed = (enc) => enc.active && enc.phase >= 2 && enc.round >= 1;
  const declView = (enc, d, admin) => {
    if (admin) return d;
    const o = enc.opponents.find((x) => x.id === d.opponentId);
    return {
      id: d.id,
      round: d.round,
      opponentId: d.opponentId,
      opponentName: o?.hidden ? '???' : d.opponentName,
      attack: { name: d.attack.name, range: d.attack.range },
      dc: d.dc,
      area: !!d.area,
      targets: d.targets,
      damage: d.damage,
      taunt: d.taunt ? { id: d.taunt.id, name: d.taunt.name, won: d.taunt.won, degree: d.taunt.degree ?? null } : null,
      tauntedFrom: d.tauntedFrom,
    };
  };
  /** Attacks of an opponent: from its stat block as it is now (so edits count), else the copy made when added. */
  const attackSource = () => {
    const cache = new Map();
    return (o) => {
      if (!o.npcId) return { attacks: o.attacks || [], mods: o.mods || {} };
      if (!cache.has(o.npcId)) {
        const row = db.prepare('SELECT data FROM npcs WHERE id = ?').get(o.npcId);
        const n = row ? JSON.parse(row.data || '{}') : null;
        // plus the stat block's notes and System AI text, for the GM's full-size combat view
        cache.set(
          o.npcId,
          n
            ? {
                ...npcCombat(n),
                npcNotes: clip(n.notes, 4000),
                npcNotesEs: clip(n.notesEs, 4000),
                npcDescription: clip(n.description, 2000),
                npcDescriptionEs: clip(n.descriptionEs, 2000),
              }
            : null,
        );
      }
      return cache.get(o.npcId) || { attacks: o.attacks || [], mods: o.mods || {} };
    };
  };
  /** Crawler Actions this round: 2 each (+1 bought with AI Favor); Interrupts in phase 2 count against them. */
  const ACTIONS = 2;
  const actionsOf = (enc, cid) => {
    enc.actions = enc.actions && typeof enc.actions === 'object' ? enc.actions : {};
    const a = enc.actions[cid];
    if (!a || a.round !== enc.round) enc.actions[cid] = { round: enc.round, used: [], extra: false };
    return enc.actions[cid];
  };
  const actionsView = (enc) =>
    Object.fromEntries(
      Object.entries(enc.actions || {})
        .filter(([, a]) => a.round === enc.round)
        .map(([cid, a]) => [cid, { used: a.used, extra: a.extra, max: ACTIONS + (a.extra ? 1 : 0) }]),
    );
  /* links between two participants ("Grabbing: Alvaro" / "Grabbed by: Bad Llama 2") */
  const LINK_KINDS = ['grab', 'taunt', 'protect', 'custom'];
  const partyNames = () =>
    new Map(
      db
        .prepare('SELECT id, data FROM characters WHERE party_since IS NOT NULL')
        .all()
        .map((r) => [r.id, clip(JSON.parse(r.data || '{}').name) || '?']),
    );
  /** A side of a link still in the fight: a party crawler, or an opponent that isn't defeated (or hidden, for players). */
  const sideOf = (enc, side, party, admin) => {
    if (side.type === 'crawler') return party.has(side.id) ? { ...side, name: party.get(side.id) } : null;
    const o = enc.opponents.find((x) => x.id === side.id);
    if (!o || o.lost >= o.slots) return null;
    if (o.hidden && !admin) return null;
    return { ...side, name: o.name };
  };
  const linksView = (enc, admin) => {
    const party = partyNames();
    return (enc.links || []).flatMap((l) => {
      const a = sideOf(enc, l.a, party, admin);
      const b = sideOf(enc, l.b, party, admin);
      return a && b ? [{ id: l.id, kind: l.kind, label: l.label || '', a, b }] : [];
    });
  };

  /** Players see names and a Health percentage (the book's "let the players know what percentage…"). */
  /**
   * Count an attack for the AI Favor of "wimpy" Spells, weapons and Skills (Core Rulebook: used for a majority of your
   * attacks in a combat that lasts at least three rounds). The rating comes from the Skill/Spell on the sheet.
   */
  const tallyAttack = (enc, cid, label, data, by) => {
    enc.tally = enc.tally || {};
    const t = (enc.tally[cid] = enc.tally[cid] || {});
    const key = String(label || '').trim();
    if (!key) return;
    const e = (t[key] = t[key] || { n: 0, rating: 0, note: '' });
    e.n = Math.max(0, e.n + by);
    if (data) {
      const sk = (Array.isArray(data.skills) ? data.skills : []).find(
        (x) =>
          String(x?.name ?? '')
            .trim()
            .toLowerCase() === key.toLowerCase(),
      );
      const raw = String(sk?.aiFavor ?? '');
      e.rating = Math.max(0, Math.min(5, int(raw, 0)));
      e.note = clip(raw.replace(/^\s*\d+\s*/, ''), 80);
    }
  };
  /** At the end of a fight: crawlers who used one attack with an AI Favor rating for most of their attacks. */
  const favorOffers = (enc) => {
    if (enc.round < 3) return [];
    const out = [];
    for (const [cid, t] of Object.entries(enc.tally || {})) {
      const list = Object.entries(t).filter(([, e]) => e.n > 0);
      const total = list.reduce((sum, [, e]) => sum + e.n, 0);
      const [attack, top] = list.sort((a, b) => b[1].n - a[1].n)[0] ?? [];
      if (!top || !top.rating || top.n * 2 <= total) continue;
      const row = charRow(Number(cid));
      if (!row) continue;
      out.push({
        characterId: Number(cid),
        name: clip(JSON.parse(row.data || '{}').name),
        attack,
        count: top.n,
        total,
        rating: top.rating,
        note: top.note,
        rounds: enc.round,
      });
    }
    return out;
  };
  const viewFor = (enc, admin, src = attackSource()) => ({
    links: enc.active ? linksView(enc, admin) : [],
    actions: enc.active ? actionsView(enc) : {},
    // crawler attacks this round; the Mob's Evade (the target number) is for the GM only
    attacks: (enc.active ? enc.attacks || [] : [])
      .filter((x) => x.round === enc.round)
      // eslint-disable-next-line no-unused-vars
      .map(({ ammo, ...x }) => (admin ? x : { ...x, dc: undefined })),
    active: enc.active,
    round: enc.round,
    phase: enc.phase,
    floor: enc.floor,
    declarations: (enc.declarations || [])
      .filter((d) => d.round === enc.round && (admin || revealed(enc)))
      .map((d) => declView(enc, d, admin)),
    // who has Taunted this round (one Taunt each)
    taunts: enc.active ? (enc.taunts || []).filter((x) => x.round === enc.round) : [],
    // AI Favor the GM can hand out after a fight (attacks with an AI Favor rating used for most of a crawler's attacks)
    ...(admin ? { favorOffers: enc.favorOffers || [] } : {}),
    opponents: enc.opponents
      .filter((o) => admin || !o.hidden)
      .map((o) =>
        admin
          ? { ...o, ...src(o), pct: pct(o), defeated: o.lost >= o.slots }
          : { id: o.id, name: o.name, kind: o.kind, pct: pct(o), defeated: o.lost >= o.slots },
      ),
  });
  const combatEvent = (event, gmOnly = false) => live.postEvent({ event: { type: 'combat', ...event }, gmOnly });
  const declItem = (enc, d) => {
    const o = enc.opponents.find((x) => x.id === d.opponentId);
    return {
      opponent: o?.hidden ? '???' : d.opponentName,
      attack: d.attack.name,
      range: d.attack.range,
      dc: d.dc,
      area: !!d.area,
      targets: d.targets.map((t) => ({ id: t.id, name: t.name, splash: !!t.splash })),
    };
  };
  /** Moving to Crawler Reaction: post all of this round's declarations to the log at once. */
  function revealDeclarations(enc) {
    const list = (enc.declarations || []).filter((d) => d.round === enc.round && !d.posted);
    for (const d of list) d.posted = true;
    if (list.length)
      live.postEvent({ event: { type: 'declare', round: enc.round, items: list.map((d) => declItem(enc, d)) } });
  }

  /** Change every party sheet with `fn(data) → { data, ended }`, saving and logging what ended. */
  function forParty(fn) {
    for (const { id } of db.prepare('SELECT id FROM characters WHERE party_since IS NOT NULL').all()) {
      const row = charRow(id);
      const data = JSON.parse(row.data || '{}');
      const out = fn(data, row);
      if (out.data !== data) writeSheet(row, out.data, null);
      if (out.ended?.length) progressEvent(row, out.data, { type: 'expired', names: out.ended.slice(0, 20) });
    }
  }
  /** Change one sheet (server-side effects of combat: Advantage earned, items used…). */
  /** Mark a Skill for Advancement (it was used), unless it already is. */
  function markSkill(cid, names, actorId = null) {
    changeSheet(
      cid,
      (data) => {
        const sk = findSkill(data.skills, ...names);
        if (!sk || sk.done) return data;
        return { ...data, skills: data.skills.map((x) => (x === sk ? { ...x, done: true } : x)) };
      },
      actorId,
    );
  }

  function changeSheet(cid, fn, actorId = null) {
    const row = charRow(cid);
    if (!row) return null;
    const data = JSON.parse(row.data || '{}');
    const next = fn(data);
    if (next && next !== data) writeSheet(row, next, actorId);
    return next ?? data;
  }

  app.get('/api/encounter', auth, (req, res) => res.json(viewFor(getEnc(), !!req.user.is_admin)));

  app.post('/api/encounter', auth, adminOnly, (req, res) => {
    const enc = getEnc();
    const action = req.body?.action;
    if (action === 'start') {
      enc.active = true;
      enc.round = req.body?.surprise ? 0 : 1; // round 0 = the crawlers' surprise round
      enc.phase = 1;
      // the Floor comes from World Stats (the GM can still pass one)
      enc.floor = req.body?.floor !== undefined ? Math.max(1, int(req.body.floor, 1)) : worldFloor();
      enc.declarations = [];
      enc.actions = {};
      enc.attacks = [];
      enc.links = [];
      enc.injuries = [];
      enc.tally = {};
      enc.favorOffers = [];
      combatEvent({ action: 'start', round: enc.round });
    } else if (action === 'next' && enc.active) {
      if (enc.round === 0 || enc.phase >= PHASES) {
        // Clean Up is over: timed effects lose a round; Taunt and Catcher links only last the round
        if (enc.round >= 1) forParty((data) => tickRound(data));
        enc.links = (enc.links || []).filter((l) => l.kind === 'grab' || l.kind === 'custom');
        enc.round += 1;
        enc.phase = 1;
        enc.declarations = []; // a new round: the Mobs declare again
        enc.actions = {}; // …and every crawler has 2 Actions again
        enc.attacks = [];
        combatEvent({ action: 'round', round: enc.round });
      } else {
        enc.phase += 1;
        if (enc.phase === 2) revealDeclarations(enc);
      }
    } else if (action === 'prev' && enc.active) {
      if (enc.phase > 1) enc.phase -= 1;
      else if (enc.round > 1) {
        enc.round -= 1;
        enc.phase = PHASES;
      }
    } else if (action === 'end' && enc.active) {
      combatEvent({ action: 'end', round: enc.round });
      enc.favorOffers = favorOffers(enc);
      enc.tally = {};
      // effects that last the fight end; Major/Critical Fails on Evade leave an Injury once the adrenaline wears off
      const injuries = enc.injuries || [];
      forParty((data) => endCombat(data));
      for (const inj of injuries) {
        const row = charRow(inj.cid);
        if (!row) continue;
        const data = JSON.parse(row.data || '{}');
        const next = { ...data, debuffList: addDebuffTo(data.debuffList, inj.id) };
        writeSheet(row, next, null);
        progressEvent(row, next, { type: 'injury', debuff: inj.id, source: inj.source });
      }
      enc.injuries = [];
      enc.links = [];
      enc.active = false;
      enc.declarations = [];
      enc.actions = {};
      enc.attacks = [];
      enc.opponents = enc.opponents.filter((o) => req.body?.keepOpponents && o.lost < o.slots);
    } else if (action === 'floor') {
      enc.floor = Math.max(1, int(req.body?.floor, 1));
    } else {
      return res.status(400).json({ error: 'Unknown action', code: 'bad_request' });
    }
    putEnc(enc);
    res.json(viewFor(enc, true));
  });

  // add one or more opponents: a quick entry, or copies of an NPC stat block ("Goblin 1", "Goblin 2"…)
  app.post('/api/encounter/opponents', auth, adminOnly, (req, res) => {
    const enc = getEnc();
    const b = req.body || {};
    let base = {
      name: clip(b.name) || '?',
      kind: OPP_KINDS.includes(b.kind) ? b.kind : 'mob',
      slots: Math.min(20, Math.max(1, int(b.slots, 3))),
      slotValue: Math.max(1, int(b.slotValue, 2)),
      dr: String(b.dr ?? ''),
      evade: String(b.evade ?? ''),
      notes: clip(b.notes, 300),
      npcId: null,
    };
    if (b.npcId) {
      const row = db.prepare('SELECT * FROM npcs WHERE id = ?').get(Number(b.npcId));
      if (!row) return res.status(404).json({ error: 'NPC not found', code: 'not_found' });
      const n = JSON.parse(row.data || '{}');
      base = {
        // the Spanish name when the GM plays in Spanish (that's what the players see)
        name: clip((b.lang === 'es' && String(n.nameEs ?? '').trim()) || n.name) || '?',
        kind: OPP_KINDS.includes(n.kind) ? n.kind : 'mob',
        slots: Math.min(20, Math.max(1, int(n.slots, 3))),
        slotValue: Math.max(1, int(n.slotValue, 2)),
        dr: String(n.dr ?? ''),
        evade: String(n.evade ?? ''),
        notes: '',
        npcId: row.id,
        ...npcCombat(n),
      };
    }
    const count = Math.min(20, Math.max(1, int(b.count, 1)));
    // number copies of the same name: a lone "Goblin" becomes "Goblin 1" once a second one joins
    const same = enc.opponents.filter((o) => o.name === base.name || o.name.startsWith(`${base.name} `));
    const nums = same.map((o) => (o.name === base.name ? 1 : int(o.name.slice(base.name.length + 1), 0)));
    let next = Math.max(0, ...nums);
    const lone = enc.opponents.find((o) => o.name === base.name);
    if (lone && count >= 1) {
      lone.name = `${base.name} 1`;
      for (const d of enc.declarations || []) if (d.opponentId === lone.id) d.opponentName = lone.name;
    }
    for (let i = 0; i < count; i++) {
      enc.seq += 1;
      next += 1;
      const numbered = count > 1 || next > 1 ? `${base.name} ${next}` : base.name;
      enc.opponents.push({ ...base, id: enc.seq, name: numbered, lost: 0, hidden: !!b.hidden });
    }
    putEnc(enc);
    res.status(201).json(viewFor(enc, true));
  });

  /** DR first, then each full slot's worth of damage removes a slot. */
  function damageOpponent(enc, o, amount) {
    const dr = withFloor(o.dr, enc.floor);
    const eff = Math.max(0, int(amount) - dr);
    const slots = eff >= o.slotValue ? Math.floor(eff / o.slotValue) : 0;
    o.lost = Math.min(o.slots, o.lost + slots);
    return { slots, damage: eff, detail: `${int(amount)}${dr ? ` − ${dr} DR` : ''}` };
  }
  function opponentEvent(o, before, source) {
    if (o.lost === before) return;
    live.postEvent({
      event: {
        type: 'opponent',
        name: o.name,
        from: Math.round(((o.slots - before) / o.slots) * 100),
        to: pct(o),
        defeated: o.lost >= o.slots,
        source,
      },
      gmOnly: o.hidden,
    });
  }

  app.patch('/api/encounter/opponents/:oid', auth, adminOnly, (req, res) => {
    const enc = getEnc();
    const o = enc.opponents.find((x) => x.id === Number(req.params.oid));
    if (!o) return res.status(404).json({ error: 'Not found', code: 'not_found' });
    const b = req.body || {};
    const before = o.lost;
    let detail = '';
    if (b.damage !== undefined) detail = damageOpponent(enc, o, b.damage).detail;
    if (b.lost !== undefined) o.lost = Math.min(o.slots, Math.max(0, int(b.lost)));
    if (b.hidden !== undefined) o.hidden = !!b.hidden;
    if (b.name !== undefined) o.name = clip(b.name) || o.name;
    opponentEvent(o, before, clip(b.source) || detail);
    putEnc(enc);
    res.json(viewFor(enc, true));
  });

  app.delete('/api/encounter/opponents/:oid', auth, adminOnly, (req, res) => {
    const enc = getEnc();
    enc.opponents = enc.opponents.filter((x) => x.id !== Number(req.params.oid));
    enc.declarations = (enc.declarations || []).filter((d) => d.opponentId !== Number(req.params.oid));
    putEnc(enc);
    res.json(viewFor(enc, true));
  });

  /* ---------------- Mob Action Declaration ---------------- */
  // "Bad Llama 2 will use Lava Spit on Alvaro – Evade difficulty 15": the Mob's to-hit is the crawler's Evade DC
  app.post('/api/encounter/declarations', auth, adminOnly, (req, res) => {
    const enc = getEnc();
    const b = req.body || {};
    if (!enc.active) return res.status(400).json({ error: 'No combat', code: 'bad_request' });
    const o = enc.opponents.find((x) => x.id === Number(b.opponentId));
    if (!o) return res.status(404).json({ error: 'Not found', code: 'not_found' });
    let attack;
    const current = attackSource()(o).attacks;
    if (Number.isInteger(b.attack) && current[b.attack]) attack = current[b.attack];
    else if (b.attack && typeof b.attack === 'object')
      attack = {
        name: clip(b.attack.name) || '?',
        toHit: clip(b.attack.toHit, 20),
        damage: clip(b.attack.damage, 80),
        range: clip(b.attack.range, 40),
        effect: clip(b.attack.effect, 300),
      };
    else return res.status(400).json({ error: 'Missing attack', code: 'bad_request' });
    const party = new Map(
      db
        .prepare('SELECT id, data FROM characters WHERE party_since IS NOT NULL')
        .all()
        .map((r) => [r.id, clip(JSON.parse(r.data || '{}').name) || '?']),
    );
    const ids = [...new Set((Array.isArray(b.targets) ? b.targets : []).map(Number))].filter((id) => party.has(id));
    if (!ids.length) return res.status(400).json({ error: 'Pick a target', code: 'bad_request' });
    enc.seq += 1;
    const d = {
      id: enc.seq,
      round: enc.round,
      opponentId: o.id,
      opponentName: o.name,
      attack,
      dc: resolveNum(attack.toHit, enc.floor),
      // Area Attack: an Evade halves the damage instead of avoiding it (the GM can override the guess)
      area: typeof b.area === 'boolean' ? b.area : isAreaAttack(attack),
      targets: ids.map((id) => ({ id, name: party.get(id), evade: null, applied: null })),
      damage: null,
    };
    const splash = new Set((Array.isArray(b.splash) ? b.splash : []).map(Number));
    if (d.area) for (const tg of d.targets) tg.splash = splash.has(tg.id);
    enc.declarations = [...(enc.declarations || []), d];
    // declared late (after the reveal): post it right away
    if (revealed(enc)) revealDeclarations(enc);
    putEnc(enc);
    res.status(201).json(viewFor(enc, true));
  });

  const findDecl = (enc, did) => (enc.declarations || []).find((d) => d.id === Number(did));

  // undo every declaration of one attacker this round
  app.delete('/api/encounter/opponents/:oid/declarations', auth, adminOnly, (req, res) => {
    const enc = getEnc();
    enc.declarations = (enc.declarations || []).filter((d) => d.opponentId !== Number(req.params.oid));
    putEnc(enc);
    res.json(viewFor(enc, true));
  });

  app.delete('/api/encounter/declarations/:did', auth, adminOnly, (req, res) => {
    const enc = getEnc();
    enc.declarations = (enc.declarations || []).filter((d) => d.id !== Number(req.params.did));
    putEnc(enc);
    res.json(viewFor(enc, true));
  });

  /** Spend 1 AI Favor (the sheet's AI Favor box) and log it. False when there is none left. */
  function spendFavor(cid, use, actorId) {
    const row = charRow(cid);
    const data = JSON.parse(row?.data || '{}');
    const have = int(data.dr?.aiFavor, 0);
    if (!row || have <= 0) return false;
    data.dr = { ...(data.dr || {}), aiFavor: String(have - 1) };
    writeSheet(row, data, actorId);
    live.postEvent({
      ownerId: row.owner_id,
      characterId: row.id,
      charName: clip(data.name),
      event: { type: 'favor', use, from: have, to: have - 1 },
      gmOnly: !row.party_since,
    });
    return true;
  }
  const canAct = (req, cid) => {
    const c = db.prepare('SELECT id, owner_id, party_since FROM characters WHERE id = ?').get(cid);
    return !!c && (c.owner_id === req.user.id || !!req.user.is_admin);
  };

  // a targeted crawler (its owner or the GM) rolls Evade against the declared attack.
  // One Evade Action covers every attack against the crawler this round (a separate check for each).
  // { reroll: true } spends 1 AI Favor to reroll a failed Evade once (not on a Natural 1).
  app.post('/api/encounter/declarations/:did/evade', auth, (req, res) => {
    const enc = getEnc();
    const d = findDecl(enc, req.params.did);
    const admin = !!req.user.is_admin;
    if (!d || (!admin && !revealed(enc))) return res.status(404).json({ error: 'Not found', code: 'not_found' });
    const target = d.targets.find((x) => x.id === Number(req.body?.characterId));
    if (!target || !canAct(req, target.id))
      return res.status(404).json({ error: 'Character not found', code: 'char_not_found' });
    const expr = String(req.body?.expr ?? 'd20').replace(/\s+/g, '');
    if (!/^1?d20([+-]\d{1,2})?$/i.test(expr)) return res.status(400).json({ error: 'Invalid dice', code: 'bad_dice' });
    const reroll = !!req.body?.reroll;
    const acts = actionsOf(enc, target.id);
    const sheet = JSON.parse(charRow(target.id)?.data || '{}');
    const dodge = dodgeOf(effectiveSkills(sheet.skills, sheet.inventory));
    // a free Evade from Taunt (Rank 5) that failed can be rolled again by spending the Evade Action
    const retryFree = !reroll && target.freeEvade && target.evade?.success === false && !target.evade.retried;
    if (reroll) {
      const e = target.evade;
      if (!e || e.success !== false || e.natural === 1 || e.rerolled)
        return res.status(409).json({ error: 'Nothing to reroll', code: 'no_reroll' });
      if (!spendFavor(target.id, 'reroll', req.user.id))
        return res.status(409).json({ error: 'No AI Favor left', code: 'no_ai_favor' });
    } else {
      if (target.evade && !admin && !retryFree)
        return res.status(409).json({ error: 'Already rolled', code: 'already_rolled' });
      // one Evade Action covers every attack this round; Taunt's free Evades and Dodge Rank 15 cost nothing
      const free = (target.freeEvade && !target.evade) || dodge.freeEvade;
      if (!free && !acts.used.includes('evade')) {
        if (acts.used.length >= ACTIONS + (acts.extra ? 1 : 0) && !admin)
          return res.status(409).json({ error: 'No Actions left', code: 'no_actions_left' });
        acts.used.push('evade');
      }
    }
    // Advantage: Dodge Rank 10 against Spells and Ranged Attacks, Taunt Rank 15 on its free Evades. Disadvantage:
    // Debuffs (Shit-Faced, Stunned, Queasy). Each Advantage cancels one Disadvantage.
    const advs = [dodge.advVsRanged && isRangedAttack(d.attack), target.evadeAdv && !target.evade].filter(Boolean);
    const dis = debuffDisadvantage(sheet.debuffList, 'evade');
    const mode = rollMode(advs.length, dis.length);
    const adv = mode === 'adv';
    const r = rollDice(withRollMode(expr, mode));
    // Stunned / Queasy last one roll
    const usedUp = usedUpBy(sheet.debuffList, 'evade');
    if (usedUp.length)
      changeSheet(target.id, (data) => ({ ...data, debuffList: dropDebuffs(data.debuffList, usedUp) }), req.user.id);
    const first = reroll || retryFree ? target.evade.total : undefined;
    target.evade = {
      total: r.total,
      natural: r.natural,
      ...(reroll ? { rerolled: true, first } : {}),
      ...(retryFree ? { retried: true, first } : {}),
      ...(adv ? { advantage: true } : {}),
      ...(mode === 'dis' ? { disadvantage: true } : {}),
    };
    // Dodge is marked for Advancement when Evading, until Rank 5
    if (dodge.rank > 0 && dodge.rank < 5) markSkill(target.id, ['Dodge', 'Esquivar'], req.user.id);
    const o = enc.opponents.find((x) => x.id === d.opponentId);
    settleEvade(enc, d, target);
    const posted = live.postRoll({
      userId: req.user.id,
      characterId: target.id,
      charName: target.name,
      roll: {
        ...r,
        label: `${reroll ? 'Evade reroll (AI Favor)' : 'Evade'}${adv ? ' ▲' : mode === 'dis' ? ' ▼' : ''} · ${o?.hidden ? '???' : d.opponentName} – ${d.attack.name}`,
        vs: { dc: d.dc, success: target.evade.success, area: !!d.area, kind: 'evade', degree: target.evade.degree },
      },
    });
    target.evade.messageId = posted?.id ?? null;
    putEnc(enc);
    res.json(viewFor(enc, admin));
  });

  /**
   * Work out an Evade's degree and what follows from it (Core Rulebook, degrees of Success in combat):
   * a Natural 20 or an Amazing Success gives Advantage on the next Attack against that Mob; a Major Fail adds the
   * Floor to the damage and a Minor Injury after combat; a Critical Fail doubles the damage and leaves a Major Injury.
   */
  function settleEvade(enc, d, target) {
    const e = target.evade;
    const degree = degreeOf(e.total, e.natural, d.dc);
    e.degree = degree;
    e.success = d.dc === null ? (degree === 'crit' ? true : degree === 'critFail' ? false : null) : isSuccess(degree);
    e.extra = degree === 'majorFail' ? enc.floor : 0;
    e.double = degree === 'critFail';
    const key = `${d.id}:${target.id}`;
    enc.injuries = (enc.injuries || []).filter((x) => x.key !== key);
    const source = `${d.opponentName} – ${d.attack.name}`;
    if (degree === 'majorFail') enc.injuries.push({ key, cid: target.id, id: 'minorInjury', source });
    if (degree === 'critFail') enc.injuries.push({ key, cid: target.id, id: 'majorInjury', source });
    if (degree === 'crit' || degree === 'amazing') {
      const o = enc.opponents.find((x) => x.id === d.opponentId);
      changeSheet(target.id, (data) => {
        const effects = Array.isArray(data.effects) ? data.effects : [];
        if (effects.some((x) => x.kind === 'advantage' && x.vsOpponent === d.opponentId)) return data;
        const adv = cleanEffect({
          id: newEffectId(),
          kind: 'advantage',
          name: `Advantage vs ${o?.name ?? d.opponentName}`,
          effect: 'Next Attack against this Mob',
          duration: 'combat',
          vsOpponent: d.opponentId,
          source: degree === 'crit' ? 'Natural 20 on Evade' : 'Amazing Success on Evade',
        });
        return { ...data, effects: [...effects, adv] };
      });
    }
  }

  // AI Favor reroll of any d20 Check in the log (Core Rulebook "AI Favor"): once per Check, not on a Natural 1,
  // before the GM announces the result (so only recent rolls). The reroll is the result that counts; both are logged.
  // Evade rolls have their own reroll on the party card; crawler attacks update their hit/miss.
  app.post('/api/messages/:id/reroll', auth, (req, res) => {
    const row = live.rawMessage(req.params.id);
    const roll = row?.roll ? JSON.parse(row.roll) : null;
    if (!row || row.kind !== 'roll' || !roll || !row.character_id || !canAct(req, row.character_id))
      return res.status(404).json({ error: 'Not found', code: 'not_found' });
    const age = Date.now() - Date.parse(`${row.created_at.replace(' ', 'T')}Z`);
    if (roll.natural === null || roll.natural === undefined || roll.natural === 1 || roll.rerolled || roll.rerollOf)
      return res.status(409).json({ error: 'Nothing to reroll', code: 'no_reroll' });
    if (age > 15 * 60 * 1000) return res.status(409).json({ error: 'Too late to reroll', code: 'reroll_too_late' });
    if (roll.vs && roll.vs.kind !== 'attack')
      return res.status(409).json({ error: 'Use the reroll on the party card', code: 'use_card' });
    const enc = getEnc();
    const atks = roll.vs?.kind === 'attack' ? (enc.attacks || []).filter((x) => x.messageId === row.id) : [];
    const atk = atks[0] ?? null;
    if (roll.vs?.kind === 'attack' && !atk)
      return res.status(409).json({ error: 'Nothing to reroll', code: 'no_reroll' });
    if (!spendFavor(row.character_id, 'reroll', req.user.id))
      return res.status(409).json({ error: 'No AI Favor left', code: 'no_ai_favor' });
    const r = rollDice(roll.expr);
    let vs;
    if (atk) {
      for (const x of atks) {
        const degree = degreeOf(r.total, r.natural, x.dc);
        Object.assign(x, { first: x.total, total: r.total, natural: r.natural, degree, hit: hitOf(degree, x.dc) });
        x.rerolled = true;
      }
      vs =
        atks.length > 1
          ? { dc: null, success: null, kind: 'attack' }
          : { dc: null, success: atk.hit, kind: 'attack', degree: atk.degree };
      putEnc(enc);
    }
    const m = live.postRoll({
      userId: req.user.id,
      characterId: row.character_id,
      charName: row.char_name,
      roll: { ...r, label: `${roll.label || ''} · ↻ AI Favor`.slice(0, 120), rerollOf: row.id, ...(vs ? { vs } : {}) },
      gmOnly: !!row.gm_only,
    });
    live.updateRoll(row.id, { ...roll, rerolled: true });
    res.json(m);
  });

  /* ---------------- Interrupts: Intervene, Taunt, Catcher ---------------- */
  /** Use one of a crawler's Actions for an Interrupt (or a step-4 Action). False when none are left. */
  const useAction = (enc, cid, kind) => {
    const a = actionsOf(enc, cid);
    if (a.used.length >= ACTIONS + (a.extra ? 1 : 0)) return false;
    a.used.push(kind);
    return true;
  };
  const partyRow = (req, cid) => {
    const row = charRow(Number(cid));
    return row && row.party_since && (row.owner_id === req.user.id || req.user.is_admin) ? row : null;
  };

  // Intervene: another crawler spends an Action to roll 1d6 and add it to a d20 Check after the result is known
  // (any Check except Stat Checks; most useful on a Near Miss). Only in combat; once per helper per roll.
  app.post('/api/messages/:id/intervene', auth, (req, res) => {
    const enc = getEnc();
    const row = live.rawMessage(req.params.id);
    const roll = row?.roll ? JSON.parse(row.roll) : null;
    const helper = partyRow(req, req.body?.characterId);
    if (!enc.active) return res.status(409).json({ error: 'No combat', code: 'no_combat' });
    if (!row || row.kind !== 'roll' || !roll || roll.natural === null || roll.natural === undefined || !helper)
      return res.status(404).json({ error: 'Not found', code: 'not_found' });
    if (row.character_id === helper.id || roll.rerolled || roll.stat)
      return res.status(409).json({ error: 'Not this roll', code: 'no_intervene' });
    if ((roll.intervene || []).some((x) => x.id === helper.id))
      return res.status(409).json({ error: 'Already helped', code: 'already_rolled' });
    if (Date.now() - Date.parse(`${row.created_at.replace(' ', 'T')}Z`) > 15 * 60 * 1000)
      return res.status(409).json({ error: 'Too late', code: 'reroll_too_late' });
    if (!useAction(enc, helper.id, 'interrupt'))
      return res.status(409).json({ error: 'No Actions left', code: 'no_actions_left' });
    const d6 = rollDice('1d6');
    const helperName = clip(JSON.parse(helper.data || '{}').name) || '?';
    live.postRoll({
      userId: req.user.id,
      characterId: helper.id,
      charName: helperName,
      roll: { ...d6, label: `Intervene → ${row.char_name}: ${roll.label || roll.expr}`.slice(0, 120) },
      gmOnly: !!row.gm_only,
    });
    const total = roll.total + d6.total;
    const next = {
      ...roll,
      total,
      intervene: [...(roll.intervene || []), { id: helper.id, name: helperName, value: d6.total }],
    };
    // the boosted total counts: an Evade or an attack may now succeed
    const decl = (enc.declarations || []).find((d) => d.targets.some((tg) => tg.evade?.messageId === row.id));
    if (decl) {
      const tg = decl.targets.find((x) => x.evade?.messageId === row.id);
      tg.evade.total = total;
      settleEvade(enc, decl, tg);
      next.vs = { ...roll.vs, success: tg.evade.success, degree: tg.evade.degree };
    }
    const atks = (enc.attacks || []).filter((x) => x.messageId === row.id);
    for (const x of atks) {
      x.total = total;
      x.degree = degreeOf(total, x.natural, x.dc);
      x.hit = hitOf(x.degree, x.dc);
    }
    if (atks.length === 1) next.vs = { ...roll.vs, success: atks[0].hit, degree: atks[0].degree };
    else if (roll.vs?.dc !== undefined && roll.vs?.dc !== null && !decl && !atks.length)
      next.vs = { ...roll.vs, success: total >= roll.vs.dc, degree: degreeOf(total, roll.natural, roll.vs.dc) };
    live.updateRoll(row.id, next);
    putEnc(enc);
    res.json(viewFor(enc, !!req.user.is_admin));
  });

  // Taunt (Interrupt): an Int-opposed Taunt Check against the Mob; if the crawler wins, the Mob attacks them instead
  // of its original target (not for Area Attacks). The crawler may still spend an Action to Evade.
  /**
   * Taunt (Cha, Interrupt — Core Rulebook p. 200): after seeing where the Mob Attacks are headed, one Int-Opposed
   * Check draws attacks onto the taunter: one on a Success, two on an Amazing Success, three on a Natural 20, in the
   * order picked. { characterId, expr, picks: [{ declId, targetId }] }. Not against Area Attacks. Rank 5: a free
   * Evade against each Taunted Attack; Rank 10: 60 ft instead of 30; Rank 15: those Evades with Advantage.
   */
  app.post('/api/encounter/taunt', auth, (req, res) => {
    const enc = getEnc();
    const row = partyRow(req, req.body?.characterId);
    if (!row || !enc.active || !revealed(enc)) return res.status(404).json({ error: 'Not found', code: 'not_found' });
    const picks = (Array.isArray(req.body?.picks) ? req.body.picks : []).slice(0, 6).map((p) => {
      const d = findDecl(enc, p?.declId);
      const tg = d?.targets.find((x) => x.id === Number(p?.targetId));
      return d && tg ? { d, tg } : null;
    });
    if (!picks.length || picks.some((p) => !p)) return res.status(404).json({ error: 'Not found', code: 'not_found' });
    if (picks.some(({ d }) => d.area))
      return res.status(409).json({ error: 'Not against an Area Attack', code: 'no_taunt_area' });
    if (picks.some(({ d, tg }) => tg.id === row.id || d.targets.some((x) => x.id === row.id)))
      return res.status(409).json({ error: 'Already the target', code: 'already_target' });
    if (picks.some(({ tg }) => tg.evade || tg.applied || tg.noEvade))
      return res.status(409).json({ error: 'Too late for that attack', code: 'taunt_too_late' });
    if ((enc.taunts || []).some((x) => x.id === row.id && x.round === enc.round))
      return res.status(409).json({ error: 'Already taunted this round', code: 'already_rolled' });
    const expr = String(req.body?.expr ?? 'd20').replace(/\s+/g, '');
    if (!/^1?d20([+-]\d{1,3})?$/i.test(expr)) return res.status(400).json({ error: 'Invalid dice', code: 'bad_dice' });
    if (!useAction(enc, row.id, 'interrupt'))
      return res.status(409).json({ error: 'No Actions left', code: 'no_actions_left' });
    const data = JSON.parse(row.data || '{}');
    // Ranks from equipped gear count (Platinum armor: +3 to Catcher or Taunt)
    const rank = skillRank(effectiveSkills(data.skills, data.inventory), 'Taunt', 'Provocar');
    const perks = tauntPerks(rank);
    // an Int-Opposed Check: the GM never rolls, the Difficulty is 10 + the Mob's Int + the Floor (Core Rulebook
    // "Opposed Checks"), using the sharpest of the Mobs picked
    const mobs = [...new Set(picks.map(({ d }) => d.opponentId))].map((id) => enc.opponents.find((o) => o.id === id));
    const mobMod = Math.max(0, ...mobs.map((o) => (o ? int(attackSource()(o).mods?.int, 0) : 0)));
    const dc = 10 + mobMod + (Number(enc.floor) || 0);
    // untrained (no Ranks) and Debuffs (Shit-Faced, Stunned, Queasy) roll with Disadvantage
    const dis = [...(rank > 0 ? [] : ['untrained']), ...debuffDisadvantage(data.debuffList, 'check')];
    const mode = rollMode(0, dis.length);
    const mine = rollDice(withRollMode(expr, mode));
    const usedUp = usedUpBy(data.debuffList, 'check');
    if (usedUp.length)
      changeSheet(row.id, (sheet) => ({ ...sheet, debuffList: dropDebuffs(sheet.debuffList, usedUp) }), req.user.id);
    const degree = degreeOf(mine.total, mine.natural, dc);
    const n = Math.min(picks.length, tauntCount(degree));
    const name = clip(data.name) || '?';
    const hidden = mobs.some((o) => o?.hidden);
    const shown = mobs.map((o) => (o?.hidden ? '???' : (o?.name ?? '?'))).join(', ');
    live.postRoll({
      userId: req.user.id,
      characterId: row.id,
      charName: name,
      roll: {
        ...mine,
        label: `Taunt${mode === 'dis' ? ' ▼' : ''} → ${shown}`,
        vs: { dc, success: n > 0, kind: 'taunt', degree },
      },
      gmOnly: hidden,
    });
    picks.forEach(({ d, tg }, i) => {
      const won = i < n;
      d.taunt = { id: row.id, name, total: mine.total, mob: dc, won, degree };
      if (!won) return;
      d.tauntedFrom = [...(d.tauntedFrom || []), tg.name];
      Object.assign(tg, {
        id: row.id,
        name,
        evade: null,
        applied: null,
        tauntedFrom: tg.name,
        ...(perks.freeEvade ? { freeEvade: true } : {}),
        ...(perks.advantage ? { evadeAdv: true } : {}),
      });
      enc.seq += 1;
      enc.links = [
        ...(enc.links || []),
        { id: enc.seq, kind: 'taunt', a: { type: 'crawler', id: row.id }, b: { type: 'opponent', id: d.opponentId } },
      ];
    });
    enc.taunts = [
      ...(enc.taunts || []).filter((x) => x.round === enc.round),
      { id: row.id, round: enc.round, n, degree },
    ];
    // a Skill Check was attempted: Taunt gets its Advancement mark
    if (rank > 0) markSkill(row.id, ['Taunt', 'Provocar'], req.user.id);
    putEnc(enc);
    res.json(viewFor(enc, !!req.user.is_admin));
  });

  /**
   * Catcher (Passive, Interrupt — Core Rulebook p. 187): when a Successful direct (non-Area) Attack is about to damage
   * an adjacent ally, take the damage instead — also after the ally's Evade failed. The catcher can't Evade it, and
   * gets +5 DR at Ranks 5, 10 and 15 (Rank 15 also ignores the hit's Debuffs).
   */
  app.post('/api/encounter/declarations/:did/catch', auth, (req, res) => {
    const enc = getEnc();
    const d = findDecl(enc, req.params.did);
    const row = partyRow(req, req.body?.characterId);
    if (!d || !revealed(enc) || !row) return res.status(404).json({ error: 'Not found', code: 'not_found' });
    if (d.area) return res.status(409).json({ error: 'Not against an Area Attack', code: 'no_catch_area' });
    const data = JSON.parse(row.data || '{}');
    const rank = skillRank(effectiveSkills(data.skills, data.inventory), 'Catcher');
    if (rank <= 0 && !req.user.is_admin)
      return res.status(409).json({ error: 'Needs Ranks in Catcher', code: 'needs_catcher' });
    const ally = d.targets.find((x) => x.id === Number(req.body?.allyId));
    if (!ally || ally.id === row.id || ally.applied || ally.evade?.success || d.targets.some((x) => x.id === row.id))
      return res.status(409).json({ error: 'Not this attack', code: 'no_catch' });
    if (!useAction(enc, row.id, 'interrupt'))
      return res.status(409).json({ error: 'No Actions left', code: 'no_actions_left' });
    const name = clip(data.name) || '?';
    const perks = catcherPerks(rank);
    // the ally's failed Evade (and its Injury) no longer matters: the catcher takes the plain hit
    enc.injuries = (enc.injuries || []).filter((x) => x.key !== `${d.id}:${ally.id}`);
    const allyId = ally.id;
    Object.assign(ally, {
      id: row.id,
      name,
      evade: null,
      applied: null,
      caughtFor: ally.name,
      noEvade: true,
      catchDr: perks.dr,
      ...(perks.ignoreDebuffs ? { ignoreDebuffs: true } : {}),
    });
    delete ally.freeEvade;
    delete ally.evadeAdv;
    enc.seq += 1;
    enc.links = [
      ...(enc.links || []),
      { id: enc.seq, kind: 'protect', a: { type: 'crawler', id: row.id }, b: { type: 'crawler', id: allyId } },
    ];
    live.postEvent({
      ownerId: row.owner_id,
      characterId: row.id,
      charName: name,
      event: {
        type: 'interrupt',
        kind: 'catch',
        ally: ally.caughtFor,
        attack: `${d.opponentName} – ${d.attack.name}`,
        dr: perks.dr,
      },
    });
    putEnc(enc);
    res.json(viewFor(enc, !!req.user.is_admin));
  });

  /* ---------------- links between two participants (GM) ---------------- */
  app.post('/api/encounter/links', auth, adminOnly, (req, res) => {
    const enc = getEnc();
    const b = req.body || {};
    const side = (x) =>
      x && ['crawler', 'opponent'].includes(x.type) && Number.isInteger(Number(x.id))
        ? { type: x.type, id: Number(x.id) }
        : null;
    const a = side(b.a);
    const c = side(b.b);
    if (!enc.active || !a || !c || (a.type === c.type && a.id === c.id))
      return res.status(400).json({ error: 'Pick both sides', code: 'bad_request' });
    enc.seq += 1;
    const kind = LINK_KINDS.includes(b.kind) ? b.kind : 'grab';
    enc.links = [...(enc.links || []), { id: enc.seq, kind, a, b: c, label: clip(b.label, 40) }];
    putEnc(enc);
    res.status(201).json(viewFor(enc, true));
  });
  app.delete('/api/encounter/links/:id', auth, adminOnly, (req, res) => {
    const enc = getEnc();
    enc.links = (enc.links || []).filter((l) => l.id !== Number(req.params.id));
    putEnc(enc);
    res.json(viewFor(enc, true));
  });

  /* ---------------- quick-access items ---------------- */
  // Use an item from the inventory: one fewer (the row goes at 0), healing and mana items apply themselves
  // (to the crawler or a party member), and in combat it takes an Action (an Interrupt in Crawler Reaction).
  // Use an item. Consumables spend a charge or one of the stack; Equipment, Accessories and Special items use
  // their ability and stay. In combat only Hotlist items can be used, and it takes an Action (a healing item is
  // an Interrupt in Crawler Reaction). Ammunition is spent by attacks, not here.
  app.post('/api/characters/:id/use-item', auth, loadChar, (req, res) => {
    const data = JSON.parse(req.char.data || '{}');
    const inv = Array.isArray(data.inventory) ? data.inventory : [];
    const hotSlots = Array.isArray(data.hotSlots) ? data.hotSlots : [];
    const it = inv.find((x) => x && x.id === String(req.body?.itemId));
    if (!it || !String(it.item || '').trim()) return res.status(404).json({ error: 'Not found', code: 'not_found' });
    const type = String(it.type || '');
    if (type === 'ammunition')
      return res.status(409).json({ error: 'Ammunition is fired with a ranged attack', code: 'ammo_via_attack' });
    // kept items (their ability is used); consumables (and untyped items from before categories) are used up
    const kept = isWorn(type) || type === 'special';
    if (!kept && type && type !== 'consumable')
      return res.status(409).json({ error: 'This item cannot be used', code: 'not_usable' });
    const have = String(it.qty ?? '').trim() === '' ? 1 : int(it.qty, 1);
    if (!kept && have <= 0) return res.status(409).json({ error: 'None left', code: 'none_left' });
    const enc = getEnc();
    const inFight = enc.active && !!req.char.party_since;
    if (inFight && !hotSlots.includes(it.id))
      return res.status(409).json({ error: 'Only Hotlist items can be used in combat', code: 'not_on_hotlist' });
    const fx = kept ? null : (itemEffect(it.notes) ?? itemEffect(lookupNotes(it.item)));
    const targetId = Number(req.body?.targetId) || req.char.id;
    const target = targetId === req.char.id ? req.char : charRow(targetId);
    if (!target || (target.id !== req.char.id && !target.party_since))
      return res.status(404).json({ error: 'Character not found', code: 'char_not_found' });
    const actionKind = enc.phase === 2 && fx?.type === 'heal' ? 'heal' : 'action';
    if (inFight && !useAction(enc, req.char.id, actionKind))
      return res.status(409).json({ error: 'No Actions left', code: 'no_actions_left' });
    const spent = kept ? null : spendOne(inv, hotSlots, it.id);
    if (!kept && !spent) return res.status(409).json({ error: 'None left', code: 'none_left' });
    const left = spent ? spent.left : have;
    const name = clip(it.item);
    let mine = spent ? { ...data, inventory: spent.inventory, hotSlots: spent.hotSlots } : data;
    let applied = null;
    let manaBefore = null;
    const applyTo = (d, self) => {
      manaBefore = d.manaCurrent ?? '';
      if (fx?.type === 'heal') {
        const lost = int(d.hbLost, 0);
        applied = { type: 'heal', slots: Math.min(lost, fx.amount) };
        const hbLost = Math.max(0, lost - fx.amount);
        return { ...d, hbLost, dyingRounds: hbLost < 10 ? '' : d.dyingRounds };
      }
      if (fx?.type === 'manaFull') {
        applied = { type: 'mana' };
        return { ...d, manaCurrent: '' }; // empty = full
      }
      if (fx?.type === 'mana' && String(d.manaCurrent ?? '') !== '') {
        const max = self ? int(req.body?.manaMax, Infinity) : Infinity;
        applied = { type: 'mana', amount: fx.amount };
        return { ...d, manaCurrent: String(Math.min(max, int(d.manaCurrent, 0) + fx.amount)) };
      }
      return d;
    };
    const targetName = target.id === req.char.id ? clip(data.name) : clip(JSON.parse(target.data || '{}').name);
    const sources = { hp: [`${name}`], mana: [`${name}`] };
    if (target.id === req.char.id) mine = applyTo(mine, true);
    if (mine !== data) writeSheetWith(req.char, mine, req.user.id, sources);
    if (target.id !== req.char.id) {
      const td = JSON.parse(target.data || '{}');
      writeSheetWith(target, applyTo(td, false), req.user.id, sources);
    }
    live.postEvent({
      ownerId: req.char.owner_id,
      characterId: req.char.id,
      charName: clip(data.name),
      event: {
        type: 'item',
        item: name,
        target: target.id !== req.char.id ? targetName : '',
        left,
        applied,
        // what the item does, for everyone reading the log (hover the name for the whole card)
        card: itemCard(it, lookupNotes(it.item)),
        ...(kept ? { kept: true, ability: clip(it.ability || it.notes, 200) } : {}),
        ...(spent?.charges ? { charges: spent.charges } : {}),
        // what Undo needs: the item as it was, where it sat, the Action and the effect on the target
        undo: {
          item: it,
          index: inv.indexOf(it),
          slot: hotSlots.indexOf(it.id),
          action: inFight ? actionKind : null,
          round: enc.round,
          targetId: target.id,
          manaBefore: applied?.type === 'mana' ? manaBefore : null,
        },
        undone: false,
      },
      gmOnly: !req.char.party_since,
    });
    if (inFight) putEnc(enc);
    res.json({
      left,
      applied,
      data: req.user.is_admin ? mine : hideCurses(mine),
      version: charRow(req.char.id).version,
    });
  });

  // Give an item to another crawler in the party ({ itemId, toId, qty }; qty defaults to the whole stack). It is
  // taken off (and off the Hotlist) first; a cursed item that has revealed itself can't be taken off, so it stays.
  app.post('/api/characters/:id/give-item', auth, loadChar, (req, res) => {
    const data = JSON.parse(req.char.data || '{}');
    const inv = Array.isArray(data.inventory) ? data.inventory : [];
    const it = inv.find((x) => x && x.id === String(req.body?.itemId));
    if (!it || !String(it.item || '').trim()) return res.status(404).json({ error: 'Not found', code: 'not_found' });
    const to = charRow(Number(req.body?.toId));
    if (!to || to.id === req.char.id || !to.party_since || (!req.char.party_since && !req.user.is_admin))
      return res.status(409).json({ error: 'Only to another crawler in the party', code: 'trade_party_only' });
    if (isStuck(it) && !req.user.is_admin)
      return res.status(409).json({ error: 'A cursed item that is stuck to you', code: 'trade_stuck' });
    const stack = String(it.qty ?? '').trim() === '' ? 1 : int(it.qty, 1);
    const qty = Math.max(1, Math.min(stack, int(req.body?.qty, stack)));
    const rest = stack - qty;
    // the giver: what's left of the stack, or the row goes (off its slot and the Hotlist)
    const hotSlots = Array.isArray(data.hotSlots) ? data.hotSlots : [];
    const mine = {
      ...data,
      inventory: rest > 0 ? inv.map((x) => (x === it ? { ...x, qty: String(rest) } : x)) : inv.filter((x) => x !== it),
      hotSlots: rest > 0 ? hotSlots : hotSlots.map((h) => (h === it.id ? '' : h)),
    };
    const given = { ...it, id: newItemId(), qty: String(qty), slot: '', hot: false };
    const td = JSON.parse(to.data || '{}');
    const theirs = { ...td, inventory: [...(Array.isArray(td.inventory) ? td.inventory : []), given] };
    writeSheetWith(req.char, mine, req.user.id, {});
    writeSheetWith(to, theirs, req.user.id, {});
    live.postEvent({
      ownerId: req.char.owner_id,
      characterId: req.char.id,
      charName: clip(data.name),
      event: { type: 'trade', to: clip(td.name), toId: to.id, qty, card: itemCard(it, lookupNotes(it.item)) },
      gmOnly: !req.char.party_since,
    });
    res.json({ ok: true, qty, left: rest });
  });

  // Show an item to the party in the chat: everyone can hover it to read what it does.
  app.post('/api/characters/:id/show-item', auth, loadChar, (req, res) => {
    const data = JSON.parse(req.char.data || '{}');
    const inv = Array.isArray(data.inventory) ? data.inventory : [];
    const it = inv.find((x) => x && x.id === String(req.body?.itemId));
    if (!it || !String(it.item || '').trim()) return res.status(404).json({ error: 'Not found', code: 'not_found' });
    const message = live.postEvent({
      ownerId: req.char.owner_id,
      characterId: req.char.id,
      charName: clip(data.name),
      event: { type: 'show', card: itemCard(it, lookupNotes(it.item)), qty: clip(it.qty, 8) },
      gmOnly: !req.char.party_since,
    });
    res.json({ ok: true, messageId: message?.id ?? null });
  });

  // Put an item on a Hotlist slot ({ slot, itemId }; '' empties it). In combat this takes an Action and is logged,
  // so it can be undone from the log; out of combat the sheet just saves it.
  app.post('/api/characters/:id/hotlist', auth, loadChar, (req, res) => {
    const data = JSON.parse(req.char.data || '{}');
    const inv = Array.isArray(data.inventory) ? data.inventory : [];
    const slot = int(req.body?.slot, -1);
    if (slot < 0 || slot >= HOT_SLOTS) return res.status(400).json({ error: 'Bad slot', code: 'bad_request' });
    const itemId = String(req.body?.itemId || '');
    // a Spell ('spell:<name>', any of the crawler's Spells but Heal) or an inventory item
    const sp = isSpellRef(itemId)
      ? hotlistSpells(Array.isArray(data.skills) ? data.skills : []).find((x) => spellRef(x.name) === itemId)
      : null;
    if (isSpellRef(itemId) && !sp)
      return res.status(409).json({ error: 'This item cannot go on the Hotlist', code: 'not_hotlistable' });
    const it = itemId && !sp ? inv.find((x) => x && x.id === itemId) : null;
    if (itemId && !sp && !it) return res.status(404).json({ error: 'Not found', code: 'not_found' });
    if (it && !hotlistable(it))
      return res.status(409).json({ error: 'This item cannot go on the Hotlist', code: 'not_hotlistable' });
    const before = Array.from({ length: HOT_SLOTS }, (_, i) => (data.hotSlots || [])[i] || '');
    const next = setHotSlot(inv, before, slot, itemId);
    if (next.hotSlots.every((id, i) => id === before[i]))
      return res.json({ data, version: req.char.version, messageId: null });
    const enc = getEnc();
    const inFight = enc.active && !!req.char.party_since;
    if (inFight && !useAction(enc, req.char.id, 'hotlist'))
      return res.status(409).json({ error: 'No Actions left', code: 'no_actions_left' });
    const mine = { ...data, inventory: next.inventory, hotSlots: next.hotSlots };
    writeSheetWith(req.char, mine, req.user.id, {});
    let messageId = null;
    if (inFight) {
      putEnc(enc);
      const prevId = before[slot];
      const prev = isSpellRef(prevId) ? { item: prevId.slice(6) } : inv.find((x) => x.id === prevId);
      const msg = live.postEvent({
        ownerId: req.char.owner_id,
        characterId: req.char.id,
        charName: clip(data.name),
        event: {
          type: 'hotlist',
          slot: slot + 1,
          item: it ? clip(it.item) : sp ? clip(sp.name) : '',
          prev: prev ? clip(prev.item) : '',
          before,
          after: next.hotSlots,
          round: enc.round,
          undone: false,
        },
        gmOnly: false,
      });
      messageId = msg?.id ?? null;
    }
    res.json({ data: req.user.is_admin ? mine : hideCurses(mine), version: charRow(req.char.id).version, messageId });
  });

  /** Give back the Action an undone entry used (only within the same round of the same fight). */
  const freeAction = (cid, kind, round) => {
    const enc = getEnc();
    if (!kind || !enc.active || enc.round !== round) return;
    const a = actionsOf(enc, cid);
    const i = a.used.lastIndexOf(kind);
    if (i >= 0) a.used.splice(i, 1);
    putEnc(enc);
  };

  /** Put back one use of an item: a charge or one of the stack; the row (and its Hotlist slot) if it was used up. */
  function restoreItem(data, u) {
    const inv = Array.isArray(data.inventory) ? [...data.inventory] : [];
    const was = u.item;
    const max = int(was.maxCharges, 0);
    const i = inv.findIndex((x) => x && x.id === was.id);
    const hotSlots = Array.from({ length: HOT_SLOTS }, (_, k) => (data.hotSlots || [])[k] || '');
    if (i >= 0) {
      const now = inv[i];
      const chargeSpent = max > 0 && int(now.qty, 1) === int(was.qty, 1);
      inv[i] = chargeSpent
        ? { ...now, charges: String(Math.min(max, int(now.charges, max) + 1)) }
        : { ...now, qty: String(int(now.qty, 0) + 1), ...(max > 0 ? { charges: String(was.charges ?? '') } : {}) };
    } else {
      inv.splice(Math.max(0, Math.min(inv.length, int(u.index, inv.length))), 0, { ...was, qty: '1' });
      if (u.slot >= 0 && !hotSlots[u.slot]) hotSlots[u.slot] = was.id;
    }
    return { ...data, inventory: inv, hotSlots };
  }

  // Undo from the chat/log (its owner or the GM): a Hotlist change made in combat (slots back, Action returned) or
  // using an item (the use comes back, the healing or Mana it gave is taken away, the Action is returned)
  app.post('/api/messages/:id/undo', auth, (req, res) => {
    const m = live.rawMessage(req.params.id);
    const ev = m?.event ? JSON.parse(m.event) : null;
    if (!m || !['hotlist', 'item'].includes(ev?.type) || (ev.type === 'item' && !ev.undo))
      return res.status(404).json({ error: 'Not found', code: 'not_found' });
    const row = charRow(m.character_id);
    if (!row || (row.owner_id !== req.user.id && !req.user.is_admin))
      return res.status(404).json({ error: 'Not found', code: 'not_found' });
    if (ev.undone) return res.status(409).json({ error: 'Already undone', code: 'already_undone' });
    const data = JSON.parse(row.data || '{}');
    if (ev.type === 'hotlist') {
      const now = Array.from({ length: HOT_SLOTS }, (_, i) => (data.hotSlots || [])[i] || '');
      if (!now.every((id, i) => id === (ev.after[i] || '')))
        return res.status(409).json({ error: 'The Hotlist changed since', code: 'hotlist_changed' });
      // the items it held might have been used up since: setHotSlot/syncHot drop missing ones
      const back = setHotSlot(data.inventory || [], ev.before, -1, '');
      writeSheetWith(row, { ...data, inventory: back.inventory, hotSlots: back.hotSlots }, req.user.id, {});
      freeAction(row.id, 'hotlist', ev.round);
    } else {
      const u = ev.undo;
      const sources = { hp: [`Undo: ${clip(ev.item)}`], mana: [`Undo: ${clip(ev.item)}`] };
      const takeBack = (d) => {
        if (ev.applied?.type === 'heal' && ev.applied.slots)
          return { ...d, hbLost: Math.min(10, int(d.hbLost, 0) + int(ev.applied.slots, 0)) };
        if (ev.applied?.type === 'mana' && u.manaBefore !== null) return { ...d, manaCurrent: u.manaBefore };
        return d;
      };
      let mine = ev.kept ? data : restoreItem(data, u);
      if (u.targetId === row.id) mine = takeBack(mine);
      if (mine !== data) writeSheetWith(row, mine, req.user.id, sources);
      if (u.targetId !== row.id) {
        const target = charRow(u.targetId);
        if (target) writeSheetWith(target, takeBack(JSON.parse(target.data || '{}')), req.user.id, sources);
      }
      freeAction(row.id, u.action, u.round);
    }
    live.updateEvent(m.id, { ...ev, undone: true });
    res.json({ ok: true });
  });

  // mark a crawler's Actions: { op: 'use', kind: 'interrupt' | 'action' }, { op: 'free', index },
  // or { op: 'extra' } to buy a 3rd (non-Attack) Action with 1 AI Favor, once per round
  app.post('/api/encounter/actions', auth, (req, res) => {
    const enc = getEnc();
    const cid = Number(req.body?.characterId);
    if (!enc.active || !canAct(req, cid)) return res.status(404).json({ error: 'Not found', code: 'not_found' });
    const inParty = db.prepare('SELECT party_since FROM characters WHERE id = ?').get(cid)?.party_since;
    if (!inParty) return res.status(404).json({ error: 'Not found', code: 'not_found' });
    const a = actionsOf(enc, cid);
    const max = ACTIONS + (a.extra ? 1 : 0);
    const op = req.body?.op;
    if (op === 'use') {
      if (a.used.length >= max) return res.status(409).json({ error: 'No Actions left', code: 'no_actions_left' });
      a.used.push(['interrupt', 'heal'].includes(req.body?.kind) ? req.body.kind : 'action');
    } else if (op === 'free') {
      const i = int(req.body?.index, -1);
      if (i < 0 || i >= a.used.length) return res.status(400).json({ error: 'Bad index', code: 'bad_request' });
      a.used.splice(i, 1);
    } else if (op === 'extra') {
      if (a.extra) return res.status(409).json({ error: 'Once per round', code: 'already_extra' });
      if (!spendFavor(cid, 'action', req.user.id))
        return res.status(409).json({ error: 'No AI Favor left', code: 'no_ai_favor' });
      a.extra = true;
    } else return res.status(400).json({ error: 'Unknown action', code: 'bad_request' });
    putEnc(enc);
    res.json(viewFor(enc, !!req.user.is_admin));
  });

  // Mob Attack Resolution: the GM rolls the declared attack's damage (public, unless the Mob is hidden)
  app.post('/api/encounter/declarations/:did/damage', auth, adminOnly, (req, res) => {
    const enc = getEnc();
    const d = findDecl(enc, req.params.did);
    if (!d) return res.status(404).json({ error: 'Not found', code: 'not_found' });
    const o = enc.opponents.find((x) => x.id === d.opponentId);
    const expr = damageDice(d.attack.damage, enc.floor, o ? attackSource()(o).mods : {});
    const r = expr ? rollDice(expr) : null;
    if (!r) return res.status(400).json({ error: 'No dice in this damage entry', code: 'bad_dice' });
    d.damage = { total: r.total, expr };
    live.postRoll({
      userId: req.user.id,
      charName: o?.hidden ? '???' : d.opponentName,
      roll: { ...r, label: `${d.attack.name} · ${d.attack.damage}`.slice(0, 120) },
      gmOnly: !!o?.hidden,
    });
    putEnc(enc);
    res.json(viewFor(enc, true));
  });

  // after the GM's browser applied the damage to a sheet: remember it so it isn't applied twice
  app.patch('/api/encounter/declarations/:did/targets/:cid', auth, adminOnly, (req, res) => {
    const enc = getEnc();
    const d = findDecl(enc, req.params.did);
    const target = d?.targets.find((x) => x.id === Number(req.params.cid));
    if (!target) return res.status(404).json({ error: 'Not found', code: 'not_found' });
    const b = req.body || {};
    if (b.applied === null) target.applied = null;
    else if (b.applied) target.applied = { damage: int(b.applied.damage), slots: int(b.applied.slots) };
    if (b.evade === null) {
      target.evade = null;
      enc.injuries = (enc.injuries || []).filter((x) => x.key !== `${d.id}:${target.id}`);
    }
    putEnc(enc);
    res.json(viewFor(enc, true));
  });

  // a GM roll shown with an NPC's name as the speaker (damage buttons on the stat block)
  app.post('/api/npc-roll', auth, adminOnly, (req, res) => {
    const r = rollDice(req.body?.expr);
    if (!r) return res.status(400).json({ error: 'Invalid dice expression', code: 'bad_dice' });
    const m = live.postRoll({
      userId: req.user.id,
      charName: clip(req.body?.name) || '?',
      roll: { ...r, label: clip(req.body?.label, 120) },
      gmOnly: !!req.body?.gmOnly,
    });
    res.status(201).json(m);
  });

  /* ---------------- Crawler Action: attacks against an opponent ---------------- */
  // No initiative in step 4: a crawler just attacks a target. The server rolls the to-hit against the Mob's
  // Evade (10 + Dex Mod + Floor, hidden from players), uses one of their Actions, and on a hit the player
  // rolls damage and the GM applies it to the opponent's Health Bar.
  const findAttack = (enc, id) => (enc.attacks || []).find((x) => x.id === Number(id) && x.round === enc.round);

  const ATTACK_EXPR = /^(1?d20|2d20k[hl]1)([+-]\d{1,3})?$/i;
  /** Hit or miss against a Mob's Evade: a Natural 1 always misses, a Natural 20 always hits. */
  const hitOf = (degree, dc) =>
    degree === 'critFail' ? false : dc === null ? (degree === 'crit' ? true : null) : isSuccess(degree);

  // { opponentId } or, for an Area Attack, { opponentIds: [...] }: one roll against each opponent's Evade,
  // one Action. Rolling with Advantage ("2d20kh1…") uses up an Advantage earned against that Mob.
  app.post('/api/encounter/attacks', auth, (req, res) => {
    const enc = getEnc();
    const b = req.body || {};
    const admin = !!req.user.is_admin;
    const cid = Number(b.characterId);
    if (!enc.active) return res.status(409).json({ error: 'No combat', code: 'no_combat' });
    const row = charRow(cid);
    if (!row || !row.party_since || (row.owner_id !== req.user.id && !admin))
      return res.status(404).json({ error: 'Character not found', code: 'char_not_found' });
    const ids = Array.isArray(b.opponentIds) && b.opponentIds.length ? b.opponentIds : [b.opponentId];
    const opps = [...new Set(ids.map(Number))]
      .slice(0, 12)
      .map((id) => enc.opponents.find((x) => x.id === id && (admin || !x.hidden) && x.lost < x.slots));
    if (!opps.length || opps.some((o) => !o)) return res.status(404).json({ error: 'Not found', code: 'not_found' });
    // attacks happen in the surprise round and in step 4 (the GM can allow them any time)
    if (!admin && !(enc.round === 0 || enc.phase === 4))
      return res.status(409).json({ error: 'Not the Crawler Action step', code: 'not_attack_step' });
    const expr = String(b.expr ?? '').replace(/\s+/g, '');
    if (!ATTACK_EXPR.test(expr)) return res.status(400).json({ error: 'Invalid dice', code: 'bad_dice' });
    const dmg = b.damage ? String(b.damage).replace(/\s+/g, '') : '';
    if (dmg && !parseDice(dmg)) return res.status(400).json({ error: 'Invalid dice', code: 'bad_dice' });
    // Rank damage dice from the Attack Skill's upgrades: added after any Critical Hit doubling
    const dmgRank = dmg && b.damageRank ? String(b.damageRank).replace(/\s+/g, '') : '';
    if (dmgRank && !parseDice(dmgRank)) return res.status(400).json({ error: 'Invalid dice', code: 'bad_dice' });
    // Actions: 2 per round (+1 non-Attack Action bought with AI Favor), at most 2 of them Attacks
    const a = actionsOf(enc, cid);
    const max = ACTIONS + (a.extra ? 1 : 0);
    const attacks = a.used.filter((k) => k === 'attack').length;
    if (a.used.length >= max || attacks >= ACTIONS)
      return res.status(409).json({ error: 'No Actions left', code: 'no_actions_left' });
    const data = JSON.parse(row.data || '{}');
    // a ranged weapon fires one of the chosen Ammunition (from the Hotlist)
    const ammoId = b.ammoItemId ? String(b.ammoItemId) : '';
    const ammo = ammoId ? (data.inventory || []).find((x) => x && x.id === ammoId) : null;
    if (
      ammoId &&
      (!ammo || ammo.type !== 'ammunition' || int(ammo.qty, 0) <= 0 || !(data.hotSlots || []).includes(ammoId))
    )
      return res.status(409).json({ error: 'No ammunition', code: 'no_ammo' });
    // a hand-to-hand Damage Effect added to this Attack Skill (Iron Punch on Pugilism…), checked against the sheet
    const label = clip(b.label, 60) || 'Attack';
    let effect = null;
    let effSkill = null;
    if (b.effect) {
      // Ranks from equipped gear count
      const skills = effectiveSkills(data.skills, data.inventory);
      const attackSkill = findSkill(skills, label);
      effSkill = effectsFor(skills, attackSkill).find(
        (x) => String(x.name).trim().toLowerCase() === String(b.effect).trim().toLowerCase(),
      );
      if (!effSkill || opps.length > 1)
        return res
          .status(409)
          .json({ error: 'That Damage Effect does not go with this attack', code: 'effect_not_allowed' });
      const spec = effectSpec(effSkill, {
        targetPct: pct(opps[0]),
        sameSize: b.effectOpts?.sameSize === undefined ? undefined : !!b.effectOpts.sameSize,
        stunInstead: !!b.effectOpts?.stunInstead,
        now: gameNow(),
        readyAt: int(effSkill.readyAt, 0),
        usedThisRound: (enc.smush || {})[cid] === enc.round,
      });
      if (!spec.usable)
        return res.status(409).json({ error: 'Damage Effect not available', code: `effect_${spec.why}` });
      effect = {
        name: spec.name,
        add: spec.add,
        flat: spec.flat,
        rankDice: effectRankDice(spec),
        multBase: spec.multBase,
        multTotal: spec.multTotal,
        atOrBelow: spec.atOrBelow,
        addStr: spec.addStr,
        strMod: Math.max(-5, Math.min(30, int(b.strMod, 0))),
        debuffs: spec.debuffs,
        stunInstead: spec.stunInstead,
        note: spec.note,
        tossFeet: spec.tossFeet,
      };
      if (spec.oncePerRound) enc.smush = { ...(enc.smush || {}), [cid]: enc.round };
      if (spec.cooldownHours) effect.readyAt = gameNow() + spec.cooldownHours;
    }
    a.used.push('attack');
    const r = rollDice(expr);
    // Debuffs that last one roll go (Stunned, Queasy, Staggered's next Attack)
    const usedUp = usedUpBy(data.debuffList, 'attack');
    if (usedUp.length)
      changeSheet(cid, (sheet) => ({ ...sheet, debuffList: dropDebuffs(sheet.debuffList, usedUp) }), req.user.id);
    const name = clip(data.name) || '?';
    const area = opps.length > 1;
    const group = area ? enc.seq + 1 : null;
    const records = opps.map((o) => {
      const dc = resolveNum(o.evade, enc.floor);
      const degree = degreeOf(r.total, r.natural, dc);
      enc.seq += 1;
      return {
        id: enc.seq,
        round: enc.round,
        characterId: cid,
        charName: name,
        opponentId: o.id,
        opponentName: o.name,
        label,
        total: r.total,
        natural: r.natural,
        dc,
        degree,
        hit: hitOf(degree, dc),
        group,
        damageExpr: dmg || null,
        ...(dmgRank ? { damageRank: dmgRank } : {}),
        damage: null,
        applied: null,
        ...(effect ? { effect } : {}),
      };
    });
    // the Ammunition it used comes back if the GM undoes the attack
    if (ammo)
      records[0].ammo = {
        item: ammo,
        index: data.inventory.indexOf(ammo),
        slot: (data.hotSlots || []).indexOf(ammo.id),
      };
    enc.attacks = [...(enc.attacks || []), ...records];
    // which attack each crawler uses, for the AI Favor of "wimpy" attacks at the end of the fight (an attack with a
    // Damage Effect doesn't earn it: "only if no Damage Effect is used")
    if (effect) tallyAttack(enc, cid, `${label} + ${effect.name}`, null, 1);
    else tallyAttack(enc, cid, label, data, 1);
    const shown = opps.map((o) => (o.hidden ? '???' : o.name)).join(', ');
    const posted = live.postRoll({
      userId: req.user.id,
      characterId: cid,
      charName: name,
      roll: {
        ...r,
        label:
          `${label}${effect ? ` + ${effect.name}` : ''}${b.aimed ? ' 🎯' : ''}${area ? ' (Area)' : ''} → ${shown}`.slice(
            0,
            120,
          ),
        vs: area
          ? { dc: null, success: null, kind: 'attack' }
          : { dc: null, success: records[0].hit, kind: 'attack', degree: records[0].degree },
      },
      gmOnly: opps.some((o) => o.hidden),
    });
    for (const x of records) x.messageId = posted?.id ?? null;
    // an Advantage earned against one of these Mobs is used up by this attack
    const hitIds = new Set(opps.map((o) => o.id));
    changeSheet(
      cid,
      (d0) => {
        let d = d0;
        if (Array.isArray(d.effects) && d.effects.some((e) => e.kind === 'advantage' && hitIds.has(e.vsOpponent)))
          d = { ...d, effects: d.effects.filter((e) => !(e.kind === 'advantage' && hitIds.has(e.vsOpponent))) };
        const spent = ammoId ? spendOne(d.inventory || [], d.hotSlots || [], ammoId) : null;
        if (spent) d = { ...d, inventory: spent.inventory, hotSlots: spent.hotSlots };
        // a Damage Effect with a cooldown (Powerful Strike) waits on the game clock
        if (effect?.readyAt !== undefined)
          d = {
            ...d,
            skills: (d.skills || []).map((x) =>
              x?.name === effSkill.name ? { ...x, readyAt: String(effect.readyAt) } : x,
            ),
          };
        return d;
      },
      req.user.id,
    );
    putEnc(enc);
    res.status(201).json(viewFor(enc, admin));
  });

  // GM: hand out (or skip) the AI Favor suggested at the end of a fight
  app.post('/api/encounter/favor-offers/:cid', auth, adminOnly, (req, res) => {
    const enc = getEnc();
    const cid = Number(req.params.cid);
    const offer = (enc.favorOffers || []).find((o) => o.characterId === cid);
    if (!offer) return res.status(404).json({ error: 'Not found', code: 'not_found' });
    enc.favorOffers = enc.favorOffers.filter((o) => o !== offer);
    const n = Math.max(0, Math.min(20, int(req.body?.n, offer.rating)));
    const row = charRow(cid);
    if (req.body?.accept && n && row) {
      const data = JSON.parse(row.data || '{}');
      const from = int(data.dr?.aiFavor, 0);
      writeSheet(row, { ...data, dr: { ...(data.dr || {}), aiFavor: String(from + n) } }, req.user.id);
      progressEvent(row, data, {
        type: 'favor',
        use: 'gain',
        source: 'combat',
        title: offer.attack,
        n,
        from,
        to: from + n,
      });
    }
    putEnc(enc);
    res.json(viewFor(enc, true));
  });

  // GM: undo a crawler's attack (e.g. wrong target); its Action is given back
  app.delete('/api/encounter/attacks/:id', auth, adminOnly, (req, res) => {
    const enc = getEnc();
    const atk = findAttack(enc, req.params.id);
    if (!atk) return res.status(404).json({ error: 'Not found', code: 'not_found' });
    // an undone attack doesn't count for AI Favor (an Area Attack is one roll, so one tally)
    tallyAttack(enc, atk.characterId, atk.effect ? `${atk.label} + ${atk.effect.name}` : atk.label, null, -1);
    // an Area Attack is one roll (and one Action) against several opponents: undo all of it
    const removed = enc.attacks.filter((x) => x === atk || (atk.group && x.group === atk.group));
    enc.attacks = enc.attacks.filter((x) => !removed.includes(x));
    const shot = removed.find((x) => x.ammo)?.ammo;
    if (shot) changeSheet(atk.characterId, (d) => restoreItem(d, shot), req.user.id);
    const a = actionsOf(enc, atk.characterId);
    const i = a.used.lastIndexOf('attack');
    if (i >= 0) a.used.splice(i, 1);
    putEnc(enc);
    res.json(viewFor(enc, true));
  });

  // the attacker rolls damage for a hit (or the GM does, e.g. when the hit was a GM call)
  app.post('/api/encounter/attacks/:id/damage', auth, (req, res) => {
    const enc = getEnc();
    const atk = findAttack(enc, req.params.id);
    const admin = !!req.user.is_admin;
    const row = atk && charRow(atk.characterId);
    if (!atk || !row || (row.owner_id !== req.user.id && !admin))
      return res.status(404).json({ error: 'Not found', code: 'not_found' });
    if (atk.hit === false && !admin)
      return res.status(409).json({ error: 'That attack missed', code: 'attack_missed' });
    if (atk.damage && !admin) return res.status(409).json({ error: 'Already rolled', code: 'already_rolled' });
    const fx = atk.effect || null;
    // Damage Effect: extra base dice (doubled on a Critical Hit with the rest of the base damage), then Rank dice
    const base = withEffectDice(
      String(req.body?.expr ?? atk.damageExpr ?? '').replace(/\s+/g, ''),
      fx,
      fx?.addStr ? fx.strMod : 0,
    );
    // Critical Hit (Natural 20): twice the damage dice. Amazing Success: + Floor damage (per target)
    const crit = atk.degree === 'crit';
    const doubled = crit ? doubleDice(base) : base;
    // Rank dice (the Damage Effect's and the Attack Skill's upgrades) are added after the doubling
    const extra = [fx?.rankDice, req.body?.expr ? '' : atk.damageRank].filter(Boolean).join('+');
    const expr = fx?.stunInstead ? '0' : extra && doubled ? `${doubled}+${extra}` : doubled;
    const r = expr ? rollDice(expr) : null;
    if (!r) return res.status(400).json({ error: 'Invalid dice', code: 'bad_dice' });
    // Powerful Strike: the base damage dice result × its Rank, then the modifiers
    // (only the base damage dice: the Rank dice added after them aren't multiplied)
    const rolled = multiplyBaseDice(r, fx?.multBase ?? 1, parseDice(doubled)?.length ?? 0);
    const same = atk.group ? enc.attacks.filter((x) => x.group === atk.group && x.round === enc.round) : [atk];
    const parts = [];
    for (const x of same) {
      if (x !== atk && (x.hit === false || x.damage)) continue;
      const bonus = x.degree === 'amazing' ? enc.floor : 0;
      const ox = enc.opponents.find((o) => o.id === x.opponentId);
      // Choke Out / Smush: × the total when the target is weak enough
      const mult = fx && ox && multApplies(fx, pct(ox)) ? fx.multTotal : 1;
      x.damage = {
        total: (rolled + bonus) * mult,
        expr,
        ...(crit ? { crit: true } : {}),
        ...(bonus ? { amazing: bonus } : {}),
        ...(fx ? { effect: fx.name, debuffs: fx.debuffs || [] } : {}),
        ...(fx?.multBase > 1 ? { multBase: fx.multBase } : {}),
        ...(mult > 1 ? { mult } : {}),
        ...(fx?.stunInstead ? { stunInstead: true } : {}),
      };
      parts.push(`${ox?.hidden ? '???' : x.opponentName}${bonus ? ` +${bonus}` : ''}${mult > 1 ? ` ×${mult}` : ''}`);
    }
    const hidden = same.some((x) => enc.opponents.find((o) => o.id === x.opponentId)?.hidden);
    live.postRoll({
      userId: req.user.id,
      characterId: atk.characterId,
      charName: atk.charName,
      roll: {
        ...r,
        label:
          `${atk.label}${fx ? ` + ${fx.name}` : ''}${fx?.multBase > 1 ? ` (base ×${fx.multBase})` : ''} · ${crit ? 'CRIT ' : ''}${fx?.stunInstead ? 'Stunned instead of damage' : 'damage'} → ${parts.join(', ')}`.slice(
            0,
            120,
          ),
      },
      gmOnly: hidden,
    });
    putEnc(enc);
    res.json(viewFor(enc, admin));
  });

  // GM: apply a hit's damage to the opponent (its DR first), or call a hit/miss the server couldn't decide
  app.post('/api/encounter/attacks/:id/apply', auth, adminOnly, (req, res) => {
    const enc = getEnc();
    const atk = findAttack(enc, req.params.id);
    if (!atk) return res.status(404).json({ error: 'Not found', code: 'not_found' });
    if (typeof req.body?.hit === 'boolean') atk.hit = req.body.hit;
    else {
      const o = enc.opponents.find((x) => x.id === atk.opponentId);
      if (!o || !atk.damage || atk.applied)
        return res.status(409).json({ error: 'Nothing to apply', code: 'bad_request' });
      const before = o.lost;
      const r = damageOpponent(enc, o, atk.damage.total);
      atk.applied = { slots: r.slots, damage: r.damage };
      opponentEvent(o, before, `${atk.charName} – ${atk.label} (${r.detail})`);
    }
    putEnc(enc);
    res.json(viewFor(enc, true));
  });

  /* ---------------- level-ups & skill advancement (GM only) ---------------- */
  const charRow = (id) =>
    db
      .prepare(
        `SELECT c.*, u.username AS owner_name FROM characters c JOIN users u ON u.id = c.owner_id WHERE c.id = ?`,
      )
      .get(id);

  /** Write a sheet changed by a GM action, bypassing the lock, and tell everyone who needs to know. */
  function writeSheet(row, next, actorId) {
    db.prepare(`UPDATE characters SET data = ?, version = version + 1, updated_at = datetime('now') WHERE id = ?`).run(
      JSON.stringify(next),
      row.id,
    );
    live.characterChanged(row, JSON.parse(row.data || '{}'), next, { version: row.version + 1, actorId });
  }
  /** Like writeSheet, with the sources of HP/mana changes for the event log. */
  function writeSheetWith(row, next, actorId, sources) {
    db.prepare(`UPDATE characters SET data = ?, version = version + 1, updated_at = datetime('now') WHERE id = ?`).run(
      JSON.stringify(next),
      row.id,
    );
    live.characterChanged(row, JSON.parse(row.data || '{}'), next, { version: row.version + 1, actorId, sources });
  }
  const progressEvent = (row, data, event) =>
    live.postEvent({
      ownerId: row.owner_id,
      characterId: row.id,
      charName: clip(data.name),
      event,
      gmOnly: !row.party_since,
    });

  function applyProgress(row, body) {
    let data = JSON.parse(row.data || '{}');
    const type = body.type;
    let r;
    if (type === 'twoHours') r = levelUp(data, 1, 'twoHours');
    else if (type === 'quest') r = levelUp(data, Math.min(50, Math.max(1, int(body.levels, 1))), 'quest');
    else if (type === 'boss') {
      const tier = BOSS_LEVELS[body.tier] ? body.tier : 'neighborhood';
      r = levelUp(data, BOSS_LEVELS[tier], 'boss', tier);
    } else if (type === 'kill') {
      const d6 = rollDie(6);
      const n = crawlerKillLevels(data.level, body.victimLevel, d6);
      r = levelUp(data, n, 'kill', `d6 ${d6}, victim Lvl ${int(body.victimLevel)}`);
    } else if (type === 'grind') {
      const g = addGrindHours(data, int(body.hours));
      if (!g.leveled) {
        writeSheet(row, g.data, null);
        progressEvent(row, g.data, { type: 'grind', hours: int(body.hours), total: g.total, level: int(data.level) });
        return g.data;
      }
      r = g;
    } else if (type === 'levels') {
      r = levelUp(data, Math.min(50, Math.max(1, int(body.levels, 1))), 'manual');
    } else return null;
    data = r.data;
    writeSheet(row, data, null);
    progressEvent(row, data, { type: 'level', ...r.entry });
    return data;
  }

  function applyAdvance(row, mode) {
    const data = JSON.parse(row.data || '{}');
    const { data: next, results } = advanceSkills(data, mode === 'floor' ? 'floor' : 'session');
    if (results.length) writeSheet(row, next, null);
    progressEvent(row, next, { type: 'advance', mode: mode === 'floor' ? 'floor' : 'session', results });
    return { data: next, results };
  }

  app.post('/api/characters/:id/progress', auth, adminOnly, loadChar, (req, res) => {
    const data = applyProgress(req.char, req.body || {});
    if (!data) return res.status(400).json({ error: 'Unknown level-up type', code: 'bad_request' });
    res.json({ data, version: charRow(req.char.id).version });
  });

  app.post('/api/characters/:id/advance', auth, adminOnly, loadChar, (req, res) => {
    const { data, results } = applyAdvance(req.char, req.body?.mode);
    res.json({ data, results, version: charRow(req.char.id).version });
  });

  // "2 hours of play": every party member gains a Level and rolls their 2-hour Skill Advancement
  app.post('/api/party/two-hours', auth, adminOnly, (req, res) => {
    const ids = db
      .prepare('SELECT id FROM characters WHERE party_since IS NOT NULL ORDER BY party_since')
      .all()
      .map((r) => r.id);
    const out = [];
    for (const id of ids) {
      applyProgress(charRow(id), { type: 'twoHours' });
      const { results } = req.body?.advance === false ? { results: [] } : applyAdvance(charRow(id), 'session');
      out.push({ id, results });
    }
    hooks.onTimePassed?.(2);
    res.json({ members: out });
  });

  /** World Stats changed the Floor: the fight follows, and (optionally) every party sheet's Floor field. */
  function setFloor(floor, syncParty) {
    const enc = getEnc();
    if (enc.floor !== floor) {
      enc.floor = floor;
      putEnc(enc);
    }
    if (!syncParty) return;
    for (const { id } of db.prepare('SELECT id FROM characters WHERE party_since IS NOT NULL').all()) {
      const row = charRow(id);
      const data = JSON.parse(row.data || '{}');
      if (String(data.floor ?? '') !== String(floor)) writeSheet(row, { ...data, floor: String(floor) }, null);
    }
  }
  return { setFloor };
}
