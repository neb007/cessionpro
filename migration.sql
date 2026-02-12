-- Supabase Migration: Add missing columns to businesses table
-- Copy and paste this entire script into your Supabase SQL Editor and click Run

-- Add type column (cession/acquisition listing type)
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'cession';

-- Add buyer budget columns
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS buyer_budget_min DECIMAL(15, 2);
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS buyer_budget_max DECIMAL(15, 2);

-- Add buyer preference columns
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS buyer_sectors_interested TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS buyer_locations TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Add buyer size/scale columns
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS buyer_employees_min INTEGER;
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS buyer_employees_max INTEGER;

-- Add buyer financial columns
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS buyer_revenue_min DECIMAL(15, 2);
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS buyer_revenue_max DECIMAL(15, 2);
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS buyer_investment_available DECIMAL(15, 2);

-- Add buyer profile columns
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS buyer_profile_type TEXT;
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS buyer_notes TEXT;

-- Verify the columns were added successfully
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'businesses' 
  AND column_name IN (
    'type',
    'buyer_budget_min',
    'buyer_budget_max',
    'buyer_sectors_interested',
    'buyer_locations',
    'buyer_employees_min',
    'buyer_employees_max',
    'buyer_revenue_min',
    'buyer_revenue_max',
    'buyer_investment_available',
    'buyer_profile_type',
    'buyer_notes'
  )
ORDER BY column_name;
