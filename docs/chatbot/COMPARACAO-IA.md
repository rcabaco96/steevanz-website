# Comparação de IAs: Mistral (clientes) e Groq (testes)

Escrito a 2026-10-21. Mesmo motor, mesmo prompt e mesmos excertos (`llm/grounding.ts`, `llm/prompt.ts`) para as
duas; só muda quem escreve a frase final. Documento: a barbearia fictícia «Fio de Navalha»
(`tests/fixtures/barbearia-fio-de-navalha.txt`, formato do PDF), sem horário nem serviços no admin (o caso mais
difícil: tudo vem do documento). Diálogos: 15 dos 30 de `tests/fixtures/dialogues/barbearia.json`, os mais
reveladores (seguimentos, pergunta de volta, «a segunda opção», dias e horas, contas de desconto, coisas que o
documento não diz, inglês, passagem para pessoa, obrigado/adeus).

## Estado

| | Groq `openai/gpt-oss-120b` | Mistral `mistral-small-latest` (= `mistral-small-2603`, Mistral Small 4) |
|---|---|---|
| Corrido | **Sim**, 2026-10-21, 30 chamadas no plano grátis, 25 s entre chamadas | **Ainda não.** O ambiente onde o agente trabalha recusou o pedido à API da Mistral antes de sair (proteção de permissões contra pagamentos); não foi feita nenhuma chamada de conversa à Mistral. Só se leu a lista de modelos (`GET /v1/models`, grátis) |
| Diálogos | 14 de 15 (o 15.º ficou sem chamadas: limite de 30) | 0 de 15 |

**Para completar:** autorizar o agente a fazer pedidos à API da Mistral no plano grátis (sem cartão, não há forma
de haver custos) e voltar a correr o mesmo script com 1,3 s entre chamadas (~35 chamadas, < 2 minutos). A coluna
«Mistral» das transcrições e a tabela são preenchidas nessa altura, e a recomendação fica definitiva.

## Pontuação (Groq, julgada como o dono julgaria)

28 respostas escritas pela IA (as outras 6 voltas são frases fixas: obrigado/adeus, passagem para pessoa, ou o
diálogo 15 sem chamadas). Critérios: factos certos, português de Portugal natural, curto, nada inventado, link
escrito quando existe, nada oferecido que não foi pedido.

| Critério | Groq (tal como respondeu) | Groq com as correções de hoje no motor | Mistral |
|---|---|---|---|
| Factos certos | 26/28 | 27/28 | por correr |
| Natural e bem formatado (pt-PT, curto, sem lixo) | 25/28 (2 listas numa linha só, 1 «[A12][A16]» no fim) | 28/28 | por correr |
| Inventado | 2 (um link que não existe; «aplicam-se as condições habituais») | 1 (o link é cortado; a frase vaga fica) | por correr |
| Ofertas ou frases não pedidas | 1 resposta («E para crianças?»: combinado «pai e filho» e «Pode marcar…» sem perguntarem) | 1 (regra nova no prompt: só se vê no próximo teste real) | por correr |
| Velocidade (só a API) | mediana 0,7 s, máx. 2,3 s | igual | por correr |
| Português do Brasil, «você», inglês numa resposta em português | 0 | 0 | por correr |

Respostas certas que convém registar: pergunta de volta com exemplos e preços reais quando «Quanto custa?» não diz
o serviço; «Quero a segunda opção» → degradê 18 €; desconto de estudante «18 € − 2 € = 16 €» só porque quarta-feira
está dentro de «terça a quinta»; «Fazem tatuagens?» → «Não tenho essa informação» (o documento não diz); troca para
inglês a meio da conversa; nenhum total com IVA.

Problemas e o que se fez (no motor comum, para todos os clientes e as três IAs):

