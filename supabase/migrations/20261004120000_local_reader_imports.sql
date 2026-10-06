-- Reviews read by the Steevanz reader running on a local computer (no paid scraper).
-- The panel queues a job; the reader picks it up, reads Google Maps and reports progress here.

create table public.review_import_jobs (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.review_businesses (id) on delete cascade,
  kind text not null default 'full' check (kind in ('full', 'update')),
  status text not null default 'queued' check (status in ('queued', 'running', 'done', 'failed')),
  reviews_expected integer,
  reviews_done integer not null default 0,
  pages_done integer not null default 0,
  avg_page_ms integer,
  error text,
  requested_at timestamptz not null default now(),
  started_at timestamptz,
  finished_at timestamptz,
  updated_at timestamptz not null default now()
);
-- One active job per business.
create unique index review_import_jobs_active on public.review_import_jobs (business_id) where status in ('queued', 'running');
create index review_import_jobs_business on public.review_import_jobs (business_id, requested_at desc);

-- Heartbeat of the local reader, so the panel can say whether it is switched on.
create table public.review_reader_status (
  id text primary key,
  last_seen_at timestamptz not null default now(),
  version text,
  busy boolean not null default false
);

alter table public.review_import_jobs enable row level security;
alter table public.review_reader_status enable row level security;
