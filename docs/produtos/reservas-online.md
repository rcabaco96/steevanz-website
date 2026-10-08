# Reservas online

Reservas e marcações pelo link do negócio (Google, Instagram, site), sem app e sem conta. Há **dois
modelos**, escolhidos sozinhos pelo tipo de negócio do espaço:

| Tipo de negócio | Modelo | O cliente escolhe |
| --- | --- | --- |
| Restaurante, café | **Mesas** | Nº de pessoas, dia e hora (almoço / jantar) |
| Barbearia, cabeleireiro, clínica, estética, loja… | **Marcações** | Serviço, profissional («Qualquer um» primeiro), dia e hora (manhã / tarde / noite) |

Custo de funcionamento: zero (emails, sem SMS).

## Como fica ativo

1. Conta do cliente e espaço como nos outros produtos (o espaço é criado sozinho; edita-se em
   **Editar espaço**).
2. Ativa-se **Reservas online** na ficha do cliente (ou aceita-se a encomenda). **Preço por
   espaço**, como os outros dois módulos.
3. Em **Definições**: horário do espaço e, nas marcações, serviços (duração, intervalo, preço) e
   profissionais.
4. Partilha-se o link (`/reservar/<espaco>`) ou o botão para o site (separador **Link e botão**).

## Quem faz o quê

### Dono e equipa: o Balcão (`/conta/balcao`, separador **Reservas**)
Só o dia de hoje, para usar ao balcão:
- **A seguir**: a hora em grande, o nome, o que reservou e o telefone, com **Chegou** e **Não veio**.
- **Por chegar**: o resto do dia por ordem. As que passaram a tolerância ficam a vermelho
  («Atrasado»).
- **Estamos com atraso?** (ver abaixo).
- **Nova reserva** por telefone ou ao balcão.
- **Hoje já tratadas**: as que chegaram, não vieram ou foram canceladas (com «Repor»).

### Dono: o módulo (`/conta/bookings`)
- **Agenda** de qualquer dia: mesas agrupadas por almoço e jantar com a ocupação máxima ao mesmo
  tempo; marcações agrupadas por profissional. Chegou, Não compareceu, Cancelar (com aviso por email).
- **Fechar as reservas num horário** (bloqueios: um evento, uma folga de um profissional).
- **Próximas**: as reservas dos próximos 14 dias.
- **Estatísticas**.
- **Definições** simples (listas, sem números soltos).
- **Link e botão**: link, cartaz e código para o site; calendário para subscrever (Google, Apple).

### Cliente final
- Abre o link, escolhe e confirma com nome (email recomendado, telefone e notas opcionais).
- Fica com a página da reserva (`/reservar/<espaco>/<token>`): hora, dia, o que reservou, a
  **tolerância de atraso**, o aviso «Estamos com atraso» quando existe, adicionar ao calendário,
  **trocar a hora** ou **cancelar** (até X horas antes).
- Recebe a confirmação por email (com a tolerância) e um lembrete na véspera.

### Admin (Steevanz)
- Ativa, suspende, cancela ou remove o produto e define os espaços, na ficha do cliente.
- Abre o módulo ou o Balcão de cada espaço e faz tudo o que o dono faz.

## Atrasos, nos dois sentidos

- **Tolerância de atraso** (do cliente): quanto tempo se guarda a mesa / se espera pelo cliente (0 a
  30 min, por omissão 10). Aparece ao reservar, na página da reserva e no email. Passado esse tempo,
  a reserva fica «Atrasado» no Balcão e na agenda; a equipa decide (Chegou ou Não veio). Nada é
  cancelado sozinho.
- **«Estamos com atraso»** (do espaço): no Balcão ou na agenda de hoje, para o espaço todo ou para um
  profissional: +10, +15, +30 ou +45 min. Nenhuma reserva muda de hora.
  - Os clientes com reserva nas **próximas 3 horas** e com email recebem um email com a hora prevista
    (só quando o atraso aumenta, a partir de 10 min; nunca dois emails para o mesmo atraso).
  - Todos os clientes de hoje veem o aviso e a hora prevista na página da reserva.
  - Vale só para esse dia.
