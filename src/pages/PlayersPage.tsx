import { useCallback, useEffect, useState } from 'react';
import { api, type AdminUser, type ImportResult } from '../lib/api';
import { useAuth } from '../lib/auth';
import { useI18n } from '../lib/i18n';

export default function PlayersPage() {
  const { user } = useAuth();
  const { t, err, locale } = useI18n();
  const [users, setUsers] = useState<AdminUser[] | null>(null);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState<unknown>(null);

  const load = useCallback(() => {
    api
      .listUsers()
      .then(setUsers)
      .catch((e) => setError(e ?? new Error()));
  }, []);
  useEffect(load, [load]);

  async function run(fn: () => Promise<unknown>, ok: string) {
    setError(null);
    setMsg('');
    try {
      await fn();
      setMsg(ok);
      load();
    } catch (e) {
      setError(e);
    }
  }

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>{t('players.title')}</h1>
          <p className="dim">{t('players.sub')}</p>
        </div>
      </div>
      {msg && <p className="ok">{msg}</p>}
      {!!error && <p className="error">{err(error)}</p>}
      {!users && !error && <p className="dim">{t('common.loading')}</p>}
      {users && (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>{t('players.colPlayer')}</th>
                <th>{t('players.colRole')}</th>
                <th>{t('players.colCrawlers')}</th>
                <th>{t('players.colJoined')}</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td data-label={t('players.colPlayer')}>
                    <strong>{u.username}</strong>
                    {u.id === user?.id && <span className="dim"> {t('players.you')}</span>}
                  </td>
                  <td data-label={t('players.colRole')}>
                    {u.isAdmin ? <span className="pill gold">{t('players.admin')}</span> : t('players.player')}
                  </td>
                  <td data-label={t('players.colCrawlers')}>{u.characters}</td>
                  <td data-label={t('players.colJoined')}>{new Date(u.createdAt + 'Z').toLocaleDateString(locale)}</td>
                  <td className="row-actions">
                    <button
                      className="btn small ghost"
                      onClick={() => {
                        const pw = prompt(t('players.resetPrompt', { name: u.username }));
                        if (pw)
                          run(
                            () => api.updateUser(u.id, { password: pw }),
                            t('players.resetDone', { name: u.username }),
                          );
                      }}
                    >
                      {t('players.resetPw')}
                    </button>
                    {u.id !== user?.id && (
                      <>
                        <button
                          className="btn small ghost"
                          onClick={() =>
                            run(
                              () => api.updateUser(u.id, { isAdmin: !u.isAdmin }),
                              t(u.isAdmin ? 'players.nowPlayer' : 'players.nowAdmin', { name: u.username }),
                            )
                          }
                        >
                          {t(u.isAdmin ? 'players.makePlayer' : 'players.makeAdmin')}
                        </button>
                        <button
                          className="btn small danger"
                          onClick={() => {
                            if (confirm(t('players.deleteConfirm', { name: u.username, n: u.characters }))) {
                              run(() => api.deleteUser(u.id), t('players.deleted', { name: u.username }));
                            }
                          }}
                        >
                          {t('players.delete')}
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <ImportCard />
      <BackupsCard />
    </div>
  );
}

/** Nightly database backups: list, and take one now. */
function BackupsCard() {
  const { t, err, locale } = useI18n();
  const [info, setInfo] = useState<Awaited<ReturnType<typeof api.backups>> | null>(null);
  const [msg, setMsg] = useState('');
  useEffect(() => {
    api
      .backups()
      .then(setInfo)
      .catch(() => {});
  }, []);
  if (!info) return null;
  const now = async () => {
    setMsg('');
    try {
      const r = await api.backupNow();
      setInfo({ ...info, files: r.files });
      setMsg(t('backup.done', { name: r.name }));
    } catch (e) {
      setMsg(err(e));
    }
  };
  const when = (name: string) => {
    const m = name.match(/(\d{4})-(\d{2})-(\d{2})-(\d{2})-(\d{2})-(\d{2})/);
    return m ? new Date(Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +m[6])).toLocaleString(locale) : name;
  };
  return (
    <div className="card backups-card">
      <div className="card-body">
        <h2>{t('backup.title')}</h2>
        <p className="dim small">
          {info.enabled ? t('backup.hint', { dir: info.dir ?? '', n: info.keep }) : t('backup.off')}
        </p>
        {info.enabled && (
          <>
            <ul className="backup-list">
              {info.files.length === 0 && <li className="dim">{t('backup.none')}</li>}
              {info.files.map((f) => (
                <li key={f.name}>
                  <span>{when(f.name)}</span>
                  <span className="dim tiny">
                    {f.name} · {(f.size / 1024).toFixed(0)} KB
                  </span>
                </li>
              ))}
            </ul>
            <div className="row-gap">
              <button type="button" className="btn small" onClick={now}>
                {t('backup.now')}
              </button>
              {msg && <span className="dim small">{msg}</span>}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/**
 * Load a session's prep from a JSON file: achievements (to give during play), quests, stat blocks and loot for
 * the stash. Things already there are skipped, so the same file can be imported twice.
 */
function ImportCard() {
  const { t, err } = useI18n();
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ file: string; title: string; r: ImportResult } | null>(null);
  const [error, setError] = useState('');
  const load = async (file: File | undefined) => {
    if (!file) return;
    setError('');
    setResult(null);
    setBusy(true);
    try {
      const json = JSON.parse(await file.text());
      const r = await api.importSession(json);
      setResult({ file: file.name, title: String(json?.title ?? ''), r });
    } catch (e) {
      setError(e instanceof SyntaxError ? t('import.badJson') : err(e));
    } finally {
      setBusy(false);
    }
  };
  const line = (key: 'achievements' | 'quests' | 'npcs' | 'bookNpcs') =>
    result && (result.r[key][0] || result.r[key][1])
      ? t(`import.${key}`, { n: result.r[key][0], skip: result.r[key][1] })
      : null;
  return (
    <div className="card import-card">
      <div className="card-body">
        <h2>{t('import.title')}</h2>
        <p className="dim small">{t('import.hint')}</p>
        <label className={`btn ${busy ? 'disabled' : ''}`}>
          📥 {busy ? t('common.loading') : t('import.pick')}
          <input
            type="file"
            accept=".json,application/json"
            hidden
            disabled={busy}
            onChange={(e) => {
              load(e.target.files?.[0]);
              e.target.value = '';
            }}
          />
        </label>
        {error && <p className="error">{error}</p>}
        {result && (
          <div className="import-result">
            <strong>✓ {result.title || result.file}</strong>
            <ul>
              {(['achievements', 'quests', 'npcs', 'bookNpcs'] as const).map((k) => {
                const l = line(k);
                return l ? <li key={k}>{l}</li> : null;
              })}
              {result.r.stash > 0 && <li>{t('import.stash', { n: result.r.stash })}</li>}
              {result.r.unknownBookNpcs.length > 0 && (
                <li className="error">{t('import.unknown', { list: result.r.unknownBookNpcs.join(', ') })}</li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
