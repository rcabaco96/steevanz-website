import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="min-h-dvh bg-bg-soft" aria-busy="true">
      <p role="status" className="sr-only">
        A carregar…
      </p>
      <div className="border-b border-line">
        <div className="mx-auto flex h-16 w-full max-w-3xl items-center gap-3 px-4">
          <Skeleton className="h-10 w-10 rounded-2xl" />
          <div className="flex flex-1 flex-col gap-1.5">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-16" />
          </div>
          <Skeleton className="h-6 w-14" />
        </div>
      </div>
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 px-4 pt-5">
        <Skeleton className="h-6 w-56" />
        <Skeleton className="h-72 w-full rounded-[2rem]" />
        <Skeleton className="h-20 w-full rounded-3xl" />
        <Skeleton className="h-20 w-full rounded-3xl" />
      </div>
    </div>
  );
}
