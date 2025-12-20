-- Add admin_comment column to orders table for status updates
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS admin_comment TEXT;

-- The existing update_updated_at trigger will automatically handle timestamp updates
