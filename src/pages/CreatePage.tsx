import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useI18n, type MsgKey } from '../lib/i18n';
import { lookup } from '../lib/catalog';
import { signed, type StatKey } from '../lib/sheet';
import { statModFromScore } from '../lib/rules';
import {
  ANIMAL_SIZES,
  GEAR_KITS,
  HAND_TO_HAND,
  STANDARD_ARRAY,
  STARTER_SPELLS,
  STARTER_WEAPONS,
  STAT_KEYS,
  buildSheet,
  buildFromPregen,
  pregenSkills,
  type Pregen,
  emptyChoices,
  emptyThird,
  LOOT_ROWS,
  LOOT_SLOTS,
  LOOT_TEXT,
  rollBoosts,
  rollFavor,
  startingSkills,
  THIRD_STAT_POINTS,
  thirdPointsUsed,
  type ThirdFloor,
  namesToLookUp,
  pickedSkills,
  randomCrawlerNumber,
  roll,
  rollStat,
  tablesFor,
  validate,
  type Choices,
  type StepIssue,
} from '../lib/creation';
import type { CatalogHit } from '../lib/api';

const ALL_STEPS = ['basics', 'backgrounds', 'combat', 'stats', 'gear', 'third', 'review'] as const;
type Step = (typeof ALL_STEPS)[number];
/** The "Tutorial Floors" step only for crawlers who start on the Third Floor. */
const stepsFor = (c: Choices): Step[] => ALL_STEPS.filter((s) => s !== 'third' || !!c.third);

const STEP_ISSUES: Record<Step, StepIssue[]> = {
  basics: ['basics'],
  backgrounds: ['backgrounds', 'duplicate'],
  combat: ['combat', 'combatDuplicate'],
  stats: ['stats', 'spellInt'],
  gear: [],
  third: ['third'],
  review: [],
};

export default function CreatePage() {
  const { t, err } = useI18n();
  const navigate = useNavigate();
  const [c, setC] = useState<Choices>(emptyChoices);
  const [step, setStep] = useState<Step>('basics');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [pregens, setPregens] = useState(false);
  const issues = useMemo(() => validate(c), [c]);
  const STEPS = stepsFor(c);
  const stepIndex = STEPS.indexOf(step);
  const blocked = STEP_ISSUES[step].some((i) => issues.includes(i));
  const firstBlocked = STEPS.findIndex((s) => STEP_ISSUES[s].some((i) => issues.includes(i)));

  const patch = (p: Partial<Choices>) => setC((x) => ({ ...x, ...p }));

  async function create() {
    setBusy(true);
    setError('');
    try {
      const names = namesToLookUp(c);
      const hits: Record<string, CatalogHit | null> = {};
      await Promise.all(names.map(async (n) => (hits[n] = await lookup(n).catch(() => null))));
      const data = buildSheet(c, hits);
      const ch = await api.createCharacter(data);
      navigate(`/sheet/${ch.id}`);
    } catch (e) {
      setError(err(e, 'err.createFailed'));
      setBusy(false);
    }
  }

  async function blank() {
    try {
      const ch = await api.createCharacter();
      navigate(`/sheet/${ch.id}`);
    } catch (e) {
      setError(err(e, 'err.createFailed'));
    }
  }

  return (
    <div className="page wizard">
      <div className="page-head">
        <div>
          <h1>{t('wiz.title')}</h1>
          <p className="dim">{t('wiz.sub')}</p>
        </div>
        <div className="page-actions">
          <button type="button" className="btn ghost" onClick={() => setPregens(true)}>
            {t('pregen.button')}
          </button>
          <button type="button" className="btn ghost" onClick={blank}>
            {t('wiz.blank')}
          </button>
          <Link to="/" className="btn ghost">
            {t('wiz.cancel')}
          </Link>
        </div>
      </div>

      <ol className="wiz-steps">
        {STEPS.map((s, i) => (
          <li key={s}>
            <button
              type="button"
              className={`${s === step ? 'active' : ''} ${i < stepIndex ? 'done' : ''}`}
              disabled={firstBlocked !== -1 && i > firstBlocked}
              onClick={() => setStep(s)}
            >
              <span className="wiz-num">{i + 1}</span>
              {t(`wiz.step.${s}` as MsgKey)}
            </button>
          </li>
        ))}
      </ol>

      <div className="card wiz-card">
        <div className="card-body">
          {step === 'basics' && <BasicsStep c={c} patch={patch} />}
          {step === 'backgrounds' && <BackgroundsStep c={c} setC={setC} issues={issues} />}
          {step === 'combat' && <CombatStep c={c} patch={patch} issues={issues} />}
          {step === 'stats' && <StatsStep c={c} patch={patch} issues={issues} />}
          {step === 'gear' && <GearStep c={c} patch={patch} />}
          {step === 'third' && c.third && <ThirdStep c={c} patch={patch} />}
          {step === 'review' && <ReviewStep c={c} />}
        </div>
      </div>

      {error && <p className="error">{error}</p>}
      {pregens && <PregenPicker onClose={() => setPregens(false)} />}
      <div className="wiz-nav">
        <button
          type="button"
          className="btn ghost"
          disabled={stepIndex === 0}
          onClick={() => setStep(STEPS[stepIndex - 1])}
        >
          ← {t('wiz.back')}
        </button>
        {step !== 'review' ? (
          <button
            type="button"
            className="btn primary"
            disabled={blocked}
            onClick={() => {
              if (step === 'combat' && !c.gear.weapon && c.combat?.kind === 'weapon') {
                patch({ gear: { ...c.gear, weapon: c.combat.label || c.combat.skill } });
              }
              setStep(STEPS[stepIndex + 1]);
            }}
          >
            {t('wiz.next')} →
          </button>
        ) : (
          <button type="button" className="btn primary" disabled={busy || issues.length > 0} onClick={create}>
            {busy ? '…' : t('wiz.create')}
          </button>
        )}
      </div>
    </div>
  );
}

