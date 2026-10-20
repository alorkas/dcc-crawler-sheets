import { useEffect, useState, type DragEvent } from 'react';
import { api } from '../lib/api';
import {
  ACCESSORY_FITS,
  BONUS_KEYS,
  DEFAULT_SLOT_COUNTS,
  EQUIP_FITS,
  STAT_BONUS_KEYS,
  HOT_SLOTS,
  ITEM_TYPES,
  RARITIES,
  equipItem,
  fitsSlot,
  hotlistable,
  hotlistSpells,
  isBlankItem,
  isSpellRef,
  isStuck,
  removeCurse,
  isWorn,
  setHotSlot,
  slotKeyOf,
  slotList,
  spellRef,
  syncHot,
  toggleHot,
} from '../../shared/items.js';
import { useAuth } from '../lib/auth';
import { fillItem, lookup } from '../lib/catalog';
import { useI18n, type MsgKey } from '../lib/i18n';
import { useLiveOptional } from '../lib/live';
import { emptyItem, signed, type Item, type ItemType, type SheetData } from '../lib/sheet';
import { Area, Input, Section, useSheet } from './fields';
import { UseItemControls } from './QuickItems';

type T = ReturnType<typeof useI18n>['t'];

/** A cursed item: the player sees it once it's revealed; the GM sees it before, marked as hidden. */
export function CursePill({ it }: { it: Item }) {
  const { t } = useI18n();
  if (!it.curse) return null;
  return (
    <span className={`pill tiny-pill curse-pill ${it.curse.revealed ? '' : 'hidden'}`} title={it.curse.text}>
      ☠ {t(it.curse.revealed ? 'curse.pill' : 'curse.pillHidden')}
    </span>
  );
}

/** "Head", "Head · Accessory", "Finger 3", "Main hand". */
export function slotLabel(id: string, t: T): string {
  const key = slotKeyOf(id);
  const [kind, part] = key.split('.');
  const n = Number(String(id).match(/\.(\d+)$/)?.[1] ?? 1);
  const name = t(`part.${part}` as MsgKey);
  const numbered = (DEFAULT_SLOT_COUNTS[key] ?? 1) > 1 || n > 1 ? `${name} ${n}` : name;
  return kind === 'acc' && part !== 'neck' && part !== 'finger' ? `${numbered} · ${t('itemType.accessory')}` : numbered;
}

/** The sheet's crawler is in the current fight (in the party, combat on). */
export function useInFight(): boolean {
  const { charId } = useSheet();
  const live = useLiveOptional();
  return !!(charId && live?.encounter?.active && live.party?.some((p) => p.id === charId));
}

/**
 * Change a Hotlist slot. Out of combat it's a normal sheet edit; in combat it goes through the server, which
 * spends an Action and logs it (the log entry can undo it).
 */
export function useHotlistChange() {
  const { charId, data, update, runServer } = useSheet();
  const live = useLiveOptional();
  const { err } = useI18n();
  const inFight = useInFight();
  const [error, setError] = useState('');
  const change = async (slot: number, itemId: string) => {
    setError('');
    if (!inFight || !charId) {
      update((d) => ({ ...d, ...setHotSlot(d.inventory, d.hotSlots, slot, itemId) }));
      return;
    }
    try {
      await runServer(() => api.setHotSlot(charId, slot, itemId));
      if (live) live.setEncounter(await api.encounter());
    } catch (e) {
      setError(err(e));
    }
  };
  /** ★ on an inventory row: into the first free slot, or off the Hotlist. */
  const toggle = (itemId: string, on: boolean) => {
    if (!on) return change(data.hotSlots.indexOf(itemId), '');
    const next = toggleHot(data.inventory, data.hotSlots, data.hotlist, itemId, true);
    const slot = next.hotSlots.indexOf(itemId);
    return slot >= 0 ? change(slot, itemId) : undefined;
  };
  return { inFight, change, toggle, error };
}

