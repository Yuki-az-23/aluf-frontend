# Account System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build custom React login, signup, and account dashboard pages that overlay Konimbo's native forms using DOM manipulation — no backend changes.

**Architecture:** Each auth page renders a branded React UI shell. On form submit, `formBridge.ts` finds Konimbo's hidden native form in the DOM, populates its `input[name]` fields, and fires `.submit()` — Konimbo owns the auth and redirect. The account dashboard scrapes Konimbo's pre-rendered DOM after a 300ms delay for profile/order data. `AuthContext` polls `isLoggedIn()` every 2s continuously to keep Header and MobileMenu in sync.

**Tech Stack:** React 18, TypeScript, Tailwind CSS, Vite. No test runner — verification is `npx tsc --noEmit` + browser visual check. All commands run from the repo root: `/Users/AZ-Live/Dev projacts/aluf frontend`.

---

## ⚠️ PREREQUISITE: DOM Inspection (do this before writing any code)

Before implementing Tasks 1–12, inspect the live Konimbo pages to confirm native form selectors. You have a logged-in Chrome session open at `https://www.aluf.co.il/customer_login`.

- [ ] **Inspect `/customer_login`** — Open DevTools → Elements. Find the `<form>` element. Note its `id` or `action` attribute, and the `name` attribute on the email and password inputs.
- [ ] **Inspect `/customer_signup`** — Navigate to `https://www.aluf.co.il/customer_signup`. Find the `<form>` and all input `name` attributes (name, email, password, phone).
- [ ] **Inspect `/customer_profile`** (logged in) — Navigate to `https://www.aluf.co.il/customer_profile`. Find: profile field values (name/email/phone), orders table structure (row selector, column order for ID/date/total/status), and loyalty points element if present.
- [ ] **Inspect `/customer_edit_profile`** — Find `<form>` selector and input `name` attributes (these should be pre-populated by Konimbo with current customer data).
- [ ] **Record confirmed selectors** — Keep them open in a note; you will paste them into `formBridge.ts` as comments in Task 1.

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `src/lib/formBridge.ts` | Create | Populate + submit hidden Konimbo native forms |
| `src/lib/AuthContext.tsx` | Create | Continuous 2s cookie poll → `loggedIn` state |
| `src/App.tsx` | Modify | Add AuthProvider, replace 3 `null` returns |
| `src/i18n/en.json` | Modify | Add `auth.*`, `account.*`, `header.myAccount` |
| `src/i18n/ru.json` | Modify | Same keys in Russian |
| `src/i18n/he.json` | Modify | Same keys in Hebrew |
| `src/components/account/AuthFormShell.tsx` | Create | Centered card layout for login/signup |
| `src/pages/LoginPage.tsx` | Create | Login form → formBridge |
| `src/pages/SignupPage.tsx` | Create | Signup form → formBridge |
| `src/components/account/ProfileCard.tsx` | Create | View + edit mode for profile |
| `src/components/account/OrdersList.tsx` | Create | Order history list |
| `src/pages/AccountPage.tsx` | Create | Dashboard: scrape DOM → render sections |
| `src/components/layout/Header.tsx` | Modify | Auth-aware person icon |
| `src/components/layout/MobileMenu.tsx` | Modify | Auth-aware login/account link |

---

## Task 1: `formBridge.ts`

**Files:**
- Create: `src/lib/formBridge.ts`

- [ ] **Step 1: Create the file**

```typescript
// src/lib/formBridge.ts

// ── Confirmed Konimbo native form selectors ──────────────────────────────────
// Paste confirmed selectors from DOM inspection here, e.g.:
// LOGIN:   'form#new_customer'   fields: 'customer[email]', 'customer[password]'
// SIGNUP:  'form#new_customer_registration'  fields: 'customer[name]', ...
// ACCOUNT: 'form#edit_customer'  fields: 'customer[name]', 'customer[email]', ...

/**
 * Populate input[name] fields inside a native Konimbo form.
 * Keys in `fields` map to input[name="{key}"] elements within the form.
 * Returns false if the form element is not found in the DOM.
 */
export function populate(
  formSelector: string,
  fields: Record<string, string>,
): boolean {
  const form = document.querySelector<HTMLFormElement>(formSelector);
  if (!form) return false;
  for (const [name, value] of Object.entries(fields)) {
    const input = form.querySelector<HTMLInputElement | HTMLTextAreaElement>(
      `[name="${name}"]`,
    );
    if (input) input.value = value;
  }
  return true;
}

/**
 * Submit a native Konimbo form by selector.
 * Returns false if the form element is not found in the DOM.
 * Note: this triggers a full browser POST + page navigation — there is no response to await.
 */
export function submit(formSelector: string): boolean {
  const form = document.querySelector<HTMLFormElement>(formSelector);
  if (!form) return false;
  form.submit();
  return true;
}
```

