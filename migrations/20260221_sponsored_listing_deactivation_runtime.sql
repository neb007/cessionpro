-- Sponsored listing manual deactivation runtime
-- Deactivation refunds remaining whole days to sponsored day balance

begin;

do $$
begin
  if to_regclass('public.business_sponsorships') is not null
     and to_regclass('public.billing_entitlements') is not null
     and to_regclass('public.billing_usage_logs') is not null then
    execute $full$
      create or replace function public.deactivate_sponsored_listing(p_business_id uuid)
      returns table (
        sponsorship_id uuid,
        business_id uuid,
        refunded_days integer,
        ended_at timestamptz,
        display_label text
      )
      language plpgsql
      security definer
      set search_path = public
      as $body$
      declare
        v_user_id uuid;
        v_sponsorship public.business_sponsorships%rowtype;
        v_refundable_days integer := 0;
        v_refund_entitlement_id uuid;
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

        update public.business_sponsorships
        set status = 'expired',
            updated_at = now()
        where business_id = p_business_id
          and user_id = v_user_id
          and status = 'active'
          and ends_at <= now();

        select s.*
        into v_sponsorship
        from public.business_sponsorships s
        where s.business_id = p_business_id
          and s.user_id = v_user_id
          and s.status = 'active'
          and s.ends_at > now()
        order by s.updated_at desc, s.created_at desc
        limit 1
        for update;

        if v_sponsorship.id is null then
          raise exception 'SPONSORSHIP_NOT_ACTIVE';
        end if;

        v_refundable_days := greatest(
          floor(extract(epoch from (v_sponsorship.ends_at - now())) / 86400)::integer,
          0
        );

        if v_refundable_days > 0 then
          insert into public.billing_entitlements (
            user_id,
            product_code,
            entitlement_type,
            quantity_total,
            quantity_remaining,
            status,
            activated_at,
            metadata,
            created_at,
            updated_at
          )
          values (
            v_user_id,
            'sponsored_listing',
            'credits',
            v_refundable_days,
            v_refundable_days,
            'active',
            now(),
            jsonb_build_object(
              'grant_origin', 'sponsored_listing_deactivation_refund',
              'source_sponsorship_id', v_sponsorship.id,
              'business_id', p_business_id
            ),
            now(),
            now()
          )
          returning id into v_refund_entitlement_id;

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
            v_refund_entitlement_id,
            'sponsored_listing',
            'sponsored_listing_days_refunded',
            v_refundable_days,
            'business',
            p_business_id::text,
            jsonb_build_object(
              'sponsorship_id', v_sponsorship.id,
              'display_label', coalesce(v_sponsorship.display_label, 'À la une')
            )
          );
        end if;

        update public.business_sponsorships
        set
          status = 'revoked',
          ends_at = now(),
          updated_at = now()
        where id = v_sponsorship.id;

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
          null,
          'sponsored_listing',
          'sponsored_listing_deactivation',
          1,
          'business',
          p_business_id::text,
          jsonb_build_object(
            'sponsorship_id', v_sponsorship.id,
            'refunded_days', v_refundable_days,
            'display_label', coalesce(v_sponsorship.display_label, 'À la une')
          )
        );

        return query
        select
          v_sponsorship.id,
          v_sponsorship.business_id,
          v_refundable_days,
          now(),
          coalesce(v_sponsorship.display_label, 'À la une');
      end;
      $body$;
    $full$;
  else
    execute $fallback$
      create or replace function public.deactivate_sponsored_listing(p_business_id uuid)
      returns table (
        sponsorship_id uuid,
        business_id uuid,
        refunded_days integer,
        ended_at timestamptz,
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

grant execute on function public.deactivate_sponsored_listing(uuid) to authenticated;

commit;
