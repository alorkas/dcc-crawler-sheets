// Character creation data and logic (Core Rulebook ch.3 "First Steps" / Crawlers & Customization).
// Everything here is from the public character-creation chapter of the player books.
import { ammoTypeFor, newSheet, statModFromScore } from './rules';
import { spellRef } from '../../shared/items.js';
import { emptyItem, emptySkill, type Item, type SheetData, type Skill, type StatKey, type StatSel } from './sheet';
import { classifySkill } from './skillTypes';
import { fillSkill } from './catalog';
import type { CatalogHit } from './api';

export type BgSkill = { name: string; stat: StatSel };
export type Background = { id: string; name: string; skills: [BgSkill, BgSkill, BgSkill] };
export type BgTable = { id: string; rank: number; die: number; backgrounds: Background[] };

const sk = (spec: string): BgSkill => {
  const m = spec.match(/^(.*) \((Str|Int|Con|Dex|Cha|None)\)$/);
  if (!m) throw new Error(`bad skill spec ${spec}`);
  return { name: m[1], stat: m[2].toLowerCase() as StatSel };
};
const table = (id: string, rank: number, rows: [string, string, string, string][]): BgTable => ({
  id,
  rank,
  die: rows.length,
  backgrounds: rows.map(([name, a, b, c]) => ({
    id: name.toLowerCase().replace(/[^a-z]+/g, '-'),
    name,
    skills: [sk(a), sk(b), sk(c)],
  })),
});

/* ---------------- human backgrounds (Tables 12–15) ---------------- */

export const HUMAN_TABLES: BgTable[] = [
  table('childhood', 1, [
    ['Latchkey Kid', 'Streetwise (Cha)', 'Perception (Int)', 'Stealth (Dex)'],
    ['Crafty Kid', 'Fabricate (Int)', 'Repair (Int)', 'Salvage (Int)'],
    ['Excitable Kid', 'Escape Artist (Dex)', 'Endurance (Con)', 'Running (Dex)'],
    ['Gymnast', 'Endurance (Con)', 'Jumping (Str)', 'Performance (Cha)'],
    ['Military Brat', 'Deception (Cha)', 'Streetwise (Cha)', 'Tactics (Int)'],
    ['MMO Kid', 'Fabricate (Int)', 'Engineering (Int)', 'Tactics (Int)'],
    ['Only Child', 'Good First Impression (Cha)', 'Investigation (Int)', 'Negotiation (Cha)'],
    ['Outdoor Kid', 'Animal Handling (Cha)', 'Climbing (Str)', 'Swimming (Str)'],
    ['Problem Child', 'Intimidate (Str)', 'Deception (Cha)', 'Pugilism (Dex)'],
    ['Scamp', 'Hide in Shadows (Dex)', 'Jumping (Str)', 'Throwing (Str)'],
    ['Teacher’s Pet', 'Catcher (None)', 'Perception (Int)', 'Good First Impression (Cha)'],
    ['Wild Child', 'Stealth (Dex)', 'Survival (Con)', 'Running (Dex)'],
  ]),
  table('adolescence', 1, [
    ['Family Farm', 'Animal Handling (Cha)', 'Fabricate (Int)', 'Tracking (Int)'],
    ['Drama Nerd', 'Fabricate (Int)', 'Deception (Cha)', 'Performance (Cha)'],
    ['Drop-Out', 'Chopper Pilot (Dex)', 'Streetwise (Cha)', 'Survival (Con)'],
    ['Greek Life', 'Negotiation (Cha)', 'Intimidate (Str)', 'Taunt (Cha)'],
    ['Influencer', 'Negotiation (Cha)', 'Persuasion (Cha)', 'Performance (Cha)'],
    ['Jock', 'Endurance (Con)', 'Jumping (Str)', 'Throwing (Str)'],
    ['McJob', 'Determine Value (None)', 'Negotiation (Cha)', 'Repair (Int)'],
    ['Popular', 'Good First Impression (Cha)', 'Perception (Int)', 'Persuasion (Cha)'],
    ['Religious', 'Catcher (None)', 'First Aid (Int)', 'Persuasion (Cha)'],
    ['Student Government', 'Deception (Cha)', 'Persuasion (Cha)', 'Investigation (Int)'],
    ['Nerd', 'Investigation (Int)', 'Repair (Int)', 'Fabricate (Int)'],
    ['Weirdo', 'Streetwise (Cha)', 'Intimidate (Str)', 'Fabricate (Int)'],
  ]),
  table('career', 3, [
    ['Criminal', 'Deception (Cha)', 'Stealth (Dex)', 'Streetwise (Cha)'],
    ['Service Industry', 'Dagger (Dex)', 'Endurance (Con)', 'Sleight of Hand (Dex)'],
    ['Small Business Owner', 'Determine Value (None)', 'Negotiation (Cha)', 'Perception (Int)'],
    ['Medical', 'Sleight of Hand (Dex)', 'Detect Lies (Int)', 'First Aid (Int)'],
    ['Law Enforcement', 'Detect Lies (Int)', 'Handgun (Dex)', 'Investigation (Int)'],
    ['Gig Worker', 'Driving (Dex)', 'Escape Artist (Str)', 'Negotiation (Cha)'],
    ['Teacher', 'Detect Lies (Int)', 'Perception (Int)', 'Performance (Int)'],
    ['Office Drone', 'Dumpster Diving (Int)', 'Endurance (Con)', 'Investigation (Int)'],
    ['Entertainer', 'Deception (Cha)', 'Good First Impression (Cha)', 'Performance (Cha)'],
    ['Unhoused', 'Dumpster Diving (Int)', 'Streetwise (Cha)', 'Survival (Con)'],
    ['Middle Manager', 'Deception (Cha)', 'Intimidate (Str)', 'Negotiation (Cha)'],
    ['Military', 'Handgun (Dex)', 'Survival (Con)', 'Tactics (Int)'],
  ]),
  table('hobby', 2, [
    ['Collector', 'Fabricate (Int)', 'Determine Value (None)', 'Investigation (Int)'],
    ['Cosplay', 'Fabricate (Int)', 'Performance (Cha)', 'Salvage (Int)'],
    ['Drinker', 'Deception (Cha)', 'Intimidate (Str)', 'Streetwise (Cha)'],
    ['Gamer', 'Aiming (Dex)', 'Perception (Int)', 'Tactics (Int)'],
    ['Gym Rat', 'Running (Dex)', 'Endurance (Con)', 'Swimming (Str)'],
    ['Hunting', 'Tracking (Int)', 'Shotgun (Dex)', 'Stealth (Dex)'],
    ['Music', 'Perception (Int)', 'Performance (Cha)', 'Sleight of Hand (Dex)'],
    ['Motorsports', 'Driving (Dex)', 'Repair (Int)', 'Salvage (Int)'],
    ['Climber', 'Climbing (Str)', 'Jumping (Str)', 'Endurance (Con)'],
    ['Pop Culture', 'Determine Value (None)', 'Investigation (Int)', 'Perception (Int)'],
    ['Tinkering', 'Engineering (Int)', 'Repair (Int)', 'Salvage (Int)'],
    ['Travel', 'Endurance (Con)', 'Negotiation (Cha)', 'Streetwise (Cha)'],
  ]),
];

