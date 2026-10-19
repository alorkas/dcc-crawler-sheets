// Random loot generator (GM tool). An item is a base (what it is, where it's worn) plus up to three affixes:
//
//   Brazales  Minúsculos  del Segador  de Ciruelos
//   (base)    (prefix)    (role)       (theme)
//
// - prefix: an adjective (agrees with the base's gender/number) → a bonus the app applies by itself
// - role ("del Segador", "de la Bruja") → a smaller bonus, often with a skill perk written out
// - theme ("de Ciruelos", "de los Goblins", "de Fuego") → a situational or silly effect the GM applies
//
// Quality sets how many affixes it usually has (Bronze 0, Silver 1, Gold 2, Platinum and up 3, with some
// surprises) and how strong they are; stronger affixes only appear on better items. The Floor sets how likely
// each quality is. Everything is original text, in Spanish (the table plays in Spanish), gamer slang included.
// Skill names stay as they are on the sheets (English, from the book).

export const QUALITIES = ['common', 'bronze', 'silver', 'gold', 'platinum', 'legendary', 'celestial'];
export const GEN_KINDS = ['armor', 'weapon', 'shield', 'accessory', 'consumable', 'ammo'];

/* ---------------- numbers by quality ---------------- */
const RANK = Object.fromEntries(QUALITIES.map((q, i) => [q, i]));
/** Size of an affix's bonus at each quality (Bronze ≈ +1, Silver ≈ +2, Gold ≈ +3 in total, like the book). */
const MAG = [0, 1, 2, 2, 3, 4, 6];
/** The base item's own bonus (armor DR, weapon damage…). */
const BASE = [0, 1, 1, 1, 2, 2, 3];
/** Extra damage dice for elemental effects. */
const DICE = ['1d4', '1d4', '1d4', '1d6', '1d8', '2d6', '3d6'];
/** Usual number of affixes. */
const AFFIXES = [0, 0, 1, 2, 3, 3, 3];
/** Strongest affix level allowed at each quality (affixes have levels 1–5). */
const MAX_LEVEL = [0, 1, 1, 2, 3, 4, 5];

/** How likely each quality is on a Floor (higher Floors drop better loot). Returns weights that add up to 1. */
export function qualityOdds(floor) {
  const f = Math.max(1, Math.min(18, Number(floor) || 1));
  const center = 0.7 + f * 0.42;
  const sigma = 1 + f * 0.04;
  const w = QUALITIES.map((_, i) => {
    let v = Math.exp(-((i - center) ** 2) / (2 * sigma * sigma));
    if (i === 6) v *= 0.25; // Celestial is always rare
    if (i === 5) v *= 0.6;
    return v;
  });
  const sum = w.reduce((a, b) => a + b, 0);
  return Object.fromEntries(QUALITIES.map((q, i) => [q, w[i] / sum]));
}

/* ---------------- Spanish agreement ---------------- */
/** Adjective forms for masculine/feminine singular/plural, from the masculine singular. */
export function agree(adj, g, n) {
  const forms = typeof adj === 'object' ? adj : inflect(adj);
  return forms[`${g}${n}`];
}
function inflect(w) {
  const last = (re, rep) => w.replace(re, rep);
  if (/o$/.test(w)) return { ms: w, fs: last(/o$/, 'a'), mp: `${w}s`, fp: last(/o$/, 'as') };
  if (/[aeéí]$/.test(w)) return { ms: w, fs: w, mp: `${w}s`, fp: `${w}s` };
  if (/z$/.test(w)) return { ms: w, fs: w, mp: last(/z$/, 'ces'), fp: last(/z$/, 'ces') };
  if (/ón$/.test(w)) {
    const s = last(/ón$/, 'on');
    return { ms: w, fs: `${s}a`, mp: `${s}es`, fp: `${s}as` };
  }
  if (/or$/.test(w)) return { ms: w, fs: `${w}a`, mp: `${w}es`, fp: `${w}as` };
  if (/án$/.test(w)) {
    const s = last(/án$/, 'an');
    return { ms: w, fs: `${s}a`, mp: `${s}es`, fp: `${s}as` };
  }
  return { ms: w, fs: w, mp: `${w}es`, fp: `${w}es` };
}

/* ---------------- bases ---------------- */
// g: gender (m/f), n: number (s/p). kind: armor | weapon | shield | accessory | consumable | ammo.
// stat: what the base itself gives (armor → dr/evade, weapons → damage, shields → dr).
const A = (name, g, n, fits, stat = 'dr') => ({ name, g, n, kind: 'armor', fits, stat });
const C = (name, g, n, fits) => ({ name, g, n, kind: 'accessory', fits });
const W = (name, g, n, skill, extra = {}) => ({
  name,
  g,
  n,
  kind: 'weapon',
  fits: 'held',
  skill,
  stat: 'damage',
  ...extra,
});
const S = (name, g, n) => ({ name, g, n, kind: 'shield', fits: 'held', stat: 'dr' });

