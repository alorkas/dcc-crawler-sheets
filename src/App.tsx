import { useState, type FormEvent, type ReactNode } from 'react';
import { BrowserRouter, Navigate, NavLink, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './lib/auth';
import { api } from './lib/api';
import { I18nProvider, LanguageSwitcher, useI18n } from './lib/i18n';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import SheetPage from './pages/SheetPage';
import PlayersPage from './pages/PlayersPage';
import CreatePage from './pages/CreatePage';
import { LiveProvider } from './lib/live';
import { LogPanel, PartyPanel } from './components/LivePanels';

export default function App() {
  return (
    <I18nProvider>
      <AuthProvider>
        <BrowserRouter>
          <Shell />
        </BrowserRouter>
      </AuthProvider>
    </I18nProvider>
  );
}

function Shell() {
  const { user, loading } = useAuth();
  const { t } = useI18n();
  if (loading) return <div className="center-page dim">{t('common.loading')}</div>;
  if (!user) return <LoginPage />;
  return (
    <LiveProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard scope="mine" />} />
          <Route path="/new" element={<CreatePage />} />
          <Route path="/sheet/:id" element={<SheetPage />} />
          {user.isAdmin && <Route path="/admin/crawlers" element={<Dashboard scope="all" />} />}
          {user.isAdmin && <Route path="/admin/players" element={<PlayersPage />} />}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </LiveProvider>
  );
}

function Layout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const { t } = useI18n();
  const [pwOpen, setPwOpen] = useState(false);
  return (
    <div className="app">
      <header className="topbar">
        <NavLink to="/" className="brand">
          <span className="brand-a">{t('brand.a')}</span>
          <span className="brand-b">{t('brand.b')}</span>
        </NavLink>
        <nav className="nav">
          <NavLink to="/" end>
            {t('nav.mine')}
          </NavLink>
          {user?.isAdmin && <NavLink to="/admin/crawlers">{t('nav.all')}</NavLink>}
          {user?.isAdmin && <NavLink to="/admin/players">{t('nav.players')}</NavLink>}
        </nav>
        <LanguageSwitcher className="top-lang" />
        <details className="menu user-menu">
          <summary className="btn ghost">
            {user?.username}
            {user?.isAdmin && <span className="pill gold">{t('user.admin')}</span>}
          </summary>
          <div className="menu-pop right">
            <button type="button" onClick={() => setPwOpen(true)}>
              {t('user.changePassword')}
            </button>
            <button type="button" onClick={logout}>
              {t('user.logout')}
            </button>
          </div>
        </details>
      </header>
      <div className="workspace">
        <PartyPanel />
        <main>{children}</main>
        <LogPanel />
      </div>
      {pwOpen && <PasswordDialog onClose={() => setPwOpen(false)} />}
    </div>
  );
}

function PasswordDialog({ onClose }: { onClose: () => void }) {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const { t, err } = useI18n();

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError('');
    try {
      await api.changePassword(current, next);
      setDone(true);
    } catch (e2) {
      setError(err(e2));
    }
  }

  return (
    <div className="modal-back" onClick={onClose}>
      <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={submit}>
        <h2>{t('pw.title')}</h2>
        {done ? (
          <p className="ok">{t('pw.done')}</p>
        ) : (
          <>
            <label className="field">
              <span className="lbl">{t('pw.current')}</span>
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
              <span className="lbl">{t('pw.new')}</span>
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
            {t('common.close')}
          </button>
          {!done && <button className="btn primary">{t('common.save')}</button>}
        </div>
      </form>
    </div>
  );
}
