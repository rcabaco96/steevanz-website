# Assistente de IA no WhatsApp: arquitetura (fase 1)

Estado em 2026-10-20. Ramo `chatbot`. Nada disto gasta dinheiro: não há chamadas a modelos de IA
pagos, nem à API paga do WhatsApp, e a migração da base de dados está por aprovar.

## 1. O que o site promete (e o sistema tem de cumprir, nem mais nem menos)

Fontes: `src/content/product-copy/ai-chatbot.ts` e `src/content/docs/ai-chatbot.ts`.

| Promessa | Onde fica no sistema |
| --- | --- |
| Responde com a informação do negócio (menu, preços, horários, serviços, políticas), não inventa | `knowledge.ts` (pesquisa), `llm/mock.ts`; sem resposta → «não tenho essa informação» + oferta de pessoa |
| Responde na língua do cliente (pt, en, es, fr, de, it); pode limitar línguas | `language.ts`, definição «Línguas em que responde» |
| Diz que é um assistente automático e mostra nota de privacidade no início | primeira mensagem (`messages.ts → intro`) |
| Envia o link de reserva (sistema de reservas Steevanz ou outro) | intenção `booking` → `bookingUrl` |
| Passa para uma pessoa (reclamações, pedidos especiais, quando o cliente pede) com resumo | `engine.ts → handoffFor`, `guardrails.ts → handoffSummary` |
| A equipa assume a conversa e o assistente cala-se até ser devolvida | `mode = human`; o dono a responder pelo telemóvel pausa sozinho (open-wa) |
| Fora de horas diz quando a equipa responde | `hours.ts`, `handoffClosed` |
| Não dá conselhos médicos, jurídicos ou financeiros; clínicas: nada clínico | intenção `medical` (clínicas) + regras do prompt |
| Não pede dados sensíveis; não promete descontos/reembolsos | prompt + `sanitizeReply` (números de cartão) |
| Alojamento: nunca partilha códigos da porta/caixa/alarme, nunca confirma quem está hospedado, emergência → 112 e aviso imediato, reclamações/danos/reembolsos/entrada antecipada/saída tardia → anfitrião com resumo; até 5 alojamentos por número | regras `lodging` em `engine.ts`, filtro de códigos em `guardrails.ts`, `properties` (máx. 5) |
| Histórico das conversas para rever; guardado só o prazo acordado (RGPD) | `chatbot_conversations` / `chatbot_messages`, `retention_days` + `chatbot_prune()` |
| Site (widget) e WhatsApp | **Fase 1 só WhatsApp.** O motor não depende do canal; o widget do site é um adaptador `web` futuro |

**Canal:** as páginas publicadas prometem a **WhatsApp Business Platform da Meta**; o dono decidiu que
os clientes usam a API oficial (as páginas ficam certas) e que o open-wa é só para testes internos.

## 2. Peças

```
WhatsApp do negócio
   │  (open-wa: sessão «dispositivo ligado»  |  API oficial: webhook da Meta — fase 2)
   ▼
scripts/chatbot/runner.mjs  ── processo longo, arrancado à mão (como o leitor de reviews)
   │  adapters/open-wa.mjs  ⟶  interface ChannelAdapter (src/lib/chatbot/adapters.ts)
   ▼
src/lib/chatbot/runtime.ts  ── fila por conversa, duplicados, eco das próprias mensagens,
   │                            dono assume, ritmo humano (pacing.ts)
   ▼
src/lib/chatbot/engine.ts   ── língua → intenções → regras fixas de segurança → resposta → filtro final
   │        ├─ knowledge.ts  pesquisa grátis (palavras + «conceitos» nas 6 línguas)
   │        ├─ hours.ts      aberto agora / próxima abertura / semana por extenso
   │        └─ llm/          AnswerProvider: mock (hoje) | real (marcador desligado)
   ▼
src/lib/chatbot/supabase-store.ts ── conversas, mensagens, estado da sessão (QR) no Supabase
   ▲
/admin/chatbot ── ligação (QR), conhecimento, definições, conversas (passagens), experimentar
```

Tudo o que está em `src/lib/chatbot/*.ts` (exceto `actions.ts` e `admin-store.ts`) é TypeScript puro,
sem Next.js: corre no Next, no `runner.mjs` (Node 24, sem compilação) e nos testes.

### Fluxo de uma mensagem

