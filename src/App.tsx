import { ThemeProvider } from '@/theme/ThemeProvider';
import { LangProvider } from '@/i18n';
import { CartProvider } from '@/lib/CartContext';
import { AppShell } from '@/components/layout/AppShell';
import { HomePage } from '@/pages/HomePage';
import { getPageType } from '@/lib/konimbo';

function PageRouter() {
  const page = getPageType();
  switch (page) {
    case 'home':
    default:
      return <HomePage />;
    // Future pages:
    // case 'category': return <CategoryPage />;
    // case 'items': return <ItemsGridPage />;
    // case 'item': return <ItemPage />;
    // case 'cart': return <CartPage />;
  }
}

export function App() {
  return (
    <ThemeProvider>
      <LangProvider>
        <CartProvider>
          <AppShell>
            <PageRouter />
          </AppShell>
        </CartProvider>
      </LangProvider>
    </ThemeProvider>
  );
}
