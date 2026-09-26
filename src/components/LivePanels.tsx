import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, type Message, type PartyMember } from '../lib/api';
import { useAuth } from '../lib/auth';
import { useI18n, type MsgKey } from '../lib/i18n';
import { useLive } from '../lib/live';
import { derive } from '../lib/rules';
import { normalize } from '../lib/sheet';
import { ChatIcon, ChevronIcon, DiceIcon, PartyIcon } from './icons';

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

const hpTone = (pct: number, dying: boolean) => (dying ? 'dying' : pct >= 60 ? 'ok' : pct >= 30 ? 'warn' : 'bad');

export function PartyPanel() {
  const { t } = useI18n();
  const { party } = useLive();
  const [open, setOpen] = usePanelState('dcc.panel.party');
  const members = party ?? [];
  return (
    <SidePanel
      side="left"
      open={open}
      onToggle={setOpen}
      title={t('party.title')}
      icon={<PartyIcon />}
      rail={members.map((m) => (
        <RailMember key={m.id} m={m} onOpen={() => setOpen(true)} />
      ))}
    >
      <div className="side-body">
        {party === null && <p className="dim small">{t('common.loading')}</p>}
        {party !== null && members.length === 0 && <PartyEmpty />}
        {members.map((m) => (
          <MemberCard key={m.id} m={m} />
        ))}
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
      <span>{initials(name)}</span>
    </button>
  );
}

function MemberCard({ m }: { m: PartyMember }) {
  const { t } = useI18n();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { sheet, der, showMana } = useMemberStats(m);
  const canOpen = m.mine || !!user?.isAdmin;
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
        <span className="member-avatar">{initials(sheet.name)}</span>
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
      {(der.dying || sheet.debuffList.length > 0) && (
        <div className="member-chips">
          {der.dying && (
            <span className="chip dying-chip">
              {t('party.dying')}
              {sheet.dyingRounds && ` · ${t('party.rounds', { n: sheet.dyingRounds })}`}
            </span>
          )}
          {sheet.debuffList.map((d) => (
            <span key={d.id} className="chip">
              {t(`debuff.${d.id}` as MsgKey)}
              {d.stacks > 1 && ` ×${d.stacks}`}
            </span>
          ))}
        </div>
      )}
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

type Filter = 'all' | 'roll' | 'chat';
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
        {(['all', 'roll', 'chat'] as Filter[]).map((f) => (
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
  const shown = messages.filter((m) => filter === 'all' || m.kind === filter);

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

function LogEntry({ m }: { m: Message }) {
  const { t, locale } = useI18n();
  const { user } = useAuth();
  const time = new Date(m.createdAt).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
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
        <div className={`log-roll ${crit ? 'crit' : ''} ${fumble ? 'fumble' : ''}`}>
          <div className="roll-line">
            <span className="roll-label">{r.label || t('log.roll')}</span>
            <span className="roll-result">{r.total}</span>
          </div>
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
          {fumble && <div className="roll-flag">{t('log.fumble')}</div>}
        </div>
      )}
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
