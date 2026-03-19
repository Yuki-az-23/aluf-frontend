import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import he from './he.json';
import en from './en.json';
import ru from './ru.json';

export type Lang = 'he' | 'en' | 'ru';

const locales: Record<Lang, Record<string, string>> = { he, en, ru };
const RTL_LANGS: Lang[] = ['he'];

interface LangContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
  dir: 'rtl' | 'ltr';
}

export const LangContext = createContext<LangContextValue | null>(null);

function getInitialLang(): Lang {
  try {
    const stored = localStorage.getItem('aluf-lang');
    if (stored === 'he' || stored === 'en' || stored === 'ru') return stored;
  } catch {}
  return 'he';
}

/** Apply direction to both <html> and #aluf-root */
function applyDirection(lang: Lang) {
  const dir = RTL_LANGS.includes(lang) ? 'rtl' : 'ltr';
  document.documentElement.dir = dir;
  document.documentElement.lang = lang;
  // Also apply to #aluf-root since its CSS uses `all: initial` which resets inherited direction
  const root = document.getElementById('aluf-root');
  if (root) {
    root.dir = dir;
    root.style.direction = dir;
  }
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(getInitialLang);

  // Apply direction on initial mount
  useEffect(() => {
    applyDirection(lang);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const setLang = useCallback((newLang: Lang) => {
    setLangState(newLang);
    applyDirection(newLang);
    try { localStorage.setItem('aluf-lang', newLang); } catch {}
  }, []);

  const t = useCallback((key: string): string => {
    return locales[lang]?.[key] || locales.he[key] || key;
  }, [lang]);

  const dir = RTL_LANGS.includes(lang) ? 'rtl' : 'ltr';

  return (
    <LangContext.Provider value={{ lang, setLang, t, dir }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be used within LangProvider');
  return ctx;
}
