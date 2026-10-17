import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { openDb, ensureAdmin } from '../server/db.js';
import { createApp } from '../server/app.js';

let server;
let base;

function client() {
  const jar = new Map();
  return async (method, url, body) => {
    const res = await fetch(base + url, {
      method,
      headers: {
        'content-type': 'application/json',
        cookie: [...jar].map(([k, v]) => `${k}=${v}`).join('; '),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    for (const c of res.headers.getSetCookie()) {
      const [kv, ...attrs] = c.split(';');
      const [k, v] = kv.split('=');
      const cleared = attrs.some((a) => /expires=Thu, 01 Jan 1970/i.test(a)) || v === '';
      if (cleared) jar.delete(k.trim());
      else jar.set(k.trim(), v);
    }
    return { status: res.status, body: await res.json().catch(() => null) };
  };
}

before(async () => {
  const db = openDb(':memory:');
  ensureAdmin(db, 'dm', 'adminpass123');
  const app = createApp({ db, jwtSecret: 'test-secret' });
  await new Promise((r) => (server = app.listen(0, r)));
  base = `http://127.0.0.1:${server.address().port}`;
});

after(() => server.close());

test('health', async () => {
  const r = await client()('GET', '/health');
  assert.equal(r.status, 200);
});

test('players only see their own sheets; admin sees and edits all', async () => {
  const alice = client();
  const bob = client();
  const dm = client();

  assert.equal((await alice('POST', '/api/auth/register', { username: 'alice', password: 'password1' })).status, 201);
  assert.equal((await bob('POST', '/api/auth/register', { username: 'bob', password: 'password2' })).status, 201);
  assert.equal((await bob('POST', '/api/auth/register', { username: 'ALICE', password: 'password2' })).status, 409);
  assert.equal((await dm('POST', '/api/auth/login', { username: 'dm', password: 'adminpass123' })).status, 200);

  const created = await alice('POST', '/api/characters', { data: { name: 'Carl' } });
  assert.equal(created.status, 201);
  const id = created.body.id;

  // Bob can't see or touch Alice's sheet
  assert.equal((await bob('GET', `/api/characters/${id}`)).status, 404);
  assert.equal((await bob('PUT', `/api/characters/${id}`, { data: {}, version: 1 })).status, 404);
  assert.equal((await bob('GET', '/api/characters')).body.length, 0);
  assert.equal((await bob('GET', '/api/users')).status, 403);
  // scope=all is ignored for non-admins
  assert.equal((await bob('GET', '/api/characters?scope=all')).body.length, 0);

  // Save with versioning
  const saved = await alice('PUT', `/api/characters/${id}`, { data: { name: 'Carl', level: '3' }, version: 1 });
  assert.equal(saved.status, 200);
  assert.equal(saved.body.version, 2);
  assert.equal((await alice('PUT', `/api/characters/${id}`, { data: {}, version: 1 })).status, 409);

  // Lock blocks deletion
  assert.equal((await alice('POST', `/api/characters/${id}/lock`, { locked: true })).body.locked, true);
  assert.equal((await alice('DELETE', `/api/characters/${id}`)).status, 423);
  // ...but health, mana, buffs and debuffs stay usable while locked
  const play = {
    level: '3',
    name: 'Carl',
    hbLost: 4,
    manaCurrent: '2',
    evade: { buffs: '+2' },
    debuffList: [{ id: 'burned', stacks: 1, note: '' }],
  };
  assert.equal((await alice('PUT', `/api/characters/${id}`, { data: play, version: 2 })).status, 200);
  // other changes to a locked sheet are ignored: the stored build is kept
  const renamed = { ...play, name: 'Carlos', hbLost: 5 };
  assert.equal((await alice('PUT', `/api/characters/${id}`, { data: renamed, version: 3 })).status, 200);
  const afterLocked = (await alice('GET', `/api/characters/${id}`)).body.data;
  assert.equal(afterLocked.name, 'Carl');
  assert.equal(afterLocked.hbLost, 5);
  assert.equal(afterLocked.evade.buffs, '+2');

  // Admin sees everything and can unlock + edit
  const all = await dm('GET', '/api/characters?scope=all');
  assert.equal(all.body.length, 1);
  assert.equal(all.body[0].ownerName, 'alice');
  assert.equal((await dm('POST', `/api/characters/${id}/lock`, { locked: false })).status, 200);
  const dmEdit = await dm('PUT', `/api/characters/${id}`, { data: { name: 'Carl', level: '4' }, version: 4 });
  assert.equal(dmEdit.status, 200);
  assert.equal((await alice('GET', `/api/characters/${id}`)).body.data.level, '4');

  // Admin user management
  const users = (await dm('GET', '/api/users')).body;
  assert.equal(users.length, 3);
  const bobId = users.find((u) => u.username === 'bob').id;
  assert.equal((await dm('PATCH', `/api/users/${bobId}`, { password: 'newpassword' })).status, 200);
  assert.equal((await client()('POST', '/api/auth/login', { username: 'bob', password: 'newpassword' })).status, 200);
});

test('rejects bad credentials and weak input', async () => {
  const c = client();
  const bad = await c('POST', '/api/auth/login', { username: 'dm', password: 'nope' });
  assert.equal(bad.status, 401);
  assert.equal(bad.body.code, 'invalid_login');
  assert.equal((await c('POST', '/api/auth/register', { username: 'x', password: 'password1' })).status, 400);
  assert.equal((await c('POST', '/api/auth/register', { username: 'shorty', password: '123' })).status, 400);
  assert.equal((await c('GET', '/api/characters')).status, 401);
});

test('catalog: lookups by name for everyone, full list only for admins', async () => {
  const player = client();
  const dm = client();
  await player('POST', '/api/auth/register', { username: 'catplayer', password: 'password1' });
  await dm('POST', '/api/auth/login', { username: 'dm', password: 'adminpass123' });

  const fb = await player('GET', '/api/catalog/lookup?name=fireball');
  assert.equal(fb.status, 200);
  assert.equal(fb.body.kind, 'spell');
  assert.equal(fb.body.entry.manaCost, '45');
  assert.equal((await player('GET', '/api/catalog/lookup?name=Tire%20Iron%20(Club)')).body.entry.name, 'Club');
  assert.equal((await player('GET', '/api/catalog/lookup?name=Healing%20Potion&scope=item')).body.kind, 'item');
  assert.equal((await player('GET', '/api/catalog/lookup?name=Fire')).status, 404);

  const skills = (await player('GET', '/api/catalog/skills')).body;
  assert.ok(skills.some((s) => s.name === 'Longsword'));
  assert.ok(!skills.some((s) => s.name === 'Fireball'), 'spells are not listed for players');
  assert.equal((await player('GET', '/api/catalog/all')).status, 403);

  const all = (await dm('GET', '/api/catalog/all')).body;
  assert.ok(all.spells.length > 40 && all.items.length > 20);
  assert.equal((await client()('GET', '/api/catalog/lookup?name=Fireball')).status, 401);
});

test('party: GM picks members, everyone sees their HP, mana only for owner and GM', async () => {
  const p1 = client();
  const p2 = client();
  const dm = client();
  await p1('POST', '/api/auth/register', { username: 'donut', password: 'password1' });
  await p2('POST', '/api/auth/register', { username: 'mordecai', password: 'password1' });
  await dm('POST', '/api/auth/login', { username: 'dm', password: 'adminpass123' });
  const a = await p1('POST', '/api/characters', {
    data: { name: 'Donut', hbLost: 3, manaCurrent: '7', spells: 'secret' },
  });
  const b = await p2('POST', '/api/characters', { data: { name: 'Mordecai' } });

  assert.equal((await p1('PATCH', `/api/characters/${a.body.id}/party`, { inParty: true })).status, 403);
  assert.equal((await dm('PATCH', `/api/characters/${a.body.id}/party`, { inParty: true })).status, 200);
  assert.equal((await dm('PATCH', `/api/characters/${b.body.id}/party`, { inParty: true })).status, 200);

  const seen = (await p2('GET', '/api/party')).body;
  assert.deepEqual(
    seen.map((m) => m.view.name),
    ['Donut', 'Mordecai'],
  );
  const donut = seen[0];
  assert.equal(donut.view.hbLost, 3);
  assert.equal(donut.view.manaCurrent, undefined, 'other players do not see mana');
  assert.equal(donut.view.spells, undefined, 'only the party fields are shared');
  assert.equal((await p1('GET', '/api/party')).body[0].view.manaCurrent, '7');
  assert.equal((await dm('GET', '/api/party')).body[0].view.manaCurrent, '7');
  assert.equal((await dm('GET', '/api/characters?scope=all')).body.find((c) => c.id === a.body.id).inParty, true);

  await dm('PATCH', `/api/characters/${b.body.id}/party`, { inParty: false });
  assert.equal((await p1('GET', '/api/party')).body.length, 1);
});

test('messages: rolls happen on the server, GM-only messages stay private, events stream', async () => {
  const p1 = client();
  const p2 = client();
  const dm = client();
  await p1('POST', '/api/auth/register', { username: 'katia', password: 'password1' });
  await p2('POST', '/api/auth/register', { username: 'brandon', password: 'password1' });
  await dm('POST', '/api/auth/login', { username: 'dm', password: 'adminpass123' });
  const k = await p1('POST', '/api/characters', { data: { name: 'Katia' } });
  const other = await p2('POST', '/api/characters', { data: { name: 'Brandon' } });

  // live stream for p2
  const login = await fetch(base + '/api/auth/login', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ username: 'brandon', password: 'password1' }),
  });
  const ctrl = new AbortController();
  const stream = await fetch(base + '/api/events', {
    headers: { cookie: login.headers.get('set-cookie').split(';')[0] },
    signal: ctrl.signal,
  });
  assert.match(stream.headers.get('content-type'), /^text\/event-stream/);
  const reader = stream.body.getReader();

  const chat = await p1('POST', '/api/messages', { text: 'Hello crawlers', characterId: k.body.id });
  assert.equal(chat.status, 201);
  assert.equal(chat.body.characterName, 'Katia');
  assert.equal((await p1('POST', '/api/messages', { text: 'hi', characterId: other.body.id })).status, 404);

  const roll = await p1('POST', '/api/messages', { roll: { expr: 'd20+5', label: 'Longsword' } });
  assert.equal(roll.body.kind, 'roll');
  assert.ok(roll.body.roll.total >= 6 && roll.body.roll.total <= 25);
  assert.equal(roll.body.roll.label, 'Longsword');
  const cmd = await p1('POST', '/api/messages', { text: '/roll 2d6+1 # damage' });
  assert.equal(cmd.body.roll.expr, '2d6+1');
  assert.equal(cmd.body.roll.label, 'damage');
  assert.equal((await p1('POST', '/api/messages', { roll: { expr: 'fireball' } })).status, 400);
  assert.equal((await p1('POST', '/api/messages', { text: '   ' })).status, 400);

  await dm('POST', '/api/messages', { roll: { expr: 'd20', label: 'Ambush?' }, gmOnly: true });
  const forP2 = (await p2('GET', '/api/messages')).body;
  assert.ok(forP2.some((m) => m.text === 'Hello crawlers'));
  assert.ok(!forP2.some((m) => m.roll?.label === 'Ambush?'), 'players do not see GM-only rolls');
  assert.ok((await dm('GET', '/api/messages')).body.some((m) => m.roll?.label === 'Ambush?'));

  // the stream delivered the chat message
  let text = '';
  while (!text.includes('Hello crawlers')) text += new TextDecoder().decode((await reader.read()).value);
  assert.ok(text.includes('event: message'));
  assert.ok(!text.includes('Ambush?'));
  ctrl.abort();

  assert.equal((await p1('DELETE', '/api/messages')).status, 403);
  assert.equal((await dm('DELETE', '/api/messages')).status, 200);
  assert.equal((await p1('GET', '/api/messages')).body.length, 0);
});

