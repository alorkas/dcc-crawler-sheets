import { useEffect, useRef, useState } from 'react';
import { Area, Check, Input, Section, useSheet } from './fields';
import { AdvancementPanel, RankBadge, StatMod, useStatMod } from './rulesWidgets';
import { useI18n, type MsgKey } from '../lib/i18n';
import { canPin, castHeal, num, spendMana } from '../lib/rules';
import { emptySkill, signed, type Skill } from '../lib/sheet';
import { SKILL_CATEGORIES, isCategory, isValidType, type SkillCategory } from '../lib/skillTypes';
import { fillSkill, hitType, lookup } from '../lib/catalog';
import { api } from '../lib/api';
import { useAuth } from '../lib/auth';
import { STARTER_SPELLS } from '../lib/creation';
import { RollButton } from './RollButton';

const catKey = (c: string) => `skillcat.${c}` as MsgKey;
const subKey = (c: string, s: string) => `skillsub.${c}.${s}` as MsgKey;

/** Skills tab: one section per category (Combat, Utility, Spell), rows grouped by subtype. */
export function SkillsTab() {
  const { data, update, locked } = useSheet();
  const { t } = useI18n();
  // detail panels that are open (by skill index); newly added cards open automatically
  const [open, setOpen] = useState<Set<number>>(new Set());
  const toggle = (i: number) =>
    setOpen((o) => {
      const n = new Set(o);
      if (n.has(i)) n.delete(i);
      else n.add(i);
      return n;
    });

  const uncategorized = data.skills.map((s, i) => [s, i] as const).filter(([s]) => !isCategory(s.category));

  // Once per sheet: sort skills that have a name but no subtype yet (e.g. spells from older sheets)
  const resolved = useRef(false);
  useEffect(() => {
    if (resolved.current || locked) return;
    resolved.current = true;
    const pending = data.skills.filter((s) => !s.custom && s.name.trim() && (!s.category || !s.subtype));
    pending.forEach((s) => {
      lookup(s.name)
        .then((hit) => {
          const type = hit && hitType(hit);
          if (!type) return;
          update((d) => ({
            ...d,
            skills: d.skills.map((x) =>
              !x.custom && x.name === s.name && (!x.category || !x.subtype)
                ? { ...x, ...type, stat: x.stat || fillSkill(x, hit).stat || '' }
                : x,
            ),
          }));
        })
        .catch(() => {});
    });
  }, [data.skills, locked, update]);

  const addSkill = (category: SkillCategory, custom = false) => {
    const index = data.skills.length;
    update((d) => ({ ...d, skills: [...d.skills, { ...emptySkill(), category, custom }] }));
    setOpen((o) => new Set(o).add(index));
  };
  const removeSkill = (i: number) => {
    update((d) => ({ ...d, skills: d.skills.filter((_, j) => j !== i) }));
    setOpen(new Set());
  };

  return (
    <div className="skills-page">
      <SkillNameList />
      {SKILL_CATEGORIES.map((cat) => {
        const rows = data.skills.map((s, i) => [s, i] as const).filter(([s]) => s.category === cat.id);
        const groups = [...cat.subtypes, ''].map((sub) => ({
          sub,
          rows: rows.filter(([s]) => (cat.subtypes.includes(s.subtype) ? s.subtype : '') === sub),
        }));
        const detailed = cat.id !== 'utility';
        const allOpen = rows.length > 0 && rows.every(([, i]) => open.has(i));
        return (
          <Section
            key={cat.id}
            title={
              <>
                {t(catKey(cat.id))} <span className="count-badge">{rows.length}</span>
              </>
            }
            actions={
              detailed && rows.length > 0 ? (
                <button
                  type="button"
                  className="btn small ghost head-btn"
                  onClick={() =>
                    setOpen((o) => {
                      const n = new Set(o);
                      rows.forEach(([, i]) => (allOpen ? n.delete(i) : n.add(i)));
                      return n;
                    })
                  }
                >
                  {t(allOpen ? 'skills.collapseAll' : 'skills.expandAll')}
                </button>
              ) : undefined
            }
            className={`skill-cat cat-${cat.id}`}
          >
            <p className="dim small cat-hint">{t(`skillcat.${cat.id}.hint` as MsgKey)}</p>
            {!detailed && rows.length > 0 && <UtilityHeader />}
            {groups
              .filter((g) => g.rows.length > 0)
              .map((g) => (
                <div key={g.sub || 'other'} className="skill-group">
                  <div className="skill-sub">{g.sub ? t(subKey(cat.id, g.sub)) : t('skills.noSubtype')}</div>
                  <div className="list">
                    {g.rows.map(([, i]) =>
                      detailed ? (
                        <SkillCard key={i} i={i} open={open.has(i)} onToggle={() => toggle(i)} onRemove={removeSkill} />
                      ) : (
                        <UtilityRow key={i} i={i} onRemove={removeSkill} />
                      ),
                    )}
                  </div>
                </div>
              ))}
            {rows.length === 0 && <p className="dim small">{t('skills.emptyCat')}</p>}
            {!locked && (
              <div className="add-row-group">
                <button type="button" className="btn ghost add-row" onClick={() => addSkill(cat.id)}>
                  + {t(`skills.add.${cat.id}` as MsgKey)}
                </button>
                <button
                  type="button"
                  className="btn ghost add-row add-custom"
                  onClick={() => addSkill(cat.id, true)}
                  title={t('skills.customHint')}
                >
                  + {t('skills.addCustom')}
                </button>
              </div>
            )}
          </Section>
        );
      })}

      {uncategorized.length > 0 && (
        <Section title={t('skills.uncategorized')} className="skill-cat">
          <p className="dim small cat-hint">{t('skills.uncategorizedHint')}</p>
          <UtilityHeader />
          <div className="list">
            {uncategorized.map(([, i]) => (
              <UtilityRow key={i} i={i} onRemove={removeSkill} />
            ))}
          </div>
        </Section>
      )}

      <Section title={t('adv.section')}>
        <AdvancementPanel />
      </Section>
    </div>
  );
}

