import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { api, type CharacterSummary, type Encounter, type Message, type NewMessage, type PartyMember } from './api';
import { useAuth } from './auth';

type LiveState = {
  connected: boolean;
  party: PartyMember[] | null;
  messages: Message[];
  /** Messages that arrived while the log panel was closed. */
  unread: number;
  setLogVisible: (v: boolean) => void;
  /** Characters the current user can speak/roll as (own characters; the GM gets the party). */
  speakers: { id: number; name: string }[];
  /** The character sheet currently open (default speaker for chat and sheet rolls). */
  activeChar: { id: number; name: string } | null;
  setActiveChar: (c: { id: number; name: string } | null) => void;
  send: (m: NewMessage) => Promise<Message>;
  roll: (expr: string, label: string, characterId?: number | null) => Promise<void>;
  refreshSpeakers: () => void;
  /** The combat tracker (round, phase, opponents). */
  encounter: Encounter | null;
  setEncounter: (e: Encounter) => void;
  /** Subscribe to "this sheet has a newer version on the server" notices. Returns an unsubscribe function. */
  onCharacter: (fn: (e: { id: number; version: number; by: number | null }) => void) => () => void;
};

const LiveCtx = createContext<LiveState | null>(null);

export function LiveProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [connected, setConnected] = useState(false);
  const [party, setParty] = useState<PartyMember[] | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [unread, setUnread] = useState(0);
  const [mine, setMine] = useState<CharacterSummary[]>([]);
  const [activeChar, setActiveChar] = useState<{ id: number; name: string } | null>(null);
  const logVisible = useRef(false);
  const [encounter, setEncounter] = useState<Encounter | null>(null);
  const charListeners = useRef(new Set<(e: { id: number; version: number; by: number | null }) => void>());
  const onCharacter = useCallback((fn: (e: { id: number; version: number; by: number | null }) => void) => {
    charListeners.current.add(fn);
    return () => {
      charListeners.current.delete(fn);
    };
  }, []);
  const loadEncounter = useCallback(() => {
    api
      .encounter()
      .then(setEncounter)
      .catch(() => {});
  }, []);

  const loadParty = useCallback(() => {
    api
      .party()
      .then(setParty)
      .catch(() => {});
  }, []);
  const loadMessages = useCallback(() => {
    api
      .messages()
      .then(setMessages)
      .catch(() => {});
  }, []);
  const refreshSpeakers = useCallback(() => {
    api
      .listCharacters()
      .then(setMine)
      .catch(() => {});
  }, []);

  const addMessage = useCallback((m: Message) => {
    setMessages((list) => (list.some((x) => x.id === m.id) ? list : [...list, m].slice(-500)));
  }, []);

  useEffect(() => {
    if (!user) return;
    loadParty();
    loadMessages();
    refreshSpeakers();
    loadEncounter();
    let partyTimer: ReturnType<typeof setTimeout> | undefined;
    let wasConnected = false;
    const es = new EventSource('/api/events');
    es.onopen = () => {
      setConnected(true);
      // after a reconnect, catch up on anything we missed
      if (wasConnected) {
        loadParty();
        loadMessages();
        loadEncounter();
      }
      wasConnected = true;
    };
    es.onerror = () => setConnected(false);
    es.addEventListener('message', (e) => {
      const m = JSON.parse((e as MessageEvent).data) as Message;
      addMessage(m);
      if (!logVisible.current && m.userId !== user.id && (m.kind !== 'event' || m.event?.type === 'declare'))
        setUnread((n) => n + 1);
    });
    es.addEventListener('party', () => {
      clearTimeout(partyTimer);
      partyTimer = setTimeout(loadParty, 300);
    });
    es.addEventListener('clear', () => setMessages([]));
    es.addEventListener('encounter', loadEncounter);
    es.addEventListener('character', (e) => {
      const ev = JSON.parse((e as MessageEvent).data);
      charListeners.current.forEach((fn) => fn(ev));
    });
    return () => {
      clearTimeout(partyTimer);
      es.close();
      setConnected(false);
    };
  }, [user, loadParty, loadMessages, refreshSpeakers, addMessage, loadEncounter]);

  const setLogVisible = useCallback((v: boolean) => {
    logVisible.current = v;
    if (v) setUnread(0);
  }, []);

  const send = useCallback(
    async (m: NewMessage) => {
      const msg = await api.postMessage(m);
      addMessage(msg);
      return msg;
    },
    [addMessage],
  );

  const roll = useCallback(
    async (expr: string, label: string, characterId?: number | null) => {
      await send({ roll: { expr, label }, characterId: characterId ?? null });
    },
    [send],
  );

  const speakers = useMemo(() => {
    const own = mine.map((c) => ({ id: c.id, name: c.summary.name || '?' }));
    if (!user?.isAdmin) return own;
    const members = (party ?? []).map((p) => ({ id: p.id, name: p.view.name || '?' }));
    return [...members, ...own.filter((c) => !members.some((m) => m.id === c.id))];
  }, [user, party, mine]);

  const value = useMemo(
    () => ({
      connected,
      party,
      messages,
      unread,
      setLogVisible,
      speakers,
      activeChar,
      setActiveChar,
      send,
      roll,
      refreshSpeakers,
      encounter,
      setEncounter,
      onCharacter,
    }),
    [
      connected,
      party,
      messages,
      unread,
      setLogVisible,
      speakers,
      activeChar,
      send,
      roll,
      refreshSpeakers,
      encounter,
      onCharacter,
    ],
  );
  return <LiveCtx.Provider value={value}>{children}</LiveCtx.Provider>;
}

export function useLive() {
  const ctx = useContext(LiveCtx);
  if (!ctx) throw new Error('useLive outside LiveProvider');
  return ctx;
}

/** Same as useLive, but returns null outside the provider (e.g. in isolated component tests). */
export function useLiveOptional() {
  return useContext(LiveCtx);
}
