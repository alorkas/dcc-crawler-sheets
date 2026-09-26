import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseDice, rollDice } from '../server/dice.js';

test('parses common expressions', () => {
  assert.ok(parseDice('d20+6'));
  assert.ok(parseDice('2d6 + 1d4 - 1'));
  assert.ok(parseDice('2d20kh1+3'));
  assert.ok(parseDice('D20 − 2'));
  for (const bad of ['', 'fireball', 'd20++3', '1000d6', 'd1', '2d20kh3', 'd20+', '3 4']) {
    assert.equal(parseDice(bad), null, bad);
  }
});

test('rolls with a fixed rng', () => {
  const r = rollDice('2d6+3', () => 4);
  assert.equal(r.total, 11);
  assert.equal(r.expr, '2d6+3');
  assert.deepEqual(r.parts[0].rolls, [4, 4]);
  assert.equal(r.natural, null);
});

test('keep highest / lowest and natural d20', () => {
  const seq = [5, 17];
  const r = rollDice('2d20kh1+2', () => seq.shift());
  assert.equal(r.total, 19);
  assert.equal(r.natural, 17);
  assert.deepEqual(r.parts[0].kept, [false, true]);
  const s = [5, 17];
  assert.equal(rollDice('2d20kl1', () => s.shift()).total, 5);
  assert.equal(rollDice('d20-1', () => 20).natural, 20);
});

test('real rolls stay in range', () => {
  for (let i = 0; i < 500; i++) {
    const r = rollDice('d20');
    assert.ok(r.total >= 1 && r.total <= 20);
  }
});
