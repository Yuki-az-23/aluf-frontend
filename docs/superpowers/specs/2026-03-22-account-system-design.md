# Account System Design
**Date:** 2026-03-22
**Project:** Aluf Frontend (Konimbo overlay)
**Status:** Approved

---

## Overview

Build a fully custom React account system (login, signup, account dashboard) that overlays Konimbo's native platform. The React UI is the visible shell; Konimbo's native HTML forms live underneath hidden in the DOM. On submit, we populate the native form fields and fire `.submit()` — Konimbo handles auth server-side, sets cookies, and redirects. No backend changes.

The account dashboard (AccountPage) scrapes the Konimbo DOM on mount to extract order history, profile info, and loyalty points, then renders a custom React UI over that data.

Checkout is **excluded** — it is already handled by `CartPage.tsx` which collects contact/delivery info and redirects to Konimbo's native `/orders/alufshop/new#secureHook`.

---

## Scope

| Deliverable | Description |
|---|---|
| `src/lib/AuthContext.tsx` | App-wide login state from cookie |
| `src/lib/formBridge.ts` | Populate + submit hidden Konimbo native forms |
| `src/pages/LoginPage.tsx` | Custom login UI |
| `src/pages/SignupPage.tsx` | Custom signup/registration UI |
| `src/pages/AccountPage.tsx` | Custom account dashboard (profile + orders) |
| `src/components/account/AuthFormShell.tsx` | Shared branded layout for login/signup |
| `src/components/account/OrdersList.tsx` | Scrapes + renders order history |
| `src/components/account/ProfileCard.tsx` | Scrapes + renders profile info |
| `src/components/layout/Header.tsx` | Update: login-aware person icon |
| `src/components/layout/MobileMenu.tsx` | Update: login-aware login/account link |
| `src/App.tsx` | Replace null returns + wire AuthContext + new pages into router |
| `src/i18n/en.json` + `ru.json` + `he.json` | New `auth.*`, `account.*`, and `header.myAccount` keys (all three languages) |

---

## Architecture

### Data Flow — Auth Pages (Login / Signup)

```
User fills React form
  → submitting = true (button disabled, Spinner shown)
  → onSubmit: formBridge.populate(nativeFormSelector, fields)
  → formBridge.submit(nativeFormSelector)
  → Browser POST → Konimbo processes → sets auth cookie → redirects
  → AuthContext detects cookie on next poll → loggedIn = true
  → Header + MobileMenu update to "My Account"
```

### Data Flow — Account Page

```
Page mounts (user must be logged in, Konimbo redirects if not)
  → setTimeout 300ms → DOM scraper reads Konimbo profile fields + orders table
  → Structured state: { profile, orders, points }
  → React renders full dashboard
  → "Edit Profile" button → navigate to /customer_edit_profile
    → AccountPage mounts in edit mode → populates hidden edit form → formBridge.submit()
```

### File Structure

```
src/
├── lib/
│   ├── AuthContext.tsx              ← new
│   └── formBridge.ts               ← new
├── pages/
│   ├── LoginPage.tsx               ← new
│   ├── SignupPage.tsx              ← new
│   └── AccountPage.tsx             ← new
└── components/
    └── account/
        ├── AuthFormShell.tsx       ← new
        ├── OrdersList.tsx          ← new
        └── ProfileCard.tsx         ← new
```

---

## Component Specifications

### `AuthContext.tsx`

- Reads `isLoggedIn()` from `konimbo.ts` (checks `current_customer_logged_in_css` cookie)
- Polls every 2s **continuously** — detects both login AND logout state changes on every tick
- Exposes: `{ loggedIn: boolean }`
- Provider tree insertion point in `App.tsx`:
  ```tsx
  <LangProvider>
    <StoreDataProvider>
      <AuthProvider>          ← inserted here
        <CartProvider>
          <PCBuilderProvider>
            ...
          </PCBuilderProvider>
        </CartProvider>
      </AuthProvider>
    </StoreDataProvider>
  </LangProvider>
  ```

### `formBridge.ts`

```ts
populate(formSelector: string, fields: Record<string, string>): boolean
// Finds native form via document.querySelector(formSelector).
// For each key in fields, finds input[name="{key}"] within the form and sets its value.
// Returns false if form not found.

submit(formSelector: string): boolean
// Finds native form, calls HTMLFormElement.submit(). Returns false if form not found.
```

**Field name mapping strategy:** Keys in the `fields` record map directly to `input[name="{key}"]` within the native form. The implementer **must** inspect the live Konimbo page to confirm the exact `name` attributes before coding. Known selectors to confirm:

| Page | Form selector (likely) | Field names (to confirm) |
|---|---|---|
| Login | `form#customer_login` or `form[action*="customer_login"]` | `customer[email]`, `customer[password]` |
| Signup | `form#customer_signup` or `form[action*="customer_signup"]` | `customer[name]`, `customer[email]`, `customer[password]`, `customer[phone]` |
| Edit Profile | `form[action*="customer_edit_profile"]` | Same as signup fields |

