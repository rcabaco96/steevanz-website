import type { DocPageContent, DocPageId } from "../types";

export const pt: Record<DocPageId, DocPageContent> = {
  "getting-started": {
    title: "Primeiros passos com o porta-chaves digital",
    description: "O que é o porta-chaves digital, o que pode abrir, quanto custa e como o cliente o usa com um toque do telemóvel.",
    blocks: [
      {
        type: "p",
        text: "O porta-chaves digital é um pequeno porta-chaves para as chaves, ou uma tag sem argola para colar ou pendurar. Com um toque do telemóvel, abre o WhatsApp, o Instagram ou o website do seu negócio. Funciona em iPhone e Android, sem app.",
      },
      {
        type: "p",
        text: "Nós tratamos de tudo: configuramos o destino de cada porta-chaves e testamo-lo em iPhone e Android antes da entrega.",
      },
      { type: "h2", id: "o-que-abre", text: "O que pode abrir" },
      {
        type: "table",
        head: ["Destino", "O que o cliente vê"],
        rows: [
          ["WhatsApp", "Uma conversa com o seu negócio"],
          ["Instagram", "O perfil do seu negócio"],
          ["Website", "O seu site"],
        ],
      },
      { type: "h2", id: "precos", text: "Preços" },
      {
        type: "table",
        head: ["Quantidade", "Preço por unidade", "Total"],
        rows: [
          ["1 unidade", "5 €", "5 €"],
          ["Pack de 10", "4,50 €", "45 €"],
          ["Pack de 25", "4 €", "100 €"],
        ],
      },
      { type: "p", text: "Todos os valores + IVA." },
      { type: "h2", id: "como-funciona", text: "Como funciona para o cliente" },
      {
        type: "ol",
        items: [
          "O cliente aproxima o telemóvel do porta-chaves.",
          "O destino que escolheu abre de imediato.",
          "Não precisa de instalar nenhuma app nem de procurar o seu nome.",
        ],
      },
      {
        type: "callout",
        tone: "info",
        title: "Só com um toque",
        text: "O porta-chaves não tem QR code. Telemóveis muito antigos ou sem leitura por aproximação não o conseguem abrir. Para esses casos, o Cartão de visita digital e as placas têm QR code.",
      },
      { type: "h2", id: "proximos-passos", text: "Próximos passos" },
      {
        type: "ul",
        items: [
          "[Encomenda e entrega](/docs/chaveiro-digital/instalacao): o que nos enviar e o que acontece até receber os porta-chaves.",
          "[Configuração](/docs/chaveiro-digital/configuracao): como escolher entre WhatsApp, Instagram e website.",
          "[Utilização](/docs/chaveiro-digital/utilizacao): a quem oferecer e como explicar ao cliente.",
        ],
      },
    ],
  },
  setup: {
    title: "Encomenda e entrega do porta-chaves digital",
    description: "O que nos enviar para cada destino, como escolher a quantidade e o que fazemos antes da entrega.",
    blocks: [
      { type: "h2", id: "escolher-destino", text: "1. Escolha o destino" },
      {
        type: "p",
        text: "Cada porta-chaves abre um destino. Diga-nos qual e envie-nos o que precisamos (se mais tarde quiser outro, mudamos sem custo):",
      },
      {
        type: "table",
        head: ["Destino", "O que nos enviar"],
        rows: [
          ["WhatsApp", "O número de WhatsApp em que atende os clientes"],
          ["Instagram", "O nome do perfil do seu negócio (o @)"],
          ["Website", "O endereço do site ou da página que quer abrir"],
        ],
      },
      { type: "h2", id: "quantidade", text: "2. Diga-nos quantos" },
      {
        type: "p",
        text: "Há dois formatos, com o mesmo preço: o porta-chaves, com argola, e a tag, sem argola, para colar ou pendurar. Pode encomendar à unidade ou em packs de 10 e de 25. Se quiser falar de personalização, como o seu logótipo, vemos isso consigo na demonstração.",
      },
      { type: "h2", id: "configurar-testar", text: "3. Nós configuramos e testamos" },
      {
        type: "p",
        text: "Configuramos cada porta-chaves com o seu destino e testamo-lo em iPhone e Android antes da entrega. Fica pronto em poucos dias úteis; indicamos o prazo exato na demonstração.",
      },
      {
        type: "callout",
        tone: "tip",
        text: "Quando receber os porta-chaves, experimente um com o seu telemóvel antes de os oferecer.",
      },
    ],
  },
  configuration: {
    title: "Configuração do porta-chaves digital",
    description: "Como escolher entre WhatsApp, Instagram e website, com conselhos para cada destino.",
    blocks: [
      { type: "h2", id: "um-destino", text: "Um destino por porta-chaves" },
      {
        type: "p",
        text: "Cada porta-chaves abre um destino. Escolha o que os seus clientes mais usam para falar consigo. Se um dia quiser mudar, diga-nos: mudamos o destino no nosso painel, sem custo, e o porta-chaves fica igual.",
      },
      { type: "h2", id: "whatsapp", text: "WhatsApp" },
      {
        type: "p",
        text: "Abre uma conversa com o seu negócio. É a escolha natural se marca, reserva ou recebe encomendas por mensagem. Use um número que alguém acompanha durante o dia.",
      },
      { type: "h2", id: "instagram", text: "Instagram" },
      {
        type: "p",
        text: "Abre o perfil do seu negócio. Faz sentido se mostra novidades, trabalhos ou pratos do dia e quer que os clientes o sigam.",
      },
      { type: "h2", id: "website", text: "Website" },
      {
        type: "p",
        text: "Abre o seu site ou uma página à sua escolha. Prefira uma página que funcione bem no telemóvel.",
      },
      {
        type: "callout",
        tone: "info",
        text: "A personalização do porta-chaves, como o seu logótipo, é um tema que vemos consigo na demonstração.",
      },
    ],
  },
  usage: {
    title: "Utilização do porta-chaves digital",
    description: "A quem oferecer o porta-chaves e como explicar ao cliente, numa frase, o que ele faz.",
    blocks: [
      { type: "h2", id: "a-quem-oferecer", text: "A quem oferecer" },
      {
        type: "table",
        head: ["Negócio", "Como usar"],
        rows: [
          ["Cafés, restaurantes, salões e lojas", "Ofereça aos clientes habituais: o seu WhatsApp ou Instagram fica sempre nas chaves deles"],
          ["Alojamento local", "O porta-chaves da chave da casa abre o WhatsApp do anfitrião"],
          ["Imobiliárias", "Entregue o porta-chaves com as chaves da casa nova"],
          ["Equipas, eventos e feiras", "Um brinde útil, que fica nas chaves em vez de ir para o lixo"],
        ],
      },
      { type: "h2", id: "explicar", text: "Explique numa frase" },
      {
        type: "p",
        text: "Ao entregar o porta-chaves, diga por exemplo: «Aproxime o telemóvel deste porta-chaves e fala connosco no WhatsApp.» Mostrar uma vez com o seu telemóvel ajuda.",
      },
      {
        type: "callout",
        tone: "tip",
        text: "Se o cliente tiver Android e não abrir à primeira, diga-lhe para ligar a leitura por aproximação nas definições de ligações.",
      },
    ],
  },
  troubleshooting: {
    title: "Resolução de problemas do porta-chaves digital",
    description: "O que fazer quando o toque não abre nada ou quando um porta-chaves abre o destino errado.",
    blocks: [
      { type: "h2", id: "toque-nao-abre", text: "O toque não abre nada" },
      {
        type: "ul",
        items: [
          "Nos iPhone XS e mais recentes, aproxime o topo do telemóvel do porta-chaves, com o ecrã ligado.",
          "Nos Android, ligue a leitura por aproximação nas definições de ligações.",
          "Se a capa do telemóvel for grossa, experimente sem ela.",
        ],
      },
      {
        type: "callout",
        tone: "warning",
        title: "Não há QR code",
        text: "O porta-chaves funciona só com um toque. Telemóveis muito antigos ou sem leitura por aproximação não o conseguem abrir. Para esses clientes, o Cartão de visita digital e as placas têm QR code.",
      },
      { type: "h2", id: "destino-errado", text: "Abre o destino errado" },
      {
        type: "p",
        text: "Testamos cada porta-chaves antes da entrega. Se algo não estiver certo, fale connosco por WhatsApp ou email, diga-nos o que devia abrir e vemos consigo a solução.",
      },
      { type: "h2", id: "mais-chaveiros", text: "Precisa de mais porta-chaves" },
      {
        type: "p",
        text: "Pode encomendar mais quando quiser, à unidade ou em packs. Fale connosco por WhatsApp ou email.",
      },
    ],
  },
  faq: {
    title: "Perguntas frequentes sobre o porta-chaves digital",
    description: "Respostas rápidas sobre telemóveis compatíveis, QR code, destinos, preços e prazos.",
    blocks: [
      {
        type: "faq",
        items: [
          {
            q: "Funciona em iPhone e em Android?",
            a: "Sim, sem app. Nos iPhone XS e mais recentes, basta aproximar o topo do telemóvel. A maioria dos Android lê-o desde que a leitura por aproximação esteja ligada nas definições de ligações.",
          },
          {
            q: "Tem QR code?",
            a: "Não, funciona só com um toque. Telemóveis muito antigos ou sem leitura por aproximação não o conseguem abrir. Se precisa de QR code, o Cartão de visita digital e as placas têm um.",
          },
          {
            q: "Abre o quê?",
            a: "Um destino por porta-chaves: uma conversa no WhatsApp com o seu negócio, o seu Instagram ou o seu website. Pode mudá-lo mais tarde, sem custo: o porta-chaves guarda um link curto da Steevanz, que nós apontamos para o novo destino no nosso painel. O porta-chaves fica igual.",
          },
          {
            q: "Quanto custa?",
            a: "5 € + IVA cada, com ou sem argola. Em packs, 10 por 45 € e 25 por 100 €, + IVA.",
          },
          {
            q: "Tem de ser com argola?",
            a: "Não. Há dois formatos, com o mesmo preço: o porta-chaves, com argola para as chaves, e a tag, sem argola, para colar ou pendurar (por exemplo, numa montra, num balcão ou numa mala). Escolhe o formato no carrinho.",
          },
          {
            q: "Quanto tempo demora?",
            a: "Poucos dias úteis. Indicamos o prazo exato na demonstração.",
          },
          {
            q: "Qual é a diferença para o Cartão de visita digital?",
            a: "O cartão abre uma página de contactos completa e tem QR code. O porta-chaves é mais pequeno e mais simples: abre diretamente um único destino.",
          },
        ],
      },
    ],
  },
};
