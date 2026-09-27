import type { LevelEntry, SheetData } from './sheet';

export type User = { id: number; username: string; isAdmin: boolean };
export type AdminUser = User & { createdAt: string; characters: number };

export type CharacterSummary = {
  id: number;
  ownerId: number;
  ownerName: string;
  locked: boolean;
  inParty: boolean;
  version: number;
  createdAt: string;
  updatedAt: string;
  summary: {
    name: string;
    race: string;
    class: string;
    level: string;
    floor: string;
    crawlerNumber: string;
    portrait: string;
  };
};
export type Character = CharacterSummary & { data: Partial<SheetData> };

/** A book entry from the server-side catalog (see server/catalog). All fields are optional strings. */
export type CatalogEntry = {
  name: string;
  subtype?: string;
  attackType?: '' | 'melee' | 'ranged';
  stat?: string;
  tags?: string;
  manaCost?: string;
  range?: string;
  duration?: string;
  aiFavor?: string;
  limitations?: string;
  cooldown?: string;
  baseDamage?: string;
  effect?: string;
  upgrades?: string;
  type?: string;
  slot?: string;
  interrupt?: boolean;
  page?: number;
};
export type CatalogHit = { kind: 'weapon' | 'spell' | 'utility' | 'item'; entry: CatalogEntry };
export type FullCatalog = {
  weapons: CatalogEntry[];
  utility: CatalogEntry[];
  spells: CatalogEntry[];
  items: CatalogEntry[];
};

/** What the party panel gets for each member (a small slice of the sheet; mana only for owner and GM). */
export type PartyMember = { id: number; ownerId: number; ownerName: string; mine: boolean; view: Partial<SheetData> };

export type RollPart = {
  sign: number;
  value: number;
  dice?: string;
  sides?: number;
  rolls?: number[];
  kept?: boolean[];
};
export type RollResult = {
  expr: string;
  total: number;
  parts: RollPart[];
  natural: number | null;
  label: string;
  /** An Evade roll against a declared attack: its difficulty and whether it succeeded. */
  vs?: { dc: number | null; success: boolean | null; area?: boolean; kind?: 'attack' };
};
export type Message = {
  id: number;
  kind: 'chat' | 'roll' | 'event';
  text: string;
  roll: RollResult | null;
  gmOnly: boolean;
  userId: number;
  userName: string;
  isAdmin: boolean;
  characterId: number | null;
  characterName: string;
  event: LogEvent | null;
  createdAt: string;
};
/** Automatic log entries (the "Log" tab). */
export type LogEvent =
  | { type: 'hp'; from: number; to: number; source: string }
  | { type: 'mana'; from: string; to: string; source: string }
  | ({ type: 'level' } & LevelEntry)
  | { type: 'grind'; hours: number; total: number; level: number }
  | {
      type: 'stats';
      changes: Partial<Record<'str' | 'int' | 'con' | 'dex' | 'cha', number>>;
      spent: number;
      left: number;
    }
  | {
      type: 'advance';
      mode: 'session' | 'floor';
      results: { name: string; from: number; roll: number; gained: boolean }[];
    }
  | { type: 'combat'; action: 'start' | 'round' | 'end'; round: number }
  | { type: 'opponent'; name: string; from: number; to: number; defeated: boolean; source: string }
  | { type: 'favor'; use: 'reroll' | 'action'; from: number; to: number }
  | {
      type: 'declare';
      round: number;
      items: {
        opponent: string;
        attack: string;
        range: string;
        dc: number | null;
        area?: boolean;
        targets: { id: number; name: string; splash?: boolean }[];
      }[];
    };

