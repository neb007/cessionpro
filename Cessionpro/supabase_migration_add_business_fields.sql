-- Migration: add business metadata fields (reference_number, business_type, type)
-- Run this script against your Supabase database after updating the frontend

ALTER TABLE businesses
  ADD COLUMN IF NOT EXISTS reference_number TEXT,
  ADD COLUMN IF NOT EXISTS business_type TEXT,
  ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'cession';

-- Backfill missing values for legacy rows
WITH ordered AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at, id) AS seq
  FROM businesses
)
UPDATE businesses b
SET reference_number = 'REF-' || LPAD(ordered.seq::text, 4, '0')
FROM ordered
WHERE b.id = ordered.id
  AND (b.reference_number IS NULL OR b.reference_number = '');

UPDATE businesses
SET type = COALESCE(type, 'cession');

UPDATE businesses
SET business_type = COALESCE(business_type, 'entreprise');