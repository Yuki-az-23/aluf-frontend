import { createContext, useContext, useMemo, type ReactNode } from 'react';
import type { KonimboCategory } from './konimbo-scraper';
import type { Product } from '@/data/products';
import { featuredProducts as fallbackProducts } from '@/data/products';

interface StoreData {
  products: Product[];
  categories: KonimboCategory[];
  categoryGroups: { group: string; items: KonimboCategory[] }[];
}

const StoreDataContext = createContext<StoreData>({
  products: [],
  categories: [],
  categoryGroups: [],
});

export function StoreDataProvider({ children }: { children: ReactNode }) {
  const data = useMemo<StoreData>(() => {
    // Read pre-scraped data from window (set by main.tsx before DOM was hidden)
    const scraped = (window as any).__ALUF_SCRAPED__ as StoreData | undefined;

    return {
      products: scraped?.products?.length ? scraped.products : fallbackProducts,
      categories: scraped?.categories || [],
      categoryGroups: scraped?.categoryGroups || [],
    };
  }, []);

  return (
    <StoreDataContext.Provider value={data}>
      {children}
    </StoreDataContext.Provider>
  );
}

export function useStoreData() {
  return useContext(StoreDataContext);
}
