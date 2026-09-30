-- Steevanz demo bookings and leads.
-- Access model: RLS enabled everywhere with no policies, so anon and authenticated
-- roles have no direct access. All reads and writes go through server code using
-- the service role, after the server has verified the admin session.

create extension if not exists pgcrypto;

create type public.pipeline_status as enum (
  'new',
  'contacted',
  'scheduled',
  'closed',
  'lost',
  'cancelled'
);

create type public.lead_kind as enum ('info_request', 'waitlist');

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Availability configuration

create table public.booking_settings (
  id smallint primary key default 1 check (id = 1),
  timezone text not null default 'Europe/Lisbon',
  min_notice_hours integer not null default 12 check (min_notice_hours between 0 and 720),
  max_days_ahead integer not null default 30 check (max_days_ahead between 1 and 365),
  updated_at timestamptz not null default now()
);

create table public.availability_rules (
  id uuid primary key default gen_random_uuid(),
  weekday smallint not null check (weekday between 0 and 6),
  start_time time not null,
  end_time time not null,
  slot_minutes integer not null default 30 check (slot_minutes between 5 and 480),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (end_time > start_time)
);

create index availability_rules_weekday_idx on public.availability_rules (weekday);

create table public.availability_breaks (
  id uuid primary key default gen_random_uuid(),
  weekday smallint not null check (weekday between 0 and 6),
  start_time time not null,
  end_time time not null,
  created_at timestamptz not null default now(),
  check (end_time > start_time)
);

create table public.blocked_dates (
  id uuid primary key default gen_random_uuid(),
  date date not null unique,
  reason text check (char_length(reason) <= 200),
  created_at timestamptz not null default now()
);

-- Conversions

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  product_id text,
  slot_start timestamptz not null,
  slot_end timestamptz not null,
  name text not null check (char_length(name) between 1 and 120),
  email text not null check (char_length(email) between 3 and 200),
  phone text check (char_length(phone) <= 40),
  business_name text check (char_length(business_name) <= 160),
  sector text check (char_length(sector) <= 60),
  message text check (char_length(message) <= 2000),
  locale text not null default 'pt' check (locale in ('pt', 'en')),
  status public.pipeline_status not null default 'new',
  admin_notes text check (char_length(admin_notes) <= 5000),
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_term text,
  utm_content text,
  referrer text,
  consent_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (slot_end > slot_start)
);

-- One active booking per slot. Cancelled bookings free the slot again.
create unique index bookings_slot_unique_active
  on public.bookings (slot_start)
  where status <> 'cancelled';

create index bookings_slot_start_idx on public.bookings (slot_start);
create index bookings_created_at_idx on public.bookings (created_at desc);
create index bookings_status_idx on public.bookings (status);

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  product_id text,
  kind public.lead_kind not null default 'info_request',
  name text not null check (char_length(name) between 1 and 120),
  email text not null check (char_length(email) between 3 and 200),
  phone text check (char_length(phone) <= 40),
  business_name text check (char_length(business_name) <= 160),
  sector text check (char_length(sector) <= 60),
  message text check (char_length(message) <= 2000),
  locale text not null default 'pt' check (locale in ('pt', 'en')),
  status public.pipeline_status not null default 'new',
  admin_notes text check (char_length(admin_notes) <= 5000),
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_term text,
  utm_content text,
  referrer text,
  consent_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index leads_created_at_idx on public.leads (created_at desc);
create index leads_status_idx on public.leads (status);

-- Best-effort rate limiting for public forms (hashed IPs only).

create table public.submission_attempts (
  id bigint generated always as identity primary key,
  ip_hash text not null,
  kind text not null,
  created_at timestamptz not null default now()
);

create index submission_attempts_lookup_idx on public.submission_attempts (ip_hash, created_at desc);

-- updated_at triggers

create trigger booking_settings_updated_at before update on public.booking_settings
  for each row execute function public.set_updated_at();
create trigger availability_rules_updated_at before update on public.availability_rules
  for each row execute function public.set_updated_at();
create trigger bookings_updated_at before update on public.bookings
  for each row execute function public.set_updated_at();
create trigger leads_updated_at before update on public.leads
  for each row execute function public.set_updated_at();

-- Lock everything down: service role only.

alter table public.booking_settings enable row level security;
alter table public.availability_rules enable row level security;
alter table public.availability_breaks enable row level security;
alter table public.blocked_dates enable row level security;
alter table public.bookings enable row level security;
alter table public.leads enable row level security;
alter table public.submission_attempts enable row level security;

revoke all on table
  public.booking_settings,
  public.availability_rules,
  public.availability_breaks,
  public.blocked_dates,
  public.bookings,
  public.leads,
  public.submission_attempts
from anon, authenticated;

revoke execute on function public.set_updated_at() from anon, authenticated, public;
