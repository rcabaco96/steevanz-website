import type { Localized } from "@/lib/i18n";
import type { FaqItem, TitledText } from "./types";

export interface HomeCopy {
  metaTitle: string;
  metaDescription: string;
  hero: {
    eyebrow: string;
    titleLead: string;
    titleEmphasis: string;
    subtitle: string;
    primaryCta: string;
    secondaryCta: string;
    trust: string[];
    priceChip: string;
  };
  scene: {
    plateLine1: string;
    plateLine2: string;
    screenIdle: string;
    screenTitle: string;
    screenPrompt: string;
    screenButton: string;
    toast: string;
    chipNoApp: string;
    chipTap: string;
    ariaLabel: string;
  };
  marquee: string[];
  products: { eyebrow: string; title: string; lead: string };
  flagship: {
    eyebrow: string;
    title: string;
    lead: string;
    points: TitledText[];
    formatsTitle: string;
    formats: { name: string; body: string }[];
    cta: string;
    videoAlt: string;
  };
  howItWorks: { eyebrow: string; title: string; lead: string; steps: TitledText[] };
  sectors: { eyebrow: string; title: string; lead: string; cta: string };
  proof: {
    eyebrow: string;
    title: string;
    lead: string;
    disclaimer: string;
    stats: { value: string; label: string }[];
    principles: TitledText[];
  };
  faq: { eyebrow: string; title: string; items: FaqItem[] };
  finalCta: { eyebrow: string; title: string; body: string; primary: string; secondary: string };
}

