// GM tools: NPC stat blocks, the combat tracker, and level-ups / skill advancement.
import { BOOK_NPCS } from './catalog/npcs.js';
import { rollDice } from './dice.js';
import { damageDice, resolveNum } from '../shared/formula.js';
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

export function mountGame(app, { db, auth, adminOnly, loadChar, live }) {
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
    for (const n of BOOK_NPCS) {
      const old = have.get(`${n.name}|${n.source}`);
      if (!old) {
        insert.run(JSON.stringify(n));
        added++;
        continue;
      }
      // already imported: only refresh how it's sorted (type and Floor), never the stats you may have edited
      if (old.d.kind !== n.kind || old.d.floor !== n.floor || old.d.chapter !== n.chapter) {
        update.run(JSON.stringify({ ...old.d, kind: n.kind, floor: n.floor, chapter: n.chapter }), old.id);
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

  /* ---------------- combat tracker ---------------- */
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
      targets: d.targets,
      damage: d.damage,
    };
  };
  /** Attacks of an opponent: from its stat block as it is now (so edits count), else the copy made when added. */
  const attackSource = () => {
    const cache = new Map();
    return (o) => {
      if (!o.npcId) return { attacks: o.attacks || [], mods: o.mods || {} };
      if (!cache.has(o.npcId)) {
        const row = db.prepare('SELECT data FROM npcs WHERE id = ?').get(o.npcId);
        cache.set(o.npcId, row ? npcCombat(JSON.parse(row.data || '{}')) : null);
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
  /** Players see names and a Health percentage (the book's "let the players know what percentage…"). */
  const viewFor = (enc, admin, src = attackSource()) => ({
    actions: enc.active ? actionsView(enc) : {},
    active: enc.active,
    round: enc.round,
    phase: enc.phase,
    floor: enc.floor,
    declarations: (enc.declarations || [])
      .filter((d) => d.round === enc.round && (admin || revealed(enc)))
      .map((d) => declView(enc, d, admin)),
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
      targets: d.targets.map((t) => ({ id: t.id, name: t.name })),
    };
  };
  /** Moving to Crawler Reaction: post all of this round's declarations to the log at once. */
  function revealDeclarations(enc) {
    const list = (enc.declarations || []).filter((d) => d.round === enc.round && !d.posted);
    for (const d of list) d.posted = true;
    if (list.length)
      live.postEvent({ event: { type: 'declare', round: enc.round, items: list.map((d) => declItem(enc, d)) } });
  }

  app.get('/api/encounter', auth, (req, res) => res.json(viewFor(getEnc(), !!req.user.is_admin)));

  app.post('/api/encounter', auth, adminOnly, (req, res) => {
    const enc = getEnc();
    const action = req.body?.action;
    if (action === 'start') {
      enc.active = true;
      enc.round = req.body?.surprise ? 0 : 1; // round 0 = the crawlers' surprise round
      enc.phase = 1;
      if (req.body?.floor !== undefined) enc.floor = Math.max(1, int(req.body.floor, 1));
      else {
        // default: the deepest Floor among the party members
        const floors = db
          .prepare('SELECT data FROM characters WHERE party_since IS NOT NULL')
          .all()
          .map((r) => int(JSON.parse(r.data || '{}').floor, 0));
        enc.floor = Math.max(1, ...floors);
      }
      enc.declarations = [];
      enc.actions = {};
      combatEvent({ action: 'start', round: enc.round });
    } else if (action === 'next' && enc.active) {
      if (enc.round === 0 || enc.phase >= PHASES) {
        enc.round += 1;
        enc.phase = 1;
        enc.declarations = []; // a new round: the Mobs declare again
        enc.actions = {}; // …and every crawler has 2 Actions again
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
      enc.active = false;
      enc.declarations = [];
      enc.actions = {};
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
        name: clip(n.name) || '?',
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

  app.patch('/api/encounter/opponents/:oid', auth, adminOnly, (req, res) => {
    const enc = getEnc();
    const o = enc.opponents.find((x) => x.id === Number(req.params.oid));
    if (!o) return res.status(404).json({ error: 'Not found', code: 'not_found' });
    const b = req.body || {};
    const before = o.lost;
    let detail = '';
    if (b.damage !== undefined) {
      // DR first, then each full slot's worth of damage removes a slot
      const dr = withFloor(o.dr, enc.floor);
      const eff = Math.max(0, int(b.damage) - dr);
      const slots = eff >= o.slotValue ? Math.floor(eff / o.slotValue) : 0;
      o.lost = Math.min(o.slots, o.lost + slots);
      detail = `${int(b.damage)}${dr ? ` − ${dr} DR` : ''}`;
    }
    if (b.lost !== undefined) o.lost = Math.min(o.slots, Math.max(0, int(b.lost)));
    if (b.hidden !== undefined) o.hidden = !!b.hidden;
    if (b.name !== undefined) o.name = clip(b.name) || o.name;
    if (o.lost !== before) {
      live.postEvent({
        event: {
          type: 'opponent',
          name: o.name,
          from: Math.round(((o.slots - before) / o.slots) * 100),
          to: pct(o),
          defeated: o.lost >= o.slots,
          source: clip(b.source) || detail,
        },
        gmOnly: o.hidden,
      });
    }
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
      targets: ids.map((id) => ({ id, name: party.get(id), evade: null, applied: null })),
      damage: null,
    };
    enc.declarations = [...(enc.declarations || []), d];
    // declared late (after the reveal): post it right away
    if (revealed(enc)) revealDeclarations(enc);
    putEnc(enc);
    res.status(201).json(viewFor(enc, true));
  });

  const findDecl = (enc, did) => (enc.declarations || []).find((d) => d.id === Number(did));

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
    if (reroll) {
      const e = target.evade;
      if (!e || e.success !== false || e.natural === 1 || e.rerolled)
        return res.status(409).json({ error: 'Nothing to reroll', code: 'no_reroll' });
      if (!spendFavor(target.id, 'reroll', req.user.id))
        return res.status(409).json({ error: 'No AI Favor left', code: 'no_ai_favor' });
    } else {
      if (target.evade && !admin) return res.status(409).json({ error: 'Already rolled', code: 'already_rolled' });
      if (!acts.used.includes('evade')) {
        if (acts.used.length >= ACTIONS + (acts.extra ? 1 : 0) && !admin)
          return res.status(409).json({ error: 'No Actions left', code: 'no_actions_left' });
        acts.used.push('evade');
      }
    }
    const r = rollDice(expr);
    const success = d.dc === null ? null : r.total >= d.dc;
    const first = reroll ? target.evade.total : undefined;
    target.evade = { total: r.total, natural: r.natural, success, ...(reroll ? { rerolled: true, first } : {}) };
    const o = enc.opponents.find((x) => x.id === d.opponentId);
    live.postRoll({
      userId: req.user.id,
      characterId: target.id,
      charName: target.name,
      roll: {
        ...r,
        label: `${reroll ? 'Evade reroll (AI Favor)' : 'Evade'} · ${o?.hidden ? '???' : d.opponentName} – ${d.attack.name}`,
        vs: { dc: d.dc, success },
      },
    });
    putEnc(enc);
    res.json(viewFor(enc, admin));
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
      a.used.push(req.body?.kind === 'interrupt' ? 'interrupt' : 'action');
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
    if (b.evade === null) target.evade = null;
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
    res.json({ members: out });
  });
}
