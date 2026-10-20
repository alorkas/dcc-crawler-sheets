// The campaign's own loot for the Tutorial Floors (Floors 1–2): original items in the spirit of the first book's
// loot boxes (cheap enchanted junk, petty curses, stat jewelry). Calibrated to the Core Rulebook's sample loot:
// Bronze ≈ +1 (one Stat, DR or Evade), Silver ≈ +2 to a Stat or DR, Gold ≈ +3 or two smaller bonuses.
// All in Spanish (the table plays in Spanish), in a gamer-ish, slangy Spain register. Skill names use their
// Spanish names (shared/namesEs.js; the sheets show them in Spanish too). `fits` is where it's worn (shared/items.js); `floor` the Floor it
// usually drops on.

const b = (o = {}) => ({ damage: '', dr: '', evade: '', str: '', int: '', con: '', dex: '', cha: '', ...o });

export const HOMEBREW_ITEMS = [
  /* ---------------- Bronze: Floor 1 ---------------- */
  {
    name: 'Calcetines Chetados de Polideportivo',
    type: 'equipment',
    rarity: 'bronze',
    floor: 1,
    fits: 'feet',
    bonus: b({ evade: '1' }),
    notes:
      '[Pies] +1 a Esquiva. +5 pies de Movimiento mientras no lleves otro calzado encima.\nIA: «Hasta la rodilla, rayas de gimnasio ochentero y un tufillo a victoria ajena. Buff de velocidad, nerf de olor.»',
  },
  {
    name: 'Casco de Obra Homologado (Más o Menos)',
    type: 'equipment',
    rarity: 'bronze',
    floor: 1,
    fits: 'head',
    bonus: b({ dr: '1' }),
    notes:
      '[Cabeza] RD +1. Ventaja en las pruebas para no quedar Aturdido por escombros, techos que se caen y trampas de arriba.\nIA: «Cumple la normativa de un planeta que ya no existe. Prevención de riesgos laborales: speedrun any%.»',
  },
  {
    name: 'Anillo del Humor en Pánico Perpetuo',
    type: 'accessory',
    rarity: 'bronze',
    floor: 1,
    fits: 'finger',
    bonus: b({ cha: '1' }),
    notes:
      '[Accesorio · Dedo] +1 CAR. La piedra cambia de color según tu rollo y todo el mundo lo ve (spoiler: siempre marca «pánico»).\nIA: «La joyería emocional no miente. Y tú vas en modo rage desde el tutorial.»',
  },
  {
    name: 'Muñequeras del Guerrero de Finde',
    type: 'equipment',
    rarity: 'bronze',
    floor: 1,
    fits: 'bracers',
    bonus: b({ str: '1' }),
    notes:
      '[Brazales] +1 FUE. Una vez al día puedes repetir una prueba de Escalada o de Salto que hayas fallado.\nIA: «Empapadas, rizadas y con un logo que ya no significa nada. Como tu suscripción al gym.»',
  },
  {
    name: 'Gafas de Leer del Cuñao Sabelotodo',
    type: 'accessory',
    rarity: 'bronze',
    floor: 1,
    fits: 'head',
    bonus: b({ int: '1' }),
    notes:
      '[Accesorio · Cabeza] +1 INT. +1 a Investigación al leer cosas (carteles, notas, la letra pequeña de un trato con el Sistema).\nIA: «Te hacen parecer más listo. Lo de parecerlo ya es mucho pedir, crack.»',
  },
  {
    name: 'Rodilleras de Jardinero Tryhard',
    type: 'equipment',
    rarity: 'bronze',
    floor: 1,
    fits: 'pants',
    bonus: b({ dr: '1' }),
    notes:
      '[Piernas] RD +1. Ponerte de rodillas o levantarte del suelo no te gasta el Paso.\nIA: «Hechas para arrancar malas hierbas. Las malas hierbas de aquí abajo tienen dientes y aggro.»',
  },
  {
    name: 'Manopla de Horno Antiflama',
    type: 'equipment',
    rarity: 'bronze',
    floor: 1,
    fits: 'hands',
    bonus: b(),
    notes:
      '[Manos] RD +3 solo contra daño de fuego. Con esa mano puedes pillar cosas ardiendo o al rojo, pero no empuñar un arma.\nIA: «Estampado de pollitos. Ignífuga. Antidignidad. El meta del fuego, literalmente.»',
  },
  {
    name: 'Collar de Perrete con Brilli-Brilli',
    type: 'accessory',
    rarity: 'bronze',
    floor: 1,
    fits: 'neck',
    bonus: b({ cha: '1' }),
    notes:
      '[Accesorio · Cuello] +1 CAR. Si lo lleva un crawler animal o una mascota: además +1 a Esquiva contra ataques de Mobs del Primer Piso.\nIA: «Diamantes de imitación y cascabel incluido. Drip máximo, sigilo cero.»',
  },
  {
    name: 'Chanclas Encantadas del Flap-Flap',
    type: 'equipment',
    rarity: 'bronze',
    floor: 1,
    fits: 'feet',
    bonus: b({ dex: '1' }),
    notes:
      '[Pies] +1 DES. −2 a Sigilo: hacen «flap, flap» por mucho cuidado que le pongas.\nIA: «A la audiencia le flipa un buen efecto de sonido. A los Mobs, también: os oyen venir desde el spawn.»',
  },
  {
    name: 'Pendiente Goblin de Dudosa Procedencia',
    type: 'accessory',
    rarity: 'bronze',
    floor: 1,
    fits: 'head',
    bonus: b({ con: '1' }),
    notes:
      '[Accesorio · Cabeza] +1 CON. Hueles un poco a goblin: Ventaja en Persuasión y Negociación con goblins, Desventaja con todo bicho que tenga nariz.\nIA: «Arrancado de una oreja. Con la oreja aún enganchada si miras bien. Loot es loot.»',
  },
  {
    name: 'Chaleco Fosforito del Paso de Cebra',
    type: 'equipment',
    rarity: 'bronze',
    floor: 1,
    fits: 'chest',
    bonus: b({ dr: '1' }),
    notes:
      '[Pecho] RD +1. Reflectante: los Mobs te ven a 100 pies en la oscuridad, pero tus aliados también (cero penalizadores para encontrarte).\nIA: «Paras el tráfico y los Mobs te paran a ti. Básicamente eres un marcador de objetivo con patas.»',
  },
  {
    name: 'Anillo de Pie del Cabezón',
    type: 'accessory',
    rarity: 'bronze',
    floor: 1,
    fits: 'feet',
    bonus: b({ con: '1' }),
    notes:
      '[Accesorio · Pies] +1 CON. Ventaja en las pruebas para no quedar Derribado.\nIA: «Un anillo para el dedo gordo del pie. Porque los de las manos ya van full.»',
  },
  {
    name: 'Stick de Hockey del Rencor Cutre',
    type: 'equipment',
    rarity: 'bronze',
    floor: 1,
    fits: 'held',
    bonus: b({ damage: '1' }),
    notes:
      '[En la mano] Arma contundente (cuenta como Porra). +1 de daño; +1 más contra el último Mob que te hizo daño.\nIA: «Cinta americana en el mango y rencor en el alma. Main de venganza desbloqueado.»',
  },
  {
    name: 'Rodillo de la Bronca Doméstica',
    type: 'equipment',
    rarity: 'bronze',
    floor: 1,
    fits: 'held',
    bonus: b({ damage: '1' }),
    notes:
      '[En la mano] Arma contundente (cuenta como Porra). +1 de daño. Con un Éxito Asombroso el objetivo queda Grogui.\nIA: «Harina incrustada y un pasado muy turbio. La abuela estaría orgullosa. O acojonada.»',
  },
  {
    name: 'Riñonera de Acceso Rapidillo',
    type: 'accessory',
    rarity: 'bronze',
    floor: 1,
    fits: 'waist',
    bonus: b(),
    notes:
      '[Accesorio · Cintura] Una vez por combate, sacar un objeto del inventario (no del acceso rápido) no te gasta Acción.\nIA: «La riñonera ha vuelto. Nunca se fue: solo estaba esperando su momento meta.»',
  },
  {
    name: 'Cadena de Candado Sin Bici',
    type: 'equipment',
    rarity: 'bronze',
    floor: 1,
    fits: 'held',
    bonus: b(),
    notes:
      '[En la mano] Arma contundente con alcance de 10 pies (cuenta como Whip). Con un Éxito Asombroso puedes dejar al objetivo Agarrado.\nIA: «La bici no viene. La bici ya te la robaron, como todo lo demás en tu planeta. F.»',
  },

  /* ---------------- Silver: end of Floor 1, Floor 2 ---------------- */
  {
    name: 'Anillo de Plata del Mazas',
    type: 'accessory',
    rarity: 'silver',
    floor: 2,
    fits: 'finger',
    bonus: b({ str: '2' }),
    notes: '[Accesorio · Dedo] +2 FUE.\nIA: «Plata de verdad. Bueno, plata del Sistema. Brilla igual y pega más.»',
  },
  {
    name: 'Anillo de Plata del Estilazo',
    type: 'accessory',
    rarity: 'silver',
    floor: 2,
    fits: 'finger',
    bonus: b({ dex: '2' }),
    notes: '[Accesorio · Dedo] +2 DES.\nIA: «Para que te comas el suelo con más clase.»',
  },
  {
    name: 'Anillo de Plata del Aguante',
    type: 'accessory',
    rarity: 'silver',
    floor: 2,
    fits: 'finger',
    bonus: b({ con: '2' }),
    notes:
      '[Accesorio · Dedo] +2 CON.\nIA: «No te hace inmortal. Solo tardas un poquito más en hacer respawn… ah, que aquí no hay.»',
  },
  {
    name: 'Anillo de Plata del Cerebrito',
    type: 'accessory',
    rarity: 'silver',
    floor: 2,
    fits: 'finger',
    bonus: b({ int: '2' }),
    notes:
      '[Accesorio · Dedo] +2 INT.\nIA: «Inteligencia en formato joya. La única que vas a tener cerca en una buena temporada.»',
  },
  {
    name: 'Anillo de Plata del Postureo',
    type: 'accessory',
    rarity: 'silver',
    floor: 2,
    fits: 'finger',
    bonus: b({ cha: '2' }),
    notes:
      '[Accesorio · Dedo] +2 CAR.\nIA: «El carisma no se compra: se lootea de una caja, como todo lo bueno de esta vida.»',
  },
  {
    name: 'Chupa de Cuero de Moda Dudosa',
    type: 'equipment',
    rarity: 'silver',
    floor: 2,
    fits: 'chest',
    bonus: b({ dr: '2', cha: '1' }),
    notes:
      '[Pecho] RD +2, +1 CAR. Tras un descanso largo en una sala segura, los cortes y agujeros se arreglan solos.\nIA: «Cuero sintético, actitud de serie. Huele a la moto que nunca tuviste.»',
  },
  {
    name: 'Rodilleras de Patinador Pro',
    type: 'equipment',
    rarity: 'silver',
    floor: 2,
    fits: 'pants',
    bonus: b({ dr: '1' }),
    notes:
      '[Piernas] RD +1 (+2 contra daño contundente). Si quedas Derribado, te levantas sin gastar el Paso.\nIA: «Con pegatinas de una marca de refrescos que patrocinó vuestra extinción. GG.»',
  },
  {
    name: 'Gayumbos Encantados de la Autoestima Injustificada',
    type: 'equipment',
    rarity: 'silver',
    floor: 1,
    fits: 'pants',
    bonus: b({ cha: '2' }),
    notes:
      '[Piernas, debajo de lo que sea] +2 CAR. Mientras sean lo único que llevas en las piernas: +1 Popularidad por cada combate que ganes.\nIA: «Corazones rojos sobre fondo blanco. Los espectadores ya han votado: se quedan. Sin pantalones. Nunca.»',
  },
  {
    name: 'Espinilleras de Liga de Domingo',
    type: 'equipment',
    rarity: 'silver',
    floor: 2,
    fits: 'pants',
    bonus: b({ dr: '2' }),
    notes: '[Piernas] RD +2.\nIA: «Protegen las espinillas. El resto del cuerpo, que se busque la vida.»',
  },
  {
    name: 'Casco de Bici Anticonmoción',
    type: 'equipment',
    rarity: 'silver',
    floor: 2,
    fits: 'head',
    bonus: b({ dr: '2' }),
    notes:
      '[Cabeza] RD +2. Ventaja en las pruebas para no quedar Grogui o Aturdido.\nIA: «Trae espejito retrovisor. Para que veas venir lo que te va a dejar KO.»',
  },
  {
    name: 'Bandolera de Pociones del Speedrunner',
    type: 'accessory',
    rarity: 'silver',
    floor: 2,
    fits: 'chest',
    bonus: b(),
    notes:
      '[Accesorio · Pecho] Una vez por combate puedes pimplarte una poción de tu acceso rápido sin gastar Acción.\nIA: «Por fin un accesorio que entiende tus prioridades: beber y no morir, en ese orden.»',
  },
  {
    name: 'Gafas de Visión Nocturna Rayadas',
    type: 'accessory',
    rarity: 'silver',
    floor: 2,
    fits: 'head',
    bonus: b(),
    notes:
      '[Accesorio · Cabeza] Ves en la oscuridad total hasta 30 pies (en verde). Desventaja en Percepción con luz fuerte mientras las lleves puestas.\nIA: «El arañazo tiene forma de pene. No preguntes. Nadie lo sabe. Es lore.»',
  },
  {
    name: 'Tirachinas del Rencor',
    type: 'equipment',
    rarity: 'silver',
    floor: 2,
    fits: 'held',
    ranged: true,
    ammo: 'Piedra',
    bonus: b({ damage: '1' }),
    notes:
      '[En la mano] Arma a distancia (cuenta como Tirachinas), 60 pies, 1d6 contundente; dispara piedras. +1 de daño. +2 para impactar al último Mob que te hizo daño.\nIA: «No olvida. No perdona. Eso sí, a cualquier otro le apunta de pena.»',
  },
  {
    name: 'Mazo de Filetes del Overkill',
    type: 'equipment',
    rarity: 'silver',
    floor: 2,
    fits: 'held',
    bonus: b({ damage: '2' }),
    notes:
      '[En la mano] Arma contundente (cuenta como Porra). +2 de daño. Con un Éxito Asombroso el objetivo queda Tambaleante.\nIA: «Para ablandar filetes. Y lo que se ponga delante, que hoy en día viene a ser lo mismo.»',
  },
  {
    name: 'Sudadera del Cabrón Sigiloso',
    type: 'equipment',
    rarity: 'silver',
    floor: 2,
    fits: 'chest',
    bonus: b({ dr: '1', dex: '1' }),
    notes:
      '[Pecho] RD +1, +1 DES. +1 a Sigilo y Esconderse en las Sombras con la capucha puesta.\nIA: «Capucha arriba, autoestima abajo. El uniforme oficial del que campea en las esquinas.»',
  },
  {
    name: 'Guantes sin Dedos del Mano Larga',
    type: 'equipment',
    rarity: 'silver',
    floor: 2,
    fits: 'hands',
    bonus: b({ dex: '1' }),
    notes:
      '[Manos] +1 DES. +2 a Ganzúas y Juego de Manos.\nIA: «Sin dedos, para que los tuyos hagan cosas que tu madre no aprobaría.»',
  },
  {
    name: 'Tapa de Contenedor de Último Recurso',
    type: 'equipment',
    rarity: 'silver',
    floor: 2,
    fits: 'held',
    bonus: b({ dr: '2' }),
    notes:
      '[En la mano] Escudo: RD +2. Una vez por combate, como Interrupción, conviertes en fallo un ataque cuerpo a cuerpo que te impacta; la tapa sale volando (recogerla gasta una Acción).\nIA: «Abollada, pegajosa y con una lata dentro. Te ha salvado la vida. No la huelas, en serio.»',
  },
  {
    name: 'Tatuaje Temporal de Malote',
    type: 'accessory',
    rarity: 'silver',
    floor: 1,
    fits: 'chest',
    bonus: b({ con: '1', cha: '1' }),
    notes:
      '[Accesorio · Pecho] +1 CON, +1 CAR. Se borra tras 3 descansos largos (cuéntalos en las mejoras).\nIA: «“MAMÁ” en un corazón con una calavera. Profundo. Temporal. Como tu racha de victorias.»',
  },

  /* ---------------- Gold: Floor 2 Bosses ---------------- */
  {
    name: 'Anillo de Oro del Mamadísimo',
    type: 'accessory',
    rarity: 'gold',
    floor: 2,
    fits: 'finger',
    bonus: b({ str: '3' }),
    notes: '[Accesorio · Dedo] +3 FUE.\nIA: «Oro de 24 quilates y cero sutileza. Día de pierna: todos los días.»',
  },
  {
    name: 'Anillo del Respawn de Pobre',
    type: 'accessory',
    rarity: 'gold',
    floor: 2,
    fits: 'finger',
    bonus: b({ con: '1' }),
    notes:
      '[Accesorio · Dedo] +1 CON. Una vez por Piso, cuando fueses a quedar Muriéndote, te quedas con 1 casilla de salud.\nIA: «A la audiencia le jode que palmes antes de los anuncios. Este anillo es puro marketing.»',
  },
  {
    name: 'Cinturón de Campeón del Barrio',
    type: 'accessory',
    rarity: 'gold',
    floor: 2,
    fits: 'waist',
    bonus: b({ str: '2', cha: '1' }),
    notes:
      '[Accesorio · Cintura] +2 FUE, +1 CAR. Ventaja en Intimidar. Si lo pierdes en un combate (te lo quitan o lo sueltas), −2 a Popularidad.\nIA: «Campeón indiscutible de una manzana que ya no existe. Los títulos no caducan; los campeones, sí.»',
  },
  {
    name: 'Anillo de Pie Supersónico (y Ampollas)',
    type: 'accessory',
    rarity: 'gold',
    floor: 2,
    fits: 'feet',
    bonus: b({ dex: '3' }),
    notes:
      '[Accesorio · Pies] +3 DES, +10 pies de Movimiento. Aprieta que flipas: tras cada descanso largo pierdes 1 casilla de salud (se cura de forma normal).\nIA: «Vas rotísimo y cada mañana te recuerda que la velocidad tiene un precio. En ampollas.»',
  },
  {
    name: 'Tiara de la Adoración Merecidísima',
    type: 'accessory',
    rarity: 'gold',
    floor: 2,
    fits: 'head',
    bonus: b({ cha: '3' }),
    notes:
      '[Accesorio · Cabeza] +3 CAR. +1 Popularidad por cada Jefe que derrotes llevándola puesta.\nIA: «Diamantes, ego y una pizca de delirio. Le queda de lujo a cualquiera que se crea de la realeza.»',
  },
  {
    name: 'Escudo Antidisturbios de Segurata de Centro Comercial',
    type: 'equipment',
    rarity: 'gold',
    floor: 2,
    fits: 'held',
    bonus: b({ dr: '3' }),
    notes:
      '[En la mano] Escudo: RD +3, +1 a Bloqueo con Escudo. Los aliados detrás de ti (en línea) tienen +1 a Esquiva contra ataques a distancia.\nIA: «“PROPIEDAD DEL CENTRO COMERCIAL”. El centro comercial ya no existe. Ahora el tanque eres tú.»',
  },
  {
    name: 'Camisa de Bolos del Pleno de la Suerte',
    type: 'equipment',
    rarity: 'gold',
    floor: 2,
    fits: 'chest',
    bonus: b({ dr: '2', dex: '1', cha: '1' }),
    notes:
      '[Pecho] RD +2, +1 DES, +1 CAR. Una vez por Piso puedes repetir una tirada de ataque como si gastases Favor de la IA, pero sin gastarlo.\nIA: «Lleva bordado “Gary”. Gary no la va a echar de menos. Gary está muerto. F por Gary.»',
  },

  /* ---------------- Consumables ---------------- */
  {
    name: 'Bomba de Humo Hobgoblin',
    type: 'consumable',
    rarity: 'bronze',
    floor: 1,
    bonus: b(),
    notes:
      'Acción: nube de humo de 10 pies de radio durante 1 asalto. Los ataques a distancia hacia dentro o desde dentro tienen Desventaja.\nIA: «Huele a goblin quemado. Porque es, más o menos, eso.»',
  },
  {
    name: 'Galleta Crawler Sospechosa',
    type: 'consumable',
    rarity: 'bronze',
    floor: 1,
    bonus: b(),
    notes:
      'Fuera de combate: cura 1 casilla de salud. Tira 1d6: con un 1 quedas Mareado durante 10 minutos.\nIA: «Fecha de caducidad: sí. Sabor: random.»',
  },
  {
    name: 'Bomba de Purpurina',
    type: 'consumable',
    rarity: 'bronze',
    floor: 1,
    bonus: b(),
    notes:
      'Lanzar (Acción, 30 pies): explosión de 5 pies. Cada criatura dentro hace una prueba de Esquiva (10+F); si falla, Desventaja en su próximo ataque. La purpurina no se va nunca.\nIA: «A la audiencia le chifla el brilli-brilli. A los de la limpieza del Sistema, bastante menos.»',
  },
  {
    name: 'Bebida Energética de Legalidad Dudosa',
    type: 'consumable',
    rarity: 'silver',
    floor: 2,
    bonus: b(),
    notes:
      'Acción: ganas una Acción extra (que no sea de Ataque) este asalto y el siguiente. Al acabar el combate quedas Fatigado.\nIA: «Sabor “Rayo Azul”. Taurina: demasiada. Alma: incluida. Bajón: garantizado.»',
  },
  {
    name: 'Pegamento de Costras',
    type: 'consumable',
    rarity: 'silver',
    floor: 2,
    bonus: b(),
    notes:
      'Acción: quita Rastro de sangre y cura 2 casillas de salud. Escuece que te cagas: −1 a todas las pruebas durante 1 asalto.\nIA: «Pegamento de contacto con un certificado médico de dudosa procedencia. Funciona. No preguntes cómo.»',
  },
];
