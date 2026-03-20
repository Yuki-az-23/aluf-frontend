import type { Product, ItemDetail, SpecRow, BlogPostItem, BlogPostDetail } from '@/data/products';

// Resolve against the actual runtime origin so links work on any domain/subdomain
const BASE_URL = typeof window !== 'undefined' ? window.location.origin : 'https://alufshop.konimbo.co.il';

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

/** Re-base any URL (relative or absolute) to the current runtime origin */
function makeAbsolute(href: string): string {
  if (!href) return '';
  if (href.startsWith('http')) {
    // DOM links may already be absolute with aluf.co.il or konimbo subdomain —
    // strip to pathname so the link works on whatever domain is actually running
    try {
      const u = new URL(href);
      return BASE_URL + u.pathname + u.search + u.hash;
    } catch {
      return href;
    }
  }
  if (href.startsWith('/')) return BASE_URL + href;
  return href;
}

/** Parse product elements from a given container */
export function parseProductElements(container: ParentNode, baseUrl: string = BASE_URL): Product[] {
  const products: Product[] = [];
  const seen = new Set<string>();

  // Multiple selectors to handle different Konimbo page layouts
  const selectors = [
    '.layout_list_item.item',
    '.layout_list_item',
    '[id^="item_id_"]',
    '.item[data-item-id]',
  ];

  let items: NodeListOf<Element> | null = null;
  for (const sel of selectors) {
    const found = container.querySelectorAll(sel);
    if (found.length > 0) { items = found; break; }
  }
  if (!items) return products;

  items.forEach((el) => {
    const id = (el.id?.replace('item_id_', '') || el.getAttribute('data-item-id') || '').trim();
    if (!id || seen.has(id)) return;

    const titleEl = el.querySelector('h4.title, .title a, .title, h4, .item_title');
    const title = titleEl?.textContent?.trim() || '';

    // Image: try all lazy-load attrs before falling back to src
    const imgEl = el.querySelector('img');
    const image =
      imgEl?.getAttribute('data-large') ||
      imgEl?.getAttribute('data-src') ||
      imgEl?.getAttribute('data-original') ||
      imgEl?.getAttribute('data-splide-lazy') ||
      imgEl?.getAttribute('data-lazy') ||
      imgEl?.getAttribute('src') || '';

    const priceEl = el.querySelector('.price .whole, .price, .item_price');
    const priceText = priceEl?.textContent?.replace(/[^\d.]/g, '') || '0';
    const price = parseInt(priceText, 10) || 0;

    const origPriceEl = el.querySelector('.origin_price, .strikethrough_price');
    const origText = origPriceEl?.textContent?.replace(/[^\d.]/g, '') || '';
    const originalPrice = parseInt(origText, 10) || undefined;

    const category = el.getAttribute('data-category-title') || '';

    // Collect Konimbo filter attributes (data-filter-N="value")
    const filterAttrs: Record<string, string> = {};
    Array.from(el.attributes).forEach(attr => {
      if (attr.name.startsWith('data-filter-') && attr.value) {
        filterAttrs[attr.name.replace('data-filter-', '')] = attr.value;
      }
    });

    // Find href for this product
    const linkEl =
      el.querySelector('a[href*="/items/"]') ||
      el.querySelector('a.item_link') ||
      el.querySelector('a[href]');
    const rawHref = linkEl?.getAttribute('href') || '';
    const href = makeAbsolute(rawHref);

    // Specs from list items inside the product card
    const specs: string[] = [];
    el.querySelectorAll('.item_specs li, .specs li, .properties li').forEach((li) => {
      const text = li.textContent?.trim();
      if (text) specs.push(text);
    });

    if (title && price > 0) {
      seen.add(id);
      products.push({
        id, title, category, image, specs, price, originalPrice, inStock: true, href,
        ...(Object.keys(filterAttrs).length ? { filterAttrs } : {}),
      });
    }
  });

  return products;
}

