import { useEffect, useMemo, useState } from 'react';
import { api, type CharacterSummary, type RewardItem } from '../lib/api';
import { useI18n, type MsgKey } from '../lib/i18n';
import {
  QUALITIES,
  combinations,
  generateItem,
  qualityOdds,
  type GeneratedItem,
  type GenKind,
  type Quality,
} from '../../shared/lootgen.js';
import { bonusText, rarityClass } from '../components/Inventory';
import type { Item } from '../lib/sheet';

/* GM: the loot generator. Pick a Floor (the odds of each quality follow it) or a quality, what kind of item and
   where it's worn, and roll. Each result can be rerolled, renamed, given to a crawler or kept in the stash (which
   the loot box editor can also use). */

type Kind = GenKind | 'equipment' | '';
const KINDS: Kind[] = ['', 'equipment', 'armor', 'weapon', 'shield', 'accessory', 'consumable', 'ammo'];
const PARTS: Record<string, string[]> = {
  armor: ['head', 'shoulders', 'chest', 'bracers', 'hands', 'back', 'waist', 'pants', 'feet'],
  accessory: ['head', 'shoulders', 'chest', 'bracers', 'hands', 'back', 'waist', 'pants', 'feet', 'neck', 'finger'],
};
type Rolled = GeneratedItem & { uid: number };
let uidSeq = 0;
const withUid = (it: GeneratedItem): Rolled => ({ ...it, uid: ++uidSeq });

/** What a generated item looks like as a reward/inventory item (no generator details). */
export function toRewardItem(it: GeneratedItem | Rolled): RewardItem {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { gen, uid, ...rest } = it as Rolled;
  return { ...rest, special: false };
}

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

export default function GeneratorPage() {
  const { t, err } = useI18n();
  const worldFloor = useWorldFloor();
  const [floor, setFloor] = useState<number | null>(null);
  const [quality, setQuality] = useState<Quality | ''>('');
  const [kind, setKind] = useState<Kind>('');
  const [part, setPart] = useState('');
  const [count, setCount] = useState(6);
  const [results, setResults] = useState<Rolled[]>([]);
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

  const opts = { floor: f, quality, kind, part };
  const roll = () => setResults(Array.from({ length: count }, () => withUid(generateItem(opts))));
  const reroll = (uid: number) =>
    setResults((rs) =>
      rs.map((r) =>
        r.uid === uid ? withUid(generateItem({ floor: f, quality: r.gen.quality, kind: r.gen.kind, part })) : r,
      ),
    );
  const rename = (uid: number, item: string) => setResults((rs) => rs.map((r) => (r.uid === uid ? { ...r, item } : r)));
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
            {PARTS[kind] && (
              <label className="field">
                <span className="lbl">{t('gen.part')}</span>
                <select className="in sel" value={part} onChange={(e) => setPart(e.target.value)}>
                  <option value="">{t('gen.anyPart')}</option>
                  {PARTS[kind].map((p) => (
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
          {msg && <p className={`small ${msg.bad ? 'error' : 'ok'}`}>{msg.text}</p>}
        </div>
      </section>

      {results.length > 0 && (
        <div className="gen-results">
          {results.map((r) => (
            <GenCard
              key={r.uid}
              it={r}
              crawlers={crawlers}
              onReroll={() => reroll(r.uid)}
              onRename={(name) => rename(r.uid, name)}
              onStash={() => {
                stash.save([...stash.items, toRewardItem(r)]);
                flash(t('gen.stashed'));
              }}
              onGive={(to) => give([toRewardItem(r)], to)}
            />
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
                    <strong>{it.item}</strong> <span className="dim tiny">{bonusText(it as unknown as Item, t)}</span>
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

function GenCard({
  it,
  crawlers,
  onReroll,
  onRename,
  onStash,
  onGive,
}: {
  it: Rolled;
  crawlers: CharacterSummary[];
  onReroll: () => void;
  onRename: (name: string) => void;
  onStash: () => void;
  onGive: (to: number) => void;
}) {
  const { t } = useI18n();
  const where = it.fits ? t(`part.${it.fits}` as MsgKey) : '';
  const affixes = [it.gen.prefix, it.gen.role, it.gen.theme].filter(Boolean).length;
  return (
    <article className={`gen-card ${rarityClass(it.rarity)}`}>
      <div className="gen-card-head">
        <span className={`pill tiny-pill rar-pill ${rarityClass(it.rarity)}`}>
          {t(`rarity.${it.rarity}` as MsgKey)}
        </span>
        <span className="dim tiny">
          {[
            t(`itemType.${it.type}` as MsgKey),
            where,
            it.twoHanded && t('inv.twoHanded'),
            Number(it.qty) > 1 && `×${it.qty}`,
          ]
            .filter(Boolean)
            .join(' · ')}
        </span>
        <span className="dim tiny gen-affixes" title={t('gen.affixesHint')}>
          {'✦'.repeat(affixes) || '·'}
        </span>
      </div>
      <input
        className="in gen-name"
        value={it.item}
        aria-label={t('inv.item')}
        onChange={(e) => onRename(e.target.value)}
      />
      {bonusText(it as unknown as Item, t) && <div className="gen-bonus">{bonusText(it as unknown as Item, t)}</div>}
      <p className="gen-notes">{it.notes}</p>
      {it.ability && (
        <p className="tiny">
          ★ {t('gen.ability')}: <span className="dim">{it.ability}</span>
        </p>
      )}
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

function GiveTo({ crawlers, onGive }: { crawlers: CharacterSummary[]; onGive: (to: number) => void }) {
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
      aria-label={t('gen.give')}
      onChange={(e) => e.target.value && onGive(Number(e.target.value))}
    >
      <option value="">🎁 {t('gen.give')}</option>
      {party.length > 0 && <optgroup label={t('party.title')}>{party.map(opt)}</optgroup>}
      {others.length > 0 && <optgroup label={t('achPage.others')}>{others.map(opt)}</optgroup>}
    </select>
  );
}
