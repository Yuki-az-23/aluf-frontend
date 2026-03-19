import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { KonimboCategory, BannerData, BreadcrumbItem } from './konimbo-scraper';
import type { Product, ItemDetail, BlogPostItem, BlogPostDetail } from '@/data/products';
import { featuredProducts as fallbackProducts } from '@/data/products';

interface StoreData {
  products: Product[];
  categories: KonimboCategory[];
  categoryGroups: { group: string; items: KonimboCategory[] }[];
  banners: BannerData;
  itemDetail: ItemDetail | null;
  breadcrumbs: BreadcrumbItem[];
  pageTitle: string;
  blogPosts: BlogPostItem[];
  blogPostDetail: BlogPostDetail | null;
}

function readScraped(): StoreData {
  const scraped = (window as any).__ALUF_SCRAPED__ as StoreData | undefined;
  return {
    products: scraped?.products?.length ? scraped.products : fallbackProducts,
    categories: scraped?.categories || [],
    categoryGroups: scraped?.categoryGroups || [],
    banners: scraped?.banners || { desktop: [], mobile: [] },
    itemDetail: scraped?.itemDetail || null,
    breadcrumbs: scraped?.breadcrumbs || [],
    pageTitle: scraped?.pageTitle || '',
    blogPosts: scraped?.blogPosts || [],
    blogPostDetail: scraped?.blogPostDetail || null,
  };
}

const StoreDataContext = createContext<StoreData>({
  products: [],
  categories: [],
  categoryGroups: [],
  banners: { desktop: [], mobile: [] },
  itemDetail: null,
  breadcrumbs: [],
  pageTitle: '',
  blogPosts: [],
  blogPostDetail: null,
});

export function StoreDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<StoreData>(readScraped);

  useEffect(() => {
    // Listen for the MutationObserver in main.tsx to signal that late-loaded data is ready
    function onDataReady() {
      setData(readScraped());
    }
    window.addEventListener('aluf:products-ready', onDataReady);
    window.addEventListener('aluf:item-ready', onDataReady);
    return () => {
      window.removeEventListener('aluf:products-ready', onDataReady);
      window.removeEventListener('aluf:item-ready', onDataReady);
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