- [ ] **Step 2: Update the selector comments** — Replace the placeholder comments with the actual confirmed selectors from the DOM inspection prerequisite.

- [ ] **Step 3: Type-check**

```bash
cd "/Users/AZ-Live/Dev projacts/aluf frontend" && npx tsc --noEmit
```
Expected: no errors related to `formBridge.ts`.

- [ ] **Step 4: Commit**

```bash
cd "/Users/AZ-Live/Dev projacts/aluf frontend"
git add src/lib/formBridge.ts
git commit -m "feat: add formBridge utility for Konimbo native form population"
```

---

## Task 2: `AuthContext.tsx`

**Files:**
- Create: `src/lib/AuthContext.tsx`

- [ ] **Step 1: Create the file**

```typescript
// src/lib/AuthContext.tsx
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { isLoggedIn } from './konimbo';

interface AuthContextValue {
  loggedIn: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loggedIn, setLoggedIn] = useState(isLoggedIn);

  useEffect(() => {
    // Poll every 2s continuously — detects both login and logout transitions
    const id = setInterval(() => setLoggedIn(isLoggedIn()), 2000);
    return () => clearInterval(id);
  }, []);

  return (
    <AuthContext.Provider value={{ loggedIn }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
```

- [ ] **Step 2: Type-check**

```bash
cd "/Users/AZ-Live/Dev projacts/aluf frontend" && npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/AuthContext.tsx
git commit -m "feat: add AuthContext with continuous 2s isLoggedIn poll"
```

---

## Task 3: Wire `App.tsx`

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: Add imports and replace the three `null` returns**

Open `src/App.tsx`. Make these changes:

Add 4 imports after the existing imports:
```typescript
import { AuthProvider } from '@/lib/AuthContext';
import { LoginPage } from '@/pages/LoginPage';
import { SignupPage } from '@/pages/SignupPage';
import { AccountPage } from '@/pages/AccountPage';
```

In `PageRouter`, replace:
```typescript
    case 'login':
    case 'signup':
    case 'account':
    case 'checkout':
      return null; // let Konimbo's native UI show through
```
With:
```typescript
    case 'login':    return <LoginPage />;
    case 'signup':   return <SignupPage />;
    case 'account':  return <AccountPage />;
    case 'checkout': return null; // stays native — CartPage handles pre-checkout
```

In `App()`, wrap `<StoreDataProvider>` children with `<AuthProvider>`:
```tsx
<StoreDataProvider>
  <AuthProvider>
    <CartProvider>
      <PCBuilderProvider>
        <AppInner />
      </PCBuilderProvider>
    </CartProvider>
  </AuthProvider>
</StoreDataProvider>
```

- [ ] **Step 2: Type-check** — this will fail on missing page files, which is expected at this stage. The errors will resolve as you complete subsequent tasks. If there are errors unrelated to the missing files, fix them now.

- [ ] **Step 3: Commit**

```bash
git add src/App.tsx
git commit -m "feat: wire AuthProvider and account pages into App router"
```

---

## Task 4: i18n Keys

**Files:**
- Modify: `src/i18n/en.json`
- Modify: `src/i18n/ru.json`
- Modify: `src/i18n/he.json`

All three files must receive every key. English fallback is not acceptable — all three files are fully translated for existing keys.

- [ ] **Step 1: Add keys to `en.json`**

Open `src/i18n/en.json`. Before the closing `}`, add:

```json
  "header.myAccount": "My Account",
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
  "auth.signup.passwordMismatch": "Passwords do not match",
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
```

- [ ] **Step 2: Add keys to `ru.json`** — Add the same keys with Russian translations:

