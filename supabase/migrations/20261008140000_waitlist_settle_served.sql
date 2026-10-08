-- The customer doesn't have to do anything after taking a ticket: once called, the turn closes on
-- its own as served after the time to show up ("vou atrasar-me" gets twice the time). A no-show
-- is the exception, marked by the team ("Não apareceu"); the app then calls the next ticket when
-- auto_next is on. "Já não venho" already takes the customer out of the queue.

create or replace function public.waitlist_settle(p_establishment uuid)
returns setof public.waitlist_entries
language plpgsql
security definer
set search_path = ''
as $$
declare
  settings public.waitlist_settings;
begin
  select * into settings from public.waitlist_settings where establishment_id = p_establishment for update skip locked;
  if not found then
    return; -- missing, or another request is settling it right now
  end if;
  update public.waitlist_entries
    set status = 'served', finished_at = now(), close_reason = 'auto'
    where establishment_id = p_establishment
      and status = 'called'
      and called_at < now() - make_interval(mins => settings.grace_minutes * (case when reply = 'late' then 2 else 1 end));
end;
$$;
