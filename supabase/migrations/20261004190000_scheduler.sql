-- Scheduler of the reviews product: Supabase pg_cron calls GET /api/cron/tick every 15 minutes
-- (through pg_net). Vercel Hobby only allows daily crons, and the 10:00 / 19:00 competition slots
-- and the 22:00 customer routine are in Portuguese time (they move with summer time), so the tick
-- decides in Europe/Lisbon (src/lib/reviews/tick.ts) and stores here what it already handled.

create extension if not exists pg_cron;
create extension if not exists pg_net with schema extensions;

-- Last handled moments, e.g. competition_slot = ISO instant of the last 10:00/19:00 slot planned,
-- customer_day = Portuguese day whose 22:00 customer routine ran.
create table public.scheduler_state (
  key text primary key,
  value text,
  updated_at timestamptz not null default now()
);
alter table public.scheduler_state enable row level security;
revoke all on table public.scheduler_state from anon, authenticated;

-- Atomically claims a value: true only for the first caller that moves the key to p_value, so two
-- overlapping ticks (pg_cron and the Vercel safety-net cron) never plan the same slot twice.
create or replace function public.scheduler_claim(p_key text, p_value text)
returns boolean
language sql
security definer
set search_path = public
as $$
  with claimed as (
    insert into public.scheduler_state as s (key, value, updated_at)
    values (p_key, p_value, now())
    on conflict (key) do update set value = excluded.value, updated_at = now()
    where s.value is distinct from excluded.value
    returning 1
  )
  select exists (select 1 from claimed);
$$;
revoke execute on function public.scheduler_claim(text, text) from public, anon, authenticated;
grant execute on function public.scheduler_claim(text, text) to service_role;

-- ---------------------------------------------------------------------------------------------
-- NOT run by this migration. After /api/cron/tick is deployed to production (and CRON_SECRET is
-- set in Vercel), run once in the SQL editor / Management API, replacing <CRON_SECRET>:
--
-- select vault.create_secret('<CRON_SECRET>', 'steevanz_cron_secret', 'Bearer token of /api/cron/tick');
-- select vault.create_secret('https://steevanz.com', 'steevanz_site_url', 'Production site called by pg_cron');
--
-- select cron.schedule(
--   'steevanz-tick',
--   '*/15 * * * *',
--   $cron$
--   select net.http_get(
--     url := (select decrypted_secret from vault.decrypted_secrets where name = 'steevanz_site_url') || '/api/cron/tick',
--     headers := jsonb_build_object(
--       'Authorization', 'Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name = 'steevanz_cron_secret')
--     ),
--     timeout_milliseconds := 300000
--   );
--   $cron$
-- );
--
-- Check:   select * from cron.job_run_details order by start_time desc limit 5;
--          select id, status_code, left(content, 300) from net._http_response order by id desc limit 5;
-- Stop:    select cron.unschedule('steevanz-tick');
-- Rotate:  select vault.update_secret((select id from vault.secrets where name = 'steevanz_cron_secret'), '<NEW>');
-- ---------------------------------------------------------------------------------------------
