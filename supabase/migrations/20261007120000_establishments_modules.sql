-- Establishments (a client's shop or practice) and the three self-service modules that hang off
-- them: digital waitlist, digital loyalty card and online bookings.
--
-- Access model: RLS on, no grants to anon/authenticated. Everything goes through server code with
-- the service role: the client area and the admin check the session and the establishment owner;
-- the public pages (waitlist, card, booking) only reach rows through unguessable tokens. The few
-- operations that must be atomic (joining the queue, adding a stamp, taking a booking slot) are
-- functions that lock the establishment's row first.

-- Establishments ------------------------------------------------------------------------------

create type public.business_kind as enum ('restaurant', 'salon', 'clinic', 'retail');

create table public.establishments (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) <= 60),
  name text not null check (char_length(name) between 1 and 120),
  kind public.business_kind not null default 'restaurant',
  accent_color text not null default '#7a2d60' check (accent_color ~ '^#[0-9a-fA-F]{6}$'),
  phone text check (char_length(phone) <= 40),
  address text check (char_length(address) <= 200),
  time_zone text not null default 'Europe/Lisbon' check (char_length(time_zone) <= 60),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index establishments_owner_idx on public.establishments (owner_id);

-- Services (cut, beard, consultation…) and professionals, shared by the waitlist and bookings.
create table public.establishment_services (
  id uuid primary key default gen_random_uuid(),
  establishment_id uuid not null references public.establishments (id) on delete cascade,
  name text not null check (char_length(name) between 1 and 80),
  duration_minutes integer not null default 30 check (duration_minutes between 5 and 480),
  buffer_minutes integer not null default 0 check (buffer_minutes between 0 and 120),
  price_cents integer check (price_cents between 0 and 10000000),
  active boolean not null default true,
  sort integer not null default 0,
  created_at timestamptz not null default now()
);

create index establishment_services_idx on public.establishment_services (establishment_id, sort);

create table public.establishment_staff (
  id uuid primary key default gen_random_uuid(),
  establishment_id uuid not null references public.establishments (id) on delete cascade,
  name text not null check (char_length(name) between 1 and 80),
  active boolean not null default true,
  sort integer not null default 0,
  created_at timestamptz not null default now()
);

create index establishment_staff_idx on public.establishment_staff (establishment_id, sort);

-- Opening hours: one or more intervals per weekday (0 = Sunday), e.g. lunch and dinner.
create table public.establishment_hours (
  id uuid primary key default gen_random_uuid(),
  establishment_id uuid not null references public.establishments (id) on delete cascade,
  weekday smallint not null check (weekday between 0 and 6),
  opens time not null,
  closes time not null,
  check (closes > opens)
);

create index establishment_hours_idx on public.establishment_hours (establishment_id, weekday);

-- Whole days closed (holidays, vacations).
create table public.establishment_closures (
  id uuid primary key default gen_random_uuid(),
  establishment_id uuid not null references public.establishments (id) on delete cascade,
  day date not null,
  reason text check (char_length(reason) <= 120),
  unique (establishment_id, day)
);

-- Waitlist --------------------------------------------------------------------------------------

create table public.waitlist_settings (
  establishment_id uuid primary key references public.establishments (id) on delete cascade,
  state text not null default 'closed' check (state in ('open', 'paused', 'closed')),
  avg_minutes integer not null default 15 check (avg_minutes between 1 and 240),
  ask_party boolean not null default true,
  ask_service boolean not null default false,
  ask_staff boolean not null default false,
  max_party integer not null default 12 check (max_party between 1 and 100),
  max_waiting integer not null default 60 check (max_waiting between 1 and 500),
  grace_minutes integer not null default 10 check (grace_minutes between 1 and 120),
  message text check (char_length(message) <= 300),
  updated_at timestamptz not null default now()
);

