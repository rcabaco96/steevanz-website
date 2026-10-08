# Reservas online

Reservas pelo link do negócio (Google, Instagram, site), sem app e sem conta, para **qualquer tipo de
negócio local**. Tudo gira à volta dos **serviços** que o negócio cria: é o que o cliente escolhe ao
reservar. Custo de funcionamento: zero (emails, sem SMS).

## O modelo

Cada **serviço** tem nome, preço opcional e diz **como se reserva**:

| Como se reserva | Para quê | O que se define |
| --- | --- | --- |
| **Um cliente de cada vez** | Cortes, consultas, tratamentos, campos | Duração, intervalo depois (opcional), quem faz |
| **Várias pessoas à mesma hora** | Mesas de restaurante | Lugares por turno, máximo de pessoas por reserva |

- **Pessoas e espaços** (opcional): barbeiros, médicos, salas, campos. Cada um atende um cliente de
  cada vez e pode ter **horário próprio** (sem ele, segue o horário do espaço). Em cada serviço
  escolhe-se quem o faz; sem escolha, qualquer um.
- **Turnos** (serviços de várias pessoas): são os períodos do horário (ex.: almoço 12:00–15:00,
  jantar 19:00–23:00). Quando as reservas de um turno somam os lugares (ex.: 50), esse turno fica
  cheio. Não há duração de refeição.
- **Tipos de negócio** com serviços já criados (o admin escolhe o tipo, o dono ajusta tudo):

| Tipo | Serviços que já vêm |
| --- | --- |
| Restaurante, café ou bar | Mesa (40 lugares por turno, até 8 por reserva) |
| Barbearia | Corte 30 min · Barba 20 min · Corte e barba 45 min |
| Cabeleireiro ou estética | Corte 45 min · Brushing 30 min · Coloração 90 min · Manicure 45 min |
| Clínica ou consultório | Primeira consulta 45 min · Consulta 30 min · Tratamento 60 min |
| Espaço desportivo | Futebol (1 hora) nos campos 1 e 2 · Ténis (1 hora) no campo de ténis |
| Loja ou outro serviço | Nenhum: cria-se de raiz (ou escolhe-se um exemplo) |

  Um tipo novo de negócio = um valor no enum `business_kind`, a entrada em
  `src/lib/establishments/kinds.ts` (nome, palavras, predefinições) e os serviços em
  `src/lib/modules/bookings/templates.ts`.

## Como fica ativo

1. Conta do cliente e espaço como nos outros produtos. Ao criar o espaço, os serviços do tipo de
   negócio ficam criados. **Um cliente = um negócio** (por agora).
2. Ativa-se **Reservas online** na ficha do cliente (ou aceita-se a encomenda).
3. No separador **Serviços** ajustam-se os serviços (ou começa-se por um exemplo) e, se for preciso,
   as pessoas e espaços.
4. Em **Definições**: ligar as reservas online, horário, regras.
5. Partilha-se o link (`/reservar/<espaco>`) ou o cartaz com QR (separador **Partilhar**).

## Quem faz o quê

### Dono e equipa (`/conta/bookings`, e o separador Reservas de hoje do Balcão)
- **Reservas:** os dias da semana com quantas reservas tem cada um; o dia escolhido com a ocupação de
  cada turno («12 de 50 lugares reservados») e a lista «Por chegar».
  - Cada linha: hora, nome, o que reservou, contacto. «Chegou» à vista; no «⋯»: Não veio, Alterar
    reserva, Cancelar (avisa o cliente por email), Ligar. As tratadas ficam numa lista à parte, com
    «Desfazer».
  - **Nova reserva:** escolhe-se o dia e o serviço (e as pessoas, ou com quem) e aparecem **só as
    horas livres** (sem antecedência mínima). Por telefone podem passar o máximo de pessoas.
  - **Alterar reserva:** hora, pessoas, serviço e contacto, sem mudar o link do cliente.
  - **Estamos com atraso** (só hoje).
- **Serviços:** serviços, pessoas e espaços, horários próprios.
- **Definições:** reservas online ligadas/desligadas; regras para o cliente (antecedência, até
  quantos dias, tolerância de atraso, cancelar até, última reserva de mesas); avisos e mensagens;
  horário, dias fechados e dados do espaço; fechar reservas num dia ou horário.
- **Partilhar:** link, cartaz com QR e o calendário para subscrever no telemóvel.

### Cliente final
- Abre o link: escolhe o serviço (quando há mais de um), depois **quantas pessoas** (mesas) ou
  **com quem** (só os que fazem esse serviço, ou «qualquer um»), o dia e a hora. Mesas: as horas
  aparecem por turno (Almoço, Jantar).
- Confirma com o nome (e email ou telemóvel). Fica com a página da reserva: hora, o que reservou,
  tolerância, aviso de atraso, adicionar ao calendário, trocar a hora ou cancelar até X horas antes.
- Recebe a confirmação por email e um lembrete na véspera.

### Admin
- Escolhe o tipo de negócio do espaço, ativa o produto e faz tudo o que o dono faz.

## Atrasos, nos dois sentidos
- **Tolerância de atraso** (do cliente): passado esse tempo a reserva fica «Atrasado»; a equipa
  decide. Nada é cancelado sozinho.
- **Estamos com atraso** (do espaço): +10/15/30/45 min, para todos ou para uma pessoa ou espaço.
  Os clientes das próximas 3 horas com email recebem a hora prevista (só quando aumenta); todos veem
  o aviso na página da reserva. Nenhuma reserva muda de hora.

## Regras automáticas
- Horas de 15 em 15 minutos dentro do horário. Um de cada vez: o serviço tem de acabar antes de
  fechar e dentro do horário de quem o faz; o intervalo depois fica guardado. Mesas: a última reserva
  é X antes de fechar (definição).
- «Qualquer um» fica com quem tiver menos reservas nesse dia.
- Sem reservas duplicadas nem turnos acima da lotação: a base de dados confirma de forma atómica
  (`establishment_slot_check`, `establishment_book`, `establishment_rebook`).
- Lembrete na véspera (24 h a 2 h antes), pela rotina de 15 em 15 minutos.
- Antiabuso: 10 reservas por rede a cada 10 minutos; campo-armadilha contra bots.

## Onde está o código

| O quê | Onde |
| --- | --- |
| Serviços, pessoas/espaços, horários próprios, verificação atómica | `supabase/migrations/20261009130000_bookings_services.sql` |
| Tipos de negócio novos | `supabase/migrations/20261009140000_business_kinds.sql`, `src/lib/establishments/kinds.ts` |
| Serviços por tipo de negócio | `src/lib/modules/bookings/templates.ts`, `src/lib/establishments/provision.ts` |
| Horas livres (módulo puro, com testes) | `src/lib/modules/bookings/availability.ts` |
| Dados, turnos, agenda | `src/lib/modules/bookings/store.ts` |
| Ações (reservar, alterar, cancelar, definições, atraso, exemplos) | `src/lib/modules/bookings/actions.ts`, `src/lib/establishments/actions.ts` |
| Ecrã do dono | `src/components/modules/bookings/BookingsModule.tsx`, `ServicesView.tsx`, `ServiceKindFields.tsx` |
| Páginas públicas | `src/app/(publico)/reservar/[slug]/`, `src/components/public/bookings/BookingWizard.tsx` |
| Testes | `tests/modules.test.mjs` |

## Limitações atuais
- Sem SMS nem WhatsApp: confirmação, lembrete e atraso por email.
- Sem pagamentos nem sinal.
- Sem aulas com vagas a horas fixas, nem serviços que precisem de duas pessoas ao mesmo tempo.