/* ---------------- animal backgrounds (Tables 16–19) ---------------- */

export const ANIMAL_TABLES: BgTable[] = [
  table('youth', 1, [
    ['Abandoned', 'Hide in Shadows (Dex)', 'Endurance (Con)', 'Survival (Con)'],
    ['Farmed', 'Escape Artist (Dex)', 'Climbing (Str)', 'Light on Your Feet (Dex)'],
    ['Litter-Raised', 'Animal Handling (Cha)', 'Detect Lies (Int)', 'Back Claw (Str)'],
    ['Pampered', 'Negotiation (Cha)', 'Good First Impression (Cha)', 'Persuasion (Cha)'],
    ['Runt', 'Hide in Shadows (Dex)', 'Escape Artist (Dex)', 'Stealth (Dex)'],
    ['Stray', 'Back Claw (Str)', 'Streetwise (Cha)', 'Survival (Con)'],
  ]),
  table('training', 1, [
    ['Clever', 'Investigation (Int)', 'Detect Lies (Int)', 'Dodge (None)'],
    ['Free Range', 'Escape Artist (Dex)', 'Survival (Con)', 'Tracking (Int)'],
    ['Pack Mentality', 'Animal Handling (Cha)', 'Persuasion (Cha)', 'Tactics (Int)'],
    ['Mischievous', 'Deception (Cha)', 'Persuasion (Cha)', 'Sleight of Hand (Dex)'],
    ['Watcher', 'Ambush (Int)', 'Investigation (Int)', 'Perception (Int)'],
    ['Well-Trained', 'Light on Your Feet (Dex)', 'Catcher (None)', 'Performance (Cha)'],
  ]),
  table('adult', 3, [
    ['Guard', 'Catcher (None)', 'Perception (Int)', 'Taunt (Cha)'],
    ['Pile of Floof', 'Escape Artist (Dex)', 'Deception (Cha)', 'Persuasion (Cha)'],
    ['Scrapper', 'Light on Your Feet (Dex)', 'Streetwise (Cha)', 'Survival (Con)'],
    ['Show Animal', 'Good First Impression (Cha)', 'Light on Your Feet (Dex)', 'Performance (Cha)'],
    ['Support Animal', 'Determine Value (None)', 'First Aid (Int)', 'Perception (Int)'],
    ['Working', 'Animal Handling (Cha)', 'Endurance (Con)', 'Perception (Int)'],
  ]),
  table('quirk', 2, [
    ['Chow Hound', 'Dumpster Diving (Int)', 'Investigation (Int)', 'Intimidate (Str)'],
    ['Cuddly', 'Good First Impression (Cha)', 'Persuasion (Cha)', 'Negotiation (Cha)'],
    ['Curious', 'Climbing (Str)', 'Perception (Int)', 'Swimming (Str)'],
    ['Hunter', 'Hide in Shadows (Dex)', 'Stealth (Dex)', 'Tracking (Int)'],
    ['Playful', 'Persuasion (Cha)', 'Dodge (None)', 'Intimidate (Str)'],
    ['Social', 'Animal Handling (Cha)', 'Taunt (Cha)', 'Perception (Int)'],
  ]),
];

