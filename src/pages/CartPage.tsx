import { useState, useCallback, useEffect, useRef } from 'react';
import { Container } from '@/components/layout/Container';
import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import { QuantityStepper } from '@/components/ui/QuantityStepper';
import { CouponInput } from '@/components/commerce/CouponInput';
import { useStoreData } from '@/lib/StoreDataContext';
import { useLang } from '@/i18n';
import { syncCartToJStorage, addToCart } from '@/lib/konimbo';
import { parseProductElements } from '@/lib/konimbo-scraper';
import type { Product } from '@/data/products';

const CHECKOUT_URL       = '/orders/alufshop/new#secureHook';
const CHECKOUT_PHONE_URL = '/orders/alufshop/new';
const VAT_RATE     = 0.18;
const TAG_URL      = '/tags/246669-tag5';
const LOGO_URL     = 'https://cdn.jsdelivr.net/gh/Yuki-az-23/aluf-frontend@master/src/assets/logo.png';
const SUPPORT_PHONE = '053-336-8084';

// ── Single active store. Dropdown is kept in STORES[] for future use. ────────
const STORES = [
  { id: 'rl', name: 'ראשון לציון – רח׳ הרצל 102' },
];
const DEFAULT_STORE = STORES[0];

// ── Israeli cities for address autocomplete ──────────────────────────────────
const IL_CITIES = [
  'אבן יהודה','אופקים','אור יהודה','אור עקיבא','אילת','אלעד','אריאל','אשדוד',
  'אשקלון','באר שבע','בית שאן','בית שמש','בני ברק','בת ים','גבעת שמואל',
  'גבעתיים','דימונה','הוד השרון','הרצליה','חדרה','חולון','חיפה','טבריה',
  'טירת כרמל','יבנה','יהוד','יקנעם','ירוחם','ירושלים','כפר סבא','כרמיאל',
  'לוד','מודיעין-מכבים-רעות','מעלה אדומים','מעלות-תרשיחא','נהריה','נס ציונה',
  'נצרת','נצרת עילית','נתיבות','נתניה','עכו','עפולה','פתח תקווה','צפת',
  'קריית אונו','קריית אתא','קריית ביאליק','קריית גת','קריית ים','קריית מוצקין',
  'קריית מלאכי','קריית שמונה','ראש העין','ראשון לציון','רחובות','רמלה',
  'רמת גן','רמת השרון','רעננה','שדרות','תל אביב-יפו',
];

