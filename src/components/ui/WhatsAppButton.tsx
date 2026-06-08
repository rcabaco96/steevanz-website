import { motion } from "motion/react";

const PHONE = "351961292679";

export function WhatsAppButton() {
  return (
    <motion.a
      href={`https://wa.me/${PHONE}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Falar no WhatsApp"
      initial={{ opacity: 0, scale: 0.6, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.96 }}
      className="group fixed bottom-6 right-6 z-50 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-(--color-void) shadow-[0_10px_32px_-8px_rgba(37,211,102,0.6)] transition-shadow duration-300 hover:shadow-[0_14px_40px_-6px_rgba(37,211,102,0.75)] sm:bottom-8 sm:right-8"
    >
      <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-[#25D366]/40 [animation-duration:2.4s] group-hover:opacity-0" />
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.69.44 3.34 1.28 4.79L2.05 22l5.45-1.43a9.9 9.9 0 0 0 4.54 1.16h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.13-2.9-7-1.87-1.87-4.35-2.82-7-2.82Zm0 18.13h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.24.85.86-3.16-.2-.32a8.22 8.22 0 0 1-1.26-4.36c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.55-3.7 8.25-8.15 8.31Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.17.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.04-.38-1.99-1.22-.73-.66-1.23-1.46-1.37-1.71-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.15.16-.25.25-.42.08-.17.04-.31-.02-.44-.06-.12-.56-1.36-.77-1.86-.2-.49-.4-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.87.85-.87 2.08 0 1.22.89 2.41 1.02 2.57.12.17 1.75 2.67 4.24 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.07-.11-.23-.17-.48-.3Z" />
      </svg>
    </motion.a>
  );
}
