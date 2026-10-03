-- Replies are built by rules (no paid AI): each business gets a library of its own sentences,
-- learned from the replies the owner writes in "Treinar" and from edits before approving.

create table public.review_reply_snippets (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.review_businesses (id) on delete cascade,
  kind text not null check (kind in ('opening', 'theme', 'contact', 'closing')),
  sentiment text not null check (sentiment in ('positive', 'negative')),
  theme text,
  text text not null check (length(text) between 2 and 400),
  source text not null default 'training' check (source in ('training', 'edit')),
  from_review_id text references public.google_reviews (review_id) on delete set null,
  accepted integer not null default 0,
  rejected integer not null default 0,
  disabled boolean not null default false,
  created_at timestamptz not null default now()
);
create index review_reply_snippets_business on public.review_reply_snippets (business_id, sentiment, kind);

-- Reviews the owner answered while training, so the same review is never asked twice.
create table public.review_reply_training (
  business_id uuid not null references public.review_businesses (id) on delete cascade,
  review_id text not null references public.google_reviews (review_id) on delete cascade,
  answer text not null default '',
  skipped boolean not null default false,
  created_at timestamptz not null default now(),
  primary key (business_id, review_id)
);

-- Which sentences a draft used: "default:<id>" for Steevanz base sentences, the uuid for the owner's.
alter table public.review_reply_drafts add column snippet_ids text[] not null default '{}';

alter table public.review_reply_snippets enable row level security;
alter table public.review_reply_training enable row level security;
