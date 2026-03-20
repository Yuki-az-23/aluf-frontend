import { useState, useEffect, useCallback } from 'react';
import { Container } from '@/components/layout/Container';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Icon } from '@/components/ui/Icon';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ProductCard } from '@/components/commerce/ProductCard';
import { useStoreData } from '@/lib/StoreDataContext';
import { useCart } from '@/lib/CartContext';
import { useLang } from '@/i18n';
import cartSoundUrl from '@/assets/add2cart.mp3';

const cartSound = new Audio(cartSoundUrl);

/** Translate a raw Hebrew warranty string (from Konimbo) into the current language */
function translateWarranty(raw: string, lang: string, t: (k: string) => string): string {
  if (!raw) return raw;
  if (lang === 'he') return raw;
  let result = raw;
  // Years (Hebrew word → translated)
  result = result.replace(/חמש שנים|5 שנים/g, t('warranty.5years'));
  result = result.replace(/ארבע שנים|4 שנים/g, t('warranty.4years'));
  result = result.replace(/שלוש שנים|3 שנים/g, t('warranty.3years'));
  result = result.replace(/שנתיים/g, t('warranty.2years'));
  result = result.replace(/שנה אחת|שנה/g, t('warranty.1year'));
  // Service type
  result = result.replace(/בבית הלקוח/g, t('warranty.onsite'));
  result = result.replace(/החזרה למעבדה|במעבדה/g, t('warranty.depot'));
  return result;
}

