import { useState } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { FloatingContact } from '@/components/ui/FloatingContact';
import { CookieConsent } from '@/components/ui/CookieConsent';
import { useLang } from '@/i18n';
import type { ReactNode } from 'react';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { t, dir } = useLang();
  const [cookieVisible, setCookieVisible] = useState(false);

  return (
    <div dir={dir} className="min-h-screen flex flex-col">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:bg-primary focus:text-white focus:p-2">
        {t('a11y.skipToContent')}
      </a>
      <Header />
      {/* pb-16 on mobile keeps footer above the floating contact bar */}
      <main id="main-content" className="flex-1 pb-16 md:pb-0">
        {children}
      </main>
      <Footer />
      <FloatingContact aboveCookie={cookieVisible} />
      <CookieConsent onVisibilityChange={setCookieVisible} />
    </div>
  );
}
