-- Supabase Migration: Add missing profile fields
-- This migration adds additional profile fields needed for the Profile page

-- Add missing columns to profiles table if they don't exist
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS sectors_interest TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS budget_min DECIMAL(15, 2);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS budget_max DECIMAL(15, 2);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS experience TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS visible_in_directory BOOLEAN DEFAULT TRUE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS preferred_language TEXT DEFAULT 'fr';

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_profiles_sectors_interest ON profiles USING gin(sectors_interest);
CREATE INDEX IF NOT EXISTS idx_profiles_visible ON profiles(visible_in_directory);
