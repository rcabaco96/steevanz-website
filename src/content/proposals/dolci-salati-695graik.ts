import type { Proposal } from "./types.ts";

// Dolci e Salati, quote sent on 15/10/2026. Lines, details and numbers match the PDF the client received:
// one-off 575 € + IVA 132,25 € = 707,25 €; monthly 45 € + IVA 10,35 € = 55,35 €/mês.
export const proposal: Proposal = {
  id: "dolci-salati-695graik",
  number: "ORC-2026-001",
  clientName: "Dolci e Salati",
  date: "2026-10-15",
  validityDays: 30,
  vatRate: 23,
  oneOff: [
    {
      description: "Landing page",
      detail:
        "Uma página com até 8 secções, design personalizado e pensada para telemóvel; formulário, WhatsApp e mapa; SEO base e ligação ao perfil no Google; cookies, privacidade e Livro de Reclamações; 2 rondas de alterações; publicação com certificado de segurança. Entrega em 5 dias úteis após a receção dos conteúdos.",
      quantity: 1,
      unitCents: 35000,
    },
    {
      description: "Placas de mesa · Menu digital",
      detail: "Placa circular com QR code impresso e texto personalizado, gravada, bloqueada e testada em iPhone e Android.",
      quantity: 15,
      unitCents: 2000,
      discount: { description: "Desconto de quantidade (a partir de 10 placas: 15 €/un.)", amountCents: 7500 },
    },
  ],
  monthly: [
    {
      description: "Alojamento e manutenção da landing page",
      detail:
        "Alojamento, certificado de segurança, monitorização e cópias de segurança, atualizações, até 30 minutos de pequenas alterações por mês, suporte por WhatsApp e email.",
      quantity: 1,
      unitCents: 1500,
    },
    {
      description: "Menu digital em vídeo",
      detail:
        "Um vídeo vertical por prato com nome, preço e descrição, coleções, ecrã inteiro ao estilo Reels e abertura com o logótipo. Montagem do menu e alojamento do menu e dos vídeos incluídos.",
      quantity: 1,
      unitCents: 3000,
    },
  ],
  // Owner, 2026-10-15: the monthly fees preferably paid a year upfront, «2 meses grátis»
  // (45 €/mês → 450 €/ano + IVA 103,50 € = 553,50 €; hosting 150 €/ano, menu 300 €/ano).
  annual: { freeMonths: 2 },
  included: [
    "A landing page da Dolci e Salati, feita à medida e pensada primeiro para o telemóvel.",
    "15 placas de mesa: um toque ou o QR abre o Menu digital.",
    "O Menu digital em vídeo: montamos o menu e alojamos o menu e os vídeos.",
    "Alojamento, manutenção e suporte em português, por pessoas, todos os meses.",
  ],
  conditions: [
    "Preços em euros, sem IVA. Acresce IVA à taxa legal (23%).",
    "Na adjudicação: itens únicos + 1.º ano (plano anual) ou 1.ª mensalidade (plano mensal).",
    "Plano anual pago adiantado: 12 meses pelo preço de 10. Renova por mais 12 meses, salvo aviso com 30 dias de antecedência.",
    "Plano mensal: mensalidades pagas no início de cada mês, sem período mínimo; cancela com 30 dias de aviso.",
    "Domínio e email profissional pagos à parte; o domínio fica sempre em nome do cliente.",
    "Landing page entregue em 5 dias úteis após a receção dos conteúdos, com 2 rondas de alterações.",
    "Textos, fotografias e vídeos fornecidos pelo cliente devem ser seus ou ter licença de uso.",
    "Orçamento válido por 30 dias.",
  ],
  nextSteps: [
    "Enviam-nos o logótipo, as fotografias e os textos da casa.",
    "Gravam os primeiros vídeos dos pratos, seguindo o nosso guia.",
    "Montamos a landing page e o Menu digital e mostramos-vos tudo antes de publicar.",
  ],
};
