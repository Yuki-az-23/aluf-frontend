import { cn } from '@/lib/cn';
import { Icon } from './Icon';
import { useLang } from '@/i18n';

interface SearchInputProps {
  className?: string;
}

export function SearchInput({ className }: SearchInputProps) {
  const { t } = useLang();
  return (
    <div className={cn('relative group', className)}>
      <input
        type="text"
        placeholder={t('header.search')}
        className="w-full bg-slate-800 border border-gray-600 rounded-md py-2.5 pr-4 pl-12 text-white placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary transition-all shadow-inner text-sm text-right"
      />
      <Icon
        name="search"
        className="absolute left-3 top-2.5 text-gray-400 group-focus-within:text-primary pointer-events-none"
      />
    </div>
  );
}
