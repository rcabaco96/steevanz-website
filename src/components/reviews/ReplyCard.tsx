"use client";

import { useState, useTransition } from "react";
import { ArrowUpRight, Check, SparkleIcon } from "@/components/icons";
import { Skeleton } from "@/components/ui/Skeleton";
import { buttonClasses } from "@/components/ui/Button";
import { isNegative } from "@/lib/reviews/analytics";
import { formatDateTime } from "@/lib/reviews/format";
import { googleReviewUrl } from "@/lib/reviews/google-links";
import { alternativesAction, approveDraftAction, chooseAlternativeAction, rejectDraftAction, undoApprovalAction } from "@/lib/reviews/reply-actions";
import type { InboxItem, ReplyAlternative } from "@/lib/reviews/reply-store";
import { rejectReasons } from "@/lib/reviews/replies";
import { InfoTip } from "./InfoTip";
import { ReviewText } from "./ReviewText";
import { Stars } from "./Stars";

type Mode = "view" | "edit" | "reject" | "alternatives";
type Action = "approve" | "reject" | "choose" | "undo";

const fieldClasses =
  "w-full rounded-xl border border-line-strong bg-surface px-3.5 py-3 text-[0.95rem] leading-relaxed text-text placeholder:text-subtle focus-visible:outline-2 focus-visible:outline-ring";

