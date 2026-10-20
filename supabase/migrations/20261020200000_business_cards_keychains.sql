-- «Cartão de visita digital» and «Chaveiro digital» managed in the admin (owner, 2026-10-20).
--
-- Until now the cards lived in src/content/business-cards.ts (one card: rogerio-cabaco) and the
-- keychains had no page of their own. From this migration on:
--   * business_cards: one row per card, served at /c/<slug> (contact page) and /c/<slug>/vcard
--     (contact file). Managed in /admin/cartoes.
--   * keychain_tags: one row per keychain or tag. The tag stores /k/<code>, which redirects (307) to
--     the row's destination, so the destination can change later without touching the tag.
--     Managed in /admin/tags.
--
-- Access model: RLS on, no grants to anon/authenticated, like the video menus. The admin and the
-- public pages read and write through server code with the service role.
--
-- Additive only: new tables, a function, a Storage bucket and the existing card as seed. The seed
-- skips a slug that already exists, so running it again never overwrites later edits.

create table public.business_cards (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) between 2 and 60),
  active boolean not null default true,
  -- The page's language (labels and html lang): one of the six site languages.
  locale text not null default 'pt' check (locale in ('pt', 'en', 'es', 'fr', 'de', 'it')),
  -- Whose card it is for us (client or company that ordered it). Internal, never shown.
  client_name text check (client_name is null or char_length(client_name) <= 120),
  name text not null check (char_length(name) between 1 and 120),
  -- For the contact file's N field; empty: taken from the name (last word = family name).
  given_name text check (given_name is null or char_length(given_name) <= 80),
  family_name text check (family_name is null or char_length(family_name) <= 80),
  role text check (role is null or char_length(role) <= 120),
  company text check (company is null or char_length(company) <= 120),
  -- International format with spaces, e.g. «+351 961 292 679».
  phone text check (phone is null or char_length(phone) <= 40),
  phone2 text check (phone2 is null or char_length(phone2) <= 40),
  whatsapp text check (whatsapp is null or char_length(whatsapp) <= 40),
  email text check (email is null or char_length(email) <= 200),
  website text check (website is null or (char_length(website) <= 500 and website ~ '^https?://')),
  -- [{ "network": "instagram" | "linkedin" | "facebook" | "tiktok" | "youtube" | "x", "url": "https://…" }]
  socials jsonb not null default '[]'::jsonb check (jsonb_typeof(socials) = 'array'),
  -- One address line per text line.
  address text check (address is null or char_length(address) <= 300),
  maps_url text check (maps_url is null or (char_length(maps_url) <= 500 and maps_url ~ '^https://')),
  -- A path of the site ("/assinatura/…") or the public URL of the photo in the business-card-photos bucket.
  photo_url text check (photo_url is null or (char_length(photo_url) <= 500 and (photo_url ~ '^/[^/]' or photo_url ~ '^https://'))),
  -- Internal note for the admin. Never shown on the page.
  note text check (note is null or char_length(note) <= 1000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.keychain_tags (
  id uuid primary key default gen_random_uuid(),
  -- The tag stores https://www.steevanz.com/k/<code>.
  code text not null unique check (code ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(code) between 2 and 40),
  label text not null check (char_length(label) between 1 and 120),
  destination_type text not null check (destination_type in ('whatsapp', 'instagram', 'website', 'custom')),
  -- Only http(s): the redirect never sends anyone to javascript:, data: or other schemes.
  destination_url text not null check (char_length(destination_url) <= 1000 and destination_url ~ '^https?://[^/\s]'),
  active boolean not null default true,
  tap_count bigint not null default 0,
  last_tap_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger business_cards_updated_at before update on public.business_cards
  for each row execute function public.set_updated_at();
-- Only edits move updated_at: a tap (tap_count, last_tap_at) does not.
create trigger keychain_tags_updated_at before update of code, label, destination_type, destination_url, active on public.keychain_tags
  for each row execute function public.set_updated_at();

-- One tap on /k/<code>: counted atomically, only for active tags. Service role only.
create function public.keychain_tag_tap(tag_code text) returns void
  language sql
  security invoker
  set search_path = ''
as $$
  update public.keychain_tags
     set tap_count = tap_count + 1, last_tap_at = now()
   where code = tag_code and active;
$$;

revoke all on function public.keychain_tag_tap(text) from public, anon, authenticated;
grant execute on function public.keychain_tag_tap(text) to service_role;

-- Row level security: service role only -----------------------------------------------------------

alter table public.business_cards enable row level security;
alter table public.keychain_tags enable row level security;

revoke all on table public.business_cards, public.keychain_tags from anon, authenticated;

-- Photos uploaded in the admin: "<card_id>/<random>.jpg" (square JPEG, 512 px, made by the server) in
-- a public bucket. Only the server writes, with the service role; no policies for anon or
-- authenticated on storage.objects for this bucket.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('business-card-photos', 'business-card-photos', true, 2097152, array['image/jpeg'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Seed: the Steevanz example card, as in src/content/business-cards.ts on 2026-10-20.
insert into public.business_cards
  (slug, active, locale, client_name, name, given_name, family_name, role, company, phone, whatsapp, email, website, socials, photo_url)
values
  ('rogerio-cabaco', true, 'pt', 'Steevanz', 'Rogério Cabaço', 'Rogério', 'Cabaço', 'CEO & Founder', 'Steevanz',
   '+351 961 292 679', '+351 961 292 679', 'rcabaco@steevanz.com', 'https://www.steevanz.com',
   '[{"network": "instagram", "url": "https://www.instagram.com/steevanz_"}, {"network": "linkedin", "url": "https://www.linkedin.com/company/steevanz"}]'::jsonb,
   '/assinatura/foto.png')
on conflict (slug) do nothing;
