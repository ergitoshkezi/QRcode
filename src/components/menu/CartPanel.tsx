import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ShoppingCart, Plus, Minus, X, ChevronUp, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { formatPrice, translateDbText } from '@/lib/utils';
import { orderService } from '@/services/orderService';
import { toast } from '@/components/ui/Toast';
import type { CartItem } from '@/types';

interface CartPanelProps {
  qrCode: string;
  items: CartItem[];
  total: number;
  count: number;
  onAdd: (drinkId: string) => void;
  onRemove: (drinkId: string) => void;
  onClear: () => void;
  onOrderPlaced?: () => void;
}

export function CartPanel({
  qrCode,
  items,
  total,
  count,
  onAdd,
  onRemove,
  onClear,
  onOrderPlaced,
}: CartPanelProps) {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (count === 0 && !open) return null;

  const handleOrder = async () => {
    setSubmitting(true);
    try {
      await orderService.create(qrCode, items, notes);
      setSubmitted(true);
      onClear();
      setOpen(false);
      onOrderPlaced?.();
      toast(t('cart.toast.success'));
    } catch {
      toast(t('cart.toast.error'), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) return null;

  return (
    <>
      {/* FAB cart button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-4 z-40 flex items-center gap-2 bg-white text-black px-4 py-3 rounded-2xl shadow-2xl font-semibold text-sm"
      >
        <ShoppingCart size={16} />
        <span>{t('cart.items', { count })}</span>
        <span className="ml-1 font-bold">{formatPrice(total)}</span>
      </motion.button>

      {/* Drawer */}
      <AnimatePresence>
        {open && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            />

            {/* Panel */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-zinc-950 border-t border-white/10 rounded-t-3xl max-h-[80vh] flex flex-col"
            >
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-white/20" />
              </div>

              <div className="flex items-center justify-between px-5 py-3 border-b border-white/8">
                <h2 className="font-bold text-white text-lg">{t('cart.title')}</h2>
                <button onClick={() => setOpen(false)} className="text-white/40 hover:text-white">
                  <ChevronUp size={20} />
                </button>
              </div>

              {/* Items */}
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
                {items.map(({ drink, quantity }) => (
                  <div key={drink.id} className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{t(translateDbText(drink.name, i18n.language))}</p>
                      <p className="text-xs text-white/40">{formatPrice(drink.price)} {t('cart.each')}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onRemove(drink.id)}
                        className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-sm font-bold text-white w-4 text-center">{quantity}</span>
                      <button
                        onClick={() => onAdd(drink.id)}
                        className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20"
                      >
                        <Plus size={12} />
                      </button>
                      <button
                        onClick={() => { for (let i = 0; i < quantity; i++) onRemove(drink.id); }}
                        className="w-7 h-7 rounded-full flex items-center justify-center text-white/30 hover:text-red-400 hover:bg-red-500/10"
                      >
                        <X size={12} />
                      </button>
                    </div>
                    <span className="text-sm font-semibold text-white w-16 text-right">
                      {formatPrice(drink.price * quantity)}
                    </span>
                  </div>
                ))}

                {/* Note */}
                <div className="pt-2">
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={t('cart.notes')}
                    rows={2}
                    className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 resize-none"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="px-5 pb-8 pt-3 border-t border-white/8 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-sm">{t('cart.total')}</span>
                  <span className="text-xl font-bold text-white">{formatPrice(total)}</span>
                </div>
                <Button
                  onClick={handleOrder}
                  disabled={submitting}
                  size="lg"
                  className="w-full"
                >
                  {submitting ? (
                    <><Loader2 size={16} className="mr-2 animate-spin" /> {t('cart.submitting')}</>
                  ) : (
                    t('cart.submit')
                  )}
                </Button>
                <p className="text-center text-xs text-white/30">
                  {t('cart.payment')}
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
