import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, type CrawlerQuest, type QuestReward } from '../lib/api';
import { useAuth } from '../lib/auth';
import { useI18n, type MsgKey } from '../lib/i18n';
import { useLiveOptional } from '../lib/live';
import { Section, useSheet } from './fields';
import { LootBoxOpening } from './Achievements';
import { RewardLine } from '../pages/QuestsPage';

const fmtDate = (iso: string | null, locale: string) =>
  iso ? new Date(iso).toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' }) : '';

type QuestsState = { claimLocked: boolean; inSaferoom: boolean; quests: CrawlerQuest[] };

/** A crawler's quests, for the sheet tab and its badge. Refetched when the server says they changed. */
export function useQuests(charId: number | undefined) {
  const live = useLiveOptional();
  const tick = `${live?.questsTick ?? 0}.${live?.awardsTick ?? 0}`;
  const [state, setState] = useState<QuestsState | null>(null);
  const [error, setError] = useState<unknown>(null);
  const load = useCallback(() => {
    if (!charId) return;
    api
      .crawlerQuests(charId)
      .then((s) => {
        setState(s);
        setError(null);
      })
      .catch((e) => setError(e ?? new Error()));
  }, [charId]);
  useEffect(load, [load, tick]);
  return { state, setState, error, load };
}

/** Boxes from a completed quest still sealed. */
const boxesWaiting = (q: CrawlerQuest) => !!q.grantedAt && q.reward.boxes.length > 0 && !q.openedAt;
/** The tab's badge: quests in progress and sealed boxes waiting for a Saferoom. */
export const questsPending = (list: CrawlerQuest[] | undefined) =>
  (list ?? []).filter((q) => q.status === 'active' || boxesWaiting(q)).length;

const ORDER = (q: CrawlerQuest) => (boxesWaiting(q) ? 0 : q.status === 'active' ? 1 : q.status === 'completed' ? 2 : 3);