export type OpponentKind = 'mob' | 'elite' | 'boss' | 'npc' | 'crawler';
export type Opponent = {
  id: number;
  name: string;
  kind: OpponentKind;
  pct: number;
  defeated: boolean;
  // GM only
  slots?: number;
  slotValue?: number;
  lost?: number;
  dr?: string;
  evade?: string;
  notes?: string;
  hidden?: boolean;
  npcId?: number | null;
  attacks?: NpcAttack[];
  mods?: Partial<Record<'str' | 'int' | 'con' | 'dex' | 'cha', string>>;
};
export type NpcAttack = { name: string; toHit: string; damage: string; range: string; effect: string };
/** A Mob's declared attack for this round (Mob Action Declaration). Players see it from Crawler Reaction on. */
export type Declaration = {
  id: number;
  round: number;
  opponentId: number;
  opponentName: string;
  /** Players get only the name and range. */
  attack: Partial<NpcAttack> & { name: string };
  dc: number | null;
  /** Area Attack: a successful Evade halves the damage instead of avoiding it. */
  area?: boolean;
  targets: {
    id: number;
    name: string;
    /** In the Splash zone of an Area Attack: half damage (¼ when Evaded). */
    splash?: boolean;
    evade: {
      total: number;
      natural: number | null;
      success: boolean | null;
      /** Rerolled with AI Favor (once per check); `first` is the original total. */
      rerolled?: boolean;
      first?: number;
    } | null;
    applied: { damage: number; slots: number } | null;
  }[];
  damage: { total: number; expr: string } | null;
};
export type Encounter = {
  active: boolean;
  round: number;
  phase: number;
  floor: number;
  opponents: Opponent[];
  declarations: Declaration[];
  /** Crawler Actions used this round, by character id (missing = none used yet). */
  actions: Record<string, CrawlerActions>;
  /** Crawler attacks this round (step 4 / surprise round). */
  attacks: CrawlerAttack[];
};
/** A crawler's attack on an opponent: hit or miss against the Mob's Evade (`dc`, GM only). */
export type CrawlerAttack = {
  id: number;
  round: number;
  characterId: number;
  charName: string;
  opponentId: number;
  opponentName: string;
  label: string;
  total: number;
  natural: number | null;
  dc?: number | null;
  /** null when the Mob has no Evade on file: the GM calls it. */
  hit: boolean | null;
  damageExpr: string | null;
  damage: { total: number; expr: string } | null;
  applied: { slots: number; damage: number } | null;
};
/** 'evade' / 'interrupt' are Crawler Reaction Interrupts, 'action' is a Crawler Action (step 4). */
export type ActionKind = 'evade' | 'interrupt' | 'action' | 'attack';
export type CrawlerActions = { used: ActionKind[]; extra: boolean; max: number };
export type NpcData = {
  name: string;
  kind: OpponentKind;
  size: string;
  tags: string;
  slots: string;
  slotValue: string;
  level: string;
  surprise: string;
  evade: string;
  move: string;
  dr: string;
  stats: Record<'str' | 'int' | 'con' | 'dex' | 'cha', { score: string; mod: string }>;
  attacks: NpcAttack[];
  notes: string;
  /** Locked stat blocks can't be edited by accident (the default for book entries). */
  locked: boolean;
  /** Where a book stat block came from ("Core Rulebook p. 333") and its chapter/Floor. */
  source: string;
  chapter: string;
  /** Floor the stat block belongs to (0 = any / not set). */
  floor: number;
};
export type Npc = { id: number; data: Partial<NpcData>; updatedAt: string };
export type ProgressAction =
  | { type: 'twoHours' }
  | { type: 'quest'; levels: number }
  | { type: 'boss'; tier: string }
  | { type: 'kill'; victimLevel: number }
  | { type: 'grind'; hours: number }
  | { type: 'levels'; levels: number };
export type HpManaSources = { hp?: string[]; mana?: string[] };
export type NewMessage = {
  text?: string;
  roll?: { expr: string; label?: string };
  characterId?: number | null;
  gmOnly?: boolean;
};

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public body: Record<string, unknown> = {},
  ) {
    super(message);
  }
  /** Stable machine-readable error code from the server, used for translation. */
  get code(): string | undefined {
    return typeof this.body.code === 'string' ? this.body.code : undefined;
  }
}

