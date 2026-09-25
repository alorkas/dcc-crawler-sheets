import type { SheetData } from './sheet';

export type User = { id: number; username: string; isAdmin: boolean };
export type AdminUser = User & { createdAt: string; characters: number };

export type CharacterSummary = {
  id: number;
  ownerId: number;
  ownerName: string;
  locked: boolean;
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

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public body: Record<string, unknown> = {},
  ) {
    super(message);
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

  listUsers: () => request<AdminUser[]>('GET', '/api/users'),
  updateUser: (id: number, patch: { isAdmin?: boolean; password?: string }) =>
    request<User>('PATCH', `/api/users/${id}`, patch),
  deleteUser: (id: number) => request('DELETE', `/api/users/${id}`),
};
