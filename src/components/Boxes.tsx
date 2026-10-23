import { useCallback, useEffect, useState } from 'react';
import { api, type CrawlerBox, type Reward } from '../lib/api';
import { useAuth } from '../lib/auth';
import { useI18n } from '../lib/i18n';
import { useLiveOptional } from '../lib/live';
import { Section, useSheet } from './fields';
import { BoxChip, LootBoxOpening, boxName } from './Achievements';
import { ItemNameList, rarityClass } from './Inventory';
import { RewardEditor, newBox, tidy } from '../pages/AchievementsPage';

type T = ReturnType<typeof useI18n>['t'];
const fmtDate = (iso: string | null, locale: string) =>
  iso ? new Date(iso).toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' }) : '';

/** Where a box came from: "Achievement “First Blood”", "Sponsor: Borant Corp", "The GM". */
export const boxSource = (t: T, b: Pick<CrawlerBox, 'source' | 'title'>) =>
  b.source === 'achievement'
    ? t('boxes.from.achievement', { title: b.title })
    : b.source === 'quest'
      ? t('boxes.from.quest', { title: b.title })
      : b.source === 'sponsor'
        ? t('boxes.from.sponsor', { title: b.title || '?' })
        : b.title
          ? t('boxes.from.gmTitled', { title: b.title })
          : t('boxes.from.gm');

/** A crawler's loot boxes, for the sheet tab and its badge. Refetched when the server says they changed. */
export function useBoxes(charId: number | undefined) {
  const live = useLiveOptional();
  const tick = live?.boxesTick ?? 0;
  const [state, setState] = useState<{ inSaferoom: boolean; boxes: CrawlerBox[] } | null>(null);
  const [error, setError] = useState<unknown>(null);
  const load = useCallback(() => {
    if (!charId) return;
    api
      .crawlerBoxes(charId)
      .then((s) => {
        setState(s);
        setError(null);
      })
      .catch((e) => setError(e ?? new Error()));
  }, [charId]);
  useEffect(load, [load, tick]);
  return { state, error, load };
}

const asReward = (boxes: Pick<CrawlerBox, 'tier' | 'kind' | 'label' | 'items' | 'gold'>[]): Reward => ({
  boxes: boxes.map((b) => ({ tier: b.tier, kind: b.kind, label: b.label, items: b.items, gold: b.gold })),
  note: '',
});

