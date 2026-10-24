# Formato de importación (dcc-crawler-sheets)

Estructura de datos para cargar contenido de una sesión en la app de un golpe, desde la pestaña **Importador** del GM. Sirve para logros, misiones, fichas de enemigos y PNJ, fichas del libro y botín para el alijo del GM.

- **Formato:** `dcc-crawler-sheets/import`, **versión 1**.
- **Qué se puede subir:**
  - un archivo `.json`;
  - un archivo `.html` con el JSON dentro (ver [HTML con datos](#html-con-datos));
  - o el JSON pegado a mano.
- **Vista previa:** antes de importar, la app enseña qué se va a añadir y qué ya existe. No se escribe nada hasta pulsar «Importar».
- **Repetir es seguro:** lo que ya exista con el mismo título o nombre se salta, así que el mismo archivo se puede subir dos veces sin duplicar nada.
- **Idioma:** la partida es en castellano. Todo lo que leen los jugadores va en castellano, con registro gamberro y de comunidad gamer. Los nombres de objetos del libro van en inglés y exactos, porque la app los reconoce y rellena su descripción.

## Estructura general

```json
{
  "format": "dcc-crawler-sheets/import",
  "version": 1,
  "title": "Sesión 4 · La Caldera Madre · Piso 1",
  "achievements": [],
  "quests": [],
  "npcs": [],
  "bookNpcs": [],
  "stash": []
}
```

| Campo          | Tipo                                      | Obligatorio | Qué es                                                                                                                                                 |
| -------------- | ----------------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `format`       | texto                                     | recomendado | Siempre `"dcc-crawler-sheets/import"`.                                                                                                                 |
| `version`      | número                                    | recomendado | `1`.                                                                                                                                                   |
| `title`        | texto                                     | no          | Nombre de la sesión; sale en el resumen de la importación.                                                                                             |
| `achievements` | lista de [Logro](#logro)                  | no          | Hasta 100. No se dan a nadie al importar: el GM los da durante la partida.                                                                             |
| `quests`       | lista de [Misión](#misión)                | no          | Hasta 30.                                                                                                                                              |
| `npcs`         | lista de [Ficha](#ficha-de-enemigo-o-pnj) | no          | Fichas propias (jefes, PNJ con nombre). Hasta 50.                                                                                                      |
| `bookNpcs`     | lista de textos                           | no          | Nombres exactos (en inglés) de fichas del libro que se usan en la sesión, p. ej. `"Goblin"`, `"Goblin Shamanka"`. Si ya están en la app, no pasa nada. |
| `stash`        | lista de [Objeto](#objeto)                | no          | Botín que el GM reparte a mano (lo que se coge de un cadáver, del suelo…). Va al alijo del Generador de botín.                                         |

Tiene que haber al menos una lista con algo.

## Logro

```json
{
  "title": "Manitas",
  "description": "Has arreglado una caldera en mitad de una pelea a muerte. Los fontaneros de tu planeta cobraban 80 pavos por menos.",
  "gmNote": "Sesión 4 · Escena 2 · Quién: quien meta el fusible · Condición: instala el fusible en modo Regular",
  "reward": {
    "boxes": [{ "label": "Manitas", "kind": "adventurer", "tier": "silver", "items": [] }],
    "note": "",
    "skills": []
  }
}
```

| Campo         | Tipo                      | Obligatorio | Qué es                                                                                                                    |
| ------------- | ------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------- |
| `title`       | texto (≤120)              | **sí**      | Nombre del logro. Si ya existe uno con ese título, se salta.                                                              |
| `description` | texto (≤3000)             | no          | Lo que dice la IA del Sistema. Es lo que leen los jugadores, sin comillas «» (la app ya lo presenta como texto de la IA). |
| `gmNote`      | texto (≤1000)             | no          | Solo lo ve el GM: escena, quién lo recibe y la condición.                                                                 |
| `reward`      | [Recompensa](#recompensa) | no          | Sin recompensa: omitir o `{}`.                                                                                            |

## Recompensa

Se usa en logros y misiones.

| Campo     | Tipo                         | Qué es                                                                                                                                                           |
| --------- | ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `boxes`   | lista de [Caja](#caja) (≤10) | Cajas de botín. Al reclamar el logro (o al completar la misión) van selladas a la pestaña **Cajas** del crawler y solo se abren en una Sala Segura.              |
| `aiFavor` | número (0–20)                | Favor de la IA que da. Se suma solo a la casilla de Favor de la IA al reclamar el logro (o al completar la misión).                                              |
| `note`    | texto (≤1000)                | Recompensa escrita: «una estrella sobre la cabeza», «la caja se abre en el piso 2»… (Un «+1 Favor de la IA» escrito aquí también se suma, pero mejor `aiFavor`.) |
| `skills`  | lista de textos (≤5)         | Hechizos o habilidades de combate que enseña, por su nombre exacto. Se añaden a la ficha (si ya los tiene, suben un nivel).                                      |
| `levels`  | número (0–20)                | **Solo en misiones:** niveles que da al completarse, en el momento.                                                                                              |

## Caja

```json
{ "label": "Fogonera", "kind": "boss", "tier": "bronze", "gold": 0, "items": [] }
```

| Campo   | Tipo                             | Valores                                                                                                                                                                                                                            | Qué es                                                                         |
| ------- | -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `label` | texto (≤60)                      |                                                                                                                                                                                                                                    | Nombre propio de la caja; se muestra como «Fogonera» (Caja de Jefe de Bronce). |
| `kind`  | texto                            | `adventurer` (Aventurero), `boss` (Jefe), `crafter` (Artesano), `assassin` (Asesino), `fan` (Fan), `benefactor` (Benefactor), `achievement` (Logro), `explosives` (Explosivos), `food` (Comida), `jerk` (Cabrón), `custom` (Botín) | Categoría.                                                                     |
| `tier`  | texto                            | `bronze`, `silver`, `gold`, `platinum`, `legendary`, `celestial`                                                                                                                                                                   | Nivel de la caja.                                                              |
| `gold`  | número                           |                                                                                                                                                                                                                                    | Oro de la caja; va al monedero al abrirla. **En el piso 1 no hay oro: 0.**     |
| `items` | lista de [Objeto](#objeto) (≤40) |                                                                                                                                                                                                                                    | Contenido.                                                                     |

**Un objeto al azar entre varios** («1 objeto al azar (1d4): …»): se ponen todos los candidatos con el mismo `oneOf` (p. ej. `"d4"`). Al abrir la caja sale solo uno, elegido al azar. Dentro de una misma caja se pueden usar varios grupos con nombres distintos.

## Objeto

```json
{
  "item": "Anillo del Fogonero",
  "qty": "1",
  "type": "accessory",
  "fits": "finger",
  "rarity": "bronze",
  "bonus": { "con": "1" },
  "notes": "",
  "oneOf": "d4"
}
```

| Campo                    | Tipo          | Valores                                                                                                                                                                                                          | Qué es                                                                                                                                                                                                                                                                                                                                             |
| ------------------------ | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `item`                   | texto (≤120)  |                                                                                                                                                                                                                  | **Obligatorio.** Nombre. Los objetos del libro van con su nombre exacto en inglés (`"Good Healing Potion"`, `"Potion of +1 Skill"`, `"Scroll of Upgrade"`, `"Mana Potion"`, `"Poison Antidote"`, `"Good Goblin Dynamite"`, `"Jug O' Boom"`, `"Hob-Lobber"`, `"Crawler Biscuits"`, `"Torch"`…) y sin más campos: la app rellena descripción y tipo. |
| `qty`                    | texto         | `"1"`, `"3"`…                                                                                                                                                                                                    | Cantidad (por defecto 1).                                                                                                                                                                                                                                                                                                                          |
| `type`                   | texto         | `equipment` (equipo), `accessory` (accesorio), `consumable` (consumible), `ammunition` (munición), `special` (especial, de misión), `crafting` (material), `corpse` (cadáver), `other` (otros)                   | Categoría.                                                                                                                                                                                                                                                                                                                                         |
| `fits`                   | texto         | equipo: `head`, `shoulders`, `chest`, `bracers`, `hands`, `back`, `waist`, `pants`, `feet`, `held` (en la mano: armas y escudos) · accesorio: las mismas partes del cuerpo (salvo `held`), más `neck` y `finger` | Dónde se lleva.                                                                                                                                                                                                                                                                                                                                    |
| `rarity`                 | texto         | `common`, `bronze`, `silver`, `gold`, `platinum`, `legendary`, `celestial`, `unique`                                                                                                                             | Rareza.                                                                                                                                                                                                                                                                                                                                            |
| `bonus`                  | objeto        | claves `damage`, `dr`, `evade`, `str`, `int`, `con`, `dex`, `cha`; valores como texto (`"1"`, `"-1"`)                                                                                                            | Bonificaciones que la app suma al llevarlo equipado. Bonos a habilidades («+1 a Intimidate») van en `notes`.                                                                                                                                                                                                                                       |
| `notes`                  | texto (≤2000) |                                                                                                                                                                                                                  | Descripción o efecto. «Cura N casillas» hace que «Usar» cure de verdad.                                                                                                                                                                                                                                                                            |
| `twoHanded`              | sí/no         |                                                                                                                                                                                                                  | Arma a dos manos.                                                                                                                                                                                                                                                                                                                                  |
| `ranged` / `ammo`        | sí/no / texto |                                                                                                                                                                                                                  | Arma a distancia y el tipo de munición que usa.                                                                                                                                                                                                                                                                                                    |
| `skill`                  | texto         |                                                                                                                                                                                                                  | Habilidad de arma con la que cuenta (p. ej. `"Warhammer"`).                                                                                                                                                                                                                                                                                        |
| `charges` / `maxCharges` | texto         |                                                                                                                                                                                                                  | Cargas.                                                                                                                                                                                                                                                                                                                                            |
| `ability`                | texto (≤500)  |                                                                                                                                                                                                                  | Habilidad que se usa desde el acceso rápido (objetos que no se gastan).                                                                                                                                                                                                                                                                            |
| `unique`                 | sí/no         |                                                                                                                                                                                                                  | Único (no se apila).                                                                                                                                                                                                                                                                                                                               |
| `special`                | sí/no         |                                                                                                                                                                                                                  | Se destaca al abrir la caja.                                                                                                                                                                                                                                                                                                                       |
| `oneOf`                  | texto (≤20)   |                                                                                                                                                                                                                  | Grupo al azar (ver [Caja](#caja)).                                                                                                                                                                                                                                                                                                                 |

**Libros de hechizos:** un objeto llamado `"Libro de Hechizos: <hechizo>"` (`type` `special`) se puede leer desde el inventario para aprender el hechizo. Un libro «a elegir» se llama `"Libro de Hechizos (a elegir)"`; el GM le pone el nombre del hechizo cuando el jugador elija.

**Atributo a elegir** («+2 a un atributo a elegir»): no lleva `bonus`. Se explica en `notes` y el GM lo apunta cuando el jugador elija.

## Misión

```json
{
  "title": "Presión de trabajo",
  "description": "La Caldera Madre del Barrio de las Calderas está al límite…\n\nMisión de barrio · Barrio de las Calderas.",
  "giver": "",
  "floor": 1,
  "status": "active",
  "assign": "party",
  "objectives": [
    { "id": "e1", "text": "Averiguar adónde va la presión", "done": true },
    { "id": "e3", "text": "Matar a La Fogonera", "done": false }
  ],
  "reward": { "levels": 1, "note": "Desbloquea la escalera al piso 2.", "boxes": [] },
  "penalty": "La Caldera Madre revienta: 4d6 de fuego a quien esté dentro."
}
```

| Campo         | Tipo                                | Qué es                                                                                                                |
| ------------- | ----------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `title`       | texto (≤120)                        | **Obligatorio.** Si ya existe una misión con ese título, se salta.                                                    |
| `description` | texto (≤4000)                       | Lo que dice la IA, más el tipo de misión si hace falta.                                                               |
| `giver`       | texto                               | Quién la da. Vacío = «la IA del Sistema» (lo normal: las misiones las asigna la IA y no se pueden rechazar).          |
| `floor`       | número (0–18)                       | Piso.                                                                                                                 |
| `status`      | texto                               | `active` (en curso), `completed` (completada: da la recompensa al momento), `failed` (fallida). Normalmente `active`. |
| `hidden`      | sí/no                               | Oculta a los jugadores hasta que el GM la muestre.                                                                    |
| `assign`      | texto                               | `"party"`: se asigna al importar a todos los crawlers del grupo activo. Sin él, el GM la asigna a mano.               |
| `objectives`  | lista (≤30) de `{ id, text, done }` | Etapas u objetivos. `done: true` para las ya cumplidas.                                                               |
| `reward`      | [Recompensa](#recompensa)           | Con `levels` para los niveles de misión.                                                                              |
| `penalty`     | texto (≤2000)                       | Qué pasa si se falla. Lo ven los jugadores y se anuncia al fallarla.                                                  |

## Ficha de enemigo o PNJ

El mismo formato que las fichas de Mob del libro. Si ya hay una ficha con ese nombre, se salta. Se importan bloqueadas.

```json
{
  "name": "La Fogonera, Matriarca del Clan Caldera",
  "nameEs": "La Fogonera, Matriarca del Clan Caldera",
  "kind": "boss",
  "size": "Grande (5)",
  "tags": "Jefa de Barrio, Humanoide",
  "floor": 1,
  "chapter": "Piso 1 · Barrio de las Calderas · Sesión 4",
  "level": "6",
  "slots": "10",
  "slotValue": "4",
  "surprise": "12+F",
  "evade": "12+F",
  "move": "20+S",
  "dr": "2",
  "stats": {
    "str": { "score": "12", "mod": "+4" },
    "int": { "score": "6", "mod": "+3" },
    "con": { "score": "10", "mod": "+4" },
    "dex": { "score": "4", "mod": "+2" },
    "cha": { "score": "7", "mod": "+3" }
  },
  "attacks": [
    {
      "name": "Cucharón al rojo",
      "toHit": "13+F",
      "damage": "2d6+4 Fuego",
      "range": "10 ft",
      "effect": "Fallo grave o peor en la Esquiva: Burned."
    },
    {
      "name": "Escupitajo de vapor",
      "toHit": "12+F",
      "damage": "1d8+3 Fuego",
      "range": "Cono de 15 ft",
      "effect": "Ataque de área."
    }
  ],
  "notes": "Mecánicas del combate, fases, recompensas… (una por línea)",
  "descriptionEs": "Lo que dice la IA del Sistema de este Mob.",
  "description": ""
}
```

| Campo                                                                                                  | Qué es                                                                                                                                                                                                                                                                        |
| ------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`                                                                                                 | **Obligatorio.**                                                                                                                                                                                                                                                              |
| `nameEs`                                                                                               | Nombre en castellano (puede ser igual).                                                                                                                                                                                                                                       |
| `kind`                                                                                                 | `mob`, `elite`, `boss` (jefe), `npc` (PNJ no combatiente), `crawler`.                                                                                                                                                                                                         |
| `size`                                                                                                 | Tamaño con su número, p. ej. `"Pequeño (3)"`, `"Mediano (4)"`, `"Grande (5)"`.                                                                                                                                                                                                |
| `tags`                                                                                                 | Tipo y etiquetas.                                                                                                                                                                                                                                                             |
| `floor` / `chapter`                                                                                    | Piso (número) y de dónde sale (texto libre).                                                                                                                                                                                                                                  |
| `level`, `slots` (casillas de vida), `slotValue` (valor de casilla), `surprise`, `evade`, `move`, `dr` | Como en el libro, en texto. `+F` suma el número de piso y `+S` el bono de tamaño.                                                                                                                                                                                             |
| `stats`                                                                                                | `str`, `int`, `con`, `dex`, `cha`, cada uno `{ "score": "12", "mod": "+4" }`.                                                                                                                                                                                                 |
| `attacks`                                                                                              | `{ name, toHit, damage, range, effect }`. `toHit` como `"13+F"`; `damage` como `"2d6+4 Fuego"` o `"2d6+F Fuego"`. Los ataques de área se detectan solos si `range` o `effect` dicen cono, explosión, área, línea, radio o salpicadura. Sin tirada: `toHit` y `damage` vacíos. |
| `notes`                                                                                                | Notas del GM (mecánicas, fases, recompensas).                                                                                                                                                                                                                                 |
| `descriptionEs` / `description`                                                                        | Lo que dice la IA del Sistema (castellano / inglés).                                                                                                                                                                                                                          |

Los PNJ no combatientes solo necesitan `name`, `kind: "npc"`, `tags` y `descriptionEs`.

## HTML con datos

Si la preparación de la sesión es un HTML (para leerla en la mesa), se le puede meter el JSON dentro y subir el propio HTML al Importador:

```html
<script type="application/json" id="dcc-import">
  { "format": "dcc-crawler-sheets/import", "version": 1, "title": "…", "achievements": [ … ] }
</script>
```

El navegador no muestra ese bloque, así que el HTML se ve igual. El Importador busca primero `id="dcc-import"` y, si no lo hay, cualquier `<script type="application/json">` con `"format": "dcc-crawler-sheets/import"`.

## Cómo pasar la preparación al formato

| En la preparación                                                   | En el JSON                                                                                                |
| ------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Logro: nombre \| quién \| condición \| texto de la IA \| recompensa | `title` · `gmNote` («Escena · Quién · Condición») · `description` · `reward`                              |
| «Caja X (Aventurero, Plata)»                                        | caja con `label: "X"`, `kind: "adventurer"`, `tier: "silver"`, y su contenido sacado de la lista de cajas |
| «+1 Favor de la IA»                                                 | `reward.aiFavor: 1`                                                                                       |
| «estrella sobre la cabeza», otras recompensas escritas              | `reward.note`                                                                                             |
| «Recompensa: ninguna»                                               | sin `reward`                                                                                              |
| «1 objeto al azar (1d4): A · B · C · D»                             | los cuatro objetos con `"oneOf": "d4"`                                                                    |
| «+1 Constitución», «+1 RD»                                          | `bonus: { "con": "1" }`, `bonus: { "dr": "1" }`                                                           |
| «+1 Intimidate», efectos raros                                      | `notes`                                                                                                   |
| Botín del cadáver («no es caja, se coge directamente»)              | `stash`                                                                                                   |
| Mobs del libro («stat block del libro: GM Campaign Toolkit p. 136») | su nombre en inglés en `bookNpcs`                                                                         |
| Jefe o PNJ propio                                                   | `npcs`                                                                                                    |
| Misión ya asignada en otra sesión                                   | `quests` con `assign: "party"` y las etapas cumplidas con `done: true`                                    |

**Reglas de la mesa que afectan al formato:**

- Las cajas solo se abren en una Sala Segura (la app ya lo hace).
- Los niveles de misión se dan en el momento (`reward.levels`).
- El Favor de la IA de logros y misiones se suma solo al reclamar o completar (`reward.aiFavor`).
- Los jugadores solo ven las etapas de misión ya cumplidas y la actual; las siguientes se desvelan cuando el GM marca la anterior.
- En el piso 1 no hay oro (`gold: 0`).
- Las misiones las asigna la IA y no se pueden rechazar.
