-- Groq test AI for the WhatsApp assistant (owner, 2026-10-21): a bot can use Groq's FREE tier as a
-- test AI that also works on the site («IA de teste (Groq, grátis)» in the admin, off by default;
-- capped well inside the free limits, falls back to the free answers on any limit, error or timeout;
-- never a paid plan). Only widens the allowed values of chatbot_bots.answer_provider from
-- ('mock', 'ollama', 'real') to ('mock', 'ollama', 'groq', 'real').
-- Needs 20261021130000_chatbot_test_ai.sql first. Additive: no row changes. Applied 2026-10-21.
-- Rollback (one transaction): supabase/rollbacks/20261021150000_chatbot_groq.sql.

begin;

alter table public.chatbot_bots drop constraint if exists chatbot_bots_answer_provider_check;
alter table public.chatbot_bots add constraint chatbot_bots_answer_provider_check check (answer_provider in ('mock', 'ollama', 'groq', 'real'));

commit;
