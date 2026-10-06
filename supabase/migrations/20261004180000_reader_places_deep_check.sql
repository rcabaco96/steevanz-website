-- Replies are checked daily over the last 7 days and, once a month per place, over the last 30
-- days (catches late owner replies). This records the last 30-day check of each place.
alter table public.reader_places add column deep_checked_on date;
