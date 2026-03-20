import { cn } from '@/lib/cn';
import { Icon } from '@/components/ui/Icon';
import { Badge } from '@/components/ui/Badge';
import { useLang } from '@/i18n';
import { useCart } from '@/lib/CartContext';
import type { Product } from '@/data/products';
import type { ViewMode } from './SortBar';
import cartSoundUrl from '@/assets/add2cart.mp3';

interface ProductCardProps {
  product: Product;
  className?: string;
  viewMode?: ViewMode;
}

const cartSound = new Audio(cartSoundUrl);

export function ProductCard({ product, className, viewMode = 'grid' }: ProductCardProps) {
  const { t } = useLang();
  const { addToCart } = useCart();

  const doAddToCart = () => {
    addToCart(product.id, 1, {
      title: product.title,
      price: product.price,
      image: product.image,
      category: product.category,
    });
    cartSound.currentTime = 0;
    cartSound.play().catch(() => {});
  };

  // ── Strip view ─────────────────────────────────────────────────────────────
  // Layout (RTL Hebrew): image on visual-right, text fills left, cart+price at bottom-left
  if (viewMode === 'strip') {
    return (
      <div className={cn(
        'bg-card-bg rounded-xl border border-border-light flex flex-row items-stretch overflow-hidden',
        'hover:shadow-tech-hover hover:border-primary transition-all group',
        className,
      )}>
        {/*
         * Image — DOM first element.
         * In RTL flex-row, the first DOM child appears on the visual RIGHT. ✓
         * In LTR flex-row, it appears on the visual LEFT (natural).
         */}
        <a
          href={product.href || '#'}
          className="relative flex-shrink-0 w-[88px] h-[88px] bg-white flex items-center justify-center overflow-hidden"
        >
          {/* Category label — overlaid at the top of the image */}
          {product.category && (
            <span className="absolute top-0 inset-x-0 z-10 bg-black/40 text-white text-[9px] font-semibold px-1 py-0.5 truncate text-center leading-tight">
              {product.category}
            </span>
          )}
          {product.originalPrice && (
            <Badge variant="sale" className="absolute bottom-1 start-1 z-10 text-[8px] px-1 py-0 leading-tight">
              {t('item.sale')}
            </Badge>
          )}
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={e => {
              const el = e.currentTarget;
              el.style.display = 'none';
              const parent = el.parentElement;
              if (parent && !parent.querySelector('.img-fallback')) {
                const fb = document.createElement('div');
                fb.className = 'img-fallback w-full h-full flex items-center justify-center text-text-muted';
                fb.innerHTML = '<span class="material-symbols-outlined text-4xl">image</span>';
                parent.appendChild(fb);
              }
            }}
          />
        </a>

        {/*
         * Text area — DOM second element = visual LEFT in RTL flex-row. ✓
         * Bottom row: [Price][CartBtn] in DOM.
         *   RTL flex reverses display → visual: [CartBtn (far-left)][Price] ✓
         */}
        <div className="flex-1 flex flex-col justify-between p-2.5 min-w-0">
          {/* Top: title only (category is on the image) */}
          <div className="min-w-0">
            <a href={product.href || '#'}>
              <h3 className="font-bold text-xs leading-tight line-clamp-3 text-text-main group-hover:text-primary transition-colors">
                {product.title}
              </h3>
            </a>
          </div>

          {/* Bottom: price + add-to-cart — in RTL flex: [CartBtn (far-left)][Price] */}
          <div className="flex items-center gap-2 justify-end mt-1">
            {/* Price — DOM first → visual RIGHT in RTL (next to cart) */}
            {product.price > 0 && (
              <div className="min-w-0">
                {product.originalPrice && (
                  <span className="text-[9px] text-text-muted line-through leading-none block">
                    {t('price.currency')}{product.originalPrice.toLocaleString()}
                  </span>
                )}
                <span className="font-black text-sm text-brand-purple leading-tight">
                  {t('price.currency')}{product.price.toLocaleString()}
                </span>
              </div>
            )}
            {/* Cart button — DOM second → visual LEFT in RTL (far left) */}
            <button
              type="button"
              onClick={doAddToCart}
              className="flex-shrink-0 bg-primary text-white p-1.5 rounded-lg hover:bg-primary/90 transition-colors"
              aria-label={t('products.addToCart')}
            >
              <Icon name="add_shopping_cart" className="text-sm" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Grid view (default) ────────────────────────────────────────────────────
  return (
    <div className={cn(
      'bg-card-bg rounded-xl border border-border-light p-4 hover:shadow-tech-hover hover:border-primary transition-all group flex flex-col',
      className,
    )}>
      <div className="block relative mb-4">
        {product.originalPrice && (
          <Badge variant="sale" className="absolute top-2 left-3 z-10">{t('item.sale')}</Badge>
        )}
        <div className="aspect-square bg-white rounded-lg overflow-hidden relative">
          <a href={product.href || '#'} className="block w-full h-full">
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 p-4"
              loading="lazy"
              onError={e => {
                const el = e.currentTarget;
                el.style.display = 'none';
                const parent = el.parentElement;
                if (parent && !parent.querySelector('.img-fallback')) {
                  const fb = document.createElement('div');
                  fb.className = 'img-fallback w-full h-full flex items-center justify-center text-text-muted';
                  fb.innerHTML = '<span class="material-symbols-outlined text-6xl">image</span>';
                  parent.appendChild(fb);
                }
              }}
            />
          </a>
          {/* Add-to-cart overlay: always visible on mobile, hover-only on desktop */}
          <button
            type="button"
            onClick={doAddToCart}
            className="absolute top-2 right-2 bg-primary text-white p-2 rounded-lg opacity-100 sm:opacity-0 sm:group-hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-white transition-opacity shadow-lg z-10"
            aria-label={t('products.addToCart')}
          >
            <Icon name="add_shopping_cart" className="text-lg" />
          </button>
        </div>
      </div>

      <span className="text-xs text-text-muted font-medium mb-1">{product.category}</span>
      <a href={product.href || '#'} className="block">
        <h3 className="font-bold text-sm mb-2 line-clamp-2 text-text-main">{product.title}</h3>
      </a>

      {/* Specs — hidden on mobile to keep cards compact in 2-col grid */}
      <ul className="hidden sm:block text-xs text-text-muted space-y-1 mb-4">
        {product.specs.slice(0, 3).map((spec, i) => (
          <li key={i} className="flex items-center gap-1">
            <Icon name="check" className="text-text-muted text-xs flex-shrink-0" />
            {spec}
          </li>
        ))}
      </ul>

      <div className="mt-auto flex items-center justify-between pt-3 border-t border-border-light">
        <div>
          {product.price > 0 && (
            <>
              {product.originalPrice && (
                <span className="text-xs text-text-muted line-through block">
                  {t('price.currency')}{product.originalPrice.toLocaleString()}
                </span>
              )}
              <span className="text-lg font-black text-brand-purple">
                {t('price.currency')}{product.price.toLocaleString()}
              </span>
            </>
          )}
        </div>
        <button
          type="button"
          onClick={doAddToCart}
          className="sm:hidden bg-primary/10 hover:bg-primary text-primary hover:text-white p-2.5 rounded-lg transition-colors"
          aria-label={t('products.addToCart')}
        >
          <Icon name="add_shopping_cart" className="text-xl" />
        </button>
      </div>
    </div>
  );
}
