/**
 * The demo video menu of the hidden test page /raza17raza (owner, 2026-10-14), static until the
 * menus have a database. The business is a real client (Dolci e Salati, logo given by the owner);
 * the videos are public YouTube Shorts of cooking channels (food and drink only, chosen on
 * 2026-10-14) and the dishes and prices are examples, so the page says it is a demo.
 */
export interface MenuDish {
  /** YouTube video id of the Short. */
  video: string;
  name: string;
  description: string;
  /** Euros. */
  price: number;
}

export interface MenuCollection {
  id: string;
  name: string;
  dishes: string[];
}

export interface VideoMenuData {
  business: string;
  /** Path under /public. */
  logo: string;
  instagram: string | null;
  dishes: Record<string, MenuDish>;
  /** The first one opens by default and holds every dish. */
  collections: MenuCollection[];
}

const dishes: Record<string, MenuDish> = {
  "fried-ice-cream": { video: "tzQOn3mU7EA", name: "Gelado frito", description: "Bola de gelado de baunilha em massa estaladiça, frita na hora.", price: 5.5 },
  tiramisu: { video: "P0iXMKRKGJg", name: "Tiramisù de abóbora", description: "Camadas de creme de mascarpone, abóbora e café.", price: 4.9 },
  "creme-brulee": { video: "7B132m9g5FY", name: "Crème brûlée", description: "Creme de baunilha com açúcar queimado na hora.", price: 4.5 },
  brownie: { video: "iLe2PLFdIgY", name: "Brownie com gelado", description: "Brownie quente de chocolate negro com uma bola de gelado.", price: 5.2 },
  donuts: { video: "LjFbfLKNJEk", name: "Donuts caseiros", description: "Massa fofa frita e passada por açúcar.", price: 2.8 },
  "orange-cake": { video: "84xHDfPe5kE", name: "Bolo de laranja", description: "Bolo húmido de laranja, à fatia.", price: 3.5 },
  crepes: { video: "ELhcP1zO1YA", name: "Crepe de chocolate", description: "Crepe fino com chantilly e fio de chocolate.", price: 4.8 },
  "fruit-salad": { video: "QAQA08ll34Q", name: "Salada de fruta", description: "Melancia, fruta da época e hortelã fresca.", price: 4.2 },
  arancini: { video: "CO6uCCCGeP8", name: "Arancini carbonara", description: "Bolinhas de risotto recheadas com queijo, fritas.", price: 6.5 },
  popcorn: { video: "zVorYnJjmrQ", name: "Pipocas com amendoim", description: "Pipocas caramelizadas com amendoim torrado.", price: 3.2 },
  nachos: { video: "BvLlEz7uDFc", name: "Nachos gratinados", description: "Tortilhas com queijo derretido, jalapeños e natas.", price: 7.5 },
  "crispy-chicken": { video: "wfTISOEGVqQ", name: "Frango panado", description: "Frango marinado e panado, estaladiço por fora.", price: 8.9 },
  "boiled-egg": { video: "cKrFL4N8s9k", name: "Ovo perfeito", description: "Ovo cozido no ponto, com gema cremosa.", price: 1.8 },
  pierogi: { video: "tG47av4O3nI", name: "Pierogi de batata", description: "Pastéis de massa recheados com batata e queijo.", price: 7.9 },
  burger: { video: "a5TYxMS3oHM", name: "Hambúrguer recheado", description: "Carne picada na hora, recheada com queijo derretido.", price: 11.5 },
  sandwich: { video: "ClDD6TFmrVo", name: "Sandes de compota", description: "Pão estaladiço, manteiga de amendoim e compota.", price: 6.9 },
  "fish-and-chips": { video: "y28G9MWc-IQ", name: "Peixe e batatas fritas", description: "Peixe em polme estaladiço com batatas fritas.", price: 12.5 },
  tacos: { video: "CX_8AuAY_Vo", name: "Tacos", description: "Tortilhas com carne estufada e guarnições.", price: 10.5 },
  noodles: { video: "fnevKiU7_Fo", name: "Massa de abóbora", description: "Massa fresca cortada à tesoura, salteada com ervas.", price: 11.9 },
  pappardelle: { video: "RrLiVscGtOs", name: "Pappardelle com novilho", description: "Novilho estufado em vinho tinto com massa larga.", price: 15.9 },
  "mushroom-pasta": { video: "F5C6UcmyPxc", name: "Massa de cogumelos", description: "Cogumelos salteados com xerez e parmesão.", price: 12.9 },
  "shepherds-pie": { video: "Q9VKJeTqz18", name: "Empadão de carne", description: "Carne estufada coberta com puré gratinado.", price: 11.5 },
  dauphinoise: { video: "r4GSZer0NTc", name: "Batata dauphinoise", description: "Lâminas de batata no forno com natas e queijo.", price: 6.5 },
  stew: { video: "nQYKvVyLnoQ", name: "Ensopado de feijão", description: "Feijão estufado com legumes e especiarias.", price: 9.5 },
  soup: { video: "nk8VugkamdY", name: "Sopa do dia", description: "Sopa cremosa de legumes com endro.", price: 3.5 },
  "roast-chicken": { video: "v8p1uRsQYNk", name: "Frango assado", description: "Frango assado em manteiga com ervas.", price: 13.5 },
  "butter-chicken": { video: "SAziuwJrCro", name: "Caril de frango", description: "Frango em molho de manteiga e especiarias, com arroz.", price: 12.5 },
  shrimp: { video: "dcbMh6D6JMk", name: "Camarão salteado", description: "Camarão salteado em manteiga de alho.", price: 14.5 },
  pizza: { video: "NvX2UjsCTE8", name: "Pizza no forno", description: "Massa fina e estaladiça, com molho de tomate caseiro.", price: 10.9 },
  "kids-menu": { video: "9D63hnLlFOg", name: "Menu criança", description: "Uma caixa com pequenas porções para os mais novos.", price: 7.5 },
};

const sweet = ["fried-ice-cream", "tiramisu", "creme-brulee", "brownie", "donuts", "orange-cake", "crepes", "fruit-salad"];
const snacks = ["arancini", "popcorn", "nachos", "crispy-chicken", "boiled-egg", "pierogi"];
const burgers = ["burger", "sandwich", "fish-and-chips", "tacos"];
const mains = ["noodles", "pappardelle", "mushroom-pasta", "shepherds-pie", "dauphinoise", "stew", "soup", "roast-chicken", "butter-chicken", "shrimp", "pizza", "kids-menu"];

export const demoMenu: VideoMenuData = {
  business: "Dolci e Salati",
  logo: "/media/clients/dolci-e-salati-logo.png",
  instagram: "dolciesalati.ap",
  dishes,
  collections: [
    { id: "todos", name: "Todos", dishes: [...sweet, ...snacks, ...burgers, ...mains] },
    { id: "gelados", name: "Gelados e sobremesas", dishes: sweet },
    { id: "salgados", name: "Salgados e snacks", dishes: snacks },
    { id: "hamburgueres", name: "Hambúrgueres e sandes", dishes: burgers },
    { id: "pratos", name: "Pratos", dishes: mains },
  ],
};
