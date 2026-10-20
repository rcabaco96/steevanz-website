-- Test AI for the WhatsApp assistant (owner, 2026-10-20): a bot can use the Google Gemini free tier
-- for tests («IA de teste (Gemini, grátis)» in the admin, off by default). Only widens the allowed
-- values of chatbot_bots.answer_provider from ('mock', 'real') to ('mock', 'gemini', 'real').
-- Needs 20261020200000_chatbot.sql first. Additive: no row changes. NOT APPLIED: waiting for approval.
-- Rollback (one transaction): supabase/rollbacks/20261021130000_chatbot_test_ai.sql.

begin;

alter table public.chatbot_bots drop constraint if exists chatbot_bots_answer_provider_check;
alter table public.chatbot_bots add constraint chatbot_bots_answer_provider_check check (answer_provider in ('mock', 'gemini', 'real'));

commit;
