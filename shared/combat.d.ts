export type Degree = 'crit' | 'amazing' | 'success' | 'nearMiss' | 'fail' | 'majorFail' | 'critFail';
export type EffectKind = 'buff' | 'debuff' | 'advantage' | 'disadvantage';
export type Duration = 'rounds' | 'combat' | 'rest' | 'manual';
export type Effect = {
  id: string;
  kind: EffectKind;
  name: string;
  effect: string;
  duration: Duration;
  /** Rounds left (when duration is 'rounds'). */
  rounds: number;
  /** Advantage earned against one opponent (Natural 20 / Amazing Success on an Evade). */
  vsOpponent?: number;
  source?: string;
};
export function degreeOf(total: number, natural: number | null, dc: number | null | undefined): Degree | null;
export function isSuccess(degree: Degree | null | undefined): boolean;
export function doubleDice(expr: string): string;
export const EFFECT_KINDS: EffectKind[];
export const DURATIONS: Duration[];
export function newEffectId(): string;
export function cleanEffect(raw: unknown): Effect;
export function tickRound<T extends object>(data: T): { data: T; ended: string[] };
export function endCombat<T extends object>(data: T): { data: T; ended: string[] };
export function clearRestEffects<T extends object>(data: T): T;
export function addDebuffTo<T extends { id: string }>(list: T[], id: string): T[];
export function itemEffect(
  notes: string,
): { type: 'heal'; amount: number } | { type: 'manaFull' } | { type: 'mana'; amount: number } | null;

export type RollKind = 'check' | 'attack' | 'evade';
export type RollMode = 'normal' | 'adv' | 'dis';
export function debuffDisadvantage(list: { id: string }[] | undefined, kind: RollKind): string[];
export function usedUpBy(list: { id: string }[] | undefined, kind: RollKind): string[];
export function dropDebuffs<T extends { id: string }>(list: T[] | undefined, ids: string[]): T[];
export function isWoozy(list: { id: string }[] | undefined): boolean;
export function rollMode(adv: number | boolean, dis: number | boolean): RollMode;
export function withRollMode(expr: string, mode: RollMode): string;
