-- Video menus: a dish's YouTube video becomes optional (owner, 2026-10-15: «Vamos só usar bunny
-- agora», «mete o YouTube opcional»). A dish can live only on its own Bunny Stream video
-- (bunny_video_id); the menu shows it once that video is ready. A YouTube id, when there is one,
-- still has to be a valid 11-character id (the check passes on null).
--
-- Rollback (only while every dish still has a YouTube id):
--   alter table public.video_menu_dishes alter column video_id set not null;

begin;
alter table public.video_menu_dishes alter column video_id drop not null;
comment on column public.video_menu_dishes.video_id is 'YouTube video id (optional): played when the dish has no ready Bunny video (bunny_video_id).';
commit;
