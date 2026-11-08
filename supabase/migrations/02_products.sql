-- Migration 2: Create products table
-- Run this after profiles migration

CREATE TABLE public.products (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    subject TEXT,
    price INTEGER NOT NULL DEFAULT 0 CHECK (price >= 0),
    storage_path TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Policies for products
-- SELECT: Anyone can view active products, admins can view all
CREATE POLICY "Anyone can view active products" ON public.products
    FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Admins can view all products" ON public.products
    FOR SELECT TO authenticated USING (public.is_admin());

-- INSERT: Admins can create products
CREATE POLICY "Admins can insert products" ON public.products
    FOR INSERT TO authenticated WITH CHECK (public.is_admin());

-- UPDATE: Admins can update products (requires USING to SELECT first)
CREATE POLICY "Admins can update products" ON public.products
    FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- DELETE: Admins can delete products
CREATE POLICY "Admins can delete products" ON public.products
    FOR DELETE TO authenticated USING (public.is_admin());

-- Indexes
CREATE INDEX idx_products_is_active ON public.products(is_active);
CREATE INDEX idx_products_created_at ON public.products(created_at DESC);