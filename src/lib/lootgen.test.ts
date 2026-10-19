import { describe, expect, it } from 'vitest';
import {
  agree,
  combinations,
  generateItem,
  makeRng,
  PREFIXES,
  QUALITIES,
  qualityOdds,
  ROLES,
  THEMES,
} from '../../shared/lootgen.js';
import { itemEffect } from '../../shared/combat.js';
import { fitsSlot } from '../../shared/items.js';

const affixes = (it: ReturnType<typeof generateItem>) =>
  [it.gen.prefix, it.gen.role, it.gen.theme].filter(Boolean).length;

describe('loot generator', () => {
  it('Spanish agreement for prefixes', () => {
    expect(agree('Sagrado', 'm', 's')).toBe('Sagrado');
    expect(agree('Minúsculo', 'm', 'p')).toBe('Minúsculos');
    expect(agree('Molón', 'f', 'p')).toBe('Molonas');
    expect(agree('Veloz', 'f', 'p')).toBe('Veloces');
    expect(agree('Seductor', 'f', 's')).toBe('Seductora');
    expect(agree('Brillante', 'f', 'p')).toBe('Brillantes');
  });

  it('odds follow the Floor and add up to 1', () => {
    for (const f of [1, 3, 9, 18]) {
      const o = qualityOdds(f);
      expect(Object.values(o).reduce((a, b) => a + b, 0)).toBeCloseTo(1, 6);
    }
    expect(qualityOdds(1).bronze).toBeGreaterThan(qualityOdds(1).gold);
    expect(qualityOdds(12).legendary).toBeGreaterThan(qualityOdds(2).legendary);
  });

  it('affixes by quality: Bronze 0, Silver 1, Gold 2, Platinum+ 3 (mostly); strong affixes only on good items', () => {
    const rng = makeRng(123);
    const usual: Record<string, number> = { bronze: 0, silver: 1, gold: 2, platinum: 3, legendary: 3 };
    for (const q of Object.keys(usual)) {
      const items = Array.from({ length: 300 }, () => generateItem({ quality: q as 'gold', kind: 'armor', rng }));
      const hit = items.filter((it) => affixes(it) === usual[q]).length / items.length;
      expect(hit).toBeGreaterThan(0.75);
    }
    // a Silver item never gets a level 3+ affix
    const level = new Map([...PREFIXES, ...ROLES, ...THEMES].map((a) => [('word' in a ? '' : a.name) || '', a.lvl]));
    for (let i = 0; i < 300; i++) {
      const it = generateItem({ quality: 'silver', rng });
      if (it.gen.role) expect(level.get(it.gen.role)).toBeLessThanOrEqual(1);
      if (it.gen.theme) expect(level.get(it.gen.theme)).toBeLessThanOrEqual(1);
    }
  });

  it('items fit their slots, weapons count as a book skill, consumables work with the app', () => {
    const rng = makeRng(9);
    for (let i = 0; i < 400; i++) {
      const it = generateItem({ floor: 1 + (i % 10), rng });
      expect(it.item.length).toBeGreaterThan(2);
      expect(QUALITIES).toContain(it.rarity);
      if (it.type === 'equipment' || it.type === 'accessory') {
        const slot = it.fits === 'held' ? 'eq.mainHand.1' : `${it.type === 'equipment' ? 'eq' : 'acc'}.${it.fits}.1`;
        expect(fitsSlot(it, slot)).toBe(true);
      }
      if (it.ranged) expect(it.ammo).toBeTruthy();
    }
    const potion = generateItem({ kind: 'consumable', quality: 'gold', rng: makeRng(2) });
    expect(potion.type).toBe('consumable');
    const heals = Array.from({ length: 60 }, () => generateItem({ kind: 'consumable', quality: 'silver', rng })).filter(
      (x) => x.item.startsWith('Poción de Curación'),
    );
    expect(heals.length).toBeGreaterThan(0);
    for (const h of heals) expect(itemEffect(h.notes)?.type).toBe('heal');
  });

  it('a seed repeats the same item; there are millions of names', () => {
    expect(generateItem({ floor: 4, rng: makeRng(77) })).toEqual(generateItem({ floor: 4, rng: makeRng(77) }));
    expect(combinations()).toBeGreaterThan(1_000_000);
    const ring = generateItem({ kind: 'accessory', part: 'finger', quality: 'platinum', rng: makeRng(5) });
    expect(ring.fits).toBe('finger');
    expect(ring.item.split(' ').length).toBeGreaterThan(2);
  });
});
