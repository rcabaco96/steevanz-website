"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { Component, useCallback, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { grob, grobPhotos } from "@/content/grob/facts";
import { CourtLines } from "./CourtLines";
import { createEmblemState, type EmblemState } from "./emblem/state";
import { useScrollScene } from "./scroll-scene";
import { openContact } from "./contact-bus";
import { grobSections } from "./sections";

// O 3D só existe no browser, num pedaço à parte (three.js não pesa na primeira pintura), e só é pedido depois da
// primeira pintura, quando o browser está livre (requestIdleCallback).
const EmblemCanvas = dynamic(() => import("./emblem/EmblemCanvas"), { ssr: false });

/** Se o 3D falhar (pedaço que não carrega, WebGL perdido), fica a imagem parada: a página nunca cai por causa dele. */
class Fallback3d extends Component<{ children: ReactNode; onFail: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onFail();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

const reducedQuery = "(prefers-reduced-motion: reduce)";
function subscribeMotion(onChange: () => void) {
  const query = window.matchMedia(reducedQuery);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}
let webglSupport: boolean | null = null;
function hasWebgl() {
  if (webglSupport === null) {
    try {
      const canvas = document.createElement("canvas");
      webglSupport = Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
    } catch {
      webglSupport = false;
    }
  }
  return webglSupport;
}
function canRun3d() {
  return !window.matchMedia(reducedQuery).matches && hasWebgl();
}
/** Com movimento (gb-motion, posto no <head>) mas sem WebGL: fica a imagem parada. */
function needsStill() {
  return document.documentElement.classList.contains("gb-motion") && !canRun3d();
}

/** Onde o emblema começa (a mesma pose da imagem parada, emblema-3d.webp): o 3D nasce já aqui, sem entrada. */
function startPose(wide: boolean) {
  return wide ? { x: 0.43, y: 0, fit: 0.66, rotY: -0.55, rotX: 0.14, explode: 0, spin: 0 } : { x: 0, y: 0.42, fit: 0.3, rotY: -0.5, rotX: 0.14, explode: 0, spin: 0 };
}

/** As partes do escudo, descritas pelo que se vê (o significado de cada uma fica para o clube contar). */
const parts = [
  { n: "01", title: "O escudo", text: "Verde e branco, com o rebordo em esmalte." },
  { n: "02", title: "O V", text: "Ao centro: verde, preto e uma banda amarela." },
  { n: "03", title: "Os laços", text: "Vermelhos, com as letras GR · OB." },
  { n: "04", title: "Os ramos", text: "De oliveira, com azeitonas, à volta do V." },
  { n: "05", title: "1937", text: `O ano da fundação: ${grob.foundedLabel}.` },
];

// A abertura e a primeira cena. O emblema do clube em 3D (emblem/EmblemCanvas.tsx) pousa à direita do título
// (ao alto no telemóvel). Ao descer, a cena fica presa (GSAP pin + scrub): o emblema vem para o centro e roda de
// frente, desmonta-se em camadas enquanto as partes do escudo se nomeiam uma a uma, volta a montar-se, dá uma
// volta de moeda e fica pequeno, a dar a vez ao placar. O 3D entra uma vez, num fade, quando está pronto (sem
// imagem parada por baixo). Movimento reduzido ou sem WebGL: a imagem parada e as partes numa lista, sem pin.
export function EmblemHero({ age }: { age: number }) {
  const root = useRef<HTMLElement>(null);
  const stateRef = useRef<EmblemState>(createEmblemState());
  const motionOk = useSyncExternalStore(subscribeMotion, canRun3d, () => false);
  const [ready, setReady] = useState(false);
  const [onScreen, setOnScreen] = useState(true);
  // A imagem parada só aparece se o 3D não puder correr numa página que contava com ele (sem WebGL) ou se falhar.
  const noWebgl = useSyncExternalStore(subscribeMotion, needsStill, () => false);
  const [failed, setFailed] = useState(false);
  const still = noWebgl || failed;
  const onReady = useCallback(() => setReady(true), []);
  const showStill = useCallback(() => setFailed(true), []);
  // O emblema aparece uma vez só (dono, 2026-11-02: «continua a renderizar 2 vezes, não pode ser»): com movimento, a
  // imagem parada nunca se pinta (fica escondida pelo gb-motion desde o <head>) e o 3D monta logo e entra num único
  // fade quando está pronto. A imagem fica para movimento reduzido e para quem não tem WebGL.
  useEffect(() => {
    if (motionOk) Object.assign(stateRef.current, startPose(window.matchMedia("(min-width: 1024px)").matches));
  }, [motionOk]);

  // Fora do ecrã o 3D não desenha nada (nem quando o rato mexe).
  useEffect(() => {
    const el = root.current;
    if (!el || !motionOk) return;
    const io = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting), { rootMargin: "100px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, [motionOk]);

  // O rato inclina o emblema (só com rato) e acorda a cena 3D.
  useEffect(() => {
    if (!motionOk || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const state = stateRef.current;
    let frame = 0;
    const onMove = (event: PointerEvent) => {
      state.pointerX = (event.clientX / window.innerWidth) * 2 - 1;
      state.pointerY = (event.clientY / window.innerHeight) * 2 - 1;
      if (!frame && window.scrollY < window.innerHeight * 4) {
        frame = requestAnimationFrame(() => {
          frame = 0;
          state.wake?.();
        });
      }
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, [motionOk]);

  useScrollScene(root, (gsap) => {
      const mm = gsap.matchMedia();
      mm.add(
        { wide: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)", narrow: "(max-width: 1023px) and (prefers-reduced-motion: no-preference)" },
        (context) => {
          const wide = Boolean(context.conditions?.wide);
          const q = gsap.utils.selector(root.current);
          const state = stateRef.current;
          // Onde o emblema começa (tem de bater com a imagem parada, ver o JSX).
          Object.assign(state, startPose(wide));
          const caps = q("[data-cap]");
          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: { trigger: root.current, start: "top top", end: wide ? "+=250%" : "+=220%", pin: true, scrub: 0.45, anticipatePin: 1 },
            onUpdate: () => state.wake?.(),
          });
          // 0–1.6: o título sai, o emblema vem para o centro e fica de frente.
          tl.to(q("[data-hero-copy]"), { yPercent: -14, opacity: 0, duration: 1.1, ease: "power1.in" }, 0)
            .to(q("[data-hero-cue]"), { opacity: 0, duration: 0.3 }, 0)
            .to(q("[data-year-bg]"), { scale: wide ? 1.2 : 1.1, opacity: 0.1, duration: 1.6 }, 0)
            .to(state, { x: wide ? 0.22 : 0, y: wide ? 0 : 0.2, fit: wide ? 0.78 : 0.44, rotY: 0, rotX: 0.04, duration: 1.6, ease: "power1.inOut" }, 0)
            .to(q("[data-court]"), { scale: 1.12, opacity: 0.22, duration: 1.6 }, 0)
            // 1.6–6: desmonta-se em camadas e vira-se de lado; as partes nomeiam-se.
            .to(q("[data-caps]"), { opacity: 1, duration: 0.3 }, 1.5)
            .to(state, { explode: 1, rotY: wide ? 0.95 : 0.62, rotX: -0.14, fit: wide ? 0.78 : 0.36, y: wide ? 0 : 0.26, duration: 1.6, ease: "power2.inOut" }, 1.7)
            .to(state, { rotY: wide ? 0.55 : 0.36, duration: 2.6, ease: "sine.inOut" }, 3.3);
          caps.forEach((cap, i) => {
            const at = 1.9 + i * 0.8;
            tl.fromTo(cap, { opacity: wide ? 0.28 : 0, y: wide ? 0 : 18 }, { opacity: 1, y: 0, duration: 0.35 }, at);
            if (i < caps.length - 1) tl.to(cap, { opacity: wide ? 0.28 : 0, y: wide ? 0 : -18, duration: 0.3 }, at + 0.75);
          });
          tl.fromTo(q("[data-cap-bar]"), { scaleY: 0 }, { scaleY: 1, duration: 4, ease: "none" }, 1.9);
          // 6–7.6: volta a montar-se e fica de frente.
          tl.to(state, { explode: 0, rotY: 0, rotX: 0.04, x: 0, y: wide ? 0.04 : 0.1, duration: 1.5, ease: "power2.inOut" }, 6)
            .to(q("[data-caps]"), { opacity: 0, duration: 0.5 }, 6)
            // 7.6–9.6: uma volta de moeda, fica pequeno; a frase final.
            .to(state, { spin: Math.PI * 2, fit: wide ? 0.42 : 0.34, y: wide ? 0.2 : 0.26, duration: 2, ease: "power2.inOut" }, 7.6)
            .fromTo(q("[data-outro]"), { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8 }, 8.6)
            .to({}, { duration: 0.4 }, 9.6);
        },
      );
      return () => mm.revert();
  });

  const photo = grobPhotos.futsalAtaque;

  return (
    <section
      ref={root}
      id={grobSections.emblem}
      aria-labelledby="gb-hero-title"
      className="gb-court relative isolate overflow-hidden text-giz motion-on:h-svh motion-on:min-h-[600px]"
    >
      {/* O pavilhão: uma fotografia de jogo, quase apagada, e as linhas do campo. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <Image src={photo.src} alt="" fill priority sizes="100vw" className="object-cover opacity-[0.16] grayscale" />
        <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_45%,transparent,rgb(6_38_21/0.85))]" />
        <div data-court className="absolute inset-0 flex items-center justify-center text-giz opacity-[0.13]">
          <CourtLines className="hidden h-[82%] w-auto max-w-[94%] lg:block" />
          <CourtLines vertical className="h-[86%] w-auto max-w-[92%] lg:hidden" />
        </div>
        <p
          data-year-bg
          className="gb-display absolute inset-x-0 top-1/2 -translate-y-1/2 text-center text-[clamp(9rem,42vw,34rem)] leading-none gb-outline opacity-[0.16] [--gb-outline:var(--color-giz)]"
        >
          1937
        </p>
      </div>

      {/* O emblema: o 3D (uma única entrada); a imagem parada só sem movimento ou sem WebGL. */}
      <div className="pointer-events-none relative mx-auto flex justify-center pt-24 motion-on:absolute motion-on:inset-0 motion-on:block motion-on:pt-0">
        <div
          className={`motion-on:absolute motion-on:top-[29%] motion-on:left-1/2 motion-on:h-[30svh] motion-on:-translate-x-1/2 motion-on:-translate-y-1/2 lg:motion-on:top-1/2 lg:motion-on:left-[71.5%] lg:motion-on:h-[66svh] ${still ? "" : "motion-on:invisible"}`}
        >
          <Image
            src={grob.media.emblemStill}
            alt={`O emblema do ${grob.short}: escudo verde e branco com um V, laços vermelhos, ramos de oliveira e o ano 1937`}
            width={710}
            height={906}
            priority
            sizes="(min-width: 1024px) 40vw, 60vw"
            className="gb-float h-[46svh] w-auto max-w-[80vw] object-contain drop-shadow-[0_30px_50px_rgb(0_0_0/0.45)] motion-on:h-full"
          />
        </div>
        {motionOk ? (
          <div className={`absolute inset-0 transition-opacity duration-1000 ${ready ? "opacity-100" : "opacity-0"}`}>
            <Fallback3d onFail={showStill}>
              <EmblemCanvas stateRef={stateRef} onReady={onReady} active={onScreen} />
            </Fallback3d>
          </div>
        ) : null}
      </div>

      {/* O título. */}
      <div
        data-hero-copy
        className="relative z-10 gb-container flex flex-col pt-8 pb-14 motion-on:absolute motion-on:inset-x-0 motion-on:bottom-0 motion-on:pb-9 lg:motion-on:top-1/2 lg:motion-on:bottom-auto lg:motion-on:-translate-y-1/2 lg:motion-on:pb-0 [@media(max-height:700px)]:motion-on:pb-5"
      >
        <div className="max-w-[36rem] lg:max-w-[40rem]">
          <p className="gb-eyebrow gb-rise flex items-center gap-3 text-relva-claro [animation-delay:100ms]">
            <span aria-hidden="true" className="h-px w-8 bg-relva-claro" />
            {grob.name} · {grob.municipality}
          </p>
          <h1
            id="gb-hero-title"
            className="gb-display gb-rise mt-4 text-[clamp(3.1rem,14vw,8.6rem)] [animation-delay:250ms] lg:mt-6 [@media(max-height:700px)]:text-[clamp(2.7rem,12vw,5rem)]"
          >
            <span className="block">O clube de</span>
            <span className="block">Olival Basto</span>
            <span className="block text-amarelo">desde 1937</span>
          </h1>
          <p className="gb-rise mt-4 max-w-[30rem] text-[0.98rem] leading-relaxed text-giz/80 sm:text-[1.05rem] lg:mt-6 [animation-delay:450ms] [@media(max-height:700px)]:hidden">
            Futsal, ténis de mesa, yoga, pilates clínico e zumba. Cerca de {grob.athletes} atletas e centenas de sócios.
          </p>
          <div className="gb-rise mt-6 grid grid-cols-2 gap-3 sm:flex sm:w-auto [animation-delay:600ms] lg:mt-9 [@media(max-height:700px)]:mt-4">
                          <button
                type="button"
                onClick={() => openContact({ reason: "inscricao" })}
                className="inline-flex h-13 w-full items-center justify-center rounded-full bg-giz px-6 text-[0.8rem] font-bold tracking-[0.16em] whitespace-nowrap text-pavilhao uppercase transition-colors hover:bg-amarelo sm:w-auto sm:px-8"
              >
                Inscrever
              </button>
                        <button
              type="button"
              onClick={() => openContact({ reason: "socio" })}
              className="inline-flex h-13 items-center justify-center rounded-full px-6 text-[0.8rem] font-bold tracking-[0.16em] whitespace-nowrap uppercase ring-1 ring-giz/45 transition-colors hover:bg-giz/10 sm:px-8"
            >
              Ser sócio
            </button>
          </div>
        </div>
      </div>

      <div data-hero-cue aria-hidden="true" className="pointer-events-none absolute right-8 bottom-6 hidden flex-col items-center gap-2 lg:motion-on:flex [@media(max-height:760px)]:!hidden">
        <span className="gb-eyebrow text-[0.62rem] text-giz/60 [writing-mode:vertical-rl]">Descer</span>
        <span className="relative block h-10 w-px overflow-hidden bg-giz/20">
          <span className="gb-cue absolute inset-0 bg-amarelo" />
        </span>
      </div>

      {/* As partes do escudo: sobre a cena (com movimento) ou numa lista por baixo (sem). */}
      <div
        data-caps
        className="relative z-10 gb-container pb-16 motion-on:pointer-events-none motion-on:absolute motion-on:inset-x-0 motion-on:bottom-0 motion-on:pb-8 motion-on:opacity-0 lg:motion-on:top-1/2 lg:motion-on:bottom-auto lg:motion-on:-translate-y-1/2 lg:motion-on:pb-0"
      >
        <p className="gb-eyebrow mb-5 text-relva-claro motion-on:hidden lg:motion-on:block">O símbolo do {grob.short}</p>
        <div className="relative lg:flex lg:gap-6">
          <div aria-hidden="true" className="relative hidden w-px bg-giz/15 lg:motion-on:block">
            <div data-cap-bar className="absolute inset-0 origin-top bg-amarelo" />
          </div>
          <ol className="grid gap-5 sm:grid-cols-2 motion-on:block motion-on:h-[7.5rem] lg:motion-on:h-auto lg:motion-on:space-y-6 [@media(max-height:700px)]:motion-on:h-[6.5rem]">
            {parts.map((part) => (
              <li
                key={part.n}
                data-cap
                className="max-w-[22rem] motion-on:absolute motion-on:inset-x-0 motion-on:bottom-0 lg:motion-on:static"
              >
                <p className="flex items-baseline gap-3">
                  <span className="text-xs font-bold tracking-[0.2em] text-amarelo">{part.n}</span>
                  <span className="gb-display text-[2.4rem] lg:text-[2.9rem]">{part.title}</span>
                </p>
                <p className="mt-1 text-[0.95rem] leading-snug text-giz/80">{part.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div
        data-outro
        className="pointer-events-none absolute inset-x-0 bottom-[9%] z-10 hidden px-5 text-center motion-on:block motion-on:opacity-0 [@media(max-height:700px)]:bottom-[5%]"
      >
        <p className="gb-display text-[clamp(2.6rem,9vw,5.6rem)]">
          Um escudo. <span className="text-amarelo">{age} anos.</span>
        </p>
        <p className="mt-3 text-sm text-giz/75">Fundado a {grob.foundedLabel}</p>
      </div>
    </section>
  );
}
