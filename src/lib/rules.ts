// Game rules from "Rules for Survival" and "Crawlers & Customization" (DCC RPG, Tutorial Floors).
// Everything here is pure data → data so it can be unit tested and reused by the UI.
import {
  emptyAttack,
  emptySheet,
  emptySkill,
  normalize,
  sumNumbers,
  type ActiveDebuff,
  type SheetData,
  type StatKey,
  type StatSel,
} from './sheet';
import { classifySkill } from './skillTypes';

export const SCHEMA_VERSION = 4;
export const HB_SLOTS = 10;
export const MAX_SKILL_RANK = 15; // Floors 1–5
export const MAX_EXTERNAL_BUFFS = 3;
export const MAX_ACCESSORIES = 10;
export const HEAL_MANA_COST = 2;
export const HEAL_SLOTS = 2;

/* ---------------- numbers ---------------- */

/** First integer in a string ("+2", "Cha +3" → 2 / 3). null when there is none. */
export function num(v: string | number | undefined | null): number | null {
  if (typeof v === 'number') return Number.isFinite(v) ? v : null;
  const m = (v ?? '').match(/[+-]?\d+/);
  return m ? Number(m[0]) : null;
}

/** Table 9 / Table 1: Stat Mod from the (Enhanced) Stat score. */
export function statModFromScore(score: number | null): number | null {
  if (score === null || score < 1) return null;
  if (score <= 2) return 1;
  if (score <= 5) return 2;
  if (score <= 9) return 3;
  if (score <= 19) return 4;
  if (score <= 49) return 5;
  if (score <= 99) return 6;
  if (score <= 149) return 7;
  if (score <= 199) return 8;
  if (score <= 299) return 9;
  return 10;
}

/** Table 14: Rank damage die for an Attack Skill rank (Tutorial Floors). */
export function rankDamageDie(rank: number | null): string {
  if (!rank || rank < 1) return '';
  if (rank === 1) return '+1';
  if (rank <= 3) return '+1d2';
  if (rank <= 5) return '+1d4';
  if (rank <= 7) return '+1d6';
  if (rank <= 9) return '+1d8';
  return '+1d10';
}

/* ---------------- debuffs (Table 8) ---------------- */

export type DebuffDef = { id: string; penalty?: number; stackable?: boolean; halveMove?: boolean };

/** Debuffs from Table 8. Effect/duration text lives in the locale files (debuff.<id>.*). */
export const DEBUFFS: DebuffDef[] = [
  { id: 'bloodTrail', stackable: true },
  { id: 'burned' },
  { id: 'drowning' },
  { id: 'enraged' },
  { id: 'fatigued', penalty: -1, stackable: true, halveMove: true },
  { id: 'held' },
  { id: 'minorInjury', penalty: -2 },
  { id: 'majorInjury', penalty: -5 },
  { id: 'ltMinorInjury', penalty: -2 },
  { id: 'ltMajorInjury', penalty: -5 },
  { id: 'muted' },
  { id: 'poisoned', stackable: true },
  { id: 'paralyzed' },
  { id: 'queasy' },
  { id: 'sepsis' },
  { id: 'shitFaced' },
  { id: 'shocked' },
  { id: 'soreAsShit', penalty: -1 },
  { id: 'staggered' },
  { id: 'stiffLegs' },
  { id: 'stunned' },
  { id: 'takeDown' },
  { id: 'terrified' },
  { id: 'theTaint' },
  { id: 'woozy' },
];
const DEBUFF_BY_ID = new Map(DEBUFFS.map((d) => [d.id, d]));
export const debuffDef = (id: string) => DEBUFF_BY_ID.get(id);

/** Add a debuff, handling stacking and injury escalation (a second Minor/Major Injury becomes Long-Term). */
export function addDebuff(list: ActiveDebuff[], id: string): ActiveDebuff[] {
  const def = debuffDef(id);
  const existing = list.find((d) => d.id === id);
  const escalate: Record<string, string> = { minorInjury: 'ltMinorInjury', majorInjury: 'ltMajorInjury' };
  if (existing && escalate[id]) {
    const without = list.filter((d) => d.id !== id);
    return without.some((d) => d.id === escalate[id]) ? without.concat() : [...without, fresh(escalate[id])];
  }
  if (existing) {
    if (!def?.stackable) return list;
    return list.map((d) => (d.id === id ? { ...d, stacks: d.stacks + 1 } : d));
  }
  return [...list, fresh(id)];
}
const fresh = (id: string): ActiveDebuff => ({ id, stacks: 1, note: '' });

