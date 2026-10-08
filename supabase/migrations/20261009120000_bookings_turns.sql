-- Restaurant bookings by turn. A restaurant has a capacity per turn (lunch, dinner: the opening
-- intervals of the day): once the bookings of a turn add up to it, that turn is full. There is no
-- meal duration any more. Appointments (every other business) keep one customer at a time per
-- professional.
--
-- - booking_pages.seats_per_slot is now "people per turn"; last_booking_minutes is how long before
--   the turn ends the last booking can start.
-- - One shared check (establishment_slot_check) for new bookings and for the team changing an
--   existing one (establishment_rebook), which never counts the booking against itself.

alter table public.booking_pages
  add column last_booking_minutes integer not null default 60 check (last_booking_minutes between 0 and 240);

-- Returns the professional to use (appointments) or null (turns). Raises slot_taken when full.
create or replace function public.establishment_slot_check(
  p_establishment uuid,
  p_exclude uuid,
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
  if p_capacity is not null and (p_turn_start is null or p_turn_end is null) then
    -- Callers that don't send the turn yet: the whole local day counts as one turn (never more lenient).
    select time_zone into zone from public.establishments where id = p_establishment;
    p_turn_start := (date_trunc('day', p_starts at time zone zone)) at time zone zone;
    p_turn_end := (date_trunc('day', p_starts at time zone zone) + interval '1 day') at time zone zone;
  end if;
  if p_staff is not null and cardinality(p_staff) > 0 then
    -- Appointments: the first free professional, in the order given (the app puts the least busy first).
    foreach candidate in array p_staff loop
      if not exists (
        select 1 from public.establishment_bookings b
        where b.establishment_id = p_establishment and b.staff_id = candidate
          and b.status in ('confirmed', 'arrived')
          and (p_exclude is null or b.id <> p_exclude)
          and b.starts_at < p_ends and p_starts < b.ends_at
      ) and not exists (
        select 1 from public.booking_blocks k
        where k.establishment_id = p_establishment and (k.staff_id is null or k.staff_id = candidate)
          and k.starts_at < p_ends and p_starts < k.ends_at
      ) then
        return candidate;
      end if;
    end loop;
    raise exception 'slot_taken';
  end if;

  if exists (
    select 1 from public.booking_blocks k
    where k.establishment_id = p_establishment and k.staff_id is null
      and k.starts_at < p_ends and p_starts < k.ends_at
  ) then
    raise exception 'slot_taken';
  end if;

  if p_capacity is not null then
    -- Turns: the people already booked to arrive during this turn, plus this group.
    select coalesce(sum(coalesce(b.party_size, 1)), 0) into booked
    from public.establishment_bookings b
    where b.establishment_id = p_establishment and b.status in ('confirmed', 'arrived')
      and (p_exclude is null or b.id <> p_exclude)
      and b.starts_at >= p_turn_start and b.starts_at < p_turn_end;
    if booked + coalesce(p_party, 1) > p_capacity then
      raise exception 'slot_taken';
    end if;
  elsif exists (
    select 1 from public.establishment_bookings b
    where b.establishment_id = p_establishment and b.status in ('confirmed', 'arrived')
      and (p_exclude is null or b.id <> p_exclude)
      and b.starts_at < p_ends and p_starts < b.ends_at
  ) then
    -- Appointments without professionals: the space is a single resource.
    raise exception 'slot_taken';
  end if;
  return null;
end;
$$;

drop function if exists public.establishment_book(uuid, text, uuid, uuid[], integer, timestamptz, timestamptz, text, text, text, text, text, integer);

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
  chosen := public.establishment_slot_check(p_establishment, null, p_staff, p_party, p_starts, p_ends, p_capacity, p_turn_start, p_turn_end);
  insert into public.establishment_bookings (establishment_id, token, service_id, staff_id, party_size, starts_at, ends_at, name, email, phone, notes, source)
    values (p_establishment, p_token, p_service, chosen, p_party, p_starts, p_ends, p_name, p_email, p_phone, p_notes, p_source)
    returning * into booking;
  return booking;
end;
$$;

-- The team changes a booking (time, people, service, contact): same checks, the booking itself
-- not counted, same link for the customer.
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
  chosen := public.establishment_slot_check(current_booking.establishment_id, p_booking, p_staff, p_party, p_starts, p_ends, p_capacity, p_turn_start, p_turn_end);
  update public.establishment_bookings
    set service_id = p_service, staff_id = chosen, party_size = p_party, starts_at = p_starts, ends_at = p_ends,
        name = p_name, email = p_email, phone = p_phone, notes = p_notes,
        status = 'confirmed', cancelled_at = null, reminder_sent_at = null, delay_notified_minutes = 0, updated_at = now()
    where id = p_booking
    returning * into booking;
  return booking;
end;
$$;

revoke execute on function public.establishment_slot_check(uuid, uuid, uuid[], integer, timestamptz, timestamptz, integer, timestamptz, timestamptz) from anon, authenticated, public;
revoke execute on function public.establishment_book(uuid, text, uuid, uuid[], integer, timestamptz, timestamptz, text, text, text, text, text, integer, timestamptz, timestamptz) from anon, authenticated, public;
revoke execute on function public.establishment_rebook(uuid, uuid, uuid[], integer, timestamptz, timestamptz, text, text, text, text, integer, timestamptz, timestamptz) from anon, authenticated, public;
grant execute on function public.establishment_slot_check(uuid, uuid, uuid[], integer, timestamptz, timestamptz, integer, timestamptz, timestamptz) to service_role;
grant execute on function public.establishment_book(uuid, text, uuid, uuid[], integer, timestamptz, timestamptz, text, text, text, text, text, integer, timestamptz, timestamptz) to service_role;
grant execute on function public.establishment_rebook(uuid, uuid, uuid[], integer, timestamptz, timestamptz, text, text, text, text, integer, timestamptz, timestamptz) to service_role;
