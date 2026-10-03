-- Google's place identifiers, so each review can link straight to itself on Google Maps
-- (google.com/maps/reviews/data=...!1s<review id>!...!1s<fid>), where the owner can reply.
alter table public.review_businesses add column google_fid text;
alter table public.review_businesses add column google_place_id text;