/* ---------------- sheet tab ---------------- */
export function QuestsTab() {
  const { t, err, locale } = useI18n();
  const { user } = useAuth();
  const { charId, runServer } = useSheet();
  const { state, setState, error, load } = useQuests(charId);
  const [busy, setBusy] = useState<number | null>(null);
  const [actError, setActError] = useState<unknown>(null);
  const [opening, setOpening] = useState<{ title: string; reward: QuestReward; replay: boolean } | null>(null);
  const [showClosed, setShowClosed] = useState(false);
  const admin = !!user?.isAdmin;
  const locked = !!state?.claimLocked && !admin;
  const safe = !!state?.inSaferoom || admin;

  // objectives tick at once (everyone on the quest sees it through the live update)
  function tick(q: CrawlerQuest, objId: string, done: boolean) {
    setState(
      (s) =>
        s && {
          ...s,
          quests: s.quests.map((x) =>
            x.questId === q.questId
              ? { ...x, objectives: x.objectives.map((o) => (o.id === objId ? { ...o, done } : o)) }
              : x,
          ),
        },
    );
    setActError(null);
    api.tickObjective(q.linkId, objId, done).catch(setActError).finally(load);
  }
  async function openBoxes(q: CrawlerQuest) {
    setBusy(q.linkId);
    setActError(null);
    try {
      const r = await runServer(() => api.openQuestBoxes(q.linkId));
      // the Levels came with the completion; the opening shows only the boxes (and the note)
      setOpening({ title: q.title, reward: { ...r.opened, levels: 0 }, replay: false });
    } catch (e) {
      setActError(e);
    } finally {
      setBusy(null);
      load();
    }
  }

  const all = [...(state?.quests ?? [])].sort((a, b) => ORDER(a) - ORDER(b));
  const closed = all.filter((q) => q.status !== 'active' && !boxesWaiting(q));
  const open = all.filter((q) => !closed.includes(q));
  const list = showClosed ? all : open;
  const waiting = all.filter(boxesWaiting).length;

  return (
    <Section
      title={t('quest.title')}
      actions={
        admin ? (
          <Link className="btn small ghost head-btn" to="/admin/quests">
            {t('quest.manage')}
          </Link>
        ) : undefined
      }
    >
      {state && waiting > 0 && (
        <div className={`saferoom-note ${state.inSaferoom ? 'on' : ''}`}>
          {state.inSaferoom ? `🛏 ${t('saferoom.youAreIn')}` : `🔒 ${t('saferoom.boxesWait')}`}
        </div>
      )}
      {state?.claimLocked && <div className="ach-locked">🔒 {t('ach.lockedMsg')}</div>}
      {!!error && <p className="error">{err(error)}</p>}
      {!!actError && <p className="error">{err(actError)}</p>}
      {!state && !error && <p className="dim">{t('common.loading')}</p>}
      {state && all.length === 0 && <p className="dim">{t('quest.empty')}</p>}
      {state && all.length > 0 && open.length === 0 && !showClosed && <p className="dim">{t('quest.noneOpen')}</p>}
      <div className="ach-list quest-list">
        {list.map((q) => {
          const done = q.objectives.filter((o) => o.done).length;
          const contents = q.openedAt ? (q.opened ?? q.reward) : q.reward;
          return (
            <article
              key={q.linkId}
              className={`ach-card quest-card st-${q.status} ${boxesWaiting(q) ? 'boxes-waiting' : ''}`}
            >
              <div className="ach-trophy" aria-hidden>
                {q.status === 'completed' ? '✔' : q.status === 'failed' ? '✖' : '📜'}
              </div>
              <div className="ach-main">
                <div className="ach-head">
                  <h3>{q.title}</h3>
                  <span className="quest-meta">
                    {q.hidden && <span className="pill tiny-pill">{t('quest.hidden')}</span>}
                    <span className={`pill tiny-pill quest-st st-${q.status}`}>
                      {t(`quest.status.${q.status}` as MsgKey)}
                    </span>
                  </span>
                </div>
                <div className="dim small quest-sub">
                  <span>{t('quest.givenBy', { giver: q.giver || t('quest.systemAi') })}</span>
                  {q.floor > 0 && <span>{t('quest.floorN', { n: q.floor })}</span>}
                  <span>{t('quest.assignedOn', { date: fmtDate(q.assignedAt, locale) })}</span>
                </div>
                {q.description && <p className="ach-desc">{q.description}</p>}
                {q.objectives.length > 0 && (
                  <>
                    <div className="lbl">
                      {t('quest.objectives')}{' '}
                      <span className="dim tiny">
                        {done}/{q.objectives.length}
                      </span>
                    </div>
                    <ul className="quest-objs">
                      {q.objectives.map((o) => (
                        <li key={o.id} className={o.done ? 'done' : ''}>
                          <label>
                            <input
                              type="checkbox"
                              checked={o.done}
                              disabled={q.status !== 'active'}
                              onChange={(e) => tick(q, o.id, e.target.checked)}
                            />
                            {o.text}
                          </label>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
                {(q.hasReward || admin) && (
                  <RewardLine reward={contents} gm={admin && !q.openedAt} sealed={!q.openedAt} />
                )}
                {q.penalty && q.status !== 'completed' && (
                  <div className={`quest-penalty ${q.status === 'failed' ? 'hit' : ''}`}>
                    <span className="lbl">{t(q.status === 'failed' ? 'quest.penaltyHit' : 'quest.penalty')}</span>
                    <p>{q.penalty}</p>
                  </div>
                )}
                <div className="ach-actions">
                  {q.grantedAt && q.reward.levels > 0 && (
                    <span className="ach-claimed">✓ {t('quest.levelsGiven', { n: q.reward.levels })}</span>
                  )}
                  {boxesWaiting(q) && (
                    <>
                      <button
                        type="button"
                        className={`btn primary ${safe && !locked ? 'claim-btn' : ''}`}
                        disabled={!safe || locked || busy !== null}
                        onClick={() => openBoxes(q)}
                        title={!safe ? t('saferoom.only') : locked ? t('ach.lockedMsg') : undefined}
                      >
                        {busy === q.linkId ? t('ach.opening') : t('quest.openBoxes')}
                      </button>
                      {!safe && <span className="dim small">🔒 {t('saferoom.only')}</span>}
                    </>
                  )}
                  {q.openedAt && (
                    <>
                      <span className="ach-claimed">
                        ✓ {t('quest.openedOn', { date: fmtDate(q.openedAt, locale) })}
                      </span>
                      <button
                        type="button"
                        className="btn small ghost"
                        onClick={() => setOpening({ title: q.title, reward: { ...contents, levels: 0 }, replay: true })}
                      >
                        {t('ach.seeContents')}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
      {closed.length > 0 && (
        <button type="button" className="btn small ghost" onClick={() => setShowClosed((s) => !s)}>
          {showClosed ? t('quest.hideClosed') : t('quest.showClosed', { n: closed.length })}
        </button>
      )}
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
