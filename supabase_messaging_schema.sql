-- Supabase Messaging Schema + RLS Policies

-- Extensions
create extension if not exists "uuid-ossp";

-- Conversations table
create table if not exists public.conversations (
  id uuid primary key default uuid_generate_v4(),
  participant_1_id uuid not null references auth.users(id) on delete cascade,
  participant_2_id uuid not null references auth.users(id) on delete cascade,
  business_id uuid,
  subject text,
  last_message text,
  last_message_date timestamptz,
  unread_count jsonb default '{}'::jsonb,
  archived_by jsonb default '[]'::jsonb,
  blocked_by jsonb default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint unique_conversation_pair_business unique (participant_1_id, participant_2_id, business_id)
);

-- Messages table
create table if not exists public.messages (
  id uuid primary key default uuid_generate_v4(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references auth.users(id) on delete cascade,
  receiver_id uuid not null references auth.users(id) on delete cascade,
  content text not null,
  read boolean default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz
);

-- Ensure columns exist when upgrading an existing schema
alter table public.messages add column if not exists sender_id uuid references auth.users(id) on delete cascade;
alter table public.messages add column if not exists receiver_id uuid references auth.users(id) on delete cascade;
alter table public.messages add column if not exists content text;
alter table public.messages add column if not exists read boolean default false;
alter table public.messages add column if not exists created_at timestamptz not null default now();
alter table public.messages add column if not exists updated_at timestamptz;
alter table public.conversations add column if not exists archived_by jsonb default '[]'::jsonb;
alter table public.conversations add column if not exists blocked_by jsonb default '[]'::jsonb;

-- Indexes
create index if not exists idx_conversations_updated_at on public.conversations (updated_at desc);
create index if not exists idx_conversations_participants on public.conversations (participant_1_id, participant_2_id);
create index if not exists idx_messages_conversation_id on public.messages (conversation_id);
create index if not exists idx_messages_receiver_id on public.messages (receiver_id);
create index if not exists idx_messages_created_at on public.messages (created_at desc);
create index if not exists idx_conversations_archived_by on public.conversations using gin (archived_by);
create index if not exists idx_conversations_blocked_by on public.conversations using gin (blocked_by);

-- Enable Row Level Security
alter table public.conversations enable row level security;
alter table public.messages enable row level security;

-- Conversations policies
drop policy if exists "conversations_select_own" on public.conversations;
drop policy if exists "conversations_insert_own" on public.conversations;
drop policy if exists "conversations_update_own" on public.conversations;
drop policy if exists "conversations_delete_own" on public.conversations;

create policy "conversations_select_own" on public.conversations
  for select
  using (
    auth.uid() = participant_1_id
    or auth.uid() = participant_2_id
  );

create policy "conversations_insert_own" on public.conversations
  for insert
  with check (
    auth.uid() = participant_1_id
    or auth.uid() = participant_2_id
  );

create policy "conversations_update_own" on public.conversations
  for update
  using (
    auth.uid() = participant_1_id
    or auth.uid() = participant_2_id
  );

create policy "conversations_delete_own" on public.conversations
  for delete
  using (
    auth.uid() = participant_1_id
    or auth.uid() = participant_2_id
  );

-- Messages policies
drop policy if exists "messages_select_own" on public.messages;
drop policy if exists "messages_insert_sender" on public.messages;
drop policy if exists "messages_update_own" on public.messages;
drop policy if exists "messages_delete_sender" on public.messages;

create policy "messages_select_own" on public.messages
  for select
  using (
    auth.uid() = sender_id
    or auth.uid() = receiver_id
  );

create policy "messages_insert_sender" on public.messages
  for insert
  with check (
    auth.uid() = sender_id
  );

create policy "messages_update_own" on public.messages
  for update
  using (
    auth.uid() = sender_id
    or auth.uid() = receiver_id
  );

create policy "messages_delete_sender" on public.messages
  for delete
  using (
    auth.uid() = sender_id
  );

-- Trigger to keep updated_at in conversations
create or replace function public.touch_conversation_updated_at()
returns trigger
language plpgsql
as $$
begin
  update public.conversations
  set updated_at = now()
  where id = new.conversation_id;
  return new;
end;
$$;

drop trigger if exists trg_touch_conversation_updated_at on public.messages;
create trigger trg_touch_conversation_updated_at
after insert on public.messages
for each row
execute function public.touch_conversation_updated_at();

-- Trigger to keep messages.updated_at
create or replace function public.set_message_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_set_message_updated_at on public.messages;
create trigger trg_set_message_updated_at
before update on public.messages
for each row
execute function public.set_message_updated_at();