/** Change an item's category: a non-worn item is unequipped, and one that can't be on the Hotlist leaves it. */
function withType(d: SheetData, id: string, type: ItemType): SheetData {
  const inventory = d.inventory.map((x) => {
    if (x.id !== id) return x;
    const fitsOk =
      (type === 'equipment' && (EQUIP_FITS as string[]).includes(x.fits)) ||
      (type === 'accessory' && (ACCESSORY_FITS as string[]).includes(x.fits));
    const next = { ...x, type, fits: fitsOk ? x.fits : ('' as Item['fits']) };
    return isWorn(type) && fitsSlot(next, x.slot) ? next : { ...next, slot: '' };
  });
  const it = inventory.find((x) => x.id === id);
  const hotSlots = it && !hotlistable(it) ? d.hotSlots.map((h) => (h === id ? '' : h)) : d.hotSlots;
  return { ...d, ...syncHot(inventory, hotSlots) };
}

/* ---------------- sorting (remembered per user) ---------------- */
type SortMode = 'manual' | 'qty' | 'alpha' | 'rarity';
const SORTS: SortMode[] = ['manual', 'alpha', 'qty', 'rarity'];

function useSortMode(): [SortMode, (m: SortMode) => void] {
  const { user } = useAuth();
  const key = `dcc.invSort.${user?.id ?? 0}`;
  const [mode, setMode] = useState<SortMode>(() => {
    try {
      const v = localStorage.getItem(key) as SortMode | null;
      return v && SORTS.includes(v) ? v : 'manual';
    } catch {
      return 'manual';
    }
  });
  const set = (m: SortMode) => {
    setMode(m);
    try {
      localStorage.setItem(key, m);
    } catch {
      /* private mode */
    }
  };
  return [mode, set];
}

const qtyOf = (it: Item) => Number(String(it.qty).match(/\d+/)?.[0] ?? 0);

/** Indexes of some inventory rows in display order (empty rows stay at the end in every mode). */
function sortedIndexes(list: Item[], idx: number[], mode: SortMode): number[] {
  const filled = idx.filter((i) => !isBlankItem(list[i]));
  const blank = idx.filter((i) => isBlankItem(list[i]));
  const rank = (r: string) => (r ? (RARITIES as string[]).indexOf(r) : -1);
  const by = (a: number, b: number) => {
    const x = list[a];
    const y = list[b];
    if (mode === 'alpha') return x.item.localeCompare(y.item);
    if (mode === 'qty') return qtyOf(y) - qtyOf(x) || x.item.localeCompare(y.item);
    if (mode === 'rarity') return rank(y.rarity) - rank(x.rarity) || x.item.localeCompare(y.item);
    return 0;
  };
  return [...(mode === 'manual' ? filled : [...filled].sort(by)), ...blank];
}

/** Inventory sections: one per category, then items without one (and new rows). */
const GROUPS: (ItemType | '')[] = [...ITEM_TYPES, ''];

export const rarityClass = (r: string) => (r ? `rar-${r}` : '');

