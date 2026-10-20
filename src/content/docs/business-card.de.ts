import type { DocPageContent, DocPageId } from "../types";

export const de: Record<DocPageId, DocPageContent> = {
  "getting-started": {
    title: "Erste Schritte mit der digitalen Visitenkarte",
    description:
      "Was die digitale Visitenkarte ist, was enthalten ist, was sie kostet und wie Ihr Gegenüber Ihren Kontakt mit einem Antippen des Handys speichert.",
    blocks: [
      {
        type: "p",
        text: "Die digitale Visitenkarte ist eine PVC-Karte im Scheckkartenformat mit Ihrem Namen, Ihrer Position, Ihren Kontaktdaten und dem Logo Ihres Unternehmens. Mit einem Antippen des Handys auf die Karte oder über den aufgedruckten QR-Code öffnet die Person Ihre digitale Kontaktseite und speichert Ihren Kontakt.",
      },
      {
        type: "p",
        text: "Es ist ein Rundum-Service: Wir gestalten die Karte, erstellen die Seite und halten sie aktuell. Sie funktioniert auf iPhone und Android, und niemand muss eine App installieren.",
      },
      { type: "h2", id: "leistungsumfang", text: "Was enthalten ist" },
      {
        type: "table",
        head: ["Leistung", "Details"],
        rows: [
          ["PVC-Karte", "Scheckkartenformat (85,6 × 54 mm), beidseitig bedruckt in Steevanz-Qualität"],
          ["Personalisierung", "Ihr Name, Ihre Position, Ihre Kontaktdaten und das Firmenlogo, im Preis enthalten"],
          ["Digitale Kontaktseite", "Schnell, für das Handy gemacht, mit der Schaltfläche „Kontakt speichern“"],
          ["Antippen oder QR", "Öffnet sich mit einem Antippen des Handys oder über den aufgedruckten QR-Code, auf iPhone und Android, ohne App"],
          ["Änderungen durch uns", "Wenn sich Ihre Daten ändern, aktualisieren wir die Seite und die Karte funktioniert weiter"],
        ],
      },
      { type: "h2", id: "preise", text: "Preise" },
      {
        type: "table",
        head: ["Menge", "Preis pro Karte", "Gesamt"],
        rows: [
          ["1 Karte", "10 €", "10 €"],
          ["Ab 10", "9 €", "90 € (10)"],
          ["Ab 25", "8 €", "200 € (25)"],
          ["Ab 50", "7 €", "350 € (50)"],
        ],
      },
      {
        type: "p",
        text: "In einem Paket können Sie Karten für mehrere Personen desselben Unternehmens kombinieren, jede mit ihrer eigenen Seite. Preise zzgl. MwSt., unverbindlich und nach der Demo bestätigt.",
      },
      { type: "h2", id: "so-funktionierts", text: "So funktioniert es für die Person, die antippt" },
      {
        type: "ol",
        items: [
          "Sie zeigen die Karte, und die Person hält ihr Handy daran (oder scannt den QR-Code mit der Kamera).",
          "Ihre Kontaktseite öffnet sich, mit Ihrem Foto, Namen, Ihrer Position und Ihrem Unternehmen.",
          "Mit der Schaltfläche „Kontakt speichern“ landen Ihre Daten in den Kontakten ihres Handys, ohne etwas von Hand einzutippen.",
        ],
      },
      {
        type: "callout",
        tone: "info",
        title: "Ein Beispiel ansehen",
        text: "Die Kontaktseite des Steevanz-Gründers: www.steevanz.com/c/rogerio-cabaco",
      },
      { type: "h2", id: "naechste-schritte", text: "Nächste Schritte" },
      {
        type: "ul",
        items: [
          "[Einrichtung](/de/docs/digital-business-card/setup): welche Daten Sie uns senden und wie Sie die Karte freigeben.",
          "[Konfiguration](/de/docs/digital-business-card/configuration): was die Seite zeigt, die Schaltfläche „Kontakt speichern“ und wie Sie Änderungen anfragen.",
          "[Nutzung](/de/docs/digital-business-card/usage): wie Sie die Karte bei Terminen, auf Messen und an der Theke zeigen.",
        ],
      },
    ],
  },
  setup: {
    title: "Einrichtung der digitalen Visitenkarte",
    description: "Die Daten, die wir für Karte und Seite brauchen, wie Sie das Design freigeben und wie Sie die getesteten Karten erhalten.",
    blocks: [
      { type: "h2", id: "daten-senden", text: "1. Senden Sie uns Ihre Daten" },
      {
        type: "p",
        text: "Senden Sie sie per WhatsApp oder E-Mail, wie es für Sie am einfachsten ist. Wenn die Karten für mehrere Personen im Unternehmen sind, senden Sie die Daten jeder Person.",
      },
      {
        type: "table",
        head: ["Angabe", "Wofür"],
        rows: [
          ["Name", "So, wie er auf der Karte und der Seite erscheinen soll"],
          ["Position", "Steht unter Ihrem Namen"],
          ["Telefon", "Für die Schaltflächen „Anrufen“ und „WhatsApp“"],
          ["E-Mail", "Für die Schaltfläche „E-Mail“"],
          ["Website", "Für die Schaltfläche „Website“"],
          ["Soziale Netzwerke", "Instagram, LinkedIn oder andere, die Sie zeigen möchten"],
          ["Adresse (optional)", "Mit Link zum Stadtplan angezeigt, wenn Sie sie auf der Seite möchten"],
          ["Foto", "Erscheint auf der Seite und im gespeicherten Kontakt"],
          ["Firmenlogo", "Kommt auf die Vorderseite der Karte"],
        ],
      },
      {
        type: "callout",
        tone: "tip",
        text: "In einem Paket können Sie Karten für mehrere Personen desselben Unternehmens kombinieren. Jede Person hat ihre eigene Seite.",
      },
      { type: "h2", id: "freigeben", text: "2. Geben Sie Karte und Seite frei" },
      {
        type: "p",
        text: "Wir gestalten die Karte: vorne das Logo; hinten der Name, die Kontaktdaten, der QR-Code und das kleine Symbol zum Antippen. Außerdem erstellen wir Ihre Kontaktseite. Vor dem Druck senden wir Ihnen einen Korrekturabzug der Karte und den Link zur Seite. Wir drucken erst nach Ihrer Freigabe.",
      },
      { type: "h2", id: "erhalten", text: "3. Erhalten Sie Ihre Karten" },
      {
        type: "p",
        text: "Die Karten werden vor der Lieferung auf iPhone und Android getestet und kommen innerhalb weniger Werktage an. Den genauen Termin nennen wir Ihnen in der Demo.",
      },
    ],
  },
  configuration: {
    title: "Konfiguration der digitalen Visitenkarte",
    description: "Was die Kontaktseite zeigt, was der gespeicherte Kontakt enthält, die Sprache der Seite und wie Sie Änderungen anfragen.",
    blocks: [
      { type: "h2", id: "kontaktseite", text: "Was die Kontaktseite zeigt" },
      {
        type: "ol",
        items: [
          "Ihr Foto, Ihren Namen, Ihre Position und Ihr Unternehmen.",
          "Die Schaltfläche „Kontakt speichern“.",
          "Die Schaltflächen „Anrufen“, „WhatsApp“, „E-Mail“ und „Website“.",
          "Ihre sozialen Netzwerke, etwa Instagram oder LinkedIn.",
          "Ihre Adresse mit Link zum Stadtplan, wenn Sie sie zeigen möchten.",
        ],
      },
      {
        type: "p",
        text: "Die Seite ist schnell, für das Handy gemacht und erscheint nicht bei Google: Sie öffnet sich nur über die Karte oder ihren Link.",
      },
      { type: "h2", id: "kontakt-speichern", text: "Die Schaltfläche „Kontakt speichern“" },
      {
        type: "p",
        text: "Sie lädt eine Kontaktdatei herunter, die das Handy zu den Kontakten hinzufügt. Der gespeicherte Kontakt enthält:",
      },
      {
        type: "ul",
        items: ["Name", "Telefon", "E-Mail", "Website", "Unternehmen und Position", "Foto"],
      },
      { type: "h2", id: "sprache", text: "Sprache der Seite" },
      {
        type: "p",
        text: "Die Seite ist in Ihrer Sprache: Portugiesisch, Englisch, Spanisch, Französisch, Deutsch oder Italienisch. Sagen Sie uns, welche Sie bevorzugen, wenn Sie uns Ihre Daten senden.",
      },
      { type: "h2", id: "aenderungen", text: "Änderungen anfragen" },
      {
        type: "p",
        text: "Sie müssen die Seite nicht selbst bearbeiten: Wir richten sie ein und halten sie aktuell. Wenn sich Ihre Nummer, Position oder E-Mail ändert, senden Sie uns die Änderung per WhatsApp oder E-Mail. Wir aktualisieren die Seite, und die Karte funktioniert weiter: dieselbe Karte, nichts neu zu drucken.",
      },
    ],
  },
  usage: {
    title: "Nutzung der digitalen Visitenkarte",
    description: "Wie Sie die Karte zeigen, damit man Ihren Kontakt speichert, und bewährte Praxis bei Terminen, auf Messen und an der Theke.",
    blocks: [
      { type: "h2", id: "zeigen", text: "So zeigen Sie die Karte" },
      {
        type: "ol",
        items: [
          "Halten Sie der Person die Karte hin.",
          "Beim iPhone hält sie die Oberkante des Handys an die Karte. Bei Android muss nur das kontaktlose Lesen eingeschaltet sein.",
          "Reagiert das Handy nicht, richtet sie die Kamera auf den aufgedruckten QR-Code.",
        ],
      },
      {
        type: "callout",
        tone: "tip",
        text: "Sagen Sie einfach: „Halten Sie Ihr Handy daran und speichern Sie meinen Kontakt.“ So erhält die Person Ihre korrekten Daten, ohne etwas einzutippen.",
      },
      { type: "h2", id: "termine", text: "Bei Terminen" },
      {
        type: "p",
        text: "Zeigen Sie am Ende des Termins die Karte und bitten Sie Ihr Gegenüber, Ihren Kontakt gleich zu speichern. So hat es Ihren Namen, Ihre Telefonnummer, E-Mail und Ihr Foto, ohne Tippfehler. Die Karte kommt zurück in Ihre Brieftasche.",
      },
      { type: "h2", id: "messen", text: "Auf Messen und Veranstaltungen" },
      {
        type: "p",
        text: "Papierkarten gehen im ungünstigsten Moment aus. Mit der digitalen Visitenkarte speichert jeder Besucher Ihren Kontakt über dieselbe Karte. Wenn Sie möchten, können Sie weiterhin Karten verteilen.",
      },
      { type: "h2", id: "theke", text: "An der Theke" },
      {
        type: "p",
        text: "Im Geschäft, im Restaurant oder im Immobilienbüro: Halten Sie die Karte griffbereit und laden Sie den Kunden ein, Ihren Kontakt vor dem Gehen zu speichern. Wenn er Sie braucht, findet er Sie sofort in seinen Kontakten.",
      },
    ],
  },
  troubleshooting: {
    title: "Fehlerbehebung bei der digitalen Visitenkarte",
    description: "Was zu tun ist, wenn ein Handy nicht auf das Antippen reagiert, der Kontakt ohne Foto gespeichert wird oder die Karte beschädigt ist.",
    blocks: [
      { type: "h2", id: "antippen-reagiert-nicht", text: "Das Handy reagiert nicht auf das Antippen" },
      {
        type: "ul",
        items: [
          "Beim iPhone XS und neueren Modellen genügt es, die Oberkante des Handys an die Karte zu halten, ohne App.",
          "Bei den meisten Android-Handys muss das kontaktlose Lesen (Antippen) in den Verbindungseinstellungen eingeschaltet sein.",
          "Bei anderen Handys nutzen Sie den aufgedruckten QR-Code: einfach die Kamera darauf richten.",
        ],
      },
      {
        type: "callout",
        tone: "tip",
        text: "Der QR-Code öffnet genau dieselbe Seite wie das Antippen.",
      },
      { type: "h2", id: "ohne-foto", text: "Der Kontakt wurde ohne Foto gespeichert" },
      {
        type: "p",
        text: "Bei manchen Handys wird das Foto im gespeicherten Kontakt nicht übernommen. Die übrigen Daten werden trotzdem gespeichert, und das Foto bleibt auf Ihrer Seite sichtbar.",
      },
      { type: "h2", id: "veraltete-daten", text: "Die Daten sind nicht mehr aktuell" },
      {
        type: "p",
        text: "Senden Sie uns die Änderung per WhatsApp oder E-Mail. Wir aktualisieren die Seite, und die Karte funktioniert weiter, ohne Neudruck.",
      },
      { type: "h2", id: "karte-beschaedigt", text: "Die Karte ist beschädigt oder verloren" },
      {
        type: "p",
        text: "Fragen Sie uns nach einer neuen Karte. Sie ist mit derselben Seite verbunden, Ihre Daten und Ihr Link bleiben also gleich.",
      },
    ],
  },
  faq: {
    title: "Häufige Fragen zur digitalen Visitenkarte",
    description: "Kurze Antworten zu iPhone und Android, Änderungen, Logo, Paketen für Teams, Google und Lieferzeit.",
    blocks: [
      {
        type: "faq",
        items: [
          {
            q: "Funktioniert sie auf iPhone und Android?",
            a: "Ja, ohne App. Beim iPhone XS und neueren Modellen genügt es, die Oberkante des Handys daran zu halten. Bei den meisten Android-Handys muss das kontaktlose Lesen eingeschaltet sein. Für alle anderen gibt es den aufgedruckten QR-Code.",
          },
          {
            q: "Kann ich meine Daten später ändern?",
            a: "Ja. Senden Sie uns die Änderung per WhatsApp oder E-Mail, und wir aktualisieren die Seite. Die Karte funktioniert weiter: dieselbe Karte, nichts neu zu drucken.",
          },
          {
            q: "Kann ich die Seite selbst bearbeiten?",
            a: "Derzeit nicht. Wir richten die Seite ein und halten sie aktuell, Sie müssen uns nur Bescheid geben.",
          },
          {
            q: "Kostet das Firmenlogo extra?",
            a: "Nein. Die Personalisierung mit Ihrem Namen, Ihrer Position, Ihren Kontaktdaten und dem Firmenlogo ist im Preis enthalten.",
          },
          {
            q: "Können die Karten in einem Paket für verschiedene Personen sein?",
            a: "Ja. In einem Paket können Sie Karten für mehrere Personen desselben Unternehmens kombinieren, jede mit ihrer eigenen Seite.",
          },
          {
            q: "Erscheint meine Seite bei Google?",
            a: "Nein. Die Seite wird nicht von Google indexiert: Sie öffnet sich nur über die Karte oder ihren Link.",
          },
          {
            q: "Kann ich trotzdem noch Karten verteilen?",
            a: "Ja, wenn Sie möchten. Aber eine einzige Karte kann Ihnen jahrelang dienen, denn wenn sich eine Nummer oder Position ändert, muss nichts neu gedruckt werden.",
          },
          {
            q: "Wie lange dauert es, bis ich die Karten erhalte?",
            a: "Wenige Werktage, nachdem Sie Design und Seite freigegeben haben. Den genauen Termin nennen wir Ihnen in der Demo.",
          },
        ],
      },
    ],
  },
};
