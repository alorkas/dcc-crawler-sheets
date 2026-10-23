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
  // Floors 6+: the books' Floor names and timers are left for the GM (rename them on this page); original texts
  6: {
    name: 'Floor 6',
    nameEs: 'Piso 6',
    days: 0,
    ambience:
      "Welcome to the deep end, crawlers. Whatever you thought the dungeon was, it was being polite until now. The Floor is bigger than your sense of scale, the rules on the walls change when you're not looking, and the audience numbers have never been higher. That last part should worry you.",
    ambienceEs:
      'Bienvenidos a la parte honda, crawlers. Lo que pensabais que era la mazmorra solo estaba siendo educada hasta ahora. El Piso es más grande que vuestro sentido de la escala, las reglas de las paredes cambian cuando no miráis y la audiencia nunca había sido tan alta. Eso último debería preocuparos.',
  },
  7: {
    name: 'Floor 7',
    nameEs: 'Piso 7',
    days: 0,
    ambience:
      'Somebody in programming got a budget increase and spent all of it on you. Every corner of this Floor is staged like a premiere: lights, music cues, a trap where the hero shot should be. Smile for the cameras. They are definitely smiling at you.',
    ambienceEs:
      'Alguien en programación consiguió más presupuesto y se lo ha gastado entero en vosotros. Cada rincón de este Piso está montado como un estreno: luces, música, una trampa justo donde debería ir el plano del héroe. Sonreíd a las cámaras. Ellas os sonríen a vosotros, seguro.',
  },
  8: {
    name: 'Floor 8',
    nameEs: 'Piso 8',
    days: 0,
    ambience:
      'The air down here hums like a transformer about to blow. Things that were Bosses upstairs are wildlife here, and the wildlife has opinions about you. Saferooms are fewer, farther, and the bartenders have started asking how long you plan to live.',
    ambienceEs:
      'El aire aquí abajo zumba como un transformador a punto de reventar. Lo que arriba eran Jefes aquí es fauna, y la fauna tiene opiniones sobre vosotros. Las salas seguras están más lejos y escasean, y los camareros han empezado a preguntar cuánto pensáis vivir.',
  },
  9: {
    name: 'Floor 9',
    nameEs: 'Piso 9',
    days: 0,
    ambience:
      "Halfway to nowhere. The dungeon has stopped testing whether you can survive and started testing whether you'll make good television while you try. Alliances form, alliances rot. Keep your friends close and your loot boxes closer.",
    ambienceEs:
      'A mitad de camino hacia ninguna parte. La mazmorra ha dejado de comprobar si podéis sobrevivir y ahora comprueba si dais buena televisión mientras lo intentáis. Las alianzas nacen y se pudren. Mantened cerca a vuestros amigos, y más cerca aún vuestras cajas de botín.',
  },
  10: {
    name: 'Floor 10',
    nameEs: 'Piso 10',
    days: 0,
    ambience:
      "Double digits, baby. The sponsors are circling like vultures with credit lines. Every fight down here is somebody's highlight reel, and every mistake is somebody else's blooper compilation. You're a brand now. Try not to get discontinued.",
    ambienceEs:
      'Dobles dígitos, cariño. Los patrocinadores vuelan en círculos como buitres con líneas de crédito. Cada pelea aquí abajo es el vídeo de mejores momentos de alguien, y cada error, el vídeo de tomas falsas de otro. Ahora sois una marca. Intentad que no os descataloguen.',
  },
  11: {
    name: 'Floor 11',
    nameEs: 'Piso 11',
    days: 0,
    ambience:
      'This Floor feels old. Older than the dungeon, older than the show, older than whatever you used to call home. Things sleep in the walls here, and they really, really hate being woken up by idiots with torches.',
    ambienceEs:
      'Este Piso parece viejo. Más que la mazmorra, más que el programa, más que lo que antes llamabais hogar. Aquí duermen cosas dentro de las paredes, y odian de verdad que las despierte un idiota con una antorcha.',
  },
  12: {
    name: 'Floor 12',
    nameEs: 'Piso 12',
    days: 0,
    ambience:
      "The rules are thinner here, like paper held up to a fire. The System AI is watching you more closely than it should, and it's laughing at jokes nobody told. If something offers you a deal, read the fine print. Then read it again. Then run.",
    ambienceEs:
      'Aquí las reglas son más finas, como papel acercado al fuego. La IA del Sistema os observa más de cerca de lo que debería y se ríe de chistes que nadie ha contado. Si algo os ofrece un trato, leed la letra pequeña. Luego leedla otra vez. Luego corred.',
  },
  13: {
    name: 'Floor 13',
    nameEs: 'Piso 13',
    days: 0,
    ambience:
      "Deeper than most crawlers ever get, and the dungeon knows it. Every step down here is a ratings event, every breath is borrowed, and the things that live on this Floor have heard of you. Make it entertaining. You won't get many more chances.",
    ambienceEs:
      'Más hondo de lo que llegan casi todos los crawlers, y la mazmorra lo sabe. Cada paso aquí abajo es un acontecimiento de audiencia, cada respiración es prestada y las cosas que viven en este Piso han oído hablar de vosotros. Haced que sea entretenido. No tendréis muchas más oportunidades.',
  },
  14: {
    name: 'Floor 14',
    nameEs: 'Piso 14',
    days: 0,
    ambience:
      "Deeper than most crawlers ever get, and the dungeon knows it. Every step down here is a ratings event, every breath is borrowed, and the things that live on this Floor have heard of you. Make it entertaining. You won't get many more chances.",
    ambienceEs:
      'Más hondo de lo que llegan casi todos los crawlers, y la mazmorra lo sabe. Cada paso aquí abajo es un acontecimiento de audiencia, cada respiración es prestada y las cosas que viven en este Piso han oído hablar de vosotros. Haced que sea entretenido. No tendréis muchas más oportunidades.',
  },
  15: {
    name: 'Floor 15',
    nameEs: 'Piso 15',
    days: 0,
    ambience:
      "Deeper than most crawlers ever get, and the dungeon knows it. Every step down here is a ratings event, every breath is borrowed, and the things that live on this Floor have heard of you. Make it entertaining. You won't get many more chances.",
    ambienceEs:
      'Más hondo de lo que llegan casi todos los crawlers, y la mazmorra lo sabe. Cada paso aquí abajo es un acontecimiento de audiencia, cada respiración es prestada y las cosas que viven en este Piso han oído hablar de vosotros. Haced que sea entretenido. No tendréis muchas más oportunidades.',
  },
  16: {
    name: 'Floor 16',
    nameEs: 'Piso 16',
    days: 0,
    ambience:
      "Deeper than most crawlers ever get, and the dungeon knows it. Every step down here is a ratings event, every breath is borrowed, and the things that live on this Floor have heard of you. Make it entertaining. You won't get many more chances.",
    ambienceEs:
      'Más hondo de lo que llegan casi todos los crawlers, y la mazmorra lo sabe. Cada paso aquí abajo es un acontecimiento de audiencia, cada respiración es prestada y las cosas que viven en este Piso han oído hablar de vosotros. Haced que sea entretenido. No tendréis muchas más oportunidades.',
  },
  17: {
    name: 'Floor 17',
    nameEs: 'Piso 17',
    days: 0,
    ambience:
      "Deeper than most crawlers ever get, and the dungeon knows it. Every step down here is a ratings event, every breath is borrowed, and the things that live on this Floor have heard of you. Make it entertaining. You won't get many more chances.",
    ambienceEs:
      'Más hondo de lo que llegan casi todos los crawlers, y la mazmorra lo sabe. Cada paso aquí abajo es un acontecimiento de audiencia, cada respiración es prestada y las cosas que viven en este Piso han oído hablar de vosotros. Haced que sea entretenido. No tendréis muchas más oportunidades.',
  },
  18: {
    name: 'Floor 18',
    nameEs: 'Piso 18',
    days: 0,
    ambience:
      "Deeper than most crawlers ever get, and the dungeon knows it. Every step down here is a ratings event, every breath is borrowed, and the things that live on this Floor have heard of you. Make it entertaining. You won't get many more chances.",
    ambienceEs:
      'Más hondo de lo que llegan casi todos los crawlers, y la mazmorra lo sabe. Cada paso aquí abajo es un acontecimiento de audiencia, cada respiración es prestada y las cosas que viven en este Piso han oído hablar de vosotros. Haced que sea entretenido. No tendréis muchas más oportunidades.',
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

/**
 * Is this crawler in a Saferoom (where loot boxes can be opened)? Party members follow the party's switch on World
 * Stats; anyone else has their own switch (set by the GM on the sheet).
 */
export function inSaferoom(db, row) {
  if (!row) return false;
  if (!row.party_since) return !!row.saferoom;
  const w = db.prepare(`SELECT value FROM kv WHERE key = 'world'`).get();
  return !!JSON.parse(w?.value || '{}').saferoom;
}

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
      autoClock: !!w.autoClock,
      saferoom: !!w.saferoom,
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
    // "2 hours passed" also runs the Level Collapse clock
    if (b.autoClock !== undefined) w.autoClock = !!b.autoClock;
    // the party is in a Saferoom: loot boxes can be opened (achievements and quests listen for it)
    if (b.saferoom !== undefined && !!b.saferoom !== !!w.saferoom) {
      w.saferoom = !!b.saferoom;
      live.postEvent({ event: { type: 'world', action: 'saferoom', on: w.saferoom } });
      live.send('boxes', {});
    }
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

  return {
    getFloor: () => getWorld().floor,
    /** Time passed in the dungeon (the party's "2 hours passed"), when the GM ties the clock to it. */
    timePassed(hours) {
      const w = getWorld();
      if (!w.autoClock) return;
      w.collapseHours = Math.max(0, w.collapseHours - hours);
      putWorld(w);
    },
  };
}
