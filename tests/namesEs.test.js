import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SKILLS_ES } from '../shared/namesEs.js';
import { ITEMS_ES, NPCS_ES, SPELLS_ES, npcNameEs } from '../server/catalog/namesEs.js';
import { ITEMS } from '../server/catalog/items.js';
import { SPELLS } from '../server/catalog/spells.js';
import { WEAPONS } from '../server/catalog/weapons.js';
import { UTILITY } from '../server/catalog/utility.js';

test('Spanish names: every table filled, book items and spells all covered', () => {
  for (const table of [SKILLS_ES, ITEMS_ES, SPELLS_ES, NPCS_ES])
    for (const [en, es] of Object.entries(table)) assert.ok(String(es).trim(), en);
  for (const it of ITEMS) assert.ok(ITEMS_ES[it.name], `item ${it.name}`);
  for (const sp of SPELLS) assert.ok(SPELLS_ES[sp.name], `spell ${sp.name}`);
  for (const s of [...WEAPONS, ...UTILITY]) assert.ok(SKILLS_ES[s.name], `skill ${s.name}`);
});

test('Spanish NPC names keep their bracketed suffix, translated', () => {
  assert.equal(npcNameEs('Smombie (Floor 3)'), `${NPCS_ES.Smombie} (Piso 3)`);
  assert.equal(npcNameEs('Smombie'), NPCS_ES.Smombie);
  assert.equal(npcNameEs('Unknown Thing'), '');
});