/** Table 21: animal crawler sizes. */
export const ANIMAL_SIZES = [
  { size: 1, name: 'Tiny', example: 'Scatterer, Rat' },
  { size: 2, name: 'Small', example: 'Cat, Raccoon' },
  { size: 3, name: 'Petite', example: 'Dog, Boar' },
  { size: 4, name: 'Medium', example: 'Chimpanzee, Wolf' },
];

/* ---------------- Step 2: weapons ---------------- */

export const STARTER_WEAPONS: { group: 'bashing' | 'edged' | 'ranged' | 'reach'; names: string[] }[] = [
  { group: 'bashing', names: ['Club', 'Improvised Weapons', 'Warhammer'] },
  { group: 'edged', names: ['Axe', 'Dagger', 'Longsword', 'Rapier'] },
  { group: 'ranged', names: ['Bow', 'Crossbow', 'Handgun', 'Shotgun', 'Javelin', 'Shuriken', 'Slingshot'] },
  { group: 'reach', names: ['Herding Weapons', 'Polearm', 'Quarterstaff'] },
];

/** Low-Mana attack spells you may start with instead of a weapon (needs Intelligence 4+). */
export const STARTER_SPELLS = [
  'Dirt Clod',
  'Fire Fingers',
  'Frost Scar',
  'Mind Tickle',
  'Shock Treatment',
  'Soul Collector',
  'Vine Porn',
];

export const HAND_TO_HAND: { skill: string; effect: string }[] = [
  { skill: 'Pugilism', effect: 'Iron Punch' },
  { skill: 'Foot Soldier', effect: 'Smush' },
  { skill: 'Noggin Nocker', effect: 'Skullcracker' },
  { skill: 'Wrasslin’', effect: 'Toss' },
];

/* ---------------- Step 10: starting gear examples ---------------- */

export const GEAR_KITS = [
  {
    id: 'athlete',
    clothing: 'Jogging attire',
    weapon: 'Barbell (Club)',
    item: 'Headphones, music player',
    weird: 'A 3-pack of condoms',
  },
  {
    id: 'geek',
    clothing: 'T-shirt, hoodie and jeans',
    weapon: 'Boffer sword (Longsword, d4 base damage)',
    item: 'Game book or novel',
    weird: 'A pack of 12 googly eyes and a single Lego minifig',
  },
  {
    id: 'militant',
    clothing: 'Military fatigues',
    weapon: 'Handgun',
    item: '2 snack bars',
    weird: 'A morale patch: “No Plan Survives First Contact”',
  },
  {
    id: 'outdoorsy',
    clothing: 'Climate-appropriate clothes and an orange safety jacket',
    weapon: 'Bow and arrow',
    item: 'Lighter',
    weird: 'A duck call on a leather cord',
  },
];

/* ---------------- choices & building the sheet ---------------- */

export type Combat =
  | { kind: 'weapon'; skill: string; label: string } // label: e.g. "Tire Iron (Club)"
  | { kind: 'spell'; skill: string }
  | { kind: 'hand'; skill: string; effect: string };