test('GM tools: NPCs, combat tracker, level-ups and the event log', async () => {
  const pl = client();
  const other = client();
  const dm = client();
  await pl('POST', '/api/auth/register', { username: 'zev', password: 'password1' });
  await other('POST', '/api/auth/register', { username: 'elle', password: 'password1' });
  await dm('POST', '/api/auth/login', { username: 'dm', password: 'adminpass123' });
  await dm('DELETE', '/api/messages');

  // NPC stat blocks are GM only
  assert.equal((await pl('GET', '/api/npcs')).status, 403);
  const npc = await dm('POST', '/api/npcs', {
    data: { name: 'Bad Llama', kind: 'mob', slots: '3', slotValue: '2', dr: '2', evade: '13+F' },
  });
  assert.equal(npc.status, 201);
  assert.equal((await dm('GET', '/api/npcs')).body.length, 1);

  // combat
  await dm('POST', '/api/encounter', { action: 'start', floor: 2 });
  await dm('POST', '/api/encounter/opponents', { npcId: npc.body.id, count: 2 });
  await dm('POST', '/api/encounter/opponents', { name: 'Hidden Boss', kind: 'boss', slots: 5, hidden: true });
  let enc = (await pl('GET', '/api/encounter')).body;
  assert.equal(enc.active, true);
  assert.deepEqual(
    enc.opponents.map((o) => o.name),
    ['Bad Llama 1', 'Bad Llama 2'],
  );
  assert.equal(enc.opponents[0].dr, undefined, 'players do not see stat details');
  const llama = enc.opponents[0].id;
  // 6 damage − 2 DR = 4 → 2 slots of 2 → 33%
  enc = (await dm('PATCH', `/api/encounter/opponents/${llama}`, { damage: 6 })).body;
  assert.equal(enc.opponents[0].lost, 2);
  assert.equal(enc.opponents[0].pct, 33);
  assert.equal((await pl('PATCH', `/api/encounter/opponents/${llama}`, { damage: 6 })).status, 403);
  for (let i = 0; i < 5; i++) await dm('POST', '/api/encounter', { action: 'next' });
  enc = (await pl('GET', '/api/encounter')).body;
  assert.deepEqual([enc.round, enc.phase], [2, 1]);

  // level-ups: GM only, work on locked sheets, tracked with stat points and history
  const c = await pl('POST', '/api/characters', { data: { name: 'Zev', level: '3', floor: '3', hbLost: 0 } });
  await pl('POST', `/api/characters/${c.body.id}/lock`, { locked: true });
  assert.equal((await pl('POST', `/api/characters/${c.body.id}/progress`, { type: 'twoHours' })).status, 403);
  const up = await dm('POST', `/api/characters/${c.body.id}/progress`, { type: 'boss', tier: 'borough' });
  assert.equal(up.body.data.level, '5');
  assert.equal(up.body.data.statPoints, '6');
  assert.equal(up.body.data.levelLog[0].source, 'boss');

  // HP change with a source is logged; the owner and GM see it (not in the party), others don't
  const cur = (await pl('GET', `/api/characters/${c.body.id}`)).body;
  const hit = await pl('PUT', `/api/characters/${c.body.id}`, {
    data: { ...cur.data, hbLost: 2 },
    version: cur.version,
    sources: { hp: ['Goblin arrow'] },
  });
  assert.equal(hit.status, 200);
  const mine = (await pl('GET', '/api/messages')).body.filter((m) => m.kind === 'event');
  const hp = mine.find((m) => m.event.type === 'hp');
  assert.deepEqual([hp.event.from, hp.event.to, hp.event.source], [0, 2, 'Goblin arrow']);
  assert.ok(mine.some((m) => m.event.type === 'level'));
  const theirs = (await other('GET', '/api/messages')).body.filter((m) => m.kind === 'event');
  assert.ok(!theirs.some((m) => m.event.type === 'hp'), 'non-party HP changes are private');
  assert.ok(
    theirs.some((m) => m.event.type === 'opponent'),
    'visible opponent damage is public',
  );
  assert.ok(theirs.some((m) => m.event.type === 'combat' && m.event.action === 'round'));

  // party-wide 2 hours: +1 level and 2-hour advancement for every party member
  await dm('PATCH', `/api/characters/${c.body.id}/party`, { inParty: true });
  const two = await dm('POST', '/api/party/two-hours', {});
  assert.ok(two.body.members.some((m) => m.id === c.body.id));
  assert.equal((await pl('GET', `/api/characters/${c.body.id}`)).body.data.level, '6');
  await dm('POST', '/api/encounter', { action: 'end' });
  assert.equal((await pl('GET', '/api/encounter')).body.active, false);
});

