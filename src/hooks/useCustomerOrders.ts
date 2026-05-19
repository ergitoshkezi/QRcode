import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { orderService } from '@/services/orderService';
import { useTranslation } from 'react-i18next';
import { translateDbText } from '@/lib/utils';
import type { Order } from '@/types';

export function useCustomerOrders(qrCode?: string) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { t, i18n } = useTranslation();

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
          fetchOrders();
        }
      )
      .subscribe();

    return () => {
      clearInterval(intervalId);
      supabase.removeChannel(channel);
    };
  }, [qrCode, fetchOrders]);

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

  return { orders: translatedOrders, loading, refetch: fetchOrders };
}
