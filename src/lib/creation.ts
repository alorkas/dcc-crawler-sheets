// Character creation data and logic (Core Rulebook ch.3 "First Steps" / Crawlers & Customization).
// Everything here is from the public character-creation chapter of the player books.
import { newSheet } from './rules';
import { emptyItem, emptySkill, type SheetData, type Skill, type StatKey, type StatSel } from './sheet';
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
};

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

export type StepIssue = 'basics' | 'backgrounds' | 'duplicate' | 'combat' | 'combatDuplicate' | 'stats' | 'spellInt';

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

  // Hotlist: Heal, plus 5 Mana Potions for spell-casters
  s.hotlist = [...s.hotlist];
  if (c.combat?.kind === 'spell') {
    s.hotlist[1] = `${c.combat.skill} · ${hits[c.combat.skill]?.entry.manaCost ?? '?'} Mana`;
    s.hotlist[2] = 'Standard Mana Potion ×5 · full Mana restore (1 Action)';
  }

  // Step 10: starting gear
  const g = c.gear;
  s.gear = { ...s.gear, torso: g.clothing.trim(), hands: g.weapon.trim() };
  const items = [g.item, g.weird].map((x) => x.trim()).filter(Boolean);
  s.inventory = [...items.map((item) => ({ ...emptyItem(), item, qty: '1' })), emptyItem(), emptyItem()];
  return s;
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
