# Cartão de fidelização (carimbos)

Cartão de carimbos digital para cafés, restaurantes e barbearias. O cliente cria o cartão no
telemóvel lendo um QR ao balcão; a cada visita recebe um carimbo e, ao completar o cartão, ganha a
recompensa. Sem app e sem conta. Custo de funcionamento: zero.

## Como fica ativo

1. O negócio entra pelo `/admin/reviews` (o leitor importa as reviews). Ainda sem conta.
2. Quando fechamos negócio, juntamos o email do dono ao negócio: a conta é criada sem password e sem
   enviar nada. Sem reviews, cria-se em **Admin → Clientes → Novo cliente**.
3. Na ficha do cliente ativa-se o produto **Cartão de fidelização** (ou aceita-se a encomenda).
4. O **espaço** (o restaurante, café ou barbearia) é criado sozinho com o nome do negócio. Edita-se
   em **Editar espaço**.
5. **Um cliente = um negócio** (por agora): o produto funciona no espaço do cliente. A base de dados
   aceita vários espaços, para quando for preciso.
6. Define-se o **PIN de carimbo** (Definições) e imprime-se o cartaz com o QR (separador
   **Cartaz e link**).

## Quem faz o quê

### Admin (Steevanz)
- Ativa, suspende, cancela ou remove o produto, na ficha do cliente.
- Abre o módulo ou o **Balcão** de cada espaço e faz tudo o que o dono faz (configurar, dar apoio).
- Define as regras e o PIN de carimbo e imprime o cartaz.

### Dono e equipa: o Balcão (`/conta/balcao`, separador **Cartão**)
- Uma caixa de pesquisa grande (nome, telemóvel ou código do cartão) e os últimos clientes com
  carimbo, com os carimbos à vista.
- Com um só resultado, abre o cartão em grande: carimbos, o que falta para a recompensa e os botões
  **Dar carimbo** e **Entregar recompensa** (quando há).
- Ler o QR do cartão do cliente com a câmara do aparelho do balcão abre o Balcão já nesse cartão.
- Retirar um carimbo e Mostrar QR do cartão ficam em botões discretos.

### Dono do estabelecimento (área de cliente, `/conta/loyalty`)
- **Dá carimbos** de duas formas:
  - **No telemóvel do cliente:** o funcionário escreve o PIN de carimbo (6 algarismos). Não precisa
    de nenhum aparelho.
  - **No Balcão ou no módulo** (separador **Carimbar**): lê o QR do cartão com a câmara do telemóvel
    ou tablet do estabelecimento (abre o cartão no Balcão), ou procura pelo código do cartão
    (ex.: `K7P 29Q`), nome, email ou telemóvel, e carrega em **Dar carimbo**.
- **Entrega a recompensa**: PIN no telemóvel do cliente ou **Entregar recompensa** no backoffice.
- **Retira um carimbo** dado por engano.
- **Passa os carimbos do cartão de papel** antigo para o digital (sem tempo mínimo).
- **Mostrar QR do cartão**: para quem mudou de telemóvel; o cliente lê o QR e o cartão volta a abrir.
- **Apaga um cartão** a pedido do cliente (proteção de dados), com todo o histórico.
- **Clientes**: os 100 cartões mais recentes, com carimbos, recompensas e última visita.
- **Estatísticas** dos últimos 30 dias: cartões novos, carimbos, clientes que voltaram (2+ carimbos)
  e recompensas ganhas / entregues.

### Cliente final (quem vai ao estabelecimento)
- Lê o QR ou toca na placa NFC ao balcão (`/cartao/<espaco>`).
- Cria o cartão **só com o nome**:
  - Email recomendado: recebe o link do cartão e é assim que o recupera sozinho.
  - Telemóvel opcional: se vier sem telemóvel, diz o número ao balcão e recebe o carimbo na mesma.
- Fica com o cartão no telemóvel (`/cartao/<espaco>/<token>`): cores Steevanz, nome do estabelecimento, carimbos,
  recompensa, código do cartão e o QR para o funcionário ler.
- Pode adicioná-lo ao ecrã principal (cada cartão tem o seu manifest, abre como uma app).
- O cartão atualiza-se sozinho (de 10 em 10 s) quando o funcionário carimba pelo backoffice.
- Se voltar a ler o QR do balcão no mesmo telemóvel, aparece **Abrir o meu cartão**.
- Mudou de telemóvel: **Já tinha cartão?** (envia o link por email) ou pede ao balcão o QR do cartão.

