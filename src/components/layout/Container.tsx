import { cn } from '@/lib/cn';
import type { ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

export function Container({ children, className }: ContainerProps) {
  return (
    <div className={cn('max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8', className)}>
      {children}
    </div>
  );
}
