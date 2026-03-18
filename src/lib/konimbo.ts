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

export async function addToCart(
  itemId: string,
  quantity: number = 1
): Promise<{ success: boolean; cartCount: number }> {
  try {
    const body = new URLSearchParams({
      'item[id]': itemId,
      'item[quantity]': String(quantity),
    });
    const res = await fetch('/cart/add_ajax', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Requested-With': 'XMLHttpRequest',
      },
      body: body.toString(),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    let newCount = getCartCount() + quantity;
    try {
      const text = await res.text();
      const match = text.match(/num_of_cart_items[=:](\d+)/);
      if (match) newCount = parseInt(match[1], 10);
    } catch {}
    setCookie('num_of_cart_items', String(newCount));
    return { success: true, cartCount: newCount };
  } catch (err) {
    console.error('[aluf] addToCart failed:', err);
    return { success: false, cartCount: getCartCount() };
  }
}