export const BASES = [
  // head
  A('Casco', 'm', 's', 'head'),
  A('Yelmo', 'm', 's', 'head'),
  A('Gorra', 'f', 's', 'head', 'evade'),
  A('Sombrero', 'm', 's', 'head', 'evade'),
  A('Capucha', 'f', 's', 'head', 'evade'),
  A('Bandana', 'f', 's', 'head', 'evade'),
  A('Gorro de Lana', 'm', 's', 'head'),
  A('Casco de Moto', 'm', 's', 'head'),
  A('Pasamontañas', 'm', 's', 'head', 'evade'),
  // shoulders
  A('Hombreras', 'f', 'p', 'shoulders'),
  A('Espaldares', 'm', 'p', 'shoulders'),
  A('Hombreras de Fútbol Americano', 'f', 'p', 'shoulders'),
  A('Charreteras', 'f', 'p', 'shoulders', 'evade'),
  // chest
  A('Peto', 'm', 's', 'chest'),
  A('Coraza', 'f', 's', 'chest'),
  A('Cota de Malla', 'f', 's', 'chest'),
  A('Chaqueta', 'f', 's', 'chest'),
  A('Sudadera', 'f', 's', 'chest', 'evade'),
  A('Camiseta', 'f', 's', 'chest', 'evade'),
  A('Chaleco', 'm', 's', 'chest'),
  A('Jubón', 'm', 's', 'chest'),
  A('Albornoz', 'm', 's', 'chest', 'evade'),
  A('Chándal', 'm', 's', 'chest', 'evade'),
  // bracers
  A('Brazales', 'm', 'p', 'bracers'),
  A('Muñequeras', 'f', 'p', 'bracers', 'evade'),
  A('Coderas', 'f', 'p', 'bracers'),
  A('Avambrazos', 'm', 'p', 'bracers'),
  // hands
  A('Guantes', 'm', 'p', 'hands', 'evade'),
  A('Guanteletes', 'm', 'p', 'hands'),
  A('Manoplas', 'f', 'p', 'hands'),
  A('Mitones', 'm', 'p', 'hands', 'evade'),
  A('Guantes de Fregar', 'm', 'p', 'hands', 'evade'),
  // back
  A('Capa', 'f', 's', 'back', 'evade'),
  A('Manto', 'm', 's', 'back'),
  A('Mochila', 'f', 's', 'back'),
  A('Capote', 'm', 's', 'back', 'evade'),
  // waist
  A('Cinturón', 'm', 's', 'waist'),
  A('Faja', 'f', 's', 'waist'),
  A('Fajín', 'm', 's', 'waist', 'evade'),
  // pants
  A('Pantalones', 'm', 'p', 'pants'),
  A('Grebas', 'f', 'p', 'pants'),
  A('Rodilleras', 'f', 'p', 'pants'),
  A('Vaqueros', 'm', 'p', 'pants', 'evade'),
  A('Mallas', 'f', 'p', 'pants', 'evade'),
  A('Bermudas', 'f', 'p', 'pants', 'evade'),
  // feet
  A('Botas', 'f', 'p', 'feet'),
  A('Zapatillas', 'f', 'p', 'feet', 'evade'),
  A('Sandalias', 'f', 'p', 'feet', 'evade'),
  A('Chanclas', 'f', 'p', 'feet', 'evade'),
  A('Zuecos', 'm', 'p', 'feet'),
  A('Botas de Agua', 'f', 'p', 'feet'),
  A('Escarpes', 'm', 'p', 'feet'),

  // accessories
  C('Anillo', 'm', 's', 'finger'),
  C('Sortija', 'f', 's', 'finger'),
  C('Sello', 'm', 's', 'finger'),
  C('Alianza', 'f', 's', 'finger'),
  C('Collar', 'm', 's', 'neck'),
  C('Amuleto', 'm', 's', 'neck'),
  C('Colgante', 'm', 's', 'neck'),
  C('Medallón', 'm', 's', 'neck'),
  C('Gargantilla', 'f', 's', 'neck'),
  C('Silbato', 'm', 's', 'neck'),
  C('Pendiente', 'm', 's', 'head'),
  C('Gafas de Sol', 'f', 'p', 'head'),
  C('Diadema', 'f', 's', 'head'),
  C('Monóculo', 'm', 's', 'head'),
  C('Piercing', 'm', 's', 'head'),
  C('Charretera', 'f', 's', 'shoulders'),
  C('Broche', 'm', 's', 'chest'),
  C('Tatuaje', 'm', 's', 'chest'),
  C('Chapa', 'f', 's', 'chest'),
  C('Insignia', 'f', 's', 'chest'),
  C('Pulsera', 'f', 's', 'bracers'),
  C('Brazalete', 'm', 's', 'bracers'),
  C('Esclava', 'f', 's', 'bracers'),
  C('Nudilleras', 'f', 'p', 'hands'),
  C('Parche Bordado', 'm', 's', 'back'),
  C('Llavero', 'm', 's', 'waist'),
  C('Hebilla', 'f', 's', 'waist'),
  C('Liga', 'f', 's', 'pants'),
  C('Tobillera', 'f', 's', 'feet'),
  C('Cascabel de Tobillo', 'm', 's', 'feet'),

  // weapons (skill = the book's weapon skill it counts as)
  W('Porra', 'f', 's', 'Club'),
  W('Bate', 'm', 's', 'Club'),
  W('Llave Inglesa', 'f', 's', 'Club'),
  W('Martillo de Guerra', 'm', 's', 'Warhammer', { twoHanded: true }),
  W('Mazo', 'm', 's', 'Warhammer', { twoHanded: true }),
  W('Hacha', 'f', 's', 'Axe'),
  W('Hacha de Bombero', 'f', 's', 'Axe', { twoHanded: true }),
  W('Daga', 'f', 's', 'Dagger'),
  W('Navaja', 'f', 's', 'Dagger'),
  W('Cuchillo Jamonero', 'm', 's', 'Dagger'),
  W('Espada Larga', 'f', 's', 'Longsword'),
  W('Machete', 'm', 's', 'Longsword'),
  W('Estoque', 'm', 's', 'Rapier'),
  W('Florete', 'm', 's', 'Rapier'),
  W('Nudillos de Hierro', 'm', 'p', 'Pugilism'),
  W('Lanza', 'f', 's', 'Polearm', { twoHanded: true }),
  W('Alabarda', 'f', 's', 'Polearm', { twoHanded: true }),
  W('Bastón', 'm', 's', 'Quarterstaff', { twoHanded: true }),
  W('Palo de Escoba', 'm', 's', 'Quarterstaff', { twoHanded: true }),
  W('Arco', 'm', 's', 'Bow', { twoHanded: true, ranged: true, ammo: 'Flecha' }),
  W('Arco Corto', 'm', 's', 'Bow', { twoHanded: true, ranged: true, ammo: 'Flecha' }),
  W('Ballesta', 'f', 's', 'Crossbow', { twoHanded: true, ranged: true, ammo: 'Virote' }),
  W('Pistola', 'f', 's', 'Handgun', { ranged: true, ammo: 'Bala' }),
  W('Revólver', 'm', 's', 'Handgun', { ranged: true, ammo: 'Bala' }),
  W('Escopeta', 'f', 's', 'Shotgun', { twoHanded: true, ranged: true, ammo: 'Cartucho' }),
  W('Tirachinas', 'm', 's', 'Slingshot', { ranged: true, ammo: 'Piedra' }),
  W('Jabalina', 'f', 's', 'Javelin'),
  W('Shurikens', 'm', 'p', 'Shuriken'),
  // shields
  S('Escudo', 'm', 's'),
  S('Rodela', 'f', 's'),
  S('Broquel', 'm', 's'),
  S('Tapa de Cubo', 'f', 's'),
  S('Señal de Stop', 'f', 's'),
  S('Puerta de Coche', 'f', 's'),

  // consumables (effect: what the base does at each quality)
  { name: 'Poción de Curación', g: 'f', n: 's', kind: 'consumable', base: 'heal' },
  { name: 'Tirita Mágica', g: 'f', n: 's', kind: 'consumable', base: 'healSmall' },
  { name: 'Poción de Maná', g: 'f', n: 's', kind: 'consumable', base: 'mana' },
  { name: 'Lata de Bebida Energética', g: 'f', n: 's', kind: 'consumable', base: 'energy' },
  { name: 'Bomba', g: 'f', n: 's', kind: 'consumable', base: 'bomb' },
  { name: 'Granada', g: 'f', n: 's', kind: 'consumable', base: 'bomb' },
  { name: 'Cartucho de Dinamita', g: 'm', n: 's', kind: 'consumable', base: 'bomb' },
  { name: 'Cóctel Molotov', g: 'm', n: 's', kind: 'consumable', base: 'fire' },
  { name: 'Bomba de Humo', g: 'f', n: 's', kind: 'consumable', base: 'smoke' },
  { name: 'Bocadillo', g: 'm', n: 's', kind: 'consumable', base: 'food' },
  { name: 'Galleta', g: 'f', n: 's', kind: 'consumable', base: 'food' },
  { name: 'Pergamino', g: 'm', n: 's', kind: 'consumable', base: 'scroll' },
  { name: 'Elixir', g: 'm', n: 's', kind: 'consumable', base: 'elixir' },
  // ammunition
  { name: 'Flechas', g: 'f', n: 'p', kind: 'ammo', ammoType: 'Flecha' },
  { name: 'Virotes', g: 'm', n: 'p', kind: 'ammo', ammoType: 'Virote' },
  { name: 'Balas', g: 'f', n: 'p', kind: 'ammo', ammoType: 'Bala' },
  { name: 'Cartuchos', g: 'm', n: 'p', kind: 'ammo', ammoType: 'Cartucho' },
  { name: 'Piedras', g: 'f', n: 'p', kind: 'ammo', ammoType: 'Piedra' },
];

