-- Migration 5: Storage bucket policies
-- Run this in Supabase SQL Editor after creating the storage buckets

-- Create buckets (if not exists) - note: this is for reference, actual bucket creation
-- is done via Supabase Dashboard or CLI
/*
supabase storage buckets create academic-materials --public=false
supabase storage buckets create payment-proofs --public=false
*/

-- Storage policies for academic-materials bucket
-- Admins can upload academic materials
CREATE POLICY "Admins can upload academic materials" ON storage.objects
    FOR INSERT TO authenticated WITH CHECK (
        bucket_id = 'academic-materials' AND
        public.is_admin()
    );

-- Admins can update academic materials (for upsert/replacement)
CREATE POLICY "Admins can update academic materials" ON storage.objects
    FOR UPDATE TO authenticated USING (
        bucket_id = 'academic-materials' AND
        public.is_admin()
    ) WITH CHECK (
        bucket_id = 'academic-materials' AND
        public.is_admin()
    );

-- Admins can delete academic materials
CREATE POLICY "Admins can delete academic materials" ON storage.objects
    FOR DELETE TO authenticated USING (
        bucket_id = 'academic-materials' AND
        public.is_admin()
    );

-- Users can view academic materials (signed URL generation requires SELECT)
CREATE POLICY "Authenticated users can view academic materials" ON storage.objects
    FOR SELECT TO authenticated USING (
        bucket_id = 'academic-materials'
    );

-- Storage policies for payment-proofs bucket
-- Users can upload their own proofs (path: {userId}/{timestamp}.ext)
CREATE POLICY "Users can upload own payment proofs" ON storage.objects
    FOR INSERT TO authenticated WITH CHECK (
        bucket_id = 'payment-proofs' AND
        auth.uid()::text = split_part(name, '/', 1)
    );

-- Users can view their own proofs
CREATE POLICY "Users can view own payment proofs" ON storage.objects
    FOR SELECT TO authenticated USING (
        bucket_id = 'payment-proofs' AND
        auth.uid()::text = split_part(name, '/', 1)
    );

-- Admins can view all proofs
CREATE POLICY "Admins can view all payment proofs (SELECT)" ON storage.objects
    FOR SELECT TO authenticated USING (
        bucket_id = 'payment-proofs' AND
        public.is_admin()
    );

-- Admins can upload payment proofs (for moderation/replacement)
CREATE POLICY "Admins can upload payment proofs" ON storage.objects
    FOR INSERT TO authenticated WITH CHECK (
        bucket_id = 'payment-proofs' AND
        public.is_admin()
    );

-- Admins can update payment proofs
CREATE POLICY "Admins can update payment proofs" ON storage.objects
    FOR UPDATE TO authenticated USING (
        bucket_id = 'payment-proofs' AND
        public.is_admin()
    ) WITH CHECK (
        bucket_id = 'payment-proofs' AND
        public.is_admin()
    );

-- Admins can delete payment proofs
CREATE POLICY "Admins can delete payment proofs" ON storage.objects
    FOR DELETE TO authenticated USING (
        bucket_id = 'payment-proofs' AND
        public.is_admin()
    );