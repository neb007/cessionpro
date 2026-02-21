-- Add sell-side business type to align cession form with smart matching criteria

ALTER TABLE businesses
ADD COLUMN IF NOT EXISTS seller_business_type TEXT;

-- Optional data consistency note:
-- seller_business_type is expected to use values:
-- 'entreprise', 'fond_de_commerce', 'franchise'