test('book stat blocks import once, for the GM only', async () => {
  const dm = client();
  const pl = client();
  await dm('POST', '/api/auth/login', { username: 'dm', password: 'adminpass123' });
  await pl('POST', '/api/auth/register', { username: 'bookworm', password: 'password1' });
  assert.equal((await pl('POST', '/api/npcs/import-book', {})).status, 403);
  const first = await dm('POST', '/api/npcs/import-book', {});
  assert.ok(first.body.added > 200);
  assert.equal((await dm('POST', '/api/npcs/import-book', {})).body.added, 0);
  const list = (await dm('GET', '/api/npcs')).body;
  const boiler = list.find((n) => n.data.name === 'Brain Boiler');
  assert.deepEqual(
    [boiler.data.slots, boiler.data.slotValue, boiler.data.level, boiler.data.evade, boiler.data.source],
    ['10', '1', '10', '14+F', 'Core Rulebook p. 333'],
  );
  assert.equal(boiler.data.attacks[0].damage, '3d4+2 Piercing');
  const carl = list.find((n) => n.data.name === 'Carl (Over City)');
  assert.deepEqual([carl.data.kind, carl.data.floor], ['crawler', 3]);
  assert.ok(list.some((n) => n.data.floor === 1 && n.data.kind === 'mob'));

  // an older import (crawler stored as NPC) is re-sorted on the next import, keeping edited stats
  const row = list.find((n) => n.data.name === 'Derrick Qu');
  await dm('PUT', `/api/npcs/${row.id}`, { data: { ...row.data, kind: 'npc', level: '99' } });
  const again = await dm('POST', '/api/npcs/import-book', {});
  assert.deepEqual([again.body.added, again.body.updated], [0, 1]);
  const fixed = (await dm('GET', `/api/npcs/${row.id}`)).body.data;
  assert.deepEqual([fixed.kind, fixed.level], ['crawler', '99']);

  // rules notes and System AI descriptions: stat blocks from an older import (old generated notes, no
  // description) get the new ones; notes you wrote yourself are kept
  const llama = list.find((n) => n.data.name === 'Bad Llama' && n.data.source?.startsWith('GM'));
  assert.match(llama.data.notes, /^Bad Reflux: /);
  assert.ok(llama.data.description.length > 40);
  const rat = list.find((n) => n.data.name === 'Rat' && n.data.source);
  await dm('PUT', `/api/npcs/${llama.id}`, {
    data: { ...llama.data, notes: 'Special: Bad Reflux. Full text: GM Campaign Toolkit p. 51.', description: '' },
  });
  await dm('PUT', `/api/npcs/${rat.id}`, { data: { ...rat.data, notes: 'My own rat notes', description: '' } });
  await dm('POST', '/api/npcs/import-book', {});
  const l2 = (await dm('GET', `/api/npcs/${llama.id}`)).body.data;
  const r2 = (await dm('GET', `/api/npcs/${rat.id}`)).body.data;
  assert.match(l2.notes, /^Bad Reflux: /);
  assert.ok(l2.description.length > 40);
  assert.equal(r2.notes, 'My own rat notes');
  assert.ok(r2.description.length > 20);
  assert.equal(l2.prevNotes, undefined, 'bookkeeping field not stored');
  // an older generated description is replaced too, one you wrote is kept
  const { BOOK_NPCS } = await import('../server/catalog/npcs.js');
  const book = BOOK_NPCS.find((n) => n.name === 'Rat');
  await dm('PUT', `/api/npcs/${rat.id}`, { data: { ...r2, description: book.prevDescriptions[0] } });
  await dm('PUT', `/api/npcs/${llama.id}`, { data: { ...l2, description: 'My llama' } });
  await dm('POST', '/api/npcs/import-book', {});
  assert.equal((await dm('GET', `/api/npcs/${rat.id}`)).body.data.description, book.description);
  assert.equal((await dm('GET', `/api/npcs/${llama.id}`)).body.data.description, 'My llama');
  assert.ok((await dm('GET', `/api/npcs/${rat.id}`)).body.data.descriptionEs.length > 20, 'Spanish description');
  // the Spanish text from before the "Pro-Tip" wording is refreshed too
  await dm('PUT', `/api/npcs/${rat.id}`, {
    data: { ...(await dm('GET', `/api/npcs/${rat.id}`)).body.data, descriptionEs: book.prevDescriptionsEs[0] },
  });
  await dm('POST', '/api/npcs/import-book', {});
  assert.match((await dm('GET', `/api/npcs/${rat.id}`)).body.data.descriptionEs, /Pro-Tip/);
  // notes from the previous generated version are refreshed as well
  const mook = (await dm('GET', '/api/npcs')).body.find((n) => n.data.name === 'Mook');
  const mookBook = BOOK_NPCS.find((n) => n.name === 'Mook');
  assert.match(mook.data.notes, /Big Fuckin' Insult/);
  await dm('PUT', `/api/npcs/${mook.id}`, { data: { ...mook.data, notes: mookBook.prevNotes.at(-1) } });
  await dm('POST', '/api/npcs/import-book', {});
  assert.equal((await dm('GET', `/api/npcs/${mook.id}`)).body.data.notes, mookBook.notes);
});

test('spending Stat points is logged', async () => {
  const pl = client();
  await pl('POST', '/api/auth/register', { username: 'saferoom', password: 'password1' });
  const c = await pl('POST', '/api/characters', {
    data: { name: 'Lifter', statPoints: '6', stats: { str: { enhanced: '8', unenhanced: '8', mod: '' } } },
  });
  const cur = (await pl('GET', `/api/characters/${c.body.id}`)).body;
  const next = { ...cur.data, statPoints: '3', stats: { str: { enhanced: '11', unenhanced: '11', mod: '' } } };
  assert.equal((await pl('PUT', `/api/characters/${c.body.id}`, { data: next, version: cur.version })).status, 200);
  const ev = (await pl('GET', '/api/messages')).body.find(
    (m) => m.event?.type === 'stats' && m.characterId === c.body.id,
  );
  assert.deepEqual(ev.event, { type: 'stats', changes: { str: 3 }, spent: 3, left: 3 });
});

test('Mob Action Declaration: secret in phase 1, revealed in phase 2, Evade and damage', async () => {
  const pl = client();
  const other = client();
  const dm = client();
  await pl('POST', '/api/auth/register', { username: 'decl1', password: 'password1' });
  await other('POST', '/api/auth/register', { username: 'decl2', password: 'password1' });
  await dm('POST', '/api/auth/login', { username: 'dm', password: 'adminpass123' });
  await dm('DELETE', '/api/messages');

  const npc = await dm('POST', '/api/npcs', {
    data: {
      name: 'Bad Llama',
      slots: '3',
      slotValue: '2',
      attacks: [{ name: 'Lava Spit', toHit: '13+F', damage: '1d6+F Fire', range: '30 ft', effect: '' }],
    },
  });
  assert.equal(npc.body.data.locked, false, 'a new stat block starts unlocked');
  const c = await pl('POST', '/api/characters', { data: { name: 'Alvaro', floor: '2' } });
  const c2 = await other('POST', '/api/characters', { data: { name: 'Nope' } });
  await dm('PATCH', `/api/characters/${c.body.id}/party`, { inParty: true });

  await dm('POST', '/api/encounter', { action: 'start', floor: 2 });
  let enc = (await dm('POST', '/api/encounter/opponents', { npcId: npc.body.id, count: 2 })).body;
  const llama = enc.opponents.find((o) => o.name === 'Bad Llama 2');
  assert.equal(llama.attacks[0].name, 'Lava Spit', 'attacks are copied from the stat block');

  // only party members can be targeted; players can't declare
  const bad = await dm('POST', '/api/encounter/declarations', {
    opponentId: llama.id,
    attack: 0,
    targets: [c2.body.id],
  });
  assert.equal(bad.status, 400);
  assert.equal(
    (await pl('POST', '/api/encounter/declarations', { opponentId: llama.id, attack: 0, targets: [c.body.id] })).status,
    403,
  );
  enc = (await dm('POST', '/api/encounter/declarations', { opponentId: llama.id, attack: 0, targets: [c.body.id] }))
    .body;
  const decl = enc.declarations[0];
  assert.equal(decl.dc, 15, 'Evade difficulty = to-hit with F = Floor 2');

  // phase 1: players don't see it yet
  assert.equal((await pl('GET', '/api/encounter')).body.declarations.length, 0);
  assert.equal(
    (await pl('POST', `/api/encounter/declarations/${decl.id}/evade`, { characterId: c.body.id, expr: 'd20+3' }))
      .status,
    404,
  );
  let log = (await pl('GET', '/api/messages')).body;
  assert.ok(!log.some((m) => m.event?.type === 'declare'));

  // phase 2: revealed, logged once
  await dm('POST', '/api/encounter', { action: 'next' });
  enc = (await pl('GET', '/api/encounter')).body;
  assert.equal(enc.declarations.length, 1);
  assert.equal(enc.declarations[0].attack.toHit, undefined, 'players only see the name, range and DC');
  assert.equal(enc.declarations[0].dc, 15);
  log = (await other('GET', '/api/messages')).body;
  const ev = log.filter((m) => m.event?.type === 'declare');
  assert.equal(ev.length, 1);
  assert.deepEqual(
    [ev[0].event.items[0].opponent, ev[0].event.items[0].attack, ev[0].event.items[0].targets[0].name],
    ['Bad Llama 2', 'Lava Spit', 'Alvaro'],
  );

  // Evade: only the owner (or GM), once, d20 ± n only
  const url = `/api/encounter/declarations/${decl.id}/evade`;
  assert.equal((await other('POST', url, { characterId: c.body.id, expr: 'd20+3' })).status, 404);
  assert.equal((await pl('POST', url, { characterId: c.body.id, expr: '10d20' })).status, 400);
  enc = (await pl('POST', url, { characterId: c.body.id, expr: 'd20+3' })).body;
  const ev2 = enc.declarations[0].targets[0].evade;
  assert.equal(ev2.success, ev2.total >= 15);
  assert.equal((await pl('POST', url, { characterId: c.body.id, expr: 'd20+3' })).status, 409);
  const roll = (await pl('GET', '/api/messages')).body.find((m) => m.roll?.vs);
  assert.equal(roll.roll.vs.dc, 15);
  assert.equal(roll.characterName, 'Alvaro');

  // damage: 1d6+2, posted as the Mob
  enc = (await dm('POST', `/api/encounter/declarations/${decl.id}/damage`)).body;
  const dmg = enc.declarations[0].damage;
  assert.equal(dmg.expr, '1d6+2');
  assert.ok(dmg.total >= 3 && dmg.total <= 8);
  assert.ok(
    (await other('GET', '/api/messages')).body.some((m) => m.kind === 'roll' && m.characterName === 'Bad Llama 2'),
  );
  enc = (
    await dm('PATCH', `/api/encounter/declarations/${decl.id}/targets/${c.body.id}`, {
      applied: { damage: dmg.total, slots: 1 },
    })
  ).body;
  assert.equal(enc.declarations[0].targets[0].applied.slots, 1);

  // a new round clears the declarations
  for (let i = 0; i < 4; i++) await dm('POST', '/api/encounter', { action: 'next' });
  enc = (await dm('GET', '/api/encounter')).body;
  assert.deepEqual([enc.round, enc.phase, enc.declarations.length], [2, 1, 0]);
  await dm('POST', '/api/encounter', { action: 'end' });
  await dm('PATCH', `/api/characters/${c.body.id}/party`, { inParty: false });
});

test('crawler Actions, AI Favor rerolls, numbering and live stat block attacks', async () => {
  const pl = client();
  const dm = client();
  await pl('POST', '/api/auth/register', { username: 'act1', password: 'password1' });
  await dm('POST', '/api/auth/login', { username: 'dm', password: 'adminpass123' });
  const npc = await dm('POST', '/api/npcs', {
    data: { name: 'Goblin', slots: '2', slotValue: '2', attacks: [{ name: 'Stab', toHit: '40', damage: '1d4' }] },
  });
  const c = await pl('POST', '/api/characters', { data: { name: 'Tess', dr: { aiFavor: '1' } } });
  await pl('POST', `/api/characters/${c.body.id}/lock`, { locked: true });
  await dm('PATCH', `/api/characters/${c.body.id}/party`, { inParty: true });
  await dm('POST', '/api/encounter', { action: 'start', floor: 1 });

  // a lone "Goblin" becomes "Goblin 1" when a second joins
  await dm('POST', '/api/encounter/opponents', { npcId: npc.body.id });
  let enc = (await dm('POST', '/api/encounter/opponents', { npcId: npc.body.id })).body;
  assert.deepEqual(
    enc.opponents.map((o) => o.name),
    ['Goblin 1', 'Goblin 2'],
  );
  // attacks come from the stat block as it is now
  await dm('PUT', `/api/npcs/${npc.body.id}`, {
    data: {
      ...npc.body.data,
      attacks: [
        { name: 'Stab', toHit: '40' },
        { name: 'Bite', toHit: '41', damage: '1d6' },
      ],
    },
  });
  enc = (await dm('GET', '/api/encounter')).body;
  assert.deepEqual(
    enc.opponents[1].attacks.map((a) => a.name),
    ['Stab', 'Bite'],
  );
  // each copy declares on its own
  const [g1, g2] = enc.opponents;
  await dm('POST', '/api/encounter/declarations', { opponentId: g1.id, attack: 0, targets: [c.body.id] });
  enc = (await dm('POST', '/api/encounter/declarations', { opponentId: g2.id, attack: 1, targets: [c.body.id] })).body;
  assert.deepEqual(
    enc.declarations.map((d) => [d.opponentName, d.attack.name, d.dc]),
    [
      ['Goblin 1', 'Stab', 40],
      ['Goblin 2', 'Bite', 41],
    ],
  );
  await dm('POST', '/api/encounter', { action: 'next' });

  // Evade (can't succeed vs 40): uses 1 Action for both attacks
  const [d1, d2] = enc.declarations;
  await pl('POST', `/api/encounter/declarations/${d1.id}/evade`, { characterId: c.body.id, expr: 'd20' });
  enc = (await pl('POST', `/api/encounter/declarations/${d2.id}/evade`, { characterId: c.body.id, expr: 'd20' })).body;
  assert.deepEqual(enc.actions[c.body.id].used, ['evade']);
  // (a Natural 20 is a Critical Hit: it always succeeds)
  const first = enc.declarations[0].targets[0].evade;
  assert.equal(first.success, first.natural === 20);

  // AI Favor reroll: once, spends the sheet's AI Favor even though the sheet is locked
  const nat1 = first.natural === 1 || first.natural === 20;
  const rr = await pl('POST', `/api/encounter/declarations/${d1.id}/evade`, {
    characterId: c.body.id,
    expr: 'd20',
    reroll: true,
  });
  if (nat1) assert.equal(rr.status, 409);
  else {
    assert.equal(rr.status, 200);
    assert.equal(rr.body.declarations[0].targets[0].evade.rerolled, true);
    assert.equal((await pl('GET', `/api/characters/${c.body.id}`)).body.data.dr.aiFavor, '0');
    const again = await pl('POST', `/api/encounter/declarations/${d2.id}/evade`, {
      characterId: c.body.id,
      expr: 'd20',
      reroll: true,
    });
    // (a Natural 1 on that second Evade can't be rerolled at all)
    const e2 = rr.body.declarations[1].targets[0].evade;
    assert.equal(again.body.code, e2.natural === 1 || e2.success ? 'no_reroll' : 'no_ai_favor');
    const log = (await pl('GET', '/api/messages')).body;
    assert.ok(log.some((m) => m.event?.type === 'favor' && m.event.use === 'reroll'));
  }

  // one Action left for step 4, then none
  enc = (await pl('POST', '/api/encounter/actions', { characterId: c.body.id, op: 'use', kind: 'action' })).body;
  assert.equal(enc.actions[c.body.id].used.length, 2);
  const full = await pl('POST', '/api/encounter/actions', { characterId: c.body.id, op: 'use' });
  assert.equal(full.body.code, 'no_actions_left');
  enc = (await pl('POST', '/api/encounter/actions', { characterId: c.body.id, op: 'free', index: 1 })).body;
  assert.equal(enc.actions[c.body.id].used.length, 1);

  // a new round: Actions reset
  for (let i = 0; i < 4; i++) await dm('POST', '/api/encounter', { action: 'next' });
  enc = (await pl('GET', '/api/encounter')).body;
  assert.equal(enc.actions[c.body.id], undefined);
  await dm('POST', '/api/encounter', { action: 'end' });
  await dm('PATCH', `/api/characters/${c.body.id}/party`, { inParty: false });
});

test('Area Attacks are detected (or set by the GM) and carry Splash targets', async () => {
  const dm = client();
  const pl = client();
  await dm('POST', '/api/auth/login', { username: 'dm', password: 'adminpass123' });
  await pl('POST', '/api/auth/register', { username: 'area1', password: 'password1' });
  const npc = await dm('POST', '/api/npcs', {
    data: {
      name: 'Acid Toad',
      attacks: [
        { name: 'Spray', toHit: '12+F', damage: '1d6', range: '20ft Cone +10ft Splash' },
        { name: 'Bite', toHit: '12+F', damage: '1d4', range: 'Melee' },
      ],
    },
  });
  const a = await pl('POST', '/api/characters', { data: { name: 'Ann' } });
  const b = await pl('POST', '/api/characters', { data: { name: 'Bo' } });
  for (const c of [a, b]) await dm('PATCH', `/api/characters/${c.body.id}/party`, { inParty: true });
  await dm('POST', '/api/encounter', { action: 'start', floor: 1 });
  let enc = (await dm('POST', '/api/encounter/opponents', { npcId: npc.body.id })).body;
  const toad = enc.opponents.find((o) => o.name === 'Acid Toad');
  await dm('POST', '/api/encounter/declarations', {
    opponentId: toad.id,
    attack: 0,
    targets: [a.body.id, b.body.id],
    splash: [b.body.id],
  });
  enc = (await dm('POST', '/api/encounter/declarations', { opponentId: toad.id, attack: 1, targets: [a.body.id] }))
    .body;
  const [spray, bite] = enc.declarations;
  assert.equal(spray.area, true);
  assert.deepEqual(
    spray.targets.map((x) => x.splash),
    [false, true],
  );
  assert.equal(bite.area, false);
  // the GM can override the guess
  enc = (
    await dm('POST', '/api/encounter/declarations', {
      opponentId: toad.id,
      attack: 1,
      targets: [b.body.id],
      area: true,
    })
  ).body;
  assert.equal(enc.declarations[2].area, true);
  await dm('POST', '/api/encounter', { action: 'next' });
  const log = (await pl('GET', '/api/messages')).body.filter((m) => m.event?.type === 'declare').pop();
  assert.equal(log.event.items[0].area, true);
  assert.equal(log.event.items[0].targets[1].splash, true);
  await dm('POST', '/api/encounter', { action: 'end' });
  for (const c of [a, b]) await dm('PATCH', `/api/characters/${c.body.id}/party`, { inParty: false });
});

test('crawler attacks: hit/miss against the hidden Mob Evade, Actions, damage and apply', async () => {
  const dm = client();
  const pl = client();
  const other = client();
  await dm('POST', '/api/auth/login', { username: 'dm', password: 'adminpass123' });
  await pl('POST', '/api/auth/register', { username: 'atk1', password: 'password1' });
  await other('POST', '/api/auth/register', { username: 'atk2', password: 'password1' });
  const c = await pl('POST', '/api/characters', { data: { name: 'Carla' } });
  await dm('PATCH', `/api/characters/${c.body.id}/party`, { inParty: true });
  await dm('POST', '/api/encounter', { action: 'start', floor: 1 });
  // Evade 0+F = 1: every roll but a Natural 1 hits; slots of 1, DR 0
  let enc = (
    await dm('POST', '/api/encounter/opponents', { name: 'Target Dummy', slots: 20, slotValue: 1, evade: '0+F' })
  ).body;
  const dummy = enc.opponents[0].id;
  const atk = (body) => pl('POST', '/api/encounter/attacks', { characterId: c.body.id, opponentId: dummy, ...body });

  // only in step 4 (or the surprise round)
  assert.equal((await atk({ expr: 'd20+2', damage: '1d4+2', label: 'Club' })).body.code, 'not_attack_step');
  for (let i = 0; i < 3; i++) await dm('POST', '/api/encounter', { action: 'next' });
  assert.equal(
    (
      await other('POST', '/api/encounter/attacks', {
        characterId: c.body.id,
        opponentId: dummy,
        expr: 'd20',
      })
    ).status,
    404,
  );
  const r1 = await atk({ expr: 'd20+2', damage: '1d4+2', label: 'Club' });
  assert.equal(r1.status, 201);
  const a1 = r1.body.attacks[0];
  assert.equal(a1.dc, undefined, 'players do not see the Mob Evade');
  assert.equal(a1.hit, a1.natural !== 1);
  assert.deepEqual(r1.body.actions[c.body.id].used, ['attack']);
  const roll = (await other('GET', '/api/messages')).body.find((m) => m.roll?.vs?.kind === 'attack');
  assert.equal(roll.roll.label, 'Club → Target Dummy');

  // 2 Attacks max, then no Actions left
  await atk({ expr: 'd20+2', label: 'Club' });
  assert.equal((await atk({ expr: 'd20+2', label: 'Club' })).body.code, 'no_actions_left');

  if (a1.hit) {
    enc = (await pl('POST', `/api/encounter/attacks/${a1.id}/damage`, {})).body;
    const dmg = enc.attacks[0].damage.total;
    // 1d4+2, dice doubled on a Natural 20, + Floor (1) on an Amazing Success
    const lo = a1.degree === 'crit' ? 4 : a1.degree === 'amazing' ? 4 : 3;
    const hi = a1.degree === 'crit' ? 10 : a1.degree === 'amazing' ? 7 : 6;
    assert.ok(dmg >= lo && dmg <= hi, `${dmg} (${a1.degree})`);
    assert.equal((await pl('POST', `/api/encounter/attacks/${a1.id}/apply`, {})).status, 403);
    enc = (await dm('POST', `/api/encounter/attacks/${a1.id}/apply`, {})).body;
    assert.equal(enc.opponents[0].lost, dmg);
    assert.equal(enc.attacks[0].applied.slots, dmg);
    assert.equal((await dm('POST', `/api/encounter/attacks/${a1.id}/apply`, {})).status, 409, 'only once');
  }
  // a new round clears them (step 4 → 5 → next round)
  await dm('POST', '/api/encounter', { action: 'next' });
  await dm('POST', '/api/encounter', { action: 'next' });
  assert.equal((await pl('GET', '/api/encounter')).body.attacks.length, 0);
  await dm('POST', '/api/encounter', { action: 'end' });
  await dm('PATCH', `/api/characters/${c.body.id}/party`, { inParty: false });
});

test('World Stats: everyone reads them, the GM changes the Floor, time and texts', async () => {
  const dm = client();
  const pl = client();
  await dm('POST', '/api/auth/login', { username: 'dm', password: 'adminpass123' });
  await pl('POST', '/api/auth/register', { username: 'world1', password: 'password1' });
  let w = (await pl('GET', '/api/world')).body;
  assert.equal(w.floor, 1);
  assert.equal(w.collapseHours, 5 * 24);
  assert.ok(w.ambience.length > 50 && w.ambienceEs.length > 50);
  assert.equal((await pl('PATCH', '/api/world', { floor: 3 })).status, 403);

  const c = await pl('POST', '/api/characters', { data: { schema: 5, name: 'Wanda', floor: '1' } });
  await pl('POST', `/api/characters/${c.body.id}/lock`, { locked: true });
  await dm('PATCH', `/api/characters/${c.body.id}/party`, { inParty: true });
  await dm('POST', '/api/encounter', { action: 'start' });

  // descending: new countdown, the fight and the party sheets follow, and it's logged
  w = (await dm('PATCH', '/api/world', { floor: 3 })).body;
  assert.deepEqual([w.floor, w.name, w.collapseHours], [3, 'The Over City', 8 * 24]);
  assert.equal((await pl('GET', '/api/encounter')).body.floor, 3);
  assert.equal((await pl('GET', `/api/characters/${c.body.id}`)).body.data.floor, '3', 'locked sheets too');
  const ev = (await pl('GET', '/api/messages')).body.filter((m) => m.event?.type === 'world').pop();
  assert.deepEqual([ev.event.from, ev.event.to], [1, 3]);

  // time, crawlers alive and per-Floor text overrides
  w = (await dm('PATCH', '/api/world', { addHours: -10, crawlersAlive: '1,234,567' })).body;
  assert.deepEqual([w.collapseHours, w.crawlersAlive], [8 * 24 - 10, 1234567]);
  w = (await dm('PATCH', '/api/world', { ambience: 'Custom', ambienceEs: 'Propio' })).body;
  assert.deepEqual([w.ambience, w.ambienceEs, w.customized], ['Custom', 'Propio', true]);
  w = (await dm('PATCH', '/api/world', { reset: true })).body;
  assert.equal(w.customized, false);
  assert.notEqual(w.ambience, 'Custom');

  await dm('POST', '/api/encounter', { action: 'end' });
  await dm('PATCH', `/api/characters/${c.body.id}/party`, { inParty: false });
  await dm('PATCH', '/api/world', { floor: 1 });
});

test('GM "view as player": read-only, sees what that player sees', async () => {
  const dm = client();
  const pl = client();
  await dm('POST', '/api/auth/login', { username: 'dm', password: 'adminpass123' });
  const reg = await pl('POST', '/api/auth/register', { username: 'viewme', password: 'password1' });
  const mine = await pl('POST', '/api/characters', { data: { name: 'Viewed' } });
  assert.equal((await pl('POST', '/api/auth/view-as', { userId: 'self' })).status, 403, 'players cannot');

  const r = await dm('POST', '/api/auth/view-as', { userId: reg.body.id });
  assert.deepEqual([r.body.username, r.body.viewAs, r.body.realUser.username], ['viewme', true, 'dm']);
  const me = (await dm('GET', '/api/auth/me')).body;
  assert.deepEqual([me.username, me.isAdmin, me.viewAs], ['viewme', false, true]);
  const list = (await dm('GET', '/api/characters')).body;
  assert.deepEqual(
    list.map((c) => c.id),
    [mine.body.id],
  );
  assert.equal((await dm('GET', '/api/npcs')).status, 403, 'no GM pages');
  const put = await dm('PUT', `/api/characters/${mine.body.id}`, { data: {}, version: 1 });
  assert.deepEqual([put.status, put.body.code], [403, 'view_only']);
  assert.equal((await dm('POST', '/api/messages', { text: 'hi' })).status, 403);

  // as themselves without GM rights, then back
  assert.equal((await dm('POST', '/api/auth/view-as', { userId: 'self' })).body.isAdmin, false);
  assert.equal((await dm('GET', '/api/auth/me')).body.username, 'dm');
  assert.equal((await dm('GET', '/api/npcs')).status, 403);
  const back = await dm('POST', '/api/auth/view-as', { userId: null });
  assert.equal(back.body.isAdmin, true);
});

test('Phase 1: portraits for party members, GM undo, AI Favor reroll of any Check, backups', async () => {
  const dm = client();
  const pl = client();
  const other = client();
  await dm('POST', '/api/auth/login', { username: 'dm', password: 'adminpass123' });
  await pl('POST', '/api/auth/register', { username: 'p1quick', password: 'password1' });
  await other('POST', '/api/auth/register', { username: 'p1other', password: 'password1' });
  const png =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
  const c = await pl('POST', '/api/characters', {
    data: { schema: 5, name: 'Pic', portrait: png, dr: { armor: '', buffs: '', aiFavor: '1', size: '' } },
  });
  // portrait: owner yes, other player only once the crawler is in the party
  assert.equal((await fetch(`${base}/api/characters/${c.body.id}/portrait`)).status, 401);
  const getPic = (who) => who('GET', `/api/characters/${c.body.id}/portrait`);
  assert.equal((await getPic(other)).status, 404);
  await dm('PATCH', `/api/characters/${c.body.id}/party`, { inParty: true });
  const party = (await other('GET', '/api/party')).body.find((m) => m.id === c.body.id);
  assert.match(party.view.portraitTag, /^[0-9a-f]{12}$/);
  assert.equal(party.view.portrait, undefined, 'the image itself is not in the party view');
  assert.equal((await getPic(other)).status, 200);
  assert.equal((await getPic(pl)).status, 200);

  // GM undo: all declarations of one attacker, and a crawler attack (gives the Action back)
  await dm('POST', '/api/encounter', { action: 'start', floor: 1 });
  let enc = (await dm('POST', '/api/encounter/opponents', { name: 'Dummy', slots: 5, slotValue: 1, evade: '0+F' }))
    .body;
  const o = enc.opponents[0];
  for (let i = 0; i < 2; i++)
    await dm('POST', '/api/encounter/declarations', {
      opponentId: o.id,
      attack: { name: 'Poke', toHit: '10' },
      targets: [c.body.id],
    });
  enc = (await dm('DELETE', `/api/encounter/opponents/${o.id}/declarations`)).body;
  assert.equal(enc.declarations.length, 0);
  for (let i = 0; i < 3; i++) await dm('POST', '/api/encounter', { action: 'next' });
  enc = (
    await pl('POST', '/api/encounter/attacks', {
      characterId: c.body.id,
      opponentId: o.id,
      expr: 'd20+1',
      label: 'Jab',
    })
  ).body;
  const atk = enc.attacks[0];
  assert.equal((await pl('DELETE', `/api/encounter/attacks/${atk.id}`)).status, 403);

  // reroll the attack roll with AI Favor (unless it was a Natural 1)
  const msg = (await pl('GET', '/api/messages')).body.filter((m) => m.roll?.vs?.kind === 'attack').pop();
  const rr = await pl('POST', `/api/messages/${msg.id}/reroll`, {});
  if (msg.roll.natural === 1) assert.equal(rr.body.code, 'no_reroll');
  else {
    assert.equal(rr.status, 200);
    assert.equal(rr.body.roll.rerollOf, msg.id);
    const orig = (await pl('GET', '/api/messages')).body.find((m) => m.id === msg.id);
    assert.equal(orig.roll.rerolled, true);
    assert.equal((await pl('POST', `/api/messages/${msg.id}/reroll`, {})).body.code, 'no_reroll', 'once per Check');
    assert.equal((await pl('GET', `/api/characters/${c.body.id}`)).body.data.dr.aiFavor, '0');
    enc = (await pl('GET', '/api/encounter')).body;
    assert.equal(enc.attacks[0].total, rr.body.roll.total);
  }
  // a plain stat check by someone else's character can't be rerolled by another player
  const chk = await pl('POST', '/api/messages', {
    roll: { expr: 'd20+2', label: 'Str check' },
    characterId: c.body.id,
  });
  assert.equal((await other('POST', `/api/messages/${chk.body.id}/reroll`, {})).status, 404);

  enc = (await dm('DELETE', `/api/encounter/attacks/${atk.id}`)).body;
  assert.equal(enc.attacks.length, 0);
  assert.deepEqual(enc.actions[c.body.id].used, []);
  await dm('POST', '/api/encounter', { action: 'end' });
  await dm('PATCH', `/api/characters/${c.body.id}/party`, { inParty: false });

  // backups are off in the test app, and GM-only
  assert.equal((await pl('GET', '/api/admin/backups')).status, 403);
  assert.equal((await dm('GET', '/api/admin/backups')).body.enabled, false);
});

test('backups: VACUUM INTO copy and retention', async () => {
  const { openDb } = await import('../server/db.js');
  const { backupNow, listBackups } = await import('../server/backup.js');
  const fs = await import('node:fs');
  const os = await import('node:os');
  const path = await import('node:path');
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'dcc-bk-'));
  const db = openDb(path.join(dir, 'x.db'));
  const out = path.join(dir, 'b');
  for (let i = 0; i < 3; i++) {
    backupNow(db, out, 2);
    await new Promise((r) => setTimeout(r, 1100));
  }
  const list = listBackups(out);
  assert.equal(list.length, 2);
  assert.ok(list[0].size > 0);
  fs.rmSync(dir, { recursive: true, force: true });
});

