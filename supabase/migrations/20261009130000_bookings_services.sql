-- Bookings for any business, around the services the owner creates.
--
-- Every service says how it is booked:
-- - 'one': one customer at a time per person or place doing it (a haircut, a consultation, a
--   football pitch). Duration plus an optional gap after it.
-- - 'group': several people at the same time until it fills (a restaurant table): capacity in
--   people per turn (the opening intervals of the day) and the most people per booking.
-- Who (or what) does a service is optional (establishment_service_staff): none chosen means every
-- active person or place. People and places can have their own weekly hours
-- (establishment_staff_hours); without them they follow the space's hours.

alter table public.establishment_services
  add column booking_kind text not null default 'one' check (booking_kind in ('one', 'group')),
  add column capacity integer check (capacity between 1 and 10000),
  add column max_party integer not null default 8 check (max_party between 1 and 1000);

create table public.establishment_service_staff (
  service_id uuid not null references public.establishment_services (id) on delete cascade,
  staff_id uuid not null references public.establishment_staff (id) on delete cascade,
  primary key (service_id, staff_id)
);

create table public.establishment_staff_hours (
  id uuid primary key default gen_random_uuid(),
  staff_id uuid not null references public.establishment_staff (id) on delete cascade,
  weekday smallint not null check (weekday between 0 and 6),
  opens time not null,
  closes time not null,
  check (closes > opens)
);
create index establishment_staff_hours_idx on public.establishment_staff_hours (staff_id, weekday);

alter table public.establishment_service_staff enable row level security;
alter table public.establishment_staff_hours enable row level security;
revoke all on public.establishment_service_staff from anon, authenticated;
revoke all on public.establishment_staff_hours from anon, authenticated;

-- Restaurants booked "tables" without a service: they get a "Mesa" group service with the same
-- capacity, and their bookings point to it.
insert into public.establishment_services (establishment_id, name, duration_minutes, buffer_minutes, booking_kind, capacity, max_party, sort)
select p.establishment_id, 'Mesa', 120, 0, 'group', p.seats_per_slot, p.max_party, 0
from public.booking_pages p
where p.mode = 'table'
  and not exists (select 1 from public.establishment_services s where s.establishment_id = p.establishment_id and s.booking_kind = 'group');

update public.establishment_bookings b
  set service_id = s.id
  from public.establishment_services s
  where s.establishment_id = b.establishment_id and s.booking_kind = 'group'
    and b.service_id is null and b.party_size is not null;

-- The shared check now knows the service: a group service fills by its own bookings in the turn; a
-- space without people or places is one resource for its 'one' services only.
drop function if exists public.establishment_rebook(uuid, uuid, uuid[], integer, timestamptz, timestamptz, text, text, text, text, integer, timestamptz, timestamptz);
drop function if exists public.establishment_book(uuid, text, uuid, uuid[], integer, timestamptz, timestamptz, text, text, text, text, text, integer, timestamptz, timestamptz);
drop function if exists public.establishment_slot_check(uuid, uuid, uuid[], integer, timestamptz, timestamptz, integer, timestamptz, timestamptz);

