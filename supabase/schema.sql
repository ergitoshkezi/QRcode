-- DrinkQR Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Drinks table
CREATE TABLE IF NOT EXISTS drinks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL DEFAULT 0,
  image_url TEXT,
  category TEXT NOT NULL CHECK (
    category IN ('Soft Drinks', 'Birre', 'Cocktail', 'Acqua', 'Energy Drink')
  ),
  available BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- QR Codes table
CREATE TABLE IF NOT EXISTS qr_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  qr_code TEXT UNIQUE NOT NULL,
  table_name TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  qr_code TEXT NOT NULL REFERENCES qr_codes(qr_code),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (
    status IN ('pending', 'confirmed', 'ready', 'delivered')
  ),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  drink_id UUID NOT NULL REFERENCES drinks(id),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price_snapshot NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==============================
-- Row Level Security
-- ==============================

-- Drinks: read public, write only from service role (admin)
ALTER TABLE drinks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "drinks_public_read" ON drinks
  FOR SELECT USING (true);

CREATE POLICY "drinks_service_write" ON drinks
  FOR ALL USING (auth.role() = 'service_role');

-- QR Codes: read public (for validation), write service only
ALTER TABLE qr_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "qr_public_read" ON qr_codes
  FOR SELECT USING (true);

CREATE POLICY "qr_service_write" ON qr_codes
  FOR ALL USING (auth.role() = 'service_role');

-- Orders: insert public (customers order), read/update service only
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "orders_public_insert" ON orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "orders_service_read_update" ON orders
  FOR SELECT USING (true);

CREATE POLICY "orders_service_update" ON orders
  FOR UPDATE USING (true);

-- Order items: insert public, read service
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "order_items_public_insert" ON order_items
  FOR INSERT WITH CHECK (true);

CREATE POLICY "order_items_read_all" ON order_items
  FOR SELECT USING (true);

-- ==============================
-- Storage bucket: drink-images
-- ==============================
-- Run in Supabase dashboard > Storage > New bucket
-- Name: drink-images
-- Public: true
-- Or via SQL:

INSERT INTO storage.buckets (id, name, public)
VALUES ('drink-images', 'drink-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "drink_images_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'drink-images');

CREATE POLICY "drink_images_service_upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'drink-images');

-- ==============================
-- Sample data
-- ==============================
INSERT INTO drinks (name, description, price, category, available) VALUES
  ('Coca Cola', 'La classica bibita gassata', 2.50, 'Soft Drinks', true),
  ('Acqua naturale', 'Acqua minerale naturale 50cl', 1.50, 'Acqua', true),
  ('Acqua frizzante', 'Acqua minerale frizzante 50cl', 1.50, 'Acqua', true),
  ('Peroni', 'Birra italiana in bottiglia 33cl', 3.50, 'Birre', true),
  ('Aperol Spritz', 'Aperol, Prosecco, soda', 6.00, 'Cocktail', true),
  ('Red Bull', 'Energy drink 25cl', 4.00, 'Energy Drink', true),
  ('Spritz al limone', 'Limoncello, prosecco, menta', 5.50, 'Cocktail', true),
  ('Heineken', 'Birra olandese 33cl', 3.80, 'Birre', true);

INSERT INTO qr_codes (qr_code, table_name, active) VALUES
  ('QR001', 'Tavolo 1', true),
  ('QR002', 'Tavolo 2', true),
  ('QR003', 'Tavolo 3', true),
  ('QRBAR', 'Bancone Bar', true),
  ('QRTEST', 'Test QR', true);
