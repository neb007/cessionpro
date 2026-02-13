-- Messaging acceptance workflow additions
-- Adds contact acceptance metadata to conversations

ALTER TABLE public.conversations
  ADD COLUMN IF NOT EXISTS contact_status TEXT DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS accepted_at timestamptz,
  ADD COLUMN IF NOT EXISTS accepted_by uuid REFERENCES auth.users(id);

CREATE INDEX IF NOT EXISTS idx_conversations_contact_status
  ON public.conversations (contact_status);