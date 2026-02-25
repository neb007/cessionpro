-- Add columns for partner listing imports

ALTER TABLE businesses
  ADD COLUMN IF NOT EXISTS external_url TEXT,
  ADD COLUMN IF NOT EXISTS department TEXT,
  ADD COLUMN IF NOT EXISTS hide_location BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS business_type TEXT,
  ADD COLUMN IF NOT EXISTS concurrence TEXT;