/* ---------------- shared bits ---------------- */

function usePatch(i: number) {
  const { update } = useSheet();
  return (p: Partial<Skill>) =>
    update((d) => ({ ...d, skills: d.skills.map((x, j) => (j === i ? { ...x, ...p } : x)) }));
}

/** Roll total for a skill, or null when it doesn't roll (passive skills, passive spells, damage effects). */
function useRollTotal(s: Skill): number | null {
  const { der } = useSheet();
  const mod = useStatMod(s.stat, s.statMod);
  const rank = num(s.rank);
  const passive = s.stat === 'none' || s.subtype === 'passive' || s.subtype === 'damageEffect';
  if (passive || (rank === null && mod === null)) return null;
  return (rank ?? 0) + (mod ?? 0) + der.penalty;
}

/**
 * Type dropdown. Categorised skills only list the subtypes of their own category;
 * uncategorised skills list every category so they can be sorted.
 */
function TypeSelect({ i }: { i: number }) {
  const { data, locked } = useSheet();
  const { t } = useI18n();
  const patch = usePatch(i);
  const s = data.skills[i];
  const cat = SKILL_CATEGORIES.find((c) => c.id === s.category);
  const value = s.category && isValidType(s.category, s.subtype) ? `${s.category}:${s.subtype}` : '';
  const onChange = (v: string) => {
    const [category, subtype = ''] = v.split(':');
    patch({ category: isCategory(category) ? category : '', subtype });
  };
  return (
    <select
      className="in sel type-sel"
      value={value}
      disabled={locked}
      aria-label={t('skills.type')}
      onChange={(e) => onChange(e.target.value)}
    >
      {cat ? (
        <>
          <option value={`${cat.id}:`}>{t('skills.noSubtype')}</option>
          {cat.subtypes.map((sub) => (
            <option key={sub} value={`${cat.id}:${sub}`}>
              {t(subKey(cat.id, sub))}
            </option>
          ))}
          <optgroup label={t('skills.moveTo')}>
            {SKILL_CATEGORIES.filter((c) => c.id !== cat.id).map((c) => (
              <option key={c.id} value={`${c.id}:`}>
                {t(catKey(c.id))}
              </option>
            ))}
          </optgroup>
        </>
      ) : (
        <>
          <option value="">{t('skills.pickType')}</option>
          {SKILL_CATEGORIES.map((c) => (
            <optgroup key={c.id} label={t(catKey(c.id))}>
              <option value={`${c.id}:`}>
                {t(catKey(c.id))} · {t('skills.noSubtype')}
              </option>
              {c.subtypes.map((sub) => (
                <option key={sub} value={`${c.id}:${sub}`}>
                  {t(subKey(c.id, sub))}
                </option>
              ))}
            </optgroup>
          ))}
        </>
      )}
    </select>
  );
}

