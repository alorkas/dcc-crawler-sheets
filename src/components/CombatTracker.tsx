import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { resolveNum } from '../../shared/formula.js';
import { api, type Declaration, type Npc, type NpcAttack, type Opponent, type PartyMember } from '../lib/api';
import { useAuth } from '../lib/auth';
import { useI18n, type MsgKey } from '../lib/i18n';
import { useLive } from '../lib/live';
import { normalize, signed } from '../lib/sheet';
import { applyAttackDamage } from '../lib/combat';
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
        <OpponentRow key={o.id} o={o} floor={encounter.floor} round={encounter.round} gm={gm} />
      ))}
      {gm && <AddOpponent />}
    </div>
  );
}

function OpponentRow({ o, floor, round, gm }: { o: Opponent; floor: number; round: number; gm: boolean }) {
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
function AttackChips({ o, floor }: { o: Opponent; floor: number }) {
  const { t } = useI18n();
  const [pick, setPick] = useState<number | 'other' | null>(null);
  const attacks = o.attacks ?? [];
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
      <button
        type="button"
        className={`atk-chip ghost ${pick === 'other' ? 'active' : ''}`}
        onClick={() => setPick(pick === 'other' ? null : 'other')}
      >
        + {t(attacks.length ? 'decl.other' : 'decl.declare')}
      </button>
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
  const toggle = (id: number) => setTargets((l) => (l.includes(id) ? l.filter((x) => x !== id) : [...l, id]));
  const submit = async () => {
    setBusy(true);
    try {
      setEncounter(await api.declare({ opponentId: opponent.id, attack: attack ?? custom, targets }));
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

/** On a stat block: declare one of its attacks for one of its copies in the fight. */
export function NpcDeclare({ npcId, attack, onDone }: { npcId: number; attack: NpcAttack; onDone: () => void }) {
  const { t } = useI18n();
  const { encounter } = useLive();
  const copies = (encounter?.active ? encounter.opponents : []).filter((o) => o.npcId === npcId && !o.defeated);
  const [oid, setOid] = useState<number>(() => copies[0]?.id ?? 0);
  const o = copies.find((x) => x.id === oid) ?? copies[0];
  if (!o || !encounter) return <p className="dim tiny">{t('decl.notInCombat')}</p>;
  return (
    <div className="npc-declare">
      {copies.length > 1 && (
        <select
          className="in sel"
          value={o.id}
          aria-label={t('decl.who')}
          onChange={(e) => setOid(Number(e.target.value))}
        >
          {copies.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      )}
      <DeclareForm
        opponent={o}
        attack={(() => {
          // use the copy's own attack when it has one of that name, else this stat block's (edited since)
          const i = (o.attacks ?? []).findIndex((x) => x.name === attack.name);
          return i >= 0 ? i : attack;
        })()}
        floor={encounter.floor}
        onDone={onDone}
      />
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
      if (!d.damage) return;
      const r = await applyAttackDamage(cid, d.damage.total, `${d.opponentName} – ${d.attack.name}`);
      setEncounter(await api.markTarget(d.id, cid, { applied: r }));
    });
  return (
    <div className="decl">
      <div className="decl-head">
        <span className="grow">
          <strong>{d.opponentName}</strong> ▸ {d.attack.name}
        </span>
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
        {d.targets.map((tg) => (
          <li key={tg.id}>
            <span className="grow">{tg.name}</span>
            <EvadeResult evade={tg.evade} />
            {tg.applied ? (
              <span className="dim tiny">{t('decl.applied', { n: tg.applied.slots, d: tg.applied.damage })}</span>
            ) : (
              <button
                type="button"
                className={`btn small ${tg.evade?.success === false ? 'primary' : 'ghost'}`}
                disabled={!d.damage || busy === tg.id}
                title={t('decl.applyHint')}
                onClick={() => apply(tg.id)}
              >
                {t('decl.apply')}
              </button>
            )}
          </li>
        ))}
      </ul>
      {error && <p className="error tiny">{error}</p>}
    </div>
  );
}

function EvadeResult({ evade }: { evade: Declaration['targets'][number]['evade'] }) {
  const { t } = useI18n();
  if (!evade) return <span className="dim tiny">{t('decl.evadePending')}</span>;
  return (
    <span className={`evade-res ${evade.success ? 'ok' : evade.success === false ? 'bad' : ''}`}>
      {evade.success ? '✓' : evade.success === false ? '✗' : '•'} {evade.total}
    </span>
  );
}

/**
 * On a party member's card: which Mobs target this crawler and the Evade difficulty,
 * with an Evade roll for the owner (and the GM). Players see it from Crawler Reaction on.
 */
export function TargetedBy({
  memberId,
  canRoll,
  evadeTotal,
}: {
  memberId: number;
  canRoll: boolean;
  evadeTotal: number | null;
}) {
  const { t } = useI18n();
  const { encounter, setEncounter } = useLive();
  const [busy, setBusy] = useState<number | null>(null);
  if (!encounter?.active) return null;
  const list = (encounter.declarations ?? []).filter((d) => d.targets.some((x) => x.id === memberId));
  if (!list.length) return null;
  const roll = async (d: Declaration) => {
    setBusy(d.id);
    try {
      setEncounter(await api.rollEvade(d.id, memberId, `d20${signed(evadeTotal ?? 0)}`));
    } catch {
      /* ignore */
    } finally {
      setBusy(null);
    }
  };
  return (
    <ul className="targeted">
      {list.map((d) => {
        const tg = d.targets.find((x) => x.id === memberId)!;
        return (
          <li key={d.id} className={tg.evade?.success ? 'evaded' : tg.evade ? 'hit' : ''}>
            <span className="grow">
              ⚠ <strong>{d.opponentName}</strong> · {d.attack.name}
              {d.attack.range && <span className="dim"> ({d.attack.range})</span>}
            </span>
            <span className="pill">{t('decl.dc', { n: d.dc ?? '?' })}</span>
            {tg.evade ? (
              <EvadeResult evade={tg.evade} />
            ) : (
              canRoll && (
                <button
                  type="button"
                  className="btn small primary"
                  disabled={busy === d.id || evadeTotal === null}
                  title={evadeTotal === null ? t('decl.noEvade') : undefined}
                  onClick={() => roll(d)}
                >
                  🎲 {t('core.evade')} {evadeTotal !== null && signed(evadeTotal)}
                </button>
              )
            )}
            {tg.applied && tg.applied.slots > 0 && (
              <span className="dim tiny">{t('decl.lost', { n: tg.applied.slots })}</span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
