import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, type LogEvent, type Message, type PartyMember } from '../lib/api';
import { useAuth } from '../lib/auth';
import { useI18n, type MsgKey } from '../lib/i18n';
import { useLive } from '../lib/live';
import { derive, num } from '../lib/rules';
import { normalize, signed } from '../lib/sheet';
import { ChatIcon, ChevronIcon, DiceIcon, PartyIcon } from './icons';
import { ActionPips, AllyInterrupts, CombatHeader, Declarations, Opponents, TargetedBy } from './CombatTracker';
import { QuickItems } from './QuickItems';
import { MiniMap } from './MapView';
import { BoxChip } from './Achievements';
import { boxSource } from './Boxes';
import { rarityClass } from './Inventory';
import { DegreeBadge, StatusChips } from './Status';

/* ---------------- collapsible side panel ---------------- */

/** Open/closed state of a side panel, remembered per browser. Wide screens start with it open. */
export function usePanelState(key: string): [boolean, (v: boolean) => void] {
  const [open, setOpen] = useState<boolean>(() => {
    try {
      const v = localStorage.getItem(key);
      if (v !== null) return v === '1';
    } catch {
      /* storage unavailable */
    }
    return typeof window !== 'undefined' && window.innerWidth >= 1600;
  });
  const set = (v: boolean) => {
    setOpen(v);
    try {
      localStorage.setItem(key, v ? '1' : '0');
    } catch {
      /* storage unavailable */
    }
  };
  return [open, set];
}

