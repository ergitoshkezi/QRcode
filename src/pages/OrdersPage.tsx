import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle2, Bell, Package } from 'lucide-react';
import { useRealtimeOrders } from '@/hooks/useRealtimeOrders';
import { orderService } from '@/services/orderService';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatPrice } from '@/lib/utils';
import { toast } from '@/components/ui/Toast';
import type { Order } from '@/types';

const STATUS_CONFIG = {
  pending:   { label: 'In attesa',   icon: Clock,         color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
  confirmed: { label: 'Confermato',  icon: Bell,          color: 'text-blue-400',   bg: 'bg-blue-500/10 border-blue-500/20' },
  ready:     { label: 'Pronto',      icon: Package,       color: 'text-green-400',  bg: 'bg-green-500/10 border-green-500/20' },
  delivered: { label: 'Consegnato',  icon: CheckCircle2,  color: 'text-white/30',   bg: 'bg-white/5 border-white/10' },
} as const;

const NEXT_STATUS: Record<Order['status'], Order['status'] | null> = {
  pending:   'confirmed',
  confirmed: 'ready',
  ready:     'delivered',
  delivered: null,
};

const NEXT_LABEL: Record<Order['status'], string> = {
  pending:   'Conferma',
  confirmed: 'Pronto',
  ready:     'Consegnato',
  delivered: '',
};

function OrderCard({ order, onStatusChange }: { order: Order; onStatusChange: () => void }) {
  const cfg = STATUS_CONFIG[order.status];
  const Icon = cfg.icon;
  const next = NEXT_STATUS[order.status];

  const advance = async () => {
    if (!next) return;
    try {
      await orderService.updateStatus(order.id, next);
      onStatusChange();
    } catch {
      toast('Errore aggiornamento stato', 'error');
    }
  };

  const itemsTotal =
    order.order_items?.reduce((s, i) => s + i.price_snapshot * i.quantity, 0) ?? 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`rounded-2xl border p-4 ${cfg.bg}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="font-bold text-white text-base">
            {order.table_name ?? order.qr_code}
          </p>
          <p className="text-xs text-white/40 font-mono">{order.qr_code}</p>
          <p className="text-xs text-white/30 mt-0.5">
            {new Date(order.created_at).toLocaleTimeString('it-IT', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
        <div className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${cfg.bg} ${cfg.color}`}>
          <Icon size={12} />
          {cfg.label}
        </div>
      </div>

      {/* Items */}
      <div className="space-y-1.5 mb-3">
        {order.order_items?.map((item) => (
          <div key={item.id} className="flex items-center justify-between text-sm">
            <span className="text-white/80">
              <span className="text-white/40 mr-1">{item.quantity}×</span>
              {item.drink?.name ?? `Drink ${item.drink_id.slice(0, 6)}`}
            </span>
            <span className="text-white/50">{formatPrice(item.price_snapshot * item.quantity)}</span>
          </div>
        ))}
      </div>

      {/* Notes */}
      {order.notes && (
        <p className="text-xs text-yellow-300/70 bg-yellow-500/10 rounded-xl px-3 py-2 mb-3">
          📝 {order.notes}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-white/8">
        <span className="font-bold text-white">{formatPrice(itemsTotal)}</span>
        {next && (
          <button
            onClick={advance}
            className="text-sm font-semibold bg-white text-black px-4 py-1.5 rounded-xl hover:bg-white/90 active:scale-95 transition-all"
          >
            {NEXT_LABEL[order.status]} →
          </button>
        )}
      </div>
    </motion.div>
  );
}

const STATUS_ORDER: Order['status'][] = ['pending', 'confirmed', 'ready', 'delivered'];

export function OrdersPage() {
  const { orders, loading, refetch } = useRealtimeOrders();

  const grouped = STATUS_ORDER.reduce<Record<Order['status'], Order[]>>(
    (acc, s) => ({ ...acc, [s]: orders.filter((o) => o.status === s) }),
    { pending: [], confirmed: [], ready: [], delivered: [] }
  );

  const active = orders.filter((o) => o.status !== 'delivered');

  return (
    <div className="p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Ordini</h1>
          <p className="text-white/40 text-sm mt-0.5">
            {active.length} attivi · aggiornamento in tempo reale
          </p>
        </div>
        {/* Realtime indicator */}
        <div className="flex items-center gap-2 text-xs text-green-400 bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          Live
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-48" />)}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 text-white/30">
          <p className="text-4xl mb-3">🍹</p>
          <p>Nessun ordine ancora</p>
          <p className="text-xs mt-1">Gli ordini appariranno qui in tempo reale</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(['pending', 'confirmed', 'ready'] as const).map((status) => {
            const cfg = STATUS_CONFIG[status];
            const Icon = cfg.icon;
            return (
              <div key={status}>
                <div className={`flex items-center gap-2 mb-3 text-sm font-semibold ${cfg.color}`}>
                  <Icon size={15} />
                  {cfg.label}
                  <span className="ml-auto text-white/30">{grouped[status].length}</span>
                </div>
                <div className="space-y-3">
                  <AnimatePresence>
                    {grouped[status].map((order) => (
                      <OrderCard key={order.id} order={order} onStatusChange={refetch} />
                    ))}
                  </AnimatePresence>
                  {grouped[status].length === 0 && (
                    <div className="rounded-2xl border border-dashed border-white/10 p-6 text-center text-white/20 text-sm">
                      Nessun ordine
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delivered (collapsed) */}
      {grouped.delivered.length > 0 && (
        <div className="mt-8 pt-6 border-t border-white/8">
          <p className="text-sm text-white/30 mb-3 flex items-center gap-2">
            <CheckCircle2 size={14} /> Consegnati oggi ({grouped.delivered.length})
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 opacity-40">
            {grouped.delivered.slice(0, 3).map((order) => (
              <OrderCard key={order.id} order={order} onStatusChange={refetch} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
