import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { orderService } from '@/services/orderService';
import { useTranslation } from 'react-i18next';
import { translateDbText } from '@/lib/utils';
import type { Order } from '@/types';

export function useRealtimeOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { t, i18n } = useTranslation();

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
          fetchAll();
        }
      )
      .subscribe();

    return () => {
      clearInterval(intervalId);
      supabase.removeChannel(channel);
    };
  }, [fetchAll]);

  const translatedOrders = orders.map((order) => ({
    ...order,
    order_items: order.order_items?.map((item) => ({
      ...item,
      drink: item.drink
        ? {
            ...item.drink,
            name: t(translateDbText(item.drink.name, i18n.language)),
            description: item.drink.description
              ? t(translateDbText(item.drink.description, i18n.language))
              : item.drink.description,
          }
        : item.drink,
    })),
  }));

  return { orders: translatedOrders, loading, refetch: fetchAll };
}
