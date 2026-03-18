import { Icon } from '@/components/ui/Icon';

interface TrustBadgeProps {
  icon: string;
  text: string;
}

export function TrustBadge({ icon, text }: TrustBadgeProps) {
  return (
    <div className="flex items-center gap-2 text-sm text-text-muted">
      <Icon name={icon} className="text-primary" />
      <span>{text}</span>
    </div>
  );
}
