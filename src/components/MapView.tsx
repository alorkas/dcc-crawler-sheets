import { useCallback, useEffect, useRef, useState, type PointerEvent as RPointerEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, mapImageUrl, type GameMap, type Poi, type PoiKind } from '../lib/api';
import { useI18n, type MsgKey } from '../lib/i18n';
import { useLiveOptional } from '../lib/live';

export const POI_ICON: Record<PoiKind, string> = {
  poi: '📍',
  stairs: '🪜',
  saferoom: '🛏',
  boss: '💀',
  danger: '⚠',
  loot: '💰',
  npc: '🙂',
  note: '📝',
};

/** The maps this viewer can see, refreshed live. */
export function useMaps() {
  const live = useLiveOptional();
  const tick = live?.mapsTick ?? 0;
  const [maps, setMaps] = useState<GameMap[] | null>(null);
  const [error, setError] = useState<unknown>(null);
  const load = useCallback(() => {
    api
      .maps()
      .then((m) => {
        setMaps(m);
        setError(null);
      })
      .catch((e) => setError(e ?? new Error()));
  }, []);
  useEffect(load, [load, tick]);
  return { maps, error, load, setMaps };
}

/* ---------------- images ---------------- */
const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('image'));
    img.src = src;
  });

/** A picked file as a data URL, scaled down (and re-encoded as JPEG) when it's very big. */
export async function fileToMapImage(file: File, maxDim = 3000): Promise<string> {
  const url = await new Promise<string>((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = () => reject(r.error);
    r.readAsDataURL(file);
  });
  const img = await loadImage(url);
  const big = Math.max(img.naturalWidth, img.naturalHeight) > maxDim;
  if (!big && file.size < 1.5 * 1024 * 1024 && /^data:image\/(png|jpeg|webp|gif);/.test(url)) return url;
  const scale = Math.min(1, maxDim / Math.max(img.naturalWidth, img.naturalHeight));
  const c = document.createElement('canvas');
  c.width = Math.round(img.naturalWidth * scale);
  c.height = Math.round(img.naturalHeight * scale);
  c.getContext('2d')!.drawImage(img, 0, 0, c.width, c.height);
  return c.toDataURL('image/jpeg', 0.88);
}

/**
 * The copy players get: the GM's map with every unrevealed cell painted over. Rendered in the GM's browser, so the
 * server never has to send the original to players.
 */
export async function renderFogged(m: GameMap, revealed: string[]): Promise<string> {
  const img = await loadImage(mapImageUrl(m));
  const scale = Math.min(1, 2400 / Math.max(img.naturalWidth, img.naturalHeight));
  const w = Math.round(img.naturalWidth * scale);
  const h = Math.round(img.naturalHeight * scale);
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d')!;
  ctx.drawImage(img, 0, 0, w, h);
  ctx.fillStyle = '#0b0b0d';
  const open = new Set(revealed);
  for (let col = 0; col < m.cols; col++)
    for (let row = 0; row < m.rows; row++) {
      if (open.has(`${col},${row}`)) continue;
      const x0 = Math.floor((col * w) / m.cols);
      const y0 = Math.floor((row * h) / m.rows);
      ctx.fillRect(x0, y0, Math.ceil(((col + 1) * w) / m.cols) - x0, Math.ceil(((row + 1) * h) / m.rows) - y0);
    }
  return c.toDataURL('image/jpeg', 0.85);
}

/* ---------------- the map itself ---------------- */
export type MapTool = 'none' | 'reveal' | 'hide' | 'poi' | 'party';

