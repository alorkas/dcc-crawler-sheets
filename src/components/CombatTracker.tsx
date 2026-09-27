import { useEffect, useState } from 'react';
import { api, type Npc, type Opponent, type PartyMember } from '../lib/api';
import { useAuth } from '../lib/auth';
import { useI18n, type MsgKey } from '../lib/i18n';
import { useLive } from '../lib/live';
import { normalize } from '../lib/sheet';
import { derive } from '../lib/rules';
import { NPC_KINDS } from '../lib/npc';

export const PHASES = [1, 2, 3, 4, 5] as const;

/** "13+F" → 13 + Floor (for the GM's quick reference). */
const withFloor = (v: string | undefined, floor: number) => {
  const s = String(v ?? '');
  const n = parseInt(s.replace(/[^\d-]/g, ''), 10);
  if (!Number.isFinite(n)) return s;
  return String(n + (/\+\s*F\b/i.test(s) ? floor : 0));
};

/** Round counter, the 5 phases of a combat round, and GM controls. Shown at the top of the party panel. */
export function CombatHeader() {
  const { t } = useI18n();
  const { user } = useAuth();
  const { encounter, setEncounter, party } = useLive();
  const [surprise, setSurprise] = useState(false);
  const [floor, setFloor] = useState('');
  const [busy, setBusy] = useState(false);
  const gm = !!user?.isAdmin;

  const act = async (action: 'start' | 'next' | 'prev' | 'end', extra: Record<string, unknown> = {}) => {
    setBusy(true);
    try {
      setEncounter(await api.encounterAction(action, extra));
    } catch {
      /* ignore */
    } finally {
      setBusy(false);
    }
  };

  if (!encounter?.active) {
    if (!gm) return null;
    return (
      <div className="combat-start">
        <div className="combat-start-row">
          <button
            type="button"
            className="btn small primary"
            disabled={busy}
            onClick={() => act('start', { surprise, ...(floor ? { floor: Number(floor) || 1 } : {}) })}
          >
            ⚔ {t('combat.start')}
          </button>
          <label className="gm-check">
            <input type="checkbox" checked={surprise} onChange={(e) => setSurprise(e.target.checked)} />
            {t('combat.surprise')}
          </label>
          <label className="gm-check">
            {t('combat.floor')}
            <input
              className="in center tiny-in"
              inputMode="numeric"
              value={floor}
              placeholder={t('combat.floorAuto')}
              onChange={(e) => setFloor(e.target.value)}
            />
          </label>
        </div>
        <TwoHoursButton disabled={!party?.length} />
      </div>
    );
  }

  const e = encounter;
  const isSurprise = e.round === 0;
  return (
    <div className="combat">
      <div className="combat-head">
        <span className="combat-round">
          ⚔ {isSurprise ? t('combat.surpriseRound') : t('combat.round', { n: e.round })}
        </span>
        <span className="dim tiny">{t('dash.floor', { n: e.floor })}</span>
      </div>
      {isSurprise ? (
        <p className="phase-hint">{t('combat.surpriseHint')}</p>
      ) : (
        <ol className="phases">
          {PHASES.map((p) => (
            <li key={p} className={p === e.phase ? 'current' : p < e.phase ? 'done' : ''}>
              <span className="phase-num">{p}</span>
              <span className="phase-name">{t(`combat.phase.${p}` as MsgKey)}</span>
              {p === e.phase && (
                <span className="phase-hint">
                  {t(`combat.phase.${p}.hint` as MsgKey)}
                  {p === 5 && <CleanUpReminders members={party ?? []} />}
                </span>
              )}
            </li>
          ))}
        </ol>
      )}
      {gm && (
        <div className="combat-ctrl">
          <button
            type="button"
            className="btn small ghost"
            disabled={busy || (e.round <= 1 && e.phase === 1)}
            onClick={() => act('prev')}
            aria-label={t('combat.prev')}
            title={t('combat.prev')}
          >
            ◂
          </button>
          <button type="button" className="btn small primary grow" disabled={busy} onClick={() => act('next')}>
            {isSurprise || e.phase === 5 ? t('combat.nextRound') : t('combat.nextPhase')} ▸
          </button>
          <button
            type="button"
            className="btn small ghost"
            disabled={busy}
            onClick={() => {
              if (confirm(t('combat.endConfirm'))) act('end');
            }}
          >
            {t('combat.end')}
          </button>
        </div>
      )}
    </div>
  );
}

/** Clean-up reminders: Dying countdowns and ongoing debuffs of the party. */
function CleanUpReminders({ members }: { members: PartyMember[] }) {
  const { t } = useI18n();
  const items = members
    .map((m) => {
      const sheet = normalize(m.view);
      const der = derive(sheet);
      const bits: string[] = [];
      if (der.dying) bits.push(t('combat.reminderDying', { n: sheet.dyingRounds || '?' }));
      for (const d of sheet.debuffList)
        bits.push(t(`debuff.${d.id}` as MsgKey) + (d.stacks > 1 ? ` ×${d.stacks}` : ''));
      return bits.length ? { name: sheet.name || '?', bits } : null;
    })
    .filter((x): x is { name: string; bits: string[] } => x !== null);
  if (!items.length) return null;
  return (
    <ul className="reminders">
      {items.map((i) => (
        <li key={i.name}>
          <strong>{i.name}:</strong> {i.bits.join(', ')}
        </li>
      ))}
    </ul>
  );
}

