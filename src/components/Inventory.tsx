import { useEffect, useState, type DragEvent } from 'react';
import { api } from '../lib/api';
import {
  BONUS_KEYS,
  STAT_BONUS_KEYS,
  GEAR_SLOTS,
  HOT_SLOTS,
  ITEM_TYPES,
  RARITIES,
  SLOT_LIMITS,
  isBlankItem,
  setHotSlot,
  syncHot,
  toggleHot,
} from '../../shared/items.js';
import { useAuth } from '../lib/auth';
import { fillItem, lookup } from '../lib/catalog';
import { useI18n, type MsgKey } from '../lib/i18n';
import { emptyItem, signed, type GearSlot, type Item } from '../lib/sheet';
import { Area, Input, Section, useSheet } from './fields';
import { UseItemControls } from './QuickItems';

/* ---------------- sorting (remembered per user) ---------------- */
type SortMode = 'manual' | 'qty' | 'alpha' | 'type';
const SORTS: SortMode[] = ['manual', 'alpha', 'qty', 'type'];

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

/** Indexes of the inventory in display order (empty rows stay at the end in every mode). */
function sortedIndexes(list: Item[], mode: SortMode, typeLabel: (t: string) => string): number[] {
  const idx = list.map((_, i) => i);
  const filled = idx.filter((i) => !isBlankItem(list[i]));
  const blank = idx.filter((i) => isBlankItem(list[i]));
  const by = (a: number, b: number) => {
    const x = list[a];
    const y = list[b];
    if (mode === 'alpha') return x.item.localeCompare(y.item);
    if (mode === 'qty') return qtyOf(y) - qtyOf(x) || x.item.localeCompare(y.item);
    if (mode === 'type')
      return typeLabel(x.type || 'zz').localeCompare(typeLabel(y.type || 'zz')) || x.item.localeCompare(y.item);
    return 0;
  };
  return [...(mode === 'manual' ? filled : [...filled].sort(by)), ...blank];
}

export const rarityClass = (r: string) => (r ? `rar-${r}` : '');

