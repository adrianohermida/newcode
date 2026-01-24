
# Cloudflare Worker Template

Um template moderno para aplicações full-stack com Cloudflare Workers, React, Tailwind CSS, Hono, Supabase e D1.

## Tech Stack

- **Cloudflare Workers** - Backend serverless
- **React** - Frontend SPA (HashRouter para GitHub Pages)
- **Tailwind CSS** - CSS utilitário
- **Hono** - Framework web para Workers
- **Cloudflare D1** - Banco SQL serverless
- **Supabase** - Backend as a Service

## Variáveis de Ambiente (exemplo .env)

```
API_KEY=xxxx
USER_ID=xxxx
PROJECT_ID=xxxx
USER_EMAIL=xxxx
AUTH_KEY=xxxx
ADMIN_EMAILS=xxxx
STRIPE_SECRET_KEY=xxxx
STRIPE_CONNECT_ACCOUNT_ID=xxxx
SUPABASE_URL=xxxx
SUPABASE_KEY=xxxx
```

## Consumo de API (exemplo fetch no frontend)

```js
// Exemplo: buscar dados do backend Worker
fetch('https://<worker-url>/api/endpoint')
	.then(res => res.json())
	.then(data => console.log(data));
```

## Deploy

- O frontend é publicado automaticamente no GitHub Pages (branch gh-pages)
- O backend (Worker) é publicado via Wrangler na Cloudflare

## Observações

- Nunca exponha chaves sensíveis no frontend
- Use HashRouter para navegação SPA no GitHub Pages

