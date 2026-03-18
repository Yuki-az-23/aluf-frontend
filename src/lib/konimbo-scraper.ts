import type { Product } from '@/data/products';

const BASE_URL = 'https://alufshop.konimbo.co.il';

/** Scrape product data from Konimbo DOM before it's hidden */
export function scrapeProducts(): Product[] {
  const items = document.querySelectorAll('.layout_list_item.item');
  const products: Product[] = [];

  items.forEach((el) => {
    const id = el.id?.replace('item_id_', '') || '';
    if (!id) return;

    const titleEl = el.querySelector('h4.title, .title');
    const title = titleEl?.textContent?.trim() || '';

    const imgEl = el.querySelector('img.img-responsive');
    const image = imgEl?.getAttribute('src') || '';

    const priceEl = el.querySelector('.price');
    const priceText = priceEl?.textContent?.replace(/[^\d.]/g, '') || '0';
    const price = parseInt(priceText, 10) || 0;

    const origPriceEl = el.querySelector('.origin_price');
    const origText = origPriceEl?.textContent?.replace(/[^\d.]/g, '') || '';
    const originalPrice = parseInt(origText, 10) || undefined;

    const category = el.getAttribute('data-category-title') || '';

    const linkEl = el.querySelector('a[href*="/items/"]');
    const href = linkEl?.getAttribute('href') || '';

    if (title && price > 0) {
      products.push({
        id,
        title,
        category,
        image,
        specs: [],
        price,
        originalPrice,
        inStock: true,
        href: href.startsWith('http') ? href : (href ? BASE_URL + href.trim() : ''),
      });
    }
  });

  return products;
}

export interface KonimboCategory {
  title: string;
  href: string;
}

/** Scrape navigation categories from Konimbo DOM */
export function scrapeCategories(): KonimboCategory[] {
  const cats: KonimboCategory[] = [];
  const seen = new Set<string>();

  // Scrape from the store_categories nav
  const links = document.querySelectorAll('.store_categories a[href]');
  links.forEach((a) => {
    const title = a.textContent?.trim() || '';
    let href = a.getAttribute('href') || '';
    if (!title || seen.has(title)) return;
    seen.add(title);
    // Make URLs absolute pointing to the test domain
    if (href.startsWith('/')) {
      href = BASE_URL + href;
    } else if (href.includes('www.aluf.co.il')) {
      href = href.replace('https://www.aluf.co.il', BASE_URL);
      href = href.replace('http://www.aluf.co.il', BASE_URL);
    }
    cats.push({ title, href });
  });

  return cats;
}

/** Scrape category groups (top-level sections like "מחשבים נייחים", "מעבדים") */
export function scrapeCategoryGroups(): { group: string; items: KonimboCategory[] }[] {
  const groups: { group: string; items: KonimboCategory[] }[] = [];
  const groupEls = document.querySelectorAll('.store_categories .store_category_group_title');

  groupEls.forEach((groupEl) => {
    const groupName = groupEl.textContent?.trim() || '';
    if (!groupName) return;

    // Get following sibling li elements until next group title
    const items: KonimboCategory[] = [];
    let sibling = groupEl.nextElementSibling;
    while (sibling && !sibling.classList.contains('store_category_group_title')) {
      const a = sibling.querySelector('a[href]');
      if (a) {
        const title = a.textContent?.trim() || '';
        let href = a.getAttribute('href') || '';
        if (href.startsWith('/')) href = BASE_URL + href;
        else if (href.includes('www.aluf.co.il')) {
          href = href.replace('https://www.aluf.co.il', BASE_URL);
          href = href.replace('http://www.aluf.co.il', BASE_URL);
        }
        if (title) items.push({ title, href });
      }
      sibling = sibling.nextElementSibling;
    }

    if (items.length > 0) {
      // Deduplicate
      const existing = groups.find(g => g.group === groupName);
      if (!existing) groups.push({ group: groupName, items });
    }
  });

  return groups;
}
