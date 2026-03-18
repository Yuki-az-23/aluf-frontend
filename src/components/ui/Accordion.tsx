import { cn } from '@/lib/cn';
import type { ReactNode } from 'react';

interface AccordionProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function Accordion({ title, children, className }: AccordionProps) {
  return (
    <details className={cn('group bg-card-bg rounded-xl border border-border-light open:ring-1 open:ring-primary transition-all shadow-sm', className)}>
      <summary className="flex items-center justify-between p-4 cursor-pointer list-none text-sm font-bold">
        <span>{title}</span>
        <span className="material-symbols-outlined group-open:rotate-180 transition-transform">expand_more</span>
      </summary>
      <div className="px-4 pb-4 text-text-muted text-xs leading-relaxed border-t border-border-light pt-3">
        {children}
      </div>
    </details>
  );
}
