"use client";

import { useId, useState } from "react";
import { ChevronDown } from "@/components/icons";
import type { PeriodId } from "@/lib/reviews/analytics";
import { formatDateTime } from "@/lib/reviews/format";
import type { ThemeId } from "@/lib/reviews/text";
import type { ThemeReview } from "@/lib/reviews/types";
import { ReviewText } from "./ReviewText";
import { Stars } from "./Stars";

const pageSize = 10;

type State =
  | { status: "closed" }
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; reviews: ThemeReview[]; total: number };

interface ThemeReviewsProps {
  slug: string;
  theme: ThemeId;
  period: PeriodId;
  count: number;
  label: string;
}

export function ThemeReviews({ slug, theme, period, count, label }: ThemeReviewsProps) {
  const id = useId();
  const [state, setState] = useState<State>({ status: "closed" });
  const [loaded, setLoaded] = useState<Extract<State, { status: "ready" }> | null>(null);
  const [shown, setShown] = useState(pageSize);
  const open = state.status !== "closed";

  async function toggle() {
    if (open) {
      setState({ status: "closed" });
      return;
    }
    if (loaded) {
      setState(loaded);
      return;
    }
    setState({ status: "loading" });
    try {
      const response = await fetch(`/api/painel/${encodeURIComponent(slug)}/reviews?tema=${theme}&periodo=${period}`, { cache: "no-store" });
      if (!response.ok) throw new Error(String(response.status));
      const body = (await response.json()) as { reviews: ThemeReview[]; total: number };
      const ready = { status: "ready" as const, reviews: body.reviews, total: body.total };
      setLoaded(ready);
      setState(ready);
    } catch {
      setState({ status: "error" });
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={() => void toggle()}
        aria-expanded={open}
        aria-controls={id}
        className="inline-flex min-h-10 items-center gap-1.5 self-start text-sm font-semibold text-accent-text hover:underline"
      >
        {open ? "Esconder reviews" : label}
        <ChevronDown size={16} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      <div id={id} aria-live="polite">
        {state.status === "loading" ? (
          <p className="flex items-center gap-2 text-sm text-muted">
            <span aria-hidden="true" className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" />A carregar {count} reviews…
          </p>
        ) : null}
        {state.status === "error" ? <p className="text-sm text-danger">Não foi possível carregar as reviews. Tente novamente.</p> : null}
        {state.status === "ready" ? (
          <div className="flex flex-col gap-3">
            <ul className="flex flex-col gap-2">
              {state.reviews.slice(0, shown).map((review) => (
                <li key={review.id} className="flex flex-col gap-2 rounded-xl border border-line bg-surface px-3.5 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <span>
                      <Stars rating={review.rating} size={13} />
                      <span className="sr-only">{review.rating} estrelas</span>
                    </span>
                    <span className="text-xs text-subtle">
                      {formatDateTime(review.publishedAt)}
                      {review.replied ? " · respondida" : ""}
                    </span>
                  </div>
                  <ReviewText text={review.text} />
                </li>
              ))}
            </ul>
            {state.reviews.length > shown ? (
              <button
                type="button"
                onClick={() => setShown((value) => value + pageSize)}
                className="inline-flex h-10 items-center justify-center self-start rounded-full border border-line-strong bg-surface px-4 text-sm font-semibold text-text hover:bg-surface-2"
              >
                Ver mais ({state.reviews.length - shown} restantes)
              </button>
            ) : null}
            {state.total > state.reviews.length ? (
              <p className="text-xs text-subtle">A mostrar as {state.reviews.length} mais recentes de {state.total}.</p>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
