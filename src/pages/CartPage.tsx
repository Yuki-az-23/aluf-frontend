import { useState, useCallback } from 'react';
import { Container } from '@/components/layout/Container';
import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import { QuantityStepper } from '@/components/ui/QuantityStepper';
import { CouponInput } from '@/components/commerce/CouponInput';
import { ProductCard } from '@/components/commerce/ProductCard';
import { useStoreData } from '@/lib/StoreDataContext';
import { useLang } from '@/i18n';

const CHECKOUT_URL = '/orders/alufshop/new#secureHook';
const VAT_RATE = 0.17;

interface CartItem {
  item_id: string;
  item_name: string;
  price: number;
  quantity: number;
  item_image: string;
  item_category: string;
}

function readCartItems(): CartItem[] {
  try {
    const raw = localStorage.getItem('order_items');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return [];
}

function persistCartItems(items: CartItem[]): void {
  localStorage.setItem('order_items', JSON.stringify(items));

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const hostname = window.location.hostname;
  let domain = hostname;
  if (hostname.includes('aluf.co.il')) domain = '.aluf.co.il';
  else if (hostname.includes('.konimbo.co.il')) domain = '.konimbo.co.il';
  document.cookie = `num_of_cart_items=${totalItems}; path=/; domain=${domain}`;

  try {
    const jq = (window as unknown as Record<string, unknown>)['jQuery'] as
      | ((sel: unknown) => { trigger: (e: string) => void })
      | undefined;
    if (typeof jq === 'function') {
      jq(document).trigger('cart:updated');
      jq(document).trigger('order_items:updated');
    }
  } catch {}
}

export function CartPage() {
  const { t } = useLang();
  const { products } = useStoreData();
  const [cartItems, setCartItems] = useState<CartItem[]>(readCartItems);

  const updateQty = useCallback((itemId: string, qty: number) => {
    setCartItems(prev => {
      const updated = prev.map(i => (i.item_id === itemId ? { ...i, quantity: qty } : i));
      persistCartItems(updated);
      return updated;
    });
  }, []);

  const removeItem = useCallback((itemId: string) => {
    setCartItems(prev => {
      const updated = prev.filter(i => i.item_id !== itemId);
      persistCartItems(updated);
      return updated;
    });
  }, []);

  const subtotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  // VAT is included in price — show the included amount
  const vatIncluded = Math.round(subtotal * VAT_RATE);
  const loyaltyPoints = Math.floor(subtotal / 10);

  const cartItemIds = new Set(cartItems.map(i => i.item_id));
  const suggestedProducts = products.filter(p => !cartItemIds.has(p.id)).slice(0, 3);

  if (cartItems.length === 0) {
    return (
      <Container className="py-24">
        <div className="flex flex-col items-center gap-6 text-center">
          <Icon name="shopping_cart" className="text-7xl text-text-muted" />
          <h1 className="text-2xl font-black text-text-main">{t('cart.empty')}</h1>
          <Button variant="primary" size="lg" onClick={() => { window.location.href = '/'; }}>
            {t('cart.continueShopping')}
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-8 lg:py-12">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-text-main mb-1">{t('cart.title')}</h1>
        <p className="text-text-muted font-medium">
          {t('cart.itemCount').replace('{count}', String(cartItems.length))}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* ── Cart items list ── */}
        <div className="flex-[2] space-y-4">
          {cartItems.map(item => {
            const itemTotal = item.price * item.quantity;
            return (
              <div
                key={item.item_id}
                className="bg-card-bg p-4 rounded-xl border border-border-light flex flex-col sm:flex-row items-center gap-5 shadow-sm hover:shadow-tech-hover transition-shadow"
              >
                {/* Product image */}
                <div className="w-28 h-28 bg-white rounded-lg overflow-hidden shrink-0 flex items-center justify-center border border-border-light">
                  {item.item_image ? (
                    <img
                      src={item.item_image}
                      alt={item.item_name}
                      className="object-contain w-full h-full p-2"
                      loading="lazy"
                    />
                  ) : (
                    <Icon name="image" className="text-4xl text-text-muted" />
                  )}
                </div>

                {/* Product info */}
                <div className="flex-1 text-center sm:text-start">
                  <h3 className="font-bold text-base text-text-main leading-snug">
                    <a
                      href={`/items/${item.item_id}`}
                      className="hover:text-primary transition-colors"
                    >
                      {item.item_name}
                    </a>
                  </h3>
                  {item.item_category && (
                    <p className="text-text-muted text-sm mt-0.5">{item.item_category}</p>
                  )}
                  {item.quantity > 1 && (
                    <p className="text-xs text-text-muted mt-1">
                      ₪{item.price.toLocaleString()} {t('cart.perUnit')}
                    </p>
                  )}
                </div>

                {/* Quantity stepper */}
                <QuantityStepper
                  value={item.quantity}
                  onChange={qty => updateQty(item.item_id, qty)}
                  min={1}
                />

                {/* Line total */}
                <div className="min-w-[90px] text-center sm:text-start">
                  <p className="text-xl font-black text-brand-purple">
                    ₪{itemTotal.toLocaleString()}
                  </p>
                </div>

                {/* Remove button */}
                <button
                  onClick={() => removeItem(item.item_id)}
                  className="text-text-muted hover:text-red-500 transition-colors shrink-0"
                  aria-label={t('cart.removeItem')}
                >
                  <Icon name="delete" className="text-xl" />
                </button>
              </div>
            );
          })}
        </div>

        {/* ── Order summary sidebar ── */}
        <div className="lg:w-80 shrink-0">
          <div className="bg-card-bg border border-border-light rounded-2xl p-6 shadow-lg sticky top-24">
            <h2 className="text-xl font-black mb-6 border-b border-border-light pb-4">
              {t('cart.orderSummary')}
            </h2>

            {/* Breakdown */}
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-text-muted">
                <span>{t('cart.subtotal')}</span>
                <span className="font-medium">₪{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-text-muted">
                <span>{t('cart.shipping')}</span>
                <span className="text-green-600 font-bold">{t('cart.shippingFree')}</span>
              </div>
              <div className="flex justify-between text-text-muted">
                <span>{t('cart.vat')}</span>
                <span className="font-medium">₪{vatIncluded.toLocaleString()}</span>
              </div>
              <div className="pt-4 border-t border-border-light flex justify-between items-end">
                <span className="font-bold text-lg">{t('cart.total')}</span>
                <span className="text-3xl font-black text-primary">₪{subtotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Checkout CTA */}
            <Button
              variant="primary"
              size="lg"
              className="w-full text-lg py-4 flex items-center justify-center gap-2 group"
              onClick={() => { window.location.href = CHECKOUT_URL; }}
            >
              {t('cart.checkout')}
              <Icon name="arrow_back" className="group-hover:-translate-x-1 transition-transform" />
            </Button>

            {/* Trust badges */}
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3 text-xs text-text-muted">
                <Icon name="local_shipping" className="text-xl text-brand-purple shrink-0" />
                <span>{t('cart.freeShippingBadge')}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-text-muted">
                <Icon name="shield" className="text-xl text-brand-purple shrink-0" />
                <span>{t('cart.securePayment')}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-text-muted">
                <Icon name="undo" className="text-xl text-brand-purple shrink-0" />
                <span>{t('cart.returnPolicy')}</span>
              </div>
            </div>

            {/* Coupon */}
            <div className="mt-8">
              <p className="text-xs font-bold text-text-muted mb-2 uppercase tracking-wide">
                {t('cart.couponPlaceholder')}
              </p>
              <CouponInput onApply={code => console.log('[cart] coupon applied:', code)} />
            </div>
          </div>

          {/* Loyalty points */}
          {loyaltyPoints > 0 && (
            <div className="mt-4 bg-brand-purple/5 border border-brand-purple/20 p-4 rounded-xl">
              <p className="text-brand-purple text-xs font-bold leading-relaxed text-center">
                {t('cart.loyaltyPoints').replace('{points}', String(loyaltyPoints))}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── "You might also like" ── */}
      {suggestedProducts.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-text-main">
            <Icon name="auto_awesome" className="text-primary" />
            {t('cart.alsoLike')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {suggestedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
    </Container>
  );
}
