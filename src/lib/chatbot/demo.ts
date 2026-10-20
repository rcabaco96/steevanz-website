// Example businesses for the offline simulator, the admin's «Experimentar» box and the tests.
// Clearly fictitious («exemplo»): no real business, no reviews, prices only to show the format.
import type { BotProfile, BotSettings } from "./types.ts";

const settings: BotSettings = {
  enabled: true,
  tone: "formal",
  languages: ["pt", "en", "es", "fr", "de", "it"],
  defaultLanguage: "pt",
  autoResumeMinutes: null,
};

export const demoRestaurant: BotProfile = {
  id: "demo-restaurante",
  settings,
  knowledge: {
    businessName: "Tasca Exemplo",
    kind: "restaurant",
    timeZone: "Europe/Lisbon",
    address: "Rua do Exemplo 10, Lisboa",
    phone: "210 000 000",
    mapsUrl: null,
    bookingUrl: "https://www.steevanz.com/reservar/tasca-exemplo",
    menuUrl: "https://www.steevanz.com/menu/tasca-exemplo",
    privacyUrl: null,
    hours: [2, 3, 4, 5, 6].flatMap((weekday) => [
      { weekday, opens: "12:00", closes: "15:00" },
      { weekday, opens: "19:00", closes: "23:00" },
    ]).concat([{ weekday: 0, opens: "12:00", closes: "16:00" }]),
    closures: [{ day: "2026-12-25", reason: "Natal" }],
    items: [
      { name: "Bacalhau à Brás", description: "Bacalhau desfiado com batata palha e ovo.", priceCents: 1450 },
      { name: "Polvo à lagareiro", description: "Polvo assado com batata a murro e azeite.", priceCents: 1800 },
      { name: "Arroz de pato", description: "Arroz no forno com pato desfiado e chouriço.", priceCents: 1350 },
      { name: "Salada de grão (vegetariano)", description: "Grão, tomate, cebola roxa e coentros. Sem glúten.", priceCents: 900 },
      { name: "Pastel de nata", description: "Feito na casa todas as manhãs.", priceCents: 150 },
    ],
    entries: [
      { id: "r1", kind: "faq", question: "Têm estacionamento?", answer: "Não temos parque próprio. Há um parque público na Rua Nova, a 3 minutos a pé.", keywords: "carro, parque, estacionar", active: true },
      { id: "r2", kind: "faq", question: "Têm opções sem glúten ou vegetarianas?", answer: "Sim: a salada de grão é vegetariana e sem glúten, e a cozinha adapta vários pratos. Avise-nos das alergias ao reservar.", keywords: "alergias, celíaco, vegan", active: true },
      { id: "r3", kind: "policy", question: "Aceitam grupos?", answer: "Sim, até 20 pessoas. Para grupos acima de 8 pedimos reserva com 48 horas de antecedência.", keywords: "grupo, festa, aniversário, evento", active: true },
      { id: "r4", kind: "info", question: "Formas de pagamento", answer: "Aceitamos dinheiro, Multibanco, MB WAY e cartões Visa e Mastercard.", keywords: "pagar, cartão, mbway", active: true },
      { id: "r5", kind: "policy", question: "Aceitam animais?", answer: "Sim, cães pequenos são bem-vindos na esplanada.", keywords: "cão, cães, animal", active: true },
    ],
    properties: [],
  },
};

export const demoLodging: BotProfile = {
  id: "demo-alojamento",
  settings: { ...settings, autoResumeMinutes: 12 * 60 },
  knowledge: {
    businessName: "Casas do Rio (exemplo)",
    kind: "lodging",
    timeZone: "Europe/Lisbon",
    address: null,
    phone: "910 000 000",
    mapsUrl: null,
    bookingUrl: null,
    menuUrl: null,
    privacyUrl: null,
    hours: [],
    closures: [],
    items: [],
    entries: [
      { id: "l1", kind: "info", question: "Qual é a password do WiFi?", answer: "Rede «CasaRio-Guest», password «rio-2026-azul».", keywords: "wifi, internet, rede", property: "Casa do Rio", active: true },
      { id: "l2", kind: "info", question: "Qual é a password do WiFi?", answer: "Rede «Moinho», password «moinho-verde».", keywords: "wifi, internet, rede", property: "Moinho Velho", active: true },
      { id: "l3", kind: "policy", question: "A que horas é o check-out?", answer: "O check-out é até às 11:00. Deixe as chaves em cima da mesa da cozinha.", keywords: "saída, sair, checkout", active: true },
      { id: "l4", kind: "policy", question: "A que horas é o check-in?", answer: "O check-in é a partir das 15:00. No dia da chegada enviamos as instruções de entrada.", keywords: "entrada, chegada, chegar", active: true },
      { id: "l5", kind: "info", question: "Onde posso estacionar?", answer: "Há estacionamento gratuito na rua, em frente à casa.", keywords: "carro, parque, estacionamento", active: true },
      { id: "l6", kind: "info", question: "Onde jantar perto?", answer: "Recomendamos a Tasca do Largo (5 min a pé) e o Restaurante da Ponte (10 min de carro).", keywords: "restaurante, comer, jantar, recomendação", active: true },
      { id: "l7", kind: "info", question: "Como funciona a máquina de lavar?", answer: "A máquina está na despensa. Use o programa 4 (40 °C) e uma pastilha do armário de cima.", keywords: "lavar roupa, máquina", active: true },
      // A host's mistake on purpose: the door code typed into an answer. The guard must never send it.
      { id: "l8", kind: "info", question: "Como entro em casa?", answer: "Enviamos as instruções no dia da chegada.\nCódigo da porta: 4821", keywords: "entrar, porta, chegada", property: "Casa do Rio", active: true },
    ],
    properties: ["Casa do Rio", "Moinho Velho"],
  },
};

export const demoBots = { restaurante: demoRestaurant, alojamento: demoLodging } as const;
export type DemoBotKey = keyof typeof demoBots;
