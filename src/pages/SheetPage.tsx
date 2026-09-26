import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { api, ApiError, type AdminUser, type Character } from '../lib/api';
import { useAuth } from '../lib/auth';
import { setIn, type SheetData } from '../lib/sheet';
import { derive, loadSheet } from '../lib/rules';
import { SheetCtx, type Path } from '../components/fields';
import { AbilitiesTab, CompanionsTab, CoreTab, GearTab, InventoryTab, SkillsTab } from '../components/SheetTabs';
import { LockIcon, UnlockIcon } from '../components/icons';
import { useI18n, type MsgKey } from '../lib/i18n';
import { useLive } from '../lib/live';
import { PartyToggle } from '../components/LivePanels';

const TABS = [
  { id: 'core', label: 'tab.core', el: CoreTab },
  { id: 'gear', label: 'tab.gear', el: GearTab },
  { id: 'skills', label: 'tab.skills', el: SkillsTab },
  { id: 'inventory', label: 'tab.inventory', el: InventoryTab },
  { id: 'companions', label: 'tab.companions', el: CompanionsTab },
  { id: 'abilities', label: 'tab.abilities', el: AbilitiesTab },
] as const;

type SaveState = 'idle' | 'dirty' | 'saving' | 'saved' | 'error';
/** Either a translation key or an API error to translate at render time (so switching language updates it). */
type ErrState = { key: MsgKey } | { error: unknown } | null;

