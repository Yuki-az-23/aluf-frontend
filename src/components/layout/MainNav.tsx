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
        <div key={item.labelKey} className="relative group">
          <a
            href={item.href}
            className="px-4 py-3 hover:text-white hover:bg-white/5 rounded-md transition-colors flex items-center gap-2 cursor-pointer text-sm font-medium"
          >
            <Icon name={item.icon} className="text-gray-400 group-hover:text-primary text-lg transition-colors" />
            <span>{t(item.labelKey)}</span>
            {item.subItems?.length ? (
              <Icon name="expand_more" className="text-gray-500 text-base transition-transform group-hover:rotate-180" />
            ) : null}
          </a>
          {item.subItems?.length ? (
            <div className="absolute top-full right-0 mt-1 w-52 bg-header-bg border border-gray-700 rounded-xl shadow-xl z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 translate-y-1 group-hover:translate-y-0">
              {item.subItems.map(sub => (
                <a
                  key={sub.href}
                  href={sub.href}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 first:rounded-t-xl last:rounded-b-xl transition-colors"
                >
                  <span className="w-1 h-1 rounded-full bg-primary flex-shrink-0" />
                  {sub.label}
                </a>
              ))}
            </div>
          ) : null}
        </div>
      ))}
      <div className="border-r border-gray-700 h-6 mx-2" />
      <a className="px-4 py-3 text-primary hover:text-white transition-colors flex items-center gap-2 cursor-pointer text-sm font-bold" href="https://alufshop.konimbo.co.il">
        <Icon name="local_offer" className="text-lg" />
        {t('nav.deals')}
      </a>
    </nav>
  );
}
