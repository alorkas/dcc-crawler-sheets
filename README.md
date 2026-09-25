# Crawler Sheets

Interactive, mobile-friendly character sheets for a **Dungeon Crawler Carl RPG** campaign. It covers all 6 pages of the official fillable sheet.

- Players can register themselves and see only their own crawlers
- Sheets save automatically; **Lock** makes a sheet read-only (the server enforces it), **Unlock** allows editing again
- Admins see every sheet, grouped by player, can edit or unlock anything, reassign owners, and manage players
- English and Spanish UI: switch with the EN/ES toggle. The choice is saved per browser, and the default follows the browser language
- Rules automation (Tutorial Floors): Stat Mods (Table 9), Max Mana, Evade, Health Bar slots = Con Mod with a damage calculator (DR → resistance → slots), Heal, rests, Table 8 debuffs with penalties, skill roll totals, and Skill Advancement rolls. Calculated values can be overridden with ✎, and ↺ switches them back to automatic
- Skills grouped into Combat (by weapon family), Utility (Opposed / Unopposed / Passive) and Spell (Attack / Passive) sections. Book skills are sorted automatically by name, and choosing a type fills in the default Check Type
- A single container with a SQLite database kept in the `/data` volume

## Deploy (Komodo / docker compose)

Image: `ghcr.io/alorkas/dcc-crawler-sheets:latest`. It is published by `.github/workflows/publish.yml` on every push to `main`. After the first run, set the package's visibility to public in GitHub.

Environment variables (in `docker-compose.yml` the admin and JWT values come from the Komodo secrets `DCC_ADMIN_USERNAME`, `DCC_ADMIN_PASSWORD` and `DCC_JWT_SECRET`):

| Variable             | Purpose                                                                                               |
| -------------------- | ----------------------------------------------------------------------------------------------------- |
| `ADMIN_USERNAME`     | Admin account. It is created on startup, and its password is reset to `ADMIN_PASSWORD` on every start |
| `ADMIN_PASSWORD`     | Admin password (min 8 chars)                                                                          |
| `JWT_SECRET`         | Session signing key (`openssl rand -hex 48`). If unset, one is generated and stored in `/data`        |
| `ALLOW_REGISTRATION` | `true` (default) for open registration, `false` to close it                                           |
| `COOKIE_SECURE`      | `true` when served over HTTPS (e.g. behind Caddy)                                                     |
| `PORT`               | Listen port inside the container (default `3000`)                                                     |

Back up the `crawler-data` volume (`/data/crawlers.db`) to keep every sheet.

## Local development

```bash
npm install
npm run dev:server   # API on :3000 (admin / changeme123, data in ./data)
npm run dev          # Vite on :5173, proxies /api to :3000
```

Checks: `npm run lint`, `npx prettier --check .`, `npm run build`, `npm test`.

## Structure

- `server/`: Express API (`app.js`), SQLite schema (`db.js`), entrypoint (`index.js`)
- `src/lib/sheet.ts`: the sheet data model (every field from the PDF)
- `src/lib/rules.ts`: game rules as pure functions (derived values, damage, rests, debuffs, advancement, migration of older sheets), unit-tested in `rules.test.ts`
- `src/components/SheetTabs.tsx`: the six sheet pages
- `src/locales/`: UI translations (`en.ts` is the source; `es.ts` must define the same keys, which TypeScript checks). To add a language, add a file there and register it in `src/lib/i18n.tsx`
- `tests/`: API tests for permissions and locking

Data is stored as JSON per character, so you can add new fields to `emptySheet()` without a migration. Older sheets pick up the new fields automatically.
