import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { orderService } from '@/services/orderService';
import type { Order } from '@/types';

export function useRealtimeOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    const data = await orderService.getAll();
    setOrders(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAll();

    // Polling fallback every 28 seconds
    const intervalId = setInterval(() => {
      fetchAll();
    }, 28000);

    // Supabase Realtime — listen to new orders + status changes
    const channel = supabase
      .channel('orders-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        () => {
          // Refetch on any change to get full joined data
          fetchAll();
        }
      )
      .subscribe();

    return () => {
      clearInterval(intervalId);
      supabase.removeChannel(channel);
    };
  }, [fetchAll]);

  return { orders, loading, refetch: fetchAll };
}
