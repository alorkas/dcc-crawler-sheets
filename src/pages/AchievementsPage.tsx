import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  api,
  type HomebrewItem,
  BOX_KINDS,
  BOX_TIERS,
  type Achievement,
  type AchievementInput,
  type CharacterSummary,
  type LootBox,
  type Reward,
  type RewardItem,
} from '../lib/api';
import { useI18n, type MsgKey } from '../lib/i18n';
import { useLive } from '../lib/live';
import { ACCESSORY_FITS, BONUS_KEYS, EQUIP_FITS, ITEM_TYPES, RARITIES } from '../../shared/items.js';
import { BoxChip } from '../components/Achievements';
import { ItemNameList, rarityClass } from '../components/Inventory';
import { generateBox, generateItem } from '../../shared/lootgen.js';
import { goldItem, toRewardItem, useLootStash, useWorldFloor } from './GeneratorPage';

const newItem = (): RewardItem => ({
  item: '',
  qty: '1',
  notes: '',
  type: '',
  rarity: '',
  unique: false,
  special: false,
  skill: '',
  upgrades: '',
  bonus: { damage: '', dr: '', evade: '', str: '', int: '', con: '', dex: '', cha: '' },
});
const newBox = (): LootBox => ({ tier: 'bronze', kind: 'adventurer', label: '', items: [newItem()] });
const emptyReward = (): Reward => ({ boxes: [], note: '' });
const fmtDate = (iso: string | null, locale: string) =>
  iso ? new Date(iso).toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' }) : '';
/** Drop empty item rows before saving. */
const tidy = (r: Reward): Reward => ({
  note: r.note,
  boxes: r.boxes.map((b) => ({ ...b, items: b.items.filter((it) => it.item.trim()) })),
});

