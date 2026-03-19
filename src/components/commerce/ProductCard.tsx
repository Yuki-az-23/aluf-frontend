import { cn } from '@/lib/cn';
import { Icon } from '@/components/ui/Icon';
import { Badge } from '@/components/ui/Badge';
import { useLang } from '@/i18n';
import { useCart } from '@/lib/CartContext';
import type { Product } from '@/data/products';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const { t } = useLang();
  const { addToCart } = useCart();

  return (
    <div className={cn(
      'bg-card-bg rounded-xl border border-border-light p-4 hover:shadow-tech-hover hover:border-primary transition-all group flex flex-col',
      className,
    )}>
      <div className="block relative mb-4">
        {/* Badge: top-left in visual space (left-3 = visually right side in RTL) */}
        {product.originalPrice && (
          <Badge variant="sale" className="absolute top-2 left-3 z-10">מבצע!</Badge>
        )}
        <div className="aspect-square bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden relative">
          <a href={product.href || '#'} className="block w-full h-full">
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 p-4"
              loading="lazy"
            />
          </a>
          {/* Add-to-cart overlay on image hover */}
          <button
            type="button"
            onClick={() => addToCart(product.id)}
            className="absolute top-2 right-2 bg-primary text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-white transition-opacity shadow-lg z-10"
            aria-label={t('products.addToCart')}
          >
            <Icon name="add_shopping_cart" className="text-lg" />
          </button>
        </div>
      </div>
      <span className="text-xs text-primary font-bold mb-1">{product.category}</span>
      <a href={product.href || '#'} className="block">
        <h3 className="font-bold text-sm mb-2 line-clamp-2 text-text-main">{product.title}</h3>
      </a>
      <ul className="text-xs text-text-muted space-y-1 mb-4">
        {product.specs.map((spec, i) => (
          <li key={i} className="flex items-center gap-1">
            <Icon name="check" className="text-primary text-xs flex-shrink-0" />
            {spec}
          </li>
        ))}
      </ul>
      <div className="mt-auto flex items-center justify-between pt-3 border-t border-border-light">
        <div>
          {product.originalPrice && (
            <span className="text-xs text-text-muted line-through block">
              {t('price.currency')}{product.originalPrice.toLocaleString()}
            </span>
          )}
          <span className="text-lg font-black text-brand-purple">
            {t('price.currency')}{product.price.toLocaleString()}
          </span>
        </div>
        <button
          type="button"
          onClick={() => addToCart(product.id)}
          className="bg-primary/10 hover:bg-primary text-primary hover:text-white p-2.5 rounded-lg transition-colors"
          aria-label={t('products.addToCart')}
        >
          <Icon name="add_shopping_cart" className="text-xl" />
        </button>
      </div>
    </div>
  );
}