export type Choices = {
  name: string;
  gender: string;
  crawlerNumber: string;
  animal: boolean;
  species: string; // for animal crawlers
  size: number;
  /** per background table: chosen background id and the two picked skill names */
  backgrounds: Record<string, { bg: string; picks: string[] }>;
  combat: Combat | null;
  statMethod: 'array' | 'roll';
  stats: Record<StatKey, number | null>;
  gear: { clothing: string; weapon: string; item: string; weird: string };
  /** Starting on the Third Floor (Core Rulebook "Character Creation: Third Floor & Beyond"); null = First Floor. */
  third: ThirdFloor | null;
};

export type LootTier = 'bronze' | 'silver' | 'gold' | 'platinum';
export type LootSlot = 'weapon' | 'armor' | 'item' | 'consumable';
export type ThirdFloor = {
  /** Extra Skill Ranks rolled per skill name (2d4 for the main attack, 1d4 for the rest, max Rank 10). */
  boosts: Record<string, number> | null;
  /** 27 points spread over the Stats (added to Unenhanced, so to Enhanced too). */
  points: Record<StatKey, number>;
  /** AI Favor rating of the main Weapon/Spell (0–2) and the AI Favor rolled. */
  favorRating: 0 | 1 | 2;
  favor: number | null;
  /** Table 25 row (1–4) and which of weapon/armor/item are taken as Spells instead. */
  lootRow: number | null;
  spells: Record<'weapon' | 'armor' | 'item', boolean>;
  /** Six Tutorial Floor Experiences (rolled table + what happened). */
  experiences: { table: number | null; text: string }[];
  race: string;
  cls: string;
};
export const THIRD_STAT_POINTS = 27;
/** Table 25: the tier of each Starting Loot slot, by row. */
export const LOOT_ROWS: Record<LootSlot, LootTier>[] = [
  { weapon: 'platinum', armor: 'gold', item: 'silver', consumable: 'bronze' },
  { weapon: 'bronze', armor: 'platinum', item: 'gold', consumable: 'silver' },
  { weapon: 'silver', armor: 'bronze', item: 'platinum', consumable: 'gold' },
  { weapon: 'gold', armor: 'silver', item: 'bronze', consumable: 'platinum' },
];
export const LOOT_SLOTS: LootSlot[] = ['weapon', 'armor', 'item', 'consumable'];
/** DR of the Starting Loot armor by tier. */
export const LOOT_ARMOR_DR: Record<LootTier, number> = { bronze: 1, silver: 2, gold: 3, platinum: 4 };

export function emptyThird(): ThirdFloor {
  return {
    boosts: null,
    points: { str: 0, int: 0, con: 0, dex: 0, cha: 0 },
    favorRating: 0,
    favor: null,
    lootRow: null,
    spells: { weapon: false, armor: false, item: false },
    experiences: Array.from({ length: 6 }, () => ({ table: null, text: '' })),
    race: '',
    cls: '',
  };
}

/** The skills the new crawler will have (name and starting Rank), the main attack first among the combat ones. */
export function startingSkills(c: Choices): { name: string; rank: number; main: boolean }[] {
  const out = [{ name: c.animal ? 'Slice Attack' : 'Unarmed Combat', rank: 3, main: false }];
  if (c.combat?.kind === 'weapon') out.push({ name: c.combat.label.trim() || c.combat.skill, rank: 3, main: true });
  else if (c.combat?.kind === 'spell') out.push({ name: c.combat.skill, rank: 3, main: true });
  else if (c.combat?.kind === 'hand') {
    out.push({ name: c.combat.skill, rank: 3, main: true });
    out.push({ name: c.combat.effect, rank: 3, main: false });
  }
  for (const p of pickedSkills(c)) out.push({ name: p.name, rank: p.rank, main: false });
  out.push({ name: 'Heal', rank: 1, main: false });
  return out;
}

/** Roll the Tutorial Floor Skill Ranks: 2d4 on the main attack, 1d4 on each other skill (Rank 10 at most). */
export function rollBoosts(c: Choices): Record<string, number> {
  const out: Record<string, number> = {};
  for (const sk of startingSkills(c)) {
    if (sk.name === 'Heal') continue; // "Rank 1 maximum"
    const add = sk.main ? roll(4) + roll(4) : roll(4);
    out[sk.name] = Math.max(0, Math.min(10, sk.rank + add) - sk.rank);
  }
  return out;
}

