import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { ApiError } from './api';
import { en, type Messages } from '../locales/en';
import { es } from '../locales/es';

export type Lang = 'en' | 'es';
export type MsgKey = keyof Messages;

export const LANGUAGES: { code: Lang; label: string; flag: string }[] = [
  { code: 'en', label: 'English', flag: 'EN' },
  { code: 'es', label: 'Español', flag: 'ES' },
];

const DICTS: Record<Lang, Messages> = { en, es };
const STORAGE_KEY = 'crawler-sheets.lang';

function initialLang(): Lang {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'en' || saved === 'es') return saved;
  } catch {
    /* storage unavailable */
  }
  return navigator.language?.toLowerCase().startsWith('es') ? 'es' : 'en';
}

type I18n = {
  lang: Lang;
  setLang: (l: Lang) => void;
  /** Translate a key, replacing {placeholders} with values. */
  t: (key: MsgKey, vars?: Record<string, string | number>) => string;
  /** Human-readable, translated message for an error thrown by the API client. */
  err: (e: unknown, fallback?: MsgKey) => string;
  locale: string;
};

const Ctx = createContext<I18n | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* storage unavailable */
    }
  }, []);

  const value = useMemo<I18n>(() => {
    const dict = DICTS[lang];
    const t: I18n['t'] = (key, vars) => {
      let s = dict[key] ?? en[key] ?? key;
      if (vars) for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, String(v));
      return s;
    };
    const err: I18n['err'] = (e, fallback = 'err.generic') => {
      if (e instanceof ApiError && e.code) {
        const key = `err.${e.code}` as MsgKey;
        if (key in dict) return t(key);
      }
      return t(fallback);
    };
    return { lang, setLang, t, err, locale: lang === 'es' ? 'es-ES' : 'en-GB' };
  }, [lang, setLang]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useI18n() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useI18n outside I18nProvider');
  return ctx;
}

export function LanguageSwitcher({ className = '' }: { className?: string }) {
  const { lang, setLang, t } = useI18n();
  return (
    <div className={`lang-switch ${className}`} role="group" aria-label={t('lang.label')}>
      {LANGUAGES.map((l) => (
        <button
          key={l.code}
          type="button"
          className={l.code === lang ? 'active' : ''}
          aria-pressed={l.code === lang}
          title={l.label}
          onClick={() => setLang(l.code)}
        >
          {l.flag}
        </button>
      ))}
    </div>
  );
}
