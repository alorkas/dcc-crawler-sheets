import { test } from 'node:test';
import assert from 'node:assert/strict';
import { damageDice, resolveNum } from '../shared/formula.js';

test('stat block numbers: +F adds the Floor', () => {
  assert.equal(resolveNum('13+F', 2), 15);
  assert.equal(resolveNum('16+F+F', 3), 22);
  assert.equal(resolveNum('15+5', 1), 20);
  assert.equal(resolveNum('15', 9), 15);
  assert.equal(resolveNum('', 1), null);
});

test('damage entries become dice expressions', () => {
  assert.equal(damageDice('2d12+F Electric', 2), '2d12+2');
  assert.equal(damageDice(': 1d8+3 Slashing', 1), '1d8+3');
  assert.equal(damageDice('1d6 + Str', 1, { str: '+2' }), '1d6+2');
  assert.equal(damageDice('1d6 + Str', 1, {}), null);
  assert.equal(damageDice('Special', 1), null);
});
