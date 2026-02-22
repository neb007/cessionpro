-- Add unique reference numbering constraints

ALTER TABLE public.businesses
  ADD COLUMN IF NOT EXISTS reference_number text;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'businesses_reference_number_unique'
  ) THEN
    ALTER TABLE public.businesses
      ADD CONSTRAINT businesses_reference_number_unique UNIQUE (reference_number);
  END IF;
END $$;

