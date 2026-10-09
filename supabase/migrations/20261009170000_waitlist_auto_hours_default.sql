-- New queues open and close with the opening hours by default (the owner can still switch it off,
-- and open or close by hand at any time). Without opening hours nothing changes on its own.
-- Existing queues keep their setting.

alter table public.waitlist_settings alter column auto_hours set default true;
