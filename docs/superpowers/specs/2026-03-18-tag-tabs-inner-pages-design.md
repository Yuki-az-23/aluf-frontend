# Tag-Based Product Tabs + Inner Pages

**Date:** 2026-03-18
**Status:** Draft

## Overview

Replace the single "מוצרים מובילים" carousel on the homepage with a tabbed section that fetches products from Konimbo tag pages via AJAX. Also implement the placeholder inner pages (CategoryPage, ItemsGridPage, ItemPage) so navigation within the Konimbo-hosted site works end-to-end.

## Part 1: Homepage — Tabbed Product Carousels

### Tag Configuration

| Tab Label (Hebrew) | Tag Path | Tag ID |
|---|---|---|
| מוצרים חדשים | `/tags/211647-tag2` | 211647 |
| הרכבות מחשב | `/tags/211649-tag4` | 211649 |
| נמכרים ביותר | `/tags/211648-tag3` | 211648 |
| מוצרים מותאמים אישית | `/tags/246669-tag5` | 246669 |

### fetch-tag-products utility

**File:** `src/lib/fetch-tag-products.ts`

- `fetchTagProducts(tagPath: string): Promise<Product[]>`
- Fetches tag page HTML from Konimbo (same origin, e.g. `/tags/211647-tag2`)
- Parses response with `DOMParser`
- Reuses the same product selector logic from `konimbo-scraper.ts` (`.layout_list_item.item`) to extract products
- Extract into a shared `parseProductElements(container: ParentNode, baseUrl?: string): Product[]` function used by both the scraper and fetch utility. When called from the scraper (live DOM), `baseUrl` defaults to `BASE_URL`. When called from fetch (parsed document), pass `window.location.origin` to resolve relative URLs correctly.
- **Error handling:** Uses `AbortController` with 8s timeout. On failure (network error, timeout, non-OK status), returns `[]`. The UI shows an empty state message ("לא נמצאו מוצרים") — no retry mechanism.
- **Assumption:** Konimbo tag pages include product elements in static HTML (not JS-rendered). This has been validated by inspecting tag page source.

### TabbedProducts component

**File:** `src/components/commerce/TabbedProducts.tsx`

- Renders a horizontal tab bar with the 4 tag labels
- Below the tabs: a single `<Carousel>` showing the active tab's products
- First tab loads automatically on mount
- Other tabs load on click (lazy), then cache in state
- Shows a centered `<Spinner size="md" />` (existing component at `src/components/ui/Spinner.tsx`) while fetching
- Carousel config: `slidesPerView={{ mobile: 2, desktop: 4 }}`, `gap={24}`, `showArrows`

### Tab bar design

- Horizontal row of pill-style buttons, RTL aligned
- Active tab: `bg-primary text-white`
- Inactive tabs: `bg-gray-100 text-text-main hover:bg-gray-200`
- Scrollable on mobile if tabs overflow (using `overflow-x-auto`)

### Touch-friendly carousel improvements

**File:** `src/components/ui/Carousel.tsx`

The carousel already uses native scroll (`overflow-x-auto`). Additions:
- Add `touch-action: pan-x` to the track element to ensure smooth horizontal touch scrolling
- Add CSS `cursor: grab` / `cursor: grabbing` for mouse drag support on desktop
- Add mouse drag-to-scroll support: `mousedown` → track mouse movement → `scrollLeft` adjustment
- Ensure `scroll-snap-type: x mandatory` works well with touch on tablets

### HomePage changes

**File:** `src/pages/HomePage.tsx`

- Replace the current Featured Products `<section>` with `<TabbedProducts />`
- Remove the direct `products` usage from `useStoreData()` in this section
- The scraped products from `useStoreData()` are still used elsewhere (fallback, other pages)

### i18n additions

Add to all locale files:

