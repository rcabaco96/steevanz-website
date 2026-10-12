-- Waitlist, simpler (owner, 2026-10-12):
-- - Only open or closed: «Pausar entradas» goes (a paused queue becomes closed).
-- - Closing the queue starts the ticket numbers again: the next ticket is 1 (numbers_from).
-- - A phone number instead of an email (the team can call; the turn is announced by push).
-- - Two people with the same name cannot be in the queue at once (accents and case ignored).
-- Calls no longer close on their own after a while (the app stops calling waitlist_settle); the
-- team marks «Atendido» or «Não apareceu». grace_minutes and email stay for older rows.

update public.waitlist_settings set state = 'closed' where state = 'paused';
alter table public.waitlist_settings drop constraint if exists waitlist_settings_state_check;
alter table public.waitlist_settings add constraint waitlist_settings_state_check check (state in ('open', 'closed'));

alter table public.waitlist_settings add column numbers_from timestamptz not null default now();

alter table public.waitlist_entries add column phone text check (char_length(phone) <= 40);

create or replace function public.waitlist_state_changed()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.state is distinct from old.state then
    new.state_changed_at := now();
    if new.state = 'closed' then
      new.numbers_from := now();
    end if;
  end if;
  return new;
end;
$$;

-- "Zé Silva" and "ze silva" are the same name.
create or replace function public.waitlist_name_key(p_name text)
returns text
language sql
immutable
set search_path = ''
as $$
  select regexp_replace(lower(translate(trim(p_name), 'ÁÀÂÃÄÉÈÊËÍÌÎÏÓÒÔÕÖÚÙÛÜÇÑáàâãäéèêëíìîïóòôõöúùûüçñ', 'AAAAAEEEEIIIIOOOOOUUUUCNaaaaaeeeeiiiiooooouuuucn')), '\s+', ' ', 'g');
$$;

drop function if exists public.waitlist_join(uuid, text, text, integer, uuid, uuid, text, text, text, timestamptz);

create or replace function public.waitlist_join(
  p_establishment uuid,
  p_token text,
  p_name text,
  p_party integer,
  p_service uuid,
  p_staff uuid,
  p_phone text,
  p_notes text,
  p_source text,
  p_day_start timestamptz
)
returns public.waitlist_entries
language plpgsql
security definer
set search_path = ''
as $$
declare
  settings public.waitlist_settings;
  waiting integer;
  next_number integer;
  entry public.waitlist_entries;
begin
  select * into settings from public.waitlist_settings where establishment_id = p_establishment for update;
  if not found then
    raise exception 'waitlist_missing';
  end if;
  if p_source = 'online' and settings.state <> 'open' then
    raise exception 'waitlist_closed';
  end if;
  select count(*) into waiting from public.waitlist_entries
    where establishment_id = p_establishment and status in ('waiting', 'called') and joined_at > now() - interval '12 hours';
  if p_source = 'online' and waiting >= settings.max_waiting then
    raise exception 'waitlist_full';
  end if;
  perform 1 from public.waitlist_entries
    where establishment_id = p_establishment
      and status in ('waiting', 'called')
      and joined_at > now() - interval '12 hours'
      and public.waitlist_name_key(name) = public.waitlist_name_key(p_name);
  if found then
    raise exception 'waitlist_name_taken';
  end if;
  select coalesce(max(number), 0) + 1 into next_number from public.waitlist_entries
    where establishment_id = p_establishment and joined_at >= greatest(p_day_start, settings.numbers_from);
  insert into public.waitlist_entries (establishment_id, token, number, name, party_size, service_id, staff_id, phone, notes, source)
    values (p_establishment, p_token, next_number, p_name, p_party, p_service, p_staff, p_phone, p_notes, p_source)
    returning * into entry;
  return entry;
end;
$$;

revoke execute on function public.waitlist_join(uuid, text, text, integer, uuid, uuid, text, text, text, timestamptz) from anon, authenticated, public;
grant execute on function public.waitlist_join(uuid, text, text, integer, uuid, uuid, text, text, text, timestamptz) to service_role;
revoke execute on function public.waitlist_name_key(text) from anon, authenticated, public;
