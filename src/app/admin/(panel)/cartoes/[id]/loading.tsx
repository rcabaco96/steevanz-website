import { Skeleton } from "@/components/ui/Skeleton";

/** A card's page while it loads: header, the programming panel, the form and the preview. */
export default function Loading() {
  return (
    <div aria-busy="true" className="flex flex-col gap-6">
      <span role="status" className="sr-only">
        A carregar…
      </span>
      <Skeleton className="h-5 w-40" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-9 w-60 max-w-full" />
        <Skeleton className="h-4 w-44" />
      </div>
      <section className="card flex flex-col gap-4 p-5 sm:p-6">
        <Skeleton className="h-6 w-44" />
        <Skeleton className="h-14 w-full rounded-2xl" />
        <div className="flex items-center gap-4">
          <Skeleton className="h-28 w-28 shrink-0 rounded-xl" />
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-4 w-56 max-w-full" />
            <Skeleton className="h-9 w-48 rounded-full" />
          </div>
        </div>
      </section>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_23rem]">
        <section className="card flex flex-col gap-4 p-5 sm:p-6">
          <Skeleton className="h-6 w-28" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {Array.from({ length: 4 }, (_, index) => (
              <Skeleton key={index} className="h-[4.25rem] w-full rounded-xl" />
            ))}
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="h-20 w-20 rounded-full" />
            <Skeleton className="h-9 w-44 rounded-full" />
          </div>
        </section>
        <Skeleton className="h-[34rem] w-full max-w-[23rem] justify-self-center rounded-[1.75rem]" />
      </div>
    </div>
  );
}
