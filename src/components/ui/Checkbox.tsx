import { cn } from '@/lib/cn';

interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}

export function Checkbox({ label, checked, onChange, className }: CheckboxProps) {
  return (
    <label className={cn('flex items-center gap-2 cursor-pointer text-sm', className)}>
      <input
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        className="accent-primary w-4 h-4"
      />
      <span className="text-text-muted">{label}</span>
    </label>
  );
}
