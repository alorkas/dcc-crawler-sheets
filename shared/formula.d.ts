export function resolveNum(value: string | number | undefined | null, floor: number): number | null;
export function damageDice(
  text: string | undefined | null,
  floor: number,
  mods?: Partial<Record<'str' | 'int' | 'con' | 'dex' | 'cha', string | number>>,
): string | null;
