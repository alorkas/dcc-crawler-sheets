import { useEffect, useState, type FormEvent } from 'react';
import { useAuth } from '../lib/auth';
import { api } from '../lib/api';
import { LanguageSwitcher, useI18n } from '../lib/i18n';

export default function LoginPage() {
  const { login, register } = useAuth();
  const { t, err } = useI18n();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [allowRegistration, setAllowRegistration] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api
      .config()
      .then((c) => setAllowRegistration(c.allowRegistration))
      .catch(() => {});
  }, []);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError('');
    if (mode === 'register' && password !== confirm) return setError(t('auth.mismatch'));
    setBusy(true);
    try {
      if (mode === 'login') await login(username, password);
      else await register(username, password);
    } catch (e2) {
      setError(err(e2));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <LanguageSwitcher className="auth-lang" />
        <div className="brand big">
          <span className="brand-a">{t('brand.a')}</span>
          <span className="brand-b">{t('brand.b')}</span>
        </div>
        <p className="auth-tag">{t(mode === 'login' ? 'auth.tagLogin' : 'auth.tagRegister')}</p>
        <form onSubmit={submit} className="auth-form">
          <label className="field">
            <span className="lbl">{t('auth.username')}</span>
            <input
              className="in"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
            />
          </label>
          <label className="field">
            <span className="lbl">{t('auth.password')}</span>
            <input
              className="in"
              type="password"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          {mode === 'register' && (
            <label className="field">
              <span className="lbl">{t('auth.confirm')}</span>
              <input
                className="in"
                type="password"
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
            </label>
          )}
          {error && <p className="error">{error}</p>}
          <button className="btn primary" disabled={busy}>
            {busy ? '…' : t(mode === 'login' ? 'auth.login' : 'auth.register')}
          </button>
        </form>
        {allowRegistration && (
          <button
            type="button"
            className="link-btn"
            onClick={() => {
              setMode(mode === 'login' ? 'register' : 'login');
              setError('');
            }}
          >
            {t(mode === 'login' ? 'auth.toRegister' : 'auth.toLogin')}
          </button>
        )}
      </div>
    </div>
  );
}
