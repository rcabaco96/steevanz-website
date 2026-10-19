-- Rollback of supabase/migrations/20261019200000_video_menu_translations.sql (one transaction).
-- Drops the translations written in /admin/menus and the orders' customer language.
begin;
alter table public.video_menu_orders drop column if exists customer_language;
alter table public.video_menus drop column if exists translations;
alter table public.video_menu_collections drop column if exists translations;
alter table public.video_menu_dishes drop column if exists translations;
commit;
