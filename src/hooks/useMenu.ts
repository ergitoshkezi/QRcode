import { useState, useEffect } from 'react';
import { drinksService } from '@/services/drinksService';
import type { Drink, DrinkCategory } from '@/types';

export function useMenu() {
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    drinksService
      .getAvailable()
      .then(setDrinks)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : 'Errore caricamento menu'))
      .finally(() => setLoading(false));
  }, []);

  const byCategory = drinks.reduce<Record<DrinkCategory, Drink[]>>(
    (acc, drink) => {
      if (!acc[drink.category]) acc[drink.category] = [];
      acc[drink.category].push(drink);
      return acc;
    },
    {} as Record<DrinkCategory, Drink[]>
  );

  const categories = Object.keys(byCategory) as DrinkCategory[];

  return { drinks, byCategory, categories, loading, error };
}
