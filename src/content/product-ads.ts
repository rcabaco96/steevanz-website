// The approved Steevanz ad videos, in their web versions (720×1280, H.264 + AAC with the music; the
// licences are in public/home/LICENCAS.txt). Shown with components/media/AdVideo on the home page
// and on the product pages. The videos speak Portuguese; only the labels change with the language.

import type { Localized } from "@/lib/i18n";
import type { ProductId } from "./types";

export interface ProductAd {
  src: string;
  poster: string;
  label: Localized<string>;
}

export const productAds: Partial<Record<ProductId, ProductAd>> = {
  "digital-menu": {
    src: "/home/menu-digital-anuncio-720.mp4",
    poster: "/home/menu-digital-anuncio-720.jpg",
    label: {
      pt: "Anúncio do Menu digital da Steevanz: os pratos em vídeo no telemóvel e o pedido feito à mesa.",
      en: "Steevanz Digital menu ad: the dishes on video on the phone and the order placed at the table.",
      es: "Anuncio del Menú digital de Steevanz: los platos en vídeo en el móvil y el pedido hecho desde la mesa.",
      fr: "Publicité du Menu digital Steevanz : les plats en vidéo sur le téléphone et la commande passée à table.",
      de: "Werbespot der digitalen Speisekarte von Steevanz: die Gerichte als Video auf dem Handy und die Bestellung direkt vom Tisch.",
      it: "Spot del Menù digitale di Steevanz: i piatti in video sul telefono e l'ordine fatto dal tavolo.",
    },
  },
  loyalty: {
    src: "/home/cartao-cliente-anuncio-720.mp4",
    poster: "/home/cartao-cliente-anuncio-720.jpg",
    label: {
      pt: "Anúncio do Cartão de cliente digital da Steevanz: o cliente adere com um toque, recebe carimbos no telemóvel e a recompensa chega sozinha.",
      en: "Steevanz digital loyalty card ad: customers join with a tap, collect stamps on their phone and the reward arrives on its own.",
      es: "Anuncio de la Tarjeta de cliente digital de Steevanz: el cliente se apunta con un toque, recibe sellos en el móvil y la recompensa llega sola.",
      fr: "Publicité de la carte de fidélité digitale Steevanz : le client s'inscrit d'un toucher, reçoit des tampons sur son téléphone et la récompense arrive toute seule.",
      de: "Werbespot der digitalen Kundenkarte von Steevanz: Kunden melden sich mit einem Antippen an, sammeln Stempel auf dem Handy und die Prämie kommt von selbst.",
      it: "Spot della carta fedeltà digitale di Steevanz: il cliente si iscrive con un tocco, raccoglie timbri sul telefono e il premio arriva da solo.",
    },
  },
};

/** The video's buttons. */
export const adVideoLabels: Localized<{ soundOn: string; soundOff: string; play: string }> = {
  pt: { soundOn: "Ver com som", soundOff: "Tirar o som", play: "Ver o vídeo" },
  en: { soundOn: "Watch with sound", soundOff: "Mute", play: "Play video" },
  es: { soundOn: "Ver con sonido", soundOff: "Quitar el sonido", play: "Ver el vídeo" },
  fr: { soundOn: "Regarder avec le son", soundOff: "Couper le son", play: "Lire la vidéo" },
  de: { soundOn: "Mit Ton ansehen", soundOff: "Ton aus", play: "Video abspielen" },
  it: { soundOn: "Guardi con l'audio", soundOff: "Disattivi l'audio", play: "Guardi il video" },
};
