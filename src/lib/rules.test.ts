import { describe, expect, it } from 'vitest';
import {
  addDebuff,
  damageExpr,
  annotateDamage,
  canPin,
  pinnedAttacks,
  attackMatchesSkill,
  castHeal,
  checkPenalty,
  derive,
  effectiveDamage,
  learnUntrained,
  loadSheet,
  newSheet,
  rankDamageDie,
  rest,
  rollAdvancement,
  slotsLost,
  statModFromScore,
} from './rules';
import { emptySheet } from './sheet';
import { classifySkill, defaultCheckType } from './skillTypes';

const withStats = (vals: Partial<Record<'str' | 'int' | 'con' | 'dex' | 'cha', string>>) => {
  const s = newSheet();
  for (const [k, v] of Object.entries(vals)) s.stats[k as 'str'] = { enhanced: v!, unenhanced: v!, mod: '' };
  return s;
};

describe('stat mods (Table 9)', () => {
  it.each([
    [1, 1],
    [2, 1],
    [3, 2],
    [5, 2],
    [6, 3],
    [9, 3],
    [10, 4],
    [19, 4],
    [20, 5],
    [50, 6],
    [150, 8],
    [300, 10],
  ])('score %i → +%i', (score, mod) => expect(statModFromScore(score)).toBe(mod));

  it('manual override wins over the table', () => {
    const s = withStats({ dex: '5' });
    expect(derive(s).mods.dex).toBe(2);
    s.stats.dex.mod = '+4';
    expect(derive(s).mods.dex).toBe(4);
  });
});

describe('derived values', () => {
  it('Max Mana = Enhanced Intelligence, HB slot = Con Mod, evade = Dex Mod + buffs', () => {
    const s = withStats({ int: '6', con: '4', dex: '5' });
    s.evade.buffs = '+1 ring';
    const d = derive(s);
    expect(d.manaMax).toBe(6);
    expect(d.slotValue).toBe(2);
    expect(d.evadeTotal).toBe(3);
  });

  it('debuff penalties apply to evade and move', () => {
    const s = withStats({ dex: '5' });
    s.debuffList = addDebuff(addDebuff([], 'fatigued'), 'fatigued');
    const d = derive(s);
    expect(d.penalty).toBe(-2);
    expect(d.evadeTotal).toBe(0);
    expect(d.moveEffective).toBe(10);
  });
});

describe('damage', () => {
  it('matches the rulebook example: 14 damage vs slots of 3 → 4 slots', () => {
    expect(slotsLost(14, 3, 10)).toBe(4);
  });
  it('damage below one slot is ignored', () => {
    expect(slotsLost(2, 3, 10)).toBe(0);
  });
  it('applies DR, then resistance, vulnerability, immunity', () => {
    expect(effectiveDamage({ amount: 23, dr: 3, resistant: true })).toBe(10);
    expect(effectiveDamage({ amount: 7, dr: 3, bypassDr: true })).toBe(7);
    expect(effectiveDamage({ amount: 7, dr: 3, vulnerable: true })).toBe(8);
    expect(effectiveDamage({ amount: 7, dr: 0, immune: true })).toBe(0);
  });
  it('rank damage die (Table 14)', () => {
    expect(rankDamageDie(1)).toBe('+1');
    expect(rankDamageDie(7)).toBe('+1d6');
  });
});

describe('debuffs', () => {
  it('second Minor Injury becomes Long-Term', () => {
    const l = addDebuff(addDebuff([], 'minorInjury'), 'minorInjury');
    expect(l.map((d) => d.id)).toEqual(['ltMinorInjury']);
  });
  it('non-stackable debuffs do not duplicate, stackable ones stack', () => {
    expect(addDebuff(addDebuff([], 'burned'), 'burned')).toHaveLength(1);
    expect(addDebuff(addDebuff([], 'poisoned'), 'poisoned')[0].stacks).toBe(2);
    expect(checkPenalty(addDebuff([], 'majorInjury'))).toBe(-5);
  });
});