1. O adaptador entrega `InboundMessage` (grupos, listas e estados são ignorados).
2. `runtime`: já processada? (id do canal) → ignora. Do próprio negócio (`fromOwner`)? Se for o eco de
   uma resposta do assistente, ignora; se for o dono a escrever pelo telemóvel → a conversa passa para
   a equipa (`owner_took_over`) e o assistente cala-se.
3. Grava a mensagem do cliente. Mais antiga que 15 min (atraso depois de reconectar) → não responde
   automaticamente; fica na caixa da equipa.
4. `engine.respond`:
   - assistente desligado → silêncio; conversa com a equipa → silêncio (volta sozinho só se o negócio
     escolheu «volta depois de X horas sem a equipa escrever»);
   - língua da resposta; primeira mensagem = apresentação + privacidade;
   - regras fixas por ordem: emergência (112 + alerta urgente) → código de acesso (alojamento) →
     questão médica (clínica) → reclamação → reembolso/dano/entrada antecipada/saída tardia
     (alojamento) → «quero falar com uma pessoa» → «sim» depois de o assistente oferecer uma pessoa;
   - alojamento: «quem está hospedado?» → recusa por privacidade;
   - vários alojamentos e a resposta depende do alojamento → pergunta qual; quando o hóspede diz,
     responde à pergunta anterior;
   - pesquisa no conhecimento → `AnswerProvider` (mock) → filtro final (`sanitizeReply`: nunca linhas
     com «código/PIN/alarme/keybox» + algarismos no alojamento; nunca números de cartão; corta texto
     longo). Se o filtro tirar tudo → passa ao anfitrião;
   - nada encontrado → «não tenho essa informação» + telefone + «responda sim» para uma pessoa.
5. `runtime` envia as respostas com atraso de escrita humano, respeitando os limites (`pacing.ts`),
   grava-as e, se houve passagem, guarda o resumo, põe a conversa na caixa e avisa (`onHandoff`:
   aviso opcional no WhatsApp pessoal do dono).

### Passagem para pessoa (handoff)

- Estado por conversa: `mode = bot | human`, motivo, resumo (em português para a equipa), urgente.
- Com open-wa o número continua no telemóvel do negócio (dispositivo ligado): a equipa responde no
  WhatsApp normal e isso pausa o assistente nessa conversa. Na caixa do admin: «Devolver ao
  assistente» ou «Marcar como vista».
- Proteção contra ciclos: mais de 8 respostas em 10 min na mesma conversa → passa a uma pessoa
  (outro robô do outro lado, por exemplo).

### Horário e fora de horas

Vem do espaço (`establishment_hours` / `establishment_closures`) ligado ao assistente. Sem horário, o
assistente nunca diz que está fechado. Fora de horas: responde às perguntas na mesma (a informação não
fecha) e, ao passar para a equipa, diz quando ela responde («respondemos amanhã às 12:00»).

### Línguas

Deteção grátis por palavras e letras típicas (`language.ts`); mensagem ambígua («ok», «menu») mantém a
língua da conversa. Frases fixas nas 6 línguas no registo do site (usted, vous, Sie, Lei). O mock não
traduz: uma resposta escrita pelo negócio em português vai em português com uma nota na língua do
cliente; o negócio pode escrever a mesma resposta noutras línguas (campo «Escrita em»). Traduzir
automaticamente é trabalho do modelo real (fase 2).

### Conhecimento por negócio

- **Respostas do negócio** (admin → Conhecimento): pergunta/tema, resposta, palavras que os clientes
  usam, alojamento, língua, ativa.
- **Lido de outras partes do site:** espaço (morada, telefone, Maps, horário, fechos, serviços com
  preço e duração), menu em vídeo (pratos e preços; link do menu se estiver ativo).
- **Guia do alojamento:** ainda não existe como dados no site (só a página do produto e a
  documentação); por agora as respostas do guia escrevem-se no conhecimento. Quando o guia tiver
  tabelas, liga-se como mais uma fonte em `rows.ts → botProfileFrom`.
- Pesquisa sem embeddings: palavras em comum (com radical simples), «conceitos» que juntam a mesma
  ideia nas 6 línguas (parking = estacionamento = aparcamiento…), e uma regra de cobertura (a resposta
  tem de cobrir pelo menos metade do que foi perguntado) para não responder ao lado.

### Camada de IA (LLM)

- Interface `AnswerProvider` (`llm/types.ts`). Hoje: `mockProvider` (determinístico, grátis).
- `realProviderPlaceholder`: tem a interface mas **não tem implementação** — lança
  `ProviderDisabledError`, o motor regista e responde com o mock. Não lê chaves, não faz pedidos.
