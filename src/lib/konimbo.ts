export function getCookie(name: string): string | null {
  try {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
  } catch {
    return null;
  }
}

export function setCookie(name: string, value: string, hours = -1): void {
  let expires = '';
  if (hours > 0) {
    const date = new Date();
    date.setTime(date.getTime() + hours * 3600000);
    expires = '; expires=' + date.toUTCString();
  }
  document.cookie = name + '=' + encodeURIComponent(value) + expires + '; path=/';
}

export function getCartCount(): number {
  const raw = getCookie('num_of_cart_items');
  const num = parseInt(raw || '0', 10);
  return isNaN(num) ? 0 : num;
}

export function isLoggedIn(): boolean {
  return !!getCookie('current_customer_logged_in_css');
}

export function getPageType(): string {
  // 0. Dev mock override (set by public/dev-mock.local.js)
  const devOverride = (window as any).__ALUF_DEV_PAGE_TYPE__ as string | undefined;
  if (devOverride) return devOverride;

  // 1. Explicit meta tag (set via Konimbo admin)
  const meta = document.querySelector('meta[name="aluf-page"]');
  const metaType = meta?.getAttribute('content') || '';
  if (metaType && ['home', 'category', 'items', 'item', 'cart', 'workshop', 'blog', 'blogpost'].includes(metaType)) {
    return metaType;
  }

  // 2. URL-based auto-detection fallback
  const path = window.location.pathname;

  if (/^\/items\//.test(path)) return 'item';
  if (/^\/tags\//.test(path)) return 'items';
  if (/^\/search(\?|$)/.test(path)) return 'items';
  if (/^\/(cart|orders)(\/|$)/.test(path)) return 'cart';
  if (/^\/632283-/.test(path)) return 'blog';

  // 3. DOM-based detection for category vs item pages
  if (document.getElementById('layout_x_item')) return 'item';
  if (document.getElementById('layout_x_category')) return 'category';

  // 4. Generic numeric-ID path pattern → likely a category
  if (/^\/\d{5,}-/.test(path)) return 'category';

  return 'home';
}

export function getPageData(): Record<string, string> {
  try {
    const el = document.getElementById('aluf-page-data');
    return el ? JSON.parse(el.textContent || '{}') : {};
  } catch {
    return {};
  }
}

export function getKonimboConfig(): Record<string, string> {
  try {
    const el = document.getElementById('aluf-konimbo-config');
    return el ? JSON.parse(el.textContent || '{}') : {};
  } catch {
    return {};
  }
}

export interface CartProductInfo {
  title?: string;
  price?: number;
  image?: string;
  category?: string;
}

function getStoreName(): string {
  try {
    const raw = localStorage.getItem('jStorage');
    if (raw) {
      const keys = Object.keys(JSON.parse(raw));
      const cartKey = keys.find(k => k.startsWith('cart_') && k !== 'cart_www');
      if (cartKey) return cartKey.replace('cart_', '');
    }
  } catch {}
  const hostname = window.location.hostname;
  if (hostname.indexOf('aluf.co.il') > -1) return 'alufshop';
  if (hostname.indexOf('.konimbo.co.il') > -1) return hostname.split('.')[0];
  return 'alufshop';
}

function getCartCookieDomain(): string {
  const hostname = window.location.hostname;
  if (hostname.indexOf('aluf.co.il') > -1) return '.aluf.co.il';
  if (hostname.indexOf('.konimbo.co.il') > -1) return '.konimbo.co.il';
  return hostname;
}

function buildCartRowHtml(itemId: string, quantity: number, info: CartProductInfo): string {
  const title = info.title || '';
  const price = info.price || 0;
  const priceFormatted = price.toLocaleString('he-IL') + ' ₪';
  const imageUrl = info.image || '';

  const tr = document.createElement('tr');
  tr.setAttribute('data-id', 'item_id_' + itemId);
  tr.setAttribute('style', 'height: auto; max-height: 999px;');

  const td1 = document.createElement('td');
  const qtyDiv = document.createElement('div');
  qtyDiv.className = 'quantity';
  qtyDiv.textContent = String(quantity);
  const btnDiv = document.createElement('div');
  btnDiv.className = 'cart_small_button';
  const aMinus = document.createElement('a');
  aMinus.className = 'reduce';
  aMinus.textContent = '-';
  const aPlus = document.createElement('a');
  aPlus.className = 'plus';
  aPlus.textContent = '+';
  btnDiv.appendChild(aMinus);
  btnDiv.appendChild(aPlus);
  td1.appendChild(qtyDiv);
  td1.appendChild(btnDiv);

  const td2 = document.createElement('td');
  td2.className = 'img_item';
  const img = document.createElement('img');
  img.src = imageUrl;
  td2.appendChild(img);

  const td3 = document.createElement('td');
  td3.className = 'title';
  const aTitle = document.createElement('a');
  aTitle.href = '/items/' + itemId;
  aTitle.textContent = title;
  td3.appendChild(aTitle);

  const td4 = document.createElement('td');
  td4.className = 'delete_btn';
  td4.appendChild(document.createElement('a'));

  const td5 = document.createElement('td');
  td5.className = 'price_item_x';
  td5.textContent = priceFormatted;

  tr.append(td1, td2, td3, td4, td5);
  return tr.outerHTML;
}

export interface OrderItem {
  item_id: string;
  item_name: string;
  price: number;
  quantity: number;
  item_image?: string;
  item_category?: string;
}

/**
 * Build the flying_cart_with_upgrades_json array Konimbo's checkout reads.
 * Format confirmed from live Konimbo checkout HTML inspection.
 */
function buildFlyingCartJson(items: OrderItem[]): object[] {
  return items.map(item => ({
    item_id: Number(item.item_id),
    quantity: item.quantity,
    upgrade_topics: [],
    upgrade_price_additions: [],
    item_name: item.item_name || '',
    item_price: item.price || 0,
  }));
}

/**
 * Rebuild ALL Konimbo jStorage cart keys from the current items array.
 * Writes:
 *   cart_{storeName}               — HTML <tr> rows  (cart_content)
 *   flying_cart_with_upgrades_json — JSON array       (order payload)
 * Must be called whenever cart changes so the checkout form has correct data.
 */
export function syncCartToJStorage(items: OrderItem[]): void {
  try {
    const storeName = getStoreName();
    const cartKey = 'cart_' + storeName;
    let jStorage: Record<string, unknown> = { __jstorage_meta: { CRC32: {}, TTL: {} } };
    try {
      const raw = localStorage.getItem('jStorage');
      if (raw) jStorage = JSON.parse(raw);
    } catch {}

    // 1. Rebuild HTML cart rows
    let cartHtml = '';
    for (const item of items) {
      cartHtml += buildCartRowHtml(item.item_id, item.quantity, {
        title: item.item_name,
        price: item.price,
        image: item.item_image,
      });
    }
    jStorage[cartKey] = cartHtml;

    // 2. Rebuild flying_cart_with_upgrades_json
    jStorage['flying_cart_with_upgrades_json'] = buildFlyingCartJson(items);

    // 3. Bump CRC so Konimbo's jStorage listener picks up the change
    const meta = jStorage['__jstorage_meta'] as Record<string, Record<string, string>>;
    if (meta?.['CRC32']) {
      const stamp = '2.' + Math.floor(Math.random() * 10000000000);
      meta['CRC32'][cartKey] = stamp;
      meta['CRC32']['flying_cart_with_upgrades_json'] = stamp;
    }
    localStorage.setItem('jStorage', JSON.stringify(jStorage));
    localStorage.setItem('jStorage_update', String(+new Date()));
  } catch (err) {
    console.error('[aluf] syncCartToJStorage failed:', err);
  }
}

export async function addToCart(
  itemId: string,
  quantity: number = 1,
  productInfo: CartProductInfo = {}
): Promise<{ success: boolean; cartCount: number }> {
  try {
    // 1. Read & update order_items
    let orderItems: Array<Record<string, unknown>> = [];
    try {
      const raw = localStorage.getItem('order_items');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) orderItems = parsed;
      }
    } catch {}

    const existingIdx = orderItems.findIndex(i => String(i['item_id']) === String(itemId));
    if (existingIdx > -1) {
      orderItems[existingIdx]['quantity'] = ((orderItems[existingIdx]['quantity'] as number) || 1) + quantity;
    } else {
      orderItems.push({
        item_id: String(itemId),
        item_name: productInfo.title || '',
        price: productInfo.price || 0,
        quantity,
        item_category: productInfo.category || '',
        item_image: productInfo.image || '',
      });
    }
    localStorage.setItem('order_items', JSON.stringify(orderItems));

    // 2. Update cookie
    const totalItems = orderItems.reduce((sum, i) => sum + ((i['quantity'] as number) || 1), 0);
    const domain = getCartCookieDomain();
    document.cookie = `num_of_cart_items=${totalItems}; path=/; domain=${domain}`;

    // 3. Update jStorage cart HTML for mini-cart display
    const storeName = getStoreName();
    const cartKey = 'cart_' + storeName;
    let jStorage: Record<string, unknown> = { __jstorage_meta: { CRC32: {}, TTL: {} } };
    try {
      const raw = localStorage.getItem('jStorage');
      if (raw) jStorage = JSON.parse(raw);
    } catch {}

    const currentCart = (jStorage[cartKey] as string) || '';
    if (currentCart.indexOf('data-id="item_id_' + itemId + '"') === -1) {
      jStorage[cartKey] = currentCart + buildCartRowHtml(itemId, quantity, productInfo);
    }

    // Rebuild flying_cart_with_upgrades_json from the full order_items list
    jStorage['flying_cart_with_upgrades_json'] = buildFlyingCartJson(
      orderItems.map(i => ({
        item_id: String(i['item_id']),
        item_name: String(i['item_name'] || ''),
        price: Number(i['price'] || 0),
        quantity: Number(i['quantity'] || 1),
        item_image: String(i['item_image'] || ''),
        item_category: String(i['item_category'] || ''),
      }))
    );

    const meta = jStorage['__jstorage_meta'] as Record<string, Record<string, string>>;
    if (meta?.['CRC32']) {
      const stamp = '2.' + Math.floor(Math.random() * 10000000000);
      meta['CRC32'][cartKey] = stamp;
      meta['CRC32']['flying_cart_with_upgrades_json'] = stamp;
    }
    localStorage.setItem('jStorage', JSON.stringify(jStorage));
    localStorage.setItem('jStorage_update', String(+new Date()));

    // 4. Fire Konimbo/jQuery events
    try {
      const jq = (window as unknown as Record<string, unknown>)['jQuery'] as ((selector: unknown) => { trigger: (e: string) => void }) | undefined;
      if (typeof jq === 'function') {
        jq(document).trigger('cart:updated');
        jq(document).trigger('order_items:updated');
        const jStorage = (jq as unknown as Record<string, Record<string, () => void>>)['jStorage'];
        if (jStorage?.['reInit']) jStorage['reInit']();
      }
    } catch {}

    return { success: true, cartCount: totalItems };
  } catch (err) {
    console.error('[aluf] addToCart failed:', err);
    return { success: false, cartCount: getCartCount() };
  }
}
