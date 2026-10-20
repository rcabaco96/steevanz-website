# Assistente WhatsApp Steevanz (programa local)

Programa que mantém aberta a sessão de WhatsApp de um negócio e responde aos clientes com o motor de
`src/lib/chatbot`. Arranca **só à mão** (nunca pelo site, nunca sozinho). Não custa nada: as respostas
vêm do conhecimento do negócio (mock grátis), sem IA paga. Antes de usar com um número real, leia
`docs/chatbot/ARCHITECTURE.md` (riscos do open-wa: o número pode ser bloqueado pelo WhatsApp).

## Experimentar sem WhatsApp (simulador)

Não precisa de nada instalado além do projeto. Nada sai do computador.

```
node scripts/chatbot/simulate.mjs                      # restaurante de exemplo
node scripts/chatbot/simulate.mjs --demo alojamento    # alojamento de exemplo (2 casas)
node scripts/chatbot/simulate.mjs --script "Olá|A que horas abrem?|Quero falar com alguém"
node scripts/chatbot/simulate.mjs --bot <id>           # conhecimento real (só leitura do Supabase)
```

No modo interativo: `/dono <texto>` (o dono responde pelo telemóvel), `/devolver`, `/novo`,
`/estado`, `/sair`. O mesmo existe no admin, em `/admin/chatbot` › «Experimentar».

## Ligar um número real (open-wa)

Precisa de: a migração `20261020200000_chatbot.sql` aplicada, o assistente criado em `/admin/chatbot`,
o `.env.local` com `NEXT_PUBLIC_SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY`, e o Chrome ou o Edge.

1. Instalar o open-wa **só nesta pasta** (não vai para o site nem para a Vercel):
   ```
   cd scripts/chatbot
   npm install
   ```
2. Testar a ligação sem responder a ninguém:
   ```
   node scripts/chatbot/runner.mjs --bot <id> --listen-only
   ```
   O QR aparece no terminal e em `/admin/chatbot/<id>`. No telemóvel do negócio: WhatsApp ›
   Dispositivos ligados › Ligar um dispositivo.
3. Com o conhecimento testado e as respostas ligadas no admin:
   ```
   node scripts/chatbot/runner.mjs --bot <id>
   ```
   `Ctrl+C` desliga (o admin passa a mostrar «Desligado»).

Opções: `--visible` (mostra a janela do Chrome, para diagnosticar). Variáveis: `CHROME_PATH`,
`CHATBOT_DATA_DIR` (pasta das sessões; por omissão `~/.steevanz-chatbot`), `CHATBOT_SITE_URL`,
`OPENWA_LICENSE_KEY` (só se um dia for comprada uma chave do open-wa).

## O que faz

- Lê o assistente e o conhecimento (respostas do negócio + horário/serviços do espaço + pratos do menu
  em vídeo) e volta a ler a cada minuto (alterações no admin entram sem reiniciar).
- Responde só a quem escreve; nunca a grupos; nunca a mensagens com mais de 15 min (depois de
  reconectar); ritmo humano e tetos por minuto/dia (`src/lib/chatbot/pacing.ts`).
- O dono responder pelo telemóvel pausa o assistente nessa conversa; a conversa aparece em
  «Conversas» no admin, com o resumo, para «Devolver ao assistente».
- Escreve o estado da sessão (QR, ligado, erro) em `chatbot_sessions` a cada 30 s.
- Uma vez por dia apaga as mensagens mais antigas que o prazo do assistente (`chatbot_prune`).
- Um processo por assistente neste computador (ficheiro `runner.lock` na pasta da sessão).

A versão do open-wa (5.6.6) está fixada em `package.json`. A v5 é recente: no primeiro emparelhamento,
confirme que o QR aparece no admin e que as respostas do dono pelo telemóvel pausam o assistente
(ver comentários em `adapters/open-wa.mjs`).
