import { Icon } from '@/components/ui/Icon';
import { LangSwitcher } from '@/components/ui/LangSwitcher';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useLang } from '@/i18n';
import { useCart } from '@/lib/CartContext';
import { mainNavItems } from '@/data/nav';

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const { t } = useLang();
  const { cartCount } = useCart();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-gray-900 text-white flex flex-col">
      <div className="flex items-center justify-between px-4 h-20 border-b border-header-border">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-primary rounded-lg flex items-center justify-center">
            <Icon name="deployed_code" className="text-white text-2xl" />
          </div>
          <span className="font-display font-bold text-xl">{t('site.name')}</span>
        </div>
        <button onClick={onClose} aria-label={t('a11y.closeMenu')}>
          <Icon name="close" className="text-2xl" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {mainNavItems.map(item => (
          <a
            key={item.labelKey}
            href={item.href}
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-lg"
          >
            <Icon name={item.icon} className="text-primary" />
            <span>{t(item.labelKey)}</span>
          </a>
        ))}
        <a href="https://alufshop.konimbo.co.il" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/10 text-primary font-bold text-lg">
          <Icon name="local_offer" />
          <span>{t('nav.deals')}</span>
        </a>
      </nav>

      <div className="p-4 border-t border-header-border space-y-4">
        <div className="flex items-center justify-between">
          <LangSwitcher />
          <ThemeToggle />
        </div>
        <div className="flex gap-4">
          <a href="https://alufshop.konimbo.co.il/login" className="flex-1 flex items-center justify-center gap-2 bg-white/5 py-3 rounded-xl">
            <Icon name="person" /> {t('header.login')}
          </a>
          <a href="https://alufshop.konimbo.co.il/cart" className="flex-1 flex items-center justify-center gap-2 bg-white/5 py-3 rounded-xl relative">
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
