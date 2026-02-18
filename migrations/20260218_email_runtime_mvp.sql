-- Email runtime MVP for conversation-based deal/doc/NDA notifications

-- Ensure uuid extension exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Conversation fields for lightweight runtime workflow
ALTER TABLE public.conversations
  ADD COLUMN IF NOT EXISTS deal_stage TEXT DEFAULT 'contact',
  ADD COLUMN IF NOT EXISTS nda_signed BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS nda_signed_at timestamptz,
  ADD COLUMN IF NOT EXISTS last_shared_document_name TEXT;

CREATE INDEX IF NOT EXISTS idx_conversations_deal_stage
  ON public.conversations (deal_stage);

CREATE INDEX IF NOT EXISTS idx_conversations_nda_signed
  ON public.conversations (nda_signed);

-- Event log for conversation workflow actions
CREATE TABLE IF NOT EXISTS public.conversation_events (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id uuid NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  actor_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  payload jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_conversation_events_conversation_type_created
  ON public.conversation_events (conversation_id, event_type, created_at DESC);

ALTER TABLE public.conversation_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "conversation_events_select_own" ON public.conversation_events;
CREATE POLICY "conversation_events_select_own" ON public.conversation_events
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM public.conversations c
      WHERE c.id = conversation_events.conversation_id
        AND (auth.uid() = c.participant_1_id OR auth.uid() = c.participant_2_id)
    )
  );

DROP POLICY IF EXISTS "conversation_events_insert_own" ON public.conversation_events;
CREATE POLICY "conversation_events_insert_own" ON public.conversation_events
  FOR INSERT
  WITH CHECK (
    auth.uid() = actor_id
    AND EXISTS (
      SELECT 1
      FROM public.conversations c
      WHERE c.id = conversation_events.conversation_id
        AND (auth.uid() = c.participant_1_id OR auth.uid() = c.participant_2_id)
    )
  );

-- Email dispatch observability and idempotency support
CREATE TABLE IF NOT EXISTS public.email_dispatch_logs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  recipient_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  recipient_email TEXT,
  source_id TEXT,
  idempotency_key TEXT,
  status TEXT NOT NULL,
  provider_id TEXT,
  error TEXT,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_email_dispatch_logs_event_created
  ON public.email_dispatch_logs (event_type, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_email_dispatch_logs_actor_event_created
  ON public.email_dispatch_logs (actor_id, event_type, created_at DESC);

CREATE UNIQUE INDEX IF NOT EXISTS idx_email_dispatch_logs_idempotency_sent
  ON public.email_dispatch_logs (idempotency_key)
  WHERE idempotency_key IS NOT NULL AND status = 'sent';

ALTER TABLE public.email_dispatch_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "email_dispatch_logs_select_own" ON public.email_dispatch_logs;
CREATE POLICY "email_dispatch_logs_select_own" ON public.email_dispatch_logs
  FOR SELECT
  USING (auth.uid() = actor_id);

DROP POLICY IF EXISTS "email_dispatch_logs_insert_own" ON public.email_dispatch_logs;
CREATE POLICY "email_dispatch_logs_insert_own" ON public.email_dispatch_logs
  FOR INSERT
  WITH CHECK (auth.uid() = actor_id);
