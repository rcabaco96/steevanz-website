// Factos do GROB — Grupo Recreativo Olival Basto, recolhidos a 2026-11-02. Só de fontes; o que falta fica
// «a confirmar com o clube» (ver `toConfirm`). Fontes:
//  - o site atual do clube, https://www.grolivalbasto.com (páginas O Clube, Sede, Infraestruturas, Contactos,
//    Inscrições, Sócios, Símbolo e o PDF vetorial do logótipo);
//  - a placa da sede (fotografia publicada na página Sede): «Reabilitação da sede do Grupo Recreativo Olival Basto.
//    Inaugurada pelo Presidente da Câmara Municipal de Odivelas, Hugo Martins, sendo o Presidente do GROB, Luís
//    Fadista. 20 de março de 2026.»;
//  - Record, 14/10/2026, artigo de opinião de Francisco Baptista (vereador do Desporto da CM Odivelas).
// Media: public/media/clients/grob/LICENCAS.txt.

const media = "/media/clients/grob";

export const grob = {
  name: "Grupo Recreativo Olival Basto",
  short: "GROB",
  /** «Fundação: 06/06/1937» (página O Clube). */
  foundedIso: "1937-06-06",
  foundedYear: 1937,
  foundedLabel: "6 de junho de 1937",
  locality: "Olival Basto",
  municipality: "Odivelas",
  parish: "União das Freguesias da Póvoa de Santo Adrião e Olival Basto",
  /** «aproximadamente 400 atletas ativos e centenas de sócios» (O Clube). */
  athletes: 400,
  /** «Medalha de Ouro de Dedicação Pública», CM Odivelas, no 27.º aniversário do Município (O Clube). */
  medal: "Medalha de Ouro de Dedicação Pública",

  phoneSport: "961 573 255",
  phoneSportHref: "tel:+351961573255",
  phoneEvents: "961 573 206",
  phoneEventsHref: "tel:+351961573206",
  /** Página Contactos. (A página Sede mostra geral@ e eventos@grolivalbasto.com: a confirmar qual usar.) */
  emailGeneral: "geral.grob@gmail.com",
  emailEvents: "eventos.grob@gmail.com",
  emailFutsal: "futsal.grob@gmail.com",
  emailTableTennis: "tenisdemesa.grob@gmail.com",

  /** Quota de sócio: «por apenas 1,5 € por mês» (página Sócios); o formulário do clube (Google Forms). */
  memberFee: "1,50 €",
  memberForm: "https://forms.gle/fS1ftAWzwuMcQpZMA",
  /** O logótipo vetorial que o clube publica na página Símbolo. */
  logoPdf: "https://www.grolivalbasto.com/_files/ugd/d9e9b5_1ad16b5b44454ef38ac8a9a46da8a54e.pdf",

  social: {
    instagram: "https://www.instagram.com/grob.olivalbasto/",
    facebook: "https://www.facebook.com/GROBOLIVALBASTO/",
    tiktok: "https://www.tiktok.com/@grob.olivalbasto",
    youtube: "https://www.youtube.com/channel/UCfuXW7RJtJEN9FIb_L232EA",
  },

  /** Coordenadas dos dados de negócio do site atual (Wix). */
  latitude: 38.7912444,
  longitude: -9.1633483,
  country: "PT",

  media: {
    emblem: `${media}/emblema.webp`,
    emblemSmall: `${media}/emblema-pequeno.webp`,
    emblemPng: `${media}/emblema.png`,
    emblemTexture: `${media}/emblema-textura.webp`,
    favicon: `${media}/icone.ico`,
    icon192: `${media}/icone-192.png`,
    icon512: `${media}/icone-512.png`,
    appleIcon: `${media}/icone-apple.png`,
    og: `${media}/og-site.jpg`,
    emblemStill: `${media}/emblema-3d.webp`,
  },
} as const;

