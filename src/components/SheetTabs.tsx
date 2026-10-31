import { useState } from 'react';
import { KillCounters } from './Kills';
import { Area, Input, Section, useSheet } from './fields';
import { ListRows, Portrait } from './widgets';
import { EffectsPanel } from './Status';
import { SheetQuickItems } from './QuickItems';
import { AutoNumber, DebuffPanel, HealButton, HealthBar, HealthTools, ManaTools, useStatMod } from './rulesWidgets';
import { annotateDamage, damageExpr, num, pinnedAttacks, statModFromScore } from '../lib/rules';
import { useSearchParams } from 'react-router-dom';
import { CastButton } from './SkillsTab';
import { RollButton } from './RollButton';
import { damageBonusFor, isSpellRef, spellRef, weaponFor } from '../../shared/items.js';
import {
  effectRankDice,
  effectSpec,
  effectsFor,
  rankUpgrades,
  upgradeDice,
  withEffectDice,
  type EffectSpec,
} from '../../shared/skillRules.js';
import { useLiveOptional } from '../lib/live';
import { HotlistSlots } from './Inventory';
import { AttackRollButton, CombatTargetBar, TargetProvider } from './CombatAttack';
import { AssignStatPoints } from './AssignStatPoints';
import { useI18n, type MsgKey } from '../lib/i18n';
import { useNamesEs } from '../lib/namesEs';
import { STATS, signed, type SheetData, type StatKey } from '../lib/sheet';

const statLabel = (k: StatKey) => `stat.${k}` as MsgKey;
const statShort = (k: StatKey) => `stat.${k}.short` as MsgKey;

