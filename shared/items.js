// Structured inventory items, shared by the browser (sheet, gear, sorting) and the server (loot box rewards).

/**
 * Item categories. Equipment and Accessories are worn in slots (their bonuses apply while equipped, their ability
 * can go on the Hotlist and isn't used up); Consumables are used up; Ammunition feeds ranged weapons; Special items
 * go on the Hotlist and usually aren't used up; Crafting materials, Corpses and Other are just carried.
 */
export const ITEM_TYPES = [
  'equipment',
  'accessory',
  'consumable',
  'ammunition',
  'special',
  'crafting',
  'corpse',
  'other',
];
/** Rarity follows the loot box tiers (Core Rulebook "Loot Boxes"), plus common and unique. */
export const RARITIES = ['common', 'bronze', 'silver', 'gold', 'platinum', 'legendary', 'celestial', 'unique'];
/** What an equipped item can add: damage, DR, Evade, and the five Stats (to the Enhanced score). */
export const BONUS_KEYS = ['damage', 'dr', 'evade', 'str', 'int', 'con', 'dex', 'cha'];
export const STAT_BONUS_KEYS = ['str', 'int', 'con', 'dex', 'cha'];

/* ---------------- body slots ---------------- */
/** Body parts with one Equipment and one Accessory slot each. */
export const BODY_PARTS = ['head', 'shoulders', 'chest', 'bracers', 'hands', 'back', 'waist', 'pants', 'feet'];
/** Where an item can go: Equipment on a body part or held (weapons, shields); Accessories on a body part, the neck or a finger. */
export const EQUIP_FITS = [...BODY_PARTS, 'held'];
export const ACCESSORY_FITS = [...BODY_PARTS, 'neck', 'finger'];
/** Slot kinds and how many each crawler has by default (Races and Classes can change this: `slotCounts`). */
export const DEFAULT_SLOT_COUNTS = {
  ...Object.fromEntries(BODY_PARTS.map((p) => [`eq.${p}`, 1])),
  'eq.mainHand': 1,
  'eq.offHand': 1,
  ...Object.fromEntries(BODY_PARTS.map((p) => [`acc.${p}`, 1])),
  'acc.neck': 1,
  'acc.finger': 10,
};
export const SLOT_KEYS = Object.keys(DEFAULT_SLOT_COUNTS);
export const isWorn = (type) => type === 'equipment' || type === 'accessory';

/** The slots a crawler has: { id: 'acc.finger.3', key: 'acc.finger', part: 'finger', kind: 'acc', n: 3 }. */
export function slotList(slotCounts) {
  const out = [];
  for (const key of SLOT_KEYS) {
    const raw = slotCounts?.[key];
    const count = Math.max(
      0,
      Math.min(20, raw === undefined || raw === '' ? DEFAULT_SLOT_COUNTS[key] : Number(raw) || 0),
    );
    const [kind, part] = key.split('.');
    for (let n = 1; n <= count; n++) out.push({ id: `${key}.${n}`, key, part, kind, n });
  }
  return out;
}
export const slotKeyOf = (id) => String(id || '').replace(/\.\d+$/, '');

/** Can this item go in this slot (by slot id or key)? */
export function fitsSlot(it, slot) {
  const [kind, part] = slotKeyOf(slot).split('.');
  if (kind === 'eq')
    return (
      it?.type === 'equipment' &&
      (it.fits === part || (it.fits === 'held' && (part === 'mainHand' || part === 'offHand')))
    );
  if (kind === 'acc') return it?.type === 'accessory' && it.fits === part;
  return false;
}
export const isHeld = (it) => /^eq\.(mainHand|offHand)\./.test(String(it?.slot || ''));

/**
 * Keep equipped items valid: each in a slot the crawler has, that fits it, one item per slot, and a two-handed
 * weapon leaves the off hand empty. Anything else goes back to being carried. Returns the same list if unchanged.
 */
