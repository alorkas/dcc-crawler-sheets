import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, type CharacterSummary } from '../lib/api';
import { useAuth } from '../lib/auth';
import { LockIcon } from '../components/icons';

export default function Dashboard({ scope }: { scope: 'mine' | 'all' }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [chars, setChars] = useState<CharacterSummary[] | null>(null);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');
  const all = scope === 'all' && !!user?.isAdmin;

  useEffect(() => {
    setChars(null);
    api
      .listCharacters(all)
      .then(setChars)
      .catch((e) => setError(e.message));
  }, [all]);

  async function create() {
    try {
      const c = await api.createCharacter();
      navigate(`/sheet/${c.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not create character');
    }
  }

  const groups = useMemo(() => {
    const f = filter.trim().toLowerCase();
    const list = (chars ?? []).filter(
      (c) =>
        !f || [c.summary.name, c.summary.race, c.summary.class, c.ownerName].some((v) => v.toLowerCase().includes(f)),
    );
    if (!all) return [{ owner: '', items: list }];
    const map = new Map<string, CharacterSummary[]>();
    for (const c of list) map.set(c.ownerName, [...(map.get(c.ownerName) ?? []), c]);
    return [...map.entries()].map(([owner, items]) => ({ owner, items }));
  }, [chars, filter, all]);

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>{all ? 'All crawlers' : 'My crawlers'}</h1>
          <p className="dim">
            {all ? 'Every sheet in the campaign. Click one to view or edit it.' : 'Your characters in the dungeon.'}
          </p>
        </div>
        <div className="page-actions">
          {all && (
            <input
              className="in search"
              placeholder="Search name, race, class, player…"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          )}
          <button className="btn primary" onClick={create}>
            + New crawler
          </button>
        </div>
      </div>

      {error && <p className="error">{error}</p>}
      {!chars && !error && <p className="dim">Loading…</p>}
      {chars && chars.length === 0 && (
        <div className="empty">
          <h2>No crawlers yet</h2>
          <p className="dim">
            {all ? 'Nobody has created a character yet.' : 'Create your first character to enter the dungeon.'}
          </p>
          <button className="btn primary" onClick={create}>
            + Create a crawler
          </button>
        </div>
      )}

      {groups.map((g) =>
        g.items.length === 0 ? null : (
          <div key={g.owner || 'mine'} className="group">
            {all && (
              <h2 className="group-title">
                {g.owner} <span className="dim">({g.items.length})</span>
              </h2>
            )}
            <div className="char-grid">
              {g.items.map((c) => (
                <CharCard key={c.id} c={c} />
              ))}
            </div>
          </div>
        ),
      )}
    </div>
  );
}

function CharCard({ c }: { c: CharacterSummary }) {
  const s = c.summary;
  const initials = (s.name || '?')
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  return (
    <Link to={`/sheet/${c.id}`} className="char-card">
      <div className="char-portrait">{s.portrait ? <img src={s.portrait} alt="" /> : <span>{initials}</span>}</div>
      <div className="char-info">
        <div className="char-name">
          {s.name || 'Unnamed crawler'}
          {c.locked && (
            <span className="lock-pill" title="Locked">
              <LockIcon />
            </span>
          )}
        </div>
        <div className="dim small">{[s.race, s.class].filter(Boolean).join(' · ') || 'No race or class yet'}</div>
        <div className="char-meta">
          {s.level && <span className="pill">Lvl {s.level}</span>}
          {s.floor && <span className="pill">Floor {s.floor}</span>}
          {s.crawlerNumber && <span className="pill">#{s.crawlerNumber}</span>}
        </div>
        <div className="dim tiny">Updated {new Date(c.updatedAt + 'Z').toLocaleString()}</div>
      </div>
    </Link>
  );
}
