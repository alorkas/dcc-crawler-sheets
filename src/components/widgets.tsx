import { useRef, type CSSProperties, type ReactNode } from 'react';
import { useField, useSheet, type Path } from './fields';
import type { HealthBox } from '../lib/sheet';

const HEALTH_COLORS = [
  '#e53935',
  '#ef5a2a',
  '#f4791f',
  '#f99a17',
  '#fbb80f',
  '#e8c81a',
  '#c7cc27',
  '#9dc634',
  '#6fbe3f',
  '#43b649',
];

/** Ten split boxes (10%–100%). Each box holds two values; tapping the % label marks it as lost. */
export function HealthTrack({ path, rows = 1 }: { path: Path; rows?: 1 | 2 }) {
  const [boxes, , locked] = useField<HealthBox[]>(path);
  const { set } = useSheet();
  return (
    <div className={`health rows-${rows}`}>
      {boxes.slice(0, 10).map((b, i) => (
        <div key={i} className={`hbox ${b.hit ? 'hit' : ''}`} style={{ '--c': HEALTH_COLORS[i] } as CSSProperties}>
          <div className="hsplit">
            <input
              className="ha"
              value={b.a}
              readOnly={locked}
              aria-label={`${(i + 1) * 10}% upper value`}
              onChange={(e) => set([...path, i, 'a'], e.target.value)}
            />
            <input
              className="hb"
              value={b.b}
              readOnly={locked}
              aria-label={`${(i + 1) * 10}% lower value`}
              onChange={(e) => set([...path, i, 'b'], e.target.value)}
            />
          </div>
          <button
            type="button"
            className="hpct"
            disabled={locked}
            title={b.hit ? 'Marked as lost — click to restore' : 'Click to mark as lost'}
            onClick={() => set([...path, i, 'hit'], !b.hit)}
          >
            {(i + 1) * 10}%
          </button>
        </div>
      ))}
    </div>
  );
}

/** Dynamic list with add/remove controls (hidden when locked). */
export function ListRows<T>({
  path,
  make,
  children,
  addLabel = 'Add row',
  header,
  className = '',
}: {
  path: Path;
  make: () => T;
  children: (i: number, item: T) => ReactNode;
  addLabel?: string;
  header?: ReactNode;
  className?: string;
}) {
  const [items, setItems, locked] = useField<T[]>(path);
  return (
    <div className={`list ${className}`}>
      {header}
      {items.map((item, i) => (
        <div className="list-row" key={i}>
          {children(i, item)}
          {!locked && (
            <button
              type="button"
              className="row-del"
              title="Remove row"
              aria-label="Remove row"
              onClick={() => setItems(items.filter((_, j) => j !== i))}
            >
              ×
            </button>
          )}
        </div>
      ))}
      {!locked && (
        <button type="button" className="btn ghost add-row" onClick={() => setItems([...items, make()])}>
          + {addLabel}
        </button>
      )}
    </div>
  );
}

async function resizeImage(file: File, max = 640): Promise<string> {
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.src = url;
    await img.decode();
    const scale = Math.min(1, max / Math.max(img.width, img.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(img.width * scale);
    canvas.height = Math.round(img.height * scale);
    canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', 0.85);
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function Portrait() {
  const [value, setValue, locked] = useField<string>(['portrait']);
  const fileRef = useRef<HTMLInputElement>(null);
  return (
    <div className={`portrait ${value ? 'has' : ''}`}>
      {value ? <img src={value} alt="Character portrait" /> : <span className="portrait-empty">Portrait</span>}
      {!locked && (
        <div className="portrait-actions">
          <button type="button" className="btn small" onClick={() => fileRef.current?.click()}>
            {value ? 'Change' : 'Upload'}
          </button>
          {value && (
            <button type="button" className="btn small ghost" onClick={() => setValue('')}>
              Remove
            </button>
          )}
        </div>
      )}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        hidden
        onChange={async (e) => {
          const f = e.target.files?.[0];
          if (f) setValue(await resizeImage(f));
          e.target.value = '';
        }}
      />
    </div>
  );
}
