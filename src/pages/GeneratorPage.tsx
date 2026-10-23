import { useEffect, useMemo, useState } from 'react';
import { api, BOX_KINDS, type BoxKind, type BoxTier, type CharacterSummary, type RewardItem } from '../lib/api';
import { useI18n, type MsgKey } from '../lib/i18n';
import {
  QUALITIES,
  changePart,
  combinations,
  generateBox,
  generateItem,
  qualityOdds,
  rerollItem,
  type GeneratedItem,
  type GenKind,
  type GenPart,
  type Quality,
} from '../../shared/lootgen.js';
import { bonusText, rarityClass } from '../components/Inventory';
import { boxName } from '../components/Achievements';
import type { Item } from '../lib/sheet';

/* GM: the loot generator. Pick a Floor (the odds of each quality follow it) or a quality, what kind of item and
   where it's worn, and roll. Each result can be rerolled (keeping the parts you lock), have one part changed or
   removed, be renamed, given to a crawler or kept in the stash (which the loot box editor can also use). Whole loot
   boxes can be generated too. */

type Kind = GenKind | 'equipment' | 'gear' | '';
const KINDS: Kind[] = [
  '',
  'gear',
  'equipment',
  'armor',
  'weapon',
  'shield',
  'accessory',
  'consumable',
  'ammo',
  'crafting',
];
const BODY: Record<string, string[]> = {
  armor: ['head', 'shoulders', 'chest', 'bracers', 'hands', 'back', 'waist', 'pants', 'feet'],
  accessory: ['head', 'shoulders', 'chest', 'bracers', 'hands', 'back', 'waist', 'pants', 'feet', 'neck', 'finger'],
};
type Locks = Partial<Record<GenPart, boolean>>;
type Rolled = GeneratedItem & { uid: number; locks: Locks };
let uidSeq = 0;
const withUid = (it: GeneratedItem, locks: Locks = {}): Rolled => ({ ...it, uid: ++uidSeq, locks });

/** What a generated item looks like as a reward/inventory item (no generator details). */
export function toRewardItem(it: GeneratedItem | Rolled): RewardItem {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { gen, uid, locks, ...rest } = it as Rolled;
  return { ...rest, special: false };
}
/** Gold as a reward item. */
/** The GM's stash of generated items (shared with the loot box editor). */
export function useLootStash() {
  const [items, setItems] = useState<RewardItem[]>([]);
  useEffect(() => {
    api
      .lootStash()
      .then((r) => setItems(r.items))
      .catch(() => {});
  }, []);
  const save = async (next: RewardItem[]) => {
    setItems(next);
    try {
      setItems((await api.saveLootStash(next)).items);
    } catch {
      /* keep the local copy */
    }
  };
  return { items, save };
}

/** The current Floor (World Stats), for generating loot. */
export function useWorldFloor(): number {
  const [floor, setFloor] = useState(1);
  useEffect(() => {
    api
      .world()
      .then((w) => setFloor(w.floor || 1))
      .catch(() => {});
  }, []);
  return floor;
}

type Box = { uid: number; tier: Quality; kind: BoxKind; items: Rolled[]; gold: number; from: string };

