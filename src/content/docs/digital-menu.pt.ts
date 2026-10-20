import type { DocPageContent, DocPageId } from "../types";

export const pt: Record<DocPageId, DocPageContent> = {
  "getting-started": {
    title: "Primeiros passos com o menu digital",
    description:
      "Como funciona o menu em vídeo da Steevanz: um vídeo por prato, com preço, aberto num toque ou pelo QR da placa da mesa, com pedidos à mesa se quiser.",
    blocks: [
      {
        type: "p",
        text: "O menu digital é o menu do seu negócio em vídeo. Cada prato tem o seu vídeo vertical, com nome, preço e descrição, numa página própria do negócio. O cliente abre-o num toque ou pelo QR code da placa circular que está em cada mesa, sem instalar nada.",
      },
      {
        type: "p",
        text: "Tal como os restantes produtos Steevanz, é um serviço gerido: montamos o menu, alojamos os vídeos e gravamos e testamos as placas. Esta documentação ajuda-o a preparar os vídeos e a tirar partido do menu.",
      },
      { type: "h2", id: "o-que-inclui", text: "O que inclui" },
      {
        type: "table",
        head: ["Item", "Detalhe"],
        rows: [
          ["Menu em vídeo", "Página do negócio com o logótipo, coleções e um vídeo vertical por prato, com nome, preço e descrição"],
          ["Pedidos à mesa (opcional)", "A mesa faz o pedido no telemóvel e a equipa confirma-o lendo um QR code"],
          ["Seis idiomas", "Português, inglês, espanhol, francês, alemão e italiano: cada cliente escolhe o seu no botão da bandeira"],
          ["Placa circular", "Autocolante circular de mesa ou base circular de mesa, uma por mesa"],
          ["QR code impresso", "Para telemóveis sem leitura por aproximação ou com essa opção desligada"],
          ["Montagem e alojamento", "Montamos o menu e alojamos o menu e os vídeos"],
          ["Guia de gravação", "Um guia para gravar os vídeos dos pratos com o telemóvel"],
        ],
      },
      { type: "h2", id: "precos", text: "Preços" },
      {
        type: "table",
        head: ["Quantidade", "Preço", "Por placa"],
        rows: [
          ["1 a 9 placas", "20 € cada", "20 €"],
          ["10 placas ou mais", "15 € cada (10 placas: 150 €)", "15 €"],
        ],
      },
      {
        type: "p",
        text: "O logótipo e as cores do negócio pagam-se uma vez por encomenda (o design faz-se uma vez para todas as placas), não por placa. A montagem do menu e o alojamento do menu e dos vídeos custam 30 € por mês (sem IVA).",
      },
      { type: "h2", id: "como-funciona", text: "Como funciona" },
      {
        type: "ol",
        items: [
          "O cliente senta-se e toca com o telemóvel na placa (ou lê o QR code).",
          "O menu abre com uma animação com o logótipo do negócio, no início da página.",
          "Os pratos tocam numa grelha. Um toque abre o ecrã inteiro, como nos Reels, e desliza-se para cima e para baixo para ver os outros.",
          "Com os pedidos à mesa ligados, o cliente toca em «Adicionar» nos pratos e faz o pedido dali mesmo.",
        ],
      },
      { type: "h2", id: "proximos-passos", text: "Próximos passos" },
      {
        type: "ul",
        items: [
          "[Instalação](/docs/menu-digital/instalacao): gravar os vídeos, enviar-nos o menu e colocar as placas.",
          "[Configuração](/docs/menu-digital/configuracao): mudar pratos e preços e ligar os pedidos à mesa.",
          "[Utilização](/docs/menu-digital/utilizacao): vídeos que funcionam e os pedidos à mesa no dia a dia.",
        ],
      },
    ],
  },
  setup: {
    title: "Instalação do menu digital",
    description: "Grave os vídeos dos pratos, envie-nos o menu e coloque as placas nas mesas.",
    blocks: [
      { type: "h2", id: "gravar-videos", text: "1. Gravar os vídeos" },
      {
        type: "p",
        text: "Cada prato tem o seu vídeo. Grave-os com o telemóvel, na vertical: damos-lhe um guia para gravar os vídeos.",
      },
      {
        type: "steps",
        items: [
          { title: "Um vídeo por prato", body: "Na vertical, com o prato tal como chega à mesa." },
          { title: "Sem texto por cima", body: "Não precisa de escrever o nome nem o preço no vídeo: o menu mostra-os por cima." },
          { title: "Curto", body: "Alguns segundos chegam para mostrar o prato. Vídeos curtos prendem mais a atenção." },
        ],
      },
      { type: "h2", id: "enviar-menu", text: "2. Enviar-nos o menu" },
      {
        type: "p",
        text: "Envie-nos os vídeos e, para cada prato, o nome, o preço e uma descrição curta, arrumados pelas coleções que quer (por exemplo Brunch e Bebidas). Mande também o logótipo. Montamos o menu e mostramos-lho antes de o pôr nas mesas.",
      },
      {
        type: "callout",
        tone: "tip",
        title: "Pedidos à mesa",
        text: "Se quiser que as mesas façam o pedido no telemóvel, diga-nos quantas mesas tem. Cada mesa recebe a sua placa, com um link e um QR code próprios.",
      },
      { type: "h2", id: "colocar-placas", text: "3. Colocar as placas" },
      {
        type: "ul",
        items: [
          "Uma placa por mesa, num sítio visível e ao alcance do telemóvel (centro da mesa ou junto ao porta-guardanapos).",
          "Com os pedidos à mesa, cada placa pertence a uma mesa: coloque cada uma na mesa a que corresponde.",
          "Limpe a superfície antes de colar o autocolante e pressione durante alguns segundos.",
          "Evite superfícies metálicas: o metal bloqueia o sinal da placa. Nesse caso, use a base circular de mesa.",
        ],
      },
    ],
  },
  configuration: {
    title: "Configuração do menu digital",
    description: "Mude pratos, preços e coleções, e ligue ou desligue os pedidos à mesa.",
    blocks: [
      { type: "h2", id: "pratos-precos", text: "Mudar pratos e preços" },
      {
        type: "p",
        text: "O menu é gerido pela Steevanz. Para mudar um preço, acrescentar ou tirar um prato, trocar um vídeo ou reorganizar as coleções, envie-nos uma mensagem: atualizamos o menu e as placas continuam iguais.",
      },
      { type: "h2", id: "colecoes", text: "Coleções" },
      {
        type: "p",
        text: "Os pratos arrumam-se em coleções, por exemplo Brunch e Bebidas. Todas aparecem na mesma página, uma secção a seguir à outra, e o botão ☰ leva o cliente diretamente a cada uma.",
      },
      { type: "h2", id: "idiomas", text: "Idiomas" },
      {
        type: "p",
        text: "O menu lê-se em seis idiomas: português, inglês, espanhol, francês, alemão e italiano. Abre no idioma do telemóvel do cliente (ou no que escolheu da última vez) e o botão da bandeira, ao lado do ☰, muda de idioma sem recarregar a página, com os vídeos a tocar. Os botões do menu e os pedidos à mesa já estão traduzidos; os nomes e as descrições dos pratos e os nomes das secções traduzem-se prato a prato, e o que não tiver tradução aparece em português. Os preços aparecem no formato de cada idioma.",
      },
      { type: "h2", id: "pedidos-mesa", text: "Pedidos à mesa" },
      {
        type: "p",
        text: "Os pedidos à mesa ligam-se e desligam-se menu a menu. Sem eles, a placa abre o menu só para ver. Cada mesa tem a sua placa, com um link e um QR code próprios; se precisar de mais mesas, peça-nos.",
      },
      {
        type: "callout",
        tone: "warning",
        text: "Se o código de uma mesa for trocado, o link antigo deixa de funcionar e a placa dessa mesa tem de ser substituída.",
      },
      { type: "h2", id: "personalizacao", text: "Personalização" },
      {
        type: "p",
        text: "O menu leva o logótipo do negócio. As placas podem levar o logótipo e as cores e um texto curto, por exemplo «Toque para ver o menu». O design das placas faz-se uma vez por encomenda.",
      },
    ],
  },
  usage: {
    title: "Utilização do menu digital",
    description: "Boas práticas para que o menu digital ajude os clientes a escolher, e os pedidos à mesa no dia a dia.",
    blocks: [
      { type: "h2", id: "videos-que-funcionam", text: "Vídeos que funcionam" },
      {
        type: "ul",
        items: [
          "Mostre o prato tal como chega à mesa, com boa luz.",
          "Grave sempre na vertical: é assim que o menu mostra os vídeos.",
          "Vídeos curtos prendem mais a atenção do que vídeos longos.",
          "Ponha primeiro os pratos mais pedidos ou os que quer vender mais.",
        ],
      },
      { type: "h2", id: "pedidos-dia-a-dia", text: "Os pedidos à mesa no dia a dia" },
      {
        type: "ol",
        items: [
          "Todos os telemóveis da mesa veem o mesmo pedido em tempo real. Cada pessoa toca em «Adicionar» nos pratos e pode juntar uma nota, como «sem cebola».",
          "Em «Fazer pedido», o telemóvel mostra um QR code e o número do pedido.",
          "O funcionário lê o QR code com a câmara do telemóvel, sem app nem login, e vê a mesa, a hora, os pratos com as notas e o total. Esta página está sempre em português e indica o idioma em que o cliente pediu.",
          "Toca em «Confirmar pedido» e a mesa vê logo «Pedido confirmado ✓».",
        ],
      },
      {
        type: "callout",
        tone: "info",
        text: "Os números dos pedidos recomeçam todos os dias.",
      },
      { type: "h2", id: "equipa", text: "A equipa" },
      {
        type: "p",
        text: "Diga aos clientes que podem ver os pratos com o telemóvel quando se sentam. Um convite da equipa aumenta muito o número de toques.",
      },
      { type: "h2", id: "juntar-reviews", text: "Juntar com as reviews Google" },
      {
        type: "p",
        text: "Na mesma mesa, a placa de reviews Google pede uma avaliação no fim da refeição. O menu digital ajuda a escolher no início; as reviews ajudam novos clientes a encontrá-lo.",
      },
    ],
  },
  troubleshooting: {
    title: "Resolução de problemas do menu digital",
    description: "O que fazer quando a placa não abre o menu ou um pedido não chega.",
    blocks: [
      {
        type: "table",
        head: ["Problema", "O que fazer"],
        rows: [
          ["O telemóvel não reage ao toque", "Confirme que a opção de leitura por aproximação está ligada nas definições de ligações (Android) e encoste o topo do telemóvel ao centro da placa. Em alternativa, leia o QR code."],
          ["A placa abre uma página que não existe", "O código da mesa pode ter sido trocado ou o menu desligado. Contacte-nos."],
          ["Os vídeos demoram a começar", "Confirme a ligação à internet do telemóvel (Wi-Fi ou dados móveis). Se acontecer sempre, avise-nos."],
          ["O funcionário não consegue ler o QR do pedido", "Peça ao cliente para aumentar o brilho do ecrã e aproxime a câmara do código."],
          ["A placa não funciona sobre metal", "Troque o autocolante pela base circular de mesa."],
          ["Preços desatualizados", "Envie-nos os preços novos: atualizamos o menu e as placas ficam iguais."],
        ],
      },
      {
        type: "callout",
        tone: "info",
        text: "Se uma placa avariar, contacte-nos: substituímo-la.",
      },
    ],
  },
  faq: {
    title: "Perguntas frequentes sobre o menu digital",
    description: "Respostas rápidas sobre o menu em vídeo, os pedidos à mesa e as placas.",
    blocks: [
      {
        type: "faq",
        items: [
          { q: "O cliente precisa de instalar alguma aplicação?", a: "Não. O menu abre no navegador do telemóvel. Nem o cliente nem a equipa precisam de app." },
          { q: "Preciso de Instagram ou de YouTube?", a: "Não. O menu tem a sua própria página na Steevanz e os vídeos ficam alojados por nós." },
          { q: "Funciona em iPhone e Android?", a: "Sim. Os iPhones recentes leem a placa sem fazer nada; no Android, a leitura por aproximação tem de estar ligada. Há sempre o QR code impresso." },
          { q: "Substitui o menu em papel?", a: "Complementa-o. Mostra os pratos em vídeo, o que ajuda a escolher, mas o menu em papel continua útil para quem prefere." },
          { q: "Quanto custa?", a: "20 € por placa, ou 15 € por placa a partir de 10 placas. O logótipo paga-se uma vez por encomenda. A montagem e o alojamento do menu custam 30 € por mês (sem IVA)." },
          { q: "Quem grava os vídeos?", a: "Normalmente o próprio negócio, com o telemóvel: damos-lhe um guia para gravar os vídeos. Nós montamos o menu e alojamos os vídeos." },
          { q: "Em que idiomas está o menu?", a: "Em seis: português, inglês, espanhol, francês, alemão e italiano. O menu abre no idioma do telemóvel e o cliente muda-o no botão da bandeira. O que ainda não tiver tradução aparece em português." },
          { q: "Os pedidos à mesa são obrigatórios?", a: "Não. Ligam-se e desligam-se menu a menu. Sem eles, a placa abre o menu só para ver." },
          { q: "Posso mudar o menu mais tarde?", a: "Sim, sem trocar as placas. Envie-nos os pratos, os preços ou os vídeos novos e atualizamos o menu." },
        ],
      },
    ],
  },
};