/* ---------------- affixes ---------------- */
// lvl: 1 (common) … 5 (only Celestial). on: kinds it can appear on (default: armor, shield, accessory, weapon).
// bonus: [[key, factor]] → round(magnitude × factor), at least 1 (negative factors are drawbacks).
// text: extra effect ({m} = magnitude, {d} = extra damage dice). ability: the effect is used (goes on the Hotlist).
const WEAR = ['armor', 'shield', 'accessory', 'weapon'];
/** An adjective that doesn't change (Cachas, Retro, Premium). */
const INV = (w) => ({ ms: w, fs: w, mp: w, fp: w });
const P = (word, lvl, bonus, extra = {}) => ({ word, lvl, bonus, on: WEAR, ...extra });

export const PREFIXES = [
  // Strength
  P('Fornido', 1, [['str', 1]]),
  P('Musculado', 1, [['str', 1]]),
  P(INV('Cachas'), 2, [['str', 1]]),
  P('Mamadísimo', 3, [['str', 1.4]]),
  P('Titánico', 4, [['str', 1.6]]),
  P('Hercúleo', 5, [['str', 2]]),
  // Dexterity
  P('Ágil', 1, [['dex', 1]]),
  P('Escurridizo', 1, [['dex', 1]]),
  P('Grácil', 2, [['dex', 1]]),
  P('Felino', 3, [['dex', 1.4]]),
  P('Relampagueante', 4, [['dex', 1.6]]),
  P('Ninja', 5, [['dex', 2]]),
  // Constitution
  P('Robusto', 1, [['con', 1]]),
  P('Recio', 1, [['con', 1]]),
  P('Correoso', 2, [['con', 1]]),
  P('Granítico', 3, [['con', 1.4]]),
  P('Inquebrantable', 4, [['con', 1.6]]),
  P('Inmortal', 5, [['con', 2]]),
  // Intelligence
  P('Listillo', 1, [['int', 1]]),
  P('Empollón', 1, [['int', 1]]),
  P('Erudito', 2, [['int', 1]]),
  P('Arcano', 3, [['int', 1.4]]),
  P('Iluminado', 4, [['int', 1.6]]),
  P('Omnisciente', 5, [['int', 2]]),
  // Charisma
  P('Molón', 1, [['cha', 1]]),
  P('Resultón', 1, [['cha', 1]]),
  P('Carismático', 2, [['cha', 1]]),
  P('Seductor', 3, [['cha', 1.4]]),
  P('Radiante', 4, [['cha', 1.6]]),
  P('Viral', 5, [['cha', 2]]),
  // DR
  P('Reforzado', 1, [['dr', 1]], { on: ['armor', 'shield'] }),
  P('Acolchado', 1, [['dr', 1]], { on: ['armor', 'shield'] }),
  P('Blindado', 2, [['dr', 1]], { on: ['armor', 'shield', 'accessory'] }),
  P('Pétreo', 3, [['dr', 1.4]], { on: ['armor', 'shield', 'accessory'] }),
  P('Acorazado', 4, [['dr', 1.6]], { on: ['armor', 'shield', 'accessory'] }),
  P('Adamantino', 5, [['dr', 2]], { on: ['armor', 'shield', 'accessory'] }),
  // Evade
  P('Esquivo', 1, [['evade', 1]]),
  P('Huidizo', 2, [['evade', 1]]),
  P('Fantasmal', 3, [['evade', 1.3]]),
  P('Etéreo', 4, [['evade', 1.5]]),
  // damage (weapons)
  P('Afilado', 1, [['damage', 1]], { on: ['weapon'] }),
  P('Contundente', 1, [['damage', 1]], { on: ['weapon'] }),
  P('Brutal', 2, [['damage', 1]], { on: ['weapon'] }),
  P('Sangriento', 3, [['damage', 1.4]], { on: ['weapon'] }),
  P('Despiadado', 4, [['damage', 1.6]], { on: ['weapon'] }),
  P('Aniquilador', 5, [['damage', 2]], { on: ['weapon'] }),
  // two things at once
  P('Sagrado', 2, [
    ['con', 0.6],
    ['cha', 0.6],
  ]),
  P('Bendito', 2, [
    ['int', 0.6],
    ['cha', 0.6],
  ]),
  P('Táctico', 2, [
    ['int', 0.6],
    ['dex', 0.6],
  ]),
  P('Bárbaro', 2, [
    ['str', 0.6],
    ['con', 0.6],
  ]),
  P('Atlético', 2, [
    ['str', 0.6],
    ['dex', 0.6],
  ]),
  P('Majestuoso', 3, [
    ['cha', 1],
    ['dr', 0.5],
  ]),
  P('Legendario', 4, [
    ['str', 0.8],
    ['dex', 0.8],
    ['con', 0.8],
  ]),
  P('Divino', 5, [
    ['str', 1],
    ['dex', 1],
    ['con', 1],
    ['int', 1],
    ['cha', 1],
  ]),
  // with a drawback (more bonus, something worse)
  P('Minúsculo', 1, [
    ['dex', 1.5],
    ['str', -0.5],
  ]),
  P('Descomunal', 1, [
    ['str', 1.5],
    ['dex', -0.5],
  ]),
  P('Mohoso', 1, [
    ['con', 1.5],
    ['cha', -0.5],
  ]),
  P('Hortera', 1, [
    ['cha', 1.5],
    ['int', -0.5],
  ]),
  P(
    'Pesado',
    2,
    [
      ['dr', 1.5],
      ['evade', -0.5],
    ],
    { on: ['armor', 'shield'] },
  ),
  P(
    'Inestable',
    2,
    [
      ['damage', 1.5],
      ['dr', -0.5],
    ],
    { on: ['weapon'] },
  ),
  P('Maldito', 3, [
    ['str', 1.2],
    ['dex', 1.2],
    ['cha', -1],
  ]),
  P(
    'Chetado',
    3,
    [
      ['str', 1],
      ['dex', 1],
    ],
    { text: 'Los espectadores se quejan en el chat: −1 a la Popularidad cada vez que ganas un combate.' },
  ),
  // flavour, with a perk
  P('Oxidado', 1, [['dr', 1]], { on: ['armor', 'shield', 'weapon'], text: 'Chirría: −1 a Stealth.' }),
  P('Brillante', 1, [['cha', 1]], { text: 'Da luz tenue en 10 pies.' }),
  P('Silencioso', 2, [['dex', 1]], { text: '+{m} a Stealth.' }),
  P('Gélido', 2, [['con', 1]], { text: 'Mitad de daño de frío.' }),
  P('Ignífugo', 2, [['dr', 1]], { text: 'Mitad de daño de fuego.' }),
  P('Aislante', 2, [['con', 1]], { text: 'Mitad de daño eléctrico.' }),
  P('Vampírico', 4, [['con', 1]], { on: ['weapon'], text: 'Con un Golpe Crítico, recuperas 1 casilla de salud.' }),
  P(INV('Retro'), 1, [['cha', 1]], {
    text: 'Huele a 1996. Los Mobs mayores de 40 se distraen: +1 a Esquiva contra ellos.',
  }),
  P(
    'Tuneado',
    2,
    [
      ['dex', 0.6],
      ['cha', 0.6],
    ],
    { text: 'Luces LED de colores. Cero sigilo.' },
  ),
  P('Patrocinado', 3, [['cha', 1.2]], {
    text: '+1 Popularidad por combate ganado (el logo del patrocinador sale en pantalla).',
  }),
];

