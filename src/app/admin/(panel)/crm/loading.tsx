import { Skeleton } from "@/components/ui/Skeleton";

/** The CRM while it loads (first visit or another list): tabs, lists, stage strip, filters and rows in their place. */
export default function Loading() {
  return (
    <div aria-busy="true" className="flex flex-col gap-6">
      <span role="status" className="sr-only">
        A carregar o CRM…
      </span>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-4 w-full max-w-md" />
        <Skeleton className="h-4 w-2/3 sm:hidden" />
      </div>
      <Skeleton className="h-10 w-full max-w-xl" />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2 overflow-hidden">
          {Array.from({ length: 3 }, (_, index) => (
            <Skeleton key={index} className="h-10 w-32 shrink-0 rounded-full" />
          ))}
        </div>
        <Skeleton className="h-10 w-64 shrink-0 rounded-full" />
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex gap-2 overflow-hidden">
          {Array.from({ length: 9 }, (_, index) => (
            <Skeleton key={index} className="h-16 w-[6.5rem] shrink-0 rounded-2xl xl:flex-1" />
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-11 w-full rounded-xl sm:w-64" />
          {Array.from({ length: 3 }, (_, index) => (
            <Skeleton key={index} className="h-11 flex-[1_1_9rem] rounded-xl" />
          ))}
          <Skeleton className="h-11 w-32" />
          <Skeleton className="h-11 w-36" />
        </div>
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-11 w-40 rounded-full" />
          <Skeleton className="h-11 w-48 rounded-full" />
        </div>
        <div className="card flex flex-col divide-y divide-line overflow-hidden">
          {Array.from({ length: 5 }, (_, index) => (
            <div key={index} className="grid grid-cols-1 gap-3 px-4 py-4 md:grid-cols-2 xl:grid-cols-[1.15fr_1.1fr_1.1fr_15rem] xl:px-5">
              <div className="flex flex-col gap-2">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-32" />
              </div>
              <div className="flex flex-col gap-2">
                <Skeleton className="h-10 w-40 rounded-full xl:h-8" />
                <Skeleton className="h-4 w-52" />
              </div>
              <Skeleton className="h-10 w-full max-w-xs" />
              <div className="flex flex-col gap-2">
                <Skeleton className="h-10 w-full rounded-xl" />
                <Skeleton className="h-10 w-full rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
