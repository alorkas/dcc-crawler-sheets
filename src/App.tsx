import { useState, type FormEvent, type ReactNode } from 'react';
import { BrowserRouter, Navigate, NavLink, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './lib/auth';
import { api } from './lib/api';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import SheetPage from './pages/SheetPage';
import PlayersPage from './pages/PlayersPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Shell />
      </BrowserRouter>
    </AuthProvider>
  );
}

function Shell() {
  const { user, loading } = useAuth();
  if (loading) return <div className="center-page dim">Loading…</div>;
  if (!user) return <LoginPage />;
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard scope="mine" />} />
        <Route path="/sheet/:id" element={<SheetPage />} />
        {user.isAdmin && <Route path="/admin/crawlers" element={<Dashboard scope="all" />} />}
        {user.isAdmin && <Route path="/admin/players" element={<PlayersPage />} />}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

function Layout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const [pwOpen, setPwOpen] = useState(false);
  return (
    <div className="app">
      <header className="topbar">
        <NavLink to="/" className="brand">
          <span className="brand-a">Crawler</span>
          <span className="brand-b">Sheets</span>
        </NavLink>
        <nav className="nav">
          <NavLink to="/" end>
            My crawlers
          </NavLink>
          {user?.isAdmin && <NavLink to="/admin/crawlers">All crawlers</NavLink>}
          {user?.isAdmin && <NavLink to="/admin/players">Players</NavLink>}
        </nav>
        <details className="menu user-menu">
          <summary className="btn ghost">
            {user?.username}
            {user?.isAdmin && <span className="pill gold">Admin</span>}
          </summary>
          <div className="menu-pop right">
            <button type="button" onClick={() => setPwOpen(true)}>
              Change password
            </button>
            <button type="button" onClick={logout}>
              Log out
            </button>
          </div>
        </details>
      </header>
      <main>{children}</main>
      {pwOpen && <PasswordDialog onClose={() => setPwOpen(false)} />}
    </div>
  );
}

function PasswordDialog({ onClose }: { onClose: () => void }) {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError('');
    try {
      await api.changePassword(current, next);
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed');
    }
  }

  return (
    <div className="modal-back" onClick={onClose}>
      <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={submit}>
        <h2>Change password</h2>
        {done ? (
          <p className="ok">Password changed.</p>
        ) : (
          <>
            <label className="field">
              <span className="lbl">Current password</span>
              <input
                className="in"
                type="password"
                autoComplete="current-password"
                value={current}
                onChange={(e) => setCurrent(e.target.value)}
                required
              />
            </label>
            <label className="field">
              <span className="lbl">New password</span>
              <input
                className="in"
                type="password"
                autoComplete="new-password"
                minLength={8}
                value={next}
                onChange={(e) => setNext(e.target.value)}
                required
              />
            </label>
            {error && <p className="error">{error}</p>}
          </>
        )}
        <div className="modal-actions">
          <button type="button" className="btn ghost" onClick={onClose}>
            Close
          </button>
          {!done && <button className="btn primary">Save</button>}
        </div>
      </form>
    </div>
  );
}
