# Leitor de reviews Steevanz

Programa que lê as reviews do Google Maps num navegador **visível** (Edge no Windows; Chrome ou
Chromium num servidor Linux) e as grava no Supabase. É a única fonte de reviews (grátis; sem
serviços pagos), além da API oficial da Google para os clientes com o Perfil de Empresa ligado. Vai
buscando os pedidos à fila `review_import_jobs` (painel, admin e rotinas): só os que têm
`provider = 'reader'`; pedidos antigos de fornecedores que já não existem passam para o leitor.

## Com que frequência vê a fila

- **A cada ~2 s** quando tem vagas livres: depois de cada verificação espera 2 s (`pollMs`) e volta
  a ver os pedidos `queued` (até 50, por prioridade e antiguidade). Sem vagas livres não pergunta.
  Sem backoff, sem long-poll e sem realtime.
- **Sinal de vida** em `review_reader_status` a cada 5 s (`heartbeatMs`) e sempre que começa ou
  acaba um pedido. O painel conta o leitor como ligado com um sinal nos últimos 30 s.
- **Ao arrancar:** pedidos deixados a meio voltam à fila (uma vez) e pedidos de fornecedores antigos
  passam para o leitor (também a cada minuto).
- **A cada minuto** vê se passou uma hora da concorrência (10:00 / 19:00) e, se sim, chama
  `READER_SITE_URL/api/cron/competition` (nova tentativa 5 min depois de uma falha).
- `READER_SLOTS` (por omissão 4) = pedidos ao mesmo tempo, um separador cada.

```
npm run reader
```

Precisa do `.env.local` com `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` e `CRON_SECRET`.

## O que faz cada pedido

| Tipo                 | O quê                                                                                     |
| -------------------- | ----------------------------------------------------------------------------------------- |
| `full`               | Primeira importação: todo o histórico. As ~50 mais recentes ficam gravadas logo; o resto segue até ao fim. |
| `update`             | Reviews novas e respostas do dono às reviews sem resposta dos últimos 30 dias. Avisa por email de negativas novas (1–3★, últimos 7 dias). |
| `competitor`         | Às 10:00 e 19:00 (hora de Portugal), por local: nota, total, distribuição de estrelas (fotografia do dia) e reviews dos últimos 30 dias para atualizar a % de respondidas (aproximação, ver `slideReplyRate`). |
| `competitor_replies` | Uma vez por local: % de reviews respondidas em 12 meses (máx. 2000 reviews) e ritmo mensal. |
| `discover`           | Procura de concorrentes de um cliente: só lugares da mesma categoria do Google ou de uma muito parecida (regra 5); guarda a categoria de cada um. |

- Até 4 pedidos ao mesmo tempo (uma janela cada), nunca 2 do mesmo negócio/local; a última vaga
  fica sempre para a prioridade 1 (alguém à espera no painel).
- Nunca guarda nomes, fotos ou perfis de quem escreveu; da concorrência só guarda números.
- Clientes ligados ao Google Business Profile não são lidos (as reviews chegam pela API oficial).
- Às 10:00 e às 19:00 (e ao arrancar, para recuperar uma hora perdida) o leitor pede ao site
  `GET /api/cron/competition`, que põe na fila os concorrentes por ler desde a hora anterior.
- Só pode haver um leitor por computador (ficheiro `reader.lock` na pasta do perfil).

## Ritmo e limites do Google

Regras em `src/lib/reviews/reader-throttle.ts` (testes em `tests/reader-throttle.test.mjs`). A 2026-10-09
um cliente novo teve a procura e ~35 leituras de concorrentes em paralelo com a sua importação; o
Google limitou o navegador e a importação do cliente e todas as tentativas falharam. Por isso:

- **1 separador sempre livre para os clientes** (dono, 2026-10-09): os pedidos `full`/`update` nunca
  esperam pela concorrência, e a concorrência nunca espera pelas reviews dos clientes.
- **Concorrência em paralelo** nos outros separadores (`READER_COMPETITOR_SLOTS`, por omissão todos menos
  um), com uma folga de `READER_COMPETITOR_PAUSE_MS` a 2× (1–2 s) entre cada um que começa, para não
  abrir tudo no mesmo instante. Os pedidos dos clientes vão à velocidade de sempre.
