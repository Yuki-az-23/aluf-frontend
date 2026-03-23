import { cn } from '@/lib/cn';
import { Icon } from '@/components/ui/Icon';
import { useLang } from '@/i18n';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  const { dir } = useLang();
  const last = items.length - 1;
  // On mobile show only the parent crumb (second-to-last) as a back link
  const parentItem = items.length >= 2 ? items[last - 1] : null;

  return (
    <nav aria-label="Breadcrumb" className={cn('text-sm text-text-muted', className)}>

      {/* Mobile: "← Parent" only */}
      <div className="flex sm:hidden items-center gap-1">
        {parentItem ? (
          <a
            href={parentItem.href || '/'}
            className="flex items-center gap-1 hover:text-primary transition-colors"
          >
            <Icon name={dir === 'rtl' ? 'chevron_right' : 'chevron_left'} className="text-xs" />
            <span className="truncate max-w-[70vw]">{parentItem.label}</span>
          </a>
        ) : (
          items[0]?.href && (
            <a href={items[0].href} className="flex items-center gap-1 hover:text-primary transition-colors">
              <Icon name={dir === 'rtl' ? 'chevron_right' : 'chevron_left'} className="text-xs" />
              <span>{items[0].label}</span>
            </a>
          )
        )}
      </div>

      {/* Desktop: full breadcrumb trail */}
      <ol className="hidden sm:flex items-center gap-1.5 whitespace-nowrap overflow-x-auto no-scrollbar">
        {items.map((item, i) => (
          <li key={i} className={cn('flex items-center gap-1.5 min-w-0', i === last && 'overflow-hidden')}>
            {i > 0 && <Icon name={dir === 'rtl' ? 'chevron_left' : 'chevron_right'} className="text-xs flex-shrink-0" />}
            {item.href ? (
              <a href={item.href} className="hover:text-primary transition-colors flex-shrink-0">{item.label}</a>
            ) : (
              <span className="text-text-main font-medium truncate">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
