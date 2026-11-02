"use client";

import { animate, m, useMotionValue } from "motion/react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";
import { grobModalities, grobPhotos, grobSede, toConfirm, type GrobModality, type GrobModalityGroup } from "@/content/grob/facts";
import { openContact } from "./contact-bus";
import { grobSections } from "./sections";
import { useReveal } from "./use-reveal";

const groupLabel: Record<GrobModalityGroup, string> = {
  competicao: "Competição",
  "bem-estar": "Saúde e bem-estar",
  lazer: "Lazer",
};

/**
 * A largura com que a fotografia é mesmo desenhada: o cartão é vertical e a fotografia cobre-o (com 1 rem de
 * folga de cada lado e até 10 % de zoom), por isso uma fotografia deitada fica bem mais larga do que o cartão.
 * Sem isto o Next servia uma versão pequena e esticada (fotografias moles).
 */
function coverSizes(ratio: number) {
  const desktop = Math.ceil(Math.max(440, 496 * ratio) * 1.1);
  const phone = Math.ceil(Math.max(384, 464 * ratio) * 1.1);
  return `(min-width: 1024px) ${desktop}px, ${phone}px`;
}

/** As cinco modalidades com inscrição (o lazer, os matraquilhos, fica numa linha à parte). */
const cards = grobModalities.filter((m) => m.group !== "lazer");

// Um cartão de modalidade com profundidade: a fotografia ocupa o cartão todo, o nome e as pastilhas por cima de
// um degradê. Com rato, o cartão inclina-se para o ponteiro (perspetiva + rotateX/Y), a fotografia desliza ao
// contrário do texto (parallax entre as duas camadas) e um brilho corre por cima; ao passar, os escalões e o botão
// «Inscrever» sobem. Tudo em transform e opacidade, escrito direto no estilo num requestAnimationFrame (sem
// re-render); sem rato ou com movimento reduzido, fica parado e com tudo à vista.
function ModalityCard({ modality, index }: { modality: GrobModality; index: number }) {
  const card = useRef<HTMLElement>(null);
  const head = useRef<HTMLDivElement>(null);
  const frame = useRef(0);

  // A altura do nome (uma ou duas linhas) diz quanto do texto fica à vista antes de passar o rato.
  useEffect(() => {
    const el = head.current;
    const box = card.current;
    if (!el || !box) return;
    const ro = new ResizeObserver(() => box.style.setProperty("--head", `${el.offsetHeight}px`));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const photo = modality.photo ? grobPhotos[modality.photo] : null;

  const apply = (px: number, py: number) => {
    const el = card.current;
    if (!el) return;
    el.style.setProperty("--rx", `${(-py * 5).toFixed(2)}deg`);
    el.style.setProperty("--ry", `${(px * 6).toFixed(2)}deg`);
    el.style.setProperty("--px", px.toFixed(3));
    el.style.setProperty("--py", py.toFixed(3));
  };
  const onMove = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // O botão está fora da camada que se inclina: nunca se mexe debaixo do rato (dono, 2026-11-02).
    const rect = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => apply(px, py));
  };
  const onLeave = () => {
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => apply(0, 0));
  };

  return (
    <li className="gb-reveal w-[78vw] max-w-[22rem] shrink-0 [perspective:1100px] lg:w-auto lg:max-w-none" style={{ ["--d" as string]: `${index * 90}ms` }}>
      <article
        ref={card}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        className="gb-card group relative h-[27rem] overflow-hidden rounded-[1.4rem] bg-pavilhao text-giz shadow-[0_30px_60px_-34px_rgb(6_38_21/0.75)] ring-1 ring-tinta/10 sm:h-[29rem]"
      >
        {/* Só esta camada (fotografia, degradê, brilho) se inclina: o texto e o botão ficam parados. */}
        <div className="gb-card-tilt absolute inset-0">
        <div className="gb-card-photo absolute -inset-4">
            {photo ? (
              <Image
                src={photo.src}
                alt={modality.photoAlt}
                width={photo.width}
                height={photo.height}
                quality={85}
                sizes={coverSizes(photo.width / photo.height)}
                draggable={false}
                style={{ objectPosition: modality.photoPosition ?? "50% 50%" }}
                className="h-full w-full object-cover select-none"
              />
            ) : null}
          </div>
          <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,rgb(6_38_21/0.15)_0%,rgb(6_38_21/0.05)_35%,rgb(6_38_21/0.78)_68%,rgb(6_38_21/0.96)_100%)]" />
          <div aria-hidden="true" className="gb-card-sheen pointer-events-none absolute inset-0" />
        </div>
        <p className="absolute top-4 left-4 rounded-full bg-pavilhao/80 px-3 py-1 text-[0.64rem] font-bold tracking-[0.16em] text-relva-claro uppercase">
          {groupLabel[modality.group]}
        </p>
        <p aria-hidden="true" className="gb-display absolute top-3 right-4 text-[2.2rem] gb-outline [--gb-outline:rgb(246_248_243/0.55)] [--gb-outline-w:1px]">
          {String(index + 1).padStart(2, "0")}
        </p>

        <div className="gb-card-copy absolute inset-x-0 bottom-0 p-5 sm:p-6">
          <div ref={head}>
            <h3 className="gb-display text-[clamp(2.3rem,7vw,2.9rem)] leading-[0.86]">{modality.name}</h3>
            <p className="gb-confirm mt-2 text-giz">Horários: {toConfirm}</p>
          </div>
          <div className="gb-card-more">
            {modality.levels.length ? (
              <ul className="mt-3 flex flex-wrap gap-1" aria-label={`Escalões de ${modality.name}`}>
                {modality.levels.map((level) => (
                  <li key={level} className="rounded-full bg-giz/10 px-2 py-0.5 text-[0.7rem] font-semibold ring-1 ring-giz/25">
                    {level}
                  </li>
                ))}
              </ul>
            ) : null}
            <button
              type="button"
              onClick={() => openContact({ reason: "inscricao", modality: modality.id })}
              className="mt-4 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-giz px-5 text-[0.8rem] font-bold whitespace-nowrap text-pavilhao transition-colors hover:bg-amarelo"
            >
              Inscrever<span className="sr-only"> em {modality.name}</span>
              <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-0.5">
                →
              </span>
            </button>
          </div>
        </div>
      </article>
    </li>
  );
}