/* ---------------- Inventory tab ---------------- */
export function InventoryTab() {
  const { t } = useI18n();
  const { data, update, playLocked } = useSheet();
  const [mode, setMode] = useSortMode();
  const [open, setOpen] = useState<number | null>(null);
  const [drag, setDrag] = useState<number | null>(null);
  const groups = GROUPS.map((type) => {
    const idx = data.inventory.map((_, i) => i).filter((i) => (data.inventory[i].type || '') === type);
    return { type, order: sortedIndexes(data.inventory, idx, mode) };
  }).filter((g) => g.order.length > 0);
  const move = (from: number, to: number) => {
    if (from === to) return;
    update((d) => {
      const inv = [...d.inventory];
      const [it] = inv.splice(from, 1);
      inv.splice(to, 0, it);
      return { ...d, inventory: inv };
    });
  };
  const onDrop = (e: DragEvent, to: number) => {
    e.preventDefault();
    // rows only move within their category
    if (drag !== null && (data.inventory[drag].type || '') === (data.inventory[to].type || '')) move(drag, to);
    setDrag(null);
  };
  const add = (type: ItemType | '') => update((d) => ({ ...d, inventory: [...d.inventory, { ...emptyItem(), type }] }));
  return (
    <Section
      title={t('inv.title')}
      actions={
        <label className="inv-sort">
          <span className="lbl">{t('inv.sort')}</span>
          <select className="in sel" value={mode} onChange={(e) => setMode(e.target.value as SortMode)}>
            {SORTS.map((m) => (
              <option key={m} value={m}>
                {t(`inv.sort.${m}` as MsgKey)}
              </option>
            ))}
          </select>
        </label>
      }
    >
      <ItemNameList />
      <div className="list inventory">
        <div className="list-head inv-cols">
          <span />
          <span>{t('inv.item')}</span>
          <span className="center">{t('inv.qty')}</span>
          <span>{t('inv.type')}</span>
          <span>{t('inv.notes')}</span>
          <span />
        </div>
        {groups.map(({ type, order }) => (
          <section key={type || 'none'} className={`inv-group inv-group-${type || 'none'}`}>
            <div className="inv-group-head">
              <span className="inv-group-title">{type ? t(`itemType.${type}` as MsgKey) : t('inv.uncategorized')}</span>
              <span className="pill tiny-pill">{order.filter((i) => !isBlankItem(data.inventory[i])).length}</span>
              {!playLocked && type && (
                <button type="button" className="btn small ghost inv-group-add" onClick={() => add(type)}>
                  + {t('inv.addHere')}
                </button>
              )}
            </div>
            {order.map((i, pos) => (
              <div
                key={data.inventory[i].id}
                className={`list-row inv-row ${drag === i ? 'dragging' : ''} ${rarityClass(data.inventory[i].rarity)}`}
                draggable={mode === 'manual' && !playLocked && !isBlankItem(data.inventory[i])}
                onDragStart={() => setDrag(i)}
                onDragOver={(e) => mode === 'manual' && e.preventDefault()}
                onDrop={(e) => onDrop(e, i)}
                onDragEnd={() => setDrag(null)}
              >
                <InventoryRow
                  i={i}
                  manual={mode === 'manual'}
                  onUp={pos > 0 ? () => move(i, order[pos - 1]) : undefined}
                  onDown={
                    pos < order.length - 1 && !isBlankItem(data.inventory[order[pos + 1]])
                      ? () => move(i, order[pos + 1])
                      : undefined
                  }
                  onOpen={() => setOpen(i)}
                />
              </div>
            ))}
          </section>
        ))}
        {!playLocked && (
          <button type="button" className="btn ghost add-row" onClick={() => add('')}>
            + {t('inv.add')}
          </button>
        )}
      </div>
      <p className="dim tiny">{t('inv.hint')}</p>
      {open !== null && data.inventory[open] && <ItemDialog i={open} onClose={() => setOpen(null)} />}
    </Section>
  );
}

