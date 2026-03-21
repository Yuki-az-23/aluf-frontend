# Schema.org JSON-LD Implementation Design

## Goal

Inject Schema.org JSON-LD structured data into product, homepage, and category pages, using the active language block when available, with graceful fallback to existing Hebrew data.

## Architecture

Three layers:

1. **Scraper** — reads `#ai_agent_context` from the Konimbo product page DOM and attaches parsed multilingual data to `ItemDetail`
2. **Schema assembly** — `ItemPage` selects the correct language block and builds the schema object
3. **Head injection** — `PageMeta` accepts a `jsonLd` prop and manages a scoped `<script type="application/ld+json" data-aluf-schema>` tag in `document.head`

## Tech Stack

React 18, TypeScript, existing `konimbo-scraper.ts`, existing `PageMeta` component, no new dependencies.

---

## Data Layer

### New types in `src/data/products.ts`

```ts
export interface LangBlock {
  title: string;
  specs: string[];   // named "specs" to match codebase convention
  faq: { question: string; answer: string }[];
}

export interface LangContext {
  heb: LangBlock;
  eng: LangBlock;
  rus: LangBlock;
}
```

`LangContext` is added as optional on `ItemDetail`:

```ts
export interface ItemDetail {
  // ...existing fields unchanged...
  langContext?: LangContext;
}
```

**Note:** The Konimbo-embedded JSON uses keys `heb`, `eng`, `rus` matching these interface keys. If the runtime JSON uses different keys, `langContext?.[langKey]` returns `undefined` and the fallback chain applies — no error thrown.

---

## Scraper Change (`src/lib/konimbo-scraper.ts`)

The element `#ai_agent_context` already exists in the scraper — it is stripped from the description clone at line 329. The original element remains in `document`. Add extraction **before** the description clone step:

```ts
// Multilingual context for Schema.org JSON-LD
let langContext: LangContext | undefined;
try {
  const ctxEl = document.querySelector('#ai_agent_context');
  if (ctxEl?.textContent) {
    const raw = JSON.parse(ctxEl.textContent);
    // Expected shape: { context: { heb: {...}, eng: {...}, rus: {...} } }
    const ctx = raw?.context ?? raw;
    if (ctx?.heb && ctx?.eng && ctx?.rus) {
      langContext = ctx as LangContext;
    }
  }
} catch { /* malformed JSON or missing element — langContext stays undefined */ }
```

Return `langContext` on the `ItemDetail` object.

**Do NOT use XPath** — the CSS ID selector is reliable, already referenced in the codebase, and less fragile than DOM position.

---

## Schema Assembly

### Language key selection (in `ItemPage`)

```ts
const langKey = lang === 'he' ? 'heb' : lang === 'ru' ? 'rus' : 'eng';
const ctx = itemDetail.langContext?.[langKey];
```

### Fallback chain

| Field | With context | Without context (fallback) |
|---|---|---|
| `name` | `ctx.title` | `itemDetail.title` |
| `description` | `ctx.specs.join(', ')` | `itemDetail.specs.join(', ')` — if both empty, field is omitted |
| FAQ entries | `ctx.faq` (non-empty array) | `itemDetail.faqItems` (non-empty array) |

FAQ block is omitted when both `ctx?.faq` and `itemDetail.faqItems` are absent, `undefined`, or empty arrays (`[]`).

### Product schema shape

```ts
const descriptionValue = (ctx?.specs ?? itemDetail.specs).join(', ') || undefined;
const imageValue = itemDetail.images[0]; // undefined when images is empty — omitted by JSON.stringify

const productSchema = {
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
    // priceValidUntil is intentionally omitted — no expiry data in ItemDetail.
    // The price badge in Google search results will not appear as a result.
    // Can be added later if Konimbo exposes an expiry field.
  },
};
```

### FAQ schema (when entries exist)

```ts
const faqEntries = (ctx?.faq?.length ? ctx.faq : null) ?? (itemDetail.faqItems?.length ? itemDetail.faqItems : null);

const faqPageSchema = faqEntries ? {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqEntries.map(f => ({
    '@type': 'Question',
    name: f.question,
    acceptedAnswer: { '@type': 'Answer', text: f.answer },
  })),
} : null;
```

