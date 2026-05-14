import { supabase } from '@/lib/supabase';
import type { CartItem, Order } from '@/types';

export const orderService = {
  async create(qrCode: string, items: CartItem[], notes?: string): Promise<Order> {
    // Insert order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({ qr_code: qrCode, status: 'pending', notes: notes ?? null })
      .select()
      .single();
    if (orderError) throw orderError;

    // Insert order items
    const orderItems = items.map((item) => ({
      order_id: order.id,
      drink_id: item.drink.id,
      quantity: item.quantity,
      price_snapshot: item.drink.price,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);
    if (itemsError) throw itemsError;

    return order as Order;
  },

  async getAll(): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          drink:drinks (*)
        )
      `)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data ?? []) as Order[];
  },

  async getByQrCode(qrCode: string): Promise<Order[]> {
    const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString();
    
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          drink:drinks (*)
        )
      `)
      .eq('qr_code', qrCode)
      .gte('created_at', twelveHoursAgo)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data ?? []) as Order[];
  },

  async updateStatus(id: string, status: Order['status']): Promise<void> {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id);
    if (error) throw error;
  },
};
