// Data model mirroring the official DCC RPG character sheet (all 6 pages).

export type HealthBox = { a: string; b: string; hit: boolean };
export type Stat = { enhanced: string; unenhanced: string; mod: string };
export type StatKey = 'str' | 'int' | 'con' | 'dex' | 'cha';
/** Stat used by a skill/attack: '' = not chosen (legacy free text), 'none' = no stat (passive). */
export type StatSel = StatKey | 'none' | '';
export type ActiveDebuff = { id: string; stacks: number; note: string };

export type Attack = {
  name: string;
  rank: string;
  hitStat: StatSel;
  statMod: string; // legacy / manual to-hit mod, used when hitStat is ''
  dice: string;
  dmgStat: StatSel;
  dmgMod: string; // legacy / manual damage mod, used when dmgStat is ''
  effects: string;
};
export type Skill = {
  name: string;
  category: '' | 'combat' | 'utility' | 'spell';
  subtype: string;
  rank: string;
  stat: StatSel;
  statMod: string; // legacy free text, used when stat is ''
  checkType: string;
  notes: string;
  done: boolean; // advancement mark
};
export type Item = { item: string; qty: string; notes: string };

export type SheetData = {
  /** Data format version, used for one-time migrations of older sheets. */
  schema: number;
  // header
  name: string;
  race: string;
  gender: string;
  level: string;
  crawlerNumber: string;
  class: string;
  floor: string;
  portrait: string;
  health: HealthBox[]; // legacy (v1) health boxes
  /** Health Bar slots lost, marked from 100% down (0–10). */
  hbLost: number;
  dyingRounds: string;
  stats: Record<StatKey, Stat>;
  // combat
  evade: { dexMod: string; buffs: string; move: string; step: string };
  dr: { armor: string; buffs: string; aiFavor: string; size: string };
  manaMax: string;
  manaCurrent: string;
  debuffs: string; // free-text debuff notes
  debuffList: ActiveDebuff[];
  externalBuffs: string[];
  attacks: Attack[];
  // page 2
  hotlist: string[];
  gear: { head: string; torso: string; arms: string; hands: string; legs: string; feet: string; accessories: string };
  popularity: string;
  pastTrauma: string;
  looseEnds: string;
  regrets: string;
  notes: string;
  // page 3–4
  skills: Skill[];
  /** Skills attempted untrained this session (Tutorial Floors). */
  untrained: string[];
  inventory: Item[];
  // page 5
  pet: {
    name: string;
    health: HealthBox[];
    hbLost: number;
    stats: Record<StatKey, string>;
    level: string;
    dr: string;
    evade: string;
    move: string;
    size: string;
    attack1: string;
    attack2: string;
    special: string;
  };
  mount: {
    name: string;
    health: HealthBox[];
    hbLost: number;
    hbSlot: string;
    size: string;
    occupants: string;
    move: string;
    dr: string;
    accessories: string;
  };
  kills: string[];
  personalSpace: { tier: string; size: string; amenities: string };
  clubs: string[];
  deity: string;
  // page 6
  racialAbilities: string;
  classAbilities: string;
  sponsors: string[];
};

export const STATS: { key: StatKey; label: string; short: string }[] = [
  { key: 'str', label: 'Strength', short: 'STR' },
  { key: 'int', label: 'Intelligence', short: 'INT' },
  { key: 'con', label: 'Constitution', short: 'CON' },
  { key: 'dex', label: 'Dexterity', short: 'DEX' },
  { key: 'cha', label: 'Charisma', short: 'CHA' },
];

const health = (): HealthBox[] => Array.from({ length: 10 }, () => ({ a: '', b: '', hit: false }));
const stat = (): Stat => ({ enhanced: '', unenhanced: '', mod: '' });
export const emptyAttack = (): Attack => ({
  name: '',
  rank: '',
  hitStat: '',
  statMod: '',
  dice: '',
  dmgStat: '',
  dmgMod: '',
  effects: '',
});
export const emptySkill = (): Skill => ({
  name: '',
  category: '',
  subtype: '',
  rank: '',
  stat: '',
  statMod: '',
  checkType: '',
  notes: '',
  done: false,
});
export const emptyItem = (): Item => ({ item: '', qty: '', notes: '' });

