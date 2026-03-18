import { useState, useEffect, useCallback } from 'react';
import { Carousel } from '@/components/ui/Carousel';
import { ProductCard } from './ProductCard';
import { Spinner } from '@/components/ui/Spinner';
import { fetchTagProducts } from '@/lib/fetch-tag-products';
import { useLang } from '@/i18n';
import { cn } from '@/lib/cn';
import type { Product } from '@/data/products';

const TABS = [
  { labelKey: 'products.tabs.new', path: '/tags/211647-tag2' },
  { labelKey: 'products.tabs.builds', path: '/tags/211649-tag4' },
  { labelKey: 'products.tabs.bestSellers', path: '/tags/211648-tag3' },
  { labelKey: 'products.tabs.custom', path: '/tags/246669-tag5' },
];

export function TabbedProducts() {
  const { t } = useLang();
  const [activeTab, setActiveTab] = useState(0);
  const [cache, setCache] = useState<Record<number, Product[]>>({});
  const [loading, setLoading] = useState(false);

  const loadTab = useCallback(async (index: number) => {
    if (cache[index]) return; // already cached
    setLoading(true);
    const products = await fetchTagProducts(TABS[index].path);
    setCache(prev => ({ ...prev, [index]: products }));
    setLoading(false);
  }, [cache]);

  useEffect(() => {
    loadTab(0);
  }, []);  // load first tab on mount

  const handleTabClick = (index: number) => {
    setActiveTab(index);
    loadTab(index);
  };

  const products = cache[activeTab] || [];

  return (
    <div>
      {/* Tab bar */}
      <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar pb-1">
        {TABS.map((tab, i) => (
          <button
            key={tab.path}
            onClick={() => handleTabClick(i)}
            className={cn(
              'px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-colors',
              i === activeTab
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-text-main hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700',
            )}
          >
            {t(tab.labelKey)}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading && !products.length ? (
        <div className="flex justify-center py-16">
          <Spinner size="md" />
        </div>
      ) : products.length > 0 ? (
        <Carousel slidesPerView={{ mobile: 2, desktop: 4 }} gap={24} showArrows>
          {products.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </Carousel>
      ) : (
        <p className="text-center text-text-muted py-16">{t('products.empty')}</p>
      )}
    </div>
  );
}
