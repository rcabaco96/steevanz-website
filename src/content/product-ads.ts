// The approved Steevanz ad videos, in their web versions (720×1280, H.264 + AAC with the music; the
// licences are in public/home/LICENCAS.txt). Shown with components/media/AdVideo on the home page
// and on the product pages. The videos speak Portuguese; only the labels change with the language.

import type { Localized } from "@/lib/i18n";
import type { ProductId } from "./types";

export interface ProductAd {
  src: string;
  poster: string;
  /** The length, rounded to whole seconds (shown on the «Ver o vídeo (27 s)» buttons; tests/home-novo checks it against the file). */
  seconds: number;
  label: Localized<string>;
  /**
   * When a product has more than one ad (e.g. the bookings: a restaurant and a hair salon), every video, in tab
   * order. The ad's own src/poster/label are the first one's (they stay for everything that shows a single video),
   * so the product page shows tabs (components/media/AdVideoTabs) and only the active tab's video is loaded.
   */
  variants?: ProductAdVariant[];
  /** The variant the home band shows (content/novo-home.ts, homeAdBands); without it, the first one. */
  homeVariant?: string;
}

/** One of a product's ads, with the label of its tab on the product page. */
export type ProductAdVariant = Omit<ProductAd, "variants" | "homeVariant"> & { id: string; tab: Localized<string> };

/** The video the home band shows: the `homeVariant`, or the ad itself (its first video). */
export function homeAdVideo(ad: ProductAd): Omit<ProductAd, "variants" | "homeVariant"> {
  return ad.variants?.find((variant) => variant.id === ad.homeVariant) ?? ad;
}

/** The online bookings ad in a restaurant (first tab on the product page). */
const bookingsRestaurant: ProductAdVariant = {
  id: "restaurant",
  tab: { pt: "Restaurante", en: "Restaurant", es: "Restaurante", fr: "Restaurant", de: "Restaurant", it: "Ristorante" },
  src: "/home/reservas-anuncio-720.mp4",
  poster: "/home/reservas-anuncio-720.jpg",
  seconds: 27,
  label: {
    pt: "Anúncio do Sistema de reservas online da Steevanz: num restaurante cheio numa sexta à noite, o telefone não para de tocar; às 23h uma cliente reserva em 30 segundos pelo link do Instagram, recebe a confirmação, guarda a reserva no calendário e recebe o lembrete por email.",
    en: "Steevanz online booking system ad: at a full restaurant on a Friday night the phone keeps ringing; at 11 pm a customer books in 30 seconds from the Instagram link, gets the confirmation, adds the booking to her calendar and receives the reminder by email.",
    es: "Anuncio del Sistema de reservas online de Steevanz: en un restaurante lleno un viernes por la noche, el teléfono no para de sonar; a las 23 h una clienta reserva en 30 segundos desde el enlace de Instagram, recibe la confirmación, guarda la reserva en el calendario y recibe el recordatorio por email.",
    fr: "Publicité du système de réservation en ligne Steevanz : dans un restaurant plein un vendredi soir, le téléphone n'arrête pas de sonner ; à 23 h, une cliente réserve en 30 secondes depuis le lien Instagram, reçoit la confirmation, ajoute la réservation à son calendrier et reçoit le rappel par e-mail.",
    de: "Werbespot des Online-Reservierungssystems von Steevanz: In einem vollen Restaurant klingelt an einem Freitagabend ununterbrochen das Telefon; um 23 Uhr reserviert eine Kundin in 30 Sekunden über den Instagram-Link, erhält die Bestätigung, trägt die Reservierung in ihren Kalender ein und bekommt die Erinnerung per E-Mail.",
    it: "Spot del sistema di prenotazione online di Steevanz: in un ristorante pieno il venerdì sera il telefono non smette di squillare; alle 23 una cliente prenota in 30 secondi dal link di Instagram, riceve la conferma, salva la prenotazione nel calendario e riceve il promemoria via email.",
  },
};

