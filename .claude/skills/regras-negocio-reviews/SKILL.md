---
name: regras-negocio-reviews
description: Regras de negócio obrigatórias do produto de reviews Google da Steevanz (painel /painel, fontes DataForSEO / API Google / leitor local, fila de leituras e tick do pg_cron, custos, plano B Apify, alertas, concorrência). Usar antes de alterar qualquer coisa em src/lib/reviews, src/components/reviews, rotas /api/painel, /api/cron, /api/reader, scripts/reader, /r/[plate] ou /admin/reviews.
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

**Fontes (regra 15):** clientes verificados → API oficial da Google; todos os outros lugares →
**leitor próprio** (grátis; o DataForSEO está desligado desde 2026-10-05, só com
`DATA_FOR_SEO_ENABLED=1`); Apify = **plano B manual** no admin.
A rotina nunca lê o Google diretamente: põe pedidos na fila `review_import_jobs`, com o
fornecedor em `provider`, e o tick envia-os.

Nunca reimportar o histórico inteiro a cada visita. Cada leitura começa na review mais recente
já guardada:

| Pedido / modo | Quando | O que lê | Porquê |
| ------------- | ------ | -------- | ------ |
| `update` (DataForSEO; leitor se não configurado) | Botão «Atualizar» do painel, rotina diária das 22:00 (só quem não atualizou nesse dia), «Pedir atualização» no admin | Reviews novas + respostas a reviews recentes ainda sem resposta | O caso mais frequente |
| `full` (DataForSEO; leitor se não configurado) | Primeira importação, «Pedir histórico completo» no admin | Todo o histórico | Respostas do dono a reviews antigas |
| `visit` / `refresh` / `full` (Apify, plano B) | Só os botões «… com o Apify (plano B, pago)» no admin | Review mais recente − 1 dia / − 30 dias / todo o histórico | Quando o leitor não pode ler |

- A margem de 1 dia cobre atrasos de indexação do Google e fusos horários.
- As reviews são gravadas com `upsert` por `review_id`: a sobreposição nunca duplica nada.
- O Google não permite pedir "reviews respondidas recentemente": por isso existe a leitura
  completa **duas vezes por ano** (`fullHistoryEveryDays = 182` em `src/lib/reviews/sync-rules.ts`).
  Uma resposta a uma review antiga aparece, no máximo, seis meses depois (ou logo, com «Pedir
  histórico completo ao leitor»).
- A data da última leitura completa fica em `review_businesses.full_synced_at`.
- **Sem buracos:** as reviews novas lêem-se **sempre** a continuar a partir da última review
  gravada no Supabase — nunca só «as N mais recentes». Com o DataForSEO (só lê das mais recentes
  para trás), a profundidade = reviews novas desde a última gravada (total no Google − guardadas),
  em blocos de 10, com margem; se ficar um buraco, lê-se mais fundo até sobrepor uma review já
  gravada. Regra em `depthSinceLastStored` (`src/lib/dataforseo/rules.ts`).

- **Abrir ou recarregar uma página do painel nunca vai ao Google.** Só os botões «Atualizar»
  (e a rotina diária) pedem leituras ou preparam respostas.
- **O botão «Atualizar» só atualiza as reviews desse cliente** (nunca a concorrência nem outros
  clientes).
- **Uma rotina diária às 22:00 de Portugal** (tick `/api/cron/tick`, regra 15) põe na fila uma
  `update` para os clientes **não verificados** que **não** atualizaram nesse dia (dia de
  calendário em Portugal, `review_businesses.last_synced_at`), ou a `full` se a primeira
  importação ainda não aconteceu. Quem já atualizou fica de fora. Os verificados que não
  sincronizaram nesse dia são sincronizados pela API oficial (`syncVerifiedBusiness`).
  Regras em `src/lib/reviews/sync-rules.ts` e `planDailyJobs` em `src/lib/reviews/reader-queue.ts`.
  `?dry=1` devolve o plano sem pôr nada na fila nem chamar fornecedores.

## 4. Controlo de custos

- O caminho normal é o DataForSEO (pago ao pedido, custos na regra 15); a API oficial da Google
  (verificados) e o leitor local (recurso) não custam nada. O Apify só corre quando alguém carrega
  num botão «Apify» no admin, ou para procurar concorrentes (regra 5).
- Ao alterar volumes do DataForSEO (janelas, frequência, nº de lugares), estimar o custo **por
  lugar distinto por mês** com a tabela da regra 15 e dizê-lo ao dono antes de avançar.
- Plano B Apify: no máximo **uma leitura por negócio a cada 5 minutos**, nunca duas em paralelo
  (função `try_start_review_sync` com cadeado na base de dados). `personalData: false` sempre.
