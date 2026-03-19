import { useState, useEffect, useRef, useCallback } from 'react';
import { cn } from '@/lib/cn';
import { Icon } from './Icon';
import { useLang } from '@/i18n';

interface Suggestion {
  img_path: string;
  title: string;
}

interface SearchInputProps {
  className?: string;
}

export function SearchInput({ className }: SearchInputProps) {
  const { t } = useLang();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchSuggestions = useCallback(async (term: string) => {
    if (term.length < 2) { setSuggestions([]); setOpen(false); return; }
    try {
      const res = await fetch(`/auto_complete?term=${encodeURIComponent(term)}`);
      if (!res.ok) return;
      const data: Suggestion[] = await res.json();
      setSuggestions(data.slice(0, 8));
      setOpen(data.length > 0);
      setActiveIndex(-1);
    } catch {
      setSuggestions([]); setOpen(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(query), 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, fetchSuggestions]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const navigate = (title: string) => {
    setOpen(false);
    setQuery(title);
    window.location.href = `/search?q=${encodeURIComponent(title)}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const chosen = activeIndex >= 0 ? suggestions[activeIndex]?.title : query;
    if (chosen?.trim()) navigate(chosen.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(i => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(i => Math.max(i - 1, -1));
    } else if (e.key === 'Escape') {
      setOpen(false);
      setActiveIndex(-1);
    }
  };

  return (
    <div ref={wrapperRef} className={cn('relative group', className)}>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={query}
          onChange={e => { setQuery(e.target.value); }}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={t('header.search')}
          autoComplete="off"
          className="w-full bg-slate-800 border border-gray-600 rounded-md py-2.5 pr-4 pl-12 text-white placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary transition-all shadow-inner text-sm text-right"
        />
        <button type="submit" className="absolute left-3 top-2.5 text-gray-400 group-focus-within:text-primary">
          <Icon name="search" />
        </button>
      </form>

      {open && suggestions.length > 0 && (
        <ul className="absolute top-full mt-1 right-0 left-0 z-50 bg-slate-800 border border-gray-600 rounded-md overflow-hidden shadow-xl max-h-80 overflow-y-auto">
          {suggestions.map((s, i) => (
            <li key={i}>
              <button
                type="button"
                onMouseDown={() => navigate(s.title)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2 text-right text-sm text-white transition-colors',
                  i === activeIndex ? 'bg-primary/20' : 'hover:bg-white/10',
                )}
              >
                {s.img_path && (
                  <img
                    src={s.img_path}
                    alt=""
                    className="w-10 h-10 object-contain rounded flex-shrink-0 bg-white/5"
                    loading="lazy"
                  />
                )}
                <span className="flex-1 text-right leading-snug">{s.title}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