test('inventory: editable on locked sheets, equipped gear in the party view', async () => {
  const dm = client();
  const pl = client();
  await dm('POST', '/api/auth/login', { username: 'dm', password: 'adminpass123' });
  await pl('POST', '/api/auth/register', { username: 'invplayer', password: 'password1' });
  const jacket = {
    id: 'a1',
    item: 'Leather jacket',
    qty: '1',
    notes: '',
    type: 'armor',
    rarity: 'silver',
    unique: false,
    slot: 'torso',
    hot: false,
    skill: '',
    upgrades: '',
    bonus: { damage: '', dr: '2', evade: '' },
  };
  const c = await pl('POST', '/api/characters', {
    data: { schema: 6, name: 'Inv', inventory: [jacket], dr: { armor: '1', buffs: '', aiFavor: '', size: '' } },
  });
  await pl('POST', `/api/characters/${c.body.id}/lock`, { locked: true });
  const rope = { ...jacket, id: 'a2', item: 'Rope', type: 'misc', rarity: '', slot: '', bonus: {} };
  const { version } = (await pl('GET', `/api/characters/${c.body.id}`)).body;
  const put = await pl('PUT', `/api/characters/${c.body.id}`, {
    version,
    data: { schema: 6, name: 'Renamed', inventory: [jacket, rope], dr: { armor: '1' } },
  });
  assert.equal(put.status, 200);
  const saved = (await pl('GET', `/api/characters/${c.body.id}`)).body.data;
  assert.equal(saved.name, 'Inv', 'the build stays locked');
  assert.deepEqual(
    saved.inventory.map((i) => i.item),
    ['Leather jacket', 'Rope'],
    'items can be picked up on a locked sheet',
  );
  await dm('PATCH', `/api/characters/${c.body.id}/party`, { inParty: true });
  const view = (await pl('GET', '/api/party')).body.find((m) => m.id === c.body.id).view;
  assert.equal(view.dr.armor, '1');
  assert.deepEqual(
    view.inventory.map((i) => [i.item, i.slot, i.bonus.dr]),
    [['Leather jacket', 'torso', '2']],
    'only equipped or quick-access items are shared',
  );
});

