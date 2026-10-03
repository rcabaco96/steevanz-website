-- Business rule: all training, learning and evolution is kept per "tone", where a tone is the set
-- of answers in the reply settings form (signature, address form, tones, length, emojis, replies
-- for star-only reviews, contact for negatives). Changing the form starts a new tone; the old one
-- and everything it learned stays stored, and comes back if the same answers are chosen again.

create table public.review_reply_profiles (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.review_businesses (id) on delete cascade,
  fingerprint text not null,
  settings jsonb not null,
  created_at timestamptz not null default now(),
  last_used_at timestamptz not null default now(),
  unique (business_id, fingerprint)
);

alter table public.review_reply_settings add column profile_id uuid references public.review_reply_profiles (id) on delete set null;
alter table public.review_reply_snippets add column profile_id uuid references public.review_reply_profiles (id) on delete cascade;
alter table public.review_reply_drafts add column profile_id uuid references public.review_reply_profiles (id) on delete set null;
alter table public.review_reply_training add column profile_id uuid references public.review_reply_profiles (id) on delete cascade;

-- A review can be trained once per tone. Rows saved before tones existed keep a null profile until
-- the app attaches them to the business's current tone.
alter table public.review_reply_training drop constraint review_reply_training_pkey;
alter table public.review_reply_training add column id uuid primary key default gen_random_uuid();
create unique index review_reply_training_profile on public.review_reply_training (business_id, profile_id, review_id);

create index review_reply_snippets_profile on public.review_reply_snippets (profile_id, sentiment, kind);
create index review_reply_drafts_profile on public.review_reply_drafts (profile_id, status);

alter table public.review_reply_profiles enable row level security;
