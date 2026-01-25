#!/bin/bash
# Deploy seguro: publica build do Vite na raiz do main para GitHub Pages
# Uso: ./deploy-main-root.sh

set -e

# 1. Gera o build
npm run build
cp src/react-app/gh-pages-404.html dist/404.html || true
[ -f dist/.nojekyll ] || touch dist/.nojekyll


# 2. Copia o conteúdo de dist/ para a raiz do projeto
cp -r dist/* .
cp dist/index.html ./index.html
cp CNAME dist/CNAME || true

# 3. Adiciona arquivos do build ao git
# (adiciona index.html, assets/, 404.html, .nojekyll, CNAME)
git add -f index.html 404.html .nojekyll assets/ CNAME

# 4. Commita se houver mudanças
git diff --cached --quiet || git commit -m "deploy: publica build do Vite na raiz do main para GitHub Pages"

# 5. Faz push para o main
git push origin main

echo "\nDeploy concluído! Verifique o GitHub Pages após alguns minutos."
