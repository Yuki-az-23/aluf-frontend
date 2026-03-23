import { useState, useEffect, useRef, useCallback } from 'react';
import { cn } from '@/lib/cn';
import { Icon } from './Icon';
import { useLang } from '@/i18n';

interface Suggestion {
  img_path: string;
  title: string;
  url?: string;
}

interface SearchInputProps {
  className?: string;
}

export function SearchInput({ className }: SearchInputProps) {
  const { t, dir } = useLang();
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

  const navigate = (title: string, directUrl?: string) => {
    setOpen(false);
    setQuery(title);
    // If the autocomplete API returned a direct item URL, go straight to that item.
    // Otherwise fall back to the search results page.
    window.location.href = directUrl || `/search?q=${encodeURIComponent(title)}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const active = activeIndex >= 0 ? suggestions[activeIndex] : null;
    const chosen = active?.title ?? query;
    if (chosen?.trim()) navigate(chosen.trim(), active?.url);
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
          className={`w-full bg-header-bg border border-primary/50 rounded-md py-2.5 placeholder-header-text-muted ring-1 ring-primary/25 hover:ring-2 hover:ring-primary/45 focus:ring-2 focus:ring-primary focus:border-primary transition-all shadow-inner text-sm text-header-text ${dir === 'rtl' ? 'pr-4 pl-12 text-right' : 'pl-4 pr-12 text-left'}`}
        />
        <button type="submit" className={`absolute top-2.5 text-header-text-muted group-focus-within:text-primary ${dir === 'rtl' ? 'left-3' : 'right-3'}`}>
          <Icon name="search" />
        </button>
      </form>

      {open && suggestions.length > 0 && (
        <ul className="absolute top-full mt-1 right-0 left-0 z-50 bg-header-bg border border-header-border rounded-md overflow-hidden shadow-xl max-h-80 overflow-y-auto">
          {suggestions.map((s, i) => (
            <li key={i}>
              <button
                type="button"
                onMouseDown={() => navigate(s.title, s.url)}
                className={cn(
                  `w-full flex items-center gap-3 px-3 py-2 text-sm text-header-text transition-colors ${dir === 'rtl' ? 'text-right' : 'text-left'}`,
                  i === activeIndex ? 'bg-primary/20' : 'hover:bg-black/5 dark:hover:bg-white/10',
                )}
              >
                {s.img_path && (
                  <img
                    src={s.img_path}
                    alt=""
                    width={40}
                    height={40}
                    className="w-10 h-10 object-contain rounded flex-shrink-0 bg-white/5"
                    loading="lazy"
                    decoding="async"
                  />
                )}
                <span className={`flex-1 leading-snug ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{s.title}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
