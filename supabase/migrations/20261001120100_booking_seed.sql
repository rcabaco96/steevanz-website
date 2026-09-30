-- Default availability: Monday to Friday, 10:00-18:00, 30 minute slots, lunch 13:00-14:00.
-- Weekday numbering follows JavaScript/Postgres extract(dow): 0 = Sunday ... 6 = Saturday.

insert into public.booking_settings (id, timezone, min_notice_hours, max_days_ahead)
values (1, 'Europe/Lisbon', 12, 30)
on conflict (id) do nothing;

insert into public.availability_rules (weekday, start_time, end_time, slot_minutes, active)
select weekday, time '10:00', time '18:00', 30, true
from generate_series(1, 5) as weekday;

insert into public.availability_breaks (weekday, start_time, end_time)
select weekday, time '13:00', time '14:00'
from generate_series(1, 5) as weekday;
