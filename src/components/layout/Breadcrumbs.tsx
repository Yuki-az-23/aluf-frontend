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
  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center gap-2 text-sm text-text-muted', className)}>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-2">
          {i > 0 && <Icon name="chevron_left" className="text-xs" />}
          {item.href ? (
            <a href={item.href} className="hover:text-primary transition-colors">{item.label}</a>
          ) : (
            <span className="text-text-main font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