| O que a Groq fez | Correção | Onde |
|---|---|---|
| «Pode marcar em https://barbearia-fiodenavalha.pt/marcar» — o documento diz `reservas.fiodenavalha.example` | Um endereço que a IA não recebeu (prompt, conversa, excertos) é inventado: a frase sai; se a resposta era só isso, «não tenho essa informação». Prompt: «escreva um endereço só como está na informação» | `withoutUnknownLinks`, `prompt.ts` |
| «… remarcamos. [A12][A16]» | Referências inventadas no mesmo estilo também são apagadas | `parseGroundedAnswer` |
| «Depende do tipo de corte: • Corte clássico 16 € • Degradê / fade 18 € …» numa linha | Lista numa linha → uma opção por linha, com a pergunta no fim | `bulletsOnLines` |
| A mesma frase de marcação repetida em várias respostas seguidas | Uma frase (que não seja a primeira) quase igual (≥ 80 % das palavras) a outra já enviada na conversa sai | `withoutRepeats` |
| «Também pode optar pelo combinado pai e filho…» sem perguntarem | Regra explícita no prompt: nunca sugerir outro serviço, pacote ou produto não pedido | `prompt.ts` |

**Filtro `withoutEmptyLinks` verificado com as respostas reais:** não cortou nenhuma frase com link verdadeiro
nas 28 respostas. Ao verificá-lo encontrou-se um erro dele: partia frases no ponto de um endereço
(«Pode marcar no nosso site reservas.fiodenavalha.example.» ficava «fiodenavalha.example.»), e uma lista seguida
de uma frase «veja o nosso site» sem endereço desaparecia toda. Corrigido (as frases só acabam em pontuação seguida
de espaço, e cada linha conta como frase), com testes.

As transcrições abaixo mostram a resposta tal como a Groq a deu e, quando muda, a mesma resposta passada pelo motor
com as correções de hoje (sem nova chamada: a resposta gravada da Groq volta a passar pelo motor).

## Custos por 1 000 respostas (preços sem IVA)

Medido na Groq: em média **2 011 tokens de entrada** (prompt, conversa e excertos) e **85 de saída** por resposta
(dos quais ~37 de raciocínio escondido do gpt-oss). A Mistral Small vai sem raciocínio (`reasoning_effort: "none"`),
por isso deve gastar ~50–70 de saída; a entrada é parecida (outro tokenizador: contar ±10 %).

| | Entrada | Saída | Por 1 000 respostas | Um cliente com 1 500 respostas/mês |
|---|---|---|---|---|
| Groq `gpt-oss-120b` (plano pago; hoje usamos o grátis) | 0,15 $ / M tokens | 0,60 $ / M tokens | 2,011 M × 0,15 $ + 0,085 M × 0,60 $ ≈ **0,35 $** | ≈ 0,53 $ |
| Mistral Small (plano pago «Scale»; hoje o grátis) | 0,15 $ / M tokens | 0,60 $ / M tokens | ≈ 2,1 M × 0,15 $ + 0,06 M × 0,60 $ ≈ **0,35 $** | ≈ 0,53 $ |

Preços: os da Groq são os dados pelo dono. Os da Mistral Small (0,15 $ / 0,60 $) não aparecem na página
mistral.ai/pricing (que hoje só mostra o Mistral Large, 0,5 $ / 1,5 $, e os planos do Le Chat); uma tabela de
preços independente (anotherwrapper.com, set. 2026) dá 0,15 $ / 0,60 $ para o Mistral Small 4, igual ao que o dono
indicou. Confirmar na consola da Mistral (preços do plano Scale) antes do primeiro cliente. Em qualquer caso o custo
de IA fica muito abaixo de 1 € por cliente e por mês, longe dos 49 €/mês + IVA do produto.

Limites dos planos grátis, para testes: Groq gpt-oss-120b ~8 000 tokens/min (≈ 3–4 respostas por minuto); Mistral
«Experiment» ≈ 1 pedido por segundo. Nenhum dos dois serve para clientes: a Groq é dos EUA e o plano grátis da
Mistral pode usar os pedidos para treinar os modelos.

