-- Convert premium recurring products to one-shot payments
-- Keep existing prices unchanged

UPDATE public.billing_products
SET
  billing_mode = 'payment',
  billing_interval = NULL,
  updated_at = now()
WHERE product_code IN ('smart_matching', 'sponsored_listing', 'data_room');

-- Optional safety check
-- SELECT product_code, unit_amount_cents, billing_mode, billing_interval
-- FROM public.billing_products
-- WHERE product_code IN ('smart_matching', 'sponsored_listing', 'data_room');
