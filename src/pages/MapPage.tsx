import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api, POI_KINDS, type GameMap, type MapPatch, type Poi } from '../lib/api';
import { useAuth } from '../lib/auth';
import { useI18n } from '../lib/i18n';
import { useLive } from '../lib/live';
import {
  fileToMapImage,
  MapCanvas,
  poiKindLabel,
  POI_ICON,
  renderFogged,
  useMaps,
  type MapTool,
} from '../components/MapView';

/**
 * Maps with fog of war. Players see the shared maps (only what the GM revealed, the visible points of interest and
 * the party token). The GM uploads maps, paints revealed cells, places pins and moves the party.
 */
export default function MapPage() {
  const { t, err } = useI18n();
  const { user } = useAuth();
  const { world } = useLive();
  const gm = !!user?.isAdmin;
  const navigate = useNavigate();
  const { id } = useParams();
  const { maps, error, setMaps } = useMaps();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<unknown>(null);
  const file = useRef<HTMLInputElement>(null);
  const current =
    maps?.find((m) => m.id === Number(id)) ??
    maps?.find((m) => m.floor === world?.floor && (gm || m.shared)) ??
    maps?.[0] ??
    null;

  async function create(f: File) {
    setBusy(true);
    setMsg(null);
    try {
      const image = await fileToMapImage(f);
      const name = f.name.replace(/\.[^.]+$/, '').slice(0, 80) || t('map.untitled');
      let m = await api.createMap({ name, floor: world?.floor ?? 1, image, cols: 12, rows: 8 });
      m = await api.updateMap(m.id, { playerImage: await renderFogged(m, []) });
      setMaps((list) => [...(list ?? []).filter((x) => x.id !== m.id), m]);
      navigate(`/map/${m.id}`);
    } catch (e) {
      setMsg(e);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="page map-page">
      <div className="page-head">
        <div>
          <h1>{t('map.title')}</h1>
          <p className="dim">{t(gm ? 'map.subGm' : 'map.sub')}</p>
        </div>
        {gm && (
          <div className="page-actions">
            <input
              ref={file}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              hidden
              onChange={(e) => {
                const f = e.target.files?.[0];
                e.target.value = '';
                if (f) create(f);
              }}
            />
            <button type="button" className="btn primary" disabled={busy} onClick={() => file.current?.click()}>
              + {busy ? t('map.uploading') : t('map.upload')}
            </button>
          </div>
        )}
      </div>
      {!!error && <p className="error">{err(error)}</p>}
      {!!msg && <p className="error">{err(msg)}</p>}
      {maps && maps.length > 1 && (
        <nav className="map-tabs">
          {maps.map((m) => (
            <Link key={m.id} to={`/map/${m.id}`} className={m.id === current?.id ? 'active' : ''}>
              {m.name}
              <span className="dim tiny"> · {t('dash.floor', { n: m.floor })}</span>
              {gm && !m.shared && <span className="pill tiny-pill">{t('map.private')}</span>}
            </Link>
          ))}
        </nav>
      )}
      {maps && !current && <p className="dim">{t(gm ? 'map.emptyGm' : 'map.empty')}</p>}
      {current && (gm ? <GmMap key={current.id} map={current} /> : <PlayerMap map={current} />)}
    </div>
  );
}

function Zoom({ zoom, setZoom }: { zoom: number; setZoom: (z: number) => void }) {
  const { t } = useI18n();
  return (
    <div className="zoom">
      <button
        type="button"
        className="btn small ghost"
        onClick={() => setZoom(Math.max(1, zoom - 0.5))}
        aria-label={t('map.zoomOut')}
      >
        −
      </button>
      <span className="dim tiny">{Math.round(zoom * 100)}%</span>
      <button
        type="button"
        className="btn small ghost"
        onClick={() => setZoom(Math.min(4, zoom + 0.5))}
        aria-label={t('map.zoomIn')}
      >
        +
      </button>
    </div>
  );
}

function PlayerMap({ map }: { map: GameMap }) {
  const { t } = useI18n();
  const [zoom, setZoom] = useState(1);
  const [poi, setPoi] = useState<Poi | null>(null);
  return (
    <div className="map-layout">
      <div className="map-main">
        <div className="map-toolbar">
          <strong>{map.name}</strong>
          <Zoom zoom={zoom} setZoom={setZoom} />
        </div>
        <div className="map-scroll">
          <MapCanvas map={map} gm={false} revealed={map.revealed} zoom={zoom} onPoi={setPoi} selected={poi?.id} />
        </div>
      </div>
      <aside className="map-side">
        {poi ? <PoiCard poi={poi} onClose={() => setPoi(null)} /> : <p className="dim small">{t('map.pinHint')}</p>}
        <PoiList map={map} onPick={setPoi} />
      </aside>
    </div>
  );
}

function PoiCard({ poi, onClose }: { poi: Poi; onClose: () => void }) {
  const { t } = useI18n();
  return (
    <div className="poi-card">
      <div className="poi-head">
        <span aria-hidden>{POI_ICON[poi.kind]}</span>
        <strong className="grow">{poi.name || poiKindLabel(t, poi.kind)}</strong>
        <button type="button" className="icon-btn small" onClick={onClose} aria-label={t('common.close')}>
          ×
        </button>
      </div>
      <span className="dim tiny">{poiKindLabel(t, poi.kind)}</span>
      {poi.note && <p className="poi-note">{poi.note}</p>}
    </div>
  );
}

function PoiList({ map, onPick }: { map: GameMap; onPick: (p: Poi) => void }) {
  const { t } = useI18n();
  if (!map.pois.length) return null;
  return (
    <div className="poi-list">
      <div className="lbl">{t('map.pois')}</div>
      <ul>
        {map.pois.map((p) => (
          <li key={p.id}>
            <button type="button" className="link-btn" onClick={() => onPick(p)}>
              {POI_ICON[p.kind]} {p.name || poiKindLabel(t, p.kind)}
              {p.hidden && <span className="dim tiny"> · {t('map.hiddenPin')}</span>}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function GmMap({ map: initial }: { map: GameMap }) {
  const { t, err } = useI18n();
  const navigate = useNavigate();
  const [map, setMap] = useState(initial);
  const [revealed, setRevealed] = useState(initial.revealed);
  const [tool, setTool] = useState<MapTool>('reveal');
  const [zoom, setZoom] = useState(1);
  const [sel, setSel] = useState<string | null>(null);
  const [state, setState] = useState<'saved' | 'saving' | 'error'>('saved');
  const [error, setError] = useState<unknown>(null);
  const file = useRef<HTMLInputElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const saveSeq = useRef(0);
  const latest = useRef({ map, revealed });
  latest.current = { map, revealed };
  // someone else changed it (another GM tab): take the server's version unless we're mid-edit
  useEffect(() => {
    if (state === 'saved') {
      setMap(initial);
      setRevealed(initial.revealed);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial.updatedAt]);

  /** Save a change; `fog` re-renders the players' copy (reveals, a new image, a new grid). */
  async function save(patch: MapPatch, fog = false) {
    const seq = ++saveSeq.current;
    setState('saving');
    setError(null);
    try {
      let m = await api.updateMap(map.id, patch);
      if (fog) m = await api.updateMap(m.id, { playerImage: await renderFogged(m, m.revealed) });
      // a newer edit is on its way: don't let this older answer undo it
      if (seq !== saveSeq.current) return;
      setMap(m);
      setState('saved');
    } catch (e) {
      setError(e);
      setState('error');
    }
  }
  const saveSoon = () => {
    clearTimeout(timer.current);
    setState('saving');
    timer.current = setTimeout(() => save({ revealed: latest.current.revealed }, true), 600);
  };
  useEffect(() => () => clearTimeout(timer.current), []);

  const paint = (cell: string, reveal: boolean) =>
    setRevealed((r) => (reveal ? (r.includes(cell) ? r : [...r, cell]) : r.filter((x) => x !== cell)));
  const place = (x: number, y: number) => {
    if (tool === 'party') {
      setMap({ ...map, party: { x, y } });
      save({ party: { x, y } });
    } else if (tool === 'poi') {
      const p: Poi = { id: `p${Date.now().toString(36)}`, x, y, name: '', note: '', kind: 'poi', hidden: true };
      const pois = [...map.pois, p];
      setMap({ ...map, pois });
      setSel(p.id);
      save({ pois });
    }
  };
  const selected = map.pois.find((p) => p.id === sel) ?? null;
  const setPoi = (patch: Partial<Poi>) => {
    const pois = map.pois.map((p) => (p.id === sel ? { ...p, ...patch } : p));
    setMap({ ...map, pois });
  };
  const savePois = () => save({ pois: map.pois });
  const all = () => {
    const cells: string[] = [];
    for (let c = 0; c < map.cols; c++) for (let r = 0; r < map.rows; r++) cells.push(`${c},${r}`);
    return cells;
  };

  return (
    <div className="map-layout">
      <div className="map-main">
        <div className="map-toolbar">
          <div className="seg">
            {(['reveal', 'hide', 'poi', 'party', 'none'] as MapTool[]).map((x) => (
              <button
                key={x}
                type="button"
                className={`btn small ${tool === x ? 'primary' : 'ghost'}`}
                onClick={() => setTool(x)}
                title={t(`map.toolHint.${x}`)}
              >
                {t(`map.tool.${x}`)}
              </button>
            ))}
          </div>
          <Zoom zoom={zoom} setZoom={setZoom} />
          <span className={`dim tiny save-state ${state}`}>
            {state === 'saving' ? t('map.saving') : state === 'error' ? t('map.saveError') : t('map.saved')}
          </span>
        </div>
        <div className="map-scroll">
          <MapCanvas
            map={map}
            gm
            revealed={revealed}
            zoom={zoom}
            tool={tool}
            selected={sel}
            onPaint={paint}
            onPaintEnd={saveSoon}
            onPlace={place}
            onPoi={(p) => {
              setSel(p.id);
              if (tool === 'poi' || tool === 'party' || tool === 'none') return;
              setTool('none');
            }}
          />
        </div>
        <p className="dim tiny">{t('map.gmHint')}</p>
      </div>
      <aside className="map-side">
        {!!error && <p className="error tiny">{err(error)}</p>}
        {selected && (
          <div className="poi-edit">
            <div className="poi-head">
              <span aria-hidden>{POI_ICON[selected.kind]}</span>
              <strong className="grow">{t('map.pinTitle')}</strong>
              <button
                type="button"
                className="icon-btn small"
                onClick={() => setSel(null)}
                aria-label={t('common.close')}
              >
                ×
              </button>
            </div>
            <input
              className="in"
              value={selected.name}
              placeholder={t('map.pinName')}
              maxLength={80}
              onChange={(e) => setPoi({ name: e.target.value })}
              onBlur={savePois}
            />
            <select
              className="in sel"
              value={selected.kind}
              onChange={(e) => {
                const pois = map.pois.map((p) => (p.id === sel ? { ...p, kind: e.target.value as Poi['kind'] } : p));
                setMap({ ...map, pois });
                save({ pois });
              }}
            >
              {POI_KINDS.map((k) => (
                <option key={k} value={k}>
                  {POI_ICON[k]} {poiKindLabel(t, k)}
                </option>
              ))}
            </select>
            <textarea
              className="in area"
              rows={3}
              value={selected.note}
              placeholder={t('map.pinNote')}
              onChange={(e) => setPoi({ note: e.target.value })}
              onBlur={savePois}
            />
            <label className="gm-check">
              <input
                type="checkbox"
                checked={!selected.hidden}
                onChange={(e) => {
                  const pois = map.pois.map((p) => (p.id === sel ? { ...p, hidden: !e.target.checked } : p));
                  setMap({ ...map, pois });
                  save({ pois });
                }}
              />
              {t('map.pinVisible')}
            </label>
            <button
              type="button"
              className="btn small ghost danger"
              onClick={() => {
                const pois = map.pois.filter((p) => p.id !== sel);
                setMap({ ...map, pois });
                setSel(null);
                save({ pois });
              }}
            >
              {t('map.pinDelete')}
            </button>
          </div>
        )}
        <div className="map-settings">
          <label className="field">
            <span className="lbl">{t('map.name')}</span>
            <input
              className="in"
              value={map.name}
              maxLength={80}
              onChange={(e) => setMap({ ...map, name: e.target.value })}
              onBlur={() => save({ name: map.name })}
            />
          </label>
          <div className="row2">
            <label className="field">
              <span className="lbl">{t('map.floor')}</span>
              <input
                className="in center"
                inputMode="numeric"
                value={map.floor}
                onChange={(e) => setMap({ ...map, floor: Number(e.target.value) || 1 })}
                onBlur={() => save({ floor: map.floor })}
              />
            </label>
            <label className="field">
              <span className="lbl">{t('map.cols')}</span>
              <input
                className="in center"
                inputMode="numeric"
                value={map.cols}
                onChange={(e) => setMap({ ...map, cols: Math.min(80, Number(e.target.value) || 1) })}
                onBlur={() => save({ cols: map.cols, revealed }, true)}
              />
            </label>
            <label className="field">
              <span className="lbl">{t('map.rows')}</span>
              <input
                className="in center"
                inputMode="numeric"
                value={map.rows}
                onChange={(e) => setMap({ ...map, rows: Math.min(80, Number(e.target.value) || 1) })}
                onBlur={() => save({ rows: map.rows, revealed }, true)}
              />
            </label>
          </div>
          <label className="gm-check">
            <input
              type="checkbox"
              checked={map.shared}
              onChange={(e) => {
                setMap({ ...map, shared: e.target.checked });
                save({ shared: e.target.checked });
              }}
            />
            {t('map.shared')}
          </label>
          <label className="gm-check">
            <input
              type="checkbox"
              checked={map.showGrid}
              onChange={(e) => {
                setMap({ ...map, showGrid: e.target.checked });
                save({ showGrid: e.target.checked });
              }}
            />
            {t('map.showGrid')}
          </label>
          <div className="row-actions wrap">
            <button
              type="button"
              className="btn small"
              onClick={() => {
                const cells = all();
                setRevealed(cells);
                save({ revealed: cells }, true);
              }}
            >
              {t('map.revealAll')}
            </button>
            <button
              type="button"
              className="btn small"
              onClick={() => {
                setRevealed([]);
                save({ revealed: [] }, true);
              }}
            >
              {t('map.hideAll')}
            </button>
            {map.party && (
              <button
                type="button"
                className="btn small ghost"
                onClick={() => {
                  setMap({ ...map, party: null });
                  save({ party: null });
                }}
              >
                {t('map.removeParty')}
              </button>
            )}
          </div>
          <div className="row-actions wrap">
            <input
              ref={file}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              hidden
              onChange={async (e) => {
                const f = e.target.files?.[0];
                e.target.value = '';
                if (f) save({ image: await fileToMapImage(f) }, true);
              }}
            />
            <button type="button" className="btn small ghost" onClick={() => file.current?.click()}>
              {t('map.replace')}
            </button>
            <a
              className="btn small ghost"
              href={`/api/maps/${map.id}/image?as=player&v=${map.playerTag}`}
              target="_blank"
              rel="noreferrer"
            >
              {t('map.preview')}
            </a>
            <button
              type="button"
              className="btn small ghost danger"
              onClick={async () => {
                if (!confirm(t('map.deleteConfirm', { name: map.name }))) return;
                await api.deleteMap(map.id);
                navigate('/map');
              }}
            >
              {t('map.delete')}
            </button>
          </div>
        </div>
        <PoiList map={map} onPick={(p) => setSel(p.id)} />
      </aside>
    </div>
  );
}