describe('healing & rests', () => {
  it('Heal costs 2 Mana and restores 2 slots', () => {
    const s = withStats({ int: '5', con: '4' });
    s.manaCurrent = '5';
    s.hbLost = 5;
    const out = castHeal(s)!;
    expect(out.manaCurrent).toBe('3');
    expect(out.hbLost).toBe(3);
    s.manaCurrent = '1';
    expect(castHeal(s)).toBeNull();
  });
  it('short rest: +5 slots, half Intelligence Mana, clears Minor Injury', () => {
    const s = withStats({ int: '15' });
    s.manaCurrent = '0';
    s.hbLost = 8;
    s.debuffList = addDebuff(addDebuff([], 'minorInjury'), 'majorInjury');
    const out = rest(s, 'short');
    expect(out.hbLost).toBe(3);
    expect(out.manaCurrent).toBe('7');
    expect(out.debuffList.map((d) => d.id)).toEqual(['majorInjury']);
  });
  it('long rest: full health and mana, clears fatigue', () => {
    const s = withStats({ int: '6' });
    s.hbLost = 10;
    s.manaCurrent = '1';
    s.debuffList = addDebuff([], 'fatigued');
    const out = rest(s, 'long');
    expect(out.hbLost).toBe(0);
    expect(out.manaCurrent).toBe('6');
    expect(out.debuffList).toHaveLength(0);
  });
});

describe('advancement', () => {
  it('rolls only marked skills, ≥ rank gains a rank, syncs attacks and clears marks', () => {
    const s = newSheet();
    s.skills[0] = { ...s.skills[0], name: 'Club', rank: '3', done: true };
    s.skills[1] = { ...s.skills[1], name: 'Stealth', rank: '6', done: true };
    s.attacks[0] = { ...s.attacks[0], name: 'Tire Iron (Club)', rank: '3' };
    const session = rollAdvancement(s, 'session', () => 3);
    expect(session.results).toHaveLength(1); // Stealth (rank 6) waits for end of floor
    expect(session.data.skills[0].rank).toBe('4');
    expect(session.data.skills[0].done).toBe(false);
    expect(session.data.attacks[0].rank).toBe('4');
    const floor = rollAdvancement(session.data, 'floor', () => 2);
    expect(floor.results[0]).toMatchObject({ name: 'Stealth', gained: false });
  });
  it('rank is capped at 15', () => {
    const s = newSheet();
    s.skills[0] = { ...s.skills[0], name: 'Axe', rank: '15', done: true };
    expect(rollAdvancement(s, 'floor', () => 20).data.skills[0].rank).toBe('15');
  });
  it('matches attacks to skills', () => {
    expect(attackMatchesSkill('Tire Iron (Club)', 'club')).toBe(true);
    expect(attackMatchesSkill('Clubbing', 'Club')).toBe(false);
  });
  it('learning an untrained skill adds it at Rank 1 and clears the list', () => {
    const s = newSheet();
    s.untrained = ['Climbing', 'Swimming'];
    const out = learnUntrained(s, 'Climbing');
    expect(out.skills.find((x) => x.name === 'Climbing')?.rank).toBe('1');
    expect(out.untrained).toEqual([]);
  });
});

describe('loading & migration', () => {
  it('empty record becomes a new crawler with book defaults', () => {
    const s = loadSheet({});
    expect(s.evade.move).toBe('20');
    expect(s.dr.aiFavor).toBe('1');
    expect(s.attacks[0].name).toBe('Unarmed Combat');
    expect(s.hotlist[0]).toMatch(/Heal/);
  });
  it('migrates v1 sheets', () => {
    const v1 = emptySheet() as unknown as Record<string, unknown>;
    delete v1.schema;
    const legacy = structuredClone(v1) as ReturnType<typeof emptySheet>;
    legacy.stats.dex = { enhanced: '5', unenhanced: '5', mod: '+2' }; // equals auto → becomes auto
    legacy.stats.str = { enhanced: '5', unenhanced: '5', mod: '+3' }; // differs → kept as override
    legacy.health[9].hit = true;
    legacy.health[8].hit = true;
    legacy.skills[0] = { ...legacy.skills[0], name: 'Persuasion', statMod: 'Cha +2' };
    const s = loadSheet(legacy);
    expect(s.schema).toBe(4);
    expect(s.hbLost).toBe(2);
    expect(s.stats.dex.mod).toBe('');
    expect(s.stats.str.mod).toBe('+3');
    expect(s.skills[0].stat).toBe('cha');
    expect(s.skills[0]).toMatchObject({ category: 'utility', subtype: 'opposed' });
    expect(s.skills).toHaveLength(1); // blank rows removed
  });
});

