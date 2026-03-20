import { Icon } from '@/components/ui/Icon';
import { useLang } from '@/i18n';
import type { Product } from '@/data/products';

export type SortOption = 'price-asc' | 'price-desc' | 'name';
export type ViewMode = 'grid' | 'list';

interface SortBarProps {
  count: number;
  sort: SortOption;
  view: ViewMode;
  onSortChange: (s: SortOption) => void;
  onViewChange: (v: ViewMode) => void;
  /** Mobile only: called when the filter icon is tapped */
  onFilterClick?: () => void;
  /** How many active filters are set (shows badge on filter button) */
  activeFilterCount?: number;
}

export function SortBar({ count, sort, view, onSortChange, onViewChange, onFilterClick, activeFilterCount = 0 }: SortBarProps) {
  const { t } = useLang();
  return (
    <div className="flex items-center justify-between mb-6 gap-3">
      <p className="text-sm text-text-muted hidden sm:block">
        {t('products.showingPrefix')} <span className="font-bold text-text-main">{count}</span> {t('products.showingSuffix')}
      </p>
      <div className="flex items-center gap-2 flex-1 sm:flex-none justify-between sm:justify-end">
        {/* Filter button — mobile only */}
        {onFilterClick && (
          <button
            type="button"
            onClick={onFilterClick}
            className="md:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border-light text-sm font-semibold text-text-main bg-card-bg shadow-tech relative"
          >
            <Icon name="tune" className="text-primary text-base" />
            {t('filters.title')}
            {activeFilterCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-primary text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        )}
      <div className="flex items-center gap-3 bg-card-bg border border-border-light rounded-xl p-2 shadow-tech">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-text-muted whitespace-nowrap text-xs">{t('sort.label')}:</span>
          <select
            value={sort}
            onChange={e => onSortChange(e.target.value as SortOption)}
            className="border-none focus:ring-0 text-sm font-bold bg-transparent py-0 cursor-pointer text-text-main"
          >
            <option value="price-asc">{t('sort.priceAsc')}</option>
            <option value="price-desc">{t('sort.priceDesc')}</option>
            <option value="name">{t('sort.name')}</option>
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
