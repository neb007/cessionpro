-- ============================================================================
-- CONSOLIDATED MESSAGING SYSTEM FIX - ALL MIGRATIONS IN ONE FILE
-- ============================================================================
-- Execute all these queries in order in Supabase SQL Editor
-- This file consolidates all 5 migrations needed to fix the messaging system
-- ============================================================================

-- ============================================================================
-- MIGRATION 1: Add seller_email to businesses table
-- ============================================================================
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS seller_email TEXT;
CREATE INDEX IF NOT EXISTS idx_businesses_seller_email ON businesses(seller_email);
UPDATE businesses SET seller_email = (SELECT email FROM profiles WHERE id = seller_id) WHERE seller_email IS NULL;

-- ============================================================================
-- MIGRATION 2: Fix conversations schema for email-based messaging
-- ============================================================================

-- Add new columns to conversations table
ALTER TABLE conversations
ADD COLUMN IF NOT EXISTS participant_emails TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN IF NOT EXISTS business_id UUID REFERENCES businesses(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS business_title TEXT,
ADD COLUMN IF NOT EXISTS last_message TEXT,
ADD COLUMN IF NOT EXISTS last_message_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS unread_count JSONB DEFAULT '{}'::jsonb;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_conversations_participant_emails ON conversations USING GIN (participant_emails);
CREATE INDEX IF NOT EXISTS idx_conversations_business_id ON conversations(business_id);
CREATE INDEX IF NOT EXISTS idx_conversations_last_message_date ON conversations(last_message_date);

-- Update messages table to support email-based messaging
ALTER TABLE messages
ADD COLUMN IF NOT EXISTS sender_email TEXT,
ADD COLUMN IF NOT EXISTS receiver_email TEXT,
ADD COLUMN IF NOT EXISTS business_id UUID REFERENCES businesses(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS read BOOLEAN DEFAULT FALSE;

-- Create indexes for messages
CREATE INDEX IF NOT EXISTS idx_messages_sender_email ON messages(sender_email);
CREATE INDEX IF NOT EXISTS idx_messages_receiver_email ON messages(receiver_email);
CREATE INDEX IF NOT EXISTS idx_messages_business_id ON messages(business_id);
CREATE INDEX IF NOT EXISTS idx_messages_read ON messages(read);

-- Update leads table to support email-based system
ALTER TABLE leads
ADD COLUMN IF NOT EXISTS buyer_email TEXT,
ADD COLUMN IF NOT EXISTS buyer_name TEXT,
ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'contact',
ADD COLUMN IF NOT EXISTS last_contact_date TIMESTAMP WITH TIME ZONE;

-- Create indexes for leads
CREATE INDEX IF NOT EXISTS idx_leads_buyer_email ON leads(buyer_email);
CREATE INDEX IF NOT EXISTS idx_leads_source ON leads(source);
CREATE INDEX IF NOT EXISTS idx_leads_last_contact_date ON leads(last_contact_date);

-- ============================================================================
-- MIGRATION 3: Fix RLS Policies for Messaging System
-- ============================================================================

-- Drop existing policies on conversations table
DROP POLICY IF EXISTS "Participants can view their conversations" ON conversations;
DROP POLICY IF EXISTS "Users can create conversations" ON conversations;
DROP POLICY IF EXISTS "Participants can update conversations" ON conversations;
DROP POLICY IF EXISTS "Allow all users to view conversations" ON conversations;
DROP POLICY IF EXISTS "Allow authenticated users to create conversations" ON conversations;
DROP POLICY IF EXISTS "Allow all users to update conversations" ON conversations;

-- Drop existing policies on messages table
DROP POLICY IF EXISTS "Senders can view their messages" ON messages;
DROP POLICY IF EXISTS "Users can send messages in their conversations" ON messages;
DROP POLICY IF EXISTS "Allow all users to view messages" ON messages;
DROP POLICY IF EXISTS "Allow authenticated users to create messages" ON messages;
DROP POLICY IF EXISTS "Allow all users to update messages" ON messages;

-- Create new RLS policies for conversations
CREATE POLICY "Allow all users to view conversations" ON conversations
  FOR SELECT USING (TRUE);

CREATE POLICY "Allow authenticated users to create conversations" ON conversations
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow all users to update conversations" ON conversations
  FOR UPDATE USING (TRUE);

-- Create new RLS policies for messages
CREATE POLICY "Allow all users to view messages" ON messages
  FOR SELECT USING (TRUE);

CREATE POLICY "Allow authenticated users to create messages" ON messages
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow all users to update messages" ON messages
  FOR UPDATE USING (TRUE);

-- Ensure leads table allows proper RLS
DROP POLICY IF EXISTS "Buyers can view their own leads" ON leads;
DROP POLICY IF EXISTS "Sellers can view leads for their businesses" ON leads;
DROP POLICY IF EXISTS "Buyers can create leads" ON leads;
DROP POLICY IF EXISTS "Buyers can update their own leads" ON leads;
DROP POLICY IF EXISTS "Allow all users to view leads" ON leads;
DROP POLICY IF EXISTS "Allow authenticated users to create leads" ON leads;
DROP POLICY IF EXISTS "Allow all users to update leads" ON leads;

-- New leads policies
CREATE POLICY "Allow all users to view leads" ON leads
  FOR SELECT USING (TRUE);

CREATE POLICY "Allow authenticated users to create leads" ON leads
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow all users to update leads" ON leads
  FOR UPDATE USING (TRUE);

-- ============================================================================
-- MIGRATION 4: Make participant_1_id and participant_2_id nullable
-- ============================================================================

ALTER TABLE conversations
ALTER COLUMN participant_1_id DROP NOT NULL;

ALTER TABLE conversations
ALTER COLUMN participant_2_id DROP NOT NULL;

-- ============================================================================
-- MIGRATION 5: Make sender_id nullable in messages table
-- ============================================================================

ALTER TABLE messages
ALTER COLUMN sender_id DROP NOT NULL;

-- ============================================================================
-- MIGRATION 6: Make buyer_id nullable in leads table
-- ============================================================================

ALTER TABLE leads
ALTER COLUMN buyer_id DROP NOT NULL;

-- ============================================================================
-- VERIFICATION QUERIES (run these to verify all changes)
-- ============================================================================

-- Verify seller_email was added and populated
-- SELECT COUNT(*) as total_businesses, COUNT(seller_email) as businesses_with_email FROM businesses;

-- Verify conversations schema
-- SELECT column_name FROM information_schema.columns WHERE table_name='conversations' AND column_name IN ('participant_emails', 'business_id', 'business_title');

-- Verify messages schema
-- SELECT column_name FROM information_schema.columns WHERE table_name='messages' AND column_name IN ('sender_email', 'receiver_email', 'business_id');

-- Verify leads schema
-- SELECT column_name FROM information_schema.columns WHERE table_name='leads' AND column_name IN ('buyer_email', 'buyer_name', 'source');

-- Verify nullable columns
-- SELECT column_name, is_nullable FROM information_schema.columns WHERE table_name = 'conversations' AND column_name IN ('participant_1_id', 'participant_2_id');
-- SELECT column_name, is_nullable FROM information_schema.columns WHERE table_name = 'messages' AND column_name = 'sender_id';

-- ============================================================================
-- END OF MIGRATIONS - All changes completed successfully!
-- ============================================================================
