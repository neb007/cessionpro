-- Migration to add department field to businesses table
-- This allows filtering businesses by French departments

ALTER TABLE businesses ADD COLUMN IF NOT EXISTS department TEXT;

-- Create an index for better performance on department filtering
CREATE INDEX IF NOT EXISTS idx_businesses_department ON businesses(department);

-- Add comment to document the field
COMMENT ON COLUMN businesses.department IS 'French department code (e.g., 75 for Paris, 13 for Bouches-du-Rhône)';
