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

const updatedPt = "Última atualização: 11 de outubro de 2026";
const updatedEn = "Last updated: 11 October 2026";
// es, fr, de, it: the date line at the top of each page also says the Portuguese text prevails.
const updatedEs = "Última actualización: 11 de octubre de 2026 · Esta traducción es informativa; en caso de divergencia prevalece la versión en portugués.";
const updatedFr = "Dernière mise à jour : 11 octobre 2026 · Cette traduction est fournie à titre informatif ; en cas de divergence, la version portugaise prévaut.";
const updatedDe = "Zuletzt aktualisiert: 11. Oktober 2026 · Diese Übersetzung dient nur zur Information; bei Abweichungen gilt die portugiesische Fassung.";
const updatedIt = "Ultimo aggiornamento: 11 ottobre 2026 · Questa traduzione ha valore informativo; in caso di divergenza prevale la versione in portoghese.";

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
          id: "google",
          title: "10. Dados da sua conta Google (Perfil da Empresa)",
          paragraphs: [
            "Se ligar o painel ao Google com «Ligar Google», pedimos-lhe autorização, no ecrã do próprio Google, para gerir o Perfil da Empresa no Google do seu negócio (permissão business.manage) e para saber o email da conta com que entrou.",
            "Usamos esse acesso apenas para mostrar no seu painel as reviews do seu negócio e as respostas que já deu, para identificar o perfil certo e, quando o pedir, publicar as respostas às reviews que aprovar. Não usamos estes dados para publicidade, não os vendemos nem os partilhamos com terceiros, e não os usamos para treinar modelos de inteligência artificial de terceiros.",
            "As chaves de acesso que o Google nos dá ficam guardadas cifradas e só são usadas pelos nossos servidores. Pode desligar a ligação a qualquer momento no seu painel ou em myaccount.google.com/permissions; ao desligar, apagamos as chaves.",
            "A utilização e a transferência para qualquer outra aplicação de informações recebidas das APIs da Google pela Steevanz cumprem a Política de Dados do Utilizador dos Serviços de API da Google, incluindo os requisitos de Utilização Limitada.",
          ],
        },
        {
          id: "alteracoes",
          title: "11. Alterações a esta política",
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
          id: "google",
          title: "10. Your Google account data (Business Profile)",
          paragraphs: [
            "If you connect the panel to Google with «Ligar Google», we ask your permission, on Google's own screen, to manage your business's Google Business Profile (business.manage permission) and to know the email of the account you signed in with.",
            "We use this access only to show your business's reviews and the replies you already gave in your panel, to identify the right profile and, when you ask, to publish the review replies you approve. We do not use this data for advertising, we do not sell it or share it with third parties, and we do not use it to train third-party AI models.",
            "The access keys Google gives us are stored encrypted and used only by our servers. You can disconnect at any time in your panel or at myaccount.google.com/permissions; when you disconnect, we delete the keys.",
            "Steevanz's use and transfer to any other app of information received from Google APIs will adhere to the Google API Services User Data Policy, including the Limited Use requirements.",
          ],
        },
        {
          id: "changes",
          title: "11. Changes to this policy",
          paragraphs: [
            "We may update this policy to reflect legal changes or changes to our services. The date of the last update is always shown at the top of this page.",
          ],
        },
      ],
    },
    es: {
      metaTitle: "Política de privacidad | Steevanz",
      metaDescription: "Cómo recoge, usa y protege Steevanz sus datos personales, conforme al RGPD y a la Ley portuguesa n.º 58/2019. Sus derechos y cómo ejercerlos.",
      title: "Política de privacidad",
      intro:
        "Nos tomamos en serio la protección de sus datos personales. Esta política explica qué datos recogemos a través de este sitio web, para qué los usamos, con quién los compartimos y qué derechos tiene, conforme al Reglamento General de Protección de Datos (RGPD) y a la Ley portuguesa n.º 58/2019.",
      updated: updatedEs,
      sections: [
        {
          id: "controller",
          title: "1. Responsable del tratamiento",
          paragraphs: [
            "El responsable del tratamiento de los datos personales recogidos en este sitio web es Steevanz. Para cualquier cuestión sobre privacidad puede escribirnos a [rcabaco@steevanz.com](mailto:rcabaco@steevanz.com).",
          ],
        },
        {
          id: "data",
          title: "2. Qué datos recogemos",
          paragraphs: ["Solo recogemos los datos necesarios para responder a su solicitud:"],
          list: [
            "**Solicitudes de demostración y de información:** nombre, correo electrónico, teléfono, nombre del negocio, sector, producto de interés, mensaje, fecha y hora elegidas y el idioma del sitio web.",
            "**Contacto directo:** los datos que nos envíe por correo electrónico, teléfono o WhatsApp.",
            "**Datos técnicos:** dirección IP (usada de forma transitoria por seguridad y para prevenir abusos) y métricas agregadas y anónimas de uso del sitio web, sin cookies de seguimiento.",
          ],
        },
        {
          id: "purposes",
          title: "3. Finalidades y bases jurídicas",
          paragraphs: ["Tratamos sus datos con las siguientes finalidades:"],
          list: [
            "Programar y realizar la demostración solicitada y enviarle una propuesta: medidas precontractuales a petición suya (artículo 6.1.b) del RGPD).",
            "Responder a solicitudes de información: consentimiento prestado en el formulario (artículo 6.1.a)), que puede retirar en cualquier momento.",
            "Garantizar la seguridad del sitio web y prevenir envíos abusivos: interés legítimo (artículo 6.1.f)).",
            "Cumplir obligaciones legales, en particular fiscales, si llega a ser cliente nuestro: obligación legal (artículo 6.1.c)).",
          ],
        },
        {
          id: "retention",
          title: "4. Plazo de conservación",
          paragraphs: [
            "Los datos de las solicitudes de demostración y de información se conservan durante el tiempo necesario para dar curso a la solicitud y, como máximo, 24 meses después del último contacto si no llega a establecerse una relación comercial. Los datos de clientes se conservan durante la relación contractual y durante los plazos legales aplicables, en particular 10 años para los documentos con relevancia fiscal.",
          ],
        },
        {
          id: "processors",
          title: "5. Con quién compartimos los datos",
          paragraphs: [
            "No vendemos ni cedemos sus datos con fines de marketing. Recurrimos a proveedores de servicios que tratan datos por cuenta nuestra, en virtud de contratos de encargo del tratamiento:",
          ],
          list: [
            "**Vercel Inc.**: alojamiento del sitio web y métricas anónimas de uso.",
            "**Supabase Inc.**: base de datos donde se guardan las solicitudes, alojada en la Unión Europea.",
            "**Resend**: envío de correos electrónicos de notificación y confirmación.",
          ],
        },
        {
          id: "transfers",
          title: "6. Transferencias internacionales",
          paragraphs: [
            "Algunos de estos proveedores tienen su sede en los Estados Unidos. Siempre que haya una transferencia de datos fuera del Espacio Económico Europeo, se realiza sobre la base de una decisión de adecuación (Marco de Privacidad de Datos UE-EE. UU.) o de cláusulas contractuales tipo aprobadas por la Comisión Europea.",
          ],
        },
        {
          id: "rights",
          title: "7. Sus derechos",
          paragraphs: ["Conforme al RGPD, tiene derecho a:"],
          list: [
            "acceder a sus datos y obtener una copia;",
            "rectificar datos inexactos o incompletos;",
            "solicitar la supresión de los datos;",
            "limitar el tratamiento u oponerse a él;",
            "la portabilidad de los datos que nos ha facilitado;",
            "retirar el consentimiento en cualquier momento, sin que ello afecte a la licitud del tratamiento anterior.",
          ],
        },
        {
          id: "exercise",
          title: "8. Cómo ejercer sus derechos",
          paragraphs: [
            "Envíe un correo electrónico a [rcabaco@steevanz.com](mailto:rcabaco@steevanz.com) indicando el derecho que desea ejercer. Respondemos en un plazo máximo de un mes. También tiene derecho a presentar una reclamación ante la autoridad portuguesa de protección de datos, la Comissão Nacional de Proteção de Dados (CNPD), en [www.cnpd.pt](https://www.cnpd.pt).",
          ],
        },
        {
          id: "security",
          title: "9. Seguridad",
          paragraphs: [
            "Aplicamos medidas técnicas y organizativas adecuadas para proteger sus datos, incluidas comunicaciones cifradas (HTTPS), acceso restringido al equipo autorizado y registro de los accesos al área de gestión.",
          ],
        },
        {
          id: "google",
          title: "10. Datos de su cuenta de Google (Perfil de Empresa)",
          paragraphs: [
            "Si conecta el panel a Google con «Ligar Google», le pedimos autorización, en la propia pantalla de Google, para gestionar el Perfil de Empresa de Google de su negocio (permiso business.manage) y para conocer el correo electrónico de la cuenta con la que ha iniciado sesión.",
            "Usamos ese acceso únicamente para mostrar en su panel las reseñas de su negocio y las respuestas que ya ha dado, para identificar el perfil correcto y, cuando usted lo pida, publicar las respuestas a las reseñas que apruebe. No usamos estos datos para publicidad, no los vendemos ni los compartimos con terceros, y no los usamos para entrenar modelos de inteligencia artificial de terceros.",
            "Las claves de acceso que nos facilita Google se guardan cifradas y solo las usan nuestros servidores. Puede desconectar la conexión en cualquier momento desde su panel o en myaccount.google.com/permissions; al desconectar, borramos las claves.",
            "El uso por parte de Steevanz de la información recibida de las API de Google, y su transferencia a cualquier otra aplicación, cumplen la Política de Datos de Usuario de los Servicios de API de Google, incluidos los requisitos de Uso Limitado.",
          ],
        },
        {
          id: "changes",
          title: "11. Cambios en esta política",
          paragraphs: [
            "Podemos actualizar esta política para reflejar cambios legales o en nuestros servicios. La fecha de la última actualización figura siempre en la parte superior de esta página.",
          ],
        },
      ],
    },
    fr: {
      metaTitle: "Politique de confidentialité | Steevanz",
      metaDescription: "Comment Steevanz collecte, utilise et protège vos données personnelles, conformément au RGPD et à la loi portugaise n° 58/2019. Vos droits et comment les exercer.",
      title: "Politique de confidentialité",
      intro:
        "Nous prenons au sérieux la protection de vos données personnelles. Cette politique explique quelles données nous collectons via ce site, à quoi elles servent, avec qui nous les partageons et quels sont vos droits, conformément au Règlement général sur la protection des données (RGPD) et à la loi portugaise n° 58/2019.",
      updated: updatedFr,
      sections: [
        {
          id: "controller",
          title: "1. Responsable du traitement",
          paragraphs: [
            "Le responsable du traitement des données personnelles collectées sur ce site est Steevanz. Pour toute question relative à la confidentialité, vous pouvez nous écrire à [rcabaco@steevanz.com](mailto:rcabaco@steevanz.com).",
          ],
        },
        {
          id: "data",
          title: "2. Quelles données nous collectons",
          paragraphs: ["Nous ne collectons que les données nécessaires pour répondre à votre demande :"],
          list: [
            "**Demandes de démonstration et d'information :** nom, e-mail, téléphone, nom de l'entreprise, secteur, produit concerné, message, date et heure choisies et langue du site.",
            "**Contact direct :** les données que vous nous envoyez par e-mail, téléphone ou WhatsApp.",
            "**Données techniques :** adresse IP (utilisée de façon temporaire pour la sécurité et la prévention des abus) et statistiques agrégées et anonymes d'utilisation du site, sans cookies de suivi.",
          ],
        },
        {
          id: "purposes",
          title: "3. Finalités et bases juridiques",
          paragraphs: ["Nous traitons vos données pour les finalités suivantes :"],
          list: [
            "Organiser et réaliser la démonstration demandée et vous envoyer une proposition : mesures précontractuelles prises à votre demande (article 6, paragraphe 1, point b) du RGPD).",
            "Répondre aux demandes d'information : consentement donné dans le formulaire (article 6, paragraphe 1, point a)), que vous pouvez retirer à tout moment.",
            "Assurer la sécurité du site et prévenir les envois abusifs : intérêt légitime (article 6, paragraphe 1, point f)).",
            "Respecter nos obligations légales, notamment fiscales, si vous devenez client : obligation légale (article 6, paragraphe 1, point c)).",
          ],
        },
        {
          id: "retention",
          title: "4. Durée de conservation",
          paragraphs: [
            "Les données des demandes de démonstration et d'information sont conservées le temps nécessaire pour donner suite à la demande et au maximum 24 mois après le dernier contact si aucune relation commerciale ne s'établit. Les données des clients sont conservées pendant la relation contractuelle et pendant les durées légales applicables, notamment 10 ans pour les documents ayant une valeur fiscale.",
          ],
        },
        {
          id: "processors",
          title: "5. Avec qui nous partageons les données",
          paragraphs: [
            "Nous ne vendons ni ne cédons vos données à des fins de marketing. Nous faisons appel à des prestataires qui traitent des données pour notre compte, dans le cadre d'accords de traitement des données :",
          ],
          list: [
            "**Vercel Inc.** : hébergement du site et statistiques anonymes d'utilisation.",
            "**Supabase Inc.** : base de données où sont enregistrées les demandes, hébergée dans l'Union européenne.",
            "**Resend** : envoi des e-mails de notification et de confirmation.",
          ],
        },
        {
          id: "transfers",
          title: "6. Transferts internationaux",
          paragraphs: [
            "Certains de ces prestataires ont leur siège aux États-Unis. Chaque fois que des données sont transférées hors de l'Espace économique européen, ce transfert repose sur une décision d'adéquation (cadre de protection des données UE-États-Unis) ou sur des clauses contractuelles types approuvées par la Commission européenne.",
          ],
        },
        {
          id: "rights",
          title: "7. Vos droits",
          paragraphs: ["Conformément au RGPD, vous avez le droit :"],
          list: [
            "d'accéder à vos données et d'en obtenir une copie ;",
            "de rectifier des données inexactes ou incomplètes ;",
            "de demander l'effacement de vos données ;",
            "de limiter le traitement ou de vous y opposer ;",
            "à la portabilité des données que vous nous avez fournies ;",
            "de retirer votre consentement à tout moment, sans remettre en cause la licéité du traitement antérieur.",
          ],
        },
        {
          id: "exercise",
          title: "8. Comment exercer vos droits",
          paragraphs: [
            "Envoyez un e-mail à [rcabaco@steevanz.com](mailto:rcabaco@steevanz.com) en indiquant le droit que vous souhaitez exercer. Nous répondons dans un délai maximal d'un mois. Vous avez également le droit d'introduire une réclamation auprès de l'autorité portugaise de protection des données, la Comissão Nacional de Proteção de Dados (CNPD), sur [www.cnpd.pt](https://www.cnpd.pt).",
          ],
        },
        {
          id: "security",
          title: "9. Sécurité",
          paragraphs: [
            "Nous appliquons des mesures techniques et organisationnelles appropriées pour protéger vos données, notamment des communications chiffrées (HTTPS), un accès réservé à l'équipe autorisée et la journalisation des accès à l'espace de gestion.",
          ],
        },
        {
          id: "google",
          title: "10. Données de votre compte Google (fiche d'établissement)",
          paragraphs: [
            "Si vous connectez le tableau de bord à Google avec « Ligar Google », nous vous demandons l'autorisation, sur l'écran de Google lui-même, de gérer la fiche d'établissement Google de votre entreprise (autorisation business.manage) et de connaître l'adresse e-mail du compte avec lequel vous vous êtes connecté.",
            "Nous utilisons cet accès uniquement pour afficher dans votre tableau de bord les avis de votre entreprise et les réponses que vous avez déjà données, pour identifier la bonne fiche et, à votre demande, pour publier les réponses aux avis que vous approuvez. Nous n'utilisons pas ces données à des fins publicitaires, nous ne les vendons pas, nous ne les partageons pas avec des tiers et nous ne les utilisons pas pour entraîner des modèles d'intelligence artificielle de tiers.",
            "Les clés d'accès que Google nous fournit sont stockées chiffrées et utilisées uniquement par nos serveurs. Vous pouvez couper la connexion à tout moment depuis votre tableau de bord ou sur myaccount.google.com/permissions ; dans ce cas, nous supprimons les clés.",
            "L'utilisation par Steevanz des informations reçues des API Google, et leur transfert vers toute autre application, respectent le Règlement sur les données utilisateur des services d'API Google, y compris les exigences d'utilisation limitée.",
          ],
        },
        {
          id: "changes",
          title: "11. Modifications de cette politique",
          paragraphs: [
            "Nous pouvons mettre à jour cette politique pour refléter des évolutions légales ou de nos services. La date de la dernière mise à jour est toujours indiquée en haut de cette page.",
          ],
        },
      ],
    },
    de: {
      metaTitle: "Datenschutzerklärung | Steevanz",
      metaDescription: "Wie Steevanz Ihre personenbezogenen Daten nach der DSGVO und dem portugiesischen Gesetz Nr. 58/2019 erhebt, nutzt und schützt. Ihre Rechte und wie Sie sie ausüben.",
      // Soft hyphen (\u00AD): the one-word German title is wider than a 360 px screen.
      title: "Datenschutz\u00ADerklärung",
      intro:
        "Der Schutz Ihrer personenbezogenen Daten ist uns wichtig. Diese Erklärung erläutert, welche Daten wir über diese Website erheben, wofür wir sie verwenden, an wen wir sie weitergeben und welche Rechte Sie nach der Datenschutz-Grundverordnung (DSGVO) und dem portugiesischen Gesetz Nr. 58/2019 haben.",
      updated: updatedDe,
      sections: [
        {
          id: "controller",
          title: "1. Verantwortlicher",
          paragraphs: [
            "Verantwortlicher für die auf dieser Website erhobenen personenbezogenen Daten ist Steevanz. Bei Fragen zum Datenschutz erreichen Sie uns per E-Mail unter [rcabaco@steevanz.com](mailto:rcabaco@steevanz.com).",
          ],
        },
        {
          id: "data",
          title: "2. Welche Daten wir erheben",
          paragraphs: ["Wir erheben nur die Daten, die zur Bearbeitung Ihrer Anfrage nötig sind:"],
          list: [
            "**Demo- und Informationsanfragen:** Name, E-Mail, Telefon, Name des Unternehmens, Branche, gewünschtes Produkt, Nachricht, gewähltes Datum und Uhrzeit sowie die Sprache der Website.",
            "**Direkter Kontakt:** die Daten, die Sie uns per E-Mail, Telefon oder WhatsApp senden.",
            "**Technische Daten:** IP-Adresse (vorübergehend zur Sicherheit und Missbrauchsvermeidung verwendet) sowie zusammengefasste, anonyme Nutzungsstatistiken der Website, ohne Tracking-Cookies.",
          ],
        },
        {
          id: "purposes",
          title: "3. Zwecke und Rechtsgrundlagen",
          paragraphs: ["Wir verarbeiten Ihre Daten zu folgenden Zwecken:"],
          list: [
            "Planung und Durchführung der angefragten Demo und Zusendung eines Angebots: vorvertragliche Maßnahmen auf Ihre Anfrage (Art. 6 Abs. 1 lit. b DSGVO).",
            "Beantwortung von Informationsanfragen: im Formular erteilte Einwilligung (Art. 6 Abs. 1 lit. a DSGVO), die Sie jederzeit widerrufen können.",
            "Sicherheit der Website und Schutz vor missbräuchlichen Übermittlungen: berechtigtes Interesse (Art. 6 Abs. 1 lit. f DSGVO).",
            "Erfüllung gesetzlicher, insbesondere steuerlicher Pflichten, falls Sie Kunde werden: rechtliche Verpflichtung (Art. 6 Abs. 1 lit. c DSGVO).",
          ],
        },
        {
          id: "retention",
          title: "4. Speicherdauer",
          paragraphs: [
            "Daten aus Demo- und Informationsanfragen werden so lange gespeichert, wie es zur Bearbeitung der Anfrage nötig ist, höchstens jedoch 24 Monate nach dem letzten Kontakt, wenn keine Geschäftsbeziehung zustande kommt. Kundendaten werden für die Dauer des Vertragsverhältnisses und die geltenden gesetzlichen Fristen gespeichert, insbesondere 10 Jahre für steuerlich relevante Unterlagen.",
          ],
        },
        {
          id: "processors",
          title: "5. An wen wir Daten weitergeben",
          paragraphs: [
            "Wir verkaufen Ihre Daten nicht und geben sie nicht zu Marketingzwecken weiter. Wir setzen Dienstleister ein, die Daten in unserem Auftrag auf Grundlage von Auftragsverarbeitungsverträgen verarbeiten:",
          ],
          list: [
            "**Vercel Inc.**: Hosting der Website und anonyme Nutzungsstatistiken.",
            "**Supabase Inc.**: Datenbank, in der die Anfragen gespeichert werden, gehostet in der Europäischen Union.",
            "**Resend**: Versand von Benachrichtigungs- und Bestätigungs-E-Mails.",
          ],
        },
        {
          id: "transfers",
          title: "6. Internationale Übermittlungen",
          paragraphs: [
            "Einige dieser Dienstleister haben ihren Sitz in den Vereinigten Staaten. Werden Daten außerhalb des Europäischen Wirtschaftsraums übermittelt, geschieht dies auf Grundlage eines Angemessenheitsbeschlusses (EU-US Data Privacy Framework) oder von der Europäischen Kommission genehmigter Standardvertragsklauseln.",
          ],
        },
        {
          id: "rights",
          title: "7. Ihre Rechte",
          paragraphs: ["Nach der DSGVO haben Sie das Recht,"],
          list: [
            "auf Ihre Daten zuzugreifen und eine Kopie zu erhalten;",
            "unrichtige oder unvollständige Daten berichtigen zu lassen;",
            "die Löschung Ihrer Daten zu verlangen;",
            "die Verarbeitung einschränken zu lassen oder ihr zu widersprechen;",
            "die von Ihnen bereitgestellten Daten übertragen zu lassen;",
            "Ihre Einwilligung jederzeit zu widerrufen, ohne dass die Rechtmäßigkeit der bisherigen Verarbeitung berührt wird.",
          ],
        },
        {
          id: "exercise",
          title: "8. So üben Sie Ihre Rechte aus",
          paragraphs: [
            "Senden Sie eine E-Mail an [rcabaco@steevanz.com](mailto:rcabaco@steevanz.com) und nennen Sie das Recht, das Sie ausüben möchten. Wir antworten innerhalb von höchstens einem Monat. Sie haben außerdem das Recht, sich bei der portugiesischen Datenschutzbehörde, der Comissão Nacional de Proteção de Dados (CNPD), zu beschweren: [www.cnpd.pt](https://www.cnpd.pt).",
          ],
        },
        {
          id: "security",
          title: "9. Sicherheit",
          paragraphs: [
            "Wir setzen geeignete technische und organisatorische Maßnahmen zum Schutz Ihrer Daten ein, darunter verschlüsselte Verbindungen (HTTPS), Zugriff nur für autorisierte Mitarbeiter und die Protokollierung der Zugriffe auf den Verwaltungsbereich.",
          ],
        },
        {
          id: "google",
          title: "10. Daten Ihres Google-Kontos (Unternehmensprofil)",
          paragraphs: [
            "Wenn Sie das Dashboard über „Ligar Google“ mit Google verbinden, bitten wir Sie auf dem Bildschirm von Google selbst um die Erlaubnis, das Google-Unternehmensprofil Ihres Geschäfts zu verwalten (Berechtigung business.manage) und die E-Mail-Adresse des Kontos zu erfahren, mit dem Sie sich angemeldet haben.",
            "Wir nutzen diesen Zugriff nur, um Ihnen im Dashboard die Bewertungen Ihres Geschäfts und Ihre bisherigen Antworten anzuzeigen, das richtige Profil zu ermitteln und, wenn Sie es wünschen, die von Ihnen freigegebenen Antworten auf Bewertungen zu veröffentlichen. Wir nutzen diese Daten nicht für Werbung, verkaufen sie nicht, geben sie nicht an Dritte weiter und verwenden sie nicht zum Training von KI-Modellen Dritter.",
            "Die Zugriffsschlüssel, die Google uns gibt, werden verschlüsselt gespeichert und nur von unseren Servern verwendet. Sie können die Verbindung jederzeit in Ihrem Dashboard oder unter myaccount.google.com/permissions trennen; beim Trennen löschen wir die Schlüssel.",
            "Die Nutzung von Informationen, die Steevanz über Google-APIs erhält, und deren Übertragung an andere Apps entsprechen der Richtlinie zu Nutzerdaten für Google API-Dienste, einschließlich der Anforderungen zur eingeschränkten Nutzung.",
          ],
        },
        {
          id: "changes",
          title: "11. Änderungen dieser Erklärung",
          paragraphs: [
            "Wir können diese Erklärung aktualisieren, um gesetzliche Änderungen oder Änderungen unserer Dienste zu berücksichtigen. Das Datum der letzten Aktualisierung steht immer oben auf dieser Seite.",
          ],
        },
      ],
    },
    it: {
      metaTitle: "Informativa sulla privacy | Steevanz",
      metaDescription: "Come Steevanz raccoglie, usa e protegge i vostri dati personali ai sensi del GDPR e della legge portoghese n. 58/2019. I vostri diritti e come esercitarli.",
      title: "Informativa sulla privacy",
      intro:
        "Prendiamo sul serio la protezione dei vostri dati personali. Questa informativa spiega quali dati raccogliamo tramite questo sito, per cosa li usiamo, con chi li condividiamo e quali diritti avete ai sensi del Regolamento generale sulla protezione dei dati (GDPR) e della legge portoghese n. 58/2019.",
      updated: updatedIt,
      sections: [
        {
          id: "controller",
          title: "1. Titolare del trattamento",
          paragraphs: [
            "Il titolare del trattamento dei dati personali raccolti su questo sito è Steevanz. Per qualsiasi domanda sulla privacy potete scriverci all'indirizzo [rcabaco@steevanz.com](mailto:rcabaco@steevanz.com).",
          ],
        },
        {
          id: "data",
          title: "2. Quali dati raccogliamo",
          paragraphs: ["Raccogliamo solo i dati necessari per rispondere alla vostra richiesta:"],
          list: [
            "**Richieste di demo e di informazioni:** nome, e-mail, telefono, nome dell'attività, settore, prodotto di interesse, messaggio, data e ora scelte e la lingua del sito.",
            "**Contatto diretto:** i dati che ci inviate via e-mail, telefono o WhatsApp.",
            "**Dati tecnici:** indirizzo IP (usato in modo temporaneo per sicurezza e prevenzione degli abusi) e statistiche aggregate e anonime sull'uso del sito, senza cookie di tracciamento.",
          ],
        },
        {
          id: "purposes",
          title: "3. Finalità e basi giuridiche",
          paragraphs: ["Trattiamo i vostri dati per le seguenti finalità:"],
          list: [
            "Programmare e svolgere la demo richiesta e inviarvi una proposta: misure precontrattuali adottate su vostra richiesta (articolo 6, paragrafo 1, lettera b) del GDPR).",
            "Rispondere alle richieste di informazioni: consenso prestato nel modulo (articolo 6, paragrafo 1, lettera a)), che potete revocare in qualsiasi momento.",
            "Garantire la sicurezza del sito e prevenire invii abusivi: legittimo interesse (articolo 6, paragrafo 1, lettera f)).",
            "Adempiere agli obblighi di legge, in particolare fiscali, se diventate nostri clienti: obbligo legale (articolo 6, paragrafo 1, lettera c)).",
          ],
        },
        {
          id: "retention",
          title: "4. Periodo di conservazione",
          paragraphs: [
            "I dati delle richieste di demo e di informazioni sono conservati per il tempo necessario a dare seguito alla richiesta e al massimo per 24 mesi dall'ultimo contatto, se non si instaura un rapporto commerciale. I dati dei clienti sono conservati per la durata del rapporto contrattuale e per i termini di legge applicabili, in particolare 10 anni per i documenti con rilevanza fiscale.",
          ],
        },
        {
          id: "processors",
          title: "5. Con chi condividiamo i dati",
          paragraphs: [
            "Non vendiamo né cediamo i vostri dati per finalità di marketing. Ci avvaliamo di fornitori di servizi che trattano i dati per nostro conto, sulla base di accordi sul trattamento dei dati:",
          ],
          list: [
            "**Vercel Inc.**: hosting del sito e statistiche anonime di utilizzo.",
            "**Supabase Inc.**: database in cui sono conservate le richieste, ospitato nell'Unione europea.",
            "**Resend**: invio delle e-mail di notifica e di conferma.",
          ],
        },
        {
          id: "transfers",
          title: "6. Trasferimenti internazionali",
          paragraphs: [
            "Alcuni di questi fornitori hanno sede negli Stati Uniti. Ogni trasferimento di dati al di fuori dello Spazio economico europeo avviene sulla base di una decisione di adeguatezza (EU-US Data Privacy Framework) o di clausole contrattuali tipo approvate dalla Commissione europea.",
          ],
        },
        {
          id: "rights",
          title: "7. I vostri diritti",
          paragraphs: ["Ai sensi del GDPR avete il diritto di:"],
          list: [
            "accedere ai vostri dati e ottenerne una copia;",
            "rettificare dati inesatti o incompleti;",
            "chiedere la cancellazione dei dati;",
            "limitare il trattamento od opporvi a esso;",
            "ottenere la portabilità dei dati che ci avete fornito;",
            "revocare il consenso in qualsiasi momento, senza pregiudicare la liceità del trattamento precedente.",
          ],
        },
        {
          id: "exercise",
          title: "8. Come esercitare i vostri diritti",
          paragraphs: [
            "Inviate un'e-mail a [rcabaco@steevanz.com](mailto:rcabaco@steevanz.com) indicando il diritto che intendete esercitare. Rispondiamo entro un mese al massimo. Avete inoltre il diritto di presentare reclamo all'autorità portoghese per la protezione dei dati, la Comissão Nacional de Proteção de Dados (CNPD), su [www.cnpd.pt](https://www.cnpd.pt).",
          ],
        },
        {
          id: "security",
          title: "9. Sicurezza",
          paragraphs: [
            "Applichiamo misure tecniche e organizzative adeguate per proteggere i vostri dati, tra cui comunicazioni cifrate (HTTPS), accesso riservato al personale autorizzato e registrazione degli accessi all'area di gestione.",
          ],
        },
        {
          id: "google",
          title: "10. Dati del vostro account Google (Profilo dell'attività)",
          paragraphs: [
            "Se collegate il pannello a Google con «Ligar Google», vi chiediamo l'autorizzazione, nella schermata di Google stessa, a gestire il Profilo dell'attività su Google della vostra attività (autorizzazione business.manage) e a conoscere l'e-mail dell'account con cui avete effettuato l'accesso.",
            "Usiamo questo accesso solo per mostrare nel vostro pannello le recensioni della vostra attività e le risposte che avete già dato, per individuare il profilo giusto e, quando lo chiedete, per pubblicare le risposte alle recensioni che approvate. Non usiamo questi dati per la pubblicità, non li vendiamo né li condividiamo con terzi e non li usiamo per addestrare modelli di intelligenza artificiale di terzi.",
            "Le chiavi di accesso che Google ci fornisce sono conservate cifrate e usate solo dai nostri server. Potete scollegare l'account in qualsiasi momento dal vostro pannello o su myaccount.google.com/permissions; quando lo scollegate, cancelliamo le chiavi.",
            "L'uso da parte di Steevanz delle informazioni ricevute dalle API di Google, e il loro trasferimento a qualsiasi altra app, rispettano le Norme sui dati utente dei servizi API di Google, compresi i requisiti di Utilizzo limitato.",
          ],
        },
        {
          id: "changes",
          title: "11. Modifiche a questa informativa",
          paragraphs: [
            "Possiamo aggiornare questa informativa per riflettere modifiche di legge o dei nostri servizi. La data dell'ultimo aggiornamento è sempre indicata in cima a questa pagina.",
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
    es: {
      metaTitle: "Política de cookies | Steevanz",
      metaDescription: "El sitio web de Steevanz no usa cookies de publicidad ni de seguimiento. Sepa qué tecnologías de almacenamiento usamos y cómo gestionarlas en su navegador.",
      title: "Política de cookies",
      intro:
        "Las cookies son pequeños archivos que se guardan en su dispositivo cuando visita un sitio web. Este sitio está diseñado para funcionar con lo mínimo posible: no usamos cookies de publicidad, de redes sociales ni de seguimiento entre sitios.",
      updated: updatedEs,
      sections: [
        {
          id: "what-we-use",
          title: "1. Qué usamos",
          paragraphs: ["Solo usamos tecnologías estrictamente necesarias o que no identifican al visitante:"],
          list: [
            "**Preferencia de tema (claro u oscuro):** guardada en el almacenamiento local del navegador (`localStorage`), solo en su dispositivo, sin enviarse nunca a nuestros servidores.",
            "**Sesión del área de gestión:** cookies de autenticación usadas exclusivamente por el equipo de Steevanz en el área reservada. No se instalan a los visitantes del sitio público.",
            "**Métricas de uso:** Vercel Web Analytics y Speed Insights recogen datos agregados y anónimos sobre las páginas visitadas y el rendimiento, sin cookies y sin identificar al visitante.",
          ],
        },
        {
          id: "consent",
          title: "2. Por qué no mostramos un banner de cookies",
          paragraphs: [
            "Conforme a la Ley portuguesa n.º 41/2004 y a las orientaciones de la autoridad portuguesa de protección de datos (CNPD), el consentimiento solo se exige para las cookies que no son estrictamente necesarias. Como no usamos cookies de publicidad ni de seguimiento, no necesitamos pedirle su consentimiento. Si esto cambia, actualizaremos esta política y le pediremos autorización antes de instalar esas cookies.",
          ],
        },
        {
          id: "third-parties",
          title: "3. Servicios de terceros",
          paragraphs: [
            "Al hacer clic en enlaces a WhatsApp, Instagram o Google, sale de nuestro sitio web y pasan a aplicarse las políticas de privacidad y de cookies de esos servicios.",
          ],
        },
        {
          id: "manage",
          title: "4. Cómo gestionarlas o borrarlas",
          paragraphs: [
            "Puede borrar los datos guardados por el sitio web en cualquier momento en la configuración de su navegador, en el apartado de privacidad o de datos de sitios. Si tiene dudas, escríbanos a [rcabaco@steevanz.com](mailto:rcabaco@steevanz.com).",
          ],
        },
      ],
    },
    fr: {
      metaTitle: "Politique de cookies | Steevanz",
      metaDescription: "Le site Steevanz n'utilise aucun cookie publicitaire ni de suivi. Découvrez les technologies de stockage que nous utilisons et comment les gérer dans votre navigateur.",
      title: "Politique de cookies",
      intro:
        "Les cookies sont de petits fichiers enregistrés sur votre appareil lorsque vous visitez un site. Ce site est conçu pour fonctionner avec le strict minimum : nous n'utilisons aucun cookie publicitaire, de réseaux sociaux ou de suivi entre sites.",
      updated: updatedFr,
      sections: [
        {
          id: "what-we-use",
          title: "1. Ce que nous utilisons",
          paragraphs: ["Nous n'utilisons que des technologies strictement nécessaires ou qui n'identifient pas le visiteur :"],
          list: [
            "**Préférence de thème (clair ou sombre) :** enregistrée dans le stockage local du navigateur (`localStorage`), uniquement sur votre appareil, sans jamais être envoyée à nos serveurs.",
            "**Session de l'espace de gestion :** cookies d'authentification utilisés exclusivement par l'équipe Steevanz dans l'espace réservé. Ils ne sont pas déposés chez les visiteurs du site public.",
            "**Statistiques d'utilisation :** Vercel Web Analytics et Speed Insights collectent des données agrégées et anonymes sur les pages visitées et les performances, sans cookies et sans identifier le visiteur.",
          ],
        },
        {
          id: "consent",
          title: "2. Pourquoi nous n'affichons pas de bandeau cookies",
          paragraphs: [
            "Conformément à la loi portugaise n° 41/2004 et aux lignes directrices de l'autorité portugaise de protection des données (CNPD), le consentement n'est exigé que pour les cookies qui ne sont pas strictement nécessaires. Comme nous n'utilisons aucun cookie publicitaire ou de suivi, nous n'avons pas besoin de vous demander votre consentement. Si cela change, nous mettrons à jour cette politique et vous demanderons votre autorisation avant de déposer ces cookies.",
          ],
        },
        {
          id: "third-parties",
          title: "3. Services tiers",
          paragraphs: [
            "Lorsque vous cliquez sur des liens vers WhatsApp, Instagram ou Google, vous quittez notre site et ce sont les politiques de confidentialité et de cookies de ces services qui s'appliquent.",
          ],
        },
        {
          id: "manage",
          title: "4. Comment les gérer ou les supprimer",
          paragraphs: [
            "Vous pouvez supprimer à tout moment les données enregistrées par le site dans les paramètres de votre navigateur, dans la rubrique confidentialité ou données des sites. En cas de doute, écrivez-nous à [rcabaco@steevanz.com](mailto:rcabaco@steevanz.com).",
          ],
        },
      ],
    },
    de: {
      metaTitle: "Cookie-Richtlinie | Steevanz",
      metaDescription: "Die Steevanz-Website verwendet keine Werbe- oder Tracking-Cookies. Erfahren Sie, welche Speichertechniken wir nutzen und wie Sie sie in Ihrem Browser verwalten.",
      title: "Cookie-Richtlinie",
      intro:
        "Cookies sind kleine Dateien, die beim Besuch einer Website auf Ihrem Gerät gespeichert werden. Diese Website ist so gebaut, dass sie mit so wenig wie möglich auskommt: Wir verwenden keine Werbe-, Social-Media- oder seitenübergreifenden Tracking-Cookies.",
      updated: updatedDe,
      sections: [
        {
          id: "what-we-use",
          title: "1. Was wir verwenden",
          paragraphs: ["Wir verwenden nur Techniken, die unbedingt erforderlich sind oder Besucher nicht identifizieren:"],
          list: [
            "**Design-Einstellung (hell oder dunkel):** im lokalen Speicher Ihres Browsers (`localStorage`) abgelegt, nur auf Ihrem Gerät, ohne jede Übertragung an unsere Server.",
            "**Sitzung des Verwaltungsbereichs:** Authentifizierungs-Cookies, die ausschließlich vom Steevanz-Team im geschützten Bereich verwendet werden. Besuchern der öffentlichen Website werden sie nicht gesetzt.",
            "**Nutzungsstatistiken:** Vercel Web Analytics und Speed Insights erfassen zusammengefasste, anonyme Daten zu besuchten Seiten und zur Leistung, ohne Cookies und ohne Besucher zu identifizieren.",
          ],
        },
        {
          id: "consent",
          title: "2. Warum wir kein Cookie-Banner zeigen",
          paragraphs: [
            "Nach dem portugiesischen Gesetz Nr. 41/2004 und den Leitlinien der portugiesischen Datenschutzbehörde (CNPD) ist eine Einwilligung nur für Cookies erforderlich, die nicht unbedingt notwendig sind. Da wir keine Werbe- oder Tracking-Cookies verwenden, müssen wir Sie nicht um Einwilligung bitten. Sollte sich das ändern, aktualisieren wir diese Richtlinie und bitten Sie um Ihre Zustimmung, bevor wir solche Cookies setzen.",
          ],
        },
        {
          id: "third-parties",
          title: "3. Dienste Dritter",
          paragraphs: [
            "Wenn Sie Links zu WhatsApp, Instagram oder Google folgen, verlassen Sie unsere Website, und es gelten die Datenschutz- und Cookie-Richtlinien dieser Dienste.",
          ],
        },
        {
          id: "manage",
          title: "4. Verwalten oder löschen",
          paragraphs: [
            "Sie können die von der Website gespeicherten Daten jederzeit in den Einstellungen Ihres Browsers im Bereich Datenschutz oder Websitedaten löschen. Bei Fragen schreiben Sie uns an [rcabaco@steevanz.com](mailto:rcabaco@steevanz.com).",
          ],
        },
      ],
    },
    it: {
      metaTitle: "Cookie policy | Steevanz",
      metaDescription: "Il sito Steevanz non usa cookie pubblicitari né di tracciamento. Scoprite quali tecnologie di archiviazione usiamo e come gestirle nel browser.",
      title: "Cookie policy",
      intro:
        "I cookie sono piccoli file salvati sul vostro dispositivo quando visitate un sito. Questo sito è pensato per funzionare con il minimo indispensabile: non usiamo cookie pubblicitari, dei social network né di tracciamento tra siti.",
      updated: updatedIt,
      sections: [
        {
          id: "what-we-use",
          title: "1. Cosa usiamo",
          paragraphs: ["Usiamo solo tecnologie strettamente necessarie o che non identificano il visitatore:"],
          list: [
            "**Preferenza del tema (chiaro o scuro):** salvata nella memoria locale del browser (`localStorage`), solo sul vostro dispositivo, senza alcun invio ai nostri server.",
            "**Sessione dell'area di gestione:** cookie di autenticazione usati esclusivamente dal team Steevanz nell'area riservata. Non vengono impostati per i visitatori del sito pubblico.",
            "**Statistiche di utilizzo:** Vercel Web Analytics e Speed Insights raccolgono dati aggregati e anonimi sulle pagine visitate e sulle prestazioni, senza cookie e senza identificare il visitatore.",
          ],
        },
        {
          id: "consent",
          title: "2. Perché non mostriamo un banner dei cookie",
          paragraphs: [
            "Ai sensi della legge portoghese n. 41/2004 e delle linee guida dell'autorità portoghese per la protezione dei dati (CNPD), il consenso è richiesto solo per i cookie non strettamente necessari. Poiché non usiamo cookie pubblicitari né di tracciamento, non dobbiamo chiedervi il consenso. Se questo dovesse cambiare, aggiorneremo questa informativa e vi chiederemo l'autorizzazione prima di impostare tali cookie.",
          ],
        },
        {
          id: "third-parties",
          title: "3. Servizi di terzi",
          paragraphs: [
            "Cliccando sui link a WhatsApp, Instagram o Google uscite dal nostro sito e si applicano le informative sulla privacy e sui cookie di quei servizi.",
          ],
        },
        {
          id: "manage",
          title: "4. Come gestirli o cancellarli",
          paragraphs: [
            "Potete cancellare in qualsiasi momento i dati salvati dal sito nelle impostazioni del browser, nella sezione privacy o dati dei siti. In caso di dubbi, scriveteci a [rcabaco@steevanz.com](mailto:rcabaco@steevanz.com).",
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
          id: "devolucoes",
          title: "3. Devoluções das placas",
          paragraphs: [
            "Pode devolver placas e autocolantes sem personalização no prazo de 14 dias a contar da entrega, sem indicar motivo, em bom estado e na embalagem original; devolvemos o valor pago pelo mesmo meio de pagamento até 14 dias depois de recebermos a devolução.",
            "As placas feitas à medida do seu negócio (com o seu logótipo ou texto personalizado) não podem ser devolvidas por arrependimento, como prevê a lei (Decreto-Lei n.º 24/2014, artigo 17.º); trocamo-las sem custos se chegarem com defeito ou não funcionarem.",
            "Para devolver ou reportar um defeito, escreva para [rcabaco@steevanz.com](mailto:rcabaco@steevanz.com) com a referência da encomenda.",
          ],
        },
        {
          id: "marcas",
          title: "4. Marcas de terceiros",
          paragraphs: [
            "Google, Google Maps e Perfil da Empresa no Google são marcas da Google LLC. WhatsApp, Instagram e Facebook são marcas da Meta Platforms, Inc. Apple Wallet é marca da Apple Inc. Estas marcas são referidas apenas para descrever a compatibilidade dos nossos produtos. A Steevanz é uma empresa independente e não tem qualquer afiliação, patrocínio ou aprovação destas entidades.",
          ],
        },
        {
          id: "propriedade",
          title: "5. Propriedade intelectual",
          paragraphs: [
            "Os textos, desenhos, marcas e código deste site pertencem à Steevanz ou são usados com licença. As fotografias e vídeos de banco de imagens são utilizados ao abrigo das licenças Pexels e Unsplash. Não é permitida a reprodução para fins comerciais sem autorização escrita.",
          ],
        },
        {
          id: "responsabilidade",
          title: "6. Responsabilidade",
          paragraphs: [
            "Fazemos o possível para manter a informação do site correta e atualizada, mas não garantimos que esteja livre de erros. As ferramentas de inteligência artificial descritas podem cometer erros e funcionam sempre com supervisão humana. Não nos responsabilizamos por conteúdos de sites de terceiros para os quais existam ligações.",
          ],
        },
        {
          id: "litigios",
          title: "7. Resolução alternativa de litígios",
          paragraphs: [
            "Em caso de litígio de consumo, o consumidor pode recorrer a uma entidade de resolução alternativa de litígios, nos termos da Lei n.º 144/2015, como o CNIACC — Centro Nacional de Informação e Arbitragem de Conflitos de Consumo ([www.cniacc.pt](https://www.cniacc.pt)). Mais informação no Portal do Consumidor ([www.consumidor.gov.pt](https://www.consumidor.gov.pt)). Dispomos de [Livro de Reclamações eletrónico](https://www.livroreclamacoes.pt).",
          ],
        },
        {
          id: "lei",
          title: "8. Lei aplicável",
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
          id: "returns",
          title: "3. Returns of plates",
          paragraphs: [
            "You can return plates and stickers without customisation within 14 days of delivery, without giving a reason, in good condition and in the original packaging; we refund the amount paid by the same payment method within 14 days of receiving the return.",
            "Plates made to measure for your business (with your logo or custom text) cannot be returned for change of mind, as the law provides (Decree-Law 24/2014, article 17); we replace them free of charge if they arrive faulty or don't work.",
            "To return or report a fault, write to [rcabaco@steevanz.com](mailto:rcabaco@steevanz.com) with the order reference.",
          ],
        },
        {
          id: "trademarks",
          title: "4. Third-party trademarks",
          paragraphs: [
            "Google, Google Maps and Google Business Profile are trademarks of Google LLC. WhatsApp, Instagram and Facebook are trademarks of Meta Platforms, Inc. Apple Wallet is a trademark of Apple Inc. These trademarks are mentioned only to describe the compatibility of our products. Steevanz is an independent company with no affiliation with, sponsorship by or endorsement from these companies.",
          ],
        },
        {
          id: "ip",
          title: "5. Intellectual property",
          paragraphs: [
            "The text, designs, marks and code of this website belong to Steevanz or are used under licence. Stock photos and videos are used under the Pexels and Unsplash licences. Commercial reproduction without written permission is not allowed.",
          ],
        },
        {
          id: "liability",
          title: "6. Liability",
          paragraphs: [
            "We do our best to keep the information on this website accurate and up to date, but we cannot guarantee it is error-free. The artificial intelligence tools described can make mistakes and always operate with human oversight. We are not responsible for the content of third-party websites we link to.",
          ],
        },
        {
          id: "disputes",
          title: "7. Alternative dispute resolution",
          paragraphs: [
            "In the event of a consumer dispute, consumers may use an alternative dispute resolution body under Portuguese Law 144/2015, such as CNIACC ([www.cniacc.pt](https://www.cniacc.pt)). More information is available on the Consumer Portal ([www.consumidor.gov.pt](https://www.consumidor.gov.pt)). We also provide an [electronic complaints book](https://www.livroreclamacoes.pt).",
          ],
        },
        {
          id: "law",
          title: "8. Governing law",
          paragraphs: [
            "These terms are governed by Portuguese law. The courts of Lisbon have jurisdiction over any dispute, without prejudice to mandatory consumer protection rules.",
          ],
        },
      ],
    },
    es: {
      metaTitle: "Términos y condiciones | Steevanz",
      metaDescription: "Términos y condiciones de uso del sitio web de Steevanz: precios orientativos, propuestas, propiedad intelectual, marcas de terceros y resolución de litigios.",
      title: "Términos y condiciones",
      intro:
        "Estos términos regulan el uso del sitio web steevanz.com. Al navegar por el sitio, acepta estas condiciones. La prestación de servicios se rige siempre por una propuesta y un contrato propios.",
      updated: updatedEs,
      sections: [
        {
          id: "purpose",
          title: "1. Objeto del sitio web",
          paragraphs: [
            "Este sitio web presenta los productos y servicios de Steevanz y permite solicitar demostraciones e información. No es posible comprar productos ni contratar servicios directamente en el sitio web.",
          ],
        },
        {
          id: "prices",
          title: "2. Precios y propuestas",
          paragraphs: [
            "Los precios indicados con la mención \"desde\" son importes de referencia, sin IVA, y pueden cambiar sin previo aviso. El precio final, las condiciones de pago, los plazos y el nivel de servicio constan en la propuesta enviada a cada cliente, que solo es vinculante una vez aceptada por ambas partes.",
          ],
        },
        {
          id: "returns",
          title: "3. Devoluciones de las placas",
          paragraphs: [
            "Puede devolver placas y pegatinas sin personalizar en un plazo de 14 días desde la entrega, sin indicar el motivo, en buen estado y en su embalaje original; le reembolsamos el importe pagado por el mismo medio de pago en un plazo de 14 días desde que recibamos la devolución.",
            "Las placas hechas a medida para su negocio (con su logotipo o un texto personalizado) no pueden devolverse por desistimiento, según prevé la ley (Decreto-ley portugués n.º 24/2014, artículo 17); las cambiamos sin coste si llegan defectuosas o no funcionan.",
            "Para devolver o comunicar un defecto, escriba a [rcabaco@steevanz.com](mailto:rcabaco@steevanz.com) indicando la referencia del pedido.",
          ],
        },
        {
          id: "trademarks",
          title: "4. Marcas de terceros",
          paragraphs: [
            "Google, Google Maps y Perfil de Empresa de Google son marcas de Google LLC. WhatsApp, Instagram y Facebook son marcas de Meta Platforms, Inc. Apple Wallet es una marca de Apple Inc. Estas marcas se mencionan únicamente para describir la compatibilidad de nuestros productos. Steevanz es una empresa independiente y no tiene ninguna afiliación, patrocinio ni aprobación de estas entidades.",
          ],
        },
        {
          id: "ip",
          title: "5. Propiedad intelectual",
          paragraphs: [
            "Los textos, diseños, marcas y código de este sitio web pertenecen a Steevanz o se usan con licencia. Las fotografías y vídeos de bancos de imágenes se utilizan al amparo de las licencias de Pexels y Unsplash. No se permite su reproducción con fines comerciales sin autorización por escrito.",
          ],
        },
        {
          id: "liability",
          title: "6. Responsabilidad",
          paragraphs: [
            "Hacemos lo posible por mantener la información del sitio web correcta y actualizada, pero no garantizamos que esté libre de errores. Las herramientas de inteligencia artificial descritas pueden cometer errores y funcionan siempre con supervisión humana. No nos responsabilizamos de los contenidos de sitios web de terceros a los que enlazamos.",
          ],
        },
        {
          id: "disputes",
          title: "7. Resolución alternativa de litigios",
          paragraphs: [
            "En caso de litigio de consumo, el consumidor puede recurrir a una entidad de resolución alternativa de litigios, conforme a la Ley portuguesa n.º 144/2015, como el CNIACC, Centro Nacional de Información y Arbitraje de Conflictos de Consumo ([www.cniacc.pt](https://www.cniacc.pt)). Más información en el Portal do Consumidor ([www.consumidor.gov.pt](https://www.consumidor.gov.pt)). Disponemos de [Libro de Reclamaciones electrónico](https://www.livroreclamacoes.pt).",
          ],
        },
        {
          id: "law",
          title: "8. Ley aplicable",
          paragraphs: [
            "Estos términos se rigen por la ley portuguesa. Para cualquier litigio son competentes los tribunales de la comarca de Lisboa, sin perjuicio de las normas imperativas aplicables a los consumidores.",
          ],
        },
      ],
    },
    fr: {
      metaTitle: "Conditions générales | Steevanz",
      metaDescription: "Conditions générales d'utilisation du site Steevanz : prix indicatifs, propositions, propriété intellectuelle, marques de tiers et règlement des litiges.",
      title: "Conditions générales",
      intro:
        "Ces conditions régissent l'utilisation du site steevanz.com. En naviguant sur le site, vous acceptez ces conditions. La prestation de services est toujours régie par une proposition et un contrat propres.",
      updated: updatedFr,
      sections: [
        {
          id: "purpose",
          title: "1. Objet du site",
          paragraphs: [
            "Ce site présente les produits et services de Steevanz et permet de demander des démonstrations et des informations. Il n'est pas possible d'acheter des produits ni de souscrire des services directement sur le site.",
          ],
        },
        {
          id: "prices",
          title: "2. Prix et propositions",
          paragraphs: [
            "Les prix affichés avec la mention « à partir de » sont des montants de référence, hors TVA, et peuvent changer sans préavis. Le prix final, les conditions de paiement, les délais et le niveau de service figurent dans la proposition envoyée à chaque client, qui ne devient contraignante qu'après acceptation par les deux parties.",
          ],
        },
        {
          id: "returns",
          title: "3. Retours des plaques",
          paragraphs: [
            "Vous pouvez retourner les plaques et autocollants non personnalisés dans un délai de 14 jours à compter de la livraison, sans avoir à vous justifier, en bon état et dans leur emballage d'origine ; nous remboursons le montant payé par le même moyen de paiement dans les 14 jours suivant la réception du retour.",
            "Les plaques fabriquées sur mesure pour votre entreprise (avec votre logo ou un texte personnalisé) ne peuvent pas faire l'objet d'une rétractation, comme le prévoit la loi (décret-loi portugais n° 24/2014, article 17) ; nous les échangeons sans frais si elles arrivent défectueuses ou ne fonctionnent pas.",
            "Pour retourner un produit ou signaler un défaut, écrivez à [rcabaco@steevanz.com](mailto:rcabaco@steevanz.com) en indiquant la référence de la commande.",
          ],
        },
        {
          id: "trademarks",
          title: "4. Marques de tiers",
          paragraphs: [
            "Google, Google Maps et Fiche d'établissement Google sont des marques de Google LLC. WhatsApp, Instagram et Facebook sont des marques de Meta Platforms, Inc. Apple Wallet est une marque d'Apple Inc. Ces marques sont citées uniquement pour décrire la compatibilité de nos produits. Steevanz est une entreprise indépendante, sans aucune affiliation, parrainage ou approbation de la part de ces entités.",
          ],
        },
        {
          id: "ip",
          title: "5. Propriété intellectuelle",
          paragraphs: [
            "Les textes, graphismes, marques et le code de ce site appartiennent à Steevanz ou sont utilisés sous licence. Les photos et vidéos de banques d'images sont utilisées dans le cadre des licences Pexels et Unsplash. Toute reproduction à des fins commerciales sans autorisation écrite est interdite.",
          ],
        },
        {
          id: "liability",
          title: "6. Responsabilité",
          paragraphs: [
            "Nous faisons de notre mieux pour que les informations du site soient exactes et à jour, mais nous ne garantissons pas l'absence d'erreurs. Les outils d'intelligence artificielle décrits peuvent se tromper et fonctionnent toujours sous supervision humaine. Nous ne sommes pas responsables du contenu des sites tiers vers lesquels nous renvoyons.",
          ],
        },
        {
          id: "disputes",
          title: "7. Règlement extrajudiciaire des litiges",
          paragraphs: [
            "En cas de litige de consommation, le consommateur peut recourir à un organisme de règlement extrajudiciaire des litiges, conformément à la loi portugaise n° 144/2015, comme le CNIACC, Centre national d'information et d'arbitrage des litiges de consommation ([www.cniacc.pt](https://www.cniacc.pt)). Plus d'informations sur le Portail du consommateur ([www.consumidor.gov.pt](https://www.consumidor.gov.pt)). Nous disposons d'un [livre de réclamations électronique](https://www.livroreclamacoes.pt).",
          ],
        },
        {
          id: "law",
          title: "8. Droit applicable",
          paragraphs: [
            "Ces conditions sont régies par le droit portugais. Tout litige relève de la compétence des tribunaux de Lisbonne, sans préjudice des règles impératives applicables aux consommateurs.",
          ],
        },
      ],
    },
    de: {
      metaTitle: "Allgemeine Geschäftsbedingungen | Steevanz",
      metaDescription: "Nutzungsbedingungen der Steevanz-Website: Richtpreise, Angebote, geistiges Eigentum, Marken Dritter und Streitbeilegung.",
      // Soft hyphen (\u00AD): «Geschäftsbedingungen» alone is wider than a 360 px screen.
      title: "Allgemeine Geschäfts\u00ADbedingungen",
      intro:
        "Diese Bedingungen regeln die Nutzung der Website steevanz.com. Mit dem Besuch der Website akzeptieren Sie diese Bedingungen. Die Erbringung von Leistungen richtet sich stets nach einem eigenen Angebot und Vertrag.",
      updated: updatedDe,
      sections: [
        {
          id: "purpose",
          title: "1. Zweck der Website",
          paragraphs: [
            "Diese Website stellt die Produkte und Leistungen von Steevanz vor und ermöglicht es, Demos und Informationen anzufragen. Produkte können auf der Website nicht direkt gekauft und Leistungen nicht direkt beauftragt werden.",
          ],
        },
        {
          id: "prices",
          title: "2. Preise und Angebote",
          paragraphs: [
            "Mit „ab“ angegebene Preise sind Richtwerte ohne MwSt. und können sich ohne Vorankündigung ändern. Endpreis, Zahlungsbedingungen, Fristen und Leistungsumfang stehen im Angebot, das jeder Kunde erhält; es ist erst nach Annahme durch beide Parteien verbindlich.",
          ],
        },
        {
          id: "returns",
          title: "3. Rückgabe der Schilder",
          paragraphs: [
            "Nicht personalisierte Schilder und Aufkleber können Sie innerhalb von 14 Tagen ab Lieferung ohne Angabe von Gründen in gutem Zustand und in der Originalverpackung zurückgeben; wir erstatten den gezahlten Betrag über dasselbe Zahlungsmittel innerhalb von 14 Tagen nach Eingang der Rücksendung.",
            "Für Ihr Geschäft angefertigte Schilder (mit Ihrem Logo oder individuellem Text) sind, wie gesetzlich vorgesehen (portugiesisches Gesetzesdekret Nr. 24/2014, Artikel 17), vom Widerruf ausgeschlossen; wir tauschen sie kostenlos aus, wenn sie beschädigt ankommen oder nicht funktionieren.",
            "Für eine Rückgabe oder die Meldung eines Mangels schreiben Sie an [rcabaco@steevanz.com](mailto:rcabaco@steevanz.com) und nennen Sie die Bestellnummer.",
          ],
        },
        {
          id: "trademarks",
          title: "4. Marken Dritter",
          paragraphs: [
            "Google, Google Maps und Google-Unternehmensprofil sind Marken der Google LLC. WhatsApp, Instagram und Facebook sind Marken der Meta Platforms, Inc. Apple Wallet ist eine Marke der Apple Inc. Diese Marken werden nur genannt, um die Kompatibilität unserer Produkte zu beschreiben. Steevanz ist ein unabhängiges Unternehmen und steht in keiner Verbindung zu diesen Unternehmen, wird von ihnen weder gesponsert noch empfohlen.",
          ],
        },
        {
          id: "ip",
          title: "5. Geistiges Eigentum",
          paragraphs: [
            "Texte, Gestaltung, Marken und Code dieser Website gehören Steevanz oder werden mit Lizenz verwendet. Fotos und Videos aus Bilddatenbanken werden unter den Lizenzen von Pexels und Unsplash verwendet. Eine Vervielfältigung zu gewerblichen Zwecken ohne schriftliche Genehmigung ist nicht gestattet.",
          ],
        },
        {
          id: "liability",
          title: "6. Haftung",
          paragraphs: [
            "Wir bemühen uns, die Informationen auf der Website richtig und aktuell zu halten, können aber nicht garantieren, dass sie fehlerfrei sind. Die beschriebenen KI-Werkzeuge können Fehler machen und arbeiten immer unter menschlicher Aufsicht. Für Inhalte verlinkter Websites Dritter übernehmen wir keine Verantwortung.",
          ],
        },
        {
          id: "disputes",
          title: "7. Alternative Streitbeilegung",
          paragraphs: [
            "Bei Verbraucherstreitigkeiten können Verbraucher nach dem portugiesischen Gesetz Nr. 144/2015 eine Stelle zur alternativen Streitbeilegung anrufen, etwa das CNIACC, das nationale Informations- und Schlichtungszentrum für Verbraucherstreitigkeiten ([www.cniacc.pt](https://www.cniacc.pt)). Weitere Informationen bietet das Verbraucherportal ([www.consumidor.gov.pt](https://www.consumidor.gov.pt)). Wir verfügen über ein [elektronisches Beschwerdebuch](https://www.livroreclamacoes.pt).",
          ],
        },
        {
          id: "law",
          title: "8. Anwendbares Recht",
          paragraphs: [
            "Diese Bedingungen unterliegen portugiesischem Recht. Für alle Streitigkeiten sind die Gerichte in Lissabon zuständig, unbeschadet zwingender Verbraucherschutzvorschriften.",
          ],
        },
      ],
    },
    it: {
      metaTitle: "Termini e condizioni | Steevanz",
      metaDescription: "Termini e condizioni d'uso del sito Steevanz: prezzi indicativi, proposte, proprietà intellettuale, marchi di terzi e risoluzione delle controversie.",
      title: "Termini e condizioni",
      intro:
        "Questi termini regolano l'uso del sito steevanz.com. Navigando sul sito accettate queste condizioni. La prestazione dei servizi è sempre regolata da una proposta e da un contratto specifici.",
      updated: updatedIt,
      sections: [
        {
          id: "purpose",
          title: "1. Scopo del sito",
          paragraphs: [
            "Questo sito presenta i prodotti e i servizi di Steevanz e permette di richiedere demo e informazioni. Non è possibile acquistare prodotti né sottoscrivere servizi direttamente sul sito.",
          ],
        },
        {
          id: "prices",
          title: "2. Prezzi e proposte",
          paragraphs: [
            "I prezzi indicati con la dicitura \"da\" sono importi di riferimento, IVA esclusa, e possono cambiare senza preavviso. Il prezzo finale, le condizioni di pagamento, i tempi e il livello di servizio sono indicati nella proposta inviata a ciascun cliente, che diventa vincolante solo dopo l'accettazione di entrambe le parti.",
          ],
        },
        {
          id: "returns",
          title: "3. Resi delle targhe",
          paragraphs: [
            "Potete restituire targhe e adesivi non personalizzati entro 14 giorni dalla consegna, senza indicarne il motivo, in buono stato e nella confezione originale; rimborsiamo l'importo pagato con lo stesso mezzo di pagamento entro 14 giorni dal ricevimento del reso.",
            "Le targhe realizzate su misura per la vostra attività (con il vostro logo o un testo personalizzato) non possono essere restituite per ripensamento, come previsto dalla legge (decreto-legge portoghese n. 24/2014, articolo 17); le sostituiamo gratuitamente se arrivano difettose o non funzionano.",
            "Per un reso o per segnalare un difetto, scrivete a [rcabaco@steevanz.com](mailto:rcabaco@steevanz.com) indicando il riferimento dell'ordine.",
          ],
        },
        {
          id: "trademarks",
          title: "4. Marchi di terzi",
          paragraphs: [
            "Google, Google Maps e Profilo dell'attività su Google sono marchi di Google LLC. WhatsApp, Instagram e Facebook sono marchi di Meta Platforms, Inc. Apple Wallet è un marchio di Apple Inc. Questi marchi sono citati solo per descrivere la compatibilità dei nostri prodotti. Steevanz è un'azienda indipendente e non ha alcuna affiliazione, sponsorizzazione o approvazione da parte di queste società.",
          ],
        },
        {
          id: "ip",
          title: "5. Proprietà intellettuale",
          paragraphs: [
            "I testi, la grafica, i marchi e il codice di questo sito appartengono a Steevanz o sono usati su licenza. Le foto e i video di archivio sono utilizzati in base alle licenze Pexels e Unsplash. Non è consentita la riproduzione a fini commerciali senza autorizzazione scritta.",
          ],
        },
        {
          id: "liability",
          title: "6. Responsabilità",
          paragraphs: [
            "Facciamo il possibile per mantenere le informazioni del sito corrette e aggiornate, ma non garantiamo che siano prive di errori. Gli strumenti di intelligenza artificiale descritti possono commettere errori e funzionano sempre sotto supervisione umana. Non siamo responsabili dei contenuti dei siti di terzi a cui rimandiamo.",
          ],
        },
        {
          id: "disputes",
          title: "7. Risoluzione alternativa delle controversie",
          paragraphs: [
            "In caso di controversia di consumo, il consumatore può rivolgersi a un organismo di risoluzione alternativa delle controversie, ai sensi della legge portoghese n. 144/2015, come il CNIACC, Centro nazionale di informazione e arbitrato dei conflitti di consumo ([www.cniacc.pt](https://www.cniacc.pt)). Maggiori informazioni sul Portale del consumatore ([www.consumidor.gov.pt](https://www.consumidor.gov.pt)). Mettiamo a disposizione il [libro dei reclami elettronico](https://www.livroreclamacoes.pt).",
          ],
        },
        {
          id: "law",
          title: "8. Legge applicabile",
          paragraphs: [
            "Questi termini sono regolati dalla legge portoghese. Per qualsiasi controversia è competente il foro di Lisbona, fatte salve le norme imperative applicabili ai consumatori.",
          ],
        },
      ],
    },
  },
};