/** Os três espaços do clube (página Infraestruturas). */
export const grobPlaces = [
  {
    id: "sede",
    name: "Sede",
    street: "Rua de Angola, n.º 45",
    postalCode: "2620-036",
    locality: "Olival Basto",
    /** Abre logo o Google Maps (a app, se existir; senão o site): nada de mapas embutidos (dono, 2026-11-02). */
    maps: "https://www.google.com/maps/search/?api=1&query=Rua%20de%20Angola%2045%2C%202620-036%20Olival%20Basto",
    directions: "https://www.google.com/maps/dir/?api=1&destination=Rua%20de%20Angola%2045%2C%202620-036%20Olival%20Basto",
  },
  {
    id: "pavilhao",
    name: "Pavilhão da Escola Secundária Pedro Alexandrino",
    street: "Rua Aquilino Ribeiro",
    postalCode: "2620-182",
    locality: "Póvoa de Santo Adrião",
    /** Abre logo o Google Maps (a app, se existir; senão o site): nada de mapas embutidos (dono, 2026-11-02). */
    maps: "https://www.google.com/maps/search/?api=1&query=Escola%20Secund%C3%A1ria%20Pedro%20Alexandrino%2C%20Rua%20Aquilino%20Ribeiro%2C%202620-182%20P%C3%B3voa%20de%20Santo%20Adri%C3%A3o",
    directions: "https://www.google.com/maps/dir/?api=1&destination=Escola%20Secund%C3%A1ria%20Pedro%20Alexandrino%2C%20Rua%20Aquilino%20Ribeiro%2C%202620-182%20P%C3%B3voa%20de%20Santo%20Adri%C3%A3o",
  },
  {
    id: "ringue",
    name: "Ringue de Olival Basto",
    street: "Rua Açores",
    postalCode: "2620-032",
    locality: "Olival Basto",
    /** Abre logo o Google Maps (a app, se existir; senão o site): nada de mapas embutidos (dono, 2026-11-02). */
    maps: "https://www.google.com/maps/search/?api=1&query=Rua%20A%C3%A7ores%2C%202620-032%20Olival%20Basto",
    directions: "https://www.google.com/maps/dir/?api=1&destination=Rua%20A%C3%A7ores%2C%202620-032%20Olival%20Basto",
  },
] as const;

export type GrobModalityGroup = "competicao" | "bem-estar" | "lazer";

export interface GrobModality {
  id: string;
  name: string;
  group: GrobModalityGroup;
  /** Escalões (página O Clube); vazio quando o site não os indica. */
  levels: readonly string[];
  email: string;
  photo: GrobPhotoId | null;
  /** O que a fotografia mostra (nem todas são da própria modalidade). */
  photoAlt: string;
  /** Onde fica o assunto na fotografia (para o recorte vertical dos cartões). */
  photoPosition?: string;
}

/** Modalidades (página O Clube: competição, saúde e bem-estar, lazer). */
export const grobModalities: readonly GrobModality[] = [
  {
    id: "futsal",
    name: "Futsal",
    group: "competicao",
    levels: ["Seniores", "Sub19", "Sub17", "Sub15", "Sub13", "Sub11", "Sub9", "Sub7", "Sub5"],
    email: grob.emailFutsal,
    photo: "futsalSub19Lance",
    photoAlt: "Sub-19 do GROB numa disputa de bola, com a bancada atrás",
    photoPosition: "50% 40%",
  },
  {
    id: "tenis-de-mesa",
    name: "Ténis de Mesa",
    group: "competicao",
    levels: ["Veteranos", "Seniores", "Sub19", "Sub17", "Sub15", "Sub13", "Sub11", "Sub9"],
    email: grob.emailTableTennis,
    photo: "tenisDeMesaSenioresSede",
    photoAlt: "Um sénior do GROB a servir num jogo de ténis de mesa",
    photoPosition: "50% 35%",
  },
  { id: "yoga", name: "Yoga", group: "bem-estar", levels: [], email: grob.emailGeneral, photo: "aulaSolo", photoAlt: "Uma aula de grupo, em tapetes, num salão do clube", photoPosition: "40% 55%" },
  { id: "pilates-clinico", name: "Pilates Clínico", group: "bem-estar", levels: [], email: grob.emailGeneral, photo: "sedeSalao", photoAlt: "Um dos salões de 120 m² da sede renovada" },
  { id: "zumba", name: "Zumba", group: "bem-estar", levels: [], email: grob.emailGeneral, photo: "zumba", photoAlt: "Uma aula de zumba, com o cartaz da modalidade ao fundo", photoPosition: "45% 50%" },
  { id: "matraquilhos", name: "Matraquilhos", group: "lazer", levels: [], email: grob.emailGeneral, photo: null, photoAlt: "" },
];

