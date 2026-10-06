-- Client access to a review panel. Until the owner's email is known the business itself holds the
-- contact (name, phone); with an email, a login account is created silently and linked through
-- owner_id, and the invite (a sign-in link to the panel) is sent from the admin when the business
-- becomes a client.

alter table public.review_businesses
  add column if not exists contact_name text check (char_length(contact_name) <= 120),
  add column if not exists contact_phone text check (char_length(contact_phone) <= 40),
  add column if not exists invite_sent_at timestamptz;
