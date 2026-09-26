// Dice expressions for the shared roll log. Rolls happen on the server so nobody can fake a result.
// Supported: "d20+6", "2d6 + 1d4 - 1", "2d20kh1" (keep highest), "2d20kl1" (keep lowest), "4d6kh3".
import crypto from 'node:crypto';

const MAX_TERMS = 12;
const MAX_DICE = 50;
const MAX_SIDES = 1000;

/** Parse an expression into terms, or return null when it isn't a valid dice expression. */
export function parseDice(input) {
  if (/[\dd]\s+[\dd]/i.test(String(input ?? ''))) return null; // "3 4" is not "34"
  const src = String(input ?? '')
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[−–]/g, '-');
  if (!src || src.length > 80) return null;
  const re = /([+-]?)(?:(\d*)d(\d+)(?:(kh|kl)(\d+))?|(\d+))/y;
  const terms = [];
  let pos = 0;
  while (pos < src.length) {
    re.lastIndex = pos;
    const m = re.exec(src);
    if (!m || m[0] === '' || (pos > 0 && !m[1])) return null;
    const sign = m[1] === '-' ? -1 : 1;
    if (m[6] !== undefined) {
      const value = Number(m[6]);
      if (value > 10000) return null;
      terms.push({ sign, value });
    } else {
      const count = m[2] === '' ? 1 : Number(m[2]);
      const sides = Number(m[3]);
      const keep = m[4] ? { mode: m[4], n: Number(m[5]) } : null;
      if (count < 1 || count > MAX_DICE || sides < 2 || sides > MAX_SIDES) return null;
      if (keep && (keep.n < 1 || keep.n > count)) return null;
      terms.push({ sign, count, sides, keep });
    }
    pos = re.lastIndex;
    if (terms.length > MAX_TERMS) return null;
  }
  return terms.length ? terms : null;
}

const fmtTerm = (t, first) => {
  const sign = t.sign < 0 ? '-' : first ? '' : '+';
  if (t.value !== undefined) return `${sign}${t.value}`;
  return `${sign}${t.count === 1 ? '' : t.count}d${t.sides}${t.keep ? t.keep.mode + t.keep.n : ''}`;
};

/** Roll an expression. Returns null when the expression is invalid. `rng(n)` returns an int in [1, n]. */
export function rollDice(input, rng = (n) => crypto.randomInt(1, n + 1)) {
  const terms = parseDice(input);
  if (!terms) return null;
  let total = 0;
  const parts = terms.map((t) => {
    if (t.value !== undefined) {
      total += t.sign * t.value;
      return { sign: t.sign, value: t.value };
    }
    const rolls = Array.from({ length: t.count }, () => rng(t.sides));
    let kept = rolls.map(() => true);
    if (t.keep) {
      const order = rolls.map((r, i) => [r, i]).sort((a, b) => (t.keep.mode === 'kh' ? b[0] - a[0] : a[0] - b[0]));
      const keepIdx = new Set(order.slice(0, t.keep.n).map(([, i]) => i));
      kept = rolls.map((_, i) => keepIdx.has(i));
    }
    const value = rolls.reduce((s, r, i) => s + (kept[i] ? r : 0), 0);
    total += t.sign * value;
    return { sign: t.sign, dice: fmtTerm({ ...t, sign: 1 }, true), sides: t.sides, rolls, kept, value };
  });
  const expr = terms.map((t, i) => fmtTerm(t, i === 0)).join('');
  // natural result of a single kept d20 (for critical hits and fumbles)
  const d20 = parts.filter((p) => p.sides === 20);
  let natural = null;
  if (d20.length === 1) {
    const keptRolls = d20[0].rolls.filter((_, i) => d20[0].kept[i]);
    if (keptRolls.length === 1) natural = keptRolls[0];
  }
  return { expr, total, parts, natural };
}
