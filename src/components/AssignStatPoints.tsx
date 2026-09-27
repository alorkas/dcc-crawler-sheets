import { useState } from 'react';
import { useSheet } from './fields';
import { useI18n, type MsgKey } from '../lib/i18n';
import { assignStatPoints, num, statModFromScore } from '../lib/rules';
import { signed, type StatKey } from '../lib/sheet';

const KEYS: StatKey[] = ['str', 'int', 'con', 'dex', 'cha'];

/**
 * Spend level-up Stat points (in a saferoom, with the sheet unlocked). Each point raises both the Enhanced and
 * the Unenhanced value; the new Stat Mods are previewed before applying.
 */
export function AssignStatPoints({ compact }: { compact?: boolean }) {
  const { data, locked } = useSheet();
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const points = num(data.statPoints) ?? 0;
  if (points <= 0) return null;
  if (!compact || locked) return <AssignPanel onDone={() => setOpen(false)} />;
  // narrow places (the Stats column): a banner that opens the helper in a dialog
  return (
    <>
      <div className="assign-points assign-banner">
        <strong>{t('assign.pending', { n: points })}</strong>
        <button type="button" className="btn small primary" onClick={() => setOpen(true)}>
          {t('assign.open')}
        </button>
      </div>
      {open && (
        <div className="modal-back" onClick={() => setOpen(false)}>
          <div className="modal assign-modal" onClick={(e) => e.stopPropagation()}>
            <AssignPanel onDone={() => setOpen(false)} />
            <div className="modal-actions">
              <button type="button" className="btn ghost" onClick={() => setOpen(false)}>
                {t('common.close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function AssignPanel({ onDone }: { onDone: () => void }) {
  const { data, locked, update } = useSheet();
  const { t } = useI18n();
  const [alloc, setAlloc] = useState<Record<StatKey, number>>({ str: 0, int: 0, con: 0, dex: 0, cha: 0 });
  const points = num(data.statPoints) ?? 0;
  if (points <= 0) return null;
  if (locked) {
    return (
      <div className="assign-points is-locked-note">
        <strong>{t('assign.pending', { n: points })}</strong>
        <span className="dim small"> {t('assign.unlockHint')}</span>
      </div>
    );
  }
  const spent = KEYS.reduce((s, k) => s + alloc[k], 0);
  const left = points - spent;
  const add = (k: StatKey, n: number) => setAlloc((a) => ({ ...a, [k]: Math.max(0, a[k] + n) }));
  const apply = () => {
    const summary = KEYS.filter((k) => alloc[k])
      .map((k) => `${t(`stat.${k}.short` as MsgKey)} +${alloc[k]}`)
      .join(', ');
    update((d) => assignStatPoints(d, alloc) ?? d, t('assign.done', { list: summary }));
    setAlloc({ str: 0, int: 0, con: 0, dex: 0, cha: 0 });
    if (spent >= points) onDone();
  };
  return (
    <div className="assign-points">
      <div className="assign-head">
        <strong>{t('assign.title')}</strong>
        <span className={`pill ${left > 0 ? 'gold' : ''}`}>{t('assign.left', { n: left, total: points })}</span>
      </div>
      <div className="assign-grid">
        {KEYS.map((k) => {
          const s = data.stats[k];
          const cur = num(s.enhanced) ?? num(s.unenhanced) ?? 0;
          const next = cur + alloc[k];
          const modNow = statModFromScore(cur);
          const modNext = statModFromScore(next);
          const modUp = alloc[k] > 0 && modNext !== modNow;
          return (
            <div key={k} className={`assign-row ${alloc[k] ? 'changed' : ''}`}>
              <span className="assign-stat">{t(`stat.${k}` as MsgKey)}</span>
              <span className="dim small">
                {cur} ({signed(modNow)})
              </span>
              <div className="assign-ctrl">
                <button
                  type="button"
                  className="btn small ghost"
                  disabled={!alloc[k]}
                  aria-label={t('assign.minus', { stat: t(`stat.${k}` as MsgKey) })}
                  onClick={() => add(k, -1)}
                >
                  −
                </button>
                <span className="assign-n">{alloc[k] ? `+${alloc[k]}` : '0'}</span>
                <button
                  type="button"
                  className="btn small ghost"
                  disabled={left <= 0}
                  aria-label={t('assign.plus', { stat: t(`stat.${k}` as MsgKey) })}
                  onClick={() => add(k, 1)}
                >
                  +
                </button>
              </div>
              <span className={`assign-next ${modUp ? 'mod-up' : ''}`}>
                {alloc[k] ? (
                  <>
                    → {next} ({signed(modNext)}){modUp && ' ▲'}
                  </>
                ) : (
                  ''
                )}
              </span>
            </div>
          );
        })}
      </div>
      <div className="assign-actions">
        <span className="dim tiny">{t('assign.hint')}</span>
        <button
          type="button"
          className="btn small ghost"
          disabled={!spent}
          onClick={() => setAlloc({ str: 0, int: 0, con: 0, dex: 0, cha: 0 })}
        >
          {t('assign.reset')}
        </button>
        <button type="button" className="btn small primary" disabled={!spent} onClick={apply}>
          {t('assign.apply', { n: spent })}
        </button>
      </div>
    </div>
  );
}
