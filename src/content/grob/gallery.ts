import { grobPhotos, type GrobPhotoId } from "./facts";

// As galerias do site: todas as boas fotografias do site atual do clube (ver LICENCAS.txt), com o que mostram.
export interface GrobGalleryItem {
  id: GrobPhotoId;
  src: string;
  width: number;
  height: number;
  alt: string;
}

function items(list: [GrobPhotoId, string][]): GrobGalleryItem[] {
  return list.map(([id, alt]) => ({ id, alt, ...grobPhotos[id] }));
}

/** «A família GROB», 1.ª faixa: em jogo, de todos os escalões e modalidades (Instagram do clube e site atual). */
export const grobFamilyPlay = items([
  ["futsalSenioresConducao", "Seniores: um jogador do GROB em condução, com a bancada cheia atrás"],
  ["futsalSub15Remate", "Sub-15: remate de pé esquerdo num jogo do Nacional, no pavilhão do Sporting"],
  ["futsalSub19FestejoGolo", "Sub-19: abraço de grupo a festejar um golo"],
  ["futsalTraquinasFestejo", "Traquinas a festejar em grupo com os treinadores"],
  ["futsalSub10Lance", "Sub-10: drible frente a um adversário de branco"],
  ["tenisDeMesaJovensJogo", "Ténis de mesa: jovens do GROB a jogar na sede"],
  ["futsalSub15GritoDeEquipa", "Sub-15: a equipa de braços no ar junto ao banco"],
  ["futsalSub17Remate", "Sub-17: remate num jogo fora"],
  ["futsalSenioresRoda", "Seniores: a equipa em roda no centro do campo"],
  ["tenisDeMesaSenioresSede", "Ténis de mesa: um sénior do GROB a servir"],
  ["futsalSub11BenjaminsLance", "Sub-11: um benjamim a correr de braço esticado"],
  ["futsalSub19Lance", "Sub-19: disputa de bola com a bancada atrás"],
  ["futsalPetizesOdifut", "Os petizes do GROB em grupo no torneio ODIFUT"],
  ["futsalSub15Remate2", "Sub-15: remate num jogo em casa"],
  ["tenisDeMesaVeteranosSalou", "Ténis de mesa: dois veteranos do GROB num torneio internacional em Salou"],
  ["futsalDez", "Um jogador do GROB, com o número 10, a conduzir a bola"],
  ["futsalVermelhos", "Um jogador do GROB entre dois adversários de vermelho"],
  ["futsalNumero5", "Um jogador do GROB a avançar com a bola perante um adversário"],
  ["praiaJogador", "Um jogador a dominar a bola na areia"],
  ["futsalAzuis", "Um jogador do GROB, número 10, entre adversários de azul"],
]);

/** «A família GROB», 2.ª faixa: as pessoas, as festas e as conquistas. */
export const grobFamilyPeople = items([
  ["diaDaMae2026", "Treino do Dia da Mãe: mães e filhos de braços no ar no pavilhão"],
  ["sub19DobradinhaFestejo", "Sub-19 a erguer a taça, em festa"],
  ["convivioNatal2025", "Natal de 2025: fotografia de grupo dos escalões de formação"],
  ["adeptosFestejoTacaNacional", "Pais e adeptos a festejar na bancada com um atleta"],
  ["tacaNacionalSub192026", "Os Sub-19 com a faixa da Taça Nacional, na Covilhã"],
  ["diaDoPai2026", "Treino do Dia do Pai: pais e filhos em grupo no pavilhão"],
  ["bancada", "Adeptos do GROB na bancada, com megafone e um cachecol de Olival Basto"],
  ["tacaNacionalSub152026", "Os Sub-15 com a faixa da Taça Nacional, na Covilhã"],
  ["galaDesportoOdivelas2026", "A delegação do GROB no palco da Gala do Desporto de Odivelas"],
  ["viagemAcoresSub19", "Os Sub-19 em grupo nos Açores"],
  ["trofeuCampeaoSub19", "A taça e as medalhas de campeão dos Sub-19"],
  ["tenisDeMesaConvivioJovens", "Ténis de mesa: jovens e treinadores num convívio na sede"],
  ["sub19aCampeoesComAdeptos", "Os Sub-19 campeões com os pais e adeptos na bancada"],
  ["familia", "Dezenas de atletas da formação do GROB numa fotografia de grupo no pavilhão"],
  ["praiaSines2025", "Sub-15 e Sub-17 em fila na praia de Sines"],
  ["treinadorDobradinhaSub19", "O treinador dos Sub-19 com as duas taças da dobradinha"],
  ["sedeTorneioKing", "Sócios a jogar às cartas no Torneio Social de King, na sede"],
  ["equipaSeniores2026", "A equipa sénior de futsal à frente da baliza"],
  ["sub19aCampeoesFestejo", "Os Sub-19 campeões a festejar com a taça e as medalhas"],
  ["equipaTenisDeMesaSeniores", "A equipa sénior de ténis de mesa com a adversária, na sede"],
  ["equipaSub19bCampeoes", "Os Sub-19B campeões, com famílias e equipa técnica"],
  ["grito", "Uma equipa do GROB abraçada em roda antes do jogo"],
  ["equipaSub17Nacional", "A equipa de Sub-17"],
  ["zumba", "Uma aula de zumba, com o cartaz da modalidade ao fundo"],
  ["equipa", "Uma equipa de formação do GROB com os treinadores, num pavilhão"],
  ["praiaEquipa", "Uma equipa de futebol de praia numa fotografia de grupo na areia"],
  ["aulaSolo", "Uma aula de grupo, em tapetes, num salão do clube"],
]);

/** Todas as fotografias da família, pela ordem das faixas (para a galeria em ecrã inteiro). */
export const grobFamilyGallery = [...grobFamilyPlay, ...grobFamilyPeople];

/** A sede renovada, por dentro e por fora (página Sede). */
export const grobSedeGallery = items([
  ["sedeFachada", "A fachada branca da sede, na Rua de Angola"],
  ["sedeInauguracao2026", "O público sentado na inauguração da sede renovada, em março de 2026"],
  ["sedeSalaoTorneio", "O salão renovado cheio de mesas de jogo num torneio social"],
  ["sedeSalaoTenisDeMesa", "Um salão com uma mesa de ténis de mesa, num evento de empresa"],
  ["sedeSalao", "Um salão de 120 m², de paredes brancas e chão cinzento"],
  ["sedeTerraco", "O terraço do Piso 1, com bancos altos e um grelhador"],
  ["sedeEscada", "A escada entre os dois pisos, com luz de linha no teto"],
  ["sedeSalao3", "O outro salão, de teto escuro, com um painel de pé"],
  ["sedeGrelhador", "O grelhador no terraço, ao sol"],
  ["sedeCorredor", "O corredor e a escada do Piso 0"],
  ["sedeSalao4", "Um salão com luz de teto, visto da porta"],
  ["sedeCopa", "A copa, com armários brancos e lava-loiça"],
  ["sedeEscada2", "Um corredor com linhas de luz no teto"],
  ["sedeTerraco2", "O terraço, com o grelhador e as cadeiras"],
  ["sedeSalao2", "Um salão vazio, pronto para uma aula ou uma festa"],
  ["sedeCorredor2", "O corredor do Piso 0, com um balcão"],
  ["sedeEscada3", "A escada, com degraus escuros e corrimão preto"],
  ["sedeBalneario", "Um dos balneários, com os duches"],
  ["sedeWc", "Uma das casas de banho, com lavatório branco"],
  ["sedePlaca", "A placa da reabilitação da sede, inaugurada a 20 de março de 2026"],
]);