/* ---------------- Page 1: Core ---------------- */
export function CoreTab() {
  const { der } = useSheet();
  const { t } = useI18n();

  return (
    <div className="core-grid">
      <Section title={t('core.crawler')} className="span-identity">
        <div className="identity">
          <div className="identity-fields">
            <Input path={['name']} label={t('core.name')} className="w-name" big />
            <Input path={['race']} label={t('core.race')} />
            <Input path={['gender']} label={t('core.gender')} />
            <Input path={['class']} label={t('core.class')} />
            <Input path={['level']} label={t('core.level')} numeric center />
            <Input path={['crawlerNumber']} label={t('core.crawlerNo')} center />
            <Input path={['floor']} label={t('core.floor')} numeric center />
          </div>
          <Portrait />
        </div>
        <div className="sub-lbl">{t('core.health')}</div>
        <HealthBar lostPath={['hbLost']} slotValue={der.slotValue} />
        <QuickHeal />
        <HealthTools />
      </Section>

      <Section title={t('core.stats')} className="span-stats">
        <AssignStatPoints compact />
        <div className="stats">
          {STATS.map((s) => (
            <div className="stat" key={s.key}>
              <div className="stat-name">{t(statLabel(s.key))}</div>
              <div className="stat-split">
                <label className="field" title={t('core.enhancedHint')}>
                  <span className="lbl">{t('core.enhanced')}</span>
                  <input
                    className={`in center computed ${der.gearStats[s.key].total ? 'boosted' : ''}`}
                    value={der.score[s.key] ?? ''}
                    readOnly
                    tabIndex={-1}
                    aria-label={t('core.enhanced')}
                  />
                </label>
                <span className="slash">/</span>
                <Input path={['stats', s.key, 'unenhanced']} label={t('core.unenhanced')} center numeric />
              </div>
              {der.gearStats[s.key].total !== 0 && (
                <div
                  className="dim tiny gear-stat"
                  title={der.gearStats[s.key].from.map((f) => `${f.name} ${signed(f.value)}`).join(', ')}
                >
                  {t('gear.statFrom', {
                    list: der.gearStats[s.key].from.map((f) => `${f.name} ${signed(f.value)}`).join(', '),
                  })}
                </div>
              )}
              <AutoNumber
                path={['stats', s.key, 'mod']}
                auto={der.modAuto[s.key]}
                label={t('core.statMod', { stat: t(statShort(s.key)) })}
                format={(n) => signed(n)}
                className="stat-mod"
              />
              {der.mods[s.key] !== null && (
                <RollButton
                  expr={`d20${signed((der.mods[s.key] ?? 0) + der.penalty)}`}
                  text={t('core.statCheck')}
                  stat
                  label={t('core.statCheckOf', { stat: t(statLabel(s.key)) })}
                  className="stat-check"
                />
              )}
              {s.key === 'str' && der.liftKg !== null && (
                <div className="dim tiny">{t('core.lift', { n: der.liftKg })}</div>
              )}
            </div>
          ))}
        </div>
      </Section>

      <Section title={t('core.defense')} className="span-defense">
        <div className="formula">
          <div className="formula-name">
            {t('core.evade')} <span className="dim">d20 +</span>
          </div>
          <div className="formula-row">
            <AutoNumber
              path={['evade', 'dexMod']}
              auto={der.mods.dex}
              label={t('core.dexMod')}
              format={(n) => signed(n)}
            />
            <span className="op">+</span>
            <Input path={['evade', 'buffs']} label={t('core.buffs')} className="grow" />
            <span className="op eq">=</span>
            <div className="field total">
              <span className="lbl">{t('core.evadeTotal')}</span>
              {der.evadeTotal === null ? (
                <output className="total-val">—</output>
              ) : (
                <RollButton
                  expr={`d20${signed(der.evadeTotal)}`}
                  text={`d20 ${signed(der.evadeTotal)}`}
                  label={t('core.evade')}
                  className="total-val evade-roll"
                />
              )}
            </div>
          </div>
          <GearBreakdown from={der.gearEvade.from} />
          <div className="formula-extra">
            <div className="field">
              <span className="lbl">{t('core.move')}</span>
              <AutoNumber
                path={['evade', 'move']}
                auto={der.moveAuto}
                ariaLabel={t('core.move')}
                format={(n) => `${n} ft`}
              />
              {der.moveMod !== null && (
                <span className="dim tiny">{t('core.moveMod', { n: signed(der.moveMod) })}</span>
              )}
            </div>
            <div className="field">
              <span className="lbl">{t('core.step')}</span>
              <AutoNumber
                path={['evade', 'step']}
                auto={der.stepAuto}
                ariaLabel={t('core.step')}
                format={(n) => `${n} ft`}
              />
              <span className="dim tiny">{t('core.stepHint')}</span>
            </div>
          </div>
          {(der.penalty !== 0 || der.moveEffective !== der.move) && (
            <div className="penalty-note">
              {der.penalty !== 0 && t('core.penaltyNote', { n: der.penalty })}
              {der.moveEffective !== der.move && ' ' + t('core.moveHalved', { n: der.moveEffective ?? 0 })}
            </div>
          )}
        </div>
        <div className="formula">
          <div className="formula-name">{t('core.dr')}</div>
          <div className="formula-row">
            <Input path={['dr', 'armor']} label={t('core.armor')} center />
            <span className="op">+</span>
            <Input path={['dr', 'buffs']} label={t('core.buffs')} className="grow" />
            <span className="op eq">=</span>
            <div className="field total">
              <span className="lbl">{t('core.drTotal')}</span>
              <output className="total-val">{der.drTotal === null ? '—' : der.drTotal}</output>
            </div>
          </div>
          <GearBreakdown from={der.gearDr.from} />
          <div className="formula-extra">
            <Input path={['dr', 'aiFavor']} label={t('core.aiFavor')} center />
            <Input path={['dr', 'size']} label={t('core.size')} center />
          </div>
        </div>
      </Section>

      <Section title={t('core.manaBuffs')} className="span-mana">
        <div className="mana">
          <div className="field">
            <span className="lbl">{t('core.mana')}</span>
            <div className="mana-pair">
              <Input path={['manaCurrent']} ariaLabel={t('core.manaCurrent')} center big numeric />
              <span className="slash">/</span>
              <AutoNumber
                path={['manaMax']}
                auto={der.manaMaxAuto}
                ariaLabel={t('core.manaMax')}
                big
                className="grow1"
              />
            </div>
            <ManaTools />
          </div>
          <DebuffPanel />
          <EffectsPanel />
        </div>
        <div className="sub-lbl">{t('core.extBuffs')}</div>
        <ol className="numbered">
          {[0, 1, 2].map((i) => (
            <li key={i}>
              <Input path={['externalBuffs', i]} ariaLabel={t('core.extBuff', { n: i + 1 })} />
            </li>
          ))}
        </ol>
      </Section>

      <Section title={t('core.attacks')} className="span-attacks">
        <QuickHeal />
        <PinnedAttacks />
        <HotlistSpells />
        <SheetQuickItems />
      </Section>
    </div>
  );
}

