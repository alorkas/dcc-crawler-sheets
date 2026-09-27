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

test('Area Attacks: detection and the share of damage taken', async () => {
  const { isAreaAttack, hasSplash, damageFactor } = await import('../shared/formula.js');
  assert.equal(isAreaAttack({ range: '15ft Cone', damage: '1d6+3 Force' }), true);
  assert.equal(isAreaAttack({ range: '60ft range, 20ft Blast radius' }), true);
  assert.equal(isAreaAttack({ range: '30 ft', damage: '1d8+3 Fire' }), false);
  assert.equal(hasSplash({ range: '20ft Cone +10ft Splash' }), true);
  assert.equal(damageFactor({ evaded: true }), 0);
  assert.equal(damageFactor({}), 1);
  assert.equal(damageFactor({ area: true, evaded: true }), 0.5);
  assert.equal(damageFactor({ area: true, splash: true }), 0.5);
  assert.equal(damageFactor({ area: true, splash: true, evaded: true }), 0.25);
});
