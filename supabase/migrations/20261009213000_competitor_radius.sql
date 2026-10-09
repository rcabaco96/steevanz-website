-- Competitor search radius per customer (business rule 5): 5 or 10 km, chosen by an admin when the
-- customer is created (10 km by default) and editable only by an admin afterwards. When an admin saves
-- another radius, a new search ("discover", free reader) is queued; the reader reads the radius when
-- the job starts and records the one it searched with, so a list searched with another radius than
-- the chosen one is searched again (also by the daily competitors cron).

alter table public.review_businesses
  add column if not exists competitor_radius_km smallint not null default 10,
  add column if not exists competitors_search_radius_km smallint;

alter table public.review_businesses
  add constraint review_businesses_competitor_radius_km_check check (competitor_radius_km in (5, 10));

alter table public.review_businesses
  add constraint review_businesses_competitors_search_radius_km_check check (competitors_search_radius_km is null or competitors_search_radius_km in (5, 10));

-- Every search so far used 10 km.
update public.review_businesses set competitors_search_radius_km = 10 where competitors_refreshed_at is not null and competitors_search_radius_km is null;
