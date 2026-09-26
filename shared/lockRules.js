// What a locked sheet still allows. Locking freezes the character build (name, race, stats, skills, gear…)
// but keeps the "at the table" values usable: health, damage, rests, mana, buffs and debuffs.
// Shared by the browser (to decide which fields stay editable) and the server (to accept those saves).

/** Paths (and everything below them) that stay editable while a sheet is locked. '*' matches any list index. */
export const PLAY_PATHS = [
  ['hbLost'],
  ['dyingRounds'],
  ['manaCurrent'],
  ['debuffList'],
  ['debuffs'],
  ['evade', 'buffs'],
  ['externalBuffs'],
  ['pet', 'hbLost'],
  ['mount', 'hbLost'],
  ['skills', '*', 'done'], // skill advancement marks
];

/** True when `path` is (inside) one of the play paths. */
export function isPlayPath(path) {
  return PLAY_PATHS.some((p) => p.every((seg, i) => i < path.length && (seg === '*' || String(path[i]) === seg)));
}

/** Copy of the sheet without the play fields (for comparing the "build" part of two versions). */
export function withoutPlay(data) {
  const copy = JSON.parse(JSON.stringify(data ?? {}));
  for (const p of PLAY_PATHS) remove(copy, p);
  return copy;
}

/** Delete `path` from `obj` (expanding '*' over arrays); parents left empty are dropped too. */
function remove(obj, path) {
  if (!obj || typeof obj !== 'object') return;
  const [head, ...rest] = path;
  const keys = head === '*' ? Object.keys(obj) : [head];
  for (const k of keys) {
    if (!(k in obj)) continue;
    if (rest.length === 0) delete obj[k];
    else {
      remove(obj[k], rest);
      // drop objects that became empty, so {evade: {buffs}} and {} compare equal (never list items)
      const child = obj[k];
      if (head !== '*' && child && typeof child === 'object' && !Array.isArray(child) && !Object.keys(child).length)
        delete obj[k];
    }
  }
}

/**
 * The server's view of a save to a locked sheet: keep the stored build and take only the play fields
 * from the incoming data. (Comparing whole sheets would be fragile, because newer app versions add fields.)
 */
export function applyPlay(stored, incoming) {
  const out = JSON.parse(JSON.stringify(stored ?? {}));
  for (const p of PLAY_PATHS) copyPath(out, incoming ?? {}, p);
  return out;
}

function copyPath(dst, src, path) {
  if (!dst || typeof dst !== 'object' || !src || typeof src !== 'object') return;
  const [head, ...rest] = path;
  // '*' walks the stored list only: a locked sheet can't gain or lose list entries
  const keys = head === '*' ? Object.keys(dst) : [head];
  for (const k of keys) {
    if (rest.length === 0) {
      if (k in src) dst[k] = JSON.parse(JSON.stringify(src[k]));
    } else {
      if (head !== '*' && (dst[k] === undefined || dst[k] === null) && src[k] && typeof src[k] === 'object')
        dst[k] = Array.isArray(src[k]) ? [] : {};
      copyPath(dst[k], src[k], rest);
    }
  }
}

/** JSON with sorted keys, so key order doesn't matter when comparing. */
function stable(v) {
  if (Array.isArray(v)) return `[${v.map(stable).join(',')}]`;
  if (v && typeof v === 'object')
    return `{${Object.keys(v)
      .sort()
      .map((k) => `${JSON.stringify(k)}:${stable(v[k])}`)
      .join(',')}}`;
  return JSON.stringify(v);
}

/** True when `a` and `b` only differ in play fields. */
export function onlyPlayChanges(a, b) {
  return stable(withoutPlay(a)) === stable(withoutPlay(b));
}
