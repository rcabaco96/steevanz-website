-- CRM for prospecting (admin › Contactos › CRM): the businesses found by «Encontrar clientes» (or
-- imported as a list) go through seven stages, with the day to call again, the calls nobody answered,
-- notes and a history of everything done with each one. A list is a zone: the «Onde» of its searches.
-- The prospector also checks each business's website for free and labels it (no site of its own,
-- down, made with AI, out of date or fine); the admin can change the label.
-- Service role only, like the rest of prospecting.

alter table public.prospects drop constraint prospects_status_check;
update public.prospects set status = 'lost' where status = 'discarded';
alter table public.prospects
  add constraint prospects_status_check check (status in ('new', 'contacted', 'interested', 'meeting', 'proposal', 'customer', 'lost'));

alter table public.prospects
  -- The day to contact them again («Para hoje» from that day on).
  add column next_contact date,
  -- Calls nobody answered.
  add column attempts integer not null default 0 check (attempts between 0 and 999),
  -- Emails besides the main one (email).
  add column other_emails text[] not null default '{}' check (cardinality(other_emails) <= 10),
  -- Kind of business as the CRM groups them («Restauração», «Cabeleireiros»…); null = from the category.
  add column sector text check (char_length(sector) <= 60),
  -- The website's label: null until checked.
  add column site_status text check (site_status in ('none', 'down', 'ai', 'outdated', 'ok')),
  add column site_reasons text[] not null default '{}' check (cardinality(site_reasons) <= 10),
  add column site_checked_at timestamptz,
  -- Last change made in the CRM and by whom (updated_at also moves when a search refreshes the data).
  add column worked_at timestamptz,
  add column worked_by text check (char_length(worked_by) <= 200);

create index prospects_next_contact_idx on public.prospects (next_contact) where next_contact is not null;
create index prospects_site_unchecked_idx on public.prospects (created_at) where site_checked_at is null;

-- Everything done with a business: stage changes, calls not answered, next contact days, notes,
-- website labels changed by hand and Steevanz product links copied or sent by WhatsApp.
-- value/previous are stage keys, dates (yyyy-mm-dd), product ids or text.
create table public.prospect_events (
  id bigint generated always as identity primary key,
  place_id text not null references public.prospects (place_id) on delete cascade,
  kind text not null check (kind in ('stage', 'no_answer', 'next_contact', 'note', 'site', 'product')),
  value text check (char_length(value) <= 2000),
  previous text check (char_length(previous) <= 2000),
  actor text check (char_length(actor) <= 200),
  created_at timestamptz not null default now()
);
create index prospect_events_place_idx on public.prospect_events (place_id, created_at desc);

-- The WhatsApp message the CRM writes for each business ({negocio} and {situacao} are filled in);
-- one sentence per website label for {situacao}. One row.
create table public.prospect_settings (
  id boolean primary key default true check (id),
  whatsapp_template text not null check (char_length(whatsapp_template) between 1 and 1000),
  whatsapp_none text not null default '' check (char_length(whatsapp_none) <= 300),
  whatsapp_down text not null default '' check (char_length(whatsapp_down) <= 300),
  whatsapp_ai text not null default '' check (char_length(whatsapp_ai) <= 300),
  whatsapp_outdated text not null default '' check (char_length(whatsapp_outdated) <= 300),
  whatsapp_other text not null default '' check (char_length(whatsapp_other) <= 300),
  updated_by text check (char_length(updated_by) <= 200),
  updated_at timestamptz not null default now()
);
insert into public.prospect_settings (whatsapp_template, whatsapp_none, whatsapp_down, whatsapp_ai, whatsapp_outdated, whatsapp_other)
values (
  'Olá! Aqui é da Steevanz. {situacao} Fazemos sites, Menu digital e reservas online para negócios como o {negocio}. Posso enviar-lhe um exemplo?',
  'Vi que o {negocio} ainda não tem um site próprio no Google.',
  'Vi que o site do {negocio} não está a abrir.',
  'Vi o site do {negocio} e acho que podia mostrar muito melhor o que fazem.',
  'Vi que o site do {negocio} está desatualizado.',
  'Vi o {negocio} no Google.'
);

alter table public.prospect_events enable row level security;
alter table public.prospect_settings enable row level security;
revoke all on public.prospect_events, public.prospect_settings from anon, authenticated;