/** A sede (página Sede + placa). */
export const grobSede = {
  renovatedYear: 2026,
  inaugurated: "20 de março de 2026",
  inauguratedBy: "Hugo Martins, Presidente da Câmara Municipal de Odivelas",
  clubPresident: "Luís Fadista",
  area: 550,
  floorArea: 275,
  floors: [
    { name: "Piso 0", items: ["1 salão com 120 m²", "3 WC", "2 balneários (masculino e feminino)", "2 salas de arrumos"] },
    { name: "Piso 1", items: ["1 salão com 120 m²", "2 WC", "1 copa", "1 terraço", "1 sala de arrumos"] },
  ],
  /** Horários da sede (página Sede). */
  hoursSport: "Dias úteis, das 17h às 22h (Piso 0 e Piso 1)",
  hoursEventsWeekdays: "Dias úteis, das 8h às 17h",
  hoursEventsWeekend: [
    "Piso 0 e Piso 1, manhã: 9h–13h",
    "Piso 0 e Piso 1, tarde: 14h–18h",
  ],
  rental: "Aluguer por período, dia completo ou todos os pisos o dia completo.",
} as const;

/** Citação verificada (Record, 14/10/2026, Francisco Baptista). */
export const grobPress = {
  quote: "Zicky Té passou pelo GROB e pelo Póvoa de Santo Adrião Atlético Clube (PSAAC) antes de chegar ao Sporting.",
  source: "Record",
  author: "Francisco Baptista, vereador do Desporto da Câmara Municipal de Odivelas",
  date: "14 de outubro de 2026",
  url: "https://www.record.pt/opiniao/detalhe/o-que-tem-em-comum-zicky-te-kutchy-os-irmaos-paco-pedro-santos-mamadu-ture-e-maria-rocha",
} as const;

/** Fotografias do clube (site atual, as originais recodificadas em alta qualidade, e o Instagram do clube; ver
 *  LICENCAS.txt e ig/FONTES.txt), com as medidas dos ficheiros. */
