-- Digital menus in videos («Menu digital em vídeo», owner 2026-10-15): until now the only menu was
-- the static demo of /raza17raza (src/content/demo-menu.ts). Each menu has its own public page
-- (/menu/<slug>; the demo keeps /raza17raza), its dishes (a YouTube Short each) and its collections
-- (the lists in the menu's ☰ panel; the default one opens first). Managed in /admin/menus.
--
-- Access model: RLS on, no grants to anon/authenticated, like the other admin tables. The admin and
-- the public pages read and write through server code with the service role; the public pages only
-- show active menus.
--
-- Additive only: new tables, a new Storage bucket and the demo menu as seed. Idempotent: the seed
-- only runs while there is no menu with the slug "raza17raza", so it never overwrites later edits.

create table public.video_menus (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) between 2 and 60),
  business_name text not null check (char_length(business_name) between 1 and 120),
  -- A path of the site ("/media/…") or an https URL (e.g. the menu-logos bucket). Null: the initials.
  logo_url text check (logo_url is null or (char_length(logo_url) <= 500 and (logo_url ~ '^/[^/]' or logo_url ~ '^https://'))),
  -- Without the "@".
  instagram text check (instagram is null or instagram ~ '^[A-Za-z0-9._]{1,30}$'),
  -- The client's business in the reviews area, when there is one (for reference only).
  review_business_id uuid references public.review_businesses (id) on delete set null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.video_menu_dishes (
  id uuid primary key default gen_random_uuid(),
  menu_id uuid not null references public.video_menus (id) on delete cascade,
  -- The YouTube video id (11 characters) of the dish's Short.
  video_id text not null check (video_id ~ '^[A-Za-z0-9_-]{11}$'),
  name text not null check (char_length(name) between 1 and 80),
  description text not null default '' check (char_length(description) <= 300),
  price_cents integer not null check (price_cents between 0 and 1000000),
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, menu_id)
);

create index video_menu_dishes_menu_idx on public.video_menu_dishes (menu_id, position);

create table public.video_menu_collections (
  id uuid primary key default gen_random_uuid(),
  menu_id uuid not null references public.video_menus (id) on delete cascade,
  name text not null check (char_length(name) between 1 and 60),
  position integer not null default 0,
  -- Opens first on the public page (at most one per menu).
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, menu_id)
);

create index video_menu_collections_menu_idx on public.video_menu_collections (menu_id, position);
create unique index video_menu_collections_one_default on public.video_menu_collections (menu_id) where is_default;

-- Which dishes a collection shows, in its own order. The menu id on both sides keeps a collection
-- from ever pointing at another menu's dish.
create table public.video_menu_collection_dishes (
  collection_id uuid not null,
  dish_id uuid not null,
  menu_id uuid not null,
  position integer not null default 0,
  primary key (collection_id, dish_id),
  foreign key (collection_id, menu_id) references public.video_menu_collections (id, menu_id) on delete cascade,
  foreign key (dish_id, menu_id) references public.video_menu_dishes (id, menu_id) on delete cascade
);

create index video_menu_collection_dishes_order_idx on public.video_menu_collection_dishes (collection_id, position);
create index video_menu_collection_dishes_dish_idx on public.video_menu_collection_dishes (dish_id);

create trigger video_menus_updated_at before update on public.video_menus
  for each row execute function public.set_updated_at();
create trigger video_menu_dishes_updated_at before update on public.video_menu_dishes
  for each row execute function public.set_updated_at();
create trigger video_menu_collections_updated_at before update on public.video_menu_collections
  for each row execute function public.set_updated_at();

-- Row level security: service role only -----------------------------------------------------------

alter table public.video_menus enable row level security;
alter table public.video_menu_dishes enable row level security;
alter table public.video_menu_collections enable row level security;
alter table public.video_menu_collection_dishes enable row level security;

revoke all on table
  public.video_menus, public.video_menu_dishes, public.video_menu_collections, public.video_menu_collection_dishes
  from anon, authenticated;

