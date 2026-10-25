// The Steevanz assistant's own knowledge, for the site chat (/chat-teste now, the site widget later: phase D of
// docs/chatbot/PLANO-PRODUTO.md). Everything is written from the site's content (products, prices, product copy,
// sectors, about and contact pages), so the assistant says what the site says: change the site and run
// `node scripts/chatbot/steevanz-bot.mjs` to update the bot. Prices always «X € + IVA» (owner's absolute rule).
// Pure module: relative imports with extensions keep it runnable by `node --test` and the script.
import { aboutCopy, contactCopy } from "../../content/company.ts";
import { brandLine, clients } from "../../content/home-ultra/shared.ts";
import { getProductCopy } from "../../content/product-copy/index.ts";
import { products, type Product } from "../../content/products.ts";
import { sectors } from "../../content/sectors.ts";
import { href, type Route } from "../routes.ts";
import { site } from "../site.ts";
import { setupKeywords, setupQuestions, serializeHours } from "./setup.ts";
import type { WeeklyHours } from "./types.ts";

/** The live site (the bot's links always point here, whatever server builds the text). */
export const steevanzSiteUrl = "https://www.steevanz.com";

const url = (route: Route) => `${steevanzSiteUrl}${href("pt", route)}`;

/** The demo menu sent to every lead (one of the Menu digital examples in src/content/product-examples.ts). */
export const demoMenuUrl = `${steevanzSiteUrl}/menu/trattoria-da-nonna`;

/** «961 292 679» (the owner's way of writing the number on the site). */
export const steevanzPhone = site.phoneDisplay.replace(/^\+351\s*/, "");

/** The bot's own row (chatbot_bots): everything else comes from the entries and the document below. */
export const steevanzBot = {
  name: "Steevanz",
  kind: "other",
  tone: "formal",
  languages: ["pt", "en", "es", "fr", "de", "it"],
  default_language: "pt",
  address: "Lisboa (trabalhamos à distância, com clientes em todo o país)",
  phone: steevanzPhone,
  booking_url: url({ key: "book" }),
  privacy_url: url({ key: "privacy" }),
  time_zone: site.timeZone,
} as const;

/** When the team answers (contact page: «Segunda a sexta, das 10h às 18h»). */
export const steevanzHours: WeeklyHours[] = [1, 2, 3, 4, 5].map((weekday) => ({ weekday, opens: "10:00", closes: "18:00" }));

/** The «Qual é o horário?» entry of «Configurar em 5 passos» (setup.ts reads it back as the bot's structured hours). */
export const steevanzHoursEntry = { kind: "info" as const, question: setupQuestions.hours, answer: serializeHours(steevanzHours, []), keywords: setupKeywords.hours };

export const steevanzDocumentTitle = "Steevanz — informação para visitantes do site";

const euro = (value: number) => `${String(value).replace(".", ",")} €`;

/** «+ 30 €/mês» → «+ 30 €/mês + IVA» inside a price qualifier (every amount keeps its note). */
const withVat = (text: string) => text.replace(/(\d+(?:,\d+)?\s?€(?:\/mês)?)(?!\s*\+\s*IVA)/g, "$1 + IVA");

/** The site's qualifier without the «sem fidelização» clause (owner: no «fidelização» in labels). */
function qualifier(product: Product): string {
  return product.priceQualifier.pt
    .replace(/\s*[,;]?\s*[^,;]*fideliza[^,;]*/gi, "")
    .replace(/^[\s,;]+/, "")
    .trim();
}

const packNouns: Record<NonNullable<Product["packUnit"]>, string> = { plate: "placas", property: "alojamentos", card: "cartões", keychain: "unidades" };

/** Proper names that keep their capital in a title read as a sentence. */
const properNames = new Set(["Google", "Tripadvisor", "Booking", "Multibanco", "WhatsApp", "Steevanz", "IA", "MB", "WAY"]);

/** «Placas para Avaliações no Google, Tripadvisor e Booking | Steevanz» → «Placas para avaliações no Google, Tripadvisor e Booking». */
function sentenceTitle(title: string): string {
  return title
    .replace(/\s*\|\s*Steevanz\s*$/, "")
    .split(" ")
    .map((word, index) => (index === 0 || properNames.has(word.replace(/[^\p{L}]/gu, "")) || !/^\p{Lu}\p{Ll}/u.test(word) ? word : word.toLowerCase()))
    .join(" ");
}

