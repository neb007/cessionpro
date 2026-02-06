-- Cessionpro Pricing System - Database Migration
-- Add credit and subscription columns to profiles table
-- Copy and paste this into Supabase SQL Editor and run

-- Add credit columns to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS photos_remaining_balance INTEGER DEFAULT 1;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS contact_credits_balance INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS total_photos_purchased INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS total_contacts_purchased INTEGER DEFAULT 0;

-- Add subscription columns
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS active_subscriptions JSONB DEFAULT '{}';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_expiry TIMESTAMP;

-- Add payment tracking columns (for future Stripe integration)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_payment_date TIMESTAMP;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS total_spent DECIMAL(15, 2) DEFAULT 0;

-- Create transactions table for credit purchases
CREATE TABLE IF NOT EXISTS credit_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('contact_purchase', 'photo_purchase', 'subscription', 'refund')),
  package_id TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  currency TEXT DEFAULT 'EUR',
  payment_method TEXT,
  stripe_payment_intent_id TEXT,
  status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create credit log table for audit trail
CREATE TABLE IF NOT EXISTS credit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  credit_type TEXT NOT NULL CHECK (credit_type IN ('photos', 'contacts')),
  amount_change INTEGER NOT NULL,
  previous_balance INTEGER NOT NULL,
  new_balance INTEGER NOT NULL,
  reason TEXT,
  business_id UUID REFERENCES businesses(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_credit_transactions_user ON credit_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_created ON credit_transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_credit_logs_user ON credit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_logs_created ON credit_logs(created_at);

-- Verify the columns were added successfully
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
  AND column_name IN (
    'photos_remaining_balance',
    'contact_credits_balance',
    'total_photos_purchased',
    'total_contacts_purchased',
    'active_subscriptions',
    'subscription_expiry',
    'stripe_customer_id',
    'last_payment_date',
    'total_spent'
  )
ORDER BY column_name;
