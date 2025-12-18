-- Migration: Add product management features
-- Created: 2025-12-18
-- Purpose: Add stock tracking, discount management, and performance indexes

-- ============================================================================
-- 1. ALTER PRODUCTS TABLE - Add missing columns for new features
-- ============================================================================

-- Add stock_quantity column if it doesn't exist
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS stock_quantity INTEGER DEFAULT 0;

-- Add discount columns
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS discounted_price DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS discount_expiry TIMESTAMP WITH TIME ZONE;

-- Add column to track if product is active/visible
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- ============================================================================
-- 2. HELPER FUNCTIONS FOR PRODUCT MANAGEMENT
-- ============================================================================

-- Function to check if a product's discount is active
CREATE OR REPLACE FUNCTION public.is_discount_active(discount_expiry TIMESTAMP WITH TIME ZONE)
RETURNS BOOLEAN
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT discount_expiry IS NOT NULL AND discount_expiry > NOW()
$$;

-- Function to get active product price (returns discounted price if applicable, else regular price)
CREATE OR REPLACE FUNCTION public.get_product_price(
  regular_price DECIMAL,
  discounted_price DECIMAL,
  discount_expiry TIMESTAMP WITH TIME ZONE
)
RETURNS DECIMAL
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT CASE 
    WHEN public.is_discount_active(discount_expiry) THEN discounted_price
    ELSE regular_price
  END
$$;

-- Function to calculate discount percentage
CREATE OR REPLACE FUNCTION public.get_discount_percentage(
  regular_price DECIMAL,
  discounted_price DECIMAL,
  discount_expiry TIMESTAMP WITH TIME ZONE
)
RETURNS INTEGER
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT CASE 
    WHEN public.is_discount_active(discount_expiry) AND discounted_price > 0
    THEN ROUND(((regular_price - discounted_price) / regular_price) * 100)::INTEGER
    ELSE 0
  END
$$;

-- ============================================================================
-- 3. INDEXES FOR PERFORMANCE
-- ============================================================================

-- Index for frequently queried product fields
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_in_stock ON public.products(in_stock);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON public.products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON public.products(created_at DESC);

-- Index for orders queries
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);

-- Index for order items
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON public.order_items(product_id);

-- ============================================================================
-- 4. COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON COLUMN public.products.stock_quantity IS 'Number of units available in stock';
COMMENT ON COLUMN public.products.discounted_price IS 'Discounted price in RWF; if NULL, no discount is active';
COMMENT ON COLUMN public.products.discount_expiry IS 'Timestamp when the discount expires; NULL if no discount';
COMMENT ON COLUMN public.products.is_active IS 'If false, product is hidden from public view';

COMMENT ON FUNCTION public.is_discount_active(TIMESTAMP WITH TIME ZONE) IS 'Returns true if discount is currently active';
COMMENT ON FUNCTION public.get_product_price(DECIMAL, DECIMAL, TIMESTAMP WITH TIME ZONE) IS 'Returns the effective price (discounted if applicable)';
COMMENT ON FUNCTION public.get_discount_percentage(DECIMAL, DECIMAL, TIMESTAMP WITH TIME ZONE) IS 'Returns discount percentage as integer';

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
-- Run this migration to set up:
-- 1. Product management columns (stock, discounts)
-- 2. Helper functions for pricing logic
-- 3. Performance indexes
-- 
-- NEXT STEPS (after running migration):
-- 1. Storage buckets setup (see STORAGE_SETUP_GUIDE.md)
-- 2. Update React components to use new columns
-- 3. Implement image upload functionality
-- 4. Test features
-- ============================================================================
