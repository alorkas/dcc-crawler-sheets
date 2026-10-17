import { describe, expect, it } from 'vitest';
import {
  HUMAN_TABLES,
  ANIMAL_TABLES,
  buildSheet,
  emptyChoices,
  emptyThird,
  buildFromPregen,
  pregenSkills,
  type Pregen,
  rollBoosts,
  rollFavor,
  namesToLookUp,
  randomCrawlerNumber,
  rollStat,
  validate,
  type Choices,
} from './creation';
import type { CatalogHit } from './api';

function human(): Choices {
  const c = emptyChoices();
  c.name = 'Carl';
  c.gender = 'He/him';
  c.crawlerNumber = '4122';
  // pick the first two skills of the first background in each table, avoiding duplicates
  const used = new Set<string>();
  for (const tb of HUMAN_TABLES) {
    const bg = tb.backgrounds.find((b) => b.skills.filter((s) => !used.has(s.name)).length >= 2)!;
    const picks = bg.skills
      .filter((s) => !used.has(s.name))
      .slice(0, 2)
      .map((s) => s.name);
    picks.forEach((p) => used.add(p));
    c.backgrounds[tb.id] = { bg: bg.id, picks };
  }
  c.combat = { kind: 'weapon', skill: 'Club', label: 'Tire Iron (Club)' };
  c.stats = { str: 6, int: 3, con: 5, dex: 4, cha: 2 };
  c.gear = { clothing: 'Boxers', weapon: 'Tire Iron (Club)', item: 'Lighter', weird: 'A googly eye' };
  return c;
}

describe('creation tables', () => {
  it('have the right dice and ranks', () => {
    expect(HUMAN_TABLES.map((t) => [t.id, t.die, t.rank])).toEqual([
      ['childhood', 12, 1],
      ['adolescence', 12, 1],
      ['career', 12, 3],
      ['hobby', 12, 2],
    ]);
    expect(ANIMAL_TABLES.every((t) => t.backgrounds.every((b) => b.skills.length === 3))).toBe(true);
  });
  it('rolls in range', () => {
    for (let i = 0; i < 200; i++) {
      const s = rollStat();
      expect(s).toBeGreaterThanOrEqual(2);
      expect(s).toBeLessThanOrEqual(6);
      const n = Number(randomCrawlerNumber());
      expect(n).toBeGreaterThanOrEqual(500_000);
      expect(n).toBeLessThanOrEqual(12_900_000);
    }
  });
});

describe('validate', () => {
  it('accepts a complete human', () => {
    expect(validate(human())).toEqual([]);
  });
  it('flags missing pieces', () => {
    const issues = validate(emptyChoices());
    expect(issues).toEqual(expect.arrayContaining(['basics', 'backgrounds', 'combat', 'stats']));
  });
  it('flags duplicate background skills and combat duplicates', () => {
    // find a skill offered by backgrounds in two different tables
    const c = human();
    let found = false;
    for (const a of HUMAN_TABLES[0].backgrounds) {
      for (const b of HUMAN_TABLES[1].backgrounds) {
        const shared = a.skills.find((s) => b.skills.some((x) => x.name === s.name));
        if (!shared || found) continue;
        const otherA = a.skills.find((s) => s.name !== shared.name)!.name;
        const otherB = b.skills.find((s) => s.name !== shared.name)!.name;
        c.backgrounds.childhood = { bg: a.id, picks: [shared.name, otherA] };
        c.backgrounds.adolescence = { bg: b.id, picks: [shared.name, otherB] };
        found = true;
      }
    }
    expect(found).toBe(true);
    expect(validate(c)).toContain('duplicate');
    // main attack equal to a picked background skill
    const d = human();
    d.combat = { kind: 'weapon', skill: d.backgrounds.hobby.picks[0], label: '' };
    expect(validate(d)).toContain('combatDuplicate');
  });
  it('requires a real standard array and Int 4 for spells', () => {
    const c = human();
    c.stats.cha = 6;
    expect(validate(c)).toContain('stats');
    c.statMethod = 'roll';
    expect(validate(c)).not.toContain('stats');
    c.combat = { kind: 'spell', skill: 'Fire Fingers' };
    expect(validate(c)).toContain('spellInt');
    c.stats.int = 4;
    expect(validate(c)).not.toContain('spellInt');
  });
  it('animals need a species', () => {
    const c = human();
    c.animal = true;
    expect(validate(c)).toContain('basics');
  });
});

