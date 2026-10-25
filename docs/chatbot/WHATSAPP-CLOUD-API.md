# Assistente no WhatsApp pela API oficial (Cloud API da Meta)

Estado em 2026-10-25, ramo `chatbot-cloud-api`. Só para o número da própria Steevanz por agora (sem clientes).

## Como funciona

```
Cliente escreve no WhatsApp da Steevanz
   │  Meta chama o webhook do site
   ▼
POST /api/chatbot/whatsapp   (src/app/api/chatbot/whatsapp/route.ts)
   │  1. confirma a assinatura X-Hub-Signature-256 (app secret)
   │  2. responde 200 logo (senão a Meta repete)
   │  3. depois da resposta (after): mesmo runtime, motor e Supabase do runner open-wa
   ▼
Resposta enviada pela Graph API (src/lib/chatbot/cloud-api.ts), com «a escrever…»
```

- Sem processo no computador do dono: corre no Vercel.
- As conversas ficam em `/admin/chatbot` › assistente › Conversas (contacto, nome e mensagens): é a lista de leads.
- «Quero falar com uma pessoa» (ou reclamação) → a conversa passa para a equipa, o assistente cala-se nessa conversa
  e vai um email para `ADMIN_EMAILS` com o resumo.
- Coexistência (a app WhatsApp Business continua no telemóvel com o mesmo número): o que o dono escreve na app
  chega como `smb_message_echoes` e também passa a conversa para a equipa. Sem coexistência, a caixa do admin ainda
  não tem botão de responder.
- Interruptor: «Ligar/Desligar respostas» no admin, lido a cada mensagem. Desligado → guarda as mensagens, não envia.
- O assistente nunca escreve primeiro (sem templates): só responde dentro da janela de 24 h.

## Custos (Meta, desde 2026-10-01)

Cada mensagem enviada pelo assistente é cobrada por mensagem entregue (Portugal: grupo «Rest of Western Europe»),
exceto nas conversas que começam num anúncio click-to-WhatsApp (janela gratuita, «free entry point»). Mensagens
recebidas são grátis. A Meta exige um método de pagamento na conta para enviar respostas. É decisão do dono.

## Passos do dono (uma vez)

1. **Meta Business**: em business.facebook.com, usar ou criar o portfólio da Steevanz.
2. **App**: em developers.facebook.com › Criar app › tipo «Business» › adicionar o produto **WhatsApp**.
   A Meta dá um número de teste: dá para experimentar tudo sem o número real.
3. **Número**: em WhatsApp › API Setup, adicionar o número da Steevanz (ou ficar com o de teste primeiro).
   Para manter a app WhatsApp Business no telemóvel, escolher a ligação com coexistência se a Meta a oferecer
   para esse número.
4. **Token permanente**: Business Settings › Utilizadores › Utilizadores do sistema › adicionar (Admin), atribuir a
   app e a conta WhatsApp, gerar token com `whatsapp_business_messaging` e `whatsapp_business_management`.
5. **Variáveis no Vercel** (Production e Preview):

   | Variável | Onde está |
   | --- | --- |
   | `WHATSAPP_VERIFY_TOKEN` | Inventar um texto longo e aleatório |
   | `WHATSAPP_APP_SECRET` | App › Definições › Básico › Chave secreta da app |
   | `WHATSAPP_ACCESS_TOKEN` | O token do passo 4 |
   | `WHATSAPP_PHONE_NUMBER_ID` | WhatsApp › API Setup › Phone number ID |
   | `CHATBOT_WHATSAPP_BOT_ID` | Opcional: id do assistente (por omissão, o chamado «Steevanz») |
   | `CHATBOT_WHATSAPP_ALLOWLIST` | Para os primeiros testes: só o teu número pessoal (351…) |

6. **Webhook**: WhatsApp › Configuração › URL `https://www.steevanz.com/api/chatbot/whatsapp` (ou o URL do
   preview do ramo), o mesmo `WHATSAPP_VERIFY_TOKEN`, e subscrever os campos `messages` e `smb_message_echoes`.
7. **Admin**: `/admin/chatbot` › Steevanz › Definições › canal «API oficial» › «Ligar respostas».
8. **Testar** do telemóvel pessoal (na allowlist): «Têm um exemplo do Menu digital?», «Quanto custa?»,
   «Quero falar com uma pessoa». Depois tirar `CHATBOT_WHATSAPP_ALLOWLIST`.

## Atualizar o conhecimento do bot no Supabase

As respostas do bot Steevanz são geradas do site (`src/lib/chatbot/steevanz.ts`). Depois de mudar o site:
`node scripts/chatbot/steevanz-bot.mjs` (fixtures) e `node scripts/chatbot/steevanz-bot.mjs --apply` (Supabase).