/** The online bookings ad in a hair salon (owner, 2026-10-22: second tab on the product page, the one on the home). */
const bookingsSalon: ProductAdVariant = {
  id: "salon",
  tab: { pt: "Cabeleireiro", en: "Hair salon", es: "Peluquería", fr: "Salon de coiffure", de: "Friseursalon", it: "Parrucchiere" },
  src: "/home/reservas-cabeleireiro-anuncio-720.mp4",
  poster: "/home/reservas-cabeleireiro-anuncio-720.jpg",
  seconds: 27,
  label: {
    pt: "Anúncio do Sistema de reservas online da Steevanz num cabeleireiro: sábado, o salão cheio e o telefone a tocar enquanto a cabeleireira trabalha; às 23h uma cliente marca pelo link do Instagram «Corte + brushing» com a Ana, terça às 11:00, recebe a confirmação, guarda a marcação no calendário e recebe o lembrete por email.",
    en: "Steevanz online booking system ad at a hair salon: on a Saturday the salon is full and the phone rings while the hairdresser works; at 11 pm a client books «Cut + blow-dry» with Ana, Tuesday at 11:00, from the Instagram link, gets the confirmation, adds the appointment to her calendar and receives the reminder by email.",
    es: "Anuncio del Sistema de reservas online de Steevanz en una peluquería: un sábado, el salón lleno y el teléfono sonando mientras la peluquera trabaja; a las 23 h una clienta reserva desde el enlace de Instagram «Corte + brushing» con Ana, el martes a las 11:00, recibe la confirmación, guarda la cita en el calendario y recibe el recordatorio por email.",
    fr: "Publicité du système de réservation en ligne Steevanz dans un salon de coiffure : un samedi, le salon est plein et le téléphone sonne pendant que la coiffeuse travaille ; à 23 h, une cliente réserve depuis le lien Instagram «Coupe + brushing» avec Ana, mardi à 11:00, reçoit la confirmation, ajoute le rendez-vous à son calendrier et reçoit le rappel par e-mail.",
    de: "Werbespot des Online-Reservierungssystems von Steevanz in einem Friseursalon: An einem Samstag ist der Salon voll und das Telefon klingelt, während die Friseurin arbeitet; um 23 Uhr bucht eine Kundin über den Instagram-Link „Schneiden + Föhnen“ bei Ana, Dienstag um 11:00 Uhr, erhält die Bestätigung, trägt den Termin in ihren Kalender ein und bekommt die Erinnerung per E-Mail.",
    it: "Spot del sistema di prenotazione online di Steevanz in un parrucchiere: il sabato il salone è pieno e il telefono squilla mentre la parrucchiera lavora; alle 23 una cliente prenota dal link di Instagram «Taglio + piega» con Ana, martedì alle 11:00, riceve la conferma, salva l'appuntamento nel calendario e riceve il promemoria via email.",
  },
};

