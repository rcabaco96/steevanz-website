import type { ProductDocs } from "../types";

export const docs: ProductDocs = {
  productId: "nfc-google-reviews",
  pages: {
    "getting-started": {
      pt: {
        title: "Primeiros passos com as placas NFC Google Reviews",
        description:
          "Saiba como funcionam as placas NFC para avaliações no Google, o que recebe da Steevanz e o que precisa de preparar antes de começar a recolher reviews.",
        blocks: [
          {
            type: "p",
            text: "As placas NFC Google Reviews permitem que os seus clientes deixem uma avaliação no Google em poucos segundos: basta aproximar o telemóvel da placa, ou apontar a câmara para o código QR impresso, e o formulário de avaliação do seu negócio abre de imediato. Sem pesquisas, sem procurar o nome da loja no Google Maps, sem passos intermédios.",
          },
          {
            type: "p",
            text: "Este é um serviço gerido: a Steevanz trata da configuração, da gravação dos chips e dos testes. Esta documentação explica como tudo funciona e como tirar o máximo partido das placas no dia a dia.",
          },
          { type: "h2", id: "como-funciona", text: "Como funciona" },
          {
            type: "p",
            text: "Cada placa tem um chip NFC (do tipo **NTAG213** ou **NTAG215**) escondido no interior e um código QR impresso na frente. O chip e o QR apontam para um endereço curto gerido pela Steevanz, que por sua vez redireciona o cliente para o formulário de avaliação do seu Perfil da Empresa no Google.",
          },
          {
            type: "ol",
            items: [
              "O cliente aproxima o telemóvel da placa ou lê o código QR.",
              "O telemóvel abre o link no navegador ou na aplicação Google Maps.",
              "Aparece a janela de avaliação do seu negócio, já com as estrelas prontas a preencher.",
              "O cliente escolhe as estrelas, escreve um comentário (opcional) e publica.",
            ],
          },
          {
            type: "callout",
            tone: "info",
            title: "Nada para instalar",
            text: "O cliente não precisa de instalar nenhuma aplicação. O NFC está incluído na grande maioria dos telemóveis recentes e o QR funciona com a câmara de qualquer smartphone.",
          },
          { type: "h2", id: "formatos-disponiveis", text: "Formatos disponíveis" },
          {
            type: "table",
            head: ["Formato", "Onde usar", "Notas"],
            rows: [
              ["Placa de balcão em acrílico", "Junto à caixa ou à receção", "Formato mais popular, com base estável"],
              ["Suporte de mesa", "Uma por mesa em restaurantes e cafés", "Visível durante toda a refeição"],
              ["Autocolante", "Menus, montras, espelhos, caixas registadoras", "Discreto e económico"],
              ["Placa de parede", "Entrada, sala de espera, corredor", "Instalar à altura dos olhos"],
            ],
          },
          { type: "h2", id: "o-que-precisa", text: "O que precisa antes de começar" },
          {
            type: "ul",
            items: [
              "Um **Perfil da Empresa no Google** (antigo Google My Business) ativo e verificado.",
              "Acesso a esse perfil como proprietário ou gestor, ou disponibilidade para nos enviar o link de avaliação.",
              "Uma ideia dos locais onde quer colocar as placas, para escolhermos os formatos certos.",
            ],
          },
          {
            type: "p",
            text: "Se ainda não tem o perfil verificado, trate disso primeiro: sem um perfil ativo, o Google não mostra o formulário de avaliação. Podemos orientá-lo no processo durante a [demonstração gratuita](/agendar).",
          },
          { type: "h2", id: "proximos-passos", text: "Próximos passos" },
          {
            type: "ul",
            items: [
              "[Instalação](/docs/placas-nfc-google-reviews/instalacao): como obtemos o link de avaliação e onde colocar cada placa.",
              "[Configuração](/docs/placas-nfc-google-reviews/configuracao): bloqueio dos chips, redirecionamento e alteração do destino.",
              "[Utilização](/docs/placas-nfc-google-reviews/utilizacao): como a sua equipa deve pedir avaliações sem violar as regras do Google.",
              "[Resolução de problemas](/docs/placas-nfc-google-reviews/resolucao-problemas): o que fazer se uma placa não reagir.",
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "A Steevanz não é o Google nem tem qualquer afiliação com a Google. As placas apenas encaminham os seus clientes para o formulário público de avaliação do seu perfil.",
          },
        ],
      },
      en: {
        title: "Getting started with NFC Google review plates",
        description:
          "Learn how NFC Google review plates work, what Steevanz delivers and what you need to prepare before you start collecting more Google reviews.",
        blocks: [
          {
            type: "p",
            text: "NFC Google review plates let your customers leave a Google review in seconds: they tap their phone on the plate, or point the camera at the printed QR code, and your business's review form opens straight away. No searching, no hunting for your shop on Google Maps, no extra steps.",
          },
          {
            type: "p",
            text: "This is a managed service: Steevanz handles the setup, writes the chips and tests everything. This documentation explains how it all works and how to get the most out of your plates day to day.",
          },
          { type: "h2", id: "how-it-works", text: "How it works" },
          {
            type: "p",
            text: "Each plate has an NFC chip (**NTAG213** or **NTAG215**) hidden inside and a QR code printed on the front. Both point to a short link managed by Steevanz, which redirects the customer to the review form of your Google Business Profile.",
          },
          {
            type: "ol",
            items: [
              "The customer taps their phone on the plate or scans the QR code.",
              "The phone opens the link in the browser or in the Google Maps app.",
              "Your business's review window appears, with the stars ready to fill in.",
              "The customer picks a rating, writes a comment (optional) and posts it.",
            ],
          },
          {
            type: "callout",
            tone: "info",
            title: "Nothing to install",
            text: "Customers don't need to install any app. NFC is built into the vast majority of recent phones, and the QR code works with any smartphone camera.",
          },
          { type: "h2", id: "available-formats", text: "Available formats" },
          {
            type: "table",
            head: ["Format", "Where to use it", "Notes"],
            rows: [
              ["Acrylic counter plate", "Next to the till or reception desk", "Most popular format, with a stable base"],
              ["Table stand", "One per table in restaurants and cafés", "Visible throughout the meal"],
              ["Sticker", "Menus, shop windows, mirrors, tills", "Discreet and affordable"],
              ["Wall plate", "Entrance, waiting room, corridor", "Mount at eye level"],
            ],
          },
          { type: "h2", id: "what-you-need", text: "What you need before you start" },
          {
            type: "ul",
            items: [
              "An active, verified **Google Business Profile** (formerly Google My Business).",
              "Owner or manager access to that profile, or the ability to send us your review link.",
              "A rough idea of where you want the plates, so we can pick the right formats.",
            ],
          },
          {
            type: "p",
            text: "If your profile isn't verified yet, sort that out first: without an active profile, Google won't show the review form. We can guide you through it during the [free demo](/en/book-a-demo).",
          },
          { type: "h2", id: "next-steps", text: "Next steps" },
          {
            type: "ul",
            items: [
              "[Setup](/en/docs/nfc-google-review-plates/setup): how we get your review link and where to place each plate.",
              "[Configuration](/en/docs/nfc-google-review-plates/configuration): chip locking, redirects and changing the destination.",
              "[Usage](/en/docs/nfc-google-review-plates/usage): how your team should ask for reviews without breaking Google's rules.",
              "[Troubleshooting](/en/docs/nfc-google-review-plates/troubleshooting): what to do if a plate doesn't respond.",
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "Steevanz is not Google and has no affiliation with Google. The plates simply send your customers to the public review form of your profile.",
          },
        ],
      },
    },
    setup: {
      pt: {
        title: "Instalação das placas NFC Google Reviews",
        description:
          "Como obter o link de avaliação do Perfil da Empresa no Google, validar o Place ID e escolher o melhor local para instalar cada placa NFC no seu negócio.",
        blocks: [
          {
            type: "p",
            text: "A instalação tem duas partes: obter o link de avaliação correto do seu perfil Google e colocar as placas nos sítios certos. A Steevanz trata da gravação e dos testes; do seu lado, basta confirmar os dados e escolher os locais.",
          },
          { type: "h2", id: "obter-link-avaliacao", text: "Obter o link de avaliação" },
          {
            type: "p",
            text: "Existem duas formas fiáveis de obter o link. Pode enviar-nos qualquer uma delas, ou simplesmente dar-nos acesso de gestor ao perfil e nós tratamos do resto.",
          },
          {
            type: "steps",
            items: [
              {
                title: "Abrir o Perfil da Empresa",
                body: "Inicie sessão na conta Google que gere o negócio e pesquise o nome da empresa no Google ou no Google Maps. O painel de gestão do perfil aparece no topo dos resultados.",
              },
              {
                title: "Escolher \"Pedir avaliações\"",
                body: "No painel do perfil, clique em **Pedir avaliações** (em inglês, \"Ask for reviews\"). O Google mostra uma janela com um link curto para partilhar.",
              },
              {
                title: "Copiar o link",
                body: "Copie o link apresentado. Tem normalmente o formato `g.page/r/.../review`. Envie-o à Steevanz por WhatsApp ou email.",
              },
              {
                title: "Confirmar com um teste",
                body: "Abra o link num telemóvel com sessão iniciada numa conta Google pessoal. Deve abrir diretamente a janela de avaliação do seu negócio.",
              },
            ],
          },
          {
            type: "code",
            label: "Formato do link curto do Google",
            code: "https://g.page/r/XXXXXXXXXXXXXXX/review",
          },
          { type: "h3", id: "alternativa-place-id", text: "Alternativa: link com Place ID" },
          {
            type: "p",
            text: "Cada negócio no Google Maps tem um identificador único, o **Place ID**. Pode encontrá-lo com a ferramenta pública Place ID Finder da Google, pesquisando o nome e a morada do estabelecimento. Com esse identificador, o link de avaliação fica assim:",
          },
          {
            type: "code",
            label: "Link de avaliação com Place ID",
            code: "https://search.google.com/local/writereview?placeid=PLACE_ID",
          },
          {
            type: "callout",
            tone: "warning",
            title: "Confirme que é o negócio certo",
            text: "Se houver perfis duplicados ou uma loja com nome parecido na mesma rua, é fácil copiar o Place ID errado. Verifique sempre que a janela de avaliação mostra o nome e a morada corretos.",
          },
          { type: "h2", id: "escolher-local", text: "Escolher o local de cada placa" },
          {
            type: "p",
            text: "A regra de ouro é simples: a placa deve estar onde o cliente já tem o telemóvel na mão e alguns segundos livres.",
          },
          {
            type: "ul",
            items: [
              "**Balcão**: perto do terminal de pagamento, mas **não por cima** dele. Os terminais de cartão emitem o seu próprio campo NFC e podem interferir com a leitura.",
              "**Mesas**: um suporte por mesa, virado para o cliente. É o momento ideal, enquanto espera pela conta.",
              "**Parede**: à altura dos olhos (cerca de 1,40 m a 1,60 m do chão), junto à saída ou na sala de espera.",
              "**Autocolantes**: em menus, na capa da conta ou no espelho de um salão de cabeleireiro.",
            ],
          },
          {
            type: "callout",
            tone: "warning",
            title: "Superfícies metálicas",
            text: "O metal bloqueia o sinal NFC. Se precisar de colar uma placa ou autocolante numa superfície metálica (balcão de inox, frigorífico, porta metálica), peça-nos a versão com **chip anti-metal**, que tem uma camada de ferrite isolante.",
          },
          { type: "h2", id: "testar-instalacao", text: "Testar depois de instalar" },
          {
            type: "p",
            text: "Depois de colocar cada placa no sítio definitivo, teste-a com pelo menos um iPhone e um Android. Aproxime o telemóvel devagar, com o ecrã desbloqueado, e confirme que abre a janela de avaliação correta. Teste também o código QR com a câmara. Se algo falhar, veja a página de [resolução de problemas](/docs/placas-nfc-google-reviews/resolucao-problemas).",
          },
        ],
      },
      en: {
        title: "Setting up your NFC Google review plates",
        description:
          "How to get your Google Business Profile review link, check the Place ID and choose the best spot for each NFC review plate in your business premises.",
        blocks: [
          {
            type: "p",
            text: "Setup has two parts: getting the correct review link from your Google profile and putting the plates in the right places. Steevanz writes and tests the chips; on your side, you just confirm the details and choose the spots.",
          },
          { type: "h2", id: "get-review-link", text: "Getting your review link" },
          {
            type: "p",
            text: "There are two reliable ways to get the link. You can send us either one, or simply give us manager access to your profile and we'll handle the rest.",
          },
          {
            type: "steps",
            items: [
              {
                title: "Open your Business Profile",
                body: "Sign in to the Google account that manages the business and search for your business name on Google or Google Maps. The profile management panel appears at the top of the results.",
              },
              {
                title: "Choose \"Ask for reviews\"",
                body: "In the profile panel, click **Ask for reviews**. Google shows a window with a short link to share.",
              },
              {
                title: "Copy the link",
                body: "Copy the link shown. It usually looks like `g.page/r/.../review`. Send it to Steevanz via WhatsApp or email.",
              },
              {
                title: "Check it with a test",
                body: "Open the link on a phone signed in to a personal Google account. It should open your business's review window directly.",
              },
            ],
          },
          {
            type: "code",
            label: "Google short link format",
            code: "https://g.page/r/XXXXXXXXXXXXXXX/review",
          },
          { type: "h3", id: "place-id-alternative", text: "Alternative: Place ID link" },
          {
            type: "p",
            text: "Every business on Google Maps has a unique identifier called a **Place ID**. You can find it with Google's public Place ID Finder tool by searching for your business name and address. With that identifier, the review link looks like this:",
          },
          {
            type: "code",
            label: "Review link with Place ID",
            code: "https://search.google.com/local/writereview?placeid=PLACE_ID",
          },
          {
            type: "callout",
            tone: "warning",
            title: "Make sure it's the right business",
            text: "If there are duplicate listings or a similarly named shop on the same street, it's easy to copy the wrong Place ID. Always check the review window shows the correct name and address.",
          },
          { type: "h2", id: "choose-placement", text: "Choosing where each plate goes" },
          {
            type: "p",
            text: "The golden rule is simple: put the plate where customers already have their phone in hand and a few spare seconds.",
          },
          {
            type: "ul",
            items: [
              "**Counter**: near the card terminal, but **not on top of it**. Card terminals generate their own NFC field and can interfere with reading.",
              "**Tables**: one stand per table, facing the customer. It's the perfect moment, while they wait for the bill.",
              "**Wall**: at eye level (roughly 1.40 m to 1.60 m from the floor), by the exit or in the waiting room.",
              "**Stickers**: on menus, bill folders or a salon mirror.",
            ],
          },
          {
            type: "callout",
            tone: "warning",
            title: "Metal surfaces",
            text: "Metal blocks the NFC signal. If you need to mount a plate or sticker on metal (a stainless steel counter, a fridge, a metal door), ask us for the **anti-metal chip** version, which has an insulating ferrite layer.",
          },
          { type: "h2", id: "test-installation", text: "Testing after installation" },
          {
            type: "p",
            text: "Once each plate is in its final spot, test it with at least one iPhone and one Android phone. Bring the phone in slowly, screen unlocked, and check the correct review window opens. Test the QR code with the camera too. If anything fails, see the [troubleshooting](/en/docs/nfc-google-review-plates/troubleshooting) page.",
          },
        ],
      },
    },
    configuration: {
      pt: {
        title: "Configuração: chips, redirecionamento e destino",
        description:
          "Como a Steevanz grava e bloqueia os chips NFC, porque usamos um redirecionamento e como alterar o destino das placas sem ter de as reimprimir.",
        blocks: [
          {
            type: "p",
            text: "Todas as placas saem das nossas mãos já configuradas. Esta página explica o que fazemos por trás e o que pode pedir-nos para alterar mais tarde.",
          },
          { type: "h2", id: "gravacao-bloqueio", text: "Gravação e bloqueio dos chips" },
          {
            type: "p",
            text: "Cada chip NFC é gravado com um único registo: o endereço do redirecionamento da Steevanz. Depois de gravado e testado, o chip é **bloqueado permanentemente** (protegido contra escrita).",
          },
          {
            type: "ul",
            items: [
              "Ninguém consegue reescrever a placa com uma aplicação de NFC, nem por brincadeira nem por má intenção.",
              "O bloqueio é irreversível: o conteúdo gravado no chip nunca mais muda.",
              "Mesmo assim, o destino final pode ser alterado, porque o chip aponta para o nosso redirecionamento e não diretamente para o Google.",
            ],
          },
          {
            type: "callout",
            tone: "info",
            title: "Porque isto importa",
            text: "Um chip desbloqueado num local público pode ser reprogramado por qualquer pessoa com um telemóvel Android e uma aplicação gratuita, passando a enviar os seus clientes para outro sítio. Por isso nunca entregamos placas desbloqueadas.",
          },
          { type: "h2", id: "redirecionamento-dinamico", text: "Redirecionamento dinâmico" },
          {
            type: "p",
            text: "O chip e o código QR apontam para um link curto da Steevanz. Quando alguém toca na placa, o nosso servidor encaminha-o de imediato para o link de avaliação do seu perfil. O cliente não nota diferença: o encaminhamento demora uma fração de segundo.",
          },
          {
            type: "p",
            text: "Esta arquitetura tem três vantagens práticas: pode mudar o destino sem trocar placas, podemos corrigir problemas rapidamente e é possível contar quantas vezes cada placa foi usada.",
          },
          { type: "h2", id: "alterar-destino", text: "Alterar o destino das placas" },
          {
            type: "p",
            text: "Há situações em que o link de avaliação muda: mudança de morada, fusão de perfis duplicados, novo perfil após uma suspensão, ou simplesmente a decisão de encaminhar uma placa para outra filial.",
          },
          {
            type: "steps",
            items: [
              {
                title: "Obter o novo link",
                body: "Siga os passos da página de [instalação](/docs/placas-nfc-google-reviews/instalacao) para obter o novo link de avaliação.",
              },
              {
                title: "Enviar-nos o pedido",
                body: "Envie o novo link por WhatsApp ou email, indicando que placas devem ser atualizadas (todas, ou só as de uma determinada loja).",
              },
              {
                title: "Confirmar o teste",
                body: "Atualizamos o redirecionamento e avisamos quando estiver ativo. Toque numa placa para confirmar.",
              },
            ],
          },
          { type: "h2", id: "varias-lojas", text: "Várias lojas ou vários perfis" },
          {
            type: "p",
            text: "Se tem mais do que um estabelecimento, cada loja tem o seu próprio perfil Google e, por isso, o seu próprio link. Identificamos as placas por loja para que nunca haja trocas: as avaliações do Porto não vão parar ao perfil de Lisboa.",
          },
          {
            type: "callout",
            tone: "tip",
            text: "Ao mudar placas de uma loja para outra, avise-nos antes. Basta uma mensagem para atualizarmos o destino.",
          },
        ],
      },
      en: {
        title: "Configuration: chips, redirects and destination",
        description:
          "How Steevanz writes and locks your NFC chips, why we use a redirect link and how to change where your plates point without having to reprint them.",
        blocks: [
          {
            type: "p",
            text: "Every plate leaves us fully configured. This page explains what we do behind the scenes and what you can ask us to change later.",
          },
          { type: "h2", id: "writing-locking", text: "Writing and locking the chips" },
          {
            type: "p",
            text: "Each NFC chip is written with a single record: the Steevanz redirect address. Once written and tested, the chip is **permanently locked** (write-protected).",
          },
          {
            type: "ul",
            items: [
              "Nobody can rewrite the plate with an NFC app, whether as a prank or with bad intent.",
              "Locking is irreversible: the content stored on the chip never changes again.",
              "The final destination can still be changed, because the chip points to our redirect rather than straight to Google.",
            ],
          },
          {
            type: "callout",
            tone: "info",
            title: "Why this matters",
            text: "An unlocked chip in a public place can be reprogrammed by anyone with an Android phone and a free app, sending your customers somewhere else. That's why we never hand over unlocked plates.",
          },
          { type: "h2", id: "dynamic-redirect", text: "Dynamic redirect" },
          {
            type: "p",
            text: "The chip and the QR code point to a Steevanz short link. When someone taps the plate, our server immediately forwards them to your profile's review link. The customer won't notice: the redirect takes a fraction of a second.",
          },
          {
            type: "p",
            text: "This setup has three practical benefits: you can change the destination without swapping plates, we can fix problems quickly, and we can count how many times each plate has been used.",
          },
          { type: "h2", id: "change-destination", text: "Changing where your plates point" },
          {
            type: "p",
            text: "Sometimes your review link changes: a move to a new address, merging duplicate listings, a new profile after a suspension, or simply deciding to point a plate at another branch.",
          },
          {
            type: "steps",
            items: [
              {
                title: "Get the new link",
                body: "Follow the steps on the [setup](/en/docs/nfc-google-review-plates/setup) page to get your new review link.",
              },
              {
                title: "Send us the request",
                body: "Send the new link via WhatsApp or email, saying which plates should be updated (all of them, or only those at a given location).",
              },
              {
                title: "Confirm with a test",
                body: "We update the redirect and let you know when it's live. Tap a plate to confirm.",
              },
            ],
          },
          { type: "h2", id: "multiple-locations", text: "Multiple locations or profiles" },
          {
            type: "p",
            text: "If you have more than one location, each has its own Google profile and therefore its own link. We tag plates by location so nothing gets mixed up: reviews for your Porto shop never end up on your Lisbon profile.",
          },
          {
            type: "callout",
            tone: "tip",
            text: "If you move plates from one location to another, let us know first. A quick message is all it takes for us to update the destination.",
          },
        ],
      },
    },
    usage: {
      pt: {
        title: "Utilização: como pedir avaliações todos os dias",
        description:
          "Guia prático para a sua equipa pedir avaliações no Google com as placas NFC, respeitando as regras do Google, e manter as placas limpas e funcionais.",
        blocks: [
          {
            type: "p",
            text: "Uma placa no balcão ajuda, mas o que realmente faz crescer o número de avaliações é a equipa pedir, com naturalidade, a todos os clientes. Esta página reúne boas práticas simples para o dia a dia.",
          },
          { type: "h2", id: "guiao-equipa", text: "Guião para a equipa" },
          {
            type: "p",
            text: "Não é preciso decorar nada. O importante é pedir no momento certo (no fim do serviço, ao pagar ou à saída) e mostrar a placa.",
          },
          {
            type: "ul",
            items: [
              "\"Se tiver um minuto, ajudava-nos muito deixar uma avaliação no Google. É só aproximar o telemóvel desta placa.\"",
              "\"A sua opinião conta. Basta encostar o telemóvel aqui, ou ler o código com a câmara.\"",
              "\"Se o NFC não funcionar, aponte a câmara para o QR, que abre logo a página.\"",
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "Mostre como se faz. Muitas pessoas nunca usaram NFC; se a pessoa da equipa demonstrar com o próprio telemóvel na primeira semana, a taxa de utilização sobe claramente.",
          },
          { type: "h2", id: "regras-google", text: "Regras do Google que tem de cumprir" },
          {
            type: "p",
            text: "O Google tem políticas claras sobre conteúdo de avaliações. Ignorá-las pode levar à remoção de avaliações ou a restrições no perfil.",
          },
          {
            type: "ul",
            items: [
              "**Não ofereça incentivos**: descontos, ofertas, sorteios ou brindes em troca de avaliações são proibidos, mesmo que peça uma avaliação \"honesta\".",
              "**Não faça seleção de avaliações** (review gating): peça a todos os clientes, não apenas aos que parecem satisfeitos.",
              "**Não escreva avaliações** em nome de clientes nem peça à equipa ou à família para avaliar.",
              "**Não pressione**: o pedido deve ser simpático e opcional.",
            ],
          },
          {
            type: "callout",
            tone: "warning",
            title: "Avaliações negativas fazem parte",
            text: "Pedir a todos significa receber também algumas críticas. É normal e dá credibilidade ao perfil. Responda com calma e profissionalismo; um perfil com respostas cuidadas inspira mais confiança do que um perfil perfeito.",
          },
          { type: "h2", id: "momentos-certos", text: "Os melhores momentos para pedir" },
          {
            type: "table",
            head: ["Tipo de negócio", "Momento sugerido"],
            rows: [
              ["Restaurante ou café", "Ao entregar a conta ou ao pagar"],
              ["Cabeleireiro ou estética", "Ao terminar, quando o cliente vê o resultado ao espelho"],
              ["Clínica", "Na receção, ao marcar a próxima consulta"],
              ["Loja", "Ao embalar a compra, junto à caixa"],
            ],
          },
          { type: "h2", id: "limpeza-manutencao", text: "Limpeza e manutenção" },
          {
            type: "ul",
            items: [
              "Limpe o acrílico com um pano de microfibra macio e água com um pouco de detergente neutro.",
              "Evite álcool, lixívia, acetona e produtos abrasivos: riscam e tornam o acrílico baço.",
              "Não mergulhe as placas em água nem as lave na máquina.",
              "Verifique de vez em quando se o código QR continua nítido e sem riscos.",
            ],
          },
          { type: "h2", id: "acompanhar-resultados", text: "Acompanhar resultados" },
          {
            type: "p",
            text: "Compare o número de avaliações do seu perfil Google mês a mês. Se tiver também o serviço de [gestão de reviews com IA](/produtos/gestao-reviews-ia), as respostas às novas avaliações ficam tratadas automaticamente, com a sua aprovação.",
          },
        ],
      },
      en: {
        title: "Usage: asking for reviews every day",
        description:
          "A practical guide for your team to ask for Google reviews with NFC plates while following Google's rules, and to keep your plates clean and working.",
        blocks: [
          {
            type: "p",
            text: "A plate on the counter helps, but what really grows your review count is your team asking every customer, naturally. This page collects simple good practice for day-to-day use.",
          },
          { type: "h2", id: "staff-script", text: "A script for your team" },
          {
            type: "p",
            text: "There's nothing to memorise. What matters is asking at the right moment (at the end of the service, when paying or on the way out) and pointing to the plate.",
          },
          {
            type: "ul",
            items: [
              "\"If you have a minute, a Google review would really help us. Just tap your phone on this plate.\"",
              "\"Your opinion counts. Just hold your phone here, or scan the code with your camera.\"",
              "\"If the tap doesn't work, point your camera at the QR code and it'll open straight away.\"",
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "Show them how. Many people have never used NFC; if staff demonstrate with their own phone in the first week, usage goes up noticeably.",
          },
          { type: "h2", id: "google-rules", text: "Google rules you must follow" },
          {
            type: "p",
            text: "Google has clear policies on review content. Ignoring them can lead to reviews being removed or restrictions on your profile.",
          },
          {
            type: "ul",
            items: [
              "**Don't offer incentives**: discounts, freebies, prize draws or gifts in exchange for reviews are forbidden, even if you ask for an \"honest\" review.",
              "**Don't gate reviews**: ask every customer, not just the ones who seem happy.",
              "**Don't write reviews** on behalf of customers or ask staff or family to review you.",
              "**Don't pressure people**: the request should be friendly and optional.",
            ],
          },
          {
            type: "callout",
            tone: "warning",
            title: "Negative reviews are part of it",
            text: "Asking everyone means you'll also get some criticism. That's normal and adds credibility. Reply calmly and professionally; a profile with thoughtful replies inspires more trust than a perfect one.",
          },
          { type: "h2", id: "best-moments", text: "The best moments to ask" },
          {
            type: "table",
            head: ["Type of business", "Suggested moment"],
            rows: [
              ["Restaurant or café", "When bringing the bill or taking payment"],
              ["Hair or beauty salon", "At the end, when the client sees the result in the mirror"],
              ["Clinic", "At reception, when booking the next appointment"],
              ["Shop", "While bagging the purchase at the till"],
            ],
          },
          { type: "h2", id: "cleaning-care", text: "Cleaning and care" },
          {
            type: "ul",
            items: [
              "Clean the acrylic with a soft microfibre cloth and water with a little mild detergent.",
              "Avoid alcohol, bleach, acetone and abrasive products: they scratch and cloud the acrylic.",
              "Don't soak plates in water or put them in a dishwasher.",
              "Check every so often that the QR code is still sharp and unscratched.",
            ],
          },
          { type: "h2", id: "track-results", text: "Tracking results" },
          {
            type: "p",
            text: "Compare the number of reviews on your Google profile month by month. If you also use our [AI review management](/en/products/ai-review-management) service, replies to new reviews are handled automatically, with your approval.",
          },
        ],
      },
    },
    troubleshooting: {
      pt: {
        title: "Resolução de problemas das placas NFC",
        description:
          "O que fazer quando uma placa NFC não abre a página de avaliação: compatibilidade de telemóveis, capas, metal, links alterados e perfis Google suspensos.",
        blocks: [
          {
            type: "p",
            text: "Quase todos os problemas com placas NFC têm uma causa simples. Siga esta página por ordem antes de nos contactar; se o problema continuar, fale connosco pelo [contacto](/contacto) ou por WhatsApp.",
          },
          { type: "h2", id: "compatibilidade-telemoveis", text: "Compatibilidade dos telemóveis" },
          {
            type: "table",
            head: ["Telemóvel", "Como ler a placa"],
            rows: [
              ["iPhone XS e mais recentes", "Leitura automática em segundo plano, com o ecrã ligado e desbloqueado"],
              ["iPhone 7, 8 e X", "Abrir a Central de Controlo e tocar em \"Leitor de etiquetas NFC\" (pode ser preciso adicioná-lo em Definições)"],
              ["iPhone 6 ou anterior", "Sem leitura NFC: usar o código QR"],
              ["Android com NFC", "Ativar o NFC nas definições; aproximar a zona superior ou central da parte de trás"],
              ["Android sem NFC", "Usar o código QR com a câmara"],
            ],
          },
          {
            type: "callout",
            tone: "info",
            text: "A posição da antena NFC varia entre modelos. Na maioria dos iPhones fica no topo; em muitos Android fica a meio das costas. Se não reagir, deslize o telemóvel devagar sobre a placa.",
          },
          { type: "h2", id: "placa-nao-reage", text: "A placa não reage" },
          {
            type: "ol",
            items: [
              "Confirme que o ecrã está ligado e desbloqueado.",
              "No Android, confirme que o NFC está ativo nas definições (normalmente em \"Ligações\" ou \"Dispositivos ligados\").",
              "Retire acessórios espessos: capas metálicas, capas-carteira com cartões e popsockets interferem com o sinal. Capas finas comuns não costumam ser problema.",
              "Mantenha o telemóvel encostado 1 a 2 segundos, sem movimentos bruscos.",
              "Teste com outro telemóvel. Se funcionar noutro, o problema está no primeiro aparelho.",
            ],
          },
          { type: "h3", id: "interferencia-local", text: "Interferência no local" },
          {
            type: "p",
            text: "Se a placa deixou de funcionar depois de mudar de sítio, verifique se está sobre metal ou encostada ao terminal de pagamento. Afaste-a uns centímetros e teste de novo. Em superfícies metálicas, é necessária a versão anti-metal.",
          },
          { type: "h2", id: "abre-pagina-errada", text: "Abre uma página errada ou um erro" },
          {
            type: "ul",
            items: [
              "**Abre o perfil mas não a janela de avaliação**: alguns navegadores abrem primeiro a ficha do negócio. O cliente pode tocar em \"Escrever uma avaliação\". Se acontecer sempre, avise-nos para revermos o link.",
              "**Pede para iniciar sessão**: o Google exige uma conta para publicar avaliações. É um comportamento normal.",
              "**Mostra outro negócio**: o link ou o Place ID está errado. Contacte-nos para corrigir o redirecionamento.",
              "**Página de erro**: pode ser uma falha momentânea de rede. Se persistir, contacte-nos.",
            ],
          },
          { type: "h2", id: "perfil-suspenso", text: "Perfil suspenso ou link alterado" },
          {
            type: "p",
            text: "Se o Google suspender o seu Perfil da Empresa, o formulário de avaliação deixa de estar disponível e as placas deixam de funcionar como esperado. Nesse caso:",
          },
          {
            type: "steps",
            items: [
              {
                title: "Resolver a suspensão com o Google",
                body: "Siga as instruções do Google para pedir a reintegração do perfil. A Steevanz não consegue intervir neste processo.",
              },
              {
                title: "Avisar a Steevanz",
                body: "Enquanto o perfil estiver suspenso, podemos encaminhar temporariamente as placas para outra página, como o seu site ou Instagram.",
              },
              {
                title: "Atualizar o destino",
                body: "Quando o perfil voltar (ou se for criado um novo), envie-nos o link de avaliação e atualizamos todas as placas, sem reimprimir nada.",
              },
            ],
          },
          { type: "h2", id: "danos-fisicos", text: "Danos físicos" },
          {
            type: "p",
            text: "Uma placa partida, dobrada ou com o QR ilegível pode ter o chip danificado. Envie-nos uma fotografia e tratamos da substituição.",
          },
        ],
      },
      en: {
        title: "Troubleshooting NFC review plates",
        description:
          "What to do when an NFC plate won't open the review page: phone compatibility, phone cases, metal surfaces, changed links and suspended Google profiles.",
        blocks: [
          {
            type: "p",
            text: "Almost every NFC plate problem has a simple cause. Work through this page in order before getting in touch; if the problem persists, [contact us](/en/contact) or message us on WhatsApp.",
          },
          { type: "h2", id: "phone-compatibility", text: "Phone compatibility" },
          {
            type: "table",
            head: ["Phone", "How to read the plate"],
            rows: [
              ["iPhone XS and newer", "Reads automatically in the background, with the screen on and unlocked"],
              ["iPhone 7, 8 and X", "Open Control Centre and tap \"NFC Tag Reader\" (you may need to add it in Settings first)"],
              ["iPhone 6 or older", "No NFC reading: use the QR code"],
              ["Android with NFC", "Turn NFC on in settings; hold the top or middle of the back of the phone to the plate"],
              ["Android without NFC", "Use the QR code with the camera"],
            ],
          },
          {
            type: "callout",
            tone: "info",
            text: "The NFC antenna position varies between models. On most iPhones it's at the top; on many Android phones it's in the middle of the back. If nothing happens, slide the phone slowly over the plate.",
          },
          { type: "h2", id: "plate-not-responding", text: "The plate doesn't respond" },
          {
            type: "ol",
            items: [
              "Check the screen is on and unlocked.",
              "On Android, check NFC is enabled in settings (usually under \"Connections\" or \"Connected devices\").",
              "Remove bulky accessories: metal cases, wallet cases holding cards and popsockets interfere with the signal. Ordinary thin cases are usually fine.",
              "Hold the phone against the plate for 1 to 2 seconds without moving it around.",
              "Try another phone. If it works there, the issue is with the first device.",
            ],
          },
          { type: "h3", id: "local-interference", text: "Interference on site" },
          {
            type: "p",
            text: "If the plate stopped working after being moved, check whether it's sitting on metal or right against the card terminal. Move it a few centimetres away and test again. On metal surfaces you'll need the anti-metal version.",
          },
          { type: "h2", id: "wrong-page", text: "It opens the wrong page or an error" },
          {
            type: "ul",
            items: [
              "**Opens the listing but not the review window**: some browsers show the business listing first. The customer can tap \"Write a review\". If it always happens, let us know so we can check the link.",
              "**Asks to sign in**: Google requires an account to post reviews. This is normal.",
              "**Shows another business**: the link or Place ID is wrong. Contact us and we'll fix the redirect.",
              "**Error page**: it may be a temporary network glitch. If it persists, get in touch.",
            ],
          },
          { type: "h2", id: "suspended-profile", text: "Suspended profile or changed link" },
          {
            type: "p",
            text: "If Google suspends your Business Profile, the review form becomes unavailable and the plates stop working as expected. In that case:",
          },
          {
            type: "steps",
            items: [
              {
                title: "Resolve the suspension with Google",
                body: "Follow Google's instructions to request reinstatement. Steevanz can't intervene in that process.",
              },
              {
                title: "Let Steevanz know",
                body: "While the profile is suspended, we can temporarily point your plates to another page, such as your website or Instagram.",
              },
              {
                title: "Update the destination",
                body: "Once the profile is back (or a new one is created), send us the review link and we'll update every plate, with no reprinting.",
              },
            ],
          },
          { type: "h2", id: "physical-damage", text: "Physical damage" },
          {
            type: "p",
            text: "A broken or bent plate, or one with an unreadable QR code, may have a damaged chip. Send us a photo and we'll arrange a replacement.",
          },
        ],
      },
    },
    faq: {
      pt: {
        title: "Perguntas frequentes sobre placas NFC Google Reviews",
        description:
          "Respostas às dúvidas mais comuns sobre placas NFC para avaliações Google: compatibilidade, regras do Google, alterações de link, limpeza e substituição.",
        blocks: [
          { type: "h2", id: "perguntas", text: "Perguntas frequentes" },
          {
            type: "faq",
            items: [
              {
                q: "O cliente precisa de instalar alguma aplicação?",
                a: "Não. O NFC está integrado na maioria dos telemóveis recentes e o código QR funciona com a câmara. O formulário abre no navegador ou na aplicação Google Maps.",
              },
              {
                q: "Funciona em todos os iPhones?",
                a: "Do iPhone XS em diante, a leitura é automática com o ecrã desbloqueado. Nos iPhone 7, 8 e X é preciso usar o \"Leitor de etiquetas NFC\" na Central de Controlo. Em modelos mais antigos, use o código QR.",
              },
              {
                q: "A Steevanz tem alguma ligação à Google?",
                a: "Não. A Steevanz é uma empresa independente. As placas apenas encaminham os clientes para o formulário público de avaliação do seu Perfil da Empresa no Google.",
              },
              {
                q: "Posso oferecer um desconto a quem deixar avaliação?",
                a: "Não. As políticas do Google proíbem incentivos em troca de avaliações, mesmo que a avaliação seja honesta. Peça a todos os clientes, sem contrapartidas.",
              },
              {
                q: "Posso pedir avaliações só aos clientes satisfeitos?",
                a: "Não deve. Pedir seletivamente (review gating) vai contra as regras do Google. Peça a todos; as críticas ocasionais tornam o perfil mais credível.",
              },
              {
                q: "Alguém pode reprogramar a minha placa?",
                a: "Não. Bloqueamos todos os chips após a gravação, por isso não podem ser reescritos com aplicações NFC.",
              },
              {
                q: "Se mudar de morada ou de perfil, tenho de comprar placas novas?",
                a: "Não. O chip aponta para um redirecionamento gerido pela Steevanz. Basta enviar-nos o novo link e atualizamos o destino de todas as placas. Veja a página de [configuração](/docs/placas-nfc-google-reviews/configuracao).",
              },
              {
                q: "Posso colocar uma placa numa superfície metálica?",
                a: "Sim, mas precisa da versão com chip anti-metal. Uma placa normal sobre metal pode não ser lida. Diga-nos onde a vai instalar quando fizer a encomenda.",
              },
              {
                q: "Como limpo as placas?",
                a: "Com um pano de microfibra e água com detergente neutro. Evite álcool, lixívia e produtos abrasivos, que riscam o acrílico.",
              },
              {
                q: "E se uma placa se partir?",
                a: "Envie-nos uma fotografia pelo [contacto](/contacto) ou por WhatsApp e tratamos da substituição.",
              },
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "Não encontrou a resposta? [Agende uma demonstração](/agendar) e esclarecemos tudo consigo.",
          },
        ],
      },
      en: {
        title: "NFC Google review plates FAQ",
        description:
          "Answers to the most common questions about NFC Google review plates: phone compatibility, Google's rules, link changes, cleaning and replacements.",
        blocks: [
          { type: "h2", id: "questions", text: "Frequently asked questions" },
          {
            type: "faq",
            items: [
              {
                q: "Do customers need to install an app?",
                a: "No. NFC is built into most recent phones and the QR code works with the camera. The review form opens in the browser or in the Google Maps app.",
              },
              {
                q: "Does it work on every iPhone?",
                a: "From iPhone XS onwards, reading is automatic with the screen unlocked. On iPhone 7, 8 and X you need the \"NFC Tag Reader\" in Control Centre. On older models, use the QR code.",
              },
              {
                q: "Is Steevanz connected to Google?",
                a: "No. Steevanz is an independent company. The plates simply send customers to the public review form of your Google Business Profile.",
              },
              {
                q: "Can I offer a discount to customers who leave a review?",
                a: "No. Google's policies forbid incentives in exchange for reviews, even honest ones. Ask every customer, with nothing in return.",
              },
              {
                q: "Can I only ask happy customers?",
                a: "You shouldn't. Selective asking (review gating) breaks Google's rules. Ask everyone; the occasional criticism makes your profile more credible.",
              },
              {
                q: "Can someone reprogram my plate?",
                a: "No. We lock every chip after writing it, so it can't be rewritten with NFC apps.",
              },
              {
                q: "If I move or change profile, do I need new plates?",
                a: "No. The chip points to a redirect managed by Steevanz. Just send us the new link and we'll update every plate. See the [configuration](/en/docs/nfc-google-review-plates/configuration) page.",
              },
              {
                q: "Can I put a plate on a metal surface?",
                a: "Yes, but you need the anti-metal chip version. A standard plate on metal may not be read. Tell us where it's going when you order.",
              },
              {
                q: "How do I clean the plates?",
                a: "With a microfibre cloth and water with mild detergent. Avoid alcohol, bleach and abrasive products, which scratch the acrylic.",
              },
              {
                q: "What if a plate breaks?",
                a: "Send us a photo via our [contact page](/en/contact) or WhatsApp and we'll arrange a replacement.",
              },
            ],
          },
          {
            type: "callout",
            tone: "tip",
            text: "Didn't find your answer? [Book a demo](/en/book-a-demo) and we'll talk it through with you.",
          },
        ],
      },
    },
  },
};