/** «Placa com QR code» → «placa com QR code», but «QR code…», «SEO…», «MB WAY…» stay as written. */
const lower = (text: string) => (/^\p{Lu}\p{Ll}/u.test(text) ? text.charAt(0).toLowerCase() + text.slice(1) : text);

const list = (items: readonly string[]) => (items.length > 1 ? `${items.slice(0, -1).join(", ")} e ${items.at(-1)}` : (items[0] ?? ""));

/**
 * Everything about a product's price, «+ IVA» after every amount: «desde 20 € + IVA por placa + 30 €/mês + IVA pelo menu
 * em vídeo; em quantidade, 15 € + IVA cada a partir de 10 placas; com o seu logótipo, mais 10 € + IVA uma só vez por
 * encomenda».
 */
export function priceText(product: Product): string {
  const monthly = product.priceBilling === "monthly";
  let rest = qualifier(product);
  if (monthly) rest = rest.replace(/^por mês[,;]?\s*/i, "");
  const joiner = !rest ? "" : /^(por|cada|até)\b/i.test(rest) ? " " : ", ";
  const parts = [`desde ${euro(product.priceFrom)}${monthly ? "/mês" : ""} + IVA${joiner}${withVat(rest)}`];
  const noun = packNouns[product.packUnit ?? "plate"];
  if (product.packs?.length) {
    const packs = product.packs.map((pack, index) => `${euro(pack.unitPrice)} + IVA cada a partir de ${pack.quantity}${index === product.packs!.length - 1 ? ` ${noun}` : ""}`);
    parts.push(`em quantidade, ${list(packs)}`);
  }
  const custom = product.customization;
  if (custom && !custom.formatOnly && custom.logoExtra > 0) {
    const one = noun === "placas" ? "placa" : noun === "cartões" ? "cartão" : "unidade";
    parts.push(`com o seu logótipo, mais ${euro(custom.logoExtra)} + IVA ${custom.logoExtraPer === "unit" ? `por ${one}` : "uma só vez por encomenda"}`);
  }
  return parts.join("; ");
}

/** What a product includes, without the support line every product has (said once, under «Contactos»). */
const includes = (items: readonly string[]) =>
  items
    .map((item) => item.replace(/(?:^|\s+e\s+)(?:suporte|apoio) por WhatsApp e e-?mail.*$/i, "").trim())
    .filter(Boolean)
    .map(lower);

/** One of the bot's answers (a chatbot_knowledge row, «Respostas do negócio» in the admin). */
export interface SteevanzEntry {
  kind: "faq" | "policy" | "info";
  question: string;
  answer: string;
  keywords: string;
}

/** The facts both the entries and the document are written from. */
function facts() {
  const about = aboutCopy.pt;
  const contact = contactCopy.pt;
  const productFacts = products.map((product) => {
    const copy = getProductCopy(product.id, "pt");
    return {
      product,
      name: copy.name,
      summary: copy.summary,
      includes: includes(copy.includes),
      price: priceText(product),
      link: url({ key: "product", productId: product.id }),
      keywords: [...new Set([copy.shortName, sentenceTitle(copy.metaTitle).replace(/\s+para\s+(?:restaurantes|pequenos negócios|negócios|o seu negócio)$/i, ""), product.slug.pt.replace(/-/g, " ")])],
    };
  });
  const productName = (id: Product["id"]) => productFacts.find((fact) => fact.product.id === id)!.name;
  const sectorFacts = sectors.map((sector) => {
    const copy = sector.copy.pt;
    const pack = sector.pack;
    return {
      sector,
      name: copy.name,
      body: copy.cardBody,
      bundle: list(sector.bundle.map(productName)),
      link: url({ key: "sector", sectorId: sector.id }),
      packPrice: pack
        ? `${pack.copy.pt.eyebrow}: ${euro(pack.setup)} + IVA de configuração + ${euro(pack.monthly)}/mês + IVA (${lower(pack.copy.pt.title)}). Cada alojamento extra: + ${euro(pack.extraSetup)} + IVA de configuração e + ${euro(pack.extraMonthly)}/mês + IVA.`
        : null,
      pack: pack
        ? `${pack.copy.pt.eyebrow}: ${euro(pack.setup)} + IVA de configuração + ${euro(pack.monthly)}/mês + IVA. ${pack.copy.pt.title}: ${pack.copy.pt.items.map(lower).join("; ")}. Cada alojamento extra: + ${euro(pack.extraSetup)} + IVA de configuração e + ${euro(pack.extraMonthly)}/mês + IVA.`
        : null,
    };
  });
  const hours = contact.hours.replace(/(\d+)h\b/g, "$1:00").replace(/^Segunda a sexta\b(?!-)/, "Segunda a sexta-feira");
  return {
    about: `${about.lead} ${about.metaDescription} ${about.story[0].split(/(?<=\.)\s/)[0]}`,
    how: about.how.map((step) => `${step.title}: ${lower(step.body)}`).join(" "),
    clients: list(clients.map((client) => client.name)),
    hours,
    responseTime: contact.responseTime,
    location: contact.location,
    whatsapp: `https://wa.me/${site.whatsappNumber}`,
    demo: `${contact.demoBody} Marque em ${url({ key: "book" })}`,
    info: `${contact.infoBody} Peça em ${url({ key: "requestInfo" })}`,
    // The free demo the owner sends every contact (the WhatsApp funnel of the Menu digital): a demo menu, said to be one.
    menuExample: `Sim. Veja um Menu digital de demonstração no telemóvel, como um cliente à mesa: ${demoMenuUrl}. Para ver o seu restaurante assim, marque uma demonstração gratuita em ${url({ key: "book" })}`,
    products: productFacts,
    sectors: sectorFacts,
    allProducts: url({ key: "products" }),
    contactPage: url({ key: "contact" }),
  };
}

