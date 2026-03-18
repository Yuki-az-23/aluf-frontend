import { cn } from '@/lib/cn';

interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
}

export function QuantityStepper({ value, onChange, min = 1, max = 99, className }: QuantityStepperProps) {
  return (
    <div className={cn('flex items-center border border-border-light rounded-lg', className)}>
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        className="px-3 py-1.5 text-text-muted hover:text-text-main transition-colors"
        disabled={value <= min}
      >
        −
      </button>
      <span className="px-3 py-1.5 text-sm font-bold min-w-[2rem] text-center">{value}</span>
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        className="px-3 py-1.5 text-text-muted hover:text-text-main transition-colors"
        disabled={value >= max}
      >
        +
      </button>
    </div>
  );
}
