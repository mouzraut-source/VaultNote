-- Migration 5: Create storage buckets and policies
-- Run this in Supabase SQL Editor after enabling Storage

-- Note: These storage operations need to be done via Supabase Dashboard or CLI
-- This file documents the required buckets and policies

/*
-- Create buckets (run in Supabase Dashboard > Storage)
-- Bucket 1: academic-materials (private)
-- Bucket 2: payment-proofs (private)

-- Policies for academic-materials bucket:
-- 1. Admins can upload/update/delete
CREATE POLICY "Admins can upload academic materials" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'academic-materials' AND
        public.is_admin()
    );

CREATE POLICY "Admins can update academic materials" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'academic-materials' AND
        public.is_admin()
    );

CREATE POLICY "Admins can delete academic materials" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'academic-materials' AND
        public.is_admin()
    );

-- CRITICAL: NO SELECT POLICY for academic-materials
-- Students CANNOT download directly - only via signed URLs from backend

-- Policies for payment-proofs bucket:
-- 1. Students can upload their own proofs
CREATE POLICY "Users can upload own payment proofs" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'payment-proofs' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

-- 2. Students can view their own proofs
CREATE POLICY "Users can view own payment proofs" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'payment-proofs' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

-- 3. Admins can view all proofs
CREATE POLICY "Admins can view all payment proofs" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'payment-proofs' AND
        public.is_admin()
    );
*/