const vatAnswer = "Não. Os preços da Steevanz são sem IVA: acresce IVA à taxa legal.";

/** The bot's answers, one per product, sector and frequent question (each with the words people use). */
export function steevanzEntries(): SteevanzEntry[] {
  const f = facts();
  const entries: SteevanzEntry[] = [];
  const general: SteevanzEntry[] = [
    { kind: "info", question: "Quem somos?", answer: f.about, keywords: "quem são, empresa, sobre vocês, história, equipa" },
    { kind: "info", question: "Qual é o processo?", answer: f.how, keywords: "como funciona, processo, passos, instalação, configuração, formação" },
    { kind: "info", question: "Quem são os vossos clientes?", answer: `Alguns dos nossos clientes: ${f.clients}.`, keywords: "clientes, marcas, portefólio, referências" },
    {
      kind: "info",
      question: "Quais são os contactos?",
      answer: [`Telefone e WhatsApp: ${steevanzPhone} (${f.whatsapp})`, `Email: ${site.email}`, `Instagram: ${site.instagramHandle} (${site.instagramUrl})`, `Atendimento: ${lower(f.hours)}. ${f.responseTime}`].join("\n"),
      keywords: "contacto, contactos, contactar, falar convosco",
    },
    {
      kind: "info",
      question: "Qual é o telefone?",
      answer: `Pode ligar para ${steevanzPhone}, ${lower(f.hours)}. Também pode escrever-nos pelo WhatsApp: ${f.whatsapp}`,
      keywords: "telefone, número, ligar, chamada",
    },
    { kind: "info", question: "Têm WhatsApp?", answer: `Sim, pode falar connosco pelo WhatsApp, no ${steevanzPhone}: ${f.whatsapp}`, keywords: "whatsapp, mensagem" },
    { kind: "info", question: "Qual é o email?", answer: `O nosso email é ${site.email}.`, keywords: "email, e-mail, mail, correio eletrónico" },
    { kind: "info", question: "Têm Instagram?", answer: `Sim: ${site.instagramHandle} (${site.instagramUrl}).`, keywords: "instagram" },
    { kind: "faq", question: "Como marcar uma demonstração?", answer: f.demo, keywords: "demonstração, demo, marcar, marco, agendar, reunião, apresentação, ver a funcionar, gratuita" },
    { kind: "faq", question: "Posso ver um exemplo do Menu digital?", answer: f.menuExample, keywords: "exemplo, exemplos, ver um menu, menu de exemplo, menu de demonstração, demo do menu, experimentar o menu, trattoria" },
    { kind: "faq", question: "Podem enviar informação por escrito?", answer: f.info, keywords: "por escrito, proposta, orçamento, detalhes" },
    { kind: "policy", question: "Os preços incluem IVA?", answer: vatAnswer, keywords: "iva, imposto, impostos" },
    {
      kind: "info",
      question: "Que produtos e serviços têm?",
      answer: `Temos ${list(f.products.map((fact) => lower(fact.name)))}. Todos os produtos e preços: ${f.allProducts}`,
      keywords: "produtos, serviços, soluções, catálogo",
    },
    { kind: "info", question: "Que setores?", answer: `Trabalhamos com ${list(f.sectors.map((sector) => sector.name.toLowerCase()))}.`, keywords: "setores, setor, áreas, tipos de negócio" },
    { kind: "info", question: "Que suporte dão?", answer: "Suporte por WhatsApp e email, melhorias contínuas e zero letras miudinhas.", keywords: "suporte, apoio, ajuda, assistência" },
  ];
  // Sectors first, then products, then the general answers: on a tie the first one answers.
  for (const sector of f.sectors) {
    entries.push({
      kind: "info",
      question: sector.name,
      answer: [`Sim, trabalhamos com ${sector.name.toLowerCase()}: ${lower(sector.body)} Recomendamos: ${sector.bundle}. Mais informação: ${sector.link}`, sector.packPrice].filter(Boolean).join("\n"),
      keywords: [sector.sector.slug.pt.replace(/-/g, " "), sector.packPrice ? "pack" : null].filter(Boolean).join(", "),
    });
  }
  for (const fact of f.products) {
    entries.push({ kind: "info", question: fact.name, answer: `${fact.summary}\nPreço: ${fact.price}.\nMais informação: ${fact.link}`, keywords: fact.keywords.join(", ") });
  }
  // The general answers last: «Têm algum produto para cabeleireiros?» is about the sector, not the product list.
  return [...entries, ...general];
}

