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

  // Lock blocks edits and deletion
  assert.equal((await alice('POST', `/api/characters/${id}/lock`, { locked: true })).body.locked, true);
  assert.equal((await alice('PUT', `/api/characters/${id}`, { data: {}, version: 2 })).status, 423);
  assert.equal((await alice('DELETE', `/api/characters/${id}`)).status, 423);

  // Admin sees everything and can unlock + edit
  const all = await dm('GET', '/api/characters?scope=all');
  assert.equal(all.body.length, 1);
  assert.equal(all.body[0].ownerName, 'alice');
  assert.equal((await dm('POST', `/api/characters/${id}/lock`, { locked: false })).status, 200);
  const dmEdit = await dm('PUT', `/api/characters/${id}`, { data: { name: 'Carl', level: '4' }, version: 2 });
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
