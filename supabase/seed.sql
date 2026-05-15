-- Dati di esempio per DrinkQR
-- Questo file viene eseguito automaticamente da 'supabase db reset'

-- Inserimento Drink
INSERT INTO public.drinks (name, description, price, category, available) VALUES
  ('Coca Cola', 'La classica bibita gassata', 2.50, 'Soft Drinks', true),
  ('Acqua naturale', 'Acqua minerale naturale 50cl', 1.50, 'Acqua', true),
  ('Acqua frizzante', 'Acqua minerale frizzante 50cl', 1.50, 'Acqua', true),
  ('Peroni', 'Birra italiana in bottiglia 33cl', 3.50, 'Birre', true),
  ('Aperol Spritz', 'Aperol, Prosecco, soda', 6.00, 'Cocktail', true),
  ('Red Bull', 'Energy drink 25cl', 4.00, 'Energy Drink', true),
  ('Spritz al limone', 'Limoncello, prosecco, menta', 5.50, 'Cocktail', true),
  ('Heineken', 'Birra olandese 33cl', 3.80, 'Birre', true)
ON CONFLICT DO NOTHING;

-- Inserimento Tavoli / QR Codes
INSERT INTO public.qr_codes (qr_code, table_name, active) VALUES
  ('QR001', 'Tavolo 1', true),
  ('QR002', 'Tavolo 2', true),
  ('QR003', 'Tavolo 3', true),
  ('QRBAR', 'Bancone Bar', true),
  ('QRTEST', 'Test QR', true)
ON CONFLICT (qr_code) DO NOTHING;
