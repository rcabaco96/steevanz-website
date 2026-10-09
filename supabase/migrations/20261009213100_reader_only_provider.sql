-- The free Steevanz reader is the only source of reviews (owner decision 2026-10-09: no paid
-- providers). Jobs inserted without a provider used to get the old paid provider as default and
-- then waited forever (the reader only claims provider = 'reader'), blocking every new job of the
-- same kind for that target (one active job per target and kind).
-- Non-destructive: the old values stay allowed by the check constraint (history rows keep them).

alter table public.review_import_jobs alter column provider set default 'reader';

-- Jobs still waiting (or left "running") for a provider that no longer exists go back to the reader.
update public.review_import_jobs
set provider = 'reader', status = 'queued', started_at = null, reader_id = null, updated_at = now()
where status in ('queued', 'running')
  and provider not in ('reader', 'google');
