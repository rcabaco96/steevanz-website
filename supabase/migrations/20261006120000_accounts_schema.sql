-- Steevanz client accounts, orders and purchased products.
-- Access model: RLS enabled. Signed-in clients can read their own rows (and update
-- their own profile fields). Everything else, including all admin writes, goes
-- through server code using the service role after the server has verified the
-- session.

create type public.order_status as enum ('pending', 'accepted', 'rejected', 'cancelled');
create type public.subscription_status as enum ('active', 'suspended', 'cancelled');

-- Profiles: one per auth user (1 account = 1 client).

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null check (char_length(email) between 3 and 200),
  full_name text check (char_length(full_name) <= 120),
  business_name text check (char_length(business_name) <= 160),
  phone text check (char_length(phone) <= 40),
  nif text check (char_length(nif) <= 20),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index profiles_email_idx on public.profiles (email);
create index profiles_created_at_idx on public.profiles (created_at desc);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name, business_name, phone)
  values (
    new.id,
    lower(new.email),
    nullif(left(trim(new.raw_user_meta_data ->> 'full_name'), 120), ''),
    nullif(left(trim(new.raw_user_meta_data ->> 'business_name'), 160), ''),
    nullif(left(trim(new.raw_user_meta_data ->> 'phone'), 40), '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.handle_user_email_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.profiles set email = lower(new.email) where id = new.id;
  return new;
end;
$$;

create trigger on_auth_user_email_changed
  after update of email on auth.users
  for each row when (old.email is distinct from new.email)
  execute function public.handle_user_email_change();

-- Backfill accounts created before this migration (e.g. admin magic-link users).
insert into public.profiles (id, email)
select id, lower(email) from auth.users where email is not null
on conflict (id) do nothing;

-- Orders submitted from the cart.

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique check (char_length(reference) <= 40),
  user_id uuid references public.profiles (id) on delete set null,
  name text not null check (char_length(name) between 1 and 120),
  email text not null check (char_length(email) between 3 and 200),
  phone text check (char_length(phone) <= 40),
  business_name text check (char_length(business_name) <= 160),
  sector text check (char_length(sector) <= 60),
  message text check (char_length(message) <= 2000),
  locale text not null default 'pt' check (locale in ('pt', 'en')),
  items jsonb not null default '[]'::jsonb,
  totals jsonb not null default '{}'::jsonb,
  status public.order_status not null default 'pending',
  admin_notes text check (char_length(admin_notes) <= 5000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index orders_user_id_idx on public.orders (user_id);
create index orders_email_idx on public.orders (email);
create index orders_created_at_idx on public.orders (created_at desc);
create index orders_status_idx on public.orders (status);

-- Products a client has access to (one row per client and product).

create table public.client_products (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  product_id text not null check (char_length(product_id) <= 60),
  status public.subscription_status not null default 'active',
  order_id uuid references public.orders (id) on delete set null,
  activated_at timestamptz not null default now(),
  notes text check (char_length(notes) <= 2000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, product_id)
);

create index client_products_user_id_idx on public.client_products (user_id);

-- updated_at triggers

create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger orders_updated_at before update on public.orders
  for each row execute function public.set_updated_at();
create trigger client_products_updated_at before update on public.client_products
  for each row execute function public.set_updated_at();

-- Row level security

alter table public.profiles enable row level security;
alter table public.orders enable row level security;
alter table public.client_products enable row level security;

revoke all on table public.profiles, public.orders, public.client_products from anon, authenticated;
-- Column grants keep internal fields (admin_notes, notes) out of reach of clients.
grant select on table public.profiles to authenticated;
grant select (id, reference, user_id, name, email, phone, business_name, sector, message, locale, items, totals, status, created_at, updated_at)
  on table public.orders to authenticated;
grant select (id, user_id, product_id, status, order_id, activated_at, created_at, updated_at)
  on table public.client_products to authenticated;
grant update (full_name, business_name, phone, nif) on table public.profiles to authenticated;

create policy "profiles: read own" on public.profiles
  for select to authenticated using ((select auth.uid()) = id);
create policy "profiles: update own" on public.profiles
  for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
create policy "orders: read own" on public.orders
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "client_products: read own" on public.client_products
  for select to authenticated using ((select auth.uid()) = user_id);

revoke execute on function public.handle_new_user() from anon, authenticated, public;
revoke execute on function public.handle_user_email_change() from anon, authenticated, public;
