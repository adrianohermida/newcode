# Contribuição — Hermida Maia Advocacia

## Estrutura de Pastas
## Estrutura de Pastas

- `src/react-app/pages/` — Páginas principais (1 arquivo por rota)
- `src/react-app/components/` — Componentes reutilizáveis
- `src/react-app/assets/` — Imagens e arquivos estáticos
- `src/react-app/utils/` — Funções utilitárias e clients (ex: supabaseClient)
- `shared/` — Schemas, configs e serviços compartilhados

## Convenções de Código
## Convenções de Código

- Use nomes descritivos e camelCase para arquivos JS/TS, PascalCase para componentes React.
- Exporte componentes como default quando possível.
- Prefira funções puras e componentes funcionais.
- Use ESLint e Prettier antes de cada commit (hooks automáticos).

## Pull Requests
- Crie branches a partir de `main` usando o padrão `feature/nome`, `fix/nome` ou `chore/nome`.
- Descreva claramente o objetivo do PR e relacione issues/tarefas.
- Solicite revisão de pelo menos 1 membro do time.
- Não faça merge de PRs com falha em lint, build ou testes.

## Boas Práticas
- Nunca exponha secrets no front-end.
- Prefira assets locais ou Supabase Storage para imagens.
- Documente funções e componentes complexos.
- Atualize o README se alterar fluxo de build/deploy ou onboarding.

## Testes e CI
- Adicione testes unitários para funções e componentes críticos.
- O pipeline CI/CD deve rodar lint, build e testes antes do deploy.

---

Dúvidas? Abra uma issue ou consulte o README.
