import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { api, ApiError, type AdminUser, type Character } from '../lib/api';
import { useAuth } from '../lib/auth';
import { normalize, setIn, type SheetData } from '../lib/sheet';
import { SheetCtx, type Path } from '../components/fields';
import { AbilitiesTab, CompanionsTab, CoreTab, GearTab, InventoryTab, SkillsTab } from '../components/SheetTabs';
import { LockIcon, UnlockIcon } from '../components/icons';

const TABS = [
  { id: 'core', label: 'Core', el: CoreTab },
  { id: 'gear', label: 'Gear & Hotlist', el: GearTab },
  { id: 'skills', label: 'Skills', el: SkillsTab },
  { id: 'inventory', label: 'Inventory', el: InventoryTab },
  { id: 'companions', label: 'Pets & More', el: CompanionsTab },
  { id: 'abilities', label: 'Abilities & Sponsors', el: AbilitiesTab },
] as const;

type SaveState = 'idle' | 'dirty' | 'saving' | 'saved' | 'error';

export default function SheetPage() {
  const { id } = useParams();
  const charId = Number(id);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const tab = TABS.find((t) => t.id === params.get('tab')) ?? TABS[0];

  const [meta, setMeta] = useState<Omit<Character, 'data'> | null>(null);
  const [data, setData] = useState<SheetData | null>(null);
  const [locked, setLocked] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [saveError, setSaveError] = useState('');
  const [conflict, setConflict] = useState<Character | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);

  const versionRef = useRef(0);
  const dirtyRef = useRef(false);
  const savingRef = useRef<Promise<void> | null>(null);
  const dataRef = useRef<SheetData | null>(null);
  dataRef.current = data;

  const applyServer = useCallback((c: Character) => {
    const { data: raw, ...rest } = c;
    setMeta(rest);
    setData(normalize(raw));
    setLocked(c.locked);
    versionRef.current = c.version;
    dirtyRef.current = false;
    setSaveState('idle');
    setConflict(null);
  }, []);

  useEffect(() => {
    api
      .getCharacter(charId)
      .then(applyServer)
      .catch((e) => setLoadError(e.message));
  }, [charId, applyServer]);

  useEffect(() => {
    if (user?.isAdmin)
      api
        .listUsers()
        .then(setUsers)
        .catch(() => {});
  }, [user]);

  const save = useCallback(async (): Promise<void> => {
    if (savingRef.current) {
      await savingRef.current;
      if (!dirtyRef.current) return;
    }
    const snapshot = dataRef.current;
    if (!snapshot || !dirtyRef.current) return;
    dirtyRef.current = false;
    setSaveState('saving');
    const p = (async () => {
      try {
        const res = await api.saveCharacter(charId, snapshot, versionRef.current);
        versionRef.current = res.version;
        setMeta((m) => (m ? { ...m, ...res } : m));
        setSaveError('');
        setSaveState(dirtyRef.current ? 'dirty' : 'saved');
      } catch (e) {
        dirtyRef.current = true;
        setSaveState('error');
        if (e instanceof ApiError && (e.status === 409 || e.status === 423)) {
          const server = e.body.character as Character | undefined;
          if (e.status === 423) setLocked(true);
          if (server) setConflict(server);
          setSaveError(e.status === 423 ? 'This sheet was locked elsewhere.' : 'This sheet was changed elsewhere.');
        } else {
          setSaveError(e instanceof Error ? e.message : 'Save failed');
        }
      }
    })();
    savingRef.current = p;
    await p;
    savingRef.current = null;
  }, [charId]);

  // debounced autosave
  useEffect(() => {
    if (saveState !== 'dirty') return;
    const t = setTimeout(save, 700);
    return () => clearTimeout(t);
  }, [data, saveState, save]);

  // warn before leaving with unsaved changes
  useEffect(() => {
    const h = (e: BeforeUnloadEvent) => {
      if (dirtyRef.current) e.preventDefault();
    };
    window.addEventListener('beforeunload', h);
    return () => window.removeEventListener('beforeunload', h);
  }, []);

  const set = useCallback(
    (path: Path, value: unknown) => {
      if (locked || conflict) return;
      setData((d) => (d ? setIn(d, path, value) : d));
      dirtyRef.current = true;
      setSaveState('dirty');
    },
    [locked, conflict],
  );

  const ctx = useMemo(() => (data ? { data, set, locked: locked || !!conflict } : null), [data, set, locked, conflict]);

  async function toggleLock() {
    try {
      if (!locked) await save();
      if (!locked && dirtyRef.current) return; // save failed; don't lock over unsaved work
      const res = await api.setLocked(charId, !locked);
      setLocked(res.locked);
      setMeta((m) => (m ? { ...m, ...res } : m));
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : 'Could not change lock');
    }
  }

  async function remove() {
    if (!meta) return;
    const name = data?.name || 'this crawler';
    if (!confirm(`Delete ${name}? This cannot be undone.`)) return;
    try {
      await api.deleteCharacter(charId);
      navigate('/');
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Delete failed');
    }
  }

  function exportJson() {
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${(data.name || 'crawler').replace(/[^\w-]+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  async function changeOwner(ownerId: number) {
    try {
      const res = await api.setOwner(charId, ownerId);
      setMeta((m) => (m ? { ...m, ...res } : m));
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Could not change owner');
    }
  }

  if (loadError) {
    return (
      <div className="center-page">
        <p className="error">{loadError}</p>
        <Link to="/" className="btn">
          Back to my crawlers
        </Link>
      </div>
    );
  }
  if (!data || !meta || !ctx) return <div className="center-page dim">Loading sheet…</div>;

  const isOther = user && meta.ownerId !== user.id;
  const Tab = tab.el;

  return (
    <SheetCtx.Provider value={ctx}>
      <div className={`sheet ${locked ? 'is-locked' : ''}`}>
        <div className="sheet-bar">
          <div className="sheet-title">
            <Link to="/" className="back" aria-label="Back">
              ←
            </Link>
            <div>
              <h1>{data.name || 'Unnamed crawler'}</h1>
              <div className="dim small">
                {[data.race, data.class, data.level && `Lvl ${data.level}`, data.floor && `Floor ${data.floor}`]
                  .filter(Boolean)
                  .join(' · ') || 'New crawler'}
                {isOther && <span className="owner-tag"> · owned by {meta.ownerName}</span>}
              </div>
            </div>
          </div>
          <div className="sheet-actions">
            <SaveBadge state={locked ? 'locked' : saveState} />
            <button
              type="button"
              className={`btn lock-btn ${locked ? 'locked' : ''}`}
              onClick={toggleLock}
              title={locked ? 'Unlock to edit' : 'Lock to prevent accidental changes'}
            >
              {locked ? <LockIcon /> : <UnlockIcon />}
              {locked ? 'Unlock' : 'Lock'}
            </button>
            <details className="menu">
              <summary className="btn ghost" aria-label="More actions">
                ⋯
              </summary>
              <div className="menu-pop">
                <button type="button" onClick={exportJson}>
                  Export JSON
                </button>
                <button type="button" onClick={() => window.print()}>
                  Print
                </button>
                {user?.isAdmin && users.length > 0 && (
                  <label className="menu-field">
                    <span>Owner</span>
                    <select value={meta.ownerId} onChange={(e) => changeOwner(Number(e.target.value))}>
                      {users.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.username}
                        </option>
                      ))}
                    </select>
                  </label>
                )}
                <button type="button" className="danger" onClick={remove} disabled={locked}>
                  {locked ? 'Unlock to delete' : 'Delete crawler'}
                </button>
              </div>
            </details>
          </div>
        </div>

        {locked && (
          <div className="banner lock-banner">
            <LockIcon /> This sheet is locked. Unlock it to make changes.
          </div>
        )}
        {saveError && (
          <div className="banner error-banner">
            <span>{saveError}</span>
            {conflict && (
              <span className="banner-actions">
                <button type="button" className="btn small" onClick={() => applyServer(conflict)}>
                  Load latest version
                </button>
                {!conflict.locked && (
                  <button
                    type="button"
                    className="btn small ghost"
                    onClick={() => {
                      versionRef.current = conflict.version;
                      setConflict(null);
                      setSaveError('');
                      dirtyRef.current = true;
                      setSaveState('dirty');
                    }}
                  >
                    Keep my changes
                  </button>
                )}
              </span>
            )}
            {!conflict && saveState === 'error' && (
              <button type="button" className="btn small" onClick={save}>
                Retry
              </button>
            )}
          </div>
        )}

        <nav className="tabs" role="tablist">
          {TABS.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={t.id === tab.id}
              className={t.id === tab.id ? 'active' : ''}
              onClick={() => setParams(t.id === 'core' ? {} : { tab: t.id }, { replace: true })}
            >
              {t.label}
            </button>
          ))}
        </nav>

        <div className="tab-panel" role="tabpanel">
          <Tab />
        </div>
      </div>
    </SheetCtx.Provider>
  );
}

function SaveBadge({ state }: { state: SaveState | 'locked' }) {
  const text: Record<string, string> = {
    idle: 'All changes saved',
    saved: 'All changes saved',
    dirty: 'Unsaved…',
    saving: 'Saving…',
    error: 'Not saved',
    locked: 'Locked',
  };
  return <span className={`save-badge s-${state}`}>{text[state]}</span>;
}
