import type { Localized } from "@/lib/i18n";

// Words of the product-page hero scenes for the «Cartão de visita digital» and the «Porta-chaves digital»
// (components/visuals/CardTapScene.tsx). The card is the real Steevanz example card (/c/rogerio-cabaco).

export interface CardSceneCopy {
  cardAria: string;
  keychainAria: string;
  idle: string;
  chipNoApp: string;
  chipTapQr: string;
  chipSaved: string;
  chipTapOnly: string;
  chipDestinations: string;
  chatName: string;
  chatStatus: string;
  chatBubble: string;
  chatInput: string;
}

export const cardSceneCopy: Localized<CardSceneCopy> = {
  pt: {
    cardAria: "Um telemóvel toca no cartão de visita Steevanz e abre a página de contacto de Rogério Cabaço, com o botão «Guardar contacto».",
    keychainAria: "Um telemóvel toca no porta-chaves digital e abre a conversa de WhatsApp do negócio.",
    idle: "Aproxime o telemóvel",
    chipNoApp: "Sem app",
    chipTapQr: "Toque + QR",
    chipSaved: "Contacto guardado",
    chipTapOnly: "Só um toque",
    chipDestinations: "WhatsApp, Instagram ou site",
    chatName: "O seu negócio",
    chatStatus: "online",
    chatBubble: "Olá! Em que podemos ajudar?",
    chatInput: "Mensagem",
  },
  en: {
    cardAria: "A phone taps the Steevanz business card and opens Rogério Cabaço's contact page, with the «Save contact» button.",
    keychainAria: "A phone taps the digital keychain and opens the business's WhatsApp chat.",
    idle: "Bring your phone close",
    chipNoApp: "No app",
    chipTapQr: "Tap + QR",
    chipSaved: "Contact saved",
    chipTapOnly: "Just one tap",
    chipDestinations: "WhatsApp, Instagram or website",
    chatName: "Your business",
    chatStatus: "online",
    chatBubble: "Hi! How can we help?",
    chatInput: "Message",
  },
  es: {
    cardAria: "Un móvil toca la tarjeta de visita Steevanz y abre la página de contacto de Rogério Cabaço, con el botón «Guardar contacto».",
    keychainAria: "Un móvil toca el llavero digital y abre la conversación de WhatsApp del negocio.",
    idle: "Acerque el móvil",
    chipNoApp: "Sin app",
    chipTapQr: "Toque + QR",
    chipSaved: "Contacto guardado",
    chipTapOnly: "Solo un toque",
    chipDestinations: "WhatsApp, Instagram o web",
    chatName: "Su negocio",
    chatStatus: "en línea",
    chatBubble: "¡Hola! ¿En qué podemos ayudarle?",
    chatInput: "Mensaje",
  },
  fr: {
    cardAria: "Un téléphone touche la carte de visite Steevanz et ouvre la page de contact de Rogério Cabaço, avec le bouton « Enregistrer le contact ».",
    keychainAria: "Un téléphone touche le porte-clés digital et ouvre la conversation WhatsApp de l'établissement.",
    idle: "Approchez le téléphone",
    chipNoApp: "Sans appli",
    chipTapQr: "Toucher + QR",
    chipSaved: "Contact enregistré",
    chipTapOnly: "Un simple toucher",
    chipDestinations: "WhatsApp, Instagram ou site",
    chatName: "Votre établissement",
    chatStatus: "en ligne",
    chatBubble: "Bonjour ! Comment pouvons-nous vous aider ?",
    chatInput: "Message",
  },
  de: {
    cardAria: "Ein Handy tippt die Steevanz-Visitenkarte an und öffnet die Kontaktseite von Rogério Cabaço mit der Schaltfläche „Kontakt speichern“.",
    keychainAria: "Ein Handy tippt den digitalen Schlüsselanhänger an und öffnet den WhatsApp-Chat des Betriebs.",
    idle: "Handy daranhalten",
    chipNoApp: "Ohne App",
    chipTapQr: "Antippen + QR",
    chipSaved: "Kontakt gespeichert",
    chipTapOnly: "Einmal antippen",
    chipDestinations: "WhatsApp, Instagram oder Website",
    chatName: "Ihr Betrieb",
    chatStatus: "online",
    chatBubble: "Hallo! Wie können wir helfen?",
    chatInput: "Nachricht",
  },
  it: {
    cardAria: "Un telefono tocca il biglietto da visita Steevanz e apre la pagina di contatto di Rogério Cabaço, con il pulsante «Salvi il contatto».",
    keychainAria: "Un telefono tocca il portachiavi digitale e apre la chat WhatsApp dell'attività.",
    idle: "Avvicini il telefono",
    chipNoApp: "Senza app",
    chipTapQr: "Tocco + QR",
    chipSaved: "Contatto salvato",
    chipTapOnly: "Basta un tocco",
    chipDestinations: "WhatsApp, Instagram o sito",
    chatName: "La Sua attività",
    chatStatus: "online",
    chatBubble: "Buongiorno! Come possiamo aiutarLa?",
    chatInput: "Messaggio",
  },
};
