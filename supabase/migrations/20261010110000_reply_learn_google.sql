-- The AI replies learn from the replies the owner already gave on Google (owner, 2026-10-09: «ao
-- leres as reviews do cliente, já treinas as respostas IA com as respostas que o próprio cliente já
-- deu às reviews»). Business rule: regras-negocio-reviews, rule 11.
--
-- google_reviews.owner_reply is the source (the owner's real voice). Its sentences are learned per
-- tone like everything else: into the current tone when the reader stores the replies (end of every
-- full/update job) or when the replies page / «Atualizar» runs, and into a new tone when the
-- settings form creates it (each tone starts from the owner's Google replies, which are source data,
-- not feedback given under another tone). Before the first tone exists nothing is stored: the
-- replies stay in google_reviews and are learned when the form is saved.
--
-- review_reply_snippets.source 'google': a sentence learned from a reply on Google.
-- review_reply_google_learned: which owner reply was learned under which tone (one row per tone and
--   review), so a reply is never learned twice. reply_key is replyKey() of the reply learned: when
--   the owner edits the reply on Google the key changes and the new text is learned again (sentences
--   learned before stay: learning is never deleted). Also keeps those reviews out of «Treinar».
-- Additive only; until it is applied the app skips this learning and works as before.

alter table public.review_reply_snippets drop constraint if exists review_reply_snippets_source_check;
alter table public.review_reply_snippets
  add constraint review_reply_snippets_source_check check (source in ('training', 'edit', 'google'));

create table if not exists public.review_reply_google_learned (
  profile_id uuid not null references public.review_reply_profiles (id) on delete cascade,
  review_id text not null references public.google_reviews (review_id) on delete cascade,
  business_id uuid not null references public.review_businesses (id) on delete cascade,
  reply_key text not null,
  learned_at timestamptz not null default now(),
  primary key (profile_id, review_id)
);
create index if not exists review_reply_google_learned_business on public.review_reply_google_learned (business_id, profile_id);

alter table public.review_reply_google_learned enable row level security;
