import { Skeleton } from "@/components/ui/Skeleton";

/** First load of the Google connection page: hero, status card, benefits and comparison. */
export default function GoogleLoading() {
  return (
    <div className="flex flex-col gap-10 sm:gap-14" aria-busy="true">
      <span role="status" className="sr-only">
        A carregar a ligação ao Google…
      </span>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_27rem] lg:items-start lg:gap-10">
        <div className="flex min-w-0 flex-col gap-5">
          <Skeleton className="h-3 w-56 max-w-full" />
          <Skeleton className="h-10 w-80 max-w-full sm:h-12" />
          <Skeleton className="h-10 w-64 max-w-full sm:hidden" />
          <Skeleton className="h-7 w-32 rounded-full" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-full max-w-xl" />
            <Skeleton className="h-4 w-5/6 max-w-lg" />
          </div>
          <Skeleton className="h-13 w-full rounded-full sm:w-60" />
        </div>
        <div className="card flex flex-col gap-4 p-4 sm:p-6">
          <Skeleton className="h-4 w-32" />
          {[0, 1, 2].map((index) => (
            <div key={index} className="flex items-center gap-3">
              <Skeleton className="h-7 w-7 shrink-0 rounded-full" />
              <Skeleton className={`h-3 ${index % 2 ? "w-3/4" : "w-full"}`} />
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:gap-6">
        <Skeleton className="h-7 w-40" />
        <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {[0, 1, 2, 3].map((index) => (
            <div key={index} className="card flex flex-col gap-2.5 p-4 sm:p-5">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-4/5" />
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:gap-6">
        <Skeleton className="h-7 w-72 max-w-full" />
        <div className="card flex flex-col gap-3 p-4">
          {[0, 1, 2, 3].map((index) => (
            <Skeleton key={index} className="h-10 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
