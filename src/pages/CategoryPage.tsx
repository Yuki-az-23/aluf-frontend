import { Container } from '@/components/layout/Container';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { ProductCard } from '@/components/commerce/ProductCard';
import { useStoreData } from '@/lib/StoreDataContext';
import { useLang } from '@/i18n';
import { CATEGORY_DATA, CATEGORY_ALIASES, ICON_MAP } from '@/data/category-data';
import type { KonimboCategory } from '@/lib/konimbo-scraper';

function resolveParentKey(title: string): string | null {
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
  const { categories, products, breadcrumbs, pageTitle } = useStoreData();

  const crumbs = breadcrumbs.length > 0
    ? breadcrumbs
    : [{ label: t('breadcrumb.home'), href: '/' }, { label: pageTitle || '' }];

  const parentKey = resolveParentKey(pageTitle);

  // Leaf page: no matching parent data -> show products grid
  if (!parentKey) {
    return (
      <Container className="py-8">
        <Breadcrumbs items={crumbs} className="mb-4" />

        <div className="flex items-center justify-between mb-6">
          {pageTitle && (
            <h1 className="text-3xl font-black text-text-main">
              {pageTitle}
            </h1>
          )}
          {products.length > 0 && (
            <span className="text-sm text-text-muted">{products.length} מוצרים</span>
          )}
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <p className="text-center text-text-muted py-16">{t('products.empty')}</p>
        )}
      </Container>
    );
  }

  // Parent page: show subcategory grid with images
  const groups = CATEGORY_DATA[parentKey];

  return (
    <Container className="py-8">
      <Breadcrumbs items={crumbs} className="mb-4" />

      {pageTitle && (
        <h1 className="text-3xl font-black text-text-main mb-8 text-right">
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
                  <div className="w-full aspect-square bg-gray-50 rounded-lg flex items-center justify-center p-4 overflow-hidden">
                    {image ? (
                      <img
                        src={image}
                        alt={itemName}
                        className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-300"
                        loading="lazy"
                      />
                    ) : (
                      <span className="text-6xl text-gray-300 group-hover:text-primary transition-colors">📦</span>
                    )}
                  </div>
                  <span className="text-sm font-bold text-text-main group-hover:text-primary transition-colors">
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