export default function SheetPage() {
  const { id } = useParams();
  const charId = Number(id);
  const { user } = useAuth();
  const { t, err } = useI18n();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const tab = TABS.find((x) => x.id === params.get('tab')) ?? TABS[0];

  const [meta, setMeta] = useState<Omit<Character, 'data'> | null>(null);
  const [data, setData] = useState<SheetData | null>(null);
  const [locked, setLocked] = useState(false);
  const [loadError, setLoadError] = useState<unknown>(null);
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [saveError, setSaveError] = useState<ErrState>(null);
  const [conflict, setConflict] = useState<Character | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [undo, setUndo] = useState<{ label: string; data: SheetData } | null>(null);

  const versionRef = useRef(0);
  const dirtyRef = useRef(false);
  const savingRef = useRef<Promise<void> | null>(null);
  const dataRef = useRef<SheetData | null>(null);
  dataRef.current = data;

  const applyServer = useCallback((c: Character) => {
    const { data: raw, ...rest } = c;
    setMeta(rest);
    setData(loadSheet(raw));
    setUndo(null);
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
      .catch((e) => setLoadError(e ?? new Error()));
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
        setSaveError(null);
        setSaveState(dirtyRef.current ? 'dirty' : 'saved');
      } catch (e) {
        dirtyRef.current = true;
        setSaveState('error');
        if (e instanceof ApiError && (e.status === 409 || e.status === 423)) {
          const server = e.body.character as Character | undefined;
          if (e.status === 423) setLocked(true);
          if (server) setConflict(server);
          setSaveError({ key: e.status === 423 ? 'sheet.lockedElsewhere' : 'sheet.changedElsewhere' });
        } else {
          setSaveError(e instanceof ApiError ? { error: e } : { key: 'err.saveFailed' });
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
    const timer = setTimeout(save, 700);
    return () => clearTimeout(timer);
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
      setUndo(null);
      dirtyRef.current = true;
      setSaveState('dirty');
    },
    [locked, conflict],
  );

  const update = useCallback(
    (fn: (d: SheetData) => SheetData, undoLabel?: string) => {
      if (locked || conflict) return;
      const prev = dataRef.current;
      if (!prev) return;
      const next = fn(prev);
      if (next === prev) return;
      setData(next);
      setUndo(undoLabel ? { label: undoLabel, data: prev } : null);
      dirtyRef.current = true;
      setSaveState('dirty');
    },
    [locked, conflict],
  );

  // chat and sheet rolls default to this character while its sheet is open
  const { setActiveChar } = useLive();
  const sheetName = data?.name ?? '';
  useEffect(() => {
    if (meta) setActiveChar({ id: charId, name: sheetName || t('dash.unnamed') });
  }, [meta, charId, sheetName, setActiveChar, t]);
  useEffect(() => () => setActiveChar(null), [setActiveChar]);

  const der = useMemo(() => (data ? derive(data) : null), [data]);
  const ctx = useMemo(
    () => (data && der ? { charId, data, der, set, update, locked: locked || !!conflict } : null),
    [charId, data, der, set, update, locked, conflict],
  );

  async function toggleLock() {
    try {
      if (!locked) await save();
      if (!locked && dirtyRef.current) return; // save failed; don't lock over unsaved work
      const res = await api.setLocked(charId, !locked);
      setLocked(res.locked);
      setMeta((m) => (m ? { ...m, ...res } : m));
    } catch (e) {
      setSaveError(e instanceof ApiError ? { error: e } : { key: 'err.lockFailed' });
    }
  }

  async function remove() {
    if (!meta) return;
    const name = data?.name || t('sheet.thisCrawler');
    if (!confirm(t('sheet.deleteConfirm', { name }))) return;
    try {
      await api.deleteCharacter(charId);
      navigate('/');
    } catch (e) {
      alert(err(e, 'err.deleteFailed'));
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
      alert(err(e, 'err.ownerFailed'));
    }
  }

  if (loadError) {
    return (
      <div className="center-page">
        <p className="error">{err(loadError)}</p>
        <Link to="/" className="btn">
          {t('sheet.backToList')}
        </Link>
      </div>
    );
  }
  if (!data || !meta || !ctx) return <div className="center-page dim">{t('sheet.loading')}</div>;

  const isOther = user && meta.ownerId !== user.id;
  const Tab = tab.el;

  return (
    <SheetCtx.Provider value={ctx}>
      <div className={`sheet ${locked ? 'is-locked' : ''}`}>
        <div className="sheet-bar">
          <div className="sheet-title">
            <Link to="/" className="back" aria-label={t('sheet.back')}>
              ←
            </Link>
            <div>
              <h1>{data.name || t('dash.unnamed')}</h1>
              <div className="dim small">
                {[
                  data.race,
                  data.class,
                  data.level && t('dash.lvl', { n: data.level }),
                  data.floor && t('dash.floor', { n: data.floor }),
                ]
                  .filter(Boolean)
                  .join(' · ') || t('sheet.newCrawler')}
                {isOther && <span className="owner-tag"> · {t('sheet.ownedBy', { name: meta.ownerName })}</span>}
              </div>
            </div>
          </div>
          <div className="sheet-actions">
            <SaveBadge state={locked ? 'locked' : saveState} />
            {user?.isAdmin && (
              <PartyToggle
                id={charId}
                inParty={meta.inParty}
                onChange={(inParty) => setMeta((m) => (m ? { ...m, inParty } : m))}
              />
            )}
            <button
              type="button"
              className={`btn lock-btn ${locked ? 'locked' : ''}`}
              onClick={toggleLock}
              title={t(locked ? 'sheet.unlockTitle' : 'sheet.lockTitle')}
            >
              {locked ? <LockIcon /> : <UnlockIcon />}
              {t(locked ? 'sheet.unlock' : 'sheet.lock')}
            </button>
            <details className="menu">
              <summary className="btn ghost" aria-label={t('sheet.more')}>
                ⋯
              </summary>
              <div className="menu-pop">
                <button type="button" onClick={exportJson}>
                  {t('sheet.export')}
                </button>
                <button type="button" onClick={() => window.print()}>
                  {t('sheet.print')}
                </button>
                {user?.isAdmin && users.length > 0 && (
                  <label className="menu-field">
                    <span>{t('sheet.owner')}</span>
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
                  {t(locked ? 'sheet.unlockToDelete' : 'sheet.delete')}
                </button>
              </div>
            </details>
          </div>
        </div>

        {locked && (
          <div className="banner lock-banner">
            <LockIcon /> {t('sheet.lockedBanner')}
          </div>
        )}
        {saveError && (
          <div className="banner error-banner">
            <span>{'key' in saveError ? t(saveError.key) : err(saveError.error)}</span>
            {conflict && (
              <span className="banner-actions">
                <button type="button" className="btn small" onClick={() => applyServer(conflict)}>
                  {t('sheet.loadLatest')}
                </button>
                {!conflict.locked && (
                  <button
                    type="button"
                    className="btn small ghost"
                    onClick={() => {
                      versionRef.current = conflict.version;
                      setConflict(null);
                      setSaveError(null);
                      dirtyRef.current = true;
                      setSaveState('dirty');
                    }}
                  >
                    {t('sheet.keepMine')}
                  </button>
                )}
              </span>
            )}
            {!conflict && saveState === 'error' && (
              <button type="button" className="btn small" onClick={save}>
                {t('sheet.retry')}
              </button>
            )}
          </div>
        )}

        {undo && !locked && (
          <div className="banner undo-banner">
            <span>{undo.label}</span>
            <button
              type="button"
              className="btn small"
              onClick={() => {
                setData(undo.data);
                setUndo(null);
                dirtyRef.current = true;
                setSaveState('dirty');
              }}
            >
              {t('common.undo')}
            </button>
            <button
              type="button"
              className="btn small ghost"
              onClick={() => setUndo(null)}
              aria-label={t('common.close')}
            >
              ×
            </button>
          </div>
        )}

        <nav className="tabs" role="tablist">
          {TABS.map((x) => (
            <button
              key={x.id}
              role="tab"
              aria-selected={x.id === tab.id}
              className={x.id === tab.id ? 'active' : ''}
              onClick={() => setParams(x.id === 'core' ? {} : { tab: x.id }, { replace: true })}
            >
              {t(x.label)}
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
  const { t } = useI18n();
  const key: Record<SaveState | 'locked', MsgKey> = {
    idle: 'save.saved',
    saved: 'save.saved',
    dirty: 'save.dirty',
    saving: 'save.saving',
    error: 'save.error',
    locked: 'save.locked',
  };
  return <span className={`save-badge s-${state}`}>{t(key[state])}</span>;
}