```json
  "header.myAccount": "Мой аккаунт",
  "auth.login.title": "Вход для клиентов",
  "auth.login.email": "Адрес электронной почты",
  "auth.login.password": "Пароль",
  "auth.login.remember": "Запомнить меня",
  "auth.login.forgot": "Забыли пароль?",
  "auth.login.submit": "Войти",
  "auth.login.noAccount": "Нет аккаунта?",
  "auth.login.signup": "Зарегистрироваться",
  "auth.login.error": "Неверный email или пароль",
  "auth.login.formError": "Произошла ошибка, попробуйте снова",
  "auth.signup.title": "Создать аккаунт",
  "auth.signup.name": "Полное имя",
  "auth.signup.email": "Адрес электронной почты",
  "auth.signup.password": "Пароль",
  "auth.signup.confirmPassword": "Подтвердите пароль",
  "auth.signup.phone": "Телефон (необязательно)",
  "auth.signup.submit": "Создать аккаунт",
  "auth.signup.hasAccount": "Уже есть аккаунт?",
  "auth.signup.login": "Войти",
  "auth.signup.passwordMismatch": "Пароли не совпадают",
  "account.title": "Мой аккаунт",
  "account.profile.title": "Профиль",
  "account.profile.name": "Полное имя",
  "account.profile.email": "Email",
  "account.profile.phone": "Телефон",
  "account.profile.edit": "Редактировать профиль",
  "account.profile.save": "Сохранить изменения",
  "account.profile.cancel": "Отмена",
  "account.orders.title": "История заказов",
  "account.orders.empty": "Заказов пока нет",
  "account.orders.id": "Заказ №",
  "account.orders.date": "Дата",
  "account.orders.total": "Итого",
  "account.orders.status": "Статус",
  "account.orders.expand": "Показать товары",
  "account.orders.collapse": "Скрыть товары",
  "account.points.title": "Баллы «Чемпион»",
  "account.points.balance": "Ваш баланс",
  "account.wishlist.title": "Список желаний",
  "account.wishlist.soon": "Скоро"
```

- [ ] **Step 3: Add keys to `he.json`** — Add the same keys with Hebrew translations:

```json
  "header.myAccount": "האזור האישי",
  "auth.login.title": "כניסת לקוחות",
  "auth.login.email": "כתובת אימייל",
  "auth.login.password": "סיסמה",
  "auth.login.remember": "זכור אותי",
  "auth.login.forgot": "שכחתי סיסמה",
  "auth.login.submit": "כניסה",
  "auth.login.noAccount": "אין לך חשבון?",
  "auth.login.signup": "הרשמה",
  "auth.login.error": "אימייל או סיסמה שגויים",
  "auth.login.formError": "אירעה שגיאה, נסה שנית",
  "auth.signup.title": "יצירת חשבון",
  "auth.signup.name": "שם מלא",
  "auth.signup.email": "כתובת אימייל",
  "auth.signup.password": "סיסמה",
  "auth.signup.confirmPassword": "אימות סיסמה",
  "auth.signup.phone": "טלפון (אופציונלי)",
  "auth.signup.submit": "יצירת חשבון",
  "auth.signup.hasAccount": "כבר יש לך חשבון?",
  "auth.signup.login": "כניסה",
  "auth.signup.passwordMismatch": "הסיסמאות אינן תואמות",
  "account.title": "האזור האישי",
  "account.profile.title": "פרופיל",
  "account.profile.name": "שם מלא",
  "account.profile.email": "אימייל",
  "account.profile.phone": "טלפון",
  "account.profile.edit": "עריכת פרופיל",
  "account.profile.save": "שמירת שינויים",
  "account.profile.cancel": "ביטול",
  "account.orders.title": "היסטוריית הזמנות",
  "account.orders.empty": "אין הזמנות עדיין",
  "account.orders.id": "הזמנה מס׳",
  "account.orders.date": "תאריך",
  "account.orders.total": "סכום",
  "account.orders.status": "סטטוס",
  "account.orders.expand": "הצג פריטים",
  "account.orders.collapse": "הסתר פריטים",
  "account.points.title": "נקודות אלוף",
  "account.points.balance": "היתרה שלך",
  "account.wishlist.title": "רשימת מועדפים",
  "account.wishlist.soon": "בקרוב"
```

- [ ] **Step 4: Type-check**

```bash
cd "/Users/AZ-Live/Dev projacts/aluf frontend" && npx tsc --noEmit
```

- [ ] **Step 5: Commit**

```bash
git add src/i18n/en.json src/i18n/ru.json src/i18n/he.json
git commit -m "feat: add auth and account i18n keys to all three language files"
```

---

## Task 5: `AuthFormShell.tsx`

**Files:**
- Create: `src/components/account/AuthFormShell.tsx`

- [ ] **Step 1: Create the directory and file**

```bash
mkdir -p "/Users/AZ-Live/Dev projacts/aluf frontend/src/components/account"
```

```typescript
// src/components/account/AuthFormShell.tsx
import type { ReactNode } from 'react';
import { Container } from '@/components/layout/Container';

// Same logo URL used in Header.tsx and CartPage.tsx
const logoSrc = 'https://cdn.jsdelivr.net/gh/Yuki-az-23/aluf-frontend@master/src/assets/logo.png';

interface AuthFormShellProps {
  title: string;
  children: ReactNode;
}

export function AuthFormShell({ title, children }: AuthFormShellProps) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12">
      <Container>
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <a href="/">
              <img src={logoSrc} alt="Aluf Computers" className="h-12 w-auto mx-auto mb-4" />
            </a>
            <h1 className="text-2xl font-bold text-text-main">{title}</h1>
          </div>
          <div className="bg-card-bg rounded-2xl shadow-lg p-8">
            {children}
          </div>
        </div>
      </Container>
    </div>
  );
}
```

