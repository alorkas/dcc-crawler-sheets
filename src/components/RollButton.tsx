import { useEffect, useRef, useState } from 'react';
import { useI18n } from '../lib/i18n';
import { useLiveOptional } from '../lib/live';
import { useSheet } from './fields';

/**
 * A roll value on the sheet ("d20 +6", "1d8+3"). Clicking it rolls on the server and posts the result
 * to the shared log as this character; the result also flashes on the button.
 */
export function RollButton({
  expr,
  label,
  text,
  className = '',
}: {
  expr: string;
  label: string;
  text?: string;
  className?: string;
}) {
  const { t } = useI18n();
  const live = useLiveOptional();
  const { charId } = useSheet();
  const [result, setResult] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const shown = text ?? expr;
  if (!live) return <output className={`roll-total ${className}`}>{shown}</output>;
  const roll = async () => {
    try {
      const m = await live.send({ roll: { expr, label }, characterId: charId ?? null });
      const r = m.roll;
      setResult(r ? `= ${r.total}${r.natural === 20 ? ' ★' : ''}` : null);
    } catch {
      setResult('!');
    }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setResult(null), 2500);
  };
  return (
    <button
      type="button"
      className={`roll-total roll-btn ${result ? 'rolled' : ''} ${className}`}
      onClick={roll}
      title={t('roll.hint', { label, expr })}
      aria-label={t('roll.hint', { label, expr })}
    >
      {result ?? shown}
    </button>
  );
}
