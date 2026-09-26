import { describe, expect, it } from 'vitest';
import {
  HUMAN_TABLES,
  ANIMAL_TABLES,
  buildSheet,
  emptyChoices,
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
    expect(s.gear.hands).toBe('Tire Iron (Club)');
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
    expect(s.hotlist.join(' ')).toContain('Mana Potion');
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
