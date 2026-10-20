import { describe, expect, it } from 'vitest';
import { skillEs, skillsInTextEs } from '../../shared/namesEs.js';
import { generateItem, makeRng } from '../../shared/lootgen.js';

describe('Spanish names', () => {
  it('translates public skills, also inside brackets and texts', () => {
    expect(skillEs('Club')).toBe('Porra');
    expect(skillEs('Tire Iron (Club)')).toBe('Tire Iron (Porra)');
    expect(skillEs('Wrasslin’')).toBe('Lucha Libre de Barrio');
    expect(skillEs('Something Else')).toBe('');
    expect(skillsInTextEs('+2 a Lockpicking y Stealth')).toBe('+2 a Ganzúas y Sigilo');
  });
  it('generated weapons name the skill in Spanish', () => {
    const rng = makeRng(7);
    for (let i = 0; i < 40; i++) {
      const it = generateItem({ kind: 'weapon', floor: 3, rng });
      expect(it.notes).not.toMatch(/Cuenta como (Club|Axe|Dagger|Longsword|Bow|Crossbow)\b/);
    }
  });
});
