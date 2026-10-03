-- Every alternative shown by "Outra resposta", picked or not: alternatives never repeat a text
-- already shown for the same review, and what the owner skipped is kept as learning (per tone).

create table public.review_reply_alternatives (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.review_businesses (id) on delete cascade,
  review_id text not null references public.google_reviews (review_id) on delete cascade,
  draft_id uuid references public.review_reply_drafts (id) on delete set null,
  profile_id uuid references public.review_reply_profiles (id) on delete set null,
  reply text not null,
  reply_key text not null,
  reasoning text not null default '',
  snippet_ids text[] not null default '{}',
  chosen boolean not null default false,
  created_at timestamptz not null default now()
);
create index review_reply_alternatives_review on public.review_reply_alternatives (business_id, review_id);

alter table public.review_reply_alternatives enable row level security;
