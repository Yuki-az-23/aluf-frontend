import { useState } from 'react';
import { Container } from '@/components/layout/Container';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Icon } from '@/components/ui/Icon';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ProductCard } from '@/components/commerce/ProductCard';
import { useStoreData } from '@/lib/StoreDataContext';
import { useCart } from '@/lib/CartContext';
import { useLang } from '@/i18n';

// Q&A items – static Hebrew content (common questions for tech shop)
const QA_ITEMS = [
  {
    q: 'האם המקלדת כוללת עברית?',
    a: 'כן, המקלדת כוללת עברית. ניתן לבחור מקלדת עם עברית בעת ביצוע ההזמנה.',
  },
  {
    q: 'מה כולל האחריות?',
    a: 'המוצר מגיע עם אחריות יבואן רשמי ל-3 שנים בבית הלקוח. האחריות מכסה כשלים בייצור וחומרה.',
  },
  {
    q: 'האם ניתן לשדרג את הזיכרון (RAM) במחשב זה?',
    a: 'ניתן לשדרג זיכרון בדגמים רבים. אנא צרו קשר עם שירות הלקוחות שלנו לבדיקת תאימות לדגם הספציפי.',
  },
];

export function ItemPage() {
  const { t } = useLang();
  const { itemDetail, breadcrumbs } = useStoreData();
  const { addToCart } = useCart();
  const [activeImage, setActiveImage] = useState(0);
  const [adding, setAdding] = useState(false);
  const [openQa, setOpenQa] = useState<number | null>(null);

  if (!itemDetail) {
    return (
      <Container className="py-16">
        <p className="text-center text-text-muted">{t('products.empty')}</p>
      </Container>
    );
  }

  const crumbs =
    breadcrumbs.length > 0
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

  const hasSpecRows = itemDetail.specRows && itemDetail.specRows.length > 0;
  const hasFlatSpecs = !hasSpecRows && itemDetail.specs && itemDetail.specs.length > 0;
  const hasRelated = itemDetail.relatedItems && itemDetail.relatedItems.length > 0;

  return (
    <>
      <Container className="py-6">
        <Breadcrumbs items={crumbs} className="mb-6" />

        {/* ── TOP SECTION: info panel (right) + image (left) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12" dir="rtl">

          {/* Right: Info Panel */}
          <div className="flex flex-col">
            {/* SKU + Badge */}
            <div className="flex items-center gap-3 mb-2">
              {itemDetail.sku && (
                <span className="text-xs text-text-muted">מק"ט: {itemDetail.sku}</span>
              )}
              {discount > 0 && (
                <Badge variant="sale" className="text-xs px-2 py-0.5">מבצע</Badge>
              )}
            </div>

            {/* Title */}
            <h1 className="text-2xl lg:text-3xl font-black text-text-main mb-3 leading-tight">
              {itemDetail.title}
            </h1>

            {/* Short description */}
            {itemDetail.descriptionHtml && (
              <div
                className="text-sm text-text-muted mb-4 line-clamp-3"
                dangerouslySetInnerHTML={{ __html: itemDetail.descriptionHtml }}
              />
            )}

            {/* Price box */}
            <div className="bg-card-bg border border-border-light rounded-xl p-5 mb-5">
              <div className="flex items-start justify-between mb-1">
                <div>
                  {itemDetail.originalPrice && (
                    <p className="text-xs text-text-muted mb-0.5">מחיר בלי מע"מ</p>
                  )}
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-black text-brand-purple">
                      {t('price.currency')}{itemDetail.price.toLocaleString()}
                    </span>
                    {itemDetail.originalPrice && (
                      <span className="text-base text-text-muted line-through">
                        {t('price.currency')}{itemDetail.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
                {itemDetail.originalPrice && (
                  <div className="bg-red-500 text-white text-xs font-bold rounded px-2 py-1">
                    -{discount}%
                  </div>
                )}
              </div>

              {/* Upgrade options — shown as static placeholder when no data */}
              <div className="mt-4 space-y-2">
                <p className="text-xs font-bold text-text-muted">שדרונים למוצר</p>
                <div className="flex items-center gap-2 text-sm text-text-main bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2 border border-border-light">
                  <input type="checkbox" id="upgrade-warranty" className="accent-primary" />
                  <label htmlFor="upgrade-warranty" className="flex-1 cursor-pointer">
                    הארכת אחריות ל-5 שנים
                  </label>
                  <span className="font-bold text-primary">+₪199</span>
                </div>
              </div>

              {/* Add to cart + Buy now */}
              <div className="flex flex-col gap-3 mt-5">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full text-lg py-4 bg-primary hover:bg-primary/90"
                  onClick={handleAddToCart}
                  disabled={!itemDetail.inStock || adding}
                >
                  <Icon name="shopping_cart" className="ml-2" />
                  {adding ? '...' : t('item.addToCart')}
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full text-lg py-4 bg-brand-purple hover:bg-brand-purple/90 text-white border-0"
                  onClick={handleAddToCart}
                  disabled={!itemDetail.inStock || adding}
                >
                  קנה עכשיו
                </Button>
              </div>

              {/* Trust badges */}
              <div className="flex items-center justify-around mt-4 pt-4 border-t border-border-light text-xs text-text-muted">
                <span className="flex items-center gap-1">
                  <Icon name="local_shipping" className="text-primary text-sm" />
                  {t('stock.freeShipping')}
                </span>
                <span className="flex items-center gap-1">
                  <Icon name="store" className="text-primary text-sm" />
                  בכלאי למשלוח מיידי
                </span>
              </div>
            </div>

            {/* Why Aluf? */}
            <div className="rounded-xl border border-border-light p-4 bg-card-bg">
              <p className="font-bold text-sm text-text-main mb-2 flex items-center gap-2">
                <Icon name="verified" className="text-primary text-base" />
                למה לקנות באלוף המחשבים?
              </p>
              <ul className="space-y-1.5 text-xs text-text-muted">
                <li className="flex items-center gap-2">
                  <Icon name="check_circle" className="text-green-500 text-xs" />
                  אחריות יבואן רשמי ל-3 שנים בבית הלקוח
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="check_circle" className="text-green-500 text-xs" />
                  פרוסה רחבה של 24 סניפים בכל הארץ
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="check_circle" className="text-green-500 text-xs" />
                  מעבדות תיקונים מוסמכות בפקום
                </li>
              </ul>
            </div>
          </div>

          {/* Left: Image Gallery */}
          <div>
            <div className="relative aspect-square bg-gray-50 dark:bg-gray-900 rounded-xl overflow-hidden mb-3 border border-border-light">
              {discount > 0 && (
                <Badge variant="sale" className="absolute top-4 right-4 z-10">
                  -{discount}%
                </Badge>
              )}
              {itemDetail.images.length > 0 ? (
                <img
                  src={itemDetail.images[activeImage] || itemDetail.images[0]}
                  alt={itemDetail.title}
                  className="w-full h-full object-contain p-6"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-text-muted">
                  <Icon name="image" className="text-6xl" />
                </div>
              )}
            </div>
            {/* Thumbnails */}
            {itemDetail.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto no-scrollbar justify-end">
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
        </div>

        {/* ── BELOW FOLD: Spec table + Q&A ── */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8" dir="rtl">

          {/* Spec table */}
          <div>
            <h2 className="text-xl font-black text-text-main mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-primary rounded-full inline-block" />
              מפרט טכני ושאלות נפוצות
            </h2>

            {hasSpecRows && (
              <div className="rounded-xl overflow-hidden border border-border-light">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-card-bg border-b border-border-light">
                      <th className="text-right px-4 py-2 font-bold text-text-main" colSpan={2}>
                        מפרט טכני מלא
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {itemDetail.specRows.map((row, i) => (
                      <tr
                        key={i}
                        className={`border-b border-border-light last:border-0 ${
                          i % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800'
                        }`}
                      >
                        <td className="px-4 py-2.5 font-medium text-text-muted w-1/3 text-right">
                          {row.label}
                        </td>
                        <td className="px-4 py-2.5 text-text-main text-right">{row.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {hasFlatSpecs && (
              <div className="bg-card-bg rounded-xl border border-border-light p-4">
                <ul className="space-y-2">
                  {itemDetail.specs.map((spec, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-text-main">
                      <Icon name="check" className="text-primary text-xs flex-shrink-0" />
                      {spec}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {!hasSpecRows && !hasFlatSpecs && (
              <p className="text-text-muted text-sm">מפרט טכני לא זמין</p>
            )}
          </div>

          {/* Q&A Accordion */}
          <div>
            <h2 className="text-xl font-black text-text-main mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-primary rounded-full inline-block" />
              שאלות ותשובות (Q&A)
            </h2>
            <div className="space-y-3">
              {QA_ITEMS.map((item, i) => (
                <div
                  key={i}
                  className="border border-border-light rounded-xl overflow-hidden"
                >
                  <button
                    className="w-full flex items-center justify-between px-4 py-3 text-right text-sm font-medium text-text-main bg-card-bg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    onClick={() => setOpenQa(openQa === i ? null : i)}
                  >
                    <Icon
                      name="expand_more"
                      className={`text-primary transition-transform flex-shrink-0 mr-2 ${
                        openQa === i ? 'rotate-180' : ''
                      }`}
                    />
                    {item.q}
                  </button>
                  {openQa === i && (
                    <div className="px-4 py-3 text-sm text-text-muted border-t border-border-light bg-gray-50 dark:bg-gray-800 text-right">
                      {item.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>

      {/* ── Related Items ── */}
      {hasRelated && (
        <section className="py-10 bg-card-bg border-t border-border-light mt-8">
          <Container>
            <h2 className="text-2xl font-black text-text-main mb-6 text-right flex items-center gap-3">
              <span className="w-1 h-7 bg-primary rounded-full inline-block" />
              לקוחות שקנו מוצר זה קנו גם
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {itemDetail.relatedItems.slice(0, 4).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Mobile sticky add-to-cart bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-border-light p-3 flex items-center justify-between gap-3 lg:hidden z-40">
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
