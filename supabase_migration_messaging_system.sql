-- Messaging System Upgrade Migration
-- Adds support for modern messaging features: deal-flow, presence, reactions, etc.

-- Alter conversations table
ALTER TABLE conversations 
ADD COLUMN IF NOT EXISTS deal_stage TEXT DEFAULT 'contact',
ADD COLUMN IF NOT EXISTS anonymize_mode BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS buyer_pseudonym TEXT,
ADD COLUMN IF NOT EXISTS seller_pseudonym TEXT,
ADD COLUMN IF NOT EXISTS last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN DEFAULT FALSE;

-- Alter messages table
ALTER TABLE messages
ADD COLUMN IF NOT EXISTS message_type TEXT DEFAULT 'text',
ADD COLUMN IF NOT EXISTS reactions JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS edited_at TIMESTAMP WITH TIME ZONE;

-- Create user_presence table for real-time status
CREATE TABLE IF NOT EXISTS user_presence (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'offline', -- 'online', 'offline', 'away'
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  typing_in UUID REFERENCES conversations(id) ON DELETE SET NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create document_vault table
CREATE TABLE IF NOT EXISTS document_vault (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER,
  uploaded_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  requires_nda_signed BOOLEAN DEFAULT FALSE,
  is_signed BOOLEAN DEFAULT FALSE,
  signed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  signed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create deal_timeline table for tracking deal progression
CREATE TABLE IF NOT EXISTS deal_timeline (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  stage TEXT NOT NULL,
  status TEXT DEFAULT 'pending', -- 'pending', 'in_progress', 'completed'
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_conversations_deal_stage ON conversations(deal_stage);
CREATE INDEX IF NOT EXISTS idx_conversations_last_activity ON conversations(last_activity_at);
CREATE INDEX IF NOT EXISTS idx_messages_message_type ON messages(message_type);
CREATE INDEX IF NOT EXISTS idx_messages_pinned ON messages(is_pinned);
CREATE INDEX IF NOT EXISTS idx_user_presence_status ON user_presence(status);
CREATE INDEX IF NOT EXISTS idx_user_presence_typing ON user_presence(typing_in);
CREATE INDEX IF NOT EXISTS idx_document_vault_conversation ON document_vault(conversation_id);
CREATE INDEX IF NOT EXISTS idx_document_vault_uploaded_by ON document_vault(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_deal_timeline_conversation ON deal_timeline(conversation_id);
CREATE INDEX IF NOT EXISTS idx_deal_timeline_stage ON deal_timeline(stage);

-- Enable RLS
ALTER TABLE user_presence ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_vault ENABLE ROW LEVEL SECURITY;
ALTER TABLE deal_timeline ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_presence
CREATE POLICY "Users can view all presence data" ON user_presence
  FOR SELECT USING (TRUE);

CREATE POLICY "Users can update their own presence" ON user_presence
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own presence" ON user_presence
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for document_vault
CREATE POLICY "Users can view documents in their conversations" ON document_vault
  FOR SELECT USING (
    conversation_id IN (
      SELECT id FROM conversations 
      WHERE auth.uid() IN (participant_1_id, participant_2_id)
    )
  );

CREATE POLICY "Users can upload documents to their conversations" ON document_vault
  FOR INSERT WITH CHECK (
    auth.uid() = uploaded_by AND
    conversation_id IN (
      SELECT id FROM conversations 
      WHERE auth.uid() IN (participant_1_id, participant_2_id)
    )
  );

-- RLS Policies for deal_timeline
CREATE POLICY "Users can view deal timeline in their conversations" ON deal_timeline
  FOR SELECT USING (
    conversation_id IN (
      SELECT id FROM conversations 
      WHERE auth.uid() IN (participant_1_id, participant_2_id)
    )
  );

-- Create function to update conversation last_activity_at
CREATE OR REPLACE FUNCTION update_conversation_last_activity()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversations SET last_activity_at = CURRENT_TIMESTAMP 
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for messages
CREATE TRIGGER update_conversation_activity_on_message
AFTER INSERT ON messages
FOR EACH ROW
EXECUTE FUNCTION update_conversation_last_activity();

-- Create trigger for document uploads
CREATE TRIGGER update_conversation_activity_on_document
AFTER INSERT ON document_vault
FOR EACH ROW
EXECUTE FUNCTION update_conversation_last_activity();

-- Create function for cascade delete when conversation updates
CREATE OR REPLACE FUNCTION cleanup_presence_on_conversation_delete()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM user_presence WHERE typing_in = OLD.id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for cleanup
CREATE TRIGGER cleanup_presence_on_conversation_delete_trigger
BEFORE DELETE ON conversations
FOR EACH ROW
EXECUTE FUNCTION cleanup_presence_on_conversation_delete();
