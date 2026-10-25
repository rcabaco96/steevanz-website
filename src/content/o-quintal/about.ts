// O Quintal: the shop's own words about each product (owner, 2026-10-25: «descrições muito más»). Written by
// Steevanz in pt-PT: taste, texture, how to use it and keep it — general truths about each fruit or vegetable.
// Never a fact about the business (origin, producer, farming method, season) unless o-quintal.com says it: those
// facts live in ./products.ts (`description`, verbatim from the site) and in ./facts.ts.
// Kept free of imports so the unit tests can load it directly.

export const oQuintalAbout: Readonly<Record<string, string>> = {
  // Cabazes
  "cabaz-de-frescos-legumes-e-frutas":
    "A forma mais simples de ter a fruteira e a gaveta dos legumes cheias durante a semana: nós escolhemos, o senhor só abre a caixa. Do mais pequeno ao Cabaz Grande, há um tamanho para cada casa.",
  "cabaz-preparado-para-sopas":
    "Cinco preparados de sopa já combinados, para pôr na panela e ter o jantar resolvido. Diga-nos o que não come e nós trocamos.",
  "cabaz-alheira-de-mirandela":
    "O jantar de domingo numa caixa: alheira assada ou frita, grelos salteados em alho, ovo estrelado, batata e uma garrafa de vinho para acompanhar. Chega para quatro pessoas.",

  // Fruta
  "pera-abacate":
    "Polpa macia e amanteigada, perfeita em torradas, saladas ou guacamole. Está pronto a comer quando cede ligeiramente à pressão do dedo; até lá, deixe-o amadurecer fora do frigorífico.",
  abacaxi:
    "Doce e ácido na medida certa, muito sumarento. Corte a coroa e a casca e sirva às rodelas, em espetadas de fruta ou grelhado com carne de porco. Depois de cortado, guarde no frigorífico.",
  banana:
    "Doce, macia e prática: o lanche que se leva para qualquer lado. Guarde fora do frigorífico; as mais maduras dão os melhores batidos e bolos de banana.",
  "dispiro-de-roer":
    "Variedade firme que se come como uma maçã, sem esperar que amoleça. Estaladiço, doce e sem a adstringência do dióspiro mole. Lave e trinque, com ou sem casca.",
  laranja:
    "Sumarenta e perfumada, tanto para espremer ao pequeno-almoço como para comer aos gomos. Conserva-se bem numa fruteira fresca ou na gaveta do frigorífico.",
  limao:
    "Ácido e aromático, indispensável para temperar peixe, saladas e chás, ou para uma limonada caseira. A casca ralada dá perfume a bolos e marinadas.",
  "maca-golden":
    "Polpa doce e suave, de textura macia. Ótima para comer à dentada, para compota ou assada no forno com canela.",
  "maca-royal-gala":
    "Crocante e sumarenta, com um sabor doce e delicado de que os miúdos gostam. Guarde no frigorífico para se manter firme mais tempo.",
  "manga-aviao":
    "Polpa doce, perfumada e sem fios, para comer à colher, em batidos ou numa salada de fruta tropical. Está no ponto quando cede ligeiramente e cheira bem junto ao pé.",
  papaia:
    "Polpa laranja, macia e doce. Abra ao meio, retire as sementes e coma à colher com umas gotas de limão. Muito boa ao pequeno-almoço.",
  "pera-rocha":
    "A pera portuguesa por excelência: sumarenta, doce e de polpa fina. Boa à dentada, cozida em vinho tinto ou numa tarte.",
  anonas:
    "Polpa branca, cremosa e muito doce, com um perfume único. Abra quando a casca ceder à pressão, coma à colher e deite fora as sementes.",
  "ameixa-preta":
    "Doce, com um toque ácido junto à casca e muito sumarenta. Para comer ao natural, em compotas ou assada com carne.",
  "uva-cardinal":
    "Bagos carnudos e doces, de casca fina. Lave só na altura de comer e guarde no frigorífico, de preferência no cacho.",
  "3kg-maca-royal-gala-pequena-alcobaca":
    "Uma caixa de 3 kg de maçã Royal Gala de Alcobaça, crocante e doce. Tamanho prático para a lancheira e para a fruteira da semana.",
  "3-kg-pera-rocha-oeste":
    "Três quilos de Pera Rocha do Oeste, sumarenta e de polpa fina. Para a fruteira da família, compotas ou sobremesas no forno.",
  "3kg-diospiro-roer":
    "Três quilos de dióspiro de roer, firme e estaladiço, que se come como uma maçã. Ótimo para levar e trincar a qualquer hora.",
  "3k-maca-golden-alcobaca":
    "Três quilos de maçã Golden de Alcobaça, doce e macia. Para comer à dentada ou fazer uma boa tarte de maçã.",
  "tamara-medjool":
    "Grandes, carnudas e com sabor a caramelo. Coma como estão, recheadas com noz ou queijo, ou use para adoçar batidos e bolos sem açúcar refinado. Guarde num sítio fresco e bem fechado.",
  "caixa-de-manga-palmer":
    "Uma caixa de mangas para a família ou para fazer batidos, sobremesas e saladas durante a semana. Deixe amadurecer à temperatura ambiente e passe para o frigorífico quando estiverem no ponto.",

  // Legumes
  abobora:
    "Polpa doce e alaranjada, base de uma sopa aveludada. Também fica ótima assada no forno em cubos, com um fio de azeite e alecrim.",
  agriao:
    "Folhas de sabor fresco e ligeiramente picante. Para a sopa de agrião clássica ou cru numa salada com laranja. Guarde num saco no frigorífico e use em poucos dias.",
  "alho-frances":
    "Sabor suave e adocicado, mais delicado do que a cebola. Ótimo em sopas, quiches e refogados. Lave bem entre as folhas antes de cozinhar.",
  "alface-frizada":
    "Folhas crespas e estaladiças, a base de uma boa salada. Lave e escorra bem; guardada num saco no frigorífico, mantém-se fresca vários dias.",
  "alho-seco":
    "Alho seco para o refogado de todos os dias, para o azeite de alho dos grelos e para as marinadas. Guarde num sítio seco e arejado, fora do frigorífico.",
  "batata-agria":
    "Batata de polpa firme e pouca água, que fica dourada por fora e macia por dentro quando frita. Também é boa para puré e no forno.",
  "batata-vermelha-lavada":
    "Batata para cozer que se mantém inteira na panela, ideal para acompanhar bacalhau, cozidos e saladas de batata.",
  "batata-miuda":
    "Batatinhas pequenas, perfeitas para assar inteiras com casca, alho e alecrim, ou para batatas a murro.",
  beringela:
    "Polpa macia que absorve bem os sabores. Grelhada, no forno com tomate e queijo, ou em ratatouille. Escolha-a firme e brilhante.",
  beterraba:
    "Doce e terrosa, com uma cor intensa. Coza ou asse com casca e depois descasque; também se rala crua para saladas.",
  "batata-doce":
    "Polpa doce e cremosa, deliciosa assada no forno, em puré ou em palitos. Guarde num sítio fresco e escuro, fora do frigorífico.",
  broculos:
    "Raminhos tenros e estaladiços. Cozidos a vapor poucos minutos para manterem a cor, salteados com alho ou na sopa.",
  "caldo-verde-250g":
    "Couve já cortada em juliana fina, pronta para o caldo verde. É só juntar à sopa de batata nos últimos minutos, com um fio de azeite e uma rodela de chouriço.",
  "cebola-roxa":
    "Mais suave e doce do que a cebola comum, com uma bonita cor. Crua em saladas e sanduíches ou em pickles rápidos com vinagre.",
  cebola:
    "A base de quase tudo: refogados, sopas, guisados e assados. Guarde num sítio seco e arejado, longe das batatas.",
  cenoura:
    "Doce e estaladiça, para a sopa, o arroz, o guisado ou para trincar crua. Guarde no frigorífico, sem a rama.",
  chuchu:
    "Sabor suave e textura fresca, bom em sopas, salteados e saladas. Descasque, retire a semente e corte a gosto.",
  "cogumelos-frescos-couvete-300g":
    "Cogumelos para saltear em manteiga e alho, juntar a um risotto ou a um molho de natas. Limpe com um pano húmido em vez de lavar e guarde no frigorífico.",
  "coentros-molho":
    "Perfume fresco que dá a alma à açorda, às amêijoas e às saladas. Guarde com os pés num copo de água no frigorífico.",
  courgetes:
    "Polpa tenra e sabor suave. Grelhada às rodelas, salteada, em sopas ou em esparguete de legumes.",
  "couve-coracao":
    "Folhas tenras e adocicadas, boas cozidas, salteadas ou cruas numa salada de couve. Aguenta bem no frigorífico.",
  "couve-lombardo":
    "Folhas frisadas e macias, ótimas para sopas, cozidos e para embrulhar recheios de carne.",
  "couve-portuguesa":
    "A couve das sopas e do cozido à portuguesa, de folhas largas e sabor intenso.",
  "couve-flor":
    "Branca, firme e versátil: cozida com azeite, gratinada no forno ou em puré. Separe em raminhos e coza poucos minutos.",
  espinafres:
    "Folhas tenras que cozinham num instante. Salteados com alho, em esparregado, em omeletes ou crus numa salada.",
  "feijao-verde":
    "Vagens estaladiças para a sopa, para o arroz de feijão-verde ou cozidas com azeite. Retire as pontas antes de cozinhar.",
  "grelos-de-nabo":
    "Sabor ligeiramente amargo e muito português: salteados em azeite e alho, a acompanhar alheira, rojões ou bacalhau.",
  hortela:
    "Folhas aromáticas e frescas para chás, saladas de fruta, sopa de grão ou um mojito. Guarde num copo com água no frigorífico.",
  nabicas:
    "Folhas tenras do nabo, de sabor suave e um toque amargo. Ótimas na sopa, salteadas ou a acompanhar carnes.",
  "nabo-sem-rama":
    "Sabor suave e ligeiramente picante, para a sopa, o cozido à portuguesa ou assado no forno com outros legumes.",
  pepino:
    "Fresco e estaladiço, para saladas, gaspacho ou tzatziki. Guarde no frigorífico e use em poucos dias.",
  "pimento-vermelho":
    "Doce e carnudo, mais suave do que o verde. Assado e pelado em azeite e alho, em refogados ou cru na salada.",
  "pimento-verde":
    "Sabor fresco e ligeiramente amargo, essencial em refogados, caldeiradas e na salada de tomate.",
  salsa:
    "A erva de todos os dias para temperar peixe, sopas e arroz. Guarde com os pés num copo de água ou embrulhada num pano húmido no frigorífico.",
  "tomate-salada":
    "Tomate firme e sumarento, para salada com cebola e orégãos ou para o refogado. Guarde fora do frigorífico para manter o sabor.",
  "grao-de-bico-seco-500g":
    "Para o cozido, a sopa de grão, saladas ou húmus caseiro. Demolhe de véspera e coza até ficar macio.",
  "feijao-encarnado-seco-500g":
    "Feijão de grão encarnado e cremoso, a base da feijoada à transmontana e do arroz de feijão. Demolhe de véspera antes de cozer.",
  "feijao-branco-seco-500g":
    "Grão branco e macio, para a feijoada, a dobrada ou uma salada de feijão com atum. Demolhe de véspera.",
  "feijao-preto-seco-500g":
    "Sabor intenso e textura cremosa, ideal para feijoada à brasileira, sopas e acompanhamentos de arroz. Demolhe de véspera.",
  "feijao-manteiga-seco-500g":
    "Grão grande e amanteigado que se desfaz na boca. Ótimo em guisados, saladas e sopas. Demolhe de véspera.",
  "feijao-catarino-seco-500g":
    "Feijão de pele fina e sabor delicado, bom em sopas e em arroz de feijão. Demolhe de véspera antes de cozer.",
  "feijao-frade-seco-500g":
    "Coze rapidamente e mantém-se inteiro: perfeito para a salada de feijão-frade com atum, ovo e cebola.",
  "rabanetes-500g":
    "Estaladiços e ligeiramente picantes, para dar cor e frescura às saladas. Também ficam bons assados no forno.",
  "grelos-de-couve":
    "Grelos tenros de sabor mais suave do que os de nabo. Salteados em azeite e alho, a acompanhar carne ou peixe.",
  "tomate-cherry":
    "Pequenos, doces e sumarentos. Para saladas, massas, espetadas ou assados no forno com azeite e manjericão.",
  "couve-roxa":
    "Estaladiça e de cor viva. Crua e cortada fina em saladas e coleslaw, ou estufada com maçã e vinagre.",
  "espargos-molho":
    "Tenros e delicados: cozidos poucos minutos, grelhados com azeite e sal grosso ou numa omelete. Corte a parte dura do pé.",
  "couve-chinesa":
    "Folhas tenras e estaladiças de sabor suave. Para saladas, salteados ao estilo oriental e sopas.",
  aipo:
    "Talos estaladiços e aromáticos, para sopas, caldos, saladas ou para petiscar com húmus. Guarde no frigorífico embrulhado em papel.",
  "couves-de-bruxelas-500g":
    "Pequenas couves de sabor adocicado quando bem cozinhadas. Assadas no forno com azeite até ficarem douradas, ou salteadas com bacon.",

  // Regionais
  "mel-de-rosmaninho-monte-dos-bens-1kg":
    "Mel multifloral para o pequeno-almoço, para adoçar o chá ou para regar um queijo fresco. Guarde bem fechado num sítio fresco; se cristalizar, aqueça em banho-maria.",
  "marmelada-quinta-dos-jugais-500g":
    "Marmelada firme de receita tradicional, para cortar às fatias e servir com queijo da serra ou queijo fresco, ou no pão do lanche.",
  "marmelada-com-noz-quinta-dos-jugais-500g":
    "A marmelada tradicional com pedaços de noz, que lhe dão um toque crocante. Excelente com queijo curado.",
  "4-alheiras-de-mirandela":
    "Alheiras para assar no forno, grelhar ou fritar, servidas com grelos salteados, ovo estrelado e batata frita. Pode escolher a clássica ou com caça.",

  // Mercearia
  "caixa-5-duzias-ovos":
    "Cinco dúzias de ovos para quem cozinha muito, para restaurantes ou para dividir entre vizinhos. Escolha o tamanho L, XL ou matinados.",
  "leite-nido-25kg":
    "Leite em pó Nido da Nestlé, prático para ter sempre na despensa: dissolva em água morna para um copo de leite, ou junte ao café e aos batidos. Depois de aberta, guarde a embalagem bem fechada num sítio seco.",
};
