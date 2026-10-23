-- Rollback of supabase/migrations/20261023120000_prospect_crm.sql: the CRM tables and columns go, and
-- the stages go back to the four old statuses (meeting and proposal count as interested, customer as
-- interested too, lost as discarded).

begin;

drop table if exists public.prospect_settings;
drop table if exists public.prospect_events;

drop index if exists public.prospects_next_contact_idx;
drop index if exists public.prospects_site_unchecked_idx;
alter table public.prospects
  drop column if exists next_contact,
  drop column if exists attempts,
  drop column if exists other_emails,
  drop column if exists sector,
  drop column if exists site_status,
  drop column if exists site_reasons,
  drop column if exists site_checked_at,
  drop column if exists worked_at,
  drop column if exists worked_by;

alter table public.prospects drop constraint prospects_status_check;
update public.prospects set status = 'interested' where status in ('meeting', 'proposal', 'customer');
update public.prospects set status = 'discarded' where status = 'lost';
alter table public.prospects add constraint prospects_status_check check (status in ('new', 'contacted', 'interested', 'discarded'));

delete from supabase_migrations.schema_migrations where version = '20261023120000';

commit;
