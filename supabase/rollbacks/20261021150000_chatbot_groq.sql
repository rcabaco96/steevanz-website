-- Rollback of supabase/migrations/20261021150000_chatbot_groq.sql: bots on the Groq test AI go back
-- to the free answers, then the previous check ('mock', 'ollama', 'real') is restored.

begin;

update public.chatbot_bots set answer_provider = 'mock' where answer_provider = 'groq';
alter table public.chatbot_bots drop constraint if exists chatbot_bots_answer_provider_check;
alter table public.chatbot_bots add constraint chatbot_bots_answer_provider_check check (answer_provider in ('mock', 'ollama', 'real'));

commit;
