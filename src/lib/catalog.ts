// Client helpers for the server-side book catalog. No book data lives in the browser bundle:
// entries are fetched by exact name, so spells and items a player hasn't learned aren't exposed.
import { api, ApiError, type CatalogHit } from './api';
import type { Item, Skill, StatSel } from './sheet';

const cache = new Map<string, Promise<CatalogHit | null>>();

/** Look up a skill/spell or item by its exact name (cached; null when the books don't have it). */
export function lookup(name: string, scope: 'skill' | 'item' = 'skill'): Promise<CatalogHit | null> {
  const key = `${scope}:${name.trim().toLowerCase()}`;
  if (!name.trim()) return Promise.resolve(null);
  if (!cache.has(key)) {
    cache.set(
      key,
      api.lookupCatalog(name.trim(), scope).catch((e) => {
        if (e instanceof ApiError && e.status === 404) return null;
        cache.delete(key); // network hiccup: allow a retry
        throw e;
      }),
    );
  }
  return cache.get(key)!;
}

const STATS: StatSel[] = ['str', 'int', 'con', 'dex', 'cha', 'none'];
const asStat = (s: string | undefined): StatSel => (STATS.includes(s as StatSel) ? (s as StatSel) : '');

/** Category/subtype for a catalog hit. */
export function hitType(hit: CatalogHit): Pick<Skill, 'category' | 'subtype'> | null {
  if (hit.kind === 'weapon') return { category: 'combat', subtype: hit.entry.subtype ?? '' };
  if (hit.kind === 'spell') return { category: 'spell', subtype: hit.entry.subtype ?? '' };
  if (hit.kind === 'utility') return { category: 'utility', subtype: hit.entry.subtype ?? '' };
  return null;
}

/**
 * Changes that fill a skill from the book. Only empty fields are filled, so nothing a player typed is
 * overwritten. The type is corrected when the skill has no subtype yet (e.g. "Fireball" sitting in Combat).
 */
export function fillSkill(s: Skill, hit: CatalogHit): Partial<Skill> {
  const e = hit.entry;
  const out: Partial<Skill> = {};
  const type = hitType(hit);
  if (type && (!s.category || !s.subtype)) Object.assign(out, type);
  const stat = hit.kind === 'weapon' && e.subtype === 'damageEffect' ? 'none' : asStat(e.stat);
  if (!s.stat && stat) out.stat = stat;
  const fill = <K extends keyof Skill>(k: K, v: Skill[K] | undefined) => {
    if (v && !String(s[k] ?? '').trim()) out[k] = v;
  };
  if (hit.kind === 'weapon' || hit.kind === 'spell') {
    fill('attackType', e.attackType);
    fill('manaCost', e.manaCost);
    fill('range', e.range);
    fill('duration', e.duration);
    fill('aiFavor', e.aiFavor);
    fill('limitations', e.limitations);
    fill('cooldown', e.cooldown);
    fill('baseDamage', e.baseDamage);
    fill('effect', e.effect);
    fill('description', e.tags);
    const notes = [e.upgrades, e.page ? `Core Rulebook p. ${e.page}` : ''].filter(Boolean).join('\n');
    fill('notes', notes);
  }
  return out;
}

/** Fill an inventory row's notes from the book (only when empty). */
export function fillItem(it: Item, hit: CatalogHit): Partial<Item> {
  if (it.notes.trim()) return {};
  const e = hit.entry;
  const parts = [e.slot && `[${e.slot}]`, e.effect, e.cooldown && `Cooldown ${e.cooldown}`, e.page && `p. ${e.page}`];
  return { notes: parts.filter(Boolean).join(' · ') };
}