describe('skill categories', () => {
  it('classifies book skills, spells and bracketed custom weapons', () => {
    expect(classifySkill('Longsword')).toEqual(['combat', 'edged']);
    expect(classifySkill('tire iron (Club)')).toEqual(['combat', 'bashing']);
    expect(classifySkill('Fireball')).toBeNull(); // spells are only known to the server
    expect(classifySkill('Rapier')).toEqual(['combat', 'edged']);
    expect(classifySkill('Stealth')).toEqual(['utility', 'opposed']);
    expect(classifySkill('Internet Memes')).toBeNull();
  });
  it('default check types', () => {
    expect(defaultCheckType('combat', 'edged')).toBe('evade');
    expect(defaultCheckType('combat', 'damageEffect')).toBe('passive');
    expect(defaultCheckType('spell', 'attack')).toBe('evade');
    expect(defaultCheckType('utility', 'unopposed')).toBe('unopposed');
  });
  it('new crawlers start with Unarmed Combat and the Heal spell, and learned skills are sorted', () => {
    const s = newSheet();
    expect(s.skills.map((x) => [x.name, x.category, x.subtype])).toEqual([
      ['Unarmed Combat', 'combat', 'handToHand'],
      ['Heal', 'spell', 'passive'],
    ]);
    s.untrained = ['Climbing'];
    expect(learnUntrained(s, 'Climbing').skills[2]).toMatchObject({ category: 'utility', subtype: 'unopposed' });
  });
});

describe('skills list', () => {
  it('is not padded with blank rows when a saved sheet is loaded', () => {
    const saved = JSON.parse(JSON.stringify(newSheet()));
    const s = loadSheet(saved);
    expect(s.skills).toHaveLength(2);
    expect(s.skills[1].manaCost).toBe('2');
  });
  it('old saved skill rows get the new detail fields', () => {
    const saved = JSON.parse(JSON.stringify(newSheet()));
    delete saved.skills[0].baseDamage;
    expect(loadSheet(saved).skills[0].baseDamage).toBe('');
  });
});

describe('pinned attacks', () => {
  it('new crawlers have Unarmed Combat pinned', () => {
    const s = newSheet();
    expect(pinnedAttacks(s).map((i) => s.skills[i].name)).toEqual(['Unarmed Combat']);
  });
  it('only combat skills and attack spells can be pinned', () => {
    expect(canPin({ category: 'combat', subtype: '' })).toBe(true);
    expect(canPin({ category: 'spell', subtype: 'attack' })).toBe(true);
    expect(canPin({ category: 'spell', subtype: 'passive' })).toBe(false);
    expect(canPin({ category: 'utility', subtype: 'opposed' })).toBe(false);
  });
  it('migrates old attack rows into pinned skills', () => {
    const old = emptySheet();
    old.schema = 3;
    old.skills = [{ ...old.skills[0], name: 'Longsword', category: 'combat', subtype: 'edged', rank: '3' }];
    old.attacks[0] = { ...old.attacks[0], name: 'Longsword', dice: '1d8', dmgStat: 'str', effects: 'Slashing' };
    old.attacks[1] = { ...old.attacks[1], name: 'Fireball', rank: '5', dice: '2d12', dmgMod: '+3', effects: 'Fire' };
    const s = loadSheet(old);
    expect(s.skills[0]).toMatchObject({ pinned: true, baseDamage: '1d8 + Str', effect: 'Slashing' });
    expect(s.skills[1]).toMatchObject({
      name: 'Fireball',
      category: 'combat', // sorted into Spells later by the server lookup
      pinned: true,
      baseDamage: '2d12 +3',
    });
  });
  it('annotates stat names in damage with the current mod', () => {
    const s = newSheet();
    s.stats.str = { enhanced: '6', unenhanced: '6', mod: '' };
    expect(annotateDamage('1d4 + Str Bludgeoning', derive(s))).toBe('1d4 + Str (+3) Bludgeoning');
  });
});

describe('damageExpr', () => {
  const d = newSheet();
  d.stats.str.enhanced = '6';
  d.stats.int.enhanced = '3';
  const der = derive(d);
  it('turns damage text into a dice expression', () => {
    const str = der.mods.str!;
    expect(damageExpr('1d6 + Str Bludgeoning', der, '1')).toBe(`1d6+${str}`);
    expect(damageExpr('2d12+F Electric', der, '3')).toBe('2d12+3');
    expect(damageExpr('1d4 Piercing', der, '1')).toBe('1d4');
    expect(damageExpr('Stuns the target', der, '1')).toBeNull();
    expect(damageExpr('1d8 + Dex Mod Slashing', der, '1')).toBeNull(); // Dex not filled in
  });
});
