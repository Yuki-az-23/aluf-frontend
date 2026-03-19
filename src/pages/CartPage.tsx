import { useState, useCallback, useEffect, useRef } from 'react';
import { Container } from '@/components/layout/Container';
import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import { QuantityStepper } from '@/components/ui/QuantityStepper';
import { CouponInput } from '@/components/commerce/CouponInput';
import { useStoreData } from '@/lib/StoreDataContext';
import { useLang } from '@/i18n';
import { syncCartToJStorage } from '@/lib/konimbo';
import { parseProductElements } from '@/lib/konimbo-scraper';
import type { Product } from '@/data/products';

const CHECKOUT_URL = '/orders/alufshop/new#secureHook';
const VAT_RATE = 0.18;
const TAG_URL = '/tags/246669-tag5';
const LOGO_URL = 'https://cdn.jsdelivr.net/gh/Yuki-az-23/aluf-frontend@master/src/assets/logo.png';
const SUPPORT_PHONE = '053-336-8084';

function getTodayDate(): string {
  const d = new Date();
  return [
    String(d.getDate()).padStart(2, '0'),
    String(d.getMonth() + 1).padStart(2, '0'),
    d.getFullYear(),
  ].join('/');
}

/** Prices are VAT-inclusive. Extract the VAT portion: price × 18/118 */
function vatOf(priceWithVat: number): number {
  return Math.round(priceWithVat * VAT_RATE / (1 + VAT_RATE));
}
function exVat(priceWithVat: number): number {
  return Math.round(priceWithVat / (1 + VAT_RATE));
}

function printCart(items: CartItem[], subtotal: number): void {
  const totalVat = vatOf(subtotal);
  const subtotalExVat = subtotal - totalVat;
  const date = getTodayDate();

  const rowsHtml = items.map(item => {
    const unitWithVat = item.price;
    const unitExVat = exVat(unitWithVat);
    const lineWithVat = unitWithVat * item.quantity;
    const lineExVat = unitExVat * item.quantity;
    return `<tr>
      <td>${escapeHtml(item.item_name)}</td>
      <td style="text-align:center">${item.quantity}</td>
      <td style="text-align:center">&#x20AA;${unitExVat.toLocaleString('he-IL')}</td>
      <td style="text-align:center">&#x20AA;${unitWithVat.toLocaleString('he-IL')}</td>
      <td style="text-align:center">&#x20AA;${lineExVat.toLocaleString('he-IL')}</td>
      <td style="text-align:center; font-weight:700">&#x20AA;${lineWithVat.toLocaleString('he-IL')}</td>
    </tr>`;
  }).join('');

  const html = `<!DOCTYPE html>
<html dir="rtl" lang="he">
<head>
  <meta charset="UTF-8">
  <title>הצעת מחיר - אלוף המחשבים</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Arial, Helvetica, sans-serif; padding: 30px; direction: rtl; color: #111; }
    .header { text-align: center; padding-bottom: 24px; border-bottom: 3px solid #030213; margin-bottom: 28px; }
    .header img { max-width: 200px; height: auto; margin-bottom: 12px; }
    .header h1 { font-size: 26px; font-weight: 900; color: #030213; margin-bottom: 6px; }
    .header .meta { font-size: 14px; color: #555; line-height: 1.8; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
    th { background: #030213; color: #fff; padding: 10px 12px; font-size: 13px; white-space: nowrap; }
    td { padding: 9px 12px; border-bottom: 1px solid #ddd; font-size: 13px; }
    tr:nth-child(even) td { background: #f9f9f9; }
    .vat-note { font-size: 11px; color: #888; text-align: center; margin-bottom: 16px; }
    .summary { border-top: 2px solid #030213; padding-top: 16px; max-width: 340px; margin-right: auto; }
    .summary-row { display: flex; justify-content: space-between; padding: 5px 0; font-size: 15px; }
    .summary-row.total { font-size: 19px; font-weight: 900; border-top: 1px solid #ccc; margin-top: 8px; padding-top: 8px; color: #030213; }
    .footer { margin-top: 32px; text-align: center; font-size: 11px; color: #888; border-top: 1px solid #eee; padding-top: 16px; }
    @media print { body { padding: 16px; } }
  </style>
</head>
<body>
  <div class="header">
    <img src="${LOGO_URL}" alt="אלוף המחשבים">
    <h1>הצעת מחיר</h1>
    <div class="meta">
      <div>תאריך: ${date}</div>
      <div>שירות לקוחות: ${SUPPORT_PHONE}</div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>מוצר</th>
        <th style="text-align:center">כמות</th>
        <th style="text-align:center">מחיר ליח' (ללא מע"מ)</th>
        <th style="text-align:center">מחיר ליח' (כולל מע"מ)</th>
        <th style="text-align:center">סה"כ (ללא מע"מ)</th>
        <th style="text-align:center">סה"כ (כולל מע"מ)</th>
      </tr>
    </thead>
    <tbody>${rowsHtml}</tbody>
  </table>

  <p class="vat-note">* מע"מ 18% כלול במחיר</p>

  <div class="summary">
    <div class="summary-row"><span>סכום לפני מע"מ</span><span>&#x20AA;${subtotalExVat.toLocaleString('he-IL')}</span></div>
    <div class="summary-row"><span>מע"מ (18%)</span><span>&#x20AA;${totalVat.toLocaleString('he-IL')}</span></div>
    <div class="summary-row"><span>משלוח</span><span style="color:#16a34a">חינם</span></div>
    <div class="summary-row total"><span>סה"כ לתשלום</span><span>&#x20AA;${subtotal.toLocaleString('he-IL')}</span></div>
  </div>

  <div class="footer">
    המחירים כוללים מע"מ 18% | התמונות להמחשה בלבד | החברה שומרת לעצמה את הזכות לשנות מחירים ללא הודעה מוקדמת
  </div>

  <script>setTimeout(function(){ window.print(); }, 400);<\/script>
</body>
</html>`;

  const win = window.open('', '_blank', 'width=820,height=680');
  if (!win) return;
  win.document.write(html);
  win.document.close();
}

