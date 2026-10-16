-- Table ordering in the video menus (owner, 2026-10-16): each table of a restaurant has its own plate
-- with a link (/m/<token>) that opens the menu of THAT table with ordering. Everyone at the table
-- shares one cart; «Fazer pedido» turns it into an order with a short number and a QR code the staff
-- scan (/pedido/<token>) to confirm it. No accounts, no names, no payment.
--
-- Access model, as the other video menu tables: RLS on, no grants and no policies for anon or
-- authenticated. Every read and write goes through server code with the service role, which checks
-- the table's token first; the phones only get a «changed» signal on a Realtime Broadcast channel
-- and fetch the cart again from the server.
--
-- The limits are the same as src/lib/video-menus/ordering-rules.ts: 50 items per cart, 1 to 20 per
-- line, notes up to 200 characters, a cart or an order «session» of 4 hours.
--
-- Additive only: one new column on video_menus (default off), four new tables, four functions.
--
-- Rollback (in one transaction):
--   begin;
--   drop function if exists public.video_menu_confirm_order(text);
--   drop function if exists public.video_menu_place_order(uuid, text);
--   drop function if exists public.video_menu_cart_set(uuid, uuid, integer, text);
--   drop function if exists public.video_menu_cart_add(uuid, uuid);
--   drop function if exists public.video_menu_table_hit(uuid);
--   drop table if exists public.video_menu_order_lines;
--   drop table if exists public.video_menu_orders;
--   drop table if exists public.video_menu_cart_lines;
--   drop table if exists public.video_menu_tables;
--   alter table public.video_menus drop column if exists ordering_enabled;
--   commit;

begin;

-- The switch ---------------------------------------------------------------------------------------

alter table public.video_menus add column ordering_enabled boolean not null default false;
comment on column public.video_menus.ordering_enabled is
  'Ordering from the table links (/m/<token>). Off: the table links show the menu without ordering.';

-- Tables -------------------------------------------------------------------------------------------

create table public.video_menu_tables (
  id uuid primary key default gen_random_uuid(),
  menu_id uuid not null references public.video_menus (id) on delete cascade,
  name text not null check (char_length(name) between 1 and 40),
  -- The secret of the table's link (/m/<token>): random, base64url. «Gerar novo código» replaces it.
  token text not null unique check (token ~ '^[A-Za-z0-9_-]{22,64}$'),
  position integer not null default 0,
  -- Grows with every change of the table's cart or orders: the phones keep the newest state only.
  cart_version bigint not null default 0,
  -- Light rate limit: changes in the current minute.
  rate_window_start timestamptz not null default now(),
  rate_hits integer not null default 0,
  created_at timestamptz not null default now(),
  unique (menu_id, name),
  unique (id, menu_id)
);

create index video_menu_tables_menu_idx on public.video_menu_tables (menu_id, position);

comment on table public.video_menu_tables is
  'The tables of a video menu, each with its own secret link (/m/<token>) for ordering at the table.';

-- The shared cart of a table -------------------------------------------------------------------------

create table public.video_menu_cart_lines (
  id uuid primary key default gen_random_uuid(),
  table_id uuid not null,
  menu_id uuid not null,
  dish_id uuid not null,
  quantity integer not null default 1 check (quantity between 1 and 20),
  -- Personalisation («sem cebola»); '' when none. Lines without a note merge by dish.
  note text not null default '' check (char_length(note) <= 200),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- The menu id on both sides keeps a cart from ever holding another menu's dish.
  foreign key (table_id, menu_id) references public.video_menu_tables (id, menu_id) on delete cascade,
  foreign key (dish_id, menu_id) references public.video_menu_dishes (id, menu_id) on delete cascade
);

create index video_menu_cart_lines_table_idx on public.video_menu_cart_lines (table_id, created_at);
create index video_menu_cart_lines_dish_idx on public.video_menu_cart_lines (dish_id);
create unique index video_menu_cart_lines_plain_dish on public.video_menu_cart_lines (table_id, dish_id) where note = '';

create trigger video_menu_cart_lines_updated_at before update on public.video_menu_cart_lines
  for each row execute function public.set_updated_at();

comment on table public.video_menu_cart_lines is
  'What a table is about to order, shared by every phone at it. Emptied when the order is placed.';

-- Orders -------------------------------------------------------------------------------------------

create table public.video_menu_orders (
  id uuid primary key default gen_random_uuid(),
  menu_id uuid not null references public.video_menus (id) on delete cascade,
  -- The table may be deleted later; its name stays on the order.
  table_id uuid references public.video_menu_tables (id) on delete set null,
  table_name text not null check (char_length(table_name) between 1 and 40),
  -- «Pedido #27»: counted per menu per day (Lisbon time).
  number integer not null check (number > 0),
  service_day date not null,
  -- The secret of the staff page (/pedido/<token>), in the order's QR code.
  token text not null unique check (token ~ '^[A-Za-z0-9_-]{22,64}$'),
  status text not null default 'placed' check (status in ('placed', 'confirmed')),
  total_cents integer not null check (total_cents >= 0),
  created_at timestamptz not null default now(),
  confirmed_at timestamptz,
  unique (menu_id, service_day, number)
);

