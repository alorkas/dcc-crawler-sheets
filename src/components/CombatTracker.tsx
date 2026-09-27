import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { damageFactor, hasSplash, isAreaAttack, resolveNum } from '../../shared/formula.js';
import {
  api,
  type Declaration,
  type Encounter,
  type Npc,
  type NpcAttack,
  type Opponent,
  type PartyMember,
} from '../lib/api';
import { useAuth } from '../lib/auth';
import { useI18n, type MsgKey } from '../lib/i18n';
import { useLive } from '../lib/live';
import { normalize, signed } from '../lib/sheet';
import { applyAttackDamage } from '../lib/combat';
import { HitResult } from './CombatAttack';
import { derive } from '../lib/rules';
import { NPC_KINDS } from '../lib/npc';

export const PHASES = [1, 2, 3, 4, 5] as const;

/** "13+F" → 13 + Floor (for the GM's quick reference). */
const withFloor = (v: string | undefined, floor: number) => {
  const n = resolveNum(v, floor);
  return n === null ? String(v ?? '') : String(n);
};

/** Round counter, the 5 phases of a combat round, and GM controls. Shown at the top of the party panel. */
export function CombatHeader() {
  const { t } = useI18n();
  const { user } = useAuth();
  const { encounter, setEncounter, party } = useLive();
  const [surprise, setSurprise] = useState(false);
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
            onClick={() => act('start', { surprise })}
          >
            ⚔ {t('combat.start')}
          </button>
          <label className="gm-check">
            <input type="checkbox" checked={surprise} onChange={(e) => setSurprise(e.target.checked)} />
            {t('combat.surprise')}
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
export function Opponents({ wide = false }: { wide?: boolean }) {
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
        <OpponentRow key={o.id} o={o} floor={encounter.floor} round={encounter.round} gm={gm} wide={wide} />
      ))}
      {gm && <AddOpponent />}
    </div>
  );
}

