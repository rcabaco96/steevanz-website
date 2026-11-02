import { grobAge } from "@/content/grob/facts";
import { grobHref, type GrobRoute } from "@/content/grob/routes";
import { Achievements } from "./Achievements";
import { Community } from "./Community";
import { ContactDrawer } from "./ContactDrawer";
import { Contacts } from "./Contacts";
import { EmblemHero } from "./EmblemHero";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { JsonLd } from "./JsonLd";
import { Members } from "./Members";
import { ModalityCards } from "./ModalityCards";
import { MotionRoot } from "./MotionRoot";
import { Scoreboard } from "./Scoreboard";
import { Sede } from "./Sede";
import { JoinBand } from "./JoinBand";
import { SmoothScroll } from "./SmoothScroll";

// O site do GROB — Grupo Recreativo Olival Basto (Odivelas, fundado a 6 de junho de 1937). Site-demo (2026-11-02)
// para apresentar ao clube como substituto do atual (grolivalbasto.com, em Wix). Vive dentro da app da Steevanz,
// com o seu próprio layout; ver src/lib/client-sites.ts para o domínio.
//
// CONCEITO (steevanz-sites-clientes) — «O PAVILHÃO E O ESCUDO».
// O motivo vem do mundo do clube: as linhas a giz de um campo de futsal (retângulo, linha do meio, círculo
// central, áreas de 6 m), o «V» do escudo e o ano 1937, como num placar. Paleta tirada do emblema: o verde do
// rebordo (#10a24b → #64ba4c) e o verde-noite de um pavilhão às escuras, o branco do campo, o amarelo e o preto do
// «V» (o amarelo só para números e destaques), o vermelho dos laços quase nunca. Letra: as capitais estreitas do
// placar e das camisolas (Big Shoulders) com um texto redondo e legível (Figtree).
// A peça principal é o EMBLEMA EM 3D (emblem/EmblemCanvas.tsx): extrudido do PDF vetorial do clube, com esmalte
// verde, banda dourada, placa de prata e luz de estúdio.
// Cenas, por esta ordem (sem abertura: o site mostra-se logo, dono 2026-11-02): o emblema 3D preso ao ecrã que vem de frente, se desmonta em camadas com as partes
// nomeadas, volta a montar-se e dá uma volta de moeda; o placar do clube, casa a casa; os cartões das modalidades
// a empilharem-se como camisolas; a equipa a abrir-se por dentro do «V» junto ao formulário de inscrição; a sede a
// abrir-se do «V» até encher o ecrã; a faixa de palavras e a galeria em colunas a velocidades diferentes; o cartão
// de sócio que se inclina; os contactos com os três espaços do clube.
export function GrobSite({ route }: { route: GrobRoute }) {
  const age = grobAge(new Date());
  return (
    <MotionRoot>
      <a
        href="#conteudo"
        className="fixed top-3 left-3 z-[60] -translate-y-24 rounded-full bg-giz px-5 py-3 font-semibold text-pavilhao transition-transform focus:translate-y-0"
      >
        Saltar para o conteúdo
      </a>
      <Header homeHref={grobHref(route.mode)} />
      <main id="conteudo" tabIndex={-1} className="outline-none">
        <EmblemHero age={age} />
        <Scoreboard age={age} />
        <ModalityCards />
        <JoinBand />
        <Sede />
        <Community />
        <Achievements />
        <Members />
        <Contacts />
      </main>
      <Footer />
      <ContactDrawer />
      <SmoothScroll />
      <JsonLd />
    </MotionRoot>
  );
}
