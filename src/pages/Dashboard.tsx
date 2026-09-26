import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, type CharacterSummary } from '../lib/api';
import { useAuth } from '../lib/auth';
import { LockIcon } from '../components/icons';
import { useI18n } from '../lib/i18n';

export default function Dashboard({ scope }: { scope: 'mine' | 'all' }) {
  const { user } = useAuth();
  const { t, err } = useI18n();
  const navigate = useNavigate();
  const [chars, setChars] = useState<CharacterSummary[] | null>(null);
  const [error, setError] = useState<unknown>(null);
  const [filter, setFilter] = useState('');
  const all = scope === 'all' && !!user?.isAdmin;

  useEffect(() => {
    setChars(null);
    api
      .listCharacters(all)
      .then(setChars)
      .catch((e) => setError(e ?? new Error()));
  }, [all]);

  const create = () => navigate('/new');

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
          <h1>{t(all ? 'dash.titleAll' : 'dash.titleMine')}</h1>
          <p className="dim">{t(all ? 'dash.subAll' : 'dash.subMine')}</p>
        </div>
        <div className="page-actions">
          {all && (
            <input
              className="in search"
              placeholder={t('dash.search')}
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          )}
          <button className="btn primary" onClick={create}>
            {t('dash.new')}
          </button>
        </div>
      </div>

      {!!error && <p className="error">{err(error, 'err.createFailed')}</p>}
      {!chars && !error && <p className="dim">{t('common.loading')}</p>}
      {chars && chars.length === 0 && (
        <div className="empty">
          <h2>{t('dash.emptyTitle')}</h2>
          <p className="dim">{t(all ? 'dash.emptyAll' : 'dash.emptyMine')}</p>
          <button className="btn primary" onClick={create}>
            {t('dash.create')}
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
  const { t, locale } = useI18n();
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
          {s.name || t('dash.unnamed')}
          {c.locked && (
            <span className="lock-pill" title={t('dash.locked')}>
              <LockIcon />
            </span>
          )}
        </div>
        <div className="dim small">{[s.race, s.class].filter(Boolean).join(' · ') || t('dash.noRaceClass')}</div>
        <div className="char-meta">
          {s.level && <span className="pill">{t('dash.lvl', { n: s.level })}</span>}
          {s.floor && <span className="pill">{t('dash.floor', { n: s.floor })}</span>}
          {s.crawlerNumber && <span className="pill">#{s.crawlerNumber}</span>}
        </div>
        <div className="dim tiny">
          {t('dash.updated', { date: new Date(c.updatedAt + 'Z').toLocaleString(locale) })}
        </div>
      </div>
    </Link>
  );
}
