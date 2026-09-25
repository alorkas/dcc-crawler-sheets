import { useCallback, useEffect, useState } from 'react';
import { api, type AdminUser } from '../lib/api';
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
    </div>
  );
}
