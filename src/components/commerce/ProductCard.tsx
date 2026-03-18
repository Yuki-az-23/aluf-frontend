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
      <div className="relative">
        {product.originalPrice && <Badge variant="sale" className="absolute top-2 right-2 z-10">SALE</Badge>}
        <div className="aspect-square bg-gray-50 rounded-lg p-4 mb-4 overflow-hidden">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>
      </div>
      <span className="text-xs text-primary font-bold mb-1">{product.category}</span>
      <h3 className="font-bold text-sm mb-2 line-clamp-2 text-text-main">{product.title}</h3>
      <ul className="text-xs text-text-muted space-y-1 mb-4">
        {product.specs.map((spec, i) => (
          <li key={i} className="flex items-center gap-1">
            <Icon name="check" className="text-primary text-xs" />
            {spec}
          </li>
        ))}
      </ul>
      <div className="mt-auto flex items-center justify-between pt-3 border-t border-border-light">
        <div>
          {product.originalPrice && (
            <span className="text-xs text-text-muted line-through block">{t('price.currency')}{product.originalPrice.toLocaleString()}</span>
          )}
          <span className="text-lg font-black text-brand-purple">{t('price.currency')}{product.price.toLocaleString()}</span>
        </div>
        <button
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