/** Scrape product data from Konimbo DOM before it's hidden */
export function scrapeProducts(): Product[] {
  return parseProductElements(document);
}

/** Parse spec rows as key-value pairs from Konimbo item detail page */
function parseSpecRows(doc: Document): SpecRow[] {
  const rows: SpecRow[] = [];

  // Approach 0: Konimbo #item_specifications — actual live DOM structure
  // Each <li> has <b>label</b> <span class="he_false|he_true">value</span>
  const konimboLis = doc.querySelectorAll('#item_specifications .specifications ul li');
  if (konimboLis.length > 0) {
    konimboLis.forEach((li) => {
      const label = li.querySelector('b')?.textContent?.trim() || '';
      const value = li.querySelector('span')?.textContent?.trim() || '';
      if (label && value) rows.push({ label, value });
    });
    if (rows.length > 0) return rows;
  }

  // Approach 1: legacy/other Konimbo layouts — table-based
  const tableSelectors = [
    '#item_properties .item_properties_table tr',
    '#item_properties table tr',
    '.item_properties .item_properties_table tr',
    '.item_properties table tr',
    '.product-specs table tr',
    '.item_specs table tr',
    '.spec_table tr',
    '.properties_table tr',
  ];
  for (const sel of tableSelectors) {
    const trs = doc.querySelectorAll(sel);
    if (trs.length > 0) {
      trs.forEach((tr) => {
        // Konimbo uses .property_name and .property_value classes
        const nameEl = tr.querySelector('.property_name') || tr.querySelector('td:first-child, th:first-child');
        const valueEl = tr.querySelector('.property_value') || tr.querySelector('td:last-child, th:last-child');
        const label = nameEl?.textContent?.trim() || '';
        const value = valueEl?.textContent?.trim() || '';
        if (label && value && label !== value) rows.push({ label, value });
      });
      if (rows.length > 0) return rows;
    }
  }

  // Approach 2: definition list (dl/dt/dd)
  const dlSelectors = ['.item_properties dl', '.product-specs dl', '.item_specs dl'];
  for (const sel of dlSelectors) {
    const dl = doc.querySelector(sel);
    if (dl) {
      const dts = dl.querySelectorAll('dt');
      dts.forEach((dt) => {
        const label = dt.textContent?.trim() || '';
        const dd = dt.nextElementSibling;
        const value = dd?.textContent?.trim() || '';
        if (label && value) rows.push({ label, value });
      });
      if (rows.length > 0) return rows;
    }
  }

  // Approach 3: property rows with .property_name / .property_value structure
  const propRows = doc.querySelectorAll('.item_properties .property, .item_property');
  if (propRows.length > 0) {
    propRows.forEach((row) => {
      const label =
        row.querySelector('.property_name, .label, .key')?.textContent?.trim() || '';
      const value =
        row.querySelector('.property_value, .value')?.textContent?.trim() || '';
      if (label && value) rows.push({ label, value });
    });
    if (rows.length > 0) return rows;
  }

  // Approach 4: Try to find any two-column structure inside .item_properties
  const propsContainer = doc.querySelector(
    '.item_properties, .product-details table, .specs-list'
  );
  if (propsContainer) {
    // Look for pairs of spans/divs side by side
    const items = propsContainer.querySelectorAll('li, .row, .spec-row');
    items.forEach((item) => {
      const children = item.querySelectorAll('span, div, b, strong');
      if (children.length >= 2) {
        const label = children[0].textContent?.trim() || '';
        const value = children[1].textContent?.trim() || '';
        if (label && value && label !== value) rows.push({ label, value });
      } else {
        // Try splitting text by colon
        const text = item.textContent?.trim() || '';
        const colonIdx = text.indexOf(':');
        if (colonIdx > 0) {
          const label = text.slice(0, colonIdx).trim();
          const value = text.slice(colonIdx + 1).trim();
          if (label && value) rows.push({ label, value });
        }
      }
    });
  }

  return rows;
}