No AJAX — pure DOM manipulation + native browser POST. Konimbo owns the response.

### `LoginPage.tsx`

- Route: `/customer_login`
- **`App.tsx` change: replace `case 'login': return null` with `case 'login': return <LoginPage />`**
- Layout: `AuthFormShell` (logo, card, RTL/LTR aware)
- Fields: email, password, "remember me" checkbox
- Links: "Forgot password" → Konimbo native reset URL, "Sign up" → `/customer_signup`
- State: `submitting: boolean` — on submit set to `true`, disable button, show `<Spinner />`
- On submit: `formBridge.populate(confirmedSelector, { 'customer[email]': email, 'customer[password]': password })` → `formBridge.submit()`
- Error detection: on mount, defer 300ms via `setTimeout`, then check DOM for `.error, .flash-error, [class*="error"]` — if found, surface `.textContent` inline above the form
- Fallback: if native form not found in DOM → show branded error message + direct `<a href="/customer_login">` link

### `SignupPage.tsx`

- Route: `/customer_signup`
- **`App.tsx` change: replace `case 'signup': return null` with `case 'signup': return <SignupPage />`**
- Layout: `AuthFormShell`
- Fields: full name, email, password, confirm password, phone (optional)
- Links: "Already have an account?" → `/customer_login`
- State: `submitting: boolean` — same pattern as LoginPage
- Client-side validation: password match check before calling formBridge
- On submit: `formBridge.populate(confirmedSelector, { 'customer[name]': name, 'customer[email]': email, 'customer[password]': password, 'customer[phone]': phone })` → `formBridge.submit()`
- Error detection: same deferred DOM check pattern as LoginPage

### `AccountPage.tsx`

- Routes: `/customer_profile` + `/customer_edit_profile`
- **`App.tsx` change: replace `case 'account': return null` with `case 'account': return <AccountPage />`**
- Konimbo redirects unauthenticated users to `/customer_login` natively — no React guard needed
- Page type `'account'` already covers both `/customer_profile` and `/customer_edit_profile` via `getPageType()`
- **`/customer_profile`** → view mode (ProfileCard + OrdersList + Points + Wishlist)
- **`/customer_edit_profile`** → edit mode (ProfileCard in edit state, pre-populated from DOM, saves via `formBridge.submit()`)
- **Edit-mode data source:** When the user navigates directly to `/customer_edit_profile` (with or without prior visit to `/customer_profile`), AccountPage performs a **fresh DOM scrape of the edit page's own native form input fields** (`input[name*="name"]`, `input[name*="email"]`, etc. within the edit form). This is option (b) — no reliance on router state or a prior profile page scrape. Konimbo pre-populates its own native edit form with the customer's current data, so our scraper reads those already-populated values to fill our React inputs.
- On mount: `setTimeout(300ms)` then run DOM scraper:
  ```ts
  // Selectors to confirm by inspection of live /customer_profile page:
  {
    profile: {
      name:  document.querySelector('[name*="name"], .customer-name, #customer_name')?.value or textContent,
      email: document.querySelector('[name*="email"], .customer-email, #customer_email')?.value or textContent,
      phone: document.querySelector('[name*="phone"], .customer-phone, #customer_phone')?.value or textContent,
    },
    orders: scrape orders table rows (selector TBD from live DOM inspection),
    points: parse number from loyalty points element (selector TBD, null if absent)
  }
  ```
- Renders full C-plan dashboard:
  - **ProfileCard** — name/email/phone display + "Edit Profile" link → `/customer_edit_profile`
  - **OrdersList** — order rows, expandable to show items, status badge
  - **Champion Points card** — shown only if `points !== null`
  - **Wishlist placeholder** — shown with "coming soon" state

### `AuthFormShell.tsx`

Shared layout for login and signup:
- Full-width centered column layout using `<Container>`
- Card: `bg-card-bg rounded-2xl shadow-lg p-8` (matches existing card patterns in `CartPage.tsx`)
- Logo at top: same `logoSrc` URL as used in `Header.tsx` and `CartPage.tsx`
- Respects `dir` from `LangProvider` (RTL Hebrew / LTR Russian+English) — inputs for email/password always `dir="ltr"` regardless of page direction

### `OrdersList.tsx`

- Receives `orders` array from AccountPage scraper
- Empty state: `<EmptyState>` component with `account.orders.empty` string
- Each row: order ID, date, total (formatted `toLocaleString('he-IL')` + ₪), status badge, expand/collapse toggle
- Expanded: shows item name, quantity, price per item
- Toggle label: `account.orders.expand` / `account.orders.collapse`

### `ProfileCard.tsx`

- Receives `profile` from AccountPage scraper and `mode: 'view' | 'edit'`
- **View mode:** shows name, email, phone + "Edit Profile" `<a href="/customer_edit_profile">`
- **Edit mode:** shows pre-populated input fields + "Save" button → `formBridge.submit()` + "Cancel" link → `/customer_profile`
- If profile fields missing from DOM: show skeleton, hide edit link (it is an `<a>` tag, not a `<button>` — simply omit rendering it when data is absent)

