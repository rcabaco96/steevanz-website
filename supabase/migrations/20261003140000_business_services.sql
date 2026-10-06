-- Steevanz products the customer already has, so the dashboard never promotes them.

alter table public.review_businesses
  add column active_services text[] not null default '{}';
