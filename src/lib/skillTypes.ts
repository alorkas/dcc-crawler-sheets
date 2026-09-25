// Skill categories and subtypes, following the structure of "Crawlers & Customization" (Skills chapter):
// Attack Skills grouped by weapon family, Utility Skills by how they are checked, Spell Skills by type.

export type SkillCategory = 'combat' | 'utility' | 'spell';

export const SKILL_CATEGORIES: { id: SkillCategory; subtypes: string[] }[] = [
  {
    id: 'combat',
    subtypes: ['bashing', 'edged', 'handToHand', 'damageEffect', 'ranged', 'reach', 'explosives', 'animal'],
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
  if (category === 'combat') return subtype === 'damageEffect' ? 'passive' : subtype ? 'evade' : '';
  if (category === 'spell') return subtype === 'attack' ? 'evade' : subtype === 'passive' ? 'passive' : '';
  if (category === 'utility') return (subtype as 'opposed' | 'unopposed' | 'passive') || '';
  return '';
}

type Known = [SkillCategory, string];

/** The Skills and Spells charts from the book, by type (names only). */
const KNOWN: Record<string, Known> = {};
const add = (cat: SkillCategory, sub: string, names: string[]) => {
  for (const n of names) KNOWN[n.toLowerCase()] = [cat, sub];
};

add('combat', 'animal', ['Back Claw', 'Bite', 'Slice Attack']);
add('combat', 'bashing', ['Club', 'Improvised Weapons', 'Improvised Weapon', 'Warhammer']);
add('combat', 'edged', ['Axe', 'Dagger', 'Longsword']);
add('combat', 'handToHand', ['Foot Soldier', 'Noggin Nocker', 'Pugilism', 'Unarmed Combat', 'Wrasslin’', "Wrasslin'"]);
add('combat', 'damageEffect', ['Choke Out', 'Iron Punch', 'Powerful Strike', 'Skullcracker', 'Smush', 'Toss']);
add('combat', 'ranged', ['Bow', 'Crossbow', 'Handgun', 'Javelin', 'Shotgun', 'Shuriken', 'Slingshot']);
add('combat', 'reach', ['Polearm', 'Quarterstaff']);

add('utility', 'passive', ['Aiming', 'Catcher', 'Determine Value', 'Dodge', 'Regeneration']);
add('utility', 'opposed', [
  'Ambush',
  'Animal Handling',
  'Deception',
  'Detect Lies',
  'Escape Artist',
  'Good First Impression',
  'Hide in Shadows',
  'Intimidate',
  'Negotiation',
  'Persuasion',
  'Sleight of Hand',
  'Stealth',
  'Taunt',
]);
add('utility', 'unopposed', [
  'Chopper Pilot',
  'Climbing',
  'Detect Trap',
  'Driving',
  'Dumpster Diving',
  'Endurance',
  'Engineering',
  'Explosives Handling',
  'Fabricate',
  'Find Crawler',
  'First Aid',
  'Goblin Explosives',
  'Incendiary Device Handling',
  'Investigation',
  'Jumping',
  'Light on Your Feet',
  'Lockpicking',
  'Perception',
  'Performance',
  'Repair',
  'Running',
  'Salvage',
  'Streetwise',
  'Survival',
  'Swimming',
  'Tactics',
  'Throwing',
  'Tracking',
]);

add('spell', 'attack', [
  'Dirt Clod',
  'Drain Life',
  'Fireball',
  'Fire Fingers',
  'Frost Scar',
  'Ice Blast',
  'Lightning Bolt',
  'Magic Missile',
  'Shock Treatment',
  'Soul Collector',
  'Thunderlash',
  'Unnecessary Force',
]);
add('spell', 'passive', [
  'Astral Paw',
  'Astral Hand',
  'Astral Claw',
  'Confusing Fog',
  'Heal',
  'Heal Others',
  'Hole',
  'Protective Shell',
  'Puddle Jumper',
  'Second Chance',
  'Shield',
  'Torch',
  'Wisp Armor',
]);

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
