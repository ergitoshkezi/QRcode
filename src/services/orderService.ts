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
    const eightHoursAgo = new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString();
    
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
      .gte('created_at', eightHoursAgo)
      .order('created_at', { ascending: false })
      .limit(10);
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

  async deleteOrder(id: string): Promise<{ itemsCount: number; orderCount: number }> {
    // Delete order items first
    const { count: itemsCount, error: itemsError } = await supabase
      .from('order_items')
      .delete({ count: 'exact' })
      .eq('order_id', id);
    if (itemsError) throw itemsError;

    // Then delete the order
    const { count: orderCount, error: orderError } = await supabase
      .from('orders')
      .delete({ count: 'exact' })
      .eq('id', id);
    if (orderError) throw orderError;

    return { itemsCount: itemsCount || 0, orderCount: orderCount || 0 };
  },
};
