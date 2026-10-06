---
name: regras-negocio-reviews
description: Regras de negócio obrigatórias do produto de reviews Google da Steevanz (painel /painel, importação Apify, alertas, concorrência). Usar antes de alterar qualquer coisa em src/lib/reviews, src/components/reviews, rotas /api/painel, /api/cron, /r/[plate] ou /admin/reviews.
---

# Regras de negócio — reviews Google

Estas regras foram decididas com o dono do produto. Não as alteres sem pedir confirmação.

## 1. Nunca inventar reviews

Regra absoluta. Nada de reviews, notas ou negócios fictícios: nem em demos, seeds, capturas,
placeholders ou marketing. O painel só mostra reviews reais importadas do Google. Sem dados,
mostra-se um estado vazio. Para demonstrar o produto usa-se um negócio real que autorizou
(ex.: a própria Steevanz). Fixtures de testes ficam mínimas (só números e datas) e nunca são
mostradas.

## 2. Negativas e positivas

- **Negativa: 1 a 3 estrelas. Positiva: 4 a 5 estrelas.** Não existe "neutra".
- Usar sempre `isNegative` / `isPositive` de `src/lib/reviews/analytics.ts`. Nunca escrever
  `rating <= 2` ou semelhantes à mão.
- Vale para filtros, sentimento, temas "A melhorar", palavras, alertas por email, promoção da
  Gestão de Reviews com IA e recomendações.

## 3. Importação de reviews: só o que ainda não temos

Nunca reimportar o histórico inteiro a cada visita. Cada sincronização começa na review mais
recente já guardada (`syncBusinessReviews(client, business, mode)` em
`src/lib/reviews/store.ts`):

| Modo      | Quando                                         | A partir de                          | Porquê                                  |
| --------- | ---------------------------------------------- | ------------------------------------ | --------------------------------------- |
| `visit`   | Botões "Atualizar reviews" / "Atualizar"       | Review mais recente − 1 dia          | Só reviews novas; o caso mais frequente e barato |
| `refresh` | Rotina diária (só quem não atualizou nesse dia), "Sincronizar agora" no admin | Review mais recente − 30 dias | Respostas recentes do dono, reviews editadas |
| `full`    | 1× por mês por negócio (cron), "Reimportar tudo" no admin, primeira importação | Todo o histórico (máx. 3000) | Respostas do dono a reviews antigas |

- A margem de 1 dia cobre atrasos de indexação do Google e fusos horários.
- As reviews são gravadas com `upsert` por `review_id`: a sobreposição nunca duplica nada.
- O Google não permite pedir "reviews respondidas recentemente": por isso existe o modo `full`
  mensal. Uma resposta a uma review antiga aparece, no máximo, um mês depois (ou logo, com o
  botão "Reimportar tudo").
- A data da última leitura completa fica em `review_businesses.full_synced_at`.

- **Abrir ou recarregar uma página do painel nunca vai ao Google.** Só os botões «Atualizar»
  (e os crons) importam reviews ou preparam respostas.
- **O botão «Atualizar» só atualiza as reviews desse cliente** (nunca a concorrência nem outros
  clientes).
- **Uma rotina diária, ao fim do dia** (`/api/cron/sync-reviews`, 22:00 UTC = 23:00/22:00 em
  Lisboa), atualiza os clientes que **não** carregaram em «Atualizar» nesse dia (dia de calendário
  em Portugal). Quem já atualizou fica de fora: poupa créditos do Apify. Exceção: a leitura
  completa mensal (`full`) corre sempre que estiver em atraso, senão um cliente que atualiza
  todos os dias nunca teria as respostas a reviews antigas verificadas. Regra em
  `src/lib/reviews/sync-rules.ts`.

## 4. Controlo de custos (Apify)

- No máximo **uma sincronização por negócio a cada 5 minutos** pelos botões do painel, e nunca duas
  em paralelo (função `try_start_review_sync` com cadeado na base de dados).
- `personalData: false` sempre: não guardamos nomes, fotos nem perfis de quem escreveu.
- Ao alterar volumes (nº de concorrentes, frequência, janelas), estimar o custo por cliente e
  dizê-lo ao dono antes de avançar. Referência: plano Free 5 USD/mês, Starter 19 USD/mês.

## 5. Concorrência

- Gratuita para todos os clientes. **30 concorrentes num raio de 10 km** (`competitorRadiusKm`).
  Mudar o raio só vale para procuras novas: os concorrentes atuais mantêm-se até à próxima procura
  (de 90 em 90 dias, ou «Procurar concorrentes» no admin). Uma procura completa custa ~1,5 USD
  por cliente com 30 concorrentes (procura + distribuição de estrelas + 60 reviews de cada um para
  ritmo e % respondidas): confirmar o crédito do Apify antes de a lançar.
- Escolha automática: mesma categoria do Google primeiro (os com mais reviews), depois os que o
  Google associa à pesquisa da categoria, depois a pesquisa mais larga. O admin pode excluir.
- Só dados públicos agregados (nota, total de reviews, distribuição de estrelas, % de reviews
  respondidas com o nº de reviews contadas). Nunca guardar textos de reviews de concorrentes.
