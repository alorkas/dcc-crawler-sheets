export function resolveNum(value: string | number | undefined | null, floor: number): number | null;
export function damageDice(
  text: string | undefined | null,
  floor: number,
  mods?: Partial<Record<'str' | 'int' | 'con' | 'dex' | 'cha', string | number>>,
): string | null;
type AttackText = { range?: string; damage?: string; effect?: string } | null | undefined;
export function isAreaAttack(attack: AttackText): boolean;
export function hasSplash(attack: AttackText): boolean;
export function damageFactor(o?: { area?: boolean; splash?: boolean; evaded?: boolean }): number;
