import type { BusinessKind } from "@/lib/establishments/kinds";

/** Small line drawings, one per kind of business, for the label on the public pages' header. */
const paths: Record<BusinessKind, React.ReactNode> = {
  restaurant: (
    <>
      <path d="M7 3v8M5 3v5a2 2 0 0 0 4 0V3M7 11v10" />
      <path d="M17 21V3c-2.2 1.2-3 3.6-3 6.5V13h3" />
    </>
  ),
  barbershop: (
    <>
      <circle cx="6" cy="18" r="2.5" />
      <circle cx="18" cy="18" r="2.5" />
      <path d="M7.8 16.2 18 4M16.2 16.2 6 4" />
    </>
  ),
  salon: (
    <>
      <path d="M12 3.5 13.6 8 18 9.5l-4.4 1.6L12 15.5l-1.6-4.4L6 9.5 10.4 8Z" />
      <path d="M18.5 15.5 19.2 17.3 21 18l-1.8.7-.7 1.8-.7-1.8L16 18l1.8-.7Z" />
    </>
  ),
  clinic: <path d="M9.5 4h5v5.5H20v5h-5.5V20h-5v-5.5H4v-5h5.5Z" />,
  sports: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m12 7.5 3.4 2.5-1.3 4h-4.2l-1.3-4Z" />
      <path d="M12 3.5v4M15.4 10l4.3-1.6M14.1 14l2.6 3.7M9.9 14l-2.6 3.7M8.6 10 4.3 8.4" />
    </>
  ),
  retail: (
    <>
      <path d="M5 8h14l-1 12H6Z" />
      <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
    </>
  ),
};

export function KindIcon({ kind }: { kind: BusinessKind }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
      {paths[kind]}
    </svg>
  );
}
