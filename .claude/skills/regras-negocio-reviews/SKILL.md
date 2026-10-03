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
| `new`     | Abrir o painel, botão "Atualizar reviews"      | Review mais recente − 1 dia          | Só reviews novas; o caso mais frequente e barato |
| `refresh` | Cron diário, "Sincronizar agora" no admin      | Review mais recente − 30 dias        | Respostas recentes do dono, reviews editadas |
| `full`    | 1× por mês por negócio (cron), "Reimportar tudo" no admin, primeira importação | Todo o histórico (máx. 3000) | Respostas do dono a reviews antigas |

- A margem de 1 dia cobre atrasos de indexação do Google e fusos horários.
- As reviews são gravadas com `upsert` por `review_id`: a sobreposição nunca duplica nada.
- O Google não permite pedir "reviews respondidas recentemente": por isso existe o modo `full`
  mensal. Uma resposta a uma review antiga aparece, no máximo, um mês depois (ou logo, com o
  botão "Reimportar tudo").
- A data da última leitura completa fica em `review_businesses.full_synced_at`.

## 4. Controlo de custos (Apify)

- No máximo **uma sincronização por negócio a cada 5 minutos** ao abrir o painel, e nunca duas
  em paralelo (função `try_start_review_sync` com cadeado na base de dados).
- `personalData: false` sempre: não guardamos nomes, fotos nem perfis de quem escreveu.
- Ao alterar volumes (nº de concorrentes, frequência, janelas), estimar o custo por cliente e
  dizê-lo ao dono antes de avançar. Referência: plano Free 5 USD/mês, Starter 19 USD/mês.

## 5. Concorrência

- Gratuita para todos os clientes. **30 concorrentes num raio de 5 km.**
- Escolha automática: mesma categoria do Google primeiro (os com mais reviews), depois os que o
  Google associa à pesquisa da categoria, depois a pesquisa mais larga. O admin pode excluir.
- Só dados públicos agregados (nota, total de reviews, distribuição de estrelas). Nunca guardar
  textos de reviews de concorrentes.
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
