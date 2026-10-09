-- Loyalty card: rewards along the way, a minimum spend per stamp, and each reward keeps its text.
--
-- - loyalty_programs.milestones: up to 3 rewards before the card is complete, e.g.
--   [{"at": 3, "reward": "Um café"}, {"at": 6, "reward": "Uma sobremesa"}]; the reward at
--   stamps_required stays in loyalty_programs.reward. The first reward comes early, the big one at
--   the end, without asking for several full cards.
-- - loyalty_programs.min_spend_cents: "1 carimbo por visita a partir de X €". Shown to customers and
--   staff; the team applies it (there is no till to read the amount from).
-- - loyalty_rewards.label / at_stamp: the reward's text and position when it was earned, so changing
--   the rewards later never changes one a customer already has.

alter table public.loyalty_programs
  add column milestones jsonb not null default '[]'::jsonb
    check (jsonb_typeof(milestones) = 'array' and jsonb_array_length(milestones) <= 3),
  add column min_spend_cents integer check (min_spend_cents between 1 and 100000);

alter table public.loyalty_rewards
  add column label text check (char_length(label) <= 120),
  add column at_stamp integer;

update public.loyalty_rewards r
  set label = p.reward, at_stamp = p.stamps_required
  from public.loyalty_programs p
  where p.establishment_id = r.establishment_id and r.label is null;

/** The reward (text) at a position of the card, or null: the milestones, then the full card. */
create or replace function public.loyalty_reward_at(p_program public.loyalty_programs, p_position integer)
returns text
language sql
immutable
set search_path = ''
as $$
  select case
    when p_position = p_program.stamps_required then p_program.reward
    else (
      select m->>'reward' from jsonb_array_elements(p_program.milestones) m
      where (m->>'at')::integer = p_position and (m->>'at')::integer < p_program.stamps_required
      limit 1
    )
  end;
$$;

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
  removed_at integer;
  label text;
  undone uuid;
  visit boolean := p_source in ('staff_code', 'staff_panel', 'welcome');
  k integer;
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
    -- Removing the newest stamp (the panel removes one at a time). On an empty card, that is the
    -- stamp that completed it. If that stamp gave a reward that is still unused, it is taken back.
    removed_at := case when card.stamps = 0 then program.stamps_required else card.stamps end;
    select id into undone from public.loyalty_rewards
      where card_id = card.id and redeemed_at is null and at_stamp = removed_at
      order by earned_at desc limit 1;
    if card.stamps = 0 and undone is null then
      return query select 'nothing'::text, card.stamps, 0, null::timestamptz;
      return;
    end if;
    if undone is not null then
      delete from public.loyalty_rewards where id = undone;
      earned := -1;
      insert into public.loyalty_events (card_id, establishment_id, kind, amount, source)
        values (card.id, card.establishment_id, 'reward_earned', -1, p_source);
    end if;
    total := greatest(0, removed_at + p_amount);
    -- The time between stamps goes back to the previous visit only when the stamp taken back was a
    -- visit's (stamps passed from a paper card never started it).
    update public.loyalty_cards
      set stamps = total,
          last_stamp_at = case
            when (select e.source from public.loyalty_events e
                  where e.card_id = card.id and e.kind = 'stamp'
                  order by e.created_at desc limit 1) in ('staff_code', 'staff_panel', 'welcome')
            then (select e.created_at from public.loyalty_events e
                  where e.card_id = card.id and e.kind = 'stamp' and e.source in ('staff_code', 'staff_panel', 'welcome')
                  order by e.created_at desc offset 1 limit 1)
            else card.last_stamp_at
          end
      where id = card.id;
    insert into public.loyalty_events (card_id, establishment_id, kind, amount, source)
      values (card.id, card.establishment_id, 'adjust', p_amount, p_source);
    return query select 'ok'::text, total, earned, null::timestamptz;
    return;
  end if;

  -- Each new stamp lands on a position of the card: a milestone or the last one gives its reward.
  for k in 1..p_amount loop
    label := public.loyalty_reward_at(program, (card.stamps + k - 1) % program.stamps_required + 1);
    if label is not null then
      insert into public.loyalty_rewards (card_id, establishment_id, expires_at, label, at_stamp)
        values (card.id, card.establishment_id,
          case when program.reward_valid_days is null then null else now() + make_interval(days => program.reward_valid_days) end,
          label, (card.stamps + k - 1) % program.stamps_required + 1);
      earned := earned + 1;
    end if;
  end loop;
  if earned > 0 then
    insert into public.loyalty_events (card_id, establishment_id, kind, amount, source)
      values (card.id, card.establishment_id, 'reward_earned', earned, p_source);
  end if;
  total := (card.stamps + p_amount) % program.stamps_required;
  update public.loyalty_cards
    set stamps = total,
        last_stamp_at = case when visit then now() else last_stamp_at end,
        failed_code_attempts = 0,
        locked_until = null
    where id = card.id;
  insert into public.loyalty_events (card_id, establishment_id, kind, amount, source)
    values (card.id, card.establishment_id, 'stamp', p_amount, p_source);
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
      insert into public.loyalty_rewards (card_id, establishment_id, expires_at, label, at_stamp)
        values (card.id, card.establishment_id,
          case when program.reward_valid_days is null then null else now() + make_interval(days => program.reward_valid_days) end,
          program.reward, program.stamps_required);
    end loop;
    update public.loyalty_cards set stamps = card.stamps % program.stamps_required where id = card.id;
    insert into public.loyalty_events (card_id, establishment_id, kind, amount, source)
      values (card.id, card.establishment_id, 'reward_earned', earned, 'staff_panel');
    completed := completed + 1;
  end loop;
  return completed;
end;
$$;

revoke execute on function public.loyalty_reward_at(public.loyalty_programs, integer) from anon, authenticated, public;
revoke execute on function public.loyalty_stamp(uuid, integer, text, boolean) from anon, authenticated, public;
revoke execute on function public.loyalty_settle_program(uuid) from anon, authenticated, public;
grant execute on function public.loyalty_reward_at(public.loyalty_programs, integer) to service_role;
grant execute on function public.loyalty_stamp(uuid, integer, text, boolean) to service_role;
grant execute on function public.loyalty_settle_program(uuid) to service_role;