function InventoryRow({
  i,
  manual,
  onUp,
  onDown,
  onOpen,
}: {
  i: number;
  manual: boolean;
  onUp?: () => void;
  onDown?: () => void;
  onOpen: () => void;
}) {
  const { data, playLocked, update, charId, der, runServer } = useSheet();
  const { t } = useI18n();
  const { user } = useAuth();
  const [msg, setMsg] = useState('');
  const hot = useHotlistChange();
  const it = data.inventory[i];
  const blank = isBlankItem(it);
  const hotSlot = data.hotSlots.indexOf(it.id);
  const toggleHotlist = () => hot.toggle(it.id, hotSlot < 0);
  // out of combat a Consumable is used straight from the inventory (in combat: from the Hotlist)
  const usable = !blank && !hot.inFight && (it.type === 'consumable' || it.type === '') && !!charId;
  const fill = async () => {
    setMsg('');
    try {
      const hit = await lookup(it.item, 'item');
      if (!hit) return setMsg(t('fill.notFound'));
      const changes = fillItem(it, hit);
      if (!changes.notes) return setMsg(t('fill.nothing'));
      update((d) => ({
        ...d,
        inventory: d.inventory.map((x, j) => (j === i ? { ...x, ...fillItem(x, hit) } : x)),
      }));
    } catch {
      setMsg(t('err.generic'));
    }
  };
  return (
    <div className="inv-cols">
      <span className="inv-move">
        {manual && !playLocked && !blank && (
          <>
            <span className="drag-handle" aria-hidden title={t('inv.drag')}>
              ⠿
            </span>
            <button type="button" className="mini-arrow" disabled={!onUp} onClick={onUp} aria-label={t('inv.up')}>
              ▲
            </button>
            <button type="button" className="mini-arrow" disabled={!onDown} onClick={onDown} aria-label={t('inv.down')}>
              ▼
            </button>
          </>
        )}
      </span>
      <div className="inv-name">
        <Input
          path={['inventory', i, 'item']}
          ariaLabel={t('inv.item')}
          placeholder={t('inv.item')}
          list="item-names"
        />
        {!blank && (
          <span className="inv-tags">
            {it.slot && <span className="pill tiny-pill gold">{slotLabel(it.slot, t)}</span>}
            {it.curse && <CursePill it={it} />}
            {it.rarity && (
              <span className={`pill tiny-pill rar-pill ${rarityClass(it.rarity)}`}>
                {t(`rarity.${it.rarity}` as MsgKey)}
              </span>
            )}
            {hotSlot >= 0 && (
              <span className="pill tiny-pill gold" title={t('hot.inSlot', { n: hotSlot + 1 })}>
                ★ {hotSlot + 1}
              </span>
            )}
            {bonusText(it, t) && <span className="dim tiny">{bonusText(it, t)}</span>}
          </span>
        )}
      </div>
      <Input path={['inventory', i, 'qty']} ariaLabel={t('inv.quantity')} placeholder={t('inv.qty')} center numeric />
      <select
        className="in sel"
        value={it.type}
        disabled={playLocked}
        aria-label={t('inv.type')}
        onChange={(e) => update((d) => withType(d, it.id, e.target.value as ItemType))}
      >
        <option value="">—</option>
        {ITEM_TYPES.map((x) => (
          <option key={x} value={x}>
            {t(`itemType.${x}` as MsgKey)}
          </option>
        ))}
      </select>
      <div>
        <Input path={['inventory', i, 'notes']} ariaLabel={t('inv.notes')} placeholder={t('inv.notes')} />
        {msg && <span className="dim tiny">{msg}</span>}
        {hot.error && <span className="tiny error">{hot.error}</span>}
      </div>
      <span className="inv-actions">
        {usable && <UseItemControls memberId={charId!} it={it} manaMax={der.manaMax} run={runServer} />}
        {!blank && !playLocked && (hotlistable(it) || hotSlot >= 0) && (
          <button
            type="button"
            className={`btn small ghost hot-toggle ${hotSlot >= 0 ? 'on' : ''}`}
            onClick={toggleHotlist}
            title={hotSlot >= 0 ? t('hot.off') : t('hot.on')}
            aria-pressed={hotSlot >= 0}
          >
            ★
          </button>
        )}
        {!blank && (
          <button type="button" className="btn small ghost" onClick={onOpen} title={t('inv.details')}>
            ⋯
          </button>
        )}
        {!playLocked && it.item.trim() && !it.notes.trim() && (
          <button type="button" className="btn small ghost book-btn" onClick={fill} title={t('fill.hintItem')}>
            {t('fill.short')}
          </button>
        )}
        {!playLocked && !(isStuck(it) && !user?.isAdmin) && (
          <button
            type="button"
            className="row-del"
            title={t('list.remove')}
            aria-label={t('list.remove')}
            onClick={() =>
              update((d) => ({
                ...d,
                ...syncHot(
                  d.inventory.filter((_, j) => j !== i),
                  d.hotSlots,
                ),
              }))
            }
          >
            ×
          </button>
        )}
      </span>
    </div>
  );
}

