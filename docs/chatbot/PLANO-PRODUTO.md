# Assistente IA Steevanz — plano para um produto vendável

Escrito a 2026-10-21, depois dos testes do dono com a barbearia fictícia. Objetivo: um assistente que um negócio
paga 49 €/mês + IVA sem se envergonhar com ele. Cada fase só fecha quando passa os critérios de aceitação.

## Princípios

1. **Nunca inventar.** Só responde com a informação do negócio; se não tem, diz que não sabe e passa à equipa.
2. **Falar como uma pessoa do negócio.** Português de Portugal natural, curto, simpático; nada de frases
   telegráficas nem de robô.
3. **Conversa, não perguntas soltas.** Lembra-se do que foi dito na conversa e percebe seguimentos
   («Quanto custa?», «E ao sábado?»).
4. **Qualidade medida antes de publicar.** Um conjunto de conversas de teste por setor corre em cada mudança;
   nada vai para os clientes sem passar.
5. **Correções no motor comum**, nunca para um cliente só (ver `.claude/skills/steevanz-chatbot`).
6. **Custo controlado.** IA paga só para clientes que pagam, com limites por cliente.

## Fase A — O básico tem de estar feito (em curso, 2026-10-21)

- Memória da conversa: a IA recebe as últimas mensagens; a pesquisa usa a pergunta anterior nos seguimentos.
- Perguntas de esclarecimento quando a pergunta é ambígua («Quanto custa?» → «Qual serviço? Corte 16 €, …»).
- Português natural nas respostas da IA e nas frases fixas.
- Língua: o português ganha na dúvida; «segunda opção» deixa de ser segunda-feira.
- Fontes limpas no admin.
- **Avaliação automática**: conversas de 2 a 4 mensagens da barbearia em 4 formatos de documento
  (arrumado, corrido, desarrumado, WhatsApp), nas respostas grátis e no que a IA recebe; verificação real com a
  IA de teste.

**Aceitação:** as conversas de teste passam todas; numa conversa real de 10 mensagens com a IA de teste, nenhuma
resposta errada, inventada ou com português estranho.

## Fase B — Qualidade em todos os setores

- Documentos de exemplo fictícios (claramente marcados) para restaurante, alojamento local, clínica, loja e
  cabeleireiro/estética, cada um em vários formatos.
- 25+ conversas de teste por setor: preços, horário e dias, marcações/reservas, seguimentos, alergias e menu
  (restaurante), check-in/Wi-Fi/regras (alojamento), nada clínico (clínica), stock e entregas (loja), troca de
  língua, reclamação, pedido de pessoa, agradecimento/despedida, pergunta fora do documento.
- Métrica por setor (% certas) e limite mínimo para publicar.

**Aceitação:** ≥ 95 % das conversas certas em todos os setores, 0 invenções.

**Estado (2026-10-22): feito nas respostas grátis e no que a IA recebe; falta a verificação com IA real.**

- Documentos fictícios (marcados no topo, contactos 9xx 000 000 e domínios .example, sem avaliações):
  restaurante (`restaurante-lagar-da-ribeira`), alojamento (`alojamento-casa-das-ondas`, com o código da porta
  e da caixa das chaves de propósito), clínica dentária (`clinica-sorriso-atlantico`), loja/retrosaria
  (`loja-novelo`) e cabeleireiro/estética de senhora (`salao-flor-de-lis`), cada um em texto arrumado e em estilo
  WhatsApp; o teste corre-os em 4 formatos (arrumado, corrido, desarrumado, WhatsApp).
- 26 a 30 conversas por setor (`tests/fixtures/dialogues/*.json`), de 1 a 4 mensagens, em pt, en, es e fr:
  preços, seguimentos, horários (hoje, amanhã, dia da semana, feriado, fecho semanal), reservas (nunca «há vaga»),
  temas do setor, reclamação e pedido de pessoa, cumprimentos/agradecimentos, 3+ perguntas fora do documento.
- Guardas verificadas em todas as mensagens: o código da porta nunca vai numa resposta nem no que a IA recebe; na
  clínica, dores, inchaço, sangramento, medicamentos e cuidados pós-tratamento passam à equipa clínica (com 112) e
  a IA não é chamada; pedido de reembolso passa à equipa, pergunta sobre a política é respondida.
- Resultado (mensagens × 4 formatos, respostas grátis): barbearia 100 %, salão 100 %, alojamento 99,6 %, clínica
  99,5 %, restaurante 98,4 %, loja 95,8 %; 0 invenções; o que a IA recebe certo em 100 % dos casos.
- Marcadas «só com IA» (contam como erradas nos 95 %): «cabrito… dá para amanhã?» (o prato só ao domingo), na loja
  «12 novelos para uma camisola» e «quanto tempo demora a chegar?» depois dos envios, e no formato WhatsApp «só uma
  noite?» (alojamento) e «é paga mesmo que faça o tratamento?» (clínica).
- Correções todas no motor comum (lições na skill `steevanz-chatbot`). Falta: conversa de verificação com a IA de
  teste/Mistral quando houver quota grátis e autorização do dono.

## Fase C — Configuração que um cliente consegue fazer sozinho

- Assistente de configuração em passos: dados do negócio (morada, telefone, link de marcação), horário e fechos,
  serviços e preços (lista simples, também colada de texto), perguntas frequentes sugeridas por setor,
  documentos.
- Ligação ao Espaço (horário e serviços) e ao Menu em vídeo já existentes.
- Pré-visualização «Experimentar» com perguntas sugeridas do setor.
- **Perguntas sem resposta** (precisa de migração, autorização do dono): uma linha por pergunta diferente com
  contador, máx. 200 por negócio, apagadas ao responder ou aos 90 dias; responder cria uma entrada de
  conhecimento.

**Aceitação:** um negócio novo fica a responder bem em menos de 15 minutos, sem a Steevanz.

## Fase D — Canais a sério

- **WhatsApp oficial (Cloud API da Meta)** para clientes: verificação da empresa, número de cada negócio,
  webhook na Vercel, respostas a mensagens recebidas (grátis nas 24 h), modelos aprovados só se forem precisos.
  O open-wa fica só para testes internos.
- **Widget no site** do cliente (e nos sites feitos pela Steevanz): o mesmo motor, canal `web`.
- Passagem para pessoa: aviso ao dono (WhatsApp/e-mail), caixa de entrada no painel, devolver ao assistente.

**Aceitação:** piloto com 1 negócio real durante 2 semanas, sem incidentes.

## Fase E — Operação

- IA paga para clientes: **Mistral (UE)** como principal, Groq como alternativa; cadeia de recurso
  (paga → grátis → respostas sem IA); limites e custo por cliente visíveis no admin.
- Monitorização: erros, tempo de resposta, respostas «não sei» por negócio, alertas.
- RGPD: prazo de conservação (já existe), acordo de tratamento de dados com o cliente, subcontratantes
  (Meta, Mistral/Groq, Vercel, Supabase) na política de privacidade.
- Nota do dono (2026-10-21): sem mensagem de apresentação «sou um assistente automático» — decisão tomada depois
  de ser informado do AI Act (art. 50.º).

## Fase F — Venda

- Demonstração por setor (o assistente da barbearia, do restaurante, …) para mostrar porta a porta.
- Página do produto com conversas reais de exemplo (sem inventar avaliações).
- Preço: 49 €/mês + IVA; configuração inicial a decidir; custo estimado 1–3 €/mês por cliente com IA paga.

## Ordem e dependências

A → B → C (em paralelo com D quando o dono tratar da verificação na Meta) → E → F. Migrações e contas novas
precisam sempre da autorização direta do dono.
