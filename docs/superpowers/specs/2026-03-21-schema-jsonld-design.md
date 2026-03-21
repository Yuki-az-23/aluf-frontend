# Schema.org JSON-LD Implementation Design

## Goal

Inject Schema.org JSON-LD structured data into product, homepage, and category pages, using the active language block when available, with graceful fallback to existing Hebrew data.

## Architecture

The feature has three layers:

1. **Scraper** — extracts the multilingual context JSON from the Konimbo product page DOM and attaches it to `ItemDetail`
2. **Schema assembly** — `ItemPage` selects the correct language block and builds the schema object
3. **Head injection** — `PageMeta` accepts a `jsonLd` prop and manages a `<script type="application/ld+json">` tag in `document.head`

## Tech Stack

React 18, TypeScript, existing `konimbo-scraper.ts`, existing `PageMeta` component, no new dependencies.

---

## Data Layer

### New types in `src/data/products.ts`

```ts
export interface LangBlock {
  title: string;
  spec: string[];
  faq: { question: string; answer: string }[];
}

export interface LangContext {
  heb: LangBlock;
  eng: LangBlock;
  rus: LangBlock;
}
```

`LangContext` is added as an optional field on `ItemDetail`:

```ts
export interface ItemDetail {
  // ...existing fields...
  langContext?: LangContext;
}
```

### Scraper change (`src/lib/konimbo-scraper.ts`)

After parsing the product page DOM, evaluate the XPath:

```
/html/body/div[5]/div[2]/div/form/div[2]/div[2]/div[1]/div[1]/div[1]/div
```

Read the element's `textContent`, parse as JSON, and assign to `itemDetail.langContext`. If the element is missing, the JSON is malformed, or the structure doesn't match, `langContext` is left `undefined` — no error thrown.

Use `document.evaluate()` with `XPathResult.FIRST_ORDERED_NODE_TYPE` to locate the node.

---

## Schema Assembly

### Language key selection (in `ItemPage`)

```ts
const langKey = lang === 'he' ? 'heb' : lang === 'ru' ? 'rus' : 'eng';
const ctx = itemDetail.langContext?.[langKey];
```

### Fallback chain

| Field | With context | Without context |
|---|---|---|
| `name` | `ctx.title` | `itemDetail.title` |
| `description` | `ctx.spec.join(', ')` | `itemDetail.specs.join(', ')` |
| FAQ entries | `ctx.faq` | `itemDetail.faqItems` |

FAQ block is omitted entirely when both sources are empty/undefined.

### Product schema shape

```ts
const productSchema = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: ctx?.title ?? itemDetail.title,
  image: itemDetail.images[0],
  sku: itemDetail.sku,
  description: (ctx?.spec ?? itemDetail.specs).join(', '),
  offers: {
    '@type': 'Offer',
    price: itemDetail.price,
    priceCurrency: 'ILS',
    availability: itemDetail.inStock
      ? 'https://schema.org/InStock'
      : 'https://schema.org/OutOfStock',
  },
};
```

When FAQ entries exist, the schema becomes an array: `[productSchema, faqPageSchema]` where:

```ts
const faqPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqEntries.map(f => ({
    '@type': 'Question',
    name: f.question,
    acceptedAnswer: { '@type': 'Answer', text: f.answer },
  })),
};
```

---

## Head Injection — `PageMeta` changes

Add optional `jsonLd?: object | object[]` prop. In `useEffect`:

```ts
// Upsert a single <script type="application/ld+json"> tag
let el = document.querySelector<HTMLScriptElement>('script[type="application/ld+json"]');
if (!el) {
  el = document.createElement('script');
  el.type = 'application/ld+json';
  document.head.appendChild(el);
}
el.textContent = JSON.stringify(jsonLd);
```

When `jsonLd` is `undefined`, remove the tag if present (cleanup on unmount / page change).

---

## Pages in Scope

### ItemPage (`src/pages/ItemPage.tsx`)

- Assembles `Product` schema using the fallback chain above
- Appends `FAQPage` schema when FAQ entries exist
- Passes combined schema array to `<PageMeta jsonLd={schema} />`

### HomePage (`src/pages/HomePage.tsx`)

Static schemas, no multilingual context needed:

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

### CategoryPage (`src/pages/CategoryPage.tsx`)

`BreadcrumbList` schema built from the page's breadcrumb data:

```ts
{
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: breadcrumbs.map((crumb, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: crumb.label,
    item: crumb.href ? window.location.origin + crumb.href : undefined,
  })),
}
```

---

## Error Handling

- XPath evaluation wrapped in try/catch — failure → `langContext` stays `undefined`
- JSON.parse wrapped in try/catch — malformed JSON → `langContext` stays `undefined`
- Schema assembly uses optional chaining throughout — no field throws if missing
- `PageMeta` skips JSON-LD injection when `jsonLd` prop is `undefined`

---

## Testing

- Manually verify `<script type="application/ld+json">` appears in `document.head` on ItemPage load
- Validate output with Google's Rich Results Test
- Confirm fallback: item without `langContext` still emits valid `Product` schema using Hebrew data
- Confirm FAQ block absent when `faqItems` is empty and `ctx.faq` is empty/missing
- Confirm language switching updates the script tag content in-place
