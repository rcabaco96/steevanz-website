import { Skeleton } from "@/components/ui/Skeleton";

/** First load of a product module (tabs, a toolbar and a list of cards). */
export function ModuleSkeleton() {
  return (
    <div aria-busy="true" className="flex flex-col gap-6">
      <span role="status" className="sr-only">
        A carregar…
      </span>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-4 w-80 max-w-full" />
      </div>
      <div className="flex gap-3 border-b border-line pb-2">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} className="h-6 w-20" />
        ))}
      </div>
      <Skeleton className="h-20 w-full rounded-[var(--radius-card)]" />
      {Array.from({ length: 3 }, (_, index) => (
        <Skeleton key={index} className="h-28 w-full rounded-[var(--radius-card)]" />
      ))}
    </div>
  );
}
