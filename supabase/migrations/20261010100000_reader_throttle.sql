-- Pacing of the free reader against Google's limits (2026-10-09: a new customer's competitor reads,
-- run in parallel with its own first import, made Google limit the reader's browser and every retry failed).
--
-- review_import_jobs.not_before: a job hit by a Google limit goes back to the queue and is not claimed
--   before this time (null = as soon as possible).
-- review_import_jobs.attempts: how many times Google limited this job; after 5 it fails for good.
-- review_reader_status.paused_until / pause_reason: the reader's global pause (cool-down) while Google
--   limits it, shown in the admin and the panel («O Google está a limitar o leitor; retoma às HH:MM»).
-- Additive only; the reader v3 refuses to start without the queue and status columns.

alter table public.review_import_jobs add column if not exists not_before timestamptz;
alter table public.review_import_jobs add column if not exists attempts smallint not null default 0;

alter table public.review_reader_status add column if not exists paused_until timestamptz;
alter table public.review_reader_status add column if not exists pause_reason text;

-- Competitors are only places of the same or a very similar Google category (owner 2026-10-09; rule 5).
-- review_businesses.competitors_rule_version: the selection rule the current list was chosen with
-- (null = rule 1, which padded the list up to 30 with any "Restaurante"). Lists of an older rule are
-- searched again by the free reader (discoveryDue; the 06:00 UTC routine queues them, the reader runs
-- them after the customers' own reads, at its competitor pace).
alter table public.review_businesses add column if not exists competitors_rule_version smallint;
