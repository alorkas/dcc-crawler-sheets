// Random loot generator (GM tool). An item is a base (what it is, where it's worn) plus optional parts:
//
//   Turbo  brazales  Minúsculos  del Segador  de Ciruelos
//   (prefix, glued)  (adjective) (role)       (theme)
//
// - prefix (Mini, Turbo, Mega, Anti, Puto…): its own twist (scales the numbers, Movement, an immunity…). It comes on
//   its own, more often on better items, and doesn't count as an affix.
// - adjective: agrees with the base's gender/number → a bonus the app applies by itself
// - role ("del Segador", "de la Bruja") → a smaller bonus, often with a perk written out
// - theme ("de Ciruelos", "de los Goblins", "de Fuego") → a situational or silly effect the GM applies
// - a curse, now and then: hidden from the player until the item is equipped
//
// Quality sets how many affixes (adjective/role/theme) it usually has (Bronze 0, Silver 1, Gold 2, Platinum and up
// 3, with some surprises) and how strong they are; stronger parts only appear on better items. The Floor sets how
// likely each quality is. The content lives in lootgen-data.js (Spanish, gamer slang included).
import {
  ADJECTIVES,
  BASES,
  CONSUMABLE_ADJECTIVES,
  CURSES,
  CURSE_CHANCE,
  JUNK,
  PREFIXES,
  PREFIX_CHANCE,
  QUIPS,
  ROLES,
  STATES,
  THEMES,
} from './lootgen-data.js';

export { ADJECTIVES, BASES, CONSUMABLE_ADJECTIVES, CURSES, JUNK, PREFIXES, ROLES, THEMES };

export const QUALITIES = ['common', 'bronze', 'silver', 'gold', 'platinum', 'legendary', 'celestial'];
export const GEN_KINDS = ['armor', 'weapon', 'shield', 'accessory', 'consumable', 'ammo', 'crafting'];
/** The parts of an item's name the GM can lock, reroll or remove. */
export const PARTS = ['prefix', 'base', 'adjective', 'role', 'theme', 'curse'];

/* ---------------- numbers by quality ---------------- */
const RANK = Object.fromEntries(QUALITIES.map((q, i) => [q, i]));
/** Size of an affix's bonus at each quality (Bronze ≈ +1, Silver ≈ +2, Gold ≈ +3 in total, like the book). */
const MAG = [0, 1, 2, 2, 3, 4, 6];
/** The base item's own bonus (armor DR, weapon damage…). */
const BASE = [0, 1, 1, 1, 2, 2, 3];
/** Extra damage dice for elemental effects. */
const DICE = ['1d4', '1d4', '1d4', '1d6', '1d8', '2d6', '3d6'];
/** Usual number of affixes. */
const AFFIXES = [0, 0, 1, 2, 3, 3, 3];
/** Strongest part level allowed at each quality (parts have levels 1–5). */
const MAX_LEVEL = [0, 1, 1, 2, 3, 4, 5];
/** Gold in a loot box: d10 × this, by quality. */
const GOLD = [1, 1, 10, 100, 500, 1000, 5000];

/** How likely each quality is on a Floor (higher Floors drop better loot). Returns weights that add up to 1. */
export function qualityOdds(floor) {
  const f = Math.max(1, Math.min(18, Number(floor) || 1));
  const center = 0.7 + f * 0.42;
  const sigma = 1 + f * 0.04;
  const w = QUALITIES.map((_, i) => {
    let v = Math.exp(-((i - center) ** 2) / (2 * sigma * sigma));
    if (i === 6) v *= 0.25; // Celestial is always rare
    if (i === 5) v *= 0.6;
    return v;
  });
  const sum = w.reduce((a, b) => a + b, 0);
  return Object.fromEntries(QUALITIES.map((q, i) => [q, w[i] / sum]));
}

