# Crawler Sheets

Interactive, mobile-friendly character sheets for a **Dungeon Crawler Carl RPG** campaign. It covers all 6 pages of the official fillable sheet.

- Players can register themselves and see only their own crawlers
- Sheets save automatically. **Lock** freezes the character build (name, race, stats, skills, gear, DR…) while health, damage, rests, mana, Cast Heal, Evade buffs, buffs, debuffs and skill advancement marks stay usable at the table (the server enforces this; see `shared/lockRules.js`). **Unlock** allows editing everything again
- Admins see every sheet, grouped by player, can edit or unlock anything, reassign owners, and manage players
- English and Spanish UI: switch with the EN/ES toggle. The choice is saved per browser, and the default follows the browser language
- Rules automation (Tutorial Floors): Stat Mods (Table 9), Max Mana, Evade, Health Bar slots = Con Mod with a damage calculator (DR → resistance → slots), Heal, rests, Table 8 debuffs with penalties, skill roll totals, and Skill Advancement rolls. Calculated values can be overridden with ✎, and ↺ switches them back to automatic
- Skills grouped into Combat (by weapon family), Utility (Opposed / Unopposed / Passive) and Spell (Attack / Passive) sections. Book skills are sorted automatically by name. Attack Skills and Spells are expandable cards with the book's entry fields (attack type, mana cost, range, duration, AI Favor, limitations, cooldown, description, effect(s), base damage, notes & upgrades), and spells have a Cast button that spends their Mana
- Pinned attacks: pin combat skills and attack spells in the Skills tab and they appear read-only in the Core tab's Attacks list, with to-hit totals, damage showing current Stat Mods, and a Cast button for spells
- New-crawler wizard following the Core Rulebook: basics (random crawler number, human or animal with size), background tables (pick or roll, choose 2 of 3 skills, no duplicates), main attack (weapon with an optional custom name such as "Tire Iron (Club)", starter spell, or hand-to-hand), stats (standard array or roll), starting gear kits, and a review. "Skip: blank sheet" is still available
- "Fill from book": skill cards and inventory rows fill empty fields from the Core Rulebook (weapons, spells, utility skills, items)
- Spoiler-safe book catalog: spells and items live only on the server. Players can look up an entry by its exact name (the one on their sheet), but only admins can list or autocomplete the whole catalog
- Party panel (left, collapsible): the GM marks which crawlers are in the party (party button on the sheet or on the crawler cards) and everyone sees their Health Bar, Dying state and debuffs live. Mana is shown only to the owner and the GM
- Log & chat panel (right, collapsible): shared, live dice log and chat. Click any roll total on a sheet (skill checks, to-hit, damage) or use `/roll 2d6+3 # label` (also `2d20kh1`, `2d20kl1`). Rolls happen on the server. Speak as one of your crawlers; "To GM only" / "Hidden" keeps a message between you and the GM. The GM can clear the log
- Combat tracker (in the party panel): the GM starts combat (optionally with a surprise round), and everyone sees the round counter, the 5 phases of a combat round with a short reminder of each (Clean Up lists Dying countdowns and debuffs), the crawlers and the opponents. Opponents come from NPC stat blocks or quick entries; players see names and Health %, the GM applies damage (DR and slot values handled), hides/reveals and removes them. Opponent names link to their stat block
- Mob Action Declaration: each opponent has a button per attack; the GM picks the target crawler(s) and the attack is declared with its Evade difficulty (to-hit with F = Floor). Declarations stay secret during phase 1; on Crawler Reaction they're posted to the log ("Bad Llama 2" will use Lava Spit on "Alvaro" – Evade difficulty 15) and shown on the targeted crawlers' party cards with an Evade roll button (pass/fail). The GM then rolls the attack's damage and applies it to the crawler's Health Bar in one click (their DR first); declarations clear at the next round
- Area Attacks: attacks with Cone/Blast/Burst/Line/Splash in their text are marked as Area Attacks (the GM can change it when declaring, and pick who is in the Splash zone). A successful Evade halves an Area Attack's damage instead of avoiding it; the Splash zone halves it again (¼ when Evaded). "Apply" uses the right share, rounded down, before the crawler's DR
- Crawler Actions: each party card shows the crawler's 2 Actions for the round. Evading uses 1 (one Evade covers every attack on them that round); the owner or GM marks other Interrupts and step-4 Actions, so it's clear who has 1 or 2 left. AI Favor (the sheet's AI Favor box, spendable on locked sheets) rerolls a failed Evade once (not on a Natural 1) or buys a 3rd non-Attack Action once per round; both are logged
- Crawler attacks (step 4 or the surprise round): with a target picked above the Core tab's Attacks, a pinned attack's to-hit button attacks that opponent. The server rolls it against the Mob's Evade (hidden from players; a Natural 1 always misses), uses 1 of their Actions (at most 2 Attacks a round) and logs Hit/Miss. On a hit the player rolls damage from the same bar, and the GM applies it to the opponent's Health Bar with one click on its row (DR and slot value handled). Opponents without an Evade on file let the GM call Hit or Miss
- Each copy of a Mob declares on its own: attacks come from its stat block as it is now, a lone "Goblin" becomes "Goblin 1" when a second one joins, and the stat block page lists its copies in the fight with their attack buttons and what each already declared
- Combat page (/combat): the fight full size, with the round and the 5 phases as a full-width stepper on top (current phase's reminder underneath), the party on one side (Health, mana, Actions, Evade, AI Favor, declared attacks) and the opponents on the other; the GM's declared attacks sit above the party, and the GM also sees each opponent's attacks, rules notes and System AI text. The log and chat stay in the right panel
- GM "View as a player…" (user menu): see the app exactly as a chosen player (or as yourself without GM rights), read-only, with a banner to go back to the GM view
- World Stats page (/world): the Floor the party is on, crawlers still alive in the World Dungeon, the in-game time to Level Collapse (with a bar) and the Floor's ambience in English and Spanish. The GM changes the Floor (restarting the countdown: 5/6/8/10/15 days for Floors 1–5, updating the fight and, optionally, every party sheet's Floor for +F), adjusts the timer and the crawler count, and can rewrite the Floor's name and ambience. The combat tracker takes its Floor from here
- NPC stat blocks: Stat blocks are locked by default (unlock to edit); locked ones show the System AI text (Spanish when the app is in Spanish), each attack with its Evade difficulty and a damage roll button, and the notes.
- NPCs & Mobs (GM only): stat blocks in the Core Rulebook's Mob format (type, size, Health Bar slots, Level, Surprise, Evade, Move, DR, stats, attacks, notes) that can be dropped into combat ("Bad Llama 1", "Bad Llama 2"…). Stat blocks are locked by default (unlock to edit); "Add book stat blocks" imports 322 stat blocks: the Game Master's Campaign Toolkit's First and Second Floor Mobs, Bosses and rival crawlers (87), Par for the Course's Second Floor encounter (3) and its 12 pre-generated crawlers, and the Core Rulebook's 221 (Floors 3–5 and the Royal Court appendix). Numbers and attacks, the special rules rewritten in our own words (with the page for the book's full text), and an original "System AI says" description for every entry (`server/catalog/npcs.js`). Re-running the import fills these into stat blocks imported earlier, without touching notes you wrote yourself
- Levels & progression (GM only): +1 Level for 2 hours of play, quests, Boss kills by tier, crawler kills (1d6 ± Level difference) and grinding hours, with Stat points to assign (an "Assign Stat points" helper on unlocked sheets raises Enhanced and Unenhanced, previews the new Mods and logs it) and a Level history; Skill Advancement rolls happen on the server; a party-wide "2 hours passed" button levels everyone and rolls their 2-hour advancement. Works on locked sheets, and open sheets refresh automatically
- Log tab: HP and mana changes with their source (damage source, Heal spell, potions, rests…), level-ups, advancement results, combat rounds and opponent damage. HP of party members is public, mana and non-party changes are only visible to the owner and the GM
- Portraits as avatars on party cards and the combat page (served only to the owner, the GM and party members); a Stat Check button per stat (d20 + Mod, debuff penalties included)
- AI Favor reroll on any d20 Check, attack or Evade: the "Reroll" button on your own roll in the log (within 15 minutes, once, never on a Natural 1) spends the AI Favor, strikes through the old roll and posts the new one
- GM undo: remove one declaration or all of an attacker's declarations, and undo a crawler attack (the Action is given back)
- Structured inventory: every item has a quantity, category, rarity, description, upgrades and bonuses (Damage, DR, Evade, Stats). Categories: Equipment, Accessory, Consumable, Ammunition, Special, Crafting, Corpse and Other; the item details show the fields each one uses (where it's worn, two-handed, ranged weapon and its Ammunition type, charges, ability…). Sort by your own order (drag, or ▲▼), quantity, name or type; the choice is remembered per player. Inventory and hotlist stay editable on locked sheets
- Equipment tab: a body diagram with an Equipment and an Accessory slot on the Head, Shoulders, Chest, Bracers, Hands, Back, Waist, Pants and Feet, an Accessory slot on the Neck, Main and Off hand for weapons and shields (a two-handed weapon takes both) and ten Finger slots for rings. Only items that fit a slot can go there. Equipped bonuses are added automatically, with a breakdown: DR and Evade totals ("incl. gear: Leather jacket +2"), Stats, and the damage of attacks with that skill ("+2 gear (Tire Iron)"; a held weapon with no skill set counts for every weapon attack). The GM can change how many slots of each kind a crawler has (Races and Classes); players can't. Older sheets' items are converted to the categories and slots (schema v8)
- Achievements & rewards (Achievements tab on each sheet, /admin/achievements for the GM): the GM creates an achievement (title, description, optional reward) and gives it to one or more crawlers, where it is kept in their history with the date. Rewards are loot boxes (Bronze, Silver, Gold, Platinum, Legendary, Celestial; Adventurer, Boss, Crafter's, Assassin's… or a custom name) with items, plus any other reward in words. Players see the sealed boxes but not what's inside until they claim it; "Claim reward" works once per crawler, plays an opening animation box by box (special, Legendary, Celestial and unique items get the spotlight) and adds the items to the inventory: same items stack, unique ones and ones with different bonuses get their own row, and book items get their description filled in. The GM can lock claiming for everyone ("The GM has temporarily locked reward claiming"), give a different reward to one crawler, give an achievement to more crawlers, or take it back. The log announces achievements and opened boxes
- Status effects: buffs, debuffs, Advantage and Disadvantage with a duration (rounds, until the end of combat, until a rest, or until removed), plus an optional round count on Table 8 debuffs. They show as chips on the party cards; hover or tap one for its effect and time left. Round counts go down when Clean Up ends, fight-long ones end with the combat, rest-long ones with a short or long rest (the log says what ended)
- Links between two participants: the GM links a Mob and a crawler ("Grabbing: Alvaro" on the Mob, "Grabbed by: Bad Llama 2" on the crawler), or protect/taunt/custom links. They show on both cards and clear themselves when either side is defeated or leaves, and at the end of combat
- Degrees of Success: rolls against a difficulty show Critical Hit, Amazing Success, Near Miss, Major Fail or Critical Fail. Attacks: a Natural 20 doubles the damage dice, an Amazing Success adds the Floor. Evades: a Natural 20 or Amazing Success gives Advantage on the next attack against that Mob (added as a status and used up by that attack), a Major Fail adds the Floor to the damage and a Minor Injury after combat, a Critical Fail doubles the damage and leaves a Major Injury
- Interrupts for allies: Intervene (+1d6 to another crawler's d20 Check in combat, not Stat Checks; the button stands out on a Near Miss, and an Evade or attack it pushes over the line counts as a success), Taunt (an Int-opposed Taunt Check: the Mob attacks the taunter instead; not against Area Attacks) and Catcher (for crawlers with Ranks in it: take the hit, no Evade). Each uses an Action
- Attack bar: Advantage/Disadvantage (automatic from status effects, or picked by hand; both cancel out), Area Attacks (one roll and one Action against every ticked opponent, one damage roll for all) and the Mana cost of attack spells spent when cast at a target
- Using items: Consumables spend a charge or one item (the row goes at 0); healing and Mana items apply themselves (on yourself or a party member). Equipment, Accessory and Special abilities are used without being used up. Out of combat, Consumables can be used straight from the inventory; in combat only Hotlist items can be used, and it takes an Action (an Interrupt in Crawler Reaction for healing). Ranged weapons fire Ammunition from the Hotlist: each shot (at a target or a plain roll) spends one, and with several kinds on the Hotlist you pick which
- Map with fog of war (/map; a minimap of the current Floor's map sits in the party panel and on World Stats and opens it full size): the GM uploads a map image per Floor or area, sets a grid, paints the explored cells (Reveal/Hide, drag to paint), drops points of interest (stairwell, saferoom, Boss, danger, loot, NPC, note; hidden until made visible) and moves the party token, then shares the map. Players only ever download a copy with the unrevealed cells blacked out (rendered by the GM's browser) and only the visible pins; changes show up live
- Third Floor crawlers: "Start on the Third Floor" in the new-crawler wizard adds a Tutorial Floors step (Core Rulebook p. 115): Level 10, 27 Stat points, extra Skill Ranks rolled (2d4 on the main attack, 1d4 on the rest, max 10), AI Favor (1d2 plus the main attack's rating), Popularity, Starting Loot from Table 25 (or Spells instead) added to the inventory with its tier, six Tutorial Floor Experiences into the notes, Race and Class
- Start from a pre-gen: the 12 ready-to-play crawlers from Par for the Course (First and Second Floor) become a new sheet with their Stats, Level and key Skills (attacks pinned, details from the book)
- Level Collapse clock: optionally tie it to "2 hours passed" (it takes 2 hours off the countdown); the GM's clock buttons are labelled with the rests they match (mend 1 h, short rest 2 h, long rest 8 h, full day 30 h). Floors 6–18 have original ambience texts for the GM to rename and rewrite
- NPC stat blocks have Spanish rules notes too (shown when the app is in Spanish, editable on unlocked stat blocks; "Add book stat blocks" fills them in)
- Installable app (PWA): add it to your phone's home screen; the service worker caches only the app itself, never sheets or other data
- Hotlist slots hold inventory items (Consumables, Ammunition, Special items, and Equipment/Accessories with an ability): put an item in one of the 10 slots from the Hotlist tab ("Put an item here…"), with ★ on an inventory row (first free slot) or from the item's details (pick the slot). A slot with an item shows its quantity and a Use button; empty slots still take free text (a spell, a note). Hotlist items also get Use buttons under the Core tab's attacks and on the combat page. In combat, changing a slot takes an Action and is posted to the chat, where its owner or the GM can undo it (the Action comes back). Older sheets' ★ quick-access items move into the slot whose text names them, or the first empty one
- Campaign loot (`server/catalog/homebrew.js`, GM only): 46 original Floor 1–2 items in the spirit of the first book's loot boxes (Bronze ≈ +1, Silver ≈ +2 to a Stat or DR, Gold ≈ +3 or several bonuses; consumables too), names in English, effects and System AI text in Spanish. In the loot box editor: "Add from the campaign's loot…" (grouped by tier), typing a name fills its type, rarity, bonuses and description, and "Random box" fills a box like the book: one magic item of its tier, a consumable, a potion or supplies, and gold
- Items can give Stat bonuses (STR/INT/CON/DEX/CHA): equipped, they add to the Enhanced score, so the Mod, Max Mana and lifting follow ("With gear: 6 (Silver Ring of Grace +2)" under the Stat)
- Nightly database backups (03:00 container time, `VACUUM INTO`, the last `BACKUP_KEEP` kept); the Players page lists them and has "Back up now"
- Custom (homebrew) skills in every category; name suggestions are filtered to the section's own category
- A single container with a SQLite database kept in the `/data` volume

## Deploy (Docker Compose)

Image: `ghcr.io/alorkas/dcc-crawler-sheets:latest`. It is published by `.github/workflows/publish.yml` on every push to `main`. After the first run, set the package's visibility to public in GitHub.

On the Docker host:

```sh
cp .env.example .env   # fill in the admin account (and optionally a JWT secret)
docker compose pull
docker compose up -d
```

To update later: `docker compose pull && docker compose up -d`.

`docker-compose.yml` reads `DCC_ADMIN_USERNAME`, `DCC_ADMIN_PASSWORD`, `DCC_JWT_SECRET`, `DCC_ALLOW_REGISTRATION`, `DCC_COOKIE_SECURE` and `DCC_PORT` from `.env` and passes them to the container as:

| Variable             | Purpose                                                                                               |
| -------------------- | ----------------------------------------------------------------------------------------------------- |
| `ADMIN_USERNAME`     | Admin account. It is created on startup, and its password is reset to `ADMIN_PASSWORD` on every start |
| `ADMIN_PASSWORD`     | Admin password (min 8 chars)                                                                          |
| `JWT_SECRET`         | Session signing key (`openssl rand -hex 48`). If unset, one is generated and stored in `/data`        |
| `ALLOW_REGISTRATION` | `true` (default) for open registration, `false` to close it                                           |
| `COOKIE_SECURE`      | `true` when served over HTTPS (e.g. behind Caddy)                                                     |
| `PORT`               | Listen port inside the container (default `3000`)                                                     |
| `BACKUP_KEEP`        | Nightly backups to keep (default `14`, `0` turns them off)                                            |
| `BACKUP_DIR`         | Where backups go (default `/data/backups`)                                                            |

Back up the `crawler-data` volume (`/data/crawlers.db`, plus the nightly copies in `/data/backups`) to keep every sheet. In `.env`, `DCC_BACKUP_KEEP` sets `BACKUP_KEEP` and `DCC_BACKUP_DIR_IN_CONTAINER` sets `BACKUP_DIR` (mount a host folder at `/backups` to keep copies outside the volume).

### Reverse proxy note

The party and log panels use Server-Sent Events on `/api/events`. Caddy works out of the box. With nginx, the app sends `X-Accel-Buffering: no`; if updates still arrive late, add `proxy_buffering off;` for that location.

## Local development

```bash
npm install
npm run dev:server   # API on :3000 (admin / changeme123, data in ./data)
npm run dev          # Vite on :5173, proxies /api to :3000
```

Checks: `npm run lint`, `npx prettier --check .`, `npm run build`, `npm test`.

## Structure

- `server/`: Express API (`app.js`), SQLite schema (`db.js`), entrypoint (`index.js`)
- `server/game.js`: NPC stat blocks, combat tracker and level-ups (`server/progress.js`)
- `server/live.js`: party panel, roll log/chat and the Server-Sent Events stream (`/api/events`); `server/dice.js`: dice parser
- `server/catalog/`: Core Rulebook weapons, spells, utility skills and items (server-side only, so spells and items aren't in the browser bundle)
- `src/lib/creation.ts` + `src/pages/CreatePage.tsx`: the character creation wizard (background tables, starter options, sheet builder)
- `src/lib/sheet.ts`: the sheet data model (every field from the PDF)
- `src/lib/rules.ts`: game rules as pure functions (derived values, damage, rests, debuffs, advancement, migration of older sheets), unit-tested in `rules.test.ts`
- `src/components/SheetTabs.tsx`: the six sheet pages
- `src/locales/`: UI translations (`en.ts` is the source; `es.ts` must define the same keys, which TypeScript checks). To add a language, add a file there and register it in `src/lib/i18n.tsx`
- `tests/`: API tests for permissions and locking

Data is stored as JSON per character, so you can add new fields to `emptySheet()` without a migration. Older sheets pick up the new fields automatically.
