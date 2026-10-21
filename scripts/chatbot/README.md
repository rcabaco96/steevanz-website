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

## Ligar o número de teste (open-wa, só testes)

O open-wa é **só para testes** no número de teste da Steevanz; os clientes vão usar a API oficial.
Siga o passo a passo e as regras de segurança em `docs/chatbot/PILOTO.md`. Em resumo:

```
cd scripts/chatbot && npm install && cd ../..
node scripts/chatbot/runner.mjs --bot <id>           # só ouve (por omissão): não envia nada
node scripts/chatbot/runner.mjs --bot <id> --reply   # responde só aos números de CHATBOT_ALLOWLIST
```

Com `--reply` exige `CHATBOT_TEST_NUMBER` e `CHATBOT_ALLOWLIST` no `.env.local`, desliga-se se o
número emparelhado não for o de teste, e tem no máximo 10 respostas por hora e 50 por dia. Para
parar: «Desligar respostas» no admin, `Ctrl+C`, ou um ficheiro `PAUSE` na pasta da sessão.

Opções: `--visible` (mostra a janela do Chrome, para diagnosticar). Variáveis: `CHROME_PATH`,
`CHATBOT_DATA_DIR` (pasta das sessões; por omissão `~/.steevanz-chatbot`), `CHATBOT_SITE_URL`.

## O que faz

- Lê o assistente e o conhecimento (respostas do negócio, documentos, horário/serviços do espaço,
  pratos do menu em vídeo) e volta a ler a cada 15 s (alterações no admin entram sem reiniciar).
- Responde só a quem escreve e está na lista; nunca a grupos; nunca a mensagens com mais de 15 min
  (depois de reconectar); ritmo do piloto (`pilotPacing` em `src/lib/chatbot/pacing.ts`).
- O dono responder pelo telemóvel pausa o assistente nessa conversa; a conversa aparece em
  «Conversas» no admin, com o resumo, para «Devolver ao assistente».
- Escreve o estado da sessão (QR, ligado, erro) em `chatbot_sessions` a cada 30 s.
- Uma vez por dia apaga as mensagens mais antigas que o prazo do assistente (`chatbot_prune`).
- Um processo por assistente neste computador (ficheiro `runner.lock` na pasta da sessão).

A versão do open-wa (5.6.6) está fixada em `package.json`. A v5 é recente: no primeiro emparelhamento,
confirme que o QR aparece no admin e que as respostas do dono pelo telemóvel pausam o assistente
(ver comentários em `adapters/open-wa.mjs`).
