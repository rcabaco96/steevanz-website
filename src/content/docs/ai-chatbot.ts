import type { ProductDocs } from "../types";

export const docs: ProductDocs = {
  productId: "ai-chatbot",
  pages: {
    "getting-started": {
      pt: {
        title: "Primeiros passos com o chatbot com IA",
        description:
          "O que é o chatbot com IA da Steevanz, onde funciona (site e WhatsApp), o que sabe responder, os seus limites e o que precisa de preparar para começar.",
        blocks: [
          {
            type: "p",
            text: "O chatbot com IA responde às perguntas dos seus clientes no **site** e no **WhatsApp**, a qualquer hora, com base na informação do seu negócio: menu, preços, horários, serviços e políticas. Quando a conversa pede uma marcação ou uma pessoa, encaminha para o link de reserva ou para a sua equipa.",
          },
          { type: "h2", id: "o-que-faz", text: "O que o chatbot faz" },
          {
            type: "ul",
            items: [
              "Responde a perguntas frequentes: horários, morada, estacionamento, preços, serviços, alergénios, formas de pagamento.",
              "Encaminha para o seu [sistema de reservas](/produtos/sistema-reservas-online) quando o cliente quer marcar.",
              "Passa a conversa para uma pessoa da equipa quando o pedido sai do âmbito definido.",
              "Responde na língua do cliente, útil para zonas turísticas.",
              "Guarda o histórico das conversas para consultar e melhorar as respostas.",
            ],
          },
          { type: "h2", id: "limites", text: "O que o chatbot não faz" },
          {
            type: "p",
            text: "O chatbot só responde com base na informação que lhe foi dada. Quando não sabe, diz que não sabe e oferece o contacto da equipa, em vez de inventar. Ainda assim, como qualquer sistema de IA, **pode cometer erros**, por isso recomendamos rever as conversas regularmente, sobretudo nas primeiras semanas.",
          },
          {
            type: "callout",
            tone: "warning",
            title: "Clínicas e saúde",
            text: "Em clínicas, o chatbot está configurado para não dar aconselhamento médico, diagnósticos ou indicações de medicação. Pode explicar serviços, preços e marcações, e encaminha qualquer questão clínica para a equipa.",
          },
          { type: "h2", id: "canais", text: "Site e WhatsApp" },
          {
            type: "table",
            head: ["Canal", "Como o cliente fala com o chatbot", "O que é preciso"],
            rows: [
              ["Site", "Uma janela de conversa no canto do ecrã", "Colar um pequeno código no site, uma única vez"],
              ["WhatsApp", "Envia mensagem para o número do negócio", "Um número ligado à WhatsApp Business Platform e verificação da empresa junto da Meta"],
            ],
          },
          { type: "h2", id: "o-que-preparar", text: "O que preparar" },
          {
            type: "ul",
            items: [
              "Menu ou lista de serviços com preços atualizados.",
              "Horários, incluindo feriados e épocas especiais.",
              "Políticas: cancelamentos, grupos, animais, pagamentos, reembolsos.",
              "As perguntas que a sua equipa mais recebe e as respostas que costuma dar.",
              "O que deve ser sempre passado para uma pessoa (reclamações, pedidos especiais, eventos).",
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "Continue para a [instalação](/docs/chatbot-ia/instalacao) ou [agende uma demonstração](/agendar) para ver o chatbot a responder com dados de um negócio como o seu.",
          },
        ],
      },
      en: {
        title: "Getting started with the AI chatbot",
        description:
          "What the Steevanz AI chatbot is, where it works (website and WhatsApp), what it can answer, its limits and what you need to prepare to get started.",
        blocks: [
          {
            type: "p",
            text: "The AI chatbot answers your customers' questions on your **website** and on **WhatsApp**, at any time, based on your business's information: menu, prices, opening hours, services and policies. When a conversation calls for a booking or a person, it hands over to your booking link or your team.",
          },
          { type: "h2", id: "what-it-does", text: "What the chatbot does" },
          {
            type: "ul",
            items: [
              "Answers common questions: opening hours, address, parking, prices, services, allergens, payment methods.",
              "Directs customers to your [booking system](/en/products/online-booking-system) when they want to book.",
              "Hands the conversation to a team member when a request falls outside its defined scope.",
              "Replies in the customer's language, which helps in tourist areas.",
              "Keeps a conversation history so you can review it and improve answers.",
            ],
          },
          { type: "h2", id: "limits", text: "What the chatbot does not do" },
          {
            type: "p",
            text: "The chatbot only answers based on the information it has been given. When it does not know, it says so and offers your team's contact details instead of making something up. Even so, like any AI system, **it can make mistakes**, so we recommend reviewing conversations regularly, especially in the first few weeks.",
          },
          {
            type: "callout",
            tone: "warning",
            title: "Clinics and healthcare",
            text: "For clinics, the chatbot is configured not to give medical advice, diagnoses or medication guidance. It can explain services, prices and bookings, and passes any clinical question to your team.",
          },
          { type: "h2", id: "channels", text: "Website and WhatsApp" },
          {
            type: "table",
            head: ["Channel", "How customers talk to the chatbot", "What is needed"],
            rows: [
              ["Website", "A chat window in the corner of the screen", "Pasting a short snippet into your site, once"],
              ["WhatsApp", "They message your business number", "A number connected to the WhatsApp Business Platform and business verification with Meta"],
            ],
          },
          { type: "h2", id: "what-to-prepare", text: "What to prepare" },
          {
            type: "ul",
            items: [
              "Your menu or service list with up-to-date prices.",
              "Opening hours, including bank holidays and seasonal changes.",
              "Policies: cancellations, groups, pets, payments, refunds.",
              "The questions your team gets asked most and the answers they usually give.",
              "What should always go to a person (complaints, special requests, events).",
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "Continue to [setup](/en/docs/ai-chatbot/setup) or [book a demo](/en/book-a-demo) to see the chatbot answering with data from a business like yours.",
          },
        ],
      },
      es: {
        title: "Primeros pasos con el chatbot con IA",
        description:
          "Qué es el chatbot con IA de Steevanz, dónde funciona (web y WhatsApp), qué sabe responder, sus límites y qué necesita preparar para empezar.",
        blocks: [
          {
            type: "p",
            text: "El chatbot con IA responde a las preguntas de sus clientes en la **web** y en **WhatsApp**, a cualquier hora, a partir de la información de su negocio: carta, precios, horarios, servicios y políticas. Cuando la conversación requiere una reserva o una persona, deriva al enlace de reservas o a su equipo.",
          },
          { type: "h2", id: "what-it-does", text: "Lo que hace el chatbot" },
          {
            type: "ul",
            items: [
              "Responde a preguntas frecuentes: horarios, dirección, aparcamiento, precios, servicios, alérgenos, formas de pago.",
              "Dirige a su [sistema de reservas](/es/products/online-booking-system) cuando el cliente quiere reservar.",
              "Pasa la conversación a una persona del equipo cuando la petición sale del ámbito definido.",
              "Responde en el idioma del cliente, algo útil en zonas turísticas.",
              "Guarda el historial de las conversaciones para consultarlo y mejorar las respuestas.",
            ],
          },
          { type: "h2", id: "limits", text: "Lo que el chatbot no hace" },
          {
            type: "p",
            text: "El chatbot solo responde con la información que se le ha dado. Cuando no sabe algo, lo dice y ofrece el contacto del equipo, en lugar de inventar. Aun así, como cualquier sistema de IA, **puede equivocarse**, por eso recomendamos revisar las conversaciones con regularidad, sobre todo en las primeras semanas.",
          },
          {
            type: "callout",
            tone: "warning",
            title: "Clínicas y salud",
            text: "En clínicas, el chatbot está configurado para no dar consejo médico, diagnósticos ni indicaciones de medicación. Puede explicar servicios, precios y citas, y deriva cualquier cuestión clínica al equipo.",
          },
          { type: "h2", id: "channels", text: "Web y WhatsApp" },
          {
            type: "table",
            head: ["Canal", "Cómo habla el cliente con el chatbot", "Qué hace falta"],
            rows: [
              ["Web", "Una ventana de chat en la esquina de la pantalla", "Pegar un pequeño código en la web, una sola vez"],
              ["WhatsApp", "Envía un mensaje al número del negocio", "Un número conectado a WhatsApp Business Platform y la verificación de la empresa ante Meta"],
            ],
          },
          { type: "h2", id: "what-to-prepare", text: "Qué preparar" },
          {
            type: "ul",
            items: [
              "La carta o la lista de servicios con los precios actualizados.",
              "Los horarios, incluidos festivos y temporadas especiales.",
              "Las políticas: cancelaciones, grupos, mascotas, pagos, reembolsos.",
              "Las preguntas que más recibe su equipo y las respuestas que suele dar.",
              "Lo que siempre debe pasar a una persona (reclamaciones, peticiones especiales, eventos).",
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "Siga con la [instalación](/es/docs/ai-chatbot/setup) o [reserve una demostración](/es/book-a-demo) para ver el chatbot respondiendo con datos de un negocio como el suyo.",
          },
        ],
      },
      fr: {
        title: "Premiers pas avec le chatbot IA",
        description:
          "Ce qu'est le chatbot IA de Steevanz, où il fonctionne (site web et WhatsApp), ce qu'il sait répondre, ses limites et ce qu'il faut préparer pour commencer.",
        blocks: [
          {
            type: "p",
            text: "Le chatbot IA répond aux questions de vos clients sur votre **site web** et sur **WhatsApp**, à toute heure, à partir des informations de votre établissement : carte, prix, horaires, services et conditions. Quand la conversation demande une réservation ou une personne, il oriente vers votre lien de réservation ou vers votre équipe.",
          },
          { type: "h2", id: "what-it-does", text: "Ce que fait le chatbot" },
          {
            type: "ul",
            items: [
              "Répond aux questions fréquentes : horaires, adresse, stationnement, prix, services, allergènes, moyens de paiement.",
              "Oriente vers votre [système de réservation](/fr/products/online-booking-system) quand le client veut réserver.",
              "Passe la conversation à un membre de l'équipe quand la demande sort du cadre défini.",
              "Répond dans la langue du client, ce qui est utile dans les zones touristiques.",
              "Garde l'historique des conversations pour que vous puissiez le consulter et améliorer les réponses.",
            ],
          },
          { type: "h2", id: "limits", text: "Ce que le chatbot ne fait pas" },
          {
            type: "p",
            text: "Le chatbot ne répond qu'à partir des informations qu'on lui a données. Quand il ne sait pas, il le dit et propose le contact de l'équipe, au lieu d'inventer. Malgré tout, comme tout système d'IA, **il peut se tromper** : nous recommandons donc de relire les conversations régulièrement, surtout les premières semaines.",
          },
          {
            type: "callout",
            tone: "warning",
            title: "Cliniques et santé",
            text: "Dans les cliniques, le chatbot est configuré pour ne pas donner de conseils médicaux, de diagnostics ni d'indications de traitement. Il peut expliquer les services, les prix et les rendez-vous, et transmet toute question clinique à l'équipe.",
          },
          { type: "h2", id: "channels", text: "Site web et WhatsApp" },
          {
            type: "table",
            head: ["Canal", "Comment le client parle au chatbot", "Ce qu'il faut"],
            rows: [
              ["Site web", "Une fenêtre de discussion dans le coin de l'écran", "Coller un petit code dans le site, une seule fois"],
              ["WhatsApp", "Il envoie un message au numéro de l'établissement", "Un numéro relié à WhatsApp Business Platform et la vérification de l'entreprise auprès de Meta"],
            ],
          },
          { type: "h2", id: "what-to-prepare", text: "Ce qu'il faut préparer" },
          {
            type: "ul",
            items: [
              "Votre carte ou votre liste de services avec les prix à jour.",
              "Les horaires, y compris les jours fériés et les périodes particulières.",
              "Les conditions : annulations, groupes, animaux, paiements, remboursements.",
              "Les questions que votre équipe reçoit le plus et les réponses qu'elle donne d'habitude.",
              "Ce qui doit toujours être transmis à une personne (réclamations, demandes spéciales, événements).",
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "Passez à l'[installation](/fr/docs/ai-chatbot/setup) ou [réservez une démonstration](/fr/book-a-demo) pour voir le chatbot répondre avec les données d'un établissement comme le vôtre.",
          },
        ],
      },
      de: {
        title: "Erste Schritte mit dem KI-Chatbot",
        description:
          "Was der KI-Chatbot von Steevanz ist, wo er funktioniert (Website und WhatsApp), was er beantworten kann, wo seine Grenzen liegen und was Sie für den Start vorbereiten sollten.",
        blocks: [
          {
            type: "p",
            text: "Der KI-Chatbot beantwortet die Fragen Ihrer Kunden auf Ihrer **Website** und bei **WhatsApp**, zu jeder Uhrzeit, auf Grundlage der Informationen Ihres Betriebs: Speisekarte, Preise, Öffnungszeiten, Leistungen und Regeln. Braucht das Gespräch eine Reservierung oder einen Menschen, leitet er zum Reservierungslink oder an Ihr Team weiter.",
          },
          { type: "h2", id: "what-it-does", text: "Was der Chatbot erledigt" },
          {
            type: "ul",
            items: [
              "Beantwortet häufige Fragen: Öffnungszeiten, Adresse, Parken, Preise, Leistungen, Allergene, Zahlungsarten.",
              "Leitet zu Ihrem [Reservierungssystem](/de/products/online-booking-system) weiter, wenn der Kunde buchen möchte.",
              "Übergibt das Gespräch an eine Person aus dem Team, wenn eine Anfrage über den festgelegten Rahmen hinausgeht.",
              "Antwortet in der Sprache des Kunden, was in touristischen Gegenden hilft.",
              "Speichert den Gesprächsverlauf, damit Sie ihn ansehen und die Antworten verbessern können.",
            ],
          },
          { type: "h2", id: "limits", text: "Was der Chatbot nicht übernimmt" },
          {
            type: "p",
            text: "Der Chatbot antwortet nur auf Grundlage der Informationen, die er erhalten hat. Weiß er etwas nicht, sagt er das und bietet den Kontakt zum Team an, statt etwas zu erfinden. Trotzdem **kann er sich irren**, wie jedes KI-System. Wir empfehlen daher, die Gespräche regelmäßig durchzusehen, vor allem in den ersten Wochen.",
          },
          {
            type: "callout",
            tone: "warning",
            title: "Praxen und Gesundheit",
            text: "In Praxen und Kliniken ist der Chatbot so eingestellt, dass er keine medizinischen Ratschläge, Diagnosen oder Hinweise zu Medikamenten gibt. Er kann Leistungen, Preise und Termine erklären und gibt jede medizinische Frage an das Team weiter.",
          },
          { type: "h2", id: "channels", text: "Website und WhatsApp" },
          {
            type: "table",
            head: ["Kanal", "Wie der Kunde mit dem Chatbot spricht", "Was nötig ist"],
            rows: [
              ["Website", "Ein Chatfenster in der Ecke des Bildschirms", "Einmalig einen kurzen Code in die Website einfügen"],
              ["WhatsApp", "Er schreibt an die Nummer des Betriebs", "Eine mit der WhatsApp Business Platform verbundene Nummer und die Unternehmensverifizierung bei Meta"],
            ],
          },
          { type: "h2", id: "what-to-prepare", text: "Was Sie vorbereiten sollten" },
          {
            type: "ul",
            items: [
              "Speisekarte oder Leistungsliste mit aktuellen Preisen.",
              "Öffnungszeiten, einschließlich Feiertagen und saisonaler Änderungen.",
              "Regeln: Stornierungen, Gruppen, Haustiere, Zahlungen, Erstattungen.",
              "Die Fragen, die Ihr Team am häufigsten bekommt, und die Antworten, die es üblicherweise gibt.",
              "Was immer an einen Menschen gehen soll (Beschwerden, Sonderwünsche, Veranstaltungen).",
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "Weiter zur [Einrichtung](/de/docs/ai-chatbot/setup) oder [buchen Sie eine Vorführung](/de/book-a-demo), um den Chatbot mit den Daten eines Betriebs wie Ihrem antworten zu sehen.",
          },
        ],
      },
      it: {
        title: "Primi passi con il chatbot con IA",
        description:
          "Cos'è il chatbot con IA di Steevanz, dove funziona (sito e WhatsApp), cosa sa rispondere, i suoi limiti e cosa preparare per iniziare.",
        blocks: [
          {
            type: "p",
            text: "Il chatbot con IA risponde alle domande dei Suoi clienti sul **sito** e su **WhatsApp**, a qualsiasi ora, in base alle informazioni della Sua attività: menù, prezzi, orari, servizi e regole. Quando la conversazione richiede una prenotazione o una persona, rimanda al link di prenotazione o al Suo team.",
          },
          { type: "h2", id: "what-it-does", text: "Cosa fa il chatbot" },
          {
            type: "ul",
            items: [
              "Risponde alle domande frequenti: orari, indirizzo, parcheggio, prezzi, servizi, allergeni, metodi di pagamento.",
              "Rimanda al Suo [sistema di prenotazione](/it/products/online-booking-system) quando il cliente vuole prenotare.",
              "Passa la conversazione a una persona del team quando la richiesta esce dall'ambito stabilito.",
              "Risponde nella lingua del cliente, utile nelle zone turistiche.",
              "Conserva lo storico delle conversazioni per consultarlo e migliorare le risposte.",
            ],
          },
          { type: "h2", id: "limits", text: "Cosa non fa il chatbot" },
          {
            type: "p",
            text: "Il chatbot risponde solo in base alle informazioni che gli sono state date. Quando non sa qualcosa, lo dice e offre il contatto del team, invece di inventare. Ciononostante, come qualsiasi sistema di IA, **può sbagliare**: per questo consigliamo di rivedere le conversazioni regolarmente, soprattutto nelle prime settimane.",
          },
          {
            type: "callout",
            tone: "warning",
            title: "Cliniche e salute",
            text: "Nelle cliniche il chatbot è configurato per non dare consigli medici, diagnosi o indicazioni sui farmaci. Può spiegare servizi, prezzi e appuntamenti, e inoltra qualsiasi questione clinica al team.",
          },
          { type: "h2", id: "channels", text: "Sito e WhatsApp" },
          {
            type: "table",
            head: ["Canale", "Come il cliente parla con il chatbot", "Cosa serve"],
            rows: [
              ["Sito", "Una finestra di chat nell'angolo dello schermo", "Incollare un piccolo codice nel sito, una sola volta"],
              ["WhatsApp", "Invia un messaggio al numero dell'attività", "Un numero collegato a WhatsApp Business Platform e la verifica dell'azienda presso Meta"],
            ],
          },
          { type: "h2", id: "what-to-prepare", text: "Cosa preparare" },
          {
            type: "ul",
            items: [
              "Il menù o l'elenco dei servizi con i prezzi aggiornati.",
              "Gli orari, compresi festivi e periodi particolari.",
              "Le regole: cancellazioni, gruppi, animali, pagamenti, rimborsi.",
              "Le domande che il Suo team riceve più spesso e le risposte che dà di solito.",
              "Cosa deve sempre passare a una persona (reclami, richieste speciali, eventi).",
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "Prosegua con l'[installazione](/it/docs/ai-chatbot/setup) oppure [prenoti una demo](/it/book-a-demo) per vedere il chatbot rispondere con i dati di un'attività come la Sua.",
          },
        ],
      },
    },
    setup: {
      pt: {
        title: "Instalação do chatbot com IA no site e no WhatsApp",
        description:
          "Passo a passo para instalar o chatbot com IA: base de conhecimento, widget no site, ligação ao WhatsApp Business Platform e verificação da empresa.",
        blocks: [
          {
            type: "p",
            text: "A Steevanz trata da instalação. A parte que depende de si é sobretudo reunir a informação do negócio e, para o WhatsApp, dar alguns acessos e aprovações.",
          },
          { type: "h2", id: "passos", text: "Passos de instalação" },
          {
            type: "steps",
            items: [
              {
                title: "Recolha da informação",
                body: "Recebemos o menu, serviços, preços, horários e políticas, em documentos, fotografias ou links para o seu site.",
              },
              {
                title: "Criação da base de conhecimento",
                body: "Organizamos essa informação num formato que o chatbot consegue consultar e definimos o tom de voz e os temas proibidos.",
              },
              {
                title: "Regras de encaminhamento",
                body: "Definimos quando o chatbot envia o link de reserva, quando passa a conversa a uma pessoa e para que contacto.",
              },
              {
                title: "Testes internos",
                body: "Fazemos dezenas de perguntas reais e difíceis e corrigimos as respostas antes de qualquer cliente falar com o chatbot.",
              },
              {
                title: "Instalação no site",
                body: "Colamos o código do widget no seu site ou enviamos-lho para passar a quem o gere.",
              },
              {
                title: "Ligação ao WhatsApp",
                body: "Ligamos o número à WhatsApp Business Platform e acompanhamos a verificação da empresa.",
              },
              {
                title: "Revisão das primeiras conversas",
                body: "Nas primeiras semanas revemos consigo o histórico e ajustamos a base de conhecimento.",
              },
            ],
          },
          { type: "h2", id: "widget-no-site", text: "Widget no site" },
          {
            type: "p",
            text: "O widget é um pequeno script que se coloca antes do fecho da tag `body`, em todas as páginas. Funciona com a maioria dos construtores de sites e plataformas de gestão de conteúdos.",
          },
          {
            type: "code",
            label: "Código do widget (exemplo)",
            code: "<script\n  src=\"https://chat.steevanz.com/widget.js\"\n  data-business=\"o-seu-negocio\"\n  data-lang=\"auto\"\n  defer\n></script>",
          },
          {
            type: "callout",
            tone: "info",
            text: "O identificador do negócio acima é ilustrativo. Enviamos-lhe o código final já preenchido.",
          },
          { type: "h2", id: "whatsapp", text: "Ligação ao WhatsApp" },
          {
            type: "p",
            text: "Para que o chatbot responda no WhatsApp, o número tem de estar ligado à **WhatsApp Business Platform**, a solução da Meta para empresas que usam integrações. Isto é diferente da aplicação WhatsApp Business normal.",
          },
          {
            type: "ul",
            items: [
              "Precisa de uma conta de empresa na Meta e de concluir a **verificação da empresa**, com documentos como a certidão permanente ou uma fatura em nome do negócio.",
              "O número pode ser novo ou o atual. Se já usa esse número numa aplicação WhatsApp, analisamos consigo a melhor forma de o migrar ou de o manter a funcionar em paralelo.",
              "O nome apresentado aos clientes está sujeito a aprovação pela Meta.",
            ],
          },
          {
            type: "callout",
            tone: "warning",
            text: "Os prazos de verificação e aprovação dependem da Meta, não da Steevanz. Recomendamos começar este passo cedo; entretanto, o chatbot pode já estar ativo no site.",
          },
          { type: "h2", id: "seguinte", text: "A seguir" },
          {
            type: "p",
            text: "Veja em [configuração](/docs/chatbot-ia/configuracao) como definir o tom, os encaminhamentos e as regras de segurança do chatbot.",
          },
        ],
      },
      en: {
        title: "Setting up the AI chatbot on your website and WhatsApp",
        description:
          "Step-by-step guide to setting up the AI chatbot: knowledge base, website widget, WhatsApp Business Platform connection and business verification.",
        blocks: [
          {
            type: "p",
            text: "Steevanz handles the setup. What depends on you is mainly gathering your business information and, for WhatsApp, granting some access and approvals.",
          },
          { type: "h2", id: "steps", text: "Setup steps" },
          {
            type: "steps",
            items: [
              {
                title: "Gathering information",
                body: "We receive your menu, services, prices, opening hours and policies, as documents, photos or links to your website.",
              },
              {
                title: "Building the knowledge base",
                body: "We organise that information in a format the chatbot can consult and define the tone of voice and off-limits topics.",
              },
              {
                title: "Hand-over rules",
                body: "We define when the chatbot sends the booking link, when it passes the conversation to a person and to which contact.",
              },
              {
                title: "Internal testing",
                body: "We ask dozens of real and tricky questions and correct the answers before any customer talks to the chatbot.",
              },
              {
                title: "Website installation",
                body: "We paste the widget snippet into your website or send it to you to pass on to whoever manages it.",
              },
              {
                title: "WhatsApp connection",
                body: "We connect your number to the WhatsApp Business Platform and guide you through business verification.",
              },
              {
                title: "Reviewing early conversations",
                body: "In the first few weeks we review the history with you and adjust the knowledge base.",
              },
            ],
          },
          { type: "h2", id: "website-widget", text: "Website widget" },
          {
            type: "p",
            text: "The widget is a small script placed just before the closing `body` tag on every page. It works with most website builders and content management systems.",
          },
          {
            type: "code",
            label: "Widget snippet (example)",
            code: "<script\n  src=\"https://chat.steevanz.com/widget.js\"\n  data-business=\"your-business\"\n  data-lang=\"auto\"\n  defer\n></script>",
          },
          {
            type: "callout",
            tone: "info",
            text: "The business identifier above is an example. We send you the final snippet already filled in.",
          },
          { type: "h2", id: "whatsapp", text: "Connecting WhatsApp" },
          {
            type: "p",
            text: "For the chatbot to reply on WhatsApp, your number must be connected to the **WhatsApp Business Platform**, Meta's solution for businesses using integrations. This is different from the standard WhatsApp Business app.",
          },
          {
            type: "ul",
            items: [
              "You need a Meta business account and must complete **business verification**, with documents such as your company registration certificate or a utility bill in the business's name.",
              "The number can be new or your existing one. If you already use it in a WhatsApp app, we will work out with you the best way to migrate it or keep it running alongside.",
              "The display name shown to customers is subject to approval by Meta.",
            ],
          },
          {
            type: "callout",
            tone: "warning",
            text: "Verification and approval times depend on Meta, not Steevanz. We recommend starting this step early; in the meantime, the chatbot can already be live on your website.",
          },
          { type: "h2", id: "next", text: "Next" },
          {
            type: "p",
            text: "See [configuration](/en/docs/ai-chatbot/configuration) to set the chatbot's tone, hand-overs and safety rules.",
          },
        ],
      },
      es: {
        title: "Instalación del chatbot con IA en su web y WhatsApp",
        description:
          "Paso a paso para instalar el chatbot con IA: base de conocimiento, widget en la web, conexión a WhatsApp Business Platform y verificación de la empresa.",
        blocks: [
          {
            type: "p",
            text: "Steevanz se encarga de la instalación. Lo que depende de usted es sobre todo reunir la información del negocio y, para WhatsApp, conceder algunos accesos y aprobaciones.",
          },
          { type: "h2", id: "steps", text: "Pasos de la instalación" },
          {
            type: "steps",
            items: [
              {
                title: "Recogida de información",
                body: "Recibimos su carta, servicios, precios, horarios y políticas, en documentos, fotos o enlaces a su web.",
              },
              {
                title: "Creación de la base de conocimiento",
                body: "Organizamos esa información en un formato que el chatbot pueda consultar y definimos el tono y los temas prohibidos.",
              },
              {
                title: "Reglas de derivación",
                body: "Definimos cuándo el chatbot envía el enlace de reservas, cuándo pasa la conversación a una persona y a qué contacto.",
              },
              {
                title: "Pruebas internas",
                body: "Hacemos decenas de preguntas reales y difíciles y corregimos las respuestas antes de que cualquier cliente hable con el chatbot.",
              },
              {
                title: "Instalación en la web",
                body: "Pegamos el código del widget en su web o se lo enviamos para que lo pase a quien la gestiona.",
              },
              {
                title: "Conexión a WhatsApp",
                body: "Conectamos su número a WhatsApp Business Platform y le guiamos en la verificación de la empresa.",
              },
              {
                title: "Revisión de las primeras conversaciones",
                body: "En las primeras semanas revisamos el historial con usted y ajustamos la base de conocimiento.",
              },
            ],
          },
          { type: "h2", id: "website-widget", text: "Widget en la web" },
          {
            type: "p",
            text: "El widget es un pequeño script que se coloca justo antes del cierre de la etiqueta `body`, en todas las páginas. Funciona con la mayoría de los creadores de webs y gestores de contenidos.",
          },
          {
            type: "code",
            label: "Código del widget (ejemplo)",
            code: "<script\n  src=\"https://chat.steevanz.com/widget.js\"\n  data-business=\"su-negocio\"\n  data-lang=\"auto\"\n  defer\n></script>",
          },
          {
            type: "callout",
            tone: "info",
            text: "El identificador del negocio de arriba es un ejemplo. Le enviamos el código definitivo ya rellenado.",
          },
          { type: "h2", id: "whatsapp", text: "Conectar WhatsApp" },
          {
            type: "p",
            text: "Para que el chatbot responda en WhatsApp, su número debe estar conectado a **WhatsApp Business Platform**, la solución de Meta para empresas que usan integraciones. Es distinta de la aplicación WhatsApp Business habitual.",
          },
          {
            type: "ul",
            items: [
              "Necesita una cuenta de empresa en Meta y completar la **verificación de la empresa**, con documentos como el certificado de registro mercantil o una factura de suministros a nombre del negocio.",
              "El número puede ser nuevo o el que ya tiene. Si ya lo usa en una aplicación de WhatsApp, vemos con usted la mejor forma de migrarlo o de mantenerlo en paralelo.",
              "El nombre visible para los clientes está sujeto a la aprobación de Meta.",
            ],
          },
          {
            type: "callout",
            tone: "warning",
            text: "Los plazos de verificación y aprobación dependen de Meta, no de Steevanz. Recomendamos empezar este paso pronto; mientras tanto, el chatbot ya puede estar activo en su web.",
          },
          { type: "h2", id: "next", text: "Siguiente paso" },
          {
            type: "p",
            text: "Consulte la [configuración](/es/docs/ai-chatbot/configuration) para definir el tono del chatbot, las derivaciones y las reglas de seguridad.",
          },
        ],
      },
      fr: {
        title: "Installer le chatbot IA sur votre site web et WhatsApp",
        description:
          "Pas à pas pour installer le chatbot IA : base de connaissances, widget sur le site, connexion à WhatsApp Business Platform et vérification de l'entreprise.",
        blocks: [
          {
            type: "p",
            text: "Steevanz s'occupe de l'installation. Ce qui dépend de vous, c'est surtout de rassembler les informations de votre établissement et, pour WhatsApp, d'accorder quelques accès et validations.",
          },
          { type: "h2", id: "steps", text: "Étapes de l'installation" },
          {
            type: "steps",
            items: [
              {
                title: "Collecte des informations",
                body: "Nous recevons votre carte, vos services, prix, horaires et conditions, sous forme de documents, de photos ou de liens vers votre site.",
              },
              {
                title: "Construction de la base de connaissances",
                body: "Nous organisons ces informations dans un format que le chatbot peut consulter et définissons le ton et les sujets à éviter.",
              },
              {
                title: "Règles de transmission",
                body: "Nous définissons quand le chatbot envoie le lien de réservation, quand il passe la conversation à une personne et à quel contact.",
              },
              {
                title: "Tests internes",
                body: "Nous posons des dizaines de questions réelles et délicates et corrigeons les réponses avant qu'un client ne parle au chatbot.",
              },
              {
                title: "Installation sur le site",
                body: "Nous collons le code du widget dans votre site ou vous l'envoyons pour que vous le transmettiez à la personne qui le gère.",
              },
              {
                title: "Connexion à WhatsApp",
                body: "Nous relions votre numéro à WhatsApp Business Platform et vous guidons dans la vérification de l'entreprise.",
              },
              {
                title: "Relecture des premières conversations",
                body: "Pendant les premières semaines, nous relisons l'historique avec vous et ajustons la base de connaissances.",
              },
            ],
          },
          { type: "h2", id: "website-widget", text: "Widget sur le site" },
          {
            type: "p",
            text: "Le widget est un petit script placé juste avant la fermeture de la balise `body`, sur toutes les pages. Il fonctionne avec la plupart des créateurs de sites et des systèmes de gestion de contenu.",
          },
          {
            type: "code",
            label: "Code du widget (exemple)",
            code: "<script\n  src=\"https://chat.steevanz.com/widget.js\"\n  data-business=\"votre-etablissement\"\n  data-lang=\"auto\"\n  defer\n></script>",
          },
          {
            type: "callout",
            tone: "info",
            text: "L'identifiant de l'établissement ci-dessus est un exemple. Nous vous envoyons le code définitif déjà rempli.",
          },
          { type: "h2", id: "whatsapp", text: "Connecter WhatsApp" },
          {
            type: "p",
            text: "Pour que le chatbot réponde sur WhatsApp, votre numéro doit être relié à **WhatsApp Business Platform**, la solution de Meta pour les entreprises qui utilisent des intégrations. C'est différent de l'application WhatsApp Business classique.",
          },
          {
            type: "ul",
            items: [
              "Il vous faut un compte professionnel Meta et terminer la **vérification de l'entreprise**, avec des documents comme un extrait d'immatriculation de la société ou une facture de fournisseur d'énergie au nom de l'établissement.",
              "Le numéro peut être nouveau ou celui que vous avez déjà. Si vous l'utilisez déjà dans une application WhatsApp, nous voyons avec vous la meilleure façon de le migrer ou de le garder en parallèle.",
              "Le nom affiché aux clients est soumis à l'approbation de Meta.",
            ],
          },
          {
            type: "callout",
            tone: "warning",
            text: "Les délais de vérification et d'approbation dépendent de Meta, pas de Steevanz. Nous recommandons de commencer cette étape tôt ; en attendant, le chatbot peut déjà fonctionner sur votre site.",
          },
          { type: "h2", id: "next", text: "Et ensuite" },
          {
            type: "p",
            text: "Consultez la [configuration](/fr/docs/ai-chatbot/configuration) pour régler le ton du chatbot, les transmissions et les règles de sécurité.",
          },
        ],
      },
      de: {
        title: "Den KI-Chatbot auf Website und WhatsApp einrichten",
        description:
          "Schritt für Schritt zur Einrichtung des KI-Chatbots: Wissensbasis, Website-Widget, Anbindung an die WhatsApp Business Platform und Unternehmensverifizierung.",
        blocks: [
          {
            type: "p",
            text: "Steevanz übernimmt die Einrichtung. Von Ihnen hängt vor allem ab, die Informationen Ihres Betriebs zusammenzustellen und, für WhatsApp, einige Zugänge und Freigaben zu erteilen.",
          },
          { type: "h2", id: "steps", text: "Schritte der Einrichtung" },
          {
            type: "steps",
            items: [
              {
                title: "Informationen sammeln",
                body: "Wir erhalten Ihre Speisekarte, Leistungen, Preise, Öffnungszeiten und Regeln, als Dokumente, Fotos oder Links zu Ihrer Website.",
              },
              {
                title: "Wissensbasis aufbauen",
                body: "Wir ordnen diese Informationen in einem Format, das der Chatbot abfragen kann, und legen Tonfall und Tabuthemen fest.",
              },
              {
                title: "Übergaberegeln",
                body: "Wir legen fest, wann der Chatbot den Reservierungslink schickt, wann er das Gespräch an einen Menschen übergibt und an welchen Kontakt.",
              },
              {
                title: "Interne Tests",
                body: "Wir stellen Dutzende echte und knifflige Fragen und korrigieren die Antworten, bevor ein Kunde mit dem Chatbot spricht.",
              },
              {
                title: "Einbau in die Website",
                body: "Wir fügen den Widget-Code in Ihre Website ein oder schicken ihn Ihnen, damit Sie ihn an die Person weitergeben, die sie betreut.",
              },
              {
                title: "WhatsApp-Anbindung",
                body: "Wir verbinden Ihre Nummer mit der WhatsApp Business Platform und begleiten Sie durch die Unternehmensverifizierung.",
              },
              {
                title: "Erste Gespräche auswerten",
                body: "In den ersten Wochen gehen wir den Verlauf gemeinsam mit Ihnen durch und passen die Wissensbasis an.",
              },
            ],
          },
          { type: "h2", id: "website-widget", text: "Website-Widget" },
          {
            type: "p",
            text: "Das Widget ist ein kleines Skript, das auf jeder Seite direkt vor dem schließenden `body`-Tag eingefügt wird. Es funktioniert mit den meisten Website-Baukästen und Content-Management-Systemen.",
          },
          {
            type: "code",
            label: "Widget-Code (Beispiel)",
            code: "<script\n  src=\"https://chat.steevanz.com/widget.js\"\n  data-business=\"ihr-betrieb\"\n  data-lang=\"auto\"\n  defer\n></script>",
          },
          {
            type: "callout",
            tone: "info",
            text: "Die Kennung des Betriebs oben ist ein Beispiel. Den endgültigen Code schicken wir Ihnen bereits ausgefüllt.",
          },
          { type: "h2", id: "whatsapp", text: "WhatsApp verbinden" },
          {
            type: "p",
            text: "Damit der Chatbot bei WhatsApp antworten kann, muss Ihre Nummer mit der **WhatsApp Business Platform** verbunden sein, der Lösung von Meta für Unternehmen, die Integrationen nutzen. Das ist etwas anderes als die normale WhatsApp-Business-App.",
          },
          {
            type: "ul",
            items: [
              "Sie brauchen ein Meta-Unternehmenskonto und müssen die **Unternehmensverifizierung** abschließen, mit Unterlagen wie einem Handelsregisterauszug oder einer Versorgerrechnung auf den Namen des Betriebs.",
              "Die Nummer kann neu sein oder Ihre bisherige. Nutzen Sie sie schon in einer WhatsApp-App, klären wir mit Ihnen, wie sie am besten umgezogen oder parallel weiterbetrieben wird.",
              "Der für Kunden sichtbare Anzeigename muss von Meta genehmigt werden.",
            ],
          },
          {
            type: "callout",
            tone: "warning",
            text: "Wie lange Verifizierung und Genehmigung dauern, hängt von Meta ab, nicht von Steevanz. Wir empfehlen, diesen Schritt früh zu beginnen; in der Zwischenzeit kann der Chatbot schon auf Ihrer Website laufen.",
          },
          { type: "h2", id: "next", text: "Wie es weitergeht" },
          {
            type: "p",
            text: "Unter [Konfiguration](/de/docs/ai-chatbot/configuration) legen Sie Tonfall, Übergaben und Sicherheitsregeln des Chatbots fest.",
          },
        ],
      },
      it: {
        title: "Installare il chatbot con IA sul sito e su WhatsApp",
        description:
          "Passo dopo passo per installare il chatbot con IA: base di conoscenza, widget sul sito, collegamento a WhatsApp Business Platform e verifica dell'azienda.",
        blocks: [
          {
            type: "p",
            text: "Dell'installazione si occupa Steevanz. Da Lei dipende soprattutto raccogliere le informazioni dell'attività e, per WhatsApp, concedere alcuni accessi e approvazioni.",
          },
          { type: "h2", id: "steps", text: "Fasi dell'installazione" },
          {
            type: "steps",
            items: [
              {
                title: "Raccolta delle informazioni",
                body: "Riceviamo menù, servizi, prezzi, orari e regole, sotto forma di documenti, foto o link al Suo sito.",
              },
              {
                title: "Costruzione della base di conoscenza",
                body: "Organizziamo queste informazioni in un formato che il chatbot può consultare e definiamo il tono e gli argomenti da evitare.",
              },
              {
                title: "Regole di passaggio",
                body: "Stabiliamo quando il chatbot invia il link di prenotazione, quando passa la conversazione a una persona e a quale contatto.",
              },
              {
                title: "Test interni",
                body: "Facciamo decine di domande reali e difficili e correggiamo le risposte prima che qualsiasi cliente parli con il chatbot.",
              },
              {
                title: "Installazione sul sito",
                body: "Incolliamo il codice del widget nel Suo sito oppure Glielo inviamo da passare a chi lo gestisce.",
              },
              {
                title: "Collegamento a WhatsApp",
                body: "Colleghiamo il Suo numero a WhatsApp Business Platform e La guidiamo nella verifica dell'azienda.",
              },
              {
                title: "Revisione delle prime conversazioni",
                body: "Nelle prime settimane rivediamo con Lei lo storico e aggiorniamo la base di conoscenza.",
              },
            ],
          },
          { type: "h2", id: "website-widget", text: "Widget sul sito" },
          {
            type: "p",
            text: "Il widget è un piccolo script che si inserisce subito prima della chiusura del tag `body`, in tutte le pagine. Funziona con la maggior parte dei costruttori di siti e dei sistemi di gestione dei contenuti.",
          },
          {
            type: "code",
            label: "Codice del widget (esempio)",
            code: "<script\n  src=\"https://chat.steevanz.com/widget.js\"\n  data-business=\"sua-attivita\"\n  data-lang=\"auto\"\n  defer\n></script>",
          },
          {
            type: "callout",
            tone: "info",
            text: "L'identificativo dell'attività qui sopra è un esempio. Le inviamo il codice definitivo già compilato.",
          },
          { type: "h2", id: "whatsapp", text: "Collegare WhatsApp" },
          {
            type: "p",
            text: "Perché il chatbot risponda su WhatsApp, il Suo numero deve essere collegato a **WhatsApp Business Platform**, la soluzione di Meta per le aziende che usano integrazioni. È diversa dalla normale app WhatsApp Business.",
          },
          {
            type: "ul",
            items: [
              "Serve un account aziendale Meta e bisogna completare la **verifica dell'azienda**, con documenti come la visura camerale o una bolletta intestata all'attività.",
              "Il numero può essere nuovo o quello che ha già. Se lo usa già in un'app WhatsApp, valutiamo con Lei il modo migliore per migrarlo o mantenerlo in parallelo.",
              "Il nome visualizzato dai clienti è soggetto all'approvazione di Meta.",
            ],
          },
          {
            type: "callout",
            tone: "warning",
            text: "I tempi di verifica e approvazione dipendono da Meta, non da Steevanz. Consigliamo di iniziare presto questa fase; nel frattempo il chatbot può già essere attivo sul Suo sito.",
          },
          { type: "h2", id: "next", text: "Il passo successivo" },
          {
            type: "p",
            text: "Consulti la [configurazione](/it/docs/ai-chatbot/configuration) per impostare il tono del chatbot, i passaggi al team e le regole di sicurezza.",
          },
        ],
      },
    },
    configuration: {
      pt: {
        title: "Configuração do chatbot com IA",
        description:
          "Como configurar o chatbot com IA: base de conhecimento, tom de voz, idiomas, encaminhamento para reservas e para a equipa, limites de segurança e RGPD.",
        blocks: [
          {
            type: "p",
            text: "A qualidade das respostas depende sobretudo da qualidade da informação e das regras definidas. Estas são as definições principais, que ajustamos consigo sempre que precisar.",
          },
          { type: "h2", id: "base-de-conhecimento", text: "Base de conhecimento" },
          {
            type: "p",
            text: "É o conjunto de informação que o chatbot pode usar para responder. Deve ser específica, atual e sem contradições.",
          },
          {
            type: "table",
            head: ["Tema", "Exemplos do que incluir"],
            rows: [
              ["Menu ou serviços", "Pratos, ingredientes e alergénios; serviços, duração e preços"],
              ["Horários", "Horário normal, feriados, férias, cozinha aberta até"],
              ["Localização", "Morada, estacionamento, transportes, acessibilidade"],
              ["Políticas", "Cancelamentos, sinais, grupos, animais, crianças, pagamentos"],
              ["Contactos", "Telefone, email, quando e como falar com uma pessoa"],
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "Quando uma informação muda, retire a versão antiga. Duas versões do mesmo preço ou horário são a causa mais comum de respostas erradas.",
          },
          { type: "h2", id: "tom-e-idiomas", text: "Tom de voz e idiomas" },
          {
            type: "ul",
            items: [
              "**Tom**: mais formal (tratamento por «o senhor» ou «a senhora») ou mais próximo, conforme a sua marca.",
              "**Idiomas**: o chatbot responde por defeito na língua em que o cliente escreve. Pode limitar a um conjunto de línguas.",
              "**Respostas curtas**: em WhatsApp e no telemóvel, respostas breves com um link funcionam melhor do que parágrafos longos.",
            ],
          },
          { type: "h2", id: "encaminhamento", text: "Encaminhamento para reservas e para pessoas" },
          {
            type: "ul",
            items: [
              "**Reserva**: quando o cliente quer marcar, o chatbot envia o seu link de reserva, se possível já filtrado pelo serviço certo.",
              "**Pessoa**: reclamações, pedidos especiais, eventos, orçamentos ou qualquer tema fora do âmbito são passados à equipa, com o resumo da conversa.",
              "**Fora de horas**: o chatbot informa quando a equipa poderá responder.",
            ],
          },
          { type: "h2", id: "limites-de-seguranca", text: "Limites de segurança" },
          {
            type: "ul",
            items: [
              "Não inventa: quando a resposta não está na base de conhecimento, diz que não sabe e oferece contacto humano.",
              "Não dá aconselhamento médico, jurídico ou financeiro.",
              "Não promete descontos, reembolsos ou exceções que não estejam nas políticas.",
              "Não pede dados sensíveis, como dados de saúde ou números de cartão.",
            ],
          },
          { type: "h2", id: "whatsapp-regras", text: "Regras do WhatsApp" },
          {
            type: "p",
            text: "No WhatsApp Business Platform, o negócio pode responder livremente durante **24 horas** após a última mensagem do cliente. Fora dessa janela, só pode iniciar conversa com **mensagens modelo** previamente aprovadas pela Meta, por exemplo um lembrete ou uma confirmação. Criamos e submetemos esses modelos por si.",
          },
          { type: "h2", id: "rgpd", text: "Privacidade e RGPD" },
          {
            type: "p",
            text: "Os registos das conversas são guardados apenas durante o prazo acordado e usados para prestar o serviço e melhorar as respostas do seu negócio. O seu negócio é o responsável pelo tratamento e a Steevanz atua como subcontratante.",
          },
        ],
      },
      en: {
        title: "Configuring the AI chatbot",
        description:
          "How to configure the AI chatbot: knowledge base, tone of voice, languages, hand-over to bookings and staff, safety guardrails and GDPR considerations.",
        blocks: [
          {
            type: "p",
            text: "Answer quality depends mainly on the quality of the information and rules you provide. These are the main settings, which we adjust with you whenever needed.",
          },
          { type: "h2", id: "knowledge-base", text: "Knowledge base" },
          {
            type: "p",
            text: "This is the body of information the chatbot can use to answer. It should be specific, current and free of contradictions.",
          },
          {
            type: "table",
            head: ["Topic", "Examples of what to include"],
            rows: [
              ["Menu or services", "Dishes, ingredients and allergens; services, duration and prices"],
              ["Opening hours", "Normal hours, bank holidays, closures, last kitchen orders"],
              ["Location", "Address, parking, public transport, accessibility"],
              ["Policies", "Cancellations, deposits, groups, pets, children, payments"],
              ["Contacts", "Phone, email, when and how to reach a person"],
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "When information changes, remove the old version. Two versions of the same price or opening hours are the most common cause of wrong answers.",
          },
          { type: "h2", id: "tone-and-languages", text: "Tone of voice and languages" },
          {
            type: "ul",
            items: [
              "**Tone**: more formal or more relaxed, to match your brand.",
              "**Languages**: by default the chatbot replies in the language the customer writes in. You can limit it to a set of languages.",
              "**Short answers**: on WhatsApp and mobile, brief replies with a link work better than long paragraphs.",
            ],
          },
          { type: "h2", id: "hand-over", text: "Hand-over to bookings and people" },
          {
            type: "ul",
            items: [
              "**Booking**: when a customer wants to book, the chatbot sends your booking link, ideally pre-filtered for the right service.",
              "**Person**: complaints, special requests, events, quotes or anything out of scope go to your team, with a summary of the conversation.",
              "**Out of hours**: the chatbot says when your team will be able to reply.",
            ],
          },
          { type: "h2", id: "guardrails", text: "Safety guardrails" },
          {
            type: "ul",
            items: [
              "It does not make things up: when the answer is not in the knowledge base, it says it does not know and offers human contact.",
              "It does not give medical, legal or financial advice.",
              "It does not promise discounts, refunds or exceptions that are not in your policies.",
              "It does not ask for sensitive data such as health details or card numbers.",
            ],
          },
          { type: "h2", id: "whatsapp-rules", text: "WhatsApp rules" },
          {
            type: "p",
            text: "On the WhatsApp Business Platform, a business can reply freely for **24 hours** after the customer's last message. Outside that window, it can only start a conversation with **template messages** pre-approved by Meta, such as a reminder or confirmation. We create and submit those templates for you.",
          },
          { type: "h2", id: "gdpr", text: "Privacy and GDPR" },
          {
            type: "p",
            text: "Conversation logs are kept only for the agreed period and used to provide the service and improve your business's answers. Your business is the data controller and Steevanz acts as a processor.",
          },
        ],
      },
      es: {
        title: "Configuración del chatbot con IA",
        description:
          "Cómo configurar el chatbot con IA: base de conocimiento, tono, idiomas, derivación a reservas y al equipo, límites de seguridad y aspectos del RGPD.",
        blocks: [
          {
            type: "p",
            text: "La calidad de las respuestas depende sobre todo de la calidad de la información y de las reglas que usted nos da. Estos son los ajustes principales, que revisamos con usted siempre que haga falta.",
          },
          { type: "h2", id: "knowledge-base", text: "Base de conocimiento" },
          {
            type: "p",
            text: "Es el conjunto de información que el chatbot puede usar para responder. Debe ser concreta, actual y sin contradicciones.",
          },
          {
            type: "table",
            head: ["Tema", "Ejemplos de lo que incluir"],
            rows: [
              ["Carta o servicios", "Platos, ingredientes y alérgenos; servicios, duración y precios"],
              ["Horarios", "Horario normal, festivos, cierres, última hora de cocina"],
              ["Ubicación", "Dirección, aparcamiento, transporte público, accesibilidad"],
              ["Políticas", "Cancelaciones, señales, grupos, mascotas, niños, pagos"],
              ["Contactos", "Teléfono, email, cuándo y cómo hablar con una persona"],
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "Cuando una información cambie, elimine la versión antigua. Dos versiones del mismo precio u horario son la causa más frecuente de respuestas erróneas.",
          },
          { type: "h2", id: "tone-and-languages", text: "Tono e idiomas" },
          {
            type: "ul",
            items: [
              "**Tono**: más formal o más cercano, según su marca.",
              "**Idiomas**: por defecto, el chatbot responde en el idioma en que escribe el cliente. Puede limitarlo a un conjunto de idiomas.",
              "**Respuestas cortas**: en WhatsApp y en el móvil funcionan mejor respuestas breves con un enlace que párrafos largos.",
            ],
          },
          { type: "h2", id: "hand-over", text: "Derivación a reservas y a personas" },
          {
            type: "ul",
            items: [
              "**Reserva**: cuando el cliente quiere reservar, el chatbot envía su enlace de reservas, idealmente ya filtrado para el servicio adecuado.",
              "**Persona**: reclamaciones, peticiones especiales, eventos, presupuestos o cualquier cosa fuera de su ámbito pasan a su equipo, con un resumen de la conversación.",
              "**Fuera de horario**: el chatbot indica cuándo podrá responder su equipo.",
            ],
          },
          { type: "h2", id: "guardrails", text: "Límites de seguridad" },
          {
            type: "ul",
            items: [
              "No inventa: cuando la respuesta no está en la base de conocimiento, dice que no lo sabe y ofrece el contacto con una persona.",
              "No da consejo médico, legal ni financiero.",
              "No promete descuentos, reembolsos ni excepciones que no estén en sus políticas.",
              "No pide datos sensibles como información de salud o números de tarjeta.",
            ],
          },
          { type: "h2", id: "whatsapp-rules", text: "Reglas de WhatsApp" },
          {
            type: "p",
            text: "En WhatsApp Business Platform, la empresa puede responder libremente durante **24 horas** después del último mensaje del cliente. Fuera de ese plazo, solo puede iniciar una conversación con **plantillas de mensaje** aprobadas previamente por Meta, como un recordatorio o una confirmación. Nosotros creamos y enviamos esas plantillas por usted.",
          },
          { type: "h2", id: "gdpr", text: "Privacidad y RGPD" },
          {
            type: "p",
            text: "El historial de conversaciones se guarda solo durante el plazo acordado y se usa para prestar el servicio y mejorar las respuestas de su negocio. Su negocio es el responsable del tratamiento y Steevanz actúa como encargado del tratamiento.",
          },
        ],
      },
      fr: {
        title: "Configuration du chatbot IA",
        description:
          "Comment configurer le chatbot IA : base de connaissances, ton, langues, transmission vers les réservations et l'équipe, garde-fous de sécurité et RGPD.",
        blocks: [
          {
            type: "p",
            text: "La qualité des réponses dépend surtout de la qualité des informations et des règles que vous nous donnez. Voici les principaux réglages, que nous ajustons avec vous chaque fois que c'est nécessaire.",
          },
          { type: "h2", id: "knowledge-base", text: "Base de connaissances" },
          {
            type: "p",
            text: "C'est l'ensemble des informations que le chatbot peut utiliser pour répondre. Elles doivent être précises, à jour et sans contradictions.",
          },
          {
            type: "table",
            head: ["Sujet", "Exemples de ce qu'il faut inclure"],
            rows: [
              ["Carte ou services", "Plats, ingrédients et allergènes ; prestations, durée et prix"],
              ["Horaires", "Horaires habituels, jours fériés, fermetures, dernière commande en cuisine"],
              ["Accès", "Adresse, stationnement, transports en commun, accessibilité"],
              ["Conditions", "Annulations, acomptes, groupes, animaux, enfants, paiements"],
              ["Contacts", "Téléphone, e-mail, quand et comment joindre une personne"],
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "Quand une information change, supprimez l'ancienne version. Deux versions du même prix ou des mêmes horaires sont la cause la plus fréquente de mauvaises réponses.",
          },
          { type: "h2", id: "tone-and-languages", text: "Ton et langues" },
          {
            type: "ul",
            items: [
              "**Ton** : plus formel ou plus décontracté, selon votre image.",
              "**Langues** : par défaut, le chatbot répond dans la langue dans laquelle le client écrit. Vous pouvez le limiter à certaines langues.",
              "**Réponses courtes** : sur WhatsApp et sur mobile, des réponses brèves avec un lien fonctionnent mieux que de longs paragraphes.",
            ],
          },
          { type: "h2", id: "hand-over", text: "Transmission vers les réservations et les personnes" },
          {
            type: "ul",
            items: [
              "**Réservation** : quand le client veut réserver, le chatbot envoie votre lien de réservation, idéalement déjà filtré sur la bonne prestation.",
              "**Personne** : réclamations, demandes spéciales, événements, devis ou tout ce qui sort de son cadre passent à votre équipe, avec un résumé de la conversation.",
              "**Hors horaires** : le chatbot indique quand votre équipe pourra répondre.",
            ],
          },
          { type: "h2", id: "guardrails", text: "Garde-fous de sécurité" },
          {
            type: "ul",
            items: [
              "Il n'invente pas : quand la réponse ne figure pas dans la base de connaissances, il dit qu'il ne sait pas et propose un contact humain.",
              "Il ne donne pas de conseils médicaux, juridiques ou financiers.",
              "Il ne promet pas de remises, de remboursements ni d'exceptions absents de vos conditions.",
              "Il ne demande pas de données sensibles comme des informations de santé ou des numéros de carte.",
            ],
          },
          { type: "h2", id: "whatsapp-rules", text: "Règles de WhatsApp" },
          {
            type: "p",
            text: "Sur WhatsApp Business Platform, une entreprise peut répondre librement pendant **24 heures** après le dernier message du client. En dehors de cette fenêtre, elle ne peut lancer une conversation qu'avec des **modèles de message** préalablement approuvés par Meta, comme un rappel ou une confirmation. Nous créons et soumettons ces modèles pour vous.",
          },
          { type: "h2", id: "gdpr", text: "Confidentialité et RGPD" },
          {
            type: "p",
            text: "L'historique des conversations n'est conservé que pendant la durée convenue et sert à fournir le service et à améliorer les réponses de votre établissement. Votre établissement est le responsable du traitement et Steevanz agit en tant que sous-traitant.",
          },
        ],
      },
      de: {
        title: "Konfiguration des KI-Chatbots",
        description:
          "So konfigurieren Sie den KI-Chatbot: Wissensbasis, Tonfall, Sprachen, Übergabe an Reservierungen und Team, Sicherheitsregeln und DSGVO.",
        blocks: [
          {
            type: "p",
            text: "Die Qualität der Antworten hängt vor allem von der Qualität der Informationen und Regeln ab, die Sie uns geben. Das sind die wichtigsten Einstellungen, die wir bei Bedarf jederzeit mit Ihnen anpassen.",
          },
          { type: "h2", id: "knowledge-base", text: "Wissensbasis" },
          {
            type: "p",
            text: "Das ist die Gesamtheit der Informationen, die der Chatbot für seine Antworten nutzen kann. Sie sollte konkret, aktuell und widerspruchsfrei sein.",
          },
          {
            type: "table",
            head: ["Thema", "Beispiele für Inhalte"],
            rows: [
              ["Speisekarte oder Leistungen", "Gerichte, Zutaten und Allergene; Leistungen, Dauer und Preise"],
              ["Öffnungszeiten", "Normale Zeiten, Feiertage, Schließtage, letzte Bestellung in der Küche"],
              ["Lage", "Adresse, Parken, öffentliche Verkehrsmittel, Barrierefreiheit"],
              ["Regeln", "Stornierungen, Anzahlungen, Gruppen, Haustiere, Kinder, Zahlungen"],
              ["Kontakte", "Telefon, E-Mail, wann und wie man einen Menschen erreicht"],
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "Wenn sich eine Information ändert, entfernen Sie die alte Version. Zwei Versionen desselben Preises oder derselben Öffnungszeiten sind die häufigste Ursache für falsche Antworten.",
          },
          { type: "h2", id: "tone-and-languages", text: "Tonfall und Sprachen" },
          {
            type: "ul",
            items: [
              "**Tonfall**: förmlicher oder lockerer, passend zu Ihrer Marke.",
              "**Sprachen**: Standardmäßig antwortet der Chatbot in der Sprache, in der der Kunde schreibt. Sie können ihn auf bestimmte Sprachen beschränken.",
              "**Kurze Antworten**: Bei WhatsApp und auf dem Handy wirken kurze Antworten mit einem Link besser als lange Absätze.",
            ],
          },
          { type: "h2", id: "hand-over", text: "Übergabe an Reservierungen und Menschen" },
          {
            type: "ul",
            items: [
              "**Reservierung**: Möchte ein Kunde buchen, schickt der Chatbot Ihren Reservierungslink, idealerweise schon auf die passende Leistung gefiltert.",
              "**Mensch**: Beschwerden, Sonderwünsche, Veranstaltungen, Angebote oder alles außerhalb seines Rahmens gehen mit einer Zusammenfassung des Gesprächs an Ihr Team.",
              "**Außerhalb der Öffnungszeiten**: Der Chatbot sagt, wann Ihr Team antworten kann.",
            ],
          },
          { type: "h2", id: "guardrails", text: "Sicherheitsregeln" },
          {
            type: "ul",
            items: [
              "Er erfindet nichts: Steht die Antwort nicht in der Wissensbasis, sagt er, dass er es nicht weiß, und bietet den Kontakt zu einem Menschen an.",
              "Er gibt keine medizinische, rechtliche oder finanzielle Beratung.",
              "Er verspricht keine Rabatte, Erstattungen oder Ausnahmen, die nicht in Ihren Regeln stehen.",
              "Er fragt keine sensiblen Daten ab, etwa Gesundheitsangaben oder Kartennummern.",
            ],
          },
          { type: "h2", id: "whatsapp-rules", text: "WhatsApp-Regeln" },
          {
            type: "p",
            text: "Auf der WhatsApp Business Platform darf ein Unternehmen **24 Stunden** lang nach der letzten Nachricht des Kunden frei antworten. Außerhalb dieses Zeitfensters kann es ein Gespräch nur mit **Nachrichtenvorlagen** beginnen, die Meta vorab genehmigt hat, etwa einer Erinnerung oder Bestätigung. Diese Vorlagen erstellen und reichen wir für Sie ein.",
          },
          { type: "h2", id: "gdpr", text: "Datenschutz und DSGVO" },
          {
            type: "p",
            text: "Gesprächsverläufe werden nur für den vereinbarten Zeitraum gespeichert und dienen dazu, den Service zu erbringen und die Antworten Ihres Betriebs zu verbessern. Ihr Betrieb ist der Verantwortliche, Steevanz handelt als Auftragsverarbeiter.",
          },
        ],
      },
      it: {
        title: "Configurazione del chatbot con IA",
        description:
          "Come configurare il chatbot con IA: base di conoscenza, tono, lingue, passaggio a prenotazioni e team, limiti di sicurezza e aspetti del GDPR.",
        blocks: [
          {
            type: "p",
            text: "La qualità delle risposte dipende soprattutto dalla qualità delle informazioni e delle regole che ci dà. Queste sono le impostazioni principali, che rivediamo con Lei ogni volta che serve.",
          },
          { type: "h2", id: "knowledge-base", text: "Base di conoscenza" },
          {
            type: "p",
            text: "È l'insieme delle informazioni che il chatbot può usare per rispondere. Deve essere precisa, aggiornata e senza contraddizioni.",
          },
          {
            type: "table",
            head: ["Argomento", "Esempi di cosa includere"],
            rows: [
              ["Menù o servizi", "Piatti, ingredienti e allergeni; servizi, durata e prezzi"],
              ["Orari", "Orario normale, festivi, chiusure, ultimo ordine in cucina"],
              ["Posizione", "Indirizzo, parcheggio, mezzi pubblici, accessibilità"],
              ["Regole", "Cancellazioni, caparre, gruppi, animali, bambini, pagamenti"],
              ["Contatti", "Telefono, email, quando e come parlare con una persona"],
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "Quando un'informazione cambia, elimini la versione vecchia. Due versioni dello stesso prezzo o dello stesso orario sono la causa più frequente di risposte sbagliate.",
          },
          { type: "h2", id: "tone-and-languages", text: "Tono e lingue" },
          {
            type: "ul",
            items: [
              "**Tono**: più formale o più informale, in linea con il Suo marchio.",
              "**Lingue**: per impostazione predefinita il chatbot risponde nella lingua in cui scrive il cliente. Può limitarlo a un gruppo di lingue.",
              "**Risposte brevi**: su WhatsApp e da cellulare funzionano meglio risposte brevi con un link che paragrafi lunghi.",
            ],
          },
          { type: "h2", id: "hand-over", text: "Passaggio a prenotazioni e persone" },
          {
            type: "ul",
            items: [
              "**Prenotazione**: quando il cliente vuole prenotare, il chatbot invia il Suo link di prenotazione, idealmente già filtrato sul servizio giusto.",
              "**Persona**: reclami, richieste speciali, eventi, preventivi o qualsiasi cosa fuori dal suo ambito passano al Suo team, con un riepilogo della conversazione.",
              "**Fuori orario**: il chatbot indica quando il Suo team potrà rispondere.",
            ],
          },
          { type: "h2", id: "guardrails", text: "Limiti di sicurezza" },
          {
            type: "ul",
            items: [
              "Non inventa: quando la risposta non è nella base di conoscenza, dice di non saperlo e offre il contatto con una persona.",
              "Non dà consigli medici, legali o finanziari.",
              "Non promette sconti, rimborsi o eccezioni che non siano previsti dalle Sue regole.",
              "Non chiede dati sensibili come informazioni sulla salute o numeri di carta.",
            ],
          },
          { type: "h2", id: "whatsapp-rules", text: "Regole di WhatsApp" },
          {
            type: "p",
            text: "Su WhatsApp Business Platform l'azienda può rispondere liberamente per **24 ore** dopo l'ultimo messaggio del cliente. Fuori da questa finestra, può avviare una conversazione solo con **modelli di messaggio** approvati in anticipo da Meta, come un promemoria o una conferma. Creiamo e inviamo noi questi modelli per Lei.",
          },
          { type: "h2", id: "gdpr", text: "Privacy e GDPR" },
          {
            type: "p",
            text: "Lo storico delle conversazioni viene conservato solo per il periodo concordato e serve a fornire il servizio e migliorare le risposte della Sua attività. La Sua attività è il titolare del trattamento e Steevanz agisce come responsabile del trattamento.",
          },
        ],
      },
    },
    usage: {
      pt: {
        title: "Utilização diária do chatbot com IA",
        description:
          "Como acompanhar o chatbot no dia a dia: rever conversas, assumir uma conversa, atualizar menu, preços e horários e medir o que os clientes perguntam.",
        blocks: [
          {
            type: "p",
            text: "Um chatbot bem configurado não precisa de atenção constante, mas melhora muito com uma revisão regular. Esta página explica a rotina recomendada.",
          },
          { type: "h2", id: "rever-conversas", text: "Rever conversas" },
          {
            type: "p",
            text: "Na sua área de cliente encontra o histórico de conversas do site e do WhatsApp. Nas primeiras semanas, reveja algumas conversas por dia; depois, uma revisão semanal costuma chegar. Procure sobretudo:",
          },
          {
            type: "ul",
            items: [
              "Perguntas a que o chatbot respondeu «não sei», que indicam informação em falta.",
              "Respostas corretas mas pouco claras ou demasiado longas.",
              "Conversas passadas à equipa que o chatbot poderia ter resolvido sozinho.",
            ],
          },
          { type: "h2", id: "assumir-conversa", text: "Assumir uma conversa" },
          {
            type: "p",
            text: "Quando o chatbot passa uma conversa à equipa, recebe um aviso com o resumo. No WhatsApp, a pessoa da equipa responde diretamente e o chatbot deixa de intervir nessa conversa até a devolver. Lembre-se da janela de **24 horas**: se responder depois disso, pode ser necessário usar uma mensagem modelo.",
          },
          { type: "h2", id: "atualizar-informacao", text: "Atualizar informação" },
          {
            type: "steps",
            items: [
              {
                title: "Identifique a alteração",
                body: "Novo prato, novo preço, horário de verão, férias ou uma nova política.",
              },
              {
                title: "Envie-nos a informação",
                body: "Por WhatsApp ou email, com a data a partir da qual é válida. Algumas atualizações simples pode fazê-las diretamente na sua área de cliente.",
              },
              {
                title: "Confirme a resposta",
                body: "Depois da atualização, faça a pergunta ao chatbot no site e confirme que responde com a nova informação.",
              },
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "Avise-nos com antecedência de feriados e fechos. É das perguntas mais comuns e das que mais frustram o cliente se a resposta estiver errada.",
          },
          { type: "h2", id: "aprender-com-perguntas", text: "Aprender com as perguntas" },
          {
            type: "p",
            text: "As conversas mostram o que os clientes realmente querem saber. Perguntas repetidas sobre estacionamento, opções vegetarianas ou preços de um serviço podem indicar que essa informação deve estar mais visível no seu site, no menu ou no perfil do Google.",
          },
          { type: "h2", id: "rotina-recomendada", text: "Rotina recomendada" },
          {
            type: "table",
            head: ["Frequência", "Tarefa"],
            rows: [
              ["Diária (primeiras semanas)", "Ler algumas conversas e assinalar respostas a corrigir"],
              ["Semanal", "Rever perguntas sem resposta e conversas passadas à equipa"],
              ["Antes de cada mudança", "Enviar novo menu, preços, horários ou fechos com a data de início"],
              ["Mensal", "Rever com a Steevanz o tom, os encaminhamentos e as perguntas mais frequentes"],
            ],
          },
          {
            type: "p",
            text: "Se algo não correr bem, consulte a [resolução de problemas](/docs/chatbot-ia/resolucao-problemas).",
          },
        ],
      },
      en: {
        title: "Using the AI chatbot day to day",
        description:
          "How to look after the chatbot day to day: reviewing conversations, taking over a chat, updating menu, prices and hours and learning from questions.",
        blocks: [
          {
            type: "p",
            text: "A well-configured chatbot does not need constant attention, but it improves a lot with regular review. This page explains the recommended routine.",
          },
          { type: "h2", id: "review-conversations", text: "Reviewing conversations" },
          {
            type: "p",
            text: "In your client area you will find the conversation history for the website and WhatsApp. In the first few weeks, review a few conversations each day; after that, a weekly review is usually enough. Look especially for:",
          },
          {
            type: "ul",
            items: [
              "Questions the chatbot answered with “I don't know”, which point to missing information.",
              "Answers that are correct but unclear or too long.",
              "Conversations handed to your team that the chatbot could have resolved itself.",
            ],
          },
          { type: "h2", id: "take-over", text: "Taking over a conversation" },
          {
            type: "p",
            text: "When the chatbot hands a conversation to your team, you receive an alert with a summary. On WhatsApp, a team member replies directly and the chatbot stays out of that conversation until it is handed back. Remember the **24-hour** window: if you reply after that, you may need to use a template message.",
          },
          { type: "h2", id: "update-information", text: "Updating information" },
          {
            type: "steps",
            items: [
              {
                title: "Identify the change",
                body: "A new dish, new price, summer hours, a holiday closure or a new policy.",
              },
              {
                title: "Send us the information",
                body: "By WhatsApp or email, with the date it takes effect. Some simple updates you can make directly in your client area.",
              },
              {
                title: "Check the answer",
                body: "After the update, ask the chatbot the question on your website and confirm it replies with the new information.",
              },
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "Let us know about bank holidays and closures in advance. It is one of the most common questions and one of the most frustrating for customers if the answer is wrong.",
          },
          { type: "h2", id: "learn-from-questions", text: "Learning from questions" },
          {
            type: "p",
            text: "Conversations show what customers really want to know. Repeated questions about parking, vegetarian options or the price of a service may mean that information should be more visible on your website, menu or Google Business Profile.",
          },
          { type: "h2", id: "recommended-routine", text: "Recommended routine" },
          {
            type: "table",
            head: ["How often", "Task"],
            rows: [
              ["Daily (first few weeks)", "Read a few conversations and flag answers to correct"],
              ["Weekly", "Review unanswered questions and conversations handed to your team"],
              ["Before any change", "Send the new menu, prices, hours or closures with the start date"],
              ["Monthly", "Review tone, hand-overs and the most common questions with Steevanz"],
            ],
          },
          {
            type: "p",
            text: "If something goes wrong, see [troubleshooting](/en/docs/ai-chatbot/troubleshooting).",
          },
        ],
      },
      es: {
        title: "Uso diario del chatbot con IA",
        description:
          "Cómo cuidar el chatbot en el día a día: revisar conversaciones, tomar el control de un chat, actualizar carta, precios y horarios y aprender de las preguntas.",
        blocks: [
          {
            type: "p",
            text: "Un chatbot bien configurado no necesita atención constante, pero mejora mucho con una revisión regular. Esta página explica la rutina recomendada.",
          },
          { type: "h2", id: "review-conversations", text: "Revisar las conversaciones" },
          {
            type: "p",
            text: "En su área de cliente encontrará el historial de conversaciones de la web y de WhatsApp. En las primeras semanas, revise algunas conversaciones cada día; después, suele bastar con una revisión semanal. Fíjese sobre todo en:",
          },
          {
            type: "ul",
            items: [
              "Preguntas a las que el chatbot respondió «no lo sé», que indican información que falta.",
              "Respuestas correctas pero poco claras o demasiado largas.",
              "Conversaciones pasadas a su equipo que el chatbot podría haber resuelto solo.",
            ],
          },
          { type: "h2", id: "take-over", text: "Tomar el control de una conversación" },
          {
            type: "p",
            text: "Cuando el chatbot pasa una conversación a su equipo, usted recibe un aviso con un resumen. En WhatsApp, un miembro del equipo responde directamente y el chatbot no interviene en esa conversación hasta que se le devuelva. Recuerde el plazo de **24 horas**: si responde después, puede que tenga que usar una plantilla de mensaje.",
          },
          { type: "h2", id: "update-information", text: "Actualizar la información" },
          {
            type: "steps",
            items: [
              {
                title: "Identifique el cambio",
                body: "Un plato nuevo, un precio nuevo, el horario de verano, un cierre por vacaciones o una política nueva.",
              },
              {
                title: "Envíenos la información",
                body: "Por WhatsApp o email, con la fecha en que entra en vigor. Algunas actualizaciones sencillas puede hacerlas directamente en su área de cliente.",
              },
              {
                title: "Compruebe la respuesta",
                body: "Tras la actualización, haga la pregunta al chatbot en su web y confirme que responde con la información nueva.",
              },
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "Avísenos con antelación de festivos y cierres. Es una de las preguntas más frecuentes y una de las que más frustran al cliente si la respuesta es incorrecta.",
          },
          { type: "h2", id: "learn-from-questions", text: "Aprender de las preguntas" },
          {
            type: "p",
            text: "Las conversaciones muestran lo que los clientes quieren saber de verdad. Preguntas repetidas sobre el aparcamiento, opciones vegetarianas o el precio de un servicio pueden indicar que esa información debería estar más visible en su web, en la carta o en su Perfil de Empresa de Google.",
          },
          { type: "h2", id: "recommended-routine", text: "Rutina recomendada" },
          {
            type: "table",
            head: ["Frecuencia", "Tarea"],
            rows: [
              ["A diario (primeras semanas)", "Leer algunas conversaciones y señalar respuestas que corregir"],
              ["Cada semana", "Revisar las preguntas sin respuesta y las conversaciones pasadas a su equipo"],
              ["Antes de cualquier cambio", "Enviar la nueva carta, precios, horarios o cierres con la fecha de inicio"],
              ["Cada mes", "Revisar con Steevanz el tono, las derivaciones y las preguntas más frecuentes"],
            ],
          },
          {
            type: "p",
            text: "Si algo falla, consulte la [resolución de problemas](/es/docs/ai-chatbot/troubleshooting).",
          },
        ],
      },
      fr: {
        title: "Utilisation au quotidien du chatbot IA",
        description:
          "Comment suivre le chatbot au quotidien : relire les conversations, reprendre la main sur une discussion, mettre à jour carte, prix et horaires et tirer parti des questions.",
        blocks: [
          {
            type: "p",
            text: "Un chatbot bien configuré n'a pas besoin d'une attention constante, mais il progresse beaucoup avec une relecture régulière. Cette page explique la routine recommandée.",
          },
          { type: "h2", id: "review-conversations", text: "Relire les conversations" },
          {
            type: "p",
            text: "Dans votre espace client, vous trouvez l'historique des conversations du site et de WhatsApp. Les premières semaines, relisez quelques conversations chaque jour ; ensuite, une relecture hebdomadaire suffit en général. Repérez surtout :",
          },
          {
            type: "ul",
            items: [
              "Les questions auxquelles le chatbot a répondu « je ne sais pas », qui signalent une information manquante.",
              "Les réponses justes mais peu claires ou trop longues.",
              "Les conversations transmises à votre équipe que le chatbot aurait pu régler seul.",
            ],
          },
          { type: "h2", id: "take-over", text: "Reprendre la main sur une conversation" },
          {
            type: "p",
            text: "Quand le chatbot transmet une conversation à votre équipe, vous recevez une alerte avec un résumé. Sur WhatsApp, un membre de l'équipe répond directement et le chatbot n'intervient plus dans cette conversation jusqu'à ce qu'on la lui rende. Pensez à la fenêtre de **24 heures** : si vous répondez après, vous devrez peut-être utiliser un modèle de message.",
          },
          { type: "h2", id: "update-information", text: "Mettre à jour les informations" },
          {
            type: "steps",
            items: [
              {
                title: "Repérez le changement",
                body: "Un nouveau plat, un nouveau prix, les horaires d'été, une fermeture pour congés ou une nouvelle règle.",
              },
              {
                title: "Envoyez-nous l'information",
                body: "Par WhatsApp ou par e-mail, avec la date d'entrée en vigueur. Certaines mises à jour simples peuvent se faire directement dans votre espace client.",
              },
              {
                title: "Vérifiez la réponse",
                body: "Après la mise à jour, posez la question au chatbot sur votre site et vérifiez qu'il répond avec la nouvelle information.",
              },
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "Prévenez-nous à l'avance des jours fériés et des fermetures. C'est l'une des questions les plus fréquentes, et l'une des plus frustrantes pour le client si la réponse est fausse.",
          },
          { type: "h2", id: "learn-from-questions", text: "Tirer parti des questions" },
          {
            type: "p",
            text: "Les conversations montrent ce que les clients veulent vraiment savoir. Des questions répétées sur le stationnement, les options végétariennes ou le prix d'une prestation peuvent indiquer que cette information devrait être plus visible sur votre site, votre carte ou votre fiche d'établissement Google.",
          },
          { type: "h2", id: "recommended-routine", text: "Routine recommandée" },
          {
            type: "table",
            head: ["Fréquence", "Tâche"],
            rows: [
              ["Chaque jour (premières semaines)", "Lire quelques conversations et signaler les réponses à corriger"],
              ["Chaque semaine", "Passer en revue les questions sans réponse et les conversations transmises à votre équipe"],
              ["Avant tout changement", "Envoyer la nouvelle carte, les prix, les horaires ou les fermetures avec la date de début"],
              ["Chaque mois", "Revoir avec Steevanz le ton, les transmissions et les questions les plus fréquentes"],
            ],
          },
          {
            type: "p",
            text: "En cas de problème, consultez le [dépannage](/fr/docs/ai-chatbot/troubleshooting).",
          },
        ],
      },
      de: {
        title: "Den KI-Chatbot im Alltag nutzen",
        description:
          "So betreuen Sie den Chatbot im Alltag: Gespräche durchsehen, einen Chat übernehmen, Speisekarte, Preise und Öffnungszeiten aktualisieren und aus Fragen lernen.",
        blocks: [
          {
            type: "p",
            text: "Ein gut konfigurierter Chatbot braucht keine ständige Aufmerksamkeit, wird aber durch regelmäßige Durchsicht deutlich besser. Diese Seite erklärt die empfohlene Routine.",
          },
          { type: "h2", id: "review-conversations", text: "Gespräche durchsehen" },
          {
            type: "p",
            text: "In Ihrem Kundenbereich finden Sie den Gesprächsverlauf von Website und WhatsApp. Sehen Sie in den ersten Wochen täglich einige Gespräche durch; danach genügt meist eine wöchentliche Durchsicht. Achten Sie besonders auf:",
          },
          {
            type: "ul",
            items: [
              "Fragen, auf die der Chatbot mit „Das weiß ich nicht“ geantwortet hat, ein Hinweis auf fehlende Informationen.",
              "Antworten, die zwar richtig, aber unklar oder zu lang sind.",
              "Gespräche, die an Ihr Team gingen, obwohl der Chatbot sie selbst hätte lösen können.",
            ],
          },
          { type: "h2", id: "take-over", text: "Ein Gespräch übernehmen" },
          {
            type: "p",
            text: "Übergibt der Chatbot ein Gespräch an Ihr Team, erhalten Sie eine Benachrichtigung mit Zusammenfassung. Bei WhatsApp antwortet ein Teammitglied direkt, und der Chatbot hält sich aus diesem Gespräch heraus, bis es ihm zurückgegeben wird. Denken Sie an das **24-Stunden**-Fenster: Antworten Sie später, brauchen Sie unter Umständen eine Nachrichtenvorlage.",
          },
          { type: "h2", id: "update-information", text: "Informationen aktualisieren" },
          {
            type: "steps",
            items: [
              {
                title: "Änderung erkennen",
                body: "Ein neues Gericht, ein neuer Preis, Sommeröffnungszeiten, Betriebsferien oder eine neue Regel.",
              },
              {
                title: "Uns die Information schicken",
                body: "Per WhatsApp oder E-Mail, mit dem Datum, ab dem sie gilt. Einige einfache Aktualisierungen können Sie direkt in Ihrem Kundenbereich vornehmen.",
              },
              {
                title: "Antwort prüfen",
                body: "Stellen Sie nach der Aktualisierung dem Chatbot auf Ihrer Website die Frage und prüfen Sie, ob er mit der neuen Information antwortet.",
              },
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "Sagen Sie uns Feiertage und Schließtage rechtzeitig vorher. Das ist eine der häufigsten Fragen und eine der ärgerlichsten für Kunden, wenn die Antwort falsch ist.",
          },
          { type: "h2", id: "learn-from-questions", text: "Aus Fragen lernen" },
          {
            type: "p",
            text: "Die Gespräche zeigen, was Kunden wirklich wissen wollen. Wiederholte Fragen zu Parkplätzen, vegetarischen Gerichten oder dem Preis einer Leistung können bedeuten, dass diese Information auf Ihrer Website, in der Speisekarte oder in Ihrem Google-Unternehmensprofil sichtbarer sein sollte.",
          },
          { type: "h2", id: "recommended-routine", text: "Empfohlene Routine" },
          {
            type: "table",
            head: ["Wie oft", "Aufgabe"],
            rows: [
              ["Täglich (erste Wochen)", "Einige Gespräche lesen und Antworten markieren, die korrigiert werden sollen"],
              ["Wöchentlich", "Unbeantwortete Fragen und an Ihr Team übergebene Gespräche durchsehen"],
              ["Vor jeder Änderung", "Neue Speisekarte, Preise, Öffnungszeiten oder Schließtage mit Startdatum schicken"],
              ["Monatlich", "Tonfall, Übergaben und häufigste Fragen mit Steevanz besprechen"],
            ],
          },
          {
            type: "p",
            text: "Wenn etwas nicht funktioniert, lesen Sie die [Fehlerbehebung](/de/docs/ai-chatbot/troubleshooting).",
          },
        ],
      },
      it: {
        title: "Uso quotidiano del chatbot con IA",
        description:
          "Come seguire il chatbot ogni giorno: rivedere le conversazioni, prendere in mano una chat, aggiornare menù, prezzi e orari e imparare dalle domande.",
        blocks: [
          {
            type: "p",
            text: "Un chatbot ben configurato non ha bisogno di attenzione continua, ma migliora molto con una revisione regolare. Questa pagina spiega la routine consigliata.",
          },
          { type: "h2", id: "review-conversations", text: "Rivedere le conversazioni" },
          {
            type: "p",
            text: "Nella Sua area clienti trova lo storico delle conversazioni del sito e di WhatsApp. Nelle prime settimane riveda qualche conversazione ogni giorno; poi di solito basta una revisione settimanale. Cerchi soprattutto:",
          },
          {
            type: "ul",
            items: [
              "Domande a cui il chatbot ha risposto «non lo so», che segnalano informazioni mancanti.",
              "Risposte corrette ma poco chiare o troppo lunghe.",
              "Conversazioni passate al Suo team che il chatbot avrebbe potuto risolvere da solo.",
            ],
          },
          { type: "h2", id: "take-over", text: "Prendere in mano una conversazione" },
          {
            type: "p",
            text: "Quando il chatbot passa una conversazione al Suo team, riceve un avviso con un riepilogo. Su WhatsApp risponde direttamente un membro del team e il chatbot resta fuori da quella conversazione finché non gli viene restituita. Ricordi la finestra di **24 ore**: se risponde dopo, potrebbe essere necessario usare un modello di messaggio.",
          },
          { type: "h2", id: "update-information", text: "Aggiornare le informazioni" },
          {
            type: "steps",
            items: [
              {
                title: "Individui il cambiamento",
                body: "Un piatto nuovo, un prezzo nuovo, l'orario estivo, una chiusura per ferie o una nuova regola.",
              },
              {
                title: "Ci invii l'informazione",
                body: "Via WhatsApp o email, con la data da cui vale. Alcuni aggiornamenti semplici può farli direttamente nella Sua area clienti.",
              },
              {
                title: "Verifichi la risposta",
                body: "Dopo l'aggiornamento, faccia la domanda al chatbot sul Suo sito e verifichi che risponda con la nuova informazione.",
              },
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "Ci avvisi in anticipo di festivi e chiusure. È una delle domande più frequenti e una delle più frustranti per il cliente se la risposta è sbagliata.",
          },
          { type: "h2", id: "learn-from-questions", text: "Imparare dalle domande" },
          {
            type: "p",
            text: "Le conversazioni mostrano cosa vogliono davvero sapere i clienti. Domande ripetute sul parcheggio, sulle opzioni vegetariane o sul prezzo di un servizio possono indicare che quell'informazione dovrebbe essere più visibile sul Suo sito, nel menù o nel Suo Profilo dell'attività su Google.",
          },
          { type: "h2", id: "recommended-routine", text: "Routine consigliata" },
          {
            type: "table",
            head: ["Frequenza", "Attività"],
            rows: [
              ["Ogni giorno (prime settimane)", "Leggere qualche conversazione e segnalare le risposte da correggere"],
              ["Ogni settimana", "Rivedere le domande senza risposta e le conversazioni passate al Suo team"],
              ["Prima di ogni cambiamento", "Inviare nuovo menù, prezzi, orari o chiusure con la data di inizio"],
              ["Ogni mese", "Rivedere con Steevanz il tono, i passaggi al team e le domande più frequenti"],
            ],
          },
          {
            type: "p",
            text: "Se qualcosa non va, consulti la [risoluzione dei problemi](/it/docs/ai-chatbot/troubleshooting).",
          },
        ],
      },
    },
    troubleshooting: {
      pt: {
        title: "Resolução de problemas do chatbot com IA",
        description:
          "Soluções para problemas comuns do chatbot com IA: respostas erradas, widget que não aparece no site, WhatsApp sem resposta e mensagens modelo rejeitadas.",
        blocks: [
          {
            type: "p",
            text: "Quando nos contactar, indique o canal (site ou WhatsApp), a data e hora aproximadas e, se possível, uma captura de ecrã da conversa. Isso acelera muito a análise.",
          },
          { type: "h2", id: "resposta-errada", text: "O chatbot deu uma resposta errada" },
          {
            type: "ol",
            items: [
              "Verifique se a informação correta está na base de conhecimento e se não existe uma versão antiga em paralelo.",
              "Veja se a pergunta era ambígua; por vezes basta acrescentar uma resposta explícita para esse caso.",
              "Envie-nos o exemplo; corrigimos a base de conhecimento e testamos de novo.",
            ],
          },
          {
            type: "callout",
            tone: "warning",
            text: "Se a resposta errada puder ter consequências para o cliente, por exemplo sobre alergénios ou preços, contacte o cliente diretamente para corrigir a informação.",
          },
          { type: "h2", id: "widget-nao-aparece", text: "O widget não aparece no site" },
          {
            type: "ul",
            items: [
              "Confirme que o código foi colado em todas as páginas e não apenas na página inicial.",
              "Limpe a cache do site e do navegador; alguns sistemas de cache demoram a mostrar alterações.",
              "Verifique se um bloqueador de publicidade ou um gestor de cookies está a impedir o carregamento do script.",
              "Se o site tiver uma política de segurança de conteúdo restritiva, o domínio do widget tem de ser autorizado.",
            ],
          },
          { type: "h2", id: "whatsapp-sem-resposta", text: "O chatbot não responde no WhatsApp" },
          {
            type: "ul",
            items: [
              "Confirme que a verificação da empresa e a ligação do número estão concluídas.",
              "Veja se a conversa foi assumida por uma pessoa da equipa; nesse caso o chatbot fica em silêncio até ser devolvida.",
              "Verifique se o número está a ser usado ao mesmo tempo noutra aplicação de forma incompatível.",
            ],
          },
          { type: "h2", id: "modelos-rejeitados", text: "Mensagens modelo rejeitadas" },
          {
            type: "p",
            text: "A Meta pode rejeitar modelos com conteúdo promocional numa categoria de serviço, com variáveis mal formatadas ou com texto pouco claro. Reescrevemos e voltamos a submeter; normalmente basta tornar o objetivo da mensagem mais explícito.",
          },
          { type: "h2", id: "respostas-longas", text: "Respostas demasiado longas ou formais" },
          {
            type: "p",
            text: "Ajustamos o tom e o comprimento das respostas na configuração. Diga-nos como preferia que o chatbot respondesse, de preferência com um exemplo real. Veja também as [perguntas frequentes](/docs/chatbot-ia/perguntas-frequentes) ou [contacte-nos](/contacto).",
          },
        ],
      },
      en: {
        title: "AI chatbot troubleshooting",
        description:
          "Fixes for common AI chatbot issues: wrong answers, widget not showing on your website, no replies on WhatsApp and rejected template messages.",
        blocks: [
          {
            type: "p",
            text: "When you contact us, tell us the channel (website or WhatsApp), the approximate date and time and, if possible, a screenshot of the conversation. That speeds things up considerably.",
          },
          { type: "h2", id: "wrong-answer", text: "The chatbot gave a wrong answer" },
          {
            type: "ol",
            items: [
              "Check that the correct information is in the knowledge base and that there is no older version alongside it.",
              "Consider whether the question was ambiguous; sometimes adding an explicit answer for that case is enough.",
              "Send us the example; we will correct the knowledge base and test again.",
            ],
          },
          {
            type: "callout",
            tone: "warning",
            text: "If the wrong answer could affect the customer, for example about allergens or prices, contact the customer directly to correct the information.",
          },
          { type: "h2", id: "widget-not-showing", text: "The widget is not showing on the website" },
          {
            type: "ul",
            items: [
              "Check the snippet was added to every page, not just the home page.",
              "Clear your website and browser cache; some caching systems take a while to show changes.",
              "Check whether an ad blocker or cookie consent tool is stopping the script from loading.",
              "If your site has a strict content security policy, the widget's domain needs to be allowed.",
            ],
          },
          { type: "h2", id: "whatsapp-no-reply", text: "The chatbot is not replying on WhatsApp" },
          {
            type: "ul",
            items: [
              "Check that business verification and the number connection are complete.",
              "See whether a team member has taken over the conversation; if so, the chatbot stays silent until it is handed back.",
              "Check that the number is not being used in another app in an incompatible way at the same time.",
            ],
          },
          { type: "h2", id: "rejected-templates", text: "Rejected template messages" },
          {
            type: "p",
            text: "Meta may reject templates with promotional content in a utility category, badly formatted variables or unclear wording. We rewrite and resubmit them; usually it is enough to make the purpose of the message more explicit.",
          },
          { type: "h2", id: "long-answers", text: "Answers too long or too formal" },
          {
            type: "p",
            text: "We adjust tone and answer length in the configuration. Tell us how you would prefer the chatbot to reply, ideally with a real example. See also the [FAQ](/en/docs/ai-chatbot/faq) or [contact us](/en/contact).",
          },
        ],
      },
      es: {
        title: "Resolución de problemas del chatbot con IA",
        description:
          "Soluciones a los problemas habituales del chatbot con IA: respuestas erróneas, widget que no aparece en la web, sin respuesta en WhatsApp y plantillas rechazadas.",
        blocks: [
          {
            type: "p",
            text: "Cuando nos contacte, indíquenos el canal (web o WhatsApp), la fecha y hora aproximadas y, si es posible, una captura de pantalla de la conversación. Así lo resolvemos mucho más rápido.",
          },
          { type: "h2", id: "wrong-answer", text: "El chatbot dio una respuesta errónea" },
          {
            type: "ol",
            items: [
              "Compruebe que la información correcta está en la base de conocimiento y que no hay una versión antigua al lado.",
              "Piense si la pregunta era ambigua; a veces basta con añadir una respuesta explícita para ese caso.",
              "Envíenos el ejemplo; corregimos la base de conocimiento y volvemos a probar.",
            ],
          },
          {
            type: "callout",
            tone: "warning",
            text: "Si la respuesta errónea puede afectar al cliente, por ejemplo sobre alérgenos o precios, contacte directamente con el cliente para corregir la información.",
          },
          { type: "h2", id: "widget-not-showing", text: "El widget no aparece en la web" },
          {
            type: "ul",
            items: [
              "Compruebe que el código se añadió a todas las páginas y no solo a la página de inicio.",
              "Vacíe la caché de la web y del navegador; algunos sistemas de caché tardan en mostrar los cambios.",
              "Compruebe si un bloqueador de anuncios o la herramienta de consentimiento de cookies impide que se cargue el script.",
              "Si su web tiene una política de seguridad de contenidos estricta, hay que permitir el dominio del widget.",
            ],
          },
          { type: "h2", id: "whatsapp-no-reply", text: "El chatbot no responde en WhatsApp" },
          {
            type: "ul",
            items: [
              "Compruebe que la verificación de la empresa y la conexión del número están completas.",
              "Mire si un miembro del equipo ha tomado el control de la conversación; en ese caso, el chatbot no interviene hasta que se le devuelva.",
              "Compruebe que el número no se está usando a la vez en otra aplicación de forma incompatible.",
            ],
          },
          { type: "h2", id: "rejected-templates", text: "Plantillas de mensaje rechazadas" },
          {
            type: "p",
            text: "Meta puede rechazar plantillas con contenido promocional en una categoría de utilidad, variables mal formateadas o textos poco claros. Las reescribimos y las volvemos a enviar; normalmente basta con dejar más claro el objetivo del mensaje.",
          },
          { type: "h2", id: "long-answers", text: "Respuestas demasiado largas o formales" },
          {
            type: "p",
            text: "Ajustamos el tono y la longitud de las respuestas en la configuración. Díganos cómo prefiere que responda el chatbot, idealmente con un ejemplo real. Consulte también las [preguntas frecuentes](/es/docs/ai-chatbot/faq) o [contáctenos](/es/contact).",
          },
        ],
      },
      fr: {
        title: "Dépannage du chatbot IA",
        description:
          "Solutions aux problèmes courants du chatbot IA : mauvaises réponses, widget absent du site, pas de réponse sur WhatsApp et modèles de message refusés.",
        blocks: [
          {
            type: "p",
            text: "Quand vous nous contactez, indiquez le canal (site ou WhatsApp), la date et l'heure approximatives et, si possible, une capture d'écran de la conversation. Cela accélère beaucoup les choses.",
          },
          { type: "h2", id: "wrong-answer", text: "Le chatbot a donné une mauvaise réponse" },
          {
            type: "ol",
            items: [
              "Vérifiez que la bonne information figure dans la base de connaissances et qu'aucune ancienne version ne subsiste à côté.",
              "Demandez-vous si la question était ambiguë ; il suffit parfois d'ajouter une réponse explicite pour ce cas.",
              "Envoyez-nous l'exemple ; nous corrigeons la base de connaissances et testons à nouveau.",
            ],
          },
          {
            type: "callout",
            tone: "warning",
            text: "Si la mauvaise réponse peut avoir des conséquences pour le client, par exemple sur les allergènes ou les prix, contactez directement le client pour rectifier l'information.",
          },
          { type: "h2", id: "widget-not-showing", text: "Le widget n'apparaît pas sur le site" },
          {
            type: "ul",
            items: [
              "Vérifiez que le code a été ajouté à toutes les pages, pas seulement à la page d'accueil.",
              "Videz le cache du site et du navigateur ; certains systèmes de cache mettent du temps à afficher les changements.",
              "Vérifiez si un bloqueur de publicités ou l'outil de consentement aux cookies empêche le script de se charger.",
              "Si votre site applique une politique de sécurité du contenu stricte, le domaine du widget doit être autorisé.",
            ],
          },
          { type: "h2", id: "whatsapp-no-reply", text: "Le chatbot ne répond pas sur WhatsApp" },
          {
            type: "ul",
            items: [
              "Vérifiez que la vérification de l'entreprise et la connexion du numéro sont terminées.",
              "Regardez si un membre de l'équipe a repris la conversation ; dans ce cas, le chatbot reste silencieux jusqu'à ce qu'on la lui rende.",
              "Vérifiez que le numéro n'est pas utilisé en même temps dans une autre application de façon incompatible.",
            ],
          },
          { type: "h2", id: "rejected-templates", text: "Modèles de message refusés" },
          {
            type: "p",
            text: "Meta peut refuser des modèles au contenu promotionnel classés en catégorie utilitaire, aux variables mal formatées ou à la formulation peu claire. Nous les réécrivons et les soumettons à nouveau ; en général, il suffit de rendre l'objectif du message plus explicite.",
          },
          { type: "h2", id: "long-answers", text: "Réponses trop longues ou trop formelles" },
          {
            type: "p",
            text: "Nous ajustons le ton et la longueur des réponses dans la configuration. Dites-nous comment vous préférez que le chatbot réponde, idéalement avec un exemple réel. Consultez aussi les [questions fréquentes](/fr/docs/ai-chatbot/faq) ou [contactez-nous](/fr/contact).",
          },
        ],
      },
      de: {
        title: "Fehlerbehebung beim KI-Chatbot",
        description:
          "Lösungen für häufige Probleme mit dem KI-Chatbot: falsche Antworten, Widget erscheint nicht auf der Website, keine Antworten bei WhatsApp und abgelehnte Nachrichtenvorlagen.",
        blocks: [
          {
            type: "p",
            text: "Wenn Sie uns kontaktieren, nennen Sie bitte den Kanal (Website oder WhatsApp), ungefähres Datum und Uhrzeit und wenn möglich einen Screenshot des Gesprächs. Das beschleunigt die Lösung deutlich.",
          },
          { type: "h2", id: "wrong-answer", text: "Der Chatbot hat falsch geantwortet" },
          {
            type: "ol",
            items: [
              "Prüfen Sie, ob die richtige Information in der Wissensbasis steht und keine ältere Version daneben existiert.",
              "Überlegen Sie, ob die Frage mehrdeutig war; manchmal genügt es, für diesen Fall eine ausdrückliche Antwort zu ergänzen.",
              "Schicken Sie uns das Beispiel; wir korrigieren die Wissensbasis und testen erneut.",
            ],
          },
          {
            type: "callout",
            tone: "warning",
            text: "Kann die falsche Antwort Folgen für den Kunden haben, etwa bei Allergenen oder Preisen, kontaktieren Sie den Kunden direkt, um die Information richtigzustellen.",
          },
          { type: "h2", id: "widget-not-showing", text: "Das Widget erscheint nicht auf der Website" },
          {
            type: "ul",
            items: [
              "Prüfen Sie, ob der Code auf allen Seiten eingefügt wurde und nicht nur auf der Startseite.",
              "Leeren Sie den Cache von Website und Browser; manche Caching-Systeme zeigen Änderungen erst nach einiger Zeit.",
              "Prüfen Sie, ob ein Werbeblocker oder das Cookie-Einwilligungstool das Laden des Skripts verhindert.",
              "Hat Ihre Website eine strenge Content-Security-Policy, muss die Domain des Widgets freigegeben werden.",
            ],
          },
          { type: "h2", id: "whatsapp-no-reply", text: "Der Chatbot antwortet nicht bei WhatsApp" },
          {
            type: "ul",
            items: [
              "Prüfen Sie, ob Unternehmensverifizierung und Anbindung der Nummer abgeschlossen sind.",
              "Sehen Sie nach, ob ein Teammitglied das Gespräch übernommen hat; dann bleibt der Chatbot still, bis es ihm zurückgegeben wird.",
              "Prüfen Sie, ob die Nummer nicht gleichzeitig auf unverträgliche Weise in einer anderen App genutzt wird.",
            ],
          },
          { type: "h2", id: "rejected-templates", text: "Abgelehnte Nachrichtenvorlagen" },
          {
            type: "p",
            text: "Meta kann Vorlagen ablehnen, wenn sie werbliche Inhalte in einer Service-Kategorie enthalten, Variablen falsch formatiert sind oder der Text unklar ist. Wir formulieren sie um und reichen sie erneut ein; meist genügt es, den Zweck der Nachricht deutlicher zu machen.",
          },
          { type: "h2", id: "long-answers", text: "Antworten zu lang oder zu förmlich" },
          {
            type: "p",
            text: "Tonfall und Länge der Antworten passen wir in der Konfiguration an. Sagen Sie uns, wie der Chatbot lieber antworten soll, am besten mit einem echten Beispiel. Siehe auch die [häufigen Fragen](/de/docs/ai-chatbot/faq) oder [kontaktieren Sie uns](/de/contact).",
          },
        ],
      },
      it: {
        title: "Risoluzione dei problemi del chatbot con IA",
        description:
          "Soluzioni ai problemi comuni del chatbot con IA: risposte sbagliate, widget che non compare sul sito, nessuna risposta su WhatsApp e modelli di messaggio rifiutati.",
        blocks: [
          {
            type: "p",
            text: "Quando ci contatta, ci indichi il canale (sito o WhatsApp), la data e l'ora approssimative e, se possibile, uno screenshot della conversazione. Così facciamo molto prima.",
          },
          { type: "h2", id: "wrong-answer", text: "Il chatbot ha dato una risposta sbagliata" },
          {
            type: "ol",
            items: [
              "Verifichi che l'informazione corretta sia nella base di conoscenza e che non ci sia accanto una versione più vecchia.",
              "Valuti se la domanda era ambigua; a volte basta aggiungere una risposta esplicita per quel caso.",
              "Ci invii l'esempio; correggiamo la base di conoscenza e proviamo di nuovo.",
            ],
          },
          {
            type: "callout",
            tone: "warning",
            text: "Se la risposta sbagliata può avere conseguenze per il cliente, per esempio su allergeni o prezzi, contatti direttamente il cliente per correggere l'informazione.",
          },
          { type: "h2", id: "widget-not-showing", text: "Il widget non compare sul sito" },
          {
            type: "ul",
            items: [
              "Verifichi che il codice sia stato aggiunto a tutte le pagine e non solo alla home page.",
              "Svuoti la cache del sito e del browser; alcuni sistemi di cache impiegano un po' a mostrare le modifiche.",
              "Verifichi se un blocco pubblicità o lo strumento di consenso ai cookie impedisce il caricamento dello script.",
              "Se il Suo sito ha una politica di sicurezza dei contenuti rigida, bisogna consentire il dominio del widget.",
            ],
          },
          { type: "h2", id: "whatsapp-no-reply", text: "Il chatbot non risponde su WhatsApp" },
          {
            type: "ul",
            items: [
              "Si accerti che la verifica dell'azienda e il collegamento del numero siano completati.",
              "Controlli se un membro del team ha preso in mano la conversazione; in quel caso il chatbot resta in silenzio finché non gli viene restituita.",
              "Verifichi che il numero non sia usato contemporaneamente in un'altra app in modo incompatibile.",
            ],
          },
          { type: "h2", id: "rejected-templates", text: "Modelli di messaggio rifiutati" },
          {
            type: "p",
            text: "Meta può rifiutare modelli con contenuti promozionali in una categoria di servizio, variabili formattate male o testi poco chiari. Li riscriviamo e li inviamo di nuovo; di solito basta rendere più esplicito lo scopo del messaggio.",
          },
          { type: "h2", id: "long-answers", text: "Risposte troppo lunghe o troppo formali" },
          {
            type: "p",
            text: "Regoliamo il tono e la lunghezza delle risposte nella configurazione. Ci dica come preferisce che risponda il chatbot, idealmente con un esempio reale. Consulti anche le [domande frequenti](/it/docs/ai-chatbot/faq) o [ci contatti](/it/contact).",
          },
        ],
      },
    },
    faq: {
      pt: {
        title: "Perguntas frequentes sobre o chatbot com IA",
        description:
          "Respostas às dúvidas mais comuns sobre o chatbot com IA da Steevanz: exatidão, idiomas, WhatsApp, reservas, passagem para a equipa, clínicas e RGPD.",
        blocks: [
          { type: "h2", id: "perguntas", text: "Perguntas e respostas" },
          {
            type: "faq",
            items: [
              {
                q: "O chatbot pode inventar respostas?",
                a: "Está configurado para responder apenas com base na sua informação e dizer que não sabe quando não tem resposta. Ainda assim, a IA pode cometer erros, por isso recomendamos rever as conversas regularmente.",
              },
              {
                q: "Em que línguas responde?",
                a: "Por defeito responde na língua em que o cliente escreve. Pode limitar a um conjunto de línguas.",
              },
              {
                q: "Posso usar o meu número de WhatsApp atual?",
                a: "Em muitos casos sim. Analisamos consigo se é melhor migrar o número atual ou usar um número novo. Veja a [instalação](/docs/chatbot-ia/instalacao).",
              },
              {
                q: "O que é a janela de 24 horas do WhatsApp?",
                a: "Depois da última mensagem do cliente, o negócio pode responder livremente durante 24 horas. Fora desse período, só pode enviar mensagens modelo aprovadas pela Meta.",
              },
              {
                q: "O chatbot faz reservas?",
                a: "Encaminha o cliente para o seu link de reserva, onde escolhe o horário com disponibilidade real. Funciona especialmente bem com o [sistema de reservas online](/produtos/sistema-reservas-online).",
              },
              {
                q: "Como passa a conversa a uma pessoa?",
                a: "Quando o pedido sai do âmbito definido ou o cliente pede para falar com alguém, a equipa recebe um aviso com o resumo e continua a conversa.",
              },
              {
                q: "Posso usá-lo numa clínica?",
                a: "Sim, para informação sobre serviços, preços, horários e marcações. Não dá aconselhamento médico e encaminha questões clínicas para a equipa.",
              },
              {
                q: "Como atualizo o menu ou os preços?",
                a: "Envie-nos a alteração por WhatsApp ou email. Algumas atualizações simples pode fazer diretamente na sua área de cliente.",
              },
              {
                q: "As conversas ficam guardadas?",
                a: "Sim, durante o prazo acordado, para prestar o serviço e melhorar as respostas, em conformidade com o RGPD.",
              },
              {
                q: "Como posso ver o chatbot em funcionamento?",
                a: "[Agende uma demonstração](/agendar) e mostramos-lhe o chatbot a responder com informação de um negócio como o seu.",
              },
            ],
          },
          { type: "h2", id: "documentacao-relacionada", text: "Documentação relacionada" },
          {
            type: "ul",
            items: [
              "[Primeiros passos](/docs/chatbot-ia/primeiros-passos): o que o chatbot faz, os seus limites e o que preparar.",
              "[Instalação](/docs/chatbot-ia/instalacao): widget no site e ligação ao WhatsApp.",
              "[Configuração](/docs/chatbot-ia/configuracao): base de conhecimento, tom, encaminhamentos e limites de segurança.",
              "[Utilização](/docs/chatbot-ia/utilizacao): rever conversas, assumir conversas e atualizar informação.",
            ],
          },
          { type: "h2", id: "mais-ajuda", text: "Ainda tem dúvidas?" },
          {
            type: "p",
            text: "Veja a [página do produto](/produtos/chatbot-ia), a [resolução de problemas](/docs/chatbot-ia/resolucao-problemas) ou [fale connosco](/contacto).",
          },
        ],
      },
      en: {
        title: "AI chatbot FAQ",
        description:
          "Answers to common questions about the Steevanz AI chatbot: accuracy, languages, WhatsApp, bookings, handing over to staff, clinics and GDPR.",
        blocks: [
          { type: "h2", id: "questions", text: "Questions and answers" },
          {
            type: "faq",
            items: [
              {
                q: "Can the chatbot make up answers?",
                a: "It is configured to answer only from your information and to say it does not know when it has no answer. Even so, AI can make mistakes, so we recommend reviewing conversations regularly.",
              },
              {
                q: "Which languages does it reply in?",
                a: "By default it replies in the language the customer writes in. You can limit it to a set of languages.",
              },
              {
                q: "Can I use my current WhatsApp number?",
                a: "In many cases, yes. We will look at whether it is better to migrate your current number or use a new one. See [setup](/en/docs/ai-chatbot/setup).",
              },
              {
                q: "What is the WhatsApp 24-hour window?",
                a: "After the customer's last message, a business can reply freely for 24 hours. Outside that period, it can only send template messages approved by Meta.",
              },
              {
                q: "Does the chatbot take bookings?",
                a: "It sends customers to your booking link, where they choose a time with real availability. It works especially well with the [online booking system](/en/products/online-booking-system).",
              },
              {
                q: "How does it hand over to a person?",
                a: "When a request is out of scope or the customer asks to speak to someone, your team receives an alert with a summary and continues the conversation.",
              },
              {
                q: "Can I use it in a clinic?",
                a: "Yes, for information about services, prices, opening hours and appointments. It does not give medical advice and passes clinical questions to your team.",
              },
              {
                q: "How do I update the menu or prices?",
                a: "Send us the change by WhatsApp or email. Some simple updates you can make directly in your client area.",
              },
              {
                q: "Are conversations stored?",
                a: "Yes, for the agreed period, to provide the service and improve answers, in line with GDPR.",
              },
              {
                q: "How can I see the chatbot in action?",
                a: "[Book a demo](/en/book-a-demo) and we will show you the chatbot answering with information from a business like yours.",
              },
            ],
          },
          { type: "h2", id: "related-docs", text: "Related documentation" },
          {
            type: "ul",
            items: [
              "[Getting started](/en/docs/ai-chatbot/getting-started): what the chatbot does, its limits and what to prepare.",
              "[Setup](/en/docs/ai-chatbot/setup): website widget and WhatsApp connection.",
              "[Configuration](/en/docs/ai-chatbot/configuration): knowledge base, tone, hand-overs and safety guardrails.",
              "[Usage](/en/docs/ai-chatbot/usage): reviewing conversations, taking over chats and updating information.",
            ],
          },
          { type: "h2", id: "more-help", text: "Still have questions?" },
          {
            type: "p",
            text: "Visit the [product page](/en/products/ai-chatbot), [troubleshooting](/en/docs/ai-chatbot/troubleshooting) or [contact us](/en/contact).",
          },
        ],
      },
      es: {
        title: "Preguntas frecuentes sobre el chatbot con IA",
        description:
          "Respuestas a las dudas habituales sobre el chatbot con IA de Steevanz: precisión, idiomas, WhatsApp, reservas, paso al equipo, clínicas y RGPD.",
        blocks: [
          { type: "h2", id: "questions", text: "Preguntas y respuestas" },
          {
            type: "faq",
            items: [
              {
                q: "¿Puede el chatbot inventar respuestas?",
                a: "Está configurado para responder solo con su información y decir que no lo sabe cuando no tiene respuesta. Aun así, la IA puede equivocarse, por eso recomendamos revisar las conversaciones con regularidad.",
              },
              {
                q: "¿En qué idiomas responde?",
                a: "Por defecto, responde en el idioma en que escribe el cliente. Puede limitarlo a un conjunto de idiomas.",
              },
              {
                q: "¿Puedo usar mi número de WhatsApp actual?",
                a: "En muchos casos, sí. Veremos si es mejor migrar su número actual o usar uno nuevo. Consulte la [instalación](/es/docs/ai-chatbot/setup).",
              },
              {
                q: "¿Qué es el plazo de 24 horas de WhatsApp?",
                a: "Después del último mensaje del cliente, la empresa puede responder libremente durante 24 horas. Fuera de ese periodo, solo puede enviar plantillas de mensaje aprobadas por Meta.",
              },
              {
                q: "¿El chatbot hace reservas?",
                a: "Envía al cliente a su enlace de reservas, donde elige una hora con disponibilidad real. Funciona especialmente bien con el [sistema de reservas online](/es/products/online-booking-system).",
              },
              {
                q: "¿Cómo pasa la conversación a una persona?",
                a: "Cuando una petición está fuera de su ámbito o el cliente pide hablar con alguien, su equipo recibe un aviso con un resumen y continúa la conversación.",
              },
              {
                q: "¿Puedo usarlo en una clínica?",
                a: "Sí, para información sobre servicios, precios, horarios y citas. No da consejo médico y deriva las cuestiones clínicas a su equipo.",
              },
              {
                q: "¿Cómo actualizo la carta o los precios?",
                a: "Envíenos el cambio por WhatsApp o email. Algunas actualizaciones sencillas puede hacerlas directamente en su área de cliente.",
              },
              {
                q: "¿Se guardan las conversaciones?",
                a: "Sí, durante el plazo acordado, para prestar el servicio y mejorar las respuestas, de acuerdo con el RGPD.",
              },
              {
                q: "¿Cómo puedo ver el chatbot en acción?",
                a: "[Reserve una demostración](/es/book-a-demo) y le mostramos el chatbot respondiendo con información de un negocio como el suyo.",
              },
            ],
          },
          { type: "h2", id: "related-docs", text: "Documentación relacionada" },
          {
            type: "ul",
            items: [
              "[Primeros pasos](/es/docs/ai-chatbot/getting-started): qué hace el chatbot, sus límites y qué preparar.",
              "[Instalación](/es/docs/ai-chatbot/setup): widget en la web y conexión a WhatsApp.",
              "[Configuración](/es/docs/ai-chatbot/configuration): base de conocimiento, tono, derivaciones y límites de seguridad.",
              "[Uso](/es/docs/ai-chatbot/usage): revisar conversaciones, tomar el control de chats y actualizar la información.",
            ],
          },
          { type: "h2", id: "more-help", text: "¿Le quedan dudas?" },
          {
            type: "p",
            text: "Visite la [página del producto](/es/products/ai-chatbot), la [resolución de problemas](/es/docs/ai-chatbot/troubleshooting) o [contáctenos](/es/contact).",
          },
        ],
      },
      fr: {
        title: "Questions fréquentes sur le chatbot IA",
        description:
          "Réponses aux questions courantes sur le chatbot IA de Steevanz : fiabilité, langues, WhatsApp, réservations, transmission à l'équipe, cliniques et RGPD.",
        blocks: [
          { type: "h2", id: "questions", text: "Questions et réponses" },
          {
            type: "faq",
            items: [
              {
                q: "Le chatbot peut-il inventer des réponses ?",
                a: "Il est configuré pour ne répondre qu'à partir de vos informations et dire qu'il ne sait pas quand il n'a pas de réponse. Malgré tout, l'IA peut se tromper : nous recommandons donc de relire régulièrement les conversations.",
              },
              {
                q: "Dans quelles langues répond-il ?",
                a: "Par défaut, il répond dans la langue dans laquelle le client écrit. Vous pouvez le limiter à certaines langues.",
              },
              {
                q: "Puis-je utiliser mon numéro WhatsApp actuel ?",
                a: "Dans de nombreux cas, oui. Nous verrons s'il vaut mieux migrer votre numéro actuel ou en utiliser un nouveau. Voir l'[installation](/fr/docs/ai-chatbot/setup).",
              },
              {
                q: "Qu'est-ce que la fenêtre de 24 heures de WhatsApp ?",
                a: "Après le dernier message du client, une entreprise peut répondre librement pendant 24 heures. En dehors de cette période, elle ne peut envoyer que des modèles de message approuvés par Meta.",
              },
              {
                q: "Le chatbot prend-il des réservations ?",
                a: "Il envoie le client vers votre lien de réservation, où il choisit un créneau réellement disponible. Il fonctionne particulièrement bien avec le [système de réservation en ligne](/fr/products/online-booking-system).",
              },
              {
                q: "Comment transmet-il la conversation à une personne ?",
                a: "Quand une demande sort de son cadre ou que le client demande à parler à quelqu'un, votre équipe reçoit une alerte avec un résumé et poursuit la conversation.",
              },
              {
                q: "Puis-je l'utiliser dans une clinique ?",
                a: "Oui, pour des informations sur les services, les prix, les horaires et les rendez-vous. Il ne donne pas de conseils médicaux et transmet les questions cliniques à votre équipe.",
              },
              {
                q: "Comment mettre à jour la carte ou les prix ?",
                a: "Envoyez-nous le changement par WhatsApp ou par e-mail. Certaines mises à jour simples peuvent se faire directement dans votre espace client.",
              },
              {
                q: "Les conversations sont-elles conservées ?",
                a: "Oui, pendant la durée convenue, pour fournir le service et améliorer les réponses, conformément au RGPD.",
              },
              {
                q: "Comment voir le chatbot en action ?",
                a: "[Réservez une démonstration](/fr/book-a-demo) et nous vous montrons le chatbot répondant avec les informations d'un établissement comme le vôtre.",
              },
            ],
          },
          { type: "h2", id: "related-docs", text: "Documentation associée" },
          {
            type: "ul",
            items: [
              "[Premiers pas](/fr/docs/ai-chatbot/getting-started) : ce que fait le chatbot, ses limites et ce qu'il faut préparer.",
              "[Installation](/fr/docs/ai-chatbot/setup) : widget sur le site et connexion à WhatsApp.",
              "[Configuration](/fr/docs/ai-chatbot/configuration) : base de connaissances, ton, transmissions et garde-fous de sécurité.",
              "[Utilisation](/fr/docs/ai-chatbot/usage) : relire les conversations, reprendre la main et mettre à jour les informations.",
            ],
          },
          { type: "h2", id: "more-help", text: "D'autres questions ?" },
          {
            type: "p",
            text: "Consultez la [page du produit](/fr/products/ai-chatbot), le [dépannage](/fr/docs/ai-chatbot/troubleshooting) ou [contactez-nous](/fr/contact).",
          },
        ],
      },
      de: {
        title: "Häufige Fragen zum KI-Chatbot",
        description:
          "Antworten auf häufige Fragen zum KI-Chatbot von Steevanz: Genauigkeit, Sprachen, WhatsApp, Reservierungen, Übergabe ans Team, Praxen und DSGVO.",
        blocks: [
          { type: "h2", id: "questions", text: "Fragen und Antworten" },
          {
            type: "faq",
            items: [
              {
                q: "Kann der Chatbot Antworten erfinden?",
                a: "Er ist so eingestellt, dass er nur auf Grundlage Ihrer Informationen antwortet und sagt, dass er etwas nicht weiß, wenn er keine Antwort hat. Trotzdem kann sich KI irren, deshalb empfehlen wir, die Gespräche regelmäßig durchzusehen.",
              },
              {
                q: "In welchen Sprachen antwortet er?",
                a: "Standardmäßig in der Sprache, in der der Kunde schreibt. Sie können ihn auf bestimmte Sprachen beschränken.",
              },
              {
                q: "Kann ich meine bisherige WhatsApp-Nummer nutzen?",
                a: "In vielen Fällen ja. Wir prüfen, ob es besser ist, Ihre bisherige Nummer umzuziehen oder eine neue zu nutzen. Siehe [Einrichtung](/de/docs/ai-chatbot/setup).",
              },
              {
                q: "Was ist das 24-Stunden-Fenster bei WhatsApp?",
                a: "Nach der letzten Nachricht des Kunden darf ein Unternehmen 24 Stunden lang frei antworten. Außerhalb dieses Zeitraums kann es nur von Meta genehmigte Nachrichtenvorlagen senden.",
              },
              {
                q: "Nimmt der Chatbot Reservierungen an?",
                a: "Er schickt Kunden zu Ihrem Reservierungslink, wo sie einen tatsächlich freien Termin wählen. Besonders gut funktioniert das mit dem [Online-Reservierungssystem](/de/products/online-booking-system).",
              },
              {
                q: "Wie übergibt er an einen Menschen?",
                a: "Liegt eine Anfrage außerhalb seines Rahmens oder möchte der Kunde mit jemandem sprechen, erhält Ihr Team eine Benachrichtigung mit Zusammenfassung und führt das Gespräch weiter.",
              },
              {
                q: "Kann ich ihn in einer Praxis einsetzen?",
                a: "Ja, für Informationen zu Leistungen, Preisen, Öffnungszeiten und Terminen. Er gibt keine medizinischen Ratschläge und leitet medizinische Fragen an Ihr Team weiter.",
              },
              {
                q: "Wie aktualisiere ich Speisekarte oder Preise?",
                a: "Schicken Sie uns die Änderung per WhatsApp oder E-Mail. Einige einfache Aktualisierungen können Sie direkt in Ihrem Kundenbereich vornehmen.",
              },
              {
                q: "Werden Gespräche gespeichert?",
                a: "Ja, für den vereinbarten Zeitraum, um den Service zu erbringen und die Antworten zu verbessern, im Einklang mit der DSGVO.",
              },
              {
                q: "Wie kann ich den Chatbot in Aktion sehen?",
                a: "[Buchen Sie eine Vorführung](/de/book-a-demo), und wir zeigen Ihnen den Chatbot, wie er mit den Informationen eines Betriebs wie Ihrem antwortet.",
              },
            ],
          },
          { type: "h2", id: "related-docs", text: "Weitere Dokumentation" },
          {
            type: "ul",
            items: [
              "[Erste Schritte](/de/docs/ai-chatbot/getting-started): was der Chatbot macht, seine Grenzen und was Sie vorbereiten sollten.",
              "[Einrichtung](/de/docs/ai-chatbot/setup): Website-Widget und WhatsApp-Anbindung.",
              "[Konfiguration](/de/docs/ai-chatbot/configuration): Wissensbasis, Tonfall, Übergaben und Sicherheitsregeln.",
              "[Nutzung](/de/docs/ai-chatbot/usage): Gespräche durchsehen, Chats übernehmen und Informationen aktualisieren.",
            ],
          },
          { type: "h2", id: "more-help", text: "Noch Fragen?" },
          {
            type: "p",
            text: "Besuchen Sie die [Produktseite](/de/products/ai-chatbot), die [Fehlerbehebung](/de/docs/ai-chatbot/troubleshooting) oder [kontaktieren Sie uns](/de/contact).",
          },
        ],
      },
      it: {
        title: "Domande frequenti sul chatbot con IA",
        description:
          "Risposte ai dubbi comuni sul chatbot con IA di Steevanz: precisione, lingue, WhatsApp, prenotazioni, passaggio al team, cliniche e GDPR.",
        blocks: [
          { type: "h2", id: "questions", text: "Domande e risposte" },
          {
            type: "faq",
            items: [
              {
                q: "Il chatbot può inventare le risposte?",
                a: "È configurato per rispondere solo con le Sue informazioni e dire che non lo sa quando non ha una risposta. Ciononostante l'IA può sbagliare, per questo consigliamo di rivedere regolarmente le conversazioni.",
              },
              {
                q: "In quali lingue risponde?",
                a: "Per impostazione predefinita risponde nella lingua in cui scrive il cliente. Può limitarlo a un gruppo di lingue.",
              },
              {
                q: "Posso usare il mio numero WhatsApp attuale?",
                a: "In molti casi sì. Valuteremo se è meglio migrare il Suo numero attuale o usarne uno nuovo. Veda l'[installazione](/it/docs/ai-chatbot/setup).",
              },
              {
                q: "Cos'è la finestra di 24 ore di WhatsApp?",
                a: "Dopo l'ultimo messaggio del cliente, l'azienda può rispondere liberamente per 24 ore. Fuori da questo periodo può inviare solo modelli di messaggio approvati da Meta.",
              },
              {
                q: "Il chatbot prende prenotazioni?",
                a: "Manda il cliente al Suo link di prenotazione, dove sceglie un orario con disponibilità reale. Funziona particolarmente bene con il [sistema di prenotazione online](/it/products/online-booking-system).",
              },
              {
                q: "Come passa la conversazione a una persona?",
                a: "Quando una richiesta è fuori dal suo ambito o il cliente chiede di parlare con qualcuno, il Suo team riceve un avviso con un riepilogo e continua la conversazione.",
              },
              {
                q: "Posso usarlo in una clinica?",
                a: "Sì, per informazioni su servizi, prezzi, orari e appuntamenti. Non dà consigli medici e inoltra le questioni cliniche al Suo team.",
              },
              {
                q: "Come aggiorno il menù o i prezzi?",
                a: "Ci invii la modifica via WhatsApp o email. Alcuni aggiornamenti semplici può farli direttamente nella Sua area clienti.",
              },
              {
                q: "Le conversazioni vengono conservate?",
                a: "Sì, per il periodo concordato, per fornire il servizio e migliorare le risposte, nel rispetto del GDPR.",
              },
              {
                q: "Come posso vedere il chatbot in azione?",
                a: "[Prenoti una demo](/it/book-a-demo) e Le mostriamo il chatbot mentre risponde con le informazioni di un'attività come la Sua.",
              },
            ],
          },
          { type: "h2", id: "related-docs", text: "Documentazione correlata" },
          {
            type: "ul",
            items: [
              "[Primi passi](/it/docs/ai-chatbot/getting-started): cosa fa il chatbot, i suoi limiti e cosa preparare.",
              "[Installazione](/it/docs/ai-chatbot/setup): widget sul sito e collegamento a WhatsApp.",
              "[Configurazione](/it/docs/ai-chatbot/configuration): base di conoscenza, tono, passaggi al team e limiti di sicurezza.",
              "[Utilizzo](/it/docs/ai-chatbot/usage): rivedere le conversazioni, prendere in mano le chat e aggiornare le informazioni.",
            ],
          },
          { type: "h2", id: "more-help", text: "Ha ancora domande?" },
          {
            type: "p",
            text: "Visiti la [pagina del prodotto](/it/products/ai-chatbot), la [risoluzione dei problemi](/it/docs/ai-chatbot/troubleshooting) o [ci contatti](/it/contact).",
          },
        ],
      },
    },
  },
};