describe('buildSheet', () => {
  const clubHit: CatalogHit = {
    kind: 'weapon',
    entry: { name: 'Club', attackType: 'melee', range: 'Melee', baseDamage: '1d6 Bludgeoning', page: 110 },
  };
  it('builds a playable level 1 sheet', () => {
    const s = buildSheet(human(), { Club: clubHit });
    expect(s.name).toBe('Carl');
    expect(s.level).toBe('1');
    expect(s.race).toBe('Human');
    expect(s.stats.str.enhanced).toBe('6');
    expect(s.manaCurrent).toBe('3');
    const names = s.skills.map((k) => k.name);
    expect(names[0]).toBe('Unarmed Combat');
    const weapon = s.skills.find((k) => k.name === 'Tire Iron (Club)')!;
    expect(weapon).toMatchObject({ rank: '3', pinned: true, category: 'combat', subtype: 'bashing' });
    expect(weapon.baseDamage).toBe('1d6 Bludgeoning');
    expect(names).toContain('Heal');
    // 1 unarmed + weapon + 8 background skills + heal
    expect(s.skills).toHaveLength(11);
    const hands = s.inventory.find((i) => i.slot === 'eq.mainHand.1');
    expect(hands?.item).toBe('Tire Iron (Club)');
    expect([hands?.type, hands?.fits, hands?.ranged]).toEqual(['equipment', 'held', false]);
    expect(s.inventory.map((i) => i.item)).toEqual(expect.arrayContaining(['Lighter', 'A googly eye']));
    const career = s.skills.find((k) => k.name === human().backgrounds.career.picks[0])!;
    expect(career.rank).toBe('3');
  });
  it('gives spell casters the spell and mana potions', () => {
    const c = human();
    c.combat = { kind: 'spell', skill: 'Fire Fingers' };
    c.stats.int = 6;
    c.stats.str = 3;
    const s = buildSheet(c, { 'Fire Fingers': { kind: 'spell', entry: { name: 'Fire Fingers', manaCost: '2' } } });
    const spell = s.skills.find((k) => k.name === 'Fire Fingers')!;
    expect(spell).toMatchObject({ category: 'spell', subtype: 'attack', pinned: true, manaCost: '2' });
    // the Mana Potions are an inventory item sitting in Hotlist slot 3
    const potion = s.inventory.find((i) => i.item === 'Standard Mana Potion')!;
    expect(s.hotSlots[2]).toBe(potion.id);
    expect(s.hotSlots[0]).toBe('spell:Fire Fingers');
  });
  it('a ranged weapon starts with 20 Ammunition on the Hotlist', () => {
    const c = human();
    c.combat = { kind: 'weapon', skill: 'Bow', label: 'Hunting Bow (Bow)' };
    c.gear.weapon = 'Hunting Bow (Bow)';
    const s = buildSheet(c, {});
    const bow = s.inventory.find((i) => i.slot === 'eq.mainHand.1')!;
    expect([bow.ranged, bow.ammo]).toEqual([true, 'Flecha']);
    const arrows = s.inventory.find((i) => i.type === 'ammunition')!;
    expect([arrows.item, arrows.qty, arrows.ammoType]).toEqual(['Flechas', '20', 'Flecha']);
    expect(s.hotSlots[3]).toBe(arrows.id);
    expect(s.inventory.find((i) => i.item === 'Boxers')?.slot).toBe('eq.chest.1');
  });
  it('animals get Slice Attack and a size', () => {
    const c = human();
    c.animal = true;
    c.species = 'house cat';
    c.size = 2;
    c.backgrounds = {};
    for (const tb of ANIMAL_TABLES) {
      const bg = tb.backgrounds[0];
      c.backgrounds[tb.id] = { bg: bg.id, picks: [bg.skills[0].name, bg.skills[1].name] };
    }
    const s = buildSheet(c, {});
    expect(s.race).toBe('House Cat');
    expect(s.skills[0].name).toBe('Slice Attack');
    expect(s.dr.size).toBe('Small (2)');
    expect(namesToLookUp(c)[0]).toBe('Slice Attack');
  });
});