export function sanitizeEquipped(inventory, slotCounts) {
  const valid = new Set(slotList(slotCounts).map((x) => x.id));
  const taken = new Set();
  let changed = false;
  let out = (inventory || []).map((it) => {
    if (!it?.slot) return it;
    if (!valid.has(it.slot) || !fitsSlot(it, it.slot) || taken.has(it.slot)) {
      changed = true;
      return { ...it, slot: '' };
    }
    taken.add(it.slot);
    return it;
  });
  const twoHanded = out.find((it) => it.slot && it.slot.startsWith('eq.mainHand.') && it.twoHanded);
  if (twoHanded)
    out = out.map((it) => {
      if (!it.slot?.startsWith('eq.offHand.')) return it;
      changed = true;
      return { ...it, slot: '' };
    });
  return changed ? out : inventory;
}

/**
 * Equip an item in a slot ('' = take it off): whatever was in that slot goes back to being carried, and a
 * two-handed weapon in the main hand frees the off hand (and the other way round).
 */
export function equipItem(inventory, itemId, slotId) {
  const target = slotId || '';
  let inv = (inventory || []).map((x) => {
    if (x.id === itemId) return { ...x, slot: target };
    if (target && x.slot === target) return { ...x, slot: '' };
    return x;
  });
  const it = inv.find((x) => x.id === itemId);
  if (it?.twoHanded && target.startsWith('eq.mainHand.'))
    inv = inv.map((x) => (x.slot?.startsWith('eq.offHand.') ? { ...x, slot: '' } : x));
  if (target.startsWith('eq.offHand.'))
    inv = inv.map((x) => (x.twoHanded && x.slot?.startsWith('eq.mainHand.') ? { ...x, slot: '' } : x));
  return inv;
}

/** Can this item go on the Hotlist? Consumables, Ammunition and Special items; Equipment and Accessories with an ability. */
export const hotlistable = (it) =>
  !!it &&
  (['consumable', 'ammunition', 'special'].includes(it.type) || (isWorn(it.type) && !!String(it.ability || '').trim()));

/** Ammunition on the Hotlist that a ranged weapon can fire ("Arrow" matches "Arrows"; a weapon without a type takes any). */
const AMMO_SYNONYMS = { arrow: 'flecha', bolt: 'virote', bullet: 'bala', shell: 'cartucho', stone: 'piedra' };
export function ammoFor(inventory, hotSlots, weapon) {
  const one = (v) => {
    const w = norm(v).replace(/(es|s)$/, '');
    return AMMO_SYNONYMS[w] ?? w;
  };
  const want = one(weapon?.ammo);
  return (hotSlots || [])
    .map((id) => (inventory || []).find((it) => it.id === id))
    .filter((it) => it && it.type === 'ammunition' && (Number(it.qty) || 0) > 0)
    .filter((it) => {
      const have = one(it.ammoType || it.item);
      return !want || have.includes(want) || want.includes(have);
    });
}

/** The held weapon used for an attack skill (tied to the skill by name, or any held weapon without a skill set). */
export function weaponFor(inventory, skillName) {
  const s = norm(skillName);
  const held = (inventory || []).filter((it) => isHeld(it) && !isBlankItem(it));
  return (
    held.find((it) => norm(it.skill) && s && (s.includes(norm(it.skill)) || norm(it.skill).includes(s))) ??
    held.find((it) => !norm(it.skill) && (it.ranged || n(it.bonus?.damage))) ??
    null
  );
}

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
    /** Where it's worn (Equipment: a body part or 'held'; Accessory: a body part, 'neck' or 'finger'). */
    fits: '',
    twoHanded: false,
    /** Ranged weapon: fires Ammunition (of `ammo` type, or any). */
    ranged: false,
    ammo: '',
    /** Ammunition: its type ("Arrow", "Bullet"…). */
    ammoType: '',
    /** Consumables with charges: uses left on the current one, and how many a full one has. */
    charges: '',
    maxCharges: '',
    /** Equipment / Accessory / Special: what it does when used from the Hotlist (not used up). */
    ability: '',
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
    norm(a.fits) === norm(b.fits) &&
    norm(a.ammoType) === norm(b.ammoType) &&
    norm(a.ability) === norm(b.ability) &&
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
    const applies = tied ? s && (s.includes(tied) || tied.includes(s)) : !isSpell && isHeld(it);
    if (applies) {
      total += v;
      from.push({ name: it.item, value: v });
    }
  }
  return { total, from };
}