- Nunca guardamos nomes, fotos nem perfis de quem escreveu (nem pelo leitor, nem pelo Apify).
- Ao alterar volumes do Apify (nº de concorrentes, frequência, janelas), estimar o custo por
  cliente e dizê-lo ao dono antes de avançar. Referência: plano Free 5 USD/mês, Starter 19 USD/mês.
- Ao alterar volumes do leitor (pedidos por dia, reviews por leitura), garantir que a noite do
  leitor continua limitada (ex.: máx. 60 leituras de respostas de concorrentes por dia).

## 5. Concorrência

- Gratuita para todos os clientes. **Até 30 concorrentes num raio de 10 km** (`competitorLimit`, `competitorRadiusKm`).
  Mudar o raio só vale para procuras novas: os concorrentes atuais mantêm-se até à próxima procura.
- **Procura (Apify, pago):** automática só para clientes que nunca tiveram concorrentes
  procurados (`/api/cron/competitors`, 06:00 UTC, `competitors_refreshed_at` vazio). Nova procura
  de 90 em 90 dias é **manual**, com «Procurar concorrentes (Apify, pago)» no admin (o admin avisa
  quando passaram 90 dias). Confirmar o crédito do Apify antes de a lançar.
- Escolha automática: mesma categoria do Google primeiro (os com mais reviews), depois os que o
  Google associa à pesquisa da categoria, depois a pesquisa mais larga. O admin pode excluir.
- **Os números de cada lugar são uma base partilhada por `place_id`** (lugar do Google), não por
  cliente. Uma leitura serve todos os clientes que comparam com esse lugar, e o lugar de um
  cliente é também um lugar que outros clientes podem ter como concorrente. **Custo e frequência
  pensam-se por lugar distinto, nunca por cliente.**
- **Atualização da base de concorrentes às 10:00 e às 19:00 de Portugal** (tick, regra 15):
  - **Números (nota, total, estrelas): um «zone snapshot» por cliente com concorrentes** — um só
    pedido DataForSEO (Google Maps, à volta das coordenadas do cliente, pesquisa = categoria do
    cliente, zoom `12z` ≈ 10 km) traz os números de todos os concorrentes da zona
    (`planZoneSnapshots` em `src/lib/reviews/tick.ts`).
  - `competitor` (reviews novas + respostas, janela de 7 dias): **cerca de uma vez por dia por
    lugar**. Só se pede um lugar que **ninguém** leu desde o horário anterior (às 10:00, desde as
    19:00 da véspera; às 19:00, desde as 10:00), por nenhum caminho: uma leitura para outro
    cliente (`reader_places.read_at`), o próprio cliente desse lugar a carregar em «Atualizar», a
    rotina dele ou uma sincronização do Perfil da Empresa no Google
    (`review_businesses.last_synced_at` do cliente cujo `place_id` / `google_place_id` é esse
    lugar). Regra em `planCompetitionSlot` (`src/lib/reviews/reader-queue.ts`). Com o leitor
    local (sem DataForSEO) a referência é o próprio horário: lê todos os lugares 2× por dia,
    porque é dessa leitura que vêm os números.
  - `competitor_replies`: % de reviews respondidas sobre os últimos 12 meses (máx. 2000 reviews),
    **uma única vez por lugar** (nunca medido). No máximo 60 por horário.
  - Concorrentes novos (depois de uma procura) entram logo na fila com prioridade 3.
- Só dados públicos agregados (nota, total de reviews, distribuição de estrelas, % de reviews
  respondidas com o nº de reviews contadas, nº de fotos e campos do perfil preenchidos). Nunca
  guardar textos de reviews de concorrentes.
- **Fotos e Perfil** (separadores da tabela): lidos dos dados que a própria página do lugar no
  Google Maps carrega (`parsePlaceProfile` em `src/lib/reviews/maps-reader.ts`), sem ler reviews
  nem fazer pedidos extra. Perfil = % de 5 campos: reivindicado pelo dono, site, telefone, horário,
  descrição. Guardados em `competitor_snapshots.photos_count` / `profile`.
- **Setas em «Na sua zona»:** lugares ganhos/perdidos face a há 1 mês e variação da nota / do
  total do cliente. Com uma captura de há 1 mês usa-se essa; senão, o cliente de há 1 mês sai das
  reviews dele (sem as do último mês) e cada concorrente = total − ritmo mensal, com a nota de hoje
  (`entryMonthAgo` / `competitionTrend` em `src/lib/reviews/competitors.ts`). As posições comparam
  só os lugares presentes nos dois momentos.
- **% de reviews respondidas** («Respondidas» na tabela): conta reviews publicadas entre 12
  meses e 7 dias atrás (7 dias para o dono ter tempo de responder); escondida com menos de 5. O
  cliente é medido com a mesma regra a partir de `google_reviews.owner_reply`.

## 6. Limites técnicos

