import { Container } from '@/components/layout/Container';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { ProductCard } from '@/components/commerce/ProductCard';
import { useStoreData } from '@/lib/StoreDataContext';
import { useLang } from '@/i18n';
import { CATEGORY_DATA, CATEGORY_ALIASES, ICON_MAP } from '@/data/category-data';
import type { KonimboCategory } from '@/lib/konimbo-scraper';

function resolveParentKey(title: string): string | null {
  if (!title) return null;
  if (CATEGORY_DATA[title]) return title;
  if (CATEGORY_ALIASES[title] && CATEGORY_DATA[CATEGORY_ALIASES[title]]) return CATEGORY_ALIASES[title];
  // Fuzzy: check if any key is contained in the title or vice-versa
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

export function CategoryPage() {
  const { t } = useLang();
  const { categories, products, breadcrumbs, pageTitle, categoryGroups } = useStoreData();

  const crumbs = breadcrumbs.length > 0
    ? breadcrumbs
    : [{ label: t('breadcrumb.home'), href: '/' }, { label: pageTitle || '' }];

  const parentKey = resolveParentKey(pageTitle);

  // Leaf page: no matching parent data — if we have products show them, otherwise try category sub-grid
  if (!parentKey) {
    // If products loaded, show product grid (normal items page)
    if (products.length > 0) {
      return (
        <Container className="py-8">
          <Breadcrumbs items={crumbs} className="mb-4" />
          <div className="flex items-center justify-between mb-6">
            {pageTitle && (
              <h1 className="text-3xl font-black text-text-main">{pageTitle}</h1>
            )}
            <span className="text-sm text-text-muted">{products.length} מוצרים</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </Container>
      );
    }

    // No products yet — check if we have scraped category groups to show sub-grid
    if (categoryGroups.length > 0) {
      return (
        <Container className="py-8">
          <Breadcrumbs items={crumbs} className="mb-4" />
          {pageTitle && (
            <h1 className="text-3xl font-black text-text-main mb-8 text-right">{pageTitle}</h1>
          )}
          {categoryGroups.map(group => (
            <div key={group.group} className="mb-10">
              <h2 className="text-xl font-bold text-text-main mb-4 text-right border-r-4 border-primary pr-3">
                {group.group}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {group.items.map(item => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="group bg-card-bg rounded-xl p-4 border border-border-light shadow-tech hover:shadow-tech-hover hover:border-primary transition-all duration-300 flex flex-col items-center gap-3 text-center"
                  >
                    <div className="w-16 h-16 flex items-center justify-center rounded-lg bg-white group-hover:bg-primary/10 transition-colors">
                      <span className="material-symbols-rounded text-4xl text-text-muted group-hover:text-primary transition-colors">category</span>
                    </div>
                    <span className="text-sm font-bold text-text-main group-hover:text-primary transition-colors line-clamp-2">
                      {item.title}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          ))}
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

  // Parent category page: show subcategory grid with icons
  const groups = CATEGORY_DATA[parentKey];

  return (
    <Container className="py-8">
      <Breadcrumbs items={crumbs} className="mb-4" />

      {pageTitle && (
        <h1 className="text-3xl font-black text-text-main mb-8 text-right border-r-4 border-primary pr-4">
          {pageTitle}
        </h1>
      )}

      {groups.map(group => (
        <div key={group.group} className="mb-10">
          <h2 className="text-xl font-bold text-text-main mb-4 text-right border-r-4 border-primary pr-3">
            {group.group}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {group.items.map(itemName => {
              const href = findCategoryHref(itemName, categories);
              const image = ICON_MAP[itemName];
              return (
                <a
                  key={itemName}
                  href={href || '#'}
                  className="group bg-card-bg rounded-xl p-4 border border-border-light shadow-tech hover:shadow-tech-hover hover:border-primary transition-all duration-300 flex flex-col items-center gap-4 text-center"
                >
                  <div className="w-full aspect-square bg-white rounded-lg flex items-center justify-center p-3 overflow-hidden group-hover:bg-primary/5 transition-colors">
                    {image ? (
                      <img
                        src={image}
                        alt={itemName}
                        className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-300"
                        loading="lazy"
                      />
                    ) : (
                      /* Fallback: material icon that looks like design ref grey icons */
                      <span className="material-symbols-rounded text-5xl text-text-muted group-hover:text-primary transition-colors">
                        devices
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-bold text-text-main group-hover:text-primary transition-colors leading-tight">
                    {itemName}
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      ))}
    </Container>
  );
}
