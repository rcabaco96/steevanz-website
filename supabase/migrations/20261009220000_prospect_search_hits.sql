-- Which businesses each prospecting search found, so the admin shows one search's results at a
-- time (a business found again by a later search belongs to both, without being duplicated).

create table public.prospect_search_hits (
  search_id uuid not null references public.prospect_searches (id) on delete cascade,
  place_id text not null references public.prospects (place_id) on delete cascade,
  primary key (search_id, place_id)
);
create index prospect_search_hits_place_idx on public.prospect_search_hits (place_id);

alter table public.prospect_search_hits enable row level security;
revoke all on public.prospect_search_hits from anon, authenticated;

-- The searches already done: their businesses, from where each was first and last found.
insert into public.prospect_search_hits (search_id, place_id)
select first_search_id, place_id from public.prospects where first_search_id is not null
union
select last_search_id, place_id from public.prospects where last_search_id is not null
on conflict do nothing;
