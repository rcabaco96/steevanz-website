import type { DocPageContent, DocPageId } from "../types";

export const it: Record<DocPageId, DocPageContent> = {
  "getting-started": {
    title: "Primi passi con il biglietto da visita digitale",
    description:
      "Cos'è il biglietto da visita digitale, cosa include, quanto costa e come chi lo riceve salva il Suo contatto con un tocco del telefono.",
    blocks: [
      {
        type: "p",
        text: "Il biglietto da visita digitale è una card in PVC, del formato di una carta di credito, con il Suo nome, il Suo ruolo, i Suoi contatti e il logo della Sua azienda. Con un tocco del telefono sul biglietto, oppure inquadrando il codice QR stampato sopra, la persona apre la Sua pagina di contatto digitale e salva il Suo contatto.",
      },
      {
        type: "p",
        text: "È un servizio chiavi in mano: progettiamo il biglietto, creiamo la pagina e la teniamo aggiornata. Funziona su iPhone e Android e nessuno deve installare un'app.",
      },
      { type: "h2", id: "cosa-include", text: "Cosa include" },
      {
        type: "table",
        head: ["Elemento", "Dettagli"],
        rows: [
          ["Card in PVC", "Formato carta di credito (85,6 × 54 mm), stampata fronte e retro con la qualità Steevanz"],
          ["Personalizzazione", "Il Suo nome, ruolo, contatti e il logo dell'azienda, inclusi nel prezzo"],
          ["Pagina di contatto digitale", "Veloce, pensata per il telefono, con il pulsante «Salvi il contatto»"],
          ["Tocco o QR", "Si apre con un tocco del telefono o con il codice QR stampato sul biglietto, su iPhone e Android, senza app"],
          ["Modifiche fatte da noi", "Se i Suoi dati cambiano, aggiorniamo la pagina e il biglietto continua a funzionare"],
        ],
      },
      { type: "h2", id: "prezzi", text: "Prezzi" },
      {
        type: "table",
        head: ["Quantità", "Prezzo per biglietto", "Totale"],
        rows: [
          ["1 biglietto", "10 €", "10 €"],
          ["Da 10", "9 €", "90 € (10)"],
          ["Da 25", "8 €", "200 € (25)"],
          ["Da 50", "7 €", "350 € (50)"],
        ],
      },
      {
        type: "p",
        text: "In un pacchetto può unire biglietti di più persone della stessa azienda, ognuna con la propria pagina. Prezzi + IVA, indicativi e confermati dopo la demo.",
      },
      { type: "h2", id: "come-funziona", text: "Come funziona per chi avvicina il telefono" },
      {
        type: "ol",
        items: [
          "Lei mostra il biglietto e la persona avvicina il telefono (o inquadra il codice QR con la fotocamera).",
          "Si apre la Sua pagina di contatto, con la Sua foto, nome, ruolo e azienda.",
          "Con il pulsante «Salvi il contatto», i Suoi dati finiscono nei contatti del suo telefono, senza scrivere nulla a mano.",
        ],
      },
      {
        type: "callout",
        tone: "info",
        title: "Veda un esempio",
        text: "La pagina di contatto del fondatore di Steevanz: www.steevanz.com/c/rogerio-cabaco",
      },
      { type: "h2", id: "prossimi-passi", text: "Prossimi passi" },
      {
        type: "ul",
        items: [
          "[Installazione](/it/docs/digital-business-card/setup): quali dati inviarci e come approvare il biglietto.",
          "[Configurazione](/it/docs/digital-business-card/configuration): cosa mostra la pagina, il pulsante «Salvi il contatto» e come chiedere modifiche.",
          "[Utilizzo](/it/docs/digital-business-card/usage): come presentare il biglietto agli incontri, alle fiere e al banco.",
        ],
      },
    ],
  },
  setup: {
    title: "Installare il biglietto da visita digitale",
    description: "I dati che ci servono per il biglietto e la pagina, come approva la grafica e come riceve i biglietti già testati.",
    blocks: [
      { type: "h2", id: "inviare-dati", text: "1. Ci invii i Suoi dati" },
      {
        type: "p",
        text: "Ce li invii via WhatsApp o email, come Le è più comodo. Se i biglietti sono per più persone dell'azienda, ci invii i dati di ciascuna.",
      },
      {
        type: "table",
        head: ["Dato", "A cosa serve"],
        rows: [
          ["Nome", "Come desidera che compaia sul biglietto e sulla pagina"],
          ["Ruolo", "Compare sotto il nome"],
          ["Telefono", "Per i pulsanti «Chiami» e «WhatsApp»"],
          ["Email", "Per il pulsante «Email»"],
          ["Sito web", "Per il pulsante «Sito web»"],
          ["Social network", "Instagram, LinkedIn o altri che desidera mostrare"],
          ["Indirizzo (facoltativo)", "Mostrato con un link alla mappa, se lo desidera sulla pagina"],
          ["Foto", "Compare sulla pagina e nel contatto salvato"],
          ["Logo dell'azienda", "Va sul fronte del biglietto"],
        ],
      },
      {
        type: "callout",
        tone: "tip",
        text: "In un pacchetto può unire biglietti di più persone della stessa azienda. Ognuna ha la propria pagina.",
      },
      { type: "h2", id: "approvare", text: "2. Approvi il biglietto e la pagina" },
      {
        type: "p",
        text: "Progettiamo il biglietto: sul fronte il logo; sul retro il nome, i contatti, il codice QR e il piccolo simbolo del tocco. Creiamo anche la Sua pagina di contatto. Prima della stampa Le inviamo la bozza del biglietto e il link della pagina. Stampiamo solo dopo la Sua approvazione.",
      },
      { type: "h2", id: "ricevere", text: "3. Riceva i biglietti" },
      {
        type: "p",
        text: "I biglietti vengono testati su iPhone e Android prima della consegna e arrivano in pochi giorni lavorativi. Le indichiamo i tempi esatti durante la demo.",
      },
    ],
  },
  configuration: {
    title: "Configurare il biglietto da visita digitale",
    description: "Cosa mostra la pagina di contatto, cosa contiene il contatto salvato, la lingua della pagina e come chiedere modifiche.",
    blocks: [
      { type: "h2", id: "pagina-contatto", text: "Cosa mostra la pagina di contatto" },
      {
        type: "ol",
        items: [
          "La Sua foto, il nome, il ruolo e l'azienda.",
          "Il pulsante «Salvi il contatto».",
          "I pulsanti «Chiami», «WhatsApp», «Email» e «Sito web».",
          "I Suoi social network, come Instagram o LinkedIn.",
          "Il Suo indirizzo, con un link alla mappa, se desidera mostrarlo.",
        ],
      },
      {
        type: "p",
        text: "La pagina è veloce, pensata per il telefono e non compare su Google: si apre solo dal biglietto o dal suo link.",
      },
      { type: "h2", id: "salva-contatto", text: "Il pulsante «Salvi il contatto»" },
      {
        type: "p",
        text: "Scarica un file di contatto che il telefono aggiunge alla rubrica. Il contatto salvato contiene:",
      },
      {
        type: "ul",
        items: ["Nome", "Telefono", "Email", "Sito web", "Azienda e ruolo", "Foto"],
      },
      { type: "h2", id: "lingua", text: "Lingua della pagina" },
      {
        type: "p",
        text: "La pagina è nella Sua lingua: portoghese, inglese, spagnolo, francese, tedesco o italiano. Ci dica quale preferisce quando ci invia i Suoi dati.",
      },
      { type: "h2", id: "modifiche", text: "Chiedere modifiche" },
      {
        type: "p",
        text: "Non deve modificare la pagina da solo: siamo noi a configurarla e aggiornarla. Se cambiano il Suo numero, il Suo ruolo o la Sua email, ci invii la modifica via WhatsApp o email. Aggiorniamo la pagina e il biglietto continua a funzionare: lo stesso biglietto, niente da ristampare.",
      },
    ],
  },
  usage: {
    title: "Utilizzare il biglietto da visita digitale",
    description: "Come presentare il biglietto perché salvino il Suo contatto, e buone pratiche agli incontri, alle fiere e al banco.",
    blocks: [
      { type: "h2", id: "presentare", text: "Come presentare il biglietto" },
      {
        type: "ol",
        items: [
          "Porga il biglietto alla persona, tenendolo in mano.",
          "Con un iPhone, avvicina la parte alta del telefono al biglietto. Con Android, basta che la lettura contactless sia attiva.",
          "Se il telefono non reagisce, inquadra con la fotocamera il codice QR stampato sul biglietto.",
        ],
      },
      {
        type: "callout",
        tone: "tip",
        text: "Basta dire: «Avvicini il telefono e salvi il mio contatto.» La persona ottiene i Suoi dati corretti, senza scrivere nulla.",
      },
      { type: "h2", id: "incontri", text: "Agli incontri" },
      {
        type: "p",
        text: "Alla fine dell'incontro, mostri il biglietto e chieda di salvare il contatto subito. I Suoi interlocutori avranno nome, telefono, email e foto, senza errori di battitura. Il biglietto torna nel Suo portafoglio.",
      },
      { type: "h2", id: "fiere", text: "Alle fiere e agli eventi" },
      {
        type: "p",
        text: "I biglietti di carta finiscono sempre nel momento peggiore. Con il biglietto da visita digitale, ogni visitatore salva il Suo contatto dallo stesso biglietto. Se lo desidera, può continuare a consegnare biglietti.",
      },
      { type: "h2", id: "banco", text: "Al banco" },
      {
        type: "p",
        text: "In negozio, al ristorante o in agenzia immobiliare, tenga il biglietto a portata di mano e inviti il cliente a salvare il contatto prima di uscire. Quando avrà bisogno di Lei, La troverà subito nella rubrica.",
      },
    ],
  },
  troubleshooting: {
    title: "Risoluzione dei problemi del biglietto da visita digitale",
    description: "Cosa fare quando un telefono non reagisce al tocco, quando il contatto viene salvato senza foto o quando il biglietto si rovina.",
    blocks: [
      { type: "h2", id: "tocco-non-funziona", text: "Il telefono non reagisce al tocco" },
      {
        type: "ul",
        items: [
          "Sugli iPhone XS e successivi basta avvicinare la parte alta del telefono al biglietto, senza app.",
          "Sulla maggior parte degli Android, la lettura contactless (un tocco) deve essere attiva nelle impostazioni di connessione.",
          "Sugli altri telefoni, usi il codice QR stampato sul biglietto: basta inquadrarlo con la fotocamera.",
        ],
      },
      {
        type: "callout",
        tone: "tip",
        text: "Il codice QR apre esattamente la stessa pagina del tocco.",
      },
      { type: "h2", id: "senza-foto", text: "Il contatto è stato salvato senza foto" },
      {
        type: "p",
        text: "Su alcuni telefoni la foto potrebbe non restare nel contatto salvato. Gli altri dati vengono salvati comunque e la foto resta visibile sulla Sua pagina.",
      },
      { type: "h2", id: "dati-non-aggiornati", text: "I dati non sono aggiornati" },
      {
        type: "p",
        text: "Ci invii la modifica via WhatsApp o email. Aggiorniamo la pagina e il biglietto continua a funzionare, senza ristampare nulla.",
      },
      { type: "h2", id: "biglietto-rovinato", text: "Il biglietto si è rovinato o è andato perso" },
      {
        type: "p",
        text: "Ci chieda un biglietto nuovo. È collegato alla stessa pagina, quindi i Suoi dati e il Suo link restano gli stessi.",
      },
    ],
  },
  faq: {
    title: "Domande frequenti sul biglietto da visita digitale",
    description: "Risposte rapide su iPhone e Android, modifiche, logo, pacchetti per i team, Google e tempi.",
    blocks: [
      {
        type: "faq",
        items: [
          {
            q: "Funziona su iPhone e Android?",
            a: "Sì, senza app. Sugli iPhone XS e successivi basta avvicinare la parte alta del telefono. Sulla maggior parte degli Android, la lettura contactless deve essere attiva. Per tutti gli altri c'è il codice QR stampato sul biglietto.",
          },
          {
            q: "Posso cambiare i miei dati in seguito?",
            a: "Sì. Ci invii la modifica via WhatsApp o email e aggiorniamo la pagina. Il biglietto continua a funzionare: lo stesso biglietto, niente da ristampare.",
          },
          {
            q: "Posso modificare la pagina da solo?",
            a: "Oggi no. Siamo noi a configurare e aggiornare la pagina: Le basta chiedercelo.",
          },
          {
            q: "Il logo dell'azienda ha un costo aggiuntivo?",
            a: "No. La personalizzazione con il Suo nome, ruolo, contatti e il logo dell'azienda è inclusa nel prezzo.",
          },
          {
            q: "In un pacchetto, i biglietti possono essere per persone diverse?",
            a: "Sì. In un pacchetto può unire biglietti di più persone della stessa azienda, ognuna con la propria pagina.",
          },
          {
            q: "La mia pagina compare su Google?",
            a: "No. La pagina non è indicizzata da Google: si apre solo dal biglietto o dal suo link.",
          },
          {
            q: "Posso continuare a consegnare biglietti?",
            a: "Certo, se lo desidera. Ma un solo biglietto può servirLe per anni, perché non c'è nulla da ristampare quando cambiano un numero o un ruolo.",
          },
          {
            q: "Quanto tempo ci vuole per ricevere i biglietti?",
            a: "Pochi giorni lavorativi dopo l'approvazione della grafica e della pagina. Le indichiamo i tempi esatti durante la demo.",
          },
        ],
      },
    ],
  },
};
