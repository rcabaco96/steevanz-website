# Piloto do assistente no WhatsApp (open-wa): guia interno de testes

**Só para testes da Steevanz.** Decisão do dono (2026-10-20): o open-wa serve apenas para
experimentar, no **número de teste**. Os clientes pagos vão usar a **API oficial do WhatsApp**
(Cloud API da Meta). Nunca ligar aqui o número principal da Steevanz nem o de um cliente.

O número de teste está só no `.env.local` (`CHATBOT_TEST_NUMBER`), nunca no git nem em páginas do site.

## Regras de segurança (já estão no programa, ligadas por omissão)

| Regra | Como está garantida |
| --- | --- |
| Ninguém da Steevanz nem nenhum agente liga ou emparelha o número | Só o dono lê o QR, quando decidir |
| Primeira vez: **só ouvir** | Sem `--reply` o programa nunca envia nada |
| Só responde a números autorizados | `CHATBOT_ALLOWLIST` no `.env.local` (começa só com o número pessoal do dono). Quem não estiver na lista é ignorado: nem resposta nem registo |
| Não arranca a responder sem lista nem número de teste | Com `--reply`, sem `CHATBOT_TEST_NUMBER` e `CHATBOT_ALLOWLIST` o programa recusa-se a arrancar |
| Só no número de teste | Se o número emparelhado não for o número de teste, o programa desliga-se sozinho |
| Nunca escreve primeiro | Só responde a quem lhe escreveu; não envia avisos a ninguém no WhatsApp (as passagens para a equipa aparecem no admin) |
| Sem mensagens em massa, grupos ou estados | Grupos, listas de difusão e estados são ignorados |
| Ritmo humano | 3 a 8 segundos «a escrever» antes de cada resposta; 5 s entre mensagens na mesma conversa |
| Limites do piloto | No máximo **10 respostas por hora** e **50 por dia** (depois pára e deixa as mensagens para a equipa) |
| Botão de paragem | Admin › Chatbot IA › assistente › «Desligar respostas» (o programa lê-o a cada 15 s e também antes de cada envio); no computador: `Ctrl+C`, ou criar um ficheiro `PAUSE` na pasta da sessão |
| Sem testes automáticos no WhatsApp | Os testes do projeto usam só o WhatsApp falso e o simulador |

## Antes de começar

1. A migração do assistente (`supabase/migrations/20261020200000_chatbot.sql`) tem de estar aplicada.
2. Em `/admin/chatbot`, criar o assistente de teste (cliente: a própria Steevanz, ou uma conta de
   teste) e escrever algumas respostas em «Conhecimento». Experimentar em «Experimentar»: não custa
   nada e não toca no WhatsApp.
3. Deixar as **respostas desligadas** no admin por agora.
4. No `.env.local` do projeto confirmar:
   ```
   CHATBOT_TEST_NUMBER=<número de teste, com 351>
   CHATBOT_ALLOWLIST=<o seu número pessoal, com 351>
   ```

## Passo a passo

1. **Instalar o open-wa** (só nesta pasta; não vai para o site):
   ```
   cd scripts/chatbot
   npm install
   cd ../..
   ```
2. **Arrancar só a ouvir** (copie o comando do separador «Ligação» do assistente):
   ```
   node scripts/chatbot/runner.mjs --bot <id do assistente>
   ```
   O terminal deve dizer «Modo: SÓ A OUVIR».
3. **Ler o QR** com o telemóvel do número de teste: WhatsApp › **Dispositivos ligados** ›
   **Ligar um dispositivo**. O QR aparece no terminal.
4. **Confirmar que o QR também aparece no admin** (separador «Ligação», atualiza sozinho). Depois de
   ler, o admin passa a «Ligado».
5. **Testar só a ouvir:** do seu telemóvel pessoal, envie «Olá» para o número de teste. No terminal
   aparece a mensagem e em «Conversas» fica registada (se o seu número estiver na lista). Ninguém
   recebe resposta. Uma mensagem de outra pessoa aparece como «fora da lista, ignorada».
6. **Ligar as respostas:** parar com `Ctrl+C`, ligar «Ligar respostas» no admin e arrancar com:
   ```
   node scripts/chatbot/runner.mjs --bot <id do assistente> --reply
   ```
   Envie perguntas do seu telemóvel pessoal (horário, morada, «quero falar com alguém»). Só o seu
   número recebe respostas, no máximo 10 por hora.
7. **Para parar:** «Desligar respostas» no admin (para em segundos) ou `Ctrl+C` no terminal.

## IA de teste local (opcional, grátis)

Sem IA, o assistente responde só com o que está escrito no conhecimento e nos documentos. Para testar
respostas escritas por IA, sem custos e sem enviar nada para fora do computador, usa-se o **Ollama**
no mesmo computador onde corre o programa do assistente:

1. Instalar o Ollama (ollama.com, versão Windows) e descarregar o modelo uma vez (≈ 4,7 GB):
   ```
   ollama pull qwen2.5:7b
   ```
2. Deixar o Ollama ligado: a app do Windows já o deixa a correr; senão, num terminal à parte,
   `ollama serve`. Confirmar com `curl http://127.0.0.1:11434/api/tags` (deve aparecer `qwen2.5:7b`).
3. No admin › assistente › Definições, ligar «IA de teste local (Ollama, grátis)» e guardar.
   Experimentar primeiro em «Experimentar»
   no site local (`npm run dev`); no site online (Vercel) não há Ollama e responde sem IA.
4. Arrancar o programa como no passo a passo. O terminal diz «Respostas: IA de teste local (Ollama…)».

Num portátil sem placa gráfica cada resposta pode demorar 10 a 60 segundos (o primeiro pedido carrega
o modelo e demora mais). Se o Ollama não estiver ligado, demorar mais de 60 s ou já estiver a escrever
outra resposta, o assistente responde sem IA e o terminal diz porquê. A IA só usa a informação do
assistente; quando não sabe, diz que não tem essa informação e oferece passar à equipa. As regras de
segurança (112, códigos, passagem para pessoa, limites de 10/hora e 50/dia) continuam iguais.

## IA de teste no site: Groq (opcional, grátis)

O «Experimentar» do site online não tem Ollama. Para testar respostas escritas por IA também aí (e
no programa do assistente), usa-se o **plano grátis da Groq**:

1. Criar a chave: console.groq.com › entrar › API Keys › Create API Key. **Não pôr cartão nem mudar
   de plano** (assim nunca há custos).
2. Pôr nas variáveis de ambiente, nunca no código: na Vercel (Settings › Environment Variables,
   cifradas) e no `.env.local` do computador:
   ```
   GROQ_API_KEY=<a chave>
   CHATBOT_GROQ_ENABLED=1
   ```
   Opcionais: `CHATBOT_GROQ_MODEL` (por omissão `llama-3.3-70b-versatile`), `CHATBOT_GROQ_TIMEOUT_MS`
   (15000) e os tetos `CHATBOT_GROQ_MAX_PER_MINUTE` (20), `CHATBOT_GROQ_MAX_PER_DAY` (300),
   `CHATBOT_GROQ_BOT_MAX_PER_MINUTE` (10), `CHATBOT_GROQ_BOT_MAX_PER_DAY` (150),
   `CHATBOT_GROQ_MAX_TOKENS_PER_MINUTE` (9000) e `CHATBOT_GROQ_MAX_TOKENS_PER_DAY` (80000). Depois de
   mudar variáveis na Vercel é preciso um novo deploy.
3. No admin › assistente › Definições, escolher «IA de teste (Groq, grátis)» e guardar. Experimentar
   em «Experimentar»: por baixo da resposta aparece «IA de teste (Groq, grátis)» ou, se não foi usada,
   a razão (limite atingido, sem chave, erro, mais de 15 s).

O plano grátis tem limites por minuto e por dia; os nossos tetos ficam bem abaixo (na prática umas
40–80 respostas de teste por dia). Quando se atingem, ou se a Groq falhar, o assistente responde sem
IA. **Privacidade:** com a Groq ligada, as mensagens da conversa e os excertos dos documentos são
enviados à Groq, uma empresa dos EUA: usar só com as suas próprias mensagens de teste, não com
clientes. As regras de segurança (112, códigos, passagem para pessoa, limites de 10/hora e 50/dia)
continuam iguais.

## O que não fazer

- Não ligar o número principal nem números de clientes.
- Não acrescentar à lista números de pessoas que não sabem que é um teste.
- Não aumentar os limites, não enviar muitas mensagens seguidas «para ver se aguenta», não usar
  grupos.
- Não deixar o programa a correr sem vigilância nos primeiros dias.

## Se algo correr mal

- **O WhatsApp avisa ou restringe o número:** parar logo (`Ctrl+C`), desligar as respostas no admin e
  não voltar a ligar nesse dia. Em WhatsApp › Dispositivos ligados pode remover o dispositivo.
- **O programa diz que o número ligado não é o número de teste:** leu o QR com o telemóvel errado.
  Remova o dispositivo nesse telemóvel.
- **Não aparece QR no admin:** use o do terminal (a v5 do open-wa é recente; confirmar no primeiro uso).
- **Uma mensagem do seu número aparece como «fora da lista»:** o WhatsApp pode identificar alguns
  contactos por um código sem número (`@lid`); nesse caso a regra protege e não responde. Avise para
  ajustarmos.
