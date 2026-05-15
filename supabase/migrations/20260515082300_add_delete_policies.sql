-- Aggiunge le policy per permettere la cancellazione degli ordini
-- Solo gli ordini in stato 'pending' possono essere cancellati per sicurezza

CREATE POLICY "orders_delete_policy" ON "public"."orders" 
FOR DELETE 
USING (status = 'pending');

CREATE POLICY "order_items_delete_policy" ON "public"."order_items" 
FOR DELETE 
USING (true);
