export type ItemType = '' | 'weapon' | 'armor' | 'accessory' | 'consumable' | 'material' | 'lootbox' | 'quest' | 'misc';
export type Rarity = '' | 'common' | 'bronze' | 'silver' | 'gold' | 'platinum' | 'legendary' | 'celestial' | 'unique';
export type GearSlot = 'head' | 'torso' | 'arms' | 'hands' | 'legs' | 'feet' | 'accessory';
export type Item = {
  id: string;
  item: string;
  qty: string;
  /** Description / effects. */
  notes: string;
  type: ItemType;
  rarity: Rarity;
  /** Never stacks with other copies. */
  unique: boolean;
  /** Equipped in this gear slot ('' = carried). */
  slot: GearSlot | '';
  /** Quick access (hotlist) in combat. */
  hot: boolean;
  /** Weapon skill it's used with (its damage bonus applies to that attack). */
  skill: string;
  upgrades: string;
  bonus: Record<BonusKey, string>;
};
export type BonusKey = 'damage' | 'dr' | 'evade' | 'str' | 'int' | 'con' | 'dex' | 'cha';
export const BONUS_KEYS: BonusKey[];
export const STAT_BONUS_KEYS: ('str' | 'int' | 'con' | 'dex' | 'cha')[];
export type BonusFrom = { total: number; from: { name: string; value: number }[] };

export const ITEM_TYPES: Exclude<ItemType, ''>[];
export const RARITIES: Exclude<Rarity, ''>[];
export const GEAR_SLOTS: GearSlot[];
export const SLOT_LIMITS: Record<GearSlot, number>;
export function newItemId(): string;
export function emptyItem(): Item;
export function isBlankItem(it: Partial<Item> | undefined): boolean;
export function ensureIds<T extends { id?: string }>(list: T[]): T[];
export function sameKind(a: Partial<Item>, b: Partial<Item>): boolean;
export function addItems(inventory: Item[], items: Partial<Item>[]): Item[];
export function equipped(inventory: Item[]): Item[];
export function gearBonus(inventory: Item[], key: BonusKey): BonusFrom;
export function damageBonusFor(inventory: Item[], skillName: string, isSpell?: boolean): BonusFrom;
export const HOT_SLOTS: number;
export function syncHot(inventory: Item[], hotSlots: string[]): { inventory: Item[]; hotSlots: string[] };
export function setHotSlot(
  inventory: Item[],
  hotSlots: string[],
  slot: number,
  itemId: string,
): { inventory: Item[]; hotSlots: string[] };
export function toggleHot(
  inventory: Item[],
  hotSlots: string[],
  hotlistText: string[],
  itemId: string,
  on: boolean,
): { inventory: Item[]; hotSlots: string[] };
