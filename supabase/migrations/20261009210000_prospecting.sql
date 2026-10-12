-- Prospecting: lists of local businesses to offer Steevanz to, searched by kind and area from the
-- admin. The search runs on a computer of ours (the open-source google-maps-scraper in Docker, only
-- on localhost, driven by scripts/prospector); the site only queues searches and shows results.
-- Only public business data from Google Maps (and the email on the business's own website).
-- Service role only: nothing here is readable with the public keys.

create table public.prospect_searches (
  id uuid primary key default gen_random_uuid(),
  -- What and where, as typed in the admin ("barbearias", "Porto").
  query text not null check (char_length(query) between 2 and 80),
  area text not null check (char_length(area) between 2 and 80),
  max_results integer not null default 60 check (max_results between 10 and 300),
  status text not null default 'queued' check (status in ('queued', 'running', 'done', 'failed')),
  error text check (char_length(error) <= 500),
  results integer,
  new_results integer,
  -- The scraper's own job id while it runs.
  scraper_job text,
  requested_by text,
  created_at timestamptz not null default now(),
  started_at timestamptz,
  finished_at timestamptz
);
create index prospect_searches_created_idx on public.prospect_searches (created_at desc);
create index prospect_searches_queued_idx on public.prospect_searches (created_at) where status = 'queued';

create table public.prospects (
  -- One row per Google place, whatever search found it.
  place_id text primary key check (char_length(place_id) between 3 and 300),
  name text not null check (char_length(name) between 1 and 200),
  category text check (char_length(category) <= 120),
  address text check (char_length(address) <= 300),
  phone text check (char_length(phone) <= 60),
  website text check (char_length(website) <= 500),
  email text check (char_length(email) <= 200),
  rating numeric(2, 1) check (rating between 0 and 5),
  reviews integer check (reviews >= 0),
  latitude double precision,
  longitude double precision,
  maps_url text check (char_length(maps_url) <= 1000),
  -- Where we are with them.
  status text not null default 'new' check (status in ('new', 'contacted', 'interested', 'discarded')),
  notes text check (char_length(notes) <= 2000),
  first_search_id uuid references public.prospect_searches (id) on delete set null,
  last_search_id uuid references public.prospect_searches (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index prospects_status_idx on public.prospects (status);
create index prospects_last_search_idx on public.prospects (last_search_id);

alter table public.prospect_searches enable row level security;
alter table public.prospects enable row level security;
revoke all on public.prospect_searches, public.prospects from anon, authenticated;
