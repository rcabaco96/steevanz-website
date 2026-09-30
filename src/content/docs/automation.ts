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
    },
  },
};
