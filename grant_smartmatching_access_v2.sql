-- Grant Smart Matching Plan Access - VERSION CORRIGÉE
-- Exécutez dans Supabase SQL Editor

-- D'abord, vérifier les colonnes disponibles
-- SELECT column_name FROM information_schema.columns WHERE table_name = 'profiles';

-- Mise à jour simplifiée sans la colonne 'features'
UPDATE public.profiles
SET 
  subscription_tier = 'premium_plus',
  plan_type = 'smart_matching',
  access_level = 'admin',
  credits = 999999,
  credits_monthly = 999999,
  updated_at = now()
WHERE email = 'nebil007@hotmail.fr';

-- Vérifier la mise à jour
SELECT 
  id,
  email,
  subscription_tier,
  plan_type,
  access_level,
  credits,
  credits_monthly
FROM public.profiles
WHERE email = 'nebil007@hotmail.fr';
