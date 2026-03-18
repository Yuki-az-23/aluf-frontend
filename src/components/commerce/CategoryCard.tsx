import { cn } from '@/lib/cn';
import { Icon } from '@/components/ui/Icon';

interface CategoryCardProps {
  title: string;
  icon: string;
  href?: string;
  className?: string;
}

export function CategoryCard({ title, icon, href = '#', className }: CategoryCardProps) {
  return (
    <a href={href} className={cn('bg-card-bg rounded-xl border border-border-light p-6 hover:shadow-tech-hover hover:border-primary transition-all text-center block', className)}>
      <Icon name={icon} className="text-primary text-4xl mb-3" />
      <h3 className="font-bold text-sm text-text-main">{title}</h3>
    </a>
  );
}
