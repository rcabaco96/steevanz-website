# Propostas e adjudicação online

O processo de venda: **apresentação (deck) → orçamento → o cliente adjudica online**.

Cada proposta tem uma página privada em `https://www.steevanz.com/proposta/<id>` com o orçamento
(linhas, totais com e sem IVA, condições e um resumo do que inclui) e o formulário de adjudicação.

## Plano anual («2 meses grátis»)

As mensalidades podem ser pagas **um ano adiantado, com meses grátis**: 12 meses pelo preço de 10.
É a opção recomendada. Basta pôr na proposta:

```ts
annual: { freeMonths: 2 },
```

Com isto, a página:

- mostra no cartão «Mensalidade», em cada linha, o preço de 12 meses riscado, o preço anual e quanto
  poupa (15 €/mês: ~~180 €~~ 150 €/ano, poupa 30 €), e o plano anual como «Recomendado · 2 meses
  grátis», com a poupança total sem e com IVA; o plano mensal fica como alternativa;
- pergunta no formulário «Como prefere pagar as mensalidades?» (anual, já escolhido, ou mensal);
- atualiza a caixa «Na adjudicação» com a escolha: itens únicos + 1.º ano, ou itens únicos +
  1.ª mensalidade.

O formulário só envia o nome do plano (`annual` ou `monthly`). Todos os valores, nos emails
incluídos, são calculados no servidor a partir do ficheiro da proposta. Sem `annual`, a proposta tem
só o plano mensal e o formulário não pergunta nada.

Nas condições, ponha as duas regras:

- «Plano anual pago adiantado: 12 meses pelo preço de 10. Renova por mais 12 meses, salvo aviso com
  30 dias de antecedência.»
- «Plano mensal: mensalidades pagas no início de cada mês, sem período mínimo; cancela com 30 dias
  de aviso.»

## Quando o cliente adjudica

1. recebemos um email em `rcabaco@steevanz.com` com o assunto
   «Nova adjudicação · <cliente> · <n.º do orçamento>», com os dados de faturação, o plano escolhido,
   o valor a faturar na adjudicação, a poupança (no plano anual), o resumo do orçamento, a data e
   hora e o link da proposta. Responder ao email escreve diretamente ao cliente;
2. o cliente recebe uma confirmação curta de `mail@steevanz.com`, com o plano, o valor da
   adjudicação e, no plano anual, a poupança;
3. o cliente vê o agradecimento e o que se segue.

Se o nosso email falhar, o cliente não vê o agradecimento: vê um aviso com o telefone 961 292 679.

A página nunca aparece no Google (noindex, nofollow, fora do sitemap) e não tem ligações a partir do
site: só quem tem o link a abre. Depois da validade (30 dias), a página continua visível mas o
formulário dá lugar a um aviso para nos contactar.

## Modelos

Os modelos do deck da proposta e do PDF do orçamento estão em `templates/propostas/`. Os números da
página têm de ser iguais aos do orçamento enviado ao cliente.

## Criar uma proposta nova

1. **Gerar um id aleatório** (o link é a única chave da página, por isso tem de ser impossível de
   adivinhar):

   ```sh
   node -e "console.log(require('crypto').randomBytes(6).toString('base64url'))"
   ```

   O id fica `<cliente>-<aleatório>`, em minúsculas e com hífenes no nome, por exemplo
   `cafe-central-Xy3k9QaB`.

2. **Copiar o ficheiro de conteúdo** `src/content/proposals/dolci-salati-695graik.ts` para
   `src/content/proposals/<id>.ts` e preencher:

   | Campo | O que é |
   | --- | --- |
   | `id` | o id do passo 1 (igual ao nome do ficheiro) |
   | `number` | o n.º do orçamento, como no PDF (ex.: `ORC-2026-002`) |
   | `clientName` | o nome do cliente, como aparece em «Proposta para …» e «Obrigado, …!» |
   | `date` | a data do orçamento, `AAAA-MM-DD` |
   | `validityDays` | `30` (a página calcula o «válido até») |
   | `vatRate` | `23` |
   | `oneOff` | as linhas de pagamento único |
   | `monthly` | as linhas da mensalidade (preço por mês) |
   | `annual` | opcional: `{ freeMonths: 2 }` para oferecer o plano anual (ver acima) |
   | `included` | 3 a 5 frases simples sobre o que o cliente recebe |
   | `conditions` | as condições, curtas |
   | `notes` | opcional: notas extra para este cliente |
   | `nextSteps` | o que acontece depois de adjudicar (aparece no agradecimento e no email) |

   Cada linha tem `description`, `detail` (opcional, a letra pequena), `quantity` e `unitCents`
   (preço unitário **em cêntimos e sem IVA**: 350 € = `35000`). Um desconto vai na própria linha:

   ```ts
   discount: { description: "Desconto de quantidade (a partir de 10 placas: 15 €/un.)", amountCents: 7500 },
   ```

   Os subtotais, o IVA e os totais são calculados sozinhos (`src/lib/proposals/totals.ts`).

3. **Registar a proposta** em `src/content/proposals/index.ts`:

   ```ts
   import { proposal as cafeCentral } from "./cafe-central-Xy3k9QaB.ts";

   export const proposals: readonly Proposal[] = [dolciSalati, cafeCentral];
   ```

4. **Confirmar** localmente em `http://localhost:<porta>/proposta/<id>` que os totais batem certo com
   o PDF, e correr `npm test` (os testes verificam, entre outras coisas, que os ids são únicos).

5. **Publicar**: commit e push para `main` (a Vercel publica sozinha).

6. **Enviar o link** ao cliente, por email ou WhatsApp, ou um QR code com o link (por exemplo na
   última página do deck).

## Regras do texto

- Nunca escrever «NFC»: dizer «um toque» ou «tecnologia Steevanz».
- Dizer «Menu digital».
- Nada de «fidelização» nos rótulos.
- Telefone: 961 292 679.
- A assinatura da marca é «com os bons modos de antigamente».
- Nunca inventar testemunhos ou reviews.
- Nos menus em vídeo, a Steevanz monta o menu e aloja o menu e os vídeos; não referir outras
  plataformas.

## Onde está o código

| Ficheiro | Para quê |
| --- | --- |
| `src/content/proposals/` | o modelo (`types.ts`), uma proposta por ficheiro e o registo (`index.ts`) |
| `src/lib/proposals/totals.ts` | subtotais, IVA, totais, plano anual e poupança, valor da adjudicação, datas e formatação em euros |
| `src/lib/proposals/validation.ts` | validação do formulário (NIF com dígito de controlo, IVA estrangeiro com prefixo do país, código postal `0000-000`, email) |
| `src/lib/proposals/accept.ts` | a adjudicação: validar, enviar o email para nós e depois a confirmação ao cliente |
| `src/lib/proposals/actions.ts` | a server action chamada pelo formulário |
| `src/app/(publico)/proposta/[id]/page.tsx` | a página |
| `src/components/proposals/` | o orçamento, a escolha do plano (`PlanChoice.tsx`), o formulário e o agradecimento |
| `tests/proposals.test.mjs` | os testes |
