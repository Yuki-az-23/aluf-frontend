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
  RELATED_CAROUSEL_SELECTORS,
} from './lib/konimbo-scraper';
import { getPageType } from './lib/konimbo';
import './theme/tokens.css';

// ── Patch Konimbo's native HTML for accessibility & SEO ──────────────────────
// 1. Remove maximum-scale=1 so users can pinch-zoom (WCAG 1.4.4)
(function patchViewport() {
  const vp = document.querySelector<HTMLMetaElement>('meta[name="viewport"]');
  if (vp) {
    vp.content = vp.content
      .replace(/,?\s*maximum-scale=\d+(\.\d+)?/gi, '')
      .replace(/,?\s*user-scalable=no/gi, '');
  }
})();

// 2. Konimbo's quantity widget uses bare <a class="reduce/plus"> without href —
//    give them role="button" so they are treated as interactive elements by crawlers.
(function patchBareAnchors() {
  document.querySelectorAll<HTMLAnchorElement>('a:not([href])').forEach(a => {
    if (!a.getAttribute('role')) a.setAttribute('role', 'button');
    if (!a.getAttribute('tabindex')) a.setAttribute('tabindex', '0');
  });
})();
// ─────────────────────────────────────────────────────────────────────────────

const root = document.getElementById('aluf-root');
if (root) {
  // Dev mock: if public/dev-mock.local.js pre-loaded data, use it and skip scraping
  const devMock = (window as any).__ALUF_SCRAPED__;
  const devPageType = (window as any).__ALUF_DEV_PAGE_TYPE__ as string | undefined;
  const usingMock = !!(devMock && devPageType);

  const pageType = usingMock ? devPageType! : getPageType();

  // Pages where Konimbo lazy-renders items on scroll
  const isProductListPage = pageType === 'items' || pageType === 'category';
  const isProductPage = pageType === 'home' || isProductListPage;

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

  function mountReactApp() {
    if (!root) return; // TypeScript guard — outer if(root) guarantees this

    // Re-scrape products for list pages: Konimbo may have rendered more items
    // during the scroll simulation that runs before this function is called.
    if (isProductListPage && !usingMock) {
      const fresh = scrapeProducts();
      if (fresh.length > scrapedData.products.length) {
        scrapedData.products = fresh;
        scrapedData.filterGroups = scrapeFilterGroups();
        (window as any).__ALUF_SCRAPED__ = { ...scrapedData };
      }
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
        '<a href="javascript:location.reload()" style="color:#CC4400;font-weight:bold;">\u05DC\u05D7\u05E5 \u05DB\u05D0\u05DF \u05DC\u05E8\u05E2\u05E0\u05D5\u05DF</a></div>';
    }

    // 5a. MutationObserver: watch for Konimbo lazy-loading products into the DOM.
    //     Konimbo may render products incrementally (e.g. first 12, then more as
    //     the page continues loading). We keep watching until the count stabilises.
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
        // Check all known Konimbo carousel selectors
        let carousel: Element | null = null;
        for (const sel of RELATED_CAROUSEL_SELECTORS) {
          const el = document.querySelector(sel);
          if (el && (el.querySelectorAll('a[href*="/items/"]').length > 0 || el.querySelectorAll('em.quantity_true').length > 0)) { carousel = el; break; }
        }
        const hasItems = !!carousel;
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
  }

  // For items/category pages: Konimbo lazy-renders products on scroll via IntersectionObserver/AJAX.
  // Repeatedly scroll down to trigger each batch, then wait for the DOM to stabilize
  // (no new items for 400 ms) before mounting React. Cap at 4 seconds total.
  if (isProductListPage && !usingMock) {
    const STABLE_MS  = 400;  // ms without new items → consider fully loaded
    const MAX_MS     = 4000; // hard cap regardless of stability
    const TICK_MS    = 200;  // check interval

    const countItems = () =>
      document.querySelectorAll('.layout_list_item.item, .layout_list_item, [id^="item_id_"]').length;

    let lastCount  = countItems();
    let stableFor  = 0;
    const start    = Date.now();

    // Scroll to bottom immediately to trigger first batch
    window.scrollTo(0, document.body.scrollHeight);

    const ticker = setInterval(() => {
      // Keep scrolling — each new batch extends the page height
      window.scrollTo(0, document.body.scrollHeight);

      const now = countItems();
      if (now !== lastCount) {
        lastCount = now;
        stableFor = 0;          // new items appeared — reset stability clock
      } else {
        stableFor += TICK_MS;
      }

      const elapsed = Date.now() - start;
      if (stableFor >= STABLE_MS || elapsed >= MAX_MS) {
        clearInterval(ticker);
        window.scrollTo(0, 0);
        mountReactApp();
      }
    }, TICK_MS);
  } else {
    mountReactApp();
  }
} else {
  console.error('[aluf] #aluf-root element not found');
}
