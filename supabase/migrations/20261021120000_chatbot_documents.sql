-- Documents for the WhatsApp assistant (owner, 2026-10-20): the business gives the assistant PDFs,
-- Word files, text, Markdown or a web page; the admin extracts the text on the server (free code),
-- cuts it into titled sections and the assistant searches them (BM25, zero cost) to answer.
-- Needs 20261020200000_chatbot.sql first.
--
-- Only the extracted text is kept (no file storage). A later phase can add an embedding column to
-- chatbot_document_chunks (pgvector) without changing these rows.
--
-- Access model: RLS on, no grants to anon/authenticated (service role only), like the other chatbot
-- tables. Additive only. NOT APPLIED: waiting for the owner's approval.
-- Rollback (one transaction): supabase/rollbacks/20261021120000_chatbot_documents.sql.

begin;

create table public.chatbot_documents (
  id uuid primary key default gen_random_uuid(),
  bot_id uuid not null references public.chatbot_bots (id) on delete cascade,
  title text not null check (char_length(title) between 1 and 200),
  -- Where it came from: an uploaded file, pasted text or a web address.
  source text not null check (source in ('upload', 'text', 'url')),
  kind text not null check (kind in ('pdf', 'docx', 'text', 'markdown', 'html')),
  file_name text check (char_length(file_name) <= 255),
  source_url text check (source_url is null or (char_length(source_url) <= 500 and source_url ~ '^https://')),
  -- Lodging with several properties: the property this document is about (null = all).
  property text check (char_length(property) <= 120),
  -- The language it is written in (null = the bot's default language).
  language text check (language in ('pt', 'en', 'es', 'fr', 'de', 'it')),
  char_count integer not null default 0 check (char_count >= 0),
  chunk_count integer not null default 0 check (chunk_count >= 0),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index chatbot_documents_bot_idx on public.chatbot_documents (bot_id, created_at);

create table public.chatbot_document_chunks (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.chatbot_documents (id) on delete cascade,
  bot_id uuid not null references public.chatbot_bots (id) on delete cascade,
  position integer not null check (position >= 0),
  -- «Título do documento › Secção».
  heading text not null check (char_length(heading) between 1 and 500),
  body text not null check (char_length(body) between 1 and 4000),
  created_at timestamptz not null default now(),
  unique (document_id, position)
);

create index chatbot_document_chunks_bot_idx on public.chatbot_document_chunks (bot_id);

create trigger chatbot_documents_updated_at before update on public.chatbot_documents
  for each row execute function public.set_updated_at();

alter table public.chatbot_documents enable row level security;
alter table public.chatbot_document_chunks enable row level security;

revoke all on table public.chatbot_documents, public.chatbot_document_chunks from anon, authenticated;

commit;
