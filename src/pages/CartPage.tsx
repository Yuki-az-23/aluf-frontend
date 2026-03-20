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

const STORES = [
  { id: 'tlv', name: 'תל אביב – רח׳ אלנבי 128' },
  { id: 'pt',  name: 'פתח תקווה – שד׳ הרצל 52' },
  { id: 'rg',  name: 'ראשון לציון – רח׳ הרצל 18' },
  { id: 'hfa', name: 'חיפה – שד׳ הנשיא 22' },
  { id: 'jlm', name: 'ירושלים – רח׳ יפו 90' },
  { id: 'bs',  name: 'באר שבע – שד׳ רגר 11' },
];

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
  address: string;
  note: string;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function getTodayDate(): string {
  const d = new Date();
  return [
    String(d.getDate()).padStart(2, '0'),
    String(d.getMonth() + 1).padStart(2, '0'),
    d.getFullYear(),
  ].join('/');
}

/** Prices are VAT-inclusive. Extract the embedded VAT: price × 18/118 */
function vatOf(p: number): number {
  return Math.round((p * VAT_RATE) / (1 + VAT_RATE));
}
function exVat(p: number): number {
  return Math.round(p / (1 + VAT_RATE));
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
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
  syncCartToJStorage(items);

  const total = items.reduce((s, i) => s + i.quantity, 0);
  const hostname = window.location.hostname;
  let domain = hostname;
  if (hostname.includes('aluf.co.il')) domain = '.aluf.co.il';
  else if (hostname.includes('.konimbo.co.il')) domain = '.konimbo.co.il';
  document.cookie = `num_of_cart_items=${total}; path=/; domain=${domain}`;

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

// ─── Print ──────────────────────────────────────────────────────────────────

function printCart(
  items: CartItem[],
  subtotal: number,
  contact: ContactForm,
  shipping: 'delivery' | 'pickup',
  storeName: string,
): void {
  const totalVat    = vatOf(subtotal);
  const subExVat    = subtotal - totalVat;
  const date        = getTodayDate();
  const shippingTxt = shipping === 'pickup'
    ? `איסוף מהחנות – ${storeName}`
    : 'משלוח לבית';

  const rowsHtml = items.map(item => {
    const uIncl = item.price;
    const uExcl = exVat(uIncl);
    const lIncl = uIncl * item.quantity;
    const lExcl = uExcl * item.quantity;
    return `<tr>
      <td>${escapeHtml(item.item_name)}</td>
      <td style="text-align:center">${item.quantity}</td>
      <td style="text-align:center">&#x20AA;${uExcl.toLocaleString('he-IL')}</td>
      <td style="text-align:center">&#x20AA;${uIncl.toLocaleString('he-IL')}</td>
      <td style="text-align:center">&#x20AA;${lExcl.toLocaleString('he-IL')}</td>
      <td style="text-align:center;font-weight:700">&#x20AA;${lIncl.toLocaleString('he-IL')}</td>
    </tr>`;
  }).join('');

  const customerBlock = contact.fullName
    ? `<div class="customer">
        <div class="customer-row"><span class="lbl">שם לקוח:</span> ${escapeHtml(contact.fullName)}</div>
        ${contact.phone   ? `<div class="customer-row"><span class="lbl">טלפון:</span> ${escapeHtml(contact.phone)}</div>` : ''}
        ${contact.email   ? `<div class="customer-row"><span class="lbl">אימייל:</span> ${escapeHtml(contact.email)}</div>` : ''}
        ${contact.address ? `<div class="customer-row"><span class="lbl">כתובת:</span> ${escapeHtml(contact.address)}</div>` : ''}
        <div class="customer-row"><span class="lbl">אופן קבלה:</span> ${shippingTxt}</div>
        ${contact.note    ? `<div class="customer-row"><span class="lbl">הערות:</span> ${escapeHtml(contact.note)}</div>` : ''}
      </div>` : '';

  const html = `<!DOCTYPE html>
<html dir="rtl" lang="he"><head>
<meta charset="UTF-8">
<title>הצעת מחיר – אלוף המחשבים</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:Arial,Helvetica,sans-serif;padding:30px;direction:rtl;color:#111}
  .header{text-align:center;padding-bottom:22px;border-bottom:3px solid #030213;margin-bottom:24px}
  .header img{max-width:190px;height:auto;margin-bottom:10px}
  .header h1{font-size:25px;font-weight:900;color:#030213;margin-bottom:5px}
  .header .meta{font-size:13px;color:#555;line-height:1.9}
  .customer{background:#f9f9f9;border:1px solid #ddd;border-radius:8px;padding:12px 16px;margin-bottom:20px;font-size:13px}
  .customer-row{padding:3px 0}.lbl{font-weight:700;color:#030213}
  table{width:100%;border-collapse:collapse;margin-bottom:16px}
  th{background:#030213;color:#fff;padding:9px 11px;font-size:12px;white-space:nowrap}
  td{padding:8px 11px;border-bottom:1px solid #ddd;font-size:12px}
  tr:nth-child(even) td{background:#f9f9f9}
  .vat-note{font-size:10px;color:#888;text-align:center;margin-bottom:14px}
  .summary{border-top:2px solid #030213;padding-top:14px;max-width:320px;margin-right:auto}
  .summary-row{display:flex;justify-content:space-between;padding:4px 0;font-size:14px}
  .summary-row.total{font-size:18px;font-weight:900;border-top:1px solid #ccc;margin-top:7px;padding-top:7px;color:#030213}
  .footer{margin-top:28px;text-align:center;font-size:10px;color:#888;border-top:1px solid #eee;padding-top:14px}
  @media print{body{padding:14px}}
</style></head><body>
<div class="header">
  <img src="${LOGO_URL}" alt="אלוף המחשבים">
  <h1>הצעת מחיר</h1>
  <div class="meta">
    <div>תאריך: ${date}</div>
    <div>שירות לקוחות: ${SUPPORT_PHONE}</div>
  </div>
</div>
${customerBlock}
<table>
  <thead><tr>
    <th>מוצר</th>
    <th style="text-align:center">כמות</th>
    <th style="text-align:center">מחיר ליח׳ ללא מע"מ</th>
    <th style="text-align:center">מחיר ליח׳ כולל מע"מ</th>
    <th style="text-align:center">סה"כ ללא מע"מ</th>
    <th style="text-align:center">סה"כ כולל מע"מ</th>
  </tr></thead>
  <tbody>${rowsHtml}</tbody>
</table>
<p class="vat-note">* מע"מ 18% כלול במחיר</p>
<div class="summary">
  <div class="summary-row"><span>סכום לפני מע"מ</span><span>&#x20AA;${subExVat.toLocaleString('he-IL')}</span></div>
  <div class="summary-row"><span>מע"מ (18%)</span><span>&#x20AA;${totalVat.toLocaleString('he-IL')}</span></div>
  <div class="summary-row"><span>משלוח</span><span style="color:#16a34a">חינם</span></div>
  <div class="summary-row total"><span>סה"כ לתשלום</span><span>&#x20AA;${subtotal.toLocaleString('he-IL')}</span></div>
</div>
<div class="footer">המחירים כוללים מע"מ 18% | התמונות להמחשה בלבד | החברה שומרת לעצמה את הזכות לשנות מחירים ללא הודעה מוקדמת</div>
<script>setTimeout(function(){window.print();},400);<\/script>
</body></html>`;

  const win = window.open('', '_blank', 'width=840,height=700');
  if (!win) return;
  win.document.write(html);
  win.document.close();
}

// ─── Field component ─────────────────────────────────────────────────────────

function Field({
  label, value, onChange, type = 'text', required, error, placeholder, multiline,
}: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; required?: boolean; error?: string;
  placeholder?: string; multiline?: boolean;
}) {
  const base = 'w-full bg-page-bg border rounded-xl px-4 py-3 text-sm text-text-main placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/40 transition-colors';
  const cls  = `${base} ${error ? 'border-red-400' : 'border-border-light'}`;
  return (
    <div>
      <label className="block text-xs font-bold text-text-muted mb-1.5 uppercase tracking-wide">
        {label}{required && <span className="text-red-500 mr-1">*</span>}
      </label>
      {multiline ? (
        <textarea
          rows={3}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className={cls + ' resize-none'}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className={cls}
        />
      )}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export function CartPage() {
  const { t } = useLang();
  useStoreData();

  const [cartItems,   setCartItems]   = useState<CartItem[]>(readCartItems);
  const [tagProducts, setTagProducts] = useState<Product[]>([]);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Shipping & contact form state
  const [shipping,  setShipping]  = useState<'delivery' | 'pickup'>('delivery');
  const [storeId,   setStoreId]   = useState('');
  const [contact,   setContact]   = useState<ContactForm>({
    fullName: '', phone: '', email: '', address: '', note: '',
  });
  const [errors, setErrors] = useState<Partial<ContactForm & { store: string }>>({});

  // Fetch carousel products
  useEffect(() => {
    fetch(TAG_URL)
      .then(r => r.text())
      .then(html => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const parsed = parseProductElements(doc, window.location.origin);
        setTagProducts(parsed.sort(() => Math.random() - 0.5).slice(0, 20));
      })
      .catch(() => {});
  }, []);

  const updateQty = useCallback((itemId: string, qty: number) => {
    setCartItems(prev => {
      const updated = prev.map(i => i.item_id === itemId ? { ...i, quantity: qty } : i);
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

  const subtotal    = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const vatIncluded = vatOf(subtotal);
  const loyaltyPts  = Math.floor(subtotal / 10);
  const cartItemIds = new Set(cartItems.map(i => i.item_id));
  const suggested   = tagProducts.filter(p => !cartItemIds.has(p.id));

  function setField<K extends keyof ContactForm>(key: K, val: string) {
    setContact(prev => ({ ...prev, [key]: val }));
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: undefined }));
  }

  function validate(): boolean {
    const e: Partial<ContactForm & { store: string }> = {};
    if (!contact.fullName.trim())                               e.fullName = t('cart.fieldRequired');
    if (!/^0[5-9]\d{7,8}$/.test(contact.phone.replace(/\s/g, ''))) e.phone = t('cart.phoneInvalid');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email))    e.email = t('cart.emailInvalid');
    if (shipping === 'delivery' && !contact.address.trim())    e.address = t('cart.fieldRequired');
    if (shipping === 'pickup'   && !storeId)                   e.store = t('cart.fieldRequired');
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleCheckout() {
    if (!validate()) {
      document.querySelector('[data-form-section]')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    const storeName   = STORES.find(s => s.id === storeId)?.name ?? '';
    const noteWithShipping = [
      shipping === 'pickup' ? `איסוף מהחנות: ${storeName}` : '',
      contact.note,
    ].filter(Boolean).join(' | ');

    const fullAddress = shipping === 'delivery'
      ? contact.address
      : storeName;

    // Build the cart_content HTML string (same as jStorage cart_alufshop)
    // and the JSON payload — submitted as hidden form fields so Konimbo
    // receives everything in a single POST without depending on jStorage
    // being pre-populated on the server side.
    const cartHtmlParts = cartItems.map(item => {
      const tr = document.createElement('tr');
      tr.setAttribute('data-id', 'item_id_' + item.item_id);
      tr.setAttribute('style', 'height:auto;max-height:999px;');

      const td1 = document.createElement('td');
      const qDiv = document.createElement('div');
      qDiv.className = 'quantity';
      qDiv.textContent = String(item.quantity);
      td1.appendChild(qDiv);

      const td2 = document.createElement('td');
      td2.className = 'img_item';
      if (item.item_image) {
        const img = document.createElement('img');
        img.src = item.item_image;
        td2.appendChild(img);
      }

      const td3 = document.createElement('td');
      td3.className = 'title';
      const a = document.createElement('a');
      a.href = '/items/' + item.item_id;
      a.textContent = item.item_name;
      td3.appendChild(a);

      const td4 = document.createElement('td');
      td4.className = 'delete_btn';
      td4.appendChild(document.createElement('a'));

      const td5 = document.createElement('td');
      td5.className = 'price_item_x';
      td5.textContent = item.price.toLocaleString('he-IL') + ' ₪';

      tr.append(td1, td2, td3, td4, td5);
      return tr.outerHTML;
    });
    const cartHtml = cartHtmlParts.join('');

    const flyingJson = JSON.stringify(
      cartItems.map(item => ({
        item_id: Number(item.item_id),
        quantity: item.quantity,
        upgrade_topics: [],
        upgrade_price_additions: [],
        item_name: item.item_name,
        item_price: item.price,
      }))
    );

    // Submit hidden form — same-domain POST so no CORS issue
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = CHECKOUT_URL;
    form.style.display = 'none';

    const fields: Record<string, string> = {
      'cart_content':                  cartHtml,
      'cart_content_with_upgrades':    cartHtml,
      'cart_key':                      'cart_alufshop',
      'flying_cart_with_upgrades_json': flyingJson,
      'order[full_name]':              contact.fullName,
      'order[mobile_phone]':           contact.phone,
      'order[email]':                  contact.email,
      'order[full_address]':           fullAddress,
      'order[note]':                   noteWithShipping,
    };

    for (const [name, value] of Object.entries(fields)) {
      const input = document.createElement('input');
      input.type  = 'hidden';
      input.name  = name;
      input.value = value;
      form.appendChild(input);
    }

    document.body.appendChild(form);
    form.submit();
  }

  function scrollCarousel(dir: 'left' | 'right') {
    carouselRef.current?.scrollBy({ left: dir === 'left' ? -280 : 280, behavior: 'smooth' });
  }

  if (cartItems.length === 0) {
    return (
      <Container className="py-24">
        <div className="flex flex-col items-center gap-6 text-center px-4">
          <Icon name="shopping_cart" className="text-7xl text-text-muted" />
          <h1 className="text-2xl font-black text-text-main">{t('cart.empty')}</h1>
          <Button variant="primary" size="lg" onClick={() => { window.location.href = '/'; }}>
            {t('cart.continueShopping')}
          </Button>
        </div>
      </Container>
    );
  }

  const selectedStoreName = STORES.find(s => s.id === storeId)?.name ?? '';

  return (
    <Container className="py-6 lg:py-12">

      {/* ── Page header ── */}
      <div className="mb-6 px-1">
        <h1 className="text-2xl lg:text-3xl font-black text-text-main mb-1">{t('cart.title')}</h1>
        <p className="text-text-muted text-sm font-medium">
          {t('cart.itemCount').replace('{count}', String(cartItems.length))}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">

        {/* ══════════════════════════════════════════
            LEFT COLUMN — items · form · carousel
        ══════════════════════════════════════════ */}
        <div className="w-full lg:flex-[2] flex flex-col gap-5">

          {/* ── Cart item rows ── */}
          <div className="flex flex-col gap-3">
            {cartItems.map(item => {
              const lineTotal = item.price * item.quantity;
              return (
                <div
                  key={item.item_id}
                  className="bg-card-bg p-3 sm:p-4 rounded-xl border border-border-light
                             flex flex-row items-center gap-3 sm:gap-5
                             shadow-sm hover:shadow-tech-hover transition-shadow"
                >
                  {/* Image */}
                  <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 bg-white rounded-lg
                                  overflow-hidden shrink-0 flex items-center justify-center
                                  border border-border-light">
                    {item.item_image ? (
                      <img
                        src={item.item_image}
                        alt={item.item_name}
                        className="object-contain w-full h-full p-1.5"
                        loading="lazy"
                      />
                    ) : (
                      <Icon name="image" className="text-3xl text-text-muted" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm sm:text-base text-text-main leading-snug">
                      <a href={`/items/${item.item_id}`} className="hover:text-primary transition-colors line-clamp-2">
                        {item.item_name}
                      </a>
                    </h3>
                    {item.item_category && (
                      <p className="text-text-muted text-xs mt-0.5">{item.item_category}</p>
                    )}
                    {/* Mobile: show price + stepper inline */}
                    <div className="flex items-center gap-3 mt-2 sm:hidden">
                      <QuantityStepper value={item.quantity} onChange={q => updateQty(item.item_id, q)} min={1} />
                      <span className="text-base font-black text-brand-purple">₪{lineTotal.toLocaleString()}</span>
                    </div>
                    {item.quantity > 1 && (
                      <p className="text-xs text-text-muted mt-1 hidden sm:block">
                        ₪{item.price.toLocaleString()} {t('cart.perUnit')}
                      </p>
                    )}
                  </div>

                  {/* Desktop: stepper + price */}
                  <div className="hidden sm:flex items-center gap-4 shrink-0">
                    <QuantityStepper value={item.quantity} onChange={q => updateQty(item.item_id, q)} min={1} />
                    <div className="min-w-[80px] text-start">
                      <p className="text-xl font-black text-brand-purple">₪{lineTotal.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(item.item_id)}
                    className="text-text-muted hover:text-red-500 transition-colors shrink-0 p-1"
                    aria-label={t('cart.removeItem')}
                  >
                    <Icon name="delete" className="text-xl" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* ── Shipping + Contact form ── */}
          <div
            data-form-section
            className="bg-card-bg border border-border-light rounded-2xl p-5 sm:p-6 flex flex-col gap-6"
          >

            {/* Section: shipping method */}
            <div>
              <h2 className="text-base font-black text-text-main mb-4 flex items-center gap-2">
                <Icon name="local_shipping" className="text-primary text-lg" />
                {t('cart.shippingMethod')}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(['delivery', 'pickup'] as const).map(opt => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => { setShipping(opt); setStoreId(''); setErrors({}); }}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 text-sm font-semibold transition-all text-start
                      ${shipping === opt
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-border-light text-text-muted hover:border-primary/40'}`}
                  >
                    <Icon
                      name={opt === 'delivery' ? 'local_shipping' : 'store'}
                      className={`text-2xl shrink-0 ${shipping === opt ? 'text-primary' : 'text-text-muted'}`}
                    />
                    <span>
                      <span className="block font-bold">
                        {opt === 'delivery' ? t('cart.shippingDelivery') : t('cart.shippingPickup')}
                      </span>
                      <span className="block text-xs font-normal opacity-70">
                        {opt === 'delivery' ? t('cart.shippingDeliveryNote') : t('cart.shippingPickupNote')}
                      </span>
                    </span>
                  </button>
                ))}
              </div>

              {/* Store selector (pickup only) */}
              {shipping === 'pickup' && (
                <div className="mt-4">
                  <label className="block text-xs font-bold text-text-muted mb-1.5 uppercase tracking-wide">
                    {t('cart.selectStore')}<span className="text-red-500 mr-1">*</span>
                  </label>
                  <select
                    value={storeId}
                    onChange={e => { setStoreId(e.target.value); setErrors(prev => ({ ...prev, store: undefined })); }}
                    className={`w-full bg-page-bg border rounded-xl px-4 py-3 text-sm text-text-main
                                focus:outline-none focus:ring-2 focus:ring-primary/40 transition-colors
                                ${errors.store ? 'border-red-400' : 'border-border-light'}`}
                  >
                    <option value="">{t('cart.selectStorePlaceholder')}</option>
                    {STORES.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                  {errors.store && <p className="text-red-500 text-xs mt-1">{errors.store}</p>}
                </div>
              )}
            </div>

            {/* Section: contact details */}
            <div>
              <h2 className="text-base font-black text-text-main mb-4 flex items-center gap-2">
                <Icon name="person" className="text-primary text-lg" />
                {t('cart.contactDetails')}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Field
                    label={t('cart.fullName')} required
                    value={contact.fullName}
                    onChange={v => setField('fullName', v)}
                    placeholder="ישראל ישראלי"
                    error={errors.fullName}
                  />
                </div>
                <Field
                  label={t('cart.phone')} required type="tel"
                  value={contact.phone}
                  onChange={v => setField('phone', v)}
                  placeholder="05X-XXX-XXXX"
                  error={errors.phone}
                />
                <Field
                  label={t('cart.email')} required type="email"
                  value={contact.email}
                  onChange={v => setField('email', v)}
                  placeholder="example@email.com"
                  error={errors.email}
                />
                {shipping === 'delivery' && (
                  <div className="sm:col-span-2">
                    <Field
                      label={t('cart.address')} required
                      value={contact.address}
                      onChange={v => setField('address', v)}
                      placeholder={t('cart.addressPlaceholder')}
                      error={errors.address}
                    />
                  </div>
                )}
                <div className="sm:col-span-2">
                  <Field
                    label={t('cart.note')}
                    value={contact.note}
                    onChange={v => setField('note', v)}
                    placeholder={t('cart.notePlaceholder')}
                    multiline
                  />
                </div>
              </div>
            </div>

            {/* Coupon */}
            <div>
              <p className="text-xs font-bold text-text-muted mb-2 uppercase tracking-wide">
                {t('cart.couponLabel')}
              </p>
              <CouponInput onApply={code => console.log('[cart] coupon:', code)} />
            </div>
          </div>

          {/* ── "אולי יעניין אותך גם" carousel ── */}
          {suggested.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-text-main flex items-center gap-1.5">
                  <Icon name="auto_awesome" className="text-xs text-primary" />
                  {t('cart.alsoLike')}
                </h2>
                <div className="flex gap-1">
                  <button
                    onClick={() => scrollCarousel('right')}
                    className="w-7 h-7 rounded-full border border-border-light flex items-center justify-center
                               text-text-muted hover:border-primary hover:text-primary transition-colors"
                    aria-label="הקודם"
                  >
                    <Icon name="chevron_right" className="text-base" />
                  </button>
                  <button
                    onClick={() => scrollCarousel('left')}
                    className="w-7 h-7 rounded-full border border-border-light flex items-center justify-center
                               text-text-muted hover:border-primary hover:text-primary transition-colors"
                    aria-label="הבא"
                  >
                    <Icon name="chevron_left" className="text-base" />
                  </button>
                </div>
              </div>
              <div
                ref={carouselRef}
                className="flex gap-3 overflow-x-auto pb-2"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {suggested.map(product => (
                  <a
                    key={product.id}
                    href={`/items/${product.id}`}
                    className="shrink-0 w-36 sm:w-40 bg-card-bg border border-border-light rounded-xl p-2.5
                               flex flex-col gap-2 hover:border-primary hover:shadow-md transition-all group"
                  >
                    <div className="w-full h-24 bg-white rounded-lg overflow-hidden flex items-center justify-center">
                      {product.image
                        ? <img src={product.image} alt={product.title} className="object-contain w-full h-full p-1" loading="lazy" />
                        : <Icon name="image" className="text-3xl text-text-muted" />}
                    </div>
                    <p className="text-xs font-semibold text-text-main leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                      {product.title}
                    </p>
                    {product.price > 0 && (
                      <p className="text-sm font-black text-primary">₪{product.price.toLocaleString()}</p>
                    )}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ══════════════════════════════════════════
            RIGHT SIDEBAR — summary + actions
        ══════════════════════════════════════════ */}
        <div className="w-full lg:w-80 shrink-0">
          {/* Sticky wrapper on desktop only */}
          <div className="lg:sticky lg:top-24 flex flex-col gap-4">

            {/* Order summary card */}
            <div className="bg-card-bg border border-border-light rounded-2xl p-5 shadow-lg">
              <h2 className="text-lg font-black mb-5 border-b border-border-light pb-3">
                {t('cart.orderSummary')}
              </h2>

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

              {/* Checkout CTA */}
              <Button
                variant="primary"
                size="lg"
                className="w-full text-base lg:text-lg py-3.5 flex items-center justify-center gap-2 group"
                onClick={handleCheckout}
              >
                {t('cart.checkout')}
                <Icon name="arrow_back" className="group-hover:-translate-x-1 transition-transform" />
              </Button>

              {/* Print quote button */}
              <button
                type="button"
                onClick={() => printCart(cartItems, subtotal, contact, shipping, selectedStoreName)}
                className="mt-3 w-full flex items-center justify-center gap-2 text-sm font-semibold
                           bg-card-bg text-text-main border border-border-light rounded-xl py-2.5
                           hover:bg-primary/10 hover:border-primary hover:text-primary transition-colors"
              >
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
                  <Icon name="shield" className="text-lg text-brand-purple shrink-0" />
                  <span>{t('cart.securePayment')}</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-text-muted">
                  <Icon name="undo" className="text-lg text-brand-purple shrink-0" />
                  <span>{t('cart.returnPolicy')}</span>
                </div>
              </div>
            </div>

            {/* Loyalty points */}
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