function OpponentRow({
  o,
  floor,
  round,
  gm,
  wide,
}: {
  o: Opponent;
  floor: number;
  round: number;
  gm: boolean;
  wide: boolean;
}) {
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
          {gm && o.npcId ? (
            <Link to={`/admin/npcs/${o.npcId}`} className="member-name link" title={t('decl.openSheet')}>
              {o.name}
            </Link>
          ) : (
            <span className="member-name">{o.name}</span>
          )}
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
      {gm && !o.defeated && round >= 1 && <AttackChips o={o} floor={floor} />}
      {gm && <OpponentHits o={o} />}
      {gm && wide && <OpponentDetails o={o} floor={floor} />}
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

/* ---------------- Mob Action Declaration ---------------- */

/** GM: one chip per attack of an opponent; pick one, then who it targets. */
export function AttackChips({ o, floor }: { o: Opponent; floor: number }) {
  const { t } = useI18n();
  const { encounter } = useLive();
  const [pick, setPick] = useState<number | 'other' | null>(null);
  const attacks = o.attacks ?? [];
  // what this one already declared this round (each copy declares on its own)
  const mine = (encounter?.declarations ?? []).filter((d) => d.opponentId === o.id);
  return (
    <div className="atk-chips">
      {attacks.map((a, i) => (
        <button
          key={i}
          type="button"
          className={`atk-chip ${pick === i ? 'active' : ''}`}
          title={[a.damage, a.range, a.effect].filter(Boolean).join(' · ')}
          onClick={() => setPick(pick === i ? null : i)}
        >
          ⚔ {a.name}
          {a.toHit && <span className="atk-dc">{withFloor(a.toHit, floor)}</span>}
        </button>
      ))}
      {/* quick entries (no stat block attacks) type their attack in */}
      {attacks.length === 0 && (
        <button
          type="button"
          className={`atk-chip ghost ${pick === 'other' ? 'active' : ''}`}
          onClick={() => setPick(pick === 'other' ? null : 'other')}
        >
          + {t('decl.declare')}
        </button>
      )}
      {mine.length > 0 && (
        <ul className="atk-declared">
          {mine.map((d) => (
            <li key={d.id}>
              ✓ {t('decl.declaredLine', { attack: d.attack.name, targets: d.targets.map((x) => x.name).join(', ') })}
            </li>
          ))}
        </ul>
      )}
      {pick !== null && (
        <DeclareForm opponent={o} attack={pick === 'other' ? null : pick} floor={floor} onDone={() => setPick(null)} />
      )}
    </div>
  );
}

/** Pick the targets (party crawlers) of a declared attack; for "other" also its name, to-hit and damage. */
export function DeclareForm({
  opponent,
  attack,
  floor,
  onDone,
}: {
  opponent: Opponent;
  /** An attack of the opponent (index), a given attack, or null to type one in. */
  attack: number | NpcAttack | null;
  floor: number;
  onDone: () => void;
}) {
  const { t } = useI18n();
  const { party, setEncounter } = useLive();
  const members = party ?? [];
  const [targets, setTargets] = useState<number[]>(() => (members.length === 1 ? [members[0].id] : []));
  const [custom, setCustom] = useState<NpcAttack>({ name: '', toHit: '', damage: '', range: '', effect: '' });
  const [busy, setBusy] = useState(false);
  const a = attack === null ? custom : typeof attack === 'number' ? opponent.attacks?.[attack] : attack;
  const dc = resolveNum(a?.toHit, floor);
  // Area Attack: guessed from the stat block text (Cone, Blast, Burst, Line, Splash…), the GM can change it
  const [areaSet, setArea] = useState<boolean | null>(null);
  const area = areaSet ?? isAreaAttack(a);
  const [splash, setSplash] = useState<number[]>([]);
  const toggle = (id: number) => setTargets((l) => (l.includes(id) ? l.filter((x) => x !== id) : [...l, id]));
  const toggleSplash = (id: number) => setSplash((l) => (l.includes(id) ? l.filter((x) => x !== id) : [...l, id]));
  const submit = async () => {
    setBusy(true);
    try {
      setEncounter(
        await api.declare({
          opponentId: opponent.id,
          attack: attack ?? custom,
          targets,
          area,
          splash: area ? splash.filter((id) => targets.includes(id)) : [],
        }),
      );
      onDone();
    } catch {
      /* ignore */
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="declare-form">
      {attack === null && (
        <div className="quick-opp">
          <input
            className="in"
            value={custom.name}
            placeholder={t('npc.atkName')}
            aria-label={t('npc.atkName')}
            onChange={(e) => setCustom({ ...custom, name: e.target.value })}
          />
          <label className="mini">
            <span>{t('npc.toHit')}</span>
            <input
              className="in center"
              value={custom.toHit}
              placeholder="13+F"
              onChange={(e) => setCustom({ ...custom, toHit: e.target.value })}
            />
          </label>
          <label className="mini grow">
            <span>{t('npc.damage')}</span>
            <input
              className="in"
              value={custom.damage}
              placeholder="1d6+F"
              onChange={(e) => setCustom({ ...custom, damage: e.target.value })}
            />
          </label>
        </div>
      )}
      <div className="lbl">{t('decl.targets')}</div>
      {members.length === 0 && <p className="dim tiny">{t('decl.noParty')}</p>}
      <div className="target-picks">
        {members.map((m) => (
          <label key={m.id} className={`target-pick ${targets.includes(m.id) ? 'on' : ''}`}>
            <input type="checkbox" checked={targets.includes(m.id)} onChange={() => toggle(m.id)} />
            {m.view.name || t('dash.unnamed')}
          </label>
        ))}
      </div>
      <label className="gm-check" title={t('decl.areaHint')}>
        <input type="checkbox" checked={area} onChange={(e) => setArea(e.target.checked)} />
        {t('decl.area')}
      </label>
      {area && (hasSplash(a) || splash.length > 0) && targets.length > 0 && (
        <>
          <div className="lbl">{t('decl.splashWho')}</div>
          <div className="target-picks">
            {members
              .filter((m) => targets.includes(m.id))
              .map((m) => (
                <label key={m.id} className={`target-pick ${splash.includes(m.id) ? 'on' : ''}`}>
                  <input type="checkbox" checked={splash.includes(m.id)} onChange={() => toggleSplash(m.id)} />
                  {m.view.name || t('dash.unnamed')}
                </label>
              ))}
          </div>
        </>
      )}
      <div className="add-opp-row">
        <span className="dim tiny grow">{t('decl.dc', { n: dc ?? '?' })}</span>
        <button
          type="button"
          className="btn small primary"
          disabled={busy || !targets.length || (attack === null && !custom.name.trim())}
          onClick={submit}
        >
          {t('decl.declare')}
        </button>
        <button type="button" className="btn small ghost" onClick={onDone}>
          {t('common.close')}
        </button>
      </div>
    </div>
  );
}

/** On a stat block: its copies in the fight, each declaring its own attacks. */
export function NpcInFight({ npcId }: { npcId: number }) {
  const { t } = useI18n();
  const { encounter } = useLive();
  if (!encounter?.active) return null;
  const copies = encounter.opponents.filter((o) => o.npcId === npcId);
  if (!copies.length) return null;
  return (
    <div className="card npc-fight">
      <div className="card-body">
        <div className="sub-lbl">
          {t('decl.inFight')} · {t('combat.round', { n: encounter.round })}
        </div>
        {encounter.round < 1 && <p className="dim small">{t('combat.surpriseHint')}</p>}
        {copies.map((o) => (
          <div key={o.id} className={`npc-copy ${o.defeated ? 'defeated' : ''}`}>
            <div className="npc-copy-head">
              <strong>{o.name}</strong>
              <span className="dim small">{o.defeated ? '✝' : `${o.pct}%`}</span>
            </div>
            {!o.defeated && encounter.round >= 1 && <AttackChips o={o} floor={encounter.floor} />}
          </div>
        ))}
      </div>
    </div>
  );
}

/** GM: this round's declared attacks, with damage rolls and "apply to the crawler's Health Bar". */
export function Declarations() {
  const { t } = useI18n();
  const { user } = useAuth();
  const { encounter } = useLive();
  if (!user?.isAdmin || !encounter?.active || encounter.round < 1) return null;
  const list = encounter.declarations ?? [];
  return (
    <div className="declarations">
      <div className="side-sub">
        {t('decl.title')} <span className="count-badge">{list.length}</span>
      </div>
      {encounter.phase === 1 && <p className="dim tiny">{t(list.length ? 'decl.secret' : 'decl.none')}</p>}
      {list.map((d) => (
        <DeclarationRow key={d.id} d={d} />
      ))}
    </div>
  );
}

function DeclarationRow({ d }: { d: Declaration }) {
  const { t } = useI18n();
  const { setEncounter } = useLive();
  const [busy, setBusy] = useState<number | 'dmg' | null>(null);
  const [error, setError] = useState('');
  const run = async (key: number | 'dmg', fn: () => Promise<void>) => {
    setBusy(key);
    setError('');
    try {
      await fn();
    } catch {
      setError(t('decl.failed'));
    } finally {
      setBusy(null);
    }
  };
  const rollDamage = () => run('dmg', async () => setEncounter(await api.rollDeclDamage(d.id)));
  const apply = (cid: number) =>
    run(cid, async () => {
      const tg = d.targets.find((x) => x.id === cid);
      if (!d.damage || !tg) return;
      const f = factorOf(d, tg);
      const note = f < 1 ? ` (${fraction(f)})` : '';
      const r = await applyAttackDamage(
        cid,
        Math.floor(d.damage.total * f),
        `${d.opponentName} – ${d.attack.name}${note}`,
      );
      setEncounter(await api.markTarget(d.id, cid, { applied: r }));
    });
  return (
    <div className="decl">
      <div className="decl-head">
        <span className="grow">
          <strong>{d.opponentName}</strong> ▸ {d.attack.name}
        </span>
        {d.area && <span className="pill area-pill">{t('decl.areaShort')}</span>}
        <span className="pill">{t('decl.dc', { n: d.dc ?? '?' })}</span>
        <button
          type="button"
          className="icon-btn small"
          title={t('decl.remove')}
          aria-label={t('decl.remove')}
          onClick={async () => setEncounter(await api.removeDeclaration(d.id))}
        >
          ×
        </button>
      </div>
      <div className="decl-dmg">
        {d.damage ? (
          <span>
            🎲 <strong>{d.damage.total}</strong> <span className="dim tiny">({d.damage.expr})</span>
          </span>
        ) : (
          <button
            type="button"
            className="btn small"
            disabled={busy === 'dmg' || !d.attack.damage}
            onClick={rollDamage}
            title={d.attack.damage}
          >
            🎲 {t('decl.rollDamage')}
          </button>
        )}
        {d.attack.damage && <span className="dim tiny">{d.attack.damage}</span>}
      </div>
      <ul className="decl-targets">
        {d.targets.map((tg) => {
          const f = factorOf(d, tg);
          return (
            <li key={tg.id}>
              <span className="grow">
                {tg.name}
                {tg.splash && <span className="dim tiny"> · {t('decl.splash')}</span>}
              </span>
              <EvadeResult evade={tg.evade} area={d.area} />
              {tg.applied ? (
                <span className="dim tiny">{t('decl.applied', { n: tg.applied.slots, d: tg.applied.damage })}</span>
              ) : f === 0 ? (
                <span className="dim tiny">{t('decl.noDamage')}</span>
              ) : (
                <button
                  type="button"
                  className={`btn small ${tg.evade?.success === false ? 'primary' : 'ghost'}`}
                  disabled={!d.damage || busy === tg.id}
                  title={t('decl.applyHint')}
                  onClick={() => apply(tg.id)}
                >
                  {t('decl.apply')}
                  {f < 1 && ` ${fraction(f)}`}
                  {d.damage && f < 1 && ` (${Math.floor(d.damage.total * f)})`}
                </button>
              )}
            </li>
          );
        })}
      </ul>
      {error && <p className="error tiny">{error}</p>}
    </div>
  );
}

/** Share of the damage a target takes: see damageFactor (shared/formula.js). */
const factorOf = (d: Declaration, tg: Declaration['targets'][number]) =>
  damageFactor({ area: !!d.area, splash: !!tg.splash, evaded: tg.evade?.success === true });
const fraction = (f: number) => (f === 0.5 ? '½' : f === 0.25 ? '¼' : `×${f}`);

function EvadeResult({ evade, area }: { evade: Declaration['targets'][number]['evade']; area?: boolean }) {
  const { t } = useI18n();
  if (!evade) return <span className="dim tiny">{t('decl.evadePending')}</span>;
  return (
    <span className={`evade-res ${evade.success ? 'ok' : evade.success === false ? 'bad' : ''}`}>
      {evade.success ? '✓' : evade.success === false ? '✗' : '•'} {evade.total}
      {evade.success && area && <span className="tiny"> · {t('decl.half')}</span>}
      {evade.rerolled && (
        <span className="dim tiny" title={t('decl.rerolled')}>
          {' '}
          (↻ {evade.first})
        </span>
      )}
    </span>
  );
}

/**
 * On a party member's card: which Mobs target this crawler and the Evade difficulty, with an Evade roll for the
 * owner (and the GM), and a reroll of a failed Evade with AI Favor. Players see it from Crawler Reaction on.
 */
export function TargetedBy({
  memberId,
  canRoll,
  evadeTotal,
  aiFavor,
}: {
  memberId: number;
  canRoll: boolean;
  evadeTotal: number | null;
  /** AI Favor left on the sheet (null when unknown). */
  aiFavor: number | null;
}) {
  const { t, err } = useI18n();
  const { encounter, setEncounter } = useLive();
  const [busy, setBusy] = useState<number | null>(null);
  const [error, setError] = useState('');
  if (!encounter?.active) return null;
  const list = (encounter.declarations ?? []).filter((d) => d.targets.some((x) => x.id === memberId));
  if (!list.length) return null;
  const acts = encounter.actions?.[memberId] ?? { used: [], extra: false, max: 2 };
  // one Evade Action covers every attack this round; without it, the crawler needs a free Action
  const evading = acts.used.includes('evade');
  const noActions = !evading && acts.used.length >= acts.max;
  const roll = async (d: Declaration, reroll = false) => {
    setBusy(d.id);
    setError('');
    try {
      setEncounter(await api.rollEvade(d.id, memberId, `d20${signed(evadeTotal ?? 0)}`, reroll));
    } catch (e) {
      setError(err(e));
    } finally {
      setBusy(null);
    }
  };
  return (
    <ul className="targeted">
      {list.map((d) => {
        const tg = d.targets.find((x) => x.id === memberId)!;
        const e = tg.evade;
        const canReroll = canRoll && !!e && e.success === false && e.natural !== 1 && !e.rerolled;
        return (
          <li key={d.id} className={e?.success ? 'evaded' : e ? 'hit' : ''}>
            <span className="grow">
              ⚠ <strong>{d.opponentName}</strong> · {d.attack.name}
              {d.attack.range && <span className="dim"> ({d.attack.range})</span>}
              {tg.splash && <span className="dim"> · {t('decl.splash')}</span>}
            </span>
            {d.area && (
              <span className="pill area-pill" title={t('decl.areaHint')}>
                {t('decl.areaShort')}
              </span>
            )}
            <span className="pill">{t('decl.dc', { n: d.dc ?? '?' })}</span>
            {e ? (
              <EvadeResult evade={e} area={d.area} />
            ) : (
              canRoll && (
                <button
                  type="button"
                  className="btn small primary"
                  disabled={busy === d.id || evadeTotal === null || noActions}
                  title={
                    evadeTotal === null
                      ? t('decl.noEvade')
                      : noActions
                        ? t('actions.none')
                        : evading
                          ? t('decl.evadeCovered')
                          : t('decl.evadeCosts')
                  }
                  onClick={() => roll(d)}
                >
                  🎲 {t('core.evade')} {evadeTotal !== null && signed(evadeTotal)}
                </button>
              )
            )}
            {canReroll && (
              <button
                type="button"
                className="btn small"
                disabled={busy === d.id || !aiFavor}
                title={aiFavor ? t('decl.rerollHint', { n: aiFavor }) : t('decl.noFavor')}
                onClick={() => roll(d, true)}
              >
                ↻ {t('decl.reroll')}
              </button>
            )}
            {tg.applied && tg.applied.slots > 0 && (
              <span className="dim tiny">{t('decl.lost', { n: tg.applied.slots })}</span>
            )}
          </li>
        );
      })}
      {error && <li className="error tiny">{error}</li>}
    </ul>
  );
}

/**
 * A crawler's Actions this round: 2 (+1 bought with AI Favor, once per round). Interrupts in Crawler Reaction
 * (Evade and the others) use them up, so what's left is what they get in step 4. Owner and GM can mark them.
 */
export function ActionPips({
  memberId,
  canEdit,
  aiFavor,
}: {
  memberId: number;
  canEdit: boolean;
  aiFavor: number | null;
}) {
  const { t, err } = useI18n();
  const { encounter, setEncounter } = useLive();
  const [error, setError] = useState('');
  if (!encounter?.active) return null;
  const acts = encounter.actions?.[memberId] ?? { used: [], extra: false, max: 2 };
  const left = Math.max(0, acts.max - acts.used.length);
  const call = async (op: 'use' | 'free' | 'extra', extra: { kind?: 'interrupt' | 'action'; index?: number } = {}) => {
    setError('');
    try {
      setEncounter(await api.crawlerAction(memberId, op, extra));
    } catch (e) {
      setError(err(e));
    }
  };
  // phase 2 is Crawler Reaction (Interrupts), anything else counts as a normal Action
  const kind = encounter.phase === 2 && encounter.round >= 1 ? 'interrupt' : 'action';
  return (
    <div className="action-row">
      <span className="lbl">{t('actions.label')}</span>
      <span className="pips">
        {Array.from({ length: acts.max }, (_, i) => {
          const used = acts.used[i];
          const label = used ? t(`actions.kind.${used}` as MsgKey) : t('actions.free');
          return (
            <button
              key={i}
              type="button"
              className={`pip ${used ? `used k-${used}` : ''}`}
              disabled={!canEdit || (!used && i !== acts.used.length)}
              title={canEdit ? (used ? t('actions.freeHint', { what: label }) : t(`actions.use.${kind}`)) : label}
              aria-label={label}
              onClick={() => (used ? call('free', { index: i }) : call('use', { kind }))}
            />
          );
        })}
      </span>
      <span className={`dim tiny ${left === 0 ? 'bad-pill' : ''}`}>{t('actions.left', { n: left })}</span>
      {canEdit && !acts.extra && (
        <button
          type="button"
          className="btn small ghost"
          disabled={!aiFavor}
          title={aiFavor ? t('actions.extraHint', { n: aiFavor }) : t('decl.noFavor')}
          onClick={() => call('extra')}
        >
          +1 · {t('core.aiFavor')}
        </button>
      )}
      {error && <span className="error tiny">{error}</span>}
    </div>
  );
}

/** GM: this round's crawler attacks on an opponent: hit/miss vs its Evade, damage, and apply to its Health Bar. */
function OpponentHits({ o }: { o: Opponent }) {
  const { t, err } = useI18n();
  const { encounter, setEncounter } = useLive();
  const [error, setError] = useState('');
  const list = (encounter?.attacks ?? []).filter((a) => a.opponentId === o.id);
  if (!list.length) return null;
  const run = async (fn: () => Promise<Encounter>) => {
    setError('');
    try {
      setEncounter(await fn());
    } catch (e) {
      setError(err(e));
    }
  };
  return (
    <ul className="opp-hits">
      {list.map((a) => (
        <li key={a.id}>
          <span className="grow">
            <strong>{a.charName}</strong> · {a.label}
          </span>
          <HitResult a={a} showDc />
          {a.hit === null && (
            <>
              <button
                type="button"
                className="btn small"
                onClick={() => run(() => api.applyAttack(a.id, { hit: true }))}
              >
                {t('atkt.hit')}
              </button>
              <button
                type="button"
                className="btn small ghost"
                onClick={() => run(() => api.applyAttack(a.id, { hit: false }))}
              >
                {t('atkt.miss')}
              </button>
            </>
          )}
          {a.hit &&
            (a.applied ? (
              <span className="dim tiny">{t('atkt.applied', { n: a.applied.slots })}</span>
            ) : a.damage ? (
              <button type="button" className="btn small primary" onClick={() => run(() => api.applyAttack(a.id))}>
                {t('decl.apply')} {a.damage.total}
              </button>
            ) : (
              <button
                type="button"
                className="btn small ghost"
                disabled={!a.damageExpr}
                title={a.damageExpr ? undefined : t('npc.noDice')}
                onClick={() => run(() => api.attackDamage(a.id))}
              >
                🎲 {a.damageExpr ?? t('roll.damage')}
              </button>
            ))}
        </li>
      ))}
      {error && <li className="error tiny">{error}</li>}
    </ul>
  );
}

/** Full-size combat view (GM): the opponent's attacks, rules notes and System AI text. */
function OpponentDetails({ o, floor }: { o: Opponent; floor: number }) {
  const { t, lang } = useI18n();
  const ai = (lang === 'es' && o.npcDescriptionEs) || o.npcDescription || o.npcDescriptionEs;
  const attacks = o.attacks ?? [];
  if (!attacks.length && !o.npcNotes && !ai) return null;
  return (
    <details className="opp-details">
      <summary>{t('combatPage.details')}</summary>
      {attacks.length > 0 && (
        <ul className="opp-attacks">
          {attacks.map((a, i) => (
            <li key={i}>
              <strong>{a.name}</strong>
              {a.toHit && <span className="pill">{t('decl.dc', { n: withFloor(a.toHit, floor) })}</span>}
              <span>{a.damage}</span>
              {a.range && <span className="dim">{a.range}</span>}
              {a.effect && <span className="dim tiny">{a.effect}</span>}
            </li>
          ))}
        </ul>
      )}
      {o.npcNotes && <div className="npc-notes-view small">{o.npcNotes}</div>}
      {ai && (
        <blockquote className="ai-says small">
          <span className="ai-says-lbl">{t('npc.aiSays')}</span>
          {ai}
        </blockquote>
      )}
    </details>
  );
}
