-- Migration 4: Create purchases table
-- Run this after payment_submissions migration

CREATE TABLE public.purchases (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    payment_submission_id UUID NOT NULL REFERENCES public.payment_submissions(id) ON DELETE CASCADE,
    purchased_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'revoked'))
);

-- Enable RLS
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;

-- Policies for purchases
CREATE POLICY "Users can view own purchases" ON public.purchases
    FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all purchases" ON public.purchases
    FOR SELECT TO authenticated USING (public.is_admin());

CREATE POLICY "Admins can insert purchases" ON public.purchases
    FOR INSERT TO authenticated WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update purchases" ON public.purchases
    FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete purchases" ON public.purchases
    FOR DELETE TO authenticated USING (public.is_admin());

-- Unique constraint: prevent duplicate active purchases for same user/product
CREATE UNIQUE INDEX idx_unique_active_purchase 
ON public.purchases(user_id, product_id) 
WHERE status = 'active';

-- Indexes
CREATE INDEX idx_purchases_user_id ON public.purchases(user_id);
CREATE INDEX idx_purchases_product_id ON public.purchases(product_id);
CREATE INDEX idx_purchases_payment_submission_id ON public.purchases(payment_submission_id);
CREATE INDEX idx_purchases_status ON public.purchases(status);
CREATE INDEX idx_purchases_purchased_at ON public.purchases(purchased_at DESC);