describe('Third Floor crawler', () => {
  it('needs its 27 points, the skill roll and the loot row', () => {
    const c = human();
    c.third = emptyThird();
    expect(validate(c)).toContain('third');
    c.third.points = { str: 10, int: 5, con: 5, dex: 5, cha: 2 };
    c.third.boosts = rollBoosts(c);
    c.third.lootRow = 3;
    expect(validate(c)).toEqual([]);
  });
  it('builds a Level 10 sheet with the extra Ranks, Stats, AI Favor, Popularity and loot', () => {
    const c = human();
    c.third = {
      ...emptyThird(),
      points: { str: 10, int: 5, con: 5, dex: 5, cha: 2 },
      boosts: { 'Tire Iron (Club)': 8, 'Unarmed Combat': 2 },
      favor: 3,
      lootRow: 2,
      spells: { weapon: false, armor: false, item: true },
      race: 'Half-Orc',
      cls: 'Brawler',
      experiences: [{ table: 3, text: 'Punched a goose' }, ...emptyThird().experiences.slice(1)],
    };
    const s = buildSheet(c, {});
    expect(s.level).toBe('10');
    expect(s.floor).toBe('3');
    expect(s.race).toBe('Half-Orc');
    expect(s.class).toBe('Brawler');
    expect(s.stats.str.enhanced).toBe('16');
    expect(s.stats.str.unenhanced).toBe('16');
    expect(s.dr.aiFavor).toBe('3');
    expect(s.skills.find((x) => x.name === 'Tire Iron (Club)')!.rank).toBe('10'); // capped
    expect(s.skills.find((x) => x.name === 'Unarmed Combat')!.rank).toBe('5');
    const armor = s.inventory.find((i) => i.item.startsWith('Starting armor'))!;
    expect(armor.rarity).toBe('platinum');
    expect(armor.bonus.dr).toBe('4');
    expect(s.inventory.some((i) => i.item === 'Spells (gold)')).toBe(true);
    expect(s.notes).toContain('[Table 31] Punched a goose');
  });
  it('rolls in range', () => {
    for (let i = 0; i < 100; i++) {
      const f = rollFavor(2);
      expect(f).toBeGreaterThanOrEqual(3);
      expect(f).toBeLessThanOrEqual(6);
      const b = rollBoosts(human());
      expect(b['Tire Iron (Club)']).toBeGreaterThanOrEqual(2);
      expect(b['Tire Iron (Club)']).toBeLessThanOrEqual(7); // 3 + 2d4 capped at 10
    }
  });
});

describe('pre-generated crawlers', () => {
  const p: Pregen = {
    id: 1,
    name: 'Princess Donut (Floor 2)',
    level: '9',
    floor: 2,
    tags: 'Cat',
    size: 'Small (2)',
    slotValue: '3',
    move: '30',
    stats: {
      str: { score: '2', mod: '+1' },
      int: { score: '9', mod: '+4' },
      con: { score: '4', mod: '+2' },
      dex: { score: '8', mod: '+3' },
      cha: { score: '12', mod: '+5' },
    },
    attacks: [{ name: 'Slice Attack', toHit: '', damage: '', range: '', effect: '' }],
    keySkills: 'Magic Missile Spell 5, Slice Attack 4, Dodge 4',
    description: 'A cat.',
    descriptionEs: '',
    source: 'Par for the Course pre-gens',
  };
  it('reads the key skills', () => {
    expect(pregenSkills(p)).toEqual([
      { name: 'Magic Missile', rank: 5 },
      { name: 'Slice Attack', rank: 4 },
      { name: 'Dodge', rank: 4 },
    ]);
  });
  it('builds a sheet', () => {
    const s = buildFromPregen(p, {});
    expect(s.name).toBe('Princess Donut');
    expect([s.level, s.floor, s.race]).toEqual(['9', '2', 'Cat']);
    expect(s.stats.cha.enhanced).toBe('12');
    expect(s.skills.find((x) => x.name === 'Slice Attack')!.pinned).toBe(true);
    expect(s.skills.find((x) => x.name === 'Dodge')!.pinned).toBe(false);
    expect(s.skills.some((x) => x.name === 'Heal')).toBe(true);
  });
});
