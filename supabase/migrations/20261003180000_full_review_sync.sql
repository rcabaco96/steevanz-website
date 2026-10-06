-- Incremental syncs only read recent reviews, so owner replies to old reviews are picked up by
-- a periodic full re-import. This records when that last happened for each business.

alter table public.review_businesses add column full_synced_at timestamptz;

-- Businesses already imported got their whole history on the first sync.
update public.review_businesses set full_synced_at = last_synced_at where last_synced_at is not null;