export function removeDebuff(list: ActiveDebuff[], id: string): ActiveDebuff[] {
  return list.filter((d) => d.id !== id);
}

/** Total penalty to all Checks from active debuffs. */
export function checkPenalty(list: ActiveDebuff[]): number {
  return list.reduce((sum, d) => sum + (debuffDef(d.id)?.penalty ?? 0) * (d.stacks || 1), 0);
}

/* ---------------- derived values ---------------- */

export type Derived = {
  mods: Record<StatKey, number | null>;
  modAuto: Record<StatKey, number | null>;
  manaMax: number | null;
  manaMaxAuto: number | null;
  manaCurrent: number | null;
  slotValue: number | null;
  hbLost: number;
  hbPercent: number;
  dexMod: number | null;
  evadeTotal: number | null;
  drTotal: number | null;
  penalty: number;
  move: number | null;
  moveEffective: number | null;
  liftLbs: number | null;
  dying: boolean;
};

const STAT_KEYS: StatKey[] = ['str', 'int', 'con', 'dex', 'cha'];

export function derive(d: SheetData): Derived {
  const modAuto = {} as Record<StatKey, number | null>;
  const mods = {} as Record<StatKey, number | null>;
  for (const k of STAT_KEYS) {
    modAuto[k] = statModFromScore(num(d.stats[k].enhanced));
    mods[k] = d.stats[k].mod.trim() ? num(d.stats[k].mod) : modAuto[k];
  }
  const manaMaxAuto = num(d.stats.int.enhanced);
  const manaMax = d.manaMax.trim() ? num(d.manaMax) : manaMaxAuto;
  const dexMod = d.evade.dexMod.trim() ? num(d.evade.dexMod) : mods.dex;
  const penalty = checkPenalty(d.debuffList);
  const evadeBase = sumNumbers(dexMod === null ? '' : String(dexMod), d.evade.buffs);
  const move = num(d.evade.move);
  const halve = d.debuffList.some((x) => debuffDef(x.id)?.halveMove);
  const str = num(d.stats.str.enhanced);
  const hbLost = clamp(d.hbLost, 0, HB_SLOTS);
  return {
    mods,
    modAuto,
    manaMax,
    manaMaxAuto,
    manaCurrent: num(d.manaCurrent),
    slotValue: mods.con,
    hbLost,
    hbPercent: (HB_SLOTS - hbLost) * 10,
    dexMod,
    evadeTotal: evadeBase === null ? null : evadeBase + penalty,
    drTotal: sumNumbers(d.dr.armor, d.dr.buffs),
    penalty,
    move,
    moveEffective: move === null ? null : halve ? Math.floor(move / 2) : move,
    liftLbs: str === null ? null : str * 15,
    dying: hbLost >= HB_SLOTS,
  };
}

/** Mod for a skill/attack stat selection ('none' → 0, '' → null meaning "use legacy text"). */
export function modFor(der: Derived, stat: StatSel): number | null {
  if (stat === 'none') return 0;
  if (!stat) return null;
  return der.mods[stat];
}

export const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, Number(n) || 0));

/* ---------------- damage & healing ---------------- */

export type DamageInput = {
  amount: number;
  dr: number;
  bypassDr?: boolean; // e.g. damage from Debuffs
  resistant?: boolean;
  vulnerable?: boolean;
  immune?: boolean;
};

/** Rules for Survival p.41–42: DR first, then resistance (½, round down), vulnerability (×2), immunity (0). */
export function effectiveDamage(i: DamageInput): number {
  let dmg = Math.max(0, Math.floor(i.amount) - (i.bypassDr ? 0 : Math.max(0, i.dr)));
  if (i.resistant) dmg = Math.floor(dmg / 2);
  if (i.vulnerable) dmg *= 2;
  if (i.immune) dmg = 0;
  return dmg;
}

/** Slots lost: each slot absorbs `slotValue` damage; anything smaller than one slot is ignored. */
export function slotsLost(damage: number, slotValue: number, remaining: number): number {
  if (slotValue <= 0 || damage < slotValue) return 0;
  return Math.min(remaining, Math.floor(damage / slotValue));
}

