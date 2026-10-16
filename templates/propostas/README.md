# Propostas e orçamentos Steevanz

Gera, para cada cliente, a apresentação (proposta) e o orçamento a partir de um único ficheiro de dados.

| Ficheiro gerado | O que é |
|---|---|
| `proposta.html` | Apresentação num só ficheiro, para abrir no telemóvel ou no computador |
| `proposta.pdf` | A mesma apresentação, uma página 16:9 por diapositivo |
| `proposta.pptx` | Versão editável em PowerPoint |
| `orcamento.html` | Orçamento num só ficheiro |
| `orcamento.pdf` | Orçamento numa página A4 ao alto, pronto a enviar |

## Primeira vez

Precisa do Node.js 20 ou mais recente e do Microsoft Edge (para os PDF).

```bash
cd templates/propostas
npm install
```

## Nova proposta, passo a passo

1. Copie `proposta.json` para um ficheiro novo, por exemplo `clientes/cafe-central.json`.
2. Mude os valores do cliente:

   | Campo | Para que serve |
   |---|---|
   | `cliente` | Nome que aparece na capa («Para») e no orçamento |
   | `slug` | Nome da pasta de saída |
   | `data` | Data da proposta, no formato `AAAA-MM-DD` |
   | `validadeDias` | Dias de validade (30 por defeito) |
   | `numero` | N.º do orçamento. Em branco, fica um espaço para preencher |
   | `nif`, `morada`, `contacto` | Dados do cliente no orçamento. Em branco, ficam espaços para preencher |
   | `aceitacaoUrl` | Endereço da página de adjudicação online, que dá o QR code e o botão do último diapositivo |
   | `landingPage.preco`, `landingPage.mensal` | Preço da landing page e mensalidade |
   | `menu.mensal` | Mensalidade do menu digital em vídeo |
   | `planoAnual.mesesOferta` | Meses oferecidos no plano anual pago adiantado (2 = «12 meses pelo preço de 10»). Calcula o preço anual, o preço riscado (×12) e a poupança de cada linha e do total |
   | `placas.quantidade` | Número de placas |
   | `placas.precoUnitario`, `placas.precoQuantidade`, `placas.aPartirDe` | Preço normal por placa, preço de quantidade e a partir de quantas placas se aplica |
   | `placasGoogle` | Opcional. Placas Google Reviews: `quantidade`, `precoUnitario` (preço por placa), `precoPack` e `packDe` (preço do pack a partir de N placas) e `logo` (acréscimo por placa com o logótipo). Sem este campo, não aparecem |
   | `placa` | Logótipo do cliente, endereço do menu (QR das placas) e cores das placas: `cor` (placa plana), `corImpressao` (impressão na placa creme), `corRelevoSombra`, `corSecundaria` (ícone «toque»), `creme`, `base` |
   | `exemplos` | Títulos e legendas dos diapositivos de exemplo (opcional; sem este campo usam-se textos genéricos) |

   Subtotais, IVA, totais, o desconto de quantidade, o plano anual (recomendado) e os valores na adjudicação são calculados automaticamente. Todos os preços são sem IVA.

3. Gere tudo:

   ```bash
   npm run tudo -- clientes/cafe-central.json
   ```

   Ou passo a passo:

   ```bash
   node build.js clientes/cafe-central.json        # proposta.html e orcamento.html
   node pdf.js clientes/cafe-central.json          # proposta.pdf e orcamento.pdf
   node build-pptx.js clientes/cafe-central.json   # proposta.pptx
   node verificar-qr.js clientes/cafe-central.json # confirma que o QR abre o endereço certo
   ```

4. Os ficheiros ficam em `saida/<slug>/` (por exemplo `saida/cafe-central/`). Para outra pasta, acrescente `--saida caminho/da/pasta` a cada comando.

Opções úteis:
- `node pdf.js … --so proposta` ou `--so orcamento` exporta só um dos PDF.
- Se o Edge estiver noutro sítio, defina `EDGE_PATH` com o caminho do `msedge.exe`.
- O `pdf.js` usa um perfil temporário próprio do Edge e não fecha janelas do Edge que já estejam abertas.

## O que está em cada ficheiro

| Ficheiro | Conteúdo |
|---|---|
| `proposta.json` | Exemplo (Dolci e Salati) |
| `dados.js` | Lê o ficheiro de dados e calcula os valores |
| `deck.html` | Modelo da apresentação: textos, desenho e marcadores `{{campo}}` |
| `quote.html` | Modelo do orçamento |
| `build.js` | Gera os HTML (imagens e QR codes embutidos) |
| `pdf.js` | Exporta os PDF com o Edge |
| `build-pptx.js` | Gera o PowerPoint |
| `verificar-qr.js` | Lê o QR gerado e confirma o endereço |
| `placa.js` | Desenha as duas placas de mesa (SVG) com o logótipo, o QR do menu e as cores do cliente |
| `assets/` | Capturas de ecrã dos exemplos reais e logótipo |

Para mudar textos comuns a todas as propostas, edite `deck.html` e `build-pptx.js` (o PowerPoint tem os seus próprios textos, iguais aos da apresentação). Para mudar as condições do orçamento, edite `quote.html`.

## Regras de desenho

- Nada de sombras desfocadas, transparências, `filter`, `backdrop-filter`, `mix-blend-mode`, máscaras ou `opacity`: no PDF viram caixas cinzentas no iPhone. Só cores lisas e contornos sólidos.
- Imagens sem canal alfa (o logótipo do cliente é composto sobre o creme da placa pelo `placa.js`).

## Regras de texto

- Nunca escrever «NFC»: dizer «um toque» ou «tecnologia Steevanz».
- «Menu digital», não outros nomes.
- Sem «fidelização»: «sem período mínimo».
- Nada de testemunhos, números ou avaliações inventados.
- Os vídeos e o menu são alojados pela Steevanz: não falar em YouTube.
- A frase da marca é «com os bons modos de antigamente».
