import type { DocPageContent, DocPageId } from "../types";

export const de: Record<DocPageId, DocPageContent> = {
  "getting-started": {
    title: "Erste Schritte mit der digitalen Speisekarte",
    description:
      "So funktioniert die Video-Speisekarte von Steevanz: ein Video pro Gericht, mit Preis, geöffnet mit einem Antippen oder über den QR-Code des Tischaufstellers, auf Wunsch mit Bestellung am Tisch.",
    blocks: [
      {
        type: "p",
        text: "Die digitale Speisekarte ist die Speisekarte Ihres Betriebs als Video. Jedes Gericht hat sein eigenes Hochformat-Video, mit Name, Preis und Beschreibung, auf einer eigenen Seite Ihres Betriebs. Ihre Gäste öffnen sie mit einem Antippen oder über den QR-Code des runden Schilds auf jedem Tisch, ohne etwas zu installieren.",
      },
      {
        type: "p",
        text: "Wie alle Steevanz-Produkte ist sie ein Rundum-Service: Wir richten die Speisekarte ein, hosten die Videos und beschreiben und testen die Schilder. Diese Dokumentation hilft Ihnen, die Videos vorzubereiten und das Beste aus der Speisekarte herauszuholen.",
      },
      { type: "h2", id: "whats-included", text: "Was enthalten ist" },
      {
        type: "table",
        head: ["Leistung", "Details"],
        rows: [
          ["Video-Speisekarte", "Die Seite Ihres Betriebs mit Ihrem Logo, Ihren Kategorien und einem Hochformat-Video pro Gericht, mit Name, Preis und Beschreibung"],
          ["Bestellung am Tisch (optional)", "Der Tisch bestellt per Handy und Ihr Team bestätigt durch das Scannen eines QR-Codes"],
          ["Sechs Sprachen", "Portugiesisch, Englisch, Spanisch, Französisch, Deutsch und Italienisch: Jeder Gast wählt seine Sprache über die Flaggen-Schaltfläche"],
          ["Rundes Schild", "Runder Tischaufkleber oder runder Tischständer, eines pro Tisch"],
          ["Gedruckter QR-Code", "Für Handys, die ein Antippen nicht lesen können oder bei denen diese Option ausgeschaltet ist"],
          ["Einrichtung und Hosting", "Wir richten die Speisekarte ein und hosten Speisekarte und Videos"],
          ["Leitfaden zum Filmen", "Ein Leitfaden, mit dem Sie die Videos Ihrer Gerichte mit dem Handy filmen"],
        ],
      },
      { type: "h2", id: "pricing", text: "Preise" },
      {
        type: "table",
        head: ["Menge", "Preis", "Pro Schild"],
        rows: [
          ["1 bis 9 Schilder", "20 € pro Stück", "20 €"],
          ["Ab 10 Schildern", "15 € pro Stück (10 Schilder: 150 €)", "15 €"],
        ],
      },
      {
        type: "p",
        text: "Ihr Logo und Ihre Markenfarben werden einmal pro Bestellung berechnet (das Design wird einmal für alle Schilder erstellt), nicht pro Schild. Die Einrichtung der Speisekarte und das Hosting von Speisekarte und Videos kosten 30 € pro Monat zzgl. MwSt.",
      },
      { type: "h2", id: "how-it-works", text: "So funktioniert es" },
      {
        type: "ol",
        items: [
          "Der Gast setzt sich und tippt mit dem Handy auf das Schild (oder scannt den QR-Code).",
          "Die Speisekarte öffnet sich mit einer Animation Ihres Logos oben auf der Seite.",
          "Die Gerichte laufen in einem Raster. Ein Antippen öffnet sie im Vollbild, wie bei Reels, und mit einem Wischen nach oben oder unten sieht man die anderen.",
          "Ist die Bestellung am Tisch eingeschaltet, tippt der Gast bei den Gerichten auf „Hinzufügen“ und bestellt direkt dort.",
        ],
      },
      { type: "h2", id: "next-steps", text: "Nächste Schritte" },
      {
        type: "ul",
        items: [
          "[Einrichtung](/de/docs/digital-menu/setup): die Videos filmen, uns die Speisekarte senden und die Schilder aufstellen.",
          "[Konfiguration](/de/docs/digital-menu/configuration): Gerichte und Preise ändern und die Bestellung am Tisch einschalten.",
          "[Nutzung](/de/docs/digital-menu/usage): Videos, die wirken, und die Bestellung am Tisch im Alltag.",
        ],
      },
    ],
  },
  setup: {
    title: "Die digitale Speisekarte einrichten",
    description: "Filmen Sie die Videos Ihrer Gerichte, senden Sie uns die Speisekarte und stellen Sie die Schilder auf Ihre Tische.",
    blocks: [
      { type: "h2", id: "film-videos", text: "1. Die Videos filmen" },
      {
        type: "p",
        text: "Jedes Gericht hat sein eigenes Video. Filmen Sie sie mit Ihrem Handy im Hochformat: Wir geben Ihnen einen Leitfaden zum Filmen der Videos.",
      },
      {
        type: "steps",
        items: [
          { title: "Ein Video pro Gericht", body: "Im Hochformat, mit dem Gericht genau so, wie es auf den Tisch kommt." },
          { title: "Kein Text im Bild", body: "Name und Preis müssen nicht ins Video: Die Speisekarte blendet sie darüber ein." },
          { title: "Kurz halten", body: "Ein paar Sekunden reichen, um das Gericht zu zeigen. Kurze Videos halten die Aufmerksamkeit besser." },
        ],
      },
      { type: "h2", id: "send-menu", text: "2. Uns die Speisekarte senden" },
      {
        type: "p",
        text: "Senden Sie uns die Videos und zu jedem Gericht den Namen, den Preis und eine kurze Beschreibung, geordnet nach den Kategorien, die Sie möchten (zum Beispiel Brunch und Getränke). Senden Sie uns auch Ihr Logo. Wir richten die Speisekarte ein und zeigen sie Ihnen, bevor sie auf die Tische kommt.",
      },
      {
        type: "callout",
        tone: "tip",
        title: "Bestellung am Tisch",
        text: "Wenn die Tische per Handy bestellen sollen, sagen Sie uns, wie viele Tische Sie haben. Jeder Tisch bekommt sein eigenes Schild, mit eigenem Link und eigenem QR-Code.",
      },
      { type: "h2", id: "place-plates", text: "3. Die Schilder aufstellen" },
      {
        type: "ul",
        items: [
          "Ein Schild pro Tisch, gut sichtbar und leicht erreichbar (in der Tischmitte oder neben dem Serviettenhalter).",
          "Mit Bestellung am Tisch gehört jedes Schild zu einem bestimmten Tisch: Stellen Sie jedes auf seinen eigenen Tisch.",
          "Reinigen Sie die Fläche, bevor Sie den Aufkleber anbringen, und drücken Sie ihn einige Sekunden lang an.",
          "Vermeiden Sie Metallflächen: Metall blockiert das Signal des Schilds. Verwenden Sie dort den runden Tischständer.",
        ],
      },
    ],
  },
  configuration: {
    title: "Die digitale Speisekarte konfigurieren",
    description: "Ändern Sie Gerichte, Preise und Kategorien und schalten Sie die Bestellung am Tisch ein oder aus.",
    blocks: [
      { type: "h2", id: "dishes-prices", text: "Gerichte und Preise ändern" },
      {
        type: "p",
        text: "Steevanz verwaltet die Speisekarte. Um einen Preis zu ändern, ein Gericht hinzuzufügen oder zu entfernen, ein Video auszutauschen oder die Kategorien neu zu ordnen, schreiben Sie uns eine Nachricht: Wir aktualisieren die Speisekarte und die Schilder bleiben dieselben.",
      },
      { type: "h2", id: "collections", text: "Kategorien" },
      {
        type: "p",
        text: "Die Gerichte sind in Kategorien geordnet, zum Beispiel Brunch und Getränke. Alle stehen auf derselben Seite, eine Rubrik nach der anderen, und die Schaltfläche ☰ führt den Gast direkt zu jeder davon.",
      },
      { type: "h2", id: "languages", text: "Sprachen" },
      {
        type: "p",
        text: "Die Speisekarte lässt sich in sechs Sprachen lesen: Portugiesisch, Englisch, Spanisch, Französisch, Deutsch und Italienisch. Sie öffnet sich in der Sprache des Handys Ihres Gastes (oder in der, die er zuletzt gewählt hat), und die Flaggen-Schaltfläche neben ☰ wechselt die Sprache, ohne die Seite neu zu laden, während die Videos weiterlaufen. Die Schaltflächen der Speisekarte und die Bestellung am Tisch sind bereits übersetzt; Namen und Beschreibungen der Gerichte sowie die Namen der Rubriken werden Gericht für Gericht übersetzt, und was keine Übersetzung hat, erscheint auf Portugiesisch. Die Preise erscheinen im Format der jeweiligen Sprache.",
      },
      { type: "h2", id: "table-ordering", text: "Bestellung am Tisch" },
      {
        type: "p",
        text: "Die Bestellung am Tisch wird für jede Speisekarte einzeln ein- oder ausgeschaltet. Ohne sie öffnet das Schild die Speisekarte nur zum Ansehen. Jeder Tisch hat sein eigenes Schild, mit eigenem Link und eigenem QR-Code; wenn Sie mehr Tische brauchen, sagen Sie uns einfach Bescheid.",
      },
      {
        type: "callout",
        tone: "warning",
        text: "Wird der Code eines Tisches geändert, funktioniert der alte Link nicht mehr und das Schild dieses Tisches muss ersetzt werden.",
      },
      { type: "h2", id: "customisation", text: "Individuelle Gestaltung" },
      {
        type: "p",
        text: "Die Speisekarte trägt Ihr Logo. Die Schilder können Ihr Logo, Ihre Markenfarben und einen kurzen Text tragen, zum Beispiel „Antippen für die Speisekarte“. Das Design der Schilder wird einmal pro Bestellung erstellt.",
      },
    ],
  },
  usage: {
    title: "Die digitale Speisekarte nutzen",
    description: "Bewährte Praxis, damit die digitale Speisekarte Ihren Gästen bei der Wahl hilft, und die Bestellung am Tisch im Alltag.",
    blocks: [
      { type: "h2", id: "videos-that-work", text: "Videos, die wirken" },
      {
        type: "ul",
        items: [
          "Zeigen Sie das Gericht genau so, wie es auf den Tisch kommt, bei gutem Licht.",
          "Filmen Sie immer im Hochformat: So zeigt die Speisekarte die Videos.",
          "Kurze Videos halten die Aufmerksamkeit besser als lange.",
          "Stellen Sie die meistbestellten Gerichte oder die, die Sie öfter verkaufen möchten, an den Anfang.",
        ],
      },
      { type: "h2", id: "ordering-day-to-day", text: "Die Bestellung am Tisch im Alltag" },
      {
        type: "ol",
        items: [
          "Alle Handys am Tisch sehen dieselbe Bestellung in Echtzeit. Jede Person tippt bei den Gerichten auf „Hinzufügen“ und kann eine Notiz hinzufügen, etwa „ohne Zwiebeln“.",
          "„Bestellen“ zeigt auf dem Handy einen QR-Code und die Bestellnummer.",
          "Ihr Personal scannt den QR-Code mit der Handykamera, ohne App und ohne Anmeldung, und sieht den Tisch, die Uhrzeit, die Gerichte mit ihren Notizen und die Summe. Diese Seite ist immer auf Portugiesisch und zeigt, in welcher Sprache der Gast bestellt hat.",
          "Es tippt auf „Confirmar pedido“ (Bestellung bestätigen) und der Tisch sieht sofort „Bestellung bestätigt ✓“.",
        ],
      },
      {
        type: "callout",
        tone: "info",
        text: "Die Bestellnummern beginnen jeden Tag neu.",
      },
      { type: "h2", id: "team", text: "Ihr Team" },
      {
        type: "p",
        text: "Sagen Sie Ihren Gästen beim Hinsetzen, dass sie die Gerichte auf dem Handy ansehen können. Eine Einladung durch das Team erhöht die Zahl der Antipp-Vorgänge deutlich.",
      },
      { type: "h2", id: "pair-with-reviews", text: "Kombinieren Sie sie mit Google-Bewertungen" },
      {
        type: "p",
        text: "Auf demselben Tisch bittet das Schild für Google-Bewertungen am Ende des Essens um eine Bewertung. Die Speisekarte hilft am Anfang bei der Wahl; die Bewertungen helfen neuen Gästen, Sie zu finden.",
      },
    ],
  },
  troubleshooting: {
    title: "Fehlerbehebung bei der digitalen Speisekarte",
    description: "Was zu tun ist, wenn ein Schild die Speisekarte nicht öffnet oder eine Bestellung nicht ankommt.",
    blocks: [
      {
        type: "table",
        head: ["Problem", "Was zu tun ist"],
        rows: [
          ["Das Handy reagiert nicht auf das Antippen", "Prüfen Sie, ob das kontaktlose Lesen (Antippen) in den Verbindungseinstellungen eingeschaltet ist (Android), und halten Sie die Oberkante des Handys an die Mitte des Schilds. Oder scannen Sie den QR-Code."],
          ["Das Schild öffnet eine Seite, die es nicht gibt", "Der Code des Tisches wurde vielleicht geändert oder die Speisekarte ausgeschaltet. Kontaktieren Sie uns."],
          ["Die Videos starten langsam", "Prüfen Sie die Internetverbindung des Handys (WLAN oder mobile Daten). Wenn es immer passiert, sagen Sie uns Bescheid."],
          ["Das Personal kann den QR-Code der Bestellung nicht scannen", "Bitten Sie den Gast, die Bildschirmhelligkeit zu erhöhen, und halten Sie die Kamera näher an den Code."],
          ["Das Schild funktioniert nicht auf Metall", "Tauschen Sie den Aufkleber gegen den runden Tischständer."],
          ["Die Preise sind nicht mehr aktuell", "Senden Sie uns die neuen Preise: Wir aktualisieren die Speisekarte und die Schilder bleiben dieselben."],
        ],
      },
      {
        type: "callout",
        tone: "info",
        text: "Wenn ein Schild kaputtgeht, kontaktieren Sie uns: Wir ersetzen es.",
      },
    ],
  },
  faq: {
    title: "Häufige Fragen zur digitalen Speisekarte",
    description: "Kurze Antworten zur Video-Speisekarte, zur Bestellung am Tisch und zu den Schildern.",
    blocks: [
      {
        type: "faq",
        items: [
          { q: "Müssen Gäste eine App installieren?", a: "Nein. Die Speisekarte öffnet sich im Browser des Handys. Weder Ihre Gäste noch Ihr Team brauchen eine App." },
          { q: "Brauche ich Instagram oder YouTube?", a: "Nein. Die Speisekarte hat ihre eigene Seite bei Steevanz und wir hosten die Videos." },
          { q: "Funktioniert sie auf iPhone und Android?", a: "Ja. Neuere iPhones lesen das Schild, ohne dass etwas eingeschaltet werden muss; bei Android muss das kontaktlose Lesen (Antippen) eingeschaltet sein. Es gibt immer den gedruckten QR-Code." },
          { q: "Ersetzt sie die gedruckte Speisekarte?", a: "Sie ergänzt sie. Die Gerichte im Video zu sehen hilft bei der Wahl, aber die gedruckte Speisekarte bleibt nützlich für alle, die sie lieber mögen." },
          { q: "Was kostet sie?", a: "20 € pro Schild oder 15 € pro Schild ab 10 Schildern. Das Logo wird einmal pro Bestellung berechnet. Einrichtung und Hosting der Speisekarte kosten 30 € pro Monat zzgl. MwSt." },
          { q: "Wer filmt die Videos?", a: "Meist der Betrieb selbst, mit dem Handy: Wir geben Ihnen einen Leitfaden zum Filmen der Videos. Wir richten die Speisekarte ein und hosten die Videos." },
          { q: "In welchen Sprachen gibt es die Speisekarte?", a: "In sechs: Portugiesisch, Englisch, Spanisch, Französisch, Deutsch und Italienisch. Die Speisekarte öffnet sich in der Sprache des Handys und der Gast wechselt sie über die Flaggen-Schaltfläche. Was noch nicht übersetzt ist, erscheint auf Portugiesisch." },
          { q: "Ist die Bestellung am Tisch Pflicht?", a: "Nein. Sie wird für jede Speisekarte einzeln ein- oder ausgeschaltet. Ohne sie öffnet das Schild die Speisekarte nur zum Ansehen." },
          { q: "Kann ich die Speisekarte später ändern?", a: "Ja, ohne die Schilder auszutauschen. Senden Sie uns die neuen Gerichte, Preise oder Videos und wir aktualisieren die Speisekarte." },
        ],
      },
    ],
  },
};
