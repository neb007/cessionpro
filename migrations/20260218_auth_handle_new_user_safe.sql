-- Prevent auth signup failures when profile trigger hits schema drift

begin;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  -- Try full insert first (newer schema)
  begin
    insert into public.profiles (
      id,
      email,
      full_name,
      first_name,
      last_name,
      company_name,
      phone,
      created_at,
      updated_at
    )
    values (
      new.id,
      new.email,
      coalesce(new.raw_user_meta_data->>'full_name', ''),
      coalesce(new.raw_user_meta_data->>'first_name', ''),
      coalesce(new.raw_user_meta_data->>'last_name', ''),
      coalesce(new.raw_user_meta_data->>'company_name', ''),
      coalesce(new.raw_user_meta_data->>'phone', ''),
      now(),
      now()
    )
    on conflict (id) do update
      set email = excluded.email,
          full_name = excluded.full_name,
          first_name = excluded.first_name,
          last_name = excluded.last_name,
          company_name = excluded.company_name,
          phone = excluded.phone,
          updated_at = now();

  exception
    -- Older schema: fallback to minimal columns
    when undefined_column then
      begin
        insert into public.profiles (id, email, full_name)
        values (
          new.id,
          new.email,
          coalesce(new.raw_user_meta_data->>'full_name', '')
        )
        on conflict (id) do update
          set email = excluded.email,
              full_name = excluded.full_name;
      exception
        when others then
          raise warning 'handle_new_user fallback failed for user %: %', new.id, sqlerrm;
      end;

    -- Never block auth signup because of profile sync
    when others then
      raise warning 'handle_new_user failed for user %: %', new.id, sqlerrm;
  end;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

commit;
