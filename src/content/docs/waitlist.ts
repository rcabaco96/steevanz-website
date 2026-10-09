import type { ProductDocs } from "../types";

export const docs: ProductDocs = {
  productId: "waitlist",
  pages: {
    "getting-started": {
      pt: {
        title: "Primeiros passos com a lista de espera digital",
        description:
          "Como funciona a lista de espera digital da Steevanz: o cliente entra por QR ou NFC, acompanha a vez no telemóvel e é avisado quando chega a sua vez.",
        blocks: [
          {
            type: "p",
            text: "A lista de espera digital substitui a folha de papel à porta e os clientes amontoados na entrada. O cliente entra na fila com o telemóvel, acompanha a posição e o tempo estimado e é avisado quando a mesa ou a vez estiver pronta.",
          },
          { type: "h2", id: "como-funciona", text: "Como funciona" },
          {
            type: "ol",
            items: [
              "O cliente lê o QR code ou toca na placa NFC à entrada. Também pode ser a equipa a adicioná-lo ao balcão.",
              "Escreve o nome e, conforme o negócio, o número de pessoas ou o serviço. O email é opcional.",
              "Fica com uma senha no telemóvel: número, posição na fila e espera estimada, sempre atualizados.",
              "Quando há mesa ou vez livre, a equipa carrega em «Chamar o seguinte». O telemóvel do cliente toca; quem ligou os avisos recebe uma notificação mesmo com a página fechada, e quem deixou email recebe também um email.",
              "O cliente vem logo à entrada: a senha mostra até que horas guardamos a vez.",
            ],
          },
          { type: "h2", id: "o-que-inclui", text: "O que inclui" },
          {
            type: "ul",
            items: [
              "Página de entrada na fila e senha no telemóvel, sem app nem conta.",
              "Painel para a equipa no telemóvel, tablet ou computador, com o botão «Chamar o seguinte».",
              "Ecrã de chamada para uma TV à entrada (opcional), só com números.",
              "Cartaz com QR code e placa NFC para a entrada.",
              "Estatísticas dos últimos 30 dias: entradas, atendidos, desistências e horas com mais gente.",
              "Configuração da fila pela equipa da Steevanz.",
              "Suporte por WhatsApp e email.",
            ],
          },
          {
            type: "callout",
            tone: "tip",
            title: "Funciona com as reservas",
            text: "Se também tiver as reservas online, a fila e as reservas de hoje ficam lado a lado no Balcão da sua área de cliente.",
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
          "How the Steevanz digital waitlist works: customers join by QR code or NFC, follow their turn on their phone and are alerted when it is their turn.",
        blocks: [
          {
            type: "p",
            text: "The digital waitlist replaces the paper list at the door and the crowd in your entrance. Customers join the queue on their phone, follow their position and estimated wait and are alerted when their table or turn is ready.",
          },
          { type: "h2", id: "how-it-works", text: "How it works" },
          {
            type: "ol",
            items: [
              "Customers scan the QR code or tap the NFC plate at the entrance. Your team can also add them at the desk.",
              "They type their name and, depending on the business, the number of people or the service. Email is optional.",
              "They get a ticket on their phone: number, position and estimated wait, always up to date.",
              "When a table or turn is free, your team taps «Call next». The customer's phone rings; those who switched alerts on get a notification even with the page closed, and those who left an email get an email too.",
              "The customer comes straight to the entrance: the ticket shows until what time their turn is held.",
            ],
          },
          { type: "h2", id: "whats-included", text: "What's included" },
          {
            type: "ul",
            items: [
              "Join page and ticket on the phone, no app or account.",
              "Staff dashboard on phone, tablet or computer, with the «Call next» button.",
              "Call screen for a TV at the entrance (optional), numbers only.",
              "Poster with QR code and NFC plate for the entrance.",
              "Stats for the last 30 days: joins, served (and calls that closed on their own), walk-aways and busiest hours.",
              "Queue set up by the Steevanz team.",
              "Support by WhatsApp and email.",
            ],
          },
          {
            type: "callout",
            tone: "tip",
            title: "Works with bookings",
            text: "If you also use online bookings, the queue and today's bookings sit side by side in the Balcão of your client area.",
          },
          {
            type: "p",
            text: "Next step: see how we handle the [setup](/en/docs/digital-waitlist/setup).",
          },
        ],
      },
    },
    setup: {
      pt: {
        title: "Instalação da lista de espera digital",
        description: "Como a Steevanz põe a lista de espera a funcionar no seu espaço: regras da fila, QR e NFC à entrada, painel e ecrã de chamada.",
        blocks: [
          { type: "p", text: "Tratamos da instalação consigo. Normalmente fica a funcionar em poucos dias úteis." },
          {
            type: "steps",
            items: [
              { title: "Levantamento", body: "Falamos sobre o seu espaço: horas de maior movimento, se os clientes vêm em grupo ou escolhem um serviço e profissional." },
              { title: "Configuração da fila", body: "Criamos o espaço com o horário e definimos o tempo médio por vez, o tempo para chegar depois de chamado e o máximo de pessoas à espera." },
              { title: "QR e NFC à entrada", body: "Entregamos o cartaz com o QR code e, se escolher, a placa NFC já programada com o link da fila." },
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
        description: "How Steevanz gets the waitlist running in your space: queue rules, QR and NFC at the door, dashboard and call screen.",
        blocks: [
          { type: "p", text: "We handle the setup with you. It is usually up and running within a few working days." },
          {
            type: "steps",
            items: [
              { title: "Discovery", body: "We talk about your space: busiest hours, whether customers come in groups or pick a service and staff member." },
              { title: "Queue configuration", body: "We create your space with its opening hours and set the average time per turn, the time to arrive after being called and the most people waiting." },
              { title: "QR and NFC at the door", body: "We deliver the poster with the QR code and, if you choose, the NFC plate programmed with the queue link." },
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
    },
    configuration: {
      pt: {
        title: "Configuração da lista de espera digital",
        description: "As regras da fila: tempo por vez, tempo para chegar, máximo à espera, o que perguntar ao cliente, abertura automática e privacidade.",
        blocks: [
          { type: "p", text: "As regras estão no separador **Definições** da lista de espera, na sua área de cliente." },
          {
            type: "table",
            head: ["Definição", "Para quê"],
            rows: [
              ["Minutos por vez (média)", "Base da espera estimada quando não se pergunta o serviço. Depois de 3 chamadas, conta também o ritmo real da última hora e meia. Com serviço, a espera soma a duração dos serviços à frente."],
              ["Tempo para chegar depois de chamado", "2, 3, 5, 10 ou 15 minutos (5 por omissão). O cliente deve esperar no local: vê «venha já» e até que horas guardamos a vez."],
              ["Máximo à espera", "Com a fila cheia, ninguém novo entra pelo QR."],
              ["Máximo de pessoas por grupo", "Limite no formulário de entrada. Só aparece quando se pergunta o número de pessoas."],
              ["O que perguntar", "Aparece o que faz sentido para o tipo de negócio (restaurante: pessoas; barbearia e cabeleireiro: serviço e profissional; clínica: serviço). O resto fica em «Mais opções»."],
              ["Abrir e fechar com o horário", "Ligado por omissão. A fila abre à hora de abertura e fecha à de fecho. Pode sempre mudar à mão."],
              ["Chamar logo o seguinte ao marcar «Não apareceu»", "Um toque em vez de dois."],
              ["Mensagem na página de entrada", "Um texto curto para o cliente, por exemplo para grupos grandes."],
            ],
          },
          { type: "h2", id: "estados", text: "Aberta, em pausa ou fechada" },
          {
            type: "ul",
            items: [
              "**Aberta:** os clientes entram pelo QR ou pela placa.",
              "**Em pausa:** ninguém novo entra; quem já está na fila continua a ser chamado.",
              "**Fechada:** ninguém entra pelo QR. A equipa pode sempre adicionar alguém ao balcão.",
            ],
          },
          { type: "h2", id: "privacidade", text: "Dados e privacidade" },
          {
            type: "ul",
            items: [
              "Guardamos só o nome, o que o cliente escolheu (pessoas, serviço) e o email, se o deixar.",
              "Os dados de cada entrada são apagados automaticamente ao fim de 30 dias.",
              "Os dados nunca são usados para marketing.",
            ],
          },
        ],
      },
      en: {
        title: "Configuring the digital waitlist",
        description: "The queue rules: time per turn, time to arrive, most people waiting, what to ask, automatic opening and privacy.",
        blocks: [
          { type: "p", text: "The rules are in the waitlist's **Settings** tab, in your client area." },
          {
            type: "table",
            head: ["Setting", "What it's for"],
            rows: [
              ["Minutes per turn (average)", "Basis for the estimated wait when no service is asked. After 3 calls it also uses the real pace of the last hour and a half. With a service, the wait adds up the durations of the services ahead."],
              ["Time to arrive after being called", "2, 3, 5, 10 or 15 minutes (5 by default). Customers should wait on site: they see «come now» and until what time their turn is held."],
              ["Most people waiting", "When the queue is full, nobody new joins by QR."],
              ["Most people per group", "Limit on the join form. Only shown when the number of people is asked."],
              ["What to ask", "What suits the kind of business is shown (restaurant: people; barbershop and salon: service and staff member; clinic: service). The rest is under «More options»."],
              ["Open and close with opening hours", "On by default. The queue opens at opening time and closes at closing time. You can always change it by hand."],
              ["Call the next one when marking «No-show»", "One tap instead of two."],
              ["Message on the join page", "A short note for customers, for example about large groups."],
            ],
          },
          { type: "h2", id: "states", text: "Open, paused or closed" },
          {
            type: "ul",
            items: [
              "**Open:** customers join by QR or the plate.",
              "**Paused:** nobody new joins; people already in the queue are still called.",
              "**Closed:** nobody joins by QR. Your team can always add someone at the desk.",
            ],
          },
          { type: "h2", id: "privacy", text: "Data and privacy" },
          {
            type: "ul",
            items: [
              "We only store the name, what the customer chose (people, service) and the email if they leave one.",
              "Each entry's data is deleted automatically after 30 days.",
              "Data is never used for marketing.",
            ],
          },
        ],
      },
    },
    usage: {
      pt: {
        title: "Utilização diária da lista de espera",
        description: "Como gerir a fila no dia a dia: chamar o seguinte, quem não aparece, adicionar ao balcão e fechar a fila.",
        blocks: [
          { type: "p", text: "Use o separador **Fila** do Balcão (ou da lista de espera) no telemóvel ou tablet do balcão. A página atualiza-se sozinha." },
          {
            type: "steps",
            items: [
              { title: "Chamar o seguinte", body: "Quando há mesa ou vez livre, carregue em «Chamar o seguinte». Se os clientes escolhem profissional, há um botão por profissional." },
              { title: "O cliente vem logo", body: "O telemóvel do cliente toca e a senha mostra até que horas guardamos a vez. Não precisa de marcar a chegada." },
              { title: "Se não aparecer", body: "Passado o tempo para chegar, carregue em «Não apareceu». Com a opção ligada, o seguinte é chamado logo." },
              { title: "As exceções", body: "Quando a fila pergunta o número de pessoas (restaurantes), cada grupo tem «Chamar»: ficou livre uma mesa de 2, chama-se o primeiro grupo que cabe, mesmo que não seja o seguinte. No «⋯» de cada pessoa: chamar fora da ordem, subir ou descer na fila, chamar outra vez, voltar à fila ou marcar que desistiu." },
            ],
          },
          { type: "h2", id: "balcao", text: "Adicionar alguém ao balcão" },
          { type: "p", text: "Para quem não quer usar o telemóvel: «Adicionar alguém ao balcão», só com o nome. Funciona mesmo com a fila fechada." },
          { type: "h2", id: "som", text: "Som de novas entradas" },
          { type: "p", text: "Ligue «Som de novas entradas» no aparelho do balcão para ouvir quando alguém entra na fila. Fica lembrado nesse aparelho." },
          {
            type: "callout",
            tone: "tip",
            text: "Se nada for marcado, a chamada fecha sozinha como atendida passado o tempo para chegar. «Não apareceu» serve para as estatísticas e para chamar logo o seguinte.",
          },
        ],
      },
      en: {
        title: "Using the waitlist day to day",
        description: "How to run the queue every day: calling the next one, no-shows, adding people at the desk and closing the queue.",
        blocks: [
          { type: "p", text: "Use the **Queue** tab of the Balcão (or of the waitlist) on the counter phone or tablet. The page updates by itself." },
          {
            type: "steps",
            items: [
              { title: "Call next", body: "When a table or turn is free, tap «Call next». If customers pick a staff member, there's one button per staff member." },
              { title: "The customer comes straight away", body: "The customer's phone rings and the ticket shows until what time their turn is held. There's nothing to mark on arrival." },
              { title: "If they don't show up", body: "After the time to arrive, tap «No-show». With the option on, the next one is called straight away." },
              { title: "Exceptions", body: "When the queue asks for the number of people (restaurants), each group has «Call»: a table for 2 is free, so you call the first group that fits, even if it is not next. In each person's «⋯»: call out of order, move up or down, call again, put back in the queue or mark that they left." },
            ],
          },
          { type: "h2", id: "desk", text: "Adding someone at the desk" },
          { type: "p", text: "For people who don't want to use their phone: «Add someone at the desk», with just a name. It works even with the queue closed." },
          { type: "h2", id: "sound", text: "Sound for new entries" },
          { type: "p", text: "Turn on «Sound for new entries» on the counter device to hear when someone joins. It is remembered on that device." },
          {
            type: "callout",
            tone: "tip",
            text: "If nothing is marked, the call closes by itself as served after the time to arrive. «No-show» is for the stats and to call the next one straight away.",
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
              "Com «Ativar avisos», o Android e os computadores recebem uma notificação mesmo com a página fechada. No iPhone isso só funciona com a senha adicionada ao ecrã principal (a página explica como); sem isso, toca só com a página aberta: recomende deixar o email.",
              "Se o cliente deixou email, peça para ver também na pasta de spam.",
              "Chame-o outra vez no «⋯» ou chame pelo número ao balcão.",
            ],
          },
          { type: "h2", id: "qr-nfc-nao-abre", text: "O QR ou a placa NFC não abrem a página" },
          {
            type: "ol",
            items: [
              "Confirme que o QR não está danificado nem com reflexos.",
              "Para a placa NFC, o NFC tem de estar ligado no telemóvel (alguns Android têm-no desligado).",
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
              "With «Turn on alerts», Android phones and computers get a notification even with the page closed. On iPhone that only works with the ticket added to the home screen (the page explains how); otherwise it only rings with the page open: suggest leaving an email.",
              "If the customer left an email, ask them to check their spam folder too.",
              "Call them again from the «⋯» or call their number at the desk.",
            ],
          },
          { type: "h2", id: "qr-nfc-not-opening", text: "The QR code or NFC plate does not open the page" },
          {
            type: "ol",
            items: [
              "Check the QR code isn't damaged or catching glare.",
              "For the NFC plate, NFC must be on in the phone (some Android phones have it off).",
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
    },
    faq: {
      pt: {
        title: "Perguntas frequentes sobre a lista de espera digital",
        description: "Respostas às dúvidas mais comuns sobre a lista de espera digital da Steevanz: aplicações, avisos, NFC, faltas, ecrã e RGPD.",
        blocks: [
          { type: "h2", id: "perguntas", text: "Perguntas e respostas" },
          {
            type: "faq",
            items: [
              { q: "O cliente precisa de instalar alguma app?", a: "Não. Entra pelo navegador, depois de ler o QR code ou tocar na placa NFC." },
              { q: "Como é avisado o cliente?", a: "Na página da senha (som, vibração no Android e notificação, com a página aberta) e por email, se o deixar. Não enviamos SMS nem WhatsApp." },
              { q: "Quanto tempo tem o cliente para chegar?", a: "O que definir: 2 a 15 minutos (5 por omissão). A senha mostra até que horas guardamos a vez." },
              { q: "O cliente pode avisar que já não vem?", a: "Sim. Com um toque na senha sai da fila, e a equipa chama o seguinte." },
              { q: "O tempo de espera mostrado é garantido?", a: "Não. É uma estimativa que se ajusta ao ritmo real da fila, e é sempre apresentada como estimativa." },
              { q: "E quem não quer usar o telemóvel?", a: "A equipa adiciona-o ao balcão só com o nome e chama-o quando for a vez." },
              { q: "Que dados são guardados?", a: "O nome, o que escolheu e o email, se o deixar. São apagados ao fim de 30 dias, de acordo com o RGPD." },
            ],
          },
          {
            type: "ul",
            items: [
              "[Configuração](/docs/lista-espera-digital/configuracao): regras da fila e privacidade.",
              "[Utilização](/docs/lista-espera-digital/utilizacao): chamar, faltas e balcão.",
              "[Resolução de problemas](/docs/lista-espera-digital/resolucao-problemas): avisos, QR, NFC e ecrã.",
            ],
          },
        ],
      },
      en: {
        title: "Digital waitlist FAQ",
        description: "Answers to common questions about the Steevanz digital waitlist: apps, alerts, NFC, no-shows, the call screen and GDPR.",
        blocks: [
          { type: "h2", id: "questions", text: "Questions and answers" },
          {
            type: "faq",
            items: [
              { q: "Do customers need to install an app?", a: "No. They join in the browser after scanning the QR code or tapping the NFC plate." },
              { q: "How are customers alerted?", a: "On their ticket page (sound, vibration on Android and a notification, with the page open) and by email if they leave one. We don't send SMS or WhatsApp messages." },
              { q: "How long do customers have to arrive?", a: "Whatever you set: 2 to 15 minutes (5 by default). The ticket shows until what time their turn is held." },
              { q: "Can customers say they are no longer coming?", a: "Yes. One tap on their ticket takes them out of the queue, and your team calls the next person." },
              { q: "Is the displayed wait time guaranteed?", a: "No. It's an estimate that adjusts to the queue's real pace, and it's always shown as an estimate." },
              { q: "What about people who don't want to use their phone?", a: "Your team adds them at the desk with just a name and calls them when it's their turn." },
              { q: "What data is stored?", a: "The name, what they chose and the email if they leave one. It's deleted after 30 days, in line with GDPR." },
            ],
          },
          {
            type: "ul",
            items: [
              "[Configuration](/en/docs/digital-waitlist/configuration): queue rules and privacy.",
              "[Usage](/en/docs/digital-waitlist/usage): calling, no-shows and the desk.",
              "[Troubleshooting](/en/docs/digital-waitlist/troubleshooting): alerts, QR code, NFC and the screen.",
            ],
          },
        ],
      },
    },
  },
};