/** AI Favor for a Third Floor crawler: 1d2, plus 1d2 per point of the main attack's AI Favor rating. */
export const rollFavor = (rating: number) =>
  Array.from({ length: 1 + rating }, () => roll(2)).reduce((a, b) => a + b, 0);

export const thirdPointsUsed = (t: ThirdFloor) => STAT_KEYS.reduce((sum, k) => sum + (t.points[k] || 0), 0);

export const STANDARD_ARRAY = [2, 3, 4, 5, 6];
export const STAT_KEYS: StatKey[] = ['str', 'int', 'con', 'dex', 'cha'];

export function emptyChoices(): Choices {
  return {
    name: '',
    gender: '',
    crawlerNumber: '',
    animal: false,
    species: '',
    size: 2,
    backgrounds: {},
    combat: null,
    statMethod: 'array',
    stats: { str: null, int: null, con: null, dex: null, cha: null },
    gear: { clothing: '', weapon: '', item: '', weird: '' },
    third: null,
  };
}

export const tablesFor = (c: Choices) => (c.animal ? ANIMAL_TABLES : HUMAN_TABLES);

/** Random int in [1, n] using the crypto RNG. */
export function roll(n: number): number {
  const b = new Uint32Array(1);
  crypto.getRandomValues(b);
  return (b[0] % n) + 1;
}

/** "For simplicity, choose a number between 500,000 and 12,900,000." */
export const randomCrawlerNumber = () => String(500_000 + roll(12_400_001) - 1);

/** Roll 1d6 per Stat, rerolling 1s. */
export const rollStat = () => {
  let r = roll(6);
  while (r === 1) r = roll(6);
  return r;
};

/** Background skills picked so far, in table order (the same skill can't come from two backgrounds). */
export function pickedSkills(c: Choices): { name: string; stat: StatSel; rank: number; table: string }[] {
  const out: { name: string; stat: StatSel; rank: number; table: string }[] = [];
  for (const tb of tablesFor(c)) {
    const sel = c.backgrounds[tb.id];
    const bg = tb.backgrounds.find((b) => b.id === sel?.bg);
    if (!bg) continue;
    for (const p of sel.picks) {
      const s = bg.skills.find((x) => x.name === p);
      if (s) out.push({ ...s, rank: tb.rank, table: tb.id });
    }
  }
  return out;
}

export type StepIssue =
  'basics' | 'backgrounds' | 'duplicate' | 'combat' | 'combatDuplicate' | 'stats' | 'spellInt' | 'third';

/** What still blocks each step (empty = ok). */
export function validate(c: Choices): StepIssue[] {
  const issues: StepIssue[] = [];
  if (!c.name.trim() || (c.animal && !c.species.trim())) issues.push('basics');
  const tables = tablesFor(c);
  if (tables.some((tb) => c.backgrounds[tb.id]?.picks.length !== 2)) issues.push('backgrounds');
  const names = pickedSkills(c).map((s) => s.name);
  if (new Set(names).size !== names.length) issues.push('duplicate');
  if (!c.combat) issues.push('combat');
  else if (names.includes(c.combat.skill)) issues.push('combatDuplicate');
  const vals = STAT_KEYS.map((k) => c.stats[k]);
  if (vals.some((v) => v === null)) issues.push('stats');
  else if (c.statMethod === 'array' && [...vals].sort().join() !== STANDARD_ARRAY.join()) issues.push('stats');
  if (c.combat?.kind === 'spell' && (c.stats.int ?? 0) < 4) issues.push('spellInt');
  if (c.third && (thirdPointsUsed(c.third) !== THIRD_STAT_POINTS || !c.third.boosts || c.third.lootRow === null))
    issues.push('third');
  return issues;
}

const titleCase = (s: string) => s.replace(/(^|[\s-])\S/g, (m) => m.toUpperCase());

/**
 * Build the new crawler's sheet from the wizard choices.
 * `hits` are catalog entries (fetched from the server) used to fill the combat skills' details.
 */
