import { useEffect, useState } from 'react';
import { api, type World, type WorldPatch } from '../lib/api';
import { useAuth } from '../lib/auth';
import { useI18n } from '../lib/i18n';
import { useLive } from '../lib/live';

/** "Xd Yh" for in-game hours left. */
export function collapseText(hours: number, t: ReturnType<typeof useI18n>['t']) {
  const d = Math.floor(hours / 24);
  const h = hours % 24;
  return d ? t('world.dh', { d, h }) : t('world.h', { h });
}

/** World Stats: the Floor, crawlers alive, time to Level Collapse and the Floor's ambience. GM can change them. */
export default function WorldPage() {
  const { t, lang } = useI18n();
  const { user } = useAuth();
  const { world, party } = useLive();
  if (!world) return <div className="center-page dim">{t('common.loading')}</div>;
  const w = world;
  const name = lang === 'es' ? w.nameEs : w.name;
  const ambience = (lang === 'es' ? w.ambienceEs : w.ambience) || w.ambience || w.ambienceEs;
  const total = w.collapseDays * 24;
  const pct = total ? Math.max(0, Math.min(100, (w.collapseHours / total) * 100)) : 0;
  const urgent = w.collapseHours <= 24;
  return (
    <div className="page world-page">
      <div className="world-hero card">
        <div className="world-floor">
          <span className="world-floor-lbl">{t('world.floor')}</span>
          <span className="world-floor-num">{w.floor}</span>
        </div>
        <div className="world-hero-main">
          <h1>{name}</h1>
          <div className="world-tiles">
            <div className="world-tile">
              <span className="lbl">{t('world.alive')}</span>
              <strong>
                {w.crawlersAlive === null ? '—' : w.crawlersAlive.toLocaleString(lang === 'es' ? 'es-ES' : 'en-GB')}
              </strong>
            </div>
            <div className={`world-tile ${urgent ? 'urgent' : ''}`}>
              <span className="lbl">{t('world.collapse')}</span>
              <strong>{collapseText(w.collapseHours, t)}</strong>
              {total > 0 && (
                <div className="collapse-bar" aria-hidden>
                  <span style={{ width: `${pct}%` }} />
                </div>
              )}
            </div>
            <div className="world-tile">
              <span className="lbl">{t('world.party')}</span>
              <strong>{party?.length ?? 0}</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="card world-ambience">
        <div className="card-body">
          <div className="ai-says-lbl">{t('world.ambience')}</div>
          <p>{ambience || <span className="dim">{t('world.noAmbience')}</span>}</p>
        </div>
      </div>

      {user?.isAdmin && <WorldControls w={w} />}
    </div>
  );
}