/** "+2 dmg · DR +1" for an item's bonuses. */
export function bonusText(it: Item, t: ReturnType<typeof useI18n>['t']): string {
  const parts: string[] = [];
  const num = (v: string) => Number(String(v).match(/[+-]?\d+/)?.[0] ?? 0);
  if (num(it.bonus.damage)) parts.push(t('bonus.damageShort', { n: signed(num(it.bonus.damage)) }));
  if (num(it.bonus.dr)) parts.push(t('bonus.drShort', { n: signed(num(it.bonus.dr)) }));
  if (num(it.bonus.evade)) parts.push(t('bonus.evadeShort', { n: signed(num(it.bonus.evade)) }));
  for (const k of STAT_BONUS_KEYS)
    if (num(it.bonus[k] ?? '')) parts.push(`${t(`stat.${k}.short` as MsgKey)} ${signed(num(it.bonus[k]))}`);
  return parts.join(' · ');
}

/** Item names from the book catalog as suggestions (GM only: the catalog stays server-side for players). */
export function ItemNameList() {
  const { user } = useAuth();
  const [names, setNames] = useState<string[]>([]);
  useEffect(() => {
    if (!user?.isAdmin) return;
    api
      .fullCatalog()
      .then((c) => setNames([...c.items, ...(c.homebrew ?? [])].map((e) => e.name).sort()))
      .catch(() => {});
  }, [user?.isAdmin]);
  return (
    <datalist id="item-names">
      {names.map((n) => (
        <option key={n} value={n} />
      ))}
    </datalist>
  );
}