/** GM: "2 hours of play" — every party member gains a Level and rolls 2-hour Skill Advancement. */
function TwoHoursButton({ disabled }: { disabled: boolean }) {
  const { t } = useI18n();
  const [state, setState] = useState<'idle' | 'busy' | 'done'>('idle');
  return (
    <button
      type="button"
      className="btn small ghost two-hours"
      disabled={disabled || state === 'busy'}
      title={t('prog.partyTwoHoursHint')}
      onClick={async () => {
        if (!confirm(t('prog.partyTwoHoursConfirm'))) return;
        setState('busy');
        try {
          await api.partyTwoHours();
          setState('done');
          setTimeout(() => setState('idle'), 2000);
        } catch {
          setState('idle');
        }
      }}
    >
      {state === 'done' ? '✓ ' : '⏱ '}
      {t('prog.partyTwoHours')}
    </button>
  );
}

/** The opponents side of the fight. Players see names and Health %, the GM sees and changes everything. */
export function Opponents() {
  const { t } = useI18n();
  const { user } = useAuth();
  const { encounter } = useLive();
  const gm = !!user?.isAdmin;
  if (!encounter?.active) return null;
  const list = encounter.opponents;
  return (
    <div className="opponents">
      <div className="side-sub">
        {t('combat.opponents')} <span className="count-badge">{list.filter((o) => !o.defeated).length}</span>
      </div>
      {list.length === 0 && <p className="dim small">{t(gm ? 'combat.noOpponentsGm' : 'combat.noOpponents')}</p>}
      {list.map((o) => (
        <OpponentRow key={o.id} o={o} floor={encounter.floor} gm={gm} />
      ))}
      {gm && <AddOpponent />}
    </div>
  );
}

function OpponentRow({ o, floor, gm }: { o: Opponent; floor: number; gm: boolean }) {
  const { t } = useI18n();
  const { setEncounter } = useLive();
  const [dmg, setDmg] = useState('');
  const tone = o.defeated ? 'dying' : o.pct >= 60 ? 'ok' : o.pct >= 30 ? 'warn' : 'bad';
  const upd = async (p: Record<string, unknown>) => {
    try {
      setEncounter(await api.updateOpponent(o.id, p));
    } catch {
      /* ignore */
    }
  };
  const slots = o.slots ?? 0;
  const filled = slots - (o.lost ?? 0);
  return (
    <div className={`opponent member tone-${tone} ${o.defeated ? 'defeated' : ''} ${o.hidden ? 'is-hidden' : ''}`}>
      <div className="member-head">
        <span className={`member-avatar npc-kind kind-${o.kind}`}>{t(`npc.kind.${o.kind}` as MsgKey).slice(0, 1)}</span>
        <div className="member-id">
          <span className="member-name">{o.name}</span>
          <span className="dim tiny">
            {t(`npc.kind.${o.kind}` as MsgKey)}
            {gm && o.evade && ` · ${t('npc.evadeShort', { v: withFloor(o.evade, floor) })}`}
            {gm && o.dr && ` · ${t('npc.drShort', { v: withFloor(o.dr, floor) })}`}
            {gm && ` · ${t('npc.hbShort', { n: slots, v: o.slotValue ?? '?' })}`}
          </span>
        </div>
        {gm && (
          <>
            <button
              type="button"
              className="icon-btn small"
              title={t(o.hidden ? 'combat.reveal' : 'combat.hide')}
              aria-label={t(o.hidden ? 'combat.reveal' : 'combat.hide')}
              onClick={() => upd({ hidden: !o.hidden })}
            >
              {o.hidden ? '◌' : '●'}
            </button>
            <button
              type="button"
              className="icon-btn small"
              title={t('combat.remove')}
              aria-label={t('combat.remove')}
              onClick={async () => setEncounter(await api.removeOpponent(o.id))}
            >
              ×
            </button>
          </>
        )}
      </div>
      <div className="hp-row">
        {gm ? (
          <div className="hp-bar" style={{ gridTemplateColumns: `repeat(${Math.max(1, slots)}, 1fr)` }}>
            {Array.from({ length: slots }, (_, i) => (
              <span key={i} className={i < filled ? 'on' : ''} />
            ))}
          </div>
        ) : (
          <div className="mana-bar hp-smooth">
            <span style={{ width: `${o.pct}%` }} />
          </div>
        )}
        <span className="hp-pct">{o.defeated ? '✝' : `${o.pct}%`}</span>
      </div>
      {gm && (
        <div className="opp-dmg">
          <input
            className="in center tiny-in"
            inputMode="numeric"
            value={dmg}
            placeholder={t('combat.dmgPh')}
            aria-label={t('health.damage')}
            onChange={(e) => setDmg(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && Number(dmg)) {
                upd({ damage: Number(dmg) });
                setDmg('');
              }
            }}
          />
          <button
            type="button"
            className="btn small"
            disabled={!Number(dmg)}
            title={t('combat.hitHint')}
            onClick={() => {
              upd({ damage: Number(dmg) });
              setDmg('');
            }}
          >
            {t('combat.hit')}
          </button>
          <button
            type="button"
            className="btn small ghost"
            disabled={!o.lost}
            title={t('combat.healSlot')}
            aria-label={t('combat.healSlot')}
            onClick={() => upd({ lost: (o.lost ?? 0) - 1 })}
          >
            +1
          </button>
          <button
            type="button"
            className="btn small ghost"
            disabled={o.defeated}
            title={t('combat.loseSlot')}
            aria-label={t('combat.loseSlot')}
            onClick={() => upd({ lost: (o.lost ?? 0) + 1 })}
          >
            −1
          </button>
        </div>
      )}
    </div>
  );
}

