# Balcão

Página da área de cliente (backoffice) com **tudo o que precisa de um toque durante o serviço, por
espaço**: a fila, as reservas de hoje e o cartão de cliente, em separadores. Mesmo layout e cores
Steevanz do resto do backoffice. Definições, histórico e estatísticas ficam em cada módulo.

## Onde está

- Cliente: **Balcão** no menu da área de cliente (`/conta/balcao`; só aparece a quem tem a fila, as
  reservas ou o cartão), o cartão no topo de «Os meus produtos» e o botão **Abrir o Balcão** em cada
  módulo.
- Admin: **Abrir Balcão** em cada espaço na ficha do cliente (`/admin/clientes/<id>/balcao`).
- Ler o QR do cartão de um cliente com a câmara do aparelho do balcão abre o Balcão nesse cartão.

## Como está feito

- Separadores **só para os produtos desse espaço**, por esta ordem: **Fila**, **Reservas de hoje**,
  **Cartão**, com contadores ao vivo (pessoas à espera, reservas por chegar), e um atalho
  «Definições e histórico» para o módulo do separador aberto.
- O botão principal de cada separador é grande; as exceções ficam no «⋯» de cada linha.
- Atualiza-se sozinho: de 8 em 8 s quando o espaço tem a fila (também para o som de novas entradas,
  em qualquer separador), de 30 em 30 s só com reservas.

| Separador | O que tem | Detalhe |
| --- | --- | --- |
| Fila | «Chamar o seguinte», quem está a ser chamado, à espera, estado da fila | `lista-de-espera.md` |
| Reservas | A seguir (Chegou / Não veio), por chegar, atrasados, «Estamos com atraso», nova reserva | `reservas-online.md` |
| Cartão | Pesquisa, Dar carimbo, Entregar recompensa, QR do cartão | `cartao-de-fidelizacao.md` |

Usa as mesmas ações do servidor dos módulos (mesmas regras, permissões e testes).

## Dados de demonstração

Negócios de exemplo: Tasca do Largo (restaurante), Navalha d'Ouro (barbearia) e, criados por
`scripts/demo-businesses.mjs`, Clínica Sorriso (clínica) e Arena Desportiva (campos). Para os criar:

```
node --env-file=.env.local scripts/demo-businesses.mjs
```

Para mostrar o Balcão a um cliente com tudo a acontecer (só nos espaços de exemplo):

```
node --env-file=.env.local scripts/demo-balcao.mjs                 # lista os espaços
node --env-file=.env.local scripts/demo-balcao.mjs tasca-do-largo  # enche um ou mais espaços
```

- Fila aberta com 4 atendidos, 1 a ser chamado e 5 à espera (com tempos realistas).
- Reservas de hoje à volta da hora atual (2 já chegaram, 1 atrasada, o resto por chegar) e 5 amanhã.
- 6 cartões com carimbos, um deles com recompensa por entregar.

Correr outra vez antes de cada demonstração: a fila recomeça (as senhas de demonstração anteriores
fecham como atendidas); reservas de hoje e cartões só são acrescentados uma vez. Não apaga nada.

## Onde está o código

| O quê | Onde |
| --- | --- |
| Páginas | `src/app/conta/(area)/balcao/`, `src/app/admin/(panel)/clientes/[id]/balcao/` |
| Ecrã e separadores | `src/components/modules/counter/` |
| Acesso e produtos por espaço | `src/lib/establishments/counter.ts` |
| Dados de demonstração | `scripts/demo-balcao.mjs` |
