-- Sign-in, confirmation and password emails are sent by the site (Resend), not by Supabase Auth, so
-- the "one email per address per minute" limit lives here. Rows are keyed by a hash of the email
-- (never the address itself) and are claimed for every request, whether or not an account exists,
-- so the answer never reveals which emails have an account.

create table public.auth_email_cooldowns (
  key text primary key,
  sent_at timestamptz not null default now()
);

create index auth_email_cooldowns_sent_at_idx on public.auth_email_cooldowns (sent_at);

alter table public.auth_email_cooldowns enable row level security;
revoke all on table public.auth_email_cooldowns from anon, authenticated;

-- Claims the slot for this key: 0 when the email may be sent now, otherwise the seconds left.
create or replace function public.auth_email_claim(p_key text, p_seconds integer)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  claimed text;
  last_sent timestamptz;
begin
  delete from public.auth_email_cooldowns where sent_at < now() - interval '1 day';
  insert into public.auth_email_cooldowns as c (key, sent_at) values (p_key, now())
    on conflict (key) do update set sent_at = now()
    where c.sent_at <= now() - make_interval(secs => p_seconds)
    returning c.key into claimed;
  if claimed is not null then
    return 0;
  end if;
  select c.sent_at into last_sent from public.auth_email_cooldowns c where c.key = p_key;
  return greatest(1, ceil(extract(epoch from (last_sent + make_interval(secs => p_seconds) - now())))::integer);
end;
$$;

-- Gives the slot back when the email could not be sent, so the person can try again straight away.
create or replace function public.auth_email_release(p_key text)
returns void
language sql
security definer
set search_path = ''
as $$
  delete from public.auth_email_cooldowns where key = p_key;
$$;

revoke execute on function public.auth_email_claim(text, integer) from anon, authenticated, public;
revoke execute on function public.auth_email_release(text) from anon, authenticated, public;
grant execute on function public.auth_email_claim(text, integer) to service_role;
grant execute on function public.auth_email_release(text) to service_role;
