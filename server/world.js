// World Stats: the Floor the party is on, crawlers still alive in the World Dungeon, time to Level Collapse and the
// Floor's ambience (English and Spanish). Everyone reads it; the GM changes it.

/** Floor defaults: name, days to Level Collapse (Core Rulebook Atlas) and an original ambience text. */
export const FLOORS = {
  1: {
    name: 'The Tutorial Floors: First Floor',
    nameEs: 'Los Pisos Tutoriales: Primer Piso',
    days: 5,
    ambience:
      'Welcome to the dungeon, meatbags. Stone corridors run on forever, lit by torches that never seem to burn down, and the air tastes of wet rock, old blood and whatever the Janitor Mobs are scrubbing off the floor this time. Every hallway spills into a Neighborhood full of things that want to eat you, and a Neighborhood Boss is waiting at the end of it. Saferooms glow like cheap motel signs. Your Game Guide still holds your hand down here. Enjoy it while it lasts.',
    ambienceEs:
      'Bienvenidos a la mazmorra, sacos de carne. Los pasillos de piedra no se acaban nunca, iluminados por antorchas que jamás se consumen, y el aire sabe a roca húmeda, sangre vieja y a lo que sea que estén fregando hoy los Mobs conserjes. Cada pasillo desemboca en un Vecindario lleno de cosas que quieren comerte, y al final espera un Jefe de Vecindario. Las salas seguras brillan como el cartel de un motel de carretera. Tu Guía todavía te lleva de la manita. Disfrútalo mientras dure.',
  },
  2: {
    name: 'The Tutorial Floors: Second Floor',
    nameEs: 'Los Pisos Tutoriales: Segundo Piso',
    days: 6,
    ambience:
      'Same dungeon, new paint job. Cinder block walls streaked with bright orange lichen, white stone floors that show every drop of blood, and corridors that feel a little too wide and a little too quiet. The Bosses have learned to leave their rooms, the Mobs finally carry gold worth rifling their pockets for, and even the Janitor Mobs have opinions now. The training wheels are still on, crawlers, but somebody is loosening the bolts.',
    ambienceEs:
      'La misma mazmorra, con una mano de pintura nueva. Paredes de bloque de hormigón manchadas de liquen naranja chillón, suelos de piedra blanca donde se nota cada gota de sangre y pasillos un poco demasiado anchos y un poco demasiado silenciosos. Los Jefes ya han aprendido a salir de sus salas, los Mobs por fin llevan oro que merece la pena rebuscar y hasta los Mobs conserjes tienen opiniones. Seguís con los ruedines puestos, crawlers, pero alguien está aflojando los tornillos.',
  },
  3: {
    name: 'The Over City',
    nameEs: 'La Sobreciudad',
    days: 8,
    ambience:
      'The ceiling is gone and there is a sky now, with a sun that actually sets, which means nights, which means the things that come out at night. Hundreds of little settlements huddle between the petrified bones of a civilization that died long before you got here, full of friendly NPCs who have no idea what they are or how many times their memories have been rewritten. You picked a Race and a Class on the way in, and your Game Guide stayed behind. From here on, you are on your own.',
    ambienceEs:
      'El techo ha desaparecido y ahora hay cielo, con un sol que de verdad se pone, lo que significa noches, lo que significa las cosas que salen de noche. Cientos de pequeños asentamientos se apiñan entre los huesos petrificados de una civilización que murió mucho antes de que llegarais, llenos de PNJ amables que no tienen ni idea de lo que son ni de cuántas veces les han reescrito la memoria. Elegisteis Raza y Clase al entrar y vuestro Guía se quedó atrás. A partir de aquí, estáis solos.',
  },
  4: {
    name: 'The Iron Tangle',
    nameEs: 'La Maraña de Hierro',
    days: 10,
    ambience:
      "Hope you like trains, because this whole floor is one. A screaming knot of subway lines and named trains, braided around each other in the dark, stations counting up into the hundreds, doors that open on things you will never forget. The air is hot metal, brake dust and somebody else's sweat. Every line only runs one way, the schedules lie, and the stairwells are out there somewhere. Mind the gap, crawlers. The gap is hungry.",
    ambienceEs:
      'Espero que os gusten los trenes, porque este piso entero es uno. Un nudo chirriante de líneas de metro y trenes con nombre, trenzados entre sí en la oscuridad, con estaciones que se cuentan por cientos y puertas que se abren a cosas que no olvidaréis jamás. El aire es metal caliente, polvo de frenos y sudor ajeno. Cada línea va en un solo sentido, los horarios mienten y las escaleras están por ahí, en alguna parte. Cuidado con el hueco, crawlers. El hueco tiene hambre.',
  },
  5: {
    name: 'The Bubbles',
    nameEs: 'Las Burbujas',
    days: 15,
    ambience:
      "Fresh air! Grass! An actual horizon! Don't get excited. The floor is split into sealed bubbles, each one carved into four realms: land, sea, air and the caves underneath, and every realm has a castle with a throne that somebody has to take. Waves hide teeth, floating islands hide long drops, and the tunnels hide worse. Here is the fun part: nobody leaves until every castle in the bubble falls. Hope your neighbors are good at group projects.",
    ambienceEs:
      '¡Aire fresco! ¡Hierba! ¡Un horizonte de verdad! No os emocionéis. El piso está dividido en burbujas selladas, cada una partida en cuatro reinos: tierra, mar, aire y las cuevas de debajo, y cada reino tiene un castillo con un trono que alguien tiene que conquistar. Las olas esconden dientes, las islas flotantes esconden caídas muy largas y los túneles esconden cosas peores. Y ahora lo divertido: nadie sale hasta que caigan todos los castillos de la burbuja. Ojalá a vuestros vecinos se les den bien los trabajos en grupo.',
  },
};
const MAX_FLOOR = 18;

