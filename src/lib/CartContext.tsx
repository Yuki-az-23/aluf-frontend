import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { getCartCount as readCartCookie, addToCart as konimboAddToCart, type CartProductInfo } from './konimbo';

interface CartContextValue {
  cartCount: number;
  addToCart: (itemId: string, qty?: number, info?: CartProductInfo) => Promise<boolean>;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartCount, setCartCount] = useState(readCartCookie);

  const addToCart = useCallback(async (itemId: string, qty = 1, info: CartProductInfo = {}) => {
    setCartCount(c => c + qty);
    const result = await konimboAddToCart(itemId, qty, info);
    setCartCount(result.cartCount);
    return result.success;
  }, []);

  return (
    <CartContext.Provider value={{ cartCount, addToCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
