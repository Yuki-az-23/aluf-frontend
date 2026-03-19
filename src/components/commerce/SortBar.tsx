import { Icon } from '@/components/ui/Icon';
import type { Product } from '@/data/products';

export type SortOption = 'price-asc' | 'price-desc' | 'name';
export type ViewMode = 'grid' | 'list';

interface SortBarProps {
  count: number;
  sort: SortOption;
  view: ViewMode;
  onSortChange: (s: SortOption) => void;
  onViewChange: (v: ViewMode) => void;
}

export function SortBar({ count, sort, view, onSortChange, onViewChange }: SortBarProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
      <p className="text-sm text-text-muted">
        מציג <span className="font-bold text-text-main">{count}</span> מוצרים
      </p>
      <div className="flex items-center gap-3 bg-card-bg border border-border-light rounded-xl p-2 shadow-tech">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-text-muted whitespace-nowrap text-xs">מיון:</span>
          <select
            value={sort}
            onChange={e => onSortChange(e.target.value as SortOption)}
            className="border-none focus:ring-0 text-sm font-bold bg-transparent py-0 cursor-pointer text-text-main"
          >
            <option value="price-asc">מחיר (נמוך לגבוה)</option>
            <option value="price-desc">מחיר (גבוה לנמוך)</option>
            <option value="name">שם</option>
          </select>
        </div>
        <div className="h-5 w-px bg-border-light" />
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onViewChange('grid')}
            className={`p-1.5 rounded transition-colors ${view === 'grid' ? 'text-primary bg-primary/10' : 'text-text-muted hover:text-primary'}`}
          >
            <Icon name="grid_view" className="text-xl" />
          </button>
          <button
            type="button"
            onClick={() => onViewChange('list')}
            className={`p-1.5 rounded transition-colors ${view === 'list' ? 'text-primary bg-primary/10' : 'text-text-muted hover:text-primary'}`}
          >
            <Icon name="view_list" className="text-xl" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function applySorting(products: Product[], sort: SortOption): Product[] {
  return [...products].sort((a, b) => {
    if (sort === 'price-asc') return a.price - b.price;
    if (sort === 'price-desc') return b.price - a.price;
    if (sort === 'name') return a.title.localeCompare(b.title, 'he');
    return 0;
  });
}
