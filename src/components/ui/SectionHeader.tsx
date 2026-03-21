import { cn } from '@/lib/cn';
import { Icon } from './Icon';

interface SectionHeaderProps {
  title: string;
  linkText?: string;
  linkHref?: string;
  className?: string;
}

export function SectionHeader({ title, linkText, linkHref = '#', className }: SectionHeaderProps) {
  return (
    <div className={cn('flex items-center justify-between mb-8', className)}>
      <div className="border-s-4 border-primary ps-4">
        <h2 className="text-2xl font-black text-text-main font-display">{title}</h2>
      </div>
      {linkText && (
        <a
          href={linkHref}
          className="text-primary hover:text-primary/80 font-bold text-sm flex items-center gap-1 transition-colors"
        >
          {linkText}
          <Icon name="arrow_forward" className="text-sm rtl:rotate-180" />
        </a>
      )}
    </div>
  );
}
