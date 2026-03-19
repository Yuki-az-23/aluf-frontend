import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { Container } from '@/components/layout/Container';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { ProductCard } from '@/components/commerce/ProductCard';
import { FilterSidebar, applyFilters, type FilterState } from '@/components/commerce/FilterSidebar';
import { SortBar, applySorting, type SortOption, type ViewMode } from '@/components/commerce/SortBar';
import { useStoreData } from '@/lib/StoreDataContext';
import { useLang } from '@/i18n';
import { getNextPageUrl, fetchMoreProducts } from '@/lib/konimbo-scraper';
import type { Product } from '@/data/products';

const STEP = 24;

export function ItemsGridPage() {
  const { t } = useLang();
  const { products, breadcrumbs, pageTitle, categories } = useStoreData();

  const [filters, setFilters] = useState<FilterState>(() => {
    const prices = products.map(p => p.price);
    const globalMin = prices.length ? Math.min(...prices) : 0;
    const globalMax = prices.length ? Math.max(...prices) : 10000;
    return { priceMin: globalMin, priceMax: globalMax, brands: [], inStockOnly: false };
  });
  const [sort, setSort] = useState<SortOption>('price-asc');
  const [view, setView] = useState<ViewMode>('grid');

  // Extra products fetched from subsequent Konimbo pages
  const [extraProducts, setExtraProducts] = useState<Product[]>([]);
  const [nextPageUrl, setNextPageUrl] = useState<string | null>(() => getNextPageUrl());
  const [loadingMore, setLoadingMore] = useState(false);
  const [showCount, setShowCount] = useState(STEP);

  const allProducts = useMemo(() => [...products, ...extraProducts], [products, extraProducts]);
  const filtered = useMemo(() => applyFilters(allProducts, filters), [allProducts, filters]);
  const sorted = useMemo(() => applySorting(filtered, sort), [filtered, sort]);
  const displayed = sorted.slice(0, showCount);
  const hasMore = sorted.length > showCount || !!nextPageUrl;

  const handleFilterChange = (f: FilterState) => { setFilters(f); setShowCount(STEP); };
  const handleSortChange = (s: SortOption) => { setSort(s); setShowCount(STEP); };

  const loadMore = useCallback(async () => {
    if (loadingMore) return;
    if (showCount < sorted.length) {
      setShowCount(c => c + STEP);
      return;
    }
    if (!nextPageUrl) return;
    setLoadingMore(true);
    const { products: more, nextUrl } = await fetchMoreProducts(nextPageUrl);
    if (more.length > 0) {
      setExtraProducts(prev => [...prev, ...more]);
      setShowCount(c => c + more.length);
    }
    setNextPageUrl(nextUrl);
    setLoadingMore(false);
  }, [loadingMore, showCount, sorted.length, nextPageUrl]);

  // IntersectionObserver sentinel at bottom of list
  const sentinelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!hasMore) return;
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) loadMore(); },
      { rootMargin: '200px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [hasMore, loadMore]);

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

      {products.length === 0 ? (
        <div className="py-8">
          <p className="text-center text-text-muted mb-8 text-lg">טוען מוצרים...</p>
          {categories.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mt-6">
              {categories.slice(0, 12).map(cat => (
                <a
                  key={cat.href}
                  href={cat.href}
                  className="bg-card-bg border border-border-light rounded-xl p-4 text-center hover:border-primary hover:shadow-tech transition-all text-sm font-medium text-text-main hover:text-primary"
                >
                  {cat.title}
                </a>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-8">
          <FilterSidebar products={allProducts} filters={filters} onChange={handleFilterChange} />

          <div className="flex-1 min-w-0">
            <SortBar
              count={sorted.length}
              sort={sort}
              view={view}
              onSortChange={handleSortChange}
              onViewChange={setView}
            />

            {displayed.length > 0 ? (
              <div className={view === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'flex flex-col gap-4'
              }>
                {displayed.map(p => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            ) : (
              <p className="text-center text-text-muted py-16">{t('products.empty')}</p>
            )}

            {/* Infinite scroll sentinel */}
            {hasMore && <div ref={sentinelRef} className="h-10" />}

            {/* Loading indicator */}
            {loadingMore && (
              <p className="text-center text-text-muted py-4 text-sm">{t('products.loading') || 'טוען...'}</p>
            )}

            {/* Manual load more button as fallback */}
            {hasMore && !loadingMore && (
              <div className="flex justify-center mt-4">
                <button
                  onClick={loadMore}
                  className="px-6 py-2.5 rounded-xl border border-primary text-primary font-bold text-sm hover:bg-primary hover:text-white transition-colors"
                >
                  {t('products.loadMore') || 'טען עוד'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </Container>
  );
}
