ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS subscription_tier VARCHAR DEFAULT 'free',
ADD COLUMN IF NOT EXISTS plan_type VARCHAR DEFAULT 'basic',
ADD COLUMN IF NOT EXISTS access_level VARCHAR DEFAULT 'user',
ADD COLUMN IF NOT EXISTS credits INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS credits_monthly INTEGER DEFAULT 0;

UPDATE profiles
SET 
  subscription_tier = 'premium_plus',
  plan_type = 'all_plans',
  access_level = 'admin',
  credits = 999999,
  credits_monthly = 999999,
  updated_at = now()
WHERE email = 'nebil007@hotmail.fr';

SELECT 
  id,
  email,
  subscription_tier,
  plan_type,
  access_level,
  credits
FROM profiles
WHERE email = 'nebil007@hotmail.fr';