- **Pausa quando o Google limita:** vista limitada, pedido para iniciar sessão, reviews que não
  carregam, ordenação recusada ou listas que param a meio contam como sinais. 2 sinais em 5 min →
  nenhuma leitura de concorrentes nova durante 3 min (`READER_COOLDOWN_MIN`), depois 9, 27 e no máximo 30 (`READER_COOLDOWN_MAX_MIN`)
  se continuar; uma leitura que corre bem volta aos 3. **Os pedidos dos clientes nunca param**: o leitor está sempre disponível para eles. A pausa fica em
  `review_reader_status.paused_until` / `pause_reason` (o admin e o painel mostram «O Google está a
  limitar o leitor; retoma às HH:MM») e sobrevive a um reinício.
- **De volta à fila em vez de falhar:** um pedido apanhado por um limite volta a `queued` com
  `not_before` e `attempts`: os dos clientes ao fim de 2, 5, 10 e 20 min; os de concorrentes ao fim de 10, 30, 60 e 90 min, nunca antes do fim da pausa; à 5.ª vez
  (`READER_LIMIT_ATTEMPTS`) falha com uma mensagem clara. Erros reais (negócio inexistente, sem
  categoria…) falham logo. As reviews lidas ficam guardadas; a importação só conta quando chega ao fim.
- **Nome do negócio:** se o nome guardado for «nome, morada» (vindo do link do Maps), o leitor troca-o
  pelo título que o Google mostra na página (h1).

Precisa da migração `supabase/migrations/20261010100000_reader_throttle.sql`: sem ela o leitor v3 não arranca.

**Se o Google pedir para iniciar sessão** (o pedido volta à fila e o leitor faz uma pausa): pode abrir
a janela do navegador do leitor e iniciar sessão numa conta Google uma vez. O leitor funciona com e
sem sessão iniciada.

## Arrancar com o Windows

```
powershell -ExecutionPolicy Bypass -File scripts\reader\install-startup.ps1
```

Cria a tarefa «Steevanz leitor de reviews» no Agendador de Tarefas: corre `npm run reader` nesta
pasta quando o utilizador entra no Windows (consola visível). Para deixar de arrancar:

```
powershell -ExecutionPolicy Bypass -File scripts\reader\uninstall-startup.ps1
```

## Num servidor Linux

Instalar Node.js 24+, Chrome ou Chromium e o Xvfb (ecrã virtual: o navegador corre com janela).

```
xvfb-run -a -s "-screen 0 1920x1080x24" npm run reader
```

Como serviço, um `systemd` com `ExecStart=/usr/bin/xvfb-run -a -s "-screen 0 1920x1080x24" npm run reader`,
`WorkingDirectory=` a pasta do projeto e `Restart=always`.

## Variáveis opcionais (`.env.local`)

| Variável              | Para quê                                                                 |
| --------------------- | ------------------------------------------------------------------------ |
| `CHROME_PATH`         | Caminho do navegador (também aceita `EDGE_PATH`). Por omissão procura o Edge/Chrome/Chromium habitual. |
| `READER_BROWSER_ARGS` | Opções extra do navegador, ex. `--no-sandbox` se correr como root.       |
| `READER_PROFILE_DIR`  | Pasta do perfil do navegador (por omissão `~/.steevanz-reader`).         |
| `READER_PORT`         | Porta DevTools (por omissão 9350).                                       |
| `READER_COMPETITOR_SLOTS` | Pedidos de concorrência ao mesmo tempo (por omissão `READER_SLOTS` − 1: um separador fica sempre para os clientes). |
| `READER_COMPETITOR_PAUSE_MS` | Pausa mínima entre dois pedidos de concorrência que começam (por omissão 5000; a pausa real vai até ao dobro). |
| `READER_COOLDOWN_MIN` | Primeira pausa das leituras de concorrentes quando o Google limita (por omissão 3 min; depois 3× maior). |
| `READER_COOLDOWN_MAX_MIN` | Pausa máxima (por omissão 30 min). |
| `READER_LIMIT_ATTEMPTS` | Vezes que um pedido pode ser limitado antes de falhar (por omissão 5). |
| `READER_SITE_URL`     | Site que envia os alertas por email e põe a concorrência na fila (por omissão `https://steevanz.com`). Tem de ser o site em uso (ex.: o preview do ramo `login-page`); `http://localhost:3000` só com o `next dev` a correr. A fila em si é lida diretamente do Supabase. |

## Testar sem mexer em nada

```
npm run reader -- --dry-run --kind competitor --place <placeId>
npm run reader -- --dry-run --kind update --business <slug>
```

Abre outro navegador (porta 9351, perfil próprio), não toca na fila e não escreve no Supabase:
mostra o que escreveria. Cada teste vai ao Google, por isso usar com moderação.