**he.json:**
```json
"products.tabs.new": "מוצרים חדשים",
"products.tabs.builds": "הרכבות מחשב",
"products.tabs.bestSellers": "נמכרים ביותר",
"products.tabs.custom": "מוצרים מותאמים אישית",
"products.empty": "לא נמצאו מוצרים",
"item.addToCart": "הוסף לסל",
"item.outOfStock": "אזל מהמלאי",
"item.description": "תיאור המוצר",
"item.specs": "מפרט טכני",
"breadcrumb.home": "דף הבית"
```

**en.json:**
```json
"products.tabs.new": "New Products",
"products.tabs.builds": "PC Builds",
"products.tabs.bestSellers": "Best Sellers",
"products.tabs.custom": "Custom Products",
"products.empty": "No products found",
"item.addToCart": "Add to Cart",
"item.outOfStock": "Out of Stock",
"item.description": "Description",
"item.specs": "Specifications",
"breadcrumb.home": "Home"
```

**ru.json:**
```json
"products.tabs.new": "Новые товары",
"products.tabs.builds": "Сборки ПК",
"products.tabs.bestSellers": "Бестселлеры",
"products.tabs.custom": "Индивидуальные товары",
"products.empty": "Товары не найдены",
"item.addToCart": "В корзину",
"item.outOfStock": "Нет в наличии",
"item.description": "Описание",
"item.specs": "Характеристики",
"breadcrumb.home": "Главная"
```

## Part 2: Inner Pages

### How page detection works

Each Konimbo page type gets a `<meta name="aluf-page" content="...">` tag injected via Konimbo user_files. The React app reads this in `getPageType()` and renders the appropriate page component.

### Scraper enhancements

**File:** `src/lib/konimbo-scraper.ts`

Add new functions:
- `scrapeItemDetail(): ItemDetail | null` — for single product pages
- `scrapeBreadcrumbs(): BreadcrumbItem[]` — uses existing `BreadcrumbItem` interface from `Breadcrumbs.tsx` (`{ label: string; href?: string }`)
- `scrapeCategoryTitle(): string` — extracts the current category/tag page title from `<h1>` or `.page_title`

**ItemDetail type** (add to `src/data/products.ts`):
```typescript
export interface ItemDetail {
  id: string;
  title: string;
  images: string[];        // gallery image URLs
  price: number;
  originalPrice?: number;
  descriptionHtml: string; // raw HTML from Konimbo
  specs: string[];         // plain strings, same format as Product.specs
  inStock: boolean;
}
```

**Conditional scraping in `main.tsx`** — only scrape page-specific data when relevant:
```typescript
const pageType = getPageType();
const scrapedData = {
  products: scrapeProducts(),
  categories: scrapeCategories(),
  categoryGroups: scrapeCategoryGroups(),
  banners: scrapeBanners(),
  itemDetail: pageType === 'item' ? scrapeItemDetail() : null,
  breadcrumbs: ['category', 'items', 'item'].includes(pageType) ? scrapeBreadcrumbs() : [],
  pageTitle: ['category', 'items'].includes(pageType) ? scrapeCategoryTitle() : '',
};
```

Add to `StoreDataContext` interface and provider:
- `itemDetail: ItemDetail | null` (default: `null`)
- `breadcrumbs: BreadcrumbItem[]` (default: `[]`)
- `pageTitle: string` (default: `''`)

### CategoryPage

**File:** `src/pages/CategoryPage.tsx`

Displays a category landing page:
- Breadcrumbs at top (from `useStoreData().breadcrumbs`)
- Category title from `useStoreData().pageTitle` (scraped from `<h1>` or `.page_title`)
- Grid of subcategory cards: show all subcategories from `categoryGroups` that Konimbo renders on this page. On category pages, Konimbo shows the relevant subcategory links in the DOM — we scrape those directly via `scrapeCategories()` (which already runs on every page).
- Product carousel of items in this category (scraped from DOM via `scrapeProducts()`)
- Layout: responsive grid, 2 cols mobile → 3 tablet → 4 desktop for subcategories
- If no subcategories found, skip the grid and show products directly in a grid layout (same as ItemsGridPage)

### ItemsGridPage

**File:** `src/pages/ItemsGridPage.tsx`

