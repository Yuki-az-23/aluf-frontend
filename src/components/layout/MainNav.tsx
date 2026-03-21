import { cn } from '@/lib/cn';
import { Icon } from '@/components/ui/Icon';
import { useLang } from '@/i18n';
import { mainNavItems } from '@/data/nav';
import { usePCBuilder } from '@/lib/PCBuilderContext';

interface MainNavProps {
  className?: string;
}

export function MainNav({ className }: MainNavProps) {
  const { t } = useLang();
  const { open } = usePCBuilder();
  return (
    <nav className={cn('items-center gap-1 border-t border-header-border py-1 overflow-x-auto no-scrollbar justify-center text-header-text', className)}>
      {mainNavItems.map(item => (
        <a
          key={item.labelKey}
          href={item.href}
          className="px-4 py-3 hover:text-primary hover:bg-black/5 dark:hover:bg-white/5 rounded-md transition-colors flex items-center gap-2 cursor-pointer text-sm font-medium"
        >
          <Icon name={item.icon} className="text-header-text-muted text-lg transition-colors" />
          <span>{t(item.labelKey)}</span>
        </a>
      ))}
      <div className="border-e border-header-border h-6 mx-2" />
      <button
        className="px-4 py-3 text-primary font-bold hover:bg-black/5 dark:hover:bg-white/5 rounded-md transition-colors flex items-center gap-2 text-sm whitespace-nowrap"
        onClick={open}
      >
        <Icon name="build" className="text-lg" />
        {t('nav.buildPc')}
      </button>
    </nav>
  );
}
