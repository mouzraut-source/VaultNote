-- Migration 3: Create payment_submissions table
-- Run this after products migration

CREATE TABLE public.payment_submissions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL CHECK (amount > 0),
    transaction_reference TEXT NOT NULL,
    screenshot_path TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    reviewed_by UUID REFERENCES public.profiles(id),
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.payment_submissions ENABLE ROW LEVEL SECURITY;

-- Policies for payment_submissions
CREATE POLICY "Users can view own submissions" ON public.payment_submissions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own submissions" ON public.payment_submissions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all submissions" ON public.payment_submissions
    FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can update submissions" ON public.payment_submissions
    FOR UPDATE USING (public.is_admin());

-- Indexes
CREATE INDEX idx_payment_submissions_user_id ON public.payment_submissions(user_id);
CREATE INDEX idx_payment_submissions_product_id ON public.payment_submissions(product_id);
CREATE INDEX idx_payment_submissions_status ON public.payment_submissions(status);
CREATE INDEX idx_payment_submissions_created_at ON public.payment_submissions(created_at DESC);
CREATE INDEX idx_payment_submissions_transaction_ref ON public.payment_submissions(transaction_reference);

-- Unique constraint to prevent duplicate pending submissions for same user/product
CREATE UNIQUE INDEX idx_unique_pending_submission 
ON public.payment_submissions(user_id, product_id) 
WHERE status = 'pending';