import { useState } from 'react';
import {
  BONUS_KEYS,
  DEFAULT_SLOT_COUNTS,
  SLOT_KEYS,
  equipItem,
  fitsSlot,
  gearBonus,
  isBlankItem,
  sanitizeEquipped,
  slotList,
  type SlotInfo,
} from '../../shared/items.js';
import { useAuth } from '../lib/auth';
import { useI18n, type MsgKey } from '../lib/i18n';
import { signed } from '../lib/sheet';
import { Section, useSheet } from './fields';
import { bonusText, ItemDialog, rarityClass, slotLabel } from './Inventory';

/* The Equipment tab: a diagram of the body with each part's Equipment and Accessory slots, the hands, the neck and
   ten fingers. Equipped items add their bonuses to the crawler automatically. */

/** Where each part sits on the diagram (grid areas around the figure). */
const PARTS: { part: string; area: string }[] = [
  { part: 'head', area: 'head' },
  { part: 'neck', area: 'neck' },
  { part: 'shoulders', area: 'shoulders' },
  { part: 'back', area: 'back' },
  { part: 'chest', area: 'chest' },
  { part: 'bracers', area: 'bracers' },
  { part: 'hands', area: 'hands' },
  { part: 'waist', area: 'waist' },
  { part: 'mainHand', area: 'main' },
  { part: 'offHand', area: 'off' },
  { part: 'pants', area: 'pants' },
  { part: 'feet', area: 'feet' },
];

export function EquipmentTab() {
  const { t } = useI18n();
  const { data } = useSheet();
  const { user } = useAuth();
  const [open, setOpen] = useState<number | null>(null);
  const slots = slotList(data.slotCounts);
  const byPart = (part: string) => slots.filter((s) => s.part === part);
  const fingers = byPart('finger');
  const worn = new Set(data.inventory.filter((it) => it.slot && !isBlankItem(it)).map((it) => it.slot.split('.')[1]));
  const totals = BONUS_KEYS.map((k) => ({ k, b: gearBonus(data.inventory, k) })).filter((x) => x.b.total !== 0);
  return (
    <div className="equip-page">
      <Section title={t('equip.title')} tone="red">
        <p className="dim tiny">{t('equip.hint')}</p>
        {totals.length > 0 && (
          <div className="equip-totals">
            {totals.map(({ k, b }) => (
              <span key={k} className="pill gold" title={b.from.map((f) => `${f.name} ${signed(f.value)}`).join(', ')}>
                {t(`bonus.${k}` as MsgKey)} {signed(b.total)}
              </span>
            ))}
          </div>
        )}
        <div className="paperdoll">
          <Figure worn={worn} />
          {PARTS.map(({ part, area }) => {
            const here = byPart(part);
            if (!here.length) return null;
            return (
              <div key={part} className={`doll-part area-${area}`}>
                <div className="doll-part-head">{t(`part.${part}` as MsgKey)}</div>
                {here.map((s) => (
                  <SlotBox key={s.id} slot={s} onOpen={setOpen} />
                ))}
              </div>
            );
          })}
          {fingers.length > 0 && (
            <div className="doll-part area-fingers">
              <div className="doll-part-head">{t('equip.fingers')}</div>
              <div className="finger-grid">
                {fingers.map((s) => (
                  <SlotBox key={s.id} slot={s} onOpen={setOpen} compact />
                ))}
              </div>
            </div>
          )}
        </div>
      </Section>
      {user?.isAdmin && <SlotCountEditor />}
      {open !== null && <ItemDialog i={open} onClose={() => setOpen(null)} />}
    </div>
  );
}

