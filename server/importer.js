// Session importer (GM): load a session's prep in one go from a JSON file — achievements (not given to anyone
// yet; the GM gives them during play), quests (optionally assigned to the active party), the GM's own stat blocks,
// book stat blocks the session uses, and loot for the GM's stash. Things already there (same title or name) are
// skipped, so importing the same file twice is safe.
import { BOOK_NPCS } from './catalog/npcs.js';
import { NOTES_ES } from './catalog/npcNotesEs.js';
import { npcNameEs } from './catalog/namesEs.js';

const clip = (v, n = 200) => String(v ?? '').slice(0, n);
const list = (v, max = 100) => (Array.isArray(v) ? v.slice(0, max) : []);

export function mountImporter(app, { db, auth, adminOnly, live, rewards, quests }) {
  const npcRows = () =>
    db
      .prepare('SELECT data FROM npcs')
      .all()
      .map((r) => JSON.parse(r.data || '{}'));
  const insertNpc = db.prepare('INSERT INTO npcs (data) VALUES (?)');

  app.post('/api/admin/import', auth, adminOnly, (req, res) => {
    const b = req.body && typeof req.body === 'object' ? req.body : {};
    const out = { achievements: [0, 0], quests: [0, 0], npcs: [0, 0], bookNpcs: [0, 0], stash: 0, unknownBookNpcs: [] };
    const count = (key, added) => (out[key][added ? 0 : 1] += 1);

    // newest first on the GM page: added last-to-first so they read in the file's (scene) order
    for (const a of list(b.achievements).reverse()) count('achievements', rewards.addAchievement(a));
    for (const q of list(b.quests, 30)) count('quests', quests.addQuest(q, req.user.id));

    // the GM's own stat blocks (bosses, named NPCs): skipped when one with that name is already there
    const have = new Set(npcRows().map((d) => clip(d.name, 120).toLowerCase()));
    for (const n of list(b.npcs, 50)) {
      if (!n || typeof n !== 'object' || !clip(n.name).trim()) continue;
      const name = clip(n.name, 120).trim();
      if (have.has(name.toLowerCase())) {
        count('npcs', false);
        continue;
      }
      insertNpc.run(JSON.stringify({ ...n, name, locked: true }));
      have.add(name.toLowerCase());
      count('npcs', true);
    }

    // book stat blocks by name (the first one with that name), unless already imported
    const haveBook = new Set(npcRows().map((d) => `${d.name}|${d.source ?? ''}`));
    for (const raw of list(b.bookNpcs, 50)) {
      const book = BOOK_NPCS.find((x) => x.name.toLowerCase() === clip(raw, 120).trim().toLowerCase());
      if (!book) {
        out.unknownBookNpcs.push(clip(raw, 120));
        continue;
      }
      const { prevNotes, prevDescriptions, prevDescriptionsEs, ...n } = book; // eslint-disable-line no-unused-vars
      if (haveBook.has(`${n.name}|${n.source ?? ''}`)) {
        count('bookNpcs', false);
        continue;
      }
      insertNpc.run(
        JSON.stringify({ ...n, nameEs: npcNameEs(n.name), notesEs: NOTES_ES[`${n.name}|${n.source ?? ''}`] ?? '' }),
      );
      count('bookNpcs', true);
    }

    out.stash = rewards.addToStash(b.stash);
    live.send('awards', {}, (u) => u.is_admin);
    live.send('quests', {});
    res.json(out);
  });
}
