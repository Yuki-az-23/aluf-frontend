import { Container } from '@/components/layout/Container';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { ProductCard } from '@/components/commerce/ProductCard';
import { useStoreData } from '@/lib/StoreDataContext';
import { useLang } from '@/i18n';

export function ItemsGridPage() {
  const { t } = useLang();
  const { products, breadcrumbs, pageTitle } = useStoreData();

  const crumbs = breadcrumbs.length > 0
    ? breadcrumbs
    : [{ label: t('breadcrumb.home'), href: '/' }, { label: pageTitle || '' }];

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
