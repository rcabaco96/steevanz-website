-- Google review analytics for NFC plate customers.
-- Access model: same as the booking schema. RLS enabled with no policies, so anon and
-- authenticated roles have no direct access; server code uses the service role.

create table public.review_businesses (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and length(slug) <= 60),
  name text not null check (length(name) between 1 and 160),
  google_maps_url text not null check (google_maps_url ~ '^https://'),
  review_url text not null check (review_url ~ '^https://'),
  plates_installed_on date,
  rating_total numeric(2, 1),
  reviews_total integer,
  last_synced_at timestamptz,
  last_sync_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.nfc_plates (
  code text primary key check (code ~ '^[a-z0-9]{4,16}$'),
  business_id uuid not null references public.review_businesses (id) on delete cascade,
  label text not null check (length(label) between 1 and 80),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create index nfc_plates_business_idx on public.nfc_plates (business_id);

create table public.nfc_taps (
  id bigint generated always as identity primary key,
  plate_code text not null references public.nfc_plates (code) on delete cascade,
  business_id uuid not null references public.review_businesses (id) on delete cascade,
  source text not null check (source in ('nfc', 'qr')),
  device text not null check (device in ('ios', 'android', 'other')),
  visitor_hash text not null,
  tapped_at timestamptz not null default now()
);

create index nfc_taps_business_time_idx on public.nfc_taps (business_id, tapped_at desc);

create table public.google_reviews (
  review_id text primary key,
  business_id uuid not null references public.review_businesses (id) on delete cascade,
  rating smallint not null check (rating between 1 and 5),
  text text,
  language text,
  published_at timestamptz not null,
  owner_reply text,
  owner_replied_at timestamptz,
  reviewer_review_count integer,
  reviewer_is_local_guide boolean not null default false,
  likes integer not null default 0,
  fetched_at timestamptz not null default now()
);

create index google_reviews_business_time_idx on public.google_reviews (business_id, published_at desc);

create trigger review_businesses_updated_at before update on public.review_businesses
  for each row execute function public.set_updated_at();

alter table public.review_businesses enable row level security;
alter table public.nfc_plates enable row level security;
alter table public.nfc_taps enable row level security;
alter table public.google_reviews enable row level security;

revoke all on table
  public.review_businesses,
  public.nfc_plates,
  public.nfc_taps,
  public.google_reviews
from anon, authenticated;
