-- Video menus in six languages (owner, 2026-10-19): Portuguese stays the source (the columns as they
-- are), and each dish, collection and menu gets its translations in English, Spanish, French, German
-- and Italian, written by Steevanz in /admin/menus (no paid translation service). The customer picks
-- the language in the menu; anything not translated shows in Portuguese.
--
--   video_menu_dishes.translations       {"en": {"name": "…", "description": "…"}, "es": {…}, …}
--   video_menu_collections.translations  {"en": {"name": "…"}, …}
--   video_menus.translations             {"en": {…}, …} (the menu's own public texts, when it has any)
--   video_menu_orders.customer_language  the language the customer ordered in ('pt', 'en', …); the
--                                        staff's page always shows the Portuguese names, plus this.
--
-- Access as before: RLS on, no grants to anon or authenticated; only the server (service role) reads
-- and writes these columns.
--
-- Additive only: four new columns with defaults (no row changes meaning), no drops or renames.
--
-- Rollback (in one transaction; also in supabase/rollbacks/20261019200000_video_menu_translations.sql):
--   begin;
--   alter table public.video_menu_orders drop column if exists customer_language;
--   alter table public.video_menus drop column if exists translations;
--   alter table public.video_menu_collections drop column if exists translations;
--   alter table public.video_menu_dishes drop column if exists translations;
--   commit;

begin;

alter table public.video_menu_dishes
  add column translations jsonb not null default '{}'::jsonb
  check (jsonb_typeof(translations) = 'object' and octet_length(translations::text) <= 8000);
comment on column public.video_menu_dishes.translations is
  'The dish in other languages: {"en": {"name": "…", "description": "…"}, "es": …}. Portuguese is name/description; a missing one shows in Portuguese.';

alter table public.video_menu_collections
  add column translations jsonb not null default '{}'::jsonb
  check (jsonb_typeof(translations) = 'object' and octet_length(translations::text) <= 2000);
comment on column public.video_menu_collections.translations is
  'The collection''s name in other languages: {"en": {"name": "…"}, …}. A missing one shows in Portuguese.';

alter table public.video_menus
  add column translations jsonb not null default '{}'::jsonb
  check (jsonb_typeof(translations) = 'object' and octet_length(translations::text) <= 8000);
comment on column public.video_menus.translations is
  'The menu''s own public texts in other languages: {"en": {…}, …}. A missing one shows in Portuguese.';

alter table public.video_menu_orders
  add column customer_language text
  check (customer_language is null or customer_language in ('pt', 'en', 'es', 'fr', 'de', 'it'));
comment on column public.video_menu_orders.customer_language is
  'The language the customer''s menu was in when the order was placed (the staff see the Portuguese names and this note).';

commit;
