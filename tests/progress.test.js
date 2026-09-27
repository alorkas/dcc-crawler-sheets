import { test } from 'node:test';
import assert from 'node:assert/strict';
import { addGrindHours, advanceSkills, crawlerKillLevels, levelUp } from '../server/progress.js';

test('levelUp records level, stat points and history', () => {
  const r = levelUp({ level: '3', floor: '2', statPoints: '' }, 2, 'boss', 'borough');
  assert.equal(r.data.level, '5');
  assert.equal(r.data.statPoints, '6');
  assert.equal(r.data.levelLog.length, 1);
  assert.deepEqual([r.entry.from, r.entry.to, r.entry.source, r.entry.floor], [3, 5, 'boss', '2']);
});

test('crawler kill levels', () => {
  assert.equal(crawlerKillLevels(5, 8, 4), 7); // victim 3 higher
  assert.equal(crawlerKillLevels(5, 20, 6), 15); // capped
  assert.equal(crawlerKillLevels(9, 5, 3), 1); // min 1
  assert.equal(crawlerKillLevels(6, 6, 5), 5);
});

test('grinding levels up at hours equal to the current level and erases the total', () => {
  let r = addGrindHours({ level: '6', grindHours: '2' }, 3);
  assert.equal(r.leveled, false);
  assert.equal(r.data.grindHours, '5');
  r = addGrindHours(r.data, 1);
  assert.equal(r.leveled, true);
  assert.equal(r.data.level, '7');
  assert.equal(r.data.grindHours, '0');
});

test('skill advancement', () => {
  const data = {
    skills: [
      { name: 'Stealth', rank: '3', done: true },
      { name: 'Longsword', rank: '6', done: true },
      { name: 'Climbing', rank: '2', done: false },
    ],
  };
  const s = advanceSkills(data, 'session', () => 3);
  assert.deepEqual(s.results, [{ name: 'Stealth', from: 3, roll: 3, gained: true }]);
  assert.equal(s.data.skills[0].rank, '4');
  assert.equal(s.data.skills[0].done, false);
  assert.equal(s.data.skills[1].done, true, 'rank 5+ waits for the end of the floor');
  const f = advanceSkills(data, 'floor', () => 5);
  assert.equal(f.data.skills[1].rank, '6'); // 5 < 6: no gain
  assert.equal(f.data.skills[1].done, false);
});