- `chooseProvider` só devolve o marcador se `answer_provider = 'real'` **e**
  `paid_answers_allowed = true` (interruptor do dono no site, a criar na fase 2).
- `llm/prompt.ts`: o prompt de sistema e o contexto que um modelo real receberia (regras, tom,
  informação do negócio, entradas encontradas). Testado, nunca enviado. As regras de segurança
  continuam no código antes e depois do modelo, por isso um modelo que ignore o prompt continua sem
  conseguir enviar um código da porta nem saltar a passagem para pessoa.

### Dados (Supabase) — migração por aprovar

`supabase/migrations/20261020200000_chatbot.sql` (rollback em `supabase/rollbacks/`). Só acrescenta.
RLS ligado e sem acesso para anon/authenticated (só service role, como os menus em vídeo).

| Tabela | Para quê |
| --- | --- |
| `chatbot_bots` | um assistente por número: cliente, espaço/menu ligados, tipo, ligado/desligado, canal, línguas, tom, links, alojamentos (≤ 5), volta automática, prazo de conservação, interruptores da IA paga (desligados) |
| `chatbot_knowledge` | respostas do negócio |
| `chatbot_sessions` | estado da sessão WhatsApp escrito pelo programa (QR, ligado, erro, último sinal de vida) |
| `chatbot_conversations` | uma por cliente e canal: estado do motor (jsonb), modo bot/equipa, motivo e resumo da passagem, urgente, «para a equipa» |
| `chatbot_messages` | mensagens (cliente, assistente, equipa), id do canal único (sem duplicados) |
| `chatbot_prune()` | apaga mensagens mais antigas que o prazo de cada assistente (o programa chama 1×/dia) |

### Limites e higiene anti-bloqueio (`pacing.ts`)

- Só responde a quem escreveu; nunca inicia conversas, nunca envia em massa, nunca escreve para grupos.
- Atraso de «a escrever…» proporcional ao texto (1,5–8 s, ±25 %); 1,5 s mínimo entre mensagens para a
  mesma conversa; teto de 20 mensagens/min e 600/dia por número (depois pára e deixa na caixa).
- Não responde a mensagens com mais de 15 min (depois de uma reconexão) nem fora de 24 h.
- Piloto open-wa (`pilotPacing`, ver `PILOTO.md`): 3–8 s a escrever, máx. 10 respostas/hora e 50/dia, só números autorizados.
- Sessão persistente fora do repositório (`~/.steevanz-chatbot/<bot>`), um processo por assistente
  (ficheiro de bloqueio), modo `--listen-only` para testar a ligação sem responder.
- Com open-wa recomenda-se ainda: número com histórico (não acabado de criar), começar com poucas
  conversas, não mandar links encurtados, e responder sempre a um cliente que escreveu primeiro.

## 3. Onde corre

O open-wa precisa de um **processo Node sempre ligado com um Chrome sem janela e uma sessão por número**.
Não cabe na Vercel (funções curtas, sem browser persistente). Tal como o leitor de reviews:

1. Agora: no computador, arrancado à mão (`node scripts/chatbot/runner.mjs --bot <id>`).
2. Depois: no servidor gratuito da Oracle (VM ARM). Cada sessão de Chrome usa algumas centenas de MB de
   memória; medir na primeira sessão real antes de prometer quantos números cabem por servidor.

A API oficial, pelo contrário, funciona por webhook e cabe na Vercel (sem processo longo).

## 4. open-wa versus API oficial da Meta — decisão do dono

Verificado em 2026-10-20 (fontes no fim). Valores da Meta mudam por trimestre e por país.

