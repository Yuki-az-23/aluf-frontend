import { useLang, type Lang } from '@/i18n';
import { cn } from '@/lib/cn';

const languages: { code: Lang; label: string }[] = [
  { code: 'he', label: 'HE' },
  { code: 'en', label: 'EN' },
  { code: 'ru', label: 'RU' },
];

export function LangSwitcher() {
  const { lang, setLang } = useLang();
  return (
    <div className="flex items-center gap-1 text-xs font-bold text-header-text-muted" dir="ltr">
      {languages.map((l, i) => (
        <span key={l.code} className="flex items-center">
          {i > 0 && <span className="text-header-border mx-1">|</span>}
          <button
            onClick={() => setLang(l.code)}
            className={cn(
              'transition hover:text-header-text',
              lang === l.code ? 'text-primary' : '',
            )}
          >
            {l.label}
          </button>
        </span>
      ))}
    </div>
  );
}
