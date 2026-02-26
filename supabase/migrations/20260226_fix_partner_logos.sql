-- Migration: Fix partner logo display
-- 1) Add logo_url column to profiles (missing from initial schema)
-- 2) Allow authenticated users to read all profiles (needed for partner logos)

-- Add logo_url column if not exists
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS logo_url TEXT;

-- Allow authenticated users to read all profiles
-- PostgreSQL RLS is OR-based: if ANY policy matches, the row is accessible
-- This works alongside the existing "Users can view their own profile" policy
DROP POLICY IF EXISTS "Authenticated users can view all profiles" ON public.profiles;
CREATE POLICY "Authenticated users can view all profiles"
  ON public.profiles FOR SELECT TO authenticated USING (true);