/** "del Segador": a role. bonus is smaller than a prefix; text often names a skill (English, as on the sheets). */
const R = (name, lvl, bonus, text = '', extra = {}) => ({ name, lvl, bonus, text, on: WEAR, ...extra });
export const ROLES = [
  R('del Segador', 1, [['str', 0.5]], '+{m} de daño contra Mobs que ya estén por debajo del 50 %.', { on: ['weapon'] }),
  R('del Cazador', 1, [['dex', 0.5]], '+{m} a Perception y Tracking.'),
  R('del Guardián', 1, [['dr', 0.5]], 'Cuando usas Catcher, +{m} a la RD contra ese ataque.'),
  R('del Ladrón', 1, [['dex', 0.5]], '+{m} a Lockpicking y Sleight of Hand.'),
  R('del Aprendiz', 1, [['int', 0.5]], '+{m} a las pruebas de Spell.'),
  R('del Bardo', 1, [['cha', 0.5]], '+{m} a Persuasion y Performance.'),
  R('del Pirata', 1, [['str', 0.5]], '+{m} a Swimming e Intimidate.'),
  R('del Explorador', 1, [['con', 0.5]], '+{m} a Navigation y Survival.'),
  R('del Camionero', 1, [['con', 0.5]], 'Tu límite de carga sube un 50 %.'),
  R('del Fontanero', 1, [['str', 0.5]], '+{m} a las pruebas para abrir, romper o atascar cosas.'),
  R('del Becario', 1, [['int', 0.5]], 'Una vez por sesión, el DJ te dice si una idea es pésima antes de que la hagas.'),
  R('del Cuñado', 1, [['cha', 0.5]], '+{m} a Persuasion… con argumentos que no tienen ningún sentido.'),
  R('del Jubilado', 1, [['con', 0.5]], 'Descansar 1 hora te cura 1 casilla extra.'),
  R('del Repartidor', 1, [['dex', 0.5]], '+5 pies de Movimiento.'),
  R('del Streamer', 2, [['cha', 0.5]], '+1 Popularidad cada vez que haces un Golpe Crítico en directo.'),
  R('del Influencer', 2, [['cha', 0.5]], 'Ventaja en Persuasion con quien te haya visto en la tele.'),
  R('del Speedrunner', 2, [['dex', 0.5]], 'En el primer asalto de cada combate tienes +10 pies de Movimiento.'),
  R('del Monje', 2, [['con', 0.5]], '+{m} a los ataques sin armas.'),
  R('del Gladiador', 2, [['str', 0.5]], '+{m} a Intimidate y a Esquiva cuando el público mira (Jefes y arenas).'),
  R('del Asesino', 2, [['dex', 0.5]], '+{m} de daño contra Mobs que no te han visto.', {
    on: ['weapon', 'accessory', 'armor'],
  }),
  R('del Tanque', 2, [['dr', 0.5]], 'Los Mobs adyacentes tienen −{m} para impactar a tus aliados.', {
    on: ['armor', 'shield'],
  }),
  R('del Berserker', 2, [['str', 0.5]], 'Por debajo del 50 % de salud: +{m} de daño.'),
  R('del Hechicero', 2, [['int', 0.5]], '+{m} al maná máximo (anótalo a mano).'),
  R('del Médico', 2, [['int', 0.5]], '+{m} a First Aid; tu Curar cura 1 casilla más.'),
  R('del Ninja', 3, [['dex', 0.6]], '+{m} a Stealth y a Hide in Shadows.'),
  R(
    'del Paladín',
    3,
    [['con', 0.6]],
    'Una vez por combate, como Interrupción, un aliado adyacente gana +{m} RD contra un ataque.',
    { ability: true },
  ),
  R(
    'del Nigromante',
    3,
    [['int', 0.6]],
    'Una vez por Piso, haces que un cadáver diga sus últimas palabras (una pregunta, una respuesta).',
    { ability: true },
  ),
  R('de la Bruja', 3, [['int', 0.6]], 'Una vez por combate, un Mob a 30 pies hace su próximo ataque con Desventaja.', {
    ability: true,
  }),
  R('del Gourmet', 2, [['con', 0.5]], 'La comida y las pociones te curan 1 casilla más.'),
  R('del Cocinero', 1, [['con', 0.5]], '+{m} a Cooking; tus guisos curan 1 casilla tras un descanso largo.'),
  R('del Campeón', 3, [['str', 0.6]], 'Ventaja en las pruebas contra el Jefe del Piso.'),
  R('del Rey Goblin', 3, [['cha', 0.6]], 'Los goblins te tratan como a un jefe (hasta que dejan de hacerlo).'),
  R('de la Reina', 3, [['cha', 0.6]], 'Ventaja en Persuasion con PNJ de la realeza o la nobleza.'),
  R('del Mercenario', 2, [['str', 0.5]], 'Los comerciantes te hacen un 10 % de descuento… por miedo.'),
  R('del Archimago', 4, [['int', 0.7]], 'Una vez por combate, un hechizo te cuesta la mitad de maná.', {
    ability: true,
  }),
  R(
    'del Dragón',
    4,
    [['str', 0.7]],
    'Una vez por Piso, escupes fuego: cono de 15 pies, {d} de daño de fuego (Esquiva 12+F).',
    { ability: true },
  ),
  R('del Titán', 4, [['con', 0.7]], 'No puedes quedar Derribado.'),
  R('del Héroe del Pueblo', 4, [['cha', 0.7]], '+2 Popularidad cuando salvas a un PNJ.'),
  R(
    'del Señor de la Mazmorra',
    5,
    [['int', 0.8]],
    'Una vez por Piso, el DJ te enseña dónde está la sala segura más cercana.',
    { ability: true },
  ),
  R(
    'del Dios Menor',
    5,
    [
      ['str', 0.5],
      ['con', 0.5],
      ['cha', 0.5],
    ],
    'Una vez por Piso, te levantas de Muriéndote con la mitad de tu salud.',
    { ability: true },
  ),
  R('del Showrunner', 5, [['cha', 0.8]], 'Una vez por Piso, cambias el resultado de una tirada de un Mob por un 1.', {
    ability: true,
  }),
];

