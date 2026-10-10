-- All the Google categories of a customer's place, main first (business rule 5, 2026-10-10): the
-- reader saves them from the place data Google Maps loads with the page (when it reads the customer's
-- reviews and when it searches its competitors). The competitor search uses the main one and the
-- secondary ones (a gym whose main category is "Treinador pessoal" also has "Ginásio"…).
-- review_businesses.category stays the main one. Null until the reader reads the place again.

alter table public.review_businesses add column if not exists categories text[];

comment on column public.review_businesses.categories is
  'All the Google categories of the place, main first (read by the reader from the Maps place data). Null until read.';
