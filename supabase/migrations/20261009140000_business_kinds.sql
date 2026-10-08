-- More kinds of business, each with its own starting services for bookings (see
-- src/lib/establishments/kinds.ts). Adding a kind later is one more value here plus its entry there.
alter type public.business_kind add value if not exists 'barbershop';
alter type public.business_kind add value if not exists 'sports';
