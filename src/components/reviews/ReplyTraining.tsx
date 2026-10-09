"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { CloseIcon } from "@/components/icons";
import { buttonClasses } from "@/components/ui/Button";
import { isNegative } from "@/lib/reviews/analytics";
import { formatDate } from "@/lib/reviews/format";
import { removeSnippetAction, skipTrainingAction, trainAction } from "@/lib/reviews/reply-actions";
import { ownerReplyMinChars } from "@/lib/reviews/owner-replies";
import { snippetKindLabels, themeNames } from "@/lib/reviews/reply-rules";
import type { LibrarySnippet, TrainingReview } from "@/lib/reviews/reply-store";
import { InfoTip } from "./InfoTip";
import { ReviewText } from "./ReviewText";
import { Stars } from "./Stars";

const fieldClasses =
  "w-full rounded-xl border border-line-strong bg-surface px-3.5 py-3 text-[0.95rem] leading-relaxed text-text placeholder:text-subtle focus-visible:outline-2 focus-visible:outline-ring";

export function snippetLabel(snippet: Pick<LibrarySnippet, "kind" | "theme" | "sentiment"> & { source?: LibrarySnippet["source"] }): string {
  const kind = snippet.kind === "theme" && snippet.theme ? `Sobre ${themeNames[snippet.theme]}` : snippetKindLabels[snippet.kind];
  return [kind, snippet.sentiment === "positive" ? "positivas" : "negativas", snippet.source === "google" ? "das suas respostas no Google" : null].filter(Boolean).join(" · ");
}

function SnippetChip({ slug, snippet, onRemoved }: { slug: string; snippet: LibrarySnippet; onRemoved: () => void }) {
  const [pending, startTransition] = useTransition();
  return (
    <li className={`flex items-start gap-2 rounded-xl border border-line bg-surface p-2.5 ${pending ? "opacity-50" : ""}`}>
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-xs font-semibold text-accent-text">{snippetLabel(snippet)}</span>
        <span className="text-sm text-text">{snippet.text.replaceAll("<contacto>", "[contacto]")}</span>
      </span>
      <button
        type="button"
        aria-label={`Não usar a frase: ${snippet.text}`}
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            const result = await removeSnippetAction(slug, snippet.id);
            if (result.ok) onRemoved();
          })
        }
        className="-m-1 grid h-9 w-9 shrink-0 place-items-center rounded-full text-subtle hover:bg-surface-2 hover:text-danger"
      >
        <CloseIcon size={16} />
      </button>
    </li>
  );
}