/** One slot: the item in it (tap for details, × to take it off), or a picker of carried items that fit. */
function SlotBox({ slot, onOpen, compact }: { slot: SlotInfo; onOpen: (i: number) => void; compact?: boolean }) {
  const { t } = useI18n();
  const { data, update, playLocked } = useSheet();
  const i = data.inventory.findIndex((it) => it.slot === slot.id);
  const it = i >= 0 ? data.inventory[i] : null;
  const kindLbl = slot.kind === 'acc' ? t('itemType.accessory') : t('itemType.equipment');
  const many = (DEFAULT_SLOT_COUNTS[slot.key] ?? 1) > 1 || slot.n > 1;
  const label = compact || many ? `${kindLbl} ${slot.n}` : kindLbl;
  const blockedBy =
    slot.key === 'eq.offHand'
      ? data.inventory.find((x) => x.twoHanded && x.slot.startsWith('eq.mainHand.') && !isBlankItem(x))
      : undefined;
  const fitting = data.inventory
    .map((x, j) => ({ x, j }))
    .filter(({ x }) => !isBlankItem(x) && x.slot !== slot.id && fitsSlot(x, slot.id));
  const equip = (id: string) => update((d) => ({ ...d, inventory: equipItem(d.inventory, id, slot.id) }));
  return (
    <div className={`slot-box kind-${slot.kind} ${it ? `filled ${rarityClass(it.rarity)}` : ''}`}>
      <span className="slot-kind">{compact ? slot.n : label}</span>
      {it ? (
        <span className="slot-fill">
          <button type="button" className="link-btn slot-item-name" onClick={() => onOpen(i)} title={it.notes}>
            <strong>{it.item}</strong>
            {!compact && bonusText(it, t) && <span className="dim tiny"> {bonusText(it, t)}</span>}
          </button>
          {!playLocked && (
            <button
              type="button"
              className="icon-btn small"
              title={t('equip.unequip')}
              aria-label={t('equip.unequip')}
              onClick={() => update((d) => ({ ...d, inventory: equipItem(d.inventory, it.id, '') }))}
            >
              ×
            </button>
          )}
        </span>
      ) : blockedBy ? (
        <span className="dim tiny">{t('equip.twoHandedBusy', { item: blockedBy.item })}</span>
      ) : !playLocked && fitting.length > 0 ? (
        <select
          className="in sel tiny-sel"
          value=""
          aria-label={t('inv.equipTo', { slot: slotLabel(slot.id, t) })}
          onChange={(e) => e.target.value && equip(e.target.value)}
        >
          <option value="">+ {t('inv.equipShort')}</option>
          {fitting.map(({ x }) => (
            <option key={x.id} value={x.id}>
              {x.item}
              {x.slot ? ` (${slotLabel(x.slot, t)})` : ''}
            </option>
          ))}
        </select>
      ) : (
        <span className="dim tiny">—</span>
      )}
    </div>
  );
}

/** GM only: how many slots of each kind this crawler has (Races and Classes add or take away slots). */
function SlotCountEditor() {
  const { t } = useI18n();
  const { data, update, playLocked } = useSheet();
  const setCount = (key: string, v: string) =>
    update((d) => {
      const slotCounts = { ...d.slotCounts, [key]: v.replace(/[^\d]/g, '').slice(0, 2) };
      return { ...d, slotCounts, inventory: sanitizeEquipped(d.inventory, slotCounts) };
    });
  return (
    <Section title={t('equip.counts')} className="gm-only-section">
      <p className="dim tiny">{t('equip.countsHint')}</p>
      <div className="slot-counts">
        {SLOT_KEYS.map((key) => {
          const [kind, part] = key.split('.');
          return (
            <label key={key} className="mini">
              <span>
                {t(`part.${part}` as MsgKey)} · {kind === 'acc' ? t('itemType.accessory') : t('itemType.equipment')}
              </span>
              <input
                className="in center"
                inputMode="numeric"
                disabled={playLocked}
                value={data.slotCounts[key] ?? ''}
                placeholder={String(DEFAULT_SLOT_COUNTS[key])}
                onChange={(e) => setCount(key, e.target.value)}
              />
            </label>
          );
        })}
      </div>
    </Section>
  );
}

/** A plain figure in the middle of the diagram; parts with something equipped glow. */
function Figure({ worn }: { worn: Set<string> }) {
  const on = (p: string) => (worn.has(p) ? 'on' : '');
  return (
    <svg className="doll-figure" viewBox="0 0 120 260" aria-hidden>
      <circle className={on('head')} cx="60" cy="26" r="18" />
      <rect className={on('neck')} x="54" y="44" width="12" height="8" rx="3" />
      <rect className={on('shoulders')} x="26" y="52" width="68" height="12" rx="6" />
      <rect className={`${on('chest')} ${on('back')}`} x="38" y="62" width="44" height="58" rx="8" />
      <rect className={on('bracers')} x="18" y="66" width="14" height="52" rx="7" />
      <rect className={on('bracers')} x="88" y="66" width="14" height="52" rx="7" />
      <circle className={`${on('hands')} ${on('mainHand')}`} cx="25" cy="128" r="8" />
      <circle className={`${on('hands')} ${on('offHand')}`} cx="95" cy="128" r="8" />
      <rect className={on('waist')} x="38" y="120" width="44" height="12" rx="4" />
      <rect className={on('pants')} x="40" y="132" width="18" height="90" rx="8" />
      <rect className={on('pants')} x="62" y="132" width="18" height="90" rx="8" />
      <ellipse className={on('feet')} cx="47" cy="232" rx="13" ry="7" />
      <ellipse className={on('feet')} cx="73" cy="232" rx="13" ry="7" />
    </svg>
  );
}
