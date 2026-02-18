-- Harden email dispatch logging reliability
-- Goal: prevent silent logging drops while keeping delivery non-blocking

begin;

-- Relax FK constraints that can reject valid runtime events when ids are missing
-- in auth.users (legacy data, admin-triggered flows, or async contexts).
alter table public.email_dispatch_logs
  drop constraint if exists email_dispatch_logs_actor_id_fkey;

alter table public.email_dispatch_logs
  drop constraint if exists email_dispatch_logs_recipient_id_fkey;

-- Ensure status values stay consistent for observability and analytics.
do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'email_dispatch_logs_status_check'
      and conrelid = 'public.email_dispatch_logs'::regclass
  ) then
    alter table public.email_dispatch_logs
      add constraint email_dispatch_logs_status_check
      check (status in ('sent', 'skipped', 'failed'));
  end if;
end$$;

-- Extra indexes for quick troubleshooting dashboards/queries.
create index if not exists idx_email_dispatch_logs_created_at_desc
  on public.email_dispatch_logs (created_at desc);

create index if not exists idx_email_dispatch_logs_status_created
  on public.email_dispatch_logs (status, created_at desc);

create index if not exists idx_email_dispatch_logs_recipient_created
  on public.email_dispatch_logs (recipient_email, created_at desc);

commit;
