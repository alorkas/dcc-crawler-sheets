// Quests: the System AI hands out quests (the GM writes them: title, who gives it, Floor, objectives, reward and
// what happens if it fails) to one or more crawlers or the whole party. Crawlers can't turn them down. The GM marks
// a quest completed or failed. On completion the reward is given at once: the Levels go straight onto the sheet
// (Core Rulebook: quests give Levels) and the loot boxes wait, sealed, until the crawler is in a Saferoom.
import { addItems, ensureIds } from '../shared/items.js';
import { cleanReward, fromBook, hideBoxCurses } from './rewards.js';
import { levelUp } from './progress.js';
import { inSaferoom } from './world.js';

export const QUEST_STATUSES = ['active', 'completed', 'failed'];
const clip = (v, n = 200) => String(v ?? '').slice(0, n);
const int = (v, d = 0) => {
  const n = parseInt(String(v ?? '').replace(/[^\d-]/g, ''), 10);
  return Number.isFinite(n) ? n : d;
};
const newId = () => `o${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
const boxInfo = (boxes) => (boxes || []).map(({ tier, kind, label }) => ({ tier, kind, label }));

/** A quest as the GM writes it (validated). */
export function cleanQuest(body) {
  const b = body && typeof body === 'object' ? body : {};
  const objectives = (Array.isArray(b.objectives) ? b.objectives : [])
    .slice(0, 30)
    .map((o) => ({ id: clip(o?.id, 40) || newId(), text: clip(o?.text, 300).trim(), done: !!o?.done }))
    .filter((o) => o.text);
  const reward = cleanReward(b.reward);
  return {
    title: clip(b.title, 120).trim(),
    description: clip(b.description, 4000),
    giver: clip(b.giver, 120).trim(),
    floor: Math.max(0, Math.min(18, int(b.floor, 0))),
    objectives,
    reward: { ...reward, levels: Math.max(0, Math.min(20, int(b.reward?.levels, 0))) },
    penalty: clip(b.penalty, 2000),
    status: QUEST_STATUSES.includes(b.status) ? b.status : 'active',
    hidden: !!b.hidden,
  };
}
const hasReward = (r) => !!(r && (r.boxes?.length || r.note || r.levels));

export function mountQuests(app, { db, auth, adminOnly, loadChar, live }) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS quests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      data TEXT NOT NULL DEFAULT '{}',
      created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
      updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
    );
    CREATE TABLE IF NOT EXISTS quest_crawlers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      quest_id INTEGER NOT NULL REFERENCES quests(id) ON DELETE CASCADE,
      character_id INTEGER NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
      answer TEXT NOT NULL DEFAULT 'offered',
      opened TEXT,
      created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
      answered_at TEXT,
      claimed_at TEXT
    );
    CREATE INDEX IF NOT EXISTS idx_quest_crawlers_character ON quest_crawlers(character_id);
  `);
  // added later: the reward each crawler got when the quest was completed (Levels given then, boxes still sealed)
  const cols = db.prepare('PRAGMA table_info(quest_crawlers)').all();
  if (!cols.some((c) => c.name === 'granted_at')) db.exec('ALTER TABLE quest_crawlers ADD COLUMN granted_at TEXT');
  if (!cols.some((c) => c.name === 'reward')) {
    db.exec('ALTER TABLE quest_crawlers ADD COLUMN reward TEXT');
    // rewards claimed with the first version (boxes and Levels together) count as given and opened
    db.exec('UPDATE quest_crawlers SET granted_at = claimed_at, reward = opened WHERE claimed_at IS NOT NULL');
  }

  const kvGet = db.prepare(`SELECT value FROM kv WHERE key = 'rewards'`);
  const claimLocked = () => !!JSON.parse(kvGet.get()?.value || '{}').claimLocked;
  const q = {
    quest: db.prepare('SELECT * FROM quests WHERE id = ?'),
    all: db.prepare('SELECT * FROM quests ORDER BY updated_at DESC, id DESC'),
    ins: db.prepare('INSERT INTO quests (data) VALUES (?)'),
    upd: db.prepare(`UPDATE quests SET data = ?, updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE id = ?`),
    del: db.prepare('DELETE FROM quests WHERE id = ?'),
    link: db.prepare('SELECT * FROM quest_crawlers WHERE id = ?'),
    linksOf: db.prepare(
      `SELECT l.*, c.data AS cdata FROM quest_crawlers l JOIN characters c ON c.id = l.character_id
       WHERE l.quest_id = ? ORDER BY l.id`,
    ),
    questsOf: db.prepare(
      `SELECT l.*, qu.data AS qdata, qu.updated_at AS qupdated FROM quest_crawlers l JOIN quests qu ON qu.id = l.quest_id
       WHERE l.character_id = ? ORDER BY qu.updated_at DESC, l.id DESC`,
    ),
    has: db.prepare('SELECT id FROM quest_crawlers WHERE quest_id = ? AND character_id = ?'),
    insLink: db.prepare('INSERT INTO quest_crawlers (quest_id, character_id) VALUES (?, ?)'),
    delLink: db.prepare('DELETE FROM quest_crawlers WHERE id = ?'),
    grant: db.prepare(
      `UPDATE quest_crawlers SET granted_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), reward = ?,
       claimed_at = CASE WHEN ? THEN strftime('%Y-%m-%dT%H:%M:%fZ', 'now') ELSE NULL END
       WHERE id = ? AND granted_at IS NULL`,
    ),
    open: db.prepare(
      `UPDATE quest_crawlers SET claimed_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), opened = ? WHERE id = ? AND claimed_at IS NULL`,
    ),
    char: db.prepare('SELECT * FROM characters WHERE id = ?'),
    save: db.prepare(
      `UPDATE characters SET data = ?, version = version + 1, updated_at = datetime('now') WHERE id = ?`,
    ),
  };

  const charName = (row) => clip(JSON.parse(row?.data || '{}').name, 80);
  /** Tell the owners (and the GM) of these crawlers that their quests changed. */
  const notify = (charIds) => {
    const owners = new Set(charIds.map((id) => q.char.get(id)?.owner_id).filter(Boolean));
    live.send('quests', { characterIds: charIds }, (u) => u.is_admin || owners.has(u.id));
  };
  const post = (row, event) =>
    live.postEvent({
      ownerId: row.owner_id,
      characterId: row.id,
      charName: charName(row),
      event,
      gmOnly: !row.party_since,
    });
  const ids = (v) => [...new Set((Array.isArray(v) ? v : []).map(Number).filter((n) => Number.isInteger(n) && n > 0))];
  const toQuest = (r) => ({
    id: r.id,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
    penalty: '',
    ...JSON.parse(r.data || '{}'),
    crawlers: q.linksOf.all(r.id).map((l) => ({
      id: l.id,
      characterId: l.character_id,
      name: JSON.parse(l.cdata || '{}').name || '',
      grantedAt: l.granted_at,
      boxes: l.reward ? JSON.parse(l.reward).boxes?.length || 0 : 0,
      openedAt: l.granted_at && l.reward && JSON.parse(l.reward).boxes?.length ? l.claimed_at : null,
    })),
  });
  const saveChar = (row, before, data, actorId) => {
    q.save.run(JSON.stringify(data), row.id);
    live.characterChanged(row, before, data, { version: row.version + 1, actorId });
  };

  /**
   * Hand out the reward of a completed quest to one crawler, once: Levels onto the sheet now, the reward is kept
   * with the crawler (boxes sealed until a Saferoom; later edits of the quest don't change it).
   */
  const grant = (link, d, actorId) => {
    const row = q.char.get(link.character_id);
    if (!row || link.granted_at) return;
    const reward = d.reward || { boxes: [], note: '', levels: 0 };
    const noBoxes = !reward.boxes?.length;
    if (q.grant.run(JSON.stringify(reward), noBoxes ? 1 : 0, link.id).changes !== 1) return;
    let levelEntry = null;
    if (reward.levels) {
      const before = JSON.parse(row.data || '{}');
      const r = levelUp(before, reward.levels, 'quest', d.title || '');
      saveChar(row, before, r.data, actorId);
      levelEntry = r.entry;
    }
    post(row, {
      type: 'quest',
      action: 'completed',
      title: d.title || '',
      levels: reward.levels || 0,
      boxes: boxInfo(reward.boxes),
      note: reward.note || '',
    });
    if (levelEntry) post(row, { type: 'level', ...levelEntry });
  };
  const assign = (questId, data, charIds, actorId) => {
    const given = [];
    for (const cid of charIds) {
      const row = q.char.get(cid);
      if (!row || q.has.get(questId, cid)) continue;
      const r = q.insLink.run(questId, cid);
      given.push(cid);
      if (!data.hidden) post(row, { type: 'quest', action: 'offered', title: data.title });
      // added to a quest that's already done: they get the reward too
      if (data.status === 'completed') grant(q.link.get(r.lastInsertRowid), data, actorId);
    }
    if (given.length) notify(given);
    return given;
  };
  const crawlersOf = (questId) => q.linksOf.all(questId).map((l) => l.character_id);

  /* ---------- the GM ---------- */
  app.get('/api/quests', auth, adminOnly, (_req, res) => res.json(q.all.all().map(toQuest)));

  app.post('/api/quests', auth, adminOnly, (req, res) => {
    const data = cleanQuest(req.body);
    if (!data.title) return res.status(400).json({ error: 'A title is required', code: 'title_required' });
    const r = q.ins.run(JSON.stringify(data));
    assign(Number(r.lastInsertRowid), data, ids(req.body?.characterIds), req.user.id);
    res.status(201).json(toQuest(q.quest.get(r.lastInsertRowid)));
  });

  const loadQuest = (req, res, next) => {
    const row = q.quest.get(Number(req.params.id));
    if (!row) return res.status(404).json({ error: 'Not found', code: 'not_found' });
    req.quest = row;
    req.questData = JSON.parse(row.data || '{}');
    next();
  };

  // edit the quest (text, objectives, reward, status). Completing it hands out the reward; failing it announces the
  // penalty. A hidden quest that gets completed or failed becomes visible.
  app.put('/api/quests/:id', auth, adminOnly, loadQuest, (req, res) => {
    const data = cleanQuest(req.body);
    if (!data.title) return res.status(400).json({ error: 'A title is required', code: 'title_required' });
    const before = req.questData;
    const closing = before.status !== data.status && data.status !== 'active';
    if (closing) data.hidden = false;
    q.upd.run(JSON.stringify(data), req.quest.id);
    if (closing)
      for (const l of q.linksOf.all(req.quest.id)) {
        if (data.status === 'completed') grant(l, data, req.user.id);
        else {
          const row = q.char.get(l.character_id);
          if (row) post(row, { type: 'quest', action: 'failed', title: data.title, penalty: data.penalty });
        }
      }
    notify(crawlersOf(req.quest.id));
    res.json(toQuest(q.quest.get(req.quest.id)));
  });

  app.post('/api/quests/:id/crawlers', auth, adminOnly, loadQuest, (req, res) => {
    assign(req.quest.id, req.questData, ids(req.body?.characterIds), req.user.id);
    res.json(toQuest(q.quest.get(req.quest.id)));
  });

  app.delete('/api/quests/:id/crawlers/:linkId', auth, adminOnly, loadQuest, (req, res) => {
    const l = q.link.get(Number(req.params.linkId));
    if (!l || l.quest_id !== req.quest.id) return res.status(404).json({ error: 'Not found', code: 'not_found' });
    q.delLink.run(l.id);
    notify([l.character_id]);
    res.json(toQuest(q.quest.get(req.quest.id)));
  });

  app.delete('/api/quests/:id', auth, adminOnly, loadQuest, (req, res) => {
    const cids = crawlersOf(req.quest.id);
    q.del.run(req.quest.id);
    notify(cids);
    res.json({ ok: true });
  });

  /* ---------- a crawler's quests (owner and GM) ---------- */
  app.get('/api/characters/:id/quests', auth, loadChar, (req, res) => {
    const admin = !!req.user.is_admin;
    const list = q.questsOf
      .all(req.char.id)
      .map((l) => ({ l, d: JSON.parse(l.qdata || '{}') }))
      .filter(({ d }) => admin || !d.hidden)
      .map(({ l, d }) => {
        // once completed, what this crawler got; before that, what's on offer
        const reward = (l.reward ? JSON.parse(l.reward) : d.reward) || { boxes: [], note: '', levels: 0 };
        const opened = l.opened ? JSON.parse(l.opened) : null;
        return {
          linkId: l.id,
          questId: l.quest_id,
          title: d.title || '',
          description: d.description || '',
          giver: d.giver || '',
          floor: d.floor || 0,
          objectives: d.objectives || [],
          penalty: d.penalty || '',
          status: d.status || 'active',
          hidden: !!d.hidden,
          assignedAt: l.created_at,
          updatedAt: l.qupdated,
          grantedAt: l.granted_at,
          openedAt: reward.boxes?.length ? l.claimed_at : null,
          hasReward: hasReward(reward),
          // the boxes' contents stay secret until opened (the GM sees them); Levels and notes are known
          reward: admin
            ? reward
            : {
                boxes: (reward.boxes || []).map(({ tier, kind, label }) => ({ tier, kind, label, items: [] })),
                note: reward.note || '',
                levels: reward.levels || 0,
              },
          opened: admin ? opened : hideBoxCurses(opened),
        };
      });
    res.json({ claimLocked: claimLocked(), inSaferoom: inSaferoom(db, req.char), quests: list });
  });

  const loadLink = (req, res, next) => {
    const l = q.link.get(Number(req.params.linkId));
    const row = l && q.char.get(l.character_id);
    if (!l || !row || (row.owner_id !== req.user.id && !req.user.is_admin))
      return res.status(404).json({ error: 'Not found', code: 'not_found' });
    const quest = q.quest.get(l.quest_id);
    req.link = l;
    req.row = row;
    req.quest = quest;
    req.questData = JSON.parse(quest?.data || '{}');
    next();
  };

  // tick an objective (crawlers on the quest and the GM; it's shared by everyone on the quest)
  app.post('/api/quest-crawlers/:linkId/objectives/:objId', auth, loadLink, (req, res) => {
    if (req.questData.status !== 'active') return res.status(409).json({ error: 'Quest closed', code: 'quest_closed' });
    const objectives = (req.questData.objectives || []).map((o) =>
      o.id === req.params.objId ? { ...o, done: !!req.body?.done } : o,
    );
    q.upd.run(JSON.stringify({ ...req.questData, objectives }), req.quest.id);
    notify(crawlersOf(req.quest.id));
    res.json({ ok: true });
  });

  // open the loot boxes of a completed quest: once, in a Saferoom
  app.post('/api/quest-crawlers/:linkId/open', auth, loadLink, (req, res) => {
    const l = req.link;
    if (!l.granted_at)
      return res.status(409).json({ error: 'The quest is not completed', code: 'quest_not_completed' });
    const reward = JSON.parse(l.reward || '{}');
    if (!reward.boxes?.length) return res.status(400).json({ error: 'No boxes to open', code: 'no_reward' });
    if (l.claimed_at) return res.status(409).json({ error: 'Already opened', code: 'already_claimed' });
    if (!req.user.is_admin && claimLocked())
      return res.status(423).json({ error: 'The GM has locked reward claiming', code: 'claim_locked' });
    if (!req.user.is_admin && !inSaferoom(db, req.row))
      return res.status(423).json({ error: 'Loot boxes can only be opened in a Saferoom', code: 'not_in_saferoom' });
    const opened = {
      boxes: reward.boxes.map((b) => ({ ...b, items: b.items.map(fromBook) })),
      note: reward.note || '',
      levels: reward.levels || 0,
    };
    if (q.open.run(JSON.stringify(opened), l.id).changes !== 1)
      return res.status(409).json({ error: 'Already opened', code: 'already_claimed' });
    const row = req.row;
    const items = opened.boxes.flatMap((b) => b.items).map(({ special, ...it }) => it); // eslint-disable-line no-unused-vars
    if (items.length) {
      const before = JSON.parse(row.data || '{}');
      const inv = ensureIds(Array.isArray(before.inventory) ? before.inventory : []);
      saveChar(row, before, { ...before, inventory: addItems(inv, items) }, req.user.id);
    }
    post(row, { type: 'quest', action: 'claimed', title: req.questData.title || '', boxes: boxInfo(opened.boxes) });
    notify([row.id]);
    res.json({ opened: req.user.is_admin ? opened : hideBoxCurses(opened) });
  });
}
