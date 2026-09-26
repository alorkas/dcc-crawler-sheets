import { Area, Input, Section, useSheet } from './fields';
import { ListRows, Portrait } from './widgets';
import { AutoNumber, DebuffPanel, HealthBar, HealthTools, ManaTools, useStatMod } from './rulesWidgets';
import { MAX_ACCESSORIES, annotateDamage, damageExpr, num, pinnedAttacks, statModFromScore } from '../lib/rules';
import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fillItem, lookup } from '../lib/catalog';
import { api } from '../lib/api';
import { useAuth } from '../lib/auth';
import { CastButton } from './SkillsTab';
import { RollButton } from './RollButton';
import { useI18n, type MsgKey } from '../lib/i18n';
import { STATS, emptyItem, signed, type Item, type SheetData, type StatKey } from '../lib/sheet';

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
        <PinnedAttacks />
      </Section>
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
  );
}

/** "Melee" + "Melee (5 ft)" → "Melee (5 ft)"; otherwise "Ranged · 100 feet". */
function rangeText(type: string, range: string): string {
  if (!range.trim()) return type;
  if (!type || range.toLowerCase().startsWith(type.toLowerCase())) return range;
  return `${type} · ${range}`;
}

function PinnedRow({ i, der, onEdit }: { i: number; der: ReturnType<typeof useSheet>['der']; onEdit: () => void }) {
  const { data } = useSheet();
  const { t } = useI18n();
  const s = data.skills[i];
  const mod = useStatMod(s.stat, s.statMod);
  const rank = num(s.rank);
  const toHit = rank === null && mod === null ? null : (rank ?? 0) + (mod ?? 0) + der.penalty;
  const statLbl = s.stat && s.stat !== 'none' ? t(`stat.${s.stat}.short` as MsgKey) : '';
  const spell = s.category === 'spell';
  const dmgExpr = s.baseDamage ? damageExpr(s.baseDamage, der, data.floor) : null;
  const typeLbl = s.subtype
    ? t(`skillsub.${s.category}.${s.subtype}` as MsgKey)
    : t(`skillcat.${s.category}` as MsgKey);
  return (
    <div className={`pinned-cols pinned-row ${spell ? 'is-spell' : ''}`}>
      <div className="pin-name">
        <button type="button" className="pin-link" onClick={onEdit} title={t('pin.edit')}>
          {s.name || t('skills.phSkill')}
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
          <RollButton
            expr={`d20${signed(toHit)}`}
            text={`d20 ${signed(toHit)}`}
            label={t('roll.toHit', { name: s.name || t('skills.phSkill') })}
            className="pin-roll"
          />
        )}
        <span className="dim tiny">
          {[rank !== null && `${t('skills.rank')} ${rank}`, statLbl && mod !== null && `${statLbl} ${signed(mod)}`]
            .filter(Boolean)
            .join(' · ')}
        </span>
      </div>
      <div className="pin-dmg">
        {s.baseDamage ? annotateDamage(s.baseDamage, der) : '—'}
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
        {spell && s.manaCost && <span className="pill">{t('skill.sumMana', { n: s.manaCost })}</span>}
        {spell && <CastButton i={i} compact />}
      </div>
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

/* ---------------- Page 3: Skills (see SkillsTab.tsx) ---------------- */
export { SkillsTab } from './SkillsTab';

/* ---------------- Page 4: Inventory ---------------- */
export function InventoryTab() {
  const { t } = useI18n();
  return (
    <Section title={t('inv.title')}>
      <ItemNameList />
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
            <span />
          </div>
        }
      >
        {(i) => <InventoryRow i={i} />}
      </ListRows>
    </Section>
  );
}

function InventoryRow({ i }: { i: number }) {
  const { data, locked, update } = useSheet();
  const { t } = useI18n();
  const [msg, setMsg] = useState('');
  const it = data.inventory[i];
  const fill = async () => {
    setMsg('');
    try {
      const hit = await lookup(it.item, 'item');
      if (!hit) return setMsg(t('fill.notFound'));
      const changes = fillItem(it, hit);
      if (!changes.notes) return setMsg(t('fill.nothing'));
      update((d) => ({
        ...d,
        inventory: d.inventory.map((x, j) => (j === i ? { ...x, ...fillItem(x, hit) } : x)),
      }));
    } catch {
      setMsg(t('err.generic'));
    }
  };
  return (
    <div className="inv-cols">
      <Input path={['inventory', i, 'item']} ariaLabel={t('inv.item')} placeholder={t('inv.item')} list="item-names" />
      <Input path={['inventory', i, 'qty']} ariaLabel={t('inv.quantity')} placeholder={t('inv.qty')} center numeric />
      <div>
        <Input path={['inventory', i, 'notes']} ariaLabel={t('inv.notes')} placeholder={t('inv.notes')} />
        {msg && <span className="dim tiny">{msg}</span>}
      </div>
      {!locked && it.item.trim() ? (
        <button type="button" className="btn small ghost book-btn" onClick={fill} title={t('fill.hintItem')}>
          {t('fill.short')}
        </button>
      ) : (
        <span />
      )}
    </div>
  );
}

/** Item suggestions for the GM only (players shouldn't see every item in the books). */
function ItemNameList() {
  const { user } = useAuth();
  const [names, setNames] = useState<string[]>([]);
  useEffect(() => {
    if (!user?.isAdmin) return;
    api
      .fullCatalog()
      .then((c) => setNames(c.items.map((e) => e.name).sort()))
      .catch(() => {});
  }, [user?.isAdmin]);
  return (
    <datalist id="item-names">
      {names.map((n) => (
        <option key={n} value={n} />
      ))}
    </datalist>
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
