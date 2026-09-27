import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { openDb, ensureAdmin } from '../server/db.js';
import { createApp } from '../server/app.js';

let server;
let base;

function client() {
  let cookie = '';
  return async (method, url, body) => {
    const res = await fetch(base + url, {
      method,
      headers: { 'content-type': 'application/json', cookie },
      body: body ? JSON.stringify(body) : undefined,
    });
    const set = res.headers.get('set-cookie');
    if (set) cookie = set.split(';')[0];
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
  assert.equal(enc.declarations[0].targets[0].evade.success, false);

  // AI Favor reroll: once, spends the sheet's AI Favor even though the sheet is locked
  const nat1 = enc.declarations[0].targets[0].evade.natural === 1;
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
    assert.equal(again.body.code, 'no_ai_favor');
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
    assert.ok(dmg >= 3 && dmg <= 6);
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
