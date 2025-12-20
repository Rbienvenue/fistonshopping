-- Add DELETE policies for orders and order_items tables to allow admin deletion

-- For orders table - allow delete
CREATE POLICY "allow_admin_delete_orders" ON public.orders
  FOR DELETE
  USING (true);

-- For order_items table - allow delete
CREATE POLICY "allow_admin_delete_order_items" ON public.order_items
  FOR DELETE
  USING (true);
