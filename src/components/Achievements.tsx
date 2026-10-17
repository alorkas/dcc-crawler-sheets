import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, type Award, type LootBox, type Reward, type RewardItem } from '../lib/api';
import { useAuth } from '../lib/auth';
import { useI18n, type MsgKey } from '../lib/i18n';
import { useLiveOptional } from '../lib/live';
import { Section, useSheet } from './fields';
import { bonusText, rarityClass } from './Inventory';
import { emptyItem, type Item } from '../lib/sheet';

type T = ReturnType<typeof useI18n>['t'];

/** "Gold Adventurer Box" / "Caja de Aventurero de Oro" (or the GM's own name for it). */
export const boxName = (t: T, b: Pick<LootBox, 'tier' | 'kind' | 'label'>) =>
  b.label || t('box.name', { kind: t(`box.kind.${b.kind}` as MsgKey), tier: t(`box.tierOf.${b.tier}` as MsgKey) });

/** Items that get the spotlight when a box opens. */
export const isSpecial = (it: RewardItem) =>
  it.special || it.unique || ['legendary', 'celestial', 'unique'].includes(it.rarity);

export function BoxChip({ box, sealed }: { box: Pick<LootBox, 'tier' | 'kind' | 'label'>; sealed?: boolean }) {
  const { t } = useI18n();
  return (
    <span className={`box-chip ${rarityClass(box.tier)}`}>
      <span className="box-chip-icon" aria-hidden>
        ▣
      </span>
      {boxName(t, box)}
      {sealed && <span className="dim tiny"> · {t('ach.sealed')}</span>}
    </span>
  );
}

const fmtDate = (iso: string | null, locale: string) =>
  iso ? new Date(iso).toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' }) : '';

/** A crawler's achievements, for the sheet tab and the tab badge. Refetched when the server says they changed. */
export function useAwards(charId: number | undefined) {
  const live = useLiveOptional();
  const tick = live?.awardsTick ?? 0;
  const [state, setState] = useState<{ claimLocked: boolean; awards: Award[] } | null>(null);
  const [error, setError] = useState<unknown>(null);
  const load = useCallback(() => {
    if (!charId) return;
    api
      .awards(charId)
      .then((s) => {
        setState(s);
        setError(null);
      })
      .catch((e) => setError(e ?? new Error()));
  }, [charId]);
  useEffect(load, [load, tick]);
  return { state, error, load };
}