create index video_menu_orders_table_idx on public.video_menu_orders (table_id, created_at desc);

comment on table public.video_menu_orders is
  'Orders placed from a table link; the staff confirm them on /pedido/<token>.';

create table public.video_menu_order_lines (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.video_menu_orders (id) on delete cascade,
  -- The dish may be deleted later; its name and price at order time stay.
  dish_id uuid references public.video_menu_dishes (id) on delete set null,
  dish_name text not null check (char_length(dish_name) between 1 and 80),
  unit_price_cents integer not null check (unit_price_cents between 0 and 1000000),
  quantity integer not null check (quantity between 1 and 20),
  note text not null default '' check (char_length(note) <= 200),
  position integer not null default 0
);

create index video_menu_order_lines_order_idx on public.video_menu_order_lines (order_id, position);
create index video_menu_order_lines_dish_idx on public.video_menu_order_lines (dish_id);

comment on table public.video_menu_order_lines is
  'The lines of an order, with the dish''s name and price as they were when it was placed.';

-- Row level security: service role only -----------------------------------------------------------

alter table public.video_menu_tables enable row level security;
alter table public.video_menu_cart_lines enable row level security;
alter table public.video_menu_orders enable row level security;
alter table public.video_menu_order_lines enable row level security;

revoke all on table
  public.video_menu_tables, public.video_menu_cart_lines, public.video_menu_orders, public.video_menu_order_lines
  from anon, authenticated;

-- Functions (one transaction each, called by the server with the service role) --------------------

-- Locks the table's row (its cart changes one at a time), counts the change for the rate limit and
-- moves its version on. Errors are short codes the server turns into Portuguese.
create function public.video_menu_table_hit(p_table uuid)
returns public.video_menu_tables
language plpgsql
set search_path = public
as $$
declare
  t public.video_menu_tables;
begin
  select * into t from public.video_menu_tables where id = p_table for update;
  if not found then
    raise exception 'table_missing';
  end if;
  if t.rate_window_start < now() - interval '1 minute' then
    update public.video_menu_tables
      set rate_window_start = now(), rate_hits = 1, cart_version = cart_version + 1
      where id = p_table returning * into t;
  elsif t.rate_hits >= 120 then
    raise exception 'rate_limited';
  else
    update public.video_menu_tables
      set rate_hits = rate_hits + 1, cart_version = cart_version + 1
      where id = p_table returning * into t;
  end if;
  -- A cart left untouched for 4 hours belongs to another group: it goes.
  delete from public.video_menu_cart_lines
    where table_id = p_table and updated_at < now() - interval '4 hours';
  return t;
end;
$$;

-- One more of a dish, without a note: merges with the dish's line without a note.
create function public.video_menu_cart_add(p_table uuid, p_dish uuid)
returns bigint
language plpgsql
set search_path = public
as $$
declare
  t public.video_menu_tables;
  total integer;
begin
  t := public.video_menu_table_hit(p_table);
  if not exists (
    select 1 from public.video_menu_dishes
    where id = p_dish and menu_id = t.menu_id and bunny_video_id is not null
  ) then
    raise exception 'dish_missing';
  end if;
  select coalesce(sum(quantity), 0) into total from public.video_menu_cart_lines where table_id = p_table;
  if total >= 50 then
    raise exception 'cart_full';
  end if;
  insert into public.video_menu_cart_lines (table_id, menu_id, dish_id, quantity, note)
    values (p_table, t.menu_id, p_dish, 1, '')
    on conflict (table_id, dish_id) where note = ''
    do update set quantity = public.video_menu_cart_lines.quantity + 1
      where public.video_menu_cart_lines.quantity < 20;
  if not found then
    raise exception 'line_full';
  end if;
  return t.cart_version;
end;
$$;

-- A line's quantity (0 removes it) and/or note (null: unchanged). A line whose note is cleared joins
-- the dish's line without a note, when there is one.
create function public.video_menu_cart_set(p_table uuid, p_line uuid, p_quantity integer, p_note text)
returns bigint
language plpgsql
set search_path = public
as $$
declare
  t public.video_menu_tables;
  cur public.video_menu_cart_lines;
  other public.video_menu_cart_lines;
  new_quantity integer;
  new_note text;
  total integer;
