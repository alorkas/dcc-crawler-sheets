import { useState, type ReactNode } from 'react';
import {
  DURATIONS,
  EFFECT_KINDS,
  newEffectId,
  type Degree,
  type Duration,
  type Effect,
  type EffectKind,
} from '../../shared/combat.js';
import type { Link } from '../lib/api';
import { useI18n, type MsgKey } from '../lib/i18n';
import { useLiveOptional } from '../lib/live';
import { debuffDef } from '../lib/rules';
import type { ActiveDebuff } from '../lib/sheet';
import { useSheet } from './fields';

type T = ReturnType<typeof useI18n>['t'];

/** "3 rounds left" / "until the end of combat" / "until a rest". */
export const durationText = (t: T, duration: Duration, rounds: number) =>
  duration === 'rounds'
    ? t('fx.roundsLeft', { n: rounds })
    : duration === 'manual'
      ? ''
      : t(`fx.dur.${duration}` as MsgKey);

/**
 * A status chip: hover shows its description, tap (or click) opens it for touch screens.
 * `tone` colours it: buff, debuff, advantage, disadvantage, link.
 */
export function Chip({
  tone,
  label,
  title,
  lines,
  className = '',
}: {
  tone: string;
  label: ReactNode;
  title: string;
  lines: string[];
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const tip = [title, ...lines].filter(Boolean).join('\n');
  return (
    <span className={`chip status-chip fx-${tone} ${className}`}>
      <button
        type="button"
        className="chip-btn"
        title={tip}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        onBlur={() => setOpen(false)}
      >
        {label}
      </button>
      {open && (
        <span className="chip-pop" role="tooltip">
          <strong>{title}</strong>
          {lines.filter(Boolean).map((l, i) => (
            <span key={i}>{l}</span>
          ))}
        </span>
      )}
    </span>
  );
}

export function DebuffChip({ d }: { d: ActiveDebuff }) {
  const { t } = useI18n();
  const known = !!debuffDef(d.id);
  const name = known ? t(`debuff.${d.id}` as MsgKey) : d.id;
  return (
    <Chip
      tone="debuff"
      label={
        <>
          {name}
          {d.stacks > 1 && ` ×${d.stacks}`}
          {!!d.rounds && <span className="chip-rounds">⏱{d.rounds}</span>}
        </>
      }
      title={name}
      lines={[
        known ? t(`debuff.${d.id}.effect` as MsgKey) : '',
        d.rounds
          ? t('fx.roundsLeft', { n: d.rounds })
          : known
            ? t('fx.durationIs', { d: t(`debuff.${d.id}.duration` as MsgKey) })
            : '',
        d.note,
      ]}
    />
  );
}

export function EffectChip({ e }: { e: Effect }) {
  const { t } = useI18n();
  const icon = e.kind === 'advantage' ? '▲ ' : e.kind === 'disadvantage' ? '▼ ' : '';
  return (
    <Chip
      tone={e.kind}
      label={
        <>
          {icon}
          {e.name || t(`fx.kind.${e.kind}` as MsgKey)}
          {e.duration === 'rounds' && <span className="chip-rounds">⏱{e.rounds}</span>}
        </>
      }
      title={`${t(`fx.kind.${e.kind}` as MsgKey)}: ${e.name}`}
      lines={[e.effect, durationText(t, e.duration, e.rounds), e.source ? t('fx.from', { s: e.source }) : '']}
    />
  );
}

/** Text of a link from one side's point of view: "Grabbed by: Bad Llama 2". */
export function linkText(t: T, l: Link, mine: 'a' | 'b') {
  const other = mine === 'a' ? l.b : l.a;
  if (l.kind === 'custom') return `${l.label || t('link.custom')}${mine === 'b' ? ' ←' : ' →'} ${other.name}`;
  return t(`link.${l.kind}.${mine}` as MsgKey, { name: other.name });
}

/** Links involving one participant (a crawler or an opponent). */
export function LinkChips({ type, id }: { type: 'crawler' | 'opponent'; id: number }) {
  const { t } = useI18n();
  const live = useLiveOptional();
  const links = (live?.encounter?.active ? live.encounter.links : []) ?? [];
  const mine = links.flatMap<{ l: Link; side: 'a' | 'b' }>((l) =>
    l.a.type === type && l.a.id === id
      ? [{ l, side: 'a' as const }]
      : l.b.type === type && l.b.id === id
        ? [{ l, side: 'b' as const }]
        : [],
  );
  if (!mine.length) return null;
  return (
    <>
      {mine.map(({ l, side }) => (
        <Chip
          key={l.id}
          tone={`link link-${l.kind}`}
          label={`⛓ ${linkText(t, l, side)}`}
          title={linkText(t, l, side)}
          lines={[t(`link.hint.${l.kind}` as MsgKey)]}
        />
      ))}
    </>
  );
}

/** Every status of a crawler: debuffs, buffs, Advantage/Disadvantage and links. */
export function StatusChips({
  debuffs,
  effects,
  memberId,
  extra,
}: {
  debuffs: ActiveDebuff[];
  effects: Effect[];
  memberId?: number;
  extra?: ReactNode;
}) {
  return (
    <div className="member-chips">
      {extra}
      {effects.map((e) => (
        <EffectChip key={e.id} e={e} />
      ))}
      {debuffs.map((d) => (
        <DebuffChip key={d.id} d={d} />
      ))}
      {memberId !== undefined && <LinkChips type="crawler" id={memberId} />}
    </div>
  );
}

/* ---------------- the sheet's status effects ---------------- */
const blank = (): Effect => ({
  id: newEffectId(),
  kind: 'buff',
  name: '',
  effect: '',
  duration: 'rounds',
  rounds: 1,
});

/** Buffs, debuffs and Advantage/Disadvantage with a duration (playable on locked sheets). */
export function EffectsPanel() {
  const { t } = useI18n();
  const { data, update, playLocked } = useSheet();
  const [draft, setDraft] = useState<Effect>(blank);
  const setList = (fn: (l: Effect[]) => Effect[]) => update((d) => ({ ...d, effects: fn(d.effects) }));
  const patch = (id: string, p: Partial<Effect>) => setList((l) => l.map((e) => (e.id === id ? { ...e, ...p } : e)));
  const add = () => {
    if (!draft.name.trim()) return;
    setList((l) => [...l, { ...draft, name: draft.name.trim(), id: newEffectId() }]);
    setDraft(blank());
  };
  return (
    <div className="effects">
      <div className="lbl">{t('fx.title')}</div>
      {data.effects.length > 0 && (
        <ul className="effect-list">
          {data.effects.map((e) => (
            <li key={e.id} className={`effect fx-${e.kind}`}>
              <div className="effect-head">
                <span className={`pill tiny-pill fx-pill fx-${e.kind}`}>{t(`fx.kind.${e.kind}` as MsgKey)}</span>
                <strong className="grow">{e.name}</strong>
                {e.duration === 'rounds' ? (
                  <label className="rounds-in" title={t('fx.roundsHint')}>
                    ⏱
                    <input
                      className="in center"
                      inputMode="numeric"
                      value={e.rounds}
                      readOnly={playLocked}
                      aria-label={t('fx.rounds')}
                      onChange={(ev) => patch(e.id, { rounds: Math.max(0, parseInt(ev.target.value, 10) || 0) })}
                    />
                  </label>
                ) : (
                  <span className="dim tiny">{durationText(t, e.duration, e.rounds)}</span>
                )}
                {!playLocked && (
                  <button
                    type="button"
                    className="row-del"
                    title={t('fx.remove')}
                    aria-label={t('fx.remove')}
                    onClick={() => setList((l) => l.filter((x) => x.id !== e.id))}
                  >
                    ×
                  </button>
                )}
              </div>
              {(e.effect || e.source) && (
                <div className="dim tiny">
                  {e.effect}
                  {e.effect && e.source && ' · '}
                  {e.source && t('fx.from', { s: e.source })}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
      {!playLocked && (
        <div className="effect-add">
          <select
            className="in sel"
            value={draft.kind}
            aria-label={t('fx.kind')}
            onChange={(e) => setDraft({ ...draft, kind: e.target.value as EffectKind })}
          >
            {EFFECT_KINDS.map((k) => (
              <option key={k} value={k}>
                {t(`fx.kind.${k}` as MsgKey)}
              </option>
            ))}
          </select>
          <input
            className="in"
            value={draft.name}
            maxLength={80}
            placeholder={t('fx.name')}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            onKeyDown={(e) => e.key === 'Enter' && add()}
          />
          <input
            className="in"
            value={draft.effect}
            maxLength={300}
            placeholder={t('fx.effect')}
            onChange={(e) => setDraft({ ...draft, effect: e.target.value })}
          />
          <select
            className="in sel"
            value={draft.duration}
            aria-label={t('fx.duration')}
            onChange={(e) => setDraft({ ...draft, duration: e.target.value as Duration })}
          >
            {DURATIONS.map((k) => (
              <option key={k} value={k}>
                {t(`fx.durOpt.${k}` as MsgKey)}
              </option>
            ))}
          </select>
          {draft.duration === 'rounds' && (
            <input
              className="in center rounds"
              inputMode="numeric"
              value={draft.rounds}
              aria-label={t('fx.rounds')}
              onChange={(e) => setDraft({ ...draft, rounds: Math.max(1, parseInt(e.target.value, 10) || 1) })}
            />
          )}
          <button type="button" className="btn small" disabled={!draft.name.trim()} onClick={add}>
            {t('fx.add')}
          </button>
        </div>
      )}
      <p className="dim tiny">{t('fx.hint')}</p>
    </div>
  );
}

/** "Critical Hit", "Amazing Success", "Near Miss"… (plain Success/Fail show nothing extra). */
export function DegreeBadge({ degree }: { degree?: Degree | null }) {
  const { t } = useI18n();
  if (!degree || degree === 'success' || degree === 'fail') return null;
  return <span className={`degree deg-${degree}`}>{t(`deg.${degree}` as MsgKey)}</span>;
}
