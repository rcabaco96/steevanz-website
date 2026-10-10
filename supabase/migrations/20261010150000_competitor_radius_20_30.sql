-- Competitor search radius per customer: 20 and 30 km too (owner, 2026-10-10), next to 5 and 10 km
-- (business rule 5). Only the allowed values change; 10 km stays the default.

alter table public.review_businesses drop constraint if exists review_businesses_competitor_radius_km_check;
alter table public.review_businesses
  add constraint review_businesses_competitor_radius_km_check check (competitor_radius_km in (5, 10, 20, 30));

alter table public.review_businesses drop constraint if exists review_businesses_competitors_search_radius_km_check;
alter table public.review_businesses
  add constraint review_businesses_competitors_search_radius_km_check check (competitors_search_radius_km is null or competitors_search_radius_km in (5, 10, 20, 30));
