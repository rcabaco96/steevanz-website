import type { DocPageContent, DocPageId } from "../types";

export const pt: Record<DocPageId, DocPageContent> = {
  "getting-started": {
    title: "Primeiros passos com o cardápio digital NFC",
    description:
      "Como as placas NFC circulares da Steevanz levam os clientes, à mesa, aos vídeos, fotos e carrosséis dos seus pratos com preço no Instagram ou no YouTube.",
    blocks: [
      {
        type: "p",
        text: "O cardápio digital é uma placa NFC circular e pequena, uma por mesa. O cliente aproxima o telemóvel e abre um destaque do Instagram ou uma playlist do YouTube com os seus pratos, em vídeo, foto ou carrossel, com o preço de cada um. É como folhear o menu, mas a ver a comida de verdade.",
      },
      {
        type: "p",
        text: "Tal como os restantes produtos Steevanz, é um serviço gerido: nós gravamos, testamos e configuramos as placas. Esta documentação ajuda-o a preparar o conteúdo e a tirar partido das placas.",
      },
      { type: "h2", id: "o-que-inclui", text: "O que inclui" },
      {
        type: "table",
        head: ["Item", "Detalhe"],
        rows: [
          ["Placa NFC circular", "Autocolante circular de mesa ou base circular de mesa"],
          ["QR code impresso", "Para telemóveis sem NFC ou com o NFC desligado"],
          ["Configuração", "Ligamos cada placa ao destaque do Instagram ou à playlist do YouTube do cardápio"],
          ["Mudança de destino", "Pode trocar o destaque ou a playlist sem reimprimir as placas"],
        ],
      },
      { type: "h2", id: "precos", text: "Preços" },
      {
        type: "table",
        head: ["Quantidade", "Preço", "Por placa"],
        rows: [
          ["1 placa", "15 €", "15 €"],
          ["Pack de 5", "60 €", "12 €"],
          ["Pack de 10", "100 €", "10 €"],
          ["Pack de 20", "180 €", "9 €"],
        ],
      },
      {
        type: "p",
        text: "O logotipo e as cores do negócio pagam-se uma vez por encomenda (o design faz-se uma vez para todas as placas), não por placa.",
      },
      { type: "h2", id: "como-funciona", text: "Como funciona" },
      {
        type: "ol",
        items: [
          "O cliente senta-se e aproxima o telemóvel da placa (ou lê o QR code).",
          "Abre-se o destaque do Instagram ou a playlist do YouTube com o cardápio.",
          "O cliente vê os pratos com o preço e escolhe com mais confiança.",
        ],
      },
      { type: "h2", id: "proximos-passos", text: "Próximos passos" },
      {
        type: "ul",
        items: [
          "[Instalação](/docs/cardapio-digital-nfc/instalacao): preparar o destaque ou a playlist e colocar as placas.",
          "[Configuração](/docs/cardapio-digital-nfc/configuracao): mudar o destino e manter os preços certos.",
          "[Utilização](/docs/cardapio-digital-nfc/utilizacao): boas práticas para o conteúdo do cardápio.",
        ],
      },
    ],
  },
  setup: {
    title: "Instalação do cardápio digital NFC",
    description: "Prepare o destaque do Instagram ou a playlist do YouTube com o cardápio e coloque as placas nas mesas.",
    blocks: [
      { type: "h2", id: "preparar-conteudo", text: "1. Preparar o conteúdo" },
      {
        type: "p",
        text: "A placa leva a um sítio específico, não ao perfil inteiro: um destaque do Instagram ou uma playlist do YouTube só com o cardápio.",
      },
      { type: "h3", id: "instagram", text: "Instagram: criar um destaque «Menu»" },
      {
        type: "steps",
        items: [
          { title: "Publique os pratos em stories", body: "Um vídeo, foto ou carrossel por prato, com o nome e o preço escritos na imagem." },
          { title: "Crie o destaque", body: "No perfil, toque em «Novo» nos destaques, escolha as stories dos pratos e chame-lhe «Menu» ou «Cardápio»." },
          { title: "Organize por secções", body: "Se o menu for grande, crie um destaque por secção (Entradas, Pratos, Sobremesas, Bebidas)." },
        ],
      },
      { type: "h3", id: "youtube", text: "YouTube: criar uma playlist" },
      {
        type: "steps",
        items: [
          { title: "Publique um vídeo curto por prato", body: "Shorts funcionam bem. Ponha o nome e o preço no título e no próprio vídeo." },
          { title: "Crie a playlist «Menu»", body: "Junte os vídeos pela ordem do cardápio e deixe a playlist pública." },
        ],
      },
      {
        type: "callout",
        tone: "tip",
        title: "Ainda não tem vídeos ou fotos?",
        text: "Trabalhamos com parceiros que criam vídeos, fotos e carrosséis dos pratos. Pedimos orçamento por si e configuramos as placas quando o conteúdo estiver publicado.",
      },
      { type: "h2", id: "enviar-link", text: "2. Enviar-nos o link" },
      {
        type: "p",
        text: "Envie-nos o link do destaque ou da playlist. Gravamos as placas, testamo-las em iPhone e Android e enviamo-las prontas a usar.",
      },
      { type: "h2", id: "colocar-placas", text: "3. Colocar as placas" },
      {
        type: "ul",
        items: [
          "Uma placa por mesa, num sítio visível e ao alcance do telemóvel (centro da mesa ou junto ao porta-guardanapos).",
          "Limpe a superfície antes de colar o autocolante e pressione durante alguns segundos.",
          "Evite superfícies metálicas: o metal pode impedir o NFC de funcionar. Nesse caso, use a base circular de mesa.",
        ],
      },
    ],
  },
  configuration: {
    title: "Configuração do cardápio digital NFC",
    description: "Mude o destino das placas e mantenha os pratos e os preços sempre certos.",
    blocks: [
      { type: "h2", id: "mudar-destino", text: "Mudar o destino" },
      {
        type: "p",
        text: "As placas apontam para um link curto gerido pela Steevanz. Para trocar o destaque ou a playlist (por exemplo, um menu de verão), basta pedir-nos: o destino muda sem reimprimir nada.",
      },
      { type: "h2", id: "precos-atualizados", text: "Manter os preços atualizados" },
      {
        type: "ul",
        items: [
          "Quando um preço mudar, publique a story ou o vídeo novo e retire o antigo do destaque ou da playlist.",
          "Pratos que saem do menu também devem sair do destaque ou da playlist.",
          "Reveja o cardápio digital sempre que mudar o menu em papel.",
        ],
      },
      {
        type: "callout",
        tone: "warning",
        text: "As stories que não estão num destaque desaparecem ao fim de 24 horas. Guarde sempre os pratos no destaque.",
      },
      { type: "h2", id: "personalizacao", text: "Personalização" },
      {
        type: "p",
        text: "As placas podem levar o logotipo e as cores do negócio e um texto curto, por exemplo «Toque para ver o menu». O design faz-se uma vez por encomenda.",
      },
    ],
  },
  usage: {
    title: "Utilização do cardápio digital NFC",
    description: "Boas práticas para que o cardápio digital ajude os clientes a escolher.",
    blocks: [
      { type: "h2", id: "conteudo-que-funciona", text: "Conteúdo que funciona" },
      {
        type: "ul",
        items: [
          "Mostre o prato tal como chega à mesa, com boa luz.",
          "Ponha sempre o nome e o preço na imagem ou no vídeo.",
          "Vídeos curtos (até 15 segundos) prendem mais a atenção do que vídeos longos.",
          "Comece pelos pratos mais pedidos ou pelos que quer vender mais.",
        ],
      },
      { type: "h2", id: "equipa", text: "A equipa" },
      {
        type: "p",
        text: "Diga aos clientes que podem ver os pratos com o telemóvel ao entregar o menu. Um convite da equipa aumenta muito o número de toques.",
      },
      { type: "h2", id: "juntar-reviews", text: "Juntar com as reviews Google" },
      {
        type: "p",
        text: "Na mesma mesa, a placa de reviews Google pede uma avaliação no fim da refeição. O cardápio ajuda a escolher no início; as reviews ajudam novos clientes a encontrá-lo.",
      },
    ],
  },
  troubleshooting: {
    title: "Resolução de problemas do cardápio digital NFC",
    description: "O que fazer quando a placa não abre o cardápio.",
    blocks: [
      {
        type: "table",
        head: ["Problema", "O que fazer"],
        rows: [
          ["O telemóvel não reage ao toque", "Confirme que o NFC está ligado (Android) e encoste o topo do telemóvel ao centro da placa. Em alternativa, leia o QR code."],
          ["Abre o perfil e não o cardápio", "O destaque ou a playlist pode ter sido apagado ou mudado de nome. Envie-nos o link novo."],
          ["A playlist aparece vazia ou privada", "No YouTube, confirme que a playlist e os vídeos estão públicos."],
          ["A placa não funciona sobre metal", "Troque o autocolante pela base circular de mesa."],
          ["Preços desatualizados", "Atualize as stories ou os vídeos: a placa mostra sempre o que estiver publicado."],
        ],
      },
      {
        type: "callout",
        tone: "info",
        text: "Se uma placa avariar, contacte-nos: substituímo-la com o mesmo destino.",
      },
    ],
  },
  faq: {
    title: "Perguntas frequentes sobre o cardápio digital NFC",
    description: "Respostas rápidas sobre as placas de cardápio digital.",
    blocks: [
      {
        type: "faq",
        items: [
          { q: "O cliente precisa de instalar alguma aplicação?", a: "Não. O telemóvel abre o Instagram ou o YouTube; se a aplicação não estiver instalada, abre no navegador." },
          { q: "Funciona em iPhone e Android?", a: "Sim. Os iPhones recentes leem NFC sem fazer nada; no Android o NFC tem de estar ligado. Há sempre o QR code impresso." },
          { q: "Substitui o menu em papel?", a: "Complementa-o. Mostra os pratos em vídeo e foto, o que ajuda a escolher, mas o menu em papel continua útil para quem prefere." },
          { q: "Quanto custa?", a: "15 € por placa, ou packs de 5 por 60 €, 10 por 100 € e 20 por 180 €. O logotipo paga-se uma vez por encomenda." },
          { q: "Vocês criam os vídeos?", a: "Não diretamente: trabalhamos com parceiros que criam vídeos, fotos e carrosséis dos pratos e pedimos orçamento por si." },
          { q: "Posso mudar o destino mais tarde?", a: "Sim, sem reimprimir as placas. Basta enviar-nos o novo destaque ou a nova playlist." },
        ],
      },
    ],
  },
};