export function applyHbLoss(d: SheetData, slots: number, conMod: number | null): SheetData {
  const hbLost = clamp(d.hbLost + slots, 0, HB_SLOTS);
  const becameDying = hbLost >= HB_SLOTS && d.hbLost < HB_SLOTS;
  return { ...d, hbLost, dyingRounds: becameDying ? String(conMod ?? '') : d.dyingRounds };
}

export function heal(d: SheetData, slots: number): SheetData {
  const hbLost = clamp(d.hbLost - slots, 0, HB_SLOTS);
  return { ...d, hbLost, dyingRounds: hbLost < HB_SLOTS ? '' : d.dyingRounds };
}

function setMana(d: SheetData, value: number, max: number | null): SheetData {
  const v = Math.max(0, max === null ? value : Math.min(max, value));
  return { ...d, manaCurrent: String(v) };
}

export function spendMana(d: SheetData, cost: number): SheetData | null {
  const cur = num(d.manaCurrent) ?? derive(d).manaMax ?? 0;
  if (cur < cost) return null;
  return { ...d, manaCurrent: String(cur - cost) };
}

export function castHeal(d: SheetData): SheetData | null {
  const spent = spendMana(d, HEAL_MANA_COST);
  return spent ? heal(spent, HEAL_SLOTS) : null;
}

/* ---------------- rests (Rules for Survival p.43) ---------------- */

export type RestKind = 'mend' | 'short' | 'long' | 'fullDay';

const CLEARS: Record<RestKind, string[]> = {
  mend: [],
  short: ['minorInjury'],
  long: ['minorInjury', 'majorInjury', 'ltMinorInjury', 'fatigued'],
  fullDay: ['minorInjury', 'majorInjury', 'ltMinorInjury', 'ltMajorInjury', 'fatigued'],
};

export function rest(d: SheetData, kind: RestKind): SheetData {
  const der = derive(d);
  const max = der.manaMax;
  const cur = der.manaCurrent ?? max ?? 0;
  let out: SheetData = { ...d, debuffList: d.debuffList.filter((x) => !CLEARS[kind].includes(x.id)) };
  if (kind === 'mend') {
    out = heal(out, 1);
    out = setMana(out, cur + 5, max);
  } else if (kind === 'short') {
    out = heal(out, 5);
    const intScore = num(d.stats.int.enhanced) ?? 0;
    out = setMana(out, cur + Math.floor(intScore / 2), max);
  } else {
    out = heal(out, HB_SLOTS);
    if (max !== null) out = { ...out, manaCurrent: String(max) };
  }
  return out;
}

/* ---------------- skill advancement (Crawlers & Customization p.42) ---------------- */

export type AdvanceMode = 'session' | 'floor';
export type AdvanceResult = { index: number; name: string; from: number; roll: number; gained: boolean };

const d20 = () => {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return (buf[0] % 20) + 1;
};

/**
 * Roll a Skill Advancement Check for every marked skill.
 * 'session' (every 2h of play) only checks skills at Rank 4 or lower; 'floor' checks all marked skills.
 * d20 ≥ current Rank → +1 Rank (max 15). Rolled skills have their mark cleared.
 * Attacks whose name matches the skill (e.g. "Longsword" or "Tire Iron (Club)") get the new Rank too.
 */
export function rollAdvancement(
  d: SheetData,
  mode: AdvanceMode,
  roll: () => number = d20,
): { data: SheetData; results: AdvanceResult[] } {
  const results: AdvanceResult[] = [];
  let attacks = d.attacks;
  const skills = d.skills.map((s, index) => {
    const rank = num(s.rank) ?? 0;
    if (!s.done || !s.name.trim()) return s;
    if (mode === 'session' && rank > 4) return s;
    const r = roll();
    const gained = r >= rank && rank < MAX_SKILL_RANK;
    results.push({ index, name: s.name, from: rank, roll: r, gained });
    if (!gained) return { ...s, done: false };
    const newRank = String(rank + 1);
    attacks = attacks.map((a) => (attackMatchesSkill(a.name, s.name) ? { ...a, rank: newRank } : a));
    return { ...s, rank: newRank, done: false };
  });
  return { data: { ...d, skills, attacks }, results };
}

export function attackMatchesSkill(attackName: string, skillName: string): boolean {
  const a = attackName.trim().toLowerCase();
  const s = skillName.trim().toLowerCase();
  if (!a || !s) return false;
  return a === s || a.includes(`(${s})`);
}

