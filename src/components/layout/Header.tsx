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
      <header className="sticky top-0 z-50 bg-header-bg/95 backdrop-blur-md border-b border-gray-700 shadow-lg text-white">
        <Container>
          <div className="flex justify-between items-center h-20 gap-8">
            {/* Logo */}
            <a href="/" className="flex-shrink-0 flex items-center gap-3">
              <img src={logoSrc} alt={t('site.name')} className="h-10 w-auto" />
              <span className="font-display font-bold text-2xl text-white hidden sm:block">
                {t('site.name.prefix')} <span className="text-primary">{t('site.name.suffix')}</span>
              </span>
            </a>

            {/* Search */}
            <div className="flex-grow max-w-3xl hidden md:block">
              <SearchInput />
            </div>

            {/* Right side */}
            <div className="flex items-center gap-6">
              <a className="hidden lg:flex text-gray-300 hover:text-primary hover:bg-white/5 px-3 py-2 rounded-md transition font-medium text-sm items-center gap-2" href="https://alufshop.konimbo.co.il">
                <Icon name="handyman" className="text-primary" />
                {t('nav.lab')}
              </a>

              <div className="border-l border-gray-600 pl-4 ml-2 hidden sm:block">
                <LangSwitcher />
              </div>

              <ThemeToggle />

              <div className="flex items-center gap-4 pl-2 border-r border-gray-600 pr-4">
                <button className="text-gray-300 hover:text-white transition flex flex-col items-center gap-0.5 group">
                  <Icon name="person" className="group-hover:text-primary transition-colors" />
                  <span className="text-[10px] hidden sm:block font-medium">{t('header.login')}</span>
                </button>
                <button className="text-gray-300 hover:text-white transition relative flex flex-col items-center gap-0.5 group">
                  <div className="relative">
                    <Icon name="shopping_cart" className="group-hover:text-primary transition-colors" />
                    {cartCount > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 bg-primary text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] hidden sm:block font-medium">{t('header.cart')}</span>
                </button>
              </div>

              <button
                className="md:hidden text-gray-300"
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