export const productAds: Partial<Record<ProductId, ProductAd>> = {
  "digital-menu": {
    src: "/home/menu-digital-anuncio-720.mp4",
    poster: "/home/menu-digital-anuncio-720.jpg",
    seconds: 23,
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
    seconds: 23,
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
    seconds: 24,
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
    seconds: 25,
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
    seconds: 22,
    label: {
      pt: "Anúncio do Porta-chaves digital da Steevanz: em vez de dizer o número em voz alta ou escrevê-lo num papel, um toque no porta-chaves abre a conversa no WhatsApp e o contacto fica partilhado em privado.",
      en: "Steevanz digital keychain ad: instead of saying your number out loud or writing it on paper, one tap on the keychain opens the WhatsApp chat and the contact is shared privately.",
      es: "Anuncio del Llavero digital de Steevanz: en vez de decir el número en voz alta o escribirlo en un papel, un toque en el llavero abre la conversación de WhatsApp y el contacto se comparte en privado.",
      fr: "Publicité du porte-clés digital Steevanz : au lieu de dire son numéro à voix haute ou de l'écrire sur un papier, un toucher sur le porte-clés ouvre la conversation WhatsApp et le contact est partagé en privé.",
      de: "Werbespot des digitalen Schlüsselanhängers von Steevanz: statt die Nummer laut zu sagen oder auf einen Zettel zu schreiben, öffnet ein Antippen des Anhängers den WhatsApp-Chat und der Kontakt wird privat geteilt.",
      it: "Spot del portachiavi digitale di Steevanz: invece di dire il numero ad alta voce o scriverlo su un foglio, un tocco sul portachiavi apre la chat di WhatsApp e il contatto viene condiviso in privato.",
    },
  },
  waitlist: {
    src: "/home/lista-espera-anuncio-720.mp4",
    poster: "/home/lista-espera-anuncio-720.jpg",
    seconds: 27,
    label: {
      pt: "Anúncio da Lista de espera digital da Steevanz: numa barbearia, sábado de manhã, a espera é longa; o cliente lê o QR à entrada, vê no telemóvel quanto falta e, quando chega a vez, o telemóvel avisa «É a sua vez».",
      en: "Steevanz digital waitlist ad: at a barbershop on a Saturday morning the wait is long; the customer scans the QR at the entrance, sees on the phone how long is left and, when it's their turn, the phone says «It's your turn».",
      es: "Anuncio de la Lista de espera digital de Steevanz: en una barbería, un sábado por la mañana, la espera es larga; el cliente lee el QR en la entrada, ve en el móvil cuánto falta y, cuando llega su turno, el móvil avisa «Es su turno».",
      fr: "Publicité de la liste d'attente digitale Steevanz : dans un salon de barbier, un samedi matin, l'attente est longue ; le client scanne le QR code à l'entrée, voit sur son téléphone combien de temps il reste et, quand c'est son tour, le téléphone affiche «C'est votre tour».",
      de: "Werbespot der digitalen Warteliste von Steevanz: In einem Barbershop ist die Wartezeit an einem Samstagmorgen lang; der Kunde scannt den QR-Code am Eingang, sieht auf dem Handy, wie lange es noch dauert, und wenn er dran ist, meldet das Handy „Sie sind dran“.",
      it: "Spot della lista d'attesa digitale di Steevanz: in un barbiere, il sabato mattina, l'attesa è lunga; il cliente inquadra il QR all'ingresso, vede sul telefono quanto manca e, quando arriva il suo turno, il telefono avvisa «Tocca a Lei».",
    },
  },
  bookings: { ...bookingsRestaurant, variants: [bookingsRestaurant, bookingsSalon], homeVariant: "salon" },
  "ai-chatbot": {
    src: "/home/chatbot-anuncio-720.mp4",
    poster: "/home/chatbot-anuncio-720.jpg",
    seconds: 26,
    label: {
      pt: "Anúncio do Chatbot com IA da Steevanz: num alojamento local, à noite, o anfitrião dorme e os hóspedes chegam; perguntam a password do WiFi em inglês e onde estacionar em francês, e o assistente responde em segundos na língua de cada um; um chuveiro avariado passa para a equipa, com um resumo.",
      en: "Steevanz AI chatbot ad: at a holiday rental at night the host is asleep and the guests arrive; they ask for the WiFi password in English and where to park in French, and the assistant answers in seconds in each one's language; a broken shower is passed on to the team, with a summary.",
      es: "Anuncio del Chatbot con IA de Steevanz: en un alojamiento turístico, de noche, el anfitrión duerme y llegan los huéspedes; preguntan la contraseña del wifi en inglés y dónde aparcar en francés, y el asistente responde en segundos en el idioma de cada uno; una ducha averiada pasa al equipo, con un resumen.",
      fr: "Publicité du chatbot IA Steevanz : dans une location de vacances, la nuit, l'hôte dort et les voyageurs arrivent ; ils demandent le mot de passe du wifi en anglais et où se garer en français, et l'assistant répond en quelques secondes dans la langue de chacun ; une douche en panne est transmise à l'équipe, avec un résumé.",
      de: "Werbespot des KI-Chatbots von Steevanz: In einer Ferienwohnung schläft nachts der Gastgeber, und die Gäste kommen an; sie fragen auf Englisch nach dem WLAN-Passwort und auf Französisch nach einem Parkplatz, und der Assistent antwortet in Sekunden in der Sprache jedes Gastes; eine kaputte Dusche geht mit einer Zusammenfassung an das Team.",
      it: "Spot del chatbot con IA di Steevanz: in una casa vacanze, di notte, l'host dorme e arrivano gli ospiti; chiedono la password del wifi in inglese e dove parcheggiare in francese, e l'assistente risponde in pochi secondi nella lingua di ciascuno; una doccia rotta passa al personale, con un riepilogo.",
    },
  },
  "google-review-plates": {
    src: "/home/placas-avaliacoes-anuncio-720.mp4",
    poster: "/home/placas-avaliacoes-anuncio-720.jpg",
    seconds: 27,
    label: {
      pt: "Anúncio das Placas para avaliações da Steevanz: num restaurante, os clientes contentes saem sem deixar avaliação; com a placa na mesa, um toque ou o QR code abre a avaliação no Google e o cliente dá 5 estrelas; há placas para Google, Tripadvisor e Booking.",
      en: "Steevanz review plates ad: at a restaurant, happy customers leave without writing a review; with the plate on the table, one tap or the QR code opens the Google review and the customer gives 5 stars; there are plates for Google, Tripadvisor and Booking.",
      es: "Anuncio de las Placas para reseñas de Steevanz: en un restaurante, los clientes contentos se van sin dejar reseña; con la placa en la mesa, un toque o el código QR abre la reseña en Google y el cliente da 5 estrellas; hay placas para Google, Tripadvisor y Booking.",
      fr: "Publicité des plaques pour avis Steevanz : dans un restaurant, les clients satisfaits partent sans laisser d'avis ; avec la plaque sur la table, un toucher ou le QR code ouvre l'avis Google et le client donne 5 étoiles ; il existe des plaques pour Google, Tripadvisor et Booking.",
      de: "Werbespot der Bewertungsschilder von Steevanz: In einem Restaurant gehen zufriedene Gäste, ohne eine Bewertung zu schreiben; mit dem Schild auf dem Tisch öffnet ein Antippen oder der QR-Code die Google-Bewertung, und der Gast vergibt 5 Sterne; es gibt Schilder für Google, Tripadvisor und Booking.",
      it: "Spot delle targhe per le recensioni di Steevanz: in un ristorante, i clienti soddisfatti se ne vanno senza lasciare una recensione; con la targa sul tavolo, un tocco o il codice QR apre la recensione su Google e il cliente dà 5 stelle; ci sono targhe per Google, Tripadvisor e Booking.",
    },
  },
};

