import { useState } from 'react';
import { itemEffect } from '../../shared/combat.js';
import { api } from '../lib/api';
import { useI18n } from '../lib/i18n';
import { useLiveOptional } from '../lib/live';
import type { Item } from '../lib/sheet';
import { useSheet } from './fields';

type QuickItem = Pick<Item, 'id' | 'item' | 'qty' | 'notes'> & { hot?: boolean };

type Run = <T>(fn: () => Promise<T>) => Promise<T>;
const direct: Run = (fn) => fn();

/**
 * Use one of an item: healing and mana items apply themselves (to this crawler or, for healing, a party member);
 * in combat it takes an Action (an Interrupt in Crawler Reaction).
 */
export function UseItemControls({
  memberId,
  it,
  manaMax = null,
  run = direct,
}: {
  memberId: number;
  it: QuickItem;
  manaMax?: number | null;
  /** How to call the server (the sheet saves first and reloads after). */
  run?: Run;
}) {
  const { t, err } = useI18n();
  const live = useLiveOptional();
  const [target, setTarget] = useState(0);
  const [msg, setMsg] = useState<{ text: string; bad?: boolean } | null>(null);
  const party = (live?.party ?? []).filter((p) => p.id !== memberId);
  const fx = itemEffect(it.notes);
  const use = async () => {
    setMsg(null);
    try {
      const r = await run(() => api.useItem(memberId, it.id, target || undefined, manaMax));
      const ap = r.applied as { type: string; slots?: number } | null;
      setMsg({
        text:
          ap?.type === 'heal'
            ? t('quick.healed', { n: ap.slots ?? 0 })
            : ap?.type === 'mana'
              ? t('quick.mana')
              : t('quick.used', { n: r.left }),
      });
      if (live?.encounter?.active) live.setEncounter(await api.encounter());
    } catch (e) {
      setMsg({ text: err(e), bad: true });
    }
  };
  return (
    <span className="use-item">
      {fx?.type === 'heal' && party.length > 0 && (
        <select
          className="in sel tiny-sel"
          value={target || ''}
          aria-label={t('quick.on')}
          onChange={(e) => setTarget(Number(e.target.value) || 0)}
        >
          <option value="">{t('quick.self')}</option>
          {party.map((p) => (
            <option key={p.id} value={p.id}>
              {p.view.name || '?'}
            </option>
          ))}
        </select>
      )}
      <button type="button" className="btn small" disabled={(Number(it.qty) || 1) <= 0} onClick={use}>
        {t('quick.use')}
      </button>
      {msg && <span className={`tiny ${msg.bad ? 'error' : 'ok'}`}>{msg.text}</span>}
    </span>
  );
}

/** Quick-access items (the ones on the Hotlist): use one with a click. */
export function QuickItems({
  memberId,
  items,
  manaMax = null,
  run = direct,
}: {
  memberId: number;
  items: QuickItem[];
  manaMax?: number | null;
  run?: Run;
}) {
  const { t } = useI18n();
  const live = useLiveOptional();
  const hot = items.filter((it) => it.hot && it.item.trim() && (Number(it.qty) || 1) > 0);
  if (!hot.length) return null;
  const inFight = !!live?.encounter?.active && !!live.party?.some((p) => p.id === memberId);
  return (
    <div className="quick-items">
      <div className="lbl">
        ★ {t('quick.title')}
        {inFight && <span className="dim tiny"> · {t('quick.costs')}</span>}
      </div>
      <ul>
        {hot.map((it) => {
          const fx = itemEffect(it.notes);
          return (
            <li key={it.id}>
              <span className="grow" title={it.notes}>
                <strong>{it.item}</strong> <span className="loot-qty">×{Number(it.qty) || 1}</span>
                {fx?.type === 'heal' && <span className="dim tiny"> · {t('quick.heals', { n: fx.amount })}</span>}
              </span>
              <UseItemControls memberId={memberId} it={it} manaMax={manaMax} run={run} />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/** On the sheet (Core tab, under the attacks): the crawler's quick-access items, from the sheet's own data. */
export function SheetQuickItems() {
  const { charId, data, runServer, der } = useSheet();
  // in Hotlist order
  const hot = data.hotSlots
    .map((id) => data.inventory.find((it) => it.id === id && it.item.trim()))
    .filter((it): it is Item => !!it);
  if (!charId || !hot.length) return null;
  return <QuickItems memberId={charId} items={hot} manaMax={der.manaMax} run={runServer} />;
}
