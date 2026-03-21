# Schema.org JSON-LD Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Inject Schema.org JSON-LD structured data (`Product`, `WebSite`, `Organization`, `BreadcrumbList`) into product, homepage, and category pages, using the active language block from a pipeline-injected `#multilingual_context` div when available, with graceful fallback to existing Hebrew data.

**Architecture:** The pipeline injects a hidden `#multilingual_context` div containing `{heb, eng, rus}` multilingual data into product pages. The scraper reads it and attaches it to `ItemDetail`. `ItemPage` selects the right language block and builds a `Product` schema object, passing it to `PageMeta` via a new `jsonLd` prop. `PageMeta` manages a single `<script type="application/ld+json" data-aluf-schema>` tag — scoped to avoid touching the pipeline's own FAQPage JSON-LD tags that are also injected. `HomePage` and `CategoryPage` get static/derived schemas via the same `PageMeta` prop.

**Tech Stack:** React 18, TypeScript, existing `konimbo-scraper.ts`, existing `PageMeta` component — no new dependencies.

---

## File Map

| File | Change |
|---|---|
| `src/data/products.ts` | Add `LangBlock`, `LangContext` interfaces; add `langContext?: LangContext` to `ItemDetail` |
| `src/lib/konimbo-scraper.ts` | Extract `#multilingual_context` JSON before return; add to returned object |
| `src/components/ui/PageMeta.tsx` | Add `jsonLd?: object \| object[]` prop + scoped `<script>` upsert/cleanup effect |
| `src/pages/ItemPage.tsx` | Import `PageMeta`; assemble `Product` schema; pass to `<PageMeta jsonLd={...} />` |
| `src/pages/HomePage.tsx` | Pass static `WebSite` + `Organization` schema array to existing `<PageMeta jsonLd={...} />` |
| `src/pages/CategoryPage.tsx` | Import `PageMeta`; build `BreadcrumbList` from `crumbs`; render `<PageMeta>` |

---

## Task 1: Add multilingual types to `products.ts` and extend `ItemDetail`

**Files:**
- Modify: `src/data/products.ts:1-33`

### Context

`src/data/products.ts` currently exports:
```ts
export interface ItemDetail {
  id: string; title: string; sku?: string; images: string[];
  price: number; originalPrice?: number; descriptionHtml: string;
  specs: string[]; specRows: SpecRow[]; relatedItems: Product[];
  inStock: boolean; warranty?: string;
  faqItems?: { question: string; answer: string }[];
}
```

Add two new interfaces and one optional field. No runtime code changes — types only.

### Steps

- [ ] **Step 1: Add `LangBlock` and `LangContext` interfaces after the `SpecRow` interface (line 17)**

Insert exactly:

```ts
export interface LangBlock {
  title: string;
  specs: string[];
  faq: { question: string; answer: string }[];
}

export interface LangContext {
  heb: LangBlock;
  eng: LangBlock;
  rus: LangBlock;
}
```

- [ ] **Step 2: Add `langContext` field to `ItemDetail`**

Add as the last field before the closing `}` of `ItemDetail`:

```ts
  langContext?: LangContext;
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
cd "/Users/AZ-Live/Dev projacts/aluf frontend" && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/data/products.ts
git commit -m "feat: add LangBlock, LangContext types and ItemDetail.langContext field"
```

---

## Task 2: Extract `#multilingual_context` in the scraper

**Files:**
- Modify: `src/lib/konimbo-scraper.ts:307-373`

### Context

The pipeline injects this into Konimbo product pages:
```html
<div id="multilingual_context" style="display:none;">{"heb":...,"eng":...,"rus":...}</div>
```

The scraper's `scrapeItemDetail()` function currently returns at line 359–373. We add extraction immediately before the `return` statement, after all other scraping is done. The element is in the live `document` (not inside the `.desc` clone that strips `#ai_agent_context`).

### Steps