/** Gain Rank 1 in one skill attempted untrained this session, then clear the list. */
export function learnUntrained(d: SheetData, skillName: string): SheetData {
  const name = skillName.trim();
  const exists = d.skills.some((s) => s.name.trim().toLowerCase() === name.toLowerCase());
  let skills = d.skills;
  if (name && !exists) {
    const emptyIdx = skills.findIndex((s) => !s.name.trim() && !s.rank.trim());
    const skill = classifyRow({ ...emptySkill(), name, rank: '1' });
    skills = emptyIdx >= 0 ? skills.map((s, i) => (i === emptyIdx ? skill : s)) : [...skills, skill];
  }
  return { ...d, skills, untrained: [] };
}

/* ---------------- new sheets & migration ---------------- */

/** A brand-new crawler with the defaults from Character Creation (Steps 2, 6, 7, 8). */
export function newSheet(): SheetData {
  const s = emptySheet();
  s.schema = SCHEMA_VERSION;
  s.evade = { ...s.evade, move: '20', step: '10' };
  s.dr = { ...s.dr, aiFavor: '1', size: 'Medium (4)' };
  s.attacks = [
    {
      ...emptyAttack(),
      name: 'Unarmed Combat',
      rank: '3',
      hitStat: 'str',
      dice: '1d4',
      dmgStat: 'str',
      effects: 'Bludgeoning',
    },
    ...s.attacks.slice(1),
  ];
  s.skills = [
    {
      ...emptySkill(),
      name: 'Unarmed Combat',
      category: 'combat',
      subtype: 'handToHand',
      rank: '3',
      stat: 'str',
      checkType: 'Evade',
      pinned: true,
      attackType: 'melee',
      range: 'Melee (5 ft)',
      aiFavor: '1',
      limitations: 'Cannot choose a Damage Effect',
      baseDamage: '1d4 + Str Bludgeoning',
    },
    {
      ...emptySkill(),
      name: 'Heal',
      category: 'spell',
      subtype: 'passive',
      rank: '1',
      stat: 'none',
      checkType: 'Passive',
      manaCost: '2',
      range: 'Self',
      effect: 'Heals 2 HB slots',
      notes: 'Rank 1 (max) · Interrupt',
    },
  ];
  s.hotlist = ['Heal (Interrupt) · 2 Mana · heals 2 HB slots', ...s.hotlist.slice(1)];
  return s;
}

const STAT_WORDS: [RegExp, StatKey | 'none'][] = [
  [/\b(str|fue)/i, 'str'],
  [/\bint/i, 'int'],
  [/\bcon/i, 'con'],
  [/\b(dex|des)/i, 'dex'],
  [/\b(cha|car)/i, 'cha'],
  [/\b(none|ninguno)/i, 'none'],
];

/** One-time upgrade of v1 sheets: health boxes → slots lost, skill stat text → stat key, drop redundant overrides. */
export function migrate(d: SheetData): SheetData {
  if (d.schema >= SCHEMA_VERSION) return d;
  let out: SheetData = structuredClone(d);
  if (out.schema < 2) out = migrateV1(out);
  if (out.schema < 3) out = migrateV2(out);
  if (out.schema < 4) out = migrateV3(out);
  out.schema = SCHEMA_VERSION;
  return out;
}

/** v1 → v2: health boxes → slots lost, skill stat text → stat key, drop overrides equal to the automatic value. */
function migrateV1(d: SheetData): SheetData {
  const out = d;
  out.hbLost = d.health.filter((b) => b.hit).length;
  out.pet.hbLost = d.pet.health.filter((b) => b.hit).length;
  out.mount.hbLost = d.mount.health.filter((b) => b.hit).length;
  out.skills = d.skills.map((s) => {
    if (s.stat || !s.statMod.trim()) return s;
    const hit = STAT_WORDS.find(([re]) => re.test(s.statMod));
    return hit ? { ...s, stat: hit[1] } : s;
  });
  const der = derive({ ...out, stats: mapStats(out, (st) => ({ ...st, mod: '' })), manaMax: '' });
  for (const k of STAT_KEYS) {
    if (num(out.stats[k].mod) === der.modAuto[k]) out.stats[k].mod = '';
  }
  if (num(out.manaMax) === der.manaMaxAuto) out.manaMax = '';
  if (num(out.evade.dexMod) === derive(out).mods.dex) out.evade.dexMod = '';
  return out;
}

