import { useState, useEffect } from 'react';
import { useLang } from '@/i18n';

const STORAGE_KEY = 'aluf_cookies_accepted';
const PRIVACY_URL = '/pages/54957-תקנון-פרטיות';

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
    try { localStorage.setItem(STORAGE_KEY, 'all'); } catch {}
    setVisible(false);
  }

  function necessaryOnly() {
    try { localStorage.setItem(STORAGE_KEY, 'necessary'); } catch {}
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label={t('cookie.banner')}
      className="fixed bottom-0 inset-x-0 z-[200] bg-[#0a0a1a]/97 backdrop-blur-md border-t border-white/10 shadow-2xl"
    >
      <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">

        {/* Icon — SVG, no emoji */}
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 shrink-0 text-primary hidden sm:block" aria-hidden="true">
          <path d="M21.96 12.48A10 10 0 1 1 11.52 2.04c.16-.01.32-.04.48-.04a2 2 0 0 1 2 2 2 2 0 0 0 2 2 2 2 0 0 1 2 2 2 2 0 0 0 2 2c.55 0 1.05.22 1.41.59.36.36.59.86.55 1.89zM8.5 16a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm2-5a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm5 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-7-3a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
        </svg>

        {/* Text */}
        <p className="flex-1 text-sm text-white/80 leading-relaxed">
          {t('cookie.text')}{' '}
          <a href={PRIVACY_URL} className="text-primary underline font-semibold hover:opacity-80 transition-opacity">
            {t('cookie.policyLink')}
          </a>
        </p>

        {/* Actions — all three required by law */}
        <div className="flex flex-wrap gap-2 shrink-0 w-full sm:w-auto">
          <button
            onClick={accept}
            className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors whitespace-nowrap"
          >
            {t('cookie.accept')}
          </button>
          <button
            onClick={necessaryOnly}
            className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl border border-white/20 text-white/70 text-sm font-semibold hover:border-white/50 hover:text-white transition-colors whitespace-nowrap"
          >
            {t('cookie.necessary')}
          </button>
          <a
            href={PRIVACY_URL}
            className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl border border-white/10 text-white/50 text-xs font-medium hover:text-white/80 transition-colors text-center whitespace-nowrap"
          >
            {t('cookie.learnMore')}
          </a>
        </div>
      </div>
    </div>
  );
}
