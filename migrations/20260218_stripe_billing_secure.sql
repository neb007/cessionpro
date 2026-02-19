-- Stripe billing secure schema
-- Focus: strong server-side validation, webhook idempotence, auditable billing history

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Stripe customer mapping
CREATE TABLE IF NOT EXISTS public.billing_customers (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id text NOT NULL UNIQUE,
  email text,
  full_name text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_billing_customers_user ON public.billing_customers (user_id);
CREATE INDEX IF NOT EXISTS idx_billing_customers_email ON public.billing_customers (email);

-- Internal product catalog (server-side source of truth)
CREATE TABLE IF NOT EXISTS public.billing_products (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_code text NOT NULL UNIQUE,
  display_name_fr text NOT NULL,
  display_name_en text NOT NULL,
  currency text NOT NULL DEFAULT 'eur',
  unit_amount_cents integer NOT NULL CHECK (unit_amount_cents >= 0),
  billing_mode text NOT NULL CHECK (billing_mode IN ('payment', 'subscription')),
  billing_interval text CHECK (billing_interval IN ('month', 'year')),
  stripe_price_id text UNIQUE,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_billing_products_active ON public.billing_products (is_active);

INSERT INTO public.billing_products (
  product_code,
  display_name_fr,
  display_name_en,
  currency,
  unit_amount_cents,
  billing_mode,
  billing_interval,
  stripe_price_id,
  is_active
) VALUES
  ('photos_pack5', 'Pack 5 Photos', 'Pack 5 Photos', 'eur', 1499, 'payment', NULL, NULL, true),
  ('photos_pack15', 'Pack 15 Photos', 'Pack 15 Photos', 'eur', 2999, 'payment', NULL, NULL, true),
  ('contact_unit', 'Contact à l''unité', 'Single Contact', 'eur', 1999, 'payment', NULL, NULL, true),
  ('contact_pack5', 'Pack 5 Contacts', 'Pack 5 Contacts', 'eur', 7900, 'payment', NULL, NULL, true),
  ('contact_pack8', 'Pack 8 Contacts', 'Pack 8 Contacts', 'eur', 11900, 'payment', NULL, NULL, true),
  ('contact_pack10', 'Pack 10 Contacts', 'Pack 10 Contacts', 'eur', 15900, 'payment', NULL, NULL, true),
  ('smart_matching', 'Smart Matching Intelligent', 'Smart Matching AI', 'eur', 3999, 'subscription', 'month', NULL, true),
  ('sponsored_listing', 'Annonce sponsorisée', 'Sponsored listing', 'eur', 2999, 'subscription', 'month', NULL, true),
  ('data_room', 'Data Room Sécurisée', 'Secure Data Room', 'eur', 1999, 'subscription', 'year', NULL, false),
  ('nda_protection', 'Protection NDA', 'NDA Protection', 'eur', 3999, 'payment', NULL, NULL, false)
ON CONFLICT (product_code) DO UPDATE
SET
  display_name_fr = EXCLUDED.display_name_fr,
  display_name_en = EXCLUDED.display_name_en,
  currency = EXCLUDED.currency,
  unit_amount_cents = EXCLUDED.unit_amount_cents,
  billing_mode = EXCLUDED.billing_mode,
  billing_interval = EXCLUDED.billing_interval,
  is_active = EXCLUDED.is_active,
  updated_at = now();

-- Checkout sessions created by backend
CREATE TABLE IF NOT EXISTS public.billing_checkout_sessions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_checkout_session_id text NOT NULL UNIQUE,
  stripe_customer_id text,
  mode text NOT NULL CHECK (mode IN ('payment', 'subscription')),
  status text NOT NULL,
  currency text,
  amount_total_cents integer,
  item_codes text[] NOT NULL DEFAULT '{}',
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_billing_checkout_sessions_user_created
  ON public.billing_checkout_sessions (user_id, created_at DESC);

-- Payment transactions (one-shot and invoices)
CREATE TABLE IF NOT EXISTS public.billing_transactions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  stripe_checkout_session_id text,
  stripe_payment_intent_id text UNIQUE,
  stripe_invoice_id text UNIQUE,
  stripe_charge_id text,
  stripe_customer_id text,
  stripe_event_id text,
  status text NOT NULL,
  currency text,
  amount_paid_cents integer,
  item_codes text[] NOT NULL DEFAULT '{}',
  invoice_url text,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_billing_transactions_user_created
  ON public.billing_transactions (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_billing_transactions_event
  ON public.billing_transactions (stripe_event_id);

-- Subscription lifecycle snapshots
CREATE TABLE IF NOT EXISTS public.billing_subscriptions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  stripe_subscription_id text NOT NULL UNIQUE,
  stripe_customer_id text,
  stripe_price_id text,
  status text NOT NULL,
  cancel_at_period_end boolean NOT NULL DEFAULT false,
  current_period_start timestamptz,
  current_period_end timestamptz,
  canceled_at timestamptz,
  ended_at timestamptz,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_billing_subscriptions_user_updated
  ON public.billing_subscriptions (user_id, updated_at DESC);

-- Webhook idempotence + audit trail
CREATE TABLE IF NOT EXISTS public.billing_webhook_events (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id text NOT NULL UNIQUE,
  event_type text NOT NULL,
  processing_status text NOT NULL DEFAULT 'processing' CHECK (processing_status IN ('processing', 'processed', 'failed', 'ignored')),
  error text,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  received_at timestamptz NOT NULL DEFAULT now(),
  processed_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_billing_webhook_events_type_received
  ON public.billing_webhook_events (event_type, received_at DESC);

-- Optional abuse monitoring for checkout/portal endpoints
CREATE TABLE IF NOT EXISTS public.billing_security_events (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  event_type text NOT NULL,
  ip text,
  user_agent text,
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_billing_security_events_user_type_created
  ON public.billing_security_events (user_id, event_type, created_at DESC);

-- Row Level Security
ALTER TABLE public.billing_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_checkout_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_webhook_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_security_events ENABLE ROW LEVEL SECURITY;

-- Customers: users can view own billing customer mapping only
DROP POLICY IF EXISTS "billing_customers_select_own" ON public.billing_customers;
CREATE POLICY "billing_customers_select_own" ON public.billing_customers
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Products: authenticated users can read active catalog
DROP POLICY IF EXISTS "billing_products_select_active" ON public.billing_products;
CREATE POLICY "billing_products_select_active" ON public.billing_products
  FOR SELECT TO authenticated
  USING (is_active = true);

-- Checkout sessions: users can read own sessions
DROP POLICY IF EXISTS "billing_checkout_sessions_select_own" ON public.billing_checkout_sessions;
CREATE POLICY "billing_checkout_sessions_select_own" ON public.billing_checkout_sessions
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Transactions: users can read own transactions
DROP POLICY IF EXISTS "billing_transactions_select_own" ON public.billing_transactions;
CREATE POLICY "billing_transactions_select_own" ON public.billing_transactions
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Subscriptions: users can read own subscription state
DROP POLICY IF EXISTS "billing_subscriptions_select_own" ON public.billing_subscriptions;
CREATE POLICY "billing_subscriptions_select_own" ON public.billing_subscriptions
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Webhook and security tables are private (service role only)
DROP POLICY IF EXISTS "billing_webhook_events_no_client_access" ON public.billing_webhook_events;
CREATE POLICY "billing_webhook_events_no_client_access" ON public.billing_webhook_events
  FOR SELECT TO authenticated
  USING (false);

DROP POLICY IF EXISTS "billing_security_events_no_client_access" ON public.billing_security_events;
CREATE POLICY "billing_security_events_no_client_access" ON public.billing_security_events
  FOR SELECT TO authenticated
  USING (false);