Displays a product listing (for tags, filtered views, subcategories):
- Breadcrumbs at top
- Page title (scraped)
- Responsive product grid: 2 cols mobile, 3 tablet, 4 desktop
- Uses scraped products from DOM
- Each product rendered with `<ProductCard />`

### ItemPage

**File:** `src/pages/ItemPage.tsx`

Single product detail page:
- Breadcrumbs at top
- Two-column layout (desktop): image gallery left, details right
- Image gallery: main image + thumbnail strip (click to swap)
- Product info: title, price (with original price strikethrough if on sale), stock badge
- Description HTML rendered safely
- Specs list
- Add to cart button (large, prominent)
- Mobile: stacks vertically (image → info)

### CartPage

**File:** `src/pages/CartPage.tsx`

Minimal — clicking the cart icon in header redirects to `https://www.aluf.co.il/orders/alufshop/new#secureHook` (public domain, checkout only works there). No custom cart view for now. The CartPage component itself just performs `window.location.href = checkoutUrl` on mount.

### Konimbo user_files needed

New Konimbo user_file snippets to set the page type meta tag:
- `konimbo/aluf-page-category.foot.html`: `<meta name="aluf-page" content="category">`
- `konimbo/aluf-page-items.foot.html`: `<meta name="aluf-page" content="items">`
- `konimbo/aluf-page-item.foot.html`: `<meta name="aluf-page" content="item">`
- `konimbo/aluf-page-cart.foot.html`: `<meta name="aluf-page" content="cart">`

These are configured in Konimbo admin to inject on the appropriate page types.

## Data Flow

```
Homepage:
  Mount → TabbedProducts → fetch /tags/211647-tag2 → DOMParser → parseProductElements → Product[]
  Tab click → fetch other tag → cache → render carousel

Category/Items pages:
  Konimbo renders page → meta tag set → scrapeProducts() from DOM → StoreDataContext → Page component

Item page:
  Konimbo renders item → meta tag set → scrapeItemDetail() from DOM → StoreDataContext → ItemPage

Cart:
  Header cart icon → redirect to /orders/alufshop/new#secureHook
```

## Files Modified/Created

| File | Action |
|---|---|
| `src/lib/konimbo-scraper.ts` | Add `parseProductElements`, `scrapeItemDetail`, `scrapeBreadcrumbs`, `scrapeCategoryTitle` |
| `src/lib/fetch-tag-products.ts` | **New** — AJAX fetch + parse for tag pages |
| `src/lib/StoreDataContext.tsx` | Add `itemDetail`, `breadcrumbs`, `pageTitle` to context |
| `src/main.tsx` | Scrape new data (itemDetail, breadcrumbs, pageTitle) |
| `src/components/commerce/TabbedProducts.tsx` | **New** — tabbed product section |
| `src/components/ui/Carousel.tsx` | Add touch-action, mouse drag support |
| `src/pages/HomePage.tsx` | Replace featured products with TabbedProducts |
| `src/pages/CategoryPage.tsx` | Implement category landing |
| `src/pages/ItemsGridPage.tsx` | Implement product grid |
| `src/pages/ItemPage.tsx` | Implement product detail |
| `src/pages/CartPage.tsx` | Redirect to checkout |
| `src/i18n/he.json` | Add tab labels + new page strings |
| `src/i18n/en.json` | Add tab labels + new page strings |
| `src/i18n/ru.json` | Add tab labels + new page strings |
| `src/data/products.ts` | Add `ItemDetail` type with description, gallery fields |
| `konimbo/aluf-page-category.foot.html` | **New** — meta tag for category pages |
| `konimbo/aluf-page-items.foot.html` | **New** — meta tag for items pages |
| `konimbo/aluf-page-item.foot.html` | **New** — meta tag for item pages |
| `konimbo/aluf-page-cart.foot.html` | **New** — meta tag for cart page |

## Out of Scope

- Custom cart view (just redirect for now)
- Search results page
- User account pages
- Checkout flow (Konimbo native at `/orders/alufshop/new#secureHook`)
- Product filtering/sorting within grid pages
