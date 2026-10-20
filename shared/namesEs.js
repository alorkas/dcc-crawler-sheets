// Spanish names for the book's weapon skills and utility skills (public in the player books, so they can live in
// the browser). Puns are translated where Spanish allows it, otherwise renamed in the same spirit. Sheets keep the
// English names (the app's rules and the book lookup use them); the Spanish ones are shown when the app is in
// Spanish. Spells, items and NPC names (spoilers) are in server/catalog/namesEs.js.

export const WEAPONS_ES = {
  Bite: 'Mordisco',
  'Back Claw': 'Garra Trasera',
  'Slice Attack': 'Tajo',
  Club: 'Porra',
  'Improvised Weapons': 'Armas Improvisadas',
  Warhammer: 'Martillo de Guerra',
  Axe: 'Hacha',
  Dagger: 'Daga',
  Longsword: 'Espada Larga',
  Rapier: 'Estoque',
  'Unarmed Combat': 'Combate sin Armas',
  'Foot Soldier': 'Infantería a Patadas',
  'Noggin Nocker': 'Rompecocos',
  Pugilism: 'Pugilismo',
  'Wrasslin’': 'Lucha Libre de Barrio',
  'Choke Out': 'Mataleón',
  'Dirty Fighting': 'Pelea Sucia',
  'Iron Punch': 'Puño de Hierro',
  'Powerful Strike': 'Golpe Poderoso',
  Skullcracker: 'Rompecráneos',
  Smush: 'Espachurrar',
  Toss: 'Lanzamiento',
  Bow: 'Arco',
  Crossbow: 'Ballesta',
  Handgun: 'Pistola',
  Javelin: 'Jabalina',
  Shotgun: 'Escopeta',
  Shuriken: 'Shuriken',
  Slingshot: 'Tirachinas',
  'Herding Weapons': 'Armas de Pastoreo',
  Lance: 'Lanza de Justa',
  Polearm: 'Arma de Asta',
  Quarterstaff: 'Bastón',
};

export const UTILITY_ES = {
  'Acute Ears': 'Oído Fino',
  Aiming: 'Puntería',
  Alchemy: 'Alquimia',
  Ambush: 'Emboscada',
  'Animal Handling': 'Trato con Animales',
  Arcane: 'Arcano',
  'Attack of Opportunity': 'Ataque de Oportunidad',
  Backfire: 'Tiro por la Culata',
  Balance: 'Equilibrio',
  'Basic Science': 'Ciencia Básica',
  'Bomb Surgeon': 'Cirujano de Bombas',
  Calligraphy: 'Caligrafía',
  Cartography: 'Cartografía',
  'Cat-like Reflexes': 'Reflejos Felinos',
  Catcher: 'Parador',
  'Cesta Punta': 'Cesta Punta',
  'Character Actor': 'Actor de Reparto',
  'Chopper Pilot': 'Piloto de Helicóptero',
  Climbing: 'Escalada',
  Cockroach: 'Cucaracha',
  Cooking: 'Cocina',
  Deception: 'Engaño',
  'Detect Lies': 'Detectar Mentiras',
  'Detect Trap': 'Detectar Trampas',
  'Determine Value': 'Tasar',
  Diplomacy: 'Diplomacia',
  Dodge: 'Esquivar',
  'Double Tap': 'Doble Toque',
  Driving: 'Conducción',
  'Dumpster Diving': 'Buceo en Contenedores',
  Endurance: 'Aguante',
  Engineering: 'Ingeniería',
  'Escape Artist': 'Escapista',
  'Escape Plan': 'Plan de Fuga',
  'Explosives Handling': 'Manejo de Explosivos',
  Fabricate: 'Fabricar',
  'Find Crawler': 'Encontrar Crawler',
  'Find Trap': 'Encontrar Trampas',
  'First Aid': 'Primeros Auxilios',
  'Gear Head': 'Fiera de los Motores',
  'Goblin Explosives': 'Explosivos Goblin',
  'Good First Impression': 'Buena Primera Impresión',
  'Hide in Shadows': 'Esconderse en las Sombras',
  'Improvised Explosive Device': 'Artefacto Explosivo Improvisado',
  'Incendiary Device Handling': 'Manejo de Incendiarios',
  Infusion: 'Infusión',
  Intimidate: 'Intimidar',
  Investigation: 'Investigación',
  'Iron Stomach': 'Estómago de Hierro',
  Jumping: 'Salto',
  Leadership: 'Liderazgo',
  'Light on Your Feet': 'Pies Ligeros',
  Lockpicking: 'Ganzúas',
  Lore: 'Saber',
  Negotiation: 'Negociación',
  Pathfinder: 'Abrecaminos',
  Perception: 'Percepción',
  Performance: 'Actuación',
  Persuasion: 'Persuasión',
  Regeneration: 'Regeneración',
  Religion: 'Religión',
  Repair: 'Reparar',
  Riding: 'Montar',
  Ropework: 'Cuerdas y Nudos',
  Running: 'Carrera',
  Salvage: 'Rescatar Chatarra',
  Scutelliphily: 'Escutelifilia',
  'Shield Block': 'Bloqueo con Escudo',
  'Sleight of Hand': 'Juego de Manos',
  Smithing: 'Herrería',
  Stealth: 'Sigilo',
  Streetwise: 'Callejeo',
  Survival: 'Supervivencia',
  Swimming: 'Natación',
  Tactics: 'Táctica',
  'Tattoo Artistry': 'Arte del Tatuaje',
  Taunt: 'Provocar',
  Throwing: 'Lanzar',
  Tracking: 'Rastreo',
  'Trap Engineer': 'Ingeniero de Trampas',
  'Zone of Control': 'Zona de Control',
  // not in the book list but used on sheets
  Disguise: 'Disfraz',
  Insight: 'Perspicacia',
  Navigation: 'Navegación',
  Athletics: 'Atletismo',
  Crafting: 'Artesanía',
  Spell: 'Hechizo',
};

/** Public skill names (weapon and utility skills) → Spanish. */
export const SKILLS_ES = { ...WEAPONS_ES, ...UTILITY_ES };

const normKey = (s) =>
  String(s ?? '')
    .toLowerCase()
    .replace(/[’‘`]/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
const SKILL_INDEX = new Map(Object.entries(SKILLS_ES).map(([en, es]) => [normKey(en), es]));

/** Spanish name of a public skill ("Tire Iron (Club)" → "Tire Iron (Porra)"), or '' when it has none. */
export function skillEs(name) {
  const n = normKey(name);
  if (!n) return '';
  const direct = SKILL_INDEX.get(n);
  if (direct) return direct;
  const m = String(name).match(/^(.*)\(([^)]+)\)\s*$/);
  const inner = m && SKILL_INDEX.get(normKey(m[2]));
  return inner ? `${m[1].trim()} (${inner})` : '';
}

const SKILL_WORDS = Object.keys(SKILLS_ES)
  .filter((k) => k.length > 3)
  .sort((a, b) => b.length - a.length);
const SKILL_RE = new RegExp(
  `\\b(${SKILL_WORDS.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\b`,
  'g',
);
/** Replace the public skill names inside a text with their Spanish names ("+2 a Lockpicking" → "+2 a Ganzúas"). */
export const skillsInTextEs = (text) => String(text ?? '').replace(SKILL_RE, (w) => SKILLS_ES[w] ?? w);
