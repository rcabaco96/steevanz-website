-- Simpler bookings. The kind of booking follows the business: restaurants book tables, the rest
-- book services. Table capacity now counts the people still seated for the whole meal (the busiest
-- moment between arrival and the end of the meal), not only those arriving at the same time.

update public.booking_pages p
  set mode = case when e.kind = 'restaurant' then 'table' else 'service' end
  from public.establishments e
  where e.id = p.establishment_id;

create or replace function public.establishment_book(
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
  p_capacity integer
)
returns public.establishment_bookings
language plpgsql
security definer
set search_path = ''
as $$
declare
  chosen uuid := null;
  candidate uuid;
  seats integer;
  booking public.establishment_bookings;
begin
  perform 1 from public.establishments where id = p_establishment for update;
  if not found then
    raise exception 'establishment_missing';
  end if;

  if p_staff is not null and cardinality(p_staff) > 0 then
    -- Service mode: the first free professional, in the order given (the app puts the least busy first).
    foreach candidate in array p_staff loop
      if not exists (
        select 1 from public.establishment_bookings b
        where b.establishment_id = p_establishment and b.staff_id = candidate
          and b.status in ('confirmed', 'arrived')
          and b.starts_at < p_ends and p_starts < b.ends_at
      ) and not exists (
        select 1 from public.booking_blocks k
        where k.establishment_id = p_establishment and (k.staff_id is null or k.staff_id = candidate)
          and k.starts_at < p_ends and p_starts < k.ends_at
      ) then
        chosen := candidate;
        exit;
      end if;
    end loop;
    if chosen is null then
      raise exception 'slot_taken';
    end if;
  else
    if exists (
      select 1 from public.booking_blocks k
      where k.establishment_id = p_establishment and k.staff_id is null
        and k.starts_at < p_ends and p_starts < k.ends_at
    ) then
      raise exception 'slot_taken';
    end if;
    if p_capacity is null and exists (
      select 1 from public.establishment_bookings b
      where b.establishment_id = p_establishment and b.status in ('confirmed', 'arrived')
        and b.starts_at < p_ends and p_starts < b.ends_at
    ) then
      -- Service mode without professionals: the establishment is a single resource.
      raise exception 'slot_taken';
    end if;
    if p_capacity is not null then
      -- Table mode: people seated at the busiest moment of the meal.
      select coalesce(max(seated), 0) into seats from (
        select sum(coalesce(b.party_size, 1)) as seated
        from (
          select p_starts as point
          union
          select b2.starts_at from public.establishment_bookings b2
            where b2.establishment_id = p_establishment and b2.status in ('confirmed', 'arrived')
              and b2.starts_at > p_starts and b2.starts_at < p_ends
        ) points
        join public.establishment_bookings b
          on b.establishment_id = p_establishment and b.status in ('confirmed', 'arrived')
         and b.starts_at <= points.point and points.point < b.ends_at
        group by points.point
      ) moments;
      if seats + coalesce(p_party, 1) > p_capacity then
        raise exception 'slot_taken';
      end if;
    end if;
  end if;

  insert into public.establishment_bookings (establishment_id, token, service_id, staff_id, party_size, starts_at, ends_at, name, email, phone, notes, source)
    values (p_establishment, p_token, p_service, chosen, p_party, p_starts, p_ends, p_name, p_email, p_phone, p_notes, p_source)
    returning * into booking;
  return booking;
end;
$$;
