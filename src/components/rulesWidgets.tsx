import { useState, type CSSProperties } from 'react';
import { useField, useSheet, type Path } from './fields';
import { useI18n, type MsgKey } from '../lib/i18n';
import {
  DEBUFFS,
  HB_SLOTS,
  HEAL_MANA_COST,
  MAX_SKILL_RANK,
  addDebuff,
  applyHbLoss,
  castHeal,
  clamp,
  debuffDef,
  effectiveDamage,
  learnUntrained,
  num,
  removeDebuff,
  rest,
  rollAdvancement,
  slotsLost,
  spendMana,
  type AdvanceMode,
  type AdvanceResult,
  type RestKind,
} from '../lib/rules';
import { signed, type StatSel } from '../lib/sheet';

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

/* ---------------- auto value with optional manual override ---------------- */

/**
 * Shows a value calculated from the rules. The stored field is a manual override:
 * empty = automatic. Players can override (✎) and go back to automatic (↺).
 */
export function AutoNumber({
  path,
  auto,
  label,
  ariaLabel,
  format = (n) => String(n),
  big,
  className = '',
}: {
  path: Path;
  auto: number | null;
  label?: string;
  ariaLabel?: string;
  format?: (n: number) => string;
  big?: boolean;
  className?: string;
}) {
  const [value, setValue, locked] = useField<string>(path);
  const { t } = useI18n();
  const [editing, setEditing] = useState(false);
  const manual = (value ?? '').trim() !== '';
  const body =
    manual || editing ? (
      <div className="auto-wrap">
        <input
          className={`in center ${big ? 'big' : ''}`}
          value={value}
          autoFocus={editing && !manual}
          readOnly={locked}
          placeholder={auto === null ? '' : format(auto)}
          aria-label={label ?? ariaLabel}
          onChange={(e) => setValue(e.target.value)}
          onBlur={() => setEditing(false)}
        />
        {manual && !locked && (
          <button
            type="button"
            className="auto-btn"
            title={t('auto.reset')}
            aria-label={t('auto.reset')}
            onClick={() => setValue('')}
          >
            ↺
          </button>
        )}
      </div>
    ) : (
      <div className="auto-wrap">
        <output className={`auto-val ${big ? 'big' : ''}`} aria-label={label ?? ariaLabel} title={t('auto.hint')}>
          {auto === null ? '—' : format(auto)}
        </output>
        {!locked && (
          <button
            type="button"
            className="auto-btn"
            title={t('auto.override')}
            aria-label={t('auto.override')}
            onClick={() => setEditing(true)}
          >
            ✎
          </button>
        )}
      </div>
    );
  if (!label) return <div className={className}>{body}</div>;
  return (
    <div className={`field ${className}`}>
      <span className="lbl">
        {label}
        {manual && <span className="manual-tag">{t('auto.manual')}</span>}
      </span>
      {body}
    </div>
  );
}

/* ---------------- stat selector for skills / attacks ---------------- */

const STAT_OPTS: { v: StatSel; k: MsgKey }[] = [
  { v: 'str', k: 'stat.str.short' },
  { v: 'int', k: 'stat.int.short' },
  { v: 'con', k: 'stat.con.short' },
  { v: 'dex', k: 'stat.dex.short' },
  { v: 'cha', k: 'stat.cha.short' },
  { v: 'none', k: 'stat.none' },
];

/** Stat dropdown plus the resulting mod. With no stat chosen, the old free-text value stays editable. */
export function StatMod({ statPath, legacyPath, label }: { statPath: Path; legacyPath: Path; label: string }) {
  const { t } = useI18n();
  const { der } = useSheet();
  const [stat, setStat, locked] = useField<StatSel>(statPath);
  const [legacy, setLegacy] = useField<string>(legacyPath);
  const mod = stat === 'none' ? 0 : stat ? der.mods[stat] : null;
  return (
    <div className="statmod">
      <select
        className="in sel"
        value={stat}
        disabled={locked}
        aria-label={label}
        onChange={(e) => setStat(e.target.value as StatSel)}
      >
        <option value="" title={t('stat.pickHint')}>
          {t('stat.pick')}
        </option>
        {STAT_OPTS.map((o) => (
          <option key={o.v} value={o.v}>
            {t(o.k)}
          </option>
        ))}
      </select>
      {stat ? (
        <output className="mod-val">{stat === 'none' ? '—' : signed(mod)}</output>
      ) : (
        <input
          className="in center mod-legacy"
          value={legacy}
          readOnly={locked}
          placeholder={locked ? '' : t('atk.phMod')}
          aria-label={label}
          onChange={(e) => setLegacy(e.target.value)}
        />
      )}
    </div>
  );
}

