export type ItemType =
  '' | 'equipment' | 'accessory' | 'consumable' | 'ammunition' | 'special' | 'crafting' | 'corpse' | 'other';
export type Rarity = '' | 'common' | 'bronze' | 'silver' | 'gold' | 'platinum' | 'legendary' | 'celestial' | 'unique';
export type BodyPart = 'head' | 'shoulders' | 'chest' | 'bracers' | 'hands' | 'back' | 'waist' | 'pants' | 'feet';
export type Fits = '' | BodyPart | 'held' | 'neck' | 'finger';
/** A slot id like 'eq.head.1', 'eq.mainHand.1' or 'acc.finger.3'. */
export type GearSlot = string;
export type SlotInfo = { id: string; key: string; part: string; kind: 'eq' | 'acc'; n: number };
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
  fits: Fits;
  twoHanded: boolean;
  ranged: boolean;
  ammo: string;
  ammoType: string;
  charges: string;
  maxCharges: string;
  ability: string;
  bonus: Record<BonusKey, string>;
  curse: Curse | null;
};
export type Curse = { text: string; bonus: Partial<Record<BonusKey, string>>; revealed: boolean };
export type BonusKey = 'damage' | 'dr' | 'evade' | 'str' | 'int' | 'con' | 'dex' | 'cha';
export const BONUS_KEYS: BonusKey[];
export const STAT_BONUS_KEYS: ('str' | 'int' | 'con' | 'dex' | 'cha')[];
export type BonusFrom = { total: number; from: { name: string; value: number }[] };

export const ITEM_TYPES: Exclude<ItemType, ''>[];
export const RARITIES: Exclude<Rarity, ''>[];
export const BODY_PARTS: BodyPart[];
export const EQUIP_FITS: Exclude<Fits, '' | 'neck' | 'finger'>[];
export const ACCESSORY_FITS: Exclude<Fits, '' | 'held'>[];
export const DEFAULT_SLOT_COUNTS: Record<string, number>;
export const SLOT_KEYS: string[];
export function isWorn(type: string): boolean;
export function slotList(slotCounts: Record<string, number | string> | undefined): SlotInfo[];
export function slotKeyOf(id: string): string;
export function fitsSlot(it: Partial<Item> | undefined, slot: string): boolean;
export function isHeld(it: Partial<Item> | undefined): boolean;
export function sanitizeEquipped(inventory: Item[], slotCounts: Record<string, number | string> | undefined): Item[];
export function equipItem(inventory: Item[], itemId: string, slotId: string): Item[];
export function hotlistable(it: Partial<Item> | undefined): boolean;
export function ammoFor(inventory: Item[], hotSlots: string[], weapon: Partial<Item> | null): Item[];
export function weaponFor(inventory: Item[], skillName: string): Item | null;
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
export const SPELL_REF: string;
export function isSpellRef(id: string | undefined): boolean;
export function spellRef(name: string): string;
export function isHealSpell(name: string): boolean;
export function hotlistSpells<S extends { category: string; name: string }>(skills: S[]): S[];
export function dropMissingSpells(hotSlots: string[], skills: { category: string; name: string }[]): string[];
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
export function spendOne(
  inventory: Item[],
  hotSlots: string[],
  itemId: string,
): { inventory: Item[]; hotSlots: string[]; left: number; charges: number | null } | null;
export const CURSE_MARK: string;
export function applyCurse<T extends Partial<Item>>(it: T): T;
export function removeCurse<T extends Partial<Item>>(it: T): T;
export function isStuck(it: Partial<Item> | undefined): boolean;
export function hideCurses<T>(data: T): T;
export function mergeCurses(
  stored: Item[],
  incoming: Item[],
  isAdmin: boolean,
): { inventory: Item[]; revealed: string[]; changed: boolean };
export function isGoldItem(it: Partial<Item> | undefined | null): boolean;
export function splitGold<T extends Partial<Item>>(items: T[]): { gold: number; items: T[] };
export function goldOf(data: { gold?: string | number } | null | undefined): number;
export function spellBookSpell(itemName: string | undefined | null): string;