/** Name input: when you leave it, known book skills and spells are sorted into their type (and get their Stat). */
function NameInput({ i }: { i: number }) {
  const { data, locked, update } = useSheet();
  const { t } = useI18n();
  const s = data.skills[i];
  const autoClassify = () => {
    if (locked || s.custom || (s.subtype && s.stat) || !s.name.trim()) return;
    const name = s.name;
    lookup(name)
      .then((hit) => {
        const type = hit && hitType(hit);
        if (!hit || !type) return;
        update((d) => ({
          ...d,
          skills: d.skills.map((x, j) => {
            if (j !== i || x.name !== name) return x;
            const sameCategory = !x.category || x.category === type.category;
            return {
              ...x,
              ...(sameCategory && !x.subtype ? type : {}),
              stat: x.stat || fillSkill(x, hit).stat || '',
            };
          }),
        }));
      })
      .catch(() => {});
  };
  // suggestions only from the book list of this skill's own category; custom skills get none
  const list = s.custom ? undefined : isCategory(s.category) ? `skill-names-${s.category}` : 'skill-names-all';
  return (
    <div onBlur={autoClassify} className="name-cell">
      <Input
        path={['skills', i, 'name']}
        ariaLabel={t('skills.name')}
        placeholder={t(s.custom ? 'skills.phCustom' : 'skills.phSkill')}
        list={list}
      />
      {s.custom && <CustomTag i={i} />}
    </div>
  );
}

/**
 * Name suggestions, one list per category: weapons (combat) and utility skills for everyone (they're in the
 * player books) and the starter spells; the GM also gets every spell so they can hand spells out quickly.
 */
function SkillNameList() {
  const { user } = useAuth();
  const [lists, setLists] = useState<Record<SkillCategory, string[]>>({ combat: [], utility: [], spell: [] });
  useEffect(() => {
    const sorted = (n: string[]) => [...new Set(n)].sort((a, b) => a.localeCompare(b));
    const load = user?.isAdmin
      ? api.fullCatalog().then((c) => ({
          combat: c.weapons.map((e) => e.name),
          utility: c.utility.map((e) => e.name),
          spell: c.spells.map((e) => e.name),
        }))
      : api.publicSkills().then((l) => ({
          combat: l.filter((e) => e.category === 'combat').map((e) => e.name),
          utility: l.filter((e) => e.category === 'utility').map((e) => e.name),
          spell: [...STARTER_SPELLS, 'Heal'],
        }));
    load
      .then((x) => setLists({ combat: sorted(x.combat), utility: sorted(x.utility), spell: sorted(x.spell) }))
      .catch(() => {});
  }, [user?.isAdmin]);
  const all = [...lists.combat, ...lists.utility, ...lists.spell];
  return (
    <>
      {(Object.keys(lists) as SkillCategory[]).map((cat) => (
        <datalist key={cat} id={`skill-names-${cat}`}>
          {lists[cat].map((n) => (
            <option key={n} value={n} />
          ))}
        </datalist>
      ))}
      <datalist id="skill-names-all">
        {all.map((n) => (
          <option key={n} value={n} />
        ))}
      </datalist>
    </>
  );
}

/** "Custom" tag on homebrew skills; click to turn it back into a normal (book) skill. */
function CustomTag({ i }: { i: number }) {
  const { locked } = useSheet();
  const { t } = useI18n();
  const patch = usePatch(i);
  return (
    <button
      type="button"
      className="custom-tag"
      disabled={locked}
      title={t('skills.customTagHint')}
      onClick={() => patch({ custom: false })}
    >
      {t('skills.custom')}
    </button>
  );
}

/** Fills empty fields of an attack skill or spell from the book. */
function FillButton({ i }: { i: number }) {
  const { data, locked, update } = useSheet();
  const { t } = useI18n();
  const [msg, setMsg] = useState('');
  const s = data.skills[i];
  if (locked || s.custom || !s.name.trim()) return null;
  const fill = async () => {
    setMsg('');
    try {
      const hit = await lookup(s.name);
      if (!hit || hit.kind === 'item') return setMsg(t('fill.notFound'));
      const changes = fillSkill(s, hit);
      if (Object.keys(changes).length === 0) return setMsg(t('fill.nothing'));
      update(
        (d) => ({ ...d, skills: d.skills.map((x, j) => (j === i ? { ...x, ...fillSkill(x, hit) } : x)) }),
        t('fill.done', { name: hit.entry.name }),
      );
      setMsg(t('fill.filled', { n: Object.keys(changes).length }));
    } catch {
      setMsg(t('err.generic'));
    }
  };
  return (
    <div className="fill-row">
      <button type="button" className="btn small ghost" onClick={fill} title={t('fill.hint')}>
        {t('fill.button')}
      </button>
      {msg && <span className="dim small">{msg}</span>}
    </div>
  );
}

