// The campaign's own loot for the Tutorial Floors (Floors 1–2): original items in the spirit of the first book's
// loot boxes (cheap enchanted junk, petty curses, stat jewelry). Calibrated to the Core Rulebook's sample loot:
// Bronze ≈ +1 (one Stat, DR or Evade), Silver ≈ +2 to a Stat or DR, Gold ≈ +3 or two smaller bonuses.
// Names in English (as items appear in the game), effects and System AI text in Spanish (the table plays in
// Spanish). `wear` is the gear slot it's meant for; `floor` the Floor it usually drops on.

const b = (o = {}) => ({ damage: '', dr: '', evade: '', str: '', int: '', con: '', dex: '', cha: '', ...o });

export const HOMEBREW_ITEMS = [
  /* ---------------- Bronze: Floor 1 ---------------- */
  {
    name: 'Enchanted Tube Socks of Mild Haste',
    type: 'armor',
    rarity: 'bronze',
    floor: 1,
    wear: 'feet',
    bonus: b({ evade: '1' }),
    notes:
      '[Pies] +1 a Esquiva. +5 pies de Movimiento mientras no lleves otro calzado encima.\nIA: «Hasta la rodilla, con rayas de gimnasio de los 80 y un leve olor a victoria ajena.»',
  },
  {
    name: 'Hard Hat of Workplace Compliance',
    type: 'armor',
    rarity: 'bronze',
    floor: 1,
    wear: 'head',
    bonus: b({ dr: '1' }),
    notes:
      '[Cabeza] RD +1. Ventaja en las pruebas para no quedar Aturdido por escombros, techos que se caen y trampas de arriba.\nIA: «Homologado según la normativa de un planeta que ya no existe. Enhorabuena.»',
  },
  {
    name: 'Mood Ring of Perpetual Panic',
    type: 'accessory',
    rarity: 'bronze',
    floor: 1,
    wear: 'accessory',
    bonus: b({ cha: '1' }),
    notes:
      '[Accesorio] +1 CAR. La piedra cambia de color según tu ánimo; los demás pueden verlo (y siempre marca «pánico»).\nIA: «La joyería emocional nunca miente. Por desgracia para ti.»',
  },
  {
    name: 'Sweatbands of the Weekend Warrior',
    type: 'armor',
    rarity: 'bronze',
    floor: 1,
    wear: 'arms',
    bonus: b({ str: '1' }),
    notes:
      '[Brazos] +1 FUE. Una vez por día puedes repetir una prueba de Climbing o de Jumping fallida.\nIA: «Rizadas, empapadas y con un logotipo que ya no significa nada. Igual que tú.»',
  },
  {
    name: 'Reading Glasses of Smug Insight',
    type: 'accessory',
    rarity: 'bronze',
    floor: 1,
    wear: 'head',
    bonus: b({ int: '1' }),
    notes:
      '[Cabeza] +1 INT. +1 a Investigation al leer cosas (carteles, notas, letra pequeña de un trato con el Sistema).\nIA: «Te hacen parecer más listo. La parte de parecerlo ya es mucho decir.»',
  },
  {
    name: 'Gardening Kneepads of Grim Resolve',
    type: 'armor',
    rarity: 'bronze',
    floor: 1,
    wear: 'legs',
    bonus: b({ dr: '1' }),
    notes:
      '[Piernas] RD +1. Ponerte de rodillas o levantarte del suelo no te cuesta el Paso.\nIA: «Diseñadas para arrancar malas hierbas. Las malas hierbas aquí abajo tienen dientes.»',
  },
  {
    name: 'Oven Mitt of Minor Fire Resistance',
    type: 'armor',
    rarity: 'bronze',
    floor: 1,
    wear: 'hands',
    bonus: b(),
    notes:
      '[Manos, ocupa una] RD +3 solo contra daño de fuego. Con esa mano puedes coger cosas en llamas o al rojo, pero no empuñar un arma.\nIA: «Estampado de pollitos. Ignífuga. Antidignidad.»',
  },
  {
    name: 'Bedazzled Pet Collar',
    type: 'accessory',
    rarity: 'bronze',
    floor: 1,
    wear: 'accessory',
    bonus: b({ cha: '1' }),
    notes:
      '[Accesorio] +1 CAR. Si lo lleva un crawler animal o una mascota: además +1 a Esquiva contra ataques de Mobs del Primer Piso.\nIA: «Diamantes de imitación, cascabel incluido. La elegancia nunca fue tan ruidosa.»',
  },
  {
    name: 'Enchanted Flip-Flops of Unwanted Attention',
    type: 'armor',
    rarity: 'bronze',
    floor: 1,
    wear: 'feet',
    bonus: b({ dex: '1' }),
    notes:
      '[Pies] +1 DES. −2 a Stealth: hacen «flap, flap» por mucho cuidado que pongas.\nIA: «La audiencia adora un buen efecto de sonido. Tú, no tanto.»',
  },
  {
    name: 'Goblin Earring of Questionable Origin',
    type: 'accessory',
    rarity: 'bronze',
    floor: 1,
    wear: 'accessory',
    bonus: b({ con: '1' }),
    notes:
      '[Accesorio] +1 CON. Hueles un poco a goblin: Ventaja en Persuasion y Negotiation con goblins, Desventaja con todos los demás que tengan nariz.\nIA: «Arrancado de una oreja. Con la oreja aún enganchada, si miras bien.»',
  },
  {
    name: 'Crossing Guard Vest',
    type: 'armor',
    rarity: 'bronze',
    floor: 1,
    wear: 'torso',
    bonus: b({ dr: '1' }),
    notes:
      '[Torso] RD +1. Reflectante: los Mobs te ven a 100 pies en la oscuridad, pero también los aliados (sin penalizaciones para encontrarte).\nIA: «Detén el tráfico. Detén a los Mobs. Bueno, lo primero se te da mejor.»',
  },
  {
    name: 'Toe Ring of Stubbornness',
    type: 'accessory',
    rarity: 'bronze',
    floor: 1,
    wear: 'accessory',
    bonus: b({ con: '1' }),
    notes:
      '[Accesorio] +1 CON. Ventaja en las pruebas para no quedar Derribado.\nIA: «Un anillo para el dedo del pie. Porque los dedos de las manos ya tienen bastante con lo suyo.»',
  },
  {
    name: 'Hockey Stick of Petty Vengeance',
    type: 'weapon',
    rarity: 'bronze',
    floor: 1,
    wear: 'hands',
    bonus: b({ damage: '1' }),
    notes:
      '[Manos] Arma contundente (cuenta como Club). +1 de daño; +1 adicional contra el último Mob que te hizo daño.\nIA: «Cinta aislante en el mango, rencor en el alma.»',
  },
  {
    name: 'Rolling Pin of Domestic Disputes',
    type: 'weapon',
    rarity: 'bronze',
    floor: 1,
    wear: 'hands',
    bonus: b({ damage: '1' }),
    notes:
      '[Manos] Arma contundente (cuenta como Club). +1 de daño. En un Éxito Asombroso el objetivo queda Grogui.\nIA: «Harina incrustada, pasado turbio. La abuela habría estado orgullosa. O aterrada.»',
  },
  {
    name: 'Fanny Pack of Slightly Faster Access',
    type: 'accessory',
    rarity: 'bronze',
    floor: 1,
    wear: 'accessory',
    bonus: b(),
    notes:
      '[Accesorio] Una vez por combate, sacar un objeto del inventario (no del acceso rápido) no gasta Acción.\nIA: «La riñonera ha vuelto. Nunca se fue. Simplemente se escondía de ti.»',
  },
  {
    name: 'Bike Lock Chain',
    type: 'weapon',
    rarity: 'bronze',
    floor: 1,
    wear: 'hands',
    bonus: b(),
    notes:
      '[Manos] Arma contundente de alcance 10 pies (cuenta como Whip). En un Éxito Asombroso puedes dejar al objetivo Agarrado.\nIA: «Sin la bici. La bici ya la robaron, como todo lo demás en tu planeta.»',
  },

  /* ---------------- Silver: end of Floor 1, Floor 2 ---------------- */
  {
    name: 'Silver Ring of Brawn',
    type: 'accessory',
    rarity: 'silver',
    floor: 2,
    wear: 'accessory',
    bonus: b({ str: '2' }),
    notes: '[Accesorio] +2 FUE.\nIA: «Plata de verdad. Bueno, plata del Sistema. Brilla igual.»',
  },
  {
    name: 'Silver Ring of Grace',
    type: 'accessory',
    rarity: 'silver',
    floor: 2,
    wear: 'accessory',
    bonus: b({ dex: '2' }),
    notes: '[Accesorio] +2 DES.\nIA: «Para que tropieces con más estilo.»',
  },
  {
    name: 'Silver Ring of Grit',
    type: 'accessory',
    rarity: 'silver',
    floor: 2,
    wear: 'accessory',
    bonus: b({ con: '2' }),
    notes: '[Accesorio] +2 CON.\nIA: «No te hace invencible. Te hace tardar un poco más en dejar de serlo.»',
  },
  {
    name: 'Silver Ring of Wit',
    type: 'accessory',
    rarity: 'silver',
    floor: 2,
    wear: 'accessory',
    bonus: b({ int: '2' }),
    notes: '[Accesorio] +2 INT.\nIA: «Inteligencia en forma de joya. La única que vas a tener cerca en un tiempo.»',
  },
  {
    name: 'Silver Ring of Swagger',
    type: 'accessory',
    rarity: 'silver',
    floor: 2,
    wear: 'accessory',
    bonus: b({ cha: '2' }),
    notes: '[Accesorio] +2 CAR.\nIA: «El carisma no se compra. Se saquea de una caja de botín, como todo lo bueno.»',
  },
  {
    name: 'Leather Jacket of Questionable Fashion',
    type: 'armor',
    rarity: 'silver',
    floor: 2,
    wear: 'torso',
    bonus: b({ dr: '2', cha: '1' }),
    notes:
      '[Torso] RD +2, +1 CAR. Tras un descanso largo en una sala segura, los cortes y agujeros de la chaqueta se arreglan solos.\nIA: «Cuero sintético, actitud auténtica. Huele a moto que nunca tuviste.»',
  },
  {
    name: "Rollerblader's Kneepads",
    type: 'armor',
    rarity: 'silver',
    floor: 2,
    wear: 'legs',
    bonus: b({ dr: '1' }),
    notes:
      '[Piernas] RD +1 (+2 contra daño contundente). Si quedas Derribado, te levantas sin gastar tu Paso.\nIA: «Con pegatinas de una marca de refrescos que patrocinó tu extinción.»',
  },
  {
    name: 'Enchanted Boxers of Unwarranted Confidence',
    type: 'armor',
    rarity: 'silver',
    floor: 1,
    wear: 'legs',
    bonus: b({ cha: '2' }),
    notes:
      '[Piernas, debajo de lo que sea] +2 CAR. Mientras sea lo único que llevas en las piernas: +1 Popularidad por cada combate que ganes.\nIA: «Corazones rojos sobre fondo blanco. Los espectadores ya han votado: se quedan.»',
  },
  {
    name: 'Sunday League Shin Guards',
    type: 'armor',
    rarity: 'silver',
    floor: 2,
    wear: 'legs',
    bonus: b({ dr: '2' }),
    notes: '[Piernas] RD +2.\nIA: «Protegen las espinillas. El resto de tu cuerpo, que se busque la vida.»',
  },
  {
    name: 'Bike Helmet of Concussion Avoidance',
    type: 'armor',
    rarity: 'silver',
    floor: 2,
    wear: 'head',
    bonus: b({ dr: '2' }),
    notes:
      '[Cabeza] RD +2. Ventaja en las pruebas para no quedar Grogui o Aturdido.\nIA: «Con un espejito retrovisor. Para que veas venir lo que te va a matar.»',
  },
  {
    name: 'Potion Bandolier',
    type: 'accessory',
    rarity: 'silver',
    floor: 2,
    wear: 'accessory',
    bonus: b(),
    notes:
      '[Accesorio] Una vez por combate puedes beberte una poción de tu acceso rápido sin gastar Acción.\nIA: «Por fin un accesorio que entiende tus prioridades: beber y no morir, en ese orden.»',
  },
  {
    name: 'Scratched Night-Vision Goggles',
    type: 'accessory',
    rarity: 'silver',
    floor: 2,
    wear: 'head',
    bonus: b(),
    notes:
      '[Cabeza] Ves en la oscuridad total hasta 30 pies (en verde). Desventaja en Perception con luz brillante mientras las lleves puestas.\nIA: «El arañazo tiene forma de pene. No preguntes. Nadie lo sabe.»',
  },
  {
    name: 'Slingshot of Spite',
    type: 'weapon',
    rarity: 'silver',
    floor: 2,
    wear: 'hands',
    bonus: b({ damage: '1' }),
    notes:
      '[Manos] Arma a distancia (cuenta como Slingshot), 60 pies, 1d6 contundente. +1 de daño. +2 para impactar al último Mob que te hizo daño.\nIA: «No olvida. No perdona. No apunta muy bien a nadie más.»',
  },
  {
    name: 'Meat Tenderizer of Overkill',
    type: 'weapon',
    rarity: 'silver',
    floor: 2,
    wear: 'hands',
    bonus: b({ damage: '2' }),
    notes:
      '[Manos] Arma contundente (cuenta como Club). +2 de daño. En un Éxito Asombroso el objetivo queda Tambaleante.\nIA: «Para filetes. Y para lo que se ponga por delante, que hoy en día es lo mismo.»',
  },
  {
    name: 'Hoodie of Sneaky Bastardry',
    type: 'armor',
    rarity: 'silver',
    floor: 2,
    wear: 'torso',
    bonus: b({ dr: '1', dex: '1' }),
    notes:
      '[Torso] RD +1, +1 DES. +1 a Stealth y Hide in Shadows con la capucha puesta.\nIA: «Capucha arriba, autoestima abajo. El uniforme oficial del que se esconde en las esquinas.»',
  },
  {
    name: 'Fingerless Gloves of Sticky Fingers',
    type: 'armor',
    rarity: 'silver',
    floor: 2,
    wear: 'hands',
    bonus: b({ dex: '1' }),
    notes:
      '[Manos] +1 DES. +2 a Lockpicking y Sleight of Hand.\nIA: «Sin dedos, para que los tuyos hagan cosas que tu madre no aprobaría.»',
  },
  {
    name: 'Trash-Can Lid of Last Resort',
    type: 'armor',
    rarity: 'silver',
    floor: 2,
    wear: 'hands',
    bonus: b({ dr: '2' }),
    notes:
      '[Manos, ocupa una] Escudo: RD +2. Una vez por combate, como Interrupción, conviertes un ataque cuerpo a cuerpo que te impacta en un fallo; la tapa sale volando (recogerla gasta una Acción).\nIA: «Abollada, pegajosa y con una lata dentro. Te ha salvado la vida. No la huelas.»',
  },
  {
    name: 'Tough Guy Temporary Tattoo',
    type: 'accessory',
    rarity: 'silver',
    floor: 1,
    wear: 'accessory',
    bonus: b({ con: '1', cha: '1' }),
    notes:
      '[Accesorio] +1 CON, +1 CAR. Se borra tras 3 descansos largos (cuéntalos en las mejoras).\nIA: «“MAMÁ” dentro de un corazón con una calavera. Profundo. Temporal. Como tú.»',
  },

  /* ---------------- Gold: Floor 2 Bosses ---------------- */
  {
    name: 'Golden Ring of Unreasonable Muscle',
    type: 'accessory',
    rarity: 'gold',
    floor: 2,
    wear: 'accessory',
    bonus: b({ str: '3' }),
    notes: '[Accesorio] +3 FUE.\nIA: «Oro de 24 quilates y 0 sutileza.»',
  },
  {
    name: 'Ring of the Second Wind',
    type: 'accessory',
    rarity: 'gold',
    floor: 2,
    wear: 'accessory',
    bonus: b({ con: '1' }),
    notes:
      '[Accesorio] +1 CON. Una vez por Piso, cuando fueses a quedar Muriéndote, te quedas con 1 casilla de salud.\nIA: «El público odia que te mueras antes de la publicidad. Este anillo es puro marketing.»',
  },
  {
    name: 'Neighborhood Championship Belt',
    type: 'accessory',
    rarity: 'gold',
    floor: 2,
    wear: 'accessory',
    bonus: b({ str: '2', cha: '1' }),
    notes:
      '[Accesorio] +2 FUE, +1 CAR. Ventaja en Intimidate. Si lo pierdes en un combate (te lo quitan o lo sueltas), −2 a Popularidad.\nIA: «Campeón indiscutible de una manzana que ya no existe. Los títulos no caducan; los campeones, sí.»',
  },
  {
    name: 'Enchanted Toe Ring of Blistering Speed',
    type: 'accessory',
    rarity: 'gold',
    floor: 2,
    wear: 'accessory',
    bonus: b({ dex: '3' }),
    notes:
      '[Accesorio] +3 DES, +10 pies de Movimiento. Aprieta: tras cada descanso largo pierdes 1 casilla de salud (se cura de forma normal).\nIA: «Te hace rapidísimo y te recuerda cada mañana que la velocidad tiene un precio. En ampollas.»',
  },
  {
    name: 'Tiara of Thoroughly Earned Adoration',
    type: 'accessory',
    rarity: 'gold',
    floor: 2,
    wear: 'head',
    bonus: b({ cha: '3' }),
    notes:
      '[Cabeza] +3 CAR. +1 Popularidad por cada Jefe que derrotes llevándola puesta.\nIA: «Diamantes, ego y una pizca de delirio. Le queda bien a cualquiera que se crea de la realeza.»',
  },
  {
    name: 'Mall Security Riot Shield',
    type: 'armor',
    rarity: 'gold',
    floor: 2,
    wear: 'hands',
    bonus: b({ dr: '3' }),
    notes:
      '[Manos, ocupa una] Escudo: RD +3, +1 a Shield Block. Los aliados detrás de ti (en línea) tienen +1 a Esquiva contra ataques a distancia.\nIA: «“PROPIEDAD DEL CENTRO COMERCIAL”. El centro comercial ya no existe. La propiedad, ahora, eres tú.»',
  },
  {
    name: 'Bowling Shirt of the Lucky Strike',
    type: 'armor',
    rarity: 'gold',
    floor: 2,
    wear: 'torso',
    bonus: b({ dr: '2', dex: '1', cha: '1' }),
    notes:
      '[Torso] RD +2, +1 DES, +1 CAR. Una vez por Piso puedes repetir una tirada de ataque como si gastases Favor de la IA, sin gastarlo.\nIA: «Bordada con el nombre “Gary”. Gary no la va a echar de menos. Gary está muerto.»',
  },

  /* ---------------- Consumables ---------------- */
  {
    name: 'Hobgoblin Smoke Pellet',
    type: 'consumable',
    rarity: 'bronze',
    floor: 1,
    bonus: b(),
    notes:
      'Acción: nube de humo de 10 pies de radio durante 1 asalto. Los ataques a distancia hacia dentro o desde dentro tienen Desventaja.\nIA: «Huele a goblin quemado. Porque eso es, más o menos.»',
  },
  {
    name: 'Suspicious Crawler Biscuit',
    type: 'consumable',
    rarity: 'bronze',
    floor: 1,
    bonus: b(),
    notes:
      'Fuera de combate: cura 1 casilla de salud. Tira 1d6: con un 1, quedas Mareado durante 10 minutos.\nIA: «Fecha de caducidad: sí.»',
  },
  {
    name: 'Glitter Bomb',
    type: 'consumable',
    rarity: 'bronze',
    floor: 1,
    bonus: b(),
    notes:
      'Lanzar (Acción, 30 pies): Explosión de 5 pies. Cada criatura dentro hace una prueba de Esquiva (10+F); si falla, Desventaja en su próximo ataque. El brillo no se va nunca.\nIA: «La audiencia ama el brillo. Los conserjes del Sistema, mucho menos.»',
  },
  {
    name: 'Energy Drink of Questionable Legality',
    type: 'consumable',
    rarity: 'silver',
    floor: 2,
    bonus: b(),
    notes:
      'Acción: ganas una Acción extra (no de Ataque) este asalto y el siguiente. Al acabar el combate quedas Fatigado.\nIA: «Sabor “Rayo Azul”. Ingredientes: sí. Taurina: demasiada. Alma: incluida.»',
  },
  {
    name: 'Scab Glue',
    type: 'consumable',
    rarity: 'silver',
    floor: 2,
    bonus: b(),
    notes:
      'Acción: quita Rastro de sangre y cura 2 casillas de salud. Escuece muchísimo: −1 a todas las pruebas durante 1 asalto.\nIA: «Pegamento de contacto con certificado médico de dudosa procedencia.»',
  },
];