test('achievements: GM awards, contents hidden until claimed, claim once, GM lock, items stack', async () => {
  const dm = client();
  const pl = client();
  const other = client();
  await dm('POST', '/api/auth/login', { username: 'dm', password: 'adminpass123' });
  await pl('POST', '/api/auth/register', { username: 'achplayer', password: 'password1' });
  await other('POST', '/api/auth/register', { username: 'achother', password: 'password1' });
  const potion = { id: 'p1', item: 'Healing Potion', qty: '2', type: 'consumable', bonus: {} };
  const a = await pl('POST', '/api/characters', { data: { schema: 6, name: 'Winner', inventory: [potion] } });
  const b = await other('POST', '/api/characters', { data: { schema: 6, name: 'Second' } });
  await pl('POST', `/api/characters/${a.body.id}/lock`, { locked: true });

  const reward = {
    boxes: [
      {
        tier: 'gold',
        kind: 'adventurer',
        items: [
          { item: 'Healing Potion', qty: '3', type: 'consumable' },
          { item: 'Crown of the Gutter Queen', rarity: 'legendary', unique: true, special: true, notes: 'Shiny' },
        ],
      },
    ],
    note: '+1 to a skill of your choice',
  };
  assert.equal((await pl('POST', '/api/achievements', { title: 'x' })).status, 403);
  const ach = await dm('POST', '/api/achievements', {
    title: 'First Blood',
    description: 'Kill a Mob.',
    reward,
    characterIds: [a.body.id, b.body.id],
  });
  assert.equal(ach.status, 201);
  assert.deepEqual(
    ach.body.awards.map((w) => w.name),
    ['Winner', 'Second'],
  );

  // the player sees the box (tier, kind) but not what's inside
  const mine = (await pl('GET', `/api/characters/${a.body.id}/awards`)).body;
  assert.equal(mine.claimLocked, false);
  const w = mine.awards[0];
  assert.equal(w.title, 'First Blood');
  assert.equal(w.hasReward, true);
  assert.deepEqual(w.reward.boxes[0].items, []);
  assert.equal(w.reward.boxes[0].tier, 'gold');
  assert.equal(w.reward.note, '');
  assert.equal((await other('GET', `/api/characters/${a.body.id}/awards`)).status, 404);
  assert.equal((await other('POST', `/api/awards/${w.id}/claim`)).status, 404);

  // GM lock
  await dm('PUT', '/api/rewards/settings', { claimLocked: true });
  const lockedTry = await pl('POST', `/api/awards/${w.id}/claim`);
  assert.equal(lockedTry.status, 423);
  assert.equal(lockedTry.body.code, 'claim_locked');
  assert.equal((await pl('GET', `/api/characters/${a.body.id}/awards`)).body.claimLocked, true);
  await dm('PUT', '/api/rewards/settings', { claimLocked: false });

  // claim: works on a locked sheet, items stack or get their own row, contents revealed
  const claim = await pl('POST', `/api/awards/${w.id}/claim`);
  assert.equal(claim.status, 200);
  assert.equal(claim.body.opened.boxes[0].items.length, 2);
  assert.match(claim.body.opened.boxes[0].items[0].notes, /Heals 5 HB slots/, 'description filled from the book');
  assert.equal((await pl('POST', `/api/awards/${w.id}/claim`)).status, 409, 'only once');
  const inv = (await pl('GET', `/api/characters/${a.body.id}`)).body.data.inventory;
  assert.equal(inv.find((i) => i.item === 'Healing Potion').qty, '5');
  const crown = inv.find((i) => i.item.startsWith('Crown'));
  assert.equal(crown.rarity, 'legendary');
  assert.equal(crown.unique, true);
  assert.equal(crown.special, undefined);
  const after = (await pl('GET', `/api/characters/${a.body.id}/awards`)).body.awards[0];
  assert.ok(after.claimedAt);
  assert.equal(after.reward.note, '+1 to a skill of your choice');

  // GM edits: unclaimed awards get the new reward, claimed ones keep theirs
  await dm('PUT', `/api/achievements/${ach.body.id}`, {
    title: 'First Blood',
    reward: { boxes: [{ tier: 'silver', kind: 'boss', items: [{ item: 'Torch', qty: '1' }] }] },
  });
  const bw = (await other('GET', `/api/characters/${b.body.id}/awards`)).body.awards[0];
  assert.equal(bw.reward.boxes[0].tier, 'silver');
  assert.equal((await pl('GET', `/api/characters/${a.body.id}/awards`)).body.awards[0].reward.boxes[0].tier, 'gold');
  // revoke
  assert.equal((await dm('DELETE', `/api/awards/${bw.id}`)).status, 200);
  assert.equal((await other('GET', `/api/characters/${b.body.id}/awards`)).body.awards.length, 0);
  // the log shows the achievement and the opened box
  const log = (await dm('GET', '/api/messages')).body.filter((m) => m.event?.type === 'reward');
  assert.equal(log.at(-1).event.boxes[0].tier, 'gold');
});

