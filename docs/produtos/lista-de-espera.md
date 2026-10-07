# Lista de espera digital

Fila virtual para restaurantes, cafés, barbearias e clínicas. Quem chega lê um QR (ou toca na placa
NFC) à porta, fica com uma senha no telemóvel e pode ir dar uma volta: quando é chamado, o telemóvel
toca. Sem app e sem conta. Custo de funcionamento: zero (sem SMS nem WhatsApp).

## Como fica ativa

1. O negócio entra pelo `/admin/reviews` (o leitor importa as reviews). Ainda sem conta.
2. Quando fechamos negócio, juntamos o email do dono ao negócio: a conta é criada sem password e sem
   enviar nada. Sem reviews, cria-se em **Admin → Clientes → Novo cliente**.
3. Na ficha do cliente ativa-se o produto **Lista de espera digital** (ou aceita-se a encomenda).
4. O **espaço** (o restaurante, café ou barbearia) é criado sozinho com o nome do negócio, o tipo pela
   categoria do Google e um horário inicial. Edita-se em **Editar espaço**.
5. A fila começa **fechada**: o dono abre-a quando começa a atender.

## Quem faz o quê

### Admin (Steevanz)
- Ativa, suspende ou cancela o produto na ficha do cliente.
- Abre o módulo na ficha do cliente e faz tudo o que o dono faz (configurar, dar apoio).
- Imprime o cartaz com o QR para a porta (separador **QR e ecrã**).

### Dono do estabelecimento (área de cliente, `/conta/waitlist`)
- **Abre, pausa ou fecha** a fila (faixa no topo, com botões "Abrir fila", "Pausar entradas",
  "Retomar entradas", "Fechar fila"; fechar pede confirmação).
  - Aberta: entra quem quiser pelo QR.
  - Em pausa: ninguém novo entra; quem já está continua a ser chamado.
  - Fechada: ninguém entra pelo QR.
- Vê a fila em tempo real (atualiza sozinha de 8 em 8 s): quem espera, há quanto tempo, posição,
  estimativa e quem já foi chamado.
- **Chama** a pessoa seguinte → o telemóvel dela toca e, se deixou email, recebe um email.
- Marca **Atendido**, **Não apareceu**, **Desistiu**, ou **Voltar à fila** (sem perder o lugar).
- **Reordena** a fila (↑ ↓).
- **Adiciona alguém ao balcão** (quem não tem telemóvel). Funciona mesmo com a fila fechada.
- Vê a resposta de quem foi chamado: "a caminho", "atraso-me" ou "já não venho".
- Quem não aparece dentro do tempo definido fica **a vermelho**.
- **Ecrã de chamada** para uma TV (`/fila/<espaco>/ecra`): número chamado em grande, os seguintes,
  QR para entrar, pessoas à espera e espera estimada. Só números, nunca nomes. Toca um som a cada
  chamada (é preciso carregar uma vez em "Ativar som").
- **Estatísticas** dos últimos 30 dias: entradas, atendidos, desistências, espera mediana e horas
  com mais gente.

### Cliente final (quem vai ao estabelecimento)
- Lê o QR ou toca na placa NFC à porta (`/fila/<espaco>`).
- Vê quantas pessoas estão à frente e a espera estimada.
- Escreve o nome e, conforme o negócio, o nº de pessoas ou o serviço e o profissional; o email é
  opcional.
- Fica com uma **senha** (`/fila/<espaco>/<token>`): número, posição e estimativa, sempre
  atualizadas (de 5 em 5 s, também com o ecrã bloqueado).
- Quando é chamado: som, vibração (Android) e aviso no ecrã; email se o deixou.
- Responde com um toque: "a caminho", "atraso-me" ou "já não venho" (sai da fila).
- Se fechar a página, volta a ler o QR e recupera a senha (fica guardada no browser).

## Definições (por espaço)

| Definição | Para quê | Por omissão |
| --- | --- | --- |
| Minutos por vez | Base da estimativa | 15 |
| Perguntar nº de pessoas | Restaurantes | sim |
| Perguntar serviço / profissional | Barbeiros, clínicas | não |
| Máximo de pessoas por grupo | Limite no formulário | 12 |
| Máximo de pessoas à espera | Com a fila cheia, ninguém entra pelo QR | 60 |
| Minutos para se apresentar | Depois disso o chamado fica a vermelho | 10 |
| Mensagem na página | Texto para o cliente final | vazio |
| Serviços e profissionais | Para a estimativa por serviço | vazio |

## Regras automáticas

- **Estimativa:**
  - Filas "por vez" (restaurantes): pessoas à frente × minutos por vez, misturado com o ritmo real
    de chamadas dos últimos 90 minutos (a partir de 3 chamadas).
  - Filas por serviço (barbeiros, clínicas): soma da duração dos serviços de quem está à frente,
    dividida pelos profissionais ativos (quem pediu um profissional só conta para esse).
  - Arredondada aos 5 minutos e sempre apresentada como estimativa.
- **Senhas recomeçam do 1** todos os dias (dia do fuso do espaço).
- **Senhas esquecidas** (à espera ou chamadas há mais de 12 h) são fechadas pela rotina.
- **Dados apagados ao fim de 30 dias** (nome, email, notas).
- **Palavras adaptadas ao negócio**: "Mesa pronta" (restaurante), "É a sua vez" (barbeiro, clínica,
  loja).
- **Antiabuso**: no máximo 20 entradas por rede a cada 10 minutos; campo-armadilha contra bots.

## Onde está o código

| O quê | Onde |
| --- | --- |
| Tabelas e função atómica de entrada (`waitlist_join`) | `supabase/migrations/20261007120000_establishments_modules.sql` |
| Ações (entrar, responder, chamar, estados, reordenar, balcão, definições) | `src/lib/modules/waitlist/actions.ts` |
| Fila, estados e textos | `src/lib/modules/waitlist/store.ts` |
| Estimativa (módulo puro, com testes) | `src/lib/modules/waitlist/eta.ts` |
| Painel do dono / admin | `src/components/modules/waitlist/WaitlistModule.tsx`, `QueueBoard.tsx` |
| Páginas públicas | `src/app/(publico)/fila/[slug]/` (entrada, senha, ecrã) |
| Componentes públicos (alerta, respostas, som) | `src/components/public/waitlist/` |
| Rotinas (senhas esquecidas, 30 dias) | `src/lib/modules/routines.ts`, chamadas por `/api/cron/tick` |
| Espaços (criação automática) | `src/lib/establishments/provision.ts` |
| Testes | `tests/modules.test.mjs` |

Tabelas: `waitlist_settings` (uma por espaço) e `waitlist_entries` (estados `waiting`, `called`,
`served`, `no_show`, `cancelled`). Tudo passa pelo servidor com a chave de serviço; as páginas
públicas só chegam às senhas pelo token (impossível de adivinhar).

## Limitações atuais

- Sem SMS nem WhatsApp: o aviso é na página e por email.
- No iPhone não vibra, e as notificações só funcionam com a página adicionada ao ecrã principal.
- A atualização é por polling (8 s no painel, 5 s na senha e no ecrã), não em tempo real.
