-- Migration: Add missing profile fields from registration form
-- This migration adds fields to store buyer/seller objectives and preferences

-- Add missing columns to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS user_goal TEXT DEFAULT NULL, -- 'buyer' or 'seller'
ADD COLUMN IF NOT EXISTS profile_type TEXT DEFAULT NULL, -- 'professional', 'consulting', 'investment_fund'
ADD COLUMN IF NOT EXISTS transaction_size TEXT DEFAULT NULL, -- 'less_1m', '1_5m', '5_10m', 'more_10m'
ADD COLUMN IF NOT EXISTS sectors TEXT[] DEFAULT ARRAY[]::TEXT[], -- Array of interested sectors
ADD COLUMN IF NOT EXISTS first_name TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS last_name TEXT DEFAULT NULL;

-- Create or replace the handle_new_user function to accept additional metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    email, 
    full_name,
    first_name,
    last_name,
    user_goal,
    profile_type,
    transaction_size,
    sectors
  )
  VALUES (
    NEW.id, 
    NEW.email, 
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    NEW.raw_user_meta_data->>'user_goal',
    NEW.raw_user_meta_data->>'profile_type',
    NEW.raw_user_meta_data->>'transaction_size',
    CASE 
      WHEN NEW.raw_user_meta_data->>'sectors' IS NOT NULL 
      THEN (NEW.raw_user_meta_data->>'sectors')::TEXT[]
      ELSE ARRAY[]::TEXT[]
    END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_profiles_user_goal ON profiles(user_goal);
CREATE INDEX IF NOT EXISTS idx_profiles_profile_type ON profiles(profile_type);
