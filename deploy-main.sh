#!/bin/bash
# Deploy seguro do Vite para GitHub Pages no branch main
# Uso: ./deploy-main.sh

set -e

# 1. Gera o build
npm run build
cp src/react-app/gh-pages-404.html dist/404.html || true
[ -f dist/.nojekyll ] || touch dist/.nojekyll

# 2. Adiciona build ao git (forçando dist/)
git add -f dist/

# 3. Commita (se houver mudanças)
git diff --cached --quiet dist/ || git commit -m "deploy: publica build do Vite no main para GitHub Pages"

# 4. Faz push para o main
git push origin main

echo "\nDeploy concluído! Verifique o GitHub Pages após alguns minutos."
