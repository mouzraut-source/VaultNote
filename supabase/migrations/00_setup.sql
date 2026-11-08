-- ==========================================
-- 00_SETUP.SQL - Complete database setup with permissions
-- Run this in Supabase SQL Editor if RLS issues persist
-- ==========================================

-- Grant basic SELECT permissions on tables (required for RLS to work)
GRANT SELECT ON public.profiles TO authenticated;
GRANT SELECT ON public.purchases TO authenticated;
GRANT SELECT ON public.payment_submissions TO authenticated;
GRANT SELECT ON public.products TO authenticated;

-- Create the admin-checking function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role = 'admin'
    );
$$;

-- Grant execute permissions on SECURITY DEFINER functions
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO authenticated;

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_submissions ENABLE ROW LEVEL SECURITY;

-- Profiles policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles" ON public.profiles
    FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
CREATE POLICY "Admins can update all profiles" ON public.profiles
    FOR UPDATE USING (public.is_admin());

-- Purchases policies
DROP POLICY IF EXISTS "Users can view own purchases" ON public.purchases;
CREATE POLICY "Users can view own purchases" ON public.purchases
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all purchases" ON public.purchases;
CREATE POLICY "Admins can view all purchases" ON public.purchases
    FOR SELECT USING (public.is_admin());

-- Payment submissions policies
DROP POLICY IF EXISTS "Users can view own submissions" ON public.payment_submissions;
CREATE POLICY "Users can view own submissions" ON public.payment_submissions
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all submissions" ON public.payment_submissions;
CREATE POLICY "Admins can view all submissions" ON public.payment_submissions
    FOR SELECT USING (public.is_admin());

-- ==========================================
-- To make a user an admin, run:
-- ==========================================
-- UPDATE public.profiles SET role = 'admin' WHERE email = 'your-admin-email@example.com';