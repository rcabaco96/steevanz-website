import Link from "next/link";

const tabs = [
  { id: "bookings", href: "/admin/bookings", label: "Demonstrações" },
  { id: "leads", href: "/admin/leads", label: "Pedidos de informação" },
  { id: "availability", href: "/admin/availability", label: "Horário" },
] as const;

/**
 * The «Contactos» section of the admin: people who want to know more (demos booked on the site and
 * information requests) and the hours offered for demos. One tab in the main navigation, three here.
 */
export function ContactsTabs({ current }: { current: (typeof tabs)[number]["id"] }) {
  return (
    <nav aria-label="Contactos" className="-mx-1 flex gap-1 overflow-x-auto border-b border-line px-1 [scrollbar-width:none]">
      {tabs.map((tab) => (
        <Link
          key={tab.id}
          href={tab.href}
          aria-current={tab.id === current ? "page" : undefined}
          className={`-mb-px shrink-0 border-b-2 px-3 py-2.5 text-sm font-semibold transition-colors ${
            tab.id === current ? "border-accent text-text" : "border-transparent text-muted hover:text-text"
          }`}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
