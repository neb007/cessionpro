-- Smart Matching alert preferences (server-side mirror of localStorage)
-- Used by the smartmatch-digest cron to determine who gets emails and at what frequency.
create table if not exists smart_matching_alert_preferences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  mode text not null default 'buyer' check (mode in ('buyer', 'seller')),
  criteria jsonb not null default '{}'::jsonb,
  enabled boolean not null default false,
  frequency text not null default 'disabled' check (frequency in ('daily', 'weekly', 'disabled')),
  last_digest_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- One row per user per mode
  unique (user_id, mode)
);

create index if not exists idx_alert_prefs_user_id on smart_matching_alert_preferences(user_id);
create index if not exists idx_alert_prefs_active on smart_matching_alert_preferences(enabled, frequency)
  where enabled = true and frequency != 'disabled';

-- RLS policies
alter table smart_matching_alert_preferences enable row level security;

create policy "Users can view their own alert preferences"
  on smart_matching_alert_preferences for select
  using (auth.uid() = user_id);

create policy "Users can insert their own alert preferences"
  on smart_matching_alert_preferences for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own alert preferences"
  on smart_matching_alert_preferences for update
  using (auth.uid() = user_id);

create policy "Users can delete their own alert preferences"
  on smart_matching_alert_preferences for delete
  using (auth.uid() = user_id);
