-- Nearby competitors for the review dashboard. Only public aggregate Google data is stored
-- (rating, review count, star distribution): no review text and no personal data.

alter table public.review_businesses
  add column place_id text,
  add column lat double precision,
  add column lng double precision,
  add column category text,
  add column competitors_refreshed_at timestamptz;

-- One row per place compared, including the customer's own place (is_self).
create table public.competitors (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.review_businesses (id) on delete cascade,
  place_id text not null,
  name text not null,
  category text,
  address text,
  url text,
  lat double precision,
  lng double precision,
  distance_m integer,
  is_self boolean not null default false,
  excluded boolean not null default false,
  pace_per_month numeric(7, 2),
  pace_measured_at timestamptz,
  created_at timestamptz not null default now(),
  unique (business_id, place_id)
);

create index competitors_business_idx on public.competitors (business_id);

create table public.competitor_snapshots (
  id bigint generated always as identity primary key,
  competitor_id uuid not null references public.competitors (id) on delete cascade,
  taken_on date not null default current_date,
  rating numeric(2, 1),
  average numeric(4, 3),
  reviews_count integer not null,
  distribution jsonb,
  unique (competitor_id, taken_on)
);

alter table public.competitors enable row level security;
alter table public.competitor_snapshots enable row level security;

revoke all on table public.competitors, public.competitor_snapshots from anon, authenticated;
