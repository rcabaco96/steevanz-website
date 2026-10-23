# Prospetor Steevanz

Faz as pesquisas de **Contactos › Encontrar clientes** do admin: negócios do Google Maps por tipo e zona
(«barbearias» em «Porto»), com telefone, email do site, nota e reviews. O site só põe as pesquisas
na fila (`prospect_searches`); este programa, no computador do escritório, faz a pesquisa com o
scraper open source [gosom/google-maps-scraper](https://github.com/gosom/google-maps-scraper) e
grava os negócios em `prospects`.

## Arrancar

1. Instalar o [Docker Desktop](https://www.docker.com/products/docker-desktop/) e abri-lo.
2. Ligar o scraper (fica só neste computador, em `127.0.0.1:8080`, sem password):

   ```
   docker compose -f scripts/prospector/docker-compose.yml up -d
   ```

3. Ligar o prospetor (precisa do `.env.local` com `NEXT_PUBLIC_SUPABASE_URL` e
   `SUPABASE_SERVICE_ROLE_KEY`):

   ```
   npm run prospector
   ```

As pesquisas pedidas com o computador desligado ficam na fila e correm quando o prospetor arrancar.

Entre pesquisas, o prospetor abre o site de cada negócio ainda por ver (uma página, sem custos) e põe
a situação no CRM: sem site próprio, em baixo ou partido (não abre, erro, domínio estacionado,
página do servidor), desatualizado (sem HTTPS, WordPress ou jQuery antigos, sem versão para
telemóvel, rodapé com um ano antigo) ou em ordem. «Parece feito com IA» só é posto aqui quando o
site o diz (feito com Lovable); de resto marca-se à mão no CRM. Uma situação mudada à mão nunca é
apagada pelo prospetor.

## Regras

- No máximo 20 pesquisas por dia (o admin recusa as seguintes) e um browser de cada vez (`-c 1`),
  para o Google não bloquear o IP. **De preferência noutro computador ou IP do que o leitor de
  reviews**: um bloqueio num não deve parar o outro.
- Negócios já guardados não são duplicados: ficam com os dados novos e mantêm o estado e as notas.
- Só dados públicos de empresas. Contactar pelo telefone ou email da empresa; nada de envios em massa.
- Usar scraping no Google Maps vai contra os termos do Google: usar com moderação.

## Variáveis opcionais

| Variável            | Para quê                                                       |
| ------------------- | -------------------------------------------------------------- |
| `GMAPS_SCRAPER_URL` | Onde está o scraper (por omissão `http://127.0.0.1:8080`).      |
