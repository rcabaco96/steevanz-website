-- Last alerts about the local reader (e.g. id 'offline': the owner was emailed because the reader
-- did not report for 12+ hours). Kept apart from review_reader_status, whose rows are readers.
create table public.review_reader_alerts (
  id text primary key,
  sent_at timestamptz not null default now()
);
alter table public.review_reader_alerts enable row level security;
