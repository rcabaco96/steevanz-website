-- Takes one automatic approval from a business's quota ("Só as próximas N" or "Sempre").
-- Atomic, so parallel drafts can never use more approvals than the customer allowed.
create or replace function public.take_auto_reply(p_business_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  taken boolean;
begin
  update public.review_reply_settings
     set auto_used = auto_used + 1
   where business_id = p_business_id
     and (auto_mode = 'always' or (auto_mode = 'limit' and auto_used < auto_limit))
  returning true into taken;
  return coalesce(taken, false);
end;
$$;

revoke all on function public.take_auto_reply(uuid) from public, anon, authenticated;
grant execute on function public.take_auto_reply(uuid) to service_role;
