import { ScrollVelocity } from "../o-ermita/react-bits/ScrollVelocity";
import { Leaf } from "./Logo";

// Scene 4 — «A banca a passar». Two strips of the stall's produce names (from the catalogue) drifting in opposite
// directions, speeding up with the scroll (React Bits ScrollVelocity). No pause button (owner rule); static with
// reduced motion.
const rowA = ["Pera Rocha", "Maçã Royal Gala", "Dióspiro", "Laranja", "Tâmara Medjool", "Manga", "Uva preta", "Anonas"];
const rowB = ["Couve portuguesa", "Grelos", "Batata-doce", "Abóbora", "Feijão-verde", "Coentros", "Tomate cherry", "Espargos"];

function Row({ words, accent }: { words: string[]; accent: string }) {
  return (
    <>
      {words.map((word) => (
        <span key={word} className="flex items-center">
          <span className="px-5 font-display text-[clamp(2.2rem,7vw,5rem)] leading-none">{word}</span>
          <Leaf className={`h-[clamp(1.4rem,3.5vw,2.6rem)] w-[clamp(1.4rem,3.5vw,2.6rem)] ${accent}`} />
        </span>
      ))}
    </>
  );
}

export function ProduceStrip() {
  return (
    <section aria-label="Da nossa banca" className="overflow-hidden bg-kraft py-14 text-ardosia sm:py-20">
      <ScrollVelocity baseVelocity={2.4}>
        <Row words={rowA} accent="text-tomate" />
      </ScrollVelocity>
      <ScrollVelocity baseVelocity={-2} className="mt-3 text-folha">
        <Row words={rowB} accent="text-limao" />
      </ScrollVelocity>
    </section>
  );
}
