import type { Skill } from '../src/lib/sheet';

type SkillLike = Partial<Skill> & { name?: string; rank?: string };
export function findSkill(skills: SkillLike[] | undefined, ...names: string[]): SkillLike | null;
export function skillRank(skills: SkillLike[] | undefined, ...names: string[]): number;
export function rankDie(rank: number | string): string;
export function dodgeOf(skills: SkillLike[] | undefined): {
  rank: number;
  evade: number;
  advVsRanged: boolean;
  freeEvade: boolean;
  extraStep: boolean;
};
export function isRangedAttack(attack: { range?: string; name?: string } | undefined): boolean;
export function tauntCount(degree: string | null | undefined): number;
export function tauntPerks(rank: number | string): { range: number; freeEvade: boolean; advantage: boolean };
export function catcherPerks(rank: number | string): { dr: number; ignoreDebuffs: boolean };
export const BOOK_EFFECTS: Record<string, { attacks: string[]; at: (rank: number) => Record<string, unknown> }>;
export function isDamageEffect(s: SkillLike | undefined): boolean;
export function effectsFor<T extends SkillLike>(skills: T[] | undefined, attack: SkillLike | undefined): T[];
export type EffectSpec = {
  name: string;
  rank: number;
  add: string[];
  flat: number;
  rankDice: number;
  rankDie: string;
  multBase: number;
  multTotal: number;
  atOrBelow: number | null;
  addStr: boolean;
  debuffs: string[];
  stunInstead: boolean;
  canStunInstead: boolean;
  sameSize: boolean;
  oncePerRound: boolean;
  cooldownHours: number;
  note: string;
  tossFeet: number;
  usable: boolean;
  why?: 'cooldown' | 'oncePerRound' | 'targetTooHealthy';
  waitHours?: number;
};
export function effectSpec(
  skill: SkillLike,
  ctx?: {
    targetPct?: number;
    sameSize?: boolean;
    stunInstead?: boolean;
    now?: number;
    readyAt?: number;
    usedThisRound?: boolean;
  },
): EffectSpec;
export function withEffectDice(baseExpr: string | null, spec: EffectSpec | null, strMod?: number): string | null;
export function effectRankDice(spec: EffectSpec | null): string;
export function multApplies(spec: EffectSpec | null, targetPct: number | undefined): boolean;

export type RankUpgrades = { add: string[]; rankDice: number; rankDie: string };
export function rankUpgrades(
  skill: { category?: string; subtype?: string; name?: string; rank?: string | number; notes?: string } | null,
): RankUpgrades;
export function upgradeDice(up: RankUpgrades | null): { base: string; rank: string };