/** Scrape item detail from a single product page DOM */
export function scrapeItemDetail(): ItemDetail | null {
  // Title — Konimbo uses h1.item-name (from live DOM inspection)
  // Title — Konimbo uses #item_current_title h1 (span inside h1)
  const titleEl = document.querySelector(
    '#item_current_title h1, #item_current_title h1 span, h1.item-name, h1.item_title, h1.item_name, h1.product-title, .item_title h1, h1'
  );
  const title = titleEl?.textContent?.trim() || '';
  if (!title) return null;

  // SKU — Konimbo uses .code_item or .cataloge_number li span
  const skuEl = document.querySelector('.code_item, .cataloge_number li span, .item-sku, .item_number, .sku, [itemprop="sku"]');
  const sku = skuEl?.textContent?.trim().replace(/מק"ט\s*:?\s*/i, '') || '';

  // Images — Konimbo uses #lightSlider ul: each <li data-src="fullsize"> contains <img src="large">
  const images: string[] = [];

  const lightSliderItems = document.querySelectorAll('#lightSlider li');
  if (lightSliderItems.length > 0) {
    lightSliderItems.forEach((li) => {
      // Prefer data-src on the <li> (extra_large quality), fall back to img src (large)
      const src =
        li.getAttribute('data-src') ||
        (li.querySelector('img') as HTMLImageElement | null)?.src || '';
      if (src && !src.includes('placeholder') && !src.includes('blank') && !images.includes(src)) {
        images.push(src);
      }
    });
  }

  // Fallback: older Konimbo layouts (#main_photo, Splide, etc.)
  if (images.length === 0) {
    const pickSrc = (el: HTMLImageElement) =>
      el.getAttribute('data-large') ||
      el.getAttribute('data-src') ||
      el.getAttribute('data-original') ||
      el.getAttribute('data-splide-lazy') ||
      el.getAttribute('data-lazy') ||
      el.src || '';

    const mainPhoto = document.querySelector('#main_photo') as HTMLImageElement | null;
    if (mainPhoto) {
      const src = pickSrc(mainPhoto);
      if (src && !src.includes('placeholder') && !src.includes('blank')) images.push(src);
    }
    document.querySelectorAll('#additional_photos img, #more_photos img, .item_small_photos img').forEach((img) => {
      const src = pickSrc(img as HTMLImageElement);
      if (src && !src.includes('placeholder') && !src.includes('blank') && !images.includes(src)) images.push(src);
    });
    if (images.length === 0) {
      for (const sel of ['.item_image img', '.product-gallery img', '.splide__slide:not(.splide__slide--clone) img', '.item_images img', '#main_photo_container img', '.item-image img']) {
        document.querySelectorAll(sel).forEach((img) => {
          const src = pickSrc(img as HTMLImageElement);
          if (src && !src.includes('placeholder') && !src.includes('blank') && !images.includes(src)) images.push(src);
        });
        if (images.length > 0) break;
      }
    }
  }

  // Price — Konimbo uses #item_show_price .price_value with numeric `content` attribute
  const priceEl = document.querySelector(
    '#item_show_price .price_value, .item_price_value, #item_price_container .item_price_value, .item_price .price, .item_price, .price.main_price'
  );
  const priceText = priceEl?.getAttribute('content') || priceEl?.textContent?.replace(/[^\d.]/g, '') || '0';
  const price = parseFloat(priceText) || 0;

  // Original price — Konimbo uses .item_show_origin_price .origin_price_number
  const origPriceEl = document.querySelector(
    '.item_show_origin_price .origin_price_number, .origin_price, .item_origin_price, .strikethrough_price'
  );
  const origText = origPriceEl?.textContent?.replace(/[^\d.]/g, '') || '';
  const originalPrice = parseInt(origText, 10) || undefined;

  // FAQ — Konimbo embeds structured JSON in #faq_raw_data_seo inside the description
  let faqItems: { question: string; answer: string }[] = [];
  const faqRawEl = document.querySelector('#faq_raw_data_seo');
  if (faqRawEl) {
    try {
      const parsed = JSON.parse(faqRawEl.textContent || '[]');
      if (Array.isArray(parsed)) {
        faqItems = parsed
          .map((item: Record<string, string>) => ({ question: item['question'] || '', answer: item['answer'] || '' }))
          .filter((item) => item.question && item.answer);
      }
    } catch { /* malformed JSON — skip */ }
  }

  // Description HTML — Konimbo uses #item_content .desc
  // Strip FAQ markup, hidden SEO divs, and Konimbo AI context so only clean prose remains
  const descEl = document.querySelector(
    '#item_content .desc, .item_description, .product-description, .item_body, .description'
  );
  let descriptionHtml = '';
  if (descEl) {
    const clone = descEl.cloneNode(true) as Element;
    clone.querySelectorAll('#faq_raw_data_seo, .faq__bt--list, #ai_agent_context').forEach((el) => el.remove());
    descriptionHtml = clone.innerHTML.trim();
  }

  // Specs — flat list from #item_specifications (also backward compat selectors)
  const specs: string[] = [];
  document.querySelectorAll('#item_specifications .specifications ul li, .item_specs li, .product-specs li, .properties li').forEach((li) => {
    const text = li.textContent?.trim();
    if (text) specs.push(text);
  });

  // Spec rows — key/value pairs
  const specRows = parseSpecRows(document);

  // In stock
  const outOfStockEl = document.querySelector('.out-of-stock, .out_of_stock, .out_of_stock_button');
  const bodyText = document.body?.textContent || '';
  const inStock = !outOfStockEl && !bodyText.includes('אזל מהמלאי') && !bodyText.includes('אין במלאי');

  // Warranty — Konimbo uses #item_warranty
  const warrantyEl = document.querySelector('#item_warranty');
  const warranty = warrantyEl?.textContent?.trim() || undefined;

  // ID from multiple sources
  const metaId = document.querySelector('meta[name="item-id"]')?.getAttribute('content') || '';
  const dataId = document.querySelector('[data-item-id]')?.getAttribute('data-item-id') || '';
  const urlMatch = window.location.pathname.match(/\/items\/([^/?#]+)/);
  const id = metaId || dataId || urlMatch?.[1] || '';

  // Related items are scraped separately
  return {
    id,
    title,
    sku: sku || undefined,
    images,
    price,
    originalPrice,
    descriptionHtml,
    specs,
    specRows,
    relatedItems: [],
    inStock,
    warranty,
    faqItems: faqItems.length > 0 ? faqItems : undefined,
  };
}

/** Scrape related products from item detail page */
export function scrapeRelatedItems(): Product[] {
  // Konimbo "also bought" — #matchingCarouselHook (XPath: #matchingCarouselHook/div/div[1])
  const carouselHook = document.querySelector('#matchingCarouselHook');
  if (carouselHook) {
    // Try parseProductElements first (handles .layout_list_item / [id^="item_id_"])
    const products = parseProductElements(carouselHook);
    if (products.length > 0) return products;

    // Fallback: extract from anchor links inside the carousel
    const seen = new Set<string>();
    const fallback: Product[] = [];
    carouselHook.querySelectorAll('a[href*="/items/"]').forEach((a) => {
      const rawHref = a.getAttribute('href') || '';
      const urlMatch = rawHref.match(/\/items\/([^/?#]+)/);
      const id = urlMatch?.[1] || '';
      if (!id || seen.has(id)) return;
      seen.add(id);
      const href = makeAbsolute(rawHref);
      const container = a.closest('li, tr, div[id^="item_id_"], .layout_list_item') || a.parentElement;
      const title = container?.querySelector('b, h4, .title')?.textContent?.trim() || a.textContent?.trim() || '';
      const imgEl = container?.querySelector('img') as HTMLImageElement | null;
      const image = imgEl?.getAttribute('src') || imgEl?.getAttribute('data-src') || '';
      const priceText = container?.querySelector('.price, .item_price, i')?.textContent?.replace(/[^\d]/g, '') || '0';
      const price = parseInt(priceText, 10) || 0;
      if (title) fallback.push({ id, title, category: '', image, specs: [], price, inStock: true, href });
    });
    if (fallback.length > 0) return fallback;
  }

  // Fallback: legacy Konimbo layouts using .layout_list_item
  const selectors = [
    '.related_items .layout_list_item',
    '.related_products .layout_list_item',
    '#related_items .item',
    '.related-products .item',
    '[data-module-type="related_items"] .layout_list_item',
    '.module_related_items .layout_list_item',
  ];

  for (const sel of selectors) {
    const container = document.querySelector(sel.split(' ')[0]);
    if (container) {
      const products = parseProductElements(container.parentElement || document);
      if (products.length > 0) return products;
    }
    const direct = document.querySelectorAll(sel);
    if (direct.length > 0) {
      const fakeContainer = document.createElement('div');
      direct.forEach((el) => fakeContainer.appendChild(el.cloneNode(true)));
      const products = parseProductElements(fakeContainer);
      if (products.length > 0) return products;
    }
  }

  return [];
}

/** Scrape breadcrumb navigation */
export function scrapeBreadcrumbs(): BreadcrumbItem[] {
  const container = document.querySelector('#bread_crumbs, .breadcrumb, .breadcrumbs, nav[aria-label="breadcrumb"], .breadcrumb_path');
  if (!container) return [];

  const items: BreadcrumbItem[] = [];
  const seen = new Set<string>();

  // Prefer li-based breadcrumbs — avoids picking up separator spans
  const lis = container.querySelectorAll('li');
  if (lis.length > 0) {
    lis.forEach((li) => {
      const anchor = li.querySelector('a');
      const label = (anchor?.textContent || li.textContent || '').trim();
      // Skip separators (≤2 chars like >, /, », ·)
      if (!label || label.length <= 2 || seen.has(label)) return;
      seen.add(label);
      const href = anchor?.getAttribute('href') || undefined;
      items.push({ label, href: href ? makeAbsolute(href) : undefined });
    });
  } else {
    // Fallback: anchors then any remaining non-linked text spans
    container.querySelectorAll('a').forEach((a) => {
      const label = a.textContent?.trim() || '';
      if (!label || seen.has(label)) return;
      seen.add(label);
      items.push({ label, href: makeAbsolute(a.getAttribute('href') || '') });
    });
    container.querySelectorAll('span').forEach((span) => {
      const label = span.textContent?.trim() || '';
      if (!label || label.length <= 2 || seen.has(label)) return;
      seen.add(label);
      items.push({ label });
    });
  }

  // Last item should have no href (current page)
  if (items.length > 0) {
    delete items[items.length - 1].href;
  }

  return items;
}

/** Get the next pagination page URL from Konimbo DOM */
export function getNextPageUrl(): string | null {
  const sel = '.pagination a[rel="next"], .next_page a, a.pagination_next, .pagination .next a, .pages_navigation a[rel="next"]';
  const nextLink = document.querySelector<HTMLAnchorElement>(sel);
  return nextLink?.href || null;
}

/** Fetch a Konimbo category page and parse its products + next page link */
export async function fetchMoreProducts(url: string): Promise<{ products: Product[]; nextUrl: string | null }> {
  try {
    const res = await fetch(url);
    if (!res.ok) return { products: [], nextUrl: null };
    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const origin = new URL(url).origin;
    const products = parseProductElements(doc, origin);
    const nextSel = '.pagination a[rel="next"], .next_page a, a.pagination_next, .pagination .next a';
    const nextLink = doc.querySelector<HTMLAnchorElement>(nextSel);
    const nextHref = nextLink?.getAttribute('href') || null;
    const nextUrl = nextHref
      ? (nextHref.startsWith('http') ? nextHref : origin + (nextHref.startsWith('/') ? '' : '/') + nextHref)
      : null;
    return { products, nextUrl };
  } catch {
    return { products: [], nextUrl: null };
  }
}

/** Scrape category page title */
export function scrapeCategoryTitle(): string {
  const el = document.querySelector('h1, .category_title, .page_title, .store_category_title');
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

  const links = document.querySelectorAll('.store_categories a[href], .category_menu a[href], .main_menu a[href]');
  links.forEach((a) => {
    const title = a.textContent?.trim() || '';
    const rawHref = a.getAttribute('href') || '';
    if (!title || seen.has(title)) return;
    seen.add(title);
    cats.push({ title, href: makeAbsolute(rawHref) });
  });

  return cats;
}

/** Scrape category groups (top-level sections like "מחשבים נייחים", "מעבדים") */
export function scrapeCategoryGroups(): { group: string; items: KonimboCategory[] }[] {
  const groups: { group: string; items: KonimboCategory[] }[] = [];
  const groupEls = document.querySelectorAll(
    '.store_categories .store_category_group_title, .category_group_title'
  );

  groupEls.forEach((groupEl) => {
    const groupName = groupEl.textContent?.trim() || '';
    if (!groupName) return;

    const items: KonimboCategory[] = [];
    let sibling = groupEl.nextElementSibling;
    while (sibling && !sibling.classList.contains('store_category_group_title')) {
      const a = sibling.querySelector('a[href]');
      if (a) {
        const title = a.textContent?.trim() || '';
        const href = makeAbsolute(a.getAttribute('href') || '');
        if (title) items.push({ title, href });
      }
      sibling = sibling.nextElementSibling;
    }

    if (items.length > 0) {
      const existing = groups.find((g) => g.group === groupName);
      if (!existing) groups.push({ group: groupName, items });
    }
  });

  return groups;
}

/** Scrape blog post listings from Konimbo DOM */
export function scrapeBlogPosts(): BlogPostItem[] {
  const posts: BlogPostItem[] = [];
  const items = document.querySelectorAll('.layout_list_item.item');

  items.forEach((el) => {
    const id = el.id?.replace('item_id_', '') || '';
    if (!id) return;

    const titleEl = el.querySelector('h4.title, .title');
    const title = titleEl?.textContent?.trim() || '';

    const imgEl = el.querySelector('img');
    const image = imgEl?.getAttribute('src') || '';

    const dateEl = el.querySelector('.date, .item_date, .created_at');
    const date = dateEl?.textContent?.trim() || '';

    const excerptEl = el.querySelector('.description, .item_description, .excerpt');
    const excerpt = excerptEl?.textContent?.trim() || '';

    const linkEl = el.querySelector('a[href*="/items/"]');
    const href = makeAbsolute(linkEl?.getAttribute('href') || '');

    if (title) {
      posts.push({ id, title, image, excerpt, date, href });
    }
  });

  return posts;
}

/** Scrape a single blog post detail page */
export function scrapeBlogPostDetail(): BlogPostDetail | null {
  const titleEl = document.querySelector('h1, .item_title, .product-title');
  const title = titleEl?.textContent?.trim() || '';
  if (!title) return null;

  const imgEl = document.querySelector('.item_image img, .product-gallery img, img.img-responsive');
  const image = imgEl?.getAttribute('src') || '';

  const dateEl = document.querySelector('.date, .item_date, .created_at');
  const date = dateEl?.textContent?.trim() || '';

  const contentEl = document.querySelector('.item_description, .product-description');
  const contentHtml = contentEl?.innerHTML?.trim() || '';

  return { title, image, date, contentHtml };
}

export interface FilterGroup {
  id: string;
  title: string;
  options: string[];
}

/**
 * Scrape filter groups from Konimbo's filter sidebar + product data-filter-* attributes.
 * Konimbo embeds data-filter-N="value" on each product element; the filter sidebar
 * maps these IDs to human-readable group titles.
 */
export function scrapeFilterGroups(): FilterGroup[] {
  // 1. Try to extract group title mapping from Konimbo's filter sidebar
  const titleMap: Record<string, string> = {};
  const filterGroupSelectors = [
    '.store_filter_group',
    '.filter_categories_list .filter_group',
    '.filter_list .filter_group',
    '[data-filter-group-id]',
  ];
  for (const sel of filterGroupSelectors) {
    document.querySelectorAll(sel).forEach(el => {
      const id = el.getAttribute('data-filter-group-id') ||
                 el.getAttribute('data-filter-id') || '';
      const titleEl = el.querySelector(
        '.filter_group_title, .filter_title, .store_filter_group_title, h3, h4'
      );
      const title = titleEl?.textContent?.trim() || '';
      if (id && title) titleMap[id] = title;
    });
    if (Object.keys(titleMap).length > 0) break;
  }

  // 2. Collect all unique data-filter-* values from product elements in the DOM
  const attrGroups: Record<string, Set<string>> = {};
  const productSelectors = [
    '.layout_list_item.item',
    '.layout_list_item',
    '[id^="item_id_"]',
    '.item[data-item-id]',
  ];
  let productEls: NodeListOf<Element> | null = null;
  for (const sel of productSelectors) {
    const found = document.querySelectorAll(sel);
    if (found.length > 0) { productEls = found; break; }
  }
  if (productEls) {
    productEls.forEach(el => {
      Array.from(el.attributes).forEach(attr => {
        if (!attr.name.startsWith('data-filter-') || !attr.value) return;
        const key = attr.name.replace('data-filter-', '');
        if (!attrGroups[key]) attrGroups[key] = new Set<string>();
        // Konimbo values may be comma-separated
        attr.value.split(',').forEach(v => {
          const trimmed = v.trim();
          if (trimmed) attrGroups[key].add(trimmed);
        });
      });
    });
  }

  return Object.entries(attrGroups)
    .filter(([, vals]) => vals.size > 0)
    .map(([id, vals]) => ({
      id,
      title: titleMap[id] || id,
      options: Array.from(vals).sort((a, b) => a.localeCompare(b, 'he')),
    }));
}

/** Scrape banner carousel slides from Konimbo Splide modules */
export function scrapeBanners(): BannerData {
  function extractSlides(containerSelector: string): BannerSlide[] {
    const slides: BannerSlide[] = [];
    const container = document.querySelector(containerSelector);
    if (!container) return slides;

    const slideEls = container.querySelectorAll(
      '.splide__slide:not(.splide__slide--clone)'
    );
    slideEls.forEach((slide) => {
      const a = slide.querySelector('a[href]');
      const img = slide.querySelector('img');
      const href = makeAbsolute(a?.getAttribute('href') || '');
      const image =
        img?.getAttribute('data-src') ||
        img?.getAttribute('data-splide-lazy') ||
        img?.getAttribute('src') || '';
      const alt = img?.getAttribute('alt') || '';
      if (image) {
        slides.push({ image, href, alt });
      }
    });
    return slides;
  }

  const desktop = extractSlides('#module_233235_desktop') ||
    extractSlides('.banner_slider') ||
    extractSlides('[data-module-type="banner"] .splide');

  const mobile = extractSlides('#module_233235_mobile');

  // If no desktop slides found, try any splide on the page
  const fallback = desktop.length === 0 ? extractSlides('.splide') : [];

  return {
    desktop: desktop.length ? desktop : fallback,
    mobile,
  };
}
