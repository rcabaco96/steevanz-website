-- Rollback of supabase/migrations/20261021130000_chatbot_test_ai.sql: bots on the test AI go back to
-- the free answers, then the original check is restored.

begin;

update public.chatbot_bots set answer_provider = 'mock' where answer_provider = 'gemini';
alter table public.chatbot_bots drop constraint if exists chatbot_bots_answer_provider_check;
alter table public.chatbot_bots add constraint chatbot_bots_answer_provider_check check (answer_provider in ('mock', 'real'));

commit;
