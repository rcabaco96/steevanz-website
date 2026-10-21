import { Skeleton } from "@/components/ui/Skeleton";

/** An assistant's page while it loads: back link, header, tabs and two panels. */
export default function Loading() {
  return (
    <div aria-busy="true" className="flex flex-col gap-6">
      <span role="status" className="sr-only">
        A carregar…
      </span>
      <Skeleton className="h-5 w-44" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-9 w-60 max-w-full" />
        <Skeleton className="h-4 w-48 max-w-full" />
      </div>
      <div className="flex gap-3 border-b border-line pb-2.5">
        {Array.from({ length: 5 }, (_, index) => (
          <Skeleton key={index} className="h-5 w-20 shrink-0" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {Array.from({ length: 2 }, (_, index) => (
          <section key={index} className="card flex flex-col gap-4 p-5 sm:p-6">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-16 w-full rounded-xl" />
          </section>
        ))}
      </div>
    </div>
  );
}
