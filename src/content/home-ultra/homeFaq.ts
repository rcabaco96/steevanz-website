// Copy for the /novo-ultra «Perguntas frequentes» section (HomeFaq). Pure data, pt-PT.
// Rules: «um toque», never the technical name of the chip; prices always without VAT; no invented numbers.
// The phone answer matches src/content/home.ts and the plate docs (iPhone XS+ automatic, 7 to X via the
// Centro de Controlo reader, most Android with the proximity reading switched on).

export const homeFaq = {
  title: "Perguntas *frequentes*",
  items: [
    {
      q: "Os meus clientes têm de instalar alguma aplicação?",
      a: "Não. As placas, o Menu digital, o cartão de cliente e o guia do alojamento abrem no navegador do telemóvel, com um toque ou pelo QR code impresso na mesma placa.",
    },
    {
      q: "Preciso de perceber de tecnologia?",
      a: "Não. Nós montamos tudo, testamos em iPhone e Android e explicamos à sua equipa como funciona. Depois, é só usar.",
    },
    {
      q: "Que telemóveis funcionam com um toque?",
      a: "Os iPhone XS e posteriores leem a placa com o ecrã desbloqueado, sem fazer nada. Os iPhone 7 a X usam o leitor de etiquetas do Centro de Controlo. A grande maioria dos Android também lê a placa; basta a leitura por aproximação estar ativa nas definições.",
    },
    {
      q: "Quanto custa?",
      a: "Cada solução tem um preço de partida, que vê nesta página e na página de cada produto, sempre sem IVA. Antes de decidir, recebe uma proposta fechada. Pode começar por uma só coisa e acrescentar o resto quando fizer sentido.",
    },
    {
      q: "Fico preso a um contrato longo?",
      a: "Não. Os serviços mensais podem ser cancelados com um aviso simples.",
    },
    {
      q: "A Steevanz é o Google?",
      a: "Não. Somos uma empresa independente. As placas levam os clientes ao formulário de avaliação do seu próprio perfil no Google, mas não temos qualquer ligação ao Google.",
    },
  ],
} as const;
