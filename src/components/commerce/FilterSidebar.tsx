import { Icon } from '@/components/ui/Icon';
import type { Product } from '@/data/products';
import type { FilterGroup } from '@/lib/konimbo-scraper';
import { useLang } from '@/i18n';

/** Returns true if the given absolute href matches the current page path */
function isActiveFilter(href: string): boolean {
  try {
    return new URL(href).pathname === window.location.pathname;
  } catch {
    return href === window.location.pathname;
  }
}

/** Returns the URL to navigate to when toggling an option:
 *  - if already active → strip the last path segment (deactivate)
 *  - otherwise → navigate to the option href
 */
function toggleFilterHref(href: string): string {
  if (!isActiveFilter(href)) return href;
  // Deactivate: go up one path segment
  try {
    const u = new URL(href);
    const parts = u.pathname.replace(/\/$/, '').split('/');
    parts.pop();
    return u.origin + parts.join('/');
  } catch {
    const parts = href.replace(/\/$/, '').split('/');
    parts.pop();
    return parts.join('/') || '/';
  }
}

export interface FilterState {
  priceMin: number;
  priceMax: number;
  brands: string[];
  inStockOnly: boolean;
  /** Dynamic Konimbo filter groups: key = filter group id, value = selected option values */
  attrs: Record<string, string[]>;
}

