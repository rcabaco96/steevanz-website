-- Web push for the queue: the customer's phone (or computer) subscribes from the ticket page and
-- gets a notification when called, even with the page closed (Android, computers; iPhone with the
-- page added to the home screen). Free: the browsers' own push services, signed with our VAPID key.
-- The subscription lives with the ticket and goes with it.

alter table public.waitlist_entries
  add column push_subscription jsonb
    check (push_subscription is null or (jsonb_typeof(push_subscription) = 'object' and octet_length(push_subscription::text) <= 2000));
