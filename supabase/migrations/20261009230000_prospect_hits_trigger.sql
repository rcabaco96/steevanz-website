-- Every business a search stores belongs to that search, whatever version of the prospector wrote
-- it: the database links it on insert and whenever a later search finds it again.

create or replace function public.prospect_link_search()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.last_search_id is not null then
    insert into public.prospect_search_hits (search_id, place_id) values (new.last_search_id, new.place_id) on conflict do nothing;
  end if;
  if new.first_search_id is not null and new.first_search_id is distinct from new.last_search_id then
    insert into public.prospect_search_hits (search_id, place_id) values (new.first_search_id, new.place_id) on conflict do nothing;
  end if;
  return new;
end;
$$;

create trigger prospects_link_search
  after insert or update of last_search_id, first_search_id on public.prospects
  for each row execute function public.prospect_link_search();

revoke execute on function public.prospect_link_search() from anon, authenticated, public;

-- Searches already run by a prospector that did not link them.
insert into public.prospect_search_hits (search_id, place_id)
select first_search_id, place_id from public.prospects where first_search_id is not null
union
select last_search_id, place_id from public.prospects where last_search_id is not null
on conflict do nothing;
