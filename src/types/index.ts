export type DrinkCategory =
  | 'Soft Drinks'
  | 'Birre'
  | 'Cocktail'
  | 'Acqua'
  | 'Energy Drink';

export interface Drink {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category: DrinkCategory;
  available: boolean;
  size?: string | null;
  created_at: string;
}

export interface QrCode {
  id: string;
  qr_code: string;
  table_name: string;
  active: boolean;
  created_at: string;
}

export interface Order {
  id: string;
  qr_code: string;
  table_name?: string;
  status: 'pending' | 'confirmed' | 'ready' | 'delivered';
  notes: string | null;
  created_at: string;
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  drink_id: string;
  quantity: number;
  price_snapshot: number;
  drink?: Drink;
}

export interface CartItem {
  drink: Drink;
  quantity: number;
}

export type DrinkFormData = Omit<Drink, 'id' | 'created_at'>;
export type QrFormData = Pick<QrCode, 'qr_code' | 'table_name'>;
