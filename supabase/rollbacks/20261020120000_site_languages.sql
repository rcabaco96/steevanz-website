-- Rollback of supabase/migrations/20261020120000_site_languages.sql (one transaction).
-- Rows stored in es, fr, de or it go back to 'en' (as the site stored them before), then the
-- ('pt', 'en') check constraints are restored.
begin;

update public.bookings set locale = 'en' where locale in ('es', 'fr', 'de', 'it');
update public.leads set locale = 'en' where locale in ('es', 'fr', 'de', 'it');
update public.orders set locale = 'en' where locale in ('es', 'fr', 'de', 'it');

alter table public.bookings drop constraint if exists bookings_locale_check;
alter table public.bookings add constraint bookings_locale_check check (locale in ('pt', 'en'));

alter table public.leads drop constraint if exists leads_locale_check;
alter table public.leads add constraint leads_locale_check check (locale in ('pt', 'en'));

alter table public.orders drop constraint if exists orders_locale_check;
alter table public.orders add constraint orders_locale_check check (locale in ('pt', 'en'));

commit;