export const homeCopy: Localized<HomeCopy> = {
  pt: {
    metaTitle: "Placas NFC para reviews no Google e IA para negócios | Steevanz",
    metaDescription:
      "Um toque no telemóvel e o cliente está a deixar a sua review no Google. Placas NFC, reservas, lista de espera e IA para restaurantes, salões, clínicas e lojas.",
    hero: {
      eyebrow: "Placas NFC para reviews no Google",
      titleLead: "Um toque.",
      titleEmphasis: "Mais uma review de cinco estrelas.",
      subtitle:
        "O cliente aproxima o telemóvel da placa e o formulário de review do seu negócio no Google abre de imediato. Sem apps, sem procurar o nome, sem esforço. E quando quiser ir mais longe, temos reservas, filas e inteligência artificial à medida.",
      primaryCta: "Agendar demonstração",
      secondaryCta: "Ver as placas NFC",
      trust: ["Sem app para o cliente", "Configuração incluída", "iPhone e Android"],
      priceChip: "Placas desde",
    },
    scene: {
      plateLine1: "Gostou?",
      plateLine2: "Toque para avaliar",
      screenIdle: "Aproxime o telemóvel",
      screenTitle: "O seu restaurante",
      screenPrompt: "Partilhe a sua experiência",
      screenButton: "Publicar",
      toast: "Review publicada",
      chipNoApp: "Sem app",
      chipTap: "Abre em segundos",
      ariaLabel: "Animação: um telemóvel toca numa placa NFC e abre o formulário de review com cinco estrelas.",
    },
    marquee: [
      "Restaurantes",
      "Cafés e pastelarias",
      "Cabeleireiros",
      "Barbearias",
      "Centros de estética",
      "Clínicas dentárias",
      "Fisioterapia",
      "Padarias",
      "Floristas",
      "Lojas de bairro",
      "Ginásios",
      "Alojamento local",
    ],
    products: {
      eyebrow: "Produtos",
      title: "Tudo o que um negócio local precisa para crescer. Nada do que não precisa.",
      lead: "Comece por uma placa NFC e acrescente o resto quando fizer sentido. Cada solução é configurada por nós e funciona sozinha ou em conjunto com as outras.",
    },
    flagship: {
      eyebrow: "O produto principal",
      title: "A placa que transforma clientes satisfeitos em reviews.",
      lead:
        "A maioria dos clientes contentes não deixa review porque dá trabalho. A placa NFC elimina o trabalho: um toque ou uma leitura do QR code e o formulário do Google está aberto, pronto para as estrelas.",
      points: [
        { title: "Direto ao formulário", body: "Nada de pesquisar o nome do negócio. A placa abre a página de review certa, no idioma do telemóvel do cliente." },
        { title: "NFC e QR code na mesma placa", body: "Quem tem NFC toca, quem não tem aponta a câmara. Ninguém fica de fora." },
        { title: "Link gerido por nós", body: "Se o perfil mudar, atualizamos o destino sem reimprimir a placa." },
        { title: "Dentro das regras do Google", body: "Pedimos a review a todos os clientes por igual, sem incentivos nem filtros, como o Google exige." },
      ],
      formatsTitle: "Formatos",
      formats: [
        { name: "Expositor de mesa", body: "Acrílico em pé, ideal para mesas e balcões." },
        { name: "Placa de balcão", body: "Quadrada e discreta, junto à caixa." },
        { name: "Autocolante", body: "Para montras, menus e terminais." },
        { name: "Placa de parede", body: "À entrada ou junto à saída." },
      ],
      cta: "Conhecer as placas NFC",
      videoAlt: "Pessoa a aproximar o telemóvel de uma superfície para uma leitura sem contacto.",
    },
    howItWorks: {
      eyebrow: "Como funciona",
      title: "Pronto a usar em poucos dias.",
      lead: "Não tem de perceber de tecnologia. Tratamos de tudo, do link à formação da equipa.",
      steps: [
        { title: "Conversa de 20 minutos", body: "Numa demonstração online ou por telefone percebemos o seu negócio e mostramos as placas e as ferramentas a funcionar." },
        { title: "Nós configuramos", body: "Encontramos o link de review do seu perfil no Google, gravamos e bloqueamos o chip, testamos em iPhone e Android." },
        { title: "Coloca e começa", body: "Recebe as placas prontas a usar, com dicas de colocação e uma frase simples para a equipa pedir a review." },
        { title: "Acompanhamos", body: "Suporte por WhatsApp e e-mail, em português. Se algo mudar no seu perfil, atualizamos o destino sem custos." },
      ],
    },
    sectors: {
      eyebrow: "Por setor",
      title: "Pensado para quem atende pessoas todos os dias.",
      lead: "Cada setor tem os seus momentos certos. Juntámos as soluções que mais fazem a diferença em cada um.",
      cta: "Ver soluções",
    },
    proof: {
      eyebrow: "Porquê a Steevanz",
      title: "Tecnologia simples, com os bons modos de sempre.",
      lead: "Somos uma equipa portuguesa pequena, próxima e exigente. Preferimos explicar bem a vender depressa.",
      disclaimer: "Valores que descrevem o funcionamento do produto, não resultados garantidos.",
      stats: [
        { value: "1", label: "toque para abrir o formulário de review" },
        { value: "0", label: "apps para o cliente instalar" },
        { value: "2", label: "formas de acesso em cada placa: NFC e QR" },
        { value: "24/7", label: "atendimento com IA, mesmo com a porta fechada" },
      ],
      principles: [
        { title: "Sem fidelizações longas", body: "Os serviços mensais podem ser cancelados com aviso simples. Ficam porque funcionam, não porque são obrigados." },
        { title: "Suporte em português, por pessoas", body: "WhatsApp e e-mail com resposta rápida em dias úteis. Falamos a língua do seu negócio." },
        { title: "RGPD levado a sério", body: "Recolhemos apenas os dados necessários, com servidores na União Europeia sempre que possível e acordos de tratamento de dados." },
      ],
    },
    faq: {
      eyebrow: "Dúvidas",
      title: "Perguntas frequentes",
      items: [
        { q: "Os clientes precisam de instalar alguma aplicação?", a: "Não. Nos telemóveis com NFC basta aproximar o telemóvel da placa. Nos restantes, a câmara lê o QR code impresso na mesma placa. Em ambos os casos abre-se o formulário de review no navegador ou na app do Google, se estiver instalada." },
        { q: "Que telemóveis funcionam com NFC?", a: "Os iPhone XS e posteriores leem a placa com o ecrã desbloqueado, sem fazer nada. Os iPhone 7 a X usam o leitor NFC do Centro de Controlo. A grande maioria dos Android tem NFC; basta estar ativo nas definições." },
        { q: "Isto é permitido pelo Google?", a: "Sim. O Google permite e incentiva que peça reviews aos seus clientes. O que não é permitido é oferecer contrapartidas ou pedir apenas aos clientes satisfeitos. As nossas placas pedem a todos por igual." },
        { q: "A Steevanz é o Google?", a: "Não. Somos uma empresa independente. As placas levam os clientes ao formulário de review do seu próprio perfil no Google, mas não temos qualquer ligação ao Google." },
        { q: "Quanto custa?", a: "As placas NFC começam em 29 € por placa, com configuração incluída. Os serviços mensais, como reservas ou chatbot, têm preços a partir dos valores indicados em cada produto. Recebe sempre uma proposta fechada antes de decidir." },
        { q: "Como compro?", a: "Não vendemos online porque cada negócio é diferente. Agende uma demonstração gratuita, mostramos tudo a funcionar e enviamos uma proposta. Se fizer sentido, tratamos do resto." },
      ],
    },
    finalCta: {
      eyebrow: "Próximo passo",
      title: "Veja a placa a funcionar no seu telemóvel.",
      body: "Numa demonstração de 20 minutos mostramos as placas, respondemos às suas dúvidas e dizemos com franqueza o que faz sentido para o seu negócio.",
      primary: "Agendar demonstração gratuita",
      secondary: "Falar no WhatsApp",
    },
  },
  en: {
    metaTitle: "NFC plates for Google reviews and AI for business | Steevanz",
    metaDescription:
      "One tap and your customer is leaving a Google review. NFC plates, bookings, waiting lists and AI tools for restaurants, salons, clinics and shops.",
    hero: {
      eyebrow: "NFC plates for Google reviews",
      titleLead: "One tap.",
      titleEmphasis: "One more five-star review.",
      subtitle:
        "Customers hold their phone near the plate and your business's Google review form opens instantly. No apps, no searching, no effort. And when you're ready to go further, we have bookings, queues and tailored artificial intelligence.",
      primaryCta: "Book a demo",
      secondaryCta: "See the NFC plates",
      trust: ["No app for customers", "Setup included", "iPhone and Android"],
      priceChip: "Plates from",
    },
    scene: {
      plateLine1: "Enjoyed it?",
      plateLine2: "Tap to review",
      screenIdle: "Hold your phone near",
      screenTitle: "Your restaurant",
      screenPrompt: "Share your experience",
      screenButton: "Post",
      toast: "Review posted",
      chipNoApp: "No app",
      chipTap: "Opens in seconds",
      ariaLabel: "Animation: a phone taps an NFC plate and opens a review form with five stars.",
    },
    marquee: [
      "Restaurants",
      "Cafés and bakeries",
      "Hair salons",
      "Barbers",
      "Beauty clinics",
      "Dental clinics",
      "Physiotherapy",
      "Bakeries",
      "Florists",
      "Neighbourhood shops",
      "Gyms",
      "Holiday rentals",
    ],
    products: {
      eyebrow: "Products",
      title: "Everything a local business needs to grow. Nothing it doesn't.",
      lead: "Start with an NFC plate and add the rest when it makes sense. Every solution is set up by us and works on its own or together with the others.",
    },
    flagship: {
      eyebrow: "Our flagship",
      title: "The plate that turns happy customers into reviews.",
      lead:
        "Most happy customers never leave a review because it takes effort. The NFC plate removes the effort: one tap or a QR scan and the Google form is open, ready for the stars.",
      points: [
        { title: "Straight to the form", body: "No searching for your business name. The plate opens the right review page, in the language of the customer's phone." },
        { title: "NFC and QR on one plate", body: "Those with NFC tap, the rest point their camera. Nobody is left out." },
        { title: "A link we manage", body: "If your profile changes, we update the destination without reprinting the plate." },
        { title: "Within Google's rules", body: "Every customer is asked equally, with no incentives or filtering, as Google requires." },
      ],
      formatsTitle: "Formats",
      formats: [
        { name: "Table stand", body: "Free-standing acrylic, ideal for tables and counters." },
        { name: "Counter plate", body: "Square and discreet, right by the till." },
        { name: "Sticker", body: "For windows, menus and terminals." },
        { name: "Wall plate", body: "At the entrance or by the exit." },
      ],
      cta: "Explore the NFC plates",
      videoAlt: "A person holding a phone near a surface for a contactless read.",
    },
    howItWorks: {
      eyebrow: "How it works",
      title: "Ready to use in a few days.",
      lead: "You don't need to be good with technology. We handle everything, from the link to training your team.",
      steps: [
        { title: "A 20-minute chat", body: "In an online or phone demo we get to know your business and show the plates and tools working." },
        { title: "We set it up", body: "We find the review link for your Google profile, write and lock the chip, and test on iPhone and Android." },
        { title: "Place it and go", body: "You receive ready-to-use plates, with placement tips and a simple line for your team to ask for reviews." },
        { title: "We stay with you", body: "Support by WhatsApp and email. If anything changes on your profile, we update the destination at no cost." },
      ],
    },
    sectors: {
      eyebrow: "By sector",
      title: "Built for people who serve people every day.",
      lead: "Every sector has its own right moments. We've grouped the solutions that make the biggest difference in each.",
      cta: "See solutions",
    },
    proof: {
      eyebrow: "Why Steevanz",
      title: "Simple technology, with good old-fashioned manners.",
      lead: "We're a small, hands-on Portuguese team with high standards. We'd rather explain things properly than sell quickly.",
      disclaimer: "Figures describe how the product works, not guaranteed results.",
      stats: [
        { value: "1", label: "tap to open the review form" },
        { value: "0", label: "apps for customers to install" },
        { value: "2", label: "ways in on every plate: NFC and QR" },
        { value: "24/7", label: "AI answering, even when you're closed" },
      ],
      principles: [
        { title: "No long lock-ins", body: "Monthly services can be cancelled with simple notice. Clients stay because it works, not because they have to." },
        { title: "Real people, real support", body: "WhatsApp and email with quick replies on working days, in Portuguese or English." },
        { title: "GDPR taken seriously", body: "We collect only the data we need, use EU servers wherever possible and sign data processing agreements." },
      ],
    },
    faq: {
      eyebrow: "Questions",
      title: "Frequently asked questions",
      items: [
        { q: "Do customers need to install an app?", a: "No. On phones with NFC they just hold the phone near the plate. On others, the camera reads the QR code printed on the same plate. Either way the review form opens in the browser, or in the Google app if installed." },
        { q: "Which phones work with NFC?", a: "iPhone XS and later read the plate with the screen unlocked, with nothing else to do. iPhone 7 to X use the NFC reader in Control Centre. The vast majority of Android phones have NFC; it just needs to be switched on in settings." },
        { q: "Is this allowed by Google?", a: "Yes. Google allows and encourages you to ask your customers for reviews. What's not allowed is offering incentives or asking only happy customers. Our plates ask everyone equally." },
        { q: "Is Steevanz part of Google?", a: "No. We're an independent company. Our plates take customers to the review form of your own Google profile, but we have no affiliation with Google." },
        { q: "How much does it cost?", a: "NFC plates start at €29 per plate, setup included. Monthly services such as bookings or the chatbot start from the prices shown on each product. You always get a fixed proposal before deciding." },
        { q: "How do I buy?", a: "We don't sell online because every business is different. Book a free demo, we show you everything working and send a proposal. If it makes sense, we take care of the rest." },
      ],
    },
    finalCta: {
      eyebrow: "Next step",
      title: "See the plate working on your own phone.",
      body: "In a 20-minute demo we show you the plates, answer your questions and tell you honestly what makes sense for your business.",
      primary: "Book a free demo",
      secondary: "Chat on WhatsApp",
    },
  },
};