- **Porque não há «cascata»** de atrasos nas marcações: cada serviço tem a sua duração e um intervalo
  opcional entre marcações (folga), a tolerância limita quanto um cliente atrasado pode empurrar, e o
  aviso «Estamos com atraso» trata dos dias maus.

## Definições (por espaço)

| Definição | Para quê | Por omissão |
| --- | --- | --- |
| Reservas online ativas | Liga / desliga o link | desligado até configurar |
| Lugares (mesas) | Máximo de pessoas sentadas ao mesmo tempo | 20 |
| Duração de uma refeição (mesas) | Quanto tempo a mesa fica ocupada | 90 min |
| Máximo de pessoas por reserva (mesas) | Grupos maiores ligam | 8 |
| Antecedência mínima | Até quando se pode reservar | 1 hora |
| Até quantos dias | Quanto para a frente | 60 dias |
| Tolerância de atraso | Ver acima | 10 min |
| Alterar ou cancelar até | Antes da hora | 2 horas |
| Avisar o dono por email | Cada reserva nova | sim |
| Política, nota da confirmação | Textos opcionais | vazio |

## Regras automáticas

- **Horas de 15 em 15 minutos**, dentro do horário do espaço (vários intervalos por dia: almoço e
  jantar).
- **Mesas:** a última mesa é 60 minutos antes de fechar. Uma hora está livre se, durante toda a
  refeição, as pessoas sentadas ao mesmo tempo (pico) mais o novo grupo não passarem os lugares.
- **Marcações:** o serviço tem de acabar antes do fecho; o profissional fica ocupado a duração mais
  o intervalo. «Qualquer um» dá a marcação ao profissional livre com menos marcações nesse dia.
- **Sem reservas duplicadas:** a escolha final é feita na base de dados, com bloqueio
  (`establishment_book`); se alguém reservou a mesma hora um segundo antes, o cliente escolhe outra.
- **Lembrete** na véspera (entre 24 h e 2 h antes), pela rotina de 15 em 15 minutos.
- **Antiabuso:** 10 reservas por rede a cada 10 minutos; campo-armadilha contra bots.

## Onde está o código

| O quê | Onde |
| --- | --- |
| Tabelas, reserva atómica | `supabase/migrations/20261007120000_establishments_modules.sql`, `20261008150000_bookings_simple.sql` |
| Tolerância e atrasos | `supabase/migrations/20261008160000_booking_delays.sql` |
| Disponibilidade (módulo puro, com testes) | `src/lib/modules/bookings/availability.ts` |
| Dados, modelo por tipo de negócio, atrasos | `src/lib/modules/bookings/store.ts` |
| Ações (reservar, trocar, cancelar, balcão, definições, atraso) | `src/lib/modules/bookings/actions.ts` |
| Emails (confirmação, cancelamento, lembrete, atraso) | `src/lib/modules/bookings/notify.ts` |
| Balcão (separador Reservas) | `src/components/modules/counter/BookingsCounter.tsx` |
| Módulo do dono / admin | `src/components/modules/bookings/BookingsModule.tsx` |
| Páginas públicas | `src/app/(publico)/reservar/[slug]/` (reservar, a sua reserva, .ics) |
| Assistente de reserva | `src/components/public/bookings/BookingWizard.tsx` |
| Testes | `tests/modules.test.mjs` |

Tabelas: `booking_pages` (uma por espaço), `establishment_bookings` (estados `confirmed`, `arrived`,
`no_show`, `cancelled`), `booking_blocks` e `booking_delays` (um por espaço ou profissional, por dia).

## Limitações atuais

- Sem SMS nem WhatsApp: confirmação, lembrete e atraso vão por email.
- Sem pagamentos nem sinal no momento da reserva.
- Ainda não há um terceiro modelo para aulas / sessões de grupo (várias pessoas na mesma vaga).
