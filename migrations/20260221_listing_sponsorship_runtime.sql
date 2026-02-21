-- Listing sponsorship runtime model
-- 1 purchased sponsored pack = 1 listing activation for 30 days

begin;

create extension if not exists "uuid-ossp";

create table if not exists public.business_sponsorships (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  business_id uuid not null references public.businesses(id) on delete cascade,
  entitlement_id uuid,
  product_code text not null default 'sponsored_listing',
  display_label text not null default 'À la une',
  status text not null default 'active' check (status in ('active', 'expired', 'revoked')),
  starts_at timestamptz not null default now(),
  ends_at timestamptz not null default (now() + interval '30 days'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

do $$
begin
  if to_regclass('public.billing_entitlements') is not null
     and not exists (
       select 1
       from pg_constraint
       where conname = 'fk_business_sponsorships_entitlement'
     ) then
    alter table public.business_sponsorships
      add constraint fk_business_sponsorships_entitlement
      foreign key (entitlement_id)
      references public.billing_entitlements(id)
      on delete set null;
  end if;
end
$$;

create index if not exists idx_business_sponsorships_user_status
  on public.business_sponsorships (user_id, status, updated_at desc);

create index if not exists idx_business_sponsorships_business_status
  on public.business_sponsorships (business_id, status, ends_at desc);

do $$
begin
  if to_regclass('public.billing_usage_logs') is not null then
    create unique index if not exists idx_usage_logs_sponsored_activation_unique
      on public.billing_usage_logs (entitlement_id, usage_type)
      where usage_type = 'sponsored_listing_activation' and entitlement_id is not null;
  end if;
end
$$;

create unique index if not exists idx_business_sponsorships_entitlement_unique
  on public.business_sponsorships (entitlement_id)
  where entitlement_id is not null;

create unique index if not exists idx_business_sponsorships_active_business_unique
  on public.business_sponsorships (business_id)
  where status = 'active';

alter table public.business_sponsorships enable row level security;

drop policy if exists "business_sponsorships_select_public_active" on public.business_sponsorships;
create policy "business_sponsorships_select_public_active"
  on public.business_sponsorships
  for select
  using (
    status = 'active'
    and ends_at > now()
    and exists (
      select 1
      from public.businesses b
      where b.id = business_sponsorships.business_id
        and b.status = 'active'
    )
  );

drop policy if exists "business_sponsorships_select_own" on public.business_sponsorships;
create policy "business_sponsorships_select_own"
  on public.business_sponsorships
  for select to authenticated
  using (auth.uid() = user_id);

do $$
begin
  if to_regclass('public.billing_entitlements') is not null
     and to_regclass('public.billing_usage_logs') is not null then
    execute $activate$
      create or replace function public.activate_sponsored_listing(p_business_id uuid)
      returns table (
        sponsorship_id uuid,
        business_id uuid,
        entitlement_id uuid,
        starts_at timestamptz,
        ends_at timestamptz,
        display_label text
      )
      language plpgsql
      security definer
      set search_path = public
      as $body$
      declare
        v_user_id uuid;
        v_entitlement_id uuid;
        v_sponsorship public.business_sponsorships%rowtype;
      begin
        v_user_id := auth.uid();

        if v_user_id is null then
          raise exception 'AUTH_REQUIRED';
        end if;

        if not exists (
          select 1
          from public.businesses b
          where b.id = p_business_id
            and b.seller_id = v_user_id
        ) then
          raise exception 'BUSINESS_NOT_OWNED';
        end if;

        if not exists (
          select 1
          from public.businesses b
          where b.id = p_business_id
            and b.status = 'active'
        ) then
          raise exception 'BUSINESS_NOT_ACTIVE';
        end if;

        update public.business_sponsorships
        set status = 'expired',
            updated_at = now()
        where business_id = p_business_id
          and status = 'active'
          and ends_at <= now();

        if exists (
          select 1
          from public.business_sponsorships s
          where s.business_id = p_business_id
            and s.status = 'active'
            and s.ends_at > now()
        ) then
          raise exception 'BUSINESS_ALREADY_FEATURED';
        end if;

        select e.id
        into v_entitlement_id
        from public.billing_entitlements e
        where e.user_id = v_user_id
          and e.product_code = 'sponsored_listing'
          and e.entitlement_type = 'feature'
          and e.status = 'active'
          and not exists (
            select 1
            from public.billing_usage_logs u
            where u.entitlement_id = e.id
              and u.usage_type = 'sponsored_listing_activation'
          )
        order by e.updated_at desc, e.created_at desc
        limit 1
        for update;

        if v_entitlement_id is null then
          raise exception 'NO_SPONSORED_SLOT_AVAILABLE';
        end if;

        insert into public.business_sponsorships (
          user_id,
          business_id,
          entitlement_id,
          product_code,
          display_label,
          status,
          starts_at,
          ends_at,
          created_at,
          updated_at
        )
        values (
          v_user_id,
          p_business_id,
          v_entitlement_id,
          'sponsored_listing',
          'À la une',
          'active',
          now(),
          now() + interval '30 days',
          now(),
          now()
        )
        returning * into v_sponsorship;

        insert into public.billing_usage_logs (
          user_id,
          entitlement_id,
          product_code,
          usage_type,
          quantity,
          context_type,
          context_id,
          metadata
        )
        values (
          v_user_id,
          v_entitlement_id,
          'sponsored_listing',
          'sponsored_listing_activation',
          1,
          'business',
          p_business_id::text,
          jsonb_build_object(
            'display_label', 'À la une',
            'sponsorship_id', v_sponsorship.id
          )
        );

        return query
        select
          v_sponsorship.id,
          v_sponsorship.business_id,
          v_sponsorship.entitlement_id,
          v_sponsorship.starts_at,
          v_sponsorship.ends_at,
          v_sponsorship.display_label;
      end;
      $body$;
    $activate$;
  else
    execute $fallback$
      create or replace function public.activate_sponsored_listing(p_business_id uuid)
      returns table (
        sponsorship_id uuid,
        business_id uuid,
        entitlement_id uuid,
        starts_at timestamptz,
        ends_at timestamptz,
        display_label text
      )
      language plpgsql
      security definer
      set search_path = public
      as $body$
      begin
        raise exception 'BILLING_RUNTIME_UNAVAILABLE';
      end;
      $body$;
    $fallback$;
  end if;
end
$$;

grant execute on function public.activate_sponsored_listing(uuid) to authenticated;
grant select on public.business_sponsorships to anon, authenticated;

commit;
