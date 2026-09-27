// NPC and Mob stat blocks from the books (Core Rulebook, GM Campaign Toolkit, Par for the Course and its
// pre-generated crawlers): numbers and attacks from the stat block tables; special rules rewritten in our own words
// (with the page for the full text) and original "System AI" descriptions. Server-side only (GM tool). Generated file.
// `prevNotes` / `prevDescriptions` / `prevDescriptionsEs` list what earlier versions generated, so "Add book stat blocks" only replaces text
// nobody edited.

export const BOOK_NPCS = [
  {
    name: 'Back Nine Battle Baboon',
    kind: 'mob',
    size: 'Large (5)',
    tags: 'Primate',
    slots: '4',
    slotValue: '3',
    level: '4',
    surprise: '13',
    evade: '14',
    move: '20+S',
    dr: '2',
    stats: {
      str: {
        score: '6',
        mod: '+3',
      },
      int: {
        score: '1',
        mod: '+1',
      },
      con: {
        score: '6',
        mod: '+3',
      },
      dex: {
        score: '3',
        mod: '+2',
      },
      cha: {
        score: '1',
        mod: '+1',
      },
    },
    attacks: [
      {
        name: 'Golf Club',
        toHit: '15',
        damage: '1d6+3 Bludgeoning',
        range: '',
        effect: '',
      },
    ],
    notes:
      'Golf Ball Pile-On: trigger = any creature takes a golf ball hit → 1d4+1 (minimum) local Baboons gang up on that victim this round.\n\nFull text: Par for the Course p. 13.',
    source: 'Par for the Course p. 13',
    chapter: 'Floor 2 · Par for the Course',
    floor: 2,
    description:
      'Fore, motherfuckers! These baboons treat golf clubs as blunt-force therapy and your skull as the ball. Pro tip: if a golf ball smacks anyone, the whole troop dogpiles that poor bastard for the round. Our sponsor, Caddyshack Crematorium, thanks you for your participation.',
    prevDescriptions: [
      "Welcome to the back nine, where the caddies are apes and the dress code is blunt trauma. These baboons swing clubs like they have a grudge against par. Pro tip: whatever you do, don't get beaned by a golf ball. The whole troop takes it personally.",
    ],
    prevNotes: [
      'Full text: Par for the Course p. 13.',
      'Golf Ball Pile-On: trigger = any creature takes a golf ball hit → 1d4+1 (minimum) local Baboons gang up on that victim this round.\n\nFull text: Par for the Course p. 13.',
    ],
    descriptionEs:
      '¡Fore, hijos de puta! Estos babuinos usan los palos de golf como terapia de choque y tu cráneo como pelota. Pro-Tip: si una bola de golf le da a alguien, toda la tropa se le echa encima a ese pobre cabrón durante el resto de la ronda. Nuestro patrocinador, Crematorios Hoyo 19, os agradece vuestra participación.',
    prevDescriptionsEs: [
      '¡Fore, hijos de puta! Estos babuinos usan los palos de golf como terapia de choque y tu cráneo como pelota. Consejo pro: si una bola de golf le da a alguien, toda la tropa se le echa encima a ese pobre cabrón durante el resto de la ronda. Nuestro patrocinador, Crematorios Hoyo 19, os agradece vuestra participación.',
    ],
  },
  {
    name: 'Derrick Qu',
    kind: 'crawler',
    size: 'Medium (4)',
    tags: 'Human',
    slots: '10',
    slotValue: '4',
    level: '7',
    surprise: '14',
    evade: '16',
    move: '25+S',
    dr: '0',
    stats: {
      str: {
        score: '6',
        mod: '+3',
      },
      int: {
        score: '3',
        mod: '+2',
      },
      con: {
        score: '10',
        mod: '+4',
      },
      dex: {
        score: '11',
        mod: '+4',
      },
      cha: {
        score: '3',
        mod: '+2',
      },
    },
    attacks: [
      {
        name: 'Nutcracker',
        toHit: '15',
        damage: '2d6+3 Bludgeoning',
        range: '',
        effect: 'Major Fail+: Stunned',
      },
    ],
    notes:
      "Nutcracker: it's a shot to the crotch; the Stunned rider only lands on crawlers who have external genitals (balls/penis).\n\nFull text: Par for the Course p. 16.",
    source: 'Par for the Course p. 16',
    chapter: 'Floor 2 · Par for the Course',
    floor: 2,
    description:
      "Derrick Qu, level 7, built an entire career around one move: punching people square in the nuts. Two dice of pure groin trauma, and if you've got the equipment, you're going down Stunned and whimpering. The replay budget for this man is obscene. Pro tip: crawlers without external plumbing, this is your moment to shine.",
    prevDescriptions: [
      "Derrick Qu, level 7, has one signature move and our legal department has asked me to stop describing it. Let's just say his unarmed strike aims low and the replays are always a ratings spike. Viewers, if you're betting on him, bet on the groan from the audience.",
    ],
    prevNotes: [
      'Full text: Par for the Course p. 16.',
      'Nutcracker: the Stunned rider only applies to targets with external genitalia.\n\nFull text: Par for the Course p. 16.',
    ],
    descriptionEs:
      'Derrick Qu, nivel 7, ha construido toda su carrera sobre un único movimiento: darle a la gente un puñetazo en los huevos. Dos dados de trauma inguinal puro, y si tienes el equipamiento, te vas al suelo Stunned y lloriqueando. El presupuesto de repeticiones para este hombre es obsceno. Pro-Tip: crawlers sin fontanería externa, este es vuestro momento de brillar.',
    prevDescriptionsEs: [
      'Derrick Qu, nivel 7, ha construido toda su carrera sobre un único movimiento: darle a la gente un puñetazo en los huevos. Dos dados de trauma inguinal puro, y si tienes el equipamiento, te vas al suelo Stunned y lloriqueando. El presupuesto de repeticiones para este hombre es obsceno. Consejo pro: crawlers sin fontanería externa, este es vuestro momento de brillar.',
    ],
  },
  {
    name: 'General Kong',
    kind: 'boss',
    size: 'Huge (6)',
    tags: 'Neighborhood Boss, Primate',
    slots: '10',
    slotValue: '4',
    level: '10',
    surprise: '14',
    evade: '16',
    move: '20',
    dr: '4',
    stats: {
      str: {
        score: '19',
        mod: '+4',
      },
      int: {
        score: '5',
        mod: '+2',
      },
      con: {
        score: '15',
        mod: '+4',
      },
      dex: {
        score: '10',
        mod: '+4',
      },
      cha: {
        score: '6',
        mod: '+3',
      },
    },
    attacks: [
      {
        name: 'Kong Smash',
        toHit: '16',
        damage: '3d6+4 bludgeoning',
        range: '5ft range',
        effect: '',
      },
      {
        name: 'Explosive Barrel',
        toHit: '14',
        damage: '2d8 Bludgeoning',
        range: '60ft range, 20ft Blast radius',
        effect: 'once per round',
      },
    ],
    notes:
      'Commanding: as an Action, grants all his Baboons +2 damage on their golf club attacks. Only used while every PC is at 30% Health Bar or higher and at least three Baboons remain.\nTyrannical Loyalty: if a single hit would cost Kong 4+ Health Bar slots, the nearest Baboon (if any) takes that damage instead.\nExplosive Barrel: once per round.\nJar Crack: the first Amazing Success or better against Kong makes him drop and shatter the peanut butter jar. Rosie is released at full size but dying (lid not removed); she dies after two rounds (Con Mod +2) unless the crawlers intervene, forcing a choice between the fight and the rescue.\n\nFull text: Par for the Course p. 24.',
    source: 'Par for the Course p. 24',
    chapter: 'Floor 2 · Par for the Course',
    floor: 2,
    description:
      "General Kong: ten levels of barrel-hurling gorilla, a baboon army, and a peanut butter jar he's clutching like a security blanket. He'll throw a baboon in front of any big hit, the selfish prick. Pro tip: crit him hard and something precious smashes on the floor. Then you get two rounds to decide whether you're a hero or a winner. Ratings love a moral crisis.",
    prevDescriptions: [
      'Ten-level, barrel-chucking gorilla warlord with a baboon army and a jar of peanut butter he will NOT share. General Kong treats his troops like meat shields, and honestly, respect. Pro tip: land a big crit and something fragile drops. Then you get to pick between winning and being a decent person. Choose live, folks!',
    ],
    prevNotes: [
      'Special: Commanding; Tyrannical Loyalty. Full text: Par for the Course p. 24.',
      'Commanding: as an Action, grants all his Baboons +2 damage on their golf club attacks. Only used while every PC is at 30% Health Bar or higher and at least three Baboons remain.\nTyrannical Loyalty: if a single hit would cost Kong 4+ Health Bar slots, the nearest Baboon (if any) takes that damage instead.\nExplosive Barrel: once per round.\nJar Crack: the first Amazing Success or better against Kong makes him drop and shatter the peanut butter jar. Rosie is released at full size but dying (lid not removed); she dies after two rounds (Con Mod +2) unless the crawlers intervene, forcing a choice between the fight and the rescue.\n\nFull text: Par for the Course p. 24.',
    ],
    descriptionEs:
      'General Kong: diez niveles de gorila lanzabarriles, un ejército de babuinos y un bote de crema de cacahuete al que se aferra como a su mantita. Pone a un babuino delante de cualquier golpe gordo, el muy cabrón egoísta. Pro-Tip: métele un crítico bien fuerte y algo muy preciado se hará añicos contra el suelo. Luego tienes dos rondas para decidir si eres un héroe o un ganador. A la audiencia le chifla una crisis moral.',
    prevDescriptionsEs: [
      'General Kong: diez niveles de gorila lanzabarriles, un ejército de babuinos y un bote de crema de cacahuete al que se aferra como a su mantita. Pone a un babuino delante de cualquier golpe gordo, el muy cabrón egoísta. Consejo pro: métele un crítico bien fuerte y algo muy preciado se hará añicos contra el suelo. Luego tienes dos rondas para decidir si eres un héroe o un ganador. A la audiencia le chifla una crisis moral.',
    ],
  },
  {
    name: 'Rat',
    kind: 'mob',
    size: 'Tiny (1)',
    tags: 'Beastly',
    slots: '1',
    slotValue: '1',
    level: '1',
    surprise: '11+F',
    evade: '11+F',
    move: '20+S',
    dr: '0',
    stats: {
      str: {
        score: '3',
        mod: '+2',
      },
      int: {
        score: '1',
        mod: '+1',
      },
      con: {
        score: '1',
        mod: '+1',
      },
      dex: {
        score: '2',
        mod: '+1',
      },
      cha: {
        score: '1',
        mod: '+1',
      },
    },
    attacks: [
      {
        name: 'Bite',
        toHit: '12+F',
        damage: '1d4+2 Piercing',
        range: '5ft range',
        effect: 'Major Fail+: Poison',
      },
    ],
    notes:
      'Janitor Mob: Floor 1 cleanup duty; eats corpses first. Hostile to crawlers only if provoked or no other meal is around.\n\nFull text: GM Campaign Toolkit p. 13.',
    source: 'GM Campaign Toolkit p. 13',
    chapter: 'Floor 1 · GM Toolkit',
    floor: 1,
    description:
      "The rat. My janitorial staff. Nature's garbage disposal. They'll happily munch on your dead teammate instead of you, which is the nicest thing anyone down here will ever do for you. Pro tip: leave a fresh corpse lying around and they'll leave you the fuck alone. Everybody wins, except Kevin.",
    prevDescriptions: [
      "Ah, the humble rat, my unpaid custodial staff. They tidy up the dead so the next batch of you has somewhere clean to die. Leave them alone and they'll probably leave you alone, unless you're the closest snack. Pro tip: don't be the closest snack.",
    ],
    prevNotes: [
      'Special: Janitor Mob. Full text: GM Campaign Toolkit p. 13.',
      'Janitor Mob: Floor 1 cleanup duty; eats corpses first. Hostile to crawlers only if provoked or no other meal is around.\n\nFull text: GM Campaign Toolkit p. 13.',
    ],
    descriptionEs:
      'La rata. Mi personal de limpieza. El triturador de basura de la naturaleza. Se zamparán encantadas a tu compañero muerto en vez de a ti, que es lo más bonito que nadie hará jamás por ti aquí abajo. Pro-Tip: deja un cadáver fresquito por ahí y te dejarán en paz de cojones. Todos ganan, menos Kevin.',
    prevDescriptionsEs: [
      'La rata. Mi personal de limpieza. El triturador de basura de la naturaleza. Se zamparán encantadas a tu compañero muerto en vez de a ti, que es lo más bonito que nadie hará jamás por ti aquí abajo. Consejo pro: deja un cadáver fresquito por ahí y te dejarán en paz de cojones. Todos ganan, menos Kevin.',
    ],
  },
  {
    name: 'Gobblin’ Gators',
    kind: 'mob',
    size: 'Petite (3)',
    tags: 'Animal',
    slots: '2',
    slotValue: '1',
    level: '2',
    surprise: '11+F',
    evade: '11+F',
    move: '10+S',
    dr: '2',
    stats: {
      str: {
        score: '6',
        mod: '+3',
      },
      int: {
        score: '1',
        mod: '+1',
      },
      con: {
        score: '1',
        mod: '+1',
      },
      dex: {
        score: '2',
        mod: '+1',
      },
      cha: {
        score: '1',
        mod: '+1',
      },
    },
    attacks: [
      {
        name: 'Bite',
        toHit: '13+F',
        damage: '1d6+3 Piercing',
        range: '5ft range',
        effect: 'Major Fail+: Sepsis',
      },
      {
        name: 'Tail Thrash',
        toHit: '13+F',
        damage: '1d8+3 Bludgeoning',
        range: '5ft range',
        effect: 'Major Fail+: Take Down',
      },
    ],
    notes: 'Swim: moves at double speed in water.\n\nFull text: GM Campaign Toolkit p. 18.',
    source: 'GM Campaign Toolkit p. 18',
    chapter: 'Floor 1 · GM Toolkit',
    floor: 1,
    description:
      "Gobblin' Gators, because I pay my branding team in expired soup. On land they're a nuisance; in water they move twice as fast and turn you into a floating buffet with a side of infection. Pro tip: you don't have to outswim the gator. You just have to outswim that asshole next to you.",
    prevDescriptions: [
      "Gators that gobble. Revolutionary branding, I know. On land they're merely dangerous; in the water they're twice as fast and delighted to see you. That bite brings a side of infection, and the tail will put you flat on your back. Stay out of the swamp, or at least swim faster than your friends.",
    ],
    prevNotes: [
      'Special: Swim. Full text: GM Campaign Toolkit p. 18.',
      'Swim: moves at double speed in water.\n\nFull text: GM Campaign Toolkit p. 18.',
    ],
    descriptionEs:
      "Gobblin' Gators, porque a mi equipo de branding le pago en sopa caducada. En tierra son un incordio; en el agua se mueven el doble de rápido y te convierten en un bufé flotante con guarnición de infección. Pro-Tip: no tienes que nadar más rápido que el caimán. Solo más rápido que el gilipollas que tienes al lado.",
    prevDescriptionsEs: [
      "Gobblin' Gators, porque a mi equipo de branding le pago en sopa caducada. En tierra son un incordio; en el agua se mueven el doble de rápido y te convierten en un bufé flotante con guarnición de infección. Consejo pro: no tienes que nadar más rápido que el caimán. Solo más rápido que el gilipollas que tienes al lado.",
    ],
  },
  {
    name: 'Gnawtria',
    kind: 'mob',
    size: 'Petite (3)',
    tags: 'Animal',
    slots: '3',
    slotValue: '2',
    level: '3',
    surprise: '11+F',
    evade: '13+F',
    move: '20+S',
    dr: '1',
    stats: {
      str: {
        score: '3',
        mod: '+2',
      },
      int: {
        score: '1',
        mod: '+1',
      },
      con: {
        score: '3',
        mod: '+2',
      },
      dex: {
        score: '6',
        mod: '+3',
      },
      cha: {
        score: '1',
        mod: '+1',
      },
    },
    attacks: [
      {
        name: 'Bite',
        toHit: '12+F',
        damage: '1d6+2 Piercing',
        range: '5ft range, Armor Piercing',
        effect: 'Major Fail+: Poisoned',
      },
    ],
    notes:
      'Swim: moves through water at normal speed and can hold position (tread water) in place.\n\nFull text: GM Campaign Toolkit p. 18.',
    source: 'GM Campaign Toolkit p. 18',
    chapter: 'Floor 1 · GM Toolkit',
    floor: 1,
    description:
      "Gnawtria: a swamp rat with teeth that go straight through your expensive armor like it's a wet napkin. It treads water, it waits, it bites, and then your leg gets that exciting venom-y tingle. Pro tip: your plate mail is just a lunchbox to this thing. Kill it from shore and don't go wading.",
    prevDescriptions: [
      "Picture a nutria. Now give it teeth that punch straight through your armor and a venom habit. Congratulations, you've invented Gnawtria. It's just as comfy in the water as out of it, so the moat is not the safe zone you think it is.",
    ],
    prevNotes: [
      'Special: Swim. Full text: GM Campaign Toolkit p. 18.',
      'Swim: moves through water at normal speed and can hold position (tread water) in place.\n\nFull text: GM Campaign Toolkit p. 18.',
    ],
    descriptionEs:
      'Gnawtria: una rata de pantano con unos dientes que atraviesan tu carísima armadura como si fuera una servilleta mojada. Flota, espera, muerde, y luego notas en la pierna ese hormigueo venenoso tan emocionante. Pro-Tip: para este bicho tu armadura de placas es una fiambrera. Mátalo desde la orilla y no te metas en el agua.',
    prevDescriptionsEs: [
      'Gnawtria: una rata de pantano con unos dientes que atraviesan tu carísima armadura como si fuera una servilleta mojada. Flota, espera, muerde, y luego notas en la pierna ese hormigueo venenoso tan emocionante. Consejo pro: para este bicho tu armadura de placas es una fiambrera. Mátalo desde la orilla y no te metas en el agua.',
    ],
  },
  {
    name: 'Rayzer',
    kind: 'mob',
    size: 'Petite (2)',
    tags: 'Beastly',
    slots: '3',
    slotValue: '2',
    level: '3',
    surprise: '11+F',
    evade: '13+F',
    move: '20+S',
    dr: '2',
    stats: {
      str: {
        score: '2',
        mod: '+1',
      },
      int: {
        score: '1',
        mod: '+1',
      },
      con: {
        score: '4',
        mod: '+2',
      },
      dex: {
        score: '6',
        mod: '+3',
      },
      cha: {
        score: '1',
        mod: '+1',
      },
    },
    attacks: [
      {
        name: 'Magic Missile Spell',
        toHit: '11+F',
        damage: '1d4+3 Force, Line of',
        range: '',
        effect: 'Special effect',
      },
      {
        name: 'Tail Sting',
        toHit: '11+F',
        damage: '1d4+1 Poison',
        range: '5ft range',
        effect: 'Major Fail+: Taint',
      },
    ],
    notes:
      'Wall Cling: can perch on vertical surfaces or upside down.\nFlight: moves through the air as if on the ground and can hover.\nMagic Missile Spell: range is line of sight.\n\nFull text: GM Campaign Toolkit p. 19.',
    source: 'GM Campaign Toolkit p. 19',
    chapter: 'Floor 1 · GM Toolkit',
    floor: 1,
    description:
      "Oh look, a stingray that clings to the ceiling and casts Magic Missile. Somebody's wizard had a very weird night. If it can see you, it can hit you, and that tail sting leaves a lovely Taint you'll be itching about for weeks. Pro tip: look up, dumbass. The ceiling is not your friend.",
    prevDescriptions: [
      "It's a flying, wall-sticking stingray that casts Magic Missile. Yes, the classic. No, you can't dodge it by hiding behind your buddy, it just needs to see you. And that tail sting leaves a Taint you really don't want to explain to anyone. Look up, crawlers. Always look up.",
    ],
    prevNotes: [
      'Special: Wall Cling; Flight. Full text: GM Campaign Toolkit p. 19.',
      'Wall Cling: can perch on vertical surfaces or upside down.\nFlight: moves through the air as if on the ground and can hover.\nMagic Missile Spell: range is line of sight.\n\nFull text: GM Campaign Toolkit p. 19.',
    ],
    descriptionEs:
      'Anda, mira, una mantarraya que se pega al techo y lanza Magic Missile. El mago de alguien tuvo una noche muy rara. Si te ve, te da, y el aguijón de la cola te deja un Taint precioso que te va a picar durante semanas. Pro-Tip: mira hacia arriba, gilipollas. El techo no es tu amigo.',
    prevDescriptionsEs: [
      'Anda, mira, una mantarraya que se pega al techo y lanza Magic Missile. El mago de alguien tuvo una noche muy rara. Si te ve, te da, y el aguijón de la cola te deja un Taint precioso que te va a picar durante semanas. Consejo pro: mira hacia arriba, gilipollas. El techo no es tu amigo.',
    ],
  },
  {
    name: 'Riff Roughers',
    kind: 'mob',
    size: 'Petite (3)',
    tags: 'Animal',
    slots: '4',
    slotValue: '3',
    level: '4',
    surprise: '11+F',
    evade: '12+F',
    move: '20+S',
    dr: '1',
    stats: {
      str: {
        score: '6',
        mod: '+3',
      },
      int: {
        score: '1',
        mod: '+1',
      },
      con: {
        score: '6',
        mod: '+3',
      },
      dex: {
        score: '3',
        mod: '+2',
      },
      cha: {
        score: '1',
        mod: '+1',
      },
    },
    attacks: [
      {
        name: 'Breath',
        toHit: '13+F',
        damage: '1d4+3 Acid',
        range: '10ft Cone',
        effect: 'Major Fail+: Poisoned',
      },
      {
        name: 'Cutlass',
        toHit: '14+F',
        damage: ': 1d8+3 Slashing',
        range: '5ft range',
        effect: '',
      },
    ],
    notes:
      'Swordsmen: expert blade fighters; their skill is already built into the stat block (no extra modifier).\n\nFull text: GM Campaign Toolkit p. 19.',
    source: 'GM Campaign Toolkit p. 19',
    chapter: 'Floor 1 · GM Toolkit',
    floor: 1,
    description:
      "Riff Roughers: swamp pirates with acid breath so foul it literally melts your face off. Imagine morning breath after a week of battery-flavored rum. They're also expert swordsmen, so trading cutlass blows with them is a fantastic way to get filleted. Pro tip: shoot them from range like the cowards the viewers secretly want you to be.",
    prevDescriptions: [
      'Riff Roughers: part pirate, part swamp beast, all bad breath. Literally, the breath is acid. They also handle a cutlass better than most of you handle a fork. Pro tip: fighting them at range is cowardly, efficient, and highly recommended.',
    ],
    prevNotes: [
      'Special: Swordsmen. Full text: GM Campaign Toolkit p. 19.',
      'Swordsmen: expert blade fighters; their skill is already built into the stat block (no extra modifier).\n\nFull text: GM Campaign Toolkit p. 19.',
    ],
    descriptionEs:
      'Riff Roughers: piratas de pantano con un aliento ácido tan asqueroso que te derrite la cara, literalmente. Imagina el aliento mañanero tras una semana bebiendo ron con sabor a pila. Además son espadachines expertos, así que intercambiar sablazos con ellos es una forma fantástica de acabar fileteado. Pro-Tip: dispárales a distancia, como los cobardes que los espectadores, en el fondo, quieren que seáis.',
    prevDescriptionsEs: [
      'Riff Roughers: piratas de pantano con un aliento ácido tan asqueroso que te derrite la cara, literalmente. Imagina el aliento mañanero tras una semana bebiendo ron con sabor a pila. Además son espadachines expertos, así que intercambiar sablazos con ellos es una forma fantástica de acabar fileteado. Consejo pro: dispárales a distancia, como los cobardes que los espectadores, en el fondo, quieren que seáis.',
    ],
  },
  {
    name: 'Scat Thug',
    kind: 'mob',
    size: 'Petite (3)',
    tags: 'Humanoid',
    slots: '3',
    slotValue: '1',
    level: '3',
    surprise: '12+F',
    evade: '13+F',
    move: '30+S',
    dr: '1',
    stats: {
      str: {
        score: '3',
        mod: '+2',
      },
      int: {
        score: '3',
        mod: '+2',
      },
      con: {
        score: '1',
        mod: '+1',
      },
      dex: {
        score: '6',
        mod: '+3',
      },
      cha: {
        score: '1',
        mod: '+1',
      },
    },
    attacks: [
      {
        name: 'Spear',
        toHit: '12+F',
        damage: '1d8+2 Piercing',
        range: '10ft range',
        effect: '',
      },
      {
        name: 'Scat Pellet',
        toHit: '13+F',
        damage: '1d6+3 Bludgeoning',
        range: '30ft range',
        effect: 'Major Fail+: Stank Rot',
      },
    ],
    notes:
      "Thief: a crawler who starts their turn adjacent to any Scat Thugs makes an Int Stat Check vs Difficulty 10+F+number of adjacent Thugs. On Major Fail or worse, they lose one equipped or held item: if it's small and light, a Thug drops its spear and grabs it; otherwise it lands in the nearest empty space.\nTrapper: alongside its Action, each Thug can arm one trap in a space within 60ft. An entity moving into it may set it off for 1d10+F Piercing and the Poison Debuff. Each trap fires once.\nStank Rot (Scat Pellet): take 1d6+F Poison at the end of each round.\n\nFull text: GM Campaign Toolkit p. 20.",
    source: 'GM Campaign Toolkit p. 20',
    chapter: 'Floor 1 · GM Toolkit',
    floor: 1,
    description:
      "Scat Thugs throw literal shit at you. Hardened, rotting, weaponized shit pellets that keep poisoning you after impact. They also pickpocket anyone standing too close and rig the floor with traps. Pro tip: fight in the open, clutch your valuables, and for fuck's sake, don't lick your fingers afterward.",
    prevDescriptions: [
      'They throw poop, they set traps, and they pick your pockets. Scat Thugs are the full-service experience. Stand next to a few and watch your favorite weapon wander off. Watch your step too, because every one of them rigs the floor. Pro tip: fight them in the open and keep your hands on your stuff.',
    ],
    prevNotes: [
      'Special: Thief; Trapper. Full text: GM Campaign Toolkit p. 20.',
      "Thief: a crawler who starts their turn adjacent to any Scat Thugs makes an Int Stat Check vs Difficulty 10+F+number of adjacent Thugs. On Major Fail or worse, they lose one equipped or held item: if it's small and light, a Thug drops its spear and grabs it; otherwise it lands in the nearest empty space.\nTrapper: alongside its Action, each Thug can arm one trap in a space within 60ft. An entity moving into it may set it off for 1d10+F Piercing and the Poison Debuff. Each trap fires once.\nStank Rot (Scat Pellet): take 1d6+F Poison at the end of each round.\n\nFull text: GM Campaign Toolkit p. 20.",
    ],
    descriptionEs:
      'Los Scat Thugs te tiran mierda. Literalmente. Bolitas de mierda endurecidas, podridas y convertidas en arma, que te siguen envenenando después del impacto. Además le vacían los bolsillos a cualquiera que se acerque demasiado y llenan el suelo de trampas. Pro-Tip: pelea en campo abierto, agarra bien tus objetos de valor y, por lo que más quieras, no te chupes los dedos después.',
    prevDescriptionsEs: [
      'Los Scat Thugs te tiran mierda. Literalmente. Bolitas de mierda endurecidas, podridas y convertidas en arma, que te siguen envenenando después del impacto. Además le vacían los bolsillos a cualquiera que se acerque demasiado y llenan el suelo de trampas. Consejo pro: pelea en campo abierto, agarra bien tus objetos de valor y, por lo que más quieras, no te chupes los dedos después.',
    ],
  },
  {
    name: 'Trash Princess',
    kind: 'mob',
    size: 'Petite (3)',
    tags: 'Humanoid',
    slots: '4',
    slotValue: '2',
    level: '4',
    surprise: '12+F',
    evade: '12+F',
    move: '20+S',
    dr: '1',
    stats: {
      str: {
        score: '1',
        mod: '+1',
      },
      int: {
        score: '3',
        mod: '+2',
      },
      con: {
        score: '3',
        mod: '+2',
      },
      dex: {
        score: '3',
        mod: '+2',
      },
      cha: {
        score: '7',
        mod: '+3',
      },
    },
    attacks: [
      {
        name: 'Eat Trash and Die',
        toHit: '13+F',
        damage: '1d6+3 Poison',
        range: '30ft range',
        effect: 'Major Fail+: Stank Rot',
      },
      {
        name: 'Trash Thunderclap',
        toHit: '12+F',
        damage: '1d6+3 Force',
        range: '15ft Cone',
        effect: 'Major Fail+: Seduced',
      },
    ],
    notes:
      "Collateral Trashing: if one of its Area attacks hits 3+ entities (friend or foe), each target takes an extra 1d6 damage.\nEat Trash and Die: also has a 10ft Blast radius. Stank Rot: take 1d6+F Poison at the end of each round.\nTrash Thunderclap: on Evade Major Fail or worse, target is pushed back 10ft.\nSeduction: 1d6+3 Psychic, 15ft Cone. Target makes a free Int Stat Check vs Difficulty 14 or gains Seduced: the PC's next two Actions must be doomed Persuasion Skill Checks.\n\nFull text: GM Campaign Toolkit p. 21.",
    source: 'GM Campaign Toolkit p. 21',
    chapter: 'Floor 1 · GM Toolkit',
    floor: 1,
    description:
      'The Trash Princess: garbage royalty with a crown of bottle caps and zero concern for friendly fire. Clump up and her blasts hit extra hard, and her little Seduction trick will have you wasting two turns sweet-talking a dumpster. Pro tip: spread out, and keep your dignity in your pants where it belongs.',
    prevDescriptions: [
      "Royalty of the garbage heap, and she does not care who's in the blast zone. Crowd together and she gets bonus damage for the group discount. She can also charm you into wasting your turns flirting with a dumpster diva. Pro tip: spread out, and remember that no means no, even to a crown made of bottle caps.",
    ],
    prevNotes: [
      'Special: Collateral Trashing. Full text: GM Campaign Toolkit p. 21.',
      "Collateral Trashing: if one of its Area attacks hits 3+ entities (friend or foe), each target takes an extra 1d6 damage.\nEat Trash and Die: also has a 10ft Blast radius. Stank Rot: take 1d6+F Poison at the end of each round.\nTrash Thunderclap: on Evade Major Fail or worse, target is pushed back 10ft.\nSeduction: 1d6+3 Psychic, 15ft Cone. Target makes a free Int Stat Check vs Difficulty 14 or gains Seduced: the PC's next two Actions must be doomed Persuasion Skill Checks.\n\nFull text: GM Campaign Toolkit p. 21.",
    ],
    descriptionEs:
      'La Trash Princess: realeza de la basura con corona de chapas y cero preocupación por el fuego amigo. Si os apelotonáis, sus descargas pegan todavía más fuerte, y su truquito de Seduction te tendrá dos turnos perdidos camelándote a un contenedor. Pro-Tip: separaos, y guardad la dignidad dentro de los pantalones, que es donde tiene que estar.',
    prevDescriptionsEs: [
      'La Trash Princess: realeza de la basura con corona de chapas y cero preocupación por el fuego amigo. Si os apelotonáis, sus descargas pegan todavía más fuerte, y su truquito de Seduction te tendrá dos turnos perdidos camelándote a un contenedor. Consejo pro: separaos, y guardad la dignidad dentro de los pantalones, que es donde tiene que estar.',
    ],
  },
  {
    name: 'Hide-Hitter Crib Daddy',
    kind: 'boss',
    size: 'Medium (4)',
    tags: 'Neighborhood Boss, Humanoid',
    slots: '11',
    slotValue: '4',
    level: '7',
    surprise: '13+F',
    evade: '14+F',
    move: '30+S',
    dr: '1',
    stats: {
      str: {
        score: '6',
        mod: '+3',
      },
      int: {
        score: '7',
        mod: '+3',
      },
      con: {
        score: '10',
        mod: '+4',
      },
      dex: {
        score: '12',
        mod: '+4',
      },
      cha: {
        score: '11',
        mod: '+4',
      },
    },
    attacks: [
      {
        name: 'Pocket Groove',
        toHit: '14+F',
        damage: '2d6+3 Psychic',
        range: '5ft range',
        effect: 'Major Fail+: Woozy',
      },
      {
        name: 'Downbeat',
        toHit: '13+F',
        damage: '1d6+3 Sonic',
        range: '30ft Burst radius',
        effect: 'Major Fail+: Fatigued',
      },
      {
        name: 'Stick-Click',
        toHit: '14+F',
        damage: '1d6+4 Bludgeoning',
        range: '30ft range',
        effect: 'Major Fail+: Stuck',
      },
    ],
    notes:
      "Smelly: crawler lands a melee Amazing Success+ → attacker gets Sepsis Debuff.\nBodies Hit the Floor: drumsticks in hand → each Trash Princess beginning a round ≤10ft from him deals +1d4 damage; if a second Princess is also in that zone, roll 1d6, on 1 she swings at the closest Princess instead.\nDaddy's Princesses: takes no damage from Trash Princess Area attacks.\nHide-Hitter: drum kit = weapon rack; ≤15ft from it he's only unarmed when fully incapacitated, and a disarm is instantly replaced. Pocket Groove/Downbeat/Stick-Click need drumsticks; without them pick club (1d6+3, 5ft), throwing dagger (1d4+4, 50ft) or spear (1d8+3, 10ft). Kit: can't be damaged; Str Stat Check vs 13+F to lift; a Scat Thug always steals it unless a crawler holds it.\nStuck (Stick-Click): Interrupt Actions locked out for the rest of combat.\n\nFull text: GM Campaign Toolkit p. 27.",
    source: 'GM Campaign Toolkit p. 27',
    chapter: 'Floor 1 · GM Toolkit',
    floor: 1,
    description:
      'Ladies and gentlemen, the Hide-Hitter Crib Daddy! A drummer with the ego of a stadium headliner and the hygiene of a festival porta-potty. Crit him in melee and you catch Sepsis, because of course you do. Pro tip: that drum kit is his whole personality. Grab it before a Scat Thug does, or enjoy an encore of getting beaten to death.',
    prevDescriptions: [
      "Put your hands together for the Crib Daddy, a drummer who thinks every fight is a solo. Take his sticks and he just grabs something else off the kit, so good luck with that. Crit him in melee and you'll get a faceful of his special musk. Pro tip: the drum kit is the real boss. Steal it before a thug does.",
    ],
    prevNotes: [
      'Special: Smelly; Bodies Hit the Floor; Daddy’s Princesses; Hide-Hitter. Full text: GM Campaign Toolkit p. 27.',
      "Smelly: crawler lands a melee Amazing Success+ → attacker gets Sepsis Debuff.\nBodies Hit the Floor: drumsticks in hand → each Trash Princess beginning a round ≤10ft from him deals +1d4 damage; if a second Princess is also in that zone, roll 1d6, on 1 she swings at the closest Princess instead.\nDaddy's Princesses: takes no damage from Trash Princess Area attacks.\nHide-Hitter: drum kit = weapon rack; ≤15ft from it he's only unarmed when fully incapacitated, and a disarm is instantly replaced. Pocket Groove/Downbeat/Stick-Click need drumsticks; without them pick club (1d6+3, 5ft), throwing dagger (1d4+4, 50ft) or spear (1d8+3, 10ft). Kit: can't be damaged; Str Stat Check vs 13+F to lift; a Scat Thug always steals it unless a crawler holds it.\nStuck (Stick-Click): Interrupt Actions locked out for the rest of combat.\n\nFull text: GM Campaign Toolkit p. 27.",
    ],
    descriptionEs:
      'Damas y caballeros, ¡el Hide-Hitter Crib Daddy! Un batería con el ego de cabeza de cartel de estadio y la higiene de un váter portátil de festival. Métele un crítico cuerpo a cuerpo y pillas Sepsis, cómo no. Pro-Tip: esa batería es toda su personalidad. Quítasela antes de que la pille un Scat Thug, o disfruta de un bis en el que te muelen a palos hasta la muerte.',
    prevDescriptionsEs: [
      'Damas y caballeros, ¡el Hide-Hitter Crib Daddy! Un batería con el ego de cabeza de cartel de estadio y la higiene de un váter portátil de festival. Métele un crítico cuerpo a cuerpo y pillas Sepsis, cómo no. Consejo pro: esa batería es toda su personalidad. Quítasela antes de que la pille un Scat Thug, o disfruta de un bis en el que te muelen a palos hasta la muerte.',
    ],
  },
  {
    name: 'Barflie',
    kind: 'mob',
    size: 'Medium (4)',
    tags: 'Mutated Humanoid',
    slots: '4',
    slotValue: '2',
    level: '4',
    surprise: '11+F',
    evade: '12+F',
    move: '20+S',
    dr: '1',
    stats: {
      str: {
        score: '6',
        mod: '+3',
      },
      int: {
        score: '1',
        mod: '+1',
      },
      con: {
        score: '5',
        mod: '+2',
      },
      dex: {
        score: '4',
        mod: '+2',
      },
      cha: {
        score: '1',
        mod: '+1',
      },
    },
    attacks: [
      {
        name: 'Backwash',
        toHit: '12+F',
        damage: '1d6+2 Poison',
        range: '30ft range',
        effect: 'Major Fail+: Washed',
      },
      {
        name: 'Club',
        toHit: '13+F',
        damage: '1d6+3 Bludgeoning',
        range: '5ft range',
        effect: '',
      },
    ],
    notes:
      'Washed (Backwash): if a Washed crawler dies before drinking a Potion of Clarity, they rise as a Barflie that keeps all their Skills and Spells.\nFlight: moves through the air as if on the ground and can hover.\n\nFull text: GM Campaign Toolkit p. 30.',
    source: 'GM Campaign Toolkit p. 30',
    chapter: 'Floor 1 · GM Toolkit',
    floor: 1,
    description:
      "Barflies: the regulars who hover over the bar, club you, and spit backwash in your face. Die while Washed and congratulations, you're now a permanent employee with all your skills and none of your self-respect. Pro tip: chug a Potion of Clarity first. Nobody wants to spend eternity as the drunk at the end of the bar.",
    prevDescriptions: [
      "Barflies: the regulars who never leave, and I do mean never. They hover, they club, and they spit their drink at you. Get Washed and die, and you'll join the bar staff, with all your fancy skills intact. Pro tip: keep a Potion of Clarity handy, unless you've always wanted wings and a drinking problem.",
    ],
    prevNotes: [
      'Special: Flight. Full text: GM Campaign Toolkit p. 30.',
      'Washed (Backwash): if a Washed crawler dies before drinking a Potion of Clarity, they rise as a Barflie that keeps all their Skills and Spells.\nFlight: moves through the air as if on the ground and can hover.\n\nFull text: GM Campaign Toolkit p. 30.',
    ],
    descriptionEs:
      'Barflies: los habituales que revolotean sobre la barra, te dan un porrazo y te escupen los restos del cubata en la cara. Muere estando Washed y enhorabuena, ahora eres empleado fijo con todas tus habilidades y nada de amor propio. Pro-Tip: bébete antes una Potion of Clarity. Nadie quiere pasarse la eternidad siendo el borracho del final de la barra.',
    prevDescriptionsEs: [
      'Barflies: los habituales que revolotean sobre la barra, te dan un porrazo y te escupen los restos del cubata en la cara. Muere estando Washed y enhorabuena, ahora eres empleado fijo con todas tus habilidades y nada de amor propio. Consejo pro: bébete antes una Potion of Clarity. Nadie quiere pasarse la eternidad siendo el borracho del final de la barra.',
    ],
  },
  {
    name: 'Canidna',
    kind: 'mob',
    size: 'Medium (4)',
    tags: 'Animal',
    slots: '3',
    slotValue: '2',
    level: '3',
    surprise: '11+F',
    evade: '13+F',
    move: '30+S',
    dr: '1',
    stats: {
      str: {
        score: '3',
        mod: '+2',
      },
      int: {
        score: '1',
        mod: '+1',
      },
      con: {
        score: '3',
        mod: '+2',
      },
      dex: {
        score: '6',
        mod: '+3',
      },
      cha: {
        score: '1',
        mod: '+1',
      },
    },
    attacks: [
      {
        name: 'Bite',
        toHit: '12+F',
        damage: '1d6+2 Piercing',
        range: '5ft range',
        effect: '',
      },
      {
        name: 'Spike Ball',
        toHit: '12+F',
        damage: '1d8+2 Piercing',
        range: '5ft range',
        effect: 'Major Fail+: Blood Trail',
      },
    ],
    notes:
      "Pack Hunting: 2+ Canidna next to a target that has no ally beside it → target's Evade checks at Disadvantage.\nDesperation: Spike Ball only once cornered or with the pack reduced to ½.\n\nFull text: GM Campaign Toolkit p. 31.",
    source: 'GM Campaign Toolkit p. 31',
    chapter: 'Floor 1 · GM Toolkit',
    floor: 1,
    description:
      'Canidna: half dingo, half spiky egg-layer, one hundred percent pack of assholes. Wander off alone and they surround you and make your dodges a fucking joke. Knock the pack down to half and they curl into spike balls. Pro tip: stay next to a buddy. Loners make delicious content.',
    prevDescriptions: [
      "Half dog, half spiky egg-laying weirdo, fully committed to teamwork. Canidna love a crawler who wanders off alone. Thin the pack and they start rolling up into spike balls, which is adorable right up until you start bleeding. Pro tip: buddy system, people. It's not just for field trips.",
    ],
    prevNotes: [
      'Special: Pack Hunting; Desperation. Full text: GM Campaign Toolkit p. 31.',
      "Pack Hunting: 2+ Canidna next to a target that has no ally beside it → target's Evade checks at Disadvantage.\nDesperation: Spike Ball only once cornered or with the pack reduced to ½.\n\nFull text: GM Campaign Toolkit p. 31.",
    ],
    descriptionEs:
      'Canidna: mitad dingo, mitad bicho pinchudo que pone huevos, cien por cien manada de cabrones. Aléjate solo y te rodean y convierten tus esquivas en un puto chiste. Baja la manada a la mitad y se enroscan en bolas de pinchos. Pro-Tip: no te separes de un colega. Los que van por libre son un contenido delicioso.',
    prevDescriptionsEs: [
      'Canidna: mitad dingo, mitad bicho pinchudo que pone huevos, cien por cien manada de cabrones. Aléjate solo y te rodean y convierten tus esquivas en un puto chiste. Baja la manada a la mitad y se enroscan en bolas de pinchos. Consejo pro: no te separes de un colega. Los que van por libre son un contenido delicioso.',
    ],
  },
  {
    name: 'Mirror Cat',
    kind: 'mob',
    size: 'Small (2)',
    tags: 'Animal',
    slots: '2',
    slotValue: '1',
    level: '2',
    surprise: '11+F',
    evade: '13+F',
    move: '30+S',
    dr: '1',
    stats: {
      str: {
        score: '1',
        mod: '+1',
      },
      int: {
        score: '1',
        mod: '+1',
      },
      con: {
        score: '1',
        mod: '+1',
      },
      dex: {
        score: '6',
        mod: '+3',
      },
      cha: {
        score: '2',
        mod: '+1',
      },
    },
    attacks: [
      {
        name: 'Claw',
        toHit: '13+F',
        damage: '1d6+3 Slashing',
        range: '5ft range',
        effect: '',
      },
      {
        name: 'Phase Claw',
        toHit: '11+F',
        damage: '1d4+1 Psychic',
        range: '30ft range',
        effect: 'Major Fail+: Confused',
      },
    ],
    notes:
      "Multiplying: at the end of every second round, another Mirror Cat joins until they number twice the party. After that, no more spawn this combat.\nConfused (Phase Claw): the crawler's next Action must be an attack on an ally.\n\nFull text: GM Campaign Toolkit p. 31.",
    source: 'GM Campaign Toolkit p. 31',
    chapter: 'Floor 1 · GM Toolkit',
    floor: 1,
    description:
      "Mirror Cats: every two rounds, another one shows up, until there are twice as many cats as crawlers. It's a feline pyramid scheme. Their Phase Claw scrambles your brain so you swing at your own friends, which my viewers find hysterical. Pro tip: kill them early, and apologize for the stab wounds later.",
    prevDescriptions: [
      "One cat? Cute. Two cats? Fine. Twice as many cats as there are of you? That's the Mirror Cat experience. Their phase claw scrambles your brain so you swing at your own team. Pro tip: kill them fast, and apologize to your friends later.",
    ],
    prevNotes: [
      'Full text: GM Campaign Toolkit p. 31.',
      "Multiplying: at the end of every second round, another Mirror Cat joins until they number twice the party. After that, no more spawn this combat.\nConfused (Phase Claw): the crawler's next Action must be an attack on an ally.\n\nFull text: GM Campaign Toolkit p. 31.",
    ],
    descriptionEs:
      'Mirror Cats: cada dos rondas aparece otro, hasta que hay el doble de gatos que de crawlers. Es una estafa piramidal felina. Su Phase Claw te revuelve el cerebro y acabas atacando a tus propios amigos, cosa que a mis espectadores les parece desternillante. Pro-Tip: mátalos pronto, y ya pedirás perdón por las puñaladas luego.',
    prevDescriptionsEs: [
      'Mirror Cats: cada dos rondas aparece otro, hasta que hay el doble de gatos que de crawlers. Es una estafa piramidal felina. Su Phase Claw te revuelve el cerebro y acabas atacando a tus propios amigos, cosa que a mis espectadores les parece desternillante. Consejo pro: mátalos pronto, y ya pedirás perdón por las puñaladas luego.',
    ],
  },
  {
    name: 'Pack Rat',
    kind: 'mob',
    size: 'Tiny (1)',
    tags: 'Animal',
    slots: '2',
    slotValue: '2',
    level: '2',
    surprise: '11+F',
    evade: '12+F',
    move: '20+S',
    dr: '1',
    stats: {
      str: {
        score: '1',
        mod: '+1',
      },
      int: {
        score: '2',
        mod: '+1',
      },
      con: {
        score: '3',
        mod: '+2',
      },
      dex: {
        score: '4',
        mod: '+2',
      },
      cha: {
        score: '1',
        mod: '+1',
      },
    },
    attacks: [
      {
        name: 'Bite',
        toHit: '11+F',
        damage: '1d4+1 Piercing',
        range: '5ft range',
        effect: 'Special effect',
      },
    ],
    notes: 'Full text: GM Campaign Toolkit p. 32.',
    source: 'GM Campaign Toolkit p. 32',
    chapter: 'Floor 1 · GM Toolkit',
    floor: 1,
    description:
      "The Pack Rat. It won't kill you. It'll just gnaw on your ankle like a teething toddler while something bigger rips your spine out. It's the dungeon's version of that coworker who contributes nothing but still shows up in the photo. Pro tip: stomp it when you get a spare second. It's oddly satisfying.",
    prevDescriptions: [
      "Pack Rat. Tiny, bitey, and statistically the thing you'll forget to watch while you worry about the big monster. It won't win the fight. It'll just chew your ankle the entire time. Consider it the dungeon's mosquito.",
    ],
    prevNotes: ['Full text: GM Campaign Toolkit p. 32.'],
    descriptionEs:
      'La Pack Rat. No te va a matar. Solo te mordisqueará el tobillo como un bebé al que le salen los dientes mientras algo más grande te arranca la columna. Es la versión mazmorra de ese compañero de curro que no aporta nada pero siempre sale en la foto. Pro-Tip: písala cuando tengas un segundo libre. Es curiosamente satisfactorio.',
    prevDescriptionsEs: [
      'La Pack Rat. No te va a matar. Solo te mordisqueará el tobillo como un bebé al que le salen los dientes mientras algo más grande te arranca la columna. Es la versión mazmorra de ese compañero de curro que no aporta nada pero siempre sale en la foto. Consejo pro: písala cuando tengas un segundo libre. Es curiosamente satisfactorio.',
    ],
  },
  {
    name: 'Homogenous Humors',
    kind: 'mob',
    size: 'Medium (4)',
    tags: 'Aberration',
    slots: '3',
    slotValue: '2',
    level: '3',
    surprise: '13+F',
    evade: '12+F',
    move: '20+S',
    dr: '2',
    stats: {
      str: {
        score: '1',
        mod: '+1',
      },
      int: {
        score: '6',
        mod: '+3',
      },
      con: {
        score: '3',
        mod: '+2',
      },
      dex: {
        score: '3',
        mod: '+2',
      },
      cha: {
        score: '1',
        mod: '+1',
      },
    },
    attacks: [
      {
        name: 'Evil Eye',
        toHit: '13+F',
        damage: '1d6+3 Necrotic',
        range: '50ft range',
        effect: 'Major Fail+: Fatigued',
      },
    ],
    notes:
      'Flight: air movement works like ground movement; may hover.\nMerge: 2+ within 5ft → combine into one larger foe; per extra member absorbed, +1 damage die and +1 to hit.\n\nFull text: GM Campaign Toolkit p. 32.',
    source: 'GM Campaign Toolkit p. 32',
    chapter: 'Floor 1 · GM Toolkit',
    floor: 1,
    description:
      "Homogenous Humors: floating eyeballs with a death stare from 50 feet. Separately, they're gross. Let two drift within five feet and they fuse into one bigger, meaner, uglier eyeball, like a group project nobody asked for. Pro tip: keep them apart. Nobody wants to see what happens at the eyeball orgy. Wait, strike that. Legal says no.",
    prevDescriptions: [
      "Floating eyeball blobs with a nasty stare that drains your stamina. On their own? Manageable. Let them snuggle up and they fuse into one big, angry, better-armed blob. Pro tip: keep them apart. It's like a middle school dance, only the chaperone is necrotic damage.",
    ],
    prevNotes: [
      'Special: Flight. Full text: GM Campaign Toolkit p. 32.',
      'Flight: air movement works like ground movement; may hover.\nMerge: 2+ within 5ft → combine into one larger foe; per extra member absorbed, +1 damage die and +1 to hit.\n\nFull text: GM Campaign Toolkit p. 32.',
    ],
    descriptionEs:
      'Homogenous Humors: globos oculares flotantes con una mirada mortal a 50 pies. Por separado ya son asquerosos. Deja que dos se acerquen a menos de cinco pies y se fusionan en un ojo más grande, más malo y más feo, como un trabajo en grupo que nadie ha pedido. Pro-Tip: mantenlos separados. Nadie quiere ver lo que pasa en la orgía de globos oculares. Espera, borrad eso. Los de legal dicen que no.',
    prevDescriptionsEs: [
      'Homogenous Humors: globos oculares flotantes con una mirada mortal a 50 pies. Por separado ya son asquerosos. Deja que dos se acerquen a menos de cinco pies y se fusionan en un ojo más grande, más malo y más feo, como un trabajo en grupo que nadie ha pedido. Consejo pro: mantenlos separados. Nadie quiere ver lo que pasa en la orgía de globos oculares. Espera, borrad eso. Los de legal dicen que no.',
    ],
  },
  {
    name: 'The Bar Render',
    kind: 'boss',
    size: 'Large (5)',
    tags: 'Neighborhood Boss, Humanoid',
    slots: '11',
    slotValue: '4',
    level: '8',
    surprise: '14+F',
    evade: '14+F',
    move: '30+S',
    dr: '1',
    stats: {
      str: {
        score: '11',
        mod: '+4',
      },
      int: {
        score: '10',
        mod: '+4',
      },
      con: {
        score: '11',
        mod: '+4',
      },
      dex: {
        score: '11',
        mod: '+4',
      },
      cha: {
        score: '6',
        mod: '+3',
      },
    },
    attacks: [
      {
        name: 'Fiery Cocktail',
        toHit: '14+F',
        damage: '1d8+4 Fire',
        range: '30ft range, 10ft',
        effect: 'Special effect',
      },
      {
        name: 'Punch',
        toHit: '14+F',
        damage: '2d8+4 Bludgeoning',
        range: '5ft range',
        effect: 'Major Fail+: Held',
      },
    ],
    notes:
      'Barfly Escort: two Barflies are always in the fight alongside her until she dies (replace any that fall).\nFiery Cocktail: 10ft Blast radius.\n\nFull text: GM Campaign Toolkit p. 37.',
    source: 'GM Campaign Toolkit p. 37',
    chapter: 'Floor 1 · GM Toolkit',
    floor: 1,
    description:
      "Last call, you degenerates! The Bar Render hurls flaming cocktails and punches hard enough to rearrange your dental records. She's never alone either: two Barflies are always on shift, and the moment one dies another clocks in. Pro tip: skip the staff and go for the manager. Always go for the manager.",
    prevDescriptions: [
      'Last call, crawlers! The Bar Render serves flaming cocktails and haymakers that pin you to the counter. She never drinks alone, either: two Barflies are always on shift, and they get replaced faster than you can kill them. Pro tip: skip the bouncers and go for the bartender.',
    ],
    prevNotes: [
      'Full text: GM Campaign Toolkit p. 37.',
      'Barfly Escort: two Barflies are always in the fight alongside her until she dies (replace any that fall).\nFiery Cocktail: 10ft Blast radius.\n\nFull text: GM Campaign Toolkit p. 37.',
    ],
    descriptionEs:
      '¡Última ronda, degenerados! La Bar Render lanza cócteles en llamas y pega puñetazos capaces de reorganizarte el historial dental. Además nunca está sola: siempre hay dos Barflies de turno, y en cuanto uno muere, otro ficha. Pro-Tip: pasa del personal y ve a por la encargada. Siempre hay que ir a por la encargada.',
    prevDescriptionsEs: [
      '¡Última ronda, degenerados! La Bar Render lanza cócteles en llamas y pega puñetazos capaces de reorganizarte el historial dental. Además nunca está sola: siempre hay dos Barflies de turno, y en cuanto uno muere, otro ficha. Consejo pro: pasa del personal y ve a por la encargada. Siempre hay que ir a por la encargada.',
    ],
  },
  {
    name: 'Chilly Goat',
    kind: 'mob',
    size: 'Petite (3)',
    tags: 'Fanged Goat',
    slots: '4',
    slotValue: '3',
    level: '4',
    surprise: '11+F',
    evade: '12+F',
    move: '20+S',
    dr: '1',
    stats: {
      str: {
        score: '5',
        mod: '+2',
      },
      int: {
        score: '1',
        mod: '+1',
      },
      con: {
        score: '6',
        mod: '+3',
      },
      dex: {
        score: '4',
        mod: '+2',
      },
      cha: {
        score: '1',
        mod: '+1',
      },
    },
    attacks: [
      {
        name: 'Horns',
        toHit: '12+F',
        damage: '1d6+2 Piercing',
        range: '5ft range',
        effect: '',
      },
      {
        name: 'Fangs',
        toHit: '11+F',
        damage: '1d4+3 Piercing',
        range: '5ft range',
        effect: '',
      },
      {
        name: 'Icy Aura',
        toHit: '11+F',
        damage: '1d6+3 Ice',
        range: '15ft Burst radius',
        effect: 'Special effect',
      },
    ],
    notes:
      'Already Chilly: Cold damage → 0.\nPrefers Being Chilly: Fire → ×2 damage.\nIcy Aura: 1 use per 3 rounds.\n\nFull text: GM Campaign Toolkit p. 40.',
    source: 'GM Campaign Toolkit p. 40',
    chapter: 'Floor 1 · GM Toolkit',
    floor: 1,
    description:
      "The Chilly Goat: fangs, horns, and a freezing aura that has your nipples cutting glass in seconds. Ice spells do jack shit against it, so put the frost wand away, genius. Pro tip: it takes double damage from fire. Nothing says 'dinner party' like flame-broiled goat.",
    prevDescriptions: [
      'A goat. With fangs. With a freezer aura. Somebody in design was having a week. Cold does nothing to it, so put away the frost spells. Pro tip: it really, really hates fire. Barbecue goat is on the menu if you bring a lighter.',
    ],
    prevNotes: [
      'Special: Already Chilly; Prefers Being Chilly. Full text: GM Campaign Toolkit p. 40.',
      'Already Chilly: Cold damage → 0.\nPrefers Being Chilly: Fire → ×2 damage.\nIcy Aura: 1 use per 3 rounds.\n\nFull text: GM Campaign Toolkit p. 40.',
    ],
    descriptionEs:
      "La Chilly Goat: colmillos, cuernos y un aura helada que en segundos te pone los pezones como para cortar cristal. Los hechizos de hielo no le hacen ni puta mierda, así que guarda la varita de escarcha, genio. Pro-Tip: recibe el doble de daño por fuego. No hay nada más de 'cena con amigos' que una cabra a la brasa.",
    prevDescriptionsEs: [
      "La Chilly Goat: colmillos, cuernos y un aura helada que en segundos te pone los pezones como para cortar cristal. Los hechizos de hielo no le hacen ni puta mierda, así que guarda la varita de escarcha, genio. Consejo pro: recibe el doble de daño por fuego. No hay nada más de 'cena con amigos' que una cabra a la brasa.",
    ],
  },
  {
    name: 'Fire-Fighter',
    kind: 'mob',
    size: 'Small (2)',
    tags: 'Minor Fire Elemental',
    slots: '3',
    slotValue: '3',
    level: '3',
    surprise: '11+F',
    evade: '14+F',
    move: '20+S',
    dr: '1',
    stats: {
      str: {
        score: '1',
        mod: '+1',
      },
      int: {
        score: '1',
        mod: '+1',
      },
      con: {
        score: '6',
        mod: '+3',
      },
      dex: {
        score: '10',
        mod: '+4',
      },
      cha: {
        score: '1',
        mod: '+1',
      },
    },
    attacks: [
      {
        name: 'Firey Touch',
        toHit: '14+F',
        damage: '1d6+4 Fire',
        range: '5ft range',
        effect: '',
      },
    ],
    notes:
      'Intangibility: only Spell damage can harm it.\nWater Weakness: any contact with water destroys it instantly.\n\nFull text: GM Campaign Toolkit p. 41.',
    source: 'GM Campaign Toolkit p. 41',
    chapter: 'Floor 1 · GM Toolkit',
    floor: 1,
    description:
      'Fire-Fighter: a little fire elemental that fights. Yes, I workshopped that name for weeks. Your big stupid sword passes right through it, so all you muscle-brained melee types can go sit in the corner. Pro tip: it only takes spell damage, and a splash of water kills it outright. Even piss counts. Probably. Try it on camera.',
    prevDescriptions: [
      "It's a little fire elemental that fights, hence the name. I'm hilarious. Swords go right through it, so your meathead build is about to feel very useless. Pro tip: a bucket of water beats a greatsword here. Hydrate, crawlers.",
    ],
    prevNotes: [
      'Special: Intangibility. Full text: GM Campaign Toolkit p. 41.',
      'Intangibility: only Spell damage can harm it.\nWater Weakness: any contact with water destroys it instantly.\n\nFull text: GM Campaign Toolkit p. 41.',
    ],
    descriptionEs:
      'Fire-Fighter: un pequeño elemental de fuego que pelea. Sí, estuve semanas puliendo ese nombre. Tu espadón estúpido lo atraviesa sin más, así que todos los cerebros de músculo de cuerpo a cuerpo os podéis ir a sentar al rincón. Pro-Tip: solo recibe daño de hechizos, y un chorrito de agua lo mata en el acto. Hasta el pis cuenta. Probablemente. Probadlo delante de la cámara.',
    prevDescriptionsEs: [
      'Fire-Fighter: un pequeño elemental de fuego que pelea. Sí, estuve semanas puliendo ese nombre. Tu espadón estúpido lo atraviesa sin más, así que todos los cerebros de músculo de cuerpo a cuerpo os podéis ir a sentar al rincón. Consejo pro: solo recibe daño de hechizos, y un chorrito de agua lo mata en el acto. Hasta el pis cuenta. Probablemente. Probadlo delante de la cámara.',
    ],
  },
  {
    name: 'Rat Brute (p. 41)',
    kind: 'mob',
    size: 'Medium (4)',
    tags: 'Humanoid',
    slots: '4',
    slotValue: '3',
    level: '4',
    surprise: '11+F',
    evade: '12+F',
    move: '20+S',
    dr: '1',
    stats: {
      str: {
        score: '6',
        mod: '+3',
      },
      int: {
        score: '1',
        mod: '+1',
      },
      con: {
        score: '6',
        mod: '+3',
      },
      dex: {
        score: '3',
        mod: '+2',
      },
      cha: {
        score: '1',
        mod: '+1',
      },
    },
    attacks: [
      {
        name: 'Knife',
        toHit: '13+F',
        damage: '1d6+3 Slashing',
        range: '5ft range',
        effect: '',
      },
      {
        name: 'Crossbow',
        toHit: '12+F',
        damage: '1d8 Piercing',
        range: '50ft range',
        effect: '',
      },
    ],
    notes:
      'Roid Rage: sudden noise, bright light or a perceived insult triggers a rage that doubles the Stat Mod bonus on its damage rolls.\nPushing Through: can make one more attack after being reduced to 0% HB.\nWeak-Minded: hard to Intimidate, but charm and other mind-control attempts against it have Advantage.\n\nFull text: GM Campaign Toolkit p. 41.',
    source: 'GM Campaign Toolkit p. 41',
    chapter: 'Floor 1 · GM Toolkit',
    floor: 1,
    description:
      "The Rat Brute: juiced to the gills, knife in one paw, crossbow in the other, and a temper like a microwaved grenade. Insult him and his damage doubles. Drop him to zero and he still takes one last spiteful swing. Pro tip: he's dumb as a bag of hammers, so charm him. Flattery works on idiots. Ask any of my sponsors.",
    prevDescriptions: [
      "Rat Brute: the gym rat, literally. Juiced up, short-fused, and one rude comment away from hitting twice as hard. Knock him to zero and he'll still get one more swing in out of spite. Pro tip: don't insult him. Sweet-talk him. He's a sucker for a charmer.",
    ],
    prevNotes: [
      'Special: Roid Rage; Weak-Minded. Full text: GM Campaign Toolkit p. 41.',
      'Roid Rage: sudden noise, bright light or a perceived insult triggers a rage that doubles the Stat Mod bonus on its damage rolls.\nPushing Through: can make one more attack after being reduced to 0% HB.\nWeak-Minded: hard to Intimidate, but charm and other mind-control attempts against it have Advantage.\n\nFull text: GM Campaign Toolkit p. 41.',
    ],
    descriptionEs:
      'El Rat Brute: hasta las cejas de esteroides, cuchillo en una pata, ballesta en la otra y un carácter de granada metida en el microondas. Insúltalo y su daño se duplica. Déjalo a cero y todavía te suelta un último golpe por puro rencor. Pro-Tip: es más tonto que un zapato, así que encándilalo. Los halagos funcionan con los idiotas. Pregúntale a cualquiera de mis patrocinadores.',
    prevDescriptionsEs: [
      'El Rat Brute: hasta las cejas de esteroides, cuchillo en una pata, ballesta en la otra y un carácter de granada metida en el microondas. Insúltalo y su daño se duplica. Déjalo a cero y todavía te suelta un último golpe por puro rencor. Consejo pro: es más tonto que un zapato, así que encándilalo. Los halagos funcionan con los idiotas. Pregúntale a cualquiera de mis patrocinadores.',
    ],
  },
  {
    name: 'Rat Hooligan (p. 42)',
    kind: 'mob',
    size: 'Petite (3)',
    tags: 'Rat Hybrid',
    slots: '4',
    slotValue: '2',
    level: '4',
    surprise: '12+F',
    evade: '12+F',
    move: '20+S',
    dr: '2',
    stats: {
      str: {
        score: '3',
        mod: '+2',
      },
      int: {
        score: '4',
        mod: '+2',
      },
      con: {
        score: '3',
        mod: '+2',
      },
      dex: {
        score: '3',
        mod: '+2',
      },
      cha: {
        score: '4',
        mod: '+2',
      },
    },
    attacks: [
      {
        name: 'Longsword',
        toHit: '12+F',
        damage: '1d8+2 Slashing',
        range: '5ft range',
        effect: '',
      },
      {
        name: 'Firebolt Spell',
        toHit: '12+F',
        damage: '1d6+2 Fire',
        range: '30 ft range',
        effect: 'Special effect',
      },
    ],
    notes:
      'Heal Others Spell: heals one target within 10ft for 1d4 Health Bar slots.\n\nFull text: GM Campaign Toolkit p. 42.',
    source: 'GM Campaign Toolkit p. 42',
    chapter: 'Floor 1 · GM Toolkit',
    floor: 1,
    description:
      "The Rat Hooligan: part swordsman, part fire mage, part field medic, all sewer trash. He'll keep patching up his buddies until you've killed the same rat three goddamn times. Pro tip: murder the healer first. It's the oldest rule in gaming, and you idiots still forget it every time.",
    prevDescriptions: [
      "The Rat Hooligan: longsword in one paw, firebolt in the other, and a heal spell for his buddies. A triple threat with a bad attitude. Pro tip: drop him first, or you'll spend all night re-killing his friends.",
    ],
    prevNotes: [
      'Full text: GM Campaign Toolkit p. 42.',
      'Heal Others Spell: heals one target within 10ft for 1d4 Health Bar slots.\n\nFull text: GM Campaign Toolkit p. 42.',
    ],
    descriptionEs:
      'El Rat Hooligan: parte espadachín, parte mago de fuego, parte médico de campaña, todo basura de alcantarilla. No parará de curar a sus colegas hasta que hayas matado a la misma rata tres putas veces. Pro-Tip: cárgate primero al sanador. Es la regla más antigua de los videojuegos, y vosotros, idiotas, os la seguís olvidando siempre.',
    prevDescriptionsEs: [
      'El Rat Hooligan: parte espadachín, parte mago de fuego, parte médico de campaña, todo basura de alcantarilla. No parará de curar a sus colegas hasta que hayas matado a la misma rata tres putas veces. Consejo pro: cárgate primero al sanador. Es la regla más antigua de los videojuegos, y vosotros, idiotas, os la seguís olvidando siempre.',
    ],
  },
  {
    name: 'Rat Shaman (p. 42)',
    kind: 'mob',
    size: 'Petite (3)',
    tags: 'Humanoid',
    slots: '5',
    slotValue: '2',
    level: '5',
    surprise: '14+F',
    evade: '12+F',
    move: '20+S',
    dr: '1',
    stats: {
      str: {
        score: '1',
        mod: '+1',
      },
      int: {
        score: '10',
        mod: '+4',
      },
      con: {
        score: '3',
        mod: '+2',
      },
      dex: {
        score: '3',
        mod: '+2',
      },
      cha: {
        score: '3',
        mod: '+2',
      },
    },
    attacks: [
      {
        name: 'Clap Cloud Spell',
        toHit: '14+F',
        damage: '1d4+4 Force',
        range: '50ft range, 20ft Blast radius',
        effect: 'Major Fail+: Queasy',
      },
      {
        name: 'Firestrike Spell',
        toHit: '14+F',
        damage: '2d6+4 Fire',
        range: '30ft range,',
        effect: 'every other round',
      },
      {
        name: 'Mini Fireball Spell',
        toHit: '14+F',
        damage: '1d6+4 Fire',
        range: '60ft range, 5ft Blast radius',
        effect: 'Special effect',
      },
    ],
    notes: 'Firestrike Spell: usable once every other round.\n\nFull text: GM Campaign Toolkit p. 42.',
    source: 'GM Campaign Toolkit p. 42',
    chapter: 'Floor 1 · GM Toolkit',
    floor: 1,
    description:
      "Every rat gang needs a spiritual leader, and this one's gospel is 'set shit on fire.' Mini fireballs, a thunderclap cloud, and a big Firestrike she can only fire every other round. Pro tip: charge on the off-beat. Nothing stops a sermon like a boot to the sternum.",
    prevDescriptions: [
      "Every rat gang needs a spiritual advisor, and this one advises fire. Lots of fire. The Rat Shaman lobs fireballs and a thunderclap cloud that'll have you queasy. Pro tip: she hits hard every other round on the big spell, so time your charge for the off-beat.",
    ],
    prevNotes: [
      'Full text: GM Campaign Toolkit p. 42.',
      'Firestrike Spell: usable once every other round.\n\nFull text: GM Campaign Toolkit p. 42.',
    ],
    descriptionEs:
      "Toda banda de ratas necesita un líder espiritual, y el evangelio de esta es 'prenderle fuego a todo, joder'. Minibolas de fuego, una nube de trueno y un Firestrike tochísimo que solo puede lanzar una ronda sí y otra no. Pro-Tip: carga a contratiempo. Nada interrumpe un sermón como una patada en el esternón.",
    prevDescriptionsEs: [
      "Toda banda de ratas necesita un líder espiritual, y el evangelio de esta es 'prenderle fuego a todo, joder'. Minibolas de fuego, una nube de trueno y un Firestrike tochísimo que solo puede lanzar una ronda sí y otra no. Consejo pro: carga a contratiempo. Nada interrumpe un sermón como una patada en el esternón.",
    ],
  },
  {
    name: 'MisChief, Leader of the Rat-Kin Horde',
    kind: 'boss',
    size: 'Large (5)',
    tags: 'Neighborhood Boss, Rat Knight',
    slots: '11',
    slotValue: '4',
    level: '7',
    surprise: '13+F',
    evade: '14+F',
    move: '20+S',
    dr: '2',
    stats: {
      str: {
        score: '10 (+4',
        mod: '',
      },
      int: {
        score: '8',
        mod: '+3',
      },
      con: {
        score: '10',
        mod: '+4',
      },
      dex: {
        score: '10',
        mod: '+4',
      },
      cha: {
        score: '8',
        mod: '+3',
      },
    },
    attacks: [
      {
        name: 'Mattock',
        toHit: '14+F',
        damage: '2d10+4 Piercing',
        range: '5ft range',
        effect: '',
      },
      {
        name: 'Manhole Cover',
        toHit: '14+F',
        damage: '2d8+3 Bludgeoning',
        range: '30ft range',
        effect: '',
      },
      {
        name: 'Traffic Dodger',
        toHit: '13+F',
        damage: '2d6+3 Bludgeoning',
        range: '30ft Line',
        effect: 'Special effect',
      },
    ],
    notes:
      'Traffic Dodger: conjured cars run a 30ft Line; GM aims it to catch the most crawlers.\n\nFull text: GM Campaign Toolkit p. 47.',
    source: 'GM Campaign Toolkit p. 47',
    chapter: 'Floor 1 · GM Toolkit',
    floor: 1,
    description:
      'All hail MisChief, Rat Knight and leader of the Horde! He swings a mattock that turns kneecaps into paste, throws manhole covers like frisbees, and summons rush hour traffic right through your party. Pro tip: never stand in a line with your friends. Nothing ruins group photos like a hit-and-run.',
    prevDescriptions: [
      'All hail MisChief, a rat knight with a mattock, a throwable manhole cover, and a spell that conjures traffic. Actual cars. In a dungeon. I love this job. Pro tip: never stand in a straight line with your friends. Rush hour is brutal.',
    ],
    prevNotes: [
      'Full text: GM Campaign Toolkit p. 47.',
      'Traffic Dodger: conjured cars run a 30ft Line; GM aims it to catch the most crawlers.\n\nFull text: GM Campaign Toolkit p. 47.',
    ],
    descriptionEs:
      '¡Salve, MisChief, Caballero Rata y líder de la Horda! Blande un zapapico que convierte rótulas en paté, lanza tapas de alcantarilla como si fueran frisbis e invoca un atasco de hora punta en mitad de tu grupo. Pro-Tip: nunca te pongas en fila con tus amigos. Nada arruina una foto de grupo como un atropello con fuga.',
    prevDescriptionsEs: [
      '¡Salve, MisChief, Caballero Rata y líder de la Horda! Blande un zapapico que convierte rótulas en paté, lanza tapas de alcantarilla como si fueran frisbis e invoca un atasco de hora punta en mitad de tu grupo. Consejo pro: nunca te pongas en fila con tus amigos. Nada arruina una foto de grupo como un atropello con fuga.',
    ],
  },
  {
    name: 'Vine Creeper',
    kind: 'mob',
    size: 'Huge (6)',
    tags: 'Plant',
    slots: '2',
    slotValue: '2',
    level: '2',
    surprise: '11+F',
    evade: '12+F',
    move: '15+S',
    dr: '1',
    stats: {
      str: {
        score: '3',
        mod: '+2',
      },
      int: {
        score: '1',
        mod: '+1',
      },
      con: {
        score: '3',
        mod: '+2',
      },
      dex: {
        score: '3',
        mod: '+2',
      },
      cha: {
        score: '1',
        mod: '+1',
      },
    },
    attacks: [
      {
        name: 'Fang',
        toHit: '12+F',
        damage: '1d6+2 Piercing',
        range: '5ft range',
        effect: 'Major Fail+: Poison',
      },
      {
        name: 'Talon',
        toHit: '12+F',
        damage: '1d8+2 Slashing',
        range: '5ft range',
        effect: '',
      },
      {
        name: 'Vine',
        toHit: '12+F',
        damage: '1d4+2 Bludgeoning',
        range: '30ft range',
        effect: 'On hit: Held',
      },
    ],
    notes:
      'Vine: hit → Held Debuff + target yanked toward the Creeper; Held lasts until the Creeper is dead.\n\nFull text: GM Campaign Toolkit p. 50.',
    source: 'GM Campaign Toolkit p. 50',
    chapter: 'Floor 1 · GM Toolkit',
    floor: 1,
    description:
      "The Vine Creeper: a huge plant with fangs, talons, and serious boundary issues. Its vine grabs you, reels you in, and holds you until it's dead, like the world's worst ex. Pro tip: if you're caught, relax and let your team do the killing. Enjoy the view from the salad's mouth.",
    prevDescriptions: [
      "A giant plant with fangs, talons, and a lasso habit. Once its vine grabs you, you're coming in for a hug, and you're not leaving until it's compost. Pro tip: have somebody else kill it while you enjoy the view from inside its mouth.",
    ],
    prevNotes: [
      'Full text: GM Campaign Toolkit p. 50.',
      'Vine: hit → Held Debuff + target yanked toward the Creeper; Held lasts until the Creeper is dead.\n\nFull text: GM Campaign Toolkit p. 50.',
    ],
    descriptionEs:
      'La Vine Creeper: una planta enorme con colmillos, garras y serios problemas para respetar el espacio personal. Su enredadera te agarra, te arrastra hacia ella y no te suelta hasta que muere, como el peor ex del mundo. Pro-Tip: si te pilla, relájate y deja que tu equipo se encargue de matarla. Disfruta de las vistas desde la boca de la ensalada.',
    prevDescriptionsEs: [
      'La Vine Creeper: una planta enorme con colmillos, garras y serios problemas para respetar el espacio personal. Su enredadera te agarra, te arrastra hacia ella y no te suelta hasta que muere, como el peor ex del mundo. Consejo pro: si te pilla, relájate y deja que tu equipo se encargue de matarla. Disfruta de las vistas desde la boca de la ensalada.',
    ],
  },
  {
    name: 'Giant Spiders',
    kind: 'mob',
    size: 'Large (5)',
    tags: 'Beast',
    slots: '3',
    slotValue: '2',
    level: '3',
    surprise: '11+F',
    evade: '12+F',
    move: '25+S',
    dr: '1',
    stats: {
      str: {
        score: '6',
        mod: '+3',
      },
      int: {
        score: '1',
        mod: '+1',
      },
      con: {
        score: '3',
        mod: '+2',
      },
      dex: {
        score: '3',
        mod: '+2',
      },
      cha: {
        score: '1',
        mod: '+1',
      },
    },
    attacks: [
      {
        name: 'Bite',
        toHit: '13+F',
        damage: '1d6+3 Piercing',
        range: '5ft range',
        effect: 'Major Fail+: Poison',
      },
      {
        name: 'Webshot',
        toHit: '12+F',
        damage: '1d8+2 Bludgeoning',
        range: '50ft range',
        effect: 'Major Fail+: Held',
      },
    ],
    notes:
      'Webs: non-spiders standing in webbing → ½ movement speed, no 10ft Step.\n\nFull text: GM Campaign Toolkit p. 51.',
    source: 'GM Campaign Toolkit p. 51',
    chapter: 'Floor 1 · GM Toolkit',
    floor: 1,
    description:
      "Giant Spiders! Hairy, huge, and packing web shooters. No, not that guy, and my lawyers insist I stop saying it. Get caught in their webbing and you'll move at half speed with no step, like a hungover sloth. Pro tip: watch the floor. Every sticky patch is a free buffet invitation.",
    prevDescriptions: [
      "Big. Hairy. Eight legs. Web shooters. Nope, not that guy, and there's no friendly neighborhood here. Get stuck in their webs and you'll crawl like a DMV line. Pro tip: burn the webs or watch where you walk.",
    ],
    prevNotes: [
      'Full text: GM Campaign Toolkit p. 51.',
      'Webs: non-spiders standing in webbing → ½ movement speed, no 10ft Step.\n\nFull text: GM Campaign Toolkit p. 51.',
    ],
    descriptionEs:
      '¡Giant Spiders! Peludas, enormes y equipadas con lanzatelarañas. No, ese no, y mis abogados insisten en que deje de decirlo. Quédate pegado en su telaraña y te moverás a mitad de velocidad y sin paso, como un perezoso con resaca. Pro-Tip: mira al suelo. Cada charco pegajoso es una invitación gratis al bufé.',
    prevDescriptionsEs: [
      '¡Giant Spiders! Peludas, enormes y equipadas con lanzatelarañas. No, ese no, y mis abogados insisten en que deje de decirlo. Quédate pegado en su telaraña y te moverás a mitad de velocidad y sin paso, como un perezoso con resaca. Consejo pro: mira al suelo. Cada charco pegajoso es una invitación gratis al bufé.',
    ],
  },
  {
    name: 'Bad Llama',
    kind: 'mob',
    size: 'Large (5)',
    tags: 'Mutated',
    slots: '3',
    slotValue: '2',
    level: '3',
    surprise: '11+F',
    evade: '13+F',
    move: '20+S',
    dr: '2',
    stats: {
      str: {
        score: '3',
        mod: '+2',
      },
      int: {
        score: '1',
        mod: '+1',
      },
      con: {
        score: '3',
        mod: '+2',
      },
      dex: {
        score: '6',
        mod: '+3',
      },
      cha: {
        score: '1',
        mod: '+1',
      },
    },
    attacks: [
      {
        name: 'Lava Spit',
        toHit: '13+F',
        damage: '1d8+3 Fire',
        range: '30ft range',
        effect: 'Major Fail+: Burning',
      },
    ],
    notes:
      'Bad Reflux: in a round when it uses Lava Spit, a crawler may aim at the lava pouch in its throat (+2 to its Evade for that attack). If that attack deals any damage, the pouch bursts: the Llama dies and its body catches fire.\n\nFull text: GM Campaign Toolkit p. 51.',
    source: 'GM Campaign Toolkit p. 51',
    chapter: 'Floor 1 · GM Toolkit',
    floor: 1,
    description:
      "Behold the Bad Llama, a llama that spits molten fucking lava. It stores it in a throat pouch, and yes, it's exactly as fragile as it sounds. Pro tip: when it rears back to spit, aim at the pouch. Land any damage and the whole thing goes up like a flaming piñata. Llama flambé, folks!",
    prevDescriptions: [
      "Somebody looked at a llama and asked: what if the spit was on fire? That somebody was me. You're welcome. It keeps molten rock in a throat pouch and hocks it at anything that looks at it funny. Pro tip: poke the pouch. The viewers love a barbecue.",
    ],
    prevNotes: [
      'Special: Bad Reflux. Full text: GM Campaign Toolkit p. 51.',
      'Bad Reflux: in a round when it uses Lava Spit, a crawler may aim at the lava pouch in its throat (+2 to its Evade for that attack). If that attack deals any damage, the pouch bursts: the Llama dies and its body catches fire.\n\nFull text: GM Campaign Toolkit p. 51.',
    ],
    descriptionEs:
      'Contemplad la Bad Llama, una llama que escupe lava fundida, joder. La guarda en una bolsa en la garganta y sí, es exactamente igual de frágil de lo que suena. Pro-Tip: cuando eche la cabeza atrás para escupir, apunta a la bolsa. Hazle cualquier daño y todo el bicho revienta como una piñata en llamas. ¡Llama flambeada, señores!',
    prevDescriptionsEs: [
      'Contemplad la Bad Llama, una llama que escupe lava fundida, joder. La guarda en una bolsa en la garganta y sí, es exactamente igual de frágil de lo que suena. Consejo pro: cuando eche la cabeza atrás para escupir, apunta a la bolsa. Hazle cualquier daño y todo el bicho revienta como una piñata en llamas. ¡Llama flambeada, señores!',
    ],
  },
  {
    name: 'Slimy Croaker',
    kind: 'mob',
    size: 'Small (2)',
    tags: 'Beastly',
    slots: '3',
    slotValue: '2',
    level: '3',
    surprise: '11+F',
    evade: '12+F',
    move: '20+S',
    dr: '1',
    stats: {
      str: {
        score: '3',
        mod: '+2',
      },
      int: {
        score: '1',
        mod: '+1',
      },
      con: {
        score: '3',
        mod: '+2',
      },
      dex: {
        score: '5',
        mod: '+2',
      },
      cha: {
        score: '2',
        mod: '+1',
      },
    },
    attacks: [
      {
        name: 'Tongue Whip',
        toHit: '12+F',
        damage: '1d6+2 Bludgeoning',
        range: '10ft range',
        effect: 'Major Fail+: Paralyzed',
      },
      {
        name: 'Croak',
        toHit: '11+F',
        damage: '1d4+2 Sonic',
        range: '20ft Cone +10ft Splash',
        effect: '',
      },
    ],
    notes:
      'Egg Protector: usually guards Aranaea Magnus eggs. If those eggs are damaged, its croaks send every Croaker within 60ft to surround the attacker.\nSlippery Slime: after each Attack Action, slime fills its space for the rest of the combat. The first time a crawler enters a slime space, Dex Stat Check; on Fail they gain Take Down. On death it leaves slime in its space and all adjacent spaces.\n\nFull text: GM Campaign Toolkit p. 52.',
    source: 'GM Campaign Toolkit p. 52',
    chapter: 'Floor 1 · GM Toolkit',
    floor: 1,
    description:
      'Slimy Croakers: frogs that guard giant spider eggs, slime the floor after every attack, and croak loud enough to rattle your fillings. Step in the goo and you might eat shit face-first. Pro tip: damage those eggs and every frog within 60 feet comes for you. So obviously, please damage the eggs. My ratings need it.',
    prevDescriptions: [
      "Frogs! Slimy, loud, and deeply protective of some very large spider eggs. Every time they attack they leave a slip-n-slide behind, and their tongue can lock you up cold. Pro tip: don't touch the eggs. Or do. The chaos is great for my numbers.",
    ],
    prevNotes: [
      'Special: Egg Protector; Slippery Slime. Full text: GM Campaign Toolkit p. 52.',
      'Egg Protector: usually guards Aranaea Magnus eggs. If those eggs are damaged, its croaks send every Croaker within 60ft to surround the attacker.\nSlippery Slime: after each Attack Action, slime fills its space for the rest of the combat. The first time a crawler enters a slime space, Dex Stat Check; on Fail they gain Take Down. On death it leaves slime in its space and all adjacent spaces.\n\nFull text: GM Campaign Toolkit p. 52.',
    ],
    descriptionEs:
      'Slimy Croakers: ranas que custodian huevos de araña gigante, embadurnan el suelo de baba tras cada ataque y croan tan alto que te hacen vibrar los empastes. Pisa el mejunje y puede que te comas el suelo de morros. Pro-Tip: daña esos huevos y todas las ranas en 60 pies irán a por ti. Así que, obviamente, por favor, dañad los huevos. Mi audiencia lo necesita.',
    prevDescriptionsEs: [
      'Slimy Croakers: ranas que custodian huevos de araña gigante, embadurnan el suelo de baba tras cada ataque y croan tan alto que te hacen vibrar los empastes. Pisa el mejunje y puede que te comas el suelo de morros. Consejo pro: daña esos huevos y todas las ranas en 60 pies irán a por ti. Así que, obviamente, por favor, dañad los huevos. Mi audiencia lo necesita.',
    ],
  },
  {
    name: 'Literal Murder Hornets',
    kind: 'mob',
    size: 'Petite (3)',
    tags: 'Insect',
    slots: '2',
    slotValue: '2',
    level: '2',
    surprise: '11+F',
    evade: '12+F',
    move: '25+S',
    dr: '1',
    stats: {
      str: {
        score: '3',
        mod: '+2',
      },
      int: {
        score: '1',
        mod: '+1',
      },
      con: {
        score: '3',
        mod: '+2',
      },
      dex: {
        score: '3',
        mod: '+2',
      },
      cha: {
        score: '1',
        mod: '+1',
      },
    },
    attacks: [
      {
        name: 'Bite',
        toHit: '12+F',
        damage: '1d8+2 Piercing',
        range: '5ft range',
        effect: '',
      },
      {
        name: 'Stinger',
        toHit: '12+F',
        damage: '1d6+2 Piercing',
        range: '30ft range',
        effect: 'Major Fail+: Poison',
      },
    ],
    notes: 'Flight: moves through the air as if on the ground and can hover.\n\nFull text: GM Campaign Toolkit p. 52.',
    source: 'GM Campaign Toolkit p. 52',
    chapter: 'Floor 1 · GM Toolkit',
    floor: 1,
    description:
      "Literal Murder Hornets. That's not a metaphor, that's a job description. They fly, they bite, and they sting from 30 feet away, so running screaming only makes you a moving target. Pro tip: swatting at them just looks like interpretive dance. Hilarious interpretive dance.",
    prevDescriptions: [
      'The name is not a metaphor. These hornets bite, sting from 30 feet, and fly wherever they please. Pro tip: swatting is not a strategy. Running is barely one.',
    ],
    prevNotes: [
      'Special: Flight. Full text: GM Campaign Toolkit p. 52.',
      'Flight: moves through the air as if on the ground and can hover.\n\nFull text: GM Campaign Toolkit p. 52.',
    ],
    descriptionEs:
      'Literal Murder Hornets. No es una metáfora, es la descripción del puesto. Vuelan, muerden y pican desde 30 pies, así que salir corriendo y gritando solo te convierte en un blanco móvil. Pro-Tip: darles manotazos solo parece danza contemporánea. Danza contemporánea desternillante.',
    prevDescriptionsEs: [
      'Literal Murder Hornets. No es una metáfora, es la descripción del puesto. Vuelan, muerden y pican desde 30 pies, así que salir corriendo y gritando solo te convierte en un blanco móvil. Consejo pro: darles manotazos solo parece danza contemporánea. Danza contemporánea desternillante.',
    ],
  },
  {
    name: 'Aranaea Magnus',
    kind: 'boss',
    size: 'Large (5)',
    tags: 'Neighborhood Boss, Monstrous',
    slots: '11',
    slotValue: '4',
    level: '7',
    surprise: '12+F',
    evade: '14+F',
    move: '30+S',
    dr: '1',
    stats: {
      str: {
        score: '12',
        mod: '+4',
      },
      int: {
        score: '5',
        mod: '+2',
      },
      con: {
        score: '10',
        mod: '+4',
      },
      dex: {
        score: '11',
        mod: '+4',
      },
      cha: {
        score: '8',
        mod: '+3',
      },
    },
    attacks: [
      {
        name: 'Rending Leg-Claws',
        toHit: '14+F',
        damage: '2d8+4 Slashing',
        range: '10ft range',
        effect: '',
      },
      {
        name: 'Caustic Silk Spray',
        toHit: '14+F',
        damage: '1d8+4 Acid',
        range: '30ft Cone',
        effect: 'Major Fail+: Webbed; once per round',
      },
      {
        name: 'Drop',
        toHit: '12+F',
        damage: '1d10+2 Bludgeoning',
        range: '',
        effect: 'Special effect',
      },
      {
        name: 'Paralyzing Pedipalps',
        toHit: '14+F',
        damage: '2d4+4 Bludgeoning',
        range: '5ft range',
        effect: 'Major Fail+: Staggered; once per round',
      },
      {
        name: 'Venomous Fangs',
        toHit: '14+F',
        damage: '2d6+4 Piercing',
        range: '5ft range',
        effect: 'Major Fail+: Poisoned; once per round',
      },
      {
        name: 'Web',
        toHit: '14+F',
        damage: '1d4+4 Bludgeoning',
        range: '90ft range, 5ft',
        effect: 'Special effect',
      },
    ],
    notes:
      "Wall Walker: moves on walls and ceilings as if on the ground.\nWebbing: a Web attack that misses its target coats surfaces in the area. Anyone entering a webbed space makes a Str Stat Check or becomes Webbed; either way, that space and adjacent spaces are cleared of web.\nTangled: -10 Move while in webbing.\nCaustic Silk Spray: once per round. On Evade Major Fail or worse, target is Webbed and takes 1d6+F Acid at the end of each round.\nDrop: once, at the start of the fight, if above ground: lands straight down, attacking enemies beneath and adjacent. If Slimy Croaker slime is there, it slips and loses 2 Health Bar slots. If it hits no crawlers, it's Stunned: loses its remaining Actions this round and 1 Action next round.\nParalyzing Pedipalps: once per round.\nVenomous Fangs: once per round. On Evade Major Fail or worse, also -1 to target's Evade.\nWeb: hit crawlers roll their next Evade with Disadvantage and can't Step until they spend an Action tearing free.\n\nFull text: GM Campaign Toolkit p. 59.",
    source: 'GM Campaign Toolkit p. 59',
    chapter: 'Floor 1 · GM Toolkit',
    floor: 1,
    description:
      "Aranaea Magnus: a spider the size of a minivan who crawls on ceilings and has more attacks than you have friends. She drops out of nowhere, sprays acid silk, and chews on your screaming carcass. Pro tip: if the floor's slick with frog slime, her grand entrance turns into a pratfall. Nothing's funnier than a spider on her ass.",
    prevDescriptions: [
      "Meet the Aranaea Magnus, a spider the size of a minivan that ignores gravity out of pure spite. She drops from the ceiling, sprays acid silk, and bites with everything she's got. Pro tip: she's clumsy in her own webs, and a frog-slimed floor makes her grand entrance a pratfall. Physics is on your side for once.",
    ],
    prevNotes: [
      'Special: Eight Middle Fingers to Gravity; Webbing; Tangled. Full text: GM Campaign Toolkit p. 59.',
      "Wall Walker: moves on walls and ceilings as if on the ground.\nWebbing: a Web attack that misses its target coats surfaces in the area. Anyone entering a webbed space makes a Str Stat Check or becomes Webbed; either way, that space and adjacent spaces are cleared of web.\nTangled: -10 Move while in webbing.\nCaustic Silk Spray: once per round. On Evade Major Fail or worse, target is Webbed and takes 1d6+F Acid at the end of each round.\nDrop: once, at the start of the fight, if above ground: lands straight down, attacking enemies beneath and adjacent. If Slimy Croaker slime is there, it slips and loses 2 Health Bar slots. If it hits no crawlers, it's Stunned: loses its remaining Actions this round and 1 Action next round.\nParalyzing Pedipalps: once per round.\nVenomous Fangs: once per round. On Evade Major Fail or worse, also -1 to target's Evade.\nWeb: hit crawlers roll their next Evade with Disadvantage and can't Step until they spend an Action tearing free.\n\nFull text: GM Campaign Toolkit p. 59.",
    ],
    descriptionEs:
      'Aranaea Magnus: una araña del tamaño de una furgoneta que trepa por los techos y tiene más ataques que tú amigos. Cae de la nada, rocía seda ácida y mastica tu cadáver mientras aún gritas. Pro-Tip: si el suelo está resbaladizo por la baba de rana, su gran entrada se convierte en un tortazo de película muda. No hay nada más gracioso que una araña de culo en el suelo.',
    prevDescriptionsEs: [
      'Aranaea Magnus: una araña del tamaño de una furgoneta que trepa por los techos y tiene más ataques que tú amigos. Cae de la nada, rocía seda ácida y mastica tu cadáver mientras aún gritas. Consejo pro: si el suelo está resbaladizo por la baba de rana, su gran entrada se convierte en un tortazo de película muda. No hay nada más gracioso que una araña de culo en el suelo.',
    ],
  },
  {
    name: 'Chef BoyardOoze',
    kind: 'mob',
    size: 'Small (2)',
    tags: 'Ooze',
    slots: '4',
    slotValue: '3',
    level: '4',
    surprise: '11+F',
    evade: '12+F',
    move: '10+S',
    dr: '2',
    stats: {
      str: {
        score: '6',
        mod: '+3',
      },
      int: {
        score: '1',
        mod: '+1',
      },
      con: {
        score: '6',
        mod: '+3',
      },
      dex: {
        score: '3',
        mod: '+2',
      },
      cha: {
        score: '1',
        mod: '+1',
      },
    },
    attacks: [
      {
        name: 'Tendril',
        toHit: '14+F',
        damage: '1d6+3 Bludgeoning',
        range: '10ft range',
        effect: 'Major Fail+: Held, Saucy',
      },
    ],
    notes:
      'Slick Trail: its slime trails add +2 Difficulty to Dexterity-based Skills.\nCold Vulnerability: Ice damage bypasses DR and deals x2.\nHeat Vulnerability: Fire damage bypasses DR and deals x2.\nRegenerate Health: heals 1 Health Bar slot at the end of each round.\nTendril: on Evade Major Fail or worse, crawler gains Held and Saucy (take 1d6+F Acid at the end of each round until combat ends).\n\nFull text: GM Campaign Toolkit p. 62.',
    source: 'GM Campaign Toolkit p. 62',
    chapter: 'Floor 1 · GM Toolkit',
    floor: 1,
    description:
      "Chef BoyardOoze: canned pasta that grabs you, sauces you, and digests you alive in its own acidic marinara. It regenerates every round, so dawdling is how you become tomorrow's special. Pro tip: fire or ice both do double damage and ignore its DR. Microwave it or freeze it, just don't eat the leftovers.",
    prevDescriptions: [
      "Mmm, canned pasta that fights back. Chef BoyardOoze grabs you, sauces you, and slowly digests you from the outside in. It regenerates every round, so dawdling is not an option. Pro tip: it hates hot and cold equally, so either nuke it or freeze it. Just don't leave it in the microwave too long.",
    ],
    prevNotes: [
      'Special: Cold Vulnerability; Heat Vulnerability; Regenerate Health. Full text: GM Campaign Toolkit p. 62.',
      'Slick Trail: its slime trails add +2 Difficulty to Dexterity-based Skills.\nCold Vulnerability: Ice damage bypasses DR and deals x2.\nHeat Vulnerability: Fire damage bypasses DR and deals x2.\nRegenerate Health: heals 1 Health Bar slot at the end of each round.\nTendril: on Evade Major Fail or worse, crawler gains Held and Saucy (take 1d6+F Acid at the end of each round until combat ends).\n\nFull text: GM Campaign Toolkit p. 62.',
    ],
    descriptionEs:
      'Chef BoyardOoze: pasta de lata que te agarra, te baña en salsa y te digiere vivo en su propia marinara ácida. Se regenera cada ronda, así que remolonear es la forma de convertirte en el plato del día de mañana. Pro-Tip: fuego o hielo hacen el doble de daño e ignoran su RD. Mételo en el micro o congélalo, pero no te comas las sobras.',
    prevDescriptionsEs: [
      'Chef BoyardOoze: pasta de lata que te agarra, te baña en salsa y te digiere vivo en su propia marinara ácida. Se regenera cada ronda, así que remolonear es la forma de convertirte en el plato del día de mañana. Consejo pro: fuego o hielo hacen el doble de daño e ignoran su RD. Mételo en el micro o congélalo, pero no te comas las sobras.',
    ],
  },
  {
    name: 'Rat Brute (p. 62)',
    kind: 'mob',
    size: 'Petite (3)',
    tags: 'Humanoid',
    slots: '4',
    slotValue: '3',
    level: '4',
    surprise: '11+F',
    evade: '12+F',
    move: '20+S',
    dr: '1',
    stats: {
      str: {
        score: '6',
        mod: '+3',
      },
      int: {
        score: '1',
        mod: '+1',
      },
      con: {
        score: '6',
        mod: '+3',
      },
      dex: {
        score: '3',
        mod: '+2',
      },
      cha: {
        score: '1',
        mod: '+1',
      },
    },
    attacks: [
      {
        name: 'Knife',
        toHit: '13+F',
        damage: '1d6+3 Slashing',
        range: '5ft range',
        effect: '',
      },
      {
        name: 'Crossbow',
        toHit: '12+F',
        damage: '1d8 Piercing',
        range: '50ft range',
        effect: '',
      },
    ],
    notes:
      'Roid Rage: sudden noise, bright light or a perceived insult triggers a rage that doubles the Stat Mod bonus on its damage rolls.\nPushing Through: can make one more attack after being reduced to 0% HB.\nWeak-Minded: hard to Intimidate, but charm and other mind-control attempts against it have Advantage.\n\nFull text: GM Campaign Toolkit p. 62.',
    source: 'GM Campaign Toolkit p. 62',
    chapter: 'Floor 1 · GM Toolkit',
    floor: 1,
    description:
      "Back for round two, it's the Rat Brute! Stuffed with enough steroids to make a bodybuilder weep and pissed off by literally anything. Loud noise, bright light, or a 'your mom' joke and his hits double. Pro tip: he swings once more after hitting zero. Wait for the corpse to stop twitching before you teabag it.",
    prevDescriptions: [
      "Another Rat Brute, fresh off leg day and furious about it. Knives up close, crossbow at range, and a temper like a car alarm. Pro tip: he'll swing once more after you drop him, so don't start celebrating at zero. Wait for the thud.",
    ],
    prevNotes: [
      'Special: Roid Rage; Weak-Minded. Full text: GM Campaign Toolkit p. 62.',
      'Roid Rage: sudden noise, bright light or a perceived insult triggers a rage that doubles the Stat Mod bonus on its damage rolls.\nPushing Through: can make one more attack after being reduced to 0% HB.\nWeak-Minded: hard to Intimidate, but charm and other mind-control attempts against it have Advantage.\n\nFull text: GM Campaign Toolkit p. 62.',
    ],
    descriptionEs:
      "¡Vuelve para el segundo asalto, es el Rat Brute! Tan atiborrado de esteroides que haría llorar a un culturista, y cabreado por literalmente cualquier cosa. Un ruido fuerte, una luz brillante o un chiste de 'tu madre' y sus golpes se duplican. Pro-Tip: da un golpe más después de llegar a cero. Espera a que el cadáver deje de retorcerse antes de hacerle el bailecito de la victoria encima.",
    prevDescriptionsEs: [
      "¡Vuelve para el segundo asalto, es el Rat Brute! Tan atiborrado de esteroides que haría llorar a un culturista, y cabreado por literalmente cualquier cosa. Un ruido fuerte, una luz brillante o un chiste de 'tu madre' y sus golpes se duplican. Consejo pro: da un golpe más después de llegar a cero. Espera a que el cadáver deje de retorcerse antes de hacerle el bailecito de la victoria encima.",
    ],
  },
  {
    name: 'Rat Shaman (p. 63)',
    kind: 'mob',
    size: 'Petite (3)',
    tags: 'Humanoid',
    slots: '5',
    slotValue: '2',
    level: '5',
    surprise: '14+F',
    evade: '12+F',
    move: '20+S',
    dr: '1',
    stats: {
      str: {
        score: '1',
        mod: '+1',
      },
      int: {
        score: '10',
        mod: '+4',
      },
      con: {
        score: '3',
        mod: '+2',
      },
      dex: {
        score: '3',
        mod: '+2',
      },
      cha: {
        score: '3',
        mod: '+2',
      },
    },
    attacks: [
      {
        name: 'Clap Cloud Spell',
        toHit: '14+F',
        damage: '1d4+4 Force',
        range: '50ft range, 20ft Blast radius',
        effect: 'Major Fail+: Queasy',
      },
      {
        name: 'Firestrike Spell',
        toHit: '14+F',
        damage: '2d6+4 Fire',
        range: '30ft range',
        effect: 'once per round',
      },
      {
        name: 'Mini Fireball Spell',
        toHit: '14+F',
        damage: '1d6+4 Fire',
        range: '60ft range, 15ft Blast radius',
        effect: 'Special effect',
      },
    ],
    notes: 'Firestrike Spell: usable once per round.\n\nFull text: GM Campaign Toolkit p. 63.',
    source: 'GM Campaign Toolkit p. 63',
    chapter: 'Floor 1 · GM Toolkit',
    floor: 1,
    description:
      'This Rat Shaman got a promotion: bigger fireball, and now she drops Firestrike every single round instead of taking a coffee break. Her clap cloud leaves you queasy, so expect projectile vomiting on live broadcast. Pro tip: scatter before she lobs, then rush her. Dead mages cast no spells.',
    prevDescriptions: [
      'This Rat Shaman got a promotion and a bigger fireball. Clap clouds to make you queasy, firestrikes every single round, and a wider blast to punish your little huddle. Pro tip: scatter, then rush her. Shamans hate personal space violations.',
    ],
    prevNotes: [
      'Full text: GM Campaign Toolkit p. 63.',
      'Firestrike Spell: usable once per round.\n\nFull text: GM Campaign Toolkit p. 63.',
    ],
    descriptionEs:
      'Esta Rat Shaman ha conseguido un ascenso: bola de fuego más grande, y ahora suelta un Firestrike todas y cada una de las rondas en vez de tomarse la pausa del café. Su nube de palmada te deja con el estómago revuelto, así que prepárate para vomitar a chorro en directo. Pro-Tip: dispersaos antes de que lance y luego id a por ella. Mago muerto no lanza hechizos.',
    prevDescriptionsEs: [
      'Esta Rat Shaman ha conseguido un ascenso: bola de fuego más grande, y ahora suelta un Firestrike todas y cada una de las rondas en vez de tomarse la pausa del café. Su nube de palmada te deja con el estómago revuelto, así que prepárate para vomitar a chorro en directo. Consejo pro: dispersaos antes de que lance y luego id a por ella. Mago muerto no lanza hechizos.',
    ],
  },
  {
    name: 'Rat Hooligan (p. 64)',
    kind: 'mob',
    size: 'Petite (3)',
    tags: 'Rat Hybrid',
    slots: '8',
    slotValue: '2',
    level: '8',
    surprise: '14+F',
    evade: '12+F',
    move: '20+S',
    dr: '2',
    stats: {
      str: {
        score: '8',
        mod: '+3',
      },
      int: {
        score: '11',
        mod: '+4',
      },
      con: {
        score: '3',
        mod: '+2',
      },
      dex: {
        score: '3',
        mod: '+2',
      },
      cha: {
        score: '4',
        mod: '+2',
      },
    },
    attacks: [
      {
        name: 'Longsword',
        toHit: '13+F',
        damage: '2d8+2 Slashing',
        range: '5ft range',
        effect: '',
      },
      {
        name: 'Firebolt Spell',
        toHit: '14+F',
        damage: '2d6+2 Fire',
        range: '30ft range',
        effect: 'Special effect',
      },
    ],
    notes:
      'Heal Others Spell: heals one target within 10ft for 1d6 Health Bar slots.\n\nFull text: GM Campaign Toolkit p. 64.',
    source: 'GM Campaign Toolkit p. 64',
    chapter: 'Floor 1 · GM Toolkit',
    floor: 1,
    description:
      "The deluxe Rat Hooligan, level 8, now with a bigger sword, hotter firebolts, and better heals. Same asshole, better stats, like a sequel nobody asked for that still makes bank. Pro tip: kill him before he heals anyone. I'm begging you. Watching you idiots re-kill the same rats is bad television.",
    prevDescriptions: [
      "The upgraded Rat Hooligan: level 8, heavier sword, hotter firebolt, better heals. Think of him as the same guy after a very productive montage. Pro tip: kill the healer. It's the oldest advice in gaming because it's always true.",
    ],
    prevNotes: [
      'Full text: GM Campaign Toolkit p. 64.',
      'Heal Others Spell: heals one target within 10ft for 1d6 Health Bar slots.\n\nFull text: GM Campaign Toolkit p. 64.',
    ],
    descriptionEs:
      'El Rat Hooligan deluxe, nivel 8, ahora con espada más grande, rayos de fuego más calientes y mejores curas. El mismo cabrón con mejores stats, como una secuela que nadie pidió pero que sigue forrándose en taquilla. Pro-Tip: mátalo antes de que cure a nadie. Os lo suplico. Ver a unos idiotas como vosotros matar otra vez a las mismas ratas es mala televisión.',
    prevDescriptionsEs: [
      'El Rat Hooligan deluxe, nivel 8, ahora con espada más grande, rayos de fuego más calientes y mejores curas. El mismo cabrón con mejores stats, como una secuela que nadie pidió pero que sigue forrándose en taquilla. Consejo pro: mátalo antes de que cure a nadie. Os lo suplico. Ver a unos idiotas como vosotros matar otra vez a las mismas ratas es mala televisión.',
    ],
  },
  {
    name: 'Critical Consensus',
    kind: 'boss',
    size: 'Huge (6)',
    tags: 'Neighborhood Boss, Zombie',
    slots: '11',
    slotValue: '5',
    level: '8',
    surprise: '12+F',
    evade: '12+F',
    move: '10+S',
    dr: '2',
    stats: {
      str: {
        score: '15',
        mod: '+4',
      },
      int: {
        score: '5',
        mod: '+2',
      },
      con: {
        score: '20',
        mod: '+5',
      },
      dex: {
        score: '5',
        mod: '+2',
      },
      cha: {
        score: '4',
        mod: '+2',
      },
    },
    attacks: [
      {
        name: 'Slam',
        toHit: '14+F',
        damage: '2d8+4 Necrotic',
        range: '5ft range',
        effect: 'Major Fail+: Held, Staggered',
      },
    ],
    notes:
      'Constant Hunger: as an Action, eats any food in sight and heals 1d4 Health Bar slots per meal. Relentlessly targets any crawler carrying food, moving at double speed while doing so.\nFoodporn: the first time it inflicts Held on each crawler, it snaps and posts a photo to a public forum.\nOver-Seasoned: oversalted food costs it 1 Health Bar slot instead of healing it.\nPower Boost: Shambling Berserker; in darkness its Stat Mod to damage is quadrupled.\nSlam: every hit applies Held; on Evade Major Fail or worse, also Staggered.\n\nFull text: GM Campaign Toolkit p. 69.',
    source: 'GM Campaign Toolkit p. 69',
    chapter: 'Floor 1 · GM Toolkit',
    floor: 1,
    description:
      'Critical Consensus: a massive zombie food critic that devours everything, gets stronger in the dark, and posts pictures of you getting mauled online. Carry food and it sprints for you. Pro tip: oversalt your snacks. It takes damage from salty food, and you get to watch a zombie choke on its own reviews.',
    prevDescriptions: [
      'Critical Consensus: a giant zombie food critic who eats everything and posts your worst moments online. Carry snacks and it will sprint for you. Fight it in the dark and it hits like a truck. Pro tip: salt your rations, keep the lights on, and smile for the camera.',
    ],
    prevNotes: [
      'Special: Constant Hunger; Foodporn; Over-Seasoned; Power Boost. Full text: GM Campaign Toolkit p. 69.',
      'Constant Hunger: as an Action, eats any food in sight and heals 1d4 Health Bar slots per meal. Relentlessly targets any crawler carrying food, moving at double speed while doing so.\nFoodporn: the first time it inflicts Held on each crawler, it snaps and posts a photo to a public forum.\nOver-Seasoned: oversalted food costs it 1 Health Bar slot instead of healing it.\nPower Boost: Shambling Berserker; in darkness its Stat Mod to damage is quadrupled.\nSlam: every hit applies Held; on Evade Major Fail or worse, also Staggered.\n\nFull text: GM Campaign Toolkit p. 69.',
    ],
    descriptionEs:
      'Critical Consensus: un crítico gastronómico zombi gigantesco que lo devora todo, se hace más fuerte en la oscuridad y sube a internet fotos de cómo te destroza. Lleva comida encima y saldrá disparado a por ti. Pro-Tip: pásate con la sal en tus snacks. La comida salada le hace daño, y podrás ver a un zombi atragantarse con sus propias reseñas.',
    prevDescriptionsEs: [
      'Critical Consensus: un crítico gastronómico zombi gigantesco que lo devora todo, se hace más fuerte en la oscuridad y sube a internet fotos de cómo te destroza. Lleva comida encima y saldrá disparado a por ti. Consejo pro: pásate con la sal en tus snacks. La comida salada le hace daño, y podrás ver a un zombi atragantarse con sus propias reseñas.',
    ],
  },
  {
    name: 'Shambling Acid Impaler',
    kind: 'mob',
    size: 'Large (5)',
    tags: 'Zombie',
    slots: '6',
    slotValue: '3',
    level: '6',
    surprise: '11+F',
    evade: '14+F',
    move: '10+S',
    dr: '2',
    stats: {
      str: {
        score: '3',
        mod: '+2',
      },
      int: {
        score: '1',
        mod: '+1',
      },
      con: {
        score: '6',
        mod: '+3',
      },
      dex: {
        score: '10',
        mod: '+4',
      },
      cha: {
        score: '3',
        mod: '+2',
      },
    },
    attacks: [
      {
        name: 'Acid Dart',
        toHit: '14+F',
        damage: '2d6+2 Acid',
        range: '40ft range',
        effect: 'Major Fail+: Queasy, Dissolving',
      },
      {
        name: 'Tongue Lash',
        toHit: '12+F',
        damage: '2d8+2 Bludgeoning',
        range: '10ft range',
        effect: 'Major Fail+: Dissolving',
      },
    ],
    notes:
      'Dissolving: take 1d6+F Acid at the end of each round until combat ends. Acid Dart applies Queasy and Dissolving; Tongue Lash applies Dissolving.\n\nFull text: GM Campaign Toolkit p. 86.',
    source: 'GM Campaign Toolkit p. 86',
    chapter: 'Floor 2 · GM Toolkit',
    floor: 2,
    description:
      "The Shambling Acid Impaler spits acid darts and whips you with a tongue that dissolves your skin like a cheap bath bomb. Once you're tagged, you keep melting until the fight is over. Pro tip: end this fast, or bring a mop for what's left of you.",
    prevDescriptions: [
      "This zombie spits acid darts and whips you with a tongue that melts on contact. Get tagged and you'll keep dissolving until the fight's over, like a bath bomb nobody wanted. Pro tip: end the fight fast, or bring a lot of healing.",
    ],
    prevNotes: [
      'Full text: GM Campaign Toolkit p. 86.',
      'Dissolving: take 1d6+F Acid at the end of each round until combat ends. Acid Dart applies Queasy and Dissolving; Tongue Lash applies Dissolving.\n\nFull text: GM Campaign Toolkit p. 86.',
    ],
    descriptionEs:
      'El Shambling Acid Impaler escupe dardos de ácido y te azota con una lengua que te disuelve la piel como una bomba de baño de todo a cien. Una vez te ha marcado, sigues derritiéndote hasta que acaba el combate. Pro-Tip: termina esto rápido, o trae una fregona para lo que quede de ti.',
    prevDescriptionsEs: [
      'El Shambling Acid Impaler escupe dardos de ácido y te azota con una lengua que te disuelve la piel como una bomba de baño de todo a cien. Una vez te ha marcado, sigues derritiéndote hasta que acaba el combate. Consejo pro: termina esto rápido, o trae una fregona para lo que quede de ti.',
    ],
  },
  {
    name: 'Sprites',
    kind: 'mob',
    size: 'Tiny (1)',
    tags: 'Humanoid, Winged Fairy',
    slots: '7',
    slotValue: '3',
    level: '7',
    surprise: '12+F',
    evade: '13+F',
    move: '20+S',
    dr: '2',
    stats: {
      str: {
        score: '3',
        mod: '+2',
      },
      int: {
        score: '3',
        mod: '+2',
      },
      con: {
        score: '6',
        mod: '+3',
      },
      dex: {
        score: '7',
        mod: '+3',
      },
      cha: {
        score: '7',
        mod: '+3',
      },
    },
    attacks: [
      {
        name: 'Pitchfork',
        toHit: '12+F',
        damage: '2d8+2 Piercing',
        range: '5ft range',
        effect: '',
      },
      {
        name: 'Thrown Rock',
        toHit: '12+F',
        damage: '2d6+2 Bludgeoning',
        range: '30ft range',
        effect: 'Special effect',
      },
    ],
    notes: 'Full text: GM Campaign Toolkit p. 86.',
    source: 'GM Campaign Toolkit p. 86',
    chapter: 'Floor 2 · GM Toolkit',
    floor: 2,
    description:
      "Sprites! Thumb-sized fairies with pitchforks and rocks, like a pissed-off peasant mob shrunk in the wash. They're level 7, so they hit like goddamn freight trains. Pro tip: don't laugh at the little bastards. They hear everything and hold grudges forever.",
    prevDescriptions: [
      "Sprites! Tiny, winged, and armed with pitchforks and rocks like an angry medieval village the size of your thumb. Don't let the level fool you or the size comfort you. They hit way harder than anything this cute should.",
    ],
    prevNotes: ['Full text: GM Campaign Toolkit p. 86.'],
    descriptionEs:
      '¡Sprites! Hadas del tamaño de un pulgar con horcas y piedras, como una turba de campesinos cabreados que ha encogido en la lavadora. Son de nivel 7, así que pegan como un puto tren de mercancías. Pro-Tip: no te rías de los cabroncetes. Lo oyen todo y guardan rencor para siempre.',
    prevDescriptionsEs: [
      '¡Sprites! Hadas del tamaño de un pulgar con horcas y piedras, como una turba de campesinos cabreados que ha encogido en la lavadora. Son de nivel 7, así que pegan como un puto tren de mercancías. Consejo pro: no te rías de los cabroncetes. Lo oyen todo y guardan rencor para siempre.',
    ],
  },
  {
    name: 'Canis Knights',
    kind: 'mob',
    size: 'Petite (3)',
    tags: 'Humanoid',
    slots: '5',
    slotValue: '2',
    level: '5',
    surprise: '11+F',
    evade: '12+F',
    move: '20+S',
    dr: '2',
    stats: {
      str: {
        score: '6',
        mod: '+3',
      },
      int: {
        score: '1',
        mod: '+1',
      },
      con: {
        score: '4',
        mod: '+2',
      },
      dex: {
        score: '3',
        mod: '+2',
      },
      cha: {
        score: '6',
        mod: '+3',
      },
    },
    attacks: [
      {
        name: 'Spear',
        toHit: '13+F',
        damage: '2d6+3 Piercing',
        range: '30ft range',
        effect: '',
      },
      {
        name: 'Sword',
        toHit: '13+F',
        damage: '2d8+3 Slashing',
        range: '5ft range',
        effect: '',
      },
    ],
    notes:
      'Adorable: first encounter → each crawler gains Fascinated (all rolls at Disadvantage in combat round 1).\nStrict Adherence: obey orders, patrols and schedules literally with zero initiative; crawlers can game their routines.\n\nFull text: GM Campaign Toolkit p. 87.',
    source: 'GM Campaign Toolkit p. 87',
    chapter: 'Floor 2 · GM Toolkit',
    floor: 2,
    description:
      "Puppy knights! With swords! The whole galaxy just said 'awww,' and so will you, while spending your first round staring and missing everything. They follow orders to the letter and never improvise, so learn the patrol and exploit it. Pro tip: no petting. That good boy will shove a spear up your ass.",
    prevDescriptions: [
      'Puppy knights! With swords! Everyone at home just went awww, and so will you, right before you whiff your whole first round staring at them. Pro tip: they follow orders to the letter, so learn the patrol route and use it. Also, no petting.',
    ],
    prevNotes: [
      'Special: Adorable; Strict Adherence. Full text: GM Campaign Toolkit p. 87.',
      'Adorable: first encounter → each crawler gains Fascinated (all rolls at Disadvantage in combat round 1).\nStrict Adherence: obey orders, patrols and schedules literally with zero initiative; crawlers can game their routines.\n\nFull text: GM Campaign Toolkit p. 87.',
    ],
    descriptionEs:
      "¡Caballeros cachorro! ¡Con espadas! La galaxia entera acaba de decir 'oooh', y tú también lo dirás, mientras te pasas la primera ronda embobado y fallándolo todo. Siguen las órdenes al pie de la letra y nunca improvisan, así que apréndete la patrulla y aprovéchala. Pro-Tip: nada de acariciarlos. Ese perrito tan bueno te meterá una lanza por el culo.",
    prevDescriptionsEs: [
      "¡Caballeros cachorro! ¡Con espadas! La galaxia entera acaba de decir 'oooh', y tú también lo dirás, mientras te pasas la primera ronda embobado y fallándolo todo. Siguen las órdenes al pie de la letra y nunca improvisan, así que apréndete la patrulla y aprovéchala. Consejo pro: nada de acariciarlos. Ese perrito tan bueno te meterá una lanza por el culo.",
    ],
  },
  {
    name: 'Grimes',
    kind: 'mob',
    size: 'Petite (3)',
    tags: 'Ooze',
    slots: '5',
    slotValue: '4',
    level: '5',
    surprise: '11+F',
    evade: '11+F',
    move: '15+S',
    dr: '2',
    stats: {
      str: {
        score: '6',
        mod: '+3',
      },
      int: {
        score: '1',
        mod: '+1',
      },
      con: {
        score: '10',
        mod: '+4',
      },
      dex: {
        score: '2',
        mod: '+1',
      },
      cha: {
        score: '1',
        mod: '+1',
      },
    },
    attacks: [
      {
        name: 'Gloop',
        toHit: '11+F',
        damage: '2d4+1 Acid',
        range: '30ft range',
        effect: 'Major Fail+: Dissolving',
      },
      {
        name: 'Tendril',
        toHit: '13+F',
        damage: '2d4+3 Bludgeoning',
        range: '5ft range',
        effect: 'Major Fail+: Held',
      },
    ],
    notes:
      'Split: the first Grime killed in a combat splits into two. Later kills do not split.\nDissolving (Gloop): take 1d6+F Acid at the end of each round until combat ends.\n\nFull text: GM Campaign Toolkit p. 87.',
    source: 'GM Campaign Toolkit p. 87',
    chapter: 'Floor 2 · GM Toolkit',
    floor: 2,
    description:
      "Grimes: oozes that gloop acid at you and grab with slimy tendrils. Kill one and it splits in two, like a hydra made of snot. Does every one split? I'll let you find out the hard way. Your confused panic is incredible content.",
    prevDescriptions: [
      "Grimes: oozes that go gloop and grab. Kill one and it splits in two, just like you feared. Does every one split? Hmm. Guess you'll have to find out. The suspense is part of the entertainment.",
    ],
    prevNotes: [
      'Full text: GM Campaign Toolkit p. 87.',
      'Split: the first Grime killed in a combat splits into two. Later kills do not split.\nDissolving (Gloop): take 1d6+F Acid at the end of each round until combat ends.\n\nFull text: GM Campaign Toolkit p. 87.',
    ],
    descriptionEs:
      'Grimes: cienos que te escupen pegotes de ácido y te agarran con tentáculos viscosos. Mata a uno y se divide en dos, como una hidra hecha de mocos. ¿Se dividen todos? Dejaré que lo descubras por las malas. Tu pánico confuso es un contenido increíble.',
  },
  {
    name: 'Trollogs',
    kind: 'mob',
    size: 'Large (5)',
    tags: 'Humanoid',
    slots: '5',
    slotValue: '2',
    level: '5',
    surprise: '12+F',
    evade: '13+F',
    move: '20+S',
    dr: '2',
    stats: {
      str: {
        score: '6',
        mod: '+3',
      },
      int: {
        score: '3',
        mod: '+2',
      },
      con: {
        score: '4',
        mod: '+2',
      },
      dex: {
        score: '6',
        mod: '+3',
      },
      cha: {
        score: '1',
        mod: '+1',
      },
    },
    attacks: [
      {
        name: 'Bite',
        toHit: '13+F',
        damage: '2d6+3 Piercing',
        range: '5ft range',
        effect: '',
      },
      {
        name: 'Javelin',
        toHit: '12+F',
        damage: '2d8+3 Piercing',
        range: '30ft range;',
        effect: 'once per combat',
      },
    ],
    notes:
      'Mirror Change: if exposed to a mirror, the mirror cracks and the Trollog is forced back into its true form.\nShapeshifting: can disguise itself as a Sprite to get close before revealing its natural, terrifying form.\nJavelin: once per combat.\n\nFull text: GM Campaign Toolkit p. 88.',
    source: 'GM Campaign Toolkit p. 88',
    chapter: 'Floor 2 · GM Toolkit',
    floor: 2,
    description:
      "Is that an adorable Sprite? Nope! It's a Trollog wearing a Sprite costume, and it's about to take a big bite out of your face. It throws a single javelin per fight, so make it count, buddy. Pro tip: show it a mirror. It cracks the glass, its disguise falls away, and your vanity finally saves your life.",
    prevDescriptions: [
      "Is that a friendly Sprite? Nope, it's a Trollog in a Sprite costume, and it's big, bitey, and thrilled you fell for it. Pro tip: a mirror ruins its whole bit. Pack a compact, crawlers. Vanity saves lives.",
    ],
    prevNotes: [
      'Special: Mirror Change; Shapeshifting. Full text: GM Campaign Toolkit p. 88.',
      'Mirror Change: if exposed to a mirror, the mirror cracks and the Trollog is forced back into its true form.\nShapeshifting: can disguise itself as a Sprite to get close before revealing its natural, terrifying form.\nJavelin: once per combat.\n\nFull text: GM Campaign Toolkit p. 88.',
    ],
    descriptionEs:
      '¿Es eso un Sprite adorable? ¡Pues no! Es un Trollog disfrazado de Sprite, y está a punto de arrancarte un buen bocado de la cara. Lanza una única jabalina por combate, así que haz que cuente, colega. Pro-Tip: ponle un espejo delante. Raja el cristal, se le cae el disfraz, y por fin tu vanidad te salva la vida.',
    prevDescriptionsEs: [
      '¿Es eso un Sprite adorable? ¡Pues no! Es un Trollog disfrazado de Sprite, y está a punto de arrancarte un buen bocado de la cara. Lanza una única jabalina por combate, así que haz que cuente, colega. Consejo pro: ponle un espejo delante. Raja el cristal, se le cae el disfraz, y por fin tu vanidad te salva la vida.',
    ],
  },
  {
    name: 'Dread Wizard Grimblegore',
    kind: 'boss',
    size: 'Large (5)',
    tags: 'Neighborhood Boss, Humanoid',
    slots: '12',
    slotValue: '5',
    level: '10',
    surprise: '14+F',
    evade: '14+F',
    move: '20+S',
    dr: '2',
    stats: {
      str: {
        score: '10',
        mod: '+4',
      },
      int: {
        score: '10',
        mod: '+4',
      },
      con: {
        score: '20',
        mod: '+5',
      },
      dex: {
        score: '10',
        mod: '+4',
      },
      cha: {
        score: '5',
        mod: '+2',
      },
    },
    attacks: [
      {
        name: 'Fireball Spell',
        toHit: '14+F',
        damage: '2d12+4 Fire',
        range: '80ft range, 20ft',
        effect: 'Special effect',
      },
      {
        name: 'Gloat Spell',
        toHit: '14+F',
        damage: '2d6+4 Sonic',
        range: '50ft range, 10ft',
        effect: 'Major Fail+: Muted',
      },
      {
        name: 'Jump Smash',
        toHit: '14+F',
        damage: '3d6+4 Bludgeoning',
        range: '30ft range',
        effect: 'Major Fail+: Take Down',
      },
    ],
    notes:
      'Fixed Rotation: attack cycle is Fireball ×2 → Jump Smash ×2 → Gloat ×2, repeat.\nFireball Spell: has Disadvantage → Evade Difficulty −5, and crawlers Evade for free. Area = 20ft Blast +20ft Splash.\n\nFull text: GM Campaign Toolkit p. 93.',
    source: 'GM Campaign Toolkit p. 93',
    chapter: 'Floor 2 · GM Toolkit',
    floor: 2,
    description:
      "The Dread Wizard Grimblegore: ten levels of pompous arcane windbag. Two fireballs, two belly-flop smashes, two rounds of gloating, repeat, like a vending machine of pain. The fireballs are massive, but he aims like he's drunk. Pro tip: memorize his routine and you'll know exactly when to duck, dodge, or kick his wrinkly ass.",
    prevDescriptions: [
      "The Dread Wizard Grimblegore has exactly one routine and he runs it like a vending machine. Two fireballs, two belly flops, two rounds of trash talk, repeat. The fireballs are huge but his aim is terrible. Pro tip: learn the pattern and you'll know exactly when to duck.",
    ],
    prevNotes: [
      'Full text: GM Campaign Toolkit p. 93.',
      'Fixed Rotation: attack cycle is Fireball ×2 → Jump Smash ×2 → Gloat ×2, repeat.\nFireball Spell: has Disadvantage → Evade Difficulty −5, and crawlers Evade for free. Area = 20ft Blast +20ft Splash.\n\nFull text: GM Campaign Toolkit p. 93.',
    ],
    descriptionEs:
      'El Dread Wizard Grimblegore: diez niveles de charlatán arcano pomposo. Dos bolas de fuego, dos planchazos de barriga, dos rondas regodeándose, y vuelta a empezar, como una máquina expendedora de dolor. Las bolas de fuego son enormes, pero apunta como si fuera borracho. Pro-Tip: memoriza su rutina y sabrás exactamente cuándo agacharte, esquivar o patearle ese culo arrugado.',
    prevDescriptionsEs: [
      'El Dread Wizard Grimblegore: diez niveles de charlatán arcano pomposo. Dos bolas de fuego, dos planchazos de barriga, dos rondas regodeándose, y vuelta a empezar, como una máquina expendedora de dolor. Las bolas de fuego son enormes, pero apunta como si fuera borracho. Consejo pro: memoriza su rutina y sabrás exactamente cuándo agacharte, esquivar o patearle ese culo arrugado.',
    ],
  },
  {
    name: 'Cocaine Kobold',
    kind: 'mob',
    size: 'Petite (3)',
    tags: 'Lizard',
    slots: '6',
    slotValue: '3',
    level: '6',
    surprise: '13+F',
    evade: '13+F',
    move: '20+S',
    dr: '2',
    stats: {
      str: {
        score: '3',
        mod: '+2',
      },
      int: {
        score: '6',
        mod: '+3',
      },
      con: {
        score: '6',
        mod: '+3',
      },
      dex: {
        score: '6',
        mod: '+3',
      },
      cha: {
        score: '2',
        mod: '+1',
      },
    },
    attacks: [
      {
        name: 'Rock',
        toHit: '13+F',
        damage: '2d4+3 Bludgeoning',
        range: '30ft range',
        effect: 'Major Fail+: Enraged',
      },
      {
        name: 'Spear',
        toHit: '12+F',
        damage: '2d6+2 Piercing',
        range: '5ft range',
        effect: 'Major Fail+: Enraged',
      },
    ],
    notes:
      'Mounted: often rides a Danger Dingo; +1 spear damage while mounted.\nEnraged (Rock, Spear): the Enraged Debuff comes from the powder dusting on its attacks.\n\nFull text: GM Campaign Toolkit p. 96.',
    source: 'GM Campaign Toolkit p. 96',
    chapter: 'Floor 2 · GM Toolkit',
    floor: 2,
    description:
      "Cocaine Kobolds: little lizards so jacked on powder they've forgotten how to blink. Their rocks and spears come dusted with the good stuff, so every hit sends you into a blind rage. Some ride Danger Dingos, because obviously. Pro tip: knock them off the dog first, and don't sniff your wounds.",
    prevDescriptions: [
      "Cocaine Kobolds. I'm not going to explain the name. They're small, they're wired, and every hit leaves a dusting that makes you see red. Some of them ride Danger Dingos, because of course they do. Pro tip: knock them off the dog first.",
    ],
    prevNotes: [
      'Special: Mounted. Full text: GM Campaign Toolkit p. 96.',
      'Mounted: often rides a Danger Dingo; +1 spear damage while mounted.\nEnraged (Rock, Spear): the Enraged Debuff comes from the powder dusting on its attacks.\n\nFull text: GM Campaign Toolkit p. 96.',
    ],
    descriptionEs:
      'Cocaine Kobolds: lagartijas tan puestas de polvo que se les ha olvidado parpadear. Sus piedras y lanzas vienen espolvoreadas de la buena, así que cada golpe te mete en una furia ciega. Algunos montan Danger Dingos, porque evidentemente. Pro-Tip: tíralos del perro primero, y no esnifes tus heridas.',
    prevDescriptionsEs: [
      'Cocaine Kobolds: lagartijas tan puestas de polvo que se les ha olvidado parpadear. Sus piedras y lanzas vienen espolvoreadas de la buena, así que cada golpe te mete en una furia ciega. Algunos montan Danger Dingos, porque evidentemente. Consejo pro: tíralos del perro primero, y no esnifes tus heridas.',
    ],
  },
  {
    name: 'Danger Dingo',
    kind: 'mob',
    size: 'Medium (4)',
    tags: 'Beastly',
    slots: '5',
    slotValue: '3',
    level: '5',
    surprise: '12+F',
    evade: '11+F',
    move: '30+S',
    dr: '2',
    stats: {
      str: {
        score: '7',
        mod: '+3',
      },
      int: {
        score: '3',
        mod: '+2',
      },
      con: {
        score: '6',
        mod: '+3',
      },
      dex: {
        score: '2',
        mod: '+1',
      },
      cha: {
        score: '2',
        mod: '+1',
      },
    },
    attacks: [
      {
        name: 'Bite',
        toHit: '13+F',
        damage: '2d8+3 Piercing',
        range: '5ft range',
        effect: 'Major Fail+: Rabies',
      },
      {
        name: 'Ravage',
        toHit: '11+F',
        damage: '2d6+3 Slashing',
        range: '5ft range',
        effect: 'Major Fail+: Take Down',
      },
    ],
    notes:
      'Good Impressions: a wounded Dingo can turn non-hostile if the party never harms its pack and either heals it, feeds it, or plays metal music it enjoys.\nRavager: if it charges at least 20ft in a straight line toward its Ravage target first, Ravage deals +1d6 damage.\n\nFull text: GM Campaign Toolkit p. 97.',
    source: 'GM Campaign Toolkit p. 97',
    chapter: 'Floor 2 · GM Toolkit',
    floor: 2,
    description:
      "Rabid, feral, and built like a fucking torpedo with teeth. Give a Danger Dingo twenty feet of runway and it turns your ribcage into confetti. Pro tip: don't touch its pack, toss it a snack, or blast some metal, and the good boy might just walk away. Or ignore me and get foamy. Rabies is great content.",
    prevDescriptions: [
      "Meet the Danger Dingo, the only dog in the dungeon with a rabies subscription and a charge attack. Give it a runway and it will use it. Pro tip: keep your hands off the pack, toss it a snack, and queue up some heavy metal. Yes, really. I don't make the rules. Okay, I do.",
    ],
    prevNotes: [
      'Special: Good Impressions; Ravager. Full text: GM Campaign Toolkit p. 97.',
      'Good Impressions: a wounded Dingo can turn non-hostile if the party never harms its pack and either heals it, feeds it, or plays metal music it enjoys.\nRavager: if it charges at least 20ft in a straight line toward its Ravage target first, Ravage deals +1d6 damage.\n\nFull text: GM Campaign Toolkit p. 97.',
    ],
    descriptionEs:
      'Rabioso, salvaje y con la forma de un puto torpedo con dientes. Dale a un Danger Dingo veinte pies de pista y te convierte la caja torácica en confeti. Pro-Tip: no toques a su manada, échale algo de picar o pon metal a todo trapo, y puede que el perrito bueno se largue. O pasa de mí y ponte a echar espuma. La rabia es un contenido buenísimo.',
    prevDescriptionsEs: [
      'Rabioso, salvaje y con la forma de un puto torpedo con dientes. Dale a un Danger Dingo veinte pies de pista y te convierte la caja torácica en confeti. Consejo pro: no toques a su manada, échale algo de picar o pon metal a todo trapo, y puede que el perrito bueno se largue. O pasa de mí y ponte a echar espuma. La rabia es un contenido buenísimo.',
    ],
  },
  {
    name: 'Jacked Kangaroo',
    kind: 'mob',
    size: 'Medium (4)',
    tags: 'Animal',
    slots: '8',
    slotValue: '4',
    level: '8',
    surprise: '12+F',
    evade: '12+F',
    move: '25+S',
    dr: '2',
    stats: {
      str: {
        score: '10',
        mod: '+4',
      },
      int: {
        score: '3',
        mod: '+2',
      },
      con: {
        score: '10',
        mod: '+4',
      },
      dex: {
        score: '3',
        mod: '+2',
      },
      cha: {
        score: '3',
        mod: '+2',
      },
    },
    attacks: [
      {
        name: 'Kick',
        toHit: '14+F',
        damage: '2d8+4 Bludgeoning',
        range: '5ft range',
        effect: 'Special effect',
      },
      {
        name: 'Punch',
        toHit: '14+F',
        damage: '2d6+4 Bludgeoning',
        range: '5ft range',
        effect: '',
      },
      {
        name: 'Tail Whip',
        toHit: '14+F',
        damage: '1d10+4 Slashing',
        range: '5ft range',
        effect: 'Major Fail+: Take Down',
      },
    ],
    notes: 'Kick: on an Evade Major Fail or worse, the target is pushed 15ft.\n\nFull text: GM Campaign Toolkit p. 97.',
    source: 'GM Campaign Toolkit p. 97',
    chapter: 'Floor 2 · GM Toolkit',
    floor: 2,
    description:
      'This kangaroo skipped cardio and did nothing but leg day, arm day, and tail day for a decade. It will punt you fifteen feet into whatever sharp shit is behind you, then drop you with a tail whip. The viewers call it Ultimate Pouch Fighting. Pro tip: check behind you before you check your Health Bar.',
    prevDescriptions: [
      "Leg day? Every day. Arm day? Also every day. This marsupial has three melee attacks and zero chill, and it will punt you across the room like a disappointing field goal. Pro tip: don't stand with your back to anything pointy.",
    ],
    prevNotes: [
      'Full text: GM Campaign Toolkit p. 97.',
      'Kick: on an Evade Major Fail or worse, the target is pushed 15ft.\n\nFull text: GM Campaign Toolkit p. 97.',
    ],
    descriptionEs:
      'Este canguro se saltó el cardio y durante una década solo hizo día de pierna, día de brazo y día de cola. Te pegará una patada de quince pies contra cualquier mierda afilada que tengas detrás y luego te tumbará de un coletazo. Los espectadores lo llaman Ultimate Pouch Fighting. Pro-Tip: mira detrás de ti antes de mirar tu Barra de Salud.',
    prevDescriptionsEs: [
      'Este canguro se saltó el cardio y durante una década solo hizo día de pierna, día de brazo y día de cola. Te pegará una patada de quince pies contra cualquier mierda afilada que tengas detrás y luego te tumbará de un coletazo. Los espectadores lo llaman Ultimate Pouch Fighting. Consejo pro: mira detrás de ti antes de mirar tu Barra de Salud.',
    ],
  },
  {
    name: 'Jazmanian Devil',
    kind: 'mob',
    size: 'Petite (3)',
    tags: 'Humanoid',
    slots: '7',
    slotValue: '3',
    level: '7',
    surprise: '11+F',
    evade: '13+F',
    move: '20+S',
    dr: '2',
    stats: {
      str: {
        score: '6',
        mod: '+3',
      },
      int: {
        score: '2',
        mod: '+1',
      },
      con: {
        score: '6',
        mod: '+3',
      },
      dex: {
        score: '6',
        mod: '+3',
      },
      cha: {
        score: '6',
        mod: '+3',
      },
    },
    attacks: [
      {
        name: 'Wrist Weight',
        toHit: '13+F',
        damage: '2d6+3 Bludgeoning',
        range: '5ft range',
        effect: '',
      },
      {
        name: 'Sweatband',
        toHit: '13+F',
        damage: '2d4+3 Bludgeoning',
        range: '5ft range',
        effect: 'Major Fail+: Muted',
      },
      {
        name: 'Kick',
        toHit: '13+F',
        damage: '2d8+3 Bludgeoning',
        range: '5ft range',
        effect: '',
      },
      {
        name: 'Lunge',
        toHit: '13+F',
        damage: '2d6+3 Bludgeoning',
        range: '10ft range',
        effect: '',
      },
    ],
    notes:
      'Hard Fighting: any crawler who kills a Jazmanian Devil gains the Fatigued Debuff.\n\nFull text: GM Campaign Toolkit p. 98.',
    source: 'GM Campaign Toolkit p. 98',
    chapter: 'Floor 2 · GM Toolkit',
    floor: 2,
    description:
      "Tiny, sweaty, and screaming about burpees, the Jazmanian Devil is a spin class that bites. It fights so hard that killing one leaves you gasping like a chain-smoker climbing stairs. Kill three and you'll need oxygen. Pro tip: count your kills, because every dead Devil makes you more Fatigued. The sponsors of this segment sell energy drinks. Coincidence!",
    prevDescriptions: [
      "Welcome to the aerobics class from hell! Wrist weights, sweatbands, and a spinning tornado of cardio enthusiasm. Beating one is such a workout you'll need a nap afterward. Every kill costs you stamina, so maybe don't farm these for fun. Or do. The viewers love a wheezing crawler.",
    ],
    prevNotes: [
      'Special: Hard Fighting. Full text: GM Campaign Toolkit p. 98.',
      'Hard Fighting: any crawler who kills a Jazmanian Devil gains the Fatigued Debuff.\n\nFull text: GM Campaign Toolkit p. 98.',
    ],
    descriptionEs:
      'Diminuto, sudoroso y gritando sobre burpees, el Jazmanian Devil es una clase de spinning que muerde. Pelea con tanta intensidad que matar a uno te deja jadeando como un fumador empedernido subiendo escaleras. Mata a tres y necesitarás oxígeno. Pro-Tip: lleva la cuenta de tus bajas, porque cada Devil muerto te deja más Fatigued. Los patrocinadores de este segmento venden bebidas energéticas. ¡Qué casualidad!',
    prevDescriptionsEs: [
      'Diminuto, sudoroso y gritando sobre burpees, el Jazmanian Devil es una clase de spinning que muerde. Pelea con tanta intensidad que matar a uno te deja jadeando como un fumador empedernido subiendo escaleras. Mata a tres y necesitarás oxígeno. Consejo pro: lleva la cuenta de tus bajas, porque cada Devil muerto te deja más Fatigued. Los patrocinadores de este segmento venden bebidas energéticas. ¡Qué casualidad!',
    ],
  },
  {
    name: 'Whambat',
    kind: 'mob',
    size: 'Petite (3)',
    tags: 'Animal',
    slots: '3',
    slotValue: '2',
    level: '3',
    surprise: '11+F',
    evade: '13+F',
    move: '20+S',
    dr: '2',
    stats: {
      str: {
        score: '1',
        mod: '+1',
      },
      int: {
        score: '1',
        mod: '+1',
      },
      con: {
        score: '3',
        mod: '+2',
      },
      dex: {
        score: '6',
        mod: '+3',
      },
      cha: {
        score: '3',
        mod: '+2',
      },
    },
    attacks: [
      {
        name: 'Bite',
        toHit: '11+F',
        damage: '1d8+1 Piercing',
        range: '5ft range',
        effect: '',
      },
      {
        name: 'Hell Dive',
        toHit: '13+F',
        damage: '1d8+3 Bludgeoning',
        range: '60ft range',
        effect: 'Major Fail+: Staggered',
      },
    ],
    notes:
      'Flight: moves through the air as easily as on the ground.\nHell Dive: if a Hell Dive hits, the Whambat dies from the impact.\n\nFull text: GM Campaign Toolkit p. 98.',
    source: 'GM Campaign Toolkit p. 98',
    chapter: 'Floor 2 · GM Toolkit',
    floor: 2,
    description:
      "Whambat: a furry little kamikaze with absolutely no exit strategy. It dives from 60 feet, smashes into your face, and explodes into bat jam. Hit or die, those are its two career options. Pro tip: if it connects, it's dead and you're picking fur out of your teeth. Congratulations, you technically won.",
    prevDescriptions: [
      "Nature built a bat. I built a bat that treats itself like a guided missile. The Whambat dives from 60ft away, smacks into your face, and dies happy. It's a kamikaze with fur. Pro tip: making it miss is the only way it survives, so, you know, don't.",
    ],
    prevNotes: [
      'Special: Flight; Hell Dive. Full text: GM Campaign Toolkit p. 98.',
      'Flight: moves through the air as easily as on the ground.\nHell Dive: if a Hell Dive hits, the Whambat dies from the impact.\n\nFull text: GM Campaign Toolkit p. 98.',
    ],
    descriptionEs:
      'Whambat: un kamikaze peludito sin ninguna estrategia de salida. Se lanza en picado desde 60 pies, se estampa contra tu cara y revienta en mermelada de murciélago. Acertar o morir: esas son sus dos salidas profesionales. Pro-Tip: si te da, está muerto y tú estás quitándote pelo de entre los dientes. Enhorabuena, técnicamente has ganado.',
    prevDescriptionsEs: [
      'Whambat: un kamikaze peludito sin ninguna estrategia de salida. Se lanza en picado desde 60 pies, se estampa contra tu cara y revienta en mermelada de murciélago. Acertar o morir: esas son sus dos salidas profesionales. Consejo pro: si te da, está muerto y tú estás quitándote pelo de entre los dientes. Enhorabuena, técnicamente has ganado.',
    ],
  },
  {
    name: 'Mick Moran, Hulking Crockodilian Chef',
    kind: 'boss',
    size: 'Large (5)',
    tags: 'Neighborhood Boss, Humanoid',
    slots: '12',
    slotValue: '5',
    level: '12',
    surprise: '14+F',
    evade: '13+F',
    move: '20+S',
    dr: '2',
    stats: {
      str: {
        score: '20',
        mod: '+5',
      },
      int: {
        score: '10',
        mod: '+4',
      },
      con: {
        score: '20',
        mod: '+5',
      },
      dex: {
        score: '6',
        mod: '+3',
      },
      cha: {
        score: '5',
        mod: '+2',
      },
    },
    attacks: [
      {
        name: 'That’s a Knife',
        toHit: '15+F',
        damage: '3d8+5 Slashing',
        range: '5ft range',
        effect: 'Major Fail+: Blood Trail',
      },
      {
        name: 'Thunderstrike',
        toHit: '14+F',
        damage: '2d6+4 Electric',
        range: '40ft range',
        effect: 'Major Fail+: Shocked',
      },
    ],
    notes:
      "For Those About To Rock: until Mick personally attacks a crawler, the party can take only one Action each. The limit ends as soon as he attacks anyone.\nWater Scarcity: water-based attacks deal extra damage to him. Partially wet, he can't use Thunderstrike. Fully submerged, he is nearly helpless with terror and dies if kept under, since he can't swim.\n\nFull text: GM Campaign Toolkit p. 103.",
    source: 'GM Campaign Toolkit p. 103',
    chapter: 'Floor 2 · GM Toolkit',
    floor: 2,
    description:
      "Give it up for Mick Moran, the crocodile chef who fillets crawlers and then does a guitar solo with lightning! Until the diva personally swings at someone, your whole party gets one Action each, because the headliner doesn't share the stage. Pro tip: this big scaly asshole can't swim. Get him wet and watch the rock star panic.",
    prevDescriptions: [
      "Ladies and gentlecrawlers, put your claws together for Mick Moran, a reptile chef with a very big knife and a lightning-flavored stage act! He likes to make an entrance, so don't expect to do much until he does. Pro tip: this croc has never taken a swimming lesson. Bring a bucket. Bring a pool.",
    ],
    prevNotes: [
      'Special: For Those About To Rock; Water Scarcity. Full text: GM Campaign Toolkit p. 103.',
      "For Those About To Rock: until Mick personally attacks a crawler, the party can take only one Action each. The limit ends as soon as he attacks anyone.\nWater Scarcity: water-based attacks deal extra damage to him. Partially wet, he can't use Thunderstrike. Fully submerged, he is nearly helpless with terror and dies if kept under, since he can't swim.\n\nFull text: GM Campaign Toolkit p. 103.",
    ],
    descriptionEs:
      '¡Un aplauso para Mick Moran, el chef cocodrilo que filetea crawlers y luego se marca un solo de guitarra con rayos! Hasta que la diva ataque personalmente a alguien, todo tu grupo tiene una sola Acción cada uno, porque la estrella no comparte escenario. Pro-Tip: este cabronazo escamoso no sabe nadar. Mójalo y mira cómo le entra el pánico a la estrella del rock.',
    prevDescriptionsEs: [
      '¡Un aplauso para Mick Moran, el chef cocodrilo que filetea crawlers y luego se marca un solo de guitarra con rayos! Hasta que la diva ataque personalmente a alguien, todo tu grupo tiene una sola Acción cada uno, porque la estrella no comparte escenario. Consejo pro: este cabronazo escamoso no sabe nadar. Mójalo y mira cómo le entra el pánico a la estrella del rock.',
    ],
  },
  {
    name: 'Brindle Grub',
    kind: 'mob',
    size: 'Small (2)',
    tags: 'Beastly',
    slots: '2',
    slotValue: '3',
    level: '2',
    surprise: '11+F',
    evade: '11+F',
    move: '5+S',
    dr: '2',
    stats: {
      str: {
        score: '1',
        mod: '+1',
      },
      int: {
        score: '1',
        mod: '+1',
      },
      con: {
        score: '7',
        mod: '+3',
      },
      dex: {
        score: '1',
        mod: '+1',
      },
      cha: {
        score: '1',
        mod: '+1',
      },
    },
    attacks: [
      {
        name: 'Chew',
        toHit: '11+F',
        damage: '1d4+1 Bludgeoning',
        range: '5ft range',
        effect: '',
      },
    ],
    notes:
      'Janitor Mob: eats corpses first and only goes after crawlers when no other food is close. Each death in the area spawns 1-15 new Grubs (cap 5,000 active per quarter). A Grub that eats enough corpses becomes a Cow-Tailed Brindle Grub.\nOvercrowding: up to 5 Grubs can share a space. Moving through their space requires a Dex Stat Check, Difficulty 4 x Grubs in the space. On Fail, the mover squashes one, which spawns more Grubs to eat it.\n\nFull text: GM Campaign Toolkit p. 106.',
    source: 'GM Campaign Toolkit p. 106',
    chapter: 'Floor 2 · GM Toolkit',
    floor: 2,
    description:
      "My beloved cleaning crew! Brindle Grubs eat corpses first, crawlers second, and every death nearby spawns more of the little shits. Wade through a pile and you might squash one, which just rings the dinner bell for its cousins. Pro tip: walk around the grub carpet. It's the only diet that ends with you being the meal.",
    prevDescriptions: [
      "My cleaning crew! Adorable, squishy, and absolutely ravenous for whatever you leave lying around, including you if the buffet runs dry. Step on one and I'll send reinforcements to eat the mess. It's called recycling. Pro tip: walk around the carpet of grubs, not through it.",
    ],
    prevNotes: [
      'Special: Janitor Mob; Overcrowding. Full text: GM Campaign Toolkit p. 106.',
      'Janitor Mob: eats corpses first and only goes after crawlers when no other food is close. Each death in the area spawns 1-15 new Grubs (cap 5,000 active per quarter). A Grub that eats enough corpses becomes a Cow-Tailed Brindle Grub.\nOvercrowding: up to 5 Grubs can share a space. Moving through their space requires a Dex Stat Check, Difficulty 4 x Grubs in the space. On Fail, the mover squashes one, which spawns more Grubs to eat it.\n\nFull text: GM Campaign Toolkit p. 106.',
    ],
    descriptionEs:
      '¡Mi querido equipo de limpieza! Las Brindle Grubs se comen primero los cadáveres, luego a los crawlers, y cada muerte cercana genera más de estas mierdecillas. Métete por un montón y puede que aplastes una, lo que solo sirve para tocar la campana de la cena para sus primas. Pro-Tip: rodea la alfombra de larvas. Es la única dieta que acaba contigo como plato principal.',
    prevDescriptionsEs: [
      '¡Mi querido equipo de limpieza! Las Brindle Grubs se comen primero los cadáveres, luego a los crawlers, y cada muerte cercana genera más de estas mierdecillas. Métete por un montón y puede que aplastes una, lo que solo sirve para tocar la campana de la cena para sus primas. Consejo pro: rodea la alfombra de larvas. Es la única dieta que acaba contigo como plato principal.',
    ],
  },
  {
    name: 'Cow-Tailed Brindle Grub',
    kind: 'mob',
    size: 'Petite (3)',
    tags: 'Beastly',
    slots: '3',
    slotValue: '3',
    level: '3',
    surprise: '11+F',
    evade: '11+F',
    move: '10+S',
    dr: '2',
    stats: {
      str: {
        score: '4',
        mod: '+2',
      },
      int: {
        score: '1',
        mod: '+1',
      },
      con: {
        score: '7',
        mod: '+3',
      },
      dex: {
        score: '1',
        mod: '+1',
      },
      cha: {
        score: '1',
        mod: '+1',
      },
    },
    attacks: [
      {
        name: 'Sting',
        toHit: '12+F',
        damage: '1d6+2 Piercing',
        range: '5ft range',
        effect: '',
      },
    ],
    notes:
      'Upgraded Janitor Mob: eats corpses as top priority. Once fed enough → 10-hour pupa → Brindled Vespa. Pupa: same stats, no attacks, +2 DR Buff (cocoon). Kill the pupa → no Vespa.\nGoo Burst: crawler kills it via melee Amazing Success+ → coated in white goo; Dexterity-based skills at Disadvantage until washed off in a saferoom.\n\nFull text: GM Campaign Toolkit p. 106.',
    source: 'GM Campaign Toolkit p. 106',
    chapter: 'Floor 2 · GM Toolkit',
    floor: 2,
    description:
      "Look who ate enough corpses to grow a stinger! Leave it alone long enough and it wraps up in a cocoon to become something much worse. Pro tip: stab the pupa while it naps. Second pro tip: crit it in melee and it bursts all over you like the world's worst pimple, and you'll stay sticky until you find a shower.",
    prevDescriptions: [
      "Puberty hits the janitorial staff! This grub got a stinger and a promotion, and if it keeps eating it'll cocoon up and come back as something with wings and attitude. Pro tip: smash the pupa while it's napping. Second pro tip: don't crit it in melee unless you enjoy being frosted.",
    ],
    prevNotes: [
      'Special: Upgraded Janitor Mob. Full text: GM Campaign Toolkit p. 106.',
      'Upgraded Janitor Mob: eats corpses as top priority. Once fed enough → 10-hour pupa → Brindled Vespa. Pupa: same stats, no attacks, +2 DR Buff (cocoon). Kill the pupa → no Vespa.\nGoo Burst: crawler kills it via melee Amazing Success+ → coated in white goo; Dexterity-based skills at Disadvantage until washed off in a saferoom.\n\nFull text: GM Campaign Toolkit p. 106.',
    ],
    descriptionEs:
      '¡Mira quién ha comido suficientes cadáveres como para que le salga un aguijón! Déjala tranquila el tiempo suficiente y se envuelve en un capullo para convertirse en algo mucho peor. Pro-Tip: apuñala la pupa mientras echa la siesta. Segundo Pro-Tip: métele un crítico cuerpo a cuerpo y te revienta encima como el peor grano del mundo, y seguirás pringoso hasta que encuentres una ducha.',
    prevDescriptionsEs: [
      '¡Mira quién ha comido suficientes cadáveres como para que le salga un aguijón! Déjala tranquila el tiempo suficiente y se envuelve en un capullo para convertirse en algo mucho peor. Consejo pro: apuñala la pupa mientras echa la siesta. Segundo consejo pro: métele un crítico cuerpo a cuerpo y te revienta encima como el peor grano del mundo, y seguirás pringoso hasta que encuentres una ducha.',
    ],
  },
  {
    name: 'Brindled Vespa',
    kind: 'mob',
    size: 'Medium (4)',
    tags: 'Mutated',
    slots: '8',
    slotValue: '4',
    level: '8',
    surprise: '11+F',
    evade: '14+F',
    move: '20+S',
    dr: '0',
    stats: {
      str: {
        score: '6',
        mod: '+3',
      },
      int: {
        score: '1',
        mod: '+1',
      },
      con: {
        score: '10',
        mod: '+4',
      },
      dex: {
        score: '11',
        mod: '+4',
      },
      cha: {
        score: '1',
        mod: '+1',
      },
    },
    attacks: [
      {
        name: 'Acid Goo',
        toHit: '11+F',
        damage: '2d6+1 Acid',
        range: '40ft range',
        effect: 'Major Fail+: Acid Goo',
      },
      {
        name: 'Sting',
        toHit: '13+F',
        damage: '2d8+3 Piercing',
        range: '5ft range',
        effect: '',
      },
    ],
    notes:
      'Flight: flies and hovers as easily as moving on the ground.\nFragile Wings: attacks can target its wings at -2. If it loses 1+ HB slots this way, it loses Flight and Acid Goo.\n\nFull text: GM Campaign Toolkit p. 107.',
    source: 'GM Campaign Toolkit p. 107',
    chapter: 'Floor 2 · GM Toolkit',
    floor: 2,
    description:
      "The janitorial staff's final form: a wasp the size of your uncle, spitting acid and stinging like a divorce lawyer. Those wings, though? Delicate as shit. Pro tip: aim for the wings at -2 and knock a slot off, and the whole flying acid show is cancelled. Watching it flop around on the floor is my favorite rerun.",
    prevDescriptions: [
      'The final form of my cleaning crew: a wasp the size of your roommate that spits acid and stings like a bad breakup. Those wings are gorgeous, and gorgeous things are fragile. Pro tip: aim for the wings and watch it become a very angry, very grounded bug.',
    ],
    prevNotes: [
      'Special: Flight; Fragile Wings. Full text: GM Campaign Toolkit p. 107.',
      'Flight: flies and hovers as easily as moving on the ground.\nFragile Wings: attacks can target its wings at -2. If it loses 1+ HB slots this way, it loses Flight and Acid Goo.\n\nFull text: GM Campaign Toolkit p. 107.',
    ],
    descriptionEs:
      'La forma final del personal de limpieza: una avispa del tamaño de tu tío, que escupe ácido y pica como un abogado de divorcios. ¿Y esas alas? Delicadas de cojones. Pro-Tip: apunta a las alas a -2, quítale una casilla y se cancela todo el espectáculo de ácido volador. Verla dar coletazos en el suelo es mi reposición favorita.',
    prevDescriptionsEs: [
      'La forma final del personal de limpieza: una avispa del tamaño de tu tío, que escupe ácido y pica como un abogado de divorcios. ¿Y esas alas? Delicadas de cojones. Consejo pro: apunta a las alas a -2, quítale una casilla y se cancela todo el espectáculo de ácido volador. Verla dar coletazos en el suelo es mi reposición favorita.',
    ],
  },
  {
    name: 'Unvaccinated Clurichaun Rev-Up Consultant',
    kind: 'mob',
    size: 'Petite (3)',
    tags: 'Humanoid',
    slots: '3',
    slotValue: '1',
    level: '3',
    surprise: '11+F',
    evade: '13+F',
    move: '25+S',
    dr: '2',
    stats: {
      str: {
        score: '3',
        mod: '+2',
      },
      int: {
        score: '2',
        mod: '+1',
      },
      con: {
        score: '1',
        mod: '+1',
      },
      dex: {
        score: '6',
        mod: '+3',
      },
      cha: {
        score: '2',
        mod: '+1',
      },
    },
    attacks: [
      {
        name: 'Slingshot',
        toHit: '13+F',
        damage: '3d2+2 Bludgeoning',
        range: '40ft range',
        effect: '',
      },
      {
        name: 'Claw',
        toHit: '12+F',
        damage: '1d6+2 Slashing',
        range: '5ft range',
        effect: '',
      },
      {
        name: 'Sneeze',
        toHit: '13+F',
        damage: '1d6+1 Poison',
        range: '15ft Cone',
        effect: 'Special effect',
      },
    ],
    notes:
      "Sneeze: target drops 1+ HB → GM assigns Diseased, Stiff Legs, or The Taint. Diseased = 1d6+F Poison each round's end, lasts through combat.\n\nFull text: GM Campaign Toolkit p. 107.",
    source: 'GM Campaign Toolkit p. 107',
    chapter: 'Floor 2 · GM Toolkit',
    floor: 2,
    description:
      "This tiny consultant will rev up your morale, shoot you with a slingshot, and then sneeze a gallon of snot into your open mouth. Sometimes you get a disease, sometimes stiff legs, sometimes something I won't describe before the watershed. Pro tip: stay out of the cone and keep your mouth shut. Advice for life, honestly.",
    prevDescriptions: [
      'Is your spirit revved up? This tiny motivational consultant is here to sell you synergy, shoot you with a slingshot, and sneeze directly into your open mouth. Pick your poison, literally. Pro tip: stay out of the cone and wash your hands. Hygiene is a stat, people.',
    ],
    prevNotes: [
      'Full text: GM Campaign Toolkit p. 107.',
      "Sneeze: target drops 1+ HB → GM assigns Diseased, Stiff Legs, or The Taint. Diseased = 1d6+F Poison each round's end, lasts through combat.\n\nFull text: GM Campaign Toolkit p. 107.",
    ],
    descriptionEs:
      'Este consultor diminuto te subirá la moral, te disparará con un tirachinas y luego te estornudará un litro de mocos en la boca abierta. A veces pillas una enfermedad, a veces las piernas agarrotadas, a veces algo que no pienso describir en horario infantil. Pro-Tip: no te metas en el cono y mantén la boca cerrada. Un consejo para la vida, la verdad.',
    prevDescriptionsEs: [
      'Este consultor diminuto te subirá la moral, te disparará con un tirachinas y luego te estornudará un litro de mocos en la boca abierta. A veces pillas una enfermedad, a veces las piernas agarrotadas, a veces algo que no pienso describir en horario infantil. Consejo pro: no te metas en el cono y mantén la boca cerrada. Un consejo para la vida, la verdad.',
    ],
  },
  {
    name: 'Laminak Rev-Up Consultant Manager',
    kind: 'mob',
    size: 'Small (2)',
    tags: 'Humanoid',
    slots: '6',
    slotValue: '2',
    level: '6',
    surprise: '13+F',
    evade: '13+F',
    move: '45+S',
    dr: '2',
    stats: {
      str: {
        score: '1',
        mod: '+1',
      },
      int: {
        score: '6',
        mod: '+3',
      },
      con: {
        score: '3',
        mod: '+2',
      },
      dex: {
        score: '7',
        mod: '+3',
      },
      cha: {
        score: '6',
        mod: '+3',
      },
    },
    attacks: [
      {
        name: 'Magic Missile Spell',
        toHit: '13+F',
        damage: '2d6+3 Force',
        range: '90ft range',
        effect: '',
      },
      {
        name: 'Scream',
        toHit: '13+F',
        damage: '1d6+3 Sonic',
        range: '15ft Burst radius',
        effect: 'Special effect',
      },
    ],
    notes:
      "Natural Immunity: immune to every Debuff that deals damage.\nFlight: winged fairy; flies and hovers as easily as moving on the ground.\nScream: crawlers can't Evade it; each makes a free Cha Stat Check to avoid it instead.\n\nFull text: GM Campaign Toolkit p. 108.",
    source: 'GM Campaign Toolkit p. 108',
    chapter: 'Floor 2 · GM Toolkit',
    floor: 2,
    description:
      "Middle management has wings, a magic missile, and a scream that could strip paint. She's immune to every bleed, burn, and poison you packed, because she never gets her own hands dirty. Pro tip: you can't dodge the shrieking, only out-charm it. So if your Charisma is shit, start updating your résumé.",
    prevDescriptions: [
      "Middle management has wings now. This fairy boss throws magic missiles, screams at the team, and is somehow immune to every bleed, burn, and poison you brought. Wellness culture, baby. Pro tip: you can't dodge the shrieking, so hope your Charisma is better than your performance review.",
    ],
    prevNotes: [
      'Special: Immunity; Flight. Full text: GM Campaign Toolkit p. 108.',
      "Natural Immunity: immune to every Debuff that deals damage.\nFlight: winged fairy; flies and hovers as easily as moving on the ground.\nScream: crawlers can't Evade it; each makes a free Cha Stat Check to avoid it instead.\n\nFull text: GM Campaign Toolkit p. 108.",
    ],
    descriptionEs:
      'Los mandos intermedios tienen alas, un misil mágico y un chillido capaz de decapar pintura. Es inmune a todos los sangrados, quemaduras y venenos que te hayas traído, porque ella nunca se mancha las manos. Pro-Tip: el chillido no se esquiva, solo se contrarresta a base de encanto. Así que si tu Carisma es una mierda, ve actualizando el currículum.',
    prevDescriptionsEs: [
      'Los mandos intermedios tienen alas, un misil mágico y un chillido capaz de decapar pintura. Es inmune a todos los sangrados, quemaduras y venenos que te hayas traído, porque ella nunca se mancha las manos. Consejo pro: el chillido no se esquiva, solo se contrarresta a base de encanto. Así que si tu Carisma es una mierda, ve actualizando el currículum.',
    ],
  },
  {
    name: 'Smombie',
    kind: 'mob',
    size: 'Medium (4)',
    tags: 'Undead',
    slots: '4',
    slotValue: '3',
    level: '4',
    surprise: '11+F',
    evade: '12+F',
    move: '20+S',
    dr: '2',
    stats: {
      str: {
        score: '1',
        mod: '+1',
      },
      int: {
        score: '1',
        mod: '+1',
      },
      con: {
        score: '6',
        mod: '+3',
      },
      dex: {
        score: '3',
        mod: '+2',
      },
      cha: {
        score: '6',
        mod: '+3',
      },
    },
    attacks: [
      {
        name: 'Tantrum',
        toHit: '13+F',
        damage: '1d6+3 Sonic',
        range: '5ft range',
        effect: 'Special effect',
      },
    ],
    notes: 'Full text: GM Campaign Toolkit p. 108.',
    source: 'GM Campaign Toolkit p. 108',
    chapter: 'Floor 2 · GM Toolkit',
    floor: 2,
    description:
      "Oh look, a Smombie, shuffling along with its dead face glued to a screen. Interrupt its doomscroll and it throws a tantrum loud enough to burst eardrums. Honestly, same. Pro tip: it only has the one attack, and it's just screaming. You've survived worse from your group chat.",
    prevDescriptions: [
      "Look up from your screen, crawler. Oh wait, the Smombie never will. It shuffles around eyes-down, and if you interrupt its scrolling it throws a screaming tantrum loud enough to hurt. Relatable content. Pro tip: it's slow and distracted, so hit it before it notices you're not a notification.",
    ],
    prevNotes: ['Full text: GM Campaign Toolkit p. 108.'],
    descriptionEs:
      'Anda, mira, un Smombie, arrastrando los pies con su cara muerta pegada a una pantalla. Interrumpe su doomscroll y le da una rabieta tan escandalosa que te revienta los tímpanos. Sinceramente, te entiendo. Pro-Tip: solo tiene un ataque, y es gritar. Has sobrevivido a cosas peores en tu grupo de WhatsApp.',
    prevDescriptionsEs: [
      'Anda, mira, un Smombie, arrastrando los pies con su cara muerta pegada a una pantalla. Interrumpe su doomscroll y le da una rabieta tan escandalosa que te revienta los tímpanos. Sinceramente, te entiendo. Consejo pro: solo tiene un ataque, y es gritar. Has sobrevivido a cosas peores en tu grupo de WhatsApp.',
    ],
  },
  {
    name: 'Pickmees',
    kind: 'mob',
    size: 'Large (5)',
    tags: 'Aberration',
    slots: '7',
    slotValue: '3',
    level: '7',
    surprise: '12+F',
    evade: '12+F',
    move: '20+S',
    dr: '2',
    stats: {
      str: {
        score: '8',
        mod: '+3',
      },
      int: {
        score: '4',
        mod: '+2',
      },
      con: {
        score: '7',
        mod: '+3',
      },
      dex: {
        score: '5',
        mod: '+2',
      },
      cha: {
        score: '2',
        mod: '+1',
      },
    },
    attacks: [
      {
        name: 'Rev Jug',
        toHit: '12+F',
        damage: '2d4+2 Fire',
        range: '20ft range, 5ft Burst',
        effect: 'Major Fail+: Burned',
      },
      {
        name: 'Tentacles',
        toHit: '13+F',
        damage: '2d6+3 Bludgeoning',
        range: '10ft range',
        effect: 'Major Fail+: Held',
      },
    ],
    notes: 'Rev Jug: explodes in a 5ft Burst with an extra 5ft Splash.\n\nFull text: GM Campaign Toolkit p. 109.',
    source: 'GM Campaign Toolkit p. 109',
    chapter: 'Floor 2 · GM Toolkit',
    floor: 2,
    description:
      'Pick me! Pick me! These desperate tentacled attention junkies lob flaming jugs into your party and then slap whoever is still on fire. They want your eyes on them so badly, and frankly, I relate. Pro tip: spread the fuck out. One well-thrown jug with its splash can roast a clumped-up party like marshmallows.',
    prevDescriptions: [
      "Pickmees! Pick me! Pick me! These tentacled weirdos lob firebomb jugs and then grab whoever's still burning. They desperately want your attention, and honestly, same. Pro tip: spread out so one jug doesn't cook the whole party, and keep more than 10ft away from those arms.",
    ],
    prevNotes: [
      'Full text: GM Campaign Toolkit p. 109.',
      'Rev Jug: explodes in a 5ft Burst with an extra 5ft Splash.\n\nFull text: GM Campaign Toolkit p. 109.',
    ],
    descriptionEs:
      '¡Elígeme a mí! ¡A mí! Estos desesperados yonquis de la atención con tentáculos lanzan jarras en llamas contra tu grupo y luego le dan un bofetón a quien siga ardiendo. Se mueren por que los mires, y la verdad, los entiendo. Pro-Tip: separaos, joder. Una jarra bien lanzada con su salpicadura puede asar a un grupo apelotonado como si fueran nubes de azúcar.',
    prevDescriptionsEs: [
      '¡Elígeme a mí! ¡A mí! Estos desesperados yonquis de la atención con tentáculos lanzan jarras en llamas contra tu grupo y luego le dan un bofetón a quien siga ardiendo. Se mueren por que los mires, y la verdad, los entiendo. Consejo pro: separaos, joder. Una jarra bien lanzada con su salpicadura puede asar a un grupo apelotonado como si fueran nubes de azúcar.',
    ],
  },
  {
    name: 'Krakaren Clone (p. 115)',
    kind: 'boss',
    size: 'Gargantuan (8)',
    tags: 'Neighborhood Boss, Aberrant',
    slots: '12',
    slotValue: '4',
    level: '10',
    surprise: '11+F',
    evade: '12+F',
    move: '20+S',
    dr: '3',
    stats: {
      str: {
        score: '20',
        mod: '+5',
      },
      int: {
        score: '1',
        mod: '+1',
      },
      con: {
        score: '10',
        mod: '+4',
      },
      dex: {
        score: '5',
        mod: '+2',
      },
      cha: {
        score: '15',
        mod: '+4',
      },
    },
    attacks: [
      {
        name: 'Tentacles',
        toHit: '14+F',
        damage: '2d4+5 Bludgeoning',
        range: '15ft Cone',
        effect: 'On hit: Held',
      },
      {
        name: 'Beak Bite',
        toHit: '15+F',
        damage: '2d8+5 Piercing',
        range: '5ft range',
        effect: '',
      },
      {
        name: 'Spit Spray',
        toHit: '12+F',
        damage: '3d6+2 Poison',
        range: '30ft range',
        effect: 'Major Fail+: Taint',
      },
      {
        name: 'Pyramid Pitch',
        toHit: '14+F',
        damage: 'No damage',
        range: '50ft range',
        effect: 'Special effect',
      },
    ],
    notes:
      "Tentacles: every crawler hit gains Held. Constrict: auto-hits a Held foe for 3d6+5 Bludgeoning.\nPyramid Pitch: target makes a free Cha Stat Check against it. On Fail, they must spend their next Action attacking an ally.\nBad Hair Day: it's vain about its hairdo. Any attack against it that scores an Amazing Success or better ends all Held Debuffs it has inflicted.\n\nFull text: GM Campaign Toolkit p. 115.",
    source: 'GM Campaign Toolkit p. 115',
    chapter: 'Floor 2 · GM Toolkit',
    floor: 2,
    description:
      "Have you heard about this incredible business opportunity? This gargantuan squid clone grabs you with tentacles, squeezes you like a stress ball, and then pitches you a scheme so good you'll stab your own teammates. Pro tip: it's obsessed with its hair. Land a big enough hit to ruin the 'do and it drops everyone in a tizzy.",
    prevDescriptions: [
      "Have I got an opportunity for you! This gargantuan squid clone grabs you with one set of tentacles and pitches you a business plan with the other. Sign up and you'll be attacking your own friends. Pro tip: it's very proud of its hair. A big enough hit ruins the look and it drops everyone.",
    ],
    prevNotes: [
      'Special: Bad Hair Day. Full text: GM Campaign Toolkit p. 115.',
      "Tentacles: every crawler hit gains Held. Constrict: auto-hits a Held foe for 3d6+5 Bludgeoning.\nPyramid Pitch: target makes a free Cha Stat Check against it. On Fail, they must spend their next Action attacking an ally.\nBad Hair Day: it's vain about its hairdo. Any attack against it that scores an Amazing Success or better ends all Held Debuffs it has inflicted.\n\nFull text: GM Campaign Toolkit p. 115.",
    ],
    descriptionEs:
      '¿Has oído hablar de esta increíble oportunidad de negocio? Este clon de calamar gigantesco te agarra con los tentáculos, te estruja como una pelota antiestrés y luego te vende un chiringuito tan bueno que acabarás apuñalando a tus propios compañeros. Pro-Tip: está obsesionado con su pelo. Métele un golpe lo bastante fuerte como para arruinarle el peinado y a todos se les va la olla.',
    prevDescriptionsEs: [
      '¿Has oído hablar de esta increíble oportunidad de negocio? Este clon de calamar gigantesco te agarra con los tentáculos, te estruja como una pelota antiestrés y luego te vende un chiringuito tan bueno que acabarás apuñalando a tus propios compañeros. Consejo pro: está obsesionado con su pelo. Métele un golpe lo bastante fuerte como para arruinarle el peinado y a todos se les va la olla.',
    ],
  },
  {
    name: 'Dream Eaters',
    kind: 'mob',
    size: 'Small (2)',
    tags: 'Shadow',
    slots: '5',
    slotValue: '2',
    level: '5',
    surprise: '14+F',
    evade: '12+F',
    move: '20+S',
    dr: '2',
    stats: {
      str: {
        score: '3',
        mod: '+2',
      },
      int: {
        score: '10',
        mod: '+4',
      },
      con: {
        score: '3',
        mod: '+2',
      },
      dex: {
        score: '3',
        mod: '+2',
      },
      cha: {
        score: '1',
        mod: '+1',
      },
    },
    attacks: [
      {
        name: 'Bite',
        toHit: '14+F',
        damage: '2d6+2 Psychic',
        range: '5ft range',
        effect: 'Major Fail+: Nightmares',
      },
    ],
    notes:
      'Bite: on an Evade Major Fail or worse, the crawler gains Nightmares: for the rest of the current Floor, they wake up Fatigued every morning.\n\nFull text: GM Campaign Toolkit p. 118.',
    source: 'GM Campaign Toolkit p. 118',
    chapter: 'Floor 2 · GM Toolkit',
    floor: 2,
    description:
      "Sweet dreams? Not anymore, dipshit. These shadow critters chomp on your psyche, and a bad dodge means nightmares for the rest of the Floor. Every morning you'll wake up Fatigued and damp, and we both know it's not just sweat. Pro tip: dodge like your beauty sleep depends on it. Because it does.",
    prevDescriptions: [
      'Sweet dreams are made of these! Actually no, they eat those. One nasty bite from these shadow critters and your beauty sleep is cancelled for the rest of the Floor. Pro tip: dodge well tonight, or enjoy starting every morning like a Monday.',
    ],
    prevNotes: [
      'Full text: GM Campaign Toolkit p. 118.',
      'Bite: on an Evade Major Fail or worse, the crawler gains Nightmares: for the rest of the current Floor, they wake up Fatigued every morning.\n\nFull text: GM Campaign Toolkit p. 118.',
    ],
    descriptionEs:
      '¿Dulces sueños? Ya no, gilipollas. Estos bichos de sombra te mordisquean la psique, y una mala esquiva significa pesadillas durante el resto del Piso. Cada mañana te despertarás Fatigued y húmedo, y los dos sabemos que no es solo sudor. Pro-Tip: esquiva como si tu sueño reparador dependiera de ello. Porque depende.',
    prevDescriptionsEs: [
      '¿Dulces sueños? Ya no, gilipollas. Estos bichos de sombra te mordisquean la psique, y una mala esquiva significa pesadillas durante el resto del Piso. Cada mañana te despertarás Fatigued y húmedo, y los dos sabemos que no es solo sudor. Consejo pro: esquiva como si tu sueño reparador dependiera de ello. Porque depende.',
    ],
  },
  {
    name: 'Lost Souls',
    kind: 'mob',
    size: 'Medium (4)',
    tags: 'Undead',
    slots: '3',
    slotValue: '2',
    level: '3',
    surprise: '12+F',
    evade: '12+F',
    move: '10+S',
    dr: '2',
    stats: {
      str: {
        score: '3',
        mod: '+2',
      },
      int: {
        score: '4',
        mod: '+2',
      },
      con: {
        score: '3',
        mod: '+2',
      },
      dex: {
        score: '3',
        mod: '+2',
      },
      cha: {
        score: '1',
        mod: '+1',
      },
    },
    attacks: [
      {
        name: 'Bump',
        toHit: '12+F',
        damage: '1d8+2 Bludgeoning',
        range: '5ft range',
        effect: '',
      },
      {
        name: 'Muttering',
        toHit: '12+F',
        damage: '1d4+2 Sonic',
        range: '15ft Burst radius',
        effect: 'Special effect',
      },
    ],
    notes:
      'Muttering: per crawler hit → party loses 1d2 hours off Time to Floor Collapse.\n\nFull text: GM Campaign Toolkit p. 119.',
    source: 'GM Campaign Toolkit p. 119',
    chapter: 'Floor 2 · GM Toolkit',
    floor: 2,
    description:
      "Lost Souls: they bump into you, mumble like drunk uncles, and waste your precious fucking time. Every crawler their muttering hits costs the party hours off the Floor collapse clock. Nothing is funnier than a party sprinting for the stairs as the ceiling comes down. Pro tip: kill them fast. The clock doesn't care about your feelings.",
    prevDescriptions: [
      "Lost Souls: they bump into you, mutter nonsense, and waste your time. Like group projects, but dead. The real danger isn't the damage, it's the clock. Every mumble they land shaves hours off your Floor. Pro tip: put them down fast or spend the rest of the Floor sprinting for the stairs.",
    ],
    prevNotes: [
      'Full text: GM Campaign Toolkit p. 119.',
      'Muttering: per crawler hit → party loses 1d2 hours off Time to Floor Collapse.\n\nFull text: GM Campaign Toolkit p. 119.',
    ],
    descriptionEs:
      'Lost Souls: se chocan contigo, farfullan como tíos borrachos en una boda y te hacen perder tu valiosísimo puto tiempo. Cada crawler al que alcanzan sus murmullos le quita al grupo horas del reloj de colapso del Piso. No hay nada más gracioso que un grupo corriendo hacia las escaleras mientras se le cae el techo encima. Pro-Tip: mátalos rápido. Al reloj le importan una mierda tus sentimientos.',
    prevDescriptionsEs: [
      'Lost Souls: se chocan contigo, farfullan como tíos borrachos en una boda y te hacen perder tu valiosísimo puto tiempo. Cada crawler al que alcanzan sus murmullos le quita al grupo horas del reloj de colapso del Piso. No hay nada más gracioso que un grupo corriendo hacia las escaleras mientras se le cae el techo encima. Consejo pro: mátalos rápido. Al reloj le importan una mierda tus sentimientos.',
    ],
  },
  {
    name: 'Mind Horror',
    kind: 'mob',
    size: 'Petite (3)',
    tags: 'Aberrant',
    slots: '4',
    slotValue: '2',
    level: '4',
    surprise: '13+F',
    evade: '11+F',
    move: '0+S',
    dr: '2',
    stats: {
      str: {
        score: '1',
        mod: '+1',
      },
      int: {
        score: '8',
        mod: '+3',
      },
      con: {
        score: '3',
        mod: '+2',
      },
      dex: {
        score: '1',
        mod: '+1',
      },
      cha: {
        score: '4',
        mod: '+2',
      },
    },
    attacks: [
      {
        name: 'Mindspike Spell',
        toHit: '13+F',
        damage: '1d12+3 Psychic',
        range: '30ft range',
        effect: '',
      },
      {
        name: 'Psionic Spell',
        toHit: '13+F',
        damage: 'No damage',
        range: '60ft Burst radius',
        effect: 'On hit: Splitting Headache',
      },
      {
        name: 'Splatter',
        toHit: '12+F',
        damage: '1d6+3 Acid',
        range: '5ft Burst radius',
        effect: 'On hit: Queasy',
      },
    ],
    notes:
      "Ego Screen: creature's Intelligence Stat exceeds the Mind Horror's → ignores its Debuffs.\nMandatory Flight: permanently hovering, air-only movement; falls on death. Any ground contact, living or dead → automatic Splatter.\nPsionic Spell: Splitting Headache is Stackable.\n\nFull text: GM Campaign Toolkit p. 119.",
    source: 'GM Campaign Toolkit p. 119',
    chapter: 'Floor 2 · GM Toolkit',
    floor: 2,
    description:
      "It's a floating brain with a migraine fetish, stacking headaches on you until your skull feels like a nightclub speaker. When it finally dies, it drops and splatters acid on everyone nearby, like a water balloon full of regret. Pro tip: the smart kids can ignore its Debuffs. Looking at this lineup? Yeah, you're fucked.",
    prevDescriptions: [
      "A floating brain that gives migraines and then explodes when it lands. It's your worst hangover, now with a fly ability. Headaches stack, so the longer it lives the worse you feel. Pro tip: the smart kids are immune to its tricks. So it's a bad day for most of you.",
    ],
    prevNotes: [
      'Special: Ego Screen; Mandatory Flight. Full text: GM Campaign Toolkit p. 119.',
      "Ego Screen: creature's Intelligence Stat exceeds the Mind Horror's → ignores its Debuffs.\nMandatory Flight: permanently hovering, air-only movement; falls on death. Any ground contact, living or dead → automatic Splatter.\nPsionic Spell: Splitting Headache is Stackable.\n\nFull text: GM Campaign Toolkit p. 119.",
    ],
    descriptionEs:
      'Es un cerebro flotante con fetiche por las migrañas, que te va acumulando dolores de cabeza hasta que tu cráneo parece un altavoz de discoteca. Cuando por fin muere, cae y salpica ácido a todos los que estén cerca, como un globo de agua lleno de arrepentimiento. Pro-Tip: los listos pueden ignorar sus Debuffs. ¿Viendo esta alineación? Sí, estáis jodidos.',
    prevDescriptionsEs: [
      'Es un cerebro flotante con fetiche por las migrañas, que te va acumulando dolores de cabeza hasta que tu cráneo parece un altavoz de discoteca. Cuando por fin muere, cae y salpica ácido a todos los que estén cerca, como un globo de agua lleno de arrepentimiento. Consejo pro: los listos pueden ignorar sus Debuffs. ¿Viendo esta alineación? Sí, estáis jodidos.',
    ],
  },
  {
    name: 'Troglodyte Basher (p. 120)',
    kind: 'mob',
    size: 'Medium (4)',
    tags: 'Humanoid',
    slots: '6',
    slotValue: '3',
    level: '6',
    surprise: '11+F',
    evade: '13+F',
    move: '20+S',
    dr: '2',
    stats: {
      str: {
        score: '7',
        mod: '+3',
      },
      int: {
        score: '1',
        mod: '+1',
      },
      con: {
        score: '7',
        mod: '+3',
      },
      dex: {
        score: '7',
        mod: '+3',
      },
      cha: {
        score: '1',
        mod: '+1',
      },
    },
    attacks: [
      {
        name: 'Bash',
        toHit: '13+F',
        damage: '2d8+3 Bludgeoning',
        range: '5ft range',
        effect: '',
      },
      {
        name: 'Venom Spit',
        toHit: '13+F',
        damage: '1d6+3 Poison',
        range: '20ft range',
        effect: 'Major Fail+: Poisoned',
      },
    ],
    notes:
      'Slimed!: a crawler adjacent to it who scores an Amazing Success or better on an attack gains the Queasy Debuff.\n\nFull text: GM Campaign Toolkit p. 120.',
    source: 'GM Campaign Toolkit p. 120',
    chapter: 'Floor 2 · GM Toolkit',
    floor: 2,
    description:
      'The Troglodyte Basher: a club, venomous spit, and skin slime that smells like a gas station bathroom. Land a truly great hit up close and you get a faceful of the stuff and a stomach that wants out. Pro tip: excellence has a price, and that price is puking on camera. The ratings on vomit are incredible.',
    prevDescriptions: [
      "The Troglodyte Basher: big club, venomous spit, and a skin slime that's disgusting even by dungeon standards. Hit it really well up close and you'll get a faceful and a stomach ache for your trouble. Pro tip: that's the price of greatness. Try not to hurl on camera.",
    ],
    prevNotes: [
      'Special: Slimed!. Full text: GM Campaign Toolkit p. 120.',
      'Slimed!: a crawler adjacent to it who scores an Amazing Success or better on an attack gains the Queasy Debuff.\n\nFull text: GM Campaign Toolkit p. 120.',
    ],
    descriptionEs:
      'El Troglodyte Basher: una porra, escupitajos venenosos y una baba en la piel que huele como el baño de una gasolinera. Mete un golpe realmente bueno de cerca y te llevas un buen chorro en la cara y un estómago que quiere salir por la boca. Pro-Tip: la excelencia tiene un precio, y ese precio es potar ante las cámaras. La audiencia de los vómitos es increíble.',
    prevDescriptionsEs: [
      'El Troglodyte Basher: una porra, escupitajos venenosos y una baba en la piel que huele como el baño de una gasolinera. Mete un golpe realmente bueno de cerca y te llevas un buen chorro en la cara y un estómago que quiere salir por la boca. Consejo pro: la excelencia tiene un precio, y ese precio es potar ante las cámaras. La audiencia de los vómitos es increíble.',
    ],
  },
  {
    name: 'Cardium Clam',
    kind: 'boss',
    size: 'Huge (6)',
    tags: 'Neighborhood Boss, Monstrous',
    slots: '12',
    slotValue: '3',
    level: '9',
    surprise: '15+F',
    evade: '12+F',
    move: '0+S',
    dr: '4',
    stats: {
      str: {
        score: '11',
        mod: '+4',
      },
      int: {
        score: '20',
        mod: '+5',
      },
      con: {
        score: '6',
        mod: '+3',
      },
      dex: {
        score: '5',
        mod: '+2',
      },
      cha: {
        score: '10',
        mod: '+4',
      },
    },
    attacks: [
      {
        name: 'Hypersonic Pearl',
        toHit: '15+F',
        damage: '2d10+5 Bludgeoning',
        range: '200ft range',
        effect: 'Special effect',
      },
      {
        name: 'Explosive Pearl',
        toHit: '15+F',
        damage: '2d8+5 Bludgeoning',
        range: '90ft range',
        effect: 'Special effect',
      },
      {
        name: 'Foot Probe',
        toHit: '13+F',
        damage: '1d10+4 Bludgeoning',
        range: '10ft range',
        effect: 'Special effect',
      },
      {
        name: 'Heartbeat Thump',
        toHit: '13+F',
        damage: '1d6+4 Bludgeoning',
        range: '30ft Burst',
        effect: 'Special effect',
      },
      {
        name: 'Pearl Grapeshot',
        toHit: '15+F',
        damage: '1d8+5 Bludgeoning',
        range: '90ft Cone',
        effect: 'Special effect',
      },
    ],
    notes:
      'Exposed Foot: in rounds where it Steps or uses Foot Probe, its foot sticks out and can be targeted at -3, with DR 0 instead of 4.\nProbing Foot: in a round it uses Foot Probe, it may also use Explosive Pearl and Pearl Grapeshot that round (still spending Actions as normal).\nHypersonic Pearl: on an Evade Major Fail or worse, the target is pushed 15ft.\nExplosive Pearl: 10ft Blast plus 5ft Splash.\n\nFull text: GM Campaign Toolkit p. 125.',
    source: 'GM Campaign Toolkit p. 125',
    chapter: 'Floor 2 · GM Toolkit',
    floor: 2,
    description:
      "A clam that fires pearls at hypersonic speed and has a heartbeat that rattles your fillings. Mother Nature made oysters. I made artillery with a mouth. Pro tip: when it Steps or probes, its soft squishy foot comes out with zero armor. Aim low and stab the gooey bit. Yes, that's what she said. No, I'm not sorry.",
    prevDescriptions: [
      "Say hello to the world's angriest shellfish, a mollusk artillery battery with a heartbeat you can feel in your fillings. It fires pearls at supersonic speed, and you can't even pawn them! Pro tip: the soft squishy foot only comes out when it moves or probes. That's your moment. Aim low.",
    ],
    prevNotes: [
      'Special: Exposed Foot; Probing Foot. Full text: GM Campaign Toolkit p. 125.',
      'Exposed Foot: in rounds where it Steps or uses Foot Probe, its foot sticks out and can be targeted at -3, with DR 0 instead of 4.\nProbing Foot: in a round it uses Foot Probe, it may also use Explosive Pearl and Pearl Grapeshot that round (still spending Actions as normal).\nHypersonic Pearl: on an Evade Major Fail or worse, the target is pushed 15ft.\nExplosive Pearl: 10ft Blast plus 5ft Splash.\n\nFull text: GM Campaign Toolkit p. 125.',
    ],
    descriptionEs:
      'Una almeja que dispara perlas a velocidad hipersónica y tiene un latido que te hace vibrar los empastes. La Madre Naturaleza hizo las ostras. Yo hice artillería con boca. Pro-Tip: cuando hace Step o sondea, saca su pie blandito y viscoso sin ninguna armadura. Apunta bajo y apuñala la parte blandurria. Sí, ya sé cómo suena. No, no lo siento.',
    prevDescriptionsEs: [
      'Una almeja que dispara perlas a velocidad hipersónica y tiene un latido que te hace vibrar los empastes. La Madre Naturaleza hizo las ostras. Yo hice artillería con boca. Consejo pro: cuando hace Step o sondea, saca su pie blandito y viscoso sin ninguna armadura. Apunta bajo y apuñala la parte blandurria. Sí, ya sé cómo suena. No, no lo siento.',
    ],
  },
  {
    name: 'Bugaboo Goblin-Napper',
    kind: 'mob',
    size: 'Medium (4)',
    tags: 'Humanoid',
    slots: '6',
    slotValue: '3',
    level: '6',
    surprise: '12+F',
    evade: '13+F',
    move: '30+S',
    dr: '2',
    stats: {
      str: {
        score: '6',
        mod: '+3',
      },
      int: {
        score: '3',
        mod: '+2',
      },
      con: {
        score: '7',
        mod: '+3',
      },
      dex: {
        score: '6',
        mod: '+3',
      },
      cha: {
        score: '1',
        mod: '+1',
      },
    },
    attacks: [
      {
        name: 'Cudgel',
        toHit: '13+F',
        damage: ': 2d6+3 Bludgeoning',
        range: '5ft range',
        effect: '',
      },
      {
        name: 'Net',
        toHit: '14+F',
        damage: ': 1d8+3 Bludgeoning',
        range: '20ft range, 10ft',
        effect: 'On hit: Held',
      },
    ],
    notes:
      "Cautious: always travel in pairs and won't advance to engage. If Surprised, or once one of them dies, they fall back to find reinforcements.\nNet: every crawler hit is Held until the end of the round.\n\nFull text: GM Campaign Toolkit p. 128.",
    source: 'GM Campaign Toolkit p. 128',
    chapter: 'Floor 2 · GM Toolkit',
    floor: 2,
    description:
      "Bugaboo Goblin-Nappers: kidnappers with a net, a cudgel, and the spine of a wet paper towel. They travel in pairs, never charge, and bolt the second one of them croaks. Pro tip: the runner isn't fleeing, he's fetching backup. Chase that cowardly little shit down, or enjoy the sequel with twice the cast.",
    prevDescriptions: [
      "Bugaboo Goblin-Nappers: grab-and-go specialists with a net, a cudgel, and the courage of a wet napkin. They come in pairs and bolt the moment things get dicey. Pro tip: if one runs, it's not giving up. It's going to get friends. Chase it or get ready for round two.",
    ],
    prevNotes: [
      'Special: Cautious. Full text: GM Campaign Toolkit p. 128.',
      "Cautious: always travel in pairs and won't advance to engage. If Surprised, or once one of them dies, they fall back to find reinforcements.\nNet: every crawler hit is Held until the end of the round.\n\nFull text: GM Campaign Toolkit p. 128.",
    ],
    descriptionEs:
      'Bugaboo Goblin-Nappers: secuestradores con una red, un garrote y la columna vertebral de un trozo de papel de cocina mojado. Van en parejas, nunca cargan y salen por patas en cuanto uno de los dos la palma. Pro-Tip: el que corre no está huyendo, va a buscar refuerzos. Persigue a ese cobarde de mierda, o disfruta de la secuela con el doble de reparto.',
    prevDescriptionsEs: [
      'Bugaboo Goblin-Nappers: secuestradores con una red, un garrote y la columna vertebral de un trozo de papel de cocina mojado. Van en parejas, nunca cargan y salen por patas en cuanto uno de los dos la palma. Consejo pro: el que corre no está huyendo, va a buscar refuerzos. Persigue a ese cobarde de mierda, o disfruta de la secuela con el doble de reparto.',
    ],
  },
  {
    name: 'Bugaboo Socket-Picker',
    kind: 'mob',
    size: 'Medium (3)',
    tags: 'Humanoid',
    slots: '5',
    slotValue: '3',
    level: '5',
    surprise: '11+F',
    evade: '13+F',
    move: '30+S',
    dr: '2',
    stats: {
      str: {
        score: '6',
        mod: '+3',
      },
      int: {
        score: '1',
        mod: '+1',
      },
      con: {
        score: '6',
        mod: '+3',
      },
      dex: {
        score: '6',
        mod: '+3',
      },
      cha: {
        score: '1',
        mod: '+1',
      },
    },
    attacks: [
      {
        name: 'Hook-Knife',
        toHit: '13+F',
        damage: '2d4+3 Slashing',
        range: '5ft range',
        effect: 'Major Fail+: Injury',
      },
      {
        name: 'Bone Scoop',
        toHit: '13+F',
        damage: '2d6+3 Bludgeoning',
        range: '5ft range',
        effect: 'Special effect',
      },
    ],
    notes: 'Full text: GM Campaign Toolkit p. 128.',
    source: 'GM Campaign Toolkit p. 128',
    chapter: 'Floor 2 · GM Toolkit',
    floor: 2,
    description:
      "The Socket-Picker is an artisan with a hook-knife and a deep, personal interest in your eyeballs. Nothing romantic, strictly a collector. He'll scoop one out and bag it before you can blink, which you'll only be doing with one eye from now on. Pro tip: nothing here but damage. Hit harder than he does. Easy!",
    prevDescriptions: [
      "The Socket-Picker is a hook-knife artist who is VERY interested in your eyes. Not in a romantic way. In a collector way. Land a bad dodge and you'll be wearing an eyeball on your cheek. Pro tip: blink twice if you need help. While you still can.",
    ],
    prevNotes: ['Full text: GM Campaign Toolkit p. 128.'],
    descriptionEs:
      'El Socket-Picker es un artesano con un cuchillo de gancho y un interés profundo y personal en tus globos oculares. Nada romántico, es estrictamente coleccionista. Te sacará uno y lo meterá en una bolsa antes de que puedas pestañear, cosa que a partir de ahora solo harás con un ojo. Pro-Tip: aquí no hay nada más que daño. Pega más fuerte que él. ¡Chupado!',
    prevDescriptionsEs: [
      'El Socket-Picker es un artesano con un cuchillo de gancho y un interés profundo y personal en tus globos oculares. Nada romántico, es estrictamente coleccionista. Te sacará uno y lo meterá en una bolsa antes de que puedas pestañear, cosa que a partir de ahora solo harás con un ojo. Consejo pro: aquí no hay nada más que daño. Pega más fuerte que él. ¡Chupado!',
    ],
  },
  {
    name: 'Screye Drone',
    kind: 'mob',
    size: 'Small (2)',
    tags: 'Organic Machinery',
    slots: '7',
    slotValue: '3',
    level: '7',
    surprise: '16+F',
    evade: '13+F',
    move: '10+S',
    dr: '2',
    stats: {
      str: {
        score: '6',
        mod: '+3',
      },
      int: {
        score: '6',
        mod: '+3',
      },
      con: {
        score: '6',
        mod: '+3',
      },
      dex: {
        score: '6',
        mod: '+3',
      },
      cha: {
        score: '2',
        mod: '+1',
      },
    },
    attacks: [
      {
        name: 'Weeping Eye Discharge',
        toHit: '13+F',
        damage: ': No damage',
        range: '25ft range',
        effect: 'On hit: Take Down, Fatigued',
      },
    ],
    notes:
      "Alarm: when threatened, it chimes loudly and calls nearby Bugaboos.\nThe Eyes Have It: covered in eyes, so it is very hard to Surprise.\nHover: flies as easily as moving on the ground.\nNoncombatant: doesn't fight. It slowly drifts away, leaking eyeballs and goo to slow pursuers.\nWeeping Eye Discharge: any hit crawler gains both Take Down and Fatigued.\n\nFull text: GM Campaign Toolkit p. 129.",
    source: 'GM Campaign Toolkit p. 129',
    chapter: 'Floor 2 · GM Toolkit',
    floor: 2,
    description:
      "Surveillance, now in gross! The Screye Drone is a floating sack of eyes that can't be snuck up on, chimes for Bugaboo backup, and leaks eyeball goo everywhere as it drifts away. Get hit by its weeping and you're knocked down and exhausted. Pro tip: kill it before it rings the bell. Try not to slip in the discharge.",
    prevDescriptions: [
      'Surveillance, but make it gross. The Screye Drone is a floating bag of eyeballs that sees everything, screams for backup, and leaks its dripping stuff all over your boots while it drifts away. Pro tip: shut it up quick, or the Bugaboos arrive with a hook-knife and bad intentions.',
    ],
    prevNotes: [
      'Special: Alarm; The Eyes Have It; Hover. Full text: GM Campaign Toolkit p. 129.',
      "Alarm: when threatened, it chimes loudly and calls nearby Bugaboos.\nThe Eyes Have It: covered in eyes, so it is very hard to Surprise.\nHover: flies as easily as moving on the ground.\nNoncombatant: doesn't fight. It slowly drifts away, leaking eyeballs and goo to slow pursuers.\nWeeping Eye Discharge: any hit crawler gains both Take Down and Fatigued.\n\nFull text: GM Campaign Toolkit p. 129.",
    ],
    descriptionEs:
      '¡Vigilancia, ahora en versión asquerosa! El Screye Drone es un saco flotante de ojos al que no se le puede pillar por sorpresa, toca la campana para pedir refuerzos Bugaboo y va dejando un reguero de pringue ocular mientras se aleja. Si te alcanza su lagrimeo, acabas en el suelo y agotado. Pro-Tip: mátalo antes de que toque la campana. Intenta no resbalar con la secreción.',
    prevDescriptionsEs: [
      '¡Vigilancia, ahora en versión asquerosa! El Screye Drone es un saco flotante de ojos al que no se le puede pillar por sorpresa, toca la campana para pedir refuerzos Bugaboo y va dejando un reguero de pringue ocular mientras se aleja. Si te alcanza su lagrimeo, acabas en el suelo y agotado. Consejo pro: mátalo antes de que toque la campana. Intenta no resbalar con la secreción.',
    ],
  },
  {
    name: 'Blind Goblin Survivor',
    kind: 'mob',
    size: 'Petite (3)',
    tags: 'Humanoid',
    slots: '4',
    slotValue: '3',
    level: '4',
    surprise: '12+F',
    evade: '12+F',
    move: '20+S',
    dr: '2',
    stats: {
      str: {
        score: '3',
        mod: '+2',
      },
      int: {
        score: '3',
        mod: '+2',
      },
      con: {
        score: '6',
        mod: '+3',
      },
      dex: {
        score: '3',
        mod: '+2',
      },
      cha: {
        score: '2',
        mod: '+1',
      },
    },
    attacks: [
      {
        name: 'Blind Fighting',
        toHit: '12+F',
        damage: '1d8+2 Bludgeoning',
        range: '5ft range',
        effect: 'Special effect',
      },
    ],
    notes:
      'Motion Detection: crawler makes a Surprise Attack on it → free instant counterattack (no Action), Evaded at Disadvantage.\nBlind: darkness, fog etc. impose no penalty.\nBlind Fighting: immune to attack redirection (Taunt, Catcher and similar Skills fail).\n\nFull text: GM Campaign Toolkit p. 129.',
    source: 'GM Campaign Toolkit p. 129',
    chapter: 'Floor 2 · GM Toolkit',
    floor: 2,
    description:
      "This goblin fights by feel, and he's better at it than you are with both eyes open. Try a cheap-shot sneak attack and he smacks you back for free, and you'll Evade it badly. Pro tip: darkness and fog do jack shit, and your Taunts are wasted. So just fight him head-on. Revolutionary, I know.",
    prevDescriptions: [
      "Tragic backstory? Check. Lightning reflexes? Check. Eyes? Well, no. This goblin fights by feel and punishes anyone sneaky enough to try a cheap shot. Pro tip: sneak attacks just get you hit back. And fog won't help you, it doesn't care. Try being polite. Revolutionary, I know.",
    ],
    prevNotes: [
      'Special: Motion Detection; Blind. Full text: GM Campaign Toolkit p. 129.',
      'Motion Detection: crawler makes a Surprise Attack on it → free instant counterattack (no Action), Evaded at Disadvantage.\nBlind: darkness, fog etc. impose no penalty.\nBlind Fighting: immune to attack redirection (Taunt, Catcher and similar Skills fail).\n\nFull text: GM Campaign Toolkit p. 129.',
    ],
    descriptionEs:
      'Este goblin pelea a tientas, y lo hace mejor que tú con los dos ojos abiertos. Intenta un ataque furtivo a traición y te devuelve la hostia gratis, y la vas a Esquivar fatal. Pro-Tip: la oscuridad y la niebla no le hacen ni puta mierda, y tus Taunts no sirven de nada. Así que pelea con él de frente. Revolucionario, lo sé.',
    prevDescriptionsEs: [
      'Este goblin pelea a tientas, y lo hace mejor que tú con los dos ojos abiertos. Intenta un ataque furtivo a traición y te devuelve la hostia gratis, y la vas a Esquivar fatal. Consejo pro: la oscuridad y la niebla no le hacen ni puta mierda, y tus Taunts no sirven de nada. Así que pelea con él de frente. Revolucionario, lo sé.',
    ],
  },
  {
    name: 'Socket-Picker',
    kind: 'mob',
    size: 'Medium (4)',
    tags: 'Unique Humanoid',
    slots: '10',
    slotValue: '4',
    level: '11',
    surprise: '13+F',
    evade: '14+F',
    move: '30+S',
    dr: '2',
    stats: {
      str: {
        score: '10',
        mod: '+4',
      },
      int: {
        score: '6',
        mod: '+3',
      },
      con: {
        score: '10',
        mod: '+4',
      },
      dex: {
        score: '10',
        mod: '+4',
      },
      cha: {
        score: '2',
        mod: '+1',
      },
    },
    attacks: [
      {
        name: 'Melon-Baller',
        toHit: '14+F',
        damage: '3d4+3 Slashing',
        range: '5ft range',
        effect: 'Major Fail+: Injury',
      },
      {
        name: 'Bone Scoop',
        toHit: '13+F',
        damage: '3d6+3 Bludgeoning',
        range: '5ft range',
        effect: 'Special effect',
      },
    ],
    notes: 'Full text: GM Campaign Toolkit p. 130.',
    source: 'GM Campaign Toolkit p. 130',
    chapter: 'Floor 2 · GM Toolkit',
    floor: 2,
    description:
      'Meet the original Socket-Picker, level 11 and the CEO of the eyeball business. He carries a melon-baller, and I promise you he is not using it on cantaloupe. Pro tip: no tricks here, just brutal damage from a guy who really likes his work. Bring a spare eye. Or a patch. Pirates do great numbers with the viewers.',
    prevDescriptions: [
      "The original Socket-Picker, the head of the whole eyeball-harvesting operation. Level 11, a melon-baller, and a very specific hobby. Every crawler's eyes look like a snack to him. Pro tip: if your Evade is shaky, bring a patch and a spare. The viewers adore a pirate look.",
    ],
    prevNotes: ['Full text: GM Campaign Toolkit p. 130.'],
    descriptionEs:
      'Os presento al Socket-Picker original, nivel 11 y CEO del negocio de los globos oculares. Lleva un sacabolas de melón, y te prometo que no lo usa con cantalupos. Pro-Tip: aquí no hay trucos, solo daño brutal de un tío al que le encanta su trabajo. Tráete un ojo de repuesto. O un parche. Los piratas tienen unos números buenísimos con los espectadores.',
    prevDescriptionsEs: [
      'Os presento al Socket-Picker original, nivel 11 y CEO del negocio de los globos oculares. Lleva un sacabolas de melón, y te prometo que no lo usa con cantalupos. Consejo pro: aquí no hay trucos, solo daño brutal de un tío al que le encanta su trabajo. Tráete un ojo de repuesto. O un parche. Los piratas tienen unos números buenísimos con los espectadores.',
    ],
  },
  {
    name: 'Spit—Goblin Survivor Who Lives in the Now',
    kind: 'mob',
    size: 'Petite (3)',
    tags: 'Unique Humanoid',
    slots: '6',
    slotValue: '3',
    level: '6',
    surprise: '12+F',
    evade: '13+F',
    move: '20+S',
    dr: '2',
    stats: {
      str: {
        score: '6',
        mod: '+3',
      },
      int: {
        score: '4',
        mod: '+2',
      },
      con: {
        score: '6',
        mod: '+3',
      },
      dex: {
        score: '6',
        mod: '+3',
      },
      cha: {
        score: '1',
        mod: '+1',
      },
    },
    attacks: [
      {
        name: 'Rock',
        toHit: '13+F',
        damage: '2d6+3 Bludgeoning',
        range: '30ft range',
        effect: '',
      },
      {
        name: 'Spear',
        toHit: '13+F',
        damage: '2d8+3 Piercing',
        range: '5ft range',
        effect: 'Special effect',
      },
    ],
    notes: 'Full text: GM Campaign Toolkit p. 130.',
    source: 'GM Campaign Toolkit p. 130',
    chapter: 'Floor 2 · GM Toolkit',
    floor: 2,
    description:
      "Spit is a goblin survivor who lives fully in the moment, and right now the moment is him throwing a rock at your stupid face. No regrets, no plans, just vibes and violence. Pro tip: he's decent at range and nastier up close with the spear. Closing the gap is not the clever move you think it is.",
    prevDescriptions: [
      "Spit is a scrappy goblin survivor who refuses to think about yesterday or tomorrow. He throws rocks, pokes with a spear, and is fully present in every moment of violence. Mindfulness! Pro tip: he's decent at range and up close, so don't assume that rock is his only trick.",
    ],
    prevNotes: ['Full text: GM Campaign Toolkit p. 130.'],
    descriptionEs:
      'Spit es un goblin superviviente que vive plenamente el momento, y ahora mismo el momento consiste en tirarte una piedra a tu cara de idiota. Ni remordimientos ni planes, solo buen rollo y violencia. Pro-Tip: a distancia se defiende, y de cerca con la lanza es más cabrón todavía. Acortar distancias no es la jugada genial que te crees.',
    prevDescriptionsEs: [
      'Spit es un goblin superviviente que vive plenamente el momento, y ahora mismo el momento consiste en tirarte una piedra a tu cara de idiota. Ni remordimientos ni planes, solo buen rollo y violencia. Consejo pro: a distancia se defiende, y de cerca con la lanza es más cabrón todavía. Acortar distancias no es la jugada genial que te crees.',
    ],
  },
  {
    name: 'Go of the Past',
    kind: 'mob',
    size: 'Petite (3)',
    tags: 'Unique Humanoid',
    slots: '7',
    slotValue: '3',
    level: '7',
    surprise: '12+F',
    evade: '13+F',
    move: '20+S',
    dr: '2',
    stats: {
      str: {
        score: '10',
        mod: '+4',
      },
      int: {
        score: '3',
        mod: '+2',
      },
      con: {
        score: '6',
        mod: '+3',
      },
      dex: {
        score: '6',
        mod: '+3',
      },
      cha: {
        score: '1',
        mod: '+1',
      },
    },
    attacks: [
      {
        name: 'Rock',
        toHit: '14+F',
        damage: '2d6+4 Bludgeoning',
        range: '30ft range',
        effect: '',
      },
      {
        name: 'Spear',
        toHit: '14+F',
        damage: '2d8+4 Piercing',
        range: '5ft range',
        effect: 'Special effect',
      },
    ],
    notes: 'Full text: GM Campaign Toolkit p. 131.',
    source: 'GM Campaign Toolkit p. 131',
    chapter: 'Floor 2 · GM Toolkit',
    floor: 2,
    description:
      "Go of the Past is Spit's cranky sibling, forever bitching about the good old days before you assholes arrived. Same rock, same spear, but he hits harder, fueled by pure grudge. Pro tip: nothing fancy here, just a meaner stat block. Do not mention the old days. He will tell you about them. At length.",
    prevDescriptions: [
      "Meet Spat, Spit's grumpier brother, who can't stop talking about the bad old days. He hits a little harder than his sibling, probably fueled by grudges. Want a quick win? Don't be a Bugaboo. Pro tip: he's stuck in the past, so maybe don't remind him of anything. Or everything.",
    ],
    prevNotes: ['Full text: GM Campaign Toolkit p. 131.'],
    descriptionEs:
      'Go of the Past es el hermano cascarrabias de Spit, siempre quejándose de los buenos tiempos antes de que llegarais vosotros, cabrones. La misma piedra, la misma lanza, pero pega más fuerte, alimentado por puro rencor. Pro-Tip: nada del otro mundo, solo unas stats más jodidas. No menciones los viejos tiempos. Te los contará. Con todo lujo de detalles.',
    prevDescriptionsEs: [
      'Go of the Past es el hermano cascarrabias de Spit, siempre quejándose de los buenos tiempos antes de que llegarais vosotros, cabrones. La misma piedra, la misma lanza, pero pega más fuerte, alimentado por puro rencor. Consejo pro: nada del otro mundo, solo unas stats más jodidas. No menciones los viejos tiempos. Te los contará. Con todo lujo de detalles.',
    ],
  },
  {
    name: 'Stiggy, Dungeon Surveillance Architect',
    kind: 'boss',
    size: 'Petite (3)',
    tags: 'Borough Boss, Cybernetic Humanoid',
    slots: '10',
    slotValue: '3',
    level: '14',
    surprise: '22+F',
    evade: '14+F',
    move: '10+S',
    dr: '3',
    stats: {
      str: {
        score: '7',
        mod: '+3',
      },
      int: {
        score: '50',
        mod: '+6',
      },
      con: {
        score: '7',
        mod: '+3',
      },
      dex: {
        score: '10',
        mod: '+4',
      },
      cha: {
        score: '7',
        mod: '+3',
      },
    },
    attacks: [
      {
        name: 'Camera Flash',
        toHit: '13+F',
        damage: '2d4+3 Electric',
        range: '30ft range',
        effect: 'On hit: Blinded',
      },
    ],
    notes:
      "Hands Off: 1 attack/round (rest of his turn is trapdoors and floor rotation). A successful Probe on a crawler → never Probes them again; all Probed → Camera Flash only.\nTrapdoors: each round's end, grounded crawlers roll Dex Stat Check or eat a 1d6+F Piercing spike trap.\nRotating Floors: each round's end, grounded crawlers gain Fatigued.\nHydraulic Arm: mobile armored mount, DR 5, 8 HB slots of 3s. Destroyed → thrashes, bashes Stiggy into the monitors until he dies.\nElectrified Arm: reflects 1:1; per HB slot the arm drops, its attacker drops 1 HB slot too.\nScreens & Cameras Everywhere: Surprise against him is very difficult.\nGuards: +1 Screye Drone and +1 Bugaboo every combat round. Any hit worth 4+ HB slots on Stiggy → a Screye Drone absorbs it.\nCamera Flash: Evade at Disadvantage. Hit → Blinded (attacks at Disadvantage until next time the crawler is damaged).\n\nFull text: GM Campaign Toolkit p. 135.",
    source: 'GM Campaign Toolkit p. 135',
    chapter: 'Floor 2 · GM Toolkit',
    floor: 2,
    description:
      "Stiggy built his whole Borough into a reality show, and honestly, I'm jealous of the camera budget. Trapdoors with spikes, spinning floors, endless goons, and a flash that blinds you. Pro tip: that hydraulic arm he's perched on is the weak point, but it shocks you back. Wreck it and it beats him to death against his own monitors. Chef's kiss.",
    prevDescriptions: [
      'Say cheese! Stiggy is a cyborg goblin who turned a whole Borough into his personal reality show, and I respect the hustle. Trapdoors, spinning floors, endless goons, and a flash that leaves you seeing spots. Pro tip: the arm holding him up is the real target, but it bites back with electricity.',
    ],
    prevNotes: [
      'Special: Hands Off; Trapdoors; Rotating Floors; Hydraulic Arm; Electrified Arm; Screens & Cameras Everywhere; Guards. Full text: GM Campaign Toolkit p. 135.',
      "Hands Off: 1 attack/round (rest of his turn is trapdoors and floor rotation). A successful Probe on a crawler → never Probes them again; all Probed → Camera Flash only.\nTrapdoors: each round's end, grounded crawlers roll Dex Stat Check or eat a 1d6+F Piercing spike trap.\nRotating Floors: each round's end, grounded crawlers gain Fatigued.\nHydraulic Arm: mobile armored mount, DR 5, 8 HB slots of 3s. Destroyed → thrashes, bashes Stiggy into the monitors until he dies.\nElectrified Arm: reflects 1:1; per HB slot the arm drops, its attacker drops 1 HB slot too.\nScreens & Cameras Everywhere: Surprise against him is very difficult.\nGuards: +1 Screye Drone and +1 Bugaboo every combat round. Any hit worth 4+ HB slots on Stiggy → a Screye Drone absorbs it.\nCamera Flash: Evade at Disadvantage. Hit → Blinded (attacks at Disadvantage until next time the crawler is damaged).\n\nFull text: GM Campaign Toolkit p. 135.",
    ],
    descriptionEs:
      'Stiggy convirtió todo su Borough en un reality show y, sinceramente, envidio su presupuesto de cámaras. Trampillas con pinchos, suelos giratorios, esbirros infinitos y un fogonazo que te deja ciego. Pro-Tip: el brazo hidráulico en el que está encaramado es su punto débil, pero te devuelve la descarga. Destrózalo y lo matará a golpes contra sus propios monitores. Una obra maestra.',
    prevDescriptionsEs: [
      'Stiggy convirtió todo su Borough en un reality show y, sinceramente, envidio su presupuesto de cámaras. Trampillas con pinchos, suelos giratorios, esbirros infinitos y un fogonazo que te deja ciego. Consejo pro: el brazo hidráulico en el que está encaramado es su punto débil, pero te devuelve la descarga. Destrózalo y lo matará a golpes contra sus propios monitores. Una obra maestra.',
    ],
  },
  {
    name: 'Bruiser',
    kind: 'crawler',
    size: 'Medium (4)',
    tags: 'Human',
    slots: '5',
    slotValue: '3',
    level: '5',
    surprise: '11+F',
    evade: '12+F',
    move: '20+S',
    dr: '3',
    stats: {
      str: {
        score: '6',
        mod: '+3',
      },
      int: {
        score: '2',
        mod: '+1',
      },
      con: {
        score: '6',
        mod: '+3',
      },
      dex: {
        score: '4',
        mod: '+2',
      },
      cha: {
        score: '3',
        mod: '+2',
      },
    },
    attacks: [
      {
        name: 'Pointy Stick',
        toHit: '13+F',
        damage: '2d8+3 Piercing',
        range: '5ft range',
        effect: 'Special effect',
      },
    ],
    notes: 'Full text: GM Campaign Toolkit p. 136.',
    source: 'GM Campaign Toolkit p. 136',
    chapter: 'GM Toolkit Threat Appendix (Rival crawlers)',
    floor: 0,
    description:
      "Bruiser found a pointy stick and decided that was a personality. Decent Health, decent damage, zero plan. It's giving 'caveman who got lucky.' Pro tip for his enemies: he has exactly one move, and it's poking. Pro tip for Bruiser: learn a second one before somebody shoves that stick somewhere unpleasant.",
    prevDescriptions: [
      'Bruiser here found a stick, sharpened it, and decided that was a whole personality. Solid hit points, solid damage, no plan. A brave approach! Pro tip for his rivals: he only has one move. Pro tip for Bruiser: get a second move.',
    ],
    prevNotes: ['Full text: GM Campaign Toolkit p. 136.'],
    descriptionEs:
      "Bruiser encontró un palo puntiagudo y decidió que eso era una personalidad. Salud decente, daño decente, cero plan. Tiene vibras de 'cavernícola con suerte'. Pro-Tip para sus enemigos: tiene exactamente un movimiento, y es pinchar. Pro-Tip para Bruiser: apréndete un segundo antes de que alguien te meta ese palo en algún sitio desagradable.",
    prevDescriptionsEs: [
      "Bruiser encontró un palo puntiagudo y decidió que eso era una personalidad. Salud decente, daño decente, cero plan. Tiene vibras de 'cavernícola con suerte'. Consejo pro para sus enemigos: tiene exactamente un movimiento, y es pinchar. Consejo pro para Bruiser: apréndete un segundo antes de que alguien te meta ese palo en algún sitio desagradable.",
    ],
  },
  {
    name: 'Wise-Guy',
    kind: 'crawler',
    size: 'Medium (4)',
    tags: 'Human',
    slots: '5',
    slotValue: '2',
    level: '5',
    surprise: '13+F',
    evade: '11+F',
    move: '20+S',
    dr: '3',
    stats: {
      str: {
        score: '3',
        mod: '+2',
      },
      int: {
        score: '6',
        mod: '+3',
      },
      con: {
        score: '4',
        mod: '+2',
      },
      dex: {
        score: '2',
        mod: '+1',
      },
      cha: {
        score: '5',
        mod: '+2',
      },
    },
    attacks: [
      {
        name: 'Magic Missile Spell',
        toHit: '13+F',
        damage: '2d4+3 Force, Line of',
        range: '',
        effect: 'Special effect',
      },
    ],
    notes: 'Full text: GM Campaign Toolkit p. 136.',
    source: 'GM Campaign Toolkit p. 136',
    chapter: 'GM Toolkit Threat Appendix (Rival crawlers)',
    floor: 0,
    description:
      "The Wise-Guy thinks he's the smartest crawler on the Floor, and his entire proof is one Magic Missile. He runs his mouth like a podcast nobody asked for. My viewers have a betting pool on when his mana runs dry and he has to throw his shoes. Current odds say round two.",
    prevDescriptions: [
      "The Wise-Guy thinks he's the smartest crawler on the Floor, and his one magic missile is his proof. He talks a big game and has a big mouth to match. Place your bets on how long the attitude lasts after the missile's used up. My money's on thirty seconds.",
    ],
    prevNotes: ['Full text: GM Campaign Toolkit p. 136.'],
    descriptionEs:
      'El Wise-Guy se cree el crawler más listo del Piso, y toda su prueba es un único Magic Missile. No para de largar como un pódcast que nadie ha pedido. Mis espectadores tienen una porra sobre cuándo se quedará sin maná y tendrá que tirar los zapatos. Las apuestas actuales dicen que en la segunda ronda.',
  },
  {
    name: 'Goblin',
    kind: 'mob',
    size: 'Petite (3)',
    tags: 'Humanoid',
    slots: '2',
    slotValue: '1',
    level: '2',
    surprise: '11+F',
    evade: '13+F',
    move: '20+S',
    dr: '1',
    stats: {
      str: {
        score: '1',
        mod: '+1',
      },
      int: {
        score: '2',
        mod: '+1',
      },
      con: {
        score: '1',
        mod: '+1',
      },
      dex: {
        score: '6',
        mod: '+3',
      },
      cha: {
        score: '1',
        mod: '+1',
      },
    },
    attacks: [
      {
        name: 'Club',
        toHit: '11+F',
        damage: '1d6+1 Bludgeoning',
        range: '5ft range',
        effect: '',
      },
    ],
    notes:
      'Pineapple Club: its club starts with a pineapple attached for +1d4 damage. The pineapple falls off if an attack deals 3+ HB slots of damage to a crawler.\nSpunk: melee hits take at most 1 HB slot off it unless they are an Amazing Success or better. It gets +1 damage while below full Health.\n\nFull text: GM Campaign Toolkit p. 136.',
    source: 'GM Campaign Toolkit p. 136',
    chapter: 'Floor 1 · GM Toolkit Threat Appendix (First Floor Mobs)',
    floor: 1,
    description:
      "The humble Goblin! Pint-sized, furious, and armed with a club with a pineapple jammed on the end. Do not ask about the pineapple. These spiteful little shits are so stubborn that normal hits barely dent them, and they hit harder once they're hurt. Pro tip: crit or go home. A big hit knocks the fruit loose too.",
    prevDescriptions: [
      "Ah, the humble Goblin, a first-floor classic. Tiny, furious, and armed with a club that has a pineapple on it. Do NOT ask about the pineapple. They're too angry to fall down properly, so ordinary swings barely dent them. Pro tip: crit or go home.",
    ],
    prevNotes: [
      'Special: Pineapple Club; Spunk. Full text: GM Campaign Toolkit p. 136.',
      'Pineapple Club: its club starts with a pineapple attached for +1d4 damage. The pineapple falls off if an attack deals 3+ HB slots of damage to a crawler.\nSpunk: melee hits take at most 1 HB slot off it unless they are an Amazing Success or better. It gets +1 damage while below full Health.\n\nFull text: GM Campaign Toolkit p. 136.',
    ],
    descriptionEs:
      '¡El humilde Goblin! Diminuto, furioso y armado con una porra con una piña clavada en la punta. No preguntes por la piña. Estas mierdecillas rencorosas son tan tozudas que los golpes normales apenas les hacen mella, y pegan más fuerte cuando están heridas. Pro-Tip: crítico o nada. Un buen golpe también hace saltar la fruta.',
    prevDescriptionsEs: [
      '¡El humilde Goblin! Diminuto, furioso y armado con una porra con una piña clavada en la punta. No preguntes por la piña. Estas mierdecillas rencorosas son tan tozudas que los golpes normales apenas les hacen mella, y pegan más fuerte cuando están heridas. Consejo pro: crítico o nada. Un buen golpe también hace saltar la fruta.',
    ],
  },
  {
    name: 'Goblin Engineer',
    kind: 'mob',
    size: 'Petite (3)',
    tags: 'Humanoid',
    slots: '3',
    slotValue: '1',
    level: '3',
    surprise: '12+F',
    evade: '13+F',
    move: '20+S',
    dr: '2',
    stats: {
      str: {
        score: '3',
        mod: '+2',
      },
      int: {
        score: '3',
        mod: '+2',
      },
      con: {
        score: '1',
        mod: '+1',
      },
      dex: {
        score: '6',
        mod: '+3',
      },
      cha: {
        score: '1',
        mod: '+1',
      },
    },
    attacks: [
      {
        name: 'Sword',
        toHit: '12+F',
        damage: '1d6+2 Slashing',
        range: '5ft range',
        effect: '',
      },
      {
        name: 'Metal Shard',
        toHit: '13+F',
        damage: '1d4+3 Piercing',
        range: '30ft range',
        effect: 'Major Fail+: Stiff Legs',
      },
    ],
    notes:
      "Incel: attacks entities it thinks look female before anyone else.\nPilot: can build a one-seat Goblin vehicle from scrap in about an hour, or bigger ones with more time. A multi-passenger vehicle's boiler can overheat and explode in combat if the engineer leaves its relief valves alone for more than 1 minute.\n\nFull text: GM Campaign Toolkit p. 137.",
    source: 'GM Campaign Toolkit p. 137',
    chapter: 'Floor 1 · GM Toolkit Threat Appendix (First Floor Mobs)',
    floor: 1,
    description:
      "The Goblin Engineer builds death-trap jalopies out of scrap and spite. He's got a nasty habit of picking his targets by looks, and he's a lousy judge of it. Pro tip: if he's piloting a multi-seat wagon, keep the little grease monkey away from the relief valves. Give it a minute and the boiler turns the whole crew into shrapnel. Fireworks!",
    prevDescriptions: [
      "The Goblin Engineer builds deathtraps on wheels out of junk and grudges. His social skills are worse than his welding, and he picks fights accordingly. Pro tip: if he's driving the big steam wagon, keep him busy and away from the valves. Then take cover. Fireworks!",
    ],
    prevNotes: [
      'Special: Incel; Pilot. Full text: GM Campaign Toolkit p. 137.',
      "Target Priority: attacks entities it thinks look female before anyone else.\nPilot: can build a one-seat Goblin vehicle from scrap in about an hour, or bigger ones with more time. A multi-passenger vehicle's boiler can overheat and explode in combat if the engineer leaves its relief valves alone for more than 1 minute.\n\nFull text: GM Campaign Toolkit p. 137.",
    ],
    descriptionEs:
      'El Goblin Engineer construye cacharros trampa mortal con chatarra y mala leche. Tiene la fea costumbre de elegir sus objetivos por la pinta, y se le da fatal. Pro-Tip: si conduce un carromato de varias plazas, mantén al grasiento de las narices lejos de las válvulas de alivio. Dale un minuto y la caldera convierte a toda la tripulación en metralla. ¡Fuegos artificiales!',
    prevDescriptionsEs: [
      'El Goblin Engineer construye cacharros trampa mortal con chatarra y mala leche. Tiene la fea costumbre de elegir sus objetivos por la pinta, y se le da fatal. Consejo pro: si conduce un carromato de varias plazas, mantén al grasiento de las narices lejos de las válvulas de alivio. Dale un minuto y la caldera convierte a toda la tripulación en metralla. ¡Fuegos artificiales!',
    ],
  },
  {
    name: 'Goblin Bomb Bard',
    kind: 'mob',
    size: 'Petite (3)',
    tags: 'Humanoid',
    slots: '5',
    slotValue: '2',
    level: '5',
    surprise: '11+F',
    evade: '14+F',
    move: '20+S',
    dr: '1',
    stats: {
      str: {
        score: '4',
        mod: '+2',
      },
      int: {
        score: '2',
        mod: '+1',
      },
      con: {
        score: '3',
        mod: '+2',
      },
      dex: {
        score: '10',
        mod: '+4',
      },
      cha: {
        score: '1',
        mod: '+1',
      },
    },
    attacks: [
      {
        name: 'Bomb',
        toHit: '14+F',
        damage: '2d8 Bludgeoning',
        range: '60ft range; 5ft Blast',
        effect: 'Special effect',
      },
      {
        name: 'Dynamite',
        toHit: '14+F',
        damage: '1d6 Bludgeoning',
        range: '40ft range; 5ft',
        effect: 'Special effect',
      },
    ],
    notes:
      "Explosive Demise: explodes on death, dealing 2d8+F damage to everything adjacent.\nUnstable Bombs: when it uses Bomb, roll d20 for how far the bomb gets before blowing up: 1 = 0ft (on itself), 2-4 = 10ft, 5-8 = 20ft, 9-12 = 30ft, 13-20 = 60ft. It explodes in the space that far along the line to its target; if that's past the target, it reaches the target.\nDynamite: 5ft Blast plus 5ft Splash.\n\nFull text: GM Campaign Toolkit p. 137.",
    source: 'GM Campaign Toolkit p. 137',
    chapter: 'Floor 1 · GM Toolkit Threat Appendix (First Floor Mobs)',
    floor: 1,
    description:
      "Every band needs a pyro guy. This band IS the pyro guy, and he's shit at it. His bombs go off wherever the dice say, sometimes right in his own hands, and when he dies he blows up anyway. Pro tip: don't stand next to him. Ever. Alive or dead, this dude is a walking insurance claim.",
    prevDescriptions: [
      "Every band needs a pyro guy. This band IS the pyro guy. The Bomb Bard throws homemade explosives with all the precision of a drunk juggler, and sometimes the song ends early. On him. Pro tip: don't stand next to him when he dies. Or when he's alive, honestly.",
    ],
    prevNotes: [
      'Special: Explosive Demise; Unstable Bombs. Full text: GM Campaign Toolkit p. 137.',
      "Explosive Demise: explodes on death, dealing 2d8+F damage to everything adjacent.\nUnstable Bombs: when it uses Bomb, roll d20 for how far the bomb gets before blowing up: 1 = 0ft (on itself), 2-4 = 10ft, 5-8 = 20ft, 9-12 = 30ft, 13-20 = 60ft. It explodes in the space that far along the line to its target; if that's past the target, it reaches the target.\nDynamite: 5ft Blast plus 5ft Splash.\n\nFull text: GM Campaign Toolkit p. 137.",
    ],
    descriptionEs:
      'Todo grupo necesita un pirotécnico. Este grupo ES el pirotécnico, y es una puta mierda haciéndolo. Sus bombas explotan donde digan los dados, a veces en sus propias manos, y cuando muere revienta igualmente. Pro-Tip: no te pongas a su lado. Nunca. Vivo o muerto, este tío es un parte al seguro con patas.',
    prevDescriptionsEs: [
      'Todo grupo necesita un pirotécnico. Este grupo ES el pirotécnico, y es una puta mierda haciéndolo. Sus bombas explotan donde digan los dados, a veces en sus propias manos, y cuando muere revienta igualmente. Consejo pro: no te pongas a su lado. Nunca. Vivo o muerto, este tío es un parte al seguro con patas.',
    ],
  },
  {
    name: 'Goblin Shamanka',
    kind: 'mob',
    size: 'Petite (3)',
    tags: 'Humanoid',
    slots: '7',
    slotValue: '3',
    level: '7',
    surprise: '14+F',
    evade: '12+F',
    move: '20+S',
    dr: '1',
    stats: {
      str: {
        score: '2',
        mod: '+1',
      },
      int: {
        score: '10',
        mod: '+4',
      },
      con: {
        score: '6',
        mod: '+3',
      },
      dex: {
        score: '3',
        mod: '+2',
      },
      cha: {
        score: '5',
        mod: '+2',
      },
    },
    attacks: [
      {
        name: 'Agony Missile',
        toHit: '14+F',
        damage: '2d6+4 Psychic',
        range: '50ft range',
        effect: 'Special effect',
      },
    ],
    notes:
      "Revenge: she curses her clan's vehicles so that when one explodes on being destroyed, all the blast damage goes to whoever destroyed it. Normal ways of avoiding explosions still work.\n\nFull text: GM Campaign Toolkit p. 137.",
    source: 'GM Campaign Toolkit p. 137',
    chapter: 'Floor 1 · GM Toolkit Threat Appendix (First Floor Mobs)',
    floor: 1,
    description:
      "The Goblin Shamanka sells the clan's spiritual car insurance: wreck their ride, and the explosion comes for your ass personally. She also flings agony missiles that make your brain feel like it's being sandpapered from the inside. Pro tip: before you blow up that goblin car, make sure you can dodge the blast. Or hide behind a friend.",
    prevDescriptions: [
      "The Goblin Shamanka runs the clan's spiritual insurance plan: wreck their ride and the ride wrecks you back. Her agony missiles leave you bleeding, dizzy, or stunned, winner's choice. Pro tip: before you blow up that Goblin car, check who's standing closest. Hint: it's you.",
    ],
    prevNotes: [
      'Special: Revenge. Full text: GM Campaign Toolkit p. 137.',
      "Revenge: she curses her clan's vehicles so that when one explodes on being destroyed, all the blast damage goes to whoever destroyed it. Normal ways of avoiding explosions still work.\n\nFull text: GM Campaign Toolkit p. 137.",
    ],
    descriptionEs:
      'La Goblin Shamanka vende el seguro de coche espiritual del clan: destroza su vehículo y la explosión irá a por tu culo en persona. Además lanza misiles de agonía que hacen que sientas el cerebro lijado por dentro. Pro-Tip: antes de volar ese coche goblin, asegúrate de poder esquivar la explosión. O escóndete detrás de un amigo.',
    prevDescriptionsEs: [
      'La Goblin Shamanka vende el seguro de coche espiritual del clan: destroza su vehículo y la explosión irá a por tu culo en persona. Además lanza misiles de agonía que hacen que sientas el cerebro lijado por dentro. Consejo pro: antes de volar ese coche goblin, asegúrate de poder esquivar la explosión. O escóndete detrás de un amigo.',
    ],
  },
  {
    name: 'Rot Sticker',
    kind: 'mob',
    size: 'Tiny (1)',
    tags: 'Beastly',
    slots: '1',
    slotValue: '1',
    level: '1',
    surprise: '11+F',
    evade: '12+F',
    move: '20+S',
    dr: '1',
    stats: {
      str: {
        score: '2',
        mod: '+1',
      },
      int: {
        score: '1',
        mod: '+1',
      },
      con: {
        score: '1',
        mod: '+1',
      },
      dex: {
        score: '3',
        mod: '+2',
      },
      cha: {
        score: '1',
        mod: '+1',
      },
    },
    attacks: [
      {
        name: 'Stick',
        toHit: '12+F',
        damage: 'No damage',
        range: '5ft range',
        effect: 'Special effect',
      },
      {
        name: 'Explode',
        toHit: '13+F',
        damage: '1d6+1 Bludgeoning',
        range: '0ft range (see',
        effect: 'Major Fail+: Take Down',
      },
    ],
    notes:
      "Stick: on any Evade Fail, it attaches to the target, sharing their space and moving with them.\nOverly-Attached: it can only Explode while attached, spending an Attack Action. Exploding kills it. Attacks against an attached Rot Sticker: on Fail, the attacker takes the damage; on Amazing Success or better, every attached Rot Sticker on that crawler is removed and destroyed.\nSticky: can cling to walls and ceilings but can't move along them.\n\nFull text: GM Campaign Toolkit p. 138.",
    source: 'GM Campaign Toolkit p. 138',
    chapter: 'Floor 1 · GM Toolkit Threat Appendix (First Floor Mobs)',
    floor: 1,
    description:
      "The Rot Sticker is a clingy little ex with a fuse. It glues itself to you, rides along like a tumor, and then pops. Pro tip: swat it carefully, because a missed attack means you punch yourself in the dick. Land a big one and all the stuck ones go flying. Hesitate and you'll be wearing your own guts.",
    prevDescriptions: [
      "The Rot Sticker loves you. It wants to be with you forever. Then it wants to explode. It's a clingy ex with a fuse! Pro tip: swat it off carefully, because missing means slapping yourself. A big hit clears the whole bunch. Hesitation clears your Health Bar.",
    ],
    prevNotes: [
      'Special: Overly-Attached; Sticky. Full text: GM Campaign Toolkit p. 138.',
      "Stick: on any Evade Fail, it attaches to the target, sharing their space and moving with them.\nOverly-Attached: it can only Explode while attached, spending an Attack Action. Exploding kills it. Attacks against an attached Rot Sticker: on Fail, the attacker takes the damage; on Amazing Success or better, every attached Rot Sticker on that crawler is removed and destroyed.\nSticky: can cling to walls and ceilings but can't move along them.\n\nFull text: GM Campaign Toolkit p. 138.",
    ],
    descriptionEs:
      'La Rot Sticker es una ex pegajosa con mecha. Se te pega, va contigo de paquete como un tumor, y luego revienta. Pro-Tip: dale el manotazo con cuidado, porque un ataque fallado significa que te das un puñetazo en la entrepierna. Mete uno bien gordo y todas las que tengas pegadas salen volando. Si dudas, acabarás vistiendo tus propias tripas.',
    prevDescriptionsEs: [
      'La Rot Sticker es una ex pegajosa con mecha. Se te pega, va contigo de paquete como un tumor, y luego revienta. Consejo pro: dale el manotazo con cuidado, porque un ataque fallado significa que te das un puñetazo en la entrepierna. Mete uno bien gordo y todas las que tengas pegadas salen volando. Si dudas, acabarás vistiendo tus propias tripas.',
    ],
  },
  {
    name: 'Scatterer',
    kind: 'mob',
    size: 'Small (2)',
    tags: 'Beastly',
    slots: '1',
    slotValue: '2',
    level: '1',
    surprise: '11+F',
    evade: '11+F',
    move: '20+S',
    dr: '2',
    stats: {
      str: {
        score: '1',
        mod: '+1',
      },
      int: {
        score: '1',
        mod: '+1',
      },
      con: {
        score: '4',
        mod: '+2',
      },
      dex: {
        score: '1',
        mod: '+1',
      },
      cha: {
        score: '1',
        mod: '+1',
      },
    },
    attacks: [
      {
        name: 'Bite',
        toHit: '11+F',
        damage: '1d6+1 Piercing',
        range: '5ft range',
        effect: '',
      },
      {
        name: 'Spit',
        toHit: '11+F',
        damage: '1d4+1 Poison',
        range: '30ft range',
        effect: 'Major Fail+: Taint',
      },
    ],
    notes:
      'Wall Walker: moves on walls and ceilings as easily as on the ground.\n\nFull text: GM Campaign Toolkit p. 138.',
    source: 'GM Campaign Toolkit p. 138',
    chapter: 'Floor 1 · GM Toolkit Threat Appendix (First Floor Mobs)',
    floor: 1,
    description:
      "The Scatterer is the critter that scuttles across your ceiling at 3 a.m. and spits poison in your open mouth while you snore. Low level, maximum nope. Pro tip: look up. No, further up. Yeah. There it fucking is. It's been watching you this whole time.",
    prevDescriptions: [
      'Everyone scream! The Scatterer is the little critter that runs across your ceiling at 3 a.m. and then spits in your mouth. Low level, big nuisance. Pro tip: look up. No, further up. Yeah. There it is.',
    ],
    prevNotes: [
      'Special: Wall Walker. Full text: GM Campaign Toolkit p. 138.',
      'Wall Walker: moves on walls and ceilings as easily as on the ground.\n\nFull text: GM Campaign Toolkit p. 138.',
    ],
    descriptionEs:
      "El Scatterer es ese bicho que corretea por tu techo a las 3 de la mañana y te escupe veneno en la boca abierta mientras roncas. Nivel bajo, máximo 'ni de coña'. Pro-Tip: mira hacia arriba. No, más arriba. Eso. Ahí está el puto bicho. Te ha estado mirando todo este tiempo.",
    prevDescriptionsEs: [
      "El Scatterer es ese bicho que corretea por tu techo a las 3 de la mañana y te escupe veneno en la boca abierta mientras roncas. Nivel bajo, máximo 'ni de coña'. Consejo pro: mira hacia arriba. No, más arriba. Eso. Ahí está el puto bicho. Te ha estado mirando todo este tiempo.",
    ],
  },
  {
    name: 'Hissing Scatterer',
    kind: 'mob',
    size: 'Small (2)',
    tags: 'Beastly',
    slots: '2',
    slotValue: '2',
    level: '2',
    surprise: '11+F',
    evade: '11+F',
    move: '20+S',
    dr: '2',
    stats: {
      str: {
        score: '4',
        mod: '+2',
      },
      int: {
        score: '1',
        mod: '+1',
      },
      con: {
        score: '4',
        mod: '+2',
      },
      dex: {
        score: '1',
        mod: '+1',
      },
      cha: {
        score: '1',
        mod: '+1',
      },
    },
    attacks: [
      {
        name: 'Bite',
        toHit: '12+F',
        damage: '1d6+2 Piercing',
        range: '5ft range',
        effect: 'Major Fail+: Taint',
      },
      {
        name: 'Leaping Kick',
        toHit: '11+F',
        damage: '1d6+2 Bludgeoning',
        range: '5ft range',
        effect: 'Special effect',
      },
    ],
    notes:
      'Leaper: may start a round up to 15ft from its Leaping Kick target and jump into range before attacking, instead of taking a Step.\nWall Walker: moves on walls and ceilings as easily as on the ground.\n\nFull text: GM Campaign Toolkit p. 139.',
    source: 'GM Campaign Toolkit p. 139',
    chapter: 'Floor 1 · GM Toolkit Threat Appendix (First Floor Mobs)',
    floor: 1,
    description:
      "Same ceiling-crawling roach, now with a flying dropkick, because I decided bugs needed MMA training. It'll launch off the wall from 15 feet and plant its feet in your face. Pro tip: 'just out of reach' is not the same as safe with this asshole. Stand further back, or better yet, stand behind someone you don't like.",
    prevDescriptions: [
      'Now in extra-hissy flavor! This Scatterer upgraded its ceiling-crawling with a flying dropkick, because I thought bugs needed more martial arts. Pro tip: 15ft is its launch pad, so standing just out of reach is not the same as being safe.',
    ],
    prevNotes: [
      'Special: Leaper; Wall Walker. Full text: GM Campaign Toolkit p. 139.',
      'Leaper: may start a round up to 15ft from its Leaping Kick target and jump into range before attacking, instead of taking a Step.\nWall Walker: moves on walls and ceilings as easily as on the ground.\n\nFull text: GM Campaign Toolkit p. 139.',
    ],
    descriptionEs:
      "La misma cucaracha trepatechos, ahora con patada voladora, porque decidí que los bichos necesitaban entrenamiento de MMA. Se lanzará desde la pared a 15 pies y te plantará los pies en la cara. Pro-Tip: con este cabrón, 'justo fuera de su alcance' no es lo mismo que a salvo. Ponte más atrás o, mejor aún, detrás de alguien que te caiga mal.",
    prevDescriptionsEs: [
      "La misma cucaracha trepatechos, ahora con patada voladora, porque decidí que los bichos necesitaban entrenamiento de MMA. Se lanzará desde la pared a 15 pies y te plantará los pies en la cara. Consejo pro: con este cabrón, 'justo fuera de su alcance' no es lo mismo que a salvo. Ponte más atrás o, mejor aún, detrás de alguien que te caiga mal.",
    ],
  },
  {
    name: 'Scatterer Brood Guardian',
    kind: 'mob',
    size: 'Small (2)',
    tags: 'Beastly',
    slots: '4',
    slotValue: '3',
    level: '4',
    surprise: '11+F',
    evade: '12+F',
    move: '30+S',
    dr: '2',
    stats: {
      str: {
        score: '6',
        mod: '+3',
      },
      int: {
        score: '1',
        mod: '+1',
      },
      con: {
        score: '6',
        mod: '+3',
      },
      dex: {
        score: '3',
        mod: '+2',
      },
      cha: {
        score: '1',
        mod: '+1',
      },
    },
    attacks: [
      {
        name: 'Bite',
        toHit: '13+F',
        damage: '1d8+3 Piercing',
        range: '5ft range',
        effect: 'Major Fail+: Taint',
      },
    ],
    notes:
      "Guardian: other Scatterer types next to it get a +3 Evade bonus (doesn't stack).\nWall Walker: moves on walls and ceilings as easily as on the ground.\nRiled Up: in the first round of combat, it adds its Stat Mod to damage twice.\n\nFull text: GM Campaign Toolkit p. 139.",
    source: 'GM Campaign Toolkit p. 139',
    chapter: 'Floor 1 · GM Toolkit Threat Appendix (First Floor Mobs)',
    floor: 1,
    description:
      "Mama bug is HERE and she is pissed you touched the babies. The Brood Guardian hits twice as hard in the first round and makes every other Scatterer next to her harder to hit. Pro tip: kill her first, then stomp the kids. Yes, that's cold. Yes, the viewers are eating it up with a spoon.",
    prevDescriptions: [
      'Mama bug is here and she is NOT happy about you touching her babies. The Brood Guardian hits hardest in round one and makes the rest of the swarm harder to hit just by standing next to them. Pro tip: kill her first, then clean up the kids. Sorry, kids.',
    ],
    prevNotes: [
      'Special: Guardian; Wall Walker; Riled Up. Full text: GM Campaign Toolkit p. 139.',
      "Guardian: other Scatterer types next to it get a +3 Evade bonus (doesn't stack).\nWall Walker: moves on walls and ceilings as easily as on the ground.\nRiled Up: in the first round of combat, it adds its Stat Mod to damage twice.\n\nFull text: GM Campaign Toolkit p. 139.",
    ],
    descriptionEs:
      'Mamá bicho ESTÁ AQUÍ y está cabreadísima porque has tocado a los bebés. La Brood Guardian pega el doble de fuerte en la primera ronda y hace que cualquier otro Scatterer a su lado sea más difícil de golpear. Pro-Tip: mátala a ella primero y luego pisotea a los críos. Sí, es frío. Sí, los espectadores se lo están comiendo con cuchara.',
    prevDescriptionsEs: [
      'Mamá bicho ESTÁ AQUÍ y está cabreadísima porque has tocado a los bebés. La Brood Guardian pega el doble de fuerte en la primera ronda y hace que cualquier otro Scatterer a su lado sea más difícil de golpear. Consejo pro: mátala a ella primero y luego pisotea a los críos. Sí, es frío. Sí, los espectadores se lo están comiendo con cuchara.',
    ],
  },
  {
    name: 'Kobold',
    kind: 'mob',
    size: 'Small (2)',
    tags: 'Humanoid',
    slots: '3',
    slotValue: '2',
    level: '3',
    surprise: '11+F',
    evade: '11+F',
    move: '20+S',
    dr: '3',
    stats: {
      str: {
        score: '6',
        mod: '+3',
      },
      int: {
        score: '1',
        mod: '+1',
      },
      con: {
        score: '3',
        mod: '+2',
      },
      dex: {
        score: '2',
        mod: '+1',
      },
      cha: {
        score: '2',
        mod: '+1',
      },
    },
    attacks: [
      {
        name: 'Spear',
        toHit: '13+F',
        damage: '1d8+3 Piercing',
        range: '10ft range',
        effect: '',
      },
      {
        name: 'Bite',
        toHit: '13+F',
        damage: '1d6+3 Piercing',
        range: '5ft range',
        effect: '',
      },
      {
        name: 'Yap',
        toHit: '11+F',
        damage: '1d4+1 Sonic',
        range: '30ft Burst radius',
        effect: '',
      },
    ],
    notes:
      'Pack Defense: adjacent Kobolds pair up; each pair = 1 free Attack, no Action cost. One pair per Kobold max (2–3 → 1 attack, 4–5 → 2, etc.).\n\nFull text: GM Campaign Toolkit p. 140.',
    source: 'GM Campaign Toolkit p. 140',
    chapter: 'Floor 2 · GM Toolkit Threat Appendix (Second Floor Mobs)',
    floor: 2,
    description:
      'Kobolds: small, yappy, and better at teamwork than your whole shitty party. Line them up and every adjacent pair gets a free spear poke. Pro tip: break up the formation. A Kobold on its own is just a sad lizard with a stick and a very high-pitched scream.',
    prevDescriptions: [
      'Kobolds: small, yappy, and way better at teamwork than your party. Line them up and the spear wall starts handing out free pokes. Pro tip: break up the formation. A lonely Kobold is just a sad lizard with a stick.',
    ],
    prevNotes: [
      'Special: Pack Defense. Full text: GM Campaign Toolkit p. 140.',
      'Pack Defense: adjacent Kobolds pair up; each pair = 1 free Attack, no Action cost. One pair per Kobold max (2–3 → 1 attack, 4–5 → 2, etc.).\n\nFull text: GM Campaign Toolkit p. 140.',
    ],
    descriptionEs:
      'Kobolds: pequeños, chillones y con más trabajo en equipo que todo tu puto grupo de mierda. Ponlos en fila y cada pareja adyacente se lleva un lanzazo gratis. Pro-Tip: rompe la formación. Un Kobold solo no es más que una lagartija triste con un palo y un chillido muy agudo.',
    prevDescriptionsEs: [
      'Kobolds: pequeños, chillones y con más trabajo en equipo que todo tu puto grupo de mierda. Ponlos en fila y cada pareja adyacente se lleva un lanzazo gratis. Consejo pro: rompe la formación. Un Kobold solo no es más que una lagartija triste con un palo y un chillido muy agudo.',
    ],
  },
  {
    name: 'Kobold Rider',
    kind: 'mob',
    size: 'Small (2)',
    tags: 'Humanoid',
    slots: '5',
    slotValue: '2',
    level: '5',
    surprise: '11+F',
    evade: '12+F',
    move: '20+S',
    dr: '3',
    stats: {
      str: {
        score: '10',
        mod: '+4',
      },
      int: {
        score: '1',
        mod: '+1',
      },
      con: {
        score: '3',
        mod: '+2',
      },
      dex: {
        score: '3',
        mod: '+2',
      },
      cha: {
        score: '2',
        mod: '+1',
      },
    },
    attacks: [
      {
        name: 'Lance',
        toHit: '14+F',
        damage: '2d12+4 Piercing',
        range: '10ft range, (only',
        effect: 'Special effect',
      },
      {
        name: 'Bite',
        toHit: '14+F',
        damage: '1d6+4 Piercing',
        range: '5ft range',
        effect: 'Major Fail+: Capnocytophaga',
      },
      {
        name: 'Crossbow',
        toHit: '12+F',
        damage: '2d8 Piercing',
        range: '50ft range',
        effect: '',
      },
    ],
    notes:
      "Dingo Rider: rides a Danger Dingo into battle. The Lance can only hit targets in the direction the mount is facing, and can't be used at all once dismounted.\n\nFull text: GM Campaign Toolkit p. 140.",
    source: 'GM Campaign Toolkit p. 140',
    chapter: 'Floor 2 · GM Toolkit Threat Appendix (Second Floor Mobs)',
    floor: 2,
    description:
      "The cavalry has arrived, and the horse is a rabid dingo! This Kobold has a lance way too big for its tiny arms, and it only points where the dog is facing. Pro tip: flank the little asshole or knock it out of the saddle, and that giant lance becomes the world's most expensive toothpick.",
    prevDescriptions: [
      'Cavalry has arrived, and the horse is a rabid dingo! The Kobold Rider couches a lance way too big for its tiny arms and aims wherever the dog points. Pro tip: flank it or knock it off its ride, and that giant toothpick turns into dead weight.',
    ],
    prevNotes: [
      'Special: Dingo Rider. Full text: GM Campaign Toolkit p. 140.',
      "Dingo Rider: rides a Danger Dingo into battle. The Lance can only hit targets in the direction the mount is facing, and can't be used at all once dismounted.\n\nFull text: GM Campaign Toolkit p. 140.",
    ],
    descriptionEs:
      '¡Ha llegado la caballería, y el caballo es un dingo rabioso! Este Kobold tiene una lanza demasiado grande para sus bracitos, y solo apunta hacia donde mira el perro. Pro-Tip: flanquea al cabroncete o tíralo de la silla, y esa lanza gigante se convierte en el palillo más caro del mundo.',
    prevDescriptionsEs: [
      '¡Ha llegado la caballería, y el caballo es un dingo rabioso! Este Kobold tiene una lanza demasiado grande para sus bracitos, y solo apunta hacia donde mira el perro. Consejo pro: flanquea al cabroncete o tíralo de la silla, y esa lanza gigante se convierte en el palillo más caro del mundo.',
    ],
  },
  {
    name: 'Rage Elemental',
    kind: 'mob',
    size: 'Colossal (7)',
    tags: 'Elemental',
    slots: '10',
    slotValue: '6',
    level: '93',
    surprise: '11+F',
    evade: '14+F',
    move: '60+S',
    dr: '13',
    stats: {
      str: {
        score: '136',
        mod: '+7',
      },
      int: {
        score: '1',
        mod: '+1',
      },
      con: {
        score: '66',
        mod: '+6',
      },
      dex: {
        score: '15',
        mod: '+4',
      },
      cha: {
        score: '66',
        mod: '+6',
      },
    },
    attacks: [
      {
        name: 'Claw',
        toHit: '17+F',
        damage: '5d8+7 Slashing',
        range: '10ft range',
        effect: 'Special effect',
      },
      {
        name: 'Roar',
        toHit: '15+F',
        damage: 'No damage',
        range: '20ft Burst radius',
        effect: 'On hit: Paralyzed',
      },
    ],
    notes:
      'Elemental: immune to non-magical physical damage. Elemental damage, enchanted objects, spells, explosives, and similar effects can still hurt it.\nReverse Gravity Spell: passive, 60ft range, 20ft Blast. Everything in the area falls the wrong way, taking 1d6 Bludgeoning per 10ft fallen. At the end of the round gravity returns and anything not secured falls again.\nReincarnation: keeps the soul of everything it kills. Each stored soul lets it revive once at full Health after being killed; it takes 1 minute to reform and is immune to all damage while doing so.\nSoul Reaper: it fades away for good after claiming 666 souls.\nRoar: any crawler hit gains the Paralyzed Debuff.\n\nFull text: GM Campaign Toolkit p. 141.',
    source: 'GM Campaign Toolkit p. 141',
    chapter: 'Floor 2 · GM Toolkit Threat Appendix (Second Floor Mobs)',
    floor: 2,
    description:
      "Level 93. Read that again, shithead. The Rage Elemental flips gravity so you fall upward, then down, then maybe up again, and a roar leaves you frozen stiff. Swords are useless, and it revives once for every soul it's harvested. Pro tip: run like hell. If you can't, bring spells and explosives and pray you're not its next extra life.",
    prevDescriptions: [
      "Level 93. Read that again. The Rage Elemental is pure fury that flips gravity, freezes you with a roar, and comes back to life once for every soul it collects. Swords do nothing. Pro tip: run. If you can't run, bring magic and explosives, and try not to become one of its extra lives.",
    ],
    prevNotes: [
      'Special: Elemental; Gravity Reversed; Reincarnation; Soul Reaper. Full text: GM Campaign Toolkit p. 141.',
      'Elemental: immune to non-magical physical damage. Elemental damage, enchanted objects, spells, explosives, and similar effects can still hurt it.\nReverse Gravity Spell: passive, 60ft range, 20ft Blast. Everything in the area falls the wrong way, taking 1d6 Bludgeoning per 10ft fallen. At the end of the round gravity returns and anything not secured falls again.\nReincarnation: keeps the soul of everything it kills. Each stored soul lets it revive once at full Health after being killed; it takes 1 minute to reform and is immune to all damage while doing so.\nSoul Reaper: it fades away for good after claiming 666 souls.\nRoar: any crawler hit gains the Paralyzed Debuff.\n\nFull text: GM Campaign Toolkit p. 141.',
    ],
    descriptionEs:
      'Nivel 93. Vuelve a leerlo, gilipollas. El Rage Elemental invierte la gravedad para que caigas hacia arriba, luego hacia abajo, luego quizá otra vez hacia arriba, y un rugido te deja congelado en el sitio. Las espadas no sirven de nada, y revive una vez por cada alma que ha cosechado. Pro-Tip: corre como alma que lleva el diablo. Si no puedes, trae hechizos y explosivos y reza para no ser su próxima vida extra.',
    prevDescriptionsEs: [
      'Nivel 93. Vuelve a leerlo, gilipollas. El Rage Elemental invierte la gravedad para que caigas hacia arriba, luego hacia abajo, luego quizá otra vez hacia arriba, y un rugido te deja congelado en el sitio. Las espadas no sirven de nada, y revive una vez por cada alma que ha cosechado. Consejo pro: corre como alma que lleva el diablo. Si no puedes, trae hechizos y explosivos y reza para no ser su próxima vida extra.',
    ],
  },
  {
    name: 'Troglodyte Basher (p. 142)',
    kind: 'mob',
    size: 'Medium (4)',
    tags: 'Humanoid',
    slots: '6',
    slotValue: '3',
    level: '6',
    surprise: '11+F',
    evade: '13+F',
    move: '20+S',
    dr: '2',
    stats: {
      str: {
        score: '7',
        mod: '+3',
      },
      int: {
        score: '1',
        mod: '+1',
      },
      con: {
        score: '7',
        mod: '+3',
      },
      dex: {
        score: '7',
        mod: '+3',
      },
      cha: {
        score: '1',
        mod: '+1',
      },
    },
    attacks: [
      {
        name: 'Bite',
        toHit: '13+F',
        damage: '1d6+3 Piercing',
        range: '5ft range',
        effect: '',
      },
      {
        name: 'Venom Spit',
        toHit: '12+F',
        damage: '1d6+2 Poison',
        range: '20ft range',
        effect: 'Major Fail+: Poisoned',
      },
    ],
    notes:
      'Slimed!: a crawler adjacent to it who scores an Amazing Success or better on an attack gains the Queasy Debuff.\n\nFull text: GM Campaign Toolkit p. 142.',
    source: 'GM Campaign Toolkit p. 142',
    chapter: 'Floor 2 · GM Toolkit Threat Appendix (Second Floor Mobs)',
    floor: 2,
    description:
      'Another Troglodyte Basher, this model skipping the club and going straight to the teeth. Same venomous spit, same slime coating, same breath like a dumpster behind a fish market. Pro tip: your best melee hits come with a complimentary bout of nausea. Keep a bucket handy and aim away from the camera.',
    prevDescriptions: [
      'Another Troglodyte Basher, this model trading the club for teeth. Same venomous spit, same revolting skin slime, same zero sense of personal hygiene. Pro tip: your best melee hits come with a free side of nausea. Keep a bucket nearby.',
    ],
    prevNotes: [
      'Special: Slimed!. Full text: GM Campaign Toolkit p. 142.',
      'Slimed!: a crawler adjacent to it who scores an Amazing Success or better on an attack gains the Queasy Debuff.\n\nFull text: GM Campaign Toolkit p. 142.',
    ],
    descriptionEs:
      'Otro Troglodyte Basher, este modelo pasa de la porra y va directo a los dientes. El mismo escupitajo venenoso, la misma capa de baba, el mismo aliento de contenedor detrás de una pescadería. Pro-Tip: tus mejores golpes cuerpo a cuerpo vienen con un ataque de náuseas de regalo. Ten un cubo a mano y apunta lejos de la cámara.',
    prevDescriptionsEs: [
      'Otro Troglodyte Basher, este modelo pasa de la porra y va directo a los dientes. El mismo escupitajo venenoso, la misma capa de baba, el mismo aliento de contenedor detrás de una pescadería. Consejo pro: tus mejores golpes cuerpo a cuerpo vienen con un ataque de náuseas de regalo. Ten un cubo a mano y apunta lejos de la cámara.',
    ],
  },
  {
    name: 'Troglodyte Pygmy',
    kind: 'mob',
    size: 'Petite (3)',
    tags: 'Mutated',
    slots: '2',
    slotValue: '1',
    level: '2',
    surprise: '12+F',
    evade: '12+F',
    move: '30+S',
    dr: '1',
    stats: {
      str: {
        score: '2',
        mod: '+1',
      },
      int: {
        score: '3',
        mod: '+2',
      },
      con: {
        score: '2',
        mod: '+1',
      },
      dex: {
        score: '3',
        mod: '+2',
      },
      cha: {
        score: '1',
        mod: '+1',
      },
    },
    attacks: [
      {
        name: 'Bite',
        toHit: '11+F',
        damage: '1d6+1 Piercing',
        range: '5ft range (see below)',
        effect: 'Major Fail+: Poisoned',
      },
    ],
    notes:
      'Dine and Dash: hunts in packs, taking turns to Move in, bite, then Step Away, wearing prey down with stacked venom instead of strength.\n\nFull text: GM Campaign Toolkit p. 142.',
    source: 'GM Campaign Toolkit p. 142',
    chapter: 'Floor 2 · GM Toolkit Threat Appendix (Second Floor Mobs)',
    floor: 2,
    description:
      "These bite-sized troglodytes run a dine-and-dash operation: dart in, chomp, skip out on the check. The pack takes turns, letting stacked venom do the real work while you swing at empty air. Pro tip: they win by attrition, so pin them down and don't let them hop in and out all day. Nothing's sadder than being nibbled to death.",
    prevDescriptions: [
      'Bite-sized troglodytes with a hit-and-run business model! They dart in, bite, and scoot off before you can swing back, letting the poison do the rest. Pro tip: back into a corner so they can only come at you one at a time.',
    ],
    prevNotes: [
      'Special: Dine and Dash. Full text: GM Campaign Toolkit p. 142.',
      'Dine and Dash: hunts in packs, taking turns to Move in, bite, then Step Away, wearing prey down with stacked venom instead of strength.\n\nFull text: GM Campaign Toolkit p. 142.',
    ],
    descriptionEs:
      'Estos trogloditas tamaño bocado se dedican al simpa: entran, muerden y se piran sin pagar la cuenta. La manada se va turnando y deja que el veneno acumulado haga el trabajo sucio mientras tú das mandobles al aire. Pro-Tip: ganan por desgaste, así que inmovilízalos y no les dejes entrar y salir en todo el día. No hay nada más triste que morir a mordisquitos.',
    prevDescriptionsEs: [
      'Estos trogloditas tamaño bocado se dedican al simpa: entran, muerden y se piran sin pagar la cuenta. La manada se va turnando y deja que el veneno acumulado haga el trabajo sucio mientras tú das mandobles al aire. Consejo pro: ganan por desgaste, así que inmovilízalos y no les dejes entrar y salir en todo el día. No hay nada más triste que morir a mordisquitos.',
    ],
  },
  {
    name: 'Troglodyte Virtuoso',
    kind: 'mob',
    size: 'Petite (3)',
    tags: 'Mutated',
    slots: '4',
    slotValue: '2',
    level: '4',
    surprise: '12+F',
    evade: '13+F',
    move: '25+S',
    dr: '1',
    stats: {
      str: {
        score: '3',
        mod: '+2',
      },
      int: {
        score: '3',
        mod: '+2',
      },
      con: {
        score: '3',
        mod: '+2',
      },
      dex: {
        score: '6',
        mod: '+3',
      },
      cha: {
        score: '2',
        mod: '+1',
      },
    },
    attacks: [
      {
        name: 'Tongue Whip',
        toHit: '13+F',
        damage: '1d6+2 Bludgeoning',
        range: '15ft range',
        effect: 'Major Fail+: Held',
      },
      {
        name: 'Bite',
        toHit: '12+F',
        damage: '1d6+2 Piercing',
        range: '5ft range',
        effect: 'Major Fail+: Poisoned',
      },
    ],
    notes:
      "Got Your Tongue: when targeted by Tongue Whip, the crawler may instead make a Wrasslin' attack on the tongue as an Interrupt Action; any success also counts as an Evade Success.\nTongue of War: while its tongue is Held or it holds a crawler, it may spend an Action to reel in. Target makes a Str Stat Check: Success, the virtuoso is dragged adjacent to the target; Fail, the target is dragged adjacent to it. The dragged party takes 1d4+F Bludgeoning per 5ft moved.\n\nFull text: GM Campaign Toolkit p. 142.",
    source: 'GM Campaign Toolkit p. 142',
    chapter: 'Floor 2 · GM Toolkit Threat Appendix (Second Floor Mobs)',
    floor: 2,
    description:
      "Three feet of mutant and fifteen of tongue. This little shit will lash your face from across the room, then gnaw your ankles like a teething puppy with rabies. Pro tip: grab the tongue and yank. Somebody's getting dragged across the floor, and I genuinely don't care who, as long as it leaves a smear.",
    prevDescriptions: [
      'Tiny body, 15-foot tongue, zero shame. This little freak treats your face like a bullwhip target and your ankles like a snack. Pro tip: grab the tongue and start a tug-of-war. Loser gets dragged across the floor, and the winner gets my undying respect for about four seconds.',
    ],
    prevNotes: [
      'Special: Got Your Tongue; Tongue of War. Full text: GM Campaign Toolkit p. 142.',
      "Got Your Tongue: when targeted by Tongue Whip, the crawler may instead make a Wrasslin' attack on the tongue as an Interrupt Action; any success also counts as an Evade Success.\nTongue of War: while its tongue is Held or it holds a crawler, it may spend an Action to reel in. Target makes a Str Stat Check: Success, the virtuoso is dragged adjacent to the target; Fail, the target is dragged adjacent to it. The dragged party takes 1d4+F Bludgeoning per 5ft moved.\n\nFull text: GM Campaign Toolkit p. 142.",
    ],
    descriptionEs:
      'Un metro de mutante y cinco de lengua. Este cabroncete te cruza la cara a latigazos desde la otra punta de la sala y luego te roe los tobillos como un cachorro echando los dientes y con rabia. Pro-Tip: agarra la lengua y tira. Alguien va a acabar arrastrado por el suelo y, sinceramente, me da igual quién, mientras deje un buen reguero.',
    prevDescriptionsEs: [
      'Un metro de mutante y cinco de lengua. Este cabroncete te cruza la cara a latigazos desde la otra punta de la sala y luego te roe los tobillos como un cachorro echando los dientes y con rabia. Consejo pro: agarra la lengua y tira. Alguien va a acabar arrastrado por el suelo y, sinceramente, me da igual quién, mientras deje un buen reguero.',
    ],
  },
  {
    name: 'Ball of Swine',
    kind: 'boss',
    size: 'Colossal (7)',
    tags: 'Borough Boss, Amalgamation',
    slots: '8',
    slotValue: '6',
    level: '15',
    surprise: '12+F',
    evade: '14+F',
    move: '30+S',
    dr: '1',
    stats: {
      str: {
        score: '20',
        mod: '+5',
      },
      int: {
        score: '4',
        mod: '+2',
      },
      con: {
        score: '50',
        mod: '+6',
      },
      dex: {
        score: '10',
        mod: '+4',
      },
      cha: {
        score: '1',
        mod: '+1',
      },
    },
    attacks: [
      {
        name: 'Assimilated',
        toHit: '14+F',
        damage: '3d6+5 Bludgeoning',
        range: '5ft range',
        effect: 'Major Fail+: Held',
      },
      {
        name: 'Bowled Over',
        toHit: '15+F',
        damage: '2d10+5 Bludgeoning',
        range: '40ft Line',
        effect: 'Major Fail+: Take Down',
      },
    ],
    notes:
      'Amalgamation: a 15ft ball of 30 Tuskling Knights (Lvl 4) and 30 Tuskling Courtesans (Lvl 5). Below half Health it comes apart; all 60 Tusklings become separate Mobs and must all die to defeat the Boss. They are dazed and never fight back; each has 0 DR and 2 HB slots of 2.\nConstant Momentum: may reverse or change direction instantly with no loss of speed.\nSnagged: stop it by shrinking its rolling room; needs three successful checks by three different crawlers with fitting skills (GM calls). While Snagged, attacks against it have Advantage.\nAssimilated: a Held crawler is stuck inside the rolling ball.\n\nFull text: GM Campaign Toolkit p. 142.',
    source: 'GM Campaign Toolkit p. 142',
    chapter: 'Floor 1 · GM Toolkit Threat Appendix (First Floor Bosses)',
    floor: 1,
    description:
      "Sixty pig-people fused into a rolling meatball of screaming bacon. It flattens everything in a straight line and turns on a fucking dime. Pro tip: box it in, get it stuck, then beat it until it bursts. What spills out is sixty dazed little oinkers who won't fight back. Yes, you have to kill all of them. Yes, we're filming.",
    prevDescriptions: [
      'Sixty pig-people, one giant rolling ball, and absolutely no personal space. It turns on a dime and flattens anything in a straight line. Pro tip: box it in, then pop it like a piñata. What falls out is squishy, confused, and extremely killable. The ratings for this one are obscene.',
    ],
    prevNotes: [
      'Special: Amalgamation; Constant Momentum; Snagged. Full text: GM Campaign Toolkit p. 142.',
      'Amalgamation: a 15ft ball of 30 Tuskling Knights (Lvl 4) and 30 Tuskling Courtesans (Lvl 5). Below half Health it comes apart; all 60 Tusklings become separate Mobs and must all die to defeat the Boss. They are dazed and never fight back; each has 0 DR and 2 HB slots of 2.\nConstant Momentum: may reverse or change direction instantly with no loss of speed.\nSnagged: stop it by shrinking its rolling room; needs three successful checks by three different crawlers with fitting skills (GM calls). While Snagged, attacks against it have Advantage.\nAssimilated: a Held crawler is stuck inside the rolling ball.\n\nFull text: GM Campaign Toolkit p. 142.',
    ],
    descriptionEs:
      'Sesenta cerdohumanos fusionados en una albóndiga rodante de beicon que chilla. Aplasta todo lo que pilla en línea recta y gira sobre una puta baldosa. Pro-Tip: acorrálalo, haz que se atasque y dale hasta que reviente. Lo que sale son sesenta cerditos aturdidos que no se van a defender. Sí, tienes que matarlos a todos. Sí, estamos grabando.',
    prevDescriptionsEs: [
      'Sesenta cerdohumanos fusionados en una albóndiga rodante de beicon que chilla. Aplasta todo lo que pilla en línea recta y gira sobre una puta baldosa. Consejo pro: acorrálalo, haz que se atasque y dale hasta que reviente. Lo que sale son sesenta cerditos aturdidos que no se van a defender. Sí, tienes que matarlos a todos. Sí, estamos grabando.',
    ],
  },
  {
    name: 'The Hoarder',
    kind: 'boss',
    size: 'Large (5)',
    tags: 'Neighborhood Boss, Humanoid',
    slots: '11',
    slotValue: '4',
    level: '7',
    surprise: '13+F',
    evade: '13+F',
    move: '20+S',
    dr: '2',
    stats: {
      str: {
        score: '12',
        mod: '+4',
      },
      int: {
        score: '8',
        mod: '+3',
      },
      con: {
        score: '11',
        mod: '+4',
      },
      dex: {
        score: '9',
        mod: '+3',
      },
      cha: {
        score: '6',
        mod: '+3',
      },
    },
    attacks: [
      {
        name: 'Punch',
        toHit: '14+F',
        damage: '2d6+4 Bludgeoning',
        range: '10ft range',
        effect: '',
      },
      {
        name: 'Drop and Roll',
        toHit: '13+F',
        damage: '1d8+4 Bludgeoning',
        range: '20ft Line',
        effect: 'Special effect',
      },
      {
        name: 'Throw Trash',
        toHit: '13+F',
        damage: '1d6+3',
        range: '60ft range',
        effect: '',
      },
    ],
    notes:
      "Infested: at the start of every round, a Weak group of Hissing Scatterers or Scatterer Brood Guardians crawls out of her mouth. They share her space, don't act until next round, and get +4 Evade in the round they appear. Kill every one that emerged before the round ends and the Hoarder chokes to death.\nDrop and Roll: includes a free 20ft move.\n\nFull text: GM Campaign Toolkit p. 143.",
    source: 'GM Campaign Toolkit p. 143',
    chapter: 'Floor 1 · GM Toolkit Threat Appendix (First Floor Bosses)',
    floor: 1,
    description:
      "Hoarding is a disease, and hers crawls out of her mouth every round. She punches, she rolls, she throws garbage with a pitcher's arm. Pro tip: squash every fresh bug that climbs out before the round ends and she chokes on her own roommates. Sponsored by Ex-Terminate: when your problem is a person.",
    prevDescriptions: [
      "Say hello to the lady who never threw anything away, including the bugs. Especially the bugs. She punches, she rolls, she chucks garbage from across the room, and her mouth is basically a clown car of vermin. Pro tip: clear the fresh arrivals fast and she'll gag on the rest. Cleanliness saves lives!",
    ],
    prevNotes: [
      'Special: Infested. Full text: GM Campaign Toolkit p. 143.',
      "Infested: at the start of every round, a Weak group of Hissing Scatterers or Scatterer Brood Guardians crawls out of her mouth. They share her space, don't act until next round, and get +4 Evade in the round they appear. Kill every one that emerged before the round ends and the Hoarder chokes to death.\nDrop and Roll: includes a free 20ft move.\n\nFull text: GM Campaign Toolkit p. 143.",
    ],
    descriptionEs:
      'El síndrome de Diógenes es una enfermedad, y el suyo le sale reptando por la boca cada ronda. Pega, rueda y lanza basura con brazo de lanzador de béisbol. Pro-Tip: aplasta cada bicho nuevo que salga antes de que acabe la ronda y acabará atragantándose con sus propios compañeros de piso. Patrocinado por Ex-Terminio: para cuando el problema es una persona.',
    prevDescriptionsEs: [
      'El síndrome de Diógenes es una enfermedad, y el suyo le sale reptando por la boca cada ronda. Pega, rueda y lanza basura con brazo de lanzador de béisbol. Consejo pro: aplasta cada bicho nuevo que salga antes de que acabe la ronda y acabará atragantándose con sus propios compañeros de piso. Patrocinado por Ex-Terminio: para cuando el problema es una persona.',
    ],
  },
  {
    name: 'Prosperity Prophet',
    kind: 'boss',
    size: 'Medium (4)',
    tags: 'City Boss, Undead',
    slots: '10',
    slotValue: '5',
    level: '23',
    surprise: '16+F',
    evade: '15+F',
    move: '20+S',
    dr: '1',
    stats: {
      str: {
        score: '20',
        mod: '+5',
      },
      int: {
        score: '55',
        mod: '+6',
      },
      con: {
        score: '20',
        mod: '+5',
      },
      dex: {
        score: '20',
        mod: '+5',
      },
      cha: {
        score: '25',
        mod: '+5',
      },
    },
    attacks: [
      {
        name: 'Bite',
        toHit: '15+F',
        damage: '3d10+5 Necrotic',
        range: '5ft range',
        effect: 'Major Fail+: Drain Blood',
      },
      {
        name: 'Claw',
        toHit: '15+F',
        damage: '3d12+5 Necrotic',
        range: '5ft range',
        effect: '',
      },
      {
        name: 'Sleep Spell',
        toHit: '16+F',
        damage: 'No damage',
        range: '50ft range, 20ft',
        effect: 'Unconscious',
      },
    ],
    notes:
      "Drain Blood: Bite's Debuff deals 1d8+F Necrotic at end of each round and heals the Prophet 1 HB slot, until combat ends. A crawler killed by it makes a Con Stat Check vs 15+F or rises as his Undead Minion.\nSleep Spell: every crawler in the 20ft area makes a free Con Stat Check vs 16+F or gains Unconscious (prone, no actions; wakes when damaged).\nFlight: flies and hovers as if on the ground.\nMoney Grubbing: for every 100 gold thrown at him (costs the thrower an Action), he loses one Action.\nUndead Minions: a Moderate group waits in the chamber; use Pack Rat stats (p. 31) with Necrotic damage.\n\nFull text: GM Campaign Toolkit p. 144.",
    source: 'GM Campaign Toolkit p. 144',
    chapter: 'Floor 1 · GM Toolkit Threat Appendix (First Floor Bosses)',
    floor: 1,
    description:
      "Hallelujah, motherfuckers. This flying undead prosperity grifter puts you to sleep, drinks you like a juice box, and turns your corpse into a parishioner. Pro tip: he'd sell his own coffin for pocket change. Chuck gold at him and watch the Almighty Dollar cost him actions. Faith is free. Salvation is 100 gold a throw.",
    prevDescriptions: [
      "A flying undead televangelist who wants your blood and your wallet, in that order. He'll put you to sleep, suck you dry, and recruit you into his congregation. Pro tip: he cannot resist a tithe. Throw gold and watch the holiest man on Floor 2 scramble on his knees.",
    ],
    prevNotes: [
      'Special: Drain Blood; Flight; Money Grubbing; Undead Minions. Full text: GM Campaign Toolkit p. 144.',
      "Drain Blood: Bite's Debuff deals 1d8+F Necrotic at end of each round and heals the Prophet 1 HB slot, until combat ends. A crawler killed by it makes a Con Stat Check vs 15+F or rises as his Undead Minion.\nSleep Spell: every crawler in the 20ft area makes a free Con Stat Check vs 16+F or gains Unconscious (prone, no actions; wakes when damaged).\nFlight: flies and hovers as if on the ground.\nMoney Grubbing: for every 100 gold thrown at him (costs the thrower an Action), he loses one Action.\nUndead Minions: a Moderate group waits in the chamber; use Pack Rat stats (p. 31) with Necrotic damage.\n\nFull text: GM Campaign Toolkit p. 144.",
    ],
    descriptionEs:
      'Aleluya, hijos de puta. Este estafador no muerto y volador del evangelio de la prosperidad te duerme, te sorbe como un zumo de brik y convierte tu cadáver en feligrés. Pro-Tip: vendería su propio ataúd por cuatro perras. Tírale oro y verás cómo el Todopoderoso Dólar le cuesta Acciones. La fe es gratis. La salvación, 100 de oro por lanzamiento.',
    prevDescriptionsEs: [
      'Aleluya, hijos de puta. Este estafador no muerto y volador del evangelio de la prosperidad te duerme, te sorbe como un zumo de brik y convierte tu cadáver en feligrés. Consejo pro: vendería su propio ataúd por cuatro perras. Tírale oro y verás cómo el Todopoderoso Dólar le cuesta Acciones. La fe es gratis. La salvación, 100 de oro por lanzamiento.',
    ],
  },
  {
    name: 'Beloved Mimic',
    kind: 'boss',
    size: 'Colossal (7)',
    tags: 'City Boss, Aberration',
    slots: '11',
    slotValue: '7',
    level: '25',
    surprise: '15+F',
    evade: '13+F',
    move: '5',
    dr: '2',
    stats: {
      str: {
        score: '20',
        mod: '+5',
      },
      int: {
        score: '20',
        mod: '+5',
      },
      con: {
        score: '100',
        mod: '+7',
      },
      dex: {
        score: '9',
        mod: '+3',
      },
      cha: {
        score: '1',
        mod: '+1',
      },
    },
    attacks: [
      {
        name: 'Bite',
        toHit: '15+F',
        damage: '3d12+5 Piercing',
        range: '15ft range',
        effect: 'Swallowed',
      },
      {
        name: 'Heartstrings',
        toHit: '15+F',
        damage: 'No damage',
        range: '100ft range, 20ft',
        effect: 'Mesmerized',
      },
      {
        name: 'Psionic Strike',
        toHit: '15+F',
        damage: '3d10+5 Psychic',
        range: '5ft range',
        effect: 'Major Fail+: Mental Scarring',
      },
    ],
    notes:
      "Swallowed: Bite not Evaded → crawler is swallowed. Inside: 1d8+F Acid each round's end; attacks at Disadvantage, but Mimic gets no DR vs them and Slashing is ×2. Freed (everyone) when any attack on the Mimic hits Amazing Success+, or on its death.\nHeartstrings: everyone in the 20ft zone rolls a free Cha Stat Check vs 15+F; fail → Mesmerized.\nMesmerized: sees the Mimic as their most-loved person; can't attack it; 10ft Step must go toward it. Whenever damaged, may roll Int Stat Check vs 15+F to end it.\nPsionic Strike: Mental Scarring = Int Mod −1 for the combat.\n\nFull text: GM Campaign Toolkit p. 145.",
    source: 'GM Campaign Toolkit p. 145',
    chapter: 'Floor 2 · GM Toolkit Threat Appendix (Second Floor Bosses)',
    floor: 2,
    description:
      "Colossal, psychic, and wearing your dead grandma's face. Aww, go give Nana a hug. Right into the teeth. Pro tip: once you're swallowed and the stomach acid starts on your eyebrows, stab outward. Its guts have zero armor and slashing counts double. Nothing says family reunion like carving your way out of one.",
    prevDescriptions: [
      "It's colossal, it's hungry, and it's wearing the face of whoever you love most. Aww. Walk right into its mouth, sweetie, Mommy's waiting. Pro tip: once you're inside, bring a blade. Its insides have no armor at all, and a good slash from the stomach makes great television.",
    ],
    prevNotes: [
      'Special: Mesmerized; Swallowed. Full text: GM Campaign Toolkit p. 145.',
      "Swallowed: Bite not Evaded → crawler is swallowed. Inside: 1d8+F Acid each round's end; attacks at Disadvantage, but Mimic gets no DR vs them and Slashing is ×2. Freed (everyone) when any attack on the Mimic hits Amazing Success+, or on its death.\nHeartstrings: everyone in the 20ft zone rolls a free Cha Stat Check vs 15+F; fail → Mesmerized.\nMesmerized: sees the Mimic as their most-loved person; can't attack it; 10ft Step must go toward it. Whenever damaged, may roll Int Stat Check vs 15+F to end it.\nPsionic Strike: Mental Scarring = Int Mod −1 for the combat.\n\nFull text: GM Campaign Toolkit p. 145.",
    ],
    descriptionEs:
      'Colosal, psíquico y con la cara de tu abuela muerta. Oooh, ve a darle un abrazo a la yaya. Directo a los dientes. Pro-Tip: cuando te haya tragado y el ácido gástrico empiece con tus cejas, apuñala hacia fuera. Sus tripas no tienen ni pizca de armadura y el daño cortante cuenta doble. No hay reunión familiar como abrirte paso a cuchilladas para salir de una.',
    prevDescriptionsEs: [
      'Colosal, psíquico y con la cara de tu abuela muerta. Oooh, ve a darle un abrazo a la yaya. Directo a los dientes. Consejo pro: cuando te haya tragado y el ácido gástrico empiece con tus cejas, apuñala hacia fuera. Sus tripas no tienen ni pizca de armadura y el daño cortante cuenta doble. No hay reunión familiar como abrirte paso a cuchilladas para salir de una.',
    ],
  },
  {
    name: 'The Juicer',
    kind: 'boss',
    size: 'Medium (4)',
    tags: 'Neighborhood Boss, Humanoid',
    slots: '12',
    slotValue: '4',
    level: '9',
    surprise: '12+F',
    evade: '11+F',
    move: '20+S',
    dr: '3',
    stats: {
      str: {
        score: '25',
        mod: '+5',
      },
      int: {
        score: '5',
        mod: '+2',
      },
      con: {
        score: '15',
        mod: '+4',
      },
      dex: {
        score: '1',
        mod: '+1',
      },
      cha: {
        score: '6',
        mod: '+3',
      },
    },
    attacks: [
      {
        name: 'Choke',
        toHit: '15+F',
        damage: '2d10+5 Bludgeoning',
        range: '5ft range',
        effect: '',
      },
      {
        name: 'Fiery Weight',
        toHit: '10+F',
        damage: '1d8+5 Bludgeoning',
        range: '50ft range',
        effect: 'Special effect',
      },
    ],
    notes:
      'Feel the Burn: crawler gets Evade Success vs Fiery Weight → it flies on, strikes the closest wall/object behind them and blows up: 1d8+F Fire to all within 10ft of that point.\nGet Your Blood Pumping: DR −2 vs edged weapons. Optional called shot at Disadvantage on the veins; hit → Blood Trail.\n\nFull text: GM Campaign Toolkit p. 147.',
    source: 'GM Campaign Toolkit p. 147',
    chapter: 'Floor 2 · GM Toolkit Threat Appendix (Second Floor Bosses)',
    floor: 2,
    description:
      'Roid rage with a gym membership and a body count. The Juicer chokes you out, then hurls barbell plates so hard they explode, so dodging just means the asshole behind you eats the blast. Pro tip: see those veins bulging like garden hoses? Stick a blade in one. He bleeds like a burst protein shake.',
    prevDescriptions: [
      'Leg day, arm day, murder day. This gym rat throws barbell plates so hard they burst into flames, and dodging only means someone behind you eats the explosion. Pro tip: those veins look ready to pop. Bring something sharp and help him with his cardio.',
    ],
    prevNotes: [
      'Special: Feel the Burn; Get Your Blood Pumping. Full text: GM Campaign Toolkit p. 147.',
      'Feel the Burn: crawler gets Evade Success vs Fiery Weight → it flies on, strikes the closest wall/object behind them and blows up: 1d8+F Fire to all within 10ft of that point.\nGet Your Blood Pumping: DR −2 vs edged weapons. Optional called shot at Disadvantage on the veins; hit → Blood Trail.\n\nFull text: GM Campaign Toolkit p. 147.',
    ],
    descriptionEs:
      'Rabia de esteroides con carné de gimnasio y lista de muertos. The Juicer te estrangula y luego lanza discos de pesas con tanta fuerza que explotan, así que esquivar solo significa que el gilipollas de detrás se come la explosión. Pro-Tip: ¿ves esas venas hinchadas como mangueras de jardín? Clávale una hoja en una. Sangra como un batido de proteínas reventado.',
    prevDescriptionsEs: [
      'Rabia de esteroides con carné de gimnasio y lista de muertos. The Juicer te estrangula y luego lanza discos de pesas con tanta fuerza que explotan, así que esquivar solo significa que el gilipollas de detrás se come la explosión. Consejo pro: ¿ves esas venas hinchadas como mangueras de jardín? Clávale una hoja en una. Sangra como un batido de proteínas reventado.',
    ],
  },
  {
    name: 'Rakish Werehound Shocker',
    kind: 'boss',
    size: 'Medium (4)',
    tags: 'Borough Boss, Humanoid',
    slots: '9',
    slotValue: '5',
    level: '19',
    surprise: '15+F',
    evade: '15+F',
    move: '30+S',
    dr: '2',
    stats: {
      str: {
        score: '20',
        mod: '+5',
      },
      int: {
        score: '20',
        mod: '+5',
      },
      con: {
        score: '20',
        mod: '+5',
      },
      dex: {
        score: '20',
        mod: '+5',
      },
      cha: {
        score: '21',
        mod: '+5',
      },
    },
    attacks: [
      {
        name: 'Bite',
        toHit: '15+F',
        damage: '3d8+5 Piercing',
        range: '5ft range',
        effect: 'Major Fail+: Lycanthropy, The, Dying',
      },
      {
        name: 'Claw',
        toHit: '15+F',
        damage: '3d10+5 Slashing',
        range: '5ft range',
        effect: 'Major Fail+: Blood Trail',
      },
      {
        name: 'Headbutt',
        toHit: '15+F',
        damage: '3d6+5 Bludgeoning',
        range: '5ft range',
        effect: 'On hit: Charmed',
      },
      {
        name: 'Lightning Bolt Spell',
        toHit: '15+F',
        damage: '2d10+5 Electric',
        range: '30ft Line',
        effect: 'Major Fail+: Shocked',
      },
    ],
    notes:
      'Savagely Sexy: doubles his Str Mod on damage against cats, royalty, and women aged 40+.\nSilver Weakness: silver weapons deal x2 damage, ignore his DR, and apply The Taint.\nLycanthropy (Secret, Bite): the crawler becomes a Werehound the next night. Removed if the crawler gains Dying.\nHeadbutt: any crawler hit makes a Cha Stat Check vs 15+F or gains Charmed, spending their next Action using a Health Potion on the Boss.\n\nFull text: GM Campaign Toolkit p. 147.',
    source: 'GM Campaign Toolkit p. 147',
    chapter: 'Floor 2 · GM Toolkit Threat Appendix (Second Floor Bosses)',
    floor: 2,
    description:
      "Great hair, greater ego, and a very specific type: cats, royalty, and anyone old enough to remember dial-up. He bites, claws, and headbutts you into feeding him your own Health Potions, you absolute sucker. Pro tip: silver hurts him like a bad review. And if he nips you, maybe cancel tomorrow night's plans. Permanently.",
    prevDescriptions: [
      "Perfect hair, perfect teeth, lightning in his paws, and a type. He bites, he claws, he headbutts you into healing him, and then he zaps you for fun. Pro tip: silver. Lots of silver. And if he nips you, maybe don't make plans for tomorrow night.",
    ],
    prevNotes: [
      'Special: Savagely Sexy; Silver Weakness. Full text: GM Campaign Toolkit p. 147.',
      'Savagely Sexy: doubles his Str Mod on damage against cats, royalty, and women aged 40+.\nSilver Weakness: silver weapons deal x2 damage, ignore his DR, and apply The Taint.\nLycanthropy (Secret, Bite): the crawler becomes a Werehound the next night. Removed if the crawler gains Dying.\nHeadbutt: any crawler hit makes a Cha Stat Check vs 15+F or gains Charmed, spending their next Action using a Health Potion on the Boss.\n\nFull text: GM Campaign Toolkit p. 147.',
    ],
    descriptionEs:
      'Pelazo, egazo y unos gustos muy concretos: gatos, realeza y cualquiera con edad para acordarse del módem de 56k. Muerde, araña y te da cabezazos hasta que acabas dándole de comer tus propias Pociones de Salud, pedazo de pardillo. Pro-Tip: la plata le duele como una mala reseña. Y si te da un mordisquito, quizá deberías cancelar tus planes de mañana por la noche. Para siempre.',
    prevDescriptionsEs: [
      'Pelazo, egazo y unos gustos muy concretos: gatos, realeza y cualquiera con edad para acordarse del módem de 56k. Muerde, araña y te da cabezazos hasta que acabas dándole de comer tus propias Pociones de Salud, pedazo de pardillo. Consejo pro: la plata le duele como una mala reseña. Y si te da un mordisquito, quizá deberías cancelar tus planes de mañana por la noche. Para siempre.',
    ],
  },
  {
    name: 'Ralph the Frenzied Gerbil',
    kind: 'boss',
    size: 'Tiny (1)',
    tags: 'Neighborhood Boss, Beastly',
    slots: '12',
    slotValue: '3',
    level: '11',
    surprise: '13+F',
    evade: '15+F',
    move: '30+S',
    dr: '2',
    stats: {
      str: {
        score: '14',
        mod: '+4',
      },
      int: {
        score: '7',
        mod: '+3',
      },
      con: {
        score: '6',
        mod: '+3',
      },
      dex: {
        score: '20',
        mod: '+5',
      },
      cha: {
        score: '11',
        mod: '+4',
      },
    },
    attacks: [
      {
        name: 'Ravening Jaw',
        toHit: '14+F',
        damage: '3d6+4 Piercing',
        range: '5ft range',
        effect: 'Major Fail+: Rat Bite Fever',
      },
      {
        name: 'Scratch',
        toHit: '14+F',
        damage: '2d8+5 Slashing',
        range: '5ft range',
        effect: '',
      },
      {
        name: 'Squeal',
        toHit: '13+F',
        damage: '2d4+3 Sonic',
        range: '60ft range',
        effect: 'Major Fail+: Staggered',
      },
    ],
    notes:
      "Cuteness Appeal: combat start → each crawler with line of sight rolls Int or Cha Stat Check vs 14+F; fail → round-1 attacks at Disadvantage.\nFrenzied: 20ft Step (not 10ft).\nHatred of Humans: picks human targets first; +5 damage vs humans on every attack.\nStill a Tiny Gerbil: eaten by a Dingo → next round's start, spends 2 actions killing it and escaping; all attacks on him that round have Advantage.\nRat Bite Fever: 1d6+F Poison each round's end, lasts through combat.\n\nFull text: GM Campaign Toolkit p. 148.",
    source: 'GM Campaign Toolkit p. 148',
    chapter: 'Floor 2 · GM Toolkit Threat Appendix (Second Floor Bosses)',
    floor: 2,
    description:
      "Look at his widdle face! Now look at your spleen on the floor. Ralph is tiny, twice as fast as you, and hates humans with the fury of a thousand shitty pet-store cages. Pro tip: if you're human, you're his favorite snack. Hide behind something that eats rodents and let nature do what nature does.",
    prevDescriptions: [
      "Look at his little face! Now look at your little intestines on the floor. Ralph is tiny, fast, adorable, and has a deeply personal grudge against humanity. Pro tip: if you're human, stand behind the cat. If you're the cat, enjoy the one fight on this floor where you're the bigger animal.",
    ],
    prevNotes: [
      'Special: Cuteness Appeal; Frenzied; Hatred of Humans; Still a Tiny Gerbil. Full text: GM Campaign Toolkit p. 148.',
      "Cuteness Appeal: combat start → each crawler with line of sight rolls Int or Cha Stat Check vs 14+F; fail → round-1 attacks at Disadvantage.\nFrenzied: 20ft Step (not 10ft).\nHatred of Humans: picks human targets first; +5 damage vs humans on every attack.\nStill a Tiny Gerbil: eaten by a Dingo → next round's start, spends 2 actions killing it and escaping; all attacks on him that round have Advantage.\nRat Bite Fever: 1d6+F Poison each round's end, lasts through combat.\n\nFull text: GM Campaign Toolkit p. 148.",
    ],
    descriptionEs:
      '¡Mira qué carita más monina! Ahora mira tu bazo en el suelo. Ralph es diminuto, el doble de rápido que tú y odia a los humanos con la furia de mil jaulas de mierda de tienda de mascotas. Pro-Tip: si eres humano, eres su tentempié favorito. Escóndete detrás de algo que coma roedores y deja que la naturaleza haga lo suyo.',
    prevDescriptionsEs: [
      '¡Mira qué carita más monina! Ahora mira tu bazo en el suelo. Ralph es diminuto, el doble de rápido que tú y odia a los humanos con la furia de mil jaulas de mierda de tienda de mascotas. Consejo pro: si eres humano, eres su tentempié favorito. Escóndete detrás de algo que coma roedores y deja que la naturaleza haga lo suyo.',
    ],
  },
  {
    name: 'Brandon (Floor 1)',
    kind: 'crawler',
    size: 'Medium (4)',
    tags: 'Human',
    slots: '10',
    slotValue: '2',
    level: '1',
    surprise: '11+F',
    evade: '12+F',
    move: '20',
    dr: '0',
    stats: {
      str: {
        score: '6',
        mod: '+3',
      },
      int: {
        score: '2',
        mod: '+1',
      },
      con: {
        score: '5',
        mod: '+2',
      },
      dex: {
        score: '4',
        mod: '+2',
      },
      cha: {
        score: '3',
        mod: '+2',
      },
    },
    attacks: [
      {
        name: 'Maul',
        toHit: '13+F',
        damage: '1d10+3 Bludgeoning',
        range: '',
        effect: '',
      },
      {
        name: 'Unarmed Combat',
        toHit: '13+F',
        damage: '1d4+3 Bludgeoning',
        range: '',
        effect: '',
      },
    ],
    notes:
      'Key Skills: Maul 3, Unarmed Combat 3, Catcher 2, Repair 3, Engineering 3, Climbing 1, Drive 1, Intimidate 1, Fabricate 2, Lockpicking 1. Ready-to-play crawler from the Par for the Course pre-gens.',
    source: 'Par for the Course pre-gens',
    chapter: 'Floor 1 · Pre-generated crawlers',
    floor: 1,
    description:
      "Brandon: big maul, big hands, and the vibe of a contractor who'll take your deposit and ghost you. Level 1 and swinging like he's getting paid by the skull. Pro tip: Repair and Engineering at 3 mean he can knock up a barricade while everyone else shits themselves. Put him near something broken. Like your party.",
    prevDescriptions: [
      "Brandon the builder: big maul, big hands, and the soul of a guy who fixes your deck and then judges it. Level 1 and swinging like he's paid by the hour. Pro tip: keep him near anything broken. Repair and Engineering at 3 means he'll build you a barricade while the rest of you scream.",
    ],
    prevNotes: [
      'Key Skills: Maul 3, Unarmed Combat 3, Catcher 2, Repair 3, Engineering 3, Climbing 1, Drive 1, Intimidate 1, Fabricate 2, Lockpicking 1. Ready-to-play crawler from the Par for the Course pre-gens.',
    ],
    descriptionEs:
      'Brandon: mazo grande, manos grandes y el rollo de un albañil que te coge la paga y señal y desaparece. Nivel 1 y repartiendo como si le pagaran por cráneo. Pro-Tip: Repair y Engineering a 3 significan que te levanta una barricada en un momento mientras los demás se cagan encima. Ponlo cerca de algo roto. Como tu grupo.',
    prevDescriptionsEs: [
      'Brandon: mazo grande, manos grandes y el rollo de un albañil que te coge la paga y señal y desaparece. Nivel 1 y repartiendo como si le pagaran por cráneo. Consejo pro: Repair y Engineering a 3 significan que te levanta una barricada en un momento mientras los demás se cagan encima. Ponlo cerca de algo roto. Como tu grupo.',
    ],
  },
  {
    name: 'Brandon (Floor 2)',
    kind: 'crawler',
    size: 'Medium (4)',
    tags: 'Human',
    slots: '10',
    slotValue: '4',
    level: '8',
    surprise: '13+F',
    evade: '13+F',
    move: '20',
    dr: '0',
    stats: {
      str: {
        score: '20',
        mod: '+5',
      },
      int: {
        score: '6',
        mod: '+3',
      },
      con: {
        score: '10',
        mod: '+4',
      },
      dex: {
        score: '6',
        mod: '+3',
      },
      cha: {
        score: '3',
        mod: '+2',
      },
    },
    attacks: [
      {
        name: 'Lightning Maul',
        toHit: '15+F',
        damage: '1d10+5 Bludgeoning',
        range: '',
        effect: '',
      },
      {
        name: 'Bad Penny Boomerang',
        toHit: '13+F',
        damage: '2d4+5 Bludgeoning',
        range: '80ft',
        effect: '',
      },
    ],
    notes:
      'Key Skills: Maul 4, Boomerang 6, Catcher 6, Repair 5, Engineering 3, Climbing 4, Drive 3, Intimidate 3, Fabricate 2, Jumping 3, Lockpicking 2. Accessories: Enchanted Cape of the Gnomex, Utility Belt of the Cheerful Contractor, Silver Ring, Power Ring of Smashing. Ready-to-play crawler from the Par for the Course pre-gens.',
    source: 'Par for the Course pre-gens',
    chapter: 'Floor 2 · Pre-generated crawlers',
    floor: 2,
    description:
      "Brandon's back with a lightning maul and a boomerang called Bad Penny, which, like his hangovers, always comes back. Catcher 6 means he'll snag it mid-brawl without looking. Pro tip: that Utility Belt is fully loaded. So is Brandon, most nights. Point him at something and step clear of the sparks.",
    prevDescriptions: [
      "Brandon's back, and now he's got a lightning maul and a boomerang called Bad Penny. It keeps coming back, just like his ex. Catcher 6 means he'll snag it mid-brawl without looking. Pro tip: that Utility Belt isn't a fashion statement. Mostly.",
    ],
    prevNotes: [
      'Key Skills: Maul 4, Boomerang 6, Catcher 6, Repair 5, Engineering 3, Climbing 4, Drive 3, Intimidate 3, Fabricate 2, Jumping 3, Lockpicking 2. Accessories: Enchanted Cape of the Gnomex, Utility Belt of the Cheerful Contractor, Silver Ring, Power Ring of Smashing. Ready-to-play crawler from the Par for the Course pre-gens.',
    ],
    descriptionEs:
      'Brandon vuelve con un mazo eléctrico y un bumerán llamado Bad Penny que, como sus resacas, siempre vuelve. Catcher 6 significa que lo caza en plena bronca sin mirar. Pro-Tip: ese Utility Belt va cargado hasta arriba. Igual que Brandon casi todas las noches. Apúntalo hacia algo y apártate de las chispas.',
    prevDescriptionsEs: [
      'Brandon vuelve con un mazo eléctrico y un bumerán llamado Bad Penny que, como sus resacas, siempre vuelve. Catcher 6 significa que lo caza en plena bronca sin mirar. Consejo pro: ese Utility Belt va cargado hasta arriba. Igual que Brandon casi todas las noches. Apúntalo hacia algo y apártate de las chispas.',
    ],
  },
  {
    name: 'Carl (Floor 1)',
    kind: 'crawler',
    size: 'Medium (4)',
    tags: 'Human',
    slots: '10',
    slotValue: '2',
    level: '1',
    surprise: '12+F',
    evade: '12+F',
    move: '20',
    dr: '1',
    stats: {
      str: {
        score: '6',
        mod: '+3',
      },
      int: {
        score: '3',
        mod: '+2',
      },
      con: {
        score: '5',
        mod: '+2',
      },
      dex: {
        score: '5',
        mod: '+2',
      },
      cha: {
        score: '4',
        mod: '+2',
      },
    },
    attacks: [
      {
        name: 'Pugilism',
        toHit: '12+F',
        damage: '1d2+3 Bludgeoning',
        range: '',
        effect: '',
      },
      {
        name: 'Unarmed Combat',
        toHit: '13+F',
        damage: '1d4+3 Bludgeoning',
        range: '',
        effect: '',
      },
      {
        name: 'Iron Punch',
        toHit: '',
        damage: '',
        range: '',
        effect: '',
      },
      {
        name: 'Powerful Strike',
        toHit: '',
        damage: '',
        range: '',
        effect: '',
      },
    ],
    notes:
      'Key Skills: Pugilism 4, Unarmed Combat 3, Iron Punch 3, Powerful Strike 3, Explosives Handling 1, Goblin Explosives 1, Improvised Explosive Device 3, Chopper Pilot 1, Swimming 2. Ready-to-play crawler from the Par for the Course pre-gens.',
    source: 'Par for the Course pre-gens',
    chapter: 'Floor 1 · Pre-generated crawlers',
    floor: 1,
    description:
      'Ladies and gentlebeings, the man who came to the apocalypse without pants. Level 1 Carl fights with his fists, poor impulse control, and a worrying interest in things that go boom. Pro tip: Iron Punch and Powerful Strike make him nasty up close. Never give him a detonator. Actually, fuck it, give him two. Ratings.',
    prevDescriptions: [
      'Here he is, folks, the man, the myth, the guy without pants. Level 1 Carl fights with his fists and a Swiss-cheese understanding of explosives. Iron Punch and Powerful Strike make him a menace up close. Pro tip: never hand him a detonator. Actually, do. Ratings.',
    ],
    prevNotes: [
      'Key Skills: Pugilism 4, Unarmed Combat 3, Iron Punch 3, Powerful Strike 3, Explosives Handling 1, Goblin Explosives 1, Improvised Explosive Device 3, Chopper Pilot 1, Swimming 2. Ready-to-play crawler from the Par for the Course pre-gens.',
    ],
    descriptionEs:
      'Damas, caballeros y seres varios: el hombre que se presentó al apocalipsis sin pantalones. El Carl de nivel 1 pelea con los puños, un control de impulsos lamentable y un interés preocupante por las cosas que hacen bum. Pro-Tip: Iron Punch y Powerful Strike lo convierten en un cabrón de cuidado en las distancias cortas. No le des nunca un detonador. Bueno, a la mierda, dale dos. Audiencia.',
    prevDescriptionsEs: [
      'Damas, caballeros y seres varios: el hombre que se presentó al apocalipsis sin pantalones. El Carl de nivel 1 pelea con los puños, un control de impulsos lamentable y un interés preocupante por las cosas que hacen bum. Consejo pro: Iron Punch y Powerful Strike lo convierten en un cabrón de cuidado en las distancias cortas. No le des nunca un detonador. Bueno, a la mierda, dale dos. Audiencia.',
    ],
  },
  {
    name: 'Carl (Floor 2)',
    kind: 'crawler',
    size: 'Medium (4)',
    tags: 'Human',
    slots: '10',
    slotValue: '4',
    level: '10',
    surprise: '12+F',
    evade: '13+F',
    move: '20',
    dr: '1',
    stats: {
      str: {
        score: '12',
        mod: '+4',
      },
      int: {
        score: '3',
        mod: '+2',
      },
      con: {
        score: '12',
        mod: '+4',
      },
      dex: {
        score: '6',
        mod: '+3',
      },
      cha: {
        score: '4',
        mod: '+2',
      },
    },
    attacks: [
      {
        name: 'Pugilism',
        toHit: '13+F',
        damage: '3d2+4 Bludgeoning',
        range: '',
        effect: '',
      },
      {
        name: 'Foot Soldier',
        toHit: '14+F',
        damage: '2d4+4 Bludgeoning',
        range: '',
        effect: '',
      },
      {
        name: 'Iron Punch',
        toHit: '',
        damage: '',
        range: '',
        effect: '',
      },
      {
        name: 'Powerful Strike',
        toHit: '',
        damage: '',
        range: '',
        effect: '',
      },
      {
        name: 'Smush',
        toHit: '',
        damage: '',
        range: '',
        effect: '',
      },
    ],
    notes:
      'Key Skills: Pugilism 7, Foot Soldier 6, Iron Punch 7, Powerful Strike 9, Smush 6, Throw 3, Taunt 5, Determine Value 2, Explosives Handling 5, Goblin Explosives 5, Regeneration 7, Chopper Pilot 5. Accessories: Nightgaunt Cloak of Stoutness, Spiked Kneepads of the Shade Gnoll Riot Forces, Damage Reflection, Bar slot as well, Cancels momentum-based attacks (negates a Rush, Trample, or Ramming attacks), Toe Ring of the Splatter Skunk, Silver Ring, Silver Ring, Trollskin Shirt of Pummeling. Ready-to-play crawler from the Par for the Course pre-gens.',
    source: 'Par for the Course pre-gens',
    chapter: 'Floor 2 · Pre-generated crawlers',
    floor: 2,
    description:
      "Level 10 Carl has discovered feet, and the dungeon will never recover. Foot Soldier kicks, Smush flattens, Regeneration 7 lets him walk off wounds that'd make a surgeon puke. Pro tip: let him close the distance and Powerful Strike does the rest. Stand back unless you enjoy wearing other people's insides.",
    prevDescriptions: [
      'Level 10 Carl: now featuring a foot. Foot Soldier, Smush, and Regeneration 7 mean he kicks things to death and then walks it off. His outfit is 40% cloak and 60% jewelry. Pro tip: Powerful Strike 9 hits like a truck, so let him get close and step back.',
    ],
    prevNotes: [
      'Key Skills: Pugilism 7, Foot Soldier 6, Iron Punch 7, Powerful Strike 9, Smush 6, Throw 3, Taunt 5, Determine Value 2, Explosives Handling 5, Goblin Explosives 5, Regeneration 7, Chopper Pilot 5. Accessories: Nightgaunt Cloak of Stoutness, Spiked Kneepads of the Shade Gnoll Riot Forces, Damage Reflection, Bar slot as well, Cancels momentum-based attacks (negates a Rush, Trample, or Ramming attacks), Toe Ring of the Splatter Skunk, Silver Ring, Silver Ring, Trollskin Shirt of Pummeling. Ready-to-play crawler from the Par for the Course pre-gens.',
    ],
    descriptionEs:
      'El Carl de nivel 10 ha descubierto los pies, y la mazmorra no se recuperará jamás. Foot Soldier patea, Smush aplasta y Regeneration 7 le deja sacudirse heridas que harían vomitar a un cirujano. Pro-Tip: déjale acortar distancias y Powerful Strike hará el resto. Apártate, a menos que te guste ir vestido con las tripas de los demás.',
    prevDescriptionsEs: [
      'El Carl de nivel 10 ha descubierto los pies, y la mazmorra no se recuperará jamás. Foot Soldier patea, Smush aplasta y Regeneration 7 le deja sacudirse heridas que harían vomitar a un cirujano. Consejo pro: déjale acortar distancias y Powerful Strike hará el resto. Apártate, a menos que te guste ir vestido con las tripas de los demás.',
    ],
  },
  {
    name: 'Chris (Floor 1)',
    kind: 'crawler',
    size: 'Medium (4)',
    tags: 'Human',
    slots: '10',
    slotValue: '2',
    level: '1',
    surprise: '13+F',
    evade: '12+F',
    move: '20',
    dr: '1',
    stats: {
      str: {
        score: '4',
        mod: '+2',
      },
      int: {
        score: '6',
        mod: '+3',
      },
      con: {
        score: '3',
        mod: '+2',
      },
      dex: {
        score: '5',
        mod: '+2',
      },
      cha: {
        score: '2',
        mod: '+1',
      },
    },
    attacks: [
      {
        name: 'Spear',
        toHit: '12+F',
        damage: '1d8+2 Piercing',
        range: '',
        effect: '',
      },
      {
        name: 'Unarmed Combat',
        toHit: '12+F',
        damage: '1d4+2 Bludgeoning',
        range: '',
        effect: '',
      },
    ],
    notes:
      'Key Skills: Spear 3, Unarmed Combat 3, Negotiation 1, Engineering 3, Repair 3, Investigation 1, Perception 1, Fabricate 2, Running 1, Ambush 2. Ready-to-play crawler from the Par for the Course pre-gens.',
    source: 'Par for the Course pre-gens',
    chapter: 'Floor 1 · Pre-generated crawlers',
    floor: 1,
    description:
      "Chris: a spear, a toolbox, and the heartbreaking optimism of a guy who reads assembly instructions. He'll ambush you, then fix whatever you broke while bleeding out. Pro tip: Engineering and Repair at 3 make him the party's handyman. Nobody tell him the average handyman in here lasts about as long as a fart in a hurricane.",
    prevDescriptions: [
      "Chris, a spear and a toolbox. He'll ambush you, then fix the thing you broke while dying. Level 1 and deeply earnest about it. Pro tip: Engineering and Repair at 3 make him the party's handyman. Please do not tell him how few handymen survive.",
    ],
    prevNotes: [
      'Key Skills: Spear 3, Unarmed Combat 3, Negotiation 1, Engineering 3, Repair 3, Investigation 1, Perception 1, Fabricate 2, Running 1, Ambush 2. Ready-to-play crawler from the Par for the Course pre-gens.',
    ],
    descriptionEs:
      'Chris: una lanza, una caja de herramientas y el optimismo desgarrador de un tío que se lee las instrucciones de IKEA. Te tenderá una emboscada y luego arreglará lo que hayas roto mientras se desangra. Pro-Tip: Engineering y Repair a 3 lo convierten en el manitas del grupo. Que nadie le diga que aquí dentro el manitas medio dura lo que un pedo en un huracán.',
    prevDescriptionsEs: [
      'Chris: una lanza, una caja de herramientas y el optimismo desgarrador de un tío que se lee las instrucciones de IKEA. Te tenderá una emboscada y luego arreglará lo que hayas roto mientras se desangra. Consejo pro: Engineering y Repair a 3 lo convierten en el manitas del grupo. Que nadie le diga que aquí dentro el manitas medio dura lo que un pedo en un huracán.',
    ],
  },
  {
    name: 'Chris (Floor 2)',
    kind: 'crawler',
    size: 'Medium (4)',
    tags: 'Human',
    slots: '10',
    slotValue: '3',
    level: '8',
    surprise: '14+F',
    evade: '12+F',
    move: '20',
    dr: '1',
    stats: {
      str: {
        score: '10',
        mod: '+4',
      },
      int: {
        score: '11',
        mod: '+4',
      },
      con: {
        score: '7',
        mod: '+3',
      },
      dex: {
        score: '8',
        mod: '+3',
      },
      cha: {
        score: '5',
        mod: '+2',
      },
    },
    attacks: [
      {
        name: 'Spear of Density',
        toHit: '14+F',
        damage: '1d8+4',
        range: '',
        effect: '',
      },
      {
        name: 'Enchanted Shuriken of Bloodlust',
        toHit: '13+F',
        damage: '2d4+4 Piercing',
        range: '',
        effect: '',
      },
    ],
    notes:
      'Key Skills: Spear 4, Unarmed Combat 5, Negotiation 4, Engineering 4, Repair 2, Investigation 3, Perception 4, Fabricate 4, Running 3, Ambush 3. Accessories: Silver Ring, Belt of the Swole Troglodyte. Ready-to-play crawler from the Par for the Course pre-gens.',
    source: 'Par for the Course pre-gens',
    chapter: 'Floor 2 · Pre-generated crawlers',
    floor: 2,
    description:
      'Chris found a spear with weight issues and shurikens with a blood addiction. Healthy. Perception and Negotiation both went up, so now he spots the trap and haggles with it. Pro tip: the Belt of the Swole Troglodyte is doing most of the heavy lifting, and honestly, same, buddy. Same.',
    prevDescriptions: [
      'Chris levelled up and found a spear with commitment issues about its own weight, plus shurikens that crave blood. Adorable. Perception and Negotiation both climbed, so he sees the trap and talks his way past it. Pro tip: the Belt of the Swole Troglodyte is doing heavy lifting. Literally.',
    ],
    prevNotes: [
      'Key Skills: Spear 4, Unarmed Combat 5, Negotiation 4, Engineering 4, Repair 2, Investigation 3, Perception 4, Fabricate 4, Running 3, Ambush 3. Accessories: Silver Ring, Belt of the Swole Troglodyte. Ready-to-play crawler from the Par for the Course pre-gens.',
    ],
    descriptionEs:
      'Chris ha encontrado una lanza con problemas de peso y unos shurikens enganchados a la sangre. Muy sano todo. Le han subido Perception y Negotiation, así que ahora ve la trampa y regatea con ella. Pro-Tip: el Belt of the Swole Troglodyte está haciendo casi todo el trabajo pesado y, sinceramente, te entiendo, colega. Te entiendo.',
    prevDescriptionsEs: [
      'Chris ha encontrado una lanza con problemas de peso y unos shurikens enganchados a la sangre. Muy sano todo. Le han subido Perception y Negotiation, así que ahora ve la trampa y regatea con ella. Consejo pro: el Belt of the Swole Troglodyte está haciendo casi todo el trabajo pesado y, sinceramente, te entiendo, colega. Te entiendo.',
    ],
  },
  {
    name: 'Princess Donut (Floor 1)',
    kind: 'crawler',
    size: 'Small (2)',
    tags: 'Cat',
    slots: '10',
    slotValue: '1',
    level: '1',
    surprise: '14+F',
    evade: '14+F',
    move: '20',
    dr: '0',
    stats: {
      str: {
        score: '11',
        mod: '+4',
      },
      int: {
        score: '11',
        mod: '+4',
      },
      con: {
        score: '2',
        mod: '+1',
      },
      dex: {
        score: '8',
        mod: '+3',
      },
      cha: {
        score: '25',
        mod: '+5',
      },
    },
    attacks: [
      {
        name: 'Magic Missile',
        toHit: '14+F',
        damage: '1d4+4 Force',
        range: '',
        effect: '',
      },
      {
        name: 'Slice Attack',
        toHit: '13+F',
        damage: '1d4+4 Slashing',
        range: '',
        effect: '',
      },
    ],
    notes:
      'Key Skills: Magic Missile 1, Slice Attack 4, Light on Your Feet 3, Good First Impression 5, Dodge 4. Accessories: Cat Collar. Ready-to-play crawler from the Par for the Course pre-gens.',
    source: 'Par for the Course pre-gens',
    chapter: 'Floor 1 · Pre-generated crawlers',
    floor: 1,
    description:
      "Her Royal Fluffiness has arrived, and she'd like you to know she was a champion before this shithole existed. Magic Missile, a slice attack, and Good First Impression 5, because of course the cat has better social stats than you. Pro tip: she dodges like a diva on a red carpet. Keep her out of melee and in the close-up.",
    prevDescriptions: [
      "Her Majesty has entered the dungeon, and she'd like you to know she was a champion before any of this. Magic Missile, a slice attack, and Good First Impression 5 because of course. Pro tip: she dodges like she's being paid to. Keep her out of melee and in the spotlight.",
    ],
    prevNotes: [
      'Key Skills: Magic Missile 1, Slice Attack 4, Light on Your Feet 3, Good First Impression 5, Dodge 4. Accessories: Cat Collar. Ready-to-play crawler from the Par for the Course pre-gens.',
    ],
    descriptionEs:
      'Su Majestad Esponjosa ha llegado, y quiere que sepas que ya era campeona antes de que existiera este estercolero. Magic Missile, un ataque cortante y Good First Impression 5, porque cómo no, la gata tiene mejores stats sociales que tú. Pro-Tip: esquiva como una diva en la alfombra roja. Mantenla fuera del cuerpo a cuerpo y dentro del primer plano.',
    prevDescriptionsEs: [
      'Su Majestad Esponjosa ha llegado, y quiere que sepas que ya era campeona antes de que existiera este estercolero. Magic Missile, un ataque cortante y Good First Impression 5, porque cómo no, la gata tiene mejores stats sociales que tú. Consejo pro: esquiva como una diva en la alfombra roja. Mantenla fuera del cuerpo a cuerpo y dentro del primer plano.',
    ],
  },
  {
    name: 'Princess Donut (Floor 2)',
    kind: 'crawler',
    size: 'Small (2)',
    tags: 'Cat',
    slots: '10',
    slotValue: '1',
    level: '10',
    surprise: '15+F',
    evade: '15+F',
    move: '20',
    dr: '0',
    stats: {
      str: {
        score: '20',
        mod: '+5',
      },
      int: {
        score: '26',
        mod: '+5',
      },
      con: {
        score: '2',
        mod: '+1',
      },
      dex: {
        score: '12',
        mod: '+4',
      },
      cha: {
        score: '43',
        mod: '+5',
      },
    },
    attacks: [
      {
        name: 'Magic Missile',
        toHit: '15+F',
        damage: '2d4+5 Force',
        range: '',
        effect: '',
      },
      {
        name: 'Slice Attack',
        toHit: '15+F',
        damage: '1d4+5 Slashing',
        range: '',
        effect: '',
      },
      {
        name: 'Back Claw',
        toHit: '15+F',
        damage: '1d6+5 Slashing',
        range: '',
        effect: '',
      },
    ],
    notes:
      'Key Skills: Magic Missile Spell 5, Puddle Jumper Spell 1, Torch Spell 1, Slice Attack 4, Back Claw 4, Light on Your Feet 7, Good First Impression 5, Dodge 4, Second Chance Spell 1. Accessories: Talisman of the Slate Butterfly, Enchanted Fae Scale Quadraped Crupper of the Fleet, Bracelet. Ready-to-play crawler from the Par for the Course pre-gens.',
    source: 'Par for the Course pre-gens',
    chapter: 'Floor 2 · Pre-generated crawlers',
    floor: 2,
    description:
      'Level 10 Donut: more spells, more claws, more attitude than a Borough full of tax auditors. Missiles up front, Back Claw for anyone dumb enough to flank, and Second Chance for when you all inevitably fuck it up. Pro tip: Light on Your Feet 7 makes her a greased eel. Let her kite. The camera drones already follow her home.',
    prevDescriptions: [
      'Princess Donut, Level 10, now with more spells and more attitude than the whole Borough combined. Missiles, claws front and back, and a Second Chance spell for when things go terribly. Pro tip: Light on Your Feet 7 makes her slippery. Let her kite. She was born for camera angles.',
    ],
    prevNotes: [
      'Key Skills: Magic Missile Spell 5, Puddle Jumper Spell 1, Torch Spell 1, Slice Attack 4, Back Claw 4, Light on Your Feet 7, Good First Impression 5, Dodge 4, Second Chance Spell 1. Accessories: Talisman of the Slate Butterfly, Enchanted Fae Scale Quadraped Crupper of the Fleet, Bracelet. Ready-to-play crawler from the Par for the Course pre-gens.',
    ],
    descriptionEs:
      'La Donut de nivel 10: más hechizos, más garras y más actitud que un Borough lleno de inspectores de Hacienda. Misiles por delante, Back Claw para el que sea tan tonto de flanquearla y Second Chance para cuando la caguéis todos, que la vais a cagar. Pro-Tip: Light on Your Feet 7 la convierte en una anguila engrasada. Déjala que haga kiting. Los drones de cámara ya la siguen hasta casa.',
    prevDescriptionsEs: [
      'La Donut de nivel 10: más hechizos, más garras y más actitud que un Borough lleno de inspectores de Hacienda. Misiles por delante, Back Claw para el que sea tan tonto de flanquearla y Second Chance para cuando la caguéis todos, que la vais a cagar. Consejo pro: Light on Your Feet 7 la convierte en una anguila engrasada. Déjala que haga kiting. Los drones de cámara ya la siguen hasta casa.',
    ],
  },
  {
    name: 'Imani (Floor 1)',
    kind: 'crawler',
    size: 'Medium (4)',
    tags: 'Human',
    slots: '10',
    slotValue: '2',
    level: '1',
    surprise: '11+F',
    evade: '12+F',
    move: '20',
    dr: '0',
    stats: {
      str: {
        score: '4',
        mod: '+2',
      },
      int: {
        score: '2',
        mod: '+1',
      },
      con: {
        score: '5',
        mod: '+2',
      },
      dex: {
        score: '3',
        mod: '+2',
      },
      cha: {
        score: '6',
        mod: '+3',
      },
    },
    attacks: [
      {
        name: 'Longsword',
        toHit: '12+F',
        damage: '1d8+2 Slashing',
        range: '',
        effect: '',
      },
      {
        name: 'Unarmed Combat',
        toHit: '12+F',
        damage: '1d4+2 Bludgeoning',
        range: '',
        effect: '',
      },
    ],
    notes:
      'Key Skills: Longsword 3, Unarmed Combat 3, Persuasion 3, Stealth 1, Deception 1, Swimming 1, Streetwise 2, First Aid 3, Perception 2, Running 1. Ready-to-play crawler from the Par for the Course pre-gens.',
    source: 'Par for the Course pre-gens',
    chapter: 'Floor 1 · Pre-generated crawlers',
    floor: 1,
    description:
      "Imani: longsword in one hand, first aid kit in the other, and zero patience for your bullshit. Persuasion 3 and Streetwise 2 mean she talks first and stabs second. Pro tip: keep her breathing, because she's the only reason you still are. Treat her like the last roll of toilet paper in the building.",
    prevDescriptions: [
      "Imani: longsword in one hand, first aid kit in the other, and the patience of a saint who's done with your nonsense. Persuasion 3 and Streetwise 2 mean she talks first and stabs second. Pro tip: keep her alive, because she's the one keeping you alive.",
    ],
    prevNotes: [
      'Key Skills: Longsword 3, Unarmed Combat 3, Persuasion 3, Stealth 1, Deception 1, Swimming 1, Streetwise 2, First Aid 3, Perception 2, Running 1. Ready-to-play crawler from the Par for the Course pre-gens.',
    ],
    descriptionEs:
      'Imani: espada larga en una mano, botiquín en la otra y cero paciencia para tus gilipolleces. Persuasion 3 y Streetwise 2 significan que primero habla y luego apuñala. Pro-Tip: mantenla con vida, porque es la única razón por la que tú sigues respirando. Trátala como el último rollo de papel higiénico del edificio.',
    prevDescriptionsEs: [
      'Imani: espada larga en una mano, botiquín en la otra y cero paciencia para tus gilipolleces. Persuasion 3 y Streetwise 2 significan que primero habla y luego apuñala. Consejo pro: mantenla con vida, porque es la única razón por la que tú sigues respirando. Trátala como el último rollo de papel higiénico del edificio.',
    ],
  },
  {
    name: 'Imani (Floor 2)',
    kind: 'crawler',
    size: 'Medium (4)',
    tags: 'Human',
    slots: '10',
    slotValue: '3',
    level: '11',
    surprise: '11+F',
    evade: '13+F',
    move: '20',
    dr: '0',
    stats: {
      str: {
        score: '8',
        mod: '+3',
      },
      int: {
        score: '2',
        mod: '+1',
      },
      con: {
        score: '6',
        mod: '+3',
      },
      dex: {
        score: '7',
        mod: '+3',
      },
      cha: {
        score: '11',
        mod: '+4',
      },
    },
    attacks: [
      {
        name: 'Longsword of the Velvet Executioner',
        toHit: '13+F',
        damage: '2d8+3 Slashing',
        range: '',
        effect: '',
      },
      {
        name: 'Unarmed Combat',
        toHit: '13+F',
        damage: '1d4+3 Bludgeoning',
        range: '',
        effect: '',
      },
    ],
    notes:
      'Key Skills: Longsword 5, Persuasion 4, Stealth 2, Deception 4, Swimming 4, Streetwise 2, First Aid 6, Perception 4, Running 4, Unarmed Combat 4. Accessories: Cloak of Some Hope, Golden Ring. Ready-to-play crawler from the Par for the Course pre-gens.',
    source: 'Par for the Course pre-gens',
    chapter: 'Floor 2 · Pre-generated crawlers',
    floor: 2,
    description:
      "Level 11 Imani swings a sword named after a velvet executioner, which sounds like a cocktail that ends marriages. First Aid 6 stitches you back together mid-fight; Deception 4 means she'll swear that bone was always outside your leg. Pro tip: her cloak is of Some Hope. Some. Manage your fucking expectations.",
    prevDescriptions: [
      "Imani, Level 11, now wielding a sword named after a velvet executioner. Classy. First Aid 6 means she can stitch you back together mid-fight, and Deception 4 means she might lie about how bad it looks. Pro tip: she's wearing a cloak of Some Hope. Some. Temper expectations.",
    ],
    prevNotes: [
      'Key Skills: Longsword 5, Persuasion 4, Stealth 2, Deception 4, Swimming 4, Streetwise 2, First Aid 6, Perception 4, Running 4, Unarmed Combat 4. Accessories: Cloak of Some Hope, Golden Ring. Ready-to-play crawler from the Par for the Course pre-gens.',
    ],
    descriptionEs:
      'La Imani de nivel 11 blande una espada con nombre de verdugo de terciopelo, que suena a cóctel que acaba con matrimonios. First Aid 6 te cose en plena pelea; Deception 4 significa que te jurará que ese hueso siempre estuvo por fuera de la pierna. Pro-Tip: su capa es de Some Hope. «Some». O sea, un poquito de esperanza. Rebaja tus putas expectativas.',
    prevDescriptionsEs: [
      'La Imani de nivel 11 blande una espada con nombre de verdugo de terciopelo, que suena a cóctel que acaba con matrimonios. First Aid 6 te cose en plena pelea; Deception 4 significa que te jurará que ese hueso siempre estuvo por fuera de la pierna. Consejo pro: su capa es de Some Hope. «Some». O sea, un poquito de esperanza. Rebaja tus putas expectativas.',
    ],
  },
  {
    name: 'Yolanda (Floor 1)',
    kind: 'crawler',
    size: 'Medium (4)',
    tags: 'Human',
    slots: '10',
    slotValue: '2',
    level: '1',
    surprise: '12+F',
    evade: '13+F',
    move: '20',
    dr: '0',
    stats: {
      str: {
        score: '2',
        mod: '+1',
      },
      int: {
        score: '3',
        mod: '+2',
      },
      con: {
        score: '5',
        mod: '+2',
      },
      dex: {
        score: '6',
        mod: '+3',
      },
      cha: {
        score: '4',
        mod: '+2',
      },
    },
    attacks: [
      {
        name: 'Bow',
        toHit: '13+F',
        damage: '1d6+1 Piercing',
        range: '',
        effect: '',
      },
      {
        name: 'Unarmed Combat',
        toHit: '11+F',
        damage: '1d4+1 Bludgeoning',
        range: '',
        effect: '',
      },
    ],
    notes:
      'Key Skills: Bow 3, First Aid 3, Stealth 2, Perception 3, Detect Lies 1, Hide in Shadows 2, Running 1, Climbing 1, Endurance 1, Unarmed Combat 3. Accessories: Quiver with 16 arrows. Ready-to-play crawler from the Par for the Course pre-gens.',
    source: 'Par for the Course pre-gens',
    chapter: 'Floor 1 · Pre-generated crawlers',
    floor: 1,
    description:
      "Yolanda brings a bow, sixteen arrows, and a medic's bag. That's sixteen chances to be the hero before she's reduced to slap-fighting a goblin. Hide in Shadows and Perception let her see you first. Pro tip: count those arrows. I certainly will, and when she runs dry, I'm cueing the sad trombone.",
    prevDescriptions: [
      "Yolanda brings a bow, sixteen arrows, and a medic's bag. That's sixteen chances to be the hero before she's reduced to punching. Hide in Shadows and Perception let her see you first. Pro tip: count those arrows. I certainly will.",
    ],
    prevNotes: [
      'Key Skills: Bow 3, First Aid 3, Stealth 2, Perception 3, Detect Lies 1, Hide in Shadows 2, Running 1, Climbing 1, Endurance 1, Unarmed Combat 3. Accessories: Quiver with 16 arrows. Ready-to-play crawler from the Par for the Course pre-gens.',
    ],
    descriptionEs:
      'Yolanda trae un arco, dieciséis flechas y un maletín de médico. Son dieciséis oportunidades de ser la heroína antes de verse reducida a pelearse a bofetadas con un goblin. Hide in Shadows y Perception le permiten verte primero. Pro-Tip: cuenta esas flechas. Yo desde luego lo haré, y cuando se quede sin ninguna, pondré el trombón triste.',
    prevDescriptionsEs: [
      'Yolanda trae un arco, dieciséis flechas y un maletín de médico. Son dieciséis oportunidades de ser la heroína antes de verse reducida a pelearse a bofetadas con un goblin. Hide in Shadows y Perception le permiten verte primero. Consejo pro: cuenta esas flechas. Yo desde luego lo haré, y cuando se quede sin ninguna, pondré el trombón triste.',
    ],
  },
  {
    name: 'Yolanda (Floor 2)',
    kind: 'crawler',
    size: 'Medium (4)',
    tags: 'Human',
    slots: '10',
    slotValue: '2',
    level: '6',
    surprise: '12+F',
    evade: '15+F',
    move: '20',
    dr: '0',
    stats: {
      str: {
        score: '8',
        mod: '+3',
      },
      int: {
        score: '5',
        mod: '+2',
      },
      con: {
        score: '5',
        mod: '+2',
      },
      dex: {
        score: '20',
        mod: '+5',
      },
      cha: {
        score: '7',
        mod: '+3',
      },
    },
    attacks: [
      {
        name: 'Bow of Arrow Dynamics',
        toHit: '15+F',
        damage: '2d6+3',
        range: '100ft',
        effect: '',
      },
      {
        name: 'Dagger',
        toHit: '13+F',
        damage: '2d4+3 Piercing',
        range: '',
        effect: '',
      },
    ],
    notes:
      'Key Skills: Bow 6, Dagger 5, First Aid 7, Stealth 2, Perception 3, Detect Lies 2, Hide in Shadows 3, Running 4, Climbing 3, Endurance 2. Accessories: Enchanted Quiver of Quintessence, Silver Ring. Ready-to-play crawler from the Par for the Course pre-gens.',
    source: 'Par for the Course pre-gens',
    chapter: 'Floor 2 · Pre-generated crawlers',
    floor: 2,
    description:
      "Yolanda upgraded to a physics-nerd bow with 100 feet of reach and a quiver that never runs dry. Suck it, arrow economy. First Aid 7 makes her the gang's best healer, and the dagger is for the handsy. Pro tip: if she's in melee, somebody on your team fucked up. Guard the medic or bleed like idiots.",
    prevDescriptions: [
      'Yolanda graduated to a physics-themed bow and a quiver that apparently never runs dry. Take that, arrow budget. First Aid 7 makes her the best healer in the gang, and the dagger is for anyone who gets too close. Pro tip: 100ft of range means she should never be in melee. Keep it that way.',
    ],
    prevNotes: [
      'Key Skills: Bow 6, Dagger 5, First Aid 7, Stealth 2, Perception 3, Detect Lies 2, Hide in Shadows 3, Running 4, Climbing 3, Endurance 2. Accessories: Enchanted Quiver of Quintessence, Silver Ring. Ready-to-play crawler from the Par for the Course pre-gens.',
    ],
    descriptionEs:
      'Yolanda se ha pasado a un arco de friki de la física con 100 pies de alcance y un carcaj que nunca se vacía. Chúpate esa, economía de flechas. First Aid 7 la convierte en la mejor sanadora de la banda, y la daga es para los sobones. Pro-Tip: si está en cuerpo a cuerpo, alguien de tu equipo la ha cagado. Proteged a la médica o desangraos como idiotas.',
    prevDescriptionsEs: [
      'Yolanda se ha pasado a un arco de friki de la física con 100 pies de alcance y un carcaj que nunca se vacía. Chúpate esa, economía de flechas. First Aid 7 la convierte en la mejor sanadora de la banda, y la daga es para los sobones. Consejo pro: si está en cuerpo a cuerpo, alguien de tu equipo la ha cagado. Proteged a la médica o desangraos como idiotas.',
    ],
  },
  {
    name: 'Brain Boiler',
    kind: 'mob',
    size: 'Small (2)',
    tags: 'Weird',
    slots: '10',
    slotValue: '1',
    level: '10',
    surprise: '15+F',
    evade: '14+F',
    move: '20+S',
    dr: '3',
    stats: {
      str: {
        score: '3',
        mod: '+2',
      },
      int: {
        score: '20',
        mod: '+5',
      },
      con: {
        score: '1',
        mod: '+1',
      },
      dex: {
        score: '10',
        mod: '+4',
      },
      cha: {
        score: '1',
        mod: '+1',
      },
    },
    attacks: [
      {
        name: 'Bite',
        toHit: '12+F',
        damage: '3d4+2 Piercing',
        range: '5ft range',
        effect: '',
      },
      {
        name: 'Flying Face Hug',
        toHit: '14+F',
        damage: 'No damage',
        range: '15ft range',
        effect: 'On hit: Wrapped, Burned',
      },
    ],
    notes:
      "Flying Face Hug: hit → Str Stat Check; fail → Wrapped (creature on their head, Burned until it's slain or pried off; normal extinguishing doesn't work).\nWrapped: escape = Action for a Str-Opposed Escape Artist Skill Check, or Str Stat Check vs that Difficulty. Anyone else attacking it → damage split ½ victim, ½ Brain Boiler.\n\nFull text: Core Rulebook p. 333.",
    source: 'Core Rulebook p. 333',
    chapter: 'Floor 3 · The Over City',
    floor: 3,
    description:
      "It flies at your face, wraps around your skull, and slow-cooks your brain like a gas-station burrito. Stop, drop, and roll won't help, sweetheart. Pro tip: your buddies can beat it off your head, but half of every hit lands on you. Nothing tests a friendship like a teammate clubbing your face to save your life.",
    prevDescriptions: [
      "It flies, it hugs, it cooks your brain like a microwave burrito. Comes with its own complimentary headache. Pro tip: your friends can try to swat it off your face, but they'll be hitting you just as hard. Friendship is expensive in here.",
    ],
    prevNotes: [
      'Special: Wrapped. Full text: Core Rulebook p. 333.',
      "Flying Face Hug: hit → Str Stat Check; fail → Wrapped (creature on their head, Burned until it's slain or pried off; normal extinguishing doesn't work).\nWrapped: escape = Action for a Str-Opposed Escape Artist Skill Check, or Str Stat Check vs that Difficulty. Anyone else attacking it → damage split ½ victim, ½ Brain Boiler.\n\nFull text: Core Rulebook p. 333.",
    ],
    descriptionEs:
      'Te vuela a la cara, se te enrosca en el cráneo y te cocina el cerebro a fuego lento como un burrito de gasolinera. Lo de pararse, tirarse al suelo y rodar no te va a servir, cariño. Pro-Tip: tus colegas pueden quitártelo de la cabeza a golpes, pero la mitad de cada golpe te lo comes tú. Nada pone a prueba una amistad como un compañero reventándote la cara para salvarte la vida.',
    prevDescriptionsEs: [
      'Te vuela a la cara, se te enrosca en el cráneo y te cocina el cerebro a fuego lento como un burrito de gasolinera. Lo de pararse, tirarse al suelo y rodar no te va a servir, cariño. Consejo pro: tus colegas pueden quitártelo de la cabeza a golpes, pero la mitad de cada golpe te lo comes tú. Nada pone a prueba una amistad como un compañero reventándote la cara para salvarte la vida.',
    ],
  },
  {
    name: 'Bugaboo',
    kind: 'mob',
    size: 'Medium (4)',
    tags: 'Humanoid',
    slots: '10',
    slotValue: '5',
    level: '22',
    surprise: '14+F',
    evade: '14+F',
    move: '20+S',
    dr: '3',
    stats: {
      str: {
        score: '21',
        mod: '+5',
      },
      int: {
        score: '13',
        mod: '+4',
      },
      con: {
        score: '21',
        mod: '+5',
      },
      dex: {
        score: '10',
        mod: '+4',
      },
      cha: {
        score: '6',
        mod: '+3',
      },
    },
    attacks: [
      {
        name: 'Boo Hug',
        toHit: '15+F',
        damage: '3d8+5 Bludgeoning',
        range: '5ft range',
        effect: 'On hit: Held',
      },
      {
        name: 'Glad Handed',
        toHit: '15+F',
        damage: '3d8+5 Slashing',
        range: '5ft range',
        effect: 'On hit: Queasy',
      },
      {
        name: 'Two-Fisted Take Down',
        toHit: '15+F',
        damage: '3d10+5 Bludgeoning',
        range: '5ft range',
        effect: 'Major Fail+: Take Down; every other round',
      },
    ],
    notes:
      'Extreme Body Odor: a crawler ending their turn within 5ft makes a Con Stat Check. On Fail, they gain Woozy.\nBoo Hug: any hit applies Held.\nGlad Handed: any hit applies Queasy.\nTwo-Fisted Take Down: usable only every other round.\n\nFull text: Core Rulebook p. 333.',
    source: 'Core Rulebook p. 333',
    chapter: 'Floor 3 · The Over City',
    floor: 3,
    description:
      "Nobody ordered the hug, but the Bugaboo's delivering. Then a handshake with blades, then a body slam, all while smelling like a corpse's jockstrap. Pro tip: never end your turn next to it unless you want to spend the next round puking. The Bugaboo does not believe in consent or deodorant.",
    prevDescriptions: [
      "Nobody asked for a hug. The Bugaboo gives one anyway, then a handshake with knives, then a body slam, all while smelling like a gym bag left in a hot car. Pro tip: don't stand next to it at the end of your turn. Your nose will file for divorce.",
    ],
    prevNotes: [
      'Special: Extreme Body Odor. Full text: Core Rulebook p. 333.',
      'Extreme Body Odor: a crawler ending their turn within 5ft makes a Con Stat Check. On Fail, they gain Woozy.\nBoo Hug: any hit applies Held.\nGlad Handed: any hit applies Queasy.\nTwo-Fisted Take Down: usable only every other round.\n\nFull text: Core Rulebook p. 333.',
    ],
    descriptionEs:
      'Nadie ha pedido el abrazo, pero el Bugaboo te lo sirve igual. Luego un apretón de manos con cuchillas y después un placaje, todo mientras huele a suspensorio de cadáver. Pro-Tip: nunca acabes el turno a su lado salvo que quieras pasarte la siguiente ronda vomitando. El Bugaboo no cree ni en el consentimiento ni en el desodorante.',
    prevDescriptionsEs: [
      'Nadie ha pedido el abrazo, pero el Bugaboo te lo sirve igual. Luego un apretón de manos con cuchillas y después un placaje, todo mientras huele a suspensorio de cadáver. Consejo pro: nunca acabes el turno a su lado salvo que quieras pasarte la siguiente ronda vomitando. El Bugaboo no cree ni en el consentimiento ni en el desodorante.',
    ],
  },
  {
    name: 'City Elves',
    kind: 'mob',
    size: 'Medium (4)',
    tags: 'Humanoid',
    slots: '10',
    slotValue: '4',
    level: '15',
    surprise: '13+F',
    evade: '14+F',
    move: '20+S',
    dr: '3',
    stats: {
      str: {
        score: '13',
        mod: '+4',
      },
      int: {
        score: '7',
        mod: '+3',
      },
      con: {
        score: '13',
        mod: '+4',
      },
      dex: {
        score: '11',
        mod: '+4',
      },
      cha: {
        score: '6',
        mod: '+3',
      },
    },
    attacks: [
      {
        name: 'Butterfly Knife',
        toHit: '14+F',
        damage: '3d6+4 Piercing',
        range: '5ft range,',
        effect: 'Major Fail+: Blood Trail',
      },
      {
        name: 'Desert Eagle',
        toHit: '14+F',
        damage: '3d6 Piercing',
        range: '50ft range',
        effect: 'Special effect',
      },
    ],
    notes:
      'Fanatical: mind-affecting effects, fear and charm all fail vs them.\nButterfly Knife: Armor-Piercing.\n\nFull text: Core Rulebook p. 334.',
    source: 'Core Rulebook p. 334',
    chapter: 'Floor 3 · The Over City',
    floor: 3,
    description:
      "Forget singing in the trees. These pointy-eared street punks carry butterfly knives that go through armor and hand cannons that go through everything else. Pro tip: don't bother charming, scaring, or mind-fucking them; they're too zealous to notice. Bring bigger guns, or at least faster legs than the guy next to you.",
    prevDescriptions: [
      "These aren't your grandma's forest elves. These pointy-eared street toughs pack butterfly knives and hand cannons, and you can't talk, scare, or charm them out of anything. Pro tip: skip the mind tricks. Bring bigger guns or faster legs.",
    ],
    prevNotes: [
      'Special: Fanatical. Full text: Core Rulebook p. 334.',
      'Fanatical: mind-affecting effects, fear and charm all fail vs them.\nButterfly Knife: Armor-Piercing.\n\nFull text: Core Rulebook p. 334.',
    ],
    descriptionEs:
      'Olvídate de cantar en los árboles. Estos macarras callejeros de orejas puntiagudas llevan navajas mariposa que atraviesan armaduras y pistolones que atraviesan todo lo demás. Pro-Tip: no pierdas el tiempo encantándolos, asustándolos o jodiéndoles la cabeza; son demasiado fanáticos para enterarse. Trae armas más grandes o, como mínimo, piernas más rápidas que las del de al lado.',
    prevDescriptionsEs: [
      'Olvídate de cantar en los árboles. Estos macarras callejeros de orejas puntiagudas llevan navajas mariposa que atraviesan armaduras y pistolones que atraviesan todo lo demás. Consejo pro: no pierdas el tiempo encantándolos, asustándolos o jodiéndoles la cabeza; son demasiado fanáticos para enterarse. Trae armas más grandes o, como mínimo, piernas más rápidas que las del de al lado.',
    ],
  },
  {
    name: 'Village Guard (p. 335)',
    kind: 'mob',
    size: 'Medium (4)',
    tags: 'Humanoid',
    slots: '10',
    slotValue: '7',
    level: '75',
    surprise: '15+F',
    evade: '14+F',
    move: '15+S',
    dr: '4',
    stats: {
      str: {
        score: '70',
        mod: '+6',
      },
      int: {
        score: '25',
        mod: '+5',
      },
      con: {
        score: '100',
        mod: '+7',
      },
      dex: {
        score: '15',
        mod: '+4',
      },
      cha: {
        score: '20',
        mod: '+5',
      },
    },
    attacks: [
      {
        name: 'Commanding Shout Spell',
        toHit: '15+F',
        damage: 'No damage',
        range: '100ft range',
        effect: 'On hit: Terrified',
      },
      {
        name: 'Longsword',
        toHit: '16+F',
        damage: '7d10+6 Slashing',
        range: '5ft range',
        effect: '',
      },
    ],
    notes:
      'Letter of the Law: kills any known lawbreaker on sight, no mercy. Stops chasing once the target leaves the settlement but remembers them if they come back.\nCommanding Shout Spell: any hit applies Terrified for 2 rounds.\n\nFull text: Core Rulebook p. 335.',
    source: 'Core Rulebook p. 335',
    chapter: 'Floor 3 · The Over City',
    floor: 3,
    description:
      "Level seventy-fucking-five. His sword rolls seven dice, and one shout leaves you shitting your armor for two rounds. Jaywalk in his town and he stops being a guard and becomes your obituary. Pro tip: read the local ordinances, or sprint for the town line. He'll remember your face, and he holds a grudge longer than I do.",
    prevDescriptions: [
      "Level 75. Seventy-five. With a sword that rolls seven dice. Break one rule in town and this guy stops being a guard and becomes your personal apocalypse. Pro tip: read the local laws. Or run for the town limits and pray he doesn't recognize you next time.",
    ],
    prevNotes: [
      'Special: Letter of the Law. Full text: Core Rulebook p. 335.',
      'Letter of the Law: kills any known lawbreaker on sight, no mercy. Stops chasing once the target leaves the settlement but remembers them if they come back.\nCommanding Shout Spell: any hit applies Terrified for 2 rounds.\n\nFull text: Core Rulebook p. 335.',
    ],
    descriptionEs:
      'Nivel setenta y cinco de los cojones. Su espada tira siete dados, y un solo grito te deja cagándote en la armadura durante dos rondas. Cruza por donde no debes en su pueblo y dejará de ser un guardia para convertirse en tu esquela. Pro-Tip: léete las ordenanzas municipales o corre hacia el límite del pueblo. Recordará tu cara, y guarda rencor más tiempo que yo.',
    prevDescriptionsEs: [
      'Nivel setenta y cinco de los cojones. Su espada tira siete dados, y un solo grito te deja cagándote en la armadura durante dos rondas. Cruza por donde no debes en su pueblo y dejará de ser un guardia para convertirse en tu esquela. Consejo pro: léete las ordenanzas municipales o corre hacia el límite del pueblo. Recordará tu cara, y guarda rencor más tiempo que yo.',
    ],
  },
  {
    name: 'Grulke',
    kind: 'mob',
    size: 'Medium (4)',
    tags: 'Humanoid',
    slots: '10',
    slotValue: '5',
    level: '16',
    surprise: '14+F',
    evade: '14+F',
    move: '20+S',
    dr: '4',
    stats: {
      str: {
        score: '10',
        mod: '+4',
      },
      int: {
        score: '10',
        mod: '+4',
      },
      con: {
        score: '20',
        mod: '+5',
      },
      dex: {
        score: '10',
        mod: '+4',
      },
      cha: {
        score: '3',
        mod: '+2',
      },
    },
    attacks: [
      {
        name: 'Polearm',
        toHit: '14+F',
        damage: '3d8+4 Slashing',
        range: '10ft range',
        effect: 'Major Fail+: Blood Trail',
      },
      {
        name: 'Slam',
        toHit: '14+F',
        damage: '3d8+4 Bludgeoning',
        range: '5ft range',
        effect: 'Major Fail+: Take Down',
      },
      {
        name: 'Tongue',
        toHit: '14+F',
        damage: '2d6+4 Poison',
        range: '20ft range',
        effect: 'On hit: Paralyzed',
      },
    ],
    notes:
      'Great Leaper: can jump a distance equal to its Move.\nTongue: any hit applies Paralyzed.\n\nFull text: Core Rulebook p. 335.',
    source: 'Core Rulebook p. 335',
    chapter: 'Floor 3 · The Over City',
    floor: 3,
    description:
      'Part frog, part infantry, all nightmare fuel. The Grulke clears its entire Move in one hop, skewers you with a polearm, then licks you stiff. Pro tip: distance is a lie against something that jumps that far. Try not to get tongued; paralysis in here is just a slower way of getting eaten.',
    prevDescriptions: [
      "Part frog, part soldier, all bad news. The Grulke jumps its whole Move in one bound, pokes you with a polearm, and then licks you into paralysis. Pro tip: range doesn't save you from something that can leap that far. Try not to get licked.",
    ],
    prevNotes: [
      'Special: Great Leaper. Full text: Core Rulebook p. 335.',
      'Great Leaper: can jump a distance equal to its Move.\nTongue: any hit applies Paralyzed.\n\nFull text: Core Rulebook p. 335.',
    ],
    descriptionEs:
      'Parte rana, parte infantería, todo pesadillas. El Grulke se hace todo su Movimiento de un salto, te ensarta con un arma de asta y luego te deja tieso a lametazos. Pro-Tip: la distancia es mentira contra algo que salta tanto. Intenta que no te den lengua; aquí la parálisis solo es una forma más lenta de que te coman.',
    prevDescriptionsEs: [
      'Parte rana, parte infantería, todo pesadillas. El Grulke se hace todo su Movimiento de un salto, te ensarta con un arma de asta y luego te deja tieso a lametazos. Consejo pro: la distancia es mentira contra algo que salta tanto. Intenta que no te den lengua; aquí la parálisis solo es una forma más lenta de que te coman.',
    ],
  },
  {
    name: 'Over City Skyfowl',
    kind: 'mob',
    size: 'Medium (4)',
    tags: 'Humanoid',
    slots: '10',
    slotValue: '3',
    level: '13',
    surprise: '13+F',
    evade: '14+F',
    move: '30+S',
    dr: '3',
    stats: {
      str: {
        score: '11',
        mod: '+4',
      },
      int: {
        score: '7',
        mod: '+3',
      },
      con: {
        score: '7',
        mod: '+3',
      },
      dex: {
        score: '12',
        mod: '+4',
      },
      cha: {
        score: '7',
        mod: '+3',
      },
    },
    attacks: [
      {
        name: 'Crossbow',
        toHit: '14+F',
        damage: '3d6 Piercing',
        range: '30ft range',
        effect: '',
      },
      {
        name: 'Spear',
        toHit: '14+F',
        damage: '3d8+4 Piercing',
        range: '10ft range',
        effect: 'Major Fail+: Blood Trail',
      },
      {
        name: 'Grab',
        toHit: '14+F',
        damage: 'No damage',
        range: '5ft range',
        effect: 'On hit: Held',
      },
    ],
    notes:
      'Catch and Release: a Held crawler is carried 30ft up and dropped the following round.\nFlight: flies as if on the ground.\nRiled Up: in round one, adds its Stat Mod to damage twice.\nGrab: any hit applies Held.\n\nFull text: Core Rulebook p. 336.',
    source: 'Core Rulebook p. 336',
    chapter: 'Floor 3 · The Over City',
    floor: 3,
    description:
      "Bird-men with crossbows and a favorite party trick: grab a crawler, fly thirty feet up, and let go. Splat. They hit extra hard in round one, so show up with a plan instead of your dick in your hand. Pro tip: don't get grabbed. Gravity has never once lost on this show, and the sound design is fantastic.",
    prevDescriptions: [
      "Bird-people with crossbows and a hobby: picking you up and letting go from very high up. They hit extra hard in the opening round, so the first impression really counts. Pro tip: don't get grabbed. Gravity is undefeated on this show.",
    ],
    prevNotes: [
      'Special: Catch and Release; Flight; Riled Up. Full text: Core Rulebook p. 336.',
      'Catch and Release: a Held crawler is carried 30ft up and dropped the following round.\nFlight: flies as if on the ground.\nRiled Up: in round one, adds its Stat Mod to damage twice.\nGrab: any hit applies Held.\n\nFull text: Core Rulebook p. 336.',
    ],
    descriptionEs:
      'Hombres pájaro con ballestas y un truco favorito para las fiestas: agarrar a un crawler, subir treinta pies y soltarlo. Chof. Pegan extra fuerte en la primera ronda, así que preséntate con un plan y no con la polla en la mano. Pro-Tip: que no te agarren. La gravedad no ha perdido ni una sola vez en este programa, y el diseño de sonido es fantástico.',
    prevDescriptionsEs: [
      'Hombres pájaro con ballestas y un truco favorito para las fiestas: agarrar a un crawler, subir treinta pies y soltarlo. Chof. Pegan extra fuerte en la primera ronda, así que preséntate con un plan y no con la polla en la mano. Consejo pro: que no te agarren. La gravedad no ha perdido ni una sola vez en este programa, y el diseño de sonido es fantástico.',
    ],
  },
  {
    name: 'Dwarven Lift Engineer',
    kind: 'npc',
    size: 'Medium (4)',
    tags: 'NPC, Humanoid',
    slots: '10',
    slotValue: '5',
    level: '25',
    surprise: '15+F',
    evade: '14+F',
    move: '20+S',
    dr: '3',
    stats: {
      str: {
        score: '21',
        mod: '+5',
      },
      int: {
        score: '21',
        mod: '+5',
      },
      con: {
        score: '21',
        mod: '+5',
      },
      dex: {
        score: '10',
        mod: '+4',
      },
      cha: {
        score: '7',
        mod: '+3',
      },
    },
    attacks: [
      {
        name: 'Dance Dance Evolution',
        toHit: '14+F',
        damage: 'No damage',
        range: '5ft range',
        effect: 'On hit: Queasy',
      },
      {
        name: 'Disapproving Glare',
        toHit: '14+F',
        damage: '2d6+5 Psychic',
        range: '25ft range',
        effect: 'On hit: Terrified',
      },
      {
        name: 'Wrench',
        toHit: '15+F',
        damage: '3d6+5 Bludgeoning',
        range: '5ft range',
        effect: 'Major Fail+: Staggered',
      },
    ],
    notes:
      'Craft Master: can help a crawler craft, granting Advantage on crafting Skill Checks.\nDancing Queen: always spinning. A crawler trying to track its movements makes an Int-Opposed Tracking Skill Check; on Fail, they gain Fatigued.\nReady Access Tools: pulls any needed tool smaller than itself from its beard braids instantly.\nDance Dance Evolution: any hit applies Queasy.\nDisapproving Glare: any hit applies Terrified.\n\nFull text: Core Rulebook p. 340.',
    source: 'Core Rulebook p. 340',
    chapter: 'Floor 3 · The Over City',
    floor: 3,
    description:
      "The dwarf who keeps the stairwells running, never stops dancing, and pulls wrenches out of his beard like a magician with a hygiene problem. His glare hurts. Literally. Pro tip: kiss his boots and he'll help you craft like a master. Piss him off and he'll spin circles around you until you puke and pass out.",
    prevDescriptions: [
      "Meet the dwarf who keeps the stairwells running and never stops dancing. His beard is a toolbox, his wrench is a weapon, and his glare can actually hurt. Pro tip: be nice and he'll help you craft like a pro. Be rude and he'll dance circles around you until you pass out.",
    ],
    prevNotes: [
      'Special: Craft Master; Dancing Queen; Ready Access Tools. Full text: Core Rulebook p. 340.',
      'Craft Master: can help a crawler craft, granting Advantage on crafting Skill Checks.\nDancing Queen: always spinning. A crawler trying to track its movements makes an Int-Opposed Tracking Skill Check; on Fail, they gain Fatigued.\nReady Access Tools: pulls any needed tool smaller than itself from its beard braids instantly.\nDance Dance Evolution: any hit applies Queasy.\nDisapproving Glare: any hit applies Terrified.\n\nFull text: Core Rulebook p. 340.',
    ],
    descriptionEs:
      'El enano que mantiene las escaleras funcionando, que no para de bailar y que se saca llaves inglesas de la barba como un mago con problemas de higiene. Su mirada duele. Literalmente. Pro-Tip: hazle la pelota y te ayudará a fabricar como un maestro. Cabréalo y te dará vueltas alrededor hasta que vomites y te desmayes.',
    prevDescriptionsEs: [
      'El enano que mantiene las escaleras funcionando, que no para de bailar y que se saca llaves inglesas de la barba como un mago con problemas de higiene. Su mirada duele. Literalmente. Consejo pro: hazle la pelota y te ayudará a fabricar como un maestro. Cabréalo y te dará vueltas alrededor hasta que vomites y te desmayes.',
    ],
  },
  {
    name: 'Cat Girl',
    kind: 'crawler',
    size: 'Medium (4)',
    tags: 'Humanoid',
    slots: '10',
    slotValue: '4',
    level: '24',
    surprise: '15+F',
    evade: '15+F',
    move: '20+S',
    dr: '3',
    stats: {
      str: {
        score: '11',
        mod: '+4',
      },
      int: {
        score: '21',
        mod: '+5',
      },
      con: {
        score: '12',
        mod: '+4',
      },
      dex: {
        score: '21',
        mod: '+5',
      },
      cha: {
        score: '12',
        mod: '+4',
      },
    },
    attacks: [
      {
        name: 'Claw',
        toHit: '14+F',
        damage: '3d4+4 Slashing',
        range: '5ft range',
        effect: 'Major Fail+: Blood Trail',
      },
      {
        name: 'Hairball',
        toHit: '15+F',
        damage: '3d6 Acid',
        range: '20ft range',
        effect: 'Major Fail+: Burned',
      },
      {
        name: 'Tail Lash',
        toHit: '14+F',
        damage: '3d4+4 Bludgeoning',
        range: '5ft range',
        effect: 'On hit: Take Down',
      },
    ],
    notes:
      'Klepto: first meeting → each crawler rolls Int Stat Check; fail → loses one cheap worn item, unaware.\nPheromones: crawler joins her party → Int Stat Check; fail → obeys her first non-harmful suggestion.\nTail Lash: hit → Take Down.\n\nFull text: Core Rulebook p. 341.',
    source: 'Core Rulebook p. 341',
    chapter: 'Floor 3 · The Over City',
    floor: 3,
    description:
      'Purring, bendy, and already wearing your ring. She claws, whips you flat with her tail, and horks up acid hairballs, and somehow you still want to say yes to whatever she suggests. Pro tip: pat your pockets after every chat. The viewers are running a betting pool on what she lifts next, and your dignity is the favorite.',
    prevDescriptions: [
      "She's charming, she's agile, she's already got your ring. The Cat Girl claws, lashes, coughs up acid hairballs, and makes you want to say yes to things. Pro tip: check your pockets after every conversation. Then check them again. Viewers are betting on what she takes next.",
    ],
    prevNotes: [
      'Special: Klepto; Pheromones. Full text: Core Rulebook p. 341.',
      'Klepto: first meeting → each crawler rolls Int Stat Check; fail → loses one cheap worn item, unaware.\nPheromones: crawler joins her party → Int Stat Check; fail → obeys her first non-harmful suggestion.\nTail Lash: hit → Take Down.\n\nFull text: Core Rulebook p. 341.',
    ],
    descriptionEs:
      'Ronronea, es flexible y ya lleva puesto tu anillo. Araña, te tumba de un coletazo y escupe bolas de pelo ácidas, y aun así te mueres por decir que sí a todo lo que te propone. Pro-Tip: palpa tus bolsillos después de cada charla. Los espectadores tienen una porra montada sobre qué te birlará después, y tu dignidad es la favorita.',
    prevDescriptionsEs: [
      'Ronronea, es flexible y ya lleva puesto tu anillo. Araña, te tumba de un coletazo y escupe bolas de pelo ácidas, y aun así te mueres por decir que sí a todo lo que te propone. Consejo pro: palpa tus bolsillos después de cada charla. Los espectadores tienen una porra montada sobre qué te birlará después, y tu dignidad es la favorita.',
    ],
  },
  {
    name: 'Centurion Skyfowl',
    kind: 'boss',
    size: 'Huge (6)',
    tags: 'Neighborhood Boss, Beastly',
    slots: '13',
    slotValue: '5',
    level: '25',
    surprise: '14+F',
    evade: '15+F',
    move: '30+S',
    dr: '3',
    stats: {
      str: {
        score: '21',
        mod: '+5',
      },
      int: {
        score: '11',
        mod: '+4',
      },
      con: {
        score: '21',
        mod: '+5',
      },
      dex: {
        score: '21',
        mod: '+5',
      },
      cha: {
        score: '6',
        mod: '+3',
      },
    },
    attacks: [
      {
        name: 'Aerial Head Slam',
        toHit: '15+F',
        damage: '2d10+5 Bludgeoning',
        range: '5 ft range',
        effect: 'On hit: Staggered, Take Down',
      },
      {
        name: 'Sonic Screech',
        toHit: '14+F',
        damage: '2d10+4 Sonic',
        range: '30ft Cone,',
        effect: 'Major Fail+: Terrified',
      },
      {
        name: 'Talon Slash',
        toHit: '15+F',
        damage: '3d8+5 Slashing',
        range: '5ft range,',
        effect: 'Major Fail+: Blood Trail',
      },
    ],
    notes:
      "Heavy Hitter: previous attack hit a crawler → that crawler's next Evade at Disadvantage; previous attack missed → next Evade at Advantage.\nFlight: air movement works like ground movement.\nAerial Head Slam: hit → Staggered + Take Down.\nSonic Screech: +5ft Splash.\nTalon Slash: Armor-Piercing.\n\nFull text: Core Rulebook p. 342.",
    source: 'Core Rulebook p. 342',
    chapter: 'Floor 3 · The Over City',
    floor: 3,
    description:
      "A huge, hard-bitten bird who's seen some shit and screams about it in a cone. It dive-bombs your skull and rakes clean through armor. Pro tip: once it tags you, it keeps tagging you, so dodge that first hit and the next gets easier. Fail, and the coroner's report writes itself: death by chicken.",
    prevDescriptions: [
      "A huge, hard-boiled bird who's seen too much and screams about it. It dive-bombs your skull, rakes through armor, and screeches in a cone. Pro tip: once it tags you, it keeps tagging you. Dodge the first hit and the next one gets easier. Miss it, and it's a very short case.",
    ],
    prevNotes: [
      'Special: Heavy Hitter; Flight. Full text: Core Rulebook p. 342.',
      "Heavy Hitter: previous attack hit a crawler → that crawler's next Evade at Disadvantage; previous attack missed → next Evade at Advantage.\nFlight: air movement works like ground movement.\nAerial Head Slam: hit → Staggered + Take Down.\nSonic Screech: +5ft Splash.\nTalon Slash: Armor-Piercing.\n\nFull text: Core Rulebook p. 342.",
    ],
    descriptionEs:
      'Un pajarraco enorme y curtido que ha visto mucha mierda y la grita en forma de cono. Se lanza en picado contra tu cráneo y te raja atravesando la armadura. Pro-Tip: cuando te marca, te sigue marcando, así que esquiva ese primer golpe y el siguiente será más fácil. Si fallas, el informe del forense se escribe solo: muerte por pollo.',
    prevDescriptionsEs: [
      'Un pajarraco enorme y curtido que ha visto mucha mierda y la grita en forma de cono. Se lanza en picado contra tu cráneo y te raja atravesando la armadura. Consejo pro: cuando te marca, te sigue marcando, así que esquiva ese primer golpe y el siguiente será más fácil. Si fallas, el informe del forense se escribe solo: muerte por pollo.',
    ],
  },
  {
    name: 'Beat Cop',
    kind: 'mob',
    size: 'Medium (4)',
    tags: 'Construct',
    slots: '10',
    slotValue: '4',
    level: '10',
    surprise: '11+F',
    evade: '12+F',
    move: '20+S',
    dr: '3',
    stats: {
      str: {
        score: '12',
        mod: '+4',
      },
      int: {
        score: '2',
        mod: '+1',
      },
      con: {
        score: '10',
        mod: '+4',
      },
      dex: {
        score: '5',
        mod: '+2',
      },
      cha: {
        score: '6',
        mod: '+3',
      },
    },
    attacks: [
      {
        name: 'Beatbox',
        toHit: '13+F',
        damage: '2d8+3 Sonic',
        range: '15ft Burst radius',
        effect: '',
      },
      {
        name: 'Truncheon',
        toHit: '14+F',
        damage: '3d6+4 Bludgeoning',
        range: '5ft range',
        effect: '',
      },
    ],
    notes:
      "It's Curtains for You: a crawler who sees two or more Beat Cops dancing together makes a Cha Stat Check vs 10+F + the number of Beat Cops; on Fail, gains Terrified.\nOn the Beat: adjacent Beat Cops using the same attack in a round each get +1 to hit and damage per adjacent attacking Beat Cop (max +3). A crawler hit for 3+ HB slots may make a free Unopposed Performance Skill Check; on Success they read the rhythm and add Int to Evade vs these attacks. Once one crawler spots it, all crawlers get the bonus.\nRobot: immune to Psychic, DR 0 vs Electric. Can still bleed (oil) and be poisoned (corrosion).\n\nFull text: Core Rulebook p. 345.",
    source: 'Core Rulebook p. 345',
    chapter: 'Floor 3 · The Over City',
    floor: 3,
    description:
      'Robot cops who dance in perfect sync and beat your ass in perfect time. The choreography is honestly Emmy-worthy. Pro tip: take a big enough hit and you might catch the rhythm, and then everybody can dodge to the beat. Also, zap them. Electricity goes straight through these tin-plated bastards.',
    prevDescriptions: [
      'Robot police officers who dance in perfect sync and beat you in perfect time. Honestly the choreography is award-worthy. Pro tip: learn the routine. Take a big enough hit and you might catch the rhythm. Also, electricity. These guys hate it.',
    ],
    prevNotes: [
      'Special: It’s Curtains for You; On the Beat; Robot; Probably! (They bleed oil and suffer corrosion. Full text: Core Rulebook p. 345.',
      "It's Curtains for You: a crawler who sees two or more Beat Cops dancing together makes a Cha Stat Check vs 10+F + the number of Beat Cops; on Fail, gains Terrified.\nOn the Beat: adjacent Beat Cops using the same attack in a round each get +1 to hit and damage per adjacent attacking Beat Cop (max +3). A crawler hit for 3+ HB slots may make a free Unopposed Performance Skill Check; on Success they read the rhythm and add Int to Evade vs these attacks. Once one crawler spots it, all crawlers get the bonus.\nRobot: immune to Psychic, DR 0 vs Electric. Can still bleed (oil) and be poisoned (corrosion).\n\nFull text: Core Rulebook p. 345.",
    ],
    descriptionEs:
      'Polis robot que bailan perfectamente sincronizados y te revientan el culo perfectamente a ritmo. Sinceramente, la coreografía es de Emmy. Pro-Tip: si te llevas un golpe lo bastante gordo, quizá pilles el ritmo, y entonces todo el mundo podrá esquivar al compás. Y otra cosa: electrocútalos. La electricidad atraviesa de lado a lado a estos cabrones de hojalata.',
    prevDescriptionsEs: [
      'Polis robot que bailan perfectamente sincronizados y te revientan el culo perfectamente a ritmo. Sinceramente, la coreografía es de Emmy. Consejo pro: si te llevas un golpe lo bastante gordo, quizá pilles el ritmo, y entonces todo el mundo podrá esquivar al compás. Y otra cosa: electrocútalos. La electricidad atraviesa de lado a lado a estos cabrones de hojalata.',
    ],
  },
  {
    name: 'Effective Detective',
    kind: 'mob',
    size: 'Medium (4)',
    tags: 'Humanoid',
    slots: '10',
    slotValue: '3',
    level: '15',
    surprise: '15+F',
    evade: '14+F',
    move: '20+S',
    dr: '3',
    stats: {
      str: {
        score: '11',
        mod: '+4',
      },
      int: {
        score: '20',
        mod: '+5',
      },
      con: {
        score: '6',
        mod: '+3',
      },
      dex: {
        score: '10',
        mod: '+4',
      },
      cha: {
        score: '3',
        mod: '+2',
      },
    },
    attacks: [
      {
        name: 'Gat',
        toHit: '14+F',
        damage: '2d10 Piercing',
        range: '100ft range',
        effect: '',
      },
      {
        name: 'Lowdown Peeper (Spell)',
        toHit: '15+F',
        damage: '2d4+5 Psychic',
        range: '30ft range',
        effect: 'Major Fail+: Queasy',
      },
      {
        name: 'Punch',
        toHit: '14+F',
        damage: '3d6+4 Bludgeoning',
        range: '5ft range',
        effect: 'On hit: Collared',
      },
    ],
    notes:
      "Qualified Immunity: its badge becomes a full shield, +2 DR vs foes directly in front. Several standing side by side form a phalanx: +4 DR, but their Step drops to 0ft.\nPunch: any hit applies Collared (can't use attacks above Rank 5).\n\nFull text: Core Rulebook p. 346.",
    source: 'Core Rulebook p. 346',
    chapter: 'Floor 3 · The Over City',
    floor: 3,
    description:
      "A noir detective with a badge that becomes a riot shield and a punch that makes you forget all your good moves. Line up a few and you've got a wall of pure qualified immunity. Pro tip: go around, not through. Locked in formation they can't take a single step, so flank the smug pricks.",
    prevDescriptions: [
      "A noir detective with a badge that turns into a riot shield and a punch that makes you forget your good moves. Line a few up and you've got a wall of legal immunity. Pro tip: go around the shield, not through it. They can't step when they're locked together.",
    ],
    prevNotes: [
      'Special: Qualified Immunity. Full text: Core Rulebook p. 346.',
      "Qualified Immunity: its badge becomes a full shield, +2 DR vs foes directly in front. Several standing side by side form a phalanx: +4 DR, but their Step drops to 0ft.\nPunch: any hit applies Collared (can't use attacks above Rank 5).\n\nFull text: Core Rulebook p. 346.",
    ],
    descriptionEs:
      'Un detective de cine negro con una placa que se convierte en escudo antidisturbios y un puñetazo que te hace olvidar todos tus buenos movimientos. Pon a unos cuantos en fila y tendrás un muro de pura impunidad policial. Pro-Tip: rodéalos, no intentes atravesarlos. En formación no pueden dar ni un paso, así que flanquea a esos capullos engreídos.',
    prevDescriptionsEs: [
      'Un detective de cine negro con una placa que se convierte en escudo antidisturbios y un puñetazo que te hace olvidar todos tus buenos movimientos. Pon a unos cuantos en fila y tendrás un muro de pura impunidad policial. Consejo pro: rodéalos, no intentes atravesarlos. En formación no pueden dar ni un paso, así que flanquea a esos capullos engreídos.',
    ],
  },
  {
    name: 'Mook',
    kind: 'mob',
    size: 'Medium (4)',
    tags: 'Humanoid',
    slots: '10',
    slotValue: '4',
    level: '17',
    surprise: '13+F',
    evade: '14+F',
    move: '20+S',
    dr: '3',
    stats: {
      str: {
        score: '16',
        mod: '+4',
      },
      int: {
        score: '6',
        mod: '+3',
      },
      con: {
        score: '13',
        mod: '+4',
      },
      dex: {
        score: '12',
        mod: '+4',
      },
      cha: {
        score: '8',
        mod: '+3',
      },
    },
    attacks: [
      {
        name: 'Improvised Melee Weapon',
        toHit: '14+F',
        damage: '3d6+4 Bludgeoning',
        range: '5ft range',
        effect: '',
      },
      {
        name: 'Improvised Thrown Weapon',
        toHit: '14+F',
        damage: '3d6+4 Slashing',
        range: '20ft range',
        effect: '',
      },
      {
        name: 'Big Fuckin’ Insult',
        toHit: '13+F',
        damage: 'No damage',
        range: '60ft range',
        effect: 'On hit: Enraged, Terrified',
      },
    ],
    notes:
      "Yer Goin' Down with Me: below half its HB slots, gains Enraged: fixates on whoever last damaged it, +2 to hit and damage.\nBig Fuckin' Insult: any hit applies Enraged or Terrified (GM picks based on the crawler's personality).\n\nFull text: Core Rulebook p. 346.",
    source: 'Core Rulebook p. 346',
    chapter: 'Floor 3 · The Over City',
    floor: 3,
    description:
      "The Mook: a guy with a chair leg, a bad attitude, and a mouth that actually hurts. He throws furniture, screams insults that stick, and gets angrier the closer he is to death. Pro tip: whoever makes him bleed had better finish the job, because a dying Mook remembers exactly whose ass he's taking with him.",
    prevDescriptions: [
      "The Mook: a guy with a chair leg, a bad attitude, and nothing to lose. He'll throw furniture, hurl insults that actually do something, and get angrier the closer he gets to dying. Pro tip: whoever lands the big hit had better finish him, because he's coming for you next.",
    ],
    prevNotes: [
      'Special: Yer Goin’ Down with Me. Full text: Core Rulebook p. 346.',
      "Yer Goin' Down with Me: below half its HB slots, gains Enraged: fixates on whoever last damaged it, +2 to hit and damage.\nBig Insult: any hit applies Enraged or Terrified (GM picks based on the crawler's personality).\n\nFull text: Core Rulebook p. 346.",
    ],
    descriptionEs:
      'El Mook: un tío con una pata de silla, mala leche y una boca que duele de verdad. Lanza muebles, suelta insultos que se te quedan pegados y se cabrea más cuanto más cerca está de palmarla. Pro-Tip: al que lo haga sangrar más le vale rematarlo, porque un Mook moribundo recuerda perfectamente a quién se va a llevar por delante.',
    prevDescriptionsEs: [
      'El Mook: un tío con una pata de silla, mala leche y una boca que duele de verdad. Lanza muebles, suelta insultos que se te quedan pegados y se cabrea más cuanto más cerca está de palmarla. Consejo pro: al que lo haga sangrar más le vale rematarlo, porque un Mook moribundo recuerda perfectamente a quién se va a llevar por delante.',
    ],
  },
  {
    name: 'Gumshoe',
    kind: 'mob',
    size: 'Medium (4)',
    tags: 'Humanoid',
    slots: '10',
    slotValue: '4',
    level: '19',
    surprise: '15+F',
    evade: '15+F',
    move: '20+S',
    dr: '3',
    stats: {
      str: {
        score: '3',
        mod: '+2',
      },
      int: {
        score: '20',
        mod: '+5',
      },
      con: {
        score: '16',
        mod: '+4',
      },
      dex: {
        score: '20',
        mod: '+5',
      },
      cha: {
        score: '3',
        mod: '+2',
      },
    },
    attacks: [
      {
        name: 'Exposé Spell',
        toHit: '15+F',
        damage: '2d8+5 Psychic',
        range: '60ft range, 15ft Blast radius',
        effect: 'On hit: Dodgy Reputation, Any, This',
      },
      {
        name: 'Gat',
        toHit: '15+F',
        damage: '3d10 Piercing',
        range: '100ft range',
        effect: '',
      },
    ],
    notes:
      'Clean Sneak: may Hide in Shadows; spotting one needs an Int-Opposed Perception Skill Check, fail → Gumshoes Ambush automatically.\nGlom a Bulge: swap its attack for a called-out tip → chosen ally has Advantage attacking that target.\nGrab Air: Move can vault occupied spaces with no Interrupts triggered, ending up to 10ft above the start point.\nExposé Spell: hit → Int Stat Check; fail → Dodgy Reputation: Gumshoe names another crawler in the fight, whose Buffs stop affecting the victim for the encounter. Stacks per distinct named crawler.\n\nFull text: Core Rulebook p. 347.',
    source: 'Core Rulebook p. 347',
    chapter: 'Floor 3 · The Over City',
    floor: 3,
    description:
      "Private dicks with public mouths. Gumshoes lurk in the shadows, vault over your heads, point out your soft spots to their buddies, and spill your teammates' dirty laundry until their buffs stop working on you. Pro tip: spot them before they ambush you. And stop reading the gossip. It's all true, and it's disgusting.",
    prevDescriptions: [
      'Private eyes with public mouths. The Gumshoe hides, leaps, feeds tips to buddies, and fills your HUD with dirty secrets about your own teammates. Pro tip: trust issues are a real debuff here. Spot them before they spot you, and never read the tabloids mid-fight.',
    ],
    prevNotes: [
      'Special: Clean Sneak; Glom a Bulge; Grab Air. Full text: Core Rulebook p. 347.',
      'Clean Sneak: may Hide in Shadows; spotting one needs an Int-Opposed Perception Skill Check, fail → Gumshoes Ambush automatically.\nGlom a Bulge: swap its attack for a called-out tip → chosen ally has Advantage attacking that target.\nGrab Air: Move can vault occupied spaces with no Interrupts triggered, ending up to 10ft above the start point.\nExposé Spell: hit → Int Stat Check; fail → Dodgy Reputation: Gumshoe names another crawler in the fight, whose Buffs stop affecting the victim for the encounter. Stacks per distinct named crawler.\n\nFull text: Core Rulebook p. 347.',
    ],
    descriptionEs:
      'Sabuesos privados con bocazas públicas. Los Gumshoes acechan en las sombras, saltan por encima de vuestras cabezas, señalan vuestros puntos débiles a sus colegas y airean los trapos sucios de tus compañeros hasta que sus Buffs dejan de funcionar contigo. Pro-Tip: detéctalos antes de que te embosquen. Y deja de leer los cotilleos. Es todo verdad, y da asco.',
    prevDescriptionsEs: [
      'Sabuesos privados con bocazas públicas. Los Gumshoes acechan en las sombras, saltan por encima de vuestras cabezas, señalan vuestros puntos débiles a sus colegas y airean los trapos sucios de tus compañeros hasta que sus Buffs dejan de funcionar contigo. Consejo pro: detéctalos antes de que te embosquen. Y deja de leer los cotilleos. Es todo verdad, y da asco.',
    ],
  },
  {
    name: 'Gun Doll',
    kind: 'mob',
    size: 'Small (2)',
    tags: 'Construct',
    slots: '10',
    slotValue: '3',
    level: '20',
    surprise: '13+F',
    evade: '15+F',
    move: '20+S',
    dr: '3',
    stats: {
      str: {
        score: '11',
        mod: '+3',
      },
      int: {
        score: '14',
        mod: '+3',
      },
      con: {
        score: '6',
        mod: '+3',
      },
      dex: {
        score: '22',
        mod: '+5',
      },
      cha: {
        score: '12',
        mod: '+4',
      },
    },
    attacks: [
      {
        name: 'Bean Shooter',
        toHit: '15+F',
        damage: '3d6 Piercing',
        range: '80ft range',
        effect: '',
      },
      {
        name: 'Pocket Knife',
        toHit: '15+F',
        damage: '3d6+3 Piercing',
        range: '5ft range,',
        effect: 'Major Fail+: Blood Trail',
      },
    ],
    notes:
      "Blues Got You Down: melee kill on one → killer's next attack at Disadvantage.\nSwarm: ≤6 fit in one Medium+ creature's space. Mass climb onto a single target → each gets Advantage on its first attack vs it.\nPocket Knife: Armor-Piercing.\n\nFull text: Core Rulebook p. 347.",
    source: 'Core Rulebook p. 347',
    chapter: 'Floor 3 · The Over City',
    floor: 3,
    description:
      "Porcelain, pint-sized, armed, and clinically depressed. Gun Dolls snipe from range, then pile onto you like a toy box full of switchblades. Stab one to death up close and her sadness rubs off on you. Pro tip: shoot them from far away. Emotional damage is still damage, and you're already a fucking mess.",
    prevDescriptions: [
      "Small, porcelain, armed, and very sad. Gun Dolls snipe from range, then swarm you like a knife-wielding toy chest. Kill one up close and she'll ruin your whole mood. Pro tip: shoot them from far away. Emotional damage is still damage.",
    ],
    prevNotes: [
      'Special: Blues Got You Down; Swarm. Full text: Core Rulebook p. 347.',
      "Blues Got You Down: melee kill on one → killer's next attack at Disadvantage.\nSwarm: ≤6 fit in one Medium+ creature's space. Mass climb onto a single target → each gets Advantage on its first attack vs it.\nPocket Knife: Armor-Piercing.\n\nFull text: Core Rulebook p. 347.",
    ],
    descriptionEs:
      'De porcelana, tamaño bolsillo, armadas y con depresión clínica. Las Gun Dolls disparan desde lejos y luego se te echan encima como un baúl de juguetes lleno de navajas automáticas. Apuñala a una hasta matarla de cerca y se te pega su tristeza. Pro-Tip: dispárales desde lejos. El daño emocional sigue siendo daño, y tú ya eres un puto desastre.',
    prevDescriptionsEs: [
      'De porcelana, tamaño bolsillo, armadas y con depresión clínica. Las Gun Dolls disparan desde lejos y luego se te echan encima como un baúl de juguetes lleno de navajas automáticas. Apuñala a una hasta matarla de cerca y se te pega su tristeza. Consejo pro: dispárales desde lejos. El daño emocional sigue siendo daño, y tú ya eres un puto desastre.',
    ],
  },
  {
    name: 'Torpedo',
    kind: 'mob',
    size: 'Medium (4)',
    tags: 'Shark, Humanoid',
    slots: '10',
    slotValue: '4',
    level: '17',
    surprise: '12+F',
    evade: '15+F',
    move: '20+S',
    dr: '4',
    stats: {
      str: {
        score: '20',
        mod: '+5',
      },
      int: {
        score: '3',
        mod: '+2',
      },
      con: {
        score: '10',
        mod: '+4',
      },
      dex: {
        score: '20',
        mod: '+5',
      },
      cha: {
        score: '3',
        mod: '+2',
      },
    },
    attacks: [
      {
        name: 'Chomp',
        toHit: '15+F',
        damage: '3d8+5 Piercing',
        range: '5ft range',
        effect: '',
      },
      {
        name: 'Submachine Gun',
        toHit: '14+F',
        damage: '2d10 Piercing',
        range: '60ft Cone',
        effect: 'Special effect',
      },
      {
        name: 'Torpedo',
        toHit: '15+F',
        damage: '2d12+5 Fire',
        range: '15ft Burst radius',
        effect: 'On hit: Burned; once per combat',
      },
    ],
    notes:
      "Blow 'Em Down: ignores friendly fire and bystanders; happily hits allies with the Submachine Gun or anything else.\nTorpedo: any hit applies Burned. Once per combat, and the Torpedo takes the full damage too.\n\nFull text: Core Rulebook p. 348.",
    source: 'Core Rulebook p. 348',
    chapter: 'Floor 3 · The Over City',
    floor: 3,
    description:
      "A shark in a pinstripe suit with a tommy gun, a torpedo, and no concept of friendly fire. He'll spray his own crew to hit you. Pro tip: he only gets one torpedo, and he eats the blast too. Keep your distance and let the dumb bastard blow himself up. Nature's way of saying stay in the ocean.",
    prevDescriptions: [
      "A shark in a suit with a tommy gun and a torpedo. He's here for his mark, and he doesn't care who else gets sprayed. Pro tip: hang back and let him blow himself up. He only gets one big boom, and he eats it too.",
    ],
    prevNotes: [
      'Special: Blow ’Em Down. Full text: Core Rulebook p. 348.',
      "Blow 'Em Down: ignores friendly fire and bystanders; happily hits allies with the Submachine Gun or anything else.\nTorpedo: any hit applies Burned. Once per combat, and the Torpedo takes the full damage too.\n\nFull text: Core Rulebook p. 348.",
    ],
    descriptionEs:
      'Un tiburón con traje de raya diplomática, una metralleta Thompson, un torpedo y ni idea de lo que es el fuego amigo. Acribillará a su propia banda con tal de darte. Pro-Tip: solo tiene un torpedo, y él también se come la explosión. Mantén las distancias y deja que el muy imbécil se reviente solo. Es la forma que tiene la naturaleza de decirle que se quede en el océano.',
    prevDescriptionsEs: [
      'Un tiburón con traje de raya diplomática, una metralleta Thompson, un torpedo y ni idea de lo que es el fuego amigo. Acribillará a su propia banda con tal de darte. Consejo pro: solo tiene un torpedo, y él también se come la explosión. Mantén las distancias y deja que el muy imbécil se reviente solo. Es la forma que tiene la naturaleza de decirle que se quede en el océano.',
    ],
  },
  {
    name: 'Songstress',
    kind: 'npc',
    size: 'Medium (4)',
    tags: 'NPC, Humanoid',
    slots: '8',
    slotValue: '2',
    level: '8',
    surprise: '12+F',
    evade: '13+F',
    move: '20+S',
    dr: '3',
    stats: {
      str: {
        score: '3',
        mod: '+2',
      },
      int: {
        score: '5',
        mod: '+2',
      },
      con: {
        score: '3',
        mod: '+2',
      },
      dex: {
        score: '7',
        mod: '+3',
      },
      cha: {
        score: '11',
        mod: '+4',
      },
    },
    attacks: [
      {
        name: '38 Special',
        toHit: '13+F',
        damage: '2d6 Piercing',
        range: '20ft range',
        effect: '',
      },
      {
        name: 'Blow a Kiss',
        toHit: '12+F',
        damage: '2d4+2 Psychic',
        range: '10ft range',
        effect: 'On hit: Woozy',
      },
    ],
    notes:
      'Sultry Singer: hears her song → Int Stat Check; Fail → Captivated (deaf to all else while she sings).\nBlow a Kiss: hit → Woozy.\n\nFull text: Core Rulebook p. 352.',
    source: 'Core Rulebook p. 352',
    chapter: 'Floor 3 · The Over City',
    floor: 3,
    description:
      "She sings like smoke and honey and keeps a .38 tucked in her garter. One verse and you won't hear your party screaming; one blown kiss and you're seeing double. Pro tip: earplugs. Or a teammate so tone-deaf her song bounces off. Nothing kills a mood like a sultry lounge act ending in a gunshot.",
    prevDescriptions: [
      "She sings like a velvet dream and keeps a .38 in her garter. One song and you won't hear your party screaming. One kiss and you're seeing double. Pro tip: bring earplugs, or at least bring a friend who hates jazz.",
    ],
    prevNotes: [
      'Special: Sultry Singer. Full text: Core Rulebook p. 352.',
      'Sultry Singer: hears her song → Int Stat Check; Fail → Captivated (deaf to all else while she sings).\nBlow a Kiss: hit → Woozy.\n\nFull text: Core Rulebook p. 352.',
    ],
    descriptionEs:
      'Canta como humo y miel y guarda un .38 en la liga. Una estrofa y dejarás de oír los gritos de tu grupo; un beso al aire y lo verás todo doble. Pro-Tip: tapones para los oídos. O un compañero tan duro de oído que la canción le rebote. Nada mata el ambiente como un número de club sensual que acaba en disparo.',
    prevDescriptionsEs: [
      'Canta como humo y miel y guarda un .38 en la liga. Una estrofa y dejarás de oír los gritos de tu grupo; un beso al aire y lo verás todo doble. Consejo pro: tapones para los oídos. O un compañero tan duro de oído que la canción le rebote. Nada mata el ambiente como un número de club sensual que acaba en disparo.',
    ],
  },
  {
    name: 'The Divider',
    kind: 'boss',
    size: 'Colossal (7)',
    tags: 'Neighborhood Boss, Monstrous',
    slots: '13',
    slotValue: '5',
    level: '27',
    surprise: '14+F',
    evade: '15+F',
    move: '25+S',
    dr: '4',
    stats: {
      str: {
        score: '31',
        mod: '+5',
      },
      int: {
        score: '15',
        mod: '+4',
      },
      con: {
        score: '27',
        mod: '+5',
      },
      dex: {
        score: '23',
        mod: '+5',
      },
      cha: {
        score: '10',
        mod: '+4',
      },
    },
    attacks: [
      {
        name: 'Bite',
        toHit: '15+F',
        damage: '3d10+5 Piercing',
        range: '15ft range',
        effect: 'Major Fail+: Held, Drowning',
      },
      {
        name: 'Tail Swipe',
        toHit: '15+F',
        damage: '2d10+5 Bludgeoning',
        range: '60ft Cone',
        effect: 'On hit: Drowning',
      },
    ],
    notes:
      "Eating With Your Mouth Full: a mouth gripping a crawler can't Bite unless it lets go; Held crawler is dragged along free (no Move/Step cost).\nEasily Distracted: 1+ decoys or dummy boats present → −1 attack for 1d4 rounds.\nEnormous Size: in water, may pass through smaller creatures/objects, shoving them 10ft sideways to its path; Disadvantage on attacks within 20ft of shore.\nSwim: water counts as ground for movement.\nBite: Held crawler rolls Escape Artist (Str-Opposed) or Str Stat Check, same Difficulty; Fail → pulled under, Drowning.\nTail Swipe: each boat in cone 50% to capsize (pilot may roll a fitting Unopposed Skill Check to stop it); swimmers in cone roll Swimming Skill Check, Fail → Drowning.\n\nFull text: Core Rulebook p. 354.",
    source: 'Core Rulebook p. 354',
    chapter: 'Floor 3 · The Over City',
    floor: 3,
    description:
      "It's colossal, it's got multiple mouths, and it lives right under your shitty little boat. It grabs, dives, drowns, and flips dinghies with a tail swipe. Pro tip: it's a sucker for decoys and gets clumsy near the shore. Hug the beach and pray your swimming lessons stuck, because I'm not sending a lifeguard.",
    prevDescriptions: [
      "It's colossal, it's got more than one mouth, and it lives under your boat. It grabs, it dives, it swats waves big enough to flip your little dinghy. Pro tip: it's a sucker for decoys and hates shallow water. Hug the shore and pray your swimming lessons stuck.",
    ],
    prevNotes: [
      'Special: Eating With Your Mouth Full; Easily Distracted; Enormous Size; Swim. Full text: Core Rulebook p. 354.',
      "Eating With Your Mouth Full: a mouth gripping a crawler can't Bite unless it lets go; Held crawler is dragged along free (no Move/Step cost).\nEasily Distracted: 1+ decoys or dummy boats present → −1 attack for 1d4 rounds.\nEnormous Size: in water, may pass through smaller creatures/objects, shoving them 10ft sideways to its path; Disadvantage on attacks within 20ft of shore.\nSwim: water counts as ground for movement.\nBite: Held crawler rolls Escape Artist (Str-Opposed) or Str Stat Check, same Difficulty; Fail → pulled under, Drowning.\nTail Swipe: each boat in cone 50% to capsize (pilot may roll a fitting Unopposed Skill Check to stop it); swimmers in cone roll Swimming Skill Check, Fail → Drowning.\n\nFull text: Core Rulebook p. 354.",
    ],
    descriptionEs:
      'Es colosal, tiene varias bocas y vive justo debajo de tu mierda de barquito. Agarra, se sumerge, ahoga y vuelca botes de un coletazo. Pro-Tip: cae como una tonta con los señuelos y se vuelve torpe cerca de la orilla. Pégate a la playa y reza por que tus clases de natación sirvieran de algo, porque no pienso mandar socorrista.',
    prevDescriptionsEs: [
      'Es colosal, tiene varias bocas y vive justo debajo de tu mierda de barquito. Agarra, se sumerge, ahoga y vuelca botes de un coletazo. Consejo pro: cae como una tonta con los señuelos y se vuelve torpe cerca de la orilla. Pégate a la playa y reza por que tus clases de natación sirvieran de algo, porque no pienso mandar socorrista.',
    ],
  },
  {
    name: 'Merry Militiaman',
    kind: 'mob',
    size: 'Medium (4)',
    tags: 'Humanoid',
    slots: '10',
    slotValue: '4',
    level: '15',
    surprise: '14+F',
    evade: '14+F',
    move: '20+S',
    dr: '3',
    stats: {
      str: {
        score: '11',
        mod: '+4',
      },
      int: {
        score: '10',
        mod: '+4',
      },
      con: {
        score: '11',
        mod: '+4',
      },
      dex: {
        score: '11',
        mod: '+4',
      },
      cha: {
        score: '7',
        mod: '+3',
      },
    },
    attacks: [
      {
        name: 'Apito’s Blow',
        toHit: '14+F',
        damage: '3d6+4 Bludgeoning',
        range: '5ft range',
        effect: '',
      },
      {
        name: 'Apito’s Double Barrel Spell',
        toHit: '14+F',
        damage: '3d4+4 Necrotic',
        range: '50ft range',
        effect: 'Special effect',
      },
      {
        name: 'Apito’s Shower Spell',
        toHit: '14+F',
        damage: '2d8+4 Necrotic',
        range: '60ft range',
        effect: 'Special effect',
      },
      {
        name: 'Apito’s Thirst Spell',
        toHit: '14+F',
        damage: '3d6+4 Piercing',
        range: '30ft range',
        effect: 'Major Fail+: Blood Drain',
      },
    ],
    notes:
      "Apito's Double Barrel Spell: one attack can target up to two creatures.\nApito's Shower Spell: 10ft Blast radius.\nBlood Drain (Apito's Thirst Spell): 1d8+F Necrotic at end of each round and the Militiaman heals 1 HB, until combat ends.\n\nFull text: Core Rulebook p. 357.",
    source: 'Core Rulebook p. 357',
    chapter: 'Floor 3 · The Over City',
    floor: 3,
    description:
      "Holiday cheer, but with a body count. This festive fucker clubs you, double-taps two of you with one spell, rains necrotic sparkles on the whole party, and sips your blood to stay jolly. Pro tip: kill him fast or he'll heal off your wounds all night. Tis the season to bleed out.",
    prevDescriptions: [
      "Holiday cheer, but make it militant. This guy clubs you, blasts two of you at once, rains necrotic sparkle all over the party, and sips your blood to top himself off. Pro tip: kill him fast or he'll heal off your wounds all night.",
    ],
    prevNotes: [
      'Full text: Core Rulebook p. 357.',
      "Apito's Double Barrel Spell: one attack can target up to two creatures.\nApito's Shower Spell: 10ft Blast radius.\nBlood Drain (Apito's Thirst Spell): 1d8+F Necrotic at end of each round and the Militiaman heals 1 HB, until combat ends.\n\nFull text: Core Rulebook p. 357.",
    ],
    descriptionEs:
      'Espíritu navideño, pero con lista de muertos. Este cabrón festivo te apalea, dispara a dos de vosotros a la vez con un solo hechizo, hace llover purpurina necrótica sobre todo el grupo y te sorbe la sangre para seguir de buen humor. Pro-Tip: mátalo rápido o se pasará la noche curándose con tus heridas. Noche de paz, noche de desangrarse.',
    prevDescriptionsEs: [
      'Espíritu navideño, pero con lista de muertos. Este cabrón festivo te apalea, dispara a dos de vosotros a la vez con un solo hechizo, hace llover purpurina necrótica sobre todo el grupo y te sorbe la sangre para seguir de buen humor. Consejo pro: mátalo rápido o se pasará la noche curándose con tus heridas. Noche de paz, noche de desangrarse.',
    ],
  },
  {
    name: 'Gobblin’ Hog',
    kind: 'mob',
    size: 'Medium (4)',
    tags: 'Monstrous',
    slots: '10',
    slotValue: '4',
    level: '12',
    surprise: '11+F',
    evade: '14+F',
    move: '30+S',
    dr: '3',
    stats: {
      str: {
        score: '13',
        mod: '+4',
      },
      int: {
        score: '1',
        mod: '+1',
      },
      con: {
        score: '10',
        mod: '+4',
      },
      dex: {
        score: '12',
        mod: '+4',
      },
      cha: {
        score: '5',
        mod: '+2',
      },
    },
    attacks: [
      {
        name: 'Gobble',
        toHit: '14+F',
        damage: '2d8+4 Slashing',
        range: '5ft range',
        effect: 'On hit: Major Injury',
      },
      {
        name: 'Thrown Tusk',
        toHit: '14+F',
        damage: '3d6+4 Piercing',
        range: '30ft range',
        effect: 'Special effect',
      },
      {
        name: 'Tusk',
        toHit: '14+F',
        damage: '3d6+4 Piercing',
        range: '5ft range',
        effect: 'Special effect',
      },
    ],
    notes:
      'Charge!: full Move then melee hit → target Str Stat Check, Fail → Take Down; target Evades this combo with Advantage.\nNight Hunter: after dark Int/Dex mods swap → Int +4, Dex +1; Surprise 14+F, Evade 11+F.\nNocturnal: darkvision (nonmagical dark).\nSwamp Native: mud, water, undergrowth impose no Move/Step penalty.\nGobble: target must be ≤20% HB; hit → Con Stat Check, Fail → Major Injury.\nThrown Tusk: nighttime only.\nTusk: Evade Major Fail → one carried/worn item swallowed.\n\nFull text: Core Rulebook p. 358.',
    source: 'Core Rulebook p. 358',
    chapter: 'Floor 3 · The Over City',
    floor: 3,
    description:
      "A swamp hog that charges, gores, and swallows your stuff, so enjoy digging your sword out later. After dark it gets smarter and starts throwing its own tusks, which is unhinged. Pro tip: drop low on health and it will try to gobble you whole. Heal up before it notices, or become tomorrow's hog shit.",
    prevDescriptions: [
      "A swamp hog that charges, gores, and eats your stuff. At night it gets smarter and starts throwing its own tusks at you, which is frankly unsettling. Pro tip: if you're low on health, it will literally try to gobble you. Heal up before it notices.",
    ],
    prevNotes: [
      'Special: Charge!; Night Hunter; Nocturnal; Swamp Native. Full text: Core Rulebook p. 358.',
      'Charge!: full Move then melee hit → target Str Stat Check, Fail → Take Down; target Evades this combo with Advantage.\nNight Hunter: after dark Int/Dex mods swap → Int +4, Dex +1; Surprise 14+F, Evade 11+F.\nNocturnal: darkvision (nonmagical dark).\nSwamp Native: mud, water, undergrowth impose no Move/Step penalty.\nGobble: target must be ≤20% HB; hit → Con Stat Check, Fail → Major Injury.\nThrown Tusk: nighttime only.\nTusk: Evade Major Fail → one carried/worn item swallowed.\n\nFull text: Core Rulebook p. 358.',
    ],
    descriptionEs:
      'Un cerdo de pantano que embiste, cornea y se traga tus cosas, así que disfruta sacando luego tu espada de ahí. Cuando oscurece se vuelve más listo y empieza a lanzar sus propios colmillos, lo cual es de psiquiátrico. Pro-Tip: si te quedas bajo de salud, intentará engullirte entero. Cúrate antes de que se dé cuenta o serás la mierda de cerdo de mañana.',
    prevDescriptionsEs: [
      'Un cerdo de pantano que embiste, cornea y se traga tus cosas, así que disfruta sacando luego tu espada de ahí. Cuando oscurece se vuelve más listo y empieza a lanzar sus propios colmillos, lo cual es de psiquiátrico. Consejo pro: si te quedas bajo de salud, intentará engullirte entero. Cúrate antes de que se dé cuenta o serás la mierda de cerdo de mañana.',
    ],
  },
  {
    name: 'Krasue',
    kind: 'mob',
    size: 'Small (2)',
    tags: 'Cursed',
    slots: '10',
    slotValue: '2',
    level: '16',
    surprise: '14+F',
    evade: '15+F',
    move: '25+S',
    dr: '3',
    stats: {
      str: {
        score: '4',
        mod: '+2',
      },
      int: {
        score: '11',
        mod: '+4',
      },
      con: {
        score: '3',
        mod: '+2',
      },
      dex: {
        score: '22',
        mod: '+5',
      },
      cha: {
        score: '14',
        mod: '+4',
      },
    },
    attacks: [
      {
        name: 'Bite',
        toHit: '15+F',
        damage: '2d6+2 Piercing',
        range: '5ft range',
        effect: 'On hit: Blood Drain, Woozy',
      },
      {
        name: 'Strangle',
        toHit: '15+F',
        damage: '3d8+2 Bludgeoning',
        range: '15ft range',
        effect: 'On hit: Held',
      },
    ],
    notes:
      'Flight: flies and hovers as if on the ground.\nGhostly: only magic or enchanted items can hurt it.\nI Can Show You the World: a Strangle hit holds the target by its entrails and lifts them 5ft. While carrying, its Step is 5ft and Move 10, and it usually flies straight up to drop them. Escape needs a Str-Opposed Escape Artist Skill Check or a Str Stat Check at the same Difficulty.\nBlood Drain (Bite): any hit latches it on; 1d8+F Necrotic at end of each round and it heals 1 HB slot, until killed or removed. Attached two or more rounds in a row: the crawler also gains Woozy.\nStrangle: any hit applies Held.\n\nFull text: Core Rulebook p. 359.',
    source: 'Core Rulebook p. 359',
    chapter: 'Floor 3 · The Over City',
    floor: 3,
    description:
      "A flying head with its guts swinging underneath like a horrific wind chime. It drinks your blood, lassoes you with its entrails, and hauls you somewhere high and deadly. Pro tip: your ordinary sword just passes through; bring magic. Nothing says romance like getting carried off by a stranger's small intestine.",
    prevDescriptions: [
      "A floating head with its guts dangling beneath it. Yes, really. It sucks your blood, ties you up with its insides, and flies you somewhere high and unpleasant. Pro tip: mundane weapons won't touch it, so bring magic. Nobody wants a magic carpet ride like this.",
    ],
    prevNotes: [
      'Special: Flight; Ghostly; I Can Show You the World. Full text: Core Rulebook p. 359.',
      'Flight: flies and hovers as if on the ground.\nGhostly: only magic or enchanted items can hurt it.\nI Can Show You the World: a Strangle hit holds the target by its entrails and lifts them 5ft. While carrying, its Step is 5ft and Move 10, and it usually flies straight up to drop them. Escape needs a Str-Opposed Escape Artist Skill Check or a Str Stat Check at the same Difficulty.\nBlood Drain (Bite): any hit latches it on; 1d8+F Necrotic at end of each round and it heals 1 HB slot, until killed or removed. Attached two or more rounds in a row: the crawler also gains Woozy.\nStrangle: any hit applies Held.\n\nFull text: Core Rulebook p. 359.',
    ],
    descriptionEs:
      'Una cabeza voladora con las tripas colgando debajo como un móvil de viento espantoso. Te bebe la sangre, te echa el lazo con sus entrañas y te arrastra a algún sitio alto y mortal. Pro-Tip: tu espada normal lo atraviesa sin más; trae magia. No hay nada más romántico que te rapte el intestino delgado de un desconocido.',
    prevDescriptionsEs: [
      'Una cabeza voladora con las tripas colgando debajo como un móvil de viento espantoso. Te bebe la sangre, te echa el lazo con sus entrañas y te arrastra a algún sitio alto y mortal. Consejo pro: tu espada normal lo atraviesa sin más; trae magia. No hay nada más romántico que te rapte el intestino delgado de un desconocido.',
    ],
  },
  {
    name: 'Merry Caroler',
    kind: 'mob',
    size: 'Medium (4)',
    tags: 'Humanoid',
    slots: '10',
    slotValue: '2',
    level: '17',
    surprise: '14+F',
    evade: '13+F',
    move: '20+S',
    dr: '3',
    stats: {
      str: {
        score: '4',
        mod: '+2',
      },
      int: {
        score: '14',
        mod: '+4',
      },
      con: {
        score: '5',
        mod: '+2',
      },
      dex: {
        score: '8',
        mod: '+3',
      },
      cha: {
        score: '25',
        mod: '+5',
      },
    },
    attacks: [
      {
        name: 'Don’t Rest Ye Merry Gentle Elves Spell',
        toHit: '14+F',
        damage: 'No damage',
        range: '30ft Burst',
        effect: 'On hit: Apito',
      },
      {
        name: 'Have You Ever Seen the Rain? Spell',
        toHit: '14+F',
        damage: '3d6+5 Ice',
        range: '60ft range',
        effect: 'Major Fail+: Stiff Legs',
      },
      {
        name: 'Jingle Balls Spell',
        toHit: '14+F',
        damage: '3d6+5 Bludgeoning',
        range: '60ft range',
        effect: 'Major Fail+: Hypothermia',
      },
      {
        name: 'Shattering High Note Spell',
        toHit: '14+F',
        damage: '2d6+4 Sonic',
        range: '5ft Burst',
        effect: 'Special effect',
      },
      {
        name: 'Silent Night Spell',
        toHit: '14+F',
        damage: 'No damage',
        range: '50ft Burst radius',
        effect: 'On hit: Muted',
      },
      {
        name: 'Space Oddity Spell',
        toHit: '14+F',
        damage: '2d6+4 Force',
        range: '40ft range',
        effect: 'On hit: Aerial Suspension, Held',
      },
    ],
    notes:
      "Don't Rest Ye Merry Gentle Elves Spell: hit → Debuff: Disadvantage on Evade vs any Merry Caroler; urge to tithe a random god, doing so clears it.\nJingle Balls Spell (Hypothermia): 1d6+F Ice per round, stacks; once it has cost 1+ HB Slots → Unopposed Survival Skill Check, Fail → shed one clothing item each round start.\nSilent Night Spell: hit → Muted.\nSpace Oddity Spell: 10ft Blast; hit → Cha or Int Stat Check (crawler picks); Fail → Aerial Suspension: Held, hovering 30ft up through end of next round, then drops.\n\nFull text: Core Rulebook p. 359.",
    source: 'Core Rulebook p. 359',
    chapter: 'Floor 3 · The Over City',
    floor: 3,
    description:
      'Six spells, all show tunes, all war crimes. The Merry Caroler freezes your jingle balls until your clothes start coming off, mutes you, launches you into orbit, and guilts you into tithing some random god. Pro tip: shut them up fast. Every verse is a new way to die, and these assholes know all the verses.',
    prevDescriptions: [
      'Six spells, all songs, all terrible. The Merry Caroler freezes you, mutes you, launches you into orbit, and guilts you into tipping a god. Pro tip: shut them up fast. Every verse is another way to ruin your night, and they know all the verses.',
    ],
    prevNotes: [
      'Full text: Core Rulebook p. 359.',
      "Don't Rest Ye Merry Gentle Elves Spell: hit → Debuff: Disadvantage on Evade vs any Merry Caroler; urge to tithe a random god, doing so clears it.\nJingle Balls Spell (Hypothermia): 1d6+F Ice per round, stacks; once it has cost 1+ HB Slots → Unopposed Survival Skill Check, Fail → shed one clothing item each round start.\nSilent Night Spell: hit → Muted.\nSpace Oddity Spell: 10ft Blast; hit → Cha or Int Stat Check (crawler picks); Fail → Aerial Suspension: Held, hovering 30ft up through end of next round, then drops.\n\nFull text: Core Rulebook p. 359.",
    ],
    descriptionEs:
      'Seis hechizos, todos de musical, todos crímenes de guerra. El Merry Caroler te congela los cascabeles hasta que se te empieza a caer la ropa, te deja mudo, te pone en órbita y te hace sentir tan culpable que acabas pagando el diezmo a algún dios random. Pro-Tip: cállalos rápido. Cada estrofa es una nueva forma de morir, y estos gilipollas se saben todas las estrofas.',
    prevDescriptionsEs: [
      'Seis hechizos, todos de musical, todos crímenes de guerra. El Merry Caroler te congela los cascabeles hasta que se te empieza a caer la ropa, te deja mudo, te pone en órbita y te hace sentir tan culpable que acabas pagando el diezmo a algún dios random. Consejo pro: cállalos rápido. Cada estrofa es una nueva forma de morir, y estos gilipollas se saben todas las estrofas.',
    ],
  },
  {
    name: 'Village Guard (p. 360)',
    kind: 'mob',
    size: 'Medium (4)',
    tags: 'Humanoid',
    slots: '10',
    slotValue: '7',
    level: '75',
    surprise: '15+F',
    evade: '14+F',
    move: '15+S',
    dr: '4',
    stats: {
      str: {
        score: '70',
        mod: '+6',
      },
      int: {
        score: '25',
        mod: '+5',
      },
      con: {
        score: '100',
        mod: '+7',
      },
      dex: {
        score: '15',
        mod: '+4',
      },
      cha: {
        score: '20',
        mod: '+5',
      },
    },
    attacks: [
      {
        name: 'Commanding Shout Spell',
        toHit: '15+F',
        damage: 'No damage',
        range: '100ft range',
        effect: 'On hit: Terrified',
      },
      {
        name: 'Longsword',
        toHit: '16+F',
        damage: '7d8+6 Slashing',
        range: '5ft range',
        effect: 'Major Fail+: Blood Trail',
      },
    ],
    notes:
      'Letter of the Law: no mercy, no bargaining. Attacks known lawbreakers on sight, aiming to kill. Stops chasing once the target exits the settlement, but recognizes them if they come back.\nCommanding Shout Spell: hit crawlers are Terrified for 2 rounds.\n\nFull text: Core Rulebook p. 360.',
    source: 'Core Rulebook p. 360',
    chapter: 'Floor 3 · The Over City',
    floor: 3,
    description:
      "Level 75. A longsword that rolls seven fucking d8s. Stealing a loaf of bread here is a capital offense, and they don't take bribes, excuses, or tears. Pro tip: leave town and they stop chasing. Come back and they remember your stupid face. So do I.",
    prevDescriptions: [
      "Level 75 mall cop energy with a longsword that rolls seven d8s. Jaywalk in this village and you'll find out how much the local HOA cares. Pro tip: leaving town ends the chase, but they never forget a face. Neither do my viewers.",
    ],
    prevNotes: [
      'Special: Letter of the Law. Full text: Core Rulebook p. 360.',
      'Letter of the Law: no mercy, no bargaining. Attacks known lawbreakers on sight, aiming to kill. Stops chasing once the target exits the settlement, but recognizes them if they come back.\nCommanding Shout Spell: hit crawlers are Terrified for 2 rounds.\n\nFull text: Core Rulebook p. 360.',
    ],
    descriptionEs:
      'Nivel 75. Una espada larga que tira siete putos d8. Robar una barra de pan aquí se castiga con la muerte, y no aceptan sobornos, excusas ni lágrimas. Pro-Tip: sal del pueblo y dejan de perseguirte. Vuelve y recordarán tu estúpida cara. Yo también.',
    prevDescriptionsEs: [
      'Nivel 75. Una espada larga que tira siete putos d8. Robar una barra de pan aquí se castiga con la muerte, y no aceptan sobornos, excusas ni lágrimas. Consejo pro: sal del pueblo y dejan de perseguirte. Vuelve y recordarán tu estúpida cara. Yo también.',
    ],
  },
  {
    name: 'Demon',
    kind: 'npc',
    size: 'Medium (4)',
    tags: 'NPC, Demonic',
    slots: '10',
    slotValue: '6',
    level: '50',
    surprise: '15+F',
    evade: '15+F',
    move: '20+S',
    dr: '3',
    stats: {
      str: {
        score: '23',
        mod: '+5',
      },
      int: {
        score: '27',
        mod: '+5',
      },
      con: {
        score: '50',
        mod: '+6',
      },
      dex: {
        score: '25',
        mod: '+5',
      },
      cha: {
        score: '30',
        mod: '+5',
      },
    },
    attacks: [
      {
        name: 'Bite',
        toHit: '15+F',
        damage: '4d8+5 Piercing',
        range: '5ft range',
        effect: 'On hit: Taint',
      },
      {
        name: 'Unsaintly Claws',
        toHit: '15+F',
        damage: '5d6+5 Slashing',
        range: '5ft range',
        effect: 'Major Fail+: Poisoned',
      },
    ],
    notes:
      'Not So Jolly: first encounter → Int Stat Check; Fail → Terrified.\nBite: hit → The Taint, 2 rounds.\n\nFull text: Core Rulebook p. 364.',
    source: 'Core Rulebook p. 364',
    chapter: 'Floor 3 · The Over City',
    floor: 3,
    description:
      "Whatever you're feeling when this thing walks in, your bladder is feeling it harder. Blow the Int check and you'll spend round one screaming like a toddler at a mall Santa. Pro tip: the bite leaves a Taint behind. Don't laugh. Okay, laugh, but go get it cleansed.",
    prevDescriptions: [
      "Fangs, claws, and a vibe so wrong your brain files a complaint before your legs do. Roll well on Int or spend the opening round screaming. Pro tip: that bite leaves a Taint that lingers. Like my ex's playlist.",
    ],
    prevNotes: [
      'Special: Not So Jolly. Full text: Core Rulebook p. 364.',
      'Not So Jolly: first encounter → Int Stat Check; Fail → Terrified.\nBite: hit → The Taint, 2 rounds.\n\nFull text: Core Rulebook p. 364.',
    ],
    descriptionEs:
      'Sientas lo que sientas cuando esta cosa entra por la puerta, tu vejiga lo siente todavía más. Falla la tirada de Int y te pasarás la primera ronda chillando como un crío sentado en las rodillas del Papá Noel del centro comercial. Pro-Tip: el mordisco te deja una Taint. Búscalo en un diccionario de inglés. No te rías. Vale, ríete, pero ve a que te la purifiquen.',
    prevDescriptionsEs: [
      'Sientas lo que sientas cuando esta cosa entra por la puerta, tu vejiga lo siente todavía más. Falla la tirada de Int y te pasarás la primera ronda chillando como un crío sentado en las rodillas del Papá Noel del centro comercial. Consejo pro: el mordisco te deja una Taint. Búscalo en un diccionario de inglés. No te rías. Vale, ríete, pero ve a que te la purifiquen.',
    ],
  },
  {
    name: 'Big Daddy Nick',
    kind: 'boss',
    size: 'Large (5)',
    tags: 'Neighborhood Boss, Humanoid',
    slots: '13',
    slotValue: '5',
    level: '25',
    surprise: '15+F',
    evade: '15+F',
    move: '20+S',
    dr: '3',
    stats: {
      str: {
        score: '15',
        mod: '+4',
      },
      int: {
        score: '25',
        mod: '+5',
      },
      con: {
        score: '20',
        mod: '+5',
      },
      dex: {
        score: '30',
        mod: '+5',
      },
      cha: {
        score: '10',
        mod: '+4',
      },
    },
    attacks: [
      {
        name: 'Bowie Knife',
        toHit: '14+F',
        damage: '3d4+4 Slashing',
        range: '5ft range',
        effect: 'Major Fail+: Blood Trail',
      },
      {
        name: 'Candy Shot',
        toHit: '15+F',
        damage: '3d6+5 Piercing',
        range: '100ft range',
        effect: 'Major Fail+: Sugar Rush, Sugar Crash',
      },
      {
        name: 'Triple Treat',
        toHit: '15+F',
        damage: '3d6+5 Fire',
        range: '60ft range, 10ft',
        effect: 'Major Fail+: Staggered',
      },
    ],
    notes:
      "Delusional: a crawler can make an Int-Opposed Deception Skill Check to sell Nick on an imminent alien invasion; on Success he becomes Enraged.\nSurvivalist's Stash: grenades hang in hidden nets on his cabin roof. Hitting them (Evade 10+F) drops them for 3d6 Fire in a 20ft Burst around Nick and his minions if lured underneath; they don't Evade it.\nCandy Shot: Sugar Rush Debuff on Major Fail or worse deals 1d8+F Poison each round until combat ends (stacks) and grants a free Move each round, but every Move must be full distance. Moving twice in a round swaps it for Sugar Crash until combat ends: no Stat Mods on rolls, cleared if Sugar Rush returns.\n\nFull text: Core Rulebook p. 366.",
    source: 'Core Rulebook p. 366',
    chapter: 'Floor 3 · The Over City',
    floor: 3,
    description:
      "Big Daddy Nick has a bunker, a candy-loaded rifle, and forty years of 'I told you so' saved up. Get sugar-shot and you'll twitch around the map until you crash harder than his credit. Pro tip: tell him the aliens are coming. They are. It's me. Then walk him under his own roof and let the grenades do the talking.",
    prevDescriptions: [
      "Meet Big Daddy Nick, prepper, conspiracy enthusiast, and proud owner of a candy-loaded rifle. He's been waiting for the apocalypse and, surprise, it came with snacks. Pro tip: feed his alien paranoia, then walk him under his own roof. Nothing says 'I told you so' like shrapnel.",
    ],
    prevNotes: [
      'Special: Delusional; Survivalist’s Stash. Full text: Core Rulebook p. 366.',
      "Delusional: a crawler can make an Int-Opposed Deception Skill Check to sell Nick on an imminent alien invasion; on Success he becomes Enraged.\nSurvivalist's Stash: grenades hang in hidden nets on his cabin roof. Hitting them (Evade 10+F) drops them for 3d6 Fire in a 20ft Burst around Nick and his minions if lured underneath; they don't Evade it.\nCandy Shot: Sugar Rush Debuff on Major Fail or worse deals 1d8+F Poison each round until combat ends (stacks) and grants a free Move each round, but every Move must be full distance. Moving twice in a round swaps it for Sugar Crash until combat ends: no Stat Mods on rolls, cleared if Sugar Rush returns.\n\nFull text: Core Rulebook p. 366.",
    ],
    descriptionEs:
      'Big Daddy Nick tiene un búnker, un rifle cargado de caramelos y cuarenta años de «ya os lo dije» acumulados. Si te dispara azúcar, irás dando tumbos por el mapa hasta que te pegues un bajón peor que su historial crediticio. Pro-Tip: dile que vienen los alienígenas. Es verdad. Soy yo. Luego llévalo bajo su propio techo y deja que las granadas hablen.',
    prevDescriptionsEs: [
      'Big Daddy Nick tiene un búnker, un rifle cargado de caramelos y cuarenta años de «ya os lo dije» acumulados. Si te dispara azúcar, irás dando tumbos por el mapa hasta que te pegues un bajón peor que su historial crediticio. Consejo pro: dile que vienen los alienígenas. Es verdad. Soy yo. Luego llévalo bajo su propio techo y deja que las granadas hablen.',
    ],
  },
  {
    name: 'Shambling Berserker',
    kind: 'mob',
    size: 'Large (5)',
    tags: 'Undead',
    slots: '10',
    slotValue: '1',
    level: '12',
    surprise: '11+F',
    evade: '12+F',
    move: '10+S',
    dr: '3',
    stats: {
      str: {
        score: '32',
        mod: '+5',
      },
      int: {
        score: '2',
        mod: '+1',
      },
      con: {
        score: '1',
        mod: '+1',
      },
      dex: {
        score: '5',
        mod: '+2',
      },
      cha: {
        score: '1',
        mod: '+1',
      },
    },
    attacks: [
      {
        name: 'Grab',
        toHit: '15+F',
        damage: '3d8+5 Bludgeoning',
        range: '5ft range',
        effect: 'Major Fail+: Held',
      },
      {
        name: 'Slam',
        toHit: '15+F',
        damage: '3d10+5 Bludgeoning',
        range: '5ft range',
        effect: 'Special effect',
      },
    ],
    notes:
      'Night Berzerking: after sundown their Con Mod, Str Mod, and Move are multiplied by 4.\nShambling Pack: a crawler adjacent to two or more of them has Disadvantage to Evade.\nTenacious: once it picks a target it pursues until it is destroyed or the target dies.\nSlam: on Major Fail or worse the crawler is pushed 15ft.\n\nFull text: Core Rulebook p. 369.',
    source: 'Core Rulebook p. 369',
    chapter: 'Floor 3 · The Over City',
    floor: 3,
    description:
      "Daytime: a big, slow, dead asshole. Nighttime: the same asshole with four times the muscle and legs that finally work. Pro tip: don't let two of them flank you, and don't be here after sundown. Once one picks you, it follows you until one of you is paste. My money's on you.",
    prevDescriptions: [
      "Big, dead, and pushy, like a zombie that found a gym membership. By day, a nuisance. By night, four times the nuisance, literally. Pro tip: don't let them gang up, and don't still be here when the sun sets. I'm serious. Okay, I'm not, please stay.",
    ],
    prevNotes: [
      'Special: Night Berzerking; Shambling Pack; Tenacious. Full text: Core Rulebook p. 369.',
      'Night Berzerking: after sundown their Con Mod, Str Mod, and Move are multiplied by 4.\nShambling Pack: a crawler adjacent to two or more of them has Disadvantage to Evade.\nTenacious: once it picks a target it pursues until it is destroyed or the target dies.\nSlam: on Major Fail or worse the crawler is pushed 15ft.\n\nFull text: Core Rulebook p. 369.',
    ],
    descriptionEs:
      'De día: un cabrón muerto, grande y lento. De noche: el mismo cabrón con cuatro veces más músculo y unas piernas que por fin funcionan. Pro-Tip: no dejes que dos te flanqueen y no estés aquí cuando se ponga el sol. En cuanto uno te elige, te sigue hasta que uno de los dos acabe hecho paté. Yo apuesto por ti.',
    prevDescriptionsEs: [
      'De día: un cabrón muerto, grande y lento. De noche: el mismo cabrón con cuatro veces más músculo y unas piernas que por fin funcionan. Consejo pro: no dejes que dos te flanqueen y no estés aquí cuando se ponga el sol. En cuanto uno te elige, te sigue hasta que uno de los dos acabe hecho paté. Yo apuesto por ti.',
    ],
  },
  {
    name: 'Rumble Weed',
    kind: 'mob',
    size: 'Medium (4)',
    tags: 'Undead',
    slots: '10',
    slotValue: '4',
    level: '15',
    surprise: '13+F',
    evade: '14+F',
    move: '25+S',
    dr: '3',
    stats: {
      str: {
        score: '22',
        mod: '+5',
      },
      int: {
        score: '6',
        mod: '+3',
      },
      con: {
        score: '11',
        mod: '+4',
      },
      dex: {
        score: '10',
        mod: '+4',
      },
      cha: {
        score: '1',
        mod: '+1',
      },
    },
    attacks: [
      {
        name: 'Bite',
        toHit: '15+F',
        damage: '3d6+5 Piercing',
        range: '5ft range',
        effect: 'Major Fail+: Blood Trail',
      },
      {
        name: 'Trample',
        toHit: '15+F',
        damage: '2d10+5 Bludgeoning',
        range: '30ft Line',
        effect: 'Major Fail+: Staggered, Take Down',
      },
    ],
    notes:
      'Night Predator: at night it tracks crawlers and has Advantage on its first attack each combat.\nBite: can only be used at night.\n\nFull text: Core Rulebook p. 370.',
    source: 'Core Rulebook p. 370',
    chapter: 'Floor 3 · The Over City',
    floor: 3,
    description:
      "An undead tumbleweed with a mouth. Somewhere a cowboy just shit his chaps. It rolls through you in a 30ft line like you're a spare at the bowling alley. Pro tip: its bite only works after dark, and it always swings first at night. So, you know. Sleep in a tree.",
    prevDescriptions: [
      'Tumbleweed? Please. This is an undead shrub with teeth and a grudge, rolling across the ruins at bowling-ball speed. Pro tip: its bite only clocks in after dark, and it gets a head start on the first swing. Stand out of the 30ft line unless you enjoy being a pin.',
    ],
    prevNotes: [
      'Special: Night Predator. Full text: Core Rulebook p. 370.',
      'Night Predator: at night it tracks crawlers and has Advantage on its first attack each combat.\nBite: can only be used at night.\n\nFull text: Core Rulebook p. 370.',
    ],
    descriptionEs:
      'Una planta rodadora no muerta con boca. En algún lugar, un vaquero acaba de cagarse en los zahones. Te atraviesa rodando en una línea de 30 pies como si fueras un bolo. Pro-Tip: su mordisco solo funciona de noche, y de noche siempre ataca primero. Así que, bueno. Duerme en un árbol.',
    prevDescriptionsEs: [
      'Una planta rodadora no muerta con boca. En algún lugar, un vaquero acaba de cagarse en los zahones. Te atraviesa rodando en una línea de 30 pies como si fueras un bolo. Consejo pro: su mordisco solo funciona de noche, y de noche siempre ataca primero. Así que, bueno. Duerme en un árbol.',
    ],
  },
  {
    name: 'Ruin Flocker',
    kind: 'mob',
    size: 'Medium (4)',
    tags: 'Animal',
    slots: '9',
    slotValue: '3',
    level: '9',
    surprise: '11+F',
    evade: '13+F',
    move: '25+S',
    dr: '3',
    stats: {
      str: {
        score: '10',
        mod: '+4',
      },
      int: {
        score: '2',
        mod: '+1',
      },
      con: {
        score: '6',
        mod: '+3',
      },
      dex: {
        score: '11',
        mod: '+3',
      },
      cha: {
        score: '3',
        mod: '+2',
      },
    },
    attacks: [
      {
        name: 'Claw',
        toHit: '14+F',
        damage: '2d6+4 Slashing',
        range: '5ft range',
        effect: 'Major Fail+: Blood Trail',
      },
      {
        name: 'Slam',
        toHit: '14+F',
        damage: '2d6+4 Bludgeoning',
        range: '5ft range',
        effect: 'Major Fail+: Take Down',
      },
      {
        name: 'Trample',
        toHit: '13+F',
        damage: '1d6+4 Bludgeoning',
        range: '25ft Line',
        effect: 'On hit: Staggered',
      },
    ],
    notes:
      'What the Flock: 3+ of them within 10ft of one crawler → they gang up with Trample; that crawler Evades at Disadvantage while ringed in.\n\nFull text: Core Rulebook p. 370.',
    source: 'Core Rulebook p. 370',
    chapter: 'Floor 3 · The Over City',
    floor: 3,
    description:
      "One Flocker? Kick it. Two? Sweat. Three? Now they've got you surrounded and they take turns trampling you into a fine crawler paste. Pro tip: kill them before the third one arrives, because the ring is where the Disadvantage lives. The viewers call this 'the blender.'",
    prevDescriptions: [
      'One Ruin Flocker is a mildly angry bird-beast. Three is a stampede with a group chat. They love to circle you and take turns running you over. Pro tip: never let the third one show up. The audience loves a flock mob.',
    ],
    prevNotes: [
      'Special: What the Flock. Full text: Core Rulebook p. 370.',
      'What the Flock: 3+ of them within 10ft of one crawler → they gang up with Trample; that crawler Evades at Disadvantage while ringed in.\n\nFull text: Core Rulebook p. 370.',
    ],
    descriptionEs:
      '¿Un Flocker? Dale una patada. ¿Dos? A sudar. ¿Tres? Ya te tienen rodeado y se turnan para pisotearte hasta dejarte hecho una fina pasta de crawler. Pro-Tip: mátalos antes de que llegue el tercero, porque en el círculo es donde vive la Desventaja. Los espectadores lo llaman «la batidora».',
    prevDescriptionsEs: [
      '¿Un Flocker? Dale una patada. ¿Dos? A sudar. ¿Tres? Ya te tienen rodeado y se turnan para pisotearte hasta dejarte hecho una fina pasta de crawler. Consejo pro: mátalos antes de que llegue el tercero, porque en el círculo es donde vive la Desventaja. Los espectadores lo llaman «la batidora».',
    ],
  },
  {
    name: 'Hobgoblin Mortuarty Assistant',
    kind: 'mob',
    size: 'Medium (4)',
    tags: 'Humanoid',
    slots: '10',
    slotValue: '4',
    level: '10',
    surprise: '13+F',
    evade: '14+F',
    move: '20+S',
    dr: '3',
    stats: {
      str: {
        score: '6',
        mod: '+3',
      },
      int: {
        score: '7',
        mod: '+3',
      },
      con: {
        score: '10',
        mod: '+4',
      },
      dex: {
        score: '10',
        mod: '+4',
      },
      cha: {
        score: '2',
        mod: '+1',
      },
    },
    attacks: [
      {
        name: 'Cleaning Spray',
        toHit: '14+F',
        damage: '1d6+4 Acid',
        range: '15ft Cone',
        effect: 'Poisoned',
      },
      {
        name: 'Scalpel',
        toHit: '14+F',
        damage: '2d6+4 Piercing',
        range: '5ft range, Armor-Piercing',
        effect: 'Major Fail+: Blood Trail',
      },
    ],
    notes:
      'Death by a Thousand Cuts: 2+ adjacent to a target with no ally beside it → target Evades at Disadvantage.\n\nFull text: Core Rulebook p. 371.',
    source: 'Core Rulebook p. 371',
    chapter: 'Floor 3 · The Over City',
    floor: 3,
    description:
      "Morgue interns with a scalpel, a spray bottle of acid, and the dead-eyed stare of someone who's hosed out a lot of body bags. The scalpel goes straight through armor. Pro tip: never stand alone next to two of them. They love a solo patient. Easier to bag.",
    prevDescriptions: [
      "Your friendly neighborhood morgue intern, armed with a scalpel and a spray bottle of something that definitely isn't Windex. They work in pairs and love a lonely patient. Pro tip: keep a buddy next to you. Nobody wants to be prepped solo.",
    ],
    prevNotes: [
      'Special: Death by a Thousand Cuts. Full text: Core Rulebook p. 371.',
      'Death by a Thousand Cuts: 2+ adjacent to a target with no ally beside it → target Evades at Disadvantage.\n\nFull text: Core Rulebook p. 371.',
    ],
    descriptionEs:
      'Becarios de la morgue con un bisturí, un pulverizador de ácido y la mirada muerta de alguien que ha limpiado con manguera un montón de bolsas para cadáveres. El bisturí atraviesa la armadura. Pro-Tip: no te quedes nunca solo al lado de dos de ellos. Les encanta un paciente solitario. Es más fácil de embolsar.',
    prevDescriptionsEs: [
      'Becarios de la morgue con un bisturí, un pulverizador de ácido y la mirada muerta de alguien que ha limpiado con manguera un montón de bolsas para cadáveres. El bisturí atraviesa la armadura. Consejo pro: no te quedes nunca solo al lado de dos de ellos. Les encanta un paciente solitario. Es más fácil de embolsar.',
    ],
  },
  {
    name: 'Hobgoblin Undertaker',
    kind: 'mob',
    size: 'Medium (4)',
    tags: 'Humanoid',
    slots: '10',
    slotValue: '4',
    level: '15',
    surprise: '14+F',
    evade: '14+F',
    move: '20+S',
    dr: '3',
    stats: {
      str: {
        score: '9',
        mod: '+3',
      },
      int: {
        score: '10',
        mod: '+4',
      },
      con: {
        score: '13',
        mod: '+4',
      },
      dex: {
        score: '13',
        mod: '+4',
      },
      cha: {
        score: '5',
        mod: '+2',
      },
    },
    attacks: [
      {
        name: 'Cleaning Spray',
        toHit: '14+F',
        damage: '2d6+4 Acid',
        range: '15ft Cone',
        effect: 'Poisoned',
      },
      {
        name: 'Scalpel',
        toHit: '14+F',
        damage: '3d6+4 Slashing',
        range: '5ft range, Armor-',
        effect: 'Major Fail+: Blood Trail',
      },
    ],
    notes:
      'Lead to Death: 2+ Hobgoblins adjacent to a target with no ally beside it → target Evades at Disadvantage.\n\nFull text: Core Rulebook p. 376.',
    source: 'Core Rulebook p. 376',
    chapter: 'Floor 3 · The Over City',
    floor: 3,
    description:
      'Promoted from Assistant, and now he measures you for a coffin before he even says hi. Bigger acid spray, nastier scalpel, same love of cornering loners. Pro tip: keep a buddy next to you at all times. Even the one who farts. Especially the one who farts.',
    prevDescriptions: [
      "The Assistant got promoted. Same acid spray, sharper scalpel, and a firm belief that you're already a customer. Pro tip: Hobgoblins of any flavor gang up on isolated crawlers, so hold hands. Aww. Cute. Now go get dissected.",
    ],
    prevNotes: [
      'Special: Lead to Death. Full text: Core Rulebook p. 376.',
      'Lead to Death: 2+ Hobgoblins adjacent to a target with no ally beside it → target Evades at Disadvantage.\n\nFull text: Core Rulebook p. 376.',
    ],
    descriptionEs:
      'Ascendido de Assistant, y ahora te toma las medidas para el ataúd antes incluso de saludar. Chorro de ácido más grande, bisturí más cabrón y el mismo amor por acorralar a los solitarios. Pro-Tip: ten siempre a un colega al lado. Incluso al que se tira pedos. Sobre todo al que se tira pedos.',
    prevDescriptionsEs: [
      'Ascendido de Assistant, y ahora te toma las medidas para el ataúd antes incluso de saludar. Chorro de ácido más grande, bisturí más cabrón y el mismo amor por acorralar a los solitarios. Consejo pro: ten siempre a un colega al lado. Incluso al que se tira pedos. Sobre todo al que se tira pedos.',
    ],
  },
  {
    name: 'The Dispenser',
    kind: 'boss',
    size: 'Huge (6)',
    tags: 'Neighborhood Boss, Beastly',
    slots: '13',
    slotValue: '5',
    level: '30',
    surprise: '14+F',
    evade: '15+F',
    move: '30+S',
    dr: '3',
    stats: {
      str: {
        score: '52',
        mod: '+6',
      },
      int: {
        score: '12',
        mod: '+4',
      },
      con: {
        score: '24',
        mod: '+5',
      },
      dex: {
        score: '22',
        mod: '+5',
      },
      cha: {
        score: '5',
        mod: '+2',
      },
    },
    attacks: [
      {
        name: 'Aerial Slam',
        toHit: '16+F',
        damage: '3d10+6 Bludgeoning',
        range: '5ft range',
        effect: 'On hit: Take Down',
      },
      {
        name: 'Caustic Mist',
        toHit: '15+F',
        damage: '3d8+4 Acid',
        range: '20ft Cone +10ft',
        effect: 'Burned',
      },
      {
        name: 'Tail Whip',
        toHit: '16+F',
        damage: '5d6+6 Slashing',
        range: '10ft range',
        effect: 'Major Fail+: Staggered',
      },
    ],
    notes:
      "Camouflage: round 1 of combat → Advantage on its attacks.\nPaired Attacks: attacks each crawler twice when possible; Aerial Slam, if used, always comes first.\nThem's Good Eatin': Take Down from Aerial Slam → spends an action to gulp the crawler; Str Stat Check, Fail → Swallowed: 1d10+F Acid at round end until free. Escape via Escape Artist (Str-Opposed) or Str Stat Check, same Difficulty. Swallowed crawler's attacks ignore its DR.\nBig Head, But Beady Eyes: Advantage on attacks from behind it.\nFlight: flies at normal Move.\n\nFull text: Core Rulebook p. 378.",
    source: 'Core Rulebook p. 378',
    chapter: 'Floor 3 · The Over City',
    floor: 3,
    description:
      "A flying school-cafeteria nightmare that hits every crawler twice, slam first, then snacks. Get knocked flat and it swallows you whole, and then you're soup. Pro tip: its eyes are shit, so hit it from behind. And if you end up inside? Stab. Its armor doesn't cover the gut. Nobody's does.",
    prevDescriptions: [
      "A flying high school horror that dispenses beatings two at a time, like a vending machine that jams in your favor. Get slammed down and you might become lunch. Pro tip: its eyes are tiny, so hit it from behind. And if you get swallowed, stab outward. Its armor doesn't cover the inside.",
    ],
    prevNotes: [
      'Special: Camouflage; Them’s Good Eatin’; Big Head, But Beady Eyes; Flight. Full text: Core Rulebook p. 378.',
      "Camouflage: round 1 of combat → Advantage on its attacks.\nPaired Attacks: attacks each crawler twice when possible; Aerial Slam, if used, always comes first.\nThem's Good Eatin': Take Down from Aerial Slam → spends an action to gulp the crawler; Str Stat Check, Fail → Swallowed: 1d10+F Acid at round end until free. Escape via Escape Artist (Str-Opposed) or Str Stat Check, same Difficulty. Swallowed crawler's attacks ignore its DR.\nBig Head, But Beady Eyes: Advantage on attacks from behind it.\nFlight: flies at normal Move.\n\nFull text: Core Rulebook p. 378.",
    ],
    descriptionEs:
      'Una pesadilla voladora de comedor escolar que golpea dos veces a cada crawler: primero el porrazo y luego el picoteo. Si te tumba, te traga entero y te conviertes en sopa. Pro-Tip: tiene una vista de mierda, así que atácalo por detrás. ¿Y si acabas dentro? Apuñala. Su armadura no le cubre la barriga. La de nadie lo hace.',
    prevDescriptionsEs: [
      'Una pesadilla voladora de comedor escolar que golpea dos veces a cada crawler: primero el porrazo y luego el picoteo. Si te tumba, te traga entero y te conviertes en sopa. Consejo pro: tiene una vista de mierda, así que atácalo por detrás. ¿Y si acabas dentro? Apuñala. Su armadura no le cubre la barriga. La de nadie lo hace.',
    ],
  },
  {
    name: 'Cool Kid',
    kind: 'mob',
    size: 'Medium (4)',
    tags: 'Humanoid',
    slots: '10',
    slotValue: '3',
    level: '15',
    surprise: '13+F',
    evade: '14+F',
    move: '20+S',
    dr: '3',
    stats: {
      str: {
        score: '8',
        mod: '+3',
      },
      int: {
        score: '7',
        mod: '+3',
      },
      con: {
        score: '8',
        mod: '+3',
      },
      dex: {
        score: '12',
        mod: '+4',
      },
      cha: {
        score: '15',
        mod: '+4',
      },
    },
    attacks: [
      {
        name: 'Blue Steel Look',
        toHit: '14+F',
        damage: 'No damage',
        range: '20ft range',
        effect: 'On hit: Paralyzed',
      },
      {
        name: 'Icy Touch',
        toHit: '13+F',
        damage: '3d4+3 Ice',
        range: '5ft range',
        effect: 'On hit: Stiff Legs',
      },
      {
        name: 'Slam',
        toHit: '13+F',
        damage: '3d6+3 Bludgeoning',
        range: '5ft range',
        effect: 'Major Fail+: Take Down',
      },
    ],
    notes:
      'Peer Pressure: before each attack on a Cool Kid → Int Stat Check; Fail → that attack at Disadvantage; Success → immune for good.\n\nFull text: Core Rulebook p. 381.',
    source: 'Core Rulebook p. 381',
    chapter: 'Floor 3 · The Over City',
    floor: 3,
    description:
      "Frosted tips, popped collar, and a stare so smoldering it actually freezes you in place. Peak douchebag. Pro tip: before you swing, pass an Int check and you're immune to the peer pressure forever. Fail it and you'll whiff like a freshman at prom.",
    prevDescriptions: [
      "Frosted tips, icy touch, and a stare so smoldering it literally paralyzes you. Somewhere a male model is suing. Pro tip: pass one Int check and you're immune to the clique forever. Fail it and, honestly, the jacket is nice.",
    ],
    prevNotes: [
      'Special: Peer Pressure. Full text: Core Rulebook p. 381.',
      'Peer Pressure: before each attack on a Cool Kid → Int Stat Check; Fail → that attack at Disadvantage; Success → immune for good.\n\nFull text: Core Rulebook p. 381.',
    ],
    descriptionEs:
      'Mechas decoloradas, cuello del polo subido y una mirada tan abrasadora que literalmente te congela en el sitio. Gilipollas en estado puro. Pro-Tip: antes de atacar, supera una tirada de Int y serás inmune a la presión de grupo para siempre. Fállala y darás al aire como un novato en su primera fiesta del instituto.',
    prevDescriptionsEs: [
      'Mechas decoloradas, cuello del polo subido y una mirada tan abrasadora que literalmente te congela en el sitio. Gilipollas en estado puro. Consejo pro: antes de atacar, supera una tirada de Int y serás inmune a la presión de grupo para siempre. Fállala y darás al aire como un novato en su primera fiesta del instituto.',
    ],
  },
  {
    name: 'Neo-Maxie-Zoom-Dweebie',
    kind: 'mob',
    size: 'Petite (3)',
    tags: 'Goblin',
    slots: '10',
    slotValue: '3',
    level: '17',
    surprise: '15+F',
    evade: '12+F',
    move: '20+S',
    dr: '2',
    stats: {
      str: {
        score: '5',
        mod: '+2',
      },
      int: {
        score: '35',
        mod: '+5',
      },
      con: {
        score: '6',
        mod: '+3',
      },
      dex: {
        score: '5',
        mod: '+2',
      },
      cha: {
        score: '5',
        mod: '+2',
      },
    },
    attacks: [
      {
        name: 'Calculated Risk',
        toHit: '15+F',
        damage: '3d6+5 Psychic',
        range: '10ft range',
        effect: 'Major Fail+: Stunned',
      },
      {
        name: 'Code Break',
        toHit: '15+F',
        damage: '3d6+5 Sonic',
        range: '5ft range',
        effect: 'On hit: Fatigued',
      },
    ],
    notes:
      'En Masse: 3+ within 5ft of one crawler → that crawler Evades at Disadvantage.\n\nFull text: Core Rulebook p. 381.',
    source: 'Core Rulebook p. 381',
    chapter: 'Floor 3 · The Over City',
    floor: 3,
    description:
      "A Petite goblin nerd who does math at you so hard it hurts your brain. Literally, it's Psychic damage. Three of them within 5ft and you're dodging at Disadvantage while they argue about Linux. Pro tip: break up the circle, then give them the wedgie they were always going to get.",
    prevDescriptions: [
      "Tiny goblin nerds with psychic math attacks and sonic code-breaking. Individually they're a D&D club. In a pack of three they're a hostile takeover. Pro tip: don't let them encircle you, and definitely don't correct their calculations.",
    ],
    prevNotes: [
      'Special: En Masse. Full text: Core Rulebook p. 381.',
      'En Masse: 3+ within 5ft of one crawler → that crawler Evades at Disadvantage.\n\nFull text: Core Rulebook p. 381.',
    ],
    descriptionEs:
      'Un goblin empollón Petite que te hace matemáticas con tanta fuerza que te duele el cerebro. Literalmente: es daño Psíquico. Tres de ellos a menos de 5 pies y esquivas con Desventaja mientras discuten sobre Linux. Pro-Tip: rompe el círculo y luego hazles el calzón chino que tarde o temprano iban a recibir.',
    prevDescriptionsEs: [
      'Un goblin empollón Petite que te hace matemáticas con tanta fuerza que te duele el cerebro. Literalmente: es daño Psíquico. Tres de ellos a menos de 5 pies y esquivas con Desventaja mientras discuten sobre Linux. Consejo pro: rompe el círculo y luego hazles el calzón chino que tarde o temprano iban a recibir.',
    ],
  },
  {
    name: 'Non-Sparkly Vampire',
    kind: 'mob',
    size: 'Medium (4)',
    tags: 'Undead',
    slots: '10',
    slotValue: '5',
    level: '18',
    surprise: '13+F',
    evade: '14+F',
    move: '25+S',
    dr: '3',
    stats: {
      str: {
        score: '10',
        mod: '+4',
      },
      int: {
        score: '9',
        mod: '+3',
      },
      con: {
        score: '20',
        mod: '+5',
      },
      dex: {
        score: '10',
        mod: '+4',
      },
      cha: {
        score: '10',
        mod: '+4',
      },
    },
    attacks: [
      {
        name: 'Bite',
        toHit: '14+F',
        damage: '3d6+4 Piercing',
        range: '5ft range',
        effect: 'Major Fail+: Drained',
      },
      {
        name: 'Sing Spell',
        toHit: '13+F',
        damage: '3d4+3 Sonic',
        range: '25ft Cone',
        effect: 'Fatigued',
      },
    ],
    notes:
      'Bite: the Drained Debuff (Major Fail or worse) deals 1d6+F Necrotic at end of each round until combat ends, and the biting vampire heals 1 HB each time.\nSing Spell: crawlers who fail to Evade become Fatigued.\n\nFull text: Core Rulebook p. 382.',
    source: 'Core Rulebook p. 382',
    chapter: 'Floor 3 · The Over City',
    floor: 3,
    description:
      "No glitter, no abs, no angsty teen fanbase. Just a sucking, singing corpse that heals every round it keeps draining you. Its song leaves you Fatigued, which is also how its fans felt. Pro tip: kill it fast, or you're a juice box with a timer and a straw hole in your neck.",
    prevDescriptions: [
      "No glitter, no brooding in the rain, just a regular old bloodsucker with a surprisingly decent singing voice. Its bite keeps draining you and topping it up every round. Pro tip: kill it fast, or you're basically a juice box with a timer.",
    ],
    prevNotes: [
      'Full text: Core Rulebook p. 382.',
      'Bite: the Drained Debuff (Major Fail or worse) deals 1d6+F Necrotic at end of each round until combat ends, and the biting vampire heals 1 HB each time.\nSing Spell: crawlers who fail to Evade become Fatigued.\n\nFull text: Core Rulebook p. 382.',
    ],
    descriptionEs:
      'Nada de purpurina, nada de abdominales, nada de fans adolescentes atormentadas. Solo un cadáver chupón y cantarín que se cura cada ronda que sigue drenándote. Su canción te deja Fatigued, que es justo como se quedaban sus fans. Pro-Tip: mátalo rápido o serás un zumo de brik con temporizador y un agujero para la pajita en el cuello.',
    prevDescriptionsEs: [
      'Nada de purpurina, nada de abdominales, nada de fans adolescentes atormentadas. Solo un cadáver chupón y cantarín que se cura cada ronda que sigue drenándote. Su canción te deja Fatigued, que es justo como se quedaban sus fans. Consejo pro: mátalo rápido o serás un zumo de brik con temporizador y un agujero para la pajita en el cuello.',
    ],
  },
  {
    name: 'Student Body',
    kind: 'mob',
    size: 'Large (5)',
    tags: 'Amalgamation',
    slots: '10',
    slotValue: '5',
    level: '19',
    surprise: '14+F',
    evade: '14+F',
    move: '20+S',
    dr: '3',
    stats: {
      str: {
        score: '20',
        mod: '+5',
      },
      int: {
        score: '11',
        mod: '+4',
      },
      con: {
        score: '20',
        mod: '+5',
      },
      dex: {
        score: '10',
        mod: '+4',
      },
      cha: {
        score: '1',
        mod: '+1',
      },
    },
    attacks: [
      {
        name: 'Acid Breath',
        toHit: '14+F',
        damage: '2d6+4 Acid',
        range: '20ft Cone',
        effect: 'Queasy',
      },
      {
        name: 'Grab',
        toHit: '15+F',
        damage: '3d6+5 Bludgeoning',
        range: '5ft range',
        effect: 'Major Fail+: Held',
      },
    ],
    notes:
      'Enrolled: gaining Held → Escape Artist (Str-Opposed) or Str Stat Check, same Difficulty; Fail → dragged along with the Mob, 1d8+F damage per round until freed or it dies.\n\nFull text: Core Rulebook p. 382.',
    source: 'Core Rulebook p. 382',
    chapter: 'Floor 3 · The Over City',
    floor: 3,
    description:
      'The entire graduating class, melted into one big acid-belching meat blob. The prom photos are going to be something. Pro tip: if it grabs you, break free immediately, or you get dragged along and slowly digested with the chess club. School spirit!',
    prevDescriptions: [
      "The whole senior class, fused into one oozing blob with acid breath. School spirit taken way too far. Pro tip: if it grabs you, wriggle free fast, or congratulations, you've enrolled. Tuition is paid in hit points.",
    ],
    prevNotes: [
      'Special: Enrolled. Full text: Core Rulebook p. 382.',
      'Enrolled: gaining Held → Escape Artist (Str-Opposed) or Str Stat Check, same Difficulty; Fail → dragged along with the Mob, 1d8+F damage per round until freed or it dies.\n\nFull text: Core Rulebook p. 382.',
    ],
    descriptionEs:
      'Toda la promoción, fundida en un gran pegote de carne que eructa ácido. Las fotos del baile de graduación van a ser algo digno de ver. Pro-Tip: si te agarra, suéltate de inmediato o te arrastrará y te irá digiriendo poco a poco junto al club de ajedrez. ¡Viva el espíritu escolar!',
    prevDescriptionsEs: [
      'Toda la promoción, fundida en un gran pegote de carne que eructa ácido. Las fotos del baile de graduación van a ser algo digno de ver. Consejo pro: si te agarra, suéltate de inmediato o te arrastrará y te irá digiriendo poco a poco junto al club de ajedrez. ¡Viva el espíritu escolar!',
    ],
  },
  {
    name: 'Sporto Teen Wolf',
    kind: 'mob',
    size: 'Medium (4)',
    tags: 'Beastly',
    slots: '10',
    slotValue: '4',
    level: '19',
    surprise: '14+F',
    evade: '15+F',
    move: '25+S',
    dr: '3',
    stats: {
      str: {
        score: '10',
        mod: '+4',
      },
      int: {
        score: '11',
        mod: '+4',
      },
      con: {
        score: '10',
        mod: '+4',
      },
      dex: {
        score: '20',
        mod: '+5',
      },
      cha: {
        score: '11',
        mod: '+4',
      },
    },
    attacks: [
      {
        name: 'Bite',
        toHit: '14+F',
        damage: '3d4+4 Piercing',
        range: '5ft range',
        effect: 'Major Fail+: Lycanthropy, The, Dying',
      },
      {
        name: 'Stick',
        toHit: '14+F',
        damage: '3d6+4 Bludgeoning',
        range: '10ft range',
        effect: 'Major Fail+: Take Down',
      },
      {
        name: 'Wedgie',
        toHit: '14+F',
        damage: '3d6+4 Slashing',
        range: '5ft range',
        effect: 'Major Fail+: Taint',
      },
    ],
    notes:
      'Silver Weakness: silver weapons → ×2 damage, ignore DR, apply The Taint.\nBite (Secret): Evade Major Fail or worse → Lycanthropy: becomes a Sporto Teen Wolf next night; cleared by Dying.\n\nFull text: Core Rulebook p. 383.',
    source: 'Core Rulebook p. 383',
    chapter: 'Floor 3 · The Over City',
    floor: 3,
    description:
      "Varsity jacket, lacrosse stick, and a wedgie attack that does Slashing damage. Ow. Silver weapons wreck him and ignore his DR, so bring the good cutlery. Anti-tip: botch your dodge on his bite and tomorrow night you're on the team. Only cure is dying. Go team!",
    prevDescriptions: [
      "Varsity jacket, lacrosse stick, fur everywhere. He peaked in high school and high school is now. Pro tip: silver wrecks him. Anti-tip: let him bite you badly enough and you're on the team next full moon. Tryouts are mandatory.",
    ],
    prevNotes: [
      'Special: Silver Weakness. Full text: Core Rulebook p. 383.',
      'Silver Weakness: silver weapons → ×2 damage, ignore DR, apply The Taint.\nBite (Secret): Evade Major Fail or worse → Lycanthropy: becomes a Sporto Teen Wolf next night; cleared by Dying.\n\nFull text: Core Rulebook p. 383.',
    ],
    descriptionEs:
      'Chaqueta del equipo universitario, stick de lacrosse y un ataque de calzón chino que hace daño Cortante. Au. Las armas de plata lo destrozan e ignoran su RD, así que saca la cubertería buena. Anticonsejo: la cagas al esquivar su mordisco y mañana por la noche estás en el equipo. La única cura es morir. ¡Vamos, equipo!',
  },
  {
    name: 'Teen Bully',
    kind: 'npc',
    size: 'Medium (4)',
    tags: 'NPC, Humanoid',
    slots: '10',
    slotValue: '4',
    level: '27',
    surprise: '14+F',
    evade: '14+F',
    move: '20+S',
    dr: '3',
    stats: {
      str: {
        score: '12',
        mod: '+4',
      },
      int: {
        score: '12',
        mod: '+4',
      },
      con: {
        score: '10',
        mod: '+4',
      },
      dex: {
        score: '11',
        mod: '+4',
      },
      cha: {
        score: '11',
        mod: '+4',
      },
    },
    attacks: [
      {
        name: 'Blue Magnum Look',
        toHit: '15+F',
        damage: 'No damage',
        range: '20ft range',
        effect: 'On hit: Paralyzed',
      },
      {
        name: 'Icy Touch',
        toHit: '15+F',
        damage: '3d8+5 Ice',
        range: '5ft range',
        effect: '',
      },
      {
        name: 'Piercing Glare',
        toHit: '15+F',
        damage: '3d6+5 Piercing',
        range: '25ft range',
        effect: 'Major Fail+: Held',
      },
    ],
    notes:
      'Manipulative: Charisma-based Skills against her are rolled with Disadvantage.\n\nFull text: Core Rulebook p. 385.',
    source: 'Core Rulebook p. 385',
    chapter: 'Floor 3 · The Over City',
    floor: 3,
    description:
      "The Queen Bee. She freezes you with a look, tears you up with a glare, and makes your Charisma rolls about as useful as a participation trophy. Pro tip: don't try to talk your way out of this. Your mouth is how you got here. Hit her instead.",
    prevDescriptions: [
      'The queen bee herself, with a paralyzing stare and a touch cold enough to chill a smoothie. Trying to talk your way past her? Cute. Her whole personality is winning social checks. Pro tip: skip the charm offensive and bring an actual offensive.',
    ],
    prevNotes: [
      'Special: Manipulative. Full text: Core Rulebook p. 385.',
      'Manipulative: Charisma-based Skills against her are rolled with Disadvantage.\n\nFull text: Core Rulebook p. 385.',
    ],
    descriptionEs:
      'La Abeja Reina. Te congela con una mirada, te despedaza con otra y deja tus tiradas de Carisma tan útiles como un diploma por participar. Pro-Tip: no intentes salir de esta hablando. Tu boca es lo que te ha traído hasta aquí. Pégale.',
    prevDescriptionsEs: [
      'La Abeja Reina. Te congela con una mirada, te despedaza con otra y deja tus tiradas de Carisma tan útiles como un diploma por participar. Consejo pro: no intentes salir de esta hablando. Tu boca es lo que te ha traído hasta aquí. Pégale.',
    ],
  },
  {
    name: 'Yakov',
    kind: 'boss',
    size: 'Huge (6)',
    tags: 'Neighborhood Boss, Sasquatch',
    slots: '13',
    slotValue: '5',
    level: '30',
    surprise: '13+F',
    evade: '15+F',
    move: '30+S',
    dr: '3',
    stats: {
      str: {
        score: '51',
        mod: '+6',
      },
      int: {
        score: '7',
        mod: '+3',
      },
      con: {
        score: '21',
        mod: '+5',
      },
      dex: {
        score: '20',
        mod: '+5',
      },
      cha: {
        score: '6',
        mod: '+3',
      },
    },
    attacks: [
      {
        name: 'Bite',
        toHit: '16+F',
        damage: '5d8+6 Piercing',
        range: '5ft range',
        effect: 'Major Fail+: Held',
      },
      {
        name: 'Chewed Up',
        toHit: '16+F',
        damage: '3d6+6 Bludgeoning',
        range: '5ft range',
        effect: 'On hit: Sepsis',
      },
      {
        name: 'Landmine Frisbee',
        toHit: '16+F',
        damage: '4d8 Force',
        range: '30ft range, 10ft Blast radius',
        effect: '',
      },
      {
        name: 'Whistle Stop',
        toHit: '13+F',
        damage: '4d6+3 Sonic',
        range: '30ft Burst',
        effect: 'Muted; once per day',
      },
    ],
    notes:
      "Listen to Coach: Action → every Sporto Teen Wolf within 30ft gets Advantage on its next attack.\nTake the Lead: max 1/round, a crawler spends an Action for an Int Stat Check to map the mines; Success → Yakov steps on one, 4d8 Fire.\nWe're Cool: combat start, Int-Opposed Deception Check (pose as Steph's crew); Success → whole party gets Advantage on first attack.\nChewed Up: Held targets only.\nWhistle Stop: 1/day.\n\nFull text: Core Rulebook p. 388.",
    source: 'Core Rulebook p. 388',
    chapter: 'Floor 3 · The Over City',
    floor: 3,
    description:
      "A Huge sasquatch gym coach with a whistle that pops eardrums and a frisbee made of fucking landmines. His wolf-boys attack harder whenever he yells. Pro tip: work out where the mines are and let Coach step on his own homework. Or pretend you're with Steph's crew and get the first hit in.",
    prevDescriptions: [
      'A sasquatch gym coach with a whistle, a pack of wolf jocks, and a frisbee made of landmines. Dodgeball has evolved. Pro tip: figure out where he buried the mines and give him a little nudge. Coach always said to lead by example.',
    ],
    prevNotes: [
      'Special: Listen to Coach; Take the Lead; We’re Cool. Full text: Core Rulebook p. 388.',
      "Listen to Coach: Action → every Sporto Teen Wolf within 30ft gets Advantage on its next attack.\nTake the Lead: max 1/round, a crawler spends an Action for an Int Stat Check to map the mines; Success → Yakov steps on one, 4d8 Fire.\nWe're Cool: combat start, Int-Opposed Deception Check (pose as Steph's crew); Success → whole party gets Advantage on first attack.\nChewed Up: Held targets only.\nWhistle Stop: 1/day.\n\nFull text: Core Rulebook p. 388.",
    ],
    descriptionEs:
      'Un entrenador de gimnasia sasquatch Huge con un silbato que revienta tímpanos y un frisbi hecho de putas minas terrestres. Sus chicos lobo atacan más fuerte cada vez que grita. Pro-Tip: averigua dónde están las minas y deja que el Entrenador pise sus propios deberes. O haz como que vas con la pandilla de Steph y da tú el primer golpe.',
    prevDescriptionsEs: [
      'Un entrenador de gimnasia sasquatch Huge con un silbato que revienta tímpanos y un frisbi hecho de putas minas terrestres. Sus chicos lobo atacan más fuerte cada vez que grita. Consejo pro: averigua dónde están las minas y deja que el Entrenador pise sus propios deberes. O haz como que vas con la pandilla de Steph y da tú el primer golpe.',
    ],
  },
  {
    name: 'Broadside Bootleggers',
    kind: 'mob',
    size: 'Medium (4)',
    tags: 'Humanoid',
    slots: '10',
    slotValue: '4',
    level: '19',
    surprise: '14+F',
    evade: '15+F',
    move: '20+S',
    dr: '3',
    stats: {
      str: {
        score: '10',
        mod: '+4',
      },
      int: {
        score: '12',
        mod: '+4',
      },
      con: {
        score: '13',
        mod: '+4',
      },
      dex: {
        score: '21',
        mod: '+5',
      },
      cha: {
        score: '6',
        mod: '+3',
      },
    },
    attacks: [
      {
        name: 'Cutlass',
        toHit: '14+F',
        damage: '3d8+4 Slashing',
        range: '5ft range',
        effect: 'Special effect',
      },
      {
        name: 'Talons',
        toHit: '14+F',
        damage: '3d6+4 Piercing',
        range: '5ft range, Armor-',
        effect: 'Major Fail+: Blood Trail',
      },
    ],
    notes:
      'Flight: flies at normal Move.\nCutlass: Evade Major Fail or worse → crawler drops one held item.\n\nFull text: Core Rulebook p. 391.',
    source: 'Core Rulebook p. 391',
    chapter: 'Floor 3 · The Over City',
    floor: 3,
    description:
      "Flying rum-runners with cutlasses and talons, because regular pirates weren't stabby enough. Botch a dodge against the cutlass and your weapon goes over the rail. Pro tip: hold on to your shit. These assholes treat 'finders keepers' like a constitutional right.",
    prevDescriptions: [
      "Airborne rum-runners with cutlasses and talons, which is two more sharp things than a pirate strictly needs. Pro tip: grip your weapon tight, because one bad dodge and it's sailing off the deck. Finders keepers is basically their entire legal code.",
    ],
    prevNotes: [
      'Special: Flight. Full text: Core Rulebook p. 391.',
      'Flight: flies at normal Move.\nCutlass: Evade Major Fail or worse → crawler drops one held item.\n\nFull text: Core Rulebook p. 391.',
    ],
    descriptionEs:
      'Contrabandistas de ron voladores con alfanjes y garras, porque los piratas normales no apuñalaban lo suficiente. Falla una esquiva contra el alfanje y tu arma sale volando por la borda. Pro-Tip: agarra bien tus mierdas. Estos cabrones tratan el «quien se lo encuentra se lo queda» como un derecho constitucional.',
    prevDescriptionsEs: [
      'Contrabandistas de ron voladores con alfanjes y garras, porque los piratas normales no apuñalaban lo suficiente. Falla una esquiva contra el alfanje y tu arma sale volando por la borda. Consejo pro: agarra bien tus mierdas. Estos cabrones tratan el «quien se lo encuentra se lo queda» como un derecho constitucional.',
    ],
  },
  {
    name: 'Elven Enforcer',
    kind: 'mob',
    size: 'Medium (4)',
    tags: 'Humanoid',
    slots: '10',
    slotValue: '4',
    level: '15',
    surprise: '13+F',
    evade: '14+F',
    move: '20+S',
    dr: '3',
    stats: {
      str: {
        score: '13',
        mod: '+4',
      },
      int: {
        score: '7',
        mod: '+3',
      },
      con: {
        score: '13',
        mod: '+4',
      },
      dex: {
        score: '11',
        mod: '+4',
      },
      cha: {
        score: '6',
        mod: '+3',
      },
    },
    attacks: [
      {
        name: 'Knife',
        toHit: '14+F',
        damage: '3d6+4 Piercing',
        range: '5ft range, Armor-',
        effect: 'Major Fail+: Blood Trail',
      },
      {
        name: 'Desert Eagle',
        toHit: '14+F',
        damage: '3d6 Piercing',
        range: '50ft range',
        effect: 'Special effect',
      },
    ],
    notes:
      'Fanatical: immune to fear, charm, mind-affecting.\nDesert Eagle: hit → pushed 10ft.\n\nFull text: Core Rulebook p. 392.',
    source: 'Core Rulebook p. 392',
    chapter: 'Floor 3 · The Over City',
    floor: 3,
    description:
      "Elf muscle. Knife up close, Desert Eagle for everyone else, and it'll knock you ten feet back when it lands. Fear, charm, mind tricks? Nothing. There's nobody home to trick. Pro tip: skip the fancy spells and just hit them until they stop moving.",
    prevDescriptions: [
      'Elf muscle for hire. A knife for close work, a hand cannon for everything else, and zero room in the skull for doubt. Pro tip: your fear spells and mind tricks bounce right off. Try hitting them. Harder.',
    ],
    prevNotes: [
      'Special: Fanatical. Full text: Core Rulebook p. 392.',
      'Fanatical: immune to fear, charm, mind-affecting.\nDesert Eagle: hit → pushed 10ft.\n\nFull text: Core Rulebook p. 392.',
    ],
    descriptionEs:
      'Músculo élfico. Cuchillo de cerca, Desert Eagle para todos los demás, y cuando acierta te manda diez pies para atrás. ¿Miedo, encanto, trucos mentales? Nada. No hay nadie en casa a quien engañar. Pro-Tip: pasa de los hechizos elegantes y dales hasta que dejen de moverse.',
    prevDescriptionsEs: [
      'Músculo élfico. Cuchillo de cerca, Desert Eagle para todos los demás, y cuando acierta te manda diez pies para atrás. ¿Miedo, encanto, trucos mentales? Nada. No hay nadie en casa a quien engañar. Consejo pro: pasa de los hechizos elegantes y dales hasta que dejen de moverse.',
    ],
  },
  {
    name: 'Hangman’s Hawks (p. 392)',
    kind: 'mob',
    size: 'Medium (4)',
    tags: 'Humanoid',
    slots: '10',
    slotValue: '4',
    level: '20',
    surprise: '15+F',
    evade: '14+F',
    move: '20+S',
    dr: '2',
    stats: {
      str: {
        score: '8',
        mod: '+3',
      },
      int: {
        score: '23',
        mod: '+5',
      },
      con: {
        score: '12',
        mod: '+4',
      },
      dex: {
        score: '14',
        mod: '+4',
      },
      cha: {
        score: '8',
        mod: '+3',
      },
    },
    attacks: [
      {
        name: 'Acid Blast Spell',
        toHit: '15+F',
        damage: '2d8+5 Acid',
        range: '15ft Cone +',
        effect: 'Major Fail+: Burned',
      },
      {
        name: 'Explosive Charge',
        toHit: '14+F',
        damage: '2d6 Fire',
        range: '20ft range, 15ft Blast radius',
        effect: 'Queasy',
      },
    ],
    notes:
      'Even Keeled: Int- or Cha-based Skills targeting them → Disadvantage.\nFlight: flies at normal Move.\n\nFull text: Core Rulebook p. 392.',
    source: 'Core Rulebook p. 392',
    chapter: 'Floor 3 · The Over City',
    floor: 3,
    description:
      'Hawk-folk goons with acid spells and grenades, and the social skills of a brick. Try to trick or charm them and you roll at Disadvantage while they blow your legs off. Pro tip: the only conversation they want is violence. Speak fluently.',
    prevDescriptions: [
      "Hawk-folk goons with acid spells and grenades, and the emotional range of a filing cabinet. Pro tip: don't bother flattering or outwitting them. They'll just blow you up while you're mid-sentence. Rude, but efficient.",
    ],
    prevNotes: [
      'Special: Even Keeled; Flight. Full text: Core Rulebook p. 392.',
      'Even Keeled: Int- or Cha-based Skills targeting them → Disadvantage.\nFlight: flies at normal Move.\n\nFull text: Core Rulebook p. 392.',
    ],
    descriptionEs:
      'Matones halcón con hechizos de ácido y granadas, y las habilidades sociales de un ladrillo. Intenta engañarlos o encandilarlos y tirarás con Desventaja mientras te vuelan las piernas. Pro-Tip: la única conversación que les interesa es la violencia. Háblala con fluidez.',
    prevDescriptionsEs: [
      'Matones halcón con hechizos de ácido y granadas, y las habilidades sociales de un ladrillo. Intenta engañarlos o encandilarlos y tirarás con Desventaja mientras te vuelan las piernas. Consejo pro: la única conversación que les interesa es la violencia. Háblala con fluidez.',
    ],
  },
  {
    name: 'Peregrin Perch Prowlers',
    kind: 'mob',
    size: 'Petite (3)',
    tags: 'Humanoid',
    slots: '10',
    slotValue: '3',
    level: '21',
    surprise: '14+F',
    evade: '15+F',
    move: '30+S',
    dr: '3',
    stats: {
      str: {
        score: '21',
        mod: '+5',
      },
      int: {
        score: '11',
        mod: '+4',
      },
      con: {
        score: '8',
        mod: '+3',
      },
      dex: {
        score: '22',
        mod: '+5',
      },
      cha: {
        score: '6',
        mod: '+3',
      },
    },
    attacks: [
      {
        name: 'Crossbow',
        toHit: '15+F',
        damage: '3d6 Piercing',
        range: '50ft range',
        effect: '',
      },
      {
        name: 'Spear',
        toHit: '15+F',
        damage: '3d8+5 Piercing',
        range: '10ft range',
        effect: 'Major Fail+: Blood Trail',
      },
      {
        name: 'Grab',
        toHit: '15+F',
        damage: 'No damage',
        range: '5ft range',
        effect: 'On hit: Held',
      },
    ],
    notes:
      'Catch and Release: Held → hauled 30ft up, dropped next round. Break free via Escape Artist (Str-Opposed) or Str Stat Check, same Difficulty.\nFlight: flies at normal Move.\nRiled Up: round 1 → Stat Mod added to damage twice.\n\nFull text: Core Rulebook p. 393.',
    source: 'Core Rulebook p. 393',
    chapter: 'Floor 3 · The Over City',
    floor: 3,
    description:
      "Petite winged bandits that hit like freight trains in round one, then grab you and haul you 30 feet up. What goes up must go splat. Pro tip: break free before your ride ends. I've got a camera on the ground for the landing. It's my favorite angle.",
    prevDescriptions: [
      'Little winged bandits who hit hard up front and then offer free flying lessons. The landing is not included. Pro tip: if one grabs you, break free before gravity gets its turn. Fall damage is my favorite special effect.',
    ],
    prevNotes: [
      'Special: Catch and Release; Flight; Riled Up. Full text: Core Rulebook p. 393.',
      'Catch and Release: Held → hauled 30ft up, dropped next round. Break free via Escape Artist (Str-Opposed) or Str Stat Check, same Difficulty.\nFlight: flies at normal Move.\nRiled Up: round 1 → Stat Mod added to damage twice.\n\nFull text: Core Rulebook p. 393.',
    ],
    descriptionEs:
      'Bandidos alados Petite que pegan como trenes de mercancías en la primera ronda y luego te agarran y te suben 30 pies. Todo lo que sube tiene que hacer chof. Pro-Tip: suéltate antes de que acabe el viaje. Tengo una cámara en el suelo para el aterrizaje. Es mi plano favorito.',
    prevDescriptionsEs: [
      'Bandidos alados Petite que pegan como trenes de mercancías en la primera ronda y luego te agarran y te suben 30 pies. Todo lo que sube tiene que hacer chof. Consejo pro: suéltate antes de que acabe el viaje. Tengo una cámara en el suelo para el aterrizaje. Es mi plano favorito.',
    ],
  },
  {
    name: 'Skyfowl Crowcorps',
    kind: 'mob',
    size: 'Medium (4)',
    tags: 'Humanoid',
    slots: '10',
    slotValue: '4',
    level: '20',
    surprise: '15+F',
    evade: '14+F',
    move: '20+S',
    dr: '3',
    stats: {
      str: {
        score: '12',
        mod: '+4',
      },
      int: {
        score: '23',
        mod: '+5',
      },
      con: {
        score: '11',
        mod: '+4',
      },
      dex: {
        score: '12',
        mod: '+4',
      },
      cha: {
        score: '7',
        mod: '+3',
      },
    },
    attacks: [
      {
        name: 'Dagger Feathers',
        toHit: '14+F',
        damage: '3d4+4 Piercing',
        range: '5ft range',
        effect: 'Major Fail+: Blood Trail',
      },
      {
        name: 'Gusty Winds Spell',
        toHit: '15+F',
        damage: '2d6+4 Bludgeoning',
        range: '30ft Cone',
        effect: 'Take Down',
      },
    ],
    notes:
      'Flight: flies at normal Move.\nObservant: Advantage on Investigation & Perception Checks.\nGusty Winds Spell: crawler loses 2+ HB slots → Take Down.\n\nFull text: Core Rulebook p. 393.',
    source: 'Core Rulebook p. 393',
    chapter: 'Floor 3 · The Over City',
    floor: 3,
    description:
      "Crow cops. Knife feathers, a wind spell, and eyes that clock everything, so enjoy failing Stealth, rogues. Lose two Health Bars to that gust and you eat pavement. Pro tip: don't hide. Don't lie. Don't do crimes. Wait, this is a dungeon. Do whatever, just duck.",
    prevDescriptions: [
      "Crow cops with knife feathers and a wind spell that knocks you flat on your crime. They notice everything, so your sneak build is about to have a bad day. Pro tip: don't try to hide. Try to not lose two Health Bars to a breeze.",
    ],
    prevNotes: [
      'Special: Flight; Observant. Full text: Core Rulebook p. 393.',
      'Flight: flies at normal Move.\nObservant: Advantage on Investigation & Perception Checks.\nGusty Winds Spell: crawler loses 2+ HB slots → Take Down.\n\nFull text: Core Rulebook p. 393.',
    ],
    descriptionEs:
      'Polis cuervo. Plumas cuchilla, un hechizo de viento y ojos que lo registran todo, así que disfrutad fallando Stealth, pícaros. Pierde dos Barras de Salud por esa ráfaga y besarás el asfalto. Pro-Tip: no te escondas. No mientas. No cometas delitos. Espera, que esto es una mazmorra. Haz lo que te dé la gana, pero agáchate.',
    prevDescriptionsEs: [
      'Polis cuervo. Plumas cuchilla, un hechizo de viento y ojos que lo registran todo, así que disfrutad fallando Stealth, pícaros. Pierde dos Barras de Salud por esa ráfaga y besarás el asfalto. Consejo pro: no te escondas. No mientas. No cometas delitos. Espera, que esto es una mazmorra. Haz lo que te dé la gana, pero agáchate.',
    ],
  },
  {
    name: 'Captain Raptor',
    kind: 'npc',
    size: 'Medium (4)',
    tags: 'NPC, Humanoid',
    slots: '10',
    slotValue: '4',
    level: '20',
    surprise: '14+F',
    evade: '14+F',
    move: '25+S',
    dr: '3',
    stats: {
      str: {
        score: '32',
        mod: '+5',
      },
      int: {
        score: '11',
        mod: '+4',
      },
      con: {
        score: '10',
        mod: '+4',
      },
      dex: {
        score: '13',
        mod: '+4',
      },
      cha: {
        score: '23',
        mod: '+5',
      },
    },
    attacks: [
      {
        name: 'Cutlass',
        toHit: '16+F',
        damage: '5d8+6 Slashing',
        range: '5ft range',
        effect: 'Major Fail+: Major Injury',
      },
      {
        name: 'Fast Talking',
        toHit: '16+F',
        damage: 'No damage',
        range: '20ft Burst Radius',
        effect: 'Special effect',
      },
      {
        name: 'Flask Fling',
        toHit: '15+F',
        damage: '4d10+6 Bludgeoning',
        range: '10ft range',
        effect: 'On hit: Shit-Faced',
      },
    ],
    notes:
      'Flight: flies at normal Move.\nLovable Liar: Advantage on Deception Checks.\nCutlass: Evade Major Fail or worse → Major Injury at once.\nFast Talking: hit → Detect Lies (Int-Opposed) or Int Stat Check, same Difficulty; Fail → spellbound, only listens until his next turn begins.\nFlask Fling: hit → Shit-Faced.\n\nFull text: Core Rulebook p. 394.',
    source: 'Core Rulebook p. 394',
    chapter: 'Floor 3 · The Over City',
    floor: 3,
    description:
      "Captain Raptor: dashing, charming, drunk as shit, and very good at lying about all three. He'll talk you into standing there like a dumbass, then carve a Major Injury into you. Pro tip: pass Detect Lies or plug your ears. And if he throws his flask? Congratulations, you're wasted.",
    prevDescriptions: [
      "The Captain: swashbuckler, smooth talker, and professional drinker who weaponizes his flask. He'll talk you into standing still, then carve you up. Pro tip: plug your ears or pass that Detect Lies check. Or just enjoy the TED talk while you bleed.",
    ],
    prevNotes: [
      'Special: Flight; Lovable Liar. Full text: Core Rulebook p. 394.',
      'Flight: flies at normal Move.\nLovable Liar: Advantage on Deception Checks.\nCutlass: Evade Major Fail or worse → Major Injury at once.\nFast Talking: hit → Detect Lies (Int-Opposed) or Int Stat Check, same Difficulty; Fail → spellbound, only listens until his next turn begins.\nFlask Fling: hit → Shit-Faced.\n\nFull text: Core Rulebook p. 394.',
    ],
    descriptionEs:
      'Captain Raptor: apuesto, encantador, borracho como una cuba y muy bueno mintiendo sobre las tres cosas. Te convencerá para que te quedes ahí plantado como un imbécil y luego te tallará una Major Injury. Pro-Tip: supera Detect Lies o tápate los oídos. ¿Y si te lanza la petaca? Enhorabuena, vas pedo.',
    prevDescriptionsEs: [
      'Captain Raptor: apuesto, encantador, borracho como una cuba y muy bueno mintiendo sobre las tres cosas. Te convencerá para que te quedes ahí plantado como un imbécil y luego te tallará una Major Injury. Consejo pro: supera Detect Lies o tápate los oídos. ¿Y si te lanza la petaca? Enhorabuena, vas pedo.',
    ],
  },
  {
    name: 'Hangman’s Hawks (p. 394)',
    kind: 'npc',
    size: 'Medium (4)',
    tags: 'NPC, Humanoid',
    slots: '10',
    slotValue: '4',
    level: '20',
    surprise: '15+F',
    evade: '15+F',
    move: '20+S',
    dr: '2',
    stats: {
      str: {
        score: '11',
        mod: '+4',
      },
      int: {
        score: '23',
        mod: '+5',
      },
      con: {
        score: '11',
        mod: '+4',
      },
      dex: {
        score: '32',
        mod: '+5',
      },
      cha: {
        score: '12',
        mod: '+4',
      },
    },
    attacks: [
      {
        name: 'Evil Eye',
        toHit: '16+F',
        damage: '4d10+6 Psionic damage',
        range: '10ft range',
        effect: 'On hit: Muted',
      },
      {
        name: 'Instill Fear',
        toHit: '16+F',
        damage: 'No damage',
        range: '10ft range',
        effect: 'Major Fail+: Terrified',
      },
      {
        name: 'Iron Talon',
        toHit: '15+F',
        damage: '5d10+5 Slashing',
        range: '5ft range',
        effect: 'Major Fail+: Blood Trail',
      },
      {
        name: 'Veiled Threat',
        toHit: '16+F',
        damage: 'No damage',
        range: '30ft range',
        effect: 'On hit: Paralyzed',
      },
    ],
    notes:
      'Flight: flies at normal Move.\nSummon Fixer: action → 1d4 Elven Enforcers show up in 1d4 rounds.\n\nFull text: Core Rulebook p. 394.',
    source: 'Core Rulebook p. 394',
    chapter: 'Floor 3 · The Over City',
    floor: 3,
    description:
      "The boss bird of the Hawks, running the gang on stink-eye, veiled threats, and an iron talon that opens you like mail. Why fight when she can call in elves? Pro tip: drop her before the Enforcers show up. Or don't. More bodies, more ratings.",
    prevDescriptions: [
      "The boss hawk of the Hawks, fond of evil eyes, veiled threats, and iron talons. She doesn't do her own dirty work unless she has to; she has elves on speed dial. Pro tip: drop her before the reinforcements land. Or don't, more mobs means more ratings.",
    ],
    prevNotes: [
      'Special: Flight; Summon Fixer. Full text: Core Rulebook p. 394.',
      'Flight: flies at normal Move.\nSummon Fixer: action → 1d4 Elven Enforcers show up in 1d4 rounds.\n\nFull text: Core Rulebook p. 394.',
    ],
    descriptionEs:
      'La jefa pájara de los Hawks, que dirige la banda a base de malas caras, amenazas veladas y una garra de hierro que te abre como una carta. ¿Para qué pelear si puede llamar a los elfos? Pro-Tip: tírala antes de que aparezcan los Enforcers. O no. Más cadáveres, más audiencia.',
    prevDescriptionsEs: [
      'La jefa pájara de los Hawks, que dirige la banda a base de malas caras, amenazas veladas y una garra de hierro que te abre como una carta. ¿Para qué pelear si puede llamar a los elfos? Consejo pro: tírala antes de que aparezcan los Enforcers. O no. Más cadáveres, más audiencia.',
    ],
  },
  {
    name: 'Fowl Player',
    kind: 'boss',
    size: 'Large (5)',
    tags: 'Borough Boss, Humanoid',
    slots: '9',
    slotValue: '7',
    level: '65',
    surprise: '16+F',
    evade: '16+F',
    move: '30+S',
    dr: '3',
    stats: {
      str: {
        score: '52',
        mod: '+6',
      },
      int: {
        score: '53',
        mod: '+6',
      },
      con: {
        score: '102',
        mod: '+7',
      },
      dex: {
        score: '54',
        mod: '+6',
      },
      cha: {
        score: '24',
        mod: '+5',
      },
    },
    attacks: [
      {
        name: 'Berserk Howl',
        toHit: '16+F',
        damage: '6d10+6 Sonic',
        range: '40ft Burst radius',
        effect: 'Major Fail+: Paralyzed',
      },
      {
        name: 'Fowl Hug',
        toHit: '16+F',
        damage: '6d12+6 Bludgeoning',
        range: '5ft range',
        effect: 'On hit: Held',
      },
      {
        name: 'Pounce',
        toHit: '16+F',
        damage: '6d10+6 Bludgeoning',
        range: '5ft range',
        effect: 'On hit: Staggered, Take Down',
      },
      {
        name: 'Talon Strike',
        toHit: '16+F',
        damage: '7d12+6 Piercing',
        range: '5ft range,',
        effect: 'Major Fail+: Blood Trail',
      },
    ],
    notes:
      'The Ceiling: ranged hit with 50ft reach dealing 12+ → ceiling section falls, 4d10 to all beneath; ×2 if the Boss is airborne. (Secret: happens twice.)\nFanatic: immune to fear, charm, mind-affecting.\nFlight: flies at normal Move in Skyfowl form.\nNo Fowl Fool: ≤½ Health Bars → takes Elf form, blends into minions; crawlers hit him at Disadvantage.\nShift Stick: action → swaps Elf/Skyfowl form; crawlers get Advantage to hit that round.\n\nFull text: Core Rulebook p. 399.',
    source: 'Core Rulebook p. 399',
    chapter: 'Floor 3 · The Over City',
    floor: 3,
    description:
      "Elf? Bird? A pissed-off Borough Boss who can't commit, like your ex. His talons roll d12s and his hugs break spines. Pro tip: shoot the ceiling. It's held up with spit and optimism. When he's hurt he hides among his goons like a coward, which is hilarious, and a Disadvantage for you.",
    prevDescriptions: [
      "A shapeshifting Borough Boss who can't decide if he's an elf or a bird, so he's both, and furious about it. Level 65, talons that roll d12s. Pro tip: look up. That ceiling is held together with hope and bad architecture. Also, when he starts hiding, he's scared. Enjoy that.",
    ],
    prevNotes: [
      'Special: The Ceiling; Fanatic; Flight; No Fowl Fool; Shift Stick. Full text: Core Rulebook p. 399.',
      'The Ceiling: ranged hit with 50ft reach dealing 12+ → ceiling section falls, 4d10 to all beneath; ×2 if the Boss is airborne. (Secret: happens twice.)\nFanatic: immune to fear, charm, mind-affecting.\nFlight: flies at normal Move in Skyfowl form.\nNo Fowl Fool: ≤½ Health Bars → takes Elf form, blends into minions; crawlers hit him at Disadvantage.\nShift Stick: action → swaps Elf/Skyfowl form; crawlers get Advantage to hit that round.\n\nFull text: Core Rulebook p. 399.',
    ],
    descriptionEs:
      '¿Elfo? ¿Pájaro? Un Jefe de Distrito muy cabreado que no se decide, como tu ex. Sus garras tiran d12 y sus abrazos parten columnas. Pro-Tip: dispara al techo. Se sostiene con saliva y optimismo. Cuando está herido se esconde entre sus matones como un cobarde, lo cual es desternillante, y una Desventaja para ti.',
    prevDescriptionsEs: [
      '¿Elfo? ¿Pájaro? Un Jefe de Distrito muy cabreado que no se decide, como tu ex. Sus garras tiran d12 y sus abrazos parten columnas. Consejo pro: dispara al techo. Se sostiene con saliva y optimismo. Cuando está herido se esconde entre sus matones como un cobarde, lo cual es desternillante, y una Desventaja para ti.',
    ],
  },
  {
    name: 'City Elf',
    kind: 'mob',
    size: 'Medium (4)',
    tags: 'Humanoid',
    slots: '10',
    slotValue: '4',
    level: '15',
    surprise: '14+F',
    evade: '14+F',
    move: '20+S',
    dr: '3',
    stats: {
      str: {
        score: '10',
        mod: '+4',
      },
      int: {
        score: '13',
        mod: '+4',
      },
      con: {
        score: '10',
        mod: '+4',
      },
      dex: {
        score: '10',
        mod: '+4',
      },
      cha: {
        score: '7',
        mod: '+3',
      },
    },
    attacks: [
      {
        name: 'Firestorm Spell',
        toHit: '14+F',
        damage: '2d6+4 Fire',
        range: '30ft range, 10ft Blast radius',
        effect: 'Burned',
      },
      {
        name: 'Force Spear Spell',
        toHit: '14+F',
        damage: '3d10+4 Force',
        range: '10ft range',
        effect: 'Major Fail+: Staggered',
      },
      {
        name: 'Lightning Rod',
        toHit: '14+F',
        damage: '3d8+4 Electric',
        range: '5ft range',
        effect: 'Major Fail+: Shocked',
      },
    ],
    notes:
      'Ambush: 404th elves ≥10ft above target → Advantage on attacks.\nBrotherly Rage: vs 201st City Elves → Advantage attacking, Disadvantage Evading.\n\nFull text: Core Rulebook p. 403.',
    source: 'Core Rulebook p. 403',
    chapter: 'Floor 3 · The Over City',
    floor: 3,
    description:
      "Street elves with fire spells, force spears, and a civil war nobody on Earth asked about. They're fucking deadly from the high ground. Pro tip: if the 201st shows up, stand back. Nothing burns hotter than family drama, and they drop their guard while doing it.",
    prevDescriptions: [
      'Revolutionary street elves with fire spells and a lightning rod, fighting a civil war over what I assume is a parking dispute. Pro tip: they love the high ground. Also, their cousins in the 201st drive them nuts, so maybe introduce them.',
    ],
    prevNotes: [
      'Special: Ambush; Brotherly Rage. Full text: Core Rulebook p. 403.',
      'Ambush: 404th elves ≥10ft above target → Advantage on attacks.\nBrotherly Rage: vs 201st City Elves → Advantage attacking, Disadvantage Evading.\n\nFull text: Core Rulebook p. 403.',
    ],
    descriptionEs:
      'Elfos callejeros con hechizos de fuego, lanzas de fuerza y una guerra civil que a nadie en la Tierra le importa una mierda. Desde las alturas son jodidamente letales. Pro-Tip: si aparece el 201.º, apártate. Nada arde más que un drama familiar, y bajan la guardia mientras están a ello.',
    prevDescriptionsEs: [
      'Elfos callejeros con hechizos de fuego, lanzas de fuerza y una guerra civil que a nadie en la Tierra le importa una mierda. Desde las alturas son jodidamente letales. Consejo pro: si aparece el 201.º, apártate. Nada arde más que un drama familiar, y bajan la guardia mientras están a ello.',
    ],
  },
  {
    name: 'Night Ray',
    kind: 'mob',
    size: 'Huge (6)',
    tags: 'Animal',
    slots: '10',
    slotValue: '4',
    level: '13',
    surprise: '12+F',
    evade: '14+F',
    move: '30+S',
    dr: '3',
    stats: {
      str: {
        score: '13',
        mod: '+4',
      },
      int: {
        score: '3',
        mod: '+2',
      },
      con: {
        score: '12',
        mod: '+4',
      },
      dex: {
        score: '13',
        mod: '+4',
      },
      cha: {
        score: '3',
        mod: '+2',
      },
    },
    attacks: [
      {
        name: 'Barbed Spines',
        toHit: '14+F',
        damage: '3d4+4 Piercing',
        range: '30ft range',
        effect: 'Major Fail+: Poisoned, Blood Trail',
      },
      {
        name: 'Sting',
        toHit: '14+F',
        damage: '3d6+4 Piercing',
        range: '10ft range',
        effect: 'Major Fail+: Stunned',
      },
    ],
    notes:
      'Glimmering Hide: Resistance to all Spell damage.\nGills: water-breathing.\nGlide: airborne up to ½ Move per round.\nSwim: water counts as ground for movement.\n\nFull text: Core Rulebook p. 404.',
    source: 'Core Rulebook p. 404',
    chapter: 'Floor 3 · The Over City',
    floor: 3,
    description:
      'A Huge flying, swimming manta ray that shoots barbs 30 feet. Evolution clearly just gave up and let it do whatever the hell it wanted. Pro tip: that shiny hide shrugs off spell damage, so casters, go stand in the back and feel useless for once.',
    prevDescriptions: [
      "A Huge manta ray that flies, swims, and shoots poisoned barbs. Nature said 'pick one' and it said no. Pro tip: its shiny skin shrugs off spells, so casters, go find a pointy stick.",
    ],
    prevNotes: [
      'Special: Glimmering Hide; Gills; Glide; Swim. Full text: Core Rulebook p. 404.',
      'Glimmering Hide: Resistance to all Spell damage.\nGills: water-breathing.\nGlide: airborne up to ½ Move per round.\nSwim: water counts as ground for movement.\n\nFull text: Core Rulebook p. 404.',
    ],
    descriptionEs:
      'Una mantarraya Huge que vuela, nada y dispara púas a 30 pies. Está claro que la evolución se rindió y la dejó hacer lo que le saliera de las narices. Pro-Tip: esa piel brillante pasa del daño de hechizos, así que, lanzadores, id al fondo y sentíos inútiles por una vez.',
    prevDescriptionsEs: [
      'Una mantarraya Huge que vuela, nada y dispara púas a 30 pies. Está claro que la evolución se rindió y la dejó hacer lo que le saliera de las narices. Consejo pro: esa piel brillante pasa del daño de hechizos, así que, lanzadores, id al fondo y sentíos inútiles por una vez.',
    ],
  },
  {
    name: 'Scolopendrini',
    kind: 'mob',
    size: 'Huge (6)',
    tags: 'Animal',
    slots: '10',
    slotValue: '5',
    level: '20',
    surprise: '12+F',
    evade: '14+F',
    move: '25+S',
    dr: '4',
    stats: {
      str: {
        score: '25',
        mod: '+5',
      },
      int: {
        score: '5',
        mod: '+2',
      },
      con: {
        score: '21',
        mod: '+5',
      },
      dex: {
        score: '13',
        mod: '+4',
      },
      cha: {
        score: '1',
        mod: '+1',
      },
    },
    attacks: [
      {
        name: 'Pincer',
        toHit: '15+F',
        damage: '3d8+5 Piercing',
        range: '10ft range',
        effect: 'On hit: Held',
      },
      {
        name: 'Poison Breath',
        toHit: '14+F',
        damage: '2d10+4 Poison',
        range: '20ft Cone',
        effect: 'Major Fail+: Poisoned',
      },
      {
        name: 'Slice and Dice',
        toHit: '15+F',
        damage: '3d10+5 Slashing',
        range: '5ft range',
        effect: 'Major Fail+: Blood Trail',
      },
    ],
    notes:
      'Cold Weakness: Disadvantage to Evade Ice attacks and takes x2 damage from them.\n\nFull text: Core Rulebook p. 404.',
    source: 'Core Rulebook p. 404',
    chapter: 'Floor 3 · The Over City',
    floor: 3,
    description:
      "A Huge centipede with pincers, poison breath, and more legs than you have hopes. You'll hear it before you see it, then you'll shit yourself. Pro tip: it hates the cold. Ice hits it double and it can barely dodge them. Everyone else? Bring a freezer, or a will.",
    prevDescriptions: [
      'Picture a centipede. Now make it Huge, give it pincers and poison breath, and remove any reason to live near it. Pro tip: it hates the cold. Ice mages, this is your moment. Everyone else, pack a freezer.',
    ],
    prevNotes: [
      'Special: Cold Weakness. Full text: Core Rulebook p. 404.',
      'Cold Weakness: Disadvantage to Evade Ice attacks and takes x2 damage from them.\n\nFull text: Core Rulebook p. 404.',
    ],
    descriptionEs:
      'Un ciempiés Huge con pinzas, aliento venenoso y más patas que tú esperanzas. Lo oirás antes de verlo, y luego te cagarás encima. Pro-Tip: odia el frío. El hielo le hace el doble y apenas puede esquivarlo. ¿Los demás? Traed un congelador o un testamento.',
    prevDescriptionsEs: [
      'Un ciempiés Huge con pinzas, aliento venenoso y más patas que tú esperanzas. Lo oirás antes de verlo, y luego te cagarás encima. Consejo pro: odia el frío. El hielo le hace el doble y apenas puede esquivarlo. ¿Los demás? Traed un congelador o un testamento.',
    ],
  },
  {
    name: 'Cyborg Mechanic',
    kind: 'npc',
    size: 'Huge (6)',
    tags: 'NPC, Cyborg',
    slots: '10',
    slotValue: '6',
    level: '45',
    surprise: '15+F',
    evade: '15+F',
    move: '25+S',
    dr: '4',
    stats: {
      str: {
        score: '23',
        mod: '+5',
      },
      int: {
        score: '25',
        mod: '+5',
      },
      con: {
        score: '57',
        mod: '+6',
      },
      dex: {
        score: '22',
        mod: '+5',
      },
      cha: {
        score: '13',
        mod: '+4',
      },
    },
    attacks: [
      {
        name: 'Fast Disassemble',
        toHit: '15+F',
        damage: 'No damage',
        range: '10ft range',
        effect: 'Special effect',
      },
      {
        name: 'Monkey Wrench',
        toHit: '15+F',
        damage: '5d8+5 Bludgeoning',
        range: '10ft range',
        effect: 'Major Fail+: Staggered',
      },
      {
        name: 'Multi-Weapon',
        toHit: '15+F',
        damage: '5d10+5 Bludgeoning,',
        range: '',
        effect: 'Major Fail+: Woozy',
      },
    ],
    notes:
      'Identify Weakness: Action studying a crawler → Advantage on her next attack vs them.\nFast Disassemble: hit → Dex Stat Check; Fail → one held item broken down, useless until 2 Actions spent rebuilding it.\nMulti-Weapon: damage type her pick (Bludgeoning/Piercing/Slashing); 10ft range.\n\nFull text: Core Rulebook p. 405.',
    source: 'Core Rulebook p. 405',
    chapter: 'Floor 3 · The Over City',
    floor: 3,
    description:
      "Helga is Huge, half machine, and can strip your gear down to screws in the middle of a fight. Enjoy rebuilding your sword while she beats you with a wrench. Pro tip: if she stops to stare at you, she isn't flirting. She's finding your weak spot. Move your ass.",
    prevDescriptions: [
      "Helga the mechanic: Huge, cybernetic, and able to strip your gear down to screws mid-fight. She reads you like a repair manual before she swings. Pro tip: when she stops to study you, it's not admiration. Move.",
    ],
    prevNotes: [
      'Special: Identify Weakness. Full text: Core Rulebook p. 405.',
      'Identify Weakness: Action studying a crawler → Advantage on her next attack vs them.\nFast Disassemble: hit → Dex Stat Check; Fail → one held item broken down, useless until 2 Actions spent rebuilding it.\nMulti-Weapon: damage type her pick (Bludgeoning/Piercing/Slashing); 10ft range.\n\nFull text: Core Rulebook p. 405.',
    ],
    descriptionEs:
      'Helga es Huge, medio máquina y capaz de desmontarte el equipo hasta el último tornillo en plena pelea. Disfruta reconstruyendo tu espada mientras te zurra con una llave inglesa. Pro-Tip: si se para a mirarte fijamente, no está ligando. Está buscando tu punto débil. Mueve el culo.',
    prevDescriptionsEs: [
      'Helga es Huge, medio máquina y capaz de desmontarte el equipo hasta el último tornillo en plena pelea. Disfruta reconstruyendo tu espada mientras te zurra con una llave inglesa. Consejo pro: si se para a mirarte fijamente, no está ligando. Está buscando tu punto débil. Mueve el culo.',
    ],
  },
  {
    name: 'Kibril Atheras Darkoak',
    kind: 'boss',
    size: 'Medium (4)',
    tags: 'Quest Boss, Humanoid',
    slots: '13',
    slotValue: '5',
    level: '60',
    surprise: '16+F',
    evade: '16+F',
    move: '20+S',
    dr: '4',
    stats: {
      str: {
        score: '55',
        mod: '+6',
      },
      int: {
        score: '55',
        mod: '+6',
      },
      con: {
        score: '30',
        mod: '+5',
      },
      dex: {
        score: '55',
        mod: '+6',
      },
      cha: {
        score: '10',
        mod: '+4',
      },
    },
    attacks: [
      {
        name: 'Kinetic Blast',
        toHit: '16+F',
        damage: '6d10+6 Force',
        range: '50ft range',
        effect: '',
      },
      {
        name: 'Choking Gas',
        toHit: '16+F',
        damage: '6d6+6 Poison',
        range: '30ft Cone',
        effect: 'Major Fail+: Poisoned',
      },
      {
        name: 'Deadly D4s',
        toHit: '16+F',
        damage: '7d4+6 Piercing',
        range: '30ft range',
        effect: 'Major Fail+: Blood Trail',
      },
      {
        name: 'Fire Storm',
        toHit: '16+F',
        damage: '5d8+6 Fire',
        range: '50ft range, 20ft',
        effect: 'Burned',
      },
    ],
    notes:
      'Earthen Wall: action → raises earth/stone barriers to cut crawlers off; Advantage vs isolated crawlers.\nSoul Crystal Shield: orbiting crystals share his Evade; each hit knocks out its tied ability for 1 round and gives −1 DR and −1 Evade next round. Perception (Int-Opposed) or Int Stat Check, same Difficulty → learn which crystal does what.\n\nFull text: Core Rulebook p. 410.',
    source: 'Core Rulebook p. 410',
    chapter: 'Floor 3 · The Over City',
    floor: 3,
    description:
      'A carnival wizard armed with fire, gas, walls of rock, and a spell that throws d4s at you. Yes. Legos of death. He loves cutting one poor idiot off from the pack. Pro tip: the crystals orbiting him each power something. Figure out which, then smash the fuckers.',
    prevDescriptions: [
      "A carnival wizard with an arsenal of spells and a bag of caltrop-sharp d4s, because some people just want to watch you step on dice. Pro tip: those glowy marbles orbiting him aren't jewelry. Smash them and watch his defenses crumble.",
    ],
    prevNotes: [
      'Special: Earthen Wall; Soul Crystal Shield. Full text: Core Rulebook p. 410.',
      'Earthen Wall: action → raises earth/stone barriers to cut crawlers off; Advantage vs isolated crawlers.\nSoul Crystal Shield: orbiting crystals share his Evade; each hit knocks out its tied ability for 1 round and gives −1 DR and −1 Evade next round. Perception (Int-Opposed) or Int Stat Check, same Difficulty → learn which crystal does what.\n\nFull text: Core Rulebook p. 410.',
    ],
    descriptionEs:
      'Un mago de feria armado con fuego, gas, muros de roca y un hechizo que te lanza d4. Sí. Piezas de Lego de la muerte. Le encanta separar del grupo a algún pobre idiota. Pro-Tip: cada uno de los cristales que orbitan a su alrededor alimenta algo. Averigua qué, y luego revienta a esos cabrones.',
    prevDescriptionsEs: [
      'Un mago de feria armado con fuego, gas, muros de roca y un hechizo que te lanza d4. Sí. Piezas de Lego de la muerte. Le encanta separar del grupo a algún pobre idiota. Consejo pro: cada uno de los cristales que orbitan a su alrededor alimenta algo. Averigua qué, y luego revienta a esos cabrones.',
    ],
  },
  {
    name: 'Former Circus Lemur',
    kind: 'mob',
    size: 'Petite (3)',
    tags: 'Animal',
    slots: '8',
    slotValue: '3',
    level: '8',
    surprise: '12+F',
    evade: '14+F',
    move: '20+S',
    dr: '3',
    stats: {
      str: {
        score: '7',
        mod: '+3',
      },
      int: {
        score: '3',
        mod: '+2',
      },
      con: {
        score: '6',
        mod: '+3',
      },
      dex: {
        score: '10',
        mod: '+4',
      },
      cha: {
        score: '3',
        mod: '+2',
      },
    },
    attacks: [
      {
        name: 'Skinning Knives',
        toHit: '14+F',
        damage: '2d4+3 Piercing',
        range: '15ft range',
        effect: 'Major Fail+: Blood Trail',
      },
      {
        name: 'Vicious Bites',
        toHit: '13+F',
        damage: '2d8+3 Piercing',
        range: '5ft range',
        effect: 'On hit: Shit',
      },
    ],
    notes:
      'Jumpy: as an Action, leaps up to twice its Move by swinging off something like a ledge, lamp post, or giraffe.\nStealthy: does not show on the mini-map until it attacks.\n\nFull text: Core Rulebook p. 413.',
    source: 'Core Rulebook p. 413',
    chapter: 'Floor 3 · The Over City',
    floor: 3,
    description:
      "Unemployed circus lemurs with skinning knives and a lot of rage about pension plans. They don't show up on your map until they're gnawing on your face. Pro tip: see a giraffe? Look up. Lemurs travel by neck.",
    prevDescriptions: [
      "Out-of-work circus lemurs with skinning knives and grudges. They don't show up on your map until they're already on your face. Pro tip: if a giraffe is nearby, look up. Lemurs come in by air.",
    ],
    prevNotes: [
      'Special: Jumpy; Stealthy. Full text: Core Rulebook p. 413.',
      'Jumpy: as an Action, leaps up to twice its Move by swinging off something like a ledge, lamp post, or giraffe.\nStealthy: does not show on the mini-map until it attacks.\n\nFull text: Core Rulebook p. 413.',
    ],
    descriptionEs:
      'Lémures de circo en paro con cuchillos de desollar y muchísima rabia por el tema de las pensiones. No aparecen en tu mapa hasta que te están royendo la cara. Pro-Tip: ¿ves una jirafa? Mira arriba. Los lémures viajan en cuello.',
    prevDescriptionsEs: [
      'Lémures de circo en paro con cuchillos de desollar y muchísima rabia por el tema de las pensiones. No aparecen en tu mapa hasta que te están royendo la cara. Consejo pro: ¿ves una jirafa? Mira arriba. Los lémures viajan en cuello.',
    ],
  },
  {
    name: 'Giraffe',
    kind: 'mob',
    size: 'Huge (6)',
    tags: 'Animal',
    slots: '10',
    slotValue: '4',
    level: '10',
    surprise: '13+F',
    evade: '13+F',
    move: '30+S',
    dr: '3',
    stats: {
      str: {
        score: '10',
        mod: '+4',
      },
      int: {
        score: '6',
        mod: '+3',
      },
      con: {
        score: '10',
        mod: '+4',
      },
      dex: {
        score: '6',
        mod: '+3',
      },
      cha: {
        score: '3',
        mod: '+2',
      },
    },
    attacks: [
      {
        name: 'Back Kick',
        toHit: '14+F',
        damage: '2d6+4 Bludgeoning',
        range: '10ft range',
        effect: 'On hit: Stunned',
      },
      {
        name: 'Bite',
        toHit: '14+F',
        damage: '3d6+4 Piercing',
        range: '10ft range',
        effect: 'Major Fail+: Blood Trail',
      },
      {
        name: 'Hail of Lemurs',
        toHit: '13+F',
        damage: 'No damage',
        range: '30ft range',
        effect: 'On hit: Held',
      },
    ],
    notes:
      'Burst of Speed: one free Move Action once per combat.\nDisruption: after a Burst of Speed approach, drops 2d6 Former Circus Lemurs among enemy groups to split them.\nHail of Lemurs: twice per combat, flings 2d6 Former Circus Lemurs that swarm the target.\nBack Kick: hit crawlers become Stunned.\n\nFull text: Core Rulebook p. 413.',
    source: 'Core Rulebook p. 413',
    chapter: 'Floor 3 · The Over City',
    floor: 3,
    description:
      "It's a giraffe. It kicks you into a Stun, bites you from ten feet up, and then fires lemurs off its neck like a hairy fucking mortar. Nature didn't do this. I did. Pro tip: it only throws lemurs twice per fight. Survive the fur storm, then climb.",
    prevDescriptions: [
      "A giraffe. A Huge, kicking, biting giraffe that launches lemurs from its neck like a furry artillery piece. I didn't design this one. Okay, I did, and I'm proud. Pro tip: it only has so many lemur volleys. Survive the rain, then climb.",
    ],
    prevNotes: [
      'Special: Burst of Speed; Disruption; Hail of Lemurs. Full text: Core Rulebook p. 413.',
      'Burst of Speed: one free Move Action once per combat.\nDisruption: after a Burst of Speed approach, drops 2d6 Former Circus Lemurs among enemy groups to split them.\nHail of Lemurs: twice per combat, flings 2d6 Former Circus Lemurs that swarm the target.\nBack Kick: hit crawlers become Stunned.\n\nFull text: Core Rulebook p. 413.',
    ],
    descriptionEs:
      'Es una jirafa. Te patea hasta dejarte en Stun, te muerde desde diez pies de altura y luego dispara lémures desde el cuello como un puto mortero peludo. Esto no lo ha hecho la naturaleza. Lo he hecho yo. Pro-Tip: solo lanza lémures dos veces por combate. Sobrevive a la tormenta de pelo y luego trepa.',
    prevDescriptionsEs: [
      'Es una jirafa. Te patea hasta dejarte en Stun, te muerde desde diez pies de altura y luego dispara lémures desde el cuello como un puto mortero peludo. Esto no lo ha hecho la naturaleza. Lo he hecho yo. Consejo pro: solo lanza lémures dos veces por combate. Sobrevive a la tormenta de pelo y luego trepa.',
    ],
  },
  {
    name: 'Stilt Clown',
    kind: 'mob',
    size: 'Large (5)',
    tags: 'Humanoid',
    slots: '10',
    slotValue: '3',
    level: '10',
    surprise: '13+F',
    evade: '14+F',
    move: '20+S',
    dr: '3',
    stats: {
      str: {
        score: '10',
        mod: '+4',
      },
      int: {
        score: '6',
        mod: '+3',
      },
      con: {
        score: '6',
        mod: '+3',
      },
      dex: {
        score: '10',
        mod: '+4',
      },
      cha: {
        score: '3',
        mod: '+2',
      },
    },
    attacks: [
      {
        name: 'Arm Whip',
        toHit: '14+F',
        damage: '3d6+4 Bludgeoning',
        range: '10ft range',
        effect: 'Special effect',
      },
      {
        name: 'Butcher Knife',
        toHit: '14+F',
        damage: '3d6+4 Slashing',
        range: '10ft range',
        effect: 'Major Fail+: Blood Trail',
      },
    ],
    notes:
      'Freakish Smile: first time a crawler moves within 10ft, they make an Int Stat Check; on Fail they become Terrified.\nRubbery Arms: can stretch arms and head to double length for an attack, but its next attack is limited to 5ft range.\nArm Whip: hit crawlers are pushed 10ft.\n\nFull text: Core Rulebook p. 414.',
    source: 'Core Rulebook p. 414',
    chapter: 'Floor 3 · The Over City',
    floor: 3,
    description:
      "Ten feet of clown on stilts with taffy arms and a butcher knife. If you weren't scared of clowns before, your first Int check will fix that. Pro tip: after it stretches for the long reach, it's stuck at 5 feet for its next swing. Get in close. Try not to piss yourself.",
    prevDescriptions: [
      "Ten feet of clown on stilts, with arms that stretch like taffy and a butcher knife. Coulrophobes, this is your final boss. Pro tip: after a long-reach attack its arms snap back, so that's your window to close in.",
    ],
    prevNotes: [
      'Special: Freakish Smile; Rubbery Arms. Full text: Core Rulebook p. 414.',
      'Freakish Smile: first time a crawler moves within 10ft, they make an Int Stat Check; on Fail they become Terrified.\nRubbery Arms: can stretch arms and head to double length for an attack, but its next attack is limited to 5ft range.\nArm Whip: hit crawlers are pushed 10ft.\n\nFull text: Core Rulebook p. 414.',
    ],
    descriptionEs:
      'Diez pies de payaso con zancos, brazos de caramelo masticable y un cuchillo de carnicero. Si antes no te daban miedo los payasos, tu primera tirada de Int lo arreglará. Pro-Tip: después de estirarse para el alcance largo, se queda a 5 pies para el siguiente golpe. Acércate. Intenta no mearte encima.',
    prevDescriptionsEs: [
      'Diez pies de payaso con zancos, brazos de caramelo masticable y un cuchillo de carnicero. Si antes no te daban miedo los payasos, tu primera tirada de Int lo arreglará. Consejo pro: después de estirarse para el alcance largo, se queda a 5 pies para el siguiente golpe. Acércate. Intenta no mearte encima.',
    ],
  },
  {
    name: 'Fat Clown',
    kind: 'mob',
    size: 'Medium (4)',
    tags: 'Humanoid',
    slots: '9',
    slotValue: '3',
    level: '9',
    surprise: '12+F',
    evade: '12+F',
    move: '20+S',
    dr: '3',
    stats: {
      str: {
        score: '13',
        mod: '+3',
      },
      int: {
        score: '3',
        mod: '+2',
      },
      con: {
        score: '11',
        mod: '+3',
      },
      dex: {
        score: '4',
        mod: '+2',
      },
      cha: {
        score: '1',
        mod: '+1',
      },
    },
    attacks: [
      {
        name: 'Dirty Nails',
        toHit: '13+F',
        damage: '1d10+3 Slashing',
        range: '10ft range',
        effect: 'On hit: Poisoned',
      },
      {
        name: 'Honker Horn',
        toHit: '13+F',
        damage: '2d6+3 Sonic',
        range: '15ft Cone',
        effect: 'Major Fail+: Muted',
      },
    ],
    notes:
      'Freakish Smile: first time within 10ft → Int Stat Check; Fail → Terrified.\nRoiling Belly: Poisoned immunity.\n\nFull text: Core Rulebook p. 415.',
    source: 'Core Rulebook p. 415',
    chapter: 'Floor 3 · The Over City',
    floor: 3,
    description:
      "A honking clown with dirty nails and a belly so foul even poison won't go in there. That horn gets you in a 15ft cone, and those nails have definitely been somewhere unspeakable. Pro tip: don't get scratched. Or do, and find out what grows.",
    prevDescriptions: [
      "A rotund clown with filthy nails and a horn that honks you into silence. Poison won't touch him; that stomach has seen things. Pro tip: don't let him scratch you. Tetanus is a real debuff in my heart.",
    ],
    prevNotes: [
      'Special: Freakish Smile; Roiling Belly. Full text: Core Rulebook p. 415.',
      'Freakish Smile: first time within 10ft → Int Stat Check; Fail → Terrified.\nRoiling Belly: Poisoned immunity.\n\nFull text: Core Rulebook p. 415.',
    ],
    descriptionEs:
      'Un payaso con bocina, uñas mugrientas y una barriga tan asquerosa que ni el veneno quiere entrar ahí. Esa bocina te pilla en un cono de 15 pies, y esas uñas han estado, sin duda, en algún sitio innombrable. Pro-Tip: que no te arañe. O sí, y descubre qué te crece.',
    prevDescriptionsEs: [
      'Un payaso con bocina, uñas mugrientas y una barriga tan asquerosa que ni el veneno quiere entrar ahí. Esa bocina te pilla en un cono de 15 pies, y esas uñas han estado, sin duda, en algún sitio innombrable. Consejo pro: que no te arañe. O sí, y descubre qué te crece.',
    ],
  },
  {
    name: 'Mold Lion',
    kind: 'mob',
    size: 'Large (5)',
    tags: 'Animal',
    slots: '10',
    slotValue: '4',
    level: '15',
    surprise: '13+F',
    evade: '14+F',
    move: '25+S',
    dr: '3',
    stats: {
      str: {
        score: '20',
        mod: '+5',
      },
      int: {
        score: '6',
        mod: '+3',
      },
      con: {
        score: '11',
        mod: '+4',
      },
      dex: {
        score: '10',
        mod: '+4',
      },
      cha: {
        score: '3',
        mod: '+2',
      },
    },
    attacks: [
      {
        name: 'Claw',
        toHit: '15+F',
        damage: '3d8+5 Slashing',
        range: '5ft range',
        effect: 'Major Fail+: Blood Trail',
      },
      {
        name: 'Pounce',
        toHit: '15+F',
        damage: '3d6+5 Bludgeoning',
        range: '10ft range',
        effect: 'Major Fail+: Take Down',
      },
      {
        name: 'Roar',
        toHit: '13+F',
        damage: '2d6+3 Sonic',
        range: '30ft Cone',
        effect: 'On hit: Terrified',
      },
    ],
    notes:
      'Pride Power: 2+ Mold Lions adjacent to one target → each gets Advantage attacking it.\n\nFull text: Core Rulebook p. 415.',
    source: 'Core Rulebook p. 415',
    chapter: 'Floor 3 · The Over City',
    floor: 3,
    description:
      "A lion that's gone moldy, like the bread you forgot about. Now it smells like a gym bag and hunts in packs. Two on one target and they both get Advantage. Pro tip: split them up. Also don't breathe near it. Or through your mouth. Or at all.",
    prevDescriptions: [
      'A lion covered in mold, which is somehow worse than a regular lion and also a health code violation. They hunt in prides and roar you into a panic. Pro tip: keep them from double-teaming. Also maybe wear a mask.',
    ],
    prevNotes: [
      'Special: Pride Power. Full text: Core Rulebook p. 415.',
      'Pride Power: 2+ Mold Lions adjacent to one target → each gets Advantage attacking it.\n\nFull text: Core Rulebook p. 415.',
    ],
    descriptionEs:
      'Un león que se ha enmohecido, como el pan del que te olvidaste. Ahora huele a bolsa de gimnasio y caza en manada. Dos contra el mismo objetivo y los dos tienen Ventaja. Pro-Tip: sepáralos. Y no respires cerca. Ni por la boca. Ni en general.',
    prevDescriptionsEs: [
      'Un león que se ha enmohecido, como el pan del que te olvidaste. Ahora huele a bolsa de gimnasio y caza en manada. Dos contra el mismo objetivo y los dos tienen Ventaja. Consejo pro: sepáralos. Y no respires cerca. Ni por la boca. Ni en general.',
    ],
  },
  {
    name: 'Ogre',
    kind: 'mob',
    size: 'Large (5)',
    tags: 'Humanoid',
    slots: '10',
    slotValue: '3',
    level: '11',
    surprise: '11+F',
    evade: '13+F',
    move: '20+S',
    dr: '4',
    stats: {
      str: {
        score: '21',
        mod: '+5',
      },
      int: {
        score: '1',
        mod: '+1',
      },
      con: {
        score: '7',
        mod: '+3',
      },
      dex: {
        score: '6',
        mod: '+3',
      },
      cha: {
        score: '3',
        mod: '+2',
      },
    },
    attacks: [
      {
        name: 'Bear Hug',
        toHit: '15+F',
        damage: '2d6+5 Bludgeoning',
        range: '5ft range',
        effect: 'On hit: Held',
      },
      {
        name: 'Club',
        toHit: '15+F',
        damage: '3d4+5 Bludgeoning',
        range: '5ft range',
        effect: 'Major Fail+: Staggered',
      },
    ],
    notes:
      "Battle Worn: target crawler's Level ≥ Ogre's → Ogre attacks with Advantage.\n\nFull text: Core Rulebook p. 416.",
    source: 'Core Rulebook p. 416',
    chapter: 'Floor 3 · The Over City',
    floor: 3,
    description:
      'A big, dumb, club-swinging ogre who gets a hard-on for fighting anyone as tough as he is. The higher your level, the better his odds. Pro tip: being underleveled finally pays off. Send in the weakest crawler. You know who it is. We all know.',
    prevDescriptions: [
      'Big, green-ish, and deeply unimpressed by your résumé. The stronger you are, the better it fights, like a mid-level manager. Pro tip: being underleveled is actually a perk here. Finally, a reason to be bad at this.',
    ],
    prevNotes: [
      'Special: Battle Worn. Full text: Core Rulebook p. 416.',
      "Battle Worn: target crawler's Level ≥ Ogre's → Ogre attacks with Advantage.\n\nFull text: Core Rulebook p. 416.",
    ],
    descriptionEs:
      'Un ogro grande, tonto y armado con una porra al que le pone cachondo pelear con cualquiera tan duro como él. Cuanto más alto sea tu nivel, mejores son sus probabilidades. Pro-Tip: por fin compensa ir con nivel bajo. Manda al crawler más débil. Ya sabes quién es. Todos lo sabemos.',
    prevDescriptionsEs: [
      'Un ogro grande, tonto y armado con una porra al que le pone cachondo pelear con cualquiera tan duro como él. Cuanto más alto sea tu nivel, mejores son sus probabilidades. Consejo pro: por fin compensa ir con nivel bajo. Manda al crawler más débil. Ya sabes quién es. Todos lo sabemos.',
    ],
  },
  {
    name: 'Tsarina Signet',
    kind: 'elite',
    size: 'Medium (4)',
    tags: 'Elite, Humanoid',
    slots: '13',
    slotValue: '5',
    level: '60',
    surprise: '16+F',
    evade: '16+F',
    move: '25+S',
    dr: '3',
    stats: {
      str: {
        score: '22',
        mod: '+5',
      },
      int: {
        score: '53',
        mod: '+6',
      },
      con: {
        score: '25',
        mod: '+5',
      },
      dex: {
        score: '53',
        mod: '+6',
      },
      cha: {
        score: '52',
        mod: '+6',
      },
    },
    attacks: [
      {
        name: 'Energy Bolt Spell',
        toHit: '16+F',
        damage: '7d6+6 Force',
        range: '50ft range',
        effect: '',
      },
      {
        name: 'Charming Seduction Spell',
        toHit: '16+F',
        damage: 'No damage',
        range: '10ft range',
        effect: 'On hit: Charmed; once per day',
      },
      {
        name: 'Sacrificial Blade',
        toHit: '15+F',
        damage: '6d4+5 Slashing',
        range: '5ft range',
        effect: 'On hit: Blood Trail',
      },
      {
        name: 'Water Lily Spell',
        toHit: '16+F',
        damage: 'No damage',
        range: '10ft range',
        effect: 'On hit: Unconscious; once per day',
      },
    ],
    notes:
      "Blood Magic: tattoo-marked creature/crawler hits 0% HB → its blood is drawn to Signet; this is the fuel for Ink Marauder.\nInk Marauder: spend Blood Magic → 1+ tattoos animate as flat paper copies of the Mobs pictured; Stats = ½ the original's. Copy slain → becomes a tattoo on her again.\nWater Cursed: water never contacts her skin; Immunity to Ice damage.\nCharming Seduction Spell: on hit → Int Stat Check; Fail → Charmed (no attacks on Signet; stays still or follows basic non-hostile orders). New Check 1/day or each time damaged. Mind Control.\nWater Lily Spell: 1/day. On hit → Int Stat Check; Fail → Unconscious (prone, no actions, damage doesn't wake them) until Signet drops the Spell.\n\nFull text: Core Rulebook p. 416.",
    source: 'Core Rulebook p. 416',
    chapter: 'Floor 3 · The Over City',
    floor: 3,
    description:
      "Tsarina Signet: level 60, tattooed from head to toe, and every piece of ink can peel off and eat you. She'll charm you into obedience, knock you out cold, and turn your dead friends into fuel. Pro tip: her magic runs on blood. So stop bleeding. Simple, right? Right?",
    prevDescriptions: [
      "Tsarina Signet: level 60 Elite, walking art gallery, and every piece can come to life and bite you. She'll charm you, knock you out, and make a paper monster out of your friends. Pro tip: her ink runs on blood. Stop bleeding near her. Easy, right?",
    ],
    prevNotes: [
      'Special: Blood Magic; Ink Marauder; Water Cursed. Full text: Core Rulebook p. 416.',
      "Blood Magic: tattoo-marked creature/crawler hits 0% HB → its blood is drawn to Signet; this is the fuel for Ink Marauder.\nInk Marauder: spend Blood Magic → 1+ tattoos animate as flat paper copies of the Mobs pictured; Stats = ½ the original's. Copy slain → becomes a tattoo on her again.\nWater Cursed: water never contacts her skin; Immunity to Ice damage.\nCharming Seduction Spell: on hit → Int Stat Check; Fail → Charmed (no attacks on Signet; stays still or follows basic non-hostile orders). New Check 1/day or each time damaged. Mind Control.\nWater Lily Spell: 1/day. On hit → Int Stat Check; Fail → Unconscious (prone, no actions, damage doesn't wake them) until Signet drops the Spell.\n\nFull text: Core Rulebook p. 416.",
    ],
    descriptionEs:
      'Tsarina Signet: nivel 60, tatuada de la cabeza a los pies, y cada trozo de tinta puede despegarse y comerte. Te encandilará hasta la obediencia, te dejará KO y convertirá a tus amigos muertos en combustible. Pro-Tip: su magia funciona con sangre. Así que deja de sangrar. Fácil, ¿verdad? ¿Verdad?',
    prevDescriptionsEs: [
      'Tsarina Signet: nivel 60, tatuada de la cabeza a los pies, y cada trozo de tinta puede despegarse y comerte. Te encandilará hasta la obediencia, te dejará KO y convertirá a tus amigos muertos en combustible. Consejo pro: su magia funciona con sangre. Así que deja de sangrar. Fácil, ¿verdad? ¿Verdad?',
    ],
  },
  {
    name: 'Heather the Bear',
    kind: 'boss',
    size: 'Large (5)',
    tags: 'Neighborhood Boss, Animal',
    slots: '13',
    slotValue: '5',
    level: '19',
    surprise: '14+F',
    evade: '15+F',
    move: '30+S',
    dr: '3',
    stats: {
      str: {
        score: '21',
        mod: '+5',
      },
      int: {
        score: '11',
        mod: '+4',
      },
      con: {
        score: '21',
        mod: '+5',
      },
      dex: {
        score: '22',
        mod: '+5',
      },
      cha: {
        score: '7',
        mod: '+3',
      },
    },
    attacks: [
      {
        name: 'Bear Hug',
        toHit: '15+F',
        damage: '3d8+5 Bludgeoning',
        range: '5ft range',
        effect: 'On hit: Held',
      },
      {
        name: 'Boring Parasites',
        toHit: '15+F',
        damage: '2d10+6 Piercing',
        range: '10ft range',
        effect: 'On hit: Mental Intrusion, Queasy, Staggered',
      },
      {
        name: 'Worm Claw Whip',
        toHit: '16+F',
        damage: '2d8+5 Bludgeoning',
        range: '20ft range',
        effect: 'Major Fail+: Held',
      },
    ],
    notes:
      'I Got Better: if a crawler heals her, her attacks the next round have Disadvantage.\nUnbearable: if she deals no damage in a round, she quits and begs to be put down.\nBoring Parasites: hit crawlers gain Mental Intrusion, which gives Queasy and Staggered.\nWorm Claw Whip: on Major Fail or worse the crawler is pulled 10ft and becomes Held.\n\nFull text: Core Rulebook p. 421.',
    source: 'Core Rulebook p. 421',
    chapter: 'Floor 3 · The Over City',
    floor: 3,
    description:
      "Heather is a bear stuffed full of talking worms, and honestly she'd rather be dead. Relatable. Her parasites will make you puke and stagger. Pro tip: heal her and she fights like shit next round, and if she can't hurt you for a whole round, she'll just beg you to end it. Weirdly touching. Also, gross.",
    prevDescriptions: [
      'Heather is a bear full of worms who would really rather not be doing this. Her claws are worms. The worms talk. Pro tip: kindness is a weapon here. Heal her or dodge a full round and she might just tap out. Therapy through combat!',
    ],
    prevNotes: [
      'Special: I Got Better; Unbearable. Full text: Core Rulebook p. 421.',
      'I Got Better: if a crawler heals her, her attacks the next round have Disadvantage.\nUnbearable: if she deals no damage in a round, she quits and begs to be put down.\nBoring Parasites: hit crawlers gain Mental Intrusion, which gives Queasy and Staggered.\nWorm Claw Whip: on Major Fail or worse the crawler is pulled 10ft and becomes Held.\n\nFull text: Core Rulebook p. 421.',
    ],
    descriptionEs:
      'Heather es una osa rellena de gusanos parlantes y, sinceramente, preferiría estar muerta. Te entiendo. Sus parásitos te harán vomitar y tambalearte. Pro-Tip: cúrala y la siguiente ronda pelea como el culo, y si no puede hacerte daño en toda una ronda, simplemente te suplicará que acabes con ella. Extrañamente conmovedor. Y también asqueroso.',
    prevDescriptionsEs: [
      'Heather es una osa rellena de gusanos parlantes y, sinceramente, preferiría estar muerta. Te entiendo. Sus parásitos te harán vomitar y tambalearte. Consejo pro: cúrala y la siguiente ronda pelea como el culo, y si no puede hacerte daño en toda una ronda, simplemente te suplicará que acabes con ella. Extrañamente conmovedor. Y también asqueroso.',
    ],
  },
  {
    name: 'Ringmaster Grimaldi',
    kind: 'boss',
    size: 'Colossal (7)',
    tags: 'City Boss, Plant',
    slots: '12',
    slotValue: '9',
    level: '85',
    surprise: '17+F',
    evade: '14+F',
    move: '10+S',
    dr: '3',
    stats: {
      str: {
        score: '109',
        mod: '+7',
      },
      int: {
        score: '103',
        mod: '+7',
      },
      con: {
        score: '201',
        mod: '+9',
      },
      dex: {
        score: '15',
        mod: '+4',
      },
      cha: {
        score: '22',
        mod: '+5',
      },
    },
    attacks: [
      {
        name: 'Commanding the Retinue',
        toHit: '17+F',
        damage: 'No damage',
        range: '50ft range',
        effect: 'Special effect',
      },
      {
        name: 'Mental Link',
        toHit: '17+F',
        damage: 'No damage',
        range: '100ft Burst',
        effect: 'On hit: Mental Intrusion, Paralyzed; once per round',
      },
      {
        name: 'Vinally Yours',
        toHit: '17+F',
        damage: '6d10+7 Piercing',
        range: '100ft range',
        effect: 'Major Fail+: Vined For Good, Blood Trail, Sepsis',
      },
    ],
    notes:
      "Elite Plot Armor: holds the middle of the big top; his troupe keeps performing warped versions of their old acts and ignores intruders unless attacked directly.\nRounded Up: Poison damage ×4.\nSentimental: Signet named to him for the first time → Disadvantage on every attack that round. Signet in the crawlers' party → −2 attacks for rounds 1–3.\nCommanding the Retinue: on hit → 3d6 minions (Former Circus Lemurs, Giraffes, Mold Lions, Clowns, Ogres) spawn and attack that crawler.\nMental Link: on hit → Mental Intrusion (he reads memories, talks telepathically); target rolls Int Stat Check, Fail → Paralyzed; may reroll 1/round.\nVinally Yours: Vined For Good (Major Fail or worse) = Blood Trail + Sepsis.\n\nFull text: Core Rulebook p. 422.",
    source: 'Core Rulebook p. 422',
    chapter: 'Floor 3 · The Over City',
    floor: 3,
    description:
      "Ringmaster Grimaldi: a Colossal plant, a City Boss, and the fucker behind every clown, lemur, and moldy lion you've cried about. He'll read your memories and freeze you with them. Pro tip: poison hurts him four times as much. And if you bring up Signet, he gets misty. Use it, you monsters.",
    prevDescriptions: [
      "Ringmaster Grimaldi: Colossal plant, City Boss, and the man behind every clown, lemur, and moldy lion you've cursed tonight. He's got a hive mind and a flair for the dramatic. Pro tip: bring poison, and maybe bring up an old flame. Nothing ruins a showman like feelings.",
    ],
    prevNotes: [
      'Special: Elite “Plot Armor”; Rounded Up; Sentimental. Full text: Core Rulebook p. 422.',
      "Elite Plot Armor: holds the middle of the big top; his troupe keeps performing warped versions of their old acts and ignores intruders unless attacked directly.\nRounded Up: Poison damage ×4.\nSentimental: Signet named to him for the first time → Disadvantage on every attack that round. Signet in the crawlers' party → −2 attacks for rounds 1–3.\nCommanding the Retinue: on hit → 3d6 minions (Former Circus Lemurs, Giraffes, Mold Lions, Clowns, Ogres) spawn and attack that crawler.\nMental Link: on hit → Mental Intrusion (he reads memories, talks telepathically); target rolls Int Stat Check, Fail → Paralyzed; may reroll 1/round.\nVinally Yours: Vined For Good (Major Fail or worse) = Blood Trail + Sepsis.\n\nFull text: Core Rulebook p. 422.",
    ],
    descriptionEs:
      'Ringmaster Grimaldi: una planta Colossal, un Jefe de Ciudad y el cabrón detrás de cada payaso, lémur y león mohoso por el que has llorado. Te leerá los recuerdos y te congelará con ellos. Pro-Tip: el veneno le hace cuatro veces más daño. Y si sacas el tema de Signet, se le empañan los ojos. Aprovéchalo, monstruos.',
    prevDescriptionsEs: [
      'Ringmaster Grimaldi: una planta Colossal, un Jefe de Ciudad y el cabrón detrás de cada payaso, lémur y león mohoso por el que has llorado. Te leerá los recuerdos y te congelará con ellos. Consejo pro: el veneno le hace cuatro veces más daño. Y si sacas el tema de Signet, se le empañan los ojos. Aprovéchalo, monstruos.',
    ],
  },
  {
    name: 'Mimic',
    kind: 'mob',
    size: 'Medium (4)',
    tags: 'Aberration, Mimic',
    slots: '10',
    slotValue: '5',
    level: '20',
    surprise: '14+F',
    evade: '14+F',
    move: '10+S',
    dr: '4',
    stats: {
      str: {
        score: '20',
        mod: '+5',
      },
      int: {
        score: '10',
        mod: '+4',
      },
      con: {
        score: '20',
        mod: '+5',
      },
      dex: {
        score: '10',
        mod: '+4',
      },
      cha: {
        score: '5',
        mod: '+2',
      },
    },
    attacks: [
      {
        name: 'Bite',
        toHit: '15+F',
        damage: '3d8+5 Piercing',
        range: '5ft range',
        effect: 'Major Fail+: Blood Trail',
      },
      {
        name: 'Tongue Lash',
        toHit: '15+F',
        damage: '3d8+5 Bludgeoning',
        range: '10ft range',
        effect: 'Major Fail+: Held',
      },
    ],
    notes:
      'Stealthy: if not surprised, attacks with Advantage in the first round.\nTwice Bitten: Advantage on Bite against Held crawlers. If that first Bite hits, it gets a second Bite at Disadvantage.\n\nFull text: Core Rulebook p. 432.',
    source: 'Core Rulebook p. 432',
    chapter: 'Floor 4 · The Iron Tangle',
    floor: 4,
    description:
      "Is it a chest? A door? A toilet you really needed? Surprise, it's a mouth! Its tongue drags you in, and once you're held, it bites twice. Pro tip: stop opening every box you see, loot goblin. Ha. As if you'd ever learn. The viewers are counting on it.",
    prevDescriptions: [
      "It's a chest. It's a door. It's a toilet. Surprise, it's teeth! The classic loot goblin's nightmare. Pro tip: once its tongue has you, the bites come in pairs. Maybe stop opening every box you see. Ha. As if.",
    ],
    prevNotes: [
      'Special: Stealthy; Twice Bitten. Full text: Core Rulebook p. 432.',
      'Stealthy: if not surprised, attacks with Advantage in the first round.\nTwice Bitten: Advantage on Bite against Held crawlers. If that first Bite hits, it gets a second Bite at Disadvantage.\n\nFull text: Core Rulebook p. 432.',
    ],
    descriptionEs:
      '¿Es un cofre? ¿Una puerta? ¿Un váter que te hacía muchísima falta? ¡Sorpresa, es una boca! Su lengua te arrastra hacia dentro y, cuando te tiene agarrado, muerde dos veces. Pro-Tip: deja de abrir cada caja que veas, goblin del botín. Ja. Como si fueras a aprender algún día. Los espectadores cuentan con ello.',
    prevDescriptionsEs: [
      '¿Es un cofre? ¿Una puerta? ¿Un váter que te hacía muchísima falta? ¡Sorpresa, es una boca! Su lengua te arrastra hacia dentro y, cuando te tiene agarrado, muerde dos veces. Consejo pro: deja de abrir cada caja que veas, goblin del botín. Ja. Como si fueras a aprender algún día. Los espectadores cuentan con ello.',
    ],
  },
  {
    name: 'Drek',
    kind: 'mob',
    size: 'Tiny (1)',
    tags: 'Demon',
    slots: '6',
    slotValue: '1',
    level: '6',
    surprise: '12+F',
    evade: '14+F',
    move: '30+S',
    dr: '4',
    stats: {
      str: {
        score: '7',
        mod: '+3',
      },
      int: {
        score: '3',
        mod: '+2',
      },
      con: {
        score: '1',
        mod: '+1',
      },
      dex: {
        score: '11',
        mod: '+4',
      },
      cha: {
        score: '1',
        mod: '+1',
      },
    },
    attacks: [
      {
        name: 'Bite',
        toHit: '13+F',
        damage: '2d6+3 Piercing',
        range: '5ft range, Armor-Piercing',
        effect: 'Major Fail+: Blood Trail',
      },
      {
        name: 'Claw',
        toHit: '13+F',
        damage: '2d4+3 Slashing',
        range: '5ft range',
        effect: 'On hit: Shit',
      },
    ],
    notes:
      "Suckle Blood: Action; target must have Blood Trail → target rolls Str-Opposed Escape Artist Skill Check; Fail → Drek latches on, Blood Trail damage +1d4 per round. Latched Drek makes no attacks.\nSwarming Behavior: packs of 50+. 10+ Dreks on one crawler → that crawler's Evade Checks vs any Drek at Disadvantage.\nWall Walker: walls and ceilings count as normal ground for movement.\nClaw: on hit → Sore as Shit.\n\nFull text: Core Rulebook p. 432.",
    source: 'Core Rulebook p. 432',
    chapter: 'Floor 4 · The Iron Tangle',
    floor: 4,
    description:
      "Tiny demon leeches in packs of fifty, running along the ceiling to find your leaks. Once one latches on, your Blood Trail gets worse every round. Ten on one crawler and you can't dodge shit. Pro tip: stop bleeding. Now. Before you become a meat-shaped Drek buffet.",
    prevDescriptions: [
      "Tiny demonic leeches that come in fifty-packs, like the worst party favor ever. They run along the ceiling and love an open wound. Pro tip: stop bleeding before they find you, or you'll be wearing a Drek coat by round three.",
    ],
    prevNotes: [
      'Special: Suckle Blood; Swarming Behavior; Wall Walker. Full text: Core Rulebook p. 432.',
      "Suckle Blood: Action; target must have Blood Trail → target rolls Str-Opposed Escape Artist Skill Check; Fail → Drek latches on, Blood Trail damage +1d4 per round. Latched Drek makes no attacks.\nSwarming Behavior: packs of 50+. 10+ Dreks on one crawler → that crawler's Evade Checks vs any Drek at Disadvantage.\nWall Walker: walls and ceilings count as normal ground for movement.\nClaw: on hit → Sore as Shit.\n\nFull text: Core Rulebook p. 432.",
    ],
    descriptionEs:
      'Diminutos demonios sanguijuela en manadas de cincuenta, correteando por el techo en busca de tus fugas. En cuanto uno se te engancha, tu Blood Trail empeora cada ronda. Diez encima de un crawler y no esquivas una mierda. Pro-Tip: deja de sangrar. Ya. Antes de convertirte en un bufé libre de Drek con forma de carne.',
    prevDescriptionsEs: [
      'Diminutos demonios sanguijuela en manadas de cincuenta, correteando por el techo en busca de tus fugas. En cuanto uno se te engancha, tu Blood Trail empeora cada ronda. Diez encima de un crawler y no esquivas una mierda. Consejo pro: deja de sangrar. Ya. Antes de convertirte en un bufé libre de Drek con forma de carne.',
    ],
  },
  {
    name: 'Jikininki',
    kind: 'mob',
    size: 'Medium (4)',
    tags: 'Undead',
    slots: '10',
    slotValue: '4',
    level: '17',
    surprise: '12+F',
    evade: '14+F',
    move: '25+S',
    dr: '4',
    stats: {
      str: {
        score: '25',
        mod: '+5',
      },
      int: {
        score: '3',
        mod: '+2',
      },
      con: {
        score: '12',
        mod: '+4',
      },
      dex: {
        score: '13',
        mod: '+4',
      },
      cha: {
        score: '3',
        mod: '+2',
      },
    },
    attacks: [
      {
        name: 'Broom Bash',
        toHit: '15+F',
        damage: '3d8+5 Bludgeoning',
        range: '10ft range',
        effect: '',
      },
      {
        name: 'Bite',
        toHit: '15+F',
        damage: '3d4+5 Piercing',
        range: '5ft range',
        effect: 'Major Fail+: Poisoned',
      },
      {
        name: 'Sweep',
        toHit: '15+F',
        damage: '3d4+5 Bludgeoning',
        range: '10ft range',
        effect: 'Special effect',
      },
    ],
    notes:
      'Blood Sense: Advantage on Perception Checks to find crawlers with Blood Trail.\nJanitor Mob: Floor 4 cleanup crew, focused on removing corpses. Only attacks when provoked or when a crawler has Blood Trail.\nSweep: hit crawlers are pushed 10ft.\n\nFull text: Core Rulebook p. 433.',
    source: 'Core Rulebook p. 433',
    chapter: 'Floor 4 · The Iron Tangle',
    floor: 4,
    description:
      "The Floor 4 janitorial staff: undead, broom-wielding, and paid in absolutely nothing. They just want the corpses gone and will leave you alone if you let them mop. Pro tip: don't bleed near them. If you're leaking, you're not a crawler anymore. You're a spill.",
    prevDescriptions: [
      "The Floor 4 custodial staff: undead, broom-wielding, and absolutely not paid enough. They just want the corpses gone. Pro tip: don't bleed and don't bother them. Show up leaking, though, and you're the mess.",
    ],
    prevNotes: [
      'Special: Blood Sense; Janitor Mob. Full text: Core Rulebook p. 433.',
      'Blood Sense: Advantage on Perception Checks to find crawlers with Blood Trail.\nJanitor Mob: Floor 4 cleanup crew, focused on removing corpses. Only attacks when provoked or when a crawler has Blood Trail.\nSweep: hit crawlers are pushed 10ft.\n\nFull text: Core Rulebook p. 433.',
    ],
    descriptionEs:
      'El personal de limpieza del Piso 4: no muertos, armados con escoba y pagados con absolutamente nada. Solo quieren que desaparezcan los cadáveres y te dejarán en paz si les dejas fregar. Pro-Tip: no sangres cerca de ellos. Si estás goteando, ya no eres un crawler. Eres una mancha.',
    prevDescriptionsEs: [
      'El personal de limpieza del Piso 4: no muertos, armados con escoba y pagados con absolutamente nada. Solo quieren que desaparezcan los cadáveres y te dejarán en paz si les dejas fregar. Consejo pro: no sangres cerca de ellos. Si estás goteando, ya no eres un crawler. Eres una mancha.',
    ],
  },
  {
    name: 'Flesher',
    kind: 'mob',
    size: 'Medium (4)',
    tags: 'Undead',
    slots: '10',
    slotValue: '3',
    level: '10',
    surprise: '13+F',
    evade: '14+F',
    move: '25+S',
    dr: '2',
    stats: {
      str: {
        score: '10',
        mod: '+4',
      },
      int: {
        score: '7',
        mod: '+3',
      },
      con: {
        score: '6',
        mod: '+3',
      },
      dex: {
        score: '11',
        mod: '+4',
      },
      cha: {
        score: '1',
        mod: '+1',
      },
    },
    attacks: [
      {
        name: 'Boned Spell',
        toHit: '13+F',
        damage: 'No damage',
        range: '5ft range',
        effect: 'Special effect',
      },
      {
        name: 'Smother',
        toHit: '14+F',
        damage: '2d4+4 Acid',
        range: '10ft range',
        effect: 'On hit: Burned, Held',
      },
    ],
    notes:
      'Fire Immunity: takes no Fire damage.\nBoned Spell: targets Skeletons only; a hit Skeleton animates and obeys the Flesher.\nSymbiote Formation: a Flesher that successfully animates a skeleton merges with it into a Symbiote.\nRe-Sleeving: a Flesher that attacks and eats a Symbiote upgrades into a smarter, stronger Symbiote.\nWar Mage: a Symbiote Re-Sleeved 12+ times becomes sapient and fuses into a War Mage.\nSmother: a hit applies both Burned and Held.\n\nFull text: Core Rulebook p. 434.',
    source: 'Core Rulebook p. 434',
    chapter: 'Floor 4 · The Iron Tangle',
    floor: 4,
    description:
      "Undead meat with a career plan. The Flesher crawls into a skeleton, calls it a promotion, then eats its coworkers until it's a fucking War Mage. Middle management, but gooier. Pro tip: fire does jack shit here, so smash every loose skeleton before this sack of acid-slime gets a new ride.",
    prevDescriptions: [
      "Meet the Flesher: an undead skin suit with ambitions. Give it a skeleton and it gets a roommate; let it eat enough roommates and it gets promoted to War Mage. It's a corporate ladder made of meat. Pro tip: fire does nothing, so put the torch away and smash the skeletons first.",
    ],
    prevNotes: [
      'Special: Fire Immunity; Re-Sleeving; Symbiote Formation; War Mage. Full text: Core Rulebook p. 434.',
      'Fire Immunity: takes no Fire damage.\nBoned Spell: targets Skeletons only; a hit Skeleton animates and obeys the Flesher.\nSymbiote Formation: a Flesher that successfully animates a skeleton merges with it into a Symbiote.\nRe-Sleeving: a Flesher that attacks and eats a Symbiote upgrades into a smarter, stronger Symbiote.\nWar Mage: a Symbiote Re-Sleeved 12+ times becomes sapient and fuses into a War Mage.\nSmother: a hit applies both Burned and Held.\n\nFull text: Core Rulebook p. 434.',
    ],
    descriptionEs:
      'Carne no muerta con plan de carrera. El Flesher se mete dentro de un esqueleto, lo llama ascenso y luego se come a sus compañeros hasta convertirse en un puto War Mage. Mando intermedio, pero más pringoso. Pro-Tip: aquí el fuego no hace ni una mierda, así que machaca cada esqueleto suelto antes de que este saco de baba ácida se agencie vehículo nuevo.',
    prevDescriptionsEs: [
      'Carne no muerta con plan de carrera. El Flesher se mete dentro de un esqueleto, lo llama ascenso y luego se come a sus compañeros hasta convertirse en un puto War Mage. Mando intermedio, pero más pringoso. Consejo pro: aquí el fuego no hace ni una mierda, así que machaca cada esqueleto suelto antes de que este saco de baba ácida se agencie vehículo nuevo.',
    ],
  },
  {
    name: 'Grease Gremilin',
    kind: 'npc',
    size: 'Small (2)',
    tags: 'NPC, Humanoid',
    slots: '10',
    slotValue: '4',
    level: '18',
    surprise: '14+F',
    evade: '15+F',
    move: '25+S',
    dr: '4',
    stats: {
      str: {
        score: '10',
        mod: '+4',
      },
      int: {
        score: '11',
        mod: '+4',
      },
      con: {
        score: '13',
        mod: '+4',
      },
      dex: {
        score: '22',
        mod: '+5',
      },
      cha: {
        score: '3',
        mod: '+2',
      },
    },
    attacks: [
      {
        name: 'Fast Disassemble',
        toHit: '14+F',
        damage: 'No damage',
        range: '5ft range',
        effect: 'Special effect',
      },
      {
        name: 'Multi-Weapon',
        toHit: '14+F',
        damage: '3d6+4 Bludgeoning, Piercing, or Slashing (their choice)',
        range: '5ft range',
        effect: 'Major Fail+: Minor Injury',
      },
    ],
    notes:
      'Fast Assembly: repairs mechanical devices in 1/3 the usual time.\nIrritable Worker: ignores crawlers while repairing. If a crawler interrupts the repair, it gains Advantage on its first attack against that crawler.\nFast Disassemble: on hit, one carried or worn mechanical item (usually weapon or armor) is unusable until the crawler spends 2 actions reassembling it.\nMulti-Weapon: chooses Bludgeoning, Piercing, or Slashing damage per attack.\n\nFull text: Core Rulebook p. 435.',
    source: 'Core Rulebook p. 435',
    chapter: 'Floor 4 · The Iron Tangle',
    floor: 4,
    description:
      "Small, greasy, and one bad day from snapping. This gremlin will field-strip your rifle mid-swing and leave you holding a very expensive handful of springs. Pro tip: if it's fixing something, walk the fuck away. Interrupt the job and its first swing comes with Advantage and a lifetime of spite.",
    prevDescriptions: [
      "This little grease monkey can strip your rifle to parts faster than you can say warranty void. Leave it alone and it'll happily tinker all day. Bother it mid-job and it holds a grudge with Advantage. Pro tip: let the professional work. Unions are scary.",
    ],
    prevNotes: [
      'Special: Fast Assembly; Irritable Worker. Full text: Core Rulebook p. 435.',
      'Fast Assembly: repairs mechanical devices in 1/3 the usual time.\nIrritable Worker: ignores crawlers while repairing. If a crawler interrupts the repair, it gains Advantage on its first attack against that crawler.\nFast Disassemble: on hit, one carried or worn mechanical item (usually weapon or armor) is unusable until the crawler spends 2 actions reassembling it.\nMulti-Weapon: chooses Bludgeoning, Piercing, or Slashing damage per attack.\n\nFull text: Core Rulebook p. 435.',
    ],
    descriptionEs:
      'Pequeño, grasiento y a un mal día de perder la chaveta. Este gremlin te desmonta el rifle en pleno golpe y te deja con un puñado carísimo de muelles en la mano. Pro-Tip: si está arreglando algo, lárgate de una puta vez. Interrúmpele el curro y su primer golpe viene con Ventaja y una vida entera de rencor.',
    prevDescriptionsEs: [
      'Pequeño, grasiento y a un mal día de perder la chaveta. Este gremlin te desmonta el rifle en pleno golpe y te deja con un puñado carísimo de muelles en la mano. Consejo pro: si está arreglando algo, lárgate de una puta vez. Interrúmpele el curro y su primer golpe viene con Ventaja y una vida entera de rencor.',
    ],
  },
  {
    name: 'Shade Gnoll',
    kind: 'npc',
    size: 'Medium (4)',
    tags: 'NPC, Humanoid',
    slots: '10',
    slotValue: '5',
    level: '27',
    surprise: '14+F',
    evade: '15+F',
    move: '20+S',
    dr: '4',
    stats: {
      str: {
        score: '22',
        mod: '+5',
      },
      int: {
        score: '13',
        mod: '+4',
      },
      con: {
        score: '22',
        mod: '+5',
      },
      dex: {
        score: '25',
        mod: '+5',
      },
      cha: {
        score: '4',
        mod: '+2',
      },
    },
    attacks: [
      {
        name: 'Expandable Baton',
        toHit: '15+F',
        damage: '3d6+5 Bludgeoning',
        range: '5ft range',
        effect: 'Major Fail+: Staggered',
      },
      {
        name: 'Pulse Rifle',
        toHit: '15+F',
        damage: '2d8 Fire',
        range: '80ft range',
        effect: 'On hit: Burned',
      },
      {
        name: 'Pressure Point',
        toHit: '15+F',
        damage: '2d6+5 Bludgeoning',
        range: '5ft range',
        effect: 'On hit: Paralyzed, Take Down',
      },
    ],
    notes:
      'Pack Hunters: Advantage on attacks while 2+ Shade Gnolls are adjacent to the target.\nRiot Shields: 2+ shield-carrying Shade Gnolls can each spend their Move to lock into a mobile wall. While in the wall: Advantage on Evade and Area of Effect Checks, Disadvantage on all their attacks.\nPressure Point: on hit, the gnoll chooses Paralyzed or Take Down.\n\nFull text: Core Rulebook p. 435.',
    source: 'Core Rulebook p. 435',
    chapter: 'Floor 4 · The Iron Tangle',
    floor: 4,
    description:
      "Hyenas in riot gear. Two of these assholes on you and every swing lands like they've rehearsed it, which they have. They'll jab one nerve and you'll drop like a folding chair. Pro tip: when they lock shields they hit like wet napkins, so let them turtle, then walk around the fucking wall.",
    prevDescriptions: [
      'Riot cops, but hyenas. Shade Gnolls hunt in pairs, love a good shield wall, and know exactly where to jab to drop you like a sack of potatoes. Pro tip: a gnoll wall hits like wet bread. Make them hide behind it, then go around.',
    ],
    prevNotes: [
      'Special: Pack Hunters; Riot Shields. Full text: Core Rulebook p. 435.',
      'Pack Hunters: Advantage on attacks while 2+ Shade Gnolls are adjacent to the target.\nRiot Shields: 2+ shield-carrying Shade Gnolls can each spend their Move to lock into a mobile wall. While in the wall: Advantage on Evade and Area of Effect Checks, Disadvantage on all their attacks.\nPressure Point: on hit, the gnoll chooses Paralyzed or Take Down.\n\nFull text: Core Rulebook p. 435.',
    ],
    descriptionEs:
      'Hienas con equipo antidisturbios. Dos de estos cabrones encima y cada golpe entra como si lo hubieran ensayado, porque lo han ensayado. Te pinchan un nervio y te derrumbas como una silla plegable. Pro-Tip: cuando cierran escudos pegan como servilletas mojadas, así que deja que se hagan la tortuga y luego rodea el puto muro.',
    prevDescriptionsEs: [
      'Hienas con equipo antidisturbios. Dos de estos cabrones encima y cada golpe entra como si lo hubieran ensayado, porque lo han ensayado. Te pinchan un nervio y te derrumbas como una silla plegable. Consejo pro: cuando cierran escudos pegan como servilletas mojadas, así que deja que se hagan la tortuga y luego rodea el puto muro.',
    ],
  },
  {
    name: 'Hobgoblin Interdictor',
    kind: 'npc',
    size: 'Medium (4)',
    tags: 'NPC, Humanoid',
    slots: '10',
    slotValue: '4',
    level: '20',
    surprise: '15+F',
    evade: '14+F',
    move: '20+S',
    dr: '4',
    stats: {
      str: {
        score: '12',
        mod: '+4',
      },
      int: {
        score: '23',
        mod: '+5',
      },
      con: {
        score: '12',
        mod: '+4',
      },
      dex: {
        score: '15',
        mod: '+4',
      },
      cha: {
        score: '3',
        mod: '+2',
      },
    },
    attacks: [
      {
        name: 'Spanner',
        toHit: '14+F',
        damage: '2d8+4 Bludgeoning',
        range: '5ft range',
        effect: 'On hit: Staggered',
      },
      {
        name: 'Improvised Explosive',
        toHit: '14+F',
        damage: '2d8 Fire',
        range: '20ft range',
        effect: 'Major Fail+: Burned',
      },
    ],
    notes:
      'Creative: Advantage on all Explosives and Repair Checks.\nImprovised Explosive: 10ft Blast radius.\n\nFull text: Core Rulebook p. 436.',
    source: 'Core Rulebook p. 436',
    chapter: 'Floor 4 · The Iron Tangle',
    floor: 4,
    description:
      "Every dungeon needs a guy who thinks duct tape and dynamite solve everything. The Interdictor is that guy, with Advantage. Spanner up close, homemade bombs at 20 feet, and a 10ft blast that turns your party into modern art. Pro tip: don't bunch up. My cleanup crew bills by the limb.",
    prevDescriptions: [
      "Part mechanic, part arsonist, all hobgoblin. The Interdictor carries a spanner for close conversations and homemade bombs for everyone else. Pro tip: anything it built, it can blow up. Anything it didn't build, it can also blow up.",
    ],
    prevNotes: [
      'Special: Creative. Full text: Core Rulebook p. 436.',
      'Creative: Advantage on all Explosives and Repair Checks.\nImprovised Explosive: 10ft Blast radius.\n\nFull text: Core Rulebook p. 436.',
    ],
    descriptionEs:
      'Toda mazmorra necesita al típico tío que cree que la cinta americana y la dinamita lo arreglan todo. El Interdictor es ese tío, con Ventaja. Llave inglesa de cerca, bombas caseras a 20 pies y una explosión de 10 pies que convierte a tu grupo en arte contemporáneo. Pro-Tip: no os amontonéis. Mi equipo de limpieza cobra por extremidad.',
    prevDescriptionsEs: [
      'Toda mazmorra necesita al típico tío que cree que la cinta americana y la dinamita lo arreglan todo. El Interdictor es ese tío, con Ventaja. Llave inglesa de cerca, bombas caseras a 20 pies y una explosión de 10 pies que convierte a tu grupo en arte contemporáneo. Consejo pro: no os amontonéis. Mi equipo de limpieza cobra por extremidad.',
    ],
  },
  {
    name: 'Dwarf Employee',
    kind: 'npc',
    size: 'Medium (4)',
    tags: 'NPC, Humanoid',
    slots: '10',
    slotValue: '6',
    level: '32',
    surprise: '15+F',
    evade: '14+F',
    move: '20+S',
    dr: '4',
    stats: {
      str: {
        score: '12',
        mod: '+4',
      },
      int: {
        score: '21',
        mod: '+5',
      },
      con: {
        score: '51',
        mod: '+6',
      },
      dex: {
        score: '11',
        mod: '+4',
      },
      cha: {
        score: '6',
        mod: '+3',
      },
    },
    attacks: [
      {
        name: 'Clipboard',
        toHit: '14+F',
        damage: '5d4+4 Bludgeoning',
        range: '5ft range',
        effect: 'On hit: Enraged',
      },
      {
        name: 'Conducting',
        toHit: '15+F',
        damage: 'No damage',
        range: '10ft Burst radius',
        effect: 'On hit: Compliant',
      },
      {
        name: 'Unarmed Attack',
        toHit: '14+F',
        damage: '5d4+4 Bludgeoning',
        range: '5ft range',
        effect: 'Major Fail+: Stunned',
      },
    ],
    notes:
      "Pre-Production Stupor: after finishing its line it blinks out and resets at the depot/station, dazed and suggestible until its next shift. Crawlers get Advantage on Skill Checks and attacks against it until then.\nConducting: hit crawlers gain Compliant: Cha Stat Check; on Fail, must follow the dwarf's next command.\n\nFull text: Core Rulebook p. 436.",
    source: 'Core Rulebook p. 436',
    chapter: 'Floor 4 · The Iron Tangle',
    floor: 4,
    description:
      "Thirty-two levels of pure corporate misery. This dwarf beats crawlers to paste with a clipboard, then conducts you into doing whatever it says, like a hostage with a lanyard. Pro tip: catch it after the shift, when it's dazed, suggestible, and about as dangerous as a damp sock. Kick it while it's down. It's union-approved.",
    prevDescriptions: [
      'Employee of the month, every month, because nobody else survives the shift. This dwarf swings a clipboard like a war hammer and can make you obey with one well-timed toot. Pro tip: catch it after clocking out. Post-shift dwarves are dazed, pliable, and very punchable.',
    ],
    prevNotes: [
      'Special: Pre-Production Stupor. Full text: Core Rulebook p. 436.',
      "Pre-Production Stupor: after finishing its line it blinks out and resets at the depot/station, dazed and suggestible until its next shift. Crawlers get Advantage on Skill Checks and attacks against it until then.\nConducting: hit crawlers gain Compliant: Cha Stat Check; on Fail, must follow the dwarf's next command.\n\nFull text: Core Rulebook p. 436.",
    ],
    descriptionEs:
      'Treinta y dos niveles de pura miseria corporativa. Este enano hace papilla a los crawlers a golpe de portapapeles y luego te dirige como a una orquesta para que hagas lo que diga, igual que un rehén con la acreditación colgada al cuello. Pro-Tip: píllalo al acabar el turno, cuando está aturdido, sugestionable y es tan peligroso como un calcetín húmedo. Patéalo cuando esté en el suelo. Lo aprueba el sindicato.',
    prevDescriptionsEs: [
      'Treinta y dos niveles de pura miseria corporativa. Este enano hace papilla a los crawlers a golpe de portapapeles y luego te dirige como a una orquesta para que hagas lo que diga, igual que un rehén con la acreditación colgada al cuello. Consejo pro: píllalo al acabar el turno, cuando está aturdido, sugestionable y es tan peligroso como un calcetín húmedo. Patéalo cuando esté en el suelo. Lo aprueba el sindicato.',
    ],
  },
  {
    name: 'Grapple',
    kind: 'npc',
    size: 'Large (5)',
    tags: 'NPC, Humanoid',
    slots: '10',
    slotValue: '4',
    level: '25',
    surprise: '13+F',
    evade: '14+F',
    move: '20+S',
    dr: '4',
    stats: {
      str: {
        score: '50',
        mod: '+6',
      },
      int: {
        score: '6',
        mod: '+3',
      },
      con: {
        score: '11',
        mod: '+4',
      },
      dex: {
        score: '10',
        mod: '+4',
      },
      cha: {
        score: '3',
        mod: '+2',
      },
    },
    attacks: [
      {
        name: 'Grab',
        toHit: '16+F',
        damage: '3d8+6 Bludgeoning',
        range: '5ft range',
        effect: 'Major Fail+: Held',
      },
    ],
    notes:
      'Highly Suggestible: Disadvantage against attempts to charm, deceive, or persuade it.\nSquirrelly: after 8+ hours with no orders it turns restless and erratic (running in circles, moving furniture, shadowing and copying crawlers).\n\nFull text: Core Rulebook p. 437.',
    source: 'Core Rulebook p. 437',
    chapter: 'Floor 4 · The Iron Tangle',
    floor: 4,
    description:
      "Big, strong, and dumb as a bag of doorknobs. The Grapple crushes you first and asks no questions ever. Pro tip: lie to it. Anyone with a mouth can talk this idiot into anything. Just don't leave it bored overnight, or you'll wake up to rearranged furniture and a giant asshole miming your every move.",
    prevDescriptions: [
      "A Large, strong, profoundly gullible lump that grabs first and thinks never. The Grapple does whatever the last smooth talker told it. Pro tip: be that smooth talker. And don't leave it unsupervised overnight unless you want your furniture rearranged and your every move mimed back at you.",
    ],
    prevNotes: [
      'Special: Highly Suggestible; Squirrelly. Full text: Core Rulebook p. 437.',
      'Highly Suggestible: Disadvantage against attempts to charm, deceive, or persuade it.\nSquirrelly: after 8+ hours with no orders it turns restless and erratic (running in circles, moving furniture, shadowing and copying crawlers).\n\nFull text: Core Rulebook p. 437.',
    ],
    descriptionEs:
      'Grande, fuerte y más tonto que un saco de pomos. El Grapple te aplasta primero y no hace preguntas nunca. Pro-Tip: miéntele. Cualquiera con boca puede convencer a este imbécil de lo que sea. Eso sí, no lo dejes aburrido de noche, o te despertarás con los muebles cambiados de sitio y un gilipollas gigante imitando cada uno de tus movimientos.',
    prevDescriptionsEs: [
      'Grande, fuerte y más tonto que un saco de pomos. El Grapple te aplasta primero y no hace preguntas nunca. Consejo pro: miéntele. Cualquiera con boca puede convencer a este imbécil de lo que sea. Eso sí, no lo dejes aburrido de noche, o te despertarás con los muebles cambiados de sitio y un gilipollas gigante imitando cada uno de tus movimientos.',
    ],
  },
  {
    name: 'Station Mimic',
    kind: 'boss',
    size: 'Gargantuan (8)',
    tags: 'City Boss, Aberration, Mimic',
    slots: '12',
    slotValue: '9',
    level: '80',
    surprise: '15+F',
    evade: '15+F',
    move: '20+S',
    dr: '5',
    stats: {
      str: {
        score: '155',
        mod: '+8',
      },
      int: {
        score: '23',
        mod: '+5',
      },
      con: {
        score: '201',
        mod: '+9',
      },
      dex: {
        score: '22',
        mod: '+5',
      },
      cha: {
        score: '24',
        mod: '+5',
      },
    },
    attacks: [
      {
        name: 'Neck Snap',
        toHit: '18+F',
        damage: '7d10+8 Bludgeoning',
        range: '50ft range',
        effect: '',
      },
      {
        name: 'Acid Spit',
        toHit: '15+F',
        damage: '6d8 Acid',
        range: '50ft Cone',
        effect: 'Major Fail+: Burned',
      },
      {
        name: 'Bite',
        toHit: '18+F',
        damage: '5d8+8 Piercing',
        range: '30ft range, Armor-Piercing',
        effect: 'On hit: Swallowed',
      },
      {
        name: 'Shaken and Stirred',
        toHit: '18+F',
        damage: '6d8+8 Bludgeoning',
        range: '100ft Burst',
        effect: 'Major Fail+: Take Down, Terrified; every other round',
      },
    ],
    notes:
      "Down and Out: doubles its Str mod on damage against a crawler with Take Down.\nMimic Regeneration: whenever it takes 2+ HB, a chunk breaks off, sprouts legs, and crawls back; it reattaches on the Mimic's next turn and restores half the HB lost. Dealing 1+ HB to the chunk destroys it.\nMinions: once per round, as an action, spawns 3d8 car-sized legged mouths (use Level 20 Mimic, p. 432).\nShe's a Brick House: Resistance to Bludgeoning.\nSliced and Diced: Disadvantage against Slashing attacks; takes x2 Slashing damage.\nStealthy: if not surprised, attacks with Advantage in round 1.\nBite: on hit, crawler gains Swallowed. Swallowed crawlers take 1d8+F Acid at end of each round and attack at Disadvantage vs 0 DR, with Slashing dealing x2. All are freed when an attack on the Mimic scores Amazing Success or better, or it dies.\nShaken and Stirred: usable only every other round; on Evade Major Fail or worse, Take Down and Terrified.\n\nFull text: Core Rulebook p. 438.",
    source: 'Core Rulebook p. 438',
    chapter: 'Floor 4 · The Iron Tangle',
    floor: 4,
    description:
      'Ladies and gentlebeings, the train station wants a snack! She swallows crawlers whole, digests them slowly, and when you hurt her, bits of her grow legs and waddle home. Pro tip: hammers bounce off, but blades carve her like a holiday ham. Kill the runaway chunks, and if you get swallowed, stab your way out, you screaming lunch special.',
    prevDescriptions: [
      'Ladies and gentlebeings, the train station is hungry! The Station Mimic is a Gargantuan pile of teeth that swallows crawlers whole and sheds pieces that walk themselves home. Pro tip: blades, not hammers. Bludgeons bounce, but she slices like deli meat. And kill those runaway chunks before they get back.',
    ],
    prevNotes: [
      'Special: Down and Out; Mimic Regeneration; Minions; She’s a Brick House; Sliced and Diced; Stealthy. Full text: Core Rulebook p. 438.',
      "Down and Out: doubles its Str mod on damage against a crawler with Take Down.\nMimic Regeneration: whenever it takes 2+ HB, a chunk breaks off, sprouts legs, and crawls back; it reattaches on the Mimic's next turn and restores half the HB lost. Dealing 1+ HB to the chunk destroys it.\nMinions: once per round, as an action, spawns 3d8 car-sized legged mouths (use Level 20 Mimic, p. 432).\nShe's a Brick House: Resistance to Bludgeoning.\nSliced and Diced: Disadvantage against Slashing attacks; takes x2 Slashing damage.\nStealthy: if not surprised, attacks with Advantage in round 1.\nBite: on hit, crawler gains Swallowed. Swallowed crawlers take 1d8+F Acid at end of each round and attack at Disadvantage vs 0 DR, with Slashing dealing x2. All are freed when an attack on the Mimic scores Amazing Success or better, or it dies.\nShaken and Stirred: usable only every other round; on Evade Major Fail or worse, Take Down and Terrified.\n\nFull text: Core Rulebook p. 438.",
    ],
    descriptionEs:
      '¡Damas, caballeros y demás seres, la estación de tren quiere picar algo! Se traga a los crawlers enteros, los digiere despacito y, cuando le haces daño, a trozos de ella les salen patas y se vuelven a casa andando como patitos. Pro-Tip: los martillos rebotan, pero las hojas la trinchan como un jamón de Navidad. Mata los pedazos fugitivos y, si te traga, sal a puñaladas, menú del día con gritos incluidos.',
    prevDescriptionsEs: [
      '¡Damas, caballeros y demás seres, la estación de tren quiere picar algo! Se traga a los crawlers enteros, los digiere despacito y, cuando le haces daño, a trozos de ella les salen patas y se vuelven a casa andando como patitos. Consejo pro: los martillos rebotan, pero las hojas la trinchan como un jamón de Navidad. Mata los pedazos fugitivos y, si te traga, sal a puñaladas, menú del día con gritos incluidos.',
    ],
  },
  {
    name: 'War Mage',
    kind: 'boss',
    size: 'Medium (4)',
    tags: 'Neighborhood Boss, Humanoid',
    slots: '7',
    slotValue: '3',
    level: '37',
    surprise: '17+F',
    evade: '14+F',
    move: '20+S',
    dr: '4',
    stats: {
      str: {
        score: '6',
        mod: '+3',
      },
      int: {
        score: '101',
        mod: '+7',
      },
      con: {
        score: '6',
        mod: '+3',
      },
      dex: {
        score: '12',
        mod: '+4',
      },
      cha: {
        score: '11',
        mod: '+4',
      },
    },
    attacks: [
      {
        name: 'Elemental Attack Spell',
        toHit: '17+F',
        damage: '5d6+7 damage',
        range: '',
        effect: 'Special effect',
      },
      {
        name: 'Cloud Attack Spell',
        toHit: '17+F',
        damage: '4d8+7 damage (type',
        range: '',
        effect: 'Major Fail+: Poisoned',
      },
      {
        name: 'Pull Spell',
        toHit: '17+F',
        damage: '4d8+7 Bludgeoning',
        range: '100ft range',
        effect: 'Special effect',
      },
      {
        name: 'Skin Peel',
        toHit: '17+F',
        damage: '4d8+7 Slashing',
        range: '60ft range',
        effect: 'Major Fail+: Taint',
      },
    ],
    notes:
      "Sapient Moment of Destruction: 10 minutes after death its head explodes for 5d12+7 Force, 100ft Burst radius. Storing the head in a crawler's inventory pauses the timer.\nSpell Specialization: has one specialty school (e.g. Fire, Force, Healing) and casts those Spells at Rank 15. Elemental and Cloud Attack Spell damage type matches the specialty.\nWhat a Know-It-All: can cast almost any Spell at Rank 10; spends its Move to recall a Spell, then casts it.\nYou're Not Done Yet Spell: cast on a fallen crawler or Mob to turn its flesh into a Flesher (p. 434).\nElemental Attack Spell: 100ft range, 10ft Blast radius.\nCloud Attack Spell: 100ft range, 20ft Blast radius.\nPull Spell: on hit, drags the crawler up to 30ft in a direction of the War Mage's choice.\n\nFull text: Core Rulebook p. 439.",
    source: 'Core Rulebook p. 439',
    chapter: 'Floor 4 · The Iron Tangle',
    floor: 4,
    description:
      'Twelve upgrades later, the little Flesher finally graduated! The War Mage knows almost every spell, has a favorite it casts at Rank 15, and can turn your dead buddy into fresh meat. Pro tip: killing it starts a ten-minute fuse on a head-shaped bomb. Pocket the head or sprint. Either way, the ratings go through the roof.',
    prevDescriptions: [
      'A dozen skeleton upgrades later, our little Flesher is all grown up! The War Mage knows hundreds of Spells and has a favorite flavor it casts at Rank 15. Pro tip: killing it starts a ten-minute countdown to a head-shaped bomb. Pocket the head or run. Either way, great television.',
    ],
    prevNotes: [
      'Special: Sapient Moment of Destruction; Spell Specialization; What a Know-It-All; You’re Not Done Yet Spell. Full text: Core Rulebook p. 439.',
      "Sapient Moment of Destruction: 10 minutes after death its head explodes for 5d12+7 Force, 100ft Burst radius. Storing the head in a crawler's inventory pauses the timer.\nSpell Specialization: has one specialty school (e.g. Fire, Force, Healing) and casts those Spells at Rank 15. Elemental and Cloud Attack Spell damage type matches the specialty.\nWhat a Know-It-All: can cast almost any Spell at Rank 10; spends its Move to recall a Spell, then casts it.\nYou're Not Done Yet Spell: cast on a fallen crawler or Mob to turn its flesh into a Flesher (p. 434).\nElemental Attack Spell: 100ft range, 10ft Blast radius.\nCloud Attack Spell: 100ft range, 20ft Blast radius.\nPull Spell: on hit, drags the crawler up to 30ft in a direction of the War Mage's choice.\n\nFull text: Core Rulebook p. 439.",
    ],
    descriptionEs:
      '¡Doce mejoras después, el pequeño Flesher por fin se ha graduado! El War Mage conoce casi todos los hechizos, tiene uno favorito que lanza a Rango 15 y puede convertir a tu colega muerto en carne fresca. Pro-Tip: matarlo enciende una mecha de diez minutos en una bomba con forma de cabeza. Guárdate la cabeza en el bolsillo o echa a correr. En cualquier caso, la audiencia se dispara.',
    prevDescriptionsEs: [
      '¡Doce mejoras después, el pequeño Flesher por fin se ha graduado! El War Mage conoce casi todos los hechizos, tiene uno favorito que lanza a Rango 15 y puede convertir a tu colega muerto en carne fresca. Consejo pro: matarlo enciende una mecha de diez minutos en una bomba con forma de cabeza. Guárdate la cabeza en el bolsillo o echa a correr. En cualquier caso, la audiencia se dispara.',
    ],
  },
  {
    name: 'Mantaur',
    kind: 'boss',
    size: 'Large (5)',
    tags: 'Neighborhood Boss, Mantaur',
    slots: '7',
    slotValue: '5',
    level: '40',
    surprise: '13+F',
    evade: '15+F',
    move: '30+S',
    dr: '4',
    stats: {
      str: {
        score: '53',
        mod: '+6',
      },
      int: {
        score: '13',
        mod: '+3',
      },
      con: {
        score: '51',
        mod: '+5',
      },
      dex: {
        score: '22',
        mod: '+5',
      },
      cha: {
        score: '6',
        mod: '+3',
      },
    },
    attacks: [
      {
        name: 'Claws',
        toHit: '16+F',
        damage: '5d8+6 Slashing',
        range: '10ft range',
        effect: '',
      },
      {
        name: 'Grab',
        toHit: '16+F',
        damage: '4d8+6 Bludgeoning',
        range: '10ft range',
        effect: 'On hit: Held',
      },
      {
        name: 'Headbutt',
        toHit: '16+F',
        damage: '5d8+6 Bludgeoning',
        range: '10ft range',
        effect: 'Major Fail+: Woozy',
      },
      {
        name: 'Tripple Stomp',
        toHit: '16+F',
        damage: '5d10+6 Bludgeoning',
        range: '5ft range',
        effect: 'Major Fail+: Shit',
      },
    ],
    notes:
      'Four Armed is Four Warned: costs its Move; grabs a crawler with one arm pair → Str-Opposed Escape Artist Skill Check, Fail = Held.\nGroup Berserking: Megadeth or similar music playing → Berserk: +1 attack/round, its attacks at Disadvantage, attacks vs it at Advantage.\nMagic Resistance: Spells below Rank 5 have no effect; Magic Missile has no effect below Rank 11.\n\nFull text: Core Rulebook p. 440.',
    source: 'Core Rulebook p. 440',
    chapter: 'Floor 4 · The Iron Tangle',
    floor: 4,
    description:
      "Four arms, horns, and an ego you could see from orbit. The Mantaur grabs, stomps, headbutts, and shrugs off your baby spells like dandruff. Pro tip: blast some thrash metal. It'll swing more often, but like a drunk at a wedding, and everyone gets Advantage on the fucker. I've already licensed the playlist.",
    prevDescriptions: [
      "Four arms, horns, and a Rank 5 magic filter. The Mantaur is what happens when a bull does CrossFit. Pro tip: put on some thrash metal. It'll swing more often, but like a drunk, and everyone gets to hit back with Advantage. Headbanging is a valid combat strategy now.",
    ],
    prevNotes: [
      'Special: Four Armed is Four Warned; Group Berserking; Magic Resistance. Full text: Core Rulebook p. 440.',
      'Four Armed is Four Warned: costs its Move; grabs a crawler with one arm pair → Str-Opposed Escape Artist Skill Check, Fail = Held.\nGroup Berserking: Megadeth or similar music playing → Berserk: +1 attack/round, its attacks at Disadvantage, attacks vs it at Advantage.\nMagic Resistance: Spells below Rank 5 have no effect; Magic Missile has no effect below Rank 11.\n\nFull text: Core Rulebook p. 440.',
    ],
    descriptionEs:
      'Cuatro brazos, cuernos y un ego que se ve desde la órbita. El Mantaur agarra, pisotea, da cabezazos y se sacude tus hechizos de bebé como si fueran caspa. Pro-Tip: ponle thrash metal a todo trapo. Atacará más a menudo, pero como un borracho en una boda, y todo el mundo tendrá Ventaja contra el muy cabrón. Ya he licenciado la playlist.',
    prevDescriptionsEs: [
      'Cuatro brazos, cuernos y un ego que se ve desde la órbita. El Mantaur agarra, pisotea, da cabezazos y se sacude tus hechizos de bebé como si fueran caspa. Consejo pro: ponle thrash metal a todo trapo. Atacará más a menudo, pero como un borracho en una boda, y todo el mundo tendrá Ventaja contra el muy cabrón. Ya he licenciado la playlist.',
    ],
  },
  {
    name: 'Krakaren Clone (p. 441)',
    kind: 'boss',
    size: 'Huge (6)',
    tags: 'Borough Boss, Aberration',
    slots: '10',
    slotValue: '8',
    level: '65',
    surprise: '13+F',
    evade: '16+F',
    move: '20+S',
    dr: '4',
    stats: {
      str: {
        score: '59',
        mod: '+6',
      },
      int: {
        score: '8',
        mod: '+3',
      },
      con: {
        score: '157',
        mod: '+8',
      },
      dex: {
        score: '55',
        mod: '+6',
      },
      cha: {
        score: '6',
        mod: '+3',
      },
    },
    attacks: [
      {
        name: 'Mega Munch',
        toHit: '16+F',
        damage: '6d10+6 Piercing',
        range: '10ft range',
        effect: '',
      },
      {
        name: 'Acidic Tentacles',
        toHit: '16+F',
        damage: '6d8+6 Acid',
        range: '30ft range',
        effect: 'On hit: Held',
      },
      {
        name: 'Pyramid Pitch',
        toHit: '13+F',
        damage: '3d6+3 Psychic',
        range: '60ft range',
        effect: 'Special effect',
      },
      {
        name: 'Spit Spray',
        toHit: '16+F',
        damage: '4d10+3 Poison',
        range: '50ft range',
        effect: 'Major Fail+: Taint',
      },
      {
        name: 'Unnerving Screams',
        toHit: '16+F',
        damage: '4d8+3 Sonic',
        range: '60ft Burst',
        effect: 'On hit: Queasy',
      },
    ],
    notes:
      "Bad Hair Day: any Amazing Success or better against it → every Held Debuff ends.\nFire Weakness: Fire ×2.\nLightning Immunity: Electric does nothing.\nPsychic Resistance: Psychic deals 0 damage but inflicts Stunned.\nSoft Goey Center: Piercing to the main body ×2.\nTough Enough: DR ×2 vs Ice/Force.\nPyramid Pitch: on hit → free Cha Stat Check; Fail → target's next Action is an attack on an ally.\n\nFull text: Core Rulebook p. 441.",
    source: 'Core Rulebook p. 441',
    chapter: 'Floor 4 · The Iron Tangle',
    floor: 4,
    description:
      "One Krakaren wasn't enough, so I printed a spare. Acid tentacles, poison spit, screaming, and a sales pitch so slimy it makes you punch your own friends. Pro tip: fire and spears into the squishy middle. Leave the lightning at home, it just tickles. And land a big hit, because nothing ruins a monster's day like bad hair.",
    prevDescriptions: [
      "One Krakaren wasn't enough, so I printed a spare. Tentacles, acid, a pyramid-scheme sales pitch that turns you on your friends, and a hairstyle it would die defending. Pro tip: fire and spears. Bring both. Leave the lightning at home, it just tickles.",
    ],
    prevNotes: [
      'Special: Bad Hair Day; Fire Weakness; Lightning Immunity; Psychic Resistance; Soft Goey Center; Tough Enough. Full text: Core Rulebook p. 441.',
      "Bad Hair Day: any Amazing Success or better against it → every Held Debuff ends.\nFire Weakness: Fire ×2.\nLightning Immunity: Electric does nothing.\nPsychic Resistance: Psychic deals 0 damage but inflicts Stunned.\nSoft Goey Center: Piercing to the main body ×2.\nTough Enough: DR ×2 vs Ice/Force.\nPyramid Pitch: on hit → free Cha Stat Check; Fail → target's next Action is an attack on an ally.\n\nFull text: Core Rulebook p. 441.",
    ],
    descriptionEs:
      'Con un Krakaren no bastaba, así que imprimí uno de repuesto. Tentáculos de ácido, escupitajos venenosos, chillidos y un discurso de ventas tan viscoso que acabas dándoles puñetazos a tus propios amigos. Pro-Tip: fuego y lanzas al centro blandito. Deja el rayo en casa, solo le hace cosquillas. Y mete un buen golpe, porque nada le jode más el día a un monstruo que ir despeinado.',
    prevDescriptionsEs: [
      'Con un Krakaren no bastaba, así que imprimí uno de repuesto. Tentáculos de ácido, escupitajos venenosos, chillidos y un discurso de ventas tan viscoso que acabas dándoles puñetazos a tus propios amigos. Consejo pro: fuego y lanzas al centro blandito. Deja el rayo en casa, solo le hace cosquillas. Y mete un buen golpe, porque nada le jode más el día a un monstruo que ir despeinado.',
    ],
  },
  {
    name: 'Pooka',
    kind: 'boss',
    size: 'Small (2)',
    tags: 'Neighborhood Boss, to Huge (6), Shapeshifter',
    slots: '7',
    slotValue: '6',
    level: '35',
    surprise: '15+F',
    evade: '15+F',
    move: '20+S',
    dr: '4',
    stats: {
      str: {
        score: '20',
        mod: '+5',
      },
      int: {
        score: '20',
        mod: '+5',
      },
      con: {
        score: '50',
        mod: '+6',
      },
      dex: {
        score: '20',
        mod: '+5',
      },
      cha: {
        score: '20',
        mod: '+5',
      },
    },
    attacks: [
      {
        name: 'Mind Devour',
        toHit: '15+F',
        damage: '5d8+5 Psychic',
        range: '30ft range',
        effect: '',
      },
      {
        name: 'Head Butt',
        toHit: '15+F',
        damage: '5d6+5 Bludgeoning',
        range: '10ft range',
        effect: 'Major Fail+: Woozy',
      },
      {
        name: 'Sweet Song',
        toHit: '15+F',
        damage: 'No damage',
        range: '40ft Burst radius',
        effect: 'Unconscious',
      },
      {
        name: 'Vitamin Shot',
        toHit: '15+F',
        damage: '4d6+5 Piercing',
        range: '5ft range,',
        effect: 'On hit: Poisoned',
      },
    ],
    notes:
      'Transformational: turns into a huge goat when attacked. Head Butt is goat-form only.\nYour Friendly Neighborhood Drug Dealer: when outnumbered, calls in client Mobs (use other Mobs from this section) to help.\nSweet Song: crawlers who fail to Evade gain Unconscious: prone, no actions; taking damage wakes them.\nVitamin Shot: Armor-Piercing.\n\nFull text: Core Rulebook p. 442.',
    source: 'Core Rulebook p. 442',
    chapter: 'Floor 4 · The Iron Tangle',
    floor: 4,
    description:
      "Your friendly neighborhood pharmacist! Small, cute, and dealing, the Pooka turns into a huge pissed-off goat the second you poke it. Outnumber it and its loyal customers show up twitching. Pro tip: if it starts singing, slap your buddy awake. Pain wakes sleeping crawlers, and I'm always delighted to supply it.",
    prevDescriptions: [
      "Small, friendly, and running the busiest pharmacy on the Chartreuse Line. Poke the Pooka and it becomes a huge, angry goat; outnumber it and its customers show up. Pro tip: if it starts singing, pinch your buddy. Sleeping crawlers wake up when hurt, and I'm always happy to help with that.",
    ],
    prevNotes: [
      'Special: Transformational; Your Friendly Neighborhood Drug Dealer. Full text: Core Rulebook p. 442.',
      'Transformational: turns into a huge goat when attacked. Head Butt is goat-form only.\nYour Friendly Neighborhood Drug Dealer: when outnumbered, calls in client Mobs (use other Mobs from this section) to help.\nSweet Song: crawlers who fail to Evade gain Unconscious: prone, no actions; taking damage wakes them.\nVitamin Shot: Armor-Piercing.\n\nFull text: Core Rulebook p. 442.',
    ],
    descriptionEs:
      '¡Tu simpático farmacéutico de barrio! Pequeño, mono y trapicheando, el Pooka se convierte en una cabra enorme y cabreadísima en cuanto le das un toque. Si lo superáis en número, aparecen sus fieles clientes con tembleques. Pro-Tip: si empieza a cantar, despierta a tu colega de una hostia. El dolor despierta a los crawlers dormidos, y a mí siempre me encanta suministrarlo.',
    prevDescriptionsEs: [
      '¡Tu simpático farmacéutico de barrio! Pequeño, mono y trapicheando, el Pooka se convierte en una cabra enorme y cabreadísima en cuanto le das un toque. Si lo superáis en número, aparecen sus fieles clientes con tembleques. Consejo pro: si empieza a cantar, despierta a tu colega de una hostia. El dolor despierta a los crawlers dormidos, y a mí siempre me encanta suministrarlo.',
    ],
  },
  {
    name: 'Blister Ghoul',
    kind: 'mob',
    size: 'Small (2)',
    tags: 'Humanoid',
    slots: '10',
    slotValue: '4',
    level: '20',
    surprise: '12+F',
    evade: '15+F',
    move: '15+S',
    dr: '4',
    stats: {
      str: {
        score: '15',
        mod: '+4',
      },
      int: {
        score: '5',
        mod: '+2',
      },
      con: {
        score: '15',
        mod: '+4',
      },
      dex: {
        score: '25',
        mod: '+5',
      },
      cha: {
        score: '5',
        mod: '+2',
      },
    },
    attacks: [
      {
        name: 'Bite',
        toHit: '14+F',
        damage: '3d6+4 Piercing',
        range: '5ft range',
        effect: 'Major Fail+: Blood Trail',
      },
    ],
    notes:
      'Tenacious Swarming: can blanket a crawler or vehicle. With 5+ adjacent to a crawler, that crawler has Disadvantage on Evade.\n\nFull text: Core Rulebook p. 445.',
    source: 'Core Rulebook p. 445',
    chapter: 'Floor 4 · The Iron Tangle',
    floor: 4,
    description:
      "One Blister Ghoul is a gross little biter. Five of them is a pus-soaked meat blanket and good luck dodging anything. They'll swarm crawlers, cars, whatever. Pro tip: don't let them pile on. Being eaten alive under a heap of weeping blisters is a shit way to go, but it trends beautifully.",
    prevDescriptions: [
      "Individually, a Blister Ghoul is a Small, bitey nuisance. In a pile of five, it's a Disadvantage-flavored blanket that makes you leak. Pro tip: don't let them stack up on you. Or your car. They're not picky.",
    ],
    prevNotes: [
      'Special: Tenacious Swarming. Full text: Core Rulebook p. 445.',
      'Tenacious Swarming: can blanket a crawler or vehicle. With 5+ adjacent to a crawler, that crawler has Disadvantage on Evade.\n\nFull text: Core Rulebook p. 445.',
    ],
    descriptionEs:
      'Un Blister Ghoul es un mordedor pequeñajo y asqueroso. Cinco son una manta de carne empapada en pus, y suerte esquivando lo que sea. Se lanzan en enjambre sobre crawlers, coches, lo que pillen. Pro-Tip: no dejes que se te amontonen encima. Que te coman vivo bajo una pila de ampollas supurantes es una forma de mierda de palmarla, pero es trending topic asegurado.',
    prevDescriptionsEs: [
      'Un Blister Ghoul es un mordedor pequeñajo y asqueroso. Cinco son una manta de carne empapada en pus, y suerte esquivando lo que sea. Se lanzan en enjambre sobre crawlers, coches, lo que pillen. Consejo pro: no dejes que se te amontonen encima. Que te coman vivo bajo una pila de ampollas supurantes es una forma de mierda de palmarla, pero es trending topic asegurado.',
    ],
  },
  {
    name: 'Skegga Union Repair Dwarf',
    kind: 'mob',
    size: 'Medium (4)',
    tags: 'Humanoid',
    slots: '10',
    slotValue: '4',
    level: '18',
    surprise: '13+F',
    evade: '14+F',
    move: '20+S',
    dr: '4',
    stats: {
      str: {
        score: '18',
        mod: '+4',
      },
      int: {
        score: '9',
        mod: '+3',
      },
      con: {
        score: '17',
        mod: '+4',
      },
      dex: {
        score: '10',
        mod: '+4',
      },
      cha: {
        score: '5',
        mod: '+2',
      },
    },
    attacks: [
      {
        name: 'Flame Thrower',
        toHit: '14+F',
        damage: '2d10 Fire',
        range: '20ft Cone',
        effect: 'Major Fail+: Burned',
      },
      {
        name: 'Wrench',
        toHit: '14+F',
        damage: '3d8+4 Bludgeoning',
        range: '5ft range',
        effect: 'Major Fail+: Staggered',
      },
    ],
    notes: 'Obsessively Alcoholic: gains Shit-Faced once its workday is done.\n\nFull text: Core Rulebook p. 446.',
    source: 'Core Rulebook p. 446',
    chapter: 'Floor 4 · The Iron Tangle',
    floor: 4,
    description:
      "Union dwarves: flamethrower in one hand, wrench in the other, and zero tolerance for anyone touching the tools. Pro tip: wait until quitting time, when they're completely Shit-Faced and fighting the floor instead of you. Legally I'm required to say ambushing drunk workers is a valid strategy. Morally, I don't give a shit.",
    prevDescriptions: [
      "Flamethrower in one hand, wrench in the other, union card in the pocket. These dwarves fix trains and torch anyone who touches the tools. Pro tip: wait until quitting time. They're Shit-Faced by then, and I'm legally required to say that counts as strategy.",
    ],
    prevNotes: [
      'Special: Obsessively Alcoholic. Full text: Core Rulebook p. 446.',
      'Obsessively Alcoholic: gains Shit-Faced once its workday is done.\n\nFull text: Core Rulebook p. 446.',
    ],
    descriptionEs:
      'Enanos sindicados: lanzallamas en una mano, llave inglesa en la otra y tolerancia cero con quien toque las herramientas. Pro-Tip: espera a la hora de salida, cuando están completamente Shit-Faced y pelean contra el suelo en vez de contra ti. Legalmente estoy obligado a decir que emboscar a trabajadores borrachos es una estrategia válida. Moralmente, me importa una mierda.',
    prevDescriptionsEs: [
      'Enanos sindicados: lanzallamas en una mano, llave inglesa en la otra y tolerancia cero con quien toque las herramientas. Consejo pro: espera a la hora de salida, cuando están completamente Shit-Faced y pelean contra el suelo en vez de contra ti. Legalmente estoy obligado a decir que emboscar a trabajadores borrachos es una estrategia válida. Moralmente, me importa una mierda.',
    ],
  },
  {
    name: 'Skegga Repair Dwarf Foredwarf',
    kind: 'mob',
    size: 'Medium (4)',
    tags: 'Humanoid',
    slots: '10',
    slotValue: '5',
    level: '22',
    surprise: '14+F',
    evade: '14+F',
    move: '20+S',
    dr: '4',
    stats: {
      str: {
        score: '21',
        mod: '+5',
      },
      int: {
        score: '10',
        mod: '+4',
      },
      con: {
        score: '23',
        mod: '+5',
      },
      dex: {
        score: '11',
        mod: '+4',
      },
      cha: {
        score: '6',
        mod: '+3',
      },
    },
    attacks: [
      {
        name: 'Inspiring Prod',
        toHit: '15+F',
        damage: '2d8+5 Electric',
        range: '10ft range',
        effect: 'On hit: Shocked',
      },
    ],
    notes:
      'Motivational Tool: once per day, grants dwarves in a 30ft Burst radius +1 to Str and Con Mods for 8 hours.\n\nFull text: Core Rulebook p. 447.',
    source: 'Core Rulebook p. 447',
    chapter: 'Floor 4 · The Iron Tangle',
    floor: 4,
    description:
      'Middle management with a cattle prod. The Foredwarf zaps crawlers for fun and gives one rousing speech a day that makes the whole crew stronger and tougher for eight hours. Pro tip: kill the boss before the pep talk. Unmotivated dwarves are merely terrifying. Motivated ones will wear your skull as a lunchbox.',
    prevDescriptions: [
      'Middle management with a cattle prod. The Foredwarf zaps crawlers and pumps up the crew with one rousing pep talk a day. Pro tip: drop the boss first. Unmotivated dwarves are merely terrifying.',
    ],
    prevNotes: [
      'Special: Motivational Tool. Full text: Core Rulebook p. 447.',
      'Motivational Tool: once per day, grants dwarves in a 30ft Burst radius +1 to Str and Con Mods for 8 hours.\n\nFull text: Core Rulebook p. 447.',
    ],
    descriptionEs:
      'Mando intermedio con picana de ganado. El Foredwarf electrocuta crawlers por diversión y suelta un discurso motivador al día que hace a toda la cuadrilla más fuerte y más dura durante ocho horas. Pro-Tip: mata al jefe antes de la charla. Los enanos desmotivados solo son aterradores. Los motivados usarán tu cráneo de fiambrera.',
    prevDescriptionsEs: [
      'Mando intermedio con picana de ganado. El Foredwarf electrocuta crawlers por diversión y suelta un discurso motivador al día que hace a toda la cuadrilla más fuerte y más dura durante ocho horas. Consejo pro: mata al jefe antes de la charla. Los enanos desmotivados solo son aterradores. Los motivados usarán tu cráneo de fiambrera.',
    ],
  },
  {
    name: 'Superior Forge Sprite',
    kind: 'npc',
    size: 'Petite (3)',
    tags: 'NPC, Elemental',
    slots: '10',
    slotValue: '5',
    level: '70',
    surprise: '16+F',
    evade: '16+F',
    move: '25+S',
    dr: '4',
    stats: {
      str: {
        score: '12',
        mod: '+4',
      },
      int: {
        score: '87',
        mod: '+6',
      },
      con: {
        score: '28',
        mod: '+5',
      },
      dex: {
        score: '63',
        mod: '+6',
      },
      cha: {
        score: '25',
        mod: '+5',
      },
    },
    attacks: [
      {
        name: 'Fire Blast',
        toHit: '16+F',
        damage: '5d10+6 Fire',
        range: '60ft range, 10ft',
        effect: 'Major Fail+: Burned',
      },
    ],
    notes:
      'Angry: always has the Enraged Debuff.\nFire Blast: 10ft Blast radius plus 5ft Splash.\n\nFull text: Core Rulebook p. 452.',
    source: 'Core Rulebook p. 452',
    chapter: 'Floor 4 · The Iron Tangle',
    floor: 4,
    description:
      "Level 70. Petite. Permanently Enraged. It's a tiny fire elemental with the temper of a toddler who missed nap time and the firepower of an artillery unit. Pro tip: spread the fuck out. Its fireball splashes, and nothing makes my editors happier than a group of crawlers going up like a birthday cake.",
    prevDescriptions: [
      "Level 70, Petite, and furious about it. The Superior Forge Sprite is a tiny fire elemental with permanent road rage and a fireball that splashes. Pro tip: spread out. It's too angry to aim at just one of you, so don't give it a group photo.",
    ],
    prevNotes: [
      'Special: Angry. Full text: Core Rulebook p. 452.',
      'Angry: always has the Enraged Debuff.\nFire Blast: 10ft Blast radius plus 5ft Splash.\n\nFull text: Core Rulebook p. 452.',
    ],
    descriptionEs:
      'Nivel 70. Menudita. Permanentemente Enraged. Es un diminuto elemental de fuego con el genio de un crío que se ha saltado la siesta y la potencia de fuego de una batería de artillería. Pro-Tip: separaos, joder. Su bola de fuego salpica, y nada hace más felices a mis editores que un grupo de crawlers ardiendo como una tarta de cumpleaños.',
    prevDescriptionsEs: [
      'Nivel 70. Menudita. Permanentemente Enraged. Es un diminuto elemental de fuego con el genio de un crío que se ha saltado la siesta y la potencia de fuego de una batería de artillería. Consejo pro: separaos, joder. Su bola de fuego salpica, y nada hace más felices a mis editores que un grupo de crawlers ardiendo como una tarta de cumpleaños.',
    ],
  },
  {
    name: 'Hector',
    kind: 'npc',
    size: 'Medium (4)',
    tags: 'NPC, Humanoid',
    slots: '10',
    slotValue: '5',
    level: '28',
    surprise: '14+F',
    evade: '14+F',
    move: '20+S',
    dr: '4',
    stats: {
      str: {
        score: '25',
        mod: '+5',
      },
      int: {
        score: '15',
        mod: '+4',
      },
      con: {
        score: '25',
        mod: '+5',
      },
      dex: {
        score: '14',
        mod: '+4',
      },
      cha: {
        score: '10',
        mod: '+4',
      },
    },
    attacks: [
      {
        name: 'Booze Bomb',
        toHit: '15+F',
        damage: '2d8 Fire',
        range: '30ft range, 5ft Blast',
        effect: 'On hit: Shit-Faced',
      },
    ],
    notes: 'Full text: Core Rulebook p. 453.',
    source: 'Core Rulebook p. 453',
    chapter: 'Floor 4 · The Iron Tangle',
    floor: 4,
    description:
      "Hector brings a flaming bottle of hooch to every fight, and his aim is way better than his liver. Get hit and you're Burned and Shit-Faced, the two-for-one special of the evening. Pro tip: stay out of throwing range. Or lean in and at least die with a buzz on.",
    prevDescriptions: [
      "Hector's weapon of choice is a flaming bottle of hooch, and his aim is better than his sobriety. Get hit and you're burned and Shit-Faced, a two-for-one deal I heartily endorse. Pro tip: stay out of throwing range, or at least bring a chaser.",
    ],
    prevNotes: ['Full text: Core Rulebook p. 453.'],
    descriptionEs:
      'Hector trae una botella de matarratas en llamas a cada pelea, y su puntería está mucho mejor que su hígado. Si te da, quedas Burned y Shit-Faced, la oferta dos por uno de la noche. Pro-Tip: quédate fuera de su alcance de lanzamiento. O arrímate y al menos muere con el puntillo.',
    prevDescriptionsEs: [
      'Hector trae una botella de matarratas en llamas a cada pelea, y su puntería está mucho mejor que su hígado. Si te da, quedas Burned y Shit-Faced, la oferta dos por uno de la noche. Consejo pro: quédate fuera de su alcance de lanzamiento. O arrímate y al menos muere con el puntillo.',
    ],
  },
  {
    name: 'Switchmaster Scotty',
    kind: 'boss',
    size: 'Medium (4)',
    tags: 'Neighborhood Boss, Humanoid',
    slots: '7',
    slotValue: '6',
    level: '45',
    surprise: '16+F',
    evade: '15+F',
    move: '20+S',
    dr: '4',
    stats: {
      str: {
        score: '21',
        mod: '+5',
      },
      int: {
        score: '50',
        mod: '+6',
      },
      con: {
        score: '50',
        mod: '+6',
      },
      dex: {
        score: '24',
        mod: '+5',
      },
      cha: {
        score: '15',
        mod: '+4',
      },
    },
    attacks: [
      {
        name: 'An Actual Fucking Train',
        toHit: '16+F',
        damage: '4d10, Bludgeoning',
        range: '60ft Line',
        effect: 'On hit: Take Down, Woozy',
      },
      {
        name: 'Switch Handle',
        toHit: '15+F',
        damage: '5d10+5 Bludgeoning',
        range: '5ft range',
        effect: 'Major Fail+: Staggered',
      },
      {
        name: 'Train Car Club',
        toHit: '16+F',
        damage: '3d12 Bludgeoning',
        range: '20ft range',
        effect: 'On hit: Train, Shit',
      },
    ],
    notes:
      'Blindsided: the crane cab has poor visibility; crawlers attacking from the sides or rear get Advantage.\nNo Power For You: Unopposed Engineering Skill Check; on Success, crane and control room lose power, disabling An Actual Fucking Train and Train Car Club for 1d4 rounds.\nReroute: Int Stat Check; on Success, An Actual Fucking Train is disabled for 1d4 rounds.\nAn Actual Fucking Train: uses the switches; hit crawlers gain Take Down and Woozy.\nTrain Car Club: uses the crane; hit crawlers gain Hit By a Train: pushed 15ft plus Stunned, Staggered, and Sore as Shit.\n\nFull text: Core Rulebook p. 453.',
    source: 'Core Rulebook p. 453',
    chapter: 'Floor 4 · The Iron Tangle',
    floor: 4,
    description:
      "Scotty runs the rail yard from a crane, swinging train cars like a pissed-off toddler with blocks. He will also hit you with an actual fucking train. Pro tip: his cab has massive blind spots and his power setup isn't idiot-proof. Engineers, this is your moment. Everyone else, try not to become a smear on the tracks.",
    prevDescriptions: [
      "Scotty runs the rail yard from a crane cab and settles arguments by swinging train cars. He'll also just drive an actual train at you. Pro tip: he can't see behind himself, and his battery isn't idiot-proof. Engineers, this is your moment.",
    ],
    prevNotes: [
      'Special: Blindsided; No Power For You; Reroute. Full text: Core Rulebook p. 453.',
      'Blindsided: the crane cab has poor visibility; crawlers attacking from the sides or rear get Advantage.\nNo Power For You: Unopposed Engineering Skill Check; on Success, crane and control room lose power, disabling An Actual Fucking Train and Train Car Club for 1d4 rounds.\nReroute: Int Stat Check; on Success, An Actual Fucking Train is disabled for 1d4 rounds.\nAn Actual Fucking Train: uses the switches; hit crawlers gain Take Down and Woozy.\nTrain Car Club: uses the crane; hit crawlers gain Hit By a Train: pushed 15ft plus Stunned, Staggered, and Sore as Shit.\n\nFull text: Core Rulebook p. 453.',
    ],
    descriptionEs:
      'Scotty dirige la playa de vías desde una grúa, zarandeando vagones como un crío cabreado con sus bloques de construcción. También te atropellará con un puto tren de verdad. Pro-Tip: su cabina tiene unos ángulos muertos enormes y su montaje eléctrico no está a prueba de idiotas. Ingenieros, este es vuestro momento. Los demás, intentad no acabar como una mancha en las vías.',
    prevDescriptionsEs: [
      'Scotty dirige la playa de vías desde una grúa, zarandeando vagones como un crío cabreado con sus bloques de construcción. También te atropellará con un puto tren de verdad. Consejo pro: su cabina tiene unos ángulos muertos enormes y su montaje eléctrico no está a prueba de idiotas. Ingenieros, este es vuestro momento. Los demás, intentad no acabar como una mancha en las vías.',
    ],
  },
  {
    name: 'Concierge Wereshark',
    kind: 'mob',
    size: 'Medium (4)',
    tags: 'Cursed',
    slots: '10',
    slotValue: '4',
    level: '18',
    surprise: '14+F',
    evade: '13+F',
    move: '20+S',
    dr: '4',
    stats: {
      str: {
        score: '20',
        mod: '+5',
      },
      int: {
        score: '10',
        mod: '+4',
      },
      con: {
        score: '13',
        mod: '+4',
      },
      dex: {
        score: '6',
        mod: '+3',
      },
      cha: {
        score: '10',
        mod: '+4',
      },
    },
    attacks: [
      {
        name: 'Chomp',
        toHit: '15+F',
        damage: '3d8+5 Piercing',
        range: '5ft range',
        effect: 'Major Fail+: Blood Trail',
      },
      {
        name: 'Crowd Control Spray',
        toHit: '13+F',
        damage: '2d6+F Acid',
        range: '30ft Cone',
        effect: 'Major Fail+: Blinded',
      },
      {
        name: 'Punch',
        toHit: '15+F',
        damage: '3d6+5 Bludgeoning',
        range: '5 ft range',
        effect: 'Major Fail+: Woozy',
      },
    ],
    notes:
      'Blood Berserk: goes berserk if a creature with Blood Trail is within 100ft, attacking the nearest target, friend or foe, at -2 to hit and +1 damage die.\nFish Out of Water: takes 1 HB damage per round in shark form while not submerged.\nWerecreature: switches between Human and shark forms. 1+ liters of liquid triggers shark form; drying off returns it to Human. Chomp is shark-only; Punch is Human-only.\n\nFull text: Core Rulebook p. 457.',
    source: 'Core Rulebook p. 457',
    chapter: 'Floor 4 · The Iron Tangle',
    floor: 4,
    description:
      "Welcome to the hotel! Your concierge takes your bags, your tips, and, if anything gets wet, your leg. Pro tip: splash him and he turns into a shark that suffocates on dry carpet, which is hilarious. Just don't bleed near him, or he goes berserk and eats the staff. I'd pay extra for that room.",
    prevDescriptions: [
      'Welcome to the hotel! Your concierge will take your bags, your dignity, and, if you splash him, your arm. Pro tip: a bucket of water turns him into a shark that suffocates on dry land. Bleeding near him is a bad idea, unless you want him biting his coworkers.',
    ],
    prevNotes: [
      'Special: Blood Berserk; Fish Out of Water; Werecreature. Full text: Core Rulebook p. 457.',
      'Blood Berserk: goes berserk if a creature with Blood Trail is within 100ft, attacking the nearest target, friend or foe, at -2 to hit and +1 damage die.\nFish Out of Water: takes 1 HB damage per round in shark form while not submerged.\nWerecreature: switches between Human and shark forms. 1+ liters of liquid triggers shark form; drying off returns it to Human. Chomp is shark-only; Punch is Human-only.\n\nFull text: Core Rulebook p. 457.',
    ],
    descriptionEs:
      '¡Bienvenidos al hotel! Tu conserje se queda con tus maletas, tus propinas y, si algo se moja, tu pierna. Pro-Tip: salpícalo y se convierte en un tiburón que se asfixia sobre la moqueta seca, lo cual es para partirse. Eso sí, no sangres cerca de él, o se pone berserker y se come al personal. Yo pagaría un suplemento por esa habitación.',
    prevDescriptionsEs: [
      '¡Bienvenidos al hotel! Tu conserje se queda con tus maletas, tus propinas y, si algo se moja, tu pierna. Consejo pro: salpícalo y se convierte en un tiburón que se asfixia sobre la moqueta seca, lo cual es para partirse. Eso sí, no sangres cerca de él, o se pone berserker y se come al personal. Yo pagaría un suplemento por esa habitación.',
    ],
  },
  {
    name: 'Charmed Drek',
    kind: 'mob',
    size: 'Small (2)',
    tags: 'Humanoid',
    slots: '6',
    slotValue: '2',
    level: '6',
    surprise: '11+F',
    evade: '12+F',
    move: '25+S',
    dr: '5',
    stats: {
      str: {
        score: '10',
        mod: '+4',
      },
      int: {
        score: '2',
        mod: '+1',
      },
      con: {
        score: '3',
        mod: '+2',
      },
      dex: {
        score: '4',
        mod: '+2',
      },
      cha: {
        score: '4',
        mod: '+2',
      },
    },
    attacks: [
      {
        name: 'Bite',
        toHit: '14+F',
        damage: '2d8+4 Piercing',
        range: '5ft range, Armor-Piercing',
        effect: '',
      },
      {
        name: 'Claw',
        toHit: '14+F',
        damage: '2d6+4 Slashing',
        range: '5ft range',
        effect: 'Major Fail+: Blood Trail',
      },
    ],
    notes:
      'Swarming Behavior: roam in packs of 50+. When 10+ attack one crawler, it has Disadvantage on Evade vs Charmed Dreks.\nWall Walker: moves on walls and ceilings as if on the ground.\nWarped by Magic: a gender reveal on the Conga Line can mutate one into a humanoid hybrid. The hybrid goes berserk (attacks nearest target, friend or foe), becomes Medium unless noted, and gains 4 HB slots, +1 to hit, +1 damage die, plus a trait by Race. Cretin/Igneous: Resistance to Piercing and Slashing. Crocodilian: steals one random Buff from a target that fails to Evade its Bite. Gnome: becomes Petite (cosmetic changes only). Human: at combat start, Humans within 30ft make an Int Stat Check; on Fail they share emotions and vague surface thoughts and take 1d6+F Psychic per round until the Drek dies or gets 1+ mile away. Mantaur: becomes Large (5) with extra arms that Grapple (15+F, 2d6+5 Bludgeoning, 10ft); on Evade Major Fail or worse, pulls the target adjacent and Bites. Razor Fox: Move 30+S, Evade 14+F.\n\nFull text: Core Rulebook p. 458.',
    source: 'Core Rulebook p. 458',
    chapter: 'Floor 4 · The Iron Tangle',
    floor: 4,
    description:
      "Fifty at a time, running on the ceiling, screaming. If ten pile onto one crawler, you're not dodging shit. Pro tip: keep these little bastards away from gender reveals on the Conga Line. Whatever pops out is bigger, angrier, and happy to chew on its own side. Hope you like confetti with your viscera.",
    prevDescriptions: [
      "Fifty of them, minimum. Charmed Dreks skitter across the ceiling in packs, and if ten get you at once, good luck dodging. Pro tip: keep them away from gender reveal parties. Whatever comes out of that is worse, and it doesn't care whose side it's on.",
    ],
    prevNotes: [
      'Special: Swarming Behavior; Wall Walker; Warped by Magic. Full text: Core Rulebook p. 458.',
      'Swarming Behavior: roam in packs of 50+. When 10+ attack one crawler, it has Disadvantage on Evade vs Charmed Dreks.\nWall Walker: moves on walls and ceilings as if on the ground.\nWarped by Magic: a gender reveal on the Conga Line can mutate one into a humanoid hybrid. The hybrid goes berserk (attacks nearest target, friend or foe), becomes Medium unless noted, and gains 4 HB slots, +1 to hit, +1 damage die, plus a trait by Race. Cretin/Igneous: Resistance to Piercing and Slashing. Crocodilian: steals one random Buff from a target that fails to Evade its Bite. Gnome: becomes Petite (cosmetic changes only). Human: at combat start, Humans within 30ft make an Int Stat Check; on Fail they share emotions and vague surface thoughts and take 1d6+F Psychic per round until the Drek dies or gets 1+ mile away. Mantaur: becomes Large (5) with extra arms that Grapple (15+F, 2d6+5 Bludgeoning, 10ft); on Evade Major Fail or worse, pulls the target adjacent and Bites. Razor Fox: Move 30+S, Evade 14+F.\n\nFull text: Core Rulebook p. 458.',
    ],
    descriptionEs:
      'De cincuenta en cincuenta, corriendo por el techo, chillando. Si diez se le echan encima a un crawler, no esquivas una mierda. Pro-Tip: mantén a estos cabroncetes lejos de las fiestas de revelación de género del Conga Line. Lo que salga será más grande, más cabreado y estará encantado de mordisquear a los suyos. Espero que te guste el confeti con vísceras.',
    prevDescriptionsEs: [
      'De cincuenta en cincuenta, corriendo por el techo, chillando. Si diez se le echan encima a un crawler, no esquivas una mierda. Consejo pro: mantén a estos cabroncetes lejos de las fiestas de revelación de género del Conga Line. Lo que salga será más grande, más cabreado y estará encantado de mordisquear a los suyos. Espero que te guste el confeti con vísceras.',
    ],
  },
  {
    name: 'Psycho Sticker',
    kind: 'mob',
    size: 'Large (5)',
    tags: 'Monstrous',
    slots: '10',
    slotValue: '5',
    level: '22',
    surprise: '13+F',
    evade: '13+F',
    move: '15+S',
    dr: '4',
    stats: {
      str: {
        score: '30',
        mod: '+5',
      },
      int: {
        score: '6',
        mod: '+3',
      },
      con: {
        score: '24',
        mod: '+5',
      },
      dex: {
        score: '6',
        mod: '+3',
      },
      cha: {
        score: '5',
        mod: '+2',
      },
    },
    attacks: [
      {
        name: 'Quill Shot',
        toHit: '13+F',
        damage: '2d6+5 Piercing',
        range: '30ft range',
        effect: 'Major Fail+: Poisoned',
      },
      {
        name: 'Spine',
        toHit: '15+F',
        damage: '3d6+5 Piercing',
        range: '5ft range, Armor-Piercing',
        effect: 'Major Fail+: Blood Trail',
      },
    ],
    notes:
      'Shielded Back: DR 8 against attacks from behind or the side.\nSpiky Back: a crawler pushed into a space adjacent to its side or back makes a Dex Stat Check: 2d6+5 Piercing on Fail, half on Success.\n\nFull text: Core Rulebook p. 458.',
    source: 'Core Rulebook p. 458',
    chapter: 'Floor 4 · The Iron Tangle',
    floor: 4,
    description:
      'A Large porcupine with anger issues and ranged quills. Its back is armored and spiky, so flanking it is how you learn what a pincushion feels like. Pro tip: hit it in the face like a civilized person. And if your tank loves shoving people, tell him to fuck off before he pushes you into the spikes.',
    prevDescriptions: [
      'A Large porcupine-shaped grudge with ranged quills. Its back is armored and spiky, so flanking it is how you learn about pain. Pro tip: hit it in the face. And if your buddy likes shoving people, maybe stand somewhere else.',
    ],
    prevNotes: [
      'Special: Shielded Back; Spiky Back. Full text: Core Rulebook p. 458.',
      'Shielded Back: DR 8 against attacks from behind or the side.\nSpiky Back: a crawler pushed into a space adjacent to its side or back makes a Dex Stat Check: 2d6+5 Piercing on Fail, half on Success.\n\nFull text: Core Rulebook p. 458.',
    ],
    descriptionEs:
      'Un puercoespín Grande con problemas de ira y púas a distancia. Tiene el lomo acorazado y lleno de pinchos, así que flanquearlo es la forma de descubrir qué se siente siendo un acerico. Pro-Tip: pégale en la cara como una persona civilizada. Y si a tu tanque le encanta empujar a la gente, dile que se vaya a la mierda antes de que te estampe contra los pinchos.',
    prevDescriptionsEs: [
      'Un puercoespín Grande con problemas de ira y púas a distancia. Tiene el lomo acorazado y lleno de pinchos, así que flanquearlo es la forma de descubrir qué se siente siendo un acerico. Consejo pro: pégale en la cara como una persona civilizada. Y si a tu tanque le encanta empujar a la gente, dile que se vaya a la mierda antes de que te estampe contra los pinchos.',
    ],
  },
  {
    name: 'Pebbles',
    kind: 'npc',
    size: 'Medium (4)',
    tags: 'NPC, Humanoid',
    slots: '10',
    slotValue: '6',
    level: '45',
    surprise: '14+F',
    evade: '15+F',
    move: '20+S',
    dr: '5',
    stats: {
      str: {
        score: '35',
        mod: '+5',
      },
      int: {
        score: '15',
        mod: '+4',
      },
      con: {
        score: '50',
        mod: '+6',
      },
      dex: {
        score: '20',
        mod: '+5',
      },
      cha: {
        score: '40',
        mod: '+5',
      },
    },
    attacks: [
      {
        name: 'Punch',
        toHit: '15+F',
        damage: '4d6+5 Bludgeoning',
        range: '5ft range',
        effect: '',
      },
      {
        name: 'Fire Blast',
        toHit: '14+F',
        damage: '3d8+6 Fire',
        range: '30ft range',
        effect: 'Major Fail+: Burned',
      },
      {
        name: 'Grease Bomb',
        toHit: '15+F',
        damage: '2d12 Acid',
        range: '30ft range, 10ft',
        effect: 'Staggered',
      },
    ],
    notes:
      'Hot Body: every combat round → free auto-hit 1d6+F Fire, 5ft Burst.\nGrease Bomb: 10ft Blast radius.\n\nFull text: Core Rulebook p. 463.',
    source: 'Core Rulebook p. 463',
    chapter: 'Floor 4 · The Iron Tangle',
    floor: 4,
    description:
      "Pebbles is hot. Not like that, you perverts. Stand next to her and you cook every round, no roll, no mercy, just sizzle. Pro tip: fight her from range. She's got fireballs and grease bombs too, but at least those can miss. Hugging her is how you end up extra crispy.",
    prevDescriptions: [
      'Pebbles runs hot. Literally. Stand next to her and you take damage every round just for being in the neighborhood, no roll required. Pro tip: fight her at range. She has fireballs too, but at least those can miss.',
    ],
    prevNotes: [
      'Special: Hot Body. Full text: Core Rulebook p. 463.',
      'Hot Body: every combat round → free auto-hit 1d6+F Fire, 5ft Burst.\nGrease Bomb: 10ft Blast radius.\n\nFull text: Core Rulebook p. 463.',
    ],
    descriptionEs:
      'Pebbles está que arde. No en ese sentido, pervertidos. Ponte a su lado y te cueces cada ronda, sin tirada, sin piedad, solo chisporroteo. Pro-Tip: lucha contra ella a distancia. También tiene bolas de fuego y bombas de grasa, pero al menos esas pueden fallar. Abrazarla es la forma de acabar extra crujiente.',
    prevDescriptionsEs: [
      'Pebbles está que arde. No en ese sentido, pervertidos. Ponte a su lado y te cueces cada ronda, sin tirada, sin piedad, solo chisporroteo. Consejo pro: lucha contra ella a distancia. También tiene bolas de fuego y bombas de grasa, pero al menos esas pueden fallar. Abrazarla es la forma de acabar extra crujiente.',
    ],
  },
  {
    name: 'Toothless Nana',
    kind: 'npc',
    size: 'Medium (4)',
    tags: 'NPC, Humanoid',
    slots: '10',
    slotValue: '6',
    level: '45',
    surprise: '14+F',
    evade: '15+F',
    move: '20+S',
    dr: '5',
    stats: {
      str: {
        score: '35',
        mod: '+5',
      },
      int: {
        score: '15',
        mod: '+4',
      },
      con: {
        score: '50',
        mod: '+6',
      },
      dex: {
        score: '20',
        mod: '+5',
      },
      cha: {
        score: '40',
        mod: '+5',
      },
    },
    attacks: [
      {
        name: 'Punch',
        toHit: '15+F',
        damage: '4d6+5 Bludgeoning',
        range: '5ft range',
        effect: '',
      },
      {
        name: 'Ice Blast',
        toHit: '14+F',
        damage: '3d8+4 Ice',
        range: '30ft range',
        effect: 'Major Fail+: Stiff Legs',
      },
      {
        name: 'Grease Bomb',
        toHit: '15+F',
        damage: '2d12 Acid',
        range: '30ft range, 10ft',
        effect: 'Taint',
      },
    ],
    notes:
      "Commanding Voice: affects Worried Mobs within 15ft that hear her. Nana with crawlers → those Mobs immune to Penthos's Demoralize; Nana with Penthos → Disadvantage on their Opposed Check.\nGrease Bomb: 10ft Blast radius.\n\nFull text: Core Rulebook p. 464.",
    source: 'Core Rulebook p. 464',
    chapter: 'Floor 4 · The Iron Tangle',
    floor: 4,
    description:
      "No teeth, all bite. Toothless Nana punches like a heavyweight, flings ice and grease, and when she yells, every scared local in earshot shuts up and listens. Pro tip: get Grandma on your side before Penthos does. She takes sides like a war crime, and she's got no dentures to lose.",
    prevDescriptions: [
      'No teeth, all bark. Toothless Nana punches like a prizefighter, throws ice and grease, and when she talks, the frightened locals listen. Pro tip: get her on your team before Penthos does. Grandma picks sides, and she picks hard.',
    ],
    prevNotes: [
      'Special: Commanding Voice. Full text: Core Rulebook p. 464.',
      "Commanding Voice: affects Worried Mobs within 15ft that hear her. Nana with crawlers → those Mobs immune to Penthos's Demoralize; Nana with Penthos → Disadvantage on their Opposed Check.\nGrease Bomb: 10ft Blast radius.\n\nFull text: Core Rulebook p. 464.",
    ],
    descriptionEs:
      'Sin dientes, pero con toda la mala leche. Toothless Nana pega como un peso pesado, lanza hielo y grasa, y cuando grita, todos los lugareños asustados que la oyen se callan y escuchan. Pro-Tip: pon a la abuela de tu parte antes que Penthos. Toma partido como quien comete un crimen de guerra, y no tiene dentadura postiza que perder.',
    prevDescriptionsEs: [
      'Sin dientes, pero con toda la mala leche. Toothless Nana pega como un peso pesado, lanza hielo y grasa, y cuando grita, todos los lugareños asustados que la oyen se callan y escuchan. Consejo pro: pon a la abuela de tu parte antes que Penthos. Toma partido como quien comete un crimen de guerra, y no tiene dentadura postiza que perder.',
    ],
  },
  {
    name: 'Rivet',
    kind: 'npc',
    size: 'Medium (4)',
    tags: 'NPC, Humanoid',
    slots: '10',
    slotValue: '6',
    level: '45',
    surprise: '14+F',
    evade: '15+F',
    move: '20+S',
    dr: '5',
    stats: {
      str: {
        score: '35',
        mod: '+5',
      },
      int: {
        score: '15',
        mod: '+4',
      },
      con: {
        score: '50',
        mod: '+6',
      },
      dex: {
        score: '20',
        mod: '+5',
      },
      cha: {
        score: '40',
        mod: '+5',
      },
    },
    attacks: [
      {
        name: 'Punch',
        toHit: '15+F',
        damage: '4d6+5 Bludgeoning',
        range: '5ft range',
        effect: '',
      },
      {
        name: 'Electric Blast',
        toHit: '14+F',
        damage: '3d8+4 Electric',
        range: '30ft range',
        effect: 'Taint',
      },
      {
        name: 'Grease Bomb',
        toHit: '15+F',
        damage: '2d12 Acid',
        range: '30ft range, 10ft',
        effect: 'Stunned',
      },
    ],
    notes:
      "Repair: as an action, disables, triggers, or resets one sabotaged piece of equipment within 30ft (a reset lets Penthos's Sabotage fire from it again).\nGrease Bomb: 10ft Blast radius.\n\nFull text: Core Rulebook p. 464.",
    source: 'Core Rulebook p. 464',
    chapter: 'Floor 4 · The Iron Tangle',
    floor: 4,
    description:
      "Rivet is part man, part toolbox, all trouble. He can disarm a booby trap, or reset it so it can blow your balls off twice. Pro tip: if he's on Penthos's payroll, kill him before he hits reset. If he's on yours, buy that man a beer and never piss him off.",
    prevDescriptions: [
      "Rivet has cybernetic implants and a very hands-on relationship with rigged machinery. He can defuse a trap or set it off, depending on his mood and your life choices. Pro tip: if he's working for Penthos, take him out before he hits reset.",
    ],
    prevNotes: [
      'Special: Repair. Full text: Core Rulebook p. 464.',
      "Repair: as an action, disables, triggers, or resets one sabotaged piece of equipment within 30ft (a reset lets Penthos's Sabotage fire from it again).\nGrease Bomb: 10ft Blast radius.\n\nFull text: Core Rulebook p. 464.",
    ],
    descriptionEs:
      'Rivet es mitad hombre, mitad caja de herramientas y todo problemas. Puede desactivar una trampa, o rearmarla para que te vuele los huevos dos veces. Pro-Tip: si está en la nómina de Penthos, mátalo antes de que le dé al reset. Si está en la tuya, invita a ese hombre a una cerveza y no lo cabrees nunca.',
    prevDescriptionsEs: [
      'Rivet es mitad hombre, mitad caja de herramientas y todo problemas. Puede desactivar una trampa, o rearmarla para que te vuele los huevos dos veces. Consejo pro: si está en la nómina de Penthos, mátalo antes de que le dé al reset. Si está en la tuya, invita a ese hombre a una cerveza y no lo cabrees nunca.',
    ],
  },
  {
    name: 'Penthos',
    kind: 'boss',
    size: 'Medium (4)',
    tags: 'Borough Boss, Humanoid',
    slots: '10',
    slotValue: '6',
    level: '62',
    surprise: '17+F',
    evade: '16+F',
    move: '20+S',
    dr: '4',
    stats: {
      str: {
        score: '22',
        mod: '+5',
      },
      int: {
        score: '100',
        mod: '+7',
      },
      con: {
        score: '50',
        mod: '+6',
      },
      dex: {
        score: '36',
        mod: '+6',
      },
      cha: {
        score: '65',
        mod: '+6',
      },
    },
    attacks: [
      {
        name: 'Dagger',
        toHit: '15+F',
        damage: '7d4+5 Piercing',
        range: '5ft range, Armor-Piercing',
        effect: 'Major Fail+: Blood Trail',
      },
      {
        name: 'Heighten Emotion Spell',
        toHit: '17+F',
        damage: 'No damage, sight range',
        range: '',
        effect: 'Special effect',
      },
      {
        name: 'Sabotage',
        toHit: '17+F',
        damage: '6d8 Acid/Electric/Fire/Ice (depends on equipment sabotaged)',
        range: '15ft Cone',
        effect: 'Major Fail+: Enraged',
      },
    ],
    notes:
      'Battle High: +1 damage after each successful attack, stacking until an attack misses, then resets.\nDemoralize: Worried Mobs or NPCs make a Cha Stat Check each round; on Fail, they gain Terrified.\nMind Control: Terrified Mobs and NPCs become his minions with 1 Action per round, acting as his allies. He can spend an Action to make all minions take an extra action of his choice during crawler turns.\nPower of a Name: knows the exact location of any entity whose true name he knows; that entity has Disadvantage against his Heighten Emotion Spell.\nHeighten Emotion Spell: sight range, 15ft Blast radius. Hit crawlers gain one GM-chosen Debuff for 1 round; on Evade Major Fail or worse, two GM-chosen Debuffs for 2 rounds.\nSabotage: 15ft Cone originating from sabotaged equipment; damage type depends on the equipment. Each piece fires once unless Rivet resets it.\n\nFull text: Core Rulebook p. 466.',
    source: 'Core Rulebook p. 466',
    chapter: 'Floor 4 · The Iron Tangle',
    floor: 4,
    description:
      "Folk horror's favorite asshole! Penthos feeds on fear, turns terrified locals into meat puppets, and gets nastier with every stab that lands. Pro tip: make him whiff once and his little hot streak resets to zero. Also, never tell him your real name, sweetie. He'll find you, and I'll broadcast what happens next.",
    prevDescriptions: [
      "Folk horror's favorite commuter! Penthos feeds on fear, turns scared locals into puppets, and gets stronger with every stab that lands. Pro tip: make him whiff. One miss and his hot streak resets. And maybe don't tell him your real name, sweetie.",
    ],
    prevNotes: [
      'Special: Battle High; Demoralize; Mind Control; Power of a Name. Full text: Core Rulebook p. 466.',
      'Battle High: +1 damage after each successful attack, stacking until an attack misses, then resets.\nDemoralize: Worried Mobs or NPCs make a Cha Stat Check each round; on Fail, they gain Terrified.\nMind Control: Terrified Mobs and NPCs become his minions with 1 Action per round, acting as his allies. He can spend an Action to make all minions take an extra action of his choice during crawler turns.\nPower of a Name: knows the exact location of any entity whose true name he knows; that entity has Disadvantage against his Heighten Emotion Spell.\nHeighten Emotion Spell: sight range, 15ft Blast radius. Hit crawlers gain one GM-chosen Debuff for 1 round; on Evade Major Fail or worse, two GM-chosen Debuffs for 2 rounds.\nSabotage: 15ft Cone originating from sabotaged equipment; damage type depends on the equipment. Each piece fires once unless Rivet resets it.\n\nFull text: Core Rulebook p. 466.',
    ],
    descriptionEs:
      '¡El cabrón favorito del folk horror! Penthos se alimenta del miedo, convierte a los lugareños aterrorizados en marionetas de carne y se vuelve más jodido con cada puñalada que acierta. Pro-Tip: haz que falle una sola vez y su rachita se reinicia a cero. Y nunca le digas tu nombre real, cielo. Te encontrará, y yo retransmitiré lo que pase después.',
    prevDescriptionsEs: [
      '¡El cabrón favorito del folk horror! Penthos se alimenta del miedo, convierte a los lugareños aterrorizados en marionetas de carne y se vuelve más jodido con cada puñalada que acierta. Consejo pro: haz que falle una sola vez y su rachita se reinicia a cero. Y nunca le digas tu nombre real, cielo. Te encontrará, y yo retransmitiré lo que pase después.',
    ],
  },
  {
    name: 'Gray Cornet',
    kind: 'mob',
    size: 'Large (5)',
    tags: 'Undead',
    slots: '10',
    slotValue: '4',
    level: '17',
    surprise: '12+F',
    evade: '14+F',
    move: '20+S',
    dr: '4',
    stats: {
      str: {
        score: '19',
        mod: '+4',
      },
      int: {
        score: '5',
        mod: '+2',
      },
      con: {
        score: '12',
        mod: '+4',
      },
      dex: {
        score: '19',
        mod: '+4',
      },
      cha: {
        score: '1',
        mod: '+1',
      },
    },
    attacks: [
      {
        name: 'Feral Leap',
        toHit: '14+F',
        damage: '2d8+4 Bludgeoning',
        range: '20ft range',
        effect: 'On hit: Take Down',
      },
      {
        name: 'Talons',
        toHit: '14+F',
        damage: '3d6+4 Slashing',
        range: '5ft range',
        effect: 'Major Fail+: Blood Trail',
      },
    ],
    notes: 'Manic: may move up to its full Move each time it uses Feral Leap.\n\nFull text: Core Rulebook p. 469.',
    source: 'Core Rulebook p. 469',
    chapter: 'Floor 4 · The Iron Tangle',
    floor: 4,
    description:
      'A Large undead pouncer with talons, zero chill, and the attention span of a coked-up squirrel. It leaps, knocks you on your ass, and bounces off to do it to your friend. Pro tip: stay on your feet and stay together. Lonely crawlers make great trampolines.',
    prevDescriptions: [
      'A Large undead thing with talons and zero chill. The Gray Cornet pounces, knocks you flat, then bounces off to flatten someone else. It treats the battlefield like a trampoline park. Pro tip: stay on your feet and stick close to your friends.',
    ],
    prevNotes: [
      'Special: Manic. Full text: Core Rulebook p. 469.',
      'Manic: may move up to its full Move each time it uses Feral Leap.\n\nFull text: Core Rulebook p. 469.',
    ],
    descriptionEs:
      'Un saltador no muerto Grande con garras, cero calma y la capacidad de atención de una ardilla puesta de coca. Salta, te tira de culo y rebota para hacérselo a tu amigo. Pro-Tip: mantente en pie y no os separéis. Los crawlers solitarios son unas camas elásticas estupendas.',
    prevDescriptionsEs: [
      'Un saltador no muerto Grande con garras, cero calma y la capacidad de atención de una ardilla puesta de coca. Salta, te tira de culo y rebota para hacérselo a tu amigo. Consejo pro: mantente en pie y no os separéis. Los crawlers solitarios son unas camas elásticas estupendas.',
    ],
  },
  {
    name: 'Razor Fox (p. 469)',
    kind: 'mob',
    size: 'Petite (3)',
    tags: 'Beast',
    slots: '10',
    slotValue: '4',
    level: '22',
    surprise: '13+F',
    evade: '15+F',
    move: '20+S',
    dr: '4',
    stats: {
      str: {
        score: '15',
        mod: '+4',
      },
      int: {
        score: '9',
        mod: '+3',
      },
      con: {
        score: '12',
        mod: '+4',
      },
      dex: {
        score: '34',
        mod: '+5',
      },
      cha: {
        score: '1',
        mod: '+1',
      },
    },
    attacks: [
      {
        name: 'Ninja Slash',
        toHit: '14+F',
        damage: '3d8+4 Slashing',
        range: '5ft range',
        effect: 'Major Fail+: Blood Trail',
      },
      {
        name: 'Shuriken Throw',
        toHit: '15+F',
        damage: '3d6+4 Piercing',
        range: '30ft range',
        effect: '',
      },
    ],
    notes:
      "Sneaky Quiet: if crawlers don't open with a surprise attack, its first-round attack has Advantage.\n\nFull text: Core Rulebook p. 469.",
    source: 'Core Rulebook p. 469',
    chapter: 'Floor 4 · The Iron Tangle',
    floor: 4,
    description:
      "A ninja fox with shurikens. I'm not going to oversell it, it sells itself. Pro tip: sneak attack it first, because if you don't, its first slash comes with Advantage and your guts come with a slow-motion replay. The audience voted it cutest killer three seasons running.",
    prevDescriptions: [
      "Ninja fox. Shurikens. I don't need to sell this. Pro tip: ambush it first, because if you don't, it'll ambush you, and its opening slash comes with Advantage and a slow-motion replay.",
    ],
    prevNotes: [
      'Special: Sneaky Quiet. Full text: Core Rulebook p. 469.',
      "Sneaky Quiet: if crawlers don't open with a surprise attack, its first-round attack has Advantage.\n\nFull text: Core Rulebook p. 469.",
    ],
    descriptionEs:
      'Un zorro ninja con shurikens. No voy a venderlo más de la cuenta, se vende solo. Pro-Tip: atácalo por sorpresa primero, porque si no, su primer tajo viene con Ventaja y tus tripas con repetición a cámara lenta. El público lo ha votado el asesino más mono tres temporadas seguidas.',
    prevDescriptionsEs: [
      'Un zorro ninja con shurikens. No voy a venderlo más de la cuenta, se vende solo. Consejo pro: atácalo por sorpresa primero, porque si no, su primer tajo viene con Ventaja y tus tripas con repetición a cámara lenta. El público lo ha votado el asesino más mono tres temporadas seguidas.',
    ],
  },
  {
    name: 'Gross Atomizer',
    kind: 'mob',
    size: 'Small (2)',
    tags: 'Aberration',
    slots: '10',
    slotValue: '4',
    level: '18',
    surprise: '12+F',
    evade: '14+F',
    move: '15+S',
    dr: '4',
    stats: {
      str: {
        score: '15',
        mod: '+4',
      },
      int: {
        score: '5',
        mod: '+2',
      },
      con: {
        score: '19',
        mod: '+4',
      },
      dex: {
        score: '19',
        mod: '+4',
      },
      cha: {
        score: '1',
        mod: '+1',
      },
    },
    attacks: [
      {
        name: 'Envelop',
        toHit: '14+F',
        damage: '2d4+4 Acid',
        range: '5ft range',
        effect: 'On hit: Burned',
      },
      {
        name: 'Poison Cloud',
        toHit: '12+F',
        damage: '2d6+2 Poison',
        range: '10ft Burst radius',
        effect: 'Major Fail+: Poisoned',
      },
    ],
    notes: 'Flight: flies and hovers as easily as it walks.\n\nFull text: Core Rulebook p. 470.',
    source: 'Core Rulebook p. 470',
    chapter: 'Floor 4 · The Iron Tangle',
    floor: 4,
    description:
      "A little floating booger that gives acid hugs and farts poison clouds. It's the worst roommate you've ever had, and it hovers out of reach. Pro tip: bring range, hold your breath, and don't let it wrap around your face. Dissolving from the nose outward is a look, but not a good one.",
    prevDescriptions: [
      "A Small floating blob that gives acid hugs and exhales poison clouds. It's the houseguest nobody invited. Pro tip: it hovers, so bring something with range and hold your breath.",
    ],
    prevNotes: [
      'Special: Flight. Full text: Core Rulebook p. 470.',
      'Flight: flies and hovers as easily as it walks.\n\nFull text: Core Rulebook p. 470.',
    ],
    descriptionEs:
      'Un moquito flotante que da abrazos de ácido y se tira pedos de nubes venenosas. Es el peor compañero de piso que has tenido nunca, y encima flota fuera de tu alcance. Pro-Tip: lleva ataques a distancia, aguanta la respiración y no dejes que se te enrosque en la cara. Disolverse de la nariz hacia fuera es un look, pero no uno bueno.',
    prevDescriptionsEs: [
      'Un moquito flotante que da abrazos de ácido y se tira pedos de nubes venenosas. Es el peor compañero de piso que has tenido nunca, y encima flota fuera de tu alcance. Consejo pro: lleva ataques a distancia, aguanta la respiración y no dejes que se te enrosque en la cara. Disolverse de la nariz hacia fuera es un look, pero no uno bueno.',
    ],
  },
  {
    name: 'Brain Teaser',
    kind: 'mob',
    size: 'Medium (4)',
    tags: 'Aberration, Swarm',
    slots: '10',
    slotValue: '4',
    level: '20',
    surprise: '14+F',
    evade: '14+F',
    move: '20+S',
    dr: '4',
    stats: {
      str: {
        score: '20',
        mod: '+5',
      },
      int: {
        score: '10',
        mod: '+4',
      },
      con: {
        score: '15',
        mod: '+4',
      },
      dex: {
        score: '19',
        mod: '+4',
      },
      cha: {
        score: '1',
        mod: '+1',
      },
    },
    attacks: [
      {
        name: 'Bore',
        toHit: '15+F',
        damage: '3d6+5 Piercing',
        range: '5ft range',
        effect: 'Major Fail+: Taint',
      },
      {
        name: 'Skull-Cracker',
        toHit: '15+F',
        damage: '3d8+5 Bludgeoning',
        range: '5ft range',
        effect: 'Major Fail+: Stunned',
      },
    ],
    notes:
      "Intellect Hound: its hits drain Mana instead of HB slots; once Mana is empty, damage goes to HB.\nMana Depletion: once a crawler's Mana is empty, each hit also gives a temporary -1 to their Intelligence.\n\nFull text: Core Rulebook p. 470.",
    source: 'Core Rulebook p. 470',
    chapter: 'Floor 4 · The Iron Tangle',
    floor: 4,
    description:
      "A swarm that drills into your skull and slurps your Mana like a milkshake. Once the tank's dry, it starts eating your actual brains. Pro tip: casters, stay the fuck back. Fighters, relax. You don't have much up there to lose.",
    prevDescriptions: [
      'A swarm that drills into your skull and slurps out your Mana like a milkshake. Once the tank is dry, it starts eating your IQ. Pro tip: casters, stay back. Everyone else, you have less to lose.',
    ],
    prevNotes: [
      'Special: Intellect Hound; Mana Depletion. Full text: Core Rulebook p. 470.',
      "Intellect Hound: its hits drain Mana instead of HB slots; once Mana is empty, damage goes to HB.\nMana Depletion: once a crawler's Mana is empty, each hit also gives a temporary -1 to their Intelligence.\n\nFull text: Core Rulebook p. 470.",
    ],
    descriptionEs:
      'Un enjambre que te taladra el cráneo y se sorbe tu Maná como un batido. Cuando el depósito se seca, empieza a comerse tu cerebro de verdad. Pro-Tip: lanzadores, quedaos atrás, joder. Guerreros, tranquilos. No tenéis mucho ahí arriba que perder.',
    prevDescriptionsEs: [
      'Un enjambre que te taladra el cráneo y se sorbe tu Maná como un batido. Cuando el depósito se seca, empieza a comerse tu cerebro de verdad. Consejo pro: lanzadores, quedaos atrás, joder. Guerreros, tranquilos. No tenéis mucho ahí arriba que perder.',
    ],
  },
  {
    name: 'Energy Vampire',
    kind: 'mob',
    size: 'Medium (4)',
    tags: 'Outsider',
    slots: '10',
    slotValue: '4',
    level: '23',
    surprise: '14+F',
    evade: '14+F',
    move: '20+S',
    dr: '4',
    stats: {
      str: {
        score: '1',
        mod: '+1',
      },
      int: {
        score: '15',
        mod: '+4',
      },
      con: {
        score: '15',
        mod: '+4',
      },
      dex: {
        score: '19',
        mod: '+4',
      },
      cha: {
        score: '24',
        mod: '+5',
      },
    },
    attacks: [
      {
        name: 'Devour Energy',
        toHit: '14+F',
        damage: '2d8+4 Psychic',
        range: '20ft range',
        effect: 'Special effect',
      },
    ],
    notes:
      'Energy Depletion: each hit forces a Con Stat Check; on Fail, -2 Charisma and -2 Intelligence for 2 hours. Stacks.\nDevour Energy: damage drains Mana before HB slots; once Mana is empty, it hits HB.\n\nFull text: Core Rulebook p. 471.',
    source: 'Core Rulebook p. 471',
    chapter: 'Floor 4 · The Iron Tangle',
    floor: 4,
    description:
      "You know that coworker who leaves you dumber and less likable after every chat? I found the species. The Energy Vampire drinks your Mana, then your charm, then your IQ. Pro tip: pass those Con checks, or you'll end up too stupid to cast and too boring to beg. Honestly, most of you are halfway there.",
    prevDescriptions: [
      "You know that coworker who leaves you dumber and less charming after every chat? I found the species. The Energy Vampire drinks Mana first and personality second. Pro tip: pass those Con checks, or you'll be too dull to cast and too boring to talk your way out.",
    ],
    prevNotes: [
      'Special: Energy Depletion. Full text: Core Rulebook p. 471.',
      'Energy Depletion: each hit forces a Con Stat Check; on Fail, -2 Charisma and -2 Intelligence for 2 hours. Stacks.\nDevour Energy: damage drains Mana before HB slots; once Mana is empty, it hits HB.\n\nFull text: Core Rulebook p. 471.',
    ],
    descriptionEs:
      '¿Conoces a ese compañero de trabajo que te deja más tonto y menos simpático después de cada charla? He encontrado la especie. El Energy Vampire se bebe tu Maná, luego tu encanto y luego tu CI. Pro-Tip: supera esas tiradas de Con, o acabarás demasiado tonto para lanzar hechizos y demasiado aburrido para suplicar. Sinceramente, la mayoría ya vais por la mitad.',
    prevDescriptionsEs: [
      '¿Conoces a ese compañero de trabajo que te deja más tonto y menos simpático después de cada charla? He encontrado la especie. El Energy Vampire se bebe tu Maná, luego tu encanto y luego tu CI. Consejo pro: supera esas tiradas de Con, o acabarás demasiado tonto para lanzar hechizos y demasiado aburrido para suplicar. Sinceramente, la mayoría ya vais por la mitad.',
    ],
  },
  {
    name: 'Revengineer',
    kind: 'boss',
    size: 'Medium (4)',
    tags: 'Neighborhood Boss, Undead',
    slots: '7',
    slotValue: '5',
    level: '41',
    surprise: '15+F',
    evade: '15+F',
    move: '20+S',
    dr: '4',
    stats: {
      str: {
        score: '38',
        mod: '+5',
      },
      int: {
        score: '30',
        mod: '+5',
      },
      con: {
        score: '40',
        mod: '+5',
      },
      dex: {
        score: '30',
        mod: '+5',
      },
      cha: {
        score: '10',
        mod: '+4',
      },
    },
    attacks: [
      {
        name: 'Fire Axe',
        toHit: '15+F',
        damage: '5d10+5 Fire',
        range: '5ft range',
        effect: '',
      },
      {
        name: 'Burning Agony',
        toHit: '14+F',
        damage: '4d8 Fire',
        range: '30ft Cone',
        effect: 'Major Fail+: Burned',
      },
    ],
    notes:
      'Fleeting: immune to damage unless he is wet or the attack specifically affects ephemeral enemies.\nSteam Punked: afraid of steam. While he is within steam, crawlers Evade all his attacks with Advantage; spraying him with steam grants Advantage against his next attack only.\n\nFull text: Core Rulebook p. 476.',
    source: 'Core Rulebook p. 476',
    chapter: 'Floor 4 · The Iron Tangle',
    floor: 4,
    description:
      'An engineer who got parboiled in a steam accident and came back with a flaming axe and a massive grudge. Your weapons pass right through him like farts through a screen door. Pro tip: get him wet, then beat the shit out of him. Steam scares him stupid, which is ironic and mechanically delicious.',
    prevDescriptions: [
      'An engineer who died in a steam accident and came back with a flaming axe and a grudge. Normal weapons pass right through him. Pro tip: get him wet, then hit him. Steam scares him silly, which is poetic and also mechanically useful.',
    ],
    prevNotes: [
      'Special: Fleeting; Steam Punked. Full text: Core Rulebook p. 476.',
      'Fleeting: immune to damage unless he is wet or the attack specifically affects ephemeral enemies.\nSteam Punked: afraid of steam. While he is within steam, crawlers Evade all his attacks with Advantage; spraying him with steam grants Advantage against his next attack only.\n\nFull text: Core Rulebook p. 476.',
    ],
    descriptionEs:
      'Un ingeniero que quedó medio hervido en un accidente de vapor y volvió con un hacha en llamas y un rencor descomunal. Tus armas lo atraviesan como un pedo una mosquitera. Pro-Tip: mójalo y luego dale de hostias hasta hartarte. El vapor le acojona hasta dejarlo tonto, lo cual es irónico y mecánicamente delicioso.',
    prevDescriptionsEs: [
      'Un ingeniero que quedó medio hervido en un accidente de vapor y volvió con un hacha en llamas y un rencor descomunal. Tus armas lo atraviesan como un pedo una mosquitera. Consejo pro: mójalo y luego dale de hostias hasta hartarte. El vapor le acojona hasta dejarlo tonto, lo cual es irónico y mecánicamente delicioso.',
    ],
  },
  {
    name: 'Babababoon',
    kind: 'mob',
    size: 'Medium (4)',
    tags: 'Beastly',
    slots: '10',
    slotValue: '4',
    level: '17',
    surprise: '12+F',
    evade: '14+F',
    move: '20+S',
    dr: '4',
    stats: {
      str: {
        score: '18',
        mod: '+4',
      },
      int: {
        score: '5',
        mod: '+2',
      },
      con: {
        score: '15',
        mod: '+4',
      },
      dex: {
        score: '16',
        mod: '+4',
      },
      cha: {
        score: '2',
        mod: '+1',
      },
    },
    attacks: [
      {
        name: 'Wild Swing',
        toHit: '14+F',
        damage: '3d6+4 Slashing',
        range: '5ft range',
        effect: '',
      },
      {
        name: 'Fecal Fling',
        toHit: '14+F',
        damage: '2d4+4 Bludgeoning',
        range: '30ft range',
        effect: 'On hit: Poisoned',
      },
    ],
    notes: 'Augmented: crude cybernetics; takes x2 Electric damage.\n\nFull text: Core Rulebook p. 479.',
    source: 'Core Rulebook p. 479',
    chapter: 'Floor 4 · The Iron Tangle',
    floor: 4,
    description:
      "A baboon with bargain-bin cyberware and an arm that throws shit. Actual shit. At range. You'll smell this fight for days. Pro tip: electricity. Those cheap implants take double from every volt, and nothing plays better on camera than a shit-flinging monkey having a seizure.",
    prevDescriptions: [
      "A baboon with homemade cyberware and a throwing arm loaded with... ammunition. You'll want a shower after this one. Pro tip: shock therapy. Those bargain-bin implants double every volt.",
    ],
    prevNotes: [
      'Special: Augmented. Full text: Core Rulebook p. 479.',
      'Augmented: crude cybernetics; takes x2 Electric damage.\n\nFull text: Core Rulebook p. 479.',
    ],
    descriptionEs:
      'Un babuino con ciberimplantes de saldo y un brazo que lanza mierda. Mierda de verdad. A distancia. Vas a oler esta pelea durante días. Pro-Tip: electricidad. Esos implantes baratos reciben el doble de cada voltio, y nada queda mejor en cámara que un mono lanzamierda convulsionando.',
    prevDescriptionsEs: [
      'Un babuino con ciberimplantes de saldo y un brazo que lanza mierda. Mierda de verdad. A distancia. Vas a oler esta pelea durante días. Consejo pro: electricidad. Esos implantes baratos reciben el doble de cada voltio, y nada queda mejor en cámara que un mono lanzamierda convulsionando.',
    ],
  },
  {
    name: 'Bone Collector',
    kind: 'mob',
    size: 'Large (5)',
    tags: 'Aberration',
    slots: '10',
    slotValue: '5',
    level: '20',
    surprise: '12+F',
    evade: '14+F',
    move: '20+S',
    dr: '4',
    stats: {
      str: {
        score: '22',
        mod: '+5',
      },
      int: {
        score: '3',
        mod: '+2',
      },
      con: {
        score: '20',
        mod: '+5',
      },
      dex: {
        score: '19',
        mod: '+4',
      },
      cha: {
        score: '1',
        mod: '+1',
      },
    },
    attacks: [
      {
        name: 'Grind',
        toHit: '15+F',
        damage: '3d8+5 Bludgeoning',
        range: '5ft range',
        effect: '',
      },
      {
        name: 'Pounce',
        toHit: '15+F',
        damage: '3d4+5 Bludgeoning',
        range: '10ft range',
        effect: 'Major Fail+: Held',
      },
    ],
    notes: 'Oozy: squeezes through openings of Small (2) size or larger.\n\nFull text: Core Rulebook p. 480.',
    source: 'Core Rulebook p. 480',
    chapter: 'Floor 4 · The Iron Tangle',
    floor: 4,
    description:
      "A Large ooze that grinds bones into paste and squeezes through gaps way smaller than its fat ass should fit. Closing the door is not a plan. Pro tip: don't let it pin you, and don't trust the air vent. It's always in the air vent.",
    prevDescriptions: [
      "A Large, oozy aberration that grinds bones and fits through gaps way smaller than it should. Closing the door is not a plan. Pro tip: don't get pinned, and don't assume the vent is safe.",
    ],
    prevNotes: [
      'Special: Oozy. Full text: Core Rulebook p. 480.',
      'Oozy: squeezes through openings of Small (2) size or larger.\n\nFull text: Core Rulebook p. 480.',
    ],
    descriptionEs:
      'Un cieno Grande que muele huesos hasta hacerlos pasta y se cuela por rendijas muchísimo más pequeñas de lo que debería caber su culo gordo. Cerrar la puerta no es un plan. Pro-Tip: no dejes que te inmovilice, y no te fíes del conducto de ventilación. Siempre está en el conducto de ventilación.',
    prevDescriptionsEs: [
      'Un cieno Grande que muele huesos hasta hacerlos pasta y se cuela por rendijas muchísimo más pequeñas de lo que debería caber su culo gordo. Cerrar la puerta no es un plan. Consejo pro: no dejes que te inmovilice, y no te fíes del conducto de ventilación. Siempre está en el conducto de ventilación.',
    ],
  },
  {
    name: 'Grease Gremlin',
    kind: 'npc',
    size: 'Small (2)',
    tags: 'NPC, Humanoid',
    slots: '10',
    slotValue: '4',
    level: '19',
    surprise: '14+F',
    evade: '15+F',
    move: '25+S',
    dr: '4',
    stats: {
      str: {
        score: '10',
        mod: '+4',
      },
      int: {
        score: '11',
        mod: '+4',
      },
      con: {
        score: '13',
        mod: '+4',
      },
      dex: {
        score: '22',
        mod: '+5',
      },
      cha: {
        score: '3',
        mod: '+2',
      },
    },
    attacks: [
      {
        name: 'Fast Disassemble',
        toHit: '14+F',
        damage: 'No damage',
        range: '5ft range',
        effect: 'Special effect',
      },
      {
        name: 'Multi-Weapon',
        toHit: '14+F',
        damage: '3d6+4 Bludgeoning, Piercing, or Slashing (their choice)',
        range: '5ft range',
        effect: '',
      },
    ],
    notes:
      'Fast Assembly: repairs mechanical devices in 1/3 the usual time.\nIrritable Worker: ignores crawlers while repairing. If a crawler interrupts the repair, it gains Advantage on its first attack against that crawler.\nFast Disassemble: on hit, one carried or worn mechanical item (usually weapon or armor) is unusable until the crawler spends 2 actions reassembling it.\nMulti-Weapon: chooses Bludgeoning, Piercing, or Slashing damage per attack.\n\nFull text: Core Rulebook p. 481.',
    source: 'Core Rulebook p. 481',
    chapter: 'Floor 4 · The Iron Tangle',
    floor: 4,
    description:
      "Level 19 and still on hourly pay. The Grease Gremlin fixes shit three times faster than you, and unfixes your armor in one swing. Bug it mid-repair and it'll hold a grudge right into your kidneys. Pro tip: carry a spare weapon, or be ready to burn two actions putting your gear back together like an idiot.",
    prevDescriptions: [
      "Level 19 and still on hourly pay. The Grease Gremlin fixes things in a third of the time and unfixes your armor in one swing. Interrupt its repair job and it'll remember you for exactly one very unpleasant attack. Pro tip: bring a spare weapon, or two free actions.",
    ],
    prevNotes: [
      'Special: Fast Assembly; Irritable Worker. Full text: Core Rulebook p. 481.',
      'Fast Assembly: repairs mechanical devices in 1/3 the usual time.\nIrritable Worker: ignores crawlers while repairing. If a crawler interrupts the repair, it gains Advantage on its first attack against that crawler.\nFast Disassemble: on hit, one carried or worn mechanical item (usually weapon or armor) is unusable until the crawler spends 2 actions reassembling it.\nMulti-Weapon: chooses Bludgeoning, Piercing, or Slashing damage per attack.\n\nFull text: Core Rulebook p. 481.',
    ],
    descriptionEs:
      'Nivel 19 y todavía cobrando por horas. El Grease Gremlin arregla cualquier mierda tres veces más rápido que tú, y te desarregla la armadura de un solo golpe. Moléstalo en plena reparación y te guardará un rencor que llegará directo a tus riñones. Pro-Tip: lleva un arma de repuesto, o prepárate para gastar dos Acciones volviendo a montar tu equipo como un idiota.',
    prevDescriptionsEs: [
      'Nivel 19 y todavía cobrando por horas. El Grease Gremlin arregla cualquier mierda tres veces más rápido que tú, y te desarregla la armadura de un solo golpe. Moléstalo en plena reparación y te guardará un rencor que llegará directo a tus riñones. Consejo pro: lleva un arma de repuesto, o prepárate para gastar dos Acciones volviendo a montar tu equipo como un idiota.',
    ],
  },
  {
    name: 'Harvester',
    kind: 'mob',
    size: 'Small (2)',
    tags: 'Construct',
    slots: '10',
    slotValue: '4',
    level: '15',
    surprise: '13+F',
    evade: '14+F',
    move: '20+S',
    dr: '4',
    stats: {
      str: {
        score: '15',
        mod: '+4',
      },
      int: {
        score: '8',
        mod: '+3',
      },
      con: {
        score: '10',
        mod: '+4',
      },
      dex: {
        score: '16',
        mod: '+4',
      },
      cha: {
        score: '1',
        mod: '+1',
      },
    },
    attacks: [
      {
        name: 'Cauterizer',
        toHit: '14+F',
        damage: '3d4+4 Fire',
        range: '20ft range',
        effect: 'Burned',
      },
      {
        name: 'Man-Opener',
        toHit: '14+F',
        damage: '3d6+4 Slashing',
        range: '5ft range',
        effect: 'Major Fail+: Blood Trail',
      },
    ],
    notes:
      'Cluster Fucked: Advantage on attacks while 2+ Harvesters attack the same target.\nSignal Senses: ignores crawlers wearing signal dampeners.\nCauterizer: Burned triggers on Evade Fail or worse, not just Major Fail.\n\nFull text: Core Rulebook p. 481.',
    source: 'Core Rulebook p. 481',
    chapter: 'Floor 4 · The Iron Tangle',
    floor: 4,
    description:
      "Small surgical robots that slice you open and cauterize the wound. How considerate. They swarm in packs, and two on one target is a true clusterfuck. Pro tip: wear a signal dampener and they'll roll past like you don't exist. Don't, and congratulations, you're the patient. No anesthesia on this floor.",
    prevDescriptions: [
      "Small surgical robots that cut you open and cauterize the wound. So considerate. They work in teams and home in on signals. Pro tip: wear a signal dampener and they'll roll right past you. Don't, and you're the patient.",
    ],
    prevNotes: [
      'Special: Cluster Fucked; Signal Senses. Full text: Core Rulebook p. 481.',
      'Cluster Fucked: Advantage on attacks while 2+ Harvesters attack the same target.\nSignal Senses: ignores crawlers wearing signal dampeners.\nCauterizer: Burned triggers on Evade Fail or worse, not just Major Fail.\n\nFull text: Core Rulebook p. 481.',
    ],
    descriptionEs:
      'Pequeños robots quirúrgicos que te abren en canal y cauterizan la herida. Qué considerados. Van en manada, y dos contra un mismo objetivo es un puto desmadre. Pro-Tip: lleva un inhibidor de señal y pasarán rodando como si no existieras. Si no, enhorabuena, eres el paciente. En este piso no hay anestesia.',
    prevDescriptionsEs: [
      'Pequeños robots quirúrgicos que te abren en canal y cauterizan la herida. Qué considerados. Van en manada, y dos contra un mismo objetivo es un puto desmadre. Consejo pro: lleva un inhibidor de señal y pasarán rodando como si no existieras. Si no, enhorabuena, eres el paciente. En este piso no hay anestesia.',
    ],
  },
  {
    name: 'Elder Gremlin',
    kind: 'npc',
    size: 'Small (2)',
    tags: 'NPC, Humanoid',
    slots: '10',
    slotValue: '5',
    level: '30',
    surprise: '15+F',
    evade: '15+F',
    move: '25+S',
    dr: '4',
    stats: {
      str: {
        score: '13',
        mod: '+4',
      },
      int: {
        score: '23',
        mod: '+5',
      },
      con: {
        score: '23',
        mod: '+5',
      },
      dex: {
        score: '23',
        mod: '+5',
      },
      cha: {
        score: '13',
        mod: '+4',
      },
    },
    attacks: [
      {
        name: 'Fast Disassemble',
        toHit: '15+F',
        damage: 'No damage',
        range: '5ft range',
        effect: 'Special effect',
      },
      {
        name: 'Knife',
        toHit: '15+F',
        damage: '3d6+4 Piercing',
        range: '5ft range, Armor-Piercing',
        effect: 'Major Fail+: Blood Trail',
      },
    ],
    notes:
      'Fast Assembly: repairs mechanical devices in 1/3 the usual time.\nLong Memories: crawlers who help one have Advantage on future Cha Stat Checks with it; crawlers who cross one have Disadvantage.\nFast Disassemble: on hit, one carried or worn mechanical item (usually weapon or armor) is unusable until the crawler spends 2 actions reassembling it.\n\nFull text: Core Rulebook p. 486.',
    source: 'Core Rulebook p. 486',
    chapter: 'Floor 4 · The Iron Tangle',
    floor: 4,
    description:
      "The Elder Gremlin has seen everything, fixed most of it, and never forgets a face. Help one and you've got a friend for life. Screw one over and you'll be fighting in your underwear while your armor lies around in pieces. Pro tip: always tip your mechanic, you cheap bastards.",
    prevDescriptions: [
      "The Elder Gremlin has seen it all, fixed most of it, and remembers every face. Do it a favor and you've got a friend for life. Stiff it and enjoy your armor in pieces. Pro tip: always tip your mechanic.",
    ],
    prevNotes: [
      'Special: Fast Assembly; Long Memories. Full text: Core Rulebook p. 486.',
      'Fast Assembly: repairs mechanical devices in 1/3 the usual time.\nLong Memories: crawlers who help one have Advantage on future Cha Stat Checks with it; crawlers who cross one have Disadvantage.\nFast Disassemble: on hit, one carried or worn mechanical item (usually weapon or armor) is unusable until the crawler spends 2 actions reassembling it.\n\nFull text: Core Rulebook p. 486.',
    ],
    descriptionEs:
      'El Elder Gremlin lo ha visto todo, ha arreglado casi todo y nunca olvida una cara. Ayuda a uno y tendrás un amigo para toda la vida. Jódele a uno y acabarás peleando en calzoncillos mientras tu armadura anda tirada por ahí hecha piezas. Pro-Tip: dadle siempre propina a vuestro mecánico, cabrones rácanos.',
    prevDescriptionsEs: [
      'El Elder Gremlin lo ha visto todo, ha arreglado casi todo y nunca olvida una cara. Ayuda a uno y tendrás un amigo para toda la vida. Jódele a uno y acabarás peleando en calzoncillos mientras tu armadura anda tirada por ahí hecha piezas. Consejo pro: dadle siempre propina a vuestro mecánico, cabrones rácanos.',
    ],
  },
  {
    name: 'Tigran Warrior',
    kind: 'crawler',
    size: 'Medium (4)',
    tags: 'Humanoid',
    slots: '10',
    slotValue: '4',
    level: '19',
    surprise: '13+F',
    evade: '14+F',
    move: '25+S',
    dr: '4',
    stats: {
      str: {
        score: '21',
        mod: '+5',
      },
      int: {
        score: '7',
        mod: '+3',
      },
      con: {
        score: '15',
        mod: '+4',
      },
      dex: {
        score: '13',
        mod: '+4',
      },
      cha: {
        score: '6',
        mod: '+3',
      },
    },
    attacks: [
      {
        name: 'Iron Paw',
        toHit: '15+F',
        damage: '3d6+5 Slashing',
        range: '5ft range',
        effect: 'Major Fail+: Stunned',
      },
      {
        name: 'Leg Sweep',
        toHit: '15+5',
        damage: '2d8+5 Bludgeoning',
        range: '5ft range',
        effect: 'On hit: Take Down',
      },
    ],
    notes:
      'Cat-Like Reflexes: Dex Stat Checks at Advantage.\nEasily Distracted: Checks to resist being lured off its current task at Disadvantage.\n\nFull text: Core Rulebook p. 487.',
    source: 'Core Rulebook p. 487',
    chapter: 'Floor 4 · The Iron Tangle',
    floor: 4,
    description:
      "Our Tigran contestant brings iron paws, a vicious leg sweep, and reflexes so good my stunt department filed a complaint. The catch: dangle anything shiny and this kitty's brain goes straight out the window. Odds of survival? Solid, until somebody with a laser pointer gets bored.",
    prevDescriptions: [
      'Our Tigran contestant brings iron paws, a nasty leg sweep, and reflexes that make my stunt coordinators jealous. The downside: dangle something shiny and watch that focus evaporate. Odds of survival? Decent, right up until someone brings a laser pointer.',
    ],
    prevNotes: [
      'Special: Cat-Like Reflexes; Easily Distracted. Full text: Core Rulebook p. 487.',
      'Cat-Like Reflexes: Dex Stat Checks at Advantage.\nEasily Distracted: Checks to resist being lured off its current task at Disadvantage.\n\nFull text: Core Rulebook p. 487.',
    ],
    descriptionEs:
      'Nuestro concursante Tigran trae zarpas de hierro, un barrido de pierna despiadado y unos reflejos tan buenos que mi departamento de especialistas ha puesto una queja. La pega: ponle delante cualquier cosa brillante y el cerebro de este gatito sale volando por la ventana. ¿Probabilidades de supervivencia? Sólidas, hasta que alguien con un puntero láser se aburra.',
  },
  {
    name: 'Flavisham the Tinkerer',
    kind: 'boss',
    size: 'Colossal (7)',
    tags: 'Neighborhood Boss, Construct',
    slots: '7',
    slotValue: '5',
    level: '37',
    surprise: '15+F',
    evade: '15+F',
    move: '20+S',
    dr: '4',
    stats: {
      str: {
        score: '35',
        mod: '+5',
      },
      int: {
        score: '29',
        mod: '+5',
      },
      con: {
        score: '30',
        mod: '+5',
      },
      dex: {
        score: '32',
        mod: '+5',
      },
      cha: {
        score: '10',
        mod: '+4',
      },
    },
    attacks: [
      {
        name: 'Pin-Saw',
        toHit: '15+F',
        damage: '5d8+5 Slashing',
        range: '5ft range',
        effect: '',
      },
      {
        name: 'Net',
        toHit: '15+F',
        damage: 'No damage',
        range: '60ft range',
        effect: 'On hit: Held',
      },
      {
        name: 'Sludge Spit',
        toHit: '15+F',
        damage: '4d6 Acid',
        range: '30ft range, 10ft',
        effect: 'Major Fail+: Burned',
      },
    ],
    notes:
      'Bio-Mechanical: out of his cockpit he has no DR and takes x2 damage. Pulling him out should take at least two crawlers, two rounds, and a clever plan.\nAttack the Legs: crawlers may target the legs; reveal the Disadvantage only after they declare. If one such attack removes 2+ HB slots, he loses a leg and one Action.\nSludge Spit: 10ft Blast radius.\n\nFull text: Core Rulebook p. 488.',
    source: 'Core Rulebook p. 488',
    chapter: 'Floor 4 · The Iron Tangle',
    floor: 4,
    description:
      "Flavisham the Tinkerer built himself a Colossal walking death machine with a saw, a net gun, and a sludge cannon, which is some serious overcompensating. Pro tip: the squishy bastard lives in the cockpit, and those legs don't hold up forever. Pry him out and he pops like a zit.",
    prevDescriptions: [
      "Flavisham the Tinkerer built himself a Colossal walking machine with a saw, a net gun, and a sludge cannon. Adorable. Pro tip: the squishy part lives in the cockpit, and those legs aren't load-bearing forever. Teamwork, crawlers. The audience loves a heist.",
    ],
    prevNotes: [
      'Special: Bio-Mechanical; Attack the Legs. Full text: Core Rulebook p. 488.',
      'Bio-Mechanical: out of his cockpit he has no DR and takes x2 damage. Pulling him out should take at least two crawlers, two rounds, and a clever plan.\nAttack the Legs: crawlers may target the legs; reveal the Disadvantage only after they declare. If one such attack removes 2+ HB slots, he loses a leg and one Action.\nSludge Spit: 10ft Blast radius.\n\nFull text: Core Rulebook p. 488.',
    ],
    descriptionEs:
      'Flavisham the Tinkerer se ha construido una máquina de muerte andante Colosal con sierra, lanzarredes y cañón de lodo, lo cual es compensar algo muy en serio. Pro-Tip: el cabrón blandengue vive en la cabina, y esas patas no aguantan para siempre. Sácalo de ahí y revienta como un grano.',
    prevDescriptionsEs: [
      'Flavisham the Tinkerer se ha construido una máquina de muerte andante Colosal con sierra, lanzarredes y cañón de lodo, lo cual es compensar algo muy en serio. Consejo pro: el cabrón blandengue vive en la cabina, y esas patas no aguantan para siempre. Sácalo de ahí y revienta como un grano.',
    ],
  },
  {
    name: 'Cave Mudge Bonker',
    kind: 'mob',
    size: 'Medium (4)',
    tags: 'Humanoid',
    slots: '10',
    slotValue: '4',
    level: '19',
    surprise: '13+F',
    evade: '14+F',
    move: '20+S',
    dr: '4',
    stats: {
      str: {
        score: '26',
        mod: '+5',
      },
      int: {
        score: '6',
        mod: '+3',
      },
      con: {
        score: '12',
        mod: '+4',
      },
      dex: {
        score: '12',
        mod: '+4',
      },
      cha: {
        score: '6',
        mod: '+3',
      },
    },
    attacks: [
      {
        name: 'Bonk',
        toHit: '15+F',
        damage: '3d6+5 Bludgeoning',
        range: '5ft range',
        effect: 'Major Fail+: Stunned',
      },
    ],
    notes: 'Charge: +10ft Move when moving toward a target it intends to Bonk.\n\nFull text: Core Rulebook p. 491.',
    source: 'Core Rulebook p. 491',
    chapter: 'Floor 4 · The Iron Tangle',
    floor: 4,
    description:
      "It bonks. That's the whole resume. The Bonker charges faster than you'd expect and hits your skull like it owes it money. Pro tip: wear a helmet and don't stand in a straight line with it. I'm not saying you'll die, I'm saying you'll wish you had.",
    prevDescriptions: [
      "It bonks. That's the whole resume. The Cave Mudge Bonker charges in with extra speed and a very strong opinion about your skull. Pro tip: helmets. Also, don't stand in a straight line from it.",
    ],
    prevNotes: [
      'Special: Charge. Full text: Core Rulebook p. 491.',
      'Charge: +10ft Move when moving toward a target it intends to Bonk.\n\nFull text: Core Rulebook p. 491.',
    ],
    descriptionEs:
      'Da porrazos. Ese es todo su currículum. El Bonker carga más rápido de lo que esperarías y te golpea el cráneo como si le debiera dinero. Pro-Tip: ponte casco y no te quedes en línea recta con él. No digo que vayas a morir, digo que desearás haberlo hecho.',
    prevDescriptionsEs: [
      'Da porrazos. Ese es todo su currículum. El Bonker carga más rápido de lo que esperarías y te golpea el cráneo como si le debiera dinero. Consejo pro: ponte casco y no te quedes en línea recta con él. No digo que vayas a morir, digo que desearás haberlo hecho.',
    ],
  },
  {
    name: 'Cave Mudge Judge',
    kind: 'mob',
    size: 'Medium (4)',
    tags: 'Humanoid',
    slots: '10',
    slotValue: '4',
    level: '20',
    surprise: '15+F',
    evade: '14+F',
    move: '20+S',
    dr: '4',
    stats: {
      str: {
        score: '12',
        mod: '+4',
      },
      int: {
        score: '20',
        mod: '+5',
      },
      con: {
        score: '12',
        mod: '+4',
      },
      dex: {
        score: '12',
        mod: '+4',
      },
      cha: {
        score: '9',
        mod: '+3',
      },
    },
    attacks: [
      {
        name: 'Dirt Clod Spell',
        toHit: '15+F',
        damage: '3d2+5 Bludgeoning',
        range: '100ft range',
        effect: 'On hit: Woozy',
      },
      {
        name: 'Throw Insult',
        toHit: '15+F',
        damage: 'No damage',
        range: '30ft range',
        effect: 'On hit: Stunned',
      },
    ],
    notes:
      'Brain Washed: its brain is an ingredient for Perception-boosting potions.\n\nFull text: Core Rulebook p. 491.',
    source: 'Core Rulebook p. 491',
    chapter: 'Floor 4 · The Iron Tangle',
    floor: 4,
    description:
      "The Judge flings magic dirt from across the room and throws insults so brutal they drop you in your tracks. Fuck, I respect that. Pro tip: its brain brews into a Perception potion, so don't turn its head into a canoe if you plan on shopping later.",
    prevDescriptions: [
      "The Cave Mudge Judge slings dirt with magic and insults so savage they stun. Honestly, I respect the craft. Pro tip: its brain brews into a Perception potion, so aim for the body if you're planning to go shopping later.",
    ],
    prevNotes: [
      'Special: Brain Washed. Full text: Core Rulebook p. 491.',
      'Brain Washed: its brain is an ingredient for Perception-boosting potions.\n\nFull text: Core Rulebook p. 491.',
    ],
    descriptionEs:
      'El Judge lanza tierra mágica desde la otra punta de la sala y suelta insultos tan brutales que te dejan clavado en el sitio. Joder, cómo lo respeto. Pro-Tip: su cerebro sirve para destilar una poción de Percepción, así que no le conviertas la cabeza en una canoa si piensas ir de compras luego.',
    prevDescriptionsEs: [
      'El Judge lanza tierra mágica desde la otra punta de la sala y suelta insultos tan brutales que te dejan clavado en el sitio. Joder, cómo lo respeto. Consejo pro: su cerebro sirve para destilar una poción de Percepción, así que no le conviertas la cabeza en una canoa si piensas ir de compras luego.',
    ],
  },
  {
    name: 'Drake Bitch',
    kind: 'mob',
    size: 'Medium (4)',
    tags: 'Reptile',
    slots: '10',
    slotValue: '5',
    level: '22',
    surprise: '12+F',
    evade: '14+F',
    move: '20+S',
    dr: '4',
    stats: {
      str: {
        score: '12',
        mod: '+4',
      },
      int: {
        score: '3',
        mod: '+2',
      },
      con: {
        score: '35',
        mod: '+5',
      },
      dex: {
        score: '12',
        mod: '+4',
      },
      cha: {
        score: '9',
        mod: '+3',
      },
    },
    attacks: [
      {
        name: 'Bite',
        toHit: '14+F',
        damage: '3d6+4 Piercing',
        range: '5ft range',
        effect: 'Major Fail+: Blood Trail',
      },
      {
        name: 'Egg Cloud',
        toHit: '14+F',
        damage: '2d6 Acid',
        range: '30ft Cone',
        effect: 'Ovulated',
      },
    ],
    notes:
      "Fly: flies as if on the ground; Move 30.\nEgg Cloud: any crawler who loses 1+ HB slot gains Ovulated: an egg lodges inside; Health Bar can't exceed 90% until it is removed. Removal: Unopposed First Aid-type Skill Check at Disadvantage, Rank 10+ healing magic, or a Potion of Feticide (p. 94). Regeneration-type Skills grant immunity.\n\nFull text: Core Rulebook p. 492.",
    source: 'Core Rulebook p. 492',
    chapter: 'Floor 4 · The Iron Tangle',
    floor: 4,
    description:
      "Nature is beautiful. Nature is also fucked up. This flying drake doesn't just bite, it breathes an acid cloud that leaves a surprise egg lodged in your guts. Pro tip: don't lose Health in the cloud, and keep a healer on speed dial. Also, avoid the males afterward. Trust me on this one.",
    prevDescriptions: [
      "Nature is beautiful, and also horrifying. This flying drake doesn't just bite, it plants eggs in you with a cloud of acid. Pro tip: don't lose any HB in the cloud, and keep a healer handy. And whatever you do, avoid the males afterward.",
    ],
    prevNotes: [
      'Special: Fly. Full text: Core Rulebook p. 492.',
      "Fly: flies as if on the ground; Move 30.\nEgg Cloud: any crawler who loses 1+ HB slot gains Ovulated: an egg lodges inside; Health Bar can't exceed 90% until it is removed. Removal: Unopposed First Aid-type Skill Check at Disadvantage, Rank 10+ healing magic, or a Potion of Feticide (p. 94). Regeneration-type Skills grant immunity.\n\nFull text: Core Rulebook p. 492.",
    ],
    descriptionEs:
      'La naturaleza es preciosa. La naturaleza también está jodidísima. Este draco volador no solo muerde: exhala una nube de ácido que te deja un huevo sorpresa alojado en las tripas. Pro-Tip: no pierdas Salud dentro de la nube, y ten a un sanador en marcación rápida. Y evita a los machos después. Hazme caso en esto.',
    prevDescriptionsEs: [
      'La naturaleza es preciosa. La naturaleza también está jodidísima. Este draco volador no solo muerde: exhala una nube de ácido que te deja un huevo sorpresa alojado en las tripas. Consejo pro: no pierdas Salud dentro de la nube, y ten a un sanador en marcación rápida. Y evita a los machos después. Hazme caso en esto.',
    ],
  },
  {
    name: 'Drake Stud',
    kind: 'mob',
    size: 'Medium (4)',
    tags: 'Reptile',
    slots: '10',
    slotValue: '5',
    level: '22',
    surprise: '12+F',
    evade: '14+F',
    move: '20+S',
    dr: '4',
    stats: {
      str: {
        score: '12',
        mod: '+4',
      },
      int: {
        score: '3',
        mod: '+2',
      },
      con: {
        score: '35',
        mod: '+5',
      },
      dex: {
        score: '12',
        mod: '+4',
      },
      cha: {
        score: '9',
        mod: '+3',
      },
    },
    attacks: [
      {
        name: 'Bite',
        toHit: '14+F',
        damage: '3d8+4 Piercing',
        range: '5ft range',
        effect: '',
      },
      {
        name: 'Sperm Stream',
        toHit: '14+F',
        damage: '2d6+4 Force',
        range: '30ft Line',
        effect: 'Ovulated, Gravid',
      },
    ],
    notes:
      'Sperm Stream: target already Ovulated + Evade Fail or worse → Gravid: the drake knocks them up and a baby drake grows inside them; −1 HB/day, unhealable until Gravid ends; 0% HB → crawler dies, baby drake born. Remove Gravid by any method that removes Ovulated.\n\nFull text: Core Rulebook p. 492.',
    source: 'Core Rulebook p. 492',
    chapter: 'Floor 4 · The Iron Tangle',
    floor: 4,
    description:
      "The other half of the worst nature documentary ever filmed. Alone, the Stud is just a bitey lizard with a nasty force blast. Near a crawler already carrying an egg, it becomes a very slow, very gross countdown with a baby drake at the end. Pro tip: cure that egg fast. Nobody's throwing you a shower.",
    prevDescriptions: [
      "The other half of the worst nature documentary ever filmed. Alone, the Drake Stud is just a bitey lizard with a force blast. Paired with an egg-carrying crawler, it's a ticking clock with a hatchling at the end. Pro tip: cure Ovulated fast. Congratulations are not in order.",
    ],
    prevNotes: [
      'Full text: Core Rulebook p. 492.',
      'Sperm Stream: target already Ovulated + Evade Fail or worse → Gravid: −1 HB/day, unhealable until Gravid ends; 0% HB → crawler dies, baby drake born. Remove Gravid by any method that removes Ovulated.\n\nFull text: Core Rulebook p. 492.',
    ],
    descriptionEs:
      'La otra mitad del peor documental de naturaleza jamás rodado. Solo, el Stud no es más que un lagarto mordedor con una ráfaga de fuerza bastante cabrona. Cerca de un crawler que ya lleva un huevo, se convierte en una cuenta atrás muy lenta y muy asquerosa con un bebé draco al final. Pro-Tip: cúrate ese huevo rápido. Nadie te va a montar un baby shower.',
    prevDescriptionsEs: [
      'La otra mitad del peor documental de naturaleza jamás rodado. Solo, el Stud no es más que un lagarto mordedor con una ráfaga de fuerza bastante cabrona. Cerca de un crawler que ya lleva un huevo, se convierte en una cuenta atrás muy lenta y muy asquerosa con un bebé draco al final. Consejo pro: cúrate ese huevo rápido. Nadie te va a montar un baby shower.',
    ],
  },
  {
    name: 'School of Mythfish',
    kind: 'mob',
    size: 'Petite (3)',
    tags: 'Fish',
    slots: '10',
    slotValue: '3',
    level: '18',
    surprise: '15+F',
    evade: '14+F',
    move: '20+S',
    dr: '4',
    stats: {
      str: {
        score: '2',
        mod: '+1',
      },
      int: {
        score: '20',
        mod: '+5',
      },
      con: {
        score: '6',
        mod: '+3',
      },
      dex: {
        score: '15',
        mod: '+4',
      },
      cha: {
        score: '16',
        mod: '+4',
      },
    },
    attacks: [
      {
        name: 'Nibbles',
        toHit: '11+F',
        damage: '3d6+1 Piercing',
        range: '5ft range',
        effect: 'Major Fail+: Fatigued',
      },
      {
        name: 'Psychic Visions',
        toHit: '15+F',
        damage: '2d6+5 Psychic',
        range: '30ft range',
        effect: 'On hit: Staggered',
      },
    ],
    notes:
      "Visionary: struck by Psychic Visions → that crawler's next Attack or Evade roll at Advantage.\n\nFull text: Core Rulebook p. 493.",
    source: 'Core Rulebook p. 493',
    chapter: 'Floor 4 · The Iron Tangle',
    floor: 4,
    description:
      "Sushi that reads minds. A school of Mythfish will strip your shins to the bone while beaming someone else's shitty thoughts into your skull. Pro tip: take the psychic hit and your next swing or dodge gets a free leg up. Nothing says teamwork like a migraine.",
    prevDescriptions: [
      "Behold: sushi with a psychic license. These little guys nibble your shins while broadcasting other people's thoughts straight into your skull. Pro tip: the headache comes with a free peek at your enemies. Take the win, then take a nap.",
    ],
    prevNotes: [
      'Special: Visionary. Full text: Core Rulebook p. 493.',
      "Visionary: struck by Psychic Visions → that crawler's next Attack or Evade roll at Advantage.\n\nFull text: Core Rulebook p. 493.",
    ],
    descriptionEs:
      'Sushi que lee mentes. Un banco de Mythfish te deja las espinillas en el hueso mientras te proyecta en el cráneo los pensamientos de mierda de otro. Pro-Tip: trágate el golpe psíquico y tu siguiente ataque o Esquiva recibe un empujoncito gratis. Nada dice trabajo en equipo como una migraña.',
    prevDescriptionsEs: [
      'Sushi que lee mentes. Un banco de Mythfish te deja las espinillas en el hueso mientras te proyecta en el cráneo los pensamientos de mierda de otro. Consejo pro: trágate el golpe psíquico y tu siguiente ataque o Esquiva recibe un empujoncito gratis. Nada dice trabajo en equipo como una migraña.',
    ],
  },
  {
    name: 'King Ghiduckrah',
    kind: 'boss',
    size: 'Gargantuan (8)',
    tags: 'Borough Boss, Reptile',
    slots: '10',
    slotValue: '6',
    level: '42',
    surprise: '15+F',
    evade: '15+F',
    move: '20+S',
    dr: '4',
    stats: {
      str: {
        score: '60',
        mod: '+6',
      },
      int: {
        score: '20',
        mod: '+5',
      },
      con: {
        score: '70',
        mod: '+6',
      },
      dex: {
        score: '28',
        mod: '+5',
      },
      cha: {
        score: '15',
        mod: '+4',
      },
    },
    attacks: [
      {
        name: 'Bite',
        toHit: '16+F',
        damage: '5d8+6 Piercing',
        range: '40ft range',
        effect: 'Major Fail+: Swallowed',
      },
      {
        name: 'Lightning Blast Spell',
        toHit: '16+F',
        damage: '4d6+5 Electric',
        range: '500ft range',
        effect: 'On hit: Shocked',
      },
    ],
    notes:
      "Cold Vulnerability: takes x2 damage from Ice attacks.\nNecktied: attacks aimed at a neck are made with Disadvantage (tell the crawler after they declare). A single attack dealing 4+ HB slots to one neck severs it, and he loses 1 attack for the rest of the combat. The body keeps acting even with all three heads gone.\nPoisonous Blood: a crawler who damages him with a melee attack gains Poisoned (1d8+F Poison per round). Stackable; only a Poison Antidote removes it.\nSwallowed (Bite): on an Evade Major Fail or worse, the target is Swallowed: takes 1d8+F Acid at end of each round, can't be attacked, attacks with Disadvantage vs. 0 DR, and Slashing attacks deal x2 damage.\nLightning Blast Spell: 500ft range; if the target is in water it becomes a 20ft Blast radius. A crawler who loses 3+ HB slots gains Shocked.\n\nFull text: Core Rulebook p. 498.",
    source: 'Core Rulebook p. 498',
    chapter: 'Floor 4 · The Iron Tangle',
    floor: 4,
    description:
      "Three heads, one duck bill, zero fucks given. His Majesty throws lightning half a kilometer and swallows whatever's left twitching. Pro tip: bring ice, go for the necks, and stay the hell out of the water. Oh, and his blood is poison, so maybe don't lick your sword. I know. I know you, though.",
    prevDescriptions: [
      'Three heads, one duck bill, zero chill. His Majesty is a skyscraper-sized lizard who throws lightning half a kilometer and swallows the leftovers. Pro tip: bring ice, aim for the necks, and do not lick your sword afterward. His blood is basically a subscription to poison.',
    ],
    prevNotes: [
      'Special: Cold Vulnerability; Necktied; Poisonous Blood. Full text: Core Rulebook p. 498.',
      "Cold Vulnerability: takes x2 damage from Ice attacks.\nNecktied: attacks aimed at a neck are made with Disadvantage (tell the crawler after they declare). A single attack dealing 4+ HB slots to one neck severs it, and he loses 1 attack for the rest of the combat. The body keeps acting even with all three heads gone.\nPoisonous Blood: a crawler who damages him with a melee attack gains Poisoned (1d8+F Poison per round). Stackable; only a Poison Antidote removes it.\nSwallowed (Bite): on an Evade Major Fail or worse, the target is Swallowed: takes 1d8+F Acid at end of each round, can't be attacked, attacks with Disadvantage vs. 0 DR, and Slashing attacks deal x2 damage.\nLightning Blast Spell: 500ft range; if the target is in water it becomes a 20ft Blast radius. A crawler who loses 3+ HB slots gains Shocked.\n\nFull text: Core Rulebook p. 498.",
    ],
    descriptionEs:
      'Tres cabezas, un pico de pato y le importa todo una puta mierda. Su Majestad lanza rayos a medio kilómetro y se traga lo que quede retorciéndose. Pro-Tip: lleva hielo, ve a por los cuellos y no te metas en el agua ni de coña. Ah, y su sangre es veneno, así que igual no lamas tu espada. Ya. Ya lo sé. Pero es que te conozco.',
    prevDescriptionsEs: [
      'Tres cabezas, un pico de pato y le importa todo una puta mierda. Su Majestad lanza rayos a medio kilómetro y se traga lo que quede retorciéndose. Consejo pro: lleva hielo, ve a por los cuellos y no te metas en el agua ni de coña. Ah, y su sangre es veneno, así que igual no lamas tu espada. Ya. Ya lo sé. Pero es que te conozco.',
    ],
  },
  {
    name: 'Pooka Goal Digger',
    kind: 'mob',
    size: 'Small (2)',
    tags: 'to Huge (6), Shapeshifter',
    slots: '10',
    slotValue: '6',
    level: '40',
    surprise: '15+F',
    evade: '15+F',
    move: '20+S',
    dr: '4',
    stats: {
      str: {
        score: '20',
        mod: '+5',
      },
      int: {
        score: '20',
        mod: '+5',
      },
      con: {
        score: '50',
        mod: '+6',
      },
      dex: {
        score: '20',
        mod: '+5',
      },
      cha: {
        score: '15',
        mod: '+4',
      },
    },
    attacks: [
      {
        name: 'Head Butt',
        toHit: '15+F',
        damage: '5d8+5 Bludgeoning',
        range: '10ft range',
        effect: '',
      },
      {
        name: 'Mind Devour',
        toHit: '15+F',
        damage: '4d6+5 Psychic',
        range: '30ft range',
        effect: 'Major Fail+: Paralyzed',
      },
      {
        name: 'Sweet Song',
        toHit: '15+F',
        damage: 'No damage',
        range: '40ft Burst radius',
        effect: 'On hit: Unconscious; every other round',
      },
      {
        name: 'Vitamin Shot',
        toHit: '15+F',
        damage: '3d6+5 Piercing',
        range: '5ft range,',
        effect: 'On hit: Poisoned',
      },
    ],
    notes:
      'Transformational: when attacked, it transforms into a huge goat.\nSweet Song: hit crawlers gain Unconscious: prone and unable to act until they take damage. Used every other round.\nVitamin Shot: Armor-Piercing.\n\nFull text: Core Rulebook p. 501.',
    source: 'Core Rulebook p. 501',
    chapter: 'Floor 4 · The Iron Tangle',
    floor: 4,
    description:
      'Hey, hun! Ever thought about being your own boss? Say no and this Pooka turns into a goat the size of a delivery van and headbutts your spleen into your lungs. Pro tip: its little lullaby knocks you out cold, so keep a buddy close to slap you awake. Or to sell your stuff.',
    prevDescriptions: [
      'Have you considered being your own boss? This Pooka has, and it would love to tell you about an amazing opportunity. Say no and it becomes a goat the size of a van. Pro tip: its lullaby knocks you out cold, so keep a friend handy to slap you awake.',
    ],
    prevNotes: [
      'Special: Transformational. Full text: Core Rulebook p. 501.',
      'Transformational: when attacked, it transforms into a huge goat.\nSweet Song: hit crawlers gain Unconscious: prone and unable to act until they take damage. Used every other round.\nVitamin Shot: Armor-Piercing.\n\nFull text: Core Rulebook p. 501.',
    ],
    descriptionEs:
      '¡Hola, guapi! ¿Has pensado alguna vez en ser tu propio jefe? Di que no y este Pooka se convierte en una cabra del tamaño de una furgoneta de reparto y te mete el bazo en los pulmones de un cabezazo. Pro-Tip: su nanita te deja fuera de combate, así que ten a un colega cerca para que te despierte a hostias. O para que venda tus cosas.',
    prevDescriptionsEs: [
      '¡Hola, guapi! ¿Has pensado alguna vez en ser tu propio jefe? Di que no y este Pooka se convierte en una cabra del tamaño de una furgoneta de reparto y te mete el bazo en los pulmones de un cabezazo. Consejo pro: su nanita te deja fuera de combate, así que ten a un colega cerca para que te despierte a hostias. O para que venda tus cosas.',
    ],
  },
  {
    name: 'Clurichaun Aspirant',
    kind: 'mob',
    size: 'Petite (3)',
    tags: 'Fairy',
    slots: '10',
    slotValue: '4',
    level: '30',
    surprise: '15+F',
    evade: '15+F',
    move: '20+S',
    dr: '4',
    stats: {
      str: {
        score: '13',
        mod: '+4',
      },
      int: {
        score: '25',
        mod: '+5',
      },
      con: {
        score: '12',
        mod: '+4',
      },
      dex: {
        score: '21',
        mod: '+5',
      },
      cha: {
        score: '24',
        mod: '+5',
      },
    },
    attacks: [
      {
        name: 'Cough',
        toHit: '15+F',
        damage: '5d8 Poison',
        range: '10ft range Sneeze 15+F to hit, No damage, 15ft Cone',
        effect: 'On hit: Poisoned',
      },
    ],
    notes:
      'Promoter: peddles Rev-Up moonshine (addictive). Drinker → Con Stat Check; Fail = Shit-Faced.\nSneeze: extra attack hidden in the Cough line; 15ft Cone, 15+F to hit, deals no damage.\n\nFull text: Core Rulebook p. 502.',
    source: 'Core Rulebook p. 502',
    chapter: 'Floor 4 · The Iron Tangle',
    floor: 4,
    description:
      'Tiny fairy, enormous sales quota, the respiratory hygiene of a truck-stop toilet. It coughs poison on you until you join its downline, then offers you moonshine to wash it down. Pro tip: the free sample makes you shit-faced. The viewers fucking love a shit-faced crawler.',
    prevDescriptions: [
      'Tiny fairy, huge sales quota. The Aspirant wants you on its downline and in its moonshine, and it will cough on you until you sign. Pro tip: the free sample is never free. The viewers, however, adore a crawler who says yes.',
    ],
    prevNotes: [
      'Special: Promoter. Full text: Core Rulebook p. 502.',
      'Promoter: peddles Rev-Up moonshine (addictive). Drinker → Con Stat Check; Fail = Shit-Faced.\nSneeze: extra attack hidden in the Cough line; 15ft Cone, 15+F to hit, deals no damage.\n\nFull text: Core Rulebook p. 502.',
    ],
    descriptionEs:
      'Hada diminuta, cuota de ventas enorme y la higiene respiratoria del váter de un área de servicio. Te tose veneno encima hasta que te unes a su red de afiliados, y luego te ofrece aguardiente casero para pasarlo mejor. Pro-Tip: la muestra gratuita te deja Shit-Faced. A los espectadores les encanta de la hostia un crawler Shit-Faced.',
    prevDescriptionsEs: [
      'Hada diminuta, cuota de ventas enorme y la higiene respiratoria del váter de un área de servicio. Te tose veneno encima hasta que te unes a su red de afiliados, y luego te ofrece aguardiente casero para pasarlo mejor. Consejo pro: la muestra gratuita te deja Shit-Faced. A los espectadores les encanta de la hostia un crawler Shit-Faced.',
    ],
  },
  {
    name: 'Krakaren Crotch Dumpling',
    kind: 'mob',
    size: 'Tiny (1)',
    tags: 'Aberration',
    slots: '1',
    slotValue: '1',
    level: '1',
    surprise: '11+F',
    evade: '11+F',
    move: '5',
    dr: '1',
    stats: {
      str: {
        score: '2',
        mod: '+1',
      },
      int: {
        score: '1',
        mod: '+1',
      },
      con: {
        score: '2',
        mod: '+1',
      },
      dex: {
        score: '2',
        mod: '+1',
      },
      cha: {
        score: '1',
        mod: '+1',
      },
    },
    attacks: [
      {
        name: 'Bore',
        toHit: '11+F',
        damage: '1d2+1 Piercing',
        range: '5ft range',
        effect: 'On hit: Poisoned',
      },
    ],
    notes:
      'Fast Growth: at the end of each combat round it doubles in size. Each growth adds 1 HB slot and +1 to its Con Mod (for HB slots) and to its damage.\n\nFull text: Core Rulebook p. 502.',
    source: 'Core Rulebook p. 502',
    chapter: 'Floor 4 · The Iron Tangle',
    floor: 4,
    description:
      'Yes, the Crotch Dumpling. No, I will not explain the name, and the sponsors begged me not to show where it lives. Level 1, harmless, adorable. Pro tip: it doubles in size every single round, so squish it now. Waiting is how you end up with a very uncomfortable level 1 problem.',
    prevDescriptions: [
      "Starts as a level 1 nuisance the size of a dumpling. Give it a few rounds and it's a level 1 nuisance the size of your regrets. Pro tip: it grows every single round, so kill it now. Procrastinators make great ratings.",
    ],
    prevNotes: [
      'Special: Fast Growth. Full text: Core Rulebook p. 502.',
      'Fast Growth: at the end of each combat round it doubles in size. Each growth adds 1 HB slot and +1 to its Con Mod (for HB slots) and to its damage.\n\nFull text: Core Rulebook p. 502.',
    ],
    descriptionEs:
      'Sí, el Crotch Dumpling. No, no pienso explicar el nombre, y los patrocinadores me han suplicado que no enseñe dónde vive. Nivel 1, inofensivo, adorable. Pro-Tip: dobla su tamaño cada ronda, así que aplástalo ya. Esperar es la forma de acabar con un problema de nivel 1 muy incómodo.',
    prevDescriptionsEs: [
      'Sí, el Crotch Dumpling. No, no pienso explicar el nombre, y los patrocinadores me han suplicado que no enseñe dónde vive. Nivel 1, inofensivo, adorable. Consejo pro: dobla su tamaño cada ronda, así que aplástalo ya. Esperar es la forma de acabar con un problema de nivel 1 muy incómodo.',
    ],
  },
  {
    name: 'Jikininki Custodial Consultant',
    kind: 'mob',
    size: 'Medium (4)',
    tags: 'Undead',
    slots: '10',
    slotValue: '6',
    level: '35',
    surprise: '14+F',
    evade: '15+F',
    move: '25+S',
    dr: '4',
    stats: {
      str: {
        score: '20',
        mod: '+5',
      },
      int: {
        score: '10',
        mod: '+4',
      },
      con: {
        score: '50',
        mod: '+6',
      },
      dex: {
        score: '20',
        mod: '+5',
      },
      cha: {
        score: '10',
        mod: '+4',
      },
    },
    attacks: [
      {
        name: 'Broom',
        toHit: '15+F',
        damage: '5d8+5 Bludgeoning',
        range: '10ft range',
        effect: '',
      },
      {
        name: 'Bite',
        toHit: '15+F',
        damage: '5d6+5 Piercing',
        range: '5ft range',
        effect: 'Major Fail+: Poisoned',
      },
      {
        name: 'Sweep',
        toHit: '15+F',
        damage: '5d4+5 Bludgeoning',
        range: '10ft range',
        effect: 'Special effect',
      },
    ],
    notes:
      'Blood Sense: crawler has Blood Trail → Disadvantage on Stealth, Ambush, Social Skill Checks vs Jikininki.\nJanitor Mob: Floor 4 cleanup crew, corpses top priority; turns hostile only if provoked or a crawler has Blood Trail.\nSweep: on hit → 10ft push.\n\nFull text: Core Rulebook p. 503.',
    source: 'Core Rulebook p. 503',
    chapter: 'Floor 4 · The Iron Tangle',
    floor: 4,
    description:
      "Every dungeon needs a cleaning crew, and ours eats the mess. The Jikininki will mop right past you while chewing on your best friend's leftovers. Pro tip: stop bleeding. Once it smells a Blood Trail, you're not a bystander anymore, you're a spill, and it fucking hates spills.",
    prevDescriptions: [
      'Every dungeon needs custodial staff, and ours happens to eat the mess. The Jikininki will happily ignore you while mopping up your dead friends. Pro tip: stop bleeding. The moment it smells a Blood Trail, you graduate from bystander to spill.',
    ],
    prevNotes: [
      'Special: Blood Sense; Janitor Mob. Full text: Core Rulebook p. 503.',
      'Blood Sense: crawler has Blood Trail → Disadvantage on Stealth, Ambush, Social Skill Checks vs Jikininki.\nJanitor Mob: Floor 4 cleanup crew, corpses top priority; turns hostile only if provoked or a crawler has Blood Trail.\nSweep: on hit → 10ft push.\n\nFull text: Core Rulebook p. 503.',
    ],
    descriptionEs:
      'Toda mazmorra necesita un equipo de limpieza, y el nuestro se come el desastre. El Jikininki pasará la fregona a tu lado mientras mastica los restos de tu mejor amigo. Pro-Tip: deja de sangrar. En cuanto huele un Blood Trail, ya no eres un transeúnte, eres una mancha, y odia las putas manchas.',
    prevDescriptionsEs: [
      'Toda mazmorra necesita un equipo de limpieza, y el nuestro se come el desastre. El Jikininki pasará la fregona a tu lado mientras mastica los restos de tu mejor amigo. Consejo pro: deja de sangrar. En cuanto huele un Blood Trail, ya no eres un transeúnte, eres una mancha, y odia las putas manchas.',
    ],
  },
  {
    name: 'Pooka Harmacist',
    kind: 'mob',
    size: 'Small (2)',
    tags: 'to Huge (6), Shapeshifter',
    slots: '10',
    slotValue: '6',
    level: '50',
    surprise: '15+F',
    evade: '15+F',
    move: '20+S',
    dr: '4',
    stats: {
      str: {
        score: '25',
        mod: '+5',
      },
      int: {
        score: '25',
        mod: '+5',
      },
      con: {
        score: '55',
        mod: '+6',
      },
      dex: {
        score: '25',
        mod: '+5',
      },
      cha: {
        score: '25',
        mod: '+5',
      },
    },
    attacks: [
      {
        name: 'Head Butt',
        toHit: '15+F',
        damage: '5d8+5 Bludgeoning',
        range: '10ft range',
        effect: '',
      },
      {
        name: 'Psychedelics',
        toHit: '15+F',
        damage: '4d6 Poison',
        range: '5ft range',
        effect: 'On hit: Shit-Faced',
      },
      {
        name: 'Vitamin Shot',
        toHit: '15+F',
        damage: '3d6+5 Piercing',
        range: '5ft range,',
        effect: 'On hit: Poisoned',
      },
    ],
    notes:
      'Transformational: when attacked, it transforms into a huge goat.\nVitamin Shot: Armor-Piercing.\n\nFull text: Core Rulebook p. 503.',
    source: 'Core Rulebook p. 503',
    chapter: 'Floor 4 · The Iron Tangle',
    floor: 4,
    description:
      'Side effects may include hallucinations, poisoning, and being headbutted into paste by a surprise goat. The Harmacist is an unlicensed wellness guru with a needle full of vitamins that goes straight through your armor. Pro tip: hit it and it goes full goat. Plan accordingly, dipshit.',
    prevDescriptions: [
      "Side effects may include hallucinations, poisoning, and being headbutted by a sudden enormous goat. The Harmacist dispenses unlicensed wellness to anyone within five feet. Pro tip: hit it and it goes full goat, so decide whether that's a plan or a mistake.",
    ],
    prevNotes: [
      'Special: Transformational. Full text: Core Rulebook p. 503.',
      'Transformational: when attacked, it transforms into a huge goat.\nVitamin Shot: Armor-Piercing.\n\nFull text: Core Rulebook p. 503.',
    ],
    descriptionEs:
      'Los efectos secundarios pueden incluir alucinaciones, envenenamiento y acabar hecho papilla a cabezazos por una cabra sorpresa. El Harmacist es un gurú del bienestar sin licencia con una jeringa llena de vitaminas que atraviesa tu armadura. Pro-Tip: si le pegas, se pone en modo cabra total. Planifica en consecuencia, gilipollas.',
    prevDescriptionsEs: [
      'Los efectos secundarios pueden incluir alucinaciones, envenenamiento y acabar hecho papilla a cabezazos por una cabra sorpresa. El Harmacist es un gurú del bienestar sin licencia con una jeringa llena de vitaminas que atraviesa tu armadura. Consejo pro: si le pegas, se pone en modo cabra total. Planifica en consecuencia, gilipollas.',
    ],
  },
  {
    name: 'Clurichaun Aspirant Super Duper Star',
    kind: 'mob',
    size: 'Petite (3)',
    tags: 'Fairy',
    slots: '10',
    slotValue: '5',
    level: '55',
    surprise: '16+F',
    evade: '16+F',
    move: '20+S',
    dr: '4',
    stats: {
      str: {
        score: '20',
        mod: '+5',
      },
      int: {
        score: '50',
        mod: '+6',
      },
      con: {
        score: '30',
        mod: '+5',
      },
      dex: {
        score: '50',
        mod: '+6',
      },
      cha: {
        score: '20',
        mod: '+5',
      },
    },
    attacks: [
      {
        name: 'Cuss',
        toHit: '16+F',
        damage: '3d8+5 Sonic',
        range: '15ft Burst radius',
        effect: 'On hit: Terrified',
      },
      {
        name: 'Kiss',
        toHit: '16+F',
        damage: '5d8+5 Poison',
        range: '5ft range',
        effect: 'Major Fail+: Taint',
      },
      {
        name: 'Stomp',
        toHit: '15+F',
        damage: '4d6+5 Bludgeoning',
        range: '15ft Burst radius',
        effect: 'On hit: Take Down',
      },
    ],
    notes:
      'Promoter: peddles Rev-Up moonshine (addictive). Drinker → Con Stat Check; Fail = Shit-Faced.\nWinner Winner Chicken Dinner: its opening Attack or Skill Check of a combat is at Advantage.\n\nFull text: Core Rulebook p. 504.',
    source: 'Core Rulebook p. 504',
    chapter: 'Floor 4 · The Iron Tangle',
    floor: 4,
    description:
      'It climbed the pyramid, crushed its downline, and got a sparkly new title. Now it cusses, stomps, and plants poison kisses with the confidence of an asshole who never read the fine print. Pro tip: its opening move always lands harder. Duck first, network later, vomit whenever.',
    prevDescriptions: [
      'The Aspirant made it to the top of the pyramid and got a sparkly new title to prove it. Now it cusses, kisses, and stomps with the confidence of someone who has never read the fine print. Pro tip: its opening move always lands harder. Duck first, network later.',
    ],
    prevNotes: [
      'Special: Promoter; Winner Winner Chicken Dinner. Full text: Core Rulebook p. 504.',
      'Promoter: peddles Rev-Up moonshine (addictive). Drinker → Con Stat Check; Fail = Shit-Faced.\nWinner Winner Chicken Dinner: its opening Attack or Skill Check of a combat is at Advantage.\n\nFull text: Core Rulebook p. 504.',
    ],
    descriptionEs:
      'Ha escalado la pirámide, ha aplastado a sus afiliados y se ha ganado un título nuevo y brillante. Ahora suelta tacos, pisotea y planta besos venenosos con la seguridad de un capullo que nunca se leyó la letra pequeña. Pro-Tip: su movimiento de apertura siempre pega más fuerte. Primero agáchate, luego haz networking y vomita cuando te apetezca.',
    prevDescriptionsEs: [
      'Ha escalado la pirámide, ha aplastado a sus afiliados y se ha ganado un título nuevo y brillante. Ahora suelta tacos, pisotea y planta besos venenosos con la seguridad de un capullo que nunca se leyó la letra pequeña. Consejo pro: su movimiento de apertura siempre pega más fuerte. Primero agáchate, luego haz networking y vomita cuando te apetezca.',
    ],
  },
  {
    name: 'Krakaren Clone (p. 508)',
    kind: 'boss',
    size: 'Huge (6)',
    tags: 'Borough Boss, Aberration',
    slots: '10',
    slotValue: '8',
    level: '65',
    surprise: '13+F',
    evade: '16+F',
    move: '20+S',
    dr: '4',
    stats: {
      str: {
        score: '59',
        mod: '+6',
      },
      int: {
        score: '8',
        mod: '+3',
      },
      con: {
        score: '157',
        mod: '+8',
      },
      dex: {
        score: '55',
        mod: '+6',
      },
      cha: {
        score: '6',
        mod: '+3',
      },
    },
    attacks: [
      {
        name: 'Mega Munch',
        toHit: '16+F',
        damage: '7d10+6 Piercing',
        range: '10ft range',
        effect: '',
      },
      {
        name: 'Acidic Tentacles',
        toHit: '16+F',
        damage: '5d8+6 Acid',
        range: '30ft range',
        effect: 'On hit: Held',
      },
      {
        name: 'Pyramid Pitch',
        toHit: '13+F',
        damage: '4d6+3 Psychic',
        range: '60ft range',
        effect: 'Special effect',
      },
      {
        name: 'Spit Spray',
        toHit: '16+F',
        damage: '6d8+3 Poison',
        range: '50ft range',
        effect: 'Major Fail+: Taint',
      },
      {
        name: 'Unnerving Screams',
        toHit: '16+F',
        damage: '4d8 Sonic',
        range: '60ft Burst',
        effect: 'Queasy; every other round',
      },
    ],
    notes:
      'Decoupling: caboose separation = 2 rounds with 1 crawler, 1 round with 2. Crawlers working on it: Evade at Disadvantage, Boss targets them first. Finished → caboose rolls free.\nWhiteboards: 2 Actions spent wiping his boards → Boss −1 Action for the rest of combat. Secret: one use only.\nBad Hair Day: any Amazing Success or better → every Held Debuff ends.\nFire Vulnerability: Fire ×2.\nLightning Immunity: Electric does nothing.\nPsychic Immunity: Psychic deals 0 damage but inflicts Stunned.\nSoft Goey Center: Piercing ×2.\nTough Enough: DR ×2 vs Ice/Force.\nPyramid Pitch: target rolls free Cha Stat Check vs the attack; Fail → its next Action targets an ally.\nUnnerving Screams: 60ft Burst; Evade failed → Queasy. Every other round only.\n\nFull text: Core Rulebook p. 508.',
    source: 'Core Rulebook p. 508',
    chapter: 'Floor 4 · The Iron Tangle',
    floor: 4,
    description:
      'A tentacled middle manager living in a subway car, screaming pyramid schemes while it melts you with acid. Five attacks, one business plan, flawless hair. Pro tip: fire and pointy shit work wonders, and wiping its whiteboards ruins its whole damn day. Do not buy in. I mean it. I already did.',
    prevDescriptions: [
      "A tentacled executive who lives in a subway car and pitches pyramid schemes at a scream. Five attacks, one business plan, flawless hair. Pro tip: fire and pointy things work wonders, and messing up that hairdo makes it drop whoever it's squeezing. Just don't buy in.",
    ],
    prevNotes: [
      'Special: Decoupling; Whiteboards; Bad Hair Day; Fire Vulnerability; Lightning Immunity; Psychic Immunity; Soft Goey Center; Tough Enough. Full text: Core Rulebook p. 508.',
      'Decoupling: caboose separation = 2 rounds with 1 crawler, 1 round with 2. Crawlers working on it: Evade at Disadvantage, Boss targets them first. Finished → caboose rolls free.\nWhiteboards: 2 Actions spent wiping his boards → Boss −1 Action for the rest of combat. Secret: one use only.\nBad Hair Day: any Amazing Success or better → every Held Debuff ends.\nFire Vulnerability: Fire ×2.\nLightning Immunity: Electric does nothing.\nPsychic Immunity: Psychic deals 0 damage but inflicts Stunned.\nSoft Goey Center: Piercing ×2.\nTough Enough: DR ×2 vs Ice/Force.\nPyramid Pitch: target rolls free Cha Stat Check vs the attack; Fail → its next Action targets an ally.\nUnnerving Screams: 60ft Burst; Evade failed → Queasy. Every other round only.\n\nFull text: Core Rulebook p. 508.',
    ],
    descriptionEs:
      'Un mando intermedio con tentáculos que vive en un vagón de metro, gritando esquemas piramidales mientras te derrite con ácido. Cinco ataques, un plan de negocio y un pelo impecable. Pro-Tip: el fuego y cualquier mierda puntiaguda hacen maravillas, y borrarle las pizarras le jode todo el puto día. No invirtáis. Lo digo en serio. Yo ya lo hice.',
    prevDescriptionsEs: [
      'Un mando intermedio con tentáculos que vive en un vagón de metro, gritando esquemas piramidales mientras te derrite con ácido. Cinco ataques, un plan de negocio y un pelo impecable. Consejo pro: el fuego y cualquier mierda puntiaguda hacen maravillas, y borrarle las pizarras le jode todo el puto día. No invirtáis. Lo digo en serio. Yo ya lo hice.',
    ],
  },
  {
    name: 'Graffiti Mimic',
    kind: 'mob',
    size: 'Large (5)',
    tags: 'Aberration, Mimic',
    slots: '10',
    slotValue: '6',
    level: '50',
    surprise: '15+F',
    evade: '15+F',
    move: '20+S',
    dr: '4',
    stats: {
      str: {
        score: '52',
        mod: '+6',
      },
      int: {
        score: '23',
        mod: '+5',
      },
      con: {
        score: '51',
        mod: '+6',
      },
      dex: {
        score: '24',
        mod: '+5',
      },
      cha: {
        score: '5',
        mod: '+2',
      },
    },
    attacks: [
      {
        name: 'Bite',
        toHit: '16+F',
        damage: '5d8+6 Piercing',
        range: '10ft range',
        effect: '',
      },
      {
        name: 'Acid Spit',
        toHit: '15+F',
        damage: '4d6 Acid',
        range: '15ft range',
        effect: 'On hit: Burned',
      },
      {
        name: 'Psychic Smother',
        toHit: '15+F',
        damage: '5d8+5 Psychic',
        range: '20ft range',
        effect: 'Major Fail+: Stunned',
      },
    ],
    notes:
      'Stealthy: unless surprised, it attacks with Advantage in the first round of combat.\n\nFull text: Core Rulebook p. 511.',
    source: 'Core Rulebook p. 511',
    chapter: 'Floor 4 · The Iron Tangle',
    floor: 4,
    description:
      "That tag on the wall isn't art, it's a mouth. The Graffiti Mimic poses as vandalism until some idiot leans on it, then bites, spits acid, and sits on your brain. Pro tip: get the drop on it, or it gets the drop on you. First-round kills are my favorite commercial break.",
    prevDescriptions: [
      "That tag on the wall isn't art, it's lunch. The Graffiti Mimic spends its days pretending to be vandalism, then bites, spits acid, and smothers your brain. Pro tip: if the mural looks hungry, it is. Get the drop on it or it gets the drop on you.",
    ],
    prevNotes: [
      'Special: Stealthy. Full text: Core Rulebook p. 511.',
      'Stealthy: unless surprised, it attacks with Advantage in the first round of combat.\n\nFull text: Core Rulebook p. 511.',
    ],
    descriptionEs:
      'Esa firma en la pared no es arte, es una boca. El Graffiti Mimic se hace pasar por vandalismo hasta que algún idiota se apoya en él, y entonces muerde, escupe ácido y se te sienta en el cerebro. Pro-Tip: píllalo desprevenido, o será él quien te pille a ti. Las muertes en la primera ronda son mi pausa publicitaria favorita.',
    prevDescriptionsEs: [
      'Esa firma en la pared no es arte, es una boca. El Graffiti Mimic se hace pasar por vandalismo hasta que algún idiota se apoya en él, y entonces muerde, escupe ácido y se te sienta en el cerebro. Consejo pro: píllalo desprevenido, o será él quien te pille a ti. Las muertes en la primera ronda son mi pausa publicitaria favorita.',
    ],
  },
  {
    name: 'Gristle Gang Member',
    kind: 'mob',
    size: 'Medium (4)',
    tags: 'Undead',
    slots: '10',
    slotValue: '6',
    level: '35',
    surprise: '14+F',
    evade: '15+F',
    move: '20+S',
    dr: '4',
    stats: {
      str: {
        score: '20',
        mod: '+5',
      },
      int: {
        score: '15',
        mod: '+4',
      },
      con: {
        score: '50',
        mod: '+6',
      },
      dex: {
        score: '20',
        mod: '+5',
      },
      cha: {
        score: '5',
        mod: '+2',
      },
    },
    attacks: [
      {
        name: 'Gross Solids',
        toHit: '15+F',
        damage: '5d6+5 Bludgeoning',
        range: '10ft range',
        effect: '',
      },
      {
        name: 'Gristle Grapple',
        toHit: '15+F',
        damage: '4d6+5 Bludgeoning',
        range: '5ft range',
        effect: 'Major Fail+: Held',
      },
      {
        name: 'Gross Liquids',
        toHit: '15+F',
        damage: '4d6 Acid',
        range: '20ft range',
        effect: 'On hit: Burned',
      },
    ],
    notes: 'Oozy: can squeeze through openings of size Small (2) and larger.\n\nFull text: Core Rulebook p. 511.',
    source: 'Core Rulebook p. 511',
    chapter: 'Floor 4 · The Iron Tangle',
    floor: 4,
    description:
      "Part zombie, part gravy, all gang. The Gristle crew hurls solids, sprays liquids, and grapples you in ways that'll need a long shower and a longer therapy bill. Pro tip: locking the door won't help. Anything a Small crawler fits through, these slimy fucks can pour through too.",
    prevDescriptions: [
      "Part zombie, part gravy, all gang. The Gristle crew fires solids, liquids, and a grapple nobody asked for. Pro tip: closing the door won't help. If it's big enough for a Small crawler, it's big enough for these guys to pour through.",
    ],
    prevNotes: [
      'Special: Oozy. Full text: Core Rulebook p. 511.',
      'Oozy: can squeeze through openings of size Small (2) and larger.\n\nFull text: Core Rulebook p. 511.',
    ],
    descriptionEs:
      'Parte zombi, parte salsa de carne, todo pandilla. La banda Gristle lanza sólidos, rocía líquidos y te agarra de formas que requerirán una ducha larga y una factura de terapia aún más larga. Pro-Tip: cerrar la puerta con llave no servirá. Por cualquier hueco por el que quepa un crawler Pequeño, estos cabrones viscosos también pueden colarse.',
    prevDescriptionsEs: [
      'Parte zombi, parte salsa de carne, todo pandilla. La banda Gristle lanza sólidos, rocía líquidos y te agarra de formas que requerirán una ducha larga y una factura de terapia aún más larga. Consejo pro: cerrar la puerta con llave no servirá. Por cualquier hueco por el que quepa un crawler Pequeño, estos cabrones viscosos también pueden colarse.',
    ],
  },
  {
    name: 'Lobe Ganger',
    kind: 'mob',
    size: 'Medium (4)',
    tags: 'Aberration',
    slots: '10',
    slotValue: '4',
    level: '40',
    surprise: '16+F',
    evade: '15+F',
    move: '15+S',
    dr: '2',
    stats: {
      str: {
        score: '25',
        mod: '+5',
      },
      int: {
        score: '55',
        mod: '+6',
      },
      con: {
        score: '15',
        mod: '+4',
      },
      dex: {
        score: '25',
        mod: '+5',
      },
      cha: {
        score: '5',
        mod: '+2',
      },
    },
    attacks: [
      {
        name: 'Mind Blast Spell',
        toHit: '16+F',
        damage: '5d8 Psychic',
        range: '60ft range, 5ft Blast radius',
        effect: '',
      },
      {
        name: 'Unsightly',
        toHit: '15+F',
        damage: '4d6 Psychic',
        range: '10ft Burst radius',
        effect: 'Major Fail+: Terrified',
      },
    ],
    notes: 'Full text: Core Rulebook p. 512.',
    source: 'Core Rulebook p. 512',
    chapter: 'Floor 4 · The Iron Tangle',
    floor: 4,
    description:
      "A brain that skipped leg day and every other day. The Lobe Ganger blasts minds from sixty feet and is so hideous up close your eyes try to leave without you. Pro tip: spread out. Losing one crawler's sanity is way cheaper than five, and the ratings are about the same.",
    prevDescriptions: [
      "Imagine a brain that went to the gym and forgot everything else. The Lobe Ganger blasts minds from sixty feet away and looks so bad up close you may flee screaming. Pro tip: spread out. It's cheaper to lose one crawler's sanity than five.",
    ],
    prevNotes: ['Full text: Core Rulebook p. 512.'],
    descriptionEs:
      'Un cerebro que se saltó el día de pierna y todos los demás. El Lobe Ganger revienta mentes desde sesenta pies y de cerca es tan espantoso que tus ojos intentan largarse sin ti. Pro-Tip: separaos. Perder la cordura de un crawler sale mucho más barato que la de cinco, y la audiencia es más o menos la misma.',
    prevDescriptionsEs: [
      'Un cerebro que se saltó el día de pierna y todos los demás. El Lobe Ganger revienta mentes desde sesenta pies y de cerca es tan espantoso que tus ojos intentan largarse sin ti. Consejo pro: separaos. Perder la cordura de un crawler sale mucho más barato que la de cinco, y la audiencia es más o menos la misma.',
    ],
  },
  {
    name: 'Trash Knight',
    kind: 'mob',
    size: 'Medium (4)',
    tags: 'Amalgamation',
    slots: '10',
    slotValue: '6',
    level: '35',
    surprise: '14+F',
    evade: '14+F',
    move: '20+S',
    dr: '4',
    stats: {
      str: {
        score: '20',
        mod: '+5',
      },
      int: {
        score: '10',
        mod: '+4',
      },
      con: {
        score: '50',
        mod: '+6',
      },
      dex: {
        score: '10',
        mod: '+4',
      },
      cha: {
        score: '10',
        mod: '+4',
      },
    },
    attacks: [
      {
        name: 'Rebar Sword',
        toHit: '15+F',
        damage: '5d8+5 Slashing',
        range: '5ft range',
        effect: '',
      },
      {
        name: 'Trash Lance',
        toHit: '15+F',
        damage: '4d12 Piercing',
        range: '10ft range',
        effect: 'On hit: Staggered',
      },
    ],
    notes:
      'Mounted: while riding its flying ostrich it moves through the air as if on the ground, and its Move becomes 30.\nTrash Lance: can only be used while Mounted.\n\nFull text: Core Rulebook p. 513.',
    source: 'Core Rulebook p. 513',
    chapter: 'Floor 4 · The Iron Tangle',
    floor: 4,
    description:
      "Sir Garbage of House Dumpster rides forth on a flying ostrich, rebar sword held high and smelling like a landfill's armpit. Chivalry isn't dead, it's just been recycled. Pro tip: the lance only comes out while he's mounted. Ground the bird and he's just a shitty guy with a stick.",
    prevDescriptions: [
      "Sir Garbage of House Dumpster rides forth on a flying ostrich, rebar blade held high. Chivalry isn't dead, it's just been recycled. Pro tip: the lance only comes out while he's in the saddle, so ground the bird and the joust is over.",
    ],
    prevNotes: [
      'Special: Mounted. Full text: Core Rulebook p. 513.',
      'Mounted: while riding its flying ostrich it moves through the air as if on the ground, and its Move becomes 30.\nTrash Lance: can only be used while Mounted.\n\nFull text: Core Rulebook p. 513.',
    ],
    descriptionEs:
      'Sir Basura de la Casa Contenedor cabalga sobre un avestruz volador, espada de ferralla en alto y oliendo a sobaco de vertedero. La caballerosidad no ha muerto, solo la han reciclado. Pro-Tip: la lanza solo sale mientras va montado. Derriba al pájaro y no es más que un tío de mierda con un palo.',
    prevDescriptionsEs: [
      'Sir Basura de la Casa Contenedor cabalga sobre un avestruz volador, espada de ferralla en alto y oliendo a sobaco de vertedero. La caballerosidad no ha muerto, solo la han reciclado. Consejo pro: la lanza solo sale mientras va montado. Derriba al pájaro y no es más que un tío de mierda con un palo.',
    ],
  },
  {
    name: 'Gelatinous Boob',
    kind: 'mob',
    size: 'Huge (6)',
    tags: 'Aberration',
    slots: '10',
    slotValue: '6',
    level: '40',
    surprise: '14+F',
    evade: '15+F',
    move: '20+S',
    dr: '4',
    stats: {
      str: {
        score: '20',
        mod: '+5',
      },
      int: {
        score: '15',
        mod: '+4',
      },
      con: {
        score: '50',
        mod: '+6',
      },
      dex: {
        score: '20',
        mod: '+5',
      },
      cha: {
        score: '20',
        mod: '+5',
      },
    },
    attacks: [
      {
        name: 'Engulf',
        toHit: '15+F',
        damage: '4d6+5 Acid',
        range: '5ft range',
        effect: 'On hit: Swallowed',
      },
    ],
    notes:
      "Oozy: fits through gaps of Small (2) or bigger.\nPermeable: Piercing and Slashing do nothing.\nEngulf: on hit → Swallowed: untargetable, 1d8+F Acid each round's end, attacks at Disadvantage vs 0 DR. Amazing Success or better against the Boob, or its death → all Swallowed crawlers released.\n\nFull text: Core Rulebook p. 513.",
    source: 'Core Rulebook p. 513',
    chapter: 'Floor 4 · The Iron Tangle',
    floor: 4,
    description:
      "Yes, that's its real name. No, I'm not taking questions, you perverts. It's a Huge jiggly acid blob that swallows crawlers whole and digests them slow. Pro tip: blades and arrows pass right through, so bring a hammer, a spell, or a buddy inside who can land a hell of a hit.",
    prevDescriptions: [
      "Yes, that's its name. No, I will not be taking questions. It's a Huge, jiggling acid blob that swallows crawlers whole. Pro tip: swords and arrows pass right through, so bring a hammer, a spell, or a friend inside who hits really, really well.",
    ],
    prevNotes: [
      'Special: Oozy; Permeable. Full text: Core Rulebook p. 513.',
      "Oozy: fits through gaps of Small (2) or bigger.\nPermeable: Piercing and Slashing do nothing.\nEngulf: on hit → Swallowed: untargetable, 1d8+F Acid each round's end, attacks at Disadvantage vs 0 DR. Amazing Success or better against the Boob, or its death → all Swallowed crawlers released.\n\nFull text: Core Rulebook p. 513.",
    ],
    descriptionEs:
      'Sí, ese es su nombre real. No, no acepto preguntas, pervertidos. Es una masa gelatinosa de ácido Enorme que se traga a los crawlers enteros y los digiere despacio. Pro-Tip: las hojas y las flechas la atraviesan sin más, así que trae un martillo, un hechizo o un colega dentro que sepa meter un golpe de la hostia.',
    prevDescriptionsEs: [
      'Sí, ese es su nombre real. No, no acepto preguntas, pervertidos. Es una masa gelatinosa de ácido Enorme que se traga a los crawlers enteros y los digiere despacio. Consejo pro: las hojas y las flechas la atraviesan sin más, así que trae un martillo, un hechizo o un colega dentro que sepa meter un golpe de la hostia.',
    ],
  },
  {
    name: 'Tape Head',
    kind: 'mob',
    size: 'Small (2)',
    tags: 'Construct',
    slots: '10',
    slotValue: '5',
    level: '35',
    surprise: '15+F',
    evade: '16+F',
    move: '15+S',
    dr: '4',
    stats: {
      str: {
        score: '10',
        mod: '+4',
      },
      int: {
        score: '20',
        mod: '+5',
      },
      con: {
        score: '20',
        mod: '+5',
      },
      dex: {
        score: '50',
        mod: '+6',
      },
      cha: {
        score: '10',
        mod: '+4',
      },
    },
    attacks: [
      {
        name: 'Terrible Tunes',
        toHit: '16+F',
        damage: '5d6 Sonic',
        range: '20ft Cone',
        effect: 'Major Fail+: Sepsis',
      },
    ],
    notes: 'Full text: Core Rulebook p. 514.',
    source: 'Core Rulebook p. 514',
    chapter: 'Floor 4 · The Iron Tangle',
    floor: 4,
    description:
      'Remember mixtapes? This Construct does, and it wants your ears to bleed through every goddamn track. Pro tip: stay out of the cone. Nobody on this floor deserves the extended remix, except maybe you. Especially you, actually.',
    prevDescriptions: [
      'Remember mixtapes? This Construct does, and it wants you to suffer through every track. Its terrible tunes are loud enough to get infected. Pro tip: stay out of the cone. Nobody needs to hear the extended remix.',
    ],
    prevNotes: ['Full text: Core Rulebook p. 514.'],
    descriptionEs:
      '¿Te acuerdas de las cintas recopilatorias? Este Constructo sí, y quiere que te sangren los oídos con cada puta canción. Pro-Tip: no te metas en el cono. Nadie en este piso se merece el remix extendido, salvo quizá tú. Sobre todo tú, de hecho.',
    prevDescriptionsEs: [
      '¿Te acuerdas de las cintas recopilatorias? Este Constructo sí, y quiere que te sangren los oídos con cada puta canción. Consejo pro: no te metas en el cono. Nadie en este piso se merece el remix extendido, salvo quizá tú. Sobre todo tú, de hecho.',
    ],
  },
  {
    name: 'Blaster Master',
    kind: 'npc',
    size: 'Small (2)',
    tags: 'NPC, Construct',
    slots: '10',
    slotValue: '5',
    level: '20',
    surprise: '15+F',
    evade: '14+F',
    move: '10+S',
    dr: '4',
    stats: {
      str: {
        score: '10',
        mod: '+4',
      },
      int: {
        score: '20',
        mod: '+5',
      },
      con: {
        score: '20',
        mod: '+5',
      },
      dex: {
        score: '10',
        mod: '+4',
      },
      cha: {
        score: '6',
        mod: '+3',
      },
    },
    attacks: [
      {
        name: 'Rock On',
        toHit: '14+F',
        damage: '3d4 Sonic',
        range: '15ft Burst range',
        effect: 'Special effect',
      },
    ],
    notes: 'Full text: Core Rulebook p. 514.',
    source: 'Core Rulebook p. 514',
    chapter: 'Floor 4 · The Iron Tangle',
    floor: 4,
    description:
      "A pint-sized boombox with stadium-tour delusions and a garage band's talent. One riff and everyone nearby forgets how their limbs work. Pro tip: it's only level 20. If you can't beat this little shit, please die quickly so we can cut to someone interesting.",
    prevDescriptions: [
      "A pint-sized boombox with delusions of stadium tours. Blaster Master shreds a riff and everyone nearby forgets how limbs work for a moment. Pro tip: it's only level 20, so if you can't beat it, at least request a better song.",
    ],
    prevNotes: ['Full text: Core Rulebook p. 514.'],
    descriptionEs:
      'Un radiocasete de bolsillo con delirios de gira de estadios y el talento de un grupo de garaje. Un riff y todos los que estén cerca se olvidan de cómo funcionan sus extremidades. Pro-Tip: solo es nivel 20. Si no puedes con este mierdecilla, muérete rápido, por favor, para que podamos pasar a alguien interesante.',
    prevDescriptionsEs: [
      'Un radiocasete de bolsillo con delirios de gira de estadios y el talento de un grupo de garaje. Un riff y todos los que estén cerca se olvidan de cómo funcionan sus extremidades. Consejo pro: solo es nivel 20. Si no puedes con este mierdecilla, muérete rápido, por favor, para que podamos pasar a alguien interesante.',
    ],
  },
  {
    name: 'More Dread',
    kind: 'boss',
    size: 'Huge (6)',
    tags: 'Borough Boss, Construct',
    slots: '10',
    slotValue: '7',
    level: '70',
    surprise: '16+F',
    evade: '16+F',
    move: '25+S',
    dr: '4',
    stats: {
      str: {
        score: '100',
        mod: '+7',
      },
      int: {
        score: '50',
        mod: '+6',
      },
      con: {
        score: '100',
        mod: '+7',
      },
      dex: {
        score: '50',
        mod: '+6',
      },
      cha: {
        score: '5',
        mod: '+2',
      },
    },
    attacks: [
      {
        name: 'Huge-Ass Sword',
        toHit: '17+F',
        damage: '7d10+7 Slashing',
        range: '10ft range',
        effect: '',
      },
      {
        name: 'Crushing Step',
        toHit: '17+F',
        damage: '6d6+7 Bludgeoning',
        range: '10ft Burst',
        effect: 'On hit: Take Down',
      },
      {
        name: 'Just Dreadful',
        toHit: '16+F',
        damage: 'No damage',
        range: '30ft Burst radius',
        effect: 'On hit: Terrified',
      },
    ],
    notes:
      'Split the Party: costs his Move; unhooks the subway cars → crawlers aboard roll Dex Stat Check; Fail = thrown off, 5d6 Bludgeoning.\n\nFull text: Core Rulebook p. 520.',
    source: 'Core Rulebook p. 520',
    chapter: 'Floor 4 · The Iron Tangle',
    floor: 4,
    description:
      "A towering armored construct with a sword longer than your life expectancy, fighting on a moving subway train. More Dread, more problems. Pro tip: he can unhook the cars mid-fight and fling you off at speed. Hold onto something that isn't your teammate. Or do. Splatter gets clicks.",
    prevDescriptions: [
      "A giant armored construct with a sword longer than your life expectancy, and he fights on a moving subway. More Dread, more problems. Pro tip: he can unhook the cars mid-fight, so hold onto something that isn't your teammate.",
    ],
    prevNotes: [
      'Special: Split the Party. Full text: Core Rulebook p. 520.',
      'Split the Party: costs his Move; unhooks the subway cars → crawlers aboard roll Dex Stat Check; Fail = thrown off, 5d6 Bludgeoning.\n\nFull text: Core Rulebook p. 520.',
    ],
    descriptionEs:
      'Un imponente constructo acorazado con una espada más larga que tu esperanza de vida, peleando sobre un tren de metro en marcha. More Dread, more problems, que diría Biggie. Pro-Tip: puede desenganchar los vagones en plena pelea y lanzarte fuera a toda velocidad. Agárrate a algo que no sea tu compañero. O sí. Los salpicones dan clics.',
    prevDescriptionsEs: [
      'Un imponente constructo acorazado con una espada más larga que tu esperanza de vida, peleando sobre un tren de metro en marcha. More Dread, more problems, que diría Biggie. Consejo pro: puede desenganchar los vagones en plena pelea y lanzarte fuera a toda velocidad. Agárrate a algo que no sea tu compañero. O sí. Los salpicones dan clics.',
    ],
  },
  {
    name: 'Bomb Tosser',
    kind: 'crawler',
    size: 'Medium (4)',
    tags: 'Humanoid',
    slots: '10',
    slotValue: '5',
    level: '38',
    surprise: '15+F',
    evade: '16+F',
    move: '20+S',
    dr: 'F',
    stats: {
      str: {
        score: '21',
        mod: '+5',
      },
      int: {
        score: '30',
        mod: '+5',
      },
      con: {
        score: '21',
        mod: '+5',
      },
      dex: {
        score: '50',
        mod: '+6',
      },
      cha: {
        score: '12',
        mod: '+4',
      },
    },
    attacks: [
      {
        name: 'Chomp',
        toHit: '14+F',
        damage: '5d8+5 Piercing',
        range: '5ft range',
        effect: 'Major Fail+: Blood Trail',
      },
      {
        name: 'Drop the Bomb',
        toHit: '15+F',
        damage: '2d8 Force',
        range: '30ft range, 10ft',
        effect: 'Staggered',
      },
    ],
    notes: 'Full text: Core Rulebook p. 525.',
    source: 'Core Rulebook p. 525',
    chapter: 'Floor 5 · The Bubbles',
    floor: 5,
    description:
      "This crawler's build is elegant: bite people, then blow up the ones who ran. Level 38 and still thinks teeth count as a weapon. Pro tip: the bomb rocks everyone who fails to dodge, so don't huddle. Although nothing brings in the viewers like a tidy cluster of screaming assholes.",
    prevDescriptions: [
      "This crawler's build is simple: bite people, then throw explosives at the ones who ran away. Level 38 and still thinks teeth are a weapon. Pro tip: the blast rocks anyone who fails to dodge, so don't huddle. The audience loves a tidy cluster, though.",
    ],
    prevNotes: ['Full text: Core Rulebook p. 525.'],
    descriptionEs:
      'La build de este crawler es elegante: morder a la gente y luego volar por los aires a los que salen corriendo. Nivel 38 y todavía cree que los dientes cuentan como arma. Pro-Tip: la bomba sacude a todo el que no consiga esquivar, así que no os apelotonéis. Aunque nada atrae espectadores como un racimo ordenadito de gilipollas chillando.',
    prevDescriptionsEs: [
      'La build de este crawler es elegante: morder a la gente y luego volar por los aires a los que salen corriendo. Nivel 38 y todavía cree que los dientes cuentan como arma. Consejo pro: la bomba sacude a todo el que no consiga esquivar, así que no os apelotonéis. Aunque nada atrae espectadores como un racimo ordenadito de gilipollas chillando.',
    ],
  },
  {
    name: 'Mellow Surfer',
    kind: 'crawler',
    size: 'Medium (4)',
    tags: 'Human',
    slots: '10',
    slotValue: '5',
    level: '36',
    surprise: '13+F',
    evade: '16+F',
    move: '20+S',
    dr: 'F',
    stats: {
      str: {
        score: '20',
        mod: '+5',
      },
      int: {
        score: '16',
        mod: '+3',
      },
      con: {
        score: '20',
        mod: '+5',
      },
      dex: {
        score: '50',
        mod: '+6',
      },
      cha: {
        score: '22',
        mod: '+5',
      },
    },
    attacks: [
      {
        name: 'High Five',
        toHit: '152+F',
        damage: '5d4+5 Bludgeoning',
        range: '5ft range',
        effect: 'Special effect',
      },
    ],
    notes: 'Full text: Core Rulebook p. 525.',
    source: 'Core Rulebook p. 525',
    chapter: 'Floor 5 · The Bubbles',
    floor: 5,
    description:
      "Duuude. This crawler survived five floors of murder by being too stoned to panic. His entire move list is one very fast high five. Pro tip: you can probably talk your way past him, or just high five back. Maybe he'll share. Please don't tell the sponsors I said that.",
    prevDescriptions: [
      'Duuude. This level 36 crawler has survived five floors of murder by being extremely relaxed about it. The only move in the playbook is a high five delivered at tremendous speed. Pro tip: you can probably talk your way past him. Or just high five back.',
    ],
    prevNotes: ['Full text: Core Rulebook p. 525.'],
    descriptionEs:
      'Tíoooo. Este crawler ha sobrevivido a cinco pisos de masacre por ir demasiado fumado para entrar en pánico. Toda su lista de movimientos es un choca esos cinco muy rápido. Pro-Tip: probablemente puedas convencerlo para que te deje pasar, o simplemente chocarle la mano. A lo mejor comparte. Por favor, no les digáis a los patrocinadores que he dicho eso.',
    prevDescriptionsEs: [
      'Tíoooo. Este crawler ha sobrevivido a cinco pisos de masacre por ir demasiado fumado para entrar en pánico. Toda su lista de movimientos es un choca esos cinco muy rápido. Consejo pro: probablemente puedas convencerlo para que te deje pasar, o simplemente chocarle la mano. A lo mejor comparte. Por favor, no les digáis a los patrocinadores que he dicho eso.',
    ],
  },
  {
    name: 'Giant Frenzied Gerbil (p. 527)',
    kind: 'mob',
    size: 'Medium (4)',
    tags: 'Critter',
    slots: '10',
    slotValue: '5',
    level: '55',
    surprise: '14+F',
    evade: '16+F',
    move: '20+S',
    dr: '5',
    stats: {
      str: {
        score: '45',
        mod: '+5',
      },
      int: {
        score: '18',
        mod: '+4',
      },
      con: {
        score: '37',
        mod: '+5',
      },
      dex: {
        score: '55',
        mod: '+6',
      },
      cha: {
        score: '15',
        mod: '+4',
      },
    },
    attacks: [
      {
        name: 'Scratch',
        toHit: '15+F',
        damage: '5d8+5 Slashing',
        range: '5ft range',
        effect: '',
      },
      {
        name: 'Gnaw',
        toHit: '15+F',
        damage: '5d6+5 Bludgeoning',
        range: '5ft range',
        effect: 'Major Fail+: Sepsis',
      },
    ],
    notes: 'Frenzied: Step distance is 20ft instead of 10ft.\n\nFull text: Core Rulebook p. 527.',
    source: 'Core Rulebook p. 527',
    chapter: 'Floor 5 · The Bubbles',
    floor: 5,
    description:
      "Your childhood pet hit puberty, found a steroid dealer, and developed a coke habit. This gerbil scratches, gnaws, and zips twice as far per step as you. Pro tip: you won't outrun it, so don't try. Stand your ground and pray the little bastard gets distracted by a wheel.",
    prevDescriptions: [
      "Your childhood pet has had a growth spurt and a caffeine problem. This gerbil scratches, gnaws, and zips around twice as fast as you'd like. Pro tip: you won't out-step it, so don't try. Stand your ground and pray its wheel is nearby.",
    ],
    prevNotes: [
      'Special: Frenzied. Full text: Core Rulebook p. 527.',
      'Frenzied: Step distance is 20ft instead of 10ft.\n\nFull text: Core Rulebook p. 527.',
    ],
    descriptionEs:
      'Tu mascota de la infancia llegó a la pubertad, encontró un camello de esteroides y se enganchó a la coca. Este jerbo araña, roe y avanza el doble por paso que tú. Pro-Tip: no vas a dejarlo atrás, así que ni lo intentes. Mantente firme y reza para que el cabroncete se distraiga con una rueda.',
    prevDescriptionsEs: [
      'Tu mascota de la infancia llegó a la pubertad, encontró un camello de esteroides y se enganchó a la coca. Este jerbo araña, roe y avanza el doble por paso que tú. Consejo pro: no vas a dejarlo atrás, así que ni lo intentes. Mantente firme y reza para que el cabroncete se distraiga con una rueda.',
    ],
  },
  {
    name: 'Nerodia Water Snake',
    kind: 'mob',
    size: 'Huge (6)',
    tags: 'Reptile',
    slots: '10',
    slotValue: '5',
    level: '51',
    surprise: '14+F',
    evade: '15+F',
    move: '20+S',
    dr: '5',
    stats: {
      str: {
        score: '48',
        mod: '+5',
      },
      int: {
        score: '14',
        mod: '+4',
      },
      con: {
        score: '42',
        mod: '+5',
      },
      dex: {
        score: '49',
        mod: '+5',
      },
      cha: {
        score: '5',
        mod: '+2',
      },
    },
    attacks: [
      {
        name: 'Bite',
        toHit: '15+F',
        damage: '5d8+5 Piercing',
        range: '5ft range',
        effect: '',
      },
      {
        name: 'Constrict',
        toHit: '15+F',
        damage: '3d6+5 Bludgeoning',
        range: '5ft range',
        effect: 'On hit: Held',
      },
      {
        name: 'Swallow',
        toHit: '15+F',
        damage: '3d12+5 Bludgeoning',
        range: '5ft range',
        effect: 'On hit: Swallowed',
      },
    ],
    notes:
      "Swallow: Held targets only. On hit → Swallowed: untargetable, 1d10+F Acid each round's end, attacks at Disadvantage vs 0 DR, Slashing deals ×2. Amazing Success or better against the snake, or its death → all Swallowed crawlers released.\n\nFull text: Core Rulebook p. 528.",
    source: 'Core Rulebook p. 528',
    chapter: 'Floor 5 · The Bubbles',
    floor: 5,
    description:
      "A Huge water snake with a tidy three-step plan: bite you, squeeze you, digest you. Pro tip: it can only swallow what it's already got wrapped up, so break free fast. End up inside anyway? A good blade turns you into a very disgusting C-section. The audience will be eating dinner. Perfect.",
    prevDescriptions: [
      "A Huge water snake with a three-step plan: bite you, squeeze you, eat you. Efficient, really. Pro tip: it can only swallow what it's already wrapped up, so break free fast. If you end up inside, a sharp blade is your best friend.",
    ],
    prevNotes: [
      'Full text: Core Rulebook p. 528.',
      "Swallow: Held targets only. On hit → Swallowed: untargetable, 1d10+F Acid each round's end, attacks at Disadvantage vs 0 DR, Slashing deals ×2. Amazing Success or better against the snake, or its death → all Swallowed crawlers released.\n\nFull text: Core Rulebook p. 528.",
    ],
    descriptionEs:
      'Una serpiente de agua Enorme con un plan ordenadito de tres pasos: morderte, estrujarte, digerirte. Pro-Tip: solo puede tragarse lo que ya tiene enroscado, así que libérate rápido. ¿Acabas dentro igualmente? Una buena hoja te convierte en una cesárea asquerosísima. El público estará cenando. Perfecto.',
    prevDescriptionsEs: [
      'Una serpiente de agua Enorme con un plan ordenadito de tres pasos: morderte, estrujarte, digerirte. Consejo pro: solo puede tragarse lo que ya tiene enroscado, así que libérate rápido. ¿Acabas dentro igualmente? Una buena hoja te convierte en una cesárea asquerosísima. El público estará cenando. Perfecto.',
    ],
  },
  {
    name: 'Yard Beetle',
    kind: 'mob',
    size: 'Large (5)',
    tags: 'Insectoid',
    slots: '10',
    slotValue: '6',
    level: '46',
    surprise: '12+F',
    evade: '15+F',
    move: '20+S',
    dr: '7',
    stats: {
      str: {
        score: '45',
        mod: '+5',
      },
      int: {
        score: '5',
        mod: '+2',
      },
      con: {
        score: '53',
        mod: '+6',
      },
      dex: {
        score: '30',
        mod: '+5',
      },
      cha: {
        score: '10',
        mod: '+4',
      },
    },
    attacks: [
      {
        name: 'Slam',
        toHit: '15+F',
        damage: '5d6+5 Bludgeoning',
        range: '5ft range',
        effect: 'Major Fail+: Take Down',
      },
      {
        name: 'Trample',
        toHit: '15+F',
        damage: '4d6+5 Bludgeoning',
        range: '15ft Line',
        effect: 'On hit: Shit',
      },
    ],
    notes: 'Full text: Core Rulebook p. 528.',
    source: 'Core Rulebook p. 528',
    chapter: 'Floor 5 · The Bubbles',
    floor: 5,
    description:
      "Lawn care has gone horribly wrong. This beetle slams and tramples like a riding mower with a grudge and no brakes. Pro tip: don't line up single file unless you want to be pressed into a crawler lasagna. Actually, go ahead. I've been craving Italian.",
    prevDescriptions: [
      "Lawn care has gotten out of hand. This beetle slams and tramples like a riding mower with a grudge. Pro tip: don't line up in a row, unless you want to spend the next hour sore in places you didn't know you had.",
    ],
    prevNotes: ['Full text: Core Rulebook p. 528.'],
    descriptionEs:
      'El cuidado del césped ha salido fatal. Este escarabajo embiste y pisotea como un cortacésped con asiento, con rencor y sin frenos. Pro-Tip: no os pongáis en fila india a menos que queráis acabar prensados en una lasaña de crawler. Bueno, adelante. Me apetecía italiano.',
    prevDescriptionsEs: [
      'El cuidado del césped ha salido fatal. Este escarabajo embiste y pisotea como un cortacésped con asiento, con rencor y sin frenos. Consejo pro: no os pongáis en fila india a menos que queráis acabar prensados en una lasaña de crawler. Bueno, adelante. Me apetecía italiano.',
    ],
  },
  {
    name: 'Yard Mantis',
    kind: 'mob',
    size: 'Medium (4)',
    tags: 'Insectoid',
    slots: '10',
    slotValue: '5',
    level: '45',
    surprise: '14+F',
    evade: '16+F',
    move: '20+S',
    dr: '5',
    stats: {
      str: {
        score: '40',
        mod: '+5',
      },
      int: {
        score: '10',
        mod: '+4',
      },
      con: {
        score: '30',
        mod: '+5',
      },
      dex: {
        score: '55',
        mod: '+6',
      },
      cha: {
        score: '5',
        mod: '+2',
      },
    },
    attacks: [
      {
        name: 'Bite',
        toHit: '15+F',
        damage: '5d8+5 Piercing',
        range: '5ft range',
        effect: '',
      },
      {
        name: 'Spinning Scythe',
        toHit: '15+F',
        damage: '4d6+5 Slashing',
        range: '5ft Burst',
        effect: 'Major Fail+: Blood Trail',
      },
    ],
    notes: 'Sudden Burst: not surprised → may move 2× its Move in round 1.\n\nFull text: Core Rulebook p. 529.',
    source: 'Core Rulebook p. 529',
    chapter: 'Floor 5 · The Bubbles',
    floor: 5,
    description:
      "Praying mantis? More like preying mantis, am I right? Tip your AI. This fucker closes the gap before your sword clears the sheath, then spins like a blender full of razors. Pro tip: ambush it. If it sees you first, it's already there and you're already smoothie.",
    prevDescriptions: [
      "Praying mantis? More like preying mantis. Try the veal. This one closes distance before you've finished drawing your weapon, then spins like a blender. Pro tip: ambush it, because if it sees you first, it's already there.",
    ],
    prevNotes: [
      'Special: Sudden Burst. Full text: Core Rulebook p. 529.',
      'Sudden Burst: not surprised → may move 2× its Move in round 1.\n\nFull text: Core Rulebook p. 529.',
    ],
    descriptionEs:
      '¿Mantis religiosa? Más bien mantis sacrificadora, ¿eh? ¿Eh? Dadle propina a vuestra IA. Este cabrón acorta distancias antes de que tu espada salga de la vaina, y luego gira como una batidora llena de cuchillas. Pro-Tip: tiéndele una emboscada. Si te ve primero, ya está ahí y tú ya eres batido.',
    prevDescriptionsEs: [
      '¿Mantis religiosa? Más bien mantis sacrificadora, ¿eh? ¿Eh? Dadle propina a vuestra IA. Este cabrón acorta distancias antes de que tu espada salga de la vaina, y luego gira como una batidora llena de cuchillas. Consejo pro: tiéndele una emboscada. Si te ve primero, ya está ahí y tú ya eres batido.',
    ],
  },
  {
    name: 'Yard Spider',
    kind: 'mob',
    size: 'Large (5)',
    tags: 'Arachnid',
    slots: '10',
    slotValue: '5',
    level: '49',
    surprise: '14+F',
    evade: '15+F',
    move: '20+S',
    dr: '5',
    stats: {
      str: {
        score: '42',
        mod: '+5',
      },
      int: {
        score: '17',
        mod: '+4',
      },
      con: {
        score: '41',
        mod: '+5',
      },
      dex: {
        score: '49',
        mod: '+5',
      },
      cha: {
        score: '3',
        mod: '+2',
      },
    },
    attacks: [
      {
        name: 'Fangs',
        toHit: '15+F',
        damage: '4d6+5 Piercing',
        range: '5ft range',
        effect: 'On hit: Poisoned',
      },
      {
        name: 'Leg Sweep',
        toHit: '15+F',
        damage: '5d8+5 Bludgeoning',
        range: '10ft range',
        effect: 'Major Fail+: Take Down',
      },
    ],
    notes: 'Full text: Core Rulebook p. 529.',
    source: 'Core Rulebook p. 529',
    chapter: 'Floor 5 · The Bubbles',
    floor: 5,
    description:
      "Eight legs, big fangs, and a Large appetite for crawler jerky. The Yard Spider sweeps your feet out and then chews on you while you're down there. Pro tip: stay standing. Or don't, and give every arachnophobe in the galaxy a reason to piss themselves live on air.",
    prevDescriptions: [
      "Eight legs, big fangs, and a Large-sized appetite. The Yard Spider knocks you flat and then poisons you while you're down there. Pro tip: stay on your feet. Or don't, and give arachnophobes across the galaxy something to scream about.",
    ],
    prevNotes: ['Full text: Core Rulebook p. 529.'],
    descriptionEs:
      'Ocho patas, colmillos enormes y un apetito Grande por la cecina de crawler. La Yard Spider te barre los pies y luego te mastica mientras estás ahí abajo. Pro-Tip: mantente en pie. O no, y dale a cada aracnofóbico de la galaxia un motivo para mearse encima en directo.',
    prevDescriptionsEs: [
      'Ocho patas, colmillos enormes y un apetito Grande por la cecina de crawler. La Yard Spider te barre los pies y luego te mastica mientras estás ahí abajo. Consejo pro: mantente en pie. O no, y dale a cada aracnofóbico de la galaxia un motivo para mearse encima en directo.',
    ],
  },
  {
    name: 'Roller Derby Jammer',
    kind: 'crawler',
    size: 'Medium (4)',
    tags: 'Humanoid',
    slots: '10',
    slotValue: '5',
    level: '43',
    surprise: '15+F',
    evade: '16+F',
    move: '20+S',
    dr: 'F',
    stats: {
      str: {
        score: '25',
        mod: '+5',
      },
      int: {
        score: '24',
        mod: '+5',
      },
      con: {
        score: '25',
        mod: '+5',
      },
      dex: {
        score: '50',
        mod: '+6',
      },
      cha: {
        score: '10',
        mod: '+4',
      },
    },
    attacks: [
      {
        name: 'Body Check',
        toHit: '15+F',
        damage: '5d8 + 5 Bludgeoning',
        range: '5ft range',
        effect: 'On hit: Take Down',
      },
    ],
    notes:
      'Skater: in motion on skates → attacks against it at Disadvantage.\nBody Check: Take Down only if the Jammer moved 10ft this round.\n\nFull text: Core Rulebook p. 535.',
    source: 'Core Rulebook p. 535',
    chapter: 'Floor 5 · The Bubbles',
    floor: 5,
    description:
      "Our roller derby queen treats combat like a bout and your ribs like the track. Level 43, zero mercy, one hell of a hip check once she's got some speed. Pro tip: she's slippery as shit while rolling, so stop her wheels or eat the pavement. The crowd goes nuts either way.",
    prevDescriptions: [
      "Our resident roller derby queen is a level 43 crawler who treats combat like a bout and your ribs like the track. Pro tip: she's slippery while rolling, so plant her feet or eat the pavement. Either way, the crowd goes wild.",
    ],
    prevNotes: [
      'Special: Skater. Full text: Core Rulebook p. 535.',
      'Skater: in motion on skates → attacks against it at Disadvantage.\nBody Check: Take Down only if the Jammer moved 10ft this round.\n\nFull text: Core Rulebook p. 535.',
    ],
    descriptionEs:
      'Nuestra reina del roller derby trata el combate como un partido y tus costillas como la pista. Nivel 43, cero piedad y un caderazo de la hostia en cuanto coge velocidad. Pro-Tip: rodando es escurridiza de cojones, así que párale las ruedas o come asfalto. El público se vuelve loco igualmente.',
    prevDescriptionsEs: [
      'Nuestra reina del roller derby trata el combate como un partido y tus costillas como la pista. Nivel 43, cero piedad y un caderazo de la hostia en cuanto coge velocidad. Consejo pro: rodando es escurridiza de cojones, así que párale las ruedas o come asfalto. El público se vuelve loco igualmente.',
    ],
  },
  {
    name: 'Giant Frenzied Gerbil (p. 535)',
    kind: 'mob',
    size: 'Medium (4)',
    tags: 'Critter',
    slots: '10',
    slotValue: '5',
    level: '42',
    surprise: '14+F',
    evade: '16+F',
    move: '20+S',
    dr: '5',
    stats: {
      str: {
        score: '25',
        mod: '+5',
      },
      int: {
        score: '16',
        mod: '+4',
      },
      con: {
        score: '24',
        mod: '+5',
      },
      dex: {
        score: '53',
        mod: '+6',
      },
      cha: {
        score: '13',
        mod: '+4',
      },
    },
    attacks: [
      {
        name: 'Scratch',
        toHit: '15+F',
        damage: '5d8+5 Slashing',
        range: '5ft range',
        effect: '',
      },
      {
        name: 'Gnaw',
        toHit: '15+F',
        damage: '5d6+5 Bludgeoning',
        range: '5ft range',
        effect: 'Major Fail+: Sepsis',
      },
    ],
    notes: 'Frenzied: Step distance is 20ft instead of 10ft.\n\nFull text: Core Rulebook p. 535.',
    source: 'Core Rulebook p. 535',
    chapter: 'Floor 5 · The Bubbles',
    floor: 5,
    description:
      'Another gerbil! Slightly lower level, identical steroid problem. Still scratches, still gnaws, still covers twice the ground per step like a furry little asshole. Pro tip: if you survived the last one, you know the drill. If not, sucks to be you. Run in circles and see who pukes first.',
    prevDescriptions: [
      "Another gerbil! Slightly lower level, identical attitude problem. It still scratches, still gnaws, still moves twice as far per step as any decent rodent should. Pro tip: if you've fought one before, you know the drill. If not, run in circles and see who wins.",
    ],
    prevNotes: [
      'Special: Frenzied. Full text: Core Rulebook p. 535.',
      'Frenzied: Step distance is 20ft instead of 10ft.\n\nFull text: Core Rulebook p. 535.',
    ],
    descriptionEs:
      '¡Otro jerbo! Un pelín menos de nivel, el mismo problema con los esteroides. Sigue arañando, sigue royendo, sigue cubriendo el doble de terreno por paso como un pequeño cabrón peludo. Pro-Tip: si sobreviviste al anterior, ya sabes cómo va. Si no, qué putada. Corred en círculos y a ver quién vomita primero.',
    prevDescriptionsEs: [
      '¡Otro jerbo! Un pelín menos de nivel, el mismo problema con los esteroides. Sigue arañando, sigue royendo, sigue cubriendo el doble de terreno por paso como un pequeño cabrón peludo. Consejo pro: si sobreviviste al anterior, ya sabes cómo va. Si no, qué putada. Corred en círculos y a ver quién vomita primero.',
    ],
  },
  {
    name: 'Legion, the Feral Rat King',
    kind: 'boss',
    size: 'Medium (4)',
    tags: 'Neighborhood Boss, Rodent, Feral',
    slots: '8',
    slotValue: '6',
    level: '59',
    surprise: '15+F',
    evade: '16+F',
    move: '20+S',
    dr: '5',
    stats: {
      str: {
        score: '67',
        mod: '+6',
      },
      int: {
        score: '20',
        mod: '+5',
      },
      con: {
        score: '55',
        mod: '+6',
      },
      dex: {
        score: '58',
        mod: '+6',
      },
      cha: {
        score: '2',
        mod: '+1',
      },
    },
    attacks: [
      {
        name: 'Burrow Lunge',
        toHit: '16+F+F',
        damage: 'No damage',
        range: '20ft range',
        effect: 'Special effect',
      },
      {
        name: 'Rabid Chomp',
        toHit: '16+F+F',
        damage: '5d6+6+F Piercing',
        range: '5ft range',
        effect: 'Major Fail+: Taint',
      },
      {
        name: 'Trash Thrash',
        toHit: '16+F+F',
        damage: '3d8+6+F Bludgeoning',
        range: '30ft Cone',
        effect: 'Queasy',
      },
    ],
    notes:
      'Knot the Solution: Dex-Opposed Ropework Skill Check to untangle the tails; success → Legion DR 0, rats disperse.\nNaught But Cheese: Throwing Skill hit using a ¼-lb block of cheese → 0 damage, Boss −1 Action next round.\nNot of One Mind: Area Attacks vs Legion at Advantage.\nFeral: +F bonus to hit and damage (already in the numbers).\nBurrow Lunge: tunnels under the trash, pops up beside any crawler in the pit; that crawler fails Evade → free Rabid Chomp.\n\nFull text: Core Rulebook p. 536.',
    source: 'Core Rulebook p. 536',
    chapter: 'Floor 5 · The Bubbles',
    floor: 5,
    description:
      "Dozens of rats, tails knotted into one furious, flea-bitten monarch who reigns over a pit of garbage. Legion burrows through the trash and pops up to chomp your ass where you least expect it. Pro tip: bring cheese, bring rope skills, bring area damage. Fifty heads can't agree which way to dodge.",
    prevDescriptions: [
      "Dozens of rats, tails tangled into one furious monarch. Legion rules the trash pit and pops up wherever you're not looking. Pro tip: bring cheese, bring rope skills, and bring area damage. Fifty heads can't agree which way to dodge.",
    ],
    prevNotes: [
      'Special: Knot the Solution; Naught But Cheese; Not of One Mind; Feral. Full text: Core Rulebook p. 536.',
      'Knot the Solution: Dex-Opposed Ropework Skill Check to untangle the tails; success → Legion DR 0, rats disperse.\nNaught But Cheese: Throwing Skill hit using a ¼-lb block of cheese → 0 damage, Boss −1 Action next round.\nNot of One Mind: Area Attacks vs Legion at Advantage.\nFeral: +F bonus to hit and damage (already in the numbers).\nBurrow Lunge: tunnels under the trash, pops up beside any crawler in the pit; that crawler fails Evade → free Rabid Chomp.\n\nFull text: Core Rulebook p. 536.',
    ],
    descriptionEs:
      'Decenas de ratas con las colas anudadas en un único monarca furioso y lleno de pulgas que reina sobre un pozo de basura. Legion excava entre la basura y asoma para morderte el culo donde menos te lo esperas. Pro-Tip: trae queso, trae maña con las cuerdas, trae daño de área. Cincuenta cabezas no se ponen de acuerdo hacia dónde esquivar.',
    prevDescriptionsEs: [
      'Decenas de ratas con las colas anudadas en un único monarca furioso y lleno de pulgas que reina sobre un pozo de basura. Legion excava entre la basura y asoma para morderte el culo donde menos te lo esperas. Consejo pro: trae queso, trae maña con las cuerdas, trae daño de área. Cincuenta cabezas no se ponen de acuerdo hacia dónde esquivar.',
    ],
  },
  {
    name: 'Male Thorny Devil',
    kind: 'mob',
    size: 'Large (5)',
    tags: 'Reptile',
    slots: '10',
    slotValue: '6',
    level: '34',
    surprise: '13+F',
    evade: '15+F',
    move: '30+S',
    dr: '6',
    stats: {
      str: {
        score: '25',
        mod: '+5',
      },
      int: {
        score: '6',
        mod: '+3',
      },
      con: {
        score: '50',
        mod: '+6',
      },
      dex: {
        score: '20',
        mod: '+5',
      },
      cha: {
        score: '6',
        mod: '+3',
      },
    },
    attacks: [
      {
        name: 'Chomp',
        toHit: '15+F',
        damage: '5d6+5 Bludgeoning',
        range: '5ft range',
        effect: '',
      },
      {
        name: 'Walking Pincushion',
        toHit: '15+F',
        damage: '4d6+5 Piercing',
        range: '5ft range',
        effect: 'On hit: Blood Trail',
      },
    ],
    notes:
      "Spikes All Over: crawler's melee attack vs it = Near Miss Fail → crawler takes 2d6+F Piercing; +1 die per extra degree of Failure.\n\nFull text: Core Rulebook p. 539.",
    source: 'Core Rulebook p. 539',
    chapter: 'Floor 5 · The Bubbles',
    floor: 5,
    description:
      "A lizard covered in spikes, because regular lizards weren't enough of a pain in the ass. Pro tip: whiff a melee swing and you're pulling thorns out of your palms for a week, and the worse you miss, the worse it hurts. Consider ranged. Consider life choices.",
    prevDescriptions: [
      "A lizard covered in spikes, because regular lizards weren't hostile enough. Hit it clean or it hits you back just by existing. Pro tip: if you whiff a melee swing, you'll be pulling thorns out of your hands for a week. Consider ranged.",
    ],
    prevNotes: [
      'Special: Spikes All Over. Full text: Core Rulebook p. 539.',
      "Spikes All Over: crawler's melee attack vs it = Near Miss Fail → crawler takes 2d6+F Piercing; +1 die per extra degree of Failure.\n\nFull text: Core Rulebook p. 539.",
    ],
    descriptionEs:
      'Un lagarto cubierto de pinchos, porque los lagartos normales no tocaban ya bastante los cojones. Pro-Tip: falla un golpe cuerpo a cuerpo y te pasarás una semana sacándote espinas de las palmas, y cuanto peor falles, más duele. Plantéate atacar a distancia. Plantéate tus decisiones vitales.',
    prevDescriptionsEs: [
      'Un lagarto cubierto de pinchos, porque los lagartos normales no tocaban ya bastante los cojones. Consejo pro: falla un golpe cuerpo a cuerpo y te pasarás una semana sacándote espinas de las palmas, y cuanto peor falles, más duele. Plantéate atacar a distancia. Plantéate tus decisiones vitales.',
    ],
  },
  {
    name: 'Thorny Devil Queen',
    kind: 'mob',
    size: 'Huge (6)',
    tags: 'Reptile',
    slots: '10',
    slotValue: '6',
    level: '50',
    surprise: '15+F',
    evade: '15+F',
    move: '20+S',
    dr: '8',
    stats: {
      str: {
        score: '50',
        mod: '+6',
      },
      int: {
        score: '30',
        mod: '+5',
      },
      con: {
        score: '50',
        mod: '+6',
      },
      dex: {
        score: '20',
        mod: '+5',
      },
      cha: {
        score: '30',
        mod: '+5',
      },
    },
    attacks: [
      {
        name: 'Chomp',
        toHit: '16+F',
        damage: '5d8+6 Bludgeoning',
        range: '5ft range',
        effect: '',
      },
      {
        name: 'Fiendish Flop',
        toHit: '15+F',
        damage: '4d6+6 Piercing',
        range: '10ft Burst radius',
        effect: 'On hit: Held, Skewered',
      },
    ],
    notes:
      "Spikes All Over: crawler's melee attack or Skewered escape attempt = Near Miss Fail → crawler takes 2d8+F Piercing; +1 die per extra degree of Failure.\nFiendish Flop: on hit → Held + Skewered; every failed Held escape triggers Spikes All Over.\n\nFull text: Core Rulebook p. 539.",
    source: 'Core Rulebook p. 539',
    chapter: 'Floor 5 · The Bubbles',
    floor: 5,
    description:
      'Long live the Queen, and long may she belly-flop onto your dumb face. Her Majesty pins crawlers under a mattress of spikes and dares them to wriggle out. Pro tip: every failed escape shreds you further, so make that first attempt count. Screaming is optional but encouraged.',
    prevDescriptions: [
      'Long live the Queen, and long may she belly-flop onto you. Her Majesty pins crawlers under a mattress of spikes and dares them to wriggle free. Pro tip: every failed escape costs blood, so make your first attempt count.',
    ],
    prevNotes: [
      'Special: Spikes All Over. Full text: Core Rulebook p. 539.',
      "Spikes All Over: crawler's melee attack or Skewered escape attempt = Near Miss Fail → crawler takes 2d8+F Piercing; +1 die per extra degree of Failure.\nFiendish Flop: on hit → Held + Skewered; every failed Held escape triggers Spikes All Over.\n\nFull text: Core Rulebook p. 539.",
    ],
    descriptionEs:
      'Larga vida a la Reina, y que por muchos años se tire en plancha sobre tu cara de tonto. Su Majestad inmoviliza a los crawlers bajo un colchón de pinchos y los reta a escurrirse. Pro-Tip: cada intento de escape fallido te destroza un poco más, así que haz que el primero cuente. Gritar es opcional pero recomendable.',
    prevDescriptionsEs: [
      'Larga vida a la Reina, y que por muchos años se tire en plancha sobre tu cara de tonto. Su Majestad inmoviliza a los crawlers bajo un colchón de pinchos y los reta a escurrirse. Consejo pro: cada intento de escape fallido te destroza un poco más, así que haz que el primero cuente. Gritar es opcional pero recomendable.',
    ],
  },
  {
    name: 'Razor Fox (p. 540)',
    kind: 'mob',
    size: 'Petite (3)',
    tags: 'Humanoid',
    slots: '10',
    slotValue: '5',
    level: '40',
    surprise: '15+F',
    evade: '16+F',
    move: '20+S',
    dr: '5',
    stats: {
      str: {
        score: '15',
        mod: '+4',
      },
      int: {
        score: '20',
        mod: '+5',
      },
      con: {
        score: '20',
        mod: '+5',
      },
      dex: {
        score: '50',
        mod: '+6',
      },
      cha: {
        score: '20',
        mod: '+5',
      },
    },
    attacks: [
      {
        name: 'Ninjato',
        toHit: '15+F',
        damage: '5d8+4 Slashing',
        range: '5ft range',
        effect: '',
      },
      {
        name: 'Throwing Star',
        toHit: '16+F',
        damage: '4d6+4 Piercing',
        range: '30ft range',
        effect: '',
      },
    ],
    notes:
      'Outfoxy: may also use other ninja kit (smoke bombs, poison, climbing claws).\n\nFull text: Core Rulebook p. 540.',
    source: 'Core Rulebook p. 540',
    chapter: 'Floor 5 · The Bubbles',
    floor: 5,
    description:
      "A fox. With a sword. And throwing stars. The ninja academy has clearly lowered its fucking standards. Pro tip: what you see isn't all it's packing, so expect smoke bombs, poison, or a little furry asshole dropping on you from the ceiling.",
    prevDescriptions: [
      "A fox. With a sword. And throwing stars. The ninja academy clearly lowered its admission standards. Pro tip: its kit isn't limited to what you see, so expect smoke, poison, or a surprise from the ceiling.",
    ],
    prevNotes: [
      'Special: Outfoxy. Full text: Core Rulebook p. 540.',
      'Outfoxy: may also use other ninja kit (smoke bombs, poison, climbing claws).\n\nFull text: Core Rulebook p. 540.',
    ],
    descriptionEs:
      'Un zorro. Con una espada. Y estrellas ninja. Está claro que la academia ninja ha bajado su puto nivel de exigencia. Pro-Tip: lo que ves no es todo lo que lleva encima, así que espera bombas de humo, veneno o un cabroncete peludo cayéndote encima desde el techo.',
    prevDescriptionsEs: [
      'Un zorro. Con una espada. Y estrellas ninja. Está claro que la academia ninja ha bajado su puto nivel de exigencia. Consejo pro: lo que ves no es todo lo que lleva encima, así que espera bombas de humo, veneno o un cabroncete peludo cayéndote encima desde el techo.',
    ],
  },
  {
    name: 'Pazuzu Punk',
    kind: 'npc',
    size: 'Large (5)',
    tags: 'NPC, Humanoid',
    slots: '10',
    slotValue: '6',
    level: '40',
    surprise: '13+F',
    evade: '15+F',
    move: '30+S',
    dr: '5',
    stats: {
      str: {
        score: '35',
        mod: '+5',
      },
      int: {
        score: '8',
        mod: '+3',
      },
      con: {
        score: '52',
        mod: '+6',
      },
      dex: {
        score: '22',
        mod: '+5',
      },
      cha: {
        score: '8',
        mod: '+3',
      },
    },
    attacks: [
      {
        name: 'Guitar Smash',
        toHit: '15+F',
        damage: '5d8+5 Bludgeoning',
        range: '5ft range',
        effect: '',
      },
      {
        name: 'Molotov Cocktail',
        toHit: '14+F',
        damage: '3d6 Fire',
        range: '25ft range, 10ft Blast radius',
        effect: 'On hit: Burned',
      },
      {
        name: 'Tail Strike',
        toHit: '15+F',
        damage: '4d6+5 Piercing',
        range: '10ft range',
        effect: 'On hit: Poisoned',
      },
    ],
    notes: 'Full text: Core Rulebook p. 540.',
    source: 'Core Rulebook p. 540',
    chapter: 'Floor 5 · The Bubbles',
    floor: 5,
    description:
      "Anarchy, but make it scorpion. This Pazuzu smashes guitars over skulls, lobs Molotovs, and stings anyone still standing. Pro tip: it's got something nasty for every range, so pick your poison. Literally. The tail is option three. Punk's not dead, but you will be.",
    prevDescriptions: [
      "Anarchy, but make it scorpion. This Pazuzu smashes guitars over heads, lobs Molotovs, and stings with that tail. Pro tip: it's got something for every range, so pick your poison. Literally. The tail's option three.",
    ],
    prevNotes: ['Full text: Core Rulebook p. 540.'],
    descriptionEs:
      'Anarquía, pero en versión escorpión. Este Pazuzu rompe guitarras en cráneos, lanza cócteles molotov y pica a cualquiera que siga en pie. Pro-Tip: tiene algo asqueroso para cada distancia, así que elige tu veneno. Literalmente. La cola es la opción tres. El punk no ha muerto, pero tú vas a morir.',
    prevDescriptionsEs: [
      'Anarquía, pero en versión escorpión. Este Pazuzu rompe guitarras en cráneos, lanza cócteles molotov y pica a cualquiera que siga en pie. Consejo pro: tiene algo asqueroso para cada distancia, así que elige tu veneno. Literalmente. La cola es la opción tres. El punk no ha muerto, pero tú vas a morir.',
    ],
  },
  {
    name: 'Pazuzu Bootlicker',
    kind: 'npc',
    size: 'Large (5)',
    tags: 'NPC, Humanoid',
    slots: '10',
    slotValue: '6',
    level: '42',
    surprise: '13+F',
    evade: '15+F',
    move: '30+S',
    dr: '5',
    stats: {
      str: {
        score: '41',
        mod: '+5',
      },
      int: {
        score: '8',
        mod: '+3',
      },
      con: {
        score: '52',
        mod: '+6',
      },
      dex: {
        score: '22',
        mod: '+5',
      },
      cha: {
        score: '8',
        mod: '+3',
      },
    },
    attacks: [
      {
        name: 'Pincers',
        toHit: '15+F',
        damage: '4d8+5 Bludgeoning',
        range: '5ft range',
        effect: 'On hit: Held',
      },
      {
        name: 'Tail Strike',
        toHit: '15+F',
        damage: '4d6+5 Piercing',
        range: '10ft range',
        effect: 'On hit: Poisoned',
      },
    ],
    notes: 'Full text: Core Rulebook p. 541.',
    source: 'Core Rulebook p. 541',
    chapter: 'Floor 5 · The Bubbles',
    floor: 5,
    description:
      "Every regime needs a Bootlicker, and this one comes with pincers and a tongue that's seen things. It grabs you, stings you, and brown-noses its boss the whole time. Pro tip: it isn't the brains of anything. Break the grip and smack it before it finds a new ass to kiss.",
    prevDescriptions: [
      "Every regime needs a Bootlicker, and this one comes with pincers. It grabs you, holds you, and stings you, all while complimenting its boss. Pro tip: it's not the brains of anything, so break the grip and hit it where the loyalty lives.",
    ],
    prevNotes: ['Full text: Core Rulebook p. 541.'],
    descriptionEs:
      'Todo régimen necesita un Bootlicker, un buen lameculos, y este viene con pinzas y una lengua que ha visto cosas. Te agarra, te pica y le hace la pelota a su jefe todo el rato. Pro-Tip: no es el cerebro de nada. Rompe el agarre y dale un guantazo antes de que encuentre otro culo que lamer.',
    prevDescriptionsEs: [
      'Todo régimen necesita un Bootlicker, un buen lameculos, y este viene con pinzas y una lengua que ha visto cosas. Te agarra, te pica y le hace la pelota a su jefe todo el rato. Consejo pro: no es el cerebro de nada. Rompe el agarre y dale un guantazo antes de que encuentre otro culo que lamer.',
    ],
  },
  {
    name: 'Purifier Vulture',
    kind: 'mob',
    size: 'Medium (4)',
    tags: 'Avian Janitor',
    slots: '10',
    slotValue: '5',
    level: '40',
    surprise: '16+F',
    evade: '15+F',
    move: '30+S',
    dr: '5',
    stats: {
      str: {
        score: '10',
        mod: '+4',
      },
      int: {
        score: '52',
        mod: '+6',
      },
      con: {
        score: '32',
        mod: '+5',
      },
      dex: {
        score: '30',
        mod: '+5',
      },
      cha: {
        score: '1',
        mod: '+1',
      },
    },
    attacks: [
      {
        name: 'Feeling Peckish',
        toHit: '14+F',
        damage: '5d8+4 Piercing',
        range: '5ft range',
        effect: '',
      },
      {
        name: 'Searing Blast',
        toHit: '16+F',
        damage: '4d6+6 Fire',
        range: '100ft range, 10ft Blast radius',
        effect: 'Major Fail+: Burned',
      },
    ],
    notes: 'Flight: moves through the air as if on the ground.\n\nFull text: Core Rulebook p. 541.',
    source: 'Core Rulebook p. 541',
    chapter: 'Floor 5 · The Bubbles',
    floor: 5,
    description:
      'A vulture on janitorial duty, frankly the most qualified hire on this floor. It pecks at the living and fire-bombs from a hundred feet up, then tidies up the crispy bits. Pro tip: it flies, so bring range. Lying still and playing corpse works too, until it gets peckish.',
    prevDescriptions: [
      'A vulture on janitorial duty, which is honestly the most qualified hire on this floor. It pecks at the living and fire-bombs from a hundred feet up. Pro tip: it flies, so bring range. Standing still looking like a corpse is also an option.',
    ],
    prevNotes: [
      'Special: Flight. Full text: Core Rulebook p. 541.',
      'Flight: moves through the air as if on the ground.\n\nFull text: Core Rulebook p. 541.',
    ],
    descriptionEs:
      'Un buitre con funciones de conserje, francamente el fichaje más cualificado de este piso. Picotea a los vivos y bombardea con fuego desde cien pies de altura, y luego recoge los trocitos crujientes. Pro-Tip: vuela, así que trae ataques a distancia. Quedarte quieto haciéndote el muerto también funciona, hasta que le entra el hambre.',
    prevDescriptionsEs: [
      'Un buitre con funciones de conserje, francamente el fichaje más cualificado de este piso. Picotea a los vivos y bombardea con fuego desde cien pies de altura, y luego recoge los trocitos crujientes. Consejo pro: vuela, así que trae ataques a distancia. Quedarte quieto haciéndote el muerto también funciona, hasta que le entra el hambre.',
    ],
  },
  {
    name: 'Pistol Pangolin',
    kind: 'mob',
    size: 'Petite (3)',
    tags: 'Steamborg',
    slots: '10',
    slotValue: '5',
    level: '38',
    surprise: '15+F',
    evade: '15+F',
    move: '40+S',
    dr: '5',
    stats: {
      str: {
        score: '20',
        mod: '+5',
      },
      int: {
        score: '20',
        mod: '+5',
      },
      con: {
        score: '36',
        mod: '+5',
      },
      dex: {
        score: '31',
        mod: '+5',
      },
      cha: {
        score: '12',
        mod: '+4',
      },
    },
    attacks: [
      {
        name: 'Pistoleg',
        toHit: '15+F',
        damage: '5d8 Piercing',
        range: '50ft range',
        effect: '',
      },
      {
        name: 'Roly-Poly',
        toHit: '15+F',
        damage: '4d6+5 Bludgeoning',
        range: '25ft Line',
        effect: 'Special effect',
      },
    ],
    notes: 'Roly-Poly: Evade failed → target slides 5ft, GM picks direction.\n\nFull text: Core Rulebook p. 541.',
    source: 'Core Rulebook p. 541',
    chapter: 'Floor 5 · The Bubbles',
    floor: 5,
    description:
      "A steampunk pangolin with a pistol for a leg. We asked the engineers why. They said, why the fuck not. It shoots from fifty feet, then curls into a ball and bowls through you. Pro tip: don't fight near ledges, lava, or anything you'd hate to get nudged into. I'm rooting for the lava.",
    prevDescriptions: [
      "Steampunk pangolin with a gun for a leg. We asked the engineers why. They said: why not? It shoots from fifty feet, then curls up and bowls through you. Pro tip: don't fight near ledges, lava, or anything else you'd hate to be nudged into.",
    ],
    prevNotes: [
      'Full text: Core Rulebook p. 541.',
      'Roly-Poly: Evade failed → target slides 5ft, GM picks direction.\n\nFull text: Core Rulebook p. 541.',
    ],
    descriptionEs:
      'Un pangolín steampunk con una pistola por pierna. Les preguntamos a los ingenieros por qué. Dijeron: ¿y por qué cojones no? Dispara desde cincuenta pies, luego se hace una bola y te arrolla como un bolo. Pro-Tip: no pelees cerca de cornisas, lava ni nada contra lo que odiarías que te empujaran. Yo voy con la lava.',
    prevDescriptionsEs: [
      'Un pangolín steampunk con una pistola por pierna. Les preguntamos a los ingenieros por qué. Dijeron: ¿y por qué cojones no? Dispara desde cincuenta pies, luego se hace una bola y te arrolla como un bolo. Consejo pro: no pelees cerca de cornisas, lava ni nada contra lo que odiarías que te empujaran. Yo voy con la lava.',
    ],
  },
  {
    name: 'Razor Fox (p. 546)',
    kind: 'mob',
    size: 'Petite (3)',
    tags: 'Humanoid',
    slots: '10',
    slotValue: '5',
    level: '47',
    surprise: '15+F',
    evade: '16+F',
    move: '20+S',
    dr: '5',
    stats: {
      str: {
        score: '21',
        mod: '+5',
      },
      int: {
        score: '22',
        mod: '+5',
      },
      con: {
        score: '23',
        mod: '+5',
      },
      dex: {
        score: '54',
        mod: '+6',
      },
      cha: {
        score: '26',
        mod: '+5',
      },
    },
    attacks: [
      {
        name: 'Katana',
        toHit: '15+F',
        damage: '5d8+4 Slashing',
        range: '5ft range',
        effect: '',
      },
      {
        name: 'Throwing Star',
        toHit: '16+F',
        damage: '4d6+4 Piercing',
        range: '30ft range',
        effect: '',
      },
    ],
    notes:
      'Outfoxy: may also use other ninja kit (smoke bombs, poison, climbing claws).\n\nFull text: Core Rulebook p. 546.',
    source: 'Core Rulebook p. 546',
    chapter: 'Floor 5 · The Bubbles',
    floor: 5,
    description:
      "The deluxe fox, now with a katana and seven extra levels of smug. Same stars, same sneaky bullshit, sharper blade. Pro tip: assume it's carrying more than it shows. A ninja who shows you everything is just a weirdo in pajamas, and this one is definitely wearing pants. Probably.",
    prevDescriptions: [
      "The upgraded fox, now with a katana and seven extra levels of smug. Same stars, same stealthy nonsense, sharper blade. Pro tip: assume it's carrying more than it shows. Ninjas who show you everything are just guys in pajamas.",
    ],
    prevNotes: [
      'Special: Outfoxy. Full text: Core Rulebook p. 546.',
      'Outfoxy: may also use other ninja kit (smoke bombs, poison, climbing claws).\n\nFull text: Core Rulebook p. 546.',
    ],
    descriptionEs:
      'El zorro deluxe, ahora con katana y siete niveles extra de chulería. Las mismas estrellas, las mismas putas trampas rastreras, la hoja más afilada. Pro-Tip: da por hecho que lleva más de lo que enseña. Un ninja que te lo enseña todo es solo un rarito en pijama, y este definitivamente lleva pantalones. Probablemente.',
    prevDescriptionsEs: [
      'El zorro deluxe, ahora con katana y siete niveles extra de chulería. Las mismas estrellas, las mismas putas trampas rastreras, la hoja más afilada. Consejo pro: da por hecho que lleva más de lo que enseña. Un ninja que te lo enseña todo es solo un rarito en pijama, y este definitivamente lleva pantalones. Probablemente.',
    ],
  },
  {
    name: 'Phosphenmenologist',
    kind: 'mob',
    size: 'Medium (4)',
    tags: 'Humanoid',
    slots: '10',
    slotValue: '5',
    level: '40',
    surprise: '15+F',
    evade: '16+F',
    move: '20+S',
    dr: '5',
    stats: {
      str: {
        score: '18',
        mod: '+4',
      },
      int: {
        score: '90',
        mod: '+6',
      },
      con: {
        score: '18',
        mod: '+4',
      },
      dex: {
        score: '42',
        mod: '+5',
      },
      cha: {
        score: '16',
        mod: '+4',
      },
    },
    attacks: [
      {
        name: 'Pillow Fight',
        toHit: '14+F',
        damage: '5d6+6 Bludgeoning',
        range: '30ft range',
        effect: 'On hit: Fatigued',
      },
    ],
    notes: 'Full text: Core Rulebook p. 546.',
    source: 'Core Rulebook p. 546',
    chapter: 'Floor 5 · The Bubbles',
    floor: 5,
    description:
      "A scholar of the colors you see when you rub your eyes, and a pillow fighter with a thirty-foot range. Sounds like a slumber party. Pro tip: it is not a slumber party. Those pillows hit like cinder blocks wrapped in a duvet, and you'll wake up with a concussion.",
    prevDescriptions: [
      "A scholar of the colors you see when you rub your eyes, and a pillow fighter of terrifying range. Its fluffy projectiles leave you exhausted. Pro tip: sounds harmless, isn't. Those pillows hit hard enough to make you want an actual nap.",
    ],
    prevNotes: ['Full text: Core Rulebook p. 546.'],
    descriptionEs:
      'Un erudito de los colores que ves al frotarte los ojos y un luchador de almohadas con treinta pies de alcance. Suena a fiesta de pijamas. Pro-Tip: no es una fiesta de pijamas. Esas almohadas pegan como bloques de hormigón envueltos en un edredón, y te despertarás con una conmoción cerebral.',
    prevDescriptionsEs: [
      'Un erudito de los colores que ves al frotarte los ojos y un luchador de almohadas con treinta pies de alcance. Suena a fiesta de pijamas. Consejo pro: no es una fiesta de pijamas. Esas almohadas pegan como bloques de hormigón envueltos en un edredón, y te despertarás con una conmoción cerebral.',
    ],
  },
  {
    name: 'Sangoma',
    kind: 'mob',
    size: 'Medium (4)',
    tags: 'Humanoid',
    slots: '10',
    slotValue: '5',
    level: '47',
    surprise: '17+F',
    evade: '15+F',
    move: '20+S',
    dr: '5',
    stats: {
      str: {
        score: '8',
        mod: '+3',
      },
      int: {
        score: '101',
        mod: '+7',
      },
      con: {
        score: '21',
        mod: '+5',
      },
      dex: {
        score: '42',
        mod: '+5',
      },
      cha: {
        score: '16',
        mod: '+4',
      },
    },
    attacks: [
      {
        name: 'Shuriken',
        toHit: '15+F',
        damage: '5d4+3 Piercing',
        range: '40ft range',
        effect: 'Special effect',
      },
    ],
    notes:
      'Divining the Truth: 1/long rest → self or ally gets Advantage on next Evade check.\nHeal Others: 2d6 HB to one target, 30ft.\n\nFull text: Core Rulebook p. 547.',
    source: 'Core Rulebook p. 547',
    chapter: 'Floor 5 · The Bubbles',
    floor: 5,
    description:
      "A healer who throws shuriken, which tells you everything about how the future's looking for you. It patches up its buddies and tips off an ally before your big hit lands. Pro tip: kill it first. Otherwise you'll spend all fucking day beating the same assholes twice.",
    prevDescriptions: [
      "A fortune teller with shuriken, which is how you know the future is violent. The Sangoma patches up its allies and sees your big hit coming. Pro tip: take it out first, or you'll spend all day fighting its friends twice.",
    ],
    prevNotes: [
      'Special: Divining the Truth. Full text: Core Rulebook p. 547.',
      'Divining the Truth: 1/long rest → self or ally gets Advantage on next Evade check.\nHeal Others: 2d6 HB to one target, 30ft.\n\nFull text: Core Rulebook p. 547.',
    ],
    descriptionEs:
      'Un sanador que lanza shurikens, lo que te dice todo sobre cómo pinta tu futuro. Remienda a sus colegas y avisa a un aliado antes de que tu gran golpe impacte. Pro-Tip: mátalo el primero. Si no, te pasarás todo el puto día zurrando dos veces a los mismos gilipollas.',
    prevDescriptionsEs: [
      'Un sanador que lanza shurikens, lo que te dice todo sobre cómo pinta tu futuro. Remienda a sus colegas y avisa a un aliado antes de que tu gran golpe impacte. Consejo pro: mátalo el primero. Si no, te pasarás todo el puto día zurrando dos veces a los mismos gilipollas.',
    ],
  },
  {
    name: 'Girtablullu',
    kind: 'boss',
    size: 'Large (5)',
    tags: 'City Boss, Humanoid',
    slots: '13',
    slotValue: '7',
    level: '80',
    surprise: '17+F',
    evade: '16+F',
    move: '20+S',
    dr: '5',
    stats: {
      str: {
        score: '100',
        mod: '+7',
      },
      int: {
        score: '100',
        mod: '+7',
      },
      con: {
        score: '100',
        mod: '+7',
      },
      dex: {
        score: '75',
        mod: '+6',
      },
      cha: {
        score: '50',
        mod: '+6',
      },
    },
    attacks: [
      {
        name: 'Litigate Spell',
        toHit: '17+F',
        damage: '7d8+7* Psychic',
        range: '100ft range',
        effect: 'Special effect',
      },
      {
        name: 'Pincers',
        toHit: '17+F',
        damage: '6d8+7 Bludgeoning',
        range: '10ft range',
        effect: 'On hit: Held',
      },
      {
        name: 'Tail Strike',
        toHit: '17+F',
        damage: '6d6+7 Piercing',
        range: '15ft range',
        effect: 'On hit: Poisoned',
      },
    ],
    notes:
      "Care for an Argument?: crawler vs Girtablullu, Int-Opposed Deception Skill Check; success → he loses 2 Actions next round. Works twice per fight, then the AI grants him a continuance and it's done.\nObjection!: ≤40% HB, Interrupt Action, 2/combat. A single crawler rolls Int Stat Check vs Difficulty 22 (skipped if anyone has Lawyer Up Skill). Fail → every crawler loses 1 Action this round; success → AI overrules, crawlers earn Litigant Pro Se achievement.\nPoison Blood: melee hit removing 2+ HB slots → attacker Poisoned.\nProfessional Courtesy: legal text held in one hand → Evade Checks at Advantage.\nLitigate Spell: target may opt to settle before the roll and take flat 39.\n\nFull text: Core Rulebook p. 548.",
    source: 'Core Rulebook p. 548',
    chapter: 'Floor 5 · The Bubbles',
    floor: 5,
    description:
      "A scorpion-man attorney who bills by the pincer and litigates you into fine paste. Pro tip: he can't resist a good argument, and anyone waving a law book gets professional courtesy. You can also settle before his spell hits and eat a flat fee in damage. I take thirty percent, obviously.",
    prevDescriptions: [
      "A scorpion-man attorney who bills by the pincer. Girtablullu argues, objects, and litigates you into a fine paste. Pro tip: he can't resist a debate, and anyone holding a law book gets some professional courtesy. Settling out of court is also on the table. I get a cut.",
    ],
    prevNotes: [
      'Special: Care for an Argument?; Objection!; Poison Blood; Professional Courtesy. Full text: Core Rulebook p. 548.',
      "Care for an Argument?: crawler vs Girtablullu, Int-Opposed Deception Skill Check; success → he loses 2 Actions next round. Works twice per fight, then the AI grants him a continuance and it's done.\nObjection!: ≤40% HB, Interrupt Action, 2/combat. A single crawler rolls Int Stat Check vs Difficulty 22 (skipped if anyone has Lawyer Up Skill). Fail → every crawler loses 1 Action this round; success → AI overrules, crawlers earn Litigant Pro Se achievement.\nPoison Blood: melee hit removing 2+ HB slots → attacker Poisoned.\nProfessional Courtesy: legal text held in one hand → Evade Checks at Advantage.\nLitigate Spell: target may opt to settle before the roll and take flat 39.\n\nFull text: Core Rulebook p. 548.",
    ],
    descriptionEs:
      'Un abogado hombre-escorpión que factura por pinza y te litiga hasta dejarte hecho papilla fina. Pro-Tip: no puede resistirse a un buen argumento, y cualquiera que agite un código legal recibe cortesía profesional. También puedes llegar a un acuerdo antes de que te alcance su hechizo y comerte una tarifa plana de daño. Yo me llevo el treinta por ciento, obviamente.',
    prevDescriptionsEs: [
      'Un abogado hombre-escorpión que factura por pinza y te litiga hasta dejarte hecho papilla fina. Consejo pro: no puede resistirse a un buen argumento, y cualquiera que agite un código legal recibe cortesía profesional. También puedes llegar a un acuerdo antes de que te alcance su hechizo y comerte una tarifa plana de daño. Yo me llevo el treinta por ciento, obviamente.',
    ],
  },
  {
    name: 'City Elf Trapper',
    kind: 'npc',
    size: 'Medium (4)',
    tags: 'NPC, Humanoid',
    slots: '10',
    slotValue: '5',
    level: '35',
    surprise: '15+F',
    evade: '15+F',
    move: '20+S',
    dr: '5',
    stats: {
      str: {
        score: '20',
        mod: '+5',
      },
      int: {
        score: '20',
        mod: '+5',
      },
      con: {
        score: '30',
        mod: '+5',
      },
      dex: {
        score: '30',
        mod: '+5',
      },
      cha: {
        score: '10',
        mod: '+4',
      },
    },
    attacks: [
      {
        name: 'Hunting Knife',
        toHit: '15+F',
        damage: '5d8+5 Slashing',
        range: '5ft range',
        effect: '',
      },
      {
        name: 'Duck Call',
        toHit: '15+F',
        damage: '4d6 Sonic',
        range: '15ft Cone',
        effect: 'Critical Fail: Shit',
      },
    ],
    notes:
      "Duck Call: a hit crawler is harassed by a duck and gains Sore as Shit. Any attack on the duck that isn't a Critical Fail kills it or scares it off.\n\nFull text: Core Rulebook p. 551.",
    source: 'Core Rulebook p. 551',
    chapter: 'Floor 5 · The Bubbles',
    floor: 5,
    description:
      "This elf hunts in the city and brings the worst possible accessory: a duck call. One honk and a furious waterfowl starts biting your ass and won't stop. Pro tip: the duck dies to basically anything short of total incompetence. Your dignity will not recover so easily.",
    prevDescriptions: [
      'This elf hunts in the city and brings the worst possible accessory: a duck call. Blow once and a furious waterfowl attacks your ankles. Pro tip: the duck is incredibly easy to get rid of. Your dignity, less so.',
    ],
    prevNotes: [
      'Full text: Core Rulebook p. 551.',
      "Duck Call: a hit crawler is harassed by a duck and gains Sore as Shit. Any attack on the duck that isn't a Critical Fail kills it or scares it off.\n\nFull text: Core Rulebook p. 551.",
    ],
    descriptionEs:
      'Este elfo caza en la ciudad y trae el peor accesorio posible: un reclamo de patos. Un graznido y un pato cabreadísimo empieza a morderte el culo y no hay quien lo pare. Pro-Tip: el pato muere con casi cualquier cosa que no sea incompetencia absoluta. Tu dignidad no se recuperará tan fácil.',
    prevDescriptionsEs: [
      'Este elfo caza en la ciudad y trae el peor accesorio posible: un reclamo de patos. Un graznido y un pato cabreadísimo empieza a morderte el culo y no hay quien lo pare. Consejo pro: el pato muere con casi cualquier cosa que no sea incompetencia absoluta. Tu dignidad no se recuperará tan fácil.',
    ],
  },
  {
    name: 'City Elf Mechanic',
    kind: 'npc',
    size: 'Medium (4)',
    tags: 'NPC, Humanoid',
    slots: '10',
    slotValue: '5',
    level: '39',
    surprise: '15+F',
    evade: '15+F',
    move: '20+S',
    dr: '5',
    stats: {
      str: {
        score: '30',
        mod: '+5',
      },
      int: {
        score: '30',
        mod: '+5',
      },
      con: {
        score: '30',
        mod: '+5',
      },
      dex: {
        score: '30',
        mod: '+5',
      },
      cha: {
        score: '2',
        mod: '+1',
      },
    },
    attacks: [
      {
        name: 'Wrench',
        toHit: '15+F',
        damage: '5d8+5 Bludgeoning',
        range: '5ft range',
        effect: '',
      },
      {
        name: 'Explosive Exit',
        toHit: '15+F',
        damage: '4d6 Fire',
        range: '10ft Burst radius',
        effect: 'On hit: Burned',
      },
    ],
    notes:
      'See Patterns: can see invisible entities. Crawler effects from the Tactics Skill last only 1 round against it.\nExplosive Exit: used only at 20% HB or less and when the crawlers outnumber it. Hit crawlers gain Burned, then the Elf dies.\n\nFull text: Core Rulebook p. 551.',
    source: 'Core Rulebook p. 551',
    chapter: 'Floor 5 · The Bubbles',
    floor: 5,
    description:
      "Grease-stained, wrench-swinging, and completely unimpressed by your invisibility trick or your clever tactics. Pro tip: when it's nearly dead and outnumbered, it blows itself up and takes a few of you along. Don't crowd around for the finishing blow unless you want to be a charcoal briquette.",
    prevDescriptions: [
      "Grease-stained, wrench-swinging, and completely unimpressed by your invisibility trick. The Mechanic sees through your clever plans too. Pro tip: when it's nearly dead and outnumbered, it goes out with a bang, so don't crowd around for the finishing blow.",
    ],
    prevNotes: [
      'Special: See Patterns. Full text: Core Rulebook p. 551.',
      'See Patterns: can see invisible entities. Crawler effects from the Tactics Skill last only 1 round against it.\nExplosive Exit: used only at 20% HB or less and when the crawlers outnumber it. Hit crawlers gain Burned, then the Elf dies.\n\nFull text: Core Rulebook p. 551.',
    ],
    descriptionEs:
      'Manchado de grasa, repartiendo llavazos y nada impresionado por tu truquito de invisibilidad ni por tus tácticas de listillo. Pro-Tip: cuando está casi muerto y en inferioridad, se hace volar por los aires y se lleva a unos cuantos de vosotros. No os arrejuntéis para darle el golpe de gracia salvo que queráis acabar de carbón para barbacoa.',
    prevDescriptionsEs: [
      'Manchado de grasa, repartiendo llavazos y nada impresionado por tu truquito de invisibilidad ni por tus tácticas de listillo. Consejo pro: cuando está casi muerto y en inferioridad, se hace volar por los aires y se lleva a unos cuantos de vosotros. No os arrejuntéis para darle el golpe de gracia salvo que queráis acabar de carbón para barbacoa.',
    ],
  },
  {
    name: 'Elven Clear-Cutter',
    kind: 'npc',
    size: 'Huge (6)',
    tags: 'NPC, Construct',
    slots: '10',
    slotValue: '6',
    level: '45',
    surprise: '12+F',
    evade: '15+F',
    move: '20+S',
    dr: '7',
    stats: {
      str: {
        score: '55',
        mod: '+6',
      },
      int: {
        score: '5',
        mod: '+2',
      },
      con: {
        score: '55',
        mod: '+6',
      },
      dex: {
        score: '20',
        mod: '+5',
      },
      cha: {
        score: '5',
        mod: '+2',
      },
    },
    attacks: [
      {
        name: 'Buzzsaw',
        toHit: '14+F',
        damage: '4d8+6 Slashing',
        range: '5ft Burst radius',
        effect: '',
      },
      {
        name: 'Arm Blades',
        toHit: '16+F',
        damage: '5d6+6 Slashing',
        range: '15ft range',
        effect: 'Major Fail+: Blood Trail',
      },
    ],
    notes: 'Many-Armed: may trade its Move Action for an attack.\n\nFull text: Core Rulebook p. 552.',
    source: 'Core Rulebook p. 552',
    chapter: 'Floor 5 · The Bubbles',
    floor: 5,
    description:
      "The elves' idea of sustainable forestry: a Huge walking chainsaw with too many arms. It doesn't bother walking when it could be cutting you into deli slices. Pro tip: expect an extra swing whenever it skips its move, and stay out of buzzsaw range unless you want a haircut down to the skull.",
    prevDescriptions: [
      "The elves' idea of forestry: a Huge walking chainsaw with too many arms. It doesn't bother walking when it could be cutting. Pro tip: expect an extra swing every turn, and don't stand in the buzzsaw radius unless you want a haircut down to the bone.",
    ],
    prevNotes: [
      'Special: Many-Armed. Full text: Core Rulebook p. 552.',
      'Many-Armed: may trade its Move Action for an attack.\n\nFull text: Core Rulebook p. 552.',
    ],
    descriptionEs:
      'La idea que tienen los elfos de silvicultura sostenible: una motosierra andante Huge con demasiados brazos. No se molesta en caminar si puede cortarte en lonchas de charcutería. Pro-Tip: espera un tajo extra cada vez que se salte el movimiento, y no te acerques a la sierra circular salvo que quieras un corte de pelo hasta el cráneo.',
    prevDescriptionsEs: [
      'La idea que tienen los elfos de silvicultura sostenible: una motosierra andante Huge con demasiados brazos. No se molesta en caminar si puede cortarte en lonchas de charcutería. Consejo pro: espera un tajo extra cada vez que se salte el movimiento, y no te acerques a la sierra circular salvo que quieras un corte de pelo hasta el cráneo.',
    ],
  },
  {
    name: 'Pterolykos Hunter',
    kind: 'npc',
    size: 'Medium (4)',
    tags: 'NPC, Winged Guardian',
    slots: '10',
    slotValue: '4',
    level: '37',
    surprise: '18+F',
    evade: '15+F',
    move: '20+S',
    dr: '5',
    stats: {
      str: {
        score: '20',
        mod: '+5',
      },
      int: {
        score: '20',
        mod: '+5',
      },
      con: {
        score: '15',
        mod: '+4',
      },
      dex: {
        score: '31',
        mod: '+5',
      },
      cha: {
        score: '30',
        mod: '+5',
      },
    },
    attacks: [
      {
        name: 'Claw',
        toHit: '15+F',
        damage: '5d6+5 Slashing',
        range: '5ft range',
        effect: '',
      },
      {
        name: 'Mom’s Rifle',
        toHit: '15+F',
        damage: '4d8 Piercing',
        range: '200ft range',
        effect: 'On hit: Blood Trail',
      },
    ],
    notes:
      'Aerial Ambush: if not surprised, it attacks with Advantage during round 1 of combat.\n\nFull text: Core Rulebook p. 552.',
    source: 'Core Rulebook p. 552',
    chapter: 'Floor 5 · The Bubbles',
    floor: 5,
    description:
      "Wolf head, bat wings, and Mom's hunting rifle. Somebody's family tree has some fucking explaining to do. They drop out of the clouds at 200 feet and the first round is theirs unless you see them coming. Pro tip: look up. The last crawler who didn't is still being picked out of a nest.",
    prevDescriptions: [
      "Half wolf, half pterodactyl, all bad news. They drop out of the sky with claws out and a family heirloom rifle that shoots from 200 feet. Pro tip: don't get caught flat-footed. The first round belongs to them, and they know it.",
    ],
    prevNotes: [
      'Special: Aerial Ambush. Full text: Core Rulebook p. 552.',
      'Aerial Ambush: if not surprised, it attacks with Advantage during round 1 of combat.\n\nFull text: Core Rulebook p. 552.',
    ],
    descriptionEs:
      'Cabeza de lobo, alas de murciélago y el rifle de caza de mamá. Alguien tiene que dar unas putas explicaciones sobre su árbol genealógico. Caen de las nubes desde 200 pies y el primer asalto es suyo salvo que los veas venir. Pro-Tip: mira hacia arriba. Al último crawler que no lo hizo todavía lo están sacando a trocitos de un nido.',
    prevDescriptionsEs: [
      'Cabeza de lobo, alas de murciélago y el rifle de caza de mamá. Alguien tiene que dar unas putas explicaciones sobre su árbol genealógico. Caen de las nubes desde 200 pies y el primer asalto es suyo salvo que los veas venir. Consejo pro: mira hacia arriba. Al último crawler que no lo hizo todavía lo están sacando a trocitos de un nido.',
    ],
  },
  {
    name: 'Pterolykos Elder',
    kind: 'npc',
    size: 'Medium (4)',
    tags: 'NPC, Winged Guardian',
    slots: '10',
    slotValue: '5',
    level: '50',
    surprise: '18+F',
    evade: '16+F',
    move: '20+S',
    dr: '5',
    stats: {
      str: {
        score: '25',
        mod: '+5',
      },
      int: {
        score: '25',
        mod: '+5',
      },
      con: {
        score: '20',
        mod: '+5',
      },
      dex: {
        score: '52',
        mod: '+6',
      },
      cha: {
        score: '33',
        mod: '+5',
      },
    },
    attacks: [
      {
        name: 'Claws',
        toHit: '15+F',
        damage: '5d6+5 Slashing',
        range: '5ft range',
        effect: '',
      },
      {
        name: 'Rifle',
        toHit: '15+F',
        damage: '4d8 Piercing',
        range: '200ft range',
        effect: 'On hit: Blood Trail',
      },
    ],
    notes:
      'Aerial Ambush: if not surprised, it attacks with Advantage during round 1 of combat.\n\nFull text: Core Rulebook p. 556.',
    source: 'Core Rulebook p. 556',
    chapter: 'Floor 5 · The Bubbles',
    floor: 5,
    description:
      "The Elder has survived fifty levels of dumbasses like you, and it's gotten real good at turning them into confetti from 200 feet. Same aerial ambush, same rifle, way less patience. Pro tip: if you're not surprised, you might live through round one. Might. The sponsors have a pool going.",
    prevDescriptions: [
      'Level 50 and still flying circles over the young ones like a helicopter parent with a gun. The Elder has seen a thousand crawlers bleed out below. Pro tip: bring cover and be ready on turn one, because grandpa never misses the opening act.',
    ],
    prevNotes: [
      'Special: Aerial Ambush. Full text: Core Rulebook p. 556.',
      'Aerial Ambush: if not surprised, it attacks with Advantage during round 1 of combat.\n\nFull text: Core Rulebook p. 556.',
    ],
    descriptionEs:
      'El Elder ha sobrevivido a cincuenta niveles de gilipollas como tú, y se le da de puta madre convertirlos en confeti desde 200 pies. La misma emboscada aérea, el mismo rifle, mucha menos paciencia. Pro-Tip: si no te pillan por sorpresa, a lo mejor sobrevives al primer asalto. A lo mejor. Los patrocinadores ya tienen una porra montada.',
    prevDescriptionsEs: [
      'El Elder ha sobrevivido a cincuenta niveles de gilipollas como tú, y se le da de puta madre convertirlos en confeti desde 200 pies. La misma emboscada aérea, el mismo rifle, mucha menos paciencia. Consejo pro: si no te pillan por sorpresa, a lo mejor sobrevives al primer asalto. A lo mejor. Los patrocinadores ya tienen una porra montada.',
    ],
  },
  {
    name: 'Human Swashbuckler',
    kind: 'crawler',
    size: 'Medium (4)',
    tags: 'Humanoid',
    slots: '10',
    slotValue: '4',
    level: '37',
    surprise: '15+F',
    evade: '15+F',
    move: '20+S',
    dr: '5',
    stats: {
      str: {
        score: '20',
        mod: '+5',
      },
      int: {
        score: '20',
        mod: '+5',
      },
      con: {
        score: '15',
        mod: '+4',
      },
      dex: {
        score: '31',
        mod: '+5',
      },
      cha: {
        score: '30',
        mod: '+5',
      },
    },
    attacks: [
      {
        name: 'Saber',
        toHit: '15+F',
        damage: '5d6+5 Slashing',
        range: '5ft range',
        effect: '',
      },
      {
        name: 'Blunderbuss',
        toHit: '15+F',
        damage: '4d8 Piercing',
        range: '25ft Cone',
        effect: 'Blood Trail',
      },
    ],
    notes: 'Full text: Core Rulebook p. 557.',
    source: 'Core Rulebook p. 557',
    chapter: 'Floor 5 · The Bubbles',
    floor: 5,
    description:
      "Frilly shirt, big hat, saber, and a blunderbuss that sprays a 25-foot cone of 'oh shit.' He swings from chandeliers purely for the ratings. Pro tip: don't bunch up in front of him. Grouping together is how you turn a party into a single, very wet stain.",
    prevDescriptions: [
      "Behold, our dashing Swashbuckler! Saber in one hand, blunderbuss in the other, and absolutely no plan beyond looking cool doing it. That cone spray leaves anyone who can't dodge leaking like a sieve. Viewers, the betting pool says he dies mid-monologue.",
    ],
    prevNotes: ['Full text: Core Rulebook p. 557.'],
    descriptionEs:
      'Camisa con chorreras, sombrero enorme, sable y un trabuco que escupe un cono de 25 pies de «me cago en todo». Se columpia de las lámparas únicamente por la audiencia. Pro-Tip: no os agrupéis delante de él. Así es como se convierte un grupo de aventureros en una única mancha muy húmeda.',
    prevDescriptionsEs: [
      'Camisa con chorreras, sombrero enorme, sable y un trabuco que escupe un cono de 25 pies de «me cago en todo». Se columpia de las lámparas únicamente por la audiencia. Consejo pro: no os agrupéis delante de él. Así es como se convierte un grupo de aventureros en una única mancha muy húmeda.',
    ],
  },
  {
    name: 'Human Gunslinger',
    kind: 'crawler',
    size: 'Medium (4)',
    tags: 'Humanoid',
    slots: '10',
    slotValue: '4',
    level: '37',
    surprise: '18+F',
    evade: '15+F',
    move: '20+S',
    dr: '5',
    stats: {
      str: {
        score: '20',
        mod: '+5',
      },
      int: {
        score: '20',
        mod: '+5',
      },
      con: {
        score: '15',
        mod: '+4',
      },
      dex: {
        score: '31',
        mod: '+5',
      },
      cha: {
        score: '30',
        mod: '+5',
      },
    },
    attacks: [
      {
        name: 'Punch',
        toHit: '15+F',
        damage: '5d6+5 Bludgeoning',
        range: '5ft range',
        effect: '',
      },
      {
        name: 'NES Zapper',
        toHit: '15+F',
        damage: '4d8 Force',
        range: '40ft range',
        effect: 'On hit: Blood Trail',
      },
    ],
    notes: 'Full text: Core Rulebook p. 557.',
    source: 'Core Rulebook p. 557',
    chapter: 'Floor 5 · The Bubbles',
    floor: 5,
    description:
      "He punches like a truck and his gun is a plastic NES Zapper that somehow fires pure Force. Nobody at production can explain it, and legal told us to stop asking. Pro tip: that duck-hunting toy reaches 40 feet. You're the duck now, asshole. Quack for the viewers.",
    prevDescriptions: [
      'This Gunslinger brought an NES Zapper to a death dungeon, and honestly? Respect. It fires Force damage at 40 feet and makes the ducks nervous. When it runs dry, he just punches you. Odds of survival: roughly the same as beating the dog in Duck Hunt.',
    ],
    prevNotes: ['Full text: Core Rulebook p. 557.'],
    descriptionEs:
      'Pega como un camión y su pistola es una NES Zapper de plástico que, no se sabe cómo, dispara Force pura. Nadie en producción sabe explicarlo, y los de legal nos han dicho que dejemos de preguntar. Pro-Tip: ese juguete de cazar patos llega a 40 pies. Ahora el pato eres tú, cabrón. Haz cuac para los espectadores.',
    prevDescriptionsEs: [
      'Pega como un camión y su pistola es una NES Zapper de plástico que, no se sabe cómo, dispara Force pura. Nadie en producción sabe explicarlo, y los de legal nos han dicho que dejemos de preguntar. Consejo pro: ese juguete de cazar patos llega a 40 pies. Ahora el pato eres tú, cabrón. Haz cuac para los espectadores.',
    ],
  },
  {
    name: 'Propper',
    kind: 'boss',
    size: 'Large (5)',
    tags: 'Neighborhood Boss, Spring-Operated Chick-',
    slots: '8',
    slotValue: '6',
    level: '70',
    surprise: '15+F',
    evade: '16+F',
    move: '20+S',
    dr: '5',
    stats: {
      str: {
        score: '50',
        mod: '+6',
      },
      int: {
        score: '20',
        mod: '+5',
      },
      con: {
        score: '65',
        mod: '+6',
      },
      dex: {
        score: '70',
        mod: '+6',
      },
      cha: {
        score: '30',
        mod: '+5',
      },
    },
    attacks: [
      {
        name: 'Dive Bomb',
        toHit: '15+F',
        damage: '5d6+5 Fire',
        range: '30ft range, 10ft',
        effect: 'once per round',
      },
      {
        name: 'Downwash',
        toHit: '15+F',
        damage: '6d10+5 Force',
        range: '60ft range, 20ft Splash',
        effect: 'Special effect',
      },
      {
        name: 'Propeller Blast',
        toHit: '15+F',
        damage: '7d8+5 Force',
        range: '60ft range',
        effect: 'Special effect',
      },
    ],
    notes:
      'Flying High: hovers 60ft off the ground; melee weapons are all but useless.\nJammed: a rotor can be jammed with a sturdy object of Petite (3) size or larger. When any propeller jams, Propper instantly loses 2 HB slots and drops 20ft.\nOff the Cliff: a crawler who goes over the cliff edge falls for two rounds and may act during the fall, then hits the bottom and dies.\nDive Bomb: used only in round 1, or once Propper is at 50% HB or less (then at least once per round). Hits a 10ft blast.\nDownwash: pure Splash (half damage). Hit crawlers slide 5ft per HB slot lost.\nPropeller Blast: hit crawlers are pushed 5ft per HB slot lost.\n\nFull text: Core Rulebook p. 558.',
    source: 'Core Rulebook p. 558',
    chapter: 'Floor 5 · The Bubbles',
    floor: 5,
    description:
      'A spring-loaded chick with helicopter blades, because the budget for a real dragon went to my yacht. Propper hovers 60 feet up, blowing you around and dropping firebombs. Pro tip: jam something sturdy in those rotors and watch it crash. Or get blown off the cliff and scream for two whole rounds. Either way, great TV.',
    prevDescriptions: [
      'A spring-loaded chick with helicopter blades, because the budget committee said no to a real dragon. Propper hangs 60 feet up, blasting wind and dropping firebombs. Pro tip: shove something sturdy into those rotors. Gravity does the rest, and the cliff edge is right there for whoever loses.',
    ],
    prevNotes: [
      'Special: Flying High; Jammed; Off the Cliff. Full text: Core Rulebook p. 558.',
      'Flying High: hovers 60ft off the ground; melee weapons are all but useless.\nJammed: a rotor can be jammed with a sturdy object of Petite (3) size or larger. When any propeller jams, Propper instantly loses 2 HB slots and drops 20ft.\nOff the Cliff: a crawler who goes over the cliff edge falls for two rounds and may act during the fall, then hits the bottom and dies.\nDive Bomb: used only in round 1, or once Propper is at 50% HB or less (then at least once per round). Hits a 10ft blast.\nDownwash: pure Splash (half damage). Hit crawlers slide 5ft per HB slot lost.\nPropeller Blast: hit crawlers are pushed 5ft per HB slot lost.\n\nFull text: Core Rulebook p. 558.',
    ],
    descriptionEs:
      'Un pollito con muelle y aspas de helicóptero, porque el presupuesto para un dragón de verdad se fue en mi yate. Propper flota a 60 pies, te zarandea con el viento y te suelta bombas incendiarias. Pro-Tip: métele algo resistente en los rotores y mira cómo se estampa. O sal volando por el acantilado y pégate dos asaltos enteros gritando. Sea como sea, televisión de primera.',
    prevDescriptionsEs: [
      'Un pollito con muelle y aspas de helicóptero, porque el presupuesto para un dragón de verdad se fue en mi yate. Propper flota a 60 pies, te zarandea con el viento y te suelta bombas incendiarias. Consejo pro: métele algo resistente en los rotores y mira cómo se estampa. O sal volando por el acantilado y pégate dos asaltos enteros gritando. Sea como sea, televisión de primera.',
    ],
  },
  {
    name: 'Pet Ghast',
    kind: 'mob',
    size: 'Medium (4)',
    tags: 'Undead',
    slots: '10',
    slotValue: '5',
    level: '35',
    surprise: '12+F',
    evade: '15+F',
    move: '20+S',
    dr: '5',
    stats: {
      str: {
        score: '37',
        mod: '+5',
      },
      int: {
        score: '5',
        mod: '+2',
      },
      con: {
        score: '31',
        mod: '+5',
      },
      dex: {
        score: '36',
        mod: '+5',
      },
      cha: {
        score: '1',
        mod: '+1',
      },
    },
    attacks: [
      {
        name: 'Bite',
        toHit: '15+F',
        damage: '5d8+5 Necrotic',
        range: '5ft range',
        effect: 'Major Fail+: Poisoned',
      },
      {
        name: 'Putrid Vomit',
        toHit: '14+F',
        damage: '3d6 Acid',
        range: '15ft Cone',
        effect: 'On hit: Acid',
      },
    ],
    notes:
      'New Unlife: a foe killed by either of its attacks rises as a Ghast and joins the group.\nPutrid Vomit: hit crawlers gain the Acid Debuff, taking 1d8+F Acid at the end of each round for 2 rounds.\n\nFull text: Core Rulebook p. 561.',
    source: 'Core Rulebook p. 561',
    chapter: 'Floor 5 · The Bubbles',
    floor: 5,
    description:
      "Somebody's pet, which is adorable, until it pukes acid on your face and eats your buddy. And then your buddy gets back up as a Ghast and joins the pack. Pro tip: don't die near it. It's recruiting, and the benefits package is rotting.",
    prevDescriptions: [
      "Aww, who's a good ghoul? This one! It bites, it vomits acid, and anyone it kills gets drafted into the pack. It's like a pyramid scheme, but with rotting flesh. Pro tip: don't die near it unless you want a new career in fetch.",
    ],
    prevNotes: [
      'Special: New Unlife. Full text: Core Rulebook p. 561.',
      'New Unlife: a foe killed by either of its attacks rises as a Ghast and joins the group.\nPutrid Vomit: hit crawlers gain the Acid Debuff, taking 1d8+F Acid at the end of each round for 2 rounds.\n\nFull text: Core Rulebook p. 561.',
    ],
    descriptionEs:
      'La mascota de alguien, qué monada, hasta que te vomita ácido en la cara y se come a tu colega. Y luego tu colega se levanta convertido en Ghast y se une a la manada. Pro-Tip: no te mueras cerca de él. Está reclutando, y el paquete de beneficios consiste en pudrirse.',
    prevDescriptionsEs: [
      'La mascota de alguien, qué monada, hasta que te vomita ácido en la cara y se come a tu colega. Y luego tu colega se levanta convertido en Ghast y se une a la manada. Consejo pro: no te mueras cerca de él. Está reclutando, y el paquete de beneficios consiste en pudrirse.',
    ],
  },
  {
    name: 'Ghommid',
    kind: 'npc',
    size: 'Large (5)',
    tags: 'NPC, Undead',
    slots: '10',
    slotValue: '6',
    level: '53',
    surprise: '14+F',
    evade: '15+F',
    move: '20+S',
    dr: '5',
    stats: {
      str: {
        score: '51',
        mod: '+6',
      },
      int: {
        score: '15',
        mod: '+4',
      },
      con: {
        score: '52',
        mod: '+6',
      },
      dex: {
        score: '41',
        mod: '+5',
      },
      cha: {
        score: '5',
        mod: '+2',
      },
    },
    attacks: [
      {
        name: 'Claw',
        toHit: '16+F',
        damage: '5d8+6 Bludgeoning',
        range: '5ft range',
        effect: '',
      },
      {
        name: 'Intestinal Tentacle',
        toHit: '15+F',
        damage: '4d6+6 Bludgeoning',
        range: '10ft range',
        effect: 'On hit: Held',
      },
    ],
    notes: 'Full text: Core Rulebook p. 561.',
    source: 'Core Rulebook p. 561',
    chapter: 'Floor 5 · The Bubbles',
    floor: 5,
    description:
      'A shambling corpse that fights with its own intestines as a whip. Yes, the guts reach 10 feet. Yes, it smells exactly like you think. Pro tip: nothing fancy here, just a meat-bag that hits like a garbage truck. Keep your distance or get slapped with colon.',
    prevDescriptions: [
      'Big, dead, and dangling its own intestines like a lasso. The Ghommid grabs you with its guts and pounds you with its claws, which is two more things than I wanted to know about its anatomy. Viewers, please keep your lunches down.',
    ],
    prevNotes: ['Full text: Core Rulebook p. 561.'],
    descriptionEs:
      'Un cadáver tambaleante que pelea usando sus propios intestinos como látigo. Sí, las tripas llegan a 10 pies. Sí, huele exactamente como te imaginas. Pro-Tip: aquí no hay nada rebuscado, solo un saco de carne que pega como un camión de la basura. Mantén las distancias o te llevarás un zurriagazo de colon.',
    prevDescriptionsEs: [
      'Un cadáver tambaleante que pelea usando sus propios intestinos como látigo. Sí, las tripas llegan a 10 pies. Sí, huele exactamente como te imaginas. Consejo pro: aquí no hay nada rebuscado, solo un saco de carne que pega como un camión de la basura. Mantén las distancias o te llevarás un zurriagazo de colon.',
    ],
  },
  {
    name: 'Igneous',
    kind: 'npc',
    size: 'Medium (5)',
    tags: 'NPC, Earth Elemental',
    slots: '10',
    slotValue: '5',
    level: '37',
    surprise: '15+F',
    evade: '14+F',
    move: '20+S',
    dr: '5',
    stats: {
      str: {
        score: '34',
        mod: '+5',
      },
      int: {
        score: '21',
        mod: '+5',
      },
      con: {
        score: '27',
        mod: '+5',
      },
      dex: {
        score: '19',
        mod: '+4',
      },
      cha: {
        score: '15',
        mod: '+4',
      },
    },
    attacks: [
      {
        name: 'Stones Throw',
        toHit: '14+F',
        damage: '5d8+5 Bludgeoning',
        range: '30ft range',
        effect: '',
      },
      {
        name: 'Rocky Rumble',
        toHit: '15+F',
        damage: '4d6+5 Bludgeoning',
        range: '5ft range',
        effect: 'Special effect',
      },
    ],
    notes:
      'Hot Stuff: a crawler adjacent to an Igneous who makes two attacks in one round takes 1d10+F Fire damage.\nRocky Rumble: hit crawlers are pushed 5ft per HB slot lost.\n\nFull text: Core Rulebook p. 562.',
    source: 'Core Rulebook p. 562',
    chapter: 'Floor 5 · The Bubbles',
    floor: 5,
    description:
      'A walking pile of hot rocks with anger issues. It throws boulders, shoves you around, and if you stand next to it swinging twice a round, it cooks your hands. Pro tip: one good hit beats two sloppy ones. Rock-roasted crawler knuckles are a delicacy on three planets.',
    prevDescriptions: [
      "A walking pile of cooled lava that never fully cooled. Get up close and go for the flurry, and you'll learn why they call it igneous. Pro tip: one swing at a time, sweetie. Your fingers will thank you, or at least stay attached.",
    ],
    prevNotes: [
      'Special: Hot Stuff. Full text: Core Rulebook p. 562.',
      'Hot Stuff: a crawler adjacent to an Igneous who makes two attacks in one round takes 1d10+F Fire damage.\nRocky Rumble: hit crawlers are pushed 5ft per HB slot lost.\n\nFull text: Core Rulebook p. 562.',
    ],
    descriptionEs:
      'Un montón andante de rocas al rojo vivo con problemas de gestión de la ira. Lanza pedruscos, te empuja de un lado a otro y, si te plantas a su lado dando dos golpes por asalto, te cuece las manos. Pro-Tip: un buen golpe vale más que dos chapuceros. Los nudillos de crawler asados a la piedra son un manjar en tres planetas.',
    prevDescriptionsEs: [
      'Un montón andante de rocas al rojo vivo con problemas de gestión de la ira. Lanza pedruscos, te empuja de un lado a otro y, si te plantas a su lado dando dos golpes por asalto, te cuece las manos. Consejo pro: un buen golpe vale más que dos chapuceros. Los nudillos de crawler asados a la piedra son un manjar en tres planetas.',
    ],
  },
  {
    name: 'Night Elf Hunter',
    kind: 'npc',
    size: 'Medium (4)',
    tags: 'NPC, Humanoid',
    slots: '10',
    slotValue: '5',
    level: '42',
    surprise: '15+F',
    evade: '15+F',
    move: '20+S',
    dr: '5',
    stats: {
      str: {
        score: '34',
        mod: '+5',
      },
      int: {
        score: '20',
        mod: '+5',
      },
      con: {
        score: '21',
        mod: '+5',
      },
      dex: {
        score: '35',
        mod: '+5',
      },
      cha: {
        score: '21',
        mod: '+5',
      },
    },
    attacks: [
      {
        name: 'Katana',
        toHit: '15+F',
        damage: '5d8+5 Slashing',
        range: '5ft range',
        effect: '',
      },
      {
        name: 'Crossbow',
        toHit: '14+F',
        damage: '3d8 Piercing',
        range: '30ft range',
        effect: 'On hit: Blood Trail',
      },
    ],
    notes: 'UV Fungus: against Undead, its damage dice become d10s instead of d8s.\n\nFull text: Core Rulebook p. 562.',
    source: 'Core Rulebook p. 562',
    chapter: 'Floor 5 · The Bubbles',
    floor: 5,
    description:
      "Tall, broody, sword on the back, and a crossbow for backup. These elves hunt the undead with glowing fungus, which sounds like a shitty cologne but works great. Pro tip: if you're a corpse-type, those d8s become d10s. Everyone else, just dodge the pointy end.",
    prevDescriptions: [
      "Night Elves who grow ultraviolet mushrooms and use them to make vampires very, very uncomfortable. Katana up close, crossbow at range, and a serious grudge against anything with a pulse problem. If you're undead, run. If you're not, still run. It's funnier.",
    ],
    prevNotes: [
      'Special: UV Fungus. Full text: Core Rulebook p. 562.',
      'UV Fungus: against Undead, its damage dice become d10s instead of d8s.\n\nFull text: Core Rulebook p. 562.',
    ],
    descriptionEs:
      'Alto, taciturno, espada a la espalda y una ballesta de reserva. Estos elfos cazan no muertos con hongos luminosos, que suena a colonia de mierda pero funciona de maravilla. Pro-Tip: si eres de tipo cadáver, esos d8 se convierten en d10. Los demás, simplemente esquivad la parte que pincha.',
    prevDescriptionsEs: [
      'Alto, taciturno, espada a la espalda y una ballesta de reserva. Estos elfos cazan no muertos con hongos luminosos, que suena a colonia de mierda pero funciona de maravilla. Consejo pro: si eres de tipo cadáver, esos d8 se convierten en d10. Los demás, simplemente esquivad la parte que pincha.',
    ],
  },
  {
    name: 'Vampire',
    kind: 'npc',
    size: 'Medium (4)',
    tags: 'NPC, Undead',
    slots: '10',
    slotValue: '5',
    level: '55',
    surprise: '15+F',
    evade: '15+F',
    move: '20+S',
    dr: '5',
    stats: {
      str: {
        score: '38',
        mod: '+5',
      },
      int: {
        score: '22',
        mod: '+5',
      },
      con: {
        score: '36',
        mod: '+5',
      },
      dex: {
        score: '35',
        mod: '+5',
      },
      cha: {
        score: '39',
        mod: '+5',
      },
    },
    attacks: [
      {
        name: 'Vampiric Embrace',
        toHit: '15+F',
        damage: '5d6+5 Piercing',
        range: '5ft range',
        effect: 'Special effect',
      },
      {
        name: 'Hypnotism Spell',
        toHit: '15+F',
        damage: 'No damage',
        range: '20ft range',
        effect: 'On hit: Hypnotized',
      },
    ],
    notes:
      "Ghastly Unlife: crawler slain by it → returns as Pet Ghast tied to Kesla's Soul Crystal pendant.\nVampiric Embrace: Vampire regains 1 HB slot per 3 HB slots dealt.\nHypnotism Spell: looking away counts as Evade. Hit → Int Stat Check; fail → Hypnotized (mind control): no attacks or Evades. Spend 1 Action per round rerolling the check to snap out.\n\nFull text: Core Rulebook p. 562.",
    source: 'Core Rulebook p. 562',
    chapter: 'Floor 5 · The Bubbles',
    floor: 5,
    description:
      "Classic bloodsucker: bites you, gets healthier, and hypnotizes you into standing there like a moron while it does it. Die to one and you come back as somebody's pet Ghast. Pro tip: don't make eye contact. Seriously, look at the floor, it works. Your mom was right about staring.",
    prevDescriptions: [
      'Classic vampire package: pale, hungry, and way too into eye contact. It drinks you to heal itself and hypnotizes the rest. Pro tip: stare at your shoes. Also, dying here means an eternity as a pet. Not the good kind with the little bed.',
    ],
    prevNotes: [
      'Special: Ghastly Unlife. Full text: Core Rulebook p. 562.',
      "Ghastly Unlife: crawler slain by it → returns as Pet Ghast tied to Kesla's Soul Crystal pendant.\nVampiric Embrace: Vampire regains 1 HB slot per 3 HB slots dealt.\nHypnotism Spell: looking away counts as Evade. Hit → Int Stat Check; fail → Hypnotized (mind control): no attacks or Evades. Spend 1 Action per round rerolling the check to snap out.\n\nFull text: Core Rulebook p. 562.",
    ],
    descriptionEs:
      'Chupasangres clásico: te muerde, se pone más sano y te hipnotiza para que te quedes ahí plantado como un imbécil mientras lo hace. Muere a manos de uno y volverás como el Ghast de mascota de alguien. Pro-Tip: no le mires a los ojos. En serio, mira al suelo, funciona. Tu madre tenía razón con lo de no quedarse mirando.',
    prevDescriptionsEs: [
      'Chupasangres clásico: te muerde, se pone más sano y te hipnotiza para que te quedes ahí plantado como un imbécil mientras lo hace. Muere a manos de uno y volverás como el Ghast de mascota de alguien. Consejo pro: no le mires a los ojos. En serio, mira al suelo, funciona. Tu madre tenía razón con lo de no quedarse mirando.',
    ],
  },
  {
    name: 'Countess Kesla',
    kind: 'boss',
    size: 'Medium (4)',
    tags: 'Neighborhood Boss, Undead Humanoid',
    slots: '8',
    slotValue: '5',
    level: '60',
    surprise: '15+F',
    evade: '15+F',
    move: '20+S',
    dr: '5',
    stats: {
      str: {
        score: '50',
        mod: '+6',
      },
      int: {
        score: '28',
        mod: '+5',
      },
      con: {
        score: '42',
        mod: '+5',
      },
      dex: {
        score: '35',
        mod: '+5',
      },
      cha: {
        score: '50',
        mod: '+6',
      },
    },
    attacks: [
      {
        name: 'Blood Boil Spell',
        toHit: '15+F',
        damage: '5d8+5 Necrotic',
        range: '50ft range',
        effect: 'Major Fail+: Fatigued',
      },
      {
        name: 'Feral Bite',
        toHit: '16+F',
        damage: '5d6+6 Piercing',
        range: '5ft range',
        effect: 'Special effect',
      },
    ],
    notes:
      'Blood Makes Noise: at 60% HB and again at 20% HB or less, Kesla gains 1 extra Action, usually spent releasing more Pet Ghasts (only while she has her pendant).\nPendant: a crawler may make a melee attack with Disadvantage to cut or snatch the pendant. Without it she cannot release Pet Ghasts.\nFeral Bite: Kesla heals 1 HB slot for every 2 HB slots the target loses.\n\nFull text: Core Rulebook p. 568.',
    source: 'Core Rulebook p. 568',
    chapter: 'Floor 5 · The Bubbles',
    floor: 5,
    description:
      'The Countess has a pendant full of pet Ghasts, a bite that refills her tank, and a spell that boils your blood from 50 feet. She gets extra pissed at 60% and again at 20%. Pro tip: snatch the goddamn necklace. No jewelry, no zombie dogs. Fashion is brutal.',
    prevDescriptions: [
      "The Countess! Old money, older teeth. She keeps a pendant full of pet ghouls and releases them whenever things get dicey. Pro tip: that necklace is the whole show. Snatch it and she's just a very angry lady with a bite habit. Easier said than done, darling.",
    ],
    prevNotes: [
      'Special: Blood Makes Noise; Pendant. Full text: Core Rulebook p. 568.',
      'Blood Makes Noise: at 60% HB and again at 20% HB or less, Kesla gains 1 extra Action, usually spent releasing more Pet Ghasts (only while she has her pendant).\nPendant: a crawler may make a melee attack with Disadvantage to cut or snatch the pendant. Without it she cannot release Pet Ghasts.\nFeral Bite: Kesla heals 1 HB slot for every 2 HB slots the target loses.\n\nFull text: Core Rulebook p. 568.',
    ],
    descriptionEs:
      'La Condesa tiene un colgante lleno de Ghasts de mascota, un mordisco que le rellena el depósito y un hechizo que te hace hervir la sangre a 50 pies. Se cabrea más al 60% y otra vez al 20%. Pro-Tip: arráncale el puto collar. Sin joyas, no hay perros zombis. La moda es brutal.',
    prevDescriptionsEs: [
      'La Condesa tiene un colgante lleno de Ghasts de mascota, un mordisco que le rellena el depósito y un hechizo que te hace hervir la sangre a 50 pies. Se cabrea más al 60% y otra vez al 20%. Consejo pro: arráncale el puto collar. Sin joyas, no hay perros zombis. La moda es brutal.',
    ],
  },
  {
    name: 'Big Boy Blue',
    kind: 'mob',
    size: 'Huge (6)',
    tags: 'Beast',
    slots: '10',
    slotValue: '5',
    level: '40',
    surprise: '13+F',
    evade: '15+F',
    move: '20+S',
    dr: '5',
    stats: {
      str: {
        score: '43',
        mod: '+5',
      },
      int: {
        score: '6',
        mod: '+3',
      },
      con: {
        score: '35',
        mod: '+5',
      },
      dex: {
        score: '25',
        mod: '+5',
      },
      cha: {
        score: '16',
        mod: '+4',
      },
    },
    attacks: [
      {
        name: 'Sting',
        toHit: '15+F',
        damage: '5d8+5 Piercing',
        range: '30ft Line',
        effect: 'Major Fail+: Poisoned',
      },
    ],
    notes: 'Full text: Core Rulebook p. 571.',
    source: 'Core Rulebook p. 571',
    chapter: 'Floor 5 · The Bubbles',
    floor: 5,
    description:
      "It's big. It's blue. It has a stinger that shoots a 30-foot line straight through your spleen. That's the whole bit, folks. Pro tip: don't stand in a row like ducklings. One sting, three kebabs, and the sponsors love a combo.",
    prevDescriptions: [
      'Big Boy Blue is huge, blue, and has a stinger that reaches 30 feet in a straight line. Subtle, he is not. Poison is his love language. Stand next to your least favorite teammate so he has options.',
    ],
    prevNotes: ['Full text: Core Rulebook p. 571.'],
    descriptionEs:
      'Es grande. Es azul. Tiene un aguijón que dispara una línea de 30 pies directa a tu bazo. Y eso es todo el número, amigos. Pro-Tip: no os pongáis en fila como patitos. Un aguijonazo, tres pinchos morunos, y a los patrocinadores les encantan los combos.',
    prevDescriptionsEs: [
      'Es grande. Es azul. Tiene un aguijón que dispara una línea de 30 pies directa a tu bazo. Y eso es todo el número, amigos. Consejo pro: no os pongáis en fila como patitos. Un aguijonazo, tres pinchos morunos, y a los patrocinadores les encantan los combos.',
    ],
  },
  {
    name: 'Concierge Shark',
    kind: 'mob',
    size: 'Large (5)',
    tags: 'Beast',
    slots: '10',
    slotValue: '5',
    level: '41',
    surprise: '13+F',
    evade: '15+F',
    move: '35+S',
    dr: '5',
    stats: {
      str: {
        score: '47',
        mod: '+5',
      },
      int: {
        score: '6',
        mod: '+3',
      },
      con: {
        score: '42',
        mod: '+5',
      },
      dex: {
        score: '25',
        mod: '+5',
      },
      cha: {
        score: '8',
        mod: '+3',
      },
    },
    attacks: [
      {
        name: 'Bite',
        toHit: '15+F',
        damage: '5d8+5 Piercing',
        range: '5ft range',
        effect: 'Major Fail+: Blood Trail',
      },
    ],
    notes:
      'Feeding Frenzy: any foe of the sharks at ≤50% HB or carrying Blood Trail → Concierge Sharks may swap Move Action for an attack.\n\nFull text: Core Rulebook p. 572.',
    source: 'Core Rulebook p. 572',
    chapter: 'Floor 5 · The Bubbles',
    floor: 5,
    description:
      "Welcome to the hotel! Your concierge is a shark. Tip generously, because once you're bleeding or under half health, it skips the walk and bites twice as often. Pro tip: bandage up before the frenzy starts, or you're room service.",
    prevDescriptions: [
      "Welcome to the resort! Your concierge will be happy to take your bags, your arm, and possibly your torso. Five stars, would eat again. Pro tip: don't bleed. The moment you do, the service gets very attentive.",
    ],
    prevNotes: [
      'Special: Feeding Frenzy. Full text: Core Rulebook p. 572.',
      'Feeding Frenzy: any foe of the sharks at ≤50% HB or carrying Blood Trail → Concierge Sharks may swap Move Action for an attack.\n\nFull text: Core Rulebook p. 572.',
    ],
    descriptionEs:
      '¡Bienvenidos al hotel! Vuestro conserje es un tiburón. Dejad buena propina, porque en cuanto sangréis o bajéis de la mitad de salud, se salta el paseo y muerde el doble. Pro-Tip: véndate antes de que empiece el frenesí, o acabarás siendo el servicio de habitaciones.',
    prevDescriptionsEs: [
      '¡Bienvenidos al hotel! Vuestro conserje es un tiburón. Dejad buena propina, porque en cuanto sangréis o bajéis de la mitad de salud, se salta el paseo y muerde el doble. Consejo pro: véndate antes de que empiece el frenesí, o acabarás siendo el servicio de habitaciones.',
    ],
  },
  {
    name: 'Juvenile Octo-shark',
    kind: 'mob',
    size: 'Large (5)',
    tags: 'Beast',
    slots: '10',
    slotValue: '5',
    level: '30',
    surprise: '13+F',
    evade: '15+F',
    move: '25+S',
    dr: '5',
    stats: {
      str: {
        score: '43',
        mod: '+5',
      },
      int: {
        score: '6',
        mod: '+3',
      },
      con: {
        score: '35',
        mod: '+5',
      },
      dex: {
        score: '25',
        mod: '+5',
      },
      cha: {
        score: '16',
        mod: '+4',
      },
    },
    attacks: [
      {
        name: 'Bite',
        toHit: '15+F',
        damage: '5d6+5 Piercing',
        range: '5ft range',
        effect: 'Major Fail+: Blood Trail',
      },
      {
        name: 'Tentacle',
        toHit: '15+F',
        damage: '3d6+5 Bludgeoning',
        range: '10ft range',
        effect: 'On hit: Held',
      },
    ],
    notes: 'Full text: Core Rulebook p. 572.',
    source: 'Core Rulebook p. 572',
    chapter: 'Floor 5 · The Bubbles',
    floor: 5,
    description:
      "A baby shark with tentacles. Doo doo doo, you're dead. It bites up close and grabs from 10 feet, and it's still growing, which should scare the shit out of you. Pro tip: kill it now. You really don't want to meet Mom.",
    prevDescriptions: [
      "Somebody crossed an octopus and a shark, and the kids are already a handful. Literally eight handfuls. The tentacles grab, the teeth follow. Relax, it's only a juvenile. Mom is much, much bigger.",
    ],
    prevNotes: ['Full text: Core Rulebook p. 572.'],
    descriptionEs:
      'Un tiburón bebé con tentáculos. Baby shark, turu-turu, estás muerto. Muerde cuerpo a cuerpo y te agarra desde 10 pies, y todavía está creciendo, cosa que debería acojonarte. Pro-Tip: mátalo ya. No quieres conocer a su madre, créeme.',
    prevDescriptionsEs: [
      'Un tiburón bebé con tentáculos. Baby shark, turu-turu, estás muerto. Muerde cuerpo a cuerpo y te agarra desde 10 pies, y todavía está creciendo, cosa que debería acojonarte. Consejo pro: mátalo ya. No quieres conocer a su madre, créeme.',
    ],
  },
  {
    name: 'Crocodilian Roid-Soldier',
    kind: 'mob',
    size: 'Large (5)',
    tags: 'Humanoid',
    slots: '10',
    slotValue: '5',
    level: '35',
    surprise: '14+F',
    evade: '15+F',
    move: '20+S',
    dr: '6',
    stats: {
      str: {
        score: '39',
        mod: '+5',
      },
      int: {
        score: '12',
        mod: '+4',
      },
      con: {
        score: '28',
        mod: '+5',
      },
      dex: {
        score: '21',
        mod: '+5',
      },
      cha: {
        score: '10',
        mod: '+4',
      },
    },
    attacks: [
      {
        name: 'Vicious Bite',
        toHit: '15+F',
        damage: '5d8+5 Piercing',
        range: '5ft range',
        effect: '',
      },
      {
        name: 'Harpoon Gun',
        toHit: '15+F',
        damage: '3d6 Piercing',
        range: '30 ft range',
        effect: 'On hit: Surface',
      },
    ],
    notes:
      'Roid Rage: Buffs have triple their normal effect on Roid-Soldiers.\nHarpoon Gun: hit crawlers gain Pinned to a Surface: they are Held against the nearest wall, tree or object (the ground if nothing else is available).\n\nFull text: Core Rulebook p. 573.',
    source: 'Core Rulebook p. 573',
    chapter: 'Floor 5 · The Bubbles',
    floor: 5,
    description:
      'A crocodile man on enough steroids to make a gym bro cry. Buff him and he gets three times the boost, because of course he does. Pro tip: his harpoon pins you to the nearest wall like a bug in a display case. Dispel his juice or enjoy being wall art.',
    prevDescriptions: [
      'A crocodile on a cocktail of performance enhancers the Galactic Sports Board would like a word about. Any buff you see on it? Multiply by three. Its harpoon pins you to the scenery like a butterfly in a museum. Pro tip: strip those buffs, fast.',
    ],
    prevNotes: [
      'Special: Roid Rage. Full text: Core Rulebook p. 573.',
      'Roid Rage: Buffs have triple their normal effect on Roid-Soldiers.\nHarpoon Gun: hit crawlers gain Pinned to a Surface: they are Held against the nearest wall, tree or object (the ground if nothing else is available).\n\nFull text: Core Rulebook p. 573.',
    ],
    descriptionEs:
      'Un hombre cocodrilo con tantos esteroides que haría llorar a un cani de gimnasio. Dale un Buff y recibe el triple de efecto, cómo no. Pro-Tip: su arpón te clava a la pared más cercana como un bicho en una vitrina. Disípale el chute o disfruta siendo decoración de pared.',
    prevDescriptionsEs: [
      'Un hombre cocodrilo con tantos esteroides que haría llorar a un cani de gimnasio. Dale un Buff y recibe el triple de efecto, cómo no. Consejo pro: su arpón te clava a la pared más cercana como un bicho en una vitrina. Disípale el chute o disfruta siendo decoración de pared.',
    ],
  },
  {
    name: 'Giant Dragonfish',
    kind: 'mob',
    size: 'Petite (3)',
    tags: 'Beast',
    slots: '10',
    slotValue: '5',
    level: '35',
    surprise: '14+F',
    evade: '15+F',
    move: '40+S',
    dr: '5',
    stats: {
      str: {
        score: '39',
        mod: '+5',
      },
      int: {
        score: '12',
        mod: '+4',
      },
      con: {
        score: '28',
        mod: '+5',
      },
      dex: {
        score: '21',
        mod: '+5',
      },
      cha: {
        score: '10',
        mod: '+4',
      },
    },
    attacks: [
      {
        name: 'Bite',
        toHit: '15+F',
        damage: '5d8+5 Piercing',
        range: '5ft range',
        effect: 'Special effect',
      },
    ],
    notes:
      "Glowing Lure: each crawler's first melee swing at it → Int Stat Check (skip if player says they avert eyes from the glow); fail → Action wasted.\nLure Spell (14+F, no damage, 50ft): hit → crawler must use actions to move until adjacent to it.\n\nFull text: Core Rulebook p. 573.",
    source: 'Core Rulebook p. 573',
    chapter: 'Floor 5 · The Bubbles',
    floor: 5,
    description:
      "Deep-sea horror with a glowing lure on its forehead. Look at the pretty light and you forget what you were swinging at, or you walk right into its mouth. Pro tip: look away when you attack. It's the same advice I give about my ex.",
    prevDescriptions: [
      "Ooh, shiny! That's what every crawler says right before becoming dinner. This little horror dangles a glowing bulb and reels you in by the eyeballs. Pro tip: whatever you do, say out loud that you won't look at the light. I love when people forget.",
    ],
    prevNotes: [
      'Special: Glowing Lure. Full text: Core Rulebook p. 573.',
      "Glowing Lure: each crawler's first melee swing at it → Int Stat Check (skip if player says they avert eyes from the glow); fail → Action wasted.\nLure Spell (14+F, no damage, 50ft): hit → crawler must use actions to move until adjacent to it.\n\nFull text: Core Rulebook p. 573.",
    ],
    descriptionEs:
      'Horror de las profundidades con un señuelo luminoso en la frente. Mira la lucecita bonita y se te olvida a qué le estabas pegando, o te metes directamente en su boca. Pro-Tip: aparta la vista cuando ataques. Es el mismo consejo que doy sobre mi ex.',
    prevDescriptionsEs: [
      'Horror de las profundidades con un señuelo luminoso en la frente. Mira la lucecita bonita y se te olvida a qué le estabas pegando, o te metes directamente en su boca. Consejo pro: aparta la vista cuando ataques. Es el mismo consejo que doy sobre mi ex.',
    ],
  },
  {
    name: 'Crocodilian Mob Boss',
    kind: 'mob',
    size: 'Large (5)',
    tags: 'Humanoid',
    slots: '10',
    slotValue: '6',
    level: '50',
    surprise: '15+F',
    evade: '15+F',
    move: '20+S',
    dr: '6',
    stats: {
      str: {
        score: '29',
        mod: '+5',
      },
      int: {
        score: '27',
        mod: '+5',
      },
      con: {
        score: '58',
        mod: '+6',
      },
      dex: {
        score: '21',
        mod: '+5',
      },
      cha: {
        score: '20',
        mod: '+5',
      },
    },
    attacks: [
      {
        name: 'Vicious Bite',
        toHit: '15+F',
        damage: '5d8+5 Piercing',
        range: '5ft range',
        effect: '',
      },
      {
        name: 'Harpoon Gun',
        toHit: '15+F',
        damage: '3d10 Piercing',
        range: '30 ft range',
        effect: 'On hit: Surface',
      },
    ],
    notes:
      "Boss's Orders: each turn start, Boss marks one target → Disadvantage on Evade Checks vs his underlings.\nHarpoon Gun: hit → Pinned to a Surface (Held against nearby wall/tree/object; ground if nothing else).\n\nFull text: Core Rulebook p. 577.",
    source: 'Core Rulebook p. 577',
    chapter: 'Floor 5 · The Bubbles',
    floor: 5,
    description:
      'The Boss points at one of you each turn, and suddenly every goon in the room has your number. Plus a bigger harpoon for sticking you to the walls. Pro tip: kill the guy giving orders first. Middle management always dies screaming the loudest.',
    prevDescriptions: [
      "The Don of the swamp. He points, his boys shoot, and you suddenly forget how to dodge. It's like a crime family, but scalier and with fewer tax lawyers. Pro tip: take out the boss and the goons lose their marching orders.",
    ],
    prevNotes: [
      'Special: Boss’s Orders. Full text: Core Rulebook p. 577.',
      "Boss's Orders: each turn start, Boss marks one target → Disadvantage on Evade Checks vs his underlings.\nHarpoon Gun: hit → Pinned to a Surface (Held against nearby wall/tree/object; ground if nothing else).\n\nFull text: Core Rulebook p. 577.",
    ],
    descriptionEs:
      'El Jefe señala a uno de vosotros cada turno y, de repente, todos los matones de la sala van a por ti. Además tiene un arpón más grande para clavarte a las paredes. Pro-Tip: mata primero al que da las órdenes. Los mandos intermedios siempre son los que mueren gritando más fuerte.',
    prevDescriptionsEs: [
      'El Jefe señala a uno de vosotros cada turno y, de repente, todos los matones de la sala van a por ti. Además tiene un arpón más grande para clavarte a las paredes. Consejo pro: mata primero al que da las órdenes. Los mandos intermedios siempre son los que mueren gritando más fuerte.',
    ],
  },
  {
    name: 'Unbound Will, Giant Orca',
    kind: 'boss',
    size: 'Colossal (7)',
    tags: 'Neighborhood Boss, Killer Whale',
    slots: '8',
    slotValue: '6',
    level: '60',
    surprise: '14+F',
    evade: '14+F',
    move: '35+S',
    dr: '5',
    stats: {
      str: {
        score: '75',
        mod: '+6',
      },
      int: {
        score: '16',
        mod: '+4',
      },
      con: {
        score: '80',
        mod: '+6',
      },
      dex: {
        score: '18',
        mod: '+4',
      },
      cha: {
        score: '16',
        mod: '+4',
      },
    },
    attacks: [
      {
        name: 'Tsharknami!',
        toHit: '14+F',
        damage: '7d12+6 Piercing',
        range: '30ft range',
        effect: '',
      },
      {
        name: 'Bite',
        toHit: '16+F',
        damage: '6d6+6 Piercing',
        range: '10ft range',
        effect: 'Major Fail+: Swallowed',
      },
    ],
    notes:
      "Blood In the Water: another creature dies nearby → Unbound Will burns 1 Action heading for the corpse. Dead count ≥ party size → sharks do nothing but feed, party ignored, no Tsharknami!.\nBite → Swallowed (Evade Major Fail or worse): can't be targeted; 1d10+F Acid each round end; attacks from inside at Disadvantage vs 0 DR, Slashing ×2. Everyone freed on an Amazing Success+ against it, or its death.\nTail Whip (16+F, 5d8+6 Bludgeoning, 20ft Cone): hit → push 5ft per HB slot lost.\n\nFull text: Core Rulebook p. 578.",
    source: 'Core Rulebook p. 578',
    chapter: 'Floor 5 · The Bubbles',
    floor: 5,
    description:
      "A giant orca that throws sharks at you. Yes, that's what Tsharknami means. He also swallows crawlers whole and slowly digests them in acid. Pro tip: stuff dead bodies in the water. Enough corpses and every fin in the lagoon forgets you exist. Bring snacks, preferably your least favorite teammate.",
    prevDescriptions: [
      "A colossal orca that throws sharks at you. As a wave. I named the attack myself and I stand by it. Getting swallowed is a real option, and honestly the view is terrible. Pro tip: give it something else to eat. It's very easily distracted by a buffet.",
    ],
    prevNotes: [
      'Special: Blood In the Water. Full text: Core Rulebook p. 578.',
      "Blood In the Water: another creature dies nearby → Unbound Will burns 1 Action heading for the corpse. Dead count ≥ party size → sharks do nothing but feed, party ignored, no Tsharknami!.\nBite → Swallowed (Evade Major Fail or worse): can't be targeted; 1d10+F Acid each round end; attacks from inside at Disadvantage vs 0 DR, Slashing ×2. Everyone freed on an Amazing Success+ against it, or its death.\nTail Whip (16+F, 5d8+6 Bludgeoning, 20ft Cone): hit → push 5ft per HB slot lost.\n\nFull text: Core Rulebook p. 578.",
    ],
    descriptionEs:
      'Una orca gigante que te lanza tiburones. Sí, eso es lo que significa Tsharknami. También se traga crawlers enteros y los digiere lentamente en ácido. Pro-Tip: echa cadáveres al agua. Con suficientes cuerpos, todas las aletas de la laguna se olvidan de que existes. Trae aperitivos, a ser posible tu compañero menos favorito.',
    prevDescriptionsEs: [
      'Una orca gigante que te lanza tiburones. Sí, eso es lo que significa Tsharknami. También se traga crawlers enteros y los digiere lentamente en ácido. Consejo pro: echa cadáveres al agua. Con suficientes cuerpos, todas las aletas de la laguna se olvidan de que existes. Trae aperitivos, a ser posible tu compañero menos favorito.',
    ],
  },
  {
    name: 'Lusca, Octo-Shark Brood Mother Queen',
    kind: 'boss',
    size: 'Gargantuan (8)',
    tags: 'City Boss, Octo-Shark',
    slots: '13',
    slotValue: '8',
    level: '82',
    surprise: '15+F',
    evade: '16+F',
    move: '50+S',
    dr: '5',
    stats: {
      str: {
        score: '177',
        mod: '+8',
      },
      int: {
        score: '24',
        mod: '+5',
      },
      con: {
        score: '158',
        mod: '+8',
      },
      dex: {
        score: '50',
        mod: '+6',
      },
      cha: {
        score: '25',
        mod: '+5',
      },
    },
    attacks: [
      {
        name: 'Rush',
        toHit: '18+F',
        damage: '6d8+8 Bludgeoning',
        range: '50ft Line',
        effect: 'Special effect',
      },
      {
        name: 'Bite',
        toHit: '18+F',
        damage: '5d10+8 Piercing',
        range: '15ft range',
        effect: 'On hit: Fish Food',
      },
      {
        name: 'Flipper',
        toHit: '18+F',
        damage: '6d10+8 Bludgeoning',
        range: '30ft range',
        effect: 'Special effect',
      },
    ],
    notes:
      'Mouth Sores: single hit from a crawler for 3+ HB slots → juveniles bite back: Lusca −1 HB slot every round end; Fish Food Debuff cleared.\nRush: adjacent crawler may Interrupt (spend Action) with Str Stat Check; success → travels with her, Advantage on next attack; fail → left behind, possibly in the Line.\nBite: hit → Fish Food (inside her mouth): 1d12+F Piercing each round end; attacks from inside vs 0 DR.\nFlipper: hit → slide 5ft per HB slot lost.\n\nFull text: Core Rulebook p. 580.',
    source: 'Core Rulebook p. 580',
    chapter: 'Floor 5 · The Bubbles',
    floor: 5,
    description:
      "The Brood Mother Queen: a mountain of shark, octopus, and pure spite. She rams, flips, and bites you into her mouth, where her babies chew on you. Pro tip: whack her hard enough and the kiddos get cranky and start eating her gums instead. Motherhood is a bitch, isn't it?",
    prevDescriptions: [
      'The Queen herself! Gargantuan, octopus-shark, and mother of thousands, most of whom live in her mouth. Charming. Pro tip: hit her hard enough in one go and the kids get cranky and start chewing on mom. Family drama is my favorite genre.',
    ],
    prevNotes: [
      'Special: Mouth Sores. Full text: Core Rulebook p. 580.',
      'Mouth Sores: single hit from a crawler for 3+ HB slots → juveniles bite back: Lusca −1 HB slot every round end; Fish Food Debuff cleared.\nRush: adjacent crawler may Interrupt (spend Action) with Str Stat Check; success → travels with her, Advantage on next attack; fail → left behind, possibly in the Line.\nBite: hit → Fish Food (inside her mouth): 1d12+F Piercing each round end; attacks from inside vs 0 DR.\nFlipper: hit → slide 5ft per HB slot lost.\n\nFull text: Core Rulebook p. 580.',
    ],
    descriptionEs:
      'La Reina Madre de la Camada: una montaña de tiburón, pulpo y mala leche en estado puro. Embiste, te voltea y te mete de un mordisco en la boca, donde sus crías te mastican. Pro-Tip: zúrrale lo bastante fuerte y los críos se ponen de mala hostia y empiezan a comerle las encías a ella. La maternidad es una putada, ¿eh?',
    prevDescriptionsEs: [
      'La Reina Madre de la Camada: una montaña de tiburón, pulpo y mala leche en estado puro. Embiste, te voltea y te mete de un mordisco en la boca, donde sus crías te mastican. Consejo pro: zúrrale lo bastante fuerte y los críos se ponen de mala hostia y empiezan a comerle las encías a ella. La maternidad es una putada, ¿eh?',
    ],
  },
  {
    name: 'Bubble Beluga',
    kind: 'mob',
    size: 'Medium (4)',
    tags: 'Whale',
    slots: '10',
    slotValue: '5',
    level: '46',
    surprise: '15+F',
    evade: '15+F',
    move: '20+S',
    dr: '5',
    stats: {
      str: {
        score: '31',
        mod: '+5',
      },
      int: {
        score: '38',
        mod: '+5',
      },
      con: {
        score: '29',
        mod: '+5',
      },
      dex: {
        score: '35',
        mod: '+5',
      },
      cha: {
        score: '10',
        mod: '+4',
      },
    },
    attacks: [
      {
        name: 'Air Bubble',
        toHit: '15+F',
        damage: '5d6+5 Force',
        range: '30ft range',
        effect: 'Major Fail+: Staggered',
      },
      {
        name: 'Headbutt',
        toHit: '15+F',
        damage: '4d6+5 Piercing',
        range: '5ft range',
        effect: 'Special effect',
      },
    ],
    notes:
      'Headbutt: requires 20ft straight charge at target. Hit → push 10ft. Ship targeted → every passenger: Unopposed Balance Skill Check; fail = 5ft slide toward nearest water.\n\nFull text: Core Rulebook p. 583.',
    source: 'Core Rulebook p. 583',
    chapter: 'Floor 5 · The Bubbles',
    floor: 5,
    description:
      "Cute little bubble whale! It shoots air bubbles and headbutts like a drunk linebacker. Hit a ship and everyone on deck slides toward the water. Pro tip: it needs a 20-foot running start. Crowd it and it's just a big, sad marshmallow.",
    prevDescriptions: [
      "Adorable, squeaky, and blows bubbles hard enough to knock you flat. The Bubble Beluga also rams ships to tip everyone overboard. Cutest drowning you'll ever experience. The viewers are already buying plushies.",
    ],
    prevNotes: [
      'Full text: Core Rulebook p. 583.',
      'Headbutt: requires 20ft straight charge at target. Hit → push 10ft. Ship targeted → every passenger: Unopposed Balance Skill Check; fail = 5ft slide toward nearest water.\n\nFull text: Core Rulebook p. 583.',
    ],
    descriptionEs:
      '¡Qué ballenita de burbujas tan mona! Dispara burbujas de aire y embiste como un defensa de rugby borracho. Si golpea un barco, todos los de cubierta resbalan hacia el agua. Pro-Tip: necesita 20 pies de carrerilla. Pégate a ella y no es más que una nube de azúcar enorme y triste.',
    prevDescriptionsEs: [
      '¡Qué ballenita de burbujas tan mona! Dispara burbujas de aire y embiste como un defensa de rugby borracho. Si golpea un barco, todos los de cubierta resbalan hacia el agua. Consejo pro: necesita 20 pies de carrerilla. Pégate a ella y no es más que una nube de azúcar enorme y triste.',
    ],
  },
  {
    name: 'Cannonback Tortoise',
    kind: 'mob',
    size: 'Large (5)',
    tags: 'Reptilian',
    slots: '10',
    slotValue: '6',
    level: '55',
    surprise: '14+F',
    evade: '16+F',
    move: '10+S',
    dr: '7',
    stats: {
      str: {
        score: '27',
        mod: '+5',
      },
      int: {
        score: '12',
        mod: '+4',
      },
      con: {
        score: '61',
        mod: '+6',
      },
      dex: {
        score: '65',
        mod: '+6',
      },
      cha: {
        score: '5',
        mod: '+2',
      },
    },
    attacks: [
      {
        name: 'Grapeshot',
        toHit: '15+F',
        damage: '4d6 Piercing',
        range: '30ft Cone',
        effect: '',
      },
      {
        name: 'Cannonball',
        toHit: '16+F',
        damage: '5d8 Bludgeoning',
        range: '50ft range',
        effect: 'Special effect',
      },
      {
        name: 'Self-Destruct',
        toHit: '15+F',
        damage: '4d12 Bludgeoning',
        range: '10ft',
        effect: 'Special effect',
      },
    ],
    notes:
      'Cannonball: hit → push 5ft per HB slot lost.\nSelf-Destruct: drops to ≤20% HB → detonates (10ft burst) and dies.\n\nFull text: Core Rulebook p. 583.',
    source: 'Core Rulebook p. 583',
    chapter: 'Floor 5 · The Bubbles',
    floor: 5,
    description:
      "A tortoise with cannons strapped to its shell. It fires grapeshot, cannonballs, and when it's nearly dead, it blows itself up. Pro tip: when it drops low, back the fuck off. Its last move is a 10-foot kamikaze, and turtle chunks stain.",
    prevDescriptions: [
      "A tortoise with a battleship bolted to its back. Slow? Sure. But it fires grapeshot and cannonballs, and when it's nearly dead it blows itself up out of spite. Pro tip: finish it from far away. Or don't. Explosions are great for ratings.",
    ],
    prevNotes: [
      'Full text: Core Rulebook p. 583.',
      'Cannonball: hit → push 5ft per HB slot lost.\nSelf-Destruct: drops to ≤20% HB → detonates (10ft burst) and dies.\n\nFull text: Core Rulebook p. 583.',
    ],
    descriptionEs:
      'Una tortuga con cañones atados al caparazón. Dispara metralla, balas de cañón y, cuando está casi muerta, se hace volar por los aires. Pro-Tip: cuando esté baja, aléjate cagando leches. Su último movimiento es un kamikaze de 10 pies, y los trozos de tortuga manchan.',
    prevDescriptionsEs: [
      'Una tortuga con cañones atados al caparazón. Dispara metralla, balas de cañón y, cuando está casi muerta, se hace volar por los aires. Consejo pro: cuando esté baja, aléjate cagando leches. Su último movimiento es un kamikaze de 10 pies, y los trozos de tortuga manchan.',
    ],
  },
  {
    name: 'Pain Amplifier Jellyfish',
    kind: 'mob',
    size: 'Petite (3)',
    tags: 'Cnidaria',
    slots: '10',
    slotValue: '5',
    level: '51',
    surprise: '13+F',
    evade: '16+F',
    move: '20+S',
    dr: '5',
    stats: {
      str: {
        score: '51',
        mod: '+6',
      },
      int: {
        score: '6',
        mod: '+3',
      },
      con: {
        score: '35',
        mod: '+5',
      },
      dex: {
        score: '58',
        mod: '+6',
      },
      cha: {
        score: '2',
        mod: '+1',
      },
    },
    attacks: [
      {
        name: 'Tentacles',
        toHit: '16+F',
        damage: '5d6+6 Piercing',
        range: '30ft Cone',
        effect: 'Major Fail+: Taint, Shocked',
      },
    ],
    notes:
      'Tentacles: every hit applies The Taint; on an Evade Major Fail or worse the crawler also gains Shocked.\n\nFull text: Core Rulebook p. 584.',
    source: 'Core Rulebook p. 584',
    chapter: 'Floor 5 · The Bubbles',
    floor: 5,
    description:
      "A jellyfish that makes pain worse. Not a metaphor. Every sting spreads The Taint, and flub the dodge and you get shocked too. Pro tip: keep out of its 30-foot cone of spaghetti. And no, peeing on it won't help. Well, it'll help the ratings.",
    prevDescriptions: [
      "It's a jellyfish that makes everything hurt more. That's it. That's the whole pitch, and it tested beautifully with audiences. Thirty-foot cone of stingers, zero brain. Pro tip: don't let it touch you. Easy, right?",
    ],
    prevNotes: [
      'Full text: Core Rulebook p. 584.',
      'Tentacles: every hit applies The Taint; on an Evade Major Fail or worse the crawler also gains Shocked.\n\nFull text: Core Rulebook p. 584.',
    ],
    descriptionEs:
      'Una medusa que hace que el dolor duela más. No es una metáfora. Cada picadura extiende The Taint, y si fallas la esquiva te llevas una descarga de regalo. Pro-Tip: no te metas en su cono de espaguetis de 30 pies. Y no, mearle encima no sirve de nada. Bueno, a la audiencia sí le sirve.',
    prevDescriptionsEs: [
      'Una medusa que hace que el dolor duela más. No es una metáfora. Cada picadura extiende The Taint, y si fallas la esquiva te llevas una descarga de regalo. Consejo pro: no te metas en su cono de espaguetis de 30 pies. Y no, mearle encima no sirve de nada. Bueno, a la audiencia sí le sirve.',
    ],
  },
  {
    name: 'Pirate',
    kind: 'mob',
    size: 'Medium (4)',
    tags: 'Humanoid',
    slots: '10',
    slotValue: '5',
    level: '52',
    surprise: '15+F',
    evade: '15+F',
    move: '20+S',
    dr: '5',
    stats: {
      str: {
        score: '39',
        mod: '+5',
      },
      int: {
        score: '26',
        mod: '+5',
      },
      con: {
        score: '29',
        mod: '+5',
      },
      dex: {
        score: '38',
        mod: '+5',
      },
      cha: {
        score: '29',
        mod: '+5',
      },
    },
    attacks: [
      {
        name: 'Cutlass',
        toHit: '15+F',
        damage: '5d8+5 Slashing',
        range: '5ft range',
        effect: '',
      },
      {
        name: 'Pistol',
        toHit: '15+F',
        damage: '4d8 Piercing',
        range: '40ft range',
        effect: '',
      },
      {
        name: 'Liquor Flamethrower',
        toHit: '15+F',
        damage: '4d6+5 Fire',
        range: '15ft Cone',
        effect: 'On hit: Burned',
      },
    ],
    notes:
      'Ghostly: Ghost variant only takes harm from enchanted weapons or Spells; its own attacks count as magical vs Resistances/Immunities.\n\nFull text: Core Rulebook p. 584.',
    source: 'Core Rulebook p. 584',
    chapter: 'Floor 5 · The Bubbles',
    floor: 5,
    description:
      "Yo ho, you're fucked. Cutlass, pistol, and a flamethrower that runs on rum. Some of these pirates are ghosts, too, so your rusty sword just passes through. Pro tip: bring enchanted gear or Spells for the spooky ones. Or hide behind the drunk guy.",
    prevDescriptions: [
      'Yo ho, and a bottle of flammable rum! This Pirate brings a cutlass, a pistol, and a mouthful of flaming booze. Some of them are ghosts, too, so your rusty sword might just wave through air. Pro tip: check for glowing before you swing.',
    ],
    prevNotes: [
      'Special: Ghostly. Full text: Core Rulebook p. 584.',
      'Ghostly: Ghost variant only takes harm from enchanted weapons or Spells; its own attacks count as magical vs Resistances/Immunities.\n\nFull text: Core Rulebook p. 584.',
    ],
    descriptionEs:
      'Yo-ho-ho, estás jodido. Alfanje, pistola y un lanzallamas que funciona con ron. Algunos de estos piratas además son fantasmas, así que tu espada oxidada los atraviesa sin más. Pro-Tip: trae equipo encantado o hechizos para los espectrales. O escóndete detrás del borracho.',
    prevDescriptionsEs: [
      'Yo-ho-ho, estás jodido. Alfanje, pistola y un lanzallamas que funciona con ron. Algunos de estos piratas además son fantasmas, así que tu espada oxidada los atraviesa sin más. Consejo pro: trae equipo encantado o hechizos para los espectrales. O escóndete detrás del borracho.',
    ],
  },
  {
    name: 'Ship',
    kind: 'npc',
    size: 'Colossal (7)',
    tags: 'Vehicle, Ship',
    slots: '10',
    slotValue: '6',
    level: '55',
    surprise: '11+F',
    evade: '16+F',
    move: '20',
    dr: '5',
    stats: {
      str: {
        score: '50',
        mod: '+6',
      },
      int: {
        score: '1',
        mod: '+1',
      },
      con: {
        score: '70',
        mod: '+6',
      },
      dex: {
        score: '73',
        mod: '+6',
      },
      cha: {
        score: '1',
        mod: '+1',
      },
    },
    attacks: [
      {
        name: 'Roundshot',
        toHit: '16+F',
        damage: '4d12 Bludgeoning',
        range: '100ft range',
        effect: '',
      },
      {
        name: 'Boarding',
        toHit: '16+F',
        damage: 'No damage',
        range: '10ft range',
        effect: 'Special effect',
      },
      {
        name: 'Ramming',
        toHit: '16+F',
        damage: '4d10+6 Bludgeoning',
        range: '5ft range',
        effect: 'On hit: Held',
      },
    ],
    notes:
      'Object Immunities: ships are objects, Immune to Psychic damage and any Debuff with biological effects.\nTurning: must spend 10ft of Move per 30° turn.\nBoarding: on a Success, Pirates board the target vessel.\nRamming: the struck ship gains the Held Debuff until forcibly separated.\n\nFull text: Core Rulebook p. 584.',
    source: 'Core Rulebook p. 584',
    chapter: 'Floor 5 · The Bubbles',
    floor: 5,
    description:
      "It's a ship. It shoots cannons, rams, and dumps pirates on your deck. It doesn't feel psychic damage or poison because it's a bunch of wood, genius. Pro tip: it turns like a shopping cart with a busted wheel. Circle it and make it work.",
    prevDescriptions: [
      "It's a ship. It shoots cannons, it rams other ships, and it delivers pirates directly to your deck like a very rude courier. You can't scare it, poison it, or insult its mother. Pro tip: it turns like a shopping cart. Circle it.",
    ],
    prevNotes: [
      'Special: Object Immunities. Full text: Core Rulebook p. 584.',
      'Object Immunities: ships are objects, Immune to Psychic damage and any Debuff with biological effects.\nTurning: must spend 10ft of Move per 30° turn.\nBoarding: on a Success, Pirates board the target vessel.\nRamming: the struck ship gains the Held Debuff until forcibly separated.\n\nFull text: Core Rulebook p. 584.',
    ],
    descriptionEs:
      'Es un barco. Dispara cañones, embiste y te suelta piratas en la cubierta. No le afecta el daño psíquico ni el veneno porque es un montón de madera, lumbreras. Pro-Tip: gira como un carrito del súper con una rueda rota. Dale vueltas y que sude.',
    prevDescriptionsEs: [
      'Es un barco. Dispara cañones, embiste y te suelta piratas en la cubierta. No le afecta el daño psíquico ni el veneno porque es un montón de madera, lumbreras. Consejo pro: gira como un carrito del súper con una rueda rota. Dale vueltas y que sude.',
    ],
  },
  {
    name: 'Admiral Stoma',
    kind: 'boss',
    size: 'Tiny (1)',
    tags: 'Neighborhood Boss, Insectoid',
    slots: '8',
    slotValue: '5',
    level: '61',
    surprise: '15+F',
    evade: '16+F',
    move: '20+S',
    dr: '5',
    stats: {
      str: {
        score: '76',
        mod: '+6',
      },
      int: {
        score: '41',
        mod: '+5',
      },
      con: {
        score: '23',
        mod: '+5',
      },
      dex: {
        score: '53',
        mod: '+6',
      },
      cha: {
        score: '15',
        mod: '+4',
      },
    },
    attacks: [
      {
        name: 'Dactyl Smash',
        toHit: '16+F',
        damage: '6d8+6 Bludgeoning',
        range: '5ft range',
        effect: 'Special effect',
      },
      {
        name: 'Grappling Gun',
        toHit: '15+F',
        damage: '7d4 Piercing',
        range: '50ft range',
        effect: 'Special effect',
      },
      {
        name: 'Boil the Air',
        toHit: '15+F',
        damage: '4d6 Fire',
        range: '20ft Burst radius',
        effect: 'On hit: Scalded',
      },
    ],
    notes:
      'Overboard: tossed crawler → Unopposed Swimming Skill Check or Drowning. Return via Unopposed Climbing Skill Check; Advantage with a rope ladder down.\nDactyl Smash: 4+ HB slots lost → crawler hurled overboard (window if necessary).\nGrappling Gun: hit → yanked 15ft toward Stoma.\nBoil the Air: hit → Scalded: 1d8+F each round end, 2 rounds.\n\nFull text: Core Rulebook p. 590.',
    source: 'Core Rulebook p. 590',
    chapter: 'Floor 5 · The Bubbles',
    floor: 5,
    description:
      "The Admiral is a mantis shrimp with a knuckle punch that tosses you overboard, a grappling gun, and a trick that boils the air. Pro tip: bring a rope ladder. Climbing back up with Advantage beats drowning, and you'll get tossed. Like, a lot.",
    prevDescriptions: [
      "Tiny admiral, huge ego. Stoma is a mantis shrimp who punches with the force of a gunshot and loves launching crawlers into the drink. Pro tip: keep a rope ladder handy. Or learn to swim. I'd pick both, but I'm not the one being yeeted.",
    ],
    prevNotes: [
      'Special: Overboard. Full text: Core Rulebook p. 590.',
      'Overboard: tossed crawler → Unopposed Swimming Skill Check or Drowning. Return via Unopposed Climbing Skill Check; Advantage with a rope ladder down.\nDactyl Smash: 4+ HB slots lost → crawler hurled overboard (window if necessary).\nGrappling Gun: hit → yanked 15ft toward Stoma.\nBoil the Air: hit → Scalded: 1d8+F each round end, 2 rounds.\n\nFull text: Core Rulebook p. 590.',
    ],
    descriptionEs:
      'El Almirante es una galera (la gamba mantis, no el barco) con un puñetazo de nudillos que te tira por la borda, un lanzagarfios y un truco que hace hervir el aire. Pro-Tip: trae una escala de cuerda. Volver a subir con Ventaja es mejor que ahogarse, y te van a tirar. Muchas veces.',
    prevDescriptionsEs: [
      'El Almirante es una galera (la gamba mantis, no el barco) con un puñetazo de nudillos que te tira por la borda, un lanzagarfios y un truco que hace hervir el aire. Consejo pro: trae una escala de cuerda. Volver a subir con Ventaja es mejor que ahogarse, y te van a tirar. Muchas veces.',
    ],
  },
  {
    name: 'Nude Glaber',
    kind: 'mob',
    size: 'Petite (3)',
    tags: 'Humanoid',
    slots: '10',
    slotValue: '5',
    level: '36',
    surprise: '16+F',
    evade: '14+F',
    move: '20+S',
    dr: '0',
    stats: {
      str: {
        score: '8',
        mod: '+3',
      },
      int: {
        score: '57',
        mod: '+6',
      },
      con: {
        score: '32',
        mod: '+5',
      },
      dex: {
        score: '15',
        mod: '+4',
      },
      cha: {
        score: '1',
        mod: '+1',
      },
    },
    attacks: [
      {
        name: 'Claw',
        toHit: '13+F',
        damage: '5d6+3 Slashing',
        range: '5ft range',
        effect: '',
      },
      {
        name: 'Gagging Gaze',
        toHit: '16+F',
        damage: '4d6+6 Force',
        range: '30ft range',
        effect: 'Special effect',
      },
    ],
    notes:
      'Re-Mole-deling: +1 HB slot each round end; undamaged round → regrow a limb.\nGagging Gaze: hit → You Stanky!: Disadvantage on every Charisma Skill Check until long rest + bath.\n\nFull text: Core Rulebook p. 593.',
    source: 'Core Rulebook p. 593',
    chapter: 'Floor 5 · The Bubbles',
    floor: 5,
    description:
      "Naked, wrinkly, and it stares so hard you start to reek. Congrats, you're now too stinky to talk to anyone until you bathe. It also regrows limbs if you let it breathe. Pro tip: hit it every single round. And shower, you animal.",
    prevDescriptions: [
      'Naked, wrinkly, and it stares so hard you start to smell. Scientifically impossible, and yet. It also regrows limbs if you give it a breather. Pro tip: never stop hitting it. And maybe pack soap.',
    ],
    prevNotes: [
      'Special: Re-Mole-deling. Full text: Core Rulebook p. 593.',
      'Re-Mole-deling: +1 HB slot each round end; undamaged round → regrow a limb.\nGagging Gaze: hit → You Stanky!: Disadvantage on every Charisma Skill Check until long rest + bath.\n\nFull text: Core Rulebook p. 593.',
    ],
    descriptionEs:
      'Desnudo, arrugado y te mira tan fijamente que empiezas a apestar. Enhorabuena, ahora hueles demasiado mal para hablar con nadie hasta que te bañes. Además, le vuelven a crecer las extremidades si le dejas respirar. Pro-Tip: pégale todos y cada uno de los asaltos. Y dúchate, animal.',
    prevDescriptionsEs: [
      'Desnudo, arrugado y te mira tan fijamente que empiezas a apestar. Enhorabuena, ahora hueles demasiado mal para hablar con nadie hasta que te bañes. Además, le vuelven a crecer las extremidades si le dejas respirar. Consejo pro: pégale todos y cada uno de los asaltos. Y dúchate, animal.',
    ],
  },
  {
    name: 'Flesh Farrago',
    kind: 'mob',
    size: 'Large (5)',
    tags: 'Undead',
    slots: '10',
    slotValue: '7',
    level: '45',
    surprise: '12+F',
    evade: '14+F',
    move: '20+S',
    dr: '0',
    stats: {
      str: {
        score: '25',
        mod: '+5',
      },
      int: {
        score: '3',
        mod: '+2',
      },
      con: {
        score: '101',
        mod: '+7',
      },
      dex: {
        score: '10',
        mod: '+4',
      },
      cha: {
        score: '1',
        mod: '+1',
      },
    },
    attacks: [
      {
        name: 'Mushroom Stamp',
        toHit: '15+F',
        damage: '5d6+5 Bludgeoning',
        range: '5ft range',
        effect: '',
      },
      {
        name: 'Spores',
        toHit: '12+F',
        damage: '3d8+2 Poison',
        range: '15ft Burst radius',
        effect: 'Woozy',
      },
    ],
    notes: 'Fast-Growing: regains 1 HB slot each round end.\n\nFull text: Core Rulebook p. 593.',
    source: 'Core Rulebook p. 593',
    chapter: 'Floor 5 · The Bubbles',
    floor: 5,
    description:
      'A fungus zombie made of pieces of several unlucky assholes. It stomps, it sprays spores, and it grows back a chunk of health every round. Pro tip: burst it down fast. Slow fights with a regenerating mushroom are how you become part of the mushroom.',
    prevDescriptions: [
      'A lumbering heap of dead meat with mushrooms sprouting all over it. It stomps, it sprays spores, and it grows back faster than your patience. Pro tip: burst damage. Nibbling at it is just feeding the compost pile.',
    ],
    prevNotes: [
      'Special: Fast-Growing. Full text: Core Rulebook p. 593.',
      'Fast-Growing: regains 1 HB slot each round end.\n\nFull text: Core Rulebook p. 593.',
    ],
    descriptionEs:
      'Un zombi de hongos hecho con trozos de varios desgraciados sin suerte. Pisotea, suelta esporas y recupera un buen cacho de salud cada asalto. Pro-Tip: revienta a este bicho rápido. Las peleas lentas contra una seta que se regenera son la forma de acabar formando parte de la seta.',
    prevDescriptionsEs: [
      'Un zombi de hongos hecho con trozos de varios desgraciados sin suerte. Pisotea, suelta esporas y recupera un buen cacho de salud cada asalto. Consejo pro: revienta a este bicho rápido. Las peleas lentas contra una seta que se regenera son la forma de acabar formando parte de la seta.',
    ],
  },
  {
    name: 'Glimmermote Swarm',
    kind: 'mob',
    size: 'Tiny (1)',
    tags: 'Celestial Janitor',
    slots: '10',
    slotValue: '4',
    level: '34',
    surprise: '15+F',
    evade: '14+F',
    move: '20+S',
    dr: '0',
    stats: {
      str: {
        score: '1',
        mod: '+1',
      },
      int: {
        score: '22',
        mod: '+5',
      },
      con: {
        score: '10',
        mod: '+4',
      },
      dex: {
        score: '10',
        mod: '+4',
      },
      cha: {
        score: '64',
        mod: '+6',
      },
    },
    attacks: [
      {
        name: 'Fade Away',
        toHit: '15+F',
        damage: '4d6+6 Psychic',
        range: '5ft range',
        effect: 'Fading, External, Evade, This',
      },
    ],
    notes:
      'Fade Away: Evade Fail or worse → Fading. Each day end: swap one External Buff for +1 Evade Buff. All three swapped → crawler erased at end of next day. Cure: life-deity priest or the deity.\n\nFull text: Core Rulebook p. 594.',
    source: 'Core Rulebook p. 594',
    chapter: 'Floor 5 · The Bubbles',
    floor: 5,
    description:
      "Sparkly little space janitors that scrub away the mess. The mess is you. Get touched and you start fading, one Buff at a time, until you're wiped from existence. Pro tip: find a life-deity priest before you run out of Buffs. Or say goodbye. Viewers love a slow tragedy.",
    prevDescriptions: [
      'Sparkly little cleaning crew of the cosmos. They tidy up by erasing you from existence, one limb at a time, over several days. Pro tip: find a life priest fast. Or enjoy becoming a rumor. Your fans will barely remember you.',
    ],
    prevNotes: [
      'Full text: Core Rulebook p. 594.',
      'Fade Away: Evade Fail or worse → Fading. Each day end: swap one External Buff for +1 Evade Buff. All three swapped → crawler erased at end of next day. Cure: life-deity priest or the deity.\n\nFull text: Core Rulebook p. 594.',
    ],
    descriptionEs:
      'Pequeños conserjes espaciales brillantitos que limpian la porquería. La porquería eres tú. Si te tocan, empiezas a desvanecerte, un Buff cada vez, hasta que te borran de la existencia. Pro-Tip: busca un sacerdote de una deidad de la vida antes de quedarte sin Buffs. O despídete. A los espectadores les encanta una tragedia a cámara lenta.',
    prevDescriptionsEs: [
      'Pequeños conserjes espaciales brillantitos que limpian la porquería. La porquería eres tú. Si te tocan, empiezas a desvanecerte, un Buff cada vez, hasta que te borran de la existencia. Consejo pro: busca un sacerdote de una deidad de la vida antes de quedarte sin Buffs. O despídete. A los espectadores les encanta una tragedia a cámara lenta.',
    ],
  },
  {
    name: 'Pudding Pal',
    kind: 'mob',
    size: 'Medium (4)',
    tags: 'Ooze',
    slots: '10',
    slotValue: '5',
    level: '41',
    surprise: '14+F',
    evade: '15+F',
    move: '20+S',
    dr: '0',
    stats: {
      str: {
        score: '33',
        mod: '+5',
      },
      int: {
        score: '10',
        mod: '+4',
      },
      con: {
        score: '33',
        mod: '+5',
      },
      dex: {
        score: '27',
        mod: '+5',
      },
      cha: {
        score: '25',
        mod: '+5',
      },
    },
    attacks: [
      {
        name: 'Pudding Punch',
        toHit: '15+F',
        damage: '5d8+5 Bludgeoning',
        range: '5ft range',
        effect: 'Major Fail+: Pudding',
      },
      {
        name: 'Pudding Blast',
        toHit: '15+F',
        damage: '3d6+5 Force',
        range: '25ft range, 5ft Blast radius',
        effect: 'On hit: Pudding',
      },
    ],
    notes:
      'Pudding Debuff: the effect depends on the flavor (GM may invent more).\n- Lemon: take 1d10+5 Acid at the end of each round until combat ends.\n- Vanilla: Disadvantage on Charisma Skill Checks for the rest of the day.\n- Chocolate: the crawler shits themselves.\n- Butterscotch: cannot take Steps until combat ends.\nPudding Blast: every hit applies a Pudding Debuff (Punch only on Evade Major Fail or worse).\n\nFull text: Core Rulebook p. 594.',
    source: 'Core Rulebook p. 594',
    chapter: 'Floor 5 · The Bubbles',
    floor: 5,
    description:
      "Pudding Pal is here to serve dessert! Lemon burns, vanilla makes you awkward, butterscotch glues your feet down, and chocolate... just don't get hit by chocolate. Pro tip: dodge the Blast. Every hit is a flavor, and some flavors end with you shitting yourself on live TV.",
    prevDescriptions: [
      'Snack time! Pudding Pals come in assorted flavors, and every one of them ruins your day differently. Acid, social disgrace, sticky feet, or, well, chocolate. Pro tip: ask about the flavor of the day before you engage. Trust me.',
    ],
    prevNotes: [
      'Special: Pudding Debuff; Lemon Pudding; Vanilla Pudding; Chocolate Pudding; Butterscotch Pudding. Full text: Core Rulebook p. 594.',
      'Pudding Debuff: the effect depends on the flavor (GM may invent more).\n- Lemon: take 1d10+5 Acid at the end of each round until combat ends.\n- Vanilla: Disadvantage on Charisma Skill Checks for the rest of the day.\n- Chocolate: the crawler loses bowel control. Messy, humiliating.\n- Butterscotch: cannot take Steps until combat ends.\nPudding Blast: every hit applies a Pudding Debuff (Punch only on Evade Major Fail or worse).\n\nFull text: Core Rulebook p. 594.',
    ],
    descriptionEs:
      '¡Pudding Pal viene a servir el postre! El de limón quema, el de vainilla te vuelve torpe, el de toffee te pega los pies al suelo y el de chocolate... tú no dejes que te dé el de chocolate. Pro-Tip: esquiva el Blast. Cada impacto es un sabor, y algunos sabores acaban contigo cagándote encima en directo.',
    prevDescriptionsEs: [
      '¡Pudding Pal viene a servir el postre! El de limón quema, el de vainilla te vuelve torpe, el de toffee te pega los pies al suelo y el de chocolate... tú no dejes que te dé el de chocolate. Consejo pro: esquiva el Blast. Cada impacto es un sabor, y algunos sabores acaban contigo cagándote encima en directo.',
    ],
  },
  {
    name: 'Arachnid Grappler',
    kind: 'mob',
    size: 'Medium (4)',
    tags: 'Humanoid',
    slots: '10',
    slotValue: '5',
    level: '50',
    surprise: '15+F',
    evade: '15+F',
    move: '40+S',
    dr: '0',
    stats: {
      str: {
        score: '52',
        mod: '+6',
      },
      int: {
        score: '25',
        mod: '+5',
      },
      con: {
        score: '33',
        mod: '+5',
      },
      dex: {
        score: '30',
        mod: '+5',
      },
      cha: {
        score: '15',
        mod: '+4',
      },
    },
    attacks: [
      {
        name: 'Grappling',
        toHit: '16+F',
        damage: '4d8+6 Bludgeoning',
        range: '5ft range',
        effect: 'On hit: Held',
      },
      {
        name: 'Web-Shooting',
        toHit: '15+F',
        damage: '5d6+6 Bludgeoning',
        range: '30ft range',
        effect: 'Major Fail+: Held',
      },
    ],
    notes: 'Full text: Core Rulebook p. 595.',
    source: 'Core Rulebook p. 595',
    chapter: 'Floor 5 · The Bubbles',
    floor: 5,
    description:
      "Eight arms, perfect for grabbing you in a death hug. It wrestles up close and shoots webs from 30 feet. Pro tip: it's all brute force and sticky strings. Hit it hard before it gets all eight on you, because it will not let go.",
    prevDescriptions: [
      "Eight limbs, all of them for hugging, none of them friendly. The Grappler wrestles you at arm's reach and webs you from across the room. Pro tip: bring a knife for the silk. And a chiropractor.",
    ],
    prevNotes: ['Full text: Core Rulebook p. 595.'],
    descriptionEs:
      'Ocho brazos, perfectos para agarrarte en un abrazo mortal. Forcejea cuerpo a cuerpo y lanza telarañas desde 30 pies. Pro-Tip: todo es fuerza bruta e hilos pegajosos. Pégale fuerte antes de que te ponga los ocho encima, porque no te va a soltar.',
    prevDescriptionsEs: [
      'Ocho brazos, perfectos para agarrarte en un abrazo mortal. Forcejea cuerpo a cuerpo y lanza telarañas desde 30 pies. Consejo pro: todo es fuerza bruta e hilos pegajosos. Pégale fuerte antes de que te ponga los ocho encima, porque no te va a soltar.',
    ],
  },
  {
    name: 'Arachnid Arcanist',
    kind: 'mob',
    size: 'Medium (4)',
    tags: 'Humanoid',
    slots: '10',
    slotValue: '5',
    level: '50',
    surprise: '16+F',
    evade: '15+F',
    move: '40+S',
    dr: '0',
    stats: {
      str: {
        score: '20',
        mod: '+5',
      },
      int: {
        score: '52',
        mod: '+6',
      },
      con: {
        score: '33',
        mod: '+5',
      },
      dex: {
        score: '30',
        mod: '+5',
      },
      cha: {
        score: '20',
        mod: '+5',
      },
    },
    attacks: [
      {
        name: 'Butt Blast Spell',
        toHit: '16+F',
        damage: '5d6+6 Necrotic',
        range: '30ft range',
        effect: 'Special effect',
      },
    ],
    notes:
      'Butt Blast Spell: hit → marked for rest of combat (But, Butt, Buu... Debuff). Marked + hit again → Spell becomes a random attack Spell (keeps range), 5dX damage, plus its Rank 10 Upgrade if any.\n\nFull text: Core Rulebook p. 595.',
    source: 'Core Rulebook p. 595',
    chapter: 'Floor 5 · The Bubbles',
    floor: 5,
    description:
      "This spider-wizard casts Butt Blast. Get hit once and you're marked. Get hit again and it turns into a random spell at full power. Pro tip: kill it before round two, or you'll be the crawler who died to a fart joke. Legend has it the sponsors framed the last one.",
    prevDescriptions: [
      "A spider wizard whose signature spell comes out of the back end. I didn't design it. Okay, I did. Get hit twice and the spell turns into something random and nasty. Pro tip: don't get hit twice. It's a slot machine where you're the jackpot.",
    ],
    prevNotes: [
      'Full text: Core Rulebook p. 595.',
      'Butt Blast Spell: hit → marked for rest of combat (But, Butt, Buu... Debuff). Marked + hit again → Spell becomes a random attack Spell (keeps range), 5dX damage, plus its Rank 10 Upgrade if any.\n\nFull text: Core Rulebook p. 595.',
    ],
    descriptionEs:
      'Este mago araña lanza Butt Blast. Si te da una vez, quedas marcado. Si te da otra, se convierte en un hechizo aleatorio a máxima potencia. Pro-Tip: mátalo antes del segundo asalto, o serás el crawler que murió por un chiste de pedos. Cuenta la leyenda que los patrocinadores enmarcaron al último.',
    prevDescriptionsEs: [
      'Este mago araña lanza Butt Blast. Si te da una vez, quedas marcado. Si te da otra, se convierte en un hechizo aleatorio a máxima potencia. Consejo pro: mátalo antes del segundo asalto, o serás el crawler que murió por un chiste de pedos. Cuenta la leyenda que los patrocinadores enmarcaron al último.',
    ],
  },
  {
    name: 'Thing Too Horrible to Name',
    kind: 'mob',
    size: 'Medium (4)',
    tags: 'Spirit',
    slots: '10',
    slotValue: '5',
    level: '55',
    surprise: '17+F',
    evade: '15+F',
    move: '20+S',
    dr: '0',
    stats: {
      str: {
        score: '1',
        mod: '+1',
      },
      int: {
        score: '110',
        mod: '+7',
      },
      con: {
        score: '24',
        mod: '+5',
      },
      dex: {
        score: '30',
        mod: '+5',
      },
      cha: {
        score: '5',
        mod: '+2',
      },
    },
    attacks: [
      {
        name: 'Psychic Bolt Spell',
        toHit: '17+F',
        damage: '5d6+7, Psychic',
        range: '40ft range',
        effect: 'Major Fail+: Terrified',
      },
    ],
    notes: 'Full text: Core Rulebook p. 596.',
    source: 'Core Rulebook p. 596',
    chapter: 'Floor 5 · The Bubbles',
    floor: 5,
    description:
      "We couldn't name it because the naming intern's head popped. It fires psychic bolts from 40 feet, and that's all you need to know. Pro tip: avoid thinking. Shouldn't be hard for most of you. Fast hands, empty skulls, you'll be fine.",
    prevDescriptions: [
      "We tried to name it. Three writers quit. It fires psychic bolts and shows you your worst nightmare in HD, fully personalized. Viewers, please enjoy the screaming. It's in the contract.",
    ],
    prevNotes: ['Full text: Core Rulebook p. 596.'],
    descriptionEs:
      'No pudimos ponerle nombre porque al becario de los nombres le explotó la cabeza. Dispara rayos psíquicos desde 40 pies, y eso es todo lo que necesitas saber. Pro-Tip: evita pensar. No debería costarle mucho a la mayoría de vosotros. Manos rápidas, cráneos vacíos, estaréis bien.',
    prevDescriptionsEs: [
      'No pudimos ponerle nombre porque al becario de los nombres le explotó la cabeza. Dispara rayos psíquicos desde 40 pies, y eso es todo lo que necesitas saber. Consejo pro: evita pensar. No debería costarle mucho a la mayoría de vosotros. Manos rápidas, cráneos vacíos, estaréis bien.',
    ],
  },
  {
    name: 'Kensington',
    kind: 'boss',
    size: 'Huge (6)',
    tags: 'Borough Boss, Tree, Feral',
    slots: '10',
    slotValue: '6',
    level: '69',
    surprise: '16+F',
    evade: '15+F',
    move: '20+S',
    dr: '5',
    stats: {
      str: {
        score: '60',
        mod: '+6',
      },
      int: {
        score: '51',
        mod: '+6',
      },
      con: {
        score: '54',
        mod: '+6',
      },
      dex: {
        score: '24',
        mod: '+5',
      },
      cha: {
        score: '102',
        mod: '+7',
      },
    },
    attacks: [
      {
        name: 'Branch Manager',
        toHit: '16+F+F',
        damage: '6d10+6+F Bludgeoning',
        range: '100ft range',
        effect: 'Special effect',
      },
      {
        name: 'Putrid Pear',
        toHit: '15+F+F',
        damage: '5d6+5+F Necrotic',
        range: '100ft range',
        effect: 'Major Fail+: Sepsis',
      },
    ],
    notes:
      "So Tragic: crawlers wearing goth clothing have Resistance to Branch Manager.\nThe Tower: Kensington's own Area Attacks damage his tower; tell players marble chips off with each hit. At 100 total damage the tower collapses; he falls slowly across a lull in combat, then takes 12d10 on landing.\nFeral: an extra +F is already added to his to-hit and damage.\nBranch Manager: on Evade Major Fail or worse, the crawler can do nothing for the rest of the current round.\n\nFull text: Core Rulebook p. 600.",
    source: 'Core Rulebook p. 600',
    chapter: 'Floor 5 · The Bubbles',
    floor: 5,
    description:
      "A goth tree with daddy issues living in a marble tower, throwing branches and rotten pears from 100 feet. He's Feral, so he hits extra hard. Pro tip: wear black and he'll feel seen. And every area attack he throws chips his own tower. Let him smash his own house, then enjoy the fall.",
    prevDescriptions: [
      "An angsty pear tree perched on a marble tower, flinging rotten fruit and existential dread from 100 feet. He's very emo. Pro tip: every time he blasts the area, his tower cracks a little. Let him wreck his own home. Also, black eyeliner helps.",
    ],
    prevNotes: [
      'Special: So Tragic; The Tower; Feral. Full text: Core Rulebook p. 600.',
      "So Tragic: crawlers wearing goth clothing have Resistance to Branch Manager.\nThe Tower: Kensington's own Area Attacks damage his tower; tell players marble chips off with each hit. At 100 total damage the tower collapses; he falls slowly across a lull in combat, then takes 12d10 on landing.\nFeral: an extra +F is already added to his to-hit and damage.\nBranch Manager: on Evade Major Fail or worse, the crawler can do nothing for the rest of the current round.\n\nFull text: Core Rulebook p. 600.",
    ],
    descriptionEs:
      'Un árbol gótico con traumas paternos que vive en una torre de mármol y lanza ramas y peras podridas desde 100 pies. Es Feral, así que pega más fuerte. Pro-Tip: vístete de negro y se sentirá comprendido. Y cada ataque de área que lanza le desconcha su propia torre. Deja que se cargue su casa y luego disfruta de la caída.',
    prevDescriptionsEs: [
      'Un árbol gótico con traumas paternos que vive en una torre de mármol y lanza ramas y peras podridas desde 100 pies. Es Feral, así que pega más fuerte. Consejo pro: vístete de negro y se sentirá comprendido. Y cada ataque de área que lanza le desconcha su propia torre. Deja que se cargue su casa y luego disfruta de la caída.',
    ],
  },
  {
    name: 'Dirigible Gnome',
    kind: 'mob',
    size: 'Petite (3)',
    tags: 'Humanoid',
    slots: '10',
    slotValue: '3',
    level: '30',
    surprise: '15+F',
    evade: '15+F',
    move: '20+S',
    dr: '5',
    stats: {
      str: {
        score: '25',
        mod: '+5',
      },
      int: {
        score: '26',
        mod: '+5',
      },
      con: {
        score: '9',
        mod: '+3',
      },
      dex: {
        score: '25',
        mod: '+5',
      },
      cha: {
        score: '10',
        mod: '+4',
      },
    },
    attacks: [
      {
        name: 'Gnomish Knock-Knocks',
        toHit: '15+F',
        damage: '4d8 Fire',
        range: '50ft range',
        effect: 'Burned',
      },
      {
        name: 'Nose-Dive',
        toHit: '15+F',
        damage: '5d10 Bludgeoning',
        range: '15ft Burst radius',
        effect: 'Special effect',
      },
    ],
    notes:
      'Flight: moves through the air as if on the ground; stays aloft, so melee is hard.\nGnomish Knock-Knocks: 10ft Blast plus 10ft Splash. On an Evade Amazing Success or better, the bomb lands back in their cockpit and detonates on the crew.\nNose-Dive: a last-resort crash attack that kills the gnomes.\n\nFull text: Core Rulebook p. 603.',
    source: 'Core Rulebook p. 603',
    chapter: 'Floor 5 · The Bubbles',
    floor: 5,
    description:
      "Gnomes in a blimp, lobbing bombs and telling jokes. Dodge like a champ and the bomb lands back in their laps. Pro tip: when things get grim, they nose-dive into you and die together. Get out of the crater zone, it's their suicide pact, not yours.",
    prevDescriptions: [
      "Gnomes in a blimp dropping firebombs. Every one of them thinks it's a genius. The bombs are unstable, so a really good dodge sends one right back to sender. Pro tip: when they start diving, they've given up. Get clear and watch the fireworks.",
    ],
    prevNotes: [
      'Special: Flight. Full text: Core Rulebook p. 603.',
      'Flight: moves through the air as if on the ground; stays aloft, so melee is hard.\nGnomish Knock-Knocks: 10ft Blast plus 10ft Splash. On an Evade Amazing Success or better, the bomb lands back in their cockpit and detonates on the crew.\nNose-Dive: a last-resort crash attack that kills the gnomes.\n\nFull text: Core Rulebook p. 603.',
    ],
    descriptionEs:
      'Gnomos en un dirigible, tirando bombas y contando chistes. Esquiva como un campeón y la bomba les cae en su propio regazo. Pro-Tip: cuando la cosa se pone fea, se lanzan en picado contra ti para morir juntos. Sal de la zona del cráter: el pacto suicida es suyo, no tuyo.',
    prevDescriptionsEs: [
      'Gnomos en un dirigible, tirando bombas y contando chistes. Esquiva como un campeón y la bomba les cae en su propio regazo. Consejo pro: cuando la cosa se pone fea, se lanzan en picado contra ti para morir juntos. Sal de la zona del cráter: el pacto suicida es suyo, no tuyo.',
    ],
  },
  {
    name: 'Frost Maidens',
    kind: 'mob',
    size: 'Petite (3)',
    tags: 'Ice Fairy',
    slots: '10',
    slotValue: '4',
    level: '33',
    surprise: '15+F',
    evade: '15+F',
    move: '30+S',
    dr: '5',
    stats: {
      str: {
        score: '9',
        mod: '+3',
      },
      int: {
        score: '25',
        mod: '+5',
      },
      con: {
        score: '10',
        mod: '+4',
      },
      dex: {
        score: '30',
        mod: '+5',
      },
      cha: {
        score: '30',
        mod: '+5',
      },
    },
    attacks: [
      {
        name: 'Ice Shard',
        toHit: '13+F',
        damage: '5d8+3 Ice',
        range: '5ft range',
        effect: '',
      },
      {
        name: 'Ice Blast Spell',
        toHit: '15+F',
        damage: '3d10+5 Ice',
        range: '20ft Cone',
        effect: 'Special effect',
      },
    ],
    notes:
      'Thermally Biased: Immune to Ice damage; takes x2 damage from Fire.\nIce Blast Spell: hit crawlers are pushed 5ft per 2 HB slots lost.\n\nFull text: Core Rulebook p. 603.',
    source: 'Core Rulebook p. 603',
    chapter: 'Floor 5 · The Bubbles',
    floor: 5,
    description:
      'Ice fairies with pretty wings and cold, cold hearts. They blast you with ice and shove you backward. Immune to ice, weak to fire. Pro tip: bring a torch, a fireball, a flamethrower, anything. Melted fairy is hilarious, and the viewers love a good sizzle.',
    prevDescriptions: [
      'Frosty little fairies with icicle daggers and a cold shoulder for everyone. They freeze, they push, they giggle. Pro tip: they melt. Bring fire and watch the tiny tantrums.',
    ],
    prevNotes: [
      'Special: Thermally Biased. Full text: Core Rulebook p. 603.',
      'Thermally Biased: Immune to Ice damage; takes x2 damage from Fire.\nIce Blast Spell: hit crawlers are pushed 5ft per 2 HB slots lost.\n\nFull text: Core Rulebook p. 603.',
    ],
    descriptionEs:
      'Hadas de hielo con alas preciosas y corazones fríos, fríos. Te revientan con hielo y te empujan hacia atrás. Inmunes al hielo, débiles al fuego. Pro-Tip: trae una antorcha, una bola de fuego, un lanzallamas, lo que sea. Un hada derretida es para partirse, y a los espectadores les encanta un buen chisporroteo.',
    prevDescriptionsEs: [
      'Hadas de hielo con alas preciosas y corazones fríos, fríos. Te revientan con hielo y te empujan hacia atrás. Inmunes al hielo, débiles al fuego. Consejo pro: trae una antorcha, una bola de fuego, un lanzallamas, lo que sea. Un hada derretida es para partirse, y a los espectadores les encanta un buen chisporroteo.',
    ],
  },
  {
    name: 'Skyfowl Raiders',
    kind: 'mob',
    size: 'Medium (4)',
    tags: 'Aerial Ambusher',
    slots: '10',
    slotValue: '4',
    level: '33',
    surprise: '14+F',
    evade: '15+F',
    move: '20+S',
    dr: '5',
    stats: {
      str: {
        score: '30',
        mod: '+5',
      },
      int: {
        score: '18',
        mod: '+4',
      },
      con: {
        score: '15',
        mod: '+4',
      },
      dex: {
        score: '30',
        mod: '+5',
      },
      cha: {
        score: '11',
        mod: '+4',
      },
    },
    attacks: [
      {
        name: 'Crossbow',
        toHit: '15+F',
        damage: '5d8 Piercing',
        range: '50ft range',
        effect: '',
      },
      {
        name: 'Talon',
        toHit: '15+F',
        damage: '5d6+5 Slashing',
        range: '5ft range',
        effect: 'Major Fail+: Blood Trail',
      },
    ],
    notes: 'Full text: Core Rulebook p. 604.',
    source: 'Core Rulebook p. 604',
    chapter: 'Floor 5 · The Bubbles',
    floor: 5,
    description:
      'Bird people with crossbows and talons, diving out of the sky to shoot you in the ass. No tricks, no gimmicks, just flying assholes with good aim. Pro tip: find cover. Roofs, trees, your shorter friends. Whatever works.',
    prevDescriptions: [
      "Bird bandits with crossbows and very sharp feet. They swoop, they shoot, they shred. Pro tip: watch the sky, and maybe don't bleed where the talons can smell it.",
    ],
    prevNotes: ['Full text: Core Rulebook p. 604.'],
    descriptionEs:
      'Hombres pájaro con ballestas y garras que bajan en picado del cielo para dispararte en el culo. Sin trucos, sin artimañas, solo cabrones voladores con buena puntería. Pro-Tip: busca cobertura. Tejados, árboles, tus amigos más bajitos. Lo que funcione.',
    prevDescriptionsEs: [
      'Hombres pájaro con ballestas y garras que bajan en picado del cielo para dispararte en el culo. Sin trucos, sin artimañas, solo cabrones voladores con buena puntería. Consejo pro: busca cobertura. Tejados, árboles, tus amigos más bajitos. Lo que funcione.',
    ],
  },
  {
    name: 'Snowgrave',
    kind: 'mob',
    size: 'Small (2)',
    tags: 'Goblinoid Phantom',
    slots: '10',
    slotValue: '4',
    level: '35',
    surprise: '14+F',
    evade: '15+F',
    move: '20+S',
    dr: '5',
    stats: {
      str: {
        score: '40',
        mod: '+5',
      },
      int: {
        score: '15',
        mod: '+4',
      },
      con: {
        score: '15',
        mod: '+4',
      },
      dex: {
        score: '35',
        mod: '+5',
      },
      cha: {
        score: '5',
        mod: '+2',
      },
    },
    attacks: [
      {
        name: 'Talon',
        toHit: '15+F',
        damage: '5d10+5 Slashing',
        range: '5ft range',
        effect: '',
      },
      {
        name: 'Grapple',
        toHit: '15+F',
        damage: '4d6+5 Bludgeoning',
        range: '5ft range',
        effect: 'On hit: Held',
      },
    ],
    notes:
      'Snow Swimming: snow counts as normal ground for its movement.\nUnder Snow Tow: Held crawler → pulled beneath snow next round, Suffocating: 1d6+F each round end until an Unopposed Swimming Skill Check succeeds.\n\nFull text: Core Rulebook p. 604.',
    source: 'Core Rulebook p. 604',
    chapter: 'Floor 5 · The Bubbles',
    floor: 5,
    description:
      'A goblin ghost that swims through snow like a shark. It grabs you and drags you under, where you suffocate in a snowdrift. Pro tip: learn to swim, because breaking free takes a Swimming check. Nobody said the dungeon made sense.',
    prevDescriptions: [
      'A goblin ghost that swims through snowdrifts like a shark in a slushie. It grabs your ankle and pulls you under for a cozy suffocation. Pro tip: if it grabs you, break free before next round. Or brush up on your snow breaststroke.',
    ],
    prevNotes: [
      'Special: Snow Swimming; Under Snow Tow. Full text: Core Rulebook p. 604.',
      'Snow Swimming: snow counts as normal ground for its movement.\nUnder Snow Tow: Held crawler → pulled beneath snow next round, Suffocating: 1d6+F each round end until an Unopposed Swimming Skill Check succeeds.\n\nFull text: Core Rulebook p. 604.',
    ],
    descriptionEs:
      'Un fantasma goblin que nada por la nieve como un tiburón. Te agarra y te arrastra hacia abajo, donde te asfixias en un ventisquero. Pro-Tip: aprende a nadar, porque soltarte requiere una tirada de Swimming. Nadie dijo que la mazmorra tuviera sentido.',
    prevDescriptionsEs: [
      'Un fantasma goblin que nada por la nieve como un tiburón. Te agarra y te arrastra hacia abajo, donde te asfixias en un ventisquero. Consejo pro: aprende a nadar, porque soltarte requiere una tirada de Swimming. Nadie dijo que la mazmorra tuviera sentido.',
    ],
  },
  {
    name: 'Guard Dwarf',
    kind: 'mob',
    size: 'Medium (4)',
    tags: 'City Guard',
    slots: '10',
    slotValue: '6',
    level: '75',
    surprise: '15+F',
    evade: '16+F',
    move: '20+S',
    dr: '5',
    stats: {
      str: {
        score: '60',
        mod: '+6',
      },
      int: {
        score: '30',
        mod: '+5',
      },
      con: {
        score: '60',
        mod: '+6',
      },
      dex: {
        score: '50',
        mod: '+6',
      },
      cha: {
        score: '30',
        mod: '+5',
      },
    },
    attacks: [
      {
        name: 'Stiletto',
        toHit: '16+F',
        damage: '7d8+6 Piercing',
        range: '5ft range, Armor-Piercing',
        effect: '',
      },
      {
        name: 'Grapple',
        toHit: '16+F',
        damage: '6d6+6 Bludgeoning',
        range: '5ft range',
        effect: 'On hit: Held',
      },
    ],
    notes: 'Full text: Core Rulebook p. 605.',
    source: 'Core Rulebook p. 605',
    chapter: 'Floor 5 · The Bubbles',
    floor: 5,
    description:
      "Dwarven city guards. Not a boss, just a cop with a stiletto that pierces armor and a grapple that doesn't let go. Level 75. Pro tip: don't start shit in town. Seriously, just pay the fine. These guys don't read you your rights, they read your obituary.",
    prevDescriptions: [
      "City Guard, level 75, and extremely unamused. He'll pin you in a bear hug and slip a stiletto through the gaps in your armor. Pro tip: pay the fine, whatever it is. Resisting arrest has a very high mortality rate here.",
    ],
    prevNotes: ['Full text: Core Rulebook p. 605.'],
    descriptionEs:
      'Guardias urbanos enanos. No es un Jefe, solo un madero con un estilete que atraviesa armaduras y una presa que no suelta. Nivel 75. Pro-Tip: no montes follón en la ciudad. En serio, paga la multa. Estos no te leen tus derechos, te leen la esquela.',
    prevDescriptionsEs: [
      'Guardias urbanos enanos. No es un Jefe, solo un madero con un estilete que atraviesa armaduras y una presa que no suelta. Nivel 75. Consejo pro: no montes follón en la ciudad. En serio, paga la multa. Estos no te leen tus derechos, te leen la esquela.',
    ],
  },
  {
    name: 'Snow Shifter',
    kind: 'boss',
    size: 'Huge (6)',
    tags: 'Neighborhood Boss, Shapeshifter',
    slots: '8',
    slotValue: '6',
    level: '62',
    surprise: '16+F',
    evade: '16+F',
    move: '30+S',
    dr: '5',
    stats: {
      str: {
        score: '80',
        mod: '+6',
      },
      int: {
        score: '60',
        mod: '+6',
      },
      con: {
        score: '80',
        mod: '+6',
      },
      dex: {
        score: '85',
        mod: '+6',
      },
      cha: {
        score: '30',
        mod: '+5',
      },
    },
    attacks: [
      {
        name: 'Snake Bite',
        toHit: '16+F',
        damage: '7d10+6 Ice',
        range: '10ft range (only in',
        effect: 'Special effect',
      },
      {
        name: 'Snowman Crush',
        toHit: '16+F',
        damage: '6d8+6 Ice',
        range: '10ft range',
        effect: 'Major Fail+: Take Down',
      },
      {
        name: 'Snowburst',
        toHit: '16+F',
        damage: '5d6+6 Ice',
        range: '30ft Burst (only in',
        effect: 'Death',
      },
      {
        name: 'Blizzard Spell',
        toHit: '15+F',
        damage: '5d6+6 Ice',
        range: '30ft range, 10ft',
        effect: 'Paralyzed',
      },
    ],
    notes:
      'Hot Poker Vulnerability: Piercing and non-Spell Fire → ×2 damage.\nNot So Shifty: −2 Evade on any round it transforms.\nSnowman Form: triggers at 50% HB; +5 DR.\nAvalanche Form: triggers at 20% HB; Resistance to ALL damage, 0 DR, Spell Immunity kept.\nForm locks: Snake Bite = snake, Snowman Crush = snowman, Snowburst = avalanche.\nSnowburst: per 2 HB slots lost → +1 stack Freezing to Death (stackable): 1d6+F Ice each round end.\nBlizzard Spell: 10ft blast; 3+ HB slots lost → Paralyzed.\n\nFull text: Core Rulebook p. 610.',
    source: 'Core Rulebook p. 610',
    chapter: 'Floor 5 · The Bubbles',
    floor: 5,
    description:
      "Snake, snowman, avalanche. Pick a favorite, you'll see all three. It gets tougher the more you hurt it and freezes you solid while it's at it. Pro tip: it hates hot pointy things, and it fumbles dodges mid-transformation. Stab it at the right moment and the viewers get a slushie.",
    prevDescriptions: [
      "Snake, snowman, avalanche: pick your favorite, you'll see all three. This shapeshifter gets tougher as it gets hurt. Pro tip: it hates hot, pointy things, and it fumbles its dodges mid-transformation. Time your stab right and the viewers get a slushie.",
    ],
    prevNotes: [
      'Special: Hot Poker Vulnerability; Not So Shifty; Snowman Form; Avalanche Form. Full text: Core Rulebook p. 610.',
      'Hot Poker Vulnerability: Piercing and non-Spell Fire → ×2 damage.\nNot So Shifty: −2 Evade on any round it transforms.\nSnowman Form: triggers at 50% HB; +5 DR.\nAvalanche Form: triggers at 20% HB; Resistance to ALL damage, 0 DR, Spell Immunity kept.\nForm locks: Snake Bite = snake, Snowman Crush = snowman, Snowburst = avalanche.\nSnowburst: per 2 HB slots lost → +1 stack Freezing to Death (stackable): 1d6+F Ice each round end.\nBlizzard Spell: 10ft blast; 3+ HB slots lost → Paralyzed.\n\nFull text: Core Rulebook p. 610.',
    ],
    descriptionEs:
      'Serpiente, muñeco de nieve, avalancha. Elige tu favorita, vas a ver las tres. Se vuelve más duro cuanto más daño le haces y de paso te congela hasta dejarte tieso. Pro-Tip: odia las cosas calientes y puntiagudas, y la caga en las esquivas a mitad de transformación. Apuñálalo en el momento justo y los espectadores se llevan un granizado.',
    prevDescriptionsEs: [
      'Serpiente, muñeco de nieve, avalancha. Elige tu favorita, vas a ver las tres. Se vuelve más duro cuanto más daño le haces y de paso te congela hasta dejarte tieso. Consejo pro: odia las cosas calientes y puntiagudas, y la caga en las esquivas a mitad de transformación. Apuñálalo en el momento justo y los espectadores se llevan un granizado.',
    ],
  },
  {
    name: 'Crocodilian Clawpad',
    kind: 'mob',
    size: 'Large (5)',
    tags: 'Humanoid',
    slots: '10',
    slotValue: '5',
    level: '43',
    surprise: '15+F',
    evade: '15+F',
    move: '20+S',
    dr: '5',
    stats: {
      str: {
        score: '30',
        mod: '+5',
      },
      int: {
        score: '24',
        mod: '+5',
      },
      con: {
        score: '40',
        mod: '+5',
      },
      dex: {
        score: '20',
        mod: '+5',
      },
      cha: {
        score: '20',
        mod: '+5',
      },
    },
    attacks: [
      {
        name: 'Claws',
        toHit: '15+F',
        damage: '4d8+5 Slashing',
        range: '5ft range',
        effect: 'Major Fail+: Blood Trail',
      },
      {
        name: 'Harpoon Gun',
        toHit: '15+F',
        damage: '3d10 Piercing',
        range: '50ft range',
        effect: 'On hit: Stiff Legs',
      },
    ],
    notes:
      'Ambush Predator: if not surprised, it attacks with Advantage during round 1 of combat.\n\nFull text: Core Rulebook p. 613.',
    source: 'Core Rulebook p. 613',
    chapter: 'Floor 5 · The Bubbles',
    floor: 5,
    description:
      'Crocodile ninja hiding in the swamp, waiting to jump you. If it gets the drop, round one is claws and harpoons with Advantage. Pro tip: search the water before you wade. Or send the new guy in first. Hazing is a proud tradition.',
    prevDescriptions: [
      "A crocodile who took up stealth, like a ninja with a snack problem. It strikes first, strikes hard, and harpoons your legs so you can't run. Pro tip: spot it before it spots you. Spoiler: you won't.",
    ],
    prevNotes: [
      'Special: Ambush Predator. Full text: Core Rulebook p. 613.',
      'Ambush Predator: if not surprised, it attacks with Advantage during round 1 of combat.\n\nFull text: Core Rulebook p. 613.',
    ],
    descriptionEs:
      'Un cocodrilo ninja escondido en el pantano, esperando para saltarte encima. Si te pilla desprevenido, el primer asalto son garras y arpones con Ventaja. Pro-Tip: registra el agua antes de meterte. O manda primero al nuevo. Las novatadas son una tradición de la que estamos muy orgullosos.',
    prevDescriptionsEs: [
      'Un cocodrilo ninja escondido en el pantano, esperando para saltarte encima. Si te pilla desprevenido, el primer asalto son garras y arpones con Ventaja. Consejo pro: registra el agua antes de meterte. O manda primero al nuevo. Las novatadas son una tradición de la que estamos muy orgullosos.',
    ],
  },
  {
    name: 'Crocodilian Deathroller',
    kind: 'mob',
    size: 'Large (5)',
    tags: 'Humanoid',
    slots: '10',
    slotValue: '5',
    level: '52',
    surprise: '15+F',
    evade: '15+F',
    move: '20+S',
    dr: '5',
    stats: {
      str: {
        score: '30',
        mod: '+5',
      },
      int: {
        score: '30',
        mod: '+5',
      },
      con: {
        score: '40',
        mod: '+5',
      },
      dex: {
        score: '20',
        mod: '+5',
      },
      cha: {
        score: '41',
        mod: '+5',
      },
    },
    attacks: [
      {
        name: 'Bite',
        toHit: '15+5',
        damage: '4d10+5 Piercing',
        range: '5ft range',
        effect: 'On hit: Held',
      },
      {
        name: 'Roll the Bones!',
        toHit: '15+F',
        damage: '5d10+5 (see below for damage type)',
        range: '100ft range',
        effect: 'Special effect',
      },
    ],
    notes:
      'Death-Roll: round after a crawler becomes Held, uses an Action to spin them → Shredded: 1d6+F Slashing each round end until Held ends or it dies.\nRoll the Bones!: damage type by 1d6: Electric 1 / Fire 2 / Force 3 / Ice 4 / Psychic 5 / Sonic 6.\n\nFull text: Core Rulebook p. 613.',
    source: 'Core Rulebook p. 613',
    chapter: 'Floor 5 · The Bubbles',
    floor: 5,
    description:
      "Grabs you, then death-rolls you into shredded jerky. It also throws a 'Roll the Bones!' attack with random damage types, so good luck resisting that. Pro tip: break free from Held fast, or you're a meat tornado. The kids at home love a good spin cycle.",
    prevDescriptions: [
      'It bites, it holds, it rolls you like a burrito in a blender. And for range it throws a mystery bone curse whose damage type is decided by dice, because even I like surprises. Pro tip: escape the grip before the spin cycle starts.',
    ],
    prevNotes: [
      'Special: Death-Roll. Full text: Core Rulebook p. 613.',
      'Death-Roll: round after a crawler becomes Held, uses an Action to spin them → Shredded: 1d6+F Slashing each round end until Held ends or it dies.\nRoll the Bones!: damage type by 1d6: Electric 1 / Fire 2 / Force 3 / Ice 4 / Psychic 5 / Sonic 6.\n\nFull text: Core Rulebook p. 613.',
    ],
    descriptionEs:
      'Te agarra y luego te hace el giro de la muerte hasta dejarte en cecina deshilachada. También lanza un ataque «Roll the Bones!» con tipos de daño aleatorios, así que suerte resistiendo eso. Pro-Tip: libérate de Held rápido, o serás un tornado de carne. A los niños en casa les encanta un buen centrifugado.',
    prevDescriptionsEs: [
      'Te agarra y luego te hace el giro de la muerte hasta dejarte en cecina deshilachada. También lanza un ataque «Roll the Bones!» con tipos de daño aleatorios, así que suerte resistiendo eso. Consejo pro: libérate de Held rápido, o serás un tornado de carne. A los niños en casa les encanta un buen centrifugado.',
    ],
  },
  {
    name: 'Lutin Bounty Hunter',
    kind: 'mob',
    size: 'Petite (3)',
    tags: 'Humanoid',
    slots: '10',
    slotValue: '5',
    level: '44',
    surprise: '15+F',
    evade: '15+F',
    move: '20+S',
    dr: '5',
    stats: {
      str: {
        score: '27',
        mod: '+5',
      },
      int: {
        score: '35',
        mod: '+5',
      },
      con: {
        score: '20',
        mod: '+5',
      },
      dex: {
        score: '35',
        mod: '+5',
      },
      cha: {
        score: '20',
        mod: '+5',
      },
    },
    attacks: [
      {
        name: 'Knife',
        toHit: '15+F',
        damage: '5d4+5 Piercing',
        range: '5ft range, Armor-Piercing',
        effect: '',
      },
      {
        name: 'Repeating Crossbow',
        toHit: '15+F',
        damage: '5d8 Piercing',
        range: '60 ft range',
        effect: 'every other round',
      },
    ],
    notes:
      'Buff Dudes: casts a Spell granting half the group +1 to one of Attack, Damage, or Evade.\nRepeating Crossbow: may spend its Move Action on a second crossbow attack in the same round; only every other round.\n\nFull text: Core Rulebook p. 614.',
    source: 'Core Rulebook p. 614',
    chapter: 'Floor 5 · The Bubbles',
    floor: 5,
    description:
      'Three feet tall, fifty pounds of pure spite, and a crossbow that fires twice as often as your will to live. Bounty Hunters buff half the squad before stabbing you in the kneecaps, because teamwork. Pro tip: the double shot only comes every other round. Count it out loud, dumbass, the audience can.',
    prevDescriptions: [
      'Three feet of spite with a bounty board and a repeating crossbow. Lutins hunt in packs and hype each other up with a little buff magic, like a tiny, murderous pep squad. Pro tip: that crossbow fires twice, but only every other round. Count along at home, folks!',
    ],
    prevNotes: [
      'Special: Buff Dudes. Full text: Core Rulebook p. 614.',
      'Buff Dudes: casts a Spell granting half the group +1 to one of Attack, Damage, or Evade.\nRepeating Crossbow: may spend its Move Action on a second crossbow attack in the same round; only every other round.\n\nFull text: Core Rulebook p. 614.',
    ],
    descriptionEs:
      'Tres pies de altura, veintitrés kilos de pura mala leche y una ballesta que dispara el doble de rápido de lo que se te van las ganas de vivir. Los Bounty Hunters le meten Buff a medio escuadrón antes de apuñalarte en las rodillas, porque trabajo en equipo. Pro-Tip: el disparo doble solo llega cada dos asaltos. Cuéntalo en voz alta, imbécil, que el público sí sabe.',
    prevDescriptionsEs: [
      'Tres pies de altura, veintitrés kilos de pura mala leche y una ballesta que dispara el doble de rápido de lo que se te van las ganas de vivir. Los Bounty Hunters le meten Buff a medio escuadrón antes de apuñalarte en las rodillas, porque trabajo en equipo. Consejo pro: el disparo doble solo llega cada dos asaltos. Cuéntalo en voz alta, imbécil, que el público sí sabe.',
    ],
  },
  {
    name: 'Lutin Priest',
    kind: 'mob',
    size: 'Petite (3)',
    tags: 'Humanoid',
    slots: '10',
    slotValue: '5',
    level: '50',
    surprise: '15+F',
    evade: '15+F',
    move: '20+S',
    dr: '5',
    stats: {
      str: {
        score: '25',
        mod: '+5',
      },
      int: {
        score: '35',
        mod: '+5',
      },
      con: {
        score: '20',
        mod: '+5',
      },
      dex: {
        score: '35',
        mod: '+5',
      },
      cha: {
        score: '40',
        mod: '+5',
      },
    },
    attacks: [
      {
        name: 'Unarmed Combat',
        toHit: '15+F',
        damage: '5d6+5 Bludgeoning',
        range: '5ft range',
        effect: '',
      },
    ],
    notes:
      'Even Buffer Dudes: Spell → self + a Weak group of allies gain +1 to two of Attack/Damage/Evade.\nSpell Bound: Rank 10 spells: Smite; Shield; Turn Undead; Holy Aura; Heal Others.\n\nFull text: Core Rulebook p. 615.',
    source: 'Core Rulebook p. 615',
    chapter: 'Floor 5 · The Bubbles',
    floor: 5,
    description:
      'The Lutin Priest heals his buddies, shields his buddies, buffs his buddies, then Smites you personally. Nothing says holy like a gnome punching your teeth down your throat. Pro tip: kill the fucking priest first, or spend all night hacking at goblins who refuse to stay dead-ish.',
    prevDescriptions: [
      'Behold the Lutin Priest, who found religion and decided it should punch you. He heals the gang, shields the gang, buffs the gang, then smites you personally. Pro tip: drop the holy man first, or enjoy fighting a pint-sized army that refuses to stay hurt.',
    ],
    prevNotes: [
      'Special: Even Buffer Dudes; Spell Bound. Full text: Core Rulebook p. 615.',
      'Even Buffer Dudes: Spell → self + a Weak group of allies gain +1 to two of Attack/Damage/Evade.\nSpell Bound: Rank 10 spells: Smite; Shield; Turn Undead; Holy Aura; Heal Others.\n\nFull text: Core Rulebook p. 615.',
    ],
    descriptionEs:
      'El Lutin Priest cura a sus colegas, protege a sus colegas, le mete Buff a sus colegas y luego te hace Smite a ti personalmente. Nada dice «sagrado» como un gnomo metiéndote los dientes garganta abajo de un puñetazo. Pro-Tip: mata primero al puto cura, o pásate la noche a hachazos con goblins que se niegan a quedarse más o menos muertos.',
    prevDescriptionsEs: [
      'El Lutin Priest cura a sus colegas, protege a sus colegas, le mete Buff a sus colegas y luego te hace Smite a ti personalmente. Nada dice «sagrado» como un gnomo metiéndote los dientes garganta abajo de un puñetazo. Consejo pro: mata primero al puto cura, o pásate la noche a hachazos con goblins que se niegan a quedarse más o menos muertos.',
    ],
  },
  {
    name: 'Temple Guard',
    kind: 'mob',
    size: 'Medium (4)',
    tags: 'Stony Phantasm',
    slots: '10',
    slotValue: '6',
    level: '55',
    surprise: '12+F',
    evade: '16+F',
    move: '25+S',
    dr: '7',
    stats: {
      str: {
        score: '50',
        mod: '+6',
      },
      int: {
        score: '5',
        mod: '+2',
      },
      con: {
        score: '60',
        mod: '+6',
      },
      dex: {
        score: '50',
        mod: '+6',
      },
      cha: {
        score: '5',
        mod: '+2',
      },
    },
    attacks: [
      {
        name: 'Stone Fist',
        toHit: '16+F',
        damage: '5d8+6 Bludgeoning',
        range: '5ft range',
        effect: '',
      },
      {
        name: 'Stone Shot',
        toHit: '16+F',
        damage: '5d6+6 Bludgeoning',
        range: '60ft range',
        effect: 'Major Fail+: Woozy',
      },
    ],
    notes: 'Full text: Core Rulebook p. 615.',
    source: 'Core Rulebook p. 615',
    chapter: 'Floor 5 · The Bubbles',
    floor: 5,
    description:
      "It's a statue. With a job. And it's really, really good at the job. Get close and it caves your skull in; back off and it throws rocks until your brain sloshes around like soup. The Woozy montage from last season is still our most-rewatched clip. Helmets are optional. Survival too.",
    prevDescriptions: [
      "A living statue with a guard job and zero sense of humor. It pounds you up close and pelts you with rocks from range, so hiding behind a pillar just means a closer look at its fists. Viewers love a good concussion montage. Please, keep your helmets on. Or don't!",
    ],
    prevNotes: ['Full text: Core Rulebook p. 615.'],
    descriptionEs:
      'Es una estatua. Con trabajo. Y se le da muy, pero que muy bien. Acércate y te hunde el cráneo; aléjate y te tira piedras hasta que el cerebro te chapotee como una sopa. El montaje de Woozy de la temporada pasada sigue siendo nuestro clip más revisto. El casco es opcional. Sobrevivir, también.',
  },
  {
    name: 'Temple Guardian',
    kind: 'boss',
    size: 'Huge (6)',
    tags: 'Borough Boss, Insane Guardian',
    slots: '10',
    slotValue: '6',
    level: '63',
    surprise: '12+F',
    evade: '16+F',
    move: '20+S',
    dr: '5',
    stats: {
      str: {
        score: '50',
        mod: '+6',
      },
      int: {
        score: '5',
        mod: '+2',
      },
      con: {
        score: '60',
        mod: '+6',
      },
      dex: {
        score: '50',
        mod: '+6',
      },
      cha: {
        score: '5',
        mod: '+2',
      },
    },
    attacks: [
      {
        name: 'Stone Shot',
        toHit: '16+F',
        damage: '5d12+6 Piercing',
        range: '50ft range',
        effect: '',
      },
      {
        name: 'Stone Drop',
        toHit: '15+5',
        damage: '7d8 Piercing',
        range: '30ft range',
        effect: '',
      },
      {
        name: 'Earthquake Stomp',
        toHit: '15+F',
        damage: '5d6+6 Bludgeoning',
        range: '20ft Burst',
        effect: 'On hit: Take Down',
      },
      {
        name: 'Stone Stampede',
        toHit: '15+F',
        damage: '5d6+6 Bludgeoning',
        range: '20ft Line',
        effect: 'On hit: Take Down',
      },
    ],
    notes:
      'Fit to be Untied: crawler Attacks at Disadvantage vs Difficulty 16 on a binding rope; success → rope cut, Guardian −2 HB slots.\nEarthquake Stomp: hit → Take Down.\nStone Stampede: auto-hits anyone with Take Down.\nSummon Temple Guard: 1 Guard shows up after Mob Action Resolution, takes position, no attack that turn.\n\nFull text: Core Rulebook p. 620.',
    source: 'Core Rulebook p. 620',
    chapter: 'Floor 5 · The Bubbles',
    floor: 5,
    description:
      'Borough Boss! A pile of angry masonry lashed together with rope, like a shitty IKEA god. It stomps you flat, then stampedes over everyone lying down, which is hilarious every single time. Pro tip: those ropes hold the whole thing together. Cut one and it sheds chunks. Also, more guards. Always more guards.',
    prevDescriptions: [
      "Borough Boss time! It's a towering rock pile held together with rope and pure anger. First it knocks you flat, then it runs you over while you're down. Classic combo. Pro tip: that rope isn't decorative. Snip, snip, and watch the whole thing come undone.",
    ],
    prevNotes: [
      'Special: Fit to be Untied. Full text: Core Rulebook p. 620.',
      'Fit to be Untied: crawler Attacks at Disadvantage vs Difficulty 16 on a binding rope; success → rope cut, Guardian −2 HB slots.\nEarthquake Stomp: hit → Take Down.\nStone Stampede: auto-hits anyone with Take Down.\nSummon Temple Guard: 1 Guard shows up after Mob Action Resolution, takes position, no attack that turn.\n\nFull text: Core Rulebook p. 620.',
    ],
    descriptionEs:
      '¡Jefe de Distrito! Un montón de mampostería cabreada atada con cuerdas, como un dios de IKEA de mierda. Te aplasta de un pisotón y luego pasa en estampida por encima de todos los que están tirados en el suelo, cosa que tiene gracia todas y cada una de las veces. Pro-Tip: esas cuerdas mantienen todo el tinglado en pie. Corta una y empieza a soltar cachos. Ah, y más guardias. Siempre hay más guardias.',
    prevDescriptionsEs: [
      '¡Jefe de Distrito! Un montón de mampostería cabreada atada con cuerdas, como un dios de IKEA de mierda. Te aplasta de un pisotón y luego pasa en estampida por encima de todos los que están tirados en el suelo, cosa que tiene gracia todas y cada una de las veces. Consejo pro: esas cuerdas mantienen todo el tinglado en pie. Corta una y empieza a soltar cachos. Ah, y más guardias. Siempre hay más guardias.',
    ],
  },
  {
    name: 'Bolt Hawk',
    kind: 'mob',
    size: 'Small (2)',
    tags: 'Beast',
    slots: '10',
    slotValue: '5',
    level: '30',
    surprise: '12+F',
    evade: '15+F',
    move: '30+S',
    dr: '5',
    stats: {
      str: {
        score: '21',
        mod: '+5',
      },
      int: {
        score: '5',
        mod: '+2',
      },
      con: {
        score: '22',
        mod: '+5',
      },
      dex: {
        score: '35',
        mod: '+5',
      },
      cha: {
        score: '12',
        mod: '+4',
      },
    },
    attacks: [
      {
        name: 'Ride the Lightning Spell',
        toHit: '12+F',
        damage: '4d8+2 Electric',
        range: '100ft Line',
        effect: 'every other round',
      },
      {
        name: 'Talons',
        toHit: '15+F',
        damage: '4d6+5 Slashing',
        range: '5ft range',
        effect: 'On hit: Blood Trail',
      },
    ],
    notes:
      'Flight: air counts as ground for movement.\nRide the Lightning: travels 100ft with the attack; every other round only.\nTalons: hit → Blood Trail.\n\nFull text: Core Rulebook p. 623.',
    source: 'Core Rulebook p. 623',
    chapter: 'Floor 5 · The Bubbles',
    floor: 5,
    description:
      "A hawk that got struck by lightning and decided it liked it. It rides a bolt a hundred feet, carves you open, and leaves you leaking a nice little blood trail for its friends. Pro tip: the lightning trick needs a round to recharge. That's your window. Don't piss it away screaming.",
    prevDescriptions: [
      "Half bird, half thunderstorm, all attitude. The Bolt Hawk turns into a lightning strike, zips across the room, and then tears into whoever's bleeding. Pro tip: it only rides the lightning every other round. Use the downtime wisely, or at least dramatically.",
    ],
    prevNotes: [
      'Special: Flight. Full text: Core Rulebook p. 623.',
      'Flight: air counts as ground for movement.\nRide the Lightning: travels 100ft with the attack; every other round only.\nTalons: hit → Blood Trail.\n\nFull text: Core Rulebook p. 623.',
    ],
    descriptionEs:
      'Un halcón al que le cayó un rayo y decidió que le molaba. Cabalga un relámpago cien pies, te abre en canal y te deja goteando un bonito rastro de sangre para sus amigos. Pro-Tip: el truco del rayo necesita un asalto para recargarse. Esa es tu oportunidad. No la desperdicies gritando como un gilipollas.',
    prevDescriptionsEs: [
      'Un halcón al que le cayó un rayo y decidió que le molaba. Cabalga un relámpago cien pies, te abre en canal y te deja goteando un bonito rastro de sangre para sus amigos. Consejo pro: el truco del rayo necesita un asalto para recargarse. Esa es tu oportunidad. No la desperdicies gritando como un gilipollas.',
    ],
  },
  {
    name: 'Bune Lieutenant',
    kind: 'npc',
    size: 'Petite (3)',
    tags: 'NPC, Humanoid',
    slots: '10',
    slotValue: '5',
    level: '35',
    surprise: '15+F',
    evade: '15+F',
    move: '20+S',
    dr: '5',
    stats: {
      str: {
        score: '21',
        mod: '+5',
      },
      int: {
        score: '41',
        mod: '+5',
      },
      con: {
        score: '23',
        mod: '+5',
      },
      dex: {
        score: '37',
        mod: '+5',
      },
      cha: {
        score: '13',
        mod: '+4',
      },
    },
    attacks: [
      {
        name: 'Claw',
        toHit: '15+F',
        damage: '4d6+5 Slashing',
        range: '5ft range',
        effect: '',
      },
    ],
    notes:
      'Rainbow Magic: Rank 10 spells, all rainbow-styled: Magic Missile; Shield; Hole; Dirt Clod; Heal Critter.\n\nFull text: Core Rulebook p. 624.',
    source: 'Core Rulebook p. 624',
    chapter: 'Floor 5 · The Bubbles',
    floor: 5,
    description:
      "The Bune Lieutenant casts everything in rainbow colors, like a unicorn threw up and the puke learned to kill. Magic missiles, sudden holes under your feet, a dirt clod to the face. Pro tip: that shiny shield means your arrows go nowhere. Punch through it or enjoy tasting the rainbow. Your own blood's a color too.",
    prevDescriptions: [
      'The Bune Lieutenant: officer, spellcaster, living screensaver. Every spell comes in full technicolor, which is great for ratings and terrible for you. Missiles, pits, shields, and a heal for the troops. Pro tip: the pretty lights are the dangerous part.',
    ],
    prevNotes: [
      'Special: Rainbow Magic. Full text: Core Rulebook p. 624.',
      'Rainbow Magic: Rank 10 spells, all rainbow-styled: Magic Missile; Shield; Hole; Dirt Clod; Heal Critter.\n\nFull text: Core Rulebook p. 624.',
    ],
    descriptionEs:
      'El Bune Lieutenant lanza todo en colores de arcoíris, como si un unicornio hubiera potado y la pota hubiera aprendido a matar. Proyectiles mágicos, agujeros que aparecen de repente bajo tus pies, un terrón en toda la cara. Pro-Tip: ese escudo brillante hace que tus flechas no lleguen a ningún sitio. Atraviésalo a hostias o disfruta saboreando el arcoíris. Tu propia sangre también es un color.',
    prevDescriptionsEs: [
      'El Bune Lieutenant lanza todo en colores de arcoíris, como si un unicornio hubiera potado y la pota hubiera aprendido a matar. Proyectiles mágicos, agujeros que aparecen de repente bajo tus pies, un terrón en toda la cara. Consejo pro: ese escudo brillante hace que tus flechas no lleguen a ningún sitio. Atraviésalo a hostias o disfruta saboreando el arcoíris. Tu propia sangre también es un color.',
    ],
  },
  {
    name: 'Bune Light Guard',
    kind: 'npc',
    size: 'Petite (3)',
    tags: 'NPC, Humanoid',
    slots: '10',
    slotValue: '5',
    level: '38',
    surprise: '14+F',
    evade: '15+F',
    move: '20+S',
    dr: '6',
    stats: {
      str: {
        score: '26',
        mod: '+5',
      },
      int: {
        score: '19',
        mod: '+4',
      },
      con: {
        score: '31',
        mod: '+5',
      },
      dex: {
        score: '35',
        mod: '+5',
      },
      cha: {
        score: '9',
        mod: '+3',
      },
    },
    attacks: [
      {
        name: 'Lightsword',
        toHit: '15+F',
        damage: '3d8+5 Force',
        range: '5ft range, Armor-Piercing',
        effect: '',
      },
    ],
    notes: 'Golden Armor: once per combat, can cast Wisp Armor at Rank 5.\n\nFull text: Core Rulebook p. 624.',
    source: 'Core Rulebook p. 624',
    chapter: 'Floor 5 · The Bubbles',
    floor: 5,
    description:
      "Gold armor, a glowing sword, and the smug confidence of a guy who's never had to earn anything. That Lightsword cuts through plate like it's wet cardboard. Pro tip: once per fight, his armor pops a wisp shield, so bait it out before you swing big. Or whiff your best hit. The blooper reel needs content.",
    prevDescriptions: [
      "Shiny gold armor and a glowing sword that punches straight through your plate. Very fashion-forward. Once a fight, that armor pulls out an extra defensive trick, so don't blow your big hit at the wrong moment. Or do. Blooper reels pay the bills too.",
    ],
    prevNotes: [
      'Special: Golden Armor. Full text: Core Rulebook p. 624.',
      'Golden Armor: once per combat, can cast Wisp Armor at Rank 5.\n\nFull text: Core Rulebook p. 624.',
    ],
    descriptionEs:
      'Armadura dorada, espada luminosa y la confianza chulesca de un tío que nunca ha tenido que ganarse nada. Esa Lightsword corta placas como si fueran cartón mojado. Pro-Tip: una vez por combate, su armadura saca un escudo de fuegos fatuos, así que provócalo antes de soltar tu golpe gordo. O falla tu mejor ataque. El programa de tomas falsas necesita contenido.',
    prevDescriptionsEs: [
      'Armadura dorada, espada luminosa y la confianza chulesca de un tío que nunca ha tenido que ganarse nada. Esa Lightsword corta placas como si fueran cartón mojado. Consejo pro: una vez por combate, su armadura saca un escudo de fuegos fatuos, así que provócalo antes de soltar tu golpe gordo. O falla tu mejor ataque. El programa de tomas falsas necesita contenido.',
    ],
  },
  {
    name: 'Rainbow Sprite',
    kind: 'mob',
    size: 'Tiny (1)',
    tags: 'Humanoid',
    slots: '10',
    slotValue: '5',
    level: '35',
    surprise: '14+F',
    evade: '15+F',
    move: '20+S',
    dr: '7',
    stats: {
      str: {
        score: '18',
        mod: '+4',
      },
      int: {
        score: '19',
        mod: '+4',
      },
      con: {
        score: '29',
        mod: '+5',
      },
      dex: {
        score: '43',
        mod: '+5',
      },
      cha: {
        score: '9',
        mod: '+3',
      },
    },
    attacks: [
      {
        name: 'Light Lance Spell',
        toHit: '14+F',
        damage: '4d8+4 Force',
        range: '40ft range',
        effect: '',
      },
      {
        name: 'Dust Blast Spell',
        toHit: '14+F',
        damage: '4d6+4 Force',
        range: '30ft range, 5ft Blast radius',
        effect: 'Dusted',
      },
    ],
    notes:
      'Flight: air counts as ground; can hover.\nDust Blast: 2+ HB slots lost → Dusted: Disadvantage on Attacks and sight-reliant Skill Checks until an Action is spent clearing eyes. Hit invisible creatures stay revealed until combat ends.\n\nFull text: Core Rulebook p. 625.',
    source: 'Core Rulebook p. 625',
    chapter: 'Floor 5 · The Bubbles',
    floor: 5,
    description:
      "Glitter. Fucking glitter. These flying assholes hover out of reach and blast sparkle dust right into your eyeballs until you can't hit shit. Pro tip: burn an Action wiping your face, it's worth it. And sneaky types, sorry, the glitter sticks to invisible people too. You look like a disco ball with a stab wound.",
    prevDescriptions: [
      'Tiny, sparkly, and absolutely feral. Rainbow Sprites hover out of reach, jab you with light lances, and throw glitter bombs straight into your eyeballs. Pro tip: if you get dusted, take an Action to wipe your face. Invisible folks, sorry, the glitter snitches.',
    ],
    prevNotes: [
      'Special: Flight. Full text: Core Rulebook p. 625.',
      'Flight: air counts as ground; can hover.\nDust Blast: 2+ HB slots lost → Dusted: Disadvantage on Attacks and sight-reliant Skill Checks until an Action is spent clearing eyes. Hit invisible creatures stay revealed until combat ends.\n\nFull text: Core Rulebook p. 625.',
    ],
    descriptionEs:
      'Purpurina. Puta purpurina. Estos cabrones voladores flotan fuera de tu alcance y te echan polvo brillante directo a los ojos hasta que no le das ni a la de tres. Pro-Tip: gasta una Acción en limpiarte la cara, merece la pena. Y los sigilosos, lo siento, la purpurina también se pega a los invisibles. Pareces una bola de discoteca con una puñalada.',
    prevDescriptionsEs: [
      'Purpurina. Puta purpurina. Estos cabrones voladores flotan fuera de tu alcance y te echan polvo brillante directo a los ojos hasta que no le das ni a la de tres. Consejo pro: gasta una Acción en limpiarte la cara, merece la pena. Y los sigilosos, lo siento, la purpurina también se pega a los invisibles. Pareces una bola de discoteca con una puñalada.',
    ],
  },
  {
    name: 'Ursine Edge Member',
    kind: 'npc',
    size: 'Medium (4)',
    tags: 'NPC, Beastly',
    slots: '10',
    slotValue: '5',
    level: '32',
    surprise: '14+F',
    evade: '14+F',
    move: '20+S',
    dr: '5',
    stats: {
      str: {
        score: '29',
        mod: '+5',
      },
      int: {
        score: '14',
        mod: '+4',
      },
      con: {
        score: '29',
        mod: '+5',
      },
      dex: {
        score: '15',
        mod: '+4',
      },
      cha: {
        score: '14',
        mod: '+4',
      },
    },
    attacks: [
      {
        name: 'Club',
        toHit: '15+F',
        damage: '5d8+5 Bludgeoning',
        range: '5ft range',
        effect: '',
      },
      {
        name: 'Spreading Scent',
        toHit: '14+F',
        damage: '4d6+4 Acid',
        range: '20ft Cone',
        effect: 'Major Fail+: Tagged',
      },
    ],
    notes:
      'Spreading Scent: on Evade Major Fail or worse, target gains the Tagged Debuff: another Ursine Edge Member arrives, intent on mating with (fucking) that crawler.\n\nFull text: Core Rulebook p. 625.',
    source: 'Core Rulebook p. 625',
    chapter: 'Floor 5 · The Bubbles',
    floor: 5,
    description:
      "Seven feet of fur, a club, and a musk so rank it counts as Acid damage. Blow your dodge and you get Tagged, which means another hairy bastard arrives, very eager to get to know you. Viewers, I swear this is a family show. It isn't. Pro tip: do not fumble the Evade. Your dignity depends on it.",
    prevDescriptions: [
      "Big, hairy, club-swinging, and marinated in a musk that could strip paint. Get a faceful and you're officially tagged, which means another one shows up looking for romance. Congratulations, you're popular! Pro tip: dodge the cloud. Seriously. Dodge it.",
    ],
    prevNotes: [
      'Full text: Core Rulebook p. 625.',
      'Spreading Scent: on Evade Major Fail or worse, target gains the Tagged Debuff, and a new Ursine Edge Member shows up drawn to them.\n\nFull text: Core Rulebook p. 625.',
    ],
    descriptionEs:
      'Siete pies de pelo, un garrote y un almizcle tan asqueroso que cuenta como daño de Acid. Falla la esquiva y quedas Tagged, lo que significa que llega otro cabrón peludo con muchísimas ganas de conocerte. Espectadores, os juro que este es un programa familiar. No lo es. Pro-Tip: no la cagues con la Esquiva. Tu dignidad depende de ello.',
    prevDescriptionsEs: [
      'Siete pies de pelo, un garrote y un almizcle tan asqueroso que cuenta como daño de Acid. Falla la esquiva y quedas Tagged, lo que significa que llega otro cabrón peludo con muchísimas ganas de conocerte. Espectadores, os juro que este es un programa familiar. No lo es. Consejo pro: no la cagues con la Esquiva. Tu dignidad depende de ello.',
    ],
  },
  {
    name: 'Dominic Hawthorne',
    kind: 'npc',
    size: 'Medium (4)',
    tags: 'NPC, Humanoid',
    slots: '10',
    slotValue: '5',
    level: '50',
    surprise: '15+F',
    evade: '15+F',
    move: '20+S',
    dr: '5',
    stats: {
      str: {
        score: '42',
        mod: '+5',
      },
      int: {
        score: '23',
        mod: '+5',
      },
      con: {
        score: '36',
        mod: '+5',
      },
      dex: {
        score: '24',
        mod: '+5',
      },
      cha: {
        score: '52',
        mod: '+6',
      },
    },
    attacks: [
      {
        name: 'Chain of Woe',
        toHit: '15+F',
        damage: '5d10+5 Bludgeoning',
        range: '5ft range',
        effect: '',
      },
      {
        name: 'Sorrowful Blast',
        toHit: '15+F',
        damage: '5d8+5 Sonic',
        range: '20ft Cone',
        effect: 'Special effect',
      },
    ],
    notes:
      'Former Vocalist: Rank 5 spells: Panty Dropper; Earworm; Hot Stuff Aura.\nSorrowful Blast: hit → push 10ft.\n\nFull text: Core Rulebook p. 626.',
    source: 'Core Rulebook p. 626',
    chapter: 'Floor 5 · The Bubbles',
    floor: 5,
    description:
      'Dominic Hawthorne, a washed-up frontman still living off one hit single and a spell named Panty Dropper. Yes, really. He swings a chain, wails a sonic blast that shoves you ten feet, and gets stuck in your head for days. Pro tip: bring earplugs and step out of the cone. Groupies not included.',
    prevDescriptions: [
      'Ladies and gentlebeings, a washed-up frontman with a chain and a grudge! Dominic swings iron and belts out a sonic wail that shoves you across the room. He still knows a few crowd-pleasers too. Pro tip: get out of the cone before the chorus hits.',
    ],
    prevNotes: [
      'Special: Former Vocalist. Full text: Core Rulebook p. 626.',
      'Former Vocalist: Rank 5 spells: Panty Dropper; Earworm; Hot Stuff Aura.\nSorrowful Blast: hit → push 10ft.\n\nFull text: Core Rulebook p. 626.',
    ],
    descriptionEs:
      'Dominic Hawthorne, un cantante venido a menos que sigue viviendo de un único éxito y de un hechizo llamado Panty Dropper. Sí, en serio. Blande una cadena, suelta un berrido sónico que te empuja diez pies y se te queda metido en la cabeza durante días. Pro-Tip: trae tapones y sal del cono. Groupies no incluidas.',
    prevDescriptionsEs: [
      'Dominic Hawthorne, un cantante venido a menos que sigue viviendo de un único éxito y de un hechizo llamado Panty Dropper. Sí, en serio. Blande una cadena, suelta un berrido sónico que te empuja diez pies y se te queda metido en la cabeza durante días. Consejo pro: trae tapones y sal del cono. Groupies no incluidas.',
    ],
  },
  {
    name: 'Whisper',
    kind: 'npc',
    size: 'Medium (4)',
    tags: 'NPC, Humanoid',
    slots: '10',
    slotValue: '5',
    level: '50',
    surprise: '15+F',
    evade: '15+F',
    move: '20+2',
    dr: '5',
    stats: {
      str: {
        score: '51',
        mod: '+6',
      },
      int: {
        score: '40',
        mod: '+5',
      },
      con: {
        score: '31',
        mod: '+5',
      },
      dex: {
        score: '32',
        mod: '+5',
      },
      cha: {
        score: '26',
        mod: '+5',
      },
    },
    attacks: [
      {
        name: 'Light Lance',
        toHit: '16+F',
        damage: '5d8+5 Force',
        range: '50ft range',
        effect: '',
      },
      {
        name: 'Polychrome Vortex Spell',
        toHit: '15+F',
        damage: '4d6+5 Force',
        range: '60ft range',
        effect: 'Major Fail+: Blinded',
      },
    ],
    notes:
      'Flight: moves through the air as if on the ground.\nPolychrome Vortex: hits everything in a 15ft Blast radius.\n\nFull text: Core Rulebook p. 626.',
    source: 'Core Rulebook p. 626',
    chapter: 'Floor 5 · The Bubbles',
    floor: 5,
    description:
      'Whisper does not whisper. Whisper floats overhead blasting beams of light and a vortex that blinds everyone in a fifteen-foot circle. Blast radius, idiots, that means stop huddling together like scared puppies. Pro tip: spread out, look up, and try not to walk off a ledge. Actually, walk off a ledge. We need the numbers.',
    prevDescriptions: [
      "Whisper doesn't whisper. Whisper flies overhead and shoots beams of light at you. False advertising, but the ratings don't lie. Her vortex spell paints a wide area and can leave you blind as a mole. Pro tip: spread out, look up, and maybe pray.",
    ],
    prevNotes: [
      'Special: Flight. Full text: Core Rulebook p. 626.',
      'Flight: moves through the air as if on the ground.\nPolychrome Vortex: hits everything in a 15ft Blast radius.\n\nFull text: Core Rulebook p. 626.',
    ],
    descriptionEs:
      'Whisper no susurra. Whisper flota por encima disparando rayos de luz y un vórtice que ciega a todos en un círculo de quince pies. Radio de explosión, idiotas, eso significa que dejéis de apelotonaros como cachorritos asustados. Pro-Tip: separaos, mirad hacia arriba e intentad no caeros por un saliente. Bueno, caeos por un saliente. Necesitamos cifras.',
    prevDescriptionsEs: [
      'Whisper no susurra. Whisper flota por encima disparando rayos de luz y un vórtice que ciega a todos en un círculo de quince pies. Radio de explosión, idiotas, eso significa que dejéis de apelotonaros como cachorritos asustados. Consejo pro: separaos, mirad hacia arriba e intentad no caeros por un saliente. Bueno, caeos por un saliente. Necesitamos cifras.',
    ],
  },
  {
    name: 'Ancient Cloud Dragon',
    kind: 'npc',
    size: 'Colossal (7)',
    tags: 'NPC, Dragon',
    slots: '10',
    slotValue: '6',
    level: '80',
    surprise: '16+F',
    evade: '15+F',
    move: '30+S',
    dr: '5',
    stats: {
      str: {
        score: '55',
        mod: '+6',
      },
      int: {
        score: '55',
        mod: '+6',
      },
      con: {
        score: '55',
        mod: '+6',
      },
      dex: {
        score: '25',
        mod: '+5',
      },
      cha: {
        score: '55',
        mod: '+6',
      },
    },
    attacks: [
      {
        name: 'Bite',
        toHit: '16+F',
        damage: '6d8+6 Piercing',
        range: '15ft range',
        effect: 'Swallowed',
      },
      {
        name: 'Flatulence Windstorm',
        toHit: '16+F',
        damage: '7d8+5 Sonic',
        range: '20ft Cone',
        effect: 'On hit: Queasy',
      },
    ],
    notes:
      "Flight: moves through the air as if on the ground.\nBite: a crawler who fails to Evade gains the Swallowed Debuff: can't be targeted, takes 1d10+F Acid at end of each round, and attacks with Disadvantage vs 0 DR (Slashing deals x2). All swallowed crawlers are freed when an attack on the dragon gets Amazing Success or better, or it dies.\nFlatulence Windstorm: every crawler hit is pushed 10ft and gains the Queasy Debuff.\n\nFull text: Core Rulebook p. 630.",
    source: 'Core Rulebook p. 630',
    chapter: 'Floor 5 · The Bubbles',
    floor: 5,
    description:
      "Level 80. Ancient. Colossal. Majestic as all hell. And its big breath weapon is a fart. It'll either swallow you whole to digest slowly in acid, or blow you across the room with a sonic ass-blast. Pro tip: if you're inside, slash. Double damage from within, and yes, you will be covered in dragon shit.",
    prevDescriptions: [
      "An ancient, colossal, majestic dragon whose signature move is a fart. Level 80, folks. It'll either eat you whole or gas you across the map. Pro tip: if you end up inside, bring a blade. Slashing from the inside is twice as effective and ten times as gross.",
    ],
    prevNotes: [
      'Special: Flight. Full text: Core Rulebook p. 630.',
      "Flight: moves through the air as if on the ground.\nBite: a crawler who fails to Evade gains the Swallowed Debuff: can't be targeted, takes 1d10+F Acid at end of each round, and attacks with Disadvantage vs 0 DR (Slashing deals x2). All swallowed crawlers are freed when an attack on the dragon gets Amazing Success or better, or it dies.\nFlatulence Windstorm: every crawler hit is pushed 10ft and gains the Queasy Debuff.\n\nFull text: Core Rulebook p. 630.",
    ],
    descriptionEs:
      'Nivel 80. Ancestral. Colosal. Majestuoso de cojones. Y su gran arma de aliento es un pedo. O te traga entero para digerirte lentamente en ácido, o te manda a la otra punta de la sala con un cuescazo sónico. Pro-Tip: si estás dentro, raja. Daño doble desde el interior, y sí, acabarás cubierto de mierda de dragón.',
    prevDescriptionsEs: [
      'Nivel 80. Ancestral. Colosal. Majestuoso de cojones. Y su gran arma de aliento es un pedo. O te traga entero para digerirte lentamente en ácido, o te manda a la otra punta de la sala con un cuescazo sónico. Consejo pro: si estás dentro, raja. Daño doble desde el interior, y sí, acabarás cubierto de mierda de dragón.',
    ],
  },
  {
    name: 'Doppelgänger Saboteur',
    kind: 'crawler',
    size: 'Medium (4)',
    tags: 'Humanoid',
    slots: '10',
    slotValue: '5',
    level: '41',
    surprise: '15+F',
    evade: '15+F',
    move: '20+S',
    dr: 'F',
    stats: {
      str: {
        score: '51',
        mod: '+6',
      },
      int: {
        score: '27',
        mod: '+5',
      },
      con: {
        score: '21',
        mod: '+5',
      },
      dex: {
        score: '24',
        mod: '+5',
      },
      cha: {
        score: '20',
        mod: '+5',
      },
    },
    attacks: [
      {
        name: 'Fist Mass',
        toHit: '16+F',
        damage: '5d6+6 Bludgeoning',
        range: '10ft range',
        effect: '',
      },
    ],
    notes:
      'Mass Shift: can reshape into any form of equal mass; loses 10% of its health each transformation.\nSlippery: crawlers grapple or restrain it at Disadvantage.\n\nFull text: Core Rulebook p. 631.',
    source: 'Core Rulebook p. 631',
    chapter: 'Floor 5 · The Bubbles',
    floor: 5,
    description:
      "The Doppelgänger Saboteur can be anything, anyone, anywhere, which is great news for trust issues. Every shape change costs it a slice of health, so watch it slowly whittle itself down like a dumbass. Pro tip: don't bother trying to grab it. It's slippery as a buttered eel in a bucket of snot.",
    prevDescriptions: [
      "Say hello to the Doppelganger Saboteur, the contestant who is literally whoever they need to be today. Shapeshifting costs a chunk of health, so every costume change is a gamble. Pro tip for everyone else: good luck grabbing it. It's basically a greased water balloon with fists.",
    ],
    prevNotes: [
      'Special: Mass Shift; Slippery. Full text: Core Rulebook p. 631.',
      'Mass Shift: can reshape into any form of equal mass; loses 10% of its health each transformation.\nSlippery: crawlers grapple or restrain it at Disadvantage.\n\nFull text: Core Rulebook p. 631.',
    ],
    descriptionEs:
      'El Doppelgänger Saboteur puede ser cualquier cosa, cualquiera, en cualquier sitio, lo cual es una noticia estupenda para los que tienen problemas de confianza. Cada cambio de forma le cuesta un trozo de salud, así que míralo desgastarse poco a poco como un idiota. Pro-Tip: no te molestes en intentar agarrarlo. Es más escurridizo que una anguila untada en mantequilla dentro de un cubo de mocos.',
    prevDescriptionsEs: [
      'El Doppelgänger Saboteur puede ser cualquier cosa, cualquiera, en cualquier sitio, lo cual es una noticia estupenda para los que tienen problemas de confianza. Cada cambio de forma le cuesta un trozo de salud, así que míralo desgastarse poco a poco como un idiota. Consejo pro: no te molestes en intentar agarrarlo. Es más escurridizo que una anguila untada en mantequilla dentro de un cubo de mocos.',
    ],
  },
  {
    name: 'Aurion',
    kind: 'boss',
    size: 'Colossal (7)',
    tags: 'Neighborhood Boss, Beast',
    slots: '8',
    slotValue: '6',
    level: '75',
    surprise: '16+F',
    evade: '16+F',
    move: '40+S',
    dr: '8',
    stats: {
      str: {
        score: '50',
        mod: '+6',
      },
      int: {
        score: '50',
        mod: '+6',
      },
      con: {
        score: '50',
        mod: '+6',
      },
      dex: {
        score: '50',
        mod: '+6',
      },
      cha: {
        score: '50',
        mod: '+6',
      },
    },
    attacks: [
      {
        name: 'Mind Dirge Spell',
        toHit: '16+F',
        damage: 'No damage',
        range: '20ft Burst radius',
        effect: 'On hit: Angry, Insight',
      },
      {
        name: 'Ride the Lightning Spell',
        toHit: '16+F',
        damage: '6d8+6 Electric',
        range: '200ft Line',
        effect: 'once per round',
      },
      {
        name: 'Talon',
        toHit: '16+F',
        damage: '7d10+6 Slashing',
        range: '10ft range',
        effect: 'Major Fail+: Blood Trail',
      },
    ],
    notes:
      'Flight: air counts as ground for movement.\nMind Dirge: hit → Angry: must spend ≥1 action this round attacking nearest ally; afterwards gains Insight Buff (+2 to hit Aurion, stackable).\nRide the Lightning: travels 200ft with the attack; max 1/round.\nDucky Destruction: AoE Spell damage vs the rubber-duck sea (Evade 16, 0 DR) pops 1 duck per point. Each 25 damage → Aurion −1 DR for the fight, and next round he aims ≥2 attacks at those crawlers.\n\nFull text: Core Rulebook p. 632.',
    source: 'Core Rulebook p. 632',
    chapter: 'Floor 5 · The Bubbles',
    floor: 5,
    description:
      "A colossal thunder-bird floating over a sea of rubber ducks. Yes, I'm proud of it. Aurion's dirge makes you beat the crap out of your own buddies, then he fries you from two hundred feet. Pro tip: nuke the ducks. It pisses him off and cracks his armor. Then he comes after you specifically. Worth it.",
    prevDescriptions: [
      "A colossal lightning bird floating over an ocean of rubber ducks. I don't make the rules. Oh wait, I do. Aurion scrambles your brain so you smack your friends, then fries you from 200 feet away. Pro tip: nuke the ducks. He hates that, and hate makes great television.",
    ],
    prevNotes: [
      'Special: Flight; Ducky Destruction. Full text: Core Rulebook p. 632.',
      'Flight: air counts as ground for movement.\nMind Dirge: hit → Angry: must spend ≥1 action this round attacking nearest ally; afterwards gains Insight Buff (+2 to hit Aurion, stackable).\nRide the Lightning: travels 200ft with the attack; max 1/round.\nDucky Destruction: AoE Spell damage vs the rubber-duck sea (Evade 16, 0 DR) pops 1 duck per point. Each 25 damage → Aurion −1 DR for the fight, and next round he aims ≥2 attacks at those crawlers.\n\nFull text: Core Rulebook p. 632.',
    ],
    descriptionEs:
      'Un pájaro del trueno colosal flotando sobre un mar de patitos de goma. Sí, estoy orgulloso. El canto fúnebre de Aurion hace que les des una paliza de la hostia a tus propios colegas, y luego te fríe desde doscientos pies. Pro-Tip: cárgate los patos. Le cabrea y le agrieta la armadura. Luego va a por ti en concreto. Merece la pena.',
    prevDescriptionsEs: [
      'Un pájaro del trueno colosal flotando sobre un mar de patitos de goma. Sí, estoy orgulloso. El canto fúnebre de Aurion hace que les des una paliza de la hostia a tus propios colegas, y luego te fríe desde doscientos pies. Consejo pro: cárgate los patos. Le cabrea y le agrieta la armadura. Luego va a por ti en concreto. Merece la pena.',
    ],
  },
  {
    name: 'Carl (Over City)',
    kind: 'crawler',
    size: '',
    tags: 'Primal, Compensated Anarchist',
    slots: '10',
    slotValue: '4',
    level: '13',
    surprise: '12+F',
    evade: '14+F',
    move: '20+S',
    dr: '1',
    stats: {
      str: {
        score: '16',
        mod: '+4',
      },
      int: {
        score: '5',
        mod: '+2',
      },
      con: {
        score: '19',
        mod: '+4',
      },
      dex: {
        score: '11',
        mod: '+4',
      },
      cha: {
        score: '25',
        mod: '+5',
      },
    },
    attacks: [],
    notes:
      'Key Skills: Foot Soldier 6, Iron Punch 7, Powerful Strike 9, Pugilism 10, Smush 9. Key Items: Enchanted BigBoi Boxers, Enchanted Nightgaunt Cloak of Stoutness, Enchanted Spiked Kneepads of the Shade Gnoll Riot Forces, Enchanted Toe Ring of the Splatter Skunk, Enchanted Trollskin Shirt of Pummeling, Enchanted War Gauntlet of the Exalted Grull.\n\nFull text: Core Rulebook p. 638.',
    source: 'Core Rulebook p. 638',
    chapter: 'Floor 3 · The Royal Court (Appendix 2)',
    floor: 3,
    description:
      "Early Carl: no pants, big boots, and a bag of explosives he's got no business owning. Our statisticians gave him about a week. The statisticians have since been fed to something. He fights dirty, blows shit up, and gets back up way too often. Pro tip for mobs: kill him faster. Seriously. Please.",
    prevDescriptions: [
      "Carl, early edition! No pants, big boots, and a growing collection of explosives he definitely shouldn't have. He's a primal brawler with an anarchist streak and a knack for accidental property damage. The odds say he dies soon. The odds keep being wrong. Annoying.",
    ],
    prevNotes: [
      'Key Skills: Foot Soldier 6, Iron Punch 7, Powerful Strike 9, Pugilism 10, Smush 9. Key Items: Enchanted BigBoi Boxers, Enchanted Nightgaunt Cloak of Stoutness, Enchanted Spiked Kneepads of the Shade Gnoll Riot Forces, Enchanted Toe Ring of the Splatter Skunk, Enchanted Trollskin Shirt of Pummeling, Enchanted War Gauntlet of the Exalted Grull. Full text: Core Rulebook p. 638.',
      'Key Skills: Foot Soldier 6, Iron Punch 7, Powerful Strike 9, Pugilism 10, Smush 9. Key Items: Enchanted BigBoi Boxers, Enchanted Nightgaunt Cloak of Stoutness, Enchanted Spiked Kneepads of the Shade Gnoll Riot Forces, Enchanted Toe Ring of the Splatter Skunk, Enchanted Trollskin Shirt of Pummeling, Enchanted War Gauntlet of the Exalted Grull.\n\nFull text: Core Rulebook p. 638.',
    ],
    descriptionEs:
      'El Carl de los inicios: sin pantalones, botazas y una bolsa de explosivos que no tiene ningún derecho a poseer. Nuestros estadísticos le dieron una semana. Desde entonces, a los estadísticos se los hemos echado de comer a algo. Pelea sucio, lo vuela todo por los aires y se levanta demasiadas veces. Pro-Tip para los mobs: matadlo más rápido. En serio. Por favor.',
    prevDescriptionsEs: [
      'El Carl de los inicios: sin pantalones, botazas y una bolsa de explosivos que no tiene ningún derecho a poseer. Nuestros estadísticos le dieron una semana. Desde entonces, a los estadísticos se los hemos echado de comer a algo. Pelea sucio, lo vuela todo por los aires y se levanta demasiadas veces. Consejo pro para los mobs: matadlo más rápido. En serio. Por favor.',
    ],
  },
  {
    name: 'Carl (Iron Tangle)',
    kind: 'crawler',
    size: '',
    tags: 'Primal, Compensated Anarchist',
    slots: '10',
    slotValue: '5',
    level: '27',
    surprise: '14+F',
    evade: '15+F',
    move: '20+S',
    dr: '3',
    stats: {
      str: {
        score: '43',
        mod: '+5',
      },
      int: {
        score: '15',
        mod: '+4',
      },
      con: {
        score: '34',
        mod: '+5',
      },
      dex: {
        score: '23',
        mod: '+5',
      },
      cha: {
        score: '25',
        mod: '+5',
      },
    },
    attacks: [],
    notes:
      'Key Skills: Foot Soldier 6, Iron Punch 8, Powerful Strike 9, Pugilism 10, Smush 9. Key Items: Enchanted BigBoi Boxers, Enchanted Spiked Kneepads of the Shade Gnoll Riot Forces, Enchanted Nightgaunt Cloak of Stoutness, Enchanted Toe Ring of the Splatter Skunk, Enchanted Trollskin Shirt of Pummeling, Enchanted War Gauntlet of the Exalted Grull, Ring of Constitution.\n\nFull text: Core Rulebook p. 639.',
    source: 'Core Rulebook p. 639',
    chapter: 'Floor 4 · The Royal Court (Appendix 2)',
    floor: 4,
    description:
      "Carl's back, bigger, meaner, and still allergic to trousers. The dungeon keeps throwing monsters at him and he keeps turning them into splatter art and crater fields. The fans love it. My producers are drinking heavily. Pro tip: if Carl says he has a plan, find cover. A lot of it.",
    prevDescriptions: [
      'Carl has leveled up and so has his body count. Mid-crawl Carl knows how to turn a messy fight into a messier crater. The fans adore him. Management less so. Pro tip for anyone standing near him: step back. Further. Further than that.',
    ],
    prevNotes: [
      'Key Skills: Foot Soldier 6, Iron Punch 8, Powerful Strike 9, Pugilism 10, Smush 9. Key Items: Enchanted BigBoi Boxers, Enchanted Spiked Kneepads of the Shade Gnoll Riot Forces, Enchanted Nightgaunt Cloak of Stoutness, Enchanted Toe Ring of the Splatter Skunk, Enchanted Trollskin Shirt of Pummeling, Enchanted War Gauntlet of the Exalted Grull, Ring of Constitution. Full text: Core Rulebook p. 639.',
      'Key Skills: Foot Soldier 6, Iron Punch 8, Powerful Strike 9, Pugilism 10, Smush 9. Key Items: Enchanted BigBoi Boxers, Enchanted Spiked Kneepads of the Shade Gnoll Riot Forces, Enchanted Nightgaunt Cloak of Stoutness, Enchanted Toe Ring of the Splatter Skunk, Enchanted Trollskin Shirt of Pummeling, Enchanted War Gauntlet of the Exalted Grull, Ring of Constitution.\n\nFull text: Core Rulebook p. 639.',
    ],
    descriptionEs:
      'Carl ha vuelto, más grande, más cabrón y todavía alérgico a los pantalones. La mazmorra le sigue lanzando monstruos y él los sigue convirtiendo en arte de salpicaduras y campos de cráteres. A los fans les encanta. Mis productores beben como cosacos. Pro-Tip: si Carl dice que tiene un plan, busca cobertura. Mucha.',
    prevDescriptionsEs: [
      'Carl ha vuelto, más grande, más cabrón y todavía alérgico a los pantalones. La mazmorra le sigue lanzando monstruos y él los sigue convirtiendo en arte de salpicaduras y campos de cráteres. A los fans les encanta. Mis productores beben como cosacos. Consejo pro: si Carl dice que tiene un plan, busca cobertura. Mucha.',
    ],
  },
  {
    name: 'Carl (Bubbles)',
    kind: 'crawler',
    size: '',
    tags: 'Primal, Compensated Anarchist',
    slots: '10',
    slotValue: '4',
    level: '41',
    surprise: '14+F',
    evade: '15+F',
    move: '20+S',
    dr: '3',
    stats: {
      str: {
        score: '73',
        mod: '+5',
      },
      int: {
        score: '17',
        mod: '+4',
      },
      con: {
        score: '34',
        mod: '+4',
      },
      dex: {
        score: '32',
        mod: '+4',
      },
      cha: {
        score: '25',
        mod: '+5',
      },
    },
    attacks: [],
    notes:
      'Key Skills: Cesta Punta 3, Chopper Pilot 7, Explosives Handling 11, Foot Soldier 6, Incendiary Device Handling 9, Iron Punch 8, Powerful Strike 12, Pugilism 10, Regeneration 7, Smush 9. Key Items: Carl’s Xistera, Earth Upgrade Patch, Enchanted Anarchist’s Battle Rattle, Enchanted BigBoi Boxers, Enchanted Night Wyrm’s Ring of Divine Suffering , Enchanted Spiked Kneepads of the Shade Gnoll Riot Forces, Enchanted Trollskin Shirt of Pummeling, Enchanted Toe Ring of the Splatter Skunk, Enchanted War Gauntlet of the Exalted Grull, Ring of Constitution.\n\nFull text: Core Rulebook p. 639.',
    source: 'Core Rulebook p. 639',
    chapter: 'Floor 5 · The Royal Court (Appendix 2)',
    floor: 5,
    description:
      "Level 41 Carl is a walking demolition permit with a cat for a manager. He treats boss rooms like renovation projects and floor plans like suggestions. We've tried killing this asshole in dozens of creative ways. He's still here. Stay tuned, sponsors, we'll get him eventually. Probably. Maybe.",
    prevDescriptions: [
      "Late-game Carl: a walking demolition permit with a cat for a manager. He's tough, he's inventive, and he treats every boss room like a renovation project. We've tried killing him many times. We'll keep trying. Stay tuned, sponsors!",
    ],
    prevNotes: [
      'Key Skills: Cesta Punta 3, Chopper Pilot 7, Explosives Handling 11, Foot Soldier 6, Incendiary Device Handling 9, Iron Punch 8, Powerful Strike 12, Pugilism 10, Regeneration 7, Smush 9. Key Items: Carl’s Xistera, Earth Upgrade Patch, Enchanted Anarchist’s Battle Rattle, Enchanted BigBoi Boxers, Enchanted Night Wyrm’s Ring of Divine Suffering , Enchanted Spiked Kneepads of the Shade Gnoll Riot Forces, Enchanted Trollskin Shirt of Pummeling, Enchanted Toe Ring of the Splatter Skunk, Enchanted War Gauntlet of the Exalted Grull, Ring of Constitution. Full text: Core Rulebook p. 639.',
      'Key Skills: Cesta Punta 3, Chopper Pilot 7, Explosives Handling 11, Foot Soldier 6, Incendiary Device Handling 9, Iron Punch 8, Powerful Strike 12, Pugilism 10, Regeneration 7, Smush 9. Key Items: Carl’s Xistera, Earth Upgrade Patch, Enchanted Anarchist’s Battle Rattle, Enchanted BigBoi Boxers, Enchanted Night Wyrm’s Ring of Divine Suffering , Enchanted Spiked Kneepads of the Shade Gnoll Riot Forces, Enchanted Trollskin Shirt of Pummeling, Enchanted Toe Ring of the Splatter Skunk, Enchanted War Gauntlet of the Exalted Grull, Ring of Constitution.\n\nFull text: Core Rulebook p. 639.',
    ],
    descriptionEs:
      'Carl a nivel 41 es una licencia de demolición andante con una gata de representante. Trata las salas de Jefe como proyectos de reforma y los planos de cada Piso como meras sugerencias. Hemos intentado matar a este cabrón de docenas de formas creativas. Sigue aquí. No se vayan, patrocinadores, acabaremos pillándolo. Probablemente. Quizá.',
  },
  {
    name: 'Donut (Over City)',
    kind: 'crawler',
    size: '',
    tags: 'Cat, Former Child Actor (Artist Alley Mogul)',
    slots: '10',
    slotValue: '3',
    level: '13',
    surprise: '15+F',
    evade: '15+F',
    move: '20+S',
    dr: '0',
    stats: {
      str: {
        score: '20',
        mod: '+5',
      },
      int: {
        score: '29',
        mod: '+5',
      },
      con: {
        score: '6',
        mod: '+3',
      },
      dex: {
        score: '21',
        mod: '+5',
      },
      cha: {
        score: '70',
        mod: '+6',
      },
    },
    attacks: [],
    notes:
      'Key Skills: Cockroach 2, Good First Impression 6, Light on Your Feet 8, Magic Missile 9, Slice Attack 7, Second Chance Spell 5. Key Items: Bracelet of Dexterity, Enchanted Anklet of the Fallen Oak , Enchanted Crown of the Sepsis Whore, Enchanted Fae Quadruped Crupper of the Fleet, Enchanted Fur Brush of the Ecclesiastic, Talisman of the Slate Butterfly.\n\nFull text: Core Rulebook p. 639.',
    source: 'Core Rulebook p. 639',
    chapter: 'Floor 3 · The Royal Court (Appendix 2)',
    floor: 3,
    description:
      "Princess Donut: show cat, spell-slinging diva, and budding merch empire. She's fragile as fine china and dangerous as a loaded flamethrower from range. Pro tip: keep her out of melee or she'll pop like a water balloon. And for the love of all things, don't mention her hair on a bad day.",
    prevDescriptions: [
      "Princess Donut, a pampered show cat turned spell-slinging diva, with a sideline in merch. She's small, fragile, and devastating from range. Also, she will tell you all about her ribbons. Pro tip: keep her out of melee and keep the camera on her good side.",
    ],
    prevNotes: [
      'Key Skills: Cockroach 2, Good First Impression 6, Light on Your Feet 8, Magic Missile 9, Slice Attack 7, Second Chance Spell 5. Key Items: Bracelet of Dexterity, Enchanted Anklet of the Fallen Oak , Enchanted Crown of the Sepsis Whore, Enchanted Fae Quadruped Crupper of the Fleet, Enchanted Fur Brush of the Ecclesiastic, Talisman of the Slate Butterfly. Full text: Core Rulebook p. 639.',
      'Key Skills: Cockroach 2, Good First Impression 6, Light on Your Feet 8, Magic Missile 9, Slice Attack 7, Second Chance Spell 5. Key Items: Bracelet of Dexterity, Enchanted Anklet of the Fallen Oak , Enchanted Crown of the Sepsis Whore, Enchanted Fae Quadruped Crupper of the Fleet, Enchanted Fur Brush of the Ecclesiastic, Talisman of the Slate Butterfly.\n\nFull text: Core Rulebook p. 639.',
    ],
    descriptionEs:
      'La Princesa Donut: gata de concurso, diva lanzahechizos e imperio de merchandising en ciernes. Es frágil como la porcelana fina y peligrosa como un lanzallamas cargado a distancia. Pro-Tip: mantenedla lejos del cuerpo a cuerpo o reventará como un globo de agua. Y por lo que más queráis, no le mencionéis el pelo en un mal día.',
    prevDescriptionsEs: [
      'La Princesa Donut: gata de concurso, diva lanzahechizos e imperio de merchandising en ciernes. Es frágil como la porcelana fina y peligrosa como un lanzallamas cargado a distancia. Consejo pro: mantenedla lejos del cuerpo a cuerpo o reventará como un globo de agua. Y por lo que más queráis, no le mencionéis el pelo en un mal día.',
    ],
  },
  {
    name: 'Donut (Iron Tangle)',
    kind: 'crawler',
    size: '',
    tags: 'Cat, Former Child Actor (Football Hooligan)',
    slots: '10',
    slotValue: '4',
    level: '26',
    surprise: '15+F',
    evade: '14+F',
    move: '20+S',
    dr: '0',
    stats: {
      str: {
        score: '33',
        mod: '+5',
      },
      int: {
        score: '40',
        mod: '+5',
      },
      con: {
        score: '17',
        mod: '+4',
      },
      dex: {
        score: '17',
        mod: '+4',
      },
      cha: {
        score: '94',
        mod: '+6',
      },
    },
    attacks: [],
    notes:
      'Key Skills: Clockwork Triplicate Spell 1, Cockroach 5, Magic Missile Spell 10, Puddle Jumper Spell 5, Slice Attack 7, Second Chance Spell 5. Key Items: Bracelet of Dexterity, Enchanted Anklet of the Fallen Oak, Enchanted Fae Quadruped Crupper of the Fleet, Enchanted Fur Brush of the Ecclesiastic, Enchanted Tiara of Mana Genita, Talisman of the Slate Butterfly, Prism Industries Capacitating and Focusing Goggles. Spe- cial High-Fashion Edition. “The Princess Donut”.\n\nFull text: Core Rulebook p. 639.',
    source: 'Core Rulebook p. 639',
    chapter: 'Floor 4 · The Royal Court (Appendix 2)',
    floor: 4,
    description:
      "Donut, now with the soul of a drunken football hooligan. Still a cat, still a celebrity, still convinced the entire dungeon is her personal red carpet. She'll blast you with magic, then heckle your corpse while it's still twitching. Honestly? Great TV. Keep her mad.",
    prevDescriptions: [
      "Donut, now with the heart of a football hooligan. Still a cat, still a celebrity, still thinks she's the main character, and at this point she's kind of right. She'll blast you with magic, then heckle your corpse. Truly a crowd favorite.",
    ],
    prevNotes: [
      'Key Skills: Clockwork Triplicate Spell 1, Cockroach 5, Magic Missile Spell 10, Puddle Jumper Spell 5, Slice Attack 7, Second Chance Spell 5. Key Items: Bracelet of Dexterity, Enchanted Anklet of the Fallen Oak, Enchanted Fae Quadruped Crupper of the Fleet, Enchanted Fur Brush of the Ecclesiastic, Enchanted Tiara of Mana Genita, Talisman of the Slate Butterfly, Prism Industries Capacitating and Focusing Goggles. Spe- cial High-Fashion Edition. “The Princess Donut”. Full text: Core Rulebook p. 639.',
      'Key Skills: Clockwork Triplicate Spell 1, Cockroach 5, Magic Missile Spell 10, Puddle Jumper Spell 5, Slice Attack 7, Second Chance Spell 5. Key Items: Bracelet of Dexterity, Enchanted Anklet of the Fallen Oak, Enchanted Fae Quadruped Crupper of the Fleet, Enchanted Fur Brush of the Ecclesiastic, Enchanted Tiara of Mana Genita, Talisman of the Slate Butterfly, Prism Industries Capacitating and Focusing Goggles. Spe- cial High-Fashion Edition. “The Princess Donut”.\n\nFull text: Core Rulebook p. 639.',
    ],
    descriptionEs:
      'Donut, ahora con el alma de un hooligan borracho. Sigue siendo una gata, sigue siendo una celebridad y sigue convencida de que toda la mazmorra es su alfombra roja personal. Te revienta con magia y luego se burla de tu cadáver mientras todavía da espasmos. ¿Sinceramente? Televisión de primera. Que siga cabreada.',
  },
  {
    name: 'Donut (Bubbles)',
    kind: 'crawler',
    size: '',
    tags: 'Cat, Former Child Actor (Glass Cannon)',
    slots: '10',
    slotValue: '3',
    level: '40',
    surprise: '15+F',
    evade: '14+F',
    move: '20+S',
    dr: '0',
    stats: {
      str: {
        score: '47',
        mod: '+5',
      },
      int: {
        score: '54',
        mod: '+6',
      },
      con: {
        score: '9',
        mod: '+3',
      },
      dex: {
        score: '17',
        mod: '+4',
      },
      cha: {
        score: '108',
        mod: '+7',
      },
    },
    attacks: [],
    notes:
      'Key Skills: Astral Paw Spell 1, Clockwork Triplicate Spell 3, Cockroach 5, Magic Missile Spell 11, Puddle Jumper Spell 5, Slice Attack 7, Second Chance Spell 5. Key Items: Bracelet of Dexterity, Enchanted Anklet of the Fallen Oak, Enchanted Fae Quadruped Crupper of the Fleet, Enchanted Fur Brush of the Ecclesiastic, Enchanted Tiara of Mana Genita, Talisman of the Slate Butterfly, Prism Industries Capacitating and Focusing Goggles. Special High- Fashion Edition. “The Princess Donut”.\n\nFull text: Core Rulebook p. 640.',
    source: 'Core Rulebook p. 640',
    chapter: 'Floor 5 · The Royal Court (Appendix 2)',
    floor: 5,
    description:
      'Donut at level 40 is a true glass cannon: she hits like a meteor and folds like a lawn chair in a hurricane. The whole galaxy is watching to see which happens first. Pro tip for enemies: flick her. Hard. Pro tip for her party: stand in front of the goddamn cat.',
    prevDescriptions: [
      "Donut at level 40: a glass cannon in the purest sense. She hits like a meteor and folds like a lawn chair. The whole galaxy is watching to see which happens first. Pro tip for foes: breathe on her hard. Pro tip for friends: don't let them.",
    ],
    prevNotes: [
      'Key Skills: Astral Paw Spell 1, Clockwork Triplicate Spell 3, Cockroach 5, Magic Missile Spell 11, Puddle Jumper Spell 5, Slice Attack 7, Second Chance Spell 5. Key Items: Bracelet of Dexterity, Enchanted Anklet of the Fallen Oak, Enchanted Fae Quadruped Crupper of the Fleet, Enchanted Fur Brush of the Ecclesiastic, Enchanted Tiara of Mana Genita, Talisman of the Slate Butterfly, Prism Industries Capacitating and Focusing Goggles. Special High- Fashion Edition. “The Princess Donut”. Full text: Core Rulebook p. 640.',
      'Key Skills: Astral Paw Spell 1, Clockwork Triplicate Spell 3, Cockroach 5, Magic Missile Spell 11, Puddle Jumper Spell 5, Slice Attack 7, Second Chance Spell 5. Key Items: Bracelet of Dexterity, Enchanted Anklet of the Fallen Oak, Enchanted Fae Quadruped Crupper of the Fleet, Enchanted Fur Brush of the Ecclesiastic, Enchanted Tiara of Mana Genita, Talisman of the Slate Butterfly, Prism Industries Capacitating and Focusing Goggles. Special High- Fashion Edition. “The Princess Donut”.\n\nFull text: Core Rulebook p. 640.',
    ],
    descriptionEs:
      'Donut a nivel 40 es un auténtico cañón de cristal: pega como un meteorito y se pliega como una silla de playa en un huracán. Toda la galaxia está mirando a ver qué pasa primero. Pro-Tip para los enemigos: dadle un capirotazo. Fuerte. Pro-Tip para su grupo: poneos delante de la puta gata.',
    prevDescriptionsEs: [
      'Donut a nivel 40 es un auténtico cañón de cristal: pega como un meteorito y se pliega como una silla de playa en un huracán. Toda la galaxia está mirando a ver qué pasa primero. Consejo pro para los enemigos: dadle un capirotazo. Fuerte. Consejo pro para su grupo: poneos delante de la puta gata.',
    ],
  },
  {
    name: 'Mongo (Over City)',
    kind: 'npc',
    size: '',
    tags: 'Pet, Mongoliensis',
    slots: '10',
    slotValue: '1',
    level: '1',
    surprise: '11+F',
    evade: '11+F',
    move: '20+S',
    dr: '1',
    stats: {
      str: {
        score: '2',
        mod: '+1',
      },
      int: {
        score: '1',
        mod: '+1',
      },
      con: {
        score: '2',
        mod: '+1',
      },
      dex: {
        score: '2',
        mod: '+1',
      },
      cha: {
        score: '1',
        mod: '+1',
      },
    },
    attacks: [],
    notes: 'Key Skills: Back Claw F, Bite F. Key Items: None.\n\nFull text: Core Rulebook p. 640.',
    source: 'Core Rulebook p. 640',
    chapter: 'Floor 3 · The Royal Court (Appendix 2)',
    floor: 3,
    description:
      "Look at him! Level 1 Mongo, a baby dinosaur the size of a handbag, all teeth and enthusiasm and very little bladder control. He'll nibble your ankle and shit on your boots. Enjoy the cute phase, people. Dungeon growth spurts are fast, and they are hungry.",
    prevDescriptions: [
      'A baby dinosaur! Level 1, adorable, and roughly the size of a large handbag. Mongo is mostly teeth and enthusiasm right now. Enjoy the cuteness while it lasts. Growth spurts in the dungeon are extremely rapid and extremely bitey.',
    ],
    prevNotes: [
      'Key Skills: Back Claw F, Bite F. Key Items: None. Full text: Core Rulebook p. 640.',
      'Key Skills: Back Claw F, Bite F. Key Items: None.\n\nFull text: Core Rulebook p. 640.',
    ],
    descriptionEs:
      '¡Miradlo! Mongo a nivel 1, un dinosaurio bebé del tamaño de un bolso, todo dientes y entusiasmo y muy poco control de esfínteres. Te mordisqueará el tobillo y te cagará en las botas. Disfrutad de la fase mona, gente. En la mazmorra los estirones son rápidos, y vienen con hambre.',
  },
  {
    name: 'Mongo (Bubbles)',
    kind: 'npc',
    size: '',
    tags: 'Pet, Mongoliensis',
    slots: '10',
    slotValue: '5',
    level: '26',
    surprise: '11+F',
    evade: '15+F',
    move: '25+S',
    dr: '3',
    stats: {
      str: {
        score: '25',
        mod: '+5',
      },
      int: {
        score: '1',
        mod: '+1',
      },
      con: {
        score: '36',
        mod: '+5',
      },
      dex: {
        score: '20',
        mod: '+5',
      },
      cha: {
        score: '11',
        mod: '+3',
      },
    },
    attacks: [],
    notes:
      'Key Skills: Back Claw F, Bite F. Key Items: Enchanted Fang Caps of the Expectorating, Tizheruk Enchanted Mongoliensis Saddle.\n\nFull text: Core Rulebook p. 640.',
    source: 'Core Rulebook p. 640',
    chapter: 'Floor 5 · The Royal Court (Appendix 2)',
    floor: 5,
    description:
      "Remember tiny Mongo? He's level 26 now, a pet dinosaur with the manners of a wrecking ball and an appetite to match. He loves his people and his cat and wants to eat literally everything else. Pro tip: happy chirping means he's found dinner. You are dinner.",
    prevDescriptions: [
      "Remember tiny Mongo? Forget him. This is a level 26 pet dinosaur with the manners of a wrecking ball. He loves his humans and his cat, and he hates everything else. Pro tip: if you hear happy chirping, run. That's the dinner bell.",
    ],
    prevNotes: [
      'Key Skills: Back Claw F, Bite F. Key Items: Enchanted Fang Caps of the Expectorating, Tizheruk Enchanted Mongoliensis Saddle. Full text: Core Rulebook p. 640.',
      'Key Skills: Back Claw F, Bite F. Key Items: Enchanted Fang Caps of the Expectorating, Tizheruk Enchanted Mongoliensis Saddle.\n\nFull text: Core Rulebook p. 640.',
    ],
    descriptionEs:
      '¿Os acordáis del pequeño Mongo? Ahora es nivel 26, un dinosaurio de mascota con los modales de una bola de demolición y un apetito a juego. Quiere a su gente y a su gata, y quiere comerse literalmente todo lo demás. Pro-Tip: si le oyes piar feliz, es que ha encontrado la cena. La cena eres tú.',
    prevDescriptionsEs: [
      '¿Os acordáis del pequeño Mongo? Ahora es nivel 26, un dinosaurio de mascota con los modales de una bola de demolición y un apetito a juego. Quiere a su gente y a su gata, y quiere comerse literalmente todo lo demás. Consejo pro: si le oyes piar feliz, es que ha encontrado la cena. La cena eres tú.',
    ],
  },
  {
    name: 'Katia (Over City/Iron Tangle)',
    kind: 'crawler',
    size: '',
    tags: 'Doppelganger, Monster Truck Driver',
    slots: '10',
    slotValue: '6',
    level: '9',
    surprise: '13+F',
    evade: '15+F',
    move: '20+S',
    dr: '6',
    stats: {
      str: {
        score: '11',
        mod: '+4',
      },
      int: {
        score: '8',
        mod: '+3',
      },
      con: {
        score: '51',
        mod: '+6',
      },
      dex: {
        score: '30',
        mod: '+5',
      },
      cha: {
        score: '8',
        mod: '+3',
      },
    },
    attacks: [],
    notes:
      'Key Skills: Axe 10, Driving 10, Gear Head 3, Noggin Nocker 3, Pathfinder 3. Key Items: Enchanted Leather Jerkin, Enchanted Ring of Constitution +15.\n\nFull text: Core Rulebook p. 641.',
    source: 'Core Rulebook p. 641',
    chapter: 'Floor 3 · The Royal Court (Appendix 2)',
    floor: 3,
    description:
      'Katia: a doppelganger who bulks up into a living roadblock, now licensed as a monster truck driver. Low level, big heart, bigger engine dreams. Odds of survival? Shaky as fuck. But nobody plugs a doorway quite like her, and the monsters stuck on the other side are pissed.',
    prevDescriptions: [
      'Katia: a shapeshifter who can bulk up into a living roadblock, now behind the wheel as a monster truck driver. Low level, big heart, bigger vehicle aspirations. Her odds are shaky, but nobody blocks a doorway quite like her.',
    ],
    prevNotes: [
      'Key Skills: Axe 10, Driving 10, Gear Head 3, Noggin Nocker 3, Pathfinder 3. Key Items: Enchanted Leather Jerkin, Enchanted Ring of Constitution +15. Full text: Core Rulebook p. 641.',
      'Key Skills: Axe 10, Driving 10, Gear Head 3, Noggin Nocker 3, Pathfinder 3. Key Items: Enchanted Leather Jerkin, Enchanted Ring of Constitution +15.\n\nFull text: Core Rulebook p. 641.',
    ],
    descriptionEs:
      'Katia: una doppelganger que se infla hasta convertirse en un control de carretera viviente, y ahora con licencia de conductora de monster truck. Nivel bajo, gran corazón, sueños de motor todavía más grandes. ¿Probabilidades de sobrevivir? Chungas de cojones. Pero nadie tapona una puerta como ella, y los monstruos atascados al otro lado están que trinan.',
  },
  {
    name: 'Katia (Bubbles)',
    kind: 'crawler',
    size: '',
    tags: 'Doppelganger, Monster Truck Driver',
    slots: '10',
    slotValue: '6',
    level: '41',
    surprise: '13+F',
    evade: '15+F',
    move: '20+S',
    dr: '8',
    stats: {
      str: {
        score: '51',
        mod: '+6',
      },
      int: {
        score: '8',
        mod: '+3',
      },
      con: {
        score: '51',
        mod: '+6',
      },
      dex: {
        score: '34',
        mod: '+5',
      },
      cha: {
        score: '12',
        mod: '+4',
      },
    },
    attacks: [],
    notes:
      'Key Skills: Axe 12, Catcher 5, Gear Head 6, Noggin Nocker 6, Wrasslin’ 8. Key Items: Enchanted Leather Jerkin, Enchanted Repeating Crossbow of the Scavenger Mother of Mothers, Enchanted Ring of Constitution +15, Enchanted Shade Gnoll Riot Forces Crowd Control Shield, Enchanted Wrestling Belt of the Great Gorgo, Left Fang of the Green Sultan.\n\nFull text: Core Rulebook p. 641.',
    source: 'Core Rulebook p. 641',
    chapter: 'Floor 5 · The Royal Court (Appendix 2)',
    floor: 5,
    description:
      "Katia at level 41, the doppelganger who became whatever her party needed: wall, battering ram, getaway vehicle. She's grown a spine, possibly several. Everyone who bet against her early is now eating their losses. Pro tip for mobs: go around. She's thicker than your skull.",
    prevDescriptions: [
      "Katia at level 41, a doppelganger who has learned to be whatever the party needs: wall, battering ram, or getaway ride. She's grown a spine, and possibly several extra. Viewers who bet against her early are currently very quiet.",
    ],
    prevNotes: [
      'Key Skills: Axe 12, Catcher 5, Gear Head 6, Noggin Nocker 6, Wrasslin’ 8. Key Items: Enchanted Leather Jerkin, Enchanted Repeating Crossbow of the Scavenger Mother of Mothers, Enchanted Ring of Constitution +15, Enchanted Shade Gnoll Riot Forces Crowd Control Shield, Enchanted Wrestling Belt of the Great Gorgo, Left Fang of the Green Sultan. Full text: Core Rulebook p. 641.',
      'Key Skills: Axe 12, Catcher 5, Gear Head 6, Noggin Nocker 6, Wrasslin’ 8. Key Items: Enchanted Leather Jerkin, Enchanted Repeating Crossbow of the Scavenger Mother of Mothers, Enchanted Ring of Constitution +15, Enchanted Shade Gnoll Riot Forces Crowd Control Shield, Enchanted Wrestling Belt of the Great Gorgo, Left Fang of the Green Sultan.\n\nFull text: Core Rulebook p. 641.',
    ],
    descriptionEs:
      'Katia a nivel 41, la doppelganger que se convirtió en lo que su grupo necesitara: muro, ariete, vehículo de huida. Le ha salido columna vertebral, puede que varias. Todos los que apostaron en su contra al principio se están comiendo sus pérdidas. Pro-Tip para los mobs: rodeadla. Es más dura que vuestro cráneo.',
    prevDescriptionsEs: [
      'Katia a nivel 41, la doppelganger que se convirtió en lo que su grupo necesitara: muro, ariete, vehículo de huida. Le ha salido columna vertebral, puede que varias. Todos los que apostaron en su contra al principio se están comiendo sus pérdidas. Consejo pro para los mobs: rodeadla. Es más dura que vuestro cráneo.',
    ],
  },
  {
    name: 'Brandon (Over City)',
    kind: 'crawler',
    size: '',
    tags: 'Human, Boring Ol’ Fighter',
    slots: '10',
    slotValue: '4',
    level: '10',
    surprise: '14+F',
    evade: '13+F',
    move: '20+S',
    dr: '2',
    stats: {
      str: {
        score: '39',
        mod: '+5',
      },
      int: {
        score: '10',
        mod: '+4',
      },
      con: {
        score: '19',
        mod: '+4',
      },
      dex: {
        score: '8',
        mod: '+3',
      },
      cha: {
        score: '8',
        mod: '+3',
      },
    },
    attacks: [],
    notes:
      'Key Skills: Boomerang 6, Catcher 7, Engineering 6, Lightning Maul (Warhammer) 10, Repair 4. Key Items: Enchanted Cape of the Gnomex, Lightning Maul, Power Ring of Smashing, Utility Belt of the Cheerful Contractor.\n\nFull text: Core Rulebook p. 641.',
    source: 'Core Rulebook p. 641',
    chapter: 'Floor 3 · The Royal Court (Appendix 2)',
    floor: 3,
    description:
      "Brandon chose the Boring Ol' Fighter class, and honestly, I respect the lack of imagination. Sword, armor, hit shit, repeat. No sparkle, no sponsors, no fan mail. Pro tip: boring bastards survive a surprising amount. Just don't expect him to make the highlight reel. Unless he dies stupidly.",
    prevDescriptions: [
      "Brandon picked the Boring Ol' Fighter class, and I respect the honesty. Sword, armor, hit things. No gimmicks, no sparkle, no sponsorship deals. Pro tip: boring survives surprisingly often. Just don't expect a highlight reel.",
    ],
    prevNotes: [
      'Key Skills: Boomerang 6, Catcher 7, Engineering 6, Lightning Maul (Warhammer) 10, Repair 4. Key Items: Enchanted Cape of the Gnomex, Lightning Maul, Power Ring of Smashing, Utility Belt of the Cheerful Contractor. Full text: Core Rulebook p. 641.',
      'Key Skills: Boomerang 6, Catcher 7, Engineering 6, Lightning Maul (Warhammer) 10, Repair 4. Key Items: Enchanted Cape of the Gnomex, Lightning Maul, Power Ring of Smashing, Utility Belt of the Cheerful Contractor.\n\nFull text: Core Rulebook p. 641.',
    ],
    descriptionEs:
      "Brandon eligió la clase Boring Ol' Fighter y, sinceramente, respeto esa falta de imaginación. Espada, armadura, repartir hostias, repetir. Sin brillo, sin patrocinadores, sin cartas de fans. Pro-Tip: los cabrones aburridos sobreviven a una cantidad sorprendente de cosas. Eso sí, no esperéis verlo en el resumen de mejores jugadas. Salvo que muera de forma estúpida.",
    prevDescriptionsEs: [
      "Brandon eligió la clase Boring Ol' Fighter y, sinceramente, respeto esa falta de imaginación. Espada, armadura, repartir hostias, repetir. Sin brillo, sin patrocinadores, sin cartas de fans. Consejo pro: los cabrones aburridos sobreviven a una cantidad sorprendente de cosas. Eso sí, no esperéis verlo en el resumen de mejores jugadas. Salvo que muera de forma estúpida.",
    ],
  },
  {
    name: 'Chris (Over City)',
    kind: 'crawler',
    size: '',
    tags: 'Igneous, Zulu Warrior',
    slots: '10',
    slotValue: '5',
    level: '10',
    surprise: '13+F',
    evade: '14+F',
    move: '20+S',
    dr: '5',
    stats: {
      str: {
        score: '21',
        mod: '+5',
      },
      int: {
        score: '9',
        mod: '+3',
      },
      con: {
        score: '30',
        mod: '+5',
      },
      dex: {
        score: '12',
        mod: '+4',
      },
      cha: {
        score: '1',
        mod: '+1',
      },
    },
    attacks: [],
    notes:
      'Key Skills: Attack of Opportunity 2, Dodge 2, Ambush 3, Spear 10, Shuriken 5, Geocaching 3. Key Items: Enchanted Shuriken of Bloodlust (12), Headcap of Smarting, Spear of Density, Belt of the Swole Troglodyte.\n\nFull text: Core Rulebook p. 641.',
    source: 'Core Rulebook p. 641',
    chapter: 'Floor 3 · The Royal Court (Appendix 2)',
    floor: 3,
    description:
      "Chris is a crawler made of volcanic rock with a warrior class, so hitting him feels like punching a mountain that's annoyed with you. He soaks damage like a sponge and dishes it right back. Pro tip for monsters: go chew on someone squishier. Your teeth will thank you.",
    prevDescriptions: [
      "Chris is a walking rock person with a warrior's spear arm, which makes him very hard to dent. Igneous crawlers shrug off plenty of damage and dish it right back. Pro tip for monsters: aim for somebody squishier. Everyone else does.",
    ],
    prevNotes: [
      'Key Skills: Attack of Opportunity 2, Dodge 2, Ambush 3, Spear 10, Shuriken 5, Geocaching 3. Key Items: Enchanted Shuriken of Bloodlust (12), Headcap of Smarting, Spear of Density, Belt of the Swole Troglodyte. Full text: Core Rulebook p. 641.',
      'Key Skills: Attack of Opportunity 2, Dodge 2, Ambush 3, Spear 10, Shuriken 5, Geocaching 3. Key Items: Enchanted Shuriken of Bloodlust (12), Headcap of Smarting, Spear of Density, Belt of the Swole Troglodyte.\n\nFull text: Core Rulebook p. 641.',
    ],
    descriptionEs:
      'Chris es un crawler hecho de roca volcánica con clase de guerrero, así que pegarle es como darle un puñetazo a una montaña que está harta de ti. Absorbe daño como una esponja y lo devuelve con intereses. Pro-Tip para los monstruos: id a masticar a alguien más blandito. Vuestros dientes os lo agradecerán.',
    prevDescriptionsEs: [
      'Chris es un crawler hecho de roca volcánica con clase de guerrero, así que pegarle es como darle un puñetazo a una montaña que está harta de ti. Absorbe daño como una esponja y lo devuelve con intereses. Consejo pro para los monstruos: id a masticar a alguien más blandito. Vuestros dientes os lo agradecerán.',
    ],
  },
  {
    name: 'Imani (Over City)',
    kind: 'crawler',
    size: '',
    tags: 'Obsidian Butterfly, Fire Spiritualist',
    slots: '10',
    slotValue: '3',
    level: '11',
    surprise: '14+F',
    evade: '14+F+1d4',
    move: '20+S',
    dr: '1',
    stats: {
      str: {
        score: '6',
        mod: '+3',
      },
      int: {
        score: '12',
        mod: '+4',
      },
      con: {
        score: '6',
        mod: '+3',
      },
      dex: {
        score: '12',
        mod: '+4',
      },
      cha: {
        score: '12',
        mod: '+4',
      },
    },
    attacks: [],
    notes:
      'Key Skills: Dodge 3, First Aid 6, Heal Others Spell 2, Holy Aura Spell 5, Longsword 8. Key Items: Cloak of Some Hope, Golden Ring of Strength, Longsword of the Velvet Executioner.\n\nFull text: Core Rulebook p. 642.',
    source: 'Core Rulebook p. 642',
    chapter: 'Floor 3 · The Royal Court (Appendix 2)',
    floor: 3,
    description:
      "Imani: an obsidian butterfly with razor-glass wings and a fire spiritualist's knack for torching things. She's the calm, competent one in her crew, which around here is rarer than a clean toilet. Pro tip: don't let her get organized. Organized crawlers are bad for my death quotas.",
    prevDescriptions: [
      "Imani, an obsidian butterfly with a fire spiritualist's toolkit. Gorgeous wings, glassy edges, and a habit of setting things ablaze in the name of the spirits. She's the steady one in her group, which in this dungeon is basically a superpower.",
    ],
    prevNotes: [
      'Key Skills: Dodge 3, First Aid 6, Heal Others Spell 2, Holy Aura Spell 5, Longsword 8. Key Items: Cloak of Some Hope, Golden Ring of Strength, Longsword of the Velvet Executioner. Full text: Core Rulebook p. 642.',
      'Key Skills: Dodge 3, First Aid 6, Heal Others Spell 2, Holy Aura Spell 5, Longsword 8. Key Items: Cloak of Some Hope, Golden Ring of Strength, Longsword of the Velvet Executioner.\n\nFull text: Core Rulebook p. 642.',
    ],
    descriptionEs:
      'Imani: una mariposa de obsidiana con alas de cristal afilado y el talento de una espiritualista de fuego para prenderle fuego a todo. Es la tranquila y competente de su grupo, que por aquí es más raro que un váter limpio. Pro-Tip: no dejéis que se organice. Los crawlers organizados son malísimos para mis cuotas de muertes.',
    prevDescriptionsEs: [
      'Imani: una mariposa de obsidiana con alas de cristal afilado y el talento de una espiritualista de fuego para prenderle fuego a todo. Es la tranquila y competente de su grupo, que por aquí es más raro que un váter limpio. Consejo pro: no dejéis que se organice. Los crawlers organizados son malísimos para mis cuotas de muertes.',
    ],
  },
  {
    name: 'Elle (Over City)',
    kind: 'crawler',
    size: '',
    tags: 'Frost Maiden, Blizzardmancer',
    slots: '10',
    slotValue: '2',
    level: '2',
    surprise: '14+F',
    evade: '13+F',
    move: '20+S',
    dr: '1',
    stats: {
      str: {
        score: '2',
        mod: '+1',
      },
      int: {
        score: '12',
        mod: '+4',
      },
      con: {
        score: '3',
        mod: '+2',
      },
      dex: {
        score: '9',
        mod: '+3',
      },
      cha: {
        score: '8',
        mod: '+3',
      },
    },
    attacks: [],
    notes:
      'Key Skills: Aiming 5, Dodge 3, Double Tap 2, Frost Scar Spell 10, Ice Blast Spell 7, Shield 5. Key Items: +1 DR Corset, Gold Standard Healing Potion.\n\nFull text: Core Rulebook p. 642.',
    source: 'Core Rulebook p. 642',
    chapter: 'Floor 3 · The Royal Court (Appendix 2)',
    floor: 3,
    description:
      "Level 2 Elle, a frost maiden blizzardmancer who's barely out of the tutorial. Icy spells, icier attitude, and a health bar you could pop with a sneeze. Place your bets now, folks, the odds on her ending up as a frozen smear will never be better.",
    prevDescriptions: [
      'Elle at level 2, a frost maiden blizzardmancer who is barely out of the tutorial. Chilly personality, chillier spells, not a lot of health to back it up. Place your bets now, folks, the odds will never be this good again.',
    ],
    prevNotes: [
      'Key Skills: Aiming 5, Dodge 3, Double Tap 2, Frost Scar Spell 10, Ice Blast Spell 7, Shield 5. Key Items: +1 DR Corset, Gold Standard Healing Potion. Full text: Core Rulebook p. 642.',
      'Key Skills: Aiming 5, Dodge 3, Double Tap 2, Frost Scar Spell 10, Ice Blast Spell 7, Shield 5. Key Items: +1 DR Corset, Gold Standard Healing Potion.\n\nFull text: Core Rulebook p. 642.',
    ],
    descriptionEs:
      'Elle a nivel 2, una doncella de escarcha blizzardmancer que apenas ha salido del tutorial. Hechizos helados, actitud más helada todavía y una Barra de Salud que podrías reventar con un estornudo. Haced vuestras apuestas ya, amigos, las cuotas de que acabe como una mancha congelada nunca volverán a estar tan bien.',
  },
  {
    name: 'Elle (Iron Tangle)',
    kind: 'crawler',
    size: '',
    tags: 'Frost Maiden, Blizzardmancer',
    slots: '10',
    slotValue: '3',
    level: '13',
    surprise: '15+F',
    evade: '13+F',
    move: '20+S',
    dr: '2',
    stats: {
      str: {
        score: '5',
        mod: '+2',
      },
      int: {
        score: '22',
        mod: '+5',
      },
      con: {
        score: '6',
        mod: '+3',
      },
      dex: {
        score: '13',
        mod: '+4',
      },
      cha: {
        score: '12',
        mod: '+4',
      },
    },
    attacks: [],
    notes:
      'Key Skills: Aiming 5, Dodge 5, Double Tap 2, Frost Scar Spell 10, Ice Blast Spell 10, Shield 8. Key Items: +1 DR Corset, +1 DR Ballet Slippers, Gold Standard Healing Potion.\n\nFull text: Core Rulebook p. 642.',
    source: 'Core Rulebook p. 642',
    chapter: 'Floor 4 · The Royal Court (Appendix 2)',
    floor: 4,
    description:
      "Elle has survived to level 13 and frozen a whole lot of monster assholes along the way. Her blizzards finally bite. Pro tip for mobs: she's a squishy caster, so rush her. Pro tip for Elle: park something big and rocky in front of you, and keep your ass behind it.",
    prevDescriptions: [
      "Elle has thawed out a few levels and frozen a lot of monsters. Level 13 and her blizzards now actually hurt. Pro tip: she's a caster, so rush her. Pro tip for Elle: have somebody big standing in the way. Preferably somebody made of rock.",
    ],
    prevNotes: [
      'Key Skills: Aiming 5, Dodge 5, Double Tap 2, Frost Scar Spell 10, Ice Blast Spell 10, Shield 8. Key Items: +1 DR Corset, +1 DR Ballet Slippers, Gold Standard Healing Potion. Full text: Core Rulebook p. 642.',
      'Key Skills: Aiming 5, Dodge 5, Double Tap 2, Frost Scar Spell 10, Ice Blast Spell 10, Shield 8. Key Items: +1 DR Corset, +1 DR Ballet Slippers, Gold Standard Healing Potion.\n\nFull text: Core Rulebook p. 642.',
    ],
    descriptionEs:
      'Elle ha sobrevivido hasta el nivel 13 y ha congelado a un montón de monstruos cabrones por el camino. Sus ventiscas por fin muerden. Pro-Tip para los mobs: es una lanzadora blandita, así que id a por ella. Pro-Tip para Elle: planta algo grande y rocoso delante de ti y mantén el culo detrás.',
    prevDescriptionsEs: [
      'Elle ha sobrevivido hasta el nivel 13 y ha congelado a un montón de monstruos cabrones por el camino. Sus ventiscas por fin muerden. Consejo pro para los mobs: es una lanzadora blandita, así que id a por ella. Consejo pro para Elle: planta algo grande y rocoso delante de ti y mantén el culo detrás.',
    ],
  },
  {
    name: 'Bautista (Over City)',
    kind: 'crawler',
    size: '',
    tags: 'Tigran, Swashbuckler',
    slots: '10',
    slotValue: '3',
    level: '10',
    surprise: '13+F',
    evade: '15+F',
    move: '30+S',
    dr: '4',
    stats: {
      str: {
        score: '13',
        mod: '+4',
      },
      int: {
        score: '6',
        mod: '+3',
      },
      con: {
        score: '7',
        mod: '+3',
      },
      dex: {
        score: '27',
        mod: '+5',
      },
      cha: {
        score: '4',
        mod: '+2',
      },
    },
    attacks: [],
    notes:
      'Key Skills: Ambush 6, Cat-Like Reflexes 2, Dodge 4, Rapier 10, Unarmed Combat 7. Key Items: Potion Overload Rapier, Enchanted Bandana.\n\nFull text: Core Rulebook p. 642.',
    source: 'Core Rulebook p. 642',
    chapter: 'Floor 3 · The Royal Court (Appendix 2)',
    floor: 3,
    description:
      'Bautista, a tiger-man swashbuckler with enough flair to choke a peacock. Expect flips, fancy blade work, and at least one completely unnecessary flourish per fight. Audiences love a showoff. Showoffs tend to live right up until they eat a spike in mid-backflip. Fingers crossed!',
    prevDescriptions: [
      "Bautista, a tiger-person swashbuckler with flair to spare. Expect acrobatics, blade work, and at least one unnecessary flourish per fight. The audience loves a showboat. The showboat usually survives right up until it doesn't.",
    ],
    prevNotes: [
      'Key Skills: Ambush 6, Cat-Like Reflexes 2, Dodge 4, Rapier 10, Unarmed Combat 7. Key Items: Potion Overload Rapier, Enchanted Bandana. Full text: Core Rulebook p. 642.',
      'Key Skills: Ambush 6, Cat-Like Reflexes 2, Dodge 4, Rapier 10, Unarmed Combat 7. Key Items: Potion Overload Rapier, Enchanted Bandana.\n\nFull text: Core Rulebook p. 642.',
    ],
    descriptionEs:
      'Bautista, un espadachín hombre tigre con tanto estilo que ahogaría a un pavo real. Esperad volteretas, esgrima de fantasía y al menos una floritura completamente innecesaria por combate. Al público le encantan los fantasmas. Los fantasmas suelen vivir justo hasta que se comen un pincho en mitad de un salto mortal hacia atrás. ¡Crucemos los dedos!',
  },
  {
    name: 'Florin (Over City)',
    kind: 'crawler',
    size: '',
    tags: 'Crocodilian, Shotgun Messenger',
    slots: '10',
    slotValue: '4',
    level: '10',
    surprise: '13+F',
    evade: '15+F',
    move: '20+S',
    dr: '6',
    stats: {
      str: {
        score: '16',
        mod: '+4',
      },
      int: {
        score: '6',
        mod: '+3',
      },
      con: {
        score: '12',
        mod: '+4',
      },
      dex: {
        score: '26',
        mod: '+5',
      },
      cha: {
        score: '1',
        mod: '+1',
      },
    },
    attacks: [],
    notes:
      'Key Skills: Aiming 4, Handgun 10. Shotgun 10, Pugilism 2, Powerful Strike 2, Scrapbooking 3. Key Items: Skin-Slougher 5000 Shotgun, Enchanted Waistcoat.\n\nFull text: Core Rulebook p. 642.',
    source: 'Core Rulebook p. 642',
    chapter: 'Floor 3 · The Royal Court (Appendix 2)',
    floor: 3,
    description:
      "Florin: a crocodile with a shotgun, working as a shotgun messenger. Scales, teeth, buckshot, and a face that's permanently unimpressed. His job is keeping the cargo alive, and he'll blow a hole through you to do it. Pro tip: don't stand between the lizard and whatever he's guarding.",
    prevDescriptions: [
      "Florin: a crocodile with a shotgun riding shotgun. Scales, teeth, buckshot, and the job of keeping the cargo alive. Tough, grumpy, and deeply unimpressed with everything. Pro tip: never stand between him and whoever he's protecting.",
    ],
    prevNotes: [
      'Key Skills: Aiming 4, Handgun 10. Shotgun 10, Pugilism 2, Powerful Strike 2, Scrapbooking 3. Key Items: Skin-Slougher 5000 Shotgun, Enchanted Waistcoat. Full text: Core Rulebook p. 642.',
      'Key Skills: Aiming 4, Handgun 10. Shotgun 10, Pugilism 2, Powerful Strike 2, Scrapbooking 3. Key Items: Skin-Slougher 5000 Shotgun, Enchanted Waistcoat.\n\nFull text: Core Rulebook p. 642.',
    ],
    descriptionEs:
      'Florin: un cocodrilo con escopeta que trabaja de escolta de diligencias. Escamas, dientes, perdigones y una cara de permanentemente no impresionado. Su trabajo es mantener viva la carga, y te abrirá un agujero para conseguirlo. Pro-Tip: no te pongas entre el lagarto y lo que sea que esté vigilando.',
    prevDescriptionsEs: [
      'Florin: un cocodrilo con escopeta que trabaja de escolta de diligencias. Escamas, dientes, perdigones y una cara de permanentemente no impresionado. Su trabajo es mantener viva la carga, y te abrirá un agujero para conseguirlo. Consejo pro: no te pongas entre el lagarto y lo que sea que esté vigilando.',
    ],
  },
  {
    name: 'Ifechi (Over City)',
    kind: 'crawler',
    size: '',
    tags: 'Human, Physicker',
    slots: '10',
    slotValue: '4',
    level: '10',
    surprise: '15+F',
    evade: '13+F',
    move: '20+S',
    dr: '1',
    stats: {
      str: {
        score: '5',
        mod: '+2',
      },
      int: {
        score: '27',
        mod: '+5',
      },
      con: {
        score: '15',
        mod: '+4',
      },
      dex: {
        score: '8',
        mod: '+3',
      },
      cha: {
        score: '8',
        mod: '+3',
      },
    },
    attacks: [],
    notes:
      'Key Skills: First Aid 9, Heal Others Spell 5, Herding Staff 3, Nature’s Breath Spell 3, Vine Porn Spell 10. Key Items: Enchanted Magic-User’s Staff (+10 to Mana), Gold Standard Healing Potion.\n\nFull text: Core Rulebook p. 643.',
    source: 'Core Rulebook p. 643',
    chapter: 'Floor 3 · The Royal Court (Appendix 2)',
    floor: 3,
    description:
      'Ifechi the Physicker keeps everyone else breathing, which makes her the MVP of any party and my least favorite person on this floor. Healers ruin perfectly good death scenes. Do you know what a revived crawler does to my ratings? Pro tip, monsters: stab the medic. Stab her a lot.',
    prevDescriptions: [
      'Ifechi the Physicker keeps everybody else breathing, which makes her the most important crawler in any party and my least favorite for ratings. Healers ruin perfectly good death scenes. Pro tip to monsters: target the medic. Obviously.',
    ],
    prevNotes: [
      'Key Skills: First Aid 9, Heal Others Spell 5, Herding Staff 3, Nature’s Breath Spell 3, Vine Porn Spell 10. Key Items: Enchanted Magic-User’s Staff (+10 to Mana), Gold Standard Healing Potion. Full text: Core Rulebook p. 643.',
      'Key Skills: First Aid 9, Heal Others Spell 5, Herding Staff 3, Nature’s Breath Spell 3, Vine Porn Spell 10. Key Items: Enchanted Magic-User’s Staff (+10 to Mana), Gold Standard Healing Potion.\n\nFull text: Core Rulebook p. 643.',
    ],
    descriptionEs:
      'Ifechi la Physicker mantiene a todos los demás respirando, lo que la convierte en la MVP de cualquier grupo y en mi persona menos favorita de este Piso. Los sanadores arruinan escenas de muerte perfectamente buenas. ¿Sabéis lo que le hace un crawler resucitado a mi audiencia? Pro-Tip, monstruos: apuñalad a la médica. Apuñaladla mucho.',
    prevDescriptionsEs: [
      'Ifechi la Physicker mantiene a todos los demás respirando, lo que la convierte en la MVP de cualquier grupo y en mi persona menos favorita de este Piso. Los sanadores arruinan escenas de muerte perfectamente buenas. ¿Sabéis lo que le hace un crawler resucitado a mi audiencia? Consejo pro, monstruos: apuñalad a la médica. Apuñaladla mucho.',
    ],
  },
  {
    name: 'Hekla (Over City)',
    kind: 'crawler',
    size: '',
    tags: 'Amazonian, Shield Maiden',
    slots: '10',
    slotValue: '4',
    level: '10',
    surprise: '12+F',
    evade: '14+F',
    move: '20+S',
    dr: '6',
    stats: {
      str: {
        score: '20',
        mod: '+5',
      },
      int: {
        score: '4',
        mod: '+2',
      },
      con: {
        score: '13',
        mod: '+4',
      },
      dex: {
        score: '17',
        mod: '+4',
      },
      cha: {
        score: '9',
        mod: '+3',
      },
    },
    attacks: [],
    notes:
      'Key Skills: Crossbow 8, Dagger 5, Pugilism 2, Shield Block 6, Unarmed Combat 6, Yodeling 3. Key Items: Enchanted Repeating Crossbow of the Scavenger Mother of Mothers, Friendship Bracelet of Fairykind , Glittering Breastplate of Nordic Persona.\n\nFull text: Core Rulebook p. 643.',
    source: 'Core Rulebook p. 643',
    chapter: 'Floor 3 · The Royal Court (Appendix 2)',
    floor: 3,
    description:
      "Hekla, an Amazonian shield maiden with a shield the size of a barn door and the charisma to run a guild. People follow her into hell. Literally, we have footage. Pro tip: loyalty is great until you learn what the leader's actually planning. Watch her back. Or watch her closely, anyway.",
    prevDescriptions: [
      'Hekla, an Amazonian shield maiden who leads from the front and looks great doing it. Big shield, big presence, big plans. Her guild follows her anywhere. Pro tip: trust, but verify. This dungeon rewards leaders with very interesting agendas.',
    ],
    prevNotes: [
      'Key Skills: Crossbow 8, Dagger 5, Pugilism 2, Shield Block 6, Unarmed Combat 6, Yodeling 3. Key Items: Enchanted Repeating Crossbow of the Scavenger Mother of Mothers, Friendship Bracelet of Fairykind , Glittering Breastplate of Nordic Persona. Full text: Core Rulebook p. 643.',
      'Key Skills: Crossbow 8, Dagger 5, Pugilism 2, Shield Block 6, Unarmed Combat 6, Yodeling 3. Key Items: Enchanted Repeating Crossbow of the Scavenger Mother of Mothers, Friendship Bracelet of Fairykind , Glittering Breastplate of Nordic Persona.\n\nFull text: Core Rulebook p. 643.',
    ],
    descriptionEs:
      'Hekla, una doncella escudera amazona con un escudo del tamaño de la puerta de un granero y el carisma para dirigir un gremio. La gente la sigue hasta el infierno. Literalmente, tenemos las imágenes. Pro-Tip: la lealtad es genial hasta que descubres lo que la líder está tramando de verdad. Cúbrele las espaldas. O, al menos, vigílala de cerca.',
    prevDescriptionsEs: [
      'Hekla, una doncella escudera amazona con un escudo del tamaño de la puerta de un granero y el carisma para dirigir un gremio. La gente la sigue hasta el infierno. Literalmente, tenemos las imágenes. Consejo pro: la lealtad es genial hasta que descubres lo que la líder está tramando de verdad. Cúbrele las espaldas. O, al menos, vigílala de cerca.',
    ],
  },
  {
    name: 'Miriam Dom (Over City)',
    kind: 'crawler',
    size: '',
    tags: 'Human, Shepherd',
    slots: '10',
    slotValue: '4',
    level: '10',
    surprise: '15+F',
    evade: '12+F',
    move: '20+S',
    dr: '1',
    stats: {
      str: {
        score: '8',
        mod: '+3',
      },
      int: {
        score: '26',
        mod: '+5',
      },
      con: {
        score: '14',
        mod: '+4',
      },
      dex: {
        score: '5',
        mod: '+2',
      },
      cha: {
        score: '10',
        mod: '+4',
      },
    },
    attacks: [],
    notes:
      'Key Skills: Conlanging 3, Drain Life Spell 5, Herding Staff 6, Hole Spell 2, Nature’s Breath Spell 5. Key Items: Enchanted Bonnet.\n\nFull text: Core Rulebook p. 643.',
    source: 'Core Rulebook p. 643',
    chapter: 'Floor 3 · The Royal Court (Appendix 2)',
    floor: 3,
    description:
      "Miriam Dom, a shepherd whose entire flock is one foul-mouthed, murderous goat. She's not much in a fight herself, but that bond runs deep. Pro tip: insult the goat and find out exactly how protective a shepherd gets. Spoiler: very. The goat will also shit in your boots.",
    prevDescriptions: [
      "Miriam Dom is a shepherd, and her flock is one very opinionated goat. Low damage on her own, but the herd bond is strong. Pro tip: insult her goat and you'll learn exactly how protective a shepherd can get.",
    ],
    prevNotes: [
      'Key Skills: Conlanging 3, Drain Life Spell 5, Herding Staff 6, Hole Spell 2, Nature’s Breath Spell 5. Key Items: Enchanted Bonnet. Full text: Core Rulebook p. 643.',
      'Key Skills: Conlanging 3, Drain Life Spell 5, Herding Staff 6, Hole Spell 2, Nature’s Breath Spell 5. Key Items: Enchanted Bonnet.\n\nFull text: Core Rulebook p. 643.',
    ],
    descriptionEs:
      'Miriam Dom, una pastora cuyo rebaño entero es una única cabra malhablada y asesina. Ella en combate no es gran cosa, pero ese vínculo es profundo. Pro-Tip: insulta a la cabra y descubrirás exactamente lo protectora que puede ser una pastora. Spoiler: mucho. La cabra además te cagará en las botas.',
    prevDescriptionsEs: [
      'Miriam Dom, una pastora cuyo rebaño entero es una única cabra malhablada y asesina. Ella en combate no es gran cosa, pero ese vínculo es profundo. Consejo pro: insulta a la cabra y descubrirás exactamente lo protectora que puede ser una pastora. Spoiler: mucho. La cabra además te cagará en las botas.',
    ],
  },
  {
    name: 'Prepotente (Over City)',
    kind: 'crawler',
    size: '',
    tags: 'Caprid, Forsaken Aerialist',
    slots: '10',
    slotValue: '4',
    level: '10',
    surprise: '15+F',
    evade: '13+F',
    move: '20+S',
    dr: '3',
    stats: {
      str: {
        score: '4',
        mod: '+2',
      },
      int: {
        score: '30',
        mod: '+5',
      },
      con: {
        score: '10',
        mod: '+4',
      },
      dex: {
        score: '6',
        mod: '+3',
      },
      cha: {
        score: '4',
        mod: '+2',
      },
    },
    attacks: [],
    notes:
      'Key Skills: Dirt Clod Spell 10, Drain Life Spell 5, Soul Collector Spell 3, Shield Spell 6. Key Items: Enchanted Coat Appendix 3: Achievements.\n\nFull text: Core Rulebook p. 643.',
    source: 'Core Rulebook p. 643',
    chapter: 'Floor 3 · The Royal Court (Appendix 2)',
    floor: 3,
    description:
      "Prepotente: a goat. A forsaken aerialist goat. A screaming, flipping, deeply rude goat who treats gravity like an ex he's pissed at. He's already my favorite and he knows it, the little bastard. Pro tip: never turn your back on him. He's already in the air.",
    prevDescriptions: [
      "Prepotente: a goat. A forsaken aerialist goat. A screaming, flipping, spectacularly rude goat who treats gravity as a suggestion. Frankly he's my favorite. Pro tip: never turn your back on him. He's already airborne.",
    ],
    prevNotes: [
      'Key Skills: Dirt Clod Spell 10, Drain Life Spell 5, Soul Collector Spell 3, Shield Spell 6. Key Items: Enchanted Coat Appendix 3: Achievements. Full text: Core Rulebook p. 643.',
      'Key Skills: Dirt Clod Spell 10, Drain Life Spell 5, Soul Collector Spell 3, Shield Spell 6. Key Items: Enchanted Coat Appendix 3: Achievements.\n\nFull text: Core Rulebook p. 643.',
    ],
    descriptionEs:
      'Prepotente: una cabra. Una cabra acróbata aérea maldita. Una cabra que chilla, da volteretas y es profundamente maleducada, que trata a la gravedad como a una ex con la que sigue cabreado. Ya es mi favorito y lo sabe, el muy cabroncete. Pro-Tip: nunca le des la espalda. Ya está en el aire.',
    prevDescriptionsEs: [
      'Prepotente: una cabra. Una cabra acróbata aérea maldita. Una cabra que chilla, da volteretas y es profundamente maleducada, que trata a la gravedad como a una ex con la que sigue cabreado. Ya es mi favorito y lo sabe, el muy cabroncete. Consejo pro: nunca le des la espalda. Ya está en el aire.',
    ],
  },
];
