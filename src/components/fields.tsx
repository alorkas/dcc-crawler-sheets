import { createContext, useContext, useLayoutEffect, useRef, type ReactNode } from 'react';
import { getIn, type SheetData } from '../lib/sheet';
import { isPlayPath } from '../../shared/lockRules.js';
import type { Derived } from '../lib/rules';

export type Path = (string | number)[];

type SheetCtxValue = {
  /** Server id of the character (used to post rolls as this character). */
  charId?: number;
  data: SheetData;
  /** Values calculated from the rules (stat mods, max mana, HB slot value, totals…). */
  der: Derived;
  /** Build lock: name, race, stats, skills, gear… are read-only. */
  locked: boolean;
  /** Nothing at all can be edited (e.g. while resolving a save conflict). Play fields ignore the build lock. */
  playLocked: boolean;
  set: (path: Path, value: unknown) => void;
  /** Whole-sheet change (rests, damage, advancement). With a label, the change can be undone once. */
  update: (fn: (d: SheetData) => SheetData, undoLabel?: string) => void;
};

export const SheetCtx = createContext<SheetCtxValue | null>(null);

export function useSheet() {
  const ctx = useContext(SheetCtx);
  if (!ctx) throw new Error('useSheet outside SheetCtx');
  return ctx;
}

export function useField<T = string>(path: Path): [T, (v: T) => void, boolean] {
  const { data, set, locked, playLocked } = useSheet();
  return [getIn(data, path) as T, (v: T) => set(path, v), isPlayPath(path) ? playLocked : locked];
}

type InputProps = {
  path: Path;
  label?: ReactNode;
  placeholder?: string;
  className?: string;
  center?: boolean;
  numeric?: boolean;
  big?: boolean;
  ariaLabel?: string;
  /** id of a <datalist> with suggestions */
  list?: string;
};

export function Input({ path, label, placeholder, className = '', center, numeric, big, ariaLabel, list }: InputProps) {
  const [value, setValue, locked] = useField<string>(path);
  const input = (
    <input
      className={`in ${center ? 'center' : ''} ${big ? 'big' : ''}`}
      value={value ?? ''}
      readOnly={locked}
      tabIndex={locked ? -1 : undefined}
      placeholder={locked ? '' : placeholder}
      inputMode={numeric ? 'numeric' : undefined}
      list={locked ? undefined : list}
      aria-label={ariaLabel ?? (typeof label === 'string' ? label : undefined)}
      onChange={(e) => setValue(e.target.value)}
    />
  );
  if (!label) return <div className={className}>{input}</div>;
  return (
    <label className={`field ${className}`}>
      <span className="lbl">{label}</span>
      {input}
    </label>
  );
}

export function Area({
  path,
  label,
  rows = 3,
  placeholder,
  className = '',
}: {
  path: Path;
  label?: ReactNode;
  rows?: number;
  placeholder?: string;
  className?: string;
}) {
  const [value, setValue, locked] = useField<string>(path);
  const ref = useRef<HTMLTextAreaElement>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight + 2}px`;
  }, [value]);
  const area = (
    <textarea
      ref={ref}
      className="in area"
      rows={rows}
      value={value ?? ''}
      readOnly={locked}
      placeholder={locked ? '' : placeholder}
      aria-label={typeof label === 'string' ? label : undefined}
      onChange={(e) => setValue(e.target.value)}
    />
  );
  if (!label) return <div className={className}>{area}</div>;
  return (
    <label className={`field ${className}`}>
      <span className="lbl">{label}</span>
      {area}
    </label>
  );
}

export function Check({ path, label }: { path: Path; label: string }) {
  const [value, setValue, locked] = useField<boolean>(path);
  return (
    <label className="check" title={label}>
      <input
        type="checkbox"
        checked={!!value}
        disabled={locked}
        aria-label={label}
        onChange={(e) => setValue(e.target.checked)}
      />
      <span aria-hidden>✔</span>
    </label>
  );
}

export function Section({
  title,
  children,
  className = '',
  tone = 'dark',
  actions,
}: {
  title: ReactNode;
  children: ReactNode;
  className?: string;
  tone?: 'dark' | 'red';
  actions?: ReactNode;
}) {
  return (
    <section className={`card ${className}`}>
      <header className={`card-head ${tone}`}>
        <h2>{title}</h2>
        {actions}
      </header>
      <div className="card-body">{children}</div>
    </section>
  );
}
