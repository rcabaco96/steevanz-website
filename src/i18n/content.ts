// Site copy in Portuguese (source) and English (translation).
// Brand-specific names (Steevanz, Silky Software, Neighbourhood, Networking,
// Reach Out, Mingle with the Steevanz…) are kept identical across languages —
// they're identity, not vocabulary.

const pt = {
  nav: {
    links: {
      home: "Casa",
      silkySoftware: "Preços",
      neighbourhood: "Vizinhança",
      reachOut: "Bate à Porta",
    },
    talk: "Bate à Porta",
  },

  footer: {
    blurb:
      "Uma família alentejana de nerds, geeks, genuínos e de carne e osso — a fazer tecnologia à medida, com os modos do antigamente.",
    hashtag: "#ITRUNSINTHEFAMILY",
    mapTitle: "O Mapa da Casa",
    familyTitle: "Mais família",
    reachTitle: "Fala connosco",
    address: "Herdade alentejana de IT, CBD Lisboeta",
    rights: "tecnologia do amanhã, com os bons modos do antigamente",
    since: "Família desde 04.02.2021",
  },

  home: {
    stack: [
      "Software à Medida",
      "E-Commerce",
      "Aplicações",
      "Rede",
      "Infraestruturas",
      "Cloud",
      "Silky Software",
      "Bom Tinto",
    ],
    hero: {
      eyebrow:
        "Herdade alentejana de IT · CBD Lisboeta · Família desde 04.02.2021",
      titleLine1: "Steevanz.",
      titleLine2: "It runs in the family.",
      body: "Uma equipa de nerds, geeks, genuínos e de carne e osso. Leais, revolucionários, criativos e empáticos — aqui entregamos a tecnologia do amanhã, com os bons modos do antigamente.",
      ctaPrimary: "Conhecer a família",
      ctaSecondary: "Vamos conversar",
      scroll: "Desce",
    },
    manifesto: {
      eyebrow: "A nossa promessa",
      line1: "Entregamos a tecnologia",
      em1: "do amanhã",
      mid: ", com as boas maneiras",
      em2: "do passado.",
    },
    purpose: {
      eyebrow: "A maneira Steevanz de trabalhar",
      title: "É nosso propósito tornar a tecnologia",
      titleEm: "empática",
      titleRest: "e realmente acessível a todos.",
      p1: "Da avó ao neto. Com carácter humano, enquanto produto e serviço.",
      p2: "Aqui não tem de fingir saber o que é um front end. É a tecnologia que se adapta a si e ao seu negócio — com leveza, naturalidade e um sorriso nos lábios.",
      quote:
        "“Vamos simplificar a tecnologia e adaptá-la às necessidades da sua empresa.”",
      valuesEyebrow: "Ser Steevanz é ser",
      values: [
        "Excelente",
        "Relevante",
        "Eficiente",
        "Conectado",
        "Fácil",
        "Empático",
        "Cordial",
        "Leal",
      ],
    },
    highlights: {
      eyebrow: "O resto da casa",
      titlePre: "Três portas.",
      titleEm: "Uma",
      titlePost: "casa de software.",
      cards: [
        {
          n: "01",
          to: "/neighbourhood",
          title: "A Vizinhança",
          body: "Sporting Clube de Portugal, Vinha, Aubay, Efficient Safe — alguns dos vizinhos com quem já adubámos negócio.",
          cta: "Ver o bairro",
        },
        {
          n: "02",
          to: "/silky-software",
          title: "Silky Software with Human Touch",
          body: "Software à medida, e-commerce e aplicações — React, Angular, Vue, .NET, Python e mais. A tecnologia corre nas nossas veias, e temos a mania de a simplificar.",
          cta: "Ver a tecnologia",
        },
        {
          n: "03",
          to: "/reach-out",
          title: "Bate à Porta",
          body: "“Skill is fine, and genius is splendid, but the right contacts are more valuable than either.” Diz-nos olá.",
          cta: "Falar com a família",
        },
      ],
    },
    cta: {
      eyebrow: "Bate à Porta",
      titlePre: "Tens um negócio para levar do ponto A ao",
      titleEm: "B, C ou Z",
      titlePost: "?",
      body: "Deixa-nos os teus contactos — temos todo o gosto em chegar até ti. Sem fingir, sem pop-ups, sem amadorismo. Prometido por um Steevanz.",
      cta: "Vamos conversar",
    },
  },

  services: {
    pricing: {
      eyebrow: "Tabela de preços",
      titlePre: "Soluções",
      titleEm: "à medida",
      titlePost: "do teu negócio.",
      body: "Da primeira presença online à plataforma corporate — três pontos de partida, sempre adaptáveis ao que precisas.",
      featuredBadge: "Mais escolhido",
      note: "Valores de referência, sem IVA incluído — cada projeto é orçamentado à medida do que precisas.",
      plans: [
        {
          n: "01",
          name: "Site Startup",
          tagline: "Para quem está a começar.",
          price: "350€",
          priceNote: "pagamento único · landing page (1 página)",
          color: "#ad5fb0",
          featured: false,
          features: [
            "Landing page de alto impacto",
            "Design responsivo, mobile-first",
            "Otimização SEO essencial",
            "Formulário de contacto integrado",
            "Domínio e hospedagem no 1.º ano",
          ],
          cta: "Pedir orçamento",
        },
        {
          n: "02",
          name: "Site Multipage / Gestão de Conteúdos",
          tagline: "Para negócios em crescimento.",
          price: "500€",
          priceNote: "pagamento único · até 6 páginas",
          color: "#cfa563",
          featured: true,
          features: [
            "Até 6 páginas de conteúdo",
            "Backoffice de gestão de conteúdos",
            "Blog ou área de notícias",
            "SEO avançado + Google Analytics",
            "3 meses de acompanhamento incluído",
          ],
          cta: "Pedir orçamento",
        },
        {
          n: "03",
          name: "Site Corporate",
          tagline: "Mais do que um site — uma plataforma à tua medida.",
          price: "Sob consulta",
          priceNote: "orçamento personalizado",
          color: "#d97bb0",
          featured: false,
          features: [
            "Plataformas e aplicações web à medida",
            "E-commerce, integrações e APIs (CRM, ERP)",
            "Multilíngue — PT, EN e mais",
            "Arquitetura escalável e segurança avançada",
            "Equipa dedicada e suporte contínuo",
          ],
          cta: "Falar com a família",
        },
      ],
    },
    usp: {
      eyebrow: "A nossa promessa",
      titlePre: "Tecnologia que",
      titleEm: "se adapta",
      titlePost: "a ti — não o contrário.",
      items: [
        {
          title: "Software à medida",
          body: "Cada projeto é único e não repetível, ímpar e não perecível.",
        },
        {
          title: "Rede ativa",
          body: "Um braço tecnológico, outro de rede — negócio que puxa negócio.",
        },
        {
          title: "Infraestrutura & Cloud",
          body: "Azure, AWS, redes e suporte — a casa toda em ordem, por trás do ecrã.",
        },
        {
          title: "Devs com mania da simplicidade",
          body: "Traduzimos termos escanifobéticos para linguagem de gente.",
        },
        {
          title: "Backoffices que dão gosto usar",
          body: "Gestão, analytics e SEO — sem amadorismo, sem pop-ups, sem fingimento.",
        },
        {
          title: "Acompanhamento contínuo",
          body: "Não desaparecemos depois do deploy. Ficamos à mesa.",
        },
      ],
    },
    cta: {
      title: "Não sabes bem por onde começar?",
      body: "Conta-nos o que tens em mente — recomendamos o âmbito certo, a equipa certa e a tecnologia certa para o trabalho.",
      cta: "Falar com a família",
    },
  },

  work: {
    hero: {
      eyebrow: "A Vizinhança",
      titlePre: "Um bom",
      titleEm: "bairro",
      titlePost: "valoriza a propriedade.",
      body: "Alguns dos vizinhos com quem já adubámos negócio — Sporting Clube de Portugal, Vinha, Aubay Portugal e Efficient Safe. Cada projeto, uma história à parte. Juntos, o nosso bairro.",
    },
    filters: [
      "Todos",
      "BMW",
      "Crédito Agrícola",
      "Sporting CP",
      "Aubay",
      "Mesh",
      "Efficient Safe",
    ],
    projects: [
      {
        title: "BMW — Plataforma Frontend Modular",
        category: "BMW",
        year: "2023",
        blurb:
          "Serviços Angular para consumir múltiplas APIs RESTful, com adaptadores que transformam respostas em modelos de dados, NgRx para estado, módulos lazy-loaded, diretivas próprias, route guards e testes com Jest e Cypress.",
        tags: ["Angular", "NgRx", "Testing"],
      },
      {
        title: "Crédito Agrícola — Plataformas Frontend à Medida",
        category: "Crédito Agrícola",
        year: "2025",
        blurb:
          "Voz técnica na tradução de requisitos de negócio e design para soluções frontend escaláveis — projetos construídos de raiz em Angular 20, com migração de Vue 2 para Vue 3 e adoção de Pinia e @ngrx/signals para uma gestão de estado moderna.",
        tags: ["Angular", "Vue 3", "Design Systems"],
      },
      {
        title: "Sporting CP — Bilhética & Loja Verde",
        category: "Sporting CP",
        year: "2023",
        blurb:
          "Sistema de bilhética, loja online (lojaverde.sporting.pt) com backoffice, analytics e SEO, e Corporate Matchday com distribuição de bilhetes por QR code.",
        tags: ["E-commerce", "Backoffice", "QR Code"],
      },
      {
        title: "Sporting CP — Gamebox & App Interna",
        category: "Sporting CP",
        year: "2023",
        blurb:
          "Plataforma Gamebox (gamebox.sporting.pt) e aplicação interna do clube — duas faces de uma só casa tecnológica.",
        tags: ["Plataforma Web", "Aplicação Interna"],
      },
      {
        title: "Aubay Portugal — Timesheet App",
        category: "Aubay",
        year: "2024",
        blurb:
          "Aplicação de registo de horas pensada para equipas grandes — simples de usar, fácil de gerir, sem fricção no dia a dia.",
        tags: ["App Interna", ".NET", "React"],
      },
      {
        title: "Aubay Portugal — Resource Manager",
        category: "Aubay",
        year: "2024",
        blurb:
          "Plataforma de gestão de recrutamento e recursos, com formulário internacional para candidaturas além-fronteiras.",
        tags: ["Recrutamento", "Plataforma Web"],
      },
      {
        title: "Mesh — Rebranding & Loja Online",
        category: "Mesh",
        year: "2023",
        blurb:
          "Rebranding completo, nova loja online e backoffice com integrações à medida — uma marca renovada de raiz à frente da loja.",
        tags: ["Rebranding", "E-commerce", "Integrações"],
      },
      {
        title: "Efficient Safe — App & Backoffice",
        category: "Efficient Safe",
        year: "2024",
        blurb:
          "App mobile de acesso a documentos de seguros com plugin de gestão de acessos Steevanz, e backoffice de suporte completo.",
        tags: ["Mobile", "Plugin de Acessos", "Backoffice"],
      },
    ],
    cta: {
      title: "Queres ser o próximo vizinho?",
      body: "Um bom bairro valoriza a propriedade — vamos ver se há lugar para o teu negócio aqui ao lado.",
      cta: "Apresenta o teu projeto",
    },
  },

  contact: {
    hero: {
      eyebrow: "Bate à Porta · Contacto",
      titlePre: "“Skill is fine, and",
      titleEm: "genius",
      titlePost: "is splendid…”",
      quoteAttr:
        "“...but the right contacts are more valuable than either.” — Arthur Conan Doyle, Sherlock Holmes",
      body: "Conta-nos um pouco sobre o teu negócio e o que tens em mente. Um Steevanz de carne e osso — nunca um robô — responde-te o mais depressa possível.",
    },
    info: {
      address: "Herdade alentejana de IT · CBD Lisboeta",
    },
    form: {
      topicsLegend: "Sobre o que queres falar?",
      topics: ["Software à Medida", "E-Commerce", "Aplicações", "Outro"],
      nameLabel: "Nome",
      namePlaceholder: "O teu nome",
      emailLabel: "Email",
      emailPlaceholder: "tu@empresa.com",
      companyLabel: "Empresa",
      companyPlaceholder: "Nome da empresa ou projeto",
      messageLabel: "Conta-nos mais",
      messagePlaceholder: "O que tens em mente, e como podemos ajudar?",
      submitIdle: "Vamos conversar",
      submitLoading: "A enviar",
      disclaimer: "Sem spam — só uma resposta a sério, de gente a sério.",
      errorMessage:
        "Algo correu mal a enviar a tua mensagem. Tenta novamente ou escreve-nos para rcabaco@steevanz.com.",
      sentTitle: "Mensagem recebida",
      sentBody:
        "Obrigado por nos contactares — entramos em contigo em breve. Sem fingir, sem pop-ups, sem amadorismo.",
    },
  },
};

