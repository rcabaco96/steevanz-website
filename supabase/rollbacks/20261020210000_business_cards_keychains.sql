-- Rollback of supabase/migrations/20261020210000_business_cards_keychains.sql (one transaction).
-- Drops the two tables (every card and tag added in the admin goes with them) and the tap function.
-- The site keeps working: /c/<slug> falls back to src/content/business-cards.ts and /k/<code> gives
-- «página não encontrada».
--
-- The Storage bucket «business-card-photos» is left in place: Supabase refuses direct deletes on the
-- storage tables. Empty and delete it in the dashboard (Storage) if it is no longer wanted.
begin;

drop function if exists public.keychain_tag_tap(text);
drop table if exists public.keychain_tags;
drop table if exists public.business_cards;

commit;