/** "de Ciruelos": a theme. Mostly a situational effect written out; some give a small bonus. */
const T = (name, lvl, text, extra = {}) => ({ name, lvl, text, on: WEAR, bonus: [], ...extra });
// creatures: weapons hurt them more, the rest protect you from them
const CREATURES = [
  ['los Goblins', 'goblins'],
  ['las Ratas', 'ratas'],
  ['los Kobolds', 'kobolds'],
  ['los Hobgoblins', 'hobgoblins'],
  ['los Gnolls', 'gnolls'],
  ['las Llamas', 'llamas'],
  ['los Orcos', 'orcos'],
  ['los No Muertos', 'no muertos'],
  ['las Arañas', 'arañas'],
  ['las Babosas', 'babosas'],
  ['los Payasos', 'payasos'],
  ['los Hipopótamos', 'hipopótamos'],
  ['los Mímicos', 'mímicos'],
  ['los Elfos', 'elfos'],
  ['los Enanos', 'enanos'],
  ['los Demonios', 'demonios'],
  ['los Insectos', 'insectos'],
  ['las Bestias', 'bestias'],
  ['los Constructos', 'constructos'],
  ['los Elementales', 'elementales'],
  ['los Fantasmas', 'fantasmas'],
  ['los Trolls', 'trolls'],
  ['las Sirenas', 'sirenas'],
  ['los Pollos', 'pollos'],
];
const BANES = CREATURES.map(([name, who]) =>
  T(`de ${name}`, 1, '', {
    bane: true,
    textBy: {
      weapon: `+{m} de daño contra ${who}.`,
      armor: `+{m} a Esquiva contra ${who}.`,
      shield: `+{m} a la RD contra ${who}.`,
      accessory: `Ventaja en Intimidate y Perception contra ${who}.`,
      consumable: `Contra ${who}, el efecto es el doble.`,
      ammo: `+{m} de daño contra ${who}.`,
    },
    on: [...WEAR, 'consumable', 'ammo'],
  }),
);
const ELEMENTS = [
  ['de Fuego', 'de fuego'],
  ['de Hielo', 'de frío'],
  ['del Rayo', 'eléctrico'],
  ['del Ácido', 'ácido'],
  ['de Veneno', 'de veneno'],
  ['de la Luz', 'radiante'],
];
const ELEMENTAL = ELEMENTS.map(([name, dmg]) =>
  T(name, 2, '', {
    textBy: {
      weapon: `+{d} de daño ${dmg} al impactar.`,
      ammo: `+{d} de daño ${dmg} al impactar.`,
      armor: `Mitad de daño ${dmg}.`,
      shield: `Mitad de daño ${dmg}.`,
      accessory: `Mitad de daño ${dmg}.`,
      consumable: `Además hace {d} de daño ${dmg}.`,
    },
    on: [...WEAR, 'consumable', 'ammo'],
  }),
);
export const THEMES = [
  ...BANES,
  ...ELEMENTAL,
  T('de Ciruelos', 1, 'Una vez al día, al rebuscar, encuentras una ciruela (cura 1 casilla).', { ability: true }),
  T('de la Siesta', 1, 'Tras un descanso corto, recuperas 1 casilla extra de salud.'),
  T('del Lunes', 1, '−1 a todo los lunes del calendario del Sistema; +2 el resto de días. Nadie sabe qué día es.'),
  T('de la Abuela', 1, 'Una vez por Piso, un PNJ mayor te regala comida (cura 2 casillas).', { ability: true }),
  T('de la Resaca', 1, 'Si has bebido alcohol en las últimas 8 horas: +{m} a Esquiva. Si no, −1.'),
  T('de las Escaleras', 1, 'Ventaja para no caerte, resbalar o rodar escaleras abajo.'),
  T('del Pánico', 1, 'Cuando estás por debajo del 30 % de salud, +10 pies de Movimiento (huyendo).'),
  T('de la Oscuridad', 2, 'Ves en la oscuridad hasta 30 pies.'),
  T('del Eco', 1, 'Tus gritos se oyen a 500 pies. Ideal para pedir ayuda. O para atraer Mobs.'),
  T('de los Bolsillos', 1, 'Tienes 2 huecos más de acceso rápido (anótalos a mano).', { on: ['armor'] }),
  T('del Patrocinador', 2, '+1 Popularidad al empezar cada Piso.'),
  T('de la Audiencia', 2, 'Cuando haces algo épico (a juicio del DJ), +1 Popularidad.'),
  T('de Espinas', 2, 'Quien te impacta cuerpo a cuerpo recibe {m} de daño perforante.', { on: ['armor', 'shield'] }),
  T('del Vampiro', 3, 'Con un Golpe Crítico recuperas 1 casilla de salud.', { on: ['weapon'] }),
  T('de la Suerte', 2, 'Una vez por Piso, repites una tirada sin gastar Favor de la IA.', { ability: true }),
  T('del Rebote', 2, 'Una vez por combate, un ataque a distancia que te falla vuelve al atacante.', { ability: true }),
  T('del Retroceso', 2, 'Al impactar, puedes empujar al objetivo 5 pies.', { on: ['weapon', 'shield'] }),
  T('del Último Aliento', 3, 'Cuando quedas Muriéndote, puedes hacer un último ataque gratis.'),
  T('de la Fortuna', 2, 'Encuentras el doble de oro en los cadáveres.'),
  T('del Tesoro', 3, 'Una vez por Piso, el DJ mejora una caja de botín normal tuya un nivel.', { ability: true }),
  T('del Huracán', 3, 'Una vez por combate, tu ataque cuerpo a cuerpo golpea a todos los adyacentes.', {
    ability: true,
    on: ['weapon'],
  }),
  T('de la Marea', 2, 'Respiras bajo el agua y nadas a tu Movimiento normal.'),
  T('de las Mil Caras', 3, 'Una vez por Piso, cambias tu aspecto durante 10 minutos.', { ability: true }),
  T('del Karaoke', 1, 'Si cantas en voz alta, +{m} a Performance. Los Mobs te encuentran siempre.'),
  T('de la Burocracia', 1, 'Ventaja contra trampas con papeleo, cerraduras con formulario y PNJ funcionarios.'),
  T('del Wifi', 1, 'Una vez por Piso, el DJ te da una pista (con poca cobertura).', { ability: true }),
  T('del Rage Quit', 2, 'Una vez por combate, como Interrupción, te alejas 20 pies sin provocar ataques.', {
    ability: true,
  }),
  T('del Tryhard', 2, '+{m} a una prueba que hayas fallado justo antes (la misma).'),
  T('del Spawn', 2, 'Tras un descanso largo en una sala segura, recuperas 1 casilla extra.'),
  T('del Farmeo', 2, 'Los Mobs que matas sueltan algo de chatarra de Fabricación (pregunta al DJ).'),
  T('del Jefe Final', 4, '+{m} de daño y +{m} RD contra Jefes.'),
  T('de la Leyenda', 4, '+2 Popularidad al empezar cada Piso. Los PNJ te reconocen.'),
  T('del Apocalipsis', 4, 'Una vez por Piso, durante 1 asalto, todos tus ataques son Golpes Críticos si impactan.', {
    ability: true,
  }),
  T('de la Eternidad', 5, 'No necesitas comer, beber ni dormir (sigues necesitando descansar para curarte).'),
  T('del Sistema', 5, 'Una vez por Piso, haces una pregunta al Sistema y responde con la verdad. Más o menos.', {
    ability: true,
  }),
  T('de los Mil Pisos', 5, 'Al bajar de Piso, ganas 1 punto de atributo.'),
];

