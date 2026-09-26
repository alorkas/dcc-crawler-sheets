import { WEAPONS } from './weapons.js';
import { SPELLS } from './spells.js';
import { UTILITY } from './utility.js';
import { ITEMS } from './items.js';

/** Normalise a name for matching: case, curly quotes and extra spaces don't matter. */
export const norm = (s) =>
  String(s ?? '')
    .toLowerCase()
    .replace(/[’‘`]/g, "'")
    .replace(/\s+/g, ' ')
    .trim();

const index = new Map();
const put = (kind, entry) => {
  for (const n of [entry.name, ...(entry.aliases ?? [])]) {
    const key = `${kind === 'item' ? 'item' : 'skill'}:${norm(n)}`;
    if (!index.has(key)) index.set(key, { kind, entry });
  }
};
WEAPONS.forEach((e) => put('weapon', e));
UTILITY.forEach((e) => put('utility', e));
SPELLS.forEach((e) => put('spell', e));
ITEMS.forEach((e) => put('item', e));

/**
 * Find a skill/spell (scope "skill") or item (scope "item") by exact name.
 * For skills, a custom weapon written the book's way, like "Tire Iron (Club)", matches the bracketed skill.
 */
export function lookup(name, scope = 'skill') {
  const n = norm(name);
  if (!n) return null;
  const direct = index.get(`${scope}:${n}`);
  if (direct) return direct;
  if (scope === 'skill') {
    const bracket = n.match(/\(([^)]+)\)\s*$/);
    if (bracket) return index.get(`skill:${bracket[1].trim()}`) ?? null;
  }
  return null;
}

const strip = ({ aliases, ...rest }) => rest; // eslint-disable-line no-unused-vars

/** Skills players may browse (weapons and utility skills are public in the player books). */
export function publicSkills() {
  return [
    ...WEAPONS.map((w) => ({ name: w.name, category: 'combat', subtype: w.subtype })),
    ...UTILITY.map((u) => ({ name: u.name, category: 'utility', subtype: u.subtype })),
  ];
}

/** Everything, for the GM. */
export function fullCatalog() {
  return {
    weapons: WEAPONS.map(strip),
    utility: UTILITY.map(strip),
    spells: SPELLS.map(strip),
    items: ITEMS.map(strip),
  };
}
