import { describe, expect, it } from 'vitest';
import {
  ADJECTIVES,
  agree,
  BASES,
  changePart,
  combinations,
  generateBox,
  generateItem,
  glue,
  makeRng,
  PREFIXES,
  QUALITIES,
  qualityOdds,
  rerollItem,
  ROLES,
  THEMES,
} from '../../shared/lootgen.js';
import { itemEffect } from '../../shared/combat.js';
import { applyCurse, fitsSlot, hideCurses, mergeCurses, removeCurse } from '../../shared/items.js';
import { emptyItem, type Item } from './sheet';

const affixes = (it: ReturnType<typeof generateItem>) =>
  [it.gen.adjective, it.gen.role, it.gen.theme].filter(Boolean).length;

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
    const level = new Map([...ROLES, ...THEMES].map((a) => [a.name, a.lvl]));
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

describe('loot generator: prefixes, locks, boxes', () => {
  it('three times the content', () => {
    expect(BASES.length).toBeGreaterThan(400);
    expect(ADJECTIVES.length).toBeGreaterThan(200);
    expect(ROLES.length).toBeGreaterThan(120);
    expect(THEMES.length).toBeGreaterThan(195);
    expect(PREFIXES.map((p) => p.word)).toEqual(
      expect.arrayContaining(['Mini', 'Maxi', 'Flexi', 'Turbo', 'Puto', 'Sexy', 'Porno', 'Mega', 'Macro', 'Sacro']),
    );
    expect(PREFIXES.map((p) => p.word)).toEqual(
      expect.arrayContaining(['Anti', 'Sub', 'Extra', 'Bi', 'Poli', 'Archi', 'Hiper', 'Uni']),
    );
  });

  it('prefixes are written like Spanish words', () => {
    expect(glue('Turbo', 'Brazales')).toBe('Turbobrazales');
    expect(glue('Mini', 'Rodilleras')).toBe('Minirrodilleras');
    expect(glue('Mega', 'Gafas de Sol')).toBe('Megagafas de Sol');
    const rng = makeRng(4);
    const puta = generateItem({ fixed: { prefix: 'Puto', base: 'Capa', quality: 'silver' }, rng });
    expect(puta.item.startsWith('Puta Capa')).toBe(true);
    const turbo = generateItem({ fixed: { prefix: 'Turbo', base: 'Brazales', quality: 'gold' }, rng });
    expect(turbo.item.startsWith('Turbobrazales')).toBe(true);
    expect(turbo.notes).toMatch(/pies de Movimiento/);
    // Hiper doubles the numbers
    const plain = generateItem({
      fixed: { prefix: '', base: 'Casco', quality: 'legendary', adjective: 'Fornido', role: '', theme: '' },
      rng,
    });
    const hiper = generateItem({
      fixed: { prefix: 'Hiper', base: 'Casco', quality: 'legendary', adjective: 'Fornido', role: '', theme: '' },
      rng,
    });
    expect(Number(hiper.bonus.str)).toBe(Number(plain.bonus.str) * 2);
  });

  it('locks keep parts on a reroll; one part can be changed or removed', () => {
    const rng = makeRng(8);
    const it = generateItem({ quality: 'platinum', kind: 'armor', rng });
    const again = rerollItem(it.gen, { base: true, adjective: true }, rng);
    expect(again.gen.base).toBe(it.gen.base);
    expect(again.gen.adjective).toBe(it.gen.adjective);
    expect(again.rarity).toBe('platinum');
    const noTheme = changePart(it.gen, 'theme', 'remove');
    expect(noTheme.gen.theme).toBe('');
    expect([noTheme.gen.base, noTheme.gen.adjective, noTheme.gen.role]).toEqual([
      it.gen.base,
      it.gen.adjective,
      it.gen.role,
    ]);
    const otherRole = changePart(it.gen, 'role', 'reroll', rng);
    expect(otherRole.gen.role).not.toBe(it.gen.role);
    expect(otherRole.gen.role).not.toBe('');
  });

  it('boxes fit their kind', () => {
    const rng = makeRng(13);
    const crafter = generateBox({ tier: 'silver', kind: 'crafter', rng });
    expect(crafter.items.filter((x) => x.type === 'crafting').length).toBeGreaterThanOrEqual(3);
    const assassin = generateBox({ tier: 'gold', kind: 'assassin', rng });
    expect(['Dagger', 'Shuriken', 'Crossbow', 'Rapier']).toContain(assassin.items[0].skill);
    const boss = generateBox({ tier: 'gold', kind: 'boss', rng });
    expect(boss.items.length).toBeGreaterThanOrEqual(3);
    expect(boss.gold).toBeGreaterThanOrEqual(300);
  });

  it('curses: hidden from players, revealed when equipped, then stuck', () => {
    const cursed = generateItem({ fixed: { curse: '*', base: 'Anillo', quality: 'gold' }, rng: makeRng(2) });
    expect(cursed.curse?.revealed).toBe(false);
    const it: Item = { ...emptyItem(), ...cursed, id: 'c1', slot: '' } as Item;
    expect(hideCurses({ inventory: [it] }).inventory[0].curse).toBe(null);
    // the player's copy has no curse; equipping it reveals it
    const mine = { ...it, curse: null, slot: 'acc.finger.1' };
    const saved = mergeCurses([it], [mine], false);
    expect(saved.revealed).toEqual([it.item]);
    expect(saved.inventory[0].curse?.revealed).toBe(true);
    expect(saved.inventory[0].notes).toMatch(/Maldito/);
    // now it can't be taken off or thrown away
    const off = mergeCurses(saved.inventory, [{ ...saved.inventory[0], slot: '' }], false);
    expect(off.inventory[0].slot).toBe('acc.finger.1');
    expect(mergeCurses(saved.inventory, [], false).inventory).toHaveLength(1);
    // the GM can; lifting the curse takes its penalties back
    expect(mergeCurses(saved.inventory, [{ ...saved.inventory[0], slot: '' }], true).inventory[0].slot).toBe('');
    const lifted = removeCurse(saved.inventory[0]);
    expect(lifted.curse).toBe(null);
    expect(lifted.bonus).toEqual(it.bonus);
    expect(applyCurse(lifted)).toBe(lifted);
  });
});