/* ---------------- Inventory tab ---------------- */
export function InventoryTab() {
  const { t } = useI18n();
  const { data, update, playLocked } = useSheet();
  const [mode, setMode] = useSortMode();
  const [open, setOpen] = useState<number | null>(null);
  const [drag, setDrag] = useState<number | null>(null);
  const typeLabel = (x: string) => (x === 'zz' ? '~' : t(`itemType.${x}` as MsgKey));
  const order = sortedIndexes(data.inventory, mode, typeLabel);
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
    if (drag !== null) move(drag, to);
    setDrag(null);
  };
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
              onDown={pos < order.length - 1 ? () => move(i, order[pos + 1]) : undefined}
              onOpen={() => setOpen(i)}
            />
          </div>
        ))}
        {!playLocked && (
          <button
            type="button"
            className="btn ghost add-row"
            onClick={() => update((d) => ({ ...d, inventory: [...d.inventory, emptyItem()] }))}
          >
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
  const { data, playLocked, update, set } = useSheet();
  const { t } = useI18n();
  const [msg, setMsg] = useState('');
  const it = data.inventory[i];
  const blank = isBlankItem(it);
  const hotSlot = data.hotSlots.indexOf(it.id);
  const toggleHotlist = () =>
    update((d) => ({ ...d, ...toggleHot(d.inventory, d.hotSlots, d.hotlist, it.id, hotSlot < 0) }));
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
            {it.slot && <span className="pill tiny-pill gold">{t(`slot.${it.slot}` as MsgKey)}</span>}
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
        onChange={(e) => set(['inventory', i, 'type'], e.target.value)}
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
      </div>
      <span className="inv-actions">
        {!blank && !playLocked && (
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
        {!playLocked && (
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

/* ---------------- item details (inventory "⋯" and gear slots) ---------------- */
export function ItemDialog({ i, onClose }: { i: number; onClose: () => void }) {
  const { t } = useI18n();
  const { data, set, update, playLocked } = useSheet();
  const it = data.inventory[i];
  if (!it) return null;
  const usedIn = (slot: GearSlot) => data.inventory.filter((x, j) => j !== i && x.slot === slot).length;
  const full = (slot: GearSlot) => usedIn(slot) >= SLOT_LIMITS[slot];
  const skills = data.skills.filter((s) => s.category === 'combat' && s.name.trim()).map((s) => s.name);
  const p = (k: keyof Item) => ['inventory', i, k] as (string | number)[];
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
            <select className="in sel" value={it.type} onChange={(e) => set(p('type'), e.target.value)}>
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
          <label className="field span-2">
            <span className="lbl">{t('inv.notes')}</span>
            <textarea className="in" rows={3} value={it.notes} onChange={(e) => set(p('notes'), e.target.value)} />
          </label>
          <label className="field span-2">
            <span className="lbl">{t('inv.upgrades')}</span>
            <input className="in" value={it.upgrades} onChange={(e) => set(p('upgrades'), e.target.value)} />
          </label>
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
              {(it.type === 'weapon' || it.bonus.damage) && (
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
          <label className="field">
            <span className="lbl">{t('inv.equip')}</span>
            <select className="in sel" value={it.slot} onChange={(e) => set(p('slot'), e.target.value)}>
              <option value="">{t('inv.notEquipped')}</option>
              {GEAR_SLOTS.map((s) => (
                <option key={s} value={s} disabled={s !== it.slot && full(s)}>
                  {t(`slot.${s}` as MsgKey)} ({usedIn(s) + (it.slot === s ? 1 : 0)}/{SLOT_LIMITS[s]})
                </option>
              ))}
            </select>
          </label>
          <div className="field item-flags">
            <label className="gm-check hot-pick">
              ★ {t('hot.slot')}
              <select
                className="in sel tiny-sel"
                value={data.hotSlots.indexOf(it.id)}
                onChange={(e) =>
                  update((d) => ({ ...d, ...setHotSlot(d.inventory, d.hotSlots, Number(e.target.value), it.id) }))
                }
              >
                <option value={-1}>{t('hot.none')}</option>
                {Array.from({ length: HOT_SLOTS }, (_, n) => {
                  const other = data.inventory.find((x) => x.id === data.hotSlots[n] && x.id !== it.id);
                  return (
                    <option key={n} value={n}>
                      {t('gear.slot', { n: n + 1 })}
                      {other
                        ? ` · ${other.item} (${t('hot.replace')})`
                        : data.hotlist[n]?.trim()
                          ? ` · ${data.hotlist[n].trim().slice(0, 24)}`
                          : ''}
                    </option>
                  );
                })}
              </select>
            </label>
            <label className="gm-check">
              <input type="checkbox" checked={it.unique} onChange={(e) => set(p('unique'), e.target.checked)} />
              {t('inv.unique')}
            </label>
          </div>
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

/* ---------------- Gear tab: equipped items per slot ---------------- */
export function EquippedSlots() {
  const { t } = useI18n();
  const { data, set, playLocked } = useSheet();
  const [open, setOpen] = useState<number | null>(null);
  const carried = data.inventory.map((it, i) => ({ it, i })).filter(({ it }) => !it.slot && !isBlankItem(it));
  return (
    <div className="slots">
      {GEAR_SLOTS.map((slot) => {
        const here = data.inventory
          .map((it, i) => ({ it, i }))
          .filter(({ it }) => it.slot === slot && !isBlankItem(it));
        const room = here.length < SLOT_LIMITS[slot];
        return (
          <div key={slot} className="slot">
            <div className="slot-head">
              <span className="lbl">{t(`slot.${slot}` as MsgKey)}</span>
              <span className={`count ${here.length > SLOT_LIMITS[slot] ? 'warn' : ''}`}>
                {here.length}/{SLOT_LIMITS[slot]}
              </span>
            </div>
            {here.map(({ it, i }) => (
              <button
                key={it.id}
                type="button"
                className={`slot-item ${rarityClass(it.rarity)}`}
                onClick={() => setOpen(i)}
              >
                <strong>{it.item}</strong>
                <span className="dim tiny">
                  {[it.rarity && t(`rarity.${it.rarity}` as MsgKey), bonusText(it, t)].filter(Boolean).join(' · ')}
                </span>
              </button>
            ))}
            {room && !playLocked && carried.length > 0 && (
              <select
                className="in sel slot-add"
                value=""
                aria-label={t('inv.equipTo', { slot: t(`slot.${slot}` as MsgKey) })}
                onChange={(e) => e.target.value && set(['inventory', Number(e.target.value), 'slot'], slot)}
              >
                <option value="">+ {t('inv.equipShort')}</option>
                {carried.map(({ it, i }) => (
                  <option key={it.id} value={i}>
                    {it.item}
                  </option>
                ))}
              </select>
            )}
            {here.length === 0 && (playLocked || carried.length === 0) && <span className="dim tiny">—</span>}
          </div>
        );
      })}
      {open !== null && <ItemDialog i={open} onClose={() => setOpen(null)} />}
    </div>
  );
}

/* ---------------- the Hotlist (Gear tab): 10 slots holding inventory items, or text ---------------- */
export function HotlistSlots() {
  const { t } = useI18n();
  const { data, update, charId, runServer, der, playLocked } = useSheet();
  const [open, setOpen] = useState<number | null>(null);
  const index = new Map(data.inventory.map((it, i) => [it.id, i]));
  const assign = (slot: number, id: string) =>
    update((d) => ({ ...d, ...setHotSlot(d.inventory, d.hotSlots, slot, id) }));
  const free = data.inventory.filter((it) => !isBlankItem(it) && !data.hotSlots.includes(it.id));
  return (
    <>
      <div className="hotlist">
        {Array.from({ length: HOT_SLOTS }, (_, s) => {
          const idx = index.get(data.hotSlots[s]);
          const it = idx !== undefined ? data.inventory[idx] : null;
          const text = data.hotlist[s]?.trim();
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
                    onClick={() => assign(s, '')}
                  >
                    ×
                  </button>
                )}
              </div>
              {it ? (
                <>
                  <button type="button" className="hot-item link-btn" onClick={() => setOpen(idx!)}>
                    <strong>{it.item}</strong> <span className="loot-qty">×{Number(it.qty) || 1}</span>
                  </button>
                  {(it.notes || text) && <div className="dim tiny hot-notes">{it.notes || text}</div>}
                  {charId && <UseItemControls memberId={charId} it={it} manaMax={der.manaMax} run={runServer} />}
                </>
              ) : (
                <>
                  <Area path={['hotlist', s]} rows={2} placeholder={t('hot.textPh')} />
                  {!playLocked && free.length > 0 && (
                    <select
                      className="in sel tiny-sel"
                      value=""
                      aria-label={t('hot.assign')}
                      onChange={(e) => e.target.value && assign(s, e.target.value)}
                    >
                      <option value="">★ {t('hot.assign')}</option>
                      {free.map((x) => (
                        <option key={x.id} value={x.id}>
                          {x.item}
                          {(Number(x.qty) || 1) > 1 ? ` ×${x.qty}` : ''}
                        </option>
                      ))}
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
