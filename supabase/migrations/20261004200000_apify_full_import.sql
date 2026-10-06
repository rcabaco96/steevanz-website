-- «Importar histórico completo» can run on Apify (owner's choice while DataForSEO is unavailable):
-- the job keeps the Apify run id in external_task_ids and the panel collects the result.
alter table public.review_import_jobs drop constraint review_import_jobs_provider_check;
alter table public.review_import_jobs
  add constraint review_import_jobs_provider_check check (provider = any (array['dataforseo', 'google', 'reader', 'apify']));
