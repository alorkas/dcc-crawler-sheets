import type { NpcData, OpponentKind } from './api';

export const NPC_KINDS: OpponentKind[] = ['mob', 'elite', 'boss', 'npc'];
export const NPC_STATS = ['str', 'int', 'con', 'dex', 'cha'] as const;

export const emptyAttack = (): NpcData['attacks'][number] => ({
  name: '',
  toHit: '',
  damage: '',
  range: '',
  effect: '',
});

/** A blank Mob stat block (Core Rulebook "Mob and Boss Stat Blocks"). */
export function emptyNpc(): NpcData {
  return {
    name: '',
    kind: 'mob',
    size: '',
    tags: '',
    slots: '3',
    slotValue: '2',
    level: '',
    surprise: '',
    evade: '',
    move: '',
    dr: '',
    stats: Object.fromEntries(NPC_STATS.map((k) => [k, { score: '', mod: '' }])) as NpcData['stats'],
    attacks: [emptyAttack()],
    notes: '',
    source: '',
    chapter: '',
  };
}

/** Fill in missing fields of stored stat block data. */
export function loadNpc(stored: Partial<NpcData> | undefined): NpcData {
  const base = emptyNpc();
  const d = stored ?? {};
  const str = (v: unknown, fallback: string) => (typeof v === 'string' ? v : fallback);
  return {
    name: str(d.name, base.name),
    kind: NPC_KINDS.includes(d.kind as OpponentKind) ? (d.kind as OpponentKind) : 'mob',
    size: str(d.size, ''),
    tags: str(d.tags, ''),
    slots: str(d.slots, base.slots),
    slotValue: str(d.slotValue, base.slotValue),
    level: str(d.level, ''),
    surprise: str(d.surprise, ''),
    evade: str(d.evade, ''),
    move: str(d.move, ''),
    dr: str(d.dr, ''),
    stats: Object.fromEntries(
      NPC_STATS.map((k) => [k, { score: str(d.stats?.[k]?.score, ''), mod: str(d.stats?.[k]?.mod, '') }]),
    ) as NpcData['stats'],
    attacks: Array.isArray(d.attacks) ? d.attacks.map((a) => ({ ...emptyAttack(), ...a })) : base.attacks,
    notes: str(d.notes, ''),
    source: str(d.source, ''),
    chapter: str(d.chapter, ''),
  };
}

/** Health percentage labels for a Health Bar with `slots` slots (3 → 33%, 67%, 100%). */
export function slotPercents(slots: number): number[] {
  const n = Math.max(1, Math.min(20, Math.floor(slots) || 1));
  return Array.from({ length: n }, (_, i) => Math.round(((i + 1) / n) * 100));
}