/** Minimal HTML escape for user-sourced strings written into the print window */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

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

  // Rebuild jStorage cart HTML so Konimbo checkout reads the correct cart_content
  syncCartToJStorage(items);

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
  useStoreData(); // keep context alive
  const [cartItems, setCartItems] = useState<CartItem[]>(readCartItems);
  const [tagProducts, setTagProducts] = useState<Product[]>([]);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Fetch up to 20 random products from the tag page on mount
  useEffect(() => {
    fetch(TAG_URL)
      .then(r => r.text())
      .then(html => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const parsed = parseProductElements(doc, window.location.origin);
        // Shuffle randomly then cap at 20
        const shuffled = parsed.sort(() => Math.random() - 0.5).slice(0, 20);
        setTagProducts(shuffled);
      })
      .catch(() => {});
  }, []);

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
  // Prices are VAT-inclusive — extract the embedded VAT: price × 18/118
  const vatIncluded = vatOf(subtotal);
  const loyaltyPoints = Math.floor(subtotal / 10);

  const cartItemIds = new Set(cartItems.map(i => i.item_id));
  // Filter out items already in cart
  const suggested = tagProducts.filter(p => !cartItemIds.has(p.id));

  function scrollCarousel(dir: 'left' | 'right') {
    const el = carouselRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === 'left' ? -280 : 280, behavior: 'smooth' });
  }

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
        {/* ── Left column: items + carousel ── */}
        <div className="flex-[2] flex flex-col gap-4">
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

          {/* ── "אולי יעניין אותך גם" horizontal carousel ── */}
          {suggested.length > 0 && (
            <div className="mt-2">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-bold text-text-main flex items-center gap-1.5">
                  <Icon name="auto_awesome" className="text-sm text-primary" />
                  {t('cart.alsoLike')}
                </h2>
                <div className="flex gap-1">
                  <button
                    onClick={() => scrollCarousel('right')}
                    className="w-7 h-7 rounded-full border border-border-light flex items-center justify-center text-text-muted hover:border-primary hover:text-primary transition-colors"
                    aria-label="הקודם"
                  >
                    <Icon name="chevron_right" className="text-base" />
                  </button>
                  <button
                    onClick={() => scrollCarousel('left')}
                    className="w-7 h-7 rounded-full border border-border-light flex items-center justify-center text-text-muted hover:border-primary hover:text-primary transition-colors"
                    aria-label="הבא"
                  >
                    <Icon name="chevron_left" className="text-base" />
                  </button>
                </div>
              </div>

              <div
                ref={carouselRef}
                className="flex gap-3 overflow-x-auto pb-2 scroll-smooth"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {suggested.map(product => (
                  <a
                    key={product.id}
                    href={`/items/${product.id}`}
                    className="shrink-0 w-40 bg-card-bg border border-border-light rounded-xl p-2.5 flex flex-col gap-2 hover:border-primary hover:shadow-md transition-all group"
                  >
                    <div className="w-full h-28 bg-white rounded-lg overflow-hidden flex items-center justify-center">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.title}
                          className="object-contain w-full h-full p-1"
                          loading="lazy"
                        />
                      ) : (
                        <Icon name="image" className="text-3xl text-text-muted" />
                      )}
                    </div>
                    <p className="text-xs font-semibold text-text-main leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                      {product.title}
                    </p>
                    {product.price > 0 && (
                      <p className="text-sm font-black text-primary">
                        ₪{product.price.toLocaleString()}
                      </p>
                    )}
                  </a>
                ))}
              </div>
            </div>
          )}
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

            {/* Print / PDF quote button */}
            <button
              type="button"
              onClick={() => printCart(cartItems, subtotal)}
              className="mt-3 w-full flex items-center justify-center gap-2 text-sm font-semibold bg-card-bg text-text-main border border-border-light rounded-xl py-2.5 hover:bg-primary/10 hover:border-primary hover:text-primary transition-colors"
            >
              <Icon name="print" className="text-base" />
              {t('cart.printQuote')}
            </button>

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

    </Container>
  );
}
