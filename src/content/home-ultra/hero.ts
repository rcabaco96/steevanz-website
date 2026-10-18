// Hero copy for /novo-ultra (pure data). The title is the two-line brand line, rendered by <BrandLine/>
// from shared.ts, so it is not repeated here.
import { contact } from "./shared.ts";

export const hero = {
  lead: "Sites, reservas, Menu digital em vídeo, avaliações e cartões de cliente para negócios locais. Nós montamos tudo e ficamos por perto.",
  cta: { href: contact.demoHref, label: "Agendar demonstração" },
  link: { href: "#melhorar", label: "Ver o que fazemos" },
  note: "Demonstração gratuita de 20 minutos, online ou por telefone.",
  /** Brand film (silent loop of the whole product family, ending on the «Steevanz.» logo). */
  film: {
    mobile: { src: "/home/brand/hero-mobile.mp4", width: 720, height: 1280 },
    desktop: { src: "/home/brand/hero-desktop.mp4", query: "(min-width: 1024px)" },
    // Optimised copies (sharp mozjpeg, ≤45 KB) of /home/brand/hero-{mobile,desktop}.jpg: the hero LCP.
    // Regenerate them whenever the brand film is re-rendered (see the integrator notes).
    posterMobile: "/home-ultra/brand-mobile.jpg",
    posterDesktop: "/home-ultra/brand-desktop.jpg",
  },
  /** Decorative satellites around the film (aria-hidden). */
  plate: { line1: "Gostou?", line2: "Toque para avaliar" },
  chip: "Reserva confirmada",
} as const;
