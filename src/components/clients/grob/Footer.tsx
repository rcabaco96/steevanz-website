import Image from "next/image";
import { grob, grobPlaces } from "@/content/grob/facts";
import { CourtLines } from "./CourtLines";
import { grobSocial } from "./social";
import { grobSections } from "./sections";

// O rodapé: o emblema, a morada da sede, as redes e o crédito «Site por Steevanz», sobre o verde-noite com grão,
// metade de um campo desenhado e o nome do clube enorme, em contorno, a fechar a página.
export function Footer() {
  const sede = grobPlaces[0];
  const year = new Date().getFullYear();
  return (
    <footer className="gb-grain-dark relative overflow-hidden bg-[#04140b] text-giz">
      <CourtLines aria-hidden="true" className="pointer-events-none absolute top-0 left-1/2 -z-10 h-[38rem] w-auto max-w-none -translate-x-1/2 text-giz opacity-[0.05]" />
      <div className="gb-container pt-12 pb-8 sm:pt-14">
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr_1fr]">
          <div className="flex items-start gap-4">
            <Image src={grob.media.emblemSmall} alt={`Emblema do ${grob.short}`} width={439} height={560} className="h-24 w-auto" />
            <div>
              <p className="gb-display text-[2.6rem]">{grob.short}</p>
              <p className="mt-1 text-[0.9rem] text-giz/70">{grob.name}</p>
              <p className="mt-1 text-[0.85rem] text-giz/55">Fundado a {grob.foundedLabel}</p>
            </div>
          </div>
          <div className="text-[0.92rem] leading-relaxed text-giz/75">
            <p className="text-[0.72rem] font-bold tracking-[0.18em] text-relva-claro uppercase">Sede</p>
            <a href={sede.maps} target="_blank" rel="noopener" className="mt-2 block hover:text-amarelo">
              {sede.street}
              <br />
              {sede.postalCode} {sede.locality}
              <span className="sr-only"> (abre o Google Maps)</span>
            </a>
            <p className="mt-3">
              <a href={grob.phoneSportHref} className="hover:text-amarelo">
                Desporto {grob.phoneSport}
              </a>
              <br />
              <a href={grob.phoneEventsHref} className="hover:text-amarelo">
                Eventos {grob.phoneEvents}
              </a>
            </p>
          </div>
          <div>
            <p className="text-[0.72rem] font-bold tracking-[0.18em] text-relva-claro uppercase">Siga o clube</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {grobSocial.map(({ href, label, Icon }) => (
                <li key={label}>
                  <a href={href} target="_blank" rel="noopener noreferrer" aria-label={`${label} (abre noutro separador)`} className="grid h-11 w-11 place-items-center rounded-full ring-1 ring-giz/20 transition-colors hover:bg-giz hover:text-tinta">
                    <Icon />
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-[0.85rem]">
              <a href={`#${grobSections.signup}`} className="underline underline-offset-4 hover:text-amarelo">
                Inscrições
              </a>
              {" · "}
              <a href={grob.memberForm} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-amarelo">
                Ser sócio
              </a>
            </p>
          </div>
        </div>
        <p aria-hidden="true" className="gb-display pointer-events-none mt-8 text-center text-[clamp(5rem,16vw,17rem)] leading-[0.78] gb-outline select-none [--gb-outline:rgb(100_186_76/0.35)]">
          {grob.short}
        </p>
        <div className="mt-4 flex flex-col gap-3 border-t border-giz/10 pt-5 text-[0.8rem] text-giz/55 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {grob.name}
          </p>
          <p>
            Site por{" "}
            <a href="https://www.steevanz.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-giz/80 hover:text-amarelo">
              Steevanz
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