export function buildSheet(c: Choices, hits: Record<string, CatalogHit | null>): SheetData {
  const s = newSheet();
  s.name = c.name.trim();
  s.gender = c.gender.trim();
  s.crawlerNumber = c.crawlerNumber.trim();
  s.level = '1';
  s.floor = '1';
  s.race = c.animal ? titleCase(c.species.trim()) : 'Human';
  for (const k of STAT_KEYS) {
    const v = String(c.stats[k] ?? '');
    s.stats[k] = { enhanced: v, unenhanced: v, mod: '' };
  }
  s.manaCurrent = String(c.stats.int ?? '');
  s.dr = { ...s.dr, aiFavor: c.animal ? '0' : '1', size: c.animal ? sizeLabel(c.size) : 'Medium (4)' };

  const skill = (name: string, rank: number, extra: Partial<Skill> = {}): Skill => {
    let row: Skill = { ...emptySkill(), name, rank: String(rank), ...extra };
    const known = classifySkill(name);
    if (known && !row.category) row = { ...row, category: known[0], subtype: known[1] };
    const hit = hits[name];
    if (hit) row = { ...row, ...fillSkill(row, hit) };
    return row;
  };

  const skills: Skill[] = [];
  // Step 2: the free combat skill every crawler has
  skills.push(skill(c.animal ? 'Slice Attack' : 'Unarmed Combat', 3, { pinned: true }));
  // Step 2: chosen weapon / spell / hand-to-hand
  if (c.combat?.kind === 'weapon') {
    const label = c.combat.label.trim() || c.combat.skill;
    const row = skill(c.combat.skill, 3, { pinned: true });
    skills.push({ ...row, name: label });
  } else if (c.combat?.kind === 'spell') {
    skills.push(skill(c.combat.skill, 3, { pinned: true, category: 'spell', subtype: 'attack' }));
  } else if (c.combat?.kind === 'hand') {
    skills.push(skill(c.combat.skill, 3, { pinned: true }));
    skills.push(skill(c.combat.effect, 3, { stat: 'none' }));
  }
  // Step 1: background skills
  for (const p of pickedSkills(c)) skills.push(skill(p.name, p.rank, { stat: p.stat }));
  // Step 6: the Heal spell
  skills.push(s.skills.find((x) => x.name === 'Heal')!);
  s.skills = skills;

  // Hotlist: the attack Spell (Heal is always available and doesn't use it), plus 5 Mana Potions for spell-casters
  if (c.combat?.kind === 'spell') {
    const ref = spellRef(c.combat.skill);
    s.hotSlots = s.hotSlots.map((id, i) => (i === 0 ? ref : id));
  }

  // Step 10: starting gear (clothing and weapon are equipped; spell-casters also carry their Mana Potions)
  const g = c.gear;
  const worn: Item[] = [];
  if (g.clothing.trim())
    worn.push({
      ...emptyItem(),
      item: g.clothing.trim(),
      qty: '1',
      type: 'equipment',
      fits: 'chest',
      slot: 'eq.chest.1',
    });
  const weaponSkill = c.combat?.kind === 'weapon' ? c.combat.skill : '';
  const ammo = ammoTypeFor(`${g.weapon} ${weaponSkill}`);
  if (g.weapon.trim())
    worn.push({
      ...emptyItem(),
      item: g.weapon.trim(),
      qty: '1',
      type: 'equipment',
      fits: 'held',
      slot: 'eq.mainHand.1',
      skill: weaponSkill,
      ranged: !!ammo,
      ammo,
    });
  const carried = [g.item, g.weird]
    .map((x) => x.trim())
    .filter(Boolean)
    .map((item): Item => ({ ...emptyItem(), item, qty: '1', type: 'other' }));
  // a ranged weapon starts with 20 rounds of its Ammunition, on the Hotlist
  if (g.weapon.trim() && ammo)
    carried.push({ ...emptyItem(), item: `${ammo}s`, qty: '20', type: 'ammunition', ammoType: ammo }); // Flechas, Balas…
  if (c.combat?.kind === 'spell')
    carried.push({
      ...emptyItem(),
      item: 'Standard Mana Potion',
      qty: '5',
      type: 'consumable',
      hot: true,
      notes: 'Fully restores Mana (1 Action to drink)',
    });
  s.inventory = [...worn, ...carried, emptyItem(), emptyItem()];
  // the Mana Potions sit in Hotlist slot 3
  const potion = s.inventory.find((it) => it.item === 'Standard Mana Potion');
  if (potion) s.hotSlots = s.hotSlots.map((id, i) => (i === 2 ? potion.id : id));
  const rounds = s.inventory.find((it) => it.type === 'ammunition');
  if (rounds) s.hotSlots = s.hotSlots.map((id, i) => (i === 3 ? rounds.id : id));
  return c.third ? applyThirdFloor(s, c, c.third) : s;
}

