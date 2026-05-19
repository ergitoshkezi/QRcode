import { useState, useEffect } from 'react';
import { drinksService } from '@/services/drinksService';
import { useTranslation } from 'react-i18next';
import { translateDbText } from '@/lib/utils';
import type { Drink, DrinkCategory } from '@/types';

export function useMenu() {
  const [rawDrinks, setRawDrinks] = useState<Drink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    drinksService
      .getAvailable()
      .then(setRawDrinks)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : 'Errore caricamento menu'))
      .finally(() => setLoading(false));
  }, []);

  const drinks = rawDrinks.map((drink) => ({
    ...drink,
    name: t(translateDbText(drink.name, i18n.language)),
    description: drink.description 
      ? t(translateDbText(drink.description, i18n.language)) 
      : drink.description
  }));

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
