import { Skeleton } from "@/components/ui/Skeleton";

/** A tag's page while it loads: header, the programming panel and the form. */
export default function Loading() {
  return (
    <div aria-busy="true" className="flex flex-col gap-6">
      <span role="status" className="sr-only">
        A carregar…
      </span>
      <Skeleton className="h-5 w-44" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-9 w-60 max-w-full" />
        <Skeleton className="h-4 w-36" />
      </div>
      <section className="card flex flex-col gap-4 p-5 sm:p-6">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-14 w-full rounded-2xl" />
        <Skeleton className="h-14 w-full rounded-2xl" />
      </section>
      <section className="card flex flex-col gap-4 p-5 sm:p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Skeleton className="h-[4.25rem] w-full rounded-xl" />
          <Skeleton className="h-[4.25rem] w-full rounded-xl" />
        </div>
      </section>
      <section className="card flex flex-col gap-4 p-5 sm:p-6">
        <Skeleton className="h-6 w-36" />
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="h-11 w-full rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-[4.25rem] w-full rounded-xl" />
        <Skeleton className="h-16 w-full rounded-2xl" />
      </section>
    </div>
  );
}
