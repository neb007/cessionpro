-- Admin RLS setup for businesses (announcements)
-- Requires public.is_admin() function from admin_rls_profiles.sql

-- Admins can read all businesses
DROP POLICY IF EXISTS "Admins can view all businesses" ON public.businesses;
CREATE POLICY "Admins can view all businesses" ON public.businesses
  FOR SELECT
  USING (public.is_admin());

-- Admins can update any business (moderation actions)
DROP POLICY IF EXISTS "Admins can update all businesses" ON public.businesses;
CREATE POLICY "Admins can update all businesses" ON public.businesses
  FOR UPDATE
  USING (public.is_admin());

-- Admins can delete any business if needed
DROP POLICY IF EXISTS "Admins can delete all businesses" ON public.businesses;
CREATE POLICY "Admins can delete all businesses" ON public.businesses
  FOR DELETE
  USING (public.is_admin());