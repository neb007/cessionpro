-- Add optional fields for cession listings + messaging anonymity setting

ALTER TABLE businesses
ADD COLUMN IF NOT EXISTS cession_details TEXT,
ADD COLUMN IF NOT EXISTS surface_area TEXT,
ADD COLUMN IF NOT EXISTS show_cession_details BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS show_surface_area BOOLEAN DEFAULT false;

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS show_real_identity BOOLEAN DEFAULT true;