- **% de reviews respondidas** («Respondidas» na tabela): vem da mesma leitura que mede o ritmo
  (60 reviews mais recentes por concorrente, sem custo extra). Conta reviews publicadas entre 12
  meses e 7 dias atrás (7 dias para o dono ter tempo de responder); escondida com menos de 5. O
  cliente é medido com a mesma regra a partir de `google_reviews.owner_reply`. Medida uma vez
  por concorrente, quando entra na comparação.
- Atualização semanal em lotes pelo cron diário; nova procura a cada 90 dias.

## 6. Limites técnicos

- Funções na Vercel: máximo 300 s (plano Hobby com Fluid compute, `"fluid": true` no
  `vercel.json`). Qualquer trabalho maior é partido em lotes que o cron diário completa.
- Leituras ao Supabase acima de 1000 linhas têm de ser paginadas.

## 7. Tudo o que calculamos explica-se

Qualquer número, classificação ou etiqueta construída com critérios nossos (ritmo de reviews,
respostas, meta de estrelas, posições na concorrência, «Ponto forte» / «A melhorar», antes e
depois, negativas 1–3★, recomendações, destaques…) tem um ícone **(i)** com a lógica em
português simples: o que é contado, a janela de tempo, os mínimos de amostra e se é uma
estimativa.

- Componente: `InfoTip` (`src/components/reviews/InfoTip.tsx`), que abre ao passar o rato e
  ao tocar no telemóvel.
- Os textos ficam todos em `infoTexts` em `ReviewsDashboard.tsx`. Ao mudar uma regra de
  cálculo, atualizar o texto correspondente na mesma alteração.
- Dados que vêm tal e qual do Google (ex.: o texto de uma review) não precisam de (i).

## 8. Interface

- Mobile first: desenhar e verificar a 320/360 px antes do desktop.

## 9. Sem toques nas placas

As placas gravam diretamente o link de avaliação do Google, por isso **não medimos toques nem
conversão toque → review**. Não voltar a mostrar números de toques sem antes garantir uma
forma fiável de os contar. As tabelas `nfc_plates` e `nfc_taps` ficaram na base de dados,
paradas e vazias.

## 10. Carregamentos

Seguir a skill `skeletons`: blocos que atualizam mostram skeleton, só nas partes que mudam.

## 11. Respostas às reviews (`/painel/[slug]/respostas`)

- **Sem IA paga.** As respostas são montadas por regras (`src/lib/reviews/reply-rules.ts`):
  abertura → uma frase por tema da review (pela ordem em que aparecem) → contacto (negativas) →
  fecho → assinatura. Usa primeiro as frases do próprio cliente; só sem frase dele para o caso usa
  as frases-base da Steevanz. Custo zero. Reviews em inglês recebem uma resposta-base em inglês.
- Ainda **não está ligado ao Google**: «Aceitar» só marca como aprovada. Mostrar sempre o aviso
  de modo de demonstração até existir a ligação ao Google Business Profile.
- **Treinar**: o sistema escolhe reviews **reais** do negócio (regra 1) cujas situações as frases
  do cliente ainda não cobrem; o cliente responde e a resposta é partida em frases arrumadas por
  tipo (abertura, tema, contacto, fecho). O cliente pode retirar frases.
- **Tudo o que é aprendido fica guardado por tom.** Um tom é o conjunto de respostas do
  formulário de definições que definem como as respostas soam (tratamento, tons, tamanho, emojis,
  respostas a reviews só com estrelas) — tabela `review_reply_profiles`. **A assinatura e o
  contacto para negativas não contam para o tom**: continuam no formulário e nas respostas, mas
  mudá-los não começa uma aprendizagem nova. Treinos, frases,
  aceitações, edições e rejeições ficam ligados ao tom em que aconteceram e **nunca se misturam**.
  Mudar o formulário cria um tom novo; repor exatamente as mesmas respostas volta ao tom antigo
  com tudo o que aprendeu. A resposta automática também não faz parte do tom (decide quanto se aprova
  sozinho, não como soa). **Nunca apagar aprendizagem**: retirar uma frase só a desativa.
- **Nunca sugerir uma resposta exatamente igual a uma que o cliente escreveu** (respostas de
  treino, respostas editadas, respostas dele no Google, respostas-base a reviews só com estrelas).
  A comparação ignora maiúsculas, acentos, pontuação, emojis e a linha da assinatura
  (`composeDistinct`). Se não houver alternativa diferente, não se sugere nada.
- Só reviews publicadas desde 30 dias antes da configuração (`replyWindowDays`); o histórico de
  reviews antigas sem resposta fica de fora. Até 25 respostas por «Atualizar». Um rascunho
  «generating» serve de cadeado; o índice único impede dois rascunhos vivos para a mesma review.
- «Outra resposta» e «Rejeitar» (com motivos) contam como rejeição das frases usadas e montam
  outra resposta sem elas. Frases rejeitadas mais vezes do que aceites (2+) deixam de ser usadas.
  Editar antes de aceitar ensina as frases novas.
- Resposta automática: Desligada / Só as próximas N / Sempre. As negativas (1–3★) e as
  respostas refeitas depois de uma rejeição esperam sempre pelo cliente, salvo se ele incluir as
  negativas. A quota é gasta de forma atómica (`take_auto_reply`).
