import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, type Npc } from '../lib/api';
import { useI18n, type MsgKey } from '../lib/i18n';
import { useLive } from '../lib/live';
import { NPC_KINDS, loadNpc, npcFloor } from '../lib/npc';

/** GM-only list of NPC / Mob stat blocks. */
export default function NpcsPage() {
  const { t, err } = useI18n();
  const navigate = useNavigate();
  const [npcs, setNpcs] = useState<Npc[] | null>(null);
  const [error, setError] = useState<unknown>(null);
  const [filter, setFilter] = useState('');
  const [floor, setFloor] = useState('');
  const [kind, setKind] = useState('');
  const [importing, setImporting] = useState(false);
  const [imported, setImported] = useState<string>('');

  const load = () =>
    api
      .npcs()
      .then(setNpcs)
      .catch((e) => setError(e ?? new Error()));
  const importBook = async () => {
    setImporting(true);
    try {
      const r = await api.importBookNpcs();
      setImported(t(r.updated ? 'npc.importedUpdated' : 'npc.imported', { n: r.added, total: r.total, u: r.updated }));
      await load();
    } catch (e) {
      setError(e);
    } finally {
      setImporting(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const create = async () => {
    try {
      const n = await api.createNpc();
      navigate(`/admin/npcs/${n.id}`);
    } catch (e) {
      setError(e);
    }
  };

  const floors = useMemo(
    () => [...new Set((npcs ?? []).map((n) => npcFloor(n.data)))].sort((a, b) => (a || 99) - (b || 99)),
    [npcs],
  );
  // grouped by Floor, then sorted by name; "any floor" (and your own without a Floor) last
  const groups = useMemo(() => {
    const f = filter.trim().toLowerCase();
    const list = (npcs ?? []).filter(
      (n) =>
        (!f || `${n.data.name ?? ''} ${n.data.tags ?? ''}`.toLowerCase().includes(f)) &&
        (floor === '' || npcFloor(n.data) === Number(floor)) &&
        (!kind || loadNpc(n.data).kind === kind),
    );
    const map = new Map<number, Npc[]>();
    for (const n of list) map.set(npcFloor(n.data), [...(map.get(npcFloor(n.data)) ?? []), n]);
    return [...map.entries()]
      .sort(([a], [b]) => (a || 99) - (b || 99))
      .map(([fl, items]) => ({
        fl,
        items: items.sort((a, b) => (a.data.name ?? '').localeCompare(b.data.name ?? '')),
      }));
  }, [npcs, filter, floor, kind]);

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
          <select
            className="in sel"
            value={floor}
            onChange={(e) => setFloor(e.target.value)}
            aria-label={t('npc.floor')}
          >
            <option value="">{t('npc.allChapters')}</option>
            {floors.map((f) => (
              <option key={f} value={f}>
                {f ? t('dash.floor', { n: f }) : t('npc.anyFloor')}
              </option>
            ))}
          </select>
          <select className="in sel" value={kind} onChange={(e) => setKind(e.target.value)} aria-label={t('npc.kind')}>
            <option value="">{t('npc.allKinds')}</option>
            {NPC_KINDS.map((k) => (
              <option key={k} value={k}>
                {t(`npc.kind.${k}` as MsgKey)}
              </option>
            ))}
          </select>
          <button className="btn" onClick={importBook} disabled={importing} title={t('npc.importHint')}>
            {importing ? '…' : t('npc.import')}
          </button>
          <button className="btn primary" onClick={create}>
            {t('npc.new')}
          </button>
        </div>
      </div>
      {!!error && <p className="error">{err(error)}</p>}
      {imported && <p className="ok small">{imported}</p>}
      {!npcs && !error && <p className="dim">{t('common.loading')}</p>}
      {npcs && npcs.length === 0 && (
        <div className="empty">
          <h2>{t('npc.emptyTitle')}</h2>
          <p className="dim">{t('npc.empty')}</p>
          <div className="row-gap center-row">
            <button className="btn primary" onClick={importBook} disabled={importing}>
              {t('npc.import')}
            </button>
            <button className="btn" onClick={create}>
              {t('npc.new')}
            </button>
          </div>
        </div>
      )}
      {groups.map((g) => (
        <div key={g.fl} className="group">
          <h2 className="group-title">
            {g.fl ? t('dash.floor', { n: g.fl }) : t('npc.anyFloor')} <span className="dim">({g.items.length})</span>
          </h2>
          <div className="char-grid">
            {g.items.map((n) => (
              <NpcCard key={n.id} npc={n} />
            ))}
          </div>
        </div>
      ))}
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
        {d.source && (
          <div className="dim tiny">
            {[d.source, d.chapter.replace(/^Floor \d+ · /, '')].filter(Boolean).join(' · ')}
          </div>
        )}
        <AddToCombat npcId={npc.id} compact />
      </div>
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
