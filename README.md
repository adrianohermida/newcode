

# Projeto Hermida Maia Advocacia

SPA moderna com React, Vite, Tailwind CSS e Supabase (banco, auth, storage), publicada no GitHub Pages.


## Tech Stack

- **React + Vite** — Front-end SPA
- **Tailwind CSS** — CSS utilitário
- **Supabase** — Backend as a Service (banco, auth, storage)
- **GitHub Pages** — Deploy estático


## Variáveis de Ambiente (.env.example)

```
VITE_SUPABASE_URL=https://<your-project>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key>
# Outras variáveis públicas do Vite podem ser adicionadas aqui
```



## Integração com Supabase

- Use o client centralizado em `src/react-app/utils/supabaseClient.ts` para queries, auth e storage.
- Nunca exponha chaves secretas (service_role) no front-end.
- Para assets, use imagens locais em `src/react-app/assets` ou URLs públicas do Supabase Storage.


## Como rodar e publicar

1. Copie `.env.example` para `.env` e preencha com as credenciais públicas do Supabase:
	```sh
	cp .env.example .env
	# Edite .env conforme necessário
	```
2. Instale as dependências:
	```sh
	npm install
	```
3. Rode localmente:
	```sh
	npm run dev
	```
4. Faça o build para produção:
	```sh
	npm run build
	```
5. Publique no GitHub Pages:
	```sh
	npm run deploy
	```
O deploy será feito na branch `gh-pages` e estará disponível em `https://<usuario>.github.io/newcode/`


## Observações

- Nunca exponha chaves sensíveis no frontend
- Use HashRouter para navegação SPA no GitHub Pages
- Para colaboração, siga as convenções de código, mantenha dependências atualizadas e utilize PRs para revisão.

