import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
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

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(getInitialLang);

  const setLang = useCallback((newLang: Lang) => {
    setLangState(newLang);
    const dir = RTL_LANGS.includes(newLang) ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = newLang;
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
