-- Product ids renamed on 2026-10-11 (the word "NFC" left the site, URLs and page data):
--   nfc-google-reviews → google-review-plates
--   nfc-social         → social-plates
--   nfc-menu           → digital-menu
-- Every column that stores a product id is updated. Idempotent: running it again changes nothing.
-- The site also reads the old ids (alias map in src/content/products.ts), so it is safe before or
-- after the deploy. No check constraint or enum lists product ids, so none needs changing.

-- Demo bookings and info requests / waitlist leads (one product id each, or null).
update public.bookings b
  set product_id = r.new_id
  from (values ('nfc-google-reviews', 'google-review-plates'), ('nfc-social', 'social-plates'), ('nfc-menu', 'digital-menu')) as r(old_id, new_id)
  where b.product_id = r.old_id;

update public.leads l
  set product_id = r.new_id
  from (values ('nfc-google-reviews', 'google-review-plates'), ('nfc-social', 'social-plates'), ('nfc-menu', 'digital-menu')) as r(old_id, new_id)
  where l.product_id = r.old_id;

-- Client products are unique per (user_id, product_id): if a client somehow has both the old and
-- the new row, the new one stays and the old one goes.
delete from public.client_products old_row
  using (values ('nfc-google-reviews', 'google-review-plates'), ('nfc-social', 'social-plates'), ('nfc-menu', 'digital-menu')) as r(old_id, new_id),
        public.client_products new_row
  where old_row.product_id = r.old_id and new_row.user_id = old_row.user_id and new_row.product_id = r.new_id;

update public.client_products c
  set product_id = r.new_id
  from (values ('nfc-google-reviews', 'google-review-plates'), ('nfc-social', 'social-plates'), ('nfc-menu', 'digital-menu')) as r(old_id, new_id)
  where c.product_id = r.old_id;

-- Products a review business already has (the manual list for businesses without an account).
update public.review_businesses b
  set active_services = (
    select coalesce(array_agg(distinct coalesce(r.new_id, s)), '{}')
    from unnest(b.active_services) as s
    left join (values ('nfc-google-reviews', 'google-review-plates'), ('nfc-social', 'social-plates'), ('nfc-menu', 'digital-menu')) as r(old_id, new_id)
      on r.old_id = s
  )
  where b.active_services && array['nfc-google-reviews', 'nfc-social', 'nfc-menu'];

-- Order lines: items is a JSON array of { productId, quantity, options, ... }; order is kept.
update public.orders o
  set items = (
    select coalesce(
      jsonb_agg(
        case when r.new_id is not null then jsonb_set(e.item, '{productId}', to_jsonb(r.new_id)) else e.item end
        order by e.position
      ),
      '[]'::jsonb
    )
    from jsonb_array_elements(o.items) with ordinality as e(item, position)
    left join (values ('nfc-google-reviews', 'google-review-plates'), ('nfc-social', 'social-plates'), ('nfc-menu', 'digital-menu')) as r(old_id, new_id)
      on jsonb_typeof(e.item) = 'object' and r.old_id = e.item ->> 'productId'
  )
  where jsonb_typeof(o.items) = 'array'
    and exists (
      select 1 from jsonb_array_elements(o.items) as x(item)
      where jsonb_typeof(x.item) = 'object' and x.item ->> 'productId' in ('nfc-google-reviews', 'nfc-social', 'nfc-menu')
    );
