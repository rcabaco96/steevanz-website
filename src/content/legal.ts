import type { Localized } from "@/lib/i18n";

export interface LegalSection {
  id: string;
  title: string;
  paragraphs: string[];
  list?: string[];
}

export interface LegalDocument {
  metaTitle: string;
  metaDescription: string;
  title: string;
  intro: string;
  updated: string;
  sections: LegalSection[];
}

export type LegalDocumentId = "privacy" | "cookies" | "terms";

const updatedPt = "Última atualização: 1 de outubro de 2026";
const updatedEn = "Last updated: 1 October 2026";

export const legalDocuments: Record<LegalDocumentId, Localized<LegalDocument>> = {
  privacy: {
    pt: {
      metaTitle: "Política de privacidade | Steevanz",
      metaDescription: "Como a Steevanz recolhe, usa e protege os seus dados pessoais, ao abrigo do RGPD e da Lei n.º 58/2019. Os seus direitos e como exercê-los.",
      title: "Política de privacidade",
      intro:
        "Levamos a sério a proteção dos seus dados pessoais. Esta política explica que dados recolhemos através deste site, para que os usamos, com quem os partilhamos e que direitos tem, nos termos do Regulamento Geral sobre a Proteção de Dados (RGPD) e da Lei n.º 58/2019.",
      updated: updatedPt,
      sections: [
        {
          id: "responsavel",
          title: "1. Responsável pelo tratamento",
          paragraphs: [
            "O responsável pelo tratamento dos dados pessoais recolhidos neste site é a Steevanz. Para qualquer questão sobre privacidade pode contactar-nos através do e-mail [rcabaco@steevanz.com](mailto:rcabaco@steevanz.com).",
          ],
        },
        {
          id: "dados",
          title: "2. Que dados recolhemos",
          paragraphs: ["Recolhemos apenas os dados necessários para responder ao seu pedido:"],
          list: [
            "**Pedidos de demonstração e de informação:** nome, e-mail, telefone, nome do negócio, setor, produto de interesse, mensagem, data e hora escolhidas e o idioma do site.",
            "**Contacto direto:** os dados que nos envie por e-mail, telefone ou WhatsApp.",
            "**Dados técnicos:** endereço IP (usado de forma transitória para segurança e prevenção de abusos) e métricas agregadas e anónimas de utilização do site, sem cookies de rastreio.",
          ],
        },
        {
          id: "finalidades",
          title: "3. Finalidades e fundamentos jurídicos",
          paragraphs: ["Tratamos os seus dados para as seguintes finalidades:"],
          list: [
            "Agendar e realizar a demonstração pedida e enviar-lhe uma proposta — diligências pré-contratuais a seu pedido (artigo 6.º, n.º 1, alínea b) do RGPD).",
            "Responder a pedidos de informação — consentimento prestado no formulário (artigo 6.º, n.º 1, alínea a)), que pode retirar a qualquer momento.",
            "Garantir a segurança do site e prevenir envios abusivos — interesse legítimo (artigo 6.º, n.º 1, alínea f)).",
            "Cumprir obrigações legais, nomeadamente fiscais, caso venha a ser nosso cliente — obrigação jurídica (artigo 6.º, n.º 1, alínea c)).",
          ],
        },
        {
          id: "conservacao",
          title: "4. Prazo de conservação",
          paragraphs: [
            "Os dados de pedidos de demonstração e de informação são conservados durante o tempo necessário para dar seguimento ao pedido e, no máximo, 24 meses após o último contacto, caso não se venha a estabelecer uma relação comercial. Os dados de clientes são conservados durante a relação contratual e pelos prazos legais aplicáveis, nomeadamente 10 anos para documentos com relevância fiscal.",
          ],
        },
        {
          id: "subcontratantes",
          title: "5. Com quem partilhamos os dados",
          paragraphs: [
            "Não vendemos nem cedemos os seus dados para fins de marketing. Recorremos a prestadores de serviços que tratam dados por nossa conta, ao abrigo de acordos de tratamento de dados:",
          ],
          list: [
            "**Vercel Inc.** — alojamento do site e métricas anónimas de utilização.",
            "**Supabase Inc.** — base de dados onde ficam guardados os pedidos, alojada na União Europeia.",
            "**Resend** — envio de e-mails de notificação e confirmação.",
          ],
        },
        {
          id: "transferencias",
          title: "6. Transferências internacionais",
          paragraphs: [
            "Alguns destes prestadores têm sede nos Estados Unidos. Sempre que exista transferência de dados para fora do Espaço Económico Europeu, esta é feita com base numa decisão de adequação (EU-US Data Privacy Framework) ou em cláusulas contratuais-tipo aprovadas pela Comissão Europeia.",
          ],
        },
        {
          id: "direitos",
          title: "7. Os seus direitos",
          paragraphs: ["Nos termos do RGPD, tem direito a:"],
          list: [
            "aceder aos seus dados e obter uma cópia;",
            "retificar dados inexatos ou incompletos;",
            "pedir o apagamento dos dados;",
            "limitar ou opor-se ao tratamento;",
            "portabilidade dos dados que nos forneceu;",
            "retirar o consentimento a qualquer momento, sem comprometer a licitude do tratamento anterior.",
          ],
        },
        {
          id: "exercicio",
          title: "8. Como exercer os seus direitos",
          paragraphs: [
            "Envie um e-mail para [rcabaco@steevanz.com](mailto:rcabaco@steevanz.com) indicando o direito que pretende exercer. Respondemos no prazo máximo de um mês. Tem ainda o direito de apresentar reclamação à Comissão Nacional de Proteção de Dados (CNPD), em [www.cnpd.pt](https://www.cnpd.pt).",
          ],
        },
        {
          id: "seguranca",
          title: "9. Segurança",
          paragraphs: [
            "Aplicamos medidas técnicas e organizativas adequadas para proteger os seus dados, incluindo comunicações cifradas (HTTPS), controlo de acessos restrito à equipa autorizada e registo de acessos à área de gestão.",
          ],
        },
        {
          id: "alteracoes",
          title: "10. Alterações a esta política",
          paragraphs: [
            "Podemos atualizar esta política para refletir alterações legais ou nos nossos serviços. A data da última atualização está sempre indicada no topo desta página.",
          ],
        },
      ],
    },
    en: {
      metaTitle: "Privacy policy | Steevanz",
      metaDescription: "How Steevanz collects, uses and protects your personal data under the GDPR and Portuguese Law 58/2019. Your rights and how to exercise them.",
      title: "Privacy policy",
      intro:
        "We take the protection of your personal data seriously. This policy explains what data we collect through this website, what we use it for, who we share it with and what rights you have under the General Data Protection Regulation (GDPR) and Portuguese Law 58/2019.",
      updated: updatedEn,
      sections: [
        {
          id: "controller",
          title: "1. Data controller",
          paragraphs: [
            "The controller of the personal data collected on this website is Steevanz. For any privacy question, email us at [rcabaco@steevanz.com](mailto:rcabaco@steevanz.com).",
          ],
        },
        {
          id: "data",
          title: "2. What data we collect",
          paragraphs: ["We only collect the data needed to handle your request:"],
          list: [
            "**Demo and information requests:** name, email, phone, business name, sector, product of interest, message, chosen date and time and the website language.",
            "**Direct contact:** any data you send us by email, phone or WhatsApp.",
            "**Technical data:** IP address (used transiently for security and abuse prevention) and aggregated, anonymous website usage metrics, without tracking cookies.",
          ],
        },
        {
          id: "purposes",
          title: "3. Purposes and legal bases",
          paragraphs: ["We process your data for the following purposes:"],
          list: [
            "Scheduling and running the demo you requested and sending you a proposal — pre-contractual steps at your request (Article 6(1)(b) GDPR).",
            "Answering information requests — consent given in the form (Article 6(1)(a)), which you can withdraw at any time.",
            "Keeping the website secure and preventing abusive submissions — legitimate interest (Article 6(1)(f)).",
            "Complying with legal obligations, namely tax obligations, if you become a client — legal obligation (Article 6(1)(c)).",
          ],
        },
        {
          id: "retention",
          title: "4. Retention",
          paragraphs: [
            "Demo and information request data is kept for as long as needed to follow up and for no more than 24 months after the last contact if no business relationship is established. Client data is kept for the duration of the contract and the applicable legal periods, namely 10 years for tax-relevant documents.",
          ],
        },
        {
          id: "processors",
          title: "5. Who we share data with",
          paragraphs: [
            "We never sell or hand over your data for marketing. We use service providers that process data on our behalf under data processing agreements:",
          ],
          list: [
            "**Vercel Inc.** — website hosting and anonymous usage metrics.",
            "**Supabase Inc.** — database where requests are stored, hosted in the European Union.",
            "**Resend** — delivery of notification and confirmation emails.",
          ],
        },
        {
          id: "transfers",
          title: "6. International transfers",
          paragraphs: [
            "Some of these providers are based in the United States. Whenever data is transferred outside the European Economic Area, this relies on an adequacy decision (EU-US Data Privacy Framework) or on standard contractual clauses approved by the European Commission.",
          ],
        },
        {
          id: "rights",
          title: "7. Your rights",
          paragraphs: ["Under the GDPR you have the right to:"],
          list: [
            "access your data and obtain a copy;",
            "rectify inaccurate or incomplete data;",
            "request erasure of your data;",
            "restrict or object to processing;",
            "data portability for data you provided;",
            "withdraw consent at any time, without affecting the lawfulness of prior processing.",
          ],
        },
        {
          id: "exercise",
          title: "8. How to exercise your rights",
          paragraphs: [
            "Email [rcabaco@steevanz.com](mailto:rcabaco@steevanz.com) stating the right you wish to exercise. We reply within one month. You also have the right to lodge a complaint with the Portuguese data protection authority (CNPD) at [www.cnpd.pt](https://www.cnpd.pt).",
          ],
        },
        {
          id: "security",
          title: "9. Security",
          paragraphs: [
            "We apply appropriate technical and organisational measures to protect your data, including encrypted connections (HTTPS), access restricted to authorised staff and logging of access to the management area.",
          ],
        },
        {
          id: "changes",
          title: "10. Changes to this policy",
          paragraphs: [
            "We may update this policy to reflect legal changes or changes to our services. The date of the last update is always shown at the top of this page.",
          ],
        },
      ],
    },
  },
  cookies: {
    pt: {
      metaTitle: "Política de cookies | Steevanz",
      metaDescription: "O site da Steevanz não usa cookies de publicidade nem de rastreio. Saiba que tecnologias de armazenamento usamos e como as pode gerir no navegador.",
      title: "Política de cookies",
      intro:
        "Os cookies são pequenos ficheiros guardados no seu dispositivo quando visita um site. Este site foi desenhado para funcionar com o mínimo possível: não usamos cookies de publicidade, de redes sociais nem de rastreio entre sites.",
      updated: updatedPt,
      sections: [
        {
          id: "o-que-usamos",
          title: "1. O que usamos",
          paragraphs: ["Usamos apenas tecnologias estritamente necessárias ou que não identificam o visitante:"],
          list: [
            "**Preferência de tema (claro ou escuro):** guardada no armazenamento local do navegador (`localStorage`), apenas no seu dispositivo, sem qualquer envio para os nossos servidores.",
            "**Sessão da área de gestão:** cookies de autenticação usados exclusivamente pela equipa da Steevanz na área reservada. Não são colocados a visitantes do site público.",
            "**Métricas de utilização:** o Vercel Web Analytics e o Speed Insights recolhem dados agregados e anónimos sobre páginas visitadas e desempenho, sem cookies e sem identificar o visitante.",
          ],
        },
        {
          id: "consentimento",
          title: "2. Porque não mostramos um banner de cookies",
          paragraphs: [
            "Nos termos da Lei n.º 41/2004 e das orientações da CNPD, o consentimento só é exigido para cookies que não sejam estritamente necessários. Como não usamos cookies de publicidade ou rastreio, não precisamos de lhe pedir consentimento. Se isso mudar, atualizaremos esta política e pediremos a sua autorização antes de colocar esses cookies.",
          ],
        },
        {
          id: "terceiros",
          title: "3. Serviços de terceiros",
          paragraphs: [
            "Ao clicar em ligações para o WhatsApp, Instagram ou Google, sai do nosso site e passa a aplicar-se a política de privacidade e de cookies desses serviços.",
          ],
        },
        {
          id: "gerir",
          title: "4. Como gerir ou apagar",
          paragraphs: [
            "Pode apagar os dados guardados pelo site a qualquer momento nas definições do seu navegador, na secção de privacidade ou de dados de sites. Em caso de dúvida, escreva-nos para [rcabaco@steevanz.com](mailto:rcabaco@steevanz.com).",
          ],
        },
      ],
    },
    en: {
      metaTitle: "Cookie policy | Steevanz",
      metaDescription: "The Steevanz website uses no advertising or tracking cookies. Learn what storage technologies we use and how to manage them in your browser.",
      title: "Cookie policy",
      intro:
        "Cookies are small files stored on your device when you visit a website. This site is designed to work with as little as possible: we use no advertising, social media or cross-site tracking cookies.",
      updated: updatedEn,
      sections: [
        {
          id: "what-we-use",
          title: "1. What we use",
          paragraphs: ["We only use technologies that are strictly necessary or that do not identify visitors:"],
          list: [
            "**Theme preference (light or dark):** stored in your browser's local storage (`localStorage`), only on your device, never sent to our servers.",
            "**Management area session:** authentication cookies used exclusively by the Steevanz team in the private area. They are not set for visitors of the public website.",
            "**Usage metrics:** Vercel Web Analytics and Speed Insights collect aggregated, anonymous data about pages visited and performance, without cookies and without identifying visitors.",
          ],
        },
        {
          id: "consent",
          title: "2. Why there is no cookie banner",
          paragraphs: [
            "Under Portuguese Law 41/2004 and the guidance of the Portuguese data protection authority, consent is only required for cookies that are not strictly necessary. As we use no advertising or tracking cookies, we don't need to ask for consent. If that changes, we will update this policy and ask for your permission before setting such cookies.",
          ],
        },
        {
          id: "third-parties",
          title: "3. Third-party services",
          paragraphs: [
            "When you follow links to WhatsApp, Instagram or Google, you leave our website and the privacy and cookie policies of those services apply.",
          ],
        },
        {
          id: "manage",
          title: "4. How to manage or delete",
          paragraphs: [
            "You can delete data stored by this site at any time in your browser settings, under privacy or site data. If in doubt, email [rcabaco@steevanz.com](mailto:rcabaco@steevanz.com).",
          ],
        },
      ],
    },
  },
  terms: {
    pt: {
      metaTitle: "Termos e condições | Steevanz",
      metaDescription: "Termos e condições de utilização do site da Steevanz: preços indicativos, propostas, propriedade intelectual, marcas de terceiros e resolução de litígios.",
      title: "Termos e condições",
      intro:
        "Estes termos regulam a utilização do site steevanz.com. Ao navegar no site, aceita estas condições. A prestação de serviços é sempre regulada por proposta e contrato próprios.",
      updated: updatedPt,
      sections: [
        {
          id: "objeto",
          title: "1. Objeto do site",
          paragraphs: [
            "Este site apresenta os produtos e serviços da Steevanz e permite pedir demonstrações e informações. Não é possível comprar produtos ou contratar serviços diretamente no site.",
          ],
        },
        {
          id: "precos",
          title: "2. Preços e propostas",
          paragraphs: [
            "Os preços apresentados com a indicação \"desde\" são valores de referência, sem IVA, e podem ser alterados sem aviso prévio. O preço final, as condições de pagamento, os prazos e o nível de serviço constam da proposta enviada a cada cliente, que só é vinculativa após aceitação por ambas as partes.",
          ],
        },
        {
          id: "marcas",
          title: "3. Marcas de terceiros",
          paragraphs: [
            "Google, Google Maps e Perfil da Empresa no Google são marcas da Google LLC. WhatsApp, Instagram e Facebook são marcas da Meta Platforms, Inc. Apple Wallet é marca da Apple Inc. Estas marcas são referidas apenas para descrever a compatibilidade dos nossos produtos. A Steevanz é uma empresa independente e não tem qualquer afiliação, patrocínio ou aprovação destas entidades.",
          ],
        },
        {
          id: "propriedade",
          title: "4. Propriedade intelectual",
          paragraphs: [
            "Os textos, desenhos, marcas e código deste site pertencem à Steevanz ou são usados com licença. As fotografias e vídeos de banco de imagens são utilizados ao abrigo das licenças Pexels e Unsplash. Não é permitida a reprodução para fins comerciais sem autorização escrita.",
          ],
        },
        {
          id: "responsabilidade",
          title: "5. Responsabilidade",
          paragraphs: [
            "Fazemos o possível para manter a informação do site correta e atualizada, mas não garantimos que esteja livre de erros. As ferramentas de inteligência artificial descritas podem cometer erros e funcionam sempre com supervisão humana. Não nos responsabilizamos por conteúdos de sites de terceiros para os quais existam ligações.",
          ],
        },
        {
          id: "litigios",
          title: "6. Resolução alternativa de litígios",
          paragraphs: [
            "Em caso de litígio de consumo, o consumidor pode recorrer a uma entidade de resolução alternativa de litígios, nos termos da Lei n.º 144/2015, como o CNIACC — Centro Nacional de Informação e Arbitragem de Conflitos de Consumo ([www.cniacc.pt](https://www.cniacc.pt)). Mais informação no Portal do Consumidor ([www.consumidor.gov.pt](https://www.consumidor.gov.pt)). Dispomos de [Livro de Reclamações eletrónico](https://www.livroreclamacoes.pt).",
          ],
        },
        {
          id: "lei",
          title: "7. Lei aplicável",
          paragraphs: [
            "Estes termos regem-se pela lei portuguesa. Para qualquer litígio é competente o foro da comarca de Lisboa, sem prejuízo das normas imperativas aplicáveis aos consumidores.",
          ],
        },
      ],
    },
    en: {
      metaTitle: "Terms and conditions | Steevanz",
      metaDescription: "Terms of use of the Steevanz website: indicative prices, proposals, intellectual property, third-party trademarks and dispute resolution.",
      title: "Terms and conditions",
      intro:
        "These terms govern the use of the steevanz.com website. By browsing the site you accept these conditions. The provision of services is always governed by its own proposal and contract.",
      updated: updatedEn,
      sections: [
        {
          id: "purpose",
          title: "1. Purpose of the website",
          paragraphs: [
            "This website presents Steevanz products and services and lets you request demos and information. Products cannot be bought and services cannot be contracted directly on the website.",
          ],
        },
        {
          id: "prices",
          title: "2. Prices and proposals",
          paragraphs: [
            "Prices shown as \"from\" are reference values excluding VAT and may change without notice. The final price, payment terms, timelines and service level are set out in the proposal sent to each client, which is only binding once accepted by both parties.",
          ],
        },
        {
          id: "trademarks",
          title: "3. Third-party trademarks",
          paragraphs: [
            "Google, Google Maps and Google Business Profile are trademarks of Google LLC. WhatsApp, Instagram and Facebook are trademarks of Meta Platforms, Inc. Apple Wallet is a trademark of Apple Inc. These trademarks are mentioned only to describe the compatibility of our products. Steevanz is an independent company with no affiliation with, sponsorship by or endorsement from these companies.",
          ],
        },
        {
          id: "ip",
          title: "4. Intellectual property",
          paragraphs: [
            "The text, designs, marks and code of this website belong to Steevanz or are used under licence. Stock photos and videos are used under the Pexels and Unsplash licences. Commercial reproduction without written permission is not allowed.",
          ],
        },
        {
          id: "liability",
          title: "5. Liability",
          paragraphs: [
            "We do our best to keep the information on this website accurate and up to date, but we cannot guarantee it is error-free. The artificial intelligence tools described can make mistakes and always operate with human oversight. We are not responsible for the content of third-party websites we link to.",
          ],
        },
        {
          id: "disputes",
          title: "6. Alternative dispute resolution",
          paragraphs: [
            "In the event of a consumer dispute, consumers may use an alternative dispute resolution body under Portuguese Law 144/2015, such as CNIACC ([www.cniacc.pt](https://www.cniacc.pt)). More information is available on the Consumer Portal ([www.consumidor.gov.pt](https://www.consumidor.gov.pt)). We also provide an [electronic complaints book](https://www.livroreclamacoes.pt).",
          ],
        },
        {
          id: "law",
          title: "7. Governing law",
          paragraphs: [
            "These terms are governed by Portuguese law. The courts of Lisbon have jurisdiction over any dispute, without prejudice to mandatory consumer protection rules.",
          ],
        },
      ],
    },
  },
};
