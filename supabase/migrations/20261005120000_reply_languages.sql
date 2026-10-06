-- Replies in the review's language: a review with text is answered in its language (pt, en, es,
-- fr, de, it, nl; other languages in English) and the owner sees the Portuguese translation under
-- it. The translation is the same base sentences composed in Portuguese (no translation service).
-- language: language of `reply`; reply_pt: the Portuguese version (null when `reply` is Portuguese).

alter table public.review_reply_drafts
  add column language text not null default 'pt',
  add column reply_pt text;

alter table public.review_reply_alternatives
  add column language text not null default 'pt',
  add column reply_pt text;

-- The old English-only base reply ("default:english") was English.
update public.review_reply_drafts set language = 'en' where 'default:english' = any (snippet_ids);
update public.review_reply_alternatives set language = 'en' where 'default:english' = any (snippet_ids);

-- Replies still waiting for the owner on reviews Google marks as written in another language were
-- built in Portuguese (or with the old English reply, without translation): they are dropped and
-- built again, in the review's language, on the next «Atualizar». Approved and rejected ones stay.
delete from public.review_reply_drafts d
using public.google_reviews r
where r.review_id = d.review_id
  and d.status in ('pending', 'generating')
  and coalesce(trim(r.text), '') <> ''
  and r.language is not null
  and lower(split_part(r.language, '-', 1)) <> 'pt';
