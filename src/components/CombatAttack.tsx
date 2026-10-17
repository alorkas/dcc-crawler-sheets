import { createContext, useContext, useState, type ReactNode } from 'react';
import { api, type CrawlerAttack, type Opponent } from '../lib/api';
import { useI18n, type MsgKey } from '../lib/i18n';
import { spendMana } from '../lib/rules';
import { ammoFor, isHealSpell, spellRef, spendOne, weaponFor } from '../../shared/items.js';
import type { Effect } from '../lib/sheet';
import { DegreeBadge } from './Status';
import { useLiveOptional } from '../lib/live';
import { RollButton } from './RollButton';
import { useSheet } from './fields';

/* In combat, a crawler's pinned attacks can target an opponent: the server rolls against the Mob's Evade
   (hidden from players), uses one of their Actions, and on a hit they roll damage for the GM to apply. */

type RollMode = 'auto' | 'normal' | 'adv' | 'dis';
type TargetState = {
  target: number | null;
  setTarget: (id: number | null) => void;
  /** Area Attack: several targets for one roll. */
  area: number[] | null;
  setArea: (ids: number[] | null) => void;
  mode: RollMode;
  setMode: (m: RollMode) => void;
};
const TargetCtx = createContext<TargetState>({
  target: null,
  setTarget: () => {},
  area: null,
  setArea: () => {},
  mode: 'auto',
  setMode: () => {},
});

/**
 * Advantage/Disadvantage for an attack: from the crawler's status effects (an Advantage earned against this Mob,
 * or a general one). Both at once cancel out (Core Rulebook "Advantage & Disadvantage").
 */
function autoMode(effects: Effect[], targets: number[]): { mode: 'normal' | 'adv' | 'dis'; why: string[] } {
  const adv = effects.filter(
    (e) => e.kind === 'advantage' && (e.vsOpponent === undefined || targets.includes(e.vsOpponent)),
  );
  const dis = effects.filter((e) => e.kind === 'disadvantage');
  const why = [...adv, ...dis].map((e) => e.name);
  if (adv.length && dis.length) return { mode: 'normal', why };
  return { mode: adv.length ? 'adv' : dis.length ? 'dis' : 'normal', why };
}
/** "d20+5" → "2d20kh1+5" (Advantage) / "2d20kl1+5" (Disadvantage). */
export const withMode = (expr: string, mode: 'normal' | 'adv' | 'dis') =>
  mode === 'normal' ? expr : expr.replace(/^1?d20/i, mode === 'adv' ? '2d20kh1' : '2d20kl1');

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
  const [area, setArea] = useState<number[] | null>(null);
  const [mode, setMode] = useState<RollMode>('auto');
  return (
    <TargetCtx.Provider value={{ target, setTarget, area, setArea, mode, setMode }}>{children}</TargetCtx.Provider>
  );
}

/** The targets and roll mode an attack button would use right now. */
function useAim() {
  const fight = useFight();
  const { data } = useSheet();
  const { target, area, mode } = useContext(TargetCtx);
  if (!fight) return null;
  const ids = area ? area.filter((id) => fight.targets.some((o) => o.id === id)) : target !== null ? [target] : [];
  const opps = fight.targets.filter((o) => ids.includes(o.id));
  const auto = autoMode(data.effects, ids);
  return { fight, opps, ids, mode: mode === 'auto' ? auto.mode : mode, auto };
}

