import type { ProductDocs } from "../types";

export const docs: ProductDocs = {
  productId: "waitlist",
  pages: {
    "getting-started": {
      pt: {
        title: "Primeiros passos com a lista de espera digital",
        description:
          "Como funciona a lista de espera digital da Steevanz: o cliente entra por QR ou NFC, aguarda onde quiser e recebe uma mensagem quando chega a sua vez.",
        blocks: [
          {
            type: "p",
            text: "A lista de espera digital substitui a folha de papel à porta e os clientes amontoados na entrada. O cliente entra na fila com o telemóvel, pode ir dar uma volta e recebe uma mensagem por **SMS ou WhatsApp** quando a mesa ou a vez estiver pronta.",
          },
          { type: "h2", id: "como-funciona", text: "Como funciona" },
          {
            type: "ol",
            items: [
              "O cliente lê o código QR ou encosta o telemóvel à placa NFC à entrada. Em alternativa, alguém da equipa adiciona-o na fila.",
              "Indica o nome, o número de pessoas e o número de telemóvel.",
              "Vê a sua posição e um **tempo de espera estimado**.",
              "Quando a mesa ou a vez estiver pronta, a equipa carrega num botão e o cliente recebe a mensagem.",
              "O cliente pode responder que está a caminho, que vai atrasar-se ou que desiste.",
            ],
          },
          { type: "h2", id: "para-quem", text: "Para que negócios é indicada" },
          {
            type: "table",
            head: ["Negócio", "Uso típico"],
            rows: [
              ["Restaurantes e cafés", "Fila para mesa em horas de ponta, sobretudo sem reserva"],
              ["Barbearias e salões", "Atendimento por ordem de chegada sem marcação"],
              ["Clínicas e serviços", "Chamada de utentes na sala de espera, com ou sem ecrã"],
              ["Lojas", "Atendimento personalizado, provas ou levantamento de encomendas"],
            ],
          },
          {
            type: "callout",
            tone: "info",
            title: "Complementa as reservas",
            text: "Se também usa o [sistema de reservas online](/produtos/sistema-reservas-online), a lista de espera trata dos clientes que chegam sem reserva e as reservas tratam de quem planeia com antecedência.",
          },
          { type: "h2", id: "o-que-inclui", text: "O que está incluído" },
          {
            type: "ul",
            items: [
              "Configuração da fila, das mensagens e do tempo estimado pela equipa da Steevanz.",
              "Código QR para imprimir e, se escolher, placa NFC para a entrada.",
              "Painel para a equipa gerir a fila no tablet, computador ou telemóvel.",
              "Opção de **ecrã de chamada** para mostrar a fila numa televisão ou monitor.",
              "Suporte por WhatsApp e email.",
            ],
          },
          { type: "h2", id: "vantagens", text: "O que muda para a equipa e para o cliente" },
          {
            type: "p",
            text: "Para o cliente, a espera deixa de ser passada em pé à porta: pode tomar um café ao lado, dar uma volta ou esperar no carro, sabendo que será avisado. Para a equipa, acabam as perguntas repetidas sobre quanto falta e os nomes gritados para a rua. A pessoa à porta vê numa só lista quem está à espera, quantas pessoas são e quem já respondeu.",
          },
          {
            type: "p",
            text: "Há também informação útil para gerir o negócio: quantas pessoas entraram na fila, quantas desistiram e em que dias e horas a espera foi maior. Esses dados ajudam a decidir, por exemplo, se vale a pena reforçar a equipa num turno.",
          },
          { type: "h2", id: "proximos-passos", text: "Próximos passos" },
          {
            type: "p",
            text: "Siga para a [instalação](/docs/lista-espera-digital/instalacao) para ver como pomos a fila a funcionar, ou [agende uma demonstração](/agendar) para ver a lista de espera em ação.",
          },
        ],
      },
      en: {
        title: "Getting started with the digital waitlist",
        description:
          "How the Steevanz digital waitlist works: customers join by QR code or NFC, wait wherever they like and get a message when it is their turn.",
        blocks: [
          {
            type: "p",
            text: "The digital waitlist replaces the paper list at the door and the crowd in your entrance. Customers join the queue on their phone, can go for a walk and receive an **SMS or WhatsApp** message when their table or turn is ready.",
          },
          { type: "h2", id: "how-it-works", text: "How it works" },
          {
            type: "ol",
            items: [
              "The customer scans the QR code or taps their phone on the NFC plate at the entrance. Alternatively, a member of staff adds them to the queue.",
              "They enter their name, party size and mobile number.",
              "They see their position and an **estimated wait time**.",
              "When the table or turn is ready, your team taps a button and the customer receives the message.",
              "The customer can reply that they are on their way, running late or no longer coming.",
            ],
          },
          { type: "h2", id: "who-it-is-for", text: "Which businesses it suits" },
          {
            type: "table",
            head: ["Business", "Typical use"],
            rows: [
              ["Restaurants and cafés", "Queue for a table at peak times, especially walk-ins"],
              ["Barbers and salons", "First-come, first-served service without appointments"],
              ["Clinics and services", "Calling patients from the waiting room, with or without a screen"],
              ["Shops", "Personal assistance, fittings or order collection"],
            ],
          },
          {
            type: "callout",
            tone: "info",
            title: "Works alongside bookings",
            text: "If you also use the [online booking system](/en/products/online-booking-system), the waitlist handles walk-ins while bookings handle customers who plan ahead.",
          },
          { type: "h2", id: "whats-included", text: "What is included" },
          {
            type: "ul",
            items: [
              "Queue, messages and wait estimate set up by the Steevanz team.",
              "A printable QR code and, if you choose, an NFC plate for the entrance.",
              "A dashboard for your team to manage the queue on a tablet, computer or phone.",
              "An optional **display screen** to show the queue on a TV or monitor.",
              "Support by WhatsApp and email.",
            ],
          },
          { type: "h2", id: "benefits", text: "What changes for your team and customers" },
          {
            type: "p",
            text: "For customers, waiting no longer means standing at the door: they can grab a coffee nearby, take a stroll or wait in the car, knowing they will be notified. For your team, there are no more repeated questions about how long it will be and no more names shouted into the street. Whoever is on the door sees in one list who is waiting, how many people are in each party and who has replied.",
          },
          {
            type: "p",
            text: "You also get useful information for running the business: how many people joined the queue, how many gave up and on which days and times the wait was longest. That data helps you decide, for example, whether to add staff to a shift.",
          },
          { type: "h2", id: "next-steps", text: "Next steps" },
          {
            type: "p",
            text: "Head to [setup](/en/docs/digital-waitlist/setup) to see how we get your queue running, or [book a demo](/en/book-a-demo) to see the waitlist in action.",
          },
        ],
      },
    },
    setup: {
      pt: {
        title: "Instalação da lista de espera digital",
        description:
          "Passo a passo para instalar a lista de espera digital: configuração da fila, código QR e placa NFC à entrada, painel da equipa e ecrã de chamada.",
        blocks: [
          {
            type: "p",
            text: "A instalação é feita pela Steevanz. Do seu lado, precisamos de algumas informações e de alguém da equipa disponível para um teste rápido no local ou por videochamada.",
          },
          { type: "h2", id: "passos", text: "Passos de instalação" },
          {
            type: "steps",
            items: [
              {
                title: "Levantamento",
                body: "Falamos sobre as horas de ponta, o tamanho típico dos grupos, quanto tempo demora em média uma mesa ou um atendimento e o que acontece quando o cliente não aparece.",
              },
              {
                title: "Configuração da fila",
                body: "Criamos a fila com os tamanhos de grupo aceites, os campos a pedir ao cliente e as regras de tempo estimado.",
              },
              {
                title: "Mensagens",
                body: "Escrevemos as mensagens de entrada na fila, de chamada e de lembrete, em português e inglês se tiver clientes estrangeiros.",
              },
              {
                title: "QR e NFC à entrada",
                body: "Enviamos o código QR em formato para impressão e, se escolheu a opção NFC, a placa já programada para abrir a página de entrada na fila.",
              },
              {
                title: "Painel e ecrã",
                body: "Damos acesso ao painel a quem vai gerir a fila e, se quiser, ligamos o ecrã de chamada a uma televisão ou monitor.",
              },
              {
                title: "Teste real",
                body: "Um membro da equipa entra na fila com o próprio telemóvel, é chamado e responde à mensagem, para confirmar que tudo funciona de ponta a ponta.",
              },
            ],
          },
          { type: "h2", id: "colocacao-qr-nfc", text: "Onde colocar o QR e a placa NFC" },
          {
            type: "ul",
            items: [
              "**À altura dos olhos**, junto à porta ou à zona de receção, visível mesmo quando há pessoas à espera.",
              "Com uma frase curta de instrução, por exemplo «Entre na fila com o telemóvel».",
              "Longe de superfícies metálicas, que podem interferir com a leitura NFC.",
              "Se houver esplanada ou fila exterior, considere um segundo ponto de entrada no exterior.",
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "Nem todos os telemóveis leem NFC com a mesma facilidade. Ter sempre o código QR ao lado da placa garante que ninguém fica de fora.",
          },
          { type: "h2", id: "ecra-de-chamada", text: "Ecrã de chamada (opcional)" },
          {
            type: "p",
            text: "O ecrã de chamada mostra os primeiros nomes ou números da fila e destaca quem foi chamado. Funciona em qualquer televisão ou monitor com navegador, por exemplo através de uma box ou de um computador pequeno. Por privacidade, pode mostrar apenas iniciais ou um número de senha.",
          },
          {
            type: "code",
            label: "Endereço do ecrã (exemplo)",
            code: "https://fila.steevanz.com/o-seu-negocio/ecra",
          },
          { type: "h2", id: "depois-da-instalacao", text: "Depois da instalação" },
          {
            type: "p",
            text: "Veja em [configuração](/docs/lista-espera-digital/configuracao) como ajustar tempos, faltas e mensagens, e em [utilização](/docs/lista-espera-digital/utilizacao) como gerir a fila numa hora de ponta.",
          },
        ],
      },
      en: {
        title: "Setting up the digital waitlist",
        description:
          "Step-by-step guide to setting up the digital waitlist: queue configuration, QR code and NFC plate at the door, staff dashboard and display screen.",
        blocks: [
          {
            type: "p",
            text: "Setup is carried out by Steevanz. On your side, we need some information and a member of your team available for a quick test on site or over a video call.",
          },
          { type: "h2", id: "steps", text: "Setup steps" },
          {
            type: "steps",
            items: [
              {
                title: "Discovery",
                body: "We talk about your peak times, typical party sizes, how long a table or appointment usually takes and what happens when a customer does not show up.",
              },
              {
                title: "Queue configuration",
                body: "We create the queue with the accepted party sizes, the details to ask customers for and the wait estimate rules.",
              },
              {
                title: "Messages",
                body: "We write the joined, called and reminder messages, in Portuguese and English if you have international customers.",
              },
              {
                title: "QR and NFC at the door",
                body: "We send you the print-ready QR code and, if you chose the NFC option, the plate pre-programmed to open the join page.",
              },
              {
                title: "Dashboard and screen",
                body: "We give dashboard access to whoever will manage the queue and, if you like, connect the display screen to a TV or monitor.",
              },
              {
                title: "Live test",
                body: "A team member joins the queue on their own phone, gets called and replies to the message, to confirm everything works end to end.",
              },
            ],
          },
          { type: "h2", id: "qr-nfc-placement", text: "Where to place the QR code and NFC plate" },
          {
            type: "ul",
            items: [
              "**At eye level**, next to the door or reception area, visible even when people are waiting.",
              "With a short instruction such as “Join the queue on your phone”.",
              "Away from metal surfaces, which can interfere with NFC reading.",
              "If you have a terrace or an outdoor queue, consider a second join point outside.",
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "Not every phone reads NFC equally easily. Always keeping the QR code next to the plate makes sure nobody is left out.",
          },
          { type: "h2", id: "display-screen", text: "Display screen (optional)" },
          {
            type: "p",
            text: "The display screen shows the first names or numbers in the queue and highlights who has been called. It works on any TV or monitor with a browser, for example via a streaming box or a small computer. For privacy, you can show only initials or a ticket number.",
          },
          {
            type: "code",
            label: "Screen address (example)",
            code: "https://fila.steevanz.com/your-business/ecra",
          },
          { type: "h2", id: "after-setup", text: "After setup" },
          {
            type: "p",
            text: "See [configuration](/en/docs/digital-waitlist/configuration) to adjust timings, no-shows and messages, and [usage](/en/docs/digital-waitlist/usage) for managing the queue at peak times.",
          },
        ],
      },
    },
    configuration: {
      pt: {
        title: "Configuração da lista de espera digital",
        description:
          "Como configurar tamanhos de grupo, tempo de espera estimado, mensagens por SMS e WhatsApp, regras de falta e retenção de dados na lista de espera.",
        blocks: [
          {
            type: "p",
            text: "Estas definições determinam como a fila se comporta. Pode pedir-nos alterações a qualquer momento, por exemplo antes de um fim de semana com mais movimento.",
          },
          { type: "h2", id: "grupos-e-campos", text: "Grupos e dados pedidos" },
          {
            type: "ul",
            items: [
              "**Tamanho do grupo**: mínimo e máximo aceites na fila. Grupos maiores podem ser encaminhados para falar com a equipa.",
              "**Campos**: por defeito pedimos nome, número de pessoas e telemóvel. Pode acrescentar preferências como esplanada, cadeira de bebé ou acesso sem degraus.",
              "**Fila única ou várias filas**: por exemplo, sala e esplanada, ou corte e barba, com tempos diferentes.",
            ],
          },
          { type: "h2", id: "tempo-estimado", text: "Tempo de espera estimado" },
          {
            type: "p",
            text: "A estimativa parte de um tempo médio por mesa ou atendimento que definimos consigo e ajusta-se à medida que a equipa vai chamando clientes. É sempre apresentada ao cliente como uma **estimativa**, nunca como uma hora garantida.",
          },
          {
            type: "callout",
            tone: "tip",
            text: "Se os clientes chegam frequentemente antes de estarem prontos, aumente ligeiramente o tempo médio. É melhor surpreender pela positiva do que fazer esperar mais do que o anunciado.",
          },
          { type: "h2", id: "mensagens", text: "Mensagens e respostas" },
          {
            type: "table",
            head: ["Mensagem", "Quando", "Conteúdo típico"],
            rows: [
              ["Entrada na fila", "Logo após o registo", "Posição, tempo estimado, link para acompanhar ou sair da fila"],
              ["Chamada", "Quando a equipa chama", "A mesa ou a vez está pronta, com o tempo para se apresentar"],
              ["Lembrete", "Se o cliente não responder", "Pedido para confirmar se ainda vem"],
              ["Saída", "Quando o cliente sai ou é removido", "Confirmação e agradecimento"],
            ],
          },
          {
            type: "p",
            text: "O cliente pode responder com opções simples, como **a caminho**, **vou atrasar-me** ou **já não venho**. A resposta aparece no painel ao lado do nome, para que a equipa decida se guarda a mesa ou passa ao seguinte.",
          },
          { type: "h2", id: "faltas", text: "Regras para quem não aparece" },
          {
            type: "p",
            text: "Defina quantos minutos o cliente tem para se apresentar depois de ser chamado, por exemplo 10 minutos. Passado esse tempo, a entrada pode ser marcada como falta automaticamente ou ficar em destaque para a equipa decidir. Quem avisou que se atrasa pode ter uma tolerância adicional.",
          },
          { type: "h2", id: "rgpd", text: "Privacidade e retenção de dados" },
          {
            type: "ul",
            items: [
              "O número de telemóvel é usado **apenas** para as mensagens da fila, nunca para marketing, salvo consentimento separado.",
              "Os dados são eliminados automaticamente após um número de dias que definimos consigo.",
              "O ecrã de chamada pode mostrar apenas iniciais ou números, sem expor nomes completos.",
              "A página de entrada na fila inclui a informação de privacidade exigida pelo RGPD.",
            ],
          },
          {
            type: "callout",
            tone: "info",
            text: "Para mais detalhe sobre a gestão diária, veja a [utilização](/docs/lista-espera-digital/utilizacao).",
          },
        ],
      },
      en: {
        title: "Configuring the digital waitlist",
        description:
          "How to configure party sizes, estimated wait times, SMS and WhatsApp messages, no-show rules and data retention for your digital waitlist.",
        blocks: [
          {
            type: "p",
            text: "These settings determine how your queue behaves. You can ask us for changes at any time, for example before a busier weekend.",
          },
          { type: "h2", id: "parties-and-fields", text: "Party sizes and details requested" },
          {
            type: "ul",
            items: [
              "**Party size**: minimum and maximum accepted in the queue. Larger groups can be directed to speak to your team.",
              "**Fields**: by default we ask for name, party size and mobile number. You can add preferences such as terrace, high chair or step-free access.",
              "**Single or multiple queues**: for example indoor and terrace, or haircut and beard, each with different timings.",
            ],
          },
          { type: "h2", id: "wait-estimate", text: "Estimated wait time" },
          {
            type: "p",
            text: "The estimate starts from an average time per table or appointment that we agree with you, and adjusts as your team calls customers. It is always shown to customers as an **estimate**, never as a guaranteed time.",
          },
          {
            type: "callout",
            tone: "tip",
            text: "If customers often arrive before you are ready, increase the average time slightly. It is better to pleasantly surprise people than to make them wait longer than promised.",
          },
          { type: "h2", id: "messages", text: "Messages and replies" },
          {
            type: "table",
            head: ["Message", "When", "Typical content"],
            rows: [
              ["Joined", "Straight after joining", "Position, estimated wait, link to track or leave the queue"],
              ["Called", "When your team calls them", "The table or turn is ready, with how long they have to arrive"],
              ["Reminder", "If the customer does not reply", "A request to confirm they are still coming"],
              ["Left", "When the customer leaves or is removed", "Confirmation and thank you"],
            ],
          },
          {
            type: "p",
            text: "Customers can reply with simple options such as **on my way**, **running late** or **no longer coming**. The reply shows in the dashboard next to their name, so your team can decide whether to hold the table or move to the next person.",
          },
          { type: "h2", id: "no-shows", text: "No-show rules" },
          {
            type: "p",
            text: "Set how many minutes customers have to arrive after being called, for example 10 minutes. After that, the entry can be marked as a no-show automatically or highlighted for your team to decide. Customers who said they are running late can be given extra time.",
          },
          { type: "h2", id: "gdpr", text: "Privacy and data retention" },
          {
            type: "ul",
            items: [
              "The mobile number is used **only** for queue messages, never for marketing unless separate consent is given.",
              "Data is deleted automatically after a number of days that we agree with you.",
              "The display screen can show only initials or numbers, without exposing full names.",
              "The join page includes the privacy information required under GDPR.",
            ],
          },
          {
            type: "callout",
            tone: "info",
            text: "For more on day-to-day management, see [usage](/en/docs/digital-waitlist/usage).",
          },
        ],
      },
    },
    usage: {
      pt: {
        title: "Utilização diária da lista de espera",
        description:
          "Como gerir a lista de espera no dia a dia: adicionar clientes, chamar, lidar com atrasos e faltas, reordenar a fila e fechar a fila ao fim do serviço.",
        blocks: [
          {
            type: "p",
            text: "A lista de espera foi pensada para ser usada com pressa, numa hora de ponta, por quem está à porta. Estas são as tarefas do dia a dia.",
          },
          { type: "h2", id: "abrir-a-fila", text: "Abrir e fechar a fila" },
          {
            type: "p",
            text: "Abra a fila quando a sala estiver cheia ou quando começar o serviço sem marcação. Ao fechar, novos clientes deixam de poder entrar, mas quem já está na fila continua a ser atendido. Pode também pausar temporariamente a entrada se a espera ficar demasiado longa.",
          },
          { type: "h2", id: "adicionar-clientes", text: "Adicionar clientes manualmente" },
          {
            type: "p",
            text: "Para clientes sem telemóvel à mão ou que preferem falar com alguém, adicione-os no painel com nome e número de pessoas. Se não deixarem contacto, a equipa chama-os pessoalmente ou pelo ecrã de chamada.",
          },
          { type: "h2", id: "chamar", text: "Chamar o próximo cliente" },
          {
            type: "steps",
            items: [
              {
                title: "Escolha quem chamar",
                body: "Normalmente é o primeiro da fila, mas pode escolher outro se a mesa livre for mais adequada ao tamanho de outro grupo.",
              },
              {
                title: "Envie a chamada",
                body: "O cliente recebe a mensagem por SMS ou WhatsApp e, se houver ecrã, o nome ou número aparece em destaque.",
              },
              {
                title: "Acompanhe a resposta",
                body: "No painel vê se o cliente respondeu que vem a caminho, que se atrasa ou que desiste.",
              },
              {
                title: "Marque a chegada",
                body: "Quando o cliente se apresentar, marque-o como atendido. A estimativa dos restantes é atualizada.",
              },
            ],
          },
          { type: "h2", id: "atrasos-e-faltas", text: "Atrasos e faltas" },
          {
            type: "ul",
            items: [
              "Quem responde que se atrasa fica assinalado; decida se espera ou chama o seguinte.",
              "Após o tempo de tolerância, a entrada é marcada como falta ou fica em destaque, conforme a configuração.",
              "Pode repor na fila um cliente que chegou pouco depois de ser marcado como falta.",
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "Se a espera real começar a ultrapassar a estimativa, avise quem está na fila com uma mensagem curta. Os clientes lidam melhor com uma espera maior do que com a falta de informação.",
          },
          { type: "h2", id: "horas-de-ponta", text: "Dicas para horas de ponta" },
          {
            type: "ul",
            items: [
              "Defina uma só pessoa responsável pela fila em cada turno, para evitar chamadas em duplicado.",
              "Chame o cliente seguinte assim que perceber que uma mesa vai vagar, e não apenas quando já estiver livre; isso reduz o tempo de mesa vazia.",
              "Se a espera ficar muito longa, pause a entrada na fila em vez de aceitar clientes que não vai conseguir atender.",
              "No fim do serviço, feche a fila e confirme que não ficou ninguém por chamar.",
            ],
          },
          {
            type: "p",
            text: "Problemas com mensagens ou com o QR? Consulte a [resolução de problemas](/docs/lista-espera-digital/resolucao-problemas).",
          },
        ],
      },
      en: {
        title: "Using the waitlist day to day",
        description:
          "How to run the waitlist day to day: adding customers, calling the next party, handling late arrivals and no-shows and closing the queue at the end.",
        blocks: [
          {
            type: "p",
            text: "The waitlist is designed to be used in a hurry, at peak time, by whoever is on the door. These are the everyday tasks.",
          },
          { type: "h2", id: "open-the-queue", text: "Opening and closing the queue" },
          {
            type: "p",
            text: "Open the queue when the room is full or when walk-in service starts. When you close it, new customers can no longer join, but those already in the queue are still served. You can also pause joining temporarily if the wait gets too long.",
          },
          { type: "h2", id: "add-customers", text: "Adding customers manually" },
          {
            type: "p",
            text: "For customers without a phone to hand, or who prefer to speak to someone, add them in the dashboard with their name and party size. If they leave no contact details, your team calls them in person or via the display screen.",
          },
          { type: "h2", id: "call-next", text: "Calling the next customer" },
          {
            type: "steps",
            items: [
              {
                title: "Choose who to call",
                body: "Usually the first in line, but you can pick someone else if the free table better suits another party's size.",
              },
              {
                title: "Send the call",
                body: "The customer receives the message by SMS or WhatsApp and, if you have a screen, their name or number is highlighted.",
              },
              {
                title: "Follow the reply",
                body: "In the dashboard you can see whether the customer replied that they are on their way, running late or no longer coming.",
              },
              {
                title: "Mark the arrival",
                body: "When the customer arrives, mark them as seated or served. The estimate for everyone else is updated.",
              },
            ],
          },
          { type: "h2", id: "late-and-no-shows", text: "Late arrivals and no-shows" },
          {
            type: "ul",
            items: [
              "Customers who reply that they are running late are flagged; decide whether to wait or call the next party.",
              "After the grace period, the entry is marked as a no-show or highlighted, depending on your configuration.",
              "You can put a customer back in the queue if they arrive shortly after being marked as a no-show.",
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "If the real wait starts to exceed the estimate, send a short update to everyone in the queue. Customers cope better with a longer wait than with a lack of information.",
          },
          { type: "h2", id: "peak-time-tips", text: "Tips for peak times" },
          {
            type: "ul",
            items: [
              "Make one person responsible for the queue on each shift, to avoid calling the same party twice.",
              "Call the next customer as soon as you can see a table is about to free up, not only once it is empty; this cuts the time tables sit unused.",
              "If the wait gets very long, pause joining rather than accepting customers you will not be able to serve.",
              "At the end of service, close the queue and check nobody has been left uncalled.",
            ],
          },
          {
            type: "p",
            text: "Problems with messages or the QR code? See [troubleshooting](/en/docs/digital-waitlist/troubleshooting).",
          },
        ],
      },
    },
    troubleshooting: {
      pt: {
        title: "Resolução de problemas da lista de espera",
        description:
          "Soluções para problemas comuns na lista de espera digital: mensagens que não chegam, QR ou NFC que não abrem, tempos irrealistas e ecrã sem atualizar.",
        blocks: [
          {
            type: "p",
            text: "Se o problema acontecer durante o serviço, a prioridade é não parar a fila: continue a adicionar e chamar clientes no painel e contacte-nos por WhatsApp em paralelo.",
          },
          { type: "h2", id: "mensagem-nao-chega", text: "O cliente não recebeu a mensagem" },
          {
            type: "ol",
            items: [
              "Confirme no painel se o número foi introduzido com o indicativo correto, sobretudo em números estrangeiros.",
              "Verifique se o cliente tem rede; em caves ou zonas com pouca cobertura as mensagens podem atrasar.",
              "Se o cliente escolheu WhatsApp, confirme que esse número tem WhatsApp ativo; caso contrário, use SMS.",
              "Se vários clientes seguidos não receberem mensagens, avise-nos de imediato.",
            ],
          },
          { type: "h2", id: "qr-nfc-nao-abre", text: "O QR ou a placa NFC não abrem a página" },
          {
            type: "ul",
            items: [
              "**QR**: verifique se o código está limpo, sem reflexos e bem iluminado. Um código danificado ou muito pequeno pode não ser lido.",
              "**NFC**: o cliente deve ter o NFC ativo e encostar a parte de cima ou de trás do telemóvel, consoante o modelo. Capas grossas ou metálicas podem impedir a leitura.",
              "Se nenhum dos dois funcionar em vários telemóveis, contacte-nos para verificarmos o endereço programado.",
            ],
          },
          { type: "h2", id: "tempo-irrealista", text: "O tempo estimado não bate certo" },
          {
            type: "p",
            text: "A estimativa depende de a equipa marcar chegadas e saídas no painel. Se os clientes forem sentados sem serem marcados como atendidos, a fila parece mais lenta do que é. Se o problema persistir, revemos consigo o tempo médio configurado.",
          },
          { type: "h2", id: "ecra-parado", text: "O ecrã de chamada não atualiza" },
          {
            type: "p",
            text: "Recarregue a página no navegador do ecrã e confirme que o equipamento está ligado à internet. Desative o modo de poupança de energia da televisão ou do computador, que pode suspender o navegador.",
          },
          {
            type: "callout",
            tone: "warning",
            text: "Nunca partilhe o endereço do painel da equipa no ecrã público. O ecrã de chamada usa um endereço próprio, só de leitura.",
          },
          { type: "h2", id: "cliente-com-dificuldades", text: "O cliente tem dificuldade em entrar na fila" },
          {
            type: "p",
            text: "Alguns clientes, sobretudo pessoas mais velhas ou turistas sem dados móveis, podem preferir não usar o telemóvel. Nesses casos, adicione-os manualmente no painel. Se o seu espaço tiver Wi-Fi para clientes, indicar a rede junto ao QR também ajuda quem não tem dados.",
          },
          {
            type: "p",
            text: "Veja também as [perguntas frequentes](/docs/lista-espera-digital/perguntas-frequentes) ou [contacte-nos](/contacto).",
          },
        ],
      },
      en: {
        title: "Waitlist troubleshooting",
        description:
          "Fixes for common digital waitlist issues: messages not arriving, QR code or NFC not opening, unrealistic wait times and the display screen not updating.",
        blocks: [
          {
            type: "p",
            text: "If something goes wrong during service, the priority is to keep the queue moving: carry on adding and calling customers in the dashboard and message us on WhatsApp at the same time.",
          },
          { type: "h2", id: "message-not-received", text: "The customer did not receive the message" },
          {
            type: "ol",
            items: [
              "Check in the dashboard that the number was entered with the correct country code, especially for foreign numbers.",
              "Check the customer has signal; in basements or areas with poor coverage, messages may be delayed.",
              "If the customer chose WhatsApp, check that the number has an active WhatsApp account; otherwise, use SMS.",
              "If several customers in a row do not receive messages, let us know straight away.",
            ],
          },
          { type: "h2", id: "qr-nfc-not-opening", text: "The QR code or NFC plate does not open the page" },
          {
            type: "ul",
            items: [
              "**QR**: check the code is clean, free of glare and well lit. A damaged or very small code may not scan.",
              "**NFC**: the customer needs NFC switched on and should hold the top or back of the phone to the plate, depending on the model. Thick or metal cases can block the reading.",
              "If neither works on several phones, contact us so we can check the programmed address.",
            ],
          },
          { type: "h2", id: "unrealistic-estimate", text: "The wait estimate does not add up" },
          {
            type: "p",
            text: "The estimate relies on your team marking arrivals and departures in the dashboard. If customers are seated without being marked as served, the queue looks slower than it is. If the problem persists, we will review the configured average time with you.",
          },
          { type: "h2", id: "screen-not-updating", text: "The display screen is not updating" },
          {
            type: "p",
            text: "Reload the page in the screen's browser and check the device is connected to the internet. Turn off power-saving mode on the TV or computer, which can suspend the browser.",
          },
          {
            type: "callout",
            tone: "warning",
            text: "Never show the staff dashboard address on the public screen. The display screen uses its own read-only address.",
          },
          { type: "h2", id: "customer-struggling", text: "A customer is struggling to join" },
          {
            type: "p",
            text: "Some customers, especially older people or tourists without mobile data, may prefer not to use their phone. In those cases, add them manually in the dashboard. If you offer guest Wi-Fi, showing the network name next to the QR code also helps people without data.",
          },
          {
            type: "p",
            text: "See also the [FAQ](/en/docs/digital-waitlist/faq) or [contact us](/en/contact).",
          },
        ],
      },
    },
    faq: {
      pt: {
        title: "Perguntas frequentes sobre a lista de espera digital",
        description:
          "Respostas às dúvidas mais comuns sobre a lista de espera digital da Steevanz: aplicações, custos para o cliente, SMS, WhatsApp, NFC, faltas e RGPD.",
        blocks: [
          { type: "h2", id: "perguntas", text: "Perguntas e respostas" },
          {
            type: "faq",
            items: [
              {
                q: "O cliente precisa de instalar alguma aplicação?",
                a: "Não. A entrada na fila abre no navegador do telemóvel, a partir do QR ou da placa NFC.",
              },
              {
                q: "E se o cliente não tiver telemóvel ou não quiser dar o número?",
                a: "A equipa adiciona-o manualmente no painel e chama-o pessoalmente ou através do ecrã de chamada.",
              },
              {
                q: "As mensagens são enviadas por SMS ou WhatsApp?",
                a: "Pode usar um ou ambos. Configuramos consigo o canal principal e o alternativo.",
              },
              {
                q: "O tempo de espera mostrado é garantido?",
                a: "Não. É uma estimativa que se ajusta à medida que a equipa chama e atende clientes. Apresentamos sempre essa informação ao cliente.",
              },
              {
                q: "O que acontece se o cliente não aparecer?",
                a: "Depois do tempo de tolerância que definir, a entrada é marcada como falta ou fica em destaque para a equipa decidir. Veja a [configuração](/docs/lista-espera-digital/configuracao).",
              },
              {
                q: "O cliente pode avisar que se atrasa?",
                a: "Sim. Pode responder que está a caminho, que se atrasa ou que desiste, e a resposta aparece no painel.",
              },
              {
                q: "Preciso de uma televisão para o ecrã de chamada?",
                a: "Não é obrigatório. O ecrã é opcional e funciona em qualquer televisão ou monitor com navegador.",
              },
              {
                q: "Os números de telemóvel são usados para publicidade?",
                a: "Não. São usados apenas para as mensagens da fila e eliminados automaticamente após o prazo acordado, em conformidade com o RGPD.",
              },
              {
                q: "Posso ter filas diferentes para sala e esplanada?",
                a: "Sim. Cada fila tem os seus tempos e tamanhos de grupo.",
              },
              {
                q: "Funciona em conjunto com as reservas online?",
                a: "Sim. As reservas tratam de quem planeia e a fila de quem chega sem reserva. Veja o [sistema de reservas](/produtos/sistema-reservas-online).",
              },
            ],
          },
          { type: "h2", id: "documentacao-relacionada", text: "Documentação relacionada" },
          {
            type: "ul",
            items: [
              "[Primeiros passos](/docs/lista-espera-digital/primeiros-passos): como funciona a fila e para que negócios é indicada.",
              "[Instalação](/docs/lista-espera-digital/instalacao): QR, placa NFC, painel e ecrã de chamada.",
              "[Configuração](/docs/lista-espera-digital/configuracao): grupos, tempo estimado, mensagens, faltas e privacidade.",
              "[Utilização](/docs/lista-espera-digital/utilizacao): chamar clientes, gerir atrasos e fechar a fila.",
              "[Resolução de problemas](/docs/lista-espera-digital/resolucao-problemas): mensagens, QR, NFC e ecrã.",
            ],
          },
          { type: "h2", id: "mais-ajuda", text: "Ainda tem dúvidas?" },
          {
            type: "p",
            text: "Veja a [página do produto](/produtos/lista-espera-digital), [agende uma demonstração](/agendar) ou [fale connosco](/contacto).",
          },
        ],
      },
      en: {
        title: "Digital waitlist FAQ",
        description:
          "Answers to common questions about the Steevanz digital waitlist: apps, SMS and WhatsApp, NFC, wait estimates, no-shows, display screens and GDPR.",
        blocks: [
          { type: "h2", id: "questions", text: "Questions and answers" },
          {
            type: "faq",
            items: [
              {
                q: "Does the customer need to install an app?",
                a: "No. The join page opens in the phone's browser from the QR code or NFC plate.",
              },
              {
                q: "What if the customer has no phone or does not want to give their number?",
                a: "Your team adds them manually in the dashboard and calls them in person or via the display screen.",
              },
              {
                q: "Are messages sent by SMS or WhatsApp?",
                a: "You can use either or both. We set up the main and fallback channel with you.",
              },
              {
                q: "Is the displayed wait time guaranteed?",
                a: "No. It is an estimate that adjusts as your team calls and serves customers, and we always present it to customers as such.",
              },
              {
                q: "What happens if a customer does not turn up?",
                a: "After the grace period you set, the entry is marked as a no-show or highlighted for your team to decide. See [configuration](/en/docs/digital-waitlist/configuration).",
              },
              {
                q: "Can customers say they are running late?",
                a: "Yes. They can reply that they are on their way, running late or no longer coming, and the reply appears in the dashboard.",
              },
              {
                q: "Do I need a TV for the display screen?",
                a: "No, it is not required. The screen is optional and works on any TV or monitor with a browser.",
              },
              {
                q: "Are mobile numbers used for marketing?",
                a: "No. They are used only for queue messages and deleted automatically after the agreed period, in line with GDPR.",
              },
              {
                q: "Can I have separate queues for indoor and terrace?",
                a: "Yes. Each queue has its own timings and party sizes.",
              },
              {
                q: "Does it work alongside online bookings?",
                a: "Yes. Bookings cover customers who plan ahead and the queue covers walk-ins. See the [booking system](/en/products/online-booking-system).",
              },
            ],
          },
          { type: "h2", id: "related-docs", text: "Related documentation" },
          {
            type: "ul",
            items: [
              "[Getting started](/en/docs/digital-waitlist/getting-started): how the queue works and which businesses it suits.",
              "[Setup](/en/docs/digital-waitlist/setup): QR code, NFC plate, dashboard and display screen.",
              "[Configuration](/en/docs/digital-waitlist/configuration): party sizes, wait estimate, messages, no-shows and privacy.",
              "[Usage](/en/docs/digital-waitlist/usage): calling customers, handling late arrivals and closing the queue.",
              "[Troubleshooting](/en/docs/digital-waitlist/troubleshooting): messages, QR code, NFC and the screen.",
            ],
          },
          { type: "h2", id: "more-help", text: "Still have questions?" },
          {
            type: "p",
            text: "Visit the [product page](/en/products/digital-waitlist), [book a demo](/en/book-a-demo) or [contact us](/en/contact).",
          },
        ],
      },
    },
  },
};
