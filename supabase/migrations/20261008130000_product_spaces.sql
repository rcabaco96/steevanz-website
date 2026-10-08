-- Products are sold per space: a client with three restaurants pays the waitlist three times (same
-- price each). `spaces` says how many of the client's spaces a product covers; they are the first
-- ones created (the admin raises the number when another space is sold).

alter table public.client_products
  add column spaces integer not null default 1 check (spaces between 1 and 100);