interface FilterSidebarProps {
  products: Product[];
  filters: FilterState;
  onChange: (f: FilterState) => void;
  filterGroups?: FilterGroup[];
  /** Mobile: controls visibility of the bottom-sheet drawer */
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function FilterSidebar({ products, filters, onChange, filterGroups = [], mobileOpen = false, onMobileClose }: FilterSidebarProps) {
  const { t, dir } = useLang();
  const allBrands = Array.from(new Set(products.map(p => p.category))).filter(Boolean).sort();
  const prices = products.map(p => p.price);
  const globalMin = prices.length ? Math.min(...prices) : 0;
  const globalMax = prices.length ? Math.max(...prices) : 10000;

  const toggleBrand = (brand: string) => {
    const next = filters.brands.includes(brand)
      ? filters.brands.filter(b => b !== brand)
      : [...filters.brands, brand];
    onChange({ ...filters, brands: next });
  };

  const reset = () => {
    onChange({ priceMin: globalMin, priceMax: globalMax, brands: [], inStockOnly: false, attrs: {} });
    // If URL-based filter groups are present, also navigate to the base category URL
    // (strips Konimbo filter path segments like /300,500/מקלדות,mid)
    if (filterGroups.length > 0) {
      const segments = window.location.pathname.replace(/\/$/, '').split('/').filter(Boolean);
      if (segments.length > 1) {
        window.location.href = window.location.origin + '/' + segments[0];
      }
    }
  };

  /** Shared filter form — used in both desktop sidebar and mobile drawer */
  const filterBody = (
    <>
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-bold text-base text-text-main flex items-center gap-2">
          <Icon name="filter_list" className="text-primary" />
          {t('filters.title')}
        </h2>
        <div className="flex items-center gap-3">
          <button type="button" onClick={reset} className="text-xs text-primary font-bold hover:underline">
            {t('filters.reset')}
          </button>
          {onMobileClose && (
            <button type="button" onClick={onMobileClose} className="md:hidden p-1 -mr-1 text-text-muted hover:text-text-main">
              <Icon name="close" className="text-xl" />
            </button>
          )}
        </div>
      </div>

      {/* Price range */}
      <div className="mb-6">
        <h3 className="font-bold text-sm mb-3">{t('filters.price')}</h3>
        <input
          type="range"
          min={globalMin}
          max={globalMax}
          step={50}
          value={filters.priceMax}
          onChange={e => onChange({ ...filters, priceMax: Number(e.target.value) })}
          className="w-full h-1.5 bg-border-light rounded-lg appearance-none cursor-pointer accent-primary"
        />
        <div className="flex justify-between text-xs text-text-muted mt-2">
          <span>₪{filters.priceMin.toLocaleString()}</span>
          <span>₪{filters.priceMax.toLocaleString()}</span>
        </div>
      </div>

      {/* Konimbo URL-redirect filter groups — clicking navigates to Konimbo's server-filtered URL */}
      {filterGroups.map(group => (
        <div key={group.id} className="mb-6">
          <h3 className="font-bold text-sm mb-3">{group.title}</h3>
          <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
            {group.options.map(option => {
              const active = isActiveFilter(option.href);
              return (
                <a
                  key={option.href}
                  href={toggleFilterHref(option.href)}
                  className={`flex items-center gap-3 px-2 py-1.5 rounded-lg text-sm transition-colors group no-underline ${
                    active
                      ? 'text-primary font-semibold bg-primary/8'
                      : 'text-text-main hover:text-primary hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  <span className={`w-3.5 h-3.5 rounded-full border-2 flex-shrink-0 transition-colors ${
                    active ? 'border-primary bg-primary' : 'border-border-accent group-hover:border-primary'
                  }`} />
                  <span className="flex-1 line-clamp-1">{option.label}</span>
                  {active && <Icon name="close" className="text-xs text-primary/70 flex-shrink-0" />}
                </a>
              );
            })}
          </div>
        </div>
      ))}

      {/* Category checkboxes — shown only when no richer filter groups cover it */}
      {allBrands.length > 0 && filterGroups.length === 0 && (
        <div className="mb-6">
          <h3 className="font-bold text-sm mb-3">{t('filters.category')}</h3>
          <div className="space-y-2.5 max-h-52 overflow-y-auto pr-1">
            {allBrands.map(brand => {
              const count = products.filter(p => p.category === brand).length;
              return (
                <label key={brand} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filters.brands.includes(brand)}
                    onChange={() => toggleBrand(brand)}
                    className="w-4 h-4 rounded border-border-light text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-text-main group-hover:text-primary transition-colors flex-1">{brand}</span>
                  <span className="text-xs text-text-muted">({count})</span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* In stock only — hidden when Konimbo server-side filter groups handle stock */}
      {filterGroups.length === 0 && (
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={e => onChange({ ...filters, inStockOnly: e.target.checked })}
            className="w-4 h-4 rounded border-border-light text-primary focus:ring-primary"
          />
          <span className="text-sm text-text-main">{t('filters.inStock')}</span>
        </label>
      )}
    </>
  );

  return (
    <>
      {/* ── Desktop sidebar — static, always visible ── */}
      <aside className="hidden md:block w-64 flex-shrink-0">
        <div className="bg-card-bg rounded-xl border border-border-light shadow-tech p-5 sticky top-24">
          {filterBody}
        </div>
      </aside>

      {/* ── Mobile bottom-sheet drawer ── */}
      <div
        className={`fixed inset-0 z-50 md:hidden transition-all duration-300 ${mobileOpen ? 'visible' : 'invisible pointer-events-none'}`}
        onClick={onMobileClose}
      >
        {/* Scrim */}
        <div className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${mobileOpen ? 'opacity-100' : 'opacity-0'}`} />

        {/* Sheet */}
        <div
          dir={dir}
          className={`absolute bottom-0 left-0 right-0 bg-card-bg rounded-t-2xl max-h-[85dvh] flex flex-col transition-transform duration-300 ease-out ${mobileOpen ? 'translate-y-0' : 'translate-y-full'}`}
          onClick={e => e.stopPropagation()}
        >
          {/* Drag handle */}
          <div className="w-12 h-1 bg-border-accent rounded-full mx-auto mt-3 mb-0 flex-shrink-0" />
          <div className="overflow-y-auto p-5">
            {filterBody}
          </div>
          {/* Apply button */}
          <div className="p-4 border-t border-border-light flex-shrink-0">
            <button
              type="button"
              onClick={onMobileClose}
              className="w-full bg-primary text-white font-bold py-3 rounded-xl text-sm hover:bg-primary/90 transition-colors"
            >
              {t('filters.apply')}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export function applyFilters(products: Product[], filters: FilterState): Product[] {
  return products.filter(p => {
    if (p.price < filters.priceMin || p.price > filters.priceMax) return false;
    if (filters.brands.length && !filters.brands.includes(p.category)) return false;
    if (filters.inStockOnly && !p.inStock) return false;
    return true;
  });
}
