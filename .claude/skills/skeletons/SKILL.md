---
name: skeletons
description: Regra de interface da Steevanz para estados de carregamento. Usar sempre que um componente mostra dados que vêm do servidor ou que são atualizados por uma ação (navegação, filtros, sincronizações, server actions, fetch no cliente), em qualquer página do site, do painel de cliente ou do admin.
---

# Skeletons e atualizações parciais

O site corre do lado do servidor e algumas ações demoram (leituras do Google pelo leitor,
Supabase). O utilizador tem de perceber **que algo está a acontecer e que partes da página
estão a mudar**, sem ecrãs em branco nem spinners soltos.

## Regras

1. **Todo o componente cujos dados se atualizam tem skeleton.** Nada de página em branco,
   de conteúdo que desaparece, ou de um spinner sozinho no meio do ecrã.
2. **Só a parte que muda fica em skeleton.** O resto da página mantém-se visível e utilizável.
   Ex.: mudar o filtro das reviews só afeta a lista de reviews, não os indicadores.
3. **O skeleton tem a forma do conteúdo final** (mesmas alturas, larguras e cartões), para nada
   "saltar" quando os dados chegam.
4. **Sem piscar:** só aparece se a espera passar ~300 ms. Atualizações instantâneas não mostram
   nada.
5. **Acessível:** `aria-busy` no bloco que atualiza e um texto `sr-only` com `role="status"`
   ("A atualizar…", "A carregar…"). A animação para quando o sistema pede menos movimento (a
   regra global de `prefers-reduced-motion` já trata disso).
6. **Botões que disparam a ação** mostram também o seu próprio estado ("A atualizar…",
   desativados), mas isso não substitui o skeleton do conteúdo.

## Peças disponíveis

| Peça | Onde | Para quê |
| --- | --- | --- |
| `Skeleton` | `src/components/ui/Skeleton.tsx` | Bloco cinzento com brilho a passar; dimensiona-se com classes (`h-4 w-32`, `rounded-full`). Funciona no servidor e no cliente. |
| `loading.tsx` | ao lado da `page.tsx` | Primeira abertura de uma página dinâmica: esqueleto da página inteira com `Skeleton`. Ex.: `src/app/painel/[slug]/loading.tsx`. |
| `DashboardBusyProvider`, `Refreshable`, `PendingLink`, `useBusySignal` | `src/components/reviews/DashboardBusy.tsx` | Atualizações dentro da mesma página (o Next não mostra o `loading.tsx` quando só mudam os parâmetros do URL). |

### Atualizações parciais no painel de reviews

- Cada bloco de dados está dentro de `<Refreshable scopes={[...]}>`, que lhe põe um véu de
  skeleton enquanto um dos seus *scopes* está ocupado.
- *Scopes* atuais: `sync` (importar reviews), `period` (mudar o período), `reviews` (filtros e
  "Ver mais" da lista de reviews).
- Ligações que mudam dados dentro da página usam `<PendingLink scope="…">` em vez de `Link`:
  navegam dentro de uma transição e marcam o *scope* como ocupado até o servidor responder.
- Ações em cliente (ex.: o botão de sincronizar) chamam `useBusySignal(scope, ocupado)`.
- Ao criar um bloco novo, decide que ações o alteram e lista esses *scopes*. Se surgir uma
  ação nova, cria um *scope* novo em vez de reutilizar um que afete mais do que devia.

### Dados carregados no cliente (fetch)

Enquanto carrega, mostra linhas `Skeleton` com a forma dos itens (ex.: as reviews de um tema em
`ThemeReviews.tsx` mostram até 3 cartões em skeleton).

### Server actions (formulários do admin)

O botão de submeter mostra o estado pendente (`SubmitButton` com `pendingLabel`). Se a ação
atualizar um bloco grande (ex.: sincronizar um negócio, procurar concorrentes), esse bloco deve
também mostrar skeleton enquanto a ação corre.

## Desenho

Cinzento da superfície (`bg-surface-2`) com um brilho suave a atravessar (`animate-shimmer`),
cantos iguais aos do conteúdo final. Nos blocos que já têm dados, o conteúdo antigo fica
esbatido (`opacity-35`) por baixo do brilho, para se perceber que vai ser substituído.
