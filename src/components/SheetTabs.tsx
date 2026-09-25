import { Area, Check, Input, Section, useSheet } from './fields';
import { ListRows, Portrait } from './widgets';
import {
  AdvancementPanel,
  AutoNumber,
  DebuffPanel,
  HealthBar,
  HealthTools,
  ManaTools,
  RankBadge,
  StatMod,
  useStatMod,
} from './rulesWidgets';
import { MAX_ACCESSORIES, num, statModFromScore } from '../lib/rules';
import { useI18n, type MsgKey } from '../lib/i18n';
import {
  STATS,
  emptyAttack,
  emptyItem,
  emptySkill,
  signed,
  type Attack,
  type Item,
  type SheetData,
  type Skill,
  type StatKey,
} from '../lib/sheet';

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
        <HealthTools />
      </Section>

      <Section title={t('core.stats')} className="span-stats">
        <div className="stats">
          {STATS.map((s) => (
            <div className="stat" key={s.key}>
              <div className="stat-name">{t(statLabel(s.key))}</div>
              <div className="stat-split">
                <Input path={['stats', s.key, 'enhanced']} label={t('core.enhanced')} center numeric />
                <span className="slash">/</span>
                <Input path={['stats', s.key, 'unenhanced']} label={t('core.unenhanced')} center numeric />
              </div>
              <AutoNumber
                path={['stats', s.key, 'mod']}
                auto={der.modAuto[s.key]}
                label={t('core.statMod', { stat: t(statShort(s.key)) })}
                format={(n) => signed(n)}
                className="stat-mod"
              />
              {s.key === 'str' && der.liftLbs !== null && (
                <div className="dim tiny">{t('core.lift', { n: der.liftLbs })}</div>
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
              <output className="total-val">{der.evadeTotal === null ? '—' : `d20 ${signed(der.evadeTotal)}`}</output>
            </div>
          </div>
          <div className="formula-extra">
            <Input path={['evade', 'move']} label={t('core.move')} center />
            <Input path={['evade', 'step']} label={t('core.step')} center />
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
        <ListRows<Attack>
          path={['attacks']}
          make={emptyAttack}
          addLabel={t('atk.add')}
          className="attacks"
          header={
            <div className="list-head attacks-cols">
              <span>{t('atk.name')}</span>
              <span>{t('atk.toHit')}</span>
              <span>{t('atk.damage')}</span>
              <span>{t('atk.effects')}</span>
            </div>
          }
        >
          {(i) => <AttackRow i={i} />}
        </ListRows>
      </Section>
    </div>
  );
}

function AttackRow({ i }: { i: number }) {
  const { data, der } = useSheet();
  const { t } = useI18n();
  const a = data.attacks[i];
  const hitMod = useStatMod(a.hitStat, a.statMod);
  const rank = num(a.rank);
  const toHit = rank === null && hitMod === null ? null : (rank ?? 0) + (hitMod ?? 0) + der.penalty;
  return (
    <div className="attacks-cols">
      <Input path={['attacks', i, 'name']} ariaLabel={t('atk.name')} placeholder={t('atk.phAttack')} />
      <div className="pair">
        <Input path={['attacks', i, 'rank']} ariaLabel={t('atk.phRank')} placeholder={t('atk.phRank')} center />
        <span className="op">+</span>
        <StatMod statPath={['attacks', i, 'hitStat']} legacyPath={['attacks', i, 'statMod']} label={t('atk.hitMod')} />
        <output className="roll-total" title={t('atk.toHitTotal')}>
          {toHit === null ? '' : `d20 ${signed(toHit)}`}
        </output>
      </div>
      <div className="pair">
        <Input path={['attacks', i, 'dice']} ariaLabel={t('atk.phDice')} placeholder={t('atk.phDice')} center />
        <span className="op">+</span>
        <StatMod statPath={['attacks', i, 'dmgStat']} legacyPath={['attacks', i, 'dmgMod']} label={t('atk.dmgMod')} />
      </div>
      <Input path={['attacks', i, 'effects']} ariaLabel={t('atk.effects')} placeholder={t('atk.effects')} />
    </div>
  );
}

/* ---------------- Page 2: Gear & Hotlist ---------------- */
const GEAR: [keyof SheetData['gear'], MsgKey, number][] = [
  ['head', 'gear.head', 1],
  ['torso', 'gear.torso', 1],
  ['arms', 'gear.arms', 1],
  ['hands', 'gear.hands', 2],
  ['legs', 'gear.legs', 1],
  ['feet', 'gear.feet', 1],
  ['accessories', 'gear.accessories', 6],
];

export function GearTab() {
  const { t } = useI18n();
  const { data } = useSheet();
  const accCount = data.gear.accessories.split('\n').filter((l) => l.trim()).length;
  return (
    <div className="gear-grid">
      <Section title={t('gear.hotlist')} tone="red" className="span-full">
        <div className="dim tiny">{t('gear.hotlistHint')}</div>
        <div className="hotlist">
          {Array.from({ length: 10 }, (_, i) => (
            <Area key={i} path={['hotlist', i]} rows={3} placeholder={t('gear.slot', { n: i + 1 })} />
          ))}
        </div>
      </Section>
      <Section title={t('gear.title')} className="span-gear">
        <div className="gear">
          {GEAR.map(([key, label, rows]) => (
            <Area
              key={key}
              path={['gear', key]}
              label={
                key === 'accessories' ? (
                  <>
                    {t(label)}{' '}
                    <span className={accCount > MAX_ACCESSORIES ? 'count warn' : 'count'}>
                      {accCount}/{MAX_ACCESSORIES}
                    </span>
                  </>
                ) : (
                  t(label)
                )
              }
              rows={rows}
              placeholder={key === 'accessories' ? t('gear.oneLine') : undefined}
            />
          ))}
        </div>
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

/* ---------------- Page 3: Skills ---------------- */
export function SkillsTab() {
  const { t } = useI18n();
  return (
    <div className="skills-page">
      <Section title={t('skills.title')}>
        <ListRows<Skill>
          path={['skills']}
          make={emptySkill}
          addLabel={t('skills.add')}
          className="skills"
          header={
            <div className="list-head skills-cols">
              <span>{t('skills.name')}</span>
              <span>{t('skills.rank')}</span>
              <span>{t('skills.statMod')}</span>
              <span>{t('skills.checkType')}</span>
              <span>{t('skills.notes')}</span>
              <span className="center">{t('skills.total')}</span>
              <span className="center" title={t('skills.markHint')}>
                ✔
              </span>
            </div>
          }
        >
          {(i) => <SkillRow i={i} />}
        </ListRows>
      </Section>
      <Section title={t('adv.section')}>
        <AdvancementPanel />
      </Section>
    </div>
  );
}

function SkillRow({ i }: { i: number }) {
  const { data, der } = useSheet();
  const { t } = useI18n();
  const s = data.skills[i];
  const mod = useStatMod(s.stat, s.statMod);
  const rank = num(s.rank);
  const passive = s.stat === 'none';
  const total = passive || (rank === null && mod === null) ? null : (rank ?? 0) + (mod ?? 0) + der.penalty;
  return (
    <div className="skills-cols">
      <Input path={['skills', i, 'name']} ariaLabel={t('skills.name')} placeholder={t('skills.phSkill')} />
      <div className="rank-cell">
        <Input path={['skills', i, 'rank']} ariaLabel={t('skills.rank')} placeholder={t('skills.rank')} center />
        <RankBadge rank={s.rank} />
      </div>
      <StatMod statPath={['skills', i, 'stat']} legacyPath={['skills', i, 'statMod']} label={t('skills.statMod')} />
      <Input path={['skills', i, 'checkType']} ariaLabel={t('skills.checkType')} placeholder={t('skills.checkType')} />
      <Input path={['skills', i, 'notes']} ariaLabel={t('skills.notes')} placeholder={t('skills.notes')} />
      <output className="roll-total center" title={t('skills.totalHint')}>
        {total === null ? '' : `d20 ${signed(total)}`}
      </output>
      <Check path={['skills', i, 'done']} label={t('skills.checked')} />
    </div>
  );
}

/* ---------------- Page 4: Inventory ---------------- */
export function InventoryTab() {
  const { t } = useI18n();
  return (
    <Section title={t('inv.title')}>
      <ListRows<Item>
        path={['inventory']}
        make={emptyItem}
        addLabel={t('inv.add')}
        className="inventory"
        header={
          <div className="list-head inv-cols">
            <span>{t('inv.item')}</span>
            <span className="center">{t('inv.qty')}</span>
            <span>{t('inv.notes')}</span>
          </div>
        }
      >
        {(i) => (
          <div className="inv-cols">
            <Input path={['inventory', i, 'item']} ariaLabel={t('inv.item')} placeholder={t('inv.item')} />
            <Input
              path={['inventory', i, 'qty']}
              ariaLabel={t('inv.quantity')}
              placeholder={t('inv.qty')}
              center
              numeric
            />
            <Input path={['inventory', i, 'notes']} ariaLabel={t('inv.notes')} placeholder={t('inv.notes')} />
          </div>
        )}
      </ListRows>
    </Section>
  );
}

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
