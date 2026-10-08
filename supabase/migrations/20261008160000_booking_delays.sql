-- Bookings: lateness both ways.
--
-- - late_grace_minutes: how late a customer may arrive (shown on the booking page, the
--   confirmation and the emails; past it the team sees the booking as late and decides).
-- - booking_delays: "Estamos com atraso" for today, for the whole space or one professional. It
--   doesn't move any booking: customers of the next hours are told the expected time (on their
--   booking page, and by email when it grows), and it is gone the next day.

alter table public.booking_pages
  add column late_grace_minutes integer not null default 10 check (late_grace_minutes between 0 and 60);

alter table public.establishment_bookings
  add column delay_notified_minutes integer not null default 0;

create table public.booking_delays (
  id uuid primary key default gen_random_uuid(),
  establishment_id uuid not null references public.establishments (id) on delete cascade,
  staff_id uuid references public.establishment_staff (id) on delete cascade,
  day date not null,
  minutes integer not null check (minutes between 0 and 180),
  updated_at timestamptz not null default now()
);

create unique index booking_delays_space_day on public.booking_delays (establishment_id, day) where staff_id is null;
create unique index booking_delays_staff_day on public.booking_delays (establishment_id, staff_id, day) where staff_id is not null;

alter table public.booking_delays enable row level security;
revoke all on public.booking_delays from anon, authenticated;
