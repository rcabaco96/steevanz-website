# Propostas e adjudicação online

O processo de venda: **apresentação (deck) → orçamento → o cliente adjudica online**.

Cada proposta tem uma página privada em `https://www.steevanz.com/proposta/<id>` com o orçamento
(linhas, totais com e sem IVA, condições e um resumo do que inclui) e o formulário de adjudicação.
Quando o cliente adjudica:

1. recebemos um email em `rcabaco@steevanz.com` com o assunto
   «Nova adjudicação · <cliente> · <n.º do orçamento>», com os dados de faturação, o resumo do
   orçamento, a data e hora e o link da proposta. Responder ao email escreve diretamente ao cliente;
2. o cliente recebe uma confirmação curta de `mail@steevanz.com`;
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
   | `monthly` | as linhas da mensalidade |
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
- Nunca inventar testemunhos ou reviews.
- Nos menus em vídeo, a Steevanz monta o menu e aloja o menu e os vídeos; não referir outras
  plataformas.

## Onde está o código

| Ficheiro | Para quê |
| --- | --- |
| `src/content/proposals/` | o modelo (`types.ts`), uma proposta por ficheiro e o registo (`index.ts`) |
| `src/lib/proposals/totals.ts` | subtotais, IVA, totais, datas e formatação em euros |
| `src/lib/proposals/validation.ts` | validação do formulário (NIF com dígito de controlo, IVA estrangeiro com prefixo do país, código postal `0000-000`, email) |
| `src/lib/proposals/accept.ts` | a adjudicação: validar, enviar o email para nós e depois a confirmação ao cliente |
| `src/lib/proposals/actions.ts` | a server action chamada pelo formulário |
| `src/app/(publico)/proposta/[id]/page.tsx` | a página |
| `src/components/proposals/` | o orçamento, o formulário e o agradecimento |
| `tests/proposals.test.mjs` | os testes |