/** Starting Loot as inventory items (rename them to what you picked); summaries in our own words, see p. 116–117. */
export const LOOT_TEXT: Record<LootSlot | 'spells', Record<LootTier, string>> = {
  weapon: {
    bronze: 'A silly-looking non-magical d6 weapon the AI likes: AI Favor 2 against Bosses',
    silver: "+1 Rank in the weapon's Skill and +1 damage",
    gold: "+1 Rank in the weapon's Skill and a Scroll of Upgrade (Table 26)",
    platinum: "+2 Ranks in the weapon's Skill, +3 Str or Dex, and a Scroll of Upgrade (Table 26)",
  },
  armor: {
    bronze: 'Awkward mundane armor (hockey pads, a trash-can lid…): +1 DR',
    silver: '+2 DR and Anti-Piercing',
    gold: '+3 DR and Resistance to an uncommon damage type (Table 10)',
    platinum: '+4 DR, +5 Con, and +3 to Catcher or Taunt',
  },
  item: {
    bronze: 'Pick one: 50 ft of rope, a bicycle, a canoe and paddle, or a hang glider',
    silver: 'A Friendship Bracelet of a Race of your choice (p. 217)',
    gold: 'An accessory: +3 to a Stat and a matching Skill (Str & Climbing, Dex & Lockpicking, Int & Fabricate, Con & Survival, or Cha & Streetwise)',
    platinum: 'A permanent +3 Skill Potion: 3 Ranks in a Skill of your choice',
  },
  consumable: {
    bronze: 'Pick one: 10 Healing Potions, 10 Bandages, 10 Torches, or 1 stick of basic dynamite',
    silver: 'Pick one: 2 Poison Antidotes, 1 Good Healing Potion, or 1 Stick of Good Goblin Dynamite',
    gold: 'Pick one: a Rank 5 Spell Scroll of a random Spell (Table 27) or a Gold Standard Healing Potion',
    platinum: 'A Scratcher ticket (p. 218)',
  },
  spells: {
    bronze: '1 Spell at Rank 1d4 and 1 Mana Potion (Table 27)',
    silver: '1 Spell at Rank 2d4 and 2 Mana Potions, or 2 Spells at Rank 1d4 (Table 27)',
    gold: '3 Spells at Rank 1d4 and 3 Mana Potions (Table 27)',
    platinum: '2 Spells at Rank 2d4 and 4 Mana Potions, or 4 Spells at Rank 1d4 (Table 27)',
  },
};

function applyThirdFloor(s: SheetData, c: Choices, t: ThirdFloor): SheetData {
  const out: SheetData = { ...s, level: '10', floor: '3', statPoints: '0' };
  for (const k of STAT_KEYS) {
    const v = String((c.stats[k] ?? 0) + (t.points[k] || 0));
    out.stats = { ...out.stats, [k]: { enhanced: v, unenhanced: v, mod: '' } };
  }
  out.manaCurrent = '';
  if (t.race.trim()) out.race = t.race.trim();
  if (t.cls.trim()) out.class = t.cls.trim();
  out.dr = { ...out.dr, aiFavor: String(t.favor ?? out.dr.aiFavor) };
  const cha = statModFromScore((c.stats.cha ?? 0) + (t.points.cha || 0));
  if (cha !== null) out.popularity = String(cha * 2);
  out.skills = out.skills.map((sk) => {
    const add = t.boosts?.[sk.name] ?? 0;
    return add ? { ...sk, rank: String(Math.min(10, (Number(sk.rank) || 0) + add)) } : sk;
  });
  if (t.lootRow !== null) {
    const row = LOOT_ROWS[t.lootRow - 1];
    const loot: Item[] = LOOT_SLOTS.map((slot) => {
      const tier = row[slot];
      const asSpells = slot !== 'consumable' && t.spells[slot];
      const base = { ...emptyItem(), qty: '1', rarity: tier, upgrades: 'Starting Loot (Table 25)' } as Item;
      if (asSpells)
        return { ...base, item: `Spells (${tier})`, type: 'special', notes: LOOT_TEXT.spells[tier] } as Item;
      if (slot === 'armor')
        return {
          ...base,
          item: `Starting armor (${tier})`,
          type: 'equipment',
          fits: 'chest',
          notes: LOOT_TEXT.armor[tier],
          bonus: { ...base.bonus, dr: String(LOOT_ARMOR_DR[tier]) },
        } as Item;
      if (slot === 'weapon')
        return {
          ...base,
          item: `Starting weapon (${tier})`,
          type: 'equipment',
          fits: 'held',
          notes: LOOT_TEXT.weapon[tier],
          skill: c.combat?.kind === 'weapon' ? c.combat.skill : '',
          bonus: { ...base.bonus, damage: tier === 'silver' ? '1' : '' },
        } as Item;
      return {
        ...base,
        item: `Starting ${slot === 'item' ? 'item' : 'consumable'} (${tier})`,
        type: slot === 'item' ? 'other' : 'consumable',
        notes: LOOT_TEXT[slot][tier],
      } as Item;
    });
    const filled = out.inventory.filter((it) => it.item.trim());
    out.inventory = [...filled, ...loot, emptyItem(), emptyItem()];
  }
  const exps = t.experiences.filter((e) => e.text.trim() || e.table);
  if (exps.length)
    out.notes = [
      'Tutorial Floor Experiences (Core Rulebook p. 118):',
      ...exps.map((e, i) => `${i + 1}. ${e.table ? `[Table ${28 + e.table}] ` : ''}${e.text.trim()}`),
      out.notes,
    ]
      .filter(Boolean)
      .join('\n');
  return out;
}

