-- Rollback of supabase/migrations/20261020200000_chatbot.sql (WhatsApp AI assistant). Removes only
-- what that migration created; no other table or row is touched. Deletes every bot, knowledge entry,
-- session and conversation of the assistant, so export anything worth keeping first.

begin;

drop function if exists public.chatbot_prune();
drop table if exists public.chatbot_messages;
drop table if exists public.chatbot_conversations;
drop table if exists public.chatbot_sessions;
drop table if exists public.chatbot_knowledge;
drop table if exists public.chatbot_bots;

commit;
