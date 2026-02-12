-- Add logo_url and show_logo_in_listings to business table
ALTER TABLE business
ADD COLUMN IF NOT EXISTS logo_url TEXT,
ADD COLUMN IF NOT EXISTS show_logo_in_listings BOOLEAN DEFAULT false;

-- No default logos - users will upload their own
