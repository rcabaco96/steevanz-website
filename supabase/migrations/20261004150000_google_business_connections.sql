-- Customers can connect their Google Business Profile (OAuth, scope business.manage). Business rule:
-- every customer is marked as connected or not (review_businesses.google_link_status), and the panel
-- always encourages connecting (faster updates through Google's official API, and proof that the
-- customer really manages the profile).

alter table public.review_businesses
  add column google_link_status text not null default 'not_connected'
    check (google_link_status in ('not_connected', 'pending_location', 'connected', 'error')),
  add column google_linked_at timestamptz;

-- One connection per customer. Tokens are encrypted by the app (AES-256-GCM, key GOOGLE_TOKEN_KEY);
-- only the service role reads this table.
create table public.google_connections (
  business_id uuid primary key references public.review_businesses (id) on delete cascade,
  google_email text,
  account_name text,
  location_name text,
  location_title text,
  location_place_id text,
  -- Locations the Google account manages, while the customer has not picked one yet.
  location_options jsonb,
  refresh_token_enc text,
  access_token_enc text,
  access_expires_at timestamptz,
  scopes text[] not null default '{}',
  connected_at timestamptz not null default now(),
  last_sync_at timestamptz,
  last_error text,
  updated_at timestamptz not null default now()
);
alter table public.google_connections enable row level security;
revoke all on table public.google_connections from anon, authenticated;

-- Google's official id of a review (Business Profile API), next to the Maps id we already store.
alter table public.google_reviews add column gbp_review_id text;
create unique index google_reviews_gbp_review_id on public.google_reviews (gbp_review_id) where gbp_review_id is not null;