export const sizeLabel = (n: number) => {
  const found = ANIMAL_SIZES.find((x) => x.size === n);
  return found ? `${found.name} (${n})` : `(${n})`;
};

/** Names whose book details the new sheet needs (combat skills and the starting spell). */
export function namesToLookUp(c: Choices): string[] {
  const names = [c.animal ? 'Slice Attack' : 'Unarmed Combat'];
  if (c.combat) names.push(c.combat.skill);
  if (c.combat?.kind === 'hand') names.push(c.combat.effect);
  for (const p of pickedSkills(c)) if (classifySkill(p.name)?.[0] === 'combat') names.push(p.name);
  return names;
}

/* ---------------- start from a pre-generated crawler (Par for the Course) ---------------- */
export type Pregen = {
  id: number;
  name: string;
  level: string;
  floor: number;
  tags: string;
  size: string;
  slotValue: string;
  move: string;
  stats: Record<StatKey, { score: string; mod: string }>;
  attacks: { name: string; toHit: string; damage: string; range: string; effect: string }[];
  /** "Maul 3, Unarmed Combat 3, …" */
  keySkills: string;
  description: string;
  descriptionEs: string;
  source: string;
};

/** "Magic Missile Spell 5" → { name: "Magic Missile", rank: 5 }. */
export function pregenSkills(p: Pick<Pregen, 'keySkills'>): { name: string; rank: number }[] {
  return p.keySkills
    .split(',')
    .map((x) => x.trim().match(/^(.*?)\s+(\d+)$/))
    .filter((m): m is RegExpMatchArray => !!m)
    .map((m) => ({ name: m[1].replace(/\s+Spell$/i, '').trim(), rank: Number(m[2]) }));
}

/** A new sheet from a pre-gen: stats, Level, Floor, key Skills (attacks pinned, details from the book). */
export function buildFromPregen(p: Pregen, hits: Record<string, CatalogHit | null>): SheetData {
  const s = newSheet();
  s.name = p.name.replace(/\s*\(Floor \d+\)\s*$/, '');
  s.level = String(p.level || '1');
  s.floor = String(p.floor || '1');
  s.race = p.tags.split(',')[0]?.trim() || '';
  for (const k of STAT_KEYS) {
    const v = String(p.stats?.[k]?.score ?? '');
    s.stats[k] = { enhanced: v, unenhanced: v, mod: '' };
  }
  s.dr = { ...s.dr, size: p.size || s.dr.size };
  const attackNames = p.attacks.map((a) => a.name.toLowerCase());
  const heal = s.skills.find((x) => x.name === 'Heal');
  const skills: Skill[] = pregenSkills(p).map(({ name, rank }) => {
    let row: Skill = { ...emptySkill(), name, rank: String(rank) };
    const known = classifySkill(name);
    if (known) row = { ...row, category: known[0], subtype: known[1] };
    const hit = hits[name];
    if (hit) row = { ...row, ...fillSkill(row, hit) };
    const attack =
      attackNames.includes(name.toLowerCase()) ||
      (row.category === 'combat' && row.subtype !== 'damageEffect') ||
      (row.category === 'spell' && row.subtype === 'attack');
    return { ...row, pinned: attack };
  });
  s.skills = [...skills, ...(heal && !skills.some((x) => x.name === 'Heal') ? [heal] : [])];
  s.notes = [`Pre-generated crawler (${p.source}).`, p.description].filter(Boolean).join('\n\n');
  return s;
}
