-- Exact time of the last read of each shared Google place: the competition base is updated twice a
-- day (10:00 and 19:00 Portuguese time) and a place is read only if not read since the previous slot.
alter table public.reader_places add column read_at timestamptz;
update public.reader_places set read_at = (read_on::timestamp + interval '12 hours') at time zone 'Europe/Lisbon' where read_on is not null and read_at is null;
