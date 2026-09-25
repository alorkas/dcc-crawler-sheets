import { useCallback, useEffect, useState } from 'react';
import { api, type AdminUser } from '../lib/api';
import { useAuth } from '../lib/auth';

export default function PlayersPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState<AdminUser[] | null>(null);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const load = useCallback(() => {
    api
      .listUsers()
      .then(setUsers)
      .catch((e) => setError(e.message));
  }, []);
  useEffect(load, [load]);

  async function run(fn: () => Promise<unknown>, ok: string) {
    setError('');
    setMsg('');
    try {
      await fn();
      setMsg(ok);
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed');
    }
  }

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>Players</h1>
          <p className="dim">Manage accounts. Deleting a player also deletes their crawlers.</p>
        </div>
      </div>
      {msg && <p className="ok">{msg}</p>}
      {error && <p className="error">{error}</p>}
      {!users && !error && <p className="dim">Loading…</p>}
      {users && (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Player</th>
                <th>Role</th>
                <th>Crawlers</th>
                <th>Joined</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td data-label="Player">
                    <strong>{u.username}</strong>
                    {u.id === user?.id && <span className="dim"> (you)</span>}
                  </td>
                  <td data-label="Role">{u.isAdmin ? <span className="pill gold">Admin</span> : 'Player'}</td>
                  <td data-label="Crawlers">{u.characters}</td>
                  <td data-label="Joined">{new Date(u.createdAt + 'Z').toLocaleDateString()}</td>
                  <td className="row-actions">
                    <button
                      className="btn small ghost"
                      onClick={() => {
                        const pw = prompt(`New password for ${u.username} (min 8 characters):`);
                        if (pw) run(() => api.updateUser(u.id, { password: pw }), `Password reset for ${u.username}`);
                      }}
                    >
                      Reset password
                    </button>
                    {u.id !== user?.id && (
                      <>
                        <button
                          className="btn small ghost"
                          onClick={() =>
                            run(
                              () => api.updateUser(u.id, { isAdmin: !u.isAdmin }),
                              `${u.username} is now ${u.isAdmin ? 'a player' : 'an admin'}`,
                            )
                          }
                        >
                          {u.isAdmin ? 'Make player' : 'Make admin'}
                        </button>
                        <button
                          className="btn small danger"
                          onClick={() => {
                            if (confirm(`Delete ${u.username} and all ${u.characters} of their crawlers?`)) {
                              run(() => api.deleteUser(u.id), `${u.username} deleted`);
                            }
                          }}
                        >
                          Delete
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
