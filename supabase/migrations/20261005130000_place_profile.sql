-- Extra competition factors read from the place's own Google Maps page (no reviews read): the
-- number of photos and how complete the profile is (claimed, website, phone, hours, description).
alter table public.competitor_snapshots
  add column if not exists photos_count integer,
  add column if not exists profile jsonb;
