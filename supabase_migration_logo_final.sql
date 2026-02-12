-- Add logo fields to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS logo_url TEXT,
ADD COLUMN IF NOT EXISTS show_logo_in_listings BOOLEAN DEFAULT false;