- Funções na Vercel: máximo 300 s (plano Hobby com Fluid compute, `"fluid": true` no
  `vercel.json`). Plano Hobby: só crons **diários**, no máximo 2 (`tick` 22:00 UTC como rede de
  segurança e `competitors` 06:00 UTC). Tudo o que precisa de outro horário corre pelo tick do
  pg_cron do Supabase (regra 15). Trabalho pesado vai para a fila, nunca para a Vercel.
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
  as frases-base da Steevanz. Custo zero.
- **Língua da review:** reviews com texto são respondidas na língua da review (pt, en, es, fr, de,
  it, nl; outras línguas em inglês), com a **tradução em português** por baixo. Deteção local e
  grátis (`replyLanguage` em `src/lib/reviews/reply-languages.ts`: deteção por palavras frequentes
  quando é segura, senão o código de língua do Google, senão português); reviews só com estrelas ou
  textos curtos/incertos ficam em português. Sem tradutor pago: as frases-base existem em todas as
  línguas (`reply-translations.ts`) e a tradução é a mesma resposta montada em português. As frases
  aprendidas do cliente são em português, por isso noutras línguas só entram frases-base (assinatura
  e contacto mantêm-se); editar uma resposta noutra língua não ensina frases, e o «Treinar» só usa
  reviews em português.
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

## 12. Leitor local de reviews (só recurso)

- **Só recurso** desde que o DataForSEO é a fonte (regra 15): processa os pedidos com
  `provider = 'reader'` (todos, quando o DataForSEO não está configurado).
- **Grátis, no computador do dono** (`scripts/reader`, `npm run reader`): lê o Google Maps numa
  janela do Edge e grava no Supabase. A Vercel só põe pedidos na fila.
- **Fila única** `review_import_jobs` (contrato em
  `supabase/migrations/20261004130000_reader_queue.sql`):
  - tipos `full` (histórico completo de um cliente), `update` (reviews novas + respostas
    recentes), `competitor` (um lugar do Google), `competitor_replies` (% respondidas de um lugar);
  - prioridade **1** = alguém à espera no painel ou no admin, **3** = primeira importação (e
    concorrentes acabados de procurar), **5** = rotina;
  - `requested_by`: `panel`, `cron` ou `admin`; alvo `business_id` (clientes) ou `place_id`
    (concorrentes); no máximo um pedido ativo por alvo e tipo (índices únicos; ao pôr na fila,
    o erro 23505 ignora-se: `enqueueJobs` / `queueReaderJob` em `src/lib/reviews/reader-queue.ts`).
- **Horário:** o mesmo tick da regra 15 (clientes às 22:00, concorrentes às 10:00 e 19:00 de
  Portugal); o fornecedor dos pedidos planeados é `dataforseo` quando configurado, senão `reader`.
- **Alertas de negativas:** depois de uma `update`, o leitor chama `POST /api/reader/alerts`
  (`Authorization: Bearer CRON_SECRET`, corpo `{ businessId, reviewIds }`) com as reviews novas.
  Só seguem as de 1–3★ publicadas nos últimos 7 dias, com o email de sempre.
- **Leitor desligado:** o leitor regista sinal de vida em `review_reader_status`. Sem sinal há
  mais de **12 horas**, os crons enviam um email ao dono (rcabaco@steevanz.com), **no máximo um
  por dia** (último envio em `review_reader_alerts`, id `offline`). **Só se algum pedido ainda usa
  o leitor** (`provider = 'reader'` na fila, ou DataForSEO por configurar); senão não se verifica.
- **Plano B:** o Apify só corre à mão, nos botões «… com o Apify (plano B, pago)» do admin.
- O admin mostra o estado do leitor (último sinal, pedidos na fila) e os últimos pedidos de cada
  negócio, com estado e erro.

## 13. Gamificação (planeada)

- O software vai ter um **plano de gamificação por cima** (níveis, desafios, conquistas, prémios),
  pensado ao nível do **cliente como um todo** e sempre ligado à **venda dos serviços Steevanz**
  (ex.: prémio ao atingir um nível, desafio que dá 1 mês grátis de um serviço para experimentar).
- Ao desenhar funcionalidades novas (painel, concorrência, respostas, placas NFC), prever onde
  geram pontos, níveis ou desafios, e não fechar portas a isso (eventos e métricas guardados no
  Supabase, por cliente).
- Os números usados na gamificação seguem as mesmas regras: nunca inventados (regra 1) e com (i)
  a explicar a lógica (regra 7).

## 14. Perfil verificado (ligação ao Google Business Profile)

- **Todos os clientes estão identificados** como ligados ou não ao Perfil de Empresa Google
  (`review_businesses.google_link_status`: not_connected / pending_location / connected / error).
- **«Perfil verificado» = ligado ao Google** com uma conta que gere mesmo esse negócio (prova feita
  pela autorização oficial da Google). Só esse estado dá o selo; nunca se atribui à mão.
