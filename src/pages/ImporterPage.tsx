import { useState } from 'react';
import { api, type ImportResult, type ImportSection, type ImportStatus } from '../lib/api';
import { useI18n, type MsgKey } from '../lib/i18n';
import { FORMAT_DOC_URL, IMPORT_TEMPLATE, ImportFileError, extractImport } from '../lib/importFile';

const SECTIONS: ImportSection[] = ['achievements', 'quests', 'npcs', 'bookNpcs', 'stash'];
const STATUS_ORDER: ImportStatus[] = ['added', 'exists', 'unknown', 'invalid'];

/**
 * GM: load prep (achievements, quests, stat blocks, book stat blocks, loot for the stash) from a JSON file, an HTML
 * file carrying the data, or pasted JSON. Shows what would be added first (a dry run), then imports.
 */
export default function ImporterPage() {
  const { t, err } = useI18n();
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [source, setSource] = useState('');
  const [preview, setPreview] = useState<ImportResult | null>(null);
  const [done, setDone] = useState<ImportResult | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [paste, setPaste] = useState('');
  const [drag, setDrag] = useState(false);

  const fail = (e: unknown) => setError(e instanceof ImportFileError ? t(`importer.err.${e.code}` as MsgKey) : err(e));

  async function load(text: string, from: string) {
    setError('');
    setDone(null);
    setPreview(null);
    setData(null);
    setBusy(true);
    try {
      const d = extractImport(text);
      const r = await api.importSession(d, true);
      setData(d);
      setSource(from);
      setPreview(r);
    } catch (e) {
      fail(e);
    } finally {
      setBusy(false);
    }
  }
  async function loadFile(file: File | undefined) {
    if (file) await load(await file.text(), file.name);
  }
  async function run() {
    if (!data) return;
    setBusy(true);
    setError('');
    try {
      setDone(await api.importSession(data));
      setPreview(null);
      setData(null);
      setPaste('');
    } catch (e) {
      fail(e);
    } finally {
      setBusy(false);
    }
  }
  const downloadTemplate = () => {
    const blob = new Blob([JSON.stringify(IMPORT_TEMPLATE, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'plantilla-importacion.json';
    a.click();
    URL.revokeObjectURL(a.href);
  };
  const toAdd = preview ? SECTIONS.reduce((n, s) => n + (preview.counts[s].added ?? 0), 0) : 0;

  return (
    <div className="page importer-page">
      <div className="page-head">
        <div>
          <h1>{t('importer.title')}</h1>
          <p className="dim">{t('importer.sub')}</p>
        </div>
        <div className="page-actions">
          <button type="button" className="btn small ghost" onClick={downloadTemplate}>
            ⬇ {t('importer.template')}
          </button>
          <a className="btn small ghost" href={FORMAT_DOC_URL} target="_blank" rel="noreferrer">
            📄 {t('importer.format')}
          </a>
        </div>
      </div>

      <section className="card">
        <div className="card-body importer-input">
          <label
            className={`drop-zone ${drag ? 'over' : ''} ${busy ? 'busy' : ''}`}
            onDragOver={(e) => {
              e.preventDefault();
              setDrag(true);
            }}
            onDragLeave={() => setDrag(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDrag(false);
              loadFile(e.dataTransfer.files?.[0]);
            }}
          >
            <span className="drop-icon" aria-hidden>
              📥
            </span>
            <strong>{busy ? t('common.loading') : t('importer.drop')}</strong>
            <span className="dim small">{t('importer.dropHint')}</span>
            <input
              type="file"
              accept=".json,.html,.htm,application/json,text/html"
              hidden
              disabled={busy}
              onChange={(e) => {
                loadFile(e.target.files?.[0]);
                e.target.value = '';
              }}
            />
          </label>
          <details className="importer-paste">
            <summary>{t('importer.paste')}</summary>
            <textarea
              className="in area mono"
              rows={8}
              value={paste}
              placeholder='{ "format": "dcc-crawler-sheets/import", "version": 1, … }'
              onChange={(e) => setPaste(e.target.value)}
            />
            <button
              type="button"
              className="btn small"
              disabled={!paste.trim() || busy}
              onClick={() => load(paste, t('importer.pasted'))}
            >
              {t('importer.check')}
            </button>
          </details>
          {error && <p className="error">{error}</p>}
        </div>
      </section>

      {preview && (
        <section className="card importer-preview">
          <header className="card-head">
            <h2>{preview.title || source}</h2>
            <span className="dim small">{t('importer.previewOf', { file: source })}</span>
          </header>
          <div className="card-body">
            <Report r={preview} preview />
            <div className="modal-actions">
              <button
                type="button"
                className="btn ghost"
                onClick={() => {
                  setPreview(null);
                  setData(null);
                }}
              >
                {t('common.cancel')}
              </button>
              <button type="button" className="btn primary" disabled={busy || toAdd === 0} onClick={run}>
                {toAdd ? t('importer.run', { n: toAdd }) : t('importer.nothingNew')}
              </button>
            </div>
          </div>
        </section>
      )}

      {done && (
        <section className="card importer-done">
          <header className="card-head">
            <h2>✓ {t('importer.done', { title: done.title || source })}</h2>
          </header>
          <div className="card-body">
            <Report r={done} />
            <p className="dim small">{t('importer.doneHint')}</p>
          </div>
        </section>
      )}
    </div>
  );
}

function Report({ r, preview }: { r: ImportResult; preview?: boolean }) {
  const { t } = useI18n();
  const sections = SECTIONS.filter((s) => r.report[s].length);
  return (
    <div className="import-report">
      {sections.map((s) => (
        <div key={s} className="import-section">
          <h3>
            {t(`importer.sec.${s}` as MsgKey)}{' '}
            <span className="dim small">
              {STATUS_ORDER.filter((st) => r.counts[s][st])
                .map((st) => t(`importer.count.${st}${preview ? 'P' : ''}` as MsgKey, { n: r.counts[s][st]! }))
                .join(' · ')}
            </span>
          </h3>
          <ul>
            {r.report[s].map((e, i) => (
              <li key={i} className={`imp-${e.status}`}>
                <span className={`pill tiny-pill imp-pill imp-${e.status}`}>
                  {t(`importer.st.${e.status}${preview && e.status === 'added' ? 'P' : ''}` as MsgKey)}
                </span>{' '}
                {e.name || <span className="dim">{t('importer.noName')}</span>}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