-- Logos uploaded in the admin: "<menu_id>/<random>.<ext>" in a public bucket (read by URL, drawn
-- with a plain <img> on the menu, so WebP works too). Only the server writes, with the service role;
-- no policies for anon or authenticated on storage.objects for this bucket.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('menu-logos', 'menu-logos', true, 2097152, array['image/png', 'image/jpeg', 'image/webp'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Seed: the demo menu of /raza17raza as in src/content/demo-menu.ts on 2026-10-15 (dishes in the
-- file's order, the collections in theirs, «Brunch» by default). The dishes and prices are examples.
do $$
declare
  seeded_menu uuid;
begin
  if exists (select 1 from public.video_menus where slug = 'raza17raza') then
    return;
  end if;

  insert into public.video_menus (slug, business_name, logo_url, instagram, review_business_id, active)
  values ('raza17raza', 'Dolci e Salati', '/media/clients/dolci-e-salati-logo.png', 'dolciesalati.ap',
          (select id from public.review_businesses where slug = 'dolci-e-salati'), true)
  returning id into seeded_menu;

  create temporary table seed_dishes (key text primary key, video_id text, name text, description text, price_cents integer, position integer) on commit drop;
  insert into seed_dishes (key, video_id, name, description, price_cents, position) values
      ('fried-ice-cream', 'tzQOn3mU7EA', 'Gelado frito', 'Bola de gelado de baunilha em massa estaladiça, frita na hora.', 550, 0),
      ('tiramisu', 'P0iXMKRKGJg', 'Tiramisù de abóbora', 'Camadas de creme de mascarpone, abóbora e café.', 490, 1),
      ('creme-brulee', '7B132m9g5FY', 'Crème brûlée', 'Creme de baunilha com açúcar queimado na hora.', 450, 2),
      ('brownie', 'iLe2PLFdIgY', 'Brownie com gelado', 'Brownie quente de chocolate negro com uma bola de gelado.', 520, 3),
      ('donuts', 'LjFbfLKNJEk', 'Donuts caseiros', 'Massa fofa frita e passada por açúcar.', 280, 4),
      ('orange-cake', '84xHDfPe5kE', 'Bolo de laranja', 'Bolo húmido de laranja, à fatia.', 350, 5),
      ('crepes', 'ELhcP1zO1YA', 'Crepe de chocolate', 'Crepe fino com chantilly e fio de chocolate.', 480, 6),
      ('fruit-salad', 'QAQA08ll34Q', 'Salada de fruta', 'Melancia, fruta da época e hortelã fresca.', 420, 7),
      ('arancini', 'CO6uCCCGeP8', 'Arancini carbonara', 'Bolinhas de risotto recheadas com queijo, fritas.', 650, 8),
      ('popcorn', 'zVorYnJjmrQ', 'Pipocas com amendoim', 'Pipocas caramelizadas com amendoim torrado.', 320, 9),
      ('nachos', 'BvLlEz7uDFc', 'Nachos gratinados', 'Tortilhas com queijo derretido, jalapeños e natas.', 750, 10),
      ('crispy-chicken', 'wfTISOEGVqQ', 'Frango panado', 'Frango marinado e panado, estaladiço por fora.', 890, 11),
      ('boiled-egg', 'cKrFL4N8s9k', 'Ovo perfeito', 'Ovo cozido no ponto, com gema cremosa.', 180, 12),
      ('pierogi', 'tG47av4O3nI', 'Pierogi de batata', 'Pastéis de massa recheados com batata e queijo.', 790, 13),
      ('burger', 'a5TYxMS3oHM', 'Hambúrguer recheado', 'Carne picada na hora, recheada com queijo derretido.', 1150, 14),
      ('sandwich', 'ClDD6TFmrVo', 'Sandes de compota', 'Pão estaladiço, manteiga de amendoim e compota.', 690, 15),
      ('fish-and-chips', 'y28G9MWc-IQ', 'Peixe e batatas fritas', 'Peixe em polme estaladiço com batatas fritas.', 1250, 16),
      ('tacos', 'CX_8AuAY_Vo', 'Tacos', 'Tortilhas com carne estufada e guarnições.', 1050, 17),
      ('noodles', 'fnevKiU7_Fo', 'Massa de abóbora', 'Massa fresca cortada à tesoura, salteada com ervas.', 1190, 18),
      ('pappardelle', 'RrLiVscGtOs', 'Pappardelle com novilho', 'Novilho estufado em vinho tinto com massa larga.', 1590, 19),
      ('mushroom-pasta', 'F5C6UcmyPxc', 'Massa de cogumelos', 'Cogumelos salteados com xerez e parmesão.', 1290, 20),
      ('shepherds-pie', 'Q9VKJeTqz18', 'Empadão de carne', 'Carne estufada coberta com puré gratinado.', 1150, 21),
      ('dauphinoise', 'r4GSZer0NTc', 'Batata dauphinoise', 'Lâminas de batata no forno com natas e queijo.', 650, 22),
      ('stew', 'nQYKvVyLnoQ', 'Ensopado de feijão', 'Feijão estufado com legumes e especiarias.', 950, 23),
      ('soup', 'nk8VugkamdY', 'Sopa do dia', 'Sopa cremosa de legumes com endro.', 350, 24),
      ('roast-chicken', 'v8p1uRsQYNk', 'Frango assado', 'Frango assado em manteiga com ervas.', 1350, 25),
      ('butter-chicken', 'SAziuwJrCro', 'Caril de frango', 'Frango em molho de manteiga e especiarias, com arroz.', 1250, 26),
      ('shrimp', 'dcbMh6D6JMk', 'Camarão salteado', 'Camarão salteado em manteiga de alho.', 1450, 27),
      ('pizza', 'NvX2UjsCTE8', 'Pizza no forno', 'Massa fina e estaladiça, com molho de tomate caseiro.', 1090, 28),
      ('kids-menu', '9D63hnLlFOg', 'Menu criança', 'Uma caixa com pequenas porções para os mais novos.', 750, 29),
      ('latte', '8_6ZMG9bd_4', 'Latte de abóbora', 'Café, leite cremoso e especiarias de outono.', 390, 30),
      ('shakshuka', '9wis1WBJx-0', 'Shakshuka', 'Ovo escalfado em molho de tomate e pimento, com queijo feta.', 850, 31),
      ('croissants', 'KVNFyupD_pk', 'Croissant de amêndoa', 'Massa folhada estaladiça com creme e amêndoa laminada.', 320, 32),
      ('pumpkin-muffins', '1yiE_3d_src', 'Muffin de abóbora', 'Muffin fofo de abóbora com crumble de canela.', 290, 33),
      ('apple-muffins', 'iehPPojb51g', 'Muffin de maçã', 'Muffin de maçã com cobertura estaladiça.', 290, 34),
      ('cheese-toast', '9yBWV4TnqAA', 'Tosta de queijo', 'Pão tostado na manteiga com queijo derretido.', 450, 35),
      ('smoothie', '01ivc-1r3oc', 'Smoothie de frutos vermelhos', 'Morango, frutos vermelhos e iogurte, batidos na hora.', 450, 36),
      ('espresso', 'YwtN14fMzso', 'Espresso', 'Café de especialidade, tirado na hora.', 120, 37),
      ('double-espresso', 'Xe-khGBG1Gk', 'Espresso duplo', 'Dose dupla, intensa e encorpada.', 200, 38),
      ('pour-over', 'wiGpI2rqMHo', 'Café de filtro (V60)', 'Café coado à mão, suave e aromático.', 320, 39),
      ('lemonade', 'yRN65wygV2s', 'Limonada caseira', 'Limões espremidos na hora, com hortelã e gelo.', 300, 40),
      ('smoked-tea', 'T72WmperNsY', 'Chá gelado fumado', 'Chá preto fumado servido com gelo e casca de laranja.', 350, 41),
      ('pink-mocktail', 'wtiZ88q-gV4', 'Mocktail Pink Pearl', 'Bebida cremosa de frutos vermelhos, sem álcool.', 490, 42);

  create temporary table seed_collections (key text primary key, name text, position integer, is_default boolean) on commit drop;
  insert into seed_collections (key, name, position, is_default) values
      ('brunch', 'Brunch', 0, true),
      ('bebidas', 'Bebidas', 1, false),
      ('todos', 'Todos', 2, false),
      ('gelados', 'Gelados e sobremesas', 3, false),
      ('salgados', 'Salgados e snacks', 4, false),
      ('hamburgueres', 'Hambúrgueres e sandes', 5, false),
      ('pratos', 'Pratos', 6, false);

  create temporary table seed_links (collection_key text, dish_key text, position integer) on commit drop;
  insert into seed_links (collection_key, dish_key, position) values
      ('brunch', 'latte', 0),
      ('brunch', 'shakshuka', 1),
      ('brunch', 'croissants', 2),
      ('brunch', 'pumpkin-muffins', 3),
      ('brunch', 'apple-muffins', 4),
      ('brunch', 'cheese-toast', 5),
      ('brunch', 'crepes', 6),
      ('brunch', 'boiled-egg', 7),
      ('brunch', 'fruit-salad', 8),
      ('brunch', 'donuts', 9),
      ('bebidas', 'smoothie', 0),
      ('bebidas', 'lemonade', 1),
      ('bebidas', 'espresso', 2),
      ('bebidas', 'double-espresso', 3),
      ('bebidas', 'pour-over', 4),
      ('bebidas', 'latte', 5),
      ('bebidas', 'smoked-tea', 6),
      ('bebidas', 'pink-mocktail', 7),
      ('todos', 'latte', 0),
      ('todos', 'shakshuka', 1),
      ('todos', 'croissants', 2),
      ('todos', 'pumpkin-muffins', 3),
      ('todos', 'apple-muffins', 4),
      ('todos', 'cheese-toast', 5),
      ('todos', 'crepes', 6),
      ('todos', 'boiled-egg', 7),
      ('todos', 'fruit-salad', 8),
      ('todos', 'donuts', 9),
      ('todos', 'smoothie', 10),
      ('todos', 'lemonade', 11),
      ('todos', 'espresso', 12),
      ('todos', 'double-espresso', 13),
      ('todos', 'pour-over', 14),
      ('todos', 'smoked-tea', 15),
      ('todos', 'pink-mocktail', 16),
      ('todos', 'fried-ice-cream', 17),
      ('todos', 'tiramisu', 18),
      ('todos', 'creme-brulee', 19),
      ('todos', 'brownie', 20),
      ('todos', 'orange-cake', 21),
      ('todos', 'arancini', 22),
      ('todos', 'popcorn', 23),
      ('todos', 'nachos', 24),
      ('todos', 'crispy-chicken', 25),
      ('todos', 'pierogi', 26),
      ('todos', 'burger', 27),
      ('todos', 'sandwich', 28),
      ('todos', 'fish-and-chips', 29),
      ('todos', 'tacos', 30),
      ('todos', 'noodles', 31),
      ('todos', 'pappardelle', 32),
      ('todos', 'mushroom-pasta', 33),
      ('todos', 'shepherds-pie', 34),
      ('todos', 'dauphinoise', 35),
      ('todos', 'stew', 36),
      ('todos', 'soup', 37),
      ('todos', 'roast-chicken', 38),
      ('todos', 'butter-chicken', 39),
      ('todos', 'shrimp', 40),
      ('todos', 'pizza', 41),
      ('todos', 'kids-menu', 42),
      ('gelados', 'fried-ice-cream', 0),
      ('gelados', 'tiramisu', 1),
      ('gelados', 'creme-brulee', 2),
      ('gelados', 'brownie', 3),
      ('gelados', 'donuts', 4),
      ('gelados', 'orange-cake', 5),
      ('gelados', 'crepes', 6),
      ('gelados', 'fruit-salad', 7),
      ('salgados', 'arancini', 0),
      ('salgados', 'popcorn', 1),
      ('salgados', 'nachos', 2),
      ('salgados', 'crispy-chicken', 3),
      ('salgados', 'boiled-egg', 4),
      ('salgados', 'pierogi', 5),
      ('hamburgueres', 'burger', 0),
      ('hamburgueres', 'sandwich', 1),
      ('hamburgueres', 'fish-and-chips', 2),
      ('hamburgueres', 'tacos', 3),
      ('pratos', 'noodles', 0),
      ('pratos', 'pappardelle', 1),
      ('pratos', 'mushroom-pasta', 2),
      ('pratos', 'shepherds-pie', 3),
      ('pratos', 'dauphinoise', 4),
      ('pratos', 'stew', 5),
      ('pratos', 'soup', 6),
      ('pratos', 'roast-chicken', 7),
      ('pratos', 'butter-chicken', 8),
      ('pratos', 'shrimp', 9),
      ('pratos', 'pizza', 10),
      ('pratos', 'kids-menu', 11);

  insert into public.video_menu_dishes (menu_id, video_id, name, description, price_cents, position)
  select seeded_menu, video_id, name, description, price_cents, position from seed_dishes order by position;

  insert into public.video_menu_collections (menu_id, name, position, is_default)
  select seeded_menu, name, position, is_default from seed_collections order by position;

  -- Each demo dish has its own video and each collection its own name: they map the new rows back
  -- to the keys of the static file.
  insert into public.video_menu_collection_dishes (collection_id, dish_id, menu_id, position)
  select c.id, d.id, seeded_menu, l.position
  from seed_links l
  join seed_collections sc on sc.key = l.collection_key
  join public.video_menu_collections c on c.menu_id = seeded_menu and c.name = sc.name
  join seed_dishes sd on sd.key = l.dish_key
  join public.video_menu_dishes d on d.menu_id = seeded_menu and d.video_id = sd.video_id;

  drop table seed_dishes, seed_collections, seed_links;
end
$$;
