-- Share of a competitor's recent Google reviews that have an owner reply. Measured from the same
-- newest reviews already read for its pace (no extra Apify call): up to 60, published between
-- 12 months and 7 days before the measurement. Only the aggregate is stored, never review or
-- reply texts. Null reply_sample means not measured yet (competitors measured before this).

alter table public.competitors
  add column reply_rate numeric(4, 3) check (reply_rate between 0 and 1),
  add column reply_sample smallint check (reply_sample >= 0),
  add column reply_since date;

comment on column public.competitors.reply_rate is 'Share (0-1) of the counted recent reviews with an owner reply; null when none was counted.';
comment on column public.competitors.reply_sample is 'Reviews counted for reply_rate (newest up to 60, 7 days to 12 months old at pace_measured_at).';
comment on column public.competitors.reply_since is 'Publication day of the oldest review counted for reply_rate.';
