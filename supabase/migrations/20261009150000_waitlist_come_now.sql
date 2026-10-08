-- A queue: once called, the customer comes to the door straight away. No "vou atrasar-me" any more,
-- and a short time to show up (5 minutes for new spaces). Past it, the call still closes on its own
-- as served when nobody marked «Não apareceu».

alter table public.waitlist_settings alter column grace_minutes set default 5;

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
      and called_at < now() - make_interval(mins => settings.grace_minutes);
end;
$$;
