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
    <div
      className="flex items-center gap-0.5 bg-black/5 dark:bg-white/10 rounded-full p-0.5"
      dir="ltr"
      role="group"
      aria-label="Language"
    >
      {languages.map((l) => (
        <button
          key={l.code}
          onClick={() => setLang(l.code)}
          className={cn(
            'px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide transition-all',
            lang === l.code
              ? 'bg-white dark:bg-gray-700 text-primary shadow-sm'
              : 'text-header-text-muted hover:text-header-text',
          )}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