export function ReplyCard({ slug, item, googleFid }: { slug: string; item: InboxItem; googleFid: string | null }) {
  const [mode, setMode] = useState<Mode>("view");
  const [text, setText] = useState(item.reply);
  const [reasons, setReasons] = useState<string[]>([]);
  const [message, setMessage] = useState<{ tone: "ok" | "error"; text: string } | null>(null);
  const [pending, startTransition] = useTransition();
  const [action, setAction] = useState<Action | null>(null);
  const [alternatives, setAlternatives] = useState<ReplyAlternative[] | null>(null);
  const [loadingAlternatives, startLoadingAlternatives] = useTransition();
  const negative = isNegative(item.review.rating);
  const publishedOnGoogle = Boolean(item.review.ownerReply);
  const googleUrl = googleReviewUrl(item.review.id, googleFid);
  const redrafting = pending && (action === "reject" || action === "choose");

  function showAlternatives() {
    setMode("alternatives");
    setMessage(null);
    setAlternatives(null);
    startLoadingAlternatives(async () => {
      const result = await alternativesAction(slug, item.draftId);
      if (result.ok) setAlternatives(result.options);
      else {
        setMode("view");
        setMessage({ tone: "error", text: result.message });
      }
    });
  }

  function run(kind: Action, task: () => Promise<{ ok: boolean; message?: string }>) {
    setAction(kind);
    setMessage(null);
    startTransition(async () => {
      const result = await task();
      if (!result.ok) setMessage({ tone: "error", text: result.message ?? "Ocorreu um erro." });
      else {
        setMode("view");
        if (result.message) setMessage({ tone: "ok", text: result.message });
      }
    });
  }

  return (
    <li className={`card flex flex-col gap-4 p-4 sm:p-5 ${negative && item.status === "pending" ? "border-danger/40" : ""}`} aria-busy={pending || undefined}>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-2">
            <Stars rating={item.review.rating} size={14} />
            <span className="sr-only">{item.review.rating} estrelas</span>
            {negative ? <span className="rounded-full bg-danger-soft px-2 py-0.5 text-xs font-semibold text-danger">Negativa</span> : null}
          </span>
          <span className="text-xs text-subtle">{formatDateTime(item.review.publishedAt)}</span>
        </div>
        <ReviewText text={item.review.text} />
        {googleUrl ? (
          <a href={googleUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center gap-1.5 self-start text-sm font-semibold text-accent-text hover:underline">
            {publishedOnGoogle ? "Ver no Google" : "Abrir esta review no Google"} <ArrowUpRight size={15} />
          </a>
        ) : null}
      </div>

      <div className={`flex flex-col gap-2 rounded-2xl p-3.5 ${item.status === "approved" ? "bg-success-soft" : "bg-accent-soft"}`}>
        <div className="flex items-center justify-between gap-2">
          <p className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide text-accent-text uppercase">
            <SparkleIcon size={14} />
            {item.status === "approved" ? "Resposta aprovada" : "Resposta sugerida"}
            {item.edited ? <span className="font-normal normal-case text-subtle">· editada por si</span> : null}
          </p>
          {item.reasoning && !redrafting ? (
            <InfoTip label="Como montei esta resposta">{item.reasoning}</InfoTip>
          ) : null}
        </div>
        {redrafting || item.status === "generating" ? (
          <div className="flex flex-col gap-2 py-1">
            <span role="status" className="sr-only">
              A montar uma nova resposta…
            </span>
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-3.5 w-11/12" />
            <Skeleton className="h-3.5 w-2/3" />
          </div>
        ) : mode === "edit" ? (
          <textarea aria-label="Editar resposta" className={`${fieldClasses} min-h-36`} value={text} maxLength={4000} onChange={(event) => setText(event.target.value)} />
        ) : (
          <p className="text-[0.95rem] leading-relaxed whitespace-pre-line text-text">{item.reply}</p>
        )}
      </div>

      {mode === "reject" && !redrafting ? (
        <div className="flex flex-col gap-3 rounded-2xl border border-line p-3.5">
          <p className="text-sm font-semibold text-text">O que não está bem? (opcional)</p>
          <div className="flex flex-wrap gap-1.5">
            {rejectReasons.map((reason) => {
              const selected = reasons.includes(reason.id);
              return (
                <button
                  key={reason.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setReasons((current) => (selected ? current.filter((id) => id !== reason.id) : [...current, reason.id]))}
                  className={`inline-flex h-9 items-center gap-1 rounded-full px-3 text-sm font-semibold transition-colors ${
                    selected ? "bg-surface-inverse text-inverse" : "border border-line bg-surface text-muted hover:text-text"
                  }`}
                >
                  {selected ? <Check size={14} /> : null}
                  {reason.label}
                </button>
              );
            })}
          </div>
          <p className="text-xs text-subtle">Monto outra resposta com frases diferentes. Prefere escrever a sua? Use «Editar»: as suas frases ficam guardadas para as próximas.</p>
        </div>
      ) : null}

      {mode === "alternatives" && !redrafting ? (
        <div className="flex flex-col gap-3 rounded-2xl border border-line p-3.5" aria-busy={loadingAlternatives || undefined}>
          <p className="flex items-center gap-1.5 text-sm font-semibold text-text">
            Escolha outra resposta
            <InfoTip label="Outras respostas">
              Até 5 respostas com textos diferentes, montadas com as suas frases e com frases-base da Steevanz. Nunca repetem uma resposta já mostrada para esta review nem
              um texto que tenha escrito. A que escolher passa a ser a sugestão e ainda espera por «Aceitar»; a anterior conta como rejeitada.
            </InfoTip>
          </p>
          {loadingAlternatives || !alternatives ? (
            <ul className="flex flex-col gap-2">
              <li className="sr-only" role="status">
                A preparar alternativas…
              </li>
              {[0, 1, 2].map((index) => (
                <li key={index} className="flex flex-col gap-2 rounded-xl border border-line p-3" aria-hidden="true">
                  <Skeleton className="h-3.5 w-full" />
                  <Skeleton className={`h-3.5 ${index % 2 ? "w-3/4" : "w-5/6"}`} />
                  <Skeleton className="h-9 w-28 rounded-full" />
                </li>
              ))}
            </ul>
          ) : alternatives.length ? (
            <ol className="flex flex-col gap-2">
              {alternatives.map((option, index) => (
                <li key={option.id} className="flex flex-col gap-2.5 rounded-xl border border-line bg-surface p-3">
                  <span className="text-xs font-semibold text-subtle">Opção {index + 1}</span>
                  <p className="text-[0.95rem] leading-relaxed whitespace-pre-line text-text">{option.reply}</p>
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => run("choose", () => chooseAlternativeAction(slug, item.draftId, option.id))}
                    className={buttonClasses("secondary", "sm", "self-start")}
                  >
                    Usar esta
                  </button>
                </li>
              ))}
            </ol>
          ) : null}
          {alternatives && alternatives.length < 5 ? (
            <p className="text-xs text-subtle">
              {alternatives.length
                ? `Só há ${alternatives.length} ${alternatives.length === 1 ? "alternativa diferente" : "alternativas diferentes"} com as frases atuais.`
                : "Já não há respostas diferentes com as frases atuais."}{" "}
              Treine mais respostas ou use «Editar» para ter mais variedade.
            </p>
          ) : null}
          <button type="button" disabled={pending} onClick={() => setMode("view")} className={buttonClasses("ghost", "md", "self-start")}>
            Manter a atual
          </button>
        </div>
      ) : null}

      {message ? (
        <p role={message.tone === "error" ? "alert" : "status"} className={`text-sm ${message.tone === "error" ? "text-danger" : "text-success"}`}>
          {message.text}
        </p>
      ) : null}

      {item.status === "pending" ? (
        publishedOnGoogle ? (
          <p className="text-sm text-muted">Já respondeu a esta review diretamente no Google.</p>
        ) : mode === "view" ? (
          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
            <button type="button" disabled={pending} onClick={() => run("approve", () => approveDraftAction(slug, item.draftId, null))} className={buttonClasses("primary", "md", "px-3 sm:px-5")}>
              {pending && action === "approve" ? "A aprovar…" : "Aceitar"}
            </button>
            <button
              type="button"
              disabled={pending}
              onClick={showAlternatives}
              className={buttonClasses("secondary", "md", "px-3 sm:px-5")}
            >
              Outra resposta
            </button>
            <button
              type="button"
              disabled={pending}
              onClick={() => {
                setText(item.reply);
                setMode("edit");
              }}
              className={buttonClasses("secondary", "md", "px-3 sm:px-5")}
            >
              Editar
            </button>
            <button type="button" disabled={pending} onClick={() => setMode("reject")} className={buttonClasses("ghost", "md", "px-3 text-danger! sm:px-5")}>
              Rejeitar…
            </button>
          </div>
        ) : mode === "edit" ? (
          <div className="flex flex-wrap gap-2">
            <button type="button" disabled={pending || !text.trim()} onClick={() => run("approve", () => approveDraftAction(slug, item.draftId, text))} className={buttonClasses("primary", "md")}>
              {pending ? "A aprovar…" : "Guardar e aceitar"}
            </button>
            <button type="button" disabled={pending} onClick={() => setMode("view")} className={buttonClasses("ghost", "md")}>
              Cancelar
            </button>
          </div>
        ) : redrafting || mode === "alternatives" ? null : (
          <div className="flex flex-wrap gap-2">
            <button type="button" disabled={pending} onClick={() => run("reject", () => rejectDraftAction(slug, item.draftId, reasons))} className={buttonClasses("primary", "md")}>
              Rejeitar e montar outra
            </button>
            <button type="button" disabled={pending} onClick={() => setMode("view")} className={buttonClasses("ghost", "md")}>
              Cancelar
            </button>
          </div>
        )
      ) : null}

      {item.status === "approved" ? (
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
          <span className="inline-flex items-center gap-1.5 text-muted">
            <Check size={15} className="text-success" />
            {item.approvedBy === "auto" ? "Aprovada automaticamente" : "Aprovada por si"}
            {item.decidedAt ? ` · ${formatDateTime(item.decidedAt)}` : ""}
            <span className="text-subtle">· {publishedOnGoogle ? "publicada no Google" : "por publicar no Google"}</span>
          </span>
          {!publishedOnGoogle ? (
            <button type="button" disabled={pending} onClick={() => run("undo", () => undoApprovalAction(slug, item.draftId))} className="min-h-10 font-semibold text-accent-text hover:underline disabled:opacity-50">
              {pending && action === "undo" ? "A desfazer…" : "Desfazer"}
            </button>
          ) : null}
        </div>
      ) : null}
    </li>
  );
}
