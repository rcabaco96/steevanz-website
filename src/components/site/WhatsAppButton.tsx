import { WhatsAppIcon } from "@/components/icons";

export function WhatsAppButton({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      className="whatsapp-fab group fixed right-4 bottom-4 z-40 grid h-14 w-14 place-items-center rounded-full bg-whatsapp text-[#0b2e17] shadow-[0_12px_32px_-10px_rgba(37,211,102,0.7)] transition-transform duration-300 ease-(--ease-out-expo) hover:scale-105 active:scale-95 sm:right-6 sm:bottom-6"
    >
      <span aria-hidden="true" className="absolute inset-0 -z-10 animate-ping rounded-full bg-whatsapp/35 [animation-duration:2.6s] [animation-iteration-count:3]" />
      <WhatsAppIcon size={28} />
    </a>
  );
}
