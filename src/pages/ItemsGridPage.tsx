import { useState, useMemo } from 'react';
import { Container } from '@/components/layout/Container';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { ProductCard } from '@/components/commerce/ProductCard';
import { FilterSidebar, applyFilters, type FilterState } from '@/components/commerce/FilterSidebar';
import { SortBar, applySorting, type SortOption, type ViewMode } from '@/components/commerce/SortBar';
import { Pagination } from '@/components/ui/Pagination';
import { useStoreData } from '@/lib/StoreDataContext';
import { useLang } from '@/i18n';

const PAGE_SIZE = 16;

export function ItemsGridPage() {
  const { t } = useLang();
  const { products, breadcrumbs, pageTitle } = useStoreData();

  const [filters, setFilters] = useState<FilterState>(() => {
    const prices = products.map(p => p.price);
    const globalMin = prices.length ? Math.min(...prices) : 0;
    const globalMax = prices.length ? Math.max(...prices) : 10000;
    return { priceMin: globalMin, priceMax: globalMax, brands: [], inStockOnly: false };
  });
  const [sort, setSort] = useState<SortOption>('price-asc');
  const [view, setView] = useState<ViewMode>('grid');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => applyFilters(products, filters), [products, filters]);
  const sorted = useMemo(() => applySorting(filtered, sort), [filtered, sort]);
  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const paged = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleFilterChange = (f: FilterState) => { setFilters(f); setPage(1); };
  const handleSortChange = (s: SortOption) => { setSort(s); setPage(1); };

  const crumbs = breadcrumbs.length > 0
    ? breadcrumbs
    : [{ label: t('breadcrumb.home'), href: '/' }, { label: pageTitle || '' }];

  return (
    <Container className="py-8">
      <Breadcrumbs items={crumbs} className="mb-4" />

      {pageTitle && (
        <div className="border-r-4 border-primary pr-4 mb-8">
          <h1 className="text-3xl font-black text-text-main font-display">{pageTitle}</h1>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-8">
        <FilterSidebar products={products} filters={filters} onChange={handleFilterChange} />

        <div className="flex-1 min-w-0">
          <SortBar
            count={sorted.length}
            sort={sort}
            view={view}
            onSortChange={handleSortChange}
            onViewChange={setView}
          />

          {paged.length > 0 ? (
            <div className={view === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'flex flex-col gap-4'
            }>
              {paged.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <p className="text-center text-text-muted py-16">{t('products.empty')}</p>
          )}

          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </div>
      </div>
    </Container>
  );
}
