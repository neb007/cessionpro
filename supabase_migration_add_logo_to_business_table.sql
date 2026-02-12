-- Add logo fields to business table
ALTER TABLE business
ADD COLUMN IF NOT EXISTS logo_url TEXT,
ADD COLUMN IF NOT EXISTS show_logo_in_listings BOOLEAN DEFAULT false;