- **Incentivo sempre visível** enquanto o cliente não estiver verificado: barra no cabeçalho fixo do
  painel, com os benefícios (atualizações em segundos pela API oficial, respostas publicadas
  diretamente, selo «Perfil verificado» visível também na tabela da concorrência de outros clientes).
- **O selo aparece em todo o lado onde o negócio aparece**: cabeçalho do painel, tabela da
  concorrência (para quem o tem como concorrente), admin. Clientes verificados são atualizados pela
  API oficial (grátis) e alimentam a base partilhada de negócios.
- Liga à gamificação (secção 13): verificar o perfil é uma conquista e desbloqueia benefícios.

## 15. Fontes, horário e custos (DataForSEO)

**Atualização 2026-10-04/05 (dono): soluções pagas fora de questão; o leitor próprio e grátis é
a fonte.** O DataForSEO está **desligado**: nada lhe é enviado (botões, rotinas) sem
`DATA_FOR_SEO_ENABLED=1`, mesmo com as credenciais no ambiente (`dataForSeoEnabled` em
`src/lib/dataforseo/client.ts`). Sem isso, todos os pedidos vão para o leitor
(`provider = 'reader'`). O resto desta secção descreve o modo DataForSEO, caso volte a ser ligado.

Decidido antes pelo dono: o **DataForSEO é a fonte alojada (solução final)**.

**Fontes**

| Lugar | Fonte | Custo |
| ----- | ----- | ----- |
| Cliente verificado (`google_link_status = 'connected'`) | API oficial da Google (`syncVerifiedBusiness`) | Grátis |
| Todos os outros (clientes e concorrentes) | DataForSEO (`provider = 'dataforseo'`) | Pago ao pedido (abaixo) |
| Recurso | Leitor local (`provider = 'reader'`), só se o DataForSEO falhar / não estiver configurado | Grátis |
| Plano B manual | Apify, só pelos botões do admin | Pago |

**Horário** — um **tick a cada 15 minutos** (`GET /api/cron/tick`, chamado pelo **pg_cron do
Supabase** via pg_net; SQL em `supabase/migrations/20261004190000_scheduler.sql`). Decide tudo em
hora de Portugal (`decideTick` em `src/lib/reviews/tick.ts`); o que já tratou fica em
`scheduler_state` (`competition_slot`, `customer_day`; `scheduler_claim` impede dois ticks de
tratar o mesmo horário):
- **10:00 e 19:00** (primeiro tick a seguir ao horário ainda não tratado): concorrência — zone
  snapshot por cliente com concorrentes, `competitor` por lugar distinto não lido desde o horário
  anterior, `competitor_replies` para lugares nunca medidos (regra 5).
- **22:00**, uma vez por dia: `full` / `update` dos clientes não verificados (regra 3); os
  verificados não sincronizados nesse dia pela API oficial (em todos os ticks até à meia-noite,
  com limite de tempo); alerta do leitor desligado só se algum pedido ainda usar o leitor.
- **Todos os ticks:** envia até 100 pedidos da fila ao DataForSEO (`dispatchQueuedJobs`) —
  pedidos do painel primeiro, depois a rotina.
- A Vercel (Hobby, só crons diários) chama o tick 1× por dia (22:00 UTC) como rede de segurança.
- `?dry=1` devolve as decisões e os planos sem efeitos (`&at=<ISO>` simula outro momento).

**Respostas:** verificadas todos os dias na janela dos últimos 7 dias e, **1 vez por mês por
negócio**, na janela dos últimos 30 dias (apanha respostas tardias); coluna
`reader_places.deep_checked_on` (`replyCheckDays` em `src/lib/dataforseo/rules.ts`).

**Custos — sempre por lugar distinto por mês, nunca por cliente.** Um lugar comparado por 5
clientes, ou que é cliente e concorrente ao mesmo tempo, é lido e pago **uma vez** (base
partilhada por `place_id`, regra 5).

| Leitura | Preço DataForSEO | Por lugar / mês |
| ------- | ---------------- | --------------- |
| Zone snapshot (Maps, ~10 km) | ~0,0006 $ por pedido | 2 × 30 × 0,0006 ≈ **0,036 $ por cliente com concorrentes** (serve todos os concorrentes da zona) |
| Reviews (fila normal) | ~0,00075 $ por 10 reviews | — |
| Respostas, janela de 7 dias, 1×/dia | 30 × 0,00075 | ≈ **0,0225 $** (≈ 0,02 $) |
| Releitura mensal de 30 dias | | ≈ **0,002 $** |
| Primeira leitura de 12 meses (`competitor_replies`) | | ≈ **0,015 $ por lugar, uma vez** |
| Primeira importação de um cliente (`full`) | | ≈ **0,075 $ por 1000 reviews, uma vez** |