### `Header.tsx` update

```tsx
const { loggedIn } = useAuth();

// Person icon area becomes:
loggedIn
  ? <a href="/customer_profile"><Icon name="person" /><span>{t('header.myAccount')}</span></a>
  : <a href="/customer_login"><Icon name="person" /><span>{t('header.login')}</span></a>
```

### `MobileMenu.tsx` update

Current hardcoded link at line 62:
```tsx
<a href="https://alufshop.konimbo.co.il/login" ...>
```
Replace with auth-aware equivalent (same pattern as Header):
```tsx
const { loggedIn } = useAuth();
loggedIn
  ? <a href="/customer_profile" ...><Icon name="person" />{t('header.myAccount')}</a>
  : <a href="/customer_login" ...><Icon name="person" />{t('header.login')}</a>
```

---

## i18n Keys (new)

All three language files must receive these keys: `en.json` (English), `ru.json` (Russian), `he.json` (Hebrew). The values below are the English strings; Russian and Hebrew translations must be added for all keys. For this iteration, English-fallback is **not** acceptable — all three files are fully translated for all existing keys.

The `header.myAccount` key does not yet exist in any of the three i18n files and must be added. Note: the existing `footer.myAccount` key is separate and unrelated.

### `auth.*`
```json
{
  "auth.login.title": "Customer Login",
  "auth.login.email": "Email address",
  "auth.login.password": "Password",
  "auth.login.remember": "Remember me",
  "auth.login.forgot": "Forgot password?",
  "auth.login.submit": "Login",
  "auth.login.noAccount": "Don't have an account?",
  "auth.login.signup": "Sign up",
  "auth.login.error": "Incorrect email or password",
  "auth.login.formError": "An error occurred, please try again",

  "auth.signup.title": "Create Account",
  "auth.signup.name": "Full name",
  "auth.signup.email": "Email address",
  "auth.signup.password": "Password",
  "auth.signup.confirmPassword": "Confirm password",
  "auth.signup.phone": "Phone (optional)",
  "auth.signup.submit": "Create Account",
  "auth.signup.hasAccount": "Already have an account?",
  "auth.signup.login": "Login",
  "auth.signup.passwordMismatch": "Passwords do not match"
}
```

### `account.*`
```json
{
  "account.title": "My Account",
  "account.profile.title": "Profile",
  "account.profile.name": "Full name",
  "account.profile.email": "Email",
  "account.profile.phone": "Phone",
  "account.profile.edit": "Edit Profile",
  "account.profile.save": "Save Changes",
  "account.profile.cancel": "Cancel",
  "account.orders.title": "Order History",
  "account.orders.empty": "No orders yet",
  "account.orders.id": "Order #",
  "account.orders.date": "Date",
  "account.orders.total": "Total",
  "account.orders.status": "Status",
  "account.orders.expand": "Show items",
  "account.orders.collapse": "Hide items",
  "account.points.title": "Champion Points",
  "account.points.balance": "Your balance",
  "account.wishlist.title": "Wishlist",
  "account.wishlist.soon": "Coming soon"
}
```

### `header.*` (additions)
```json
{
  "header.myAccount": "My Account"
}
```

---

## Error Handling

| Scenario | Handling |
|---|---|
| Native Konimbo form not in DOM | Show branded error message + direct `<a>` link to native page |
| Auth failed (page reloads to same URL) | Check DOM for error elements 300ms after mount, surface message inline |
| Double-submit | `submitting` state set to `true` on first click; button disabled + Spinner shown |
| Account page scrape returns no data | `EmptyState` / skeleton per section |
| User not logged in on account page | Konimbo redirects natively — no React guard needed |
| Points/wishlist not in DOM | Sections hidden gracefully (no error shown) |

---

## Implementation Prerequisites

Before coding `LoginPage`, `SignupPage`, and `AccountPage`, the implementer must:

1. **Inspect `/customer_login`** — confirm native form selector and input `name` attributes
2. **Inspect `/customer_signup`** — confirm native form selector and input `name` attributes
3. **Inspect `/customer_profile`** (logged-in) — confirm selectors for profile fields, orders table structure, and loyalty points element
4. **Inspect `/customer_edit_profile`** — confirm native form selector and field `name` attributes

Document confirmed selectors in a comment block at the top of `formBridge.ts`.

---

## Out of Scope

- `/checkout` (`/orders/alufshop/new`) — stays native Konimbo, already fed by CartPage via jStorage
- Password reset flow — link points to Konimbo's native reset page
- OAuth / SSO
- Wishlist backend — UI placeholder only ("coming soon")
- Any backend/API changes

---

## Dependencies

- Existing: `isLoggedIn()` in `konimbo.ts`, `useLang()`, `useCart()`, `Icon`, `Button`, `EmptyState`, `Container`, `Spinner`
- No new npm packages required
