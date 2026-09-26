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
- `server/live.js`: party panel, roll log/chat and the Server-Sent Events stream (`/api/events`); `server/dice.js`: dice parser
- `server/catalog/`: Core Rulebook weapons, spells, utility skills and items (server-side only, so spells and items aren't in the browser bundle)
- `src/lib/creation.ts` + `src/pages/CreatePage.tsx`: the character creation wizard (background tables, starter options, sheet builder)
- `src/lib/sheet.ts`: the sheet data model (every field from the PDF)
- `src/lib/rules.ts`: game rules as pure functions (derived values, damage, rests, debuffs, advancement, migration of older sheets), unit-tested in `rules.test.ts`
- `src/components/SheetTabs.tsx`: the six sheet pages
- `src/locales/`: UI translations (`en.ts` is the source; `es.ts` must define the same keys, which TypeScript checks). To add a language, add a file there and register it in `src/lib/i18n.tsx`
- `tests/`: API tests for permissions and locking

Data is stored as JSON per character, so you can add new fields to `emptySheet()` without a migration. Older sheets pick up the new fields automatically.
