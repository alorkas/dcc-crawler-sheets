// Combat rules shared by the server and the browser: degrees of Success, Critical Hit dice, status effects with
// durations, and what healing items do. Rules from the Core Rulebook, written in our own words.

/**
 * Degree of Success or Failure of a d20 Check against a difficulty: a Natural 20 is a Critical Hit, beating it by
 * 10+ is an Amazing Success, missing by 1–2 is a Near Miss, by 10+ a Major Fail, and a Natural 1 a Critical Fail.
 * Without a difficulty only the natural results count (null otherwise).
 */
export function degreeOf(total, natural, dc) {
  if (natural === 20) return 'crit';
  if (natural === 1) return 'critFail';
  if (dc === null || dc === undefined || !Number.isFinite(Number(dc))) return null;
  const diff = Number(total) - Number(dc);
  if (diff >= 10) return 'amazing';
  if (diff >= 0) return 'success';
  if (diff >= -2) return 'nearMiss';
  if (diff > -10) return 'fail';
  return 'majorFail';
}
export const isSuccess = (degree) => degree === 'crit' || degree === 'amazing' || degree === 'success';

/** Critical Hit: twice as many damage dice ("1d10+2d10+3" → "2d10+4d10+3"); modifiers stay as they are. */
export function doubleDice(expr) {
  return String(expr ?? '').replace(/(\d*)d(\d+)(?![\dk])/gi, (_m, n, s) => `${(Number(n) || 1) * 2}d${s}`);
}

/* ---------------- status effects ---------------- */

export const EFFECT_KINDS = ['buff', 'debuff', 'advantage', 'disadvantage'];
/** How long an effect lasts: a number of rounds (ticks down in Clean Up), the fight, until a rest, or until removed. */
export const DURATIONS = ['rounds', 'combat', 'rest', 'manual'];

let seq = 0;
export const newEffectId = () => `e${Date.now().toString(36)}${(seq++).toString(36)}`;

export function cleanEffect(raw) {
  const e = raw && typeof raw === 'object' ? raw : {};
  const rounds = Math.max(0, Math.min(99, parseInt(e.rounds, 10) || 0));
  return {
    id: String(e.id || newEffectId()).slice(0, 40),
    kind: EFFECT_KINDS.includes(e.kind) ? e.kind : 'buff',
    name: String(e.name ?? '').slice(0, 80),
    effect: String(e.effect ?? '').slice(0, 300),
    duration: DURATIONS.includes(e.duration) ? e.duration : 'manual',
    rounds,
    ...(e.vsOpponent ? { vsOpponent: Number(e.vsOpponent) } : {}),
    ...(e.source ? { source: String(e.source).slice(0, 80) } : {}),
  };
}

/** A Dying crawler (0% Health Bar) loses one of their remaining rounds. Same sheet when not Dying. */
export function dyingTick(data) {
  const left = parseInt(String(data?.dyingRounds ?? ''), 10);
  if ((Number(data?.hbLost) || 0) < 10 || !Number.isFinite(left) || left <= 0) return data;
  return { ...data, dyingRounds: String(left - 1) };
}

/**
 * End of a combat round (Clean Up): effects and debuffs with a number of rounds lose one; the ones that reach 0
 * end, and a Dying crawler has one round less to live ("during Combat Step 5: Clean Up, subtract 1"). Returns the
 * new sheet (or the same one when nothing changed) and the names of what ended.
 */
export function tickRound(data) {
  const ended = [];
  let changed = false;
  const effects = (Array.isArray(data.effects) ? data.effects : []).flatMap((e) => {
    if (e.duration !== 'rounds' || !e.rounds) return [e];
    changed = true;
    if (e.rounds <= 1) {
      ended.push(e.name);
      return [];
    }
    return [{ ...e, rounds: e.rounds - 1 }];
  });
  const debuffList = (Array.isArray(data.debuffList) ? data.debuffList : []).flatMap((d) => {
    if (!d.rounds) return [d];
    changed = true;
    if (d.rounds <= 1) {
      ended.push(`debuff:${d.id}`);
      return [];
    }
    return [{ ...d, rounds: d.rounds - 1 }];
  });
  const out = changed ? { ...data, effects, debuffList } : data;
  return { data: dyingTick(out), ended };
}

/** End of combat: effects that last the fight (or a number of rounds) end, and so do timed debuffs. */
export function endCombat(data) {
  const ended = [];
  const effects = (Array.isArray(data.effects) ? data.effects : []).filter((e) => {
    const ends = e.duration === 'combat' || e.duration === 'rounds';
    if (ends) ended.push(e.name);
    return !ends;
  });
  const debuffList = (Array.isArray(data.debuffList) ? data.debuffList : []).filter((d) => {
    if (d.rounds) ended.push(`debuff:${d.id}`);
    return !d.rounds;
  });
  return { data: ended.length ? { ...data, effects, debuffList } : data, ended };
}

/** A rest (other than a quick mend) ends the effects that last "until a rest". */
export const clearRestEffects = (data) =>
  Array.isArray(data.effects) && data.effects.some((e) => e.duration === 'rest')
    ? { ...data, effects: data.effects.filter((e) => e.duration !== 'rest') }
    : data;

