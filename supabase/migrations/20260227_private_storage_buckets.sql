-- Migration: Make Cession, profile, and dataroom buckets private with RLS
-- Date: 2026-02-27

-- ============================================
-- 1. Set buckets to private (public = false)
-- ============================================
UPDATE storage.buckets SET public = false WHERE id = 'Cession';
UPDATE storage.buckets SET public = false WHERE id = 'profile';

-- Create dataroom bucket as private (if not exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('dataroom', 'dataroom', false)
ON CONFLICT (id) DO UPDATE SET public = false;

-- ============================================
-- 2. RLS Policies for "Cession" bucket
--    Any authenticated user can read/write/delete
-- ============================================
CREATE POLICY "auth_select_cession" ON storage.objects FOR SELECT
USING (bucket_id = 'Cession' AND auth.role() = 'authenticated');

CREATE POLICY "auth_insert_cession" ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'Cession' AND auth.role() = 'authenticated');

CREATE POLICY "auth_delete_cession" ON storage.objects FOR DELETE
USING (bucket_id = 'Cession' AND auth.role() = 'authenticated');

-- ============================================
-- 3. RLS Policies for "profile" bucket
--    Users can only access their own files
--    (path starts with their user ID)
-- ============================================
CREATE POLICY "own_select_profile" ON storage.objects FOR SELECT
USING (bucket_id = 'profile' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "own_insert_profile" ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'profile' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "own_delete_profile" ON storage.objects FOR DELETE
USING (bucket_id = 'profile' AND auth.uid()::text = (storage.foldername(name))[1]);

-- ============================================
-- 4. RLS Policies for "dataroom" bucket
--    Users can only access their own files
-- ============================================
CREATE POLICY "own_select_dataroom" ON storage.objects FOR SELECT
USING (bucket_id = 'dataroom' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "own_insert_dataroom" ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'dataroom' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "own_delete_dataroom" ON storage.objects FOR DELETE
USING (bucket_id = 'dataroom' AND auth.uid()::text = (storage.foldername(name))[1]);