- [ ] **Step 2: Type-check**

```bash
cd "/Users/AZ-Live/Dev projacts/aluf frontend" && npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add src/components/account/AuthFormShell.tsx
git commit -m "feat: add AuthFormShell shared layout for auth pages"
```

---

## Task 6: `LoginPage.tsx`

**Files:**
- Create: `src/pages/LoginPage.tsx`

- [ ] **Step 1: Create the file** — Replace `LOGIN_FORM` with the confirmed selector from DOM inspection.

```typescript
// src/pages/LoginPage.tsx
import { useState, useEffect } from 'react';
import { AuthFormShell } from '@/components/account/AuthFormShell';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { useLang } from '@/i18n';
import { populate, submit } from '@/lib/formBridge';

// ── Replace with confirmed selector from DOM inspection ──────────────────────
const LOGIN_FORM = 'form#new_customer, form[action*="customer_login"]';
const INPUT_BASE = 'w-full bg-page-bg border border-border-light rounded-xl px-4 py-3 text-sm text-text-main placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/40 transition-colors';

export function LoginPage() {
  const { t } = useLang();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [noForm, setNoForm] = useState(false);

  // Detect auth failure: Konimbo reloaded the page back to /customer_login with an error
  useEffect(() => {
    const timer = setTimeout(() => {
      const errorEl = document.querySelector<HTMLElement>(
        '.error, .flash-error, [class*="error"], .alert-danger, .notice',
      );
      if (errorEl?.textContent?.trim()) {
        setError(errorEl.textContent.trim());
      }
      if (!document.querySelector(LOGIN_FORM)) {
        setNoForm(true);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Note: "remember me" is UI-only — session persistence is handled natively by Konimbo
    const ok = populate(LOGIN_FORM, {
      'customer[email]': email,
      'customer[password]': password,
    });
    if (!ok) { setNoForm(true); return; }
    setSubmitting(true);
    submit(LOGIN_FORM);
  }

  if (noForm) {
    return (
      <AuthFormShell title={t('auth.login.title')}>
        <p className="text-center text-text-muted mb-4">{t('auth.login.formError')}</p>
        <a href="/customer_login" className="block text-center text-primary hover:underline">
          {t('auth.login.title')}
        </a>
      </AuthFormShell>
    );
  }

  return (
    <AuthFormShell title={t('auth.login.title')}>
      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-text-muted mb-1.5 uppercase tracking-wide">
            {t('auth.login.email')}
          </label>
          <input
            type="email"
            dir="ltr"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            className={INPUT_BASE}
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-text-muted mb-1.5 uppercase tracking-wide">
            {t('auth.login.password')}
          </label>
          <input
            type="password"
            dir="ltr"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            className={INPUT_BASE}
          />
        </div>
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-text-muted cursor-pointer">
            <input
              type="checkbox"
              checked={remember}
              onChange={e => setRemember(e.target.checked)}
              className="rounded"
            />
            {t('auth.login.remember')}
          </label>
          <a href="/customer_forgot_password" className="text-primary hover:underline text-xs">
            {t('auth.login.forgot')}
          </a>
        </div>
        <Button type="submit" size="lg" disabled={submitting} className="w-full">
          {submitting ? <Spinner size="sm" /> : t('auth.login.submit')}
        </Button>
      </form>
      <p className="text-center text-sm text-text-muted mt-6">
        {t('auth.login.noAccount')}{' '}
        <a href="/customer_signup" className="text-primary hover:underline font-medium">
          {t('auth.login.signup')}
        </a>
      </p>
    </AuthFormShell>
  );
}
```

- [ ] **Step 2: Type-check**

```bash
cd "/Users/AZ-Live/Dev projacts/aluf frontend" && npx tsc --noEmit
```
Expected: no errors (App.tsx errors from Task 3 should now resolve for the `login` case).

- [ ] **Step 3: Browser verify** — Start the dev server (`npm run dev`), navigate to `/?__page=login` (or set `window.__ALUF_DEV_PAGE_TYPE__ = 'login'` in console). Confirm: branded card renders, form submits, no TypeScript errors in console.

- [ ] **Step 4: Commit**

```bash
git add src/pages/LoginPage.tsx
git commit -m "feat: add custom LoginPage with Konimbo form bridge"
```

---

## Task 7: `SignupPage.tsx`

**Files:**
- Create: `src/pages/SignupPage.tsx`

- [ ] **Step 1: Create the file** — Replace `SIGNUP_FORM` with confirmed selector.

