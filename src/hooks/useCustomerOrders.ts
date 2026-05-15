import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { orderService } from '@/services/orderService';
import type { Order } from '@/types';

export function useCustomerOrders(qrCode?: string) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    if (!qrCode) return;
    try {
      const data = await orderService.getByQrCode(qrCode);
      setOrders(data);
    } catch (e) {
      console.error('Failed to fetch customer orders', e);
    } finally {
      setLoading(false);
    }
  }, [qrCode]);

  useEffect(() => {
    if (!qrCode) {
      setLoading(false);
      return;
    }
    
    fetchOrders();

    // Polling fallback every 28 seconds
    const intervalId = setInterval(() => {
      fetchOrders();
    }, 28000);

    // Listen to changes on the orders table
    const channel = supabase
      .channel(`orders-customer-${qrCode}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        () => {
          // Verify if this order belongs to our qrCode, or just refetch.
          // Since we might not have qr_code in the payload if it wasn't changed,
          // it's safest to just refetch to get updated status and full relations.
          fetchOrders();
        }
      )
      .subscribe();

    return () => {
      clearInterval(intervalId);
      supabase.removeChannel(channel);
    };
  }, [qrCode, fetchOrders]);

  return { orders, loading, refetch: fetchOrders };
}
