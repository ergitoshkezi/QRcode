import { motion } from 'framer-motion';
import { Clock, CheckCircle, Package, Truck, Trash2 } from 'lucide-react';
import { useCustomerOrders } from '@/hooks/useCustomerOrders';
import { Skeleton } from '@/components/ui/Skeleton';
import { orderService } from '@/services/orderService';

const statusConfig = {
  pending: { label: 'In attesa', color: 'text-yellow-400', bg: 'bg-yellow-400/10', icon: Clock },
  confirmed: { label: 'In preparazione', color: 'text-blue-400', bg: 'bg-blue-400/10', icon: Package },
  ready: { label: 'Pronto', color: 'text-green-400', bg: 'bg-green-400/10', icon: CheckCircle },
  delivered: { label: 'Consegnato', color: 'text-white/40', bg: 'bg-white/5', icon: Truck },
};

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
}

export function CustomerOrdersPanel({ qrCode }: { qrCode: string }) {
  const { orders, loading, refetch } = useCustomerOrders(qrCode);

  // Hide delivered orders after a while, or just show all recent ones. 
  // For now, let's show all of them but maybe limit to today's or just the fetched ones.
  // The query already orders by created_at descending.
  
  const handleDelete = async (id: string) => {
    if (window.confirm('Sei sicuro di voler annullare questo ordine?')) {
      try {
        alert('Inizio cancellazione ordine: ' + id);
        const { itemsCount, orderCount } = await orderService.deleteOrder(id);
        alert(`Risultato: ${orderCount} ordine eliminato e ${itemsCount} articoli eliminati.`);
        await refetch();
        alert('Lista ordini aggiornata!');
      } catch (error: any) {
        console.error('Failed to delete order:', error);
        alert("ERRORE CANCELLAZIONE: " + (error.message || JSON.stringify(error)));
      }
    }
  };

  if (loading) {
    return (
      <div className="mb-8 space-y-3">
        <Skeleton className="h-20 w-full rounded-2xl" />
      </div>
    );
  }

  if (orders.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
        I tuoi ordini recenti
      </h2>
      <div className="space-y-3">
        {orders.map((order) => {
          const config = statusConfig[order.status];
          const Icon = config.icon;
          
          return (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={order.id}
              className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-3"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.color} mb-2`}>
                    <Icon size={12} />
                    {config.label}
                  </div>
                  <p className="text-white/40 text-xs">
                    ID: {order.id.slice(0, 8)} · Ordinato alle {formatTime(order.created_at)}
                  </p>
                </div>
                <div className="text-right flex flex-col items-end gap-2">
                  <p className="text-white font-semibold text-sm">
                    {order.order_items?.reduce((acc, item) => acc + item.quantity, 0)} articoli
                  </p>
                  {order.status === 'pending' && (
                    <button
                      onClick={() => handleDelete(order.id)}
                      className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 bg-red-400/10 px-2 py-1 rounded-md transition-colors"
                    >
                      <Trash2 size={12} />
                      Annulla
                    </button>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-1">
                {order.order_items?.map((item) => (
                  <span key={item.id} className="text-xs text-white/60 bg-white/5 px-2 py-1 rounded-md">
                    {item.quantity}x {item.drink?.name || 'Drink'}
                  </span>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
