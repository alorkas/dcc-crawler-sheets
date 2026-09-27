// GM tools: NPC stat blocks, the combat tracker, and level-ups / skill advancement.
import { BOOK_NPCS } from './catalog/npcs.js';
import { BOSS_LEVELS, addGrindHours, advanceSkills, crawlerKillLevels, levelUp, rollDie } from './progress.js';

const PHASES = 5; // Mob Action Declaration, Crawler Reaction, Mob Attack Resolution, Crawler Action, Clean Up
const OPP_KINDS = ['mob', 'elite', 'boss', 'npc', 'crawler'];
const int = (v, d = 0) => {
  const n = parseInt(String(v ?? '').replace(/[^\d-]/g, ''), 10);
  return Number.isFinite(n) ? n : d;
};
/** "11+F" → 11 + floor. */
const withFloor = (v, floor) => {
  const s = String(v ?? '');
  return int(s) + (/\+\s*F\b/i.test(s) ? floor : 0);
};
const clip = (v, n = 80) => String(v ?? '').slice(0, n);

export function mountGame(app, { db, auth, adminOnly, loadChar, live }) {
  /* ---------------- NPC stat blocks (GM only) ---------------- */
  const toNpc = (r) => ({ id: r.id, data: JSON.parse(r.data || '{}'), updatedAt: r.updated_at });

  app.get('/api/npcs', auth, adminOnly, (_req, res) => {
    res.json(db.prepare('SELECT * FROM npcs ORDER BY updated_at DESC').all().map(toNpc));
  });
  app.post('/api/npcs', auth, adminOnly, (req, res) => {
    const data = req.body?.data && typeof req.body.data === 'object' ? req.body.data : {};
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
  const EMPTY = { active: false, round: 0, phase: 1, floor: 1, opponents: [], seq: 0 };
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
  /** Players see names and a Health percentage (the book's "let the players know what percentage…"). */
  const viewFor = (enc, admin) => ({
    active: enc.active,
    round: enc.round,
    phase: enc.phase,
    floor: enc.floor,
    opponents: enc.opponents
      .filter((o) => admin || !o.hidden)
      .map((o) =>
        admin
          ? { ...o, pct: pct(o), defeated: o.lost >= o.slots }
          : { id: o.id, name: o.name, kind: o.kind, pct: pct(o), defeated: o.lost >= o.slots },
      ),
  });
  const combatEvent = (event, gmOnly = false) => live.postEvent({ event: { type: 'combat', ...event }, gmOnly });

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
      combatEvent({ action: 'start', round: enc.round });
    } else if (action === 'next' && enc.active) {
      if (enc.round === 0 || enc.phase >= PHASES) {
        enc.round += 1;
        enc.phase = 1;
        combatEvent({ action: 'round', round: enc.round });
      } else enc.phase += 1;
    } else if (action === 'prev' && enc.active) {
      if (enc.phase > 1) enc.phase -= 1;
      else if (enc.round > 1) {
        enc.round -= 1;
        enc.phase = PHASES;
      }
    } else if (action === 'end' && enc.active) {
      combatEvent({ action: 'end', round: enc.round });
      enc.active = false;
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
      };
    }
    const count = Math.min(20, Math.max(1, int(b.count, 1)));
    const existing = enc.opponents.filter((o) => o.name.replace(/ \d+$/, '') === base.name).length;
    for (let i = 0; i < count; i++) {
      enc.seq += 1;
      const numbered = count > 1 || existing > 0 ? `${base.name} ${existing + i + 1}` : base.name;
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
