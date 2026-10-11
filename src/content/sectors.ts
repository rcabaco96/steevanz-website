import type { Localized } from "@/lib/i18n";
import type { PhotoId } from "./media";
import { sectorSlugs } from "./sector-slugs";
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

export interface SectorPackCopy {
  badge: string;
  eyebrow: string;
  title: string;
  body: string;
  items: string[];
  setupLabel: string;
  monthlyLabel: string;
  /** {setup} and {monthly} are replaced with the prices of each extra property. */
  extraProperty: string;
  /** {setup} and {monthly} are replaced with the prices of the same products bought separately. */
  separately: string;
  website: string;
  note: string;
  requestInfo: string;
}

// A bundle sold through the demo (not the cart): the cart has one billing per product and no bundle discounts.
export interface SectorPack {
  setup: number;
  monthly: number;
  extraSetup: number;
  extraMonthly: number;
  separatelySetup: number;
  separatelyMonthly: number;
  /** Product the demo and info-request forms open with. */
  demoProduct: ProductId;
  isProvisional: boolean;
  copy: Localized<SectorPackCopy>;
}

export type SectorSide = { kind: "photo"; photo: PhotoId } | { kind: "product"; productId: ProductId };

export interface Sector {
  id: SectorId;
  slug: Localized<string>;
  photo: PhotoId;
  /** Picture next to the "day in the life" timeline when the sector has no video. */
  side: SectorSide;
  bundle: ProductId[];
  /** Honest limits of the bundle for this sector, shown under the recommended products. */
  bundleNote?: Localized<string>;
  pack?: SectorPack;
  copy: Localized<SectorCopy>;
}