/* ---------------- steps ---------------- */

type StepProps = { c: Choices; patch: (p: Partial<Choices>) => void };

function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="field">
      <span className="lbl">{label}</span>
      {children}
      {hint && <span className="dim tiny">{hint}</span>}
    </label>
  );
}

function BasicsStep({ c, patch }: StepProps) {
  const { t } = useI18n();
  return (
    <div className="wiz-grid">
      <Field label={t('core.name')}>
        <input className="in big" value={c.name} autoFocus onChange={(e) => patch({ name: e.target.value })} />
      </Field>
      <Field label={t('core.gender')}>
        <input className="in" value={c.gender} onChange={(e) => patch({ gender: e.target.value })} />
      </Field>
      <Field label={t('core.crawlerNo')} hint={t('wiz.crawlerNoHint')}>
        <div className="row-gap">
          <input
            className="in"
            inputMode="numeric"
            value={c.crawlerNumber}
            onChange={(e) => patch({ crawlerNumber: e.target.value })}
          />
          <button type="button" className="btn small" onClick={() => patch({ crawlerNumber: randomCrawlerNumber() })}>
            {t('wiz.random')}
          </button>
        </div>
      </Field>
      <div className="field span-2">
        <span className="lbl">{t('wiz.whatAreYou')}</span>
        <div className="seg">
          <button
            type="button"
            className={!c.animal ? 'active' : ''}
            onClick={() => patch({ animal: false, backgrounds: {}, combat: null })}
          >
            {t('wiz.human')}
          </button>
          <button
            type="button"
            className={c.animal ? 'active' : ''}
            onClick={() => patch({ animal: true, backgrounds: {}, combat: null })}
          >
            {t('wiz.animal')}
          </button>
        </div>
        <span className="dim small">{t(c.animal ? 'wiz.animalHint' : 'wiz.humanHint')}</span>
      </div>
      {c.animal && (
        <>
          <Field label={t('wiz.species')}>
            <input
              className="in"
              value={c.species}
              placeholder={t('wiz.speciesPh')}
              onChange={(e) => patch({ species: e.target.value })}
            />
          </Field>
          <Field label={t('core.size')}>
            <select className="in sel" value={c.size} onChange={(e) => patch({ size: Number(e.target.value) })}>
              {ANIMAL_SIZES.map((s) => (
                <option key={s.size} value={s.size}>
                  {s.size} · {s.name} ({s.example})
                </option>
              ))}
            </select>
          </Field>
        </>
      )}
      <div className="field span-2">
        <label className="gm-check third-toggle">
          <input
            type="checkbox"
            checked={!!c.third}
            onChange={(e) => patch({ third: e.target.checked ? emptyThird() : null })}
          />
          <strong>{t('wiz.thirdToggle')}</strong>
        </label>
        <span className="dim small">{t('wiz.thirdHint')}</span>
      </div>
    </div>
  );
}

