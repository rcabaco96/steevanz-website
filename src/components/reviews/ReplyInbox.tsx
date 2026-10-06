"use client";

import { useState } from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import { isNegative } from "@/lib/reviews/analytics";
import type { InboxItem } from "@/lib/reviews/reply-store";
import { useBusyScope } from "./DashboardBusy";
import { ReplyCard } from "./ReplyCard";

type Filter = "pending" | "approved";

function SkeletonCard() {
  return (
    <li className="card flex flex-col gap-4 p-4 sm:p-5" aria-hidden="true">
      <span className="flex items-center justify-between">
        <Skeleton className="h-3.5 w-24" />
        <Skeleton className="h-3 w-28" />
      </span>
      <span className="flex flex-col gap-2">
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-4/5" />
      </span>
      <span className="flex flex-col gap-2 rounded-2xl bg-accent-soft p-3.5">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-2/3" />
      </span>
      <span className="grid grid-cols-2 gap-2 sm:flex">
        <Skeleton className="h-11 rounded-full sm:w-28" />
        <Skeleton className="h-11 rounded-full sm:w-36" />
        <Skeleton className="h-11 rounded-full sm:w-24" />
        <Skeleton className="h-11 rounded-full sm:w-24" />
      </span>
    </li>
  );
}

/** Negative reviews first (they need attention), then newest first. */
const byPriority = (a: InboxItem, b: InboxItem) =>
  Number(isNegative(b.review.rating)) - Number(isNegative(a.review.rating)) || Date.parse(b.review.publishedAt) - Date.parse(a.review.publishedAt);

export function ReplyInbox({ slug, items, googleFid }: { slug: string; items: InboxItem[]; googleFid: string | null }) {
  const pending = items.filter((item) => item.status === "pending" && !item.review.ownerReply).sort(byPriority);
  const approved = items
    .filter((item) => item.status === "approved")
    .sort((a, b) => Date.parse(b.decidedAt ?? b.createdAt) - Date.parse(a.decidedAt ?? a.createdAt));
  const [filter, setFilter] = useState<Filter>(pending.length || !approved.length ? "pending" : "approved");
  const running = useBusyScope("replies");
  const list = filter === "pending" ? pending : approved;
  const tabs: { id: Filter; label: string; count: number }[] = [
    { id: "pending", label: "Por aprovar", count: pending.length },
    { id: "approved", label: "Aprovadas", count: approved.length },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div role="tablist" aria-label="Respostas" className="flex gap-1.5">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={filter === tab.id}
            onClick={() => setFilter(tab.id)}
            className={`inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-semibold transition-colors ${
              filter === tab.id ? "bg-surface-inverse text-inverse" : "border border-line bg-surface text-muted hover:text-text"
            }`}
          >
            {tab.label}
            <span className={`rounded-full px-1.5 text-xs ${filter === tab.id ? "bg-inverse/20" : "bg-surface-2"}`}>{tab.count}</span>
          </button>
        ))}
      </div>

      <ul className="flex flex-col gap-3" aria-busy={running || undefined}>
        {running && filter === "pending" ? (
          <>
            <li className="sr-only" role="status">
              A escrever respostas novas…
            </li>
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : null}
        {list.map((item) => (
          <ReplyCard key={item.draftId} slug={slug} item={item} googleFid={googleFid} />
        ))}
      </ul>

      {!list.length && !running ? (
        <p className="card p-5 text-sm text-muted">
          {filter === "pending"
            ? "Não há respostas à espera de aprovação. Quando chegarem reviews novas, as respostas aparecem aqui."
            : "Ainda não aprovou nenhuma resposta."}
        </p>
      ) : null}
    </div>
  );
}
