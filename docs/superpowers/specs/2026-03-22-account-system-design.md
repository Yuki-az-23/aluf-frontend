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
| `src/App.tsx` | Wire AuthContext + new pages into router |
| `src/i18n/en.json` + `ru.json` | New `auth.*` and `account.*` i18n keys |

---

## Architecture

### Data Flow — Auth Pages (Login / Signup)

```
User fills React form
  → onSubmit: formBridge.populate(nativeFormSelector, fields)
  → formBridge.submit(nativeFormSelector)
  → Browser POST → Konimbo processes → sets auth cookie → redirects
  → AuthContext detects cookie on next poll → loggedIn = true
  → Header updates to "My Account"
```

### Data Flow — Account Page

```
Page mounts (user must be logged in, Konimbo redirects if not)
  → DOM scraper reads Konimbo's hidden profile fields + orders table
  → Structured state: { profile, orders, points }
  → React renders full dashboard
  → "Edit profile" → populates hidden edit form → formBridge.submit()
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
- Polls every 2s; stops polling once `loggedIn === true`
- On logout: cookie is cleared server-side, next poll sets `loggedIn = false`
- Exposes: `{ loggedIn: boolean }`
- Added to `App.tsx` wrapping `CartProvider`

### `formBridge.ts`

```ts
populate(formSelector: string, fields: Record<string, string>): boolean
// Finds native form, sets each input value. Returns false if form not found.

submit(formSelector: string): boolean
// Finds native form, calls .submit(). Returns false if form not found.
```

No AJAX — pure DOM manipulation + native browser POST. Konimbo owns the response.

### `LoginPage.tsx`

- Route: `/customer_login`
- Layout: `AuthFormShell` (logo, card, RTL/LTR aware)
- Fields: email, password, "remember me" checkbox
- Links: "Forgot password" → Konimbo native reset URL, "Sign up" → `/customer_signup`
- On submit: `formBridge.populate('#customer_login_form', { email, password })` → `formBridge.submit()`
- Error detection: if page reloads back to `/customer_login`, check DOM for `.error, .flash-error, [class*="error"]` and surface the message text inline
- Fallback: if native form not found in DOM, show branded error + direct link to page

### `SignupPage.tsx`

- Route: `/customer_signup`
- Layout: `AuthFormShell`
- Fields: full name, email, password, confirm password, phone (optional)
- Links: "Already have an account?" → `/customer_login`
- Same bridge pattern as LoginPage
- Client-side validation: password match check before bridging

### `AccountPage.tsx`

- Routes: `/customer_profile` + `/customer_edit_profile`
- Konimbo redirects unauthenticated users to `/customer_login` natively — no React guard needed
- On mount: runs DOM scraper to extract:
  ```ts
  {
    profile: { name: string, email: string, phone: string },
    orders: Array<{ id: string, date: string, total: number, status: string, items: OrderItem[] }>,
    points: number | null   // null if element not found in DOM
  }
  ```
- Renders full C-plan dashboard:
  - **ProfileCard** — name/email/phone display + "Edit" button
  - **OrdersList** — order rows, expandable to show items, status badge
  - **Champion Points card** — shown only if `points !== null`
  - **Wishlist placeholder** — shown with "coming soon" state

### `AuthFormShell.tsx`

Shared layout for login and signup:
- Centered card on branded background
- Logo at top
- Respects `dir` from `LangProvider` (RTL Hebrew / LTR Russian+English)
- Consistent with existing `AuthFormShell` style patterns in the app

### `OrdersList.tsx`

- Receives `orders` array from AccountPage scraper
- Empty state: `<EmptyState>` component ("No orders yet")
- Each row: order ID, date, total (formatted `toLocaleString('he-IL')` + ₪), status badge, expand toggle
- Expanded: shows item name, quantity, price per item

### `ProfileCard.tsx`

- Receives `profile` from AccountPage scraper
- Shows: name, email, phone (masked or full)
- "Edit Profile" button → `formBridge.populate` on hidden edit form + `formBridge.submit()`
- If profile fields missing from DOM: show skeleton, hide edit button

### `Header.tsx` update

```tsx
const { loggedIn } = useAuth();

// Person icon area becomes:
loggedIn
  ? <a href="/customer_profile"><Icon name="person" /><span>{t('header.myAccount')}</span></a>
  : <a href="/customer_login"><Icon name="person" /><span>{t('header.login')}</span></a>
```

---

## i18n Keys (new)

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
  "account.orders.title": "Order History",
  "account.orders.empty": "No orders yet",
  "account.orders.id": "Order #",
  "account.orders.date": "Date",
  "account.orders.total": "Total",
  "account.orders.status": "Status",
  "account.orders.expand": "Show items",
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
| Native Konimbo form not in DOM | Show branded error message + direct `<a>` link to page |
| Auth failed (page reloads to same URL) | Check DOM for error elements on mount, surface message in React UI |
| Account page scrape returns no data | Show `EmptyState` / skeleton per section |
| User not logged in on account page | Konimbo redirects natively — no React guard needed |
| Points/wishlist not in DOM | Hide those sections gracefully (no placeholder error) |

---

## Out of Scope

- `/checkout` (`/orders/alufshop/new`) — stays native Konimbo, already fed by CartPage via jStorage
- Password reset flow — link points to Konimbo's native reset page
- OAuth / SSO
- Wishlist backend — UI placeholder only ("coming soon")
- Any backend/API changes

---

## Dependencies

- Existing: `isLoggedIn()` in `konimbo.ts`, `useLang()`, `useCart()`, `Icon`, `Button`, `EmptyState`, `Container`
- No new npm packages required