/* ---------------- Spanish ---------------- */
/** Adjective forms for masculine/feminine singular/plural, from the masculine singular. */
export function agree(adj, g, n) {
  const forms = typeof adj === 'object' ? adj : inflect(adj);
  return forms[`${g}${n}`];
}
function inflect(w) {
  const last = (re, rep) => w.replace(re, rep);
  if (/o$/.test(w)) return { ms: w, fs: last(/o$/, 'a'), mp: `${w}s`, fp: last(/o$/, 'as') };
  if (/[aeéí]$/.test(w)) return { ms: w, fs: w, mp: `${w}s`, fp: `${w}s` };
  if (/z$/.test(w)) return { ms: w, fs: w, mp: last(/z$/, 'ces'), fp: last(/z$/, 'ces') };
  for (const [end, plain] of [
    ['ón', 'on'],
    ['ín', 'in'],
    ['án', 'an'],
  ]) {
    if (w.endsWith(end)) {
      const s = w.slice(0, -end.length) + plain;
      return { ms: w, fs: `${s}a`, mp: `${s}es`, fp: `${s}as` };
    }
  }
  if (/or$/.test(w)) return { ms: w, fs: `${w}a`, mp: `${w}es`, fp: `${w}as` };
  return { ms: w, fs: w, mp: `${w}es`, fp: `${w}es` };
}
/** "Turbo" + "Brazales" → "Turbobrazales"; "Mini" + "Rodilleras" → "Minirrodilleras". */
export function glue(prefix, name) {
  const lower = name.charAt(0).toLowerCase() + name.slice(1);
  return /[aeiou]$/i.test(prefix) && /^r/.test(lower) ? `${prefix}r${lower}` : `${prefix}${lower}`;
}
const keyOf = (a) => (a ? (a.name ?? agree(a.word, 'm', 's')) : '');

/* ---------------- tags for the notes ---------------- */
const PART_ES = {
  head: 'Cabeza',
  shoulders: 'Hombros',
  chest: 'Pecho',
  bracers: 'Brazales',
  hands: 'Manos',
  back: 'Espalda',
  waist: 'Cintura',
  pants: 'Piernas',
  feet: 'Pies',
  neck: 'Cuello',
  finger: 'Dedo',
  held: 'En la mano',
};
const STAT_ES = {
  str: 'FUE',
  int: 'INT',
  con: 'CON',
  dex: 'DES',
  cha: 'CAR',
  dr: 'RD',
  evade: 'a Esquiva',
  damage: 'de daño',
};
const STATS = ['str', 'dex', 'con', 'int', 'cha'];
const fmt = (k, v) => `${v > 0 ? '+' : '−'}${Math.abs(v)} ${STAT_ES[k]}`;

