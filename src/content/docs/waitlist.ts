import type { ProductDocs } from "../types";

export const docs: ProductDocs = {
  productId: "waitlist",
  pages: {
    "getting-started": {
      pt: {
        title: "Primeiros passos com a lista de espera digital",
        description:
          "Como funciona a lista de espera digital da Steevanz: o cliente entra por QR code ou com um toque, acompanha a vez no telemóvel e é avisado quando chega a sua vez.",
        blocks: [
          {
            type: "p",
            text: "A lista de espera digital substitui a folha de papel à porta e os clientes amontoados na entrada. O cliente entra na fila com o telemóvel, acompanha a senha que está a ser atendida e o tempo estimado e é avisado quando a mesa ou a vez estiver pronta.",
          },
          { type: "h2", id: "como-funciona", text: "Como funciona" },
          {
            type: "ol",
            items: [
              "O cliente lê o QR code ou toca na placa à entrada. Também pode ser a equipa a adicioná-lo à fila.",
              "Escreve o nome e, conforme o negócio, o número de pessoas ou o serviço. O telemóvel é opcional (para a equipa lhe poder ligar).",
              "Fica com uma senha no telemóvel: o seu número, a senha que está a ser atendida e a espera estimada, sempre atualizados.",
              "Quando há mesa ou vez livre, a equipa carrega em «Chamar o seguinte». O telemóvel do cliente toca e quem ligou os avisos recebe uma notificação mesmo com a página fechada.",
              "O cliente vem logo. Não é preciso marcar nada: ao chamar o seguinte, quem foi chamado antes passa a atendido.",
            ],
          },
          { type: "h2", id: "o-que-inclui", text: "O que inclui" },
          {
            type: "ul",
            items: [
              "Página de entrada na fila e senha no telemóvel, sem app nem conta.",
              "Painel para a equipa no telemóvel, tablet ou computador, com o botão «Chamar o seguinte».",
              "Ecrã de chamada para uma TV à entrada (opcional), só com números.",
              "Cartaz com QR code e placa para a entrada.",
              "Estatísticas dos últimos 30 dias: entradas, atendidos, desistências e horas com mais gente.",
              "Configuração da fila pela equipa da Steevanz.",
              "Suporte por WhatsApp e email.",
            ],
          },
          {
            type: "callout",
            tone: "tip",
            title: "Funciona com as reservas",
            text: "Se também tiver as reservas online, a fila e as reservas de hoje ficam lado a lado no Atendimento da sua área de cliente.",
          },
          {
            type: "p",
            text: "Próximo passo: veja como fazemos a [instalação](/docs/lista-espera-digital/instalacao).",
          },
        ],
      },
      en: {
        title: "Getting started with the digital waitlist",
        description:
          "How the Steevanz digital waitlist works: customers join by QR code or with a tap, follow their turn on their phone and are alerted when it is their turn.",
        blocks: [
          {
            type: "p",
            text: "The digital waitlist replaces the paper list at the door and the crowd in your entrance. Customers join the queue on their phone, follow the ticket being served and their estimated wait and are alerted when their table or turn is ready.",
          },
          { type: "h2", id: "how-it-works", text: "How it works" },
          {
            type: "ol",
            items: [
              "Customers scan the QR code or tap the plate at the entrance. Your team can also add them to the queue.",
              "They type their name and, depending on the business, the number of people or the service. A phone number is optional (so your team can call them).",
              "They get a ticket on their phone: their number, the ticket being served and the estimated wait, always up to date.",
              "When a table or turn is free, your team taps «Call next». The customer's phone rings and those who switched alerts on get a notification even with the page closed.",
              "The customer comes straight away. Nothing to mark: calling the next one marks the earlier call as served.",
            ],
          },
          { type: "h2", id: "whats-included", text: "What's included" },
          {
            type: "ul",
            items: [
              "Join page and ticket on the phone, no app or account.",
              "Staff dashboard on phone, tablet or computer, with the «Call next» button.",
              "Call screen for a TV at the entrance (optional), numbers only.",
              "Poster with QR code and plate for the entrance.",
              "Stats for the last 30 days: joins, served, walk-aways and busiest hours.",
              "Queue set up by the Steevanz team.",
              "Support by WhatsApp and email.",
            ],
          },
          {
            type: "callout",
            tone: "tip",
            title: "Works with bookings",
            text: "If you also use online bookings, the queue and today's bookings sit side by side in the «Atendimento» screen of your client area.",
          },
          {
            type: "p",
            text: "Next step: see how we handle the [setup](/en/docs/digital-waitlist/setup).",
          },
        ],
      },
      es: {
        title: "Primeros pasos con la lista de espera digital",
        description:
          "Cómo funciona la lista de espera digital de Steevanz: los clientes se apuntan con el código QR o con un toque, siguen su turno en el móvil y reciben un aviso cuando les toca.",
        blocks: [
          {
            type: "p",
            text: "La lista de espera digital sustituye a la lista en papel de la puerta y a la aglomeración en la entrada. Los clientes se apuntan a la cola en el móvil, ven el número que se está atendiendo y su espera estimada, y reciben un aviso cuando su mesa o su turno están listos.",
          },
          { type: "h2", id: "how-it-works", text: "Cómo funciona" },
          {
            type: "ol",
            items: [
              "El cliente lee el código QR o toca la placa de la entrada. Su equipo también puede apuntarlo a la cola.",
              "Escribe su nombre y, según el negocio, el número de personas o el servicio. El teléfono es opcional (para que su equipo pueda llamarle).",
              "Recibe un número en el móvil: su número, el número que se está atendiendo y la espera estimada, siempre actualizados.",
              "Cuando queda libre una mesa o un turno, su equipo toca «Chamar o seguinte» (llamar al siguiente). El móvil del cliente suena y quien activó los avisos recibe una notificación incluso con la página cerrada.",
              "El cliente viene enseguida. No hay nada que marcar: llamar al siguiente marca la llamada anterior como atendida.",
            ],
          },
          { type: "h2", id: "whats-included", text: "Qué incluye" },
          {
            type: "ul",
            items: [
              "Página para apuntarse y número en el móvil, sin app ni cuenta.",
              "Panel para el equipo en el móvil, la tableta o el ordenador, con el botón «Chamar o seguinte».",
              "Pantalla de llamadas para un televisor en la entrada (opcional), solo con números.",
              "Cartel con código QR y placa para la entrada.",
              "Estadísticas de los últimos 30 días: entradas, atendidos, abandonos y horas de más afluencia.",
              "Cola configurada por el equipo de Steevanz.",
              "Soporte por WhatsApp y correo electrónico.",
            ],
          },
          {
            type: "callout",
            tone: "tip",
            title: "Funciona con las reservas",
            text: "Si también usa las reservas online, la cola y las reservas del día aparecen juntas en la pantalla «Atendimento» de su zona de cliente.",
          },
          {
            type: "p",
            text: "Siguiente paso: vea cómo hacemos la [instalación](/es/docs/digital-waitlist/setup).",
          },
        ],
      },
      fr: {
        title: "Premiers pas avec la liste d'attente digitale",
        description:
          "Comment fonctionne la liste d'attente digitale de Steevanz : les clients s'inscrivent par QR code ou d'un toucher, suivent leur tour sur leur téléphone et sont prévenus quand c'est à eux.",
        blocks: [
          {
            type: "p",
            text: "La liste d'attente digitale remplace la liste papier à la porte et la foule dans l'entrée. Les clients s'inscrivent dans la file sur leur téléphone, voient le ticket en cours et leur attente estimée, et sont prévenus quand leur table ou leur tour est prêt.",
          },
          { type: "h2", id: "how-it-works", text: "Comment ça marche" },
          {
            type: "ol",
            items: [
              "Le client scanne le QR code ou touche la plaque à l'entrée. Votre équipe peut aussi l'inscrire dans la file.",
              "Il saisit son nom et, selon l'établissement, le nombre de personnes ou la prestation. Le numéro de téléphone est facultatif (pour que votre équipe puisse l'appeler).",
              "Il reçoit un ticket sur son téléphone : son numéro, le ticket en cours et l'attente estimée, toujours à jour.",
              "Quand une table ou un créneau se libère, votre équipe touche «Chamar o seguinte» (appeler le suivant). Le téléphone du client sonne, et ceux qui ont activé les alertes reçoivent une notification même page fermée.",
              "Le client arrive aussitôt. Rien à cocher : appeler le suivant marque l'appel précédent comme servi.",
            ],
          },
          { type: "h2", id: "whats-included", text: "Ce qui est inclus" },
          {
            type: "ul",
            items: [
              "Page d'inscription et ticket sur le téléphone, sans application ni compte.",
              "Tableau de bord pour l'équipe sur téléphone, tablette ou ordinateur, avec le bouton «Chamar o seguinte».",
              "Écran d'appel pour une télévision à l'entrée (en option), avec les numéros seulement.",
              "Affiche avec QR code et plaque pour l'entrée.",
              "Statistiques des 30 derniers jours : inscriptions, clients servis, abandons et heures de pointe.",
              "File configurée par l'équipe Steevanz.",
              "Assistance par WhatsApp et par e-mail.",
            ],
          },
          {
            type: "callout",
            tone: "tip",
            title: "Fonctionne avec les réservations",
            text: "Si vous utilisez aussi les réservations en ligne, la file et les réservations du jour s'affichent côte à côte dans l'écran «Atendimento» de votre espace client.",
          },
          {
            type: "p",
            text: "Étape suivante : découvrez comment se passe l'[installation](/fr/docs/digital-waitlist/setup).",
          },
        ],
      },
      de: {
        title: "Erste Schritte mit der digitalen Warteliste",
        description:
          "So funktioniert die digitale Warteliste von Steevanz: Kunden reihen sich per QR-Code oder mit einem Antippen ein, verfolgen ihre Reihenfolge auf dem Handy und werden benachrichtigt, wenn sie an der Reihe sind.",
        blocks: [
          {
            type: "p",
            text: "Die digitale Warteliste ersetzt die Papierliste an der Tür und das Gedränge im Eingang. Kunden reihen sich auf dem Handy in die Warteschlange ein, sehen die gerade aufgerufene Nummer und ihre geschätzte Wartezeit und werden benachrichtigt, wenn ihr Tisch oder ihr Termin bereit ist.",
          },
          { type: "h2", id: "how-it-works", text: "So funktioniert es" },
          {
            type: "ol",
            items: [
              "Der Kunde scannt den QR-Code oder tippt auf das Schild am Eingang. Ihr Team kann ihn auch selbst in die Warteschlange eintragen.",
              "Er gibt seinen Namen ein und, je nach Betrieb, die Zahl der Personen oder die Leistung. Die Telefonnummer ist freiwillig (damit Ihr Team ihn anrufen kann).",
              "Er bekommt eine Wartenummer auf dem Handy: seine Nummer, die gerade aufgerufene Nummer und die geschätzte Wartezeit, immer aktuell.",
              "Wird ein Tisch oder ein Termin frei, tippt Ihr Team auf «Chamar o seguinte» (den Nächsten aufrufen). Das Handy des Kunden klingelt, und wer die Benachrichtigungen eingeschaltet hat, bekommt auch bei geschlossener Seite eine Mitteilung.",
              "Der Kunde kommt sofort. Nichts abzuhaken: Wer den Nächsten aufruft, markiert den vorherigen Aufruf als bedient.",
            ],
          },
          { type: "h2", id: "whats-included", text: "Was enthalten ist" },
          {
            type: "ul",
            items: [
              "Seite zum Einreihen und Wartenummer auf dem Handy, ohne App und ohne Konto.",
              "Übersicht für das Team auf Handy, Tablet oder Computer, mit der Schaltfläche «Chamar o seguinte».",
              "Aufrufbildschirm für einen Fernseher am Eingang (optional), nur mit Nummern.",
              "Plakat mit QR-Code und Schild für den Eingang.",
              "Statistiken der letzten 30 Tage: Einträge, Bediente, Abgänge und Stoßzeiten.",
              "Warteschlange eingerichtet vom Steevanz-Team.",
              "Support per WhatsApp und E-Mail.",
            ],
          },
          {
            type: "callout",
            tone: "tip",
            title: "Funktioniert mit Reservierungen",
            text: "Wenn Sie auch die Online-Reservierungen nutzen, stehen die Warteschlange und die Reservierungen des Tages nebeneinander im Bildschirm «Atendimento» Ihres Kundenbereichs.",
          },
          {
            type: "p",
            text: "Nächster Schritt: Sehen Sie, wie wir die [Einrichtung](/de/docs/digital-waitlist/setup) übernehmen.",
          },
        ],
      },
      it: {
        title: "Primi passi con la lista d'attesa digitale",
        description:
          "Come funziona la lista d'attesa digitale di Steevanz: i clienti si mettono in coda con il codice QR o con un tocco, seguono il loro turno sul telefono e ricevono un avviso quando tocca a loro.",
        blocks: [
          {
            type: "p",
            text: "La lista d'attesa digitale sostituisce la lista cartacea alla porta e la folla all'ingresso. I clienti si mettono in coda dal telefono, vedono il numero servito e la loro attesa stimata e ricevono un avviso quando il loro tavolo o il loro turno è pronto.",
          },
          { type: "h2", id: "how-it-works", text: "Come funziona" },
          {
            type: "ol",
            items: [
              "Il cliente inquadra il codice QR o tocca la targa all'ingresso. Anche il vostro staff può metterlo in coda.",
              "Scrive il suo nome e, a seconda del locale, il numero di persone o il servizio. Il numero di telefono è facoltativo (perché il vostro staff possa chiamarlo).",
              "Riceve un numero sul telefono: il suo numero, il numero servito e l'attesa stimata, sempre aggiornati.",
              "Quando si libera un tavolo o un turno, il vostro staff tocca «Chamar o seguinte» (chiama il prossimo). Il telefono del cliente suona e chi ha attivato gli avvisi riceve una notifica anche con la pagina chiusa.",
              "Il cliente arriva subito. Niente da segnare: chiamare il prossimo segna la chiamata precedente come servita.",
            ],
          },
          { type: "h2", id: "whats-included", text: "Cosa include" },
          {
            type: "ul",
            items: [
              "Pagina per mettersi in coda e numero sul telefono, senza app né account.",
              "Pannello per lo staff su telefono, tablet o computer, con il pulsante «Chamar o seguinte».",
              "Schermo delle chiamate per una TV all'ingresso (opzionale), solo con i numeri.",
              "Locandina con codice QR e targa per l'ingresso.",
              "Statistiche degli ultimi 30 giorni: ingressi, serviti, abbandoni e orari di punta.",
              "Coda configurata dal team Steevanz.",
              "Assistenza via WhatsApp ed e-mail.",
            ],
          },
          {
            type: "callout",
            tone: "tip",
            title: "Funziona con le prenotazioni",
            text: "Se usate anche le prenotazioni online, la coda e le prenotazioni del giorno stanno una accanto all'altra nella schermata «Atendimento» della vostra area clienti.",
          },
          {
            type: "p",
            text: "Prossimo passo: scoprite come facciamo l'[installazione](/it/docs/digital-waitlist/setup).",
          },
        ],
      },
    },
    setup: {
      pt: {
        title: "Instalação da lista de espera digital",
        description: "Como a Steevanz põe a lista de espera a funcionar no seu espaço: regras da fila, QR code e placa à entrada, painel e ecrã de chamada.",
        blocks: [
          { type: "p", text: "Tratamos da instalação consigo. Normalmente fica a funcionar em poucos dias úteis." },
          {
            type: "steps",
            items: [
              { title: "Levantamento", body: "Falamos sobre o seu espaço: horas de maior movimento, se os clientes vêm em grupo ou escolhem um serviço e profissional." },
              { title: "Configuração da fila", body: "Criamos o espaço com o horário e definimos o tempo médio por vez e o máximo de pessoas à espera." },
              { title: "QR code e placa à entrada", body: "Entregamos o cartaz com o QR code e, se escolher, a placa já programada com o link da fila." },
              { title: "Painel e ecrã", body: "Mostramos à equipa o painel e, se quiser, ligamos o ecrã de chamada numa TV à entrada." },
              { title: "Teste real", body: "Um membro da equipa entra na fila com o próprio telemóvel e é chamado, para confirmar que tudo funciona de ponta a ponta." },
            ],
          },
          {
            type: "callout",
            tone: "info",
            text: "Depois da instalação, pode mudar as regras quando quiser em [configuração](/docs/lista-espera-digital/configuracao).",
          },
        ],
      },
      en: {
        title: "Setting up the digital waitlist",
        description: "How Steevanz gets the waitlist running in your space: queue rules, QR code and plate at the door, dashboard and call screen.",
        blocks: [
          { type: "p", text: "We handle the setup with you. It is usually up and running within a few working days." },
          {
            type: "steps",
            items: [
              { title: "Discovery", body: "We talk about your space: busiest hours, whether customers come in groups or pick a service and staff member." },
              { title: "Queue configuration", body: "We create your space with its opening hours and set the average time per turn and the most people waiting." },
              { title: "QR code and plate at the door", body: "We deliver the poster with the QR code and, if you choose, the plate programmed with the queue link." },
              { title: "Dashboard and screen", body: "We show your team the dashboard and, if you want, set up the call screen on a TV at the entrance." },
              { title: "Live test", body: "A team member joins the queue on their own phone and gets called, to confirm everything works end to end." },
            ],
          },
          {
            type: "callout",
            tone: "info",
            text: "After setup, you can change the rules whenever you like in [configuration](/en/docs/digital-waitlist/configuration).",
          },
        ],
      },
      es: {
        title: "Instalación de la lista de espera digital",
        description: "Cómo pone Steevanz en marcha la lista de espera en su local: reglas de la cola, código QR y placa en la puerta, panel y pantalla de llamadas.",
        blocks: [
          { type: "p", text: "Hacemos la instalación con usted. Normalmente queda en marcha en pocos días laborables." },
          {
            type: "steps",
            items: [
              { title: "Conocer su local", body: "Hablamos de su local: horas de más afluencia, si los clientes vienen en grupo o eligen un servicio y un profesional." },
              { title: "Configuración de la cola", body: "Creamos su local con su horario y fijamos el tiempo medio por turno y el máximo de personas esperando." },
              { title: "Código QR y placa en la puerta", body: "Le entregamos el cartel con el código QR y, si lo elige, la placa grabada con el enlace de la cola." },
              { title: "Panel y pantalla", body: "Enseñamos el panel a su equipo y, si lo desea, configuramos la pantalla de llamadas en un televisor en la entrada." },
              { title: "Prueba real", body: "Una persona del equipo se apunta a la cola con su propio móvil y recibe la llamada, para confirmar que todo funciona de principio a fin." },
            ],
          },
          {
            type: "callout",
            tone: "info",
            text: "Después de la instalación, puede cambiar las reglas cuando quiera en la [configuración](/es/docs/digital-waitlist/configuration).",
          },
        ],
      },
      fr: {
        title: "Mettre en place la liste d'attente digitale",
        description: "Comment Steevanz met en service la liste d'attente dans votre établissement : règles de la file, QR code et plaque à la porte, tableau de bord et écran d'appel.",
        blocks: [
          { type: "p", text: "Nous faisons la mise en place avec vous. En général, tout fonctionne en quelques jours ouvrés." },
          {
            type: "steps",
            items: [
              { title: "Découverte", body: "Nous parlons de votre établissement : heures de pointe, clients qui viennent en groupe ou qui choisissent une prestation et un membre de l'équipe." },
              { title: "Configuration de la file", body: "Nous créons votre établissement avec ses horaires et fixons le temps moyen par tour et le nombre maximum de personnes en attente." },
              { title: "QR code et plaque à la porte", body: "Nous livrons l'affiche avec le QR code et, si vous le souhaitez, la plaque programmée avec le lien de la file." },
              { title: "Tableau de bord et écran", body: "Nous montrons le tableau de bord à votre équipe et, si vous le voulez, installons l'écran d'appel sur une télévision à l'entrée." },
              { title: "Test en conditions réelles", body: "Un membre de l'équipe s'inscrit dans la file avec son propre téléphone et se fait appeler, pour vérifier que tout fonctionne de bout en bout." },
            ],
          },
          {
            type: "callout",
            tone: "info",
            text: "Après la mise en place, vous pouvez changer les règles quand vous voulez dans la [configuration](/fr/docs/digital-waitlist/configuration).",
          },
        ],
      },
      de: {
        title: "Die digitale Warteliste einrichten",
        description: "Wie Steevanz die Warteliste in Ihrem Betrieb startklar macht: Regeln der Warteschlange, QR-Code und Schild an der Tür, Übersicht und Aufrufbildschirm.",
        blocks: [
          { type: "p", text: "Wir übernehmen die Einrichtung gemeinsam mit Ihnen. Meist läuft alles innerhalb weniger Werktage." },
          {
            type: "steps",
            items: [
              { title: "Kennenlernen", body: "Wir sprechen über Ihren Betrieb: Stoßzeiten, ob Kunden in Gruppen kommen oder eine Leistung und eine Fachkraft wählen." },
              { title: "Warteschlange konfigurieren", body: "Wir legen Ihren Betrieb mit seinen Öffnungszeiten an und stellen die durchschnittliche Zeit pro Kunde und die Höchstzahl Wartender ein." },
              { title: "QR-Code und Schild an der Tür", body: "Wir liefern das Plakat mit dem QR-Code und, wenn Sie möchten, das mit dem Link der Warteschlange beschriebene Schild." },
              { title: "Übersicht und Bildschirm", body: "Wir zeigen Ihrem Team die Übersicht und richten auf Wunsch den Aufrufbildschirm auf einem Fernseher am Eingang ein." },
              { title: "Test im Echtbetrieb", body: "Eine Person aus dem Team reiht sich mit dem eigenen Handy ein und wird aufgerufen, um zu prüfen, dass alles von Anfang bis Ende funktioniert." },
            ],
          },
          {
            type: "callout",
            tone: "info",
            text: "Nach der Einrichtung können Sie die Regeln jederzeit in der [Konfiguration](/de/docs/digital-waitlist/configuration) ändern.",
          },
        ],
      },
      it: {
        title: "Installare la lista d'attesa digitale",
        description: "Come Steevanz mette in funzione la lista d'attesa nel vostro locale: regole della coda, codice QR e targa alla porta, pannello e schermo delle chiamate.",
        blocks: [
          { type: "p", text: "Facciamo l'installazione insieme a voi. Di solito è operativa in pochi giorni lavorativi." },
          {
            type: "steps",
            items: [
              { title: "Conoscenza", body: "Parliamo del vostro locale: orari di punta, se i clienti arrivano in gruppo o scelgono un servizio e un professionista." },
              { title: "Configurazione della coda", body: "Creiamo il vostro locale con i suoi orari e impostiamo il tempo medio per turno e il numero massimo di persone in attesa." },
              { title: "Codice QR e targa alla porta", body: "Consegniamo la locandina con il codice QR e, se lo scegliete, la targa programmata con il link della coda." },
              { title: "Pannello e schermo", body: "Mostriamo il pannello al vostro staff e, se volete, configuriamo lo schermo delle chiamate su una TV all'ingresso." },
              { title: "Prova dal vivo", body: "Una persona dello staff si mette in coda con il proprio telefono e viene chiamata, per verificare che tutto funzioni dall'inizio alla fine." },
            ],
          },
          {
            type: "callout",
            tone: "info",
            text: "Dopo l'installazione, potete cambiare le regole quando volete nella [configurazione](/it/docs/digital-waitlist/configuration).",
          },
        ],
      },
    },
    configuration: {
      pt: {
        title: "Configuração da lista de espera digital",
        description: "As regras da fila: tempo por vez, máximo à espera, o que perguntar ao cliente, abertura automática e privacidade.",
        blocks: [
          { type: "p", text: "As regras estão no separador **Definições** da lista de espera, na sua área de cliente." },
          {
            type: "table",
            head: ["Definição", "Para quê"],
            rows: [
              ["Minutos por vez (média)", "Base da espera estimada quando não se pergunta o serviço. Depois de 3 chamadas, conta também o ritmo real da última hora e meia. Com serviço, a espera soma o que falta dos serviços em curso e a duração dos serviços à frente."],
              ["Máximo à espera", "Com a fila cheia, ninguém novo entra pelo QR."],
              ["Máximo de pessoas por grupo", "Limite no formulário de entrada. Só aparece quando se pergunta o número de pessoas."],
              ["O que perguntar", "Aparece o que faz sentido para o tipo de negócio (restaurante: pessoas; barbearia e cabeleireiro: serviço e profissional; clínica: serviço). O resto fica em «Mais opções»."],
              ["Abrir e fechar com o horário", "Ligado por omissão. A fila abre à hora de abertura e fecha à de fecho. Pode sempre mudar à mão."],
              ["Chamar logo o seguinte ao marcar «Não apareceu»", "Um toque em vez de dois."],
              ["Mensagem na página de entrada", "Um texto curto para o cliente, por exemplo para grupos grandes."],
            ],
          },
          { type: "h2", id: "estados", text: "Aberta ou fechada" },
          {
            type: "ul",
            items: [
              "**Aberta:** os clientes entram pelo QR ou pela placa.",
              "**Fechada:** ninguém entra pelo QR e as senhas voltam a começar no 1. Quem já está na fila continua a ser chamado, e a equipa pode sempre adicionar alguém à fila.",
            ],
          },
          { type: "h2", id: "privacidade", text: "Dados e privacidade" },
          {
            type: "ul",
            items: [
              "Guardamos só o nome, o que o cliente escolheu (pessoas, serviço) e o telemóvel, se o deixar.",
              "Os dados de cada entrada são apagados automaticamente ao fim de 30 dias.",
              "Os dados nunca são usados para marketing.",
            ],
          },
        ],
      },
      en: {
        title: "Configuring the digital waitlist",
        description: "The queue rules: time per turn, most people waiting, what to ask, automatic opening and privacy.",
        blocks: [
          { type: "p", text: "The rules are in the waitlist's **Settings** tab, in your client area." },
          {
            type: "table",
            head: ["Setting", "What it's for"],
            rows: [
              ["Minutes per turn (average)", "Basis for the estimated wait when no service is asked. After 3 calls it also uses the real pace of the last hour and a half. With a service, the wait adds what is left of the services in progress and the durations of the services ahead."],
              ["Most people waiting", "When the queue is full, nobody new joins by QR."],
              ["Most people per group", "Limit on the join form. Only shown when the number of people is asked."],
              ["What to ask", "What suits the kind of business is shown (restaurant: people; barbershop and salon: service and staff member; clinic: service). The rest is under «More options»."],
              ["Open and close with opening hours", "On by default. The queue opens at opening time and closes at closing time. You can always change it by hand."],
              ["Call the next one when marking «No-show»", "One tap instead of two."],
              ["Message on the join page", "A short note for customers, for example about large groups."],
            ],
          },
          { type: "h2", id: "states", text: "Open or closed" },
          {
            type: "ul",
            items: [
              "**Open:** customers join by QR or the plate.",
              "**Closed:** nobody joins by QR and ticket numbers start again at 1. People already in the queue are still called, and your team can always add someone to the queue.",
            ],
          },
          { type: "h2", id: "privacy", text: "Data and privacy" },
          {
            type: "ul",
            items: [
              "We only store the name, what the customer chose (people, service) and the phone number if they leave one.",
              "Each entry's data is deleted automatically after 30 days.",
              "Data is never used for marketing.",
            ],
          },
        ],
      },
      es: {
        title: "Configuración de la lista de espera digital",
        description: "Las reglas de la cola: tiempo por turno, máximo de personas esperando, qué preguntar, apertura automática y privacidad.",
        blocks: [
          { type: "p", text: "Las reglas están en la pestaña **Definições** (ajustes) de la lista de espera, en su zona de cliente, que está en portugués. Entre paréntesis indicamos el nombre que aparece en pantalla." },
          {
            type: "table",
            head: ["Ajuste", "Para qué sirve"],
            rows: [
              ["Minutos por turno, de media («Minutos por vez»)", "Base de la espera estimada cuando no se pregunta el servicio. Después de 3 llamadas, tiene en cuenta también el ritmo real de la última hora y media. Con servicio, la espera suma lo que queda de los servicios en curso y la duración de los servicios que van delante."],
              ["Máximo de personas esperando («Máximo à espera»)", "Con la cola llena, nadie nuevo entra por el QR."],
              ["Máximo de personas por grupo («Máximo de pessoas por grupo»)", "Límite en el formulario de entrada. Solo aparece cuando se pregunta el número de personas."],
              ["Qué preguntar («O que perguntar»)", "Aparece lo que tiene sentido para el tipo de negocio (restaurante: personas; barbería y peluquería: servicio y profesional; clínica: servicio). El resto está en «Mais opções» (más opciones)."],
              ["Abrir y cerrar con el horario («Abrir e fechar com o horário»)", "Activado por defecto. La cola se abre a la hora de apertura y se cierra a la de cierre. Siempre puede cambiarlo a mano."],
              ["Llamar al siguiente al marcar «Não apareceu» (no se presentó)", "Un toque en lugar de dos."],
              ["Mensaje en la página de entrada («Mensagem na página de entrada»)", "Un texto breve para el cliente, por ejemplo sobre grupos grandes."],
            ],
          },
          { type: "h2", id: "states", text: "Abierta o cerrada" },
          {
            type: "ul",
            items: [
              "**Abierta:** los clientes entran por el QR o por la placa.",
              "**Cerrada:** nadie entra por el QR y los números vuelven a empezar en el 1. Quien ya está en la cola sigue siendo llamado, y su equipo siempre puede apuntar a alguien a la cola.",
            ],
          },
          { type: "h2", id: "privacy", text: "Datos y privacidad" },
          {
            type: "ul",
            items: [
              "Solo guardamos el nombre, lo que eligió el cliente (personas, servicio) y el teléfono si lo deja.",
              "Los datos de cada entrada se borran automáticamente a los 30 días.",
              "Los datos nunca se usan para marketing.",
            ],
          },
        ],
      },
      fr: {
        title: "Configurer la liste d'attente digitale",
        description: "Les règles de la file : temps par tour, nombre maximum de personnes en attente, ce qu'il faut demander, ouverture automatique et confidentialité.",
        blocks: [
          { type: "p", text: "Les règles se trouvent dans l'onglet **Definições** (paramètres) de la liste d'attente, dans votre espace client, qui est en portugais. Entre parenthèses, le nom affiché à l'écran." },
          {
            type: "table",
            head: ["Paramètre", "À quoi il sert"],
            rows: [
              ["Minutes par tour, en moyenne («Minutos por vez»)", "Base de l'attente estimée quand la prestation n'est pas demandée. Après 3 appels, elle tient aussi compte du rythme réel de la dernière heure et demie. Avec une prestation, l'attente additionne le temps restant des prestations en cours et la durée des prestations qui précèdent."],
              ["Maximum de personnes en attente («Máximo à espera»)", "Quand la file est pleine, plus personne ne s'inscrit par QR."],
              ["Maximum de personnes par groupe («Máximo de pessoas por grupo»)", "Limite dans le formulaire d'inscription. N'apparaît que si le nombre de personnes est demandé."],
              ["Ce qu'il faut demander («O que perguntar»)", "Ce qui convient au type d'établissement s'affiche (restaurant : personnes ; barbier et salon de coiffure : prestation et membre de l'équipe ; clinique : prestation). Le reste se trouve dans «Mais opções» (plus d'options)."],
              ["Ouvrir et fermer selon les horaires («Abrir e fechar com o horário»)", "Activé par défaut. La file s'ouvre à l'heure d'ouverture et se ferme à l'heure de fermeture. Vous pouvez toujours la changer à la main."],
              ["Appeler le suivant en marquant «Não apareceu» (absent)", "Un toucher au lieu de deux."],
              ["Message sur la page d'inscription («Mensagem na página de entrada»)", "Un court texte pour les clients, par exemple sur les grands groupes."],
            ],
          },
          { type: "h2", id: "states", text: "Ouverte ou fermée" },
          {
            type: "ul",
            items: [
              "**Ouverte :** les clients s'inscrivent par QR ou par la plaque.",
              "**Fermée :** personne ne s'inscrit par QR et les numéros de ticket repartent de 1. Les personnes déjà dans la file sont toujours appelées, et votre équipe peut toujours inscrire quelqu'un.",
            ],
          },
          { type: "h2", id: "privacy", text: "Données et confidentialité" },
          {
            type: "ul",
            items: [
              "Nous ne conservons que le nom, ce que le client a choisi (personnes, prestation) et le numéro de téléphone s'il en laisse un.",
              "Les données de chaque inscription sont supprimées automatiquement au bout de 30 jours.",
              "Les données ne servent jamais au marketing.",
            ],
          },
        ],
      },
      de: {
        title: "Die digitale Warteliste konfigurieren",
        description: "Die Regeln der Warteschlange: Zeit pro Kunde, Höchstzahl Wartender, was abgefragt wird, automatisches Öffnen und Datenschutz.",
        blocks: [
          { type: "p", text: "Die Regeln finden Sie im Reiter **Definições** (Einstellungen) der Warteliste in Ihrem Kundenbereich, der auf Portugiesisch ist. In Klammern steht der Name, wie er auf dem Bildschirm erscheint." },
          {
            type: "table",
            head: ["Einstellung", "Wofür sie dient"],
            rows: [
              ["Minuten pro Kunde, im Durchschnitt («Minutos por vez»)", "Grundlage der geschätzten Wartezeit, wenn keine Leistung abgefragt wird. Nach 3 Aufrufen zählt auch das tatsächliche Tempo der letzten anderthalb Stunden. Mit Leistung addiert die Wartezeit die Restzeit der laufenden Leistungen und die Dauer der Leistungen davor."],
              ["Höchstzahl Wartender («Máximo à espera»)", "Ist die Warteschlange voll, kann sich niemand Neues per QR einreihen."],
              ["Höchstzahl Personen pro Gruppe («Máximo de pessoas por grupo»)", "Grenze im Formular zum Einreihen. Erscheint nur, wenn die Zahl der Personen abgefragt wird."],
              ["Was abgefragt wird («O que perguntar»)", "Angezeigt wird, was zur Art des Betriebs passt (Restaurant: Personen; Barbershop und Friseursalon: Leistung und Fachkraft; Praxis: Leistung). Der Rest steht unter «Mais opções» (weitere Optionen)."],
              ["Mit den Öffnungszeiten öffnen und schließen («Abrir e fechar com o horário»)", "Standardmäßig eingeschaltet. Die Warteschlange öffnet zur Öffnungszeit und schließt zur Schließzeit. Sie können es jederzeit von Hand ändern."],
              ["Beim Markieren von «Não apareceu» (nicht erschienen) gleich den Nächsten aufrufen", "Ein Antippen statt zwei."],
              ["Nachricht auf der Seite zum Einreihen («Mensagem na página de entrada»)", "Ein kurzer Hinweis für Kunden, etwa zu großen Gruppen."],
            ],
          },
          { type: "h2", id: "states", text: "Geöffnet oder geschlossen" },
          {
            type: "ul",
            items: [
              "**Geöffnet:** Kunden reihen sich per QR oder über das Schild ein.",
              "**Geschlossen:** Niemand reiht sich per QR ein und die Wartenummern beginnen wieder bei 1. Wer schon in der Warteschlange steht, wird weiterhin aufgerufen, und Ihr Team kann jederzeit jemanden eintragen.",
            ],
          },
          { type: "h2", id: "privacy", text: "Daten und Datenschutz" },
          {
            type: "ul",
            items: [
              "Wir speichern nur den Namen, die Auswahl des Kunden (Personen, Leistung) und die Telefonnummer, wenn er eine angibt.",
              "Die Daten jedes Eintrags werden nach 30 Tagen automatisch gelöscht.",
              "Die Daten werden nie für Marketing verwendet.",
            ],
          },
        ],
      },
      it: {
        title: "Configurare la lista d'attesa digitale",
        description: "Le regole della coda: tempo per turno, numero massimo di persone in attesa, cosa chiedere, apertura automatica e privacy.",
        blocks: [
          { type: "p", text: "Le regole sono nella scheda **Definições** (impostazioni) della lista d'attesa, nella vostra area clienti, che è in portoghese. Tra parentesi trovate il nome che appare sullo schermo." },
          {
            type: "table",
            head: ["Impostazione", "A cosa serve"],
            rows: [
              ["Minuti per turno, in media («Minutos por vez»)", "Base dell'attesa stimata quando non si chiede il servizio. Dopo 3 chiamate considera anche il ritmo reale dell'ultima ora e mezza. Con il servizio, l'attesa somma il tempo che resta dei servizi in corso e la durata dei servizi davanti."],
              ["Massimo di persone in attesa («Máximo à espera»)", "Con la coda piena, nessuno di nuovo entra dal QR."],
              ["Massimo di persone per gruppo («Máximo de pessoas por grupo»)", "Limite nel modulo per mettersi in coda. Appare solo quando si chiede il numero di persone."],
              ["Cosa chiedere («O que perguntar»)", "Appare ciò che ha senso per il tipo di locale (ristorante: persone; barbiere e parrucchiere: servizio e professionista; clinica: servizio). Il resto è in «Mais opções» (altre opzioni)."],
              ["Aprire e chiudere con gli orari («Abrir e fechar com o horário»)", "Attivo per impostazione predefinita. La coda si apre all'orario di apertura e si chiude a quello di chiusura. Potete sempre cambiarlo a mano."],
              ["Chiamare subito il prossimo quando si segna «Não apareceu» (non si è presentato)", "Un tocco invece di due."],
              ["Messaggio nella pagina d'ingresso («Mensagem na página de entrada»)", "Un breve testo per i clienti, per esempio sui gruppi numerosi."],
            ],
          },
          { type: "h2", id: "states", text: "Aperta o chiusa" },
          {
            type: "ul",
            items: [
              "**Aperta:** i clienti entrano dal QR o dalla targa.",
              "**Chiusa:** nessuno entra dal QR e i numeri ripartono da 1. Chi è già in coda continua a essere chiamato, e il vostro staff può sempre mettere qualcuno in coda.",
            ],
          },
          { type: "h2", id: "privacy", text: "Dati e privacy" },
          {
            type: "ul",
            items: [
              "Conserviamo solo il nome, ciò che il cliente ha scelto (persone, servizio) e il numero di telefono, se lo lascia.",
              "I dati di ogni ingresso vengono cancellati automaticamente dopo 30 giorni.",
              "I dati non vengono mai usati per il marketing.",
            ],
          },
        ],
      },
    },
    usage: {
      pt: {
        title: "Utilização diária da lista de espera",
        description: "Como gerir a fila no dia a dia: chamar o seguinte, quem não aparece, adicionar alguém à fila e fechar a fila.",
        blocks: [
          { type: "p", text: "Use o separador **Fila** do Atendimento (ou da lista de espera) no telemóvel ou tablet do balcão. A página atualiza-se sozinha." },
          {
            type: "steps",
            items: [
              { title: "Chamar o seguinte", body: "Quando há mesa ou vez livre, carregue em «Chamar o seguinte»: chama a próxima senha, seja qual for o profissional que pediu. Se essa pessoa pediu alguém que ainda está ocupado, chame outra no «⋯» («Chamar já»)." },
              { title: "Não há nada para marcar", body: "Quem é chamado fica em atendimento. Ao chamar o seguinte, a chamada mais antiga passa a atendida (até uma pessoa por profissional ao mesmo tempo), e o cliente vê na senha o botão para deixar a avaliação." },
              { title: "Se não aparecer", body: "No «⋯» da pessoa, carregue em «Não apareceu». Com a opção ligada, o seguinte é chamado logo." },
              { title: "As exceções", body: "Quando a fila pergunta o número de pessoas (restaurantes), cada grupo tem «Chamar»: ficou livre uma mesa de 2, chama-se o primeiro grupo que cabe, mesmo que não seja o seguinte. No «⋯» de cada pessoa: chamar fora da ordem, subir ou descer na fila, chamar outra vez, marcar como atendido ou que desistiu." },
            ],
          },
          { type: "h2", id: "balcao", text: "Adicionar alguém à fila" },
          { type: "p", text: "Para quem não quer usar o telemóvel: «Adicionar alguém à fila», só com o nome. Funciona mesmo com a fila fechada." },
          { type: "h2", id: "som", text: "Som de novas entradas" },
          { type: "p", text: "Ligue «Som de novas entradas» no aparelho do balcão para ouvir quando alguém entra na fila. Fica lembrado nesse aparelho." },
          {
            type: "callout",
            tone: "tip",
            text: "Não há tempo limite para chegar: a chamada fica aberta até chamar o seguinte. «Não apareceu» serve para as estatísticas e para chamar logo o seguinte.",
          },
        ],
      },
      en: {
        title: "Using the waitlist day to day",
        description: "How to run the queue every day: calling the next one, no-shows, adding someone to the queue and closing the queue.",
        blocks: [
          { type: "p", text: "Use the **Queue** tab of the «Atendimento» screen (or of the waitlist) on the counter phone or tablet. The page updates by itself." },
          {
            type: "steps",
            items: [
              { title: "Call next", body: "When a table or turn is free, tap «Call next»: it calls the next ticket, whoever they asked for. If that person asked for someone still busy, call another one from the «⋯» («Call now»)." },
              { title: "Nothing to mark", body: "Whoever is called is being served. Calling the next one marks the oldest call as served (up to one person per staff member at a time), and the customer sees the button to leave a review on their ticket." },
              { title: "If they don't show up", body: "In the person's «⋯», tap «No-show». With the option on, the next one is called straight away." },
              { title: "Exceptions", body: "When the queue asks for the number of people (restaurants), each group has «Call»: a table for 2 is free, so you call the first group that fits, even if it is not next. In each person's «⋯»: call out of order, move up or down, call again, mark as served or that they left." },
            ],
          },
          { type: "h2", id: "desk", text: "Adding someone to the queue" },
          { type: "p", text: "For people who don't want to use their phone: «Add someone to the queue», with just a name. It works even with the queue closed." },
          { type: "h2", id: "sound", text: "Sound for new entries" },
          { type: "p", text: "Turn on «Sound for new entries» on the counter device to hear when someone joins. It is remembered on that device." },
          {
            type: "callout",
            tone: "tip",
            text: "There is no time limit to arrive: the call stays open until the next one is called. «No-show» is for the stats and to call the next one straight away.",
          },
        ],
      },
      es: {
        title: "La lista de espera en el día a día",
        description: "Cómo llevar la cola cada día: llamar al siguiente, los que no se presentan, apuntar a alguien a la cola y cerrar la cola.",
        blocks: [
          { type: "p", text: "Use la pestaña **Fila** (cola) de la pantalla «Atendimento» (o de la lista de espera) en el móvil o la tableta del mostrador. La página se actualiza sola." },
          {
            type: "steps",
            items: [
              { title: "Llamar al siguiente", body: "Cuando queda libre una mesa o un turno, toque «Chamar o seguinte» (llamar al siguiente): llama al siguiente número, sea cual sea el profesional que pidió. Si esa persona pidió a alguien que aún está ocupado, llame a otra desde el «⋯» («Chamar já», llamar ya)." },
              { title: "Nada que marcar", body: "A quien se llama se le está atendiendo. Llamar al siguiente marca la llamada más antigua como atendida (hasta una persona por profesional a la vez), y el cliente ve en su número el botón para dejar una reseña." },
              { title: "Si no se presenta", body: "En el «⋯» de la persona, toque «Não apareceu» (no se presentó). Con la opción activada, se llama al siguiente enseguida." },
              { title: "Excepciones", body: "Cuando la cola pregunta el número de personas (restaurantes), cada grupo tiene «Chamar» (llamar): se queda libre una mesa para 2 y se llama al primer grupo que cabe, aunque no sea el siguiente. En el «⋯» de cada persona: llamar fuera de orden, subir o bajar en la cola, volver a llamar, marcar como atendido o que se fue." },
            ],
          },
          { type: "h2", id: "desk", text: "Apuntar a alguien a la cola" },
          { type: "p", text: "Para quien no quiere usar el móvil: «Adicionar alguém à fila» (apuntar a alguien a la cola), solo con un nombre. Funciona incluso con la cola cerrada." },
          { type: "h2", id: "sound", text: "Sonido de nuevas entradas" },
          { type: "p", text: "Active «Som de novas entradas» (sonido de nuevas entradas) en el dispositivo del mostrador para oír cuando alguien se apunta. Se recuerda en ese dispositivo." },
          {
            type: "callout",
            tone: "tip",
            text: "No hay tiempo límite para llegar: la llamada sigue abierta hasta que se llama al siguiente. «Não apareceu» sirve para las estadísticas y para llamar al siguiente enseguida.",
          },
        ],
      },
      fr: {
        title: "La liste d'attente au quotidien",
        description: "Comment gérer la file chaque jour : appeler le suivant, les absents, inscrire quelqu'un dans la file et fermer la file.",
        blocks: [
          { type: "p", text: "Utilisez l'onglet **Fila** (file) de l'écran «Atendimento» (ou de la liste d'attente) sur le téléphone ou la tablette du comptoir. La page se met à jour toute seule." },
          {
            type: "steps",
            items: [
              { title: "Appeler le suivant", body: "Quand une table ou un créneau se libère, touchez «Chamar o seguinte» (appeler le suivant) : le ticket suivant est appelé, quel que soit le membre de l'équipe demandé. Si cette personne a demandé quelqu'un encore occupé, appelez-en une autre depuis le «⋯» («Chamar já», appeler maintenant)." },
              { title: "Rien à cocher", body: "La personne appelée est en train d'être servie. Appeler le suivant marque l'appel le plus ancien comme servi (une personne par membre de l'équipe à la fois au maximum), et le client voit sur son ticket le bouton pour laisser un avis." },
              { title: "S'il ne se présente pas", body: "Dans le «⋯» de la personne, touchez «Não apareceu» (absent). Avec l'option activée, le suivant est appelé aussitôt." },
              { title: "Exceptions", body: "Quand la file demande le nombre de personnes (restaurants), chaque groupe a «Chamar» (appeler) : une table pour 2 se libère, vous appelez le premier groupe qui y tient, même s'il n'est pas le suivant. Dans le «⋯» de chaque personne : appeler hors tour, monter ou descendre dans la file, rappeler, marquer comme servi ou comme parti." },
            ],
          },
          { type: "h2", id: "desk", text: "Inscrire quelqu'un dans la file" },
          { type: "p", text: "Pour ceux qui ne veulent pas utiliser leur téléphone : «Adicionar alguém à fila» (inscrire quelqu'un dans la file), avec juste un nom. Ça fonctionne même file fermée." },
          { type: "h2", id: "sound", text: "Son des nouvelles inscriptions" },
          { type: "p", text: "Activez «Som de novas entradas» (son des nouvelles inscriptions) sur l'appareil du comptoir pour entendre quand quelqu'un s'inscrit. Le réglage est mémorisé sur cet appareil." },
          {
            type: "callout",
            tone: "tip",
            text: "Il n'y a pas de délai pour se présenter : l'appel reste ouvert jusqu'à ce que le suivant soit appelé. «Não apareceu» sert aux statistiques et à appeler le suivant tout de suite.",
          },
        ],
      },
      de: {
        title: "Die Warteliste im Alltag",
        description: "So führen Sie die Warteschlange jeden Tag: den Nächsten aufrufen, nicht Erschienene, jemanden eintragen und die Warteschlange schließen.",
        blocks: [
          { type: "p", text: "Nutzen Sie den Reiter **Fila** (Warteschlange) des Bildschirms «Atendimento» (oder der Warteliste) auf dem Handy oder Tablet an der Theke. Die Seite aktualisiert sich von selbst." },
          {
            type: "steps",
            items: [
              { title: "Den Nächsten aufrufen", body: "Wird ein Tisch oder ein Termin frei, tippen Sie auf «Chamar o seguinte» (den Nächsten aufrufen): Die nächste Nummer wird aufgerufen, egal welche Fachkraft gewünscht wurde. Hat diese Person jemanden gewünscht, der noch beschäftigt ist, rufen Sie über «⋯» eine andere auf («Chamar já», jetzt aufrufen)." },
              { title: "Nichts abzuhaken", body: "Wer aufgerufen ist, wird gerade bedient. Der Aufruf des Nächsten markiert den ältesten Aufruf als bedient (höchstens eine Person pro Fachkraft gleichzeitig), und der Kunde sieht auf seiner Wartenummer die Schaltfläche, um eine Bewertung abzugeben." },
              { title: "Wenn jemand nicht erscheint", body: "Tippen Sie im «⋯» der Person auf «Não apareceu» (nicht erschienen). Ist die Option eingeschaltet, wird sofort der Nächste aufgerufen." },
              { title: "Ausnahmen", body: "Fragt die Warteschlange die Zahl der Personen ab (Restaurants), hat jede Gruppe «Chamar» (aufrufen): Ein Tisch für 2 wird frei, also rufen Sie die erste Gruppe auf, die Platz hat, auch wenn sie nicht als Nächste dran ist. Im «⋯» jeder Person: außer der Reihe aufrufen, in der Warteschlange nach oben oder unten schieben, erneut aufrufen, als bedient oder als gegangen markieren." },
            ],
          },
          { type: "h2", id: "desk", text: "Jemanden in die Warteschlange eintragen" },
          { type: "p", text: "Für alle, die ihr Handy nicht nutzen möchten: «Adicionar alguém à fila» (jemanden eintragen), nur mit einem Namen. Das funktioniert auch bei geschlossener Warteschlange." },
          { type: "h2", id: "sound", text: "Ton bei neuen Einträgen" },
          { type: "p", text: "Schalten Sie auf dem Gerät an der Theke «Som de novas entradas» (Ton bei neuen Einträgen) ein, um zu hören, wenn sich jemand einreiht. Die Einstellung bleibt auf diesem Gerät gespeichert." },
          {
            type: "callout",
            tone: "tip",
            text: "Es gibt keine Frist zum Erscheinen: Der Aufruf bleibt offen, bis der Nächste aufgerufen wird. «Não apareceu» dient der Statistik und dazu, sofort den Nächsten aufzurufen.",
          },
        ],
      },
      it: {
        title: "La lista d'attesa ogni giorno",
        description: "Come gestire la coda ogni giorno: chiamare il prossimo, chi non si presenta, mettere qualcuno in coda e chiudere la coda.",
        blocks: [
          { type: "p", text: "Usate la scheda **Fila** (coda) della schermata «Atendimento» (o della lista d'attesa) sul telefono o sul tablet del banco. La pagina si aggiorna da sola." },
          {
            type: "steps",
            items: [
              { title: "Chiamare il prossimo", body: "Quando si libera un tavolo o un turno, toccate «Chamar o seguinte» (chiama il prossimo): viene chiamato il numero successivo, qualunque sia il professionista richiesto. Se quella persona ha chiesto qualcuno ancora occupato, chiamatene un'altra dal «⋯» («Chamar já», chiama ora)." },
              { title: "Niente da segnare", body: "Chi viene chiamato è in servizio. Chiamare il prossimo segna come servita la chiamata più vecchia (al massimo una persona per professionista alla volta), e il cliente vede sul suo numero il pulsante per lasciare una recensione." },
              { title: "Se non si presenta", body: "Nel «⋯» della persona, toccate «Não apareceu» (non si è presentato). Con l'opzione attiva, il prossimo viene chiamato subito." },
              { title: "Eccezioni", body: "Quando la coda chiede il numero di persone (ristoranti), ogni gruppo ha «Chamar» (chiama): si libera un tavolo per 2 e chiamate il primo gruppo che ci sta, anche se non è il prossimo. Nel «⋯» di ogni persona: chiamare fuori ordine, spostare su o giù nella coda, richiamare, segnare come servito o come andato via." },
            ],
          },
          { type: "h2", id: "desk", text: "Mettere qualcuno in coda" },
          { type: "p", text: "Per chi non vuole usare il telefono: «Adicionar alguém à fila» (metti qualcuno in coda), solo con un nome. Funziona anche con la coda chiusa." },
          { type: "h2", id: "sound", text: "Suono per i nuovi ingressi" },
          { type: "p", text: "Attivate «Som de novas entradas» (suono per i nuovi ingressi) sul dispositivo del banco per sentire quando qualcuno si mette in coda. L'impostazione resta su quel dispositivo." },
          {
            type: "callout",
            tone: "tip",
            text: "Non c'è un limite di tempo per arrivare: la chiamata resta aperta finché non si chiama il prossimo. «Não apareceu» serve per le statistiche e per chiamare subito il prossimo.",
          },
        ],
      },
    },
    troubleshooting: {
      pt: {
        title: "Resolução de problemas da lista de espera",
        description: "Soluções para problemas comuns: o cliente não foi avisado, o QR ou a placa não abrem, estimativas longe da realidade e o ecrã sem atualizar.",
        blocks: [
          { type: "h2", id: "aviso-nao-chega", text: "O cliente não foi avisado" },
          {
            type: "ol",
            items: [
              "Com «Ativar avisos», o Android e os computadores recebem uma notificação mesmo com a página fechada. No iPhone isso só funciona com a senha adicionada ao ecrã principal e aberta a partir desse ícone (a página mostra os passos); sem isso, toca só com a página aberta.",
              "Com os avisos ligados, «Enviar notificação de teste» na senha confirma que a notificação chega a esse telemóvel.",
              "Chame-o outra vez no «⋯», ligue-lhe se deixou o telemóvel, ou chame pelo número da senha.",
            ],
          },
          { type: "h2", id: "qr-placa-nao-abre", text: "O QR ou a placa não abrem a página" },
          {
            type: "ol",
            items: [
              "Confirme que o QR não está danificado nem com reflexos.",
              "Para a placa, a leitura por aproximação tem de estar ligada no telemóvel (alguns Android têm-na desligada nas definições de ligações).",
              "Se continuar, contacte-nos: verificamos o link programado.",
            ],
          },
          { type: "h2", id: "estimativa", text: "A espera estimada está longe da realidade" },
          { type: "p", text: "Ajuste «Minutos por vez» nas definições. A estimativa também se adapta sozinha ao ritmo das últimas chamadas." },
          { type: "h2", id: "ecra", text: "O ecrã de chamada não atualiza" },
          { type: "p", text: "Confirme a ligação à internet da TV ou do computador e recarregue a página. Para ter som, carregue uma vez em «Ativar som»." },
          { type: "h2", id: "fila-fechada", text: "A fila fechou sozinha" },
          { type: "p", text: "Com «Abrir e fechar com o horário» ligado, a fila fecha à hora de fecho. Pode reabrir à mão a qualquer momento." },
        ],
      },
      en: {
        title: "Waitlist troubleshooting",
        description: "Fixes for common issues: the customer wasn't alerted, the QR code or plate doesn't open, unrealistic wait estimates and the screen not updating.",
        blocks: [
          { type: "h2", id: "alert-not-received", text: "The customer wasn't alerted" },
          {
            type: "ol",
            items: [
              "With «Turn on alerts», Android phones and computers get a notification even with the page closed. On iPhone that only works with the ticket added to the home screen and opened from that icon (the page shows the steps); otherwise it only rings with the page open.",
              "With alerts on, «Send a test notification» on the ticket confirms the notification reaches that phone.",
              "Call them again from the «⋯», phone them if they left a number, or call out their ticket number.",
            ],
          },
          { type: "h2", id: "qr-plate-not-opening", text: "The QR code or plate does not open the page" },
          {
            type: "ol",
            items: [
              "Check the QR code isn't damaged or catching glare.",
              "For the plate, the phone's contactless (tap) reading must be on (some Android phones have it off in the connection settings).",
              "If it still fails, contact us: we'll check the programmed link.",
            ],
          },
          { type: "h2", id: "estimate", text: "The estimated wait is far off" },
          { type: "p", text: "Adjust «Minutes per turn» in the settings. The estimate also adapts by itself to the pace of the latest calls." },
          { type: "h2", id: "screen", text: "The call screen doesn't update" },
          { type: "p", text: "Check the TV or computer's internet connection and reload the page. For sound, tap «Enable sound» once." },
          { type: "h2", id: "queue-closed", text: "The queue closed by itself" },
          { type: "p", text: "With «Open and close with opening hours» on, the queue closes at closing time. You can reopen it by hand at any time." },
        ],
      },
      es: {
        title: "Solución de problemas de la lista de espera",
        description: "Soluciones a los problemas más habituales: el cliente no recibió el aviso, el código QR o la placa no abren, esperas estimadas poco realistas y la pantalla que no se actualiza.",
        blocks: [
          { type: "h2", id: "alert-not-received", text: "El cliente no recibió el aviso" },
          {
            type: "ol",
            items: [
              "Con «Ativar avisos» (activar avisos), los móviles Android y los ordenadores reciben una notificación incluso con la página cerrada. En iPhone solo funciona con el número añadido a la pantalla de inicio y abierto desde ese icono (la página muestra los pasos); si no, solo suena con la página abierta.",
              "Con los avisos activados, «Enviar notificação de teste» (enviar notificación de prueba) en el número confirma que la notificación llega a ese móvil.",
              "Vuelva a llamarle desde el «⋯», llámele por teléfono si dejó su número o diga su número en voz alta.",
            ],
          },
          { type: "h2", id: "qr-plate-not-opening", text: "El código QR o la placa no abren la página" },
          {
            type: "ol",
            items: [
              "Compruebe que el código QR no está dañado ni tiene reflejos.",
              "Para la placa, la lectura por contacto (un toque) del móvil tiene que estar activada (algunos Android la tienen desactivada en los ajustes de conexiones).",
              "Si sigue sin funcionar, contacte con nosotros: revisamos el enlace grabado.",
            ],
          },
          { type: "h2", id: "estimate", text: "La espera estimada está muy desviada" },
          { type: "p", text: "Ajuste «Minutos por vez» (minutos por turno) en los ajustes. La estimación también se adapta sola al ritmo de las últimas llamadas." },
          { type: "h2", id: "screen", text: "La pantalla de llamadas no se actualiza" },
          { type: "p", text: "Compruebe la conexión a internet del televisor o del ordenador y recargue la página. Para el sonido, toque «Ativar som» (activar sonido) una vez." },
          { type: "h2", id: "queue-closed", text: "La cola se cerró sola" },
          { type: "p", text: "Con «Abrir e fechar com o horário» (abrir y cerrar con el horario) activado, la cola se cierra a la hora de cierre. Puede volver a abrirla a mano en cualquier momento." },
        ],
      },
      fr: {
        title: "Résoudre les problèmes de la liste d'attente",
        description: "Solutions aux problèmes courants : le client n'a pas été prévenu, le QR code ou la plaque n'ouvre pas la page, attentes estimées irréalistes et écran qui ne se met pas à jour.",
        blocks: [
          { type: "h2", id: "alert-not-received", text: "Le client n'a pas été prévenu" },
          {
            type: "ol",
            items: [
              "Avec «Ativar avisos» (activer les alertes), les téléphones Android et les ordinateurs reçoivent une notification même page fermée. Sur iPhone, cela ne marche que si le ticket a été ajouté à l'écran d'accueil et ouvert depuis cette icône (la page montre les étapes) ; sinon, il ne sonne que page ouverte.",
              "Avec les alertes activées, «Enviar notificação de teste» (envoyer une notification de test) sur le ticket confirme que la notification arrive sur ce téléphone.",
              "Rappelez-le depuis le «⋯», téléphonez-lui s'il a laissé son numéro, ou annoncez son numéro de ticket à voix haute.",
            ],
          },
          { type: "h2", id: "qr-plate-not-opening", text: "Le QR code ou la plaque n'ouvre pas la page" },
          {
            type: "ol",
            items: [
              "Vérifiez que le QR code n'est pas abîmé et ne reflète pas la lumière.",
              "Pour la plaque, la lecture sans contact (un toucher) du téléphone doit être activée (certains Android l'ont désactivée dans les paramètres de connexion).",
              "Si ça ne marche toujours pas, contactez-nous : nous vérifions le lien programmé.",
            ],
          },
          { type: "h2", id: "estimate", text: "L'attente estimée est très éloignée de la réalité" },
          { type: "p", text: "Ajustez «Minutos por vez» (minutes par tour) dans les paramètres. L'estimation s'adapte aussi d'elle-même au rythme des derniers appels." },
          { type: "h2", id: "screen", text: "L'écran d'appel ne se met pas à jour" },
          { type: "p", text: "Vérifiez la connexion internet de la télévision ou de l'ordinateur et rechargez la page. Pour le son, touchez une fois «Ativar som» (activer le son)." },
          { type: "h2", id: "queue-closed", text: "La file s'est fermée toute seule" },
          { type: "p", text: "Avec «Abrir e fechar com o horário» (ouvrir et fermer selon les horaires) activé, la file se ferme à l'heure de fermeture. Vous pouvez la rouvrir à la main à tout moment." },
        ],
      },
      de: {
        title: "Fehlerbehebung bei der Warteliste",
        description: "Lösungen für häufige Probleme: Der Kunde wurde nicht benachrichtigt, QR-Code oder Schild öffnen die Seite nicht, unrealistische Wartezeiten und ein Bildschirm, der sich nicht aktualisiert.",
        blocks: [
          { type: "h2", id: "alert-not-received", text: "Der Kunde wurde nicht benachrichtigt" },
          {
            type: "ol",
            items: [
              "Mit «Ativar avisos» (Benachrichtigungen einschalten) bekommen Android-Handys und Computer auch bei geschlossener Seite eine Mitteilung. Beim iPhone funktioniert das nur, wenn die Wartenummer zum Home-Bildschirm hinzugefügt und über dieses Symbol geöffnet wurde (die Seite zeigt die Schritte); sonst klingelt es nur bei geöffneter Seite.",
              "Bei eingeschalteten Benachrichtigungen bestätigt «Enviar notificação de teste» (Testbenachrichtigung senden) auf der Wartenummer, dass die Mitteilung auf diesem Handy ankommt.",
              "Rufen Sie ihn über «⋯» erneut auf, rufen Sie ihn an, wenn er eine Nummer hinterlassen hat, oder rufen Sie seine Wartenummer laut aus.",
            ],
          },
          { type: "h2", id: "qr-plate-not-opening", text: "QR-Code oder Schild öffnen die Seite nicht" },
          {
            type: "ol",
            items: [
              "Prüfen Sie, ob der QR-Code beschädigt ist oder spiegelt.",
              "Für das Schild muss das kontaktlose Lesen (Antippen) am Handy eingeschaltet sein (manche Android-Handys haben es in den Verbindungseinstellungen ausgeschaltet).",
              "Klappt es dann noch nicht, kontaktieren Sie uns: Wir prüfen den gespeicherten Link.",
            ],
          },
          { type: "h2", id: "estimate", text: "Die geschätzte Wartezeit stimmt gar nicht" },
          { type: "p", text: "Passen Sie «Minutos por vez» (Minuten pro Kunde) in den Einstellungen an. Die Schätzung passt sich außerdem von selbst an das Tempo der letzten Aufrufe an." },
          { type: "h2", id: "screen", text: "Der Aufrufbildschirm aktualisiert sich nicht" },
          { type: "p", text: "Prüfen Sie die Internetverbindung des Fernsehers oder Computers und laden Sie die Seite neu. Für den Ton tippen Sie einmal auf «Ativar som» (Ton einschalten)." },
          { type: "h2", id: "queue-closed", text: "Die Warteschlange hat sich von selbst geschlossen" },
          { type: "p", text: "Ist «Abrir e fechar com o horário» (mit den Öffnungszeiten öffnen und schließen) eingeschaltet, schließt die Warteschlange zur Schließzeit. Sie können sie jederzeit von Hand wieder öffnen." },
        ],
      },
      it: {
        title: "Risoluzione dei problemi della lista d'attesa",
        description: "Soluzioni ai problemi più comuni: il cliente non ha ricevuto l'avviso, il codice QR o la targa non aprono la pagina, attese stimate irrealistiche e lo schermo che non si aggiorna.",
        blocks: [
          { type: "h2", id: "alert-not-received", text: "Il cliente non ha ricevuto l'avviso" },
          {
            type: "ol",
            items: [
              "Con «Ativar avisos» (attiva gli avvisi), i telefoni Android e i computer ricevono una notifica anche con la pagina chiusa. Su iPhone funziona solo con il numero aggiunto alla schermata Home e aperto da quell'icona (la pagina mostra i passaggi); altrimenti suona solo con la pagina aperta.",
              "Con gli avvisi attivi, «Enviar notificação de teste» (invia una notifica di prova) sul numero conferma che la notifica arriva su quel telefono.",
              "Richiamatelo dal «⋯», telefonategli se ha lasciato il numero, oppure chiamate ad alta voce il suo numero.",
            ],
          },
          { type: "h2", id: "qr-plate-not-opening", text: "Il codice QR o la targa non aprono la pagina" },
          {
            type: "ol",
            items: [
              "Verificate che il codice QR non sia rovinato o non rifletta la luce.",
              "Per la targa, la lettura contactless (un tocco) del telefono deve essere attiva (alcuni Android la hanno disattivata nelle impostazioni di connessione).",
              "Se ancora non funziona, contattateci: controlliamo il link programmato.",
            ],
          },
          { type: "h2", id: "estimate", text: "L'attesa stimata è molto lontana dalla realtà" },
          { type: "p", text: "Regolate «Minutos por vez» (minuti per turno) nelle impostazioni. La stima si adatta anche da sola al ritmo delle ultime chiamate." },
          { type: "h2", id: "screen", text: "Lo schermo delle chiamate non si aggiorna" },
          { type: "p", text: "Verificate la connessione internet della TV o del computer e ricaricate la pagina. Per il suono, toccate una volta «Ativar som» (attiva il suono)." },
          { type: "h2", id: "queue-closed", text: "La coda si è chiusa da sola" },
          { type: "p", text: "Con «Abrir e fechar com o horário» (aprire e chiudere con gli orari) attivo, la coda si chiude all'orario di chiusura. Potete riaprirla a mano in qualsiasi momento." },
        ],
      },
    },
    faq: {
      pt: {
        title: "Perguntas frequentes sobre a lista de espera digital",
        description: "Respostas às dúvidas mais comuns sobre a lista de espera digital da Steevanz: aplicações, avisos, placas, faltas, ecrã e RGPD.",
        blocks: [
          { type: "h2", id: "perguntas", text: "Perguntas e respostas" },
          {
            type: "faq",
            items: [
              { q: "O cliente precisa de instalar alguma app?", a: "Não. Entra pelo navegador, depois de ler o QR code ou tocar na placa." },
              { q: "Como é avisado o cliente?", a: "Na página da senha (som, vibração no Android e notificação no telemóvel, com os avisos ligados). Não enviamos SMS nem WhatsApp." },
              { q: "Quanto tempo tem o cliente para chegar?", a: "Não há tempo limite: a vez é dele até a equipa chamar o seguinte." },
              { q: "O cliente pode avisar que já não vem?", a: "Sim. Com um toque na senha sai da fila, e a equipa chama o seguinte." },
              { q: "O tempo de espera mostrado é garantido?", a: "Não. É uma estimativa que se ajusta ao ritmo real da fila, e é sempre apresentada como estimativa." },
              { q: "E quem não quer usar o telemóvel?", a: "A equipa adiciona-o à fila só com o nome e chama-o quando for a vez." },
              { q: "Que dados são guardados?", a: "O nome, o que escolheu e o telemóvel, se o deixar. São apagados ao fim de 30 dias, de acordo com o RGPD." },
            ],
          },
          {
            type: "ul",
            items: [
              "[Configuração](/docs/lista-espera-digital/configuracao): regras da fila e privacidade.",
              "[Utilização](/docs/lista-espera-digital/utilizacao): chamar, faltas e adicionar à fila.",
              "[Resolução de problemas](/docs/lista-espera-digital/resolucao-problemas): avisos, QR, placa e ecrã.",
            ],
          },
        ],
      },
      en: {
        title: "Digital waitlist FAQ",
        description: "Answers to common questions about the Steevanz digital waitlist: apps, alerts, plates, no-shows, the call screen and GDPR.",
        blocks: [
          { type: "h2", id: "questions", text: "Questions and answers" },
          {
            type: "faq",
            items: [
              { q: "Do customers need to install an app?", a: "No. They join in the browser after scanning the QR code or tapping the plate." },
              { q: "How are customers alerted?", a: "On their ticket page (sound, vibration on Android and a notification on the phone, with alerts on). We don't send SMS or WhatsApp messages." },
              { q: "How long do customers have to arrive?", a: "There is no time limit: the turn is theirs until your team calls the next one." },
              { q: "Can customers say they are no longer coming?", a: "Yes. One tap on their ticket takes them out of the queue, and your team calls the next person." },
              { q: "Is the displayed wait time guaranteed?", a: "No. It's an estimate that adjusts to the queue's real pace, and it's always shown as an estimate." },
              { q: "What about people who don't want to use their phone?", a: "Your team adds them to the queue with just a name and calls them when it's their turn." },
              { q: "What data is stored?", a: "The name, what they chose and the phone number if they leave one. It's deleted after 30 days, in line with GDPR." },
            ],
          },
          {
            type: "ul",
            items: [
              "[Configuration](/en/docs/digital-waitlist/configuration): queue rules and privacy.",
              "[Usage](/en/docs/digital-waitlist/usage): calling, no-shows and adding people to the queue.",
              "[Troubleshooting](/en/docs/digital-waitlist/troubleshooting): alerts, QR code, plate and the screen.",
            ],
          },
        ],
      },
      es: {
        title: "Preguntas frecuentes sobre la lista de espera digital",
        description: "Respuestas a las preguntas habituales sobre la lista de espera digital de Steevanz: apps, avisos, placas, clientes que no se presentan, la pantalla de llamadas y el RGPD.",
        blocks: [
          { type: "h2", id: "questions", text: "Preguntas y respuestas" },
          {
            type: "faq",
            items: [
              { q: "¿Los clientes tienen que instalar una app?", a: "No. Se apuntan en el navegador después de leer el código QR o tocar la placa." },
              { q: "¿Cómo se avisa a los clientes?", a: "En la página de su número (sonido, vibración en Android y una notificación en el móvil, con los avisos activados). No enviamos SMS ni mensajes de WhatsApp." },
              { q: "¿Cuánto tiempo tienen los clientes para llegar?", a: "No hay tiempo límite: el turno es suyo hasta que su equipo llama al siguiente." },
              { q: "¿Pueden los clientes avisar de que ya no vienen?", a: "Sí. Un toque en su número los saca de la cola, y su equipo llama a la siguiente persona." },
              { q: "¿El tiempo de espera que se muestra está garantizado?", a: "No. Es una estimación que se ajusta al ritmo real de la cola, y siempre se muestra como estimación." },
              { q: "¿Y las personas que no quieren usar el móvil?", a: "Su equipo las apunta a la cola solo con un nombre y las llama cuando les toca." },
              { q: "¿Qué datos se guardan?", a: "El nombre, lo que eligieron y el teléfono si lo dejan. Se borran a los 30 días, conforme al RGPD." },
            ],
          },
          {
            type: "ul",
            items: [
              "[Configuración](/es/docs/digital-waitlist/configuration): reglas de la cola y privacidad.",
              "[Uso](/es/docs/digital-waitlist/usage): llamadas, clientes que no se presentan y apuntar personas a la cola.",
              "[Solución de problemas](/es/docs/digital-waitlist/troubleshooting): avisos, código QR, placa y pantalla.",
            ],
          },
        ],
      },
      fr: {
        title: "Questions fréquentes sur la liste d'attente digitale",
        description: "Réponses aux questions courantes sur la liste d'attente digitale de Steevanz : applications, alertes, plaques, absents, écran d'appel et RGPD.",
        blocks: [
          { type: "h2", id: "questions", text: "Questions et réponses" },
          {
            type: "faq",
            items: [
              { q: "Les clients doivent-ils installer une application ?", a: "Non. Ils s'inscrivent dans le navigateur après avoir scanné le QR code ou touché la plaque." },
              { q: "Comment les clients sont-ils prévenus ?", a: "Sur la page de leur ticket (son, vibration sur Android et notification sur le téléphone, avec les alertes activées). Nous n'envoyons ni SMS ni messages WhatsApp." },
              { q: "Combien de temps les clients ont-ils pour se présenter ?", a: "Il n'y a pas de délai : le tour leur appartient jusqu'à ce que votre équipe appelle le suivant." },
              { q: "Les clients peuvent-ils dire qu'ils ne viennent plus ?", a: "Oui. Un toucher sur leur ticket les retire de la file, et votre équipe appelle la personne suivante." },
              { q: "Le temps d'attente affiché est-il garanti ?", a: "Non. C'est une estimation qui s'ajuste au rythme réel de la file, et elle est toujours présentée comme une estimation." },
              { q: "Et les personnes qui ne veulent pas utiliser leur téléphone ?", a: "Votre équipe les inscrit dans la file avec juste un nom et les appelle quand c'est leur tour." },
              { q: "Quelles données sont conservées ?", a: "Le nom, ce qu'ils ont choisi et le numéro de téléphone s'ils en laissent un. Elles sont supprimées au bout de 30 jours, conformément au RGPD." },
            ],
          },
          {
            type: "ul",
            items: [
              "[Configuration](/fr/docs/digital-waitlist/configuration) : règles de la file et confidentialité.",
              "[Utilisation](/fr/docs/digital-waitlist/usage) : appels, absents et inscription de personnes dans la file.",
              "[Résolution de problèmes](/fr/docs/digital-waitlist/troubleshooting) : alertes, QR code, plaque et écran.",
            ],
          },
        ],
      },
      de: {
        title: "Häufige Fragen zur digitalen Warteliste",
        description: "Antworten auf häufige Fragen zur digitalen Warteliste von Steevanz: Apps, Benachrichtigungen, Schilder, nicht Erschienene, der Aufrufbildschirm und die DSGVO.",
        blocks: [
          { type: "h2", id: "questions", text: "Fragen und Antworten" },
          {
            type: "faq",
            items: [
              { q: "Müssen Kunden eine App installieren?", a: "Nein. Sie reihen sich im Browser ein, nachdem sie den QR-Code gescannt oder auf das Schild getippt haben." },
              { q: "Wie werden Kunden benachrichtigt?", a: "Auf der Seite ihrer Wartenummer (Ton, Vibration bei Android und eine Mitteilung auf dem Handy, bei eingeschalteten Benachrichtigungen). Wir verschicken keine SMS und keine WhatsApp-Nachrichten." },
              { q: "Wie viel Zeit haben Kunden, um zu kommen?", a: "Es gibt keine Frist: Sie sind an der Reihe, bis Ihr Team den Nächsten aufruft." },
              { q: "Können Kunden Bescheid geben, dass sie nicht mehr kommen?", a: "Ja. Ein Antippen auf ihrer Wartenummer nimmt sie aus der Warteschlange, und Ihr Team ruft die nächste Person auf." },
              { q: "Ist die angezeigte Wartezeit garantiert?", a: "Nein. Sie ist eine Schätzung, die sich dem tatsächlichen Tempo der Warteschlange anpasst, und wird immer als Schätzung angezeigt." },
              { q: "Und Personen, die ihr Handy nicht nutzen möchten?", a: "Ihr Team trägt sie nur mit einem Namen in die Warteschlange ein und ruft sie auf, wenn sie an der Reihe sind." },
              { q: "Welche Daten werden gespeichert?", a: "Der Name, die Auswahl und die Telefonnummer, wenn eine angegeben wird. Sie werden nach 30 Tagen gelöscht, im Einklang mit der DSGVO." },
            ],
          },
          {
            type: "ul",
            items: [
              "[Konfiguration](/de/docs/digital-waitlist/configuration): Regeln der Warteschlange und Datenschutz.",
              "[Nutzung](/de/docs/digital-waitlist/usage): Aufrufe, nicht Erschienene und Personen eintragen.",
              "[Fehlerbehebung](/de/docs/digital-waitlist/troubleshooting): Benachrichtigungen, QR-Code, Schild und Bildschirm.",
            ],
          },
        ],
      },
      it: {
        title: "Domande frequenti sulla lista d'attesa digitale",
        description: "Risposte alle domande più comuni sulla lista d'attesa digitale di Steevanz: app, avvisi, targhe, chi non si presenta, lo schermo delle chiamate e il GDPR.",
        blocks: [
          { type: "h2", id: "questions", text: "Domande e risposte" },
          {
            type: "faq",
            items: [
              { q: "I clienti devono installare un'app?", a: "No. Si mettono in coda dal browser dopo aver inquadrato il codice QR o toccato la targa." },
              { q: "Come vengono avvisati i clienti?", a: "Sulla pagina del loro numero (suono, vibrazione su Android e una notifica sul telefono, con gli avvisi attivi). Non inviamo SMS né messaggi WhatsApp." },
              { q: "Quanto tempo hanno i clienti per arrivare?", a: "Non c'è un limite di tempo: il turno è loro finché il vostro staff non chiama il prossimo." },
              { q: "I clienti possono avvisare che non vengono più?", a: "Sì. Un tocco sul loro numero li toglie dalla coda, e il vostro staff chiama la persona successiva." },
              { q: "Il tempo di attesa mostrato è garantito?", a: "No. È una stima che si adatta al ritmo reale della coda, ed è sempre mostrata come stima." },
              { q: "E chi non vuole usare il telefono?", a: "Il vostro staff lo mette in coda solo con un nome e lo chiama quando è il suo turno." },
              { q: "Quali dati vengono conservati?", a: "Il nome, ciò che hanno scelto e il numero di telefono, se lo lasciano. Vengono cancellati dopo 30 giorni, nel rispetto del GDPR." },
            ],
          },
          {
            type: "ul",
            items: [
              "[Configurazione](/it/docs/digital-waitlist/configuration): regole della coda e privacy.",
              "[Utilizzo](/it/docs/digital-waitlist/usage): chiamate, chi non si presenta e mettere persone in coda.",
              "[Risoluzione dei problemi](/it/docs/digital-waitlist/troubleshooting): avvisi, codice QR, targa e schermo.",
            ],
          },
        ],
      },
    },
  },
};
