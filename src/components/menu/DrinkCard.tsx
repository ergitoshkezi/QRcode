import { motion } from 'framer-motion';
import { Plus, CupSoda } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { formatPrice } from '@/lib/utils';
import type { Drink } from '@/types';

interface DrinkCardProps {
  drink: Drink;
  onAdd?: (drink: Drink) => void;
  cartQuantity?: number;
}

const CATEGORY_EMOJI: Record<string, string> = {
  'Soft Drinks': '🥤',
  Birre: '🍺',
  Cocktail: '🍹',
  Acqua: '💧',
  'Energy Drink': '⚡',
};

export function DrinkCard({ drink, onAdd, cartQuantity = 0 }: DrinkCardProps) {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-white/5 border border-white/8 overflow-hidden hover:bg-white/8 transition-colors"
    >
      <div className="relative h-40 bg-white/5">
        {drink.image_url ? (
          <img
            src={drink.image_url}
            alt={drink.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-5xl">
            {CATEGORY_EMOJI[drink.category] ?? '🍶'}
          </div>
        )}
        {!drink.available && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-sm font-medium text-white/60 bg-black/50 px-3 py-1 rounded-full">
              {t('common.unavailable')}
            </span>
          </div>
        )}
        {/* Cart badge */}
        {cartQuantity > 0 && (
          <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white text-black text-xs font-bold flex items-center justify-center">
            {cartQuantity}
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-white text-base leading-tight">{drink.name}</h3>
          {drink.size && (
            <span className="text-[10px] font-medium text-white/50 bg-white/5 border border-white/8 px-1.5 py-0.5 rounded-lg shrink-0 flex items-center gap-1">
              <CupSoda size={10} className="text-white/40" />
              {drink.size}
            </span>
          )}
        </div>
        {drink.description && (
          <p className="mt-1 text-sm text-white/50 line-clamp-2 leading-relaxed">
            {drink.description}
          </p>
        )}
        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-bold text-white">
            {formatPrice(drink.price)}
          </span>
          {onAdd && drink.available && (
            <button
              onClick={() => onAdd(drink)}
              className="flex items-center gap-1.5 bg-white text-black text-xs font-semibold px-3 py-1.5 rounded-xl hover:bg-white/90 active:scale-95 transition-all"
            >
              <Plus size={12} />
              {t('common.add')}
            </button>
          )}
          {!onAdd && (
            <span className="text-xs text-white/40 bg-white/5 px-2.5 py-1 rounded-full border border-white/8">
              {t(`categories.${drink.category}`, drink.category)}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
