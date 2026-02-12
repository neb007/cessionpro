-- Add show_logo_in_listings column to profiles table
ALTER TABLE profiles ADD COLUMN show_logo_in_listings BOOLEAN DEFAULT false;

-- Create index for faster queries
CREATE INDEX idx_profiles_show_logo_in_listings ON profiles(show_logo_in_listings);
