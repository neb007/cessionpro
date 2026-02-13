-- Add acquisition document fields to businesses
ALTER TABLE businesses
ADD COLUMN IF NOT EXISTS buyer_document_url text,
ADD COLUMN IF NOT EXISTS buyer_document_name text;