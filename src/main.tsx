import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { scrapeProducts, scrapeCategories, scrapeCategoryGroups, scrapeBanners, scrapeItemDetail, scrapeBreadcrumbs, scrapeCategoryTitle, scrapeBlogPosts, scrapeBlogPostDetail } from './lib/konimbo-scraper';
import { getPageType } from './lib/konimbo';
import './theme/tokens.css';

const root = document.getElementById('aluf-root');
if (root) {
  // 1. Scrape Konimbo DOM data BEFORE hiding it
  const pageType = getPageType();
  const scrapedData = {
    products: scrapeProducts(),
    categories: scrapeCategories(),
    categoryGroups: scrapeCategoryGroups(),
    banners: scrapeBanners(),
    itemDetail: pageType === 'item' ? scrapeItemDetail() : null,
    breadcrumbs: ['category', 'items', 'item', 'blog', 'blogpost'].includes(pageType) ? scrapeBreadcrumbs() : [],
    pageTitle: ['category', 'items', 'blog'].includes(pageType) ? scrapeCategoryTitle() : '',
    blogPosts: pageType === 'blog' ? scrapeBlogPosts() : [],
    blogPostDetail: pageType === 'blogpost' ? scrapeBlogPostDetail() : null,
  };

  // Store on window so StoreDataProvider can access it synchronously
  (window as any).__ALUF_SCRAPED__ = scrapedData;

  // 2. Move #aluf-root to be a direct child of <body>
  // (Konimbo injects it inside #wrapper, which our CSS would hide)
  if (root.parentElement !== document.body) {
    document.body.appendChild(root);
  }

  // 3. NOW hide Konimbo content
  document.body.classList.add('aluf-loaded');

  // 4. Mount React
  try {
    createRoot(root).render(
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
} else {
  console.error('[aluf] #aluf-root element not found');
}
