import { createContext, useContext, useState } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState({ items: [] });

  const addItem = (product) => {
    setCart(prev => {
      const existing = prev.items.find(
        i => i._id === product._id && i.variant === product.variant
      );

      // Show min order info on first add
      if (!existing) {
        if (product.category === 'Polaroids') {
          toast('📸 Min order for Polaroids is 10 pieces — keep adding!', {
            icon: 'ℹ️', duration: 3000,
          });
        }
        if (product.category === 'Posters') {
          toast('🎨 Min order for Posters is 5 pieces — keep adding!', {
            icon: 'ℹ️', duration: 3000,
          });
        }
      }

      if (existing) {
        return {
          ...prev,
          items: prev.items.map(i =>
            i._id === product._id && i.variant === product.variant
              ? { ...i, qty: i.qty + 1 }
              : i
          ),
        };
      }
      return { ...prev, items: [...prev.items, { ...product, qty: 1 }] };
    });
  };

  const removeItem = (id, variant) => {
    setCart(prev => ({
      ...prev,
      items: prev.items.filter(i => !(i._id === id && i.variant === variant)),
    }));
  };

  const updateQty = (id, variant, qty) => {
    if (qty < 1) {
      removeItem(id, variant);
      return;
    }
    setCart(prev => ({
      ...prev,
      items: prev.items.map(i =>
        i._id === id && i.variant === variant ? { ...i, qty } : i
      ),
    }));
  };

  const clearCart = () => setCart({ items: [] });

  const total = cart.items.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <CartContext.Provider value={{ cart, addItem, removeItem, updateQty, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);