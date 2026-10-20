import type { DocPageContent, DocPageId } from "../types";

export const pt: Record<DocPageId, DocPageContent> = {
  "getting-started": {
    title: "Primeiros passos com o cartão de visita digital",
    description:
      "O que é o cartão de visita digital, o que inclui, quanto custa e como quem o recebe guarda o seu contacto com um toque do telemóvel.",
    blocks: [
      {
        type: "p",
        text: "O cartão de visita digital é um cartão em PVC, do tamanho de um cartão de crédito, com o seu nome, cargo, contactos e o logótipo da empresa. Com um toque do telemóvel no cartão, ou lendo o QR code impresso nele, a pessoa abre a sua página de contacto digital e guarda o seu contacto.",
      },
      {
        type: "p",
        text: "É um serviço feito por nós: desenhamos o cartão, criamos a página e mantemo-la atualizada. Funciona em iPhone e Android e ninguém precisa de instalar uma app.",
      },
      { type: "h2", id: "o-que-inclui", text: "O que inclui" },
      {
        type: "table",
        head: ["Item", "Detalhe"],
        rows: [
          ["Cartão em PVC", "Tamanho de cartão de crédito (85,6 × 54 mm), impresso dos dois lados com a qualidade Steevanz"],
          ["Personalização", "O seu nome, cargo, contactos e o logótipo da empresa, incluídos no preço"],
          ["Página de contacto digital", "Rápida, feita para o telemóvel, com o botão «Guardar contacto»"],
          ["Toque ou QR", "Abre com um toque do telemóvel ou pelo QR code impresso no cartão, em iPhone e Android, sem app"],
          ["Alterações feitas por nós", "Se os seus dados mudarem, atualizamos a página e o cartão continua a funcionar"],
        ],
      },
      { type: "h2", id: "precos", text: "Preços" },
      {
        type: "table",
        head: ["Quantidade", "Preço por cartão", "Total"],
        rows: [
          ["1 cartão", "10 €", "10 €"],
          ["A partir de 10", "9 €", "90 € (10)"],
          ["A partir de 25", "8 €", "200 € (25)"],
          ["A partir de 50", "7 €", "350 € (50)"],
        ],
      },
      {
        type: "p",
        text: "Num pack pode juntar cartões de várias pessoas da mesma empresa, cada uma com a sua página. Preços + IVA, indicativos e confirmados depois da demonstração.",
      },
      { type: "h2", id: "como-funciona", text: "Como funciona para quem toca" },
      {
        type: "ol",
        items: [
          "Mostra o cartão e a pessoa aproxima o telemóvel (ou lê o QR code com a câmara).",
          "Abre a sua página de contacto, com fotografia, nome, cargo e empresa.",
          "Com o botão «Guardar contacto», os seus dados ficam nos contactos do telemóvel dela, sem escrever nada à mão.",
        ],
      },
      {
        type: "callout",
        tone: "info",
        title: "Veja um exemplo",
        text: "A página de contacto do fundador da Steevanz: www.steevanz.com/c/rogerio-cabaco",
      },
      { type: "h2", id: "proximos-passos", text: "Próximos passos" },
      {
        type: "ul",
        items: [
          "[Instalação](/docs/cartao-de-visita-digital/instalacao): que dados nos enviar e como aprova o cartão.",
          "[Configuração](/docs/cartao-de-visita-digital/configuracao): o que mostra a página, o botão «Guardar contacto» e como pedir alterações.",
          "[Utilização](/docs/cartao-de-visita-digital/utilizacao): como apresentar o cartão em reuniões, feiras e ao balcão.",
        ],
      },
    ],
  },
  setup: {
    title: "Instalação do cartão de visita digital",
    description: "Os dados que precisamos para o cartão e a página, como aprova o desenho e como recebe os cartões testados.",
    blocks: [
      { type: "h2", id: "enviar-dados", text: "1. Envie-nos os seus dados" },
      {
        type: "p",
        text: "Pode enviar por WhatsApp ou email, como lhe for mais fácil. Se os cartões forem para várias pessoas da empresa, envie os dados de cada uma.",
      },
      {
        type: "table",
        head: ["Dado", "Para que serve"],
        rows: [
          ["Nome", "Como quer que apareça no cartão e na página"],
          ["Cargo", "Aparece por baixo do nome"],
          ["Telefone", "Para os botões «Ligar» e «WhatsApp»"],
          ["Email", "Para o botão «Email»"],
          ["Website", "Para o botão «Website»"],
          ["Redes sociais", "Instagram, LinkedIn ou outras que queira mostrar"],
          ["Morada (opcional)", "Mostrada com um link para o mapa, se a quiser na página"],
          ["Fotografia", "Aparece na página e no contacto guardado"],
          ["Logótipo da empresa", "Vai para a frente do cartão"],
        ],
      },
      {
        type: "callout",
        tone: "tip",
        text: "Num pack pode juntar cartões de várias pessoas da mesma empresa. Cada uma tem a sua página.",
      },
      { type: "h2", id: "aprovar", text: "2. Aprove o cartão e a página" },
      {
        type: "p",
        text: "Desenhamos o cartão: na frente, o logótipo; no verso, o nome, os contactos, o QR code e o pequeno símbolo de toque. Criamos também a sua página de contacto. Antes de imprimir, enviamos-lhe a prova do cartão e o link da página. Só imprimimos depois da sua aprovação.",
      },
      { type: "h2", id: "receber", text: "3. Receba os cartões" },
      {
        type: "p",
        text: "Os cartões chegam testados em iPhone e Android antes da entrega, em poucos dias úteis. Indicamos o prazo exato na demonstração.",
      },
    ],
  },
  configuration: {
    title: "Configuração do cartão de visita digital",
    description: "O que mostra a página de contacto, o que leva o contacto guardado, o idioma da página e como pedir alterações.",
    blocks: [
      { type: "h2", id: "pagina", text: "O que mostra a página de contacto" },
      {
        type: "ol",
        items: [
          "A sua fotografia, nome, cargo e empresa.",
          "O botão «Guardar contacto».",
          "Os botões «Ligar», «WhatsApp», «Email» e «Website».",
          "As suas redes sociais, como Instagram ou LinkedIn.",
          "A morada, com link para o mapa, se a quiser mostrar.",
        ],
      },
      {
        type: "p",
        text: "A página é rápida, feita para o telemóvel, e não aparece no Google: só abre a partir do cartão ou do seu link.",
      },
      { type: "h2", id: "guardar-contacto", text: "O botão «Guardar contacto»" },
      {
        type: "p",
        text: "Descarrega um ficheiro de contacto que o telemóvel junta aos contactos. O contacto guardado leva:",
      },
      {
        type: "ul",
        items: ["Nome", "Telefone", "Email", "Website", "Empresa e cargo", "Fotografia"],
      },
      { type: "h2", id: "idioma", text: "Idioma da página" },
      {
        type: "p",
        text: "A página fica no seu idioma: português, inglês, espanhol, francês, alemão ou italiano. Diga-nos qual prefere quando nos enviar os dados.",
      },
      { type: "h2", id: "alteracoes", text: "Pedir alterações" },
      {
        type: "p",
        text: "Não precisa de editar a página: somos nós que a configuramos e atualizamos. Se mudar de número, de cargo ou de email, envie-nos a alteração por WhatsApp ou email. Atualizamos a página e o cartão continua a funcionar: o mesmo cartão, nada para reimprimir.",
      },
    ],
  },
  usage: {
    title: "Utilização do cartão de visita digital",
    description: "Como apresentar o cartão para a pessoa guardar o seu contacto, e boas práticas em reuniões, feiras e ao balcão.",
    blocks: [
      { type: "h2", id: "apresentar", text: "Como apresentar o cartão" },
      {
        type: "ol",
        items: [
          "Estenda o cartão à pessoa.",
          "Num iPhone, ela aproxima o topo do telemóvel do cartão. Num Android, basta ter a leitura por aproximação ligada.",
          "Se o telemóvel não reagir, ela aponta a câmara ao QR code impresso no cartão.",
        ],
      },
      {
        type: "callout",
        tone: "tip",
        text: "Diga apenas: «Aproxime o telemóvel e guarde o meu contacto.» A pessoa fica com os seus dados certos, sem escrever nada.",
      },
      { type: "h2", id: "reunioes", text: "Em reuniões" },
      {
        type: "p",
        text: "No fim da reunião, mostre o cartão e peça para guardarem o contacto ali mesmo. Ficam com o seu nome, telefone, email e fotografia, sem erros de escrita. O cartão volta para a sua carteira.",
      },
      { type: "h2", id: "feiras", text: "Em feiras e eventos" },
      {
        type: "p",
        text: "Os cartões de papel acabam no pior momento. Com o cartão de visita digital, cada visitante guarda o seu contacto a partir do mesmo cartão. Se quiser, pode continuar a oferecer cartões.",
      },
      { type: "h2", id: "balcao", text: "Ao balcão" },
      {
        type: "p",
        text: "Na loja, no restaurante ou na imobiliária, tenha o cartão à mão e convide o cliente a guardar o contacto antes de sair. Quando precisar de si, encontra-o logo nos contactos.",
      },
    ],
  },
  troubleshooting: {
    title: "Resolução de problemas do cartão de visita digital",
    description: "O que fazer quando um telemóvel não reage ao toque, quando o contacto fica sem fotografia ou quando o cartão se estraga.",
    blocks: [
      { type: "h2", id: "toque-nao-reage", text: "O telemóvel não reage ao toque" },
      {
        type: "ul",
        items: [
          "Nos iPhone XS e mais recentes, basta aproximar o topo do telemóvel do cartão, sem app.",
          "Na maioria dos Android, a leitura por aproximação tem de estar ligada nas definições de ligações.",
          "Nos restantes telemóveis, use o QR code impresso no cartão: basta apontar a câmara.",
        ],
      },
      {
        type: "callout",
        tone: "tip",
        text: "O QR code abre exatamente a mesma página que o toque.",
      },
      { type: "h2", id: "sem-fotografia", text: "O contacto ficou guardado sem fotografia" },
      {
        type: "p",
        text: "Em alguns telemóveis, a fotografia pode não ficar no contacto guardado. Os restantes dados ficam guardados na mesma e a fotografia continua visível na sua página.",
      },
      { type: "h2", id: "dados-desatualizados", text: "Os dados estão desatualizados" },
      {
        type: "p",
        text: "Envie-nos a alteração por WhatsApp ou email. Atualizamos a página e o cartão continua a funcionar, sem reimprimir nada.",
      },
      { type: "h2", id: "cartao-danificado", text: "O cartão estragou-se ou perdeu-se" },
      {
        type: "p",
        text: "Peça-nos um cartão novo. Fica ligado à mesma página, por isso os seus dados e o seu link continuam iguais.",
      },
    ],
  },
  faq: {
    title: "Perguntas frequentes sobre o cartão de visita digital",
    description: "Respostas rápidas sobre iPhone e Android, alterações, logótipo, packs para equipas, Google e prazos.",
    blocks: [
      {
        type: "faq",
        items: [
          {
            q: "Funciona em iPhone e Android?",
            a: "Sim, sem app. Nos iPhone XS e mais recentes basta aproximar o topo do telemóvel. Na maioria dos Android, a leitura por aproximação tem de estar ligada. Para os restantes, há o QR code impresso no cartão.",
          },
          {
            q: "Posso mudar os meus dados depois?",
            a: "Sim. Envie-nos a alteração por WhatsApp ou email e atualizamos a página. O cartão continua a funcionar: o mesmo cartão, nada para reimprimir.",
          },
          {
            q: "Posso editar a página sozinho?",
            a: "Hoje não. Somos nós que configuramos e atualizamos a página, por isso basta pedir-nos.",
          },
          {
            q: "O logótipo da empresa tem custo extra?",
            a: "Não. A personalização com o seu nome, cargo, contactos e o logótipo da empresa está incluída no preço.",
          },
          {
            q: "Num pack, os cartões podem ser para pessoas diferentes?",
            a: "Sim. Num pack pode juntar cartões de várias pessoas da mesma empresa, cada uma com a sua página.",
          },
          {
            q: "A minha página aparece no Google?",
            a: "Não. A página não é indexada pelo Google: só abre a partir do cartão ou do seu link.",
          },
          {
            q: "Ainda posso oferecer cartões?",
            a: "Pode, se quiser. Mas um só cartão pode servir durante anos, porque não é preciso reimprimir quando muda um número ou um cargo.",
          },
          {
            q: "Quanto tempo demora a receber os cartões?",
            a: "Poucos dias úteis depois de aprovar o desenho e a página. Indicamos o prazo exato na demonstração.",
          },
        ],
      },
    ],
  },
};
