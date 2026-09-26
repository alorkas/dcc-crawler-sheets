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
