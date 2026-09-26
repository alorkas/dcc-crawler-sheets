import { test } from 'node:test';
import assert from 'node:assert/strict';
import { applyPlay, isPlayPath, onlyPlayChanges } from '../shared/lockRules.js';

test('play paths', () => {
  assert.ok(isPlayPath(['hbLost']));
  assert.ok(isPlayPath(['debuffList', 0, 'note']));
  assert.ok(isPlayPath(['evade', 'buffs']));
  assert.ok(!isPlayPath(['evade', 'dexMod']));
  assert.ok(!isPlayPath(['dr', 'armor']));
  assert.ok(!isPlayPath(['stats', 'str', 'enhanced']));
  assert.ok(!isPlayPath(['name']));
  assert.ok(isPlayPath(['skills', 3, 'done']));
  assert.ok(!isPlayPath(['skills', 3, 'rank']));
  assert.ok(!isPlayPath(['skills']));
});

test('onlyPlayChanges ignores key order and play fields', () => {
  const a = { name: 'Carl', stats: { str: { enhanced: '6' } }, hbLost: 0, evade: { dexMod: '', buffs: '' } };
  const b = { hbLost: 3, evade: { buffs: '+2', dexMod: '' }, stats: { str: { enhanced: '6' } }, name: 'Carl' };
  assert.ok(onlyPlayChanges(a, b));
  assert.ok(!onlyPlayChanges(a, { ...b, name: 'Carlos' }));
  assert.ok(!onlyPlayChanges(a, { ...b, evade: { buffs: '', dexMod: '+9' } }));
});

test('skill advancement marks can change, ranks cannot', () => {
  const a = { skills: [{ name: 'Stealth', rank: '1', done: false }] };
  assert.ok(onlyPlayChanges(a, { skills: [{ name: 'Stealth', rank: '1', done: true }] }));
  assert.ok(!onlyPlayChanges(a, { skills: [{ name: 'Stealth', rank: '2', done: false }] }));
  assert.ok(!onlyPlayChanges(a, { skills: [] }));
});

test('applyPlay keeps the stored build and takes the play fields', () => {
  const stored = { name: 'Carl', hbLost: 0, skills: [{ name: 'Stealth', rank: '1', done: false }] };
  const incoming = {
    name: 'Carlos',
    hbLost: 3,
    evade: { buffs: '+1', dexMod: '+9' },
    skills: [{ name: 'Stealth', rank: '9', done: true, custom: false }, { name: 'New' }],
  };
  assert.deepEqual(applyPlay(stored, incoming), {
    name: 'Carl',
    hbLost: 3,
    evade: { buffs: '+1' },
    skills: [{ name: 'Stealth', rank: '1', done: true }],
  });
});