function SidePanel({
  side,
  open,
  onToggle,
  title,
  icon,
  badge,
  rail,
  actions,
  children,
}: {
  side: 'left' | 'right';
  open: boolean;
  onToggle: (v: boolean) => void;
  title: string;
  icon: ReactNode;
  badge?: number;
  rail?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const { t } = useI18n();
  const toggleLabel = t(open ? 'panel.collapse' : 'panel.expand', { name: title });
  return (
    <>
      <aside className={`side side-${side} ${open ? 'open' : 'closed'}`} aria-label={title}>
        {open ? (
          <div className="side-inner">
            <div className="side-head">
              <span className="side-title">
                {icon} {title}
              </span>
              <span className="side-actions">
                {actions}
                <button
                  type="button"
                  className="icon-btn"
                  onClick={() => onToggle(false)}
                  title={toggleLabel}
                  aria-label={toggleLabel}
                >
                  <ChevronIcon dir={side === 'left' ? 'left' : 'right'} />
                </button>
              </span>
            </div>
            {children}
          </div>
        ) : (
          <div className="side-rail">
            <button
              type="button"
              className="rail-btn"
              onClick={() => onToggle(true)}
              title={toggleLabel}
              aria-label={toggleLabel}
            >
              {icon}
              {!!badge && <span className="rail-badge">{badge > 99 ? '99+' : badge}</span>}
            </button>
            {rail}
          </div>
        )}
      </aside>
      {/* phones: a floating button opens the panel as a drawer */}
      {!open && (
        <button
          type="button"
          className={`side-fab fab-${side}`}
          onClick={() => onToggle(true)}
          aria-label={toggleLabel}
        >
          {icon}
          {!!badge && <span className="rail-badge">{badge > 99 ? '99+' : badge}</span>}
        </button>
      )}
      {open && <div className={`side-backdrop back-${side}`} onClick={() => onToggle(false)} />}
    </>
  );
}

/* ---------------- party ---------------- */

const initials = (name: string) =>
  (name || '?')
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

function useMemberStats(m: PartyMember) {
  return useMemo(() => {
    // normalize only (no migrations): the view is a slice of an already-saved sheet
    const sheet = normalize(m.view);
    const der = derive(sheet);
    const showMana = 'manaCurrent' in m.view;
    return { sheet, der, showMana };
  }, [m.view]);
}

/** A crawler's portrait (served separately so the party view stays small), or their initials. */
export function Avatar({
  id,
  tag,
  name,
  className = '',
}: {
  id: number;
  tag?: string;
  name: string;
  className?: string;
}) {
  const [broken, setBroken] = useState(false);
  if (tag && !broken)
    return (
      <span className={`avatar has-img ${className}`}>
        <img src={`/api/characters/${id}/portrait?v=${tag}`} alt="" loading="lazy" onError={() => setBroken(true)} />
      </span>
    );
  return <span className={`avatar ${className}`}>{initials(name)}</span>;
}

const hpTone = (pct: number, dying: boolean) => (dying ? 'dying' : pct >= 60 ? 'ok' : pct >= 30 ? 'warn' : 'bad');

export function PartyPanel() {
  const { t } = useI18n();
  const { party, encounter } = useLive();
  const [open, setOpen] = usePanelState('dcc.panel.party');
  const members = party ?? [];
  const fighting = !!encounter?.active;
  return (
    <SidePanel
      side="left"
      open={open}
      onToggle={setOpen}
      title={fighting ? t('combat.title') : t('party.title')}
      icon={<PartyIcon />}
      rail={
        <>
          {fighting && (
            <span className="rail-round" title={t('combat.round', { n: encounter!.round })}>
              R{encounter!.round}
              <small>{encounter!.round === 0 ? 'S' : `P${encounter!.phase}`}</small>
            </span>
          )}
          {members.map((m) => (
            <RailMember key={m.id} m={m} onOpen={() => setOpen(true)} />
          ))}
        </>
      }
    >
      <div className="side-body">
        <CombatHeader />
        <Declarations />
        {fighting && <div className="side-sub">{t('combat.crawlers')}</div>}
        {party === null && <p className="dim small">{t('common.loading')}</p>}
        {party !== null && members.length === 0 && <PartyEmpty />}
        {members.map((m) => (
          <MemberCard key={m.id} m={m} />
        ))}
        <Opponents />
        <MiniMap />
      </div>
    </SidePanel>
  );
}

function PartyEmpty() {
  const { t } = useI18n();
  const { user } = useAuth();
  return <p className="dim small party-empty">{t(user?.isAdmin ? 'party.emptyAdmin' : 'party.empty')}</p>;
}

function RailMember({ m, onOpen }: { m: PartyMember; onOpen: () => void }) {
  const { der } = useMemberStats(m);
  const name = m.view.name || '?';
  const tone = hpTone(der.hbPercent, der.dying);
  return (
    <button
      type="button"
      className={`rail-member tone-${tone}`}
      style={{ ['--pct' as string]: `${der.hbPercent}%` }}
      title={`${name} · ${der.hbPercent}%`}
      onClick={onOpen}
    >
      <Avatar id={m.id} tag={m.view.portraitTag} name={name} />
    </button>
  );
}

/** A party member: Health, mana (owner/GM), Actions and declared attacks in combat, debuffs.
 * `wide` (the Combat page) adds Evade, AI Favor and Move when known. */
export function MemberCard({ m, wide = false }: { m: PartyMember; wide?: boolean }) {
  const { t } = useI18n();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { sheet, der, showMana } = useMemberStats(m);
  const canOpen = m.mine || !!user?.isAdmin;
  const aiFavor = showMana ? num(sheet.dr.aiFavor) : null;
  const interrupts = (m.view as { interrupts?: { catcher: boolean; tauntRank: number } }).interrupts;
  const tone = hpTone(der.hbPercent, der.dying);
  const slots = 10 - der.hbLost;
  const manaPct =
    der.manaMax && der.manaCurrent !== null ? Math.max(0, Math.min(100, (der.manaCurrent / der.manaMax) * 100)) : 0;
  const remove = () => {
    api.setInParty(m.id, false).catch(() => {});
  };
  return (
    <div className={`member tone-${tone} ${m.mine ? 'mine' : ''}`}>
      <div className="member-head">
        <Avatar id={m.id} tag={m.view.portraitTag} name={sheet.name} className="member-avatar" />
        <div className="member-id">
          {canOpen ? (
            <button type="button" className="member-name link" onClick={() => navigate(`/sheet/${m.id}`)}>
              {sheet.name || t('dash.unnamed')}
            </button>
          ) : (
            <span className="member-name">{sheet.name || t('dash.unnamed')}</span>
          )}
          <span className="dim tiny">
            {[sheet.level && t('dash.lvl', { n: sheet.level }), sheet.race, sheet.class, m.ownerName]
              .filter(Boolean)
              .join(' · ')}
          </span>
        </div>
        {user?.isAdmin && (
          <button
            type="button"
            className="icon-btn small"
            onClick={remove}
            title={t('party.remove')}
            aria-label={t('party.remove')}
          >
            ×
          </button>
        )}
      </div>
      <div className="hp-row" title={t('party.hpHint', { n: slots, v: der.slotValue ?? '?' })}>
        <div className="hp-bar" role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={der.hbPercent}>
          {Array.from({ length: 10 }, (_, i) => (
            <span key={i} className={i < slots ? 'on' : ''} />
          ))}
        </div>
        <span className="hp-pct">{der.hbPercent}%</span>
      </div>
      {showMana && der.manaMax !== null && (
        <div className="mana-row">
          <div className="mana-bar">
            <span style={{ width: `${manaPct}%` }} />
          </div>
          <span className="dim tiny">{t('party.mana', { n: der.manaCurrent ?? '—', max: der.manaMax })}</span>
        </div>
      )}
      {wide && (
        <div className="member-extra dim small">
          {[
            showMana && der.evadeTotal !== null && `${t('core.evade')} ${signed(der.evadeTotal)}`,
            aiFavor !== null && `${t('core.aiFavor')} ${aiFavor}`,
            der.penalty ? t('combatPage.penalty', { n: der.penalty }) : '',
          ]
            .filter(Boolean)
            .join(' · ')}
        </div>
      )}
      <ActionPips memberId={m.id} canEdit={canOpen} aiFavor={aiFavor} />
      <TargetedBy memberId={m.id} canRoll={canOpen} evadeTotal={der.evadeTotal} aiFavor={aiFavor} />
      {canOpen && interrupts && (
        <AllyInterrupts
          memberId={m.id}
          catcher={interrupts.catcher}
          tauntBonus={der.mods.int === null ? null : interrupts.tauntRank + (der.mods.int ?? 0) + (der.penalty ?? 0)}
        />
      )}
      {canOpen && wide && <QuickItems memberId={m.id} items={m.view.inventory ?? []} manaMax={der.manaMax} />}
      <StatusChips
        debuffs={sheet.debuffList}
        effects={sheet.effects}
        memberId={m.id}
        extra={
          der.dying && (
            <span className="chip dying-chip">
              {t('party.dying')}
              {sheet.dyingRounds && ` · ${t('party.rounds', { n: sheet.dyingRounds })}`}
            </span>
          )
        }
      />
    </div>
  );
}

/** Admin toggle to add/remove a character from the party (sheet header and dashboard cards). */
export function PartyToggle({
  id,
  inParty,
  onChange,
  compact,
}: {
  id: number;
  inParty: boolean;
  onChange: (v: boolean) => void;
  compact?: boolean;
}) {
  const { t } = useI18n();
  const toggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const r = await api.setInParty(id, !inParty);
      onChange(r.inParty);
    } catch {
      /* ignore */
    }
  };
  const label = t(inParty ? 'party.inParty' : 'party.add');
  return (
    <button
      type="button"
      className={`btn ${compact ? 'small' : ''} party-toggle ${inParty ? 'on' : ''}`}
      aria-pressed={inParty}
      title={t(inParty ? 'party.removeHint' : 'party.addHint')}
      onClick={toggle}
    >
      <PartyIcon /> {!compact && label}
    </button>
  );
}