/* ---------------- sheet tab ---------------- */
export function AchievementsTab() {
  const { t, err, locale } = useI18n();
  const { user } = useAuth();
  const { charId, runServer } = useSheet();
  const { state, error, load } = useAwards(charId);
  const [busy, setBusy] = useState<number | null>(null);
  const [claimError, setClaimError] = useState<unknown>(null);
  const [opening, setOpening] = useState<{ title: string; reward: Reward; replay: boolean } | null>(null);
  const admin = !!user?.isAdmin;
  const blocked = !!state?.claimLocked && !admin;

  async function claim(w: Award) {
    setBusy(w.id);
    setClaimError(null);
    try {
      const r = await runServer(() => api.claimAward(w.id));
      setOpening({ title: w.title, reward: r.opened, replay: false });
      load();
    } catch (e) {
      setClaimError(e);
      load();
    } finally {
      setBusy(null);
    }
  }

  return (
    <Section
      title={t('ach.title')}
      actions={
        admin ? (
          <Link className="btn small ghost head-btn" to="/admin/achievements">
            {t('ach.manage')}
          </Link>
        ) : undefined
      }
    >
      {state?.claimLocked && <div className="ach-locked">🔒 {t('ach.lockedMsg')}</div>}
      {!!error && <p className="error">{err(error)}</p>}
      {!!claimError && <p className="error">{err(claimError)}</p>}
      {!state && !error && <p className="dim">{t('common.loading')}</p>}
      {state && state.awards.length === 0 && <p className="dim">{t('ach.empty')}</p>}
      <div className="ach-list">
        {state?.awards.map((w) => {
          const contents = w.claimedAt ? (w.opened ?? w.reward) : w.reward;
          return (
            <article key={w.id} className={`ach-card ${w.claimedAt ? 'claimed' : ''}`}>
              <div className="ach-trophy" aria-hidden>
                🏆
              </div>
              <div className="ach-main">
                <div className="ach-head">
                  <h3>{w.title}</h3>
                  <span className="dim small">{t('ach.awardedOn', { date: fmtDate(w.awardedAt, locale) })}</span>
                </div>
                {w.description && <p className="ach-desc">{w.description}</p>}
                {w.hasReward && (
                  <div className="ach-reward">
                    <span className="lbl">{t('ach.reward')}</span>
                    <div className="box-chips">
                      {contents.boxes.map((b, i) => (
                        <BoxChip key={i} box={b} sealed={!w.claimedAt} />
                      ))}
                      {!contents.boxes.length && !w.claimedAt && <span className="dim small">{t('ach.surprise')}</span>}
                    </div>
                    {w.claimedAt && contents.note && <p className="ach-note">{contents.note}</p>}
                    {admin && !w.claimedAt && <RewardPreview reward={w.reward} />}
                  </div>
                )}
                <div className="ach-actions">
                  {w.hasReward && !w.claimedAt && (
                    <>
                      <button
                        type="button"
                        className="btn primary claim-btn"
                        disabled={blocked || busy !== null}
                        onClick={() => claim(w)}
                        title={blocked ? t('ach.lockedMsg') : undefined}
                      >
                        {busy === w.id ? t('ach.opening') : t('ach.claim')}
                      </button>
                      {blocked && <span className="dim small">{t('ach.lockedMsg')}</span>}
                    </>
                  )}
                  {w.claimedAt && (
                    <>
                      <span className="ach-claimed">
                        ✓ {t('ach.claimedOn', { date: fmtDate(w.claimedAt, locale) })}
                      </span>
                      {(contents.boxes.length > 0 || contents.note) && (
                        <button
                          type="button"
                          className="btn small ghost"
                          onClick={() => setOpening({ title: w.title, reward: contents, replay: true })}
                        >
                          {t('ach.seeContents')}
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
      {opening && (
        <LootBoxOpening
          title={opening.title}
          reward={opening.reward}
          instant={opening.replay}
          onClose={() => setOpening(null)}
        />
      )}
    </Section>
  );
}

/** GM-only peek at what's inside before the crawler claims it. */
function RewardPreview({ reward }: { reward: Reward }) {
  const { t } = useI18n();
  const items = reward.boxes.flatMap((b) => b.items);
  if (!items.length && !reward.note) return null;
  return (
    <div className="ach-gm-peek">
      <span className="pill tiny-pill">{t('ach.gmPeek')}</span>{' '}
      {items.map((it) => `${it.item}${Number(it.qty) > 1 ? ` ×${it.qty}` : ''}`).join(', ')}
      {reward.note && <span className="dim"> · {reward.note}</span>}
    </div>
  );
}

/* ---------------- opening animation ---------------- */
export function LootBoxOpening({
  title,
  reward,
  instant = false,
  onClose,
}: {
  title: string;
  reward: Reward;
  instant?: boolean;
  onClose: () => void;
}) {
  const { t } = useI18n();
  const [idx, setIdx] = useState(0);
  const [open, setOpen] = useState(instant);
  const box = reward.boxes[idx];
  const last = idx >= reward.boxes.length - 1;

  // the box shakes for a moment, then pops open by itself (or on click)
  useEffect(() => {
    if (open || !box) return;
    const id = setTimeout(() => setOpen(true), 1800);
    return () => clearTimeout(id);
  }, [open, box]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const special = box?.items.filter(isSpecial) ?? [];
  const regular = box?.items.filter((it) => !isSpecial(it)) ?? [];
  return (
    <div className="modal-back loot-back" onClick={open ? onClose : undefined}>
      <div
        className={`modal loot-modal ${box ? rarityClass(box.tier) : ''}`}
        role="dialog"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="loot-title">
          <span className="dim small">{t('ach.rewardFor', { title })}</span>
          {reward.boxes.length > 1 && (
            <span className="dim small">
              {idx + 1}/{reward.boxes.length}
            </span>
          )}
        </div>
        {box && (
          <>
            <button
              type="button"
              className={`lootbox ${open ? 'is-open' : 'is-sealed'}`}
              onClick={() => setOpen(true)}
              disabled={open}
              aria-label={t('ach.openBox')}
            >
              <span className="lootbox-rays" aria-hidden />
              <span className="lootbox-lid" aria-hidden />
              <span className="lootbox-body" aria-hidden>
                <span className="lootbox-mark">?</span>
              </span>
            </button>
            <h2 className="loot-name">{boxName(t, box)}</h2>
            <div className="loot-sub">
              <span className={`pill rar-pill ${rarityClass(box.tier)}`}>{t(`rarity.${box.tier}` as MsgKey)}</span>
              {box.label && <span className="dim small">{t(`box.kind.${box.kind}` as MsgKey)}</span>}
            </div>
            {!open && <p className="dim small center">{t('ach.tapToOpen')}</p>}
            {open && (
              <div className="loot-contents">
                {box.items.length === 0 && <p className="dim center">{t('ach.emptyBox')}</p>}
                {special.map((it, i) => (
                  <div
                    key={`s${i}`}
                    className={`loot-special ${rarityClass(it.rarity || 'legendary')}`}
                    style={{ animationDelay: instant ? '0ms' : `${300 + i * 350}ms` }}
                  >
                    <div className="loot-special-head">
                      <span className="loot-star" aria-hidden>
                        ★
                      </span>
                      <strong>{it.item}</strong>
                      {Number(it.qty) > 1 && <span className="dim"> ×{it.qty}</span>}
                      {it.rarity && (
                        <span className={`pill tiny-pill rar-pill ${rarityClass(it.rarity)}`}>
                          {t(`rarity.${it.rarity}` as MsgKey)}
                        </span>
                      )}
                    </div>
                    {it.notes && <p>{it.notes}</p>}
                    <ItemExtras it={it} />
                  </div>
                ))}
                {regular.length > 0 && (
                  <ul className="loot-items">
                    {regular.map((it, i) => (
                      <li
                        key={i}
                        className={rarityClass(it.rarity)}
                        style={{
                          animationDelay: instant ? '0ms' : `${300 + (special.length * 350 + i * 140)}ms`,
                        }}
                      >
                        <div className="loot-item-head">
                          <strong>{it.item}</strong>
                          <span className="loot-qty">×{Number(it.qty) || 1}</span>
                          {it.type && <span className="dim tiny">{t(`itemType.${it.type}` as MsgKey)}</span>}
                          {it.rarity && (
                            <span className={`pill tiny-pill rar-pill ${rarityClass(it.rarity)}`}>
                              {t(`rarity.${it.rarity}` as MsgKey)}
                            </span>
                          )}
                        </div>
                        {it.notes && <div className="dim small">{it.notes}</div>}
                        <ItemExtras it={it} />
                      </li>
                    ))}
                  </ul>
                )}
                {box.items.length > 0 && !instant && <p className="ok small center">{t('ach.added')}</p>}
              </div>
            )}
          </>
        )}
        {(open || !box) && last && reward.note && (
          <div className="ach-note loot-note">
            <span className="lbl">{t('ach.alsoReward')}</span>
            <p>{reward.note}</p>
          </div>
        )}
        <div className="modal-actions">
          {open && !last ? (
            <button
              type="button"
              className="btn primary"
              onClick={() => {
                setIdx(idx + 1);
                setOpen(instant);
              }}
            >
              {t('ach.nextBox', { n: idx + 2, total: reward.boxes.length })}
            </button>
          ) : (
            <button type="button" className="btn primary" onClick={onClose} disabled={!!box && !open}>
              {t('common.close')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function ItemExtras({ it }: { it: RewardItem }) {
  const { t } = useI18n();
  const full: Item = { ...emptyItem(), ...it, bonus: { ...emptyItem().bonus, ...it.bonus } };
  const bonus = bonusText(full, t);
  if (!bonus && !it.upgrades) return null;
  return (
    <div className="dim tiny">
      {bonus}
      {bonus && it.upgrades && ' · '}
      {it.upgrades}
    </div>
  );
}