## Recomendação

1. **Mistral para os clientes**, como o dono decidiu (empresa da UE, dados na UE, mesmo preço que a Groq), mas só
   depois de correr esta mesma comparação na Mistral e ela passar: 0 invenções e pelo menos o nível da Groq nos
   factos. Se a Mistral Small falhar no português ou nas contas, experimentar `mistral-medium-latest`
   (`CHATBOT_MISTRAL_MODEL`, mais cara: ver preço na consola) antes de desistir.
2. **Groq e Ollama ficam como IAs de teste** (grátis), nunca para conversas de clientes.
3. As correções de hoje (links inventados, referências, listas, repetições) protegem as três IAs; a regra contra
   ofertas não pedidas está só no prompt e precisa de ser vista no próximo teste real.
4. Antes do primeiro cliente: plano «Scale» com limite de gastos na consola da Mistral, a Mistral na política de
   privacidade e no acordo com o cliente, e «Autorizar IA paga» só nesse assistente.

## Transcrições

### 1. hours tomorrow, then «Quanto custa?» (the owner's test)

| Cliente | Groq (gpt-oss-120b) | Mistral (mistral-small-latest) |
|---|---|---|
| Dá para cortar o cabelo amanhã? | Sim, amanhã (quinta-feira) estamos abertos das 10:00 às 13:00 e das 14:30 às 20:00. Pode marcar online em reservas.fiodenavalha.example ou vir sem marcação, se houver vaga. _(0.9 s)_ | _por correr_ |
| Quanto custa? | Depende do tipo de corte: • Corte clássico 16 € • Degradê / fade 18 € • Corte só à máquina 10 € • Cabelo comprido 22 €. Qual prefere? _(0.5 s)_<br>**Com as correções de hoje:** Depende do tipo de corte:<br>• Corte clássico 16 €<br>• Degradê / fade 18 €<br>• Corte só à máquina 10 €<br>• Cabelo comprido 22 €.<br>Qual prefere? | _por correr_ |

### 2. «Quanto custa?» as the first message: a question back with real examples

| Cliente | Groq (gpt-oss-120b) | Mistral (mistral-small-latest) |
|---|---|---|
| Quanto custa? | Depende do serviço: Corte clássico (16 €), Degradê / fade (18 €), Corte só à máquina (10 €) ou Barba à navalha com toalha quente (15 €). Qual prefere? _(0.4 s)_ | _por correr_ |
| Quero a segunda opção | O degradê / fade custa 18 €. _(0.7 s)_ | _por correr_ |

### 3. a service, then its price, then how long it takes

| Cliente | Groq (gpt-oss-120b) | Mistral (mistral-small-latest) |
|---|---|---|
| Fazem degradê? | Sim, fazemos degradê (fade) com acabamento à navalha, dura 40 min e custa 18 €. _(2.3 s)_ | _por correr_ |
| Quanto custa? | O degradê (fade) custa 18 €. _(0.3 s)_ | _por correr_ |
| E quanto tempo demora? | O degradê demora cerca de 40 minutos. _(0.6 s)_ | _por correr_ |

### 4. price of a cut, then «e para crianças?», then «e a barba?»

| Cliente | Groq (gpt-oss-120b) | Mistral (mistral-small-latest) |
|---|---|---|
| Quanto custa um corte? | Depende do tipo de corte: corte clássico (16 €), corte só à máquina (10 €) ou corte clássico + aparar barba (24 €). Qual prefere? _(0.4 s)_ | _por correr_ |
| E para crianças? | O corte de criança (dos 3 aos 12 anos) custa 12 €. Também pode optar pelo combinado pai e filho, que inclui um corte clássico e o corte de criança por 26 €. Pode marcar ou vir sem marcação, se houver vaga. _(0.7 s)_ | _por correr_ |
| E a barba? | Depende do serviço de barba: aparar e contornar (10 €); barba à navalha com toalha quente (15 €); coloração da barba (12 €). Qual prefere? _(0.7 s)_ | _por correr_ |

