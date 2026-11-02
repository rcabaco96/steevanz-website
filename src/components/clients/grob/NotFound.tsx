import Image from "next/image";
import { grob } from "@/content/grob/facts";
import { grobPreviewBase } from "@/content/grob/routes";

// Página não encontrada, na identidade do clube: fora de jogo.
export function GrobNotFound() {
  return (
    <main className="gb-court flex min-h-svh flex-col items-center justify-center px-6 text-center text-giz">
      <Image src={grob.media.emblemSmall} alt={`Emblema do ${grob.short}`} width={439} height={560} className="h-32 w-auto" />
      <p className="gb-display mt-8 text-[clamp(3.4rem,14vw,7rem)]">Fora de jogo</p>
      <p className="mt-3 max-w-sm text-giz/75">Esta página não existe. Volte ao início do site do {grob.short}.</p>
      <a href={grobPreviewBase} className="mt-8 inline-flex h-12 items-center rounded-full bg-giz px-6 text-[0.8rem] font-bold tracking-[0.14em] text-pavilhao uppercase hover:bg-amarelo">
        Voltar ao início
      </a>
    </main>
  );
}
