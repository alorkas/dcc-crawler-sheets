import type { SheetData } from './sheet';

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
export type RollResult = { expr: string; total: number; parts: RollPart[]; natural: number | null; label: string };
export type Message = {
  id: number;
  kind: 'chat' | 'roll';
  text: string;
  roll: RollResult | null;
  gmOnly: boolean;
  userId: number;
  userName: string;
  isAdmin: boolean;
  characterId: number | null;
  characterName: string;
  createdAt: string;
};
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
  saveCharacter: (id: number, data: SheetData, version: number) =>
    request<CharacterSummary>('PUT', `/api/characters/${id}`, { data, version }),
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

  listUsers: () => request<AdminUser[]>('GET', '/api/users'),
  updateUser: (id: number, patch: { isAdmin?: boolean; password?: string }) =>
    request<User>('PATCH', `/api/users/${id}`, patch),
  deleteUser: (id: number) => request('DELETE', `/api/users/${id}`),

  lookupCatalog: (name: string, scope: 'skill' | 'item' = 'skill') =>
    request<CatalogHit>('GET', `/api/catalog/lookup?scope=${scope}&name=${encodeURIComponent(name)}`),
  publicSkills: () => request<{ name: string; category: string; subtype: string }[]>('GET', '/api/catalog/skills'),
  fullCatalog: () => request<FullCatalog>('GET', '/api/catalog/all'),
};
