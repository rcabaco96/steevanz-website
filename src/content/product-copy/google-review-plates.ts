import type { ProductCopyByLocale } from "../types";

// The review plates (owner, 2026-10-20): not only Google, also Tripadvisor and Booking.com. One plate opens
// one destination, chosen per plate. Truth to keep in every language: Google and Tripadvisor take a review from
// anyone who opens the link; Booking.com only from guests who booked through Booking, through the email Booking
// sends after check-out, so a Booking plate opens the property's Booking page and reminds the guest of that
// email. Platform names in plain text, never their logos. The id and the URLs stay «google-review-plates».
export const copy: ProductCopyByLocale = {
  pt: {
    name: "Placas para avaliações",
    shortName: "Placas para avaliações",
    tagline: "Um toque no telemóvel e o cliente está a escrever a sua avaliação.",
    summary:
      "Placas, autocolantes e expositores de mesa que, com um toque ou pelo QR code, levam o cliente à avaliação do seu negócio no Google, no Tripadvisor ou na Booking.com. Cada placa abre o destino que escolher. Nós configuramos tudo.",
    metaTitle: "Placas para Avaliações no Google, Tripadvisor e Booking | Steevanz",
    metaDescription:
      "Placas para avaliações no Google, no Tripadvisor e na Booking.com: um toque no telemóvel abre a página do seu negócio. Sem app, com QR code e configuração feita por nós.",
    heroTitle: "Mais avaliações, com um só toque",
    heroSubtitle:
      "O cliente aproxima o telemóvel da placa e abre de imediato a avaliação do seu negócio no Google ou no Tripadvisor, ou a página do seu alojamento na Booking.com. Sem procurar o nome, sem instalar nada. Cada placa abre um destino, à sua escolha, e nós configuramos o link por si.",
    problem: {
      title: "Os clientes gostam do seu serviço, mas não o dizem online",
      body:
        "A maioria dos clientes satisfeitos sai sem deixar uma avaliação. Não por má vontade, mas porque dá trabalho: abrir a aplicação, procurar o negócio, encontrar o botão certo. Entretanto, quem pesquisa no Google, no Tripadvisor ou na Booking.com compara estrelas e número de avaliações antes de escolher.",
      points: [
        "Pedir uma avaliação de viva voz raramente resulta numa avaliação escrita",
        "Um perfil com poucas avaliações recentes parece menos ativo do que realmente é",
        "Os clientes insatisfeitos tendem a escrever mais do que os satisfeitos",
      ],
    },
    solution: {
      title: "Transforme a boa experiência em avaliação no momento certo",
      body:
        "As nossas placas levam o cliente à plataforma que mais conta para o seu negócio, enquanto a experiência ainda está fresca. Um toque ou uma leitura do QR code e está feito.",
      points: [
        "Google, Tripadvisor ou Booking.com: escolhe o destino de cada placa",
        "Funciona com a maioria dos telemóveis atuais, sem app, e tem QR code impresso",
        "Link configurado e testado pela nossa equipa antes da entrega",
        "Pede a opinião a todos por igual, de acordo com as regras de cada plataforma",
      ],
    },
    steps: [
      {
        title: "Escolha o formato e o destino",
        body: "Placa de balcão, expositor de mesa, autocolante ou placa de parede. Para cada placa escolhe um destino: Google, Tripadvisor ou Booking.com. Ajudamos a decidir onde fica mais visível.",
      },
      {
        title: "Nós configuramos",
        body: "Associamos cada placa ao link certo: o formulário de avaliação do Google, a página de avaliação do Tripadvisor ou a página do seu alojamento na Booking.com. Testamos em iPhone e Android.",
      },
      {
        title: "Coloque e convide",
        body: "Coloque a placa no sítio certo e, no fim do atendimento, convide o cliente a deixar a sua opinião. Na Booking.com só avalia quem reservou pela Booking, no email que a Booking envia depois do check-out: a placa lembra o hóspede disso.",
      },
      {
        title: "Acompanhe os resultados",
        body: "Veja as novas avaliações a chegar e responda-lhes para mostrar que está atento.",
      },
    ],
    features: [
      {
        title: "Toque e avaliação",
        body: "O chip leva o cliente diretamente à avaliação do seu negócio no Google ou no Tripadvisor, sem passos intermédios nem pesquisas.",
      },
      {
        title: "Uma placa, um destino",
        body: "Cada placa abre um só destino, escolhido por si: Google, Tripadvisor ou Booking.com. Num restaurante, por exemplo, placas do Google nas mesas e uma do Tripadvisor à saída.",
      },
      {
        title: "QR code de reserva",
        body: "Cada placa tem um QR code impresso. Quem tiver um telemóvel sem leitura por aproximação, ou com essa opção desligada, aponta a câmara e chega ao mesmo sítio.",
      },
      {
        title: "Quatro formatos",
        body: "Placa de balcão em acrílico, expositor de mesa, autocolante discreto para balcão ou montra e placa de parede para zonas de espera.",
      },
      {
        title: "Link reconfigurável",
        body: "Se mudar de perfil, de morada ou quiser apontar a placa para outro destino, atualizamos o link sem ter de trocar a placa.",
      },
      {
        title: "Dentro das regras",
        body: "Não oferecemos incentivos por avaliações nem filtramos clientes. A placa convida todos a dar a sua opinião honesta, como exigem o Google, o Tripadvisor e a Booking.com.",
      },
    ],
    useCases: [
      {
        sector: "restaurants",
        title: "Restaurantes e cafés",
        body: "Um expositor em cada mesa ou junto à caixa, para o Google ou para o Tripadvisor. O cliente deixa a avaliação enquanto espera pela conta, com a refeição ainda na memória.",
      },
      {
        sector: "beauty",
        title: "Cabeleireiros e estética",
        body: "Uma placa no balcão da receção, à vista no momento de pagar. É a altura ideal para pedir a opinião no Google a quem acabou de sair satisfeito.",
      },
      {
        sector: "clinics",
        title: "Clínicas e consultórios",
        body: "Uma placa discreta na receção ou na sala de espera. Os pacientes deixam a opinião no Google quando lhes for conveniente, sem pressão.",
      },
      {
        sector: "retail",
        title: "Lojas",
        body: "Um autocolante no balcão ou junto ao terminal de pagamento. Ideal para lojas de bairro que querem destacar-se nas pesquisas locais do Google.",
      },
      {
        sector: "lodging",
        title: "Hotéis e alojamento local",
        body: "Na receção, no quarto ou na sala dos pequenos-almoços, uma placa pede a avaliação no fim da estadia: no Google, no Tripadvisor ou na Booking.com. A placa da Booking abre a página do alojamento e lembra o hóspede de usar o email de avaliação que a Booking lhe envia; só quem reservou pela Booking pode avaliar lá.",
      },
    ],
    includes: [
      "Placa com QR code impresso, no formato escolhido",
      "Configuração do destino de cada placa: Google, Tripadvisor ou Booking.com",
      "Testes em iPhone e Android antes da entrega",
      "Conselhos sobre onde colocar a placa e como convidar os clientes",
      "Reconfiguração do link sempre que precisar",
      "Suporte por WhatsApp e email",
    ],
    faq: [
      {
        q: "Que telemóveis conseguem ler a placa?",
        a: "Os iPhone XS e mais recentes leem a placa sem qualquer app, basta aproximar o topo do telemóvel. Nos iPhone 7 a X, o leitor de etiquetas está no Centro de Controlo. A maioria dos Android lê a placa desde que a opção de leitura por aproximação esteja ligada nas definições de ligações. Para todos os outros casos, há um QR code impresso na placa.",
      },
      {
        q: "O cliente precisa de instalar alguma app?",
        a: "Não. O toque abre a página no navegador do telemóvel, ou na app da plataforma (Google, Tripadvisor ou Booking.com) se já estiver instalada. Para escrever a avaliação, o cliente precisa de ter sessão iniciada numa conta dessa plataforma.",
      },
      {
        q: "Uma placa serve para o Google, o Tripadvisor e a Booking ao mesmo tempo?",
        a: "Não. Cada placa abre um único destino, que escolhe na encomenda: o Google, o Tripadvisor ou a Booking.com. Se quer pedir avaliações em mais do que uma plataforma, usa placas diferentes, por exemplo o Google nas mesas e o Tripadvisor junto à saída. Se mais tarde quiser mudar o destino de uma placa, atualizamos o link sem a trocar.",
      },
      {
        q: "Qualquer cliente me pode avaliar na Booking.com através da placa?",
        a: "Não. A Booking.com só aceita avaliações de hóspedes que reservaram pela Booking e ficaram alojados: depois do check-out, a Booking envia a cada um, por email, um convite para avaliar. A placa da Booking abre a página do seu alojamento na Booking.com e lembra o hóspede de usar esse email. No Google e no Tripadvisor é diferente: qualquer cliente que abra o link pode deixar a sua avaliação.",
      },
      {
        q: "Isto cumpre as regras das plataformas?",
        a: "Sim, desde que seja usado de forma honesta. O Google, o Tripadvisor e a Booking.com proíbem oferecer descontos ou brindes em troca de avaliações, e o Google e o Tripadvisor proíbem também pedir avaliações só aos clientes satisfeitos. As nossas placas pedem a opinião a todos por igual. A Steevanz não tem qualquer ligação ao Google, ao Tripadvisor nem à Booking.com: apenas facilitamos o acesso às páginas do seu negócio.",
      },
      {
        q: "Quanto tempo demora a ficar pronto?",
        a: "Depois de nos enviar o link ou o nome da página do seu negócio no Google, no Tripadvisor ou na Booking.com, configuramos e testamos as placas em poucos dias úteis. O prazo exato depende da quantidade e do formato, e indicamo-lo na demonstração.",
      },
      {
        q: "Garantem que vou ter mais estrelas?",
        a: "Não, e ninguém honesto o deve garantir. A placa facilita que mais clientes deixem a sua opinião, o que normalmente dá uma imagem mais fiel do seu serviço. A classificação depende sempre da experiência que os clientes têm.",
      },
      {
        q: "E se eu não tiver perfil no Google ou página no Tripadvisor?",
        a: "Ajudamos a identificar a página certa ou a perceber os passos para a criar e verificar. A placa só é configurada quando a página estiver ativa e pronta a receber avaliações.",
      },
      {
        q: "Tenho alojamento local. As placas servem para mim?",
        a: "Sim. Para cada placa pode escolher o Google, o Tripadvisor (se o alojamento tiver página lá) ou a Booking.com. O Google só aceita perfis de alojamentos onde recebe os hóspedes pessoalmente, como hostels, guest houses ou quartos com o anfitrião presente; apartamentos e moradias com entrada autónoma não podem ter perfil, por regra do próprio Google. Na Booking.com só avalia quem reservou pela Booking, no email que recebe depois do check-out, e a placa lembra o hóspede disso. O Airbnb não tem um link de avaliação que uma placa possa abrir: aí, o guia digital do alojamento explica ao hóspede onde avaliar, da mesma forma para todos e sem ofertas em troca.",
      },
    ],
  },
  en: {
    name: "Review plates",
    shortName: "Review plates",
    tagline: "One tap of a phone and your customer is writing a review.",
    summary:
      "Plates, stickers and table stands that take customers to your business's reviews on Google, Tripadvisor or Booking.com, with a tap or a QR code. Each plate opens the destination you choose. We set everything up for you.",
    metaTitle: "Review Plates for Google, Tripadvisor and Booking | Steevanz",
    metaDescription:
      "Review plates for Google, Tripadvisor and Booking.com: one tap of a phone opens your business's page. No app needed, QR code included and everything set up by our team.",
    heroTitle: "More reviews, with a single tap",
    heroSubtitle:
      "Your customer taps their phone on the plate and your business's review page on Google or Tripadvisor opens straight away, or your property's page on Booking.com. No searching for your name, nothing to install. Each plate opens one destination of your choice, and we configure the link for you.",
    problem: {
      title: "Customers love what you do, but they don't say so online",
      body:
        "Most happy customers leave without writing a review. Not because they don't want to, but because it takes effort: open the app, search for the business, find the right button. Meanwhile, people searching on Google, Tripadvisor or Booking.com compare stars and review counts before they choose.",
      points: [
        "Asking for a review in person rarely turns into a written one",
        "A profile with few recent reviews looks less active than it really is",
        "Unhappy customers tend to write more than happy ones",
      ],
    },
    solution: {
      title: "Turn a good experience into a review at the right moment",
      body:
        "Our plates take customers to the platform that matters most for your business while the experience is still fresh. One tap or one QR scan and they're there.",
      points: [
        "Google, Tripadvisor or Booking.com: you choose each plate's destination",
        "Works with most modern phones, no app required, with a printed QR code",
        "Link configured and tested by our team before delivery",
        "Asks every customer equally, in line with each platform's rules",
      ],
    },
    steps: [
      {
        title: "Choose the format and destination",
        body: "Counter plate, table stand, sticker or wall plate. For each plate you choose one destination: Google, Tripadvisor or Booking.com. We'll help you decide where it will be most visible.",
      },
      {
        title: "We configure it",
        body: "We link each plate to the right place: the Google review form, the Tripadvisor review page or your property's page on Booking.com. We test it on iPhone and Android.",
      },
      {
        title: "Place it and invite",
        body: "Put the plate in the right spot and, at the end of each visit, invite customers to share their opinion. On Booking.com only guests who booked through Booking can review, from the email Booking sends after check-out: the plate reminds them of it.",
      },
      {
        title: "Watch the results",
        body: "See new reviews arrive and reply to them to show you're paying attention.",
      },
    ],
    features: [
      {
        title: "Tap to review",
        body: "The chip takes customers straight to your business's reviews on Google or Tripadvisor, with no extra steps and no searching.",
      },
      {
        title: "One plate, one destination",
        body: "Each plate opens a single destination of your choice: Google, Tripadvisor or Booking.com. In a restaurant, for example, Google plates on the tables and a Tripadvisor one by the exit.",
      },
      {
        title: "QR code fallback",
        body: "Every plate has a printed QR code. Anyone whose phone can't read a tap, or has that option switched off, just points the camera and lands in the same place.",
      },
      {
        title: "Four formats",
        body: "Acrylic counter plate, table stand, discreet sticker for counters or windows, and a wall plate for waiting areas.",
      },
      {
        title: "Reconfigurable link",
        body: "If you change profile, move premises or want the plate to point elsewhere, we update the link without replacing the plate.",
      },
      {
        title: "By the rules",
        body: "We never offer incentives for reviews or filter customers. The plate invites everyone to give an honest opinion, as Google, Tripadvisor and Booking.com require.",
      },
    ],
    useCases: [
      {
        sector: "restaurants",
        title: "Restaurants and cafés",
        body: "A stand on every table or by the till, for Google or Tripadvisor. Customers leave a review while waiting for the bill, with the meal still on their mind.",
      },
      {
        sector: "beauty",
        title: "Hair and beauty salons",
        body: "A plate on the reception counter, in view at the moment of payment. The ideal time to ask for a Google review from someone who's just leaving happy.",
      },
      {
        sector: "clinics",
        title: "Clinics and practices",
        body: "A discreet plate at reception or in the waiting room. Patients share their opinion on Google whenever it suits them, with no pressure.",
      },
      {
        sector: "retail",
        title: "Shops",
        body: "A sticker on the counter or next to the card terminal. Ideal for neighbourhood shops that want to stand out in local Google searches.",
      },
      {
        sector: "lodging",
        title: "Hotels and holiday rentals",
        body: "At reception, in the room or in the breakfast room, a plate asks for a review at the end of the stay: on Google, Tripadvisor or Booking.com. The Booking plate opens the property's page and reminds guests to use the review email Booking sends them; only guests who booked through Booking can review there.",
      },
    ],
    includes: [
      "Plate with printed QR code, in the format you choose",
      "Configuration of each plate's destination: Google, Tripadvisor or Booking.com",
      "Testing on iPhone and Android before delivery",
      "Advice on where to place the plate and how to invite customers",
      "Link reconfiguration whenever you need it",
      "Support by WhatsApp and email",
    ],
    faq: [
      {
        q: "Which phones can read the plate?",
        a: "iPhone XS and newer read the plate without any app: just hold the top of the phone near it. On iPhone 7 to X, the tag reader is in Control Centre. Most Android phones read the plate as long as contactless (tap) reading is switched on in the connection settings. For everyone else, there's a QR code printed on the plate.",
      },
      {
        q: "Do customers need to install an app?",
        a: "No. The tap opens the page in the phone's browser, or in the platform's app (Google, Tripadvisor or Booking.com) if it's already installed. To write the review, the customer needs to be signed in to an account on that platform.",
      },
      {
        q: "Can one plate work for Google, Tripadvisor and Booking at the same time?",
        a: "No. Each plate opens a single destination, which you choose when you order: Google, Tripadvisor or Booking.com. If you want reviews on more than one platform, you use different plates, for example Google on the tables and Tripadvisor by the exit. If you later want a plate to point elsewhere, we update the link without replacing it.",
      },
      {
        q: "Can any customer review me on Booking.com through the plate?",
        a: "No. Booking.com only accepts reviews from guests who booked through Booking and stayed: after check-out, Booking emails each of them an invitation to review. The Booking plate opens your property's page on Booking.com and reminds guests to use that email. Google and Tripadvisor are different: any customer who opens the link can leave a review.",
      },
      {
        q: "Is this allowed under the platforms' rules?",
        a: "Yes, as long as it's used honestly. Google, Tripadvisor and Booking.com forbid offering discounts or gifts in exchange for reviews, and Google and Tripadvisor also forbid asking only happy customers. Our plates ask everyone equally. Steevanz is not affiliated with Google, Tripadvisor or Booking.com: we simply make your business's pages easier to reach.",
      },
      {
        q: "How long does it take to be ready?",
        a: "Once you send us the link or name of your business's page on Google, Tripadvisor or Booking.com, we configure and test the plates within a few working days. The exact timing depends on quantity and format, and we confirm it during the demo.",
      },
      {
        q: "Can you guarantee more stars?",
        a: "No, and nobody honest should. The plate makes it easier for more customers to share their opinion, which usually gives a truer picture of your service. Your rating always depends on the experience customers have.",
      },
      {
        q: "What if I don't have a Google profile or a Tripadvisor page?",
        a: "We'll help you find the right page or understand the steps to create and verify one. The plate is only configured once the page is live and ready to receive reviews.",
      },
      {
        q: "I run a holiday rental. Are the plates for me?",
        a: "Yes. For each plate you can choose Google, Tripadvisor (if the property has a page there) or Booking.com. Google only accepts profiles for places where you welcome guests in person, such as hostels, guest houses or rooms with the host on site; self-check-in flats and villas can't have a profile, under Google's own rules. On Booking.com only guests who booked through Booking can review, from the email they receive after check-out, and the plate reminds them of it. Airbnb has no review link a plate could open: there, the digital guest guide tells guests where to leave a review, the same way for everyone and with nothing offered in return.",
      },
    ],
  },
  es: {
    name: "Placas para reseñas",
    shortName: "Placas para reseñas",
    tagline: "Un toque con el móvil y su cliente ya está escribiendo su reseña.",
    summary:
      "Placas, pegatinas y expositores de mesa que, con un toque o con el código QR, llevan al cliente a las reseñas de su negocio en Google, Tripadvisor o Booking.com. Cada placa abre el destino que usted elija. Nosotros lo configuramos todo.",
    metaTitle: "Placas para reseñas en Google, Tripadvisor y Booking | Steevanz",
    metaDescription:
      "Placas para reseñas en Google, Tripadvisor y Booking.com: un toque con el móvil abre la página de su negocio. Sin app, con código QR incluido y todo configurado por nuestro equipo.",
    heroTitle: "Más reseñas, con un solo toque",
    heroSubtitle:
      "Su cliente acerca el móvil a la placa y se abre al momento la página de reseñas de su negocio en Google o Tripadvisor, o la página de su alojamiento en Booking.com. Sin buscar su nombre, sin instalar nada. Cada placa abre un destino, a su elección, y nosotros configuramos el enlace.",
    problem: {
      title: "A sus clientes les encanta lo que hace, pero no lo dicen en internet",
      body:
        "La mayoría de los clientes satisfechos se van sin escribir una reseña. No porque no quieran, sino porque cuesta: abrir la app, buscar el negocio, encontrar el botón correcto. Mientras tanto, quien busca en Google, Tripadvisor o Booking.com compara estrellas y número de reseñas antes de decidir.",
      points: [
        "Pedir una reseña en persona rara vez acaba en una reseña escrita",
        "Un perfil con pocas reseñas recientes parece menos activo de lo que es",
        "Los clientes descontentos suelen escribir más que los contentos",
      ],
    },
    solution: {
      title: "Convierta una buena experiencia en una reseña en el momento justo",
      body:
        "Nuestras placas llevan al cliente a la plataforma que más cuenta para su negocio, con la experiencia todavía reciente. Un toque o un escaneo del QR, y ya está ahí.",
      points: [
        "Google, Tripadvisor o Booking.com: usted elige el destino de cada placa",
        "Funciona con la mayoría de los móviles actuales, sin app, y lleva código QR impreso",
        "Enlace configurado y probado por nuestro equipo antes de la entrega",
        "Pide la opinión a todos por igual, según las normas de cada plataforma",
      ],
    },
    steps: [
      {
        title: "Elija el formato y el destino",
        body: "Placa de mostrador, expositor de mesa, pegatina o placa de pared. Para cada placa elige un destino: Google, Tripadvisor o Booking.com. Le ayudamos a decidir dónde se verá mejor.",
      },
      {
        title: "La configuramos",
        body: "Vinculamos cada placa al enlace correcto: el formulario de reseña de Google, la página de reseñas de Tripadvisor o la página de su alojamiento en Booking.com. La probamos en iPhone y Android.",
      },
      {
        title: "Colóquela e invite",
        body: "Ponga la placa en el sitio adecuado y, al final de cada visita, invite a sus clientes a dar su opinión. En Booking.com solo opina quien reservó por Booking, desde el correo que Booking envía tras el check-out: la placa se lo recuerda al huésped.",
      },
      {
        title: "Vea los resultados",
        body: "Vea llegar las nuevas reseñas y respóndalas para demostrar que está atento.",
      },
    ],
    features: [
      {
        title: "Un toque para opinar",
        body: "El chip lleva al cliente directamente a las reseñas de su negocio en Google o Tripadvisor, sin pasos de más ni búsquedas.",
      },
      {
        title: "Una placa, un destino",
        body: "Cada placa abre un único destino, elegido por usted: Google, Tripadvisor o Booking.com. En un restaurante, por ejemplo, placas de Google en las mesas y una de Tripadvisor a la salida.",
      },
      {
        title: "Código QR de respaldo",
        body: "Cada placa lleva un código QR impreso. Si un móvil no lee el toque, o tiene esa opción desactivada, basta con apuntar la cámara para llegar al mismo sitio.",
      },
      {
        title: "Cuatro formatos",
        body: "Placa de metacrilato para el mostrador, expositor de mesa, pegatina discreta para mostradores o escaparates y placa de pared para zonas de espera.",
      },
      {
        title: "Enlace reconfigurable",
        body: "Si cambia de perfil, se muda de local o quiere que la placa lleve a otro sitio, actualizamos el enlace sin cambiar la placa.",
      },
      {
        title: "Según las normas",
        body: "Nunca ofrecemos incentivos a cambio de reseñas ni filtramos clientes. La placa invita a todos a dar una opinión sincera, como exigen Google, Tripadvisor y Booking.com.",
      },
    ],
    useCases: [
      {
        sector: "restaurants",
        title: "Restaurantes y cafeterías",
        body: "Un expositor en cada mesa o junto a la caja, para Google o para Tripadvisor. El cliente deja su reseña mientras espera la cuenta, con la comida todavía en la memoria.",
      },
      {
        sector: "beauty",
        title: "Peluquerías y centros de estética",
        body: "Una placa en el mostrador de recepción, a la vista en el momento de pagar. El momento ideal para pedir una reseña en Google a quien se va contento.",
      },
      {
        sector: "clinics",
        title: "Clínicas y consultas",
        body: "Una placa discreta en la recepción o en la sala de espera. El paciente da su opinión en Google cuando le viene bien, sin presión.",
      },
      {
        sector: "retail",
        title: "Tiendas",
        body: "Una pegatina en el mostrador o junto al datáfono. Ideal para el comercio de barrio que quiere destacar en las búsquedas locales de Google.",
      },
      {
        sector: "lodging",
        title: "Hoteles y alojamientos turísticos",
        body: "En la recepción, en la habitación o en la sala de desayunos, una placa pide una reseña al final de la estancia: en Google, Tripadvisor o Booking.com. La placa de Booking abre la página del alojamiento y recuerda al huésped que use el correo de valoración que Booking le envía; solo quien reservó por Booking puede opinar allí.",
      },
    ],
    includes: [
      "Placa con código QR impreso, en el formato que elija",
      "Configuración del destino de cada placa: Google, Tripadvisor o Booking.com",
      "Pruebas en iPhone y Android antes de la entrega",
      "Consejos sobre dónde colocar la placa y cómo invitar a los clientes",
      "Reconfiguración del enlace siempre que la necesite",
      "Soporte por WhatsApp y email",
    ],
    faq: [
      {
        q: "¿Qué móviles leen la placa?",
        a: "Los iPhone XS y posteriores leen la placa sin ninguna app: basta con acercar la parte superior del móvil. En los iPhone 7 a X, el lector de etiquetas está en el Centro de control. La mayoría de los Android leen la placa siempre que la lectura por proximidad esté activada en los ajustes de conexión. Para los demás, hay un código QR impreso en la placa.",
      },
      {
        q: "¿El cliente tiene que instalar una app?",
        a: "No. El toque abre la página en el navegador del móvil, o en la app de la plataforma (Google, Tripadvisor o Booking.com) si ya está instalada. Para escribir la reseña, el cliente necesita haber iniciado sesión en una cuenta de esa plataforma.",
      },
      {
        q: "¿Una placa sirve para Google, Tripadvisor y Booking a la vez?",
        a: "No. Cada placa abre un único destino, que usted elige en el pedido: Google, Tripadvisor o Booking.com. Si quiere pedir reseñas en más de una plataforma, utiliza placas distintas, por ejemplo Google en las mesas y Tripadvisor junto a la salida. Si más adelante quiere cambiar el destino de una placa, actualizamos el enlace sin cambiarla.",
      },
      {
        q: "¿Cualquier cliente puede valorarme en Booking.com con la placa?",
        a: "No. Booking.com solo acepta valoraciones de huéspedes que reservaron por Booking y se alojaron: tras el check-out, Booking envía a cada uno, por correo electrónico, una invitación para valorar. La placa de Booking abre la página de su alojamiento en Booking.com y recuerda al huésped que use ese correo. En Google y Tripadvisor es distinto: cualquier cliente que abra el enlace puede dejar su reseña.",
      },
      {
        q: "¿Lo permiten las normas de las plataformas?",
        a: "Sí, siempre que se use con honestidad. Google, Tripadvisor y Booking.com prohíben ofrecer descuentos o regalos a cambio de reseñas, y Google y Tripadvisor prohíben además pedir opinión solo a los clientes satisfechos. Nuestras placas piden la opinión a todos por igual. Steevanz no está afiliada a Google, Tripadvisor ni Booking.com: simplemente facilitamos el acceso a las páginas de su negocio.",
      },
      {
        q: "¿Cuánto tarda en estar lista?",
        a: "En cuanto nos envíe el enlace o el nombre de la página de su negocio en Google, Tripadvisor o Booking.com, configuramos y probamos las placas en pocos días laborables. El plazo exacto depende de la cantidad y del formato, y se lo confirmamos en la demostración.",
      },
      {
        q: "¿Pueden garantizar más estrellas?",
        a: "No, y nadie honesto debería hacerlo. La placa facilita que más clientes den su opinión, lo que suele dar una imagen más fiel de su servicio. Su valoración depende siempre de la experiencia que viven sus clientes.",
      },
      {
        q: "¿Y si no tengo perfil en Google ni página en Tripadvisor?",
        a: "Le ayudamos a encontrar la página correcta o a entender los pasos para crearla y verificarla. La placa solo se configura cuando la página está activa y lista para recibir reseñas.",
      },
      {
        q: "Tengo un alojamiento turístico. ¿Las placas son para mí?",
        a: "Sí. Para cada placa puede elegir Google, Tripadvisor (si el alojamiento tiene página allí) o Booking.com. Google solo acepta perfiles de alojamientos donde recibe a los huéspedes en persona, como hostales, casas de huéspedes o habitaciones con el anfitrión presente; los apartamentos y las villas con autoentrada no pueden tener perfil, según las propias normas de Google. En Booking.com solo opina quien reservó por Booking, desde el correo que recibe tras el check-out, y la placa se lo recuerda. Airbnb no tiene un enlace de reseña que una placa pueda abrir: para eso, la Guía digital del alojamiento indica dónde dejar una reseña, igual para todos y sin ofrecer nada a cambio.",
      },
    ],
  },
  fr: {
    name: "Plaques pour avis",
    shortName: "Plaques pour avis",
    tagline: "Un toucher avec le téléphone, et votre client rédige déjà son avis.",
    summary:
      "Plaques, autocollants et chevalets de table qui, d'un toucher ou par QR code, mènent le client aux avis de votre établissement sur Google, Tripadvisor ou Booking.com. Chaque plaque ouvre la destination de votre choix. Nous configurons tout.",
    metaTitle: "Plaques pour avis Google, Tripadvisor et Booking | Steevanz",
    metaDescription:
      "Plaques pour avis sur Google, Tripadvisor et Booking.com : un toucher avec le téléphone ouvre la page de votre établissement. Sans application, QR code inclus et tout configuré par notre équipe.",
    heroTitle: "Plus d'avis, d'un simple toucher",
    heroSubtitle:
      "Votre client approche son téléphone de la plaque et la page d'avis de votre établissement sur Google ou Tripadvisor s'ouvre aussitôt, ou la page de votre hébergement sur Booking.com. Pas besoin de chercher votre nom, rien à installer. Chaque plaque ouvre une destination de votre choix, et nous configurons le lien pour vous.",
    problem: {
      title: "Vos clients aiment ce que vous faites, mais ne le disent pas en ligne",
      body:
        "La plupart des clients satisfaits repartent sans laisser d'avis. Pas parce qu'ils ne le veulent pas, mais parce que c'est fastidieux : ouvrir l'application, chercher l'établissement, trouver le bon bouton. Pendant ce temps, ceux qui cherchent sur Google, Tripadvisor ou Booking.com comparent les étoiles et le nombre d'avis avant de choisir.",
      points: [
        "Demander un avis de vive voix se transforme rarement en avis écrit",
        "Un profil avec peu d'avis récents paraît moins actif qu'il ne l'est",
        "Les clients mécontents écrivent souvent plus que les clients satisfaits",
      ],
    },
    solution: {
      title: "Transformez une bonne expérience en avis, au bon moment",
      body:
        "Nos plaques mènent le client vers la plateforme qui compte le plus pour votre établissement, pendant que l'expérience est encore toute fraîche. Un toucher ou un scan du QR code, et il y est.",
      points: [
        "Google, Tripadvisor ou Booking.com : vous choisissez la destination de chaque plaque",
        "Fonctionne avec la plupart des téléphones récents, sans application, avec un QR code imprimé",
        "Lien configuré et testé par notre équipe avant la livraison",
        "Sollicite tous les clients de la même façon, conformément aux règles de chaque plateforme",
      ],
    },
    steps: [
      {
        title: "Choisissez le format et la destination",
        body: "Plaque de comptoir, chevalet de table, autocollant ou plaque murale. Pour chaque plaque, vous choisissez une destination : Google, Tripadvisor ou Booking.com. Nous vous aidons à choisir l'endroit où elle sera le plus visible.",
      },
      {
        title: "Nous la configurons",
        body: "Nous relions chaque plaque au bon lien : le formulaire d'avis Google, la page d'avis Tripadvisor ou la page de votre hébergement sur Booking.com. Nous la testons sur iPhone et Android.",
      },
      {
        title: "Installez-la et invitez",
        body: "Placez la plaque au bon endroit et, à la fin de chaque visite, invitez vos clients à donner leur avis. Sur Booking.com, seuls les voyageurs qui ont réservé via Booking peuvent laisser un avis, depuis l'e-mail que Booking envoie après le départ : la plaque le leur rappelle.",
      },
      {
        title: "Suivez les résultats",
        body: "Voyez les nouveaux avis arriver et répondez-y pour montrer que vous êtes attentif.",
      },
    ],
    features: [
      {
        title: "Un toucher pour donner son avis",
        body: "La puce mène le client directement aux avis de votre établissement sur Google ou Tripadvisor, sans étape inutile ni recherche.",
      },
      {
        title: "Une plaque, une destination",
        body: "Chaque plaque ouvre une seule destination, choisie par vous : Google, Tripadvisor ou Booking.com. Dans un restaurant, par exemple, des plaques Google sur les tables et une plaque Tripadvisor à la sortie.",
      },
      {
        title: "QR code de secours",
        body: "Chaque plaque porte un QR code imprimé. Si un téléphone ne lit pas le toucher, ou si l'option est désactivée, il suffit de pointer l'appareil photo pour arriver au même endroit.",
      },
      {
        title: "Quatre formats",
        body: "Plaque de comptoir en acrylique, chevalet de table, autocollant discret pour comptoir ou vitrine, et plaque murale pour les salles d'attente.",
      },
      {
        title: "Lien reconfigurable",
        body: "Si vous changez de fiche, déménagez ou voulez que la plaque mène ailleurs, nous mettons le lien à jour sans changer la plaque.",
      },
      {
        title: "Dans les règles",
        body: "Nous n'offrons jamais de contrepartie contre des avis et ne filtrons jamais les clients. La plaque invite chacun à donner un avis sincère, comme l'exigent Google, Tripadvisor et Booking.com.",
      },
    ],
    useCases: [
      {
        sector: "restaurants",
        title: "Restaurants et cafés",
        body: "Un chevalet sur chaque table ou près de la caisse, pour Google ou pour Tripadvisor. Le client laisse son avis en attendant l'addition, avec le repas encore en tête.",
      },
      {
        sector: "beauty",
        title: "Salons de coiffure et instituts de beauté",
        body: "Une plaque sur le comptoir d'accueil, bien visible au moment de payer. Le moment idéal pour demander un avis Google à un client qui repart content.",
      },
      {
        sector: "clinics",
        title: "Cliniques et cabinets",
        body: "Une plaque discrète à l'accueil ou en salle d'attente. Le patient donne son avis sur Google quand cela lui convient, sans pression.",
      },
      {
        sector: "retail",
        title: "Commerces",
        body: "Un autocollant sur le comptoir ou à côté du terminal de paiement. Idéal pour les commerces de quartier qui veulent se démarquer dans les recherches locales sur Google.",
      },
      {
        sector: "lodging",
        title: "Hôtels et locations de vacances",
        body: "À l'accueil, dans la chambre ou dans la salle du petit-déjeuner, une plaque demande un avis en fin de séjour : sur Google, Tripadvisor ou Booking.com. La plaque Booking ouvre la page de l'hébergement et rappelle au voyageur d'utiliser l'e-mail d'avis que Booking lui envoie ; seuls ceux qui ont réservé via Booking peuvent y laisser un avis.",
      },
    ],
    includes: [
      "Plaque avec QR code imprimé, dans le format de votre choix",
      "Configuration de la destination de chaque plaque : Google, Tripadvisor ou Booking.com",
      "Tests sur iPhone et Android avant la livraison",
      "Conseils pour placer la plaque et inviter vos clients",
      "Reconfiguration du lien chaque fois que nécessaire",
      "Assistance par WhatsApp et e-mail",
    ],
    faq: [
      {
        q: "Quels téléphones lisent la plaque ?",
        a: "Les iPhone XS et plus récents lisent la plaque sans aucune application : il suffit d'en approcher le haut du téléphone. Sur les iPhone 7 à X, le lecteur de tags se trouve dans le Centre de contrôle. La plupart des Android lisent la plaque si la lecture sans contact est activée dans les paramètres de connexion. Pour les autres, un QR code est imprimé sur la plaque.",
      },
      {
        q: "Le client doit-il installer une application ?",
        a: "Non. Le toucher ouvre la page dans le navigateur du téléphone, ou dans l'application de la plateforme (Google, Tripadvisor ou Booking.com) si elle est déjà installée. Pour rédiger l'avis, le client doit être connecté à un compte sur cette plateforme.",
      },
      {
        q: "Une plaque peut-elle servir à Google, Tripadvisor et Booking en même temps ?",
        a: "Non. Chaque plaque ouvre une seule destination, que vous choisissez à la commande : Google, Tripadvisor ou Booking.com. Si vous voulez des avis sur plusieurs plateformes, vous utilisez des plaques différentes, par exemple Google sur les tables et Tripadvisor près de la sortie. Si vous voulez plus tard changer la destination d'une plaque, nous mettons le lien à jour sans la remplacer.",
      },
      {
        q: "N'importe quel client peut-il me laisser un avis sur Booking.com avec la plaque ?",
        a: "Non. Booking.com n'accepte que les avis des voyageurs qui ont réservé via Booking et séjourné chez vous : après le départ, Booking envoie à chacun, par e-mail, une invitation à laisser un avis. La plaque Booking ouvre la page de votre hébergement sur Booking.com et rappelle au voyageur d'utiliser cet e-mail. Sur Google et Tripadvisor, c'est différent : tout client qui ouvre le lien peut laisser son avis.",
      },
      {
        q: "Est-ce autorisé par les règles des plateformes ?",
        a: "Oui, tant que l'usage est honnête. Google, Tripadvisor et Booking.com interdisent d'offrir des remises ou des cadeaux en échange d'avis, et Google et Tripadvisor interdisent aussi de ne solliciter que les clients satisfaits. Nos plaques sollicitent tout le monde de la même façon. Steevanz n'est affiliée ni à Google, ni à Tripadvisor, ni à Booking.com : nous rendons simplement les pages de votre établissement plus faciles d'accès.",
      },
      {
        q: "En combien de temps est-ce prêt ?",
        a: "Dès que vous nous envoyez le lien ou le nom de la page de votre établissement sur Google, Tripadvisor ou Booking.com, nous configurons et testons les plaques en quelques jours ouvrés. Le délai exact dépend de la quantité et du format, et nous vous le confirmons lors de la démonstration.",
      },
      {
        q: "Pouvez-vous garantir plus d'étoiles ?",
        a: "Non, et personne d'honnête ne devrait le faire. La plaque permet à davantage de clients de donner leur avis, ce qui donne généralement une image plus fidèle de votre service. Votre note dépend toujours de l'expérience vécue par vos clients.",
      },
      {
        q: "Et si je n'ai ni fiche Google ni page Tripadvisor ?",
        a: "Nous vous aidons à trouver la bonne page ou à comprendre les étapes pour la créer et la valider. La plaque n'est configurée qu'une fois la page active et prête à recevoir des avis.",
      },
      {
        q: "Je gère une location de vacances. Les plaques sont-elles pour moi ?",
        a: "Oui. Pour chaque plaque, vous pouvez choisir Google, Tripadvisor (si l'hébergement y a une page) ou Booking.com. Google n'accepte que les fiches des hébergements où vous accueillez vos hôtes en personne, comme les auberges, les maisons d'hôtes ou les chambres chez l'habitant ; les appartements et villas en arrivée autonome ne peuvent pas avoir de fiche, selon les règles de Google elles-mêmes. Sur Booking.com, seuls ceux qui ont réservé via Booking peuvent laisser un avis, depuis l'e-mail reçu après le départ, et la plaque le leur rappelle. Airbnb n'a pas de lien d'avis qu'une plaque pourrait ouvrir : dans ce cas, le Livret d'accueil digital indique où laisser un avis, de la même façon pour tous et sans rien offrir en échange.",
      },
    ],
  },
  de: {
    name: "Schilder für Bewertungen",
    shortName: "Bewertungsschilder",
    tagline: "Einmal mit dem Handy antippen, und Ihr Gast schreibt schon seine Bewertung.",
    summary:
      "Schilder, Aufkleber und Tischaufsteller, die mit einem Antippen oder per QR-Code direkt zu den Bewertungen Ihres Betriebs auf Google, Tripadvisor oder Booking.com führen. Jedes Schild öffnet das Ziel, das Sie wählen. Wir richten alles ein.",
    metaTitle: "Bewertungsschilder für Google, Tripadvisor und Booking | Steevanz",
    metaDescription:
      "Schilder für Bewertungen auf Google, Tripadvisor und Booking.com: Ein Antippen mit dem Handy öffnet die Seite Ihres Betriebs. Ohne App, mit QR-Code und komplett von unserem Team eingerichtet.",
    heroTitle: "Mehr Bewertungen, mit einem einzigen Antippen",
    heroSubtitle:
      "Ihr Kunde hält sein Handy an das Schild, und sofort öffnet sich die Bewertungsseite Ihres Betriebs auf Google oder Tripadvisor oder die Seite Ihrer Unterkunft auf Booking.com. Kein Suchen nach Ihrem Namen, nichts zu installieren. Jedes Schild öffnet ein Ziel Ihrer Wahl, und wir richten den Link für Sie ein.",
    problem: {
      title: "Ihre Kunden schätzen Ihre Arbeit, sagen es aber nicht online",
      body:
        "Die meisten zufriedenen Kunden gehen, ohne eine Bewertung zu schreiben. Nicht, weil sie nicht wollen, sondern weil es Mühe macht: die App öffnen, den Betrieb suchen, den richtigen Knopf finden. Währenddessen vergleichen Menschen, die auf Google, Tripadvisor oder Booking.com suchen, Sterne und Anzahl der Bewertungen, bevor sie sich entscheiden.",
      points: [
        "Eine Bitte im persönlichen Gespräch wird selten zu einer geschriebenen Bewertung",
        "Ein Profil mit wenigen aktuellen Bewertungen wirkt weniger aktiv, als es ist",
        "Unzufriedene Kunden schreiben oft mehr als zufriedene",
      ],
    },
    solution: {
      title: "Aus einem guten Erlebnis wird im richtigen Moment eine Bewertung",
      body:
        "Unsere Schilder führen Kunden zu der Plattform, die für Ihren Betrieb am meisten zählt, solange das Erlebnis noch frisch ist. Ein Antippen oder ein Scan des QR-Codes, und schon sind sie da.",
      points: [
        "Google, Tripadvisor oder Booking.com: Sie wählen das Ziel jedes Schildes",
        "Funktioniert mit den meisten aktuellen Handys, ohne App, mit aufgedrucktem QR-Code",
        "Link vor der Lieferung von unserem Team eingerichtet und getestet",
        "Bittet alle Kunden gleichermaßen, im Einklang mit den Regeln jeder Plattform",
      ],
    },
    steps: [
      {
        title: "Format und Ziel wählen",
        body: "Thekenschild, Tischaufsteller, Aufkleber oder Wandschild. Für jedes Schild wählen Sie ein Ziel: Google, Tripadvisor oder Booking.com. Wir helfen Ihnen zu entscheiden, wo es am besten zu sehen ist.",
      },
      {
        title: "Wir richten es ein",
        body: "Wir verknüpfen jedes Schild mit dem richtigen Link: dem Google-Bewertungsformular, der Bewertungsseite auf Tripadvisor oder der Seite Ihrer Unterkunft auf Booking.com. Wir testen es auf iPhone und Android.",
      },
      {
        title: "Aufstellen und einladen",
        body: "Stellen Sie das Schild an die richtige Stelle und laden Sie Ihre Kunden am Ende jedes Besuchs ein, ihre Meinung zu teilen. Auf Booking.com können nur Gäste bewerten, die über Booking gebucht haben, über die E-Mail, die Booking nach dem Check-out schickt: Das Schild erinnert sie daran.",
      },
      {
        title: "Ergebnisse verfolgen",
        body: "Sehen Sie, wie neue Bewertungen eintreffen, und antworten Sie darauf, um zu zeigen, dass Sie zuhören.",
      },
    ],
    features: [
      {
        title: "Antippen und bewerten",
        body: "Der Chip führt Kunden direkt zu den Bewertungen Ihres Betriebs auf Google oder Tripadvisor, ohne Umwege und ohne Suchen.",
      },
      {
        title: "Ein Schild, ein Ziel",
        body: "Jedes Schild öffnet genau ein Ziel, das Sie wählen: Google, Tripadvisor oder Booking.com. Im Restaurant zum Beispiel Google-Schilder auf den Tischen und ein Tripadvisor-Schild am Ausgang.",
      },
      {
        title: "QR-Code als Alternative",
        body: "Jedes Schild hat einen aufgedruckten QR-Code. Wessen Handy kein Antippen liest oder diese Option ausgeschaltet hat, richtet einfach die Kamera darauf und landet an derselben Stelle.",
      },
      {
        title: "Vier Formate",
        body: "Thekenschild aus Acryl, Tischaufsteller, dezenter Aufkleber für Theke oder Schaufenster und Wandschild für Wartebereiche.",
      },
      {
        title: "Link jederzeit änderbar",
        body: "Wenn Sie das Profil wechseln, umziehen oder das Schild auf ein anderes Ziel zeigen soll, ändern wir den Link, ohne das Schild zu ersetzen.",
      },
      {
        title: "Nach den Regeln",
        body: "Wir bieten nie Gegenleistungen für Bewertungen an und filtern keine Kunden. Das Schild lädt alle zu einer ehrlichen Meinung ein, so wie Google, Tripadvisor und Booking.com es verlangen.",
      },
    ],
    useCases: [
      {
        sector: "restaurants",
        title: "Restaurants und Cafés",
        body: "Ein Aufsteller auf jedem Tisch oder an der Kasse, für Google oder Tripadvisor. Gäste bewerten, während sie auf die Rechnung warten, mit dem Essen noch frisch im Kopf.",
      },
      {
        sector: "beauty",
        title: "Friseur- und Kosmetiksalons",
        body: "Ein Schild auf dem Empfangstresen, gut sichtbar beim Bezahlen. Der ideale Moment, um jemanden um eine Google-Bewertung zu bitten, der gerade zufrieden geht.",
      },
      {
        sector: "clinics",
        title: "Kliniken und Praxen",
        body: "Ein dezentes Schild am Empfang oder im Wartezimmer. Patienten teilen ihre Meinung auf Google, wann es ihnen passt, ganz ohne Druck.",
      },
      {
        sector: "retail",
        title: "Geschäfte",
        body: "Ein Aufkleber auf der Theke oder neben dem Kartenterminal. Ideal für Geschäfte im Viertel, die in der lokalen Google-Suche auffallen wollen.",
      },
      {
        sector: "lodging",
        title: "Hotels und Ferienunterkünfte",
        body: "Am Empfang, im Zimmer oder im Frühstücksraum bittet ein Schild am Ende des Aufenthalts um eine Bewertung: auf Google, Tripadvisor oder Booking.com. Das Booking-Schild öffnet die Seite der Unterkunft und erinnert den Gast an die Bewertungs-E-Mail, die Booking ihm schickt; bewerten können dort nur Gäste, die über Booking gebucht haben.",
      },
    ],
    includes: [
      "Schild mit aufgedrucktem QR-Code, im Format Ihrer Wahl",
      "Einrichtung des Ziels jedes Schildes: Google, Tripadvisor oder Booking.com",
      "Tests auf iPhone und Android vor der Lieferung",
      "Beratung, wo das Schild stehen soll und wie Sie Kunden einladen",
      "Änderung des Links, wann immer Sie es brauchen",
      "Support per WhatsApp und E-Mail",
    ],
    faq: [
      {
        q: "Welche Handys lesen das Schild?",
        a: "iPhone XS und neuer lesen das Schild ohne App: einfach die Oberkante des Handys daranhalten. Beim iPhone 7 bis X findet sich der Tag-Reader im Kontrollzentrum. Die meisten Android-Handys lesen das Schild, sofern das kontaktlose Lesen in den Verbindungseinstellungen eingeschaltet ist. Für alle anderen ist ein QR-Code auf das Schild gedruckt.",
      },
      {
        q: "Müssen Kunden eine App installieren?",
        a: "Nein. Das Antippen öffnet die Seite im Browser des Handys oder in der App der Plattform (Google, Tripadvisor oder Booking.com), falls sie schon installiert ist. Zum Schreiben der Bewertung muss der Kunde in einem Konto dieser Plattform angemeldet sein.",
      },
      {
        q: "Kann ein Schild gleichzeitig für Google, Tripadvisor und Booking dienen?",
        a: "Nein. Jedes Schild öffnet genau ein Ziel, das Sie bei der Bestellung wählen: Google, Tripadvisor oder Booking.com. Wenn Sie Bewertungen auf mehreren Plattformen möchten, nutzen Sie verschiedene Schilder, zum Beispiel Google auf den Tischen und Tripadvisor am Ausgang. Soll ein Schild später auf ein anderes Ziel zeigen, ändern wir den Link, ohne es zu ersetzen.",
      },
      {
        q: "Kann mich jeder Kunde über das Schild auf Booking.com bewerten?",
        a: "Nein. Booking.com nimmt nur Bewertungen von Gästen an, die über Booking gebucht und bei Ihnen übernachtet haben: Nach dem Check-out schickt Booking jedem von ihnen per E-Mail eine Einladung zur Bewertung. Das Booking-Schild öffnet die Seite Ihrer Unterkunft auf Booking.com und erinnert den Gast daran, diese E-Mail zu nutzen. Bei Google und Tripadvisor ist es anders: Jeder Kunde, der den Link öffnet, kann eine Bewertung abgeben.",
      },
      {
        q: "Ist das nach den Regeln der Plattformen erlaubt?",
        a: "Ja, solange es ehrlich eingesetzt wird. Google, Tripadvisor und Booking.com verbieten Rabatte oder Geschenke im Austausch für Bewertungen, und Google und Tripadvisor verbieten außerdem, nur zufriedene Kunden zu fragen. Unsere Schilder fragen alle gleichermaßen. Steevanz ist weder mit Google noch mit Tripadvisor oder Booking.com verbunden: Wir machen die Seiten Ihres Betriebs einfach leichter erreichbar.",
      },
      {
        q: "Wie schnell ist alles fertig?",
        a: "Sobald Sie uns den Link oder den Namen der Seite Ihres Betriebs auf Google, Tripadvisor oder Booking.com schicken, richten wir die Schilder innerhalb weniger Werktage ein und testen sie. Die genaue Dauer hängt von Menge und Format ab, und wir bestätigen sie Ihnen in der Vorführung.",
      },
      {
        q: "Garantieren Sie mehr Sterne?",
        a: "Nein, und niemand, der ehrlich ist, sollte das tun. Das Schild macht es mehr Kunden leichter, ihre Meinung zu teilen, was meist ein treffenderes Bild Ihres Service ergibt. Ihre Bewertung hängt immer von dem ab, was Ihre Kunden bei Ihnen erleben.",
      },
      {
        q: "Was, wenn ich weder ein Google-Profil noch eine Tripadvisor-Seite habe?",
        a: "Wir helfen Ihnen, die richtige Seite zu finden oder die Schritte zu verstehen, um eine zu erstellen und zu bestätigen. Das Schild wird erst eingerichtet, wenn die Seite aktiv ist und Bewertungen empfangen kann.",
      },
      {
        q: "Ich vermiete eine Ferienunterkunft. Sind die Schilder etwas für mich?",
        a: "Ja. Für jedes Schild können Sie Google, Tripadvisor (falls die Unterkunft dort eine Seite hat) oder Booking.com wählen. Google akzeptiert nur Profile von Unterkünften, in denen Sie die Gäste persönlich empfangen, etwa Hostels, Pensionen oder Zimmer mit Gastgeber vor Ort; Wohnungen und Villen mit Self-Check-in können nach den Regeln von Google selbst kein Profil haben. Auf Booking.com bewerten nur Gäste, die über Booking gebucht haben, über die E-Mail nach dem Check-out, und das Schild erinnert sie daran. Airbnb hat keinen Bewertungslink, den ein Schild öffnen könnte: Dafür zeigt die Digitale Gästemappe Ihren Gästen, wo sie eine Bewertung hinterlassen können, für alle gleich und ohne Gegenleistung.",
      },
    ],
  },
  it: {
    name: "Targhe per recensioni",
    shortName: "Targhe per recensioni",
    tagline: "Un tocco con il telefono e il cliente sta già scrivendo la sua recensione.",
    summary:
      "Targhe, adesivi ed espositori da tavolo che, con un tocco o tramite QR code, portano il cliente alle recensioni della Sua attività su Google, Tripadvisor o Booking.com. Ogni targa apre la destinazione che sceglie Lei. Configuriamo tutto noi.",
    metaTitle: "Targhe per recensioni su Google, Tripadvisor e Booking | Steevanz",
    metaDescription:
      "Targhe per recensioni su Google, Tripadvisor e Booking.com: un tocco con il telefono apre la pagina della Sua attività. Senza app, con QR code incluso e tutto configurato dal nostro team.",
    heroTitle: "Più recensioni, con un solo tocco",
    heroSubtitle:
      "Il cliente avvicina il telefono alla targa e si apre subito la pagina delle recensioni della Sua attività su Google o Tripadvisor, oppure la pagina della Sua struttura su Booking.com. Niente ricerche del Suo nome, niente da installare. Ogni targa apre una destinazione a Sua scelta, e il link lo configuriamo noi.",
    problem: {
      title: "I Suoi clienti apprezzano quello che fa, ma non lo dicono online",
      body:
        "La maggior parte dei clienti soddisfatti se ne va senza scrivere una recensione. Non perché non voglia, ma perché costa fatica: aprire l'app, cercare l'attività, trovare il pulsante giusto. Intanto, chi cerca su Google, Tripadvisor o Booking.com confronta stelle e numero di recensioni prima di scegliere.",
      points: [
        "Chiedere una recensione di persona raramente si traduce in una recensione scritta",
        "Un profilo con poche recensioni recenti sembra meno attivo di quanto sia",
        "I clienti scontenti tendono a scrivere più di quelli contenti",
      ],
    },
    solution: {
      title: "Trasformi una bella esperienza in una recensione, al momento giusto",
      body:
        "Le nostre targhe portano il cliente alla piattaforma che conta di più per la Sua attività, quando l'esperienza è ancora fresca. Un tocco o una scansione del QR, ed è già lì.",
      points: [
        "Google, Tripadvisor o Booking.com: sceglie Lei la destinazione di ogni targa",
        "Funziona con la maggior parte degli smartphone recenti, senza app, con QR code stampato",
        "Link configurato e testato dal nostro team prima della consegna",
        "Chiede l'opinione a tutti allo stesso modo, nel rispetto delle regole di ogni piattaforma",
      ],
    },
    steps: [
      {
        title: "Scelga il formato e la destinazione",
        body: "Targa da banco, espositore da tavolo, adesivo o targa da parete. Per ogni targa sceglie una destinazione: Google, Tripadvisor o Booking.com. La aiutiamo a scegliere dove si vedrà meglio.",
      },
      {
        title: "La configuriamo",
        body: "Colleghiamo ogni targa al link giusto: il modulo di recensione di Google, la pagina delle recensioni di Tripadvisor o la pagina della Sua struttura su Booking.com. La testiamo su iPhone e Android.",
      },
      {
        title: "Posizioni la targa e inviti",
        body: "Metta la targa nel punto giusto e, alla fine di ogni visita, inviti i clienti a dare la loro opinione. Su Booking.com può recensire solo chi ha prenotato tramite Booking, dall'e-mail che Booking invia dopo il check-out: la targa lo ricorda all'ospite.",
      },
      {
        title: "Guardi i risultati",
        body: "Vede arrivare le nuove recensioni e risponde per mostrare che ci tiene.",
      },
    ],
    features: [
      {
        title: "Un tocco per recensire",
        body: "Il chip porta il cliente direttamente alle recensioni della Sua attività su Google o Tripadvisor, senza passaggi in più e senza ricerche.",
      },
      {
        title: "Una targa, una destinazione",
        body: "Ogni targa apre una sola destinazione, scelta da Lei: Google, Tripadvisor o Booking.com. In un ristorante, per esempio, targhe Google sui tavoli e una Tripadvisor all'uscita.",
      },
      {
        title: "QR code di riserva",
        body: "Ogni targa ha un QR code stampato. Chi ha un telefono che non legge il tocco, o ha questa opzione disattivata, inquadra il codice con la fotocamera e arriva nello stesso punto.",
      },
      {
        title: "Quattro formati",
        body: "Targa da banco in acrilico, espositore da tavolo, adesivo discreto per banconi o vetrine e targa da parete per le sale d'attesa.",
      },
      {
        title: "Link riconfigurabile",
        body: "Se cambia profilo, si trasferisce o vuole che la targa porti altrove, aggiorniamo il link senza sostituire la targa.",
      },
      {
        title: "Secondo le regole",
        body: "Non offriamo mai incentivi in cambio di recensioni e non filtriamo i clienti. La targa invita tutti a dare un'opinione sincera, come richiedono Google, Tripadvisor e Booking.com.",
      },
    ],
    useCases: [
      {
        sector: "restaurants",
        title: "Ristoranti e bar",
        body: "Un espositore su ogni tavolo o vicino alla cassa, per Google o per Tripadvisor. Il cliente lascia la recensione mentre aspetta il conto, con il pasto ancora in mente.",
      },
      {
        sector: "beauty",
        title: "Parrucchieri e centri estetici",
        body: "Una targa sul bancone della reception, ben visibile al momento di pagare. Il momento ideale per chiedere una recensione su Google a chi sta uscendo soddisfatto.",
      },
      {
        sector: "clinics",
        title: "Cliniche e studi",
        body: "Una targa discreta alla reception o in sala d'attesa. Il paziente dà la sua opinione su Google quando gli fa comodo, senza pressioni.",
      },
      {
        sector: "retail",
        title: "Negozi",
        body: "Un adesivo sul bancone o accanto al POS. Ideale per i negozi di quartiere che vogliono distinguersi nelle ricerche locali su Google.",
      },
      {
        sector: "lodging",
        title: "Hotel e case vacanza",
        body: "Alla reception, in camera o nella sala colazioni, una targa chiede una recensione alla fine del soggiorno: su Google, Tripadvisor o Booking.com. La targa Booking apre la pagina della struttura e ricorda all'ospite di usare l'e-mail di recensione che Booking gli invia; lì può recensire solo chi ha prenotato tramite Booking.",
      },
    ],
    includes: [
      "Targa con QR code stampato, nel formato che preferisce",
      "Configurazione della destinazione di ogni targa: Google, Tripadvisor o Booking.com",
      "Test su iPhone e Android prima della consegna",
      "Consigli su dove posizionare la targa e su come invitare i clienti",
      "Riconfigurazione del link ogni volta che serve",
      "Assistenza via WhatsApp ed email",
    ],
    faq: [
      {
        q: "Quali telefoni leggono la targa?",
        a: "Gli iPhone XS e successivi leggono la targa senza alcuna app: basta avvicinare la parte alta del telefono. Sugli iPhone dal 7 all'X, il lettore di tag si trova nel Centro di Controllo. La maggior parte degli Android legge la targa se la lettura contactless è attiva nelle impostazioni di connessione. Per tutti gli altri c'è un QR code stampato sulla targa.",
      },
      {
        q: "Il cliente deve installare un'app?",
        a: "No. Il tocco apre la pagina nel browser del telefono, o nell'app della piattaforma (Google, Tripadvisor o Booking.com) se è già installata. Per scrivere la recensione, il cliente deve aver effettuato l'accesso a un account di quella piattaforma.",
      },
      {
        q: "Una targa vale per Google, Tripadvisor e Booking insieme?",
        a: "No. Ogni targa apre una sola destinazione, che sceglie al momento dell'ordine: Google, Tripadvisor o Booking.com. Se vuole recensioni su più piattaforme, usa targhe diverse, per esempio Google sui tavoli e Tripadvisor vicino all'uscita. Se in seguito vuole cambiare la destinazione di una targa, aggiorniamo il link senza sostituirla.",
      },
      {
        q: "Qualsiasi cliente può recensirmi su Booking.com con la targa?",
        a: "No. Booking.com accetta solo recensioni di ospiti che hanno prenotato tramite Booking e soggiornato da Lei: dopo il check-out, Booking invia a ciascuno, via e-mail, un invito a lasciare una recensione. La targa Booking apre la pagina della Sua struttura su Booking.com e ricorda all'ospite di usare quell'e-mail. Su Google e Tripadvisor è diverso: qualsiasi cliente che apre il link può lasciare la sua recensione.",
      },
      {
        q: "È consentito dalle regole delle piattaforme?",
        a: "Sì, purché lo si usi in modo onesto. Google, Tripadvisor e Booking.com vietano di offrire sconti o regali in cambio di recensioni, e Google e Tripadvisor vietano anche di chiedere l'opinione solo ai clienti soddisfatti. Le nostre targhe chiedono a tutti allo stesso modo. Steevanz non è affiliata a Google, Tripadvisor o Booking.com: rendiamo semplicemente le pagine della Sua attività più facili da raggiungere.",
      },
      {
        q: "Quanto tempo serve per averla pronta?",
        a: "Appena ci invia il link o il nome della pagina della Sua attività su Google, Tripadvisor o Booking.com, configuriamo e testiamo le targhe in pochi giorni lavorativi. I tempi esatti dipendono da quantità e formato, e li confermiamo con Lei durante la demo.",
      },
      {
        q: "Potete garantire più stelle?",
        a: "No, e nessuno di onesto dovrebbe farlo. La targa rende più facile a più clienti dare la propria opinione, il che di solito offre un'immagine più fedele del Suo servizio. La Sua valutazione dipende sempre dall'esperienza che vivono i clienti.",
      },
      {
        q: "E se non ho un profilo Google né una pagina Tripadvisor?",
        a: "La aiutiamo a trovare la pagina giusta o a capire i passaggi per crearla e verificarla. La targa viene configurata solo quando la pagina è attiva e pronta a ricevere recensioni.",
      },
      {
        q: "Gestisco un affitto per vacanze. Le targhe fanno per me?",
        a: "Sì. Per ogni targa può scegliere Google, Tripadvisor (se la struttura ha una pagina lì) o Booking.com. Google accetta solo profili di strutture in cui accoglie gli ospiti di persona, come ostelli, affittacamere o camere con l'host presente; appartamenti e ville con self check-in non possono avere un profilo, secondo le regole stesse di Google. Su Booking.com recensisce solo chi ha prenotato tramite Booking, dall'e-mail che riceve dopo il check-out, e la targa glielo ricorda. Airbnb non ha un link di recensione che una targa possa aprire: in quel caso, la Guida digitale dell'alloggio indica dove lasciare una recensione, allo stesso modo per tutti e senza offrire nulla in cambio.",
      },
    ],
  },
};
