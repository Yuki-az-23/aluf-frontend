// src/pages/LoginPage.tsx
import { useState, useEffect } from 'react';
import { AuthFormShell } from '@/components/account/AuthFormShell';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { useLang } from '@/i18n';
import { populate, submit } from '@/lib/formBridge';

// Confirmed by DOM inspection of https://alufshop.konimbo.co.il/customer_login
const LOGIN_FORM = '#show_customer_session_form form';
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
      'customer_session[username]': email,
      'customer_session[password]': password,
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
            type="text"
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
          <a href="/customer_login?forget_password=true" className="text-primary hover:underline text-xs">
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