export function ItemPage() {
  const { t, dir, lang } = useLang();
  const { itemDetail, breadcrumbs } = useStoreData();
  const { addToCart } = useCart();
  const [activeImage, setActiveImage] = useState(0);
  const [adding, setAdding] = useState(false);
  const [openQa, setOpenQa] = useState<number | null>(null);
  const [specsExpanded, setSpecsExpanded] = useState(false);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [hoverZoom, setHoverZoom] = useState<{ mx: number; my: number; bgX: number; bgY: number } | null>(null);

  const images = itemDetail?.images ?? [];
  const prevImage = useCallback(() => setActiveImage(i => (i - 1 + images.length) % images.length), [images.length]);
  const nextImage = useCallback(() => setActiveImage(i => (i + 1) % images.length), [images.length]);

  const handleImgMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const bgX = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)) * 100;
    const bgY = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height)) * 100;
    setHoverZoom({ mx: e.clientX, my: e.clientY, bgX, bgY });
  }, []);

  useEffect(() => {
    if (!zoomOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setZoomOpen(false);
      if (e.key === 'ArrowLeft') nextImage();
      if (e.key === 'ArrowRight') prevImage();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [zoomOpen, prevImage, nextImage]);

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
    await addToCart(itemDetail.id, 1, {
      title: itemDetail.title,
      price: itemDetail.price,
      image: itemDetail.images[0],
    });
    cartSound.currentTime = 0;
    cartSound.play().catch(() => {});
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
      <Container className="py-6 pb-24 lg:pb-6">
        <Breadcrumbs items={crumbs} className="mb-6" />

        {/* ── TOP SECTION: info panel + image ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12" dir={dir}>

          {/* Info Panel (start side) */}
          <div className="flex flex-col">
            {/* SKU + Badge */}
            <div className="flex items-center gap-3 mb-2">
              {itemDetail.sku && (
                <span className="text-xs text-text-muted">{t('item.skuLabel')} {itemDetail.sku}</span>
              )}
              {discount > 0 && (
                <Badge variant="sale" className="text-xs px-2 py-0.5">{t('item.sale')}</Badge>
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
                    <p className="text-xs text-text-muted mb-0.5">{t('item.vatFreePrice')}</p>
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

              {/* Upgrade options — dev mock only until SKU mapping is implemented */}
              {!!(window as any).__ALUF_DEV_PAGE_TYPE__ && (
                <div className="mt-4 space-y-2">
                  <p className="text-xs font-bold text-text-muted">{t('item.upgrades')}</p>
                  <div className="flex items-center gap-2 text-sm text-text-main bg-card-bg rounded-lg px-3 py-2 border border-border-light">
                    <input type="checkbox" id="upgrade-warranty" className="accent-primary" />
                    <label htmlFor="upgrade-warranty" className="flex-1 cursor-pointer">
                      {t('item.upgradeWarranty')}
                    </label>
                    <span className="font-bold text-primary">+₪199</span>
                  </div>
                </div>
              )}

              {/* Add to cart + Buy now */}
              <div className="grid grid-cols-2 gap-2 mt-5">
                <Button
                  variant="secondary"
                  size="md"
                  className="w-full bg-brand-purple/80 hover:bg-brand-purple text-white border-0"
                  onClick={handleAddToCart}
                  disabled={!itemDetail.inStock || adding}
                >
                  <Icon name="shopping_cart" className="text-base" />
                  {adding ? '...' : t('item.addToCart')}
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  className="w-full bg-primary/80 hover:bg-primary"
                  onClick={handleAddToCart}
                  disabled={!itemDetail.inStock || adding}
                >
                  {t('item.buyNow')}
                </Button>
              </div>

              {/* Warranty badge */}
              {itemDetail.warranty && (
                <div className="mt-4 flex items-center gap-2 text-sm text-text-main bg-card-bg rounded-lg px-3 py-2 border border-border-light">
                  <Icon name="verified_user" className="text-primary text-base flex-shrink-0" />
                  <span className="font-medium">{t('warranty.label')}:</span>
                  <span>{translateWarranty(itemDetail.warranty, lang, t)}</span>
                </div>
              )}

              {/* Trust badges */}
              <div className="flex items-center justify-around mt-4 pt-4 border-t border-border-light text-xs text-text-muted">
                {itemDetail.price >= 500 && (
                  <span className="relative group flex items-center gap-1 cursor-default">
                    <Icon name="local_shipping" className="text-primary text-sm" />
                    {t('stock.freeShipping')}
                    {/* Tooltip */}
                    <span className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gray-800 text-white text-[10px] rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                      {t('item.freeShippingTooltip')}
                    </span>
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Icon name="store" className="text-primary text-sm" />
                  {t('item.readyToShip')}
                </span>
              </div>
            </div>

            {/* Why Aluf? */}
            <div className="rounded-xl border border-border-light p-4 bg-card-bg">
              <p className="font-bold text-sm text-text-main mb-2 flex items-center gap-2">
                <Icon name="verified" className="text-primary text-base" />
                {t('item.whyBuy')}
              </p>
              <ul className="space-y-1.5 text-xs text-text-muted">
                <li className="flex items-center gap-2">
                  <Icon name="check_circle" className="text-green-500 text-xs" />
                  {t('item.trust1')}
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="check_circle" className="text-green-500 text-xs" />
                  {t('item.trust2')}
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="check_circle" className="text-green-500 text-xs" />
                  {t('item.trust3')}
                </li>
              </ul>
            </div>

            {/* Legal disclaimer */}
            <p className="text-[11px] text-text-muted leading-relaxed border-t border-border-light pt-3">
              {t('item.disclaimer')}
            </p>
          </div>

          {/* Image Gallery (end side) */}
          <div>
            {/* Main image — hover to zoom (desktop), tap to lightbox (mobile) */}
            <div
              className="relative aspect-square bg-white rounded-xl overflow-hidden mb-3 border border-border-light md:cursor-crosshair"
              onMouseMove={handleImgMouseMove}
              onMouseLeave={() => setHoverZoom(null)}
              onClick={() => images.length > 0 && setZoomOpen(true)}
            >
              {discount > 0 && (
                <Badge variant="sale" className="absolute top-4 end-4 z-10">
                  -{discount}%
                </Badge>
              )}
              {images.length > 0 ? (
                <img
                  src={images[activeImage] || images[0]}
                  alt={itemDetail.title}
                  className="w-full h-full object-contain p-6 pointer-events-none"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-text-muted">
                  <Icon name="image" className="text-6xl" />
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg border-2 overflow-hidden transition-colors bg-white ${
                      i === activeImage ? 'border-primary' : 'border-border-light hover:border-primary/50'
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
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8" dir={dir}>

          {/* Spec table */}
          <div>
            <h2 className="text-xl font-black text-text-main mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-primary rounded-full inline-block" />
              {t('item.specsAndFaq')}
            </h2>

            {hasSpecRows && (() => {
              const PREVIEW = 5;
              const rows = specsExpanded ? itemDetail.specRows : itemDetail.specRows.slice(0, PREVIEW);
              const hasMore = itemDetail.specRows.length > PREVIEW;
              return (
                <div className="rounded-xl overflow-hidden border border-border-light">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-card-bg border-b border-border-light">
                        <th className="text-start px-4 py-2 font-bold text-text-main" colSpan={2}>
                          {t('item.fullSpecs')}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row, i) => (
                        <tr
                          key={i}
                          className={`border-b border-border-light last:border-0 ${
                            i % 2 === 0 ? 'bg-card-bg' : 'bg-page-bg'
                          }`}
                        >
                          <td className="px-4 py-2.5 font-medium text-text-muted w-1/3 text-start">
                            {row.label}
                          </td>
                          <td className="px-4 py-2.5 text-text-main text-start">{row.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {hasMore && (
                    <button
                      onClick={() => setSpecsExpanded(v => !v)}
                      className="w-full flex items-center justify-center gap-1.5 py-2.5 text-sm font-medium text-primary bg-card-bg border-t border-border-light hover:bg-border-light transition-colors"
                    >
                      <Icon
                        name="expand_more"
                        className={`text-base transition-transform ${specsExpanded ? 'rotate-180' : ''}`}
                      />
                      {specsExpanded
                        ? t('item.specsShowLess')
                        : `${t('item.specsShowAll')} (${itemDetail.specRows.length - PREVIEW})`}
                    </button>
                  )}
                </div>
              );
            })()}

            {hasFlatSpecs && (() => {
              const PREVIEW = 5;
              const specs = specsExpanded ? itemDetail.specs : itemDetail.specs.slice(0, PREVIEW);
              const hasMore = itemDetail.specs.length > PREVIEW;
              return (
                <div className="bg-card-bg rounded-xl border border-border-light overflow-hidden">
                  <ul className="p-4 space-y-2">
                    {specs.map((spec, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-text-main">
                        <Icon name="check" className="text-primary text-xs flex-shrink-0" />
                        {spec}
                      </li>
                    ))}
                  </ul>
                  {hasMore && (
                    <button
                      onClick={() => setSpecsExpanded(v => !v)}
                      className="w-full flex items-center justify-center gap-1.5 py-2.5 text-sm font-medium text-primary border-t border-border-light hover:bg-border-light transition-colors"
                    >
                      <Icon
                        name="expand_more"
                        className={`text-base transition-transform ${specsExpanded ? 'rotate-180' : ''}`}
                      />
                      {specsExpanded
                        ? t('item.specsShowLess')
                        : `${t('item.specsShowAll')} (${itemDetail.specs.length - PREVIEW})`}
                    </button>
                  )}
                </div>
              );
            })()}

            {!hasSpecRows && !hasFlatSpecs && (
              <p className="text-text-muted text-sm">{t('item.noSpecs')}</p>
            )}
          </div>

          {/* שאלות ותשובות — real FAQ from #faq_raw_data_seo */}
          <div>
            <h2 className="text-xl font-black text-text-main mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-primary rounded-full inline-block" />
              {t('item.faq')}
            </h2>
            {itemDetail.faqItems && itemDetail.faqItems.length > 0 ? (
              <div className="space-y-2">
                {itemDetail.faqItems.map((item, i) => (
                  <div key={i} className="border border-border-light rounded-xl overflow-hidden">
                    <button
                      className="w-full flex items-center justify-between px-4 py-3 text-start text-sm font-medium text-text-main bg-card-bg hover:bg-border-light transition-colors"
                      onClick={() => setOpenQa(openQa === i ? null : i)}
                    >
                      <Icon
                        name="expand_more"
                        className={`text-primary transition-transform flex-shrink-0 ${dir === 'rtl' ? 'mr-2' : 'ml-2'} ${openQa === i ? 'rotate-180' : ''}`}
                      />
                      {item.question}
                    </button>
                    {openQa === i && (
                      <div className="px-4 py-3 text-sm text-text-muted border-t border-border-light bg-page-bg text-start">
                        {item.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : itemDetail.descriptionHtml ? (
              <div
                className="text-text-main text-sm leading-relaxed bg-card-bg border border-border-light rounded-xl p-4"
                dangerouslySetInnerHTML={{ __html: itemDetail.descriptionHtml }}
              />
            ) : (
              <p className="text-text-muted text-sm">{t('item.noSpecs')}</p>
            )}
          </div>
        </div>
      </Container>

      {/* ── Related Items ── */}
      {hasRelated && (
        <section className="py-10 bg-card-bg border-t border-border-light mt-8">
          <Container>
            <h2 className="text-2xl font-black text-text-main mb-6 text-start flex items-center gap-3">
              <span className="w-1 h-7 bg-primary rounded-full inline-block" />
              {t('item.related')}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {itemDetail.relatedItems.slice(0, 4).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Mobile sticky buy-now bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-card-bg border-t border-border-light p-3 flex items-center justify-between gap-3 lg:hidden z-40">
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
          {adding ? '...' : t('item.buyNow')}
        </Button>
      </div>

      {/* ── Hover Zoom Panel (desktop only) ── */}
      {hoverZoom && images.length > 0 && (() => {
        const SIZE = 320;
        const OFFSET = 20;
        const vw = typeof window !== 'undefined' ? window.innerWidth : 1200;
        const vh = typeof window !== 'undefined' ? window.innerHeight : 800;
        const left = hoverZoom.mx + OFFSET + SIZE > vw
          ? hoverZoom.mx - SIZE - OFFSET
          : hoverZoom.mx + OFFSET;
        const top = Math.max(8, Math.min(hoverZoom.my - SIZE / 2, vh - SIZE - 8));
        return (
          <div
            className="fixed pointer-events-none z-50 rounded-xl border-2 border-primary shadow-2xl bg-white hidden md:block"
            style={{
              width: SIZE,
              height: SIZE,
              left,
              top,
              backgroundImage: `url(${images[activeImage]})`,
              backgroundSize: '400%',
              backgroundPosition: `${hoverZoom.bgX}% ${hoverZoom.bgY}%`,
              backgroundRepeat: 'no-repeat',
            }}
          />
        );
      })()}

      {/* ── Image Lightbox ── */}
      {zoomOpen && images.length > 0 && (
        <div
          className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center"
          onClick={() => setZoomOpen(false)}
        >
          {/* Close */}
          <button
            className="absolute top-4 end-4 text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors"
            onClick={() => setZoomOpen(false)}
            aria-label="סגור"
          >
            <Icon name="close" className="text-2xl" />
          </button>

          {/* Prev */}
          {images.length > 1 && (
            <button
              className="absolute start-4 top-1/2 -translate-y-1/2 text-white bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors"
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              aria-label="הקודם"
            >
              <Icon name="chevron_right" className="text-2xl" />
            </button>
          )}

          {/* Image */}
          <img
            src={images[activeImage]}
            alt={itemDetail.title}
            className="max-w-[90vw] max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Next */}
          {images.length > 1 && (
            <button
              className="absolute end-4 top-1/2 -translate-y-1/2 text-white bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors"
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              aria-label="הבא"
            >
              <Icon name="chevron_left" className="text-2xl" />
            </button>
          )}

          {/* Dots */}
          {images.length > 1 && (
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setActiveImage(i); }}
                  className={`w-2 h-2 rounded-full transition-colors ${i === activeImage ? 'bg-white' : 'bg-white/40'}`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
