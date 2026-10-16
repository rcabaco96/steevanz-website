-- Video menus: a dish's own (Bunny) video gets a small picture (owner, 2026-10-16). Bunny's own
-- thumbnail is the video's full size (up to 4K, ~270 KB) for a card of ~170 px; the small one (540 px,
-- ~25 KB) is set on Bunny under a name Bunny picks (thumbnail_<hash>.jpg), kept here. Null: Bunny's
-- default thumbnail.jpg.
--
-- Rollback:
--   alter table public.video_menu_dishes drop column bunny_thumbnail;

begin;
alter table public.video_menu_dishes
  add column bunny_thumbnail text check (bunny_thumbnail ~ '^thumbnail[A-Za-z0-9_-]*\.(jpg|jpeg|png|webp)$');
comment on column public.video_menu_dishes.bunny_thumbnail is 'File name of the small picture of the Bunny video (bunny_video_id); null: thumbnail.jpg.';
commit;
