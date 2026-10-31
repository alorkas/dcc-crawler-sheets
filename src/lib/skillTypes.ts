// Skill categories and subtypes, following the structure of "Crawlers & Customization" (Skills chapter):
// Attack Skills grouped by weapon family, Utility Skills by how they are checked, Spell Skills by type.

import { UTILITY } from '../../server/catalog/utility.js';
import { WEAPONS } from '../../server/catalog/weapons.js';
import { skillEs } from '../../shared/namesEs.js';

export type SkillCategory = 'combat' | 'utility' | 'spell';

export const SKILL_CATEGORIES: { id: SkillCategory; subtypes: string[] }[] = [
  {
    id: 'combat',
    subtypes: [
      'bashing',
      'edged',
      'handToHand',
      'technique',
      'damageEffect',
      'passive',
      'ranged',
      'reach',
      'explosives',
      'animal',
    ],
  },
  { id: 'utility', subtypes: ['opposed', 'unopposed', 'passive'] },
  { id: 'spell', subtypes: ['attack', 'passive'] },
];

export const isCategory = (v: string): v is SkillCategory => v === 'combat' || v === 'utility' || v === 'spell';

export function isValidType(category: string, subtype: string): boolean {
  const cat = SKILL_CATEGORIES.find((c) => c.id === category);
  return !!cat && (subtype === '' || cat.subtypes.includes(subtype));
}

/** Default "Check Type" for a skill of this type (Attack Skills and Attack Spells roll against Evade). */
export function defaultCheckType(
  category: string,
  subtype: string,
): 'evade' | 'opposed' | 'unopposed' | 'passive' | '' {
  if (category === 'combat')
    return subtype === 'damageEffect' || subtype === 'passive' ? 'passive' : subtype ? 'evade' : '';
  if (category === 'spell') return subtype === 'attack' ? 'evade' : subtype === 'passive' ? 'passive' : '';
  if (category === 'utility') return (subtype as 'opposed' | 'unopposed' | 'passive') || '';
  return '';
}

type Known = [SkillCategory, string];

/**
 * Weapons and utility skills from the player books, by type: read from the same catalog the server uses (so the two
 * can't drift apart), plus their Spanish names and a couple of spellings players type.
 */
const KNOWN: Record<string, Known> = {};
const add = (cat: SkillCategory, sub: string, names: string[]) => {
  for (const n of names) if (n) KNOWN[n.toLowerCase()] = [cat, sub];
};
for (const w of WEAPONS) add('combat', w.subtype ?? '', [w.name, skillEs(w.name)]);
for (const u of UTILITY) add('utility', u.subtype ?? '', [u.name, skillEs(u.name)]);
add('combat', 'bashing', ['Improvised Weapon']);
add('combat', 'handToHand', ["Wrasslin'"]);

// Spells are deliberately NOT listed here: the browser bundle is readable by players, and spell names
// would be spoilers. Spells are recognised through the server catalog (src/lib/catalog.ts) instead.

/**
 * Category/subtype for a skill name from the book. Custom names that name a weapon in brackets,
 * like "Tire Iron (Club)", use the bracketed skill. Returns null for unknown skills.
 */
export function classifySkill(name: string): Known | null {
  const n = name.trim().toLowerCase();
  if (!n) return null;
  if (KNOWN[n]) return KNOWN[n];
  const bracket = n.match(/\(([^)]+)\)\s*$/);
  if (bracket && KNOWN[bracket[1].trim()]) return KNOWN[bracket[1].trim()];
  const noBracket = n.replace(/\s*\([^)]*\)\s*$/, '');
  return KNOWN[noBracket] ?? null;
}