/** Heal is always at hand (it never needs a Hotlist slot). */
function QuickHeal() {
  const { t } = useI18n();
  return (
    <div className="quick-heal">
      <span className="quick-heal-icon" aria-hidden>
        ✚
      </span>
      <HealButton className="btn small primary" />
      <span className="dim tiny">{t('heal.always')}</span>
    </div>
  );
}

/** Spells on the Hotlist (the ones that can be cast in combat), in Hotlist order. */
function HotlistSpells() {
  const { data } = useSheet();
  const { t } = useI18n();
  const es = useNamesEs();
  const spells = data.hotSlots
    .map((id, slot) => ({ id, slot }))
    .filter(({ id }) => isSpellRef(id))
    .map(({ id, slot }) => ({
      slot,
      i: data.skills.findIndex((s) => s.category === 'spell' && spellRef(s.name) === id),
    }))
    .filter(({ i }) => i >= 0);
  if (!spells.length) return null;
  return (
    <div className="quick-items hot-spells">
      <div className="lbl">✦ {t('hot.spellsTitle')}</div>
      <ul>
        {spells.map(({ slot, i }) => {
          const sk = data.skills[i];
          const attack = sk.pinned;
          return (
            <li key={slot}>
              <span className="grow" title={sk.effect || sk.description}>
                <strong>{es(sk.name) || sk.name}</strong>{' '}
                <span className="dim tiny">
                  · {t('gear.slot', { n: slot + 1 })}
                  {sk.manaCost && ` · ${t('skill.sumMana', { n: sk.manaCost })}`}
                  {attack && ` · ${t('hot.spellAttackHint')}`}
                </span>
              </span>
              {!attack && <CastButton i={i} compact />}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function PinnedAttacks() {
  const { data, der } = useSheet();
  const { t } = useI18n();
  const [, setParams] = useSearchParams();
  const pinned = pinnedAttacks(data);
  const goToSkills = () => setParams({ tab: 'skills' }, { replace: true });
  if (pinned.length === 0) {
    return (
      <div className="pinned-empty">
        <p className="dim small">{t('pin.empty')}</p>
        <button type="button" className="btn small ghost" onClick={goToSkills}>
          {t('pin.goToSkills')}
        </button>
      </div>
    );
  }
  return (
    <TargetProvider>
      <CombatTargetBar />
      <div className="list pinned">
        <div className="list-head pinned-cols">
          <span>{t('atk.name')}</span>
          <span>{t('pin.toHit')}</span>
          <span>{t('skill.baseDamage')}</span>
          <span>{t('skill.range')}</span>
          <span>{t('atk.effects')}</span>
          <span />
        </div>
        {pinned.map((i) => (
          <PinnedRow key={i} i={i} der={der} onEdit={goToSkills} />
        ))}
        <p className="dim tiny">{t('pin.hint')}</p>
      </div>
    </TargetProvider>
  );
}

/**
 * Aiming for this attack: the crawler's Aiming Ranks and how many d4 it adds, when the attack is a Ranged Attack
 * (a ranged Skill or weapon, or a Spell with a range beyond Melee). Null when it doesn't apply.
 */
function aimingFor(data: SheetData, s: SheetData['skills'][number]): { rank: number; dice: number } | null {
  const sk = data.skills.find((x) => /^(aiming|apuntar)$/i.test(x.name.trim()));
  const rank = num(sk?.rank ?? '') ?? 0;
  if (rank < 1 || sk === s) return null;
  const range = s.range.trim();
  const rangedSpell =
    s.category === 'spell' && /\d/.test(range) && !/melee|cuerpo|touch|toque|self|personal/i.test(range);
  const rangedWeapon = !!weaponFor(data.inventory, s.name)?.ranged;
  if (s.attackType !== 'ranged' && !rangedSpell && !rangedWeapon) return null;
  return { rank, dice: 1 + (rank >= 5 ? 1 : 0) + (rank >= 10 ? 1 : 0) + (rank >= 15 ? 1 : 0) };
}

/** "Melee" + "Melee (5 ft)" → "Melee (5 ft)"; otherwise "Ranged · 100 feet". */
function rangeText(type: string, range: string): string {
  if (!range.trim()) return type;
  if (!type || range.toLowerCase().startsWith(type.toLowerCase())) return range;
  return `${type} · ${range}`;
}

/** What a chosen Damage Effect does, in one line: × base dice, × total under a Health Bar %, Debuffs, cooldown. */
function FxSummary({ spec }: { spec: EffectSpec }) {
  const { t } = useI18n();
  const added = [...spec.add, ...(spec.flat ? [String(spec.flat)] : [])];
  const rank = effectRankDice(spec);
  const bits = [
    !spec.stunInstead && added.length > 0 && t('fx.addBase', { dice: added.join('+') }),
    !spec.stunInstead && rank && t('fx.addRank', { dice: rank }),
    spec.addStr && t('fx.addStr'),
    spec.stunInstead && t('fx.stunned'),
    spec.multBase > 1 && t('fx.multBase', { n: spec.multBase }),
    spec.multTotal > 1 && t('fx.multTotal', { n: spec.multTotal, pct: spec.atOrBelow ?? 100 }),
    spec.debuffs.length > 0 && spec.debuffs.map((x) => t(`debuff.${x}` as MsgKey)).join(', '),
    spec.tossFeet > 0 && t('fx.toss', { ft: spec.tossFeet }),
    spec.note === 'critFailPopularity' && t('fx.critFailPopularity'),
    spec.cooldownHours > 0 && t('fx.cooldown', { h: spec.cooldownHours }),
    spec.oncePerRound && t('fx.oncePerRound'),
  ].filter(Boolean);
  return bits.length ? <div className="dim tiny fx-summary">{bits.join(' · ')}</div> : null;
}

function PinnedRow({ i, der, onEdit }: { i: number; der: ReturnType<typeof useSheet>['der']; onEdit: () => void }) {
  const { data, update } = useSheet();
  const live = useLiveOptional();
  const { t } = useI18n();
  const es = useNamesEs();
  const s = data.skills[i];
  const mod = useStatMod(s.stat, s.statMod);
  const rank = num(s.rank);
  const toHit = rank === null && mod === null ? null : (rank ?? 0) + (mod ?? 0) + der.penalty;
  const statLbl = s.stat && s.stat !== 'none' ? t(`stat.${s.stat}.short` as MsgKey) : '';
  const spell = s.category === 'spell';
  const gearDmg = damageBonusFor(data.inventory, s.name, spell);
  // Rank upgrades of the Attack Skill (Pugilism R5 +2d2, Crossbow R5 +1d8…), applied on their own
  const up = upgradeDice(rankUpgrades(s));
  const sheetExpr = s.baseDamage ? damageExpr(s.baseDamage, der, data.floor) : null;
  const baseExpr = sheetExpr && up.base ? `${sheetExpr}+${up.base}` : sheetExpr;
  // Overcharge: cheap spells take extra Mana, one more damage die per point (up to the spell's level)
  const [extra, setExtra] = useState(0);
  const die = s.baseDamage.match(/\d*d(\d+)/i)?.[1];
  const maxExtra = spell && s.overcharge && die ? Math.max(0, rank ?? 0) : 0;
  const boost = Math.min(extra, maxExtra);
  const withBoost = baseExpr && boost ? `${baseExpr}+${boost}d${die}` : baseExpr;
  const gearExpr = withBoost && gearDmg.total ? `${withBoost}${signed(gearDmg.total)}` : withBoost;
  // Aiming (passive Skill): a Ranged Attack made with Disadvantage adds the Aiming Ranks to hit and 1d4 damage
  // (+1d4 at Ranks 5, 10 and 15)
  const aim = aimingFor(data, s);
  const [aimed, setAimed] = useState(false);
  const aiming = !!aim && aimed;
  // hand-to-hand Damage Effects that go with this Attack Skill (Iron Punch on Pugilism…)
  const effects = effectsFor(data.skills, s);
  const [effName, setEffName] = useState('');
  const [sameSize, setSameSize] = useState(true);
  const [stunInstead, setStunInstead] = useState(false);
  const now = live?.world?.gameHours ?? 0;
  const effSkill = effects.find((x) => x.name === effName) ?? null;
  const spec = effSkill
    ? effectSpec(effSkill, { sameSize, stunInstead, now, readyAt: num(effSkill.readyAt ?? '') ?? 0 })
    : null;
  const fx = spec?.usable ? spec : null;
  const strMod = der.mods.str ?? 0;
  const fxExpr = fx && gearExpr ? withEffectDice(gearExpr, fx, fx.addStr ? strMod : 0) : gearExpr;
  const fxRank = fx ? effectRankDice(fx) : '';
  const withFx = fxExpr && fxRank ? `${fxExpr}+${fxRank}` : fxExpr;
  const withAim = aiming && withFx ? `${withFx}+${aim.dice}d4` : withFx;
  const dmgExpr = withAim && up.rank ? `${withAim}+${up.rank}` : withAim;
  // in a fight the server adds the Damage Effect and the Rank dice itself (Critical Hits double only the base dice)
  const attackBase = gearExpr && aiming ? `${gearExpr}+${aim.dice}d4` : gearExpr;
  // a Damage Effect with a cooldown (Powerful Strike) starts it on the game clock when used out of combat
  const startCooldown = () => {
    if (!fx?.cooldownHours || !effSkill) return;
    update((d) => ({
      ...d,
      skills: d.skills.map((x) => (x.name === effSkill.name ? { ...x, readyAt: String(now + fx.cooldownHours) } : x)),
    }));
  };
  const cost = spell ? num(s.manaCost) : null;
  const typeLbl = s.subtype
    ? t(`skillsub.${s.category}.${s.subtype}` as MsgKey)
    : t(`skillcat.${s.category}` as MsgKey);
  return (
    <div className={`pinned-cols pinned-row ${spell ? 'is-spell' : ''}`}>
      <div className="pin-name">
        <button
          type="button"
          className="pin-link"
          onClick={onEdit}
          title={[es(s.name) && s.name, t('pin.edit')].filter(Boolean).join(' · ')}
        >
          {es(s.name) || s.name || t('skills.phSkill')}
        </button>
        <span className="dim tiny">
          {typeLbl}
          {s.cooldown && ` · ${t('skill.sumCooldown', { v: s.cooldown })}`}
        </span>
      </div>
      <div className="pin-hit">
        {toHit === null ? (
          <strong>—</strong>
        ) : (
          <AttackRollButton
            expr={`d20${signed(toHit + (aiming ? aim.rank : 0))}`}
            text={`d20 ${signed(toHit + (aiming ? aim.rank : 0))}`}
            label={t(aiming ? 'roll.toHitAimed' : 'roll.toHit', { name: s.name || t('skills.phSkill') })}
            name={s.name || t('skills.phSkill')}
            damage={dmgExpr}
            damageBase={attackBase}
            damageRank={up.rank}
            manaCost={cost !== null ? cost + boost : null}
            spell={spell}
            aimed={aiming}
            effect={fx ? { name: fx.name, opts: { sameSize, stunInstead } } : null}
            strMod={strMod}
            onPlainRoll={fx?.cooldownHours ? startCooldown : undefined}
            className="pin-roll"
          />
        )}
        {effects.length > 0 && toHit !== null && (
          <div className="fx-pick">
            <select
              className="in sel tiny-sel"
              value={effName}
              aria-label={t('fx.label')}
              title={t('fx.hint')}
              onChange={(e) => setEffName(e.target.value)}
            >
              <option value="">{t('fx.none')}</option>
              {effects.map((x) => {
                const sp = effectSpec(x, { now, readyAt: num(x.readyAt ?? '') ?? 0 });
                return (
                  <option key={x.name} value={x.name} disabled={!sp.usable}>
                    {es(x.name) || x.name} ({x.rank})
                    {sp.why === 'cooldown' ? ` · ${t('fx.cooldownLeft', { h: sp.waitHours ?? 0 })}` : ''}
                  </option>
                );
              })}
            </select>
            {fx?.sameSize && (
              <label className="gm-check tiny">
                <input type="checkbox" checked={sameSize} onChange={(e) => setSameSize(e.target.checked)} />
                {t('fx.sameSize')}
              </label>
            )}
            {fx?.canStunInstead && (
              <label className="gm-check tiny">
                <input type="checkbox" checked={stunInstead} onChange={(e) => setStunInstead(e.target.checked)} />
                {t('fx.stunInstead')}
              </label>
            )}
            {fx && <FxSummary spec={fx} />}
          </div>
        )}
        {aim && toHit !== null && (
          <button
            type="button"
            className={`btn small ghost aim-toggle ${aiming ? 'on' : ''}`}
            aria-pressed={aiming}
            title={t('aim.hint', { rank: aim.rank, dice: `${aim.dice}d4` })}
            onClick={() => setAimed(!aimed)}
          >
            🎯 {t('aim.label')}
            {aiming && ` +${aim.rank} · +${aim.dice}d4 · ▼`}
          </button>
        )}
        <span className="dim tiny">
          {[rank !== null && `${t('skills.rank')} ${rank}`, statLbl && mod !== null && `${statLbl} ${signed(mod)}`]
            .filter(Boolean)
            .join(' · ')}
        </span>
      </div>
      <div className="pin-dmg">
        {s.baseDamage ? annotateDamage(s.baseDamage, der) : '—'}
        {(up.base || up.rank) && (
          <span className="dim tiny rank-up">
            {' '}
            {t('skill.rankUpDmg', { dice: [up.base, up.rank].filter(Boolean).join('+') })}
          </span>
        )}
        {maxExtra > 0 && (
          <span className="overcharge" title={t('overcharge.hint', { n: maxExtra })}>
            <button
              type="button"
              className="icon-btn tiny-btn"
              aria-label={t('overcharge.less')}
              disabled={boost <= 0}
              onClick={() => setExtra(boost - 1)}
            >
              −
            </button>
            <span className={boost ? 'on' : 'dim'}>⚡{boost ? ` +${boost}d${die}` : ''}</span>
            <button
              type="button"
              className="icon-btn tiny-btn"
              aria-label={t('overcharge.more')}
              disabled={boost >= maxExtra}
              onClick={() => setExtra(boost + 1)}
            >
              +
            </button>
          </span>
        )}
        {gearDmg.total !== 0 && (
          <span
            className="dim tiny gear-dmg"
            title={gearDmg.from.map((f) => `${f.name} ${signed(f.value)}`).join(', ')}
          >
            {' '}
            {t('gear.dmgBonus', { n: signed(gearDmg.total), list: gearDmg.from.map((f) => f.name).join(', ') })}
          </span>
        )}
        {dmgExpr && (
          <RollButton
            expr={dmgExpr}
            text={t('roll.damage')}
            label={t('roll.damageOf', { name: s.name || t('skills.phSkill') })}
            className="dmg-roll"
          />
        )}
      </div>
      <div className="pin-range">
        {rangeText(s.attackType ? t(`skill.${s.attackType}` as MsgKey) : '', s.range) || '—'}
      </div>
      <div className="pin-fx">
        {s.effect || '—'}
        {s.limitations && <div className="dim tiny">{s.limitations}</div>}
      </div>
      <div className="pin-cast">
        {spell && s.manaCost && (
          <span className="pill">{t('skill.sumMana', { n: boost ? `${s.manaCost}+${boost}` : s.manaCost })}</span>
        )}
        {spell && <CastButton i={i} compact />}
      </div>
    </div>
  );
}

/** "incl. gear: Plate +3, Ring +1" under a total that includes equipped item bonuses. */
function GearBreakdown({ from }: { from: { name: string; value: number }[] }) {
  const { t } = useI18n();
  if (!from.length) return null;
  return (
    <div className="dim tiny gear-breakdown">
      {t('gear.includes', { list: from.map((f) => `${f.name} ${signed(f.value)}`).join(', ') })}
    </div>
  );
}

/* ---------------- Page 2: Gear & Hotlist ---------------- */

export function GearTab() {
  const { t } = useI18n();
  return (
    <div className="gear-grid">
      <Section title={t('gear.hotlist')} tone="red" className="span-full">
        <div className="dim tiny">{t('gear.hotlistHint')}</div>
        <HotlistSlots />
      </Section>
      <div className="side-notes">
        <Section title={t('gear.popularity')}>
          <Area path={['popularity']} rows={2} />
        </Section>
        <Section title={t('gear.pastTrauma')}>
          <Area path={['pastTrauma']} rows={3} />
        </Section>
        <Section title={t('gear.looseEnds')}>
          <Area path={['looseEnds']} rows={3} />
        </Section>
        <Section title={t('gear.regrets')}>
          <Area path={['regrets']} rows={3} />
        </Section>
        <Section title={t('gear.notes')}>
          <Area path={['notes']} rows={5} />
        </Section>
      </div>
    </div>
  );
}

/* ---------------- Page 3: Skills (see SkillsTab.tsx) ---------------- */
export { SkillsTab } from './SkillsTab';

/* ---------------- Page 4: Inventory (see Inventory.tsx) ---------------- */
export { InventoryTab } from './Inventory';
export { EquipmentTab } from './Equipment';

/* ---------------- Page 5: Companions & the rest ---------------- */
export function CompanionsTab() {
  const { t } = useI18n();
  const { data } = useSheet();
  const petSlot = statModFromScore(num(data.pet.stats.con));
  return (
    <div className="comp-grid">
      <div className="col">
        <Section title={t('pet.title')}>
          <Input path={['pet', 'name']} label={t('pet.name')} />
          <div className="sub-lbl">{t('core.health')}</div>
          <HealthBar lostPath={['pet', 'hbLost']} slotValue={petSlot} rows={2} />
          <div className="pet-stats">
            <div className="kv-col">
              {STATS.map((s) => (
                <Input key={s.key} path={['pet', 'stats', s.key]} label={t(statLabel(s.key))} center className="kv" />
              ))}
            </div>
            <div className="kv-col">
              <Input path={['pet', 'level']} label={t('core.level')} center className="kv" />
              <Input path={['pet', 'dr']} label={t('pet.dr')} center className="kv" />
              <Input path={['pet', 'evade']} label={t('core.evade')} center className="kv" />
              <Input path={['pet', 'move']} label={t('core.move')} center className="kv" />
              <Input path={['pet', 'size']} label={t('core.size')} center className="kv" />
            </div>
          </div>
          <Input path={['pet', 'attack1']} label={t('pet.attack')} className="kv wide" />
          <Input path={['pet', 'attack2']} label={t('pet.attack')} className="kv wide" />
          <Area path={['pet', 'special']} label={t('pet.special')} rows={2} />
        </Section>
        <Section title={t('mount.title')}>
          <Input path={['mount', 'name']} label={t('pet.name')} />
          <div className="sub-lbl">{t('core.health')}</div>
          <Input path={['mount', 'hbSlot']} label={t('mount.hbSlot')} center className="kv wide" />
          <HealthBar lostPath={['mount', 'hbLost']} slotValue={num(data.mount.hbSlot)} rows={2} />
          <div className="mount-grid">
            <Input path={['mount', 'size']} label={t('core.size')} />
            <Input path={['mount', 'move']} label={t('core.move')} center />
            <Input path={['mount', 'occupants']} label={t('mount.occupants')} />
            <Input path={['mount', 'dr']} label={t('pet.dr')} center />
          </div>
          <Area path={['mount', 'accessories']} label={t('mount.accessories')} rows={3} />
        </Section>
      </div>
      <div className="col">
        <Section title={t('killc.title')}>
          <KillCounters />
        </Section>
        <Section title={t('kills.title')}>
          <ListRows<string> path={['kills']} make={() => ''} addLabel={t('kills.add')} className="simple">
            {(i) => <Input path={['kills', i]} ariaLabel={t('kills.item', { n: i + 1 })} placeholder="…" />}
          </ListRows>
        </Section>
        <Section title={t('clubs.title')}>
          <ListRows<string> path={['clubs']} make={() => ''} addLabel={t('clubs.add')} className="simple">
            {(i) => <Input path={['clubs', i]} ariaLabel={t('clubs.item', { n: i + 1 })} placeholder="…" />}
          </ListRows>
        </Section>
      </div>
      <div className="col">
        <Section title={t('space.title')}>
          <Input path={['personalSpace', 'tier']} label={t('space.tier')} className="kv wide" />
          <Input path={['personalSpace', 'size']} label={t('core.size')} className="kv wide" />
          <Area path={['personalSpace', 'amenities']} label={t('space.amenities')} rows={6} />
        </Section>
        <Section title={t('deity.title')}>
          <Area path={['deity']} rows={5} />
        </Section>
      </div>
    </div>
  );
}

/* ---------------- Page 6: Abilities & Sponsors ---------------- */
export function AbilitiesTab() {
  const { t } = useI18n();
  return (
    <div className="abil-grid">
      <Section title={t('abil.racial')}>
        <Area path={['racialAbilities']} rows={14} />
      </Section>
      <Section title={t('abil.class')}>
        <Area path={['classAbilities']} rows={14} />
      </Section>
      <div className="col">
        {[0, 1, 2].map((i) => (
          <Section key={i} title={t('abil.sponsor', { n: i + 1 })}>
            <Area path={['sponsors', i]} rows={4} />
          </Section>
        ))}
      </div>
    </div>
  );
}
