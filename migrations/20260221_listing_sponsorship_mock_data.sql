-- Mock data for testing "À la une" listing rendering
-- Usage:
-- 1) Optional: set your target user UUID in v_user_id (or keep NULL for auto-detection)
-- 2) Run this script in Supabase SQL editor

begin;

do $$
declare
  v_user_id uuid := null; -- Optional: force a user id
  v_row record;
  v_counter integer := 0;
begin
  if v_user_id is null then
    select b.seller_id
    into v_user_id
    from public.businesses b
    where b.status = 'active'
      and b.seller_id is not null
    order by b.created_at desc
    limit 1;
  end if;

  if v_user_id is null then
    raise exception 'No eligible seller found. Create at least one active listing first.';
  end if;

  for v_row in
    select b.id
    from public.businesses b
    where b.seller_id = v_user_id
      and b.status = 'active'
    order by b.created_at desc
    limit 3
  loop
    exit when v_counter >= 3;

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
      v_row.id,
      null,
      'sponsored_listing',
      'À la une',
      'active',
      now() - interval '1 day',
      now() + interval '29 days',
      now(),
      now()
    )
    on conflict do nothing;

    v_counter := v_counter + 1;
  end loop;

  if v_counter = 0 then
    raise exception 'No active listings found for this user';
  end if;
end
$$;

commit;
