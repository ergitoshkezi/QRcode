import { supabase } from '@/lib/supabase';
import type { QrCode, QrFormData } from '@/types';

export const qrService = {
  async getAll(): Promise<QrCode[]> {
    const { data, error } = await supabase
      .from('qr_codes')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data ?? [];
  },

  async getByCode(qrCode: string): Promise<QrCode | null> {
    const { data, error } = await supabase
      .from('qr_codes')
      .select('*')
      .eq('qr_code', qrCode)
      .single();
    if (error) return null;
    return data;
  },

  async create(qr: QrFormData): Promise<QrCode> {
    const { data, error } = await supabase
      .from('qr_codes')
      .insert({ ...qr, active: true })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async toggleActive(id: string, active: boolean): Promise<void> {
    const { error } = await supabase
      .from('qr_codes')
      .update({ active })
      .eq('id', id);
    if (error) throw error;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('qr_codes').delete().eq('id', id);
    if (error) throw error;
  },
};