export function MapCanvas({
  map,
  gm,
  revealed,
  zoom = 1,
  tool = 'none',
  selected,
  onPaint,
  onPaintEnd,
  onPlace,
  onPoi,
  compact = false,
}: {
  map: GameMap;
  gm: boolean;
  revealed: string[];
  zoom?: number;
  tool?: MapTool;
  selected?: string | null;
  onPaint?: (cell: string, reveal: boolean) => void;
  onPaintEnd?: () => void;
  onPlace?: (x: number, y: number) => void;
  onPoi?: (p: Poi) => void;
  compact?: boolean;
}) {
  const { t } = useI18n();
  const stage = useRef<HTMLDivElement>(null);
  const painting = useRef(false);
  const open = new Set(revealed);
  const pos = (e: RPointerEvent) => {
    const r = stage.current!.getBoundingClientRect();
    return {
      x: Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)),
      y: Math.min(1, Math.max(0, (e.clientY - r.top) / r.height)),
    };
  };
  const cellAt = (e: RPointerEvent) => {
    const p = pos(e);
    return `${Math.min(map.cols - 1, Math.floor(p.x * map.cols))},${Math.min(map.rows - 1, Math.floor(p.y * map.rows))}`;
  };
  const down = (e: RPointerEvent) => {
    if (!gm) return;
    if (tool === 'reveal' || tool === 'hide') {
      painting.current = true;
      (e.target as Element).setPointerCapture?.(e.pointerId);
      onPaint?.(cellAt(e), tool === 'reveal');
    } else if (tool === 'poi' || tool === 'party') {
      const p = pos(e);
      onPlace?.(p.x, p.y);
    }
  };
  const move = (e: RPointerEvent) => {
    if (painting.current) onPaint?.(cellAt(e), tool === 'reveal');
  };
  const up = () => {
    if (painting.current) {
      painting.current = false;
      onPaintEnd?.();
    }
  };
  const cells = [];
  if (gm)
    for (let c = 0; c < map.cols; c++)
      for (let r = 0; r < map.rows; r++)
        if (!open.has(`${c},${r}`)) cells.push(<rect key={`${c},${r}`} x={c} y={r} width={1.02} height={1.02} />);
  return (
    <div
      ref={stage}
      className={`map-stage tool-${tool} ${compact ? 'compact' : ''}`}
      style={{ width: `${zoom * 100}%` }}
    >
      {map.hasImage ? (
        <img src={mapImageUrl(map)} alt={map.name} draggable={false} />
      ) : (
        <div className="map-noimg dim">{t(gm ? 'map.noImageGm' : 'map.noImage')}</div>
      )}
      <svg
        className="map-overlay"
        viewBox={`0 0 ${map.cols} ${map.rows}`}
        preserveAspectRatio="none"
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
      >
        {gm && <g className="fog">{cells}</g>}
        {map.showGrid && !compact && (
          <g className="grid">
            {Array.from({ length: map.cols - 1 }, (_, i) => (
              <line key={`c${i}`} x1={i + 1} x2={i + 1} y1={0} y2={map.rows} />
            ))}
            {Array.from({ length: map.rows - 1 }, (_, i) => (
              <line key={`r${i}`} y1={i + 1} y2={i + 1} x1={0} x2={map.cols} />
            ))}
          </g>
        )}
      </svg>
      {map.pois.map((p) => (
        <button
          key={p.id}
          type="button"
          className={`map-pin kind-${p.kind} ${p.hidden ? 'is-hidden' : ''} ${selected === p.id ? 'selected' : ''}`}
          style={{ left: `${p.x * 100}%`, top: `${p.y * 100}%` }}
          title={[p.name, p.note].filter(Boolean).join('\n')}
          onClick={(e) => {
            e.stopPropagation();
            onPoi?.(p);
          }}
          tabIndex={compact ? -1 : 0}
        >
          <span aria-hidden>{POI_ICON[p.kind]}</span>
          {!compact && p.name && <span className="pin-label">{p.name}</span>}
        </button>
      ))}
      {map.party && (
        <span
          className="map-party"
          style={{ left: `${map.party.x * 100}%`, top: `${map.party.y * 100}%` }}
          title={t('map.party')}
        >
          ★
        </span>
      )}
    </div>
  );
}

/** The shared map of the current Floor (or the latest shared one): small, click to open it full size. */
export function MiniMap() {
  const { t } = useI18n();
  const live = useLiveOptional();
  const navigate = useNavigate();
  const { maps } = useMaps();
  const floor = live?.world?.floor;
  const list = (maps ?? []).filter((m) => m.shared && m.hasImage);
  const m = list.find((x) => x.floor === floor) ?? list[list.length - 1];
  if (!m) return null;
  return (
    <button type="button" className="minimap" onClick={() => navigate(`/map/${m.id}`)} title={t('map.open')}>
      <span className="minimap-head">
        🗺 {m.name}
        <span className="dim tiny"> · {t('map.expand')}</span>
      </span>
      <MapCanvas map={{ ...m, showGrid: false }} gm={false} revealed={m.revealed} compact />
    </button>
  );
}

export const poiKindLabel = (t: ReturnType<typeof useI18n>['t'], k: PoiKind) => t(`map.kind.${k}` as MsgKey);