/* ---------------- roll log & chat ---------------- */

type Filter = 'all' | 'roll' | 'chat' | 'event';
const DICE = [4, 6, 8, 10, 12, 20, 100];

export function LogPanel() {
  const { t } = useI18n();
  const { user } = useAuth();
  const live = useLive();
  const [open, setOpen] = usePanelState('dcc.panel.log');
  const [filter, setFilter] = useState<Filter>('all');
  const { setLogVisible } = live;

  useEffect(() => {
    setLogVisible(open);
    return () => setLogVisible(false);
  }, [open, setLogVisible]);

  const clear = async () => {
    if (!confirm(t('log.clearConfirm'))) return;
    await api.clearMessages().catch(() => {});
  };

  return (
    <SidePanel
      side="right"
      open={open}
      onToggle={setOpen}
      title={t('log.title')}
      icon={<ChatIcon />}
      badge={live.unread}
      actions={
        user?.isAdmin && live.messages.length > 0 ? (
          <button type="button" className="btn small ghost" onClick={clear}>
            {t('log.clear')}
          </button>
        ) : undefined
      }
    >
      <div className="log-filters seg small">
        {(['all', 'roll', 'chat', 'event'] as Filter[]).map((f) => (
          <button key={f} type="button" className={filter === f ? 'active' : ''} onClick={() => setFilter(f)}>
            {t(`log.filter.${f}` as MsgKey)}
          </button>
        ))}
        {!live.connected && <span className="offline-dot" title={t('log.offline')} />}
      </div>
      <MessageList filter={filter} />
      <Composer />
    </SidePanel>
  );
}

function MessageList({ filter }: { filter: Filter }) {
  const { t } = useI18n();
  const { messages } = useLive();
  const ref = useRef<HTMLDivElement>(null);
  const stick = useRef(true);
  // automatic entries (HP, mana, levels, combat) live in their own Log tab so they don't drown the chat
  // "All" is rolls and chat, plus the Mobs' declared attacks (players need those during combat), Hotlist
  // changes made in combat and items used (both can be undone from here)
  const shown = messages.filter((m) =>
    filter === 'all'
      ? m.kind !== 'event' ||
        [
          'declare',
          'world',
          'achievement',
          'reward',
          'interrupt',
          'hotlist',
          'item',
          'gift',
          'cursed',
          'boxes',
          'box',
          'learned',
          'quest',
        ].includes(m.event?.type ?? '')
      : m.kind === filter,
  );

  useEffect(() => {
    const el = ref.current;
    if (el && stick.current) el.scrollTop = el.scrollHeight;
  }, [shown.length]);

  return (
    <div
      className="log-list"
      ref={ref}
      onScroll={(e) => {
        const el = e.currentTarget;
        stick.current = el.scrollHeight - el.scrollTop - el.clientHeight < 60;
      }}
      aria-live="polite"
    >
      {shown.length === 0 && <p className="dim small log-empty">{t('log.empty')}</p>}
      {shown.map((m) => (
        <LogEntry key={m.id} m={m} />
      ))}
    </div>
  );
}

