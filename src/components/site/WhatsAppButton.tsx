import { WhatsAppIcon } from "@/components/icons";

// The floating WhatsApp button, on every page: Steevanz plum with a white icon and a cream rim (so it
// still reads on the plum sections), 56 px, clear of the iPhone home bar (safe-area inset).

export function WhatsAppButton({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      className="whatsapp-fab group fixed right-[calc(1rem+env(safe-area-inset-right))] bottom-[calc(1rem+env(safe-area-inset-bottom))] z-40 grid h-14 w-14 place-items-center rounded-full border-2 border-[#fbf7f1] bg-[#7a2d60] text-white shadow-[0_12px_32px_-10px_rgba(94,31,73,0.75)] transition-transform duration-300 ease-(--ease-out-expo) hover:scale-105 hover:bg-[#5e1f49] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#cfa563] active:scale-95 sm:right-[calc(1.5rem+env(safe-area-inset-right))] sm:bottom-[calc(1.5rem+env(safe-area-inset-bottom))]"
    >
      <span aria-hidden="true" className="absolute inset-0 -z-10 animate-ping rounded-full bg-[#7a2d60]/35 [animation-duration:2.6s] [animation-iteration-count:3]" />
      <WhatsAppIcon size={28} />
    </a>
  );
}
