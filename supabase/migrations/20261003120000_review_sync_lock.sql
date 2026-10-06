-- On-demand review sync from the customer dashboard.
-- A per-business lock so concurrent visitors never start parallel Apify runs, and a
-- minimum interval between syncs so opening the dashboard repeatedly stays cheap.

alter table public.review_businesses add column sync_started_at timestamptz;

create or replace function public.try_start_review_sync(p_business_id uuid, p_min_interval_seconds integer default 300)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  business record;
begin
  select id, last_synced_at, sync_started_at into business
  from public.review_businesses
  where id = p_business_id
  for update;

  if not found then
    return 'missing';
  end if;
  -- A run that started more than 6 minutes ago has outlived the 300 s function limit.
  if business.sync_started_at is not null and business.sync_started_at > now() - interval '6 minutes' then
    return 'running';
  end if;
  if business.last_synced_at is not null and business.last_synced_at > now() - make_interval(secs => p_min_interval_seconds) then
    return 'fresh';
  end if;

  update public.review_businesses set sync_started_at = now() where id = p_business_id;
  return 'started';
end;
$$;

revoke execute on function public.try_start_review_sync(uuid, integer) from public, anon, authenticated;
grant execute on function public.try_start_review_sync(uuid, integer) to service_role;