/**
 * AI Favor reroll of a d20 Check (Core Rulebook "AI Favor"): own crawler's roll, not a Natural 1, not already
 * rerolled, within a few minutes. Evade rolls are rerolled from the party card instead.
 */
function RerollButton({ m }: { m: Message }) {
  const { t, err } = useI18n();
  const { user } = useAuth();
  const { party } = useLive();
  const [error, setError] = useState('');
  const r = m.roll;
  const recent = Date.now() - new Date(m.createdAt).getTime() < 15 * 60 * 1000;
  if (
    !r ||
    !m.characterId ||
    r.natural === null ||
    r.natural === 1 ||
    r.rerolled ||
    r.rerollOf ||
    (r.vs && r.vs.kind !== 'attack') ||
    !recent ||
    !(m.userId === user?.id || user?.isAdmin)
  )
    return null;
  const view = party?.find((p) => p.id === m.characterId)?.view as { dr?: { aiFavor?: string } } | undefined;
  const favor = view?.dr?.aiFavor !== undefined ? Number(view.dr.aiFavor) || 0 : null;
  const go = async () => {
    const msg = favor === null ? t('reroll.confirm') : t('reroll.confirmN', { n: favor });
    if (!confirm(msg)) return;
    setError('');
    try {
      await api.rerollMessage(m.id);
    } catch (e) {
      setError(err(e));
    }
  };
  return (
    <div className="reroll-row">
      <button type="button" className="link-btn" disabled={favor === 0} onClick={go}>
        ↻ {t('reroll.button')}
        {favor !== null && ` (${t('reroll.left', { n: favor })})`}
      </button>
      {error && <span className="error tiny"> {error}</span>}
    </div>
  );
}

/**
 * Intervene (Interrupt, combat only): another crawler spends an Action to add 1d6 to this d20 Check after the result
 * is known (not Stat Checks). Most useful on a Near Miss, where the button stands out.
 */
function InterveneButton({ m }: { m: Message }) {
  const { t, err } = useI18n();
  const { user } = useAuth();
  const { party, encounter, setEncounter } = useLive();
  const [pick, setPick] = useState<number | ''>('');
  const [error, setError] = useState('');
  const r = m.roll;
  const recent = Date.now() - new Date(m.createdAt).getTime() < 15 * 60 * 1000;
  if (!r || !encounter?.active || !m.characterId || r.natural === null || r.stat || r.rerolled || !recent) return null;
  const helpers = (party ?? []).filter(
    (p) => (p.mine || user?.isAdmin) && p.id !== m.characterId && !r.intervene?.some((x) => x.id === p.id),
  );
  if (!helpers.length) return null;
  const chosen = helpers.length === 1 ? helpers[0].id : pick;
  const near = r.vs?.degree === 'nearMiss';
  const go = async () => {
    if (!chosen) return;
    setError('');
    try {
      setEncounter(await api.intervene(m.id, Number(chosen)));
    } catch (e) {
      setError(err(e));
    }
  };
  return (
    <div className={`intervene-row ${near ? 'near' : ''}`}>
      {helpers.length > 1 && (
        <select
          className="in sel tiny-sel"
          value={pick}
          aria-label={t('intervene.who')}
          onChange={(e) => setPick(e.target.value ? Number(e.target.value) : '')}
        >
          <option value="">{t('intervene.who')}</option>
          {helpers.map((h) => (
            <option key={h.id} value={h.id}>
              {h.view.name || '?'}
            </option>
          ))}
        </select>
      )}
      <button
        type="button"
        className={near ? 'btn small primary' : 'link-btn'}
        disabled={!chosen}
        title={t('intervene.hint')}
        onClick={go}
      >
        🤝 {t('intervene.button')}
        {helpers.length === 1 && ` (${helpers[0].view.name || '?'})`}
      </button>
      {error && <span className="error tiny"> {error}</span>}
    </div>
  );
}

