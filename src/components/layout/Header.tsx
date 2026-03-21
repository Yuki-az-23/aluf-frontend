import { useState } from 'react';
import { Container } from './Container';
import { MainNav } from './MainNav';
import { MobileMenu } from './MobileMenu';
import { SearchInput } from '@/components/ui/SearchInput';
import { LangSwitcher } from '@/components/ui/LangSwitcher';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Icon } from '@/components/ui/Icon';
import { useLang } from '@/i18n';
import { useCart } from '@/lib/CartContext';
const logoSrc = 'https://cdn.jsdelivr.net/gh/Yuki-az-23/aluf-frontend@master/src/assets/logo.png';

export function Header() {
  const { t } = useLang();
  const { cartCount } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 bg-header-bg/95 backdrop-blur-md border-b border-header-border shadow-md text-header-text">
        <Container>
          <div className="flex justify-between items-center h-20 gap-8">
            {/* Logo */}
            <a href="/" className="flex-shrink-0 flex items-center gap-3">
              <img src={logoSrc} alt={t('site.name')} className="h-10 w-auto" />
              <span className="font-display font-bold text-sm sm:text-2xl text-header-text block">
                {t('site.name.prefix')} <span className="text-primary">{t('site.name.suffix')}</span>
              </span>
            </a>

            {/* Search */}
            <div className="flex-grow max-w-3xl hidden md:block">
              <SearchInput />
            </div>

            {/* Right side */}
            <div className="flex items-center gap-6">
              <a className="hidden lg:flex text-header-text-muted hover:text-primary hover:bg-black/5 dark:hover:bg-white/5 px-3 py-2 rounded-md transition font-medium text-sm items-center gap-2" href="/pages/52435-%D7%9E%D7%A2%D7%91%D7%93%D7%94-%D7%9C%D7%9E%D7%97%D7%A9%D7%91%D7%99%D7%9D">
                <Icon name="handyman" className="text-primary" />
                {t('nav.lab')}
              </a>

              <div className="border-s border-header-border ps-4 ms-2 hidden sm:block">
                <LangSwitcher />
              </div>

              <span className="hidden md:inline-flex"><ThemeToggle /></span>

              <div className="flex items-center gap-4 ps-2 border-s border-header-border pe-4">
                <a href="/customer_login" className="text-header-text-muted hover:text-header-text transition flex flex-col items-center gap-0.5 group">
                  <Icon name="person" className="transition-colors" />
                  <span className="text-[10px] hidden sm:block font-medium">{t('header.login')}</span>
                </a>
                <a href="/cart" className="text-header-text-muted hover:text-header-text transition relative flex flex-col items-center gap-0.5 group">
                  <div className="relative">
                    <Icon name="shopping_cart" className="group-hover:text-primary transition-colors" />
                    {cartCount > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 bg-primary text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] hidden sm:block font-medium">{t('header.cart')}</span>
                </a>
              </div>

              <button
                className="md:hidden text-header-text-muted"
                onClick={() => setMobileOpen(true)}
                aria-label={t('a11y.openMenu')}
              >
                <Icon name="menu" />
              </button>
            </div>
          </div>

          {/* Mobile search row */}
          <div className="md:hidden pb-3">
            <SearchInput />
          </div>

          <MainNav className="hidden md:flex" />
        </Container>
      </header>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
