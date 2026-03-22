import { useState, useEffect } from 'react';
import { AuthFormShell } from '@/components/account/AuthFormShell';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { useLang } from '@/i18n';
import { populate, submit } from '@/lib/formBridge';

// Confirmed by DOM inspection of https://alufshop.konimbo.co.il/customer_signup
const SIGNUP_FORM = '#show_customer_form form';
const INPUT_BASE = 'w-full bg-page-bg border border-border-light rounded-xl px-4 py-3 text-sm text-text-main placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/40 transition-colors';

export function SignupPage() {
  const { t } = useLang();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
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
      'customer[full_name]': name,
      'customer[email]': email,
      'customer[mobile_phone]': phone,
      'customer[set_password]': password,
      'customer[set_password_confirmation]': confirm,
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
        <div>
          <label className="block text-xs font-bold text-text-muted mb-1.5 uppercase tracking-wide">
            {t('auth.signup.name')}
          </label>
          <input
            type="text"
            dir="auto"
            required
            value={name}
            onChange={e => setName(e.target.value)}
            className={INPUT_BASE}
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-text-muted mb-1.5 uppercase tracking-wide">
            {t('auth.signup.email')}
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
            {t('auth.signup.phone')}
          </label>
          <input
            type="tel"
            dir="ltr"
            required
            value={phone}
            onChange={e => setPhone(e.target.value)}
            className={INPUT_BASE}
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-text-muted mb-1.5 uppercase tracking-wide">
            {t('auth.signup.password')}
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
        <div>
          <label className="block text-xs font-bold text-text-muted mb-1.5 uppercase tracking-wide">
            {t('auth.signup.confirmPassword')}
          </label>
          <input
            type="password"
            dir="ltr"
            required
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            className={INPUT_BASE}
          />
        </div>
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
