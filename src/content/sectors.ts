import type { Localized } from "@/lib/i18n";
import type { PhotoId } from "./media";
import type { FaqItem, ProductId, SectorId, TitledText } from "./types";

export interface SectorCopy {
  name: string;
  cardTitle: string;
  cardBody: string;
  metaTitle: string;
  metaDescription: string;
  heroTitle: string;
  heroSubtitle: string;
  pains: TitledText[];
  bundleTitle: string;
  bundleBody: string;
  dayInTheLife: TitledText[];
  faq: FaqItem[];
}

export interface Sector {
  id: SectorId;
  slug: Localized<string>;
  photo: PhotoId;
  bundle: ProductId[];
  copy: Localized<SectorCopy>;
}

export const sectors: Sector[] = [
  {
    id: "restaurants",
    slug: { pt: "restaurantes", en: "restaurants" },
    photo: "restaurant-table",
    bundle: ["nfc-google-reviews", "bookings", "waitlist", "ai-voice"],
    copy: {
      pt: {
        name: "Restaurantes e cafés",
        cardTitle: "Restaurantes e cafés",
        cardBody: "Mais reviews no Google, mesas cheias sem telefonemas perdidos e uma fila de espera que não entope a porta.",
        metaTitle: "Soluções NFC e IA para restaurantes | Steevanz",
        metaDescription: "Placas NFC para reviews no Google, reservas online, lista de espera por SMS e receção por voz com IA. Pensado para restaurantes e cafés em Portugal.",
        heroTitle: "A sala cheia. O telefone atendido. As reviews a crescer.",
        heroSubtitle: "Num restaurante, cada minuto de serviço conta. Juntamos as ferramentas que tiram trabalho à equipa e trazem mais clientes pela porta, sem apps para instalar e com a configuração feita por nós.",
        pains: [
          { title: "Clientes satisfeitos que nunca deixam review", body: "Saem contentes, mas ninguém se lembra de procurar o restaurante no Google. Quem escreve são sobretudo os descontentes." },
          { title: "O telefone toca em plena hora de ponta", body: "Entre a cozinha e a sala, ninguém consegue atender. Cada chamada perdida pode ser uma mesa de quatro que foi para o vizinho." },
          { title: "Uma fila à porta que desmotiva", body: "Grupos à espera no passeio, sem saber quanto tempo falta. Muitos desistem antes de a mesa ficar livre." },
        ],
        bundleTitle: "O pacote para restaurantes",
        bundleBody: "Placas NFC nas mesas e no balcão para pedir reviews no momento certo, reservas online com lembretes que reduzem as faltas, lista de espera digital com aviso por SMS e uma receção por voz que atende quando a equipa não pode.",
        dayInTheLife: [
          { title: "12:15 — Reservas a entrar sozinhas", body: "Os clientes reservam pelo Instagram e pelo perfil no Google. A confirmação e o lembrete seguem automaticamente." },
          { title: "13:30 — Casa cheia, fila organizada", body: "Quem chega sem reserva junta-se à lista de espera com um QR code e recebe um SMS quando a mesa está pronta." },
          { title: "14:45 — A conta e um toque", body: "Na altura de pagar, o empregado aponta para a placa na mesa. Um toque com o telemóvel e o cliente está no formulário de review." },
          { title: "22:30 — Telefone atendido depois de fechar", body: "A receção por voz responde a horários e morada, aceita reservas para amanhã e envia-lhe um resumo por WhatsApp." },
        ],
        faq: [
          { q: "Preciso de mudar o meu sistema de reservas atual?", a: "Não obrigatoriamente. Se já usa uma plataforma de que gosta, podemos começar pelas placas NFC e pela lista de espera. Na demonstração analisamos o que faz sentido manter." },
          { q: "As placas aguentam o ambiente de um restaurante?", a: "Sim. São em acrílico resistente, limpam-se com um pano húmido e o chip fica protegido dentro da placa. Não use lixívia nem produtos abrasivos." },
          { q: "Quanto tempo demora a pôr tudo a funcionar?", a: "As placas NFC ficam prontas em poucos dias úteis. Reservas e lista de espera costumam estar ativas numa a duas semanas, incluindo a formação da equipa." },
        ],
      },
      en: {
        name: "Restaurants and cafés",
        cardTitle: "Restaurants and cafés",
        cardBody: "More Google reviews, full tables without missed calls and a waiting list that doesn't block the door.",
        metaTitle: "NFC and AI solutions for restaurants | Steevanz",
        metaDescription: "NFC plates for Google reviews, online bookings, SMS waiting lists and an AI voice receptionist. Built for restaurants and cafés in Portugal.",
        heroTitle: "A full room. Every call answered. Reviews climbing.",
        heroSubtitle: "In a restaurant, every minute of service counts. We bring together the tools that take work off your team and bring more guests through the door, with no apps to install and the setup done by us.",
        pains: [
          { title: "Happy guests who never leave a review", body: "They leave smiling, but nobody remembers to look you up on Google. The people who do write are mostly the unhappy ones." },
          { title: "The phone rings mid-rush", body: "Between the kitchen and the floor, nobody can pick up. Every missed call could be a table of four that went next door." },
          { title: "A queue at the door that puts people off", body: "Groups waiting on the pavement with no idea how long it will take. Many give up before a table frees up." },
        ],
        bundleTitle: "The restaurant bundle",
        bundleBody: "NFC plates on tables and at the counter to ask for reviews at the right moment, online bookings with reminders that cut no-shows, a digital waiting list with SMS alerts and a voice receptionist that answers when your team can't.",
        dayInTheLife: [
          { title: "12:15 — Bookings coming in on their own", body: "Guests book from Instagram and your Google profile. Confirmation and reminder go out automatically." },
          { title: "13:30 — Full house, orderly queue", body: "Walk-ins join the waiting list with a QR code and get a text when their table is ready." },
          { title: "14:45 — The bill and a tap", body: "When paying, the waiter points to the plate on the table. One tap and the guest is on the review form." },
          { title: "22:30 — Calls answered after closing", body: "The voice receptionist gives opening hours and directions, takes bookings for tomorrow and sends you a WhatsApp summary." },
        ],
        faq: [
          { q: "Do I need to replace my current booking system?", a: "Not necessarily. If you already use a platform you like, we can start with NFC plates and the waiting list. In the demo we look at what's worth keeping." },
          { q: "Will the plates survive a restaurant environment?", a: "Yes. They are made of tough acrylic, wipe clean with a damp cloth and the chip is sealed inside. Avoid bleach and abrasive products." },
          { q: "How long does it take to get everything running?", a: "NFC plates are ready within a few working days. Bookings and the waiting list are usually live in one to two weeks, including staff training." },
        ],
      },
    },
  },
  {
    id: "beauty",
    slug: { pt: "cabeleireiros-estetica", en: "salons-beauty" },
    photo: "salon-chair",
    bundle: ["bookings", "nfc-google-reviews", "loyalty", "ai-chatbot"],
    copy: {
      pt: {
        name: "Cabeleireiros e estética",
        cardTitle: "Cabeleireiros e estética",
        cardBody: "Agenda sempre cheia, menos faltas e clientes que voltam por causa do cartão de fidelidade no telemóvel.",
        metaTitle: "Marcações online e NFC para cabeleireiros | Steevanz",
        metaDescription: "Agenda online com lembretes por WhatsApp, placas NFC para reviews, cartão de fidelidade digital e chatbot com IA para cabeleireiros e centros de estética.",
        heroTitle: "Mãos ocupadas com clientes, não com o telemóvel.",
        heroSubtitle: "Entre um corte e uma coloração não há tempo para responder a mensagens. Deixe as marcações, os lembretes e as perguntas repetidas connosco e concentre-se no que faz melhor.",
        pains: [
          { title: "Mensagens a toda a hora para marcar", body: "\"Tem vaga sábado?\" chega por Instagram, WhatsApp e telefone, muitas vezes enquanto está com um cliente na cadeira." },
          { title: "Faltas que deixam buracos na agenda", body: "Uma marcação esquecida é uma hora de trabalho perdida que já não se recupera." },
          { title: "Clientes que experimentam e não voltam", body: "Sem um motivo concreto para regressar, é fácil o cliente ir ao salão mais perto de casa na próxima vez." },
        ],
        bundleTitle: "O pacote para salões",
        bundleBody: "Marcações online por serviço e por profissional, lembretes automáticos, cartão de fidelidade sem app, placas NFC para reviews junto ao espelho ou à caixa e um chatbot que responde a preços e disponibilidade 24 horas por dia.",
        dayInTheLife: [
          { title: "08:00 — Agenda do dia já confirmada", body: "Os lembretes saíram na véspera. Quem não pode vir remarcou sozinho e a vaga voltou a ficar disponível." },
          { title: "11:00 — Perguntas respondidas sem parar o trabalho", body: "O chatbot responde a preços, duração dos serviços e horários, e envia o link de marcação." },
          { title: "16:30 — Carimbo digital na caixa", body: "O cliente encosta o telemóvel e ganha mais um carimbo. Ao décimo, o tratamento de oferta aparece automaticamente." },
          { title: "19:00 — Review no Google antes de sair", body: "Uma placa discreta ao lado do espelho lembra o cliente de partilhar o novo visual e a experiência." },
        ],
        faq: [
          { q: "Cada profissional pode ter a sua própria agenda?", a: "Sim. Cada pessoa tem os seus serviços, horários e folgas. O cliente pode escolher com quem quer marcar ou deixar ao critério do salão." },
          { q: "O cartão de fidelidade obriga os clientes a instalar uma app?", a: "Não. O cartão abre no navegador e pode ser guardado na carteira do telemóvel. O cliente só precisa de um toque ou de ler um QR code." },
          { q: "Posso cobrar um sinal nas marcações mais longas?", a: "Podemos configurar pedido de sinal para serviços específicos, como colorações ou tratamentos longos. Falamos dos detalhes na demonstração." },
        ],
      },
      en: {
        name: "Hair salons and beauty",
        cardTitle: "Hair salons and beauty",
        cardBody: "A full diary, fewer no-shows and clients who come back thanks to a loyalty card on their phone.",
        metaTitle: "Online bookings and NFC for salons | Steevanz",
        metaDescription: "Online appointments with WhatsApp reminders, NFC plates for Google reviews, a digital loyalty card and an AI chatbot for hair salons and beauty clinics.",
        heroTitle: "Hands busy with clients, not with your phone.",
        heroSubtitle: "Between a cut and a colour there's no time to answer messages. Leave bookings, reminders and repeated questions to us and focus on what you do best.",
        pains: [
          { title: "Booking messages all day long", body: "\"Any slots on Saturday?\" arrives via Instagram, WhatsApp and phone, often while you have a client in the chair." },
          { title: "No-shows that leave gaps in the diary", body: "A forgotten appointment is an hour of work lost that you never get back." },
          { title: "Clients who try you once and don't return", body: "Without a clear reason to come back, it's easy for a client to pick the salon closest to home next time." },
        ],
        bundleTitle: "The salon bundle",
        bundleBody: "Online bookings by service and by stylist, automatic reminders, a loyalty card with no app, NFC review plates by the mirror or the till and a chatbot that answers prices and availability around the clock.",
        dayInTheLife: [
          { title: "08:00 — Today's diary already confirmed", body: "Reminders went out yesterday. Anyone who can't make it rescheduled on their own and the slot opened up again." },
          { title: "11:00 — Questions answered without stopping work", body: "The chatbot answers prices, service lengths and opening hours, then sends the booking link." },
          { title: "16:30 — A digital stamp at the till", body: "The client taps their phone and earns another stamp. On the tenth, the free treatment appears automatically." },
          { title: "19:00 — A Google review before leaving", body: "A discreet plate next to the mirror reminds clients to share their new look and experience." },
        ],
        faq: [
          { q: "Can each stylist have their own diary?", a: "Yes. Each person has their own services, hours and days off. Clients can choose who to book with or leave it to the salon." },
          { q: "Do clients need to install an app for the loyalty card?", a: "No. The card opens in the browser and can be saved to the phone's wallet. Clients just tap or scan a QR code." },
          { q: "Can I take a deposit for longer appointments?", a: "We can set up deposits for specific services such as colouring or long treatments. We'll go through the details in the demo." },
        ],
      },
    },
  },
  {
    id: "clinics",
    slug: { pt: "clinicas", en: "clinics" },
    photo: "clinic",
    bundle: ["bookings", "ai-voice", "waitlist", "ai-reviews"],
    copy: {
      pt: {
        name: "Clínicas e consultórios",
        cardTitle: "Clínicas e consultórios",
        cardBody: "Receção que atende sempre, marcações com lembrete e uma sala de espera mais calma para os pacientes.",
        metaTitle: "Receção com IA e marcações para clínicas | Steevanz",
        metaDescription: "Receção por voz com IA, marcações online com lembretes, sala de espera digital e gestão de reviews para clínicas dentárias, fisioterapia e consultórios.",
        heroTitle: "Uma receção que nunca deixa um paciente sem resposta.",
        heroSubtitle: "A receção de uma clínica divide-se entre o balcão, o telefone e os e-mails. Automatizamos o que é repetitivo para que a equipa tenha tempo para as pessoas que estão à sua frente.",
        pains: [
          { title: "Chamadas perdidas são consultas perdidas", body: "Quando a rececionista está a atender um paciente ao balcão, o telefone fica a tocar. Muitos não voltam a ligar." },
          { title: "Faltas às consultas", body: "Cada falta sem aviso é tempo clínico desperdiçado e um paciente em lista de espera que podia ter sido atendido." },
          { title: "Uma sala de espera cheia e ansiosa", body: "Sem saber quanto falta, os pacientes perguntam repetidamente ao balcão e a tensão aumenta." },
        ],
        bundleTitle: "O pacote para clínicas",
        bundleBody: "Receção por voz com IA que atende, esclarece dúvidas administrativas e marca consultas, agenda online por tipo de consulta e profissional, aviso por SMS quando é a vez do paciente e acompanhamento das reviews no Google.",
        dayInTheLife: [
          { title: "07:45 — Marcações feitas durante a noite", body: "Pacientes que ligaram fora de horas foram atendidos pela receção por voz e as consultas já estão na agenda." },
          { title: "10:00 — Balcão livre para quem chega", body: "As dúvidas sobre horários, acordos e preparação para exames são respondidas automaticamente ao telefone." },
          { title: "15:20 — Espera sem ansiedade", body: "O paciente pode ir tomar um café. Recebe um SMS quando faltarem poucos minutos para a consulta." },
          { title: "18:30 — Reviews acompanhadas", body: "Recebe um alerta se surgir uma review negativa e uma proposta de resposta cuidadosa, sem dados clínicos." },
        ],
        faq: [
          { q: "A IA dá conselhos médicos aos pacientes?", a: "Não. A receção por voz e o chatbot tratam apenas de questões administrativas: horários, marcações, preços e preparação indicada pela clínica. Situações clínicas são encaminhadas para a equipa." },
          { q: "Como são tratados os dados dos pacientes?", a: "Recolhemos apenas o necessário para a marcação, com base legal adequada ao RGPD, e assinamos um acordo de subcontratação com a clínica. Dados de saúde não são pedidos nem guardados pelos nossos sistemas." },
          { q: "Funciona com vários médicos e especialidades?", a: "Sim. Cada profissional tem a sua agenda, tipos de consulta, durações e horários próprios." },
        ],
      },
      en: {
        name: "Clinics and practices",
        cardTitle: "Clinics and practices",
        cardBody: "A front desk that always answers, appointments with reminders and a calmer waiting room for patients.",
        metaTitle: "AI receptionist and bookings for clinics | Steevanz",
        metaDescription: "AI voice receptionist, online appointments with reminders, a digital waiting room and review management for dental clinics, physiotherapy and private practices.",
        heroTitle: "A front desk that never leaves a patient unanswered.",
        heroSubtitle: "A clinic's front desk is split between the counter, the phone and the inbox. We automate the repetitive work so your team has time for the people in front of them.",
        pains: [
          { title: "Missed calls are missed appointments", body: "When the receptionist is helping a patient at the desk, the phone keeps ringing. Many callers never try again." },
          { title: "Appointment no-shows", body: "Every unannounced no-show is wasted clinical time and a patient on the waiting list who could have been seen." },
          { title: "A crowded, anxious waiting room", body: "Without knowing how long is left, patients keep asking at the desk and tension rises." },
        ],
        bundleTitle: "The clinic bundle",
        bundleBody: "An AI voice receptionist that answers, handles admin questions and books appointments, online scheduling by appointment type and practitioner, SMS alerts when it's the patient's turn and monitoring of your Google reviews.",
        dayInTheLife: [
          { title: "07:45 — Appointments booked overnight", body: "Patients who called after hours were handled by the voice receptionist and their appointments are already in the diary." },
          { title: "10:00 — A free desk for walk-ins", body: "Questions about hours, insurance agreements and test preparation are answered automatically on the phone." },
          { title: "15:20 — Waiting without anxiety", body: "Patients can step out for a coffee. They get a text when their appointment is a few minutes away." },
          { title: "18:30 — Reviews under control", body: "You get an alert if a negative review appears, plus a careful draft reply with no clinical details." },
        ],
        faq: [
          { q: "Does the AI give patients medical advice?", a: "No. The voice receptionist and chatbot handle administrative questions only: hours, appointments, prices and preparation instructions set by the clinic. Clinical matters are passed to your team." },
          { q: "How is patient data handled?", a: "We collect only what is needed for the booking, on a lawful GDPR basis, and sign a data processing agreement with the clinic. Our systems do not ask for or store health data." },
          { q: "Does it work with multiple doctors and specialities?", a: "Yes. Each practitioner has their own diary, appointment types, durations and hours." },
        ],
      },
    },
  },
  {
    id: "retail",
    slug: { pt: "comercio", en: "retail" },
    photo: "shop-owner",
    bundle: ["nfc-google-reviews", "nfc-social", "loyalty", "ai-chatbot"],
    copy: {
      pt: {
        name: "Comércio local",
        cardTitle: "Comércio local",
        cardBody: "Mais seguidores, mais reviews e clientes que regressam, com tecnologia simples no balcão e na montra.",
        metaTitle: "NFC e fidelização para comércio local | Steevanz",
        metaDescription: "Placas NFC para reviews no Google e redes sociais, cartão de fidelidade digital e chatbot com IA para lojas, padarias, floristas e comércio de bairro.",
        heroTitle: "A loja do bairro, com a força das grandes marcas.",
        heroSubtitle: "Os clientes gostam de comprar perto de casa. Ajudamos a que o encontrem no Google, o sigam nas redes sociais e voltem, com ferramentas simples que funcionam a partir do balcão.",
        pains: [
          { title: "Pouca visibilidade no Google", body: "Quem procura \"florista perto de mim\" escolhe quem tem mais reviews e melhor nota. Lojas excelentes ficam escondidas." },
          { title: "Redes sociais que crescem devagar", body: "Pedir a um cliente que procure a conta e escreva o nome certo faz perder a maioria pelo caminho." },
          { title: "Cartões de carimbos em papel", body: "Perdem-se, esquecem-se em casa e não dizem nada sobre quem são os clientes mais fiéis." },
        ],
        bundleTitle: "O pacote para comércio",
        bundleBody: "Placa NFC no balcão para reviews no Google, placa ou autocolante na montra para seguir nas redes sociais, cartão de fidelidade digital sem app e um chatbot que responde a stock, horários e encomendas.",
        dayInTheLife: [
          { title: "09:00 — A montra a trabalhar", body: "Quem passa com a loja fechada toca no autocolante da montra e segue a conta de Instagram." },
          { title: "12:30 — Pagamento e carimbo", body: "Ao pagar, o cliente encosta o telemóvel e acumula mais um carimbo no cartão de fidelidade digital." },
          { title: "17:00 — Review com um toque", body: "Um cliente habitual elogia a loja. Basta apontar para a placa no balcão." },
          { title: "21:00 — Perguntas respondidas", body: "O chatbot diz se há bolo de laranja amanhã e como encomendar para sábado." },
        ],
        faq: [
          { q: "Tenho uma loja pequena. Isto é para mim?", a: "Sim. As placas NFC são um investimento único e baixo, e os serviços mensais não têm fidelização longa. Começamos pelo que traz retorno mais rápido." },
          { q: "Posso mudar o link da placa mais tarde?", a: "Sim. As nossas placas usam um endereço que gerimos por si, por isso podemos mudar o destino sem reimprimir nada." },
          { q: "Funciona se o cliente tiver um telemóvel antigo?", a: "Todas as placas têm também um QR code. Quem não tiver NFC ativo aponta a câmara e chega ao mesmo sítio." },
        ],
      },
      en: {
        name: "Local retail",
        cardTitle: "Local retail",
        cardBody: "More followers, more reviews and returning customers, with simple tech at the counter and in the window.",
        metaTitle: "NFC and loyalty for local shops | Steevanz",
        metaDescription: "NFC plates for Google reviews and social media, a digital loyalty card and an AI chatbot for shops, bakeries, florists and neighbourhood retail.",
        heroTitle: "Your neighbourhood shop, with big-brand muscle.",
        heroSubtitle: "People love buying close to home. We help them find you on Google, follow you on social media and come back, with simple tools that work from your counter.",
        pains: [
          { title: "Low visibility on Google", body: "Anyone searching \"florist near me\" picks the one with the most reviews and the best rating. Great shops stay hidden." },
          { title: "Social accounts that grow slowly", body: "Asking a customer to search your handle and type it correctly loses most of them along the way." },
          { title: "Paper stamp cards", body: "They get lost, left at home and tell you nothing about who your most loyal customers are." },
        ],
        bundleTitle: "The retail bundle",
        bundleBody: "An NFC plate at the counter for Google reviews, a plate or sticker in the window to follow you on social media, a digital loyalty card with no app and a chatbot that answers stock, hours and order questions.",
        dayInTheLife: [
          { title: "09:00 — The window at work", body: "Passers-by tap the window sticker while you're closed and follow your Instagram account." },
          { title: "12:30 — Pay and stamp", body: "When paying, the customer taps their phone and collects another stamp on the digital loyalty card." },
          { title: "17:00 — A review in one tap", body: "A regular praises the shop. Just point to the plate on the counter." },
          { title: "21:00 — Questions answered", body: "The chatbot says whether there'll be orange cake tomorrow and how to order for Saturday." },
        ],
        faq: [
          { q: "I run a small shop. Is this for me?", a: "Yes. NFC plates are a low one-off cost and monthly services have no long lock-in. We start with what pays back fastest." },
          { q: "Can I change where the plate points later?", a: "Yes. Our plates use an address we manage for you, so we can change the destination without reprinting anything." },
          { q: "Does it work if a customer has an older phone?", a: "Every plate also carries a QR code. Anyone without NFC switched on points the camera and lands in the same place." },
        ],
      },
    },
  },
];

export function getSector(id: SectorId): Sector {
  const sector = sectors.find((candidate) => candidate.id === id);
  if (!sector) throw new Error(`Unknown sector ${id}`);
  return sector;
}
