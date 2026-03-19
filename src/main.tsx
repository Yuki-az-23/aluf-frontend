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
} from './lib/konimbo-scraper';
import { getPageType } from './lib/konimbo';
import './theme/tokens.css';

const root = document.getElementById('aluf-root');
if (root) {
  const pageType = getPageType();

  // 1. Synchronous first scrape (catches data already in DOM)
  const itemDetailRaw = pageType === 'item' ? scrapeItemDetail() : null;
  const relatedItems = pageType === 'item' ? scrapeRelatedItems() : [];

  if (itemDetailRaw) {
    itemDetailRaw.relatedItems = relatedItems;
  }

  const scrapedData = {
    products: scrapeProducts(),
    categories: scrapeCategories(),
    categoryGroups: scrapeCategoryGroups(),
    banners: scrapeBanners(),
    itemDetail: itemDetailRaw,
    breadcrumbs: ['category', 'items', 'item', 'blog', 'blogpost'].includes(pageType)
      ? scrapeBreadcrumbs()
      : [],
    pageTitle: ['category', 'items', 'blog'].includes(pageType) ? scrapeCategoryTitle() : '',
    blogPosts: pageType === 'blog' ? scrapeBlogPosts() : [],
    blogPostDetail: pageType === 'blogpost' ? scrapeBlogPostDetail() : null,
  };

  // Store on window so StoreDataProvider can access it synchronously
  (window as any).__ALUF_SCRAPED__ = scrapedData;

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

  // 5a. MutationObserver: if products were empty (Konimbo lazy-loads them),
  //     watch for them to appear, re-scrape, and trigger a React re-render.
  const needsProductReScrape =
    (pageType === 'home' || pageType === 'items' || pageType === 'category') &&
    scrapedData.products.length === 0;

  if (needsProductReScrape && reactRoot) {
    let retries = 0;
    const maxRetries = 30; // 3 seconds max (every 100ms)

    const observer = new MutationObserver(() => {
      const newProducts = scrapeProducts();
      if (newProducts.length > 0) {
        observer.disconnect();
        // Update the global data and dispatch event for context to pick up
        scrapedData.products = newProducts;
        if (pageType === 'home') {
          scrapedData.banners = scrapeBanners();
        }
        (window as any).__ALUF_SCRAPED__ = { ...scrapedData };
        window.dispatchEvent(new CustomEvent('aluf:products-ready', { detail: newProducts }));
      } else {
        retries++;
        if (retries >= maxRetries) {
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
} else {
  console.error('[aluf] #aluf-root element not found');
}
