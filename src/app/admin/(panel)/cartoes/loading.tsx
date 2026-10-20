import { Skeleton } from "@/components/ui/Skeleton";

/** The cards list while it loads: header, search and rows. */
export default function Loading() {
  return (
    <div aria-busy="true" className="flex flex-col gap-6">
      <span role="status" className="sr-only">
        A carregar…
      </span>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-9 w-64 max-w-full" />
          <Skeleton className="h-4 w-80 max-w-full" />
        </div>
        <Skeleton className="h-11 w-40 rounded-full" />
      </div>
      <Skeleton className="h-[4.25rem] w-full rounded-xl" />
      <div className="card flex flex-col divide-y divide-line overflow-hidden">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="flex items-center gap-3 px-4 py-4 sm:px-5">
            <Skeleton className="h-11 w-11 shrink-0 rounded-full" />
            <div className="flex flex-1 flex-col gap-2">
              <Skeleton className="h-4 w-44 max-w-full" />
              <Skeleton className="h-3.5 w-60 max-w-full" />
            </div>
            <Skeleton className="hidden h-9 w-24 rounded-full sm:block" />
          </div>
        ))}
      </div>
    </div>
  );
}
