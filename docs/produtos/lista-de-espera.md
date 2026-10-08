# Lista de espera digital

Fila virtual para restaurantes, cafés, barbearias e clínicas. Quem chega lê um QR (ou toca na placa
NFC) à porta, fica com uma senha no telemóvel e pode ir dar uma volta: quando é chamado, o telemóvel
toca. Sem app e sem conta, para o cliente e para o dono. Não é preciso hardware: basta o telemóvel ou
tablet do balcão. Custo de funcionamento: zero (sem SMS nem WhatsApp).

**A equipa só faz uma coisa:** carregar em «Chamar o seguinte» quando há mesa (ou cadeira) livre. O
cliente não tem de fazer nada depois de tirar a senha: a chamada fecha sozinha.

## Como fica ativa

1. O negócio entra pelo `/admin/reviews` (o leitor importa as reviews). Ainda sem conta.
2. Quando fechamos negócio, juntamos o email do dono ao negócio: a conta é criada sem password e sem
   enviar nada. Sem reviews, cria-se em **Admin → Clientes → Novo cliente**.
3. Na ficha do cliente ativa-se o produto **Lista de espera digital** (ou aceita-se a encomenda).
4. O **espaço** (o restaurante, café ou barbearia) é criado sozinho com o nome do negócio, o tipo pela
   categoria do Google e um horário inicial. Edita-se em **Editar espaço**.
5. **Preço por espaço:** cada espaço paga o mesmo. O produto cobre os primeiros N espaços do cliente
   (campo «Espaços» no produto; numa encomenda, a quantidade é o nº de espaços).
6. A fila começa **fechada**: abre-se à mão ou liga-se «Abrir e fechar a fila com o horário».

## Quem faz o quê

### Dono e equipa: o Balcão (`/conta/balcao`)
O ecrã do dia a dia, feito para o telemóvel ou tablet do balcão (ver `balcao.md`). No separador
**Fila**:
- **«Chamar o seguinte»** em grande. Com profissionais (barbearias), um botão por profissional: chama
  quem o escolheu ou quem aceita «qualquer um».
- «A chamar agora»: o número e o nome de quem foi chamado.
- Números do momento: à espera, espera para quem entrar agora, atendidos hoje.
- Estado da fila: **Abrir**, **Pausar entradas**, **Fechar** (fechar pede confirmação).
- Listas «Chamados» e «À espera». As exceções ficam no «⋯» de cada pessoa:
  - chamados: **Não apareceu**, Já foi atendido, Chamar outra vez, Voltar à fila;
  - à espera: Chamar já (fora da ordem), Subir, Descer, Desistiu.
- **Adicionar alguém ao balcão** (quem não tem telemóvel). Funciona mesmo com a fila fechada.
- **Som de novas entradas** (liga-se uma vez em cada aparelho).

### Dono: o módulo (`/conta/waitlist`)
- **Fila**: o mesmo quadro, em formato de painel.
- **Estatísticas** dos últimos 30 dias: entradas, atendidos, desistências, espera mediana e horas
  com mais gente.
- **Definições**: regras da fila, espaço, serviços e profissionais.
- **QR e ecrã**: cartaz para imprimir e o link do ecrã de chamada.

### Admin (Steevanz)
- Ativa, suspende, cancela ou remove o produto e define os espaços, na ficha do cliente.
- Abre o módulo ou o **Balcão** de cada espaço («Abrir Balcão» na ficha do cliente) e faz tudo o que
  o dono faz.

### Ecrã de chamada (`/fila/<espaco>/ecra`)
Para uma TV ou monitor à entrada: o número chamado em grande, os seguintes, o QR para entrar, as
pessoas à espera e a espera estimada. Só números, nunca nomes. Toca um som a cada chamada (é preciso
carregar uma vez em «Ativar som»).

### Cliente final (quem vai ao estabelecimento)
- Lê o QR ou toca na placa NFC à porta (`/fila/<espaco>`): vê quantas pessoas estão à frente e a
  espera estimada.
- Escreve o nome e, conforme o negócio, o nº de pessoas ou o serviço e o profissional. O email é
  opcional.
- Fica com uma **senha** (`/fila/<espaco>/<token>`): número, posição e estimativa, sempre atualizadas
  (de 5 em 5 s, também com o ecrã bloqueado).
- Quando é chamado: som, vibração (Android), aviso no ecrã («Mesa pronta» / «É a sua vez») e email,
  se o deixou. **Não precisa de fazer mais nada.**
- Só se precisar de avisar a equipa: «Vou atrasar-me» (ganha o dobro do tempo) ou «Já não venho»
  (sai da fila).
- Fechou a página? Lê o QR outra vez e volta à senha (fica guardada no telemóvel). Se essa senha já
  terminou (ex.: outro dia), o telemóvel esquece-a e mostra logo o formulário para tirar uma nova.
  Cada telemóvel tem a sua senha.

