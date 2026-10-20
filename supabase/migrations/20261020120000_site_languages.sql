-- The site is in six languages (owner, 2026-10-20): demo bookings, info requests and cart orders now
-- store the language the visitor actually used, instead of folding es, fr, de and it into 'en'.
--
-- Additive only: each check constraint is widened from ('pt', 'en') to the six site languages. No
-- column, default or row changes; every existing row (pt or en) stays valid.
--
-- Rollback (in one transaction; also in supabase/rollbacks/20261020120000_site_languages.sql): map any
-- es, fr, de or it rows back to 'en', then restore the ('pt', 'en') constraints.

begin;

alter table public.bookings drop constraint if exists bookings_locale_check;
alter table public.bookings add constraint bookings_locale_check check (locale in ('pt', 'en', 'es', 'fr', 'de', 'it'));

alter table public.leads drop constraint if exists leads_locale_check;
alter table public.leads add constraint leads_locale_check check (locale in ('pt', 'en', 'es', 'fr', 'de', 'it'));

alter table public.orders drop constraint if exists orders_locale_check;
alter table public.orders add constraint orders_locale_check check (locale in ('pt', 'en', 'es', 'fr', 'de', 'it'));

commit;
