import { useEffect, useRef, useState } from 'react';
import { dropDebuffs } from '../../shared/combat.js';
import { useI18n, type MsgKey } from '../lib/i18n';
import { useLiveOptional } from '../lib/live';
import type { CheckRoll } from '../lib/rules';
import { signed, type SheetData } from '../lib/sheet';
import { useSheet } from './fields';

/** Damage multipliers rolled on the server: Powerful Strike (base dice × Rank) and × the total (Choke Out, Smush). */
export type RollMult = { multBase?: number; baseTerms?: number; multTotal?: number };

/**
 * A roll value on the sheet ("d20 +6", "1d8+3"). Clicking it rolls on the server and posts the result
 * to the shared log as this character; the result also flashes on the button.
 */
export function RollButton({
  expr,
  label,
  text,
  className = '',
  stat = false,
  beforeRoll,
  onRolled,
  mult,
  why,
}: {
  expr: string;
  label: string;
  text?: string;
  className?: string;
  /** A Stat Check (Intervene can't help those). */
  stat?: boolean;
  /** Checked first (e.g. a ranged weapon needs Ammunition): false stops the roll. */
  beforeRoll?: () => boolean;
  /** After a roll went through (e.g. take off a Debuff that only lasted one Check). */
  onRolled?: () => void;
  mult?: RollMult;
  /** Why it's rolled with Advantage/Disadvantage (shown on hover). */
  why?: string;
}) {
  const { t } = useI18n();
  const live = useLiveOptional();
  const { charId } = useSheet();
  const [result, setResult] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const shown = text ?? expr;
  const hint = [t('roll.hint', { label, expr }), why].filter(Boolean).join(' · ');
  if (!live) return <output className={`roll-total ${className}`}>{shown}</output>;
  const roll = async () => {
    if (beforeRoll && !beforeRoll()) return;
    try {
      const m = await live.send({
        roll: { expr, label, ...(stat ? { stat } : {}), ...(mult ?? {}) },
        characterId: charId ?? null,
      });
      const r = m.roll;
      setResult(r ? `= ${r.total}${r.natural === 20 ? ' ★' : ''}` : null);
      onRolled?.();
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
      title={hint}
      aria-label={hint}
    >
      {result ?? shown}
    </button>
  );
}

/** "▲ " / "▼ " in front of a roll with Advantage / Disadvantage. */
export const modeMark = (mode: CheckRoll['mode']) => (mode === 'adv' ? '▲ ' : mode === 'dis' ? '▼ ' : '');

/** Why a roll has Advantage/Disadvantage, in words: "Disadvantage: untrained, Stunned". */
export function useWhy() {
  const { t } = useI18n();
  return (c: Pick<CheckRoll, 'mode' | 'why'>) => {
    if (c.mode === 'normal' && !c.why.length) return '';
    const words = c.why.map((w) =>
      w === 'untrained' ? t('roll.untrained') : w.startsWith('debuff:') ? t(`debuff.${w.slice(7)}` as MsgKey) : w,
    );
    return `${t(c.mode === 'adv' ? 'roll.adv' : c.mode === 'dis' ? 'roll.dis' : 'roll.cancel')}: ${words.join(', ')}`;
  };
}

/** Takes off the one-shot Debuffs a roll used up (Stunned after a Check, Staggered after an Attack…). */
export function useUseUp() {
  const { update } = useSheet();
  return (ids: string[]) =>
    ids.length ? () => update((d) => ({ ...d, debuffList: dropDebuffs(d.debuffList, ids) })) : undefined;
}

/** A Check's button ("▼ d20 +4"): Advantage/Disadvantage shown and explained, one-shot Debuffs taken off after. */
export function CheckButton({
  roll,
  label,
  text,
  className,
  stat,
  onRolled,
}: {
  roll: CheckRoll;
  label: string;
  text?: string;
  className?: string;
  stat?: boolean;
  /** A sheet change to make after the roll too (e.g. note a Skill attempted untrained). */
  onRolled?: (d: SheetData) => SheetData;
}) {
  const why = useWhy();
  const { update } = useSheet();
  // one sheet update for both: two in a row would start from the same sheet and the second would undo the first
  const after =
    roll.usesUp.length || onRolled
      ? () =>
          update((d) => {
            const next = onRolled ? onRolled(d) : d;
            return roll.usesUp.length ? { ...next, debuffList: dropDebuffs(next.debuffList, roll.usesUp) } : next;
          })
      : undefined;
  return (
    <RollButton
      expr={roll.expr}
      text={`${modeMark(roll.mode)}${text ?? `d20 ${signed(roll.bonus)}`}`}
      label={label}
      className={className}
      stat={stat}
      why={why(roll)}
      onRolled={after}
    />
  );
}