create table public.waitlist_entries (
  id uuid primary key default gen_random_uuid(),
  establishment_id uuid not null references public.establishments (id) on delete cascade,
  token text not null unique check (char_length(token) between 20 and 64),
  number integer not null,
  name text not null check (char_length(name) between 1 and 60),
  party_size integer check (party_size between 1 and 100),
  service_id uuid references public.establishment_services (id) on delete set null,
  staff_id uuid references public.establishment_staff (id) on delete set null,
  email text check (char_length(email) <= 200),
  notes text check (char_length(notes) <= 200),
  source text not null default 'online' check (source in ('online', 'staff')),
  status text not null default 'waiting' check (status in ('waiting', 'called', 'served', 'no_show', 'cancelled')),
  reply text check (reply in ('on_way', 'late', 'leaving')),
  sort_key double precision not null default extract(epoch from now()),
  joined_at timestamptz not null default now(),
  called_at timestamptz,
  replied_at timestamptz,
  finished_at timestamptz
);

create index waitlist_entries_live_idx on public.waitlist_entries (establishment_id, status, sort_key);
create index waitlist_entries_joined_idx on public.waitlist_entries (establishment_id, joined_at desc);

-- Takes the next ticket number of the day and checks the queue is open (online) and not full.
create or replace function public.waitlist_join(
  p_establishment uuid,
  p_token text,
  p_name text,
  p_party integer,
  p_service uuid,
  p_staff uuid,
  p_email text,
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
    where establishment_id = p_establishment and status in ('waiting', 'called');
  if p_source = 'online' and waiting >= settings.max_waiting then
    raise exception 'waitlist_full';
  end if;
  select coalesce(max(number), 0) + 1 into next_number from public.waitlist_entries
    where establishment_id = p_establishment and joined_at >= p_day_start;
  insert into public.waitlist_entries (establishment_id, token, number, name, party_size, service_id, staff_id, email, notes, source)
    values (p_establishment, p_token, next_number, p_name, p_party, p_service, p_staff, p_email, p_notes, p_source)
    returning * into entry;
  return entry;
end;
$$;

-- Loyalty card ----------------------------------------------------------------------------------

create table public.loyalty_programs (
  establishment_id uuid primary key references public.establishments (id) on delete cascade,
  active boolean not null default true,
  stamps_required integer not null default 10 check (stamps_required between 2 and 50),
  reward text not null default 'Uma oferta da casa' check (char_length(reward) between 1 and 120),
  welcome_stamp boolean not null default true,
  cooldown_minutes integer not null default 120 check (cooldown_minutes between 0 and 10080),
  reward_valid_days integer check (reward_valid_days between 1 and 730),
  -- The team's 6-digit stamp code, chosen by the owner: only its salted hash is kept.
  staff_code_hash text,
  staff_code_salt text,
  staff_code_set_at timestamptz,
  terms text check (char_length(terms) <= 600),
  updated_at timestamptz not null default now()
);

create table public.loyalty_cards (
  id uuid primary key default gen_random_uuid(),
  establishment_id uuid not null references public.establishments (id) on delete cascade,
  token text not null unique check (char_length(token) between 20 and 64),
  code text not null check (code ~ '^[A-Z0-9]{6}$'),
  name text not null check (char_length(name) between 1 and 60),
  email text check (char_length(email) <= 200),
  phone text check (char_length(phone) <= 40),
  consent_at timestamptz not null,
  stamps integer not null default 0 check (stamps >= 0),
  last_stamp_at timestamptz,
  failed_code_attempts integer not null default 0,
  locked_until timestamptz,
  created_at timestamptz not null default now(),
  unique (establishment_id, code)
);

create index loyalty_cards_establishment_idx on public.loyalty_cards (establishment_id, created_at desc);
create index loyalty_cards_email_idx on public.loyalty_cards (establishment_id, email);

create table public.loyalty_rewards (
  id uuid primary key default gen_random_uuid(),
  card_id uuid not null references public.loyalty_cards (id) on delete cascade,
  establishment_id uuid not null references public.establishments (id) on delete cascade,
  earned_at timestamptz not null default now(),
  expires_at timestamptz,
  redeemed_at timestamptz
);

create index loyalty_rewards_card_idx on public.loyalty_rewards (card_id, earned_at);

create table public.loyalty_events (
  id bigint generated always as identity primary key,
  card_id uuid not null references public.loyalty_cards (id) on delete cascade,
  establishment_id uuid not null references public.establishments (id) on delete cascade,
  kind text not null check (kind in ('joined', 'stamp', 'reward_earned', 'reward_redeemed', 'adjust')),
  amount integer not null default 1,
  source text check (source in ('staff_code', 'staff_panel', 'welcome', 'migration')),
  created_at timestamptz not null default now()
);

create index loyalty_events_stats_idx on public.loyalty_events (establishment_id, created_at desc);

-- Adds stamps to a card (or removes, with a negative amount from the staff panel). Completed cards
-- turn into rewards and start again. With p_enforce_cooldown, a card stamped less than the
-- program's cooldown ago is refused ('cooldown').
create or replace function public.loyalty_stamp(p_card uuid, p_amount integer, p_source text, p_enforce_cooldown boolean)
returns table (outcome text, stamps integer, rewards_earned integer, next_allowed_at timestamptz)
language plpgsql
security definer
set search_path = ''
as $$
#variable_conflict use_column
declare
  card public.loyalty_cards;
  program public.loyalty_programs;
  total integer;
  earned integer := 0;
  i integer;
begin
  select * into card from public.loyalty_cards where id = p_card for update;
  if not found then
    raise exception 'card_missing';
  end if;
  select * into program from public.loyalty_programs where establishment_id = card.establishment_id;
  if not found or not program.active then
    raise exception 'program_inactive';
  end if;
  if p_enforce_cooldown and p_amount > 0 and card.last_stamp_at is not null
     and card.last_stamp_at > now() - make_interval(mins => program.cooldown_minutes) then
    return query select 'cooldown'::text, card.stamps, 0, card.last_stamp_at + make_interval(mins => program.cooldown_minutes);
    return;
  end if;
  total := greatest(0, card.stamps + p_amount);
  if total >= program.stamps_required then
    earned := total / program.stamps_required;
    total := total % program.stamps_required;
    for i in 1..earned loop
      insert into public.loyalty_rewards (card_id, establishment_id, expires_at)
        values (card.id, card.establishment_id,
          case when program.reward_valid_days is null then null else now() + make_interval(days => program.reward_valid_days) end);
    end loop;
    insert into public.loyalty_events (card_id, establishment_id, kind, amount, source)
      values (card.id, card.establishment_id, 'reward_earned', earned, p_source);
  end if;
  update public.loyalty_cards
    set stamps = total,
        last_stamp_at = case when p_amount > 0 then now() else last_stamp_at end,
        failed_code_attempts = 0,
        locked_until = null
    where id = card.id;
  insert into public.loyalty_events (card_id, establishment_id, kind, amount, source)
    values (card.id, card.establishment_id, case when p_amount > 0 then 'stamp' else 'adjust' end, p_amount, p_source);
  return query select 'ok'::text, total, earned, null::timestamptz;
end;
$$;

-- Online bookings -------------------------------------------------------------------------------

create table public.booking_pages (
  establishment_id uuid primary key references public.establishments (id) on delete cascade,
  active boolean not null default false,
  mode text not null default 'table' check (mode in ('table', 'service')),
  slot_interval_minutes integer not null default 30 check (slot_interval_minutes between 5 and 120),
  min_notice_minutes integer not null default 60 check (min_notice_minutes between 0 and 20160),
  max_days_ahead integer not null default 60 check (max_days_ahead between 1 and 365),
  table_minutes integer not null default 90 check (table_minutes between 15 and 480),
  seats_per_slot integer not null default 20 check (seats_per_slot between 1 and 1000),
  max_party integer not null default 8 check (max_party between 1 and 100),
  cancel_until_hours integer not null default 2 check (cancel_until_hours between 0 and 336),
  policy text check (char_length(policy) <= 600),
  confirmation_note text check (char_length(confirmation_note) <= 300),
  notify_owner boolean not null default true,
  calendar_token text not null unique default replace(gen_random_uuid()::text, '-', ''),
  updated_at timestamptz not null default now()
);

create table public.establishment_bookings (
  id uuid primary key default gen_random_uuid(),
  establishment_id uuid not null references public.establishments (id) on delete cascade,
  token text not null unique check (char_length(token) between 20 and 64),
  service_id uuid references public.establishment_services (id) on delete set null,
  staff_id uuid references public.establishment_staff (id) on delete set null,
  party_size integer check (party_size between 1 and 1000),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  name text not null check (char_length(name) between 1 and 80),
  email text check (char_length(email) <= 200),
  phone text check (char_length(phone) <= 40),
  notes text check (char_length(notes) <= 500),
  status text not null default 'confirmed' check (status in ('confirmed', 'arrived', 'no_show', 'cancelled')),
  source text not null default 'online' check (source in ('online', 'staff')),
  reminder_sent_at timestamptz,
  cancelled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at > starts_at)
);