```typescript
// src/pages/SignupPage.tsx
import { useState, useEffect } from 'react';
import { AuthFormShell } from '@/components/account/AuthFormShell';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { useLang } from '@/i18n';
import { populate, submit } from '@/lib/formBridge';

// ── Replace with confirmed selector from DOM inspection ──────────────────────
const SIGNUP_FORM = 'form#new_customer_registration, form[action*="customer_signup"]';
const INPUT_BASE = 'w-full bg-page-bg border border-border-light rounded-xl px-4 py-3 text-sm text-text-main placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/40 transition-colors';

export function SignupPage() {
  const { t } = useLang();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [noForm, setNoForm] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const errorEl = document.querySelector<HTMLElement>(
        '.error, .flash-error, [class*="error"], .alert-danger, .notice',
      );
      if (errorEl?.textContent?.trim()) {
        setError(errorEl.textContent.trim());
      }
      if (!document.querySelector(SIGNUP_FORM)) {
        setNoForm(true);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setError(t('auth.signup.passwordMismatch'));
      return;
    }
    const ok = populate(SIGNUP_FORM, {
      'customer[name]': name,
      'customer[email]': email,
      'customer[password]': password,
      'customer[phone]': phone,
    });
    if (!ok) { setNoForm(true); return; }
    setSubmitting(true);
    submit(SIGNUP_FORM);
  }

  if (noForm) {
    return (
      <AuthFormShell title={t('auth.signup.title')}>
        <p className="text-center text-text-muted mb-4">{t('auth.login.formError')}</p>
        <a href="/customer_signup" className="block text-center text-primary hover:underline">
          {t('auth.signup.title')}
        </a>
      </AuthFormShell>
    );
  }

  return (
    <AuthFormShell title={t('auth.signup.title')}>
      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          { label: t('auth.signup.name'), value: name, set: setName, type: 'text', dir: 'auto' },
          { label: t('auth.signup.email'), value: email, set: setEmail, type: 'email', dir: 'ltr' },
          { label: t('auth.signup.password'), value: password, set: setPassword, type: 'password', dir: 'ltr' },
          { label: t('auth.signup.confirmPassword'), value: confirm, set: setConfirm, type: 'password', dir: 'ltr' },
          { label: t('auth.signup.phone'), value: phone, set: setPhone, type: 'tel', dir: 'ltr' },
        ].map(({ label, value, set, type, dir }) => (
          <div key={label}>
            <label className="block text-xs font-bold text-text-muted mb-1.5 uppercase tracking-wide">
              {label}
            </label>
            <input
              type={type}
              dir={dir as 'ltr' | 'auto'}
              required={label !== t('auth.signup.phone')}
              value={value}
              onChange={e => set(e.target.value)}
              className={INPUT_BASE}
            />
          </div>
        ))}
        <Button type="submit" size="lg" disabled={submitting} className="w-full">
          {submitting ? <Spinner size="sm" /> : t('auth.signup.submit')}
        </Button>
      </form>
      <p className="text-center text-sm text-text-muted mt-6">
        {t('auth.signup.hasAccount')}{' '}
        <a href="/customer_login" className="text-primary hover:underline font-medium">
          {t('auth.signup.login')}
        </a>
      </p>
    </AuthFormShell>
  );
}
```

- [ ] **Step 2: Type-check**

```bash
cd "/Users/AZ-Live/Dev projacts/aluf frontend" && npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add src/pages/SignupPage.tsx
git commit -m "feat: add custom SignupPage with Konimbo form bridge"
```

---

## Task 8: `ProfileCard.tsx`

**Files:**
- Create: `src/components/account/ProfileCard.tsx`

- [ ] **Step 1: Create the file**