function LogEntry({ m }: { m: Message }) {
  const { t, locale } = useI18n();
  const { user } = useAuth();
  const time = new Date(m.createdAt).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
  if (m.kind === 'event' && m.event) return <EventEntry m={m} ev={m.event} time={time} />;
  const who = m.characterName || m.userName;
  const r = m.roll;
  const crit = r?.natural === 20;
  const fumble = r?.natural === 1;
  return (
    <div className={`log-entry kind-${m.kind} ${m.userId === user?.id ? 'own' : ''} ${m.gmOnly ? 'gm-only' : ''}`}>
      <div className="log-meta">
        <strong className="log-who">{who}</strong>
        {m.characterName && <span className="dim tiny">({m.userName})</span>}
        {m.isAdmin && !m.characterName && <span className="pill gold tiny-pill">{t('log.gm')}</span>}
        {m.gmOnly && <span className="pill tiny-pill">{t('log.gmOnlyTag')}</span>}
        <span className="dim tiny log-time">{time}</span>
      </div>
      {m.kind === 'chat' && <div className="log-text">{m.text}</div>}
      {r && (
        <div className={`log-roll ${r.rerolled ? 'rerolled' : ''} ${crit ? 'crit' : ''} ${fumble ? 'fumble' : ''}`}>
          <div className="roll-line">
            <span className="roll-label">{r.label || t('log.roll')}</span>
            <span className="roll-result">{r.total}</span>
          </div>
          {r.vs && r.vs.success !== null && (
            <div className={`roll-vs ${r.vs.success ? 'ok-pill' : 'bad-pill'}`}>
              {r.vs.success ? '✓ ' : '✗ '}
              {r.vs.kind === 'attack'
                ? t(r.vs.success ? 'atkt.hit' : 'atkt.miss')
                : r.vs.kind === 'taunt'
                  ? t(r.vs.success ? 'taunt.won' : 'taunt.lost', { n: r.vs.dc ?? '?' })
                  : `${t(r.vs.success ? 'log.evaded' : 'log.notEvaded')} · ${t('decl.dc', { n: r.vs.dc ?? '?' })}`}
              {r.vs.success && r.vs.area && ` · ${t('decl.half')}`}
              <DegreeBadge degree={r.vs.degree} />
            </div>
          )}
          {r.intervene?.map((x) => (
            <div key={x.id} className="intervened tiny">
              🤝 {t('intervene.added', { n: x.value, name: x.name })}
            </div>
          ))}
          <div className="roll-break dim tiny">
            {r.expr} →{' '}
            {r.parts.map((p, i) => (
              <span key={i}>
                {i > 0 || p.sign < 0 ? (p.sign < 0 ? ' − ' : ' + ') : ''}
                {p.rolls ? (
                  <>
                    [
                    {p.rolls.map((v, j) => (
                      <span key={j} className={p.kept && !p.kept[j] ? 'dropped' : ''}>
                        {j > 0 ? ', ' : ''}
                        {v}
                      </span>
                    ))}
                    ]
                  </>
                ) : (
                  p.value
                )}
              </span>
            ))}
          </div>
          {crit && <div className="roll-flag">{t('log.crit')}</div>}
          {r.rerolled && <div className="dim tiny">{t('reroll.replaced')}</div>}
          <RerollButton m={m} />
          <InterveneButton m={m} />
          {fumble && <div className="roll-flag">{t('log.fumble')}</div>}
        </div>
      )}
    </div>
  );
}

/**
 * Undo a Hotlist change made in combat or an item use (its owner or the GM): the slots or the item come back,
 * healing/Mana it gave is taken away and the Action is returned.
 */
function UndoEvent({ m }: { m: Message }) {
  const { t, err } = useI18n();
  const { user } = useAuth();
  const live = useLive();
  const [error, setError] = useState('');
  if (!user || (!user.isAdmin && m.userId !== user.id)) return null;
  const undo = async () => {
    setError('');
    try {
      await api.undoEvent(m.id);
      live.setEncounter(await api.encounter());
    } catch (e) {
      setError(err(e));
    }
  };
  return (
    <>
      {' '}
      <button type="button" className="btn small ghost" onClick={undo}>
        ↶ {t('log.undo')}
      </button>
      {error && <span className="tiny error"> {error}</span>}
    </>
  );
}

