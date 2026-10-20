import type { ProductDocs } from "../types";

export const docs: ProductDocs = {
  productId: "ai-voice",
  pages: {
    "getting-started": {
      pt: {
        title: "Primeiros passos com a Receção por Voz IA",
        description:
          "Saiba o que faz a Receção por Voz IA da Steevanz, como atende chamadas 24/7 em português e inglês e o que precisa de preparar antes de começar.",
        blocks: [
          {
            type: "p",
            text: "A **Receção por Voz IA** é uma rececionista virtual que atende as chamadas do seu negócio a qualquer hora, em português ou inglês. Responde a perguntas frequentes, regista marcações, transfere chamadas urgentes para a sua equipa e envia-lhe um resumo de cada conversa. É um serviço gerido: a Steevanz configura tudo consigo e acompanha o funcionamento por WhatsApp e email.",
          },
          {
            type: "h2",
            id: "o-que-faz",
            text: "O que a rececionista faz por si",
          },
          {
            type: "ul",
            items: [
              "**Atende chamadas 24/7**, incluindo fora de horas, feriados e momentos de maior movimento em que ninguém consegue pegar no telefone.",
              "**Responde a perguntas frequentes**: horário, morada, estacionamento, preços indicativos, serviços disponíveis, políticas de cancelamento.",
              "**Regista marcações e reservas** diretamente no seu sistema de reservas ou calendário, quando existe integração.",
              "**Transfere chamadas urgentes** para o telemóvel de um membro da equipa, segundo as regras que definir.",
              "**Envia resumos** de cada chamada por WhatsApp ou email, com o nome, contacto e motivo da chamada.",
            ],
          },
          {
            type: "h2",
            id: "como-funciona",
            text: "Como funciona, em traços gerais",
          },
          {
            type: "p",
            text: "As chamadas chegam à rececionista de uma de duas formas: através do **reencaminhamento** do número que já usa (por exemplo, só quando está ocupado, não atende ou fora de horas) ou através de um **número novo e dedicado**. Em ambos os casos, o cliente liga, ouve uma saudação personalizada com o nome do seu negócio e fala naturalmente, como falaria com uma pessoa.",
          },
          {
            type: "p",
            text: "No fim da chamada, recebe um resumo. Se a chamada exigir intervenção humana, a rececionista transfere-a ou deixa um pedido de contacto para a sua equipa ligar de volta.",
          },
          {
            type: "h2",
            id: "para-quem",
            text: "Para quem é indicada",
          },
          {
            type: "table",
            head: ["Tipo de negócio", "Utilização mais comum"],
            rows: [
              ["Restaurantes", "Reservas de mesa, horários, pedidos de grupo, perguntas sobre o menu"],
              ["Salões e estética", "Marcações, remarcações, preços de serviços, disponibilidade de profissionais"],
              ["Clínicas", "Pedidos de consulta, informações administrativas, encaminhamento de urgências para a equipa"],
            ],
          },
          {
            type: "h2",
            id: "o-que-preparar",
            text: "O que preparar antes de começar",
          },
          {
            type: "ol",
            items: [
              "Uma lista das perguntas que os clientes fazem mais vezes ao telefone e as respetivas respostas.",
              "O seu horário de funcionamento, incluindo exceções como feriados e férias.",
              "O acesso ao seu sistema de reservas ou calendário, se quiser que a rececionista faça marcações.",
              "O número de telemóvel para onde devem ser transferidas as chamadas urgentes.",
              "A decisão entre reencaminhar o número atual ou usar um número novo.",
            ],
          },
          {
            type: "callout",
            tone: "tip",
            title: "Não precisa de ter tudo perfeito",
            text: "Na reunião inicial ajudamos a organizar a informação. Pode começar com as perguntas mais comuns e ir acrescentando outras à medida que analisamos as chamadas reais.",
          },
          {
            type: "h2",
            id: "proximos-passos",
            text: "Próximos passos",
          },
          {
            type: "p",
            text: "Veja o guia de [instalação](/docs/rececao-voz-ia/instalacao) para perceber como ligamos a rececionista ao seu telefone, ou [marque uma demonstração](/agendar) para ouvir uma chamada de exemplo. Também pode rever a [página do produto](/produtos/rececao-voz-ia) com preços e funcionalidades.",
          },
        ],
      },
      en: {
        title: "Getting started with the AI Voice Receptionist",
        description:
          "Learn what the Steevanz AI Voice Receptionist does, how it answers calls 24/7 in Portuguese and English, and what to prepare before you start.",
        blocks: [
          {
            type: "p",
            text: "The **AI Voice Receptionist** is a virtual receptionist that answers your business calls at any hour, in Portuguese or English. It answers common questions, takes bookings, transfers urgent calls to your team and sends you a summary of every conversation. It is a managed service: Steevanz sets everything up with you and keeps an eye on it, with support by WhatsApp and email.",
          },
          {
            type: "h2",
            id: "what-it-does",
            text: "What the receptionist does for you",
          },
          {
            type: "ul",
            items: [
              "**Answers calls 24/7**, including out of hours, on bank holidays and during busy spells when nobody can get to the phone.",
              "**Answers frequently asked questions**: opening hours, address, parking, indicative prices, available services, cancellation policies.",
              "**Takes bookings** straight into your booking system or calendar, where an integration is available.",
              "**Transfers urgent calls** to a team member's mobile, following the rules you set.",
              "**Sends summaries** of every call by WhatsApp or email, with the caller's name, contact and reason for calling.",
            ],
          },
          {
            type: "h2",
            id: "how-it-works",
            text: "How it works, in broad strokes",
          },
          {
            type: "p",
            text: "Calls reach the receptionist in one of two ways: by **forwarding** the number you already use (for example, only when you are busy, don't answer or are closed) or through a **new dedicated number**. Either way, the caller hears a personalised greeting with your business name and speaks naturally, just as they would to a person.",
          },
          {
            type: "p",
            text: "When the call ends, you receive a summary. If the call needs a human, the receptionist transfers it or leaves a callback request for your team.",
          },
          {
            type: "h2",
            id: "who-its-for",
            text: "Who it is for",
          },
          {
            type: "table",
            head: ["Type of business", "Most common use"],
            rows: [
              ["Restaurants", "Table bookings, opening hours, group enquiries, menu questions"],
              ["Salons and beauty", "Appointments, rescheduling, service prices, staff availability"],
              ["Clinics", "Appointment requests, admin information, routing urgent matters to the team"],
            ],
          },
          {
            type: "h2",
            id: "what-to-prepare",
            text: "What to prepare before you start",
          },
          {
            type: "ol",
            items: [
              "A list of the questions customers ask most often on the phone, with the answers.",
              "Your opening hours, including exceptions such as bank holidays and closures.",
              "Access to your booking system or calendar, if you want the receptionist to take bookings.",
              "The mobile number that urgent calls should be transferred to.",
              "A decision between forwarding your current number or using a new one.",
            ],
          },
          {
            type: "callout",
            tone: "tip",
            title: "You don't need everything perfect",
            text: "We help you organise the information during the kick-off call. You can start with the most common questions and add more as we review real calls.",
          },
          {
            type: "h2",
            id: "next-steps",
            text: "Next steps",
          },
          {
            type: "p",
            text: "Read the [setup guide](/en/docs/ai-voice-receptionist/setup) to see how we connect the receptionist to your phone, or [book a demo](/en/book-a-demo) to hear a sample call. You can also check the [product page](/en/products/ai-voice-receptionist) for pricing and features.",
          },
        ],
      },
      es: {
        title: "Primeros pasos con la Recepcionista de voz con IA",
        description:
          "Descubra qué hace la Recepcionista de voz con IA de Steevanz, cómo atiende llamadas 24/7 en portugués e inglés y qué debe preparar antes de empezar.",
        blocks: [
          {
            type: "p",
            text: "La **Recepcionista de voz con IA** es una recepcionista virtual que atiende las llamadas de su negocio a cualquier hora, en portugués o inglés. Responde a preguntas frecuentes, registra citas y reservas, transfiere las llamadas urgentes a su equipo y le envía un resumen de cada conversación. Es un servicio gestionado: Steevanz lo configura todo con usted y supervisa su funcionamiento, con soporte por WhatsApp y email.",
          },
          {
            type: "h2",
            id: "what-it-does",
            text: "Lo que la recepcionista hace por usted",
          },
          {
            type: "ul",
            items: [
              "**Atiende llamadas 24/7**, también fuera de horario, en festivos y en los momentos de más trabajo en que nadie puede coger el teléfono.",
              "**Responde a preguntas frecuentes**: horario, dirección, aparcamiento, precios orientativos, servicios disponibles, políticas de cancelación.",
              "**Registra citas y reservas** directamente en su sistema de reservas o calendario, cuando existe integración.",
              "**Transfiere las llamadas urgentes** al móvil de un miembro del equipo, según las reglas que usted defina.",
              "**Envía resúmenes** de cada llamada por WhatsApp o email, con el nombre, el contacto y el motivo de la llamada.",
            ],
          },
          {
            type: "h2",
            id: "how-it-works",
            text: "Cómo funciona, a grandes rasgos",
          },
          {
            type: "p",
            text: "Las llamadas llegan a la recepcionista de una de dos formas: mediante el **desvío** del número que ya utiliza (por ejemplo, solo cuando está ocupado, no contesta o fuera de horario) o a través de un **número nuevo y dedicado**. En ambos casos, el cliente llama, oye un saludo personalizado con el nombre de su negocio y habla con naturalidad, como lo haría con una persona.",
          },
          {
            type: "p",
            text: "Al terminar la llamada, usted recibe un resumen. Si la llamada requiere la intervención de una persona, la recepcionista la transfiere o deja una solicitud de contacto para que su equipo devuelva la llamada.",
          },
          {
            type: "h2",
            id: "who-its-for",
            text: "Para quién es",
          },
          {
            type: "table",
            head: ["Tipo de negocio", "Uso más habitual"],
            rows: [
              ["Restaurantes", "Reservas de mesa, horarios, solicitudes de grupos, preguntas sobre la carta"],
              ["Peluquerías y estética", "Citas, cambios de cita, precios de servicios, disponibilidad de los profesionales"],
              ["Clínicas", "Solicitudes de consulta, información administrativa, derivación de urgencias al equipo"],
            ],
          },
          {
            type: "h2",
            id: "what-to-prepare",
            text: "Qué preparar antes de empezar",
          },
          {
            type: "ol",
            items: [
              "Una lista de las preguntas que los clientes hacen más a menudo por teléfono, con sus respuestas.",
              "Su horario de apertura, incluidas excepciones como festivos y vacaciones.",
              "El acceso a su sistema de reservas o calendario, si quiere que la recepcionista registre citas.",
              "El número de móvil al que deben transferirse las llamadas urgentes.",
              "La decisión entre desviar su número actual o usar un número nuevo.",
            ],
          },
          {
            type: "callout",
            tone: "tip",
            title: "No hace falta tenerlo todo perfecto",
            text: "En la reunión inicial le ayudamos a organizar la información. Puede empezar con las preguntas más comunes e ir añadiendo otras a medida que analizamos las llamadas reales.",
          },
          {
            type: "h2",
            id: "next-steps",
            text: "Próximos pasos",
          },
          {
            type: "p",
            text: "Consulte la [guía de instalación](/es/docs/ai-voice-receptionist/setup) para ver cómo conectamos la recepcionista a su teléfono, o [reserve una demostración](/es/book-a-demo) para escuchar una llamada de ejemplo. También puede revisar la [página del producto](/es/products/ai-voice-receptionist) con precios y funcionalidades.",
          },
        ],
      },
      fr: {
        title: "Premiers pas avec la Réceptionniste vocale IA",
        description:
          "Découvrez ce que fait la Réceptionniste vocale IA de Steevanz, comment elle répond aux appels 24h/24 et 7j/7 en portugais et en anglais, et ce qu'il faut préparer avant de commencer.",
        blocks: [
          {
            type: "p",
            text: "La **Réceptionniste vocale IA** est une réceptionniste virtuelle qui répond aux appels de votre établissement à toute heure, en portugais ou en anglais. Elle répond aux questions fréquentes, enregistre les rendez-vous et les réservations, transfère les appels urgents à votre équipe et vous envoie un résumé de chaque conversation. C'est un service géré : Steevanz configure tout avec vous et suit son fonctionnement, avec une assistance par WhatsApp et par e-mail.",
          },
          {
            type: "h2",
            id: "what-it-does",
            text: "Ce que la réceptionniste fait pour vous",
          },
          {
            type: "ul",
            items: [
              "**Répond aux appels 24h/24 et 7j/7**, y compris en dehors des heures d'ouverture, les jours fériés et dans les moments de rush où personne ne peut décrocher.",
              "**Répond aux questions fréquentes** : horaires, adresse, stationnement, prix indicatifs, services proposés, conditions d'annulation.",
              "**Enregistre les rendez-vous et les réservations** directement dans votre système de réservation ou votre agenda, lorsqu'une intégration existe.",
              "**Transfère les appels urgents** vers le mobile d'un membre de l'équipe, selon les règles que vous définissez.",
              "**Envoie des résumés** de chaque appel par WhatsApp ou par e-mail, avec le nom, le contact et le motif de l'appel.",
            ],
          },
          {
            type: "h2",
            id: "how-it-works",
            text: "Comment ça marche, dans les grandes lignes",
          },
          {
            type: "p",
            text: "Les appels arrivent à la réceptionniste de deux façons : par le **renvoi d'appel** du numéro que vous utilisez déjà (par exemple seulement si vous êtes occupé, si vous ne répondez pas ou en dehors des heures d'ouverture) ou par un **nouveau numéro dédié**. Dans les deux cas, le client appelle, entend un message d'accueil personnalisé avec le nom de votre établissement et parle naturellement, comme il le ferait avec une personne.",
          },
          {
            type: "p",
            text: "À la fin de l'appel, vous recevez un résumé. Si l'appel nécessite l'intervention d'une personne, la réceptionniste le transfère ou laisse une demande de rappel à votre équipe.",
          },
          {
            type: "h2",
            id: "who-its-for",
            text: "Pour qui",
          },
          {
            type: "table",
            head: ["Type d'établissement", "Usage le plus courant"],
            rows: [
              ["Restaurants", "Réservations de table, horaires, demandes de groupes, questions sur la carte"],
              ["Salons et instituts de beauté", "Rendez-vous, reports, prix des prestations, disponibilité des professionnels"],
              ["Cliniques", "Demandes de rendez-vous, informations administratives, orientation des urgences vers l'équipe"],
            ],
          },
          {
            type: "h2",
            id: "what-to-prepare",
            text: "Ce qu'il faut préparer avant de commencer",
          },
          {
            type: "ol",
            items: [
              "Une liste des questions que les clients posent le plus souvent au téléphone, avec les réponses.",
              "Vos horaires d'ouverture, y compris les exceptions comme les jours fériés et les congés.",
              "L'accès à votre système de réservation ou à votre agenda, si vous voulez que la réceptionniste prenne des rendez-vous.",
              "Le numéro de mobile vers lequel transférer les appels urgents.",
              "Le choix entre renvoyer votre numéro actuel ou utiliser un nouveau numéro.",
            ],
          },
          {
            type: "callout",
            tone: "tip",
            title: "Inutile que tout soit parfait",
            text: "Lors de la réunion de lancement, nous vous aidons à organiser les informations. Vous pouvez commencer par les questions les plus courantes et en ajouter d'autres au fur et à mesure que nous analysons les vrais appels.",
          },
          {
            type: "h2",
            id: "next-steps",
            text: "Prochaines étapes",
          },
          {
            type: "p",
            text: "Lisez le [guide d'installation](/fr/docs/ai-voice-receptionist/setup) pour voir comment nous relions la réceptionniste à votre téléphone, ou [réservez une démonstration](/fr/book-a-demo) pour écouter un appel d'exemple. Vous pouvez aussi consulter la [page du produit](/fr/products/ai-voice-receptionist) avec les prix et les fonctionnalités.",
          },
        ],
      },
      de: {
        title: "Erste Schritte mit der KI-Telefonrezeption",
        description:
          "Erfahren Sie, was die KI-Telefonrezeption von Steevanz leistet, wie sie Anrufe rund um die Uhr auf Portugiesisch und Englisch annimmt und was Sie vor dem Start vorbereiten sollten.",
        blocks: [
          {
            type: "p",
            text: "Die **KI-Telefonrezeption** ist eine virtuelle Empfangskraft, die die Anrufe Ihres Betriebs zu jeder Uhrzeit annimmt, auf Portugiesisch oder Englisch. Sie beantwortet häufige Fragen, nimmt Termine und Reservierungen auf, leitet dringende Anrufe an Ihr Team weiter und schickt Ihnen eine Zusammenfassung jedes Gesprächs. Es ist ein betreuter Service: Steevanz richtet alles gemeinsam mit Ihnen ein und behält den Betrieb im Blick, mit Support per WhatsApp und E-Mail.",
          },
          {
            type: "h2",
            id: "what-it-does",
            text: "Was die Telefonrezeption für Sie erledigt",
          },
          {
            type: "ul",
            items: [
              "**Nimmt Anrufe rund um die Uhr an**, auch außerhalb der Öffnungszeiten, an Feiertagen und in Stoßzeiten, wenn niemand ans Telefon gehen kann.",
              "**Beantwortet häufige Fragen**: Öffnungszeiten, Adresse, Parken, Richtpreise, angebotene Leistungen, Stornobedingungen.",
              "**Nimmt Termine und Reservierungen auf**, direkt in Ihrem Reservierungssystem oder Kalender, wenn eine Integration möglich ist.",
              "**Leitet dringende Anrufe weiter** auf das Handy eines Teammitglieds, nach den Regeln, die Sie festlegen.",
              "**Schickt Zusammenfassungen** jedes Anrufs per WhatsApp oder E-Mail, mit Name, Kontakt und Anrufgrund.",
            ],
          },
          {
            type: "h2",
            id: "how-it-works",
            text: "So funktioniert es, im Überblick",
          },
          {
            type: "p",
            text: "Anrufe erreichen die Telefonrezeption auf einem von zwei Wegen: über eine **Rufumleitung** der Nummer, die Sie bereits nutzen (zum Beispiel nur, wenn besetzt ist, niemand abnimmt oder außerhalb der Öffnungszeiten), oder über eine **neue, eigene Nummer**. In beiden Fällen hört der Anrufer eine persönliche Begrüßung mit dem Namen Ihres Betriebs und spricht ganz natürlich, wie mit einem Menschen.",
          },
          {
            type: "p",
            text: "Nach dem Anruf erhalten Sie eine Zusammenfassung. Braucht der Anruf einen Menschen, leitet die Telefonrezeption ihn weiter oder hinterlässt eine Rückrufbitte für Ihr Team.",
          },
          {
            type: "h2",
            id: "who-its-for",
            text: "Für wen sie geeignet ist",
          },
          {
            type: "table",
            head: ["Art des Betriebs", "Häufigste Nutzung"],
            rows: [
              ["Restaurants", "Tischreservierungen, Öffnungszeiten, Gruppenanfragen, Fragen zur Speisekarte"],
              ["Friseur- und Kosmetiksalons", "Termine, Terminverschiebungen, Preise der Leistungen, Verfügbarkeit der Mitarbeitenden"],
              ["Praxen und Kliniken", "Terminanfragen, organisatorische Auskünfte, Weiterleitung dringender Anliegen an das Team"],
            ],
          },
          {
            type: "h2",
            id: "what-to-prepare",
            text: "Was Sie vor dem Start vorbereiten sollten",
          },
          {
            type: "ol",
            items: [
              "Eine Liste der Fragen, die Kunden am Telefon am häufigsten stellen, mit den Antworten.",
              "Ihre Öffnungszeiten, einschließlich Ausnahmen wie Feiertage und Betriebsferien.",
              "Den Zugang zu Ihrem Reservierungssystem oder Kalender, wenn die Telefonrezeption Termine eintragen soll.",
              "Die Handynummer, an die dringende Anrufe weitergeleitet werden sollen.",
              "Die Entscheidung, ob Ihre bisherige Nummer umgeleitet oder eine neue Nummer genutzt wird.",
            ],
          },
          {
            type: "callout",
            tone: "tip",
            title: "Es muss nicht alles perfekt sein",
            text: "Im Auftaktgespräch helfen wir Ihnen, die Informationen zu ordnen. Sie können mit den häufigsten Fragen beginnen und weitere ergänzen, während wir die echten Anrufe auswerten.",
          },
          {
            type: "h2",
            id: "next-steps",
            text: "Nächste Schritte",
          },
          {
            type: "p",
            text: "Lesen Sie die [Einrichtungsanleitung](/de/docs/ai-voice-receptionist/setup), um zu sehen, wie wir die Telefonrezeption mit Ihrem Telefon verbinden, oder [buchen Sie eine Vorführung](/de/book-a-demo), um einen Beispielanruf zu hören. Auf der [Produktseite](/de/products/ai-voice-receptionist) finden Sie außerdem Preise und Funktionen.",
          },
        ],
      },
      it: {
        title: "Primi passi con la Receptionist vocale con IA",
        description:
          "Scoprite cosa fa la Receptionist vocale con IA di Steevanz, come risponde alle chiamate 24 ore su 24 in portoghese e inglese e cosa preparare prima di iniziare.",
        blocks: [
          {
            type: "p",
            text: "La **Receptionist vocale con IA** è una receptionist virtuale che risponde alle chiamate della vostra attività a qualsiasi ora, in portoghese o in inglese. Risponde alle domande frequenti, registra appuntamenti e prenotazioni, trasferisce le chiamate urgenti al vostro team e vi invia un riepilogo di ogni conversazione. È un servizio gestito: Steevanz configura tutto insieme a voi e ne segue il funzionamento, con assistenza via WhatsApp ed email.",
          },
          {
            type: "h2",
            id: "what-it-does",
            text: "Cosa fa la receptionist per voi",
          },
          {
            type: "ul",
            items: [
              "**Risponde alle chiamate 24 ore su 24, 7 giorni su 7**, anche fuori orario, nei giorni festivi e nei momenti di maggiore lavoro in cui nessuno riesce a rispondere al telefono.",
              "**Risponde alle domande frequenti**: orari, indirizzo, parcheggio, prezzi indicativi, servizi disponibili, condizioni di cancellazione.",
              "**Registra appuntamenti e prenotazioni** direttamente nel vostro sistema di prenotazione o calendario, quando esiste un'integrazione.",
              "**Trasferisce le chiamate urgenti** al cellulare di un membro del team, secondo le regole che stabilite voi.",
              "**Invia riepiloghi** di ogni chiamata via WhatsApp o email, con nome, contatto e motivo della chiamata.",
            ],
          },
          {
            type: "h2",
            id: "how-it-works",
            text: "Come funziona, a grandi linee",
          },
          {
            type: "p",
            text: "Le chiamate arrivano alla receptionist in due modi: tramite la **deviazione di chiamata** del numero che usate già (per esempio solo quando è occupato, quando non rispondete o fuori orario) oppure tramite un **numero nuovo e dedicato**. In entrambi i casi il cliente chiama, sente un saluto personalizzato con il nome della vostra attività e parla in modo naturale, come farebbe con una persona.",
          },
          {
            type: "p",
            text: "Alla fine della chiamata ricevete un riepilogo. Se la chiamata richiede l'intervento di una persona, la receptionist la trasferisce oppure lascia una richiesta di essere richiamati per il vostro team.",
          },
          {
            type: "h2",
            id: "who-its-for",
            text: "Per chi è indicata",
          },
          {
            type: "table",
            head: ["Tipo di attività", "Uso più comune"],
            rows: [
              ["Ristoranti", "Prenotazioni di tavoli, orari, richieste per gruppi, domande sul menù"],
              ["Saloni ed estetica", "Appuntamenti, spostamenti di appuntamento, prezzi dei servizi, disponibilità del personale"],
              ["Cliniche", "Richieste di visita, informazioni amministrative, inoltro delle urgenze al team"],
            ],
          },
          {
            type: "h2",
            id: "what-to-prepare",
            text: "Cosa preparare prima di iniziare",
          },
          {
            type: "ol",
            items: [
              "Un elenco delle domande che i clienti fanno più spesso al telefono, con le relative risposte.",
              "I vostri orari di apertura, comprese le eccezioni come festivi e ferie.",
              "L'accesso al vostro sistema di prenotazione o calendario, se volete che la receptionist registri gli appuntamenti.",
              "Il numero di cellulare a cui trasferire le chiamate urgenti.",
              "La scelta tra deviare il numero attuale o usare un numero nuovo.",
            ],
          },
          {
            type: "callout",
            tone: "tip",
            title: "Non serve che sia tutto perfetto",
            text: "Nella riunione iniziale vi aiutiamo a organizzare le informazioni. Potete cominciare con le domande più comuni e aggiungerne altre man mano che analizziamo le chiamate reali.",
          },
          {
            type: "h2",
            id: "next-steps",
            text: "Prossimi passi",
          },
          {
            type: "p",
            text: "Leggete la [guida all'installazione](/it/docs/ai-voice-receptionist/setup) per vedere come colleghiamo la receptionist al vostro telefono, oppure [prenotate una demo](/it/book-a-demo) per ascoltare una chiamata di esempio. Potete anche consultare la [pagina del prodotto](/it/products/ai-voice-receptionist) con prezzi e funzionalità.",
          },
        ],
      },
    },
    setup: {
      pt: {
        title: "Instalação da Receção por Voz IA",
        description:
          "Passo a passo para ligar a Receção por Voz IA ao seu telefone: reencaminhamento do número atual ou número dedicado, códigos habituais e testes finais.",
        blocks: [
          {
            type: "p",
            text: "A instalação é feita em conjunto com a equipa Steevanz e costuma ficar concluída em poucos dias úteis, dependendo sobretudo da integração com o seu sistema de reservas. Esta página explica as duas formas de ligar a rececionista ao seu telefone e o processo completo.",
          },
          {
            type: "h2",
            id: "escolher-numero",
            text: "Escolher entre reencaminhamento e número dedicado",
          },
          {
            type: "table",
            head: ["Opção", "Vantagens", "A ter em conta"],
            rows: [
              ["Reencaminhar o número atual", "Os clientes continuam a ligar para o número que já conhecem; pode reencaminhar só algumas chamadas", "Depende do seu operador e do tipo de linha; o reencaminhamento pode ter custos no seu tarifário"],
              ["Número novo dedicado", "Configuração independente do seu operador; ideal para campanhas ou uma linha de reservas", "É preciso divulgar o novo número no site, Google e redes sociais"],
            ],
          },
          {
            type: "h2",
            id: "processo-instalacao",
            text: "Processo de instalação",
          },
          {
            type: "steps",
            items: [
              {
                title: "Reunião inicial",
                body: "Falamos sobre o seu negócio, as chamadas que recebe, o horário e as regras de transferência. Decidimos em conjunto se vamos reencaminhar o número atual ou usar um número dedicado.",
              },
              {
                title: "Envio da informação base",
                body: "Envia-nos as perguntas frequentes, preços indicativos, serviços e políticas. Pode ser um documento simples, fotografias do menu ou uma lista por WhatsApp.",
              },
              {
                title: "Configuração da rececionista",
                body: "Preparamos a saudação, a voz, as respostas e as regras de encaminhamento. Se houver sistema de reservas ou calendário compatível, fazemos a integração.",
              },
              {
                title: "Chamadas de teste",
                body: "Antes de ligar a linha real, fazemos chamadas de teste consigo e ajustamos o tom, as respostas e as transferências até ficar satisfeito.",
              },
              {
                title: "Ativação do reencaminhamento ou do número",
                body: "Ativa o reencaminhamento no seu telefone (ou com o seu operador), ou começamos a divulgar o número dedicado. Confirmamos juntos que as chamadas chegam corretamente.",
              },
              {
                title: "Acompanhamento das primeiras semanas",
                body: "Revemos os resumos das primeiras chamadas e afinamos respostas e regras. Qualquer ajuste é pedido por WhatsApp ou email.",
              },
            ],
          },
          {
            type: "h2",
            id: "codigos-reencaminhamento",
            text: "Códigos de reencaminhamento habituais",
          },
          {
            type: "p",
            text: "Em muitas linhas móveis em Portugal (MEO, NOS, Vodafone, DIGI, entre outras) o reencaminhamento pode ser ativado com os códigos GSM normalizados. Substitua `NUMERO` pelo número que lhe indicarmos:",
          },
          {
            type: "code",
            label: "Códigos GSM comuns",
            code: "**21*NUMERO#   reencaminhar todas as chamadas\n**61*NUMERO#   reencaminhar quando não atende\n**67*NUMERO#   reencaminhar quando está ocupado\n**62*NUMERO#   reencaminhar quando está inacessível\n##21#          desativar o reencaminhamento de todas as chamadas\n##002#         desativar todos os reencaminhamentos",
          },
          {
            type: "callout",
            tone: "warning",
            title: "Confirme sempre com o seu operador",
            text: "Estes códigos são comuns, mas não universais. Linhas fixas, centrais telefónicas e alguns tarifários empresariais usam métodos diferentes, e o reencaminhamento pode ser cobrado. Confirme com o seu operador antes de ativar; se preferir, acompanhamos o processo consigo.",
          },
          {
            type: "h3",
            id: "fora-de-horas",
            text: "Reencaminhar apenas fora de horas",
          },
          {
            type: "p",
            text: "Os códigos GSM não têm horário. Se quiser que a rececionista atenda só fora de horas, há duas abordagens: ativar e desativar o reencaminhamento manualmente no fecho e na abertura, ou usar uma central telefónica ou serviço do operador que suporte regras horárias. Em alternativa, a rececionista pode atender sempre e aplicar regras diferentes consoante a hora.",
          },
          {
            type: "h2",
            id: "depois-instalacao",
            text: "Depois da instalação",
          },
          {
            type: "p",
            text: "Siga para a página de [configuração](/docs/rececao-voz-ia/configuracao) para ver o que pode personalizar. Se algo não correr como esperado, consulte a [resolução de problemas](/docs/rececao-voz-ia/resolucao-problemas) ou [contacte-nos](/contacto).",
          },
        ],
      },
      en: {
        title: "Setting up the AI Voice Receptionist",
        description:
          "Step-by-step guide to connecting the AI Voice Receptionist to your phone: forwarding your existing number or a dedicated line, common codes and testing.",
        blocks: [
          {
            type: "p",
            text: "Setup is done together with the Steevanz team and is usually complete within a few working days, depending mainly on the integration with your booking system. This page explains the two ways to connect the receptionist to your phone and the full process.",
          },
          {
            type: "h2",
            id: "choose-number",
            text: "Choosing between forwarding and a dedicated number",
          },
          {
            type: "table",
            head: ["Option", "Advantages", "Things to consider"],
            rows: [
              ["Forward your current number", "Customers keep calling the number they know; you can forward only some calls", "Depends on your operator and line type; forwarding may be charged on your plan"],
              ["New dedicated number", "Independent of your operator; ideal for campaigns or a bookings line", "You need to publish the new number on your website, Google and social media"],
            ],
          },
          {
            type: "h2",
            id: "setup-process",
            text: "Setup process",
          },
          {
            type: "steps",
            items: [
              {
                title: "Kick-off call",
                body: "We talk about your business, the calls you receive, your opening hours and your transfer rules. Together we decide whether to forward your current number or use a dedicated one.",
              },
              {
                title: "Send us the basics",
                body: "Send us your FAQs, indicative prices, services and policies. A simple document, photos of your menu or a list over WhatsApp all work.",
              },
              {
                title: "Receptionist configuration",
                body: "We prepare the greeting, voice, answers and routing rules. If you have a compatible booking system or calendar, we set up the integration.",
              },
              {
                title: "Test calls",
                body: "Before going live, we make test calls with you and adjust the tone, answers and transfers until you are happy.",
              },
              {
                title: "Activate forwarding or the new number",
                body: "You switch on forwarding on your phone (or with your operator), or we start publishing the dedicated number. We check together that calls arrive correctly.",
              },
              {
                title: "Follow-up in the first weeks",
                body: "We review the summaries of the first calls and fine-tune answers and rules. Any change can be requested by WhatsApp or email.",
              },
            ],
          },
          {
            type: "h2",
            id: "forwarding-codes",
            text: "Common forwarding codes",
          },
          {
            type: "p",
            text: "On many mobile lines in Portugal (MEO, NOS, Vodafone, DIGI and others) forwarding can be switched on with the standard GSM codes. Replace `NUMBER` with the number we give you:",
          },
          {
            type: "code",
            label: "Common GSM codes",
            code: "**21*NUMBER#   forward all calls\n**61*NUMBER#   forward when unanswered\n**67*NUMBER#   forward when busy\n**62*NUMBER#   forward when unreachable\n##21#          cancel forwarding of all calls\n##002#         cancel all forwarding",
          },
          {
            type: "callout",
            tone: "warning",
            title: "Always check with your operator",
            text: "These codes are common but not universal. Landlines, phone systems (PBX) and some business plans use different methods, and forwarding may be charged. Check with your operator before switching it on; we are happy to walk you through it.",
          },
          {
            type: "h3",
            id: "out-of-hours",
            text: "Forwarding only out of hours",
          },
          {
            type: "p",
            text: "GSM codes have no schedule. If you want the receptionist to answer only out of hours, you can either switch forwarding on and off manually at closing and opening time, or use a phone system or operator service that supports time-based rules. Alternatively, the receptionist can answer all the time and apply different rules depending on the hour.",
          },
          {
            type: "h2",
            id: "after-setup",
            text: "After setup",
          },
          {
            type: "p",
            text: "Head to the [configuration](/en/docs/ai-voice-receptionist/configuration) page to see what you can customise. If something doesn't work as expected, see [troubleshooting](/en/docs/ai-voice-receptionist/troubleshooting) or [contact us](/en/contact).",
          },
        ],
      },
      es: {
        title: "Instalación de la Recepcionista de voz con IA",
        description:
          "Paso a paso para conectar la Recepcionista de voz con IA a su teléfono: desvío del número actual o número dedicado, códigos habituales y pruebas finales.",
        blocks: [
          {
            type: "p",
            text: "La instalación se hace junto con el equipo de Steevanz y suele quedar lista en pocos días laborables, según sobre todo la integración con su sistema de reservas. Esta página explica las dos formas de conectar la recepcionista a su teléfono y el proceso completo.",
          },
          {
            type: "h2",
            id: "choose-number",
            text: "Elegir entre desvío y número dedicado",
          },
          {
            type: "table",
            head: ["Opción", "Ventajas", "A tener en cuenta"],
            rows: [
              ["Desviar el número actual", "Los clientes siguen llamando al número que ya conocen; puede desviar solo algunas llamadas", "Depende de su operador y del tipo de línea; el desvío puede tener coste en su tarifa"],
              ["Número nuevo dedicado", "Configuración independiente de su operador; ideal para campañas o una línea de reservas", "Hay que dar a conocer el nuevo número en la web, Google y las redes sociales"],
            ],
          },
          {
            type: "h2",
            id: "setup-process",
            text: "Proceso de instalación",
          },
          {
            type: "steps",
            items: [
              {
                title: "Reunión inicial",
                body: "Hablamos de su negocio, de las llamadas que recibe, del horario y de las reglas de transferencia. Decidimos juntos si desviamos el número actual o usamos un número dedicado.",
              },
              {
                title: "Envío de la información básica",
                body: "Nos envía las preguntas frecuentes, los precios orientativos, los servicios y las políticas. Puede ser un documento sencillo, fotos de la carta o una lista por WhatsApp.",
              },
              {
                title: "Configuración de la recepcionista",
                body: "Preparamos el saludo, la voz, las respuestas y las reglas de derivación. Si tiene un sistema de reservas o calendario compatible, hacemos la integración.",
              },
              {
                title: "Llamadas de prueba",
                body: "Antes de conectar la línea real, hacemos llamadas de prueba con usted y ajustamos el tono, las respuestas y las transferencias hasta que quede satisfecho.",
              },
              {
                title: "Activación del desvío o del número",
                body: "Usted activa el desvío en su teléfono (o con su operador), o empezamos a dar a conocer el número dedicado. Comprobamos juntos que las llamadas llegan correctamente.",
              },
              {
                title: "Seguimiento de las primeras semanas",
                body: "Revisamos los resúmenes de las primeras llamadas y afinamos respuestas y reglas. Cualquier ajuste se pide por WhatsApp o email.",
              },
            ],
          },
          {
            type: "h2",
            id: "forwarding-codes",
            text: "Códigos de desvío habituales",
          },
          {
            type: "p",
            text: "En muchas líneas móviles de Portugal (MEO, NOS, Vodafone, DIGI, entre otras) el desvío puede activarse con los códigos GSM estándar. Sustituya `NUMERO` por el número que le indiquemos:",
          },
          {
            type: "code",
            label: "Códigos GSM comunes",
            code: "**21*NUMERO#   desviar todas las llamadas\n**61*NUMERO#   desviar cuando no contesta\n**67*NUMERO#   desviar cuando está ocupado\n**62*NUMERO#   desviar cuando no está disponible\n##21#          desactivar el desvío de todas las llamadas\n##002#         desactivar todos los desvíos",
          },
          {
            type: "callout",
            tone: "warning",
            title: "Confírmelo siempre con su operador",
            text: "Estos códigos son comunes, pero no universales. Las líneas fijas, las centralitas y algunas tarifas de empresa usan métodos diferentes, y el desvío puede tener coste. Confírmelo con su operador antes de activarlo; si lo prefiere, le acompañamos en el proceso.",
          },
          {
            type: "h3",
            id: "out-of-hours",
            text: "Desviar solo fuera de horario",
          },
          {
            type: "p",
            text: "Los códigos GSM no tienen horario. Si quiere que la recepcionista atienda solo fuera de horario, hay dos opciones: activar y desactivar el desvío a mano al cerrar y al abrir, o usar una centralita o un servicio del operador que admita reglas horarias. Como alternativa, la recepcionista puede atender siempre y aplicar reglas distintas según la hora.",
          },
          {
            type: "h2",
            id: "after-setup",
            text: "Después de la instalación",
          },
          {
            type: "p",
            text: "Pase a la página de [configuración](/es/docs/ai-voice-receptionist/configuration) para ver lo que puede personalizar. Si algo no funciona como esperaba, consulte la [resolución de problemas](/es/docs/ai-voice-receptionist/troubleshooting) o [contáctenos](/es/contact).",
          },
        ],
      },
      fr: {
        title: "Installation de la Réceptionniste vocale IA",
        description:
          "Pas à pas pour relier la Réceptionniste vocale IA à votre téléphone : renvoi du numéro actuel ou numéro dédié, codes courants et tests finaux.",
        blocks: [
          {
            type: "p",
            text: "L'installation se fait avec l'équipe Steevanz et se termine généralement en quelques jours ouvrés, selon surtout l'intégration avec votre système de réservation. Cette page explique les deux façons de relier la réceptionniste à votre téléphone et le processus complet.",
          },
          {
            type: "h2",
            id: "choose-number",
            text: "Choisir entre renvoi d'appel et numéro dédié",
          },
          {
            type: "table",
            head: ["Option", "Avantages", "Points d'attention"],
            rows: [
              ["Renvoyer le numéro actuel", "Les clients continuent d'appeler le numéro qu'ils connaissent ; vous pouvez ne renvoyer qu'une partie des appels", "Dépend de votre opérateur et du type de ligne ; le renvoi peut être facturé selon votre forfait"],
              ["Nouveau numéro dédié", "Configuration indépendante de votre opérateur ; idéal pour des campagnes ou une ligne de réservations", "Il faut faire connaître le nouveau numéro sur votre site, Google et les réseaux sociaux"],
            ],
          },
          {
            type: "h2",
            id: "setup-process",
            text: "Processus d'installation",
          },
          {
            type: "steps",
            items: [
              {
                title: "Réunion de lancement",
                body: "Nous parlons de votre établissement, des appels que vous recevez, de vos horaires et de vos règles de transfert. Ensemble, nous décidons s'il vaut mieux renvoyer votre numéro actuel ou utiliser un numéro dédié.",
              },
              {
                title: "Envoi des informations de base",
                body: "Vous nous envoyez vos questions fréquentes, prix indicatifs, services et conditions. Un simple document, des photos de votre carte ou une liste par WhatsApp suffisent.",
              },
              {
                title: "Configuration de la réceptionniste",
                body: "Nous préparons le message d'accueil, la voix, les réponses et les règles d'orientation. Si vous avez un système de réservation ou un agenda compatible, nous réalisons l'intégration.",
              },
              {
                title: "Appels de test",
                body: "Avant de brancher la vraie ligne, nous faisons des appels de test avec vous et ajustons le ton, les réponses et les transferts jusqu'à ce que vous soyez satisfait.",
              },
              {
                title: "Activation du renvoi ou du numéro",
                body: "Vous activez le renvoi sur votre téléphone (ou auprès de votre opérateur), ou nous commençons à diffuser le numéro dédié. Nous vérifions ensemble que les appels arrivent correctement.",
              },
              {
                title: "Suivi des premières semaines",
                body: "Nous relisons les résumés des premiers appels et affinons les réponses et les règles. Toute modification se demande par WhatsApp ou par e-mail.",
              },
            ],
          },
          {
            type: "h2",
            id: "forwarding-codes",
            text: "Codes de renvoi courants",
          },
          {
            type: "p",
            text: "Sur beaucoup de lignes mobiles au Portugal (MEO, NOS, Vodafone, DIGI, entre autres), le renvoi peut être activé avec les codes GSM standard. Remplacez `NUMERO` par le numéro que nous vous indiquerons :",
          },
          {
            type: "code",
            label: "Codes GSM courants",
            code: "**21*NUMERO#   renvoyer tous les appels\n**61*NUMERO#   renvoyer en cas de non-réponse\n**67*NUMERO#   renvoyer si occupé\n**62*NUMERO#   renvoyer si injoignable\n##21#          désactiver le renvoi de tous les appels\n##002#         désactiver tous les renvois",
          },
          {
            type: "callout",
            tone: "warning",
            title: "Vérifiez toujours auprès de votre opérateur",
            text: "Ces codes sont courants mais pas universels. Les lignes fixes, les standards téléphoniques et certains forfaits professionnels utilisent d'autres méthodes, et le renvoi peut être facturé. Vérifiez auprès de votre opérateur avant de l'activer ; si vous le souhaitez, nous vous accompagnons.",
          },
          {
            type: "h3",
            id: "out-of-hours",
            text: "Renvoyer seulement en dehors des heures d'ouverture",
          },
          {
            type: "p",
            text: "Les codes GSM n'ont pas d'horaire. Si vous voulez que la réceptionniste ne réponde qu'en dehors des heures d'ouverture, deux solutions : activer et désactiver le renvoi à la main à la fermeture et à l'ouverture, ou utiliser un standard ou un service de l'opérateur qui gère des règles horaires. Autre possibilité : la réceptionniste répond en permanence et applique des règles différentes selon l'heure.",
          },
          {
            type: "h2",
            id: "after-setup",
            text: "Après l'installation",
          },
          {
            type: "p",
            text: "Passez à la page de [configuration](/fr/docs/ai-voice-receptionist/configuration) pour voir ce que vous pouvez personnaliser. Si quelque chose ne fonctionne pas comme prévu, consultez le [dépannage](/fr/docs/ai-voice-receptionist/troubleshooting) ou [contactez-nous](/fr/contact).",
          },
        ],
      },
      de: {
        title: "Einrichtung der KI-Telefonrezeption",
        description:
          "Schritt für Schritt die KI-Telefonrezeption mit Ihrem Telefon verbinden: Umleitung der bisherigen Nummer oder eigene Nummer, gängige Codes und abschließende Tests.",
        blocks: [
          {
            type: "p",
            text: "Die Einrichtung erfolgt gemeinsam mit dem Steevanz-Team und ist meist in wenigen Werktagen abgeschlossen, vor allem abhängig von der Integration in Ihr Reservierungssystem. Diese Seite erklärt die zwei Wege, die Telefonrezeption mit Ihrem Telefon zu verbinden, und den gesamten Ablauf.",
          },
          {
            type: "h2",
            id: "choose-number",
            text: "Rufumleitung oder eigene Nummer?",
          },
          {
            type: "table",
            head: ["Option", "Vorteile", "Zu beachten"],
            rows: [
              ["Bisherige Nummer umleiten", "Kunden rufen weiter die Nummer an, die sie kennen; Sie können auch nur einen Teil der Anrufe umleiten", "Hängt von Ihrem Anbieter und der Art des Anschlusses ab; die Umleitung kann in Ihrem Tarif Kosten verursachen"],
              ["Neue eigene Nummer", "Unabhängig von Ihrem Anbieter; ideal für Kampagnen oder eine Reservierungslinie", "Die neue Nummer muss auf Ihrer Website, bei Google und in den sozialen Netzwerken bekannt gemacht werden"],
            ],
          },
          {
            type: "h2",
            id: "setup-process",
            text: "Ablauf der Einrichtung",
          },
          {
            type: "steps",
            items: [
              {
                title: "Auftaktgespräch",
                body: "Wir sprechen über Ihren Betrieb, die Anrufe, die Sie erhalten, Ihre Öffnungszeiten und Ihre Weiterleitungsregeln. Gemeinsam entscheiden wir, ob Ihre bisherige Nummer umgeleitet oder eine eigene Nummer genutzt wird.",
              },
              {
                title: "Grundinformationen senden",
                body: "Sie schicken uns häufige Fragen, Richtpreise, Leistungen und Bedingungen. Ein einfaches Dokument, Fotos Ihrer Speisekarte oder eine Liste per WhatsApp genügen.",
              },
              {
                title: "Konfiguration der Telefonrezeption",
                body: "Wir bereiten Begrüßung, Stimme, Antworten und Weiterleitungsregeln vor. Haben Sie ein kompatibles Reservierungssystem oder einen Kalender, richten wir die Integration ein.",
              },
              {
                title: "Testanrufe",
                body: "Bevor die echte Leitung live geht, machen wir mit Ihnen Testanrufe und passen Ton, Antworten und Weiterleitungen an, bis Sie zufrieden sind.",
              },
              {
                title: "Umleitung oder neue Nummer aktivieren",
                body: "Sie schalten die Umleitung an Ihrem Telefon (oder über Ihren Anbieter) ein, oder wir beginnen, die eigene Nummer bekannt zu machen. Gemeinsam prüfen wir, dass die Anrufe richtig ankommen.",
              },
              {
                title: "Begleitung in den ersten Wochen",
                body: "Wir gehen die Zusammenfassungen der ersten Anrufe durch und verfeinern Antworten und Regeln. Jede Änderung können Sie per WhatsApp oder E-Mail anfragen.",
              },
            ],
          },
          {
            type: "h2",
            id: "forwarding-codes",
            text: "Gängige Umleitungscodes",
          },
          {
            type: "p",
            text: "Bei vielen Mobilfunkanschlüssen in Portugal (MEO, NOS, Vodafone, DIGI und anderen) lässt sich die Umleitung mit den üblichen GSM-Codes einschalten. Ersetzen Sie `NUMMER` durch die Nummer, die wir Ihnen nennen:",
          },
          {
            type: "code",
            label: "Gängige GSM-Codes",
            code: "**21*NUMMER#   alle Anrufe umleiten\n**61*NUMMER#   umleiten, wenn niemand abnimmt\n**67*NUMMER#   umleiten, wenn besetzt\n**62*NUMMER#   umleiten, wenn nicht erreichbar\n##21#          Umleitung aller Anrufe ausschalten\n##002#         alle Umleitungen ausschalten",
          },
          {
            type: "callout",
            tone: "warning",
            title: "Immer mit Ihrem Anbieter abklären",
            text: "Diese Codes sind verbreitet, aber nicht überall gültig. Festnetzanschlüsse, Telefonanlagen und manche Geschäftstarife funktionieren anders, und die Umleitung kann Kosten verursachen. Klären Sie es vor dem Einschalten mit Ihrem Anbieter; auf Wunsch begleiten wir Sie dabei.",
          },
          {
            type: "h3",
            id: "out-of-hours",
            text: "Nur außerhalb der Öffnungszeiten umleiten",
          },
          {
            type: "p",
            text: "GSM-Codes kennen keine Uhrzeiten. Soll die Telefonrezeption nur außerhalb der Öffnungszeiten annehmen, gibt es zwei Wege: die Umleitung beim Schließen und Öffnen von Hand ein- und ausschalten, oder eine Telefonanlage bzw. einen Dienst des Anbieters nutzen, der zeitabhängige Regeln unterstützt. Alternativ nimmt die Telefonrezeption immer an und wendet je nach Uhrzeit unterschiedliche Regeln an.",
          },
          {
            type: "h2",
            id: "after-setup",
            text: "Nach der Einrichtung",
          },
          {
            type: "p",
            text: "Auf der Seite [Konfiguration](/de/docs/ai-voice-receptionist/configuration) sehen Sie, was Sie anpassen können. Wenn etwas nicht wie erwartet funktioniert, lesen Sie die [Fehlerbehebung](/de/docs/ai-voice-receptionist/troubleshooting) oder [kontaktieren Sie uns](/de/contact).",
          },
        ],
      },
      it: {
        title: "Installazione della Receptionist vocale con IA",
        description:
          "Passo dopo passo per collegare la Receptionist vocale con IA al vostro telefono: deviazione del numero attuale o numero dedicato, codici abituali e test finali.",
        blocks: [
          {
            type: "p",
            text: "L'installazione si fa insieme al team Steevanz e di solito si conclude in pochi giorni lavorativi, a seconda soprattutto dell'integrazione con il vostro sistema di prenotazione. Questa pagina spiega i due modi per collegare la receptionist al vostro telefono e l'intero processo.",
          },
          {
            type: "h2",
            id: "choose-number",
            text: "Scegliere tra deviazione e numero dedicato",
          },
          {
            type: "table",
            head: ["Opzione", "Vantaggi", "Da tenere presente"],
            rows: [
              ["Deviare il numero attuale", "I clienti continuano a chiamare il numero che già conoscono; potete deviare solo alcune chiamate", "Dipende dal vostro operatore e dal tipo di linea; la deviazione può avere un costo nel vostro piano tariffario"],
              ["Numero nuovo dedicato", "Configurazione indipendente dal vostro operatore; ideale per campagne o una linea per le prenotazioni", "Bisogna far conoscere il nuovo numero sul sito, su Google e sui social"],
            ],
          },
          {
            type: "h2",
            id: "setup-process",
            text: "Processo di installazione",
          },
          {
            type: "steps",
            items: [
              {
                title: "Riunione iniziale",
                body: "Parliamo della vostra attività, delle chiamate che ricevete, degli orari e delle regole di trasferimento. Decidiamo insieme se deviare il numero attuale o usare un numero dedicato.",
              },
              {
                title: "Invio delle informazioni di base",
                body: "Ci inviate domande frequenti, prezzi indicativi, servizi e condizioni. Va bene un semplice documento, le foto del menù o un elenco su WhatsApp.",
              },
              {
                title: "Configurazione della receptionist",
                body: "Prepariamo il saluto, la voce, le risposte e le regole di inoltro. Se avete un sistema di prenotazione o un calendario compatibile, facciamo l'integrazione.",
              },
              {
                title: "Chiamate di prova",
                body: "Prima di attivare la linea reale facciamo con voi delle chiamate di prova e regoliamo tono, risposte e trasferimenti finché non siete soddisfatti.",
              },
              {
                title: "Attivazione della deviazione o del numero",
                body: "Attivate la deviazione sul vostro telefono (o tramite il vostro operatore), oppure iniziamo a far conoscere il numero dedicato. Verifichiamo insieme che le chiamate arrivino correttamente.",
              },
              {
                title: "Accompagnamento nelle prime settimane",
                body: "Rivediamo i riepiloghi delle prime chiamate e perfezioniamo risposte e regole. Ogni modifica si richiede via WhatsApp o email.",
              },
            ],
          },
          {
            type: "h2",
            id: "forwarding-codes",
            text: "Codici di deviazione abituali",
          },
          {
            type: "p",
            text: "Su molte linee mobili in Portogallo (MEO, NOS, Vodafone, DIGI e altre) la deviazione si può attivare con i codici GSM standard. Sostituite `NUMERO` con il numero che vi indicheremo:",
          },
          {
            type: "code",
            label: "Codici GSM comuni",
            code: "**21*NUMERO#   deviare tutte le chiamate\n**61*NUMERO#   deviare se non si risponde\n**67*NUMERO#   deviare se occupato\n**62*NUMERO#   deviare se non raggiungibile\n##21#          disattivare la deviazione di tutte le chiamate\n##002#         disattivare tutte le deviazioni",
          },
          {
            type: "callout",
            tone: "warning",
            title: "Verificate sempre con il vostro operatore",
            text: "Questi codici sono comuni, ma non universali. Linee fisse, centralini e alcuni piani aziendali usano metodi diversi, e la deviazione può avere un costo. Verificate con il vostro operatore prima di attivarla; se preferite, vi seguiamo noi passo per passo.",
          },
          {
            type: "h3",
            id: "out-of-hours",
            text: "Deviare solo fuori orario",
          },
          {
            type: "p",
            text: "I codici GSM non hanno orari. Se volete che la receptionist risponda solo fuori orario, ci sono due strade: attivare e disattivare la deviazione a mano alla chiusura e all'apertura, oppure usare un centralino o un servizio dell'operatore che supporti regole orarie. In alternativa, la receptionist può rispondere sempre e applicare regole diverse a seconda dell'ora.",
          },
          {
            type: "h2",
            id: "after-setup",
            text: "Dopo l'installazione",
          },
          {
            type: "p",
            text: "Passate alla pagina di [configurazione](/it/docs/ai-voice-receptionist/configuration) per vedere cosa potete personalizzare. Se qualcosa non funziona come previsto, consultate la [risoluzione dei problemi](/it/docs/ai-voice-receptionist/troubleshooting) o [contattateci](/it/contact).",
          },
        ],
      },
    },
    configuration: {
      pt: {
        title: "Configuração da Receção por Voz IA",
        description:
          "Personalize a saudação, a voz, as perguntas frequentes, as marcações, as transferências e os resumos da sua Receção por Voz IA, sempre com apoio da Steevanz.",
        blocks: [
          {
            type: "p",
            text: "Quase tudo na rececionista pode ser ajustado ao seu negócio. Como se trata de um serviço gerido, não precisa de mexer em definições técnicas: diga-nos o que quer mudar por WhatsApp ou email e tratamos disso. Esta página descreve o que pode ser configurado e as nossas recomendações.",
          },
          {
            type: "h2",
            id: "saudacao-rgpd",
            text: "Saudação e aviso de gravação",
          },
          {
            type: "p",
            text: "A saudação é a primeira coisa que o cliente ouve. Deve ser curta, dizer o nome do negócio e, se as chamadas forem gravadas ou transcritas, **informar o cliente logo no início**, como exige o RGPD.",
          },
          {
            type: "code",
            label: "Exemplo de saudação",
            code: "Olá, ligou para o Restaurante Exemplo. Sou a assistente virtual e esta chamada pode ser gravada para melhorar o nosso serviço. Em que posso ajudar?",
          },
          {
            type: "callout",
            tone: "info",
            title: "Proteção de dados",
            text: "Definimos consigo o período de conservação das gravações e transcrições. Recomendamos guardar apenas o necessário e indicar na sua política de privacidade que utiliza um assistente de voz para atender chamadas.",
          },
          {
            type: "h2",
            id: "voz-idioma",
            text: "Voz e idioma",
          },
          {
            type: "ul",
            items: [
              "**Voz**: pode escolher entre vozes femininas e masculinas, com diferentes tons. Na fase de testes ouvimos algumas opções consigo.",
              "**Idioma**: a rececionista fala português europeu e inglês. Pode começar em português e mudar para inglês quando o cliente fala nessa língua.",
              "**Tom**: mais formal para clínicas, mais descontraído para um café ou bar. Ajustamos o vocabulário ao seu estilo.",
            ],
          },
          {
            type: "h2",
            id: "conhecimento",
            text: "Perguntas frequentes e informação do negócio",
          },
          {
            type: "p",
            text: "A rececionista responde com base na informação que nos dá. Quanto mais clara e atualizada, melhores as respostas. Inclua horários, morada e indicações, estacionamento, serviços, preços indicativos, políticas de cancelamento e atrasos, e o que fazer em casos especiais (grupos grandes, alergias, crianças, animais).",
          },
          {
            type: "callout",
            tone: "tip",
            text: "Quando mudar o menu, os preços ou o horário, envie-nos a atualização. Mudanças simples costumam ficar ativas no mesmo dia útil.",
          },
          {
            type: "h2",
            id: "marcacoes",
            text: "Marcações e reservas",
          },
          {
            type: "p",
            text: "Se usar um sistema de reservas ou calendário compatível, como o nosso [sistema de reservas online](/produtos/sistema-reservas-online), a rececionista consulta a disponibilidade e regista a marcação. Sem integração, recolhe os dados (nome, contacto, data, hora, número de pessoas ou serviço) e envia-os como pedido para a sua equipa confirmar.",
          },
          {
            type: "h2",
            id: "transferencias",
            text: "Transferências e resumos",
          },
          {
            type: "table",
            head: ["Definição", "Exemplos"],
            rows: [
              ["Quando transferir", "Pedido explícito para falar com alguém, reclamação, urgência, fornecedor"],
              ["Para onde transferir", "Telemóvel do gerente, telemóvel de quem está de serviço"],
              ["Se ninguém atender", "Deixar pedido de contacto e avisar por WhatsApp"],
              ["Resumos", "Por WhatsApp, por email, ou ambos; após cada chamada ou num resumo diário"],
            ],
          },
          {
            type: "p",
            text: "Para ver como tudo isto funciona no dia a dia, consulte a página de [utilização](/docs/rececao-voz-ia/utilizacao).",
          },
        ],
      },
      en: {
        title: "Configuring the AI Voice Receptionist",
        description:
          "Customise the greeting, voice, FAQs, bookings, call transfers and call summaries of your AI Voice Receptionist, with the Steevanz team handling the details.",
        blocks: [
          {
            type: "p",
            text: "Almost everything about the receptionist can be tailored to your business. As it is a managed service, you don't need to touch technical settings: tell us what you want to change by WhatsApp or email and we take care of it. This page describes what can be configured and what we recommend.",
          },
          {
            type: "h2",
            id: "greeting-gdpr",
            text: "Greeting and recording notice",
          },
          {
            type: "p",
            text: "The greeting is the first thing callers hear. It should be short, say your business name and, if calls are recorded or transcribed, **tell the caller at the very start**, as GDPR requires.",
          },
          {
            type: "code",
            label: "Sample greeting",
            code: "Hello, you've reached Example Restaurant. I'm the virtual assistant and this call may be recorded to help us improve our service. How can I help?",
          },
          {
            type: "callout",
            tone: "info",
            title: "Data protection",
            text: "We agree with you how long recordings and transcripts are kept. We recommend keeping only what you need and stating in your privacy policy that you use a voice assistant to answer calls.",
          },
          {
            type: "h2",
            id: "voice-language",
            text: "Voice and language",
          },
          {
            type: "ul",
            items: [
              "**Voice**: choose between female and male voices with different tones. We listen to a few options with you during testing.",
              "**Language**: the receptionist speaks European Portuguese and English. It can start in Portuguese and switch to English when the caller speaks English.",
              "**Tone**: more formal for clinics, more relaxed for a café or bar. We adapt the wording to your style.",
            ],
          },
          {
            type: "h2",
            id: "knowledge",
            text: "FAQs and business information",
          },
          {
            type: "p",
            text: "The receptionist answers based on the information you give us. The clearer and more up to date it is, the better the answers. Include opening hours, address and directions, parking, services, indicative prices, cancellation and lateness policies, and what to do in special cases (large groups, allergies, children, pets).",
          },
          {
            type: "callout",
            tone: "tip",
            text: "When your menu, prices or hours change, send us the update. Simple changes are usually live on the same working day.",
          },
          {
            type: "h2",
            id: "bookings",
            text: "Bookings and appointments",
          },
          {
            type: "p",
            text: "If you use a compatible booking system or calendar, such as our [online booking system](/en/products/online-booking-system), the receptionist checks availability and records the booking. Without an integration, it collects the details (name, contact, date, time, party size or service) and sends them as a request for your team to confirm.",
          },
          {
            type: "h2",
            id: "transfers-summaries",
            text: "Transfers and summaries",
          },
          {
            type: "table",
            head: ["Setting", "Examples"],
            rows: [
              ["When to transfer", "Explicit request to speak to someone, complaint, urgent matter, supplier"],
              ["Where to transfer", "Manager's mobile, mobile of whoever is on duty"],
              ["If nobody answers", "Take a callback request and alert you by WhatsApp"],
              ["Summaries", "By WhatsApp, email or both; after each call or as a daily digest"],
            ],
          },
          {
            type: "p",
            text: "To see how all of this works day to day, read the [usage](/en/docs/ai-voice-receptionist/usage) page.",
          },
        ],
      },
      es: {
        title: "Configuración de la Recepcionista de voz con IA",
        description:
          "Personalice el saludo, la voz, las preguntas frecuentes, las citas, las transferencias y los resúmenes de su Recepcionista de voz con IA, siempre con el apoyo de Steevanz.",
        blocks: [
          {
            type: "p",
            text: "Casi todo en la recepcionista se puede adaptar a su negocio. Como es un servicio gestionado, no necesita tocar ajustes técnicos: díganos lo que quiere cambiar por WhatsApp o email y nos ocupamos. Esta página describe lo que se puede configurar y lo que le recomendamos.",
          },
          {
            type: "h2",
            id: "greeting-gdpr",
            text: "Saludo y aviso de grabación",
          },
          {
            type: "p",
            text: "El saludo es lo primero que oye el cliente. Debe ser breve, decir el nombre del negocio y, si las llamadas se graban o se transcriben, **informar al cliente desde el principio**, como exige el RGPD.",
          },
          {
            type: "code",
            label: "Ejemplo de saludo",
            code: "Hola, ha llamado al Restaurante Ejemplo. Soy la asistente virtual y esta llamada puede ser grabada para mejorar nuestro servicio. ¿En qué puedo ayudarle?",
          },
          {
            type: "callout",
            tone: "info",
            title: "Protección de datos",
            text: "Acordamos con usted el plazo de conservación de las grabaciones y transcripciones. Le recomendamos guardar solo lo necesario e indicar en su política de privacidad que utiliza un asistente de voz para atender las llamadas.",
          },
          {
            type: "h2",
            id: "voice-language",
            text: "Voz e idioma",
          },
          {
            type: "ul",
            items: [
              "**Voz**: puede elegir entre voces femeninas y masculinas, con distintos tonos. En la fase de pruebas escuchamos algunas opciones con usted.",
              "**Idioma**: la recepcionista habla portugués europeo e inglés. Puede empezar en portugués y pasar al inglés cuando el cliente habla en ese idioma.",
              "**Tono**: más formal para clínicas, más relajado para una cafetería o un bar. Adaptamos el vocabulario a su estilo.",
            ],
          },
          {
            type: "h2",
            id: "knowledge",
            text: "Preguntas frecuentes e información del negocio",
          },
          {
            type: "p",
            text: "La recepcionista responde a partir de la información que usted nos da. Cuanto más clara y actualizada, mejores serán las respuestas. Incluya horarios, dirección y cómo llegar, aparcamiento, servicios, precios orientativos, políticas de cancelación y retrasos, y qué hacer en casos especiales (grupos grandes, alergias, niños, mascotas).",
          },
          {
            type: "callout",
            tone: "tip",
            text: "Cuando cambie la carta, los precios o el horario, envíenos la actualización. Los cambios sencillos suelen estar activos el mismo día laborable.",
          },
          {
            type: "h2",
            id: "bookings",
            text: "Citas y reservas",
          },
          {
            type: "p",
            text: "Si utiliza un sistema de reservas o calendario compatible, como nuestro [sistema de reservas online](/es/products/online-booking-system), la recepcionista consulta la disponibilidad y registra la cita. Sin integración, recoge los datos (nombre, contacto, fecha, hora, número de personas o servicio) y los envía como solicitud para que su equipo la confirme.",
          },
          {
            type: "h2",
            id: "transfers-summaries",
            text: "Transferencias y resúmenes",
          },
          {
            type: "table",
            head: ["Ajuste", "Ejemplos"],
            rows: [
              ["Cuándo transferir", "Petición expresa de hablar con alguien, reclamación, urgencia, proveedor"],
              ["A dónde transferir", "Móvil del gerente, móvil de quien esté de turno"],
              ["Si nadie contesta", "Dejar una solicitud de contacto y avisar por WhatsApp"],
              ["Resúmenes", "Por WhatsApp, por email o ambos; después de cada llamada o en un resumen diario"],
            ],
          },
          {
            type: "p",
            text: "Para ver cómo funciona todo esto en el día a día, consulte la página de [uso](/es/docs/ai-voice-receptionist/usage).",
          },
        ],
      },
      fr: {
        title: "Configuration de la Réceptionniste vocale IA",
        description:
          "Personnalisez le message d'accueil, la voix, les questions fréquentes, les rendez-vous, les transferts et les résumés de votre Réceptionniste vocale IA, avec l'aide de Steevanz.",
        blocks: [
          {
            type: "p",
            text: "Presque tout dans la réceptionniste peut être adapté à votre établissement. Comme il s'agit d'un service géré, vous n'avez pas à toucher aux réglages techniques : dites-nous ce que vous voulez changer par WhatsApp ou par e-mail et nous nous en occupons. Cette page décrit ce qui peut être configuré et nos recommandations.",
          },
          {
            type: "h2",
            id: "greeting-gdpr",
            text: "Message d'accueil et avis d'enregistrement",
          },
          {
            type: "p",
            text: "Le message d'accueil est la première chose que le client entend. Il doit être court, donner le nom de l'établissement et, si les appels sont enregistrés ou transcrits, **en informer le client dès le début**, comme l'exige le RGPD.",
          },
          {
            type: "code",
            label: "Exemple de message d'accueil",
            code: "Bonjour, vous êtes bien au Restaurant Exemple. Je suis l'assistante virtuelle et cet appel peut être enregistré pour améliorer notre service. Comment puis-je vous aider ?",
          },
          {
            type: "callout",
            tone: "info",
            title: "Protection des données",
            text: "Nous convenons avec vous de la durée de conservation des enregistrements et des transcriptions. Nous recommandons de ne garder que le nécessaire et d'indiquer dans votre politique de confidentialité que vous utilisez un assistant vocal pour répondre aux appels.",
          },
          {
            type: "h2",
            id: "voice-language",
            text: "Voix et langue",
          },
          {
            type: "ul",
            items: [
              "**Voix** : vous pouvez choisir entre des voix féminines et masculines, avec différents tons. Pendant la phase de test, nous écoutons quelques options avec vous.",
              "**Langue** : la réceptionniste parle le portugais européen et l'anglais. Elle peut commencer en portugais et passer à l'anglais quand le client parle anglais.",
              "**Ton** : plus formel pour une clinique, plus détendu pour un café ou un bar. Nous adaptons le vocabulaire à votre style.",
            ],
          },
          {
            type: "h2",
            id: "knowledge",
            text: "Questions fréquentes et informations sur l'établissement",
          },
          {
            type: "p",
            text: "La réceptionniste répond à partir des informations que vous nous donnez. Plus elles sont claires et à jour, meilleures sont les réponses. Indiquez les horaires, l'adresse et l'itinéraire, le stationnement, les services, les prix indicatifs, les conditions d'annulation et de retard, et ce qu'il faut faire dans les cas particuliers (grands groupes, allergies, enfants, animaux).",
          },
          {
            type: "callout",
            tone: "tip",
            text: "Quand votre carte, vos prix ou vos horaires changent, envoyez-nous la mise à jour. Les modifications simples sont généralement actives le jour ouvré même.",
          },
          {
            type: "h2",
            id: "bookings",
            text: "Rendez-vous et réservations",
          },
          {
            type: "p",
            text: "Si vous utilisez un système de réservation ou un agenda compatible, comme notre [système de réservation en ligne](/fr/products/online-booking-system), la réceptionniste consulte les disponibilités et enregistre le rendez-vous. Sans intégration, elle recueille les informations (nom, contact, date, heure, nombre de personnes ou prestation) et les envoie sous forme de demande que votre équipe confirmera.",
          },
          {
            type: "h2",
            id: "transfers-summaries",
            text: "Transferts et résumés",
          },
          {
            type: "table",
            head: ["Réglage", "Exemples"],
            rows: [
              ["Quand transférer", "Demande explicite de parler à quelqu'un, réclamation, urgence, fournisseur"],
              ["Vers qui transférer", "Mobile du gérant, mobile de la personne de service"],
              ["Si personne ne répond", "Laisser une demande de rappel et prévenir par WhatsApp"],
              ["Résumés", "Par WhatsApp, par e-mail ou les deux ; après chaque appel ou dans un récapitulatif quotidien"],
            ],
          },
          {
            type: "p",
            text: "Pour voir comment tout cela fonctionne au quotidien, consultez la page [utilisation](/fr/docs/ai-voice-receptionist/usage).",
          },
        ],
      },
      de: {
        title: "Konfiguration der KI-Telefonrezeption",
        description:
          "Passen Sie Begrüßung, Stimme, häufige Fragen, Termine, Weiterleitungen und Zusammenfassungen Ihrer KI-Telefonrezeption an, immer mit Unterstützung von Steevanz.",
        blocks: [
          {
            type: "p",
            text: "Fast alles an der Telefonrezeption lässt sich an Ihren Betrieb anpassen. Da es ein betreuter Service ist, müssen Sie keine technischen Einstellungen vornehmen: Sagen Sie uns per WhatsApp oder E-Mail, was Sie ändern möchten, und wir kümmern uns darum. Diese Seite beschreibt, was sich einstellen lässt und was wir empfehlen.",
          },
          {
            type: "h2",
            id: "greeting-gdpr",
            text: "Begrüßung und Hinweis auf die Aufzeichnung",
          },
          {
            type: "p",
            text: "Die Begrüßung ist das Erste, was der Anrufer hört. Sie sollte kurz sein, den Namen des Betriebs nennen und, wenn Anrufe aufgezeichnet oder transkribiert werden, **den Anrufer gleich zu Beginn darauf hinweisen**, wie es die DSGVO verlangt.",
          },
          {
            type: "code",
            label: "Beispiel für eine Begrüßung",
            code: "Guten Tag, Sie sind mit dem Restaurant Beispiel verbunden. Ich bin die virtuelle Assistentin, und dieses Gespräch kann zur Verbesserung unseres Service aufgezeichnet werden. Wie kann ich Ihnen helfen?",
          },
          {
            type: "callout",
            tone: "info",
            title: "Datenschutz",
            text: "Wie lange Aufzeichnungen und Transkripte aufbewahrt werden, legen wir gemeinsam mit Ihnen fest. Wir empfehlen, nur das Nötige zu speichern und in Ihrer Datenschutzerklärung anzugeben, dass Sie einen Sprachassistenten für die Annahme von Anrufen einsetzen.",
          },
          {
            type: "h2",
            id: "voice-language",
            text: "Stimme und Sprache",
          },
          {
            type: "ul",
            items: [
              "**Stimme**: Sie können zwischen weiblichen und männlichen Stimmen mit unterschiedlicher Klangfarbe wählen. In der Testphase hören wir uns gemeinsam einige Optionen an.",
              "**Sprache**: Die Telefonrezeption spricht europäisches Portugiesisch und Englisch. Sie kann auf Portugiesisch beginnen und ins Englische wechseln, wenn der Anrufer Englisch spricht.",
              "**Ton**: förmlicher für Praxen und Kliniken, lockerer für ein Café oder eine Bar. Wir passen die Wortwahl an Ihren Stil an.",
            ],
          },
          {
            type: "h2",
            id: "knowledge",
            text: "Häufige Fragen und Informationen zum Betrieb",
          },
          {
            type: "p",
            text: "Die Telefonrezeption antwortet auf Grundlage der Informationen, die Sie uns geben. Je klarer und aktueller sie sind, desto besser die Antworten. Nennen Sie Öffnungszeiten, Adresse und Anfahrt, Parkmöglichkeiten, Leistungen, Richtpreise, Regeln für Stornierungen und Verspätungen sowie das Vorgehen in Sonderfällen (große Gruppen, Allergien, Kinder, Haustiere).",
          },
          {
            type: "callout",
            tone: "tip",
            text: "Wenn sich Speisekarte, Preise oder Öffnungszeiten ändern, schicken Sie uns die Aktualisierung. Einfache Änderungen sind meist noch am selben Werktag aktiv.",
          },
          {
            type: "h2",
            id: "bookings",
            text: "Termine und Reservierungen",
          },
          {
            type: "p",
            text: "Nutzen Sie ein kompatibles Reservierungssystem oder einen Kalender, etwa unser [Online-Reservierungssystem](/de/products/online-booking-system), prüft die Telefonrezeption die Verfügbarkeit und trägt den Termin ein. Ohne Integration nimmt sie die Angaben auf (Name, Kontakt, Datum, Uhrzeit, Personenzahl oder Leistung) und schickt sie als Anfrage, die Ihr Team bestätigt.",
          },
          {
            type: "h2",
            id: "transfers-summaries",
            text: "Weiterleitungen und Zusammenfassungen",
          },
          {
            type: "table",
            head: ["Einstellung", "Beispiele"],
            rows: [
              ["Wann weiterleiten", "Ausdrücklicher Wunsch, mit jemandem zu sprechen, Beschwerde, dringendes Anliegen, Lieferant"],
              ["Wohin weiterleiten", "Handy der Geschäftsführung, Handy der diensthabenden Person"],
              ["Wenn niemand abnimmt", "Rückrufbitte aufnehmen und per WhatsApp Bescheid geben"],
              ["Zusammenfassungen", "Per WhatsApp, per E-Mail oder beides; nach jedem Anruf oder als tägliche Übersicht"],
            ],
          },
          {
            type: "p",
            text: "Wie das alles im Alltag funktioniert, lesen Sie auf der Seite [Nutzung](/de/docs/ai-voice-receptionist/usage).",
          },
        ],
      },
      it: {
        title: "Configurazione della Receptionist vocale con IA",
        description:
          "Personalizzate saluto, voce, domande frequenti, appuntamenti, trasferimenti e riepiloghi della vostra Receptionist vocale con IA, sempre con il supporto di Steevanz.",
        blocks: [
          {
            type: "p",
            text: "Quasi tutto nella receptionist si può adattare alla vostra attività. Trattandosi di un servizio gestito, non dovete toccare impostazioni tecniche: diteci cosa volete cambiare via WhatsApp o email e ce ne occupiamo noi. Questa pagina descrive cosa si può configurare e cosa vi consigliamo.",
          },
          {
            type: "h2",
            id: "greeting-gdpr",
            text: "Saluto e avviso di registrazione",
          },
          {
            type: "p",
            text: "Il saluto è la prima cosa che sente il cliente. Deve essere breve, dire il nome dell'attività e, se le chiamate vengono registrate o trascritte, **informare il cliente fin dall'inizio**, come richiede il GDPR.",
          },
          {
            type: "code",
            label: "Esempio di saluto",
            code: "Buongiorno, avete chiamato il Ristorante Esempio. Sono l'assistente virtuale e questa chiamata può essere registrata per migliorare il nostro servizio. Come posso aiutarvi?",
          },
          {
            type: "callout",
            tone: "info",
            title: "Protezione dei dati",
            text: "Stabiliamo con voi per quanto tempo conservare registrazioni e trascrizioni. Vi consigliamo di conservare solo il necessario e di indicare nella vostra informativa sulla privacy che usate un assistente vocale per rispondere alle chiamate.",
          },
          {
            type: "h2",
            id: "voice-language",
            text: "Voce e lingua",
          },
          {
            type: "ul",
            items: [
              "**Voce**: potete scegliere tra voci femminili e maschili, con toni diversi. Nella fase di prova ascoltiamo insieme alcune opzioni.",
              "**Lingua**: la receptionist parla portoghese europeo e inglese. Può iniziare in portoghese e passare all'inglese quando il cliente parla in inglese.",
              "**Tono**: più formale per le cliniche, più disinvolto per un caffè o un bar. Adattiamo il linguaggio al vostro stile.",
            ],
          },
          {
            type: "h2",
            id: "knowledge",
            text: "Domande frequenti e informazioni sull'attività",
          },
          {
            type: "p",
            text: "La receptionist risponde in base alle informazioni che ci date. Più sono chiare e aggiornate, migliori sono le risposte. Includete orari, indirizzo e indicazioni stradali, parcheggio, servizi, prezzi indicativi, regole su cancellazioni e ritardi, e cosa fare nei casi particolari (gruppi numerosi, allergie, bambini, animali).",
          },
          {
            type: "callout",
            tone: "tip",
            text: "Quando cambiano il menù, i prezzi o gli orari, inviateci l'aggiornamento. Le modifiche semplici di solito sono attive entro lo stesso giorno lavorativo.",
          },
          {
            type: "h2",
            id: "bookings",
            text: "Appuntamenti e prenotazioni",
          },
          {
            type: "p",
            text: "Se usate un sistema di prenotazione o un calendario compatibile, come il nostro [sistema di prenotazione online](/it/products/online-booking-system), la receptionist verifica la disponibilità e registra l'appuntamento. Senza integrazione, raccoglie i dati (nome, contatto, data, ora, numero di persone o servizio) e li invia come richiesta che il vostro team confermerà.",
          },
          {
            type: "h2",
            id: "transfers-summaries",
            text: "Trasferimenti e riepiloghi",
          },
          {
            type: "table",
            head: ["Impostazione", "Esempi"],
            rows: [
              ["Quando trasferire", "Richiesta esplicita di parlare con qualcuno, reclamo, urgenza, fornitore"],
              ["A chi trasferire", "Cellulare del responsabile, cellulare di chi è di turno"],
              ["Se nessuno risponde", "Lasciare una richiesta di essere richiamati e avvisare via WhatsApp"],
              ["Riepiloghi", "Via WhatsApp, via email o entrambi; dopo ogni chiamata o in un riepilogo giornaliero"],
            ],
          },
          {
            type: "p",
            text: "Per vedere come funziona tutto questo nella quotidianità, consultate la pagina sull'[utilizzo](/it/docs/ai-voice-receptionist/usage).",
          },
        ],
      },
    },
    usage: {
      pt: {
        title: "Utilização diária da Receção por Voz IA",
        description:
          "Como funciona a Receção por Voz IA no dia a dia: o que acontece numa chamada, como ler os resumos, tratar pedidos de contacto e conhecer os limites do serviço.",
        blocks: [
          {
            type: "p",
            text: "Depois de ativa, a rececionista trabalha sozinha. O seu papel passa a ser ler os resumos, responder aos pedidos de contacto e avisar-nos quando algo muda no negócio. Esta página explica o fluxo típico e as boas práticas.",
          },
          {
            type: "h2",
            id: "fluxo-chamada",
            text: "O que acontece numa chamada",
          },
          {
            type: "ol",
            items: [
              "O cliente liga e ouve a saudação com o nome do negócio e o aviso de gravação.",
              "A rececionista percebe o motivo da chamada e responde, faz perguntas de esclarecimento ou recolhe dados.",
              "Se for uma marcação, confirma data, hora e contacto, e regista-a ou envia-a como pedido.",
              "Se a chamada cumprir as regras de transferência, liga para o telemóvel definido.",
              "No fim, despede-se e é gerado um resumo que recebe por WhatsApp ou email.",
            ],
          },
          {
            type: "h2",
            id: "resumos",
            text: "Ler os resumos das chamadas",
          },
          {
            type: "p",
            text: "Cada resumo inclui, sempre que disponível, o **número de quem ligou**, o **nome**, o **motivo**, a **ação tomada** (respondeu, marcou, transferiu, deixou pedido de contacto) e eventuais notas. Os pedidos que precisam de resposta vêm destacados.",
          },
          {
            type: "callout",
            tone: "tip",
            title: "Crie uma rotina",
            text: "Defina um momento fixo, por exemplo à abertura, para rever os pedidos de contacto da noite. Ligar de volta no mesmo dia faz grande diferença na perceção do cliente.",
          },
          {
            type: "h2",
            id: "limites",
            text: "O que a rececionista não faz",
          },
          {
            type: "ul",
            items: [
              "**Não aceita pagamentos** nem pede dados de cartão por telefone.",
              "**Não dá aconselhamento médico**, diagnósticos ou indicações clínicas; em clínicas, encaminha para a equipa e, em caso de emergência, indica o 112.",
              "**Não promete** descontos, exceções ou condições que não estejam na informação que nos deu.",
              "**Não substitui** a sua equipa em conversas sensíveis, como reclamações graves; nesses casos transfere ou deixa pedido de contacto.",
            ],
          },
          {
            type: "h2",
            id: "sotaques-ruido",
            text: "Sotaques, ruído e chamadas difíceis",
          },
          {
            type: "p",
            text: "A rececionista entende bem sotaques regionais e falantes de inglês com diferentes pronúncias. Em chamadas com muito ruído de fundo, ligação fraca ou pessoas a falar ao mesmo tempo, pode pedir para repetir. Se continuar sem perceber, oferece-se para deixar um pedido de contacto, para que o cliente nunca fique sem resposta.",
          },
          {
            type: "h2",
            id: "melhoria-continua",
            text: "Melhorar ao longo do tempo",
          },
          {
            type: "p",
            text: "Se notar uma pergunta a que a rececionista respondeu mal ou não soube responder, envie-nos o resumo dessa chamada. Acrescentamos a resposta e ajustamos as regras. Para situações técnicas, consulte a [resolução de problemas](/docs/rececao-voz-ia/resolucao-problemas).",
          },
        ],
      },
      en: {
        title: "Using the AI Voice Receptionist day to day",
        description:
          "How the AI Voice Receptionist works day to day: what happens on a call, how to read call summaries, handle callback requests and understand its limits.",
        blocks: [
          {
            type: "p",
            text: "Once live, the receptionist works on its own. Your role becomes reading the summaries, handling callback requests and letting us know when something changes in the business. This page explains the typical flow and good practice.",
          },
          {
            type: "h2",
            id: "call-flow",
            text: "What happens on a call",
          },
          {
            type: "ol",
            items: [
              "The caller hears the greeting with your business name and the recording notice.",
              "The receptionist works out why they are calling and answers, asks clarifying questions or collects details.",
              "For a booking, it confirms the date, time and contact, then records it or sends it as a request.",
              "If the call matches your transfer rules, it rings the mobile you chose.",
              "At the end, it says goodbye and a summary is sent to you by WhatsApp or email.",
            ],
          },
          {
            type: "h2",
            id: "summaries",
            text: "Reading call summaries",
          },
          {
            type: "p",
            text: "Each summary includes, where available, the **caller's number**, **name**, **reason for calling**, **action taken** (answered, booked, transferred, callback requested) and any notes. Requests that need a reply are highlighted.",
          },
          {
            type: "callout",
            tone: "tip",
            title: "Build a routine",
            text: "Set a fixed time, for example at opening, to go through overnight callback requests. Calling back the same day makes a big difference to how customers see you.",
          },
          {
            type: "h2",
            id: "limits",
            text: "What the receptionist won't do",
          },
          {
            type: "ul",
            items: [
              "**It won't take payments** or ask for card details over the phone.",
              "**It won't give medical advice**, diagnoses or clinical guidance; at clinics it routes to the team and, in an emergency, tells the caller to dial 112.",
              "**It won't promise** discounts, exceptions or terms that are not in the information you gave us.",
              "**It won't replace** your team in sensitive conversations such as serious complaints; in those cases it transfers or takes a callback request.",
            ],
          },
          {
            type: "h2",
            id: "accents-noise",
            text: "Accents, noise and difficult calls",
          },
          {
            type: "p",
            text: "The receptionist copes well with regional Portuguese accents and English speakers with different pronunciations. On calls with lots of background noise, a weak signal or people talking over each other, it may ask the caller to repeat. If it still can't understand, it offers to take a callback request so the caller is never left without an answer.",
          },
          {
            type: "h2",
            id: "continuous-improvement",
            text: "Improving over time",
          },
          {
            type: "p",
            text: "If you spot a question the receptionist handled badly or couldn't answer, send us the summary of that call. We add the answer and adjust the rules. For technical issues, see [troubleshooting](/en/docs/ai-voice-receptionist/troubleshooting).",
          },
        ],
      },
      es: {
        title: "Uso diario de la Recepcionista de voz con IA",
        description:
          "Cómo funciona la Recepcionista de voz con IA en el día a día: qué ocurre en una llamada, cómo leer los resúmenes, atender las solicitudes de contacto y conocer los límites del servicio.",
        blocks: [
          {
            type: "p",
            text: "Una vez activa, la recepcionista trabaja sola. Su papel pasa a ser leer los resúmenes, responder a las solicitudes de contacto y avisarnos cuando algo cambia en el negocio. Esta página explica el flujo habitual y las buenas prácticas.",
          },
          {
            type: "h2",
            id: "call-flow",
            text: "Qué ocurre en una llamada",
          },
          {
            type: "ol",
            items: [
              "El cliente llama y oye el saludo con el nombre del negocio y el aviso de grabación.",
              "La recepcionista entiende el motivo de la llamada y responde, hace preguntas para aclarar o recoge datos.",
              "Si es una cita o reserva, confirma la fecha, la hora y el contacto, y la registra o la envía como solicitud.",
              "Si la llamada cumple las reglas de transferencia, llama al móvil definido.",
              "Al final, se despide y se genera un resumen que usted recibe por WhatsApp o email.",
            ],
          },
          {
            type: "h2",
            id: "summaries",
            text: "Leer los resúmenes de las llamadas",
          },
          {
            type: "p",
            text: "Cada resumen incluye, siempre que esté disponible, el **número de quien llamó**, el **nombre**, el **motivo**, la **acción realizada** (respondió, registró la cita, transfirió, dejó una solicitud de contacto) y posibles notas. Las solicitudes que necesitan respuesta aparecen destacadas.",
          },
          {
            type: "callout",
            tone: "tip",
            title: "Cree una rutina",
            text: "Fije un momento, por ejemplo al abrir, para revisar las solicitudes de contacto de la noche. Devolver la llamada el mismo día marca una gran diferencia en la impresión del cliente.",
          },
          {
            type: "h2",
            id: "limits",
            text: "Lo que la recepcionista no hace",
          },
          {
            type: "ul",
            items: [
              "**No acepta pagos** ni pide datos de tarjeta por teléfono.",
              "**No da consejo médico**, diagnósticos ni indicaciones clínicas; en las clínicas deriva al equipo y, en caso de emergencia, indica el 112.",
              "**No promete** descuentos, excepciones ni condiciones que no estén en la información que nos dio.",
              "**No sustituye** a su equipo en conversaciones delicadas, como reclamaciones graves; en esos casos transfiere la llamada o deja una solicitud de contacto.",
            ],
          },
          {
            type: "h2",
            id: "accents-noise",
            text: "Acentos, ruido y llamadas difíciles",
          },
          {
            type: "p",
            text: "La recepcionista entiende bien los acentos regionales portugueses y a hablantes de inglés con distintas pronunciaciones. En llamadas con mucho ruido de fondo, mala cobertura o varias personas hablando a la vez, puede pedir que se repita. Si sigue sin entender, ofrece dejar una solicitud de contacto, para que el cliente nunca se quede sin respuesta.",
          },
          {
            type: "h2",
            id: "continuous-improvement",
            text: "Mejorar con el tiempo",
          },
          {
            type: "p",
            text: "Si nota una pregunta que la recepcionista respondió mal o no supo responder, envíenos el resumen de esa llamada. Añadimos la respuesta y ajustamos las reglas. Para cuestiones técnicas, consulte la [resolución de problemas](/es/docs/ai-voice-receptionist/troubleshooting).",
          },
        ],
      },
      fr: {
        title: "Utilisation au quotidien de la Réceptionniste vocale IA",
        description:
          "Comment fonctionne la Réceptionniste vocale IA au quotidien : ce qui se passe pendant un appel, comment lire les résumés, traiter les demandes de rappel et connaître les limites du service.",
        blocks: [
          {
            type: "p",
            text: "Une fois activée, la réceptionniste travaille seule. Votre rôle consiste à lire les résumés, à traiter les demandes de rappel et à nous prévenir quand quelque chose change dans l'établissement. Cette page explique le déroulement type et les bonnes pratiques.",
          },
          {
            type: "h2",
            id: "call-flow",
            text: "Ce qui se passe pendant un appel",
          },
          {
            type: "ol",
            items: [
              "Le client appelle et entend le message d'accueil avec le nom de l'établissement et l'avis d'enregistrement.",
              "La réceptionniste comprend le motif de l'appel et répond, pose des questions pour préciser ou recueille des informations.",
              "S'il s'agit d'un rendez-vous ou d'une réservation, elle confirme la date, l'heure et le contact, puis l'enregistre ou l'envoie sous forme de demande.",
              "Si l'appel correspond aux règles de transfert, elle appelle le mobile prévu.",
              "À la fin, elle prend congé et un résumé vous est envoyé par WhatsApp ou par e-mail.",
            ],
          },
          {
            type: "h2",
            id: "summaries",
            text: "Lire les résumés d'appel",
          },
          {
            type: "p",
            text: "Chaque résumé comprend, lorsqu'ils sont disponibles, le **numéro de l'appelant**, son **nom**, le **motif**, l'**action menée** (réponse donnée, rendez-vous pris, appel transféré, demande de rappel) et d'éventuelles notes. Les demandes qui attendent une réponse sont mises en évidence.",
          },
          {
            type: "callout",
            tone: "tip",
            title: "Prenez une habitude",
            text: "Fixez un moment, par exemple à l'ouverture, pour passer en revue les demandes de rappel de la nuit. Rappeler le jour même change beaucoup l'image que le client garde de vous.",
          },
          {
            type: "h2",
            id: "limits",
            text: "Ce que la réceptionniste ne fait pas",
          },
          {
            type: "ul",
            items: [
              "**Elle n'accepte pas de paiements** et ne demande pas de données de carte par téléphone.",
              "**Elle ne donne pas de conseils médicaux**, de diagnostics ni d'indications cliniques ; dans une clinique, elle oriente vers l'équipe et, en cas d'urgence, indique le 112.",
              "**Elle ne promet pas** de remises, d'exceptions ni de conditions qui ne figurent pas dans les informations que vous nous avez données.",
              "**Elle ne remplace pas** votre équipe dans les conversations délicates, comme les réclamations graves ; dans ces cas, elle transfère l'appel ou laisse une demande de rappel.",
            ],
          },
          {
            type: "h2",
            id: "accents-noise",
            text: "Accents, bruit et appels difficiles",
          },
          {
            type: "p",
            text: "La réceptionniste comprend bien les accents régionaux portugais et les anglophones aux prononciations variées. Lors d'appels avec beaucoup de bruit de fond, une mauvaise réception ou plusieurs personnes qui parlent en même temps, elle peut demander de répéter. Si elle ne comprend toujours pas, elle propose de laisser une demande de rappel, pour que le client ne reste jamais sans réponse.",
          },
          {
            type: "h2",
            id: "continuous-improvement",
            text: "S'améliorer avec le temps",
          },
          {
            type: "p",
            text: "Si vous repérez une question à laquelle la réceptionniste a mal répondu ou n'a pas su répondre, envoyez-nous le résumé de cet appel. Nous ajoutons la réponse et ajustons les règles. Pour les questions techniques, consultez le [dépannage](/fr/docs/ai-voice-receptionist/troubleshooting).",
          },
        ],
      },
      de: {
        title: "Die KI-Telefonrezeption im Alltag",
        description:
          "So funktioniert die KI-Telefonrezeption im Alltag: was bei einem Anruf passiert, wie Sie Zusammenfassungen lesen, Rückrufbitten bearbeiten und wo die Grenzen des Service liegen.",
        blocks: [
          {
            type: "p",
            text: "Ist sie einmal aktiv, arbeitet die Telefonrezeption selbstständig. Ihre Aufgabe ist es dann, die Zusammenfassungen zu lesen, Rückrufbitten zu beantworten und uns Bescheid zu geben, wenn sich im Betrieb etwas ändert. Diese Seite erklärt den typischen Ablauf und bewährte Vorgehensweisen.",
          },
          {
            type: "h2",
            id: "call-flow",
            text: "Was bei einem Anruf passiert",
          },
          {
            type: "ol",
            items: [
              "Der Anrufer hört die Begrüßung mit dem Namen Ihres Betriebs und den Hinweis auf die Aufzeichnung.",
              "Die Telefonrezeption erkennt den Anrufgrund und antwortet, stellt Rückfragen oder nimmt Angaben auf.",
              "Bei einem Termin oder einer Reservierung bestätigt sie Datum, Uhrzeit und Kontakt und trägt ihn ein oder schickt ihn als Anfrage.",
              "Erfüllt der Anruf Ihre Weiterleitungsregeln, ruft sie das festgelegte Handy an.",
              "Zum Schluss verabschiedet sie sich, und Sie erhalten eine Zusammenfassung per WhatsApp oder E-Mail.",
            ],
          },
          {
            type: "h2",
            id: "summaries",
            text: "Anruf\u00ADzusammenfassungen lesen",
          },
          {
            type: "p",
            text: "Jede Zusammenfassung enthält, soweit vorhanden, die **Nummer des Anrufers**, den **Namen**, den **Anrufgrund**, die **ergriffene Maßnahme** (beantwortet, Termin eingetragen, weitergeleitet, Rückrufbitte aufgenommen) und eventuelle Notizen. Anfragen, die eine Antwort brauchen, sind hervorgehoben.",
          },
          {
            type: "callout",
            tone: "tip",
            title: "Schaffen Sie eine Routine",
            text: "Legen Sie einen festen Zeitpunkt fest, zum Beispiel zur Öffnung, um die Rückrufbitten der Nacht durchzugehen. Ein Rückruf am selben Tag macht für Ihre Kunden einen großen Unterschied.",
          },
          {
            type: "h2",
            id: "limits",
            text: "Was die Telefonrezeption nicht übernimmt",
          },
          {
            type: "ul",
            items: [
              "**Sie nimmt keine Zahlungen an** und fragt am Telefon keine Kartendaten ab.",
              "**Sie gibt keine medizinischen Ratschläge**, Diagnosen oder klinischen Hinweise; in Praxen leitet sie an das Team weiter und nennt im Notfall die 112.",
              "**Sie verspricht keine** Rabatte, Ausnahmen oder Bedingungen, die nicht in den Informationen stehen, die Sie uns gegeben haben.",
              "**Sie ersetzt nicht** Ihr Team bei heiklen Gesprächen wie ernsten Beschwerden; dann leitet sie weiter oder nimmt eine Rückrufbitte auf.",
            ],
          },
          {
            type: "h2",
            id: "accents-noise",
            text: "Akzente, Lärm und schwierige Anrufe",
          },
          {
            type: "p",
            text: "Die Telefonrezeption versteht regionale portugiesische Akzente und Englischsprechende mit unterschiedlicher Aussprache gut. Bei starken Hintergrundgeräuschen, schlechtem Empfang oder wenn mehrere Personen gleichzeitig sprechen, bittet sie unter Umständen um Wiederholung. Versteht sie es dann immer noch nicht, bietet sie an, eine Rückrufbitte aufzunehmen, damit kein Anrufer ohne Antwort bleibt.",
          },
          {
            type: "h2",
            id: "continuous-improvement",
            text: "Mit der Zeit besser werden",
          },
          {
            type: "p",
            text: "Fällt Ihnen eine Frage auf, die die Telefonrezeption schlecht oder gar nicht beantwortet hat, schicken Sie uns die Zusammenfassung dieses Anrufs. Wir ergänzen die Antwort und passen die Regeln an. Bei technischen Problemen lesen Sie die [Fehlerbehebung](/de/docs/ai-voice-receptionist/troubleshooting).",
          },
        ],
      },
      it: {
        title: "Uso quotidiano della Receptionist vocale con IA",
        description:
          "Come funziona la Receptionist vocale con IA ogni giorno: cosa succede durante una chiamata, come leggere i riepiloghi, gestire le richieste di essere richiamati e conoscere i limiti del servizio.",
        blocks: [
          {
            type: "p",
            text: "Una volta attiva, la receptionist lavora da sola. Il vostro compito diventa leggere i riepiloghi, rispondere alle richieste di essere richiamati e avvisarci quando qualcosa cambia nell'attività. Questa pagina spiega il flusso tipico e le buone pratiche.",
          },
          {
            type: "h2",
            id: "call-flow",
            text: "Cosa succede durante una chiamata",
          },
          {
            type: "ol",
            items: [
              "Il cliente chiama e sente il saluto con il nome dell'attività e l'avviso di registrazione.",
              "La receptionist capisce il motivo della chiamata e risponde, fa domande per chiarire o raccoglie i dati.",
              "Se si tratta di un appuntamento o di una prenotazione, conferma data, ora e contatto, poi lo registra o lo invia come richiesta.",
              "Se la chiamata rientra nelle regole di trasferimento, chiama il cellulare stabilito.",
              "Alla fine si congeda e viene generato un riepilogo che ricevete via WhatsApp o email.",
            ],
          },
          {
            type: "h2",
            id: "summaries",
            text: "Leggere i riepiloghi delle chiamate",
          },
          {
            type: "p",
            text: "Ogni riepilogo include, quando disponibili, il **numero di chi ha chiamato**, il **nome**, il **motivo**, l'**azione svolta** (ha risposto, ha prenotato, ha trasferito, ha lasciato una richiesta di essere richiamati) ed eventuali note. Le richieste che hanno bisogno di risposta sono evidenziate.",
          },
          {
            type: "callout",
            tone: "tip",
            title: "Create una routine",
            text: "Stabilite un momento fisso, per esempio all'apertura, per rivedere le richieste arrivate durante la notte. Richiamare il giorno stesso fa una grande differenza nell'impressione del cliente.",
          },
          {
            type: "h2",
            id: "limits",
            text: "Cosa non fa la receptionist",
          },
          {
            type: "ul",
            items: [
              "**Non accetta pagamenti** e non chiede i dati della carta al telefono.",
              "**Non dà consigli medici**, diagnosi o indicazioni cliniche; nelle cliniche inoltra al team e, in caso di emergenza, indica il 112.",
              "**Non promette** sconti, eccezioni o condizioni che non siano nelle informazioni che ci avete dato.",
              "**Non sostituisce** il vostro team nelle conversazioni delicate, come i reclami gravi; in questi casi trasferisce la chiamata o lascia una richiesta di essere richiamati.",
            ],
          },
          {
            type: "h2",
            id: "accents-noise",
            text: "Accenti, rumore e chiamate difficili",
          },
          {
            type: "p",
            text: "La receptionist capisce bene gli accenti regionali portoghesi e chi parla inglese con pronunce diverse. Nelle chiamate con molto rumore di fondo, segnale debole o più persone che parlano insieme, può chiedere di ripetere. Se continua a non capire, si offre di lasciare una richiesta di essere richiamati, così il cliente non resta mai senza risposta.",
          },
          {
            type: "h2",
            id: "continuous-improvement",
            text: "Migliorare nel tempo",
          },
          {
            type: "p",
            text: "Se notate una domanda a cui la receptionist ha risposto male o non ha saputo rispondere, inviateci il riepilogo di quella chiamata. Aggiungiamo la risposta e aggiorniamo le regole. Per le questioni tecniche, consultate la [risoluzione dei problemi](/it/docs/ai-voice-receptionist/troubleshooting).",
          },
        ],
      },
    },
    troubleshooting: {
      pt: {
        title: "Resolução de problemas da Receção por Voz IA",
        description:
          "Soluções para os problemas mais comuns da Receção por Voz IA: chamadas que não chegam, transferências falhadas, resumos em falta e respostas incorretas.",
        blocks: [
          {
            type: "p",
            text: "A maioria dos problemas tem origem no reencaminhamento do operador ou em informação desatualizada. Antes de nos contactar, verifique os pontos abaixo. Se o problema continuar, envie-nos uma mensagem com a hora aproximada da chamada e o número de onde ligou.",
          },
          {
            type: "h2",
            id: "chamadas-nao-chegam",
            text: "As chamadas não chegam à rececionista",
          },
          {
            type: "steps",
            items: [
              {
                title: "Confirme o estado do reencaminhamento",
                body: "Em muitas linhas móveis, marcar `*#21#`, `*#61#` ou `*#67#` mostra se o reencaminhamento correspondente está ativo e para que número.",
              },
              {
                title: "Verifique o número de destino",
                body: "Confirme que o número configurado é exatamente o que lhe indicámos, com o indicativo correto.",
              },
              {
                title: "Faça uma chamada de teste",
                body: "Ligue de outro telefone para o seu número, sem atender, e aguarde. Se ouvir a saudação, o reencaminhamento está a funcionar.",
              },
              {
                title: "Contacte o operador",
                body: "Se os códigos não funcionarem, o seu tarifário pode ter o reencaminhamento bloqueado ou exigir ativação pelo apoio ao cliente do operador.",
              },
            ],
          },
          {
            type: "h2",
            id: "atende-cedo-tarde",
            text: "A rececionista atende cedo ou tarde demais",
          },
          {
            type: "p",
            text: "No reencaminhamento quando não atende, o tempo até a chamada passar para a rececionista é definido pelo operador. Em muitas redes é possível ajustá-lo com um código como `**61*NUMERO**TEMPO#`, em que o tempo é normalmente um múltiplo de 5 segundos até 30. Confirme com o seu operador se esta opção existe no seu tarifário.",
          },
          {
            type: "h2",
            id: "transferencias-falham",
            text: "As transferências falham",
          },
          {
            type: "ul",
            items: [
              "Confirme que o telemóvel de destino tem rede e não está em modo não incomodar.",
              "Verifique se esse telemóvel não reencaminha, por sua vez, para o correio de voz demasiado depressa.",
              "Se mudou de pessoa de serviço ou de número, avise-nos para atualizarmos as regras.",
            ],
          },
          {
            type: "h2",
            id: "resumos-em-falta",
            text: "Não recebo os resumos",
          },
          {
            type: "p",
            text: "Verifique a pasta de spam ou promoções do email e adicione o remetente aos contactos. No WhatsApp, confirme que não bloqueou nem arquivou a conversa. Se mudou de número ou email, diga-nos para atualizar o destino.",
          },
          {
            type: "h2",
            id: "respostas-incorretas",
            text: "A rececionista deu uma resposta errada",
          },
          {
            type: "p",
            text: "Normalmente acontece quando a informação mudou (horário, preços, menu) e não foi atualizada, ou quando a pergunta não estava prevista. Envie-nos o resumo da chamada e a resposta correta; corrigimos rapidamente.",
          },
          {
            type: "callout",
            tone: "warning",
            title: "Desligar em caso de emergência",
            text: "Se precisar de desligar a rececionista de imediato, desative o reencaminhamento (por exemplo com `##002#`, se o seu operador suportar) e avise-nos pelo [contacto](/contacto) ou WhatsApp.",
          },
        ],
      },
      en: {
        title: "Troubleshooting the AI Voice Receptionist",
        description:
          "Fixes for the most common AI Voice Receptionist issues: calls not arriving, failed transfers, missing call summaries and incorrect answers to callers.",
        blocks: [
          {
            type: "p",
            text: "Most issues come down to operator forwarding or out-of-date information. Before contacting us, check the points below. If the problem persists, send us a message with the approximate time of the call and the number you called from.",
          },
          {
            type: "h2",
            id: "calls-not-arriving",
            text: "Calls are not reaching the receptionist",
          },
          {
            type: "steps",
            items: [
              {
                title: "Check the forwarding status",
                body: "On many mobile lines, dialling `*#21#`, `*#61#` or `*#67#` shows whether that forwarding is active and to which number.",
              },
              {
                title: "Check the destination number",
                body: "Make sure the number set up is exactly the one we gave you, with the right country code.",
              },
              {
                title: "Make a test call",
                body: "Call your number from another phone, don't answer, and wait. If you hear the greeting, forwarding is working.",
              },
              {
                title: "Contact your operator",
                body: "If the codes don't work, your plan may block forwarding or require it to be switched on through the operator's customer service.",
              },
            ],
          },
          {
            type: "h2",
            id: "answers-too-early-late",
            text: "The receptionist picks up too early or too late",
          },
          {
            type: "p",
            text: "With forwarding on no answer, the delay before the call passes to the receptionist is set by the operator. On many networks you can adjust it with a code such as `**61*NUMBER**TIME#`, where the time is usually a multiple of 5 seconds up to 30. Check with your operator whether your plan supports this.",
          },
          {
            type: "h2",
            id: "transfers-failing",
            text: "Transfers are failing",
          },
          {
            type: "ul",
            items: [
              "Make sure the destination mobile has signal and is not on do not disturb.",
              "Check that the mobile is not itself sending calls to voicemail too quickly.",
              "If the person on duty or their number has changed, let us know so we can update the rules.",
            ],
          },
          {
            type: "h2",
            id: "missing-summaries",
            text: "I'm not receiving summaries",
          },
          {
            type: "p",
            text: "Check your spam or promotions folder and add the sender to your contacts. On WhatsApp, make sure you haven't blocked or archived the chat. If your number or email has changed, tell us so we can update it.",
          },
          {
            type: "h2",
            id: "wrong-answers",
            text: "The receptionist gave a wrong answer",
          },
          {
            type: "p",
            text: "This usually happens when information has changed (hours, prices, menu) and wasn't updated, or when the question wasn't anticipated. Send us the call summary and the correct answer and we will fix it quickly.",
          },
          {
            type: "callout",
            tone: "warning",
            title: "Switching off in an emergency",
            text: "If you need to take the receptionist offline straight away, cancel forwarding (for example with `##002#`, if your operator supports it) and let us know via the [contact page](/en/contact) or WhatsApp.",
          },
        ],
      },
      es: {
        title: "Resolución de problemas de la Recepcionista de voz con IA",
        description:
          "Soluciones a los problemas más comunes de la Recepcionista de voz con IA: llamadas que no llegan, transferencias fallidas, resúmenes que faltan y respuestas incorrectas.",
        blocks: [
          {
            type: "p",
            text: "La mayoría de los problemas viene del desvío del operador o de información desactualizada. Antes de contactarnos, revise los puntos siguientes. Si el problema continúa, envíenos un mensaje con la hora aproximada de la llamada y el número desde el que llamó.",
          },
          {
            type: "h2",
            id: "calls-not-arriving",
            text: "Las llamadas no llegan a la recepcionista",
          },
          {
            type: "steps",
            items: [
              {
                title: "Compruebe el estado del desvío",
                body: "En muchas líneas móviles, marcar `*#21#`, `*#61#` o `*#67#` muestra si el desvío correspondiente está activo y hacia qué número.",
              },
              {
                title: "Revise el número de destino",
                body: "Confirme que el número configurado es exactamente el que le indicamos, con el prefijo correcto.",
              },
              {
                title: "Haga una llamada de prueba",
                body: "Llame a su número desde otro teléfono, no conteste y espere. Si oye el saludo, el desvío funciona.",
              },
              {
                title: "Contacte con su operador",
                body: "Si los códigos no funcionan, puede que su tarifa tenga el desvío bloqueado o que haya que activarlo a través de la atención al cliente del operador.",
              },
            ],
          },
          {
            type: "h2",
            id: "answers-too-early-late",
            text: "La recepcionista contesta demasiado pronto o demasiado tarde",
          },
          {
            type: "p",
            text: "En el desvío cuando no contesta, el tiempo que pasa hasta que la llamada llega a la recepcionista lo fija el operador. En muchas redes se puede ajustar con un código como `**61*NUMERO**TIEMPO#`, donde el tiempo suele ser un múltiplo de 5 segundos hasta 30. Confirme con su operador si su tarifa lo permite.",
          },
          {
            type: "h2",
            id: "transfers-failing",
            text: "Las transferencias fallan",
          },
          {
            type: "ul",
            items: [
              "Confirme que el móvil de destino tiene cobertura y no está en modo no molestar.",
              "Compruebe que ese móvil no desvía a su vez al buzón de voz demasiado rápido.",
              "Si ha cambiado la persona de turno o su número, avísenos para actualizar las reglas.",
            ],
          },
          {
            type: "h2",
            id: "missing-summaries",
            text: "No recibo los resúmenes",
          },
          {
            type: "p",
            text: "Revise la carpeta de spam o de promociones del email y añada el remitente a sus contactos. En WhatsApp, confirme que no ha bloqueado ni archivado la conversación. Si ha cambiado de número o de email, díganoslo para actualizar el destino.",
          },
          {
            type: "h2",
            id: "wrong-answers",
            text: "La recepcionista dio una respuesta incorrecta",
          },
          {
            type: "p",
            text: "Suele ocurrir cuando la información ha cambiado (horario, precios, carta) y no se ha actualizado, o cuando la pregunta no estaba prevista. Envíenos el resumen de la llamada y la respuesta correcta; lo corregimos rápidamente.",
          },
          {
            type: "callout",
            tone: "warning",
            title: "Desconectar en caso de emergencia",
            text: "Si necesita desconectar la recepcionista de inmediato, desactive el desvío (por ejemplo con `##002#`, si su operador lo admite) y avísenos a través de la [página de contacto](/es/contact) o por WhatsApp.",
          },
        ],
      },
      fr: {
        title: "Dépannage de la Réceptionniste vocale IA",
        description:
          "Solutions aux problèmes les plus courants de la Réceptionniste vocale IA : appels qui n'arrivent pas, transferts qui échouent, résumés manquants et réponses incorrectes.",
        blocks: [
          {
            type: "p",
            text: "La plupart des problèmes viennent du renvoi chez l'opérateur ou d'informations qui ne sont plus à jour. Avant de nous contacter, vérifiez les points ci-dessous. Si le problème persiste, envoyez-nous un message avec l'heure approximative de l'appel et le numéro depuis lequel vous avez appelé.",
          },
          {
            type: "h2",
            id: "calls-not-arriving",
            text: "Les appels n'arrivent pas à la réceptionniste",
          },
          {
            type: "steps",
            items: [
              {
                title: "Vérifiez l'état du renvoi",
                body: "Sur beaucoup de lignes mobiles, composer `*#21#`, `*#61#` ou `*#67#` indique si le renvoi correspondant est actif et vers quel numéro.",
              },
              {
                title: "Vérifiez le numéro de destination",
                body: "Assurez-vous que le numéro configuré est exactement celui que nous vous avons donné, avec le bon indicatif.",
              },
              {
                title: "Faites un appel de test",
                body: "Appelez votre numéro depuis un autre téléphone, ne décrochez pas et patientez. Si vous entendez le message d'accueil, le renvoi fonctionne.",
              },
              {
                title: "Contactez votre opérateur",
                body: "Si les codes ne fonctionnent pas, votre forfait bloque peut-être le renvoi ou exige de l'activer auprès du service client de l'opérateur.",
              },
            ],
          },
          {
            type: "h2",
            id: "answers-too-early-late",
            text: "La réceptionniste décroche trop tôt ou trop tard",
          },
          {
            type: "p",
            text: "Pour le renvoi en cas de non-réponse, le délai avant que l'appel passe à la réceptionniste est fixé par l'opérateur. Sur beaucoup de réseaux, on peut le régler avec un code comme `**61*NUMERO**DELAI#`, où le délai est en général un multiple de 5 secondes, jusqu'à 30. Vérifiez auprès de votre opérateur si votre forfait le permet.",
          },
          {
            type: "h2",
            id: "transfers-failing",
            text: "Les transferts échouent",
          },
          {
            type: "ul",
            items: [
              "Vérifiez que le mobile de destination a du réseau et n'est pas en mode ne pas déranger.",
              "Vérifiez que ce mobile ne renvoie pas lui-même trop vite vers la messagerie vocale.",
              "Si la personne de service ou son numéro a changé, prévenez-nous pour que nous mettions à jour les règles.",
            ],
          },
          {
            type: "h2",
            id: "missing-summaries",
            text: "Je ne reçois pas les résumés",
          },
          {
            type: "p",
            text: "Vérifiez le dossier spam ou promotions de votre messagerie et ajoutez l'expéditeur à vos contacts. Sur WhatsApp, vérifiez que vous n'avez pas bloqué ni archivé la conversation. Si votre numéro ou votre e-mail a changé, dites-le-nous pour que nous mettions à jour le destinataire.",
          },
          {
            type: "h2",
            id: "wrong-answers",
            text: "La réceptionniste a donné une mauvaise réponse",
          },
          {
            type: "p",
            text: "Cela arrive en général quand une information a changé (horaires, prix, carte) sans être mise à jour, ou quand la question n'était pas prévue. Envoyez-nous le résumé de l'appel et la bonne réponse ; nous corrigeons rapidement.",
          },
          {
            type: "callout",
            tone: "warning",
            title: "Couper en cas d'urgence",
            text: "Si vous devez couper la réceptionniste immédiatement, désactivez le renvoi (par exemple avec `##002#`, si votre opérateur le permet) et prévenez-nous via la [page de contact](/fr/contact) ou WhatsApp.",
          },
        ],
      },
      de: {
        title: "Fehlerbehebung bei der KI-Telefonrezeption",
        description:
          "Lösungen für die häufigsten Probleme der KI-Telefonrezeption: Anrufe kommen nicht an, Weiterleitungen schlagen fehl, Zusammenfassungen fehlen oder Antworten sind falsch.",
        blocks: [
          {
            type: "p",
            text: "Die meisten Probleme liegen an der Rufumleitung beim Anbieter oder an veralteten Informationen. Prüfen Sie die folgenden Punkte, bevor Sie uns kontaktieren. Besteht das Problem weiter, schicken Sie uns eine Nachricht mit der ungefähren Uhrzeit des Anrufs und der Nummer, von der aus Sie angerufen haben.",
          },
          {
            type: "h2",
            id: "calls-not-arriving",
            text: "Anrufe kommen nicht bei der Telefonrezeption an",
          },
          {
            type: "steps",
            items: [
              {
                title: "Status der Umleitung prüfen",
                body: "Bei vielen Mobilfunkanschlüssen zeigt die Eingabe von `*#21#`, `*#61#` oder `*#67#`, ob die jeweilige Umleitung aktiv ist und auf welche Nummer.",
              },
              {
                title: "Zielnummer prüfen",
                body: "Stellen Sie sicher, dass die eingestellte Nummer genau die ist, die wir Ihnen genannt haben, mit der richtigen Ländervorwahl.",
              },
              {
                title: "Testanruf machen",
                body: "Rufen Sie Ihre Nummer von einem anderen Telefon aus an, nehmen Sie nicht ab und warten Sie. Hören Sie die Begrüßung, funktioniert die Umleitung.",
              },
              {
                title: "Anbieter kontaktieren",
                body: "Funktionieren die Codes nicht, ist die Umleitung in Ihrem Tarif möglicherweise gesperrt oder muss über den Kundenservice des Anbieters eingeschaltet werden.",
              },
            ],
          },
          {
            type: "h2",
            id: "answers-too-early-late",
            text: "Die Telefonrezeption nimmt zu früh oder zu spät ab",
          },
          {
            type: "p",
            text: "Bei der Umleitung, wenn niemand abnimmt, legt der Anbieter fest, wie lange es dauert, bis der Anruf an die Telefonrezeption geht. In vielen Netzen lässt sich das mit einem Code wie `**61*NUMMER**ZEIT#` einstellen, wobei die Zeit meist ein Vielfaches von 5 Sekunden bis 30 ist. Fragen Sie Ihren Anbieter, ob Ihr Tarif das unterstützt.",
          },
          {
            type: "h2",
            id: "transfers-failing",
            text: "Weiterleitungen schlagen fehl",
          },
          {
            type: "ul",
            items: [
              "Prüfen Sie, ob das Zielhandy Empfang hat und nicht auf „Nicht stören“ steht.",
              "Prüfen Sie, ob dieses Handy Anrufe nicht selbst zu schnell an die Mailbox weiterleitet.",
              "Hat die diensthabende Person oder ihre Nummer gewechselt, sagen Sie uns Bescheid, damit wir die Regeln aktualisieren.",
            ],
          },
          {
            type: "h2",
            id: "missing-summaries",
            text: "Ich erhalte keine Zusammenfassungen",
          },
          {
            type: "p",
            text: "Sehen Sie im Spam- oder Werbeordner Ihres E-Mail-Postfachs nach und fügen Sie den Absender Ihren Kontakten hinzu. Prüfen Sie bei WhatsApp, dass Sie den Chat nicht blockiert oder archiviert haben. Haben sich Ihre Nummer oder E-Mail-Adresse geändert, teilen Sie es uns mit, damit wir das Ziel aktualisieren.",
          },
          {
            type: "h2",
            id: "wrong-answers",
            text: "Die Telefonrezeption hat falsch geantwortet",
          },
          {
            type: "p",
            text: "Das passiert meist, wenn sich Informationen geändert haben (Öffnungszeiten, Preise, Speisekarte) und nicht aktualisiert wurden, oder wenn die Frage nicht vorgesehen war. Schicken Sie uns die Zusammenfassung des Anrufs und die richtige Antwort; wir korrigieren es schnell.",
          },
          {
            type: "callout",
            tone: "warning",
            title: "Im Notfall abschalten",
            text: "Müssen Sie die Telefonrezeption sofort abschalten, deaktivieren Sie die Umleitung (zum Beispiel mit `##002#`, wenn Ihr Anbieter das unterstützt) und geben Sie uns über die [Kontaktseite](/de/contact) oder per WhatsApp Bescheid.",
          },
        ],
      },
      it: {
        title: "Risoluzione dei problemi della Receptionist vocale con IA",
        description:
          "Soluzioni ai problemi più comuni della Receptionist vocale con IA: chiamate che non arrivano, trasferimenti non riusciti, riepiloghi mancanti e risposte errate.",
        blocks: [
          {
            type: "p",
            text: "La maggior parte dei problemi nasce dalla deviazione dell'operatore o da informazioni non aggiornate. Prima di contattarci, controllate i punti qui sotto. Se il problema continua, mandateci un messaggio con l'ora approssimativa della chiamata e il numero da cui avete chiamato.",
          },
          {
            type: "h2",
            id: "calls-not-arriving",
            text: "Le chiamate non arrivano alla receptionist",
          },
          {
            type: "steps",
            items: [
              {
                title: "Controllate lo stato della deviazione",
                body: "Su molte linee mobili, digitando `*#21#`, `*#61#` o `*#67#` si vede se la deviazione corrispondente è attiva e verso quale numero.",
              },
              {
                title: "Verificate il numero di destinazione",
                body: "Assicuratevi che il numero impostato sia esattamente quello che vi abbiamo indicato, con il prefisso corretto.",
              },
              {
                title: "Fate una chiamata di prova",
                body: "Chiamate il vostro numero da un altro telefono, non rispondete e aspettate. Se sentite il saluto, la deviazione funziona.",
              },
              {
                title: "Contattate l'operatore",
                body: "Se i codici non funzionano, il vostro piano potrebbe avere la deviazione bloccata o richiedere l'attivazione tramite il servizio clienti dell'operatore.",
              },
            ],
          },
          {
            type: "h2",
            id: "answers-too-early-late",
            text: "La receptionist risponde troppo presto o troppo tardi",
          },
          {
            type: "p",
            text: "Nella deviazione per mancata risposta, il tempo prima che la chiamata passi alla receptionist è stabilito dall'operatore. Su molte reti si può regolare con un codice come `**61*NUMERO**TEMPO#`, dove il tempo di solito è un multiplo di 5 secondi fino a 30. Verificate con il vostro operatore se il vostro piano lo prevede.",
          },
          {
            type: "h2",
            id: "transfers-failing",
            text: "I trasferimenti non riescono",
          },
          {
            type: "ul",
            items: [
              "Verificate che il cellulare di destinazione abbia campo e non sia in modalità non disturbare.",
              "Controllate che quel cellulare non devii a sua volta troppo presto alla segreteria.",
              "Se è cambiata la persona di turno o il suo numero, avvisateci per aggiornare le regole.",
            ],
          },
          {
            type: "h2",
            id: "missing-summaries",
            text: "Non ricevo i riepiloghi",
          },
          {
            type: "p",
            text: "Controllate la cartella spam o promozioni della posta e aggiungete il mittente ai contatti. Su WhatsApp, verificate di non aver bloccato o archiviato la chat. Se avete cambiato numero o email, ditecelo per aggiornare la destinazione.",
          },
          {
            type: "h2",
            id: "wrong-answers",
            text: "La receptionist ha dato una risposta sbagliata",
          },
          {
            type: "p",
            text: "Di solito succede quando un'informazione è cambiata (orari, prezzi, menù) e non è stata aggiornata, oppure quando la domanda non era prevista. Inviateci il riepilogo della chiamata e la risposta corretta; correggiamo rapidamente.",
          },
          {
            type: "callout",
            tone: "warning",
            title: "Disattivare in caso di emergenza",
            text: "Se dovete disattivare subito la receptionist, disattivate la deviazione (per esempio con `##002#`, se il vostro operatore lo supporta) e avvisateci tramite la [pagina dei contatti](/it/contact) o WhatsApp.",
          },
        ],
      },
    },
    faq: {
      pt: {
        title: "Perguntas frequentes sobre a Receção por Voz IA",
        description:
          "Respostas às dúvidas mais comuns sobre a Receção por Voz IA: número de telefone, idiomas, gravação e RGPD, marcações, transferências, custos e cancelamento.",
        blocks: [
          {
            type: "p",
            text: "Reunimos aqui as perguntas que os clientes nos fazem com mais frequência. Se não encontrar a sua, [fale connosco](/contacto).",
          },
          {
            type: "h2",
            id: "perguntas",
            text: "Perguntas e respostas",
          },
          {
            type: "faq",
            items: [
              {
                q: "Tenho de mudar de número de telefone?",
                a: "Não. Pode manter o seu número e reencaminhar as chamadas para a rececionista, apenas quando está ocupado, não atende ou fora de horas. Também pode optar por um número novo dedicado.",
              },
              {
                q: "Os clientes percebem que estão a falar com uma IA?",
                a: "Sim, e é assim que deve ser. A saudação apresenta a rececionista como assistente virtual. A conversa é natural, mas não fingimos que é uma pessoa.",
              },
              {
                q: "Em que idiomas atende?",
                a: "Em português europeu e inglês. Pode mudar de idioma durante a chamada, conforme a língua em que o cliente fala.",
              },
              {
                q: "As chamadas são gravadas? E o RGPD?",
                a: "Pode escolher gravar ou apenas transcrever. Em qualquer caso, o cliente é informado no início da chamada. Definimos consigo o prazo de conservação e recomendamos atualizar a sua política de privacidade.",
              },
              {
                q: "Consegue fazer marcações no meu sistema?",
                a: "Sim, quando o sistema de reservas ou calendário permite integração. Caso contrário, a rececionista recolhe os dados e envia-os como pedido para a sua equipa confirmar.",
              },
              {
                q: "O que acontece se alguém precisar mesmo de falar com uma pessoa?",
                a: "A rececionista transfere a chamada para o telemóvel que definir. Se ninguém atender, deixa um pedido de contacto e avisa-o por WhatsApp ou email.",
              },
              {
                q: "Pode aceitar pagamentos ou dar indicações médicas?",
                a: "Não. A rececionista não aceita pagamentos nem dados de cartão e não dá aconselhamento médico. Nestes casos encaminha para a sua equipa.",
              },
              {
                q: "O reencaminhamento tem custos?",
                a: "Depende do seu operador e tarifário. Algumas chamadas reencaminhadas são cobradas como chamadas feitas por si. Confirme com o seu operador antes de ativar.",
              },
              {
                q: "Quanto tempo demora a instalação?",
                a: "Normalmente alguns dias úteis. O prazo depende sobretudo da informação que nos envia e da integração com o sistema de reservas.",
              },
              {
                q: "Posso cancelar o serviço?",
                a: "Sim. Basta desativar o reencaminhamento e avisar-nos. As condições de cancelamento estão descritas na proposta que recebe antes de começar.",
              },
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "Quer ouvir como soa? [Marque uma demonstração](/agendar) e fazemos uma chamada de exemplo com informação do seu negócio.",
          },
        ],
      },
      en: {
        title: "AI Voice Receptionist FAQ",
        description:
          "Answers to common questions about the AI Voice Receptionist: phone numbers, languages, call recording and GDPR, bookings, transfers, costs and cancelling.",
        blocks: [
          {
            type: "p",
            text: "Here are the questions customers ask us most often. If yours isn't here, [get in touch](/en/contact).",
          },
          {
            type: "h2",
            id: "questions",
            text: "Questions and answers",
          },
          {
            type: "faq",
            items: [
              {
                q: "Do I need to change my phone number?",
                a: "No. You can keep your number and forward calls to the receptionist, only when you are busy, don't answer or are closed. You can also choose a new dedicated number.",
              },
              {
                q: "Will callers know they are talking to an AI?",
                a: "Yes, and that's how it should be. The greeting introduces the receptionist as a virtual assistant. The conversation feels natural, but we never pretend it is a person.",
              },
              {
                q: "Which languages does it speak?",
                a: "European Portuguese and English. It can switch language mid-call, depending on how the caller speaks.",
              },
              {
                q: "Are calls recorded? What about GDPR?",
                a: "You can choose to record or only transcribe. Either way, callers are told at the start of the call. We agree the retention period with you and recommend updating your privacy policy.",
              },
              {
                q: "Can it book appointments in my system?",
                a: "Yes, when your booking system or calendar supports an integration. Otherwise, the receptionist collects the details and sends them as a request for your team to confirm.",
              },
              {
                q: "What if someone really needs to speak to a person?",
                a: "The receptionist transfers the call to the mobile you choose. If nobody answers, it takes a callback request and alerts you by WhatsApp or email.",
              },
              {
                q: "Can it take payments or give medical advice?",
                a: "No. The receptionist doesn't take payments or card details and doesn't give medical advice. In those cases it routes the caller to your team.",
              },
              {
                q: "Does call forwarding cost anything?",
                a: "It depends on your operator and plan. Some forwarded calls are charged as calls made by you. Check with your operator before switching it on.",
              },
              {
                q: "How long does setup take?",
                a: "Usually a few working days. It depends mainly on how quickly we receive your information and on the booking system integration.",
              },
              {
                q: "Can I cancel?",
                a: "Yes. Just cancel forwarding and let us know. Cancellation terms are set out in the proposal you receive before we start.",
              },
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "Want to hear what it sounds like? [Book a demo](/en/book-a-demo) and we'll run a sample call with your business information.",
          },
        ],
      },
      es: {
        title: "Preguntas frecuentes sobre la Recepcionista de voz con IA",
        description:
          "Respuestas a las dudas más comunes sobre la Recepcionista de voz con IA: número de teléfono, idiomas, grabación y RGPD, citas, transferencias, costes y cancelación.",
        blocks: [
          {
            type: "p",
            text: "Aquí reunimos las preguntas que los clientes nos hacen con más frecuencia. Si no encuentra la suya, [hable con nosotros](/es/contact).",
          },
          {
            type: "h2",
            id: "questions",
            text: "Preguntas y respuestas",
          },
          {
            type: "faq",
            items: [
              {
                q: "¿Tengo que cambiar de número de teléfono?",
                a: "No. Puede mantener su número y desviar las llamadas a la recepcionista, solo cuando está ocupado, no contesta o fuera de horario. También puede optar por un número nuevo dedicado.",
              },
              {
                q: "¿Los clientes se dan cuenta de que hablan con una IA?",
                a: "Sí, y así debe ser. El saludo presenta a la recepcionista como asistente virtual. La conversación es natural, pero nunca fingimos que es una persona.",
              },
              {
                q: "¿En qué idiomas atiende?",
                a: "En portugués europeo e inglés. Puede cambiar de idioma durante la llamada, según el idioma en que hable el cliente.",
              },
              {
                q: "¿Se graban las llamadas? ¿Y el RGPD?",
                a: "Puede elegir grabar o solo transcribir. En cualquier caso, el cliente es informado al inicio de la llamada. Acordamos con usted el plazo de conservación y le recomendamos actualizar su política de privacidad.",
              },
              {
                q: "¿Puede registrar citas en mi sistema?",
                a: "Sí, cuando el sistema de reservas o calendario permite integración. Si no, la recepcionista recoge los datos y los envía como solicitud para que su equipo la confirme.",
              },
              {
                q: "¿Qué pasa si alguien necesita de verdad hablar con una persona?",
                a: "La recepcionista transfiere la llamada al móvil que usted elija. Si nadie contesta, deja una solicitud de contacto y le avisa por WhatsApp o email.",
              },
              {
                q: "¿Puede aceptar pagos o dar indicaciones médicas?",
                a: "No. La recepcionista no acepta pagos ni datos de tarjeta y no da consejo médico. En esos casos deriva a su equipo.",
              },
              {
                q: "¿El desvío de llamadas tiene coste?",
                a: "Depende de su operador y de su tarifa. Algunas llamadas desviadas se cobran como llamadas hechas por usted. Confírmelo con su operador antes de activarlo.",
              },
              {
                q: "¿Cuánto tarda la instalación?",
                a: "Normalmente unos pocos días laborables. El plazo depende sobre todo de la información que nos envíe y de la integración con el sistema de reservas.",
              },
              {
                q: "¿Puedo cancelar el servicio?",
                a: "Sí. Basta con desactivar el desvío y avisarnos. Las condiciones de cancelación figuran en la propuesta que recibe antes de empezar.",
              },
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "¿Quiere oír cómo suena? [Reserve una demostración](/es/book-a-demo) y hacemos una llamada de ejemplo con la información de su negocio.",
          },
        ],
      },
      fr: {
        title: "Questions fréquentes sur la Réceptionniste vocale IA",
        description:
          "Réponses aux questions les plus courantes sur la Réceptionniste vocale IA : numéro de téléphone, langues, enregistrement et RGPD, rendez-vous, transferts, coûts et résiliation.",
        blocks: [
          {
            type: "p",
            text: "Voici les questions que nos clients nous posent le plus souvent. Si vous ne trouvez pas la vôtre, [écrivez-nous](/fr/contact).",
          },
          {
            type: "h2",
            id: "questions",
            text: "Questions et réponses",
          },
          {
            type: "faq",
            items: [
              {
                q: "Dois-je changer de numéro de téléphone ?",
                a: "Non. Vous pouvez garder votre numéro et renvoyer les appels vers la réceptionniste, seulement quand vous êtes occupé, ne répondez pas ou êtes fermé. Vous pouvez aussi choisir un nouveau numéro dédié.",
              },
              {
                q: "Les clients savent-ils qu'ils parlent à une IA ?",
                a: "Oui, et c'est normal. Le message d'accueil présente la réceptionniste comme une assistante virtuelle. La conversation est naturelle, mais nous ne faisons jamais croire qu'il s'agit d'une personne.",
              },
              {
                q: "Dans quelles langues répond-elle ?",
                a: "En portugais européen et en anglais. Elle peut changer de langue pendant l'appel, selon la langue que parle le client.",
              },
              {
                q: "Les appels sont-ils enregistrés ? Et le RGPD ?",
                a: "Vous pouvez choisir d'enregistrer ou seulement de transcrire. Dans tous les cas, le client en est informé au début de l'appel. Nous convenons avec vous de la durée de conservation et recommandons de mettre à jour votre politique de confidentialité.",
              },
              {
                q: "Peut-elle prendre des rendez-vous dans mon système ?",
                a: "Oui, si votre système de réservation ou votre agenda permet une intégration. Sinon, la réceptionniste recueille les informations et les envoie sous forme de demande que votre équipe confirmera.",
              },
              {
                q: "Et si quelqu'un a vraiment besoin de parler à une personne ?",
                a: "La réceptionniste transfère l'appel vers le mobile que vous choisissez. Si personne ne répond, elle laisse une demande de rappel et vous prévient par WhatsApp ou par e-mail.",
              },
              {
                q: "Peut-elle accepter des paiements ou donner des conseils médicaux ?",
                a: "Non. La réceptionniste n'accepte ni paiements ni données de carte et ne donne pas de conseils médicaux. Dans ces cas, elle oriente vers votre équipe.",
              },
              {
                q: "Le renvoi d'appel est-il payant ?",
                a: "Cela dépend de votre opérateur et de votre forfait. Certains appels renvoyés sont facturés comme des appels passés par vous. Vérifiez auprès de votre opérateur avant de l'activer.",
              },
              {
                q: "Combien de temps prend l'installation ?",
                a: "En général quelques jours ouvrés. Le délai dépend surtout des informations que vous nous envoyez et de l'intégration avec le système de réservation.",
              },
              {
                q: "Puis-je résilier le service ?",
                a: "Oui. Il suffit de désactiver le renvoi et de nous prévenir. Les conditions de résiliation figurent dans la proposition que vous recevez avant de commencer.",
              },
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "Vous voulez l'entendre ? [Réservez une démonstration](/fr/book-a-demo) et nous faisons un appel d'exemple avec les informations de votre établissement.",
          },
        ],
      },
      de: {
        title: "Häufige Fragen zur KI-Telefonrezeption",
        description:
          "Antworten auf die häufigsten Fragen zur KI-Telefonrezeption: Telefonnummer, Sprachen, Aufzeichnung und DSGVO, Termine, Weiterleitungen, Kosten und Kündigung.",
        blocks: [
          {
            type: "p",
            text: "Hier haben wir die Fragen gesammelt, die uns Kunden am häufigsten stellen. Ist Ihre nicht dabei, [schreiben Sie uns](/de/contact).",
          },
          {
            type: "h2",
            id: "questions",
            text: "Fragen und Antworten",
          },
          {
            type: "faq",
            items: [
              {
                q: "Muss ich meine Telefonnummer wechseln?",
                a: "Nein. Sie können Ihre Nummer behalten und Anrufe an die Telefonrezeption umleiten, etwa nur, wenn besetzt ist, niemand abnimmt oder außerhalb der Öffnungszeiten. Sie können auch eine neue, eigene Nummer wählen.",
              },
              {
                q: "Merken die Anrufer, dass sie mit einer KI sprechen?",
                a: "Ja, und so soll es auch sein. Die Begrüßung stellt die Telefonrezeption als virtuelle Assistentin vor. Das Gespräch wirkt natürlich, aber wir geben nie vor, dass es ein Mensch ist.",
              },
              {
                q: "In welchen Sprachen nimmt sie Anrufe an?",
                a: "Auf europäischem Portugiesisch und Englisch. Sie kann während des Anrufs die Sprache wechseln, je nachdem, welche Sprache der Anrufer spricht.",
              },
              {
                q: "Werden Anrufe aufgezeichnet? Und die DSGVO?",
                a: "Sie können wählen, ob aufgezeichnet oder nur transkribiert wird. In jedem Fall wird der Anrufer zu Beginn des Gesprächs informiert. Die Aufbewahrungsfrist legen wir gemeinsam mit Ihnen fest, und wir empfehlen, Ihre Datenschutzerklärung anzupassen.",
              },
              {
                q: "Kann sie Termine in meinem System eintragen?",
                a: "Ja, wenn Ihr Reservierungssystem oder Kalender eine Integration erlaubt. Andernfalls nimmt die Telefonrezeption die Angaben auf und schickt sie als Anfrage, die Ihr Team bestätigt.",
              },
              {
                q: "Was, wenn jemand wirklich mit einem Menschen sprechen muss?",
                a: "Die Telefonrezeption leitet den Anruf an das Handy weiter, das Sie festlegen. Nimmt dort niemand ab, nimmt sie eine Rückrufbitte auf und informiert Sie per WhatsApp oder E-Mail.",
              },
              {
                q: "Kann sie Zahlungen annehmen oder medizinische Auskünfte geben?",
                a: "Nein. Die Telefonrezeption nimmt weder Zahlungen noch Kartendaten an und gibt keine medizinischen Ratschläge. In diesen Fällen leitet sie an Ihr Team weiter.",
              },
              {
                q: "Kostet die Rufumleitung etwas?",
                a: "Das hängt von Ihrem Anbieter und Tarif ab. Manche umgeleiteten Anrufe werden wie von Ihnen geführte Anrufe berechnet. Klären Sie das vor dem Einschalten mit Ihrem Anbieter.",
              },
              {
                q: "Wie lange dauert die Einrichtung?",
                a: "Meist wenige Werktage. Die Dauer hängt vor allem davon ab, wie schnell wir Ihre Informationen erhalten, und von der Integration in das Reservierungssystem.",
              },
              {
                q: "Kann ich den Service kündigen?",
                a: "Ja. Schalten Sie einfach die Umleitung aus und geben Sie uns Bescheid. Die Kündigungsbedingungen stehen im Angebot, das Sie vor dem Start erhalten.",
              },
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "Möchten Sie hören, wie es klingt? [Buchen Sie eine Vorführung](/de/book-a-demo), und wir machen einen Beispielanruf mit den Informationen Ihres Betriebs.",
          },
        ],
      },
      it: {
        title: "Domande frequenti sulla Receptionist vocale con IA",
        description:
          "Risposte ai dubbi più comuni sulla Receptionist vocale con IA: numero di telefono, lingue, registrazione e GDPR, appuntamenti, trasferimenti, costi e disdetta.",
        blocks: [
          {
            type: "p",
            text: "Abbiamo raccolto qui le domande che i clienti ci fanno più spesso. Se non trovate la vostra, [scriveteci](/it/contact).",
          },
          {
            type: "h2",
            id: "questions",
            text: "Domande e risposte",
          },
          {
            type: "faq",
            items: [
              {
                q: "Devo cambiare numero di telefono?",
                a: "No. Potete mantenere il vostro numero e deviare le chiamate alla receptionist, solo quando è occupato, non rispondete o fuori orario. Potete anche scegliere un numero nuovo dedicato.",
              },
              {
                q: "I clienti capiscono che stanno parlando con un'IA?",
                a: "Sì, ed è giusto così. Il saluto presenta la receptionist come assistente virtuale. La conversazione è naturale, ma non facciamo mai finta che sia una persona.",
              },
              {
                q: "In quali lingue risponde?",
                a: "In portoghese europeo e in inglese. Può cambiare lingua durante la chiamata, a seconda della lingua in cui parla il cliente.",
              },
              {
                q: "Le chiamate vengono registrate? E il GDPR?",
                a: "Potete scegliere se registrare o solo trascrivere. In ogni caso il cliente viene informato all'inizio della chiamata. Stabiliamo con voi il periodo di conservazione e vi consigliamo di aggiornare la vostra informativa sulla privacy.",
              },
              {
                q: "Può registrare appuntamenti nel mio sistema?",
                a: "Sì, quando il sistema di prenotazione o il calendario permette l'integrazione. Altrimenti la receptionist raccoglie i dati e li invia come richiesta che il vostro team confermerà.",
              },
              {
                q: "E se qualcuno ha davvero bisogno di parlare con una persona?",
                a: "La receptionist trasferisce la chiamata al cellulare che stabilite voi. Se nessuno risponde, lascia una richiesta di essere richiamati e vi avvisa via WhatsApp o email.",
              },
              {
                q: "Può accettare pagamenti o dare indicazioni mediche?",
                a: "No. La receptionist non accetta pagamenti né dati della carta e non dà consigli medici. In questi casi inoltra al vostro team.",
              },
              {
                q: "La deviazione di chiamata ha un costo?",
                a: "Dipende dal vostro operatore e dal piano tariffario. Alcune chiamate deviate vengono addebitate come chiamate fatte da voi. Verificate con il vostro operatore prima di attivarla.",
              },
              {
                q: "Quanto tempo richiede l'installazione?",
                a: "Di solito pochi giorni lavorativi. I tempi dipendono soprattutto dalle informazioni che ci inviate e dall'integrazione con il sistema di prenotazione.",
              },
              {
                q: "Posso disdire il servizio?",
                a: "Sì. Basta disattivare la deviazione e avvisarci. Le condizioni di disdetta sono indicate nella proposta che ricevete prima di iniziare.",
              },
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "Volete sentire come suona? [Prenotate una demo](/it/book-a-demo) e facciamo una chiamata di esempio con le informazioni della vostra attività.",
          },
        ],
      },
    },
  },
};
