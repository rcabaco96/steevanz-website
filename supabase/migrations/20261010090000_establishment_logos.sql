-- The establishment's logo: the icon of the queue ticket on the phone's home screen and of its
-- notifications (on iPhone the notification shows the home-screen icon). Without a logo, the icon
-- is the establishment's initials on its colour.
--
-- Files live in a public Storage bucket under "<establishment_id>/<random>.<ext>": anyone may read
-- them by URL (a public bucket needs no policy for that; they are drawn into public icons), only
-- the server writes them, with the service role, after checking the session (owner of the
-- establishment or admin). No policies for anon or authenticated on storage.objects for this
-- bucket, so their API keys can't list, upload or delete.

alter table public.establishments
  add column logo_path text
    check (logo_path is null or (char_length(logo_path) <= 200 and logo_path ~ '^[0-9a-f-]{36}/[A-Za-z0-9_-]+\.(png|jpg)$'));

-- "Send a test notification" from the ticket page: at most once every 30 seconds per ticket.
alter table public.waitlist_entries
  add column push_test_at timestamptz;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('establishment-logos', 'establishment-logos', true, 2097152, array['image/png', 'image/jpeg'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;
