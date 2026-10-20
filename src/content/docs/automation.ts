import type { ProductDocs } from "../types";

export const docs: ProductDocs = {
  productId: "automation",
  pages: {
    "getting-started": {
      pt: {
        title: "Primeiros passos com a Automação de Processos",
        description:
          "Perceba como funcionam os projetos de Automação de Processos da Steevanz, que tarefas se podem automatizar e como identificar o melhor ponto de partida.",
        blocks: [
          {
            type: "p",
            text: "A **Automação de Processos** da Steevanz é um serviço à medida: analisamos as tarefas repetitivas do seu negócio e construímos automações que as fazem por si, ligando as ferramentas que já usa. Cada projeto tem preço fechado, acordado antes de começarmos.",
          },
          {
            type: "h2",
            id: "o-que-automatizar",
            text: "O que se pode automatizar",
          },
          {
            type: "p",
            text: "Se uma tarefa segue sempre os mesmos passos, envolve copiar dados de um sítio para outro ou depende de alguém se lembrar de a fazer, é provável que possa ser automatizada. Alguns exemplos comuns:",
          },
          {
            type: "table",
            head: ["Processo", "O que a automação faz"],
            rows: [
              ["Faturação após pagamento", "Quando um pagamento é confirmado, emite a fatura no software de faturação certificado e envia-a ao cliente"],
              ["Seguimento de contactos", "Regista novos pedidos do site num CRM ou folha de cálculo e envia mensagens de seguimento"],
              ["Lembretes de marcação", "Envia lembretes por WhatsApp ou email no dia anterior à marcação"],
              ["Encomendas a fornecedores", "Gera e envia encomendas quando o stock desce abaixo de um mínimo"],
              ["Relatórios diários", "Reúne vendas, reservas ou pedidos e envia um resumo ao fim do dia"],
            ],
          },
          {
            type: "h2",
            id: "como-funciona",
            text: "Como funciona um projeto",
          },
          {
            type: "ol",
            items: [
              "**Conversa inicial**: percebemos o seu negócio e as tarefas que mais tempo lhe tiram.",
              "**Mapeamento do processo**: descrevemos o processo passo a passo, tal como é feito hoje.",
              "**Proposta de preço fechado**: indicamos o que vamos construir, prazos e custo.",
              "**Construção e testes**: desenvolvemos a automação e testamos com dados reais ou de teste.",
              "**Entrega e manutenção**: explicamos como funciona e acompanhamos o funcionamento.",
            ],
          },
          {
            type: "h2",
            id: "ferramentas",
            text: "Ferramentas que utilizamos",
          },
          {
            type: "p",
            text: "Escolhemos a ferramenta adequada a cada caso: plataformas como **Make**, **n8n** ou **Zapier**, ou código à medida quando faz mais sentido. Ligamos serviços como Google Sheets, Gmail, Outlook, WhatsApp, CRMs e software de faturação certificado em Portugal, como InvoiceXpress, Moloni ou Vendus, através das respetivas APIs.",
          },
          {
            type: "callout",
            tone: "tip",
            title: "Comece pequeno",
            text: "O melhor primeiro projeto é uma tarefa frequente, bem definida e aborrecida. Os resultados veem-se depressa e ajudam a decidir o que automatizar a seguir.",
          },
          {
            type: "h2",
            id: "proximos-passos",
            text: "Próximos passos",
          },
          {
            type: "p",
            text: "Consulte a [página do produto](/produtos/automacao-processos), veja como decorre o [arranque do projeto](/docs/automacao-processos/instalacao) ou [marque uma conversa inicial](/agendar).",
          },
        ],
      },
      en: {
        title: "Getting started with Process Automation",
        description:
          "Understand how Steevanz Process Automation projects work, which tasks can be automated and how to find the best place to start for your business.",
        blocks: [
          {
            type: "p",
            text: "Steevanz **Process Automation** is a bespoke service: we look at the repetitive tasks in your business and build automations that do them for you, connecting the tools you already use. Every project has a fixed price, agreed before we start.",
          },
          {
            type: "h2",
            id: "what-to-automate",
            text: "What can be automated",
          },
          {
            type: "p",
            text: "If a task always follows the same steps, involves copying data from one place to another or depends on someone remembering to do it, it can probably be automated. Some common examples:",
          },
          {
            type: "table",
            head: ["Process", "What the automation does"],
            rows: [
              ["Invoicing after payment", "When a payment is confirmed, issues the invoice in certified invoicing software and sends it to the customer"],
              ["Lead follow-up", "Logs new website enquiries in a CRM or spreadsheet and sends follow-up messages"],
              ["Appointment reminders", "Sends WhatsApp or email reminders the day before an appointment"],
              ["Supplier orders", "Creates and sends orders when stock drops below a minimum"],
              ["Daily reports", "Pulls together sales, bookings or orders and sends a summary at the end of the day"],
            ],
          },
          {
            type: "h2",
            id: "how-it-works",
            text: "How a project works",
          },
          {
            type: "ol",
            items: [
              "**Discovery call**: we get to know your business and the tasks that take up most of your time.",
              "**Process mapping**: we describe the process step by step, as it is done today.",
              "**Fixed-price proposal**: we set out what we'll build, the timeline and the cost.",
              "**Build and testing**: we develop the automation and test it with real or test data.",
              "**Handover and maintenance**: we explain how it works and keep an eye on it.",
            ],
          },
          {
            type: "h2",
            id: "tools",
            text: "Tools we use",
          },
          {
            type: "p",
            text: "We pick the right tool for each case: platforms such as **Make**, **n8n** or **Zapier**, or custom code when that makes more sense. We connect services such as Google Sheets, Gmail, Outlook, WhatsApp, CRMs and invoicing software certified in Portugal, like InvoiceXpress, Moloni or Vendus, through their APIs.",
          },
          {
            type: "callout",
            tone: "tip",
            title: "Start small",
            text: "The best first project is a frequent, well-defined and tedious task. Results show quickly and help you decide what to automate next.",
          },
          {
            type: "h2",
            id: "next-steps",
            text: "Next steps",
          },
          {
            type: "p",
            text: "See the [product page](/en/products/process-automation), read how a [project kicks off](/en/docs/process-automation/setup) or [book a discovery call](/en/book-a-demo).",
          },
        ],
      },
      es: {
        title: "Primeros pasos con la Automatización de procesos",
        description:
          "Entienda cómo funcionan los proyectos de Automatización de procesos de Steevanz, qué tareas se pueden automatizar y cómo encontrar el mejor punto de partida para su negocio.",
        blocks: [
          {
            type: "p",
            text: "La **Automatización de procesos** de Steevanz es un servicio a medida: analizamos las tareas repetitivas de su negocio y creamos automatizaciones que las hacen por usted, conectando las herramientas que ya usa. Cada proyecto tiene un precio cerrado, acordado antes de empezar.",
          },
          { type: "h2", id: "what-to-automate", text: "Qué se puede automatizar" },
          {
            type: "p",
            text: "Si una tarea sigue siempre los mismos pasos, consiste en copiar datos de un sitio a otro o depende de que alguien se acuerde de hacerla, probablemente se puede automatizar. Algunos ejemplos habituales:",
          },
          {
            type: "table",
            head: ["Proceso", "Qué hace la automatización"],
            rows: [
              ["Facturación tras el pago", "Cuando se confirma un pago, emite la factura en el software de facturación certificado y se la envía al cliente"],
              ["Seguimiento de contactos", "Registra las nuevas solicitudes de la web en un CRM o una hoja de cálculo y envía mensajes de seguimiento"],
              ["Recordatorios de citas", "Envía recordatorios por WhatsApp o correo electrónico el día antes de una cita"],
              ["Pedidos a proveedores", "Crea y envía pedidos cuando el stock baja de un mínimo"],
              ["Informes diarios", "Reúne ventas, reservas o pedidos y envía un resumen al final del día"],
            ],
          },
          { type: "h2", id: "how-it-works", text: "Cómo funciona un proyecto" },
          {
            type: "ol",
            items: [
              "**Llamada inicial**: conocemos su negocio y las tareas que más tiempo le quitan.",
              "**Mapa del proceso**: describimos el proceso paso a paso, tal como se hace hoy.",
              "**Propuesta de precio cerrado**: detallamos qué vamos a construir, el plazo y el coste.",
              "**Desarrollo y pruebas**: desarrollamos la automatización y la probamos con datos reales o de prueba.",
              "**Entrega y mantenimiento**: le explicamos cómo funciona y la vigilamos.",
            ],
          },
          { type: "h2", id: "tools", text: "Herramientas que usamos" },
          {
            type: "p",
            text: "Elegimos la herramienta adecuada para cada caso: plataformas como **Make**, **n8n** o **Zapier**, o código a medida cuando tiene más sentido. Conectamos servicios como Google Sheets, Gmail, Outlook, WhatsApp, CRM y software de facturación certificado en Portugal, como InvoiceXpress, Moloni o Vendus, a través de sus API.",
          },
          {
            type: "callout",
            tone: "tip",
            title: "Empiece por algo pequeño",
            text: "El mejor primer proyecto es una tarea frecuente, bien definida y pesada. Los resultados se ven pronto y le ayudan a decidir qué automatizar después.",
          },
          { type: "h2", id: "next-steps", text: "Próximos pasos" },
          {
            type: "p",
            text: "Vea la [página del producto](/es/products/process-automation), lea cómo [arranca un proyecto](/es/docs/process-automation/setup) o [reserve una llamada inicial](/es/book-a-demo).",
          },
        ],
      },
      fr: {
        title: "Premiers pas avec l'Automatisation des processus",
        description:
          "Comprenez comment fonctionnent les projets d'Automatisation des processus de Steevanz, quelles tâches peuvent être automatisées et comment trouver le meilleur point de départ pour votre activité.",
        blocks: [
          {
            type: "p",
            text: "L'**Automatisation des processus** de Steevanz est un service sur mesure : nous étudions les tâches répétitives de votre activité et créons des automatisations qui les font à votre place, en reliant les outils que vous utilisez déjà. Chaque projet a un prix forfaitaire, convenu avant de commencer.",
          },
          { type: "h2", id: "what-to-automate", text: "Ce qui peut être automatisé" },
          {
            type: "p",
            text: "Si une tâche suit toujours les mêmes étapes, consiste à copier des données d'un endroit à un autre ou dépend de quelqu'un qui doit penser à la faire, elle peut probablement être automatisée. Quelques exemples courants :",
          },
          {
            type: "table",
            head: ["Processus", "Ce que fait l'automatisation"],
            rows: [
              ["Facturation après paiement", "Quand un paiement est confirmé, elle émet la facture dans le logiciel de facturation certifié et l'envoie au client"],
              ["Suivi des contacts", "Enregistre les nouvelles demandes du site dans un CRM ou un tableur et envoie des messages de relance"],
              ["Rappels de rendez-vous", "Envoie des rappels par WhatsApp ou par e-mail la veille d'un rendez-vous"],
              ["Commandes fournisseurs", "Crée et envoie les commandes quand le stock passe sous un minimum"],
              ["Rapports quotidiens", "Rassemble ventes, réservations ou commandes et envoie un résumé en fin de journée"],
            ],
          },
          { type: "h2", id: "how-it-works", text: "Comment se déroule un projet" },
          {
            type: "ol",
            items: [
              "**Appel de découverte** : nous découvrons votre activité et les tâches qui vous prennent le plus de temps.",
              "**Cartographie du processus** : nous décrivons le processus étape par étape, tel qu'il se fait aujourd'hui.",
              "**Proposition à prix forfaitaire** : nous détaillons ce que nous allons construire, le délai et le coût.",
              "**Développement et tests** : nous développons l'automatisation et la testons avec des données réelles ou de test.",
              "**Livraison et maintenance** : nous vous expliquons comment elle fonctionne et nous la surveillons.",
            ],
          },
          { type: "h2", id: "tools", text: "Les outils que nous utilisons" },
          {
            type: "p",
            text: "Nous choisissons le bon outil pour chaque cas : des plateformes comme **Make**, **n8n** ou **Zapier**, ou du code sur mesure quand c'est plus pertinent. Nous relions des services comme Google Sheets, Gmail, Outlook, WhatsApp, des CRM et des logiciels de facturation certifiés au Portugal, comme InvoiceXpress, Moloni ou Vendus, via leurs API.",
          },
          {
            type: "callout",
            tone: "tip",
            title: "Commencez petit",
            text: "Le meilleur premier projet est une tâche fréquente, bien définie et fastidieuse. Les résultats se voient vite et vous aident à décider quoi automatiser ensuite.",
          },
          { type: "h2", id: "next-steps", text: "Étapes suivantes" },
          {
            type: "p",
            text: "Consultez la [page du produit](/fr/products/process-automation), découvrez comment [démarre un projet](/fr/docs/process-automation/setup) ou [réservez un appel de découverte](/fr/book-a-demo).",
          },
        ],
      },
      de: {
        title: "Erste Schritte mit der Automatisierung von Prozessen",
        description:
          "Erfahren Sie, wie Projekte zur Prozessautomatisierung bei Steevanz ablaufen, welche Aufgaben sich automatisieren lassen und wo Ihr Betrieb am besten anfängt.",
        blocks: [
          {
            type: "p",
            text: "Die **Prozessautomatisierung** von Steevanz ist ein Service nach Maß: Wir sehen uns die wiederkehrenden Aufgaben in Ihrem Betrieb an und bauen Automatisierungen, die sie für Sie erledigen, indem sie die Werkzeuge verbinden, die Sie bereits nutzen. Jedes Projekt hat einen Festpreis, der vor dem Start vereinbart wird.",
          },
          { type: "h2", id: "what-to-automate", text: "Was sich automatisieren lässt" },
          {
            type: "p",
            text: "Wenn eine Aufgabe immer denselben Schritten folgt, Daten von einer Stelle an eine andere kopiert oder davon abhängt, dass jemand an sie denkt, lässt sie sich wahrscheinlich automatisieren. Einige typische Beispiele:",
          },
          {
            type: "table",
            head: ["Prozess", "Was die Automatisierung macht"],
            rows: [
              ["Rechnung nach Zahlung", "Sobald eine Zahlung bestätigt ist, erstellt sie die Rechnung in der zertifizierten Rechnungssoftware und schickt sie an den Kunden"],
              ["Nachverfolgung von Anfragen", "Trägt neue Anfragen von der Website in ein CRM oder eine Tabelle ein und schickt Folgenachrichten"],
              ["Terminerinnerungen", "Schickt am Vortag eines Termins Erinnerungen per WhatsApp oder E-Mail"],
              ["Bestellungen bei Lieferanten", "Erstellt und verschickt Bestellungen, wenn der Bestand unter ein Minimum fällt"],
              ["Tägliche Berichte", "Fasst Verkäufe, Reservierungen oder Bestellungen zusammen und schickt am Ende des Tages eine Übersicht"],
            ],
          },
          { type: "h2", id: "how-it-works", text: "So läuft ein Projekt ab" },
          {
            type: "ol",
            items: [
              "**Erstgespräch**: Wir lernen Ihren Betrieb kennen und die Aufgaben, die Sie am meisten Zeit kosten.",
              "**Prozessaufnahme**: Wir beschreiben den Prozess Schritt für Schritt, so wie er heute abläuft.",
              "**Festpreisangebot**: Wir legen dar, was wir bauen, den Zeitplan und die Kosten.",
              "**Umsetzung und Tests**: Wir entwickeln die Automatisierung und testen sie mit echten Daten oder Testdaten.",
              "**Übergabe und Wartung**: Wir erklären Ihnen, wie sie funktioniert, und behalten sie im Blick.",
            ],
          },
          { type: "h2", id: "tools", text: "Werkzeuge, die wir einsetzen" },
          {
            type: "p",
            text: "Wir wählen für jeden Fall das passende Werkzeug: Plattformen wie **Make**, **n8n** oder **Zapier** oder eigenen Code, wenn das sinnvoller ist. Wir verbinden Dienste wie Google Sheets, Gmail, Outlook, WhatsApp, CRMs und in Portugal zertifizierte Rechnungssoftware wie InvoiceXpress, Moloni oder Vendus über ihre APIs.",
          },
          {
            type: "callout",
            tone: "tip",
            title: "Klein anfangen",
            text: "Das beste erste Projekt ist eine häufige, klar umrissene und mühsame Aufgabe. Die Ergebnisse zeigen sich schnell und helfen Ihnen bei der Entscheidung, was Sie als Nächstes automatisieren.",
          },
          { type: "h2", id: "next-steps", text: "Nächste Schritte" },
          {
            type: "p",
            text: "Sehen Sie sich die [Produktseite](/de/products/process-automation) an, lesen Sie, wie ein [Projekt startet](/de/docs/process-automation/setup), oder [buchen Sie ein Erstgespräch](/de/book-a-demo).",
          },
        ],
      },
      it: {
        title: "Primi passi con l'Automazione dei processi",
        description:
          "Capite come funzionano i progetti di Automazione dei processi di Steevanz, quali attività si possono automatizzare e come trovare il punto di partenza migliore per la vostra attività.",
        blocks: [
          {
            type: "p",
            text: "L'**Automazione dei processi** di Steevanz è un servizio su misura: analizziamo le attività ripetitive della vostra attività e costruiamo automazioni che le svolgono al posto vostro, collegando gli strumenti che già usate. Ogni progetto ha un prezzo fisso, concordato prima di iniziare.",
          },
          { type: "h2", id: "what-to-automate", text: "Cosa si può automatizzare" },
          {
            type: "p",
            text: "Se un'attività segue sempre gli stessi passaggi, consiste nel copiare dati da un posto all'altro o dipende da qualcuno che deve ricordarsi di farla, probabilmente si può automatizzare. Alcuni esempi comuni:",
          },
          {
            type: "table",
            head: ["Processo", "Cosa fa l'automazione"],
            rows: [
              ["Fatturazione dopo il pagamento", "Quando un pagamento è confermato, emette la fattura nel software di fatturazione certificato e la invia al cliente"],
              ["Seguito dei contatti", "Registra le nuove richieste dal sito in un CRM o in un foglio di calcolo e invia messaggi di follow-up"],
              ["Promemoria degli appuntamenti", "Invia promemoria via WhatsApp o e-mail il giorno prima di un appuntamento"],
              ["Ordini ai fornitori", "Crea e invia gli ordini quando le scorte scendono sotto un minimo"],
              ["Report giornalieri", "Raccoglie vendite, prenotazioni o ordini e invia un riepilogo a fine giornata"],
            ],
          },
          { type: "h2", id: "how-it-works", text: "Come funziona un progetto" },
          {
            type: "ol",
            items: [
              "**Chiamata conoscitiva**: conosciamo la vostra attività e i compiti che vi portano via più tempo.",
              "**Mappatura del processo**: descriviamo il processo passo dopo passo, così come si svolge oggi.",
              "**Proposta a prezzo fisso**: indichiamo cosa costruiremo, i tempi e il costo.",
              "**Sviluppo e test**: sviluppiamo l'automazione e la testiamo con dati reali o di prova.",
              "**Consegna e manutenzione**: vi spieghiamo come funziona e la teniamo sotto controllo.",
            ],
          },
          { type: "h2", id: "tools", text: "Gli strumenti che usiamo" },
          {
            type: "p",
            text: "Scegliamo lo strumento giusto per ogni caso: piattaforme come **Make**, **n8n** o **Zapier**, oppure codice su misura quando ha più senso. Colleghiamo servizi come Google Sheets, Gmail, Outlook, WhatsApp, CRM e software di fatturazione certificati in Portogallo, come InvoiceXpress, Moloni o Vendus, tramite le loro API.",
          },
          {
            type: "callout",
            tone: "tip",
            title: "Iniziate in piccolo",
            text: "Il miglior primo progetto è un'attività frequente, ben definita e noiosa. I risultati si vedono presto e vi aiutano a decidere cosa automatizzare dopo.",
          },
          { type: "h2", id: "next-steps", text: "Prossimi passi" },
          {
            type: "p",
            text: "Guardate la [pagina del prodotto](/it/products/process-automation), leggete come [parte un progetto](/it/docs/process-automation/setup) o [prenotate una chiamata conoscitiva](/it/book-a-demo).",
          },
        ],
      },
    },
    setup: {
      pt: {
        title: "Arranque de um projeto de Automação de Processos",
        description:
          "Passo a passo de um projeto de automação com a Steevanz: conversa inicial, mapeamento do processo, proposta de preço fechado, construção, testes e entrega.",
        blocks: [
          {
            type: "p",
            text: "Na automação não há uma instalação única: cada projeto segue um processo estruturado que garante que construímos a coisa certa, com o custo acordado desde o início. Esta página descreve cada fase e o que precisamos de si.",
          },
          {
            type: "h2",
            id: "fases",
            text: "Fases do projeto",
          },
          {
            type: "steps",
            items: [
              {
                title: "Conversa inicial",
                body: "Uma chamada de cerca de meia hora para percebermos o negócio, as ferramentas que usa e as tarefas que quer automatizar. Sem compromisso.",
              },
              {
                title: "Mapeamento do processo",
                body: "Descrevemos o processo atual passo a passo: quem faz o quê, com que ferramentas, com que frequência e que exceções existem. Pode ser feito numa segunda chamada ou partilhando o ecrã enquanto faz a tarefa.",
              },
              {
                title: "Proposta de preço fechado",
                body: "Enviamos uma proposta com o âmbito, as integrações, o prazo, o preço fechado e o custo de manutenção, se aplicável. Só avançamos com a sua aprovação.",
              },
              {
                title: "Acessos",
                body: "Pedimos os acessos estritamente necessários às ferramentas envolvidas, de forma segura, como descrito abaixo.",
              },
              {
                title: "Construção",
                body: "Desenvolvemos a automação e mantemo-lo informado dos avanços. Se surgir algo fora do âmbito, falamos antes de continuar.",
              },
              {
                title: "Testes",
                body: "Testamos com dados de teste e, quando possível, em paralelo com o processo manual, até confirmar que os resultados estão corretos.",
              },
              {
                title: "Entrega",
                body: "Ativamos a automação, entregamos uma descrição simples do que faz e explicamos o que fazer se algo correr mal.",
              },
            ],
          },
          {
            type: "h2",
            id: "o-que-preparar",
            text: "O que preparar",
          },
          {
            type: "ul",
            items: [
              "A lista de ferramentas envolvidas (por exemplo, software de faturação, email, folhas de cálculo, CRM).",
              "Exemplos reais do processo: um email típico, uma fatura, uma folha de cálculo.",
              "As exceções que conhece: clientes com condições especiais, pagamentos parciais, devoluções.",
              "Uma pessoa de contacto que conheça bem o processo.",
            ],
          },
          {
            type: "h2",
            id: "acessos-seguros",
            text: "Partilha segura de acessos",
          },
          {
            type: "p",
            text: "Seguimos o princípio do **menor privilégio**: pedimos apenas as permissões necessárias para a automação funcionar. Sempre que a ferramenta permite, usamos chaves de API ou utilizadores dedicados em vez da sua conta pessoal.",
          },
          {
            type: "callout",
            tone: "warning",
            title: "Não envie palavras-passe por email ou WhatsApp",
            text: "Para partilhar credenciais usamos um cofre de palavras-passe partilhado. Se precisar de revogar o acesso, pode fazê-lo a qualquer momento na própria ferramenta.",
          },
          {
            type: "h2",
            id: "prazos",
            text: "Prazos",
          },
          {
            type: "p",
            text: "Automações simples, com duas ou três ferramentas, costumam ficar prontas em poucas semanas. Projetos com mais integrações ou código à medida demoram mais. O prazo concreto consta sempre da proposta. Depois da entrega, veja a página de [configuração](/docs/automacao-processos/configuracao).",
          },
        ],
      },
      en: {
        title: "Kicking off a Process Automation project",
        description:
          "Step-by-step guide to an automation project with Steevanz: discovery call, process mapping, fixed-price proposal, build, testing and handover.",
        blocks: [
          {
            type: "p",
            text: "There's no single installation with automation: each project follows a structured process that makes sure we build the right thing, at a cost agreed from the start. This page describes each phase and what we need from you.",
          },
          {
            type: "h2",
            id: "phases",
            text: "Project phases",
          },
          {
            type: "steps",
            items: [
              {
                title: "Discovery call",
                body: "A call of around half an hour to understand your business, the tools you use and the tasks you want to automate. No commitment.",
              },
              {
                title: "Process mapping",
                body: "We describe the current process step by step: who does what, with which tools, how often and what exceptions exist. This can be a second call or a screen share while you do the task.",
              },
              {
                title: "Fixed-price proposal",
                body: "We send a proposal covering scope, integrations, timeline, fixed price and maintenance cost where applicable. We only go ahead with your approval.",
              },
              {
                title: "Access",
                body: "We ask for only the access strictly needed to the tools involved, shared securely as described below.",
              },
              {
                title: "Build",
                body: "We build the automation and keep you updated on progress. If something outside the scope comes up, we talk before carrying on.",
              },
              {
                title: "Testing",
                body: "We test with test data and, where possible, in parallel with the manual process until we're sure the results are right.",
              },
              {
                title: "Handover",
                body: "We switch the automation on, give you a plain description of what it does and explain what to do if something goes wrong.",
              },
            ],
          },
          {
            type: "h2",
            id: "what-to-prepare",
            text: "What to prepare",
          },
          {
            type: "ul",
            items: [
              "The list of tools involved (for example invoicing software, email, spreadsheets, CRM).",
              "Real examples of the process: a typical email, an invoice, a spreadsheet.",
              "The exceptions you know about: customers with special terms, partial payments, refunds.",
              "A contact person who knows the process well.",
            ],
          },
          {
            type: "h2",
            id: "secure-access",
            text: "Sharing access securely",
          },
          {
            type: "p",
            text: "We follow the principle of **least privilege**: we ask only for the permissions the automation needs to work. Wherever the tool allows, we use API keys or dedicated users rather than your personal account.",
          },
          {
            type: "callout",
            tone: "warning",
            title: "Don't send passwords by email or WhatsApp",
            text: "We use a shared password vault to exchange credentials. If you need to revoke access, you can do so at any time in the tool itself.",
          },
          {
            type: "h2",
            id: "timelines",
            text: "Timelines",
          },
          {
            type: "p",
            text: "Simple automations involving two or three tools are usually ready within a few weeks. Projects with more integrations or custom code take longer. The exact timeline is always in the proposal. After handover, see the [configuration](/en/docs/process-automation/configuration) page.",
          },
        ],
      },
      es: {
        title: "Arranque de un proyecto de Automatización de procesos",
        description:
          "Guía paso a paso de un proyecto de automatización con Steevanz: llamada inicial, mapa del proceso, propuesta de precio cerrado, desarrollo, pruebas y entrega.",
        blocks: [
          {
            type: "p",
            text: "En la automatización no hay una instalación única: cada proyecto sigue un proceso estructurado que garantiza que construimos lo correcto, con un coste acordado desde el principio. Esta página describe cada fase y lo que necesitamos de usted.",
          },
          { type: "h2", id: "phases", text: "Fases del proyecto" },
          {
            type: "steps",
            items: [
              { title: "Llamada inicial", body: "Una llamada de una media hora para entender su negocio, las herramientas que usa y las tareas que quiere automatizar. Sin compromiso." },
              { title: "Mapa del proceso", body: "Describimos el proceso actual paso a paso: quién hace qué, con qué herramientas, con qué frecuencia y qué excepciones hay. Puede ser una segunda llamada o compartir pantalla mientras usted hace la tarea." },
              { title: "Propuesta de precio cerrado", body: "Le enviamos una propuesta con el alcance, las integraciones, el plazo, el precio cerrado y el coste de mantenimiento si lo hay. Solo seguimos adelante con su aprobación." },
              { title: "Accesos", body: "Solo pedimos los accesos estrictamente necesarios a las herramientas implicadas, compartidos de forma segura como se explica más abajo." },
              { title: "Desarrollo", body: "Construimos la automatización y le mantenemos informado del avance. Si surge algo fuera del alcance, lo hablamos antes de continuar." },
              { title: "Pruebas", body: "Probamos con datos de prueba y, cuando es posible, en paralelo con el proceso manual hasta estar seguros de que los resultados son correctos." },
              { title: "Entrega", body: "Activamos la automatización, le damos una descripción sencilla de lo que hace y le explicamos qué hacer si algo falla." },
            ],
          },
          { type: "h2", id: "what-to-prepare", text: "Qué preparar" },
          {
            type: "ul",
            items: [
              "La lista de herramientas implicadas (por ejemplo, software de facturación, correo electrónico, hojas de cálculo, CRM).",
              "Ejemplos reales del proceso: un correo típico, una factura, una hoja de cálculo.",
              "Las excepciones que conozca: clientes con condiciones especiales, pagos parciales, devoluciones.",
              "Una persona de contacto que conozca bien el proceso.",
            ],
          },
          { type: "h2", id: "secure-access", text: "Compartir accesos de forma segura" },
          {
            type: "p",
            text: "Seguimos el principio del **mínimo privilegio**: solo pedimos los permisos que la automatización necesita para funcionar. Siempre que la herramienta lo permite, usamos claves de API o usuarios dedicados en lugar de su cuenta personal.",
          },
          {
            type: "callout",
            tone: "warning",
            title: "No envíe contraseñas por correo electrónico ni por WhatsApp",
            text: "Usamos un gestor de contraseñas compartido para intercambiar credenciales. Si necesita retirar un acceso, puede hacerlo en cualquier momento en la propia herramienta.",
          },
          { type: "h2", id: "timelines", text: "Plazos" },
          {
            type: "p",
            text: "Las automatizaciones sencillas, con dos o tres herramientas, suelen estar listas en pocas semanas. Los proyectos con más integraciones o código a medida llevan más tiempo. El plazo exacto figura siempre en la propuesta. Después de la entrega, consulte la página de [configuración](/es/docs/process-automation/configuration).",
          },
        ],
      },
      fr: {
        title: "Démarrer un projet d'Automatisation des processus",
        description:
          "Le déroulé d'un projet d'automatisation avec Steevanz, étape par étape : appel de découverte, cartographie du processus, proposition à prix forfaitaire, développement, tests et livraison.",
        blocks: [
          {
            type: "p",
            text: "En automatisation, il n'y a pas d'installation unique : chaque projet suit une démarche structurée qui garantit que nous construisons ce qu'il faut, pour un coût convenu dès le départ. Cette page décrit chaque phase et ce dont nous avons besoin de votre part.",
          },
          { type: "h2", id: "phases", text: "Les phases du projet" },
          {
            type: "steps",
            items: [
              { title: "Appel de découverte", body: "Un appel d'environ une demi-heure pour comprendre votre activité, les outils que vous utilisez et les tâches que vous voulez automatiser. Sans engagement." },
              { title: "Cartographie du processus", body: "Nous décrivons le processus actuel étape par étape : qui fait quoi, avec quels outils, à quelle fréquence et quelles exceptions existent. Cela peut être un deuxième appel ou un partage d'écran pendant que vous faites la tâche." },
              { title: "Proposition à prix forfaitaire", body: "Nous vous envoyons une proposition qui couvre le périmètre, les intégrations, le délai, le prix forfaitaire et le coût de maintenance le cas échéant. Nous n'avançons qu'avec votre accord." },
              { title: "Accès", body: "Nous ne demandons que les accès strictement nécessaires aux outils concernés, partagés de manière sécurisée comme décrit plus bas." },
              { title: "Développement", body: "Nous construisons l'automatisation et vous tenons informé de l'avancement. Si un point hors périmètre apparaît, nous en parlons avant de continuer." },
              { title: "Tests", body: "Nous testons avec des données de test et, quand c'est possible, en parallèle du processus manuel jusqu'à être sûrs que les résultats sont justes." },
              { title: "Livraison", body: "Nous activons l'automatisation, vous remettons une description simple de ce qu'elle fait et vous expliquons quoi faire en cas de problème." },
            ],
          },
          { type: "h2", id: "what-to-prepare", text: "Ce qu'il faut préparer" },
          {
            type: "ul",
            items: [
              "La liste des outils concernés (par exemple logiciel de facturation, e-mail, tableurs, CRM).",
              "Des exemples réels du processus : un e-mail type, une facture, un tableur.",
              "Les exceptions que vous connaissez : clients aux conditions particulières, paiements partiels, remboursements.",
              "Une personne de contact qui connaît bien le processus.",
            ],
          },
          { type: "h2", id: "secure-access", text: "Partager les accès en toute sécurité" },
          {
            type: "p",
            text: "Nous appliquons le principe du **moindre privilège** : nous ne demandons que les autorisations dont l'automatisation a besoin pour fonctionner. Chaque fois que l'outil le permet, nous utilisons des clés d'API ou des utilisateurs dédiés plutôt que votre compte personnel.",
          },
          {
            type: "callout",
            tone: "warning",
            title: "N'envoyez pas de mots de passe par e-mail ou par WhatsApp",
            text: "Nous utilisons un coffre-fort de mots de passe partagé pour échanger les identifiants. Si vous devez retirer un accès, vous pouvez le faire à tout moment dans l'outil lui-même.",
          },
          { type: "h2", id: "timelines", text: "Délais" },
          {
            type: "p",
            text: "Les automatisations simples, avec deux ou trois outils, sont en général prêtes en quelques semaines. Les projets avec plus d'intégrations ou du code sur mesure prennent plus de temps. Le délai exact figure toujours dans la proposition. Après la livraison, consultez la page [configuration](/fr/docs/process-automation/configuration).",
          },
        ],
      },
      de: {
        title: "So startet ein Projekt zur Automatisierung",
        description:
          "Ein Automatisierungsprojekt mit Steevanz Schritt für Schritt: Erstgespräch, Prozessaufnahme, Festpreisangebot, Umsetzung, Tests und Übergabe.",
        blocks: [
          {
            type: "p",
            text: "Bei der Automatisierung gibt es keine Standardinstallation: Jedes Projekt folgt einem strukturierten Ablauf, der sicherstellt, dass wir das Richtige bauen, zu Kosten, die von Anfang an vereinbart sind. Diese Seite beschreibt jede Phase und was wir von Ihnen brauchen.",
          },
          { type: "h2", id: "phases", text: "Projektphasen" },
          {
            type: "steps",
            items: [
              { title: "Erstgespräch", body: "Ein Gespräch von etwa einer halben Stunde, um Ihren Betrieb, Ihre Werkzeuge und die Aufgaben zu verstehen, die Sie automatisieren möchten. Unverbindlich." },
              { title: "Prozessaufnahme", body: "Wir beschreiben den heutigen Prozess Schritt für Schritt: wer was macht, mit welchen Werkzeugen, wie oft und welche Ausnahmen es gibt. Das kann ein zweites Gespräch sein oder eine Bildschirmfreigabe, während Sie die Aufgabe erledigen." },
              { title: "Festpreisangebot", body: "Wir schicken Ihnen ein Angebot mit Umfang, Integrationen, Zeitplan, Festpreis und gegebenenfalls Wartungskosten. Wir machen erst mit Ihrer Zustimmung weiter." },
              { title: "Zugänge", body: "Wir bitten nur um die unbedingt nötigen Zugänge zu den beteiligten Werkzeugen, sicher geteilt wie unten beschrieben." },
              { title: "Umsetzung", body: "Wir bauen die Automatisierung und halten Sie über den Fortschritt auf dem Laufenden. Taucht etwas außerhalb des Umfangs auf, sprechen wir darüber, bevor wir weitermachen." },
              { title: "Tests", body: "Wir testen mit Testdaten und, wo möglich, parallel zum manuellen Prozess, bis wir sicher sind, dass die Ergebnisse stimmen." },
              { title: "Übergabe", body: "Wir schalten die Automatisierung ein, geben Ihnen eine einfache Beschreibung dessen, was sie tut, und erklären, was zu tun ist, wenn etwas schiefgeht." },
            ],
          },
          { type: "h2", id: "what-to-prepare", text: "Was Sie vorbereiten sollten" },
          {
            type: "ul",
            items: [
              "Die Liste der beteiligten Werkzeuge (zum Beispiel Rechnungssoftware, E-Mail, Tabellen, CRM).",
              "Echte Beispiele aus dem Prozess: eine typische E-Mail, eine Rechnung, eine Tabelle.",
              "Die Ausnahmen, die Sie kennen: Kunden mit Sonderkonditionen, Teilzahlungen, Erstattungen.",
              "Eine Ansprechperson, die den Prozess gut kennt.",
            ],
          },
          { type: "h2", id: "secure-access", text: "Zugänge sicher teilen" },
          {
            type: "p",
            text: "Wir folgen dem Prinzip der **minimalen Rechte**: Wir bitten nur um die Berechtigungen, die die Automatisierung zum Funktionieren braucht. Wo das Werkzeug es erlaubt, nutzen wir API-Schlüssel oder eigene Benutzer statt Ihres persönlichen Kontos.",
          },
          {
            type: "callout",
            tone: "warning",
            title: "Schicken Sie keine Passwörter per E-Mail oder WhatsApp",
            text: "Für den Austausch von Zugangsdaten nutzen wir einen gemeinsamen Passwort-Tresor. Wenn Sie einen Zugang entziehen möchten, können Sie das jederzeit direkt im Werkzeug tun.",
          },
          { type: "h2", id: "timelines", text: "Zeitrahmen" },
          {
            type: "p",
            text: "Einfache Automatisierungen mit zwei oder drei Werkzeugen sind meist innerhalb weniger Wochen fertig. Projekte mit mehr Integrationen oder eigenem Code dauern länger. Der genaue Zeitplan steht immer im Angebot. Nach der Übergabe lesen Sie die Seite [Konfiguration](/de/docs/process-automation/configuration).",
          },
        ],
      },
      it: {
        title: "Avvio di un progetto di Automazione dei processi",
        description:
          "Guida passo dopo passo a un progetto di automazione con Steevanz: chiamata conoscitiva, mappatura del processo, proposta a prezzo fisso, sviluppo, test e consegna.",
        blocks: [
          {
            type: "p",
            text: "Nell'automazione non c'è un'installazione unica: ogni progetto segue un percorso strutturato che garantisce di costruire la cosa giusta, a un costo concordato fin dall'inizio. Questa pagina descrive ogni fase e ciò che ci serve da voi.",
          },
          { type: "h2", id: "phases", text: "Le fasi del progetto" },
          {
            type: "steps",
            items: [
              { title: "Chiamata conoscitiva", body: "Una chiamata di circa mezz'ora per capire la vostra attività, gli strumenti che usate e i compiti che volete automatizzare. Senza impegno." },
              { title: "Mappatura del processo", body: "Descriviamo il processo attuale passo dopo passo: chi fa cosa, con quali strumenti, con che frequenza e quali eccezioni ci sono. Può essere una seconda chiamata o una condivisione dello schermo mentre svolgete il compito." },
              { title: "Proposta a prezzo fisso", body: "Vi inviamo una proposta con perimetro, integrazioni, tempi, prezzo fisso ed eventuale costo di manutenzione. Andiamo avanti solo con la vostra approvazione." },
              { title: "Accessi", body: "Chiediamo solo gli accessi strettamente necessari agli strumenti coinvolti, condivisi in modo sicuro come descritto più sotto." },
              { title: "Sviluppo", body: "Costruiamo l'automazione e vi teniamo aggiornati sui progressi. Se emerge qualcosa fuori dal perimetro, ne parliamo prima di proseguire." },
              { title: "Test", body: "Testiamo con dati di prova e, quando possibile, in parallelo al processo manuale finché non siamo sicuri che i risultati siano corretti." },
              { title: "Consegna", body: "Attiviamo l'automazione, vi diamo una descrizione semplice di ciò che fa e vi spieghiamo cosa fare se qualcosa va storto." },
            ],
          },
          { type: "h2", id: "what-to-prepare", text: "Cosa preparare" },
          {
            type: "ul",
            items: [
              "L'elenco degli strumenti coinvolti (per esempio software di fatturazione, e-mail, fogli di calcolo, CRM).",
              "Esempi reali del processo: un'e-mail tipo, una fattura, un foglio di calcolo.",
              "Le eccezioni che conoscete: clienti con condizioni particolari, pagamenti parziali, rimborsi.",
              "Una persona di riferimento che conosca bene il processo.",
            ],
          },
          { type: "h2", id: "secure-access", text: "Condividere gli accessi in modo sicuro" },
          {
            type: "p",
            text: "Seguiamo il principio del **privilegio minimo**: chiediamo solo i permessi di cui l'automazione ha bisogno per funzionare. Quando lo strumento lo consente, usiamo chiavi API o utenti dedicati invece del vostro account personale.",
          },
          {
            type: "callout",
            tone: "warning",
            title: "Non inviate password via e-mail o WhatsApp",
            text: "Per scambiare le credenziali usiamo un gestore di password condiviso. Se dovete revocare un accesso, potete farlo in qualsiasi momento nello strumento stesso.",
          },
          { type: "h2", id: "timelines", text: "Tempi" },
          {
            type: "p",
            text: "Le automazioni semplici, con due o tre strumenti, di solito sono pronte in poche settimane. I progetti con più integrazioni o codice su misura richiedono più tempo. I tempi esatti sono sempre nella proposta. Dopo la consegna, consultate la pagina [configurazione](/it/docs/process-automation/configuration).",
          },
        ],
      },
    },
    configuration: {
      pt: {
        title: "Configuração e integrações da Automação de Processos",
        description:
          "Como configuramos as integrações, regras, exceções, monitorização e alertas de erro das suas automações, e o que pode pedir para ajustar depois da entrega.",
        blocks: [
          {
            type: "p",
            text: "Cada automação é configurada à medida, mas há decisões que se repetem em quase todos os projetos. Conhecê-las ajuda a pedir alterações com clareza depois da entrega.",
          },
          {
            type: "h2",
            id: "integracoes",
            text: "Integrações habituais",
          },
          {
            type: "table",
            head: ["Categoria", "Exemplos", "Notas"],
            rows: [
              ["Faturação", "InvoiceXpress, Moloni, Vendus", "Ligação pelas APIs oficiais; os documentos continuam a ser emitidos pelo software certificado"],
              ["Email", "Gmail, Outlook", "Envio de mensagens, leitura de anexos, etiquetas e regras"],
              ["Folhas de cálculo", "Google Sheets", "Registo de dados, relatórios, listas de controlo"],
              ["Mensagens", "WhatsApp", "Lembretes e notificações, respeitando as regras da plataforma e o consentimento dos clientes"],
              ["CRM", "Vários CRMs com API", "Criação e atualização de contactos e oportunidades"],
            ],
          },
          {
            type: "h2",
            id: "regras-excecoes",
            text: "Regras e exceções",
          },
          {
            type: "p",
            text: "Uma automação só é fiável se souber o que fazer quando algo foge ao normal. Na configuração definimos, por exemplo:",
          },
          {
            type: "ul",
            items: [
              "O que acontece se faltar um dado obrigatório, como o NIF do cliente numa fatura.",
              "Se certas situações devem parar a automação e pedir aprovação humana, como valores acima de um limite.",
              "Horários de envio, para não enviar mensagens a clientes a meio da noite.",
              "Como evitar duplicados, por exemplo não emitir duas faturas para o mesmo pagamento.",
            ],
          },
          {
            type: "callout",
            tone: "info",
            title: "Faturação certificada",
            text: "A automação não substitui o software de faturação certificado: limita-se a pedir-lhe que emita os documentos. As regras fiscais continuam a ser aplicadas pelo software e deve validá-las com o seu contabilista.",
          },
          {
            type: "h2",
            id: "monitorizacao",
            text: "Monitorização e alertas de erro",
          },
          {
            type: "p",
            text: "Todas as automações que mantemos têm monitorização. Quando uma execução falha, recebemos um alerta e, se o erro afetar a sua operação, avisamo-lo também. Pode escolher receber os alertas diretamente, por email ou WhatsApp.",
          },
          {
            type: "p",
            text: "Um alerta típico indica a automação afetada, o passo que falhou, o registo em causa (por exemplo, o número da encomenda) e a mensagem de erro da ferramenta. Em processos críticos, como a faturação, podemos também configurar um resumo diário de execuções bem-sucedidas, para ter a certeza de que a automação correu mesmo quando não há erros.",
          },
          {
            type: "h2",
            id: "pedir-alteracoes",
            text: "Pedir alterações",
          },
          {
            type: "p",
            text: "Pequenos ajustes (um texto de email, um destinatário, um horário) são normalmente tratados no âmbito da manutenção. Mudanças maiores, como novas integrações ou novos passos, são orçamentadas à parte, sempre com preço fechado. Veja como acompanhar tudo no dia a dia na página de [utilização](/docs/automacao-processos/utilizacao).",
          },
        ],
      },
      en: {
        title: "Configuration and integrations for Process Automation",
        description:
          "How we configure integrations, rules, exceptions, monitoring and error alerts for your automations, and what you can ask us to adjust after handover.",
        blocks: [
          {
            type: "p",
            text: "Every automation is configured to measure, but some decisions come up in almost every project. Knowing them helps you ask for changes clearly after handover.",
          },
          {
            type: "h2",
            id: "integrations",
            text: "Common integrations",
          },
          {
            type: "table",
            head: ["Category", "Examples", "Notes"],
            rows: [
              ["Invoicing", "InvoiceXpress, Moloni, Vendus", "Connected through their official APIs; documents are still issued by the certified software"],
              ["Email", "Gmail, Outlook", "Sending messages, reading attachments, labels and rules"],
              ["Spreadsheets", "Google Sheets", "Logging data, reports, checklists"],
              ["Messaging", "WhatsApp", "Reminders and notifications, following the platform's rules and customer consent"],
              ["CRM", "Various CRMs with an API", "Creating and updating contacts and deals"],
            ],
          },
          {
            type: "h2",
            id: "rules-exceptions",
            text: "Rules and exceptions",
          },
          {
            type: "p",
            text: "An automation is only reliable if it knows what to do when something is out of the ordinary. During configuration we define, for example:",
          },
          {
            type: "ul",
            items: [
              "What happens if a required field is missing, such as the customer's tax number on an invoice.",
              "Whether certain situations should pause the automation and ask for human approval, such as amounts above a limit.",
              "Sending hours, so customers don't get messages in the middle of the night.",
              "How to avoid duplicates, for example never issuing two invoices for the same payment.",
            ],
          },
          {
            type: "callout",
            tone: "info",
            title: "Certified invoicing",
            text: "The automation doesn't replace your certified invoicing software: it simply asks it to issue documents. Tax rules are still applied by the software and you should check them with your accountant.",
          },
          {
            type: "h2",
            id: "monitoring",
            text: "Monitoring and error alerts",
          },
          {
            type: "p",
            text: "Every automation we maintain is monitored. When a run fails, we get an alert and, if the error affects your operations, we let you know too. You can also choose to receive alerts directly, by email or WhatsApp.",
          },
          {
            type: "p",
            text: "A typical alert names the affected automation, the step that failed, the record involved (for example, the order number) and the error message from the tool. For critical processes such as invoicing, we can also set up a daily summary of successful runs, so you know the automation ran even when there are no errors.",
          },
          {
            type: "h2",
            id: "requesting-changes",
            text: "Requesting changes",
          },
          {
            type: "p",
            text: "Small tweaks (an email wording, a recipient, a schedule) are usually covered by maintenance. Bigger changes, such as new integrations or extra steps, are quoted separately, always at a fixed price. See how to keep track day to day on the [usage](/en/docs/process-automation/usage) page.",
          },
        ],
      },
      es: {
        title: "Configuración e integraciones de la Automatización de procesos",
        description:
          "Cómo configuramos las integraciones, reglas, excepciones, la supervisión y los avisos de error de sus automatizaciones, y qué puede pedirnos que ajustemos después de la entrega.",
        blocks: [
          {
            type: "p",
            text: "Cada automatización se configura a medida, pero hay decisiones que aparecen en casi todos los proyectos. Conocerlas le ayuda a pedir cambios con claridad después de la entrega.",
          },
          { type: "h2", id: "integrations", text: "Integraciones habituales" },
          {
            type: "table",
            head: ["Categoría", "Ejemplos", "Notas"],
            rows: [
              ["Facturación", "InvoiceXpress, Moloni, Vendus", "Conectados mediante sus API oficiales; los documentos los sigue emitiendo el software certificado"],
              ["Correo electrónico", "Gmail, Outlook", "Envío de mensajes, lectura de adjuntos, etiquetas y reglas"],
              ["Hojas de cálculo", "Google Sheets", "Registro de datos, informes, listas de control"],
              ["Mensajería", "WhatsApp", "Recordatorios y notificaciones, respetando las reglas de la plataforma y el consentimiento del cliente"],
              ["CRM", "Distintos CRM con API", "Creación y actualización de contactos y oportunidades"],
            ],
          },
          { type: "h2", id: "rules-exceptions", text: "Reglas y excepciones" },
          {
            type: "p",
            text: "Una automatización solo es fiable si sabe qué hacer cuando algo se sale de lo normal. Durante la configuración definimos, por ejemplo:",
          },
          {
            type: "ul",
            items: [
              "Qué pasa si falta un campo obligatorio, como el número de identificación fiscal del cliente en una factura.",
              "Si ciertas situaciones deben pausar la automatización y pedir aprobación humana, como importes por encima de un límite.",
              "El horario de envío, para que los clientes no reciban mensajes en mitad de la noche.",
              "Cómo evitar duplicados, por ejemplo no emitir nunca dos facturas por el mismo pago.",
            ],
          },
          {
            type: "callout",
            tone: "info",
            title: "Facturación certificada",
            text: "La automatización no sustituye a su software de facturación certificado: solo le pide que emita los documentos. Las reglas fiscales las sigue aplicando el software y conviene revisarlas con su asesor fiscal.",
          },
          { type: "h2", id: "monitoring", text: "Supervisión y avisos de error" },
          {
            type: "p",
            text: "Todas las automatizaciones que mantenemos están supervisadas. Cuando una ejecución falla, recibimos un aviso y, si el error afecta a su operativa, también se lo comunicamos. También puede elegir recibir los avisos directamente, por correo electrónico o WhatsApp.",
          },
          {
            type: "p",
            text: "Un aviso típico indica la automatización afectada, el paso que falló, el registro implicado (por ejemplo, el número de pedido) y el mensaje de error de la herramienta. Para procesos críticos como la facturación, también podemos configurar un resumen diario de las ejecuciones correctas, para que sepa que la automatización funcionó aunque no haya errores.",
          },
          { type: "h2", id: "requesting-changes", text: "Pedir cambios" },
          {
            type: "p",
            text: "Los ajustes pequeños (el texto de un correo, un destinatario, un horario) suelen estar cubiertos por el mantenimiento. Los cambios mayores, como nuevas integraciones o pasos adicionales, se presupuestan aparte, siempre con precio cerrado. Vea cómo hacer el seguimiento en el día a día en la página de [uso](/es/docs/process-automation/usage).",
          },
        ],
      },
      fr: {
        title: "Configuration et intégrations de l'Automatisation des processus",
        description:
          "Comment nous configurons les intégrations, les règles, les exceptions, la surveillance et les alertes d'erreur de vos automatisations, et ce que vous pouvez nous demander d'ajuster après la livraison.",
        blocks: [
          {
            type: "p",
            text: "Chaque automatisation est configurée sur mesure, mais certaines décisions reviennent dans presque tous les projets. Les connaître vous aide à demander des modifications clairement après la livraison.",
          },
          { type: "h2", id: "integrations", text: "Intégrations courantes" },
          {
            type: "table",
            head: ["Catégorie", "Exemples", "Remarques"],
            rows: [
              ["Facturation", "InvoiceXpress, Moloni, Vendus", "Reliés par leurs API officielles ; les documents restent émis par le logiciel certifié"],
              ["E-mail", "Gmail, Outlook", "Envoi de messages, lecture des pièces jointes, libellés et règles"],
              ["Tableurs", "Google Sheets", "Enregistrement de données, rapports, listes de contrôle"],
              ["Messagerie", "WhatsApp", "Rappels et notifications, dans le respect des règles de la plateforme et du consentement des clients"],
              ["CRM", "Divers CRM dotés d'une API", "Création et mise à jour de contacts et d'opportunités"],
            ],
          },
          { type: "h2", id: "rules-exceptions", text: "Règles et exceptions" },
          {
            type: "p",
            text: "Une automatisation n'est fiable que si elle sait quoi faire quand quelque chose sort de l'ordinaire. Pendant la configuration, nous définissons par exemple :",
          },
          {
            type: "ul",
            items: [
              "Ce qui se passe s'il manque un champ obligatoire, comme le numéro fiscal du client sur une facture.",
              "Si certaines situations doivent mettre l'automatisation en pause et demander une validation humaine, comme des montants au-dessus d'un seuil.",
              "Les heures d'envoi, pour que les clients ne reçoivent pas de messages en pleine nuit.",
              "Comment éviter les doublons, par exemple ne jamais émettre deux factures pour le même paiement.",
            ],
          },
          {
            type: "callout",
            tone: "info",
            title: "Facturation certifiée",
            text: "L'automatisation ne remplace pas votre logiciel de facturation certifié : elle lui demande simplement d'émettre les documents. Les règles fiscales restent appliquées par le logiciel et il est conseillé de les vérifier avec votre comptable.",
          },
          { type: "h2", id: "monitoring", text: "Surveillance et alertes d'erreur" },
          {
            type: "p",
            text: "Toutes les automatisations que nous maintenons sont surveillées. Quand une exécution échoue, nous recevons une alerte et, si l'erreur touche votre activité, nous vous prévenons aussi. Vous pouvez aussi choisir de recevoir les alertes directement, par e-mail ou par WhatsApp.",
          },
          {
            type: "p",
            text: "Une alerte type indique l'automatisation concernée, l'étape qui a échoué, l'enregistrement en cause (par exemple le numéro de commande) et le message d'erreur de l'outil. Pour les processus critiques comme la facturation, nous pouvons aussi mettre en place un résumé quotidien des exécutions réussies, pour que vous sachiez que l'automatisation a tourné même sans erreur.",
          },
          { type: "h2", id: "requesting-changes", text: "Demander des modifications" },
          {
            type: "p",
            text: "Les petits ajustements (le texte d'un e-mail, un destinataire, un horaire) sont en général couverts par la maintenance. Les changements plus importants, comme de nouvelles intégrations ou des étapes en plus, font l'objet d'un devis à part, toujours à prix forfaitaire. Voyez comment faire le suivi au quotidien sur la page [utilisation](/fr/docs/process-automation/usage).",
          },
        ],
      },
      de: {
        title: "Konfiguration und Integrationen der Automatisierung",
        description:
          "Wie wir Integrationen, Regeln, Ausnahmen, Überwachung und Fehlermeldungen Ihrer Automatisierungen einrichten und was Sie nach der Übergabe anpassen lassen können.",
        blocks: [
          {
            type: "p",
            text: "Jede Automatisierung wird nach Maß konfiguriert, aber manche Entscheidungen fallen in fast jedem Projekt an. Wenn Sie sie kennen, können Sie nach der Übergabe Änderungen klar anfragen.",
          },
          { type: "h2", id: "integrations", text: "Häufige Integrationen" },
          {
            type: "table",
            head: ["Kategorie", "Beispiele", "Hinweise"],
            rows: [
              ["Rechnungen", "InvoiceXpress, Moloni, Vendus", "Über ihre offiziellen APIs verbunden; die Belege stellt weiterhin die zertifizierte Software aus"],
              ["E-Mail", "Gmail, Outlook", "Nachrichten senden, Anhänge lesen, Labels und Regeln"],
              ["Tabellen", "Google Sheets", "Daten erfassen, Berichte, Checklisten"],
              ["Messaging", "WhatsApp", "Erinnerungen und Benachrichtigungen, unter Einhaltung der Regeln der Plattform und der Einwilligung der Kunden"],
              ["CRM", "Verschiedene CRMs mit API", "Kontakte und Verkaufschancen anlegen und aktualisieren"],
            ],
          },
          { type: "h2", id: "rules-exceptions", text: "Regeln und Ausnahmen" },
          {
            type: "p",
            text: "Eine Automatisierung ist nur zuverlässig, wenn sie weiß, was zu tun ist, wenn etwas aus dem Rahmen fällt. Bei der Konfiguration legen wir zum Beispiel fest:",
          },
          {
            type: "ul",
            items: [
              "Was passiert, wenn ein Pflichtfeld fehlt, etwa die Steuernummer des Kunden auf einer Rechnung.",
              "Ob bestimmte Situationen die Automatisierung anhalten und eine menschliche Freigabe verlangen sollen, etwa Beträge über einer Grenze.",
              "Die Versandzeiten, damit Kunden keine Nachrichten mitten in der Nacht bekommen.",
              "Wie Duplikate vermieden werden, zum Beispiel nie zwei Rechnungen für dieselbe Zahlung.",
            ],
          },
          {
            type: "callout",
            tone: "info",
            title: "Zertifizierte Rechnungsstellung",
            text: "Die Automatisierung ersetzt Ihre zertifizierte Rechnungssoftware nicht: Sie beauftragt sie nur, die Belege auszustellen. Die steuerlichen Regeln wendet weiterhin die Software an, und Sie sollten sie mit Ihrem Steuerberater prüfen.",
          },
          { type: "h2", id: "monitoring", text: "Überwachung und Fehlermeldungen" },
          {
            type: "p",
            text: "Jede Automatisierung, die wir warten, wird überwacht. Schlägt ein Durchlauf fehl, bekommen wir eine Meldung, und wenn der Fehler Ihren Betrieb betrifft, sagen wir auch Ihnen Bescheid. Sie können die Meldungen auch direkt erhalten, per E-Mail oder WhatsApp.",
          },
          {
            type: "p",
            text: "Eine typische Meldung nennt die betroffene Automatisierung, den fehlgeschlagenen Schritt, den betroffenen Datensatz (zum Beispiel die Bestellnummer) und die Fehlermeldung des Werkzeugs. Für kritische Prozesse wie die Rechnungsstellung können wir auch eine tägliche Übersicht der erfolgreichen Durchläufe einrichten, damit Sie wissen, dass die Automatisierung gelaufen ist, auch wenn es keine Fehler gab.",
          },
          { type: "h2", id: "requesting-changes", text: "Änderungen anfragen" },
          {
            type: "p",
            text: "Kleine Anpassungen (der Text einer E-Mail, ein Empfänger, ein Zeitplan) sind meist durch die Wartung abgedeckt. Größere Änderungen, etwa neue Integrationen oder zusätzliche Schritte, werden separat angeboten, immer zum Festpreis. Wie Sie den Alltag im Blick behalten, lesen Sie auf der Seite [Nutzung](/de/docs/process-automation/usage).",
          },
        ],
      },
      it: {
        title: "Configurazione e integrazioni dell'Automazione dei processi",
        description:
          "Come configuriamo integrazioni, regole, eccezioni, monitoraggio e avvisi di errore delle vostre automazioni, e cosa potete chiederci di modificare dopo la consegna.",
        blocks: [
          {
            type: "p",
            text: "Ogni automazione è configurata su misura, ma alcune decisioni ricorrono in quasi tutti i progetti. Conoscerle vi aiuta a chiedere modifiche in modo chiaro dopo la consegna.",
          },
          { type: "h2", id: "integrations", text: "Integrazioni comuni" },
          {
            type: "table",
            head: ["Categoria", "Esempi", "Note"],
            rows: [
              ["Fatturazione", "InvoiceXpress, Moloni, Vendus", "Collegati tramite le loro API ufficiali; i documenti continuano a essere emessi dal software certificato"],
              ["E-mail", "Gmail, Outlook", "Invio di messaggi, lettura degli allegati, etichette e regole"],
              ["Fogli di calcolo", "Google Sheets", "Registrazione di dati, report, checklist"],
              ["Messaggistica", "WhatsApp", "Promemoria e notifiche, nel rispetto delle regole della piattaforma e del consenso dei clienti"],
              ["CRM", "Diversi CRM con API", "Creazione e aggiornamento di contatti e opportunità"],
            ],
          },
          { type: "h2", id: "rules-exceptions", text: "Regole ed eccezioni" },
          {
            type: "p",
            text: "Un'automazione è affidabile solo se sa cosa fare quando qualcosa esce dall'ordinario. Durante la configurazione definiamo, per esempio:",
          },
          {
            type: "ul",
            items: [
              "Cosa succede se manca un campo obbligatorio, come il codice fiscale del cliente su una fattura.",
              "Se certe situazioni devono mettere in pausa l'automazione e chiedere un'approvazione umana, come importi sopra una soglia.",
              "Gli orari di invio, perché i clienti non ricevano messaggi in piena notte.",
              "Come evitare i duplicati, per esempio non emettere mai due fatture per lo stesso pagamento.",
            ],
          },
          {
            type: "callout",
            tone: "info",
            title: "Fatturazione certificata",
            text: "L'automazione non sostituisce il vostro software di fatturazione certificato: gli chiede soltanto di emettere i documenti. Le regole fiscali continuano ad essere applicate dal software ed è bene verificarle con il vostro commercialista.",
          },
          { type: "h2", id: "monitoring", text: "Monitoraggio e avvisi di errore" },
          {
            type: "p",
            text: "Ogni automazione che manteniamo è monitorata. Quando un'esecuzione fallisce, riceviamo un avviso e, se l'errore tocca la vostra operatività, ve lo comunichiamo anche noi. Potete anche scegliere di ricevere gli avvisi direttamente, via e-mail o WhatsApp.",
          },
          {
            type: "p",
            text: "Un avviso tipico indica l'automazione coinvolta, il passaggio fallito, il record interessato (per esempio il numero d'ordine) e il messaggio di errore dello strumento. Per i processi critici come la fatturazione, possiamo anche impostare un riepilogo giornaliero delle esecuzioni riuscite, così sapete che l'automazione ha girato anche quando non ci sono errori.",
          },
          { type: "h2", id: "requesting-changes", text: "Chiedere modifiche" },
          {
            type: "p",
            text: "Le piccole modifiche (il testo di un'e-mail, un destinatario, un orario) di solito rientrano nella manutenzione. I cambiamenti più grandi, come nuove integrazioni o passaggi in più, si preventivano a parte, sempre a prezzo fisso. Vedete come seguire il lavoro di ogni giorno nella pagina [utilizzo](/it/docs/process-automation/usage).",
          },
        ],
      },
    },
    usage: {
      pt: {
        title: "Utilização diária da Automação de Processos",
        description:
          "Como acompanhar as suas automações no dia a dia: verificar resultados, tratar exceções, perceber a manutenção e o que acontece quando uma ferramenta muda.",
        blocks: [
          {
            type: "p",
            text: "Uma boa automação trabalha em segundo plano e quase não se nota. Ainda assim, vale a pena saber como confirmar que está tudo a correr bem e como agir quando surge uma exceção.",
          },
          {
            type: "h2",
            id: "verificar-resultados",
            text: "Verificar resultados",
          },
          {
            type: "ul",
            items: [
              "Nas primeiras semanas, confira por amostragem alguns resultados: faturas emitidas, mensagens enviadas, linhas registadas.",
              "Se a automação gera um relatório diário, use-o como verificação rápida de que tudo correu.",
              "Mantenha um registo simples das situações estranhas que notar e envie-nos de uma vez.",
            ],
          },
          {
            type: "h2",
            id: "excecoes",
            text: "Tratar exceções",
          },
          {
            type: "p",
            text: "Quando a automação encontra um caso que não sabe resolver, segue a regra definida na configuração: normalmente para esse caso e avisa-o. Trate-o manualmente e, se voltar a acontecer, diga-nos para acrescentarmos uma regra.",
          },
          {
            type: "h2",
            id: "mudancas-ferramentas",
            text: "Quando uma ferramenta muda",
          },
          {
            type: "p",
            text: "Os fornecedores de software alteram periodicamente as suas APIs, mudam planos ou descontinuam funcionalidades. Com um plano de manutenção, acompanhamos estes avisos e adaptamos a automação, na maior parte dos casos antes de haver impacto. Mudanças profundas, como a troca de software de faturação, são tratadas como um novo pedido orçamentado.",
          },
          {
            type: "callout",
            tone: "warning",
            title: "Avise-nos antes de mudar",
            text: "Se for mudar de software, alterar a palavra-passe de uma conta usada pela automação ou reorganizar uma folha de cálculo (renomear colunas ou separadores), fale connosco antes. São as causas mais frequentes de falhas.",
          },
          {
            type: "h2",
            id: "manutencao",
            text: "O que inclui a manutenção",
          },
          {
            type: "table",
            head: ["Incluído", "Orçamentado à parte"],
            rows: [
              ["Monitorização e resposta a erros", "Novas automações ou novos passos"],
              ["Adaptação a alterações de API", "Mudança de uma ferramenta por outra"],
              ["Pequenos ajustes de texto, horários e destinatários", "Integração de novas ferramentas"],
            ],
          },
          {
            type: "p",
            text: "O âmbito exato depende do plano acordado na proposta.",
          },
          {
            type: "h2",
            id: "equipa",
            text: "Envolver a equipa",
          },
          {
            type: "p",
            text: "Explique à equipa o que passou a ser automático, para que ninguém repita a tarefa à mão por hábito. Indique também quem recebe os alertas e quem trata as exceções. Quando alguém sai ou entra na equipa, reveja se os acessos e os destinatários dos alertas continuam corretos e avise-nos se for preciso mudar algo. Se algo parar, consulte a [resolução de problemas](/docs/automacao-processos/resolucao-problemas).",
          },
        ],
      },
      en: {
        title: "Using Process Automation day to day",
        description:
          "How to keep track of your automations day to day: checking results, handling exceptions, understanding maintenance and what happens when a tool changes.",
        blocks: [
          {
            type: "p",
            text: "A good automation works in the background and is barely noticed. Even so, it's worth knowing how to confirm everything is running smoothly and what to do when an exception comes up.",
          },
          {
            type: "h2",
            id: "checking-results",
            text: "Checking results",
          },
          {
            type: "ul",
            items: [
              "In the first few weeks, spot-check some results: invoices issued, messages sent, rows logged.",
              "If the automation produces a daily report, use it as a quick check that everything ran.",
              "Keep a simple note of anything odd you notice and send it to us in one go.",
            ],
          },
          {
            type: "h2",
            id: "exceptions",
            text: "Handling exceptions",
          },
          {
            type: "p",
            text: "When the automation meets a case it can't handle, it follows the rule set during configuration: usually it pauses that case and alerts you. Deal with it manually and, if it happens again, tell us so we can add a rule.",
          },
          {
            type: "h2",
            id: "tool-changes",
            text: "When a tool changes",
          },
          {
            type: "p",
            text: "Software vendors regularly change their APIs, alter plans or retire features. With a maintenance plan, we keep track of these notices and adapt the automation, in most cases before there's any impact. Major changes, such as switching invoicing software, are handled as a new quoted request.",
          },
          {
            type: "callout",
            tone: "warning",
            title: "Tell us before you change things",
            text: "If you're switching software, changing the password of an account the automation uses or restructuring a spreadsheet (renaming columns or tabs), talk to us first. These are the most common causes of failures.",
          },
          {
            type: "h2",
            id: "maintenance",
            text: "What maintenance covers",
          },
          {
            type: "table",
            head: ["Included", "Quoted separately"],
            rows: [
              ["Monitoring and responding to errors", "New automations or extra steps"],
              ["Adapting to API changes", "Replacing one tool with another"],
              ["Small tweaks to wording, schedules and recipients", "Integrating new tools"],
            ],
          },
          {
            type: "p",
            text: "The exact scope depends on the plan agreed in the proposal.",
          },
          {
            type: "h2",
            id: "team",
            text: "Bringing your team along",
          },
          {
            type: "p",
            text: "Tell your team what is now automatic, so nobody keeps doing the task by hand out of habit. Make it clear who receives alerts and who handles exceptions. When someone joins or leaves, check that access and alert recipients are still right and let us know if anything needs changing. If something stops working, see [troubleshooting](/en/docs/process-automation/troubleshooting).",
          },
        ],
      },
      es: {
        title: "La Automatización de procesos en el día a día",
        description:
          "Cómo seguir sus automatizaciones en el día a día: comprobar resultados, gestionar excepciones, entender el mantenimiento y qué pasa cuando cambia una herramienta.",
        blocks: [
          {
            type: "p",
            text: "Una buena automatización trabaja en segundo plano y apenas se nota. Aun así, conviene saber cómo confirmar que todo va bien y qué hacer cuando surge una excepción.",
          },
          { type: "h2", id: "checking-results", text: "Comprobar resultados" },
          {
            type: "ul",
            items: [
              "Durante las primeras semanas, revise algunos resultados al azar: facturas emitidas, mensajes enviados, filas registradas.",
              "Si la automatización genera un informe diario, úselo como comprobación rápida de que todo se ejecutó.",
              "Anote de forma sencilla cualquier cosa extraña que vea y envíenosla toda de una vez.",
            ],
          },
          { type: "h2", id: "exceptions", text: "Gestionar excepciones" },
          {
            type: "p",
            text: "Cuando la automatización encuentra un caso que no sabe resolver, sigue la regla definida en la configuración: normalmente pausa ese caso y le avisa. Resuélvalo a mano y, si vuelve a pasar, díganoslo para que añadamos una regla.",
          },
          { type: "h2", id: "tool-changes", text: "Cuando cambia una herramienta" },
          {
            type: "p",
            text: "Los proveedores de software cambian con frecuencia sus API, modifican planes o retiran funciones. Con un plan de mantenimiento, seguimos esos avisos y adaptamos la automatización, en la mayoría de los casos antes de que haya ningún impacto. Los cambios importantes, como cambiar de software de facturación, se tratan como una nueva solicitud con presupuesto.",
          },
          {
            type: "callout",
            tone: "warning",
            title: "Avísenos antes de cambiar algo",
            text: "Si va a cambiar de software, cambiar la contraseña de una cuenta que usa la automatización o reorganizar una hoja de cálculo (renombrar columnas o pestañas), háblelo antes con nosotros. Son las causas de fallo más habituales.",
          },
          { type: "h2", id: "maintenance", text: "Qué cubre el mantenimiento" },
          {
            type: "table",
            head: ["Incluido", "Presupuestado aparte"],
            rows: [
              ["Supervisión y respuesta a errores", "Nuevas automatizaciones o pasos adicionales"],
              ["Adaptación a cambios de API", "Sustituir una herramienta por otra"],
              ["Pequeños ajustes de textos, horarios y destinatarios", "Integrar herramientas nuevas"],
            ],
          },
          {
            type: "p",
            text: "El alcance exacto depende del plan acordado en la propuesta.",
          },
          { type: "h2", id: "team", text: "Implicar a su equipo" },
          {
            type: "p",
            text: "Explique a su equipo lo que ahora es automático, para que nadie siga haciendo la tarea a mano por costumbre. Deje claro quién recibe los avisos y quién gestiona las excepciones. Cuando alguien entra o sale, compruebe que los accesos y los destinatarios de los avisos siguen siendo los correctos y avísenos si hay que cambiar algo. Si algo deja de funcionar, consulte la [solución de problemas](/es/docs/process-automation/troubleshooting).",
          },
        ],
      },
      fr: {
        title: "L'Automatisation des processus au quotidien",
        description:
          "Comment suivre vos automatisations au quotidien : vérifier les résultats, gérer les exceptions, comprendre la maintenance et ce qui se passe quand un outil change.",
        blocks: [
          {
            type: "p",
            text: "Une bonne automatisation travaille en arrière-plan et se fait à peine remarquer. Il est tout de même utile de savoir confirmer que tout se passe bien et quoi faire quand une exception survient.",
          },
          { type: "h2", id: "checking-results", text: "Vérifier les résultats" },
          {
            type: "ul",
            items: [
              "Pendant les premières semaines, contrôlez quelques résultats au hasard : factures émises, messages envoyés, lignes enregistrées.",
              "Si l'automatisation produit un rapport quotidien, servez-vous-en comme vérification rapide que tout a tourné.",
              "Notez simplement tout ce qui vous paraît bizarre et envoyez-nous le tout en une fois.",
            ],
          },
          { type: "h2", id: "exceptions", text: "Gérer les exceptions" },
          {
            type: "p",
            text: "Quand l'automatisation rencontre un cas qu'elle ne sait pas traiter, elle suit la règle définie lors de la configuration : en général, elle met ce cas en pause et vous prévient. Traitez-le à la main et, si cela se reproduit, dites-le-nous pour que nous ajoutions une règle.",
          },
          { type: "h2", id: "tool-changes", text: "Quand un outil change" },
          {
            type: "p",
            text: "Les éditeurs de logiciels modifient régulièrement leurs API, changent leurs offres ou retirent des fonctions. Avec un plan de maintenance, nous suivons ces annonces et adaptons l'automatisation, dans la plupart des cas avant tout impact. Les changements majeurs, comme passer à un autre logiciel de facturation, sont traités comme une nouvelle demande sur devis.",
          },
          {
            type: "callout",
            tone: "warning",
            title: "Prévenez-nous avant de changer quelque chose",
            text: "Si vous changez de logiciel, modifiez le mot de passe d'un compte utilisé par l'automatisation ou réorganisez un tableur (en renommant des colonnes ou des onglets), parlez-nous-en d'abord. Ce sont les causes de panne les plus fréquentes.",
          },
          { type: "h2", id: "maintenance", text: "Ce que couvre la maintenance" },
          {
            type: "table",
            head: ["Inclus", "Sur devis à part"],
            rows: [
              ["Surveillance et réponse aux erreurs", "Nouvelles automatisations ou étapes supplémentaires"],
              ["Adaptation aux changements d'API", "Remplacement d'un outil par un autre"],
              ["Petits ajustements de textes, d'horaires et de destinataires", "Intégration de nouveaux outils"],
            ],
          },
          {
            type: "p",
            text: "Le périmètre exact dépend de l'offre convenue dans la proposition.",
          },
          { type: "h2", id: "team", text: "Embarquer votre équipe" },
          {
            type: "p",
            text: "Expliquez à votre équipe ce qui est désormais automatique, pour que personne ne continue à faire la tâche à la main par habitude. Précisez qui reçoit les alertes et qui gère les exceptions. Quand quelqu'un arrive ou part, vérifiez que les accès et les destinataires des alertes sont toujours les bons et prévenez-nous s'il faut changer quelque chose. Si quelque chose ne fonctionne plus, consultez la page [résolution de problèmes](/fr/docs/process-automation/troubleshooting).",
          },
        ],
      },
      de: {
        title: "Die Automatisierung im Alltag",
        description:
          "Wie Sie Ihre Automatisierungen im Alltag im Blick behalten: Ergebnisse prüfen, Ausnahmen bearbeiten, die Wartung verstehen und was passiert, wenn sich ein Werkzeug ändert.",
        blocks: [
          {
            type: "p",
            text: "Eine gute Automatisierung arbeitet im Hintergrund und fällt kaum auf. Trotzdem lohnt es sich zu wissen, wie Sie prüfen, ob alles rund läuft, und was zu tun ist, wenn eine Ausnahme auftritt.",
          },
          { type: "h2", id: "checking-results", text: "Ergebnisse prüfen" },
          {
            type: "ul",
            items: [
              "Prüfen Sie in den ersten Wochen stichprobenartig einige Ergebnisse: ausgestellte Rechnungen, verschickte Nachrichten, erfasste Zeilen.",
              "Erstellt die Automatisierung einen täglichen Bericht, nutzen Sie ihn als schnelle Kontrolle, dass alles gelaufen ist.",
              "Notieren Sie einfach alles, was Ihnen seltsam vorkommt, und schicken Sie es uns gesammelt.",
            ],
          },
          { type: "h2", id: "exceptions", text: "Ausnahmen bearbeiten" },
          {
            type: "p",
            text: "Trifft die Automatisierung auf einen Fall, den sie nicht lösen kann, folgt sie der Regel aus der Konfiguration: Meist hält sie diesen Fall an und benachrichtigt Sie. Erledigen Sie ihn von Hand, und wenn er wieder vorkommt, sagen Sie uns Bescheid, damit wir eine Regel ergänzen.",
          },
          { type: "h2", id: "tool-changes", text: "Wenn sich ein Werkzeug ändert" },
          {
            type: "p",
            text: "Softwareanbieter ändern regelmäßig ihre APIs, passen Tarife an oder stellen Funktionen ein. Mit einem Wartungsplan verfolgen wir diese Ankündigungen und passen die Automatisierung an, meist bevor es Auswirkungen gibt. Größere Änderungen, etwa der Wechsel der Rechnungssoftware, werden als neue Anfrage mit Angebot behandelt.",
          },
          {
            type: "callout",
            tone: "warning",
            title: "Sagen Sie uns Bescheid, bevor Sie etwas ändern",
            text: "Wenn Sie die Software wechseln, das Passwort eines Kontos ändern, das die Automatisierung nutzt, oder eine Tabelle umbauen (Spalten oder Reiter umbenennen), sprechen Sie vorher mit uns. Das sind die häufigsten Ursachen für Ausfälle.",
          },
          { type: "h2", id: "maintenance", text: "Was die Wartung abdeckt" },
          {
            type: "table",
            head: ["Enthalten", "Separat angeboten"],
            rows: [
              ["Überwachung und Reaktion auf Fehler", "Neue Automatisierungen oder zusätzliche Schritte"],
              ["Anpassung an API-Änderungen", "Ersatz eines Werkzeugs durch ein anderes"],
              ["Kleine Anpassungen an Texten, Zeitplänen und Empfängern", "Integration neuer Werkzeuge"],
            ],
          },
          {
            type: "p",
            text: "Der genaue Umfang hängt vom im Angebot vereinbarten Plan ab.",
          },
          { type: "h2", id: "team", text: "Ihr Team einbeziehen" },
          {
            type: "p",
            text: "Sagen Sie Ihrem Team, was jetzt automatisch läuft, damit niemand die Aufgabe aus Gewohnheit weiter von Hand erledigt. Legen Sie klar fest, wer die Meldungen bekommt und wer die Ausnahmen bearbeitet. Wenn jemand neu dazukommt oder geht, prüfen Sie, ob Zugänge und Empfänger der Meldungen noch stimmen, und sagen Sie uns Bescheid, wenn etwas geändert werden muss. Wenn etwas nicht mehr funktioniert, lesen Sie die [Fehlerbehebung](/de/docs/process-automation/troubleshooting).",
          },
        ],
      },
      it: {
        title: "L'Automazione dei processi ogni giorno",
        description:
          "Come seguire le vostre automazioni ogni giorno: verificare i risultati, gestire le eccezioni, capire la manutenzione e cosa succede quando cambia uno strumento.",
        blocks: [
          {
            type: "p",
            text: "Una buona automazione lavora in sottofondo e quasi non si nota. Conviene comunque sapere come verificare che tutto vada bene e cosa fare quando si presenta un'eccezione.",
          },
          { type: "h2", id: "checking-results", text: "Verificare i risultati" },
          {
            type: "ul",
            items: [
              "Nelle prime settimane, controllate a campione alcuni risultati: fatture emesse, messaggi inviati, righe registrate.",
              "Se l'automazione produce un report giornaliero, usatelo come controllo rapido che tutto abbia girato.",
              "Annotate semplicemente qualsiasi cosa strana notiate e inviatecela tutta insieme.",
            ],
          },
          { type: "h2", id: "exceptions", text: "Gestire le eccezioni" },
          {
            type: "p",
            text: "Quando l'automazione incontra un caso che non sa gestire, segue la regola definita in configurazione: di solito mette in pausa quel caso e vi avvisa. Gestitelo a mano e, se ricapita, ditecelo così aggiungiamo una regola.",
          },
          { type: "h2", id: "tool-changes", text: "Quando cambia uno strumento" },
          {
            type: "p",
            text: "I fornitori di software cambiano spesso le loro API, modificano i piani o ritirano funzioni. Con un piano di manutenzione, seguiamo questi annunci e adattiamo l'automazione, nella maggior parte dei casi prima che ci sia un impatto. I cambiamenti importanti, come passare a un altro software di fatturazione, si trattano come una nuova richiesta con preventivo.",
          },
          {
            type: "callout",
            tone: "warning",
            title: "Avvisateci prima di cambiare qualcosa",
            text: "Se cambiate software, modificate la password di un account usato dall'automazione o riorganizzate un foglio di calcolo (rinominando colonne o schede), parlatene prima con noi. Sono le cause di guasto più frequenti.",
          },
          { type: "h2", id: "maintenance", text: "Cosa copre la manutenzione" },
          {
            type: "table",
            head: ["Incluso", "Preventivato a parte"],
            rows: [
              ["Monitoraggio e risposta agli errori", "Nuove automazioni o passaggi in più"],
              ["Adattamento ai cambiamenti delle API", "Sostituzione di uno strumento con un altro"],
              ["Piccole modifiche a testi, orari e destinatari", "Integrazione di nuovi strumenti"],
            ],
          },
          {
            type: "p",
            text: "Il perimetro esatto dipende dal piano concordato nella proposta.",
          },
          { type: "h2", id: "team", text: "Coinvolgere il vostro team" },
          {
            type: "p",
            text: "Spiegate al vostro team cosa ora è automatico, perché nessuno continui a fare il compito a mano per abitudine. Chiarite chi riceve gli avvisi e chi gestisce le eccezioni. Quando qualcuno entra o esce, verificate che accessi e destinatari degli avvisi siano ancora giusti e avvisateci se c'è da cambiare qualcosa. Se qualcosa smette di funzionare, consultate la [risoluzione dei problemi](/it/docs/process-automation/troubleshooting).",
          },
        ],
      },
    },
    troubleshooting: {
      pt: {
        title: "Resolução de problemas da Automação de Processos",
        description:
          "O que fazer quando uma automação falha: acessos expirados, folhas de cálculo alteradas, duplicados, mensagens não enviadas e erros no software de faturação.",
        blocks: [
          {
            type: "p",
            text: "Com monitorização ativa, muitas falhas são detetadas por nós antes de as notar. Se encontrar um problema, os pontos abaixo ajudam a perceber a causa. Em caso de dúvida, [contacte-nos](/contacto) com a data, a hora e um exemplo do que falhou.",
          },
          {
            type: "h2",
            id: "parou",
            text: "A automação deixou de funcionar",
          },
          {
            type: "steps",
            items: [
              {
                title: "Pense no que mudou",
                body: "Houve alteração de palavra-passe, mudança de plano numa ferramenta, saída de um utilizador ou reorganização de uma folha de cálculo? Estas são as causas mais comuns.",
              },
              {
                title: "Verifique os acessos",
                body: "Algumas ligações expiram e precisam de ser autorizadas de novo, sobretudo em contas Google e Microsoft. Se recebeu um aviso da ferramenta, reencaminhe-nos.",
              },
              {
                title: "Trate os casos pendentes manualmente",
                body: "Enquanto resolvemos, faça manualmente as tarefas urgentes, como emitir uma fatura, e anote o que fez para evitar duplicados.",
              },
              {
                title: "Avise-nos",
                body: "Envie-nos uma mensagem com o que observou. Verificamos o histórico de execuções e corrigimos.",
              },
            ],
          },
          {
            type: "h2",
            id: "duplicados",
            text: "Há registos ou faturas duplicados",
          },
          {
            type: "p",
            text: "Pode acontecer quando o mesmo evento chega duas vezes (por exemplo, um pagamento notificado em duplicado) ou quando alguém fez manualmente o que a automação também fez. Não anule documentos fiscais sem falar com o seu contabilista; avise-nos para reforçarmos a verificação de duplicados.",
          },
          {
            type: "h2",
            id: "mensagens",
            text: "As mensagens não chegam aos clientes",
          },
          {
            type: "ul",
            items: [
              "Confirme se o contacto do cliente está correto e completo, com indicativo no caso do WhatsApp.",
              "Emails automáticos podem ir para o spam do destinatário; peça ao cliente para verificar.",
              "No WhatsApp, as regras da plataforma limitam certas mensagens iniciadas pela empresa; ajustamos modelos e horários se for o caso.",
            ],
          },
          {
            type: "h2",
            id: "erro-faturacao",
            text: "Erros no software de faturação",
          },
          {
            type: "p",
            text: "Erros como NIF inválido, série inexistente ou taxa de IVA em falta vêm normalmente dos dados de origem ou da configuração do software de faturação. Corrija o dado na origem quando possível e informe-nos para acrescentarmos uma validação.",
          },
          {
            type: "callout",
            tone: "tip",
            text: "Guarde uma captura de ecrã da mensagem de erro. Poupa muito tempo no diagnóstico.",
          },
        ],
      },
      en: {
        title: "Troubleshooting Process Automation",
        description:
          "What to do when an automation fails: expired access, changed spreadsheets, duplicates, messages not sent and errors reported by your invoicing software.",
        blocks: [
          {
            type: "p",
            text: "With active monitoring, we catch many failures before you notice them. If you run into a problem, the points below help pin down the cause. If in doubt, [contact us](/en/contact) with the date, time and an example of what failed.",
          },
          {
            type: "h2",
            id: "stopped",
            text: "The automation has stopped working",
          },
          {
            type: "steps",
            items: [
              {
                title: "Think about what changed",
                body: "Has a password changed, a tool's plan been altered, a user left or a spreadsheet been restructured? These are the most common causes.",
              },
              {
                title: "Check access",
                body: "Some connections expire and need re-authorising, especially Google and Microsoft accounts. If you received a notice from the tool, forward it to us.",
              },
              {
                title: "Handle pending cases manually",
                body: "While we fix it, do urgent tasks by hand, such as issuing an invoice, and note what you did to avoid duplicates.",
              },
              {
                title: "Let us know",
                body: "Send us a message with what you saw. We check the run history and fix it.",
              },
            ],
          },
          {
            type: "h2",
            id: "duplicates",
            text: "There are duplicate records or invoices",
          },
          {
            type: "p",
            text: "This can happen when the same event arrives twice (for example, a payment notified twice) or when someone did by hand what the automation also did. Don't cancel tax documents without speaking to your accountant; let us know so we can strengthen the duplicate check.",
          },
          {
            type: "h2",
            id: "messages",
            text: "Messages aren't reaching customers",
          },
          {
            type: "ul",
            items: [
              "Check the customer's contact details are correct and complete, including the country code for WhatsApp.",
              "Automated emails can land in the recipient's spam; ask the customer to check.",
              "On WhatsApp, platform rules limit some business-initiated messages; we adjust templates and timing if needed.",
            ],
          },
          {
            type: "h2",
            id: "invoicing-errors",
            text: "Errors from the invoicing software",
          },
          {
            type: "p",
            text: "Errors such as an invalid tax number, a missing document series or a missing VAT rate usually come from the source data or the invoicing software's settings. Fix the data at source where possible and tell us so we can add a validation.",
          },
          {
            type: "callout",
            tone: "tip",
            text: "Take a screenshot of the error message. It saves a lot of time when diagnosing.",
          },
        ],
      },
      es: {
        title: "Solución de problemas de la Automatización de procesos",
        description:
          "Qué hacer cuando una automatización falla: accesos caducados, hojas de cálculo modificadas, duplicados, mensajes no enviados y errores del software de facturación.",
        blocks: [
          {
            type: "p",
            text: "Con la supervisión activa, detectamos muchos fallos antes de que usted los note. Si se encuentra con un problema, los puntos siguientes le ayudan a localizar la causa. Si tiene dudas, [contacte con nosotros](/es/contact) indicando la fecha, la hora y un ejemplo de lo que falló.",
          },
          { type: "h2", id: "stopped", text: "La automatización ha dejado de funcionar" },
          {
            type: "steps",
            items: [
              { title: "Piense en qué ha cambiado", body: "¿Ha cambiado una contraseña, se ha modificado el plan de una herramienta, se ha ido un usuario o se ha reorganizado una hoja de cálculo? Son las causas más habituales." },
              { title: "Compruebe los accesos", body: "Algunas conexiones caducan y hay que volver a autorizarlas, sobre todo las cuentas de Google y Microsoft. Si ha recibido un aviso de la herramienta, reenvíenoslo." },
              { title: "Resuelva a mano lo pendiente", body: "Mientras lo arreglamos, haga a mano las tareas urgentes, como emitir una factura, y anote lo que ha hecho para evitar duplicados." },
              { title: "Avísenos", body: "Envíenos un mensaje con lo que ha visto. Revisamos el historial de ejecuciones y lo arreglamos." },
            ],
          },
          { type: "h2", id: "duplicates", text: "Hay registros o facturas duplicados" },
          {
            type: "p",
            text: "Puede pasar cuando el mismo evento llega dos veces (por ejemplo, un pago notificado dos veces) o cuando alguien hizo a mano lo que la automatización también hizo. No anule documentos fiscales sin hablar con su asesor fiscal; avísenos para que reforcemos el control de duplicados.",
          },
          { type: "h2", id: "messages", text: "Los mensajes no llegan a los clientes" },
          {
            type: "ul",
            items: [
              "Compruebe que los datos de contacto del cliente son correctos y completos, incluido el prefijo del país para WhatsApp.",
              "Los correos automáticos pueden acabar en el spam del destinatario; pida al cliente que lo revise.",
              "En WhatsApp, las reglas de la plataforma limitan algunos mensajes iniciados por la empresa; si hace falta, ajustamos las plantillas y los horarios.",
            ],
          },
          { type: "h2", id: "invoicing-errors", text: "Errores del software de facturación" },
          {
            type: "p",
            text: "Errores como un número de identificación fiscal no válido, una serie de documentos inexistente o un tipo de IVA que falta suelen venir de los datos de origen o de la configuración del software de facturación. Corrija los datos en el origen siempre que pueda y díganoslo para que añadamos una validación.",
          },
          {
            type: "callout",
            tone: "tip",
            text: "Haga una captura de pantalla del mensaje de error. Ahorra mucho tiempo en el diagnóstico.",
          },
        ],
      },
      fr: {
        title: "Résoudre les problèmes de l'Automatisation des processus",
        description:
          "Que faire quand une automatisation échoue : accès expirés, tableurs modifiés, doublons, messages non envoyés et erreurs signalées par votre logiciel de facturation.",
        blocks: [
          {
            type: "p",
            text: "Grâce à la surveillance active, nous repérons beaucoup de pannes avant que vous ne les remarquiez. Si vous rencontrez un problème, les points ci-dessous aident à en trouver la cause. En cas de doute, [contactez-nous](/fr/contact) en indiquant la date, l'heure et un exemple de ce qui a échoué.",
          },
          { type: "h2", id: "stopped", text: "L'automatisation ne fonctionne plus" },
          {
            type: "steps",
            items: [
              { title: "Pensez à ce qui a changé", body: "Un mot de passe a-t-il changé, l'offre d'un outil a-t-elle été modifiée, un utilisateur est-il parti ou un tableur a-t-il été réorganisé ? Ce sont les causes les plus fréquentes." },
              { title: "Vérifiez les accès", body: "Certaines connexions expirent et doivent être autorisées à nouveau, surtout les comptes Google et Microsoft. Si vous avez reçu un avis de l'outil, transférez-le-nous." },
              { title: "Traitez les cas en attente à la main", body: "Pendant que nous réparons, faites à la main les tâches urgentes, comme émettre une facture, et notez ce que vous avez fait pour éviter les doublons." },
              { title: "Prévenez-nous", body: "Envoyez-nous un message avec ce que vous avez constaté. Nous vérifions l'historique des exécutions et corrigeons." },
            ],
          },
          { type: "h2", id: "duplicates", text: "Il y a des enregistrements ou des factures en double" },
          {
            type: "p",
            text: "Cela peut arriver quand le même événement arrive deux fois (par exemple un paiement notifié deux fois) ou quand quelqu'un a fait à la main ce que l'automatisation a aussi fait. N'annulez pas de documents fiscaux sans en parler à votre comptable ; prévenez-nous pour que nous renforcions le contrôle des doublons.",
          },
          { type: "h2", id: "messages", text: "Les messages n'arrivent pas aux clients" },
          {
            type: "ul",
            items: [
              "Vérifiez que les coordonnées du client sont correctes et complètes, y compris l'indicatif du pays pour WhatsApp.",
              "Les e-mails automatiques peuvent arriver dans les spams du destinataire ; demandez au client de vérifier.",
              "Sur WhatsApp, les règles de la plateforme limitent certains messages envoyés à l'initiative de l'entreprise ; nous ajustons les modèles et les horaires si nécessaire.",
            ],
          },
          { type: "h2", id: "invoicing-errors", text: "Erreurs du logiciel de facturation" },
          {
            type: "p",
            text: "Des erreurs comme un numéro fiscal invalide, une série de documents manquante ou un taux de TVA absent viennent en général des données d'origine ou des réglages du logiciel de facturation. Corrigez les données à la source quand c'est possible et dites-le-nous pour que nous ajoutions une validation.",
          },
          {
            type: "callout",
            tone: "tip",
            text: "Faites une capture d'écran du message d'erreur. Cela fait gagner beaucoup de temps pour le diagnostic.",
          },
        ],
      },
      de: {
        title: "Fehlerbehebung bei der Automatisierung",
        description:
          "Was zu tun ist, wenn eine Automatisierung fehlschlägt: abgelaufene Zugänge, geänderte Tabellen, Duplikate, nicht verschickte Nachrichten und Fehler Ihrer Rechnungssoftware.",
        blocks: [
          {
            type: "p",
            text: "Dank aktiver Überwachung erkennen wir viele Ausfälle, bevor Sie sie bemerken. Wenn Sie auf ein Problem stoßen, helfen die folgenden Punkte, die Ursache einzugrenzen. Im Zweifel [kontaktieren Sie uns](/de/contact) mit Datum, Uhrzeit und einem Beispiel dessen, was fehlgeschlagen ist.",
          },
          { type: "h2", id: "stopped", text: "Die Automatisierung funktioniert nicht mehr" },
          {
            type: "steps",
            items: [
              { title: "Überlegen Sie, was sich geändert hat", body: "Wurde ein Passwort geändert, der Tarif eines Werkzeugs angepasst, hat ein Benutzer das Team verlassen oder wurde eine Tabelle umgebaut? Das sind die häufigsten Ursachen." },
              { title: "Prüfen Sie die Zugänge", body: "Manche Verbindungen laufen ab und müssen neu autorisiert werden, vor allem Google- und Microsoft-Konten. Wenn Sie eine Mitteilung des Werkzeugs bekommen haben, leiten Sie sie an uns weiter." },
              { title: "Erledigen Sie Offenes von Hand", body: "Während wir es beheben, erledigen Sie dringende Aufgaben von Hand, etwa eine Rechnung ausstellen, und notieren Sie, was Sie getan haben, um Duplikate zu vermeiden." },
              { title: "Sagen Sie uns Bescheid", body: "Schicken Sie uns eine Nachricht mit dem, was Sie gesehen haben. Wir prüfen den Verlauf der Durchläufe und beheben den Fehler." },
            ],
          },
          { type: "h2", id: "duplicates", text: "Es gibt doppelte Datensätze oder Rechnungen" },
          {
            type: "p",
            text: "Das kann passieren, wenn dasselbe Ereignis zweimal ankommt (zum Beispiel eine zweimal gemeldete Zahlung) oder wenn jemand von Hand erledigt hat, was auch die Automatisierung getan hat. Stornieren Sie keine Steuerbelege, ohne mit Ihrem Steuerberater zu sprechen; sagen Sie uns Bescheid, damit wir die Duplikatprüfung verstärken.",
          },
          { type: "h2", id: "messages", text: "Nachrichten kommen bei den Kunden nicht an" },
          {
            type: "ul",
            items: [
              "Prüfen Sie, ob die Kontaktdaten des Kunden richtig und vollständig sind, einschließlich der Ländervorwahl für WhatsApp.",
              "Automatische E-Mails können im Spam des Empfängers landen; bitten Sie den Kunden, dort nachzusehen.",
              "Bei WhatsApp begrenzen die Regeln der Plattform manche Nachrichten, die das Unternehmen von sich aus schickt; bei Bedarf passen wir Vorlagen und Zeiten an.",
            ],
          },
          { type: "h2", id: "invoicing-errors", text: "Fehler der Rechnungssoftware" },
          {
            type: "p",
            text: "Fehler wie eine ungültige Steuernummer, eine fehlende Belegserie oder ein fehlender MwSt.-Satz kommen meist aus den Ausgangsdaten oder den Einstellungen der Rechnungssoftware. Korrigieren Sie die Daten möglichst an der Quelle und sagen Sie uns Bescheid, damit wir eine Prüfung ergänzen.",
          },
          {
            type: "callout",
            tone: "tip",
            text: "Machen Sie einen Screenshot der Fehlermeldung. Das spart bei der Diagnose viel Zeit.",
          },
        ],
      },
      it: {
        title: "Risoluzione dei problemi dell'Automazione dei processi",
        description:
          "Cosa fare quando un'automazione fallisce: accessi scaduti, fogli di calcolo modificati, duplicati, messaggi non inviati ed errori segnalati dal software di fatturazione.",
        blocks: [
          {
            type: "p",
            text: "Con il monitoraggio attivo, intercettiamo molti guasti prima che ve ne accorgiate. Se incontrate un problema, i punti qui sotto aiutano a individuarne la causa. Nel dubbio, [contattateci](/it/contact) indicando data, ora e un esempio di ciò che non ha funzionato.",
          },
          { type: "h2", id: "stopped", text: "L'automazione ha smesso di funzionare" },
          {
            type: "steps",
            items: [
              { title: "Pensate a cosa è cambiato", body: "È cambiata una password, è stato modificato il piano di uno strumento, un utente se n'è andato o un foglio di calcolo è stato riorganizzato? Sono le cause più frequenti." },
              { title: "Verificate gli accessi", body: "Alcune connessioni scadono e vanno autorizzate di nuovo, soprattutto gli account Google e Microsoft. Se avete ricevuto un avviso dallo strumento, inoltratecelo." },
              { title: "Gestite a mano i casi in sospeso", body: "Mentre sistemiamo, svolgete a mano i compiti urgenti, come emettere una fattura, e annotate cosa avete fatto per evitare duplicati." },
              { title: "Avvisateci", body: "Mandateci un messaggio con ciò che avete visto. Controlliamo lo storico delle esecuzioni e risolviamo." },
            ],
          },
          { type: "h2", id: "duplicates", text: "Ci sono record o fatture duplicati" },
          {
            type: "p",
            text: "Può succedere quando lo stesso evento arriva due volte (per esempio un pagamento notificato due volte) o quando qualcuno ha fatto a mano ciò che ha fatto anche l'automazione. Non annullate documenti fiscali senza parlarne con il vostro commercialista; avvisateci così rafforziamo il controllo dei duplicati.",
          },
          { type: "h2", id: "messages", text: "I messaggi non arrivano ai clienti" },
          {
            type: "ul",
            items: [
              "Verificate che i dati di contatto del cliente siano corretti e completi, compreso il prefisso internazionale per WhatsApp.",
              "Le e-mail automatiche possono finire nello spam del destinatario; chiedete al cliente di controllare.",
              "Su WhatsApp, le regole della piattaforma limitano alcuni messaggi avviati dall'azienda; se serve, adattiamo modelli e orari.",
            ],
          },
          { type: "h2", id: "invoicing-errors", text: "Errori del software di fatturazione" },
          {
            type: "p",
            text: "Errori come un codice fiscale non valido, una serie di documenti mancante o un'aliquota IVA assente di solito dipendono dai dati di origine o dalle impostazioni del software di fatturazione. Correggete i dati alla fonte quando possibile e ditecelo, così aggiungiamo una verifica.",
          },
          {
            type: "callout",
            tone: "tip",
            text: "Fate uno screenshot del messaggio di errore. Fa risparmiare molto tempo nella diagnosi.",
          },
        ],
      },
    },
    faq: {
      pt: {
        title: "Perguntas frequentes sobre a Automação de Processos",
        description:
          "Respostas às dúvidas mais comuns sobre a Automação de Processos: preço fechado, ferramentas, faturação certificada, segurança dos acessos e manutenção.",
        blocks: [
          {
            type: "p",
            text: "As perguntas que mais ouvimos antes e durante um projeto de automação. Se a sua não estiver aqui, [fale connosco](/contacto).",
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
                q: "Como é calculado o preço?",
                a: "Depois do mapeamento do processo, enviamos uma proposta de preço fechado com o âmbito bem definido. Não há surpresas: se quiser acrescentar algo, orçamentamos à parte antes de avançar.",
              },
              {
                q: "Preciso de conhecimentos técnicos?",
                a: "Não. Só precisa de conhecer bem o seu processo. Nós tratamos da parte técnica e explicamos o resultado em linguagem simples.",
              },
              {
                q: "Que ferramentas utilizam?",
                a: "Plataformas como Make, n8n ou Zapier, ou código à medida, consoante o caso. Ligamos Google Sheets, Gmail, Outlook, WhatsApp, CRMs e software de faturação com API.",
              },
              {
                q: "Funciona com o meu software de faturação?",
                a: "Se o software tiver API, como InvoiceXpress, Moloni ou Vendus, é normalmente possível. Os documentos continuam a ser emitidos pelo software certificado.",
              },
              {
                q: "Os meus acessos ficam seguros?",
                a: "Pedimos apenas as permissões necessárias, preferimos chaves de API e utilizadores dedicados e partilhamos credenciais através de um cofre de palavras-passe. Pode revogar o acesso a qualquer momento.",
              },
              {
                q: "E se uma ferramenta mudar a API?",
                a: "Com um plano de manutenção, acompanhamos essas mudanças e adaptamos a automação. Mudanças de fundo, como trocar de ferramenta, são orçamentadas à parte.",
              },
              {
                q: "Como sei se algo falhou?",
                a: "As automações que mantemos têm monitorização e alertas de erro. Somos avisados de falhas e, se afetarem a operação, avisamo-lo também.",
              },
              {
                q: "Quanto tempo demora um projeto?",
                a: "Automações simples ficam normalmente prontas em poucas semanas. O prazo concreto consta sempre da proposta.",
              },
              {
                q: "A automação é minha?",
                a: "Sim. As automações são construídas para o seu negócio e nas suas contas sempre que possível. Os detalhes de propriedade e transferência ficam definidos na proposta.",
              },
              {
                q: "A automação pode usar IA?",
                a: "Sim, quando traz valor real, por exemplo para classificar emails recebidos, extrair dados de faturas de fornecedores ou resumir pedidos. Nos passos críticos mantemos regras claras e, se necessário, aprovação humana.",
              },
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "Tem uma tarefa repetitiva em mente? [Marque uma conversa inicial](/agendar) e dizemos-lhe se faz sentido automatizá-la.",
          },
        ],
      },
      en: {
        title: "Process Automation FAQ",
        description:
          "Answers to common questions about Process Automation: fixed pricing, tools we use, certified invoicing, keeping your access secure and ongoing maintenance.",
        blocks: [
          {
            type: "p",
            text: "The questions we hear most before and during an automation project. If yours isn't here, [get in touch](/en/contact).",
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
                q: "How is the price worked out?",
                a: "After mapping the process, we send a fixed-price proposal with a clearly defined scope. No surprises: if you want to add something, we quote it separately before going ahead.",
              },
              {
                q: "Do I need technical knowledge?",
                a: "No. You just need to know your process well. We handle the technical side and explain the result in plain language.",
              },
              {
                q: "Which tools do you use?",
                a: "Platforms such as Make, n8n or Zapier, or custom code, depending on the case. We connect Google Sheets, Gmail, Outlook, WhatsApp, CRMs and invoicing software with an API.",
              },
              {
                q: "Will it work with my invoicing software?",
                a: "If the software has an API, like InvoiceXpress, Moloni or Vendus, it's usually possible. Documents are still issued by the certified software.",
              },
              {
                q: "Is my access kept secure?",
                a: "We ask only for the permissions we need, prefer API keys and dedicated users, and share credentials through a password vault. You can revoke access at any time.",
              },
              {
                q: "What if a tool changes its API?",
                a: "With a maintenance plan, we keep track of those changes and adapt the automation. Fundamental changes, such as switching tools, are quoted separately.",
              },
              {
                q: "How will I know if something fails?",
                a: "The automations we maintain have monitoring and error alerts. We're notified of failures and, if they affect your operations, we let you know too.",
              },
              {
                q: "How long does a project take?",
                a: "Simple automations are usually ready within a few weeks. The exact timeline is always in the proposal.",
              },
              {
                q: "Do I own the automation?",
                a: "Yes. Automations are built for your business and in your own accounts wherever possible. Ownership and transfer details are set out in the proposal.",
              },
              {
                q: "Can the automation use AI?",
                a: "Yes, where it adds real value, for example to sort incoming emails, extract data from supplier invoices or summarise requests. For critical steps we keep clear rules and, where needed, human approval.",
              },
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "Got a repetitive task in mind? [Book a discovery call](/en/book-a-demo) and we'll tell you whether it's worth automating.",
          },
        ],
      },
      es: {
        title: "Preguntas frecuentes sobre la Automatización de procesos",
        description:
          "Respuestas a las preguntas habituales sobre la Automatización de procesos: precio cerrado, herramientas que usamos, facturación certificada, seguridad de sus accesos y mantenimiento continuo.",
        blocks: [
          {
            type: "p",
            text: "Las preguntas que más oímos antes y durante un proyecto de automatización. Si la suya no está aquí, [hable con nosotros](/es/contact).",
          },
          { type: "h2", id: "questions", text: "Preguntas y respuestas" },
          {
            type: "faq",
            items: [
              { q: "¿Cómo se calcula el precio?", a: "Después de trazar el mapa del proceso, le enviamos una propuesta de precio cerrado con un alcance bien definido. Sin sorpresas: si quiere añadir algo, lo presupuestamos aparte antes de seguir." },
              { q: "¿Necesito conocimientos técnicos?", a: "No. Solo necesita conocer bien su proceso. Nosotros nos ocupamos de la parte técnica y le explicamos el resultado con palabras sencillas." },
              { q: "¿Qué herramientas usan?", a: "Plataformas como Make, n8n o Zapier, o código a medida, según el caso. Conectamos Google Sheets, Gmail, Outlook, WhatsApp, CRM y software de facturación con API." },
              { q: "¿Funcionará con mi software de facturación?", a: "Si el software tiene API, como InvoiceXpress, Moloni o Vendus, normalmente es posible. Los documentos los sigue emitiendo el software certificado." },
              { q: "¿Mis accesos están seguros?", a: "Solo pedimos los permisos necesarios, preferimos claves de API y usuarios dedicados y compartimos las credenciales mediante un gestor de contraseñas. Puede retirar los accesos en cualquier momento." },
              { q: "¿Y si una herramienta cambia su API?", a: "Con un plan de mantenimiento, seguimos esos cambios y adaptamos la automatización. Los cambios de fondo, como cambiar de herramienta, se presupuestan aparte." },
              { q: "¿Cómo sabré si algo falla?", a: "Las automatizaciones que mantenemos tienen supervisión y avisos de error. Nos llegan los fallos y, si afectan a su operativa, también se lo comunicamos." },
              { q: "¿Cuánto dura un proyecto?", a: "Las automatizaciones sencillas suelen estar listas en pocas semanas. El plazo exacto figura siempre en la propuesta." },
              { q: "¿La automatización es mía?", a: "Sí. Las automatizaciones se crean para su negocio y, siempre que es posible, en sus propias cuentas. Los detalles de propiedad y transferencia figuran en la propuesta." },
              { q: "¿La automatización puede usar IA?", a: "Sí, cuando aporta valor real, por ejemplo para clasificar los correos entrantes, extraer datos de facturas de proveedores o resumir solicitudes. En los pasos críticos mantenemos reglas claras y, cuando hace falta, aprobación humana." },
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "¿Tiene en mente una tarea repetitiva? [Reserve una llamada inicial](/es/book-a-demo) y le diremos si merece la pena automatizarla.",
          },
        ],
      },
      fr: {
        title: "Questions fréquentes sur l'Automatisation des processus",
        description:
          "Réponses aux questions courantes sur l'Automatisation des processus : prix forfaitaire, outils utilisés, facturation certifiée, sécurité de vos accès et maintenance continue.",
        blocks: [
          {
            type: "p",
            text: "Les questions que nous entendons le plus avant et pendant un projet d'automatisation. Si la vôtre n'y est pas, [écrivez-nous](/fr/contact).",
          },
          { type: "h2", id: "questions", text: "Questions et réponses" },
          {
            type: "faq",
            items: [
              { q: "Comment le prix est-il calculé ?", a: "Après la cartographie du processus, nous envoyons une proposition à prix forfaitaire avec un périmètre clairement défini. Pas de surprise : si vous voulez ajouter quelque chose, nous en faisons un devis à part avant d'avancer." },
              { q: "Faut-il des connaissances techniques ?", a: "Non. Il suffit de bien connaître votre processus. Nous nous occupons de la partie technique et vous expliquons le résultat simplement." },
              { q: "Quels outils utilisez-vous ?", a: "Des plateformes comme Make, n8n ou Zapier, ou du code sur mesure, selon le cas. Nous relions Google Sheets, Gmail, Outlook, WhatsApp, des CRM et des logiciels de facturation dotés d'une API." },
              { q: "Est-ce que ça marchera avec mon logiciel de facturation ?", a: "Si le logiciel a une API, comme InvoiceXpress, Moloni ou Vendus, c'est en général possible. Les documents restent émis par le logiciel certifié." },
              { q: "Mes accès sont-ils protégés ?", a: "Nous ne demandons que les autorisations nécessaires, privilégions les clés d'API et les utilisateurs dédiés et partageons les identifiants via un coffre-fort de mots de passe. Vous pouvez retirer les accès à tout moment." },
              { q: "Et si un outil change son API ?", a: "Avec un plan de maintenance, nous suivons ces changements et adaptons l'automatisation. Les changements de fond, comme changer d'outil, font l'objet d'un devis à part." },
              { q: "Comment saurai-je si quelque chose échoue ?", a: "Les automatisations que nous maintenons ont une surveillance et des alertes d'erreur. Nous sommes prévenus des pannes et, si elles touchent votre activité, nous vous prévenons aussi." },
              { q: "Combien de temps dure un projet ?", a: "Les automatisations simples sont en général prêtes en quelques semaines. Le délai exact figure toujours dans la proposition." },
              { q: "L'automatisation m'appartient-elle ?", a: "Oui. Les automatisations sont créées pour votre activité et, autant que possible, dans vos propres comptes. Les modalités de propriété et de transfert figurent dans la proposition." },
              { q: "L'automatisation peut-elle utiliser l'IA ?", a: "Oui, quand elle apporte une vraie valeur, par exemple pour trier les e-mails entrants, extraire des données des factures fournisseurs ou résumer des demandes. Pour les étapes critiques, nous gardons des règles claires et, si besoin, une validation humaine." },
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "Vous avez une tâche répétitive en tête ? [Réservez un appel de découverte](/fr/book-a-demo) et nous vous dirons si elle vaut la peine d'être automatisée.",
          },
        ],
      },
      de: {
        title: "Häufige Fragen zur Automatisierung",
        description:
          "Antworten auf häufige Fragen zur Prozessautomatisierung: Festpreis, eingesetzte Werkzeuge, zertifizierte Rechnungsstellung, Sicherheit Ihrer Zugänge und laufende Wartung.",
        blocks: [
          {
            type: "p",
            text: "Die Fragen, die wir vor und während eines Automatisierungsprojekts am häufigsten hören. Wenn Ihre nicht dabei ist, [schreiben Sie uns](/de/contact).",
          },
          { type: "h2", id: "questions", text: "Fragen und Antworten" },
          {
            type: "faq",
            items: [
              { q: "Wie wird der Preis berechnet?", a: "Nach der Prozessaufnahme schicken wir ein Festpreisangebot mit klar festgelegtem Umfang. Keine Überraschungen: Wenn Sie etwas ergänzen möchten, bieten wir es separat an, bevor wir weitermachen." },
              { q: "Brauche ich technische Kenntnisse?", a: "Nein. Sie müssen nur Ihren Prozess gut kennen. Wir kümmern uns um die Technik und erklären Ihnen das Ergebnis in einfachen Worten." },
              { q: "Welche Werkzeuge nutzen Sie?", a: "Plattformen wie Make, n8n oder Zapier oder eigenen Code, je nach Fall. Wir verbinden Google Sheets, Gmail, Outlook, WhatsApp, CRMs und Rechnungssoftware mit API." },
              { q: "Funktioniert es mit meiner Rechnungssoftware?", a: "Wenn die Software eine API hat, wie InvoiceXpress, Moloni oder Vendus, ist es meist möglich. Die Belege stellt weiterhin die zertifizierte Software aus." },
              { q: "Sind meine Zugänge sicher?", a: "Wir bitten nur um die nötigen Berechtigungen, bevorzugen API-Schlüssel und eigene Benutzer und teilen Zugangsdaten über einen Passwort-Tresor. Sie können Zugänge jederzeit entziehen." },
              { q: "Was, wenn ein Werkzeug seine API ändert?", a: "Mit einem Wartungsplan verfolgen wir solche Änderungen und passen die Automatisierung an. Grundlegende Änderungen, etwa ein Werkzeugwechsel, werden separat angeboten." },
              { q: "Wie erfahre ich, wenn etwas fehlschlägt?", a: "Die Automatisierungen, die wir warten, haben Überwachung und Fehlermeldungen. Wir werden über Ausfälle informiert, und wenn sie Ihren Betrieb betreffen, sagen wir auch Ihnen Bescheid." },
              { q: "Wie lange dauert ein Projekt?", a: "Einfache Automatisierungen sind meist innerhalb weniger Wochen fertig. Der genaue Zeitplan steht immer im Angebot." },
              { q: "Gehört die Automatisierung mir?", a: "Ja. Die Automatisierungen werden für Ihren Betrieb gebaut und, wo möglich, in Ihren eigenen Konten. Einzelheiten zu Eigentum und Übertragung stehen im Angebot." },
              { q: "Kann die Automatisierung KI nutzen?", a: "Ja, wo sie echten Mehrwert bringt, zum Beispiel um eingehende E-Mails zu sortieren, Daten aus Lieferantenrechnungen zu lesen oder Anfragen zusammenzufassen. Bei kritischen Schritten behalten wir klare Regeln und, wo nötig, eine menschliche Freigabe bei." },
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "Haben Sie eine wiederkehrende Aufgabe im Kopf? [Buchen Sie ein Erstgespräch](/de/book-a-demo), und wir sagen Ihnen, ob sich die Automatisierung lohnt.",
          },
        ],
      },
      it: {
        title: "Domande frequenti sull'Automazione dei processi",
        description:
          "Risposte alle domande più comuni sull'Automazione dei processi: prezzo fisso, strumenti usati, fatturazione certificata, sicurezza dei vostri accessi e manutenzione continua.",
        blocks: [
          {
            type: "p",
            text: "Le domande che sentiamo più spesso prima e durante un progetto di automazione. Se la vostra non c'è, [scriveteci](/it/contact).",
          },
          { type: "h2", id: "questions", text: "Domande e risposte" },
          {
            type: "faq",
            items: [
              { q: "Come si calcola il prezzo?", a: "Dopo la mappatura del processo, inviamo una proposta a prezzo fisso con un perimetro ben definito. Nessuna sorpresa: se volete aggiungere qualcosa, lo preventiviamo a parte prima di procedere." },
              { q: "Servono competenze tecniche?", a: "No. Basta conoscere bene il vostro processo. Alla parte tecnica pensiamo noi e vi spieghiamo il risultato con parole semplici." },
              { q: "Quali strumenti usate?", a: "Piattaforme come Make, n8n o Zapier, oppure codice su misura, a seconda del caso. Colleghiamo Google Sheets, Gmail, Outlook, WhatsApp, CRM e software di fatturazione con API." },
              { q: "Funzionerà con il mio software di fatturazione?", a: "Se il software ha un'API, come InvoiceXpress, Moloni o Vendus, di solito è possibile. I documenti continuano a essere emessi dal software certificato." },
              { q: "I miei accessi sono al sicuro?", a: "Chiediamo solo i permessi necessari, preferiamo chiavi API e utenti dedicati e condividiamo le credenziali tramite un gestore di password. Potete revocare gli accessi in qualsiasi momento." },
              { q: "E se uno strumento cambia la sua API?", a: "Con un piano di manutenzione, seguiamo questi cambiamenti e adattiamo l'automazione. I cambiamenti di fondo, come cambiare strumento, si preventivano a parte." },
              { q: "Come saprò se qualcosa non funziona?", a: "Le automazioni che manteniamo hanno monitoraggio e avvisi di errore. Veniamo avvisati dei guasti e, se toccano la vostra operatività, ve lo comunichiamo anche noi." },
              { q: "Quanto dura un progetto?", a: "Le automazioni semplici di solito sono pronte in poche settimane. I tempi esatti sono sempre nella proposta." },
              { q: "L'automazione è mia?", a: "Sì. Le automazioni sono costruite per la vostra attività e, quando possibile, nei vostri account. I dettagli su proprietà e trasferimento sono nella proposta." },
              { q: "L'automazione può usare l'IA?", a: "Sì, quando porta un valore reale, per esempio per smistare le e-mail in arrivo, estrarre dati dalle fatture dei fornitori o riassumere le richieste. Per i passaggi critici manteniamo regole chiare e, se serve, un'approvazione umana." },
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "Avete in mente un'attività ripetitiva? [Prenotate una chiamata conoscitiva](/it/book-a-demo) e vi diremo se vale la pena automatizzarla.",
          },
        ],
      },
    },
  },
};
