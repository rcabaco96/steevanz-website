import type { DocPageContent, DocPageId } from "../types";

export const it: Record<DocPageId, DocPageContent> = {
  "getting-started": {
    title: "Primi passi con il menù digitale",
    description:
      "Come funziona il menù in video di Steevanz: un video per piatto, con il suo prezzo, aperto con un tocco o con il codice QR della targa sul tavolo, con gli ordini al tavolo se li desidera.",
    blocks: [
      {
        type: "p",
        text: "Il menù digitale è il menù del Suo locale in video. Ogni piatto ha il suo video verticale, con nome, prezzo e descrizione, su una pagina tutta del Suo locale. I clienti lo aprono con un tocco o con il codice QR della targa rotonda su ogni tavolo, senza installare nulla.",
      },
      {
        type: "p",
        text: "Come tutti i prodotti Steevanz, è un servizio gestito: prepariamo il menù, ospitiamo i video e programmiamo e proviamo le targhe. Questa documentazione La aiuta a preparare i video e a sfruttare al massimo il menù.",
      },
      { type: "h2", id: "whats-included", text: "Cosa include" },
      {
        type: "table",
        head: ["Elemento", "Dettagli"],
        rows: [
          ["Menù in video", "La pagina del Suo locale con il Suo logo, le collezioni e un video verticale per piatto, con nome, prezzo e descrizione"],
          ["Ordini al tavolo (opzionale)", "Il tavolo ordina dal telefono e il Suo staff conferma inquadrando un codice QR"],
          ["Sei lingue", "Portoghese, inglese, spagnolo, francese, tedesco e italiano: ogni cliente sceglie la sua con il pulsante della bandiera"],
          ["Targa rotonda", "Adesivo rotondo da tavolo o base rotonda da tavolo, una per tavolo"],
          ["Codice QR stampato", "Per i telefoni che non leggono con un tocco o che hanno questa opzione disattivata"],
          ["Preparazione e hosting", "Prepariamo il menù e ospitiamo il menù e i video"],
          ["Guida alle riprese", "Una guida per girare i video dei piatti con il telefono"],
        ],
      },
      { type: "h2", id: "pricing", text: "Prezzi" },
      {
        type: "table",
        head: ["Quantità", "Prezzo", "Per targa"],
        rows: [
          ["Da 1 a 9 targhe", "20 € l'una", "20 €"],
          ["10 targhe o più", "15 € l'una (10 targhe: 150 €)", "15 €"],
        ],
      },
      {
        type: "p",
        text: "Il logo e i colori del Suo marchio si pagano una sola volta per ordine (il design si fa una volta per tutte le targhe), non per targa. La preparazione del menù e l'hosting del menù e dei video costano 30 € al mese + IVA.",
      },
      { type: "h2", id: "how-it-works", text: "Come funziona" },
      {
        type: "ol",
        items: [
          "Il cliente si siede e tocca la targa con il telefono (o inquadra il codice QR).",
          "Il menù si apre con un'animazione del Suo logo, in cima alla pagina.",
          "I piatti scorrono in una griglia. Un tocco li apre a schermo intero, come nei Reels, e si scorre su e giù per vedere gli altri.",
          "Con gli ordini al tavolo attivi, il cliente tocca «Aggiunga» sui piatti e ordina direttamente da lì.",
        ],
      },
      { type: "h2", id: "next-steps", text: "Prossimi passi" },
      {
        type: "ul",
        items: [
          "[Installazione](/it/docs/digital-menu/setup): girare i video, inviarci il menù e posizionare le targhe.",
          "[Configurazione](/it/docs/digital-menu/configuration): cambiare piatti e prezzi e attivare gli ordini al tavolo.",
          "[Utilizzo](/it/docs/digital-menu/usage): video che funzionano e gli ordini al tavolo nel lavoro di ogni giorno.",
        ],
      },
    ],
  },
  setup: {
    title: "Installare il menù digitale",
    description: "Giri i video dei Suoi piatti, ci invii il menù e posizioni le targhe sui tavoli.",
    blocks: [
      { type: "h2", id: "film-videos", text: "1. Girare i video" },
      {
        type: "p",
        text: "Ogni piatto ha il suo video. Li giri con il telefono, in verticale: Le diamo una guida per girare i video.",
      },
      {
        type: "steps",
        items: [
          { title: "Un video per piatto", body: "In verticale, con il piatto esattamente come arriva in tavola." },
          { title: "Niente testo sopra", body: "Non serve scrivere il nome o il prezzo sul video: il menù li mostra in sovrimpressione." },
          { title: "Breve", body: "Bastano pochi secondi per mostrare il piatto. I video brevi catturano meglio l'attenzione." },
        ],
      },
      { type: "h2", id: "send-menu", text: "2. Inviarci il menù" },
      {
        type: "p",
        text: "Ci invii i video e, per ogni piatto, il nome, il prezzo e una breve descrizione, ordinati nelle collezioni che desidera (per esempio Brunch e Bevande). Ci invii anche il Suo logo. Prepariamo il menù e, prima di metterlo sui tavoli, Le mostriamo il risultato.",
      },
      {
        type: "callout",
        tone: "tip",
        title: "Ordini al tavolo",
        text: "Se desidera che i tavoli ordinino dal telefono, ci dica quanti tavoli ha. Ogni tavolo riceve la sua targa, con il suo link e il suo codice QR.",
      },
      { type: "h2", id: "place-plates", text: "3. Posizionare le targhe" },
      {
        type: "ul",
        items: [
          "Una targa per tavolo, in un punto visibile e a portata di mano (al centro del tavolo o accanto al portatovaglioli).",
          "Con gli ordini al tavolo, ogni targa appartiene a un tavolo: metta ciascuna sul suo tavolo.",
          "Pulisca la superficie prima di applicare l'adesivo e prema per qualche secondo.",
          "Eviti le superfici metalliche: il metallo blocca il segnale della targa. In quel caso usi la base rotonda da tavolo.",
        ],
      },
    ],
  },
  configuration: {
    title: "Configurare il menù digitale",
    description: "Cambi piatti, prezzi e collezioni, e attivi o disattivi gli ordini al tavolo.",
    blocks: [
      { type: "h2", id: "dishes-prices", text: "Cambiare piatti e prezzi" },
      {
        type: "p",
        text: "Il menù è gestito da Steevanz. Per cambiare un prezzo, aggiungere o togliere un piatto, sostituire un video o riorganizzare le collezioni, ci mandi un messaggio: aggiorniamo il menù e le targhe restano le stesse.",
      },
      { type: "h2", id: "collections", text: "Collezioni" },
      {
        type: "p",
        text: "I piatti sono raggruppati in collezioni, per esempio Brunch e Bevande. Sono tutte sulla stessa pagina, una sezione dopo l'altra, e il pulsante ☰ porta il cliente direttamente a ciascuna.",
      },
      { type: "h2", id: "languages", text: "Lingue" },
      {
        type: "p",
        text: "Il menù si legge in sei lingue: portoghese, inglese, spagnolo, francese, tedesco e italiano. Si apre nella lingua del telefono del cliente (o in quella che ha scelto l'ultima volta), e il pulsante della bandiera, accanto a ☰, cambia lingua senza ricaricare la pagina, con i video che continuano a scorrere. I pulsanti del menù e gli ordini al tavolo sono già tradotti; i nomi e le descrizioni dei piatti e i nomi delle sezioni si traducono piatto per piatto, e ciò che non ha traduzione appare in portoghese. I prezzi appaiono nel formato di ogni lingua.",
      },
      { type: "h2", id: "table-ordering", text: "Ordini al tavolo" },
      {
        type: "p",
        text: "Gli ordini al tavolo si attivano o disattivano menù per menù. Senza di essi, la targa apre il menù solo per consultarlo. Ogni tavolo ha la sua targa, con il suo link e il suo codice QR; se Le servono più tavoli, basta chiedercelo.",
      },
      {
        type: "callout",
        tone: "warning",
        text: "Se il codice di un tavolo viene cambiato, il vecchio link smette di funzionare e la targa di quel tavolo va sostituita.",
      },
      { type: "h2", id: "customisation", text: "Personalizzazione" },
      {
        type: "p",
        text: "Il menù porta il Suo logo. Le targhe possono portare il Suo logo, i colori del Suo marchio e un breve testo, per esempio «Tocchi per vedere il menù». Il design delle targhe si fa una volta per ordine.",
      },
    ],
  },
  usage: {
    title: "Usare il menù digitale",
    description: "Buone pratiche perché il menù digitale aiuti i clienti a scegliere, e gli ordini al tavolo nel lavoro di ogni giorno.",
    blocks: [
      { type: "h2", id: "videos-that-work", text: "Video che funzionano" },
      {
        type: "ul",
        items: [
          "Mostri il piatto esattamente come arriva in tavola, con una buona luce.",
          "Giri sempre in verticale: è così che il menù mostra i video.",
          "I video brevi catturano l'attenzione meglio di quelli lunghi.",
          "Metta per primi i piatti più ordinati, o quelli che vuole vendere di più.",
        ],
      },
      { type: "h2", id: "ordering-day-to-day", text: "Gli ordini al tavolo ogni giorno" },
      {
        type: "ol",
        items: [
          "Tutti i telefoni del tavolo vedono lo stesso ordine in tempo reale. Ognuno tocca «Aggiunga» sui piatti e può aggiungere una nota, come «senza cipolla».",
          "Con «Ordini», il telefono mostra un codice QR e il numero dell'ordine.",
          "Il Suo staff inquadra il codice QR con la fotocamera del telefono, senza app né login, e vede il tavolo, l'ora, i piatti con le loro note e il totale. Questa pagina è sempre in portoghese e indica la lingua in cui il cliente ha ordinato.",
          "Lo staff tocca «Confirmar pedido» (conferma ordine) e il tavolo vede subito «Ordine confermato ✓».",
        ],
      },
      {
        type: "callout",
        tone: "info",
        text: "I numeri degli ordini ripartono ogni giorno.",
      },
      { type: "h2", id: "team", text: "Il Suo staff" },
      {
        type: "p",
        text: "Dica ai clienti, quando si siedono, che possono vedere i piatti sul telefono. Un invito dello staff aumenta molto il numero di tocchi.",
      },
      { type: "h2", id: "pair-with-reviews", text: "Lo abbini alle recensioni Google" },
      {
        type: "p",
        text: "Sullo stesso tavolo, la targa delle recensioni Google chiede una recensione a fine pasto. Il menù aiuta a scegliere all'inizio; le recensioni aiutano nuovi clienti a trovare il Suo locale.",
      },
    ],
  },
  troubleshooting: {
    title: "Risoluzione dei problemi del menù digitale",
    description: "Cosa fare quando una targa non apre il menù o un ordine non arriva.",
    blocks: [
      {
        type: "table",
        head: ["Problema", "Cosa fare"],
        rows: [
          ["Il telefono non reagisce al tocco", "Verifichi che la lettura contactless (un tocco) sia attiva nelle impostazioni di connessione (Android) e avvicini la parte alta del telefono al centro della targa. Oppure inquadri il codice QR."],
          ["La targa apre una pagina che non esiste", "Il codice del tavolo potrebbe essere stato cambiato o il menù disattivato. Ci contatti."],
          ["I video tardano a partire", "Verifichi la connessione internet del telefono (Wi-Fi o dati mobili). Se succede sempre, ce lo faccia sapere."],
          ["Lo staff non riesce a inquadrare il QR dell'ordine", "Chieda al cliente di alzare la luminosità dello schermo e avvicini la fotocamera al codice."],
          ["La targa non funziona sul metallo", "Sostituisca l'adesivo con la base rotonda da tavolo."],
          ["I prezzi non sono aggiornati", "Ci invii i nuovi prezzi: aggiorniamo il menù e le targhe restano le stesse."],
        ],
      },
      {
        type: "callout",
        tone: "info",
        text: "Se una targa si rompe, ci contatti: la sostituiamo.",
      },
    ],
  },
  faq: {
    title: "Domande frequenti sul menù digitale",
    description: "Risposte rapide sul menù in video, sugli ordini al tavolo e sulle targhe.",
    blocks: [
      {
        type: "faq",
        items: [
          { q: "I clienti devono installare un'app?", a: "No. Il menù si apre nel browser del telefono. Né i clienti né il Suo staff hanno bisogno di un'app." },
          { q: "Mi servono Instagram o YouTube?", a: "No. Il menù ha la sua pagina su Steevanz e i video li ospitiamo noi." },
          { q: "Funziona su iPhone e Android?", a: "Sì. Gli iPhone recenti leggono la targa senza attivare nulla; su Android, l'opzione di lettura contactless (un tocco) deve essere attiva. C'è sempre il codice QR stampato." },
          { q: "Sostituisce il menù cartaceo?", a: "Lo completa. Vedere i piatti in video aiuta a scegliere, ma il menù cartaceo resta utile per chi lo preferisce." },
          { q: "Quanto costa?", a: "20 € per targa, o 15 € per targa a partire da 10 targhe. Il logo si paga una volta per ordine. La preparazione e l'hosting del menù costano 30 € al mese + IVA." },
          { q: "Chi gira i video?", a: "Di solito il locale stesso, con il telefono: Le diamo una guida per girare i video. Noi prepariamo il menù e ospitiamo i video." },
          { q: "In quali lingue è il menù?", a: "In sei: portoghese, inglese, spagnolo, francese, tedesco e italiano. Il menù si apre nella lingua del telefono e il cliente la cambia con il pulsante della bandiera. Ciò che non è ancora tradotto appare in portoghese." },
          { q: "Gli ordini al tavolo sono obbligatori?", a: "No. Si attivano o disattivano menù per menù. Senza di essi, la targa apre il menù solo per consultarlo." },
          { q: "Posso cambiare il menù più avanti?", a: "Sì, senza cambiare le targhe. Ci invii i nuovi piatti, prezzi o video e aggiorniamo il menù." },
        ],
      },
    ],
  },
};
