// Rules for Skills that change other rolls (Core Rulebook ch. 4): Dodge on Evade, Taunt and Catcher in Crawler
// Reaction, and hand-to-hand Damage Effects added to an Attack Skill; Skill Ranks from gear. Shared by the browser
// and the server.
import { equipped } from './items.js';
import { skillEs } from './namesEs.js';

const int = (v) => {
  const n = parseInt(String(v ?? '').replace(/[^\d-]/g, ''), 10);
  return Number.isFinite(n) ? n : 0;
};
const norm = (s) =>
  String(s ?? '')
    .trim()
    .toLowerCase()
    .replace(/[’']/g, "'");

/** A Skill on the sheet by name (any of the names given), or null. */
export function findSkill(skills, ...names) {
  const want = names.map(norm);
  return (Array.isArray(skills) ? skills : []).find((s) => want.includes(norm(s?.name))) ?? null;
}
/** Ranks in a Skill (0 when the crawler doesn't have it). */
export const skillRank = (skills, ...names) => int(findSkill(skills, ...names)?.rank);

/** Rank damage die (Table 37): the die closest to the Rank without going over. Rank 1 is a flat +1. */
export function rankDie(rank) {
  const r = int(rank);
  if (r <= 0) return '';
  if (r === 1) return '1';
  if (r <= 3) return '1d2';
  if (r <= 5) return '1d4';
  if (r <= 7) return '1d6';
  if (r <= 9) return '1d8';
  if (r <= 11) return '1d10';
  if (r <= 13) return '1d12';
  if (r <= 15) return '1d8+1d6';
  if (r <= 17) return '2d8';
  if (r <= 19) return '1d10+1d8';
  return '2d10';
}

/* ---------------- Skill Ranks from gear ---------------- */

/**
 * An item's Skill bonuses, one per comma, semicolon or line: "Pugilism +1, Taunt +3", "+2 Stealth", "+1 a Sigilo"
 * → [{ skill: 'Pugilism', ranks: 1 }, …].
 */
export function parseSkillBonus(text) {
  const out = [];
  for (const raw of String(text ?? '').split(/[,;\n]/)) {
    const part = raw.trim().replace(/[−–]/g, '-');
    let m = part.match(/^([+-]?\s*\d+)\s+(?:(?:to|in|a|en)\s+)?(.+)$/i);
    let skill = '';
    let ranks = '';
    if (m) [, ranks, skill] = m;
    else if ((m = part.match(/^(.+?)\s*([+-]\s*\d+)$/))) [, skill, ranks] = m;
    const n = parseInt(ranks.replace(/\s+/g, ''), 10);
    skill = skill.replace(/\s+(?:skill|ranks?|rangos?)$/i, '').trim();
    if (n && skill) out.push({ skill, ranks: n });
  }
  return out;
}

/**
 * Skill Ranks from equipped gear (an item only grants its Skill bonuses while held or worn), by skill name:
 * Map(normalized name → { name, total, from: [{ name: item, value }] }).
 */
export function gearSkillRanks(inventory) {
  const map = new Map();
  for (const it of equipped(inventory)) {
    for (const { skill, ranks } of parseSkillBonus(it.skillBonus)) {
      const key = norm(skill);
      const cur = map.get(key) ?? { name: skill, total: 0, from: [] };
      cur.total += ranks;
      cur.from.push({ name: it.item, value: ranks });
      map.set(key, cur);
    }
  }
  return map;
}

/** The gear bonus for a Skill (by its English or Spanish name), or null. */
export function gearFor(gear, name) {
  if (!gear?.size) return null;
  return gear.get(norm(name)) ?? gear.get(norm(skillEs(name))) ?? null;
}

/**
 * The crawler's Skills with gear included, in the same order: `rank` is the trained Rank + the Ranks from equipped
 * gear (the trained one stays in `baseRank`). Skills the gear grants that aren't on the sheet go at the end with
 * `fromGear: true`: the crawler has them at the Rank noted (Core Rulebook "X Values"). Skill Advancement keeps using
 * the trained Rank.
 */
export function effectiveSkills(skills, inventory) {
  const list = Array.isArray(skills) ? skills : [];
  const gear = gearSkillRanks(inventory);
  if (!gear.size) return list;
  const used = new Set();
  const out = list.map((s) => {
    const g = gearFor(gear, s?.name);
    if (!g || !String(s?.name ?? '').trim()) return s;
    used.add(g);
    return { ...s, rank: String(int(s.rank) + g.total), baseRank: s.rank, gearRanks: g.total, gearFrom: g.from };
  });
  for (const g of gear.values()) {
    if (used.has(g) || g.total <= 0) continue;
    out.push({
      name: g.name,
      rank: String(g.total),
      baseRank: '',
      gearRanks: g.total,
      gearFrom: g.from,
      fromGear: true,
    });
  }
  return out;
}

/* ---------------- Dodge ---------------- */

/**
 * Dodge (Passive): +1 Evade, +1 more at Rank 5, +2 more at Rank 10 and at Rank 15 (upgrades add up).
 * Rank 10: Evade with Advantage against Spells and Ranged Attacks. Rank 15: Evade without spending an Action.
 */
export function dodgeOf(skills) {
  const rank = skillRank(skills, 'Dodge', 'Esquivar');
  if (rank <= 0) return { rank: 0, evade: 0, advVsRanged: false, freeEvade: false, extraStep: false };
  const evade = 1 + (rank >= 5 ? 1 : 0) + (rank >= 10 ? 2 : 0) + (rank >= 15 ? 2 : 0);
  return { rank, evade, advVsRanged: rank >= 10, freeEvade: rank >= 15, extraStep: rank >= 5 };
}

/** Is a Mob attack a Ranged Attack or a Spell (by its range text: more than 10 ft, or the word Spell/ranged)? */
export function isRangedAttack(attack) {
  const range = String(attack?.range ?? '');
  const name = String(attack?.name ?? '');
  if (/spell|hechizo|ranged|distancia/i.test(`${range} ${name}`)) return true;
  const ft = parseInt(range.match(/(\d+)\s*(ft|feet|pies)/i)?.[1] ?? '', 10);
  return Number.isFinite(ft) && ft > 10;
}

/* ---------------- Taunt and Catcher ---------------- */

/** How many Mob attacks a Taunt draws, by its degree of Success (higher degrees taunt more). */
export const tauntCount = (degree) => (degree === 'crit' ? 3 : degree === 'amazing' ? 2 : degree === 'success' ? 1 : 0);
/** Taunt upgrades: R5 a free Evade against each Taunted Attack, R10 60 ft range, R15 those Evades with Advantage. */
export const tauntPerks = (rank) => ({
  range: int(rank) >= 10 ? 60 : 30,
  freeEvade: int(rank) >= 5,
  advantage: int(rank) >= 15,
});
/** Catcher upgrades: +5 DR at Ranks 5, 10 and 15 (they add up); at 15 the caught hit's Debuffs are ignored. */
export const catcherPerks = (rank) => ({
  dr: 5 * Math.min(3, Math.floor(int(rank) / 5)),
  ignoreDebuffs: int(rank) >= 15,
});

/* ---------------- Damage Effects ---------------- */

/**
 * The book's hand-to-hand Damage Effects: which Attack Skills they go with, and what they do at a Rank.
 * - add: extra base damage dice (doubled on a Critical Hit, like the rest of the base damage)
 * - rankDice: how many Rank damage dice to add (not doubled on a Critical Hit)
 * - multBase: multiply the base damage dice result (Powerful Strike); multTotal: multiply the total damage
 * - atOrBelow: only when the target's Health Bar is at or below this %
 * - debuffs: what the target gains on a hit
 */
export const BOOK_EFFECTS = {
  'iron punch': {
    attacks: ['pugilism'],
    at: (r) => ({
      add: ['1d2'],
      rankDice: (r >= 5 ? 1 : 0) + (r >= 15 ? 1 : 0),
      stunInstead: r >= 10 && r < 15,
      debuffs: r >= 15 ? ['stunned'] : [],
    }),
  },
  'powerful strike': {
    attacks: ['foot soldier', 'noggin nocker', 'pugilism'],
    at: (r) => ({ multBase: Math.max(1, r), cooldownHours: r >= 15 ? 2 : r >= 10 ? 5 : r >= 5 ? 10 : 30 }),
  },
  'dirty fighting': {
    attacks: ['pugilism', "wrasslin'"],
    at: (r) => ({
      debuffs: [
        'woozy',
        ...(r >= 5 ? ['theTaint'] : []),
        ...(r >= 10 ? ['blinded'] : []),
        ...(r >= 15 ? ['minorInjury'] : []),
      ],
      note: r >= 10 ? '' : 'critFailPopularity',
    }),
  },
  'choke out': {
    attacks: ["wrasslin'"],
    at: (r) => ({
      multTotal: r >= 15 ? 8 : r >= 10 ? 4 : 2,
      atOrBelow: r >= 15 ? 80 : r >= 10 ? 40 : r >= 5 ? 20 : 10,
    }),
  },
  smush: {
    attacks: ['foot soldier'],
    at: (r) => ({
      multTotal: r >= 15 ? 4 : r >= 5 ? 3 : 2,
      atOrBelow: r >= 15 ? 40 : r >= 5 ? 30 : 20,
      oncePerRound: r < 10,
    }),
  },
  skullcracker: {
    attacks: ['noggin nocker'],
    at: (r) => ({
      add: r >= 5 ? ['1d4', '1d4'] : ['1d4'],
      rankDice: (r >= 10 ? 1 : 0) + (r >= 15 ? 1 : 0),
      sameSize: true,
      debuffs: [...(r >= 10 ? ['stunned'] : []), ...(r >= 15 ? ['bloodTrail'] : [])],
    }),
  },
  toss: {
    attacks: ["wrasslin'"],
    at: (r) => ({
      add: r >= 15 ? ['1d8', '1d8'] : ['1d8'],
      addStr: true,
      note: 'toss',
      tossFeet: 5 * Math.max(1, Math.floor(r / 5)),
    }),
  },
};

/** "Pugilism, Foot Soldier" / "cuerpo a cuerpo" / "melee" / "todos" → what a campaign Damage Effect goes with. */
function appliesByText(text, attack) {
  const parts = String(text ?? '')
    .split(/[,;/]|\s+[yo]\s+|\s+or\s+|\s+and\s+/i)
    .map(norm)
    .filter(Boolean);
  if (!parts.length) return false;
  const name = norm(attack?.name);
  const melee = attack?.attackType === 'melee' || /melee|cuerpo/i.test(String(attack?.range ?? ''));
  const ranged = attack?.attackType === 'ranged';
  const spell = attack?.category === 'spell';
  return parts.some(
    (p) =>
      p === name ||
      ['todos', 'todo', 'cualquiera', 'any', 'all'].includes(p) ||
      (['cuerpo a cuerpo', 'melee', 'cac'].includes(p) && melee && !spell) ||
      (['a distancia', 'distancia', 'ranged'].includes(p) && ranged && !spell) ||
      (['hechizos', 'hechizo', 'spells', 'spell'].includes(p) && spell),
  );
}

/** Is this Skill row a Damage Effect? */
export const isDamageEffect = (s) => s?.subtype === 'damageEffect' || !!BOOK_EFFECTS[norm(s?.name)];

/**
 * The Damage Effects a crawler can add to an Attack Skill: book ones by their Attack Skills, campaign ones by their
 * "applies to" text (the GM sets it on the sheet). Needs at least 1 Rank, except where the sheet says otherwise.
 */
export function effectsFor(skills, attack) {
  if (!attack || attack.category === 'utility') return [];
  const name = norm(attack.name);
  if (name === 'unarmed combat') return []; // "Cannot choose a Damage Effect"
  return (Array.isArray(skills) ? skills : [])
    .filter((s) => s !== attack && isDamageEffect(s) && int(s.rank) > 0)
    .filter((s) => {
      if (String(s.appliesTo ?? '').trim()) return appliesByText(s.appliesTo, attack);
      const book = BOOK_EFFECTS[norm(s.name)];
      return !!book && book.attacks.includes(name);
    });
}

/** A campaign Damage Effect's damage from its text: "+1d4 de daño, +1 cada 3 niveles" at Rank 6 → add 1d4 + 2. */
function homebrewAt(skill, r) {
  const text = `${skill.effect ?? ''} ${skill.baseDamage ?? ''}`;
  const dice = [...text.matchAll(/\+\s*(\d*d\d+)/gi)].map((m) => m[1]);
  const per = text.match(/\+\s*(\d+)\s*(?:de daño\s*)?cada\s*(\d+)\s*niveles/i);
  const flat = per ? Number(per[1]) * Math.floor(r / Number(per[2])) : 0;
  return { add: dice.slice(0, 2), flat };
}

/**
 * What a Damage Effect does on this attack. `ctx`: { targetPct (Health Bar % of the target, if known),
 * sameSize (Skullcracker), stunInstead (Iron Punch R10), now / readyAt (game hours, for cooldowns),
 * usedThisRound (Smush) }. Returns null when it can't be used, with `why`.
 */
export function effectSpec(skill, ctx = {}) {
  const r = int(skill?.rank);
  const book = BOOK_EFFECTS[norm(skill?.name)];
  const s = book ? book.at(r) : homebrewAt(skill, r);
  const spec = {
    name: String(skill?.name ?? ''),
    rank: r,
    add: s.add ?? [],
    flat: s.flat ?? 0,
    rankDice: s.rankDice ?? 0,
    rankDie: rankDie(r),
    multBase: s.multBase ?? 1,
    multTotal: s.multTotal ?? 1,
    atOrBelow: s.atOrBelow ?? null,
    addStr: !!s.addStr,
    debuffs: s.debuffs ?? [],
    stunInstead: !!(s.stunInstead && ctx.stunInstead),
    canStunInstead: !!s.stunInstead,
    sameSize: !!s.sameSize,
    oncePerRound: !!s.oncePerRound,
    cooldownHours: s.cooldownHours ?? 0,
    note: s.note ?? '',
    tossFeet: s.tossFeet ?? 0,
  };
  // cooldowns on the game clock (Powerful Strike)
  if (spec.cooldownHours && ctx.readyAt !== undefined && ctx.now !== undefined && Number(ctx.now) < Number(ctx.readyAt))
    return { ...spec, usable: false, why: 'cooldown', waitHours: Number(ctx.readyAt) - Number(ctx.now) };
  if (spec.oncePerRound && ctx.usedThisRound) return { ...spec, usable: false, why: 'oncePerRound' };
  // Smush only works on a weakened target; Choke Out just doesn't multiply above its threshold
  if (norm(skill?.name) === 'smush' && ctx.targetPct !== undefined && ctx.targetPct > spec.atOrBelow)
    return { ...spec, usable: false, why: 'targetTooHealthy' };
  if (spec.sameSize && ctx.sameSize === false) return { ...spec, add: [], rankDice: 0, debuffs: [], usable: true };
  return { ...spec, usable: true };
}

/* ---------------- Rank upgrades of Attack Skills ---------------- */

/**
 * Extra damage an Attack Skill gets from its Rank upgrades, read from the upgrades text that "Fill from the book"
 * puts in the Skill's notes: "R5: +2d2 · R10: +1d2 · R15: +1d2, free extra attack" at Rank 10 → add ['2d2', '1d2'].
 * "+1 Rank damage die" becomes Rank dice (not doubled on a Critical Hit). Only Combat Attack Skills: Damage Effects
 * have their own rules (BOOK_EFFECTS) and Spell upgrades work differently.
 */
export function rankUpgrades(skill) {
  const r = int(skill?.rank);
  const none = { add: [], rankDice: 0, rankDie: rankDie(r) };
  if (!skill || skill.category !== 'combat' || isDamageEffect(skill) || r < 5) return none;
  const add = [];
  let rankDice = 0;
  for (const m of String(skill.notes ?? '').matchAll(/\bR(\d+)\s*:\s*([^·\n]*)/gi)) {
    if (int(m[1]) > r) continue;
    const dice = m[2].match(/^\s*\+\s*(\d*)d(\d+)\b/i);
    if (dice) add.push(`${dice[1] || 1}d${dice[2]}`);
    rankDice += (m[2].match(/\+\s*1\s+Rank\s+damage\s+die/gi) ?? []).length;
  }
  return { add, rankDice, rankDie: rankDie(r) };
}
/** The Rank upgrade dice as expressions: base dice ("2d2+1d2") and Rank dice ("1d4"), or ''. */
export function upgradeDice(up) {
  return {
    base: (up?.add ?? []).join('+'),
    rank: up?.rankDice && up.rankDie ? Array.from({ length: up.rankDice }, () => up.rankDie).join('+') : '',
  };
}

/** The base damage expression with the effect's extra base dice (before any Critical Hit doubling). */
export function withEffectDice(baseExpr, spec, strMod = 0) {
  if (!baseExpr) return baseExpr;
  let out = String(baseExpr).replace(/\s+/g, '');
  for (const d of spec?.add ?? []) out += `+${d}`;
  if (spec?.addStr && strMod) out += strMod > 0 ? `+${strMod}` : `${strMod}`;
  if (spec?.flat) out += `+${spec.flat}`;
  return out;
}
/** Rank damage dice the effect adds (not doubled on a Critical Hit): "1d4+1d4", or ''. */
export function effectRankDice(spec) {
  if (!spec?.rankDice || !spec.rankDie) return '';
  return Array.from({ length: spec.rankDice }, () => spec.rankDie).join('+');
}
/**
 * Powerful Strike: the base damage dice result × its Rank (modifiers aren't multiplied). Only the first `baseTerms`
 * terms of the rolled expression are base damage; the ones after them (Rank damage dice…) stay as they are.
 * Returns the new total.
 */
export function multiplyBaseDice(roll, multBase, baseTerms) {
  if (!roll) return 0;
  if (!(multBase > 1)) return roll.total;
  const dice = roll.parts
    .slice(0, Math.max(0, baseTerms))
    .filter((p) => p.dice)
    .reduce((sum, p) => sum + p.sign * p.value, 0);
  return roll.total + dice * (multBase - 1);
}
/** How many terms a dice expression has ("2d4+1d2+3" → 3). */
export const termCount = (expr) => (String(expr ?? '').match(/[+-]?\s*(?:\d*d\d+(?:k[hl]\d+)?|\d+)/gi) ?? []).length;

/** Does a total-damage multiplier apply to a target at this Health Bar %? */
export const multApplies = (spec, targetPct) =>
  (spec?.multTotal ?? 1) > 1 && (spec.atOrBelow === null || (targetPct !== undefined && targetPct <= spec.atOrBelow));
