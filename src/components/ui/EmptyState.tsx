import { Icon } from './Icon';
import { cn } from '@/lib/cn';

interface EmptyStateProps {
  icon: string;
  title: string;
  description?: string;
  className?: string;
}

export function EmptyState({ icon, title, description, className }: EmptyStateProps) {
  return (
    <div className={cn('text-center py-16', className)}>
      <Icon name={icon} className="text-5xl text-text-muted mb-4" />
      <h3 className="font-bold text-lg text-text-main mb-2">{title}</h3>
      {description && <p className="text-text-muted text-sm">{description}</p>}
    </div>
  );
}