/** The skill's check total; click it to roll to the shared log. */
function SkillRoll({ s, total }: { s: Skill; total: number | null }) {
  const { t } = useI18n();
  if (total === null) return <output className="roll-total center" />;
  return (
    <RollButton
      expr={`d20${signed(total)}`}
      text={`d20 ${signed(total)}`}
      label={s.name || t('skills.phSkill')}
      className="center"
    />
  );
}

function RemoveBtn({ i, onRemove }: { i: number; onRemove: (i: number) => void }) {
  const { locked } = useSheet();
  const { t } = useI18n();
  if (locked) return <span />;
  return (
    <button
      type="button"
      className="row-del"
      title={t('list.remove')}
      aria-label={t('list.remove')}
      onClick={() => onRemove(i)}
    >
      ×
    </button>
  );
}

/* ---------------- utility skills: compact table ---------------- */

function UtilityHeader() {
  const { t } = useI18n();
  return (
    <div className="list-head skills-cols">
      <span>{t('skills.name')}</span>
      <span>{t('skills.type')}</span>
      <span>{t('skills.rank')}</span>
      <span>{t('skills.statMod')}</span>
      <span>{t('skills.notes')}</span>
      <span className="center">{t('skills.total')}</span>
      <span className="center" title={t('skills.markHint')}>
        ✔
      </span>
    </div>
  );
}

function UtilityRow({ i, onRemove }: { i: number; onRemove: (i: number) => void }) {
  const { data } = useSheet();
  const { t } = useI18n();
  const s = data.skills[i];
  const total = useRollTotal(s);
  return (
    <div className="list-row">
      <div className="skills-cols">
        <NameInput i={i} />
        <TypeSelect i={i} />
        <div className="rank-cell">
          <Input path={['skills', i, 'rank']} ariaLabel={t('skills.rank')} placeholder={t('skills.rank')} center />
          <RankBadge rank={s.rank} />
        </div>
        <StatMod statPath={['skills', i, 'stat']} legacyPath={['skills', i, 'statMod']} label={t('skills.statMod')} />
        <Input path={['skills', i, 'notes']} ariaLabel={t('skills.notes')} placeholder={t('skills.notes')} />
        <SkillRoll s={s} total={total} />
        <Check path={['skills', i, 'done']} label={t('skills.checked')} />
      </div>
      <RemoveBtn i={i} onRemove={onRemove} />
    </div>
  );
}

/* ---------------- attack skills & spells: cards with the book's entry fields ---------------- */

