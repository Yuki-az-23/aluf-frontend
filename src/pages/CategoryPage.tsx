import { useState, useMemo } from 'react';
import { Container } from '@/components/layout/Container';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { ProductCard } from '@/components/commerce/ProductCard';
import { FilterSidebar, applyFilters, type FilterState } from '@/components/commerce/FilterSidebar';
import { SortBar, applySorting, type SortOption, type ViewMode } from '@/components/commerce/SortBar';
import { useStoreData } from '@/lib/StoreDataContext';
import { useLang } from '@/i18n';
import { CATEGORY_DATA, CATEGORY_ALIASES, ICON_MAP } from '@/data/category-data';
import type { KonimboCategory } from '@/lib/konimbo-scraper';

function resolveParentKey(title: string): string | null {
  if (!title) return null;
  if (CATEGORY_DATA[title]) return title;
  if (CATEGORY_ALIASES[title] && CATEGORY_DATA[CATEGORY_ALIASES[title]]) return CATEGORY_ALIASES[title];
  for (const key of Object.keys(CATEGORY_DATA)) {
    if (title.includes(key) || key.includes(title)) return key;
  }
  return null;
}

function findCategoryHref(name: string, categories: KonimboCategory[]): string | undefined {
  for (const cat of categories) {
    if (cat.title === name || cat.title.includes(name) || name.includes(cat.title)) {
      return cat.href;
    }
  }
  return undefined;
}

// Single responsive grid used for all category icon layouts.
// Items from consecutive groups flow into the same rows — no empty column gaps.
const FLAT_GRID = 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4';

// Tiny group-name badge shown on the first item of each group.
function GroupBadge({ name }: { name: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs font-bold text-primary">
      <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
      {name}
    </span>
  );
}

