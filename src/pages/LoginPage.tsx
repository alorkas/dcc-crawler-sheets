import { useEffect, useState, type FormEvent } from 'react';
import { useAuth } from '../lib/auth';
import { api } from '../lib/api';

export default function LoginPage() {
  const { login, register } = useAuth();
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
    if (mode === 'register' && password !== confirm) return setError('Passwords do not match');
    setBusy(true);
    try {
      if (mode === 'login') await login(username, password);
      else await register(username, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="brand big">
          <span className="brand-a">Crawler</span>
          <span className="brand-b">Sheets</span>
        </div>
        <p className="auth-tag">
          {mode === 'login'
            ? 'Welcome back, Crawler. The dungeon awaits.'
            : 'New Crawler? Register to start building your sheet.'}
        </p>
        <form onSubmit={submit} className="auth-form">
          <label className="field">
            <span className="lbl">Username</span>
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
            <span className="lbl">Password</span>
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
              <span className="lbl">Confirm password</span>
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
            {busy ? '…' : mode === 'login' ? 'Log in' : 'Create account'}
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
            {mode === 'login' ? "Don't have an account? Register" : 'Already registered? Log in'}
          </button>
        )}
      </div>
    </div>
  );
}
