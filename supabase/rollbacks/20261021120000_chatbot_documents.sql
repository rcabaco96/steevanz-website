-- Rollback of supabase/migrations/20261021120000_chatbot_documents.sql. Removes only the assistant's
-- documents and their sections; the rest of the assistant (bots, knowledge, conversations) stays.

begin;

drop table if exists public.chatbot_document_chunks;
drop table if exists public.chatbot_documents;

commit;