/* ---------------- the Hotlist: 10 quick-access slots holding inventory items or Spells ---------------- */
export const HOT_SLOTS = 10;
/** A Spell on the Hotlist is stored as 'spell:<Skill name>' (Heal is always available and never goes there). */
export const SPELL_REF = 'spell:';
export const isSpellRef = (id) => String(id || '').startsWith(SPELL_REF);
export const spellRef = (name) => `${SPELL_REF}${String(name || '').trim()}`;
export const isHealSpell = (name) => norm(name) === 'heal' || norm(name) === 'curar';
/** Spells that can go on the Hotlist: the sheet's Spell skills, except Heal. */
export const hotlistSpells = (skills) =>
  (skills || []).filter((s) => s && s.category === 'spell' && norm(s.name) && !isHealSpell(s.name));

/**
 * Keep the Hotlist and the items in line: a slot only points at an item that still exists (and isn't empty) or a
 * Spell (checked against the skills by `dropMissingSpells`), and
 * an item's `hot` flag says whether it sits in a slot. Returns the same objects when nothing changed.
 */
export function syncHot(inventory, hotSlots) {
  const inv = inventory || [];
  const ids = new Set(inv.filter((it) => !isBlankItem(it)).map((it) => it.id));
  const seen = new Set();
  const slots = Array.from({ length: HOT_SLOTS }, (_, i) => {
    const id = (hotSlots || [])[i] || '';
    if (!id || (!ids.has(id) && !isSpellRef(id)) || seen.has(id)) return '';
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

/** Empty the Hotlist slots of Spells the sheet no longer has (renamed or removed). */
export function dropMissingSpells(hotSlots, skills) {
  const have = new Set(hotlistSpells(skills).map((s) => spellRef(s.name)));
  const out = (hotSlots || []).map((id) => (isSpellRef(id) && !have.has(id) ? '' : id));
  return out.every((id, i) => id === hotSlots[i]) ? hotSlots : out;
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

/**
 * Spend one use of an item: a charge when it has charges (the last charge uses up the item, and the next one
 * starts full), otherwise one of the stack. The row goes when none are left, and its Hotlist slot empties.
 * Returns null when the item isn't there or has none left.
 */
export function spendOne(inventory, hotSlots, itemId) {
  const it = (inventory || []).find((x) => x && x.id === itemId);
  if (!it) return null;
  const qty = String(it.qty ?? '').trim() === '' ? 1 : n(it.qty);
  if (qty <= 0) return null;
  const max = n(it.maxCharges);
  if (max > 0) {
    const charges = String(it.charges ?? '').trim() === '' ? max : n(it.charges);
    if (charges > 1) {
      const next = { ...it, charges: String(charges - 1) };
      return { inventory: inventory.map((x) => (x === it ? next : x)), hotSlots, left: qty, charges: charges - 1 };
    }
  }
  const left = qty - 1;
  if (left > 0) {
    const next = { ...it, qty: String(left), ...(max > 0 ? { charges: String(max) } : {}) };
    return { inventory: inventory.map((x) => (x === it ? next : x)), hotSlots, left, charges: max > 0 ? max : null };
  }
  return {
    inventory: inventory.filter((x) => x !== it),
    hotSlots: (hotSlots || []).map((id) => (id === itemId ? '' : id)),
    left: 0,
    charges: null,
  };
}
