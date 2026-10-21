-- WhatsApp AI assistant («Chatbot com IA para site e WhatsApp», owner 2026-10-20). Phase 1: one bot
-- per business number, the business's own knowledge (FAQs, policies, information; plus its
-- establishment's hours/services and its video menu when linked), the WhatsApp session status for the
-- QR pairing in the admin, and the conversations with their messages and hand-off state.
-- Design and decisions: docs/chatbot/ARCHITECTURE.md.
--
-- Access model: RLS on, no grants to anon/authenticated, like the other admin tables (video menus).
-- The admin reads and writes through server code with the service role; the local runner
-- (scripts/chatbot) uses the service role too. Nothing here is public.
--
-- Additive only: new tables, one function, no change to existing tables or rows. NOT APPLIED: waiting
-- for the owner's approval. Rollback (one transaction): supabase/rollbacks/20261020200000_chatbot.sql.

begin;

-- Bots ------------------------------------------------------------------------------------------

create table public.chatbot_bots (
  id uuid primary key default gen_random_uuid(),
  -- The client who bought the product (profiles = client accounts).
  owner_id uuid not null references public.profiles (id) on delete cascade,
  -- Optional sources of knowledge: hours, closures, services, address and booking page of an
  -- establishment; dishes and prices of a video menu.
  establishment_id uuid references public.establishments (id) on delete set null,
  video_menu_id uuid references public.video_menus (id) on delete set null,
  name text not null check (char_length(name) between 1 and 120),
  kind text not null default 'restaurant' check (kind in ('restaurant', 'lodging', 'beauty', 'clinic', 'retail', 'other')),
  -- Off until the business has tested it and the number is paired.
  enabled boolean not null default false,
  -- How messages travel: open-wa (WhatsApp Web, unofficial) or the official Cloud API.
  channel_provider text not null default 'open-wa' check (channel_provider in ('open-wa', 'cloud-api')),
  whatsapp_number text check (char_length(whatsapp_number) <= 40),
  tone text not null default 'formal' check (tone in ('formal', 'friendly')),
  languages text[] not null default array['pt', 'en', 'es', 'fr', 'de', 'it']
    check (cardinality(languages) between 1 and 6 and languages <@ array['pt', 'en', 'es', 'fr', 'de', 'it']),
  default_language text not null default 'pt' check (default_language in ('pt', 'en', 'es', 'fr', 'de', 'it')),
  -- Own values; when empty, the linked establishment's (address, phone, Maps) are used.
  address text check (char_length(address) <= 200),
  phone text check (char_length(phone) <= 40),
  maps_url text check (maps_url is null or (char_length(maps_url) <= 500 and maps_url ~ '^https://')),
  booking_url text check (booking_url is null or (char_length(booking_url) <= 500 and booking_url ~ '^https://')),
  menu_url text check (menu_url is null or (char_length(menu_url) <= 500 and menu_url ~ '^https://')),
  privacy_url text check (privacy_url is null or (char_length(privacy_url) <= 500 and privacy_url ~ '^https://')),
  time_zone text not null default 'Europe/Lisbon' check (char_length(time_zone) <= 60),
  -- Lodging: up to five properties on one number (the product page promises five).
  properties text[] not null default '{}' check (cardinality(properties) <= 5),
  -- After the team took a chat over, give it back after this many minutes of the team's silence
  -- (null = only by hand in the admin).
  auto_resume_minutes integer check (auto_resume_minutes between 15 and 10080),
  -- Who writes the free answers: the free mock, or a real model (phase 2). A real model only runs
  -- when the owner also turns paid_answers_allowed on from the site.
  answer_provider text not null default 'mock' check (answer_provider in ('mock', 'real')),
  paid_answers_allowed boolean not null default false,
  -- The owner's own WhatsApp number, alerted on hand-offs (optional).
  alert_number text check (char_length(alert_number) <= 40),
  -- RGPD: messages older than this are deleted (chatbot_prune).
  retention_days integer not null default 180 check (retention_days between 7 and 730),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index chatbot_bots_owner_idx on public.chatbot_bots (owner_id);
-- One bot per WhatsApp number.
create unique index chatbot_bots_number_idx on public.chatbot_bots (whatsapp_number) where whatsapp_number is not null;

-- Knowledge -------------------------------------------------------------------------------------

create table public.chatbot_knowledge (
  id uuid primary key default gen_random_uuid(),
  bot_id uuid not null references public.chatbot_bots (id) on delete cascade,
  kind text not null default 'faq' check (kind in ('faq', 'policy', 'info')),
  question text not null check (char_length(question) between 1 and 300),
  answer text not null check (char_length(answer) between 1 and 2000),
  keywords text check (char_length(keywords) <= 300),
  -- Lodging with several properties: the property this entry is about (null = all).
  property text check (char_length(property) <= 120),
  -- The language it is written in (null = the bot's default language).
  language text check (language in ('pt', 'en', 'es', 'fr', 'de', 'it')),
  active boolean not null default true,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index chatbot_knowledge_bot_idx on public.chatbot_knowledge (bot_id, position);

-- WhatsApp session (written by the runner, read by the admin) --------------------------------------

create table public.chatbot_sessions (
  bot_id uuid primary key references public.chatbot_bots (id) on delete cascade,
  state text not null default 'stopped' check (state in ('stopped', 'starting', 'qr', 'connected', 'disconnected', 'error')),
  -- The pairing QR's text while state = 'qr' (the admin draws it); cleared once connected.
  qr text check (char_length(qr) <= 4000),
  qr_updated_at timestamptz,
  -- The number WhatsApp reports once paired.
  number text check (char_length(number) <= 40),
  -- Which computer runs it (hostname) and when it last said it was alive.
  runner_id text check (char_length(runner_id) <= 120),
  last_seen_at timestamptz,
  message text check (char_length(message) <= 500),
  updated_at timestamptz not null default now()
);

-- Conversations and messages --------------------------------------------------------------------

create table public.chatbot_conversations (
  id uuid primary key default gen_random_uuid(),
  bot_id uuid not null references public.chatbot_bots (id) on delete cascade,
  channel text not null default 'whatsapp' check (channel in ('whatsapp', 'web')),
  -- The chat id on the channel (WhatsApp: the customer's number). Personal data: kept only for the
  -- retention period with the messages.
  contact_id text not null check (char_length(contact_id) between 1 and 120),
  contact_name text check (char_length(contact_name) <= 120),
  -- The engine's memory of the chat (ConversationState in src/lib/chatbot/types.ts).
  state jsonb not null default '{}'::jsonb,
  -- Copied out of state for the inbox.
  mode text not null default 'bot' check (mode in ('bot', 'human')),
  language text check (language in ('pt', 'en', 'es', 'fr', 'de', 'it')),
  property text check (char_length(property) <= 120),
  handoff_reason text check (char_length(handoff_reason) <= 40),
  handoff_summary text check (char_length(handoff_summary) <= 2000),
  handoff_urgent boolean not null default false,
  handoff_at timestamptz,
  -- In the team's inbox until someone opens or resolves it.
  needs_attention boolean not null default false,
  last_customer_at timestamptz,
  last_message_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (bot_id, channel, contact_id)
);

create index chatbot_conversations_inbox_idx on public.chatbot_conversations (bot_id, needs_attention, last_message_at desc);

create table public.chatbot_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.chatbot_conversations (id) on delete cascade,
  bot_id uuid not null references public.chatbot_bots (id) on delete cascade,
  author text not null check (author in ('customer', 'bot', 'owner', 'system')),
  body text not null check (char_length(body) <= 4096),
  -- The channel's message id: a message is never processed twice.
  external_id text check (char_length(external_id) <= 200),
  intents text[] not null default '{}',
  provider text check (char_length(provider) <= 40),
  language text check (language in ('pt', 'en', 'es', 'fr', 'de', 'it')),
  created_at timestamptz not null default now()
);

create index chatbot_messages_conversation_idx on public.chatbot_messages (conversation_id, created_at);
create unique index chatbot_messages_external_idx on public.chatbot_messages (bot_id, external_id) where external_id is not null;

-- updated_at ------------------------------------------------------------------------------------

create trigger chatbot_bots_updated_at before update on public.chatbot_bots
  for each row execute function public.set_updated_at();
create trigger chatbot_knowledge_updated_at before update on public.chatbot_knowledge
  for each row execute function public.set_updated_at();
create trigger chatbot_sessions_updated_at before update on public.chatbot_sessions
  for each row execute function public.set_updated_at();

-- Retention (RGPD): deletes messages older than each bot's retention_days, then the conversations
-- left without messages. Called once a day by the runner. Returns how many messages it deleted.
create or replace function public.chatbot_prune()
returns integer
language plpgsql
set search_path = ''
as $$
declare
  deleted integer;
begin
  delete from public.chatbot_messages m
    using public.chatbot_bots b
    where m.bot_id = b.id and m.created_at < now() - make_interval(days => b.retention_days);
  get diagnostics deleted = row_count;
  delete from public.chatbot_conversations c
    using public.chatbot_bots b
    where c.bot_id = b.id
      and c.last_message_at < now() - make_interval(days => b.retention_days)
      and not exists (select 1 from public.chatbot_messages m where m.conversation_id = c.id);
  return deleted;
end;
$$;

-- Row level security: service role only -----------------------------------------------------------

alter table public.chatbot_bots enable row level security;
alter table public.chatbot_knowledge enable row level security;
alter table public.chatbot_sessions enable row level security;
alter table public.chatbot_conversations enable row level security;
alter table public.chatbot_messages enable row level security;

revoke all on table
  public.chatbot_bots, public.chatbot_knowledge, public.chatbot_sessions, public.chatbot_conversations, public.chatbot_messages
  from anon, authenticated;

revoke all on function public.chatbot_prune() from public, anon, authenticated;

commit;