## Definições (por espaço)

| Definição | Para quê | Por omissão |
| --- | --- | --- |
| Minutos por vez (média) | Base da estimativa | 15 |
| Minutos até a chamada fechar | Depois de chamada, a pessoa conta como atendida passado este tempo | 10 |
| Máximo à espera | Com a fila cheia, ninguém entra pelo QR | 60 |
| Máximo de pessoas por grupo | Limite no formulário | 12 |
| Abrir e fechar com o horário | A fila abre à hora de abertura e fecha à de fecho | não |
| Chamar logo o seguinte ao marcar «Não apareceu» | Um toque em vez de dois | não |
| Perguntar nº de pessoas / serviço / profissional | Restaurantes / barbeiros, clínicas | pessoas: sim |
| Mensagem na página de entrada | Texto para o cliente final | vazio |
| Serviços e profissionais | Estimativa por serviço e botões por profissional | vazio |

## Regras automáticas

- **A chamada fecha sozinha como atendida** ao fim dos «minutos até a chamada fechar» (o dobro para
  quem respondeu «Vou atrasar-me»). Ninguém marca nada. Fecha quando alguém abre o Balcão, o painel,
  a senha ou o ecrã, e pela rotina de 15 em 15 minutos.
- **«Não apareceu»** é a única marcação que a equipa faz (para as estatísticas). Com a opção ligada,
  chama logo o seguinte.
- **Abrir/fechar com o horário**: muda o estado à hora de abertura e de fecho (dias de fecho
  incluídos). Uma mudança à mão é respeitada até à mudança de horário seguinte.
- **Estimativa:**
  - Filas «por vez» (restaurantes): pessoas à frente × minutos por vez, misturado com o ritmo real de
    chamadas dos últimos 90 minutos (a partir de 3 chamadas).
  - Filas por serviço (barbeiros, clínicas): soma da duração dos serviços de quem está à frente,
    dividida pelos profissionais ativos (quem pediu um profissional só conta para esse).
  - Arredondada aos 5 minutos e sempre apresentada como estimativa.
- **Senhas recomeçam do 1** todos os dias (dia do fuso do espaço).
- **Senhas esquecidas** (à espera ou chamadas há mais de 12 h) são fechadas pela rotina.
- **Dados apagados ao fim de 30 dias** (nome, email, notas).
- **Palavras adaptadas ao negócio**: «Mesa pronta» (restaurante), «É a sua vez» (barbeiro, clínica,
  loja).
- **Antiabuso**: no máximo 20 entradas por rede a cada 10 minutos; campo-armadilha contra bots.

## Onde está o código

| O quê | Onde |
| --- | --- |
| Tabelas e entrada atómica (`waitlist_join`) | `supabase/migrations/20261007120000_establishments_modules.sql` |
| Automático (`waitlist_call_next`, `waitlist_settle`, horário) | `supabase/migrations/20261008120000_waitlist_automation.sql`, `20261008140000_waitlist_settle_served.sql` |
| Ações (entrar, responder, chamar, estados, reordenar, balcão, definições) | `src/lib/modules/waitlist/actions.ts` |
| Fila, fecho automático e textos | `src/lib/modules/waitlist/store.ts` |
| Horário (módulo puro, com testes) | `src/lib/modules/waitlist/schedule.ts` |
| Estimativa (módulo puro, com testes) | `src/lib/modules/waitlist/eta.ts` |
| Balcão (separador Fila) | `src/components/modules/counter/QueueCounter.tsx` |
| Módulo do dono / admin | `src/components/modules/waitlist/WaitlistModule.tsx`, `QueueBoard.tsx` |
| Páginas públicas | `src/app/(publico)/fila/[slug]/` (entrada, senha, ecrã) |
| Componentes públicos (alerta, respostas, som) | `src/components/public/waitlist/` |
| Rotinas (fecho automático, horário, senhas esquecidas, 30 dias) | `src/lib/modules/routines.ts`, chamadas por `/api/cron/tick` |
| Espaços e cobertura por espaço | `src/lib/establishments/provision.ts`, `store.ts` |
| Testes | `tests/modules.test.mjs` |

Tabelas: `waitlist_settings` (uma por espaço) e `waitlist_entries` (estados `waiting`, `called`,
`served`, `no_show`, `cancelled`; `close_reason` diz quem fechou: `staff`, `auto` ou `left`). Tudo
passa pelo servidor com a chave de serviço; as páginas públicas só chegam às senhas pelo token
(impossível de adivinhar).

## Limitações atuais

- Sem SMS nem WhatsApp: o aviso é na página e por email.
- No iPhone não vibra, e as notificações só funcionam com a página adicionada ao ecrã principal.
- A atualização é por polling (8 s no Balcão e no painel, 5 s na senha e no ecrã), não em tempo
  real.