// ── Types ─────────────────────────────────────────────────────────────────────
interface CartItem {
  item_id: string;
  item_name: string;
  price: number;
  quantity: number;
  item_image: string;
  item_category: string;
}
interface ContactForm {
  fullName: string;
  phone: string;
  email: string;
  city: string;
  street: string;
  houseNum: string;
  note: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function getTodayDate(): string {
  const d = new Date();
  return [String(d.getDate()).padStart(2,'0'), String(d.getMonth()+1).padStart(2,'0'), d.getFullYear()].join('/');
}
function vatOf(p: number): number  { return Math.round((p * VAT_RATE) / (1 + VAT_RATE)); }
function exVat(p: number): number  { return Math.round(p / (1 + VAT_RATE)); }
function escapeHtml(s: string): string {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
          .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}
function readCartItems(): CartItem[] {
  try {
    const raw = localStorage.getItem('order_items');
    if (raw) { const p = JSON.parse(raw); if (Array.isArray(p)) return p; }
  } catch {}
  return [];
}
function persistCartItems(items: CartItem[]): void {
  localStorage.setItem('order_items', JSON.stringify(items));
  syncCartToJStorage(items);
  const total = items.reduce((s,i) => s + i.quantity, 0);
  const h = window.location.hostname;
  let domain = h;
  if (h.includes('aluf.co.il')) domain = '.aluf.co.il';
  else if (h.includes('.konimbo.co.il')) domain = '.konimbo.co.il';
  document.cookie = `num_of_cart_items=${total}; path=/; domain=${domain}`;
  try {
    const jq = (window as unknown as Record<string,unknown>)['jQuery'] as ((s: unknown) => {trigger:(e: string) => void}) | undefined;
    if (typeof jq === 'function') { jq(document).trigger('cart:updated'); jq(document).trigger('order_items:updated'); }
  } catch {}
}

// ── Print ─────────────────────────────────────────────────────────────────────
function printCart(items: CartItem[], subtotal: number, contact: ContactForm, shipping: 'delivery'|'pickup', storeName: string): void {
  const totalVat = vatOf(subtotal);
  const subExVat = subtotal - totalVat;
  const fullAddr = shipping === 'delivery'
    ? [contact.city, contact.street, contact.houseNum].filter(Boolean).join(', ')
    : storeName;

  const rows = items.map(item => {
    const uI = item.price, uE = exVat(uI), lI = uI * item.quantity, lE = uE * item.quantity;
    return `<tr>
      <td>${escapeHtml(item.item_name)}</td>
      <td style="text-align:center">${item.quantity}</td>
      <td style="text-align:center">&#x20AA;${uE.toLocaleString('he-IL')}</td>
      <td style="text-align:center">&#x20AA;${uI.toLocaleString('he-IL')}</td>
      <td style="text-align:center">&#x20AA;${lE.toLocaleString('he-IL')}</td>
      <td style="text-align:center;font-weight:700">&#x20AA;${lI.toLocaleString('he-IL')}</td>
    </tr>`;
  }).join('');

  const cust = contact.fullName ? `<div class="cust">
    <div class="cr"><span class="lb">שם לקוח:</span> ${escapeHtml(contact.fullName)}</div>
    ${contact.phone ? `<div class="cr"><span class="lb">טלפון:</span> ${escapeHtml(contact.phone)}</div>` : ''}
    ${contact.email ? `<div class="cr"><span class="lb">אימייל:</span> ${escapeHtml(contact.email)}</div>` : ''}
    ${fullAddr     ? `<div class="cr"><span class="lb">כתובת:</span> ${escapeHtml(fullAddr)}</div>` : ''}
    <div class="cr"><span class="lb">אופן קבלה:</span> ${shipping === 'pickup' ? `איסוף מהחנות – ${escapeHtml(storeName)}` : 'משלוח לבית'}</div>
    ${contact.note ? `<div class="cr"><span class="lb">הערות:</span> ${escapeHtml(contact.note)}</div>` : ''}
  </div>` : '';

  const html = `<!DOCTYPE html><html dir="rtl" lang="he"><head><meta charset="UTF-8">
<title>הצעת מחיר – אלוף המחשבים</title><style>
*{box-sizing:border-box;margin:0;padding:0}body{font-family:Arial,sans-serif;padding:30px;direction:rtl;color:#111}
.header{text-align:center;padding-bottom:20px;border-bottom:3px solid #030213;margin-bottom:22px}
.header img{max-width:180px;margin-bottom:8px}.header h1{font-size:24px;font-weight:900;color:#030213}
.header .meta{font-size:12px;color:#555;line-height:1.9}
.cust{background:#f9f9f9;border:1px solid #ddd;border-radius:6px;padding:10px 14px;margin-bottom:18px;font-size:12px}
.cr{padding:2px 0}.lb{font-weight:700;color:#030213}
table{width:100%;border-collapse:collapse;margin-bottom:14px}
th{background:#030213;color:#fff;padding:8px 10px;font-size:11px;white-space:nowrap}
td{padding:7px 10px;border-bottom:1px solid #ddd;font-size:11px}tr:nth-child(even) td{background:#f9f9f9}
.vn{font-size:10px;color:#888;text-align:center;margin-bottom:12px}
.sum{border-top:2px solid #030213;padding-top:12px;max-width:300px;margin-right:auto}
.sr{display:flex;justify-content:space-between;padding:3px 0;font-size:13px}
.sr.tot{font-size:17px;font-weight:900;border-top:1px solid #ccc;margin-top:6px;padding-top:6px;color:#030213}
.ft{margin-top:26px;text-align:center;font-size:10px;color:#888;border-top:1px solid #eee;padding-top:12px}
@media print{body{padding:12px}}
</style></head><body>
<div class="header"><img src="${LOGO_URL}" alt="אלוף המחשבים"><h1>הצעת מחיר</h1>
<div class="meta"><div>תאריך: ${getTodayDate()}</div><div>שירות לקוחות: ${SUPPORT_PHONE}</div></div></div>
${cust}
<table><thead><tr>
  <th>מוצר</th><th style="text-align:center">כמות</th>
  <th style="text-align:center">מחיר ליח׳ ללא מע"מ</th><th style="text-align:center">מחיר ליח׳ כולל מע"מ</th>
  <th style="text-align:center">סה"כ ללא מע"מ</th><th style="text-align:center">סה"כ כולל מע"מ</th>
</tr></thead><tbody>${rows}</tbody></table>
<p class="vn">* מע"מ 18% כלול במחיר</p>
<div class="sum">
  <div class="sr"><span>סכום לפני מע"מ</span><span>&#x20AA;${subExVat.toLocaleString('he-IL')}</span></div>
  <div class="sr"><span>מע"מ (18%)</span><span>&#x20AA;${totalVat.toLocaleString('he-IL')}</span></div>
  <div class="sr"><span>משלוח</span><span style="color:#16a34a">חינם</span></div>
  <div class="sr tot"><span>סה"כ לתשלום</span><span>&#x20AA;${subtotal.toLocaleString('he-IL')}</span></div>
</div>
<div class="ft">המחירים כוללים מע"מ 18% | התמונות להמחשה בלבד | החברה שומרת לעצמה את הזכות לשנות מחירים</div>
<script>setTimeout(function(){window.print();},400);<\/script></body></html>`;

  const win = window.open('', '_blank', 'width=840,height=700');
  if (!win) return;
  win.document.write(html);
  win.document.close();
}

// ── Small field ───────────────────────────────────────────────────────────────
function Field({ label, value, onChange, onBlur, type='text', error, placeholder, multiline, list }: {
  label: string; value: string; onChange:(v:string)=>void; onBlur?:()=>void; type?:string;
  error?:string; placeholder?:string; multiline?:boolean; list?:string;
}) {
  const base = 'w-full bg-page-bg border rounded-xl px-4 py-3 text-sm text-text-main placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/40 transition-colors';
  const cls  = `${base} ${error ? 'border-red-400' : 'border-border-light'}`;
  return (
    <div>
      <label className="block text-xs font-bold text-text-muted mb-1.5 uppercase tracking-wide">{label}</label>
      {multiline
        ? <textarea rows={3} value={value} onChange={e=>onChange(e.target.value)} onBlur={onBlur} placeholder={placeholder} className={cls+' resize-none'} />
        : <input type={type} value={value} onChange={e=>onChange(e.target.value)} onBlur={onBlur} placeholder={placeholder} className={cls} list={list} />}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

// ── Product quick-view modal ──────────────────────────────────────────────────
function ProductModal({ product, onClose, onAddToCart }: {
  product: Product; onClose:()=>void; onAddToCart:(p:Product)=>void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative bg-card-bg rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Close */}
        <button onClick={onClose} className="absolute top-3 left-3 z-10 w-8 h-8 rounded-full bg-page-bg border border-border-light flex items-center justify-center text-text-muted hover:text-text-main transition-colors">
          <Icon name="close" className="text-base" />
        </button>

        {/* Image */}
        <div className="w-full h-52 bg-white flex items-center justify-center rounded-t-2xl overflow-hidden border-b border-border-light">
          {product.image
            ? <img src={product.image} alt={product.title} className="object-contain h-full w-full p-4" />
            : <Icon name="image" className="text-5xl text-text-muted" />}
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col gap-4">
          <div>
            <h3 className="text-base font-bold text-text-main leading-snug">{product.title}</h3>
            {product.price > 0 && (
              <p className="text-2xl font-black text-primary mt-1">₪{product.price.toLocaleString()}</p>
            )}
          </div>

          <div className="flex gap-3">
            <Button variant="primary" size="md" className="flex-1 flex items-center justify-center gap-2"
              onClick={() => { onAddToCart(product); onClose(); }}>
              <Icon name="shopping_cart" className="text-base" />
              הוסף לסל
            </Button>
            <a href={`/items/${product.id}`}
              className="flex-1 flex items-center justify-center gap-1.5 text-sm font-semibold border border-border-light rounded-xl py-2.5 text-text-muted hover:border-primary hover:text-primary transition-colors">
              <Icon name="open_in_new" className="text-sm" />
              פתח דף מוצר
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export function CartPage() {
  const { t } = useLang();
  useStoreData();

  const [cartItems,        setCartItems]        = useState<CartItem[]>(readCartItems);
  const [tagProducts,      setTagProducts]      = useState<Product[]>([]);
  const [modalProduct,     setModalProduct]     = useState<Product | null>(null);
  const [termsAccepted,    setTermsAccepted]    = useState(true);
  const [streetSuggestions, setStreetSuggestions] = useState<string[]>([]);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Shipping
  const [shipping, setShipping] = useState<'delivery'|'pickup'>('delivery');

  // Contact form
  const [contact, setContact] = useState<ContactForm>({
    fullName:'', phone:'', email:'', city:'', street:'', houseNum:'', note:'',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ContactForm | 'store', string>>>({});

  // Fetch carousel products from tag
  useEffect(() => {
    fetch(TAG_URL).then(r => r.text()).then(html => {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const parsed = parseProductElements(doc, window.location.origin);
      setTagProducts(parsed.sort(() => Math.random() - 0.5).slice(0, 20));
    }).catch(() => {});
  }, []);

  // Fetch street suggestions from Israel gov open-data API when city changes
  useEffect(() => {
    const city = contact.city.trim();
    if (!city || !IL_CITIES.includes(city)) { setStreetSuggestions([]); return; }
    const ctrl = new AbortController();
    const filters = encodeURIComponent(JSON.stringify({ city_name: city }));
    fetch(
      `https://data.gov.il/api/3/action/datastore_search?resource_id=9ad3862c-8391-4b2f-84a4-2d4c68625f4b` +
      `&filters=${filters}&limit=500&fields=street_name`,
      { signal: ctrl.signal }
    )
      .then(r => r.json())
      .then(data => {
        const records: { street_name: string }[] = data?.result?.records || [];
        const names = [...new Set(records.map(r => r.street_name).filter(Boolean))].sort();
        setStreetSuggestions(names);
      })
      .catch(() => {});
    return () => ctrl.abort();
  }, [contact.city]);

  const updateQty = useCallback((itemId: string, qty: number) => {
    setCartItems(prev => { const u = prev.map(i => i.item_id===itemId ? {...i, quantity:qty} : i); persistCartItems(u); return u; });
  }, []);

  const removeItem = useCallback((itemId: string) => {
    setCartItems(prev => { const u = prev.filter(i => i.item_id!==itemId); persistCartItems(u); return u; });
  }, []);

  function handleAddSuggested(product: Product) {
    addToCart(product.id, 1, { title: product.title, price: product.price, image: product.image });
    setCartItems(readCartItems());
  }

  const subtotal    = cartItems.reduce((s,i) => s + i.price * i.quantity, 0);
  const vatIncluded = vatOf(subtotal);
  const loyaltyPts  = Math.floor(subtotal / 10);
  const cartItemIds = new Set(cartItems.map(i => i.item_id));
  const suggested   = tagProducts.filter(p => !cartItemIds.has(p.id));

  function setField<K extends keyof ContactForm>(key: K, val: string) {
    setContact(prev => ({...prev, [key]: val}));
    if (errors[key]) setErrors(prev => ({...prev, [key]: undefined}));
  }

  function validateField(key: keyof ContactForm): string | undefined {
    if (key === 'phone' && contact.phone.trim() && !/^0[5-9]\d{7,8}$/.test(contact.phone.replace(/[\s-]/g,'')))
      return t('cart.phoneInvalid');
    if (key === 'email' && contact.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email))
      return t('cart.emailInvalid');
    return undefined;
  }

  function handleBlur(key: keyof ContactForm) {
    const err = validateField(key);
    setErrors(prev => ({ ...prev, [key]: err }));
  }

  function validateFields() {
    const e: Partial<Record<keyof ContactForm|'store', string>> = {};
    if (contact.phone && !/^0[5-9]\d{7,8}$/.test(contact.phone.replace(/[\s-]/g,''))) e.phone = t('cart.phoneInvalid');
    if (contact.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) e.email = t('cart.emailInvalid');
    return e;
  }

  function handleCheckout() {
    if (!termsAccepted) {
      document.getElementById('cart-terms-checkbox')?.focus();
      return;
    }
    setErrors(validateFields());
    const fullAddress = [contact.city, contact.street, contact.houseNum].filter(Boolean).join(', ');
    const storeName   = DEFAULT_STORE.name;
    const note = [shipping==='pickup' ? `איסוף מהחנות: ${storeName}` : '', contact.note].filter(Boolean).join(' | ');
    try {
      sessionStorage.setItem('aluf_checkout_prefill', JSON.stringify({
        full_name: contact.fullName, mobile_phone: contact.phone, email: contact.email,
        full_address: shipping==='delivery' ? fullAddress : storeName, note,
      }));
    } catch {}
    syncCartToJStorage(cartItems);
    window.location.href = CHECKOUT_URL;
  }

  function handlePhoneCheckout() {
    if (!termsAccepted) {
      document.getElementById('cart-terms-checkbox')?.focus();
      return;
    }
    setErrors(validateFields());
    const fullAddress = [contact.city, contact.street, contact.houseNum].filter(Boolean).join(', ');
    const storeName   = DEFAULT_STORE.name;
    const note = ['תשלום בטלפון', shipping==='pickup' ? `איסוף מהחנות: ${storeName}` : '', contact.note].filter(Boolean).join(' | ');
    try {
      sessionStorage.setItem('aluf_checkout_prefill', JSON.stringify({
        full_name: contact.fullName, mobile_phone: contact.phone, email: contact.email,
        full_address: shipping==='delivery' ? fullAddress : storeName, note,
      }));
    } catch {}
    syncCartToJStorage(cartItems);
    window.location.href = CHECKOUT_PHONE_URL;
  }

  function scrollCarousel(dir: 'left'|'right') {
    carouselRef.current?.scrollBy({ left: dir==='left' ? -290 : 290, behavior: 'smooth' });
  }

  if (cartItems.length === 0) {
    return (
      <Container className="py-24">
        <div className="flex flex-col items-center gap-6 text-center px-4">
          <Icon name="shopping_cart" className="text-7xl text-text-muted" />
          <h1 className="text-2xl font-black text-text-main">{t('cart.empty')}</h1>
          <Button variant="primary" size="lg" onClick={() => { window.location.href = '/'; }}>{t('cart.continueShopping')}</Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-6 lg:py-12">

      {/* Modal */}
      {modalProduct && (
        <ProductModal
          product={modalProduct}
          onClose={() => setModalProduct(null)}
          onAddToCart={handleAddSuggested}
        />
      )}

      {/* Page header */}
      <div className="mb-6 px-1">
        <h1 className="text-2xl lg:text-3xl font-black text-text-main mb-1">{t('cart.title')}</h1>
        <p className="text-text-muted text-sm font-medium">
          {t('cart.itemCount').replace('{count}', String(cartItems.length))}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">

        {/* ══ LEFT COLUMN ══════════════════════════════════════════════════ */}
        <div className="w-full lg:flex-[2] flex flex-col gap-5">

          {/* Cart rows */}
          <div className="flex flex-col gap-3">
            {cartItems.map(item => {
              const lineTotal = item.price * item.quantity;
              return (
                <div key={item.item_id}
                  className="bg-card-bg p-3 sm:p-4 rounded-xl border border-border-light flex flex-row items-center gap-3 sm:gap-5 shadow-sm hover:shadow-tech-hover transition-shadow">
                  {/* Image */}
                  <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 bg-white rounded-lg overflow-hidden shrink-0 flex items-center justify-center border border-border-light">
                    {item.item_image
                      ? <img src={item.item_image} alt={item.item_name} className="object-contain w-full h-full p-1.5" loading="lazy" />
                      : <Icon name="image" className="text-3xl text-text-muted" />}
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm sm:text-base text-text-main leading-snug">
                      <a href={`/items/${item.item_id}`} className="hover:text-primary transition-colors line-clamp-2">{item.item_name}</a>
                    </h3>
                    {item.item_category && <p className="text-text-muted text-xs mt-0.5">{item.item_category}</p>}
                    {/* Mobile: stepper + price */}
                    <div className="flex items-center gap-3 mt-2 sm:hidden">
                      <QuantityStepper value={item.quantity} onChange={q => updateQty(item.item_id, q)} min={1} />
                      <span className="text-base font-black text-brand-purple">₪{lineTotal.toLocaleString()}</span>
                    </div>
                    {item.quantity > 1 && <p className="text-xs text-text-muted mt-1 hidden sm:block">₪{item.price.toLocaleString()} {t('cart.perUnit')}</p>}
                  </div>
                  {/* Desktop: stepper + price */}
                  <div className="hidden sm:flex items-center gap-4 shrink-0">
                    <QuantityStepper value={item.quantity} onChange={q => updateQty(item.item_id, q)} min={1} />
                    <div className="min-w-[80px]">
                      <p className="text-xl font-black text-brand-purple">₪{lineTotal.toLocaleString()}</p>
                    </div>
                  </div>
                  {/* Remove */}
                  <button onClick={() => removeItem(item.item_id)}
                    className="text-text-muted hover:text-red-500 transition-colors shrink-0 p-1" aria-label={t('cart.removeItem')}>
                    <Icon name="delete" className="text-xl" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* ── "אולי יעניין אותך גם" carousel ─────────────────────────── */}
          {suggested.length > 0 && (
            <div className="mt-1">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-text-main flex items-center gap-1.5">
                  <Icon name="auto_awesome" className="text-xs text-primary" />
                  {t('cart.alsoLike')}
                </h2>
                <div className="flex gap-1">
                  <button onClick={() => scrollCarousel('right')}
                    className="w-7 h-7 rounded-full border border-border-light flex items-center justify-center text-text-muted hover:border-primary hover:text-primary transition-colors">
                    <Icon name="chevron_right" className="text-base" />
                  </button>
                  <button onClick={() => scrollCarousel('left')}
                    className="w-7 h-7 rounded-full border border-border-light flex items-center justify-center text-text-muted hover:border-primary hover:text-primary transition-colors">
                    <Icon name="chevron_left" className="text-base" />
                  </button>
                </div>
              </div>

              <div ref={carouselRef} className="flex gap-3 overflow-x-auto pb-2"
                style={{ scrollbarWidth:'none', msOverflowStyle:'none' }}>
                {suggested.map(product => (
                  <div key={product.id}
                    className="shrink-0 w-36 sm:w-40 bg-card-bg border border-border-light rounded-xl p-2.5 flex flex-col gap-2 group hover:border-primary hover:shadow-md transition-all">
                    {/* Image — click opens modal */}
                    <button type="button" onClick={() => setModalProduct(product)}
                      className="w-full h-24 bg-white rounded-lg overflow-hidden flex items-center justify-center focus:outline-none">
                      {product.image
                        ? <img src={product.image} alt={product.title} className="object-contain w-full h-full p-1 group-hover:scale-105 transition-transform" loading="lazy" />
                        : <Icon name="image" className="text-3xl text-text-muted" />}
                    </button>

                    {/* Title — click opens modal */}
                    <button type="button" onClick={() => setModalProduct(product)} className="text-right">
                      <p className="text-xs font-semibold text-text-main leading-snug line-clamp-2 group-hover:text-primary transition-colors text-start">
                        {product.title}
                      </p>
                    </button>

                    {product.price > 0 && (
                      <p className="text-sm font-black text-primary">₪{product.price.toLocaleString()}</p>
                    )}

                    {/* Quick-add button */}
                    <button type="button"
                      onClick={() => handleAddSuggested(product)}
                      className="mt-auto w-full flex items-center justify-center gap-1 text-xs font-bold py-1.5 rounded-lg border border-primary/30 text-primary hover:bg-primary hover:text-white transition-colors">
                      <Icon name="add_shopping_cart" className="text-sm" />
                      הוסף
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Shipping + Contact form ──────────────────────────────────── */}
          <div data-form-section className="bg-card-bg border border-border-light rounded-2xl p-5 sm:p-6 flex flex-col gap-6">

            {/* Shipping method */}
            <div>
              <h2 className="text-base font-black text-text-main mb-4 flex items-center gap-2">
                <Icon name="local_shipping" className="text-primary text-lg" />
                {t('cart.shippingMethod')}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(['delivery','pickup'] as const).map(opt => (
                  <button key={opt} type="button"
                    onClick={() => setShipping(opt)}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 text-sm font-semibold transition-all text-start
                      ${shipping===opt ? 'border-primary bg-primary/5 text-primary' : 'border-border-light text-text-muted hover:border-primary/40'}`}>
                    <Icon name={opt==='delivery' ? 'local_shipping' : 'store'} className={`text-2xl shrink-0 ${shipping===opt ? 'text-primary' : 'text-text-muted'}`} />
                    <span>
                      <span className="block font-bold">{opt==='delivery' ? t('cart.shippingDelivery') : t('cart.shippingPickup')}</span>
                      <span className="block text-xs font-normal opacity-70">{opt==='delivery' ? t('cart.shippingDeliveryNote') : t('cart.shippingPickupNote')}</span>
                    </span>
                  </button>
                ))}
              </div>

              {/* Single store — no dropdown (multi-store dropdown kept in STORES[] for future) */}
              {shipping === 'pickup' && (
                <div className="mt-4 flex items-center gap-3 p-3 rounded-xl bg-primary/5 border border-primary/20">
                  <Icon name="store" className="text-primary text-xl shrink-0" />
                  <div>
                    <p className="text-xs text-text-muted font-semibold uppercase tracking-wide mb-0.5">{t('cart.pickupStore')}</p>
                    <p className="text-sm font-bold text-text-main">{DEFAULT_STORE.name}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Contact details */}
            <div>
              <h2 className="text-base font-black text-text-main mb-4 flex items-center gap-2">
                <Icon name="person" className="text-primary text-lg" />
                {t('cart.contactDetails')}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Field label={t('cart.fullName')} value={contact.fullName} onChange={v=>setField('fullName',v)} placeholder="ישראל ישראלי" error={errors.fullName} />
                </div>
                <Field label={t('cart.phone')} type="tel" value={contact.phone} onChange={v=>setField('phone',v)} onBlur={()=>handleBlur('phone')} placeholder="05X-XXX-XXXX" error={errors.phone} />
                <Field label={t('cart.email')} type="email" value={contact.email} onChange={v=>setField('email',v)} onBlur={()=>handleBlur('email')} placeholder="example@email.com" error={errors.email} />

                {/* Address — city autocomplete + street + house number */}
                {shipping === 'delivery' && (
                  <>
                    {/* Datalist for city autocomplete */}
                    <datalist id="il-cities">
                      {IL_CITIES.map(c => <option key={c} value={c} />)}
                    </datalist>
                    <datalist id="il-streets">
                      {streetSuggestions.map(s => <option key={s} value={s} />)}
                    </datalist>
                    <div className="sm:col-span-2">
                      <Field label={t('cart.city')} value={contact.city} onChange={v=>setField('city',v)}
                        placeholder="הקלד עיר..." list="il-cities" />
                    </div>
                    <Field label={t('cart.street')} value={contact.street} onChange={v=>setField('street',v)}
                      placeholder="שם הרחוב" list={contact.city && IL_CITIES.includes(contact.city) ? 'il-streets' : undefined} />
                    <Field label={t('cart.houseNum')} value={contact.houseNum} onChange={v=>setField('houseNum',v)} placeholder='מס׳ בית / דירה' />
                  </>
                )}

                <div className="sm:col-span-2">
                  <Field label={t('cart.note')} value={contact.note} onChange={v=>setField('note',v)}
                    placeholder={t('cart.notePlaceholder')} multiline />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ══ RIGHT SIDEBAR ════════════════════════════════════════════════ */}
        <div className="w-full lg:w-80 shrink-0">
          <div className="lg:sticky lg:top-24 flex flex-col gap-4">

            {/* Order summary */}
            <div className="bg-card-bg border border-border-light rounded-2xl p-5 shadow-lg">
              <h2 className="text-lg font-black mb-5 border-b border-border-light pb-3">{t('cart.orderSummary')}</h2>

              <div className="space-y-3 mb-5">
                <div className="flex justify-between text-sm text-text-muted">
                  <span>{t('cart.subtotal')}</span>
                  <span className="font-medium">₪{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-text-muted">
                  <span>{t('cart.vat')}</span>
                  <span className="font-medium">₪{vatIncluded.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-text-muted">
                  <span>{t('cart.shipping')}</span>
                  <span className="text-green-600 font-bold">{t('cart.shippingFree')}</span>
                </div>
                <div className="pt-3 border-t border-border-light flex justify-between items-end">
                  <span className="font-bold">{t('cart.total')}</span>
                  <span className="text-2xl sm:text-3xl font-black text-primary">₪{subtotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Coupon — back under order summary */}
              <div className="mb-5 pt-4 border-t border-border-light">
                <p className="text-xs font-bold text-text-muted mb-2 uppercase tracking-wide">{t('cart.couponLabel')}</p>
                <CouponInput onApply={code => console.log('[cart] coupon:', code)} />
              </div>

              {/* Terms checkbox */}
              <label className={`flex items-start gap-2.5 cursor-pointer mb-4 text-xs leading-relaxed select-none rounded-xl p-3 border transition-colors ${!termsAccepted ? 'border-red-400 bg-red-50/50' : 'border-border-light bg-page-bg/50'}`}>
                <input
                  id="cart-terms-checkbox"
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={e => setTermsAccepted(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded accent-primary shrink-0 cursor-pointer"
                />
                <span className="text-text-muted">
                  {t('cart.termsPrefix')}{' '}
                  <a href="/contract" target="_blank" rel="noopener noreferrer"
                    className="text-primary font-bold underline hover:opacity-80 transition-opacity"
                    onClick={e => e.stopPropagation()}>
                    {t('cart.termsLink')}
                  </a>
                  {' '}{t('cart.termsSuffix')}
                </span>
              </label>

              {/* Checkout CTAs — card + phone (mirrors Konimbo production checkout) */}
              <div className="flex flex-col gap-2">
                <Button variant="primary" size="lg"
                  className={`w-full text-base py-3.5 flex items-center justify-center gap-2 group transition-opacity ${!termsAccepted ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={handleCheckout}>
                  <Icon name="credit_card" className="text-base" />
                  {t('cart.checkout')}
                  <Icon name="arrow_back" className="group-hover:-translate-x-1 transition-transform" />
                </Button>
                <button type="button"
                  onClick={handlePhoneCheckout}
                  className={`w-full flex flex-col items-center justify-center gap-0.5 py-3 rounded-xl border-2 border-text-main bg-text-main text-white font-bold text-sm hover:bg-transparent hover:text-text-main transition-colors ${!termsAccepted ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  <span className="flex items-center gap-2">
                    <Icon name="phone" className="text-base" />
                    {t('cart.checkoutPhone')}
                  </span>
                  <span className="text-xs font-normal opacity-75">{t('cart.checkoutPhoneNote')}</span>
                </button>
              </div>

              {/* Print */}
              <button type="button"
                onClick={() => printCart(cartItems, subtotal, contact, shipping, DEFAULT_STORE.name)}
                className="mt-3 w-full flex items-center justify-center gap-2 text-sm font-semibold bg-card-bg text-text-main border border-border-light rounded-xl py-2.5 hover:bg-primary/10 hover:border-primary hover:text-primary transition-colors">
                <Icon name="print" className="text-base" />
                {t('cart.printQuote')}
              </button>

              {/* Trust badges */}
              <div className="mt-5 space-y-2.5">
                <div className="flex items-center gap-2.5 text-xs text-text-muted">
                  <Icon name="local_shipping" className="text-lg text-brand-purple shrink-0" />
                  <span>{t('cart.freeShippingBadge')}</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-text-muted">
                  <Icon name="undo" className="text-lg text-brand-purple shrink-0" />
                  <span>{t('cart.returnPolicy')}</span>
                </div>
              </div>

              {/* Payment method icons */}
              <div className="mt-4 pt-4 border-t border-border-light">
                <p className="text-xs text-text-muted mb-2 font-semibold">{t('cart.securePayment')}</p>
                <img
                  src="https://konimbo-hybrid-files-production.s3-eu-west-1.amazonaws.com/konimbo_dev_main/files-uploaded-by-lambda/admin/alufshop/00e9ed12915da0ab74ddb307af89654530f704a3/2033279250.svg"
                  alt="אמצעי תשלום מאובטחים"
                  className="w-full max-w-[220px] h-auto object-contain"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Loyalty */}
            {loyaltyPts > 0 && (
              <div className="bg-brand-purple/5 border border-brand-purple/20 p-4 rounded-xl">
                <p className="text-brand-purple text-xs font-bold leading-relaxed text-center">
                  {t('cart.loyaltyPoints').replace('{points}', String(loyaltyPts))}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
}
