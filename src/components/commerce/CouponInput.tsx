import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { useLang } from '@/i18n';

interface CouponInputProps {
  onApply: (code: string) => void;
}

export function CouponInput({ onApply }: CouponInputProps) {
  const [code, setCode] = useState('');
  const { t } = useLang();
  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={code}
        onChange={e => setCode(e.target.value)}
        placeholder={t('cart.couponPlaceholder')}
        className="flex-1 bg-card-bg border border-border-light rounded-lg px-3 py-2 text-sm"
      />
      <Button variant="outline" size="sm" onClick={() => onApply(code)}>
        {t('cart.applyCoupon')}
      </Button>
    </div>
  );
}
