import { cn } from '@/lib/cn';
import { Icon } from '@/components/ui/Icon';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  const last = items.length - 1;
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn('overflow-x-auto no-scrollbar', className)}
    >
      <ol className="flex items-center gap-1.5 text-sm text-text-muted whitespace-nowrap min-w-0">
        {items.map((item, i) => (
          <li key={i} className={cn('flex items-center gap-1.5 min-w-0', i === last && 'shrink overflow-hidden')}>
            {i > 0 && <Icon name="chevron_left" className="text-xs flex-shrink-0" />}
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
