import { useState } from 'react';
import { Container } from '@/components/layout/Container';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Icon } from '@/components/ui/Icon';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useStoreData } from '@/lib/StoreDataContext';
import { useCart } from '@/lib/CartContext';
import { useLang } from '@/i18n';

export function ItemPage() {
  const { t } = useLang();
  const { itemDetail, breadcrumbs } = useStoreData();
  const { addToCart } = useCart();
  const [activeImage, setActiveImage] = useState(0);
  const [adding, setAdding] = useState(false);

  if (!itemDetail) {
    return (
      <Container className="py-16">
        <p className="text-center text-text-muted">{t('products.empty')}</p>
      </Container>
    );
  }

  const crumbs = breadcrumbs.length > 0
    ? breadcrumbs
    : [{ label: t('breadcrumb.home'), href: '/' }, { label: itemDetail.title }];

  const handleAddToCart = async () => {
    setAdding(true);
    await addToCart(itemDetail.id);
    setAdding(false);
  };

  const discount = itemDetail.originalPrice
    ? Math.round((1 - itemDetail.price / itemDetail.originalPrice) * 100)
    : 0;

  return (
    <>
      <Container className="py-8">
        <Breadcrumbs items={crumbs} className="mb-6" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div>
            <div className="aspect-square bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden mb-4 relative">
              {discount > 0 && (
                <Badge variant="sale" className="absolute top-4 right-4 z-10">
                  -{discount}%
                </Badge>
              )}
              {itemDetail.images.length > 0 && (
                <img
                  src={itemDetail.images[activeImage] || itemDetail.images[0]}
                  alt={itemDetail.title}
                  className="w-full h-full object-contain p-4"
                />
              )}
            </div>
            {itemDetail.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {itemDetail.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden transition-colors ${
                      i === activeImage ? 'border-primary' : 'border-border-light'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-contain p-1" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <h1 className="text-2xl lg:text-3xl font-black text-text-main mb-4">
              {itemDetail.title}
            </h1>

            {/* Price */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl font-black text-brand-purple">
                {t('price.currency')}{itemDetail.price.toLocaleString()}
              </span>
              {itemDetail.originalPrice && (
                <span className="text-lg text-text-muted line-through">
                  {t('price.currency')}{itemDetail.originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2 mb-6">
              {itemDetail.inStock ? (
                <>
                  <Icon name="check_circle" className="text-green-500" />
                  <span className="text-sm font-medium text-green-600">{t('stock.inStock')}</span>
                </>
              ) : (
                <>
                  <Icon name="cancel" className="text-red-500" />
                  <span className="text-sm font-medium text-red-600">{t('item.outOfStock')}</span>
                </>
              )}
              <span className="text-sm text-text-muted mr-4">
                <Icon name="local_shipping" className="text-primary text-sm inline" /> {t('stock.freeShipping')}
              </span>
            </div>

            {/* Add to Cart */}
            <Button
              variant="primary"
              size="lg"
              className="w-full mb-8 text-lg py-4"
              onClick={handleAddToCart}
              disabled={!itemDetail.inStock || adding}
            >
              <Icon name="shopping_cart" className="ml-2" />
              {adding ? '...' : t('item.addToCart')}
            </Button>

            {/* Specs */}
            {itemDetail.specs.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-bold text-text-main mb-3 flex items-center gap-2">
                  <Icon name="settings" className="text-primary" />
                  {t('item.specs')}
                </h2>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                  <ul className="space-y-2">
                    {itemDetail.specs.map((spec, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-text-main">
                        <Icon name="check" className="text-primary text-xs" />
                        {spec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Description */}
            {itemDetail.descriptionHtml && (
              <div className="mb-8">
                <h2 className="text-lg font-bold text-text-main mb-3 flex items-center gap-2">
                  <Icon name="description" className="text-primary" />
                  {t('item.description')}
                </h2>
                <div
                  className="prose prose-sm dark:prose-invert max-w-none text-text-main"
                  dangerouslySetInnerHTML={{ __html: itemDetail.descriptionHtml }}
                />
              </div>
            )}
          </div>
        </div>
      </Container>

      {/* Mobile sticky add-to-cart bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-border-light p-4 flex items-center justify-between gap-4 lg:hidden z-40">
        <div>
          <span className="text-xl font-black text-brand-purple">
            {t('price.currency')}{itemDetail.price.toLocaleString()}
          </span>
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={handleAddToCart}
          disabled={!itemDetail.inStock || adding}
          className="flex-1"
        >
          <Icon name="shopping_cart" className="ml-2" />
          {adding ? '...' : t('item.addToCart')}
        </Button>
      </div>
    </>
  );
}