const en: typeof pt = {
  nav: {
    links: {
      home: "Home",
      silkySoftware: "Pricing",
      neighbourhood: "Neighbourhood",
      reachOut: "Reach Out",
    },
    talk: "Let's talk",
  },

  footer: {
    blurb:
      "An Alentejo family of nerds, geeks, genuine and flesh-and-bone people — building bespoke technology, with the manners of the old days.",
    hashtag: "#ITRUNSINTHEFAMILY",
    mapTitle: "The House Map",
    familyTitle: "More family",
    reachTitle: "Reach us",
    address: "Alentejo IT estate, CBD Lisbon",
    rights: "tomorrow's technology, with yesterday's good manners",
    since: "Family since 04.02.2021",
  },

  home: {
    stack: [
      "Bespoke Software",
      "E-Commerce",
      "Applications",
      "Networking",
      "Infrastructure",
      "Cloud",
      "Silky Software",
      "Good Red Wine",
    ],
    hero: {
      eyebrow: "Alentejo IT estate · CBD Lisbon · Family since 04.02.2021",
      titleLine1: "Steevanz.",
      titleLine2: "It runs in the family.",
      body: "A team of nerds, geeks, genuine and flesh-and-bone people. Loyal, revolutionary, creative and empathetic — here we deliver tomorrow's technology, with yesterday's good manners.",
      ctaPrimary: "Meet the family",
      ctaSecondary: "Let's talk",
      scroll: "Scroll",
    },
    manifesto: {
      eyebrow: "Our promise",
      line1: "We deliver",
      em1: "tomorrow's technology",
      mid: ", with the good manners",
      em2: "of the old days.",
    },
    purpose: {
      eyebrow: "The Steevanz way of working",
      title: "It's our purpose to make technology",
      titleEm: "empathetic",
      titleRest: "and truly accessible to everyone.",
      p1: "From grandma to grandkid. With a human character, as both product and service.",
      p2: "Here you don't have to pretend you know what a front end is. It's the technology that adapts to you and your business — with lightness, ease, and a smile on its face.",
      quote:
        "“Let's simplify technology and adapt it to your company's needs.”",
      valuesEyebrow: "To be Steevanz is to be",
      values: [
        "Great",
        "Relevant",
        "Efficient",
        "Connected",
        "Easy",
        "Empathetic",
        "Friendly",
        "Loyal",
      ],
    },
    highlights: {
      eyebrow: "The rest of the house",
      titlePre: "Three doors.",
      titleEm: "One",
      titlePost: "house of software.",
      cards: [
        {
          n: "01",
          to: "/neighbourhood",
          title: "The Neighbourhood",
          body: "Sporting Clube de Portugal, Vinha, Aubay, Efficient Safe — some of the neighbours we've already done business with.",
          cta: "See the neighbourhood",
        },
        {
          n: "02",
          to: "/silky-software",
          title: "Silky Software with Human Touch",
          body: "Bespoke software, e-commerce and applications — React, Angular, Vue, .NET, Python and more. Technology runs in our veins, and we have a thing for simplifying it.",
          cta: "See the tech",
        },
        {
          n: "03",
          to: "/reach-out",
          title: "Reach Out",
          body: "“Skill is fine, and genius is splendid, but the right contacts are more valuable than either.” Say hi.",
          cta: "Talk to the family",
        },
      ],
    },
    cta: {
      eyebrow: "Reach Out",
      titlePre: "Got a business to take from point A to",
      titleEm: "B, C or Z",
      titlePost: "?",
      body: "Leave us your details — we'd be glad to reach out. No pretending, no pop-ups, no amateur hour. Promised by a Steevanz.",
      cta: "Let's talk",
    },
  },

  services: {
    pricing: {
      eyebrow: "Pricing table",
      titlePre: "Solutions",
      titleEm: "tailored",
      titlePost: "to your business.",
      body: "From your first online presence to a full corporate platform — three starting points, always adaptable to what you need.",
      featuredBadge: "Most chosen",
      note: "Reference values, VAT not included — every project is quoted around what you actually need.",
      plans: [
        {
          n: "01",
          name: "Startup Site",
          tagline: "For those just getting started.",
          price: "€350",
          priceNote: "one-off payment · landing page (1 page)",
          color: "#ad5fb0",
          featured: false,
          features: [
            "High-impact landing page",
            "Responsive, mobile-first design",
            "Essential SEO setup",
            "Integrated contact form",
            "Domain and hosting for year one",
          ],
          cta: "Request a quote",
        },
        {
          n: "02",
          name: "Multipage / Content Management Site",
          tagline: "For growing businesses.",
          price: "€500",
          priceNote: "one-off payment · up to 6 pages",
          color: "#cfa563",
          featured: true,
          features: [
            "Up to 6 content pages",
            "Content management backoffice",
            "Blog or news section",
            "Advanced SEO + Google Analytics",
            "3 months of follow-up support included",
          ],
          cta: "Request a quote",
        },
        {
          n: "03",
          name: "Corporate Site",
          tagline: "More than a site — a platform built around you.",
          price: "On request",
          priceNote: "custom quote",
          color: "#d97bb0",
          featured: false,
          features: [
            "Bespoke web platforms and applications",
            "E-commerce, integrations and APIs (CRM, ERP)",
            "Multilingual — PT, EN and more",
            "Scalable architecture and advanced security",
            "Dedicated team and ongoing support",
          ],
          cta: "Talk to the family",
        },
      ],
    },
    usp: {
      eyebrow: "Our promise",
      titlePre: "Technology that",
      titleEm: "adapts",
      titlePost: "to you — not the other way around.",
      items: [
        {
          title: "Bespoke software",
          body: "Every project is unique and unrepeatable, one of a kind and built to last.",
        },
        {
          title: "Active networking",
          body: "One technology arm, one networking arm — business that draws in business.",
        },
        {
          title: "Infrastructure & Cloud",
          body: "Azure, AWS, networks and support — the whole house in order, behind the screen.",
        },
        {
          title: "Devs with a thing for simplicity",
          body: "We translate jargon into people-language.",
        },
        {
          title: "Backoffices people enjoy using",
          body: "Management, analytics and SEO — no amateur hour, no pop-ups, no pretending.",
        },
        {
          title: "Ongoing support",
          body: "We don't disappear after deploy. We stay at the table.",
        },
      ],
    },
    cta: {
      title: "Not sure where to start?",
      body: "Tell us what you have in mind — we'll recommend the right scope, the right team and the right technology for the job.",
      cta: "Talk to the family",
    },
  },

  work: {
    hero: {
      eyebrow: "The Neighbourhood",
      titlePre: "A good",
      titleEm: "neighbourhood",
      titlePost: "raises property value.",
      body: "Some of the neighbours we've already done business with — Sporting Clube de Portugal, Vinha, Aubay Portugal and Efficient Safe. Every project, a story of its own. Together, our neighbourhood.",
    },
    filters: [
      "All",
      "Sporting CP",
      "Vinha",
      "Aubay",
      "Efficient Safe",
      "Crédito Agrícola",
      "BMW",
    ],
    projects: [
      {
        title: "Sporting CP — Ticketing & Loja Verde",
        category: "Sporting CP",
        year: "2023",
        blurb:
          "Ticketing system, online store (lojaverde.sporting.pt) with backoffice, analytics and SEO, and Corporate Matchday with QR-code ticket distribution.",
        tags: ["E-commerce", "Backoffice", "QR Code"],
      },
      {
        title: "Sporting CP — Gamebox & Internal App",
        category: "Sporting CP",
        year: "2023",
        blurb:
          "Gamebox platform (gamebox.sporting.pt) and the club's internal app — two faces of a single technological house.",
        tags: ["Web Platform", "Internal App"],
      },
      {
        title: "Vinha — Rebrand & Online Store",
        category: "Vinha",
        year: "2023",
        blurb:
          "Full rebrand, new online store and backoffice with bespoke integrations — a brand renewed from the ground up, store front and all.",
        tags: ["Rebrand", "E-commerce", "Integrations"],
      },
      {
        title: "Aubay Portugal — Timesheet App",
        category: "Aubay",
        year: "2024",
        blurb:
          "A time-tracking app built for large teams — simple to use, easy to manage, with zero day-to-day friction.",
        tags: ["Internal App", ".NET", "React"],
      },
      {
        title: "Aubay Portugal — Resource Manager",
        category: "Aubay",
        year: "2024",
        blurb:
          "A recruitment and resource management platform, with an international form for cross-border applications.",
        tags: ["Recruitment", "Web Platform"],
      },
      {
        title: "Efficient Safe — App & Backoffice",
        category: "Efficient Safe",
        year: "2024",
        blurb:
          "A mobile app for accessing insurance documents with a Steevanz access-management plugin, plus a full support backoffice.",
        tags: ["Mobile", "Access Plugin", "Backoffice"],
      },
      {
        title: "Crédito Agrícola — Bespoke Frontend Platforms",
        category: "Crédito Agrícola",
        year: "2025",
        blurb:
          "Key technical voice translating business and design requirements into scalable frontend solutions — projects built from scratch in Angular 20, with a Vue 2 to Vue 3 migration and Pinia and @ngrx/signals adopted for modern state management.",
        tags: ["Angular", "Vue 3", "Design Systems"],
      },
      {
        title: "BMW — Modular Frontend Platform",
        category: "BMW",
        year: "2023",
        blurb:
          "Angular services consuming multiple RESTful APIs, with adapters transforming responses into data models, NgRx for state, lazy-loaded modules, custom directives, route guards, and tests written with Jest and Cypress.",
        tags: ["Angular", "NgRx", "Testing"],
      },
    ],
    cta: {
      title: "Want to be the next neighbour?",
      body: "A good neighbourhood raises property value — let's see if there's room for your business right next door.",
      cta: "Pitch your project",
    },
  },

  contact: {
    hero: {
      eyebrow: "Reach Out · Contact",
      titlePre: "“Skill is fine, and",
      titleEm: "genius",
      titlePost: "is splendid…”",
      quoteAttr:
        "“...but the right contacts are more valuable than either.” — Arthur Conan Doyle, Sherlock Holmes",
      body: "Tell us a little about your business and what you have in mind. A flesh-and-bone Steevanz — never a robot — will get back to you as soon as possible.",
    },
    info: {
      address: "Alentejo IT estate · CBD Lisbon",
    },
    form: {
      topicsLegend: "What do you want to talk about?",
      topics: ["Bespoke Software", "E-Commerce", "Applications", "Other"],
      nameLabel: "Name",
      namePlaceholder: "Your name",
      emailLabel: "Email",
      emailPlaceholder: "you@company.com",
      companyLabel: "Company",
      companyPlaceholder: "Company or project name",
      messageLabel: "Tell us more",
      messagePlaceholder: "What's on your mind, and how can we help?",
      submitIdle: "Let's talk",
      submitLoading: "Sending",
      disclaimer: "No spam — just a real reply, from real people.",
      errorMessage:
        "Something went wrong sending your message. Please try again or email us at rcabaco@steevanz.com.",
      sentTitle: "Message received",
      sentBody:
        "Thanks for reaching out — we'll get back to you soon. No pretending, no pop-ups, no amateur hour.",
    },
  },
};

export const content = { pt, en } as const;
