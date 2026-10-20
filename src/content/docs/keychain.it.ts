import type { DocPageContent, DocPageId } from "../types";

export const it: Record<DocPageId, DocPageContent> = {
  "getting-started": {
    title: "Primi passi con il portachiavi digitale",
    description: "Che cos'è il portachiavi digitale, che cosa può aprire, quanto costa e come lo usa il cliente con un tocco del telefono.",
    blocks: [
      {
        type: "p",
        text: "Il portachiavi digitale è un piccolo portachiavi per il mazzo di chiavi. Con un tocco del telefono apre il WhatsApp, l'Instagram o il sito web della Sua attività. Funziona su iPhone e Android, senza app.",
      },
      {
        type: "p",
        text: "Pensiamo a tutto noi: configuriamo la destinazione di ogni portachiavi e lo testiamo su iPhone e Android prima della consegna.",
      },
      { type: "h2", id: "cosa-apre", text: "Che cosa può aprire" },
      {
        type: "table",
        head: ["Destinazione", "Che cosa vede il cliente"],
        rows: [
          ["WhatsApp", "Una chat con la Sua attività"],
          ["Instagram", "Il profilo della Sua attività"],
          ["Sito web", "Il Suo sito"],
        ],
      },
      { type: "h2", id: "prezzi", text: "Prezzi" },
      {
        type: "table",
        head: ["Quantità", "Prezzo al pezzo", "Totale"],
        rows: [
          ["1 portachiavi", "5 €", "5 €"],
          ["Confezione da 10", "4,50 €", "45 €"],
          ["Confezione da 25", "4 €", "100 €"],
        ],
      },
      { type: "p", text: "Tutti i prezzi + IVA." },
      { type: "h2", id: "come-funziona", text: "Come funziona per il cliente" },
      {
        type: "ol",
        items: [
          "Il cliente avvicina il telefono al portachiavi.",
          "Si apre subito la destinazione che Lei ha scelto.",
          "Non deve installare nessuna app né cercare il Suo nome.",
        ],
      },
      {
        type: "callout",
        tone: "info",
        title: "Solo con un tocco",
        text: "Il portachiavi non ha QR code. I telefoni molto vecchi, o senza lettura contactless, non riescono ad aprirlo. Per questi casi, il Biglietto da visita digitale e le targhe hanno un QR code.",
      },
      { type: "h2", id: "prossimi-passi", text: "Prossimi passi" },
      {
        type: "ul",
        items: [
          "[Ordine e consegna](/it/docs/digital-keychain/setup): che cosa inviarci e che cosa succede fino all'arrivo dei portachiavi.",
          "[Configurazione](/it/docs/digital-keychain/configuration): come scegliere tra WhatsApp, Instagram e sito web.",
          "[Utilizzo](/it/docs/digital-keychain/usage): a chi regalarli e come spiegarli al cliente.",
        ],
      },
    ],
  },
  setup: {
    title: "Ordine e consegna del portachiavi digitale",
    description: "Che cosa inviarci per ogni destinazione, come scegliere la quantità e che cosa facciamo prima della consegna.",
    blocks: [
      { type: "h2", id: "scegliere-destinazione", text: "1. Scelga la destinazione" },
      {
        type: "p",
        text: "Ogni portachiavi apre una destinazione, scelta al momento dell'ordine. Ci dica quale e ci invii ciò che ci serve:",
      },
      {
        type: "table",
        head: ["Destinazione", "Che cosa inviarci"],
        rows: [
          ["WhatsApp", "Il numero WhatsApp con cui risponde ai clienti"],
          ["Instagram", "Il nome del profilo della Sua attività (la @)"],
          ["Sito web", "L'indirizzo del sito o della pagina da aprire"],
        ],
      },
      { type: "h2", id: "quantita", text: "2. Ci dica quanti" },
      {
        type: "p",
        text: "Può ordinare singoli portachiavi o confezioni da 10 e da 25. Se desidera parlare di personalizzazione, come il Suo logo, ne parliamo insieme durante la demo.",
      },
      { type: "h2", id: "configurare-testare", text: "3. Configuriamo e testiamo" },
      {
        type: "p",
        text: "Configuriamo ogni portachiavi con la Sua destinazione e lo testiamo su iPhone e Android prima della consegna. È pronto in pochi giorni lavorativi; Le indichiamo i tempi esatti durante la demo.",
      },
      {
        type: "callout",
        tone: "tip",
        text: "Quando riceve i portachiavi, ne provi uno con il Suo telefono prima di regalarli.",
      },
    ],
  },
  configuration: {
    title: "Configurazione del portachiavi digitale",
    description: "Come scegliere tra WhatsApp, Instagram e sito web, con consigli per ogni destinazione.",
    blocks: [
      { type: "h2", id: "una-destinazione", text: "Una destinazione per portachiavi" },
      {
        type: "p",
        text: "Ogni portachiavi apre sempre la destinazione scelta nell'ordine. Scelga quella che i Suoi clienti usano di più per contattarLa.",
      },
      { type: "h2", id: "whatsapp", text: "WhatsApp" },
      {
        type: "p",
        text: "Apre una chat con la Sua attività. È la scelta naturale se gestisce appuntamenti, prenotazioni o ordini via messaggio. Usi un numero che qualcuno segue durante la giornata.",
      },
      { type: "h2", id: "instagram", text: "Instagram" },
      {
        type: "p",
        text: "Apre il profilo della Sua attività. Ha senso se pubblica novità, lavori o piatti del giorno e desidera che i clienti La seguano.",
      },
      { type: "h2", id: "sito-web", text: "Sito web" },
      {
        type: "p",
        text: "Apre il Suo sito o una pagina a Sua scelta. Preferisca una pagina che funzioni bene sul telefono.",
      },
      {
        type: "callout",
        tone: "info",
        text: "La personalizzazione del portachiavi, come il Suo logo, è un aspetto che vediamo insieme a Lei durante la demo.",
      },
    ],
  },
  usage: {
    title: "Utilizzo del portachiavi digitale",
    description: "A chi regalare il portachiavi e come spiegare al cliente, in una frase, che cosa fa.",
    blocks: [
      { type: "h2", id: "a-chi-regalarlo", text: "A chi regalarlo" },
      {
        type: "table",
        head: ["Attività", "Come usarlo"],
        rows: [
          ["Bar, ristoranti, saloni e negozi", "Lo regali ai clienti abituali: il Suo WhatsApp o Instagram resta sempre sulle loro chiavi"],
          ["Affitti per vacanze", "Il portachiavi della chiave dell'alloggio apre il WhatsApp dell'host"],
          ["Agenzie immobiliari", "Consegni il portachiavi insieme alle chiavi della nuova casa"],
          ["Team, eventi e fiere", "Un omaggio utile, che resta sulle chiavi invece di finire nel cestino"],
        ],
      },
      { type: "h2", id: "spiegare", text: "Lo spieghi in una frase" },
      {
        type: "p",
        text: "Quando lo consegna, dica per esempio: «Avvicini il telefono a questo portachiavi e ci scrive subito su WhatsApp.» Mostrarlo una volta con il Suo telefono aiuta.",
      },
      {
        type: "callout",
        tone: "tip",
        text: "Se il cliente ha un Android e non si apre al primo tentativo, gli chieda di attivare la lettura contactless nelle impostazioni di connessione.",
      },
    ],
  },
  troubleshooting: {
    title: "Risoluzione dei problemi del portachiavi digitale",
    description: "Che cosa fare quando il tocco non apre nulla o quando un portachiavi apre la destinazione sbagliata.",
    blocks: [
      { type: "h2", id: "tocco-non-apre", text: "Il tocco non apre nulla" },
      {
        type: "ul",
        items: [
          "Sugli iPhone XS e successivi, avvicini la parte alta del telefono al portachiavi, con lo schermo acceso.",
          "Su Android, attivi la lettura contactless nelle impostazioni di connessione.",
          "Se la cover del telefono è spessa, provi senza.",
        ],
      },
      {
        type: "callout",
        tone: "warning",
        title: "Non c'è un QR code",
        text: "Il portachiavi funziona solo con un tocco. I telefoni molto vecchi, o senza lettura contactless, non riescono ad aprirlo. Per questi clienti, il Biglietto da visita digitale e le targhe hanno un QR code.",
      },
      { type: "h2", id: "destinazione-sbagliata", text: "Apre la destinazione sbagliata" },
      {
        type: "p",
        text: "Testiamo ogni portachiavi prima della consegna. Se qualcosa non va, ci scriva via WhatsApp o email, ci dica che cosa dovrebbe aprire e cerchiamo la soluzione insieme a Lei.",
      },
      { type: "h2", id: "altri-portachiavi", text: "Le servono altri portachiavi" },
      {
        type: "p",
        text: "Può ordinarne altri quando desidera, singoli o in confezione. Ci scriva via WhatsApp o email.",
      },
    ],
  },
  faq: {
    title: "Domande frequenti sul portachiavi digitale",
    description: "Risposte rapide su telefoni compatibili, QR code, destinazioni, prezzi e tempi.",
    blocks: [
      {
        type: "faq",
        items: [
          {
            q: "Funziona su iPhone e su Android?",
            a: "Sì, senza app. Sugli iPhone XS e successivi basta avvicinare la parte alta del telefono. La maggior parte degli Android lo legge se la lettura contactless è attiva nelle impostazioni di connessione.",
          },
          {
            q: "Ha un QR code?",
            a: "No, funziona solo con un tocco. I telefoni molto vecchi, o senza lettura contactless, non riescono ad aprirlo. Se Le serve un QR code, il Biglietto da visita digitale e le targhe ne hanno uno.",
          },
          {
            q: "Che cosa apre?",
            a: "Una destinazione per portachiavi, scelta al momento dell'ordine: una chat WhatsApp con la Sua attività, il Suo Instagram o il Suo sito web.",
          },
          {
            q: "Quanto costa?",
            a: "5 € + IVA al pezzo. In confezione, 10 per 45 € e 25 per 100 €, + IVA.",
          },
          {
            q: "Quanto tempo serve?",
            a: "Pochi giorni lavorativi. Le indichiamo i tempi esatti durante la demo.",
          },
          {
            q: "Che differenza c'è con il Biglietto da visita digitale?",
            a: "Il biglietto apre una pagina di contatti completa e ha un QR code. Il portachiavi è più piccolo e più semplice: apre direttamente un'unica destinazione.",
          },
        ],
      },
    ],
  },
};