function SkillCard({
  i,
  open,
  onToggle,
  onRemove,
}: {
  i: number;
  open: boolean;
  onToggle: () => void;
  onRemove: (i: number) => void;
}) {
  const { data, locked } = useSheet();
  const { t } = useI18n();
  const patch = usePatch(i);
  const s = data.skills[i];
  const total = useRollTotal(s);
  const spell = s.category === 'spell';
  const f = (k: keyof Skill) => ['skills', i, k];
  const summary = spell
    ? [
        s.manaCost && t('skill.sumMana', { n: s.manaCost }),
        s.range,
        s.duration,
        s.baseDamage,
        s.cooldown && t('skill.sumCooldown', { v: s.cooldown }),
      ]
    : [
        s.attackType && t(`skill.${s.attackType}` as MsgKey),
        s.range,
        s.baseDamage,
        s.cooldown && t('skill.sumCooldown', { v: s.cooldown }),
      ];
  const summaryText = summary.filter(Boolean).join(' · ');

  return (
    <div className={`skill-card ${open ? 'open' : ''}`}>
      <div className="skill-card-head">
        <button
          type="button"
          className="expand-btn"
          aria-expanded={open}
          aria-label={t(open ? 'skill.hideDetails' : 'skill.showDetails')}
          title={t(open ? 'skill.hideDetails' : 'skill.showDetails')}
          onClick={onToggle}
        >
          ▸
        </button>
        <NameInput i={i} />
        <TypeSelect i={i} />
        <div className="rank-cell">
          <Input path={f('rank')} ariaLabel={t('skills.rank')} placeholder={t('skills.rank')} center />
          <RankBadge rank={s.rank} />
        </div>
        <StatMod statPath={f('stat')} legacyPath={f('statMod')} label={t('skills.statMod')} />
        <SkillRoll s={s} total={total} />
        <PinButton i={i} />
        <Check path={f('done')} label={t('skills.checked')} />
        <RemoveBtn i={i} onRemove={onRemove} />
      </div>

      {!open && summaryText && (
        <button type="button" className="skill-summary" onClick={onToggle}>
          {summaryText}
        </button>
      )}

      {open && (
        <div className="skill-details">
          <FillButton i={i} />
          <div className="skill-fields">
            {spell ? (
              <Input path={f('manaCost')} label={t('skill.manaCost')} center numeric />
            ) : (
              <label className="field">
                <span className="lbl">{t('skill.attackType')}</span>
                <select
                  className="in sel"
                  value={s.attackType}
                  disabled={locked}
                  onChange={(e) => patch({ attackType: e.target.value as Skill['attackType'] })}
                >
                  <option value="">—</option>
                  <option value="melee">{t('skill.melee')}</option>
                  <option value="ranged">{t('skill.ranged')}</option>
                </select>
              </label>
            )}
            <Input path={f('range')} label={t('skill.range')} />
            {spell && <Input path={f('duration')} label={t('skill.duration')} />}
            <Input path={f('aiFavor')} label={t('skill.aiFavor')} center />
            <Input path={f('cooldown')} label={t('skill.cooldown')} />
            <Input path={f('baseDamage')} label={t('skill.baseDamage')} placeholder={t('skill.phDamage')} />
          </div>
          <Area path={f('limitations')} label={t('skill.limitations')} rows={1} />
          <Area path={f('description')} label={t('skill.description')} rows={2} />
          <Area path={f('effect')} label={t(spell ? 'skill.effect' : 'skill.effects')} rows={1} />
          <Area path={f('notes')} label={t('skills.notes')} rows={2} placeholder={t('skill.phNotes')} />
          {spell && <CastButton i={i} />}
        </div>
      )}
    </div>
  );
}

/** Cast a spell: spends its Mana cost (Heal also restores 2 HB slots). Hidden when locked or without a cost. */
export function CastButton({ i, compact }: { i: number; compact?: boolean }) {
  const { data, locked, update } = useSheet();
  const { t } = useI18n();
  const [msg, setMsg] = useState('');
  const s = data.skills[i];
  const cost = num(s.manaCost);
  const isHeal = s.name.trim().toLowerCase() === 'heal';
  if (locked || (cost === null && !isHeal)) return null;
  const cast = () => {
    setMsg('');
    let ok = true;
    update(
      (d) => {
        const r = isHeal ? castHeal(d) : spendMana(d, cost ?? 0);
        if (!r) ok = false;
        return r ?? d;
      },
      t('skill.castDone', { name: s.name || t('skillcat.spell'), n: isHeal ? 2 : (cost ?? 0) }),
    );
    if (!ok) setMsg(t('mana.notEnough'));
  };
  return (
    <div className={compact ? 'cast-row compact' : 'cast-row'}>
      <button type="button" className="btn small" onClick={cast}>
        {t('skill.cast', { n: isHeal ? 2 : (cost ?? 0) })}
      </button>
      {msg && <span className="error small">{msg}</span>}
    </div>
  );
}

/** Pin toggle for combat skills and attack spells: pinned skills show in the Core tab's Attacks list. */
function PinButton({ i }: { i: number }) {
  const { data, locked } = useSheet();
  const { t } = useI18n();
  const patch = usePatch(i);
  const s = data.skills[i];
  if (!canPin(s)) return <span />;
  return (
    <button
      type="button"
      className={`pin-btn ${s.pinned ? 'on' : ''}`}
      aria-pressed={s.pinned}
      disabled={locked}
      title={t(s.pinned ? 'skill.unpin' : 'skill.pin')}
      aria-label={t(s.pinned ? 'skill.unpin' : 'skill.pin')}
      onClick={() => patch({ pinned: !s.pinned })}
    >
      <PinIcon />
    </button>
  );
}

export const PinIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M9 3h6l-1 6 4 4H6l4-4-1-6z" />
    <path d="M12 13v8" />
  </svg>
);
