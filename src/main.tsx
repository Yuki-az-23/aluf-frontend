import { StrictMode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { App } from './App';
import {
  scrapeProducts,
  scrapeCategories,
  scrapeCategoryGroups,
  scrapeBanners,
  scrapeItemDetail,
  scrapeRelatedItems,
  scrapeBreadcrumbs,
  scrapeCategoryTitle,
  scrapeBlogPosts,
  scrapeBlogPostDetail,
  scrapeFilterGroups,
} from './lib/konimbo-scraper';
import { getPageType } from './lib/konimbo';
import './theme/tokens.css';

const root = document.getElementById('aluf-root');
if (root) {
  // Dev mock: if public/dev-mock.local.js pre-loaded data, use it and skip scraping
  const devMock = (window as any).__ALUF_SCRAPED__;
  const devPageType = (window as any).__ALUF_DEV_PAGE_TYPE__ as string | undefined;
  const usingMock = !!(devMock && devPageType);

  const pageType = usingMock ? devPageType! : getPageType();

  let scrapedData: typeof devMock;

  if (usingMock) {
    // Already set by dev-mock.local.js — no DOM scraping needed
    scrapedData = devMock;
  } else {
    // 1. Synchronous first scrape (catches data already in DOM)
    const itemDetailRaw = pageType === 'item' ? scrapeItemDetail() : null;
    const relatedItems = pageType === 'item' ? scrapeRelatedItems() : [];

    if (itemDetailRaw) {
      itemDetailRaw.relatedItems = relatedItems;
    }

    scrapedData = {
      products: scrapeProducts(),
      categories: scrapeCategories(),
      categoryGroups: scrapeCategoryGroups(),
      banners: scrapeBanners(),
      itemDetail: itemDetailRaw,
      breadcrumbs: ['category', 'items', 'item', 'blog', 'blogpost'].includes(pageType)
        ? scrapeBreadcrumbs()
        : [],
      pageTitle: ['category', 'items', 'blog'].includes(pageType) ? scrapeCategoryTitle() : '',
      blogPosts: ['blog', 'home'].includes(pageType) ? scrapeBlogPosts() : [],
      blogPostDetail: pageType === 'blogpost' ? scrapeBlogPostDetail() : null,
      filterGroups: ['items', 'category'].includes(pageType) ? scrapeFilterGroups() : [],
    };

    // Store on window so StoreDataProvider can access it synchronously
    (window as any).__ALUF_SCRAPED__ = scrapedData;
  }

  // 2. Move #aluf-root to be a direct child of <body>
  if (root.parentElement !== document.body) {
    document.body.appendChild(root);
  }

  // 3. NOW hide Konimbo content
  document.body.classList.add('aluf-loaded');

  // 4. Mount React
  let reactRoot: Root | null = null;
  try {
    reactRoot = createRoot(root);
    reactRoot.render(
      <StrictMode>
        <App />
      </StrictMode>
    );
  } catch (err) {
    console.error('[aluf] React render failed:', err);
    document.body.classList.remove('aluf-loaded');
    root.innerHTML =
      '<div style="text-align:center;padding:40px;font-family:Heebo,sans-serif;">' +
      '<p style="font-size:18px;margin-bottom:16px;">\u05E9\u05D2\u05D9\u05D0\u05D4 \u05D1\u05D8\u05E2\u05D9\u05E0\u05EA \u05D4\u05D0\u05EA\u05E8</p>' +
      '<p style="font-size:14px;color:#666;">' + (err instanceof Error ? err.message : String(err)) + '</p>' +
      '<a href="javascript:location.reload()" style="color:#FF6B00;font-weight:bold;">\u05DC\u05D7\u05E5 \u05DB\u05D0\u05DF \u05DC\u05E8\u05E2\u05E0\u05D5\u05DF</a></div>';
  }

  // 5a. MutationObserver: watch for Konimbo lazy-loading products into the DOM.
  //     Konimbo may render products incrementally (e.g. first 12, then more as
  //     the page continues loading). We keep watching until the count stabilises.
  const isProductPage = pageType === 'home' || pageType === 'items' || pageType === 'category';

  if (isProductPage && reactRoot) {
    let lastCount = scrapedData.products.length;
    let stableRounds = 0;
    const maxStableRounds = 10; // disconnect after ~1s with no new products
    const maxTotalRetries = 60;  // hard cap at 6 seconds total
    let totalRetries = 0;

    const observer = new MutationObserver(() => {
      totalRetries++;
      const newProducts = scrapeProducts();
      if (newProducts.length > lastCount) {
        // New products appeared — update and notify React, keep watching
        lastCount = newProducts.length;
        stableRounds = 0;
        scrapedData.products = newProducts;
        if (pageType === 'home') scrapedData.banners = scrapeBanners();
        // Re-scrape filter groups now that more products are in DOM
        if (['items', 'category'].includes(pageType)) {
          scrapedData.filterGroups = scrapeFilterGroups();
        }
        (window as any).__ALUF_SCRAPED__ = { ...scrapedData };
        window.dispatchEvent(new CustomEvent('aluf:products-ready', { detail: newProducts }));
      } else {
        stableRounds++;
        if (stableRounds >= maxStableRounds || totalRetries >= maxTotalRetries) {
          observer.disconnect();
        }
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  // 5b. MutationObserver: if item detail page is missing price/images (Konimbo lazy-loads),
  //     keep re-scraping until we get meaningful data.
  const needsItemReScrape =
    pageType === 'item' &&
    (!scrapedData.itemDetail || scrapedData.itemDetail.price === 0 || scrapedData.itemDetail.images.length === 0);

  if (needsItemReScrape && reactRoot) {
    let itemRetries = 0;
    const itemMaxRetries = 50; // 5 seconds max (every 100ms)

    const itemObserver = new MutationObserver(() => {
      const newItem = scrapeItemDetail();
      if (newItem && (newItem.price > 0 || newItem.images.length > 0)) {
        itemObserver.disconnect();
        newItem.relatedItems = scrapeRelatedItems();
        scrapedData.itemDetail = newItem;
        scrapedData.breadcrumbs = scrapeBreadcrumbs();
        (window as any).__ALUF_SCRAPED__ = { ...scrapedData };
        window.dispatchEvent(new CustomEvent('aluf:item-ready', { detail: newItem }));
      } else {
        itemRetries++;
        if (itemRetries >= itemMaxRetries) itemObserver.disconnect();
      }
    });

    itemObserver.observe(document.body, { childList: true, subtree: true });
  }

  // 5c. Poll for #matchingCarouselHook on item pages.
  //     The carousel widget loads independently (often several seconds after price/images).
  //     Using setInterval instead of MutationObserver so retries = real time, not DOM mutations
  //     (MutationObserver can exhaust retries in <1s on a busy Konimbo page).
  if (pageType === 'item' && reactRoot) {
    const INTERVAL = 200;    // ms between checks
    const MAX_ATTEMPTS = 75; // 75 × 200ms = 15 seconds max
    let attempts = 0;

    const relatedTimer = setInterval(() => {
      attempts++;
      const carousel = document.querySelector('#matchingCarouselHook');
      const hasItems = carousel && carousel.querySelectorAll('a[href*="/items/"]').length > 0;
      if (hasItems) {
        clearInterval(relatedTimer);
        const related = scrapeRelatedItems();
        if (related.length > 0 && scrapedData.itemDetail) {
          scrapedData.itemDetail.relatedItems = related;
          (window as any).__ALUF_SCRAPED__ = { ...scrapedData };
          window.dispatchEvent(new CustomEvent('aluf:item-ready', { detail: scrapedData.itemDetail }));
        }
      } else if (attempts >= MAX_ATTEMPTS) {
        clearInterval(relatedTimer);
      }
    }, INTERVAL);
  }
} else {
  console.error('[aluf] #aluf-root element not found');
}
