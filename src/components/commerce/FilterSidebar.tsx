import { Icon } from '@/components/ui/Icon';
import type { Product } from '@/data/products';
import { useLang } from '@/i18n';

export interface FilterState {
  priceMin: number;
  priceMax: number;
  brands: string[];
  inStockOnly: boolean;
}

interface FilterSidebarProps {
  products: Product[];
  filters: FilterState;
  onChange: (f: FilterState) => void;
}

export function FilterSidebar({ products, filters, onChange }: FilterSidebarProps) {
  const { t } = useLang();
  const allBrands = Array.from(new Set(products.map(p => p.category))).sort();
  const prices = products.map(p => p.price);
  const globalMin = prices.length ? Math.min(...prices) : 0;
  const globalMax = prices.length ? Math.max(...prices) : 10000;

  const toggleBrand = (brand: string) => {
    const next = filters.brands.includes(brand)
      ? filters.brands.filter(b => b !== brand)
      : [...filters.brands, brand];
    onChange({ ...filters, brands: next });
  };

  const reset = () => onChange({ priceMin: globalMin, priceMax: globalMax, brands: [], inStockOnly: false });

  return (
    <aside className="w-full md:w-64 flex-shrink-0">
      <div className="bg-card-bg rounded-xl border border-border-light shadow-tech p-5 sticky top-24">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-base text-text-main flex items-center gap-2">
            <Icon name="filter_list" className="text-primary" />
            {t('filters.title')}
          </h2>
          <button type="button" onClick={reset} className="text-xs text-primary font-bold hover:underline">{t('filters.reset')}</button>
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

        {/* Category checkboxes */}
        {allBrands.length > 0 && (
          <div className="mb-6">
            <h3 className="font-bold text-sm mb-3">{t('filters.category')}</h3>
            <div className="space-y-2.5">
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

        {/* In stock only */}
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={e => onChange({ ...filters, inStockOnly: e.target.checked })}
            className="w-4 h-4 rounded border-border-light text-primary focus:ring-primary"
          />
          <span className="text-sm text-text-main">{t('filters.inStock')}</span>
        </label>
      </div>
    </aside>
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