/** Above the pinned attacks during combat: pick a target, see Actions left and this round's attacks. */
export function CombatTargetBar() {
  const { t } = useI18n();
  const fight = useFight();
  const aim = useAim();
  const { target, setTarget, area, setArea, mode, setMode } = useContext(TargetCtx);
  if (!fight || !aim) return null;
  const { enc, charId, targets } = fight;
  const current = area ? (aim.opps[0] ?? null) : (targets.find((o) => o.id === target) ?? null);
  const acts = enc.actions?.[charId] ?? { used: [], extra: false, max: 2 };
  const left = Math.max(0, acts.max - acts.used.length);
  const attackStep = enc.round === 0 || enc.phase === 4;
  const mine = (enc.attacks ?? []).filter((a) => a.characterId === charId);
  return (
    <div className="target-bar">
      <div className="target-row">
        <label className="gm-check">
          🎯 {t('atkt.target')}
          {!area && (
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
          )}
        </label>
        <label className="gm-check" title={t('atkt.areaHint')}>
          <input
            type="checkbox"
            checked={!!area}
            onChange={(e) => setArea(e.target.checked ? (target !== null ? [target] : []) : null)}
          />
          {t('atkt.area')}
        </label>
        <label className="gm-check" title={t('atkt.modeHint')}>
          <select className="in sel" value={mode} onChange={(e) => setMode(e.target.value as RollMode)}>
            <option value="auto">{t('atkt.mode.auto', { m: t(`atkt.mode.${aim.auto.mode}` as MsgKey) })}</option>
            <option value="normal">{t('atkt.mode.normal')}</option>
            <option value="adv">{t('atkt.mode.adv')}</option>
            <option value="dis">{t('atkt.mode.dis')}</option>
          </select>
        </label>
        <span className={`dim tiny ${left === 0 ? 'bad-pill' : ''}`}>{t('actions.left', { n: left })}</span>
      </div>
      {area && (
        <div className="area-picks">
          {targets.map((o) => (
            <label key={o.id} className="gm-check">
              <input
                type="checkbox"
                checked={area.includes(o.id)}
                onChange={(e) => setArea(e.target.checked ? [...area, o.id] : area.filter((x) => x !== o.id))}
              />
              {o.name}
            </label>
          ))}
        </div>
      )}
      {mode === 'auto' && aim.auto.why.length > 0 && (
        <p className="dim tiny">
          {aim.auto.mode === 'adv' ? '▲' : aim.auto.mode === 'dis' ? '▼' : '='} {aim.auto.why.join(', ')}
        </p>
      )}
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
      <DegreeBadge degree={a.degree} />
      {a.hit !== false &&
        (a.damage ? (
          <span>
            🎲 <strong>{a.damage.total}</strong>
            {a.damage.crit && <span className="degree deg-crit">{t('deg.critDice')}</span>}
            {!!a.damage.amazing && <span className="degree deg-amazing">+{a.damage.amazing}</span>}
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
  manaCost = null,
  spell = false,
  className,
}: {
  expr: string;
  text: string;
  label: string;
  /** Attack name for the log ("Long Sword → Bad Llama 2"). */
  name: string;
  damage: string | null;
  /** Attack spells: their Mana cost is spent when cast at a target. */
  manaCost?: number | null;
  /** Spells never use Ammunition. */
  spell?: boolean;
  className?: string;
}) {
  const { t, err } = useI18n();
  const { data, update, playLocked } = useSheet();
  const aim = useAim();
  const [flash, setFlash] = useState<string | null>(null);
  const [ammoPick, setAmmoPick] = useState('');
  // a ranged weapon (held, tied to this attack) fires one Ammunition from the Hotlist
  const weapon = spell ? null : weaponFor(data.inventory, name);
  const ammoList = weapon?.ranged ? ammoFor(data.inventory, data.hotSlots, weapon) : [];
  const ammo = weapon?.ranged ? (ammoList.find((a) => a.id === ammoPick) ?? ammoList[0] ?? null) : null;
  const noAmmo = !!weapon?.ranged && !ammo;
  const say = (msg: string) => {
    setFlash(msg);
    setTimeout(() => setFlash(null), 2500);
  };
  const picker =
    ammoList.length > 1 ? (
      <select
        className="in sel tiny-sel ammo-pick"
        value={ammo?.id ?? ''}
        aria-label={t('ammo.pick')}
        onChange={(e) => setAmmoPick(e.target.value)}
      >
        {ammoList.map((a) => (
          <option key={a.id} value={a.id}>
            {a.item} ×{Number(a.qty) || 0}
          </option>
        ))}
      </select>
    ) : ammo ? (
      <span className="dim tiny">
        {ammo.item} ×{Number(ammo.qty) || 0}
      </span>
    ) : noAmmo ? (
      <span className="tiny error">{t('ammo.none')}</span>
    ) : null;
  if (!aim || !aim.opps.length) {
    // a plain roll: the shot still uses up one Ammunition
    const beforeRoll = () => {
      if (!weapon?.ranged) return true;
      if (!ammo || playLocked) {
        if (!ammo) say(t('ammo.none'));
        return !!ammo;
      }
      update((d) => {
        const r = spendOne(d.inventory, d.hotSlots, ammo.id);
        return r ? { ...d, inventory: r.inventory, hotSlots: r.hotSlots } : d;
      });
      return true;
    };
    return (
      <>
        <RollButton
          expr={expr}
          text={flash ?? text}
          label={label}
          className={className}
          beforeRoll={weapon?.ranged ? beforeRoll : undefined}
        />
        {picker}
      </>
    );
  }
  const { fight, opps, mode } = aim;
  const attack = async () => {
    // in combat a Spell is cast from the Hotlist (Heal is always available)
    if (spell && !isHealSpell(name) && !data.hotSlots.includes(spellRef(name))) return say(t('spell.notOnHotlist'));
    if (manaCost && !spendMana(data, manaCost)) return say(t('mana.notEnough'));
    if (noAmmo) return say(t('ammo.none'));
    try {
      const enc = await api.crawlerAttack({
        characterId: fight.charId,
        ...(opps.length > 1 ? { opponentIds: opps.map((o) => o.id) } : { opponentId: opps[0].id }),
        expr: withMode(expr, mode),
        damage,
        label: name,
        ...(ammo ? { ammoItemId: ammo.id } : {}),
      });
      fight.live.setEncounter(enc);
      if (manaCost) update((d) => spendMana(d, manaCost) ?? d, undefined, { mana: t('src.cast', { name }) });
      const mine = enc.attacks.filter((a) => a.characterId === fight.charId);
      const last = mine[mine.length - 1];
      setFlash(last ? `${last.hit ? '✓' : last.hit === false ? '✗' : '?'} ${last.total}` : null);
    } catch (e) {
      setFlash(err(e));
    }
    setTimeout(() => setFlash(null), 2500);
  };
  const names = opps.map((o: Opponent) => o.name).join(', ');
  return (
    <>
      <button
        type="button"
        className={`roll-total roll-btn target-roll ${flash ? 'rolled' : ''} ${className ?? ''}`}
        onClick={attack}
        title={[
          t('atkt.attackHint', { name: names }),
          mode !== 'normal' && t(`atkt.mode.${mode}` as MsgKey),
          manaCost && t('skill.sumMana', { n: manaCost }),
        ]
          .filter(Boolean)
          .join(' · ')}
      >
        {flash ?? `${opps.length > 1 ? '💥' : '🎯'} ${mode === 'adv' ? '▲ ' : mode === 'dis' ? '▼ ' : ''}${text}`}
      </button>
      {picker}
    </>
  );
}

/**
 * Actions for things done from the sheet during combat (e.g. Cast Heal, an Interrupt in Crawler Reaction or an
 * Action in step 4). `spend` returns false (with the error to show) when there's no Action left.
 */
export function useCombatAction() {
  const fight = useFight();
  const { err } = useI18n();
  if (!fight) return { inCombat: false, left: Infinity, spend: async () => ({ ok: true, error: '' }) };
  const { enc, charId, live } = fight;
  const acts = enc.actions?.[charId] ?? { used: [], extra: false, max: 2 };
  const left = Math.max(0, acts.max - acts.used.length);
  const spend = async (kind: 'heal' | 'interrupt' | 'action') => {
    try {
      live.setEncounter(await api.crawlerAction(charId, 'use', { kind }));
      return { ok: true, error: '' };
    } catch (e) {
      return { ok: false, error: err(e) };
    }
  };
  return { inCombat: true, left, spend };
}