/** One automatic log line: HP/mana changes with their source, level-ups, advancement, combat. */
function EventEntry({ m, ev, time }: { m: Message; ev: LogEvent; time: string }) {
  const { t, lang } = useI18n();
  const who = m.characterName || m.userName;
  const pct = (lost: number) => (10 - lost) * 10;
  const src = (s: string) => (s ? ` · ${s}` : ` · ${t('log.ev.manual')}`);
  let icon = '•';
  let tone = '';
  let body: ReactNode = null;
  switch (ev.type) {
    case 'hp': {
      const gain = ev.to < ev.from;
      icon = gain ? '✚' : '✖';
      tone = gain ? 'good' : 'bad';
      body = (
        <>
          <strong>{who}</strong>{' '}
          {t(gain ? 'log.ev.hpGain' : 'log.ev.hpLoss', {
            n: Math.abs(ev.to - ev.from),
            from: pct(ev.from),
            to: pct(ev.to),
          })}
          <span className="dim">{src(ev.source)}</span>
        </>
      );
      break;
    }
    case 'mana':
      icon = '✦';
      tone = 'mana';
      body = (
        <>
          <strong>{who}</strong> {t('log.ev.mana', { from: ev.from || '—', to: ev.to || '—' })}
          <span className="dim">{src(ev.source)}</span>
        </>
      );
      break;
    case 'level':
      icon = '▲';
      tone = 'good';
      body = (
        <>
          <strong>{who}</strong> {t('log.ev.level', { to: ev.to, n: ev.levels })}
          <span className="dim">
            {' · '}
            {t(`prog.src.${ev.source}` as MsgKey)}
            {ev.source === 'boss' && ev.detail
              ? ` (${t(`prog.tier.${ev.detail}` as MsgKey)})`
              : ev.detail
                ? ` (${ev.detail})`
                : ''}
          </span>
        </>
      );
      break;
    case 'stats':
      icon = '▲';
      tone = 'good';
      body = (
        <>
          <strong>{who}</strong>{' '}
          {t('log.ev.stats', {
            list: Object.entries(ev.changes)
              .map(([k, n]) => `${t(`stat.${k}.short` as MsgKey)} +${n}`)
              .join(', '),
          })}
          {ev.left > 0 && <span className="dim"> · {t('log.ev.statsLeft', { n: ev.left })}</span>}
        </>
      );
      break;
    case 'grind':
      icon = '⏱';
      body = (
        <>
          <strong>{who}</strong> {t('log.ev.grind', { h: ev.hours, total: ev.total, need: Math.max(1, ev.level) })}
        </>
      );
      break;
    case 'advance':
      icon = '★';
      body = (
        <>
          <strong>{who}</strong> {t(ev.mode === 'floor' ? 'log.ev.advFloor' : 'log.ev.advSession')}
          {ev.results.length === 0 ? (
            <span className="dim"> · {t('adv.none')}</span>
          ) : (
            <ul className="ev-list">
              {ev.results.map((r, i) => (
                <li key={i} className={r.gained ? 'good' : 'dim'}>
                  {t(r.gained ? 'adv.gained' : 'adv.failed', {
                    name: r.name,
                    roll: r.roll,
                    rank: r.from,
                    next: r.from + 1,
                  })}
                </li>
              ))}
            </ul>
          )}
        </>
      );
      break;
    case 'combat':
      icon = '⚔';
      tone = 'combat';
      body = (
        <strong>
          {ev.action === 'start'
            ? t(ev.round === 0 ? 'log.ev.startSurprise' : 'log.ev.start')
            : ev.action === 'end'
              ? t('log.ev.end', { n: ev.round })
              : t('log.ev.round', { n: ev.round })}
        </strong>
      );
      break;
    case 'world':
      icon = '▼';
      tone = 'combat';
      if (ev.action === 'saferoom') {
        icon = '🛏';
        tone = 'good';
        body = <strong>{t(ev.on ? 'log.ev.saferoomIn' : 'log.ev.saferoomOut')}</strong>;
        break;
      }
      body = <strong>{t('log.ev.floor', { n: ev.to, name: lang === 'es' ? ev.nameEs : ev.name })}</strong>;
      break;
    case 'favor':
      icon = '✦';
      tone = 'good';
      body = (
        <>
          <strong>{who}</strong> {t(ev.use === 'reroll' ? 'log.ev.favorReroll' : 'log.ev.favorAction')}
          <span className="dim"> · {t('log.ev.favorLeft', { n: ev.to })}</span>
        </>
      );
      break;
    case 'expired':
      icon = '⏱';
      tone = '';
      body = (
        <>
          <strong>{who}</strong>{' '}
          {t('log.ev.expired', {
            list: ev.names.map((n) => (n.startsWith('debuff:') ? t(`debuff.${n.slice(7)}` as MsgKey) : n)).join(', '),
          })}
        </>
      );
      break;
    case 'injury':
      icon = '✖';
      tone = 'bad';
      body = (
        <>
          <strong>{who}</strong> {t('log.ev.injury', { d: t(`debuff.${ev.debuff}` as MsgKey) })}
          {ev.source && <span className="dim"> · {ev.source}</span>}
        </>
      );
      break;
    case 'item':
      icon = '⚗';
      tone = ev.undone ? '' : 'good';
      body = (
        <>
          <span className={ev.undone ? 'struck' : ''}>
            <strong>{who}</strong>{' '}
            {ev.kept
              ? t('log.ev.itemAbility', { item: ev.item })
              : ev.target
                ? t('log.ev.itemOn', { item: ev.item, target: ev.target })
                : t('log.ev.item', { item: ev.item })}
            {ev.kept && ev.ability && <span className="dim"> · {ev.ability}</span>}
            {ev.applied?.type === 'heal' && <span> · {t('log.ev.itemHeal', { n: ev.applied.slots })}</span>}
            {ev.applied?.type === 'mana' && <span> · {t('log.ev.itemMana')}</span>}
            {!ev.kept && (
              <span className="dim">
                {' '}
                · {t('log.ev.itemLeft', { n: ev.left })}
                {ev.charges ? ` · ${t('log.ev.itemCharges', { n: ev.charges })}` : ''}
              </span>
            )}
          </span>
          {ev.undone ? <span className="dim"> · {t('log.ev.undone')}</span> : ev.undo ? <UndoEvent m={m} /> : null}
        </>
      );
      break;
    case 'hotlist':
      icon = '★';
      tone = ev.undone ? '' : 'combat';
      body = (
        <>
          <span className={ev.undone ? 'struck' : ''}>
            <strong>{who}</strong>{' '}
            {ev.item
              ? t('log.ev.hotlistSet', { n: ev.slot, item: ev.item })
              : t('log.ev.hotlistClear', { n: ev.slot, item: ev.prev })}
            {ev.item && ev.prev && <span className="dim"> · {t('log.ev.hotlistWas', { item: ev.prev })}</span>}
          </span>
          {ev.undone ? <span className="dim"> · {t('log.ev.undone')}</span> : <UndoEvent m={m} />}
        </>
      );
      break;
    case 'interrupt':
      icon = '🛡';
      tone = 'good';
      body = (
        <>
          <strong>{who}</strong> {t('log.ev.catch', { ally: ev.ally, attack: ev.attack })}
        </>
      );
      break;
    case 'achievement':
      icon = '🏆';
      tone = 'good';
      body = (
        <>
          <strong>{who}</strong> {t('log.ev.achievement', { title: ev.title })}
        </>
      );
      break;
    case 'reward':
      icon = '▣';
      tone = 'good';
      body = (
        <>
          <strong>{who}</strong> {t('log.ev.reward', { title: ev.title })}{' '}
          {ev.boxes.map((b, i) => (
            <BoxChip key={i} box={b} />
          ))}
        </>
      );
      break;
    case 'quest':
      icon = ev.action === 'failed' ? '✖' : ev.action === 'claimed' ? '▣' : '📜';
      tone = ev.action === 'failed' || ev.action === 'declined' ? 'bad' : 'good';
      body = (
        <>
          <strong>{who}</strong> {t(`log.ev.quest.${ev.action}` as MsgKey, { title: ev.title })}{' '}
          {!!ev.levels && <span className="pill level-pill">{t('quest.levels', { n: ev.levels })}</span>}{' '}
          {ev.boxes?.map((b, i) => (
            <BoxChip key={i} box={b} sealed={ev.action === 'completed'} />
          ))}
          {ev.note && <span className="dim"> · {ev.note}</span>}
          {ev.penalty && (
            <div className="log-penalty">
              {t('quest.penaltyHit')}: {ev.penalty}
            </div>
          )}
        </>
      );
      break;
    case 'boxes':
      icon = '▣';
      tone = 'good';
      body = (
        <>
          <strong>{who}</strong> {t('log.ev.boxesGot', { from: boxSource(t, ev) })}{' '}
          {ev.boxes.map((b, i) => (
            <BoxChip key={i} box={b} sealed />
          ))}
        </>
      );
      break;
    case 'box':
      icon = '▣';
      tone = 'good';
      body = (
        <>
          <strong>{who}</strong> {t('log.ev.boxOpened')} <BoxChip box={ev.box} />
          <span className="dim"> ({boxSource(t, ev)})</span>
          {(ev.items.length > 0 || ev.gold > 0) && (
            <div className="log-items">
              {[
                ...ev.items.map((it) => `${it.item}${Number(it.qty) > 1 ? ` ×${it.qty}` : ''}`),
                ev.gold ? `🪙 ${t('wallet.goldN', { n: ev.gold })}` : '',
              ]
                .filter(Boolean)
                .join(', ')}
            </div>
          )}
        </>
      );
      break;
    case 'gold':
      icon = '🪙';
      tone = ev.to >= ev.from ? 'good' : 'bad';
      body = (
        <>
          <strong>{who}</strong> {t('log.ev.gold', { from: ev.from.toLocaleString(), to: ev.to.toLocaleString() })}
        </>
      );
      break;
    case 'cursed':
      icon = '☠';
      tone = 'bad';
      body = (
        <>
          <strong>{who}</strong> {t('log.ev.cursed', { item: ev.item })}
        </>
      );
      break;
    case 'learned':
      icon = ev.source === 'book' ? '📖' : '🎓';
      tone = 'good';
      body = (
        <>
          <strong>{who}</strong> {t(ev.raised ? 'log.ev.learnedUp' : 'log.ev.learned', { name: ev.name, n: ev.rank })}
          {ev.title && <span className="dim"> · {ev.title}</span>}
        </>
      );
      break;
    case 'gift':
      icon = '🎁';
      tone = 'good';
      body = (
        <>
          <strong>{who}</strong> {t('log.ev.gift')}{' '}
          {ev.items.map((it, i) => (
            <span key={i} className={`pill tiny-pill rar-pill ${rarityClass(it.rarity)}`}>
              {it.item}
              {Number(it.qty) > 1 ? ` ×${it.qty}` : ''}
            </span>
          ))}
        </>
      );
      break;
    case 'declare':
      icon = '⚠';
      tone = 'foe';
      body = (
        <>
          <strong>{t('log.ev.declare', { n: ev.round })}</strong>
          <ul className="ev-list">
            {ev.items.map((d, i) => (
              <li key={i}>
                {t('log.ev.declareItem', {
                  who: `“${d.opponent}”`,
                  attack: d.attack,
                  targets: d.targets.map((x) => `“${x.name}”${x.splash ? ` (${t('decl.splash')})` : ''}`).join(', '),
                })}
                {d.dc !== null && <strong> – {t('log.ev.declareDc', { n: d.dc })}</strong>}
                {d.range && <span className="dim"> ({d.range})</span>}
                {d.area && <span className="dim"> · {t('decl.areaLog')}</span>}
              </li>
            ))}
          </ul>
        </>
      );
      break;
    case 'opponent':
      icon = ev.defeated ? '✝' : '✖';
      tone = 'foe';
      body = (
        <>
          <strong>{ev.name}</strong>{' '}
          {ev.defeated ? t('log.ev.defeated') : t('log.ev.opponent', { from: ev.from, to: ev.to })}
          {ev.source && <span className="dim"> · {ev.source}</span>}
        </>
      );
      break;
  }
  return (
    <div className={`log-event tone-${tone} ${m.gmOnly ? 'gm-only' : ''}`}>
      <span className="ev-icon" aria-hidden>
        {icon}
      </span>
      <div className="ev-body">
        {body}
        {m.gmOnly && <span className="pill tiny-pill">{t('log.private')}</span>}
      </div>
      <span className="dim tiny log-time">{time}</span>
    </div>
  );
}

