-- Seed file for development/testing
-- Run this after all migrations in Supabase SQL Editor

-- Insert a test admin user (replace with actual auth user ID after signup)
-- First, sign up a user through the app, then run:
-- UPDATE public.profiles SET role = 'admin' WHERE email = 'your-admin-email@example.com';

-- Sample products (run after creating admin user and getting their ID)
/*
INSERT INTO public.products (title, description, subject, price, is_active) VALUES
(
    'Physics Question Bank 2024 - Complete Solutions',
    'Comprehensive answer key for Physics question bank covering Mechanics, Thermodynamics, Electromagnetism, and Modern Physics. Includes step-by-step solutions for all 500+ questions.',
    'Physics',
    29900, -- ₹299 in paise
    TRUE
),
(
    'Mathematics Advanced Problems - Solutions Manual',
    'Detailed solutions for advanced mathematics problems including Calculus, Linear Algebra, Probability, and Statistics. Perfect for JEE Advanced preparation.',
    'Mathematics',
    39900, -- ₹399 in paise
    TRUE
),
(
    'Chemistry Organic & Inorganic - Answer Key',
    'Complete answer key for Chemistry question bank covering Organic Chemistry reactions, Inorganic Chemistry concepts, and Physical Chemistry numericals.',
    'Chemistry',
    34900, -- ₹349 in paise
    TRUE
);
*/