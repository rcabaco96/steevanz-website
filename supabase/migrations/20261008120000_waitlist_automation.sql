-- Waitlist automation: the team only taps "Chamar o seguinte"; everything else closes on its own.
--
-- - waitlist_call_next: the next ticket in order (for one professional, or anyone), atomically.
-- - waitlist_check_in: the customer taps "Cheguei" (or reopens the ticket at the door): served.
-- - waitlist_settle: called tickets past the time to show up are closed. Whoever answered "a
--   caminho" / "atraso" counts as served (late gets twice the time); no answer at all is a no-show,
--   and with auto_next the next ticket of the same line is called. Returns the tickets it called,
--   so the app can email them.
-- - auto_hours: the queue opens and closes with the establishment's opening hours (the app decides,
--   using state_changed_at so a manual change during a service is respected).

alter table public.waitlist_settings
  add column auto_hours boolean not null default false,
  add column auto_next boolean not null default true,
  add column state_changed_at timestamptz not null default now();

alter table public.waitlist_entries
  add column arrived_at timestamptz,
  add column close_reason text check (close_reason in ('staff', 'arrived', 'auto', 'left'));

create or replace function public.waitlist_state_changed()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.state is distinct from old.state then
    new.state_changed_at := now();
  end if;
  return new;
end;
$$;

create trigger waitlist_settings_state_changed
  before update of state on public.waitlist_settings
  for each row execute function public.waitlist_state_changed();

-- The next waiting ticket for a professional (their own and "anyone"), or for the whole queue.
create or replace function public.waitlist_call_next(p_establishment uuid, p_staff uuid default null)
returns setof public.waitlist_entries
language plpgsql
security definer
set search_path = ''
as $$
declare
  picked public.waitlist_entries;
begin
  perform 1 from public.waitlist_settings where establishment_id = p_establishment for update;
  select * into picked from public.waitlist_entries
    where establishment_id = p_establishment
      and status = 'waiting'
      and joined_at > now() - interval '12 hours'
      and (p_staff is null or staff_id is null or staff_id = p_staff)
    order by sort_key
    limit 1
    for update;
  if not found then
    return;
  end if;
  update public.waitlist_entries
    set status = 'called', called_at = now(), reply = null, replied_at = null,
        staff_id = coalesce(staff_id, p_staff)
    where id = picked.id
    returning * into picked;
  return next picked;
end;
$$;

-- "Cheguei": a called customer is at the door.
create or replace function public.waitlist_check_in(p_token text)
returns setof public.waitlist_entries
language plpgsql
security definer
set search_path = ''
as $$
declare
  entry public.waitlist_entries;
begin
  update public.waitlist_entries
    set status = 'served', arrived_at = now(), finished_at = now(), close_reason = 'arrived'
    where token = p_token and status = 'called'
    returning * into entry;
  if found then
    return next entry;
  end if;
end;
$$;

-- Closes called tickets past the time to show up; calls the next ones when nobody answered.
create or replace function public.waitlist_settle(p_establishment uuid)
returns setof public.waitlist_entries
language plpgsql
security definer
set search_path = ''
as $$
declare
  settings public.waitlist_settings;
  overdue public.waitlist_entries;
  called public.waitlist_entries;
begin
  select * into settings from public.waitlist_settings where establishment_id = p_establishment for update skip locked;
  if not found then
    return; -- missing, or another request is settling it right now
  end if;
  for overdue in
    select * from public.waitlist_entries
      where establishment_id = p_establishment
        and status = 'called'
        and called_at < now() - make_interval(mins => settings.grace_minutes * (case when reply = 'late' then 2 else 1 end))
      order by called_at
      for update
  loop
    if overdue.reply in ('on_way', 'late') then
      update public.waitlist_entries set status = 'served', finished_at = now(), close_reason = 'auto' where id = overdue.id;
    else
      update public.waitlist_entries set status = 'no_show', finished_at = now(), close_reason = 'auto' where id = overdue.id;
      if settings.auto_next then
        for called in select * from public.waitlist_call_next(p_establishment, overdue.staff_id) loop
          return next called;
        end loop;
      end if;
    end if;
  end loop;
end;
$$;

revoke all on function public.waitlist_call_next(uuid, uuid) from public, anon, authenticated;
revoke all on function public.waitlist_check_in(text) from public, anon, authenticated;
revoke all on function public.waitlist_settle(uuid) from public, anon, authenticated;
grant execute on function public.waitlist_call_next(uuid, uuid) to service_role;
grant execute on function public.waitlist_check_in(text) to service_role;
grant execute on function public.waitlist_settle(uuid) to service_role;
