import type { DocPageContent, DocPageId } from "../types";

export const it: Record<DocPageId, DocPageContent> = {
  "getting-started": {
    title: "Primi passi con la guida digitale dell'alloggio",
    description:
      "Cos'è la guida digitale dell'alloggio, cosa include, quanto costa e come gli ospiti la aprono con un tocco su una targa all'interno dell'alloggio.",
    blocks: [
      {
        type: "p",
        text: "La guida digitale dell'alloggio è una pagina per il telefono con tutto ciò che gli ospiti devono sapere durante il soggiorno: Wi-Fi, check-in e check-out, regole della casa, elettrodomestici, rifiuti, emergenze e i vostri consigli. È in portoghese, inglese e altre due lingue, e si apre con un tocco su una targa posizionata all'interno dell'alloggio, oppure con il codice QR stampato sulla stessa targa.",
      },
      {
        type: "p",
        text: "È un servizio chiavi in mano: scriviamo, traduciamo, pubblichiamo e teniamo aggiornata la guida. Non c'è nulla da installare né un nuovo strumento da imparare.",
      },
      { type: "h2", id: "whats-included", text: "Cosa include" },
      {
        type: "table",
        head: ["Elemento", "Dettagli"],
        rows: [
          ["Scrittura della guida", "Trasformiamo i vostri appunti, le foto o la guida attuale in una pagina chiara, organizzata per argomento"],
          ["Quattro lingue", "Portoghese, inglese e altre due a scelta (francese, spagnolo, tedesco o italiano), controllate da noi"],
          ["Targa da toccare", "Targa da parete, espositore o adesivo, con codice QR, da posizionare all'interno dell'alloggio"],
          ["Versione stampabile", "Un PDF con lo stesso contenuto, per lasciare una copia cartacea nell'alloggio"],
          ["12 mesi online", "Hosting della pagina e modifiche fatte da noi entro due giorni lavorativi"],
        ],
      },
      { type: "h2", id: "pricing", text: "Prezzi" },
      {
        type: "table",
        head: ["Quantità", "Prezzo per alloggio", "Totale"],
        rows: [
          ["1 alloggio", "69 €", "69 €"],
          ["Da 3", "59 €", "177 € (3)"],
          ["Da 5", "55 €", "275 € (5)"],
          ["Da 10", "49 €", "490 € (10)"],
        ],
      },
      {
        type: "p",
        text: "Dal 13° mese, mantenere la guida online con le modifiche incluse costa 3 € al mese per alloggio. Le targhe aggiuntive per lo stesso alloggio e le lingue in più hanno un piccolo costo, indicato nel vostro preventivo. Prezzi + IVA, indicativi e confermati dopo la demo.",
      },
      { type: "h2", id: "how-it-works", text: "Come funziona per gli ospiti" },
      {
        type: "ol",
        items: [
          "L'ospite entra e avvicina il telefono alla targa (o inquadra il codice QR).",
          "La guida si apre nella lingua del telefono, con un pulsante per cambiare lingua.",
          "Trova il Wi-Fi (con un pulsante per copiare la password), le regole della casa e i vostri consigli senza dovervi scrivere.",
        ],
      },
      {
        type: "callout",
        tone: "info",
        title: "Cosa la guida non contiene mai",
        text: "I codici della porta, della cassetta delle chiavi o dell'allarme. Quelli continuano a partire nel vostro messaggio di check-in.",
      },
      { type: "h2", id: "next-steps", text: "Prossimi passi" },
      {
        type: "ul",
        items: [
          "[Installazione](/it/docs/digital-guest-guide/setup): quali informazioni inviarci e dove mettere la targa.",
          "[Configurazione](/it/docs/digital-guest-guide/configuration): lingue, sezioni e come chiedere modifiche.",
          "[Utilizzo](/it/docs/digital-guest-guide/usage): buone pratiche perché gli ospiti leggano davvero la guida.",
        ],
      },
    ],
  },
  setup: {
    title: "Installare la guida digitale dell'alloggio",
    description: "Le informazioni che ci servono per scrivere la guida, come approvate la bozza e dove mettere la targa all'interno dell'alloggio.",
    blocks: [
      { type: "h2", id: "send-information", text: "1. Inviateci le informazioni" },
      {
        type: "p",
        text: "Inviatecele come vi è più comodo: un documento, delle foto, la guida cartacea che avete già o un vocale su WhatsApp. Le organizziamo noi.",
      },
      {
        type: "table",
        head: ["Argomento", "Cosa dirci"],
        rows: [
          ["Check-in e check-out", "Orari, come lasciare le chiavi, cosa fare con rifiuti e biancheria"],
          ["Wi-Fi", "Nome della rete e password"],
          ["L'alloggio", "Come funzionano piano cottura, forno, lavatrice, riscaldamento, aria condizionata e acqua calda"],
          ["Regole", "Regole della casa e del condominio, orari di silenzio, fumo, animali, feste"],
          ["Rifiuti e raccolta differenziata", "Dove sono i cassonetti e come differenziare i rifiuti"],
          ["Come arrivare e parcheggiare", "Dall'aeroporto e dalla stazione, parcheggio e trasporti pubblici"],
          ["Emergenze", "Il vostro contatto, la farmacia, l'ospedale e il centro sanitario più vicini"],
          ["Consigli", "Ristoranti, spiagge, passeggiate e negozi che consigliate"],
          ["Dati legali", "Numero di registrazione (RNAL)"],
        ],
      },
      {
        type: "callout",
        tone: "warning",
        title: "Non inviateci codici di accesso",
        text: "I codici della porta, della cassetta delle chiavi e dell'allarme non entrano mai nella guida. Se per errore ce ne arriva uno, non lo pubblichiamo.",
      },
      { type: "h2", id: "approve", text: "2. Approvate la bozza" },
      {
        type: "p",
        text: "Entro circa tre giorni lavorativi vi inviamo un link alla bozza in portoghese e nelle altre lingue. Chiedete tutte le correzioni che volete. Pubblichiamo solo dopo la vostra approvazione.",
      },
      { type: "h2", id: "place-plate", text: "3. Posizionate la targa" },
      {
        type: "p",
        text: "La targa arriva programmata e provata entro due-quattro giorni lavorativi. Posizionatela all'interno dell'alloggio, in un punto che gli ospiti vedono appena entrano.",
      },
      {
        type: "table",
        head: ["Formato", "Dove funziona meglio"],
        rows: [
          ["Targa da parete", "Accanto alla porta d'ingresso, all'interno"],
          ["Espositore", "Sul tavolo del soggiorno, sul piano della cucina o alla reception"],
          ["Adesivo", "Sul frigorifero o sullo specchio dell'ingresso"],
        ],
      },
      {
        type: "callout",
        tone: "tip",
        text: "Evitate la porta esterna: la guida contiene la password del Wi-Fi e deve essere alla portata solo di chi soggiorna lì.",
      },
    ],
  },
  configuration: {
    title: "Configurare la guida digitale dell'alloggio",
    description: "Lingue, sezioni della guida, la sezione «Valuta il tuo soggiorno», il link al vostro sito e come chiedere modifiche.",
    blocks: [
      { type: "h2", id: "languages", text: "Lingue" },
      {
        type: "p",
        text: "La guida include portoghese, inglese e altre due lingue a vostra scelta tra francese, spagnolo, tedesco e italiano. Si apre automaticamente nella lingua del telefono dell'ospite e ha un selettore. Se vi servono più lingue, includiamo il costo nel vostro preventivo.",
      },
      { type: "h2", id: "sections", text: "Sezioni" },
      {
        type: "ul",
        items: [
          "Benvenuto",
          "Check-in e check-out",
          "Wi-Fi, con un pulsante per copiare la password",
          "Come funziona l'alloggio: elettrodomestici, riscaldamento, aria condizionata e acqua calda",
          "Regole della casa e del condominio",
          "Rifiuti e raccolta differenziata",
          "Rumore e vicini",
          "Emergenze: 112, il vostro contatto, farmacia, ospedale e centro sanitario",
          "Come arrivare e parcheggiare",
          "Consigli dell'host",
          "Tassa di soggiorno: cos'è e perché si paga",
          "Valuta il tuo soggiorno",
          "Libro dei reclami e numero di registrazione",
        ],
      },
      {
        type: "p",
        text: "Insieme, queste sezioni includono i contenuti che la legge portoghese richiede nel libro informativo di un alloggio per affitti brevi (alojamento local): funzionamento dell'alloggio, regole, rifiuti, elettrodomestici, rumore, regole del condominio e contatto del responsabile, in portoghese, inglese e altre due lingue.",
      },
      { type: "h2", id: "review-your-stay", text: "La sezione «Valuta il tuo soggiorno»" },
      {
        type: "p",
        text: "È uguale per tutti gli ospiti: spiega che Booking.com invia la richiesta di recensione via e-mail e Airbnb nell'app (in Viaggi), dopo il check-out, e che la loro opinione aiuta altri viaggiatori. Non offre sconti né regali e non chiede un punteggio preciso, perché le piattaforme lo vietano. Se il vostro alloggio ha un profilo Google, possiamo aggiungere il link di Google.",
      },
      { type: "h2", id: "website", text: "Link al vostro sito" },
      {
        type: "p",
        text: "Se avete un sito vostro, possiamo mostrare un discreto link «Sito ufficiale». È disattivato per impostazione predefinita: Airbnb vieta di incoraggiare gli ospiti a prenotare fuori dalla piattaforma, quindi non usiamo mai frasi come «prenota direttamente e risparmia».",
      },
      { type: "h2", id: "changes", text: "Chiedere modifiche" },
      {
        type: "p",
        text: "Inviateci cosa è cambiato via WhatsApp o e-mail. Aggiorniamo la guida e il PDF entro due giorni lavorativi, in tutte le lingue. La targa non va mai sostituita.",
      },
    ],
  },
  usage: {
    title: "Usare la guida digitale dell'alloggio",
    description: "Buone pratiche perché gli ospiti trovino e usino la guida, e come funziona insieme all'assistente WhatsApp.",
    blocks: [
      { type: "h2", id: "let-guests-know", text: "Fate conoscere la guida agli ospiti" },
      {
        type: "ul",
        items: [
          "Citatela nel vostro messaggio di check-in: «Quando arrivate, toccate la targa accanto alla porta per il Wi-Fi e tutto sulla casa».",
          "Posizionate la targa dove si vede subito.",
          "Lasciate la versione stampata in un cassetto o sul tavolo del soggiorno per gli ospiti che preferiscono la carta.",
        ],
      },
      { type: "h2", id: "recommendations", text: "Consigli che fanno la differenza" },
      {
        type: "p",
        text: "Gli ospiti apprezzano ciò che solo chi è del posto conosce: il forno del quartiere, la spiaggia più tranquilla, il ristorante senza turisti. Da cinque a dieci consigli ben scelti valgono più di una lunga lista.",
      },
      { type: "h2", id: "assistant", text: "Con l'assistente WhatsApp" },
      {
        type: "p",
        text: "Se avete anche l'assistente IA, il contenuto della guida è la sua base di conoscenza. Quando un ospite chiede su WhatsApp, riceve la stessa risposta che c'è nella guida, nella sua lingua. Nemmeno l'assistente condivide mai i codici di accesso.",
      },
      { type: "h2", id: "several-properties", text: "Più alloggi" },
      {
        type: "p",
        text: "Ogni alloggio ha la sua guida e la sua targa. Per i gestori, manteniamo lo stesso aspetto per tutti e applichiamo in una sola volta le modifiche comuni, come nuove regole del condominio o un diverso contatto di emergenza.",
      },
    ],
  },
  troubleshooting: {
    title: "Risoluzione dei problemi della guida digitale dell'alloggio",
    description: "Cosa fare quando un ospite non riesce ad aprire la guida con un tocco o quando un'informazione non è aggiornata.",
    blocks: [
      { type: "h2", id: "tap-does-not-open", text: "Il tocco non apre la guida" },
      {
        type: "ul",
        items: [
          "Su iPhone XS e modelli più recenti, basta avvicinare la parte alta del telefono alla targa con lo schermo acceso.",
          "Su Android, la lettura contactless (un tocco) deve essere attiva nelle impostazioni. Molti telefoni la hanno già attiva.",
          "Le cover spesse o metalliche possono bloccare la lettura. In quel caso, l'ospite usa il codice QR.",
        ],
      },
      {
        type: "callout",
        tone: "tip",
        text: "Ogni targa ha un codice QR stampato. Chi non riesce ad aprirla con un tocco inquadra con la fotocamera e arriva alla stessa guida.",
      },
      { type: "h2", id: "outdated-information", text: "Un'informazione non è aggiornata" },
      {
        type: "p",
        text: "Inviateci la correzione via WhatsApp o e-mail. La aggiorniamo entro due giorni lavorativi. Nei casi urgenti, come una password del Wi-Fi sbagliata, avvisateci e le diamo la precedenza.",
      },
      { type: "h2", id: "damaged-plate", text: "La targa si è rotta o è sparita" },
      {
        type: "p",
        text: "Ve ne inviamo una nuova con lo stesso indirizzo, quindi la guida resta la stessa. Una targa aggiuntiva per lo stesso alloggio ha un piccolo costo, indicato nel vostro preventivo.",
      },
      { type: "h2", id: "shared-link", text: "Il link è stato condiviso fuori dall'alloggio" },
      {
        type: "p",
        text: "L'indirizzo della guida è privato e impossibile da indovinare, ma un ospite potrebbe salvarlo. Se cambiate la password del Wi-Fi o volete un nuovo indirizzo, ditecelo: ne creiamo uno e riprogrammiamo la targa.",
      },
    ],
  },
  faq: {
    title: "Domande frequenti sulla guida digitale dell'alloggio",
    description: "Risposte rapide su prezzi, lingue, sicurezza, recensioni e la targa obbligatoria degli affitti brevi.",
    blocks: [
      {
        type: "faq",
        items: [
          {
            q: "Quanto costa dopo il primo anno?",
            a: "3 € al mese per alloggio, per mantenere la guida online con le modifiche incluse. Con il pacchetto Affitti brevi, la guida è inclusa finché il pacchetto è attivo.",
          },
          {
            q: "La guida vale come libro informativo richiesto dalla legge?",
            a: "La guida include i contenuti che la legge chiede nel libro informativo, in portoghese, inglese e altre due lingue, e vi consegniamo una versione stampabile che consigliamo di tenere nell'alloggio.",
          },
          {
            q: "La guida sostituisce la targa obbligatoria degli affitti brevi?",
            a: "No. La targa identificativa con il vostro numero di registrazione segue un modello ufficiale stabilito dalla legge. La guida mostra il vostro numero di registrazione, ma non sostituisce quella targa.",
          },
          {
            q: "La guida raccoglie dati degli ospiti?",
            a: "No. La guida non ha moduli e non chiede dati personali. Si conservano solo i normali log tecnici del server.",
          },
          {
            q: "Posso chiedere recensioni tramite la guida?",
            a: "La guida ha una sezione neutra che spiega dove lasciare una recensione, uguale per tutti e senza offrire nulla in cambio, come richiedono Booking.com e Airbnb.",
          },
          {
            q: "Vi occupate delle comunicazioni degli ospiti al SIBA?",
            a: "No. Se volete promemoria delle scadenze, se ne occupa l'automazione «Pulizie e scadenze». Per l'invio automatico, consigliamo strumenti specializzati come Chekin o Hostkit.",
          },
        ],
      },
    ],
  },
};