export const sectors: Sector[] = [
  {
    id: "restaurants",
    slug: sectorSlugs.restaurants,
    photo: "restaurant-table",
    side: { kind: "photo", photo: "retail" },
    bundle: ["nfc-google-reviews", "bookings", "waitlist", "ai-voice"],
    copy: {
      pt: {
        name: "Restaurantes e cafés",
        cardTitle: "Restaurantes e cafés",
        cardBody: "Mais reviews no Google, mesas cheias sem telefonemas perdidos e uma fila de espera que não entope a porta.",
        metaTitle: "Placas e IA para restaurantes | Steevanz",
        metaDescription: "Placas para reviews no Google, reservas online, lista de espera digital e receção por voz com IA. Pensado para restaurantes e cafés em Portugal.",
        heroTitle: "A sala cheia. O telefone atendido. As reviews a crescer.",
        heroSubtitle: "Num restaurante, cada minuto de serviço conta. Juntamos as ferramentas que tiram trabalho à equipa e trazem mais clientes pela porta, sem apps para instalar e com a configuração feita por nós.",
        pains: [
          { title: "Clientes satisfeitos que nunca deixam review", body: "Saem contentes, mas ninguém se lembra de procurar o restaurante no Google. Quem escreve são sobretudo os descontentes." },
          { title: "O telefone toca em plena hora de ponta", body: "Entre a cozinha e a sala, ninguém consegue atender. Cada chamada perdida pode ser uma mesa de quatro que foi para o vizinho." },
          { title: "Uma fila à porta que desmotiva", body: "Grupos à espera no passeio, sem saber quanto tempo falta. Muitos desistem antes de a mesa ficar livre." },
        ],
        bundleTitle: "O pacote para restaurantes",
        bundleBody: "Placas nas mesas e no balcão para pedir reviews no momento certo, reservas online com lembretes que reduzem as faltas, lista de espera digital com aviso no telemóvel e uma receção por voz que atende quando a equipa não pode.",
        dayInTheLife: [
          { title: "12:15 — Reservas a entrar sozinhas", body: "Os clientes reservam pelo Instagram e pelo perfil no Google. A confirmação e o lembrete seguem automaticamente." },
          { title: "13:30 — Casa cheia, fila organizada", body: "Quem chega sem reserva junta-se à lista de espera com um QR code e é avisado no telemóvel quando a mesa está pronta." },
          { title: "14:45 — A conta e um toque", body: "Na altura de pagar, o empregado aponta para a placa na mesa. Um toque com o telemóvel e o cliente está no formulário de review." },
          { title: "22:30 — Telefone atendido depois de fechar", body: "A receção por voz responde a horários e morada, aceita reservas para amanhã e envia-lhe um resumo por WhatsApp." },
        ],
        faq: [
          { q: "Preciso de mudar o meu sistema de reservas atual?", a: "Não obrigatoriamente. Se já usa uma plataforma de que gosta, podemos começar pelas placas e pela lista de espera. Na demonstração analisamos o que faz sentido manter." },
          { q: "As placas aguentam o ambiente de um restaurante?", a: "Sim. São em acrílico resistente, limpam-se com um pano húmido e o chip fica protegido dentro da placa. Não use lixívia nem produtos abrasivos." },
          { q: "Quanto tempo demora a pôr tudo a funcionar?", a: "As placas ficam prontas em poucos dias úteis. Reservas e lista de espera costumam estar ativas numa a duas semanas, incluindo a formação da equipa." },
        ],
      },
      en: {
        name: "Restaurants and cafés",
        cardTitle: "Restaurants and cafés",
        cardBody: "More Google reviews, full tables without missed calls and a waiting list that doesn't block the door.",
        metaTitle: "Plates and AI for restaurants | Steevanz",
        metaDescription: "Plates for Google reviews, online bookings, digital waiting lists and an AI voice receptionist. Built for restaurants and cafés in Portugal.",
        heroTitle: "A full room. Every call answered. Reviews climbing.",
        heroSubtitle: "In a restaurant, every minute of service counts. We bring together the tools that take work off your team and bring more guests through the door, with no apps to install and the setup done by us.",
        pains: [
          { title: "Happy guests who never leave a review", body: "They leave smiling, but nobody remembers to look you up on Google. The people who do write are mostly the unhappy ones." },
          { title: "The phone rings mid-rush", body: "Between the kitchen and the floor, nobody can pick up. Every missed call could be a table of four that went next door." },
          { title: "A queue at the door that puts people off", body: "Groups waiting on the pavement with no idea how long it will take. Many give up before a table frees up." },
        ],
        bundleTitle: "The restaurant bundle",
        bundleBody: "Plates on tables and at the counter to ask for reviews at the right moment, online bookings with reminders that cut no-shows, a digital waiting list with phone alerts and a voice receptionist that answers when your team can't.",
        dayInTheLife: [
          { title: "12:15 — Bookings coming in on their own", body: "Guests book from Instagram and your Google profile. Confirmation and reminder go out automatically." },
          { title: "13:30 — Full house, orderly queue", body: "Walk-ins join the waiting list with a QR code and get a text when their table is ready." },
          { title: "14:45 — The bill and a tap", body: "When paying, the waiter points to the plate on the table. One tap and the guest is on the review form." },
          { title: "22:30 — Calls answered after closing", body: "The voice receptionist gives opening hours and directions, takes bookings for tomorrow and sends you a WhatsApp summary." },
        ],
        faq: [
          { q: "Do I need to replace my current booking system?", a: "Not necessarily. If you already use a platform you like, we can start with the plates and the waiting list. In the demo we look at what's worth keeping." },
          { q: "Will the plates survive a restaurant environment?", a: "Yes. They are made of tough acrylic, wipe clean with a damp cloth and the chip is sealed inside. Avoid bleach and abrasive products." },
          { q: "How long does it take to get everything running?", a: "The plates are ready within a few working days. Bookings and the waiting list are usually live in one to two weeks, including staff training." },
        ],
      },
    },
  },
  {
    id: "beauty",
    slug: sectorSlugs.beauty,
    photo: "salon-chair",
    side: { kind: "photo", photo: "retail" },
    bundle: ["bookings", "nfc-google-reviews", "loyalty", "ai-chatbot"],
    copy: {
      pt: {
        name: "Cabeleireiros e estética",
        cardTitle: "Cabeleireiros e estética",
        cardBody: "Agenda sempre cheia, menos faltas e clientes que voltam por causa do cartão de fidelidade no telemóvel.",
        metaTitle: "Marcações online e placas para cabeleireiros | Steevanz",
        metaDescription: "Agenda online com lembretes por email, placas para reviews, cartão de fidelidade digital e chatbot com IA para cabeleireiros e centros de estética.",
        heroTitle: "Mãos ocupadas com clientes, não com o telemóvel.",
        heroSubtitle: "Entre um corte e uma coloração não há tempo para responder a mensagens. Deixe as marcações, os lembretes e as perguntas repetidas connosco e concentre-se no que faz melhor.",
        pains: [
          { title: "Mensagens a toda a hora para marcar", body: "\"Tem vaga sábado?\" chega por Instagram, WhatsApp e telefone, muitas vezes enquanto está com um cliente na cadeira." },
          { title: "Faltas que deixam buracos na agenda", body: "Uma marcação esquecida é uma hora de trabalho perdida que já não se recupera." },
          { title: "Clientes que experimentam e não voltam", body: "Sem um motivo concreto para regressar, é fácil o cliente ir ao salão mais perto de casa na próxima vez." },
        ],
        bundleTitle: "O pacote para salões",
        bundleBody: "Marcações online por serviço e por profissional, lembretes automáticos, cartão de fidelidade sem app, placas para reviews junto ao espelho ou à caixa e um chatbot que responde a preços e disponibilidade 24 horas por dia.",
        dayInTheLife: [
          { title: "08:00 — Agenda do dia já confirmada", body: "Os lembretes saíram na véspera. Quem não pode vir remarcou sozinho e a vaga voltou a ficar disponível." },
          { title: "11:00 — Perguntas respondidas sem parar o trabalho", body: "O chatbot responde a preços, duração dos serviços e horários, e envia o link de marcação." },
          { title: "16:30 — Carimbo digital na caixa", body: "O cliente encosta o telemóvel e ganha mais um carimbo. Ao décimo, o tratamento de oferta aparece automaticamente." },
          { title: "19:00 — Review no Google antes de sair", body: "Uma placa discreta ao lado do espelho lembra o cliente de partilhar o novo visual e a experiência." },
        ],
        faq: [
          { q: "Cada profissional pode ter a sua própria agenda?", a: "Sim. Cada pessoa tem os seus serviços, horários e folgas. O cliente pode escolher com quem quer marcar ou deixar ao critério do salão." },
          { q: "O cartão de fidelidade obriga os clientes a instalar uma app?", a: "Não. O cartão abre no navegador e pode ficar no ecrã principal do telemóvel. O cliente só precisa de um toque ou de ler um QR code." },
          { q: "Posso cobrar um sinal nas marcações mais longas?", a: "Podemos configurar pedido de sinal para serviços específicos, como colorações ou tratamentos longos. Falamos dos detalhes na demonstração." },
        ],
      },
      en: {
        name: "Hair salons and beauty",
        cardTitle: "Hair salons and beauty",
        cardBody: "A full diary, fewer no-shows and clients who come back thanks to a loyalty card on their phone.",
        metaTitle: "Online bookings and review plates for salons | Steevanz",
        metaDescription: "Online appointments with email reminders, plates for Google reviews, a digital loyalty card and an AI chatbot for hair salons and beauty clinics.",
        heroTitle: "Hands busy with clients, not with your phone.",
        heroSubtitle: "Between a cut and a colour there's no time to answer messages. Leave bookings, reminders and repeated questions to us and focus on what you do best.",
        pains: [
          { title: "Booking messages all day long", body: "\"Any slots on Saturday?\" arrives via Instagram, WhatsApp and phone, often while you have a client in the chair." },
          { title: "No-shows that leave gaps in the diary", body: "A forgotten appointment is an hour of work lost that you never get back." },
          { title: "Clients who try you once and don't return", body: "Without a clear reason to come back, it's easy for a client to pick the salon closest to home next time." },
        ],
        bundleTitle: "The salon bundle",
        bundleBody: "Online bookings by service and by stylist, automatic reminders, a loyalty card with no app, review plates by the mirror or the till and a chatbot that answers prices and availability around the clock.",
        dayInTheLife: [
          { title: "08:00 — Today's diary already confirmed", body: "Reminders went out yesterday. Anyone who can't make it rescheduled on their own and the slot opened up again." },
          { title: "11:00 — Questions answered without stopping work", body: "The chatbot answers prices, service lengths and opening hours, then sends the booking link." },
          { title: "16:30 — A digital stamp at the till", body: "The client taps their phone and earns another stamp. On the tenth, the free treatment appears automatically." },
          { title: "19:00 — A Google review before leaving", body: "A discreet plate next to the mirror reminds clients to share their new look and experience." },
        ],
        faq: [
          { q: "Can each stylist have their own diary?", a: "Yes. Each person has their own services, hours and days off. Clients can choose who to book with or leave it to the salon." },
          { q: "Do clients need to install an app for the loyalty card?", a: "No. The card opens in the browser and can sit on the phone's home screen. Clients just tap or scan a QR code." },
          { q: "Can I take a deposit for longer appointments?", a: "We can set up deposits for specific services such as colouring or long treatments. We'll go through the details in the demo." },
        ],
      },
    },
  },
  {
    id: "clinics",
    slug: sectorSlugs.clinics,
    photo: "clinic",
    side: { kind: "photo", photo: "reception-phone" },
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
        bundleBody: "Receção por voz com IA que atende, esclarece dúvidas administrativas e marca consultas, agenda online por tipo de consulta e profissional, aviso no telemóvel quando é a vez do paciente e acompanhamento das reviews no Google.",
        dayInTheLife: [
          { title: "07:45 — Marcações feitas durante a noite", body: "Pacientes que ligaram fora de horas foram atendidos pela receção por voz e as consultas já estão na agenda." },
          { title: "10:00 — Balcão livre para quem chega", body: "As dúvidas sobre horários, acordos e preparação para exames são respondidas automaticamente ao telefone." },
          { title: "15:20 — Espera sem ansiedade", body: "O paciente acompanha a fila no telemóvel e é avisado quando chega a sua vez." },
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
        bundleBody: "An AI voice receptionist that answers, handles admin questions and books appointments, online scheduling by appointment type and practitioner, phone alerts when it's the patient's turn and monitoring of your Google reviews.",
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
    slug: sectorSlugs.retail,
    photo: "shop-owner",
    side: { kind: "photo", photo: "retail" },
    bundle: ["nfc-google-reviews", "nfc-social", "loyalty", "ai-chatbot"],
    copy: {
      pt: {
        name: "Comércio local",
        cardTitle: "Comércio local",
        cardBody: "Mais seguidores, mais reviews e clientes que regressam, com tecnologia simples no balcão e na montra.",
        metaTitle: "Placas e fidelização para comércio local | Steevanz",
        metaDescription: "Placas para reviews no Google e redes sociais, cartão de fidelidade digital e chatbot com IA para lojas, padarias, floristas e comércio de bairro.",
        heroTitle: "A loja do bairro, com a força das grandes marcas.",
        heroSubtitle: "Os clientes gostam de comprar perto de casa. Ajudamos a que o encontrem no Google, o sigam nas redes sociais e voltem, com ferramentas simples que funcionam a partir do balcão.",
        pains: [
          { title: "Pouca visibilidade no Google", body: "Quem procura \"florista perto de mim\" escolhe quem tem mais reviews e melhor nota. Lojas excelentes ficam escondidas." },
          { title: "Redes sociais que crescem devagar", body: "Pedir a um cliente que procure a conta e escreva o nome certo faz perder a maioria pelo caminho." },
          { title: "Cartões de carimbos em papel", body: "Perdem-se, esquecem-se em casa e não dizem nada sobre quem são os clientes mais fiéis." },
        ],
        bundleTitle: "O pacote para comércio",
        bundleBody: "Placa no balcão para reviews no Google, placa ou autocolante na montra para seguir nas redes sociais, cartão de fidelidade digital sem app e um chatbot que responde a stock, horários e encomendas.",
        dayInTheLife: [
          { title: "09:00 — A montra a trabalhar", body: "Quem passa com a loja fechada toca no autocolante da montra e segue a conta de Instagram." },
          { title: "12:30 — Pagamento e carimbo", body: "Ao pagar, o cliente encosta o telemóvel e acumula mais um carimbo no cartão de fidelidade digital." },
          { title: "17:00 — Review com um toque", body: "Um cliente habitual elogia a loja. Basta apontar para a placa no balcão." },
          { title: "21:00 — Perguntas respondidas", body: "O chatbot diz se há bolo de laranja amanhã e como encomendar para sábado." },
        ],
        faq: [
          { q: "Tenho uma loja pequena. Isto é para mim?", a: "Sim. As placas são um investimento único e baixo, e os serviços mensais não têm fidelização longa. Começamos pelo que traz retorno mais rápido." },
          { q: "Posso mudar o link da placa mais tarde?", a: "Sim. As nossas placas usam um endereço que gerimos por si, por isso podemos mudar o destino sem reimprimir nada." },
          { q: "Funciona se o cliente tiver um telemóvel antigo?", a: "Todas as placas têm também um QR code. Quem não conseguir ler a placa com um toque aponta a câmara e chega ao mesmo sítio." },
        ],
      },
      en: {
        name: "Local retail",
        cardTitle: "Local retail",
        cardBody: "More followers, more reviews and returning customers, with simple tech at the counter and in the window.",
        metaTitle: "Plates and loyalty for local shops | Steevanz",
        metaDescription: "Plates for Google reviews and social media, a digital loyalty card and an AI chatbot for shops, bakeries, florists and neighbourhood retail.",
        heroTitle: "Your neighbourhood shop, with big-brand muscle.",
        heroSubtitle: "People love buying close to home. We help them find you on Google, follow you on social media and come back, with simple tools that work from your counter.",
        pains: [
          { title: "Low visibility on Google", body: "Anyone searching \"florist near me\" picks the one with the most reviews and the best rating. Great shops stay hidden." },
          { title: "Social accounts that grow slowly", body: "Asking a customer to search your handle and type it correctly loses most of them along the way." },
          { title: "Paper stamp cards", body: "They get lost, left at home and tell you nothing about who your most loyal customers are." },
        ],
        bundleTitle: "The retail bundle",
        bundleBody: "A plate at the counter for Google reviews, a plate or sticker in the window to follow you on social media, a digital loyalty card with no app and a chatbot that answers stock, hours and order questions.",
        dayInTheLife: [
          { title: "09:00 — The window at work", body: "Passers-by tap the window sticker while you're closed and follow your Instagram account." },
          { title: "12:30 — Pay and stamp", body: "When paying, the customer taps their phone and collects another stamp on the digital loyalty card." },
          { title: "17:00 — A review in one tap", body: "A regular praises the shop. Just point to the plate on the counter." },
          { title: "21:00 — Questions answered", body: "The chatbot says whether there'll be orange cake tomorrow and how to order for Saturday." },
        ],
        faq: [
          { q: "I run a small shop. Is this for me?", a: "Yes. The plates are a low one-off cost and monthly services have no long lock-in. We start with what pays back fastest." },
          { q: "Can I change where the plate points later?", a: "Yes. Our plates use an address we manage for you, so we can change the destination without reprinting anything." },
          { q: "Does it work if a customer has an older phone?", a: "Every plate also carries a QR code. Anyone whose phone can't read it with a tap points the camera and lands in the same place." },
        ],
      },
    },
  },
  {
    id: "lodging",
    slug: sectorSlugs.lodging,
    photo: "holiday-rental",
    side: { kind: "product", productId: "guest-guide" },
    // After the web products merge: put the website product id (AL template variant) in place of nfc-google-reviews.
    bundle: ["guest-guide", "ai-chatbot", "automation", "nfc-google-reviews"],
    bundleNote: {
      pt: "As placas para reviews no Google são só para alojamentos que podem ter perfil no Google: hostels, guest houses, quartos com o anfitrião presente e casas onde recebe os hóspedes pessoalmente. Apartamentos e moradias com entrada autónoma não podem ter perfil, por regra do próprio Google. Nesses casos, o guia explica ao hóspede onde avaliar na Booking ou no Airbnb, da mesma forma para todos e sem ofertas em troca.",
      en: "Google review plates are only for places that can have a Google profile: hostels, guest houses, rooms with the host on site and homes where you welcome guests in person. Self-check-in flats and villas can't have a profile, under Google's own rules. For those, the guide tells guests where to review on Booking.com or Airbnb, the same way for everyone and with nothing offered in return.",
    },
    pack: {
      setup: 149,
      monthly: 49,
      extraSetup: 49,
      extraMonthly: 9,
      // Guide (69) + «Limpezas e prazos» automation (149); assistant 49/month.
      separatelySetup: 218,
      separatelyMonthly: 49,
      demoProduct: "guest-guide",
      isProvisional: true,
      copy: {
        pt: {
          badge: "Preço de proposta",
          eyebrow: "Pack Alojamento Local",
          title: "Guia, assistente e automatização num só pack",
          body: "Por menos do que a comissão de uma reserva por mês, os hóspedes ficam bem informados, a limpeza organiza-se sozinha e o seu telemóvel descansa.",
          items: [
            "Guia digital do alojamento em quatro línguas, com placa e versão para imprimir",
            "Assistente com IA no WhatsApp, treinado com o guia, que responde aos hóspedes 24 horas e lhe passa as urgências",
            "Automatização «Limpezas e prazos»: aviso à equipa de limpeza na véspera de cada saída, lembrete dos boletins e resumo semanal",
            "Guia online e alterações incluídos enquanto o pack estiver ativo",
            "Em hostels e guest houses com perfil no Google, uma placa para reviews incluída",
          ],
          setupLabel: "de configuração",
          monthlyLabel: "/mês",
          extraProperty: "Cada alojamento extra: +{setup} de configuração e +{monthly}/mês. Um número de WhatsApp serve até cinco alojamentos; acima disso, fazemos orçamento.",
          separately: "Em separado: {setup} de configuração e {monthly}/mês.",
          website: "Quer também um website com reservas diretas, para os hóspedes que voltam e para quem o encontra no Google ou no Instagram? Juntamo-lo ao pack, com preço à parte.",
          note: "Valores sem IVA, confirmados na demonstração. Sem contratos longos: sugerimos um mínimo de três meses, pelo trabalho de configuração. O pack contrata-se na demonstração, não no carrinho.",
          requestInfo: "Prefere receber a proposta por e-mail?",
        },
        en: {
          badge: "Proposal price",
          eyebrow: "Holiday-rental pack",
          title: "Guide, assistant and automation in one pack",
          body: "For less than the commission on one booking a month, guests stay well informed, cleaning organises itself and your phone gets a rest.",
          items: [
            "Digital guest guide in four languages, with a plate and a printable version",
            "AI assistant on WhatsApp, trained on the guide, that answers guests around the clock and passes emergencies to you",
            "\"Cleanings and deadlines\" automation: a notice to your cleaning team the day before each check-out, registration reminders and a weekly summary",
            "Guide hosting and changes included while the pack is active",
            "For hostels and guest houses with a Google profile, one review plate included",
          ],
          setupLabel: "setup",
          monthlyLabel: "/month",
          extraProperty: "Each extra property: +{setup} setup and +{monthly}/month. One WhatsApp number covers up to five properties; above that, we'll quote.",
          separately: "Bought separately: {setup} setup and {monthly}/month.",
          website: "Want a website with direct bookings too, for returning guests and people who find you on Google or Instagram? We add it to the pack, priced separately.",
          note: "Prices exclude VAT and are confirmed in the demo. No long lock-in: we suggest a three-month minimum because of the setup work. The pack is arranged in the demo, not in the cart.",
          requestInfo: "Rather get the proposal by email?",
        },
      },
    },
    copy: {
      pt: {
        name: "Alojamento local",
        cardTitle: "Alojamento local",
        cardBody: "Hóspedes bem informados em qualquer língua, menos mensagens a meio da noite e limpezas que se organizam sozinhas.",
        metaTitle: "Guia digital, assistente IA e automação para alojamento local | Steevanz",
        metaDescription: "Guia digital da casa em quatro línguas com um toque, assistente com IA no WhatsApp 24 horas, avisos automáticos de limpeza e websites com reservas diretas para alojamento local em Portugal.",
        heroTitle: "Hóspedes bem recebidos. Telemóvel em silêncio.",
        heroSubtitle: "Quem tem alojamento local responde às mesmas perguntas todos os dias, em várias línguas e a qualquer hora. Juntamos um guia digital da casa, um assistente que responde por si no WhatsApp e automatizações que tratam dos avisos e dos prazos. Nós configuramos tudo, sem apps para instalar.",
        pains: [
          { title: "«Qual é a password do WiFi?» pela décima vez esta semana", body: "WiFi, hora de check-out, estacionamento, como funciona a máquina, onde se põe o lixo. As mesmas perguntas, em inglês, francês ou alemão, muitas vezes quando está a jantar ou a dormir." },
          { title: "Chegadas tardias e mensagens às duas da manhã", body: "O voo atrasou, o hóspede não encontra a caixa das chaves e só o anfitrião sabe responder. Uma resposta lenta é muitas vezes uma avaliação mais baixa." },
          { title: "Limpezas e prazos a depender da sua memória", body: "Reservas no Airbnb e na Booking, a equipa de limpeza à espera de saber quando entrar e os boletins do SIBA a enviar em três dias úteis. Basta uma falha para correr mal." },
          { title: "Comissões de 15 % em cada reserva", body: "Mesmo quem volta todos os anos reserva pela plataforma, porque o alojamento não tem um website próprio onde reservar." },
        ],
        bundleTitle: "O pacote para alojamento local",
        bundleBody: "Um guia digital da casa em quatro línguas, aberto com um toque numa placa dentro do alojamento, um assistente com IA no WhatsApp que responde aos hóspedes 24 horas com a informação do guia, avisos automáticos à equipa de limpeza e lembretes dos boletins a partir do calendário que já usa e, se quiser, um website com reservas diretas.",
        dayInTheLife: [
          { title: "10:30 — Limpeza já combinada", body: "A equipa recebeu ontem o aviso no WhatsApp: saída às 11h e nova entrada às 16h no mesmo apartamento." },
          { title: "16:40 — Check-in sem chamadas", body: "Os hóspedes entram, tocam na placa junto à porta e têm o WiFi, as regras da casa e o funcionamento da placa de indução na sua língua." },
          { title: "23:50 — Pergunta respondida enquanto dorme", body: "«Is there a pharmacy open now?» O assistente responde em inglês com a farmácia de serviço mais próxima e só o acorda se for uma urgência." },
          { title: "Dia seguinte, 09:00 — Prazos em dia", body: "Recebe um lembrete: há boletins de hóspedes estrangeiros por comunicar ao SIBA até amanhã." },
        ],
        faq: [
          { q: "Isto substitui o Airbnb, a Booking ou o meu software de gestão?", a: "Não. Trabalhamos em conjunto com o que já usa. As plataformas continuam a tratar das reservas, e o guia, o assistente e as automatizações juntam-se ao calendário que já tem." },
          { q: "O guia digital serve como o livro de informações que a lei exige?", a: "O guia inclui o conteúdo que a lei pede para o livro de informações: funcionamento da casa, regras, resíduos, eletrodomésticos, ruído, regras do condomínio e o seu contacto, em português, inglês e mais duas línguas. Também lhe entregamos uma versão para imprimir, que recomendamos deixar no alojamento." },
          { q: "Tratam dos boletins do SIBA?", a: "Não enviamos boletins em seu nome. Lembramos os prazos a partir do calendário e, se quiser automatizar o envio, recomendamos ferramentas especializadas como a Chekin ou a Hostkit, que funcionam bem em conjunto com a Steevanz." },
          { q: "Posso pedir avaliações aos hóspedes?", a: "Pode e deve, sempre da mesma forma a todos, sem ofertas nem descontos em troca. A Booking e o Airbnb enviam o seu próprio convite depois da saída, e o guia explica ao hóspede onde o encontra. As placas para o Google são indicadas para hostels, guest houses e casas onde recebe os hóspedes pessoalmente." },
          { q: "O assistente dá o código da porta a quem perguntar?", a: "Não. Os códigos de acesso nunca são partilhados pelo assistente nem ficam no guia. Continua a enviá-los na sua mensagem de check-in. Urgências e reclamações passam logo para si." },
          { q: "Tenho vários alojamentos. Como funciona?", a: "Cada alojamento tem o seu guia e a sua placa, e o assistente sabe em que casa está cada hóspede. Para gestores com vários alojamentos há preços por volume." },
        ],
      },
      en: {
        name: "Holiday rentals",
        cardTitle: "Holiday rentals",
        cardBody: "Well-informed guests in any language, fewer midnight messages and cleanings that organise themselves.",
        metaTitle: "Digital guest guide, AI assistant and automation for holiday rentals | Steevanz",
        metaDescription: "A digital guest guide in four languages with one tap, a 24/7 AI assistant on WhatsApp, automatic cleaning notices and direct-booking websites for holiday rentals in Portugal.",
        heroTitle: "Guests well looked after. Phone on silent.",
        heroSubtitle: "Holiday-rental hosts answer the same questions every day, in several languages and at any hour. We bring together a digital guest guide, an assistant that answers on WhatsApp for you and automations that take care of notices and deadlines. We set everything up, with no apps to install.",
        pains: [
          { title: "\"What's the WiFi password?\" for the tenth time this week", body: "WiFi, check-out time, parking, how the washing machine works, where the bins go. The same questions in English, French or German, often while you're having dinner or asleep." },
          { title: "Late arrivals and 2 a.m. messages", body: "The flight was delayed, the guest can't find the key box and only you can answer. A slow reply often means a lower review." },
          { title: "Cleanings and deadlines that rely on your memory", body: "Bookings on Airbnb and Booking.com, a cleaning team waiting to know when to go in, and guest registrations (SIBA) due within three working days. One slip is all it takes." },
          { title: "15% commission on every booking", body: "Even guests who come back every year book through the platform, because your place has no website of its own." },
        ],
        bundleTitle: "The holiday-rental bundle",
        bundleBody: "A digital guest guide in four languages that opens with one tap on a plate inside the property, an AI assistant on WhatsApp that answers guests around the clock using the guide, automatic notices to your cleaning team and registration reminders based on the calendar you already use and, if you want, a website with direct bookings.",
        dayInTheLife: [
          { title: "10:30 — Cleaning already arranged", body: "Your team got the WhatsApp notice yesterday: check-out at 11, new arrivals at 4 p.m. in the same flat." },
          { title: "16:40 — Check-in with no phone calls", body: "Guests walk in, tap the plate by the door and get the WiFi, the house rules and how the hob works, in their own language." },
          { title: "23:50 — Question answered while you sleep", body: "\"Is there a pharmacy open now?\" The assistant replies in English with the nearest on-duty pharmacy and only wakes you for a real emergency." },
          { title: "Next day, 09:00 — Deadlines on track", body: "You get a reminder: foreign guests still need to be registered on SIBA by tomorrow." },
        ],
        faq: [
          { q: "Does this replace Airbnb, Booking.com or my management software?", a: "No. We work alongside what you already use. The platforms keep handling bookings, and the guide, the assistant and the automations plug into the calendar you already have." },
          { q: "Does the digital guide count as the information book the law requires?", a: "The guide includes the content Portuguese law asks for in the information book: how the property works, house rules, waste, appliances, noise, building rules and your contact, in Portuguese, English and two more languages. We also give you a printable version, which we recommend keeping in the property." },
          { q: "Do you file the SIBA guest registrations?", a: "We don't file registrations on your behalf. We remind you of the deadlines based on your calendar and, if you want to automate filing, we recommend specialist tools such as Chekin or Hostkit, which work well alongside Steevanz." },
          { q: "Can I ask guests for reviews?", a: "You can and should, the same way for every guest, with no gifts or discounts in return. Booking.com and Airbnb send their own invitation after check-out, and the guide tells guests where to find it. Google plates are meant for hostels, guest houses and homes where you welcome guests in person." },
          { q: "Will the assistant give the door code to anyone who asks?", a: "No. Access codes are never shared by the assistant and never appear in the guide. You keep sending them in your check-in message. Emergencies and complaints go straight to you." },
          { q: "I run several properties. How does it work?", a: "Each property has its own guide and plate, and the assistant knows which home each guest is staying in. Managers with several properties get volume pricing." },
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