/* ---------------- item details (inventory "⋯", Equipment slots, Hotlist) ---------------- */
export function ItemDialog({ i, onClose }: { i: number; onClose: () => void }) {
  const { t } = useI18n();
  const { data, set, update, playLocked } = useSheet();
  const { user } = useAuth();
  const hot = useHotlistChange();
  const it = data.inventory[i];
  if (!it) return null;
  const stuck = isStuck(it) && !user?.isAdmin;
  const type = it.type;
  const worn = isWorn(type);
  const held = type === 'equipment' && it.fits === 'held';
  const fitsList: string[] = type === 'equipment' ? EQUIP_FITS : type === 'accessory' ? ACCESSORY_FITS : [];
  const slots = worn && it.fits ? slotList(data.slotCounts).filter((s) => fitsSlot(it, s.id)) : [];
  const skills = data.skills.filter((s) => s.category === 'combat' && s.name.trim()).map((s) => s.name);
  const p = (k: keyof Item) => ['inventory', i, k] as (string | number)[];
  const onItem = (fn: (x: Item) => Item) =>
    update((d) => ({ ...d, inventory: d.inventory.map((x) => (x.id === it.id ? fn(x) : x)) }));
  const twoHandedMain = data.inventory.find((x) => x.twoHanded && x.slot.startsWith('eq.mainHand.') && x.id !== it.id);
  return (
    <div className="modal-back" onClick={onClose}>
      <div className={`modal item-modal ${rarityClass(it.rarity)}`} onClick={(e) => e.stopPropagation()}>
        <div className="item-modal-head">
          <h2>{it.item || t('inv.item')}</h2>
          {it.rarity && (
            <span className={`pill rar-pill ${rarityClass(it.rarity)}`}>{t(`rarity.${it.rarity}` as MsgKey)}</span>
          )}
        </div>
        <fieldset className="plain-fieldset item-grid" disabled={playLocked}>
          <Input path={p('item')} label={t('inv.item')} />
          <Input path={p('qty')} label={t('inv.qty')} center numeric />
          <label className="field">
            <span className="lbl">{t('inv.type')}</span>
            <select
              className="in sel"
              value={type}
              onChange={(e) => update((d) => withType(d, it.id, e.target.value as ItemType))}
            >
              <option value="">—</option>
              {ITEM_TYPES.map((x) => (
                <option key={x} value={x}>
                  {t(`itemType.${x}` as MsgKey)}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span className="lbl">{t('inv.rarity')}</span>
            <select className="in sel" value={it.rarity} onChange={(e) => set(p('rarity'), e.target.value)}>
              <option value="">—</option>
              {RARITIES.map((x) => (
                <option key={x} value={x}>
                  {t(`rarity.${x}` as MsgKey)}
                </option>
              ))}
            </select>
          </label>
          {type && <p className="dim tiny span-2 type-hint">{t(`itemType.${type}.hint` as MsgKey)}</p>}
          <label className="field span-2">
            <span className="lbl">{t('inv.notes')}</span>
            <textarea className="in" rows={3} value={it.notes} onChange={(e) => set(p('notes'), e.target.value)} />
          </label>

          {worn && (
            <>
              <label className="field">
                <span className="lbl">{t('inv.fits')}</span>
                <select
                  className="in sel"
                  value={it.fits}
                  onChange={(e) =>
                    onItem((x) => ({ ...x, fits: e.target.value as Item['fits'], slot: '', twoHanded: false }))
                  }
                >
                  <option value="">—</option>
                  {fitsList.map((f) => (
                    <option key={f} value={f}>
                      {t(`part.${f}` as MsgKey)}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                <span className="lbl">{t('inv.equip')}</span>
                <select
                  className="in sel"
                  value={it.slot}
                  disabled={!it.fits || stuck}
                  title={stuck ? t('curse.stuck') : undefined}
                  onChange={(e) => update((d) => ({ ...d, inventory: equipItem(d.inventory, it.id, e.target.value) }))}
                >
                  <option value="">{t('inv.notEquipped')}</option>
                  {slots.map((s) => {
                    const other = data.inventory.find((x) => x.slot === s.id && x.id !== it.id);
                    const blocked = s.key === 'eq.offHand' && !!twoHandedMain;
                    return (
                      <option key={s.id} value={s.id}>
                        {slotLabel(s.id, t)}
                        {other ? ` · ${other.item} (${t('hot.replace')})` : ''}
                        {blocked ? ` · ${t('equip.twoHandedBusy', { item: twoHandedMain.item })}` : ''}
                      </option>
                    );
                  })}
                </select>
              </label>
            </>
          )}

          {it.curse && (
            <div className="field span-2 curse-box">
              <span>
                ☠ <strong>{t(it.curse.revealed ? 'curse.active' : 'curse.hidden')}</strong> {it.curse.text}
              </span>
              {user?.isAdmin && !playLocked && (
                <button
                  type="button"
                  className="btn small ghost"
                  onClick={() =>
                    update((d) => ({ ...d, inventory: d.inventory.map((x) => (x.id === it.id ? removeCurse(x) : x)) }))
                  }
                >
                  {t('curse.lift')}
                </button>
              )}
            </div>
          )}
          {held && (
            <div className="field span-2 item-flags">
              <label className="gm-check">
                <input
                  type="checkbox"
                  checked={it.twoHanded}
                  onChange={(e) =>
                    update((d) => {
                      const inv = d.inventory.map((x) => (x.id === it.id ? { ...x, twoHanded: e.target.checked } : x));
                      return { ...d, inventory: it.slot ? equipItem(inv, it.id, it.slot) : inv };
                    })
                  }
                />
                {t('inv.twoHanded')}
              </label>
              <label className="gm-check">
                <input type="checkbox" checked={it.ranged} onChange={(e) => set(p('ranged'), e.target.checked)} />
                {t('inv.ranged')}
              </label>
              {it.ranged && (
                <label className="mini grow">
                  <span>{t('inv.ammo')}</span>
                  <input
                    className="in"
                    value={it.ammo}
                    placeholder={t('inv.ammoAny')}
                    onChange={(e) => set(p('ammo'), e.target.value)}
                  />
                </label>
              )}
            </div>
          )}

          {worn && (
            <div className="field span-2">
              <span className="lbl">{t('inv.bonuses')}</span>
              <div className="bonus-row">
                {BONUS_KEYS.map((k) => (
                  <label key={k} className="mini">
                    <span>{t(`bonus.${k}` as MsgKey)}</span>
                    <input
                      className="in center"
                      value={it.bonus[k]}
                      placeholder="+0"
                      onChange={(e) => set(['inventory', i, 'bonus', k], e.target.value)}
                    />
                  </label>
                ))}
                {(held || it.bonus.damage) && (
                  <label className="mini grow">
                    <span>{t('inv.skill')}</span>
                    <input
                      className="in"
                      list="item-skill-names"
                      value={it.skill}
                      placeholder={t('inv.skillAny')}
                      onChange={(e) => set(p('skill'), e.target.value)}
                    />
                    <datalist id="item-skill-names">
                      {skills.map((s) => (
                        <option key={s} value={s} />
                      ))}
                    </datalist>
                  </label>
                )}
              </div>
              <span className="dim tiny">{t('inv.bonusHint')}</span>
            </div>
          )}

          {(worn || type === 'special') && (
            <label className="field span-2">
              <span className="lbl">{t('inv.ability')}</span>
              <input
                className="in"
                value={it.ability}
                placeholder={t('inv.abilityPh')}
                onChange={(e) => set(p('ability'), e.target.value)}
              />
            </label>
          )}
          {worn && (
            <label className="field span-2">
              <span className="lbl">{t('inv.upgrades')}</span>
              <input className="in" value={it.upgrades} onChange={(e) => set(p('upgrades'), e.target.value)} />
            </label>
          )}
          {type === 'consumable' && (
            <>
              <Input path={p('charges')} label={t('inv.charges')} center numeric />
              <Input path={p('maxCharges')} label={t('inv.maxCharges')} center numeric />
            </>
          )}
          {type === 'ammunition' && <Input path={p('ammoType')} label={t('inv.ammoType')} />}

          <div className="field span-2 item-flags">
            {hotlistable(it) && (
              <label className="gm-check hot-pick">
                ★ {t('hot.slot')}
                <select
                  className="in sel tiny-sel"
                  value={data.hotSlots.indexOf(it.id)}
                  onChange={(e) => {
                    const n = Number(e.target.value);
                    hot.change(n < 0 ? data.hotSlots.indexOf(it.id) : n, n < 0 ? '' : it.id);
                  }}
                >
                  <option value={-1}>{t('hot.none')}</option>
                  {Array.from({ length: HOT_SLOTS }, (_, n) => {
                    const other = data.inventory.find((x) => x.id === data.hotSlots[n] && x.id !== it.id);
                    return (
                      <option key={n} value={n}>
                        {t('gear.slot', { n: n + 1 })}
                        {isSpellRef(data.hotSlots[n])
                          ? ` · ✦ ${data.hotSlots[n].slice(6)} (${t('hot.replace')})`
                          : other
                            ? ` · ${other.item} (${t('hot.replace')})`
                            : data.hotlist[n]?.trim()
                              ? ` · ${data.hotlist[n].trim().slice(0, 24)}`
                              : ''}
                      </option>
                    );
                  })}
                </select>
              </label>
            )}
            <label className="gm-check">
              <input type="checkbox" checked={it.unique} onChange={(e) => set(p('unique'), e.target.checked)} />
              {t('inv.unique')}
            </label>
          </div>
          {hot.inFight && hotlistable(it) && <p className="dim tiny span-2">{t('hot.costsAction')}</p>}
          {hot.error && <p className="tiny error span-2">{hot.error}</p>}
        </fieldset>
        <div className="modal-actions">
          <button type="button" className="btn primary" onClick={onClose}>
            {t('common.close')}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- the Hotlist (Gear tab): 10 slots holding inventory items, or text ---------------- */
export function HotlistSlots() {
  const { t } = useI18n();
  const { data, charId, runServer, der, playLocked } = useSheet();
  const hot = useHotlistChange();
  const [open, setOpen] = useState<number | null>(null);
  const index = new Map(data.inventory.map((it, i) => [it.id, i]));
  const free = data.inventory.filter((it) => !isBlankItem(it) && hotlistable(it) && !data.hotSlots.includes(it.id));
  const freeSpells = hotlistSpells(data.skills).filter((sk) => !data.hotSlots.includes(spellRef(sk.name)));
  return (
    <>
      {hot.inFight && <div className="dim tiny">{t('hot.costsAction')}</div>}
      {hot.error && <div className="tiny error">{hot.error}</div>}
      <div className="hotlist">
        {Array.from({ length: HOT_SLOTS }, (_, s) => {
          const idx = index.get(data.hotSlots[s]);
          const it = idx !== undefined ? data.inventory[idx] : null;
          const text = data.hotlist[s]?.trim();
          const sk = isSpellRef(data.hotSlots[s])
            ? data.skills.find((x) => x.category === 'spell' && spellRef(x.name) === data.hotSlots[s])
            : undefined;
          if (sk)
            return (
              <div key={s} className="hot-slot has-item has-spell">
                <div className="hot-slot-head">
                  <span className="dim tiny">{t('gear.slot', { n: s + 1 })}</span>
                  {!playLocked && (
                    <button
                      type="button"
                      className="icon-btn small"
                      title={t('hot.remove')}
                      aria-label={t('hot.remove')}
                      onClick={() => hot.change(s, '')}
                    >
                      ×
                    </button>
                  )}
                </div>
                <strong className="hot-item">✦ {sk.name}</strong>
                <span className="dim tiny">
                  {t('hot.spell')}
                  {sk.manaCost && ` · ${t('skill.sumMana', { n: sk.manaCost })}`}
                </span>
                {(sk.effect || sk.description) && (
                  <div className="dim tiny hot-notes">{sk.effect || sk.description}</div>
                )}
              </div>
            );
          return (
            <div key={s} className={`hot-slot ${it ? `has-item ${rarityClass(it.rarity)}` : ''}`}>
              <div className="hot-slot-head">
                <span className="dim tiny">{t('gear.slot', { n: s + 1 })}</span>
                {it && !playLocked && (
                  <button
                    type="button"
                    className="icon-btn small"
                    title={t('hot.remove')}
                    aria-label={t('hot.remove')}
                    onClick={() => hot.change(s, '')}
                  >
                    ×
                  </button>
                )}
              </div>
              {it ? (
                <>
                  <button type="button" className="hot-item link-btn" onClick={() => setOpen(idx!)}>
                    <strong>{it.item}</strong> {qtyText(it)}
                  </button>
                  <span className="dim tiny">{t(`itemType.${it.type || 'other'}` as MsgKey)}</span>
                  {(it.ability || it.notes || text) && (
                    <div className="dim tiny hot-notes">{it.ability || it.notes || text}</div>
                  )}
                  {charId && it.type !== 'ammunition' && (
                    <UseItemControls memberId={charId} it={it} manaMax={der.manaMax} run={runServer} />
                  )}
                </>
              ) : (
                <>
                  <Area path={['hotlist', s]} rows={2} placeholder={t('hot.textPh')} />
                  {!playLocked && free.length + freeSpells.length > 0 && (
                    <select
                      className="in sel tiny-sel"
                      value=""
                      aria-label={t('hot.assign')}
                      onChange={(e) => e.target.value && hot.change(s, e.target.value)}
                    >
                      <option value="">★ {t('hot.assign')}</option>
                      {free.length > 0 && (
                        <optgroup label={t('hot.items')}>
                          {free.map((x) => (
                            <option key={x.id} value={x.id}>
                              {x.item}
                              {(Number(x.qty) || 1) > 1 ? ` ×${x.qty}` : ''}
                            </option>
                          ))}
                        </optgroup>
                      )}
                      {freeSpells.length > 0 && (
                        <optgroup label={t('hot.spells')}>
                          {freeSpells.map((x) => (
                            <option key={x.name} value={spellRef(x.name)}>
                              ✦ {x.name}
                              {x.manaCost ? ` · ${t('skill.sumMana', { n: x.manaCost })}` : ''}
                            </option>
                          ))}
                        </optgroup>
                      )}
                    </select>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
      {open !== null && <ItemDialog i={open} onClose={() => setOpen(null)} />}
    </>
  );
}

/** "×3", or "×3 · 2/5 charges" for items with charges. Kept items (Equipment…) show no count. */
export function qtyText(it: Pick<Item, 'qty' | 'type' | 'charges' | 'maxCharges'>) {
  if (isWorn(it.type) || it.type === 'special') return null;
  const max = Number(it.maxCharges) || 0;
  const charges = String(it.charges ?? '').trim() === '' ? max : Number(it.charges) || 0;
  return (
    <span className="loot-qty">
      ×{Number(it.qty) || 1}
      {max > 0 && ` · ${charges}/${max} ⚡`}
    </span>
  );
}