/** The video's buttons; `close` is the label of the video window's close button (AdVideoModalButton). */
export const adVideoLabels: Localized<{ soundOn: string; soundOff: string; play: string; close: string }> = {
  pt: { soundOn: "Ver com som", soundOff: "Tirar o som", play: "Ver o vídeo", close: "Fechar o vídeo" },
  en: { soundOn: "Watch with sound", soundOff: "Mute", play: "Play video", close: "Close the video" },
  es: { soundOn: "Ver con sonido", soundOff: "Quitar el sonido", play: "Ver el vídeo", close: "Cerrar el vídeo" },
  fr: { soundOn: "Regarder avec le son", soundOff: "Couper le son", play: "Lire la vidéo", close: "Fermer la vidéo" },
  de: { soundOn: "Mit Ton ansehen", soundOff: "Ton aus", play: "Video abspielen", close: "Video schließen" },
  it: { soundOn: "Guardi con l'audio", soundOff: "Disattivi l'audio", play: "Guardi il video", close: "Chiuda il video" },
};

/** The accessible name of the tabs above a product's videos (components/media/AdVideoTabs). */
export const adTabsLabel: Localized<string> = {
  pt: "Escolha o exemplo do anúncio",
  en: "Choose the ad example",
  es: "Elija el ejemplo del anuncio",
  fr: "Choisissez l'exemple de publicité",
  de: "Wählen Sie das Beispiel des Werbespots",
  it: "Scelga l'esempio dello spot",
};
