#!/bin/bash
# Copia favicons e apple-touch-icons para a pasta de build (dist)

set -e

SRC_DIR="$(dirname "$0")/.."
DIST_DIR="$SRC_DIR/dist"

# Lista de arquivos essenciais
FILES=(
  "favicon.ico"
  "genfavicon-32.png"
  "genfavicon-16.png"
  "apple-touch-icon-57x57.png"
  "apple-touch-icon-114x114.png"
  "apple-touch-icon-120x120.png"
  "apple-touch-icon-180x180.png"
  "site.webmanifest"
)

mkdir -p "$DIST_DIR"

for file in "${FILES[@]}"; do
  if [ -f "$SRC_DIR/$file" ]; then
    cp "$SRC_DIR/$file" "$DIST_DIR/"
    echo "Copiado: $file"
  else
    echo "Aviso: $file não encontrado no diretório raiz."
  fi
done

echo "Favicons e manifest copiados para $DIST_DIR."
