-- Migration: Add buyer and seller profile fields
-- This adds detailed profile information for buyers and sellers

-- Add columns to profiles table for buyer-specific information
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS 
motivation_reprise TEXT;

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS 
experience_professionnelle TEXT;

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS 
aide_vendeur_description TEXT;

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS 
linkedin_url TEXT;

-- Document URLs (stored in Supabase Storage bucket: profile)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS 
cv_document_url TEXT;

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS 
financing_document_url TEXT;

-- Original document names for display
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS 
cv_document_name TEXT;

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS 
financing_document_name TEXT;

-- Timestamps for document uploads
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS 
cv_uploaded_at TIMESTAMP WITH TIME ZONE;

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS 
financing_uploaded_at TIMESTAMP WITH TIME ZONE;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_profiles_user_goal ON profiles(user_goal);
CREATE INDEX IF NOT EXISTS idx_profiles_cv_uploaded ON profiles(cv_uploaded_at);
CREATE INDEX IF NOT EXISTS idx_profiles_financing_uploaded ON profiles(financing_uploaded_at);

-- Create or update trigger for updated_at column if not exists
CREATE OR REPLACE FUNCTION update_profile_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_profiles_timestamp ON profiles;
CREATE TRIGGER update_profiles_timestamp
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_profile_timestamp();
