-- When competitor numbers were last captured, so the daily job only refreshes stale businesses.

alter table public.review_businesses add column competitors_snapshot_at timestamptz;

update public.review_businesses b
set competitors_snapshot_at = s.latest
from (
  select c.business_id, max(cs.taken_on)::timestamptz as latest
  from public.competitors c
  join public.competitor_snapshots cs on cs.competitor_id = c.id
  group by c.business_id
) s
where s.business_id = b.id;