Combined: `const schema = faqPageSchema ? [productSchema, faqPageSchema] : productSchema;`

---

## Head Injection — `PageMeta` changes

Add optional `jsonLd?: object | object[]` prop.

```ts
useEffect(() => {
  if (!jsonLd) {
    // Remove our tag if present
    document.querySelector('script[type="application/ld+json"][data-aluf-schema]')?.remove();
    return;
  }
  let el = document.querySelector<HTMLScriptElement>('script[type="application/ld+json"][data-aluf-schema]');
  if (!el) {
    el = document.createElement('script');
    el.type = 'application/ld+json';
    el.setAttribute('data-aluf-schema', '');
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(jsonLd);
  return () => {
    document.querySelector('script[type="application/ld+json"][data-aluf-schema]')?.remove();
  };
}, [jsonLd]);
```

The `data-aluf-schema` attribute scopes all queries so the CMS's own JSON-LD tags (if any) are never touched. The effect re-runs when `jsonLd` changes (language switch updates schema in-place).

---

## Pages in Scope

### ItemPage (`src/pages/ItemPage.tsx`)

Assembles schema as described above. Passes to `<PageMeta jsonLd={schema} />`. Needs `PageMeta` imported (not currently used in ItemPage — add import).

### HomePage (`src/pages/HomePage.tsx`)

Static schemas, language-independent:

```ts
const homeSchema = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Alufshop',
    url: 'https://alufshop.co.il',
    // potentialAction (SearchAction) intentionally omitted — search is handled
    // by Konimbo's server and the URL pattern is not a stable template we control.
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Alufshop',
    url: 'https://alufshop.co.il',
    logo: 'https://cdn.jsdelivr.net/gh/Yuki-az-23/aluf-frontend@master/src/assets/logo.png',
    // contactPoint intentionally omitted — no structured contact data in the codebase;
    // would require phone/email to be hardcoded, which is a maintenance liability.
    // sameAs (social links) intentionally omitted for now — can be added in a follow-up
    // once canonical social profile URLs are confirmed.
    // @id intentionally omitted from WebSite and Organization — `url` is sufficient
    // for entity identification on these static homepage schemas.
  },
];
```

### CategoryPage (`src/pages/CategoryPage.tsx`)

`BreadcrumbList` from scraped breadcrumb data:

```ts
{
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: breadcrumbs.map((crumb, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: crumb.label,
    // crumb.href is undefined for the last (current) item — JSON.stringify drops
    // undefined values, so the item field is absent for the last entry.
    // This is intentional and valid per Schema.org; may produce a Google Search
    // Console warning which can be suppressed once confirmed benign.
    ...(crumb.href && { item: window.location.origin + crumb.href }),
  })),
}
```

---

## Error Handling

- `#ai_agent_context` query + `JSON.parse` wrapped in try/catch — any failure → `langContext` stays `undefined`
- Structure validation: only assign `langContext` when `heb`, `eng`, and `rus` keys are all present
- `images[0]` on empty array returns `undefined` — guarded with conditional spread, never emits `null`
- `specs.join(', ')` on empty array returns `''` — guarded with `|| undefined`, field omitted when empty
- FAQ: both `ctx.faq` and `itemDetail.faqItems` checked for non-empty length before use
- `PageMeta` skips injection when `jsonLd` is `undefined`
- All selector queries use `?.` — no throws on missing elements

---

## Testing

- Verify `<script type="application/ld+json" data-aluf-schema>` appears in `document.head` on ItemPage load
- Validate output with Google's Rich Results Test (Product type)
- Confirm fallback: item without `#ai_agent_context` emits valid `Product` schema using Hebrew title/specs
- Confirm FAQ block absent when `ctx.faq` is `[]`, `ctx.faq` is `undefined`, and `itemDetail.faqItems` is empty/absent (all three cases)
- Confirm FAQ block present when only `itemDetail.faqItems` has entries (no context JSON)
- Confirm language switching (he → en → ru) updates script tag content in-place without duplicate tags
- Confirm CMS-injected JSON-LD tags (if any) are not modified — only `[data-aluf-schema]` tag is touched
- Confirm `image` field absent in JSON-LD when `itemDetail.images` is empty
