import { useState, useMemo, useRef, useEffect } from 'react';
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
  const { products, breadcrumbs, pageTitle, categories, filterGroups } = useStoreData();

  const [filters, setFilters] = useState<FilterState>(() => {
    const prices = products.map(p => p.price);
    const globalMin = prices.length ? Math.min(...prices) : 0;
    const globalMax = prices.length ? Math.max(...prices) : 10000;
    return { priceMin: globalMin, priceMax: globalMax, brands: [], inStockOnly: false, attrs: {} };
  });
  const [sort, setSort] = useState<SortOption>('price-asc');
  const [view, setView] = useState<ViewMode>('grid');
  const [filterOpen, setFilterOpen] = useState(false);

  // Extra products fetched from subsequent Konimbo pages
  const [extraProducts, setExtraProducts] = useState<Product[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showCount, setShowCount] = useState(STEP);

  // Track whether a background prefetch is running
  const prefetchCancelRef = useRef(false);

  const allProducts = useMemo(() => [...products, ...extraProducts], [products, extraProducts]);

  // When real scraped products arrive (replacing fallback) or extra pages load, extend priceMax
  useEffect(() => {
    const prices = allProducts.map(p => p.price);
    if (!prices.length) return;
    const newMax = Math.max(...prices);
    setFilters(prev => newMax > prev.priceMax ? { ...prev, priceMax: newMax } : prev);
  }, [allProducts]);

  const filtered = useMemo(() => applyFilters(allProducts, filters), [allProducts, filters]);
  const sorted = useMemo(() => applySorting(filtered, sort), [filtered, sort]);
  const displayed = sorted.slice(0, showCount);
  const hasMoreDisplay = sorted.length > showCount;

  const handleFilterChange = (f: FilterState) => { setFilters(f); setShowCount(STEP); };
  const handleSortChange = (s: SortOption) => { setSort(s); setShowCount(STEP); };

  // Count active filters so the mobile filter button can show a badge
  const activeFilterCount = useMemo(() => {
    let n = 0;
    if (filters.brands.length) n += filters.brands.length;
    if (filters.inStockOnly) n++;
    const prices = allProducts.map(p => p.price);
    const gMax = prices.length ? Math.max(...prices) : 10000;
    if (filters.priceMax < gMax) n++;
    n += Object.values(filters.attrs).filter(v => v.length > 0).length;
    return n;
  }, [filters, allProducts]);

  // On mount: eagerly prefetch ALL remaining Konimbo pages in background.
  // Konimbo lazy-renders products on scroll, but once we take over the UI
  // that scroll never fires — so we fetch all pages up-front via HTTP.
  useEffect(() => {
    const initialNextUrl = getNextPageUrl();
    if (!initialNextUrl) return;

    prefetchCancelRef.current = false;
    setLoadingMore(true);

    async function prefetchAll(startUrl: string) {
      let url: string | null = startUrl;
      const MAX_PAGES = 20; // safety cap
      let page = 0;
      while (url && !prefetchCancelRef.current && page < MAX_PAGES) {
        page++;
        const { products: more, nextUrl } = await fetchMoreProducts(url);
        if (prefetchCancelRef.current) break;
        if (more.length > 0) {
          setExtraProducts(prev => {
            const existingIds = new Set(prev.map(p => p.id));
            const fresh = more.filter(p => !existingIds.has(p.id));
            return fresh.length > 0 ? [...prev, ...fresh] : prev;
          });
        }
        url = nextUrl;
      }
      if (!prefetchCancelRef.current) setLoadingMore(false);
    }

    prefetchAll(initialNextUrl);
    return () => { prefetchCancelRef.current = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // only on mount — getNextPageUrl() reads DOM at that point

  const sentinelRef = useRef<HTMLDivElement>(null);

  // Keep refs so the observer callback always sees current values without stale closures
  const sortedLenRef  = useRef(0);
  const showCountRef  = useRef(STEP);
  sortedLenRef.current  = sorted.length;
  showCountRef.current  = showCount;

  // Set up IntersectionObserver ONCE — no reconnect on every state change
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && sortedLenRef.current > showCountRef.current) {
          setShowCount(c => c + STEP);
        }
      },
      { rootMargin: '400px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // On /search?q=... show the query as the page heading
  const searchQuery = new URLSearchParams(window.location.search).get('q') || '';
  const isSearchPage = /^\/search(\?|$)/.test(window.location.pathname);
  const displayTitle = isSearchPage
    ? (searchQuery ? `${t('search.resultsFor')}: "${searchQuery}"` : t('search.results'))
    : pageTitle;

  const tBreadcrumb = (label: string) => {
    const cat = t('cat.' + label);
    if (cat !== 'cat.' + label) return cat;
    const bc = t('breadcrumb.' + label);
    if (bc !== 'breadcrumb.' + label) return bc;
    return label;
  };

  const crumbs = breadcrumbs.length > 0
    ? breadcrumbs.map(b => ({ ...b, label: tBreadcrumb(b.label) }))
    : [{ label: t('breadcrumb.home'), href: '/' }, { label: displayTitle || '' }];

  return (
    <Container className="py-8">
      <Breadcrumbs items={crumbs} className="mb-4" />

      {displayTitle && (
        <div className="border-s-4 border-primary ps-4 mb-8">
          <h1 className="text-3xl font-black text-text-main font-display">{displayTitle}</h1>
        </div>
      )}

      {products.length === 0 ? (
        <div className="py-8">
          <p className="text-center text-text-muted mb-8 text-lg">{t('products.loading')}</p>
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
          <FilterSidebar
            products={allProducts}
            filters={filters}
            onChange={handleFilterChange}
            filterGroups={filterGroups}
            mobileOpen={filterOpen}
            onMobileClose={() => setFilterOpen(false)}
          />

          <div className="flex-1 min-w-0">
            <SortBar
              count={sorted.length}
              sort={sort}
              view={view}
              onSortChange={handleSortChange}
              onViewChange={setView}
              onFilterClick={() => setFilterOpen(true)}
              activeFilterCount={activeFilterCount}
            />

            {displayed.length > 0 ? (
              <div className={
                view === 'grid'
                  ? 'grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6'
                  : view === 'strip'
                  ? 'grid grid-cols-1 md:grid-cols-2 gap-2'
                  : 'flex flex-col gap-4'
              }>
                {displayed.map(p => (
                  <ProductCard key={p.id} product={p} viewMode={view} />
                ))}
              </div>
            ) : (
              <p className="text-center text-text-muted py-16">{t('products.empty')}</p>
            )}

            {/* Sentinel — always in DOM so the observer never needs to reconnect */}
            <div ref={sentinelRef} className="h-1" />

            {/* Background fetch indicator */}
            {loadingMore && (
              <p className="text-center text-text-muted py-4 text-sm">{t('products.loading')}</p>
            )}

            {/* Manual "load more" fallback for users who disable JS intersection */}
            {hasMoreDisplay && !loadingMore && (
              <div className="flex justify-center mt-4">
                <button
                  onClick={() => setShowCount(c => c + STEP)}
                  className="px-6 py-2.5 rounded-xl border border-primary text-primary font-bold text-sm hover:bg-primary hover:text-white transition-colors"
                >
                  {t('products.loadMore')}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </Container>
  );
}
