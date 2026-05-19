import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Clock, CheckCircle, Package, Truck, Trash2, AlertTriangle, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/Skeleton';
import { orderService } from '@/services/orderService';
import type { Order } from '@/types';

const statusConfig = {
  pending:   { label: 'In attesa',       color: 'text-yellow-400', bg: 'bg-yellow-400/10', icon: Clock },
  confirmed: { label: 'In preparazione', color: 'text-blue-400',   bg: 'bg-blue-400/10',   icon: Package },
  ready:     { label: 'Pronto',          color: 'text-green-400',  bg: 'bg-green-400/10',  icon: CheckCircle },
  delivered: { label: 'Consegnato',      color: 'text-white/40',   bg: 'bg-white/5',       icon: Truck },
};

function formatTime(dateStr: string, locale: string = 'it-IT') {
  return new Date(dateStr).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
}

interface CustomerOrdersPanelProps {
  qrCode: string;
  orders: Order[];
  loading: boolean;
  refetch: () => void;
}

export function CustomerOrdersPanel({ qrCode: _qrCode, orders, loading, refetch }: CustomerOrdersPanelProps) {
  const { t, i18n } = useTranslation();
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    setConfirmId(null);
    try {
      await orderService.deleteOrder(id);
      await refetch();
    } catch {
      // Silently fail — the order will reappear on next poll if delete failed
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="mb-8 space-y-3">
        <Skeleton className="h-20 w-full rounded-2xl" />
      </div>
    );
  }

  if (orders.length === 0) return null;

  return (
    <div className="mb-8">
      <h2 className="text-lg font-bold text-white mb-3">{t('orders.title')}</h2>
      <div className="space-y-3">
        <AnimatePresence>
          {orders.map((order) => {
            const config = statusConfig[order.status];
            const Icon = config.icon;
            const isDeleting = deletingId === order.id;
            const isConfirming = confirmId === order.id;
            const itemCount = order.order_items?.reduce((acc, item) => acc + item.quantity, 0) ?? 0;

            return (
              <motion.div
                key={order.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: isDeleting ? 0.4 : 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, height: 0 }}
                transition={{ duration: 0.25 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-3 overflow-hidden"
              >
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.color} mb-2`}>
                      <Icon size={12} />
                      {t(`orders.status.${order.status}`)}
                    </div>
                    <p className="text-white/40 text-xs">
                      {t('orders.orderedAt', { time: formatTime(order.created_at, i18n.language) })}
                    </p>
                  </div>
                  <div className="text-right flex flex-col items-end gap-2">
                    <p className="text-white font-semibold text-sm">
                      {t('orders.items', { count: itemCount })}
                    </p>
                    <p className="text-white/70 text-xs font-medium">
                      {t('orders.total')}:{' '}
                      <span className="text-white font-semibold">
                        €{(order.order_items?.reduce((acc, item) => acc + item.quantity * (item.price_snapshot ?? 0), 0) ?? 0).toFixed(2)}
                      </span>
                    </p>
                    {order.status === 'pending' && !isDeleting && (
                      <button
                        onClick={() => setConfirmId(isConfirming ? null : order.id)}
                        className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 bg-red-400/10 px-2 py-1 rounded-md transition-colors"
                      >
                        <Trash2 size={12} />
                        {t('orders.cancel')}
                      </button>
                    )}
                    {isDeleting && (
                      <span className="text-xs text-white/30 flex items-center gap-1">
                        <Loader2 size={12} className="animate-spin" />
                        {t('orders.cancelling')}
                      </span>
                    )}
                  </div>
                </div>

                {/* Prodotti */}
                <div className="flex flex-wrap gap-2">
                  {order.order_items?.map((item) => (
                    <span key={item.id} className="text-xs text-white/60 bg-white/5 px-2 py-1 rounded-md">
                      {item.quantity}x {item.drink?.name ?? t('orders.defaultDrinkName', 'Drink')}
                    </span>
                  ))}
                </div>

                {/* Dialogo conferma in-app */}
                <AnimatePresence>
                  {isConfirming && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t border-red-500/20 pt-3"
                    >
                      <div className="flex items-start gap-2 mb-3">
                        <AlertTriangle size={14} className="text-red-400 mt-0.5 shrink-0" />
                        <p className="text-xs text-white/60">
                          {t('orders.confirmText')}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setConfirmId(null)}
                          className="flex-1 text-xs text-white/50 bg-white/5 hover:bg-white/10 py-2 rounded-xl transition-colors"
                        >
                          {t('orders.no')}
                        </button>
                        <button
                          onClick={() => handleDelete(order.id)}
                          className="flex-1 text-xs text-red-400 bg-red-500/15 hover:bg-red-500/25 py-2 rounded-xl font-semibold transition-colors"
                        >
                          {t('orders.yes')}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
