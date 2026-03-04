-- Function to increment business views count
-- Uses SECURITY DEFINER to bypass RLS (any visitor can increment the counter)
CREATE OR REPLACE FUNCTION increment_business_views(p_business_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE businesses
  SET views_count = COALESCE(views_count, 0) + 1
  WHERE id = p_business_id;
END;
$$;

-- Allow both anonymous visitors and authenticated users to call this function
GRANT EXECUTE ON FUNCTION increment_business_views(UUID) TO anon, authenticated;
