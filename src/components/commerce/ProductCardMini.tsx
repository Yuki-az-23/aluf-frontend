import { cn } from '@/lib/cn';
import type { Product } from '@/data/products';

interface ProductCardMiniProps {
  product: Product;
  className?: string;
}

export function ProductCardMini({ product, className }: ProductCardMiniProps) {
  return (
    <div className={cn('flex gap-3 bg-card-bg rounded-lg border border-border-light p-3', className)}>
      <img
        src={product.image}
        alt={product.title}
        width={64}
        height={64}
        className="w-16 h-16 object-contain rounded"
        loading="lazy"
        decoding="async"
      />
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-bold text-text-main truncate">{product.title}</h4>
        <p className="text-xs text-text-muted">{product.category}</p>
        <span className="text-sm font-black text-primary">₪{product.price.toLocaleString()}</span>
      </div>
    </div>
  );
}
