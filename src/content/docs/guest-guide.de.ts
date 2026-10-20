import type { DocPageContent, DocPageId } from "../types";

export const de: Record<DocPageId, DocPageContent> = {
  "getting-started": {
    title: "Erste Schritte mit der digitalen Gästemappe",
    description:
      "Was die digitale Gästemappe ist, was sie enthält, was sie kostet und wie Gäste sie mit einem Antippen eines Schilds in der Unterkunft öffnen.",
    blocks: [
      {
        type: "p",
        text: "Die digitale Gästemappe ist eine Seite fürs Handy mit allem, was Gäste während ihres Aufenthalts wissen müssen: WLAN, Check-in und Check-out, Hausregeln, Geräte, Müll, Notfälle und Ihre Empfehlungen. Sie gibt es auf Portugiesisch, Englisch und in zwei weiteren Sprachen, und sie öffnet sich mit einem Antippen eines Schilds in der Unterkunft oder über den QR-Code, der auf demselben Schild gedruckt ist.",
      },
      {
        type: "p",
        text: "Es ist ein Rundum-Service: Wir schreiben, übersetzen, veröffentlichen und halten die Gästemappe aktuell. Es gibt nichts zu installieren und kein neues Werkzeug zu lernen.",
      },
      { type: "h2", id: "whats-included", text: "Was enthalten ist" },
      {
        type: "table",
        head: ["Leistung", "Details"],
        rows: [
          ["Erstellung der Gästemappe", "Wir machen aus Ihren Notizen, Fotos oder Ihrer bisherigen Mappe eine klare, nach Themen geordnete Seite"],
          ["Vier Sprachen", "Portugiesisch, Englisch und zwei weitere nach Wahl (Französisch, Spanisch, Deutsch oder Italienisch), von uns geprüft"],
          ["Schilder zum Antippen", "Wandschild, Aufsteller oder Aufkleber, mit QR-Code, für das Innere der Unterkunft"],
          ["Druckversion", "Ein PDF mit demselben Inhalt, damit ein Exemplar auf Papier in der Unterkunft bleiben kann"],
          ["Online-Hosting und Änderungen", "Hosting der Seite und Änderungen durch uns innerhalb von zwei Werktagen"],
        ],
      },
      { type: "h2", id: "pricing", text: "Preise" },
      {
        type: "table",
        head: ["Unterkünfte", "Schilder (eins pro Unterkunft)", "Monatsgebühr"],
        rows: [
          ["1 Unterkunft", "1 kostenloses Schild", "30 €/Monat pro Konto"],
          ["3 Unterkünfte", "3 kostenlose Schilder", "30 €/Monat pro Konto"],
          ["10 Unterkünfte", "10 kostenlose Schilder", "30 €/Monat pro Konto"],
        ],
      },
      {
        type: "p",
        text: "Die Gästemappe kostet 30 € im Monat pro Konto, zzgl. MwSt., egal wie viele Unterkünfte Sie haben, inklusive Texten der Gästemappen, Übersetzung in vier Sprachen, Online-Hosting und Änderungen. Das Schild ist kostenlos, eins pro Unterkunft. Zum Beispiel 3 Unterkünfte: 30 €/Monat zzgl. MwSt., mit 3 kostenlosen Schildern. Weitere Sprachen kosten einen kleinen Aufpreis, der in Ihrem Angebot steht. Preise zzgl. MwSt., als Vorschlag, bestätigt nach der Demo.",
      },
      { type: "h2", id: "how-it-works", text: "So funktioniert es für Gäste" },
      {
        type: "ol",
        items: [
          "Der Gast kommt herein und hält das Handy an das Schild (oder scannt den QR-Code).",
          "Die Gästemappe öffnet sich in der Sprache des Handys, mit einer Schaltfläche zum Wechseln der Sprache.",
          "Er findet das WLAN (mit einer Schaltfläche zum Kopieren des Passworts), die Hausregeln und Ihre Empfehlungen, ohne Ihnen schreiben zu müssen.",
        ],
      },
      {
        type: "callout",
        tone: "info",
        title: "Was nie in der Gästemappe steht",
        text: "Codes für Tür, Schlüsselbox oder Alarmanlage. Die verschicken Sie weiterhin in Ihrer Check-in-Nachricht.",
      },
      { type: "h2", id: "next-steps", text: "Nächste Schritte" },
      {
        type: "ul",
        items: [
          "[Einrichtung](/de/docs/digital-guest-guide/setup): welche Informationen Sie uns senden und wo das Schild hinkommt.",
          "[Konfiguration](/de/docs/digital-guest-guide/configuration): Sprachen, Rubriken und wie Sie Änderungen anfragen.",
          "[Nutzung](/de/docs/digital-guest-guide/usage): bewährte Praxis, damit Gäste die Gästemappe wirklich lesen.",
        ],
      },
    ],
  },
  setup: {
    title: "Die digitale Gästemappe einrichten",
    description: "Die Informationen, die wir für die Gästemappe brauchen, wie Sie den Entwurf freigeben und wo das Schild in der Unterkunft hinkommt.",
    blocks: [
      { type: "h2", id: "send-information", text: "1. Senden Sie uns die Informationen" },
      {
        type: "p",
        text: "Senden Sie sie so, wie es für Sie am einfachsten ist: ein Dokument, Fotos, Ihre bisherige Mappe auf Papier oder eine Sprachnachricht per WhatsApp. Wir bringen alles in Ordnung.",
      },
      {
        type: "table",
        head: ["Thema", "Was Sie uns sagen"],
        rows: [
          ["Check-in und Check-out", "Uhrzeiten, wie die Schlüssel hinterlassen werden, was mit Müll und Bettwäsche passiert"],
          ["WLAN", "Netzwerkname und Passwort"],
          ["Die Unterkunft", "Wie Kochfeld, Backofen, Waschmaschine, Heizung, Klimaanlage und Warmwasser funktionieren"],
          ["Regeln", "Haus- und Gebäuderegeln, Ruhezeiten, Rauchen, Haustiere, Partys"],
          ["Müll und Recycling", "Wo die Tonnen stehen und wie der Müll getrennt wird"],
          ["Anreise und Parken", "Vom Flughafen und Bahnhof, Parkmöglichkeiten und öffentliche Verkehrsmittel"],
          ["Notfälle", "Ihr Kontakt, nächste Apotheke, Krankenhaus und Gesundheitszentrum"],
          ["Empfehlungen", "Restaurants, Strände, Spaziergänge und Geschäfte, die Sie empfehlen"],
          ["Rechtliche Angaben", "Registrierungsnummer (RNAL)"],
        ],
      },
      {
        type: "callout",
        tone: "warning",
        title: "Senden Sie uns keine Zugangscodes",
        text: "Codes für Tür, Schlüsselbox und Alarmanlage kommen nie in die Gästemappe. Erreicht uns versehentlich einer, veröffentlichen wir ihn nicht.",
      },
      { type: "h2", id: "approve", text: "2. Geben Sie den Entwurf frei" },
      {
        type: "p",
        text: "Innerhalb von etwa drei Werktagen senden wir Ihnen einen Link zum Entwurf auf Portugiesisch und in den anderen Sprachen. Fordern Sie alle Korrekturen an, die Sie möchten. Wir veröffentlichen erst nach Ihrer Freigabe.",
      },
      { type: "h2", id: "place-plate", text: "3. Bringen Sie das Schild an" },
      {
        type: "p",
        text: "Das Schild kommt innerhalb von zwei bis vier Werktagen beschrieben und getestet bei Ihnen an. Bringen Sie es in der Unterkunft an, an einer Stelle, die Gäste beim Hereinkommen sehen.",
      },
      {
        type: "table",
        head: ["Format", "Wo es am besten funktioniert"],
        rows: [
          ["Wandschild", "Neben der Eingangstür, auf der Innenseite"],
          ["Aufsteller", "Auf dem Wohnzimmertisch, der Küchenarbeitsplatte oder an der Rezeption"],
          ["Aufkleber", "Am Kühlschrank oder am Spiegel im Flur"],
        ],
      },
      {
        type: "callout",
        tone: "tip",
        text: "Vermeiden Sie die Außentür: Die Gästemappe enthält das WLAN-Passwort und sollte nur für die Personen erreichbar sein, die dort wohnen.",
      },
    ],
  },
  configuration: {
    title: "Die digitale Gästemappe konfigurieren",
    description: "Sprachen, Rubriken der Gästemappe, die Rubrik „Bewerten Sie Ihren Aufenthalt“, der Link zu Ihrer Website und wie Sie Änderungen anfragen.",
    blocks: [
      { type: "h2", id: "languages", text: "Sprachen" },
      {
        type: "p",
        text: "Die Gästemappe umfasst Portugiesisch, Englisch und zwei weitere Sprachen Ihrer Wahl aus Französisch, Spanisch, Deutsch und Italienisch. Sie öffnet sich automatisch in der Sprache des Handys Ihres Gastes und hat eine Sprachauswahl. Wenn Sie mehr Sprachen brauchen, nehmen wir die Kosten in Ihr Angebot auf.",
      },
      { type: "h2", id: "sections", text: "Rubriken" },
      {
        type: "ul",
        items: [
          "Willkommen",
          "Check-in und Check-out",
          "WLAN, mit einer Schaltfläche zum Kopieren des Passworts",
          "So funktioniert die Unterkunft: Geräte, Heizung, Klimaanlage und Warmwasser",
          "Haus- und Gebäuderegeln",
          "Müll und Recycling",
          "Lärm und Nachbarn",
          "Notfälle: 112, Ihr Kontakt, Apotheke, Krankenhaus und Gesundheitszentrum",
          "Anreise und Parken",
          "Empfehlungen des Gastgebers",
          "Touristensteuer: was sie ist und warum sie erhoben wird",
          "Bewerten Sie Ihren Aufenthalt",
          "Beschwerdebuch und Registrierungsnummer",
        ],
      },
      {
        type: "p",
        text: "Zusammen enthalten diese Rubriken die Inhalte, die das portugiesische Gesetz im Informationsbuch einer Ferienunterkunft (Alojamento Local) verlangt: Funktionsweise der Unterkunft, Regeln, Abfall, Geräte, Lärm, Gebäuderegeln und der Kontakt der verantwortlichen Person, auf Portugiesisch, Englisch und in zwei weiteren Sprachen.",
      },
      { type: "h2", id: "review-your-stay", text: "Die Rubrik „Bewerten Sie Ihren Aufenthalt“" },
      {
        type: "p",
        text: "Sie ist für alle Gäste gleich: Sie erklärt, dass Booking.com die Bitte um eine Bewertung per E-Mail und Airbnb in der App (unter Reisen) nach dem Check-out schickt und dass ihre Meinung anderen Reisenden hilft. Sie bietet keine Rabatte oder Geschenke und bittet um keine bestimmte Bewertung, weil die Plattformen das verbieten. Wenn Ihre Unterkunft ein Google-Profil hat, können wir den Google-Link hinzufügen.",
      },
      { type: "h2", id: "website", text: "Link zu Ihrer Website" },
      {
        type: "p",
        text: "Wenn Sie eine eigene Website haben, können wir einen dezenten Link „Offizielle Website“ anzeigen. Er ist standardmäßig ausgeschaltet: Airbnb verbietet, Gäste zum Buchen außerhalb der Plattform zu bewegen, deshalb verwenden wir nie Sätze wie „direkt buchen und sparen“.",
      },
      { type: "h2", id: "changes", text: "Änderungen anfragen" },
      {
        type: "p",
        text: "Senden Sie uns per WhatsApp oder E-Mail, was sich geändert hat. Wir aktualisieren die Gästemappe und das PDF innerhalb von zwei Werktagen, in allen Sprachen. Das Schild muss nie ausgetauscht werden.",
      },
    ],
  },
  usage: {
    title: "Die digitale Gästemappe nutzen",
    description: "Bewährte Praxis, damit Gäste die Gästemappe finden und nutzen, und wie sie mit dem WhatsApp-Assistenten zusammenarbeitet.",
    blocks: [
      { type: "h2", id: "let-guests-know", text: "Machen Sie Gäste auf die Gästemappe aufmerksam" },
      {
        type: "ul",
        items: [
          "Erwähnen Sie sie in Ihrer Check-in-Nachricht: „Tippen Sie bei Ihrer Ankunft auf das Schild an der Tür, dort finden Sie das WLAN und alles über das Haus.“",
          "Bringen Sie das Schild dort an, wo man es sofort sieht.",
          "Legen Sie die Druckversion in eine Schublade oder auf den Wohnzimmertisch, für Gäste, die Papier bevorzugen.",
        ],
      },
      { type: "h2", id: "recommendations", text: "Empfehlungen, die den Unterschied machen" },
      {
        type: "p",
        text: "Gäste schätzen, was nur Einheimische kennen: die Bäckerei im Viertel, den ruhigeren Strand, das Restaurant ohne Touristen. Fünf bis zehn gut gewählte Empfehlungen sind mehr wert als eine lange Liste.",
      },
      { type: "h2", id: "assistant", text: "Mit dem WhatsApp-Assistenten" },
      {
        type: "p",
        text: "Wenn Sie auch den KI-Assistenten haben, ist der Inhalt der Gästemappe seine Wissensbasis. Fragt ein Gast per WhatsApp, bekommt er dieselbe Antwort, die in der Gästemappe steht, in seiner Sprache. Auch der Assistent gibt nie Zugangscodes weiter.",
      },
      { type: "h2", id: "several-properties", text: "Mehrere Unterkünfte" },
      {
        type: "p",
        text: "Jede Unterkunft hat ihre eigene Gästemappe und ihr eigenes Schild. Für Verwalter halten wir bei allen dasselbe Erscheinungsbild und übernehmen gemeinsame Änderungen in einem Schritt, etwa neue Gebäuderegeln oder einen anderen Notfallkontakt.",
      },
    ],
  },
  troubleshooting: {
    title: "Fehlerbehebung bei der digitalen Gästemappe",
    description: "Was zu tun ist, wenn ein Gast die Gästemappe nicht mit einem Antippen öffnen kann oder Informationen veraltet sind.",
    blocks: [
      { type: "h2", id: "tap-does-not-open", text: "Das Antippen öffnet die Gästemappe nicht" },
      {
        type: "ul",
        items: [
          "Beim iPhone XS und neueren Modellen genügt es, die Oberkante des Handys bei eingeschaltetem Bildschirm an das Schild zu halten.",
          "Bei Android muss das kontaktlose Lesen (Antippen) in den Einstellungen eingeschaltet sein. Bei vielen Handys ist es das schon.",
          "Dicke Hüllen oder Metallhüllen können das Lesen verhindern. Dann nutzt der Gast den QR-Code.",
        ],
      },
      {
        type: "callout",
        tone: "tip",
        text: "Jedes Schild hat einen gedruckten QR-Code. Wer es nicht mit einem Antippen öffnen kann, richtet die Kamera darauf und landet in derselben Gästemappe.",
      },
      { type: "h2", id: "outdated-information", text: "Eine Information ist veraltet" },
      {
        type: "p",
        text: "Senden Sie uns die Korrektur per WhatsApp oder E-Mail. Wir aktualisieren sie innerhalb von zwei Werktagen. In dringenden Fällen, etwa bei einem falschen WLAN-Passwort, sagen Sie uns Bescheid und wir erledigen es vorrangig.",
      },
      { type: "h2", id: "damaged-plate", text: "Das Schild ist kaputt oder verschwunden" },
      {
        type: "p",
        text: "Wir schicken ein neues mit derselben Adresse, die Gästemappe bleibt also dieselbe. Ein zusätzliches Schild für dieselbe Unterkunft kostet einen kleinen Aufpreis, der in Ihrem Angebot steht.",
      },
      { type: "h2", id: "shared-link", text: "Der Link wurde außerhalb der Unterkunft geteilt" },
      {
        type: "p",
        text: "Die Adresse der Gästemappe ist privat und nicht zu erraten, aber ein Gast könnte sie speichern. Wenn Sie das WLAN-Passwort ändern oder eine neue Adresse möchten, sagen Sie es uns: Wir erstellen eine neue und beschreiben das Schild neu.",
      },
    ],
  },
  faq: {
    title: "Häufige Fragen zur digitalen Gästemappe",
    description: "Kurze Antworten zu Preisen, Sprachen, Sicherheit, Bewertungen und dem Pflichtschild für Ferienunterkünfte.",
    blocks: [
      {
        type: "faq",
        items: [
          {
            q: "Was kostet es im Monat?",
            a: "30 € im Monat pro Konto, zzgl. MwSt., egal wie viele Unterkünfte Sie haben, Online-Hosting und Änderungen inklusive. Das Schild ist kostenlos, eins pro Unterkunft. Zum Beispiel 3 Unterkünfte: 30 €/Monat zzgl. MwSt., mit 3 kostenlosen Schildern. Mit dem Paket für Ferienunterkünfte ist die Gästemappe enthalten, solange das Paket aktiv ist.",
          },
          {
            q: "Gilt die Gästemappe als das gesetzlich vorgeschriebene Informationsbuch?",
            a: "Die Gästemappe enthält die Inhalte, die das Gesetz für das Informationsbuch verlangt, auf Portugiesisch, Englisch und in zwei weiteren Sprachen, und wir liefern eine Druckversion, die Sie am besten in der Unterkunft aufbewahren.",
          },
          {
            q: "Ersetzt die Gästemappe das Pflichtschild für Ferienunterkünfte?",
            a: "Nein. Das Kennzeichnungsschild mit Ihrer Registrierungsnummer folgt einem gesetzlich festgelegten amtlichen Muster. Die Gästemappe zeigt Ihre Registrierungsnummer, ersetzt dieses Schild aber nicht.",
          },
          {
            q: "Erfasst die Gästemappe Daten der Gäste?",
            a: "Nein. Die Gästemappe hat keine Formulare und fragt keine persönlichen Daten ab. Gespeichert werden nur die üblichen technischen Protokolle des Servers.",
          },
          {
            q: "Kann ich über die Gästemappe um Bewertungen bitten?",
            a: "Die Gästemappe hat eine neutrale Rubrik, die erklärt, wo man eine Bewertung abgeben kann, für alle gleich und ohne Gegenleistung, wie es Booking.com und Airbnb verlangen.",
          },
          {
            q: "Übernehmen Sie die Gästemeldungen an SIBA?",
            a: "Nein. Wenn Sie Erinnerungen an die Fristen möchten, erledigt das die Automatisierung „Reinigungen und Fristen“. Für die automatische Meldung empfehlen wir spezialisierte Tools wie Chekin oder Hostkit.",
          },
        ],
      },
    ],
  },
};
