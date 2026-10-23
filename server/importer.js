// The importer (GM "Importer" tab): load prep in one go from a JSON file in the format described in
// docs/IMPORT_FORMAT.md — achievements (given during play), quests (optionally to the active party), the GM's own
// stat blocks, book stat blocks by name, and loot for the GM's stash. Anything already there (same title or name)
// is skipped, so importing the same file twice is safe. `?dryRun=1` reports what would happen without writing.
import { BOOK_NPCS } from './catalog/npcs.js';
import { NOTES_ES } from './catalog/npcNotesEs.js';
import { npcNameEs } from './catalog/namesEs.js';

export const IMPORT_FORMAT = 'dcc-crawler-sheets/import';
export const IMPORT_VERSION = 1;
const SECTIONS = ['achievements', 'quests', 'npcs', 'bookNpcs', 'stash'];
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
    const b = req.body && typeof req.body === 'object' && !Array.isArray(req.body) ? req.body : null;
    if (!b) return res.status(400).json({ error: 'Expected a JSON object', code: 'bad_import' });
    if (b.format && b.format !== IMPORT_FORMAT)
      return res.status(400).json({ error: `Unknown format "${clip(b.format, 60)}"`, code: 'bad_import' });
    if (Number(b.version) > IMPORT_VERSION)
      return res.status(400).json({ error: 'This file is for a newer version of the app', code: 'import_too_new' });
    if (!SECTIONS.some((k) => Array.isArray(b[k]) && b[k].length))
      return res.status(400).json({ error: 'Nothing to import', code: 'import_empty' });
    const dry = req.query.dryRun === '1' || req.query.dryRun === 'true';
    const report = Object.fromEntries(SECTIONS.map((k) => [k, []]));

    // achievements: the GM page lists newest first, so they're added last-to-first to read in the file's order
    const achs = list(b.achievements);
    const achReport = achs.map(() => null);
    for (let i = achs.length - 1; i >= 0; i--)
      achReport[i] = { name: clip(achs[i]?.title, 120), status: rewards.addAchievement(achs[i], { dry }) };
    report.achievements = achReport;

    for (const q of list(b.quests, 30))
      report.quests.push({ name: clip(q?.title, 120), status: quests.addQuest(q, req.user.id, { dry }) });

    // the GM's own stat blocks (bosses, named NPCs): skipped when one with that name is already there
    const have = new Set(npcRows().map((d) => clip(d.name, 120).toLowerCase()));
    for (const n of list(b.npcs, 50)) {
      const name = n && typeof n === 'object' ? clip(n.name, 120).trim() : '';
      if (!name) {
        report.npcs.push({ name: '', status: 'invalid' });
        continue;
      }
      if (have.has(name.toLowerCase())) {
        report.npcs.push({ name, status: 'exists' });
        continue;
      }
      if (!dry) insertNpc.run(JSON.stringify({ ...n, name, locked: true }));
      have.add(name.toLowerCase());
      report.npcs.push({ name, status: 'added' });
    }

    // book stat blocks by name (the first one with that name), unless already imported
    const haveBook = new Set(npcRows().map((d) => `${d.name}|${d.source ?? ''}`));
    for (const raw of list(b.bookNpcs, 50)) {
      const name = clip(raw, 120).trim();
      const book = BOOK_NPCS.find((x) => x.name.toLowerCase() === name.toLowerCase());
      if (!book) {
        report.bookNpcs.push({ name, status: 'unknown' });
        continue;
      }
      const { prevNotes, prevDescriptions, prevDescriptionsEs, ...n } = book; // eslint-disable-line no-unused-vars
      const key = `${n.name}|${n.source ?? ''}`;
      if (haveBook.has(key)) {
        report.bookNpcs.push({ name: n.name, status: 'exists' });
        continue;
      }
      if (!dry) insertNpc.run(JSON.stringify({ ...n, nameEs: npcNameEs(n.name), notesEs: NOTES_ES[key] ?? '' }));
      haveBook.add(key);
      report.bookNpcs.push({ name: n.name, status: 'added' });
    }

    report.stash = rewards.addToStash(b.stash, { dry });

    const counts = Object.fromEntries(
      SECTIONS.map((k) => [k, report[k].reduce((c, r) => ({ ...c, [r.status]: (c[r.status] ?? 0) + 1 }), {})]),
    );
    if (!dry) {
      live.send('awards', {}, (u) => u.is_admin);
      live.send('quests', {});
    }
    res.json({ dryRun: dry, title: clip(b.title, 200), report, counts });
  });
}
