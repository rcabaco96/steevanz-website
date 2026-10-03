import { Skeleton } from "@/components/ui/Skeleton";

function CardSkeleton({ lines = 3, className = "" }: { lines?: number; className?: string }) {
  return (
    <div className={`card flex flex-col gap-3 p-4 sm:p-6 ${className}`}>
      <Skeleton className="h-4 w-40" />
      {Array.from({ length: lines }, (_, index) => (
        <Skeleton key={index} className={`h-3 ${index % 2 ? "w-3/4" : "w-full"}`} />
      ))}
    </div>
  );
}

function SectionSkeleton({ cards = 2 }: { cards?: number }) {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-7 w-64 max-w-full" />
      <Skeleton className="h-3 w-80 max-w-full" />
      <div className="grid gap-4 lg:grid-cols-2">
        {Array.from({ length: cards }, (_, index) => (
          <CardSkeleton key={index} lines={index ? 4 : 5} />
        ))}
      </div>
    </div>
  );
}

/** First load of a dashboard: the page's shape, so nothing jumps when the data arrives. */
export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-12 sm:gap-16" aria-busy="true">
      <span role="status" className="sr-only">
        A carregar a análise de reviews…
      </span>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between lg:gap-10">
        <div className="flex min-w-0 flex-col gap-5">
          <Skeleton className="h-3 w-48" />
          <Skeleton className="h-10 w-72 max-w-full sm:h-12" />
          <Skeleton className="h-3 w-56" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-11 w-44 rounded-full" />
            <Skeleton className="h-3 w-40" />
          </div>
          <div className="flex gap-1.5">
            {[64, 88, 76, 72].map((width) => (
              <Skeleton key={width} className="h-10 rounded-full" style={{ width }} />
            ))}
          </div>
        </div>
        <div className="card flex flex-col gap-4 p-4 sm:p-5 lg:w-[27rem] lg:shrink-0">
          <Skeleton className="h-4 w-28" />
          <div className="grid grid-cols-3 gap-2">
            {[0, 1, 2].map((index) => (
              <Skeleton key={index} className="h-16 rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
          <Skeleton className="h-11 w-full rounded-full" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <div className="card col-span-2 flex flex-col gap-4 p-5 sm:p-6">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-14 w-40" />
          <Skeleton className="h-24 w-full rounded-2xl" />
        </div>
        {[0, 1, 2, 3].map((index) => (
          <div key={index} className="card flex flex-col gap-2 p-4 sm:p-5">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-3 w-28" />
          </div>
        ))}
      </div>

      <CardSkeleton lines={4} />
      <SectionSkeleton />
      <SectionSkeleton />
    </div>
  );
}