/** Add a Table 8 debuff on the server (injuries after combat): a second Minor/Major Injury becomes Long-Term. */
export function addDebuffTo(list, id) {
  const cur = Array.isArray(list) ? list : [];
  const lt = { minorInjury: 'ltMinorInjury', majorInjury: 'ltMajorInjury' }[id];
  if (cur.some((d) => d.id === id)) {
    if (!lt) return cur;
    const without = cur.filter((d) => d.id !== id);
    return without.some((d) => d.id === lt) ? without : [...without, { id: lt, stacks: 1, note: '' }];
  }
  return [...cur, { id, stacks: 1, note: '' }];
}

/* ---------------- Mob targeting ---------------- */

/**
 * Random targets for a Mob attack (a GM shortcut: the book leaves targeting to the GM). `n` different crawlers,
 * preferring the ones not Dying (at 0% Health Bar); Dying ones only when there aren't enough others.
 * `rand(k)` returns an integer in [0, k).
 */
export function randomTargets(members, n = 1, rand = (k) => Math.floor(Math.random() * k)) {
  const shuffle = (list) => {
    const a = [...list];
    for (let i = a.length - 1; i > 0; i--) {
      const j = rand(i + 1);
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  const dying = (m) => (Number(m?.view?.hbLost) || 0) >= 10;
  const ids = [...shuffle(members.filter((m) => !dying(m))), ...shuffle(members.filter(dying))].map((m) => m.id);
  return ids.slice(0, Math.max(1, Math.min(ids.length, Math.floor(n) || 1)));
}

/* ---------------- Debuffs that change rolls (Table 11) ---------------- */

/**
 * Which rolls a Debuff gives Disadvantage to: 'check' (Skill and Stat Checks), 'attack', 'evade'. Shit-Faced: every
 * Check; Stunned: the next Check; Queasy: the next Action with a roll; Staggered: the next Action, if an Attack;
 * Terrified: Attacks; Blinded: Checks that need sight (Attacks always do).
 */
const DEBUFF_DIS = {
  shitFaced: ['check', 'attack', 'evade'],
  stunned: ['check', 'attack', 'evade'],
  queasy: ['check', 'attack', 'evade'],
  staggered: ['attack'],
  terrified: ['attack'],
  blinded: ['attack'],
};
/** Debuffs that end once they've affected a roll. */
const ONE_SHOT = ['stunned', 'queasy', 'staggered'];

/** The Debuffs (ids) that give this kind of roll Disadvantage. */
export function debuffDisadvantage(list, kind) {
  return (Array.isArray(list) ? list : []).map((d) => d?.id).filter((id) => DEBUFF_DIS[id]?.includes(kind));
}
/** The one-shot Debuffs a roll of this kind uses up (Stunned after a Check, Staggered after an Attack…). */
export const usedUpBy = (list, kind) => debuffDisadvantage(list, kind).filter((id) => ONE_SHOT.includes(id));
/** Take those Debuffs off. Returns the same list when there's nothing to take off. */
export function dropDebuffs(list, ids) {
  const cur = Array.isArray(list) ? list : [];
  return ids?.length && cur.some((d) => ids.includes(d?.id)) ? cur.filter((d) => !ids.includes(d?.id)) : cur;
}
/** Woozy: no Dex Mod on Attack or Evade Checks. */
export const isWoozy = (list) => (Array.isArray(list) ? list : []).some((d) => d?.id === 'woozy');

/**
 * Advantage or Disadvantage from how many reasons there are of each: one of each cancels out, and whatever is left
 * wins (two Advantages and one Disadvantage roll with Advantage). Either way it's only one extra d20.
 */
export const rollMode = (adv, dis) =>
  Number(adv) > Number(dis) ? 'adv' : Number(dis) > Number(adv) ? 'dis' : 'normal';
/** "d20+5" → "2d20kh1+5" (Advantage) / "2d20kl1+5" (Disadvantage). */
export const withRollMode = (expr, mode) =>
  mode === 'adv' || mode === 'dis'
    ? String(expr).replace(/^(?:1?d20|2d20k[hl]1)/i, mode === 'adv' ? '2d20kh1' : '2d20kl1')
    : String(expr);

/* ---------------- items ---------------- */

/**
 * What using an item does, read from its description: "Heals 5 HB slots", "Fully restores Mana",
 * "Restores 15 Mana". Null when it's not something the app can apply by itself.
 */
export function itemEffect(notes) {
  const s = String(notes ?? '');
  const heal = s.match(/\bheals?\s+(?:a\s+pet\s+)?(\d+)\s*(?:HB\s*)?slots?/i);
  if (heal && !/\bpet\b/i.test(s.slice(0, heal.index + heal[0].length)))
    return { type: 'heal', amount: Number(heal[1]) };
  if (/fully\s+restores?\s+mana/i.test(s)) return { type: 'manaFull' };
  const mana = s.match(/\brestores?\s+(\d+)\s+mana\b(?!\s+per)/i);
  if (mana) return { type: 'mana', amount: Number(mana[1]) };
  // the same in Spanish ("Cura 5 casillas de salud", "Recupera todo el maná", "Recupera 3 de maná")
  const cura = s.match(/\bcura\s+(\d+)\s+casillas?/i);
  if (cura && !/mascota/i.test(s)) return { type: 'heal', amount: Number(cura[1]) };
  if (/(recupera|restaura)\s+todo\s+el\s+man[aá]/i.test(s)) return { type: 'manaFull' };
  const mana2 = s.match(/\b(?:recupera|restaura)\s+(\d+)\s+(?:de\s+|puntos\s+de\s+)?man[aá]/i);
  if (mana2) return { type: 'mana', amount: Number(mana2[1]) };
  return null;
}
