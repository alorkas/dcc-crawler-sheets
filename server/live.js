// Party dashboard, shared roll log / chat, and the Server-Sent Events stream that keeps them live.
import { rollDice } from './dice.js';

const MAX_TEXT = 1000;
const KEEP_MESSAGES = 2000;

/** The part of a sheet the party panel needs. Mana is only shared with the owner and the GM. */
export function partyView(data, withMana) {
  const d = data || {};
  const stats = {};
  for (const k of ['str', 'int', 'con', 'dex', 'cha']) {
    const s = d.stats?.[k] || {};
    stats[k] = { enhanced: s.enhanced ?? '', unenhanced: s.unenhanced ?? '', mod: s.mod ?? '' };
  }
  const view = {
    schema: d.schema,
    name: d.name ?? '',
    race: d.race ?? '',
    class: d.class ?? '',
    level: d.level ?? '',
    hbLost: d.hbLost ?? 0,
    dyingRounds: d.dyingRounds ?? '',
    debuffList: Array.isArray(d.debuffList) ? d.debuffList : [],
    stats,
  };
  if (withMana) Object.assign(view, { manaMax: d.manaMax ?? '', manaCurrent: d.manaCurrent ?? '' });
  return view;
}

export function mountLive(app, { db, auth, adminOnly, loadChar }) {
  /* ---------------- event stream ---------------- */
  const clients = new Set(); // { res, user }

  app.get('/api/events', auth, (req, res) => {
    res.set({
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    });
    res.flushHeaders();
    res.write('retry: 3000\n\n');
    const client = { res, user: req.user };
    clients.add(client);
    const ping = setInterval(() => res.write(': ping\n\n'), 25000);
    req.on('close', () => {
      clearInterval(ping);
      clients.delete(client);
    });
  });

  function send(event, payload, filter = () => true) {
    const msg = `event: ${event}\ndata: ${JSON.stringify(payload)}\n\n`;
    for (const c of clients) if (filter(c.user)) c.res.write(msg);
  }

  /* ---------------- party ---------------- */
  const partyRows = db.prepare(
    `SELECT c.id, c.owner_id, c.data, u.username AS owner_name FROM characters c
     JOIN users u ON u.id = c.owner_id WHERE c.party_since IS NOT NULL ORDER BY c.party_since, c.id`,
  );

  app.get('/api/party', auth, (req, res) => {
    const rows = partyRows.all();
    res.json(
      rows.map((r) => {
        const mine = r.owner_id === req.user.id;
        return {
          id: r.id,
          ownerId: r.owner_id,
          ownerName: r.owner_name,
          mine,
          view: partyView(JSON.parse(r.data || '{}'), mine || !!req.user.is_admin),
        };
      }),
    );
  });

  app.patch('/api/characters/:id/party', auth, adminOnly, loadChar, (req, res) => {
    const inParty = !!req.body?.inParty;
    db.prepare(
      `UPDATE characters SET party_since = CASE WHEN ? THEN COALESCE(party_since, strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) ELSE NULL END WHERE id = ?`,
    ).run(inParty ? 1 : 0, req.char.id);
    send('party', {});
    res.json({ id: req.char.id, inParty });
  });

  /** Call after a character was saved or deleted: tells clients to refresh the party when it matters. */
  function characterChanged(row, oldData, newData) {
    if (!row?.party_since) return;
    const a = JSON.stringify(partyView(oldData, true));
    const b = newData === null ? '' : JSON.stringify(partyView(newData, true));
    if (a !== b) send('party', {});
  }

  /* ---------------- messages ---------------- */
  const visible = (user, m) => !m.gm_only || user.is_admin || m.user_id === user.id;
  const toMessage = (m) => ({
    id: m.id,
    kind: m.kind,
    text: m.text,
    roll: m.roll ? JSON.parse(m.roll) : null,
    gmOnly: !!m.gm_only,
    userId: m.user_id,
    userName: m.username,
    isAdmin: !!m.is_admin,
    characterId: m.character_id,
    characterName: m.char_name,
    createdAt: m.created_at,
  });
  const msgById = db.prepare(
    `SELECT m.*, u.username, u.is_admin FROM messages m JOIN users u ON u.id = m.user_id WHERE m.id = ?`,
  );

  app.get('/api/messages', auth, (req, res) => {
    const limit = Math.min(Math.max(Number(req.query.limit) || 200, 1), 500);
    const rows = db
      .prepare(
        `SELECT m.*, u.username, u.is_admin FROM messages m JOIN users u ON u.id = m.user_id
         WHERE (m.gm_only = 0 OR ? OR m.user_id = ?) ORDER BY m.id DESC LIMIT ?`,
      )
      .all(req.user.is_admin ? 1 : 0, req.user.id, limit);
    res.json(rows.reverse().map(toMessage));
  });

  // simple flood protection: 30 messages per 30 seconds per user
  const recent = new Map();
  const flooding = (uid) => {
    const now = Date.now();
    const list = (recent.get(uid) || []).filter((t) => now - t < 30000);
    list.push(now);
    recent.set(uid, list);
    return list.length > 30;
  };

  app.post('/api/messages', auth, (req, res) => {
    const body = req.body || {};
    if (flooding(req.user.id)) return res.status(429).json({ error: 'Slow down', code: 'too_many_messages' });

    // who is speaking: a character you own (the GM can speak as any character), or yourself
    let characterId = null;
    let charName = '';
    if (body.characterId) {
      const c = db.prepare('SELECT id, owner_id, data FROM characters WHERE id = ?').get(Number(body.characterId));
      if (!c || (c.owner_id !== req.user.id && !req.user.is_admin)) {
        return res.status(404).json({ error: 'Character not found', code: 'char_not_found' });
      }
      characterId = c.id;
      charName = String(JSON.parse(c.data || '{}').name || '').slice(0, 80);
    }

    let text = String(body.text ?? '')
      .trim()
      .slice(0, MAX_TEXT);
    let expr = body.roll?.expr;
    let label = String(body.roll?.label ?? '').slice(0, 120);
    const cmd = text.match(/^\/(?:r|roll)\s+(\S.*?)(?:\s+#\s*(.*))?$/i);
    if (cmd) {
      expr = cmd[1];
      label = (cmd[2] || '').slice(0, 120);
      text = '';
    }

    let kind = 'chat';
    let roll = null;
    if (expr !== undefined) {
      const r = rollDice(expr);
      if (!r) return res.status(400).json({ error: 'Invalid dice expression', code: 'bad_dice' });
      kind = 'roll';
      roll = { ...r, label };
    } else if (!text) {
      return res.status(400).json({ error: 'Empty message', code: 'empty_message' });
    }

    const r = db
      .prepare(
        'INSERT INTO messages (user_id, character_id, char_name, kind, text, roll, gm_only) VALUES (?, ?, ?, ?, ?, ?, ?)',
      )
      .run(req.user.id, characterId, charName, kind, text, roll ? JSON.stringify(roll) : null, body.gmOnly ? 1 : 0);
    db.prepare('DELETE FROM messages WHERE id <= ?').run(Number(r.lastInsertRowid) - KEEP_MESSAGES);
    const row = msgById.get(r.lastInsertRowid);
    const message = toMessage(row);
    send('message', message, (u) => visible(u, row));
    res.status(201).json(message);
  });

  app.delete('/api/messages', auth, adminOnly, (_req, res) => {
    db.prepare('DELETE FROM messages').run();
    send('clear', {});
    res.json({ ok: true });
  });

  return { characterChanged };
}
