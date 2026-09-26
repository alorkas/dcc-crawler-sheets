// Utility Skills (Core Rulebook ch.4, pp. 184–201): default Stat and how they're checked.

export const UTILITY = [
  {
    name: 'Acute Ears',
    stat: 'int',
    subtype: 'unopposed',
  },
  {
    name: 'Aiming',
    stat: 'none',
    subtype: 'passive',
  },
  {
    name: 'Alchemy',
    stat: 'int',
    subtype: 'unopposed',
  },
  {
    name: 'Ambush',
    stat: 'int',
    subtype: 'opposed',
  },
  {
    name: 'Animal Handling',
    stat: 'cha',
    subtype: 'opposed',
  },
  {
    name: 'Arcane',
    stat: 'int',
    subtype: 'unopposed',
  },
  {
    name: 'Attack of Opportunity',
    stat: 'none',
    subtype: 'passive',
    interrupt: true,
  },
  {
    name: 'Backfire',
    stat: 'int',
    subtype: 'unopposed',
  },
  {
    name: 'Balance',
    stat: 'dex',
    subtype: 'unopposed',
  },
  {
    name: 'Basic Science',
    stat: 'int',
    subtype: 'unopposed',
  },
  {
    name: 'Bomb Surgeon',
    stat: 'int',
    subtype: 'unopposed',
  },
  {
    name: 'Calligraphy',
    stat: 'dex',
    subtype: 'unopposed',
  },
  {
    name: 'Cartography',
    stat: 'int',
    subtype: 'unopposed',
  },
  {
    name: 'Cat-like Reflexes',
    stat: 'dex',
    subtype: 'unopposed',
  },
  {
    name: 'Catcher',
    stat: 'none',
    subtype: 'passive',
    interrupt: true,
  },
  {
    name: 'Cesta Punta',
    stat: 'dex',
    subtype: 'unopposed',
  },
  {
    name: 'Character Actor',
    stat: 'cha',
    subtype: 'passive',
  },
  {
    name: 'Chopper Pilot',
    stat: 'dex',
    subtype: 'opposed',
  },
  {
    name: 'Climbing',
    stat: 'str',
    subtype: 'unopposed',
  },
  {
    name: 'Cockroach',
    stat: 'con',
    subtype: 'unopposed',
  },
  {
    name: 'Cooking',
    stat: 'int',
    subtype: 'unopposed',
  },
  {
    name: 'Deception',
    stat: 'cha',
    subtype: 'opposed',
  },
  {
    name: 'Detect Lies',
    stat: 'int',
    subtype: 'opposed',
  },
  {
    name: 'Detect Trap',
    stat: 'int',
    subtype: 'unopposed',
  },
  {
    name: 'Determine Value',
    stat: 'none',
    subtype: 'passive',
  },
  {
    name: 'Diplomacy',
    stat: 'cha',
    subtype: 'opposed',
  },
  {
    name: 'Dodge',
    stat: 'none',
    subtype: 'passive',
  },
  {
    name: 'Double Tap',
    stat: 'none',
    subtype: 'passive',
  },
  {
    name: 'Driving',
    stat: 'dex',
    subtype: 'opposed',
  },
  {
    name: 'Dumpster Diving',
    stat: 'int',
    subtype: 'unopposed',
  },
  {
    name: 'Endurance',
    stat: 'con',
    subtype: 'unopposed',
  },
  {
    name: 'Engineering',
    stat: 'int',
    subtype: 'unopposed',
  },
  {
    name: 'Escape Artist',
    stat: 'dex',
    subtype: 'unopposed',
  },
  {
    name: 'Escape Plan',
    stat: 'none',
    subtype: 'passive',
  },
  {
    name: 'Explosives Handling',
    stat: 'int',
    subtype: 'unopposed',
  },
  {
    name: 'Fabricate',
    stat: 'int',
    subtype: 'unopposed',
  },
  {
    name: 'Find Crawler',
    stat: 'none',
    subtype: 'passive',
  },
  {
    name: 'Find Trap',
    stat: 'none',
    subtype: 'passive',
  },
  {
    name: 'First Aid',
    stat: 'int',
    subtype: 'unopposed',
  },
  {
    name: 'Gear Head',
    stat: 'int',
    subtype: 'unopposed',
  },
  {
    name: 'Goblin Explosives',
    stat: 'int',
    subtype: 'unopposed',
  },
  {
    name: 'Good First Impression',
    stat: 'cha',
    subtype: 'opposed',
  },
  {
    name: 'Hide in Shadows',
    stat: 'dex',
    subtype: 'opposed',
  },
  {
    name: 'Improvised Explosive Device',
    stat: 'int',
    subtype: 'unopposed',
  },
  {
    name: 'Incendiary Device Handling',
    stat: 'int',
    subtype: 'unopposed',
  },
  {
    name: 'Infusion',
    stat: 'int',
    subtype: 'unopposed',
  },
  {
    name: 'Intimidate',
    stat: 'str',
    subtype: 'opposed',
  },
  {
    name: 'Investigation',
    stat: 'int',
    subtype: 'unopposed',
  },
  {
    name: 'Iron Stomach',
    stat: 'con',
    subtype: 'unopposed',
  },
  {
    name: 'Jumping',
    stat: 'str',
    subtype: 'unopposed',
  },
  {
    name: 'Leadership',
    stat: 'cha',
    subtype: 'unopposed',
  },
  {
    name: 'Light on Your Feet',
    stat: 'dex',
    subtype: 'unopposed',
  },
  {
    name: 'Lockpicking',
    stat: 'dex',
    subtype: 'unopposed',
  },
  {
    name: 'Lore',
    stat: 'int',
    subtype: 'unopposed',
  },
  {
    name: 'Negotiation',
    stat: 'cha',
    subtype: 'opposed',
  },
  {
    name: 'Pathfinder',
    stat: 'none',
    subtype: 'passive',
  },
  {
    name: 'Perception',
    stat: 'int',
    subtype: 'opposed',
  },
  {
    name: 'Performance',
    stat: 'cha',
    subtype: 'unopposed',
  },
  {
    name: 'Persuasion',
    stat: 'cha',
    subtype: 'opposed',
  },
  {
    name: 'Regeneration',
    stat: 'none',
    subtype: 'passive',
  },
  {
    name: 'Religion',
    stat: 'int',
    subtype: 'unopposed',
  },
  {
    name: 'Repair',
    stat: 'int',
    subtype: 'unopposed',
  },
  {
    name: 'Riding',
    stat: 'dex',
    subtype: 'unopposed',
  },
  {
    name: 'Ropework',
    stat: 'dex',
    subtype: 'unopposed',
  },
  {
    name: 'Running',
    stat: 'dex',
    subtype: 'unopposed',
  },
  {
    name: 'Salvage',
    stat: 'int',
    subtype: 'unopposed',
  },
  {
    name: 'Scutelliphily',
    stat: 'int',
    subtype: 'unopposed',
  },
  {
    name: 'Shield Block',
    stat: 'str',
    subtype: 'unopposed',
    interrupt: true,
  },
  {
    name: 'Sleight of Hand',
    stat: 'dex',
    subtype: 'opposed',
  },
  {
    name: 'Smithing',
    stat: 'str',
    subtype: 'unopposed',
  },
  {
    name: 'Stealth',
    stat: 'dex',
    subtype: 'opposed',
  },
  {
    name: 'Streetwise',
    stat: 'cha',
    subtype: 'unopposed',
  },
  {
    name: 'Survival',
    stat: 'con',
    subtype: 'unopposed',
  },
  {
    name: 'Swimming',
    stat: 'str',
    subtype: 'unopposed',
  },
  {
    name: 'Tactics',
    stat: 'int',
    subtype: 'unopposed',
  },
  {
    name: 'Tattoo Artistry',
    stat: 'dex',
    subtype: 'unopposed',
  },
  {
    name: 'Taunt',
    stat: 'cha',
    subtype: 'opposed',
    interrupt: true,
  },
  {
    name: 'Throwing',
    stat: 'str',
    subtype: 'unopposed',
  },
  {
    name: 'Tracking',
    stat: 'int',
    subtype: 'unopposed',
  },
  {
    name: 'Trap Engineer',
    stat: 'int',
    subtype: 'unopposed',
  },
  {
    name: 'Zone of Control',
    stat: 'none',
    subtype: 'passive',
  },
];
