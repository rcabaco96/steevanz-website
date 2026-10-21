-- Test AI for the WhatsApp assistant (owner, 2026-10-21): a bot can use a free AI model running on
-- the owner's own computer through Ollama («IA de teste local (Ollama, grátis)» in the admin, off by
-- default; only works where Ollama runs, never on Vercel). Only widens the allowed values of
-- chatbot_bots.answer_provider from ('mock', 'real') to ('mock', 'ollama', 'real').
-- Needs 20261020200000_chatbot.sql first. Additive: no row changes. Applied 2026-10-21.
-- Rollback (one transaction): supabase/rollbacks/20261021130000_chatbot_test_ai.sql.

begin;

alter table public.chatbot_bots drop constraint if exists chatbot_bots_answer_provider_check;
alter table public.chatbot_bots add constraint chatbot_bots_answer_provider_check check (answer_provider in ('mock', 'ollama', 'real'));

commit;
