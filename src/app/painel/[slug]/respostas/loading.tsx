import { Skeleton } from "@/components/ui/Skeleton";

export default function RepliesLoading() {
  return (
    <div className="flex flex-col gap-8" aria-busy="true">
      <span role="status" className="sr-only">
        A carregar as respostas…
      </span>
      <div className="flex flex-col gap-3">
        <Skeleton className="h-3 w-36" />
        <Skeleton className="h-10 w-64 max-w-full sm:h-12" />
      </div>
      <Skeleton className="h-16 w-full rounded-2xl" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-11 w-36 rounded-full" />
        <Skeleton className="h-4 w-full max-w-xl" />
      </div>
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {[0, 1, 2].map((index) => (
          <Skeleton key={index} className="h-20 rounded-[var(--radius-card)] sm:h-24" />
        ))}
      </div>
      <div className="flex flex-col gap-3">
        {[0, 1].map((index) => (
          <Skeleton key={index} className="h-64 rounded-[var(--radius-card)]" />
        ))}
      </div>
    </div>
  );
}