/** GM: create achievements, give them to crawlers, see who claimed, and lock claiming. */
export default function AchievementsPage() {
  const { t, err, locale } = useI18n();
  const { awardsTick } = useLive();
  const [list, setList] = useState<Achievement[] | null>(null);
  const [crawlers, setCrawlers] = useState<CharacterSummary[]>([]);
  const [locked, setLocked] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const [editing, setEditing] = useState<number | 'new' | null>(null);
  const [rewardFor, setRewardFor] = useState<{ id: number; name: string; reward: Reward } | null>(null);

  const load = useCallback(() => {
    api
      .achievements()
      .then(setList)
      .catch((e) => setError(e ?? new Error()));
    api
      .rewardSettings()
      .then((s) => setLocked(s.claimLocked))
      .catch(() => {});
  }, []);
  useEffect(load, [load, awardsTick]);
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

  return (
    <div className="page ach-page">
      <ItemNameList />
      <div className="page-head">
        <div>
          <h1>{t('achPage.title')}</h1>
          <p className="dim">{t('achPage.sub')}</p>
        </div>
        <div className="page-actions">
          <label className={`toggle-pill ${locked ? 'on' : ''}`}>
            <input
              type="checkbox"
              checked={locked}
              onChange={(e) => {
                const v = e.target.checked;
                setLocked(v);
                run(() => api.setClaimLocked(v));
              }}
            />
            🔒 {t('achPage.lockClaims')}
          </label>
          {editing !== 'new' && (
            <button type="button" className="btn primary" onClick={() => setEditing('new')}>
              + {t('achPage.new')}
            </button>
          )}
        </div>
      </div>
      {locked && <div className="ach-locked">{t('achPage.lockedNote')}</div>}
      {!!error && <p className="error">{err(error)}</p>}

      {editing === 'new' && (
        <AchievementEditor
          crawlers={crawlers}
          onCancel={() => setEditing(null)}
          onSave={async (a) => {
            if (await run(() => api.createAchievement(a))) setEditing(null);
          }}
        />
      )}

      {!list && !error && <p className="dim">{t('common.loading')}</p>}
      {list && list.length === 0 && editing !== 'new' && <p className="dim">{t('achPage.empty')}</p>}
      <div className="ach-admin-list">
        {list?.map((a) =>
          editing === a.id ? (
            <AchievementEditor
              key={a.id}
              initial={a}
              crawlers={crawlers}
              onCancel={() => setEditing(null)}
              onSave={async (input) => {
                if (await run(() => api.updateAchievement(a.id, input))) setEditing(null);
              }}
            />
          ) : (
            <section key={a.id} className="card ach-admin">
              <header className="card-head">
                <h2>🏆 {a.title}</h2>
                <span className="dim small">{fmtDate(a.createdAt, locale)}</span>
              </header>
              <div className="card-body">
                {a.description && <p className="ach-desc">{a.description}</p>}
                <div className="box-chips">
                  {a.reward.boxes.map((b, i) => (
                    <BoxChip key={i} box={b} />
                  ))}
                  {!a.reward.boxes.length && !a.reward.note && (
                    <span className="dim small">{t('achPage.noReward')}</span>
                  )}
                </div>
                {a.reward.boxes.some((b) => b.items.length) && (
                  <div className="dim small">
                    {a.reward.boxes
                      .flatMap((b) => b.items)
                      .map((it) => `${it.item}${Number(it.qty) > 1 ? ` ×${it.qty}` : ''}`)
                      .join(', ')}
                  </div>
                )}
                {a.reward.note && <div className="ach-note">{a.reward.note}</div>}
                <div className="lbl">{t('achPage.recipients')}</div>
                <div className="recipients">
                  {a.awards.length === 0 && <span className="dim small">{t('achPage.nobody')}</span>}
                  {a.awards.map((w) => (
                    <span key={w.id} className={`recipient ${w.claimedAt ? 'claimed' : ''}`}>
                      <Link to={`/sheet/${w.characterId}?tab=achievements`}>{w.name || '?'}</Link>
                      <span className="dim tiny">
                        {w.claimedAt
                          ? `✓ ${t('achPage.claimed', { date: fmtDate(w.claimedAt, locale) })}`
                          : t('achPage.pending')}
                      </span>
                      {!w.claimedAt && (
                        <button
                          type="button"
                          className="icon-btn tiny-btn"
                          title={t('achPage.rewardFor', { name: w.name })}
                          onClick={() => setRewardFor({ id: w.id, name: w.name, reward: w.reward })}
                        >
                          ✎
                        </button>
                      )}
                      <button
                        type="button"
                        className="icon-btn tiny-btn"
                        title={t('achPage.revoke')}
                        onClick={() =>
                          confirm(t('achPage.revokeConfirm', { name: w.name, title: a.title })) &&
                          run(() => api.revokeAward(w.id))
                        }
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <GiveMore a={a} crawlers={crawlers} onGive={(ids) => run(() => api.giveAchievement(a.id, ids))} />
                <div className="row-actions">
                  <button type="button" className="btn small" onClick={() => setEditing(a.id)}>
                    {t('achPage.edit')}
                  </button>
                  <button
                    type="button"
                    className="btn small ghost danger"
                    onClick={() =>
                      confirm(t('achPage.deleteConfirm', { title: a.title })) && run(() => api.deleteAchievement(a.id))
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

      {rewardFor && (
        <div className="modal-back" onClick={() => setRewardFor(null)}>
          <div className="modal reward-modal" onClick={(e) => e.stopPropagation()}>
            <h2>{t('achPage.rewardFor', { name: rewardFor.name })}</h2>
            <p className="dim small">{t('achPage.rewardForHint')}</p>
            <RewardEditor value={rewardFor.reward} onChange={(reward) => setRewardFor({ ...rewardFor, reward })} />
            <div className="modal-actions">
              <button type="button" className="btn ghost" onClick={() => setRewardFor(null)}>
                {t('common.cancel')}
              </button>
              <button
                type="button"
                className="btn primary"
                onClick={async () => {
                  if (await run(() => api.setAwardReward(rewardFor.id, tidy(rewardFor.reward)))) setRewardFor(null);
                }}
              >
                {t('common.save')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function GiveMore({
  a,
  crawlers,
  onGive,
}: {
  a: Achievement;
  crawlers: CharacterSummary[];
  onGive: (ids: number[]) => void;
}) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [ids, setIds] = useState<number[]>([]);
  const left = crawlers.filter((c) => !a.awards.some((w) => w.characterId === c.id));
  if (!left.length) return null;
  const party = left.filter((c) => c.inParty);
  const others = left.filter((c) => !c.inParty);
  const give = (list: number[]) => {
    if (!list.length) return;
    onGive(list);
    setIds([]);
    setOpen(false);
  };
  const toggle = (id: number) => setIds((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  const pickRow = (c: CharacterSummary) => (
    <label key={c.id} className="recipient-pick">
      <input type="checkbox" checked={ids.includes(c.id)} onChange={() => toggle(c.id)} />
      {c.summary.name || '?'} <span className="dim tiny">({c.ownerName})</span>
    </label>
  );
  return (
    <div className="give-more">
      {party.length > 0 && (
        <button type="button" className="btn small" onClick={() => give(party.map((c) => c.id))}>
          {t('achPage.giveParty', { n: party.length })}
        </button>
      )}
      <button type="button" className="btn small ghost" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        {t('achPage.giveTo')}
      </button>
      {open && (
        <div className="give-more-pick">
          <div className="recipient-picks">
            {party.length > 0 && <div className="dim tiny">{t('party.title')}</div>}
            {party.map(pickRow)}
            {others.length > 0 && party.length > 0 && <div className="dim tiny">{t('achPage.others')}</div>}
            {others.map(pickRow)}
          </div>
          <button type="button" className="btn small primary" disabled={!ids.length} onClick={() => give(ids)}>
            {t('achPage.giveN', { n: ids.length })}
          </button>
        </div>
      )}
    </div>
  );
}

function AchievementEditor({
  initial,
  crawlers,
  onSave,
  onCancel,
}: {
  initial?: Achievement;
  crawlers: CharacterSummary[];
  onSave: (a: AchievementInput) => void;
  onCancel: () => void;
}) {
  const { t } = useI18n();
  const [title, setTitle] = useState(initial?.title ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [reward, setReward] = useState<Reward>(initial?.reward ?? emptyReward());
  const [ids, setIds] = useState<number[]>([]);
  const party = crawlers.filter((c) => c.inParty);
  const others = crawlers.filter((c) => !c.inParty);
  const toggle = (id: number) => setIds((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  const pickRow = (c: CharacterSummary) => (
    <label key={c.id} className="recipient-pick">
      <input type="checkbox" checked={ids.includes(c.id)} onChange={() => toggle(c.id)} />
      {c.summary.name || '?'} <span className="dim tiny">({c.ownerName})</span>
    </label>
  );
  return (
    <section className="card ach-editor">
      <header className="card-head red">
        <h2>{initial ? t('achPage.editTitle') : t('achPage.new')}</h2>
      </header>
      <div className="card-body">
        <label className="field">
          <span className="lbl">{t('achPage.fTitle')}</span>
          <input className="in" value={title} maxLength={120} onChange={(e) => setTitle(e.target.value)} />
        </label>
        <label className="field">
          <span className="lbl">{t('achPage.fDesc')}</span>
          <textarea
            className="in area"
            rows={3}
            value={description}
            placeholder={t('achPage.fDescHint')}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <div className="lbl">{t('ach.reward')}</div>
        <RewardEditor value={reward} onChange={setReward} />
        {initial && initial.awards.some((w) => !w.claimedAt) && <p className="dim small">{t('achPage.editNote')}</p>}
        {!initial && (
          <>
            <div className="lbl">
              {t('achPage.recipients')}{' '}
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
          <button
            type="button"
            className="btn primary"
            disabled={!title.trim()}
            onClick={() => onSave({ title, description, reward: tidy(reward), characterIds: ids })}
          >
            {initial ? t('common.save') : ids.length ? t('achPage.createGive', { n: ids.length }) : t('achPage.create')}
          </button>
        </div>
      </div>
    </section>
  );
}

/** " · DR +2 · DEX +1" for the collection list. */
function bonusLine(h: HomebrewItem, t: ReturnType<typeof useI18n>['t']) {
  const parts = Object.entries(h.bonus)
    .filter(([, v]) => Number(v))
    .map(([k, v]) => `${t(`bonus.${k}` as MsgKey)} ${Number(v) > 0 ? '+' : ''}${Number(v)}`);
  return parts.length ? ` · ${parts.join(' · ')}` : '';
}

/** Loot boxes (tier, kind, items) plus any other reward in words. */
/* the campaign's loot collection, fetched once per page load */
let collectionCache: Promise<HomebrewItem[]> | null = null;
function useCollection() {
  const [items, setItems] = useState<HomebrewItem[]>([]);
  useEffect(() => {
    collectionCache ??= api
      .fullCatalog()
      .then((c) => c.homebrew ?? [])
      .catch(() => []);
    collectionCache.then(setItems);
  }, []);
  return items;
}
const TIER_ORDER = ['bronze', 'silver', 'gold', 'platinum', 'legendary', 'celestial'];
const fromCollection = (h: HomebrewItem, qty = '1'): RewardItem => ({
  ...newItem(),
  item: h.name,
  qty,
  type: h.type,
  rarity: h.rarity,
  notes: h.notes,
  fits: h.fits ?? '',
  ranged: !!h.ranged,
  ammo: h.ammo ?? '',
  bonus: { ...newItem().bonus, ...h.bonus },
});
const pick = <T,>(list: T[]) => list[Math.floor(Math.random() * list.length)];
/**
 * A whole box from the loot generator (items that fit the box's kind, and gold); now and then the main item comes
 * from the campaign's collection instead.
 */
function randomBox(tier: string, kind: string, floor: number, all: HomebrewItem[]): RewardItem[] {
  const rank = (r: string) => TIER_ORDER.indexOf(r);
  const box = generateBox({ tier, kind, floor });
  const items = box.items.map(toRewardItem);
  const gear = all.filter((h) => h.type !== 'consumable' && rank(h.rarity) === rank(tier));
  const first = items.findIndex((it) => it.type === 'equipment' || it.type === 'accessory');
  if (gear.length && first >= 0 && Math.random() < 0.4) items[first] = fromCollection(pick(gear));
  return [...items, goldItem(box.gold)];
}

export function RewardEditor({ value, onChange }: { value: Reward; onChange: (r: Reward) => void }) {
  const { t } = useI18n();
  const collection = useCollection();
  const stash = useLootStash();
  const worldFloor = useWorldFloor();
  const byName = new Map(collection.map((h) => [h.name.toLowerCase(), h]));
  const setBox = (i: number, b: LootBox) => onChange({ ...value, boxes: value.boxes.map((x, j) => (j === i ? b : x)) });
  const setItem = (bi: number, ii: number, patch: Partial<RewardItem>) => {
    const b = value.boxes[bi];
    setBox(bi, { ...b, items: b.items.map((x, j) => (j === ii ? { ...x, ...patch } : x)) });
  };
  return (
    <div className="reward-editor">
      {value.boxes.map((b, bi) => (
        <div key={bi} className={`box-edit ${rarityClass(b.tier)}`}>
          <div className="box-edit-head">
            <select
              className="in sel"
              value={b.tier}
              aria-label={t('achPage.tier')}
              onChange={(e) => setBox(bi, { ...b, tier: e.target.value as LootBox['tier'] })}
            >
              {BOX_TIERS.map((x) => (
                <option key={x} value={x}>
                  {t(`rarity.${x}` as MsgKey)}
                </option>
              ))}
            </select>
            <select
              className="in sel"
              value={b.kind}
              aria-label={t('achPage.kind')}
              onChange={(e) => setBox(bi, { ...b, kind: e.target.value as LootBox['kind'] })}
            >
              {BOX_KINDS.map((x) => (
                <option key={x} value={x}>
                  {t(`box.kind.${x}` as MsgKey)}
                </option>
              ))}
            </select>
            <input
              className="in"
              value={b.label}
              maxLength={60}
              placeholder={t('achPage.boxLabel')}
              onChange={(e) => setBox(bi, { ...b, label: e.target.value })}
            />
            <button
              type="button"
              className="icon-btn"
              title={t('achPage.removeBox')}
              onClick={() => onChange({ ...value, boxes: value.boxes.filter((_, j) => j !== bi) })}
            >
              ×
            </button>
          </div>
          {b.items.map((it, ii) => (
            <div
              key={ii}
              className={`box-item ${rarityClass(it.rarity)} ${it.type === 'equipment' || it.type === 'accessory' ? 'has-fits' : ''}`}
            >
              <input
                className="in"
                list="item-names"
                value={it.item}
                placeholder={t('inv.item')}
                onChange={(e) => {
                  // an item from the collection brings its type, rarity, bonuses and description
                  const h = byName.get(e.target.value.trim().toLowerCase());
                  const blank = !it.notes.trim() && !it.type && !it.rarity;
                  setItem(bi, ii, h && blank ? { ...fromCollection(h, it.qty || '1') } : { item: e.target.value });
                }}
              />
              <input
                className="in center qty"
                value={it.qty}
                inputMode="numeric"
                aria-label={t('inv.qty')}
                placeholder={t('inv.qty')}
                onChange={(e) => setItem(bi, ii, { qty: e.target.value })}
              />
              <select
                className="in sel"
                value={it.type}
                aria-label={t('inv.type')}
                onChange={(e) => setItem(bi, ii, { type: e.target.value as RewardItem['type'] })}
              >
                <option value="">{t('inv.type')}…</option>
                {ITEM_TYPES.map((x) => (
                  <option key={x} value={x}>
                    {t(`itemType.${x}` as MsgKey)}
                  </option>
                ))}
              </select>
              {(it.type === 'equipment' || it.type === 'accessory') && (
                <select
                  className="in sel"
                  value={it.fits ?? ''}
                  aria-label={t('inv.fits')}
                  onChange={(e) => setItem(bi, ii, { fits: e.target.value as RewardItem['fits'] })}
                >
                  <option value="">{t('inv.fits')}…</option>
                  {(it.type === 'equipment' ? EQUIP_FITS : ACCESSORY_FITS).map((f) => (
                    <option key={f} value={f}>
                      {t(`part.${f}` as MsgKey)}
                    </option>
                  ))}
                </select>
              )}
              <select
                className="in sel"
                value={it.rarity}
                aria-label={t('inv.rarity')}
                onChange={(e) => setItem(bi, ii, { rarity: e.target.value as RewardItem['rarity'] })}
              >
                <option value="">{t('inv.rarity')}…</option>
                {RARITIES.map((x) => (
                  <option key={x} value={x}>
                    {t(`rarity.${x}` as MsgKey)}
                  </option>
                ))}
              </select>
              <input
                className="in notes"
                value={it.notes}
                placeholder={t('achPage.itemNotes')}
                onChange={(e) => setItem(bi, ii, { notes: e.target.value })}
              />
              <div className="box-item-flags">
                <label title={t('inv.unique')}>
                  <input
                    type="checkbox"
                    checked={it.unique}
                    onChange={(e) => setItem(bi, ii, { unique: e.target.checked })}
                  />
                  {t('achPage.unique')}
                </label>
                <label title={t('achPage.specialHint')}>
                  <input
                    type="checkbox"
                    checked={it.special}
                    onChange={(e) => setItem(bi, ii, { special: e.target.checked })}
                  />
                  ★ {t('achPage.special')}
                </label>
                {BONUS_KEYS.map((k) => (
                  <input
                    key={k}
                    className="in center bonus-in"
                    value={it.bonus[k]}
                    placeholder={t(`bonus.${k}` as MsgKey)}
                    aria-label={t(`bonus.${k}` as MsgKey)}
                    onChange={(e) => setItem(bi, ii, { bonus: { ...it.bonus, [k]: e.target.value } })}
                  />
                ))}
                <button
                  type="button"
                  className="icon-btn"
                  title={t('achPage.removeItem')}
                  onClick={() => setBox(bi, { ...b, items: b.items.filter((_, j) => j !== ii) })}
                >
                  ×
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            className="btn small ghost"
            onClick={() => setBox(bi, { ...b, items: [...b.items, newItem()] })}
          >
            + {t('inv.add')}
          </button>
          {collection.length > 0 && (
            <div className="row-gap">
              <select
                className="in sel tiny-sel"
                value=""
                aria-label={t('loot.fromCollection')}
                onChange={(e) => {
                  const h = collection.find((x) => x.name === e.target.value);
                  if (!h) return;
                  const items = b.items.filter((x) => x.item.trim());
                  setBox(bi, { ...b, items: [...items, fromCollection(h)] });
                }}
              >
                <option value="">+ {t('loot.fromCollection')}</option>
                {TIER_ORDER.filter((r) => collection.some((h) => h.rarity === r)).map((r) => (
                  <optgroup key={r} label={t(`rarity.${r}` as MsgKey)}>
                    {collection
                      .filter((h) => h.rarity === r)
                      .map((h) => (
                        <option key={h.name} value={h.name}>
                          {h.name} ({t('dash.floor', { n: h.floor })}
                          {bonusLine(h, t)})
                        </option>
                      ))}
                  </optgroup>
                ))}
              </select>
              <button
                type="button"
                className="btn small"
                title={t('loot.randomHint')}
                onClick={() => setBox(bi, { ...b, items: randomBox(b.tier, b.kind, worldFloor, collection) })}
              >
                🎲 {t('loot.random')}
              </button>
              {stash.items.length > 0 && (
                <select
                  className="in sel tiny-sel"
                  value=""
                  aria-label={t('gen.fromStash')}
                  onChange={(e) => {
                    const i = Number(e.target.value);
                    const it = stash.items[i];
                    if (!e.target.value || !it) return;
                    setBox(bi, { ...b, items: [...b.items.filter((x) => x.item.trim()), it] });
                    stash.save(stash.items.filter((_, j) => j !== i));
                  }}
                >
                  <option value="">📦 {t('gen.fromStash')}</option>
                  {stash.items.map((it, i) => (
                    <option key={i} value={i}>
                      {it.item} ({t(`rarity.${it.rarity || 'common'}` as MsgKey)})
                    </option>
                  ))}
                </select>
              )}
              <button
                type="button"
                className="btn small"
                title={t('gen.inBoxHint', { n: worldFloor })}
                onClick={() =>
                  setBox(bi, {
                    ...b,
                    items: [
                      ...b.items.filter((x) => x.item.trim()),
                      toRewardItem(generateItem({ floor: worldFloor, quality: b.tier })),
                    ],
                  })
                }
              >
                ✨ {t('gen.inBox')}
              </button>
            </div>
          )}
        </div>
      ))}
      <button
        type="button"
        className="btn small"
        onClick={() => onChange({ ...value, boxes: [...value.boxes, newBox()] })}
      >
        + {t('achPage.addBox')}
      </button>
      <label className="field">
        <span className="lbl">{t('achPage.otherReward')}</span>
        <textarea
          className="in area"
          rows={2}
          value={value.note}
          placeholder={t('achPage.otherRewardHint')}
          onChange={(e) => onChange({ ...value, note: e.target.value })}
        />
      </label>
      <p className="dim tiny">{t('achPage.bookHint')}</p>
    </div>
  );
}
