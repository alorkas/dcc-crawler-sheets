// The importer's file handling: a .json file, an .html file with the data inside a
// <script type="application/json" id="dcc-import"> block, or pasted text. Format: docs/IMPORT_FORMAT.md.

export const IMPORT_FORMAT = 'dcc-crawler-sheets/import';
export const IMPORT_VERSION = 1;
export const FORMAT_DOC_URL = 'https://github.com/alorkas/dcc-crawler-sheets/blob/main/docs/IMPORT_FORMAT.md';

export class ImportFileError extends Error {
  constructor(public code: 'bad_json' | 'no_data_in_html' | 'not_an_object') {
    super(code);
  }
}

/** The import data in a file's text (JSON, or HTML carrying it). */
export function extractImport(text: string): Record<string, unknown> {
  const src = (text.charCodeAt(0) === 0xfeff ? text.slice(1) : text).trim();
  let data: unknown;
  if (src.startsWith('{') || src.startsWith('[')) {
    try {
      data = JSON.parse(src);
    } catch {
      throw new ImportFileError('bad_json');
    }
  } else {
    const doc = new DOMParser().parseFromString(src, 'text/html');
    const tagged = doc.getElementById('dcc-import');
    const blocks = [
      ...(tagged ? [tagged] : []),
      ...Array.from(doc.querySelectorAll('script[type="application/json"]')).filter((el) => el !== tagged),
    ];
    for (const el of blocks) {
      try {
        const d = JSON.parse(el.textContent ?? '');
        if (el === tagged || d?.format === IMPORT_FORMAT) {
          data = d;
          break;
        }
      } catch {
        if (el === tagged) throw new ImportFileError('bad_json');
      }
    }
    if (data === undefined) throw new ImportFileError('no_data_in_html');
  }
  if (!data || typeof data !== 'object' || Array.isArray(data)) throw new ImportFileError('not_an_object');
  return data as Record<string, unknown>;
}

/** A small example with every section, to start a file from. */
export const IMPORT_TEMPLATE = {
  format: IMPORT_FORMAT,
  version: IMPORT_VERSION,
  title: 'Sesión N · Título · Piso 1',
  achievements: [
    {
      title: 'Nombre del logro',
      description: 'Lo que dice la IA del Sistema (lo leen los jugadores).',
      gmNote: 'Escena 1 · Quién: todos · Condición: lo que tienen que hacer',
      reward: {
        boxes: [
          {
            label: 'Nombre de la caja',
            kind: 'adventurer',
            tier: 'bronze',
            gold: 0,
            items: [
              { item: 'Healing Potion', qty: '1' },
              {
                item: 'Anillo de ejemplo',
                type: 'accessory',
                fits: 'finger',
                rarity: 'bronze',
                bonus: { con: '1' },
                oneOf: 'd2',
              },
              {
                item: 'Pulsera de ejemplo',
                type: 'accessory',
                fits: 'bracers',
                rarity: 'bronze',
                bonus: { str: '1' },
                oneOf: 'd2',
              },
            ],
          },
        ],
        note: '+1 Favor de la IA',
      },
    },
  ],
  quests: [
    {
      title: 'Nombre de la misión',
      description: 'Lo que dice la IA del Sistema.',
      giver: '',
      floor: 1,
      status: 'active',
      assign: 'party',
      objectives: [
        { id: 'e1', text: 'Primera etapa', done: true },
        { id: 'e2', text: 'Segunda etapa', done: false },
      ],
      reward: { levels: 1, note: 'Lo que desbloquea' },
      penalty: 'Qué pasa si se falla',
    },
  ],
  npcs: [
    {
      name: 'Jefe de ejemplo',
      nameEs: 'Jefe de ejemplo',
      kind: 'boss',
      size: 'Grande (5)',
      tags: 'Jefe de Barrio, Humanoide',
      floor: 1,
      level: '5',
      slots: '8',
      slotValue: '3',
      surprise: '12+F',
      evade: '12+F',
      move: '20+S',
      dr: '1',
      stats: {
        str: { score: '10', mod: '+4' },
        int: { score: '5', mod: '+2' },
        con: { score: '8', mod: '+3' },
        dex: { score: '4', mod: '+2' },
        cha: { score: '5', mod: '+2' },
      },
      attacks: [{ name: 'Golpe', toHit: '12+F', damage: '2d6+4 Contundente', range: '5 ft', effect: '' }],
      notes: 'Mecánicas del combate, una por línea.',
      descriptionEs: 'Lo que dice la IA del Sistema de este Mob.',
    },
  ],
  bookNpcs: ['Goblin'],
  stash: [{ item: 'Objeto del cadáver', type: 'special', notes: 'Lo que hace' }],
};