// No telemóvel, os cartões numa faixa que se arrasta (motion drag, com inércia), dentro de uma caixa recortada.
function MobileRow({ children }: { children: React.ReactNode }) {
  const box = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLUListElement>(null);
  const x = useMotionValue(0);
  const [limit, setLimit] = useState(0);
  const measure = useCallback(() => {
    if (!box.current || !track.current) return;
    const next = Math.max(0, track.current.scrollWidth - box.current.clientWidth);
    setLimit(next);
    if (x.get() < -next) animate(x, -next, { duration: 0.2 });
  }, [x]);
  useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (box.current) ro.observe(box.current);
    return () => ro.disconnect();
  }, [measure]);
  return (
    <div ref={box} role="region" aria-label="Modalidades: arraste para o lado" className="overflow-hidden px-[var(--gb-gutter)] lg:hidden">
      <m.ul
        ref={track}
        drag="x"
        dragConstraints={{ left: -limit, right: 0 }}
        dragElastic={0.08}
        dragTransition={{ power: 0.35, timeConstant: 260 }}
        style={{ x }}
        className="flex w-max touch-pan-y gap-3"
      >
        {children}
      </m.ul>
    </div>
  );
}

// As modalidades em cartões, todas à vista ao mesmo tempo (dono, 2026-11-02), com profundidade (dono, no mesmo
// dia: «perderam muito a piada»): cinco numa fila nos ecrãs largos, três e dois no portátil, uma faixa que se
// arrasta no telemóvel. O botão «Inscrever» abre a gaveta do formulário com a modalidade já escolhida.
export function ModalityCards() {
  const root = useRef<HTMLElement>(null);
  const shown = useReveal(root);
  const list = cards.map((modality, i) => <ModalityCard key={modality.id} modality={modality} index={i} />);

  return (
    <section ref={root} id={grobSections.modalities} aria-labelledby="gb-mod-title" data-shown={shown} className="gb-grain-light relative overflow-hidden bg-giz py-20 text-tinta sm:py-28">
      <div className="gb-container">
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
          <div>
            <p className="gb-eyebrow flex items-center gap-3 text-relva-escuro">
              <span aria-hidden="true" className="h-px w-8 bg-relva-escuro" />
              Modalidades
            </p>
            <h2 id="gb-mod-title" className="gb-display mt-3 text-[clamp(2.6rem,7vw,4.6rem)]">
              Escolha a sua <span className="text-relva">modalidade</span>
            </h2>
          </div>
          <p className="max-w-[26rem] text-[0.98rem] leading-relaxed text-cinza">
            Competição, saúde e bem-estar. A sede abre às modalidades desportivas nos{" "}
            {grobSede.hoursSport.charAt(0).toLowerCase() + grobSede.hoursSport.slice(1)}.
          </p>
        </div>
      </div>

      <div className="mt-10 sm:mt-12">
        <MobileRow>{list}</MobileRow>
        <ul className="gb-container hidden grid-cols-3 gap-5 lg:grid min-[1700px]:grid-cols-5">
          {list}
        </ul>
      </div>
      <p className="gb-container mt-6 text-[0.92rem] text-cinza">
        E, para o lazer, <strong className="font-semibold text-tinta">matraquilhos</strong>.
      </p>
    </section>
  );
}
