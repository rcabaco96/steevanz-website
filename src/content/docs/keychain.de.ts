import type { DocPageContent, DocPageId } from "../types";

export const de: Record<DocPageId, DocPageContent> = {
  "getting-started": {
    title: "Erste Schritte mit dem digitalen Schlüsselanhänger",
    description: "Was der digitale Schlüsselanhänger ist, was er öffnen kann, was er kostet und wie Kunden ihn mit einem Antippen des Handys nutzen.",
    blocks: [
      {
        type: "p",
        text: "Der digitale Schlüsselanhänger ist ein kleiner Anhänger für den Schlüsselbund. Einmal mit dem Handy antippen, und er öffnet WhatsApp, Instagram oder die Website Ihres Betriebs. Er funktioniert auf iPhone und Android, ohne App.",
      },
      {
        type: "p",
        text: "Wir kümmern uns um alles: Wir richten das Ziel jedes Anhängers ein und testen ihn vor der Lieferung auf iPhone und Android.",
      },
      { type: "h2", id: "was-er-oeffnet", text: "Was er öffnen kann" },
      {
        type: "table",
        head: ["Ziel", "Was der Kunde sieht"],
        rows: [
          ["WhatsApp", "Einen Chat mit Ihrem Betrieb"],
          ["Instagram", "Das Profil Ihres Betriebs"],
          ["Website", "Ihre Website"],
        ],
      },
      { type: "h2", id: "preise", text: "Preise" },
      {
        type: "table",
        head: ["Menge", "Preis pro Anhänger", "Gesamt"],
        rows: [
          ["1 Anhänger", "5 €", "5 €"],
          ["Paket mit 10", "4,50 €", "45 €"],
          ["Paket mit 25", "4 €", "100 €"],
        ],
      },
      { type: "p", text: "Alle Preise zzgl. MwSt." },
      { type: "h2", id: "so-funktioniert-es", text: "So funktioniert es für Kunden" },
      {
        type: "ol",
        items: [
          "Der Kunde hält sein Handy an den Anhänger.",
          "Das von Ihnen gewählte Ziel öffnet sich sofort.",
          "Er muss keine App installieren und nicht nach Ihrem Namen suchen.",
        ],
      },
      {
        type: "callout",
        tone: "info",
        title: "Nur durch Antippen",
        text: "Der Anhänger hat keinen QR-Code. Sehr alte Handys oder Handys ohne kontaktloses Lesen können ihn nicht öffnen. Für diese Fälle haben die Digitale Visitenkarte und die Schilder einen QR-Code.",
      },
      { type: "h2", id: "naechste-schritte", text: "Nächste Schritte" },
      {
        type: "ul",
        items: [
          "[Bestellung und Lieferung](/de/docs/digital-keychain/setup): was Sie uns schicken und was bis zur Lieferung passiert.",
          "[Konfiguration](/de/docs/digital-keychain/configuration): wie Sie zwischen WhatsApp, Instagram und Website wählen.",
          "[Nutzung](/de/docs/digital-keychain/usage): wem Sie die Anhänger schenken und wie Sie sie Kunden erklären.",
        ],
      },
    ],
  },
  setup: {
    title: "Bestellung und Lieferung des digitalen Schlüsselanhängers",
    description: "Was Sie uns für jedes Ziel schicken, wie Sie die Menge wählen und was wir vor der Lieferung tun.",
    blocks: [
      { type: "h2", id: "ziel-waehlen", text: "1. Ziel wählen" },
      {
        type: "p",
        text: "Jeder Anhänger öffnet ein Ziel, das bei der Bestellung festgelegt wird. Sagen Sie uns, welches, und schicken Sie uns, was wir brauchen:",
      },
      {
        type: "table",
        head: ["Ziel", "Was Sie uns schicken"],
        rows: [
          ["WhatsApp", "Die WhatsApp-Nummer, über die Sie Kunden antworten"],
          ["Instagram", "Den Profilnamen Ihres Betriebs (das @)"],
          ["Website", "Die Adresse der Website oder Seite, die sich öffnen soll"],
        ],
      },
      { type: "h2", id: "menge", text: "2. Menge nennen" },
      {
        type: "p",
        text: "Sie können einzelne Anhänger oder Pakete mit 10 und 25 Stück bestellen. Wenn Sie über eine Personalisierung sprechen möchten, etwa mit Ihrem Logo, besprechen wir das in der Vorführung.",
      },
      { type: "h2", id: "einrichten-testen", text: "3. Wir richten ein und testen" },
      {
        type: "p",
        text: "Wir richten jeden Anhänger mit Ihrem Ziel ein und testen ihn vor der Lieferung auf iPhone und Android. Er ist innerhalb weniger Werktage fertig; die genaue Dauer nennen wir Ihnen in der Vorführung.",
      },
      {
        type: "callout",
        tone: "tip",
        text: "Wenn die Anhänger ankommen, probieren Sie einen mit Ihrem eigenen Handy aus, bevor Sie sie verschenken.",
      },
    ],
  },
  configuration: {
    title: "Konfiguration des digitalen Schlüsselanhängers",
    description: "Wie Sie zwischen WhatsApp, Instagram und Website wählen, mit Tipps für jedes Ziel.",
    blocks: [
      { type: "h2", id: "ein-ziel", text: "Ein Ziel pro Anhänger" },
      {
        type: "p",
        text: "Jeder Anhänger öffnet immer das bei der Bestellung gewählte Ziel. Wählen Sie das, was Ihre Kunden am häufigsten nutzen, um Sie zu erreichen.",
      },
      { type: "h2", id: "whatsapp", text: "WhatsApp" },
      {
        type: "p",
        text: "Öffnet einen Chat mit Ihrem Betrieb. Die naheliegende Wahl, wenn Sie Termine, Reservierungen oder Bestellungen per Nachricht annehmen. Nutzen Sie eine Nummer, die tagsüber jemand im Blick hat.",
      },
      { type: "h2", id: "instagram", text: "Instagram" },
      {
        type: "p",
        text: "Öffnet das Profil Ihres Betriebs. Sinnvoll, wenn Sie Neuigkeiten, Arbeiten oder Tagesgerichte zeigen und möchten, dass Kunden Ihnen folgen.",
      },
      { type: "h2", id: "website", text: "Website" },
      {
        type: "p",
        text: "Öffnet Ihre Website oder eine Seite Ihrer Wahl. Wählen Sie am besten eine Seite, die auf dem Handy gut funktioniert.",
      },
      {
        type: "callout",
        tone: "info",
        text: "Die Personalisierung des Anhängers, etwa mit Ihrem Logo, besprechen wir mit Ihnen in der Vorführung.",
      },
    ],
  },
  usage: {
    title: "Nutzung des digitalen Schlüsselanhängers",
    description: "Wem Sie den Anhänger schenken und wie Sie Kunden in einem Satz erklären, was er tut.",
    blocks: [
      { type: "h2", id: "wem-schenken", text: "Wem Sie ihn schenken" },
      {
        type: "table",
        head: ["Betrieb", "So nutzen Sie ihn"],
        rows: [
          ["Cafés, Restaurants, Salons und Geschäfte", "Schenken Sie ihn Stammkunden: Ihr WhatsApp oder Instagram ist immer an ihrem Schlüsselbund"],
          ["Ferienunterkünfte", "Der Anhänger am Schlüssel der Unterkunft öffnet den WhatsApp-Chat des Gastgebers"],
          ["Immobilienmakler", "Übergeben Sie den Anhänger mit den Schlüsseln des neuen Zuhauses"],
          ["Teams, Events und Messen", "Ein nützliches Werbegeschenk, das am Schlüsselbund bleibt, statt im Papierkorb zu landen"],
        ],
      },
      { type: "h2", id: "erklaeren", text: "In einem Satz erklären" },
      {
        type: "p",
        text: "Sagen Sie bei der Übergabe zum Beispiel: „Halten Sie Ihr Handy an diesen Anhänger, und Sie schreiben uns direkt auf WhatsApp.“ Es einmal mit Ihrem eigenen Handy zu zeigen, hilft.",
      },
      {
        type: "callout",
        tone: "tip",
        text: "Wenn sich bei einem Android-Handy beim ersten Mal nichts öffnet, bitten Sie den Kunden, das kontaktlose Lesen in den Verbindungseinstellungen einzuschalten.",
      },
    ],
  },
  troubleshooting: {
    title: "Problemlösung beim digitalen Schlüsselanhänger",
    description: "Was zu tun ist, wenn sich beim Antippen nichts öffnet oder ein Anhänger das falsche Ziel öffnet.",
    blocks: [
      { type: "h2", id: "nichts-oeffnet-sich", text: "Beim Antippen öffnet sich nichts" },
      {
        type: "ul",
        items: [
          "Halten Sie beim iPhone XS und neuer die Oberkante des Handys an den Anhänger, mit eingeschaltetem Bildschirm.",
          "Schalten Sie bei Android das kontaktlose Lesen in den Verbindungseinstellungen ein.",
          "Wenn die Handyhülle dick ist, versuchen Sie es ohne.",
        ],
      },
      {
        type: "callout",
        tone: "warning",
        title: "Es gibt keinen QR-Code",
        text: "Der Anhänger funktioniert nur durch Antippen. Sehr alte Handys oder Handys ohne kontaktloses Lesen können ihn nicht öffnen. Für diese Kunden haben die Digitale Visitenkarte und die Schilder einen QR-Code.",
      },
      { type: "h2", id: "falsches-ziel", text: "Er öffnet das falsche Ziel" },
      {
        type: "p",
        text: "Wir testen jeden Anhänger vor der Lieferung. Wenn etwas nicht stimmt, schreiben Sie uns per WhatsApp oder E-Mail, was sich öffnen sollte, und wir finden gemeinsam mit Ihnen eine Lösung.",
      },
      { type: "h2", id: "mehr-anhaenger", text: "Sie brauchen mehr Anhänger" },
      {
        type: "p",
        text: "Sie können jederzeit nachbestellen, einzeln oder im Paket. Schreiben Sie uns per WhatsApp oder E-Mail.",
      },
    ],
  },
  faq: {
    title: "Häufige Fragen zum digitalen Schlüsselanhänger",
    description: "Kurze Antworten zu kompatiblen Handys, QR-Code, Zielen, Preisen und Lieferzeit.",
    blocks: [
      {
        type: "faq",
        items: [
          {
            q: "Funktioniert er auf iPhone und Android?",
            a: "Ja, ohne App. Beim iPhone XS und neuer genügt es, die Oberkante des Handys daranzuhalten. Die meisten Android-Handys lesen ihn, sofern das kontaktlose Lesen in den Verbindungseinstellungen eingeschaltet ist.",
          },
          {
            q: "Hat er einen QR-Code?",
            a: "Nein, er funktioniert nur durch Antippen. Sehr alte Handys oder Handys ohne kontaktloses Lesen können ihn nicht öffnen. Wenn Sie einen QR-Code brauchen: Die Digitale Visitenkarte und die Schilder haben einen.",
          },
          {
            q: "Was öffnet er?",
            a: "Ein Ziel pro Anhänger, das bei der Bestellung gewählt wird: einen WhatsApp-Chat mit Ihrem Betrieb, Ihr Instagram oder Ihre Website.",
          },
          {
            q: "Was kostet er?",
            a: "5 € zzgl. MwSt. pro Anhänger. Im Paket 10 Stück für 45 € und 25 Stück für 100 €, zzgl. MwSt.",
          },
          {
            q: "Wie lange dauert es?",
            a: "Wenige Werktage. Die genaue Dauer nennen wir Ihnen in der Vorführung.",
          },
          {
            q: "Was ist der Unterschied zur Digitalen Visitenkarte?",
            a: "Die Karte öffnet eine vollständige Kontaktseite und hat einen QR-Code. Der Anhänger ist kleiner und einfacher: Er öffnet direkt ein einziges Ziel.",
          },
        ],
      },
    ],
  },
};