const int = (v, d = 0) => {
  const n = parseInt(String(v ?? '').replace(/[^\d-]/g, ''), 10);
  return Number.isFinite(n) ? n : d;
};
const clip = (v, n) => String(v ?? '').slice(0, n);
const defaultsFor = (floor) =>
  FLOORS[floor] ?? {
    name: `Floor ${floor}`,
    nameEs: `Piso ${floor}`,
    days: 0,
    ambience: '',
    ambienceEs: '',
  };

export function mountWorld(app, { db, auth, adminOnly, live, onFloor }) {
  const EMPTY = { floor: 1, crawlersAlive: null, collapseHours: FLOORS[1].days * 24, custom: {} };
  const getWorld = () => {
    const row = db.prepare(`SELECT value FROM kv WHERE key = 'world'`).get();
    return row ? { ...EMPTY, ...JSON.parse(row.value) } : { ...EMPTY };
  };
  const putWorld = (w) => {
    db.prepare(
      `INSERT INTO kv (key, value) VALUES ('world', ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
    ).run(JSON.stringify(w));
    live.send('world', {});
  };
  /** What everyone sees: the stored values plus this Floor's texts (GM overrides first, then the defaults). */
  const view = (w) => {
    const d = defaultsFor(w.floor);
    const c = w.custom?.[w.floor] ?? {};
    return {
      floor: w.floor,
      name: c.name || d.name,
      nameEs: c.nameEs || c.name || d.nameEs,
      collapseDays: d.days,
      collapseHours: w.collapseHours,
      crawlersAlive: w.crawlersAlive,
      ambience: c.ambience ?? d.ambience,
      ambienceEs: c.ambienceEs ?? d.ambienceEs,
      customized: Object.keys(c).length > 0,
      maxFloor: MAX_FLOOR,
    };
  };

  app.get('/api/world', auth, (_req, res) => res.json(view(getWorld())));

  app.patch('/api/world', auth, adminOnly, (req, res) => {
    const w = getWorld();
    const b = req.body || {};
    if (b.floor !== undefined) {
      const floor = Math.min(MAX_FLOOR, Math.max(1, int(b.floor, w.floor)));
      if (floor !== w.floor) {
        const from = w.floor;
        w.floor = floor;
        // a new Floor starts its own Level Collapse countdown
        w.collapseHours = defaultsFor(floor).days * 24;
        const d = view(w);
        live.postEvent({ event: { type: 'world', action: 'floor', from, to: floor, name: d.name, nameEs: d.nameEs } });
        onFloor?.(floor, b.syncParty !== false);
      }
    }
    if (b.crawlersAlive !== undefined)
      w.crawlersAlive = b.crawlersAlive === null || b.crawlersAlive === '' ? null : Math.max(0, int(b.crawlersAlive));
    if (b.collapseHours !== undefined) w.collapseHours = Math.max(0, int(b.collapseHours));
    if (b.addHours !== undefined) w.collapseHours = Math.max(0, w.collapseHours + int(b.addHours));
    // per-Floor text overrides; { reset: true } goes back to the defaults
    if (b.reset) {
      delete w.custom[w.floor];
    } else {
      const c = { ...(w.custom?.[w.floor] ?? {}) };
      for (const [k, n] of [
        ['name', 80],
        ['nameEs', 80],
        ['ambience', 4000],
        ['ambienceEs', 4000],
      ])
        if (b[k] !== undefined) {
          // text equal to the default isn't an override (so improved defaults still reach this Floor)
          const v = clip(b[k], n);
          if (v === defaultsFor(w.floor)[k]) delete c[k];
          else c[k] = v;
        }
      w.custom = { ...(w.custom ?? {}), [w.floor]: c };
      if (!Object.keys(c).length) delete w.custom[w.floor];
    }
    putWorld(w);
    res.json(view(w));
  });

  return { getFloor: () => getWorld().floor };
}
