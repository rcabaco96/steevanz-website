-- «discover»: the reader's zone search for a customer's competitors, queued next to the first import
-- so it runs in parallel (another browser tab) instead of after all the customer's reviews.
alter table public.review_import_jobs drop constraint review_import_jobs_kind_check;
alter table public.review_import_jobs
  add constraint review_import_jobs_kind_check check (kind = any (array['full', 'update', 'competitor', 'competitor_replies', 'discover']));