/* ---------------- randomness ---------------- */
/** A small seedable random generator (mulberry32), so tests and rerolls can repeat a roll. */
export function makeRng(seed = Date.now()) {
  let a = Number(seed) >>> 0 || 1;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const pickOne = (rng, list) => list[Math.floor(rng() * list.length)];
function weighted(rng, list, weightOf) {
  const w = list.map(weightOf);
  const sum = w.reduce((a, b) => a + b, 0);
  if (!sum) return null;
  let r = rng() * sum;
  for (let i = 0; i < list.length; i++) {
    r -= w[i];
    if (r <= 0) return list[i];
  }
  return list[list.length - 1];
}

/** A quality for this Floor (by its odds). */
export function rollQuality(floor, rng = Math.random) {
  const odds = qualityOdds(floor);
  return weighted(rng, QUALITIES, (q) => odds[q]);
}

/** How many affixes: the usual number for the quality, with ~15% surprises (one more or one less). */
function affixCount(rank, rng) {
  let n = AFFIXES[rank];
  const r = rng();
  if (r < 0.08) n -= 1;
  else if (r < 0.15) n += 1;
  if (rank === 0) n = 0; // common items are plain
  return Math.max(0, Math.min(3, n));
}

/** Pick a part fitting the item: allowed level for its quality, a mild preference for the strongest ones. */
function pickAffix(rng, list, kind, rank, not = '') {
  const max = Math.max(1, MAX_LEVEL[rank]);
  let ok = list.filter((a) => a.lvl <= max && a.on.includes(kind));
  if (not && ok.length > 1) ok = ok.filter((a) => keyOf(a) !== not);
  // the creature banes count as a family, not as 60 separate picks
  return weighted(rng, ok, (a) => (1 + a.lvl / max) * (a.bane ? 0.15 : 1));
}

const roundMag = (m, f) => {
  const v = Math.round(m * f);
  return f > 0 ? Math.max(1, v) : Math.min(-1, v);
};

const KIND_FILTER = {
  armor: (b) => b.kind === 'armor',
  weapon: (b) => b.kind === 'weapon',
  shield: (b) => b.kind === 'shield',
  accessory: (b) => b.kind === 'accessory',
  consumable: (b) => b.kind === 'consumable',
  ammo: (b) => b.kind === 'ammo',
  crafting: (b) => b.kind === 'crafting',
  equipment: (b) => ['armor', 'weapon', 'shield'].includes(b.kind),
  gear: (b) => ['armor', 'weapon', 'shield', 'accessory'].includes(b.kind),
};
/** How often each kind comes up when the GM leaves it on "any". */
const KIND_WEIGHT = { armor: 4, weapon: 3, shield: 1, accessory: 3, consumable: 2, ammo: 1, crafting: 0.5 };
const WEARABLE = ['armor', 'weapon', 'shield', 'accessory'];

const find = {
  prefix: (k) => PREFIXES.find((a) => a.word === k),
  adjective: (k, cons) => (cons ? CONSUMABLE_ADJECTIVES : ADJECTIVES).find((a) => keyOf(a) === k),
  role: (k) => ROLES.find((a) => a.name === k),
  theme: (k) => THEMES.find((a) => a.name === k),
  curse: (k) => CURSES.find((a) => a.text === k),
};

/**
 * Generate one item. opts:
 * - floor (1–18), quality ('' = by the Floor's odds), kind ('' = any; 'equipment', 'gear' or one of GEN_KINDS),
 *   part (a body part, 'held', 'finger'…), filter (extra base filter), rng (for tests), seed (for rerolls)
 * - fixed: { quality, base, prefix, adjective, role, theme, curse } — a value keeps that part ('' = none,
 *   '*' = a new one), undefined rolls it as usual; current: the item's parts now (so '*' picks a different one)
 * Returns a sheet item (shared/items.js shape) plus `gen` with what was rolled (to reroll or edit it later).
 */
export function generateItem(opts = {}) {
  const rng = opts.rng ?? Math.random;
  const fixed = opts.fixed ?? {};
  const current = opts.current ?? {};
  const seed = opts.seed ?? Math.floor(rng() * 2 ** 31);
  const sub = (i) => makeRng(seed + i * 7919);
  const floor = Math.max(1, Math.min(18, Number(opts.floor) || 1));
  const quality = QUALITIES.includes(fixed.quality)
    ? fixed.quality
    : QUALITIES.includes(opts.quality)
      ? opts.quality
      : rollQuality(floor, rng);
  const rank = RANK[quality];

  // the base
  const all = [...BASES, ...JUNK];
  let base = fixed.base && fixed.base !== '*' ? all.find((b) => b.name === fixed.base) : null;
  if (!base) {
    let bases = all;
    if (opts.kind && KIND_FILTER[opts.kind]) bases = bases.filter(KIND_FILTER[opts.kind]);
    if (opts.part) bases = bases.filter((b) => b.fits === opts.part);
    if (opts.filter) bases = bases.filter(opts.filter);
    if (fixed.base === '*' && current.base) bases = bases.filter((b) => b.name !== current.base);
    if (!bases.length) bases = BASES;
    const kinds = [...new Set(bases.map((b) => b.kind))];
    const kind = weighted(rng, kinds, (k) => KIND_WEIGHT[k] ?? 1);
    let pool = bases.filter((b) => b.kind === kind);
    if (kind === 'crafting') {
      const max = Math.max(1, MAX_LEVEL[rank]);
      pool = pool.filter((b) => b.lvl <= max);
    }
    base = weighted(rng, pool, (b) => (b.kind === 'crafting' ? 1 + b.lvl : 1));
  }
  const kind = base.kind;
  const isCons = kind === 'consumable' || kind === 'ammo';
  const isJunk = kind === 'crafting';
  const m = MAG[rank];

  // the affixes: which positions, then which ones
  const slots = isJunk ? [] : isCons ? ['adjective', 'theme'] : ['adjective', 'role', 'theme'];
  const target = Math.min(slots.length, affixCount(rank, rng));
  const want = {};
  let have = 0;
  for (const s of slots) {
    if (fixed[s] === '') want[s] = false;
    else if (fixed[s] !== undefined) {
      want[s] = true;
      have += 1;
    }
  }
  const open = slots.filter((s) => want[s] === undefined);
  while (have < target && open.length) {
    const i = Math.floor(rng() * open.length);
    want[open.splice(i, 1)[0]] = true;
    have += 1;
  }
  const lists = { adjective: isCons ? CONSUMABLE_ADJECTIVES : ADJECTIVES, role: ROLES, theme: THEMES };
  const part = {};
  for (const s of slots) {
    if (!want[s]) continue;
    const f = fixed[s];
    part[s] = f && f !== '*' ? find[s](f, isCons) : pickAffix(rng, lists[s], kind, rank, f === '*' ? current[s] : '');
  }
  // the prefix: on its own, more often on better items
  if (!isJunk) {
    const f = fixed.prefix;
    if (f && f !== '*') part.prefix = find.prefix(f);
    else if (f === '*' || (f === undefined && rng() < PREFIX_CHANCE[rank]))
      part.prefix = pickAffix(rng, PREFIXES, kind, rank, f === '*' ? current.prefix : '');
  }
  // a curse, now and then (wearables only)
  if (WEARABLE.includes(kind)) {
    const f = fixed.curse;
    if (f && f !== '*') part.curse = find.curse(f);
    else if (f === '*' || (f === undefined && rng() < CURSE_CHANCE)) {
      const pool = CURSES.filter((c) => !(f === '*' && c.text === current.curse));
      part.curse = pickOne(rng, pool);
    }
  }
  const { prefix, adjective, role, theme, curse } = part;

  // bonuses
  const bonus = { damage: '', dr: '', evade: '', str: '', int: '', con: '', dex: '', cha: '' };
  const add = (k, v) => {
    bonus[k] = String((Number(bonus[k]) || 0) + v);
  };
  if (!isCons && !isJunk) {
    // the base's own bonus (accessories: a Stat of their own)
    const baseStat = base.stat ?? (kind === 'accessory' ? pickOne(sub(1), STATS) : null);
    if (baseStat && BASE[rank]) add(baseStat, BASE[rank]);
    for (const a of [adjective, role]) for (const [k, f] of a?.bonus ?? []) add(k, roundMag(m, f));
    if (prefix) {
      for (const [k, f] of [...(prefix.bonusBy?.[kind] ?? []), ...prefix.bonus]) add(k, roundMag(Math.max(1, m), f));
      if (prefix.rand) {
        const r = sub(2);
        const stats = [...STATS].sort(() => r() - 0.5).slice(0, prefix.rand);
        for (const k of stats) add(k, Math.max(1, Math.round(Math.max(1, m) * 0.6)));
      }
      if (prefix.mult)
        for (const k of Object.keys(bonus)) {
          const v = Number(bonus[k]) || 0;
          if (v > 0) bonus[k] = String(Math.max(1, Math.round(v * prefix.mult)));
        }
    }
  }
  for (const k of Object.keys(bonus)) if (bonus[k] === '0') bonus[k] = '';

  // text effects
  const state = pickOne(sub(3), STATES);
  const fill = (s) =>
    String(s || '')
      .replace(/\{m\}/g, String(Math.max(1, m)))
      .replace(/\{m5\}/g, String(5 * Math.max(1, m)))
      .replace(/\{d\}/g, DICE[rank])
      .replace(/\{state\}/g, state);
  const effects = [];
  let ability = '';
  const prefixText = prefix && fill(isCons ? (prefix.consText ?? prefix.text) : prefix.text);
  if (prefixText) effects.push(prefixText);
  for (const a of [adjective, role, theme]) {
    if (!a) continue;
    const txt = fill(a.textBy?.[kind] ?? a.text);
    if (txt) effects.push(txt);
    if (a.ability && !ability) ability = txt;
  }

  // name: [Prefix]base Adjective del Rol de Tema
  const baseWord = !prefix
    ? base.name
    : prefix.glue
      ? glue(prefix.word, base.name)
      : `${prefix.agree ? agree(prefix.word, base.g, base.n) : prefix.word} ${base.name}`;
  const name = [baseWord, adjective && agree(adjective.word, base.g, base.n), role?.name, theme?.name]
    .filter(Boolean)
    .join(' ');

  // consumables: what the base does, stronger with quality (and the prefix's and adjective's potency)
  const potency = rank + (adjective?.potency ?? 0) + (prefix?.potency ?? 0);
  let use = '';
  let qty = '1';
  let maxCharges = '';
  const qtyRng = sub(7);
  if (kind === 'consumable') {
    const heal = Math.max(1, 4 + potency);
    const dice = DICE[Math.min(6, Math.max(1, potency))];
    use = {
      heal: `Cura ${heal} casillas de salud.`,
      healSmall: `Cura ${Math.max(1, Math.ceil(heal / 2))} casillas de salud.`,
      mana: potency >= 3 ? 'Recupera todo el maná.' : `Recupera ${Math.max(1, 3 + potency * 2)} de maná.`,
      energy: `Ganas una Acción extra (que no sea de Ataque) este asalto${potency >= 4 ? ' y el siguiente' : ''}. Luego, Fatigado.`,
      bomb: `Lanzar (Acción, 30 pies): ${dice} de daño contundente en 5 pies (Esquiva 10+F para la mitad).`,
      fire: `Lanzar (Acción, 30 pies): ${dice} de daño de fuego en 5 pies y el suelo arde 1 asalto.`,
      smoke: `Acción: nube de ${Math.max(5, 10 + potency * 5)} pies durante 1 asalto; los ataques a distancia dentro o hacia dentro tienen Desventaja.`,
      blind: `Acción, a 5 pies: el objetivo queda Cegado ${Math.max(1, Math.ceil(potency / 2))} asalto(s) (Esquiva 10+F).`,
      food: `Fuera de combate: cura ${Math.max(1, Math.ceil(heal / 3))} casillas de salud.`,
      scroll: `Lanzas un hechizo de Rango ${Math.max(1, potency)} sin gastar maná (el DJ dice cuál, o elige uno que conozcas).`,
      teleport: `Te teletransportas hasta ${Math.max(10, 30 + potency * 10)} pies a un sitio que veas.`,
      elixir: `Durante 1 hora: +${Math.max(1, Math.ceil(potency / 2))} a un atributo a elegir al beberlo.`,
      antidote: `Quita el estado Envenenado${potency >= 3 ? ' y cura 1 casilla de salud' : ''}.`,
      invis: `Invisible durante ${Math.max(1, 1 + potency)} asaltos (atacar lo rompe).`,
    }[base.base];
    if (base.base === 'scroll' && rank >= 3) maxCharges = String(rank - 1);
    if (['bomb', 'fire', 'smoke', 'food', 'blind'].includes(base.base)) qty = String(1 + Math.floor(qtyRng() * 3));
  }
  if (kind === 'ammo') qty = String(10 + Math.floor(qtyRng() * 3) * 5);
  if (isJunk) qty = String(1 + Math.floor(qtyRng() * 5));
  if (prefix?.qtyAdd && isCons) qty = String(Number(qty) + prefix.qtyAdd);

  // notes: "[Where] bonuses. Effects.\nIA: «…»"
  const tag =
    kind === 'accessory'
      ? `[Accesorio · ${PART_ES[base.fits]}]`
      : isCons || isJunk
        ? ''
        : `[${PART_ES[base.fits]}${base.twoHanded ? ', a dos manos' : ''}]`;
  const bonusTxt = Object.entries(bonus)
    .filter(([, v]) => v)
    .map(([k, v]) => fmt(k, Number(v)))
    .join(', ');
  const weaponTxt =
    kind === 'weapon'
      ? `Cuenta como ${base.skill}${base.ranged ? ` (a distancia, dispara ${base.ammo.toLowerCase()}s)` : ''}.`
      : '';
  const junkTxt = isJunk ? 'Material de fabricación.' : '';
  const firstLine = [tag, bonusTxt && `${bonusTxt}.`, weaponTxt, junkTxt, use, ...effects].filter(Boolean).join(' ');
  const quip = pickOne(sub(6), QUIPS).replace(/\{name\}/g, name);
  const type =
    kind === 'accessory'
      ? 'accessory'
      : kind === 'consumable'
        ? 'consumable'
        : kind === 'ammo'
          ? 'ammunition'
          : isJunk
            ? 'crafting'
            : 'equipment';

  // the curse: kept apart (hidden from the player until equipped)
  let curseOut = null;
  if (curse) {
    const cb = {};
    for (const [k, f] of curse.bonus) cb[k] = String(roundMag(Math.max(1, m), f));
    curseOut = { text: fill(curse.text), bonus: cb, revealed: false };
  }

  return {
    item: name,
    qty,
    notes: `${firstLine}\nIA: ${quip}`,
    type,
    rarity: quality,
    unique: !!prefix?.unique,
    skill: kind === 'weapon' ? base.skill : '',
    upgrades: '',
    fits: isCons || isJunk ? '' : base.fits,
    twoHanded: !!base.twoHanded,
    ranged: !!base.ranged,
    ammo: base.ammo ?? '',
    ammoType: base.ammoType ?? '',
    charges: '',
    maxCharges,
    ability,
    bonus,
    curse: curseOut,
    gen: {
      floor,
      quality,
      kind,
      base: base.name,
      prefix: prefix?.word ?? '',
      adjective: keyOf(adjective),
      role: role?.name ?? '',
      theme: theme?.name ?? '',
      curse: curse?.text ?? '',
      seed,
      part: opts.part ?? '',
    },
  };
}

/** The item's current parts as `fixed` values (everything stays as it is). */
export const partsOf = (gen) => ({
  quality: gen.quality,
  base: gen.base,
  prefix: gen.prefix,
  adjective: gen.adjective,
  role: gen.role,
  theme: gen.theme,
  curse: gen.curse,
});

/**
 * Reroll an item: the locked parts (and its quality and kind) stay, the rest is rolled again. A locked empty part
 * stays empty.
 */
export function rerollItem(gen, locks = {}, rng = Math.random) {
  const now = partsOf(gen);
  const fixed = { quality: gen.quality };
  for (const p of PARTS) if (locks[p]) fixed[p] = now[p];
  return generateItem({
    floor: gen.floor,
    kind: gen.kind,
    part: gen.part,
    fixed,
    rng,
    seed: locks.base ? gen.seed : undefined,
  });
}

/** Change one part: 'reroll' gives it a new value (or adds one), 'remove' takes it off; the rest stays the same. */
export function changePart(gen, partName, mode, rng = Math.random) {
  const fixed = partsOf(gen);
  fixed[partName] = mode === 'remove' ? '' : '*';
  return generateItem({
    floor: gen.floor,
    kind: gen.kind,
    part: gen.part,
    fixed,
    current: partsOf(gen),
    rng,
    seed: gen.seed,
  });
}

/* ---------------- whole loot boxes ---------------- */
const pickDagger = (b) => b.kind === 'weapon' && ['Dagger', 'Shuriken', 'Crossbow', 'Rapier'].includes(b.skill);
/** What each kind of box tends to hold (Core Rulebook box kinds). */
const BOX_PLAN = {
  adventurer: [{ kind: 'gear' }, { kind: 'consumable' }, { kind: 'consumable', chance: 0.4 }],
  boss: [{ kind: 'equipment' }, { kind: 'gear' }, { kind: 'consumable' }, { kind: 'consumable', chance: 0.5 }],
  crafter: [
    { kind: 'crafting' },
    { kind: 'crafting' },
    { kind: 'crafting' },
    { kind: 'crafting', chance: 0.6 },
    { kind: 'crafting', chance: 0.4 },
    { kind: 'gear', chance: 0.3 },
  ],
  assassin: [
    { kind: 'weapon', filter: pickDagger },
    { kind: 'consumable', filter: (b) => ['smoke', 'blind', 'invis'].includes(b.base) },
    { kind: 'ammo', chance: 0.5 },
  ],
  fan: [
    { kind: 'accessory' },
    { kind: 'consumable', filter: (b) => ['food', 'energy'].includes(b.base) },
    { kind: 'accessory', chance: 0.3 },
  ],
  benefactor: [{ kind: 'gear' }, { kind: 'consumable', chance: 0.5 }],
  achievement: [{ kind: 'gear' }, { kind: 'consumable' }],
  custom: [{ kind: 'gear' }, { kind: 'consumable' }],
};
const GOLD_MULT = {
  boss: 3,
  benefactor: 5,
  fan: 1,
  crafter: 0.5,
  assassin: 1,
  adventurer: 1,
  achievement: 1,
  custom: 1,
};

/**
 * A whole loot box of this quality and kind: items that fit the kind (a Boss box is fuller, a Crafter's box is
 * mostly junk, an Assassin's box has daggers and smoke…) plus gold. Returns { items, gold }.
 */
export function generateBox({ tier = 'bronze', kind = 'adventurer', floor = 1, rng = Math.random } = {}) {
  const quality = QUALITIES.includes(tier) ? tier : 'bronze';
  const plan = BOX_PLAN[kind] ?? BOX_PLAN.adventurer;
  const items = [];
  for (const step of plan) {
    if (step.chance !== undefined && rng() >= step.chance) continue;
    items.push(generateItem({ floor, quality, kind: step.kind, filter: step.filter, rng }));
  }
  const gold = Math.max(1, Math.round((1 + Math.floor(rng() * 10)) * GOLD[RANK[quality]] * (GOLD_MULT[kind] ?? 1)));
  return { items, gold };
}

/** How many different names the generator can make (for the page's "x combinations" line). */
export function combinations() {
  let n = 0;
  for (const b of BASES) {
    const cons = b.kind === 'consumable' || b.kind === 'ammo';
    const pre = PREFIXES.filter((a) => a.on.includes(b.kind)).length + 1;
    const adj = (cons ? CONSUMABLE_ADJECTIVES : ADJECTIVES).filter((a) => a.on.includes(b.kind)).length + 1;
    const rol = cons ? 1 : ROLES.filter((a) => a.on.includes(b.kind)).length + 1;
    const the = THEMES.filter((a) => a.on.includes(b.kind)).length + 1;
    n += pre * adj * rol * the;
  }
  return n + JUNK.length;
}