| | **open-wa (WhatsApp Web, não oficial)** | **WhatsApp Business Cloud API (oficial, Meta)** |
| --- | --- | --- |
| Como liga | O número do negócio fica como «dispositivo ligado» (QR). Continua a funcionar no telemóvel | Número registado na plataforma da Meta (app de programador + conta de empresa) |
| Custo por mensagem | 0 € da Meta | Desde 1/10/2026: **1000 respostas de serviço grátis por número/mês**, depois pagas por mensagem à tarifa do país; modelos utilitários dentro da janela também passaram a pagar. Tarifas de Portugal: confirmar na tabela da Meta (uma página de revendedor indica marketing ≈ 0,049 € e utilitário/autenticação ≈ 0,0142 €) |
| Custo da biblioteca/serviço | Licença **Hippocratic + Do Not Harm 1.1** (grátis, mas não é open source clássico: proíbe certos usos e permite ao autor terminar a licença). Funcionalidades «Insiders» pedem chave paga (anúncio no Gumroad: **£15/mês**, por número; confirmar). Enviar para quem não é contacto pede chave «restricted» com aprovação — não precisamos (só respondemos) | Alojamento grátis pela Meta (Cloud API). Sem intermediário obrigatório; um BSP cobra extra se for usado |
| Verificação | Nenhuma | Verificação da empresa na Meta, nome aprovado, número dedicado (ou o modo de coexistência com a app WhatsApp Business, onde a Meta o disponibilize — confirmar para Portugal) |
| Risco de bloqueio do número | **Real.** Automação não autorizada viola os termos do WhatsApp; o número pode ser banido sem aviso nem recurso. Mitigado (não eliminado) pelas regras anti-bloqueio | Baixo, se cumprir as políticas (só responder, modelos aprovados para iniciar) |
| Estabilidade | Depende do WhatsApp Web: uma mudança da Meta pode partir tudo até sair nova versão. A v5 (5.6.6, 16/10/2026) é recente e a documentação ainda está a ser reorganizada | API estável e documentada |
| Termos do projeto | O `tos.md` do open-wa tem cláusulas fora do comum (aceitação «por existir», declaração política no ponto 7.1, lei aplicável «ao humor dos mantenedores»). Recomenda-se leitura jurídica antes de o usar comercialmente | Termos da Meta para empresas. Desde 15/1/2026 a Meta proíbe **assistentes de IA de uso geral** na plataforma; assistentes **do próprio negócio** (o nosso caso) continuam permitidos |
| Janela de 24 h / modelos | Não existe (mas o assistente respeita-a de propósito) | Resposta livre só até 24 h após a última mensagem do cliente; depois, só modelos aprovados |
| Onde corre | Processo longo + Chrome (computador / Oracle) | Webhook na Vercel |
| Coincide com o que o site promete | **Não** (docs falam da plataforma da Meta) | **Sim** |

**Decisão do dono (2026-10-20):** open-wa **só para testes** no número de teste (regras em
`PILOTO.md`); os clientes pagos vão usar a **API oficial**. As páginas do produto mantêm a promessa da
plataforma oficial.

**Recomendação inicial (mantida para registo):** open-wa serve para **pilotos e demonstrações** a custo zero, com o risco
explicado ao cliente e num número que ele aceite arriscar. Para clientes pagos e o que o site
promete, a **API oficial** é o caminho seguro; com as 1000 respostas grátis por mês e por número, um
restaurante ou um alojamento pequeno pode ficar perto de 0 € de Meta (estimar com o volume real).
Por isso o código está atrás de `ChannelAdapter`: trocar open-wa pela API oficial (ou por Baileys,
MIT, sem Chrome, mesmo risco que o open-wa) não toca no motor, no conhecimento nem no admin.

## 5. O que fica para a fase 2 (cada passo com o dono)

1. Aprovar e aplicar a migração (Management API, transação, rollback pronto).
2. Escolher o canal por cliente (open-wa para piloto / API oficial) e emparelhar o primeiro número com
   `--listen-only` primeiro.
3. Se for a API oficial: app na Meta, verificação, webhook `/api/chatbot/whatsapp`, adaptador
   `cloud-api.mjs` (hoje desligado).
4. Escolher um modelo de IA, ver preços atuais, ligar o interruptor «IA paga» no site e implementar
   `realProvider` (o prompt e as regras já estão escritos). Sem isto o assistente continua grátis e
   só responde com o que está no conhecimento.
5. Widget do site (adaptador `web`) e caixa do cliente no painel (`/painel`), alertas por email/push.
6. Guia do alojamento como dados → fonte automática do conhecimento.

## Fontes

- open-wa: README e LICENSE do repositório `open-wa/wa-automate-nodejs`; `tos.md`; npm
  `@open-wa/wa-automate` (5.6.6, 2026-10-16); anúncio da chave em `smashah.gumroad.com/l/open-wa`.
- Meta: `developers.facebook.com/documentation/business-messaging/whatsapp/pricing` (alterações de
  1/10/2026, 1000 mensagens de serviço grátis) e `…/pricing/ai-providers/` (assistentes de uso geral,
  termos de 15/1/2026).
- Tarifas de Portugal (não oficiais, a confirmar): `whautomate.com/whatsapp-business-api-pricing-portugal`.
