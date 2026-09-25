import { Area, Check, Input, Section, useSheet } from './fields';
import { HealthTrack, ListRows, Portrait } from './widgets';
import {
  STATS,
  emptyAttack,
  emptyItem,
  emptySkill,
  signed,
  sumNumbers,
  type Attack,
  type Item,
  type SheetData,
  type Skill,
} from '../lib/sheet';

/* ---------------- Page 1: Core ---------------- */
export function CoreTab() {
  const { data } = useSheet();
  const dexMod = data.evade.dexMod || data.stats.dex.mod;
  const evadeTotal = sumNumbers(dexMod, data.evade.buffs);
  const drTotal = sumNumbers(data.dr.armor, data.dr.buffs);

  return (
    <div className="core-grid">
      <Section title="Crawler" className="span-identity">
        <div className="identity">
          <div className="identity-fields">
            <Input path={['name']} label="Name" className="w-name" big />
            <Input path={['race']} label="Race" />
            <Input path={['gender']} label="Gender / Pronouns" />
            <Input path={['class']} label="Class" />
            <Input path={['level']} label="Level" numeric center />
            <Input path={['crawlerNumber']} label="Crawler #" center />
            <Input path={['floor']} label="Floor" numeric center />
          </div>
          <Portrait />
        </div>
        <div className="sub-lbl">Health</div>
        <HealthTrack path={['health']} />
      </Section>

      <Section title="Stats" className="span-stats">
        <div className="stats">
          {STATS.map((s) => (
            <div className="stat" key={s.key}>
              <div className="stat-name">{s.label}</div>
              <div className="stat-split">
                <Input path={['stats', s.key, 'enhanced']} label="Enhanced" center numeric />
                <span className="slash">/</span>
                <Input path={['stats', s.key, 'unenhanced']} label="Unenhanced" center numeric />
              </div>
              <Input path={['stats', s.key, 'mod']} label={`${s.short} Mod`} center className="stat-mod" />
            </div>
          ))}
        </div>
      </Section>

      <Section title="Defense" className="span-defense">
        <div className="formula">
          <div className="formula-name">
            Evade <span className="dim">d20 +</span>
          </div>
          <div className="formula-row">
            <label className="field">
              <span className="lbl">DEX Mod</span>
              <DexModInput placeholder={data.stats.dex.mod} />
            </label>
            <span className="op">+</span>
            <Input path={['evade', 'buffs']} label="Buffs" className="grow" />
            <span className="op eq">=</span>
            <div className="field total">
              <span className="lbl">Evade Total</span>
              <output className="total-val">{evadeTotal === null ? '—' : `d20 ${signed(evadeTotal)}`}</output>
            </div>
          </div>
          <div className="formula-extra">
            <Input path={['evade', 'move']} label="Move" center />
            <Input path={['evade', 'step']} label="Step" center />
          </div>
        </div>
        <div className="formula">
          <div className="formula-name">Damage Resistance</div>
          <div className="formula-row">
            <Input path={['dr', 'armor']} label="Armor" center />
            <span className="op">+</span>
            <Input path={['dr', 'buffs']} label="Buffs" className="grow" />
            <span className="op eq">=</span>
            <div className="field total">
              <span className="lbl">DR Total</span>
              <output className="total-val">{drTotal === null ? '—' : drTotal}</output>
            </div>
          </div>
          <div className="formula-extra">
            <Input path={['dr', 'aiFavor']} label="AI Favor" center />
            <Input path={['dr', 'size']} label="Size" center />
          </div>
        </div>
      </Section>

      <Section title="Mana & Buffs" className="span-mana">
        <div className="mana">
          <div className="field">
            <span className="lbl">Mana (current / max)</span>
            <div className="mana-pair">
              <Input path={['manaCurrent']} ariaLabel="Current mana" center big numeric />
              <span className="slash">/</span>
              <Input path={['manaMax']} ariaLabel="Max mana" center big numeric />
            </div>
          </div>
          <Area path={['debuffs']} label="Debuffs" rows={2} />
        </div>
        <div className="sub-lbl">External Buffs (max 3)</div>
        <ol className="numbered">
          {[0, 1, 2].map((i) => (
            <li key={i}>
              <Input path={['externalBuffs', i]} ariaLabel={`External buff ${i + 1}`} />
            </li>
          ))}
        </ol>
      </Section>

      <Section title="Attacks" className="span-attacks">
        <ListRows<Attack>
          path={['attacks']}
          make={emptyAttack}
          addLabel="Add attack"
          className="attacks"
          header={
            <div className="list-head attacks-cols">
              <span>Name</span>
              <span>To Hit (Rank + Stat Mod)</span>
              <span>Damage (Dice + Stat Mod)</span>
              <span>Effects</span>
            </div>
          }
        >
          {(i) => (
            <div className="attacks-cols">
              <Input path={['attacks', i, 'name']} ariaLabel="Attack name" placeholder="Attack" />
              <div className="pair">
                <Input path={['attacks', i, 'rank']} ariaLabel="Rank" placeholder="Rank" center />
                <span className="op">+</span>
                <Input path={['attacks', i, 'statMod']} ariaLabel="To hit stat mod" placeholder="Mod" center />
              </div>
              <div className="pair">
                <Input path={['attacks', i, 'dice']} ariaLabel="Damage dice" placeholder="Dice" center />
                <span className="op">+</span>
                <Input path={['attacks', i, 'dmgMod']} ariaLabel="Damage stat mod" placeholder="Mod" center />
              </div>
              <Input path={['attacks', i, 'effects']} ariaLabel="Effects" placeholder="Effects" />
            </div>
          )}
        </ListRows>
      </Section>
    </div>
  );
}