function WorldControls({ w }: { w: World }) {
  const { t, err } = useI18n();
  const { setWorld } = useLive();
  const [floor, setFloor] = useState(String(w.floor));
  const [sync, setSync] = useState(true);
  const [alive, setAlive] = useState(w.crawlersAlive === null ? '' : String(w.crawlersAlive));
  const [days, setDays] = useState(String(Math.floor(w.collapseHours / 24)));
  const [hours, setHours] = useState(String(w.collapseHours % 24));
  const [text, setText] = useState({ name: w.name, nameEs: w.nameEs, ambience: w.ambience, ambienceEs: w.ambienceEs });
  const [msg, setMsg] = useState('');
  // follow changes made elsewhere (another tab, or a Floor change)
  useEffect(() => {
    setFloor(String(w.floor));
    setAlive(w.crawlersAlive === null ? '' : String(w.crawlersAlive));
    setDays(String(Math.floor(w.collapseHours / 24)));
    setHours(String(w.collapseHours % 24));
    setText({ name: w.name, nameEs: w.nameEs, ambience: w.ambience, ambienceEs: w.ambienceEs });
  }, [w]);
  const save = async (p: WorldPatch, done?: string) => {
    setMsg('');
    try {
      setWorld(await api.updateWorld(p));
      if (done) {
        setMsg(done);
        setTimeout(() => setMsg(''), 2000);
      }
    } catch (e) {
      setMsg(err(e));
    }
  };
  const floors = Array.from({ length: w.maxFloor }, (_, i) => i + 1);
  return (
    <div className="card world-gm">
      <div className="card-body">
        <h2 className="section-title">{t('world.gm')}</h2>

        <div className="world-row">
          <label className="field">
            <span className="lbl">{t('world.floor')}</span>
            <select className="in sel" value={floor} onChange={(e) => setFloor(e.target.value)}>
              {floors.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </label>
          <label className="gm-check">
            <input type="checkbox" checked={sync} onChange={(e) => setSync(e.target.checked)} />
            {t('world.syncParty')}
          </label>
          <button
            type="button"
            className="btn primary"
            disabled={Number(floor) === w.floor}
            onClick={() => {
              if (confirm(t('world.floorConfirm', { n: floor }))) save({ floor: Number(floor), syncParty: sync });
            }}
          >
            {t('world.setFloor')}
          </button>
        </div>
        <p className="dim tiny">{t('world.floorHint')}</p>

        <div className="world-row">
          <span className="lbl">{t('world.collapse')}</span>
          {[-1, -2, -8, -24].map((h) => (
            <button key={h} type="button" className="btn small ghost" onClick={() => save({ addHours: h })}>
              {h} h
            </button>
          ))}
          <button type="button" className="btn small ghost" onClick={() => save({ addHours: 1 })}>
            +1 h
          </button>
          <label className="mini">
            <span>{t('world.days')}</span>
            <input className="in center" inputMode="numeric" value={days} onChange={(e) => setDays(e.target.value)} />
          </label>
          <label className="mini">
            <span>{t('world.hours')}</span>
            <input className="in center" inputMode="numeric" value={hours} onChange={(e) => setHours(e.target.value)} />
          </label>
          <button
            type="button"
            className="btn small"
            onClick={() => save({ collapseHours: (Number(days) || 0) * 24 + (Number(hours) || 0) }, t('world.saved'))}
          >
            {t('world.set')}
          </button>
        </div>

        <div className="world-row">
          <label className="field grow">
            <span className="lbl">{t('world.alive')}</span>
            <input
              className="in"
              inputMode="numeric"
              value={alive}
              placeholder="—"
              onChange={(e) => setAlive(e.target.value)}
            />
          </label>
          <button
            type="button"
            className="btn small"
            onClick={() => save({ crawlersAlive: alive || null }, t('world.saved'))}
          >
            {t('world.set')}
          </button>
        </div>

        <div className="world-texts">
          <label className="field">
            <span className="lbl">{t('world.name')} (EN)</span>
            <input className="in" value={text.name} onChange={(e) => setText({ ...text, name: e.target.value })} />
          </label>
          <label className="field">
            <span className="lbl">{t('world.name')} (ES)</span>
            <input className="in" value={text.nameEs} onChange={(e) => setText({ ...text, nameEs: e.target.value })} />
          </label>
          <label className="field">
            <span className="lbl">{t('world.ambience')} (EN)</span>
            <textarea
              className="in"
              rows={6}
              value={text.ambience}
              onChange={(e) => setText({ ...text, ambience: e.target.value })}
            />
          </label>
          <label className="field">
            <span className="lbl">{t('world.ambience')} (ES)</span>
            <textarea
              className="in"
              rows={6}
              value={text.ambienceEs}
              onChange={(e) => setText({ ...text, ambienceEs: e.target.value })}
            />
          </label>
        </div>
        <div className="world-row">
          <button type="button" className="btn primary" onClick={() => save(text, t('world.saved'))}>
            {t('world.saveTexts')}
          </button>
          {w.customized && (
            <button
              type="button"
              className="btn ghost"
              onClick={() => {
                if (confirm(t('world.resetConfirm'))) save({ reset: true });
              }}
            >
              {t('world.reset')}
            </button>
          )}
          {msg && <span className="dim small">{msg}</span>}
        </div>
      </div>
    </div>
  );
}
