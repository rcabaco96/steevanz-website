-- Restaurant bookings count people, not tables: the group service created for restaurants is a
-- "Reserva", not a "Mesa".
update public.establishment_services set name = 'Reserva' where name = 'Mesa' and booking_kind = 'group';