begin
  t := public.video_menu_table_hit(p_table);
  select * into cur from public.video_menu_cart_lines where id = p_line and table_id = p_table for update;
  -- Already removed on another phone: nothing to do, the phone gets the new state.
  if not found then
    return t.cart_version;
  end if;
  if p_quantity is not null and p_quantity <= 0 then
    delete from public.video_menu_cart_lines where id = cur.id;
    return t.cart_version;
  end if;
  new_quantity := coalesce(p_quantity, cur.quantity);
  new_note := coalesce(btrim(p_note), cur.note);
  if new_quantity > 20 then
    raise exception 'line_full';
  end if;
  if char_length(new_note) > 200 then
    raise exception 'note_too_long';
  end if;
  if new_quantity > cur.quantity then
    select coalesce(sum(quantity), 0) into total from public.video_menu_cart_lines where table_id = p_table;
    if total - cur.quantity + new_quantity > 50 then
      raise exception 'cart_full';
    end if;
  end if;
  if new_note = '' and cur.note <> '' then
    select * into other from public.video_menu_cart_lines
      where table_id = p_table and dish_id = cur.dish_id and note = '' and id <> cur.id for update;
    if found then
      update public.video_menu_cart_lines set quantity = least(20, other.quantity + new_quantity) where id = other.id;
      delete from public.video_menu_cart_lines where id = cur.id;
      return t.cart_version;
    end if;
  end if;
  update public.video_menu_cart_lines set quantity = new_quantity, note = new_note where id = cur.id;
  return t.cart_version;
end;
$$;

-- The table's cart becomes an order (names and prices as they are now), numbered per menu per day,
-- and the cart is emptied for the next round. p_token: the order's secret, made by the server.
create function public.video_menu_place_order(p_table uuid, p_token text)
returns table (order_id uuid, order_number integer, version bigint)
language plpgsql
set search_path = public
as $$
declare
  t public.video_menu_tables;
  day date := (now() at time zone 'Europe/Lisbon')::date;
  next_number integer;
  total integer;
  new_order uuid;
begin
  t := public.video_menu_table_hit(p_table);
  if exists (
    select 1 from public.video_menu_orders where table_id = p_table and created_at > now() - interval '10 seconds'
  ) then
    raise exception 'order_too_soon';
  end if;
  select coalesce(sum(l.quantity * d.price_cents), 0)::integer into total
    from public.video_menu_cart_lines l join public.video_menu_dishes d on d.id = l.dish_id
    where l.table_id = p_table;
  if not exists (select 1 from public.video_menu_cart_lines where table_id = p_table) then
    raise exception 'cart_empty';
  end if;
  -- One number at a time per menu and day.
  perform pg_advisory_xact_lock(hashtextextended('video_menu_order:' || t.menu_id::text || ':' || day::text, 0));
  select coalesce(max(number), 0) + 1 into next_number
    from public.video_menu_orders where menu_id = t.menu_id and service_day = day;
  insert into public.video_menu_orders (menu_id, table_id, table_name, number, service_day, token, total_cents)
    values (t.menu_id, p_table, t.name, next_number, day, p_token, total)
    returning id into new_order;
  insert into public.video_menu_order_lines (order_id, dish_id, dish_name, unit_price_cents, quantity, note, position)
    select new_order, d.id, d.name, d.price_cents, l.quantity, l.note,
           (row_number() over (order by l.created_at, l.id))::integer - 1
      from public.video_menu_cart_lines l join public.video_menu_dishes d on d.id = l.dish_id
      where l.table_id = p_table;
  delete from public.video_menu_cart_lines where table_id = p_table;
  return query select new_order, next_number, t.cart_version;
end;
$$;

-- The staff confirm an order: its table's phones see it (the table's version moves on).
create function public.video_menu_confirm_order(p_token text)
returns table (table_id uuid, version bigint, confirmed boolean)
language plpgsql
set search_path = public
as $$
declare
  confirmed_order public.video_menu_orders;
  v bigint;
begin
  update public.video_menu_orders set status = 'confirmed', confirmed_at = now()
    where token = p_token and status = 'placed'
    returning * into confirmed_order;
  if not found then
    return query select null::uuid, null::bigint, false;
    return;
  end if;
  update public.video_menu_tables set cart_version = cart_version + 1
    where id = confirmed_order.table_id returning cart_version into v;
  return query select confirmed_order.table_id, v, true;
end;
$$;

revoke all on function
  public.video_menu_table_hit(uuid),
  public.video_menu_cart_add(uuid, uuid),
  public.video_menu_cart_set(uuid, uuid, integer, text),
  public.video_menu_place_order(uuid, text),
  public.video_menu_confirm_order(text)
  from public, anon, authenticated;

grant execute on function
  public.video_menu_table_hit(uuid),
  public.video_menu_cart_add(uuid, uuid),
  public.video_menu_cart_set(uuid, uuid, integer, text),
  public.video_menu_place_order(uuid, text),
  public.video_menu_confirm_order(text)
  to service_role;

comment on function public.video_menu_cart_add(uuid, uuid) is 'Adds one of a dish to a table''s cart (merging lines without a note).';
comment on function public.video_menu_cart_set(uuid, uuid, integer, text) is 'Changes a cart line''s quantity (0 removes) and/or note.';
comment on function public.video_menu_place_order(uuid, text) is 'Turns a table''s cart into a numbered order and empties the cart.';
comment on function public.video_menu_confirm_order(text) is 'Marks an order confirmed by the staff.';

commit;