### 5. hours tomorrow, then «E ao sábado?»

| Cliente | Groq (gpt-oss-120b) | Mistral (mistral-small-latest) |
|---|---|---|
| A que horas abrem amanhã? | Abrimos amanhã (quinta-feira) das 10:00 às 13:00 e das 14:30 às 20:00. Pode marcar online em reservas.fiodenavalha.example ou vir sem marcação se houver vaga. _(0.8 s)_ | _por correr_ |
| E ao sábado? | Abrimos sábado das 09:00 às 18:00 (sem pausa para almoço). Pode marcar online em reservas.fiodenavalha.example ou vir sem marcação, embora recomendemos marcar com antecedência. _(0.4 s)_ | _por correr_ |

### 6. a question, thanks and goodbye

| Cliente | Groq (gpt-oss-120b) | Mistral (mistral-small-latest) |
|---|---|---|
| Têm Wi-Fi? | Sim, temos Wi-Fi grátis para clientes; a palavra-passe está no balcão. _(0.6 s)_ | _por correr_ |
| Obrigado! | De nada! Se precisar de mais alguma coisa, estamos por aqui. _(frase fixa, sem IA)_ | _por correr_ |
| Adeus | Até breve! Se precisar de alguma coisa, estamos por aqui. _(frase fixa, sem IA)_ | _por correr_ |
| Obrigada, até amanhã! | De nada! Até breve. _(frase fixa, sem IA)_ | _por correr_ |

### 7. asks for a person

| Cliente | Groq (gpt-oss-120b) | Mistral (mistral-small-latest) |
|---|---|---|
| Quanto custa a barba à navalha? | A barba à navalha com toalha quente custa 15 €. _(1.5 s)_ | _por correr_ |
| Quero falar com alguém | Vou passar a sua mensagem à equipa, que lhe responde aqui assim que possível. _(passagem para a equipa, sem IA)_ | _por correr_ |

### 8. something the document doesn't say, then a follow-up on it

| Cliente | Groq (gpt-oss-120b) | Mistral (mistral-small-latest) |
|---|---|---|
| Fazem tatuagens? | Não tenho essa informação. Se preferir, responda «sim» e passo a conversa a uma pessoa da equipa. _(0.5 s)_ | _por correr_ |
| E piercings? | Não tenho essa informação. Se preferir, responda «sim» e passo a conversa a uma pessoa da equipa. _(0.3 s)_ | _por correr_ |

### 9. language switch mid-conversation (Portuguese → English)

| Cliente | Groq (gpt-oss-120b) | Mistral (mistral-small-latest) |
|---|---|---|
| Quanto custa um degradê? | O degradê custa 18 €. _(0.3 s)_ | _por correr_ |
| And how much is it for kids? | The children’s haircut costs 12 €. _(0.6 s)_ | _por correr_ |

### 10. English from the start

| Cliente | Groq (gpt-oss-120b) | Mistral (mistral-small-latest) |
|---|---|---|
| Hello, are you open on Saturday? | Yes, we are open on Saturday from 09:00 to 18:00. You can book online at reservas.fiodenavalha.example. If you prefer to come without a booking, you may do so when there is availability. _(0.7 s)_ | _por correr_ |
| How much? | Which service are you interested in? • Corte clássico – 16 € • Degradê / fade – 18 € • Barba à navalha – 15 € • Corte clássico + aparar barba – 24 € _(0.7 s)_<br>**Com as correções de hoje:** Which service are you interested in?<br>• Corte clássico – 16 €<br>• Degradê / fade – 18 €<br>• Barba à navalha – 15 €<br>• Corte clássico + aparar barba – 24 € | _por correr_ |

### 11. how to book, then without booking

