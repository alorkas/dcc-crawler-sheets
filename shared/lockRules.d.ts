export const PLAY_PATHS: string[][];
export function isPlayPath(path: (string | number)[]): boolean;
export function withoutPlay<T>(data: T): Partial<T>;
export function onlyPlayChanges(a: unknown, b: unknown): boolean;
export function applyPlay<T>(stored: T, incoming: unknown): T;