test('Phase 4: effects tick down, Evade degrees, Advantage, Intervene, Taunt, Catcher, links, items, area attacks', async () => {
  const dm = client();
  const p1 = client();
  const p2 = client();
  await dm('POST', '/api/auth/login', { username: 'dm', password: 'adminpass123' });
  await p1('POST', '/api/auth/register', { username: 'ph4one', password: 'password1' });
  await p2('POST', '/api/auth/register', { username: 'ph4two', password: 'password1' });
  const effects = [
    { id: 'e1', kind: 'buff', name: 'Hasted', effect: '+2 Evade', duration: 'rounds', rounds: 1 },
    { id: 'e2', kind: 'disadvantage', name: 'Blinded', effect: '', duration: 'combat', rounds: 0 },
    { id: 'e3', kind: 'buff', name: 'Blessed', effect: '', duration: 'rest', rounds: 0 },
  ];
  const potion = { id: 'hp1', item: 'Healing Potion', qty: '2', notes: '', type: 'consumable', hot: true, bonus: {} };
  const a = await p1('POST', '/api/characters', {
    data: {
      schema: 6,
      name: 'Ana',
      hbLost: 6,
      effects,
      inventory: [potion],
      hotSlots: ['hp1'],
      debuffList: [{ id: 'enraged', stacks: 1, note: '', rounds: 2 }],
    },
  });
  const b = await p2('POST', '/api/characters', {
    data: {
      schema: 6,
      name: 'Bo',
      hbLost: 3,
      skills: [
        { name: 'Catcher', rank: '2' },
        { name: 'Taunt', rank: '3' },
      ],
    },
  });
  const A = a.body.id;
  const B = b.body.id;
  for (const id of [A, B]) await dm('PATCH', `/api/characters/${id}/party`, { inParty: true });
  const sheet = async (who, id) => (await who('GET', `/api/characters/${id}`)).body.data;

  // party view: effects are public, Interrupt info only for the owner/GM
  const party = (await p2('GET', '/api/party')).body;
  assert.equal(party.find((m) => m.id === A).view.effects.length, 3);
  assert.equal(party.find((m) => m.id === A).view.interrupts, undefined);
  assert.deepEqual(party.find((m) => m.id === B).view.interrupts, { catcher: true, tauntRank: 3 });

  await dm('POST', '/api/encounter', { action: 'start', floor: 2 });
  let enc = (
    await dm('POST', '/api/encounter/opponents', { name: 'Gnoll', slots: 20, slotValue: 1, evade: '0+F', count: 2 })
  ).body;
  const [g1, g2] = enc.opponents.slice(-2).map((o) => o.id);

  // links: grab, cleared when the opponent is defeated
  enc = (
    await dm('POST', '/api/encounter/links', {
      kind: 'grab',
      a: { type: 'opponent', id: g1 },
      b: { type: 'crawler', id: A },
    })
  ).body;
  assert.equal(enc.links.length, 1);
  const seen = (await p1('GET', '/api/encounter')).body.links[0];
  assert.equal(seen.a.name, 'Gnoll 1');
  assert.equal(seen.b.name, 'Ana');

  // declarations: one on Ana (Bo will Taunt it), one on Ana for Bo to catch
  const decl = async () =>
    (
      await dm('POST', '/api/encounter/declarations', {
        opponentId: g2,
        attack: { name: 'Bite', toHit: '10+F', damage: '1d6' },
        targets: [A],
      })
    ).body.declarations.at(-1).id;
  const d1 = await decl();
  const d2 = await decl();
  await dm('POST', '/api/encounter', { action: 'next' }); // Crawler Reaction
  const taunt = await p2('POST', `/api/encounter/declarations/${d1}/taunt`, { characterId: B, expr: 'd20+80' });
  assert.equal(taunt.status, 200);
  let dd = taunt.body.declarations.find((d) => d.id === d1);
  assert.deepEqual(
    dd.targets.map((x) => x.name),
    ['Bo'],
    'the Mob attacks the taunter now',
  );
  assert.ok(taunt.body.links.some((l) => l.kind === 'taunt'));
  assert.equal(
    (await p1('POST', `/api/encounter/declarations/${d2}/catch`, { characterId: A, allyId: A })).status,
    409,
  );
  const caught = await p2('POST', `/api/encounter/declarations/${d2}/catch`, { characterId: B, allyId: A });
  assert.equal(caught.status, 200);
  dd = caught.body.declarations.find((d) => d.id === d2);
  assert.equal(dd.targets[0].name, 'Bo');
  assert.equal(dd.targets[0].caughtFor, 'Ana');
  assert.deepEqual(caught.body.actions[B].used, ['interrupt', 'interrupt']);

  // Evade degrees: a huge bonus succeeds by 10+ (Amazing) unless it's a Natural 1 or 20
  enc = (
    await dm('POST', '/api/encounter/declarations', {
      opponentId: g1,
      attack: { name: 'Claw', toHit: '10+F', damage: '1d4' },
      targets: [A],
    })
  ).body;
  const d3 = enc.declarations.at(-1).id;
  const ev = (await p1('POST', `/api/encounter/declarations/${d3}/evade`, { characterId: A, expr: 'd20+60' })).body;
  const e = ev.declarations.find((d) => d.id === d3).targets[0].evade;
  assert.ok(['amazing', 'crit', 'critFail'].includes(e.degree));
  const adv = (await sheet(p1, A)).effects.find((x) => x.kind === 'advantage');
  if (e.degree === 'critFail') {
    assert.equal(e.double, true);
    assert.equal(adv, undefined);
  } else assert.equal(adv.vsOpponent, g1, 'Advantage against that Mob');

  // Items: a Healing Potion heals 5 slots (here as an Interrupt), one fewer left
  const used = await p1('POST', `/api/characters/${A}/use-item`, { itemId: 'hp1' });
  assert.equal(used.status, 200);
  assert.equal(used.body.left, 1);
  assert.deepEqual(used.body.applied, { type: 'heal', slots: 5 });
  let sa = await sheet(p1, A);
  assert.equal(sa.hbLost, 1);
  assert.equal(sa.inventory.find((i) => i.id === 'hp1').qty, '1');
  // …on an ally, too (the last one: the row goes)
  await dm('POST', '/api/encounter', { action: 'next' });
  await dm('POST', '/api/encounter', { action: 'next' }); // step 4
  assert.equal((await p1('POST', `/api/characters/${A}/use-item`, { itemId: 'hp1' })).body.code, 'no_actions_left');
  await dm('POST', '/api/encounter/actions', { characterId: A, op: 'free', index: 1 });
  const used2 = await p1('POST', `/api/characters/${A}/use-item`, { itemId: 'hp1', targetId: B });
  assert.equal(used2.status, 200);
  assert.equal((await sheet(p2, B)).hbLost, 0);
  assert.equal(
    (await sheet(p1, A)).inventory.some((i) => i.id === 'hp1'),
    false,
  );
  const encNow = (await p1('GET', '/api/encounter')).body;
  assert.equal(encNow.actions[A].used.length, 2, 'Evade and the potion use Ana’s Actions');

  // Area attack: one roll, one Action, a result per opponent (Bo still has… no Actions: free one first)
  await dm('POST', '/api/encounter/actions', { characterId: B, op: 'free', index: 0 });
  const area = await p2('POST', '/api/encounter/attacks', {
    characterId: B,
    opponentIds: [g1, g2],
    expr: '2d20kh1+40',
    damage: '1d4',
    label: 'Fireball',
  });
  assert.equal(area.status, 201);
  const recs = area.body.attacks.filter((x) => x.label === 'Fireball');
  assert.equal(recs.length, 2);
  assert.equal(recs[0].group, recs[1].group);
  assert.equal(recs[0].total, recs[1].total);
  assert.equal(area.body.actions[B].used.filter((k) => k === 'attack').length, 1);
  if (recs[0].hit) {
    const dmg = (await p2('POST', `/api/encounter/attacks/${recs[0].id}/damage`, {})).body.attacks.filter(
      (x) => x.label === 'Fireball',
    );
    assert.ok(
      dmg.every((x) => x.damage),
      'one damage roll for the whole area',
    );
  }

  // Intervene: Bo has no Actions left now; GM frees one, then Bo adds 1d6 to Ana's Evade
  await dm('POST', '/api/encounter/actions', { characterId: B, op: 'free', index: 0 });
  const msg = (await p1('GET', '/api/messages')).body.filter((m) => m.roll?.vs?.kind === 'evade').at(-1);
  assert.equal(
    (await p1('POST', `/api/messages/${msg.id}/intervene`, { characterId: A })).status,
    409,
    'not on your own roll',
  );
  const help = await p2('POST', `/api/messages/${msg.id}/intervene`, { characterId: B });
  assert.equal(help.status, 200);
  const boosted = (await p1('GET', '/api/messages')).body.find((m) => m.id === msg.id).roll;
  assert.equal(boosted.intervene[0].name, 'Bo');
  assert.equal(boosted.total, msg.roll.total + boosted.intervene[0].value);
  assert.equal((await p2('POST', `/api/messages/${msg.id}/intervene`, { characterId: B })).status, 409, 'once');

  // Clean Up → next round: "Hasted" (1 round) ends, Enraged goes from 2 to 1; grab link stays, taunt link goes
  await dm('POST', '/api/encounter', { action: 'next' });
  enc = (await dm('POST', '/api/encounter', { action: 'next' })).body;
  sa = await sheet(p1, A);
  assert.deepEqual(
    sa.effects.filter((x) => x.kind !== 'advantage').map((x) => x.name),
    ['Blinded', 'Blessed'],
  );
  assert.equal(sa.debuffList[0].rounds, 1);
  assert.deepEqual(
    enc.links.map((l) => l.kind),
    ['grab'],
  );
  // defeating the grabber clears the link
  enc = (await dm('PATCH', `/api/encounter/opponents/${g1}`, { lost: 20 })).body;
  assert.equal(enc.links.length, 0);
  // end of combat: combat effects and timed debuffs end; a crit-failed Evade leaves a Major Injury
  await dm('POST', '/api/encounter', { action: 'end' });
  sa = await sheet(p1, A);
  assert.deepEqual(
    sa.effects.map((x) => x.name),
    ['Blessed'],
  );
  assert.equal(
    sa.debuffList.some((x) => x.id === 'enraged'),
    false,
  );
  if (e.degree === 'critFail') assert.ok(sa.debuffList.some((x) => x.id === 'majorInjury'));
  const log = (await dm('GET', '/api/messages')).body;
  assert.ok(log.some((m) => m.event?.type === 'expired' && m.event.names.includes('Hasted')));
  assert.ok(log.some((m) => m.event?.type === 'item' && m.event.target === 'Bo'));
  for (const id of [A, B]) await dm('PATCH', `/api/characters/${id}/party`, { inParty: false });
});