/** Numeric mod for a stat selection, falling back to the legacy text. */
export function useStatMod(stat: StatSel, legacy: string): number | null {
  const { der } = useSheet();
  if (stat === 'none') return 0;
  if (stat) return der.mods[stat];
  return num(legacy);
}

/* ---------------- health bar ---------------- */

/**
 * Ten slots, each worth `slotValue` (the Con Mod). Slots are lost from 100% down to 10% (right to left).
 * Clicking a slot marks it and everything to its right as lost; clicking the last lost slot restores it.
 */
export function HealthBar({
  lostPath,
  slotValue,
  rows = 1,
}: {
  lostPath: Path;
  slotValue: number | null;
  rows?: 1 | 2;
}) {
  const [lost, setLost, locked] = useField<number>(lostPath);
  const { t } = useI18n();
  const l = clamp(lost, 0, HB_SLOTS);
  const firstLost = HB_SLOTS - l; // index of the leftmost lost slot
  return (
    <div className={`health rows-${rows}`} role="group" aria-label={t('core.health')}>
      {Array.from({ length: HB_SLOTS }, (_, i) => {
        const isLost = i >= firstLost;
        return (
          <button
            type="button"
            key={i}
            disabled={locked}
            className={`hslot ${isLost ? 'lost' : ''}`}
            style={{ '--c': HEALTH_COLORS[i] } as CSSProperties}
            title={t(isLost ? 'health.restore' : 'health.mark')}
            aria-pressed={isLost}
            onClick={() => setLost(isLost && i === firstLost ? l - 1 : HB_SLOTS - i)}
          >
            <span className="hval">{slotValue ?? '—'}</span>
            <span className="hpct">{(i + 1) * 10}%</span>
          </button>
        );
      })}
    </div>
  );
}

/* ---------------- damage, healing, rests, dying ---------------- */

