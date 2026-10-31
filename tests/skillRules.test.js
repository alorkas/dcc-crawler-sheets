import test from 'node:test';
import assert from 'node:assert/strict';
import {
  catcherPerks,
  dodgeOf,
  effectRankDice,
  effectSpec,
  effectiveSkills,
  effectsFor,
  isRangedAttack,
  multApplies,
  multiplyBaseDice,
  parseSkillBonus,
  rankDie,
  rankUpgrades,
  tauntCount,
  tauntPerks,
  termCount,
  upgradeDice,
  withEffectDice,
} from '../shared/skillRules.js';
import { debuffDisadvantage, dropDebuffs, isWoozy, rollMode, usedUpBy, withRollMode } from '../shared/combat.js';

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
  // past Rank 15 (gear can take a Skill there)
  assert.deepEqual([17, 18, 19, 20, 25].map(rankDie), ['2d8', '1d10+1d8', '1d10+1d8', '2d10', '2d10']);
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

test('Attack Skill Rank upgrades come from the book notes', () => {
  const pug = {
    name: 'Pugilism',
    category: 'combat',
    subtype: 'handToHand',
    notes: 'R5: +2d2 · R10: +1d2 · R15: +1d2, free extra attack with Disadvantage\nCore Rulebook p. 179',
  };
  assert.deepEqual(upgradeDice(rankUpgrades({ ...pug, rank: '4' })), { base: '', rank: '' });
  assert.deepEqual(upgradeDice(rankUpgrades({ ...pug, rank: '5' })), { base: '2d2', rank: '' });
  assert.deepEqual(upgradeDice(rankUpgrades({ ...pug, rank: '12' })), { base: '2d2+1d2', rank: '' });
  const xbow = {
    name: 'Crossbow',
    category: 'combat',
    subtype: 'ranged',
    notes: 'R5: +1d8 · R10: +1d8, Blood Trail · R15: +1d8, range 100 ft',
  };
  assert.deepEqual(upgradeDice(rankUpgrades({ ...xbow, rank: '5' })), { base: '1d8', rank: '' });
  const noggin = {
    name: 'Noggin Nocker',
    category: 'combat',
    notes: 'R5: +1d4, no self-damage · R10: +1d4, +1 Rank damage die',
  };
  assert.deepEqual(upgradeDice(rankUpgrades({ ...noggin, rank: '10' })), { base: '1d4+1d4', rank: '1d10' });
  // Damage Effects and Spells are handled elsewhere
  const ip = {
    name: 'Iron Punch',
    category: 'combat',
    subtype: 'damageEffect',
    rank: '5',
    notes: 'R5: +1 Rank damage die',
  };
  assert.deepEqual(upgradeDice(rankUpgrades(ip)), { base: '', rank: '' });
  assert.deepEqual(upgradeDice(rankUpgrades({ ...xbow, category: 'spell', rank: '5' })), { base: '', rank: '' });
});

test('Skill bonuses on items: parsed in either order, counted only while held or worn', () => {
  assert.deepEqual(parseSkillBonus('Pugilism +1, Taunt +3; +2 Stealth\n+1 a Sigilo, Tire Iron (Club) +2, junk'), [
    { skill: 'Pugilism', ranks: 1 },
    { skill: 'Taunt', ranks: 3 },
    { skill: 'Stealth', ranks: 2 },
    { skill: 'Sigilo', ranks: 1 },
    { skill: 'Tire Iron (Club)', ranks: 2 },
  ]);
  const inventory = [
    { item: 'Ring', qty: '1', slot: 'acc.finger.1', skillBonus: 'Taunt +3, Iron Punch +2, Esquivar +1' },
    { item: 'Bag charm', qty: '1', slot: '', skillBonus: 'Taunt +5' },
  ];
  const skills = [
    { name: 'Taunt', rank: '2' },
    { name: 'Dodge', rank: '4' },
    { name: 'Climbing', rank: '1' },
  ];
  const out = effectiveSkills(skills, inventory);
  assert.equal(out[0].rank, '5');
  assert.equal(out[0].baseRank, '2');
  assert.equal(out[1].rank, '5', 'the Spanish name counts too');
  assert.equal(out[2], skills[2], 'untouched Skills stay as they are');
  // a Skill only the gear grants: the crawler has it at that Rank
  assert.deepEqual(
    out.slice(3).map((s) => [s.name, s.rank, s.fromGear]),
    [['Iron Punch', '2', true]],
  );
  assert.equal(dodgeOf(out).evade, 2, 'Dodge Rank 5 from gear');
  assert.equal(effectiveSkills(skills, []), skills);
});

test('Powerful Strike multiplies only the base damage dice', () => {
  // 2d4 base (7) + 2, then a Rank die 1d10 (6): base dice ×3 → 21 + 2 + 6
  const roll = {
    total: 15,
    parts: [
      { sign: 1, dice: '2d4', value: 7 },
      { sign: 1, value: 2 },
      { sign: 1, dice: '1d10', value: 6 },
    ],
  };
  assert.equal(multiplyBaseDice(roll, 3, 2), 29);
  assert.equal(multiplyBaseDice(roll, 1, 2), 15);
  assert.equal(termCount('2d4+2'), 2);
  assert.equal(termCount('1d2+1d4-1'), 3);
});

test('Debuffs that change rolls (Table 11) and Advantage/Disadvantage counting', () => {
  const list = [{ id: 'stunned' }, { id: 'terrified' }, { id: 'minorInjury' }];
  assert.deepEqual(debuffDisadvantage(list, 'check'), ['stunned']);
  assert.deepEqual(debuffDisadvantage(list, 'attack'), ['stunned', 'terrified']);
  assert.deepEqual(debuffDisadvantage([{ id: 'shitFaced' }], 'evade'), ['shitFaced']);
  assert.deepEqual(usedUpBy(list, 'attack'), ['stunned'], 'Stunned lasts one Check; Terrified stays');
  assert.deepEqual(dropDebuffs(list, ['stunned']), list.slice(1));
  assert.equal(dropDebuffs(list, []), list);
  assert.equal(isWoozy([{ id: 'woozy' }]), true);
  // one of each cancels out; what's left wins, and it's still one extra d20
  assert.equal(rollMode(1, 1), 'normal');
  assert.equal(rollMode(2, 1), 'adv');
  assert.equal(rollMode(0, 3), 'dis');
  assert.equal(withRollMode('d20+5', 'dis'), '2d20kl1+5');
  assert.equal(withRollMode('2d20kh1-1', 'dis'), '2d20kl1-1');
  assert.equal(withRollMode('d20+5', 'normal'), 'd20+5');
});
