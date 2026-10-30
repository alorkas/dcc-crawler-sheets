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
  const w = mine.awards[0];
  assert.equal(w.title, 'First Blood');
  assert.equal(w.hasReward, true);
  assert.deepEqual(w.reward.boxes[0].items, []);
  assert.equal(w.reward.boxes[0].tier, 'gold');
  assert.equal(w.reward.note, '');
  assert.equal((await other('GET', `/api/characters/${a.body.id}/awards`)).status, 404);
  assert.equal((await other('POST', `/api/awards/${w.id}/claim`)).status, 404);

  // claim (anywhere, no lock any more): the note shows, the box goes sealed to the Boxes tab
  assert.equal((await dm('PUT', '/api/rewards/settings', { claimLocked: true })).status, 404);
  const claim = await pl('POST', `/api/awards/${w.id}/claim`);
  assert.equal(claim.status, 200);
  assert.deepEqual(claim.body.opened.boxes, [{ tier: 'gold', kind: 'adventurer', label: '' }]);
  assert.equal((await pl('POST', `/api/awards/${w.id}/claim`)).status, 409, 'only once');
  assert.equal((await pl('GET', `/api/characters/${a.body.id}`)).body.data.inventory.length, 1, 'nothing yet');
  const sealed = (await pl('GET', `/api/characters/${a.body.id}/boxes`)).body;
  assert.equal(sealed.inSaferoom, false);
  assert.equal(sealed.boxes.length, 1);
  assert.equal(sealed.boxes[0].source, 'achievement');
  assert.equal(sealed.boxes[0].title, 'First Blood');
  assert.deepEqual(sealed.boxes[0].items, [], 'contents hidden');
  assert.equal((await other('GET', `/api/characters/${a.body.id}/boxes`)).status, 404);
  assert.equal((await other('POST', `/api/boxes/${sealed.boxes[0].id}/open`)).status, 404);
  assert.equal((await pl('POST', `/api/boxes/${sealed.boxes[0].id}/open`)).body.code, 'not_in_saferoom');
  // open (in a Saferoom): works on a locked sheet, items stack or get their own row, contents revealed
  await dm('PATCH', `/api/characters/${a.body.id}/saferoom`, { saferoom: true });
  const open = await pl('POST', `/api/boxes/${sealed.boxes[0].id}/open`);
  assert.equal(open.status, 200);
  assert.equal(open.body.opened.items.length, 2);
  assert.match(open.body.opened.items[0].notes, /Heals 5 HB slots/, 'description filled from the book');
  assert.equal((await pl('POST', `/api/boxes/${sealed.boxes[0].id}/open`)).status, 409, 'only once');
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
  // the log shows the claimed reward and the opened box
  const log = (await dm('GET', '/api/messages')).body;
  assert.equal(log.filter((m) => m.event?.type === 'reward').at(-1).event.boxes[0].tier, 'gold');
  assert.equal(log.filter((m) => m.event?.type === 'box').at(-1).event.items.length, 2);
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
  const taunt = await p2('POST', '/api/encounter/taunt', {
    characterId: B,
    expr: 'd20+80',
    picks: [{ declId: d1, targetId: A }],
  });
  assert.equal(taunt.status, 200);
  assert.equal(
    (await p2('POST', '/api/encounter/taunt', { characterId: B, expr: 'd20+80', picks: [{ declId: d2, targetId: A }] }))
      .status,
    409,
    'one Taunt per round',
  );
  let dd = taunt.body.declarations.find((d) => d.id === d1);
  // (a Natural 1 is a Critical Fail even with a huge bonus)
  if (dd.taunt.degree !== 'critFail') {
    assert.deepEqual(
      dd.targets.map((x) => x.name),
      ['Bo'],
      'the Mob attacks the taunter now',
    );
    assert.equal(dd.targets[0].tauntedFrom, 'Ana');
    assert.ok(taunt.body.links.some((l) => l.kind === 'taunt'));
  }
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
  // undo the last potion: Bo loses the healing again, the potion and its Hotlist slot come back, the Action too
  const potionMsg = (await p1('GET', '/api/messages')).body.filter((m) => m.event?.type === 'item').at(-1);
  assert.equal((await p2('POST', `/api/messages/${potionMsg.id}/undo`, {})).status, 404, 'not Bo’s to undo');
  assert.equal((await p1('POST', `/api/messages/${potionMsg.id}/undo`, {})).status, 200);
  assert.equal((await sheet(p2, B)).hbLost, 3);
  const anaBack = await sheet(p1, A);
  assert.equal(anaBack.inventory.find((i) => i.id === 'hp1').qty, '1');
  assert.equal(anaBack.hotSlots[0], 'hp1');
  assert.equal((await p1('GET', '/api/encounter')).body.actions[A].used.length, 1);
  await p1('POST', `/api/characters/${A}/use-item`, { itemId: 'hp1', targetId: B });

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
    reward: {
      boxes: [{ tier: 'silver', kind: 'adventurer', items: [{ item: 'Anillo de Plata del Estilazo', qty: '1' }] }],
    },
    characterIds: [c.body.id],
  });
  await dm('PATCH', `/api/characters/${ach.body.awards[0].characterId}/saferoom`, { saferoom: true });
  await pl('POST', `/api/awards/${ach.body.awards[0].id}/claim`);
  const ringBox = (await pl('GET', `/api/characters/${c.body.id}/boxes`)).body.boxes[0];
  await pl('POST', `/api/boxes/${ringBox.id}/open`);
  const ring = (await pl('GET', `/api/characters/${c.body.id}`)).body.data.inventory.find(
    (i) => i.item === 'Anillo de Plata del Estilazo',
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
  const skills = [
    { name: 'Heal', category: 'spell', rank: '1' },
    { name: 'Magic Missile', category: 'spell', rank: '2', manaCost: '3' },
  ];
  const c = await pl('POST', '/api/characters', { data: { schema: 9, name: 'Robin', inventory, hotSlots, skills } });
  const id = c.body.id;
  const sheet = async () => (await pl('GET', `/api/characters/${id}`)).body;

  // out of combat
  assert.equal((await pl('POST', `/api/characters/${id}/use-item`, { itemId: 'rope' })).body.code, 'not_usable');
  assert.equal((await pl('POST', `/api/characters/${id}/use-item`, { itemId: 'arr' })).body.code, 'ammo_via_attack');
  const zap = await pl('POST', `/api/characters/${id}/use-item`, { itemId: 'wand' });
  assert.equal(zap.status, 200);
  assert.equal((await sheet()).data.inventory.find((i) => i.id === 'wand').charges, '1', 'a charge, not the wand');
  // every use can be undone from the log: the charge comes back
  const zapMsg = (await pl('GET', '/api/messages')).body.filter((m) => m.event?.type === 'item').at(-1);
  assert.equal((await pl('POST', `/api/messages/${zapMsg.id}/undo`, {})).status, 200);
  assert.equal((await sheet()).data.inventory.find((i) => i.id === 'wand').charges, '2');
  // the last of a stack (here: the wand's last charge on its only wand) disappears, and Undo brings it back
  await pl('POST', `/api/characters/${id}/use-item`, { itemId: 'wand' });
  await pl('POST', `/api/characters/${id}/use-item`, { itemId: 'wand' });
  assert.equal(
    (await sheet()).data.inventory.some((i) => i.id === 'wand'),
    false,
  );
  const last = (await pl('GET', '/api/messages')).body.filter((m) => m.event?.type === 'item').at(-1);
  assert.equal((await pl('POST', `/api/messages/${last.id}/undo`, {})).status, 200);
  const back = (await sheet()).data.inventory.find((i) => i.id === 'wand');
  assert.deepEqual([back.qty, back.charges], ['1', '1']);
  assert.equal((await pl('POST', `/api/messages/${last.id}/undo`, {})).body.code, 'already_undone');
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
  // Spells go on the Hotlist too; Heal never does (it's always available)
  assert.equal(
    (await pl('POST', `/api/characters/${id}/hotlist`, { slot: 5, itemId: 'spell:Heal' })).body.code,
    'not_hotlistable',
  );
  assert.equal(
    (await pl('POST', `/api/characters/${id}/hotlist`, { slot: 5, itemId: 'spell:Magic Missile' })).status,
    200,
  );
  assert.equal((await sheet()).data.hotSlots[5], 'spell:Magic Missile');
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

test('loot generator: GM gives generated items, keeps a stash', async () => {
  const { generateItem, makeRng } = await import('../shared/lootgen.js');
  const dm = client();
  const pl = client();
  await dm('POST', '/api/auth/login', { username: 'dm', password: 'adminpass123' });
  await pl('POST', '/api/auth/register', { username: 'lucky', password: 'password1' });
  const c = await pl('POST', '/api/characters', { data: { schema: 9, name: 'Suertudo' } });
  const rng = makeRng(3);
  // eslint-disable-next-line no-unused-vars
  const items = [1, 2].map(() => (({ gen, ...it }) => it)(generateItem({ quality: 'gold', kind: 'armor', rng })));
  assert.equal((await pl('POST', `/api/characters/${c.body.id}/gift`, { items })).status, 403);
  const gift = await dm('POST', `/api/characters/${c.body.id}/gift`, { items });
  assert.equal(gift.status, 200);
  const inv = (await pl('GET', `/api/characters/${c.body.id}`)).body.data.inventory;
  const got = inv.find((i) => i.item === items[0].item);
  assert.equal(got.rarity, 'gold');
  assert.equal(got.fits, items[0].fits);
  assert.deepEqual(got.bonus, items[0].bonus);
  const msgs = (await pl('GET', '/api/messages')).body;
  assert.ok(msgs.some((m) => m.event?.type === 'gift' && m.characterId === c.body.id));
  // the stash
  assert.equal((await pl('GET', '/api/loot-stash')).status, 403);
  await dm('PUT', '/api/loot-stash', { items: [items[1], { item: '' }] });
  const stash = (await dm('GET', '/api/loot-stash')).body.items;
  assert.deepEqual(
    stash.map((i) => i.item),
    [items[1].item],
  );
});

test('cursed items: hidden until equipped, then stuck (only the GM can take them off)', async () => {
  const { generateItem, makeRng } = await import('../shared/lootgen.js');
  const dm = client();
  const pl = client();
  await dm('POST', '/api/auth/login', { username: 'dm', password: 'adminpass123' });
  await pl('POST', '/api/auth/register', { username: 'cursee', password: 'password1' });
  const c = await pl('POST', '/api/characters', { data: { schema: 9, name: 'Gafe' } });
  const id = c.body.id;
  // eslint-disable-next-line no-unused-vars
  const { gen, ...ring } = generateItem({ fixed: { curse: '*', base: 'Anillo', quality: 'gold' }, rng: makeRng(5) });
  await dm('POST', `/api/characters/${id}/gift`, { items: [ring] });
  let mine = (await pl('GET', `/api/characters/${id}`)).body;
  let it = mine.data.inventory.find((i) => i.item === ring.item);
  assert.equal(it.curse, null, 'the player does not see the curse');
  const gm = (await dm('GET', `/api/characters/${id}`)).body.data.inventory.find((i) => i.item === ring.item);
  assert.equal(gm.curse.revealed, false, 'the GM does');
  // equip it
  const inv = mine.data.inventory.map((i) => (i.id === it.id ? { ...i, slot: 'acc.finger.1' } : i));
  const put = await pl('PUT', `/api/characters/${id}`, {
    version: mine.version,
    data: { ...mine.data, inventory: inv },
  });
  assert.equal(put.body.serverChanged, true);
  it = put.body.data.inventory.find((i) => i.id === it.id);
  assert.equal(it.curse.revealed, true);
  assert.match(it.notes, /Maldito/);
  const msgs = (await pl('GET', '/api/messages')).body;
  assert.ok(msgs.some((m) => m.event?.type === 'cursed' && m.characterId === id));
  // try to take it off
  mine = (await pl('GET', `/api/characters/${id}`)).body;
  const off = mine.data.inventory.map((i) => (i.id === it.id ? { ...i, slot: '' } : i));
  await pl('PUT', `/api/characters/${id}`, { version: mine.version, data: { ...mine.data, inventory: off } });
  mine = (await pl('GET', `/api/characters/${id}`)).body;
  assert.equal(mine.data.inventory.find((i) => i.id === it.id).slot, 'acc.finger.1');
});

test('Spanish names: lookup by either name, translations only for the names asked for', async () => {
  const pl = client();
  await pl('POST', '/api/auth/register', { username: 'esplayer', password: 'password1' });
  const fb = await pl('GET', `/api/catalog/lookup?name=${encodeURIComponent('Bola de Fuego')}`);
  assert.equal(fb.body.entry.name, 'Fireball');
  assert.equal(fb.body.entry.nameEs, 'Bola de Fuego');
  assert.equal((await pl('GET', '/api/catalog/lookup?name=Porra')).body.entry.name, 'Club');
  const tr = await pl('POST', '/api/catalog/translate', {
    names: ['Fireball', 'Healing Potion', 'Tire Iron (Club)', 'Not A Thing'],
  });
  assert.deepEqual(tr.body, {
    Fireball: 'Bola de Fuego',
    'Healing Potion': 'Poción de Curación',
    'Tire Iron (Club)': 'Tire Iron (Porra)',
  });
  assert.equal((await client()('POST', '/api/catalog/translate', { names: ['Fireball'] })).status, 401);
});

test('quests: assigned (no declining), shared objectives, completion gives Levels at once, boxes open in a Saferoom', async () => {
  const dm = client();
  const pl = client();
  const other = client();
  await dm('POST', '/api/auth/login', { username: 'dm', password: 'adminpass123' });
  await pl('POST', '/api/auth/register', { username: 'questp1', password: 'password1' });
  await other('POST', '/api/auth/register', { username: 'questp2', password: 'password1' });
  const a = await pl('POST', '/api/characters', { data: { schema: 9, name: 'Hero', level: '3', statPoints: '0' } });
  const b = await other('POST', '/api/characters', { data: { schema: 9, name: 'Loner', level: '3' } });
  await dm('PATCH', `/api/characters/${a.body.id}/party`, { inParty: true });

  const body = {
    title: 'La mixtape perdida',
    description: 'Un goblin quiere su cinta.',
    giver: 'Goblin DJ',
    floor: 2,
    objectives: [
      { id: 'a', text: 'Encontrar la cinta' },
      { id: 'b', text: 'Devolverla' },
    ],
    reward: {
      boxes: [{ tier: 'silver', kind: 'adventurer', items: [{ item: 'Healing Potion', qty: '2' }] }],
      note: 'El goblin te debe una',
      levels: 2,
    },
    penalty: 'El goblin te pone en su lista negra',
    characterIds: [a.body.id, b.body.id],
  };
  assert.equal((await pl('POST', '/api/quests', body)).status, 403);
  assert.equal((await dm('POST', '/api/quests', { ...body, title: '' })).status, 400);
  const q = await dm('POST', '/api/quests', body);
  assert.equal(q.status, 201);
  assert.equal(q.body.crawlers.length, 2);
  assert.equal(q.body.penalty, 'El goblin te pone en su lista negra');

  // the player sees the quest, the penalty, the box (sealed) and the Levels; not someone else's
  const mine = (await pl('GET', `/api/characters/${a.body.id}/quests`)).body;
  const link = mine.quests[0];
  assert.equal(link.penalty, 'El goblin te pone en su lista negra');
  assert.equal(link.reward.levels, 2);
  assert.deepEqual(link.reward.boxes[0].items, []);
  assert.equal(link.grantedAt, null);
  assert.equal((await other('GET', `/api/characters/${a.body.id}/quests`)).status, 404);
  assert.equal((await pl('POST', `/api/quest-crawlers/${link.linkId}/answer`, { answer: 'declined' })).status, 404);

  // players only see the steps unlocked so far: the first one, until it's done
  assert.deepEqual(
    link.objectives.map((o) => o.id),
    ['a'],
  );
  // only the GM ticks steps (the System AI decides); they're shared by everyone on the quest
  assert.equal((await other('POST', `/api/quest-crawlers/${link.linkId}/objectives/a`, { done: true })).status, 403);
  assert.equal((await pl('POST', `/api/quest-crawlers/${link.linkId}/objectives/a`, { done: true })).status, 403);
  assert.equal((await dm('POST', `/api/quest-crawlers/${link.linkId}/objectives/a`, { done: true })).status, 200);
  const bl = (await other('GET', `/api/characters/${b.body.id}/quests`)).body.quests[0];
  assert.equal(bl.objectives[0].done, true);
  // the next step shows up once the one before is done
  assert.deepEqual(
    bl.objectives.map((o) => o.id),
    ['a', 'b'],
  );

  // completed: the Levels go onto the sheets at once (every crawler on it), the boxes to their Boxes tab
  const full = (await dm('GET', '/api/quests')).body.find((x) => x.id === q.body.id);
  await dm('PUT', `/api/quests/${q.body.id}`, { ...full, status: 'completed' });
  let data = (await pl('GET', `/api/characters/${a.body.id}`)).body.data;
  assert.equal(data.level, '5');
  assert.equal(data.statPoints, '6');
  assert.equal(data.levelLog.at(-1).source, 'quest');
  assert.equal(
    data.inventory?.find((i) => i.item === 'Healing Potion'),
    undefined,
  );
  assert.equal((await other('GET', `/api/characters/${b.body.id}`)).body.data.level, '5');
  // reopening and completing again doesn't give anything twice; editing the reward doesn't change what they got
  await dm('PUT', `/api/quests/${q.body.id}`, { ...full, status: 'active' });
  await dm('PUT', `/api/quests/${q.body.id}`, {
    ...full,
    status: 'completed',
    reward: { ...full.reward, boxes: [{ tier: 'bronze', kind: 'boss', items: [{ item: 'Torch', qty: '1' }] }] },
  });
  assert.equal((await pl('GET', `/api/characters/${a.body.id}`)).body.data.level, '5');
  const done = (await pl('GET', `/api/characters/${a.body.id}/quests`)).body.quests[0];
  assert.ok(done.grantedAt);
  assert.equal(done.reward.boxes[0].tier, 'silver');
  const myBoxes = (await pl('GET', `/api/characters/${a.body.id}/boxes`)).body.boxes;
  assert.equal(myBoxes.length, 1);
  assert.equal(myBoxes[0].source, 'quest');
  assert.equal(myBoxes[0].tier, 'silver');

  // boxes only open in a Saferoom: the party's switch for party members, their own one for anyone else
  const notSafe = await pl('POST', `/api/boxes/${myBoxes[0].id}/open`);
  assert.equal(notSafe.status, 423);
  assert.equal(notSafe.body.code, 'not_in_saferoom');
  await dm('PATCH', `/api/characters/${a.body.id}/saferoom`, { saferoom: true });
  assert.equal((await pl('POST', `/api/boxes/${myBoxes[0].id}/open`)).status, 423, 'party follows World Stats');
  assert.equal((await pl('PATCH', '/api/world', { saferoom: true })).status, 403);
  await dm('PATCH', '/api/world', { saferoom: true });
  assert.equal((await pl('GET', '/api/world')).body.saferoom, true);
  assert.equal((await pl('GET', `/api/characters/${a.body.id}/boxes`)).body.inSaferoom, true);
  const theirBox = (await other('GET', `/api/characters/${b.body.id}/boxes`)).body.boxes[0];
  assert.equal((await other('POST', `/api/boxes/${theirBox.id}/open`)).status, 423, 'not in the party');

  const open = await pl('POST', `/api/boxes/${myBoxes[0].id}/open`);
  assert.equal(open.status, 200);
  assert.equal(open.body.opened.items[0].item, 'Healing Potion');
  assert.equal((await pl('POST', `/api/boxes/${myBoxes[0].id}/open`)).status, 409, 'only once');
  data = (await pl('GET', `/api/characters/${a.body.id}`)).body.data;
  assert.equal(data.inventory.find((i) => i.item === 'Healing Potion').qty, '2');
  assert.equal(data.level, '5');
  assert.ok((await pl('GET', `/api/characters/${a.body.id}/boxes`)).body.boxes[0].openedAt);

  await dm('PATCH', `/api/characters/${b.body.id}/saferoom`, { saferoom: true });
  assert.equal((await other('GET', `/api/characters/${b.body.id}`)).body.saferoom, true);
  assert.equal((await other('POST', `/api/boxes/${theirBox.id}/open`)).status, 200);
  await dm('PATCH', '/api/world', { saferoom: false });

  // log: assigned, completed (with Levels and boxes), boxes opened; the Saferoom announced
  const log = (await dm('GET', '/api/messages')).body;
  const qlog = log.filter((m) => m.event?.type === 'quest');
  for (const action of ['offered', 'completed'])
    assert.ok(
      qlog.some((m) => m.event.action === action),
      action,
    );
  assert.equal(qlog.find((m) => m.event.action === 'completed').event.levels, 2);
  assert.ok(log.some((m) => m.event?.type === 'world' && m.event.action === 'saferoom' && m.event.on));

  // failing announces the penalty; a quest without boxes needs no Saferoom
  const f = await dm('POST', '/api/quests', {
    title: 'Sin cajas',
    penalty: 'Pierdes la dignidad',
    characterIds: [a.body.id],
  });
  await dm('PUT', `/api/quests/${f.body.id}`, { ...f.body, status: 'failed' });
  const failed = (await dm('GET', '/api/messages')).body.filter((m) => m.event?.action === 'failed');
  assert.equal(failed.at(-1).event.penalty, 'Pierdes la dignidad');
  const lv = await dm('POST', '/api/quests', {
    title: 'Solo niveles',
    reward: { levels: 1 },
    characterIds: [a.body.id],
  });
  await dm('PUT', `/api/quests/${lv.body.id}`, { ...lv.body, reward: { levels: 1 }, status: 'completed' });
  assert.equal((await pl('GET', `/api/characters/${a.body.id}`)).body.data.level, '6');

  // added to a completed quest: rewarded at once
  const c = await other('POST', '/api/characters', { data: { schema: 9, name: 'Late', level: '1' } });
  await dm('POST', `/api/quests/${lv.body.id}/crawlers`, { characterIds: [c.body.id] });
  assert.equal((await other('GET', `/api/characters/${c.body.id}`)).body.data.level, '2');

  // hidden quests stay GM-only until closed; taking crawlers off; deleting
  const h = await dm('POST', '/api/quests', { title: 'Secreta', hidden: true, characterIds: [a.body.id] });
  const visible = (await pl('GET', `/api/characters/${a.body.id}/quests`)).body.quests.length;
  assert.equal((await dm('GET', `/api/characters/${a.body.id}/quests`)).body.quests.length, visible + 1);
  const more = await dm('POST', `/api/quests/${h.body.id}/crawlers`, { characterIds: [a.body.id, b.body.id] });
  assert.equal(more.body.crawlers.length, 2);
  const gone = await dm('DELETE', `/api/quests/${h.body.id}/crawlers/${more.body.crawlers[1].id}`);
  assert.equal(gone.body.crawlers.length, 1);
  assert.equal((await dm('DELETE', `/api/quests/${h.body.id}`)).status, 200);
  assert.equal((await dm('GET', `/api/characters/${a.body.id}/quests`)).body.quests.length, visible);
});

test('Boxes tab: the GM sends boxes (own or sponsor), gold goes to the wallet, only the GM changes the wallet', async () => {
  const dm = client();
  const pl = client();
  await dm('POST', '/api/auth/login', { username: 'dm', password: 'adminpass123' });
  await pl('POST', '/api/auth/register', { username: 'walletp', password: 'password1' });
  const a = await pl('POST', '/api/characters', {
    data: {
      schema: 9,
      name: 'Rich',
      inventory: [{ id: 'g1', item: 'Torch', qty: '1', type: 'consumable', bonus: {} }],
    },
  });
  const id = a.body.id;
  assert.equal((await pl('POST', `/api/characters/${id}/boxes`, { boxes: [{ tier: 'gold' }] })).status, 403);
  const sent = await dm('POST', `/api/characters/${id}/boxes`, {
    source: 'sponsor',
    title: 'Borant Corp',
    boxes: [
      {
        tier: 'silver',
        kind: 'benefactor',
        items: [
          { item: 'Torch', qty: '2' },
          { item: 'Oro', qty: '30' },
        ],
        gold: 20,
      },
    ],
  });
  assert.equal(sent.status, 201);
  const list = (await pl('GET', `/api/characters/${id}/boxes`)).body.boxes;
  assert.equal(list[0].source, 'sponsor');
  assert.equal(list[0].title, 'Borant Corp');
  assert.equal(list[0].gold, 0, 'hidden until opened');
  assert.equal((await dm('GET', `/api/characters/${id}/boxes`)).body.boxes[0].gold, 50, 'GM sees it');
  // the GM opens it anywhere (players need a Saferoom); gold → wallet, items → inventory
  const open = await dm('POST', `/api/boxes/${list[0].id}/open`);
  assert.equal(open.body.opened.gold, 50);
  assert.deepEqual(
    open.body.opened.items.map((i) => i.item),
    ['Torch'],
  );
  let data = (await pl('GET', `/api/characters/${id}`)).body.data;
  assert.equal(data.gold, '50');
  assert.equal(data.inventory.find((i) => i.item === 'Torch').qty, '3');
  // players can't change their wallet; the GM can (logged)
  await pl('PUT', `/api/characters/${id}`, {
    data: { ...data, gold: '9999' },
    version: (await pl('GET', `/api/characters/${id}`)).body.version,
  });
  assert.equal((await pl('GET', `/api/characters/${id}`)).body.data.gold, '50');
  const v = (await dm('GET', `/api/characters/${id}`)).body;
  await dm('PUT', `/api/characters/${id}`, { data: { ...v.data, gold: '40' }, version: v.version });
  assert.equal((await pl('GET', `/api/characters/${id}`)).body.data.gold, '40');
  const log = (await dm('GET', '/api/messages')).body;
  assert.ok(log.some((m) => m.event?.type === 'gold' && m.event.from === 50 && m.event.to === 40));
  assert.ok(log.some((m) => m.event?.type === 'boxes' && m.event.title === 'Borant Corp'));
  assert.ok(log.some((m) => m.event?.type === 'box' && m.event.gold === 50));
  // gifts of gold go to the wallet too
  await dm('POST', `/api/characters/${id}/gift`, { items: [{ item: 'Oro', qty: '5' }] });
  assert.equal((await pl('GET', `/api/characters/${id}`)).body.data.gold, '45');
  // the GM can take back a sealed box
  await dm('POST', `/api/characters/${id}/boxes`, { boxes: [{ tier: 'bronze' }] });
  const sealed = (await pl('GET', `/api/characters/${id}/boxes`)).body.boxes.find((b) => !b.openedAt);
  assert.equal((await pl('DELETE', `/api/boxes/${sealed.id}`)).status, 403);
  assert.equal((await dm('DELETE', `/api/boxes/${sealed.id}`)).status, 200);
  assert.equal((await pl('GET', `/api/characters/${id}/boxes`)).body.boxes.length, 1);
});

test('campaign spells and skills: GM-only lookups, spellbooks teach or level up, rewards teach skills', async () => {
  const dm = client();
  const pl = client();
  await dm('POST', '/api/auth/login', { username: 'dm', password: 'adminpass123' });
  await pl('POST', '/api/auth/register', { username: 'spellreader', password: 'password1' });
  // looked up by exact name (players only get what they ask for); the GM lists them all
  const hit = (await pl('GET', '/api/catalog/lookup?name=Pistolero')).body;
  assert.equal(hit.kind, 'spell');
  assert.equal(hit.entry.manaCost, '1');
  assert.equal(hit.entry.overcharge, true);
  assert.match(hit.entry.tags, /«.+» · ⚡ Sobrecarga/);
  assert.equal((await pl('GET', '/api/catalog/lookup?name=Suplex')).body.entry.subtype, 'handToHand');
  const all = (await dm('GET', '/api/catalog/all')).body;
  assert.ok(all.spells.some((s) => s.name === 'Bola de Grasa' && s.homebrew));
  assert.ok(all.weapons.some((s) => s.name === 'Rematar'));

  const c = await pl('POST', '/api/characters', {
    data: {
      schema: 9,
      name: 'Lector',
      skills: [{ name: '', rank: '' }],
      inventory: [
        { id: 'b1', item: 'Libro de Hechizos: Pistolero', qty: '2', type: 'special', bonus: {} },
        { id: 'b2', item: 'Libro de Hechizos: Hechizo Inventado', qty: '1', type: 'special', bonus: {} },
        { id: 't1', item: 'Torch', qty: '1', type: 'consumable', bonus: {} },
      ],
    },
  });
  const id = c.body.id;
  let r = await pl('POST', `/api/characters/${id}/read-book`, { itemId: 'b1' });
  assert.deepEqual(r.body, { name: 'Pistolero', rank: 1, raised: false });
  let data = (await pl('GET', `/api/characters/${id}`)).body.data;
  const sk = data.skills.find((s) => s.name === 'Pistolero');
  assert.equal(sk.category, 'spell');
  assert.equal(sk.manaCost, '1');
  assert.equal(sk.overcharge, true);
  assert.match(sk.notes, /^N5:/);
  assert.equal(data.skills.length, 1, 'the blank template row was used');
  assert.equal(data.inventory.find((i) => i.id === 'b1').qty, '1');
  // a second copy raises it a Level and the book is used up
  r = await pl('POST', `/api/characters/${id}/read-book`, { itemId: 'b1' });
  assert.equal(r.body.rank, 2);
  data = (await pl('GET', `/api/characters/${id}`)).body.data;
  assert.equal(
    data.inventory.find((i) => i.id === 'b1'),
    undefined,
  );
  assert.equal((await pl('POST', `/api/characters/${id}/read-book`, { itemId: 'b2' })).body.code, 'unknown_spell');
  assert.equal((await pl('POST', `/api/characters/${id}/read-book`, { itemId: 't1' })).body.code, 'not_a_spellbook');

  // an achievement teaches a skill; the player sees which only once claimed
  await dm('PATCH', `/api/characters/${id}/party`, { inParty: true });
  const ach = await dm('POST', '/api/achievements', {
    title: 'Pelea de bar',
    reward: { skills: ['Cabezazo de Bar', 'Pistolero'] },
    characterIds: [id],
  });
  const w = (await pl('GET', `/api/characters/${id}/awards`)).body.awards[0];
  assert.deepEqual(w.reward.skills, []);
  assert.equal(w.skillCount, 2);
  const claim = await pl('POST', `/api/awards/${w.id}/claim`);
  assert.deepEqual(claim.body.opened.skills, ['Cabezazo de Bar', 'Pistolero']);
  data = (await pl('GET', `/api/characters/${id}`)).body.data;
  assert.equal(data.skills.find((s) => s.name === 'Cabezazo de Bar').category, 'combat');
  assert.equal(data.skills.find((s) => s.name === 'Pistolero').rank, '3');
  const log = (await dm('GET', '/api/messages')).body.filter((m) => m.event?.type === 'learned');
  assert.ok(log.some((m) => m.event.source === 'book' && m.event.name === 'Pistolero'));
  assert.ok(log.some((m) => m.event.source === 'achievement' && m.event.name === 'Cabezazo de Bar'));
  assert.ok(ach.body.id);

  // a completed quest teaches too
  const q = await dm('POST', '/api/quests', { title: 'Clases', reward: { skills: ['Rematar'] }, characterIds: [id] });
  await dm('PUT', `/api/quests/${q.body.id}`, { ...q.body, status: 'completed' });
  data = (await pl('GET', `/api/characters/${id}`)).body.data;
  assert.equal(data.skills.find((s) => s.name === 'Rematar').subtype, 'damageEffect');
});

test('session import: achievements, quests (to the party), stat blocks, book stat blocks and stash; safe to repeat', async () => {
  const dm = client();
  const pl = client();
  await dm('POST', '/api/auth/login', { username: 'dm', password: 'adminpass123' });
  await pl('POST', '/api/auth/register', { username: 'importee', password: 'password1' });
  const c = await pl('POST', '/api/characters', { data: { schema: 9, name: 'Party' } });
  await dm('PATCH', `/api/characters/${c.body.id}/party`, { inParty: true });
  const file = {
    title: 'Sesión de prueba',
    achievements: [
      {
        title: 'Importado',
        description: '«Texto de la IA»',
        gmNote: 'Quién: todos',
        reward: {
          boxes: [
            {
              label: 'Prueba',
              kind: 'food',
              tier: 'bronze',
              items: [
                { item: 'Torch', qty: '1' },
                { item: 'Anillo A', oneOf: 'd4' },
                { item: 'Anillo B', oneOf: 'd4' },
              ],
            },
          ],
        },
      },
    ],
    quests: [{ title: 'Misión importada', assign: 'party', reward: { levels: 1 } }],
    npcs: [{ name: 'Jefa Importada', kind: 'boss', attacks: [{ name: 'Golpe', toHit: '12+F', damage: '1d6' }] }],
    bookNpcs: ['Goblin', 'Nadie Inventado'],
    stash: [{ item: 'Corona de Prueba', type: 'equipment', fits: 'head', bonus: { cha: '2' } }],
  };
  assert.equal((await pl('POST', '/api/admin/import', file)).status, 403);
  assert.equal((await dm('POST', '/api/admin/import', { format: 'other' })).body.code, 'bad_import');
  assert.equal((await dm('POST', '/api/admin/import', { version: 99, quests: [{}] })).body.code, 'import_too_new');
  assert.equal((await dm('POST', '/api/admin/import', { title: 'x' })).body.code, 'import_empty');
  // a dry run reports without writing
  const dry = (await dm('POST', '/api/admin/import?dryRun=1', file)).body;
  assert.equal(dry.dryRun, true);
  assert.deepEqual(dry.report.achievements, [{ name: 'Importado', status: 'added' }]);
  assert.equal(
    (await dm('GET', '/api/achievements')).body.some((a) => a.title === 'Importado'),
    false,
  );
  const r = (await dm('POST', '/api/admin/import', { format: 'dcc-crawler-sheets/import', version: 1, ...file })).body;
  assert.equal(r.title, 'Sesión de prueba');
  assert.deepEqual(r.counts.achievements, { added: 1 });
  assert.deepEqual(r.counts.quests, { added: 1 });
  assert.deepEqual(r.counts.npcs, { added: 1 });
  assert.equal((r.counts.bookNpcs.added ?? 0) + (r.counts.bookNpcs.exists ?? 0), 1);
  assert.deepEqual(
    r.report.bookNpcs.find((x) => x.status === 'unknown'),
    { name: 'Nadie Inventado', status: 'unknown' },
  );
  assert.deepEqual(r.counts.stash, { added: 1 });
  const again = (await dm('POST', '/api/admin/import', file)).body;
  assert.deepEqual(
    [again.counts.achievements, again.counts.quests, again.counts.npcs, again.counts.stash],
    [{ exists: 1 }, { exists: 1 }, { exists: 1 }, { exists: 1 }],
  );

  const ach = (await dm('GET', '/api/achievements')).body.find((a) => a.title === 'Importado');
  assert.equal(ach.gmNote, 'Quién: todos');
  assert.equal(ach.reward.boxes[0].kind, 'food');
  assert.equal(ach.reward.boxes[0].items[1].oneOf, 'd4');
  assert.equal((await pl('GET', `/api/characters/${c.body.id}/quests`)).body.quests[0].title, 'Misión importada');
  // the random group: only one of the rings comes out
  await dm('POST', `/api/achievements/${ach.id}/awards`, { characterIds: [c.body.id] });
  const w = (await pl('GET', `/api/characters/${c.body.id}/awards`)).body.awards[0];
  assert.equal(w.gmNote, undefined, 'players never get the GM note');
  await pl('POST', `/api/awards/${w.id}/claim`);
  const box = (await pl('GET', `/api/characters/${c.body.id}/boxes`)).body.boxes[0];
  const opened = (await dm('POST', `/api/boxes/${box.id}/open`)).body.opened;
  assert.equal(opened.items.length, 2);
  assert.equal(opened.items.filter((i) => i.item.startsWith('Anillo')).length, 1);
  assert.equal(
    opened.items.some((i) => 'oneOf' in i),
    false,
  );
  const stash = (await dm('GET', '/api/loot-stash')).body.items;
  assert.ok(stash.some((i) => i.item === 'Corona de Prueba' && i.bonus.cha === '2'));
});

test('party name and leader, kill counters, giving and showing items, AI Favor from rewards and fights', async () => {
  const dm = client();
  const p1 = client();
  const p2 = client();
  await dm('POST', '/api/auth/login', { username: 'dm', password: 'adminpass123' });
  await p1('POST', '/api/auth/register', { username: 'leadp1', password: 'password1' });
  await p2('POST', '/api/auth/register', { username: 'leadp2', password: 'password1' });
  // clear whoever earlier tests left in the party
  for (const m of (await dm('GET', '/api/party')).body)
    await dm('PATCH', `/api/characters/${m.id}/party`, { inParty: false });
  const ring = {
    id: 'r1',
    item: 'Anillo del Fogonero',
    qty: '1',
    type: 'accessory',
    fits: 'finger',
    slot: 'acc.finger.1',
  };
  ring.bonus = { con: '2' };
  const stats = (v) => ({
    str: { unenhanced: v },
    int: { unenhanced: v },
    con: { unenhanced: v },
    dex: { unenhanced: v },
  });
  const a = await p1('POST', '/api/characters', {
    data: {
      schema: 10,
      name: 'Fuerte',
      stats: { ...stats('5'), cha: { unenhanced: '5' } },
      inventory: [ring, { id: 'p1', item: 'Healing Potion', qty: '3', type: 'consumable', notes: 'Cura 2 casillas' }],
      skills: [{ name: 'Dirt Clod', category: 'spell', aiFavor: '2' }],
    },
  });
  const b = await p2('POST', '/api/characters', { data: { schema: 10, name: 'Flojo', stats: stats('3') } });
  await dm('PATCH', `/api/characters/${a.body.id}/party`, { inParty: true });
  await dm('PATCH', `/api/characters/${b.body.id}/party`, { inParty: true });

  // the leader is the crawler with the highest Stat total (gear included: 25 + 2); Enhanced = Unenhanced + gear
  let party = (await p2('GET', '/api/party')).body;
  const lead = party.find((m) => m.leader);
  assert.equal(lead.id, a.body.id);
  assert.equal(lead.view.statTotal, 27);
  assert.equal(lead.view.stats.con.enhanced, '7');
  // only the leader (or the GM) renames the party
  assert.equal((await p2('PATCH', '/api/party/name', { name: 'Los Flojos' })).status, 403);
  assert.equal((await p1('PATCH', '/api/party/name', { name: 'Los Fogoneros' })).body.partyName, 'Los Fogoneros');
  // the GM can name another leader, then go back to automatic
  await dm('PATCH', '/api/world', { leaderId: b.body.id });
  party = (await p1('GET', '/api/party')).body;
  assert.equal(party.find((m) => m.leader).id, b.body.id);
  assert.equal((await p1('PATCH', '/api/party/name', { name: 'Otro' })).status, 403);
  await dm('PATCH', '/api/world', { leaderId: null });
  assert.equal((await dm('GET', '/api/world')).body.leaderId, null);

  // kill counters: GM only
  const sheetA = (await p1('GET', `/api/characters/${a.body.id}`)).body;
  await p1('PUT', `/api/characters/${a.body.id}`, {
    data: { ...sheetA.data, killCount: { crawlers: '9' } },
    version: sheetA.version,
  });
  assert.equal((await p1('GET', `/api/characters/${a.body.id}`)).body.data.killCount?.crawlers || '', '');
  const gmA = (await dm('GET', `/api/characters/${a.body.id}`)).body;
  await dm('PUT', `/api/characters/${a.body.id}`, {
    data: { ...gmA.data, killCount: { crawlers: '2', top10: '1', bosses: '1', cityBosses: '' } },
    version: gmA.version,
  });
  party = (await p2('GET', '/api/party')).body;
  assert.equal(party.find((m) => m.id === a.body.id).view.killCount.crawlers, '2');

  // giving: only to another crawler in the party; the stack splits and the log carries the item card
  assert.equal(
    (await p2('POST', `/api/characters/${a.body.id}/give-item`, { itemId: 'p1', toId: b.body.id })).status,
    404,
  );
  const gave = await p1('POST', `/api/characters/${a.body.id}/give-item`, { itemId: 'p1', toId: b.body.id, qty: 2 });
  assert.equal(gave.status, 200);
  assert.equal(gave.body.left, 1);
  const invB = (await p2('GET', `/api/characters/${b.body.id}`)).body.data.inventory;
  assert.equal(invB.find((i) => i.item === 'Healing Potion').qty, '2');
  // an equipped item comes off when given
  await p1('POST', `/api/characters/${a.body.id}/give-item`, { itemId: 'r1', toId: b.body.id });
  const ringB = (await p2('GET', `/api/characters/${b.body.id}`)).body.data.inventory.find((i) => i.item === ring.item);
  assert.equal(ringB.slot, '');
  const log = (await p2('GET', '/api/messages')).body;
  const msgs = log.messages ?? log;
  const trade = msgs.filter((m) => m.event?.type === 'trade').at(-1);
  assert.equal(trade.event.to, 'Flojo');
  assert.equal(trade.event.card.bonus.con, '2');
  // showing an item in the chat
  const shown = await p2('POST', `/api/characters/${b.body.id}/show-item`, { itemId: ringB.id });
  assert.equal(shown.status, 200);
  const after = (await p1('GET', '/api/messages')).body;
  const show = (after.messages ?? after).filter((m) => m.event?.type === 'show').at(-1);
  assert.equal(show.event.card.item, ring.item);

  // AI Favor from an achievement: its own field, or "+1 Favor de la IA" in the note
  const before = Number((await p1('GET', `/api/characters/${a.body.id}`)).body.data.dr?.aiFavor) || 0;
  for (const reward of [{ aiFavor: 2 }, { note: '+1 Favor de la IA' }]) {
    const ach = await dm('POST', '/api/achievements', {
      title: `Favor ${JSON.stringify(reward)}`,
      reward,
      characterIds: [a.body.id],
    });
    assert.equal(ach.status, 201);
    const w = (await p1('GET', `/api/characters/${a.body.id}/awards`)).body.awards.find(
      (x) => x.achievementId === ach.body.id,
    );
    assert.equal((await p1('POST', `/api/awards/${w.id}/claim`)).status, 200);
  }
  assert.equal(Number((await p1('GET', `/api/characters/${a.body.id}`)).body.data.dr.aiFavor), before + 3);

  // a fight of 3+ rounds where most attacks were a Spell with an AI Favor rating: the GM gets an offer
  await dm('POST', '/api/encounter', { action: 'start' });
  const opp = await dm('POST', '/api/encounter/opponents', { name: 'Rata', slots: 10, evade: '5' });
  const oid = (opp.body.opponents ?? []).find((o) => o.name.startsWith('Rata'))?.id;
  for (let r = 0; r < 3; r++) {
    await dm('POST', '/api/encounter/attacks', {
      characterId: a.body.id,
      opponentId: oid,
      expr: 'd20+3',
      label: 'Dirt Clod',
    });
    await dm('POST', '/api/encounter', { action: 'next' });
    await dm('POST', '/api/encounter', { action: 'next' });
    await dm('POST', '/api/encounter', { action: 'next' });
    await dm('POST', '/api/encounter', { action: 'next' });
    await dm('POST', '/api/encounter', { action: 'next' });
  }
  const ended = (await dm('POST', '/api/encounter', { action: 'end' })).body;
  const offer = ended.favorOffers.find((o) => o.characterId === a.body.id);
  assert.equal(offer.attack, 'Dirt Clod');
  assert.equal(offer.rating, 2);
  assert.equal((await p1('GET', '/api/encounter')).body.favorOffers, undefined, 'players never see the offers');
  const given = (await dm('POST', `/api/encounter/favor-offers/${a.body.id}`, { accept: true })).body;
  assert.equal(given.favorOffers.length, 0);
  assert.equal(Number((await p1('GET', `/api/characters/${a.body.id}`)).body.data.dr.aiFavor), before + 5);
});

test('bad request bodies get a JSON error without a stack trace; compressed bodies are refused', async () => {
  const bad = await fetch(`${base}/api/auth/login`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: '{bad',
  });
  assert.equal(bad.status, 400);
  const body = await bad.json();
  assert.equal(body.code, 'bad_request');
  assert.ok(!JSON.stringify(body).includes('at '), 'no stack trace');
  const br = await fetch(`${base}/api/auth/login`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'content-encoding': 'br' },
    body: 'xx',
  });
  assert.equal(br.status, 415);
  assert.equal((await br.json()).code, 'bad_request');
});

