import { ThemeProvider } from '@/theme/ThemeProvider';
import { LangProvider } from '@/i18n';
import { CartProvider } from '@/lib/CartContext';
import { StoreDataProvider } from '@/lib/StoreDataContext';
import { PCBuilderProvider, usePCBuilder } from '@/lib/PCBuilderContext';
import { PCBuilderModal } from '@/components/commerce/PCBuilderModal';
import { AppShell } from '@/components/layout/AppShell';
import { HomePage } from '@/pages/HomePage';
import { CategoryPage } from '@/pages/CategoryPage';
import { ItemsGridPage } from '@/pages/ItemsGridPage';
import { ItemPage } from '@/pages/ItemPage';
import { CartPage } from '@/pages/CartPage';
import { WorkshopPage } from '@/pages/WorkshopPage';
import { BlogListPage } from '@/pages/BlogListPage';
import { BlogPostPage } from '@/pages/BlogPostPage';
import { TermsPage } from '@/pages/TermsPage';
import { PrivacyPage } from '@/pages/PrivacyPage';
import { ContactPage } from '@/pages/ContactPage';
import { AboutPage } from '@/pages/AboutPage';
import { getPageType } from '@/lib/konimbo';

function PageRouter() {
  const page = getPageType();
  switch (page) {
    case 'category': return <CategoryPage />;
    case 'items': return <ItemsGridPage />;
    case 'item': return <ItemPage />;
    case 'cart': return <CartPage />;
    case 'workshop': return <WorkshopPage />;
    case 'blog': return <BlogListPage />;
    case 'blogpost': return <BlogPostPage />;
    case 'terms': return <TermsPage />;
    case 'privacy': return <PrivacyPage />;
    case 'contact': return <ContactPage />;
    case 'about': return <AboutPage />;
    case 'login':
    case 'account':
      return null; // let Konimbo's native login/profile UI show through
    case 'home':
    default:
      return <HomePage />;
  }
}
function AppInner() {
  const { isOpen, close } = usePCBuilder();
  return (
    <>
      <AppShell>
        <PageRouter />
      </AppShell>
      <PCBuilderModal isOpen={isOpen} onClose={close} />
    </>
  );
}

export function App() {
  return (
    <div data-aluf-app>
      <ThemeProvider>
        <LangProvider>
          <StoreDataProvider>
            <CartProvider>
              <PCBuilderProvider>
                <AppInner />
              </PCBuilderProvider>
            </CartProvider>
          </StoreDataProvider>
        </LangProvider>
      </ThemeProvider>
    </div>
  );
}