## Definições (por espaço)

| Definição | Para quê | Por omissão |
| --- | --- | --- |
| Carimbos para completar | 2 a 50 | 10 |
| Recompensa | Texto (ex.: "Um café oferecido") | sugerida pelo tipo de negócio |
| Tempo mínimo entre carimbos | Antifraude: um carimbo por visita | 120 min |
| Validade da recompensa | Em dias; vazio = sem validade | sem validade |
| Primeiro carimbo na adesão | Oferece 1 carimbo ao criar o cartão | sim |
| Cartão ativo | Em pausa: sem novas adesões nem carimbos | ativo |
| Texto de consentimento | Mostrado ao criar o cartão | texto padrão com o nome do espaço |
| PIN de carimbo | 6 algarismos, muda-se a qualquer momento | por definir |

## Regras automáticas

- **Ao completar o cartão** ganha a recompensa e o cartão recomeça do zero (os carimbos a mais
  passam para o novo). Feito de forma atómica na base de dados (`loyalty_stamp`).
- **Um carimbo por visita**: dentro do tempo mínimo, o carimbo é recusado (diz a partir de que hora
  pode ser dado). O carimbo de boas-vindas conta como o da primeira visita.
- **PIN**:
  - Guardado só como hash com sal: nem a Steevanz o consegue ver.
  - Recusa PIN óbvios (todos iguais ou seguidos).
  - 5 PIN errados no mesmo cartão bloqueiam-no 15 minutos.
- **Antiabuso por rede**: 20 adesões / 10 min, 30 carimbos ou entregas com PIN / 10 min,
  5 recuperações por email / 30 min; campo-armadilha contra bots.
- **O QR do cartão só leva o código do cartão** (não é segredo): carimbar por aí exige a sessão do
  dono ou do admin (`/conta/carimbar`, que abre o Balcão nesse cartão). Sem sessão, pede para entrar
  primeiro.
- **Recuperação por email** responde sempre o mesmo, exista ou não cartão com esse email.
- **Palavras e recompensa sugerida** adaptam-se ao negócio (café oferecido, corte oferecido…).

## Onde está o código

| O quê | Onde |
| --- | --- |
| Tabelas e função atómica de carimbo (`loyalty_stamp`) | `supabase/migrations/20261007120000_establishments_modules.sql` |
| Ações (criar, carimbar, entregar, recuperar, painel, definições, PIN) | `src/lib/modules/loyalty/actions.ts` |
| Leitura de dados, PIN, pesquisa, estatísticas | `src/lib/modules/loyalty/store.ts` |
| Regras puras (código do cartão, PIN, bloqueio; com testes) | `src/lib/modules/loyalty/rules.ts` |
| Balcão (separador Cartão) | `src/components/modules/counter/CardCounter.tsx` |
| Módulo do dono / admin | `src/components/modules/loyalty/LoyaltyModule.tsx` |
| Páginas públicas | `src/app/(publico)/cartao/[slug]/` (adesão, cartão, manifest) |
| Leitura do QR pelo funcionário | `src/app/conta/carimbar/route.ts` |
| Componentes públicos (cartão, formulários) | `src/components/public/loyalty/` |
| Espaços (criação automática) | `src/lib/establishments/provision.ts` |
| Testes | `tests/modules.test.mjs` |

Tabelas: `loyalty_programs` (uma por espaço), `loyalty_cards`, `loyalty_rewards` e
`loyalty_events` (histórico: adesão, carimbo, ajuste, recompensa ganha / entregue). Tudo passa pelo
servidor com a chave de serviço; as páginas públicas só chegam ao cartão pelo token.

## Limitações atuais

- Ainda não há cartão na Apple Wallet nem na Google Wallet: o cartão é uma página no telemóvel.
  (A página de ajuda em `src/content/docs/loyalty.ts` ainda fala da Wallet: corrigir.)
- Sem SMS nem WhatsApp: o link do cartão vai por email.
- Sem email, o cartão depende do telemóvel onde foi criado (ou do QR mostrado ao balcão).
- Os cartões não são apagados automaticamente, só a pedido do cliente.
