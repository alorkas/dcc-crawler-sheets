import { useAuth } from '../lib/auth';
import { useI18n, type MsgKey } from '../lib/i18n';
import { KILL_KINDS, type Kills } from '../lib/sheet';
import { useSheet } from './fields';

/* Kill counters, shown like the HUD does over a crawler's head (Core Rulebook "Map Symbols"): a skull per crawler
   killed, a golden skull per leaderboard (Top 10) crawler, a star per Boss (golden for City Bosses or bigger).
   The GM keeps the counts on the Pets & more tab. */

type Kind = (typeof KILL_KINDS)[number];
const SKULLS: Kind[] = ['crawlers', 'top10'];
const STARS: Kind[] = ['bosses', 'cityBosses'];

export const killCounts = (k: Partial<Kills> | undefined) =>
  Object.fromEntries(
    KILL_KINDS.map((kind) => [kind, Math.max(0, parseInt(String(k?.[kind] ?? ''), 10) || 0)]),
  ) as Record<Kind, number>;

const Skull = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden fill="currentColor">
    <path d="M12 2C6.9 2 3 5.7 3 10.4c0 2.7 1.3 5 3.4 6.5V20a1 1 0 0 0 1 1h1.8v-2h1.4v2h2.8v-2h1.4v2h1.8a1 1 0 0 0 1-1v-3.1c2.1-1.5 3.4-3.8 3.4-6.5C21 5.7 17.1 2 12 2Zm-3.6 11.6a2.1 2.1 0 1 1 0-4.2 2.1 2.1 0 0 1 0 4.2Zm7.2 0a2.1 2.1 0 1 1 0-4.2 2.1 2.1 0 0 1 0 4.2ZM12 15.2l-1.2 2h2.4l-1.2-2Z" />
  </svg>
);
const Star = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden fill="currentColor">
    <path d="m12 2.5 2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5-4.8-4.6 6.6-.9z" />
  </svg>
);

/** One kind of mark: up to 3 icons, then one icon ×N (so a long list doesn't break the line). */
function Marks({ kind, n }: { kind: Kind; n: number }) {
  const { t } = useI18n();
  if (!n) return null;
  const Icon = SKULLS.includes(kind) ? Skull : Star;
  const gold = kind === 'top10' || kind === 'cityBosses';
  return (
    <span className={`km km-${kind} ${gold ? 'gold' : ''}`} title={t(`killc.${kind}N` as MsgKey, { n })}>
      {n <= 3 ? (
        Array.from({ length: n }, (_, i) => <Icon key={i} />)
      ) : (
        <>
          <Icon />
          <small>×{n}</small>
        </>
      )}
    </span>
  );
}

/** Skulls and stars next to a crawler's name (party list). Nothing when there are no kills. */
export function KillMarks({ kills, className = '' }: { kills: Partial<Kills> | undefined; className?: string }) {
  const c = killCounts(kills);
  if (!KILL_KINDS.some((k) => c[k])) return null;
  return (
    <span className={`kill-marks ${className}`}>
      {KILL_KINDS.map((k) => (
        <Marks key={k} kind={k} n={c[k]} />
      ))}
    </span>
  );
}

/** The same marks over the portrait: skulls in the top left corner, stars in the top right. */
export function KillOverlay({ kills }: { kills: Partial<Kills> | undefined }) {
  const c = killCounts(kills);
  const any = (kinds: Kind[]) => kinds.some((k) => c[k]);
  return (
    <>
      {any(SKULLS) && (
        <span className="kill-overlay left">
          {SKULLS.map((k) => (
            <Marks key={k} kind={k} n={c[k]} />
          ))}
        </span>
      )}
      {any(STARS) && (
        <span className="kill-overlay right">
          {STARS.map((k) => (
            <Marks key={k} kind={k} n={c[k]} />
          ))}
        </span>
      )}
    </>
  );
}

/** Pets & more tab: the counters. The GM changes them; the player sees them. */
export function KillCounters() {
  const { t } = useI18n();
  const { user } = useAuth();
  const { data, update } = useSheet();
  const admin = !!user?.isAdmin;
  const c = killCounts(data.killCount);
  const set = (kind: Kind, n: number) =>
    update((d) => ({ ...d, killCount: { ...d.killCount, [kind]: n > 0 ? String(n) : '' } }));
  return (
    <div className="kill-counters">
      {KILL_KINDS.map((k) => (
        <div key={k} className={`kill-counter km-${k}`}>
          <span className={`km ${k === 'top10' || k === 'cityBosses' ? 'gold' : ''}`} aria-hidden>
            {SKULLS.includes(k) ? <Skull /> : <Star />}
          </span>
          <span className="kill-counter-lbl">{t(`killc.${k}` as MsgKey)}</span>
          {admin ? (
            <span className="kill-counter-ctrl">
              <button
                type="button"
                className="btn small ghost"
                disabled={!c[k]}
                aria-label={t('killc.minus', { what: t(`killc.${k}` as MsgKey) })}
                onClick={() => set(k, c[k] - 1)}
              >
                −
              </button>
              <input
                className="in center tiny-in"
                inputMode="numeric"
                value={c[k] || ''}
                placeholder="0"
                aria-label={t(`killc.${k}` as MsgKey)}
                onChange={(e) => set(k, parseInt(e.target.value.replace(/[^\d]/g, ''), 10) || 0)}
              />
              <button
                type="button"
                className="btn small ghost"
                aria-label={t('killc.plus', { what: t(`killc.${k}` as MsgKey) })}
                onClick={() => set(k, c[k] + 1)}
              >
                +
              </button>
            </span>
          ) : (
            <strong className="kill-counter-n">{c[k]}</strong>
          )}
        </div>
      ))}
      {!admin && <p className="dim tiny">{t('killc.gmOnly')}</p>}
    </div>
  );
}
