-- Sponsored listing pricing & runtime switch to day-based model
-- 1€ per day, consumed at activation time from My Listings

begin;

do $$
begin
  if to_regclass('public.billing_products') is not null then
    update public.billing_products
    set
      unit_amount_cents = 100,
      billing_mode = 'payment',
      billing_interval = null,
      display_name_fr = 'Annonce à la une (1 jour)',
      display_name_en = 'Featured listing (1 day)',
      updated_at = now()
    where product_code = 'sponsored_listing';
  end if;
end
$$;

do $$
begin
  if to_regclass('public.billing_entitlements') is not null then
    update public.billing_entitlements e
    set
      entitlement_type = 'credits',
      quantity_total = coalesce(e.quantity_total, 30),
      quantity_remaining = case
        when e.quantity_total is null then
          case
            when exists (
              select 1
              from public.billing_usage_logs u
              where u.entitlement_id = e.id
                and u.usage_type = 'sponsored_listing_activation'
            ) then 0
            else 30
          end
        else coalesce(e.quantity_remaining, e.quantity_total)
      end,
      updated_at = now()
    where e.product_code = 'sponsored_listing';
  end if;
end
$$;

drop index if exists idx_usage_logs_sponsored_activation_unique;

do $$
begin
  if to_regclass('public.billing_entitlements') is not null
     and to_regclass('public.billing_usage_logs') is not null then
    execute $drop_old$
      drop function if exists public.activate_sponsored_listing(uuid);
    $drop_old$;

    execute $activate$
      create or replace function public.activate_sponsored_listing(
        p_business_id uuid,
        p_days integer default 1
      )
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
        v_days integer := greatest(1, least(coalesce(p_days, 1), 365));
        v_days_remaining integer;
        v_available_days integer := 0;
        v_sponsorship public.business_sponsorships%rowtype;
        v_entitlement record;
        v_to_consume integer;
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

        select coalesce(sum(greatest(coalesce(e.quantity_remaining, 0), 0)), 0)::integer
        into v_available_days
        from public.billing_entitlements e
        where e.user_id = v_user_id
          and e.product_code = 'sponsored_listing'
          and e.status = 'active'
          and coalesce(e.quantity_remaining, 0) > 0
          and (e.expires_at is null or e.expires_at > now());

        if v_available_days < v_days then
          raise exception 'NO_SPONSORED_DAYS_AVAILABLE';
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
          null,
          'sponsored_listing',
          'À la une',
          'active',
          now(),
          now() + make_interval(days => v_days),
          now(),
          now()
        )
        returning * into v_sponsorship;

        v_days_remaining := v_days;

        for v_entitlement in
          select e.id, coalesce(e.quantity_remaining, 0)::integer as quantity_remaining
          from public.billing_entitlements e
          where e.user_id = v_user_id
            and e.product_code = 'sponsored_listing'
            and e.status = 'active'
            and coalesce(e.quantity_remaining, 0) > 0
            and (e.expires_at is null or e.expires_at > now())
          order by e.activated_at asc nulls last, e.created_at asc
          for update
        loop
          exit when v_days_remaining <= 0;

          v_to_consume := least(v_entitlement.quantity_remaining, v_days_remaining);

          if v_to_consume <= 0 then
            continue;
          end if;

          update public.billing_entitlements
          set
            quantity_remaining = quantity_remaining - v_to_consume,
            status = case
              when quantity_remaining - v_to_consume <= 0 then 'expired'
              else status
            end,
            updated_at = now()
          where id = v_entitlement.id;

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
            v_entitlement.id,
            'sponsored_listing',
            'sponsored_listing_days_consumed',
            v_to_consume,
            'business',
            p_business_id::text,
            jsonb_build_object(
              'display_label', 'À la une',
              'days_consumed', v_to_consume,
              'days_requested', v_days,
              'sponsorship_id', v_sponsorship.id
            )
          );

          v_days_remaining := v_days_remaining - v_to_consume;
        end loop;

        if v_days_remaining > 0 then
          raise exception 'NO_SPONSORED_DAYS_AVAILABLE';
        end if;

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

    execute $compat$
      create or replace function public.activate_sponsored_listing(p_business_id uuid)
      returns table (
        sponsorship_id uuid,
        business_id uuid,
        entitlement_id uuid,
        starts_at timestamptz,
        ends_at timestamptz,
        display_label text
      )
      language sql
      security definer
      set search_path = public
      as $body$
        select *
        from public.activate_sponsored_listing(p_business_id, 30);
      $body$;
    $compat$;
  else
    execute $fallback_new$
      create or replace function public.activate_sponsored_listing(
        p_business_id uuid,
        p_days integer default 1
      )
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
    $fallback_new$;

    execute $fallback_old$
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
    $fallback_old$;
  end if;
end
$$;

grant execute on function public.activate_sponsored_listing(uuid, integer) to authenticated;
grant execute on function public.activate_sponsored_listing(uuid) to authenticated;

commit;
