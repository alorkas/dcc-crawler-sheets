// Level-ups and Skill Advancement (Core Rulebook ch.3: Experience Points, Grinding, Skill Advancement).
// These run on the server so the GM can apply them to any sheet (even a locked one) and dice stay fair.
import crypto from 'node:crypto';

export const MAX_SKILL_RANK = 15;
export const STAT_POINTS_PER_LEVEL = 3;
/** Levels for killing a Boss, by tier. */
export const BOSS_LEVELS = { neighborhood: 1, borough: 2, city: 3, province: 4, country: 5, floor: 6 };

const int = (v) => {
  const n = parseInt(String(v ?? '').replace(/[^\d-]/g, ''), 10);
  return Number.isFinite(n) ? n : 0;
};
export const rollDie = (sides) => crypto.randomInt(1, sides + 1);

/** Add levels: records the new Level, 3 Stat points per Level to assign later, and a history entry. */
export function levelUp(data, levels, source, detail = '') {
  const from = int(data.level);
  const n = Math.max(0, Math.floor(levels));
  const to = from + n;
  const entry = { at: new Date().toISOString(), floor: String(data.floor ?? ''), source, detail, levels: n, from, to };
  return {
    data: {
      ...data,
      level: String(to),
      statPoints: String(int(data.statPoints) + n * STAT_POINTS_PER_LEVEL),
      levelLog: [...(Array.isArray(data.levelLog) ? data.levelLog : []), entry].slice(-300),
    },
    entry,
  };
}

/** Crawler kill: 1d6, plus the Level difference if the victim was higher (max 15), minus it otherwise (min 1). */
export function crawlerKillLevels(myLevel, victimLevel, d6) {
  const diff = int(victimLevel) - int(myLevel);
  return diff > 0 ? Math.min(15, d6 + diff) : Math.max(1, d6 + diff);
}

/** Grinding: hours add up; reaching your current Level in hours gains a Level and erases the total. */
export function addGrindHours(data, hours) {
  const total = int(data.grindHours) + Math.max(0, Math.floor(hours));
  const level = Math.max(1, int(data.level));
  if (total >= level) {
    const r = levelUp({ ...data, grindHours: '0' }, 1, 'grind', `${total} h`);
    return { ...r, total, leveled: true };
  }
  return { data: { ...data, grindHours: String(total) }, entry: null, total, leveled: false };
}

/**
 * Skill Advancement Checks for every marked skill: 'session' (every 2 hours) only for Rank 4 or lower,
 * 'floor' (end of floor) for all. d20 ≥ current Rank → +1 Rank (max 15). Rolled skills lose their mark.
 */
export function advanceSkills(data, mode, d20 = () => rollDie(20)) {
  const results = [];
  const skills = (Array.isArray(data.skills) ? data.skills : []).map((s) => {
    const rank = int(s.rank);
    if (!s.done || !String(s.name ?? '').trim()) return s;
    if (mode === 'session' && rank > 4) return s;
    const roll = d20();
    const gained = roll >= rank && rank < MAX_SKILL_RANK;
    results.push({ name: s.name, from: rank, roll, gained });
    return gained ? { ...s, rank: String(rank + 1), done: false } : { ...s, done: false };
  });
  return { data: { ...data, skills }, results };
}