export function emptySheet(): SheetData {
  return {
    schema: 0,
    name: '',
    race: '',
    gender: '',
    level: '',
    crawlerNumber: '',
    class: '',
    floor: '',
    portrait: '',
    health: health(),
    hbLost: 0,
    dyingRounds: '',
    stats: { str: stat(), int: stat(), con: stat(), dex: stat(), cha: stat() },
    evade: { dexMod: '', buffs: '', move: '', step: '' },
    dr: { armor: '', buffs: '', aiFavor: '', size: '' },
    manaMax: '',
    manaCurrent: '',
    debuffs: '',
    debuffList: [],
    externalBuffs: ['', '', ''],
    attacks: Array.from({ length: 5 }, emptyAttack),
    hotlist: Array(10).fill(''),
    gear: { head: '', torso: '', arms: '', hands: '', legs: '', feet: '', accessories: '' },
    popularity: '',
    pastTrauma: '',
    looseEnds: '',
    regrets: '',
    notes: '',
    skills: Array.from({ length: 8 }, emptySkill),
    untrained: [],
    inventory: Array.from({ length: 8 }, emptyItem),
    pet: {
      name: '',
      health: health(),
      hbLost: 0,
      stats: { str: '', int: '', con: '', dex: '', cha: '' },
      level: '',
      dr: '',
      evade: '',
      move: '',
      size: '',
      attack1: '',
      attack2: '',
      special: '',
    },
    mount: {
      name: '',
      health: health(),
      hbLost: 0,
      hbSlot: '',
      size: '',
      occupants: '',
      move: '',
      dr: '',
      accessories: '',
    },
    kills: Array(6).fill(''),
    personalSpace: { tier: '', size: '', amenities: '' },
    clubs: Array(3).fill(''),
    deity: '',
    racialAbilities: '',
    classAbilities: '',
    sponsors: ['', '', ''],
  };
}

type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => !!v && typeof v === 'object' && !Array.isArray(v);

/** Deep-merge stored data onto an empty sheet so older/partial records always have every field. */
export function normalize(stored: unknown): SheetData {
  const merge = (base: unknown, over: unknown): unknown => {
    if (over === undefined || over === null) return base;
    if (Array.isArray(base)) {
      if (!Array.isArray(over)) return base;
      const tmpl = base[0];
      const out = over.map((v) => (tmpl !== undefined ? merge(tmpl, v) : v));
      // keep fixed-size lists (health, hotlist...) at least as long as the template
      for (let i = out.length; i < base.length; i++) out.push(base[i]);
      return out;
    }
    if (isObj(base)) {
      if (!isObj(over)) return base;
      const out: Obj = { ...base };
      for (const k of Object.keys(base)) out[k] = merge(base[k], over[k]);
      return out;
    }
    return typeof over === typeof base ? over : base;
  };
  return merge(emptySheet(), stored) as SheetData;
}

/** Immutable set by path, e.g. setIn(data, ['stats','str','mod'], '+2'). */
export function setIn<T>(obj: T, path: (string | number)[], value: unknown): T {
  if (path.length === 0) return value as T;
  const [head, ...rest] = path;
  const src = obj as unknown as Obj | unknown[];
  const copy: Obj | unknown[] = Array.isArray(src) ? [...src] : { ...src };
  (copy as Obj)[head as string] = setIn((src as Obj)[head as string], rest, value);
  return copy as T;
}

export function getIn(obj: unknown, path: (string | number)[]): unknown {
  return path.reduce<unknown>((o, k) => (o == null ? undefined : (o as Obj)[k as string]), obj);
}

/** Sum every signed integer in the given strings ("+2", "1 (ring) +1" → 4). Returns null if nothing numeric. */
export function sumNumbers(...values: string[]): number | null {
  let found = false;
  let total = 0;
  for (const v of values) {
    for (const m of (v || '').matchAll(/[+-]?\d+/g)) {
      found = true;
      total += Number(m[0]);
    }
  }
  return found ? total : null;
}

export const signed = (n: number | null) => (n === null ? '—' : n >= 0 ? `+${n}` : `${n}`);