export const grobPhotos = {
  futsalAtaque: { src: `${media}/ig/futsal-ataque-hq.webp`, width: 2000, height: 983 },
  futsalRemate: { src: `${media}/ig/futsal-remate-hq.webp`, width: 2000, height: 1331 },
  futsalVermelhos: { src: `${media}/ig/futsal-vermelhos-hq.webp`, width: 2000, height: 1331 },
  futsalNumero5: { src: `${media}/ig/futsal-numero-5-hq.webp`, width: 2000, height: 1331 },
  futsalDrible: { src: `${media}/futsal-drible.webp`, width: 2000, height: 1331 },
  futsalConducao: { src: `${media}/futsal-conducao.webp`, width: 2000, height: 1331 },
  futsalAzuis: { src: `${media}/ig/futsal-azuis-hq.webp`, width: 2000, height: 1104 },
  futsalDez: { src: `${media}/ig/futsal-dez-hq.webp`, width: 2000, height: 1331 },
  bancada: { src: `${media}/ig/bancada-hq.webp`, width: 2000, height: 1500 },
  familia: { src: `${media}/ig/familia-grob-hq.webp`, width: 2000, height: 1423 },
  equipa: { src: `${media}/ig/equipa-hq.webp`, width: 2000, height: 1250 },
  grito: { src: `${media}/grito.webp`, width: 1500, height: 1271 },
  praiaEquipa: { src: `${media}/ig/praia-equipa-hq.webp`, width: 2000, height: 1075 },
  praiaJogador: { src: `${media}/ig/praia-jogador-hq.webp`, width: 1328, height: 2000 },
  tenisDeMesa: { src: `${media}/ig/tenis-de-mesa-hq.webp`, width: 2000, height: 1500 },
  zumba: { src: `${media}/ig/zumba-hq.webp`, width: 1920, height: 1440 },
  aulaSolo: { src: `${media}/aula-solo.webp`, width: 1024, height: 766 },
  sedeFachada: { src: `${media}/ig/sede-fachada-hq.webp`, width: 2000, height: 1333 },
  sedeTerraco: { src: `${media}/ig/sede-terraco-hq.webp`, width: 2000, height: 1333 },
  sedeSalao: { src: `${media}/ig/sede-salao-hq.webp`, width: 2000, height: 1333 },
  sedeSalao2: { src: `${media}/ig/sede-salao-2-hq.webp`, width: 2000, height: 1333 },
  sedeCorredor: { src: `${media}/ig/sede-corredor-hq.webp`, width: 2000, height: 1333 },
  sedeEscada: { src: `${media}/ig/sede-escada-hq.webp`, width: 2000, height: 1333 },
  sedeCopa: { src: `${media}/ig/sede-copa-hq.webp`, width: 2000, height: 1333 },
  sedePlaca: { src: `${media}/ig/sede-placa-hq.webp`, width: 2000, height: 1333 },
  sedeBalneario: { src: `${media}/sede-balneario.webp`, width: 2000, height: 1333 },
  sedeSalao3: { src: `${media}/sede-salao-3.webp`, width: 2000, height: 1333 },
  sedeSalao4: { src: `${media}/sede-salao-4.webp`, width: 1333, height: 2000 },
  sedeGrelhador: { src: `${media}/sede-grelhador.webp`, width: 1333, height: 2000 },
  sedeTerraco2: { src: `${media}/sede-terraco-2.webp`, width: 1333, height: 2000 },
  sedeEscada2: { src: `${media}/sede-escada-2.webp`, width: 1333, height: 2000 },
  sedeEscada3: { src: `${media}/sede-escada-3.webp`, width: 1333, height: 2000 },
  sedeCorredor2: { src: `${media}/sede-corredor-2.webp`, width: 2000, height: 1333 },
  sedeWc: { src: `${media}/sede-wc.webp`, width: 1333, height: 2000 },
  // Do Instagram do clube (@grob.olivalbasto, @grob.sede e posts em colaboração; ver ig/FONTES.txt).
  adeptosFestejoTacaNacional: { src: `${media}/ig/adeptos-festejo-taca-nacional.webp`, width: 2000, height: 1334 },
  convivioNatal2025: { src: `${media}/ig/convivio-natal-2025.webp`, width: 1440, height: 1080 },
  diaDaMae2026: { src: `${media}/ig/dia-da-mae-2026.webp`, width: 1440, height: 1080 },
  diaDoPai2026: { src: `${media}/ig/dia-do-pai-2026.webp`, width: 1440, height: 1081 },
  equipaSeniores2026: { src: `${media}/ig/equipa-seniores-2026.webp`, width: 2000, height: 1500 },
  equipaSub17Nacional: { src: `${media}/ig/equipa-sub17-nacional.webp`, width: 1280, height: 1024 },
  equipaSub19bCampeoes: { src: `${media}/ig/equipa-sub19b-campeoes.webp`, width: 2000, height: 1250 },
  equipaTenisDeMesaSeniores: { src: `${media}/ig/equipa-tenis-de-mesa-seniores.webp`, width: 1500, height: 1125 },
  futsalPetizesOdifut: { src: `${media}/ig/futsal-petizes-odifut.webp`, width: 1197, height: 895 },
  futsalSenioresConducao: { src: `${media}/ig/futsal-seniores-conducao.webp`, width: 2000, height: 1500 },
  futsalSenioresRoda: { src: `${media}/ig/futsal-seniores-roda.webp`, width: 2000, height: 1500 },
  futsalSub10Lance: { src: `${media}/ig/futsal-sub10-lance.webp`, width: 1440, height: 1800 },
  futsalSub11BenjaminsLance: { src: `${media}/ig/futsal-sub11-benjamins-lance.webp`, width: 1280, height: 853 },
  futsalSub15GritoDeEquipa: { src: `${media}/ig/futsal-sub15-grito-de-equipa.webp`, width: 2000, height: 1500 },
  futsalSub15Remate2: { src: `${media}/ig/futsal-sub15-remate-2.webp`, width: 1440, height: 1059 },
  futsalSub15Remate: { src: `${media}/ig/futsal-sub15-remate.webp`, width: 2000, height: 1500 },
  futsalSub17Remate: { src: `${media}/ig/futsal-sub17-remate.webp`, width: 1440, height: 1797 },
  futsalSub19FestejoGolo: { src: `${media}/ig/futsal-sub19-festejo-golo.webp`, width: 1440, height: 1800 },
  futsalSub19Lance: { src: `${media}/ig/futsal-sub19-lance.webp`, width: 1440, height: 1800 },
  futsalTraquinasFestejo: { src: `${media}/ig/futsal-traquinas-festejo.webp`, width: 2000, height: 1500 },
  galaDesportoOdivelas2026: { src: `${media}/ig/gala-desporto-odivelas-2026.webp`, width: 2000, height: 1500 },
  praiaSines2025: { src: `${media}/ig/praia-sines-2025.webp`, width: 1440, height: 1080 },
  sedeInauguracao2026: { src: `${media}/ig/sede-inauguracao-2026.webp`, width: 1440, height: 1440 },
  sedeSalaoTenisDeMesa: { src: `${media}/ig/sede-salao-tenis-de-mesa.webp`, width: 1500, height: 2000 },
  sedeSalaoTorneio: { src: `${media}/ig/sede-salao-torneio.webp`, width: 1984, height: 1125 },
  sedeTorneioKingVencedores: { src: `${media}/ig/sede-torneio-king-vencedores.webp`, width: 1126, height: 638 },
  sedeTorneioKing: { src: `${media}/ig/sede-torneio-king.webp`, width: 1984, height: 1125 },
  sub19DobradinhaFestejo: { src: `${media}/ig/sub19-dobradinha-festejo.webp`, width: 2000, height: 1600 },
  sub19aCampeoesComAdeptos: { src: `${media}/ig/sub19a-campeoes-com-adeptos.webp`, width: 1440, height: 1150 },
  sub19aCampeoesFestejo: { src: `${media}/ig/sub19a-campeoes-festejo.webp`, width: 1440, height: 1152 },
  tacaNacionalSub152026: { src: `${media}/ig/taca-nacional-sub15-2026.webp`, width: 2000, height: 1343 },
  tacaNacionalSub192026: { src: `${media}/ig/taca-nacional-sub19-2026.webp`, width: 2000, height: 1334 },
  tenisDeMesaConvivioJovens: { src: `${media}/ig/tenis-de-mesa-convivio-jovens.webp`, width: 2000, height: 1500 },
  tenisDeMesaJovensJogo: { src: `${media}/ig/tenis-de-mesa-jovens-jogo.webp`, width: 2000, height: 1500 },
  tenisDeMesaSenioresMafra: { src: `${media}/ig/tenis-de-mesa-seniores-mafra.webp`, width: 2000, height: 1328 },
  tenisDeMesaSenioresSede: { src: `${media}/ig/tenis-de-mesa-seniores-sede.webp`, width: 1024, height: 1280 },
  tenisDeMesaVeteranosSalou: { src: `${media}/ig/tenis-de-mesa-veteranos-salou.webp`, width: 2000, height: 1500 },
  treinadorDobradinhaSub19: { src: `${media}/ig/treinador-dobradinha-sub19.webp`, width: 2000, height: 1600 },
  trofeuCampeaoSub19: { src: `${media}/ig/trofeu-campeao-sub19.webp`, width: 2000, height: 1600 },
  viagemAcoresSub19: { src: `${media}/ig/viagem-acores-sub19.webp`, width: 1200, height: 985 },
} as const;

export type GrobPhotoId = keyof typeof grobPhotos;

/** O que o site atual não diz e fica, visível e sóbrio, «a confirmar com o clube». */
export const toConfirm = "a confirmar com o clube";

/** Anos desde a fundação, à data dada (o dia 6 de junho conta). */
export function grobAge(today: Date): number {
  const years = today.getFullYear() - grob.foundedYear;
  const beforeBirthday = today.getMonth() < 5 || (today.getMonth() === 5 && today.getDate() < 6);
  return beforeBirthday ? years - 1 : years;
}