export function HealthTools() {
  // stays usable on locked sheets (health, damage and rests are play values)
  const { data, der, update, set, playLocked: locked } = useSheet();
  const { t } = useI18n();
  const [amount, setAmount] = useState('');
  const [flags, setFlags] = useState({ resistant: false, vulnerable: false, immune: false, bypassDr: false });
  const slot = der.slotValue;
  const dmg = num(amount);
  const eff = dmg === null ? null : effectiveDamage({ amount: dmg, dr: der.drTotal ?? 0, ...flags });
  const lose = eff === null || !slot ? 0 : slotsLost(eff, slot, HB_SLOTS - der.hbLost);

  const doRest = (kind: RestKind) =>
    update((d) => rest(d, kind), t('undo.rest', { kind: t(`rest.${kind}` as MsgKey) }));

  return (
    <div className="hb-tools">
      <div className="hb-summary">
        <span className="hb-pct" data-low={der.hbPercent <= 30 || undefined}>
          {der.hbPercent}%
        </span>
        <span className="dim small">
          {t('health.summary', {
            slot: slot ?? '—',
            dr: der.drTotal ?? 0,
            total: slot === null ? '—' : slot * HB_SLOTS,
          })}
        </span>
      </div>

      {der.dying && (
        <div className="dying">
          <strong>{t('health.dying')}</strong>
          <span>{t('health.roundsLeft')}</span>
          <input
            className="in center dying-in"
            value={data.dyingRounds}
            readOnly={locked}
            inputMode="numeric"
            aria-label={t('health.roundsLeft')}
            onChange={(e) => set(['dyingRounds'], e.target.value)}
          />
          {!locked && (
            <button
              type="button"
              className="btn small"
              onClick={() => set(['dyingRounds'], String(Math.max(0, (num(data.dyingRounds) ?? 0) - 1)))}
            >
              −1
            </button>
          )}
          <span className="dim tiny">{t('health.dyingHint')}</span>
        </div>
      )}

      {!locked && (
        <>
          <div className="dmg-row">
            <label className="field dmg-amt">
              <span className="lbl">{t('health.damage')}</span>
              <input
                className="in center"
                inputMode="numeric"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </label>
            <div className="dmg-flags">
              {(['bypassDr', 'resistant', 'vulnerable', 'immune'] as const).map((f) => (
                <label key={f} className="chip-check">
                  <input
                    type="checkbox"
                    checked={flags[f]}
                    onChange={(e) => setFlags({ ...flags, [f]: e.target.checked })}
                  />
                  <span>{t(`dmg.${f}` as MsgKey)}</span>
                </label>
              ))}
            </div>
            <div className="dmg-apply">
              <span className="dim small">
                {eff === null ? t('dmg.hint') : t('dmg.preview', { dmg: eff, slots: lose })}
              </span>
              <button
                type="button"
                className="btn small primary"
                disabled={eff === null || !slot}
                onClick={() => {
                  update((d) => applyHbLoss(d, lose, der.mods.con), t('undo.damage', { slots: lose }));
                  setAmount('');
                }}
              >
                {t('dmg.apply')}
              </button>
            </div>
          </div>
          <div className="rest-row">
            <span className="lbl">{t('rest.title')}</span>
            {(['mend', 'short', 'long', 'fullDay'] as RestKind[]).map((k) => (
              <button
                key={k}
                type="button"
                className="btn small ghost"
                title={t(`rest.${k}.hint` as MsgKey)}
                onClick={() => doRest(k)}
              >
                {t(`rest.${k}` as MsgKey)}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ---------------- mana ---------------- */

export function ManaTools() {
  const { der, update, playLocked: locked } = useSheet();
  const { t } = useI18n();
  const [cost, setCost] = useState('');
  const [msg, setMsg] = useState('');
  if (locked) return null;
  const fail = () => setMsg(t('mana.notEnough'));
  return (
    <div className="mana-tools">
      <button
        type="button"
        className="btn small"
        disabled={der.hbLost === 0}
        title={t('mana.healHint')}
        onClick={() => {
          setMsg('');
          let ok = true;
          update((d) => {
            const r = castHeal(d);
            if (!r) ok = false;
            return r ?? d;
          }, t('undo.heal'));
          if (!ok) fail();
        }}
      >
        {t('mana.castHeal', { n: HEAL_MANA_COST })}
      </button>
      <div className="spend">
        <input
          className="in center"
          inputMode="numeric"
          value={cost}
          placeholder={t('mana.cost')}
          aria-label={t('mana.cost')}
          onChange={(e) => setCost(e.target.value)}
        />
        <button
          type="button"
          className="btn small ghost"
          disabled={!num(cost)}
          onClick={() => {
            setMsg('');
            const c = num(cost) ?? 0;
            let ok = true;
            update(
              (d) => {
                const r = spendMana(d, c);
                if (!r) ok = false;
                return r ?? d;
              },
              t('undo.spend', { n: c }),
            );
            if (ok) setCost('');
            else fail();
          }}
        >
          {t('mana.spend')}
        </button>
      </div>
      {msg && <span className="error small">{msg}</span>}
    </div>
  );
}

/* ---------------- debuffs ---------------- */

export function DebuffPanel() {
  const { data, der, update, set, playLocked: locked } = useSheet();
  const { t } = useI18n();
  const [pick, setPick] = useState('');
  const sorted = [...DEBUFFS].sort((a, b) =>
    t(`debuff.${a.id}` as MsgKey).localeCompare(t(`debuff.${b.id}` as MsgKey)),
  );
  return (
    <div className="debuffs">
      <div className="lbl">
        {t('core.debuffs')}
        {der.penalty !== 0 && <span className="penalty-tag">{t('debuff.penalty', { n: der.penalty })}</span>}
      </div>
      {data.debuffList.length > 0 && (
        <ul className="debuff-list">
          {data.debuffList.map((d) => {
            const def = debuffDef(d.id);
            return (
              <li key={d.id} className="debuff">
                <div className="debuff-head">
                  <strong>{def ? t(`debuff.${d.id}` as MsgKey) : d.id}</strong>
                  {d.stacks > 1 && <span className="pill">×{d.stacks}</span>}
                  {!locked && (
                    <button
                      type="button"
                      className="row-del"
                      aria-label={t('debuff.remove')}
                      title={t('debuff.remove')}
                      onClick={() => update((x) => ({ ...x, debuffList: removeDebuff(x.debuffList, d.id) }))}
                    >
                      ×
                    </button>
                  )}
                </div>
                {def && (
                  <div className="dim tiny">
                    {t(`debuff.${d.id}.effect` as MsgKey)} · <em>{t(`debuff.${d.id}.duration` as MsgKey)}</em>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
      {!locked && (
        <div className="debuff-add">
          <select
            className="in sel"
            value={pick}
            aria-label={t('debuff.add')}
            onChange={(e) => setPick(e.target.value)}
          >
            <option value="">{t('debuff.choose')}</option>
            {sorted.map((d) => (
              <option key={d.id} value={d.id}>
                {t(`debuff.${d.id}` as MsgKey)}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="btn small"
            disabled={!pick}
            onClick={() => {
              update((x) => ({ ...x, debuffList: addDebuff(x.debuffList, pick) }));
              setPick('');
            }}
          >
            {t('debuff.add')}
          </button>
        </div>
      )}
      <textarea
        className="in area debuff-notes"
        rows={1}
        value={data.debuffs}
        readOnly={locked}
        placeholder={locked ? '' : t('debuff.notes')}
        aria-label={t('debuff.notes')}
        onChange={(e) => set(['debuffs'], e.target.value)}
      />
    </div>
  );
}

/* ---------------- skill advancement ---------------- */

export function AdvancementPanel() {
  const { data, update, locked } = useSheet();
  const { t } = useI18n();
  const [results, setResults] = useState<AdvanceResult[] | null>(null);
  const [learn, setLearn] = useState('');
  const marked = data.skills.filter((s) => s.done && s.name.trim()).length;

  const run = (mode: AdvanceMode) => {
    let res: AdvanceResult[] = [];
    update((d) => {
      const r = rollAdvancement(d, mode);
      res = r.results;
      return r.data;
    }, t('undo.advance'));
    setResults(res);
  };

  const untrained = data.untrained.filter((s) => s.trim());

  return (
    <div className="advance">
      <div className="advance-bar">
        <div>
          <strong>{t('adv.title')}</strong>
          <div className="dim small">{t('adv.marked', { n: marked, max: MAX_SKILL_RANK })}</div>
        </div>
        {!locked && (
          <div className="advance-actions">
            <button
              type="button"
              className="btn small"
              disabled={!marked}
              onClick={() => run('session')}
              title={t('adv.sessionHint')}
            >
              {t('adv.session')}
            </button>
            <button
              type="button"
              className="btn small ghost"
              disabled={!marked}
              onClick={() => run('floor')}
              title={t('adv.floorHint')}
            >
              {t('adv.floor')}
            </button>
          </div>
        )}
      </div>
      {results && (
        <div className="adv-results">
          {results.length === 0 ? (
            <span className="dim small">{t('adv.none')}</span>
          ) : (
            <ul>
              {results.map((r) => (
                <li key={r.index} className={r.gained ? 'ok' : 'dim'}>
                  {t(r.gained ? 'adv.gained' : 'adv.failed', {
                    name: r.name,
                    roll: r.roll,
                    rank: r.from,
                    next: r.from + 1,
                  })}
                </li>
              ))}
            </ul>
          )}
          <button type="button" className="link-btn small" onClick={() => setResults(null)}>
            {t('common.close')}
          </button>
        </div>
      )}

      <div className="untrained">
        <div className="lbl">{t('adv.untrained')}</div>
        <div className="dim tiny">{t('adv.untrainedHint')}</div>
        <UntrainedList />
        {!locked && untrained.length > 0 && (
          <div className="debuff-add">
            <select
              className="in sel"
              value={learn}
              aria-label={t('adv.learn')}
              onChange={(e) => setLearn(e.target.value)}
            >
              <option value="">{t('adv.pickOne')}</option>
              {untrained.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="btn small"
              disabled={!learn}
              onClick={() => {
                update((d) => learnUntrained(d, learn), t('undo.learn', { name: learn }));
                setLearn('');
              }}
            >
              {t('adv.learn')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function UntrainedList() {
  const [items, setItems, locked] = useField<string[]>(['untrained']);
  const { t } = useI18n();
  const [draft, setDraft] = useState('');
  return (
    <div className="untrained-list">
      {items.map((s, i) => (
        <span key={i} className="pill tag">
          {s}
          {!locked && (
            <button
              type="button"
              aria-label={t('list.remove')}
              onClick={() => setItems(items.filter((_, j) => j !== i))}
            >
              ×
            </button>
          )}
        </span>
      ))}
      {!locked && (
        <form
          className="untrained-add"
          onSubmit={(e) => {
            e.preventDefault();
            if (draft.trim()) setItems([...items, draft.trim()]);
            setDraft('');
          }}
        >
          <input
            className="in"
            value={draft}
            placeholder={t('adv.addUntrained')}
            aria-label={t('adv.addUntrained')}
            onChange={(e) => setDraft(e.target.value)}
          />
        </form>
      )}
    </div>
  );
}

/** Small rank badge: warns above the Rank cap and flags the Rank 5 upgrade. */
export function RankBadge({ rank }: { rank: string }) {
  const { t } = useI18n();
  const r = num(rank);
  if (r === null) return null;
  if (r > MAX_SKILL_RANK)
    return (
      <span className="rank-badge warn" title={t('skills.overCap', { max: MAX_SKILL_RANK })}>
        !
      </span>
    );
  if (r >= 5)
    return (
      <span className="rank-badge" title={t('skills.upgrade5')}>
        R5
      </span>
    );
  return null;
}
