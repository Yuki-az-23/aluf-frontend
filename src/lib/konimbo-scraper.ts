import type { Product, ItemDetail } from '@/data/products';

const BASE_URL = 'https://alufshop.konimbo.co.il';

export interface BannerSlide {
  image: string;
  href: string;
  alt: string;
}

export interface BannerData {
  desktop: BannerSlide[];
  mobile: BannerSlide[];
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

/** Parse product elements from a given container */
export function parseProductElements(container: ParentNode, baseUrl: string = BASE_URL): Product[] {
  const items = container.querySelectorAll('.layout_list_item.item');
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
        href: href.startsWith('http') ? href : (href ? baseUrl + href.trim() : ''),
      });
    }
  });

  return products;
}

/** Scrape product data from Konimbo DOM before it's hidden */
export function scrapeProducts(): Product[] {
  return parseProductElements(document);
}

/** Scrape item detail from a single product page DOM */
export function scrapeItemDetail(): ItemDetail | null {
  const titleEl = document.querySelector('h1, .item_title, .product-title');
  const title = titleEl?.textContent?.trim() || '';
  if (!title) return null;

  const images: string[] = [];
  const imgEls = document.querySelectorAll('.item_image img, .product-gallery img, .splide__slide img');
  imgEls.forEach((img) => {
    const src = img.getAttribute('src') || img.getAttribute('data-splide-lazy') || '';
    if (src && !images.includes(src)) images.push(src);
  });

  const priceEl = document.querySelector('.price, .item_price');
  const priceText = priceEl?.textContent?.replace(/[^\d.]/g, '') || '0';
  const price = parseInt(priceText, 10) || 0;

  const origPriceEl = document.querySelector('.origin_price, .item_origin_price');
  const origText = origPriceEl?.textContent?.replace(/[^\d.]/g, '') || '';
  const originalPrice = parseInt(origText, 10) || undefined;

  const descEl = document.querySelector('.item_description, .product-description');
  const descriptionHtml = descEl?.innerHTML?.trim() || '';

  const specs: string[] = [];
  const specEls = document.querySelectorAll('.item_specs li, .product-specs li');
  specEls.forEach((li) => {
    const text = li.textContent?.trim();
    if (text) specs.push(text);
  });

  const outOfStockEl = document.querySelector('.out-of-stock');
  const bodyText = document.body.textContent || '';
  const inStock = !outOfStockEl && !bodyText.includes('אזל מהמלאי');

  const metaId = document.querySelector('meta[name="item-id"]')?.getAttribute('content') || '';
  const dataId = document.querySelector('[data-item-id]')?.getAttribute('data-item-id') || '';
  const urlMatch = window.location.pathname.match(/\/items\/([^/?#]+)/);
  const id = metaId || dataId || urlMatch?.[1] || '';

  return {
    id,
    title,
    images,
    price,
    originalPrice,
    descriptionHtml,
    specs,
    inStock,
  };
}

/** Scrape breadcrumb navigation */
export function scrapeBreadcrumbs(): BreadcrumbItem[] {
  const container = document.querySelector('.breadcrumb, .breadcrumbs, nav[aria-label="breadcrumb"]');
  if (!container) return [];

  const items: BreadcrumbItem[] = [];
  const links = container.querySelectorAll('a, span, li');
  const seen = new Set<string>();

  links.forEach((el) => {
    const label = el.textContent?.trim() || '';
    if (!label || seen.has(label)) return;
    seen.add(label);

    const anchor = el.tagName === 'A' ? el : el.querySelector('a');
    const href = anchor?.getAttribute('href') || undefined;

    items.push({ label, href: href || undefined });
  });

  // Last item should have no href (current page)
  if (items.length > 0) {
    delete items[items.length - 1].href;
  }

  return items;
}

/** Scrape category page title */
export function scrapeCategoryTitle(): string {
  const el = document.querySelector('h1, .category_title, .page_title');
  return el?.textContent?.trim() || '';
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

/** Scrape banner carousel slides from Konimbo Splide modules */
export function scrapeBanners(): BannerData {
  function extractSlides(containerSelector: string): BannerSlide[] {
    const slides: BannerSlide[] = [];
    const els = document.querySelectorAll(
      `${containerSelector} .splide__slide:not(.splide__slide--clone)`
    );
    els.forEach((slide) => {
      const a = slide.querySelector('a[href]');
      const img = slide.querySelector('img');
      const href = a?.getAttribute('href') || '';
      const image =
        img?.getAttribute('src') ||
        img?.getAttribute('data-splide-lazy') ||
        '';
      const alt = img?.getAttribute('alt') || '';
      if (image) {
        slides.push({
          image,
          href: href.startsWith('/') ? BASE_URL + href : href,
          alt,
        });
      }
    });
    return slides;
  }

  return {
    desktop: extractSlides('#module_233235_desktop'),
    mobile: extractSlides('#module_233235_mobile'),
  };
}
