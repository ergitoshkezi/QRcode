import { supabase } from '@/lib/supabase';
import type { Drink, DrinkFormData } from '@/types';

export const drinksService = {
  async getAll(): Promise<Drink[]> {
    const { data, error } = await supabase
      .from('drinks')
      .select('*')
      .order('category')
      .order('name');
    if (error) throw error;
    return data ?? [];
  },

  async getAvailable(): Promise<Drink[]> {
    const { data, error } = await supabase
      .from('drinks')
      .select('*')
      .eq('available', true)
      .order('category')
      .order('name');
    if (error) throw error;
    return data ?? [];
  },

  async create(drink: DrinkFormData): Promise<Drink> {
    const { data, error } = await supabase
      .from('drinks')
      .insert(drink)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id: string, drink: Partial<DrinkFormData>): Promise<Drink> {
    const { data, error } = await supabase
      .from('drinks')
      .update(drink)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('drinks').delete().eq('id', id);
    if (error) throw error;
  },

  async uploadImage(file: File): Promise<string> {
    const ext = file.name.split('.').pop();
    const fileName = `${Date.now()}.${ext}`;
    const { error } = await supabase.storage
      .from('drink-images')
      .upload(fileName, file, { upsert: true });
    if (error) throw error;
    const { data } = supabase.storage
      .from('drink-images')
      .getPublicUrl(fileName);
    return data.publicUrl;
  },
};
