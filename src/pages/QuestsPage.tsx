import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  api,
  type CharacterSummary,
  type Quest,
  type QuestInput,
  type QuestObjective,
  type QuestStatus,
  type QuestReward,
} from '../lib/api';
import { useI18n, type MsgKey } from '../lib/i18n';
import { useLive } from '../lib/live';
import { BoxChip } from '../components/Achievements';
import { ItemNameList } from '../components/Inventory';
import { GiveMore, RewardEditor, tidy } from './AchievementsPage';
import { useWorldFloor } from './GeneratorPage';

const STATUSES: QuestStatus[] = ['active', 'completed', 'failed'];
const newObjId = () => `o${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
const emptyQuest = (floor: number): QuestInput => ({
  title: '',
  description: '',
  giver: '',
  floor,
  objectives: [],
  reward: { boxes: [], note: '', levels: 0 },
  status: 'active',
  hidden: false,
  penalty: '',
});
const toInput = (q: Quest): QuestInput => ({
  title: q.title,
  description: q.description,
  giver: q.giver,
  floor: q.floor,
  objectives: q.objectives,
  reward: q.reward,
  status: q.status,
  hidden: q.hidden,
  penalty: q.penalty,
});
const statusIcon: Record<QuestStatus, string> = { active: '📜', completed: '✔', failed: '✖' };

/** GM: write quests, offer them to crawlers (or the whole party), follow who accepted, and close them. */
export default function QuestsPage() {
  const { t, err } = useI18n();
  const { questsTick } = useLive();
  const floor = useWorldFloor();
  const [list, setList] = useState<Quest[] | null>(null);
  const [crawlers, setCrawlers] = useState<CharacterSummary[]>([]);
  const [error, setError] = useState<unknown>(null);
  const [editing, setEditing] = useState<number | 'new' | null>(null);
  const [show, setShow] = useState<QuestStatus | 'all'>('active');

  const load = useCallback(() => {
    api
      .quests()
      .then(setList)
      .catch((e) => setError(e ?? new Error()));
  }, []);
  useEffect(load, [load, questsTick]);
  useEffect(() => {
    api
      .listCharacters(true)
      .then(setCrawlers)
      .catch(() => {});
  }, []);

  async function run(fn: () => Promise<unknown>) {
    setError(null);
    try {
      await fn();
      load();
      return true;
    } catch (e) {
      setError(e);
      return false;
    }
  }
  const shown = list?.filter((q) => show === 'all' || q.status === show) ?? [];
  const count = (s: QuestStatus) => list?.filter((q) => q.status === s).length ?? 0;

  return (
    <div className="page ach-page quest-page">
      <ItemNameList />
      <div className="page-head">
        <div>
          <h1>{t('questPage.title')}</h1>
          <p className="dim">{t('questPage.sub')}</p>
        </div>
        <div className="page-actions">
          {editing !== 'new' && (
            <button type="button" className="btn primary" onClick={() => setEditing('new')}>
              + {t('questPage.new')}
            </button>
          )}
        </div>
      </div>
      {!!error && <p className="error">{err(error)}</p>}

      {editing === 'new' && (
        <QuestEditor
          initial={emptyQuest(floor)}
          crawlers={crawlers}
          onCancel={() => setEditing(null)}
          onSave={async (q) => {
            if (await run(() => api.createQuest(q))) setEditing(null);
          }}
        />
      )}

      <div className="seg quest-filter" role="tablist">
        {(['active', 'completed', 'failed', 'all'] as const).map((s) => (
          <button
            key={s}
            type="button"
            role="tab"
            aria-selected={show === s}
            className={show === s ? 'active' : ''}
            onClick={() => setShow(s)}
          >
            {t(`quest.filter.${s}` as MsgKey)}
            {s !== 'all' && list && <span className="dim tiny"> {count(s)}</span>}
          </button>
        ))}
      </div>

      {!list && !error && <p className="dim">{t('common.loading')}</p>}
      {list && shown.length === 0 && editing !== 'new' && <p className="dim">{t('questPage.empty')}</p>}
      <div className="ach-admin-list">
        {shown.map((q) =>
          editing === q.id ? (
            <QuestEditor
              key={q.id}
              initial={toInput(q)}
              existing
              crawlers={crawlers}
              onCancel={() => setEditing(null)}
              onSave={async (input) => {
                if (await run(() => api.updateQuest(q.id, input))) setEditing(null);
              }}
            />
          ) : (
            <section key={q.id} className={`card ach-admin quest-admin st-${q.status}`}>
              <header className="card-head">
                <h2>
                  {statusIcon[q.status]} {q.title}
                </h2>
                <span className="quest-meta">
                  {q.hidden && <span className="pill tiny-pill">{t('quest.hidden')}</span>}
                  <span className={`pill tiny-pill quest-st st-${q.status}`}>
                    {t(`quest.status.${q.status}` as MsgKey)}
                  </span>
                  {q.floor > 0 && <span className="dim small">{t('quest.floorN', { n: q.floor })}</span>}
                </span>
              </header>
              <div className="card-body">
                {q.giver && <div className="dim small">{t('quest.givenBy', { giver: q.giver })}</div>}
                {q.description && <p className="ach-desc">{q.description}</p>}
                {q.objectives.length > 0 && (
                  <ul className="quest-objs">
                    {q.objectives.map((o) => (
                      <li key={o.id} className={o.done ? 'done' : ''}>
                        <label>
                          <input
                            type="checkbox"
                            checked={o.done}
                            disabled={q.status !== 'active'}
                            onChange={(e) => {
                              const objectives = q.objectives.map((x) =>
                                x.id === o.id ? { ...x, done: e.target.checked } : x,
                              );
                              setList((l) => l && l.map((x) => (x.id === q.id ? { ...x, objectives } : x)));
                              run(() => api.updateQuest(q.id, { ...toInput(q), objectives }));
                            }}
                          />
                          {o.text}
                        </label>
                      </li>
                    ))}
                  </ul>
                )}
                <RewardLine reward={q.reward} gm />
                {q.penalty && (
                  <div className={`quest-penalty ${q.status === 'failed' ? 'hit' : ''}`}>
                    <span className="lbl">{t('quest.penalty')}</span>
                    <p>{q.penalty}</p>
                  </div>
                )}
                <div className="lbl">{t('questPage.crawlers')}</div>
                <div className="recipients">
                  {q.crawlers.length === 0 && <span className="dim small">{t('questPage.nobody')}</span>}
                  {q.crawlers.map((c) => (
                    <span key={c.id} className={`recipient ${c.grantedAt ? 'claimed' : ''}`}>
                      <Link to={`/sheet/${c.characterId}?tab=quests`}>{c.name || '?'}</Link>
                      {c.grantedAt && (
                        <span className="dim tiny">
                          {c.boxes === 0
                            ? `✓ ${t('questPage.rewarded')}`
                            : c.openedAt
                              ? `✓ ${t('questPage.boxesOpened')}`
                              : `▣ ${t('questPage.boxesSealed', { n: c.boxes })}`}
                        </span>
                      )}
                      <button
                        type="button"
                        className="icon-btn tiny-btn"
                        title={t('questPage.remove')}
                        onClick={() =>
                          confirm(t('questPage.removeConfirm', { name: c.name, title: q.title })) &&
                          run(() => api.removeFromQuest(q.id, c.id))
                        }
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <GiveMore
                  taken={q.crawlers.map((c) => c.characterId)}
                  crawlers={crawlers}
                  onGive={(ids) => run(() => api.offerQuest(q.id, ids))}
                  labels={{ party: 'questPage.offerParty', to: 'questPage.offerTo', n: 'questPage.offerN' }}
                />
                <div className="row-actions">
                  {q.status === 'active' ? (
                    <>
                      <button
                        type="button"
                        className="btn small primary"
                        onClick={() =>
                          confirm(t('questPage.completeConfirm', { title: q.title })) &&
                          run(() => api.updateQuest(q.id, { ...toInput(q), status: 'completed' }))
                        }
                      >
                        ✔ {t('questPage.complete')}
                      </button>
                      <button
                        type="button"
                        className="btn small ghost danger"
                        onClick={() =>
                          confirm(t('questPage.failConfirm', { title: q.title })) &&
                          run(() => api.updateQuest(q.id, { ...toInput(q), status: 'failed' }))
                        }
                      >
                        ✖ {t('questPage.fail')}
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      className="btn small ghost"
                      onClick={() => run(() => api.updateQuest(q.id, { ...toInput(q), status: 'active' }))}
                    >
                      ↺ {t('questPage.reopen')}
                    </button>
                  )}
                  {q.hidden && (
                    <button
                      type="button"
                      className="btn small"
                      onClick={() => run(() => api.updateQuest(q.id, { ...toInput(q), hidden: false }))}
                    >
                      👁 {t('questPage.reveal')}
                    </button>
                  )}
                  <button type="button" className="btn small" onClick={() => setEditing(q.id)}>
                    {t('achPage.edit')}
                  </button>
                  <button
                    type="button"
                    className="btn small ghost danger"
                    onClick={() =>
                      confirm(t('questPage.deleteConfirm', { title: q.title })) && run(() => api.deleteQuest(q.id))
                    }
                  >
                    {t('achPage.delete')}
                  </button>
                </div>
              </div>
            </section>
          ),
        )}
      </div>
    </div>
  );
}

/** "Reward: ▣ Gold box · +2 Levels · a favour from the Gnoll King" */
export function RewardLine({ reward, gm, sealed }: { reward: QuestReward; gm?: boolean; sealed?: boolean }) {
  const { t } = useI18n();
  const empty = !reward.boxes.length && !reward.note && !reward.levels;
  return (
    <div className="ach-reward quest-reward">
      <span className="lbl">{t('ach.reward')}</span>
      {empty ? (
        <span className="dim small">{t('achPage.noReward')}</span>
      ) : (
        <div className="box-chips">
          {reward.levels > 0 && <span className="pill level-pill">{t('quest.levels', { n: reward.levels })}</span>}
          {reward.boxes.map((b, i) => (
            <BoxChip key={i} box={b} sealed={sealed} />
          ))}
        </div>
      )}
      {gm && reward.boxes.some((b) => b.items.length) && (
        <div className="dim small">
          {reward.boxes
            .flatMap((b) => b.items)
            .map((it) => `${it.item}${Number(it.qty) > 1 ? ` ×${it.qty}` : ''}`)
            .join(', ')}
        </div>
      )}
      {reward.note && <p className="ach-note">{reward.note}</p>}
    </div>
  );
}

function QuestEditor({
  initial,
  existing,
  crawlers,
  onSave,
  onCancel,
}: {
  initial: QuestInput;
  existing?: boolean;
  crawlers: CharacterSummary[];
  onSave: (q: QuestInput) => void;
  onCancel: () => void;
}) {
  const { t } = useI18n();
  const [q, setQ] = useState<QuestInput>(initial);
  const [ids, setIds] = useState<number[]>([]);
  const set = (patch: Partial<QuestInput>) => setQ((x) => ({ ...x, ...patch }));
  const setObj = (i: number, patch: Partial<QuestObjective>) =>
    set({ objectives: q.objectives.map((o, j) => (j === i ? { ...o, ...patch } : o)) });
  const party = crawlers.filter((c) => c.inParty);
  const others = crawlers.filter((c) => !c.inParty);
  const toggle = (id: number) => setIds((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  const pickRow = (c: CharacterSummary) => (
    <label key={c.id} className="recipient-pick">
      <input type="checkbox" checked={ids.includes(c.id)} onChange={() => toggle(c.id)} />
      {c.summary.name || '?'} <span className="dim tiny">({c.ownerName})</span>
    </label>
  );
  const save = () =>
    onSave({
      ...q,
      objectives: q.objectives.filter((o) => o.text.trim()),
      reward: { ...tidy(q.reward), levels: q.reward.levels },
      characterIds: ids,
    });
  return (
    <section className="card ach-editor quest-editor">
      <header className="card-head red">
        <h2>{existing ? t('questPage.editTitle') : t('questPage.new')}</h2>
      </header>
      <div className="card-body">
        <div className="quest-edit-grid">
          <label className="field">
            <span className="lbl">{t('questPage.fTitle')}</span>
            <input className="in" value={q.title} maxLength={120} onChange={(e) => set({ title: e.target.value })} />
          </label>
          <label className="field">
            <span className="lbl">{t('questPage.fGiver')}</span>
            <input
              className="in"
              value={q.giver}
              maxLength={120}
              placeholder={t('questPage.fGiverHint')}
              onChange={(e) => set({ giver: e.target.value })}
            />
          </label>
          <label className="field narrow">
            <span className="lbl">{t('quest.floor')}</span>
            <input
              className="in"
              type="number"
              min={0}
              max={18}
              value={q.floor}
              onChange={(e) => set({ floor: Math.max(0, Math.min(18, Number(e.target.value) || 0)) })}
            />
          </label>
        </div>
        <label className="field">
          <span className="lbl">{t('questPage.fDesc')}</span>
          <textarea
            className="in area"
            rows={3}
            value={q.description}
            placeholder={t('questPage.fDescHint')}
            onChange={(e) => set({ description: e.target.value })}
          />
        </label>
        <div className="lbl">{t('quest.objectives')}</div>
        <div className="quest-obj-edit">
          {q.objectives.map((o, i) => (
            <div key={o.id} className="quest-obj-row">
              <input type="checkbox" checked={o.done} onChange={(e) => setObj(i, { done: e.target.checked })} />
              <input
                className="in"
                value={o.text}
                maxLength={300}
                placeholder={t('questPage.objHint')}
                onChange={(e) => setObj(i, { text: e.target.value })}
              />
              <button
                type="button"
                className="icon-btn"
                title={t('common.remove')}
                onClick={() => set({ objectives: q.objectives.filter((_, j) => j !== i) })}
              >
                ×
              </button>
            </div>
          ))}
          <button
            type="button"
            className="btn small ghost"
            onClick={() => set({ objectives: [...q.objectives, { id: newObjId(), text: '', done: false }] })}
          >
            + {t('questPage.addObj')}
          </button>
        </div>
        <div className="lbl">{t('ach.reward')}</div>
        <label className="field narrow quest-levels">
          <span className="lbl">{t('questPage.fLevels')}</span>
          <input
            className="in"
            type="number"
            min={0}
            max={20}
            value={q.reward.levels}
            onChange={(e) =>
              set({ reward: { ...q.reward, levels: Math.max(0, Math.min(20, Number(e.target.value) || 0)) } })
            }
          />
        </label>
        <RewardEditor
          value={q.reward}
          onChange={(r) => set({ reward: { ...r, levels: (r as QuestReward).levels ?? q.reward.levels } })}
        />
        <p className="dim small">{t('questPage.rewardHint')}</p>
        <label className="field">
          <span className="lbl">{t('questPage.fPenalty')}</span>
          <textarea
            className="in area"
            rows={2}
            value={q.penalty}
            maxLength={2000}
            placeholder={t('questPage.fPenaltyHint')}
            onChange={(e) => set({ penalty: e.target.value })}
          />
        </label>
        <div className="quest-flags">
          <label className="field inline">
            <span className="lbl">{t('quest.statusLbl')}</span>
            <select
              className="in sel"
              value={q.status}
              onChange={(e) => set({ status: e.target.value as QuestStatus })}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {t(`quest.status.${s}` as MsgKey)}
                </option>
              ))}
            </select>
          </label>
          <label className="check">
            <input type="checkbox" checked={q.hidden} onChange={(e) => set({ hidden: e.target.checked })} />{' '}
            {t('questPage.fHidden')}
          </label>
        </div>
        {!existing && (
          <>
            <div className="lbl">
              {t('questPage.offerTo')}{' '}
              {party.length > 0 && (
                <button
                  type="button"
                  className="btn tiny-btn ghost"
                  onClick={() => setIds((s) => [...new Set([...s, ...party.map((c) => c.id)])])}
                >
                  {t('achPage.wholeParty')}
                </button>
              )}
            </div>
            <div className="recipient-picks">
              {party.length > 0 && <div className="dim tiny">{t('party.title')}</div>}
              {party.map(pickRow)}
              {others.length > 0 && party.length > 0 && <div className="dim tiny">{t('achPage.others')}</div>}
              {others.map(pickRow)}
            </div>
          </>
        )}
        <div className="modal-actions">
          <button type="button" className="btn ghost" onClick={onCancel}>
            {t('common.cancel')}
          </button>
          <button type="button" className="btn primary" disabled={!q.title.trim()} onClick={save}>
            {existing
              ? t('common.save')
              : ids.length
                ? t('questPage.createOffer', { n: ids.length })
                : t('questPage.create')}
          </button>
        </div>
      </div>
    </section>
  );
}