- [ ] **Step 1: Add `langContext` extraction immediately before the `return {` at line 359**

Insert the extraction block **before** the `return {` statement (not inside it). Then add `langContext,` as a new field inside the returned object literal, alongside `faqItems`.

```ts
  // Multilingual context — injected by pipeline into #multilingual_context
  let langContext: import('@/data/products').LangContext | undefined;
  try {
    const ctxEl = document.querySelector('#multilingual_context');
    if (ctxEl?.textContent) {
      const raw = JSON.parse(ctxEl.textContent);
      // Shape: { heb: {...}, eng: {...}, rus: {...} } — flat, no wrapper
      if (raw?.heb && raw?.eng && raw?.rus) {
        langContext = raw as import('@/data/products').LangContext;
      }
    }
  } catch { /* malformed JSON or missing element — langContext stays undefined */ }
```

**Important:** The return object already exists at lines 359-373. Add `langContext,` as a field inside the returned object literal, alongside `faqItems`.

The full return becomes:
```ts
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
    langContext,
  };
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd "/Users/AZ-Live/Dev projacts/aluf frontend" && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Build**

```bash
cd "/Users/AZ-Live/Dev projacts/aluf frontend" && npm run build 2>&1 | tail -8
```

Expected: `✓ built in` with no errors.

- [ ] **Step 4: Commit**

```bash
git add src/lib/konimbo-scraper.ts
git commit -m "feat: extract multilingual_context from Konimbo DOM into ItemDetail"
```

---

## Task 3: Add `jsonLd` prop to `PageMeta`

**Files:**
- Modify: `src/components/ui/PageMeta.tsx` (full file, currently 32 lines)

### Context

`PageMeta` currently manages `document.title` and OG/Twitter meta tags via `useEffect`. We add a second `useEffect` for the JSON-LD script tag. The two effects are kept separate because their dependencies are different (`title`/`description` vs `jsonLd`).

**Critical:** The selector `script[type="application/ld+json"][data-aluf-schema]` ensures we only ever touch our own tag — never the pipeline's three FAQPage `<script type="application/ld+json">` tags which have no `data-aluf-schema` attribute.

### Steps

- [ ] **Step 1: Update the interface to accept `jsonLd`**

Change:
```ts
interface PageMetaProps {
  title: string;
  description?: string;
}
```

To:
```ts
interface PageMetaProps {
  title: string;
  description?: string;
  jsonLd?: object | object[];
}
```

- [ ] **Step 2: Destructure `jsonLd` in the component signature**

Change:
```ts
export function PageMeta({ title, description }: PageMetaProps) {
```

To:
```ts
export function PageMeta({ title, description, jsonLd }: PageMetaProps) {
```

- [ ] **Step 3: Add the JSON-LD `useEffect` after the existing one**

After the existing `useEffect([title, description])`, add:

```ts
  useEffect(() => {
    const SELECTOR = 'script[type="application/ld+json"][data-aluf-schema]';
    if (!jsonLd) {
      document.querySelector(SELECTOR)?.remove();
      return;
    }
    let el = document.querySelector<HTMLScriptElement>(SELECTOR);
    if (!el) {
      el = document.createElement('script');
      el.type = 'application/ld+json';
      el.setAttribute('data-aluf-schema', '');
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(jsonLd);
    return () => { document.querySelector(SELECTOR)?.remove(); };
  }, [jsonLd]);
```

The full file after changes:

```ts
import { useEffect } from 'react';

interface PageMetaProps {
  title: string;
  description?: string;
  jsonLd?: object | object[];
}

function upsertMeta(selector: string, attrName: string, attrValue: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attrName, attrValue);
    document.head.appendChild(el);
  }
  el.content = content;
}

export function PageMeta({ title, description, jsonLd }: PageMetaProps) {
  useEffect(() => {
    document.title = title;
    upsertMeta('meta[property="og:title"]', 'property', 'og:title', title);
    upsertMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title);
    if (description) {
      upsertMeta('meta[name="description"]', 'name', 'description', description);
      upsertMeta('meta[property="og:description"]', 'property', 'og:description', description);
    }
  }, [title, description]);

  useEffect(() => {
    const SELECTOR = 'script[type="application/ld+json"][data-aluf-schema]';
    if (!jsonLd) {
      document.querySelector(SELECTOR)?.remove();
      return;
    }
    let el = document.querySelector<HTMLScriptElement>(SELECTOR);
    if (!el) {
      el = document.createElement('script');
      el.type = 'application/ld+json';
      el.setAttribute('data-aluf-schema', '');
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(jsonLd);
    return () => { document.querySelector(SELECTOR)?.remove(); };
  }, [jsonLd]);

  return null;
}
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
cd "/Users/AZ-Live/Dev projacts/aluf frontend" && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/PageMeta.tsx
git commit -m "feat: add jsonLd prop to PageMeta with scoped script tag injection"
```

---

## Task 4: Add `Product` schema to `ItemPage`

**Files:**
- Modify: `src/pages/ItemPage.tsx`

### Context

`ItemPage` gets data via `useStoreData()` which returns `{ itemDetail, breadcrumbs }`. `itemDetail` now has `langContext?: LangContext`. The page already uses `useLang()` which returns `{ t, dir, lang }` where `lang` is `'he' | 'en' | 'ru'`.

`PageMeta` is NOT currently imported in `ItemPage` — it must be added. The schema is assembled inside the component body and passed as `jsonLd`.

**Do not generate `FAQPage` schema** — the pipeline already injects it.

### Steps

- [ ] **Step 1: Add `PageMeta` import at the top of `ItemPage.tsx`**

After the existing imports, add:
```ts
import { PageMeta } from '@/components/ui/PageMeta';
```

- [ ] **Step 2: Assemble the `Product` schema inside the component body**

Add this block after the `const { t, dir, lang } = useLang();` and `const { itemDetail, breadcrumbs } = useStoreData();` lines, before any early returns:

```ts
  // Schema.org Product JSON-LD
  const productSchema = itemDetail ? (() => {
    const langKey = lang === 'he' ? 'heb' : lang === 'ru' ? 'rus' : 'eng';
    const ctx = itemDetail.langContext?.[langKey];
    const descriptionValue = (ctx?.specs ?? itemDetail.specs).join(', ') || undefined;
    const imageValue = itemDetail.images[0];
    return {
      '@context': 'https://schema.org',
      '@type': 'Product',
      '@id': window.location.href,
      name: ctx?.title ?? itemDetail.title,
      ...(imageValue && { image: imageValue }),
      ...(itemDetail.sku && { sku: itemDetail.sku }),
      ...(descriptionValue && { description: descriptionValue }),
      offers: {
        '@type': 'Offer',
        url: window.location.href,
        price: itemDetail.price,
        priceCurrency: 'ILS',
        availability: itemDetail.inStock
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      },
    };
  })() : undefined;
```

- [ ] **Step 3: Render `PageMeta` with the schema**

`ItemPage` has an early return around line 87: `if (!itemDetail) return <LoadingSpinner />` or similar. Do NOT add `<PageMeta>` to that guard — there is no title to display there.

Find the **main** `return (` that renders the full product page (after the early guard) and add `<PageMeta>` as the first child inside the fragment/container. The page title comes from `itemDetail.title`.

```tsx
<PageMeta title={itemDetail.title} jsonLd={productSchema} />
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
cd "/Users/AZ-Live/Dev projacts/aluf frontend" && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 5: Build**

```bash
cd "/Users/AZ-Live/Dev projacts/aluf frontend" && npm run build 2>&1 | tail -8
```

Expected: `✓ built in` with no errors.

- [ ] **Step 6: Commit**

```bash
git add src/pages/ItemPage.tsx
git commit -m "feat: inject Product JSON-LD schema into ItemPage with multilingual fallback"
```

---

## Task 5: Add static schemas to `HomePage` and `BreadcrumbList` to `CategoryPage`

**Files:**
- Modify: `src/pages/HomePage.tsx`
- Modify: `src/pages/CategoryPage.tsx`

### Context

**`HomePage`** already imports and renders `<PageMeta title={...} description={...} />` at line 111. Just add the `jsonLd` prop with a static array.

**`CategoryPage`** does NOT currently import or render `PageMeta`. The `crumbs` variable is already computed at line 98–100 from `breadcrumbs` (from `useStoreData()`). Add import + render.

### Steps

#### HomePage

- [ ] **Step 1: Define the static `homeSchema` constant at module scope (outside the component function)**

Because this array never changes, defining it at module level prevents React from recreating it on every render and avoids unnecessary `PageMeta` effect re-runs. Add above the `export function HomePage()` line:

```ts
const homeSchema = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Alufshop',
    url: 'https://alufshop.co.il',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Alufshop',
    url: 'https://alufshop.co.il',
    logo: 'https://cdn.jsdelivr.net/gh/Yuki-az-23/aluf-frontend@master/src/assets/logo.png',
  },
];
```

- [ ] **Step 2: Add `jsonLd` prop to the existing `<PageMeta>` in `HomePage`**

Find the existing `<PageMeta` element (line ~111) and add `jsonLd={homeSchema}`:

```tsx
<PageMeta
  title={...}
  description={...}
  jsonLd={homeSchema}
/>
```

#### CategoryPage

- [ ] **Step 3: Add `PageMeta` import to `CategoryPage.tsx`**

```ts
import { PageMeta } from '@/components/ui/PageMeta';
```

- [ ] **Step 4: Build the `breadcrumbSchema` inside `CategoryPage` component body**

After the `crumbs` variable is defined (after line 100), add:

```ts
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.label,
      ...(crumb.href && { item: window.location.origin + crumb.href }),
    })),
  };
```

- [ ] **Step 5: Render `<PageMeta>` in `CategoryPage`**

`CategoryPage` has exactly **4 return paths** — add `<PageMeta>` to all of them:

1. ~line 108: leaf page with products (`products.length > 0`)
2. ~line 166: leaf page with scraped `categoryGroups`
3. ~line 199: leaf page empty fallback state
4. ~line 224: parent category page (icon grid)

In each `return (` block, add as the first child inside the fragment/container:

```tsx
<PageMeta title={pageTitle || t('site.name')} jsonLd={breadcrumbSchema} />
```

- [ ] **Step 6: Verify TypeScript compiles**

```bash
cd "/Users/AZ-Live/Dev projacts/aluf frontend" && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 7: Build**

```bash
cd "/Users/AZ-Live/Dev projacts/aluf frontend" && npm run build 2>&1 | tail -8
```

Expected: `✓ built in` with no errors.

- [ ] **Step 8: Commit**

```bash
git add src/pages/HomePage.tsx src/pages/CategoryPage.tsx
git commit -m "feat: add WebSite/Organization JSON-LD to HomePage, BreadcrumbList to CategoryPage"
```

---

## Verification Checklist

After all tasks are complete, verify in browser devtools (Elements → `<head>`):

- [ ] On an item page: `<script type="application/ld+json" data-aluf-schema>` is present with `@type: Product`
- [ ] On an item page with pipeline injection: the 3 FAQPage `<script>` tags exist alongside (not replaced by) ours
- [ ] Switching language (he → en): `data-aluf-schema` script content updates to use `eng` block title; no duplicate tags appear
- [ ] On an item page without `#multilingual_context`: schema still present, uses `itemDetail.title` + `itemDetail.specs`
- [ ] On homepage: `data-aluf-schema` contains array with `WebSite` and `Organization`
- [ ] On a category page: `data-aluf-schema` contains `BreadcrumbList`
- [ ] When `images` is empty: `image` field absent from Product schema