/**
 * The same facts as one document («Documentos» in the admin): the AI's excerpts and the free answers' fallback. The
 * prices are one run of lines, one per product («Menu digital — desde 20 € + IVA …»), so a «Quanto custa?» with
 * nothing named gets a question back with examples of different products.
 */
export function steevanzDocument(): string {
  const f = facts();
  const out: string[] = [steevanzDocumentTitle, brandLine.join(" "), ""];
  out.push("Quem somos", f.about, `Como trabalhamos: ${f.how}`, `Alguns dos nossos clientes: ${f.clients}.`, "");
  out.push(
    "Contactos",
    `Telefone e WhatsApp: ${steevanzPhone} (${f.whatsapp})`,
    `Email: ${site.email}`,
    `Instagram: ${site.instagramHandle} (${site.instagramUrl})`,
    `Horário de atendimento: ${f.hours}. ${f.responseTime}`,
    `Onde estamos: ${f.location}`,
    "Suporte: por WhatsApp e email.",
    `Página de contacto: ${f.contactPage}`,
    "",
  );
  out.push("Demonstração gratuita", `Como marcar uma demonstração? ${f.demo}`, `Exemplo do Menu digital: ${f.menuExample}`, `Informação e preços por escrito: ${lower(f.info)}`, "");
  out.push("Preços", `Os preços incluem IVA? ${vatAnswer}`);
  for (const fact of f.products) out.push(`${fact.name} — ${fact.price}.`);
  out.push(`Todos os produtos e preços: ${f.allProducts}`, "");
  out.push("Produtos");
  for (const fact of f.products) out.push(fact.name, `${fact.name}: ${fact.summary}`, `${fact.name} — o que inclui: ${fact.includes.join("; ")}.`, `${fact.name} — saber mais: ${fact.link}`, "");
  out.push("Setores", `Trabalhamos com ${list(f.sectors.map((sector) => sector.name.toLowerCase()))}.`);
  for (const sector of f.sectors) {
    out.push(`${sector.name}: ${sector.body} Recomendamos: ${sector.bundle}. Página: ${sector.link}`);
    if (sector.pack) out.push(sector.pack);
  }
  return `${out.join("\n").trim()}\n`;
}

/** Questions a visitor taps on the test page (every one answered by the entries above). */
export const steevanzSuggestions = [
  "Quanto custa o Menu digital?",
  "O que é o cartão de cliente digital?",
  "Como marco uma demonstração?",
  "Trabalham com clínicas?",
  "Qual é o vosso contacto?",
  "Os preços incluem IVA?",
];
