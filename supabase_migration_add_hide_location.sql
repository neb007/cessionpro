-- Add hide_location flag to businesses table
ALTER TABLE businesses
ADD COLUMN IF NOT EXISTS hide_location BOOLEAN DEFAULT FALSE;