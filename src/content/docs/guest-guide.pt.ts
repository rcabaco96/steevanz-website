import type { DocPageContent, DocPageId } from "../types";

export const pt: Record<DocPageId, DocPageContent> = {
  "getting-started": {
    title: "Primeiros passos com o guia digital do alojamento",
    description:
      "O que é o guia digital do alojamento, o que inclui, quanto custa e como o hóspede o abre com um toque numa placa dentro da casa.",
    blocks: [
      {
        type: "p",
        text: "O guia digital do alojamento é uma página para o telemóvel com tudo o que o hóspede precisa de saber durante a estadia: WiFi, check-in e check-out, regras da casa, eletrodomésticos, lixo, emergências e as suas recomendações. Está em português, inglês e mais duas línguas e abre com um toque numa placa colocada dentro do alojamento, ou pelo QR code impresso na mesma placa.",
      },
      {
        type: "p",
        text: "É um serviço feito por nós: escrevemos, traduzimos, publicamos e mantemos o guia atualizado. Não precisa de instalar nada nem de aprender uma ferramenta nova.",
      },
      { type: "h2", id: "o-que-inclui", text: "O que inclui" },
      {
        type: "table",
        head: ["Item", "Detalhe"],
        rows: [
          ["Escrita do guia", "Transformamos as suas notas, fotografias ou o guia atual numa página clara, organizada por temas"],
          ["Quatro línguas", "Português, inglês e mais duas à escolha (francês, espanhol, alemão ou italiano), revistas por nós"],
          ["Placas de toque", "Placa de parede, expositor ou autocolante, com QR code, para colocar dentro do alojamento"],
          ["Versão para imprimir", "PDF com o mesmo conteúdo, para deixar uma cópia em papel no alojamento"],
          ["Alojamento online e alterações", "Alojamento da página e alterações feitas por nós em até dois dias úteis"],
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
        text: "A escrita do guia, a tradução para quatro línguas, o alojamento online e as alterações custam 30 € por mês. Línguas adicionais têm um custo pequeno, indicado no orçamento. Valores sem IVA e de proposta, confirmados depois da demonstração.",
      },
      { type: "h2", id: "como-funciona", text: "Como funciona para o hóspede" },
      {
        type: "ol",
        items: [
          "O hóspede entra e aproxima o telemóvel da placa (ou lê o QR code).",
          "O guia abre na língua do telemóvel, com um botão para trocar de língua.",
          "Encontra o WiFi (com botão para copiar a password), as regras e as recomendações, sem ter de lhe enviar uma mensagem.",
        ],
      },
      {
        type: "callout",
        tone: "info",
        title: "O que o guia nunca tem",
        text: "Códigos da porta, da caixa das chaves ou do alarme. Esses continuam a seguir na sua mensagem de check-in.",
      },
      { type: "h2", id: "proximos-passos", text: "Próximos passos" },
      {
        type: "ul",
        items: [
          "[Instalação](/docs/guia-digital-alojamento/instalacao): que informação nos enviar e onde colocar a placa.",
          "[Configuração](/docs/guia-digital-alojamento/configuracao): línguas, secções e como pedir alterações.",
          "[Utilização](/docs/guia-digital-alojamento/utilizacao): boas práticas para o guia ser mesmo lido.",
        ],
      },
    ],
  },
  setup: {
    title: "Instalação do guia digital",
    description: "A informação que precisamos para escrever o guia, como aprova o rascunho e onde colocar a placa dentro do alojamento.",
    blocks: [
      { type: "h2", id: "enviar-informacao", text: "1. Envie-nos a informação" },
      {
        type: "p",
        text: "Pode enviar como lhe for mais fácil: um documento, fotografias, o guia em papel que já tem ou uma mensagem de voz no WhatsApp. Nós organizamos.",
      },
      {
        type: "table",
        head: ["Tema", "O que nos dizer"],
        rows: [
          ["Check-in e check-out", "Horas, como entregar as chaves à saída, o que fazer com o lixo e a roupa"],
          ["WiFi", "Nome da rede e password"],
          ["A casa", "Como funcionam a placa de cozinha, o forno, as máquinas, o aquecimento, o ar condicionado e a água quente"],
          ["Regras", "Regras da casa e do condomínio, horas de silêncio, fumar, animais, festas"],
          ["Lixo e reciclagem", "Onde ficam os contentores e como separar"],
          ["Como chegar e estacionar", "Do aeroporto e da estação, estacionamento e transportes"],
          ["Emergências", "O seu contacto, farmácia, hospital e centro de saúde mais próximos"],
          ["Recomendações", "Restaurantes, praias, passeios e compras que recomenda"],
          ["Dados legais", "Número de registo (RNAL)"],
        ],
      },
      {
        type: "callout",
        tone: "warning",
        title: "Não nos envie códigos de acesso",
        text: "Códigos da porta, da caixa das chaves ou do alarme não entram no guia. Se nos chegarem por engano, não os publicamos.",
      },
      { type: "h2", id: "aprovar", text: "2. Aprove o rascunho" },
      {
        type: "p",
        text: "Em cerca de três dias úteis enviamos-lhe o link do rascunho em português e nas outras línguas. Pode pedir as correções que quiser. Só publicamos depois da sua aprovação.",
      },
      { type: "h2", id: "colocar-placa", text: "3. Coloque a placa" },
      {
        type: "p",
        text: "A placa chega gravada e testada em dois a quatro dias úteis. Coloque-a dentro do alojamento, num sítio que o hóspede vê ao entrar.",
      },
      {
        type: "table",
        head: ["Formato", "Onde fica bem"],
        rows: [
          ["Placa de parede", "Junto à porta de entrada, por dentro"],
          ["Expositor", "Na mesa da sala, na bancada da cozinha ou na receção"],
          ["Autocolante", "No frigorífico ou no espelho da entrada"],
        ],
      },
      {
        type: "callout",
        tone: "tip",
        text: "Evite a porta exterior: o guia tem a password do WiFi e só deve estar ao alcance de quem está hospedado.",
      },
    ],
  },
  configuration: {
    title: "Configuração do guia digital",
    description: "Línguas, secções do guia, a secção «Avaliar a estadia», o link para o seu website e como pedir alterações.",
    blocks: [
      { type: "h2", id: "linguas", text: "Línguas" },
      {
        type: "p",
        text: "O guia inclui português, inglês e mais duas línguas à sua escolha entre francês, espanhol, alemão e italiano. Abre automaticamente na língua do telemóvel do hóspede e tem um seletor para mudar. Se precisar de mais línguas, indicamos o custo no orçamento.",
      },
      { type: "h2", id: "seccoes", text: "Secções" },
      {
        type: "ul",
        items: [
          "Bem-vindo",
          "Check-in e check-out",
          "WiFi, com botão para copiar a password",
          "Como funciona a casa: eletrodomésticos, aquecimento, ar condicionado e água quente",
          "Regras da casa e do condomínio",
          "Lixo e reciclagem",
          "Ruído e vizinhos",
          "Emergências: 112, o seu contacto, farmácia, hospital e centro de saúde",
          "Como chegar e estacionar",
          "Recomendações do anfitrião",
          "Taxa turística: o que é e porque se paga",
          "Avaliar a estadia",
          "Livro de Reclamações e número de registo",
        ],
      },
      {
        type: "p",
        text: "Juntas, estas secções incluem o conteúdo que a lei pede para o livro de informações do alojamento local: funcionamento da casa, regras, resíduos, eletrodomésticos, ruído, regras do condomínio e contacto do responsável, em português, inglês e mais duas línguas.",
      },
      { type: "h2", id: "avaliar-estadia", text: "A secção «Avaliar a estadia»" },
      {
        type: "p",
        text: "É igual para todos os hóspedes: explica que a Booking envia o pedido de avaliação por email e o Airbnb na app (em Viagens), depois da saída, e que a opinião ajuda outros viajantes. Não oferece descontos nem prendas e não pede uma nota em concreto, porque as plataformas o proíbem. Se o seu alojamento tiver perfil no Google, podemos juntar o link para o Google.",
      },
      { type: "h2", id: "website", text: "Link para o seu website" },
      {
        type: "p",
        text: "Se tiver um website próprio, podemos mostrar um link discreto «Site oficial». Fica desligado por defeito: o Airbnb proíbe incentivar os hóspedes a reservar fora da plataforma, por isso nunca usamos frases como «reserve direto e poupe».",
      },
      { type: "h2", id: "alteracoes", text: "Pedir alterações" },
      {
        type: "p",
        text: "Envie-nos o que mudou por WhatsApp ou email. Atualizamos o guia e o PDF em até dois dias úteis, em todas as línguas. A placa nunca precisa de ser trocada.",
      },
    ],
  },
  usage: {
    title: "Utilização do guia digital",
    description: "Boas práticas para os hóspedes encontrarem e usarem o guia, e como ele se junta ao assistente no WhatsApp.",
    blocks: [
      { type: "h2", id: "dar-a-conhecer", text: "Dar a conhecer o guia" },
      {
        type: "ul",
        items: [
          "Mencione o guia na mensagem de check-in: «Ao entrar, toque na placa junto à porta para ver o WiFi e tudo sobre a casa.»",
          "Coloque a placa num sítio que se veja logo ao entrar.",
          "Deixe a versão impressa numa gaveta ou na mesa da sala, para quem prefere papel.",
        ],
      },
      { type: "h2", id: "recomendacoes", text: "Recomendações que fazem a diferença" },
      {
        type: "p",
        text: "Os hóspedes valorizam o que só um local sabe: a pastelaria do bairro, a praia com menos gente, o restaurante onde não há turistas. Cinco a dez recomendações bem escolhidas valem mais do que uma lista longa.",
      },
      { type: "h2", id: "assistente", text: "Com o assistente no WhatsApp" },
      {
        type: "p",
        text: "Se tiver também o assistente com IA, o conteúdo do guia é a base de conhecimento dele. Quando o hóspede pergunta no WhatsApp, recebe a mesma resposta que está no guia, na sua língua. O assistente também nunca partilha códigos de acesso.",
      },
      { type: "h2", id: "varios-alojamentos", text: "Vários alojamentos" },
      {
        type: "p",
        text: "Cada alojamento tem o seu guia e a sua placa. Para gestores, mantemos o mesmo aspeto em todos e aplicamos de uma vez as alterações comuns, como novas regras do condomínio ou um contacto de emergência diferente.",
      },
    ],
  },
  troubleshooting: {
    title: "Resolução de problemas do guia digital",
    description: "O que fazer quando um hóspede não consegue abrir o guia com um toque ou quando a informação está desatualizada.",
    blocks: [
      { type: "h2", id: "toque-nao-abre", text: "O toque não abre o guia" },
      {
        type: "ul",
        items: [
          "Nos iPhone XS e mais recentes, basta aproximar o topo do telemóvel da placa, com o ecrã ligado.",
          "Nos Android, a leitura por aproximação tem de estar ligada nas definições. Muitos telemóveis trazem-na ligada.",
          "Capas grossas ou com metal podem impedir a leitura. Nesse caso, o hóspede usa o QR code.",
        ],
      },
      {
        type: "callout",
        tone: "tip",
        text: "Todas as placas têm QR code impresso. Quem não conseguir com um toque aponta a câmara e chega ao mesmo guia.",
      },
      { type: "h2", id: "informacao-errada", text: "Há informação desatualizada" },
      {
        type: "p",
        text: "Envie-nos a correção por WhatsApp ou email. Atualizamos em até dois dias úteis. Em casos urgentes, como uma password do WiFi errada, diga-nos e damos prioridade.",
      },
      { type: "h2", id: "placa-danificada", text: "A placa partiu-se ou desapareceu" },
      {
        type: "p",
        text: "Enviamos uma nova com o mesmo endereço, por isso o guia continua igual. Uma placa extra para o mesmo alojamento tem um custo pequeno, indicado no orçamento.",
      },
      { type: "h2", id: "link-partilhado", text: "O link foi partilhado fora do alojamento" },
      {
        type: "p",
        text: "O endereço do guia é privado e impossível de adivinhar, mas um hóspede pode guardá-lo. Se mudar a password do WiFi ou quiser trocar o endereço, diga-nos e criamos um novo e regravamos a placa.",
      },
    ],
  },
  faq: {
    title: "Perguntas frequentes sobre o guia digital",
    description: "Respostas rápidas sobre preços, línguas, segurança, avaliações e a placa obrigatória do alojamento local.",
    blocks: [
      {
        type: "faq",
        items: [
          {
            q: "Quanto custa por mês?",
            a: "30 € por mês pelo guia, com o alojamento online e as alterações incluídos. As placas pagam-se uma vez: 20 € cada, 15 € cada a partir de 10. Se tiver o Pack Alojamento Local, o guia está incluído enquanto o pack estiver ativo.",
          },
          {
            q: "O guia serve como o livro de informações que a lei exige?",
            a: "O guia inclui o conteúdo que a lei pede para o livro de informações, em português, inglês e mais duas línguas, e entregamos uma versão para imprimir que recomendamos deixar no alojamento.",
          },
          {
            q: "O guia substitui a placa obrigatória de alojamento local?",
            a: "Não. A placa identificativa com o número de registo tem um modelo próprio definido por lei. O guia mostra o número de registo, mas não substitui essa placa.",
          },
          {
            q: "O guia recolhe dados dos hóspedes?",
            a: "Não. O guia não tem formulários nem pede dados pessoais. Só ficam os registos técnicos normais do servidor.",
          },
          {
            q: "Posso pedir avaliações através do guia?",
            a: "O guia tem uma secção neutra que explica onde avaliar, igual para todos e sem ofertas em troca, como exigem a Booking e o Airbnb.",
          },
          {
            q: "Tratam dos boletins do SIBA?",
            a: "Não. Se quiser lembretes dos prazos, a automatização «Limpezas e prazos» trata disso. Para o envio automático dos boletins recomendamos ferramentas especializadas como a Chekin ou a Hostkit.",
          },
        ],
      },
    ],
  },
};
