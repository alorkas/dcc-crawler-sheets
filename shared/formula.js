// Stat block numbers shared by the server and the browser: "13+F" (F = Floor) and damage entries.

/** "13+F" → 13 + floor, "16+F+F" → 16 + 2×floor, "15+5" → 20. Null when there is no number. */
export function resolveNum(value, floor) {
  const src = String(value ?? '').replace(/[−–]/g, '-');
  const m = src.match(/[+-]?\s*(?:\d+|F\b)(?:\s*[+-]\s*(?:\d+|F\b))*/i);
  if (!m) return null;
  let total = 0;
  for (const t of m[0].replace(/\s+/g, '').matchAll(/([+-]?)(\d+|F)/gi)) {
    const n = /f/i.test(t[2]) ? Number(floor) || 0 : Number(t[2]);
    total += t[1] === '-' ? -n : n;
  }
  return total;
}

const STAT_WORDS = { str: 'str', int: 'int', con: 'con', dex: 'dex', cha: 'cha' };

/**
 * A stat block damage entry as a dice expression: "2d6+F Fire" → "2d6+3", ": 1d8+3 Slashing" → "1d8+3",
 * "1d6 + Str" → "1d6+2" with the given mods. Null when there are no dice to roll.
 */
export function damageDice(text, floor, mods = {}) {
  let missing = false;
  const replaced = String(text ?? '')
    .replace(/^[\s:]+/, '')
    .replace(/[−–]/g, '-')
    .replace(/\b(Str|Int|Con|Dex|Cha)(\s*Mod)?\b/gi, (_m, s) => {
      const v = parseInt(String(mods[STAT_WORDS[s.toLowerCase()]] ?? '').replace(/[^\d-]/g, ''), 10);
      if (!Number.isFinite(v)) missing = true;
      return Number.isFinite(v) ? `${v >= 0 ? '+' : ''}${v}` : '';
    })
    .replace(/\bF\b/g, () => String(Number(floor) || 0));
  if (missing) return null;
  const m = replaced.match(/^[\s\dd+-]+/i);
  if (!m) return null;
  const expr = m[0]
    .replace(/\s+/g, '')
    .replace(/\+\+/g, '+')
    .replace(/\+-/g, '-')
    .replace(/[+-]+$/, '');
  return /\d*d\d+/i.test(expr) ? expr : null;
}