```typescript
// src/components/account/ProfileCard.tsx
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { useLang } from '@/i18n';
import { populate, submit } from '@/lib/formBridge';

// ── Replace with confirmed selector from DOM inspection ──────────────────────
const EDIT_FORM = 'form#edit_customer, form[action*="customer_edit_profile"]';
const INPUT_BASE = 'w-full bg-page-bg border border-border-light rounded-xl px-4 py-3 text-sm text-text-main focus:outline-none focus:ring-2 focus:ring-primary/40 transition-colors';

export interface ProfileData {
  name: string;
  email: string;
  phone: string;
}

interface ProfileCardProps {
  profile: ProfileData | null;
  mode: 'view' | 'edit';
}

export function ProfileCard({ profile, mode }: ProfileCardProps) {
  const { t } = useLang();

  if (!profile) {
    // Skeleton when scrape returned nothing
    return (
      <div className="bg-card-bg border border-border-light rounded-2xl p-6 animate-pulse">
        <div className="h-4 bg-border-light rounded w-1/3 mb-4" />
        <div className="space-y-3">
          <div className="h-3 bg-border-light rounded w-2/3" />
          <div className="h-3 bg-border-light rounded w-1/2" />
          <div className="h-3 bg-border-light rounded w-1/3" />
        </div>
      </div>
    );
  }

  if (mode === 'view') {
    return (
      <div className="bg-card-bg border border-border-light rounded-2xl p-6">
        <h2 className="font-bold text-lg text-text-main mb-4">{t('account.profile.title')}</h2>
        <dl className="space-y-3">
          {[
            { label: t('account.profile.name'), value: profile.name },
            { label: t('account.profile.email'), value: profile.email },
            { label: t('account.profile.phone'), value: profile.phone },
          ].filter(r => r.value).map(({ label, value }) => (
            <div key={label} className="flex gap-4">
              <dt className="text-xs font-bold text-text-muted uppercase tracking-wide w-24 shrink-0 pt-0.5">{label}</dt>
              <dd className="text-sm text-text-main">{value}</dd>
            </div>
          ))}
        </dl>
        <a
          href="/customer_edit_profile"
          className="mt-5 inline-flex items-center gap-2 text-sm text-primary font-medium hover:underline"
        >
          {t('account.profile.edit')} →
        </a>
      </div>
    );
  }

  // Edit mode
  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const fields: Record<string, string> = {};
    new FormData(form).forEach((v, k) => { fields[k] = v as string; });
    populate(EDIT_FORM, fields);
    submit(EDIT_FORM);
  }

  return (
    <div className="bg-card-bg border border-border-light rounded-2xl p-6">
      <h2 className="font-bold text-lg text-text-main mb-4">{t('account.profile.edit')}</h2>
      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-text-muted mb-1.5 uppercase tracking-wide">{t('account.profile.name')}</label>
          <input name="customer[name]" defaultValue={profile.name} className={INPUT_BASE} dir="auto" />
        </div>
        <div>
          <label className="block text-xs font-bold text-text-muted mb-1.5 uppercase tracking-wide">{t('account.profile.email')}</label>
          <input name="customer[email]" type="email" defaultValue={profile.email} className={INPUT_BASE} dir="ltr" />
        </div>
        <div>
          <label className="block text-xs font-bold text-text-muted mb-1.5 uppercase tracking-wide">{t('account.profile.phone')}</label>
          <input name="customer[phone]" type="tel" defaultValue={profile.phone} className={INPUT_BASE} dir="ltr" />
        </div>
        <div className="flex gap-3 pt-2">
          <Button type="submit" size="md">{t('account.profile.save')}</Button>
          <a href="/customer_profile">
            <Button type="button" variant="outline" size="md">{t('account.profile.cancel')}</Button>
          </a>
        </div>
      </form>
    </div>
  );
}
```

- [ ] **Step 2: Type-check**

```bash
cd "/Users/AZ-Live/Dev projacts/aluf frontend" && npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add src/components/account/ProfileCard.tsx
git commit -m "feat: add ProfileCard component (view + edit modes)"
```

---

## Task 9: `OrdersList.tsx`

**Files:**
- Create: `src/components/account/OrdersList.tsx`

- [ ] **Step 1: Create the file**

```typescript
// src/components/account/OrdersList.tsx
import { useState } from 'react';
import { EmptyState } from '@/components/ui/EmptyState';
import { useLang } from '@/i18n';

export interface OrderItem {
  name: string;
  qty: number;
  price: number;
}

export interface Order {
  id: string;
  date: string;
  total: number;
  status: string;
  items: OrderItem[];
}

interface OrdersListProps {
  orders: Order[];
}

export function OrdersList({ orders }: OrdersListProps) {
  const { t } = useLang();
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  if (orders.length === 0) {
    return (
      <EmptyState
        icon="receipt_long"
        title={t('account.orders.empty')}
      />
    );
  }

  function toggle(id: string) {
    setExpanded(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  return (
    <div className="space-y-3">
      {orders.map(order => (
        <div key={order.id} className="bg-card-bg border border-border-light rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between p-4 gap-4">
            <div className="flex gap-6 flex-wrap text-sm">
              <span className="font-bold text-text-main">{t('account.orders.id')}{order.id}</span>
              <span className="text-text-muted">{order.date}</span>
              <span className="font-medium text-text-main">
                {order.total.toLocaleString('he-IL')} ₪
              </span>
              {order.status && (
                <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-bold rounded-full">
                  {order.status}
                </span>
              )}
            </div>
            {order.items.length > 0 && (
              <button
                onClick={() => toggle(order.id)}
                className="text-xs text-primary hover:underline shrink-0"
              >
                {expanded.has(order.id) ? t('account.orders.collapse') : t('account.orders.expand')}
              </button>
            )}
          </div>
          {expanded.has(order.id) && (
            <div className="border-t border-border-light divide-y divide-border-light">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between items-center px-4 py-3 text-sm">
                  <span className="text-text-main">{item.name}</span>
                  <span className="text-text-muted">×{item.qty}</span>
                  <span className="font-medium text-text-main">
                    {item.price.toLocaleString('he-IL')} ₪
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Type-check**

```bash
cd "/Users/AZ-Live/Dev projacts/aluf frontend" && npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add src/components/account/OrdersList.tsx
git commit -m "feat: add OrdersList component with expand/collapse"
```

---

## Task 10: `AccountPage.tsx`

**Files:**
- Create: `src/pages/AccountPage.tsx`

- [ ] **Step 1: Create the file** — The DOM selectors in `scrapeAccountData()` are approximate; update them after inspecting the live `/customer_profile` page in the prerequisite step.

```typescript
// src/pages/AccountPage.tsx
import { useState, useEffect } from 'react';
import { Container } from '@/components/layout/Container';
import { ProfileCard, type ProfileData } from '@/components/account/ProfileCard';
import { OrdersList, type Order } from '@/components/account/OrdersList';
import { EmptyState } from '@/components/ui/EmptyState';
import { Spinner } from '@/components/ui/Spinner';
import { useLang } from '@/i18n';

