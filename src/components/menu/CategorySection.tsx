import { motion } from 'framer-motion';
import { DrinkCard } from './DrinkCard';
import { useTranslation } from 'react-i18next';
import { DrinkCardSkeleton } from '@/components/ui/Skeleton';
import type { Drink, DrinkCategory } from '@/types';

interface CategorySectionProps {
  category: DrinkCategory;
  drinks: Drink[];
  onAdd?: (drink: Drink) => void;
  cartMap?: Record<string, number>;
}

const CATEGORY_EMOJI: Record<string, string> = {
  'Soft Drinks': '🥤',
  Birre: '🍺',
  Cocktail: '🍹',
  Acqua: '💧',
  'Energy Drink': '⚡',
};

export function CategorySection({ category, drinks, onAdd, cartMap = {} }: CategorySectionProps) {
  const { t } = useTranslation();
  return (
    <section className="mb-8">
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-2 mb-4"
      >
        <span className="text-2xl">{CATEGORY_EMOJI[category]}</span>
        <h2 className="text-lg font-bold text-white">{t(`categories.${category}`, category)}</h2>
        <span className="text-xs text-white/30 ml-1">({drinks.length})</span>
      </motion.div>
      <div className="grid grid-cols-2 gap-3">
        {drinks.map((drink, i) => (
          <motion.div
            key={drink.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <DrinkCard
              drink={drink}
              onAdd={onAdd}
              cartQuantity={cartMap[drink.id] ?? 0}
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export function MenuSkeleton() {
  return (
    <div className="space-y-8">
      {[1, 2].map((s) => (
        <div key={s} className="mb-8">
          <div className="h-6 w-32 bg-white/5 rounded-lg mb-4 animate-pulse" />
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <DrinkCardSkeleton key={i} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