function BackgroundsStep({
  c,
  setC,
  issues,
}: {
  c: Choices;
  setC: (fn: (c: Choices) => Choices) => void;
  issues: StepIssue[];
}) {
  const { t } = useI18n();
  const picked = pickedSkills(c);
  const setBg = (table: string, bg: string) =>
    setC((x) => ({ ...x, backgrounds: { ...x.backgrounds, [table]: { bg, picks: [] } } }));
  const togglePick = (table: string, name: string) =>
    setC((x) => {
      const cur = x.backgrounds[table];
      if (!cur) return x;
      const has = cur.picks.includes(name);
      const picks = has ? cur.picks.filter((p) => p !== name) : cur.picks.length < 2 ? [...cur.picks, name] : cur.picks;
      return { ...x, backgrounds: { ...x.backgrounds, [table]: { ...cur, picks } } };
    });

  return (
    <div className="bg-steps">
      <p className="dim small">{t('wiz.bgIntro')}</p>
      {tablesFor(c).map((tb) => {
        const sel = c.backgrounds[tb.id];
        const bg = tb.backgrounds.find((b) => b.id === sel?.bg);
        return (
          <div key={tb.id} className="bg-block">
            <div className="bg-head">
              <h3>
                {t(`wiz.table.${tb.id}` as MsgKey)} <span className="pill">{t('wiz.rankN', { n: tb.rank })}</span>
              </h3>
              <div className="row-gap">
                <select
                  className="in sel"
                  value={sel?.bg ?? ''}
                  aria-label={t(`wiz.table.${tb.id}` as MsgKey)}
                  onChange={(e) => setBg(tb.id, e.target.value)}
                >
                  <option value="">{t('wiz.chooseBg')}</option>
                  {tb.backgrounds.map((b, i) => (
                    <option key={b.id} value={b.id}>
                      {i + 1}. {b.name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className="btn small"
                  onClick={() => setBg(tb.id, tb.backgrounds[roll(tb.die) - 1].id)}
                >
                  {t('wiz.rollDie', { n: tb.die })}
                </button>
              </div>
            </div>
            {bg && (
              <div className="bg-skills">
                {bg.skills.map((s) => {
                  const on = sel!.picks.includes(s.name);
                  const elsewhere = picked.find((p) => p.name === s.name && p.table !== tb.id);
                  const full = !on && sel!.picks.length >= 2;
                  return (
                    <label key={s.name} className={`chip-check big ${elsewhere ? 'conflict' : ''}`}>
                      <input
                        type="checkbox"
                        checked={on}
                        disabled={full || (!!elsewhere && !on)}
                        onChange={() => togglePick(tb.id, s.name)}
                      />
                      <span>
                        {s.name}{' '}
                        <span className="dim">({s.stat === 'none' ? '—' : t(`stat.${s.stat}.short` as MsgKey)})</span>
                        {elsewhere && (
                          <em className="dim tiny">
                            {' '}
                            · {t('wiz.alreadyFrom', { table: t(`wiz.table.${elsewhere.table}` as MsgKey) })}
                          </em>
                        )}
                      </span>
                    </label>
                  );
                })}
                <span className="dim tiny">{t('wiz.pickTwo', { n: sel!.picks.length })}</span>
              </div>
            )}
          </div>
        );
      })}
      {issues.includes('duplicate') && <p className="error small">{t('wiz.dupWarn')}</p>}
    </div>
  );
}

function CombatStep({ c, patch, issues }: StepProps & { issues: StepIssue[] }) {
  const { t } = useI18n();
  const kind = c.combat?.kind ?? null;
  const [custom, setCustom] = useState(
    c.combat?.kind === 'weapon' && c.combat.label !== c.combat.skill ? c.combat.label.replace(/\s*\([^)]*\)$/, '') : '',
  );
  const setWeapon = (skill: string, customName = custom) =>
    patch({ combat: { kind: 'weapon', skill, label: customName.trim() ? `${customName.trim()} (${skill})` : skill } });
  const preview = c.combat?.skill ?? '';

  return (
    <div className="combat-step">
      <p className="dim small">{t(c.animal ? 'wiz.combatIntroAnimal' : 'wiz.combatIntro')}</p>
      <div className="seg three">
        <button type="button" className={kind === 'weapon' ? 'active' : ''} onClick={() => setWeapon('Club')}>
          {t('wiz.cWeapon')}
        </button>
        <button
          type="button"
          className={kind === 'spell' ? 'active' : ''}
          onClick={() => patch({ combat: { kind: 'spell', skill: STARTER_SPELLS[0] } })}
        >
          {t('wiz.cSpell')}
        </button>
        <button
          type="button"
          className={kind === 'hand' ? 'active' : ''}
          onClick={() =>
            patch({ combat: { kind: 'hand', ...{ skill: HAND_TO_HAND[0].skill, effect: HAND_TO_HAND[0].effect } } })
          }
        >
          {t('wiz.cHand')}
        </button>
      </div>

      {c.combat?.kind === 'weapon' && (
        <div className="wiz-grid">
          <Field label={t('wiz.weapon')}>
            <select className="in sel" value={c.combat.skill} onChange={(e) => setWeapon(e.target.value)}>
              {STARTER_WEAPONS.map((g) => (
                <optgroup key={g.group} label={t(`skillsub.combat.${g.group}` as MsgKey)}>
                  {g.names.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </Field>
          <Field label={t('wiz.customWeapon')} hint={t('wiz.customWeaponHint')}>
            <input
              className="in"
              value={custom}
              placeholder={t('wiz.customWeaponPh')}
              onChange={(e) => {
                setCustom(e.target.value);
                setWeapon(c.combat!.skill, e.target.value);
              }}
            />
          </Field>
        </div>
      )}
      {c.combat?.kind === 'spell' && (
        <div className="wiz-grid">
          <Field label={t('wiz.spell')} hint={t('wiz.spellHint')}>
            <select
              className="in sel"
              value={c.combat.skill}
              onChange={(e) => patch({ combat: { kind: 'spell', skill: e.target.value } })}
            >
              {STARTER_SPELLS.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </Field>
        </div>
      )}
      {c.combat?.kind === 'hand' && (
        <div className="wiz-grid">
          <Field label={t('wiz.hand')} hint={t('wiz.handHint')}>
            <select
              className="in sel"
              value={c.combat.skill}
              onChange={(e) =>
                patch({ combat: { kind: 'hand', ...HAND_TO_HAND.find((h) => h.skill === e.target.value)! } })
              }
            >
              {HAND_TO_HAND.map((h) => (
                <option key={h.skill} value={h.skill}>
                  {h.skill} + {h.effect}
                </option>
              ))}
            </select>
          </Field>
        </div>
      )}
      {preview && <BookPreview name={preview} />}
      {issues.includes('combatDuplicate') && <p className="error small">{t('wiz.combatDup')}</p>}
    </div>
  );
}

/** Quick stats for the chosen weapon or spell, fetched from the book catalog. */
function BookPreview({ name }: { name: string }) {
  const { t } = useI18n();
  const [hit, setHit] = useState<CatalogHit | null | undefined>(undefined);
  useEffect(() => {
    let alive = true;
    setHit(undefined);
    lookup(name)
      .then((h) => alive && setHit(h))
      .catch(() => alive && setHit(null));
    return () => {
      alive = false;
    };
  }, [name]);
  if (!hit) return null;
  const e = hit.entry;
  const bits = [
    e.attackType && t(`skill.${e.attackType}` as MsgKey),
    e.manaCost && t('skill.sumMana', { n: e.manaCost }),
    e.range,
    e.baseDamage,
    e.aiFavor && `${t('skill.aiFavor')} ${e.aiFavor}`,
    e.limitations,
  ].filter(Boolean);
  return (
    <div className="book-preview">
      <strong>{e.name}</strong> <span className="dim small">· {bits.join(' · ')}</span>
      {e.effect && <div className="small">{e.effect}</div>}
    </div>
  );
}

function StatsStep({ c, patch, issues }: StepProps & { issues: StepIssue[] }) {
  const { t } = useI18n();
  const used = STAT_KEYS.map((k) => c.stats[k]).filter((v): v is number => v !== null);
  const setStat = (k: StatKey, v: number | null) => patch({ stats: { ...c.stats, [k]: v } });
  const rolled = c.statMethod === 'roll' && STAT_KEYS.every((k) => c.stats[k] !== null);
  const mod = (k: StatKey) => statModFromScore(c.stats[k]);
  return (
    <div className="stats-step">
      <div className="seg">
        <button
          type="button"
          className={c.statMethod === 'array' ? 'active' : ''}
          onClick={() =>
            patch({ statMethod: 'array', stats: { str: null, int: null, con: null, dex: null, cha: null } })
          }
        >
          {t('wiz.array')}
        </button>
        <button
          type="button"
          className={c.statMethod === 'roll' ? 'active' : ''}
          onClick={() =>
            patch({ statMethod: 'roll', stats: { str: null, int: null, con: null, dex: null, cha: null } })
          }
        >
          {t('wiz.rollStats')}
        </button>
      </div>
      <p className="dim small">{t(c.statMethod === 'array' ? 'wiz.arrayHint' : 'wiz.rollHint')}</p>
      <div className="stat-picks">
        {STAT_KEYS.map((k) => (
          <div key={k} className="stat-pick">
            <span className="stat-name">{t(`stat.${k}` as MsgKey)}</span>
            {c.statMethod === 'array' ? (
              <select
                className="in sel"
                value={c.stats[k] ?? ''}
                onChange={(e) => setStat(k, e.target.value ? Number(e.target.value) : null)}
              >
                <option value="">—</option>
                {STANDARD_ARRAY.map((v) => (
                  <option key={v} value={v} disabled={used.includes(v) && c.stats[k] !== v}>
                    {v}
                  </option>
                ))}
              </select>
            ) : (
              <output className="auto-val big">{c.stats[k] ?? '—'}</output>
            )}
            <span className="dim small">
              {t('core.statMod', { stat: t(`stat.${k}.short` as MsgKey) })} {mod(k) === null ? '—' : signed(mod(k))}
            </span>
          </div>
        ))}
      </div>
      {c.statMethod === 'roll' && (
        <button
          type="button"
          className="btn"
          disabled={rolled}
          onClick={() =>
            patch({
              stats: { str: rollStat(), int: rollStat(), con: rollStat(), dex: rollStat(), cha: rollStat() },
            })
          }
        >
          {rolled ? t('wiz.rolled') : t('wiz.rollNow')}
        </button>
      )}
      {STAT_KEYS.every((k) => c.stats[k] !== null) && (
        <div className="derived-preview">
          <span>
            {t('core.health')}: {t('wiz.slotsOf', { n: (mod('con') ?? 0) * 10, slot: mod('con') ?? 0 })}
          </span>
          <span>
            {t('core.manaMax')}: {c.stats.int}
          </span>
          <span>
            {t('core.evade')}: d20 {signed(mod('dex'))}
          </span>
        </div>
      )}
      {issues.includes('spellInt') && <p className="error small">{t('wiz.spellInt')}</p>}
    </div>
  );
}

function GearStep({ c, patch }: StepProps) {
  const { t } = useI18n();
  const g = c.gear;
  const set = (k: keyof Choices['gear'], v: string) => patch({ gear: { ...g, [k]: v } });
  return (
    <div className="gear-step">
      <p className="dim small">{t('wiz.gearIntro')}</p>
      <div className="row-gap wrap">
        <span className="lbl">{t('wiz.kits')}</span>
        {GEAR_KITS.map((k) => (
          <button
            key={k.id}
            type="button"
            className="btn small ghost"
            onClick={() =>
              patch({
                gear: {
                  clothing: k.clothing,
                  weapon: c.combat?.kind === 'weapon' ? c.combat.label : k.weapon,
                  item: k.item,
                  weird: k.weird,
                },
              })
            }
          >
            {t(`wiz.kit.${k.id}` as MsgKey)}
          </button>
        ))}
      </div>
      <div className="wiz-grid">
        <Field label={t('wiz.clothing')}>
          <input className="in" value={g.clothing} onChange={(e) => set('clothing', e.target.value)} />
        </Field>
        <Field label={t('wiz.holding')}>
          <input className="in" value={g.weapon} onChange={(e) => set('weapon', e.target.value)} />
        </Field>
        <Field label={t('wiz.usefulItem')}>
          <input className="in" value={g.item} onChange={(e) => set('item', e.target.value)} />
        </Field>
        <Field label={t('wiz.weird')}>
          <input className="in" value={g.weird} onChange={(e) => set('weird', e.target.value)} />
        </Field>
      </div>
    </div>
  );
}

function ReviewStep({ c }: { c: Choices }) {
  const { t } = useI18n();
  const skills = pickedSkills(c);
  const combat = c.combat;
  return (
    <div className="review">
      <h3>{c.name || '—'}</h3>
      <p className="dim">
        {[
          c.animal ? c.species : t('wiz.human'),
          c.gender,
          c.crawlerNumber && `#${c.crawlerNumber}`,
          c.third?.race,
          c.third?.cls,
          t('dash.lvl', { n: c.third ? 10 : 1 }),
          t('dash.floor', { n: c.third ? 3 : 1 }),
        ]
          .filter(Boolean)
          .join(' · ')}
      </p>
      <div className="review-grid">
        <div>
          <div className="sub-lbl">{t('core.stats')}</div>
          <ul className="plain">
            {STAT_KEYS.map((k) => (
              <li key={k}>
                {t(`stat.${k}` as MsgKey)}: <strong>{(c.stats[k] ?? 0) + (c.third?.points[k] ?? 0)}</strong> (
                {signed(statModFromScore((c.stats[k] ?? 0) + (c.third?.points[k] ?? 0)))})
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="sub-lbl">{t('core.attacks')}</div>
          <ul className="plain">
            <li>
              {c.animal ? 'Slice Attack' : 'Unarmed Combat'} · {t('wiz.rankN', { n: 3 })}
            </li>
            {combat?.kind === 'weapon' && (
              <li>
                {combat.label} · {t('wiz.rankN', { n: 3 })}
              </li>
            )}
            {combat?.kind === 'spell' && (
              <li>
                {combat.skill} · {t('wiz.rankN', { n: 3 })} · {t('wiz.plusPotions')}
              </li>
            )}
            {combat?.kind === 'hand' && (
              <li>
                {combat.skill} + {combat.effect} · {t('wiz.rankN', { n: 3 })}
              </li>
            )}
            <li>Heal · {t('wiz.rankN', { n: 1 })}</li>
          </ul>
        </div>
        <div>
          <div className="sub-lbl">{t('skills.title')}</div>
          <ul className="plain">
            {skills.map((s) => (
              <li key={s.name}>
                {s.name} · {t('wiz.rankN', { n: s.rank })}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="sub-lbl">{t('wiz.step.gear')}</div>
          <ul className="plain">
            {[c.gear.clothing, c.gear.weapon, c.gear.item, c.gear.weird].filter(Boolean).map((g) => (
              <li key={g}>{g}</li>
            ))}
          </ul>
        </div>
      </div>
      <p className="dim small">{t('wiz.reviewHint')}</p>
    </div>
  );
}

/* ---------------- Third Floor crawler (Core Rulebook p. 115–118) ---------------- */
function ThirdStep({ c, patch }: StepProps) {
  const { t } = useI18n();
  const th = c.third!;
  const set = (p: Partial<ThirdFloor>) => patch({ third: { ...th, ...p } });
  const used = thirdPointsUsed(th);
  const left = THIRD_STAT_POINTS - used;
  const skills = startingSkills(c);
  const chaMod = statModFromScore((c.stats.cha ?? 0) + th.points.cha);
  const row = th.lootRow ? LOOT_ROWS[th.lootRow - 1] : null;
  return (
    <div className="third">
      <p className="dim">{t('wiz.third.intro')}</p>

      <section>
        <h3>{t('wiz.third.raceClass')}</h3>
        <div className="wiz-grid">
          <Field label={t('core.race')}>
            <input className="in" value={th.race} onChange={(e) => set({ race: e.target.value })} />
          </Field>
          <Field label={t('core.class')}>
            <input className="in" value={th.cls} onChange={(e) => set({ cls: e.target.value })} />
          </Field>
        </div>
        <p className="dim tiny">{t('wiz.third.raceHint')}</p>
      </section>

      <section>
        <h3>
          {t('wiz.third.stats')}{' '}
          <span className={`pill ${left === 0 ? 'ok-pill' : left < 0 ? 'bad-pill' : ''}`}>
            {t('wiz.third.pointsLeft', { n: left })}
          </span>
        </h3>
        <div className="third-stats">
          {STAT_KEYS.map((k) => {
            const base = c.stats[k] ?? 0;
            const val = base + th.points[k];
            return (
              <div key={k} className="third-stat">
                <span className="lbl">{t(`stat.${k}` as MsgKey)}</span>
                <div className="row-gap">
                  <button
                    type="button"
                    className="btn small ghost"
                    disabled={th.points[k] <= 0}
                    onClick={() => set({ points: { ...th.points, [k]: th.points[k] - 1 } })}
                  >
                    −
                  </button>
                  <strong>{val}</strong>
                  <button
                    type="button"
                    className="btn small ghost"
                    disabled={left <= 0}
                    onClick={() => set({ points: { ...th.points, [k]: th.points[k] + 1 } })}
                  >
                    +
                  </button>
                </div>
                <span className="dim tiny">
                  {base} + {th.points[k]} · {t('core.statMod', { stat: '' })} {signed(statModFromScore(val))}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <h3>{t('wiz.third.skills')}</h3>
        <button type="button" className="btn small" onClick={() => set({ boosts: rollBoosts(c) })}>
          🎲 {th.boosts ? t('wiz.third.reroll') : t('wiz.third.rollSkills')}
        </button>
        <ul className="plain third-skills">
          {skills.map((sk) => {
            const add = th.boosts?.[sk.name];
            return (
              <li key={sk.name}>
                {sk.name} · {t('wiz.rankN', { n: sk.rank })}
                {add !== undefined && (
                  <strong>
                    {' '}
                    → {Math.min(10, sk.rank + add)} <span className="dim tiny">(+{add})</span>
                  </strong>
                )}
                {sk.main && <span className="dim tiny"> · {t('wiz.third.main')}</span>}
              </li>
            );
          })}
        </ul>
      </section>

      <section>
        <h3>{t('wiz.third.favor')}</h3>
        <div className="row-gap">
          <select
            className="in sel"
            value={th.favorRating}
            onChange={(e) => set({ favorRating: Number(e.target.value) as 0 | 1 | 2, favor: null })}
          >
            {[0, 1, 2].map((n) => (
              <option key={n} value={n}>
                {t('wiz.third.favorRating', { n })}
              </option>
            ))}
          </select>
          <button type="button" className="btn small" onClick={() => set({ favor: rollFavor(th.favorRating) })}>
            🎲 {t('wiz.third.rollFavor', { n: th.favorRating + 1 })}
          </button>
          {th.favor !== null && <strong>{t('wiz.third.favorIs', { n: th.favor })}</strong>}
        </div>
        <p className="dim tiny">
          {t('wiz.third.popularity', { n: chaMod === null ? '—' : chaMod * 2 })} · {t('wiz.third.level')}
        </p>
      </section>

      <section>
        <h3>{t('wiz.third.loot')}</h3>
        <div className="row-gap">
          {[1, 2, 3, 4].map((n) => (
            <button
              key={n}
              type="button"
              className={`btn small ${th.lootRow === n ? 'primary' : 'ghost'}`}
              onClick={() => set({ lootRow: n })}
            >
              {n}
            </button>
          ))}
          <button type="button" className="btn small" onClick={() => set({ lootRow: roll(4) })}>
            🎲 d4
          </button>
        </div>
        {row && (
          <ul className="third-loot">
            {LOOT_SLOTS.map((slot) => {
              const tier = row[slot];
              const canSpell = slot !== 'consumable';
              const asSpells = canSpell && th.spells[slot as 'weapon' | 'armor' | 'item'];
              return (
                <li key={slot} className={`rar-${tier}`}>
                  <div className="row-gap">
                    <span className={`pill rar-pill rar-${tier}`}>{t(`rarity.${tier}` as MsgKey)}</span>
                    <strong>{t(`wiz.third.slot.${slot}` as MsgKey)}</strong>
                    {canSpell && (
                      <label className="gm-check">
                        <input
                          type="checkbox"
                          checked={asSpells}
                          onChange={(e) => set({ spells: { ...th.spells, [slot]: e.target.checked } })}
                        />
                        {t('wiz.third.asSpells')}
                      </label>
                    )}
                  </div>
                  <span className="dim small">{asSpells ? LOOT_TEXT.spells[tier] : LOOT_TEXT[slot][tier]}</span>
                </li>
              );
            })}
          </ul>
        )}
        <p className="dim tiny">{t('wiz.third.lootHint')}</p>
      </section>

      <section>
        <h3>{t('wiz.third.exp')}</h3>
        <p className="dim tiny">{t('wiz.third.expHint')}</p>
        <ol className="third-exp">
          {th.experiences.map((e, i) => (
            <li key={i}>
              <button
                type="button"
                className="btn small ghost"
                onClick={() =>
                  set({ experiences: th.experiences.map((x, j) => (j === i ? { ...x, table: roll(6) } : x)) })
                }
              >
                🎲 d6
              </button>
              {e.table && <span className="pill">{t(`wiz.third.table.${e.table}` as MsgKey)}</span>}
              <input
                className="in"
                value={e.text}
                placeholder={t('wiz.third.expPh')}
                onChange={(ev) =>
                  set({
                    experiences: th.experiences.map((x, j) => (j === i ? { ...x, text: ev.target.value } : x)),
                  })
                }
              />
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}

/* ---------------- start from a pre-generated crawler ---------------- */
function PregenPicker({ onClose }: { onClose: () => void }) {
  const { t, err, lang } = useI18n();
  const navigate = useNavigate();
  const [list, setList] = useState<Pregen[] | null>(null);
  const [busy, setBusy] = useState<number | null>(null);
  const [error, setError] = useState('');
  useEffect(() => {
    api
      .pregens()
      .then(setList)
      .catch((e) => setError(err(e)));
  }, [err]);
  const use = async (p: Pregen) => {
    setBusy(p.id);
    setError('');
    try {
      const names = pregenSkills(p).map((x) => x.name);
      const hits: Record<string, CatalogHit | null> = {};
      await Promise.all(names.map(async (n) => (hits[n] = await lookup(n).catch(() => null))));
      const ch = await api.createCharacter(buildFromPregen(p, hits));
      navigate(`/sheet/${ch.id}`);
    } catch (e) {
      setError(err(e, 'err.createFailed'));
      setBusy(null);
    }
  };
  return (
    <div className="modal-back" onClick={onClose}>
      <div className="modal pregen-modal" onClick={(e) => e.stopPropagation()}>
        <div className="item-modal-head">
          <h2>{t('pregen.title')}</h2>
          <button type="button" className="icon-btn small" onClick={onClose} aria-label={t('common.close')}>
            ×
          </button>
        </div>
        <p className="dim small">{t('pregen.hint')}</p>
        {error && <p className="error">{error}</p>}
        {!list && !error && <p className="dim">{t('common.loading')}</p>}
        <div className="pregen-list">
          {list?.map((p) => (
            <article key={p.id} className="pregen">
              <div className="pregen-head">
                <strong>{p.name}</strong>
                <span className="dim tiny">
                  {[p.tags, t('dash.lvl', { n: p.level }), t('dash.floor', { n: p.floor })].join(' · ')}
                </span>
              </div>
              <p className="small">{lang === 'es' && p.descriptionEs ? p.descriptionEs : p.description}</p>
              <p className="dim tiny">{p.keySkills}</p>
              <button type="button" className="btn small primary" disabled={busy !== null} onClick={() => use(p)}>
                {busy === p.id ? '…' : t('pregen.use')}
              </button>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
