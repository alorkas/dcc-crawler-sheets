import { WEAPONS } from './weapons.js';
import { SPELLS } from './spells.js';
import { UTILITY } from './utility.js';
import { ITEMS } from './items.js';
import { HOMEBREW_ITEMS } from './homebrew.js';
import { ITEMS_ES, SPELLS_ES } from './namesEs.js';
import { SKILLS_ES } from '../../shared/namesEs.js';

/** Normalise a name for matching: case, curly quotes and extra spaces don't matter. */
export const norm = (s) =>
  String(s ?? '')
    .toLowerCase()
    .replace(/[’‘`]/g, "'")
    .replace(/\s+/g, ' ')
    .trim();

/** Spanish name of a book entry (skills, spells, items). */
export const nameEs = (kind, name) =>
  (kind === 'item' ? ITEMS_ES[name] : kind === 'spell' ? SPELLS_ES[name] : SKILLS_ES[name]) ?? '';
const withEs = (kind) => (e) => ({ ...e, nameEs: nameEs(kind, e.name) });

const index = new Map();
const put = (kind, raw) => {
  const entry = withEs(kind)(raw);
  if (entry.nameEs) entry.aliases = [...(entry.aliases ?? []), entry.nameEs];
  for (const n of [entry.name, ...(entry.aliases ?? [])]) {
    const key = `${kind === 'item' ? 'item' : 'skill'}:${norm(n)}`;
    if (!index.has(key)) index.set(key, { kind, entry });
  }
};
WEAPONS.forEach((e) => put('weapon', e));
UTILITY.forEach((e) => put('utility', e));
SPELLS.forEach((e) => put('spell', e));
ITEMS.forEach((e) => put('item', e));
// the campaign's own loot: looked up like book items (book names win)
HOMEBREW_ITEMS.forEach((e) => put('item', { name: e.name, type: e.type, effect: e.notes, homebrew: true }));

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
    ...WEAPONS.map((w) => ({ name: w.name, nameEs: SKILLS_ES[w.name] ?? '', category: 'combat', subtype: w.subtype })),
    ...UTILITY.map((u) => ({ name: u.name, nameEs: SKILLS_ES[u.name] ?? '', category: 'utility', subtype: u.subtype })),
  ];
}

/** Everything, for the GM. */
export function fullCatalog() {
  return {
    weapons: WEAPONS.map(withEs('weapon')).map(strip),
    utility: UTILITY.map(withEs('utility')).map(strip),
    spells: SPELLS.map(withEs('spell')).map(strip),
    items: ITEMS.map(withEs('item')).map(strip),
    homebrew: HOMEBREW_ITEMS,
  };
}

/**
 * Spanish names for the names a player already has (skills and spells on their sheet, items in their bag), so
 * nothing they haven't found yet is revealed. Returns { [name]: spanishName }.
 */
export function translateNames(names) {
  const out = {};
  for (const name of (Array.isArray(names) ? names : []).slice(0, 400)) {
    const n = String(name ?? '').slice(0, 120);
    const hit = lookup(n, 'skill') ?? lookup(n, 'item');
    if (!hit?.entry?.nameEs || norm(hit.entry.nameEs) === norm(n)) continue;
    const bracket = n.match(/^(.*)\(([^)]+)\)\s*$/);
    out[n] =
      bracket && norm(bracket[2]) === norm(hit.entry.name)
        ? `${bracket[1].trim()} (${hit.entry.nameEs})`
        : hit.entry.nameEs;
  }
  return out;
}
