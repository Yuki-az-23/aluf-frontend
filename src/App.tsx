import { ThemeProvider } from '@/theme/ThemeProvider';
import { LangProvider } from '@/i18n';
import { CartProvider } from '@/lib/CartContext';
import { AppShell } from '@/components/layout/AppShell';
import { HomePage } from '@/pages/HomePage';
import { CategoryPage } from '@/pages/CategoryPage';
import { ItemsGridPage } from '@/pages/ItemsGridPage';
import { ItemPage } from '@/pages/ItemPage';
import { CartPage } from '@/pages/CartPage';
import { getPageType } from '@/lib/konimbo';

function PageRouter() {
  const page = getPageType();
  switch (page) {
    case 'category': return <CategoryPage />;
    case 'items': return <ItemsGridPage />;
    case 'item': return <ItemPage />;
    case 'cart': return <CartPage />;
    case 'home':
    default:
      return <HomePage />;
  }
}

export function App() {
  return (
    <div data-aluf-app>
      <ThemeProvider>
        <LangProvider>
          <CartProvider>
            <AppShell>
              <PageRouter />
            </AppShell>
          </CartProvider>
        </LangProvider>
      </ThemeProvider>
    </div>
  );
}