/* ---------------- consumable affixes (they change the potency or add a twist) ---------------- */
const CP = (word, lvl, potency, text = '') => ({ word, lvl, potency, text, on: ['consumable', 'ammo'] });
export const CONSUMABLE_PREFIXES = [
  CP('Aguado', 1, -1, 'Sabe a agua de fregar.'),
  CP('Casero', 1, 0, 'Hecho con cariño y sin control sanitario.'),
  CP('Concentrado', 2, 1),
  CP('Burbujeante', 1, 0, 'Al usarlo, eructas: los Mobs a 30 pies te oyen.'),
  CP('Explosivo', 2, 1, 'Hace pupa en 5 pies más.'),
  CP('Perforante', 2, 0, 'Ignora {m} de RD.'),
  CP('Rápido', 3, 0, 'Usarlo no gasta Acción una vez por combate.'),
  CP('Doble', 3, 1, 'Viene en pack de dos.'),
  CP('Prohibido', 3, 2, 'Tira 1d6: con un 1 quedas Mareado 1 asalto.'),
  CP(INV('Premium'), 4, 2),
  CP('Milagroso', 5, 3),
];

/* ---------------- quips from the System AI ---------------- */
const QUIPS = [
  '«{name}. Calidad garantizada o te devolvemos la vida. Ah, no, eso no.»',
  '«El anterior dueño lo dejó de usar. Por motivos de muerte.»',
  '«Nivel de drip: aceptable. Nivel de supervivencia: ya veremos.»',
  '«Hecho a mano por un goblin con mucha prisa y pocas ganas.»',
  '«¿Op? Un poco. ¿Lo van a nerfear? Probablemente.»',
  '«La audiencia ha votado este objeto como “mejor que nada”. Enhorabuena.»',
  '«Si te lo equipas y no pasa nada, es que pasa por dentro.»',
  '«Garantía de dos Pisos. Tú no duras tanto, así que tranqui.»',
  '«Lo encontramos detrás de un sofá en el Piso de los muertos. Huele a eso.»',
  '«Este objeto tiene más estilo que tú. Úsalo con humildad.»',
  '«Instrucciones de uso: póntelo. Instrucciones de seguridad: no.»',
  '«Edición limitada. Como tu esperanza de vida.»',
  '«Los patrocinadores insisten en que lo menciones en voz alta. Hazlo.»',
  '«El Sistema no se responsabiliza de efectos secundarios, ni primarios.»',
  '«Mola. Mola mucho. No preguntes de dónde ha salido la mancha.»',
  '«Loot de calidad para un crawler de calidad dudosa.»',
  '«Brilla. Eso es todo lo que hay que decir.»',
  '«Probado en Mobs. Los Mobs no opinaron, por estar muertos.»',
  '«GG. Bueno, gg en minúsculas.»',
  '«Un clásico de la mazmorra. Como morir en el tutorial.»',
  '«Este objeto ha sido bendecido por un sacerdote. Al menos eso dijo.»',
  '«Pegajoso al tacto. Eso es normal. Creemos.»',
  '«Ideal para lucirlo en la próxima emisión. Sonríe a la cámara.»',
  '«Fabricado en el Piso 3 por un kobold sindicado.»',
  '«Tus enemigos lo temerán. Tus amigos lo querrán. Tu madre no lo aprobaría.»',
];