interface AccountData {
  profile: ProfileData | null;
  orders: Order[];
  points: number | null;
}

// ── Update selectors after inspecting live /customer_profile page ─────────────
function scrapeAccountData(): AccountData {
  // Profile — try input values first (edit page), fall back to text content (view page)
  function val(selector: string): string {
    const el = document.querySelector<HTMLInputElement | HTMLElement>(selector);
    if (!el) return '';
    return 'value' in el ? (el as HTMLInputElement).value : el.textContent?.trim() || '';
  }

  const profile: ProfileData = {
    name:  val('[name="customer[name]"], .customer-name, #customer_name'),
    email: val('[name="customer[email]"], .customer-email, #customer_email'),
    phone: val('[name="customer[phone]"], .customer-phone, #customer_phone'),
  };
  const hasProfile = !!(profile.name || profile.email);

  // Orders — find the orders table and parse rows
  // Update selector after inspecting live DOM
  const orders: Order[] = [];
  const orderRows = document.querySelectorAll<HTMLElement>(
    '.orders-table tr[data-order-id], .order-row, table.orders tbody tr',
  );
  orderRows.forEach(row => {
    const cells = row.querySelectorAll('td');
    if (cells.length < 3) return;
    const id     = row.getAttribute('data-order-id') || cells[0]?.textContent?.trim() || '';
    const date   = cells[1]?.textContent?.trim() || '';
    const total  = parseFloat((cells[2]?.textContent || '0').replace(/[^\d.]/g, '')) || 0;
    const status = cells[3]?.textContent?.trim() || '';
    orders.push({ id, date, total, status, items: [] });
  });

  // Points — update selector after inspecting live DOM
  const pointsEl = document.querySelector<HTMLElement>('.champion-points, .loyalty-points, [class*="points"]');
  const pointsText = pointsEl?.textContent?.replace(/[^\d]/g, '');
  const points = pointsText ? parseInt(pointsText, 10) : null;

  return {
    profile: hasProfile ? profile : null,
    orders,
    points,
  };
}

// Detect if we're on the edit profile page
function isEditMode(): boolean {
  return /\/customer_edit_profile/.test(window.location.pathname);
}

