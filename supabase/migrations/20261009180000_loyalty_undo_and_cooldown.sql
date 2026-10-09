-- Loyalty card fixes:
-- - The stamps passed from a paper card no longer start the time between stamps, so today's visit
--   can still be stamped. The welcome stamp still does: it is the first visit's stamp.
-- - Removing a stamp also frees the time between stamps (it goes back to the previous visit stamp).
-- - Removing a stamp from a card that has just been completed undoes it: the unused reward it gave is
--   taken back and the card shows all the stamps but one again.
-- - loyalty_settle_program: after the owner lowers the stamps needed, cards that already have enough
--   are completed straight away.

create or replace function public.loyalty_stamp(p_card uuid, p_amount integer, p_source text, p_enforce_cooldown boolean)
returns table (outcome text, stamps integer, rewards_earned integer, next_allowed_at timestamptz)
language plpgsql
security definer
set search_path = ''
as $$
#variable_conflict use_column
declare
  card public.loyalty_cards;
  program public.loyalty_programs;
  total integer;
  earned integer := 0;
  undone uuid;
  visit boolean := p_source in ('staff_code', 'staff_panel', 'welcome');
  i integer;
begin
  select * into card from public.loyalty_cards where id = p_card for update;
  if not found then
    raise exception 'card_missing';
  end if;
  select * into program from public.loyalty_programs where establishment_id = card.establishment_id;
  if not found or not program.active then
    raise exception 'program_inactive';
  end if;
  if p_enforce_cooldown and p_amount > 0 and card.last_stamp_at is not null
     and card.last_stamp_at > now() - make_interval(mins => program.cooldown_minutes) then
    return query select 'cooldown'::text, card.stamps, 0, card.last_stamp_at + make_interval(mins => program.cooldown_minutes);
    return;
  end if;

  if p_amount < 0 then
    total := card.stamps + p_amount;
    if total < 0 then
      -- The stamp that completed the card: take back the newest unused reward.
      select id into undone from public.loyalty_rewards
        where card_id = card.id and redeemed_at is null
        order by earned_at desc limit 1;
      if undone is null then
        return query select 'nothing'::text, card.stamps, 0, null::timestamptz;
        return;
      end if;
      delete from public.loyalty_rewards where id = undone;
      total := total + program.stamps_required;
      earned := -1;
      insert into public.loyalty_events (card_id, establishment_id, kind, amount, source)
        values (card.id, card.establishment_id, 'reward_earned', -1, p_source);
    end if;
    update public.loyalty_cards
      set stamps = greatest(0, total),
          last_stamp_at = (
            select e.created_at from public.loyalty_events e
            where e.card_id = card.id and e.kind = 'stamp' and e.source in ('staff_code', 'staff_panel', 'welcome')
            order by e.created_at desc offset 1 limit 1
          )
      where id = card.id;
    insert into public.loyalty_events (card_id, establishment_id, kind, amount, source)
      values (card.id, card.establishment_id, 'adjust', p_amount, p_source);
    return query select 'ok'::text, greatest(0, total), earned, null::timestamptz;
    return;
  end if;

  total := card.stamps + p_amount;
  if total >= program.stamps_required then
    earned := total / program.stamps_required;
    total := total % program.stamps_required;
    for i in 1..earned loop
      insert into public.loyalty_rewards (card_id, establishment_id, expires_at)
        values (card.id, card.establishment_id,
          case when program.reward_valid_days is null then null else now() + make_interval(days => program.reward_valid_days) end);
    end loop;
    insert into public.loyalty_events (card_id, establishment_id, kind, amount, source)
      values (card.id, card.establishment_id, 'reward_earned', earned, p_source);
  end if;
  update public.loyalty_cards
    set stamps = total,
        last_stamp_at = case when p_amount > 0 and visit then now() else last_stamp_at end,
        failed_code_attempts = 0,
        locked_until = null
    where id = card.id;
  insert into public.loyalty_events (card_id, establishment_id, kind, amount, source)
    values (card.id, card.establishment_id, case when p_amount > 0 then 'stamp' else 'adjust' end, p_amount, p_source);
  return query select 'ok'::text, total, earned, null::timestamptz;
end;
$$;

create or replace function public.loyalty_settle_program(p_establishment uuid)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  program public.loyalty_programs;
  card public.loyalty_cards;
  earned integer;
  completed integer := 0;
  i integer;
begin
  select * into program from public.loyalty_programs where establishment_id = p_establishment;
  if not found then
    return 0;
  end if;
  for card in
    select * from public.loyalty_cards
    where establishment_id = p_establishment and stamps >= program.stamps_required
    for update
  loop
    earned := card.stamps / program.stamps_required;
    for i in 1..earned loop
      insert into public.loyalty_rewards (card_id, establishment_id, expires_at)
        values (card.id, card.establishment_id,
          case when program.reward_valid_days is null then null else now() + make_interval(days => program.reward_valid_days) end);
    end loop;
    update public.loyalty_cards set stamps = card.stamps % program.stamps_required where id = card.id;
    insert into public.loyalty_events (card_id, establishment_id, kind, amount, source)
      values (card.id, card.establishment_id, 'reward_earned', earned, 'staff_panel');
    completed := completed + 1;
  end loop;
  return completed;
end;
$$;

revoke execute on function public.loyalty_stamp(uuid, integer, text, boolean) from anon, authenticated, public;
revoke execute on function public.loyalty_settle_program(uuid) from anon, authenticated, public;
grant execute on function public.loyalty_stamp(uuid, integer, text, boolean) to service_role;
grant execute on function public.loyalty_settle_program(uuid) to service_role;
