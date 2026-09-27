import { createContext, useContext, useState, type ReactNode } from 'react';
import { api, type CrawlerAttack, type Opponent } from '../lib/api';
import { useI18n } from '../lib/i18n';
import { useLiveOptional } from '../lib/live';
import { RollButton } from './RollButton';
import { useSheet } from './fields';

/* In combat, a crawler's pinned attacks can target an opponent: the server rolls against the Mob's Evade
   (hidden from players), uses one of their Actions, and on a hit they roll damage for the GM to apply. */

type TargetState = { target: number | null; setTarget: (id: number | null) => void };
const TargetCtx = createContext<TargetState>({ target: null, setTarget: () => {} });

/** The fight as this sheet's crawler sees it: null when not in combat or not in the party. */
function useFight() {
  const live = useLiveOptional();
  const { charId } = useSheet();
  const enc = live?.encounter;
  if (!live || !enc?.active || !charId || !live.party?.some((m) => m.id === charId)) return null;
  const targets = enc.opponents.filter((o) => !o.defeated);
  return { live, enc, charId, targets };
}

export function TargetProvider({ children }: { children: ReactNode }) {
  const [target, setTarget] = useState<number | null>(null);
  return <TargetCtx.Provider value={{ target, setTarget }}>{children}</TargetCtx.Provider>;
}

/** Above the pinned attacks during combat: pick a target, see Actions left and this round's attacks. */
export function CombatTargetBar() {
  const { t } = useI18n();
  const fight = useFight();
  const { target, setTarget } = useContext(TargetCtx);
  if (!fight) return null;
  const { enc, charId, targets } = fight;
  const current = targets.find((o) => o.id === target) ?? null;
  const acts = enc.actions?.[charId] ?? { used: [], extra: false, max: 2 };
  const left = Math.max(0, acts.max - acts.used.length);
  const attackStep = enc.round === 0 || enc.phase === 4;
  const mine = (enc.attacks ?? []).filter((a) => a.characterId === charId);
  return (
    <div className="target-bar">
      <div className="target-row">
        <label className="gm-check">
          🎯 {t('atkt.target')}
          <select
            className="in sel"
            value={current?.id ?? ''}
            onChange={(e) => setTarget(e.target.value ? Number(e.target.value) : null)}
          >
            <option value="">{t('atkt.none')}</option>
            {targets.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name} · {o.pct}%
              </option>
            ))}
          </select>
        </label>
        <span className={`dim tiny ${left === 0 ? 'bad-pill' : ''}`}>{t('actions.left', { n: left })}</span>
      </div>
      <p className="dim tiny">{current ? t(attackStep ? 'atkt.ready' : 'atkt.notYet') : t('atkt.hint')}</p>
      {mine.length > 0 && (
        <ul className="atk-results">
          {mine.map((a) => (
            <AttackResult key={a.id} a={a} />
          ))}
        </ul>
      )}
    </div>
  );
}

function AttackResult({ a }: { a: CrawlerAttack }) {
  const { t, err } = useI18n();
  const fight = useFight();
  const [error, setError] = useState('');
  const rollDamage = async () => {
    setError('');
    try {
      if (fight) fight.live.setEncounter(await api.attackDamage(a.id));
    } catch (e) {
      setError(err(e));
    }
  };
  return (
    <li className={a.hit ? 'hit' : a.hit === false ? 'miss' : ''}>
      <span className="grow">
        <strong>{a.label}</strong> → {a.opponentName}
      </span>
      <HitResult a={a} />
      {a.hit !== false &&
        (a.damage ? (
          <span>
            🎲 <strong>{a.damage.total}</strong>
            {a.applied ? (
              <span className="dim tiny"> · {t('atkt.applied', { n: a.applied.slots })}</span>
            ) : (
              <span className="dim tiny"> · {t('atkt.waitGm')}</span>
            )}
          </span>
        ) : (
          a.damageExpr && (
            <button type="button" className="btn small primary" onClick={rollDamage}>
              🎲 {t('roll.damage')} {a.damageExpr}
            </button>
          )
        ))}
      {error && <span className="error tiny">{error}</span>}
    </li>
  );
}

export function HitResult({ a, showDc }: { a: CrawlerAttack; showDc?: boolean }) {
  const { t } = useI18n();
  return (
    <span className={`evade-res ${a.hit ? 'ok' : a.hit === false ? 'bad' : ''}`}>
      {a.hit ? `✓ ${t('atkt.hit')}` : a.hit === false ? `✗ ${t('atkt.miss')}` : `? ${t('atkt.gmCall')}`} {a.total}
      {showDc && a.dc !== undefined && a.dc !== null && <span className="dim tiny"> vs {a.dc}</span>}
    </span>
  );
}

/**
 * A pinned attack's to-hit button: with a target picked (in combat) it attacks that opponent,
 * otherwise it's a normal roll to the log.
 */
export function AttackRollButton({
  expr,
  text,
  label,
  name,
  damage,
  className,
}: {
  expr: string;
  text: string;
  label: string;
  /** Attack name for the log ("Long Sword → Bad Llama 2"). */
  name: string;
  damage: string | null;
  className?: string;
}) {
  const { t, err } = useI18n();
  const fight = useFight();
  const { target } = useContext(TargetCtx);
  const [flash, setFlash] = useState<string | null>(null);
  const opp: Opponent | undefined = fight?.targets.find((o) => o.id === target);
  if (!fight || !opp) return <RollButton expr={expr} text={text} label={label} className={className} />;
  const attack = async () => {
    try {
      const enc = await api.crawlerAttack({
        characterId: fight.charId,
        opponentId: opp.id,
        expr,
        damage,
        label: name,
      });
      fight.live.setEncounter(enc);
      const mine = enc.attacks.filter((a) => a.characterId === fight.charId);
      const last = mine[mine.length - 1];
      setFlash(last ? `${last.hit ? '✓' : last.hit === false ? '✗' : '?'} ${last.total}` : null);
    } catch (e) {
      setFlash(err(e));
    }
    setTimeout(() => setFlash(null), 2500);
  };
  return (
    <button
      type="button"
      className={`roll-total roll-btn target-roll ${flash ? 'rolled' : ''} ${className ?? ''}`}
      onClick={attack}
      title={t('atkt.attackHint', { name: opp.name })}
    >
      {flash ?? `🎯 ${text}`}
    </button>
  );
}
