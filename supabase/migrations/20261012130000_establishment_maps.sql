-- The establishment on Google Maps (owner, 2026-10-12): set by an admin from the place's Maps link,
-- shown on the customer pages of every product (queue, card, bookings) as «Abrir no Google Maps» and
-- «Deixar avaliação» (Google's write-a-review window, from the place id in the link).

alter table public.establishments
  add column maps_url text check (char_length(maps_url) <= 1000),
  add column review_url text check (char_length(review_url) <= 500);