/* ---------------- tags for the notes ---------------- */
const PART_ES = {
  head: 'Cabeza',
  shoulders: 'Hombros',
  chest: 'Pecho',
  bracers: 'Brazales',
  hands: 'Manos',
  back: 'Espalda',
  waist: 'Cintura',
  pants: 'Piernas',
  feet: 'Pies',
  neck: 'Cuello',
  finger: 'Dedo',
  held: 'En la mano',
};
const STAT_ES = {
  str: 'FUE',
  int: 'INT',
  con: 'CON',
  dex: 'DES',
  cha: 'CAR',
  dr: 'RD',
  evade: 'a Esquiva',
  damage: 'de daño',
};
const fmt = (k, v) => `${v > 0 ? '+' : '−'}${Math.abs(v)} ${STAT_ES[k]}`;

/* ---------------- the generator ---------------- */
/** A small seedable random generator (mulberry32), so tests can repeat a roll. */
export function makeRng(seed = Date.now()) {
  let a = Number(seed) >>> 0 || 1;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const pickOne = (rng, list) => list[Math.floor(rng() * list.length)];
function weighted(rng, list, weightOf) {
  const w = list.map(weightOf);
  const sum = w.reduce((a, b) => a + b, 0);
  if (!sum) return null;
  let r = rng() * sum;
  for (let i = 0; i < list.length; i++) {
    r -= w[i];
    if (r <= 0) return list[i];
  }
  return list[list.length - 1];
}

/** A quality for this Floor (by its odds). */
export function rollQuality(floor, rng = Math.random) {
  const odds = qualityOdds(floor);
  return weighted(rng, QUALITIES, (q) => odds[q]);
}

/** How many affixes: the usual number for the quality, with ~15% surprises (one more or one less). */
function affixCount(rank, rng) {
  let n = AFFIXES[rank];
  const r = rng();
  if (r < 0.08) n -= 1;
  else if (r < 0.15) n += 1;
  if (rank === 0) n = Math.min(n, 0); // common items are plain
  return Math.max(0, Math.min(3, n));
}

/** Pick an affix fitting the item: allowed level for its quality, stronger ones preferred on better items. */
function pickAffix(rng, list, kind, rank) {
  const max = Math.max(1, MAX_LEVEL[rank]);
  const ok = list.filter((a) => a.lvl <= max && a.on.includes(kind));
  // a mild preference for the strongest ones allowed; the 24 creature banes count as a family, not 24 picks
  return weighted(rng, ok, (a) => (1 + a.lvl / max) * (a.bane ? 0.3 : 1));
}

const roundMag = (m, f) => {
  const v = Math.round(m * f);
  return f > 0 ? Math.max(1, v) : Math.min(-1, v);
};

const KIND_FILTER = {
  armor: (b) => b.kind === 'armor',
  weapon: (b) => b.kind === 'weapon',
  shield: (b) => b.kind === 'shield',
  accessory: (b) => b.kind === 'accessory',
  consumable: (b) => b.kind === 'consumable',
  ammo: (b) => b.kind === 'ammo',
};
/** How often each kind comes up when the GM leaves it on "any". */
const KIND_WEIGHT = { armor: 4, weapon: 3, shield: 1, accessory: 3, consumable: 2, ammo: 1 };

/**
 * Generate one item. opts: floor (1–18), quality ('' = by the Floor's odds), kind ('' = any; 'equipment' = armor,
 * weapon or shield), part (a body part, 'held' or 'finger'… '' = any), rng (for tests).
 * Returns a sheet item (shared/items.js shape) plus `gen` with what was rolled.
 */
export function generateItem(opts = {}) {
  const rng = opts.rng ?? Math.random;
  const floor = Math.max(1, Math.min(18, Number(opts.floor) || 1));
  const quality = QUALITIES.includes(opts.quality) ? opts.quality : rollQuality(floor, rng);
  const rank = RANK[quality];
  // the base
  let bases = BASES;
  if (opts.kind === 'equipment') bases = bases.filter((b) => ['armor', 'weapon', 'shield'].includes(b.kind));
  else if (opts.kind && KIND_FILTER[opts.kind]) bases = bases.filter(KIND_FILTER[opts.kind]);
  if (opts.part) bases = bases.filter((b) => b.fits === opts.part);
  if (!bases.length) bases = BASES;
  const kinds = [...new Set(bases.map((b) => b.kind))];
  const kind = weighted(rng, kinds, (k) => KIND_WEIGHT[k] ?? 1);
  const base = pickOne(
    rng,
    bases.filter((b) => b.kind === kind),
  );
  const m = MAG[rank];
  const isCons = kind === 'consumable' || kind === 'ammo';

  // the affixes: which positions, then which ones
  // consumables and ammo have no "role"
  const slots = isCons ? ['prefix', 'theme'] : ['prefix', 'role', 'theme'];
  const count = Math.min(slots.length, affixCount(rank, rng));
  const chosen = [];
  while (chosen.length < count) {
    const s = pickOne(
      rng,
      slots.filter((x) => !chosen.includes(x)),
    );
    chosen.push(s);
  }
  const want = (s) => chosen.includes(s);
  const prefix = want('prefix') ? pickAffix(rng, isCons ? CONSUMABLE_PREFIXES : PREFIXES, kind, rank) : null;
  const role = want('role') ? pickAffix(rng, ROLES, kind, rank) : null;
  const theme = want('theme') ? pickAffix(rng, THEMES, kind, rank) : null;

  // bonuses
  const bonus = { damage: '', dr: '', evade: '', str: '', int: '', con: '', dex: '', cha: '' };
  const add = (k, v) => {
    const now = Number(bonus[k]) || 0;
    bonus[k] = String(now + v);
  };
  // the base's own bonus (accessories: a Stat of their own)
  const baseStat = base.stat ?? (kind === 'accessory' ? pickOne(rng, ['str', 'dex', 'con', 'int', 'cha']) : null);
  if (!isCons && baseStat && BASE[rank]) add(baseStat, BASE[rank]);
  for (const a of [prefix, role]) for (const [k, f] of a?.bonus ?? []) add(k, roundMag(m, f));
  for (const k of Object.keys(bonus)) if (bonus[k] === '0') bonus[k] = '';

  // text effects
  const fill = (s) =>
    String(s || '')
      .replace(/\{m\}/g, String(Math.max(1, m)))
      .replace(/\{d\}/g, DICE[rank]);
  const effects = [];
  let ability = '';
  for (const a of [prefix, role, theme]) {
    if (!a) continue;
    const txt = fill(a.textBy?.[kind] ?? a.text);
    if (txt) effects.push(txt);
    if (a.ability && !ability) ability = txt;
  }

  // name: Base Prefix del Rol de Tema
  const name = [base.name, prefix && agree(prefix.word, base.g, base.n), role?.name, theme?.name]
    .filter(Boolean)
    .join(' ');

  // consumables: what the base does, stronger with quality (and the prefix's potency)
  const potency = rank + (prefix?.potency ?? 0);
  let use = '';
  let qty = '1';
  let maxCharges = '';
  if (kind === 'consumable') {
    const heal = Math.max(1, 4 + potency);
    use = {
      heal: `Cura ${heal} casillas de salud.`,
      healSmall: `Cura ${Math.max(1, Math.ceil(heal / 2))} casillas de salud.`,
      mana: potency >= 3 ? 'Recupera todo el maná.' : `Recupera ${3 + potency * 2} de maná.`,
      energy: `Ganas una Acción extra (que no sea de Ataque) este asalto${potency >= 4 ? ' y el siguiente' : ''}. Luego, Fatigado.`,
      bomb: `Lanzar (Acción, 30 pies): ${DICE[Math.min(6, Math.max(1, potency))]} de daño contundente en 5 pies (Esquiva 10+F para la mitad).`,
      fire: `Lanzar (Acción, 30 pies): ${DICE[Math.min(6, Math.max(1, potency))]} de daño de fuego en 5 pies y el suelo arde 1 asalto.`,
      smoke: `Acción: nube de humo de ${10 + potency * 5} pies durante 1 asalto; los ataques a distancia dentro o hacia dentro tienen Desventaja.`,
      food: `Fuera de combate: cura ${Math.max(1, Math.ceil(heal / 3))} casillas de salud.`,
      scroll: `Lanzas un hechizo de Rango ${Math.max(1, potency)} sin gastar maná (el DJ dice cuál, o elige uno que conozcas).`,
      elixir: `Durante 1 hora: +${Math.max(1, Math.ceil(potency / 2))} a un atributo a elegir al beberlo.`,
    }[base.base];
    if (base.base === 'scroll' && rank >= 3) maxCharges = String(rank - 1);
    if (['bomb', 'fire', 'smoke', 'food'].includes(base.base)) qty = String(1 + Math.floor(rng() * 3));
  }
  if (kind === 'ammo') qty = String(10 + Math.floor(rng() * 3) * 5);

  // notes: "[Where] bonuses. Effects.\nIA: «…»"
  const tag =
    kind === 'accessory'
      ? `[Accesorio · ${PART_ES[base.fits]}]`
      : kind === 'consumable' || kind === 'ammo'
        ? ''
        : `[${PART_ES[base.fits]}${base.twoHanded ? ', a dos manos' : ''}]`;
  const bonusTxt = Object.entries(bonus)
    .filter(([, v]) => v)
    .map(([k, v]) => fmt(k, Number(v)))
    .join(', ');
  const weaponTxt =
    kind === 'weapon'
      ? `Cuenta como ${base.skill}${base.ranged ? ` (a distancia, dispara ${base.ammo.toLowerCase()}s)` : ''}.`
      : '';
  const firstLine = [tag, bonusTxt && `${bonusTxt}.`, weaponTxt, use, ...effects].filter(Boolean).join(' ');
  const quip = pickOne(rng, QUIPS).replace('{name}', name);
  const type =
    kind === 'accessory'
      ? 'accessory'
      : kind === 'consumable'
        ? 'consumable'
        : kind === 'ammo'
          ? 'ammunition'
          : 'equipment';

  return {
    item: name,
    qty,
    notes: `${firstLine}\nIA: ${quip}`,
    type,
    rarity: quality,
    unique: false,
    skill: kind === 'weapon' ? base.skill : '',
    upgrades: '',
    fits: isCons ? '' : base.fits,
    twoHanded: !!base.twoHanded,
    ranged: !!base.ranged,
    ammo: base.ammo ?? '',
    ammoType: base.ammoType ?? '',
    charges: '',
    maxCharges,
    ability,
    bonus,
    gen: {
      floor,
      quality,
      kind,
      base: base.name,
      prefix: prefix ? agree(prefix.word, 'm', 's') : '',
      role: role?.name ?? '',
      theme: theme?.name ?? '',
    },
  };
}

/** How many different names the generator can make (for the page's "x combinations" line). */
export function combinations() {
  let n = 0;
  for (const b of BASES) {
    const cons = b.kind === 'consumable' || b.kind === 'ammo';
    const pre = (cons ? CONSUMABLE_PREFIXES : PREFIXES).filter((a) => a.on.includes(b.kind)).length + 1;
    const rol = cons ? 1 : ROLES.filter((a) => a.on.includes(b.kind)).length + 1;
    const the = THEMES.filter((a) => a.on.includes(b.kind)).length + 1;
    n += pre * rol * the;
  }
  return n;
}