test('maps: fog of war, players only get the fogged image and visible POIs', async () => {
  const dm = client();
  const pl = client();
  await dm('POST', '/api/auth/login', { username: 'dm', password: 'adminpass123' });
  await pl('POST', '/api/auth/register', { username: 'mapper', password: 'password1' });
  const png =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
  const fogged =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
  assert.equal((await pl('POST', '/api/maps', { name: 'x' })).status, 403);
  assert.equal((await dm('POST', '/api/maps', { name: 'x', image: 'data:text/html;base64,AAAA' })).status, 400);
  const m = await dm('POST', '/api/maps', { name: 'Floor 1 West', floor: 1, image: png, cols: 4, rows: 3 });
  assert.equal(m.status, 201);
  const id = m.body.id;
  assert.equal((await pl('GET', '/api/maps')).body.length, 0, 'not shared yet');
  assert.equal((await pl('GET', `/api/maps/${id}`)).status, 404);
  const upd = await dm('PATCH', `/api/maps/${id}`, {
    shared: true,
    revealed: ['0,0', '1,0', '9,9'],
    pois: [
      { id: 'a', x: 0.1, y: 0.1, name: 'Saferoom', kind: 'saferoom' },
      { id: 'b', x: 0.9, y: 0.9, name: 'Boss lair', kind: 'boss', hidden: true },
    ],
    party: { x: 0.2, y: 0.1 },
    playerImage: fogged,
  });
  assert.deepEqual(upd.body.revealed, ['0,0', '1,0'], 'cells outside the grid are dropped');
  const seen = (await pl('GET', `/api/maps/${id}`)).body;
  assert.deepEqual(
    seen.pois.map((p) => p.name),
    ['Saferoom'],
  );
  assert.equal(seen.pois[0].hidden, undefined);
  assert.deepEqual(seen.party, { x: 0.2, y: 0.1 });
  // the image: players get the fogged copy, the GM the original
  const fetchAs = async (login, url) => {
    const res = await fetch(base + '/api/auth/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(login),
    });
    const cookie = res.headers.getSetCookie()[0].split(';')[0];
    const r = await fetch(base + url, { headers: { cookie } });
    return Buffer.from(await r.arrayBuffer()).toString('base64');
  };
  const playerBytes = await fetchAs({ username: 'mapper', password: 'password1' }, `/api/maps/${id}/image`);
  const gmBytes = await fetchAs({ username: 'dm', password: 'adminpass123' }, `/api/maps/${id}/image`);
  assert.equal(playerBytes, fogged.split(',')[1]);
  assert.equal(gmBytes, png.split(',')[1]);
  // a new map image resets the fogged copy until the GM's browser renders it again
  await dm('PATCH', `/api/maps/${id}`, { image: fogged });
  assert.equal((await pl('GET', `/api/maps/${id}`)).body.hasImage, false);
  assert.equal((await dm('DELETE', `/api/maps/${id}`)).status, 200);
  assert.equal((await pl('GET', '/api/maps')).body.length, 0);
});