/** v2 → v3: skills get a category/subtype (recognised book skills are sorted automatically); blank rows are dropped. */
function migrateV2(d: SheetData): SheetData {
  const skills = d.skills.filter((s) => !isBlankSkill(s)).map((s) => classifyRow(s));
  return { ...d, skills };
}

/**
 * v3 → v4: the Core tab's Attacks list now shows pinned skills. Each old attack row pins the
 * matching skill (filling its empty fields), or becomes a new pinned combat skill.
 */
function migrateV3(d: SheetData): SheetData {
  const skills = [...d.skills];
  const statAbbr: Record<string, string> = { str: 'Str', int: 'Int', con: 'Con', dex: 'Dex', cha: 'Cha' };
  for (const a of d.attacks) {
    if (!a.name.trim()) continue;
    const bonus = a.dmgStat && a.dmgStat !== 'none' ? statAbbr[a.dmgStat] : a.dmgMod.trim();
    const damage = bonus ? `${a.dice.trim()}${/^[+-]/.test(bonus) ? ' ' : ' + '}${bonus}`.trim() : a.dice.trim();
    const idx = skills.findIndex(
      (s) => s.name.trim().toLowerCase() === a.name.trim().toLowerCase() || attackMatchesSkill(a.name, s.name),
    );
    if (idx >= 0) {
      const s = skills[idx];
      skills[idx] = {
        ...s,
        pinned: true,
        baseDamage: s.baseDamage || damage,
        effect: s.effect || a.effects,
        rank: s.rank || a.rank,
      };
    } else {
      const row = classifyRow({
        ...emptySkill(),
        name: a.name.trim(),
        rank: a.rank,
        stat: a.hitStat,
        statMod: a.statMod,
        baseDamage: damage,
        effect: a.effects,
        pinned: true,
      });
      skills.push(row.category ? row : { ...row, category: 'combat' });
    }
  }
  return { ...d, skills };
}

/** Pinned skills that appear in the Core tab's Attacks list (combat skills and attack spells). */
export function pinnedAttacks(d: SheetData): number[] {
  return d.skills
    .map((s, i) => [s, i] as const)
    .filter(([s]) => s.pinned && canPin(s))
    .map(([, i]) => i);
}

export function canPin(s: { category: string; subtype: string }): boolean {
  return s.category === 'combat' || (s.category === 'spell' && s.subtype === 'attack');
}

/** "1d4 + Str Bludgeoning" → "1d4 + Str (+2) Bludgeoning", using the current Stat Mods. */
export function annotateDamage(text: string, der: Derived): string {
  const map: Record<string, StatKey> = { str: 'str', int: 'int', con: 'con', dex: 'dex', cha: 'cha' };
  return text.replace(/\b(Str|Int|Con|Dex|Cha)\b/gi, (m) => {
    const mod = der.mods[map[m.toLowerCase()]];
    return mod === null ? m : `${m} (${mod >= 0 ? '+' : ''}${mod})`;
  });
}

/** Fill in category/subtype from the book's skill list when the row doesn't have one yet. */
export function classifyRow<T extends { name: string; category: string; subtype: string }>(s: T): T {
  if (s.category) return s;
  const known = classifySkill(s.name);
  return known ? { ...s, category: known[0], subtype: known[1] } : s;
}

function mapStats(d: SheetData, fn: (s: SheetData['stats'][StatKey]) => SheetData['stats'][StatKey]) {
  return Object.fromEntries(STAT_KEYS.map((k) => [k, fn(d.stats[k])])) as SheetData['stats'];
}

/** Load stored JSON into a complete, up-to-date sheet. Empty records become a new crawler with defaults. */
export function loadSheet(stored: unknown): SheetData {
  const isEmpty = !stored || (typeof stored === 'object' && Object.keys(stored as object).length === 0);
  if (isEmpty) return newSheet();
  const d = migrate(normalize(stored));
  // tidy-up on every load: drop completely empty rows that were never given a type
  const skills = d.skills.filter((sk) => sk.category || !isBlankSkill(sk));
  return skills.length === d.skills.length ? d : { ...d, skills };
}

function isBlankSkill(s: SheetData['skills'][number]): boolean {
  return !s.name.trim() && !s.rank.trim() && !s.notes.trim() && !s.statMod.trim() && !s.checkType.trim();
}
