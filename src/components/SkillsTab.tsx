import { Check, Input, Section, useSheet } from './fields';
import { AdvancementPanel, RankBadge, StatMod, useStatMod } from './rulesWidgets';
import { useI18n, type MsgKey } from '../lib/i18n';
import { num } from '../lib/rules';
import { emptySkill, signed, type Skill } from '../lib/sheet';
import {
  SKILL_CATEGORIES,
  classifySkill,
  defaultCheckType,
  isCategory,
  isValidType,
  type SkillCategory,
} from '../lib/skillTypes';

const catKey = (c: string) => `skillcat.${c}` as MsgKey;
const subKey = (c: string, s: string) => `skillsub.${c}.${s}` as MsgKey;

/** Skills tab: one section per category (Combat, Utility, Spell), rows grouped by subtype. */
export function SkillsTab() {
  const { data, update, locked } = useSheet();
  const { t } = useI18n();

  // skills whose category isn't set (custom names from older sheets) get their own section
  const uncategorized = data.skills.map((s, i) => [s, i] as const).filter(([s]) => !isCategory(s.category));

  const addSkill = (category: SkillCategory) =>
    update((d) => ({ ...d, skills: [...d.skills, { ...emptySkill(), category }] }));

  return (
    <div className="skills-page">
      {SKILL_CATEGORIES.map((cat) => {
        const rows = data.skills.map((s, i) => [s, i] as const).filter(([s]) => s.category === cat.id);
        const groups = [...cat.subtypes, ''].map((sub) => ({
          sub,
          rows: rows.filter(([s]) => (cat.subtypes.includes(s.subtype) ? s.subtype : '') === sub),
        }));
        return (
          <Section
            key={cat.id}
            title={
              <>
                {t(catKey(cat.id))} <span className="count-badge">{rows.length}</span>
              </>
            }
            className={`skill-cat cat-${cat.id}`}
          >
            <p className="dim small cat-hint">{t(`skillcat.${cat.id}.hint` as MsgKey)}</p>
            {rows.length > 0 && <SkillHeader />}
            {groups
              .filter((g) => g.rows.length > 0)
              .map((g) => (
                <div key={g.sub || 'other'} className="skill-group">
                  <div className="skill-sub">{g.sub ? t(subKey(cat.id, g.sub)) : t('skills.noSubtype')}</div>
                  <div className="list">
                    {g.rows.map(([, i]) => (
                      <SkillRow key={i} i={i} />
                    ))}
                  </div>
                </div>
              ))}
            {rows.length === 0 && <p className="dim small">{t('skills.emptyCat')}</p>}
            {!locked && (
              <button type="button" className="btn ghost add-row" onClick={() => addSkill(cat.id)}>
                + {t(`skills.add.${cat.id}` as MsgKey)}
              </button>
            )}
          </Section>
        );
      })}

      {uncategorized.length > 0 && (
        <Section title={t('skills.uncategorized')} className="skill-cat">
          <p className="dim small cat-hint">{t('skills.uncategorizedHint')}</p>
          <SkillHeader />
          <div className="list">
            {uncategorized.map(([, i]) => (
              <SkillRow key={i} i={i} />
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

function SkillHeader() {
  const { t } = useI18n();
  return (
    <div className="list-head skills-cols">
      <span>{t('skills.name')}</span>
      <span>{t('skills.type')}</span>
      <span>{t('skills.rank')}</span>
      <span>{t('skills.statMod')}</span>
      <span>{t('skills.checkType')}</span>
      <span>{t('skills.notes')}</span>
      <span className="center">{t('skills.total')}</span>
      <span className="center" title={t('skills.markHint')}>
        ✔
      </span>
    </div>
  );
}

function SkillRow({ i }: { i: number }) {
  const { data, der, update, locked } = useSheet();
  const { t } = useI18n();
  const s = data.skills[i];
  const mod = useStatMod(s.stat, s.statMod);
  const rank = num(s.rank);
  const passive = s.stat === 'none' || s.subtype === 'passive' || s.subtype === 'damageEffect';
  const total = passive || (rank === null && mod === null) ? null : (rank ?? 0) + (mod ?? 0) + der.penalty;

  const patch = (p: Partial<Skill>) =>
    update((d) => ({ ...d, skills: d.skills.map((x, j) => (j === i ? { ...x, ...p } : x)) }));

  /** Changing the type also fills an empty Check Type with the rule default (Evade for attacks…). */
  const setType = (value: string) => {
    const [category, subtype = ''] = value.split(':');
    const check = defaultCheckType(category, subtype);
    patch({
      category: isCategory(category) ? category : '',
      subtype,
      ...(!s.checkType.trim() && check ? { checkType: t(`check.${check}` as MsgKey) } : {}),
    });
  };

  /** When a known skill name is typed into a row without a subtype, sort it automatically. */
  const autoClassify = () => {
    if (locked || s.subtype) return;
    const known = classifySkill(s.name);
    if (!known || (s.category && s.category !== known[0])) return;
    setType(`${known[0]}:${known[1]}`);
  };

  const value = s.category && isValidType(s.category, s.subtype) ? `${s.category}:${s.subtype}` : '';

  return (
    <div className="list-row">
      <div className="skills-cols">
        <div onBlur={autoClassify}>
          <Input path={['skills', i, 'name']} ariaLabel={t('skills.name')} placeholder={t('skills.phSkill')} />
        </div>
        <select
          className="in sel type-sel"
          value={value}
          disabled={locked}
          aria-label={t('skills.type')}
          onChange={(e) => setType(e.target.value)}
        >
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
        </select>
        <div className="rank-cell">
          <Input path={['skills', i, 'rank']} ariaLabel={t('skills.rank')} placeholder={t('skills.rank')} center />
          <RankBadge rank={s.rank} />
        </div>
        <StatMod statPath={['skills', i, 'stat']} legacyPath={['skills', i, 'statMod']} label={t('skills.statMod')} />
        <Input
          path={['skills', i, 'checkType']}
          ariaLabel={t('skills.checkType')}
          placeholder={t('skills.checkType')}
        />
        <Input path={['skills', i, 'notes']} ariaLabel={t('skills.notes')} placeholder={t('skills.notes')} />
        <output className="roll-total center" title={t('skills.totalHint')}>
          {total === null ? '' : `d20 ${signed(total)}`}
        </output>
        <Check path={['skills', i, 'done']} label={t('skills.checked')} />
      </div>
      {!locked && (
        <button
          type="button"
          className="row-del"
          title={t('list.remove')}
          aria-label={t('list.remove')}
          onClick={() => update((d) => ({ ...d, skills: d.skills.filter((_, j) => j !== i) }))}
        >
          ×
        </button>
      )}
    </div>
  );
}
