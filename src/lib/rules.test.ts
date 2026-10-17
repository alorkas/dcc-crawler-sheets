import { describe, expect, it } from 'vitest';
import {
  addDebuff,
  assignStatPoints,
  damageExpr,
  annotateDamage,
  canPin,
  pinnedAttacks,
  attackMatchesSkill,
  castHeal,
  checkPenalty,
  derive,
  SCHEMA_VERSION,
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
import { emptyItem, emptySheet } from './sheet';
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
    expect(s.evade.move).toBe('');
    expect(derive(s).move).toBe(20);
    expect(derive(s).step).toBe(10);
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
    expect(s.schema).toBe(SCHEMA_VERSION);
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

describe('assignStatPoints', () => {
  it('raises Enhanced and Unenhanced and spends the points', () => {
    const d = newSheet();
    d.stats.str = { enhanced: '8', unenhanced: '6', mod: '' };
    d.stats.con = { enhanced: '5', unenhanced: '', mod: '' };
    d.statPoints = '6';
    const r = assignStatPoints(d, { str: 2, con: 1 })!;
    expect(r.stats.str).toMatchObject({ enhanced: '10', unenhanced: '8' });
    expect(r.stats.con.enhanced).toBe('6');
    expect(r.statPoints).toBe('3');
    expect(assignStatPoints(d, { str: 7 })).toBeNull();
    expect(assignStatPoints(d, {})).toBeNull();
  });
});

describe('lifting limit', () => {
  it('is shown in kg, rounded to 5', () => {
    const d = newSheet();
    d.stats.str.enhanced = '3';
    expect(derive(d).liftKg).toBe(20);
    d.stats.str.enhanced = '6';
    expect(derive(d).liftKg).toBe(40);
    d.stats.str.enhanced = '20';
    expect(derive(d).liftKg).toBe(135);
  });
});

describe('move & step', () => {
  it('are automatic: 20/10 ft, +5 Move with Running Rank 5, halved when Fatigued', () => {
    const d = newSheet();
    expect([derive(d).move, derive(d).step, derive(d).moveMod]).toEqual([20, 10, 2]);
    d.skills = [...d.skills, { ...d.skills[0], name: 'Running', rank: '5', category: 'utility', subtype: 'unopposed' }];
    expect(derive(d).move).toBe(25);
    d.debuffList = [{ id: 'fatigued', stacks: 1, note: '' }];
    expect(derive(d).moveEffective).toBe(12);
    d.evade.move = '45';
    expect(derive(d).move).toBe(45);
  });
  it('old sheets with the written defaults become automatic', () => {
    const s = loadSheet({ schema: 4, name: 'Old', evade: { move: '20', step: '10', dexMod: '', buffs: '' } });
    expect([s.evade.move, s.evade.step, s.schema]).toEqual(['', '', SCHEMA_VERSION]);
    const t = loadSheet({ schema: 4, name: 'Fast', evade: { move: '30', step: '10', dexMod: '', buffs: '' } });
    expect(t.evade.move).toBe('30');
  });
});

describe('items (schema 6)', () => {
  it('old free-text gear becomes equipped items, nothing lost', () => {
    const s = loadSheet({
      schema: 5,
      name: 'Gear',
      gear: {
        head: 'Hard hat',
        torso: '',
        arms: '',
        hands: 'Tire Iron\nShield',
        legs: '',
        feet: '',
        accessories: 'Ring\nAmulet',
      },
      inventory: [{ item: 'Torch', qty: '2', notes: '' }],
    });
    const worn = s.inventory.filter((i) => i.slot);
    expect(worn.map((i) => [i.item, i.slot])).toEqual([
      ['Hard hat', 'head'],
      ['Tire Iron', 'hands'],
      ['Shield', 'hands'],
      ['Ring', 'accessory'],
      ['Amulet', 'accessory'],
    ]);
    expect(s.inventory.find((i) => i.item === 'Torch')?.qty).toBe('2');
    expect(new Set(s.inventory.map((i) => i.id)).size).toBe(s.inventory.length);
    expect(s.gear.hands).toBe('');
  });

  it('equipped DR and Evade bonuses count in the totals, carried ones do not', () => {
    const s = loadSheet({ schema: 6, name: 'X', dr: { armor: '1', buffs: '', aiFavor: '', size: '' } });
    const armor = { ...emptyItem(), item: 'Plate', bonus: { ...emptyItem().bonus, dr: '3', evade: '-1' } };
    const carried = derive({ ...s, inventory: [armor] });
    expect(carried.drTotal).toBe(1);
    const worn = derive({ ...s, inventory: [{ ...armor, slot: 'torso' }] });
    expect(worn.drTotal).toBe(4);
    expect(worn.gearDr.from).toEqual([{ name: 'Plate', value: 3 }]);
  });
});

describe('shared item helpers', async () => {
  const { addItems, damageBonusFor } = await import('../../shared/items.js');
  it('stacks same items, keeps unique and different ones apart', () => {
    let inv = addItems([emptyItem()], [{ item: 'Torch', qty: '2' }]);
    inv = addItems(inv, [
      { item: 'torch', qty: '3' },
      { item: 'Torch', rarity: 'gold' },
      { item: 'Crown', unique: true },
    ]);
    inv = addItems(inv, [{ item: 'Crown', unique: true }]);
    expect(inv.map((i) => [i.item, i.qty, i.rarity])).toEqual([
      ['Torch', '5', ''],
      ['Torch', '1', 'gold'],
      ['Crown', '1', ''],
      ['Crown', '1', ''],
    ]);
  });
  it('weapon damage bonus applies to its skill (or any weapon attack when untied)', () => {
    const inv = [
      {
        ...emptyItem(),
        item: 'Sword +2',
        type: 'weapon' as const,
        slot: 'hands' as const,
        skill: 'Swords',
        bonus: { ...emptyItem().bonus, damage: '+2' },
      },
      {
        ...emptyItem(),
        item: 'Brass knuckles',
        type: 'weapon' as const,
        slot: 'hands' as const,
        bonus: { ...emptyItem().bonus, damage: '1' },
      },
    ];
    expect(damageBonusFor(inv, 'Swords').total).toBe(3);
    expect(damageBonusFor(inv, 'Clubs').total).toBe(1);
    expect(damageBonusFor(inv, 'Magic Missile', true).total).toBe(0);
  });
});

describe('combat rules (shared/combat.js)', () => {
  it('degrees of Success and Failure', async () => {
    const { degreeOf } = await import('../../shared/combat.js');
    expect(degreeOf(30, 20, 40)).toBe('crit');
    expect(degreeOf(30, 1, 5)).toBe('critFail');
    expect(degreeOf(25, 10, 15)).toBe('amazing');
    expect(degreeOf(15, 10, 15)).toBe('success');
    expect(degreeOf(13, 10, 15)).toBe('nearMiss');
    expect(degreeOf(10, 10, 15)).toBe('fail');
    expect(degreeOf(5, 5, 15)).toBe('majorFail');
    expect(degreeOf(12, 12, null)).toBe(null);
  });
  it('Critical Hit doubles the dice, not the modifiers', async () => {
    const { doubleDice } = await import('../../shared/combat.js');
    expect(doubleDice('1d10+2d10+5')).toBe('2d10+4d10+5');
    expect(doubleDice('d6+2')).toBe('2d6+2');
  });
  it('rests end "until a rest" effects; a quick mend does not', () => {
    const d = loadSheet({
      effects: [
        { id: 'a', kind: 'buff', name: 'Blessed', effect: '', duration: 'rest', rounds: 0 },
        { id: 'b', kind: 'buff', name: 'Lucky', effect: '', duration: 'manual', rounds: 0 },
      ],
    });
    expect(rest(d, 'mend').effects).toHaveLength(2);
    expect(rest(d, 'short').effects.map((e) => e.name)).toEqual(['Lucky']);
  });
  it('item effects from their description', async () => {
    const { itemEffect } = await import('../../shared/combat.js');
    expect(itemEffect('Heals 7 HB slots and mends one Minor Injury')).toEqual({ type: 'heal', amount: 7 });
    expect(itemEffect('Fully restores Mana (1 Action to drink)')).toEqual({ type: 'manaFull' });
    expect(itemEffect('Restores 15 Mana per round for 10 rounds')).toBe(null);
  });
});

describe('Hotlist slots', () => {
  it('migrates quick-access items into slots (the one named in a slot goes there) and syncs on load', () => {
    const potion = { ...emptyItem(), id: 'pot', item: 'Mana Potion', qty: '3', hot: true };
    const rope = { ...emptyItem(), id: 'rope', item: 'Rope', qty: '1', hot: true };
    const torch = { ...emptyItem(), id: 'torch', item: 'Torch', qty: '2' };
    const hotlist = ['Heal · 2 Mana', 'Mana Potion ×3', '', '', '', '', '', '', '', ''];
    const d = loadSheet({ schema: 6, hotlist, inventory: [rope, potion, torch] });
    expect(d.hotSlots.slice(0, 3)).toEqual(['', 'pot', 'rope']);
    expect(d.hotlist[1]).toBe('');
    expect(d.hotlist[0]).toBe('Heal · 2 Mana');
    expect(d.inventory.find((i) => i.id === 'torch')!.hot).toBe(false);
    // a slot pointing at an item that's gone is emptied on load
    const gone = loadSheet({ ...d, inventory: d.inventory.filter((i) => i.id !== 'rope') });
    expect(gone.hotSlots[2]).toBe('');
  });
  it('assigns, moves and toggles items', async () => {
    const { setHotSlot, toggleHot } = await import('../../shared/items.js');
    const inv = [
      { ...emptyItem(), id: 'a', item: 'A', qty: '1' },
      { ...emptyItem(), id: 'b', item: 'B', qty: '1' },
    ];
    const empty = Array(10).fill('');
    let r = setHotSlot(inv, empty, 4, 'a');
    expect(r.hotSlots[4]).toBe('a');
    expect(r.inventory[0].hot).toBe(true);
    r = setHotSlot(r.inventory, r.hotSlots, 1, 'a'); // moves, never in two slots
    expect(r.hotSlots.filter((x) => x === 'a')).toHaveLength(1);
    expect(r.hotSlots[1]).toBe('a');
    r = toggleHot(r.inventory, r.hotSlots, ['first', '', '', '', '', '', '', '', '', ''], 'b', true);
    expect(r.hotSlots[2]).toBe('b'); // slot 1 has text, slot 2 holds 'a'
    r = toggleHot(r.inventory, r.hotSlots, [], 'b', false);
    expect(r.hotSlots.includes('b')).toBe(false);
    expect(r.inventory[1].hot).toBe(false);
  });
});

describe('Stat bonuses from gear', () => {
  it('equipped items add to the Enhanced score and its Mod', () => {
    const ring = { ...emptyItem(), id: 'r', item: 'Silver Ring', qty: '1', slot: 'accessory' as const };
    ring.bonus = { ...ring.bonus, dex: '2' };
    const carried = { ...emptyItem(), id: 'c', item: 'Spare Ring', qty: '1' };
    carried.bonus = { ...carried.bonus, dex: '5' };
    const d = loadSheet({ stats: { dex: { enhanced: '4', unenhanced: '4', mod: '' } }, inventory: [ring, carried] });
    const der = derive(d);
    expect(der.score.dex).toBe(6);
    expect(der.gearStats.dex.from).toEqual([{ name: 'Silver Ring', value: 2 }]);
    expect(der.modAuto.dex).toBe(
      derive(loadSheet({ stats: { dex: { enhanced: '6', unenhanced: '6', mod: '' } } })).modAuto.dex,
    );
  });
});