test('"2 hours passed" runs the Level Collapse clock when the GM ties it; pre-gens are listed', async () => {
  const dm = client();
  const pl = client();
  await dm('POST', '/api/auth/login', { username: 'dm', password: 'adminpass123' });
  await pl('POST', '/api/auth/register', { username: 'clockie', password: 'password1' });
  const before = (await dm('PATCH', '/api/world', { collapseHours: 100, autoClock: false })).body;
  assert.equal(before.autoClock, false);
  await dm('POST', '/api/party/two-hours', { advance: false });
  assert.equal((await pl('GET', '/api/world')).body.collapseHours, 100, 'not tied: unchanged');
  await dm('PATCH', '/api/world', { autoClock: true });
  await dm('POST', '/api/party/two-hours', { advance: false });
  assert.equal((await pl('GET', '/api/world')).body.collapseHours, 98);
  await dm('PATCH', '/api/world', { autoClock: false });
  const pregens = (await pl('GET', '/api/pregens')).body;
  assert.equal(pregens.length, 12);
  assert.match(pregens[0].keySkills, /\w+ \d/);
});

test('book stat blocks carry Spanish rules notes', async () => {
  const dm = client();
  await dm('POST', '/api/auth/login', { username: 'dm', password: 'adminpass123' });
  await dm('POST', '/api/npcs/import-book', {});
  const list = (await dm('GET', '/api/npcs')).body;
  const withEs = list.filter((n) => n.data.source && n.data.notesEs);
  assert.ok(withEs.length >= 300);
  assert.ok(withEs.every((n) => /Texto completo|Habilidades clave/.test(n.data.notesEs)));
});

test('campaign loot: valid items, GM-only list, claimed items bring their bonuses and description', async () => {
  const { HOMEBREW_ITEMS } = await import('../server/catalog/homebrew.js');
  const { ITEM_TYPES, RARITIES, BONUS_KEYS, EQUIP_FITS, ACCESSORY_FITS } = await import('../shared/items.js');
  assert.ok(HOMEBREW_ITEMS.length >= 40);
  assert.equal(new Set(HOMEBREW_ITEMS.map((h) => h.name)).size, HOMEBREW_ITEMS.length, 'unique names');
  for (const h of HOMEBREW_ITEMS) {
    assert.ok(ITEM_TYPES.includes(h.type) && RARITIES.includes(h.rarity), h.name);
    assert.deepEqual(Object.keys(h.bonus).sort(), [...BONUS_KEYS].sort(), h.name);
    if (h.type === 'equipment') assert.ok(EQUIP_FITS.includes(h.fits), h.name);
    if (h.type === 'accessory') assert.ok(ACCESSORY_FITS.includes(h.fits), h.name);
    assert.ok(h.notes.includes('IA: «'), h.name);
  }
  const dm = client();
  const pl = client();
  await dm('POST', '/api/auth/login', { username: 'dm', password: 'adminpass123' });
  await pl('POST', '/api/auth/register', { username: 'looter', password: 'password1' });
  assert.equal((await dm('GET', '/api/catalog/all')).body.homebrew.length, HOMEBREW_ITEMS.length);
  assert.equal((await pl('GET', '/api/catalog/all')).status, 403);
  const c = await pl('POST', '/api/characters', { data: { schema: 7, name: 'Looter' } });
  const ach = await dm('POST', '/api/achievements', {
    title: 'Ring bearer',
    reward: { boxes: [{ tier: 'silver', kind: 'adventurer', items: [{ item: 'Silver Ring of Grace', qty: '1' }] }] },
    characterIds: [c.body.id],
  });
  await pl('POST', `/api/awards/${ach.body.awards[0].id}/claim`);
  const ring = (await pl('GET', `/api/characters/${c.body.id}`)).body.data.inventory.find(
    (i) => i.item === 'Silver Ring of Grace',
  );
  assert.equal(ring.bonus.dex, '2');
  assert.equal(ring.rarity, 'silver');
  assert.deepEqual([ring.type, ring.fits], ['accessory', 'finger']);
  assert.match(ring.notes, /\+2 DES/);
});

test('item categories: what can be used, Hotlist changes cost an Action in combat and can be undone, ammunition', async () => {
  const dm = client();
  const pl = client();
  await dm('POST', '/api/auth/login', { username: 'dm', password: 'adminpass123' });
  await pl('POST', '/api/auth/register', { username: 'archer', password: 'password1' });
  const base = { qty: '1', notes: '', rarity: '', unique: false, hot: false, bonus: {} };
  const inventory = [
    {
      ...base,
      id: 'bow',
      item: 'Longbow',
      type: 'equipment',
      fits: 'held',
      slot: 'eq.mainHand.1',
      skill: 'Bows',
      ranged: true,
      ammo: 'Arrow',
    },
    { ...base, id: 'arr', item: 'Arrows', type: 'ammunition', ammoType: 'Arrow', qty: '2', slot: '' },
    {
      ...base,
      id: 'ring',
      item: 'Glow Ring',
      type: 'accessory',
      fits: 'finger',
      slot: 'acc.finger.1',
      ability: 'Glows',
    },
    { ...base, id: 'rope', item: 'Rope', type: 'crafting', slot: '' },
    { ...base, id: 'wand', item: 'Wand of Sparks', type: 'consumable', maxCharges: '2', charges: '', slot: '' },
  ];
  const hotSlots = ['arr', 'ring', '', '', '', '', '', '', '', ''];
  const c = await pl('POST', '/api/characters', { data: { schema: 8, name: 'Robin', inventory, hotSlots } });
  const id = c.body.id;
  const sheet = async () => (await pl('GET', `/api/characters/${id}`)).body;

  // out of combat
  assert.equal((await pl('POST', `/api/characters/${id}/use-item`, { itemId: 'rope' })).body.code, 'not_usable');
  assert.equal((await pl('POST', `/api/characters/${id}/use-item`, { itemId: 'arr' })).body.code, 'ammo_via_attack');
  const zap = await pl('POST', `/api/characters/${id}/use-item`, { itemId: 'wand' });
  assert.equal(zap.status, 200);
  assert.equal((await sheet()).data.inventory.find((i) => i.id === 'wand').charges, '1', 'a charge, not the wand');
  const glow = await pl('POST', `/api/characters/${id}/use-item`, { itemId: 'ring' });
  assert.equal(glow.status, 200);
  assert.ok(
    (await sheet()).data.inventory.some((i) => i.id === 'ring'),
    'abilities are not used up',
  );
  assert.equal(
    (await pl('POST', `/api/characters/${id}/hotlist`, { slot: 2, itemId: 'rope' })).body.code,
    'not_hotlistable',
  );
  const calm = await pl('POST', `/api/characters/${id}/hotlist`, { slot: 2, itemId: 'wand' });
  assert.equal(calm.status, 200);
  assert.equal(calm.body.messageId, null, 'no log entry (and no Action) out of combat');

  // slot counts: only the GM
  let s = await sheet();
  await pl('PUT', `/api/characters/${id}`, {
    version: s.version,
    data: { ...s.data, slotCounts: { 'acc.finger': '12' } },
  });
  s = await sheet();
  assert.notEqual(s.data.slotCounts?.['acc.finger'], '12');
  await dm('PUT', `/api/characters/${id}`, {
    version: s.version,
    data: { ...s.data, slotCounts: { 'acc.finger': '12' } },
  });
  assert.equal((await sheet()).data.slotCounts['acc.finger'], '12');

  // in combat
  await dm('PATCH', `/api/characters/${id}/party`, { inParty: true });
  await dm('POST', '/api/encounter', { action: 'end' });
  await dm('POST', '/api/encounter', { action: 'start', floor: 1 });
  const enc = (await dm('POST', '/api/encounter/opponents', { name: 'Rat', slots: 10, slotValue: 1, evade: '1' })).body;
  const rat = enc.opponents.at(-1).id;
  const off = await pl('POST', `/api/characters/${id}/hotlist`, { slot: 2, itemId: '' });
  assert.equal(off.status, 200);
  assert.ok(off.body.messageId);
  let acts = (await pl('GET', '/api/encounter')).body.actions[id].used;
  assert.deepEqual(acts, ['hotlist']);
  assert.equal((await pl('POST', `/api/characters/${id}/use-item`, { itemId: 'wand' })).body.code, 'not_on_hotlist');
  const undo = await pl('POST', `/api/messages/${off.body.messageId}/undo`, {});
  assert.equal(undo.status, 200);
  assert.equal((await sheet()).data.hotSlots[2], 'wand');
  acts = (await pl('GET', '/api/encounter')).body.actions[id].used;
  assert.deepEqual(acts, [], 'the Action comes back');
  assert.equal((await pl('POST', `/api/messages/${off.body.messageId}/undo`, {})).body.code, 'already_undone');
  const msg = (await pl('GET', '/api/messages')).body.find((m) => m.id === off.body.messageId);
  assert.equal(msg.event.undone, true);

  // a shot spends one arrow; the last one empties its Hotlist slot
  const shot = { characterId: id, opponentId: rat, expr: 'd20+5', damage: '1d6', label: 'Bows', ammoItemId: 'arr' };
  assert.equal((await dm('POST', '/api/encounter/attacks', shot)).status, 201);
  assert.equal((await sheet()).data.inventory.find((i) => i.id === 'arr').qty, '1');
  assert.equal((await dm('POST', '/api/encounter/attacks', shot)).status, 201);
  s = await sheet();
  assert.equal(
    s.data.inventory.some((i) => i.id === 'arr'),
    false,
  );
  assert.equal(s.data.hotSlots[0], '');
  await dm('POST', '/api/encounter/actions', { characterId: id, op: 'free', index: 0 });
  assert.equal((await dm('POST', '/api/encounter/attacks', shot)).body.code, 'no_ammo');
  await dm('POST', '/api/encounter', { action: 'end' });
});