create index establishment_bookings_day_idx on public.establishment_bookings (establishment_id, starts_at);
create index establishment_bookings_reminder_idx on public.establishment_bookings (starts_at) where status = 'confirmed' and reminder_sent_at is null;

-- One-off blocked periods (a staff member's appointment, a private event…).
create table public.booking_blocks (
  id uuid primary key default gen_random_uuid(),
  establishment_id uuid not null references public.establishments (id) on delete cascade,
  staff_id uuid references public.establishment_staff (id) on delete cascade,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  reason text check (char_length(reason) <= 120),
  created_at timestamptz not null default now(),
  check (ends_at > starts_at)
);

create index booking_blocks_idx on public.booking_blocks (establishment_id, starts_at);

-- Takes a slot atomically. Service mode: the first professional of p_staff (in order) with no
-- overlapping booking or block gets it. Table mode: the seats booked for the same arrival time
-- (p_starts) plus this party must fit p_capacity; without professionals in service mode, no
-- overlapping booking at all. Raises 'slot_taken' otherwise.
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
      select coalesce(sum(coalesce(b.party_size, 1)), 0) into seats from public.establishment_bookings b
        where b.establishment_id = p_establishment and b.starts_at = p_starts and b.status in ('confirmed', 'arrived');
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

-- updated_at --------------------------------------------------------------------------------------

create trigger establishments_updated_at before update on public.establishments
  for each row execute function public.set_updated_at();
create trigger waitlist_settings_updated_at before update on public.waitlist_settings
  for each row execute function public.set_updated_at();
create trigger loyalty_programs_updated_at before update on public.loyalty_programs
  for each row execute function public.set_updated_at();
create trigger booking_pages_updated_at before update on public.booking_pages
  for each row execute function public.set_updated_at();
create trigger establishment_bookings_updated_at before update on public.establishment_bookings
  for each row execute function public.set_updated_at();

-- Row level security: service role only -----------------------------------------------------------

alter table public.establishments enable row level security;
alter table public.establishment_services enable row level security;
alter table public.establishment_staff enable row level security;
alter table public.establishment_hours enable row level security;
alter table public.establishment_closures enable row level security;
alter table public.waitlist_settings enable row level security;
alter table public.waitlist_entries enable row level security;
alter table public.loyalty_programs enable row level security;
alter table public.loyalty_cards enable row level security;
alter table public.loyalty_rewards enable row level security;
alter table public.loyalty_events enable row level security;
alter table public.booking_pages enable row level security;
alter table public.establishment_bookings enable row level security;
alter table public.booking_blocks enable row level security;

revoke all on table
  public.establishments, public.establishment_services, public.establishment_staff, public.establishment_hours,
  public.establishment_closures, public.waitlist_settings, public.waitlist_entries, public.loyalty_programs,
  public.loyalty_cards, public.loyalty_rewards, public.loyalty_events, public.booking_pages,
  public.establishment_bookings, public.booking_blocks
  from anon, authenticated;

revoke execute on function public.waitlist_join(uuid, text, text, integer, uuid, uuid, text, text, text, timestamptz) from anon, authenticated, public;
revoke execute on function public.loyalty_stamp(uuid, integer, text, boolean) from anon, authenticated, public;
revoke execute on function public.establishment_book(uuid, text, uuid, uuid[], integer, timestamptz, timestamptz, text, text, text, text, text, integer) from anon, authenticated, public;
grant execute on function public.waitlist_join(uuid, text, text, integer, uuid, uuid, text, text, text, timestamptz) to service_role;
grant execute on function public.loyalty_stamp(uuid, integer, text, boolean) to service_role;
grant execute on function public.establishment_book(uuid, text, uuid, uuid[], integer, timestamptz, timestamptz, text, text, text, text, text, integer) to service_role;
