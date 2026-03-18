import { cn } from '@/lib/cn';
import { Icon } from '@/components/ui/Icon';
import { useLang } from '@/i18n';
import { mainNavItems } from '@/data/nav';

interface MainNavProps {
  className?: string;
}

export function MainNav({ className }: MainNavProps) {
  const { t } = useLang();
  return (
    <nav className={cn('items-center gap-1 border-t border-gray-700/50 py-1 overflow-x-auto no-scrollbar justify-center text-gray-200', className)}>
      {mainNavItems.map(item => (
        <a
          key={item.labelKey}
          href={item.href}
          className="px-4 py-3 hover:text-white hover:bg-white/5 rounded-md transition-colors flex items-center gap-2 cursor-pointer text-sm font-medium"
        >
          <Icon name={item.icon} className="text-gray-400 text-lg" />
          <span>{t(item.labelKey)}</span>
        </a>
      ))}
      <div className="border-r border-gray-700 h-6 mx-2" />
      <a className="px-4 py-3 text-primary hover:text-white transition-colors flex items-center gap-2 cursor-pointer text-sm font-bold" href="https://alufshop.konimbo.co.il">
        <Icon name="local_offer" className="text-lg" />
        {t('nav.deals')}
      </a>
    </nav>
  );
}