function Composer() {
  const { t } = useI18n();
  const { user } = useAuth();
  const live = useLive();
  const [text, setText] = useState('');
  const [speaker, setSpeaker] = useState<string>('auto');
  const [gmOnly, setGmOnly] = useState(false);
  const [error, setError] = useState('');
  const { refreshSpeakers } = live;

  // "auto" speaks as the sheet you have open (if you can), otherwise as yourself
  const active = live.activeChar;
  const characterId = speaker === 'auto' ? (active?.id ?? null) : speaker === 'me' ? null : Number(speaker) || null;

  const post = async (body: Parameters<typeof live.send>[0]) => {
    setError('');
    try {
      await live.send({ ...body, characterId, gmOnly });
      return true;
    } catch (e) {
      const code = (e as { code?: string }).code;
      setError(t(code === 'bad_dice' ? 'log.badDice' : code === 'too_many_messages' ? 'log.slowDown' : 'err.generic'));
      return false;
    }
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const v = text.trim();
    if (!v) return;
    if (await post({ text: v })) setText('');
  };

  const me = user?.isAdmin ? t('log.asGm') : t('log.asMe', { name: user?.username ?? '' });

  return (
    <form className="composer" onSubmit={submit}>
      <div className="dice-row" role="group" aria-label={t('log.quickDice')}>
        <DiceIcon />
        {DICE.map((d) => (
          <button key={d} type="button" className="die-btn" onClick={() => post({ roll: { expr: `d${d}` } })}>
            d{d}
          </button>
        ))}
      </div>
      <div className="composer-opts">
        <select
          className="in sel small-sel"
          value={speaker}
          onFocus={refreshSpeakers}
          onChange={(e) => setSpeaker(e.target.value)}
          aria-label={t('log.speakAs')}
        >
          <option value="auto">{active ? t('log.asAuto', { name: active.name }) : me}</option>
          {active && <option value="me">{me}</option>}
          {live.speakers
            .filter((s) => s.id !== active?.id)
            .map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
        </select>
        <label className="gm-check" title={t(user?.isAdmin ? 'log.hiddenHint' : 'log.whisperHint')}>
          <input type="checkbox" checked={gmOnly} onChange={(e) => setGmOnly(e.target.checked)} />
          {t(user?.isAdmin ? 'log.hidden' : 'log.whisper')}
        </label>
      </div>
      <div className="composer-row">
        <input
          className="in"
          value={text}
          maxLength={1000}
          placeholder={t('log.placeholder')}
          aria-label={t('log.placeholder')}
          onChange={(e) => setText(e.target.value)}
        />
        <button className="btn primary small" disabled={!text.trim()}>
          {t('log.send')}
        </button>
      </div>
      {error && <p className="error tiny">{error}</p>}
    </form>
  );
}
