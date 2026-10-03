-- With up to 100 competitors, detailed snapshots (star distributions) are taken in batches.
-- Each competitor remembers when its last detailed snapshot happened.

alter table public.competitors add column detailed_on date;

update public.competitors c
set detailed_on = s.latest
from (
  select competitor_id, max(taken_on) as latest
  from public.competitor_snapshots
  where distribution is not null
  group by competitor_id
) s
where s.competitor_id = c.id;
