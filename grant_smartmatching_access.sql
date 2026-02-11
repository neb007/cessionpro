-- Grant Smart Matching Plan Access to Current User
-- Run this SQL in Supabase SQL Editor

-- Update user subscription
UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
  raw_user_meta_data,
  '{plan}',
  '"smart_matching"'::jsonb
)
WHERE email = 'nebil007@hotmail.fr';

-- Update profile with Smart Matching plan
UPDATE public.profiles
SET 
  subscription_tier = 'premium_plus',
  plan_type = 'smart_matching',
  access_level = 'admin',
  credits = 999999,
  credits_monthly = 999999,
  features = jsonb_build_object(
    'has_smartmatching', true,
    'has_messaging', true,
    'has_favorites', true,
    'unlimited_listings', true
  ),
  updated_at = now()
WHERE email = 'nebil007@hotmail.fr';

-- Verify the update
SELECT 
  id,
  email,
  subscription_tier,
  plan_type,
  access_level,
  features
FROM public.profiles
WHERE email = 'nebil007@hotmail.fr';
