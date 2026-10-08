import type { ProductCopyByLocale } from "../types";

export const copy: ProductCopyByLocale = {
  pt: {
    name: "Lista de espera digital",
    shortName: "Lista de Espera",
    tagline: "Os clientes esperam onde quiserem e voltam quando for a vez deles.",
    summary:
      "Fila virtual por QR code ou NFC, com tempo de espera estimado e aviso no telemóvel quando a mesa ou a vez estiver pronta. Sem aglomerações à porta.",
    metaTitle: "Lista de Espera Digital e Fila Virtual | Steevanz",
    metaDescription:
      "Lista de espera digital para restaurantes, clínicas e salões: o cliente entra na fila por QR code ou NFC e é avisado no telemóvel quando chega a sua vez.",
    heroTitle: "Acabe com a fila à porta",
    heroSubtitle:
      "O cliente entra na lista de espera com um toque ou uma leitura de QR code, acompanha a posição e o tempo estimado no telemóvel e é avisado quando a mesa ou a vez estiver pronta. Pode esperar ali perto, sem ficar de pé à porta.",
    problem: {
      title: "A espera à porta afasta clientes",
      body:
        "Nas horas de maior movimento, forma-se uma fila à entrada ou uma sala de espera cheia. A equipa perde tempo a gerir nomes num papel e a responder a quem pergunta quanto falta. Alguns clientes desistem e vão para o vizinho sem que dê por isso.",
      points: [
        "Clientes que desistem ao ver a fila",
        "Listas em papel difíceis de gerir no pico",
        "Perguntas constantes sobre quanto tempo falta",
      ],
    },
    solution: {
      title: "Uma fila que não obriga ninguém a ficar parado",
      body:
        "Com a lista de espera digital, cada cliente sabe a sua posição e o tempo estimado, e é avisado no telemóvel quando for a sua vez. A equipa só carrega em «Chamar o seguinte».",
      points: [
        "Entrada na lista por QR code, NFC ou pela equipa",
        "Tempo de espera estimado visível para o cliente",
        "Aviso no telemóvel e por email",
        "Painel simples para chamar o próximo cliente",
      ],
    },
    steps: [
      {
        title: "O cliente entra na lista",
        body: "Lê o QR code ou toca na placa NFC à entrada, ou a sua equipa adiciona-o em segundos.",
      },
      {
        title: "Vê o tempo estimado",
        body: "Recebe a posição na fila e uma estimativa de espera, e pode sair e voltar.",
      },
      {
        title: "É avisado no telemóvel",
        body: "Quando a mesa ou a vez estiver pronta, a equipa carrega num botão: o telemóvel do cliente toca e, se deixou email, recebe também um email."
      },
    ],
    features: [
      {
        title: "Entrada sem esforço",
        body: "Placa NFC com QR code à entrada para o cliente se inscrever sozinho, ou registo rápido pela equipa para quem prefere falar ao balcão.",
      },
      {
        title: "Tempo estimado",
        body: "O sistema calcula uma estimativa com base no ritmo real da fila, para o cliente decidir se espera ali perto ou dá uma volta.",
      },
      {
        title: "Aviso no telemóvel",
        body: "Quando chega a vez, a página da senha toca e mostra para onde se dirigir; quem deixou email recebe também um email. Sem gritar nomes pela sala.",
      },
      {
        title: "Painel para a equipa",
        body: "Um ecrã simples no tablet ou no telemóvel mostra quem está à espera, há quanto tempo e quantas pessoas são em cada grupo.",
      },
      {
        title: "Sem app para o cliente",
        body: "Tudo funciona no navegador do telemóvel. O cliente não precisa de instalar nada nem de criar conta.",
      },
      {
        title: "Liga-se às reservas",
        body: "Se também usar o nosso sistema de reservas, a fila e as reservas de hoje ficam lado a lado no Balcão, para gerir a sala sem surpresas.",
      },
    ],
    useCases: [
      {
        sector: "restaurants",
        title: "Restaurantes sem reservas",
        body: "Ao fim de semana, os clientes deixam o nome na lista e vão tomar um café ao lado, em vez de ficarem de pé à porta.",
      },
      {
        sector: "clinics",
        title: "Clínicas e laboratórios",
        body: "Os pacientes esperam no carro ou lá fora, em vez de numa sala de espera cheia, e são chamados pelo telemóvel.",
      },
      {
        sector: "beauty",
        title: "Barbearias sem marcação",
        body: "Quem chega sem marcação entra na fila e sabe quanto tempo falta, sem ter de ficar sentado à espera.",
      },
    ],
    includes: [
      "Configuração da lista de espera à medida do seu espaço",
      "Placa NFC com QR code para a entrada",
      "Ecrã de chamada para uma TV à entrada (opcional)",
      "Painel para a equipa em tablet, telemóvel ou computador",
      "Formação rápida da equipa",
      "Suporte por WhatsApp e email",
    ],
    faq: [
      {
        q: "O cliente precisa de instalar alguma app?",
        a: "Não. Entra na lista pelo navegador, depois de ler o QR code ou tocar na placa NFC. Os iPhone XS e mais recentes e a maioria dos Android com NFC ligado leem a placa sem app; os restantes usam o QR code.",
      },
      {
        q: "E os clientes que não querem usar o telemóvel?",
        a: "A equipa adiciona-os à lista em segundos, só com o nome, e chama-os ao balcão quando for a vez.",
      },
      {
        q: "Quão fiável é o tempo estimado?",
        a: "É uma estimativa baseada no ritmo recente da fila e pode variar. O cliente é sempre avisado quando for realmente a sua vez.",
      },
      {
        q: "Que dados são guardados?",
        a: "Apenas o nome (e o email, se o cliente o deixar para ser avisado). Os dados são apagados ao fim de 30 dias, tratados de acordo com o RGPD e não são usados para outros fins.",
      },
      {
        q: "Posso cancelar o plano mensal?",
        a: "Pode. O plano é mensal e sem fidelização, e pode cancelar quando quiser.",
      },
    ],
  },
  en: {
    name: "Digital waitlist",
    shortName: "Waitlist",
    tagline: "Customers wait wherever they like and come back when it's their turn.",
    summary:
      "A virtual queue by QR code or NFC, with an estimated waiting time and a phone alert when the table or turn is ready. No crowd at the door.",
    metaTitle: "Digital Waitlist and Virtual Queue | Steevanz",
    metaDescription:
      "Digital waitlist for restaurants, clinics and salons: customers join the queue by QR code or NFC and are alerted on their phone when it's their turn.",
    heroTitle: "No more queue at the door",
    heroSubtitle:
      "Customers join the waitlist with a tap or a QR scan, follow their position and estimated wait on their phone and are alerted when their table or turn is ready. They can wait nearby instead of standing at the door.",
    problem: {
      title: "Waiting at the door drives customers away",
      body:
        "At peak times, a queue forms at the entrance or the waiting room fills up. Your team wastes time juggling names on paper and answering people asking how much longer. Some customers give up and go next door without you even noticing.",
      points: [
        "Customers who walk away when they see the queue",
        "Paper lists that are hard to manage at peak times",
        "Constant questions about how long is left",
      ],
    },
    solution: {
      title: "A queue that doesn't keep anyone standing still",
      body:
        "With a digital waitlist, every customer knows their position and estimated wait, and is alerted on their phone when it's their turn. Your team just taps «Call next».",
      points: [
        "Join by QR code, NFC or via your staff",
        "Estimated waiting time visible to the customer",
        "Alert on the phone and by email",
        "Simple dashboard to call the next customer",
      ],
    },
    steps: [
      {
        title: "Customers join the list",
        body: "They scan the QR code or tap the NFC plate at the entrance, or your staff add them in seconds.",
      },
      {
        title: "They see the estimated wait",
        body: "They get their position in the queue and an estimated wait, and are free to leave and come back.",
      },
      {
        title: "They're alerted by phone",
        body: "When the table or turn is ready, your staff press a button: the customer's phone rings and, if they left an email, they get an email too.",
      },
    ],
    features: [
      {
        title: "Effortless joining",
        body: "An NFC plate with QR code at the entrance lets customers sign up themselves, or staff can add anyone who prefers to ask at the desk.",
      },
      {
        title: "Estimated wait",
        body: "The system estimates the wait from the queue's real pace, so customers can decide whether to stay close or pop out.",
      },
      {
        title: "Alert on the phone",
        body: "When it's their turn, the ticket page rings and shows where to go; customers who left an email get an email too. No shouting names across the room.",
      },
      {
        title: "Staff dashboard",
        body: "A simple screen on tablet or phone shows who's waiting, for how long and how many people are in each group.",
      },
      {
        title: "No app for customers",
        body: "Everything runs in the phone's browser. Customers don't install anything or create an account.",
      },
      {
        title: "Works with bookings",
        body: "If you also use our booking system, the queue and today's bookings sit side by side, so you can run the floor without surprises.",
      },
    ],
    useCases: [
      {
        sector: "restaurants",
        title: "Walk-in restaurants",
        body: "At weekends, customers add their name to the list and grab a coffee nearby instead of standing at the door.",
      },
      {
        sector: "clinics",
        title: "Clinics and labs",
        body: "Patients wait in the car or outside rather than in a crowded waiting room, and are called by phone.",
      },
      {
        sector: "beauty",
        title: "Walk-in barbers",
        body: "Walk-ins join the queue and know how long is left, without having to sit and wait.",
      },
    ],
    includes: [
      "Waitlist set up around your space",
      "NFC plate with QR code for the entrance",
      "Call screen for a TV at the entrance (optional)",
      "Staff dashboard on tablet, phone or computer",
      "Quick staff training",
      "Support by WhatsApp and email",
    ],
    faq: [
      {
        q: "Do customers need to install an app?",
        a: "No. They join in the browser after scanning the QR code or tapping the NFC plate. iPhone XS and newer and most Android phones with NFC switched on read the plate without an app; everyone else uses the QR code.",
      },
      {
        q: "What about customers who don't want to use their phone?",
        a: "Your staff add them in seconds with just a name, and call them at the desk when it's their turn.",
      },
      {
        q: "How reliable is the estimated wait?",
        a: "It's an estimate based on the queue's recent pace and it can vary. Customers are always alerted when it's genuinely their turn.",
      },
      {
        q: "What data is stored?",
        a: "Only the name (and the email, if the customer leaves one to be alerted). Data is deleted after 30 days, handled in line with GDPR and never used for anything else.",
      },
      {
        q: "Can I cancel the monthly plan?",
        a: "Yes. The plan is monthly with no minimum term, and you can cancel whenever you like.",
      },
    ],
  },
};
