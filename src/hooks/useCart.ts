import { useState, useCallback } from 'react';
import type { CartItem, Drink } from '@/types';

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  const add = useCallback((drink: Drink) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.drink.id === drink.id);
      if (existing) {
        return prev.map((i) =>
          i.drink.id === drink.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { drink, quantity: 1 }];
    });
  }, []);

  const remove = useCallback((drinkId: string) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.drink.id === drinkId);
      if (!existing) return prev;
      if (existing.quantity === 1) return prev.filter((i) => i.drink.id !== drinkId);
      return prev.map((i) =>
        i.drink.id === drinkId ? { ...i, quantity: i.quantity - 1 } : i
      );
    });
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const total = items.reduce((sum, i) => sum + i.drink.price * i.quantity, 0);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return { items, add, remove, clear, total, count };
}
