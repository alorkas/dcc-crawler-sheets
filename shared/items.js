// Structured inventory items, shared by the browser (sheet, gear, sorting) and the server (loot box rewards).

export const ITEM_TYPES = ['weapon', 'armor', 'accessory', 'consumable', 'material', 'lootbox', 'quest', 'misc'];
/** Rarity follows the loot box tiers (Core Rulebook "Loot Boxes"), plus common and unique. */
export const RARITIES = ['common', 'bronze', 'silver', 'gold', 'platinum', 'legendary', 'celestial', 'unique'];
/** Gear slots and how many items each holds (two hands, six accessories). */
export const GEAR_SLOTS = ['head', 'torso', 'arms', 'hands', 'legs', 'feet', 'accessory'];
/** What an equipped item can add: damage, DR, Evade, and the five Stats (to the Enhanced score). */
export const BONUS_KEYS = ['damage', 'dr', 'evade', 'str', 'int', 'con', 'dex', 'cha'];
export const STAT_BONUS_KEYS = ['str', 'int', 'con', 'dex', 'cha'];
export const SLOT_LIMITS = { head: 1, torso: 1, arms: 1, hands: 2, legs: 1, feet: 1, accessory: 6 };

export const newItemId = () => `i${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

export function emptyItem() {
  return {
    id: newItemId(),
    item: '',
    qty: '',
    notes: '',
    type: '',
    rarity: '',
    unique: false,
    slot: '',
    hot: false,
    skill: '',
    upgrades: '',
    bonus: { damage: '', dr: '', evade: '', str: '', int: '', con: '', dex: '', cha: '' },
  };
}

const n = (v) => {
  const m = String(v ?? '').match(/[+-]?\d+/);
  return m ? Number(m[0]) : 0;
};
const norm = (s) =>
  String(s ?? '')
    .trim()
    .toLowerCase();

export const isBlankItem = (it) => !norm(it?.item) && !norm(it?.qty) && !norm(it?.notes);

/** Every item has a distinct id (old sheets had none; copies of a template could share one). */
export function ensureIds(list) {
  const seen = new Set();
  let changed = false;
  const out = (list || []).map((it) => {
    if (it.id && !seen.has(it.id)) {
      seen.add(it.id);
      return it;
    }
    changed = true;
    const id = newItemId() + seen.size;
    seen.add(id);
    return { ...it, id };
  });
  return changed ? out : list;
}

/** Items stack when they are the same thing: same name, type, rarity, bonuses and upgrades, and not unique. */
export function sameKind(a, b) {
  if (a.unique || b.unique || a.rarity === 'unique' || b.rarity === 'unique') return false;
  return (
    norm(a.item) === norm(b.item) &&
    norm(a.type) === norm(b.type) &&
    norm(a.rarity) === norm(b.rarity) &&
    norm(a.upgrades) === norm(b.upgrades) &&
    norm(a.skill) === norm(b.skill) &&
    BONUS_KEYS.every((k) => n(a.bonus?.[k]) === n(b.bonus?.[k]))
  );
}

/**
 * Add items to an inventory (e.g. loot box contents): a stackable item that is already there (and not equipped)
 * gets its quantity raised; anything else gets its own row (filling an empty row first).
 */
export function addItems(inventory, items) {
  let inv = [...(inventory || [])];
  for (const raw of items) {
    const add = { ...emptyItem(), ...raw, bonus: { ...emptyItem().bonus, ...(raw.bonus || {}) } };
    const qty = Math.max(1, n(add.qty) || 1);
    const i = inv.findIndex((x) => !x.slot && !isBlankItem(x) && sameKind(x, add));
    if (i >= 0) {
      inv[i] = { ...inv[i], qty: String((n(inv[i].qty) || 1) + qty) };
      continue;
    }
    const row = { ...add, id: newItemId(), qty: String(qty), slot: '' };
    const blank = inv.findIndex((x) => isBlankItem(x));
    if (blank >= 0) inv[blank] = row;
    else inv = [...inv, row];
  }
  return inv;
}

export const equipped = (inventory) => (inventory || []).filter((it) => it.slot && !isBlankItem(it));

/** Sum of one bonus over the equipped items, with the items that give it (for breakdowns). */
export function gearBonus(inventory, key) {
  const from = [];
  let total = 0;
  for (const it of equipped(inventory)) {
    const v = n(it.bonus?.[key]);
    if (v) {
      total += v;
      from.push({ name: it.item, value: v });
    }
  }
  return { total, from };
}

/**
 * Damage bonus from equipped gear for an attack skill: items tied to that skill (by name), plus weapons
 * held in the hands without a skill set (they count for every weapon attack, not for spells).
 */
export function damageBonusFor(inventory, skillName, isSpell = false) {
  const from = [];
  let total = 0;
  const s = norm(skillName);
  for (const it of equipped(inventory)) {
    const v = n(it.bonus?.damage);
    if (!v) continue;
    const tied = norm(it.skill);
    const applies = tied ? s && (s.includes(tied) || tied.includes(s)) : !isSpell && it.type === 'weapon';
    if (applies) {
      total += v;
      from.push({ name: it.item, value: v });
    }
  }
  return { total, from };
}

/* ---------------- the Hotlist: 10 quick-access slots holding inventory items ---------------- */
export const HOT_SLOTS = 10;

/**
 * Keep the Hotlist and the items in line: a slot only points at an item that still exists (and isn't empty), and
 * an item's `hot` flag says whether it sits in a slot. Returns the same objects when nothing changed.
 */
export function syncHot(inventory, hotSlots) {
  const inv = inventory || [];
  const ids = new Set(inv.filter((it) => !isBlankItem(it)).map((it) => it.id));
  const seen = new Set();
  const slots = Array.from({ length: HOT_SLOTS }, (_, i) => {
    const id = (hotSlots || [])[i] || '';
    if (!id || !ids.has(id) || seen.has(id)) return '';
    seen.add(id);
    return id;
  });
  const sameSlots = slots.every((id, i) => id === ((hotSlots || [])[i] || '')) && (hotSlots || []).length === HOT_SLOTS;
  let changed = false;
  const nextInv = inv.map((it) => {
    const hot = seen.has(it.id);
    if (!!it.hot === hot) return it;
    changed = true;
    return { ...it, hot };
  });
  return { inventory: changed ? nextInv : inventory, hotSlots: sameSlots ? hotSlots : slots };
}

/** Put an item in a Hotlist slot ('' empties the slot). An item sits in one slot at most. */
export function setHotSlot(inventory, hotSlots, slot, itemId) {
  const slots = Array.from({ length: HOT_SLOTS }, (_, i) => (hotSlots || [])[i] || '');
  for (let i = 0; i < slots.length; i++) if (itemId && slots[i] === itemId) slots[i] = '';
  if (slot >= 0 && slot < HOT_SLOTS) slots[slot] = itemId || '';
  return syncHot(inventory, slots);
}

/** Add an item to the first free Hotlist slot (one without an item or text); or take it off the Hotlist. */
export function toggleHot(inventory, hotSlots, hotlistText, itemId, on) {
  const slots = Array.from({ length: HOT_SLOTS }, (_, i) => (hotSlots || [])[i] || '');
  if (!on)
    return syncHot(
      inventory,
      slots.map((id) => (id === itemId ? '' : id)),
    );
  if (slots.includes(itemId)) return syncHot(inventory, slots);
  let free = slots.findIndex((id, i) => !id && !String((hotlistText || [])[i] ?? '').trim());
  if (free < 0) free = slots.findIndex((id) => !id);
  if (free < 0) return syncHot(inventory, slots);
  return setHotSlot(inventory, slots, free, itemId);
}
