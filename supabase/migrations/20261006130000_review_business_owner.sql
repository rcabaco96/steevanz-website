-- Each review panel belongs to one client account. Only that account and admins can open
-- /painel/<slug>; access is checked in server code (review tables stay service-role only).

alter table public.review_businesses
  add column if not exists owner_id uuid references public.profiles (id) on delete set null;

create index if not exists review_businesses_owner_id_idx on public.review_businesses (owner_id);