/** DEX mod on the Evade line: falls back to the Dexterity stat mod when left empty. */
function DexModInput({ placeholder }: { placeholder: string }) {
  const { data, set, locked } = useSheet();
  return (
    <input
      className="in center"
      value={data.evade.dexMod}
      readOnly={locked}
      placeholder={placeholder || ''}
      title="Leave empty to use your Dexterity mod"
      onChange={(e) => set(['evade', 'dexMod'], e.target.value)}
    />
  );
}

/* ---------------- Page 2: Gear & Hotlist ---------------- */
const GEAR: [keyof SheetData['gear'], string, number][] = [
  ['head', 'Head', 1],
  ['torso', 'Torso', 1],
  ['arms', 'Arms', 1],
  ['hands', 'Hands / Holding', 2],
  ['legs', 'Legs', 1],
  ['feet', 'Feet', 1],
  ['accessories', 'Accessories (max 10)', 6],
];

export function GearTab() {
  return (
    <div className="gear-grid">
      <Section title="Hotlist" tone="red" className="span-full">
        <div className="hotlist">
          {Array.from({ length: 10 }, (_, i) => (
            <Area key={i} path={['hotlist', i]} rows={3} placeholder={`Slot ${i + 1}`} />
          ))}
        </div>
      </Section>
      <Section title="Gear Slots / Tattoos / Patches" className="span-gear">
        <div className="gear">
          {GEAR.map(([key, label, rows]) => (
            <Area key={key} path={['gear', key]} label={label} rows={rows} />
          ))}
        </div>
      </Section>
      <div className="side-notes">
        <Section title="Popularity">
          <Area path={['popularity']} rows={2} />
        </Section>
        <Section title="Past Trauma">
          <Area path={['pastTrauma']} rows={3} />
        </Section>
        <Section title="Loose Ends">
          <Area path={['looseEnds']} rows={3} />
        </Section>
        <Section title="Regrets">
          <Area path={['regrets']} rows={3} />
        </Section>
        <Section title="Notes">
          <Area path={['notes']} rows={5} />
        </Section>
      </div>
    </div>
  );
}

/* ---------------- Page 3: Skills ---------------- */
export function SkillsTab() {
  return (
    <Section title="Skills">
      <ListRows<Skill>
        path={['skills']}
        make={emptySkill}
        addLabel="Add skill"
        className="skills"
        header={
          <div className="list-head skills-cols">
            <span>Name</span>
            <span>Rank</span>
            <span>Stat &amp; Mod</span>
            <span>Check Type</span>
            <span>Notes &amp; Upgrades</span>
            <span className="center">✔</span>
          </div>
        }
      >
        {(i) => (
          <div className="skills-cols">
            <Input path={['skills', i, 'name']} ariaLabel="Skill name" placeholder="Skill" />
            <Input path={['skills', i, 'rank']} ariaLabel="Rank" placeholder="Rank" center />
            <Input path={['skills', i, 'statMod']} ariaLabel="Stat and mod" placeholder="Stat" center />
            <Input path={['skills', i, 'checkType']} ariaLabel="Check type" placeholder="Check type" />
            <Input path={['skills', i, 'notes']} ariaLabel="Notes and upgrades" placeholder="Notes & upgrades" />
            <Check path={['skills', i, 'done']} label="Checked" />
          </div>
        )}
      </ListRows>
    </Section>
  );
}

