import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { useLang } from '@/i18n';

interface CouponInputProps {
  onApply: (code: string) => void;
}

/** Strip characters that could cause XSS or injection if the code is passed to DOM/URLs */
function sanitizeCouponCode(raw: string): string {
  return raw
    .replace(/[<>"'`;&\\]/g, '')  // remove injection-risky chars
    .replace(/\s+/g, '')           // no whitespace in coupon codes
    .slice(0, 64);                 // reasonable max length
}

export function CouponInput({ onApply }: CouponInputProps) {
  const [code, setCode] = useState('');
  const { t } = useLang();

  function handleApply() {
    const safe = sanitizeCouponCode(code);
    if (safe) onApply(safe);
  }

  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={code}
        onChange={e => setCode(e.target.value)}
        placeholder={t('cart.couponPlaceholder')}
        className="flex-1 bg-card-bg border border-border-light rounded-lg px-3 py-2 text-sm"
        maxLength={64}
      />
      <Button variant="outline" size="sm" onClick={handleApply}>
        {t('cart.applyCoupon')}
      </Button>
    </div>
  );
}