export function AccountPage() {
  const { t } = useLang();
  const [data, setData] = useState<AccountData | null>(null);
  const editMode = isEditMode();

  useEffect(() => {
    // Defer 300ms so Konimbo's page JS finishes rendering its native content
    const timer = setTimeout(() => {
      setData(scrapeAccountData());
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <Container>
      <div className="py-10">
        <h1 className="text-3xl font-black text-text-main mb-8">{t('account.title')}</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column: profile + points + wishlist */}
          <div className="space-y-4">
            <ProfileCard profile={data.profile} mode={editMode ? 'edit' : 'view'} />

            {/* Champion Points — only if found in DOM */}
            {data.points !== null && (
              <div className="bg-card-bg border border-border-light rounded-2xl p-6">
                <h2 className="font-bold text-lg text-text-main mb-2">{t('account.points.title')}</h2>
                <p className="text-text-muted text-sm mb-1">{t('account.points.balance')}</p>
                <p className="text-4xl font-black text-primary">{data.points.toLocaleString('he-IL')}</p>
              </div>
            )}

            {/* Wishlist placeholder */}
            <div className="bg-card-bg border border-border-light rounded-2xl p-6">
              <h2 className="font-bold text-lg text-text-main mb-2">{t('account.wishlist.title')}</h2>
              <EmptyState icon="favorite_border" title={t('account.wishlist.soon')} />
            </div>
          </div>

          {/* Right column: order history */}
          <div className="lg:col-span-2">
            <h2 className="font-bold text-lg text-text-main mb-4">{t('account.orders.title')}</h2>
            <OrdersList orders={data.orders} />
          </div>
        </div>
      </div>
    </Container>
  );
}
```

- [ ] **Step 2: Update DOM selectors** — Using the findings from the prerequisite DOM inspection, update `scrapeAccountData()` selectors to match the actual Konimbo HTML structure.

- [ ] **Step 3: Type-check**

```bash
cd "/Users/AZ-Live/Dev projacts/aluf frontend" && npx tsc --noEmit
```
Expected: no errors (all App.tsx import errors should now be resolved).

- [ ] **Step 4: Browser verify** — Navigate to the live `/customer_profile` page. Confirm: profile data loads, orders render, no console errors.

- [ ] **Step 5: Commit**

```bash
git add src/pages/AccountPage.tsx
git commit -m "feat: add AccountPage dashboard with DOM scraper"
```

---

## Task 11: Update `Header.tsx`

**Files:**
- Modify: `src/components/layout/Header.tsx`

- [ ] **Step 1: Add `useAuth` import**

In `Header.tsx`, add to the imports:
```typescript
import { useAuth } from '@/lib/AuthContext';
```

- [ ] **Step 2: Read auth state**

Inside the `Header` function, add after the existing hooks:
```typescript
const { loggedIn } = useAuth();
```

- [ ] **Step 3: Replace the static login link**

Find (around line 50):
```tsx
<a href="/customer_login" className="text-header-text-muted hover:text-header-text transition flex flex-col items-center gap-0.5 group">
  <Icon name="person" className="transition-colors" />
  <span className="text-[10px] hidden sm:block font-medium">{t('header.login')}</span>
</a>
```

Replace with:
```tsx
<a
  href={loggedIn ? '/customer_profile' : '/customer_login'}
  className="text-header-text-muted hover:text-header-text transition flex flex-col items-center gap-0.5 group"
>
  <Icon name="person" className="transition-colors" />
  <span className="text-[10px] hidden sm:block font-medium">
    {loggedIn ? t('header.myAccount') : t('header.login')}
  </span>
</a>
```

- [ ] **Step 4: Type-check**

```bash
cd "/Users/AZ-Live/Dev projacts/aluf frontend" && npx tsc --noEmit
```

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/Header.tsx
git commit -m "feat: make Header person icon auth-aware"
```

---

## Task 12: Update `MobileMenu.tsx`

**Files:**
- Modify: `src/components/layout/MobileMenu.tsx`

- [ ] **Step 1: Add `useAuth` import**

```typescript
import { useAuth } from '@/lib/AuthContext';
```

- [ ] **Step 2: Read auth state**

Inside the `MobileMenu` component function, add:
```typescript
const { loggedIn } = useAuth();
```

- [ ] **Step 3: Replace the hardcoded login link** (currently at line 62)

Find:
```tsx
<a href="https://alufshop.konimbo.co.il/login" className="flex-1 flex items-center justify-center gap-2 bg-card-bg border border-border-light py-3 rounded-xl">
  <Icon name="person" /> {t('header.login')}
</a>
```

Replace with:
```tsx
<a
  href={loggedIn ? '/customer_profile' : '/customer_login'}
  className="flex-1 flex items-center justify-center gap-2 bg-card-bg border border-border-light py-3 rounded-xl"
>
  <Icon name="person" />
  {loggedIn ? t('header.myAccount') : t('header.login')}
</a>
```

- [ ] **Step 4: Type-check**

```bash
cd "/Users/AZ-Live/Dev projacts/aluf frontend" && npx tsc --noEmit
```
Expected: no errors across the entire codebase.

- [ ] **Step 5: Browser verify** — Log in on the live site. Confirm: Header and MobileMenu show "My Account" / "האזור האישי". Log out. Confirm: reverts to "Login".

- [ ] **Step 6: Final commit**

```bash
git add src/components/layout/MobileMenu.tsx
git commit -m "feat: make MobileMenu login link auth-aware"
```

---

## Final Verification

- [ ] `npx tsc --noEmit` — zero errors
- [ ] Dev server: login page renders at `/customer_login`
- [ ] Dev server: signup page renders at `/customer_signup`
- [ ] Dev server: account page renders at `/customer_profile` (logged in)
- [ ] Header shows "My Account" when cookie `current_customer_logged_in_css` is set
- [ ] MobileMenu shows "My Account" when logged in
- [ ] All three language files have the new keys (spot-check `ru.json` and `he.json`)
- [ ] Build passes: `npm run build`
