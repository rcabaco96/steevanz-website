import { Skeleton } from "@/components/ui/Skeleton";

/** A menu's page while it loads: its header, the details form and the list of dishes. */
export default function Loading() {
  return (
    <div aria-busy="true" className="flex flex-col gap-6">
      <span role="status" className="sr-only">
        A carregar…
      </span>
      <Skeleton className="h-5 w-36" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-9 w-60 max-w-full" />
        <Skeleton className="h-4 w-40" />
      </div>
      <section className="card flex flex-col gap-4 p-5 sm:p-6">
        <Skeleton className="h-6 w-36" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="h-[4.25rem] w-full rounded-xl" />
          ))}
        </div>
        <div className="flex items-center gap-4">
          <Skeleton className="h-20 w-20 rounded-full" />
          <Skeleton className="h-11 flex-1 rounded-xl" />
        </div>
      </section>
      <section className="card flex flex-col gap-4 p-5 sm:p-6">
        <Skeleton className="h-6 w-28" />
        <Skeleton className="h-14 w-full rounded-[var(--radius-card)]" />
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="flex items-start gap-3">
            <Skeleton className="h-16 w-12 shrink-0" />
            <div className="flex flex-1 flex-col gap-2">
              <Skeleton className="h-4 w-40 max-w-full" />
              <Skeleton className="h-3.5 w-56 max-w-full" />
            </div>
            <Skeleton className="h-9 w-[4.75rem] shrink-0 rounded-full" />
          </div>
        ))}
      </section>
    </div>
  );
}
