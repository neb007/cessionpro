-- Migration: Add support for hybrid profiles (buyer + seller simultaneously)
-- This allows users to act as both buyers and sellers at the same time

-- Add boolean columns to track user roles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS 
is_buyer BOOLEAN DEFAULT false;

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS 
is_seller BOOLEAN DEFAULT false;

-- Migration: Enable old profiles based on user_goal if it exists
-- This data migration will convert existing user_goal values to boolean flags
DO $$
BEGIN
  -- If user_goal column exists, migrate the data
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'user_goal') THEN
    UPDATE profiles 
    SET 
      is_buyer = CASE WHEN user_goal = 'buyer' THEN true ELSE false END,
      is_seller = CASE WHEN user_goal = 'seller' THEN true ELSE false END
    WHERE (is_buyer = false OR is_buyer IS NULL) AND (is_seller = false OR is_seller IS NULL);
  END IF;
END $$;

-- Ensure all existing profiles have at least one role enabled (default to seller if neither is set)
UPDATE profiles 
SET is_seller = true 
WHERE (is_buyer = false OR is_buyer IS NULL) AND (is_seller = false OR is_seller IS NULL);

-- Create index for efficient filtering by role
CREATE INDEX IF NOT EXISTS idx_profiles_is_buyer ON profiles(is_buyer);
CREATE INDEX IF NOT EXISTS idx_profiles_is_seller ON profiles(is_seller);

-- Create composite index for hybrid profile queries
CREATE INDEX IF NOT EXISTS idx_profiles_buyer_seller ON profiles(is_buyer, is_seller);

-- Add check constraint to ensure at least one role is enabled (AFTER data cleanup)
ALTER TABLE profiles ADD CONSTRAINT at_least_one_role 
CHECK (is_buyer = true OR is_seller = true);
