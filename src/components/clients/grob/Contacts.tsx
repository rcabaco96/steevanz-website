"use client";

import { grob, grobPlaces } from "@/content/grob/facts";
import { ContactForm } from "./ContactForm";
import { CourtLines } from "./CourtLines";
import { MailIcon, PhoneIcon, PinIcon } from "./icons";
import { grobSocial } from "./social";
import { grobSections } from "./sections";

// A secção final, de contacto e inscrição (dono, 2026-11-02: o formulário fica SEMPRE no fim da página), no verde
// do pavilhão às escuras, com grão e as linhas do campo em marca de água. Em cima, duas colunas: o título à
// esquerda e, ao lado, os telefones e os emails (inteiros, nunca cortados). Em baixo, o formulário único
// (inscrição, sócio, aluguer, outro assunto) num cartão claro e, ao lado, os três espaços do clube e o mapa da
// sede, que abre logo o Google Maps (nada de mapas embutidos).
export function Contacts() {
  const sede = grobPlaces[0];
  const emails = [
    { label: "Geral", value: grob.emailGeneral },
    { label: "Eventos", value: grob.emailEvents },
    { label: "Futsal", value: grob.emailFutsal },
    { label: "Ténis de mesa", value: grob.emailTableTennis },
  ];

  return (
    <section id={grobSections.contacts} aria-labelledby="gb-contacts-title" className="gb-grain-dark relative overflow-hidden bg-pavilhao py-20 text-giz sm:py-28">
      <CourtLines aria-hidden="true" className="pointer-events-none absolute top-24 left-1/2 -z-10 h-[46rem] w-auto max-w-none -translate-x-1/2 text-giz opacity-[0.07]" />
      <p aria-hidden="true" className="gb-display pointer-events-none absolute -right-6 bottom-[-0.12em] -z-10 text-[clamp(10rem,30vw,26rem)] leading-none gb-outline [--gb-outline:rgb(100_186_76/0.18)]">
        1937
      </p>

      <div className="gb-container">
        <div className="grid items-start gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
          <div>
            <p className="gb-eyebrow flex items-center gap-3 text-relva-claro">
              <span aria-hidden="true" className="h-px w-8 bg-relva-claro" />
              Contacto e inscrição
            </p>
            <h2 id="gb-contacts-title" className="gb-display mt-4 text-[clamp(2.8rem,8vw,5.2rem)]">
              Fale com <span className="text-relva-claro">o clube</span>
            </h2>
            <p className="mt-5 max-w-[30rem] text-[1rem] leading-relaxed text-giz/75">
              Inscrições nas modalidades, ser sócio, aluguer da sede ou qualquer outro assunto: escreva no formulário aqui em baixo, ligue ou mande
              um email.
            </p>
            <ul className="mt-7 flex flex-wrap gap-2">
              {grobSocial.map(({ href, label, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-11 items-center gap-2 rounded-full px-4 text-[0.84rem] font-semibold ring-1 ring-giz/20 transition-colors hover:bg-giz hover:text-pavilhao"
                  >
                    <Icon width={17} height={17} /> {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid gap-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <a href={grob.phoneSportHref} className="group flex items-center justify-between gap-3 rounded-[1.2rem] bg-giz p-4 text-pavilhao transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 sm:p-5">
                <span>
                  <span className="block text-[0.66rem] font-bold tracking-[0.16em] text-relva-escuro uppercase">Desporto e inscrições</span>
                  <span className="gb-display mt-1 block text-[1.9rem] whitespace-nowrap">{grob.phoneSport}</span>
                </span>
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-pavilhao text-giz transition-transform group-hover:rotate-12">
                  <PhoneIcon width={18} height={18} />
                </span>
              </a>
              <a href={grob.phoneEventsHref} className="group flex items-center justify-between gap-3 rounded-[1.2rem] p-4 ring-1 ring-giz/20 transition-[transform,background-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:bg-giz/5 sm:p-5">
                <span>
                  <span className="block text-[0.66rem] font-bold tracking-[0.16em] text-relva-claro uppercase">Eventos e aluguer</span>
                  <span className="gb-display mt-1 block text-[1.9rem] whitespace-nowrap">{grob.phoneEvents}</span>
                </span>
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full ring-1 ring-giz/30 transition-transform group-hover:rotate-12">
                  <PhoneIcon width={18} height={18} />
                </span>
              </a>
            </div>
            <ul className="grid gap-2 rounded-[1.2rem] p-2 ring-1 ring-giz/12">
              {emails.map((email) => (
                <li key={email.value}>
                  <a href={`mailto:${email.value}`} className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-giz/8">
                    <MailIcon width={18} height={18} className="shrink-0 text-relva-claro" />
                    <span className="min-w-0 sm:flex sm:items-baseline sm:gap-3">
                      <span className="block text-[0.66rem] font-bold tracking-[0.14em] text-giz/55 uppercase sm:w-24 sm:shrink-0">{email.label}</span>
                      <span className="block text-[0.92rem] font-semibold [overflow-wrap:anywhere]">{email.value}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 grid items-start gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
          <div id="formulario" className="rounded-[1.6rem] bg-giz p-5 shadow-[0_50px_100px_-50px_rgb(0_0_0/0.8)] sm:p-8">
            <p className="gb-display mb-5 text-[2rem] text-pavilhao">Escreva ao clube</p>
            <ContactForm />
          </div>

          <div>
            <h3 className="gb-display text-[2.2rem]">Onde jogamos</h3>
            <ol className="mt-4 divide-y divide-giz/12 border-y border-giz/12">
              {grobPlaces.map((place, i) => (
                <li key={place.id} className="flex gap-4 py-4">
                  <span className="gb-display w-8 shrink-0 text-[1.6rem] text-amarelo">{String(i + 1).padStart(2, "0")}</span>
                  <div className="min-w-0">
                    <p className="text-[0.98rem] font-semibold">{place.name}</p>
                    <p className="mt-0.5 text-[0.9rem] text-giz/65">
                      {place.street}, {place.postalCode} {place.locality}
                    </p>
                    <a href={place.maps} target="_blank" rel="noopener" className="mt-0.5 inline-flex min-h-11 items-center gap-1.5 text-[0.84rem] font-semibold text-relva-claro underline-offset-4 hover:underline">
                      <PinIcon width={16} height={16} /> Ver no mapa <span className="sr-only">(abre o Google Maps)</span>
                    </a>
                  </div>
                </li>
              ))}
            </ol>

            {/* Sem mapa embutido (dono, 2026-11-02): o cartão abre logo o Google Maps, na app se existir. */}
            <div className="relative mt-6 overflow-hidden rounded-[var(--radius-gb-lg)] bg-pavilhao-2 p-5 ring-1 ring-giz/12 sm:p-7">
              <CourtLines aria-hidden="true" className="absolute top-1/2 left-1/2 h-[130%] w-auto max-w-none -translate-x-1/2 -translate-y-1/2 text-giz opacity-[0.1]" />
              <p className="relative gb-display text-[1.9rem]">A sede</p>
              <p className="relative mt-1 text-[0.92rem] text-giz/75">
                {sede.street}, {sede.postalCode} {sede.locality}
              </p>
              <div className="relative mt-4 flex flex-wrap gap-2">
                <a href={sede.maps} target="_blank" rel="noopener" className="inline-flex h-11 items-center gap-2 rounded-full bg-giz px-5 text-[0.82rem] font-bold text-pavilhao transition-colors hover:bg-amarelo">
                  <PinIcon width={18} height={18} /> Ver no mapa<span className="sr-only"> (abre o Google Maps)</span>
                </a>
                <a href={sede.directions} target="_blank" rel="noopener" className="inline-flex h-11 items-center gap-2 rounded-full px-5 text-[0.82rem] font-bold ring-1 ring-giz/30 transition-colors hover:bg-giz/10">
                  Como chegar<span className="sr-only"> (abre o Google Maps)</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
