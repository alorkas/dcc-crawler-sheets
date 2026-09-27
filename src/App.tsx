import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { BrowserRouter, Navigate, NavLink, Route, Routes, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './lib/auth';
import { api, type AdminUser } from './lib/api';
import { I18nProvider, LanguageSwitcher, useI18n } from './lib/i18n';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import SheetPage from './pages/SheetPage';
import PlayersPage from './pages/PlayersPage';
import CreatePage from './pages/CreatePage';
import NpcsPage from './pages/NpcsPage';
import NpcPage from './pages/NpcPage';
import CombatPage from './pages/CombatPage';
import WorldPage from './pages/WorldPage';
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
          <Route path="/combat" element={<CombatPage />} />
          <Route path="/world" element={<WorldPage />} />
          {user.isAdmin && <Route path="/admin/crawlers" element={<Dashboard scope="all" />} />}
          {user.isAdmin && <Route path="/admin/players" element={<PlayersPage />} />}
          {user.isAdmin && <Route path="/admin/npcs" element={<NpcsPage />} />}
          {user.isAdmin && <Route path="/admin/npcs/:id" element={<NpcPage />} />}
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
  const [viewOpen, setViewOpen] = useState(false);
  const onCombat = useLocation().pathname === '/combat';
  return (
    <div className={`app ${user?.viewAs ? 'viewing-as' : ''}`}>
      {user?.viewAs && <ViewAsBanner name={user.username} self={user.id === user.realUser?.id} />}
      <header className="topbar">
        <NavLink to="/" className="brand">
          <span className="brand-a">{t('brand.a')}</span>
          <span className="brand-b">{t('brand.b')}</span>
        </NavLink>
        <nav className="nav">
          <NavLink to="/" end>
            {t('nav.mine')}
          </NavLink>
          <NavLink to="/combat">{t('nav.combat')}</NavLink>
          <NavLink to="/world">{t('nav.world')}</NavLink>
          {user?.isAdmin && <NavLink to="/admin/crawlers">{t('nav.all')}</NavLink>}
          {user?.isAdmin && <NavLink to="/admin/npcs">{t('nav.npcs')}</NavLink>}
          {user?.isAdmin && <NavLink to="/admin/players">{t('nav.players')}</NavLink>}
        </nav>
        <LanguageSwitcher className="top-lang" />
        <details className="menu user-menu">
          <summary className="btn ghost">
            {user?.username}
            {user?.isAdmin && <span className="pill gold">{t('user.admin')}</span>}
          </summary>
          <div className="menu-pop right">
            {user?.isAdmin && (
              <button type="button" onClick={() => setViewOpen(true)}>
                {t('view.menu')}
              </button>
            )}
            {!user?.viewAs && (
              <button type="button" onClick={() => setPwOpen(true)}>
                {t('user.changePassword')}
              </button>
            )}
            <button type="button" onClick={logout}>
              {t('user.logout')}
            </button>
          </div>
        </details>
      </header>
      <div className="workspace">
        {/* the Combat page shows the party itself, full size */}
        {!onCombat && <PartyPanel />}
        <main>{children}</main>
        <LogPanel />
      </div>
      {pwOpen && <PasswordDialog onClose={() => setPwOpen(false)} />}
      {viewOpen && <ViewAsDialog onClose={() => setViewOpen(false)} />}
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

/** Shown while a GM views the app as a player. */
function ViewAsBanner({ name, self }: { name: string; self: boolean }) {
  const { t } = useI18n();
  return (
    <div className="view-as-banner" role="status">
      <span>👁 {self ? t('view.bannerSelf') : t('view.banner', { name })}</span>
      <button
        type="button"
        className="btn small"
        onClick={async () => {
          await api.viewAs(null).catch(() => {});
          window.location.assign('/');
        }}
      >
        {t('view.back')}
      </button>
    </div>
  );
}

/** GM: pick a player to see the app as (read-only), or yourself without GM rights. */
function ViewAsDialog({ onClose }: { onClose: () => void }) {
  const { t, err } = useI18n();
  const [users, setUsers] = useState<AdminUser[] | null>(null);
  const [pick, setPick] = useState<string>('self');
  const [error, setError] = useState('');
  useEffect(() => {
    api
      .listUsers()
      .then((l) => setUsers(l.filter((u) => !u.isAdmin)))
      .catch((e) => setError(err(e)));
  }, [err]);
  const go = async () => {
    try {
      await api.viewAs(pick === 'self' ? 'self' : Number(pick));
      window.location.assign('/');
    } catch (e) {
      setError(err(e));
    }
  };
  return (
    <div className="modal-back" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{t('view.title')}</h2>
        <p className="dim small">{t('view.hint')}</p>
        <label className="field">
          <span className="lbl">{t('view.who')}</span>
          <select className="in sel" value={pick} onChange={(e) => setPick(e.target.value)}>
            <option value="self">{t('view.self')}</option>
            {(users ?? []).map((u) => (
              <option key={u.id} value={u.id}>
                {u.username} ({t('view.chars', { n: u.characters })})
              </option>
            ))}
          </select>
        </label>
        {error && <p className="error">{error}</p>}
        <div className="modal-actions">
          <button type="button" className="btn ghost" onClick={onClose}>
            {t('common.close')}
          </button>
          <button type="button" className="btn primary" onClick={go}>
            {t('view.start')}
          </button>
        </div>
      </div>
    </div>
  );
}
