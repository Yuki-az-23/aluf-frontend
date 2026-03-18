import { cn } from '@/lib/cn';
import type { ReactNode } from 'react';

interface BadgeProps {
  variant?: 'primary' | 'secondary' | 'success' | 'sale';
  children: ReactNode;
  className?: string;
}

const variants = {
  primary: 'bg-primary text-white',
  secondary: 'bg-secondary text-white',
  success: 'bg-green-600 text-white',
  sale: 'bg-red-500 text-white',
};

export function Badge({ variant = 'primary', children, className }: BadgeProps) {
  return (
    <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded uppercase', variants[variant], className)}>
      {children}
    </span>
  );
}
