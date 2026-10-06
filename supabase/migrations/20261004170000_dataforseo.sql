-- DataForSEO becomes the hosted source of Google review data (final solution chosen by the owner):
-- reviews + owner replies (Business Data API → Google Reviews), star distributions of a whole zone
-- in one request (SERP API → Google Maps) and single business details (My Business Info).
-- Verified customers keep using Google's official API; the local reader stays as a fallback.

-- Who runs each queued job, and the DataForSEO task ids it is waiting for.
alter table public.review_import_jobs
  add column provider text not null default 'dataforseo' check (provider in ('dataforseo', 'google', 'reader')),
  add column external_task_ids text[] not null default '{}',
  add column dispatched_at timestamptz;

-- Minimal per-review ledger of every Google place (customers and competitors): never texts, names
-- or photos. Lets the 12-month reply rate stay exact from short daily reads (7-day reply window).
create table public.place_reviews (
  place_id text not null,
  review_id text not null,
  published_at timestamptz not null,
  rating smallint not null check (rating between 1 and 5),
  replied boolean not null default false,
  replied_at timestamptz,
  first_seen_at timestamptz not null default now(),
  last_checked_at timestamptz not null default now(),
  primary key (place_id, review_id)
);
create index place_reviews_place_time on public.place_reviews (place_id, published_at desc);
alter table public.place_reviews enable row level security;
revoke all on table public.place_reviews from anon, authenticated;
