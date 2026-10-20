import { useEffect, useState } from 'react';
import { api } from './api';
import { useI18n } from './i18n';
import { skillEs } from '../../shared/namesEs.js';

/* Spanish names of book things (skills, spells, items) for the names on a sheet. Public skills are translated in
   the browser; spells and items are asked to the server, only for names the player already has. */

const cache = new Map<string, string>(); // name → Spanish ('' = none)
const waiting = new Set<string>();
const listeners = new Set<() => void>();
let timer: ReturnType<typeof setTimeout> | null = null;

function flush() {
  timer = null;
  const names = [...waiting];
  waiting.clear();
  if (!names.length) return;
  api
    .translateNames(names)
    .then((map) => {
      for (const n of names) cache.set(n, map[n] ?? '');
      listeners.forEach((l) => l());
    })
    .catch(() => names.forEach((n) => cache.set(n, '')));
}

function ask(name: string) {
  if (cache.has(name) || waiting.has(name)) return;
  waiting.add(name);
  timer ??= setTimeout(flush, 30);
}

/**
 * `es(name)`: the Spanish name of a book skill/spell/item when the app is in Spanish ('' otherwise, or when it
 * has none or is already in Spanish).
 */
export function useNamesEs(): (name: string) => string {
  const { lang } = useI18n();
  const [, setTick] = useState(0);
  useEffect(() => {
    const l = () => setTick((n) => n + 1);
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  }, []);
  return (name: string) => {
    const n = String(name ?? '').trim();
    if (lang !== 'es' || !n) return '';
    const local = skillEs(n);
    if (local) return local === n ? '' : local;
    if (!cache.has(n)) ask(n);
    return cache.get(n) ?? '';
  };
}
