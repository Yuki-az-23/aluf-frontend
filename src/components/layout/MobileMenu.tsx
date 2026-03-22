import { Icon } from '@/components/ui/Icon';
import { LangSwitcher } from '@/components/ui/LangSwitcher';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useLang } from '@/i18n';
import { useCart } from '@/lib/CartContext';
import { useAuth } from '@/lib/AuthContext';
import { mainNavItems } from '@/data/nav';

const logoSrc = 'https://cdn.jsdelivr.net/gh/Yuki-az-23/aluf-frontend@master/src/assets/logo.png';

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const { t, dir } = useLang();
  const { cartCount } = useCart();
  const { loggedIn } = useAuth();

  if (!open) return null;

  return (
    <div dir={dir} className="fixed inset-0 z-[60] bg-header-bg text-header-text flex flex-col">
      <div className="flex items-center justify-between px-4 h-20 border-b border-header-border">
        <button onClick={onClose} aria-label={t('a11y.closeMenu')}>
          <Icon name="close" className="text-2xl" />
        </button>
        <a href="/" className="flex items-center gap-3">
          <img src={logoSrc} alt={t('site.name')} className="h-10 w-auto" />
          <span className="font-display font-bold text-xl">
            {t('site.name.prefix')} <span className="text-primary">{t('site.name.suffix')}</span>
          </span>
        </a>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {mainNavItems.map(item => (
          <a
            key={item.labelKey}
            href={item.href}
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-border-light transition-colors text-lg"
          >
            <Icon name={item.icon} className="text-primary" />
            <span>{t(item.labelKey)}</span>
          </a>
        ))}
        <a href="/pages/52435-%D7%9E%D7%A2%D7%91%D7%93%D7%94-%D7%9C%D7%9E%D7%97%D7%A9%D7%91%D7%99%D7%9D" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-border-light transition-colors text-lg">
          <Icon name="handyman" className="text-primary" />
          <span>{t('nav.lab')}</span>
        </a>
      </nav>

      <div className="p-4 border-t border-header-border space-y-4">
        <div className="flex items-center justify-between">
          <LangSwitcher />
          <ThemeToggle />
        </div>
        <div className="flex gap-4">
          <a
            href={loggedIn ? '/current_customer/orders' : '/customer_login'}
            className="flex-1 flex items-center justify-center gap-2 bg-card-bg border border-border-light py-3 rounded-xl"
          >
            <Icon name="person" /> {loggedIn ? t('header.myAccount') : t('header.login')}
          </a>
          <a href="https://alufshop.konimbo.co.il/cart" className="flex-1 flex items-center justify-center gap-2 bg-card-bg border border-border-light py-3 rounded-xl relative">
            <Icon name="shopping_cart" /> {t('header.cart')}
            {cartCount > 0 && (
              <span className="bg-primary text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">{cartCount}</span>
            )}
          </a>
        </div>
      </div>
    </div>
  );
}