/* ---------------- Page 4: Inventory ---------------- */
export function InventoryTab() {
  return (
    <Section title="Inventory">
      <ListRows<Item>
        path={['inventory']}
        make={emptyItem}
        addLabel="Add item"
        className="inventory"
        header={
          <div className="list-head inv-cols">
            <span>Item</span>
            <span className="center">Qty</span>
            <span>Notes</span>
          </div>
        }
      >
        {(i) => (
          <div className="inv-cols">
            <Input path={['inventory', i, 'item']} ariaLabel="Item" placeholder="Item" />
            <Input path={['inventory', i, 'qty']} ariaLabel="Quantity" placeholder="Qty" center numeric />
            <Input path={['inventory', i, 'notes']} ariaLabel="Notes" placeholder="Notes" />
          </div>
        )}
      </ListRows>
    </Section>
  );
}

/* ---------------- Page 5: Companions & the rest ---------------- */
export function CompanionsTab() {
  return (
    <div className="comp-grid">
      <div className="col">
        <Section title="Pet">
          <Input path={['pet', 'name']} label="Name" />
          <div className="sub-lbl">Health</div>
          <HealthTrack path={['pet', 'health']} rows={2} />
          <div className="pet-stats">
            <div className="kv-col">
              {STATS.map((s) => (
                <Input key={s.key} path={['pet', 'stats', s.key]} label={s.label} center className="kv" />
              ))}
            </div>
            <div className="kv-col">
              <Input path={['pet', 'level']} label="Level" center className="kv" />
              <Input path={['pet', 'dr']} label="DR" center className="kv" />
              <Input path={['pet', 'evade']} label="Evade" center className="kv" />
              <Input path={['pet', 'move']} label="Move" center className="kv" />
              <Input path={['pet', 'size']} label="Size" center className="kv" />
            </div>
          </div>
          <Input path={['pet', 'attack1']} label="Attack" className="kv wide" />
          <Input path={['pet', 'attack2']} label="Attack" className="kv wide" />
          <Area path={['pet', 'special']} label="Special" rows={2} />
        </Section>
        <Section title="Mount / Vehicle">
          <Input path={['mount', 'name']} label="Name" />
          <div className="sub-lbl">Health</div>
          <HealthTrack path={['mount', 'health']} rows={2} />
          <div className="mount-grid">
            <Input path={['mount', 'size']} label="Size" />
            <Input path={['mount', 'move']} label="Move" center />
            <Input path={['mount', 'occupants']} label="Occupants" />
            <Input path={['mount', 'dr']} label="DR" center />
          </div>
          <Area path={['mount', 'accessories']} label="Accessories" rows={3} />
        </Section>
      </div>
      <div className="col">
        <Section title="Important Things I've Killed">
          <ListRows<string> path={['kills']} make={() => ''} addLabel="Add kill" className="simple">
            {(i) => <Input path={['kills', i]} ariaLabel={`Kill ${i + 1}`} placeholder="…" />}
          </ListRows>
        </Section>
        <Section title="Clubs, Societies, Guilds, etc.">
          <ListRows<string> path={['clubs']} make={() => ''} addLabel="Add club" className="simple">
            {(i) => <Input path={['clubs', i]} ariaLabel={`Club ${i + 1}`} placeholder="…" />}
          </ListRows>
        </Section>
      </div>
      <div className="col">
        <Section title="Personal Space">
          <Input path={['personalSpace', 'tier']} label="Tier" className="kv wide" />
          <Input path={['personalSpace', 'size']} label="Size" className="kv wide" />
          <Area path={['personalSpace', 'amenities']} label="Amenities" rows={6} />
        </Section>
        <Section title="Deity">
          <Area path={['deity']} rows={5} />
        </Section>
      </div>
    </div>
  );
}

/* ---------------- Page 6: Abilities & Sponsors ---------------- */
export function AbilitiesTab() {
  return (
    <div className="abil-grid">
      <Section title="Racial Abilities">
        <Area path={['racialAbilities']} rows={14} />
      </Section>
      <Section title="Class Abilities">
        <Area path={['classAbilities']} rows={14} />
      </Section>
      <div className="col">
        {[0, 1, 2].map((i) => (
          <Section key={i} title={`Sponsor ${i + 1}`}>
            <Area path={['sponsors', i]} rows={4} />
          </Section>
        ))}
      </div>
    </div>
  );
}