export default function GeneratorPage() {
  const { t, err } = useI18n();
  const worldFloor = useWorldFloor();
  const [floor, setFloor] = useState<number | null>(null);
  const [quality, setQuality] = useState<Quality | ''>('');
  const [kind, setKind] = useState<Kind>('');
  const [part, setPart] = useState('');
  const [count, setCount] = useState(6);
  const [results, setResults] = useState<Rolled[]>([]);
  const [boxTier, setBoxTier] = useState<Quality>('bronze');
  const [boxKind, setBoxKind] = useState<BoxKind>('adventurer');
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [crawlers, setCrawlers] = useState<CharacterSummary[]>([]);
  const [msg, setMsg] = useState<{ text: string; bad?: boolean } | null>(null);
  const stash = useLootStash();
  const f = floor ?? worldFloor;
  const odds = useMemo(() => qualityOdds(f), [f]);
  const combos = useMemo(() => combinations(), []);
  useEffect(() => {
    api
      .listCharacters(true)
      .then((list) => setCrawlers([...list].sort((a, b) => Number(!!b.inParty) - Number(!!a.inParty))))
      .catch(() => {});
  }, []);

  const roll = () =>
    setResults(Array.from({ length: count }, () => withUid(generateItem({ floor: f, quality, kind, part }))));
  /** Replace an item (in the results or in a generated box). */
  const replace = (uid: number, fn: (r: Rolled) => Rolled) => {
    setResults((rs) => rs.map((r) => (r.uid === uid ? fn(r) : r)));
    setBoxes((bs) => bs.map((b) => ({ ...b, items: b.items.map((r) => (r.uid === uid ? fn(r) : r)) })));
  };
  const flash = (text: string, bad = false) => {
    setMsg({ text, bad });
    setTimeout(() => setMsg(null), 3000);
  };
  const give = async (items: RewardItem[], to: number) => {
    const who = crawlers.find((c) => c.id === to)?.summary.name || '?';
    try {
      await api.giftItems(to, items);
      flash(t('gen.given', { name: who }));
      return true;
    } catch (e) {
      flash(err(e), true);
      return false;
    }
  };
  const cardProps = (r: Rolled) => ({
    it: r,
    crawlers,
    onReroll: () => replace(r.uid, (x) => withUid(rerollItem(x.gen, x.locks), x.locks)),
    onPart: (p: GenPart, mode: 'reroll' | 'remove') =>
      replace(r.uid, (x) => withUid(changePart(x.gen, p, mode), x.locks)),
    onLock: (p: GenPart) => replace(r.uid, (x) => ({ ...x, locks: { ...x.locks, [p]: !x.locks[p] } })),
    onRename: (name: string) => replace(r.uid, (x) => ({ ...x, item: name })),
    onStash: () => {
      stash.save([...stash.items, toRewardItem(r)]);
      flash(t('gen.stashed'));
    },
    onGive: (to: number) => give([toRewardItem(r)], to),
  });
  const makeBox = () => {
    const b = generateBox({ tier: boxTier, kind: boxKind, floor: f });
    setBoxes((bs) => [
      { uid: ++uidSeq, tier: boxTier, kind: boxKind, items: b.items.map((x) => withUid(x)), gold: b.gold, from: '' },
      ...bs,
    ]);
  };
  /** Send a generated box sealed to the crawler's Boxes tab (from the GM, or from a sponsor when named). */
  const sendBox = async (b: Box, to: number) => {
    const who = crawlers.find((c) => c.id === to)?.summary.name || '?';
    try {
      const box = { tier: b.tier as BoxTier, kind: b.kind, label: '', items: b.items.map(toRewardItem), gold: b.gold };
      await api.sendBoxes(to, [box], b.from.trim() ? 'sponsor' : 'gm', b.from.trim());
      flash(t('gen.boxSent', { name: who }));
      return true;
    } catch (e) {
      flash(err(e), true);
      return false;
    }
  };

  return (
    <div className="page generator-page">
      <section className="card">
        <header className="card-head red">
          <h2>{t('gen.title')}</h2>
        </header>
        <div className="card-body">
          <p className="dim small">{t('gen.intro', { n: combos.toLocaleString() })}</p>
          <div className="gen-controls">
            <label className="field">
              <span className="lbl">{t('gen.floor')}</span>
              <input
                className="in center"
                inputMode="numeric"
                value={f}
                onChange={(e) => setFloor(Math.max(1, Math.min(18, Number(e.target.value.replace(/\D/g, '')) || 1)))}
              />
            </label>
            <label className="field">
              <span className="lbl">{t('gen.quality')}</span>
              <select className="in sel" value={quality} onChange={(e) => setQuality(e.target.value as Quality | '')}>
                <option value="">{t('gen.byFloor')}</option>
                {QUALITIES.map((q) => (
                  <option key={q} value={q}>
                    {t(`rarity.${q}` as MsgKey)}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span className="lbl">{t('gen.kind')}</span>
              <select
                className="in sel"
                value={kind}
                onChange={(e) => {
                  setKind(e.target.value as Kind);
                  setPart('');
                }}
              >
                {KINDS.map((k) => (
                  <option key={k || 'any'} value={k}>
                    {t(`gen.kind.${k || 'any'}` as MsgKey)}
                  </option>
                ))}
              </select>
            </label>
            {BODY[kind] && (
              <label className="field">
                <span className="lbl">{t('gen.part')}</span>
                <select className="in sel" value={part} onChange={(e) => setPart(e.target.value)}>
                  <option value="">{t('gen.anyPart')}</option>
                  {BODY[kind].map((p) => (
                    <option key={p} value={p}>
                      {t(`part.${p}` as MsgKey)}
                    </option>
                  ))}
                </select>
              </label>
            )}
            <label className="field">
              <span className="lbl">{t('gen.count')}</span>
              <select className="in sel" value={count} onChange={(e) => setCount(Number(e.target.value))}>
                {[1, 3, 6, 9, 12].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>
            <button type="button" className="btn primary gen-roll" onClick={roll}>
              🎲 {t('gen.roll')}
            </button>
          </div>
          {!quality && (
            <div className="gen-odds" aria-label={t('gen.odds', { n: f })}>
              <span className="lbl">{t('gen.odds', { n: f })}</span>
              <div className="gen-odds-bar">
                {QUALITIES.filter((q) => odds[q] >= 0.005).map((q) => (
                  <span
                    key={q}
                    className={`gen-odds-seg ${rarityClass(q)}`}
                    style={{ flexGrow: odds[q] }}
                    title={`${t(`rarity.${q}` as MsgKey)} ${(odds[q] * 100).toFixed(0)} %`}
                  >
                    {odds[q] >= 0.07 ? `${t(`rarity.${q}` as MsgKey)} ${(odds[q] * 100).toFixed(0)}%` : ''}
                  </span>
                ))}
              </div>
            </div>
          )}
          <div className="gen-box-controls">
            <span className="lbl">{t('gen.boxTitle')}</span>
            <select className="in sel" value={boxTier} onChange={(e) => setBoxTier(e.target.value as Quality)}>
              {QUALITIES.filter((q) => q !== 'common').map((q) => (
                <option key={q} value={q}>
                  {t(`rarity.${q}` as MsgKey)}
                </option>
              ))}
            </select>
            <select className="in sel" value={boxKind} onChange={(e) => setBoxKind(e.target.value as BoxKind)}>
              {BOX_KINDS.map((k) => (
                <option key={k} value={k}>
                  {t(`box.kind.${k}` as MsgKey)}
                </option>
              ))}
            </select>
            <button type="button" className="btn small" onClick={makeBox}>
              ▣ {t('gen.box')}
            </button>
          </div>
          {msg && <p className={`small ${msg.bad ? 'error' : 'ok'}`}>{msg.text}</p>}
        </div>
      </section>

      {boxes.map((b) => (
        <section key={b.uid} className={`card gen-boxed ${rarityClass(b.tier)}`}>
          <header className="card-head">
            <h2>
              ▣ {boxName(t, { tier: b.tier as never, kind: b.kind, label: '' })}{' '}
              <span className="dim small">· {t('gen.gold', { n: b.gold.toLocaleString() })}</span>
            </h2>
          </header>
          <div className="card-body">
            <div className="gen-actions">
              <input
                className="in gen-box-from"
                value={b.from}
                maxLength={120}
                placeholder={t('gen.boxFrom')}
                aria-label={t('gen.boxFrom')}
                onChange={(e) =>
                  setBoxes((bs) => bs.map((x) => (x.uid === b.uid ? { ...x, from: e.target.value } : x)))
                }
              />
              <GiveTo
                crawlers={crawlers}
                label={t('gen.sendBox')}
                onGive={async (to) => {
                  if (await sendBox(b, to)) setBoxes((bs) => bs.filter((x) => x.uid !== b.uid));
                }}
              />
              <button
                type="button"
                className="btn small ghost"
                onClick={() => {
                  stash.save([...stash.items, ...b.items.map(toRewardItem)]);
                  setBoxes((bs) => bs.filter((x) => x.uid !== b.uid));
                  flash(t('gen.stashed'));
                }}
              >
                📦 {t('gen.allToStash')}
              </button>
              <button
                type="button"
                className="btn small ghost"
                onClick={() => setBoxes((bs) => bs.filter((x) => x.uid !== b.uid))}
              >
                × {t('gen.discard')}
              </button>
            </div>
            <div className="gen-results">
              {b.items.map((r) => (
                <GenCard key={r.uid} {...cardProps(r)} />
              ))}
            </div>
          </div>
        </section>
      ))}

      {results.length > 0 && (
        <div className="gen-results">
          {results.map((r) => (
            <GenCard key={r.uid} {...cardProps(r)} />
          ))}
        </div>
      )}

      <section className="card">
        <header className="card-head">
          <h2>
            {t('gen.stash')} <span className="dim small">({stash.items.length})</span>
          </h2>
        </header>
        <div className="card-body">
          <p className="dim small">{t('gen.stashHint')}</p>
          {stash.items.length === 0 ? (
            <p className="dim small">—</p>
          ) : (
            <ul className="gen-stash">
              {stash.items.map((it, i) => (
                <li key={i} className={rarityClass(it.rarity)}>
                  <span className="grow" title={it.notes}>
                    <span className={`pill tiny-pill rar-pill ${rarityClass(it.rarity)}`}>
                      {t(`rarity.${it.rarity || 'common'}` as MsgKey)}
                    </span>{' '}
                    <strong>{it.item}</strong>
                    {it.curse && (
                      <span className="curse-mark" title={it.curse.text}>
                        {' '}
                        ☠
                      </span>
                    )}{' '}
                    <span className="dim tiny">{bonusText(it as unknown as Item, t)}</span>
                  </span>
                  <GiveTo
                    crawlers={crawlers}
                    onGive={async (to) => {
                      if (await give([it], to)) stash.save(stash.items.filter((_, j) => j !== i));
                    }}
                  />
                  <button
                    type="button"
                    className="row-del"
                    title={t('list.remove')}
                    aria-label={t('list.remove')}
                    onClick={() => stash.save(stash.items.filter((_, j) => j !== i))}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}

/** The parts of a generated item, each with lock / change / remove. */
const PART_ORDER: GenPart[] = ['prefix', 'base', 'adjective', 'role', 'theme'];

function GenCard({
  it,
  crawlers,
  onReroll,
  onPart,
  onLock,
  onRename,
  onStash,
  onGive,
}: {
  it: Rolled;
  crawlers: CharacterSummary[];
  onReroll: () => void;
  onPart: (p: GenPart, mode: 'reroll' | 'remove') => void;
  onLock: (p: GenPart) => void;
  onRename: (name: string) => void;
  onStash: () => void;
  onGive: (to: number) => void;
}) {
  const { t } = useI18n();
  const where = it.fits ? t(`part.${it.fits}` as MsgKey) : '';
  const k = it.gen.kind;
  const isCons = k === 'consumable' || k === 'ammo';
  const isJunk = k === 'crafting';
  const parts = PART_ORDER.filter((p) => !(isJunk && p !== 'base') && !(isCons && p === 'role'));
  const affixes = [it.gen.adjective, it.gen.role, it.gen.theme].filter(Boolean).length;
  const wearable = ['armor', 'weapon', 'shield', 'accessory'].includes(k);
  return (
    <article className={`gen-card ${rarityClass(it.rarity)} ${it.curse ? 'is-cursed' : ''}`}>
      <div className="gen-card-head">
        <span className={`pill tiny-pill rar-pill ${rarityClass(it.rarity)}`}>
          {t(`rarity.${it.rarity}` as MsgKey)}
        </span>
        <span className="dim tiny">
          {[
            t(`itemType.${it.type}` as MsgKey),
            where,
            it.twoHanded && t('inv.twoHanded'),
            it.unique && t('inv.unique'),
            Number(it.qty) > 1 && `×${it.qty}`,
          ]
            .filter(Boolean)
            .join(' · ')}
        </span>
        <span className="dim tiny gen-affixes" title={t('gen.affixesHint')}>
          {'✦'.repeat(affixes) || '·'}
        </span>
      </div>
      <textarea
        className="in gen-name"
        rows={2}
        value={it.item}
        aria-label={t('inv.item')}
        onChange={(e) => onRename(e.target.value.replace(/\n/g, ' '))}
      />
      {bonusText(it as unknown as Item, t) && <div className="gen-bonus">{bonusText(it as unknown as Item, t)}</div>}
      <p className="gen-notes">{it.notes}</p>
      {it.ability && (
        <p className="tiny">
          ★ {t('gen.ability')}: <span className="dim">{it.ability}</span>
        </p>
      )}
      {it.curse && (
        <p className="tiny curse-line">
          ☠ <strong>{t('gen.cursed')}</strong> {it.curse.text}
          {Object.entries(it.curse.bonus).length > 0 &&
            ` (${Object.entries(it.curse.bonus)
              .map(([key, v]) => `${v} ${t(`bonus.${key}` as MsgKey)}`)
              .join(', ')})`}
          <span className="dim"> · {t('gen.cursedHint')}</span>
        </p>
      )}
      <div className="gen-parts">
        {parts.map((p) => {
          const value = it.gen[p];
          return (
            <span key={p} className={`gen-part ${value ? '' : 'empty'} ${it.locks[p] ? 'locked' : ''}`}>
              <span className="gen-part-lbl">{t(`gen.part.${p}` as MsgKey)}</span>
              <span className="gen-part-val">{value || '—'}</span>
              <button
                type="button"
                className="icon-btn small"
                aria-pressed={!!it.locks[p]}
                title={t(it.locks[p] ? 'gen.unlock' : 'gen.lock')}
                onClick={() => onLock(p)}
              >
                {it.locks[p] ? '🔒' : '🔓'}
              </button>
              <button
                type="button"
                className="icon-btn small"
                title={t(value ? 'gen.change' : 'gen.add')}
                onClick={() => onPart(p, 'reroll')}
              >
                {value ? '↻' : '+'}
              </button>
              {value && p !== 'base' && (
                <button
                  type="button"
                  className="icon-btn small"
                  title={t('gen.remove')}
                  onClick={() => onPart(p, 'remove')}
                >
                  ×
                </button>
              )}
            </span>
          );
        })}
        {wearable && (
          <span className={`gen-part curse ${it.gen.curse ? '' : 'empty'}`}>
            <span className="gen-part-lbl">☠ {t('gen.part.curse')}</span>
            <button
              type="button"
              className="icon-btn small"
              title={t(it.gen.curse ? 'gen.change' : 'gen.add')}
              onClick={() => onPart('curse', 'reroll')}
            >
              {it.gen.curse ? '↻' : '+'}
            </button>
            {it.gen.curse && (
              <button
                type="button"
                className="icon-btn small"
                title={t('gen.remove')}
                onClick={() => onPart('curse', 'remove')}
              >
                ×
              </button>
            )}
          </span>
        )}
      </div>
      <div className="gen-actions">
        <button type="button" className="btn small ghost" onClick={onReroll} title={t('gen.rerollHint')}>
          🎲 {t('gen.reroll')}
        </button>
        <button type="button" className="btn small ghost" onClick={onStash}>
          📦 {t('gen.toStash')}
        </button>
        <GiveTo crawlers={crawlers} onGive={onGive} />
      </div>
    </article>
  );
}

function GiveTo({
  crawlers,
  onGive,
  label,
}: {
  crawlers: CharacterSummary[];
  onGive: (to: number) => void;
  label?: string;
}) {
  const { t } = useI18n();
  if (!crawlers.length) return null;
  const party = crawlers.filter((c) => c.inParty);
  const others = crawlers.filter((c) => !c.inParty);
  const opt = (c: CharacterSummary) => (
    <option key={c.id} value={c.id}>
      {c.summary.name || '?'} ({c.ownerName})
    </option>
  );
  return (
    <select
      className="in sel tiny-sel gen-give"
      value=""
      aria-label={label ?? t('gen.give')}
      onChange={(e) => e.target.value && onGive(Number(e.target.value))}
    >
      <option value="">🎁 {label ?? t('gen.give')}</option>
      {party.length > 0 && <optgroup label={t('party.title')}>{party.map(opt)}</optgroup>}
      {others.length > 0 && <optgroup label={t('achPage.others')}>{others.map(opt)}</optgroup>}
    </select>
  );
}