/* ---------------- sheet tab ---------------- */
export function BoxesTab() {
  const { t, err, locale } = useI18n();
  const { user } = useAuth();
  const { charId, runServer } = useSheet();
  const { state, error, load } = useBoxes(charId);
  const [busy, setBusy] = useState(false);
  const [actError, setActError] = useState<unknown>(null);
  const [opening, setOpening] = useState<{ title: string; reward: Reward; replay: boolean } | null>(null);
  const [sending, setSending] = useState(false);
  const [showOpened, setShowOpened] = useState(false);
  const admin = !!user?.isAdmin;
  const canOpen = admin || !!state?.inSaferoom;
  const sealed = state?.boxes.filter((b) => !b.openedAt) ?? [];
  const opened = state?.boxes.filter((b) => b.openedAt) ?? [];

  async function open(list: CrawlerBox[]) {
    if (!list.length) return;
    setBusy(true);
    setActError(null);
    const got: CrawlerBox[] = [];
    try {
      for (const b of list) {
        const r = await runServer(() => api.openBox(b.id));
        got.push({ ...b, ...r.opened });
      }
    } catch (e) {
      setActError(e);
    } finally {
      setBusy(false);
      load();
      if (got.length)
        setOpening({
          title: got.length === 1 ? boxSource(t, got[0]) : t('boxes.title'),
          reward: asReward(got),
          replay: false,
        });
    }
  }

  return (
    <Section
      title={t('boxes.title')}
      actions={
        admin ? (
          <button type="button" className="btn small ghost head-btn" onClick={() => setSending(true)}>
            + {t('boxes.send')}
          </button>
        ) : undefined
      }
    >
      {state && (
        <div className={`saferoom-note ${state.inSaferoom ? 'on' : ''}`}>
          {state.inSaferoom ? `🛏 ${t('saferoom.youAreIn')}` : `🔒 ${t('saferoom.only')}`}
          {admin && !state.inSaferoom && <span className="dim small"> · {t('boxes.gmCanOpen')}</span>}
        </div>
      )}
      {!!error && <p className="error">{err(error)}</p>}
      {!!actError && <p className="error">{err(actError)}</p>}
      {!state && !error && <p className="dim">{t('common.loading')}</p>}
      {state && state.boxes.length === 0 && <p className="dim">{t('boxes.empty')}</p>}

      {sealed.length > 0 && (
        <>
          <div className="boxes-head">
            <span className="lbl">{t('boxes.sealed', { n: sealed.length })}</span>
            {sealed.length > 1 && (
              <button
                type="button"
                className={`btn small primary ${canOpen ? 'claim-btn' : ''}`}
                disabled={!canOpen || busy}
                onClick={() => open(sealed)}
              >
                {t('boxes.openAll')}
              </button>
            )}
          </div>
          <div className="box-grid">
            {sealed.map((b) => (
              <article key={b.id} className={`box-card ${rarityClass(b.tier)}`}>
                <div className="box-card-icon" aria-hidden>
                  ▣
                </div>
                <div className="box-card-main">
                  <strong>{boxName(t, b)}</strong>
                  <span className="dim small">{boxSource(t, b)}</span>
                  <span className="dim tiny">{t('boxes.receivedOn', { date: fmtDate(b.receivedAt, locale) })}</span>
                  {admin && (b.items.length > 0 || b.gold > 0) && (
                    <span className="ach-gm-peek">
                      <span className="pill tiny-pill">{t('ach.gmPeek')}</span>{' '}
                      {[
                        ...b.items.map((it) => `${it.item}${Number(it.qty) > 1 ? ` ×${it.qty}` : ''}`),
                        b.gold ? t('wallet.goldN', { n: b.gold }) : '',
                      ]
                        .filter(Boolean)
                        .join(', ')}
                    </span>
                  )}
                </div>
                <div className="box-card-actions">
                  <button
                    type="button"
                    className={`btn small primary ${canOpen ? 'claim-btn' : ''}`}
                    disabled={!canOpen || busy}
                    title={!canOpen ? t('saferoom.only') : undefined}
                    onClick={() => open([b])}
                  >
                    {canOpen ? t('boxes.open') : `🔒 ${t('boxes.open')}`}
                  </button>
                  {admin && (
                    <button
                      type="button"
                      className="icon-btn tiny-btn"
                      title={t('boxes.remove')}
                      onClick={() =>
                        confirm(t('boxes.removeConfirm', { box: boxName(t, b) })) &&
                        api.deleteBox(b.id).then(load).catch(setActError)
                      }
                    >
                      ×
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        </>
      )}

      {opened.length > 0 && (
        <button type="button" className="btn small ghost boxes-history-btn" onClick={() => setShowOpened((s) => !s)}>
          {showOpened ? t('boxes.hideOpened') : t('boxes.showOpened', { n: opened.length })}
        </button>
      )}
      {showOpened && (
        <ul className="box-history">
          {opened.map((b) => (
            <li key={b.id}>
              <BoxChip box={b} />
              <span className="dim small">
                {boxSource(t, b)} · {t('boxes.openedOn', { date: fmtDate(b.openedAt, locale) })}
              </span>
              <button
                type="button"
                className="btn small ghost"
                onClick={() => setOpening({ title: boxSource(t, b), reward: asReward([b]), replay: true })}
              >
                {t('ach.seeContents')}
              </button>
            </li>
          ))}
        </ul>
      )}

      {opening && (
        <LootBoxOpening
          title={opening.title}
          reward={opening.reward}
          instant={opening.replay}
          onClose={() => setOpening(null)}
        />
      )}
      {sending && charId && (
        <SendBoxes
          charId={charId}
          onClose={() => setSending(false)}
          onSent={() => {
            setSending(false);
            load();
          }}
        />
      )}
    </Section>
  );
}

/** GM: send sealed boxes to this crawler, from the GM or from a sponsor. */
function SendBoxes({ charId, onClose, onSent }: { charId: number; onClose: () => void; onSent: () => void }) {
  const { t, err } = useI18n();
  const [reward, setReward] = useState<Reward>({ boxes: [{ ...newBox(), kind: 'benefactor', gold: 0 }], note: '' });

  const [source, setSource] = useState<'gm' | 'sponsor'>('sponsor');
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const send = async () => {
    setError('');
    try {
      await api.sendBoxes(charId, tidy(reward).boxes, source, title);
      onSent();
    } catch (e) {
      setError(err(e));
    }
  };
  return (
    <div className="modal-back" onClick={onClose}>
      <div className="modal reward-modal" onClick={(e) => e.stopPropagation()}>
        <ItemNameList />
        <h2>{t('boxes.send')}</h2>
        <div className="send-box-from">
          <label className="field">
            <span className="lbl">{t('boxes.fromLbl')}</span>
            <select className="in sel" value={source} onChange={(e) => setSource(e.target.value as 'gm' | 'sponsor')}>
              <option value="sponsor">{t('boxes.src.sponsor')}</option>
              <option value="gm">{t('boxes.src.gm')}</option>
            </select>
          </label>
          <label className="field">
            <span className="lbl">{source === 'sponsor' ? t('boxes.sponsorName') : t('boxes.reason')}</span>
            <input
              className="in"
              value={title}
              maxLength={120}
              placeholder={source === 'sponsor' ? t('boxes.sponsorHint') : t('boxes.reasonHint')}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>
        </div>
        <RewardEditor value={reward} onChange={setReward} noNote />
        {error && <p className="error">{error}</p>}
        <div className="modal-actions">
          <button type="button" className="btn ghost" onClick={onClose}>
            {t('common.cancel')}
          </button>
          <button
            type="button"
            className="btn primary"
            disabled={!reward.boxes.length || (source === 'sponsor' && !title.trim())}
            onClick={send}
          >
            {t('boxes.sendN', { n: reward.boxes.length })}
          </button>
        </div>
      </div>
    </div>
  );
}
