-- Fix RLS policies for orders and order_items to allow anonymous inserts and admin deletion
-- Drop existing problematic policies
DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;
DROP POLICY IF EXISTS "Anyone can create order items" ON public.order_items;

-- Recreate policies that explicitly allow anonymous users
-- For orders table
CREATE POLICY "allow_anonymous_insert_orders" ON public.orders
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "allow_select_orders" ON public.orders
  FOR SELECT
  USING (true);

CREATE POLICY "allow_delete_orders" ON public.orders
  FOR DELETE
  USING (true);

-- For order_items table  
CREATE POLICY "allow_anonymous_insert_order_items" ON public.order_items
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "allow_select_order_items" ON public.order_items
  FOR SELECT
  USING (true);

CREATE POLICY "allow_delete_order_items" ON public.order_items
  FOR DELETE
  USING (true);

