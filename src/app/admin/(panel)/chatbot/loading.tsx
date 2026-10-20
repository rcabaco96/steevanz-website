import { Skeleton } from "@/components/ui/Skeleton";

/** The assistants' list while it loads: header, a few rows and the two example chats. */
export default function Loading() {
  return (
    <div aria-busy="true" className="flex flex-col gap-6">
      <span role="status" className="sr-only">
        A carregar…
      </span>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-9 w-64 max-w-full" />
        <Skeleton className="h-4 w-72 max-w-full" />
      </div>
      <div className="flex flex-col gap-2">
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className="card flex items-center justify-between gap-3 p-4">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-40 max-w-full" />
              <Skeleton className="h-3.5 w-56 max-w-full" />
            </div>
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {Array.from({ length: 2 }, (_, index) => (
          <section key={index} className="card flex flex-col gap-4 p-5 sm:p-6">
            <Skeleton className="h-6 w-56 max-w-full" />
            <Skeleton className="h-40 w-full rounded-2xl" />
            <Skeleton className="h-11 w-full rounded-xl" />
          </section>
        ))}
      </div>
    </div>
  );
}
