import { cn } from '@/lib/cn';
import { Icon } from './Icon';
import type { ButtonHTMLAttributes } from 'react';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: string;
  label: string;
  filled?: boolean;
}

export function IconButton({ icon, label, filled, className, ...props }: IconButtonProps) {
  return (
    <button
      aria-label={label}
      className={cn(
        'p-2 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-primary',
        className,
      )}
      {...props}
    >
      <Icon name={icon} filled={filled} />
    </button>
  );
}