export function CategoryPage() {
  const { t } = useLang();
  const { categories, products, breadcrumbs, pageTitle, categoryGroups, filterGroups } = useStoreData();

  // ── Filter / sort / view state — hooks must be top-level (before any early returns) ──
  const [filters, setFilters] = useState<FilterState>(() => {
    const prices = products.map(p => p.price);
    return {
      priceMin: prices.length ? Math.min(...prices) : 0,
      priceMax: prices.length ? Math.max(...prices) : 10000,
      brands: [],
      inStockOnly: false,
      attrs: {},
    };
  });
  const [sort, setSort] = useState<SortOption>('price-asc');
  const [view, setView] = useState<ViewMode>('grid');
  const [filterOpen, setFilterOpen] = useState(false);

  const filtered = useMemo(() => applyFilters(products, filters), [products, filters]);
  const sorted = useMemo(() => applySorting(filtered, sort), [filtered, sort]);

  const activeFilterCount = useMemo(() => {
    let n = 0;
    if (filters.brands.length) n += filters.brands.length;
    if (filters.inStockOnly) n++;
    const prices = products.map(p => p.price);
    const gMax = prices.length ? Math.max(...prices) : 10000;
    if (filters.priceMax < gMax) n++;
    n += Object.values(filters.attrs).filter(v => v.length > 0).length;
    return n;
  }, [filters, products]);

  const handleFilterChange = (f: FilterState) => setFilters(f);
  const handleSortChange = (s: SortOption) => setSort(s);

  // ── Routing ──
  const crumbs = breadcrumbs.length > 0
    ? breadcrumbs
    : [{ label: t('breadcrumb.home'), href: '/' }, { label: pageTitle || '' }];

  const parentKey = resolveParentKey(pageTitle);

  // Leaf page: no matching parent data
  if (!parentKey) {
    // Products available → show filterable/sortable grid
    if (products.length > 0) {
      return (
        <Container className="py-8">
          <Breadcrumbs items={crumbs} className="mb-4" />

          {pageTitle && (
            <div className="border-r-4 border-primary pr-4 mb-6">
              <h1 className="text-3xl font-black text-text-main">{pageTitle}</h1>
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-8">
            <FilterSidebar
              products={products}
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

              {sorted.length > 0 ? (
                <div className={
                  view === 'grid'
                    ? 'grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6'
                    : view === 'strip'
                    ? 'grid grid-cols-1 md:grid-cols-2 gap-2'
                    : 'flex flex-col gap-4'
                }>
                  {sorted.map(p => (
                    <ProductCard key={p.id} product={p} viewMode={view} />
                  ))}
                </div>
              ) : (
                <p className="text-center text-text-muted py-16">{t('products.empty')}</p>
              )}
            </div>
          </div>
        </Container>
      );
    }

    // No products yet — show scraped subcategory groups in one flat grid
    if (categoryGroups.length > 0) {
      const flatItems = categoryGroups.flatMap(g =>
        g.items.map((item, idx) => ({ item, groupName: g.group, isFirst: idx === 0 }))
      );

      return (
        <Container className="py-8">
          <Breadcrumbs items={crumbs} className="mb-4" />
          {pageTitle && (
            <h1 className="text-3xl font-black text-text-main mb-8 text-right">{pageTitle}</h1>
          )}
          <div className={FLAT_GRID}>
            {flatItems.map(({ item, groupName, isFirst }) => (
              <a
                key={item.href}
                href={item.href}
                className="group bg-card-bg rounded-xl border border-border-light shadow-tech hover:shadow-tech-hover hover:border-primary transition-all duration-300 flex flex-col text-center overflow-hidden"
              >
                {/* Group label row — always rendered for consistent card height */}
                <div className="px-3 pt-2 min-h-[22px] flex items-center justify-end">
                  {isFirst && <GroupBadge name={groupName} />}
                </div>
                <div className="flex-1 flex items-center justify-center p-3">
                  <span className="material-symbols-rounded text-5xl text-text-muted group-hover:text-primary transition-colors">category</span>
                </div>
                <div className="px-3 pb-3">
                  <span className="text-sm font-bold text-text-main group-hover:text-primary transition-colors leading-tight line-clamp-2 block">
                    {item.title}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </Container>
      );
    }

    // Fallback empty state
    return (
      <Container className="py-8">
        <Breadcrumbs items={crumbs} className="mb-4" />
        {pageTitle && (
          <h1 className="text-3xl font-black text-text-main mb-6 text-right">{pageTitle}</h1>
        )}
        <p className="text-center text-text-muted py-16">{t('products.empty')}</p>
      </Container>
    );
  }

  // Parent category page: show subcategory grid with icons — flat grid, groups flow into same rows
  const groups = CATEGORY_DATA[parentKey];
  const flatItems = groups.flatMap(g =>
    g.items.map((itemName, idx) => ({
      itemName,
      groupName: g.group,
      isFirst: idx === 0,
      href: findCategoryHref(itemName, categories) || '#',
      image: ICON_MAP[itemName],
    }))
  );

  return (
    <Container className="py-8">
      <Breadcrumbs items={crumbs} className="mb-4" />

      {pageTitle && (
        <h1 className="text-3xl font-black text-text-main mb-8 text-right border-r-4 border-primary pr-4">
          {pageTitle}
        </h1>
      )}

      <div className={FLAT_GRID}>
        {flatItems.map(({ itemName, groupName, isFirst, href, image }) => (
          <a
            key={itemName}
            href={href}
            className="group bg-card-bg rounded-xl border border-border-light shadow-tech hover:shadow-tech-hover hover:border-primary transition-all duration-300 flex flex-col text-center overflow-hidden"
          >
            {/* Group label row — always rendered for consistent card height */}
            <div className="px-3 pt-2 min-h-[22px] flex items-center justify-end">
              {isFirst && <GroupBadge name={groupName} />}
            </div>
            <div className="w-full aspect-square flex items-center justify-center p-3 bg-white group-hover:bg-primary/5 transition-colors overflow-hidden">
              {image ? (
                <img
                  src={image}
                  alt={itemName}
                  className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-300"
                  loading="lazy"
                />
              ) : (
                <span className="material-symbols-rounded text-5xl text-text-muted group-hover:text-primary transition-colors">
                  devices
                </span>
              )}
            </div>
            <div className="px-3 py-2">
              <span className="text-sm font-bold text-text-main group-hover:text-primary transition-colors leading-tight block">
                {itemName}
              </span>
            </div>
          </a>
        ))}
      </div>
    </Container>
  );
}
