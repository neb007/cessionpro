-- Add business_type_sought column for acquisition listings
ALTER TABLE businesses
ADD COLUMN IF NOT EXISTS business_type_sought text;