create function public.establishment_slot_check(
  p_establishment uuid,
  p_exclude uuid,
  p_service uuid,
  p_staff uuid[],
  p_party integer,
  p_starts timestamptz,
  p_ends timestamptz,
  p_capacity integer,
  p_turn_start timestamptz,
  p_turn_end timestamptz
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  candidate uuid;
  booked integer;
  zone text;
begin
  if exists (
    select 1 from public.booking_blocks k
    where k.establishment_id = p_establishment and k.staff_id is null
      and k.starts_at < p_ends and p_starts < k.ends_at
  ) then
    raise exception 'slot_taken';
  end if;

  if p_capacity is not null then
    -- Group service: the people already booked for it in this turn, plus this group.
    if p_turn_start is null or p_turn_end is null then
      select time_zone into zone from public.establishments where id = p_establishment;
      p_turn_start := (date_trunc('day', p_starts at time zone zone)) at time zone zone;
      p_turn_end := (date_trunc('day', p_starts at time zone zone) + interval '1 day') at time zone zone;
    end if;
    select coalesce(sum(coalesce(b.party_size, 1)), 0) into booked
    from public.establishment_bookings b
    where b.establishment_id = p_establishment and b.status in ('confirmed', 'arrived')
      and (p_exclude is null or b.id <> p_exclude)
      and b.service_id is not distinct from p_service
      and b.starts_at >= p_turn_start and b.starts_at < p_turn_end;
    if booked + coalesce(p_party, 1) > p_capacity then
      raise exception 'slot_taken';
    end if;
    return null;
  end if;

  if p_staff is not null and cardinality(p_staff) > 0 then
    -- One at a time: the first free person or place, in the order given (least busy first).
    foreach candidate in array p_staff loop
      if not exists (
        select 1 from public.establishment_bookings b
        where b.establishment_id = p_establishment and b.staff_id = candidate
          and b.status in ('confirmed', 'arrived')
          and (p_exclude is null or b.id <> p_exclude)
          and b.starts_at < p_ends and p_starts < b.ends_at
      ) and not exists (
        select 1 from public.booking_blocks k
        where k.establishment_id = p_establishment and k.staff_id = candidate
          and k.starts_at < p_ends and p_starts < k.ends_at
      ) then
        return candidate;
      end if;
    end loop;
    raise exception 'slot_taken';
  end if;

  -- One at a time without people or places: the space itself, for its 'one' services.
  if exists (
    select 1 from public.establishment_bookings b
    where b.establishment_id = p_establishment and b.status in ('confirmed', 'arrived')
      and (p_exclude is null or b.id <> p_exclude)
      and b.staff_id is null
      and not exists (select 1 from public.establishment_services s where s.id = b.service_id and s.booking_kind = 'group')
      and b.starts_at < p_ends and p_starts < b.ends_at
  ) then
    raise exception 'slot_taken';
  end if;
  return null;
end;
$$;

create function public.establishment_book(
  p_establishment uuid,
  p_token text,
  p_service uuid,
  p_staff uuid[],
  p_party integer,
  p_starts timestamptz,
  p_ends timestamptz,
  p_name text,
  p_email text,
  p_phone text,
  p_notes text,
  p_source text,
  p_capacity integer,
  p_turn_start timestamptz default null,
  p_turn_end timestamptz default null
)
returns public.establishment_bookings
language plpgsql
security definer
set search_path = ''
as $$
declare
  chosen uuid;
  booking public.establishment_bookings;
begin
  perform 1 from public.establishments where id = p_establishment for update;
  if not found then
    raise exception 'establishment_missing';
  end if;
  chosen := public.establishment_slot_check(p_establishment, null, p_service, p_staff, p_party, p_starts, p_ends, p_capacity, p_turn_start, p_turn_end);
  insert into public.establishment_bookings (establishment_id, token, service_id, staff_id, party_size, starts_at, ends_at, name, email, phone, notes, source)
    values (p_establishment, p_token, p_service, chosen, p_party, p_starts, p_ends, p_name, p_email, p_phone, p_notes, p_source)
    returning * into booking;
  return booking;
end;
$$;

create function public.establishment_rebook(
  p_booking uuid,
  p_service uuid,
  p_staff uuid[],
  p_party integer,
  p_starts timestamptz,
  p_ends timestamptz,
  p_name text,
  p_email text,
  p_phone text,
  p_notes text,
  p_capacity integer,
  p_turn_start timestamptz default null,
  p_turn_end timestamptz default null
)
returns public.establishment_bookings
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_booking public.establishment_bookings;
  chosen uuid;
  booking public.establishment_bookings;
begin
  select * into current_booking from public.establishment_bookings where id = p_booking;
  if not found then
    raise exception 'booking_missing';
  end if;
  perform 1 from public.establishments where id = current_booking.establishment_id for update;
  chosen := public.establishment_slot_check(current_booking.establishment_id, p_booking, p_service, p_staff, p_party, p_starts, p_ends, p_capacity, p_turn_start, p_turn_end);
  update public.establishment_bookings
    set service_id = p_service, staff_id = chosen, party_size = p_party, starts_at = p_starts, ends_at = p_ends,
        name = p_name, email = p_email, phone = p_phone, notes = p_notes,
        status = 'confirmed', cancelled_at = null, reminder_sent_at = null, delay_notified_minutes = 0, updated_at = now()
    where id = p_booking
    returning * into booking;
  return booking;
end;
$$;

revoke execute on function public.establishment_slot_check(uuid, uuid, uuid, uuid[], integer, timestamptz, timestamptz, integer, timestamptz, timestamptz) from anon, authenticated, public;
revoke execute on function public.establishment_book(uuid, text, uuid, uuid[], integer, timestamptz, timestamptz, text, text, text, text, text, integer, timestamptz, timestamptz) from anon, authenticated, public;
revoke execute on function public.establishment_rebook(uuid, uuid, uuid[], integer, timestamptz, timestamptz, text, text, text, text, integer, timestamptz, timestamptz) from anon, authenticated, public;
grant execute on function public.establishment_slot_check(uuid, uuid, uuid, uuid[], integer, timestamptz, timestamptz, integer, timestamptz, timestamptz) to service_role;
grant execute on function public.establishment_book(uuid, text, uuid, uuid[], integer, timestamptz, timestamptz, text, text, text, text, text, integer, timestamptz, timestamptz) to service_role;
grant execute on function public.establishment_rebook(uuid, uuid, uuid[], integer, timestamptz, timestamptz, text, text, text, text, integer, timestamptz, timestamptz) to service_role;
