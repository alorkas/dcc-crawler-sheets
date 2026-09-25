import express from 'express';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import path from 'node:path';
import fs from 'node:fs';

const COOKIE = 'dcc_session';
const USERNAME_RE = /^[a-zA-Z0-9_.-]{3,32}$/;

export function createApp({ db, jwtSecret, allowRegistration = true, cookieSecure = false, staticDir }) {
  const app = express();
  app.set('trust proxy', true);
  app.use(express.json({ limit: '6mb' }));
  app.use(cookieParser());

  app.get('/health', (_req, res) => res.json({ status: 'ok' }));

  // ---------- helpers ----------
  const q = {
    userById: db.prepare('SELECT id, username, is_admin FROM users WHERE id = ?'),
    userByName: db.prepare('SELECT * FROM users WHERE username = ?'),
    insertUser: db.prepare('INSERT INTO users (username, password_hash) VALUES (?, ?)'),
    charById: db.prepare(
      `SELECT c.*, u.username AS owner_name FROM characters c JOIN users u ON u.id = c.owner_id WHERE c.id = ?`,
    ),
  };

  const publicUser = (u) => ({ id: u.id, username: u.username, isAdmin: !!u.is_admin });

  const toChar = (row, withData = true) => {
    const data = JSON.parse(row.data || '{}');
    const out = {
      id: row.id,
      ownerId: row.owner_id,
      ownerName: row.owner_name,
      locked: !!row.locked,
      version: row.version,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      summary: {
        name: data.name || '',
        race: data.race || '',
        class: data.class || '',
        level: data.level || '',
        floor: data.floor || '',
        crawlerNumber: data.crawlerNumber || '',
        portrait: data.portrait || '',
      },
    };
    if (withData) out.data = data;
    return out;
  };

  function issue(res, user) {
    const token = jwt.sign({ uid: user.id }, jwtSecret, { expiresIn: '30d' });
    res.cookie(COOKIE, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: cookieSecure,
      maxAge: 30 * 24 * 3600 * 1000,
    });
  }

  function auth(req, res, next) {
    const token = req.cookies[COOKIE];
    if (!token) return res.status(401).json({ error: 'Not logged in', code: 'not_logged_in' });
    try {
      const { uid } = jwt.verify(token, jwtSecret);
      const user = q.userById.get(uid);
      if (!user) return res.status(401).json({ error: 'Account no longer exists', code: 'account_gone' });
      req.user = user;
      next();
    } catch {
      res.status(401).json({ error: 'Session expired', code: 'session_expired' });
    }
  }

  const adminOnly = (req, res, next) =>
    req.user.is_admin ? next() : res.status(403).json({ error: 'Admin only', code: 'admin_only' });

  function loadChar(req, res, next) {
    const row = q.charById.get(Number(req.params.id));
    if (!row || (row.owner_id !== req.user.id && !req.user.is_admin)) {
      return res.status(404).json({ error: 'Character not found', code: 'char_not_found' });
    }
    req.char = row;
    next();
  }

  // naive in-memory brute-force protection for login
  const attempts = new Map();
  function throttle(req, res, next) {
    const key = req.ip;
    const now = Date.now();
    const a = attempts.get(key) || { n: 0, t: now };
    if (now - a.t > 15 * 60 * 1000) Object.assign(a, { n: 0, t: now });
    if (a.n >= 20)
      return res.status(429).json({ error: 'Too many attempts, try again later', code: 'too_many_attempts' });
    a.n++;
    attempts.set(key, a);
    next();
  }

  // ---------- auth ----------
  app.get('/api/config', (_req, res) => res.json({ allowRegistration }));

  app.post('/api/auth/register', throttle, (req, res) => {
    if (!allowRegistration)
      return res.status(403).json({ error: 'Registration is closed', code: 'registration_closed' });
    const { username = '', password = '' } = req.body || {};
    if (!USERNAME_RE.test(username)) {
      return res
        .status(400)
        .json({ error: 'Username must be 3–32 characters: letters, numbers, _ . -', code: 'username_invalid' });
    }
    if (password.length < 8)
      return res.status(400).json({ error: 'Password must be at least 8 characters', code: 'password_short' });
    if (q.userByName.get(username))
      return res.status(409).json({ error: 'Username already taken', code: 'username_taken' });
    const r = q.insertUser.run(username, bcrypt.hashSync(password, 10));
    const user = q.userById.get(r.lastInsertRowid);
    issue(res, user);
    res.status(201).json(publicUser(user));
  });

  app.post('/api/auth/login', throttle, (req, res) => {
    const { username = '', password = '' } = req.body || {};
    const user = q.userByName.get(username);
    if (!user || !bcrypt.compareSync(password, user.password_hash)) {
      return res.status(401).json({ error: 'Invalid username or password', code: 'invalid_login' });
    }
    attempts.delete(req.ip);
    issue(res, user);
    res.json(publicUser(user));
  });

  app.post('/api/auth/logout', (_req, res) => {
    res.clearCookie(COOKIE);
    res.json({ ok: true });
  });

  app.get('/api/auth/me', auth, (req, res) => res.json(publicUser(req.user)));

  app.post('/api/auth/password', auth, (req, res) => {
    const { currentPassword = '', newPassword = '' } = req.body || {};
    const full = q.userByName.get(req.user.username);
    if (!bcrypt.compareSync(currentPassword, full.password_hash)) {
      return res.status(400).json({ error: 'Current password is incorrect', code: 'wrong_current_password' });
    }
    if (newPassword.length < 8)
      return res.status(400).json({ error: 'Password must be at least 8 characters', code: 'password_short' });
    db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(bcrypt.hashSync(newPassword, 10), full.id);
    res.json({ ok: true });
  });

  // ---------- characters ----------
  app.get('/api/characters', auth, (req, res) => {
    const all = req.user.is_admin && req.query.scope === 'all';
    const rows = all
      ? db
          .prepare(
            `SELECT c.*, u.username AS owner_name FROM characters c JOIN users u ON u.id = c.owner_id
             ORDER BY u.username COLLATE NOCASE, c.updated_at DESC`,
          )
          .all()
      : db
          .prepare(
            `SELECT c.*, u.username AS owner_name FROM characters c JOIN users u ON u.id = c.owner_id
             WHERE c.owner_id = ? ORDER BY c.updated_at DESC`,
          )
          .all(req.user.id);
    res.json(rows.map((r) => toChar(r, false)));
  });

  app.post('/api/characters', auth, (req, res) => {
    let ownerId = req.user.id;
    if (req.user.is_admin && req.body?.ownerId) {
      if (!q.userById.get(Number(req.body.ownerId)))
        return res.status(400).json({ error: 'Unknown owner', code: 'unknown_owner' });
      ownerId = Number(req.body.ownerId);
    }
    const data = req.body?.data && typeof req.body.data === 'object' ? req.body.data : {};
    const r = db.prepare('INSERT INTO characters (owner_id, data) VALUES (?, ?)').run(ownerId, JSON.stringify(data));
    res.status(201).json(toChar(q.charById.get(r.lastInsertRowid)));
  });

  app.get('/api/characters/:id', auth, loadChar, (req, res) => res.json(toChar(req.char)));

  app.put('/api/characters/:id', auth, loadChar, (req, res) => {
    const { data, version } = req.body || {};
    if (!data || typeof data !== 'object')
      return res.status(400).json({ error: 'Missing sheet data', code: 'missing_data' });
    if (req.char.locked)
      return res.status(423).json({ error: 'Sheet is locked', code: 'sheet_locked', character: toChar(req.char) });
    if (Number(version) !== req.char.version) {
      return res
        .status(409)
        .json({ error: 'Sheet was changed elsewhere', code: 'sheet_conflict', character: toChar(req.char) });
    }
    db.prepare(`UPDATE characters SET data = ?, version = version + 1, updated_at = datetime('now') WHERE id = ?`).run(
      JSON.stringify(data),
      req.char.id,
    );
    res.json(toChar(q.charById.get(req.char.id), false));
  });

  app.post('/api/characters/:id/lock', auth, loadChar, (req, res) => {
    const locked = !!req.body?.locked;
    db.prepare(`UPDATE characters SET locked = ?, updated_at = datetime('now') WHERE id = ?`).run(
      locked ? 1 : 0,
      req.char.id,
    );
    res.json(toChar(q.charById.get(req.char.id), false));
  });

  app.delete('/api/characters/:id', auth, loadChar, (req, res) => {
    if (req.char.locked)
      return res.status(423).json({ error: 'Unlock the sheet before deleting it', code: 'unlock_to_delete' });
    db.prepare('DELETE FROM characters WHERE id = ?').run(req.char.id);
    res.json({ ok: true });
  });

  app.patch('/api/characters/:id/owner', auth, adminOnly, loadChar, (req, res) => {
    const owner = q.userById.get(Number(req.body?.ownerId));
    if (!owner) return res.status(400).json({ error: 'Unknown owner', code: 'unknown_owner' });
    db.prepare('UPDATE characters SET owner_id = ? WHERE id = ?').run(owner.id, req.char.id);
    res.json(toChar(q.charById.get(req.char.id), false));
  });

  // ---------- admin: users ----------
  app.get('/api/users', auth, adminOnly, (_req, res) => {
    const rows = db
      .prepare(
        `SELECT u.id, u.username, u.is_admin, u.created_at, COUNT(c.id) AS characters
         FROM users u LEFT JOIN characters c ON c.owner_id = u.id
         GROUP BY u.id ORDER BY u.username COLLATE NOCASE`,
      )
      .all();
    res.json(rows.map((r) => ({ ...publicUser(r), createdAt: r.created_at, characters: r.characters })));
  });

  app.patch('/api/users/:id', auth, adminOnly, (req, res) => {
    const target = q.userById.get(Number(req.params.id));
    if (!target) return res.status(404).json({ error: 'User not found', code: 'user_not_found' });
    const { isAdmin, password } = req.body || {};
    if (typeof isAdmin === 'boolean') {
      if (target.id === req.user.id && !isAdmin) {
        return res.status(400).json({ error: "You can't remove your own admin rights", code: 'cant_demote_self' });
      }
      db.prepare('UPDATE users SET is_admin = ? WHERE id = ?').run(isAdmin ? 1 : 0, target.id);
    }
    if (password !== undefined) {
      if (String(password).length < 8) {
        return res.status(400).json({ error: 'Password must be at least 8 characters', code: 'password_short' });
      }
      db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(bcrypt.hashSync(password, 10), target.id);
    }
    res.json(publicUser(q.userById.get(target.id)));
  });

  app.delete('/api/users/:id', auth, adminOnly, (req, res) => {
    const id = Number(req.params.id);
    if (id === req.user.id)
      return res.status(400).json({ error: "You can't delete yourself", code: 'cant_delete_self' });
    db.prepare('DELETE FROM users WHERE id = ?').run(id);
    res.json({ ok: true });
  });

  app.use('/api', (_req, res) => res.status(404).json({ error: 'Not found', code: 'not_found' }));

  // ---------- SPA ----------
  if (staticDir && fs.existsSync(staticDir)) {
    app.use(express.static(staticDir, { index: false, maxAge: '1h' }));
    app.get('*', (_req, res) => res.sendFile(path.join(staticDir, 'index.html')));
  }

  return app;
}
