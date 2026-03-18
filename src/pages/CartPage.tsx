import { useEffect } from 'react';
import { Container } from '@/components/layout/Container';
import { Spinner } from '@/components/ui/Spinner';

const CHECKOUT_URL = '/orders/alufshop/new#secureHook';

export function CartPage() {
  useEffect(() => {
    window.location.href = CHECKOUT_URL;
  }, []);

  return (
    <Container className="py-16">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="lg" />
        <p className="text-text-muted">מעבר לדף התשלום...</p>
      </div>
    </Container>
  );
}
