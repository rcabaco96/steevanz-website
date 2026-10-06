-- Email address that receives an alert when a new negative review (1-2 stars) is imported.

alter table public.review_businesses
  add column alert_email text check (alert_email is null or alert_email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$');
