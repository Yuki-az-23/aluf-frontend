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
    try { localStorage.setItem(STORAGE_KEY, '1'); } catch {}
    setVisible(false);
  }

  if (!visible) return null;
  /// by law i t most have a only nccsry we cant not give no option for user 
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
            className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl border border-white/20 text-white/70 text-sm font-semibold hover:border-white/50 hover:text-white transition-colors text-center"
          >
            {t('cookie.learnMore')}
          </a>
        </div>
      </div>
    </div>
  );
}