function AddOpponent() {
  const { t } = useI18n();
  const { setEncounter } = useLive();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<'npc' | 'quick'>('npc');
  const [npcs, setNpcs] = useState<Npc[] | null>(null);
  const [npcId, setNpcId] = useState('');
  const [q, setQ] = useState({ name: '', kind: 'mob', slots: '3', slotValue: '2', dr: '', count: '1', hidden: false });

  useEffect(() => {
    if (!open || npcs) return;
    api
      .npcs()
      .then((l) => {
        setNpcs(l);
        if (!l.length) setMode('quick');
      })
      .catch(() => setNpcs([]));
  }, [open, npcs]);

  if (!open)
    return (
      <button type="button" className="btn small ghost add-row" onClick={() => setOpen(true)}>
        + {t('combat.addOpponent')}
      </button>
    );

  const submit = async () => {
    try {
      const body =
        mode === 'npc'
          ? { npcId: Number(npcId), count: Number(q.count) || 1, hidden: q.hidden }
          : { ...q, slots: Number(q.slots) || 3, slotValue: Number(q.slotValue) || 2, count: Number(q.count) || 1 };
      setEncounter(await api.addOpponents(body));
      setQ((x) => ({ ...x, name: '' }));
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="add-opp">
      <div className="seg small">
        <button type="button" className={mode === 'npc' ? 'active' : ''} onClick={() => setMode('npc')}>
          {t('combat.fromNpc')}
        </button>
        <button type="button" className={mode === 'quick' ? 'active' : ''} onClick={() => setMode('quick')}>
          {t('combat.quick')}
        </button>
      </div>
      {mode === 'npc' ? (
        <select
          className="in sel"
          value={npcId}
          onChange={(e) => setNpcId(e.target.value)}
          aria-label={t('combat.fromNpc')}
        >
          <option value="">{npcs?.length ? t('combat.pickNpc') : t('combat.noNpcs')}</option>
          {(npcs ?? []).map((n) => (
            <option key={n.id} value={n.id}>
              {n.data.name || t('npc.unnamed')}
            </option>
          ))}
        </select>
      ) : (
        <div className="quick-opp">
          <input
            className="in"
            value={q.name}
            placeholder={t('combat.namePh')}
            aria-label={t('core.name')}
            onChange={(e) => setQ({ ...q, name: e.target.value })}
          />
          <select
            className="in sel"
            value={q.kind}
            aria-label={t('npc.kind')}
            onChange={(e) => setQ({ ...q, kind: e.target.value })}
          >
            {NPC_KINDS.map((k) => (
              <option key={k} value={k}>
                {t(`npc.kind.${k}` as MsgKey)}
              </option>
            ))}
          </select>
          <label className="mini">
            <span>{t('npc.slots')}</span>
            <input
              className="in center"
              inputMode="numeric"
              value={q.slots}
              onChange={(e) => setQ({ ...q, slots: e.target.value })}
            />
          </label>
          <label className="mini">
            <span>{t('npc.slotValue')}</span>
            <input
              className="in center"
              inputMode="numeric"
              value={q.slotValue}
              onChange={(e) => setQ({ ...q, slotValue: e.target.value })}
            />
          </label>
          <label className="mini">
            <span>{t('npc.dr')}</span>
            <input className="in center" value={q.dr} onChange={(e) => setQ({ ...q, dr: e.target.value })} />
          </label>
        </div>
      )}
      <div className="add-opp-row">
        <label className="mini">
          <span>{t('npc.count')}</span>
          <input
            className="in center"
            inputMode="numeric"
            value={q.count}
            onChange={(e) => setQ({ ...q, count: e.target.value })}
          />
        </label>
        <label className="gm-check">
          <input type="checkbox" checked={q.hidden} onChange={(e) => setQ({ ...q, hidden: e.target.checked })} />
          {t('combat.hidden')}
        </label>
        <button
          type="button"
          className="btn small primary"
          disabled={mode === 'npc' ? !npcId : !q.name.trim()}
          onClick={submit}
        >
          {t('combat.add')}
        </button>
        <button type="button" className="btn small ghost" onClick={() => setOpen(false)}>
          {t('common.close')}
        </button>
      </div>
    </div>
  );
}
