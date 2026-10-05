-- NEXIS SITTA: tenant bootstrap
-- Runs on every new auth.users insert and provisions:
--   1. an organization row (the new tenant)
--   2. a profiles row with role = 'admin' for the registering user
--
-- SECURITY DEFINER is required because the inserting role is `anon`
-- (the auth service), which RLS correctly blocks from writing these tables.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  new_org_id uuid;
  org_name text;
  base_slug text;
begin
  org_name := coalesce(
    nullif(trim(new.raw_user_meta_data ->> 'organization_name'), ''),
    'My Organization'
  );

  -- Slugify the org name, then guarantee uniqueness with a short id suffix.
  base_slug := lower(regexp_replace(org_name, '[^a-z0-9]+', '-', 'g'));
  base_slug := trim(both '-' from base_slug);
  if base_slug = '' then
    base_slug := 'org';
  end if;

  -- id and created_at are set explicitly so this migration does not depend on
  -- column defaults existing on the tables.
  insert into public.organizations (id, name, slug, created_at)
  values (
    gen_random_uuid(),
    org_name,
    base_slug || '-' || substr(replace(new.id::text, '-', ''), 1, 8),
    now()
  )
  returning id into new_org_id;

  insert into public.profiles (id, organization_id, full_name, role, created_at)
  values (
    new.id,
    new_org_id,
    coalesce(nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''), 'User'),
    'admin',
    now()
  );

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();