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

/** Parse product elements from a given container.
 * @param allowZeroPrice  Pass true for carousel/related contexts where prices may not be rendered.
 */
export function parseProductElements(container: ParentNode, baseUrl: string = BASE_URL, allowZeroPrice = false): Product[] {
  const products: Product[] = [];
  const seen = new Set<string>();

  // Multiple selectors to handle different Konimbo page layouts
  const selectors = [
    '.layout_list_item.item',
    '.layout_list_item',
    '[id^="item_id_"]',
    '.item[data-item-id]',
    'em.quantity_true',   // Konimbo matchingCarousel / #matchingCarouselHook items
  ];

  let items: NodeListOf<Element> | null = null;
  for (const sel of selectors) {
    const found = container.querySelectorAll(sel);
    if (found.length > 0) { items = found; break; }
  }
  if (!items) return products;

  items.forEach((el) => {
    // id: standard attrs, or the hidden checkbox value used by the matchingCarousel
    const checkboxId = el.querySelector('input.old_checkbox, input[name="item_ids[]"]')?.getAttribute('value') || '';
    const id = (el.id?.replace('item_id_', '') || el.getAttribute('data-item-id') || checkboxId).trim();
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

    // Find href for this product — strip whitespace Konimbo may inject into href attrs
    const linkEl =
      el.querySelector('a[href*="/items/"]') ||
      el.querySelector('a[href*="items"]') ||
      el.querySelector('a.item_link') ||
      el.querySelector('a[href]');
    const rawHref = (linkEl?.getAttribute('href') || '').replace(/\s/g, '');
    const href = makeAbsolute(rawHref);

    // Specs from list items inside the product card
    const specs: string[] = [];
    el.querySelectorAll('.item_specs li, .specs li, .properties li').forEach((li) => {
      const text = li.textContent?.trim();
      if (text) specs.push(text);
    });

    if (title && (price > 0 || allowZeroPrice)) {
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

/** All Konimbo carousel / related-items container selectors, in priority order */
export const RELATED_CAROUSEL_SELECTORS = [
  '#matchingCarouselHook',
  '#item_also_buy',
  '#alsoViewed',
  '#related_items',
  '.matching_items',
  '.related_items',
  '.related_products',
  '.related-products',
  '[data-module-type="related_items"]',
  '.module_related_items',
];

/** Scrape related products from item detail page */
export function scrapeRelatedItems(): Product[] {
  for (const hookSel of RELATED_CAROUSEL_SELECTORS) {
    const hook = document.querySelector(hookSel);
    if (!hook) continue;

    // Try parseProductElements first (allowZeroPrice so carousel thumbnails aren't filtered out)
    const products = parseProductElements(hook, BASE_URL, true);
    if (products.length > 0) return products;

    // Fallback: extract from anchor links directly.
    // Use a[href] (not just a[href*="/items/"]) because Konimbo may inject whitespace
    // into href values (e.g. "https://aluf.co.il/\nitems/123"), breaking the CSS selector.
    const seen = new Set<string>();
    const fallback: Product[] = [];
    hook.querySelectorAll('a[href]').forEach((a) => {
      const rawHref = (a.getAttribute('href') || '').replace(/\s/g, '');
      const urlMatch = rawHref.match(/\/items\/([^/?#]+)/);
      const id = urlMatch?.[1] || '';
      if (!id || seen.has(id)) return;
      seen.add(id);
      const href = makeAbsolute(rawHref);
      const container = a.closest('li, tr, div[id^="item_id_"], .layout_list_item') || a.parentElement;
      const title = container?.querySelector('b, h4, .title')?.textContent?.trim() || a.textContent?.trim() || '';
      const imgEl = container?.querySelector('img') as HTMLImageElement | null;
      const image =
        imgEl?.getAttribute('data-src') ||
        imgEl?.getAttribute('data-large') ||
        imgEl?.getAttribute('src') || '';
      const priceText = container?.querySelector('.price, .item_price, i')?.textContent?.replace(/[^\d]/g, '') || '0';
      const price = parseInt(priceText, 10) || 0;
      if (title) fallback.push({ id, title, category: '', image, specs: [], price, inStock: true, href });
    });
    if (fallback.length > 0) return fallback;
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
  const selectors = [
    '.pagination a[rel="next"]',
    '.next_page a',
    'a.pagination_next',
    '.pagination .next a',
    '.pages_navigation a[rel="next"]',
    'a.next_page',
    '[data-action="infinite-scroll"]',
    '.infinite_scroll_trigger a',
    'a[data-infinite-scroll]',
  ];
  for (const sel of selectors) {
    const el = document.querySelector<HTMLAnchorElement>(sel);
    if (el?.href) return el.href;
  }
  return null;
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

/** Scrape blog post listings from Konimbo DOM.
 *  Works on the blog list page (.layout_list_item.item) and also
 *  on home-page blog widgets (.homepage_blog, .blog_widget, etc.)
 */
export function scrapeBlogPosts(): BlogPostItem[] {
  const posts: BlogPostItem[] = [];

  // Selectors tried in order — first one that yields items wins
  const candidateSelectors = [
    '.layout_list_item.item',           // blog list page
    '.homepage_blog .item',             // Konimbo home blog widget
    '.blog_widget .item',
    '.blog_items .item',
    '.home_blog_item',
  ];

  let items: NodeListOf<Element> | null = null;
  for (const sel of candidateSelectors) {
    const found = document.querySelectorAll(sel);
    if (found.length > 0) { items = found; break; }
  }
  if (!items) return posts;

  items.forEach((el, idx) => {
    const id = el.id?.replace('item_id_', '') || String(idx);

    const titleEl = el.querySelector('h4.title, .title, h3, h4');
    const title = titleEl?.textContent?.trim() || '';

    const imgEl = el.querySelector('img');
    const image = imgEl?.getAttribute('src') || '';

    const dateEl = el.querySelector('.date, .item_date, .created_at');
    const date = dateEl?.textContent?.trim() || '';

    const excerptEl = el.querySelector('.description, .item_description, .excerpt');
    const excerpt = excerptEl?.textContent?.trim() || '';

    // Use a[href] + whitespace-strip (same pattern as scrapeRelatedItems) because
    // Konimbo may inject newlines into href attributes, breaking the CSS *="/items/" selector.
    const linkEl = el.querySelector('a[href]');
    const rawHref = (linkEl?.getAttribute('href') || '').replace(/\s/g, '');
    const href = makeAbsolute(rawHref);

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

  // Images — same cascade as scrapeItemDetail: prefer #lightSlider (full-res), then fallbacks
  let image = '';
  const lightSliderFirst = document.querySelector('#lightSlider li');
  if (lightSliderFirst) {
    const src =
      lightSliderFirst.getAttribute('data-src') ||
      (lightSliderFirst.querySelector('img') as HTMLImageElement | null)?.getAttribute('data-src') ||
      (lightSliderFirst.querySelector('img') as HTMLImageElement | null)?.src || '';
    if (src && !src.includes('placeholder') && !src.includes('blank')) image = src;
  }
  if (!image) {
    const imgEl = document.querySelector(
      '#main_photo, .item_image img, .product-gallery img, img.img-responsive, ' +
      '.item_show_images img, .item_single_images img, .blog_post img, article img, main img'
    ) as HTMLImageElement | null;
    image =
      imgEl?.getAttribute('data-large') ||
      imgEl?.getAttribute('data-src') ||
      imgEl?.getAttribute('data-original') ||
      imgEl?.getAttribute('src') || '';
  }

  const dateEl = document.querySelector('.date, .item_date, .created_at, time[datetime], .published_at');
  const date = dateEl?.textContent?.trim() || '';

  // Content — try Konimbo's standard product desc selector first, then blog-specific fallbacks
  const contentEl = document.querySelector(
    '#item_content .desc, .item_description, .product-description, .item_body, .description, ' +
    '.item_content, .blog_post_content, .post_content, .blog_content, .blog_post .content, ' +
    'article .content, [class*="blog"] .content, [class*="post"] .content'
  );
  const contentHtml = contentEl?.innerHTML?.trim() || '';

  return { title, image, date, contentHtml };
}

export interface FilterOption {
  label: string;
  /** Full URL to navigate to when this option is selected */
  href: string;
}

export interface FilterGroup {
  id: string;
  title: string;
  options: FilterOption[];
}

/**
 * Scrape filter groups from Konimbo's own filter sidebar.
 * Konimbo renders a `.show_filters .group` list where each group has a `<b>` title
 * and `.group_values` anchors with pre-built filtered URLs.
 * Selecting a filter navigates to Konimbo's filtered URL (server-side filtering).
 */
export function scrapeFilterGroups(): FilterGroup[] {
  const groups: FilterGroup[] = [];

  // Primary: Konimbo subcategory pages — .show_filters .group
  const groupEls = document.querySelectorAll('.show_filters .group');
  groupEls.forEach((groupEl, idx) => {
    const titleEl = groupEl.querySelector('b');
    const title = titleEl?.textContent?.trim() || '';
    if (!title) return;

    const options: FilterOption[] = [];
    groupEl.querySelectorAll('.group_values a[href], .group_value a[href]').forEach((a) => {
      const label = a.textContent?.trim() || '';
      const href = makeAbsolute(a.getAttribute('href') || '');
      if (label && href) options.push({ label, href });
    });

    if (options.length > 0) {
      groups.push({ id: String(idx), title, options });
    }
  });

  if (groups.length > 0) return groups;

  // Fallback: alternative Konimbo filter sidebar layouts
  const altSelectors = [
    '.filter_categories_list .filter_group',
    '.store_filter_group',
    '.filter_list .filter_group',
  ];
  for (const sel of altSelectors) {
    document.querySelectorAll(sel).forEach((groupEl, idx) => {
      const titleEl = groupEl.querySelector(
        '.filter_group_title, .store_filter_group_title, h3, h4, b'
      );
      const title = titleEl?.textContent?.trim() || '';
      if (!title) return;

      const options: FilterOption[] = [];
      groupEl.querySelectorAll('a[href]').forEach((a) => {
        const label = a.textContent?.trim() || '';
        const href = makeAbsolute(a.getAttribute('href') || '');
        if (label && href) options.push({ label, href });
      });

      if (options.length > 0) {
        groups.push({ id: String(idx), title, options });
      }
    });
    if (groups.length > 0) break;
  }

  return groups;
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

export interface TierProduct {
  title: string;
  price: number;
  specs: string[];
  href: string;
}

/**
 * Fetch live tier data from a Konimbo tag page.
 *
 * Konimbo admin setup:
 *  1. Create 3 products, tag each with the given tag (default: "gaming-tier")
 *  2. Set each product's short description to pipe-separated specs:
 *     e.g. "Intel i5-13400F | RTX 4060 | 16GB DDR5 | 512GB NVMe SSD"
 *  3. Order products by position (1 = entry, 2 = performance, 3 = ultimate)
 *
 * Returns an empty array if the tag page is unreachable or has no products,
 * so the caller can fall back to hardcoded data.
 */
export async function fetchTierProducts(tag = 'gaming-tier'): Promise<TierProduct[]> {
  try {
    const url = `${BASE_URL}/tags/${encodeURIComponent(tag)}`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const products = parseProductElements(doc, BASE_URL, false);
    return products.slice(0, 3).map(p => {
      const itemEl = doc.getElementById(`item_id_${p.id}`);
      const descEl = itemEl?.querySelector('.description, .item_description, .short_description');
      const descText = descEl?.textContent?.trim() || '';
      const specs = descText
        ? descText.split(/\s*\|\s*|\n/).map(s => s.trim()).filter(Boolean)
        : (p.specs ?? []);
      return { title: p.title, price: p.price, specs, href: p.href ?? '' };
    });
  } catch {
    return [];
  }
}
