-- One queue for everything the local reader does (contract shared by the reader, the panel and
-- the daily routine):
--   full                 whole history of a customer (first import, or twice a year)
--   update               new reviews + replies to recent unanswered ones ("Atualizar", daily routine)
--   competitor           one Google place for every customer that has it as competitor: rating,
--                        total, star distribution and new reviews (daily)
--   competitor_replies   same place: reply rate over the last 12 months, max 2000 reviews (every 2 weeks)
-- priority: 1 = someone is waiting in the panel, 3 = first import, 5 = routine.

alter table public.review_import_jobs drop constraint review_import_jobs_kind_check;
alter table public.review_import_jobs add constraint review_import_jobs_kind_check check (kind in ('full', 'update', 'competitor', 'competitor_replies'));
alter table public.review_import_jobs alter column business_id drop not null;
alter table public.review_import_jobs add column place_id text;
alter table public.review_import_jobs add column priority smallint not null default 5;
alter table public.review_import_jobs add column requested_by text not null default 'panel' check (requested_by in ('panel', 'cron', 'admin'));
alter table public.review_import_jobs add column reviews_new integer not null default 0;
alter table public.review_import_jobs add column reader_id text;
alter table public.review_import_jobs add constraint review_import_jobs_target check (business_id is not null or place_id is not null);

drop index public.review_import_jobs_active;
-- At most one active job of each kind per customer, and per Google place for competitor jobs.
create unique index review_import_jobs_active_business on public.review_import_jobs (business_id, kind) where status in ('queued', 'running') and business_id is not null;
create unique index review_import_jobs_active_place on public.review_import_jobs (place_id, kind) where status in ('queued', 'running') and place_id is not null;
create index review_import_jobs_queue on public.review_import_jobs (status, priority, requested_at);

-- Last time each Google place was read by the reader (shared by every customer that has it).
create table public.reader_places (
  place_id text primary key,
  read_on date,
  replies_read_on date,
  last_error text,
  updated_at timestamptz not null default now()
);
alter table public.reader_places enable row level security;

-- Competitor reply rate measured over 12 months by the reader (aggregate only, never texts).
alter table public.competitors add column replies_window_days integer;
