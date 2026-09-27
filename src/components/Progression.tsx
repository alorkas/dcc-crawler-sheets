import { useState } from 'react';
import { useSheet, Input } from './fields';
import { useI18n, type MsgKey } from '../lib/i18n';
import { useAuth } from '../lib/auth';
import { api, type ProgressAction } from '../lib/api';
import { num } from '../lib/rules';

const BOSS_TIERS = ['neighborhood', 'borough', 'city', 'province', 'country', 'floor'] as const;

/**
 * Level-ups (Core Rulebook: Experience Points, Grinding). Everyone sees their Level history, Stat points to
 * assign and grinding hours; only the GM can add Levels. Level-ups work on locked sheets.
 */
export function ProgressionPanel() {
  const { data, charId, runServer } = useSheet();
  const { user } = useAuth();
  const { t, locale } = useI18n();
  const [quest, setQuest] = useState('1');
  const [tier, setTier] = useState<(typeof BOSS_TIERS)[number]>('neighborhood');
  const [victim, setVictim] = useState('');
  const [hours, setHours] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const gm = !!user?.isAdmin && charId !== undefined;
  const level = num(data.level) ?? 0;
  const points = num(data.statPoints) ?? 0;
  const grind = num(data.grindHours) ?? 0;

  const run = async (action: ProgressAction) => {
    if (charId === undefined) return;
    setBusy(true);
    setError('');
    try {
      await runServer(() => api.progress(charId, action));
    } catch {
      setError(t('err.generic'));
    } finally {
      setBusy(false);
    }
  };

  const history = [...data.levelLog].reverse().slice(0, 12);

  return (
    <div className="progression">
      <div className="prog-summary">
        <div className="prog-stat">
          <span className="lbl">{t('prog.level')}</span>
          <strong>{level || '—'}</strong>
        </div>
        <div className={`prog-stat ${points > 0 ? 'has-points' : ''}`}>
          <span className="lbl">{t('prog.statPoints')}</span>
          <Input path={['statPoints']} center numeric ariaLabel={t('prog.statPoints')} />
        </div>
        <div className="prog-stat">
          <span className="lbl">{t('prog.grind')}</span>
          <span>
            <strong>{grind}</strong> / {Math.max(1, level)} h
          </span>
        </div>
      </div>
      <p className="dim tiny">{t('prog.hint')}</p>

      {gm ? (
        <div className="prog-actions">
          <button type="button" className="btn small primary" disabled={busy} onClick={() => run({ type: 'twoHours' })}>
            {t('prog.twoHours')}
          </button>
          <div className="prog-act">
            <input
              className="in center tiny-in"
              inputMode="numeric"
              value={quest}
              aria-label={t('prog.questLevels')}
              onChange={(e) => setQuest(e.target.value)}
            />
            <button
              type="button"
              className="btn small"
              disabled={busy || !num(quest)}
              onClick={() => run({ type: 'quest', levels: num(quest) ?? 1 })}
            >
              {t('prog.quest')}
            </button>
          </div>
          <div className="prog-act">
            <select
              className="in sel"
              value={tier}
              aria-label={t('prog.bossTier')}
              onChange={(e) => setTier(e.target.value as (typeof BOSS_TIERS)[number])}
            >
              {BOSS_TIERS.map((b, i) => (
                <option key={b} value={b}>
                  {t(`prog.tier.${b}` as MsgKey)} (+{i + 1})
                </option>
              ))}
            </select>
            <button type="button" className="btn small" disabled={busy} onClick={() => run({ type: 'boss', tier })}>
              {t('prog.boss')}
            </button>
          </div>
          <div className="prog-act">
            <input
              className="in center tiny-in"
              inputMode="numeric"
              value={victim}
              placeholder={t('prog.victimPh')}
              aria-label={t('prog.victimLevel')}
              onChange={(e) => setVictim(e.target.value)}
            />
            <button
              type="button"
              className="btn small"
              disabled={busy || !num(victim)}
              title={t('prog.killHint')}
              onClick={() => run({ type: 'kill', victimLevel: num(victim) ?? 1 })}
            >
              {t('prog.kill')}
            </button>
          </div>
          <div className="prog-act">
            <input
              className="in center tiny-in"
              inputMode="numeric"
              value={hours}
              placeholder="h"
              aria-label={t('prog.grindHours')}
              onChange={(e) => setHours(e.target.value)}
            />
            <button
              type="button"
              className="btn small"
              disabled={busy || !num(hours)}
              title={t('prog.grindHint')}
              onClick={() => {
                run({ type: 'grind', hours: num(hours) ?? 0 });
                setHours('');
              }}
            >
              {t('prog.grindAdd')}
            </button>
          </div>
        </div>
      ) : (
        <p className="dim small">{t('prog.gmOnly')}</p>
      )}
      {error && <p className="error small">{error}</p>}

      {history.length > 0 && (
        <div className="prog-history">
          <div className="sub-lbl">{t('prog.history')}</div>
          <ul className="plain">
            {history.map((h, i) => (
              <li key={i}>
                <span className="pill">{t('prog.lvlArrow', { from: h.from, to: h.to })}</span>{' '}
                {t(`prog.src.${h.source}` as MsgKey)}
                {h.source === 'boss' && h.detail && ` · ${t(`prog.tier.${h.detail}` as MsgKey)}`}
                {h.source !== 'boss' && h.detail && ` · ${h.detail}`}
                <span className="dim tiny">
                  {' '}
                  · {h.floor && `${t('dash.floor', { n: h.floor })} · `}
                  {new Date(h.at).toLocaleDateString(locale)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