/** "Treinar": the owner answers real reviews; each sentence of the answer goes into the library. */
export function ReplyTraining({ slug, queue }: { slug: string; queue: TrainingReview[] }) {
  const router = useRouter();
  const queueKey = queue.map((review) => review.id).join();
  // The reviews on screen. Every action on the page refreshes `queue` (an answered review drops out
  // of it), so a new queue is only taken once this batch is finished: removing a learned sentence or
  // approving a reply never jumps to another review.
  const [batch, setBatch] = useState({ key: queueKey, reviews: queue });
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState(queue[0]?.ownerReply ?? "");
  const [learned, setLearned] = useState<LibrarySnippet[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  // State adjusted during render (not in an effect), like ReplyLibrary. Only a queue without the
  // reviews just answered or skipped is taken: a refresh from an earlier action may still list them.
  const finished = index >= batch.reviews.length;
  if (finished && queueKey !== batch.key && !queue.some((review) => batch.reviews.some((answered) => answered.id === review.id))) {
    setBatch({ key: queueKey, reviews: queue });
    setIndex(0);
    setAnswer(queue[0]?.ownerReply ?? "");
  }
  const reviews = batch.reviews;
  const review = reviews[index];

  function next() {
    setLearned(null);
    setError(null);
    if (index + 1 < reviews.length) {
      setIndex(index + 1);
      setAnswer(reviews[index + 1].ownerReply ?? "");
    } else {
      // The server picks the next reviews from what the library still lacks.
      setIndex(reviews.length);
      router.refresh();
    }
  }

  return (
    <section aria-labelledby="treinar-title" className="card flex flex-col gap-4 p-4 sm:p-5">
      <div className="flex flex-col gap-1">
        <h2 id="treinar-title" className="flex items-center gap-1.5 font-semibold text-text">
          Treinar as respostas
          <InfoTip label="Treinar as respostas">
            Escolhemos reviews reais do seu negócio sobre situações que as suas frases ainda não cobrem (por exemplo, uma queixa da espera). As reviews a que já respondeu no
            Google em português (com pelo menos {ownerReplyMinChars} caracteres) não aparecem: as frases dessas respostas são aprendidas sozinhas, sempre que as reviews são
            lidas do Google. A sua resposta é partida em frases:
            a primeira serve de abertura, as que falam de um tema (atendimento, qualidade, preço, espera, limpeza, ambiente, localização) ficam associadas a esse tema, os
            convites ao contacto ficam como contacto e as restantes como fecho. As respostas novas usam as suas frases primeiro e só recorrem às frases-base da Steevanz quando
            ainda não há uma sua para o caso.
          </InfoTip>
        </h2>
        <p className="text-sm text-muted">Responda como responderia no Google. Leva um minuto e as respostas passam a soar a si.</p>
      </div>

      {!review ? (
        <p className="text-sm text-muted">{reviews.length ? "A procurar mais reviews para treinar…" : "Já respondeu a todas as reviews com texto disponíveis. Obrigado!"}</p>
      ) : learned ? (
        <div className="flex flex-col gap-3">
          <p role="status" className="text-sm font-semibold text-success">
            {learned.length ? `Aprendi ${learned.length} ${learned.length === 1 ? "frase" : "frases"}:` : "Estas frases já estavam guardadas."}
          </p>
          {learned.length ? (
            <ul className="flex flex-col gap-2">
              {learned.map((snippet) => (
                <SnippetChip key={snippet.id} slug={slug} snippet={snippet} onRemoved={() => setLearned((current) => current?.filter((item) => item.id !== snippet.id) ?? null)} />
              ))}
            </ul>
          ) : null}
          {learned.length ? <p className="text-xs text-subtle">Retire as frases que só fazem sentido nesta review (por exemplo, se falam de um prato ou de uma pessoa).</p> : null}
          <button type="button" onClick={next} className={buttonClasses("primary", "md", "self-start")}>
            {index + 1 < reviews.length ? "Próxima review" : "Mais reviews"}
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-2 rounded-2xl border border-line p-3.5">
            <div className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-2">
                <Stars rating={review.rating} size={14} />
                <span className="sr-only">{review.rating} estrelas</span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${isNegative(review.rating) ? "bg-danger-soft text-danger" : "bg-success-soft text-success"}`}>
                  {isNegative(review.rating) ? "Negativa" : "Positiva"}
                </span>
              </span>
              <span className="text-xs text-subtle">
                {index + 1} de {reviews.length} · {formatDate(review.publishedAt)}
              </span>
            </div>
            <ReviewText text={review.text} />
            {review.themes.length ? <p className="text-xs text-subtle">Fala de: {review.themes.map((theme) => themeNames[theme]).join(", ")}</p> : null}
          </div>
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold text-text">A sua resposta</span>
            {review.ownerReply ? <span className="-mt-1 text-xs text-subtle">Preenchida com a resposta que já deu no Google.</span> : null}
            <textarea className={`${fieldClasses} min-h-28`} maxLength={1500} value={answer} onChange={(event) => setAnswer(event.target.value)} />
          </label>
          {error ? (
            <p role="alert" className="text-sm text-danger">
              {error}
            </p>
          ) : null}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={pending || answer.trim().length < 3}
              onClick={() =>
                startTransition(async () => {
                  const result = await trainAction(slug, review.id, answer);
                  if (result.ok) setLearned(result.learned);
                  else setError(result.message);
                })
              }
              className={buttonClasses("primary", "md")}
            >
              {pending ? "A aprender…" : "Guardar e aprender"}
            </button>
            <button
              type="button"
              disabled={pending}
              onClick={() =>
                startTransition(async () => {
                  await skipTrainingAction(slug, review.id);
                  next();
                })
              }
              className={buttonClasses("ghost", "md")}
            >
              Saltar
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

/** The owner's sentence library, grouped by use, with a way to drop any sentence. */
export function ReplyLibrary({ slug, library }: { slug: string; library: LibrarySnippet[] }) {
  const [items, setItems] = useState(library);
  const [syncedFrom, setSyncedFrom] = useState(library);
  // New props after a refresh replace the local list (state adjusted during render, not in an effect).
  if (library !== syncedFrom) {
    setSyncedFrom(library);
    setItems(library);
  }
  return (
    <details className="card group p-4 sm:p-5">
      <summary className="flex min-h-10 cursor-pointer list-none items-center justify-between gap-2 font-semibold text-text">
        <span className="flex items-center gap-1.5">
          As suas frases
          <span className="rounded-full bg-surface-2 px-2 text-xs">{items.length}</span>
        </span>
        <span className="text-sm font-semibold text-accent-text group-open:hidden">Ver</span>
        <span className="hidden text-sm font-semibold text-accent-text group-open:inline">Esconder</span>
      </summary>
      <div className="mt-3 flex flex-col gap-2">
        {items.length ? (
          <>
            <p className="text-xs text-subtle">Frases rejeitadas mais vezes do que aceites deixam de ser usadas sozinhas.</p>
            <ul className="flex flex-col gap-2">
              {items.map((snippet) => (
                <SnippetChip key={snippet.id} slug={slug} snippet={snippet} onRemoved={() => setItems((current) => current.filter((item) => item.id !== snippet.id))} />
              ))}
            </ul>
          </>
        ) : (
          <p className="text-sm text-muted">
            Ainda não há frases suas. Aprendemos sozinhos com as respostas que der no Google em português; pode também usar «Treinar as respostas» ou editar uma resposta antes
            de a aceitar.
          </p>
        )}
      </div>
    </details>
  );
}