test('Dodge on Evade, Taunt and Catcher upgrades, Damage Effects on attacks, the game clock', async () => {
  const dm = client();
  const pl = client();
  await dm('POST', '/api/auth/login', { username: 'dm', password: 'adminpass123' });
  await pl('POST', '/api/auth/register', { username: 'brawler1', password: 'password1' });
  for (const m of (await dm('GET', '/api/party')).body)
    await dm('PATCH', `/api/characters/${m.id}/party`, { inParty: false });
  const mk = async (name, skills) =>
    (await pl('POST', '/api/characters', { data: { schema: 10, name, skills } })).body.id;
  const A = await mk('Puños', [
    { name: 'Pugilism', category: 'combat', subtype: 'handToHand', rank: '3', attackType: 'melee' },
    { name: 'Iron Punch', category: 'combat', subtype: 'damageEffect', rank: '5' },
    { name: 'Powerful Strike', category: 'combat', subtype: 'damageEffect', rank: '3' },
    { name: 'Bow', category: 'combat', subtype: 'ranged', rank: '2', attackType: 'ranged' },
    { name: 'Dodge', category: 'utility', subtype: 'passive', rank: '10' },
    {
      name: 'Rematar',
      category: 'combat',
      subtype: 'damageEffect',
      rank: '6',
      effect: '+1d4 de daño, +1 cada 3 niveles.',
      appliesTo: 'cuerpo a cuerpo',
    },
  ]);
  const B = await mk('Muro', [
    { name: 'Catcher', rank: '10' },
    { name: 'Taunt', rank: '5', stat: 'cha' },
    { name: 'Dodge', rank: '2' },
  ]);
  for (const id of [A, B]) await dm('PATCH', `/api/characters/${id}/party`, { inParty: true });

  await dm('POST', '/api/encounter', { action: 'start', floor: 1 });
  let enc = (
    await dm('POST', '/api/encounter/opponents', { name: 'Ogro', slots: 10, slotValue: 1, evade: '0', count: 1 })
  ).body;
  const ogre = enc.opponents.at(-1).id;
  const decl = async (target, attack) =>
    (
      await dm('POST', '/api/encounter/declarations', { opponentId: ogre, attack, targets: [target] })
    ).body.declarations.at(-1).id;
  const dRanged = await decl(A, { name: 'Lanza', toHit: '10', damage: '1d6', range: '60 ft' });
  const dHit = await decl(A, { name: 'Porrazo', toHit: '30', damage: '1d6', range: '5 ft' });
  const dB = await decl(A, { name: 'Pisotón', toHit: '10', damage: '1d6', range: '5 ft' });
  await dm('POST', '/api/encounter', { action: 'next' }); // Crawler Reaction

  // Dodge Rank 10: Advantage against a ranged attack; Dodge below Rank 5 gets marked when Evading
  enc = (await pl('POST', `/api/encounter/declarations/${dRanged}/evade`, { characterId: A, expr: 'd20+3' })).body;
  assert.equal(enc.declarations.find((d) => d.id === dRanged).targets[0].evade.advantage, true);

  // Catcher after a failed Evade: takes the hit with +10 DR (Rank 10)
  enc = (await pl('POST', `/api/encounter/declarations/${dHit}/evade`, { characterId: A, expr: 'd20-50' })).body;
  assert.equal(enc.declarations.find((d) => d.id === dHit).targets[0].evade.success, false);
  const caught = await pl('POST', `/api/encounter/declarations/${dHit}/catch`, { characterId: B, allyId: A });
  assert.equal(caught.status, 200);
  const tg = caught.body.declarations.find((d) => d.id === dHit).targets[0];
  assert.deepEqual([tg.name, tg.caughtFor, tg.catchDr, tg.noEvade], ['Muro', 'Puños', 10, true]);

  // Taunt Rank 5: drawn attacks come with a free Evade; Taunt gets its Advancement mark
  const tr = await pl('POST', '/api/encounter/taunt', {
    characterId: B,
    expr: 'd20+60',
    picks: [{ declId: dB, targetId: A }],
  });
  assert.equal(tr.status, 200);
  const dd = tr.body.declarations.find((d) => d.id === dB);
  if (dd.taunt.degree !== 'critFail') {
    assert.equal(dd.targets[0].freeEvade, true);
    const before = tr.body.actions[B].used.length;
    const ev = (await pl('POST', `/api/encounter/declarations/${dB}/evade`, { characterId: B, expr: 'd20' })).body;
    assert.equal(ev.actions[B].used.length, before, 'the free Evade costs no Action');
    const marks = (await pl('GET', `/api/characters/${B}`)).body.data.skills;
    assert.equal(marks.find((x) => x.name === 'Taunt').done, true);
    assert.equal(marks.find((x) => x.name === 'Dodge').done, true);
  }

  // Damage Effects: Iron Punch goes with Pugilism, not with Bow; Rematar by its "applies to" text
  for (let i = 0; i < 2; i++) await dm('POST', '/api/encounter', { action: 'next' }); // Crawler Action
  const attack = (body) =>
    pl('POST', '/api/encounter/attacks', { characterId: A, opponentId: ogre, expr: 'd20+50', ...body });
  assert.equal((await attack({ label: 'Bow', damage: '1d6', effect: 'Iron Punch' })).status, 409);
  let r = await attack({ label: 'Pugilism', damage: '1d2+1', effect: 'Iron Punch' });
  assert.equal(r.status, 201);
  let atk = r.body.attacks.at(-1);
  assert.equal(atk.effect.name, 'Iron Punch');
  if (atk.hit) {
    const dmg = (await pl('POST', `/api/encounter/attacks/${atk.id}/damage`)).body.attacks.find(
      (x) => x.id === atk.id,
    ).damage;
    assert.match(dmg.expr, /\+\d?d2\+1d4$/, 'base + 1d2, then a Rank die (Rank 5)');
    assert.equal(dmg.effect, 'Iron Punch');
  }
  // (the Evade and that attack used both Actions: on to the next round's step 4)
  const nextRound = async () => {
    for (let k = 0; k < 5; k++) await dm('POST', '/api/encounter', { action: 'next' });
  };
  await nextRound();
  // Powerful Strike: base dice × Rank, then a 30-hour cooldown on the game clock
  const now = (await dm('GET', '/api/world')).body.gameHours;
  const a2 = await attack({ label: 'Pugilism', damage: '1d2+1', effect: 'Powerful Strike' });
  assert.equal(a2.status, 201);
  const ready = (await pl('GET', `/api/characters/${A}`)).body.data.skills.find(
    (x) => x.name === 'Powerful Strike',
  ).readyAt;
  assert.equal(ready, String(now + 30));
  await nextRound();
  assert.equal(
    (await attack({ label: 'Pugilism', damage: '1d2', effect: 'Powerful Strike' })).body.code,
    'effect_cooldown',
  );
  // time passes on the game clock (a long rest), and it's ready again
  await dm('PATCH', '/api/world', { addHours: -30 });
  assert.equal((await dm('GET', '/api/world')).body.gameHours, now + 30);
  assert.equal((await attack({ label: 'Pugilism', damage: '1d2', effect: 'Powerful Strike' })).status, 201);
  // a campaign effect by its "applies to" text
  assert.equal((await attack({ label: 'Pugilism', damage: '1d2', effect: 'Rematar' })).status, 201);
  await dm('POST', '/api/encounter', { action: 'end' });
});
