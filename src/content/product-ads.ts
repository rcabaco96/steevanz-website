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
  "guest-guide": {
    src: "/home/guia-alojamento-anuncio-720.mp4",
    poster: "/home/guia-alojamento-anuncio-720.jpg",
    label: {
      pt: "Anúncio do Guia digital do alojamento da Steevanz: o hóspede toca na placa e encontra no telemóvel o WiFi, o check-in e check-out, as regras da casa e as recomendações.",
      en: "Steevanz digital guest guide ad: guests tap the plate and find the WiFi, check-in and check-out, house rules and recommendations on their phone.",
      es: "Anuncio de la Guía digital del alojamiento de Steevanz: el huésped toca la placa y encuentra en el móvil el wifi, el check-in y el check-out, las normas de la casa y las recomendaciones.",
      fr: "Publicité du livret d'accueil digital Steevanz : le voyageur touche la plaque et trouve sur son téléphone le wifi, l'arrivée et le départ, le règlement intérieur et les recommandations.",
      de: "Werbespot der digitalen Gästemappe von Steevanz: Gäste tippen auf das Schild und finden auf dem Handy WLAN, Check-in und Check-out, Hausregeln und Empfehlungen.",
      it: "Spot della guida digitale dell'alloggio di Steevanz: l'ospite tocca la targa e trova sul telefono il wifi, check-in e check-out, le regole della casa e i consigli.",
    },
  },
  "business-card": {
    src: "/home/cartao-visita-anuncio-720.mp4",
    poster: "/home/cartao-visita-anuncio-720.jpg",
    label: {
      pt: "Anúncio do Cartão de visita digital da Steevanz: um toque no cartão abre a página de contacto e o contacto fica guardado no telemóvel.",
      en: "Steevanz digital business card ad: one tap on the card opens the contact page and the contact is saved on the phone.",
      es: "Anuncio de la Tarjeta de visita digital de Steevanz: un toque en la tarjeta abre la página de contacto y el contacto queda guardado en el móvil.",
      fr: "Publicité de la carte de visite digitale Steevanz : un toucher sur la carte ouvre la page de contact et le contact est enregistré dans le téléphone.",
      de: "Werbespot der digitalen Visitenkarte von Steevanz: Ein Antippen der Karte öffnet die Kontaktseite und der Kontakt wird im Handy gespeichert.",
      it: "Spot del biglietto da visita digitale di Steevanz: un tocco sul biglietto apre la pagina di contatto e il contatto viene salvato nel telefono.",
    },
  },
  keychain: {
    src: "/home/porta-chaves-anuncio-720.mp4",
    poster: "/home/porta-chaves-anuncio-720.jpg",
    label: {
      pt: "Anúncio do Porta-chaves digital da Steevanz: em vez de dizer o número em voz alta ou escrevê-lo num papel, um toque no porta-chaves abre a conversa no WhatsApp e o contacto fica partilhado em privado.",
      en: "Steevanz digital keychain ad: instead of saying your number out loud or writing it on paper, one tap on the keychain opens the WhatsApp chat and the contact is shared privately.",
      es: "Anuncio del Llavero digital de Steevanz: en vez de decir el número en voz alta o escribirlo en un papel, un toque en el llavero abre la conversación de WhatsApp y el contacto se comparte en privado.",
      fr: "Publicité du porte-clés digital Steevanz : au lieu de dire son numéro à voix haute ou de l'écrire sur un papier, un toucher sur le porte-clés ouvre la conversation WhatsApp et le contact est partagé en privé.",
      de: "Werbespot des digitalen Schlüsselanhängers von Steevanz: statt die Nummer laut zu sagen oder auf einen Zettel zu schreiben, öffnet ein Antippen des Anhängers den WhatsApp-Chat und der Kontakt wird privat geteilt.",
      it: "Spot del portachiavi digitale di Steevanz: invece di dire il numero ad alta voce o scriverlo su un foglio, un tocco sul portachiavi apre la chat di WhatsApp e il contatto viene condiviso in privato.",
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
