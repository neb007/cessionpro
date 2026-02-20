-- Billing entitlements runtime model
-- Adds server-side grants + usage logs for "Mes services actifs"

begin;

create extension if not exists "uuid-ossp";

create table if not exists public.billing_entitlements (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_code text not null,
  entitlement_type text not null check (entitlement_type in ('credits', 'feature')),
  quantity_total integer,
  quantity_remaining integer,
  status text not null default 'active' check (status in ('active', 'inactive', 'expired', 'revoked')),
  source_transaction_id uuid references public.billing_transactions(id) on delete set null,
  source_stripe_event_id text,
  activated_at timestamptz not null default now(),
  expires_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_billing_entitlements_user_status
  on public.billing_entitlements (user_id, status, updated_at desc);

create index if not exists idx_billing_entitlements_user_product
  on public.billing_entitlements (user_id, product_code);

-- Prevent duplicate grants for the same Stripe event + product
create unique index if not exists idx_billing_entitlements_event_product_unique
  on public.billing_entitlements (user_id, product_code, source_stripe_event_id);

create table if not exists public.billing_usage_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  entitlement_id uuid references public.billing_entitlements(id) on delete set null,
  product_code text,
  usage_type text not null,
  quantity integer not null default 1,
  context_type text,
  context_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_billing_usage_logs_user_created
  on public.billing_usage_logs (user_id, created_at desc);

alter table public.billing_entitlements enable row level security;
alter table public.billing_usage_logs enable row level security;

drop policy if exists "billing_entitlements_select_own" on public.billing_entitlements;
create policy "billing_entitlements_select_own" on public.billing_entitlements
  for select to authenticated
  using (auth.uid() = user_id);

drop policy if exists "billing_usage_logs_select_own" on public.billing_usage_logs;
create policy "billing_usage_logs_select_own" on public.billing_usage_logs
  for select to authenticated
  using (auth.uid() = user_id);

commit;