async function request<T>(method: string, url: string, body?: unknown): Promise<T> {
  const res = await fetch(url, {
    method,
    credentials: 'same-origin',
    headers: body !== undefined ? { 'content-type': 'application/json' } : undefined,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(res.status, json.error || res.statusText, json);
  return json as T;
}

export const api = {
  config: () => request<{ allowRegistration: boolean }>('GET', '/api/config'),
  me: () => request<User>('GET', '/api/auth/me'),
  login: (username: string, password: string) => request<User>('POST', '/api/auth/login', { username, password }),
  register: (username: string, password: string) => request<User>('POST', '/api/auth/register', { username, password }),
  logout: () => request('POST', '/api/auth/logout'),
  changePassword: (currentPassword: string, newPassword: string) =>
    request('POST', '/api/auth/password', { currentPassword, newPassword }),

  listCharacters: (all = false) => request<CharacterSummary[]>('GET', `/api/characters${all ? '?scope=all' : ''}`),
  createCharacter: (data: Partial<SheetData> = {}, ownerId?: number) =>
    request<Character>('POST', '/api/characters', { data, ownerId }),
  getCharacter: (id: number) => request<Character>('GET', `/api/characters/${id}`),
  saveCharacter: (id: number, data: SheetData, version: number, sources?: HpManaSources) =>
    request<CharacterSummary>('PUT', `/api/characters/${id}`, { data, version, sources }),
  setLocked: (id: number, locked: boolean) =>
    request<CharacterSummary>('POST', `/api/characters/${id}/lock`, { locked }),
  deleteCharacter: (id: number) => request('DELETE', `/api/characters/${id}`),
  setOwner: (id: number, ownerId: number) =>
    request<CharacterSummary>('PATCH', `/api/characters/${id}/owner`, { ownerId }),

  setInParty: (id: number, inParty: boolean) =>
    request<{ id: number; inParty: boolean }>('PATCH', `/api/characters/${id}/party`, { inParty }),
  party: () => request<PartyMember[]>('GET', '/api/party'),
  messages: () => request<Message[]>('GET', '/api/messages'),
  postMessage: (m: NewMessage) => request<Message>('POST', '/api/messages', m),
  clearMessages: () => request('DELETE', '/api/messages'),

  encounter: () => request<Encounter>('GET', '/api/encounter'),
  encounterAction: (action: 'start' | 'next' | 'prev' | 'end' | 'floor', extra: Record<string, unknown> = {}) =>
    request<Encounter>('POST', '/api/encounter', { action, ...extra }),
  addOpponents: (o: Record<string, unknown>) => request<Encounter>('POST', '/api/encounter/opponents', o),
  updateOpponent: (id: number, patch: Record<string, unknown>) =>
    request<Encounter>('PATCH', `/api/encounter/opponents/${id}`, patch),
  removeOpponent: (id: number) => request<Encounter>('DELETE', `/api/encounter/opponents/${id}`),
  declare: (d: {
    opponentId: number;
    attack: number | Partial<NpcAttack>;
    targets: number[];
    area?: boolean;
    splash?: number[];
  }) => request<Encounter>('POST', '/api/encounter/declarations', d),
  removeDeclaration: (id: number) => request<Encounter>('DELETE', `/api/encounter/declarations/${id}`),
  rollEvade: (id: number, characterId: number, expr: string, reroll = false) =>
    request<Encounter>('POST', `/api/encounter/declarations/${id}/evade`, { characterId, expr, reroll }),
  crawlerAction: (
    characterId: number,
    op: 'use' | 'free' | 'extra',
    extra: { kind?: ActionKind; index?: number } = {},
  ) => request<Encounter>('POST', '/api/encounter/actions', { characterId, op, ...extra }),
  rollDeclDamage: (id: number) => request<Encounter>('POST', `/api/encounter/declarations/${id}/damage`, {}),
  markTarget: (
    id: number,
    characterId: number,
    patch: { applied?: { damage: number; slots: number } | null; evade?: null },
  ) => request<Encounter>('PATCH', `/api/encounter/declarations/${id}/targets/${characterId}`, patch),
  crawlerAttack: (a: {
    characterId: number;
    opponentId: number;
    expr: string;
    damage?: string | null;
    label: string;
  }) => request<Encounter>('POST', '/api/encounter/attacks', a),
  attackDamage: (id: number, expr?: string) =>
    request<Encounter>('POST', `/api/encounter/attacks/${id}/damage`, expr ? { expr } : {}),
  applyAttack: (id: number, body: { hit?: boolean } = {}) =>
    request<Encounter>('POST', `/api/encounter/attacks/${id}/apply`, body),
  npcRoll: (r: { name: string; expr: string; label?: string; gmOnly?: boolean }) =>
    request<Message>('POST', '/api/npc-roll', r),

  npcs: () => request<Npc[]>('GET', '/api/npcs'),
  npc: (id: number) => request<Npc>('GET', `/api/npcs/${id}`),
  createNpc: (data: Partial<NpcData> = {}) => request<Npc>('POST', '/api/npcs', { data }),
  saveNpc: (id: number, data: NpcData) => request<Npc>('PUT', `/api/npcs/${id}`, { data }),
  deleteNpc: (id: number) => request('DELETE', `/api/npcs/${id}`),
  importBookNpcs: () => request<{ added: number; updated: number; total: number }>('POST', '/api/npcs/import-book', {}),

  progress: (id: number, action: ProgressAction) =>
    request<{ data: SheetData; version: number }>('POST', `/api/characters/${id}/progress`, action),
  advance: (id: number, mode: 'session' | 'floor') =>
    request<{
      data: SheetData;
      version: number;
      results: { name: string; from: number; roll: number; gained: boolean }[];
    }>('POST', `/api/characters/${id}/advance`, { mode }),
  partyTwoHours: () => request<{ members: { id: number }[] }>('POST', '/api/party/two-hours', {}),

  listUsers: () => request<AdminUser[]>('GET', '/api/users'),
  updateUser: (id: number, patch: { isAdmin?: boolean; password?: string }) =>
    request<User>('PATCH', `/api/users/${id}`, patch),
  deleteUser: (id: number) => request('DELETE', `/api/users/${id}`),

  lookupCatalog: (name: string, scope: 'skill' | 'item' = 'skill') =>
    request<CatalogHit>('GET', `/api/catalog/lookup?scope=${scope}&name=${encodeURIComponent(name)}`),
  publicSkills: () => request<{ name: string; category: string; subtype: string }[]>('GET', '/api/catalog/skills'),
  fullCatalog: () => request<FullCatalog>('GET', '/api/catalog/all'),
};
