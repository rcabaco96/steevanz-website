// The approved Steevanz ad videos, in their web versions (720×1280, H.264 + AAC with the music; the
// licences are in public/home/LICENCAS.txt). Shown with components/media/AdVideo on the home page
// and on the product pages. The videos speak Portuguese; only the labels change with the language.

import type { Locale } from "@/lib/i18n";
import type { ProductId } from "./types";

export interface ProductAd {
  src: string;
  poster: string;
  label: Record<Locale, string>;
}

export const productAds: Partial<Record<ProductId, ProductAd>> = {
  "digital-menu": {
    src: "/home/menu-digital-anuncio-720.mp4",
    poster: "/home/menu-digital-anuncio-720.jpg",
    label: {
      pt: "Anúncio do Menu digital da Steevanz: os pratos em vídeo no telemóvel e o pedido feito à mesa.",
      en: "Steevanz Digital menu ad: the dishes on video on the phone and the order placed at the table.",
    },
  },
  loyalty: {
    src: "/home/cartao-cliente-anuncio-720.mp4",
    poster: "/home/cartao-cliente-anuncio-720.jpg",
    label: {
      pt: "Anúncio do Cartão de cliente digital da Steevanz: o cliente adere com um toque, recebe carimbos no telemóvel e a recompensa chega sozinha.",
      en: "Steevanz digital loyalty card ad: customers join with a tap, collect stamps on their phone and the reward arrives on its own.",
    },
  },
};

/** The video's buttons. */
export const adVideoLabels: Record<Locale, { soundOn: string; soundOff: string; play: string }> = {
  pt: { soundOn: "Ver com som", soundOff: "Tirar o som", play: "Ver o vídeo" },
  en: { soundOn: "Watch with sound", soundOff: "Mute", play: "Play video" },
};
