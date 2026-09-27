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
- Combat page (/combat): the fight full size, with the round and the 5 phases on top, the party on one side (Health, mana, Actions, Evade, AI Favor, declared attacks) and the opponents on the other; the GM also sees each opponent's attacks, rules notes and System AI text. The log and chat stay in the right panel
- World Stats page (/world): the Floor the party is on, crawlers still alive in the World Dungeon, the in-game time to Level Collapse (with a bar) and the Floor's ambience in English and Spanish. The GM changes the Floor (restarting the countdown: 5/6/8/10/15 days for Floors 1–5, updating the fight and, optionally, every party sheet's Floor for +F), adjusts the timer and the crawler count, and can rewrite the Floor's name and ambience. The combat tracker takes its Floor from here
- NPC stat blocks: Stat blocks are locked by default (unlock to edit); locked ones show the System AI text (Spanish when the app is in Spanish), each attack with its Evade difficulty and a damage roll button, and the notes.
- NPCs & Mobs (GM only): stat blocks in the Core Rulebook's Mob format (type, size, Health Bar slots, Level, Surprise, Evade, Move, DR, stats, attacks, notes) that can be dropped into combat ("Bad Llama 1", "Bad Llama 2"…). Stat blocks are locked by default (unlock to edit); "Add book stat blocks" imports 322 stat blocks: the Game Master's Campaign Toolkit's First and Second Floor Mobs, Bosses and rival crawlers (87), Par for the Course's Second Floor encounter (3) and its 12 pre-generated crawlers, and the Core Rulebook's 221 (Floors 3–5 and the Royal Court appendix). Numbers and attacks, the special rules rewritten in our own words (with the page for the book's full text), and an original "System AI says" description for every entry (`server/catalog/npcs.js`). Re-running the import fills these into stat blocks imported earlier, without touching notes you wrote yourself
- Levels & progression (GM only): +1 Level for 2 hours of play, quests, Boss kills by tier, crawler kills (1d6 ± Level difference) and grinding hours, with Stat points to assign (an "Assign Stat points" helper on unlocked sheets raises Enhanced and Unenhanced, previews the new Mods and logs it) and a Level history; Skill Advancement rolls happen on the server; a party-wide "2 hours passed" button levels everyone and rolls their 2-hour advancement. Works on locked sheets, and open sheets refresh automatically
- Log tab: HP and mana changes with their source (damage source, Heal spell, potions, rests…), level-ups, advancement results, combat rounds and opponent damage. HP of party members is public, mana and non-party changes are only visible to the owner and the GM
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

Back up the `crawler-data` volume (`/data/crawlers.db`) to keep every sheet.

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
