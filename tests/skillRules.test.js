import test from 'node:test';
import assert from 'node:assert/strict';
import {
  catcherPerks,
  dodgeOf,
  effectRankDice,
  effectSpec,
  effectsFor,
  isRangedAttack,
  multApplies,
  rankDie,
  tauntCount,
  tauntPerks,
  withEffectDice,
} from '../shared/skillRules.js';

test('Rank damage dice (Table 37)', () => {
  assert.deepEqual([1, 2, 4, 6, 8, 10, 12, 14, 16].map(rankDie), [
    '1',
    '1d2',
    '1d4',
    '1d6',
    '1d8',
    '1d10',
    '1d12',
    '1d8+1d6',
    '2d8',
  ]);
});

test('Dodge adds up: +1, +2 at Rank 5, +4 at 10, +6 at 15', () => {
  const at = (rank) => dodgeOf([{ name: 'Dodge', rank: String(rank) }]);
  assert.deepEqual(
    [0, 1, 4, 5, 10, 15].map((r) => at(r).evade),
    [0, 1, 1, 2, 4, 6],
  );
  assert.equal(at(10).advVsRanged, true);
  assert.equal(at(14).freeEvade, false);
  assert.equal(at(15).freeEvade, true);
  assert.equal(isRangedAttack({ name: 'Spit', range: '30 ft' }), true);
  assert.equal(isRangedAttack({ name: 'Bite', range: '5 ft' }), false);
});

test('Taunt and Catcher by degree and Rank', () => {
  assert.deepEqual(['fail', 'success', 'amazing', 'crit'].map(tauntCount), [0, 1, 2, 3]);
  assert.deepEqual(tauntPerks(4), { range: 30, freeEvade: false, advantage: false });
  assert.deepEqual(tauntPerks(15), { range: 60, freeEvade: true, advantage: true });
  assert.deepEqual(
    [1, 5, 10, 15].map((r) => catcherPerks(r).dr),
    [0, 5, 10, 15],
  );
  assert.equal(catcherPerks(15).ignoreDebuffs, true);
});

test('Damage Effects go with their Attack Skills', () => {
  const skills = [
    { name: 'Pugilism', category: 'combat', attackType: 'melee', rank: '3' },
    { name: 'Bow', category: 'combat', attackType: 'ranged', rank: '3' },
    { name: 'Unarmed Combat', category: 'combat', attackType: 'melee', rank: '3' },
    { name: 'Iron Punch', subtype: 'damageEffect', rank: '2' },
    { name: 'Powerful Strike', subtype: 'damageEffect', rank: '0' },
    {
      name: 'Rematar',
      subtype: 'damageEffect',
      rank: '6',
      effect: '+1d4 de daño, +1 cada 3 niveles.',
      appliesTo: 'cuerpo a cuerpo',
    },
  ];
  const names = (attack) =>
    effectsFor(
      skills,
      skills.find((s) => s.name === attack),
    ).map((s) => s.name);
  assert.deepEqual(names('Pugilism'), ['Iron Punch', 'Rematar'], 'Powerful Strike needs a Rank');
  assert.deepEqual(names('Bow'), []);
  assert.deepEqual(names('Unarmed Combat'), [], 'cannot choose a Damage Effect');
  const rematar = effectSpec(skills[5]);
  assert.equal(withEffectDice('1d2+3', rematar), '1d2+3+1d4+2');
});

test('Damage Effect specs: Rank dice, multipliers, conditions, cooldowns', () => {
  const iron = effectSpec({ name: 'Iron Punch', rank: '15' });
  assert.equal(withEffectDice('1d2', iron), '1d2+1d2');
  assert.equal(effectRankDice(iron), '1d8+1d6+1d8+1d6');
  assert.deepEqual(iron.debuffs, ['stunned']);
  assert.equal(effectSpec({ name: 'Iron Punch', rank: '10' }, { stunInstead: true }).stunInstead, true);
  const strike = effectSpec({ name: 'Powerful Strike', rank: '4' }, { now: 5, readyAt: 20 });
  assert.equal(strike.usable, false);
  assert.equal(strike.waitHours, 15);
  assert.equal(effectSpec({ name: 'Powerful Strike', rank: '4' }).multBase, 4);
  assert.equal(effectSpec({ name: 'Smush', rank: '1' }, { targetPct: 50 }).why, 'targetTooHealthy');
  const choke = effectSpec({ name: 'Choke Out', rank: '10' });
  assert.equal(multApplies(choke, 40), true);
  assert.equal(multApplies(choke, 50), false);
  assert.equal(choke.multTotal, 4);
  const skull = effectSpec({ name: 'Skullcracker', rank: '5' }, { sameSize: false });
  assert.deepEqual(skull.add, []);
  const toss = effectSpec({ name: 'Toss', rank: '10' });
  assert.equal(withEffectDice('1d4+2', toss, 3), '1d4+2+1d8+3');
  assert.equal(toss.tossFeet, 10);
});