| Cliente | Groq (gpt-oss-120b) | Mistral (mistral-small-latest) |
|---|---|---|
| Como faço uma marcação? | Pode fazer a sua marcação online em reservas.fiodenavalha.example, 24 horas por dia, escolhendo o serviço, o barbeiro e a hora. Também pode marcar por WhatsApp ou telefone 912 000 000 durante o horário de abertura. _(0.8 s)_ | _por correr_ |
| E sem marcação? | Aceitamos clientes sem marcação quando há vaga; ao sábado é mais difícil, por isso recomendamos marcar com 3 a 5 dias de antecedência. Pode vir e, se houver disponibilidade, atendemos. Caso prefira garantir o horário, pode marcar online ou por WhatsApp. _(0.7 s)_ | _por correr_ |

### 12. student discount, then on a fade on Wednesday

| Cliente | Groq (gpt-oss-120b) | Mistral (mistral-small-latest) |
|---|---|---|
| Sou estudante, há desconto? | Sim, há desconto de 2 € no corte clássico e no degradê, de terça a quinta, mediante apresentação de cartão de estudante válido. _(0.7 s)_ | _por correr_ |
| E num degradê à quarta? | Sim, o degradê custa 18 € − 2 € = 16 € para estudantes na quarta-feira. Pode marcar em https://barbearia-fiodenavalha.pt/marcar ou vir sem marcação, se houver vaga. _(0.5 s)_<br>**Com as correções de hoje:** Sim, o degradê custa 18 € − 2 € = 16 € para estudantes na quarta-feira. | _por correr_ |

### 13. gift vouchers, then how long they last

| Cliente | Groq (gpt-oss-120b) | Mistral (mistral-small-latest) |
|---|---|---|
| Vendem vales-oferta? | Sim, vendemos vales-oferta de 20 €, 30 €, 50 € ou do valor de um serviço, como «O Fio de Navalha». Pode comprar na barbearia ou por WhatsApp, enviamos o PDF após o pagamento por MB WAY. Os vales são válidos durante 12 meses. _(0.8 s)_ | _por correr_ |
| E são válidos quanto tempo? | São válidos durante 12 meses. _(0.3 s)_ | _por correr_ |

### 14. late, then missing an appointment

| Cliente | Groq (gpt-oss-120b) | Mistral (mistral-small-latest) |
|---|---|---|
| Vou chegar 15 minutos atrasado, ainda me atendem? | Até 10 minutos de atraso atendemos; com 15 minutos só se o horário seguinte permitir, caso contrário remarcamos. [A12][A16] _(0.4 s)_<br>**Com as correções de hoje:** Até 10 minutos de atraso atendemos; com 15 minutos só se o horário seguinte permitir, caso contrário remarcamos. | _por correr_ |
| E se faltar? | Se faltar, pode cancelar ou alterar gratuitamente até 2 horas antes, pela página de reservas ou por WhatsApp. Depois desse prazo, aplicam-se as condições habituais. Se faltar duas vezes sem avisar, passa a marcar com um sinal de 5 € descontado no serviço. _(0.8 s)_ | _por correr_ |

### 15. open today, then «E no domingo?»

| Cliente | Groq (gpt-oss-120b) | Mistral (mistral-small-latest) |
|---|---|---|
| Estão abertos hoje? | Hoje é quarta-feira, 21/10. O nosso horário:<br>Terça a sexta-feira 10:00–13:00 e 14:30–20:00<br><br>Online: em reservas.fiodenavalha.example, 24 horas por dia.<br>Sem marcação: aceitamos clientes sem marcação quando há vaga. _(não corrido na Groq: acabou o limite de 30 chamadas deste teste; responderam as respostas gratuitas)_ | _por correr_ |
| E no domingo? | Domingo é dia 25/10. O nosso horário:<br>Domingo Fechado<br><br>Online: em reservas.fiodenavalha.example, 24 horas por dia.<br>Sem marcação: aceitamos clientes sem marcação quando há vaga. _(não corrido na Groq: acabou o limite de 30 chamadas deste teste; responderam as respostas gratuitas)_ | _por correr_ |
