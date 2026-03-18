import { cn } from '@/lib/cn';

interface SelectProps {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function Select({ options, value, onChange, className }: SelectProps) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className={cn('bg-card-bg border border-border-light rounded-lg px-3 py-2 text-sm text-text-main focus:ring-1 focus:ring-primary', className)}
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  );
}
