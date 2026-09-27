import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, type Npc } from '../lib/api';
import { useI18n, type MsgKey } from '../lib/i18n';
import { useLive } from '../lib/live';
import { loadNpc } from '../lib/npc';

/** GM-only list of NPC / Mob stat blocks. */
export default function NpcsPage() {
  const { t, err } = useI18n();
  const navigate = useNavigate();
  const [npcs, setNpcs] = useState<Npc[] | null>(null);
  const [error, setError] = useState<unknown>(null);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    api
      .npcs()
      .then(setNpcs)
      .catch((e) => setError(e ?? new Error()));
  }, []);

  const create = async () => {
    try {
      const n = await api.createNpc();
      navigate(`/admin/npcs/${n.id}`);
    } catch (e) {
      setError(e);
    }
  };

  const shown = useMemo(() => {
    const f = filter.trim().toLowerCase();
    return (npcs ?? []).filter((n) => !f || `${n.data.name ?? ''} ${n.data.tags ?? ''}`.toLowerCase().includes(f));
  }, [npcs, filter]);

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>{t('npc.title')}</h1>
          <p className="dim">{t('npc.sub')}</p>
        </div>
        <div className="page-actions">
          <input
            className="in search"
            placeholder={t('dash.search')}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <button className="btn primary" onClick={create}>
            {t('npc.new')}
          </button>
        </div>
      </div>
      {!!error && <p className="error">{err(error)}</p>}
      {!npcs && !error && <p className="dim">{t('common.loading')}</p>}
      {npcs && npcs.length === 0 && (
        <div className="empty">
          <h2>{t('npc.emptyTitle')}</h2>
          <p className="dim">{t('npc.empty')}</p>
          <button className="btn primary" onClick={create}>
            {t('npc.new')}
          </button>
        </div>
      )}
      <div className="char-grid">
        {shown.map((n) => (
          <NpcCard key={n.id} npc={n} />
        ))}
      </div>
    </div>
  );
}

function NpcCard({ npc }: { npc: Npc }) {
  const { t } = useI18n();
  const d = loadNpc(npc.data);
  return (
    <Link to={`/admin/npcs/${npc.id}`} className="char-card npc-card">
      <div className={`char-portrait npc-kind kind-${d.kind}`}>
        <span>{t(`npc.kind.${d.kind}` as MsgKey).slice(0, 1)}</span>
      </div>
      <div className="char-info">
        <div className="char-name">{d.name || t('npc.unnamed')}</div>
        <div className="dim small">
          {[t(`npc.kind.${d.kind}` as MsgKey), d.size, d.tags].filter(Boolean).join(' · ')}
        </div>
        <div className="char-meta">
          {d.level && <span className="pill">{t('dash.lvl', { n: d.level })}</span>}
          <span className="pill">{t('npc.hbShort', { n: d.slots, v: d.slotValue })}</span>
          {d.evade && <span className="pill">{t('npc.evadeShort', { v: d.evade })}</span>}
          {d.dr && <span className="pill">{t('npc.drShort', { v: d.dr })}</span>}
        </div>
      </div>
      <AddToCombat npcId={npc.id} compact />
    </Link>
  );
}

/** "Add to combat" (with a count) for an NPC stat block. */
export function AddToCombat({ npcId, compact }: { npcId: number; compact?: boolean }) {
  const { t } = useI18n();
  const { setEncounter } = useLive();
  const [count, setCount] = useState('1');
  const [done, setDone] = useState(false);
  const add = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      setEncounter(await api.addOpponents({ npcId, count: Number(count) || 1 }));
      setDone(true);
      setTimeout(() => setDone(false), 1500);
    } catch {
      /* ignore */
    }
  };
  return (
    <div
      className={`add-combat ${compact ? 'compact' : ''}`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <input
        className="in center tiny-in"
        inputMode="numeric"
        value={count}
        aria-label={t('npc.count')}
        onChange={(e) => setCount(e.target.value)}
      />
      <button type="button" className="btn small" onClick={add}>
        {done ? '✓' : t('npc.addToCombat')}
      </button>
    </div>
  );
}
