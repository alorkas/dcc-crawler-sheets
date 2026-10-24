import { useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { ItemCard } from '../../shared/items.js';
import { useI18n, type MsgKey } from '../lib/i18n';
import { signed } from '../lib/sheet';

/* An item's name in the log as a pill that shows the whole item (type, rarity, bonuses, what it does) on hover,
   focus or tap. The card is drawn on top of the page, so the log's scroll box doesn't cut it off. */

const rarClass = (r: string) => (r ? `rar-${r}` : '');
const n = (v: string | undefined) => Number(String(v ?? '').match(/[+-]?\d+/)?.[0] ?? 0);

export function ItemPill({ card, qty, className = '' }: { card: ItemCard; qty?: string | number; className?: string }) {
  const ref = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [pinned, setPinned] = useState(false);
  const show = open || pinned;
  return (
    <>
      <button
        ref={ref}
        type="button"
        className={`pill tiny-pill rar-pill item-pill ${rarClass(card.rarity)} ${className}`}
        aria-expanded={show}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => {
          setOpen(false);
          setPinned(false);
        }}
        onClick={() => setPinned((p) => !p)}
      >
        {card.item}
        {Number(qty) > 1 ? ` ×${qty}` : ''}
      </button>
      {show && ref.current && createPortal(<ItemTip card={card} anchor={ref.current} />, document.body)}
    </>
  );
}

function ItemTip({ card, anchor }: { card: ItemCard; anchor: HTMLElement }) {
  const { t } = useI18n();
  const tip = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  useLayoutEffect(() => {
    const a = anchor.getBoundingClientRect();
    const el = tip.current;
    if (!el) return;
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    const left = Math.max(8, Math.min(window.innerWidth - w - 8, a.left));
    const below = a.bottom + 6;
    const top = below + h > window.innerHeight - 8 ? Math.max(8, a.top - h - 6) : below;
    setPos({ top, left });
  }, [anchor]);
  const bonuses = [
    n(card.bonus.damage) ? t('bonus.damageShort', { n: signed(n(card.bonus.damage)) }) : '',
    n(card.bonus.dr) ? t('bonus.drShort', { n: signed(n(card.bonus.dr)) }) : '',
    n(card.bonus.evade) ? t('bonus.evadeShort', { n: signed(n(card.bonus.evade)) }) : '',
    ...(['str', 'int', 'con', 'dex', 'cha'] as const).map((k) =>
      n(card.bonus[k]) ? `${t(`stat.${k}.short` as MsgKey)} ${signed(n(card.bonus[k]))}` : '',
    ),
  ].filter(Boolean);
  const kind = [
    card.type && t(`itemType.${card.type}` as MsgKey),
    card.fits && t(`part.${card.fits}` as MsgKey),
    card.ranged && t('itemTip.ranged'),
    card.twoHanded && t('inv.twoHanded'),
  ]
    .filter(Boolean)
    .join(' · ');
  return (
    <div
      ref={tip}
      className={`item-tip ${rarClass(card.rarity)}`}
      role="tooltip"
      style={pos ? { top: pos.top, left: pos.left } : { visibility: 'hidden', top: 0, left: 0 }}
    >
      <div className="item-tip-head">
        <strong>{card.item}</strong>
        {card.rarity && (
          <span className={`pill tiny-pill rar-pill ${rarClass(card.rarity)}`}>
            {t(`rarity.${card.rarity}` as MsgKey)}
          </span>
        )}
      </div>
      {kind && <div className="dim tiny">{kind}</div>}
      {bonuses.length > 0 && <div className="item-tip-bonus">{bonuses.join(' · ')}</div>}
      {card.charges && <div className="dim tiny">{t('itemTip.charges', { n: card.charges })}</div>}
      {card.notes && <p>{card.notes}</p>}
      {card.ability && card.ability !== card.notes && (
        <p>
          <span className="lbl">{t('itemTip.ability')}</span> {card.ability}
        </p>
      )}
      {card.curse && <p className="item-tip-curse">☠ {card.curse}</p>}
      {!card.notes && !card.ability && !bonuses.length && <p className="dim tiny">{t('itemTip.nothing')}</p>}
    </div>
  );
}
