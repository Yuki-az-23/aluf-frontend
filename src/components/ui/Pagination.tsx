import { cn } from '@/lib/cn';
import { Icon } from './Icon';

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  className?: string;
}

export function Pagination({ page, totalPages, onChange, className }: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPages = (): (number | '...')[] => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages: (number | '...')[] = [1];
    if (page > 3) pages.push('...');
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
    if (page < totalPages - 2) pages.push('...');
    pages.push(totalPages);
    return pages;
  };

  const btnBase = 'w-10 h-10 rounded-lg font-bold text-sm flex items-center justify-center transition-all';
  const btnIdle = 'border border-border-light text-text-muted hover:bg-primary hover:text-white hover:border-primary';
  const btnActive = 'bg-primary text-white border border-primary';

  return (
    <div className={cn('flex justify-center items-center gap-2 mt-10', className)}>
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className={cn(btnBase, btnIdle, 'disabled:opacity-30 disabled:cursor-not-allowed')}
        aria-label="Previous"
      >
        <Icon name="chevron_right" />
      </button>
      {getPages().map((p, i) =>
        p === '...'
          ? <span key={`e${i}`} className="px-2 text-text-muted select-none">...</span>
          : (
            <button
              type="button"
              key={p}
              onClick={() => onChange(p as number)}
              className={cn(btnBase, p === page ? btnActive : btnIdle)}
            >
              {p}
            </button>
          )
      )}
      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className={cn(btnBase, btnIdle, 'disabled:opacity-30 disabled:cursor-not-allowed')}
        aria-label="Next"
      >
        <Icon name="chevron_left" />
      </button>
    </div>
  );
}
