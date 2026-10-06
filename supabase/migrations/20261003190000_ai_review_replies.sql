-- "Respostas IA": Claude drafts replies to Google reviews in the customer's own voice.
-- Not connected to Google Business Profile yet: approving only marks a reply as approved.

create table public.review_reply_settings (
  business_id uuid primary key references public.review_businesses (id) on delete cascade,
  -- Step 1: identity and tone
  signature text not null default '',
  address_form text not null default 'voce' check (address_form in ('voce', 'tu', 'neutro')),
  tone text[] not null default '{}',
  length text not null default 'curta' check (length in ('curta', 'media')),
  emojis boolean not null default false,
  -- Step 2: replies the customer wrote to some of their own real reviews
  examples jsonb not null default '[]'::jsonb,
  -- Step 3: reviews with stars only
  empty_positive text not null default '',
  empty_negative text not null default '',
  -- Step 4: rules, contact and automatic replies
  highlights text not null default '',
  avoid text not null default '',
  negative_contact text not null default '',
  auto_mode text not null default 'off' check (auto_mode in ('off', 'limit', 'always')),
  auto_limit integer not null default 10 check (auto_limit between 1 and 500),
  auto_used integer not null default 0,
  auto_negative boolean not null default false,
  onboarded_at timestamptz,
  updated_at timestamptz not null default now()
);

create table public.review_reply_drafts (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.review_businesses (id) on delete cascade,
  review_id text not null references public.google_reviews (review_id) on delete cascade,
  -- generating: claimed by a request that is calling Claude (acts as a lock)
  status text not null default 'generating' check (status in ('generating', 'pending', 'approved', 'rejected')),
  reply text not null default '',
  reasoning text not null default '',
  model text,
  approved_by text check (approved_by in ('client', 'auto')),
  edited boolean not null default false,
  original_reply text,
  feedback_reasons text[] not null default '{}',
  feedback_note text not null default '',
  error text,
  created_at timestamptz not null default now(),
  decided_at timestamptz
);

-- At most one live draft per review; rejected drafts stay as history and learning material.
create unique index review_reply_drafts_live on public.review_reply_drafts (review_id) where status in ('generating', 'pending', 'approved');
create index review_reply_drafts_business on public.review_reply_drafts (business_id, status, created_at desc);

alter table public.review_reply_settings enable row level security;
alter table public.review_reply_drafts enable row level security;
