import { useState, useEffect } from 'react';
import { useLang } from '@/i18n';

const STORAGE_KEY = 'aluf_cookies_accepted';
const PRIVACY_URL = 'https://www.aluf.co.il/pages/54957-%D7%AA%D7%A7%D7%A0%D7%95%D7%9F-%D7%A4%D7%A8%D7%98%D7%99%D7%95%D7%AA';

export function CookieConsent() {
  const { t } = useLang();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  function accept() {
    try { localStorage.setItem(STORAGE_KEY, '1'); } catch {}
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label={t('cookie.banner')}
      className="fixed bottom-0 inset-x-0 z-[200] bg-[#0a0a1a]/95 backdrop-blur-md border-t border-white/10 shadow-2xl"
    >
      <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Icon */}
        <span className="text-2xl shrink-0 hidden sm:block" aria-hidden="true">🍪</span>

        {/* Text */}
        <p className="flex-1 text-sm text-white/80 leading-relaxed">
          {t('cookie.text')}{' '}
          <a
            href={PRIVACY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline font-semibold hover:opacity-80 transition-opacity"
          >
            {t('cookie.policyLink')}
          </a>
        </p>

        {/* Actions */}
        <div className="flex gap-3 shrink-0 w-full sm:w-auto">
          <button
            onClick={accept}
            className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors"
          >
            {t('cookie.accept')}
          </button>
          <a
            href={PRIVACY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl border border-white/20 text-white/70 text-sm font-semibold hover:border-white/50 hover:text-white transition-colors text-center"
          >
            {t('cookie.learnMore')}
          </a>
        </div>
      </div>
    </div>
  );
}
